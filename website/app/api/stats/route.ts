import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOGS_DIR = '/home/ubuntu/fed/script/distribution-logs';

interface DistributionLog {
  timestamp: string;
  usd1Collected: number;
  usd1Distributed: number;
  recipients: number;
  status: 'success' | 'failed' | 'skipped';
}

function parseLogFile(content: string, filename: string): DistributionLog | null {
  try {
    // Extract timestamp from filename: unified-run-2026-01-21T04-52-03-471Z.log
    const timestampMatch = filename.match(/unified-run-(\d{4}-\d{2}-\d{2}T[\d-]+Z)\.log/);
    const timestamp = timestampMatch
      ? timestampMatch[1].replace(/-(\d{2})-(\d{2})-(\d{3})Z/, ':$1:$2.$3Z')
      : new Date().toISOString();

    // Check if distribution was skipped (below threshold)
    if (content.includes('Below minimum threshold') || content.includes('Skipping distribution')) {
      const collectedMatch = content.match(/USD1 collected: ([\d.]+)/);
      return {
        timestamp,
        usd1Collected: collectedMatch ? parseFloat(collectedMatch[1]) : 0,
        usd1Distributed: 0,
        recipients: 0,
        status: 'skipped',
      };
    }

    // Parse successful distribution
    const collectedMatch = content.match(/USD1 collected: ([\d.]+)/);
    const distributedMatch = content.match(/USD1 distributed: ([\d.]+)/);
    const recipientsMatch = content.match(/Recipients: (\d+)/);
    const successMatch = content.includes('Distribution:') && content.includes('SUCCESS');

    if (distributedMatch && recipientsMatch) {
      return {
        timestamp,
        usd1Collected: collectedMatch ? parseFloat(collectedMatch[1]) : 0,
        usd1Distributed: parseFloat(distributedMatch[1]),
        recipients: parseInt(recipientsMatch[1]),
        status: successMatch ? 'success' : 'failed',
      };
    }

    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    // Read all log files
    const files = fs.readdirSync(LOGS_DIR)
      .filter(f => f.startsWith('unified-run-') && f.endsWith('.log'))
      .sort()
      .reverse(); // Most recent first

    const distributions: DistributionLog[] = [];
    let totalDistributed = 0;
    let totalDistributions = 0;
    let maxRecipients = 0;

    // Parse each log file
    for (const file of files) {
      const content = fs.readFileSync(path.join(LOGS_DIR, file), 'utf8');
      const parsed = parseLogFile(content, file);

      if (parsed) {
        if (parsed.status === 'success' && parsed.usd1Distributed > 0) {
          distributions.push(parsed);
          totalDistributed += parsed.usd1Distributed;
          totalDistributions++;
          if (parsed.recipients > maxRecipients) {
            maxRecipients = parsed.recipients;
          }
        }
      }
    }

    // Get recent distributions (last 10 successful ones)
    const recentDistributions = distributions
      .filter(d => d.status === 'success')
      .slice(0, 10)
      .map(d => ({
        date: d.timestamp,
        amount: d.usd1Distributed,
        recipients: d.recipients,
      }));

    // Calculate current accumulating balance from most recent log
    let currentBalance = 0;
    if (files.length > 0) {
      const latestContent = fs.readFileSync(path.join(LOGS_DIR, files[0]), 'utf8');
      const balanceMatch = latestContent.match(/Final USD1 balance: ([\d.]+)/);
      if (balanceMatch) {
        // If it was distributed, balance would be near 0
        // If skipped, this is the accumulating balance
        const latestParsed = parseLogFile(latestContent, files[0]);
        if (latestParsed?.status === 'skipped') {
          currentBalance = parseFloat(balanceMatch[1]);
        }
      }
    }

    return NextResponse.json({
      totalDistributed: Math.round(totalDistributed * 100) / 100,
      totalDistributions,
      uniqueHoldersPaid: maxRecipients, // Best approximation from logs
      currentBalance: Math.round(currentBalance * 100) / 100,
      recentDistributions,
      lastUpdated: new Date().toISOString(),
      logsProcessed: files.length,
    });
  } catch (error) {
    console.error('Error reading distribution logs:', error);
    return NextResponse.json(
      { error: 'Failed to read distribution logs' },
      { status: 500 }
    );
  }
}
