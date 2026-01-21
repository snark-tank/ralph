#!/usr/bin/env npx tsx
/**
 * Sync Embedded Stats
 *
 * This script reads the authoritative distribution history JSON file
 * and updates the embedded-stats.ts file with the latest data.
 *
 * Run this before deploying to ensure Vercel has the latest stats.
 *
 * Usage: npx tsx scripts/sync-embedded-stats.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const DISTRIBUTION_HISTORY_PATH = '/home/ubuntu/fed/src/token-distribution-history.json';
const EMBEDDED_STATS_PATH = path.join(__dirname, '..', 'lib', 'embedded-stats.ts');

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

function main() {
  console.log('Syncing embedded stats from distribution history...');

  // Read the authoritative distribution history
  if (!fs.existsSync(DISTRIBUTION_HISTORY_PATH)) {
    console.error(`Error: Distribution history file not found at ${DISTRIBUTION_HISTORY_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(DISTRIBUTION_HISTORY_PATH, 'utf8');
  const history: DistributionHistory = JSON.parse(content);

  // Get the last 10 distributions (most recent first)
  const recentDistributions = history.distributions
    .slice(-10)
    .reverse()
    .map(d => ({
      date: d.timestamp,
      amount: Math.round(d.totalAmount * 100) / 100, // Round to 2 decimals
      recipients: d.recipientCount,
      txSignature: d.txSignatures[0] || '',
    }));

  // Find max recipients
  const maxRecipients = Math.max(...history.distributions.map(d => d.recipientCount));

  // Get the last distribution timestamp
  const lastDistribution = history.distributions[history.distributions.length - 1];
  const lastUpdated = lastDistribution?.timestamp || new Date().toISOString();

  // Generate the TypeScript file content
  const fileContent = `// Embedded stats - updated at build time or via script
// This provides fallback data when the local JSON file is not accessible (e.g., on Vercel)
// Last updated: ${lastUpdated}

export const EMBEDDED_STATS = {
  totalDistributed: ${Math.round(history.totalDistributed * 100) / 100},
  distributionCount: ${history.distributions.length},
  maxRecipients: ${maxRecipients},
  lastUpdated: "${lastUpdated}",
  recentDistributions: ${JSON.stringify(recentDistributions, null, 4).split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n')}
};
`;

  // Write the file
  fs.writeFileSync(EMBEDDED_STATS_PATH, fileContent);

  console.log(`Updated embedded stats:
  - Total Distributed: $${history.totalDistributed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  - Distribution Count: ${history.distributions.length}
  - Max Recipients: ${maxRecipients}
  - Last Updated: ${lastUpdated}
`);
}

main();
