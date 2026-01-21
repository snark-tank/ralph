import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

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

export interface DistributionLog {
  timestamp: string;
  usd1Distributed: number;
  recipients: number;
  status: 'success' | 'failed' | 'skipped';
}

const LOGS_DIR = '/home/ubuntu/fed/script/distribution-logs';

function parseLogFile(content: string, filename: string): DistributionLog | null {
  try {
    // Extract timestamp from filename: unified-run-2026-01-21T04-52-03-471Z.log
    const timestampMatch = filename.match(/unified-run-(\d{4}-\d{2}-\d{2}T[\d-]+Z)\.log/);
    const timestamp = timestampMatch
      ? timestampMatch[1].replace(/-(\d{2})-(\d{2})-(\d{3})Z/, ':$1:$2.$3Z')
      : new Date().toISOString();

    // Check if distribution was skipped
    if (content.includes('Below minimum threshold') || content.includes('Skipping distribution')) {
      return { timestamp, usd1Distributed: 0, recipients: 0, status: 'skipped' };
    }

    // Parse successful distribution
    const distributedMatch = content.match(/USD1 distributed: ([\d.]+)/);
    const recipientsMatch = content.match(/Recipients: (\d+)/);

    if (distributedMatch && recipientsMatch) {
      return {
        timestamp,
        usd1Distributed: parseFloat(distributedMatch[1]),
        recipients: parseInt(recipientsMatch[1]),
        status: 'success',
      };
    }
    return null;
  } catch {
    return null;
  }
}

function getStatsFromLogs(): {
  totalDistributed: number;
  distributions: number;
  holders: number;
  recentDistributions: { date: string; amount: number; recipients: number }[];
} | null {
  try {
    if (!fs.existsSync(LOGS_DIR)) return null;

    const files = fs.readdirSync(LOGS_DIR)
      .filter(f => f.startsWith('unified-run-') && f.endsWith('.log'))
      .sort()
      .reverse();

    let totalDistributed = 0;
    let totalDistributions = 0;
    let maxRecipients = 0;
    const recent: { date: string; amount: number; recipients: number }[] = [];

    for (const file of files) {
      const content = fs.readFileSync(path.join(LOGS_DIR, file), 'utf8');
      const parsed = parseLogFile(content, file);

      if (parsed?.status === 'success' && parsed.usd1Distributed > 0) {
        totalDistributed += parsed.usd1Distributed;
        totalDistributions++;
        if (parsed.recipients > maxRecipients) maxRecipients = parsed.recipients;
        if (recent.length < 10) {
          recent.push({
            date: parsed.timestamp,
            amount: parsed.usd1Distributed,
            recipients: parsed.recipients,
          });
        }
      }
    }

    return { totalDistributed, distributions: totalDistributions, holders: maxRecipients, recentDistributions: recent };
  } catch {
    return null;
  }
}

export async function getStats(): Promise<{
  totalDistributed: string;
  distributions: number;
  holders: number;
  lastUpdate: string;
  recentDistributions: { date: string; amount: number; recipients: number; txSignature?: string }[];
}> {
  // Try local logs first (for local/dev environment)
  const localStats = getStatsFromLogs();
  if (localStats && localStats.distributions > 0) {
    return {
      totalDistributed: localStats.totalDistributed.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      distributions: localStats.distributions,
      holders: localStats.holders,
      lastUpdate: localStats.recentDistributions[0]?.date
        ? new Date(localStats.recentDistributions[0].date).toLocaleString()
        : new Date().toLocaleString(),
      recentDistributions: localStats.recentDistributions,
    };
  }

  // Fallback to API (for Vercel deployment)
  try {
    const response = await fetch('https://fed-seven.vercel.app/api/distributions', {
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error('Failed to fetch stats');

    const data = await response.json();

    return {
      totalDistributed: data.totalDistributed.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      distributions: data.totalDistributions,
      holders: data.uniqueHoldersPaid,
      lastUpdate: data.recentDistributions?.[0]?.date
        ? new Date(data.recentDistributions[0].date).toLocaleString()
        : new Date().toLocaleString(),
      recentDistributions: data.recentDistributions || [],
    };
  } catch {
    return {
      totalDistributed: '6,022+',
      distributions: 122,
      holders: 309,
      lastUpdate: new Date().toLocaleString(),
      recentDistributions: [],
    };
  }
}
