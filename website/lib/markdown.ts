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

export interface DistributionStats {
  totalDistributed: number;
  totalDistributions: number;
  uniqueHoldersPaid: number;
  recentDistributions: {
    date: string;
    amount: number;
    recipients: number;
    txSignature: string;
  }[];
}

export async function getStats(): Promise<{
  totalDistributed: string;
  distributions: number;
  holders: number;
  lastUpdate: string;
  recentDistributions: DistributionStats['recentDistributions'];
}> {
  try {
    const response = await fetch('https://fed-seven.vercel.app/api/distributions', {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    const data: DistributionStats = await response.json();

    return {
      totalDistributed: data.totalDistributed.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      distributions: data.totalDistributions,
      holders: data.uniqueHoldersPaid,
      lastUpdate: data.recentDistributions[0]?.date
        ? new Date(data.recentDistributions[0].date).toLocaleString()
        : new Date().toLocaleString(),
      recentDistributions: data.recentDistributions,
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
