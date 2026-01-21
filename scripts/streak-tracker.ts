/**
 * $FED Diamond Hands Streak Tracker
 *
 * Tracks holding streaks for $FED holders to reward loyalty.
 * Inspired by HEX's time-lock concept but without harsh penalties.
 *
 * Streak Tiers:
 * - Newcomer (0-6 days): 1.0x base
 * - Holder (7-29 days): 1.05x bonus
 * - Diamond Hands (30-89 days): 1.1x bonus
 * - Fed Loyalist (90-179 days): 1.15x bonus
 * - OG Fed (180-364 days): 1.2x bonus
 * - Founding Father (365+ days): 1.25x bonus
 *
 * Usage:
 *   npx ts-node streak-tracker.ts                    # Show all streaks
 *   npx ts-node streak-tracker.ts --top 20           # Show top 20 streaks
 *   npx ts-node streak-tracker.ts --address <addr>   # Check specific address
 *   npx ts-node streak-tracker.ts --json             # Output as JSON
 *   npx ts-node streak-tracker.ts --update           # Update streak data
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
    Connection,
    PublicKey,
} from '@solana/web3.js';
import {
    TOKEN_2022_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Streak data file
const STREAK_DATA_FILE = path.join(__dirname, 'streak-data.json');

// $FED Token mint
const FED_MINT = '132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed';

// Minimum holding to qualify for streak (prevent dust accounts)
const MIN_HOLDING_FOR_STREAK = 1000; // 1000 $FED minimum

// Streak tier definitions
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

// Get tier for a streak
function getStreakTier(days: number): StreakTier {
    for (const tier of STREAK_TIERS) {
        if (days >= tier.minDays) {
            return tier;
        }
    }
    return STREAK_TIERS[STREAK_TIERS.length - 1];
}

// Streak data structure
interface HolderStreak {
    address: string;
    firstSeen: string;        // ISO date when first seen holding
    lastSeen: string;         // ISO date when last seen holding
    currentBalance: number;   // Current $FED balance
    peakBalance: number;      // Highest balance ever held
    streakDays: number;       // Current streak length in days
    longestStreak: number;    // Longest streak ever
    streakBroken: boolean;    // Whether streak was broken this check
    tier: string;             // Current tier name
    multiplier: number;       // Current multiplier
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

// Load existing streak data
function loadStreakData(): StreakData {
    if (fs.existsSync(STREAK_DATA_FILE)) {
        return JSON.parse(fs.readFileSync(STREAK_DATA_FILE, 'utf-8'));
    }
    return {
        lastUpdated: new Date().toISOString(),
        holders: {},
        stats: {
            totalTracked: 0,
            activeStreaks: 0,
            longestCurrentStreak: 0,
            averageStreak: 0,
            tierBreakdown: {},
        },
    };
}

// Save streak data
function saveStreakData(data: StreakData): void {
    fs.writeFileSync(STREAK_DATA_FILE, JSON.stringify(data, null, 2));
}

// Calculate days between two dates
function daysBetween(date1: Date, date2: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((date2.getTime() - date1.getTime()) / msPerDay);
}

// Fetch current holders from blockchain
async function fetchCurrentHolders(): Promise<Map<string, number>> {
    const connection = new Connection(
        'https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6',
        'confirmed'
    );

    const snapshotMint = new PublicKey(FED_MINT);
    const holders = new Map<string, number>();

    // Try Token2022 first
    try {
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

        for (const account of accounts) {
            const parsedData = account.account.data as any;
            const tokenAmount = parsedData.parsed?.info?.tokenAmount;
            const owner = parsedData.parsed?.info?.owner;

            if (tokenAmount && owner && tokenAmount.uiAmount >= MIN_HOLDING_FOR_STREAK) {
                holders.set(owner, tokenAmount.uiAmount);
            }
        }

        if (holders.size > 0) {
            return holders;
        }
    } catch (error) {
        // Fall through to regular SPL
    }

    // Try regular SPL
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

    for (const account of accounts) {
        const parsedData = account.account.data as any;
        const tokenAmount = parsedData.parsed?.info?.tokenAmount;
        const owner = parsedData.parsed?.info?.owner;

        if (tokenAmount && owner && tokenAmount.uiAmount >= MIN_HOLDING_FOR_STREAK) {
            holders.set(owner, tokenAmount.uiAmount);
        }
    }

    return holders;
}

// Update streak data with current holders
async function updateStreakData(): Promise<StreakData> {
    console.log('🔄 Fetching current holders from blockchain...');
    const currentHolders = await fetchCurrentHolders();
    console.log(`📊 Found ${currentHolders.size} holders with ≥${MIN_HOLDING_FOR_STREAK} $FED\n`);

    const streakData = loadStreakData();
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Track statistics
    let activeStreaks = 0;
    let longestStreak = 0;
    let totalStreakDays = 0;
    const tierBreakdown: Record<string, number> = {};

    // Update existing holders and add new ones
    for (const [address, balance] of currentHolders) {
        if (streakData.holders[address]) {
            // Existing holder - update their streak
            const holder = streakData.holders[address];
            const lastSeenDate = new Date(holder.lastSeen);
            const daysSinceLast = daysBetween(lastSeenDate, now);

            // If more than 1 day since last seen, streak might be broken
            // But we give a 24h grace period
            if (daysSinceLast > 1) {
                // Streak broken - reset
                holder.streakBroken = true;
                holder.longestStreak = Math.max(holder.longestStreak, holder.streakDays);
                holder.firstSeen = today;
                holder.streakDays = 0;
            } else {
                // Streak continues
                holder.streakBroken = false;
                holder.streakDays = daysBetween(new Date(holder.firstSeen), now);
            }

            holder.lastSeen = today;
            holder.currentBalance = balance;
            holder.peakBalance = Math.max(holder.peakBalance, balance);

            // Update tier
            const tier = getStreakTier(holder.streakDays);
            holder.tier = tier.name;
            holder.multiplier = tier.multiplier;
        } else {
            // New holder - start tracking
            const tier = getStreakTier(0);
            streakData.holders[address] = {
                address,
                firstSeen: today,
                lastSeen: today,
                currentBalance: balance,
                peakBalance: balance,
                streakDays: 0,
                longestStreak: 0,
                streakBroken: false,
                tier: tier.name,
                multiplier: tier.multiplier,
            };
        }

        const holder = streakData.holders[address];

        // Update statistics
        activeStreaks++;
        totalStreakDays += holder.streakDays;
        if (holder.streakDays > longestStreak) {
            longestStreak = holder.streakDays;
        }

        // Tier breakdown
        tierBreakdown[holder.tier] = (tierBreakdown[holder.tier] || 0) + 1;
    }

    // Mark holders who are no longer holding
    for (const address of Object.keys(streakData.holders)) {
        if (!currentHolders.has(address)) {
            const holder = streakData.holders[address];
            // Only mark as broken if they were active before
            if (!holder.streakBroken) {
                holder.streakBroken = true;
                holder.longestStreak = Math.max(holder.longestStreak, holder.streakDays);
                // Keep the streak data for historical purposes
                // but don't count in active stats
            }
        }
    }

    // Update global stats
    streakData.lastUpdated = now.toISOString();
    streakData.stats = {
        totalTracked: Object.keys(streakData.holders).length,
        activeStreaks,
        longestCurrentStreak: longestStreak,
        averageStreak: activeStreaks > 0 ? Math.round(totalStreakDays / activeStreaks) : 0,
        tierBreakdown,
    };

    // Save updated data
    saveStreakData(streakData);

    return streakData;
}

// Format streak display
function formatStreak(holder: HolderStreak): string {
    const tier = getStreakTier(holder.streakDays);
    const nextTier = STREAK_TIERS.find(t => t.minDays > holder.streakDays);
    const daysToNext = nextTier ? nextTier.minDays - holder.streakDays : 0;

    let display = `${tier.emoji} ${holder.address.slice(0, 6)}...${holder.address.slice(-4)}`;
    display += ` | ${holder.streakDays} days`;
    display += ` | ${tier.title} (${holder.multiplier}x)`;
    display += ` | ${holder.currentBalance.toLocaleString()} $FED`;

    if (nextTier && daysToNext > 0) {
        display += ` | ${daysToNext}d to ${nextTier.title}`;
    }

    return display;
}

// Generate streak leaderboard
function generateLeaderboard(data: StreakData, limit: number = 20): string {
    const activeHolders = Object.values(data.holders)
        .filter(h => !h.streakBroken)
        .sort((a, b) => b.streakDays - a.streakDays)
        .slice(0, limit);

    let output = '';
    output += '╔══════════════════════════════════════════════════════════════════╗\n';
    output += '║           💎 $FED DIAMOND HANDS LEADERBOARD 💎                   ║\n';
    output += '╚══════════════════════════════════════════════════════════════════╝\n\n';

    output += `📅 Last Updated: ${new Date(data.lastUpdated).toLocaleString()}\n\n`;

    output += '┌─────────────────────────────────────────────────────────────────┐\n';
    output += '│  STREAK STATS                                                   │\n';
    output += '├─────────────────────────────────────────────────────────────────┤\n';
    output += `│  Active Streaks:      ${data.stats.activeStreaks.toString().padEnd(10)} │  Longest: ${data.stats.longestCurrentStreak} days         │\n`;
    output += `│  Average Streak:      ${data.stats.averageStreak.toString().padEnd(10)} days                                │\n`;
    output += '└─────────────────────────────────────────────────────────────────┘\n\n';

    output += '🏆 TOP DIAMOND HANDS\n';
    output += '─'.repeat(70) + '\n';

    activeHolders.forEach((holder, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`.padStart(3);
        output += `${medal} ${formatStreak(holder)}\n`;
    });

    output += '\n─'.repeat(70) + '\n';

    // Tier breakdown
    output += '\n📊 TIER BREAKDOWN\n';
    output += '─'.repeat(40) + '\n';

    for (const tier of STREAK_TIERS) {
        const count = data.stats.tierBreakdown[tier.name] || 0;
        const bar = '█'.repeat(Math.min(Math.floor(count / 5), 20));
        output += `${tier.emoji} ${tier.title.padEnd(16)} ${count.toString().padStart(4)} ${bar}\n`;
    }

    return output;
}

// Generate JSON output
function generateJSON(data: StreakData, limit?: number): string {
    const activeHolders = Object.values(data.holders)
        .filter(h => !h.streakBroken)
        .sort((a, b) => b.streakDays - a.streakDays);

    const output = {
        lastUpdated: data.lastUpdated,
        stats: data.stats,
        tiers: STREAK_TIERS,
        leaderboard: limit ? activeHolders.slice(0, limit) : activeHolders,
    };

    return JSON.stringify(output, null, 2);
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    const jsonOutput = args.includes('--json');
    const shouldUpdate = args.includes('--update');

    const topIndex = args.indexOf('--top');
    const limit = topIndex !== -1 ? parseInt(args[topIndex + 1]) || 20 : 20;

    const addressIndex = args.indexOf('--address');
    const specificAddress = addressIndex !== -1 ? args[addressIndex + 1] : null;

    let streakData: StreakData;

    if (shouldUpdate) {
        streakData = await updateStreakData();
        if (!jsonOutput) {
            console.log('✅ Streak data updated successfully!\n');
        }
    } else {
        streakData = loadStreakData();
        if (Object.keys(streakData.holders).length === 0) {
            console.log('No streak data found. Run with --update first.\n');
            console.log('Usage: npx ts-node streak-tracker.ts --update');
            return;
        }
    }

    if (specificAddress) {
        const holder = streakData.holders[specificAddress];
        if (holder) {
            if (jsonOutput) {
                console.log(JSON.stringify(holder, null, 2));
            } else {
                const tier = getStreakTier(holder.streakDays);
                console.log('\n📋 HOLDER STREAK DETAILS');
                console.log('─'.repeat(50));
                console.log(`Address:        ${holder.address}`);
                console.log(`Current Tier:   ${tier.emoji} ${tier.title}`);
                console.log(`Multiplier:     ${holder.multiplier}x`);
                console.log(`Streak:         ${holder.streakDays} days`);
                console.log(`Longest Streak: ${holder.longestStreak} days`);
                console.log(`First Seen:     ${holder.firstSeen}`);
                console.log(`Balance:        ${holder.currentBalance.toLocaleString()} $FED`);
                console.log(`Peak Balance:   ${holder.peakBalance.toLocaleString()} $FED`);

                const nextTier = STREAK_TIERS.find(t => t.minDays > holder.streakDays);
                if (nextTier) {
                    const daysToNext = nextTier.minDays - holder.streakDays;
                    console.log(`\n⏳ ${daysToNext} days until ${nextTier.title} (${nextTier.multiplier}x)`);
                } else {
                    console.log('\n🏛️ Maximum tier achieved!');
                }
            }
        } else {
            console.log(`Address ${specificAddress} not found in streak data.`);
        }
        return;
    }

    if (jsonOutput) {
        console.log(generateJSON(streakData, limit));
    } else {
        console.log(generateLeaderboard(streakData, limit));
    }
}

// Run
main().catch(console.error);
