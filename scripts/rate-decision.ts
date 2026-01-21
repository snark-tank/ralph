/**
 * Fed Rate Decision Generator
 *
 * Generates official Federal Reserve-style announcements summarizing
 * $FED protocol activity, distributions, and current "monetary policy" stance.
 *
 * Inspired by actual FOMC meeting announcements, adapted for the meme.
 *
 * Usage:
 *   npx ts-node rate-decision.ts [--period weekly|daily|monthly] [--json] [--save]
 *
 * Output:
 *   - Console display of rate decision announcement
 *   - Optionally saves to rate-decisions/ folder
 *   - JSON output for API/website integration
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
const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6';
const DISTRIBUTION_HISTORY_FILE = path.join(__dirname, '..', 'src', 'token-distribution-history.json');
const RATE_DECISIONS_DIR = path.join(__dirname, 'rate-decisions');

// Holder tier definitions
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

interface DistributionHistory {
    totalDistributed: number;
    distributions: Array<{
        timestamp: string;
        totalAmount: number;
        recipientCount: number;
        txSignatures: string[];
    }>;
}

type Period = 'daily' | 'weekly' | 'monthly';

interface PeriodStats {
    period: Period;
    startDate: Date;
    endDate: Date;
    totalDistributed: number;
    distributionCount: number;
    avgDistributionSize: number;
    avgRecipientsPerDistribution: number;
    uniqueRecipients: number;
    largestDistribution: number;
    smallestDistribution: number;
}

interface RateDecision {
    // Metadata
    decisionId: string;
    generatedAt: string;
    period: Period;
    periodStart: string;
    periodEnd: string;

    // Rate Info
    currentRate: number;
    previousRate: number;
    rateChange: number;
    rateChangeDirection: 'increased' | 'decreased' | 'unchanged';

    // Distribution Stats
    totalDistributed: number;
    distributionCount: number;
    avgDistributionSize: number;
    avgRecipientsPerDistribution: number;

    // Holder Stats
    totalHolders: number;
    holderChange: number;
    totalSupplyHeld: number;

    // Tier Distribution
    tierBreakdown: {
        tier: string;
        count: number;
        percentage: number;
    }[];

    // Cumulative Stats
    allTimeDistributed: number;
    allTimeDistributionCount: number;

    // Policy Stance
    policyStance: 'accommodative' | 'neutral' | 'tightening';
    printerStatus: 'BRRR' | 'brrr' | 'brr' | 'idle';

    // Generated Announcement
    announcement: string;
    shortSummary: string;
    twitterPost: string;
}

interface RunOptions {
    period: Period;
    json: boolean;
    save: boolean;
}

// Parse command line arguments
function parseArgs(): RunOptions {
    const args = process.argv.slice(2);

    let period: Period = 'weekly';
    const periodIdx = args.indexOf('--period');
    if (periodIdx !== -1 && args[periodIdx + 1]) {
        const p = args[periodIdx + 1].toLowerCase();
        if (p === 'daily' || p === 'weekly' || p === 'monthly') {
            period = p;
        }
    }

    return {
        period,
        json: args.includes('--json'),
        save: args.includes('--save'),
    };
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

// Get period boundaries
function getPeriodBoundaries(period: Period): { start: Date; end: Date; previousStart: Date } {
    const now = new Date();
    const end = new Date(now);
    let start: Date;
    let previousStart: Date;

    switch (period) {
        case 'daily':
            start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            previousStart = new Date(start.getTime() - 24 * 60 * 60 * 1000);
            break;
        case 'weekly':
            start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            previousStart = new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'monthly':
            start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            previousStart = new Date(start.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
    }

    return { start, end, previousStart };
}

// Calculate stats for a period
function calculatePeriodStats(
    history: DistributionHistory,
    start: Date,
    end: Date,
    period: Period
): PeriodStats {
    const startTime = start.getTime();
    const endTime = end.getTime();

    const periodDistributions = history.distributions.filter(d => {
        const time = new Date(d.timestamp).getTime();
        return time >= startTime && time <= endTime;
    });

    const totalDistributed = periodDistributions.reduce((sum, d) => sum + d.totalAmount, 0);
    const distributionCount = periodDistributions.length;
    const avgDistributionSize = distributionCount > 0 ? totalDistributed / distributionCount : 0;

    const totalRecipients = periodDistributions.reduce((sum, d) => sum + d.recipientCount, 0);
    const avgRecipientsPerDistribution = distributionCount > 0 ? totalRecipients / distributionCount : 0;

    // Estimate unique recipients (use max from any single distribution as approximation)
    const uniqueRecipients = periodDistributions.length > 0
        ? Math.max(...periodDistributions.map(d => d.recipientCount))
        : 0;

    const amounts = periodDistributions.map(d => d.totalAmount);
    const largestDistribution = amounts.length > 0 ? Math.max(...amounts) : 0;
    const smallestDistribution = amounts.length > 0 ? Math.min(...amounts) : 0;

    return {
        period,
        startDate: start,
        endDate: end,
        totalDistributed,
        distributionCount,
        avgDistributionSize,
        avgRecipientsPerDistribution,
        uniqueRecipients,
        largestDistribution,
        smallestDistribution,
    };
}

// Calculate APY for a period
function calculateAPY(totalDistributed: number, totalSupply: number, days: number): number {
    if (totalSupply === 0 || days === 0) return 0;
    return (totalDistributed / totalSupply) * (365 / days) * 100;
}

// Get total $FED supply held by eligible holders
async function getHolderStats(connection: Connection): Promise<{
    totalSupply: number;
    holderCount: number;
    tierBreakdown: { tier: string; count: number; percentage: number }[];
}> {
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

        let totalSupply = 0;
        let holderCount = 0;
        const tierCounts: Record<string, number> = {};

        for (const tier of HOLDER_TIERS) {
            tierCounts[tier.name] = 0;
        }

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

                // Assign to tier
                for (const tier of HOLDER_TIERS) {
                    if (tokenAmount.uiAmount >= tier.minHolding) {
                        tierCounts[tier.name]++;
                        break;
                    }
                }
            }
        }

        const tierBreakdown = HOLDER_TIERS.map(tier => ({
            tier: tier.name,
            count: tierCounts[tier.name],
            percentage: holderCount > 0 ? (tierCounts[tier.name] / holderCount) * 100 : 0,
        }));

        return { totalSupply, holderCount, tierBreakdown };
    } catch (error) {
        console.error('Error fetching holder stats:', error);
        return {
            totalSupply: 0,
            holderCount: 0,
            tierBreakdown: HOLDER_TIERS.map(tier => ({
                tier: tier.name,
                count: 0,
                percentage: 0,
            })),
        };
    }
}

// Determine policy stance based on rate change
function determinePolicyStance(
    rateChange: number,
    currentRate: number
): { stance: 'accommodative' | 'neutral' | 'tightening'; printerStatus: 'BRRR' | 'brrr' | 'brr' | 'idle' } {
    if (currentRate < 5) {
        return { stance: 'tightening', printerStatus: 'idle' };
    } else if (currentRate < 15) {
        return { stance: 'neutral', printerStatus: 'brr' };
    } else if (currentRate < 30) {
        return { stance: 'accommodative', printerStatus: 'brrr' };
    } else {
        return { stance: 'accommodative', printerStatus: 'BRRR' };
    }
}

// Generate the official announcement text
function generateAnnouncement(decision: Omit<RateDecision, 'announcement' | 'shortSummary' | 'twitterPost'>): {
    announcement: string;
    shortSummary: string;
    twitterPost: string;
} {
    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formatCurrency = (n: number) => `$${n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

    const formatRate = (n: number) => `${n.toFixed(2)}%`;

    const periodLabel = decision.period === 'daily' ? 'Daily' :
                        decision.period === 'weekly' ? 'Weekly' : 'Monthly';

    const rateChangeText = decision.rateChangeDirection === 'unchanged'
        ? 'maintained'
        : decision.rateChangeDirection === 'increased'
        ? `raised by ${formatRate(Math.abs(decision.rateChange))}`
        : `lowered by ${formatRate(Math.abs(decision.rateChange))}`;

    const stanceText = decision.policyStance === 'accommodative'
        ? 'The Committee maintains an accommodative monetary stance to support continued BRRR operations.'
        : decision.policyStance === 'neutral'
        ? 'The Committee maintains a neutral stance, monitoring economic indicators closely.'
        : 'The Committee notes reduced printing activity and will continue to assess conditions.';

    const printerLine = decision.printerStatus === 'BRRR'
        ? '🖨️ PRINTER STATUS: BRRR BRRR BRRR 💵💵💵'
        : decision.printerStatus === 'brrr'
        ? '🖨️ PRINTER STATUS: brrr brrr 💵💵'
        : decision.printerStatus === 'brr'
        ? '🖨️ PRINTER STATUS: brr... 💵'
        : '🖨️ PRINTER STATUS: Warming up...';

    // Full official announcement
    const announcement = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                   🏛️ FEDERAL RESERVE BOARD 🏛️                    ║
║                                                                  ║
║                      RATE DECISION STATEMENT                     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

FOR IMMEDIATE RELEASE
${formatDate(decision.generatedAt)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Federal Reserve Board of Governors, in its ${periodLabel.toLowerCase()} assessment
of monetary conditions, has ${rateChangeText} the Fed Funds Rate.

                    ┌─────────────────────────────┐
                    │  CURRENT FED FUNDS RATE     │
                    │                             │
                    │       ${formatRate(decision.currentRate).padStart(8)}  APY        │
                    │                             │
                    └─────────────────────────────┘

${stanceText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ${periodLabel.toUpperCase()} DISTRIBUTION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Period: ${formatDate(decision.periodStart)} - ${formatDate(decision.periodEnd)}

  💵 Total Distributed:     ${formatCurrency(decision.totalDistributed)} USD1
  📦 Distribution Events:   ${decision.distributionCount}
  📈 Avg Distribution:      ${formatCurrency(decision.avgDistributionSize)} USD1
  👥 Avg Recipients/Dist:   ${Math.round(decision.avgRecipientsPerDistribution)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 HOLDER STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total Holders:      ${decision.totalHolders.toLocaleString()}
  Holder Change:      ${decision.holderChange >= 0 ? '+' : ''}${decision.holderChange}
  Supply Held:        ${decision.totalSupplyHeld.toLocaleString()} $FED

  TIER DISTRIBUTION:
${decision.tierBreakdown.map(t => `    ${HOLDER_TIERS.find(h => h.name === t.tier)?.emoji || '•'} ${t.tier.padEnd(12)} ${t.count.toString().padStart(4)} holders (${t.percentage.toFixed(1)}%)`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 CUMULATIVE STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  All-Time Distributed:     ${formatCurrency(decision.allTimeDistributed)} USD1
  All-Time Distributions:   ${decision.allTimeDistributionCount}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${printerLine}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The next rate decision will be published in accordance with the
regular ${periodLabel.toLowerCase()} schedule. The Committee will continue to monitor
trading activity and adjust policy as needed to maximize BRRR.

                            - Ralph, Chairman of the Fed

╔══════════════════════════════════════════════════════════════════╗
║                    $FED: The Money Printer Token                 ║
║                        https://fed.markets                       ║
╚══════════════════════════════════════════════════════════════════╝
`.trim();

    // Short summary for quick display
    const shortSummary = `🏛️ FED RATE DECISION: ${formatRate(decision.currentRate)} APY (${rateChangeText}). ${formatCurrency(decision.totalDistributed)} distributed to ${decision.totalHolders} holders this ${decision.period}. ${printerLine.replace('🖨️ PRINTER STATUS: ', '')}`;

    // Twitter-friendly post (280 chars)
    const twitterPost = `🏛️ FED RATE DECISION

Current Rate: ${formatRate(decision.currentRate)} APY
${periodLabel} Distribution: ${formatCurrency(decision.totalDistributed)} USD1
Active Holders: ${decision.totalHolders}

${decision.printerStatus === 'BRRR' ? '🖨️ PRINTER STATUS: BRRR BRRR BRRR' : decision.printerStatus === 'brrr' ? '🖨️ brrr brrr...' : '🖨️ brr...'}

$FED | fed.markets`;

    return { announcement, shortSummary, twitterPost };
}

// Generate the full rate decision
async function generateRateDecision(period: Period): Promise<RateDecision | null> {
    const history = loadDistributionHistory();
    if (!history || history.distributions.length === 0) {
        console.error('No distribution history found');
        return null;
    }

    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const { start, end, previousStart } = getPeriodBoundaries(period);

    // Calculate current and previous period stats
    const currentStats = calculatePeriodStats(history, start, end, period);
    const previousStats = calculatePeriodStats(history, previousStart, start, period);

    // Get holder stats
    const { totalSupply, holderCount, tierBreakdown } = await getHolderStats(connection);

    // Calculate APY
    const periodDays = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
    const currentRate = calculateAPY(currentStats.totalDistributed, totalSupply, periodDays);
    const previousRate = calculateAPY(previousStats.totalDistributed, totalSupply, periodDays);
    const rateChange = currentRate - previousRate;

    // Determine rate change direction
    let rateChangeDirection: 'increased' | 'decreased' | 'unchanged';
    if (Math.abs(rateChange) < 0.5) {
        rateChangeDirection = 'unchanged';
    } else if (rateChange > 0) {
        rateChangeDirection = 'increased';
    } else {
        rateChangeDirection = 'decreased';
    }

    // Determine policy stance
    const { stance, printerStatus } = determinePolicyStance(rateChange, currentRate);

    // Estimate holder change (rough estimate based on distribution recipient counts)
    const currentAvgRecipients = currentStats.avgRecipientsPerDistribution;
    const previousAvgRecipients = previousStats.avgRecipientsPerDistribution;
    const holderChange = Math.round(currentAvgRecipients - previousAvgRecipients);

    // Generate decision ID
    const decisionId = `${period.toUpperCase()}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;

    const baseDecision = {
        decisionId,
        generatedAt: new Date().toISOString(),
        period,
        periodStart: start.toISOString(),
        periodEnd: end.toISOString(),
        currentRate,
        previousRate,
        rateChange,
        rateChangeDirection,
        totalDistributed: currentStats.totalDistributed,
        distributionCount: currentStats.distributionCount,
        avgDistributionSize: currentStats.avgDistributionSize,
        avgRecipientsPerDistribution: currentStats.avgRecipientsPerDistribution,
        totalHolders: holderCount,
        holderChange,
        totalSupplyHeld: totalSupply,
        tierBreakdown,
        allTimeDistributed: history.totalDistributed,
        allTimeDistributionCount: history.distributions.length,
        policyStance: stance,
        printerStatus,
    };

    const { announcement, shortSummary, twitterPost } = generateAnnouncement(baseDecision);

    return {
        ...baseDecision,
        announcement,
        shortSummary,
        twitterPost,
    };
}

// Save rate decision to file
function saveRateDecision(decision: RateDecision): string {
    if (!fs.existsSync(RATE_DECISIONS_DIR)) {
        fs.mkdirSync(RATE_DECISIONS_DIR, { recursive: true });
    }

    const filename = `${decision.decisionId}.json`;
    const filepath = path.join(RATE_DECISIONS_DIR, filename);

    fs.writeFileSync(filepath, JSON.stringify(decision, null, 2));

    // Also save the announcement as a text file
    const txtFilename = `${decision.decisionId}.txt`;
    const txtFilepath = path.join(RATE_DECISIONS_DIR, txtFilename);
    fs.writeFileSync(txtFilepath, decision.announcement);

    return filepath;
}

// Main entry point
async function main() {
    const options = parseArgs();

    console.log(`\n🏛️ Generating ${options.period} Fed Rate Decision...\n`);

    try {
        const decision = await generateRateDecision(options.period);

        if (!decision) {
            console.error('Failed to generate rate decision');
            process.exit(1);
        }

        if (options.json) {
            console.log(JSON.stringify(decision, null, 2));
        } else {
            console.log(decision.announcement);
            console.log('\n' + '─'.repeat(70));
            console.log('📱 TWITTER POST:');
            console.log('─'.repeat(70));
            console.log(decision.twitterPost);
            console.log('─'.repeat(70) + '\n');
        }

        if (options.save) {
            const filepath = saveRateDecision(decision);
            console.log(`\n💾 Saved to: ${filepath}`);
        }

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Export for use by other modules
export { generateRateDecision };
export type { RateDecision };

// Run if called directly
main().catch(console.error);
