import { NextResponse } from 'next/server';
import fs from 'fs';

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

export async function GET() {
  try {
    // Read from authoritative source
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

    return NextResponse.json({
      totalDistributed: Math.round(history.totalDistributed * 100) / 100,
      totalDistributions: history.distributions.length,
      uniqueHoldersPaid: maxRecipients,
      recentDistributions,
      lastUpdated: history.distributions[history.distributions.length - 1]?.timestamp || new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error reading distribution history:', error);
    return NextResponse.json(
      { error: 'Failed to read distribution history' },
      { status: 500 }
    );
  }
}
