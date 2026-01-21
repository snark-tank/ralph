/**
 * Fed Quests - Gamified Onboarding & Engagement System
 *
 * Inspired by: Zealy, TaskOn, RadQuest, BitDegree Web3 quests
 *
 * A quest system that rewards holders for completing various tasks:
 * - Onboarding quests (first-time actions)
 * - Daily quests (repeatable engagement)
 * - Achievement quests (milestones)
 * - Challenge quests (time-limited events)
 *
 * Rewards are XP that integrate with the engagement score system,
 * plus special badges that provide additional multipliers.
 */

import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES AND INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

interface Quest {
    id: string;
    name: string;
    description: string;
    category: 'onboarding' | 'daily' | 'achievement' | 'challenge' | 'social';
    xpReward: number;
    badgeReward?: string;
    multiplierBonus?: number;
    requirements: QuestRequirement[];
    repeatable: boolean;
    cooldownHours?: number;  // For daily quests
    expiresAt?: string;      // For challenge quests (ISO date)
    prerequisiteQuestIds?: string[];
}

interface QuestRequirement {
    type: 'hold_amount' | 'hold_duration' | 'receive_distributions' | 'checkin_streak' |
          'engagement_tier' | 'holder_tier' | 'refer_users' | 'complete_quest' |
          'season_participation' | 'credit_score' | 'auto_compound' | 'visit_dashboard';
    value: number | string;
    description: string;
}

interface QuestProgress {
    questId: string;
    status: 'locked' | 'available' | 'in_progress' | 'completed' | 'claimed';
    completedAt?: string;
    claimedAt?: string;
    lastCompletedAt?: string;  // For repeatable quests
    completionCount: number;
    progress: { [requirementIndex: number]: number };
}

interface HolderQuestData {
    address: string;
    totalXpEarned: number;
    questsCompleted: number;
    badges: string[];
    questProgress: { [questId: string]: QuestProgress };
    lastUpdated: string;
    createdAt: string;
}

interface QuestDataStore {
    holders: { [address: string]: HolderQuestData };
    globalStats: {
        totalQuestsCompleted: number;
        totalXpAwarded: number;
        totalBadgesEarned: number;
        questCompletionCounts: { [questId: string]: number };
    };
    lastUpdated: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUEST DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

const QUESTS: Quest[] = [
    // ═══════════════════════════════════════════════════════════════════════
    // ONBOARDING QUESTS (First-time actions - builds the foundation)
    // ═══════════════════════════════════════════════════════════════════════
    {
        id: 'welcome_to_fed',
        name: 'Welcome to the Fed',
        description: 'Hold any amount of $FED tokens to join the Federal Reserve.',
        category: 'onboarding',
        xpReward: 50,
        badgeReward: 'Fed Citizen',
        requirements: [
            { type: 'hold_amount', value: 1, description: 'Hold at least 1 $FED' }
        ],
        repeatable: false
    },
    {
        id: 'first_distribution',
        name: 'First Paycheck',
        description: 'Receive your first USD1 distribution from the money printer.',
        category: 'onboarding',
        xpReward: 75,
        badgeReward: 'Fed Employee',
        requirements: [
            { type: 'receive_distributions', value: 1, description: 'Receive 1 distribution' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['welcome_to_fed']
    },
    {
        id: 'first_checkin',
        name: 'Clocking In',
        description: 'Complete your first daily check-in on the Fed dashboard.',
        category: 'onboarding',
        xpReward: 25,
        requirements: [
            { type: 'checkin_streak', value: 1, description: 'Complete 1 daily check-in' }
        ],
        repeatable: false
    },
    {
        id: 'board_member',
        name: 'Board Member',
        description: 'Accumulate enough $FED to become a Board Member (100K+).',
        category: 'onboarding',
        xpReward: 150,
        badgeReward: 'Board Member',
        requirements: [
            { type: 'hold_amount', value: 100000, description: 'Hold 100,000+ $FED' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['welcome_to_fed']
    },
    {
        id: 'regional_director',
        name: 'Regional Director',
        description: 'Accumulate 1M+ $FED to become a Regional Director.',
        category: 'onboarding',
        xpReward: 300,
        badgeReward: 'Regional Director',
        requirements: [
            { type: 'hold_amount', value: 1000000, description: 'Hold 1,000,000+ $FED' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['board_member']
    },
    {
        id: 'fed_governor',
        name: 'Fed Governor',
        description: 'Accumulate 10M+ $FED to become a Fed Governor.',
        category: 'onboarding',
        xpReward: 500,
        badgeReward: 'Fed Governor',
        multiplierBonus: 0.05,
        requirements: [
            { type: 'hold_amount', value: 10000000, description: 'Hold 10,000,000+ $FED' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['regional_director']
    },
    {
        id: 'fed_chairman',
        name: 'Fed Chairman',
        description: 'Accumulate 50M+ $FED to become the Fed Chairman!',
        category: 'onboarding',
        xpReward: 1000,
        badgeReward: 'Fed Chairman',
        multiplierBonus: 0.1,
        requirements: [
            { type: 'hold_amount', value: 50000000, description: 'Hold 50,000,000+ $FED' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['fed_governor']
    },
    {
        id: 'auto_brrr_enabled',
        name: 'Auto-BRRR Activated',
        description: 'Enable auto-compound to automatically reinvest your USD1 into $FED.',
        category: 'onboarding',
        xpReward: 100,
        badgeReward: 'Auto-BRRR',
        requirements: [
            { type: 'auto_compound', value: 1, description: 'Enable auto-compound' }
        ],
        repeatable: false
    },

    // ═══════════════════════════════════════════════════════════════════════
    // DAILY QUESTS (Repeatable engagement - keeps users coming back)
    // ═══════════════════════════════════════════════════════════════════════
    {
        id: 'daily_checkin',
        name: 'Daily Roll Call',
        description: 'Check in daily to show your commitment to the Fed.',
        category: 'daily',
        xpReward: 10,
        requirements: [
            { type: 'visit_dashboard', value: 1, description: 'Visit the dashboard' }
        ],
        repeatable: true,
        cooldownHours: 24
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ACHIEVEMENT QUESTS (Milestones - recognize long-term commitment)
    // ═══════════════════════════════════════════════════════════════════════
    {
        id: 'week_streak',
        name: 'Federal Workweek',
        description: 'Maintain a 7-day check-in streak.',
        category: 'achievement',
        xpReward: 50,
        badgeReward: 'Dedicated',
        requirements: [
            { type: 'checkin_streak', value: 7, description: 'Maintain 7-day streak' }
        ],
        repeatable: false
    },
    {
        id: 'month_streak',
        name: 'Employee of the Month',
        description: 'Maintain a 30-day check-in streak.',
        category: 'achievement',
        xpReward: 200,
        badgeReward: 'Employee of the Month',
        multiplierBonus: 0.02,
        requirements: [
            { type: 'checkin_streak', value: 30, description: 'Maintain 30-day streak' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['week_streak']
    },
    {
        id: 'quarter_streak',
        name: 'Quarterly Review',
        description: 'Maintain a 90-day check-in streak.',
        category: 'achievement',
        xpReward: 500,
        badgeReward: 'Fed Veteran',
        multiplierBonus: 0.05,
        requirements: [
            { type: 'checkin_streak', value: 90, description: 'Maintain 90-day streak' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['month_streak']
    },
    {
        id: 'year_streak',
        name: 'Founding Father',
        description: 'Maintain a 365-day check-in streak. True diamond hands.',
        category: 'achievement',
        xpReward: 2000,
        badgeReward: 'Founding Father',
        multiplierBonus: 0.15,
        requirements: [
            { type: 'checkin_streak', value: 365, description: 'Maintain 365-day streak' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['quarter_streak']
    },
    {
        id: 'ten_distributions',
        name: 'Steady Income',
        description: 'Receive 10 USD1 distributions.',
        category: 'achievement',
        xpReward: 75,
        requirements: [
            { type: 'receive_distributions', value: 10, description: 'Receive 10 distributions' }
        ],
        repeatable: false
    },
    {
        id: 'fifty_distributions',
        name: 'Consistent Returns',
        description: 'Receive 50 USD1 distributions.',
        category: 'achievement',
        xpReward: 200,
        badgeReward: 'Consistent',
        requirements: [
            { type: 'receive_distributions', value: 50, description: 'Receive 50 distributions' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['ten_distributions']
    },
    {
        id: 'hundred_distributions',
        name: 'Reliable Revenue',
        description: 'Receive 100 USD1 distributions.',
        category: 'achievement',
        xpReward: 500,
        badgeReward: 'Fed Reliable',
        multiplierBonus: 0.03,
        requirements: [
            { type: 'receive_distributions', value: 100, description: 'Receive 100 distributions' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['fifty_distributions']
    },
    {
        id: 'engagement_active',
        name: 'Active Participant',
        description: 'Reach the Fed Active engagement tier (100+ XP).',
        category: 'achievement',
        xpReward: 50,
        requirements: [
            { type: 'engagement_tier', value: 'active', description: 'Reach Fed Active tier' }
        ],
        repeatable: false
    },
    {
        id: 'engagement_elite',
        name: 'Fed Elite Status',
        description: 'Reach the Fed Elite engagement tier (500+ XP).',
        category: 'achievement',
        xpReward: 200,
        badgeReward: 'Fed Elite',
        multiplierBonus: 0.05,
        requirements: [
            { type: 'engagement_tier', value: 'elite', description: 'Reach Fed Elite tier' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['engagement_active']
    },
    {
        id: 'credit_good',
        name: 'Good Standing',
        description: 'Achieve a Fed Credit Score of 670+ (Good).',
        category: 'achievement',
        xpReward: 150,
        requirements: [
            { type: 'credit_score', value: 670, description: 'Credit score 670+' }
        ],
        repeatable: false
    },
    {
        id: 'credit_excellent',
        name: 'Excellent Credit',
        description: 'Achieve a Fed Credit Score of 740+ (Excellent).',
        category: 'achievement',
        xpReward: 400,
        badgeReward: 'Excellent Credit',
        multiplierBonus: 0.05,
        requirements: [
            { type: 'credit_score', value: 740, description: 'Credit score 740+' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['credit_good']
    },
    {
        id: 'credit_exceptional',
        name: 'Exceptional Credit',
        description: 'Achieve a Fed Credit Score of 800+ (Exceptional).',
        category: 'achievement',
        xpReward: 1000,
        badgeReward: 'Fed Prime',
        multiplierBonus: 0.1,
        requirements: [
            { type: 'credit_score', value: 800, description: 'Credit score 800+' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['credit_excellent']
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SOCIAL QUESTS (Community building - viral growth)
    // ═══════════════════════════════════════════════════════════════════════
    {
        id: 'first_referral',
        name: 'Fed Recruiter',
        description: 'Refer your first new holder to $FED.',
        category: 'social',
        xpReward: 100,
        badgeReward: 'Recruiter',
        requirements: [
            { type: 'refer_users', value: 1, description: 'Refer 1 new holder' }
        ],
        repeatable: false
    },
    {
        id: 'five_referrals',
        name: 'Fed Advocate',
        description: 'Refer 5 new holders to $FED.',
        category: 'social',
        xpReward: 300,
        badgeReward: 'Fed Advocate',
        requirements: [
            { type: 'refer_users', value: 5, description: 'Refer 5 new holders' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['first_referral']
    },
    {
        id: 'twenty_referrals',
        name: 'Fed Ambassador',
        description: 'Refer 20 new holders to $FED.',
        category: 'social',
        xpReward: 750,
        badgeReward: 'Fed Ambassador',
        multiplierBonus: 0.08,
        requirements: [
            { type: 'refer_users', value: 20, description: 'Refer 20 new holders' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['five_referrals']
    },
    {
        id: 'fifty_referrals',
        name: 'Fed Legend',
        description: 'Refer 50 new holders to $FED. Legendary status.',
        category: 'social',
        xpReward: 2000,
        badgeReward: 'Fed Legend',
        multiplierBonus: 0.15,
        requirements: [
            { type: 'refer_users', value: 50, description: 'Refer 50 new holders' }
        ],
        repeatable: false,
        prerequisiteQuestIds: ['twenty_referrals']
    },
    {
        id: 'season_participant',
        name: 'Season Player',
        description: 'Participate in at least 50% of distributions during a season.',
        category: 'social',
        xpReward: 200,
        requirements: [
            { type: 'season_participation', value: 50, description: '50%+ season participation' }
        ],
        repeatable: true,
        cooldownHours: 2160  // ~90 days (quarterly)
    },
    {
        id: 'season_champion',
        name: 'Season Champion',
        description: 'Achieve 100% distribution participation in a season.',
        category: 'social',
        xpReward: 1000,
        badgeReward: 'Season Champion',
        multiplierBonus: 0.1,
        requirements: [
            { type: 'season_participation', value: 100, description: '100% season participation' }
        ],
        repeatable: true,
        cooldownHours: 2160
    }
];

// Badge multiplier bonuses (earned from quest completion)
const BADGE_MULTIPLIERS: { [badge: string]: number } = {
    'Fed Citizen': 0,
    'Fed Employee': 0,
    'Board Member': 0,
    'Regional Director': 0,
    'Fed Governor': 0.05,
    'Fed Chairman': 0.1,
    'Auto-BRRR': 0.02,
    'Dedicated': 0,
    'Employee of the Month': 0.02,
    'Fed Veteran': 0.05,
    'Founding Father': 0.15,
    'Consistent': 0,
    'Fed Reliable': 0.03,
    'Fed Elite': 0.05,
    'Excellent Credit': 0.05,
    'Fed Prime': 0.1,
    'Recruiter': 0,
    'Fed Advocate': 0,
    'Fed Ambassador': 0.08,
    'Fed Legend': 0.15,
    'Season Champion': 0.1
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

const QUEST_DATA_FILE = path.join(__dirname, 'quest-data.json');

function loadQuestData(): QuestDataStore {
    try {
        if (fs.existsSync(QUEST_DATA_FILE)) {
            const data = fs.readFileSync(QUEST_DATA_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading quest data:', error);
    }
    return {
        holders: {},
        globalStats: {
            totalQuestsCompleted: 0,
            totalXpAwarded: 0,
            totalBadgesEarned: 0,
            questCompletionCounts: {}
        },
        lastUpdated: new Date().toISOString()
    };
}

function saveQuestData(data: QuestDataStore): void {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(QUEST_DATA_FILE, JSON.stringify(data, null, 2));
}

function getHolderQuestData(data: QuestDataStore, address: string): HolderQuestData {
    if (!data.holders[address]) {
        data.holders[address] = {
            address,
            totalXpEarned: 0,
            questsCompleted: 0,
            badges: [],
            questProgress: {},
            lastUpdated: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
    }
    return data.holders[address];
}

// ═══════════════════════════════════════════════════════════════════════════
// QUEST LOGIC
// ═══════════════════════════════════════════════════════════════════════════

interface HolderContext {
    address: string;
    fedBalance: number;
    holdDays: number;
    distributionsReceived: number;
    checkinStreak: number;
    engagementXp: number;
    creditScore: number;
    referralCount: number;
    seasonParticipation: number;
    autoCompoundEnabled: boolean;
}

function isQuestAvailable(quest: Quest, holderData: HolderQuestData, data: QuestDataStore): boolean {
    // Check prerequisites
    if (quest.prerequisiteQuestIds) {
        for (const prereqId of quest.prerequisiteQuestIds) {
            const prereqProgress = holderData.questProgress[prereqId];
            if (!prereqProgress || prereqProgress.status !== 'claimed') {
                return false;
            }
        }
    }

    // Check if already completed (for non-repeatable)
    const progress = holderData.questProgress[quest.id];
    if (progress) {
        if (!quest.repeatable && progress.status === 'claimed') {
            return false;
        }

        // Check cooldown for repeatable quests
        if (quest.repeatable && quest.cooldownHours && progress.lastCompletedAt) {
            const lastCompleted = new Date(progress.lastCompletedAt);
            const cooldownMs = quest.cooldownHours * 60 * 60 * 1000;
            if (Date.now() - lastCompleted.getTime() < cooldownMs) {
                return false;
            }
        }
    }

    // Check expiration for challenge quests
    if (quest.expiresAt && new Date(quest.expiresAt) < new Date()) {
        return false;
    }

    return true;
}

function checkQuestRequirements(quest: Quest, context: HolderContext): { complete: boolean; progress: { [index: number]: number } } {
    const progress: { [index: number]: number } = {};
    let allComplete = true;

    quest.requirements.forEach((req, index) => {
        let current = 0;
        let target = typeof req.value === 'number' ? req.value : 1;

        switch (req.type) {
            case 'hold_amount':
                current = context.fedBalance;
                break;
            case 'hold_duration':
                current = context.holdDays;
                break;
            case 'receive_distributions':
                current = context.distributionsReceived;
                break;
            case 'checkin_streak':
                current = context.checkinStreak;
                break;
            case 'engagement_tier':
                // Map tier names to XP thresholds
                const tierThresholds: { [tier: string]: number } = {
                    'newcomer': 0,
                    'regular': 50,
                    'active': 100,
                    'veteran': 250,
                    'elite': 500
                };
                target = tierThresholds[req.value as string] || 0;
                current = context.engagementXp;
                break;
            case 'credit_score':
                current = context.creditScore;
                break;
            case 'refer_users':
                current = context.referralCount;
                break;
            case 'season_participation':
                current = context.seasonParticipation;
                break;
            case 'auto_compound':
                current = context.autoCompoundEnabled ? 1 : 0;
                break;
            case 'visit_dashboard':
                // This would be tracked separately via dashboard interactions
                current = 1;  // Assume visited if checking
                break;
        }

        progress[index] = Math.min(current / target, 1) * 100;
        if (current < target) {
            allComplete = false;
        }
    });

    return { complete: allComplete, progress };
}

function completeQuest(
    data: QuestDataStore,
    holderData: HolderQuestData,
    quest: Quest
): { xpAwarded: number; badgeAwarded?: string; multiplierBonus?: number } {
    const now = new Date().toISOString();

    // Initialize or update progress
    if (!holderData.questProgress[quest.id]) {
        holderData.questProgress[quest.id] = {
            questId: quest.id,
            status: 'completed',
            completionCount: 0,
            progress: {}
        };
    }

    const progress = holderData.questProgress[quest.id];
    progress.status = 'claimed';
    progress.completedAt = now;
    progress.claimedAt = now;
    progress.lastCompletedAt = now;
    progress.completionCount++;

    // Award XP
    holderData.totalXpEarned += quest.xpReward;
    holderData.questsCompleted++;

    // Award badge if applicable
    let badgeAwarded: string | undefined;
    if (quest.badgeReward && !holderData.badges.includes(quest.badgeReward)) {
        holderData.badges.push(quest.badgeReward);
        badgeAwarded = quest.badgeReward;
        data.globalStats.totalBadgesEarned++;
    }

    // Update global stats
    data.globalStats.totalQuestsCompleted++;
    data.globalStats.totalXpAwarded += quest.xpReward;
    data.globalStats.questCompletionCounts[quest.id] =
        (data.globalStats.questCompletionCounts[quest.id] || 0) + 1;

    holderData.lastUpdated = now;

    return {
        xpAwarded: quest.xpReward,
        badgeAwarded,
        multiplierBonus: quest.multiplierBonus
    };
}

function calculateBadgeMultiplier(badges: string[]): number {
    let totalMultiplier = 1.0;
    for (const badge of badges) {
        const bonus = BADGE_MULTIPLIERS[badge] || 0;
        totalMultiplier += bonus;
    }
    return totalMultiplier;
}

// ═══════════════════════════════════════════════════════════════════════════
// OUTPUT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function displayQuestBoard(holderData: HolderQuestData, context: HolderContext): void {
    const data = loadQuestData();

    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    🏛️ FED QUEST BOARD 🏛️                          ║
╚══════════════════════════════════════════════════════════════════╝

Address: ${holderData.address.substring(0, 8)}...${holderData.address.slice(-4)}

📊 YOUR STATS
────────────────────────────────────────
  Total XP Earned:     ${holderData.totalXpEarned.toLocaleString()} XP
  Quests Completed:    ${holderData.questsCompleted}
  Badges Earned:       ${holderData.badges.length}
  Badge Multiplier:    ${calculateBadgeMultiplier(holderData.badges).toFixed(2)}x
`);

    // Display badges
    if (holderData.badges.length > 0) {
        console.log(`🎖️ YOUR BADGES`);
        console.log(`────────────────────────────────────────`);
        holderData.badges.forEach(badge => {
            const bonus = BADGE_MULTIPLIERS[badge] || 0;
            const bonusStr = bonus > 0 ? ` (+${(bonus * 100).toFixed(0)}%)` : '';
            console.log(`  • ${badge}${bonusStr}`);
        });
        console.log('');
    }

    // Group quests by category
    const categories: { [key: string]: Quest[] } = {
        'onboarding': [],
        'daily': [],
        'achievement': [],
        'social': [],
        'challenge': []
    };

    QUESTS.forEach(quest => {
        if (categories[quest.category]) {
            categories[quest.category].push(quest);
        }
    });

    const categoryNames: { [key: string]: string } = {
        'onboarding': '🎓 ONBOARDING QUESTS',
        'daily': '📅 DAILY QUESTS',
        'achievement': '🏆 ACHIEVEMENT QUESTS',
        'social': '👥 SOCIAL QUESTS',
        'challenge': '⚡ CHALLENGE QUESTS'
    };

    for (const [category, quests] of Object.entries(categories)) {
        if (quests.length === 0) continue;

        console.log(categoryNames[category]);
        console.log(`────────────────────────────────────────`);

        quests.forEach(quest => {
            const available = isQuestAvailable(quest, holderData, data);
            const progress = holderData.questProgress[quest.id];
            const { complete, progress: reqProgress } = checkQuestRequirements(quest, context);

            let status = '🔒';
            let statusText = 'Locked';

            if (progress?.status === 'claimed') {
                status = '✅';
                statusText = quest.repeatable ? 'Complete (Repeatable)' : 'Complete';
            } else if (available && complete) {
                status = '🎁';
                statusText = 'Ready to Claim!';
            } else if (available) {
                status = '🔄';
                statusText = 'In Progress';
            }

            const xpStr = `+${quest.xpReward} XP`;
            const badgeStr = quest.badgeReward ? ` 🎖️` : '';
            const multiplierStr = quest.multiplierBonus ? ` (+${(quest.multiplierBonus * 100).toFixed(0)}%)` : '';

            console.log(`  ${status} ${quest.name} [${xpStr}${badgeStr}${multiplierStr}]`);
            console.log(`     ${quest.description}`);
            console.log(`     Status: ${statusText}`);

            // Show progress bar for in-progress quests
            if (available && !complete && !progress?.status?.includes('claimed')) {
                const avgProgress = Object.values(reqProgress).reduce((a, b) => a + b, 0) / Object.keys(reqProgress).length;
                const progressBar = '█'.repeat(Math.floor(avgProgress / 10)) + '░'.repeat(10 - Math.floor(avgProgress / 10));
                console.log(`     Progress: [${progressBar}] ${avgProgress.toFixed(0)}%`);
            }

            console.log('');
        });
    }
}

function displayLeaderboard(data: QuestDataStore, top: number = 10): void {
    const holders = Object.values(data.holders)
        .sort((a, b) => b.totalXpEarned - a.totalXpEarned)
        .slice(0, top);

    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                  🏛️ FED QUEST LEADERBOARD 🏛️                      ║
╚══════════════════════════════════════════════════════════════════╝

📊 GLOBAL STATS
────────────────────────────────────────
  Total Quests Completed:  ${data.globalStats.totalQuestsCompleted.toLocaleString()}
  Total XP Awarded:        ${data.globalStats.totalXpAwarded.toLocaleString()} XP
  Total Badges Earned:     ${data.globalStats.totalBadgesEarned}
  Active Questers:         ${Object.keys(data.holders).length}

🏆 TOP ${top} QUEST COMPLETERS
────────────────────────────────────────`);

    holders.forEach((holder, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
        const addr = `${holder.address.substring(0, 6)}...${holder.address.slice(-4)}`;
        const multiplier = calculateBadgeMultiplier(holder.badges);

        console.log(`  ${medal} ${addr}: ${holder.totalXpEarned.toLocaleString()} XP | ${holder.questsCompleted} quests | ${holder.badges.length} badges | ${multiplier.toFixed(2)}x mult`);
    });

    console.log('\n📈 MOST COMPLETED QUESTS');
    console.log('────────────────────────────────────────');

    const sortedQuests = Object.entries(data.globalStats.questCompletionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    sortedQuests.forEach(([questId, count]) => {
        const quest = QUESTS.find(q => q.id === questId);
        if (quest) {
            console.log(`  ${count.toLocaleString()}x - ${quest.name}`);
        }
    });
}

function displayQuestStats(jsonOutput: boolean = false): void {
    const data = loadQuestData();

    const stats = {
        globalStats: data.globalStats,
        totalQuesters: Object.keys(data.holders).length,
        questCount: QUESTS.length,
        badgeCount: Object.keys(BADGE_MULTIPLIERS).length,
        categories: {
            onboarding: QUESTS.filter(q => q.category === 'onboarding').length,
            daily: QUESTS.filter(q => q.category === 'daily').length,
            achievement: QUESTS.filter(q => q.category === 'achievement').length,
            social: QUESTS.filter(q => q.category === 'social').length,
            challenge: QUESTS.filter(q => q.category === 'challenge').length
        },
        averageXpPerHolder: Object.keys(data.holders).length > 0
            ? Math.round(data.globalStats.totalXpAwarded / Object.keys(data.holders).length)
            : 0,
        averageQuestsPerHolder: Object.keys(data.holders).length > 0
            ? Math.round(data.globalStats.totalQuestsCompleted / Object.keys(data.holders).length)
            : 0,
        lastUpdated: data.lastUpdated
    };

    if (jsonOutput) {
        console.log(JSON.stringify(stats, null, 2));
    } else {
        console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    🏛️ FED QUEST SYSTEM STATS 🏛️                   ║
╚══════════════════════════════════════════════════════════════════╝

📊 SYSTEM OVERVIEW
────────────────────────────────────────
  Total Quests Available:   ${stats.questCount}
  Total Badges Available:   ${stats.badgeCount}
  Total Active Questers:    ${stats.totalQuesters.toLocaleString()}

📈 COMPLETION STATS
────────────────────────────────────────
  Total Quests Completed:   ${stats.globalStats.totalQuestsCompleted.toLocaleString()}
  Total XP Awarded:         ${stats.globalStats.totalXpAwarded.toLocaleString()}
  Total Badges Earned:      ${stats.globalStats.totalBadgesEarned}
  Avg XP per Holder:        ${stats.averageXpPerHolder.toLocaleString()} XP
  Avg Quests per Holder:    ${stats.averageQuestsPerHolder}

📂 QUESTS BY CATEGORY
────────────────────────────────────────
  🎓 Onboarding:   ${stats.categories.onboarding} quests
  📅 Daily:        ${stats.categories.daily} quests
  🏆 Achievement:  ${stats.categories.achievement} quests
  👥 Social:       ${stats.categories.social} quests
  ⚡ Challenge:    ${stats.categories.challenge} quests

Last Updated: ${stats.lastUpdated}
`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.length === 0) {
        console.log(`
Fed Quests - Gamified Onboarding & Engagement System

Usage:
  npx ts-node fed-quests.ts --quests <address>      View quest board for address
  npx ts-node fed-quests.ts --leaderboard [N]       Show top N questers (default 10)
  npx ts-node fed-quests.ts --stats                 Show quest system stats
  npx ts-node fed-quests.ts --list                  List all available quests
  npx ts-node fed-quests.ts --json                  Output in JSON format

Options:
  --quests <address>   Show quest progress for specific address
  --leaderboard [N]    Show top N quest completers
  --stats              Show global quest statistics
  --list               List all quests with details
  --json               Output results as JSON
  --help               Show this help message

Examples:
  npx ts-node fed-quests.ts --quests 4Br5iKfR...
  npx ts-node fed-quests.ts --leaderboard 20
  npx ts-node fed-quests.ts --stats --json
`);
        return;
    }

    const jsonOutput = args.includes('--json');
    const data = loadQuestData();

    if (args.includes('--stats')) {
        displayQuestStats(jsonOutput);
        return;
    }

    if (args.includes('--leaderboard')) {
        const topIndex = args.indexOf('--leaderboard') + 1;
        const top = topIndex < args.length && !args[topIndex].startsWith('--')
            ? parseInt(args[topIndex])
            : 10;
        displayLeaderboard(data, top);
        return;
    }

    if (args.includes('--list')) {
        if (jsonOutput) {
            console.log(JSON.stringify(QUESTS, null, 2));
        } else {
            console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    🏛️ ALL FED QUESTS 🏛️                           ║
╚══════════════════════════════════════════════════════════════════╝
`);
            QUESTS.forEach(quest => {
                const badgeStr = quest.badgeReward ? ` [Badge: ${quest.badgeReward}]` : '';
                const multStr = quest.multiplierBonus ? ` [+${(quest.multiplierBonus * 100).toFixed(0)}% mult]` : '';
                const repeatStr = quest.repeatable ? ' (Repeatable)' : '';

                console.log(`${quest.category.toUpperCase()} | ${quest.name}${repeatStr}`);
                console.log(`   ${quest.description}`);
                console.log(`   Reward: +${quest.xpReward} XP${badgeStr}${multStr}`);
                quest.requirements.forEach(req => {
                    console.log(`   • ${req.description}`);
                });
                console.log('');
            });
        }
        return;
    }

    if (args.includes('--quests')) {
        const addrIndex = args.indexOf('--quests') + 1;
        if (addrIndex >= args.length || args[addrIndex].startsWith('--')) {
            console.error('Error: --quests requires an address');
            process.exit(1);
        }

        const address = args[addrIndex];
        const holderData = getHolderQuestData(data, address);

        // Mock context for display (in production, this would come from actual data)
        const context: HolderContext = {
            address,
            fedBalance: 0,
            holdDays: 0,
            distributionsReceived: 0,
            checkinStreak: 0,
            engagementXp: 0,
            creditScore: 300,
            referralCount: 0,
            seasonParticipation: 0,
            autoCompoundEnabled: false
        };

        if (jsonOutput) {
            console.log(JSON.stringify({
                holder: holderData,
                availableQuests: QUESTS.filter(q => isQuestAvailable(q, holderData, data)).map(q => q.id),
                badgeMultiplier: calculateBadgeMultiplier(holderData.badges)
            }, null, 2));
        } else {
            displayQuestBoard(holderData, context);
        }
        return;
    }
}

// Export for use in other scripts
export {
    Quest,
    QuestProgress,
    HolderQuestData,
    QuestDataStore,
    HolderContext,
    QUESTS,
    BADGE_MULTIPLIERS,
    loadQuestData,
    saveQuestData,
    getHolderQuestData,
    isQuestAvailable,
    checkQuestRequirements,
    completeQuest,
    calculateBadgeMultiplier
};

main().catch(console.error);
