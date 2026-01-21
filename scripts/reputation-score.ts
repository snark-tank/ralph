/**
 * Fed Reputation Score System
 *
 * A unified on-chain reputation scoring system inspired by 2026 DeFi trends:
 * - Providence (Andre Cronje's credit scoring)
 * - Soulbound Token (SBT) reputation concepts
 * - zkCredit privacy-preserving scoring
 *
 * Aggregates all $FED holder data into a single "Fed Credit Score" (300-850)
 * that represents trustworthiness and engagement without requiring collateral.
 *
 * This score is NON-TRANSFERABLE - tied to wallet, not to tokens.
 * Even if you sell all $FED, your reputation persists.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths for data sources
const STREAK_DATA_FILE = path.join(__dirname, 'streak-data.json');
const ENGAGEMENT_DATA_FILE = path.join(__dirname, 'engagement-data.json');
const SEASON_DATA_FILE = path.join(__dirname, 'season-data.json');
const REPUTATION_DATA_FILE = path.join(__dirname, 'reputation-data.json');
const DISTRIBUTION_HISTORY_FILE = path.join(__dirname, '..', 'src', 'token-distribution-history.json');

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface ReputationTier {
    name: string;
    title: string;
    minScore: number;
    maxScore: number;
    multiplier: number;
    emoji: string;
    benefits: string[];
}

interface HolderReputation {
    address: string;

    // Core Fed Credit Score (300-850, like traditional credit)
    fedCreditScore: number;

    // Component scores (0-100 each)
    holdingScore: number;      // Based on amount held
    longevityScore: number;    // Based on days holding
    engagementScore: number;   // Based on XP/activity
    loyaltyScore: number;      // Based on season participation
    consistencyScore: number;  // Based on balance stability

    // Derived metrics
    tier: string;
    multiplier: number;
    trustworthinessIndex: number; // 0-100

    // Historical tracking
    firstInteraction: string;
    totalDistributionsReceived: number;
    totalUsd1Earned: number;
    peakCreditScore: number;
    scoreHistory: { date: string; score: number }[];

    // Behavioral flags
    isWhale: boolean;
    isDiamondHands: boolean;
    isEngaged: boolean;
    isLoyal: boolean;

    // Timestamps
    lastUpdated: string;
    lastScoreChange: number; // positive or negative
}

interface ReputationData {
    lastUpdated: string;
    version: string;
    totalScored: number;
    averageScore: number;
    holders: Record<string, HolderReputation>;
    tierBreakdown: Record<string, number>;
    stats: {
        highestScore: number;
        highestScoreAddress: string;
        lowestActiveScore: number;
        medianScore: number;
        scoreDistribution: { range: string; count: number }[];
    };
}

interface StreakData {
    lastUpdated: string;
    holders: Record<string, {
        address: string;
        firstSeen: string;
        streakDays: number;
        currentBalance: number;
        peakBalance: number;
        multiplier: number;
    }>;
}

interface EngagementData {
    currentCycle: {
        startDate: string;
        endDate: string;
    };
    holders: Record<string, {
        xp: number;
        tier: string;
        multiplier: number;
        checkIns: number;
        distributionsReceived: number;
    }>;
}

interface SeasonData {
    currentSeason: {
        number: number;
        name: string;
    };
    holders: Record<string, {
        participationScore: number;
        tier: string;
        multiplier: number;
        seasonsParticipated: number;
    }>;
}

interface DistributionHistory {
    distributions: {
        date: string;
        totalDistributed: number;
        recipientCount: number;
        recipients?: { address: string; amount: number }[];
    }[];
    totalDistributed: number;
}

// =====================================================
// REPUTATION TIERS (Based on Fed Credit Score)
// =====================================================

const REPUTATION_TIERS: ReputationTier[] = [
    {
        name: 'Exceptional',
        title: 'Fed Prime Member',
        minScore: 800,
        maxScore: 850,
        multiplier: 1.30,
        emoji: '💎',
        benefits: [
            'Maximum distribution multiplier (1.3x)',
            'Priority in future airdrops',
            'Exclusive governance proposals',
            'Fed Prime badge on dashboard'
        ]
    },
    {
        name: 'Excellent',
        title: 'Fed Elite',
        minScore: 740,
        maxScore: 799,
        multiplier: 1.20,
        emoji: '🏆',
        benefits: [
            'High distribution multiplier (1.2x)',
            'Early access to new features',
            'Fed Elite badge on dashboard'
        ]
    },
    {
        name: 'Good',
        title: 'Fed Trusted',
        minScore: 670,
        maxScore: 739,
        multiplier: 1.12,
        emoji: '⭐',
        benefits: [
            'Above-average multiplier (1.12x)',
            'Trusted member status',
            'Fed Trusted badge'
        ]
    },
    {
        name: 'Fair',
        title: 'Fed Member',
        minScore: 580,
        maxScore: 669,
        multiplier: 1.05,
        emoji: '📊',
        benefits: [
            'Standard multiplier (1.05x)',
            'Full member access'
        ]
    },
    {
        name: 'Building',
        title: 'Fed Citizen',
        minScore: 300,
        maxScore: 579,
        multiplier: 1.00,
        emoji: '🆕',
        benefits: [
            'Base multiplier (1.0x)',
            'Building reputation'
        ]
    }
];

// =====================================================
// SCORE CALCULATION WEIGHTS
// =====================================================

const SCORE_WEIGHTS = {
    holding: 0.25,      // 25% - How much you hold
    longevity: 0.25,    // 25% - How long you've held
    engagement: 0.20,   // 20% - How active you are
    loyalty: 0.15,      // 15% - Season participation
    consistency: 0.15   // 15% - Balance stability
};

// Score component configurations
const HOLDING_THRESHOLDS = [
    { amount: 50_000_000, score: 100 },  // Chairman
    { amount: 10_000_000, score: 85 },   // Governor
    { amount: 1_000_000, score: 70 },    // Director
    { amount: 100_000, score: 50 },      // Member
    { amount: 10_000, score: 30 },       // Citizen+
    { amount: 1_000, score: 15 },        // Citizen
    { amount: 0, score: 5 }              // Any holder
];

const LONGEVITY_THRESHOLDS = [
    { days: 365, score: 100 },   // 1 year
    { days: 180, score: 85 },    // 6 months
    { days: 90, score: 70 },     // 3 months
    { days: 30, score: 50 },     // 1 month
    { days: 7, score: 30 },      // 1 week
    { days: 1, score: 10 },      // 1 day
    { days: 0, score: 5 }        // New
];

const ENGAGEMENT_THRESHOLDS = [
    { xp: 500, score: 100 },     // Fed Elite
    { xp: 250, score: 85 },      // Fed Veteran
    { xp: 100, score: 70 },      // Fed Active
    { xp: 50, score: 50 },       // Fed Regular
    { xp: 10, score: 30 },       // Some engagement
    { xp: 0, score: 10 }         // No engagement
];

// =====================================================
// DATA LOADING FUNCTIONS
// =====================================================

function loadJsonFile<T>(filePath: string, defaultValue: T): T {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
    } catch (error) {
        console.warn(`⚠️ Could not load ${filePath}:`, error);
    }
    return defaultValue;
}

function loadStreakData(): StreakData | null {
    return loadJsonFile<StreakData | null>(STREAK_DATA_FILE, null);
}

function loadEngagementData(): EngagementData | null {
    return loadJsonFile<EngagementData | null>(ENGAGEMENT_DATA_FILE, null);
}

function loadSeasonData(): SeasonData | null {
    return loadJsonFile<SeasonData | null>(SEASON_DATA_FILE, null);
}

function loadDistributionHistory(): DistributionHistory | null {
    return loadJsonFile<DistributionHistory | null>(DISTRIBUTION_HISTORY_FILE, null);
}

function loadReputationData(): ReputationData {
    const defaultData: ReputationData = {
        lastUpdated: new Date().toISOString(),
        version: '1.0.0',
        totalScored: 0,
        averageScore: 0,
        holders: {},
        tierBreakdown: {},
        stats: {
            highestScore: 0,
            highestScoreAddress: '',
            lowestActiveScore: 850,
            medianScore: 0,
            scoreDistribution: []
        }
    };
    return loadJsonFile<ReputationData>(REPUTATION_DATA_FILE, defaultData);
}

function saveReputationData(data: ReputationData): void {
    fs.writeFileSync(REPUTATION_DATA_FILE, JSON.stringify(data, null, 2));
}

// =====================================================
// SCORE CALCULATION FUNCTIONS
// =====================================================

function calculateHoldingScore(balance: number): number {
    for (const threshold of HOLDING_THRESHOLDS) {
        if (balance >= threshold.amount) {
            return threshold.score;
        }
    }
    return 5;
}

function calculateLongevityScore(streakDays: number): number {
    for (const threshold of LONGEVITY_THRESHOLDS) {
        if (streakDays >= threshold.days) {
            return threshold.score;
        }
    }
    return 5;
}

function calculateEngagementComponentScore(xp: number): number {
    for (const threshold of ENGAGEMENT_THRESHOLDS) {
        if (xp >= threshold.xp) {
            return threshold.score;
        }
    }
    return 10;
}

function calculateLoyaltyScore(seasonsParticipated: number, participationScore: number): number {
    // Combine season count and participation quality
    const seasonBonus = Math.min(seasonsParticipated * 20, 50); // Max 50 from seasons
    const participationBonus = participationScore * 0.5; // Max 50 from participation
    return Math.min(seasonBonus + participationBonus, 100);
}

function calculateConsistencyScore(
    currentBalance: number,
    peakBalance: number,
    streakBroken: boolean
): number {
    if (peakBalance === 0) return 50; // New holder, neutral

    // How much of peak balance is retained
    const retentionRatio = currentBalance / peakBalance;

    // Penalty for broken streaks
    const streakPenalty = streakBroken ? 15 : 0;

    // Score: 100 if retained 100%+, decreases with selling
    let score = Math.min(retentionRatio * 100, 100);
    score = Math.max(score - streakPenalty, 0);

    return Math.round(score);
}

function calculateFedCreditScore(
    holdingScore: number,
    longevityScore: number,
    engagementScore: number,
    loyaltyScore: number,
    consistencyScore: number
): number {
    // Weighted average of component scores (0-100)
    const weightedScore =
        holdingScore * SCORE_WEIGHTS.holding +
        longevityScore * SCORE_WEIGHTS.longevity +
        engagementScore * SCORE_WEIGHTS.engagement +
        loyaltyScore * SCORE_WEIGHTS.loyalty +
        consistencyScore * SCORE_WEIGHTS.consistency;

    // Scale to 300-850 range (like traditional credit scores)
    // 0 weighted score = 300, 100 weighted score = 850
    const fedCreditScore = Math.round(300 + (weightedScore * 5.5));

    return Math.min(Math.max(fedCreditScore, 300), 850);
}

function calculateTrustworthinessIndex(
    fedCreditScore: number,
    consistencyScore: number,
    longevityScore: number
): number {
    // Trustworthiness is heavily weighted toward consistency and time
    const trustScore =
        (consistencyScore * 0.4) +
        (longevityScore * 0.4) +
        ((fedCreditScore - 300) / 5.5 * 0.2); // Normalize credit score contribution

    return Math.round(Math.min(Math.max(trustScore, 0), 100));
}

function getTierFromScore(score: number): ReputationTier {
    for (const tier of REPUTATION_TIERS) {
        if (score >= tier.minScore && score <= tier.maxScore) {
            return tier;
        }
    }
    return REPUTATION_TIERS[REPUTATION_TIERS.length - 1];
}

// =====================================================
// MAIN REPUTATION CALCULATION
// =====================================================

export function calculateReputation(address: string): HolderReputation | null {
    const streakData = loadStreakData();
    const engagementData = loadEngagementData();
    const seasonData = loadSeasonData();
    const reputationData = loadReputationData();

    // Get existing reputation data if any
    const existingRep = reputationData.holders[address];

    // Get streak info
    const streak = streakData?.holders[address];
    const currentBalance = streak?.currentBalance || 0;
    const peakBalance = streak?.peakBalance || currentBalance;
    const streakDays = streak?.streakDays || 0;
    const firstSeen = streak?.firstSeen || new Date().toISOString();

    // Get engagement info
    const engagement = engagementData?.holders[address];
    const xp = engagement?.xp || 0;
    const distributionsReceived = engagement?.distributionsReceived || 0;

    // Get season info
    const season = seasonData?.holders[address];
    const seasonsParticipated = season?.seasonsParticipated || 0;
    const participationScore = season?.participationScore || 0;

    // Calculate component scores
    const holdingScore = calculateHoldingScore(currentBalance);
    const longevityScore = calculateLongevityScore(streakDays);
    const engagementScore = calculateEngagementComponentScore(xp);
    const loyaltyScore = calculateLoyaltyScore(seasonsParticipated, participationScore);
    const consistencyScore = calculateConsistencyScore(currentBalance, peakBalance, false);

    // Calculate main Fed Credit Score
    const fedCreditScore = calculateFedCreditScore(
        holdingScore,
        longevityScore,
        engagementScore,
        loyaltyScore,
        consistencyScore
    );

    // Get tier and multiplier
    const tier = getTierFromScore(fedCreditScore);

    // Calculate trustworthiness
    const trustworthinessIndex = calculateTrustworthinessIndex(
        fedCreditScore,
        consistencyScore,
        longevityScore
    );

    // Track score change
    const previousScore = existingRep?.fedCreditScore || fedCreditScore;
    const scoreChange = fedCreditScore - previousScore;

    // Build score history (keep last 30 entries)
    const scoreHistory = existingRep?.scoreHistory || [];
    const today = new Date().toISOString().split('T')[0];
    if (!scoreHistory.find(h => h.date === today)) {
        scoreHistory.push({ date: today, score: fedCreditScore });
        if (scoreHistory.length > 30) {
            scoreHistory.shift();
        }
    }

    const reputation: HolderReputation = {
        address,
        fedCreditScore,
        holdingScore,
        longevityScore,
        engagementScore,
        loyaltyScore,
        consistencyScore,
        tier: tier.name,
        multiplier: tier.multiplier,
        trustworthinessIndex,
        firstInteraction: existingRep?.firstInteraction || firstSeen,
        totalDistributionsReceived: distributionsReceived,
        totalUsd1Earned: existingRep?.totalUsd1Earned || 0,
        peakCreditScore: Math.max(existingRep?.peakCreditScore || 0, fedCreditScore),
        scoreHistory,
        isWhale: currentBalance >= 10_000_000,
        isDiamondHands: streakDays >= 30,
        isEngaged: xp >= 100,
        isLoyal: seasonsParticipated >= 2,
        lastUpdated: new Date().toISOString(),
        lastScoreChange: scoreChange
    };

    return reputation;
}

export function updateAllReputations(): ReputationData {
    const streakData = loadStreakData();
    const reputationData = loadReputationData();

    if (!streakData) {
        console.warn('⚠️ No streak data available - cannot calculate reputations');
        return reputationData;
    }

    console.log('\n🏛️ FED REPUTATION SCORE SYSTEM');
    console.log('═'.repeat(50));
    console.log('Calculating reputation scores for all holders...\n');

    const addresses = Object.keys(streakData.holders);
    let totalScore = 0;
    const scores: number[] = [];
    const tierCounts: Record<string, number> = {};

    for (const address of addresses) {
        const reputation = calculateReputation(address);
        if (reputation) {
            reputationData.holders[address] = reputation;
            totalScore += reputation.fedCreditScore;
            scores.push(reputation.fedCreditScore);

            tierCounts[reputation.tier] = (tierCounts[reputation.tier] || 0) + 1;
        }
    }

    // Sort scores for statistics
    scores.sort((a, b) => a - b);

    // Calculate distribution by ranges
    const ranges = [
        { range: '800-850 (Exceptional)', min: 800, max: 850 },
        { range: '740-799 (Excellent)', min: 740, max: 799 },
        { range: '670-739 (Good)', min: 670, max: 739 },
        { range: '580-669 (Fair)', min: 580, max: 669 },
        { range: '300-579 (Building)', min: 300, max: 579 }
    ];

    const scoreDistribution = ranges.map(r => ({
        range: r.range,
        count: scores.filter(s => s >= r.min && s <= r.max).length
    }));

    // Find highest and lowest
    let highestScore = 0;
    let highestAddress = '';
    let lowestScore = 850;

    for (const [address, rep] of Object.entries(reputationData.holders)) {
        if (rep.fedCreditScore > highestScore) {
            highestScore = rep.fedCreditScore;
            highestAddress = address;
        }
        if (rep.fedCreditScore < lowestScore && rep.holdingScore > 0) {
            lowestScore = rep.fedCreditScore;
        }
    }

    // Update stats
    reputationData.lastUpdated = new Date().toISOString();
    reputationData.totalScored = addresses.length;
    reputationData.averageScore = Math.round(totalScore / addresses.length);
    reputationData.tierBreakdown = tierCounts;
    reputationData.stats = {
        highestScore,
        highestScoreAddress: highestAddress,
        lowestActiveScore: lowestScore,
        medianScore: scores[Math.floor(scores.length / 2)] || 0,
        scoreDistribution
    };

    // Save updated data
    saveReputationData(reputationData);

    // Print summary
    console.log('📊 REPUTATION SCORE SUMMARY');
    console.log('─'.repeat(50));
    console.log(`Total Holders Scored: ${reputationData.totalScored}`);
    console.log(`Average Fed Credit Score: ${reputationData.averageScore}`);
    console.log(`Median Score: ${reputationData.stats.medianScore}`);
    console.log(`Highest Score: ${highestScore} (${highestAddress.slice(0, 8)}...)`);
    console.log();

    console.log('🏆 TIER DISTRIBUTION');
    console.log('─'.repeat(50));
    for (const tier of REPUTATION_TIERS) {
        const count = tierCounts[tier.name] || 0;
        const pct = ((count / addresses.length) * 100).toFixed(1);
        console.log(`${tier.emoji} ${tier.title}: ${count} holders (${pct}%)`);
    }
    console.log();

    console.log('📈 SCORE DISTRIBUTION');
    console.log('─'.repeat(50));
    for (const dist of scoreDistribution) {
        const bar = '█'.repeat(Math.round(dist.count / addresses.length * 30));
        console.log(`${dist.range}: ${dist.count} ${bar}`);
    }

    return reputationData;
}

export function getReputationMultiplier(address: string): { multiplier: number; tier: ReputationTier; score: number } {
    const reputationData = loadReputationData();
    const holder = reputationData.holders[address];

    if (!holder) {
        // Calculate on the fly if not in database
        const reputation = calculateReputation(address);
        if (reputation) {
            const tier = getTierFromScore(reputation.fedCreditScore);
            return {
                multiplier: tier.multiplier,
                tier,
                score: reputation.fedCreditScore
            };
        }
        // Default to building tier
        return {
            multiplier: 1.0,
            tier: REPUTATION_TIERS[REPUTATION_TIERS.length - 1],
            score: 300
        };
    }

    const tier = getTierFromScore(holder.fedCreditScore);
    return {
        multiplier: tier.multiplier,
        tier,
        score: holder.fedCreditScore
    };
}

export function getLeaderboard(limit: number = 20): HolderReputation[] {
    const reputationData = loadReputationData();
    return Object.values(reputationData.holders)
        .sort((a, b) => b.fedCreditScore - a.fedCreditScore)
        .slice(0, limit);
}

export function getReputationReport(address: string): string {
    const reputation = calculateReputation(address);
    if (!reputation) {
        return `No reputation data found for ${address}`;
    }

    const tier = getTierFromScore(reputation.fedCreditScore);

    let report = '\n';
    report += '╔══════════════════════════════════════════════════════════════════╗\n';
    report += '║                  🏛️ FED CREDIT REPORT 🏛️                          ║\n';
    report += '╚══════════════════════════════════════════════════════════════════╝\n\n';

    report += `Address: ${address.slice(0, 8)}...${address.slice(-8)}\n`;
    report += `Report Date: ${new Date().toISOString().split('T')[0]}\n\n`;

    report += '┌─────────────────────────────────────────┐\n';
    report += `│  FED CREDIT SCORE: ${reputation.fedCreditScore.toString().padStart(3)}                   │\n`;
    report += `│  ${tier.emoji} ${tier.title.padEnd(32)} │\n`;
    report += '└─────────────────────────────────────────┘\n\n';

    report += '📊 COMPONENT SCORES\n';
    report += '─'.repeat(40) + '\n';
    report += `  Holdings:    ${createScoreBar(reputation.holdingScore)} ${reputation.holdingScore}/100\n`;
    report += `  Longevity:   ${createScoreBar(reputation.longevityScore)} ${reputation.longevityScore}/100\n`;
    report += `  Engagement:  ${createScoreBar(reputation.engagementScore)} ${reputation.engagementScore}/100\n`;
    report += `  Loyalty:     ${createScoreBar(reputation.loyaltyScore)} ${reputation.loyaltyScore}/100\n`;
    report += `  Consistency: ${createScoreBar(reputation.consistencyScore)} ${reputation.consistencyScore}/100\n\n`;

    report += '🔐 TRUSTWORTHINESS INDEX\n';
    report += '─'.repeat(40) + '\n';
    report += `  Index: ${reputation.trustworthinessIndex}/100\n`;
    report += `  ${getTrustDescription(reputation.trustworthinessIndex)}\n\n`;

    report += '🎖️ BADGES\n';
    report += '─'.repeat(40) + '\n';
    if (reputation.isWhale) report += '  🐋 Whale Status (10M+ $FED)\n';
    if (reputation.isDiamondHands) report += '  💎 Diamond Hands (30+ days)\n';
    if (reputation.isEngaged) report += '  🔥 Engaged Member (100+ XP)\n';
    if (reputation.isLoyal) report += '  🏆 Loyal Participant (2+ seasons)\n';
    if (!reputation.isWhale && !reputation.isDiamondHands && !reputation.isEngaged && !reputation.isLoyal) {
        report += '  📈 Keep building your reputation!\n';
    }
    report += '\n';

    report += '💰 BENEFITS AT THIS TIER\n';
    report += '─'.repeat(40) + '\n';
    for (const benefit of tier.benefits) {
        report += `  ✓ ${benefit}\n`;
    }
    report += '\n';

    report += `Distribution Multiplier: ${tier.multiplier}x\n`;
    report += `Peak Credit Score: ${reputation.peakCreditScore}\n`;
    report += `Score Change: ${reputation.lastScoreChange >= 0 ? '+' : ''}${reputation.lastScoreChange}\n`;

    return report;
}

function createScoreBar(score: number): string {
    const filled = Math.round(score / 5);
    const empty = 20 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

function getTrustDescription(index: number): string {
    if (index >= 90) return 'Exceptional trustworthiness - Prime member status';
    if (index >= 75) return 'High trustworthiness - Reliable community member';
    if (index >= 50) return 'Good trustworthiness - Building solid reputation';
    if (index >= 25) return 'Moderate trustworthiness - Keep participating';
    return 'Building trustworthiness - New to the community';
}

// =====================================================
// CLI INTERFACE
// =====================================================

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Fed Reputation Score System
═══════════════════════════════════════════════════

Usage:
  npx ts-node reputation-score.ts [options]

Options:
  --update              Update all holder reputations
  --check <address>     Check reputation for specific address
  --report <address>    Get detailed credit report for address
  --leaderboard [n]     Show top n holders by reputation (default: 20)
  --stats               Show overall reputation statistics
  --json                Output in JSON format
  --help, -h            Show this help message

Examples:
  npx ts-node reputation-score.ts --update
  npx ts-node reputation-score.ts --check 4Br5iKf...
  npx ts-node reputation-score.ts --leaderboard 10
  npx ts-node reputation-score.ts --stats --json
`);
        return;
    }

    const jsonOutput = args.includes('--json');

    if (args.includes('--update')) {
        const data = updateAllReputations();
        if (jsonOutput) {
            console.log(JSON.stringify(data, null, 2));
        }
        return;
    }

    if (args.includes('--check')) {
        const idx = args.indexOf('--check');
        const address = args[idx + 1];
        if (!address) {
            console.error('Error: Address required for --check');
            return;
        }
        const reputation = calculateReputation(address);
        if (jsonOutput) {
            console.log(JSON.stringify(reputation, null, 2));
        } else {
            const { multiplier, tier, score } = getReputationMultiplier(address);
            console.log(`\n${tier.emoji} ${address.slice(0, 8)}...`);
            console.log(`Fed Credit Score: ${score}`);
            console.log(`Tier: ${tier.title}`);
            console.log(`Multiplier: ${multiplier}x`);
        }
        return;
    }

    if (args.includes('--report')) {
        const idx = args.indexOf('--report');
        const address = args[idx + 1];
        if (!address) {
            console.error('Error: Address required for --report');
            return;
        }
        console.log(getReputationReport(address));
        return;
    }

    if (args.includes('--leaderboard')) {
        const idx = args.indexOf('--leaderboard');
        const limit = parseInt(args[idx + 1]) || 20;
        const leaderboard = getLeaderboard(limit);

        if (jsonOutput) {
            console.log(JSON.stringify(leaderboard, null, 2));
        } else {
            console.log('\n🏆 FED REPUTATION LEADERBOARD');
            console.log('═'.repeat(60));
            console.log('#    Address         Score  Tier           Multiplier');
            console.log('─'.repeat(60));
            leaderboard.forEach((rep, idx) => {
                const tier = getTierFromScore(rep.fedCreditScore);
                console.log(
                    `${(idx + 1).toString().padStart(2)}.  ${rep.address.slice(0, 8)}...${rep.address.slice(-4)}  ` +
                    `${rep.fedCreditScore.toString().padStart(3)}    ${tier.emoji} ${tier.title.padEnd(15)} ${tier.multiplier}x`
                );
            });
        }
        return;
    }

    if (args.includes('--stats')) {
        const data = loadReputationData();
        if (jsonOutput) {
            console.log(JSON.stringify(data.stats, null, 2));
        } else {
            console.log('\n📊 FED REPUTATION STATISTICS');
            console.log('═'.repeat(50));
            console.log(`Total Holders Scored: ${data.totalScored}`);
            console.log(`Average Score: ${data.averageScore}`);
            console.log(`Median Score: ${data.stats.medianScore}`);
            console.log(`Highest Score: ${data.stats.highestScore}`);
            console.log(`Last Updated: ${data.lastUpdated}`);
            console.log('\nTier Breakdown:');
            for (const [tier, count] of Object.entries(data.tierBreakdown)) {
                console.log(`  ${tier}: ${count}`);
            }
        }
        return;
    }

    // Default: show help
    console.log('Use --help to see available commands');
    console.log('Quick start: npx ts-node reputation-score.ts --update');
}

main().catch(console.error);
