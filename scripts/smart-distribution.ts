/**
 * Smart Distribution Runner
 *
 * Intelligent distribution system that combines:
 * 1. Smart timing checks (network fees, thresholds, time-of-day)
 * 2. Fee collection from Meteora positions
 * 3. Token distribution to holders
 *
 * This script replaces the simple 2-minute cron with intelligent timing.
 *
 * Usage:
 *   npx ts-node smart-distribution.ts              # Run with smart timing
 *   npx ts-node smart-distribution.ts --force      # Force distribution regardless of timing
 *   npx ts-node smart-distribution.ts --dry-run    # Check conditions without executing
 */

import {
    Connection,
    PublicKey,
    Keypair
} from '@solana/web3.js';
import {
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    getAccount
} from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// Import smart timing module
import {
    makeTimingDecision,
    checkAndRecord,
    loadTimingData,
    saveTimingData,
    TimingDecision
} from './smart-timing.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6';
const KEYPAIR_PATH = path.join(__dirname, 'keypair_distro.json');
const USD1_TOKEN_MINT = new PublicKey('USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB');
const LOG_DIR = path.join(__dirname, 'distribution-logs');

// Parse command line arguments
interface RunOptions {
    force: boolean;
    dryRun: boolean;
}

function parseArgs(): RunOptions {
    const args = process.argv.slice(2);
    return {
        force: args.includes('--force'),
        dryRun: args.includes('--dry-run')
    };
}

// Logger for smart distribution runs
class SmartLogger {
    private logFile: string;
    private startTime: number;

    constructor() {
        if (!fs.existsSync(LOG_DIR)) {
            fs.mkdirSync(LOG_DIR, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        this.logFile = path.join(LOG_DIR, `smart-dist-${timestamp}.log`);
        this.startTime = Date.now();
        this.writeToFile('='.repeat(70));
        this.writeToFile('SMART DISTRIBUTION RUN');
        this.writeToFile(`Started: ${new Date().toISOString()}`);
        this.writeToFile('='.repeat(70));
    }

    private writeToFile(message: string): void {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
        const logLine = `[${elapsed}s] ${message}`;
        fs.appendFileSync(this.logFile, logLine + '\n');
    }

    log(message: string): void {
        this.writeToFile(message);
        console.log(message);
    }

    success(message: string): void {
        this.log(`✅ ${message}`);
    }

    error(message: string): void {
        this.log(`❌ ${message}`);
    }

    warn(message: string): void {
        this.log(`⚠️ ${message}`);
    }

    section(title: string): void {
        const line = '='.repeat(50);
        this.log(`\n${line}`);
        this.log(title);
        this.log(line);
    }

    getLogPath(): string {
        return this.logFile;
    }
}

// Get USD1 balance
async function getUsd1Balance(connection: Connection, wallet: PublicKey): Promise<number> {
    try {
        const tokenAccount = getAssociatedTokenAddressSync(
            USD1_TOKEN_MINT,
            wallet,
            false,
            TOKEN_2022_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const account = await getAccount(connection, tokenAccount, 'confirmed', TOKEN_2022_PROGRAM_ID);
        return Number(account.amount) / Math.pow(10, 6);
    } catch (error) {
        return 0;
    }
}

// Run the full distribution pipeline (collect fees + distribute)
async function runDistributionPipeline(
    logger: SmartLogger,
    dryRun: boolean
): Promise<{ success: boolean; distributed: number }> {
    const result = { success: false, distributed: 0 };

    if (dryRun) {
        logger.log('[DRY RUN] Would run full distribution pipeline');
        result.success = true;
        return result;
    }

    return new Promise((resolve) => {
        logger.log('Starting distribution pipeline (collect + distribute)...\n');

        const distributionProcess = spawn('npx', ['tsx', 'run-distribution.ts'], {
            cwd: __dirname,
            stdio: ['inherit', 'pipe', 'pipe']
        });

        let stdout = '';

        distributionProcess.stdout?.on('data', (data: Buffer) => {
            const text = data.toString();
            stdout += text;
            process.stdout.write(text);
        });

        distributionProcess.stderr?.on('data', (data: Buffer) => {
            process.stderr.write(data.toString());
        });

        distributionProcess.on('close', (code: number | null) => {
            if (code === 0) {
                logger.success('Distribution pipeline completed successfully');

                // Try to parse distributed amount from output
                const distributedMatch = stdout.match(/Successfully distributed: ([\d.]+)/);
                if (distributedMatch) {
                    result.distributed = parseFloat(distributedMatch[1]);
                }

                result.success = true;
            } else {
                logger.error(`Distribution pipeline exited with code ${code}`);
            }
            resolve(result);
        });

        distributionProcess.on('error', (err: Error) => {
            logger.error(`Failed to start distribution: ${err.message}`);
            resolve(result);
        });
    });
}

// Format timing decision for display
function formatDecision(decision: TimingDecision): string {
    const f = decision.factors;
    return [
        `   Balance:     $${f.balance.toFixed(2)}`,
        `   Threshold:   $${f.dynamicThreshold.toFixed(2)}`,
        `   Network:     ${f.networkStatus.toUpperCase()} (${f.priorityFee.toLocaleString()} micro-lamports)`,
        `   Peak Hour:   ${f.isPeakHour ? 'YES' : 'NO'}`,
        `   Holders:     ${f.holderCount}`,
        `   Since Last:  ${f.minutesSinceLastDistribution === Infinity ? 'N/A' : f.minutesSinceLastDistribution + ' min'}`,
        `   Decision:    ${decision.shouldDistribute ? 'DISTRIBUTE' : 'WAIT'}`,
        `   Reason:      ${decision.reason}`
    ].join('\n');
}

// Main function
async function main() {
    const options = parseArgs();
    const logger = new SmartLogger();

    logger.log(`Options: force=${options.force}, dry-run=${options.dryRun}`);

    try {
        // Load keypair
        if (!fs.existsSync(KEYPAIR_PATH)) {
            logger.error(`Keypair file not found: ${KEYPAIR_PATH}`);
            process.exit(1);
        }
        const keypairData = JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf-8'));
        const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
        logger.success(`Wallet loaded: ${keypair.publicKey.toBase58()}`);

        // Initialize connection
        const connection = new Connection(RPC_ENDPOINT, 'confirmed');

        // Load timing data
        const timingData = loadTimingData();

        logger.section('PHASE 1: SMART TIMING CHECK');

        // Make timing decision
        const decision = await makeTimingDecision(connection, keypair.publicKey, timingData);

        logger.log('\n📊 Current Conditions:');
        logger.log(formatDecision(decision));

        // Determine if we should distribute
        let shouldDistribute = decision.shouldDistribute;
        let skipReason = decision.reason;

        if (options.force) {
            logger.warn('\n⚡ FORCE MODE: Overriding timing decision');
            shouldDistribute = true;
            skipReason = 'Forced by --force flag';
        }

        // Record the decision
        const recordedDecision = await checkAndRecord(connection, keypair.publicKey, timingData);

        if (!shouldDistribute) {
            logger.section('DECISION: SKIP DISTRIBUTION');
            logger.log(`Reason: ${skipReason}`);
            logger.log('\n📈 Timing Stats:');
            logger.log(`   Total Decisions: ${timingData.stats.totalDecisions}`);
            logger.log(`   Triggered: ${timingData.stats.distributionsTriggered}`);
            logger.log(`   Skipped: ${timingData.stats.distributionsSkipped}`);
            logger.log(`\nLog file: ${logger.getLogPath()}`);
            process.exit(0);
        }

        logger.section('PHASE 2: RUNNING DISTRIBUTION');

        // Run the distribution pipeline
        const result = await runDistributionPipeline(logger, options.dryRun);

        // Update timing data with distribution time
        if (result.success && !options.dryRun) {
            timingData.lastDistribution = new Date().toISOString();
            saveTimingData(timingData);
        }

        logger.section('FINAL SUMMARY');
        logger.log(`Smart Timing: ✅ Conditions met`);
        logger.log(`Distribution: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
        if (result.distributed > 0) {
            logger.log(`Distributed: $${result.distributed.toFixed(2)} USD1`);
        }
        logger.log(`\n📈 Updated Timing Stats:`);
        logger.log(`   Total Decisions: ${timingData.stats.totalDecisions}`);
        logger.log(`   Triggered: ${timingData.stats.distributionsTriggered}`);
        logger.log(`   Skipped: ${timingData.stats.distributionsSkipped}`);
        logger.log(`\nLog file: ${logger.getLogPath()}`);

        process.exit(result.success ? 0 : 1);

    } catch (error: unknown) {
        const err = error as Error;
        logger.error(`Critical error: ${err.message}`);
        if (err.stack) {
            logger.log(`Stack: ${err.stack}`);
        }
        logger.log(`Log file: ${logger.getLogPath()}`);
        process.exit(1);
    }
}

// Run
main().catch(console.error);
