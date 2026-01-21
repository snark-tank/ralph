import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Redis from 'ioredis';
import { EMBEDDED_STATS } from './embedded-stats';

// Path to docs folder (one level up from website)
const docsDirectory = path.join(process.cwd(), '..', 'docs');

export async function getMarkdownContent(filename: string): Promise<{ content: string; data: Record<string, unknown> }> {
  const fullPath = path.join(docsDirectory, filename);

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(html)
      .process(content);

    return {
      content: processedContent.toString(),
      data,
    };
  } catch {
    return {
      content: '<p>Content not yet available.</p>',
      data: {},
    };
  }
}

export function getDocsList(): string[] {
  try {
    const files = fs.readdirSync(docsDirectory);
    return files.filter(file => file.endsWith('.md'));
  } catch {
    return [];
  }
}

export async function getGitLog(limit: number = 20): Promise<{ hash: string; date: string; message: string }[]> {
  const { execSync } = require('child_process');
  const projectRoot = path.join(process.cwd(), '..');

  try {
    const output = execSync(
      `git log --oneline --date=short --format="%h|%ad|%s" -n ${limit}`,
      { cwd: projectRoot, encoding: 'utf8' }
    );

    return output
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line: string) => {
        const [hash, date, ...messageParts] = line.split('|');
        return {
          hash,
          date,
          message: messageParts.join('|'),
        };
      });
  } catch {
    return [];
  }
}

// Authoritative source for distribution history
const DISTRIBUTION_HISTORY_PATH = '/home/ubuntu/fed/src/token-distribution-history.json';

interface Distribution {
  timestamp: string;
  totalAmount: number;
  recipientCount: number;
  txSignatures: string[];
}

interface DistributionHistory {
  totalDistributed: number;
  distributions: Distribution[];
}

function getStatsFromHistory(): {
  totalDistributed: number;
  distributions: number;
  holders: number;
  recentDistributions: { date: string; amount: number; recipients: number; txSignature?: string }[];
} | null {
  try {
    if (!fs.existsSync(DISTRIBUTION_HISTORY_PATH)) return null;

    const content = fs.readFileSync(DISTRIBUTION_HISTORY_PATH, 'utf8');
    const history: DistributionHistory = JSON.parse(content);

    // Get recent distributions (last 10)
    const recentDistributions = history.distributions
      .slice(-10)
      .reverse()
      .map(d => ({
        date: d.timestamp,
        amount: d.totalAmount,
        recipients: d.recipientCount,
        txSignature: d.txSignatures[0] || undefined,
      }));

    // Find max recipients
    const maxRecipients = Math.max(...history.distributions.map(d => d.recipientCount));

    return {
      totalDistributed: history.totalDistributed,
      distributions: history.distributions.length,
      holders: maxRecipients,
      recentDistributions,
    };
  } catch {
    return null;
  }
}

async function getStatsFromRedis(): Promise<{
  totalDistributed: number;
  distributions: number;
  holders: number;
  recentDistributions: { date: string; amount: number; recipients: number; txSignature?: string }[];
} | null> {
  // First try authoritative local file (fastest, most accurate)
  const historyStats = getStatsFromHistory();
  if (historyStats && historyStats.distributions > 0) {
    return historyStats;
  }

  // Fall back to Redis if local file not available
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;

  let redis: Redis | null = null;
  try {
    redis = new Redis(redisUrl);
    const data = await redis.get('fed:stats');
    if (!data) return null;

    const stats = JSON.parse(data);
    return {
      totalDistributed: stats.totalDistributed || 0,
      distributions: stats.totalDistributions || 0,
      holders: stats.uniqueHoldersPaid || 0,
      recentDistributions: stats.recentDistributions || [],
    };
  } catch (error) {
    console.error('Redis error:', error);
    return null;
  } finally {
    if (redis) await redis.quit();
  }
}

// Calculate Fed Funds Rate from distribution data
export function calculateFedFundsRate(
  recentDistributions: { date: string; amount: number; recipients: number }[],
  totalSupply: number = 1_000_000_000 // 1 billion $FED total supply
): {
  rate7d: number | null;
  rate30d: number | null;
  currentRate: number | null;
  printerStatus: string;
} {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Filter distributions by time period
  const last7d = recentDistributions.filter(d => new Date(d.date) >= sevenDaysAgo);
  const last30d = recentDistributions.filter(d => new Date(d.date) >= thirtyDaysAgo);

  // Calculate total distributed in each period
  const total7d = last7d.reduce((sum, d) => sum + d.amount, 0);
  const total30d = last30d.reduce((sum, d) => sum + d.amount, 0);

  // Estimate market cap (using a rough price estimate of $0.0001 per $FED)
  const estimatedPrice = 0.0001; // This could be fetched from an API
  const estimatedMarketCap = totalSupply * estimatedPrice;

  // Calculate annualized APY
  // APY = (rewards / marketCap) * (365 / days) * 100
  const rate7d = estimatedMarketCap > 0 && total7d > 0
    ? (total7d / estimatedMarketCap) * (365 / 7) * 100
    : null;

  const rate30d = estimatedMarketCap > 0 && total30d > 0
    ? (total30d / estimatedMarketCap) * (365 / 30) * 100
    : null;

  // Current rate is the 7d rate (more recent/relevant)
  const currentRate = rate7d;

  // Determine printer status based on recent activity
  let printerStatus = 'idle';
  if (last7d.length > 0) {
    const avgDaily = total7d / 7;
    if (avgDaily > 100) printerStatus = 'BRRR BRRR BRRR';
    else if (avgDaily > 50) printerStatus = 'brrr brrr';
    else if (avgDaily > 10) printerStatus = 'brrr';
    else printerStatus = 'warming up';
  }

  return { rate7d, rate30d, currentRate, printerStatus };
}

export async function getStats(): Promise<{
  totalDistributed: string;
  distributions: number;
  holders: number;
  lastUpdate: string;
  recentDistributions: { date: string; amount: number; recipients: number; txSignature?: string }[];
  fedFundsRate?: { rate7d: number | null; rate30d: number | null; currentRate: number | null; printerStatus: string };
}> {
  // Try Redis first (for Vercel with Redis configured)
  const redisStats = await getStatsFromRedis();
  if (redisStats && redisStats.distributions > 0) {
    return {
      totalDistributed: redisStats.totalDistributed.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      distributions: redisStats.distributions,
      holders: redisStats.holders,
      lastUpdate: redisStats.recentDistributions[0]?.date
        ? new Date(redisStats.recentDistributions[0].date).toLocaleString()
        : new Date().toLocaleString(),
      recentDistributions: redisStats.recentDistributions,
      fedFundsRate: calculateFedFundsRate(redisStats.recentDistributions),
    };
  }

  // Try authoritative history file (for local/dev environment)
  const historyStats = getStatsFromHistory();
  if (historyStats && historyStats.distributions > 0) {
    return {
      totalDistributed: historyStats.totalDistributed.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      distributions: historyStats.distributions,
      holders: historyStats.holders,
      lastUpdate: historyStats.recentDistributions[0]?.date
        ? new Date(historyStats.recentDistributions[0].date).toLocaleString()
        : new Date().toLocaleString(),
      recentDistributions: historyStats.recentDistributions,
      fedFundsRate: calculateFedFundsRate(historyStats.recentDistributions),
    };
  }

  // Use embedded stats as fallback (works on Vercel without local file access)
  return {
    totalDistributed: EMBEDDED_STATS.totalDistributed.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    distributions: EMBEDDED_STATS.distributionCount,
    holders: EMBEDDED_STATS.maxRecipients,
    lastUpdate: new Date(EMBEDDED_STATS.lastUpdated).toLocaleString(),
    recentDistributions: EMBEDDED_STATS.recentDistributions,
    fedFundsRate: calculateFedFundsRate(EMBEDDED_STATS.recentDistributions),
  };
}
