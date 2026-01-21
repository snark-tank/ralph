import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Fed Funds Rate API - Returns real-time APY calculations
 *
 * Based on 2026 DeFi best practices:
 * - Real yield from actual fees (not inflation)
 * - Transparent calculation methodology
 * - Multiple time period rates (7d, 30d, all-time)
 * - Projection tools for potential earnings
 */

const LOGS_DIR = '/home/ubuntu/fed/script/distribution-logs';
const HISTORY_FILE = '/home/ubuntu/fed/src/token-distribution-history.json';

// $FED total supply (fixed)
const FED_TOTAL_SUPPLY = 1_000_000_000; // 1 billion

interface DistributionRecord {
  timestamp: string;
  totalAmount: number;
  recipientCount: number;
}

interface DistributionHistory {
  totalDistributed: number;
  distributions: DistributionRecord[];
}

interface FedFundsRateResponse {
  // Current rates (APY %)
  rate7d: number;
  rate30d: number;
  rateAllTime: number;

  // Volume metrics
  volume24h: number;
  volume7d: number;
  volume30d: number;

  // Distribution stats
  avgDistributionSize: number;
  distributionsPerDay: number;
  totalDistributed: number;

  // Projections (for 1M $FED holding)
  projectedDaily: number;
  projectedWeekly: number;
  projectedMonthly: number;
  projectedYearly: number;

  // Printer status
  printerStatus: 'BRRR' | 'brrr' | 'brr' | 'idle';
  printerIndicator: string;

  // Meta
  lastUpdated: string;
  calculationMethod: string;
}

function getDistributionsInPeriod(distributions: DistributionRecord[], days: number): DistributionRecord[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return distributions.filter(d => new Date(d.timestamp) >= cutoff);
}

function calculateAPY(periodDistributed: number, periodDays: number, totalSupplyHeld: number): number {
  if (totalSupplyHeld <= 0 || periodDays <= 0) return 0;

  // Daily rate
  const dailyRate = periodDistributed / periodDays;

  // Annualized return based on supply
  // APY = (dailyRate / totalSupplyHeld) * 365 * 100
  const apy = (dailyRate / totalSupplyHeld) * 365 * 100;

  return Math.round(apy * 100) / 100;
}

function getPrinterStatus(rate7d: number): { status: 'BRRR' | 'brrr' | 'brr' | 'idle'; indicator: string } {
  if (rate7d >= 50) return { status: 'BRRR', indicator: '||||' };
  if (rate7d >= 25) return { status: 'brrr', indicator: '|||' };
  if (rate7d >= 10) return { status: 'brr', indicator: '||' };
  return { status: 'idle', indicator: '|' };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const holdingsParam = searchParams.get('holdings');

    // Custom holdings amount (default 1M $FED for projections)
    const holdingsAmount = holdingsParam ? parseInt(holdingsParam) : 1_000_000;

    // Load distribution history
    let history: DistributionHistory = { totalDistributed: 0, distributions: [] };

    if (fs.existsSync(HISTORY_FILE)) {
      try {
        history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
      } catch {
        console.error('Failed to parse distribution history');
      }
    }

    const distributions = history.distributions || [];

    // Get distributions for different periods
    const dist7d = getDistributionsInPeriod(distributions, 7);
    const dist30d = getDistributionsInPeriod(distributions, 30);

    // Calculate volumes
    const volume7d = dist7d.reduce((sum, d) => sum + d.totalAmount, 0);
    const volume30d = dist30d.reduce((sum, d) => sum + d.totalAmount, 0);
    const volume24h = getDistributionsInPeriod(distributions, 1).reduce((sum, d) => sum + d.totalAmount, 0);

    // Estimate circulating supply held (approximation based on recent recipients)
    const recentDistributions = distributions.slice(-10);
    const avgRecipients = recentDistributions.length > 0
      ? recentDistributions.reduce((sum, d) => sum + (d.recipientCount || 0), 0) / recentDistributions.length
      : 300;

    // Assume average holder has ~1M $FED (conservative estimate)
    const estimatedSupplyHeld = avgRecipients * 1_000_000;

    // Calculate APY rates
    const rate7d = calculateAPY(volume7d, 7, estimatedSupplyHeld);
    const rate30d = calculateAPY(volume30d, 30, estimatedSupplyHeld);

    // All-time calculation
    const firstDistribution = distributions[0];
    const daysActive = firstDistribution
      ? Math.ceil((Date.now() - new Date(firstDistribution.timestamp).getTime()) / (1000 * 60 * 60 * 24))
      : 1;
    const rateAllTime = calculateAPY(history.totalDistributed, daysActive, estimatedSupplyHeld);

    // Calculate projections for the requested holdings amount
    const holdingsRatio = holdingsAmount / FED_TOTAL_SUPPLY;
    const dailyDistribution = volume7d / 7;

    const projectedDaily = dailyDistribution * holdingsRatio;
    const projectedWeekly = projectedDaily * 7;
    const projectedMonthly = projectedDaily * 30;
    const projectedYearly = projectedDaily * 365;

    // Calculate average distribution size and frequency
    const avgDistributionSize = distributions.length > 0
      ? history.totalDistributed / distributions.length
      : 0;
    const distributionsPerDay = daysActive > 0
      ? distributions.length / daysActive
      : 0;

    // Get printer status
    const printer = getPrinterStatus(rate7d);

    const response: FedFundsRateResponse = {
      rate7d,
      rate30d,
      rateAllTime,
      volume24h: Math.round(volume24h * 100) / 100,
      volume7d: Math.round(volume7d * 100) / 100,
      volume30d: Math.round(volume30d * 100) / 100,
      avgDistributionSize: Math.round(avgDistributionSize * 100) / 100,
      distributionsPerDay: Math.round(distributionsPerDay * 100) / 100,
      totalDistributed: Math.round(history.totalDistributed * 100) / 100,
      projectedDaily: Math.round(projectedDaily * 10000) / 10000,
      projectedWeekly: Math.round(projectedWeekly * 1000) / 1000,
      projectedMonthly: Math.round(projectedMonthly * 100) / 100,
      projectedYearly: Math.round(projectedYearly * 100) / 100,
      printerStatus: printer.status,
      printerIndicator: printer.indicator,
      lastUpdated: new Date().toISOString(),
      calculationMethod: 'Real yield from trading fees - no inflation, no promises',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error calculating Fed Funds Rate:', error);
    return NextResponse.json(
      { error: 'Failed to calculate Fed Funds Rate' },
      { status: 500 }
    );
  }
}
