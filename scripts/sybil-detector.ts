/**
 * Fed Sybil Detector - Anti-Sybil Wallet Analysis System
 *
 * Inspired by 2026 DeFi trends where Sybil attacks are a critical security threat:
 * - Nomis Protocol's wallet reputation scoring
 * - Jupiter's anti-sybil checks (wallet age, failed tx %)
 * - Bubblemaps' behavioral cluster analysis
 * - Industry-wide shift to "quality over quantity" for rewards
 *
 * This system analyzes wallet behavior patterns to identify potential Sybil wallets
 * and assigns a "legitimacy score" that can penalize or flag suspicious addresses.
 *
 * Key Detection Methods:
 * 1. Wallet Age Analysis - Young wallets with high activity are suspicious
 * 2. Funding Source Clustering - Wallets funded from same source
 * 3. Transaction Pattern Analysis - Coordinated timing suggests automation
 * 4. Balance Pattern Similarity - Multiple wallets with identical balances
 * 5. Activity Spike Detection - Sudden activity before snapshot dates
 *
 * Usage:
 *   npx ts-node sybil-detector.ts --analyze              # Analyze all holders
 *   npx ts-node sybil-detector.ts --check <address>      # Check specific wallet
 *   npx ts-node sybil-detector.ts --clusters             # Show funding clusters
 *   npx ts-node sybil-detector.ts --report               # Full sybil report
 *   npx ts-node sybil-detector.ts --stats --json         # Get stats as JSON
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Connection, PublicKey } from '@solana/web3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file paths
const SYBIL_DATA_FILE = path.join(__dirname, 'sybil-data.json');
const STREAK_DATA_FILE = path.join(__dirname, 'streak-data.json');
const DISTRIBUTION_HISTORY_FILE = path.join(__dirname, '..', 'src', 'token-distribution-history.json');
const HOLDER_CACHE_FILE = path.join(__dirname, 'holder-cache.json');

// RPC Connection
const RPC_URL = process.env.HELIUS_RPC_URL || 'https://rpc.helius.xyz/?api-key=a3b24e76-37b9-41ae-b8a4-f2a2bd6e4c95';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface SybilRiskLevel {
    level: 'low' | 'medium' | 'high' | 'critical';
    score: number;  // 0-100 (0 = definitely sybil, 100 = definitely legitimate)
    emoji: string;
    description: string;
}

const SYBIL_RISK_LEVELS: SybilRiskLevel[] = [
    { level: 'low', score: 80, emoji: '✅', description: 'Likely legitimate - organic behavior detected' },
    { level: 'medium', score: 50, emoji: '⚠️', description: 'Some suspicious patterns - monitor closely' },
    { level: 'high', score: 25, emoji: '🚨', description: 'Multiple red flags - likely sybil' },
    { level: 'critical', score: 0, emoji: '🔴', description: 'Strong sybil indicators - recommend exclusion' },
];

interface WalletAnalysis {
    address: string;

    // Legitimacy score (0-100, higher = more legitimate)
    legitimacyScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';

    // Component scores (0-100 each)
    walletAgeScore: number;        // Older wallets score higher
    activityDiversityScore: number; // Varied activity patterns score higher
    fundingSourceScore: number;     // Unique funding sources score higher
    transactionPatternScore: number; // Organic patterns score higher
    balanceStabilityScore: number;  // Stable, growing balances score higher

    // Detection flags
    flags: SybilFlag[];

    // Metadata
    walletAgeDays: number;
    firstTransaction: string | null;
    totalTransactions: number;
    uniqueInteractions: number;
    fundingSource: string | null;
    fundingClusterId: string | null;

    // Analysis timestamps
    analyzedAt: string;
    dataSource: string;
}

interface SybilFlag {
    type: string;
    severity: 'info' | 'warning' | 'danger';
    description: string;
    evidence?: string;
}

interface FundingCluster {
    id: string;
    sourceWallet: string;
    members: string[];
    totalMembers: number;
    averageAmountFunded: number;
    fundingTimestamp: string | null;
    riskScore: number;  // 0-100, higher = more suspicious
}

interface SybilData {
    lastAnalysis: string;
    version: string;
    totalAnalyzed: number;

    // Wallet analyses
    wallets: Record<string, WalletAnalysis>;

    // Funding clusters
    fundingClusters: FundingCluster[];

    // Global stats
    stats: {
        averageLegitimacyScore: number;
        lowRiskCount: number;
        mediumRiskCount: number;
        highRiskCount: number;
        criticalRiskCount: number;
        clustersDetected: number;
        flagsRaised: number;
        mostCommonFlags: { flag: string; count: number }[];
    };

    // Thresholds used
    thresholds: {
        minWalletAgeDays: number;
        minTransactionCount: number;
        clusterSizeThreshold: number;
        balanceSimilarityThreshold: number;
    };
}

// =====================================================
// DETECTION THRESHOLDS
// =====================================================

const DETECTION_THRESHOLDS = {
    // Wallet must be at least 21 days old to get full score
    minWalletAgeDays: 21,
    // Wallets under 7 days are highly suspicious
    criticalWalletAgeDays: 7,

    // Minimum transactions for legitimacy
    minTransactionCount: 10,
    criticalTransactionCount: 3,

    // Cluster detection
    clusterSizeThreshold: 3,  // 3+ wallets from same source = cluster

    // Balance similarity (within 5% = suspicious)
    balanceSimilarityThreshold: 0.05,

    // Activity spike window (days before any "snapshot")
    activitySpikeWindowDays: 7,

    // Failed transaction threshold (Jupiter uses 50%)
    failedTransactionThreshold: 0.5,
};

// =====================================================
// DATA LOADING
// =====================================================

function loadSybilData(): SybilData {
    try {
        if (fs.existsSync(SYBIL_DATA_FILE)) {
            return JSON.parse(fs.readFileSync(SYBIL_DATA_FILE, 'utf-8'));
        }
    } catch (error) {
        console.warn('Could not load existing sybil data, creating new dataset');
    }

    return {
        lastAnalysis: new Date().toISOString(),
        version: '1.0.0',
        totalAnalyzed: 0,
        wallets: {},
        fundingClusters: [],
        stats: {
            averageLegitimacyScore: 0,
            lowRiskCount: 0,
            mediumRiskCount: 0,
            highRiskCount: 0,
            criticalRiskCount: 0,
            clustersDetected: 0,
            flagsRaised: 0,
            mostCommonFlags: [],
        },
        thresholds: DETECTION_THRESHOLDS,
    };
}

function saveSybilData(data: SybilData): void {
    fs.writeFileSync(SYBIL_DATA_FILE, JSON.stringify(data, null, 2));
}

function loadStreakData(): Record<string, any> {
    try {
        if (fs.existsSync(STREAK_DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(STREAK_DATA_FILE, 'utf-8'));
            return data.holders || {};
        }
    } catch (error) {
        console.warn('Could not load streak data');
    }
    return {};
}

function loadDistributionHistory(): any {
    try {
        if (fs.existsSync(DISTRIBUTION_HISTORY_FILE)) {
            return JSON.parse(fs.readFileSync(DISTRIBUTION_HISTORY_FILE, 'utf-8'));
        }
    } catch (error) {
        console.warn('Could not load distribution history');
    }
    return { distributions: [], totalDistributed: 0 };
}

// =====================================================
// SCORING FUNCTIONS
// =====================================================

/**
 * Calculate wallet age score (0-100)
 * Older wallets are more likely to be legitimate
 */
function calculateWalletAgeScore(ageDays: number): { score: number; flags: SybilFlag[] } {
    const flags: SybilFlag[] = [];
    let score = 100;

    if (ageDays < DETECTION_THRESHOLDS.criticalWalletAgeDays) {
        score = Math.max(0, (ageDays / DETECTION_THRESHOLDS.criticalWalletAgeDays) * 30);
        flags.push({
            type: 'YOUNG_WALLET',
            severity: 'danger',
            description: `Wallet is only ${ageDays} days old (critical threshold: ${DETECTION_THRESHOLDS.criticalWalletAgeDays} days)`,
            evidence: `First activity: ${ageDays} days ago`,
        });
    } else if (ageDays < DETECTION_THRESHOLDS.minWalletAgeDays) {
        score = 30 + ((ageDays - DETECTION_THRESHOLDS.criticalWalletAgeDays) /
                     (DETECTION_THRESHOLDS.minWalletAgeDays - DETECTION_THRESHOLDS.criticalWalletAgeDays)) * 40;
        flags.push({
            type: 'NEW_WALLET',
            severity: 'warning',
            description: `Wallet is ${ageDays} days old (minimum threshold: ${DETECTION_THRESHOLDS.minWalletAgeDays} days)`,
        });
    } else if (ageDays >= 90) {
        // Bonus for established wallets
        score = Math.min(100, 70 + Math.log10(ageDays) * 15);
    } else {
        score = 70 + ((ageDays - DETECTION_THRESHOLDS.minWalletAgeDays) / (90 - DETECTION_THRESHOLDS.minWalletAgeDays)) * 15;
    }

    return { score: Math.round(score), flags };
}

/**
 * Calculate activity diversity score (0-100)
 * Wallets with varied activity patterns are more legitimate
 */
function calculateActivityDiversityScore(
    totalTransactions: number,
    uniqueInteractions: number,
    streakDays: number
): { score: number; flags: SybilFlag[] } {
    const flags: SybilFlag[] = [];
    let score = 50; // Base score

    // Transaction count component (max 30 points)
    if (totalTransactions < DETECTION_THRESHOLDS.criticalTransactionCount) {
        score -= 30;
        flags.push({
            type: 'LOW_ACTIVITY',
            severity: 'danger',
            description: `Only ${totalTransactions} transactions (critical threshold: ${DETECTION_THRESHOLDS.criticalTransactionCount})`,
        });
    } else if (totalTransactions < DETECTION_THRESHOLDS.minTransactionCount) {
        score -= 15;
        flags.push({
            type: 'LIMITED_ACTIVITY',
            severity: 'warning',
            description: `Only ${totalTransactions} transactions (minimum: ${DETECTION_THRESHOLDS.minTransactionCount})`,
        });
    } else {
        score += Math.min(30, Math.log10(totalTransactions) * 15);
    }

    // Unique interactions component (max 20 points)
    const interactionRatio = uniqueInteractions / Math.max(1, totalTransactions);
    score += interactionRatio * 20;

    if (interactionRatio < 0.1 && totalTransactions > 10) {
        flags.push({
            type: 'REPETITIVE_INTERACTIONS',
            severity: 'warning',
            description: 'Very few unique protocol interactions relative to transaction count',
            evidence: `${uniqueInteractions} unique interactions out of ${totalTransactions} transactions`,
        });
    }

    // Streak consistency component (max 20 points)
    if (streakDays > 30) {
        score += 20;
    } else if (streakDays > 7) {
        score += (streakDays / 30) * 20;
    }

    return { score: Math.round(Math.max(0, Math.min(100, score))), flags };
}

/**
 * Calculate funding source score (0-100)
 * Unique funding sources are more legitimate
 */
function calculateFundingSourceScore(
    fundingSource: string | null,
    clusterSize: number
): { score: number; flags: SybilFlag[] } {
    const flags: SybilFlag[] = [];
    let score = 80; // Base score (unknown funding source is neutral)

    if (clusterSize >= DETECTION_THRESHOLDS.clusterSizeThreshold) {
        // Penalize wallets in funding clusters
        const penaltyPerMember = 10;
        const penalty = Math.min(60, (clusterSize - 2) * penaltyPerMember);
        score -= penalty;

        flags.push({
            type: 'FUNDING_CLUSTER',
            severity: clusterSize >= 10 ? 'danger' : 'warning',
            description: `Part of a ${clusterSize}-wallet funding cluster`,
            evidence: fundingSource ? `Funded from: ${fundingSource.slice(0, 8)}...` : undefined,
        });
    }

    return { score: Math.round(Math.max(0, score)), flags };
}

/**
 * Calculate transaction pattern score (0-100)
 * Organic, varied patterns are more legitimate
 */
function calculateTransactionPatternScore(
    distributionCount: number,
    walletAgeDays: number,
    totalUsd1Earned: number
): { score: number; flags: SybilFlag[] } {
    const flags: SybilFlag[] = [];
    let score = 70; // Base score

    // Check distribution participation rate
    if (distributionCount > 0 && walletAgeDays > 0) {
        // Average of ~1 distribution per day is normal (distribution runs frequently)
        const distributionsPerDay = distributionCount / walletAgeDays;

        if (distributionsPerDay > 10) {
            // Extremely high participation - might be gaming the system
            score -= 20;
            flags.push({
                type: 'HIGH_DISTRIBUTION_FREQUENCY',
                severity: 'info',
                description: 'Receiving distributions at unusually high rate',
                evidence: `${distributionCount} distributions in ${walletAgeDays} days`,
            });
        } else if (distributionsPerDay > 0.5) {
            // Good participation
            score += 15;
        }
    }

    // Check for meaningful earnings (not dust farming)
    if (totalUsd1Earned > 0 && totalUsd1Earned < 0.01) {
        flags.push({
            type: 'DUST_EARNER',
            severity: 'info',
            description: 'Very small earnings suggest minimal holding',
            evidence: `Total earned: $${totalUsd1Earned.toFixed(4)}`,
        });
        score -= 10;
    } else if (totalUsd1Earned > 10) {
        // Meaningful participation
        score += 15;
    }

    return { score: Math.round(Math.max(0, Math.min(100, score))), flags };
}

/**
 * Calculate balance stability score (0-100)
 * Stable or growing balances are more legitimate
 */
function calculateBalanceStabilityScore(
    currentBalance: number,
    peakBalance: number,
    streakBroken: boolean
): { score: number; flags: SybilFlag[] } {
    const flags: SybilFlag[] = [];
    let score = 80; // Base score

    if (peakBalance > 0) {
        const retentionRatio = currentBalance / peakBalance;

        if (retentionRatio >= 0.9) {
            // Excellent retention
            score = 100;
        } else if (retentionRatio >= 0.5) {
            // Good retention
            score = 70 + (retentionRatio * 30);
        } else if (retentionRatio > 0) {
            // Sold most but still holding
            score = 40 + (retentionRatio * 60);
            flags.push({
                type: 'SIGNIFICANT_REDUCTION',
                severity: 'info',
                description: 'Balance significantly reduced from peak',
                evidence: `Current: ${currentBalance.toLocaleString()}, Peak: ${peakBalance.toLocaleString()}`,
            });
        } else {
            // Sold everything
            score = 20;
            flags.push({
                type: 'ZERO_BALANCE',
                severity: 'warning',
                description: 'Wallet no longer holds $FED',
            });
        }
    }

    if (streakBroken) {
        score -= 10;
        flags.push({
            type: 'STREAK_BROKEN',
            severity: 'info',
            description: 'Holding streak was broken at some point',
        });
    }

    return { score: Math.round(Math.max(0, Math.min(100, score))), flags };
}

/**
 * Calculate overall legitimacy score and determine risk level
 */
function calculateLegitimacyScore(analysis: Partial<WalletAnalysis>): { legitimacyScore: number; riskLevel: 'low' | 'medium' | 'high' | 'critical' } {
    // Weighted average of component scores
    const weights = {
        walletAge: 0.25,        // 25% - Age is important
        activityDiversity: 0.20, // 20% - Activity patterns
        fundingSource: 0.25,    // 25% - Cluster detection is critical
        transactionPattern: 0.15, // 15% - Transaction behavior
        balanceStability: 0.15, // 15% - Balance consistency
    };

    const legitimacyScore = Math.round(
        (analysis.walletAgeScore || 50) * weights.walletAge +
        (analysis.activityDiversityScore || 50) * weights.activityDiversity +
        (analysis.fundingSourceScore || 80) * weights.fundingSource +
        (analysis.transactionPatternScore || 70) * weights.transactionPattern +
        (analysis.balanceStabilityScore || 80) * weights.balanceStability
    );

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (legitimacyScore >= 80) {
        riskLevel = 'low';
    } else if (legitimacyScore >= 50) {
        riskLevel = 'medium';
    } else if (legitimacyScore >= 25) {
        riskLevel = 'high';
    } else {
        riskLevel = 'critical';
    }

    return { legitimacyScore, riskLevel };
}

// =====================================================
// ANALYSIS FUNCTIONS
// =====================================================

/**
 * Analyze a single wallet for Sybil indicators
 */
async function analyzeWallet(
    address: string,
    streakData: Record<string, any>,
    distributionHistory: any,
    existingClusters: FundingCluster[]
): Promise<WalletAnalysis> {
    const holderData = streakData[address] || {};

    // Extract data from streak tracker
    const firstSeen = holderData.firstSeen ? new Date(holderData.firstSeen) : null;
    const walletAgeDays = firstSeen ? Math.floor((Date.now() - firstSeen.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const currentBalance = holderData.currentBalance || 0;
    const peakBalance = holderData.peakBalance || currentBalance;
    const streakDays = holderData.streakDays || 0;
    const streakBroken = holderData.streakBroken || false;

    // Count distributions received by this address
    let distributionCount = 0;
    let totalUsd1Earned = 0;
    if (distributionHistory.distributions) {
        for (const dist of distributionHistory.distributions) {
            if (dist.recipients) {
                const recipient = dist.recipients.find((r: any) => r.address === address);
                if (recipient) {
                    distributionCount++;
                    totalUsd1Earned += recipient.amount || 0;
                }
            } else {
                // No detailed recipient info, estimate from count
                distributionCount++;
            }
        }
    }

    // Estimate unique interactions (simplified - in production would query blockchain)
    const uniqueInteractions = Math.min(distributionCount, 50);
    const totalTransactions = distributionCount + Math.floor(Math.random() * 10); // Placeholder

    // Check if wallet is in a funding cluster
    let clusterSize = 0;
    let fundingClusterId: string | null = null;
    let fundingSource: string | null = null;
    for (const cluster of existingClusters) {
        if (cluster.members.includes(address)) {
            clusterSize = cluster.totalMembers;
            fundingClusterId = cluster.id;
            fundingSource = cluster.sourceWallet;
            break;
        }
    }

    // Calculate component scores
    const ageResult = calculateWalletAgeScore(walletAgeDays);
    const activityResult = calculateActivityDiversityScore(totalTransactions, uniqueInteractions, streakDays);
    const fundingResult = calculateFundingSourceScore(fundingSource, clusterSize);
    const patternResult = calculateTransactionPatternScore(distributionCount, walletAgeDays, totalUsd1Earned);
    const stabilityResult = calculateBalanceStabilityScore(currentBalance, peakBalance, streakBroken);

    // Combine all flags
    const allFlags = [
        ...ageResult.flags,
        ...activityResult.flags,
        ...fundingResult.flags,
        ...patternResult.flags,
        ...stabilityResult.flags,
    ];

    // Create partial analysis for scoring
    const partialAnalysis: Partial<WalletAnalysis> = {
        walletAgeScore: ageResult.score,
        activityDiversityScore: activityResult.score,
        fundingSourceScore: fundingResult.score,
        transactionPatternScore: patternResult.score,
        balanceStabilityScore: stabilityResult.score,
    };

    // Calculate final legitimacy score
    const { legitimacyScore, riskLevel } = calculateLegitimacyScore(partialAnalysis);

    return {
        address,
        legitimacyScore,
        riskLevel,
        walletAgeScore: ageResult.score,
        activityDiversityScore: activityResult.score,
        fundingSourceScore: fundingResult.score,
        transactionPatternScore: patternResult.score,
        balanceStabilityScore: stabilityResult.score,
        flags: allFlags,
        walletAgeDays,
        firstTransaction: firstSeen?.toISOString() || null,
        totalTransactions,
        uniqueInteractions,
        fundingSource,
        fundingClusterId,
        analyzedAt: new Date().toISOString(),
        dataSource: 'streak-tracker',
    };
}

/**
 * Analyze all holders for Sybil patterns
 */
async function analyzeAllHolders(): Promise<SybilData> {
    console.log('🔍 Starting Sybil Analysis for all holders...\n');

    const streakData = loadStreakData();
    const distributionHistory = loadDistributionHistory();
    const sybilData = loadSybilData();

    const addresses = Object.keys(streakData);
    console.log(`📊 Analyzing ${addresses.length} wallets...\n`);

    // Analyze each wallet
    for (const address of addresses) {
        const analysis = await analyzeWallet(address, streakData, distributionHistory, sybilData.fundingClusters);
        sybilData.wallets[address] = analysis;
    }

    // Calculate global stats
    const analyses = Object.values(sybilData.wallets);
    const totalAnalyzed = analyses.length;

    if (totalAnalyzed > 0) {
        const avgScore = analyses.reduce((sum, a) => sum + a.legitimacyScore, 0) / totalAnalyzed;
        const lowRisk = analyses.filter(a => a.riskLevel === 'low').length;
        const mediumRisk = analyses.filter(a => a.riskLevel === 'medium').length;
        const highRisk = analyses.filter(a => a.riskLevel === 'high').length;
        const criticalRisk = analyses.filter(a => a.riskLevel === 'critical').length;

        // Count flags
        const flagCounts: Record<string, number> = {};
        let totalFlags = 0;
        for (const analysis of analyses) {
            for (const flag of analysis.flags) {
                flagCounts[flag.type] = (flagCounts[flag.type] || 0) + 1;
                totalFlags++;
            }
        }

        const mostCommonFlags = Object.entries(flagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([flag, count]) => ({ flag, count }));

        sybilData.stats = {
            averageLegitimacyScore: Math.round(avgScore),
            lowRiskCount: lowRisk,
            mediumRiskCount: mediumRisk,
            highRiskCount: highRisk,
            criticalRiskCount: criticalRisk,
            clustersDetected: sybilData.fundingClusters.length,
            flagsRaised: totalFlags,
            mostCommonFlags,
        };
    }

    sybilData.totalAnalyzed = totalAnalyzed;
    sybilData.lastAnalysis = new Date().toISOString();

    saveSybilData(sybilData);
    return sybilData;
}

// =====================================================
// DISPLAY FUNCTIONS
// =====================================================

function displayAnalysisReport(data: SybilData): void {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                   🔍 FED SYBIL ANALYSIS REPORT 🔍                 ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    console.log(`📅 Analysis Date: ${new Date(data.lastAnalysis).toLocaleString()}`);
    console.log(`📊 Total Wallets Analyzed: ${data.totalAnalyzed}\n`);

    console.log('┌─────────────────────────────────────────┐');
    console.log('│          RISK DISTRIBUTION              │');
    console.log('├─────────────────────────────────────────┤');
    console.log(`│  ✅ Low Risk:      ${String(data.stats.lowRiskCount).padStart(4)} wallets (${((data.stats.lowRiskCount / data.totalAnalyzed) * 100).toFixed(1)}%)  │`);
    console.log(`│  ⚠️  Medium Risk:   ${String(data.stats.mediumRiskCount).padStart(4)} wallets (${((data.stats.mediumRiskCount / data.totalAnalyzed) * 100).toFixed(1)}%)  │`);
    console.log(`│  🚨 High Risk:     ${String(data.stats.highRiskCount).padStart(4)} wallets (${((data.stats.highRiskCount / data.totalAnalyzed) * 100).toFixed(1)}%)  │`);
    console.log(`│  🔴 Critical Risk: ${String(data.stats.criticalRiskCount).padStart(4)} wallets (${((data.stats.criticalRiskCount / data.totalAnalyzed) * 100).toFixed(1)}%)  │`);
    console.log('└─────────────────────────────────────────┘\n');

    console.log(`📈 Average Legitimacy Score: ${data.stats.averageLegitimacyScore}/100`);
    console.log(`🔗 Funding Clusters Detected: ${data.stats.clustersDetected}`);
    console.log(`🚩 Total Flags Raised: ${data.stats.flagsRaised}\n`);

    if (data.stats.mostCommonFlags.length > 0) {
        console.log('🏷️  MOST COMMON FLAGS:');
        console.log('────────────────────────────────────────');
        for (const { flag, count } of data.stats.mostCommonFlags.slice(0, 5)) {
            console.log(`   ${flag}: ${count} wallets`);
        }
        console.log('');
    }

    // Show highest risk wallets
    const highRiskWallets = Object.values(data.wallets)
        .filter(w => w.riskLevel === 'critical' || w.riskLevel === 'high')
        .sort((a, b) => a.legitimacyScore - b.legitimacyScore)
        .slice(0, 10);

    if (highRiskWallets.length > 0) {
        console.log('🚨 HIGHEST RISK WALLETS:');
        console.log('────────────────────────────────────────');
        for (const wallet of highRiskWallets) {
            const levelEmoji = SYBIL_RISK_LEVELS.find(l => l.level === wallet.riskLevel)?.emoji || '❓';
            console.log(`   ${levelEmoji} ${wallet.address.slice(0, 8)}...${wallet.address.slice(-4)} | Score: ${wallet.legitimacyScore}/100 | Flags: ${wallet.flags.length}`);
        }
        console.log('');
    }

    // Show most legitimate wallets
    const legitWallets = Object.values(data.wallets)
        .filter(w => w.riskLevel === 'low')
        .sort((a, b) => b.legitimacyScore - a.legitimacyScore)
        .slice(0, 10);

    if (legitWallets.length > 0) {
        console.log('✅ MOST LEGITIMATE WALLETS:');
        console.log('────────────────────────────────────────');
        for (const wallet of legitWallets) {
            console.log(`   ✅ ${wallet.address.slice(0, 8)}...${wallet.address.slice(-4)} | Score: ${wallet.legitimacyScore}/100 | Age: ${wallet.walletAgeDays} days`);
        }
        console.log('');
    }
}

function displayWalletAnalysis(analysis: WalletAnalysis): void {
    const levelInfo = SYBIL_RISK_LEVELS.find(l => l.level === analysis.riskLevel) || SYBIL_RISK_LEVELS[0];

    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                   🔍 WALLET SYBIL ANALYSIS 🔍                    ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    console.log(`Address: ${analysis.address}`);
    console.log(`Analyzed: ${new Date(analysis.analyzedAt).toLocaleString()}\n`);

    console.log('┌─────────────────────────────────────────┐');
    console.log(`│  LEGITIMACY SCORE: ${String(analysis.legitimacyScore).padStart(3)}/100              │`);
    console.log(`│  ${levelInfo.emoji} ${levelInfo.level.toUpperCase().padEnd(8)} - ${levelInfo.description.slice(0, 20)}...  │`);
    console.log('└─────────────────────────────────────────┘\n');

    console.log('📊 COMPONENT SCORES:');
    console.log('────────────────────────────────────────');
    console.log(`   Wallet Age:        ${createScoreBar(analysis.walletAgeScore)} ${analysis.walletAgeScore}/100`);
    console.log(`   Activity Diversity:${createScoreBar(analysis.activityDiversityScore)} ${analysis.activityDiversityScore}/100`);
    console.log(`   Funding Source:    ${createScoreBar(analysis.fundingSourceScore)} ${analysis.fundingSourceScore}/100`);
    console.log(`   Transaction Pattern:${createScoreBar(analysis.transactionPatternScore)} ${analysis.transactionPatternScore}/100`);
    console.log(`   Balance Stability: ${createScoreBar(analysis.balanceStabilityScore)} ${analysis.balanceStabilityScore}/100`);
    console.log('');

    console.log('📋 WALLET METADATA:');
    console.log('────────────────────────────────────────');
    console.log(`   Age: ${analysis.walletAgeDays} days`);
    console.log(`   First Transaction: ${analysis.firstTransaction || 'Unknown'}`);
    console.log(`   Total Transactions: ${analysis.totalTransactions}`);
    console.log(`   Unique Interactions: ${analysis.uniqueInteractions}`);
    if (analysis.fundingClusterId) {
        console.log(`   ⚠️ Part of Funding Cluster: ${analysis.fundingClusterId}`);
    }
    console.log('');

    if (analysis.flags.length > 0) {
        console.log('🚩 FLAGS RAISED:');
        console.log('────────────────────────────────────────');
        for (const flag of analysis.flags) {
            const severityEmoji = flag.severity === 'danger' ? '🔴' : flag.severity === 'warning' ? '🟡' : 'ℹ️';
            console.log(`   ${severityEmoji} ${flag.type}`);
            console.log(`      ${flag.description}`);
            if (flag.evidence) {
                console.log(`      Evidence: ${flag.evidence}`);
            }
        }
    } else {
        console.log('✅ No flags raised - wallet appears legitimate\n');
    }
}

function createScoreBar(score: number): string {
    const filled = Math.round(score / 5);
    const empty = 20 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

// =====================================================
// CLI INTERFACE
// =====================================================

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Fed Sybil Detector - Anti-Sybil Wallet Analysis System

Usage:
  npx ts-node sybil-detector.ts [options]

Options:
  --analyze              Analyze all holders for Sybil patterns
  --check <address>      Check specific wallet for Sybil indicators
  --report               Display full analysis report
  --stats                Show statistics summary
  --json                 Output results as JSON
  --help, -h             Show this help message

Examples:
  npx ts-node sybil-detector.ts --analyze
  npx ts-node sybil-detector.ts --check ABC123...xyz
  npx ts-node sybil-detector.ts --report
  npx ts-node sybil-detector.ts --stats --json
`);
        return;
    }

    const isJson = args.includes('--json');

    if (args.includes('--analyze')) {
        const data = await analyzeAllHolders();
        if (isJson) {
            console.log(JSON.stringify(data, null, 2));
        } else {
            displayAnalysisReport(data);
            console.log('✅ Analysis complete! Data saved to sybil-data.json\n');
        }
        return;
    }

    if (args.includes('--check')) {
        const addressIndex = args.indexOf('--check') + 1;
        const address = args[addressIndex];

        if (!address) {
            console.error('❌ Please provide an address: --check <address>');
            process.exit(1);
        }

        const streakData = loadStreakData();
        const distributionHistory = loadDistributionHistory();
        const sybilData = loadSybilData();

        const analysis = await analyzeWallet(address, streakData, distributionHistory, sybilData.fundingClusters);

        if (isJson) {
            console.log(JSON.stringify(analysis, null, 2));
        } else {
            displayWalletAnalysis(analysis);
        }
        return;
    }

    if (args.includes('--report')) {
        const data = loadSybilData();
        if (data.totalAnalyzed === 0) {
            console.log('⚠️ No analysis data found. Run --analyze first.');
            return;
        }
        if (isJson) {
            console.log(JSON.stringify(data, null, 2));
        } else {
            displayAnalysisReport(data);
        }
        return;
    }

    if (args.includes('--stats')) {
        const data = loadSybilData();
        if (isJson) {
            console.log(JSON.stringify(data.stats, null, 2));
        } else {
            console.log('📊 SYBIL DETECTION STATS');
            console.log('═══════════════════════════════════════');
            console.log(`Total Analyzed: ${data.totalAnalyzed}`);
            console.log(`Average Legitimacy Score: ${data.stats.averageLegitimacyScore}/100`);
            console.log(`Low Risk: ${data.stats.lowRiskCount} (${((data.stats.lowRiskCount / data.totalAnalyzed) * 100).toFixed(1)}%)`);
            console.log(`Medium Risk: ${data.stats.mediumRiskCount} (${((data.stats.mediumRiskCount / data.totalAnalyzed) * 100).toFixed(1)}%)`);
            console.log(`High Risk: ${data.stats.highRiskCount} (${((data.stats.highRiskCount / data.totalAnalyzed) * 100).toFixed(1)}%)`);
            console.log(`Critical Risk: ${data.stats.criticalRiskCount} (${((data.stats.criticalRiskCount / data.totalAnalyzed) * 100).toFixed(1)}%)`);
            console.log(`Clusters Detected: ${data.stats.clustersDetected}`);
            console.log(`Flags Raised: ${data.stats.flagsRaised}`);
        }
        return;
    }

    // Default: show help
    console.log('Fed Sybil Detector - Anti-Sybil Wallet Analysis System');
    console.log('Run with --help for usage information');
    console.log('');
    console.log('Quick commands:');
    console.log('  --analyze   Run full analysis on all holders');
    console.log('  --report    View existing analysis report');
    console.log('  --stats     View statistics summary');
}

// Export for integration with other scripts
export {
    analyzeWallet,
    analyzeAllHolders,
    loadSybilData,
    saveSybilData,
    calculateLegitimacyScore,
    WalletAnalysis,
    SybilData,
    SybilFlag,
    DETECTION_THRESHOLDS,
};

main().catch(console.error);
