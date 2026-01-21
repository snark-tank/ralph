/**
 * Fed Time Lock - Boosted Rewards Through Voluntary Commitment
 *
 * Inspired by: Curve's veCRV model, 2026 DeFi time-weighted staking trends
 *
 * A voluntary commitment system where holders can "lock" their intention to hold
 * for a specified period in exchange for additional reward multipliers.
 *
 * KEY DIFFERENCE FROM OTHER PROTOCOLS:
 * - NO actual token locking (tokens remain fully liquid in wallet)
 * - Commitment is tracked off-chain via signatures/acknowledgment
 * - Breaking commitment (selling) removes the bonus retroactively
 * - "Soft lock" approach - trust-based with reputation consequences
 *
 * This creates token velocity reduction INCENTIVES without the risks of
 * smart contract locks (hacks, protocol failures, illiquidity).
 *
 * Lock Tiers (Time-Weighted Multipliers):
 * - 1 week:   1.05x (Fed Pledge)
 * - 1 month:  1.15x (Fed Promise)
 * - 3 months: 1.3x  (Fed Oath)
 * - 6 months: 1.5x  (Fed Vow)
 * - 1 year:   1.75x (Fed Covenant)
 * - 2 years:  2.0x  (Fed Bond) - Maximum commitment
 *
 * Commitment Health:
 * - If holder maintains balance through lock period: Full multiplier applies
 * - If holder sells ANY tokens before lock expires: Commitment is broken
 * - Broken commitments reduce Fed Credit Score significantly
 * - Successful completions boost Credit Score and unlock special badges
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════════════════════
// TYPES AND INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

interface TimeLockTier {
    id: string;
    name: string;
    title: string;
    durationDays: number;
    multiplier: number;
    emoji: string;
    description: string;
    creditScoreBonus: number;     // Bonus to credit score on completion
    creditScorePenalty: number;   // Penalty for breaking commitment
}

interface TimeLockCommitment {
    address: string;
    tierId: string;
    tierName: string;
    multiplier: number;
    startDate: string;           // ISO date when commitment started
    endDate: string;             // ISO date when commitment ends
    lockedAmount: number;        // Amount at time of commitment
    currentAmount: number;       // Current balance (updated on check)
    status: 'active' | 'completed' | 'broken' | 'expired';
    completedAt?: string;
    brokenAt?: string;
    brokenReason?: string;
    commitmentHistory: CommitmentEvent[];
}

interface CommitmentEvent {
    timestamp: string;
    event: 'started' | 'renewed' | 'completed' | 'broken' | 'balance_check';
    details: string;
    balanceAtEvent?: number;
}

interface HolderTimeLockData {
    address: string;
    activeCommitment?: TimeLockCommitment;
    completedCommitments: number;
    brokenCommitments: number;
    totalMultiplierDays: number;   // Days * multiplier earned lifetime
    longestCommitment: number;     // Days
    currentStreak: number;         // Consecutive successful commitments
    bestStreak: number;
    lastActivity: string;
    badges: string[];
}

interface TimeLockDataStore {
    holders: { [address: string]: HolderTimeLockData };
    globalStats: {
        totalActiveCommitments: number;
        totalCompletedCommitments: number;
        totalBrokenCommitments: number;
        totalMultiplierDaysAwarded: number;
        averageCommitmentDuration: number;
        tierDistribution: { [tierId: string]: number };
    };
    lastUpdated: string;
    version: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TIME LOCK TIER DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

const TIME_LOCK_TIERS: TimeLockTier[] = [
    {
        id: 'pledge',
        name: 'Fed Pledge',
        title: 'Weekly Commitment',
        durationDays: 7,
        multiplier: 1.05,
        emoji: '📝',
        description: 'A week-long commitment to the Fed. Perfect for testing the waters.',
        creditScoreBonus: 5,
        creditScorePenalty: 10
    },
    {
        id: 'promise',
        name: 'Fed Promise',
        title: 'Monthly Commitment',
        durationDays: 30,
        multiplier: 1.15,
        emoji: '🤝',
        description: 'A month-long promise to hold. Shows real conviction.',
        creditScoreBonus: 15,
        creditScorePenalty: 25
    },
    {
        id: 'oath',
        name: 'Fed Oath',
        title: 'Quarterly Commitment',
        durationDays: 90,
        multiplier: 1.3,
        emoji: '⚖️',
        description: 'A 3-month oath of loyalty. True believers only.',
        creditScoreBonus: 35,
        creditScorePenalty: 50
    },
    {
        id: 'vow',
        name: 'Fed Vow',
        title: 'Half-Year Commitment',
        durationDays: 180,
        multiplier: 1.5,
        emoji: '💍',
        description: 'A 6-month vow of unwavering support. Diamond hands incoming.',
        creditScoreBonus: 60,
        creditScorePenalty: 80
    },
    {
        id: 'covenant',
        name: 'Fed Covenant',
        title: 'Annual Commitment',
        durationDays: 365,
        multiplier: 1.75,
        emoji: '📜',
        description: 'A sacred 1-year covenant with the Federal Reserve. Legendary status.',
        creditScoreBonus: 100,
        creditScorePenalty: 120
    },
    {
        id: 'bond',
        name: 'Fed Bond',
        title: 'Maximum Commitment',
        durationDays: 730,
        multiplier: 2.0,
        emoji: '🏛️',
        description: 'The ultimate 2-year bond. Reserved for true Fed founders. Maximum BRRR.',
        creditScoreBonus: 200,
        creditScorePenalty: 250
    }
];

// Badges earned through time lock achievements
const TIME_LOCK_BADGES = {
    'First Commitment': 'Complete your first time lock commitment',
    'Promise Keeper': 'Complete 3 commitments without breaking any',
    'Oath Taker': 'Complete a Fed Oath (90 days)',
    'Sacred Vow': 'Complete a Fed Vow (180 days)',
    'Covenant Holder': 'Complete a Fed Covenant (365 days)',
    'Bonded Forever': 'Complete a Fed Bond (730 days)',
    'Perfect Record': 'Complete 10 commitments with 0 breaks',
    'Diamond Commitment': 'Maintain commitment through a 30%+ price drop',
    'Multi-Term': 'Complete 5+ consecutive commitments',
    'Foundation Stone': 'Among first 100 to complete a Fed Covenant'
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA PERSISTENCE
// ═══════════════════════════════════════════════════════════════════════════

const DATA_FILE = path.join(__dirname, 'time-lock-data.json');

function loadTimeLockData(): TimeLockDataStore {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
            return data;
        }
    } catch (error) {
        console.warn('⚠️ Could not load time lock data, starting fresh');
    }

    return {
        holders: {},
        globalStats: {
            totalActiveCommitments: 0,
            totalCompletedCommitments: 0,
            totalBrokenCommitments: 0,
            totalMultiplierDaysAwarded: 0,
            averageCommitmentDuration: 0,
            tierDistribution: {}
        },
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
    };
}

function saveTimeLockData(data: TimeLockDataStore): void {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get tier info by ID
 */
function getTierById(tierId: string): TimeLockTier | undefined {
    return TIME_LOCK_TIERS.find(t => t.id === tierId);
}

/**
 * Get all available tiers
 */
export function getAvailableTiers(): TimeLockTier[] {
    return TIME_LOCK_TIERS;
}

/**
 * Create a new time lock commitment
 */
export function createCommitment(
    address: string,
    tierId: string,
    currentBalance: number
): { success: boolean; message: string; commitment?: TimeLockCommitment } {
    const data = loadTimeLockData();
    const tier = getTierById(tierId);

    if (!tier) {
        return { success: false, message: `Invalid tier: ${tierId}` };
    }

    // Initialize holder data if needed
    if (!data.holders[address]) {
        data.holders[address] = {
            address,
            completedCommitments: 0,
            brokenCommitments: 0,
            totalMultiplierDays: 0,
            longestCommitment: 0,
            currentStreak: 0,
            bestStreak: 0,
            lastActivity: new Date().toISOString(),
            badges: []
        };
    }

    const holder = data.holders[address];

    // Check if already has active commitment
    if (holder.activeCommitment && holder.activeCommitment.status === 'active') {
        return {
            success: false,
            message: `Already have an active ${holder.activeCommitment.tierName} commitment. Complete or break current commitment first.`
        };
    }

    // Validate minimum balance (at least 1000 $FED to make commitment)
    if (currentBalance < 1000) {
        return {
            success: false,
            message: 'Minimum 1,000 $FED required to create a time lock commitment'
        };
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + tier.durationDays * 24 * 60 * 60 * 1000);

    const commitment: TimeLockCommitment = {
        address,
        tierId: tier.id,
        tierName: tier.name,
        multiplier: tier.multiplier,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        lockedAmount: currentBalance,
        currentAmount: currentBalance,
        status: 'active',
        commitmentHistory: [{
            timestamp: now.toISOString(),
            event: 'started',
            details: `Started ${tier.name} commitment for ${tier.durationDays} days`,
            balanceAtEvent: currentBalance
        }]
    };

    holder.activeCommitment = commitment;
    holder.lastActivity = now.toISOString();

    // Update global stats
    data.globalStats.totalActiveCommitments++;
    data.globalStats.tierDistribution[tierId] = (data.globalStats.tierDistribution[tierId] || 0) + 1;

    saveTimeLockData(data);

    return {
        success: true,
        message: `✅ ${tier.emoji} ${tier.name} commitment created! Hold your ${currentBalance.toLocaleString()} $FED until ${endDate.toLocaleDateString()} for ${tier.multiplier}x rewards.`,
        commitment
    };
}

/**
 * Check and update commitment status based on current balance
 */
export function checkCommitment(
    address: string,
    currentBalance: number
): { status: string; multiplier: number; daysRemaining: number; message: string } {
    const data = loadTimeLockData();
    const holder = data.holders[address];

    if (!holder || !holder.activeCommitment) {
        return {
            status: 'none',
            multiplier: 1.0,
            daysRemaining: 0,
            message: 'No active time lock commitment'
        };
    }

    const commitment = holder.activeCommitment;
    const now = new Date();
    const endDate = new Date(commitment.endDate);
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

    // Update current amount
    commitment.currentAmount = currentBalance;
    commitment.commitmentHistory.push({
        timestamp: now.toISOString(),
        event: 'balance_check',
        details: `Balance check: ${currentBalance.toLocaleString()} $FED`,
        balanceAtEvent: currentBalance
    });

    // Check if commitment is broken (sold tokens)
    if (currentBalance < commitment.lockedAmount * 0.95) { // 5% tolerance for fees/dust
        commitment.status = 'broken';
        commitment.brokenAt = now.toISOString();
        commitment.brokenReason = `Balance dropped from ${commitment.lockedAmount.toLocaleString()} to ${currentBalance.toLocaleString()} $FED`;

        commitment.commitmentHistory.push({
            timestamp: now.toISOString(),
            event: 'broken',
            details: commitment.brokenReason,
            balanceAtEvent: currentBalance
        });

        // Update holder stats
        holder.brokenCommitments++;
        holder.currentStreak = 0;

        // Update global stats
        data.globalStats.totalActiveCommitments--;
        data.globalStats.totalBrokenCommitments++;

        saveTimeLockData(data);

        const tier = getTierById(commitment.tierId);
        return {
            status: 'broken',
            multiplier: 1.0,
            daysRemaining: 0,
            message: `❌ Commitment BROKEN! Balance dropped below locked amount. Credit score penalty: -${tier?.creditScorePenalty || 0} points.`
        };
    }

    // Check if commitment is completed
    if (now >= endDate) {
        commitment.status = 'completed';
        commitment.completedAt = now.toISOString();

        commitment.commitmentHistory.push({
            timestamp: now.toISOString(),
            event: 'completed',
            details: `Successfully completed ${commitment.tierName} commitment!`,
            balanceAtEvent: currentBalance
        });

        const tier = getTierById(commitment.tierId);
        const daysCompleted = tier?.durationDays || 0;

        // Update holder stats
        holder.completedCommitments++;
        holder.currentStreak++;
        holder.bestStreak = Math.max(holder.bestStreak, holder.currentStreak);
        holder.totalMultiplierDays += daysCompleted * commitment.multiplier;
        holder.longestCommitment = Math.max(holder.longestCommitment, daysCompleted);

        // Award badges
        awardBadges(holder, commitment, daysCompleted);

        // Clear active commitment
        holder.activeCommitment = undefined;

        // Update global stats
        data.globalStats.totalActiveCommitments--;
        data.globalStats.totalCompletedCommitments++;
        data.globalStats.totalMultiplierDaysAwarded += daysCompleted * commitment.multiplier;

        saveTimeLockData(data);

        return {
            status: 'completed',
            multiplier: 1.0, // Multiplier was applied during the lock period
            daysRemaining: 0,
            message: `🎉 Commitment COMPLETED! ${tier?.emoji || '✅'} ${commitment.tierName} finished. Credit score bonus: +${tier?.creditScoreBonus || 0} points!`
        };
    }

    // Commitment is still active
    saveTimeLockData(data);

    return {
        status: 'active',
        multiplier: commitment.multiplier,
        daysRemaining,
        message: `🔒 Active ${commitment.tierName}: ${daysRemaining} days remaining. Earning ${commitment.multiplier}x rewards!`
    };
}

/**
 * Get time lock multiplier for distribution calculations
 */
export function getTimeLockMultiplier(address: string): number {
    const data = loadTimeLockData();
    const holder = data.holders[address];

    if (!holder || !holder.activeCommitment) {
        return 1.0;
    }

    if (holder.activeCommitment.status !== 'active') {
        return 1.0;
    }

    const now = new Date();
    const endDate = new Date(holder.activeCommitment.endDate);

    if (now >= endDate) {
        return 1.0; // Expired, needs to be checked/renewed
    }

    return holder.activeCommitment.multiplier;
}

/**
 * Award badges based on achievements
 */
function awardBadges(holder: HolderTimeLockData, commitment: TimeLockCommitment, daysCompleted: number): void {
    const newBadges: string[] = [];

    // First Commitment
    if (holder.completedCommitments === 1 && !holder.badges.includes('First Commitment')) {
        newBadges.push('First Commitment');
    }

    // Promise Keeper (3 without breaks)
    if (holder.completedCommitments >= 3 && holder.brokenCommitments === 0 && !holder.badges.includes('Promise Keeper')) {
        newBadges.push('Promise Keeper');
    }

    // Tier-specific badges
    if (daysCompleted >= 90 && !holder.badges.includes('Oath Taker')) {
        newBadges.push('Oath Taker');
    }
    if (daysCompleted >= 180 && !holder.badges.includes('Sacred Vow')) {
        newBadges.push('Sacred Vow');
    }
    if (daysCompleted >= 365 && !holder.badges.includes('Covenant Holder')) {
        newBadges.push('Covenant Holder');
    }
    if (daysCompleted >= 730 && !holder.badges.includes('Bonded Forever')) {
        newBadges.push('Bonded Forever');
    }

    // Perfect Record (10 completions, 0 breaks)
    if (holder.completedCommitments >= 10 && holder.brokenCommitments === 0 && !holder.badges.includes('Perfect Record')) {
        newBadges.push('Perfect Record');
    }

    // Multi-Term (5+ consecutive)
    if (holder.currentStreak >= 5 && !holder.badges.includes('Multi-Term')) {
        newBadges.push('Multi-Term');
    }

    holder.badges.push(...newBadges);
}

/**
 * Get holder's time lock status and history
 */
export function getHolderStatus(address: string): HolderTimeLockData | null {
    const data = loadTimeLockData();
    return data.holders[address] || null;
}

/**
 * Get leaderboard of top time lock participants
 */
export function getLeaderboard(limit: number = 20): HolderTimeLockData[] {
    const data = loadTimeLockData();

    return Object.values(data.holders)
        .filter(h => h.completedCommitments > 0 || h.activeCommitment?.status === 'active')
        .sort((a, b) => {
            // Sort by: active commitment > completed count > total multiplier days
            const aActive = a.activeCommitment?.status === 'active' ? 1 : 0;
            const bActive = b.activeCommitment?.status === 'active' ? 1 : 0;
            if (aActive !== bActive) return bActive - aActive;
            if (a.completedCommitments !== b.completedCommitments) {
                return b.completedCommitments - a.completedCommitments;
            }
            return b.totalMultiplierDays - a.totalMultiplierDays;
        })
        .slice(0, limit);
}

/**
 * Get global statistics
 */
export function getGlobalStats(): TimeLockDataStore['globalStats'] & { tiers: TimeLockTier[] } {
    const data = loadTimeLockData();
    return {
        ...data.globalStats,
        tiers: TIME_LOCK_TIERS
    };
}

/**
 * Break commitment voluntarily (user wants out)
 */
export function breakCommitment(address: string, reason: string = 'Voluntary exit'): { success: boolean; message: string } {
    const data = loadTimeLockData();
    const holder = data.holders[address];

    if (!holder || !holder.activeCommitment || holder.activeCommitment.status !== 'active') {
        return { success: false, message: 'No active commitment to break' };
    }

    const commitment = holder.activeCommitment;
    const tier = getTierById(commitment.tierId);
    const now = new Date();

    commitment.status = 'broken';
    commitment.brokenAt = now.toISOString();
    commitment.brokenReason = reason;

    commitment.commitmentHistory.push({
        timestamp: now.toISOString(),
        event: 'broken',
        details: `Voluntarily broken: ${reason}`
    });

    holder.brokenCommitments++;
    holder.currentStreak = 0;

    data.globalStats.totalActiveCommitments--;
    data.globalStats.totalBrokenCommitments++;

    saveTimeLockData(data);

    return {
        success: true,
        message: `⚠️ Commitment broken. Credit score penalty: -${tier?.creditScorePenalty || 0} points. You can start a new commitment anytime.`
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

function printHeader(): void {
    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║          🔒 FED TIME LOCK - Boosted Rewards System 🔒            ║');
    console.log('║              Commit to Hold. Earn More BRRR.                     ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');
}

function printTiers(): void {
    console.log('📊 AVAILABLE TIME LOCK TIERS:\n');
    console.log('┌──────────────┬──────────────────┬──────────┬────────────┬─────────────┐');
    console.log('│ Tier         │ Duration         │ Multiply │ CS Bonus   │ CS Penalty  │');
    console.log('├──────────────┼──────────────────┼──────────┼────────────┼─────────────┤');

    for (const tier of TIME_LOCK_TIERS) {
        const duration = tier.durationDays < 30
            ? `${tier.durationDays} days`
            : tier.durationDays < 365
                ? `${Math.floor(tier.durationDays / 30)} month${tier.durationDays >= 60 ? 's' : ''}`
                : `${Math.floor(tier.durationDays / 365)} year${tier.durationDays >= 730 ? 's' : ''}`;

        console.log(`│ ${tier.emoji} ${tier.name.padEnd(10)} │ ${duration.padEnd(16)} │ ${(tier.multiplier + 'x').padEnd(8)} │ +${String(tier.creditScoreBonus).padEnd(9)} │ -${String(tier.creditScorePenalty).padEnd(10)}│`);
    }

    console.log('└──────────────┴──────────────────┴──────────┴────────────┴─────────────┘');
    console.log('\n💡 CS = Credit Score. Bonus awarded on completion, penalty on breaking.\n');
}

function printHolderStatus(holder: HolderTimeLockData): void {
    console.log(`\n👤 HOLDER STATUS: ${holder.address.slice(0, 8)}...${holder.address.slice(-6)}`);
    console.log('═'.repeat(60));

    if (holder.activeCommitment && holder.activeCommitment.status === 'active') {
        const c = holder.activeCommitment;
        const now = new Date();
        const end = new Date(c.endDate);
        const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
        const progress = Math.round(((new Date(c.startDate).getTime() - now.getTime()) / (new Date(c.startDate).getTime() - end.getTime())) * 100);

        console.log(`\n🔒 ACTIVE COMMITMENT: ${c.tierName}`);
        console.log(`   Multiplier: ${c.multiplier}x`);
        console.log(`   Days Remaining: ${daysRemaining}`);
        console.log(`   Locked Amount: ${c.lockedAmount.toLocaleString()} $FED`);
        console.log(`   Current Amount: ${c.currentAmount.toLocaleString()} $FED`);
        console.log(`   Progress: ${Math.min(100, Math.max(0, 100 - progress))}%`);
        console.log(`   Ends: ${end.toLocaleDateString()}`);
    } else {
        console.log('\n📭 No active commitment');
    }

    console.log('\n📈 LIFETIME STATS:');
    console.log(`   Completed: ${holder.completedCommitments}`);
    console.log(`   Broken: ${holder.brokenCommitments}`);
    console.log(`   Current Streak: ${holder.currentStreak}`);
    console.log(`   Best Streak: ${holder.bestStreak}`);
    console.log(`   Longest Commitment: ${holder.longestCommitment} days`);
    console.log(`   Total Multiplier Days: ${holder.totalMultiplierDays.toFixed(1)}`);

    if (holder.badges.length > 0) {
        console.log('\n🏅 BADGES:');
        holder.badges.forEach(b => console.log(`   🎖️ ${b}`));
    }
}

function printLeaderboard(entries: HolderTimeLockData[]): void {
    console.log('\n🏆 TIME LOCK LEADERBOARD\n');
    console.log('┌────┬────────────────────┬──────────┬────────┬─────────┬────────────┐');
    console.log('│ #  │ Address            │ Complete │ Streak │ Longest │ Active     │');
    console.log('├────┼────────────────────┼──────────┼────────┼─────────┼────────────┤');

    entries.forEach((h, i) => {
        const addr = `${h.address.slice(0, 6)}...${h.address.slice(-4)}`;
        const active = h.activeCommitment?.status === 'active'
            ? h.activeCommitment.tierName.replace('Fed ', '')
            : '-';
        console.log(`│ ${String(i + 1).padStart(2)} │ ${addr.padEnd(18)} │ ${String(h.completedCommitments).padEnd(8)} │ ${String(h.currentStreak).padEnd(6)} │ ${String(h.longestCommitment).padEnd(7)} │ ${active.padEnd(10)} │`);
    });

    console.log('└────┴────────────────────┴──────────┴────────┴─────────┴────────────┘');
}

function printGlobalStats(): void {
    const stats = getGlobalStats();

    console.log('\n📊 GLOBAL TIME LOCK STATISTICS\n');
    console.log(`   Active Commitments:    ${stats.totalActiveCommitments}`);
    console.log(`   Completed Commitments: ${stats.totalCompletedCommitments}`);
    console.log(`   Broken Commitments:    ${stats.totalBrokenCommitments}`);
    console.log(`   Total Multiplier Days: ${stats.totalMultiplierDaysAwarded.toFixed(1)}`);

    if (stats.totalCompletedCommitments > 0) {
        const successRate = ((stats.totalCompletedCommitments / (stats.totalCompletedCommitments + stats.totalBrokenCommitments)) * 100).toFixed(1);
        console.log(`   Success Rate:          ${successRate}%`);
    }

    console.log('\n   Tier Distribution:');
    for (const tier of TIME_LOCK_TIERS) {
        const count = stats.tierDistribution[tier.id] || 0;
        console.log(`   ${tier.emoji} ${tier.name}: ${count} active`);
    }
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    printHeader();

    if (args.length === 0 || args.includes('--help')) {
        console.log('USAGE:');
        console.log('  npx ts-node time-lock.ts --tiers                    Show all lock tiers');
        console.log('  npx ts-node time-lock.ts --create <address> <tier> <balance>  Create commitment');
        console.log('  npx ts-node time-lock.ts --check <address> <balance>          Check commitment');
        console.log('  npx ts-node time-lock.ts --status <address>         Get holder status');
        console.log('  npx ts-node time-lock.ts --break <address>          Break commitment');
        console.log('  npx ts-node time-lock.ts --leaderboard [limit]      Show leaderboard');
        console.log('  npx ts-node time-lock.ts --stats                    Global statistics');
        console.log('  npx ts-node time-lock.ts --json                     Output as JSON');
        console.log('\nEXAMPLES:');
        console.log('  npx ts-node time-lock.ts --create ABC123 promise 5000000');
        console.log('  npx ts-node time-lock.ts --check ABC123 5000000');
        console.log('  npx ts-node time-lock.ts --leaderboard 10');
        return;
    }

    const jsonOutput = args.includes('--json');

    if (args.includes('--tiers')) {
        if (jsonOutput) {
            console.log(JSON.stringify(TIME_LOCK_TIERS, null, 2));
        } else {
            printTiers();
        }
        return;
    }

    if (args.includes('--create')) {
        const idx = args.indexOf('--create');
        const address = args[idx + 1];
        const tierId = args[idx + 2];
        const balance = parseFloat(args[idx + 3]);

        if (!address || !tierId || isNaN(balance)) {
            console.log('❌ Usage: --create <address> <tier> <balance>');
            console.log('   Tiers: pledge, promise, oath, vow, covenant, bond');
            return;
        }

        const result = createCommitment(address, tierId, balance);

        if (jsonOutput) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log(result.message);
        }
        return;
    }

    if (args.includes('--check')) {
        const idx = args.indexOf('--check');
        const address = args[idx + 1];
        const balance = parseFloat(args[idx + 2]);

        if (!address || isNaN(balance)) {
            console.log('❌ Usage: --check <address> <balance>');
            return;
        }

        const result = checkCommitment(address, balance);

        if (jsonOutput) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log(result.message);
            if (result.status === 'active') {
                console.log(`   Days remaining: ${result.daysRemaining}`);
                console.log(`   Current multiplier: ${result.multiplier}x`);
            }
        }
        return;
    }

    if (args.includes('--status')) {
        const idx = args.indexOf('--status');
        const address = args[idx + 1];

        if (!address) {
            console.log('❌ Usage: --status <address>');
            return;
        }

        const holder = getHolderStatus(address);

        if (jsonOutput) {
            console.log(JSON.stringify(holder, null, 2));
        } else if (holder) {
            printHolderStatus(holder);
        } else {
            console.log('📭 No time lock data for this address');
        }
        return;
    }

    if (args.includes('--break')) {
        const idx = args.indexOf('--break');
        const address = args[idx + 1];

        if (!address) {
            console.log('❌ Usage: --break <address>');
            return;
        }

        const result = breakCommitment(address);

        if (jsonOutput) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log(result.message);
        }
        return;
    }

    if (args.includes('--leaderboard')) {
        const idx = args.indexOf('--leaderboard');
        const limit = parseInt(args[idx + 1]) || 20;

        const entries = getLeaderboard(limit);

        if (jsonOutput) {
            console.log(JSON.stringify(entries, null, 2));
        } else {
            printLeaderboard(entries);
        }
        return;
    }

    if (args.includes('--stats')) {
        const stats = getGlobalStats();

        if (jsonOutput) {
            console.log(JSON.stringify(stats, null, 2));
        } else {
            printGlobalStats();
        }
        return;
    }

    // Default: show tiers and stats
    printTiers();
    printGlobalStats();
}

main().catch(console.error);

export { TIME_LOCK_TIERS, TimeLockTier, TimeLockCommitment, HolderTimeLockData };
