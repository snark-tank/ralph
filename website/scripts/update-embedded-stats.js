#!/usr/bin/env node
/**
 * Updates embedded-stats.ts with latest distribution data
 * Run this before build to ensure Vercel has current stats
 */

const fs = require('fs');
const path = require('path');

const DISTRIBUTION_HISTORY_PATH = '/home/ubuntu/fed/src/token-distribution-history.json';
const EMBEDDED_STATS_PATH = path.join(__dirname, '..', 'lib', 'embedded-stats.ts');

function updateEmbeddedStats() {
  console.log('Updating embedded stats for Vercel deployment...');

  // Check if distribution history exists
  if (!fs.existsSync(DISTRIBUTION_HISTORY_PATH)) {
    console.log('Distribution history not found, keeping existing embedded stats');
    return;
  }

  try {
    // Read the distribution history
    const historyContent = fs.readFileSync(DISTRIBUTION_HISTORY_PATH, 'utf8');
    const history = JSON.parse(historyContent);

    // Get recent distributions (last 10)
    const recentDistributions = history.distributions
      .slice(-10)
      .reverse()
      .map(d => ({
        date: d.timestamp,
        amount: Math.round(d.totalAmount * 100) / 100,
        recipients: d.recipientCount,
        txSignature: d.txSignatures[0] || undefined,
      }));

    // Find max recipients
    const maxRecipients = Math.max(...history.distributions.map(d => d.recipientCount));

    // Get the latest timestamp
    const lastUpdated = history.distributions[history.distributions.length - 1]?.timestamp || new Date().toISOString();

    // Generate the new embedded stats file
    const embeddedStatsContent = `// Embedded stats - updated at build time or via script
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

    // Write the updated file
    fs.writeFileSync(EMBEDDED_STATS_PATH, embeddedStatsContent);

    console.log(`Updated embedded stats:`);
    console.log(`  - Total distributed: $${history.totalDistributed.toFixed(2)}`);
    console.log(`  - Distribution count: ${history.distributions.length}`);
    console.log(`  - Max recipients: ${maxRecipients}`);
    console.log(`  - Last updated: ${lastUpdated}`);

  } catch (error) {
    console.error('Error updating embedded stats:', error.message);
    console.log('Keeping existing embedded stats');
  }
}

updateEmbeddedStats();
