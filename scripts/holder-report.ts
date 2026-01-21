/**
 * Fed Holder Report System
 *
 * A unified analytics API that aggregates ALL holder data into comprehensive
 * reports. This solves the fragmentation problem where data is spread across
 * multiple systems (reputation, engagement, streaks, season, time locks, etc.)
 *
 * 2026 Research Insights Applied:
 * - Restaking/Yield Aggregation: Holders want unified views of their position
 * - Points Fatigue: Real data, not speculative points
 * - AI-Powered Analytics: Automated insights and recommendations
 * - Anti-Sybil: Quality metrics over quantity
 *
 * Use Cases:
 * - Website dashboard: Single API call for complete holder profile
 * - Distribution script: Quick multiplier lookup
 * - Analytics: Portfolio-level insights for all holders
 * - Marketing: Identify and reward top community members
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// FILE PATHS - All data sources
// =====================================================

const DATA_FILES = {
    reputation: path.join(__dirname, 'reputation-data.json'),
    engagement: path.join(__dirname, 'engagement-data.json'),
    streak: path.join(__dirname, 'streak-data.json'),
    season: path.join(__dirname, 'season-data.json'),
    timeLock: path.join(__dirname, 'time-lock-data.json'),
    quests: path.join(__dirname, 'quest-data.json'),
    referral: path.join(__dirname, 'referral-data.json'),
    autoCompound: path.join(__dirname, 'auto-compound-preferences.json'),
    distribution: path.join(__dirname, '..', 'src', 'token-distribution-history.json'),
    holderReports: path.join(__dirname, 'holder-reports.json'),
};

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface HolderTierInfo {
    name: string;
    title: string;
    emoji: string;
    multiplier: number;
    threshold?: number;
}

interface MultiplierBreakdown {
    tier: { name: string; multiplier: number };
    streak: { days: number; multiplier: number };
    engagement: { xp: number; multiplier: number };
    season: { participation: number; multiplier: number };
    timeLock: { tier: string | null; multiplier: number };
    referral: { count: number; multiplier: number };
    quests: { badges: number; multiplier: number };
    combined: number;
}

interface HolderInsights {
    strengths: string[];
    opportunities: string[];
    nextMilestones: { name: string; progress: number; reward: string }[];
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high';
    engagementTrend: 'rising' | 'stable' | 'declining';
}

interface ComprehensiveHolderReport {
    // Identity
    address: string;
    shortAddress: string;
    reportGeneratedAt: string;

    // Core Metrics
    fedCreditScore: number;
    creditScoreTier: HolderTierInfo;
    trustworthinessIndex: number;

    // Holdings
    currentBalance: number;
    balanceTier: HolderTierInfo;
    peakBalance: number;
    percentOfSupply: number;

    // Time Metrics
    firstInteraction: string | null;
    totalDaysHeld: number;
    currentStreak: number;
    longestStreak: number;
    streakTier: HolderTierInfo;

    // Engagement
    engagementXP: number;
    cycleXP: number;
    engagementTier: HolderTierInfo;
    checkIns: number;
    lastCheckIn: string | null;

    // Season
    currentSeasonParticipation: number;
    seasonTier: HolderTierInfo;
    seasonsParticipated: number;
    seasonAchievements: string[];

    // Time Lock
    activeTimeLock: {
        tier: string | null;
        committedAmount: number;
        startDate: string | null;
        endDate: string | null;
        multiplier: number;
    } | null;

    // Quests & Achievements
    completedQuests: number;
    totalQuests: number;
    badges: string[];
    badgeMultiplierBonus: number;

    // Referrals
    referralCount: number;
    referralTier: HolderTierInfo | null;
    l1Referrals: number;
    l2Referrals: number;
    referralEarnings: number;

    // Distribution History
    totalDistributionsReceived: number;
    totalUsd1Earned: number;
    averageDistribution: number;
    lastDistribution: { date: string; amount: number } | null;

    // Auto-compound
    autoCompoundEnabled: boolean;
    totalAutoCompounded: number;

    // Combined Multiplier
    multiplierBreakdown: MultiplierBreakdown;

    // AI Insights
    insights: HolderInsights;

    // Ranking
    globalRank: number;
    totalHolders: number;
    percentile: number;
}

interface SystemStats {
    totalHolders: number;
    totalDistributed: number;
    averageCreditScore: number;
    medianCreditScore: number;
    topHoldersByScore: { address: string; score: number }[];
    topHoldersByEarnings: { address: string; earnings: number }[];
    tierDistribution: Record<string, number>;
    engagementRate: number;
    autoCompoundRate: number;
}

interface HolderReportsData {
    lastUpdated: string;
    version: string;
    systemStats: SystemStats;
    reports: Record<string, ComprehensiveHolderReport>;
}

// =====================================================
// TIER DEFINITIONS
// =====================================================

const BALANCE_TIERS: HolderTierInfo[] = [
    { name: 'Chairman', title: 'Fed Chairman', emoji: '🏛️', multiplier: 1.5, threshold: 50_000_000 },
    { name: 'Governor', title: 'Fed Governor', emoji: '👔', multiplier: 1.25, threshold: 10_000_000 },
    { name: 'Director', title: 'Regional Director', emoji: '📋', multiplier: 1.1, threshold: 1_000_000 },
    { name: 'Member', title: 'Board Member', emoji: '🎖️', multiplier: 1.05, threshold: 100_000 },
    { name: 'Citizen', title: 'Fed Citizen', emoji: '🗽', multiplier: 1.0, threshold: 0 },
];

const STREAK_TIERS: HolderTierInfo[] = [
    { name: 'FoundingFather', title: 'Founding Father', emoji: '🏛️', multiplier: 1.25, threshold: 365 },
    { name: 'OGFed', title: 'OG Fed', emoji: '💎', multiplier: 1.2, threshold: 180 },
    { name: 'Loyalist', title: 'Fed Loyalist', emoji: '🔷', multiplier: 1.15, threshold: 90 },
    { name: 'DiamondHands', title: 'Diamond Hands', emoji: '💠', multiplier: 1.1, threshold: 30 },
    { name: 'Holder', title: 'Holder', emoji: '🤝', multiplier: 1.05, threshold: 7 },
    { name: 'Newcomer', title: 'Newcomer', emoji: '🆕', multiplier: 1.0, threshold: 0 },
];

const ENGAGEMENT_TIERS: HolderTierInfo[] = [
    { name: 'Elite', title: 'Fed Elite', emoji: '🏆', multiplier: 1.2, threshold: 500 },
    { name: 'Veteran', title: 'Fed Veteran', emoji: '⭐', multiplier: 1.15, threshold: 250 },
    { name: 'Active', title: 'Fed Active', emoji: '🔥', multiplier: 1.1, threshold: 100 },
    { name: 'Regular', title: 'Fed Regular', emoji: '📊', multiplier: 1.05, threshold: 50 },
    { name: 'Newcomer', title: 'Fed Newcomer', emoji: '🆕', multiplier: 1.0, threshold: 0 },
];

const CREDIT_SCORE_TIERS: HolderTierInfo[] = [
    { name: 'Exceptional', title: 'Fed Prime Member', emoji: '💎', multiplier: 1.30, threshold: 800 },
    { name: 'Excellent', title: 'Fed Elite', emoji: '🏆', multiplier: 1.20, threshold: 740 },
    { name: 'Good', title: 'Fed Trusted', emoji: '⭐', multiplier: 1.12, threshold: 670 },
    { name: 'Fair', title: 'Fed Member', emoji: '📊', multiplier: 1.05, threshold: 580 },
    { name: 'Building', title: 'Fed Citizen', emoji: '🗽', multiplier: 1.0, threshold: 300 },
];

const REFERRAL_TIERS: HolderTierInfo[] = [
    { name: 'Ambassador', title: 'Fed Ambassador', emoji: '👑', multiplier: 1.25, threshold: 50 },
    { name: 'Recruiter', title: 'Fed Recruiter', emoji: '⭐', multiplier: 1.15, threshold: 20 },
    { name: 'Advocate', title: 'Fed Advocate', emoji: '🔥', multiplier: 1.1, threshold: 10 },
    { name: 'Supporter', title: 'Fed Supporter', emoji: '💪', multiplier: 1.05, threshold: 5 },
    { name: 'Member', title: 'Fed Member', emoji: '🤝', multiplier: 1.02, threshold: 1 },
];

const SEASON_TIERS: HolderTierInfo[] = [
    { name: 'Champion', title: 'Season Champion', emoji: '🏆', multiplier: 3.0, threshold: 100 },
    { name: 'AllStar', title: 'Season All-Star', emoji: '🥇', multiplier: 2.0, threshold: 90 },
    { name: 'Player', title: 'Season Player', emoji: '🥈', multiplier: 1.5, threshold: 75 },
    { name: 'Participant', title: 'Season Participant', emoji: '🥉', multiplier: 1.0, threshold: 50 },
    { name: 'Rookie', title: 'Season Rookie', emoji: '🌱', multiplier: 0.5, threshold: 0 },
];

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function loadJsonFile<T>(filepath: string, defaultValue: T): T {
    try {
        if (fs.existsSync(filepath)) {
            return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as T;
        }
    } catch (error) {
        console.error(`Error loading ${filepath}:`, error);
    }
    return defaultValue;
}

function getTierByThreshold(value: number, tiers: HolderTierInfo[]): HolderTierInfo {
    for (const tier of tiers) {
        if (value >= (tier.threshold || 0)) {
            return tier;
        }
    }
    return tiers[tiers.length - 1];
}

function shortAddress(address: string): string {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function daysBetween(date1: Date, date2: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((date2.getTime() - date1.getTime()) / msPerDay);
}

// =====================================================
// MAIN REPORT GENERATION
// =====================================================

export function generateHolderReport(address: string): ComprehensiveHolderReport | null {
    // Load all data sources
    const reputationData = loadJsonFile<any>(DATA_FILES.reputation, { holders: {} });
    const engagementData = loadJsonFile<any>(DATA_FILES.engagement, { holders: {} });
    const streakData = loadJsonFile<any>(DATA_FILES.streak, { holders: {} });
    const seasonData = loadJsonFile<any>(DATA_FILES.season, { holders: {} });
    const timeLockData = loadJsonFile<any>(DATA_FILES.timeLock, { holders: {} });
    const questData = loadJsonFile<any>(DATA_FILES.quests, { holders: {} });
    const referralData = loadJsonFile<any>(DATA_FILES.referral, { holders: {} });
    const autoCompoundData = loadJsonFile<any>(DATA_FILES.autoCompound, { preferences: {} });
    const distributionData = loadJsonFile<any>(DATA_FILES.distribution, { distributions: [], totalDistributed: 0 });

    const now = new Date();

    // Extract holder-specific data
    const reputation = reputationData.holders?.[address] || {};
    const engagement = engagementData.holders?.[address] || {};
    const streak = streakData.holders?.[address] || {};
    const season = seasonData.holders?.[address] || {};
    const timeLock = timeLockData.holders?.[address] || {};
    const quests = questData.holders?.[address] || {};
    const referral = referralData.holders?.[address] || {};
    const autoCompound = autoCompoundData.preferences?.[address] || {};

    // Calculate metrics
    const fedCreditScore = reputation.fedCreditScore || 500;
    const creditScoreTier = getTierByThreshold(fedCreditScore, CREDIT_SCORE_TIERS);

    const currentBalance = streak.currentBalance || 0;
    const balanceTier = getTierByThreshold(currentBalance, BALANCE_TIERS);

    const streakDays = streak.streakDays || 0;
    const streakTier = getTierByThreshold(streakDays, STREAK_TIERS);

    const engagementXP = engagement.cycleXP || engagement.xp || 0;
    const engagementTier = getTierByThreshold(engagementXP, ENGAGEMENT_TIERS);

    const seasonParticipation = season.participationScore || 0;
    const seasonTierInfo = getTierByThreshold(seasonParticipation, SEASON_TIERS);

    const referralCount = referral.totalReferrals || 0;
    const referralTier = referralCount > 0 ? getTierByThreshold(referralCount, REFERRAL_TIERS) : null;

    // Time lock multiplier
    let timeLockMultiplier = 1.0;
    let activeTimeLockInfo = null;
    if (timeLock.activeCommitment) {
        const commitment = timeLock.activeCommitment;
        timeLockMultiplier = commitment.multiplier || 1.0;
        activeTimeLockInfo = {
            tier: commitment.tier || null,
            committedAmount: commitment.amount || 0,
            startDate: commitment.startDate || null,
            endDate: commitment.endDate || null,
            multiplier: timeLockMultiplier,
        };
    }

    // Quest/badge multiplier
    const badges = quests.badges || [];
    const badgeMultiplierBonus = badges.reduce((sum: number, badge: any) => {
        return sum + (badge.multiplierBonus || 0);
    }, 0);

    // Calculate combined multiplier
    const multiplierBreakdown: MultiplierBreakdown = {
        tier: { name: balanceTier.name, multiplier: balanceTier.multiplier },
        streak: { days: streakDays, multiplier: streakTier.multiplier },
        engagement: { xp: engagementXP, multiplier: engagementTier.multiplier },
        season: { participation: seasonParticipation, multiplier: seasonTierInfo.multiplier },
        timeLock: { tier: activeTimeLockInfo?.tier || null, multiplier: timeLockMultiplier },
        referral: { count: referralCount, multiplier: referralTier?.multiplier || 1.0 },
        quests: { badges: badges.length, multiplier: 1 + badgeMultiplierBonus },
        combined: 0, // Calculated below
    };

    // Combined multiplier = tier × streak × engagement × timeLock × (1 + badge bonus)
    // Note: Season multiplier applies to season bonus distributions, not regular
    multiplierBreakdown.combined =
        balanceTier.multiplier *
        streakTier.multiplier *
        engagementTier.multiplier *
        timeLockMultiplier *
        (1 + badgeMultiplierBonus);

    // Distribution history
    const distributions = distributionData.distributions || [];
    let totalDistributionsReceived = 0;
    let totalUsd1Earned = 0;
    let lastDistribution: { date: string; amount: number } | null = null;

    for (const dist of distributions) {
        if (dist.recipients) {
            const recipientEntry = dist.recipients.find((r: any) => r.address === address);
            if (recipientEntry) {
                totalDistributionsReceived++;
                totalUsd1Earned += recipientEntry.amount || 0;
                lastDistribution = { date: dist.date, amount: recipientEntry.amount };
            }
        }
    }

    // Calculate insights
    const insights = generateInsights({
        fedCreditScore,
        streakDays,
        engagementXP,
        currentBalance,
        referralCount,
        timeLockMultiplier,
        seasonParticipation,
        badges,
        totalDistributionsReceived,
    });

    // Calculate first interaction date
    const firstInteraction = streak.firstSeen || reputation.firstInteraction || null;
    const totalDaysHeld = firstInteraction ? daysBetween(new Date(firstInteraction), now) : 0;

    // Calculate percentile (mock - would need all holder data)
    const totalHolders = Object.keys(streakData.holders || {}).length || 309;
    const globalRank = Math.max(1, Math.floor(totalHolders * (1 - fedCreditScore / 850)));
    const percentile = Math.round((1 - globalRank / totalHolders) * 100);

    // Build comprehensive report
    const report: ComprehensiveHolderReport = {
        address,
        shortAddress: shortAddress(address),
        reportGeneratedAt: now.toISOString(),

        fedCreditScore,
        creditScoreTier,
        trustworthinessIndex: reputation.trustworthinessIndex || Math.round(fedCreditScore / 8.5),

        currentBalance,
        balanceTier,
        peakBalance: streak.peakBalance || currentBalance,
        percentOfSupply: currentBalance / 1_000_000_000 * 100, // Assuming 1B total supply

        firstInteraction,
        totalDaysHeld,
        currentStreak: streakDays,
        longestStreak: streak.longestStreak || streakDays,
        streakTier,

        engagementXP,
        cycleXP: engagement.cycleXP || 0,
        engagementTier,
        checkIns: engagement.checkInHistory?.length || engagement.checkIns || 0,
        lastCheckIn: engagement.lastCheckIn || null,

        currentSeasonParticipation: seasonParticipation,
        seasonTier: seasonTierInfo,
        seasonsParticipated: season.seasonsParticipated || (seasonParticipation > 0 ? 1 : 0),
        seasonAchievements: season.achievements || [],

        activeTimeLock: activeTimeLockInfo,

        completedQuests: quests.completedQuests?.length || 0,
        totalQuests: 25, // Total available quests
        badges: badges.map((b: any) => b.name || b),
        badgeMultiplierBonus,

        referralCount,
        referralTier,
        l1Referrals: referral.l1Referrals || 0,
        l2Referrals: referral.l2Referrals || 0,
        referralEarnings: referral.totalEarnings || 0,

        totalDistributionsReceived,
        totalUsd1Earned,
        averageDistribution: totalDistributionsReceived > 0 ? totalUsd1Earned / totalDistributionsReceived : 0,
        lastDistribution,

        autoCompoundEnabled: autoCompound.enabled || false,
        totalAutoCompounded: autoCompound.totalCompounded || 0,

        multiplierBreakdown,
        insights,

        globalRank,
        totalHolders,
        percentile,
    };

    return report;
}

function generateInsights(data: {
    fedCreditScore: number;
    streakDays: number;
    engagementXP: number;
    currentBalance: number;
    referralCount: number;
    timeLockMultiplier: number;
    seasonParticipation: number;
    badges: any[];
    totalDistributionsReceived: number;
}): HolderInsights {
    const strengths: string[] = [];
    const opportunities: string[] = [];
    const recommendations: string[] = [];
    const nextMilestones: { name: string; progress: number; reward: string }[] = [];

    // Analyze strengths
    if (data.fedCreditScore >= 740) strengths.push('Excellent credit score');
    if (data.streakDays >= 90) strengths.push('Strong holding commitment');
    if (data.engagementXP >= 250) strengths.push('Highly engaged community member');
    if (data.currentBalance >= 1_000_000) strengths.push('Significant holdings');
    if (data.referralCount >= 10) strengths.push('Active community builder');
    if (data.timeLockMultiplier > 1.0) strengths.push('Committed with time lock');
    if (data.badges.length >= 5) strengths.push('Achievement collector');

    // Identify opportunities
    if (data.streakDays < 30) {
        opportunities.push('Build your holding streak for bonus rewards');
        nextMilestones.push({ name: '30-day streak', progress: (data.streakDays / 30) * 100, reward: '1.1x multiplier' });
    }
    if (data.engagementXP < 100) {
        opportunities.push('Daily check-ins boost your engagement score');
        nextMilestones.push({ name: 'Fed Active tier', progress: (data.engagementXP / 100) * 100, reward: '1.1x multiplier' });
    }
    if (data.referralCount < 5) {
        opportunities.push('Refer friends to unlock referral bonuses');
        nextMilestones.push({ name: 'Fed Supporter', progress: (data.referralCount / 5) * 100, reward: '1.05x multiplier' });
    }
    if (data.timeLockMultiplier === 1.0) {
        opportunities.push('Time lock commitment for up to 2x rewards');
    }
    if (data.seasonParticipation < 50) {
        opportunities.push('Increase season participation for bonus pool');
    }

    // Generate recommendations
    if (strengths.length === 0) {
        recommendations.push('Focus on building your streak - hold for 7+ days to start earning bonuses');
    }
    if (data.engagementXP < 50 && data.totalDistributionsReceived > 5) {
        recommendations.push('You receive distributions but could earn more with daily engagement');
    }
    if (data.currentBalance >= 1_000_000 && data.timeLockMultiplier === 1.0) {
        recommendations.push('As a large holder, a time lock could significantly boost your rewards');
    }
    if (data.fedCreditScore >= 670 && data.referralCount < 5) {
        recommendations.push('Your good reputation makes you an ideal community ambassador');
    }
    if (recommendations.length === 0) {
        recommendations.push('Keep up the great work! You\'re maximizing your Fed benefits.');
    }

    // Determine risk level based on engagement and commitment
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    if (data.streakDays >= 90 && data.timeLockMultiplier > 1.0 && data.engagementXP >= 100) {
        riskLevel = 'low';
    } else if (data.streakDays < 7 || data.engagementXP < 10) {
        riskLevel = 'high';
    }

    // Determine engagement trend (simplified - would need historical data)
    let engagementTrend: 'rising' | 'stable' | 'declining' = 'stable';
    if (data.engagementXP >= 100 && data.totalDistributionsReceived > 10) {
        engagementTrend = 'rising';
    } else if (data.totalDistributionsReceived > 20 && data.engagementXP < 50) {
        engagementTrend = 'declining';
    }

    return {
        strengths,
        opportunities,
        nextMilestones,
        recommendations,
        riskLevel,
        engagementTrend,
    };
}

// =====================================================
// SYSTEM-WIDE STATISTICS
// =====================================================

export function generateSystemStats(): SystemStats {
    const reputationData = loadJsonFile<any>(DATA_FILES.reputation, { holders: {}, stats: {} });
    const streakData = loadJsonFile<any>(DATA_FILES.streak, { holders: {} });
    const autoCompoundData = loadJsonFile<any>(DATA_FILES.autoCompound, { preferences: {} });
    const distributionData = loadJsonFile<any>(DATA_FILES.distribution, { totalDistributed: 0 });
    const engagementData = loadJsonFile<any>(DATA_FILES.engagement, { holders: {}, stats: {} });

    const holders = Object.values(reputationData.holders || {}) as any[];
    const totalHolders = Math.max(holders.length, Object.keys(streakData.holders || {}).length);

    // Calculate score statistics
    const scores = holders.map(h => h.fedCreditScore || 500).filter(s => s > 0);
    const sortedScores = [...scores].sort((a, b) => a - b);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 500;
    const medianScore = scores.length > 0 ? sortedScores[Math.floor(sortedScores.length / 2)] : 500;

    // Top holders by score
    const topByScore = holders
        .sort((a, b) => (b.fedCreditScore || 0) - (a.fedCreditScore || 0))
        .slice(0, 10)
        .map(h => ({ address: shortAddress(h.address), score: h.fedCreditScore || 0 }));

    // Top holders by earnings
    const topByEarnings = holders
        .sort((a, b) => (b.totalUsd1Earned || 0) - (a.totalUsd1Earned || 0))
        .slice(0, 10)
        .map(h => ({ address: shortAddress(h.address), earnings: h.totalUsd1Earned || 0 }));

    // Tier distribution
    const tierDistribution: Record<string, number> = {};
    for (const holder of holders) {
        const tier = holder.tier || 'Building';
        tierDistribution[tier] = (tierDistribution[tier] || 0) + 1;
    }

    // Engagement rate
    const engagedHolders = Object.values(engagementData.holders || {}).filter((h: any) => h.cycleXP > 0).length;
    const engagementRate = totalHolders > 0 ? Math.round((engagedHolders / totalHolders) * 100) : 0;

    // Auto-compound rate
    const autoCompoundEnabled = Object.values(autoCompoundData.preferences || {}).filter((p: any) => p.enabled).length;
    const autoCompoundRate = totalHolders > 0 ? Math.round((autoCompoundEnabled / totalHolders) * 100) : 0;

    return {
        totalHolders,
        totalDistributed: distributionData.totalDistributed || 0,
        averageCreditScore: averageScore,
        medianCreditScore: medianScore,
        topHoldersByScore: topByScore,
        topHoldersByEarnings: topByEarnings,
        tierDistribution,
        engagementRate,
        autoCompoundRate,
    };
}

// =====================================================
// OUTPUT FORMATTERS
// =====================================================

function formatReport(report: ComprehensiveHolderReport): string {
    const lines: string[] = [];

    lines.push('');
    lines.push('╔══════════════════════════════════════════════════════════════════╗');
    lines.push('║           🏛️  FED COMPREHENSIVE HOLDER REPORT  🏛️                 ║');
    lines.push('╚══════════════════════════════════════════════════════════════════╝');
    lines.push('');
    lines.push(`  Address: ${report.shortAddress}`);
    lines.push(`  Report Generated: ${new Date(report.reportGeneratedAt).toLocaleString()}`);
    lines.push('');

    // Credit Score Section
    lines.push('┌─────────────────────────────────────────┐');
    lines.push(`│  FED CREDIT SCORE: ${report.fedCreditScore.toString().padEnd(4)}                  │`);
    lines.push(`│  ${report.creditScoreTier.emoji} ${report.creditScoreTier.title.padEnd(32)} │`);
    lines.push('└─────────────────────────────────────────┘');
    lines.push('');

    // Holdings
    lines.push('📊 HOLDINGS');
    lines.push('────────────────────────────────────────');
    lines.push(`  Balance: ${report.currentBalance.toLocaleString()} $FED`);
    lines.push(`  Tier: ${report.balanceTier.emoji} ${report.balanceTier.title} (${report.balanceTier.multiplier}x)`);
    lines.push(`  % of Supply: ${report.percentOfSupply.toFixed(4)}%`);
    lines.push(`  Peak Balance: ${report.peakBalance.toLocaleString()} $FED`);
    lines.push('');

    // Time Metrics
    lines.push('⏱️  TIME METRICS');
    lines.push('────────────────────────────────────────');
    lines.push(`  Days Held: ${report.totalDaysHeld}`);
    lines.push(`  Current Streak: ${report.currentStreak} days`);
    lines.push(`  Longest Streak: ${report.longestStreak} days`);
    lines.push(`  Streak Tier: ${report.streakTier.emoji} ${report.streakTier.title} (${report.streakTier.multiplier}x)`);
    lines.push('');

    // Engagement
    lines.push('🎮 ENGAGEMENT');
    lines.push('────────────────────────────────────────');
    lines.push(`  Total XP: ${report.engagementXP}`);
    lines.push(`  Cycle XP: ${report.cycleXP}`);
    lines.push(`  Tier: ${report.engagementTier.emoji} ${report.engagementTier.title} (${report.engagementTier.multiplier}x)`);
    lines.push(`  Check-ins: ${report.checkIns}`);
    lines.push('');

    // Multiplier Breakdown
    lines.push('💰 MULTIPLIER BREAKDOWN');
    lines.push('────────────────────────────────────────');
    const mb = report.multiplierBreakdown;
    lines.push(`  Tier:        ${mb.tier.multiplier.toFixed(2)}x (${mb.tier.name})`);
    lines.push(`  Streak:      ${mb.streak.multiplier.toFixed(2)}x (${mb.streak.days} days)`);
    lines.push(`  Engagement:  ${mb.engagement.multiplier.toFixed(2)}x (${mb.engagement.xp} XP)`);
    if (mb.timeLock.tier) {
        lines.push(`  Time Lock:   ${mb.timeLock.multiplier.toFixed(2)}x (${mb.timeLock.tier})`);
    }
    if (mb.quests.badges > 0) {
        lines.push(`  Badges:      +${(mb.quests.multiplier - 1).toFixed(0)}% (${mb.quests.badges} badges)`);
    }
    lines.push(`  ─────────────────────────────────`);
    lines.push(`  COMBINED:    ${mb.combined.toFixed(3)}x`);
    lines.push('');

    // Distribution History
    lines.push('💵 DISTRIBUTION HISTORY');
    lines.push('────────────────────────────────────────');
    lines.push(`  Distributions Received: ${report.totalDistributionsReceived}`);
    lines.push(`  Total USD1 Earned: $${report.totalUsd1Earned.toFixed(2)}`);
    lines.push(`  Average per Distribution: $${report.averageDistribution.toFixed(4)}`);
    if (report.lastDistribution) {
        lines.push(`  Last Distribution: $${report.lastDistribution.amount.toFixed(4)} (${new Date(report.lastDistribution.date).toLocaleDateString()})`);
    }
    lines.push('');

    // Auto-compound
    if (report.autoCompoundEnabled) {
        lines.push('🔄 AUTO-COMPOUND');
        lines.push('────────────────────────────────────────');
        lines.push(`  Status: ✅ Enabled`);
        lines.push(`  Total Compounded: $${report.totalAutoCompounded.toFixed(2)}`);
        lines.push('');
    }

    // Referrals
    if (report.referralCount > 0) {
        lines.push('👥 REFERRALS');
        lines.push('────────────────────────────────────────');
        lines.push(`  Total Referrals: ${report.referralCount}`);
        lines.push(`  L1 Referrals: ${report.l1Referrals}`);
        lines.push(`  L2 Referrals: ${report.l2Referrals}`);
        if (report.referralTier) {
            lines.push(`  Tier: ${report.referralTier.emoji} ${report.referralTier.title}`);
        }
        lines.push('');
    }

    // Badges
    if (report.badges.length > 0) {
        lines.push('🎖️  BADGES');
        lines.push('────────────────────────────────────────');
        lines.push(`  ${report.badges.join(', ')}`);
        lines.push('');
    }

    // Insights
    lines.push('💡 INSIGHTS');
    lines.push('────────────────────────────────────────');
    if (report.insights.strengths.length > 0) {
        lines.push('  Strengths:');
        report.insights.strengths.forEach(s => lines.push(`    ✓ ${s}`));
    }
    if (report.insights.opportunities.length > 0) {
        lines.push('  Opportunities:');
        report.insights.opportunities.forEach(o => lines.push(`    → ${o}`));
    }
    lines.push('');
    lines.push('  Recommendations:');
    report.insights.recommendations.forEach(r => lines.push(`    💡 ${r}`));
    lines.push('');

    // Next Milestones
    if (report.insights.nextMilestones.length > 0) {
        lines.push('🎯 NEXT MILESTONES');
        lines.push('────────────────────────────────────────');
        report.insights.nextMilestones.forEach(m => {
            const bar = '█'.repeat(Math.floor(m.progress / 10)) + '░'.repeat(10 - Math.floor(m.progress / 10));
            lines.push(`  ${m.name}: [${bar}] ${m.progress.toFixed(0)}%`);
            lines.push(`    Reward: ${m.reward}`);
        });
        lines.push('');
    }

    // Ranking
    lines.push('📈 RANKING');
    lines.push('────────────────────────────────────────');
    lines.push(`  Global Rank: #${report.globalRank} of ${report.totalHolders}`);
    lines.push(`  Percentile: Top ${100 - report.percentile}%`);
    lines.push(`  Risk Level: ${report.insights.riskLevel.toUpperCase()}`);
    lines.push(`  Engagement Trend: ${report.insights.engagementTrend}`);
    lines.push('');

    return lines.join('\n');
}

function formatSystemStats(stats: SystemStats): string {
    const lines: string[] = [];

    lines.push('');
    lines.push('╔══════════════════════════════════════════════════════════════════╗');
    lines.push('║              🏛️  FED SYSTEM STATISTICS  🏛️                        ║');
    lines.push('╚══════════════════════════════════════════════════════════════════╝');
    lines.push('');

    lines.push('📊 OVERVIEW');
    lines.push('────────────────────────────────────────');
    lines.push(`  Total Holders: ${stats.totalHolders.toLocaleString()}`);
    lines.push(`  Total Distributed: $${stats.totalDistributed.toFixed(2)}`);
    lines.push(`  Average Credit Score: ${stats.averageCreditScore}`);
    lines.push(`  Median Credit Score: ${stats.medianCreditScore}`);
    lines.push('');

    lines.push('📈 ENGAGEMENT METRICS');
    lines.push('────────────────────────────────────────');
    lines.push(`  Engagement Rate: ${stats.engagementRate}%`);
    lines.push(`  Auto-Compound Rate: ${stats.autoCompoundRate}%`);
    lines.push('');

    lines.push('🏆 TOP HOLDERS BY CREDIT SCORE');
    lines.push('────────────────────────────────────────');
    stats.topHoldersByScore.slice(0, 5).forEach((h, i) => {
        lines.push(`  ${i + 1}. ${h.address}: ${h.score}`);
    });
    lines.push('');

    lines.push('💵 TOP HOLDERS BY EARNINGS');
    lines.push('────────────────────────────────────────');
    stats.topHoldersByEarnings.slice(0, 5).forEach((h, i) => {
        lines.push(`  ${i + 1}. ${h.address}: $${h.earnings.toFixed(2)}`);
    });
    lines.push('');

    lines.push('📊 TIER DISTRIBUTION');
    lines.push('────────────────────────────────────────');
    Object.entries(stats.tierDistribution).forEach(([tier, count]) => {
        const pct = ((count / stats.totalHolders) * 100).toFixed(1);
        lines.push(`  ${tier}: ${count} (${pct}%)`);
    });
    lines.push('');

    return lines.join('\n');
}

// =====================================================
// CLI INTERFACE
// =====================================================

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.length === 0) {
        console.log(`
Fed Holder Report System - Unified Analytics API

Usage:
  npx ts-node holder-report.ts --report <address>   Generate full holder report
  npx ts-node holder-report.ts --stats              System-wide statistics
  npx ts-node holder-report.ts --quick <address>    Quick multiplier lookup
  npx ts-node holder-report.ts --json               Output in JSON format
  npx ts-node holder-report.ts --help               Show this help

Options:
  --report <address>    Generate comprehensive report for a specific holder
  --stats               Generate system-wide statistics
  --quick <address>     Quick lookup of combined multiplier for address
  --json                Output results in JSON format (for API integration)
  --save                Save report to holder-reports.json

Examples:
  npx ts-node holder-report.ts --report 4Br5iKfL...
  npx ts-node holder-report.ts --stats --json
  npx ts-node holder-report.ts --quick 7xMn2Jp... --json
`);
        return;
    }

    const jsonOutput = args.includes('--json');
    const saveToFile = args.includes('--save');

    if (args.includes('--stats')) {
        const stats = generateSystemStats();

        if (jsonOutput) {
            console.log(JSON.stringify(stats, null, 2));
        } else {
            console.log(formatSystemStats(stats));
        }
        return;
    }

    if (args.includes('--report')) {
        const addressIndex = args.indexOf('--report') + 1;
        const address = args[addressIndex];

        if (!address || address.startsWith('--')) {
            console.error('Error: Please provide an address with --report');
            process.exit(1);
        }

        const report = generateHolderReport(address);

        if (!report) {
            console.error(`Error: Could not generate report for address ${address}`);
            process.exit(1);
        }

        if (jsonOutput) {
            console.log(JSON.stringify(report, null, 2));
        } else {
            console.log(formatReport(report));
        }

        if (saveToFile) {
            const existingData = loadJsonFile<HolderReportsData>(DATA_FILES.holderReports, {
                lastUpdated: '',
                version: '1.0.0',
                systemStats: {} as SystemStats,
                reports: {},
            });

            existingData.reports[address] = report;
            existingData.lastUpdated = new Date().toISOString();

            fs.writeFileSync(DATA_FILES.holderReports, JSON.stringify(existingData, null, 2));
            console.log(`\n✅ Report saved to holder-reports.json`);
        }

        return;
    }

    if (args.includes('--quick')) {
        const addressIndex = args.indexOf('--quick') + 1;
        const address = args[addressIndex];

        if (!address || address.startsWith('--')) {
            console.error('Error: Please provide an address with --quick');
            process.exit(1);
        }

        const report = generateHolderReport(address);

        if (!report) {
            console.error(`Error: Could not generate report for address ${address}`);
            process.exit(1);
        }

        const quickResult = {
            address: report.shortAddress,
            fedCreditScore: report.fedCreditScore,
            combinedMultiplier: report.multiplierBreakdown.combined,
            breakdown: {
                tier: report.multiplierBreakdown.tier.multiplier,
                streak: report.multiplierBreakdown.streak.multiplier,
                engagement: report.multiplierBreakdown.engagement.multiplier,
                timeLock: report.multiplierBreakdown.timeLock.multiplier,
                badges: report.multiplierBreakdown.quests.multiplier,
            }
        };

        if (jsonOutput) {
            console.log(JSON.stringify(quickResult, null, 2));
        } else {
            console.log(`
Address: ${quickResult.address}
Credit Score: ${quickResult.fedCreditScore}
Combined Multiplier: ${quickResult.combinedMultiplier.toFixed(3)}x
  - Tier: ${quickResult.breakdown.tier.toFixed(2)}x
  - Streak: ${quickResult.breakdown.streak.toFixed(2)}x
  - Engagement: ${quickResult.breakdown.engagement.toFixed(2)}x
  - Time Lock: ${quickResult.breakdown.timeLock.toFixed(2)}x
  - Badges: ${quickResult.breakdown.badges.toFixed(2)}x
`);
        }

        return;
    }

    // Default: show help
    console.log('Use --help to see available commands');
}

// Export for use in other scripts
export {
    ComprehensiveHolderReport,
    MultiplierBreakdown,
    HolderInsights,
    SystemStats,
    generateSystemStats,
};

main().catch(console.error);
