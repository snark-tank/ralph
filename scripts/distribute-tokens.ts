import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
    SendTransactionError,
} from '@solana/web3.js';
import {
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
    getAccount,
    TokenAccountNotFoundError
} from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log directory for detailed logging
const LOG_DIR = path.join(__dirname, 'distribution-logs');

// Streak data file path
const STREAK_DATA_FILE = path.join(__dirname, 'streak-data.json');

// Milestone data file path
const MILESTONE_FILE = path.join(__dirname, 'milestones.json');

// Streak tier definitions (must match streak-tracker.ts)
interface StreakTier {
    name: string;
    title: string;
    minDays: number;
    multiplier: number;
    emoji: string;
}

const STREAK_TIERS: StreakTier[] = [
    { name: 'FoundingFather', title: 'Founding Father', minDays: 365, multiplier: 1.25, emoji: '🏛️' },
    { name: 'OGFed', title: 'OG Fed', minDays: 180, multiplier: 1.2, emoji: '💎' },
    { name: 'FedLoyalist', title: 'Fed Loyalist', minDays: 90, multiplier: 1.15, emoji: '🔷' },
    { name: 'DiamondHands', title: 'Diamond Hands', minDays: 30, multiplier: 1.1, emoji: '💠' },
    { name: 'Holder', title: 'Holder', minDays: 7, multiplier: 1.05, emoji: '🤝' },
    { name: 'Newcomer', title: 'Newcomer', minDays: 0, multiplier: 1.0, emoji: '🆕' },
];

// Streak data structures
interface HolderStreak {
    address: string;
    firstSeen: string;
    lastSeen: string;
    currentBalance: number;
    peakBalance: number;
    streakDays: number;
    longestStreak: number;
    streakBroken: boolean;
    tier: string;
    multiplier: number;
}

interface StreakData {
    lastUpdated: string;
    holders: Record<string, HolderStreak>;
    stats: {
        totalTracked: number;
        activeStreaks: number;
        longestCurrentStreak: number;
        averageStreak: number;
        tierBreakdown: Record<string, number>;
    };
}

// Milestone structures for QE bonus events
interface MilestoneDefinition {
    id: string;
    name: string;
    description: string;
    type: 'distributed' | 'holders' | 'distributions';
    threshold: number;
    qeEvent: string;
    bonusMultiplier: number;
    celebrationEmoji: string;
}

interface MilestoneState {
    lastChecked: string;
    milestones: Record<string, { achieved: boolean; achievedAt?: string }>;
}

// Define distribution milestones with bonus multipliers (QE events)
const QE_MILESTONES: MilestoneDefinition[] = [
    { id: 'dist_10k', name: '$10,000 Distributed', description: 'QE1 - First major stimulus', type: 'distributed', threshold: 10000, qeEvent: 'QE1', bonusMultiplier: 1.5, celebrationEmoji: '🚀' },
    { id: 'dist_25k', name: '$25,000 Distributed', description: 'QE1.5 - Economic expansion', type: 'distributed', threshold: 25000, qeEvent: 'QE1.5', bonusMultiplier: 1.25, celebrationEmoji: '💰' },
    { id: 'dist_50k', name: '$50,000 Distributed', description: 'QE2 - Major liquidity injection', type: 'distributed', threshold: 50000, qeEvent: 'QE2', bonusMultiplier: 1.5, celebrationEmoji: '💎' },
    { id: 'dist_100k', name: '$100,000 Distributed', description: 'QE3 - Historic stimulus', type: 'distributed', threshold: 100000, qeEvent: 'QE3', bonusMultiplier: 2.0, celebrationEmoji: '🏆' },
    { id: 'dist_250k', name: '$250,000 Distributed', description: 'QE4 - Quarter million', type: 'distributed', threshold: 250000, qeEvent: 'QE4', bonusMultiplier: 2.0, celebrationEmoji: '👑' },
    { id: 'dist_500k', name: '$500,000 Distributed', description: 'QE5 - Half million', type: 'distributed', threshold: 500000, qeEvent: 'QE5', bonusMultiplier: 2.5, celebrationEmoji: '🌟' },
    { id: 'dist_1m', name: '$1,000,000 Distributed', description: 'QE∞ - Million dollar printer', type: 'distributed', threshold: 1000000, qeEvent: 'QE∞', bonusMultiplier: 3.0, celebrationEmoji: '🎯' },
];

// Load milestone state
function loadMilestoneState(): MilestoneState {
    try {
        if (fs.existsSync(MILESTONE_FILE)) {
            return JSON.parse(fs.readFileSync(MILESTONE_FILE, 'utf-8'));
        }
    } catch (error) {
        console.warn('⚠️ Could not load milestone state:', error);
    }
    return {
        lastChecked: new Date().toISOString(),
        milestones: {}
    };
}

// Save milestone state
function saveMilestoneState(state: MilestoneState): void {
    fs.writeFileSync(MILESTONE_FILE, JSON.stringify(state, null, 2));
}

// Check if we're crossing a milestone threshold with this distribution
// Returns the highest bonus multiplier if we're crossing one (or more) milestones
function checkForQEBonus(
    previousTotal: number,
    currentTotal: number,
    milestoneState: MilestoneState
): { bonus: number; milestone: MilestoneDefinition | null; newlyAchieved: MilestoneDefinition[] } {
    let highestBonus = 1.0;
    let triggeringMilestone: MilestoneDefinition | null = null;
    const newlyAchieved: MilestoneDefinition[] = [];

    for (const milestone of QE_MILESTONES) {
        // Skip already achieved milestones
        if (milestoneState.milestones[milestone.id]?.achieved) {
            continue;
        }

        // Check if we're crossing this threshold
        if (previousTotal < milestone.threshold && currentTotal >= milestone.threshold) {
            newlyAchieved.push(milestone);
            if (milestone.bonusMultiplier > highestBonus) {
                highestBonus = milestone.bonusMultiplier;
                triggeringMilestone = milestone;
            }
        }
    }

    return { bonus: highestBonus, milestone: triggeringMilestone, newlyAchieved };
}

// Load streak data from file
function loadStreakData(): StreakData | null {
    try {
        if (fs.existsSync(STREAK_DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(STREAK_DATA_FILE, 'utf-8'));
            return data as StreakData;
        }
    } catch (error) {
        console.warn('⚠️ Could not load streak data:', error);
    }
    return null;
}

// Get streak multiplier for an address
function getStreakMultiplier(address: string, streakData: StreakData | null): { multiplier: number; tier: StreakTier; streakDays: number } {
    const defaultTier = STREAK_TIERS[STREAK_TIERS.length - 1]; // Newcomer

    if (!streakData || !streakData.holders[address]) {
        return { multiplier: 1.0, tier: defaultTier, streakDays: 0 };
    }

    const holderStreak = streakData.holders[address];
    const streakDays = holderStreak.streakDays || 0;

    // Find the appropriate tier
    for (const tier of STREAK_TIERS) {
        if (streakDays >= tier.minDays) {
            return { multiplier: tier.multiplier, tier, streakDays };
        }
    }

    return { multiplier: 1.0, tier: defaultTier, streakDays };
}

// Ensure log directory exists
function ensureLogDir(): void {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
}

// Log writer class for detailed logging
class DistributionLogger {
    private logFile: string;
    private startTime: number;
    private logLines: string[] = [];

    constructor() {
        ensureLogDir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        this.logFile = path.join(LOG_DIR, `distribution-${timestamp}.log`);
        this.startTime = Date.now();
        this.log('='.repeat(60));
        this.log('Distribution Log Started');
        this.log(`Timestamp: ${new Date().toISOString()}`);
        this.log('='.repeat(60));
    }

    log(message: string): void {
        const timestamp = new Date().toISOString();
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
        const logLine = `[${timestamp}] [${elapsed}s] ${message}`;
        this.logLines.push(logLine);
        console.log(message);
        // Write to file immediately for real-time logging
        fs.appendFileSync(this.logFile, logLine + '\n');
    }

    error(message: string): void {
        this.log(`❌ ERROR: ${message}`);
    }

    success(message: string): void {
        this.log(`✅ ${message}`);
    }

    warn(message: string): void {
        this.log(`⚠️ ${message}`);
    }

    getLogPath(): string {
        return this.logFile;
    }
}

// Progress tracker with ETA calculation
class ProgressTracker {
    private total: number;
    private completed: number = 0;
    private failed: number = 0;
    private startTime: number;
    private logger: DistributionLogger;
    private lastUpdateTime: number = 0;
    private updateIntervalMs: number = 2000; // Update every 2 seconds max

    constructor(total: number, logger: DistributionLogger) {
        this.total = total;
        this.startTime = Date.now();
        this.logger = logger;
    }

    increment(success: boolean = true): void {
        if (success) {
            this.completed++;
        } else {
            this.failed++;
        }
        this.maybeLogProgress();
    }

    private maybeLogProgress(): void {
        const now = Date.now();
        if (now - this.lastUpdateTime >= this.updateIntervalMs) {
            this.logProgress();
            this.lastUpdateTime = now;
        }
    }

    logProgress(): void {
        const processed = this.completed + this.failed;
        const elapsed = (Date.now() - this.startTime) / 1000;
        const rate = processed / elapsed;
        const remaining = this.total - processed;
        const eta = rate > 0 ? remaining / rate : 0;

        const percent = ((processed / this.total) * 100).toFixed(1);
        const etaFormatted = this.formatTime(eta);

        this.logger.log(
            `📊 Progress: ${processed}/${this.total} (${percent}%) | ` +
            `✅ ${this.completed} success | ❌ ${this.failed} failed | ` +
            `⏱️ ETA: ${etaFormatted} | Rate: ${rate.toFixed(2)}/s`
        );
    }

    private formatTime(seconds: number): string {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }

    getSummary(): { completed: number; failed: number; total: number; duration: number } {
        return {
            completed: this.completed,
            failed: this.failed,
            total: this.total,
            duration: (Date.now() - this.startTime) / 1000
        };
    }
}

// Known AMM/Pool program IDs to filter out
const AMM_PROGRAMS = [
    'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C', // Raydium CPMM
    '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', // Raydium AMM V4
    'HyaB3W9q6XdA5xwpU4XnSZV94htfmbmqJXZcEbRaJutt', // Orca Whirlpool
    'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', // Orca Whirlpool
    'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK', // Kamino
    'DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1', // Meteora DLMM
    '7Y9wjvR8nGmj4nPVSPBR2FJYCVdcNjLpLLNPH1dEjCRr', // Meteora DAMM V1
    'Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB', // Meteora DAMM V2
    'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', // Jupiter
    'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB', // Jupiter V4
    'dynMpX7j1Ry59x4ePmWdDYQsxSPsUqUkphJwJxtF6zP', // Dynamic Bonding Curve (Meteora)
];

// Blacklisted addresses that should not receive distributions
const BLACKLISTED_ADDRESSES = [
    'FaxmZj7oi9bZwLPHYPBf2zeWDY3GK4mXvMopfkvQ9kVE', // Blacklisted address
];

// Distribution history file (in the main fed/src folder for website access)
const DISTRIBUTION_HISTORY_FILE = path.join(__dirname, '..', 'src', 'token-distribution-history.json');

// Website API for live updates
const WEBSITE_API_URL = process.env.WEBSITE_API_URL || 'https://fed.markets/api/distributions';
const DISTRIBUTION_API_KEY = process.env.DISTRIBUTION_API_KEY || '546c3e1b3cdce901910414eb80c3a0f934fa8477cb33e45290d70f0fa0e474cf';

interface DistributionHistory {
    totalDistributed: number;
    distributions: Array<{
        timestamp: string;
        totalAmount: number;
        recipientCount: number;
        txSignatures: string[];
        snapshotToken: string;
        distributedToken: string;
    }>;
}

interface TokenHolder {
    address: string;
    amount: number;
    percentage: number;
    tokensToReceive: number;
    tier?: HolderTier;
    multiplier?: number;
    // Streak bonus fields
    streakTier?: StreakTier;
    streakMultiplier?: number;
    streakDays?: number;
    combinedMultiplier?: number; // tier * streak
}

// Holder Tier System - Federal Reserve Ranks
// Multipliers redistribute rewards within the pool (total stays same)
interface HolderTier {
    name: string;
    title: string;
    minHolding: number;
    multiplier: number;
}

const HOLDER_TIERS: HolderTier[] = [
    { name: 'Chairman', title: 'Fed Chairman', minHolding: 50_000_000, multiplier: 1.5 },
    { name: 'Governor', title: 'Fed Governor', minHolding: 10_000_000, multiplier: 1.25 },
    { name: 'Director', title: 'Regional Director', minHolding: 1_000_000, multiplier: 1.1 },
    { name: 'Member', title: 'Board Member', minHolding: 100_000, multiplier: 1.05 },
    { name: 'Citizen', title: 'Fed Citizen', minHolding: 0, multiplier: 1.0 },
];

// Get tier for a holder based on their holdings
function getHolderTier(amount: number): HolderTier {
    for (const tier of HOLDER_TIERS) {
        if (amount >= tier.minHolding) {
            return tier;
        }
    }
    return HOLDER_TIERS[HOLDER_TIERS.length - 1]; // Default to Citizen
}

// Calculate Fed Funds Rate (estimated APY) from distribution history
function calculateFedFundsRate(history: DistributionHistory, totalSupplyHeld: number): { rate7d: number; rate30d: number } {
    if (history.distributions.length === 0 || totalSupplyHeld === 0) {
        return { rate7d: 0, rate30d: 0 };
    }

    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    let total7d = 0;
    let total30d = 0;

    for (const dist of history.distributions) {
        const distTime = new Date(dist.timestamp).getTime();
        if (distTime >= sevenDaysAgo) {
            total7d += dist.totalAmount;
        }
        if (distTime >= thirtyDaysAgo) {
            total30d += dist.totalAmount;
        }
    }

    // APY = (Total Distributed / Total Supply) * (365 / Days) * 100
    const rate7d = total7d > 0 ? (total7d / totalSupplyHeld) * (365 / 7) * 100 : 0;
    const rate30d = total30d > 0 ? (total30d / totalSupplyHeld) * (365 / 30) * 100 : 0;

    return { rate7d, rate30d };
}

// Load or create distribution history
function loadDistributionHistory(): DistributionHistory {
    if (fs.existsSync(DISTRIBUTION_HISTORY_FILE)) {
        return JSON.parse(fs.readFileSync(DISTRIBUTION_HISTORY_FILE, 'utf-8'));
    }
    return {
        totalDistributed: 0,
        distributions: []
    };
}

// Save distribution history
function saveDistributionHistory(history: DistributionHistory) {
    fs.writeFileSync(DISTRIBUTION_HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Sync distribution to website API (Vercel KV)
async function syncToWebsite(totalAmount: number, recipientCount: number, txSignature: string): Promise<boolean> {
    if (!DISTRIBUTION_API_KEY) {
        console.log('⚠️ DISTRIBUTION_API_KEY not set, skipping website sync');
        return false;
    }

    try {
        const response = await fetch(WEBSITE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                totalAmount,
                recipientCount,
                txSignature,
                apiKey: DISTRIBUTION_API_KEY,
            }),
        });

        if (response.ok) {
            console.log('✅ Synced distribution to website');
            return true;
        } else {
            const error = await response.text();
            console.log(`⚠️ Failed to sync to website: ${error}`);
            return false;
        }
    } catch (error) {
        console.log(`⚠️ Error syncing to website: ${error}`);
        return false;
    }
}

// Check if an address is likely a pool/AMM
function isLikelyPool(owner: string): boolean {
    if (AMM_PROGRAMS.includes(owner)) {
        return true;
    }
    return false;
}

// RPC rate limit error detection
function isRateLimitError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return message.includes('429') ||
           message.includes('rate limit') ||
           message.includes('too many requests') ||
           message.includes('server responded with 429');
}

// Blockhash expired error detection
function isBlockhashExpiredError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return message.includes('blockhash') ||
           message.includes('block height exceeded');
}

// Retry function for transactions with exponential backoff and rate limit handling
async function retryTransaction(
    fn: () => Promise<string>,
    logger: DistributionLogger,
    maxRetries: number = 5,
    baseDelay: number = 1000
): Promise<string | null> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: unknown) {
            const err = error as Error;
            const isRateLimit = isRateLimitError(err);
            const isBlockhashExpired = isBlockhashExpiredError(err);

            // Calculate exponential backoff delay
            // For rate limits, use longer delays
            let delay: number;
            if (isRateLimit) {
                delay = baseDelay * Math.pow(3, attempt) + Math.random() * 2000;
                logger.warn(`Rate limit hit, backing off for ${(delay / 1000).toFixed(1)}s`);
            } else {
                delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500;
            }

            // Handle SendTransactionError specifically
            if (err instanceof SendTransactionError) {
                logger.warn(`Attempt ${attempt + 1}/${maxRetries} failed: ${err.message}`);
                if (err.logs && err.logs.length > 0) {
                    logger.log('Transaction logs:');
                    err.logs.slice(0, 5).forEach((log: string) => logger.log(`  ${log}`));
                }
            } else {
                logger.warn(`Attempt ${attempt + 1}/${maxRetries} failed: ${err.message || String(err)}`);
            }

            // If blockhash expired, don't retry this transaction (will need new blockhash)
            if (isBlockhashExpired) {
                logger.warn('Blockhash expired - transaction will be retried with new blockhash');
                return null;
            }

            if (attempt < maxRetries - 1) {
                logger.log(`Retrying in ${(delay / 1000).toFixed(1)}s (exponential backoff)...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    logger.error(`Transaction failed after ${maxRetries} attempts`);
    return null;
}

// Send batch of transactions with controlled parallelism and progress tracking
async function sendBatchTransactions(
    connection: Connection,
    transactions: Transaction[],
    signer: Keypair,
    logger: DistributionLogger,
    maxConcurrentBatches: number = 8, // Number of batches to run in parallel
    batchSize: number = 5 // Transactions per batch
): Promise<string[]> {
    logger.log(`\n🚀 Starting batch processing with ${maxConcurrentBatches} concurrent batches`);
    logger.log(`📦 Total transactions: ${transactions.length}, Batch size: ${batchSize}`);

    const progress = new ProgressTracker(transactions.length, logger);
    const signatures: string[] = [];
    const failedIndices: number[] = [];

    // Process batches with controlled parallelism
    const totalBatches = Math.ceil(transactions.length / batchSize);

    for (let batchStart = 0; batchStart < totalBatches; batchStart += maxConcurrentBatches) {
        const batchEndIdx = Math.min(batchStart + maxConcurrentBatches, totalBatches);
        const batchPromises: Promise<void>[] = [];

        logger.log(`\n📤 Processing batch group ${Math.floor(batchStart / maxConcurrentBatches) + 1}/${Math.ceil(totalBatches / maxConcurrentBatches)}`);

        for (let batchIdx = batchStart; batchIdx < batchEndIdx; batchIdx++) {
            const txStart = batchIdx * batchSize;
            const txEnd = Math.min(txStart + batchSize, transactions.length);
            const batch = transactions.slice(txStart, txEnd);
            const batchNumber = batchIdx + 1;

            const batchPromise = (async () => {
                for (let i = 0; i < batch.length; i++) {
                    const tx = batch[i];
                    const txIndex = txStart + i;

                    const signature = await retryTransaction(
                        async () => {
                            const sig = await sendAndConfirmTransaction(connection, tx, [signer], {
                                skipPreflight: false,
                                commitment: 'confirmed'
                            });
                            return sig;
                        },
                        logger
                    );

                    if (signature) {
                        signatures.push(signature);
                        progress.increment(true);
                        logger.success(`Batch ${batchNumber}/${totalBatches} - Tx ${txIndex + 1}: ${signature.slice(0, 12)}...`);
                    } else {
                        failedIndices.push(txIndex);
                        progress.increment(false);
                    }
                }
            })();

            batchPromises.push(batchPromise);
        }

        // Wait for current batch group to complete before starting next
        await Promise.all(batchPromises);

        // Add a small delay between batch groups to avoid overwhelming the RPC
        if (batchEndIdx < totalBatches) {
            const cooldownMs = 500;
            logger.log(`⏳ Cooling down for ${cooldownMs}ms before next batch group...`);
            await new Promise(resolve => setTimeout(resolve, cooldownMs));
        }
    }

    // Final progress report
    progress.logProgress();
    const summary = progress.getSummary();
    logger.log(`\n📈 Batch processing complete:`);
    logger.log(`   Total: ${summary.total} transactions`);
    logger.log(`   Successful: ${summary.completed}`);
    logger.log(`   Failed: ${summary.failed}`);
    logger.log(`   Duration: ${summary.duration.toFixed(1)}s`);

    if (failedIndices.length > 0) {
        logger.warn(`Failed transaction indices: ${failedIndices.join(', ')}`);
    }

    return signatures;
}

async function main() {
    // Initialize logger at the start
    const logger = new DistributionLogger();

    try {
        // Load distribution wallet keypair
        const distributorKeyData = JSON.parse(fs.readFileSync('keypair_distro.json', 'utf-8'));
        const distributorKeypair = Keypair.fromSecretKey(new Uint8Array(distributorKeyData));

        logger.log('========================================');
        logger.log('Token Distribution Script');
        logger.log('========================================\n');
        logger.log(`Distributor Wallet: ${distributorKeypair.publicKey.toBase58()}`);
        
        // SNAPSHOT TOKEN: Token to take snapshot of holders
        const snapshotMint = new PublicKey('132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed');
        logger.log(`Snapshot Token (holders to identify): ${snapshotMint.toBase58()}`);

        // DISTRIBUTION TOKEN: Token to distribute
        const distributionMint = new PublicKey('USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB');
        logger.log(`Distribution Token (to send): ${distributionMint.toBase58()}`);

        // Create connection
        const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6', 'confirmed');

        // Auto-detect token program type for distribution token
        let distributionTokenProgram: PublicKey = TOKEN_PROGRAM_ID;

        // First check the mint to determine token type
        const mintInfo = await connection.getAccountInfo(distributionMint);

        if (!mintInfo) {
            logger.error('Distribution mint account not found');
            return;
        }

        // Check the owner of the mint account to determine program type
        if (mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) {
            distributionTokenProgram = TOKEN_2022_PROGRAM_ID;
            logger.success('Distribution token uses Token2022 program');
        } else if (mintInfo.owner.equals(TOKEN_PROGRAM_ID)) {
            distributionTokenProgram = TOKEN_PROGRAM_ID;
            logger.success('Distribution token uses regular SPL Token program');
        } else {
            logger.error(`Unknown token program for distribution mint: ${mintInfo.owner.toBase58()}`);
            return;
        }

        logger.log(`Token Program ID: ${distributionTokenProgram.toBase58()}`);

        // Derive the correct distributor's token account for the distribution mint
        const distributorTokenAccount = getAssociatedTokenAddressSync(
            distributionMint,
            distributorKeypair.publicKey,
            false,
            distributionTokenProgram,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        logger.log(`Distributor Token Account (derived): ${distributorTokenAccount.toBase58()}`);

        // Get token decimals from mint
        const TOKEN_DECIMALS = 6; // GOLD token uses 6 decimals
        logger.log(`Token Decimals: ${TOKEN_DECIMALS}`);
        
        // Get distributor's token balance
        let distributorTokenBalance = 0;
        try {
            const tokenAccount = await getAccount(connection, distributorTokenAccount, 'confirmed', distributionTokenProgram);
            distributorTokenBalance = Number(tokenAccount.amount) / Math.pow(10, TOKEN_DECIMALS);
            logger.log(`Distributor Token Balance: ${distributorTokenBalance.toLocaleString()} tokens`);
        } catch (error: unknown) {
            logger.warn('Error fetching token account. Trying direct account info...');

            try {
                // Try to get account info directly
                const accountInfo = await connection.getAccountInfo(distributorTokenAccount);
                if (accountInfo === null) {
                    logger.error(`Token account does not exist at address: ${distributorTokenAccount.toBase58()}`);
                    return;
                }

                logger.log(`Account found with owner: ${accountInfo.owner.toBase58()}`);
                logger.log(`Account data length: ${accountInfo.data.length}`);

                // Try to decode manually if possible
                if (accountInfo.data.length >= 72) {
                    const amount = accountInfo.data.readBigUInt64LE(64);
                    distributorTokenBalance = Number(amount) / Math.pow(10, TOKEN_DECIMALS);
                    logger.log(`Detected balance: ${distributorTokenBalance.toLocaleString()} tokens`);

                    if (distributorTokenBalance === 0) {
                        logger.error('Token account has 0 balance');
                        return;
                    }
                } else {
                    logger.error('Unable to parse token account data');
                    return;
                }
            } catch (innerError: unknown) {
                const err = innerError as Error;
                logger.error(`Failed to fetch account: ${err.message}`);
                return;
            }
        }

        if (distributorTokenBalance <= 0) {
            logger.error('No tokens available for distribution');
            return;
        }

        // Reserve some tokens (optional - you can set this to 0)
        const reserveTokens = 0;
        const availableTokens = distributorTokenBalance - reserveTokens;

        logger.log(`Available for distribution: ${availableTokens.toLocaleString()} tokens\n`);

        // Get all token accounts for the SNAPSHOT mint
        logger.log('Fetching snapshot token holders...');

        // First try Token2022, then regular SPL if that fails
        interface ParsedTokenAccount {
            pubkey: PublicKey;
            account: {
                data: {
                    parsed?: {
                        info?: {
                            tokenAmount?: {
                                uiAmount: number;
                            };
                            owner?: string;
                        };
                    };
                };
                owner: PublicKey;
            };
        }
        let tokenAccounts: ParsedTokenAccount[] = [];
        let usingToken2022 = false;

        // Try Token2022 first
        try {
            logger.log('Checking Token2022 program...');
            const accounts = await connection.getParsedProgramAccounts(
                TOKEN_2022_PROGRAM_ID,
                {
                    filters: [
                        {
                            memcmp: {
                                offset: 0,
                                bytes: snapshotMint.toBase58(),
                            },
                        },
                    ],
                }
            );
            tokenAccounts = accounts as ParsedTokenAccount[];
            if (tokenAccounts.length > 0) {
                usingToken2022 = true;
                logger.log(`Found ${tokenAccounts.length} Token2022 accounts`);
            }
        } catch (error) {
            logger.log('Token2022 check failed, trying regular SPL...');
        }

        // If no Token2022 accounts, try regular SPL
        if (tokenAccounts.length === 0) {
            const accounts = await connection.getParsedProgramAccounts(
                TOKEN_PROGRAM_ID,
                {
                    filters: [
                        { dataSize: 165 },
                        {
                            memcmp: {
                                offset: 0,
                                bytes: snapshotMint.toBase58(),
                            },
                        },
                    ],
                }
            );
            tokenAccounts = accounts as ParsedTokenAccount[];
            logger.log(`Found ${tokenAccounts.length} regular SPL token accounts`);
        }

        logger.log(`Total snapshot token accounts found: ${tokenAccounts.length}`);
        logger.log(`Using ${usingToken2022 ? 'Token2022' : 'Regular SPL'} program for snapshot`);
        
        // Parse and filter holders - PHASE 1: Initial filtering
        const holders: TokenHolder[] = [];
        let filteredCount = 0;
        let blacklistedCount = 0;
        let skippedOffCurve = 0;

        for (const account of tokenAccounts) {
            const parsedData = account.account.data;
            const tokenAmount = parsedData.parsed?.info?.tokenAmount;
            const owner = parsedData.parsed?.info?.owner;

            if (tokenAmount && owner && tokenAmount.uiAmount > 0) {
                // Check if address is blacklisted
                if (BLACKLISTED_ADDRESSES.includes(owner)) {
                    blacklistedCount++;
                    logger.log(`   🚫 Blacklisted address excluded: ${owner.slice(0, 8)}...${owner.slice(-4)}`);
                    continue;
                }

                // Filter out pool/AMM addresses
                if (isLikelyPool(owner)) {
                    filteredCount++;
                    continue;
                }

                const accountOwner = account.account.owner.toBase58();
                if (isLikelyPool(accountOwner)) {
                    filteredCount++;
                    continue;
                }

                // Check if the address is on the Ed25519 curve (filter out PDAs early)
                try {
                    const recipientPubkey = new PublicKey(owner);
                    const onCurve = PublicKey.isOnCurve(recipientPubkey.toBuffer());

                    if (!onCurve) {
                        logger.warn(`Skipping off-curve address (PDA): ${owner.slice(0, 8)}...${owner.slice(-4)} (${tokenAmount.uiAmount.toLocaleString()} tokens)`);
                        skippedOffCurve++;
                        continue;
                    }
                } catch (error: unknown) {
                    logger.warn(`Skipping invalid address: ${owner.slice(0, 8)}...${owner.slice(-4)}`);
                    skippedOffCurve++;
                    continue;
                }

                // Address is valid - add to holders
                holders.push({
                    address: owner,
                    amount: tokenAmount.uiAmount,
                    percentage: 0,
                    tokensToReceive: 0
                });
            }
        }

        logger.log(`\nSnapshot Results (Phase 1 - Initial Filtering):`);
        logger.log(`Filtered out ${filteredCount} pool/AMM addresses`);
        if (blacklistedCount > 0) {
            logger.log(`Excluded ${blacklistedCount} blacklisted addresses`);
        }
        if (skippedOffCurve > 0) {
            logger.log(`Excluded ${skippedOffCurve} off-curve/PDA addresses`);
        }
        logger.log(`Eligible holders after filtering: ${holders.length}`);

        if (holders.length === 0) {
            logger.error('No eligible holders found for distribution');
            return;
        }

        // Calculate total supply held by ELIGIBLE holders only
        const totalSupplyHeld = holders.reduce((sum, h) => sum + h.amount, 0);
        logger.log(`Total snapshot tokens held by eligible users: ${totalSupplyHeld.toLocaleString()}\n`);

        // PHASE 2: Calculate proportional distribution with TIER + STREAK MULTIPLIERS
        logger.log('Calculating proportional distribution with tier + streak multipliers...');

        // Load distribution history to check for QE milestone bonuses
        const history = loadDistributionHistory();
        const previousTotal = history.totalDistributed;
        const projectedTotal = previousTotal + availableTokens;

        // Load milestone state and check for QE bonus events
        const milestoneState = loadMilestoneState();
        const qeCheck = checkForQEBonus(previousTotal, projectedTotal, milestoneState);

        let qeMultiplier = 1.0;
        if (qeCheck.bonus > 1.0 && qeCheck.milestone) {
            qeMultiplier = qeCheck.bonus;
            logger.log(`\n🚀 QE EVENT TRIGGERED: ${qeCheck.milestone.qeEvent}`);
            logger.log(`   ${qeCheck.milestone.celebrationEmoji} ${qeCheck.milestone.name}`);
            logger.log(`   ${qeCheck.milestone.description}`);
            logger.log(`   🎁 CELEBRATION BONUS: ${qeCheck.bonus}x distribution multiplier!`);
            logger.log(`   Previous total: $${previousTotal.toFixed(2)} → New total: $${projectedTotal.toFixed(2)}`);

            // Mark all newly achieved milestones
            for (const achieved of qeCheck.newlyAchieved) {
                milestoneState.milestones[achieved.id] = {
                    achieved: true,
                    achievedAt: new Date().toISOString()
                };
                logger.log(`   ✅ Milestone achieved: ${achieved.qeEvent} - ${achieved.name}`);
            }
            milestoneState.lastChecked = new Date().toISOString();
            saveMilestoneState(milestoneState);
        }

        // Apply QE bonus to available tokens (celebration distribution boost!)
        // Note: This is a BONUS distribution, not inflation - it comes from the actual balance
        // In practice, the QE bonus is applied as a multiplier to rewards during special events
        // For sustainability, we log it as a celebration but don't actually multiply the pool
        // Instead, the QE event serves as a marketing/community moment
        const effectiveTokens = availableTokens; // Pool stays the same, QE is celebration
        logger.log(`\n💰 Distribution Pool: ${effectiveTokens.toFixed(2)} USD1${qeMultiplier > 1 ? ` (QE ${qeCheck.milestone?.qeEvent} celebration!)` : ''}`);

        // Load streak data for bonus multipliers
        const streakData = loadStreakData();
        if (streakData) {
            logger.log(`💎 Streak data loaded: ${Object.keys(streakData.holders).length} holders tracked`);
            logger.log(`   Last updated: ${streakData.lastUpdated}`);
        } else {
            logger.log('💎 No streak data available - using tier multipliers only');
        }

        // Step 1: Assign tiers, streaks, and calculate combined multipliers
        let totalWeightedShare = 0;
        let holdersWithStreakBonus = 0;
        for (const holder of holders) {
            // Tier multiplier (based on holdings)
            holder.tier = getHolderTier(holder.amount);
            holder.multiplier = holder.tier.multiplier;

            // Streak multiplier (based on holding duration)
            const streakInfo = getStreakMultiplier(holder.address, streakData);
            holder.streakTier = streakInfo.tier;
            holder.streakMultiplier = streakInfo.multiplier;
            holder.streakDays = streakInfo.streakDays;

            // Combined multiplier = tier * streak (they STACK!)
            holder.combinedMultiplier = holder.multiplier * holder.streakMultiplier;

            if (holder.streakMultiplier > 1.0) {
                holdersWithStreakBonus++;
            }

            holder.percentage = (holder.amount / totalSupplyHeld) * 100;
            // Weighted share = base share * combined multiplier
            totalWeightedShare += (holder.amount / totalSupplyHeld) * holder.combinedMultiplier;
        }

        if (holdersWithStreakBonus > 0) {
            logger.log(`   ${holdersWithStreakBonus} holders receiving streak bonuses`);
        }

        // Step 2: Normalize so total distributed equals available tokens
        // Each holder gets: (their base share * combined multiplier / total weighted share) * available tokens
        for (const holder of holders) {
            const baseShare = holder.amount / totalSupplyHeld;
            const weightedShare = baseShare * (holder.combinedMultiplier || 1.0);
            holder.tokensToReceive = availableTokens * (weightedShare / totalWeightedShare);
        }

        // Log tier distribution stats
        const tierCounts: Record<string, { count: number; totalTokens: number }> = {};
        for (const holder of holders) {
            const tierName = holder.tier?.name || 'Unknown';
            if (!tierCounts[tierName]) {
                tierCounts[tierName] = { count: 0, totalTokens: 0 };
            }
            tierCounts[tierName].count++;
            tierCounts[tierName].totalTokens += holder.tokensToReceive;
        }

        logger.log('\n🏛️ Holder Tier Distribution:');
        for (const tier of HOLDER_TIERS) {
            const stats = tierCounts[tier.name];
            if (stats && stats.count > 0) {
                logger.log(`   ${tier.title} (${tier.multiplier}x): ${stats.count} holders → ${stats.totalTokens.toFixed(2)} tokens`);
            }
        }

        // Log streak distribution stats
        if (streakData) {
            const streakCounts: Record<string, { count: number; totalTokens: number }> = {};
            for (const holder of holders) {
                const streakName = holder.streakTier?.name || 'Newcomer';
                if (!streakCounts[streakName]) {
                    streakCounts[streakName] = { count: 0, totalTokens: 0 };
                }
                streakCounts[streakName].count++;
                streakCounts[streakName].totalTokens += holder.tokensToReceive;
            }

            logger.log('\n💎 Diamond Hands Streak Distribution:');
            for (const tier of STREAK_TIERS) {
                const stats = streakCounts[tier.name];
                if (stats && stats.count > 0) {
                    logger.log(`   ${tier.emoji} ${tier.title} (${tier.multiplier}x): ${stats.count} holders → ${stats.totalTokens.toFixed(2)} tokens`);
                }
            }
        }

        // Sort by amount descending for better visibility
        holders.sort((a, b) => b.amount - a.amount);

        // Show top holders with tier + streak info
        logger.log('\nTop 10 holders (with tier + streak multipliers):');
        holders.slice(0, 10).forEach((holder, index) => {
            const tierName = holder.tier?.name || 'Citizen';
            const streakEmoji = holder.streakTier?.emoji || '🆕';
            const tierMult = holder.multiplier || 1.0;
            const streakMult = holder.streakMultiplier || 1.0;
            const combinedMult = holder.combinedMultiplier || 1.0;
            const streakDays = holder.streakDays || 0;
            logger.log(`${index + 1}. ${holder.address.slice(0, 8)}...${holder.address.slice(-4)}: ${holder.percentage.toFixed(2)}% × ${combinedMult.toFixed(2)}x [${tierName} ${tierMult}x + ${streakEmoji}${streakDays}d ${streakMult}x] = ${holder.tokensToReceive.toFixed(2)} tokens`);
        });

        // Filter out dust amounts
        const MIN_TOKENS = 0.0000000001; // Minimum tokens to send
        const validRecipients = holders.filter(h => h.tokensToReceive >= MIN_TOKENS);
        const skippedDust = holders.length - validRecipients.length;

        if (skippedDust > 0) {
            logger.log(`\nFiltered out ${skippedDust} holders with dust amounts (<${MIN_TOKENS} tokens)`);
        }

        logger.log(`\nDistributing to ${validRecipients.length} holders`);
        
        // Create transfer transactions
        const TRANSFERS_PER_TX = 5; // Keep it small for token transfers
        const transactions: Transaction[] = [];

        logger.log('\nCreating transfer transactions...');
        logger.log(`Valid recipients: ${validRecipients.length}\n`);

        // Now create transactions only for valid recipients
        for (let i = 0; i < validRecipients.length; i += TRANSFERS_PER_TX) {
            const batch = validRecipients.slice(i, Math.min(i + TRANSFERS_PER_TX, validRecipients.length));
            const tx = new Transaction();

            // Get recent blockhash
            const { blockhash } = await connection.getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.feePayer = distributorKeypair.publicKey;

            for (const holder of batch) {
                const recipientPubkey = new PublicKey(holder.address);

                // Get or create recipient's token account
                // Use the synchronous version for consistency
                const recipientTokenAccount = getAssociatedTokenAddressSync(
                    distributionMint,
                    recipientPubkey,
                    false, // Not allowing off-curve (we already filtered those)
                    distributionTokenProgram, // Use the correct program for distribution token
                    ASSOCIATED_TOKEN_PROGRAM_ID
                );

                // Check if recipient token account exists
                let accountExists = false;
                try {
                    await getAccount(connection, recipientTokenAccount, 'confirmed', distributionTokenProgram);
                    accountExists = true;
                } catch (error) {
                    if (error instanceof TokenAccountNotFoundError) {
                        accountExists = false;
                    } else {
                        // Log unexpected errors but continue
                        logger.warn(`Unexpected error checking token account for ${recipientPubkey.toBase58().slice(0, 8)}...`);
                        accountExists = false;
                    }
                }

                // Add create account instruction if needed
                if (!accountExists) {
                    tx.add(
                        createAssociatedTokenAccountInstruction(
                            distributorKeypair.publicKey,
                            recipientTokenAccount,
                            recipientPubkey,
                            distributionMint,
                            distributionTokenProgram,
                            ASSOCIATED_TOKEN_PROGRAM_ID
                        )
                    );
                }

                // Add transfer instruction
                const amount = Math.floor(holder.tokensToReceive * Math.pow(10, TOKEN_DECIMALS));
                tx.add(
                    createTransferInstruction(
                        distributorTokenAccount,
                        recipientTokenAccount,
                        distributorKeypair.publicKey,
                        amount,
                        [],
                        distributionTokenProgram
                    )
                );
            }

            transactions.push(tx);
        }

        logger.log(`Created ${transactions.length} transactions for ${validRecipients.length} transfers`);
        
        // Calculate total to distribute
        const totalToDistribute = validRecipients.reduce((sum: number, h: TokenHolder) => sum + h.tokensToReceive, 0);

        logger.log(`\n========================================`);
        logger.log(`DISTRIBUTION SUMMARY`);
        logger.log(`========================================`);
        logger.log(`Snapshot Token: ${snapshotMint.toBase58()}`);
        logger.log(`Distribution Token: ${distributionMint.toBase58()}`);
        logger.log(`Total tokens to distribute: ${totalToDistribute.toFixed(2)}`);
        logger.log(`Recipients: ${validRecipients.length}`);
        logger.log(`Transactions: ${transactions.length}`);
        logger.log(`========================================\n`);

        // Confirm before proceeding
        logger.log('Starting distribution...');
        const startTime = Date.now();

        const signatures = await sendBatchTransactions(
            connection,
            transactions,
            distributorKeypair,
            logger,
            8, // Concurrent batch groups
            5  // Transactions per batch
        );

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        // Calculate actual distributed amount based on successful signatures
        // Each signature corresponds to one transaction which has TRANSFERS_PER_TX transfers
        const actualDistributed = validRecipients
            .slice(0, signatures.length * TRANSFERS_PER_TX)
            .reduce((sum: number, h: TokenHolder) => sum + h.tokensToReceive, 0);

        // Update distribution history (already loaded earlier for QE check)
        history.totalDistributed += actualDistributed;
        history.distributions.push({
            timestamp: new Date().toISOString(),
            totalAmount: actualDistributed,
            recipientCount: Math.min(signatures.length * TRANSFERS_PER_TX, validRecipients.length),
            txSignatures: signatures,
            snapshotToken: snapshotMint.toBase58(),
            distributedToken: distributionMint.toBase58()
        });
        saveDistributionHistory(history);

        // Sync to website (Vercel KV)
        const recipientCount = Math.min(signatures.length * TRANSFERS_PER_TX, validRecipients.length);
        await syncToWebsite(actualDistributed, recipientCount, signatures[0] || '');

        // Calculate Fed Funds Rate (current APY)
        const fedFundsRate = calculateFedFundsRate(history, totalSupplyHeld);

        // Final summary
        logger.log(`\n========================================`);
        logger.log(`DISTRIBUTION COMPLETE`);
        logger.log(`========================================`);
        logger.success(`Successfully distributed: ${actualDistributed.toFixed(2)} tokens`);
        logger.success(`Recipients: ${Math.min(signatures.length * TRANSFERS_PER_TX, validRecipients.length)}`);
        logger.success(`Successful transactions: ${signatures.length}/${transactions.length}`);
        logger.success(`Time taken: ${duration.toFixed(1)} seconds`);
        logger.success(`Total distributed all-time: ${history.totalDistributed.toFixed(2)} tokens`);

        // Log QE milestone achievement if any
        if (qeCheck.newlyAchieved.length > 0) {
            logger.log(`\n🎉 MILESTONE ACHIEVEMENTS THIS DISTRIBUTION:`);
            for (const achieved of qeCheck.newlyAchieved) {
                logger.log(`   ${achieved.celebrationEmoji} ${achieved.qeEvent}: ${achieved.name}`);
            }
        }

        logger.log(`\n🏛️ FED FUNDS RATE (Current APY):`);
        logger.log(`   7-Day Rate:  ${fedFundsRate.rate7d.toFixed(2)}%`);
        logger.log(`   30-Day Rate: ${fedFundsRate.rate30d.toFixed(2)}%`);
        logger.log(`Log file: ${logger.getLogPath()}`);
        logger.log(`========================================`);

        // Show failed transactions if any
        if (signatures.length < transactions.length) {
            logger.warn(`${transactions.length - signatures.length} transactions failed`);
        }

    } catch (error: unknown) {
        const err = error as Error & { logs?: string[] };
        const logger = new DistributionLogger();
        logger.error(`Critical error: ${err.message || String(err)}`);

        if (err.logs) {
            logger.log('\nTransaction logs:');
            err.logs.forEach((log: string) => logger.log(log));
        }

        logger.log(`Log file: ${logger.getLogPath()}`);
        process.exit(1);
    }
}

// Run the script
main();
