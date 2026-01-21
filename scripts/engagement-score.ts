/**
 * Fed Engagement Score System
 *
 * Tracks and rewards holder engagement beyond just holding tokens.
 * Inspired by Trust Wallet Premium XP system and Jupiter's Active Staking Rewards.
 *
 * Key differences from failed protocols:
 * - No fake APY promises
 * - Score multiplies REAL fee distributions, not inflation
 * - Simple, transparent scoring
 * - Rewards compound with tier and streak bonuses
 *
 * Engagement Actions:
 * - Daily check-in (simulated by wallet activity)
 * - Streak bonuses for consecutive days
 * - Distribution claim tracking
 * - Community participation (future: Twitter, Discord)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file paths
const ENGAGEMENT_FILE = path.join(__dirname, 'engagement-data.json');

// Engagement score settings
const POINTS_PER_CHECKIN = 10;
const STREAK_3_BONUS = 5;      // Bonus for 3-day streak
const STREAK_7_BONUS = 10;     // Bonus for 7-day streak
const STREAK_14_BONUS = 25;    // Bonus for 14-day streak
const STREAK_30_BONUS = 50;    // Bonus for 30-day streak
const DISTRIBUTION_CLAIM_POINTS = 5;  // Points per distribution received
const CYCLE_DURATION_DAYS = 14;       // Engagement tier resets every 14 days

// Engagement tiers based on XP
export interface EngagementTier {
    name: string;
    title: string;
    minXP: number;
    multiplier: number;
    emoji: string;
    benefits: string[];
}

const ENGAGEMENT_TIERS: EngagementTier[] = [
    {
        name: 'FedElite',
        title: 'Fed Elite',
        minXP: 500,
        multiplier: 1.2,
        emoji: '🏆',
        benefits: ['20% bonus rewards', 'Priority announcements', 'Elite dashboard badge']
    },
    {
        name: 'FedVeteran',
        title: 'Fed Veteran',
        minXP: 250,
        multiplier: 1.15,
        emoji: '⭐',
        benefits: ['15% bonus rewards', 'Early access to features', 'Veteran badge']
    },
    {
        name: 'FedActive',
        title: 'Fed Active',
        minXP: 100,
        multiplier: 1.1,
        emoji: '🔥',
        benefits: ['10% bonus rewards', 'Active member badge']
    },
    {
        name: 'FedRegular',
        title: 'Fed Regular',
        minXP: 50,
        multiplier: 1.05,
        emoji: '📊',
        benefits: ['5% bonus rewards', 'Regular badge']
    },
    {
        name: 'FedNew',
        title: 'Fed Newcomer',
        minXP: 0,
        multiplier: 1.0,
        emoji: '🆕',
        benefits: ['Base rewards', 'Welcome to the Fed!']
    },
];

// Engagement data structures
export interface HolderEngagement {
    address: string;
    totalXP: number;
    cycleXP: number;  // XP earned in current 14-day cycle
    currentStreak: number;
    longestStreak: number;
    lastCheckIn: string | null;  // ISO date string
    checkInHistory: string[];    // Last 30 check-in dates
    distributionsReceived: number;
    distributionsClaimed: number;
    cycleStartDate: string;
    tier: string;
    multiplier: number;
    createdAt: string;
    updatedAt: string;
}

export interface EngagementData {
    lastUpdated: string;
    currentCycleStart: string;
    currentCycleEnd: string;
    holders: Record<string, HolderEngagement>;
    stats: {
        totalHoldersTracked: number;
        activeThisCycle: number;
        averageCycleXP: number;
        totalXPAwarded: number;
        tierBreakdown: Record<string, number>;
    };
}

// Initialize engagement data
function createDefaultEngagementData(): EngagementData {
    const now = new Date();
    const cycleEnd = new Date(now);
    cycleEnd.setDate(cycleEnd.getDate() + CYCLE_DURATION_DAYS);

    return {
        lastUpdated: now.toISOString(),
        currentCycleStart: now.toISOString(),
        currentCycleEnd: cycleEnd.toISOString(),
        holders: {},
        stats: {
            totalHoldersTracked: 0,
            activeThisCycle: 0,
            averageCycleXP: 0,
            totalXPAwarded: 0,
            tierBreakdown: {},
        },
    };
}

// Load engagement data
export function loadEngagementData(): EngagementData {
    try {
        if (fs.existsSync(ENGAGEMENT_FILE)) {
            const data = JSON.parse(fs.readFileSync(ENGAGEMENT_FILE, 'utf-8'));
            return data as EngagementData;
        }
    } catch (error) {
        console.warn('Could not load engagement data:', error);
    }
    return createDefaultEngagementData();
}

// Save engagement data
export function saveEngagementData(data: EngagementData): void {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(ENGAGEMENT_FILE, JSON.stringify(data, null, 2));
}

// Get the tier for a given XP amount
function getTierForXP(xp: number): EngagementTier {
    for (const tier of ENGAGEMENT_TIERS) {
        if (xp >= tier.minXP) {
            return tier;
        }
    }
    return ENGAGEMENT_TIERS[ENGAGEMENT_TIERS.length - 1];
}

// Check if we need to start a new cycle
function checkCycleReset(data: EngagementData): boolean {
    const now = new Date();
    const cycleEnd = new Date(data.currentCycleEnd);

    if (now > cycleEnd) {
        // Reset cycle XP for all holders
        for (const address in data.holders) {
            data.holders[address].cycleXP = 0;
        }

        // Set new cycle dates
        data.currentCycleStart = now.toISOString();
        const newCycleEnd = new Date(now);
        newCycleEnd.setDate(newCycleEnd.getDate() + CYCLE_DURATION_DAYS);
        data.currentCycleEnd = newCycleEnd.toISOString();

        console.log(`🔄 New engagement cycle started: ${data.currentCycleStart} to ${data.currentCycleEnd}`);
        return true;
    }
    return false;
}

// Record a check-in for a holder
export function recordCheckIn(address: string, data: EngagementData): { success: boolean; xpEarned: number; message: string } {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Initialize holder if not exists
    if (!data.holders[address]) {
        data.holders[address] = {
            address,
            totalXP: 0,
            cycleXP: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastCheckIn: null,
            checkInHistory: [],
            distributionsReceived: 0,
            distributionsClaimed: 0,
            cycleStartDate: data.currentCycleStart,
            tier: 'FedNew',
            multiplier: 1.0,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };
    }

    const holder = data.holders[address];

    // Check if already checked in today
    if (holder.lastCheckIn) {
        const lastCheckInDate = holder.lastCheckIn.split('T')[0];
        if (lastCheckInDate === today) {
            return {
                success: false,
                xpEarned: 0,
                message: 'Already checked in today. Come back tomorrow!'
            };
        }
    }

    // Calculate XP to award
    let xpEarned = POINTS_PER_CHECKIN;

    // Check streak
    if (holder.lastCheckIn) {
        const lastDate = new Date(holder.lastCheckIn);
        const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            // Consecutive day - increase streak
            holder.currentStreak += 1;

            // Apply streak bonuses
            if (holder.currentStreak === 3) {
                xpEarned += STREAK_3_BONUS;
            } else if (holder.currentStreak === 7) {
                xpEarned += STREAK_7_BONUS;
            } else if (holder.currentStreak === 14) {
                xpEarned += STREAK_14_BONUS;
            } else if (holder.currentStreak === 30) {
                xpEarned += STREAK_30_BONUS;
            }
        } else if (daysDiff > 1) {
            // Streak broken
            holder.currentStreak = 1;
        }
    } else {
        holder.currentStreak = 1;
    }

    // Update longest streak
    if (holder.currentStreak > holder.longestStreak) {
        holder.longestStreak = holder.currentStreak;
    }

    // Award XP
    holder.totalXP += xpEarned;
    holder.cycleXP += xpEarned;
    holder.lastCheckIn = now.toISOString();

    // Update check-in history (keep last 30)
    holder.checkInHistory.push(today);
    if (holder.checkInHistory.length > 30) {
        holder.checkInHistory = holder.checkInHistory.slice(-30);
    }

    // Update tier
    const tier = getTierForXP(holder.cycleXP);
    holder.tier = tier.name;
    holder.multiplier = tier.multiplier;
    holder.updatedAt = now.toISOString();

    // Update global stats
    data.stats.totalXPAwarded += xpEarned;

    return {
        success: true,
        xpEarned,
        message: `Checked in! +${xpEarned} XP. Streak: ${holder.currentStreak} days. Tier: ${tier.title}`
    };
}

// Record a distribution received
export function recordDistribution(address: string, data: EngagementData): void {
    if (!data.holders[address]) {
        // Create minimal holder record for distribution tracking
        const now = new Date();
        data.holders[address] = {
            address,
            totalXP: 0,
            cycleXP: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastCheckIn: null,
            checkInHistory: [],
            distributionsReceived: 0,
            distributionsClaimed: 0,
            cycleStartDate: data.currentCycleStart,
            tier: 'FedNew',
            multiplier: 1.0,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };
    }

    const holder = data.holders[address];
    holder.distributionsReceived += 1;

    // Award small XP for receiving a distribution
    const xpEarned = DISTRIBUTION_CLAIM_POINTS;
    holder.totalXP += xpEarned;
    holder.cycleXP += xpEarned;
    holder.updatedAt = new Date().toISOString();

    // Update tier based on new XP
    const tier = getTierForXP(holder.cycleXP);
    holder.tier = tier.name;
    holder.multiplier = tier.multiplier;

    data.stats.totalXPAwarded += xpEarned;
}

// Get engagement multiplier for a holder
export function getEngagementMultiplier(address: string, data: EngagementData): { multiplier: number; tier: EngagementTier; cycleXP: number } {
    const defaultTier = ENGAGEMENT_TIERS[ENGAGEMENT_TIERS.length - 1];

    if (!data.holders[address]) {
        return { multiplier: 1.0, tier: defaultTier, cycleXP: 0 };
    }

    const holder = data.holders[address];
    const tier = getTierForXP(holder.cycleXP);

    return {
        multiplier: tier.multiplier,
        tier,
        cycleXP: holder.cycleXP
    };
}

// Get holder engagement info
export function getHolderEngagement(address: string, data: EngagementData): HolderEngagement | null {
    return data.holders[address] || null;
}

// Calculate and update all stats
function updateStats(data: EngagementData): void {
    const holders = Object.values(data.holders);
    const activeHolders = holders.filter(h => h.cycleXP > 0);

    // Calculate tier breakdown
    const tierBreakdown: Record<string, number> = {};
    for (const tier of ENGAGEMENT_TIERS) {
        tierBreakdown[tier.name] = 0;
    }

    for (const holder of holders) {
        const tier = getTierForXP(holder.cycleXP);
        tierBreakdown[tier.name] = (tierBreakdown[tier.name] || 0) + 1;
    }

    // Calculate average cycle XP
    const totalCycleXP = holders.reduce((sum, h) => sum + h.cycleXP, 0);

    data.stats = {
        totalHoldersTracked: holders.length,
        activeThisCycle: activeHolders.length,
        averageCycleXP: activeHolders.length > 0 ? Math.round(totalCycleXP / activeHolders.length) : 0,
        totalXPAwarded: data.stats.totalXPAwarded,
        tierBreakdown,
    };
}

// Get leaderboard
export function getLeaderboard(data: EngagementData, limit: number = 10): HolderEngagement[] {
    const holders = Object.values(data.holders);
    holders.sort((a, b) => b.cycleXP - a.cycleXP);
    return holders.slice(0, limit);
}

// Format address for display
function formatAddress(address: string): string {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

// Print engagement report
function printEngagementReport(data: EngagementData): void {
    const now = new Date();
    const cycleEnd = new Date(data.currentCycleEnd);
    const daysRemaining = Math.max(0, Math.ceil((cycleEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    console.log('\n' + '═'.repeat(60));
    console.log('🏛️  FED ENGAGEMENT SCORE SYSTEM');
    console.log('═'.repeat(60));

    console.log('\n📊 CURRENT CYCLE STATUS');
    console.log('─'.repeat(40));
    console.log(`   Cycle Start: ${new Date(data.currentCycleStart).toLocaleDateString()}`);
    console.log(`   Cycle End:   ${new Date(data.currentCycleEnd).toLocaleDateString()}`);
    console.log(`   Days Left:   ${daysRemaining}`);

    console.log('\n📈 ENGAGEMENT STATISTICS');
    console.log('─'.repeat(40));
    console.log(`   Holders Tracked:    ${data.stats.totalHoldersTracked}`);
    console.log(`   Active This Cycle:  ${data.stats.activeThisCycle}`);
    console.log(`   Avg Cycle XP:       ${data.stats.averageCycleXP}`);
    console.log(`   Total XP Awarded:   ${data.stats.totalXPAwarded}`);

    console.log('\n🎖️  TIER DISTRIBUTION');
    console.log('─'.repeat(40));
    for (const tier of ENGAGEMENT_TIERS) {
        const count = data.stats.tierBreakdown[tier.name] || 0;
        const pct = data.stats.totalHoldersTracked > 0
            ? ((count / data.stats.totalHoldersTracked) * 100).toFixed(1)
            : '0.0';
        console.log(`   ${tier.emoji} ${tier.title.padEnd(15)} ${count.toString().padStart(5)} holders (${pct}%)`);
    }

    console.log('\n🏆 TOP 10 MOST ENGAGED');
    console.log('─'.repeat(40));
    const topHolders = getLeaderboard(data, 10);
    topHolders.forEach((holder, index) => {
        const tier = getTierForXP(holder.cycleXP);
        console.log(`   ${(index + 1).toString().padStart(2)}. ${formatAddress(holder.address)} | ${holder.cycleXP.toString().padStart(5)} XP | ${tier.emoji} ${tier.title}`);
    });

    console.log('\n📋 TIER BENEFITS');
    console.log('─'.repeat(40));
    for (const tier of ENGAGEMENT_TIERS.slice(0, 4)) {
        console.log(`   ${tier.emoji} ${tier.title} (${tier.minXP}+ XP) → ${tier.multiplier}x rewards`);
    }

    console.log('\n💡 HOW TO EARN XP');
    console.log('─'.repeat(40));
    console.log(`   Daily Check-in:  +${POINTS_PER_CHECKIN} XP`);
    console.log(`   3-Day Streak:    +${STREAK_3_BONUS} XP bonus`);
    console.log(`   7-Day Streak:    +${STREAK_7_BONUS} XP bonus`);
    console.log(`   14-Day Streak:   +${STREAK_14_BONUS} XP bonus`);
    console.log(`   30-Day Streak:   +${STREAK_30_BONUS} XP bonus`);
    console.log(`   Per Distribution: +${DISTRIBUTION_CLAIM_POINTS} XP`);

    console.log('\n' + '═'.repeat(60) + '\n');
}

// Print holder info
function printHolderInfo(holder: HolderEngagement): void {
    const tier = getTierForXP(holder.cycleXP);

    console.log('\n' + '═'.repeat(50));
    console.log(`🏛️  ENGAGEMENT STATUS: ${formatAddress(holder.address)}`);
    console.log('═'.repeat(50));

    console.log('\n📊 XP STATUS');
    console.log('─'.repeat(30));
    console.log(`   Current Cycle XP: ${holder.cycleXP}`);
    console.log(`   Total Lifetime XP: ${holder.totalXP}`);
    console.log(`   Current Tier: ${tier.emoji} ${tier.title}`);
    console.log(`   Reward Multiplier: ${tier.multiplier}x`);

    console.log('\n🔥 STREAK INFO');
    console.log('─'.repeat(30));
    console.log(`   Current Streak: ${holder.currentStreak} days`);
    console.log(`   Longest Streak: ${holder.longestStreak} days`);
    console.log(`   Last Check-in: ${holder.lastCheckIn ? new Date(holder.lastCheckIn).toLocaleString() : 'Never'}`);

    console.log('\n💸 DISTRIBUTION HISTORY');
    console.log('─'.repeat(30));
    console.log(`   Distributions Received: ${holder.distributionsReceived}`);

    console.log('\n🎁 TIER BENEFITS');
    console.log('─'.repeat(30));
    tier.benefits.forEach(benefit => {
        console.log(`   ✓ ${benefit}`);
    });

    // Calculate progress to next tier
    const currentTierIndex = ENGAGEMENT_TIERS.findIndex(t => t.name === tier.name);
    if (currentTierIndex > 0) {
        const nextTier = ENGAGEMENT_TIERS[currentTierIndex - 1];
        const xpNeeded = nextTier.minXP - holder.cycleXP;
        console.log(`\n📈 Progress to ${nextTier.emoji} ${nextTier.title}: ${xpNeeded} XP needed`);
    } else {
        console.log('\n🏆 MAX TIER ACHIEVED!');
    }

    console.log('\n' + '═'.repeat(50) + '\n');
}

// Main CLI function
async function main() {
    const args = process.argv.slice(2);

    // Load data
    let data = loadEngagementData();

    // Check for cycle reset
    checkCycleReset(data);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Fed Engagement Score System
═══════════════════════════════════════════════════════════

Track and reward holder engagement. Earn XP for daily check-ins,
streaks, and receiving distributions. Higher XP = bonus rewards!

Commands:
  --checkin <address>    Record a daily check-in
  --status <address>     Check engagement status for an address
  --leaderboard [n]      Show top N most engaged holders (default: 10)
  --stats                Show overall engagement statistics
  --json                 Output as JSON (for API integration)
  --help                 Show this help message

Examples:
  npx ts-node engagement-score.ts --checkin 4Br5iKf...
  npx ts-node engagement-score.ts --status 4Br5iKf...
  npx ts-node engagement-score.ts --leaderboard 20
  npx ts-node engagement-score.ts --stats
  npx ts-node engagement-score.ts --stats --json

XP Earning Opportunities:
  - Daily check-in: +${POINTS_PER_CHECKIN} XP
  - 3-day streak bonus: +${STREAK_3_BONUS} XP
  - 7-day streak bonus: +${STREAK_7_BONUS} XP
  - 14-day streak bonus: +${STREAK_14_BONUS} XP
  - 30-day streak bonus: +${STREAK_30_BONUS} XP
  - Per distribution received: +${DISTRIBUTION_CLAIM_POINTS} XP

Engagement Tiers (14-day cycle):
${ENGAGEMENT_TIERS.map(t => `  ${t.emoji} ${t.title.padEnd(15)} ${t.minXP.toString().padStart(4)}+ XP → ${t.multiplier}x rewards`).join('\n')}
        `);
        return;
    }

    const jsonOutput = args.includes('--json');

    // Handle check-in
    const checkinIndex = args.indexOf('--checkin');
    if (checkinIndex !== -1 && args[checkinIndex + 1]) {
        const address = args[checkinIndex + 1];
        const result = recordCheckIn(address, data);

        // Update stats and save
        updateStats(data);
        saveEngagementData(data);

        if (jsonOutput) {
            console.log(JSON.stringify({
                action: 'checkin',
                address,
                ...result,
                holder: data.holders[address]
            }, null, 2));
        } else {
            if (result.success) {
                console.log(`\n✅ ${result.message}`);
                printHolderInfo(data.holders[address]);
            } else {
                console.log(`\n⚠️ ${result.message}`);
            }
        }
        return;
    }

    // Handle status check
    const statusIndex = args.indexOf('--status');
    if (statusIndex !== -1 && args[statusIndex + 1]) {
        const address = args[statusIndex + 1];
        const holder = getHolderEngagement(address, data);

        if (jsonOutput) {
            console.log(JSON.stringify({
                action: 'status',
                address,
                found: !!holder,
                holder: holder || null,
                tier: holder ? getTierForXP(holder.cycleXP) : null
            }, null, 2));
        } else {
            if (holder) {
                printHolderInfo(holder);
            } else {
                console.log(`\n⚠️ No engagement data found for ${address}`);
                console.log('   This address has not checked in or received distributions yet.');
            }
        }
        return;
    }

    // Handle leaderboard
    if (args.includes('--leaderboard')) {
        const leaderboardIndex = args.indexOf('--leaderboard');
        const limit = parseInt(args[leaderboardIndex + 1]) || 10;
        const topHolders = getLeaderboard(data, limit);

        if (jsonOutput) {
            console.log(JSON.stringify({
                action: 'leaderboard',
                limit,
                holders: topHolders.map(h => ({
                    ...h,
                    tier: getTierForXP(h.cycleXP)
                }))
            }, null, 2));
        } else {
            console.log('\n' + '═'.repeat(50));
            console.log(`🏆 TOP ${limit} MOST ENGAGED FED CITIZENS`);
            console.log('═'.repeat(50) + '\n');

            topHolders.forEach((holder, index) => {
                const tier = getTierForXP(holder.cycleXP);
                console.log(`${(index + 1).toString().padStart(2)}. ${tier.emoji} ${formatAddress(holder.address)}`);
                console.log(`    XP: ${holder.cycleXP} | Streak: ${holder.currentStreak}d | ${tier.title} (${tier.multiplier}x)`);
            });
            console.log('');
        }
        return;
    }

    // Handle stats (default action)
    updateStats(data);
    saveEngagementData(data);

    if (jsonOutput) {
        console.log(JSON.stringify({
            action: 'stats',
            cycleStart: data.currentCycleStart,
            cycleEnd: data.currentCycleEnd,
            stats: data.stats,
            tiers: ENGAGEMENT_TIERS
        }, null, 2));
    } else {
        printEngagementReport(data);
    }
}

// Export for integration with distribution script
export {
    ENGAGEMENT_TIERS,
    getTierForXP,
    updateStats,
};

// Run if executed directly
main().catch(console.error);
