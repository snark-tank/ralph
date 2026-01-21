/**
 * Smart Distribution Timing System
 *
 * Implements intelligent distribution timing based on:
 * 1. Solana network priority fees (via Helius API)
 * 2. Current USD1 balance vs dynamic threshold
 * 3. Time-based patterns (optimal distribution windows)
 * 4. Holder count-adjusted thresholds
 *
 * Usage:
 *   npx ts-node smart-timing.ts --check         # Check if conditions are met
 *   npx ts-node smart-timing.ts --status        # Show current network/system status
 *   npx ts-node smart-timing.ts --history       # Show decision history
 *   npx ts-node smart-timing.ts --json          # JSON output for API
 */

import {
    Connection,
    PublicKey,
    Keypair
} from '@solana/web3.js';
import {
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    getAccount
} from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6';
const HELIUS_API_KEY = 'd009b341-8551-40fa-aa5e-bae4ce0c8cf6';
const USD1_TOKEN_MINT = new PublicKey('USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB');
const KEYPAIR_PATH = path.join(__dirname, 'keypair_distro.json');
const TIMING_DATA_FILE = path.join(__dirname, 'smart-timing-data.json');
const DISTRIBUTION_HISTORY_FILE = path.join(__dirname, '..', 'src', 'token-distribution-history.json');

// Smart timing thresholds
interface TimingConfig {
    // Base threshold settings
    baseMinThreshold: number;          // Base minimum USD1 to distribute (default: 10)
    maxWaitThreshold: number;          // Maximum threshold to force distribution (default: 100)

    // Priority fee thresholds (in micro-lamports per compute unit)
    lowFeeThreshold: number;           // Below this = cheap network (default: 1000)
    highFeeThreshold: number;          // Above this = expensive network (default: 50000)

    // Holder count scaling
    holderScaleFactor: number;         // Additional $ per 100 holders (default: 1)
    maxHolderScaling: number;          // Cap on holder-based scaling (default: 50)

    // Time-based settings
    peakHoursUTC: number[];            // Best hours to distribute (UTC)
    offPeakMultiplier: number;         // Threshold multiplier during off-peak (default: 1.5)

    // Wait time limits
    maxWaitMinutes: number;            // Force distribution after N minutes (default: 30)
    minWaitMinutes: number;            // Minimum wait between distributions (default: 2)
}

const DEFAULT_CONFIG: TimingConfig = {
    baseMinThreshold: 10,
    maxWaitThreshold: 100,
    lowFeeThreshold: 1000,             // 1000 micro-lamports = cheap
    highFeeThreshold: 50000,           // 50000 micro-lamports = expensive
    holderScaleFactor: 1,              // +$1 per 100 holders
    maxHolderScaling: 50,              // Max +$50 from holder scaling
    peakHoursUTC: [14, 15, 16, 17, 18, 19, 20, 21], // 2pm-9pm UTC (US trading hours)
    offPeakMultiplier: 1.5,
    maxWaitMinutes: 30,
    minWaitMinutes: 2
};

// Priority fee levels from Helius
type PriorityLevel = 'Min' | 'Low' | 'Medium' | 'High' | 'VeryHigh' | 'UnsafeMax';

interface PriorityFeeEstimate {
    priorityFeeEstimate: number;
    priorityFeeLevels?: {
        min: number;
        low: number;
        medium: number;
        high: number;
        veryHigh: number;
        unsafeMax: number;
    };
}

interface TimingDecision {
    shouldDistribute: boolean;
    reason: string;
    factors: {
        balance: number;
        dynamicThreshold: number;
        priorityFee: number;
        networkStatus: 'cheap' | 'normal' | 'expensive' | 'unknown';
        holderCount: number;
        isPeakHour: boolean;
        minutesSinceLastDistribution: number;
    };
    timestamp: string;
}

interface TimingData {
    config: TimingConfig;
    lastDistribution: string | null;
    decisionHistory: TimingDecision[];
    stats: {
        totalDecisions: number;
        distributionsTriggered: number;
        distributionsSkipped: number;
        averagePriorityFee: number;
        lastUpdated: string;
    };
}

// Load timing data
function loadTimingData(): TimingData {
    try {
        if (fs.existsSync(TIMING_DATA_FILE)) {
            return JSON.parse(fs.readFileSync(TIMING_DATA_FILE, 'utf-8'));
        }
    } catch (error) {
        console.warn('⚠️ Could not load timing data, using defaults');
    }

    return {
        config: DEFAULT_CONFIG,
        lastDistribution: null,
        decisionHistory: [],
        stats: {
            totalDecisions: 0,
            distributionsTriggered: 0,
            distributionsSkipped: 0,
            averagePriorityFee: 0,
            lastUpdated: new Date().toISOString()
        }
    };
}

// Save timing data
function saveTimingData(data: TimingData): void {
    fs.writeFileSync(TIMING_DATA_FILE, JSON.stringify(data, null, 2));
}

// Get current priority fee estimate from Helius
async function getPriorityFeeEstimate(level: PriorityLevel = 'Medium'): Promise<PriorityFeeEstimate | null> {
    try {
        const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: '1',
                method: 'getPriorityFeeEstimate',
                params: [{
                    accountKeys: [USD1_TOKEN_MINT.toBase58()],
                    options: {
                        priorityLevel: level,
                        includeAllPriorityFeeLevels: true
                    }
                }]
            })
        });

        if (!response.ok) {
            console.warn(`Priority fee API returned ${response.status}`);
            return null;
        }

        const result = await response.json();
        if (result.error) {
            console.warn(`Priority fee API error: ${result.error.message}`);
            return null;
        }

        return result.result as PriorityFeeEstimate;
    } catch (error) {
        console.warn(`Failed to get priority fee estimate: ${error}`);
        return null;
    }
}

// Get current USD1 balance
async function getUsd1Balance(connection: Connection, wallet: PublicKey): Promise<number> {
    try {
        const tokenAccount = getAssociatedTokenAddressSync(
            USD1_TOKEN_MINT,
            wallet,
            false,
            TOKEN_2022_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const account = await getAccount(connection, tokenAccount, 'confirmed', TOKEN_2022_PROGRAM_ID);
        return Number(account.amount) / Math.pow(10, 6);
    } catch (error) {
        console.warn(`Could not fetch USD1 balance: ${error}`);
        return 0;
    }
}

// Get holder count from distribution history
function getHolderCount(): number {
    try {
        if (fs.existsSync(DISTRIBUTION_HISTORY_FILE)) {
            const history = JSON.parse(fs.readFileSync(DISTRIBUTION_HISTORY_FILE, 'utf-8'));
            // Get recipient count from most recent distribution
            if (history.distributions && history.distributions.length > 0) {
                const recent = history.distributions[history.distributions.length - 1];
                return recent.recipientCount || 309; // Default to known holder count
            }
        }
    } catch (error) {
        console.warn('Could not get holder count from history');
    }
    return 309; // Default known holder count
}

// Check if current hour is peak trading hour
function isPeakHour(config: TimingConfig): boolean {
    const currentHourUTC = new Date().getUTCHours();
    return config.peakHoursUTC.includes(currentHourUTC);
}

// Calculate dynamic threshold based on conditions
function calculateDynamicThreshold(
    config: TimingConfig,
    holderCount: number,
    networkStatus: 'cheap' | 'normal' | 'expensive' | 'unknown',
    isPeak: boolean
): number {
    let threshold = config.baseMinThreshold;

    // Scale by holder count (more holders = slightly higher threshold for efficiency)
    const holderScaling = Math.min(
        Math.floor(holderCount / 100) * config.holderScaleFactor,
        config.maxHolderScaling
    );
    threshold += holderScaling;

    // Adjust for network conditions
    if (networkStatus === 'expensive') {
        threshold *= 1.5; // Wait for more accumulation when network is expensive
    } else if (networkStatus === 'cheap') {
        threshold *= 0.8; // Distribute sooner when network is cheap
    }

    // Adjust for time of day
    if (!isPeak) {
        threshold *= config.offPeakMultiplier;
    }

    // Ensure within bounds
    threshold = Math.max(config.baseMinThreshold, Math.min(threshold, config.maxWaitThreshold));

    return Math.round(threshold * 100) / 100; // Round to 2 decimal places
}

// Determine network status from priority fee
function getNetworkStatus(
    priorityFee: number | null,
    config: TimingConfig
): 'cheap' | 'normal' | 'expensive' | 'unknown' {
    if (priorityFee === null) return 'unknown';
    if (priorityFee < config.lowFeeThreshold) return 'cheap';
    if (priorityFee > config.highFeeThreshold) return 'expensive';
    return 'normal';
}

// Main decision function
async function makeTimingDecision(
    connection: Connection,
    wallet: PublicKey,
    data: TimingData
): Promise<TimingDecision> {
    const config = data.config;
    const now = new Date();

    // Get current balance
    const balance = await getUsd1Balance(connection, wallet);

    // Get priority fee estimate
    const feeEstimate = await getPriorityFeeEstimate('Medium');
    const priorityFee = feeEstimate?.priorityFeeEstimate ?? 0;

    // Get holder count
    const holderCount = getHolderCount();

    // Check if peak hour
    const isPeak = isPeakHour(config);

    // Determine network status
    const networkStatus = getNetworkStatus(priorityFee, config);

    // Calculate minutes since last distribution
    let minutesSinceLastDistribution = Infinity;
    if (data.lastDistribution) {
        const lastTime = new Date(data.lastDistribution).getTime();
        minutesSinceLastDistribution = (now.getTime() - lastTime) / (1000 * 60);
    }

    // Calculate dynamic threshold
    const dynamicThreshold = calculateDynamicThreshold(config, holderCount, networkStatus, isPeak);

    // Build decision factors
    const factors = {
        balance,
        dynamicThreshold,
        priorityFee,
        networkStatus,
        holderCount,
        isPeakHour: isPeak,
        minutesSinceLastDistribution: Math.round(minutesSinceLastDistribution)
    };

    // Make decision
    let shouldDistribute = false;
    let reason = '';

    // Check minimum wait time
    if (minutesSinceLastDistribution < config.minWaitMinutes) {
        reason = `Too soon since last distribution (${factors.minutesSinceLastDistribution}min < ${config.minWaitMinutes}min minimum)`;
    }
    // Check if balance is below absolute minimum
    else if (balance < config.baseMinThreshold) {
        reason = `Balance ($${balance.toFixed(2)}) below minimum threshold ($${config.baseMinThreshold})`;
    }
    // Check if max wait time exceeded (force distribution)
    else if (minutesSinceLastDistribution >= config.maxWaitMinutes && balance >= config.baseMinThreshold) {
        shouldDistribute = true;
        reason = `Max wait time exceeded (${factors.minutesSinceLastDistribution}min >= ${config.maxWaitMinutes}min) - forcing distribution`;
    }
    // Check if balance exceeds max threshold (force distribution)
    else if (balance >= config.maxWaitThreshold) {
        shouldDistribute = true;
        reason = `Balance ($${balance.toFixed(2)}) exceeds max threshold ($${config.maxWaitThreshold}) - forcing distribution`;
    }
    // Check if conditions are optimal
    else if (balance >= dynamicThreshold) {
        if (networkStatus === 'expensive') {
            reason = `Balance ($${balance.toFixed(2)}) meets threshold but network is expensive (${priorityFee} micro-lamports) - waiting for lower fees`;
        } else {
            shouldDistribute = true;
            reason = `Optimal conditions: balance ($${balance.toFixed(2)}) >= threshold ($${dynamicThreshold.toFixed(2)}), network is ${networkStatus}`;
        }
    }
    // Balance doesn't meet dynamic threshold
    else {
        reason = `Balance ($${balance.toFixed(2)}) below dynamic threshold ($${dynamicThreshold.toFixed(2)})`;
    }

    return {
        shouldDistribute,
        reason,
        factors,
        timestamp: now.toISOString()
    };
}

// Format network status with emoji
function formatNetworkStatus(status: string): string {
    switch (status) {
        case 'cheap': return '🟢 CHEAP';
        case 'normal': return '🟡 NORMAL';
        case 'expensive': return '🔴 EXPENSIVE';
        default: return '⚪ UNKNOWN';
    }
}

// Display current status
async function displayStatus(connection: Connection, wallet: PublicKey, data: TimingData): Promise<void> {
    const decision = await makeTimingDecision(connection, wallet, data);
    const { factors } = decision;

    console.log('\n🕐 SMART DISTRIBUTION TIMING STATUS');
    console.log('═'.repeat(50));

    console.log('\n📊 Current Conditions:');
    console.log(`   USD1 Balance:     $${factors.balance.toFixed(2)}`);
    console.log(`   Dynamic Threshold: $${factors.dynamicThreshold.toFixed(2)}`);
    console.log(`   Holder Count:      ${factors.holderCount}`);

    console.log('\n🌐 Network Status:');
    console.log(`   Priority Fee:      ${factors.priorityFee.toLocaleString()} micro-lamports`);
    console.log(`   Network Status:    ${formatNetworkStatus(factors.networkStatus)}`);
    console.log(`   Peak Trading Hour: ${factors.isPeakHour ? '✅ YES' : '❌ NO'}`);

    console.log('\n⏱️ Timing:');
    console.log(`   Minutes Since Last: ${factors.minutesSinceLastDistribution === Infinity ? 'N/A' : factors.minutesSinceLastDistribution + ' min'}`);
    console.log(`   Max Wait Time:      ${data.config.maxWaitMinutes} min`);
    console.log(`   Min Wait Time:      ${data.config.minWaitMinutes} min`);

    console.log('\n🎯 Decision:');
    console.log(`   Should Distribute: ${decision.shouldDistribute ? '✅ YES' : '❌ NO'}`);
    console.log(`   Reason: ${decision.reason}`);

    console.log('\n📈 Historical Stats:');
    console.log(`   Total Decisions:        ${data.stats.totalDecisions}`);
    console.log(`   Distributions Triggered: ${data.stats.distributionsTriggered}`);
    console.log(`   Distributions Skipped:   ${data.stats.distributionsSkipped}`);
    console.log(`   Avg Priority Fee:        ${data.stats.averagePriorityFee.toLocaleString()} micro-lamports`);

    console.log('═'.repeat(50));
}

// Check and record decision
async function checkAndRecord(connection: Connection, wallet: PublicKey, data: TimingData): Promise<TimingDecision> {
    const decision = await makeTimingDecision(connection, wallet, data);

    // Update stats
    data.stats.totalDecisions++;
    if (decision.shouldDistribute) {
        data.stats.distributionsTriggered++;
    } else {
        data.stats.distributionsSkipped++;
    }

    // Update average priority fee (rolling average)
    if (decision.factors.priorityFee > 0) {
        const totalFees = data.stats.averagePriorityFee * (data.stats.totalDecisions - 1) + decision.factors.priorityFee;
        data.stats.averagePriorityFee = Math.round(totalFees / data.stats.totalDecisions);
    }

    data.stats.lastUpdated = decision.timestamp;

    // Add to history (keep last 100)
    data.decisionHistory.push(decision);
    if (data.decisionHistory.length > 100) {
        data.decisionHistory = data.decisionHistory.slice(-100);
    }

    // Mark last distribution time if we're distributing
    if (decision.shouldDistribute) {
        data.lastDistribution = decision.timestamp;
    }

    saveTimingData(data);

    return decision;
}

// Display decision history
function displayHistory(data: TimingData): void {
    console.log('\n📜 DECISION HISTORY (Last 20)');
    console.log('═'.repeat(80));

    const recentHistory = data.decisionHistory.slice(-20).reverse();

    if (recentHistory.length === 0) {
        console.log('   No decisions recorded yet.');
        return;
    }

    for (const decision of recentHistory) {
        const time = new Date(decision.timestamp).toLocaleString();
        const status = decision.shouldDistribute ? '✅ DISTRIBUTE' : '⏸️ WAIT';
        const balance = decision.factors.balance.toFixed(2);
        const threshold = decision.factors.dynamicThreshold.toFixed(2);
        const network = decision.factors.networkStatus.toUpperCase().padEnd(8);

        console.log(`   ${time} | ${status.padEnd(14)} | $${balance} / $${threshold} | ${network}`);
    }

    console.log('═'.repeat(80));
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    const wantsCheck = args.includes('--check');
    const wantsStatus = args.includes('--status');
    const wantsHistory = args.includes('--history');
    const wantsJson = args.includes('--json');

    // Load keypair
    if (!fs.existsSync(KEYPAIR_PATH)) {
        console.error(`❌ Keypair file not found: ${KEYPAIR_PATH}`);
        process.exit(1);
    }
    const keypairData = JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf-8'));
    const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));

    // Initialize connection
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');

    // Load timing data
    const data = loadTimingData();

    if (wantsJson) {
        // JSON output mode
        const decision = await makeTimingDecision(connection, keypair.publicKey, data);
        console.log(JSON.stringify({
            decision,
            config: data.config,
            stats: data.stats
        }, null, 2));
        return;
    }

    if (wantsHistory) {
        displayHistory(data);
        return;
    }

    if (wantsCheck) {
        // Check mode - make decision and record it
        const decision = await checkAndRecord(connection, keypair.publicKey, data);

        console.log('\n🎯 DISTRIBUTION TIMING CHECK');
        console.log('═'.repeat(50));
        console.log(`   Should Distribute: ${decision.shouldDistribute ? '✅ YES' : '❌ NO'}`);
        console.log(`   Reason: ${decision.reason}`);
        console.log(`   Balance: $${decision.factors.balance.toFixed(2)}`);
        console.log(`   Threshold: $${decision.factors.dynamicThreshold.toFixed(2)}`);
        console.log(`   Network: ${formatNetworkStatus(decision.factors.networkStatus)}`);
        console.log('═'.repeat(50));

        // Exit with code based on decision (for use in scripts)
        process.exit(decision.shouldDistribute ? 0 : 1);
    }

    // Default: show status
    await displayStatus(connection, keypair.publicKey, data);
}

// Export for use in other scripts
export {
    makeTimingDecision,
    checkAndRecord,
    loadTimingData,
    saveTimingData,
    TimingDecision,
    TimingData,
    TimingConfig
};

// Run if called directly
main().catch(console.error);
