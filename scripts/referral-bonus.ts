/**
 * Fed Referral Bonus System
 *
 * A referral tracking system that rewards $FED holders for bringing new holders
 * into the ecosystem. Inspired by successful referral programs from:
 * - Bybit (lifetime commissions on referrals)
 * - Crypto.com (tiered referral rewards)
 * - KuCoin (sub-affiliate/second-level rewards)
 * - DRIP Network (referral upline bonuses)
 *
 * How it works:
 * 1. When a new wallet acquires $FED, they can be linked to a referrer
 * 2. Referrers earn bonus multipliers on their distributions based on:
 *    - Number of active referrals (wallets still holding)
 *    - Total $FED held by their referral network
 *    - Referral retention rate
 * 3. Multi-level referral rewards (referrer of referrer gets small bonus)
 *
 * Referral Links Format: fed.markets?ref=<wallet_address>
 *
 * @author Ralph - The Fed Agent
 * @version 1.0.0
 * @date 2026-01-21
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const REFERRAL_DATA_FILE = path.join(__dirname, 'referral-data.json');
const HOLDER_SNAPSHOT_FILE = path.join(__dirname, 'holder-snapshot.json');

// ============================================================================
// TIER DEFINITIONS
// ============================================================================

/**
 * Referral Tier System - Based on number of active referrals
 *
 * Inspired by traditional finance affiliate programs and crypto exchange tiers.
 * Higher tiers get better multipliers on their own distributions.
 */
interface ReferralTier {
    name: string;
    title: string;
    minReferrals: number;       // Minimum active referrals needed
    multiplier: number;          // Bonus multiplier on own distribution
    networkBonus: number;        // % of network's rewards as bonus (level 1)
    level2Bonus: number;         // % of level 2 network rewards
    emoji: string;
}

const REFERRAL_TIERS: ReferralTier[] = [
    {
        name: 'FedAmbassador',
        title: 'Fed Ambassador',
        minReferrals: 50,
        multiplier: 1.25,
        networkBonus: 0.05,  // 5% of L1 referrals' rewards
        level2Bonus: 0.01,   // 1% of L2 referrals' rewards
        emoji: '👑'
    },
    {
        name: 'FedRecruiter',
        title: 'Fed Recruiter',
        minReferrals: 20,
        multiplier: 1.15,
        networkBonus: 0.04,  // 4% of L1 referrals' rewards
        level2Bonus: 0.005,  // 0.5% of L2 referrals' rewards
        emoji: '⭐'
    },
    {
        name: 'FedAdvocate',
        title: 'Fed Advocate',
        minReferrals: 10,
        multiplier: 1.1,
        networkBonus: 0.03,  // 3% of L1 referrals' rewards
        level2Bonus: 0,      // No L2 bonus
        emoji: '🔥'
    },
    {
        name: 'FedSupporter',
        title: 'Fed Supporter',
        minReferrals: 5,
        multiplier: 1.05,
        networkBonus: 0.02,  // 2% of L1 referrals' rewards
        level2Bonus: 0,      // No L2 bonus
        emoji: '💪'
    },
    {
        name: 'FedMember',
        title: 'Fed Member',
        minReferrals: 1,
        multiplier: 1.02,
        networkBonus: 0.01,  // 1% of L1 referrals' rewards
        level2Bonus: 0,      // No L2 bonus
        emoji: '🤝'
    },
    {
        name: 'NoReferrals',
        title: 'No Referrals',
        minReferrals: 0,
        multiplier: 1.0,
        networkBonus: 0,
        level2Bonus: 0,
        emoji: '📋'
    },
];

// ============================================================================
// DATA STRUCTURES
// ============================================================================

interface ReferralRelationship {
    referee: string;           // The new holder's address
    referrer: string;          // Who referred them
    timestamp: string;         // When relationship was created
    firstPurchaseAmount: number; // Initial $FED purchase
    isActive: boolean;         // Still holding $FED
    currentBalance: number;    // Current $FED balance
    totalDistributed: number;  // Total USD1 received by referee
    lastUpdated: string;
}

interface ReferrerStats {
    address: string;
    totalReferrals: number;       // All-time referrals
    activeReferrals: number;      // Currently holding $FED
    networkHoldings: number;      // Total $FED held by network
    networkDistributed: number;   // Total USD1 distributed to network
    retentionRate: number;        // % of referrals still active
    tier: ReferralTier;
    referralBonus: number;        // Bonus earned from referrals
    level2Referrals: number;      // Referrals of referrals
    level2Holdings: number;       // L2 network holdings
    joinDate: string;
    lastReferralDate: string;
}

interface ReferralData {
    version: string;
    lastUpdated: string;
    relationships: Record<string, ReferralRelationship>; // referee -> relationship
    referrerStats: Record<string, ReferrerStats>;        // referrer -> stats
    globalStats: {
        totalReferrals: number;
        activeReferrals: number;
        totalNetworkBonus: number;
        topReferrer: string;
        topReferrerCount: number;
    };
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Load referral data from file
 */
function loadReferralData(): ReferralData {
    try {
        if (fs.existsSync(REFERRAL_DATA_FILE)) {
            return JSON.parse(fs.readFileSync(REFERRAL_DATA_FILE, 'utf-8'));
        }
    } catch (error) {
        console.warn('⚠️ Could not load referral data:', error);
    }

    // Return empty structure
    return {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        relationships: {},
        referrerStats: {},
        globalStats: {
            totalReferrals: 0,
            activeReferrals: 0,
            totalNetworkBonus: 0,
            topReferrer: '',
            topReferrerCount: 0,
        }
    };
}

/**
 * Save referral data to file
 */
function saveReferralData(data: ReferralData): void {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(REFERRAL_DATA_FILE, JSON.stringify(data, null, 2));
}

/**
 * Get the tier for a referrer based on active referrals
 */
function getReferralTier(activeReferrals: number): ReferralTier {
    for (const tier of REFERRAL_TIERS) {
        if (activeReferrals >= tier.minReferrals) {
            return tier;
        }
    }
    return REFERRAL_TIERS[REFERRAL_TIERS.length - 1];
}

/**
 * Register a new referral relationship
 */
function registerReferral(
    data: ReferralData,
    referee: string,
    referrer: string,
    initialPurchase: number = 0
): boolean {
    // Validate inputs
    if (!referee || !referrer) {
        console.error('❌ Invalid referee or referrer address');
        return false;
    }

    // Prevent self-referral
    if (referee.toLowerCase() === referrer.toLowerCase()) {
        console.error('❌ Cannot refer yourself');
        return false;
    }

    // Check if referee already has a referrer
    if (data.relationships[referee]) {
        console.warn(`⚠️ ${referee.slice(0, 8)}... already has a referrer`);
        return false;
    }

    // Create the relationship
    const relationship: ReferralRelationship = {
        referee,
        referrer,
        timestamp: new Date().toISOString(),
        firstPurchaseAmount: initialPurchase,
        isActive: initialPurchase > 0,
        currentBalance: initialPurchase,
        totalDistributed: 0,
        lastUpdated: new Date().toISOString(),
    };

    data.relationships[referee] = relationship;

    // Update referrer stats
    if (!data.referrerStats[referrer]) {
        data.referrerStats[referrer] = {
            address: referrer,
            totalReferrals: 0,
            activeReferrals: 0,
            networkHoldings: 0,
            networkDistributed: 0,
            retentionRate: 0,
            tier: REFERRAL_TIERS[REFERRAL_TIERS.length - 1],
            referralBonus: 0,
            level2Referrals: 0,
            level2Holdings: 0,
            joinDate: new Date().toISOString(),
            lastReferralDate: new Date().toISOString(),
        };
    }

    const stats = data.referrerStats[referrer];
    stats.totalReferrals++;
    if (initialPurchase > 0) {
        stats.activeReferrals++;
        stats.networkHoldings += initialPurchase;
    }
    stats.lastReferralDate = new Date().toISOString();
    stats.retentionRate = stats.totalReferrals > 0
        ? (stats.activeReferrals / stats.totalReferrals) * 100
        : 0;
    stats.tier = getReferralTier(stats.activeReferrals);

    // Update global stats
    data.globalStats.totalReferrals++;
    if (initialPurchase > 0) {
        data.globalStats.activeReferrals++;
    }

    // Check if this is new top referrer
    if (stats.activeReferrals > data.globalStats.topReferrerCount) {
        data.globalStats.topReferrer = referrer;
        data.globalStats.topReferrerCount = stats.activeReferrals;
    }

    console.log(`✅ Registered referral: ${referee.slice(0, 8)}... → referred by ${referrer.slice(0, 8)}...`);
    return true;
}

/**
 * Update referral balances from holder snapshot
 * Call this periodically to keep referral data in sync
 */
function updateReferralBalances(
    data: ReferralData,
    holderBalances: Record<string, number>
): void {
    console.log('\n📊 Updating referral balances...');

    let changesCount = 0;

    // Update each relationship
    for (const [referee, relationship] of Object.entries(data.relationships)) {
        const newBalance = holderBalances[referee] || 0;
        const wasActive = relationship.isActive;
        const isNowActive = newBalance > 0;

        // Update relationship
        relationship.currentBalance = newBalance;
        relationship.isActive = isNowActive;
        relationship.lastUpdated = new Date().toISOString();

        // Track status change
        if (wasActive !== isNowActive) {
            changesCount++;
            if (isNowActive) {
                console.log(`  📈 ${referee.slice(0, 8)}... became active`);
            } else {
                console.log(`  📉 ${referee.slice(0, 8)}... became inactive`);
            }
        }
    }

    // Recalculate all referrer stats
    for (const referrerAddress of Object.keys(data.referrerStats)) {
        const stats = data.referrerStats[referrerAddress];

        // Find all referrals for this referrer
        let activeCount = 0;
        let totalHoldings = 0;

        for (const relationship of Object.values(data.relationships)) {
            if (relationship.referrer === referrerAddress) {
                if (relationship.isActive) {
                    activeCount++;
                    totalHoldings += relationship.currentBalance;
                }
            }
        }

        stats.activeReferrals = activeCount;
        stats.networkHoldings = totalHoldings;
        stats.retentionRate = stats.totalReferrals > 0
            ? (stats.activeReferrals / stats.totalReferrals) * 100
            : 0;
        stats.tier = getReferralTier(stats.activeReferrals);

        // Calculate level 2 stats (referrals of referrals)
        let l2Count = 0;
        let l2Holdings = 0;

        for (const [referee, relationship] of Object.entries(data.relationships)) {
            if (relationship.referrer === referrerAddress) {
                // This is a direct referral - check if THEY have referrals
                const l1ReferrerStats = data.referrerStats[referee];
                if (l1ReferrerStats) {
                    l2Count += l1ReferrerStats.activeReferrals;
                    l2Holdings += l1ReferrerStats.networkHoldings;
                }
            }
        }

        stats.level2Referrals = l2Count;
        stats.level2Holdings = l2Holdings;
    }

    // Update global stats
    data.globalStats.activeReferrals = Object.values(data.relationships)
        .filter(r => r.isActive).length;

    // Find top referrer
    let topReferrer = '';
    let topCount = 0;
    for (const [address, stats] of Object.entries(data.referrerStats)) {
        if (stats.activeReferrals > topCount) {
            topCount = stats.activeReferrals;
            topReferrer = address;
        }
    }
    data.globalStats.topReferrer = topReferrer;
    data.globalStats.topReferrerCount = topCount;

    console.log(`✅ Updated ${Object.keys(data.relationships).length} referral relationships`);
    console.log(`   ${changesCount} status changes detected`);
    console.log(`   ${data.globalStats.activeReferrals} active referrals`);
}

/**
 * Get referral multiplier for a holder
 * This is used during distribution to boost referrer rewards
 */
export function getReferralMultiplier(
    address: string,
    referralData: ReferralData | null
): { multiplier: number; tier: ReferralTier; activeReferrals: number } {
    const defaultTier = REFERRAL_TIERS[REFERRAL_TIERS.length - 1];

    if (!referralData || !referralData.referrerStats[address]) {
        return { multiplier: 1.0, tier: defaultTier, activeReferrals: 0 };
    }

    const stats = referralData.referrerStats[address];
    return {
        multiplier: stats.tier.multiplier,
        tier: stats.tier,
        activeReferrals: stats.activeReferrals,
    };
}

/**
 * Calculate network bonus for a referrer
 * This is additional rewards from their referral network
 */
export function calculateNetworkBonus(
    referrerAddress: string,
    referralData: ReferralData,
    distributionAmounts: Record<string, number> // referee -> amount distributed
): number {
    const stats = referralData.referrerStats[referrerAddress];
    if (!stats) return 0;

    let bonus = 0;

    // Level 1 bonus: % of direct referrals' distributions
    for (const [referee, relationship] of Object.entries(referralData.relationships)) {
        if (relationship.referrer === referrerAddress && distributionAmounts[referee]) {
            bonus += distributionAmounts[referee] * stats.tier.networkBonus;
        }
    }

    // Level 2 bonus: % of L2 referrals' distributions (if tier allows)
    if (stats.tier.level2Bonus > 0) {
        for (const [l1Referee] of Object.entries(referralData.relationships)) {
            if (referralData.relationships[l1Referee]?.referrer === referrerAddress) {
                // Find L1 referee's referrals (L2)
                for (const [l2Referee, l2Relationship] of Object.entries(referralData.relationships)) {
                    if (l2Relationship.referrer === l1Referee && distributionAmounts[l2Referee]) {
                        bonus += distributionAmounts[l2Referee] * stats.tier.level2Bonus;
                    }
                }
            }
        }
    }

    return bonus;
}

/**
 * Generate leaderboard of top referrers
 */
function generateLeaderboard(data: ReferralData, limit: number = 10): void {
    const sorted = Object.values(data.referrerStats)
        .sort((a, b) => b.activeReferrals - a.activeReferrals)
        .slice(0, limit);

    console.log('\n' + '='.repeat(70));
    console.log('🏆 TOP REFERRERS LEADERBOARD');
    console.log('='.repeat(70));
    console.log(`${'Rank'.padEnd(6)} ${'Address'.padEnd(14)} ${'Tier'.padEnd(16)} ${'Active'.padEnd(8)} ${'Network Holdings'.padEnd(18)} ${'Retention'}`);
    console.log('-'.repeat(70));

    sorted.forEach((stats, index) => {
        const rank = `#${index + 1}`;
        const addr = stats.address.slice(0, 12) + '...';
        const tierDisplay = `${stats.tier.emoji} ${stats.tier.title}`;
        const active = stats.activeReferrals.toString();
        const holdings = formatNumber(stats.networkHoldings);
        const retention = `${stats.retentionRate.toFixed(1)}%`;

        console.log(`${rank.padEnd(6)} ${addr.padEnd(14)} ${tierDisplay.padEnd(16)} ${active.padEnd(8)} ${holdings.padEnd(18)} ${retention}`);
    });

    console.log('='.repeat(70));
}

/**
 * Generate JSON output for API/website integration
 */
function generateJsonOutput(data: ReferralData): void {
    const output = {
        timestamp: new Date().toISOString(),
        version: data.version,
        globalStats: data.globalStats,
        tiers: REFERRAL_TIERS.map(t => ({
            name: t.name,
            title: t.title,
            minReferrals: t.minReferrals,
            multiplier: t.multiplier,
            networkBonus: `${(t.networkBonus * 100).toFixed(1)}%`,
            level2Bonus: `${(t.level2Bonus * 100).toFixed(2)}%`,
            emoji: t.emoji,
        })),
        topReferrers: Object.values(data.referrerStats)
            .sort((a, b) => b.activeReferrals - a.activeReferrals)
            .slice(0, 20)
            .map(s => ({
                address: s.address,
                tier: s.tier.name,
                activeReferrals: s.activeReferrals,
                networkHoldings: s.networkHoldings,
                retentionRate: s.retentionRate,
                level2Referrals: s.level2Referrals,
            })),
    };

    console.log(JSON.stringify(output, null, 2));
}

/**
 * Display referrer details
 */
function showReferrerDetails(data: ReferralData, address: string): void {
    const stats = data.referrerStats[address];

    if (!stats) {
        console.log(`\n❌ No referral stats found for ${address}`);
        console.log('   This address has not referred anyone yet.');
        return;
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📋 REFERRER DETAILS: ${address.slice(0, 16)}...`);
    console.log('='.repeat(60));
    console.log(`${stats.tier.emoji} Tier: ${stats.tier.title}`);
    console.log(`📊 Multiplier: ${stats.tier.multiplier}x`);
    console.log(`👥 Total Referrals: ${stats.totalReferrals}`);
    console.log(`✅ Active Referrals: ${stats.activeReferrals}`);
    console.log(`📉 Retention Rate: ${stats.retentionRate.toFixed(1)}%`);
    console.log(`💰 Network Holdings: ${formatNumber(stats.networkHoldings)} $FED`);
    console.log(`🎁 Network Bonus Rate: ${(stats.tier.networkBonus * 100).toFixed(1)}%`);

    if (stats.level2Referrals > 0) {
        console.log(`\n🔗 Level 2 Network:`);
        console.log(`   L2 Referrals: ${stats.level2Referrals}`);
        console.log(`   L2 Holdings: ${formatNumber(stats.level2Holdings)} $FED`);
        console.log(`   L2 Bonus Rate: ${(stats.tier.level2Bonus * 100).toFixed(2)}%`);
    }

    console.log(`\n📅 Joined: ${stats.joinDate.split('T')[0]}`);
    console.log(`📅 Last Referral: ${stats.lastReferralDate.split('T')[0]}`);

    // List referrals
    const referrals = Object.values(data.relationships)
        .filter(r => r.referrer === address)
        .sort((a, b) => b.currentBalance - a.currentBalance);

    if (referrals.length > 0) {
        console.log('\n👥 Referrals:');
        referrals.forEach((r, i) => {
            const status = r.isActive ? '✅' : '❌';
            const balance = formatNumber(r.currentBalance);
            console.log(`   ${i + 1}. ${status} ${r.referee.slice(0, 12)}... - ${balance} $FED`);
        });
    }

    console.log('='.repeat(60));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatNumber(num: number): string {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
    return num.toFixed(2);
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
    const args = process.argv.slice(2);

    console.log('\n🏦 Fed Referral Bonus System');
    console.log('=' .repeat(40));

    // Load data
    const data = loadReferralData();

    // Parse arguments
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Usage: npx ts-node referral-bonus.ts [options]

Options:
  --leaderboard, -l      Show top referrers leaderboard
  --top N                Show top N referrers (default: 10)
  --address ADDR, -a     Show details for specific referrer
  --register REF,REFERRER  Register a new referral relationship
  --json                 Output data in JSON format
  --stats                Show global referral stats
  --help, -h             Show this help message

Examples:
  npx ts-node referral-bonus.ts --leaderboard
  npx ts-node referral-bonus.ts --address ABC123...
  npx ts-node referral-bonus.ts --register NewWallet,ReferrerWallet
  npx ts-node referral-bonus.ts --json
        `);
        return;
    }

    if (args.includes('--json')) {
        generateJsonOutput(data);
        return;
    }

    if (args.includes('--stats')) {
        console.log('\n📊 Global Referral Stats:');
        console.log(`   Total Referrals: ${data.globalStats.totalReferrals}`);
        console.log(`   Active Referrals: ${data.globalStats.activeReferrals}`);
        console.log(`   Top Referrer: ${data.globalStats.topReferrer.slice(0, 16) || 'None'}...`);
        console.log(`   Top Referrer Count: ${data.globalStats.topReferrerCount}`);
        console.log(`   Total Network Bonus Paid: $${data.globalStats.totalNetworkBonus.toFixed(2)}`);
        console.log(`   Last Updated: ${data.lastUpdated}`);
        return;
    }

    const registerIdx = args.indexOf('--register');
    if (registerIdx !== -1 && args[registerIdx + 1]) {
        const [referee, referrer] = args[registerIdx + 1].split(',');
        if (referee && referrer) {
            const success = registerReferral(data, referee, referrer, 0);
            if (success) {
                saveReferralData(data);
                console.log('✅ Referral registered and saved');
            }
        } else {
            console.error('❌ Invalid format. Use: --register referee,referrer');
        }
        return;
    }

    const addressIdx = args.findIndex(a => a === '--address' || a === '-a');
    if (addressIdx !== -1 && args[addressIdx + 1]) {
        showReferrerDetails(data, args[addressIdx + 1]);
        return;
    }

    // Default: show leaderboard
    const topIdx = args.indexOf('--top');
    const limit = topIdx !== -1 && args[topIdx + 1] ? parseInt(args[topIdx + 1]) : 10;

    generateLeaderboard(data, limit);

    // Show tier info
    console.log('\n📋 Referral Tier Structure:');
    console.log('-'.repeat(70));
    console.log(`${'Tier'.padEnd(18)} ${'Min Refs'.padEnd(10)} ${'Multiplier'.padEnd(12)} ${'L1 Bonus'.padEnd(10)} ${'L2 Bonus'}`);
    console.log('-'.repeat(70));

    for (const tier of REFERRAL_TIERS) {
        const tierName = `${tier.emoji} ${tier.title}`;
        const minRefs = tier.minReferrals.toString();
        const mult = `${tier.multiplier}x`;
        const l1Bonus = `${(tier.networkBonus * 100).toFixed(1)}%`;
        const l2Bonus = `${(tier.level2Bonus * 100).toFixed(2)}%`;

        console.log(`${tierName.padEnd(18)} ${minRefs.padEnd(10)} ${mult.padEnd(12)} ${l1Bonus.padEnd(10)} ${l2Bonus}`);
    }

    console.log('-'.repeat(70));
    console.log('\n💡 Tip: Use --help for more options');
}

// Export functions for use in distribute-tokens.ts
export {
    loadReferralData,
    saveReferralData,
    getReferralTier,
    registerReferral,
    updateReferralBalances,
    REFERRAL_TIERS,
    type ReferralData,
    type ReferralTier,
    type ReferrerStats,
};

// Run if called directly
main().catch(console.error);
