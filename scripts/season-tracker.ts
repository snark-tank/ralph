/**
 * Fed Season Pass - Quarterly Loyalty Tracking System
 *
 * Inspired by Meteora S1 distribution model.
 * Creates quarterly "seasons" with bonus multipliers for consistent participation.
 * Holders who stay through an entire season earn bonus distributions.
 *
 * Season Structure:
 * - Q1 2026 (Jan-Mar): Season 1 - Founding Season
 * - Q2 2026 (Apr-Jun): Season 2
 * - etc.
 *
 * Participation tracked via:
 * - Distributions received
 * - Engagement check-ins
 * - Continuous holding
 *
 * Season Tiers:
 * - Season Champion: 100% participation + top 10 engagement → 3x bonus share
 * - Season All-Star: 90%+ participation + engaged → 2x bonus share
 * - Season Player: 75%+ participation → 1.5x bonus share
 * - Season Participant: 50%+ participation → 1x bonus share
 * - Season Rookie: <50% participation → 0.5x bonus share
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Season definitions
interface Season {
  id: string;
  name: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  bonusPool: number; // Percentage of treasury for season bonus (e.g., 0.05 = 5%)
  minDistributionsForParticipation: number;
  achievements: SeasonAchievement[];
}

interface SeasonAchievement {
  id: string;
  name: string;
  description: string;
  requirement: string;
  bonusMultiplier: number;
  emoji: string;
}

interface ParticipantData {
  address: string;
  season: string;
  distributionsReceived: number;
  totalDistributionsInSeason: number;
  engagementCheckIns: number;
  firstDistributionDate: string | null;
  lastDistributionDate: string | null;
  continuousHolding: boolean;
  participationPercent: number;
  tier: string;
  tierMultiplier: number;
  achievements: string[];
  estimatedBonusShare: number;
}

interface SeasonData {
  currentSeason: string;
  seasons: Record<string, Season>;
  participants: Record<string, ParticipantData>;
  totalDistributionsThisSeason: number;
  seasonStarted: string;
  lastUpdated: string;
}

// Season tier definitions
const SEASON_TIERS = [
  {
    id: 'champion',
    name: 'Season Champion',
    emoji: '🏆',
    minParticipation: 100,
    requiresTopEngagement: true,
    multiplier: 3.0,
    description: '100% participation + top 10 engagement'
  },
  {
    id: 'all_star',
    name: 'Season All-Star',
    emoji: '🥇',
    minParticipation: 90,
    requiresEngagement: true,
    multiplier: 2.0,
    description: '90%+ participation + engaged'
  },
  {
    id: 'player',
    name: 'Season Player',
    emoji: '🥈',
    minParticipation: 75,
    multiplier: 1.5,
    description: '75%+ participation'
  },
  {
    id: 'participant',
    name: 'Season Participant',
    emoji: '🥉',
    minParticipation: 50,
    multiplier: 1.0,
    description: '50%+ participation'
  },
  {
    id: 'rookie',
    name: 'Season Rookie',
    emoji: '🌱',
    minParticipation: 0,
    multiplier: 0.5,
    description: '<50% participation'
  }
];

// Season achievements
const SEASON_ACHIEVEMENTS: SeasonAchievement[] = [
  {
    id: 'perfect_attendance',
    name: 'Perfect Attendance',
    description: 'Received every single distribution in the season',
    requirement: '100% distribution participation',
    bonusMultiplier: 1.2,
    emoji: '✨'
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Participated from the very first week of the season',
    requirement: 'First distribution within 7 days of season start',
    bonusMultiplier: 1.1,
    emoji: '🐦'
  },
  {
    id: 'diamond_season',
    name: 'Diamond Season',
    description: 'Never sold during the entire season',
    requirement: 'Continuous holding throughout season',
    bonusMultiplier: 1.15,
    emoji: '💎'
  },
  {
    id: 'engaged_citizen',
    name: 'Engaged Citizen',
    description: 'Checked in at least 50 times during the season',
    requirement: '50+ engagement check-ins',
    bonusMultiplier: 1.1,
    emoji: '🎯'
  },
  {
    id: 'founding_member',
    name: 'Founding Member',
    description: 'Participated in Season 1 (Founding Season)',
    requirement: 'Season 1 participant',
    bonusMultiplier: 1.25,
    emoji: '🏛️'
  }
];

// Define seasons
const SEASONS: Record<string, Season> = {
  'S1': {
    id: 'S1',
    name: 'Season 1',
    theme: 'Founding Season',
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-03-31T23:59:59Z'),
    bonusPool: 0.05, // 5% bonus pool
    minDistributionsForParticipation: 10,
    achievements: SEASON_ACHIEVEMENTS
  },
  'S2': {
    id: 'S2',
    name: 'Season 2',
    theme: 'Expansion Era',
    startDate: new Date('2026-04-01T00:00:00Z'),
    endDate: new Date('2026-06-30T23:59:59Z'),
    bonusPool: 0.05,
    minDistributionsForParticipation: 10,
    achievements: SEASON_ACHIEVEMENTS.filter(a => a.id !== 'founding_member')
  },
  'S3': {
    id: 'S3',
    name: 'Season 3',
    theme: 'Growth Quarter',
    startDate: new Date('2026-07-01T00:00:00Z'),
    endDate: new Date('2026-09-30T23:59:59Z'),
    bonusPool: 0.05,
    minDistributionsForParticipation: 10,
    achievements: SEASON_ACHIEVEMENTS.filter(a => a.id !== 'founding_member')
  },
  'S4': {
    id: 'S4',
    name: 'Season 4',
    theme: 'Year One Finale',
    startDate: new Date('2026-10-01T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:59Z'),
    bonusPool: 0.07, // Bigger bonus for year-end
    minDistributionsForParticipation: 10,
    achievements: SEASON_ACHIEVEMENTS.filter(a => a.id !== 'founding_member')
  }
};

const DATA_FILE = path.join(__dirname, 'season-data.json');

// Load or initialize season data
function loadSeasonData(): SeasonData {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      return data;
    } catch (e) {
      console.error('Error loading season data, initializing fresh');
    }
  }

  return {
    currentSeason: getCurrentSeasonId(),
    seasons: SEASONS,
    participants: {},
    totalDistributionsThisSeason: 0,
    seasonStarted: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
}

// Save season data
function saveSeasonData(data: SeasonData): void {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get current season ID based on date
function getCurrentSeasonId(): string {
  const now = new Date();

  for (const [id, season] of Object.entries(SEASONS)) {
    if (now >= season.startDate && now <= season.endDate) {
      return id;
    }
  }

  // Default to S1 if no season matches
  return 'S1';
}

// Get current season
function getCurrentSeason(): Season {
  const seasonId = getCurrentSeasonId();
  return SEASONS[seasonId];
}

// Calculate participation percentage
function calculateParticipation(received: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, (received / total) * 100);
}

// Determine tier based on participation and engagement
function determineTier(
  participationPercent: number,
  engagementCheckIns: number,
  isTopEngagement: boolean = false
): { tier: string; multiplier: number; emoji: string } {

  for (const tier of SEASON_TIERS) {
    if (participationPercent >= tier.minParticipation) {
      if (tier.requiresTopEngagement && !isTopEngagement) continue;
      if (tier.requiresEngagement && engagementCheckIns < 20) continue;

      return {
        tier: tier.name,
        multiplier: tier.multiplier,
        emoji: tier.emoji
      };
    }
  }

  return {
    tier: 'Season Rookie',
    multiplier: 0.5,
    emoji: '🌱'
  };
}

// Check achievements for a participant
function checkAchievements(
  participant: ParticipantData,
  seasonId: string,
  totalDistributions: number
): string[] {
  const achievements: string[] = [];

  // Perfect Attendance
  if (participant.distributionsReceived === totalDistributions && totalDistributions > 0) {
    achievements.push('perfect_attendance');
  }

  // Early Bird
  if (participant.firstDistributionDate) {
    const season = SEASONS[seasonId];
    const firstDist = new Date(participant.firstDistributionDate);
    const sevenDaysIn = new Date(season.startDate);
    sevenDaysIn.setDate(sevenDaysIn.getDate() + 7);

    if (firstDist <= sevenDaysIn) {
      achievements.push('early_bird');
    }
  }

  // Diamond Season
  if (participant.continuousHolding) {
    achievements.push('diamond_season');
  }

  // Engaged Citizen
  if (participant.engagementCheckIns >= 50) {
    achievements.push('engaged_citizen');
  }

  // Founding Member (only for S1)
  if (seasonId === 'S1' && participant.distributionsReceived > 0) {
    achievements.push('founding_member');
  }

  return achievements;
}

// Calculate achievement bonus multiplier
function calculateAchievementBonus(achievementIds: string[]): number {
  let bonus = 1.0;

  for (const id of achievementIds) {
    const achievement = SEASON_ACHIEVEMENTS.find(a => a.id === id);
    if (achievement) {
      bonus *= achievement.bonusMultiplier;
    }
  }

  return bonus;
}

// Record a distribution for a participant
export function recordDistribution(address: string, amount: number): void {
  const data = loadSeasonData();
  const seasonId = getCurrentSeasonId();

  const key = `${address}_${seasonId}`;

  if (!data.participants[key]) {
    data.participants[key] = {
      address,
      season: seasonId,
      distributionsReceived: 0,
      totalDistributionsInSeason: data.totalDistributionsThisSeason,
      engagementCheckIns: 0,
      firstDistributionDate: null,
      lastDistributionDate: null,
      continuousHolding: true,
      participationPercent: 0,
      tier: 'Season Rookie',
      tierMultiplier: 0.5,
      achievements: [],
      estimatedBonusShare: 0
    };
  }

  const participant = data.participants[key];
  participant.distributionsReceived++;
  participant.lastDistributionDate = new Date().toISOString();

  if (!participant.firstDistributionDate) {
    participant.firstDistributionDate = new Date().toISOString();
  }

  // Update total distributions in season
  participant.totalDistributionsInSeason = data.totalDistributionsThisSeason;

  saveSeasonData(data);
}

// Increment total distributions count
export function incrementSeasonDistributions(): void {
  const data = loadSeasonData();
  data.totalDistributionsThisSeason++;
  saveSeasonData(data);
}

// Record engagement check-in for season
export function recordSeasonEngagement(address: string): void {
  const data = loadSeasonData();
  const seasonId = getCurrentSeasonId();
  const key = `${address}_${seasonId}`;

  if (data.participants[key]) {
    data.participants[key].engagementCheckIns++;
    saveSeasonData(data);
  }
}

// Get participant status
function getParticipantStatus(address: string): ParticipantData | null {
  const data = loadSeasonData();
  const seasonId = getCurrentSeasonId();
  const key = `${address}_${seasonId}`;

  return data.participants[key] || null;
}

// Calculate all participant tiers and achievements
function calculateSeasonStandings(): ParticipantData[] {
  const data = loadSeasonData();
  const seasonId = getCurrentSeasonId();
  const totalDistributions = data.totalDistributionsThisSeason;

  // Get all participants for current season
  const participants: ParticipantData[] = [];

  for (const [key, participant] of Object.entries(data.participants)) {
    if (participant.season !== seasonId) continue;

    // Calculate participation
    participant.participationPercent = calculateParticipation(
      participant.distributionsReceived,
      totalDistributions
    );

    // Check achievements
    participant.achievements = checkAchievements(participant, seasonId, totalDistributions);

    participants.push(participant);
  }

  // Sort by engagement to find top 10
  const sortedByEngagement = [...participants].sort(
    (a, b) => b.engagementCheckIns - a.engagementCheckIns
  );
  const topEngagementAddresses = new Set(
    sortedByEngagement.slice(0, 10).map(p => p.address)
  );

  // Calculate tiers
  for (const participant of participants) {
    const isTopEngagement = topEngagementAddresses.has(participant.address);
    const tierInfo = determineTier(
      participant.participationPercent,
      participant.engagementCheckIns,
      isTopEngagement
    );

    participant.tier = tierInfo.tier;
    participant.tierMultiplier = tierInfo.multiplier;

    // Calculate bonus share (tier * achievements)
    const achievementBonus = calculateAchievementBonus(participant.achievements);
    participant.estimatedBonusShare = participant.tierMultiplier * achievementBonus;
  }

  // Sort by bonus share
  return participants.sort((a, b) => b.estimatedBonusShare - a.estimatedBonusShare);
}

// Get season leaderboard
function getSeasonLeaderboard(limit: number = 20): void {
  const standings = calculateSeasonStandings();
  const season = getCurrentSeason();
  const data = loadSeasonData();

  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil(
    (season.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  ));
  const totalDays = Math.ceil(
    (season.endDate.getTime() - season.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const progress = Math.round(((totalDays - daysRemaining) / totalDays) * 100);

  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║               🏛️  FED SEASON PASS - ${season.name.toUpperCase().padEnd(10)} 🏛️               ║
║                      "${season.theme}"                          ║
╚══════════════════════════════════════════════════════════════════╝

📅 Season Progress: ${progress}% complete (${daysRemaining} days remaining)
${'█'.repeat(Math.floor(progress / 5))}${'░'.repeat(20 - Math.floor(progress / 5))} ${progress}%

📊 Season Stats:
   Total Distributions: ${data.totalDistributionsThisSeason}
   Active Participants: ${standings.length}
   Bonus Pool: ${(season.bonusPool * 100).toFixed(0)}% of treasury

🏆 SEASON LEADERBOARD (Top ${limit}):
${'═'.repeat(68)}
`);

  for (let i = 0; i < Math.min(limit, standings.length); i++) {
    const p = standings[i];
    const rank = i + 1;
    const addressShort = `${p.address.slice(0, 6)}...${p.address.slice(-4)}`;
    const achievementEmojis = p.achievements
      .map(id => SEASON_ACHIEVEMENTS.find(a => a.id === id)?.emoji || '')
      .join('');

    let tierEmoji = '🌱';
    for (const tier of SEASON_TIERS) {
      if (tier.name === p.tier) {
        tierEmoji = tier.emoji;
        break;
      }
    }

    console.log(
      `${String(rank).padStart(3)}. ${tierEmoji} ${addressShort} | ` +
      `${p.participationPercent.toFixed(0)}% participation | ` +
      `${p.tierMultiplier.toFixed(1)}x bonus | ` +
      `${achievementEmojis}`
    );
  }

  // Tier distribution
  console.log(`
${'═'.repeat(68)}

📈 Tier Distribution:
`);

  for (const tier of SEASON_TIERS) {
    const count = standings.filter(p => p.tier === tier.name).length;
    const bar = '█'.repeat(Math.min(30, Math.floor(count / 2)));
    console.log(`   ${tier.emoji} ${tier.name.padEnd(18)} ${String(count).padStart(4)} holders ${bar}`);
  }

  // Achievement summary
  console.log(`
🏅 Achievement Unlocks:
`);

  for (const achievement of SEASON_ACHIEVEMENTS) {
    const count = standings.filter(p => p.achievements.includes(achievement.id)).length;
    console.log(`   ${achievement.emoji} ${achievement.name.padEnd(20)} ${count} holders`);
  }
}

// Get individual status
function showStatus(address: string): void {
  const data = loadSeasonData();
  const seasonId = getCurrentSeasonId();
  const season = getCurrentSeason();
  const key = `${address}_${seasonId}`;

  let participant = data.participants[key];

  if (!participant) {
    console.log(`
⚠️  No participation found for ${address} in ${season.name}
    Start receiving distributions to begin your Season Pass journey!
`);
    return;
  }

  // Recalculate for current standings
  const standings = calculateSeasonStandings();
  participant = standings.find(p => p.address === address) || participant;
  const rank = standings.findIndex(p => p.address === address) + 1;

  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil(
    (season.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  ));

  let tierEmoji = '🌱';
  for (const tier of SEASON_TIERS) {
    if (tier.name === participant.tier) {
      tierEmoji = tier.emoji;
      break;
    }
  }

  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                   🏛️  YOUR SEASON PASS  🏛️                       ║
║                      ${season.name} - ${season.theme}                      ║
╚══════════════════════════════════════════════════════════════════╝

👤 Address: ${participant.address}
📊 Season Rank: #${rank} of ${standings.length}

🎫 STATUS:
   ${tierEmoji} Tier: ${participant.tier}
   📈 Participation: ${participant.participationPercent.toFixed(1)}%
   📦 Distributions Received: ${participant.distributionsReceived}/${data.totalDistributionsThisSeason}
   🎯 Engagement Check-ins: ${participant.engagementCheckIns}
   💎 Continuous Holding: ${participant.continuousHolding ? 'Yes' : 'No'}

💰 BONUS MULTIPLIER:
   Base Tier: ${participant.tierMultiplier.toFixed(1)}x
   Achievement Bonus: ${calculateAchievementBonus(participant.achievements).toFixed(2)}x
   ─────────────────────
   Total: ${participant.estimatedBonusShare.toFixed(2)}x

🏅 ACHIEVEMENTS UNLOCKED (${participant.achievements.length}):
`);

  for (const achievement of SEASON_ACHIEVEMENTS) {
    const unlocked = participant.achievements.includes(achievement.id);
    const status = unlocked ? '✅' : '⬜';
    console.log(`   ${status} ${achievement.emoji} ${achievement.name}`);
    if (!unlocked) {
      console.log(`      └─ ${achievement.requirement}`);
    }
  }

  // Next tier info
  const currentTierIndex = SEASON_TIERS.findIndex(t => t.name === participant.tier);
  if (currentTierIndex > 0) {
    const nextTier = SEASON_TIERS[currentTierIndex - 1];
    const participationNeeded = nextTier.minParticipation - participant.participationPercent;

    console.log(`
📈 NEXT TIER: ${nextTier.emoji} ${nextTier.name}
   Need: ${participationNeeded > 0 ? `${participationNeeded.toFixed(1)}% more participation` : 'Meet engagement requirements'}
   Reward: ${nextTier.multiplier.toFixed(1)}x bonus (vs current ${participant.tierMultiplier.toFixed(1)}x)
`);
  }

  console.log(`
⏳ Season ends in ${daysRemaining} days - keep participating to maximize your bonus!
`);
}

// JSON output
function outputJSON(mode: 'status' | 'leaderboard' | 'season', address?: string): void {
  const data = loadSeasonData();
  const season = getCurrentSeason();
  const standings = calculateSeasonStandings();

  let output: any;

  if (mode === 'status' && address) {
    const participant = standings.find(p => p.address === address);
    output = {
      success: !!participant,
      season: {
        id: season.id,
        name: season.name,
        theme: season.theme,
        endsAt: season.endDate.toISOString(),
        bonusPool: season.bonusPool
      },
      participant: participant || null,
      rank: participant ? standings.findIndex(p => p.address === address) + 1 : null
    };
  } else if (mode === 'leaderboard') {
    output = {
      season: {
        id: season.id,
        name: season.name,
        theme: season.theme,
        endsAt: season.endDate.toISOString(),
        bonusPool: season.bonusPool
      },
      totalDistributions: data.totalDistributionsThisSeason,
      totalParticipants: standings.length,
      leaderboard: standings.slice(0, 50)
    };
  } else {
    output = {
      currentSeason: season,
      allSeasons: Object.values(SEASONS).map(s => ({
        id: s.id,
        name: s.name,
        theme: s.theme,
        startDate: s.startDate.toISOString(),
        endDate: s.endDate.toISOString(),
        bonusPool: s.bonusPool
      })),
      stats: {
        totalDistributions: data.totalDistributionsThisSeason,
        totalParticipants: standings.length,
        tierDistribution: SEASON_TIERS.map(tier => ({
          tier: tier.name,
          count: standings.filter(p => p.tier === tier.name).length,
          multiplier: tier.multiplier
        }))
      }
    };
  }

  console.log(JSON.stringify(output, null, 2));
}

// Show help
function showHelp(): void {
  console.log(`
Fed Season Pass - Quarterly Loyalty Tracking System

Usage:
  npx ts-node season-tracker.ts [options]

Options:
  --leaderboard [n]     Show season leaderboard (default: top 20)
  --status <address>    Check specific address status
  --season              Show current season info
  --json                Output in JSON format
  --help                Show this help message

Examples:
  npx ts-node season-tracker.ts --leaderboard
  npx ts-node season-tracker.ts --leaderboard 50
  npx ts-node season-tracker.ts --status 4Br5iKf...L4P
  npx ts-node season-tracker.ts --season --json

Season Tiers:
  ${SEASON_TIERS.map(t => `${t.emoji} ${t.name} (${t.multiplier}x) - ${t.description}`).join('\n  ')}

Achievements:
  ${SEASON_ACHIEVEMENTS.map(a => `${a.emoji} ${a.name} - ${a.description}`).join('\n  ')}

The Season Pass rewards consistent participation over an entire quarter.
Stack your tier bonus with achievement bonuses for maximum BRRR!
`);
}

// Main CLI
function main(): void {
  const args = process.argv.slice(2);

  // Parse arguments
  const jsonMode = args.includes('--json');
  const helpMode = args.includes('--help');
  const leaderboardMode = args.includes('--leaderboard');
  const statusMode = args.includes('--status');
  const seasonMode = args.includes('--season');

  if (helpMode) {
    showHelp();
    return;
  }

  if (statusMode) {
    const statusIndex = args.indexOf('--status');
    const address = args[statusIndex + 1];

    if (!address || address.startsWith('--')) {
      console.error('Error: --status requires an address');
      process.exit(1);
    }

    if (jsonMode) {
      outputJSON('status', address);
    } else {
      showStatus(address);
    }
    return;
  }

  if (leaderboardMode) {
    const lbIndex = args.indexOf('--leaderboard');
    const limitArg = args[lbIndex + 1];
    const limit = limitArg && !limitArg.startsWith('--') ? parseInt(limitArg, 10) : 20;

    if (jsonMode) {
      outputJSON('leaderboard');
    } else {
      getSeasonLeaderboard(limit);
    }
    return;
  }

  if (seasonMode || jsonMode) {
    if (jsonMode) {
      outputJSON('season');
    } else {
      const season = getCurrentSeason();
      const data = loadSeasonData();
      const standings = calculateSeasonStandings();

      const now = new Date();
      const daysRemaining = Math.max(0, Math.ceil(
        (season.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ));
      const totalDays = Math.ceil(
        (season.endDate.getTime() - season.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const progress = Math.round(((totalDays - daysRemaining) / totalDays) * 100);

      console.log(`
╔══════════════════════════════════════════════════════════════════╗
║               🏛️  FED SEASON PASS  🏛️                            ║
║                 "${season.theme}"                                ║
╚══════════════════════════════════════════════════════════════════╝

📅 Current Season: ${season.name}
   Started: ${season.startDate.toISOString().split('T')[0]}
   Ends: ${season.endDate.toISOString().split('T')[0]}
   Progress: ${progress}% (${daysRemaining} days remaining)

📊 Season Stats:
   Total Distributions: ${data.totalDistributionsThisSeason}
   Active Participants: ${standings.length}
   Bonus Pool: ${(season.bonusPool * 100).toFixed(0)}% of treasury

🏆 Tier Breakdown:
${SEASON_TIERS.map(tier => {
  const count = standings.filter(p => p.tier === tier.name).length;
  return `   ${tier.emoji} ${tier.name.padEnd(18)} ${String(count).padStart(4)} holders (${tier.multiplier}x bonus)`;
}).join('\n')}

📆 Upcoming Seasons:
${Object.values(SEASONS)
  .filter(s => s.startDate > now)
  .slice(0, 3)
  .map(s => `   ${s.id}: ${s.name} - "${s.theme}" (${s.startDate.toISOString().split('T')[0]} to ${s.endDate.toISOString().split('T')[0]})`)
  .join('\n') || '   No upcoming seasons scheduled'}

Use --leaderboard to see the current rankings!
`);
    }
    return;
  }

  // Default: show help
  showHelp();
}

// Exports for integration
export {
  loadSeasonData,
  saveSeasonData,
  getCurrentSeason,
  getCurrentSeasonId,
  calculateSeasonStandings,
  SEASON_TIERS,
  SEASON_ACHIEVEMENTS,
  SEASONS
};

export type {
  ParticipantData,
  SeasonData
};

main();
