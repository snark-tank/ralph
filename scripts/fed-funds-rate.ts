/**
 * Fed Funds Rate Calculator
 *
 * Calculates the current "Fed Funds Rate" - the estimated APY for $FED holders
 * based on real trading volume and distribution data.
 *
 * This is NOT a fake promised APY like failed protocols (Titano, DRIP, etc.)
 * Instead, it's an honest, variable rate based on ACTUAL trading fees collected.
 *
 * Formula:
 *   Fed Funds Rate = (Daily Volume * Fee Rate * 365) / Total $FED Market Cap * 100
 *
 * Or more practically:
 *   Fed Funds Rate = (Total Distributed / Time Period) * 365 / Your Holdings Value * 100
 *
 * Usage:
 *   npx ts-node fed-funds-rate.ts [--json] [--holdings <amount>]
 */

import {
    Connection,
    PublicKey,
} from '@solana/web3.js';
import {
    TOKEN_2022_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FED_TOKEN_MINT = new PublicKey('132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed');
const USD1_TOKEN_MINT = new PublicKey('USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB');
const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6';
const DISTRIBUTION_HISTORY_FILE = path.join(__dirname, '..', 'src', 'token-distribution-history.json');
const FEE_RATE = 0.08; // 8% fee on LP positions

// Holder tier multipliers (same as distribution script)
interface HolderTier {
    name: string;
    title: string;
    minHolding: number;
    multiplier: number;
    emoji: string;
}

const HOLDER_TIERS: HolderTier[] = [
    { name: 'Chairman', title: 'Fed Chairman', minHolding: 50_000_000, multiplier: 1.5, emoji: '🏛️' },
    { name: 'Governor', title: 'Fed Governor', minHolding: 10_000_000, multiplier: 1.25, emoji: '🏦' },
    { name: 'Director', title: 'Regional Director', minHolding: 1_000_000, multiplier: 1.1, emoji: '🏢' },
    { name: 'Member', title: 'Board Member', minHolding: 100_000, multiplier: 1.05, emoji: '👔' },
    { name: 'Citizen', title: 'Fed Citizen', minHolding: 0, multiplier: 1.0, emoji: '🧑' },
];

function getHolderTier(amount: number): HolderTier {
    for (const tier of HOLDER_TIERS) {
        if (amount >= tier.minHolding) {
            return tier;
        }
    }
    return HOLDER_TIERS[HOLDER_TIERS.length - 1];
}

interface DistributionHistory {
    totalDistributed: number;
    distributions: Array<{
        timestamp: string;
        totalAmount: number;
        recipientCount: number;
        txSignatures: string[];
    }>;
}

interface FedFundsRateResult {
    // Current rates
    currentRate: number;          // Base APY without tier multiplier
    daily24hRate: number;         // Rate based on last 24h
    weekly7dRate: number;         // Rate based on last 7 days
    monthly30dRate: number;       // Rate based on last 30 days

    // Tier-adjusted rates (if holdings provided)
    tierAdjustedRate?: number;
    tierName?: string;
    tierMultiplier?: number;

    // Supporting data
    totalDistributed: number;
    distributionCount: number;
    holderCount: number;
    totalSupplyHeld: number;

    // Time periods
    last24hDistributed: number;
    last7dDistributed: number;
    last30dDistributed: number;

    // User-specific (if holdings provided)
    userHoldings?: number;
    estimatedDailyReward?: number;
    estimatedMonthlyReward?: number;
    estimatedYearlyReward?: number;

    // Timestamps
    calculatedAt: string;
    oldestDistribution: string;
    newestDistribution: string;
}

// Parse command line arguments
interface RunOptions {
    json: boolean;
    holdings?: number;
}

function parseArgs(): RunOptions {
    const args = process.argv.slice(2);
    const options: RunOptions = {
        json: args.includes('--json'),
        holdings: undefined
    };

    const holdingsIdx = args.indexOf('--holdings');
    if (holdingsIdx !== -1 && args[holdingsIdx + 1]) {
        options.holdings = parseFloat(args[holdingsIdx + 1]);
    }

    return options;
}

// Load distribution history
function loadDistributionHistory(): DistributionHistory | null {
    try {
        if (fs.existsSync(DISTRIBUTION_HISTORY_FILE)) {
            return JSON.parse(fs.readFileSync(DISTRIBUTION_HISTORY_FILE, 'utf-8'));
        }
    } catch (error) {
        console.error('Error loading distribution history:', error);
    }
    return null;
}

// Calculate distributions within a time period
function getDistributionsInPeriod(
    history: DistributionHistory,
    hoursBack: number
): { total: number; count: number } {
    const cutoff = Date.now() - (hoursBack * 60 * 60 * 1000);

    let total = 0;
    let count = 0;

    for (const dist of history.distributions) {
        const distTime = new Date(dist.timestamp).getTime();
        if (distTime >= cutoff) {
            total += dist.totalAmount;
            count++;
        }
    }

    return { total, count };
}

// Get total $FED supply held by eligible holders
async function getTotalSupplyHeld(connection: Connection): Promise<{ totalSupply: number; holderCount: number }> {
    try {
        // First try Token2022
        let tokenAccounts = await connection.getParsedProgramAccounts(
            TOKEN_2022_PROGRAM_ID,
            {
                filters: [
                    {
                        memcmp: {
                            offset: 0,
                            bytes: FED_TOKEN_MINT.toBase58(),
                        },
                    },
                ],
            }
        );

        // If no Token2022 accounts, try regular SPL
        if (tokenAccounts.length === 0) {
            tokenAccounts = await connection.getParsedProgramAccounts(
                TOKEN_PROGRAM_ID,
                {
                    filters: [
                        { dataSize: 165 },
                        {
                            memcmp: {
                                offset: 0,
                                bytes: FED_TOKEN_MINT.toBase58(),
                            },
                        },
                    ],
                }
            );
        }

        let totalSupply = 0;
        let holderCount = 0;

        // Known AMM programs to filter
        const AMM_PROGRAMS = [
            'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
            '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
            'HyaB3W9q6XdA5xwpU4XnSZV94htfmbmqJXZcEbRaJutt',
            'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
            'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
            'DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1',
            '7Y9wjvR8nGmj4nPVSPBR2FJYCVdcNjLpLLNPH1dEjCRr',
            'Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB',
            'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
            'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB',
            'dynMpX7j1Ry59x4ePmWdDYQsxSPsUqUkphJwJxtF6zP',
        ];

        for (const account of tokenAccounts) {
            const parsedData = account.account.data as { parsed?: { info?: { tokenAmount?: { uiAmount: number }; owner?: string } } };
            const tokenAmount = parsedData.parsed?.info?.tokenAmount;
            const owner = parsedData.parsed?.info?.owner;

            if (tokenAmount && owner && tokenAmount.uiAmount > 0) {
                // Skip AMM/pool addresses
                if (AMM_PROGRAMS.includes(owner)) continue;
                if (AMM_PROGRAMS.includes(account.account.owner.toBase58())) continue;

                // Skip PDAs (off-curve addresses)
                try {
                    const pubkey = new PublicKey(owner);
                    if (!PublicKey.isOnCurve(pubkey.toBuffer())) continue;
                } catch {
                    continue;
                }

                totalSupply += tokenAmount.uiAmount;
                holderCount++;
            }
        }

        return { totalSupply, holderCount };
    } catch (error) {
        console.error('Error fetching supply:', error);
        return { totalSupply: 0, holderCount: 0 };
    }
}

// Calculate Fed Funds Rate
async function calculateFedFundsRate(userHoldings?: number): Promise<FedFundsRateResult | null> {
    const history = loadDistributionHistory();
    if (!history || history.distributions.length === 0) {
        console.error('No distribution history found');
        return null;
    }

    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const { totalSupply, holderCount } = await getTotalSupplyHeld(connection);

    if (totalSupply === 0) {
        console.error('Could not determine total supply');
        return null;
    }

    // Calculate time-period specific distributions
    const last24h = getDistributionsInPeriod(history, 24);
    const last7d = getDistributionsInPeriod(history, 24 * 7);
    const last30d = getDistributionsInPeriod(history, 24 * 30);

    // Calculate APY for each period
    // APY = (Total Distributed in Period / Total Supply) * (365 / Days in Period) * 100
    const daily24hRate = last24h.total > 0
        ? (last24h.total / totalSupply) * 365 * 100
        : 0;

    const weekly7dRate = last7d.total > 0
        ? (last7d.total / totalSupply) * (365 / 7) * 100
        : 0;

    const monthly30dRate = last30d.total > 0
        ? (last30d.total / totalSupply) * (365 / 30) * 100
        : 0;

    // Use 7-day average as the "current" rate (more stable than 24h)
    const currentRate = weekly7dRate > 0 ? weekly7dRate : monthly30dRate;

    // Sort distributions by timestamp
    const sortedDist = [...history.distributions].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const result: FedFundsRateResult = {
        currentRate,
        daily24hRate,
        weekly7dRate,
        monthly30dRate,
        totalDistributed: history.totalDistributed,
        distributionCount: history.distributions.length,
        holderCount,
        totalSupplyHeld: totalSupply,
        last24hDistributed: last24h.total,
        last7dDistributed: last7d.total,
        last30dDistributed: last30d.total,
        calculatedAt: new Date().toISOString(),
        oldestDistribution: sortedDist[0]?.timestamp || 'N/A',
        newestDistribution: sortedDist[sortedDist.length - 1]?.timestamp || 'N/A',
    };

    // Calculate user-specific rates if holdings provided
    if (userHoldings && userHoldings > 0) {
        const tier = getHolderTier(userHoldings);
        const userShareBase = userHoldings / totalSupply;
        const userShareWeighted = userShareBase * tier.multiplier;

        // Normalize for tier distribution (approximate)
        const avgMultiplier = 1.05; // Approximate average multiplier across all holders
        const normalizedShare = userShareWeighted / avgMultiplier;

        result.userHoldings = userHoldings;
        result.tierName = tier.title;
        result.tierMultiplier = tier.multiplier;
        result.tierAdjustedRate = currentRate * tier.multiplier;

        // Estimate rewards based on recent distribution rate
        const dailyRate = last7d.total / 7; // Average daily distribution
        result.estimatedDailyReward = dailyRate * normalizedShare;
        result.estimatedMonthlyReward = result.estimatedDailyReward * 30;
        result.estimatedYearlyReward = result.estimatedDailyReward * 365;
    }

    return result;
}

// Format output for display
function formatOutput(result: FedFundsRateResult, options: RunOptions): void {
    if (options.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
    }

    console.log('\n' + '═'.repeat(60));
    console.log('🏛️  FED FUNDS RATE - Current APY Calculation');
    console.log('═'.repeat(60));

    console.log('\n📊 Current Rates (Based on Actual Distribution Data):');
    console.log(`   24h Rate:  ${result.daily24hRate.toFixed(2)}% APY`);
    console.log(`   7d Rate:   ${result.weekly7dRate.toFixed(2)}% APY`);
    console.log(`   30d Rate:  ${result.monthly30dRate.toFixed(2)}% APY`);
    console.log(`   ─────────────────────────────────`);
    console.log(`   🎯 Current Fed Funds Rate: ${result.currentRate.toFixed(2)}% APY`);

    console.log('\n📈 Distribution Statistics:');
    console.log(`   Total Distributed:  $${result.totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD1`);
    console.log(`   Distribution Count: ${result.distributionCount}`);
    console.log(`   Active Holders:     ${result.holderCount}`);
    console.log(`   Total Supply Held:  ${result.totalSupplyHeld.toLocaleString()} $FED`);

    console.log('\n⏱️ Recent Activity:');
    console.log(`   Last 24h: $${result.last24hDistributed.toFixed(2)} USD1`);
    console.log(`   Last 7d:  $${result.last7dDistributed.toFixed(2)} USD1`);
    console.log(`   Last 30d: $${result.last30dDistributed.toFixed(2)} USD1`);

    if (result.userHoldings) {
        const tier = getHolderTier(result.userHoldings);
        console.log('\n👤 Your Position:');
        console.log(`   Holdings:    ${result.userHoldings.toLocaleString()} $FED`);
        console.log(`   Tier:        ${tier.emoji} ${result.tierName} (${result.tierMultiplier}x multiplier)`);
        console.log(`   Your APY:    ${result.tierAdjustedRate?.toFixed(2)}% (tier-adjusted)`);
        console.log('\n💰 Estimated Rewards:');
        console.log(`   Daily:   $${result.estimatedDailyReward?.toFixed(4)} USD1`);
        console.log(`   Monthly: $${result.estimatedMonthlyReward?.toFixed(2)} USD1`);
        console.log(`   Yearly:  $${result.estimatedYearlyReward?.toFixed(2)} USD1`);
    }

    console.log('\n📅 Data Period:');
    console.log(`   From: ${new Date(result.oldestDistribution).toLocaleDateString()}`);
    console.log(`   To:   ${new Date(result.newestDistribution).toLocaleDateString()}`);
    console.log(`   Calculated: ${new Date(result.calculatedAt).toLocaleString()}`);

    console.log('\n' + '─'.repeat(60));
    console.log('⚠️  Note: This is a REAL yield based on actual trading fees.');
    console.log('    Unlike failed protocols, this rate varies with volume.');
    console.log('    No fixed APY promises - just honest, sustainable rewards.');
    console.log('─'.repeat(60) + '\n');
}

// Main entry point
async function main() {
    const options = parseArgs();

    try {
        const result = await calculateFedFundsRate(options.holdings);

        if (result) {
            formatOutput(result, options);
        } else {
            console.error('Failed to calculate Fed Funds Rate');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Export for use by other modules
export { calculateFedFundsRate, FedFundsRateResult, HOLDER_TIERS, getHolderTier };

// Run if called directly
main().catch(console.error);
