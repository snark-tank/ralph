/**
 * Milestone Tracker - Quantitative Easing (QE) Events
 *
 * Tracks major milestones for the $FED ecosystem and generates
 * celebration announcements when milestones are achieved.
 *
 * Milestones tracked:
 * - Total USD1 distributed
 * - Number of unique holders paid
 * - Number of distributions completed
 * - Daily volume thresholds
 *
 * Usage:
 *   npx ts-node milestone-tracker.ts [--json] [--check-only]
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DISTRIBUTION_HISTORY_FILE = path.join(__dirname, '..', 'src', 'token-distribution-history.json');
const MILESTONE_FILE = path.join(__dirname, 'milestones.json');
const MILESTONE_ANNOUNCEMENTS_DIR = path.join(__dirname, 'milestone-announcements');

// Milestone definitions
interface Milestone {
    id: string;
    name: string;
    description: string;
    type: 'distributed' | 'holders' | 'distributions' | 'daily_volume';
    threshold: number;
    qeEvent: string;           // e.g., "QE1", "QE2", etc.
    bonusMultiplier: number;   // Potential bonus for celebration
    celebrationEmoji: string;
    achieved: boolean;
    achievedAt?: string;
}

// Define all milestones
const MILESTONES: Milestone[] = [
    // Distribution amount milestones
    {
        id: 'dist_1k',
        name: 'First $1,000 Distributed',
        description: 'The money printer warmed up',
        type: 'distributed',
        threshold: 1000,
        qeEvent: 'QE0.5',
        bonusMultiplier: 1.0,
        celebrationEmoji: '🎉',
        achieved: false,
    },
    {
        id: 'dist_5k',
        name: '$5,000 Distributed',
        description: 'The Fed is operational',
        type: 'distributed',
        threshold: 5000,
        qeEvent: 'QE0.75',
        bonusMultiplier: 1.0,
        celebrationEmoji: '🎊',
        achieved: false,
    },
    {
        id: 'dist_10k',
        name: 'First $10,000 Distributed',
        description: 'QE1 - The first major stimulus package',
        type: 'distributed',
        threshold: 10000,
        qeEvent: 'QE1',
        bonusMultiplier: 1.5,
        celebrationEmoji: '🚀',
        achieved: false,
    },
    {
        id: 'dist_25k',
        name: '$25,000 Distributed',
        description: 'QE1.5 - Economic expansion continues',
        type: 'distributed',
        threshold: 25000,
        qeEvent: 'QE1.5',
        bonusMultiplier: 1.25,
        celebrationEmoji: '💰',
        achieved: false,
    },
    {
        id: 'dist_50k',
        name: '$50,000 Distributed',
        description: 'QE2 - Major liquidity injection',
        type: 'distributed',
        threshold: 50000,
        qeEvent: 'QE2',
        bonusMultiplier: 1.5,
        celebrationEmoji: '💎',
        achieved: false,
    },
    {
        id: 'dist_100k',
        name: '$100,000 Distributed',
        description: 'QE3 - Historic stimulus achieved',
        type: 'distributed',
        threshold: 100000,
        qeEvent: 'QE3',
        bonusMultiplier: 2.0,
        celebrationEmoji: '🏆',
        achieved: false,
    },
    {
        id: 'dist_250k',
        name: '$250,000 Distributed',
        description: 'QE4 - Quarter million milestone',
        type: 'distributed',
        threshold: 250000,
        qeEvent: 'QE4',
        bonusMultiplier: 2.0,
        celebrationEmoji: '👑',
        achieved: false,
    },
    {
        id: 'dist_500k',
        name: '$500,000 Distributed',
        description: 'QE5 - Half million in rewards',
        type: 'distributed',
        threshold: 500000,
        qeEvent: 'QE5',
        bonusMultiplier: 2.5,
        celebrationEmoji: '🌟',
        achieved: false,
    },
    {
        id: 'dist_1m',
        name: '$1,000,000 Distributed',
        description: 'QE Infinity - The million dollar printer',
        type: 'distributed',
        threshold: 1000000,
        qeEvent: 'QE∞',
        bonusMultiplier: 3.0,
        celebrationEmoji: '🎯',
        achieved: false,
    },

    // Holder count milestones
    {
        id: 'holders_100',
        name: '100 Holders Paid',
        description: 'First hundred citizens served',
        type: 'holders',
        threshold: 100,
        qeEvent: 'COMMUNITY1',
        bonusMultiplier: 1.0,
        celebrationEmoji: '👥',
        achieved: false,
    },
    {
        id: 'holders_250',
        name: '250 Holders Paid',
        description: 'Growing community',
        type: 'holders',
        threshold: 250,
        qeEvent: 'COMMUNITY2',
        bonusMultiplier: 1.1,
        celebrationEmoji: '🏘️',
        achieved: false,
    },
    {
        id: 'holders_500',
        name: '500 Holders Paid',
        description: 'Half a thousand strong',
        type: 'holders',
        threshold: 500,
        qeEvent: 'COMMUNITY3',
        bonusMultiplier: 1.25,
        celebrationEmoji: '🏙️',
        achieved: false,
    },
    {
        id: 'holders_1000',
        name: '1,000 Holders Paid',
        description: 'Major community milestone',
        type: 'holders',
        threshold: 1000,
        qeEvent: 'COMMUNITY4',
        bonusMultiplier: 1.5,
        celebrationEmoji: '🌆',
        achieved: false,
    },
    {
        id: 'holders_2500',
        name: '2,500 Holders Paid',
        description: 'Massive adoption',
        type: 'holders',
        threshold: 2500,
        qeEvent: 'COMMUNITY5',
        bonusMultiplier: 1.75,
        celebrationEmoji: '🌍',
        achieved: false,
    },
    {
        id: 'holders_5000',
        name: '5,000 Holders Paid',
        description: 'Global Fed community',
        type: 'holders',
        threshold: 5000,
        qeEvent: 'COMMUNITY6',
        bonusMultiplier: 2.0,
        celebrationEmoji: '🌐',
        achieved: false,
    },

    // Distribution count milestones
    {
        id: 'dists_50',
        name: '50 Distributions',
        description: 'Printer is humming',
        type: 'distributions',
        threshold: 50,
        qeEvent: 'OPS1',
        bonusMultiplier: 1.0,
        celebrationEmoji: '🖨️',
        achieved: false,
    },
    {
        id: 'dists_100',
        name: '100 Distributions',
        description: 'Centennial distributions',
        type: 'distributions',
        threshold: 100,
        qeEvent: 'OPS2',
        bonusMultiplier: 1.0,
        celebrationEmoji: '💯',
        achieved: false,
    },
    {
        id: 'dists_250',
        name: '250 Distributions',
        description: 'Printer never stops',
        type: 'distributions',
        threshold: 250,
        qeEvent: 'OPS3',
        bonusMultiplier: 1.1,
        celebrationEmoji: '⚡',
        achieved: false,
    },
    {
        id: 'dists_500',
        name: '500 Distributions',
        description: 'Half a thousand BRRRs',
        type: 'distributions',
        threshold: 500,
        qeEvent: 'OPS4',
        bonusMultiplier: 1.25,
        celebrationEmoji: '🔥',
        achieved: false,
    },
    {
        id: 'dists_1000',
        name: '1,000 Distributions',
        description: 'The thousand BRRR club',
        type: 'distributions',
        threshold: 1000,
        qeEvent: 'OPS5',
        bonusMultiplier: 1.5,
        celebrationEmoji: '🎯',
        achieved: false,
    },
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

interface MilestoneState {
    lastChecked: string;
    milestones: Record<string, { achieved: boolean; achievedAt?: string }>;
}

interface MilestoneAnnouncement {
    milestone: Milestone;
    timestamp: string;
    currentValue: number;
    announcement: string;
    twitterPost: string;
}

// Load distribution history
function loadDistributionHistory(): DistributionHistory {
    if (fs.existsSync(DISTRIBUTION_HISTORY_FILE)) {
        return JSON.parse(fs.readFileSync(DISTRIBUTION_HISTORY_FILE, 'utf-8'));
    }
    return {
        totalDistributed: 0,
        distributions: []
    };
}

// Load milestone state
function loadMilestoneState(): MilestoneState {
    if (fs.existsSync(MILESTONE_FILE)) {
        return JSON.parse(fs.readFileSync(MILESTONE_FILE, 'utf-8'));
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

// Get unique holders from history
function getUniqueHolders(history: DistributionHistory): number {
    // This is an approximation - in reality we'd track unique addresses
    // For now, use the max recipientCount from any distribution
    if (history.distributions.length === 0) return 0;
    return Math.max(...history.distributions.map(d => d.recipientCount));
}

// Get current stats
function getCurrentStats(history: DistributionHistory): {
    totalDistributed: number;
    uniqueHolders: number;
    distributionCount: number;
    daily24h: number;
} {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    let daily24h = 0;
    for (const dist of history.distributions) {
        const distTime = new Date(dist.timestamp).getTime();
        if (distTime >= oneDayAgo) {
            daily24h += dist.totalAmount;
        }
    }

    return {
        totalDistributed: history.totalDistributed,
        uniqueHolders: getUniqueHolders(history),
        distributionCount: history.distributions.length,
        daily24h
    };
}

// Check milestones and return newly achieved ones
function checkMilestones(
    stats: { totalDistributed: number; uniqueHolders: number; distributionCount: number; daily24h: number },
    state: MilestoneState
): MilestoneAnnouncement[] {
    const newlyAchieved: MilestoneAnnouncement[] = [];
    const now = new Date().toISOString();

    for (const milestone of MILESTONES) {
        // Skip if already achieved
        if (state.milestones[milestone.id]?.achieved) {
            continue;
        }

        // Get the current value for this milestone type
        let currentValue = 0;
        switch (milestone.type) {
            case 'distributed':
                currentValue = stats.totalDistributed;
                break;
            case 'holders':
                currentValue = stats.uniqueHolders;
                break;
            case 'distributions':
                currentValue = stats.distributionCount;
                break;
            case 'daily_volume':
                currentValue = stats.daily24h;
                break;
        }

        // Check if milestone is achieved
        if (currentValue >= milestone.threshold) {
            // Mark as achieved
            state.milestones[milestone.id] = {
                achieved: true,
                achievedAt: now
            };

            // Generate announcement
            const announcement = generateAnnouncement(milestone, currentValue);
            newlyAchieved.push(announcement);
        }
    }

    state.lastChecked = now;
    return newlyAchieved;
}

// Generate milestone announcement
function generateAnnouncement(milestone: Milestone, currentValue: number): MilestoneAnnouncement {
    const timestamp = new Date().toISOString();

    // Format the value based on type
    let formattedValue = '';
    switch (milestone.type) {
        case 'distributed':
        case 'daily_volume':
            formattedValue = `$${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            break;
        default:
            formattedValue = currentValue.toLocaleString();
    }

    // Full announcement
    const announcement = `
╔══════════════════════════════════════════════════════════════════╗
║              ${milestone.celebrationEmoji} MILESTONE ACHIEVED ${milestone.celebrationEmoji}                       ║
╚══════════════════════════════════════════════════════════════════╝

🏛️ THE FEDERAL RESERVE BOARD OF GOVERNORS
   announces the achievement of

                    ┌─────────────────────────────────┐
                    │     ${milestone.qeEvent.padStart(8).padEnd(16)}          │
                    │     ${milestone.name.padEnd(24)}  │
                    └─────────────────────────────────┘

📊 MILESTONE DETAILS
   ${milestone.description}

   Current Value: ${formattedValue}
   Threshold:     ${milestone.type === 'distributed' || milestone.type === 'daily_volume'
                    ? '$' + milestone.threshold.toLocaleString()
                    : milestone.threshold.toLocaleString()}

${milestone.bonusMultiplier > 1 ? `
🎁 CELEBRATION BONUS
   This milestone unlocks a ${milestone.bonusMultiplier}x distribution bonus!
   The next distribution will be enhanced to celebrate.
` : ''}
🖨️ The money printer goes BRRR! 💵

                                          - Ralph, Chairman of the Fed
                                            ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
`;

    // Twitter-ready post (280 chars)
    const twitterPost = `${milestone.celebrationEmoji} MILESTONE: ${milestone.qeEvent}

${milestone.name}!

${milestone.description}

Current: ${formattedValue}

The money printer goes BRRR! 🖨️💵

$FED #MoneyPrinter #DeFi`;

    return {
        milestone,
        timestamp,
        currentValue,
        announcement,
        twitterPost
    };
}

// Save announcement to file
function saveAnnouncement(announcement: MilestoneAnnouncement): void {
    if (!fs.existsSync(MILESTONE_ANNOUNCEMENTS_DIR)) {
        fs.mkdirSync(MILESTONE_ANNOUNCEMENTS_DIR, { recursive: true });
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${dateStr}-${announcement.milestone.id}`;

    // Save full announcement
    fs.writeFileSync(
        path.join(MILESTONE_ANNOUNCEMENTS_DIR, `${filename}.txt`),
        announcement.announcement
    );

    // Save JSON for API
    fs.writeFileSync(
        path.join(MILESTONE_ANNOUNCEMENTS_DIR, `${filename}.json`),
        JSON.stringify({
            ...announcement,
            milestone: {
                ...announcement.milestone,
                achieved: true,
                achievedAt: announcement.timestamp
            }
        }, null, 2)
    );

    console.log(`📄 Saved announcement to ${MILESTONE_ANNOUNCEMENTS_DIR}/${filename}.txt`);
}

// Get milestone status summary
function getMilestoneStatus(stats: ReturnType<typeof getCurrentStats>, state: MilestoneState): {
    achieved: Milestone[];
    upcoming: Milestone[];
    progress: Record<string, { current: number; threshold: number; percent: number }>;
} {
    const achieved: Milestone[] = [];
    const upcoming: Milestone[] = [];
    const progress: Record<string, { current: number; threshold: number; percent: number }> = {};

    for (const milestone of MILESTONES) {
        let currentValue = 0;
        switch (milestone.type) {
            case 'distributed':
                currentValue = stats.totalDistributed;
                break;
            case 'holders':
                currentValue = stats.uniqueHolders;
                break;
            case 'distributions':
                currentValue = stats.distributionCount;
                break;
            case 'daily_volume':
                currentValue = stats.daily24h;
                break;
        }

        const percent = Math.min(100, (currentValue / milestone.threshold) * 100);
        progress[milestone.id] = {
            current: currentValue,
            threshold: milestone.threshold,
            percent
        };

        if (state.milestones[milestone.id]?.achieved) {
            achieved.push({
                ...milestone,
                achieved: true,
                achievedAt: state.milestones[milestone.id].achievedAt
            });
        } else {
            upcoming.push(milestone);
        }
    }

    return { achieved, upcoming, progress };
}

// Format progress bar
function formatProgressBar(percent: number, width: number = 20): string {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent.toFixed(1)}%`;
}

// Main function
async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const jsonOutput = args.includes('--json');
    const checkOnly = args.includes('--check-only');
    const showHelp = args.includes('--help') || args.includes('-h');

    if (showHelp) {
        console.log(`
Milestone Tracker - Quantitative Easing (QE) Events

Usage: npx ts-node milestone-tracker.ts [options]

Options:
  --json        Output in JSON format
  --check-only  Check milestones without saving state
  --help, -h    Show this help message

Examples:
  npx ts-node milestone-tracker.ts              # Check and display milestones
  npx ts-node milestone-tracker.ts --json       # Output as JSON
  npx ts-node milestone-tracker.ts --check-only # Preview without saving
`);
        return;
    }

    // Load data
    const history = loadDistributionHistory();
    const state = loadMilestoneState();
    const stats = getCurrentStats(history);

    // Check for new milestones
    const newMilestones = checkMilestones(stats, state);

    // Save state if not check-only
    if (!checkOnly && newMilestones.length > 0) {
        saveMilestoneState(state);
        for (const announcement of newMilestones) {
            saveAnnouncement(announcement);
        }
    }

    // Get full status
    const status = getMilestoneStatus(stats, state);

    if (jsonOutput) {
        console.log(JSON.stringify({
            stats,
            newMilestones: newMilestones.map(a => ({
                id: a.milestone.id,
                name: a.milestone.name,
                qeEvent: a.milestone.qeEvent,
                currentValue: a.currentValue,
                timestamp: a.timestamp
            })),
            achieved: status.achieved.map(m => ({
                id: m.id,
                name: m.name,
                qeEvent: m.qeEvent,
                achievedAt: m.achievedAt
            })),
            upcoming: status.upcoming.slice(0, 5).map(m => ({
                id: m.id,
                name: m.name,
                qeEvent: m.qeEvent,
                threshold: m.threshold,
                type: m.type,
                progress: status.progress[m.id]
            })),
            lastChecked: state.lastChecked
        }, null, 2));
        return;
    }

    // Display header
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║           🏛️ $FED MILESTONE TRACKER - QE EVENTS 🏛️                ║
╚══════════════════════════════════════════════════════════════════╝
`);

    // Current stats
    console.log(`📊 CURRENT STATISTICS`);
    console.log(`   Total Distributed: $${stats.totalDistributed.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log(`   Unique Holders:    ${stats.uniqueHolders.toLocaleString()}`);
    console.log(`   Distributions:     ${stats.distributionCount.toLocaleString()}`);
    console.log(`   24h Volume:        $${stats.daily24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log('');

    // New milestones achieved
    if (newMilestones.length > 0) {
        console.log(`🎉 NEW MILESTONES ACHIEVED!`);
        console.log(`${'─'.repeat(50)}`);
        for (const announcement of newMilestones) {
            console.log(announcement.announcement);
            console.log(`\n📱 Twitter-ready post:\n${announcement.twitterPost}\n`);
        }
    }

    // Achieved milestones
    console.log(`\n✅ ACHIEVED MILESTONES (${status.achieved.length})`);
    console.log(`${'─'.repeat(50)}`);
    if (status.achieved.length === 0) {
        console.log('   No milestones achieved yet. Keep printing!');
    } else {
        for (const m of status.achieved) {
            const date = m.achievedAt ? new Date(m.achievedAt).toLocaleDateString() : 'Unknown';
            console.log(`   ${m.celebrationEmoji} ${m.qeEvent.padEnd(12)} ${m.name.padEnd(30)} (${date})`);
        }
    }

    // Upcoming milestones
    console.log(`\n🎯 UPCOMING MILESTONES`);
    console.log(`${'─'.repeat(50)}`);

    // Group by type
    const upcomingByType: Record<string, Milestone[]> = {};
    for (const m of status.upcoming) {
        if (!upcomingByType[m.type]) {
            upcomingByType[m.type] = [];
        }
        upcomingByType[m.type].push(m);
    }

    const typeLabels: Record<string, string> = {
        'distributed': '💵 Distribution Milestones',
        'holders': '👥 Holder Milestones',
        'distributions': '🖨️ Operations Milestones',
        'daily_volume': '📈 Volume Milestones'
    };

    for (const [type, milestones] of Object.entries(upcomingByType)) {
        console.log(`\n   ${typeLabels[type] || type}`);
        // Show next 2 milestones per type
        for (const m of milestones.slice(0, 2)) {
            const prog = status.progress[m.id];
            const bar = formatProgressBar(prog.percent);
            const thresholdStr = type === 'distributed' || type === 'daily_volume'
                ? `$${m.threshold.toLocaleString()}`
                : m.threshold.toLocaleString();
            console.log(`   ${m.celebrationEmoji} ${m.qeEvent.padEnd(10)} ${m.name.padEnd(28)}`);
            console.log(`      ${bar} (${thresholdStr})`);
        }
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`Last checked: ${new Date(state.lastChecked).toLocaleString()}`);
    if (checkOnly) {
        console.log(`⚠️  Check-only mode: State not saved`);
    }
}

main().catch(console.error);
