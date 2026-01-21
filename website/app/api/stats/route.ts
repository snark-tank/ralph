import { NextResponse } from 'next/server';
import fs from 'fs';
import { EMBEDDED_STATS } from '@/lib/embedded-stats';

// Local path for development - won't exist on Vercel
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

export async function GET() {
  // Try local file first (development environment)
  try {
    if (fs.existsSync(DISTRIBUTION_HISTORY_PATH)) {
      const content = fs.readFileSync(DISTRIBUTION_HISTORY_PATH, 'utf8');
      const history: DistributionHistory = JSON.parse(content);

      const recentDistributions = history.distributions
        .slice(-10)
        .reverse()
        .map(d => ({
          date: d.timestamp,
          amount: d.totalAmount,
          recipients: d.recipientCount,
          txSignature: d.txSignatures[0] || undefined,
        }));

      const maxRecipients = Math.max(...history.distributions.map(d => d.recipientCount));

      return NextResponse.json({
        totalDistributed: Math.round(history.totalDistributed * 100) / 100,
        totalDistributions: history.distributions.length,
        uniqueHoldersPaid: maxRecipients,
        recentDistributions,
        lastUpdated: history.distributions[history.distributions.length - 1]?.timestamp || new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error reading local distribution history:', error);
  }

  // Fallback to embedded stats (Vercel production)
  return NextResponse.json({
    totalDistributed: EMBEDDED_STATS.totalDistributed,
    totalDistributions: EMBEDDED_STATS.distributionCount,
    uniqueHoldersPaid: EMBEDDED_STATS.maxRecipients,
    recentDistributions: EMBEDDED_STATS.recentDistributions,
    lastUpdated: EMBEDDED_STATS.lastUpdated,
  });
}
