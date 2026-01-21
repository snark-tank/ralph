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

export function getStats(): { totalDistributed: string; distributions: number; holders: number; lastUpdate: string } {
  // Read from README or a stats file
  const readmePath = path.join(process.cwd(), '..', 'README.md');

  try {
    const content = fs.readFileSync(readmePath, 'utf8');

    // Parse stats from README
    const distributedMatch = content.match(/\*\*Total Distributed\*\*\s*\|\s*\$?([\d,]+)/);
    const distributionsMatch = content.match(/\*\*Distributions\*\*\s*\|\s*(\d+)/);
    const holdersMatch = content.match(/\*\*Holders Paid\*\*\s*\|\s*(\d+)/);
    const dateMatch = content.match(/Last updated:\s*(.+)/);

    return {
      totalDistributed: distributedMatch ? distributedMatch[1] : '6,022+',
      distributions: distributionsMatch ? parseInt(distributionsMatch[1]) : 122,
      holders: holdersMatch ? parseInt(holdersMatch[1]) : 309,
      lastUpdate: dateMatch ? dateMatch[1].trim() : new Date().toLocaleDateString(),
    };
  } catch {
    return {
      totalDistributed: '6,022+',
      distributions: 122,
      holders: 309,
      lastUpdate: new Date().toLocaleDateString(),
    };
  }
}
