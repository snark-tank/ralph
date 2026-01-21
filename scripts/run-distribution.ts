/**
 * Unified Fee Collection + Distribution Script
 *
 * This script runs the full distribution flow:
 * 1. Collect fees from all Meteora DAMM v2 positions containing $FED
 * 2. Distribute collected USD1 to all $FED holders proportionally
 *
 * Usage: npx ts-node run-distribution.ts [--collect-only] [--distribute-only] [--dry-run]
 */

import {
    Connection,
    PublicKey,
    Keypair
} from '@solana/web3.js';
import {
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    getAccount
} from '@solana/spl-token';
import { CpAmm } from '@meteora-ag/cp-amm-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FED_TOKEN_MINT = new PublicKey('132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed');
const USD1_TOKEN_MINT = new PublicKey('USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB');
const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6';
const KEYPAIR_PATH = 'keypair_distro.json';
const LOG_DIR = path.join(__dirname, 'distribution-logs');
const MIN_DISTRIBUTION_BALANCE = 10; // Minimum USD1 balance required to trigger distribution

// Parse command line arguments
interface RunOptions {
    collectOnly: boolean;
    distributeOnly: boolean;
    dryRun: boolean;
}

function parseArgs(): RunOptions {
    const args = process.argv.slice(2);
    return {
        collectOnly: args.includes('--collect-only'),
        distributeOnly: args.includes('--distribute-only'),
        dryRun: args.includes('--dry-run')
    };
}

// Unified logger for the entire run
class UnifiedLogger {
    private logFile: string;
    private startTime: number;

    constructor() {
        if (!fs.existsSync(LOG_DIR)) {
            fs.mkdirSync(LOG_DIR, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        this.logFile = path.join(LOG_DIR, `unified-run-${timestamp}.log`);
        this.startTime = Date.now();
        this.writeToFile('='.repeat(70));
        this.writeToFile('UNIFIED FEE COLLECTION + DISTRIBUTION RUN');
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

// Detect token program (SPL vs Token2022)
async function detectTokenProgram(connection: Connection, mint: PublicKey): Promise<PublicKey> {
    const mintInfo = await connection.getAccountInfo(mint);
    if (mintInfo && mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) {
        return TOKEN_2022_PROGRAM_ID;
    }
    return TOKEN_PROGRAM_ID;
}

// Get USD1 balance for the wallet
async function getUsd1Balance(
    connection: Connection,
    wallet: PublicKey,
    logger: UnifiedLogger
): Promise<number> {
    try {
        const tokenProgram = await detectTokenProgram(connection, USD1_TOKEN_MINT);
        const tokenAccount = getAssociatedTokenAddressSync(
            USD1_TOKEN_MINT,
            wallet,
            false,
            tokenProgram,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const account = await getAccount(connection, tokenAccount, 'confirmed', tokenProgram);
        const balance = Number(account.amount) / Math.pow(10, 6); // USD1 has 6 decimals
        return balance;
    } catch (error: unknown) {
        const err = error as Error;
        logger.warn(`Could not fetch USD1 balance: ${err.message}`);
        return 0;
    }
}

// Phase 1: Collect fees from Meteora positions
async function collectFees(
    connection: Connection,
    keypair: Keypair,
    logger: UnifiedLogger,
    dryRun: boolean
): Promise<{ success: boolean; feesCollected: number; positionsFound: number }> {
    logger.section('PHASE 1: FEE COLLECTION');

    const result = {
        success: true,
        feesCollected: 0,
        positionsFound: 0
    };

    try {
        // Get initial USD1 balance
        const initialBalance = await getUsd1Balance(connection, keypair.publicKey, logger);
        logger.log(`Initial USD1 balance: ${initialBalance.toLocaleString()}`);

        // Create CP AMM instance
        const cpAmm = new CpAmm(connection);
        logger.log('Searching for Meteora DAMM v2 positions...');

        // Find all positions owned by this wallet
        interface PositionState {
            pool: PublicKey;
            feeAOwed?: bigint;
            unclaimedFeeA?: bigint;
            feeOwedA?: bigint;
            feeBOwed?: bigint;
            unclaimedFeeB?: bigint;
            feeOwedB?: bigint;
        }

        interface PositionData {
            position: PublicKey;
            positionNftAccount: PublicKey;
            positionState: PositionState;
        }

        let allPositions: PositionData[] = [];
        try {
            allPositions = await cpAmm.getPositionsByUser(keypair.publicKey);
        } catch (error) {
            logger.warn('Error fetching positions with SDK, may have no positions');
            allPositions = [];
        }

        if (allPositions.length === 0) {
            logger.log('No Meteora DAMM v2 positions found for this wallet');
            return result;
        }

        logger.log(`Found ${allPositions.length} total position(s)`);

        // Filter positions that involve $FED token
        interface FedPosition {
            positionAddress: PublicKey;
            positionNftAccount: PublicKey;
            poolAddress: PublicKey;
            tokenAMint: PublicKey;
            tokenBMint: PublicKey;
            unclaimedFeeA: bigint;
            unclaimedFeeB: bigint;
        }

        const fedPositions: FedPosition[] = [];

        for (const pos of allPositions) {
            const positionState = pos.positionState;
            const poolAddress = positionState.pool;

            // Fetch pool state to get token mints
            interface PoolState {
                tokenAMint: PublicKey;
                tokenBMint: PublicKey;
                tokenAVault: PublicKey;
                tokenBVault: PublicKey;
            }

            let poolState: PoolState;
            try {
                poolState = await cpAmm.fetchPoolState(poolAddress);
            } catch (error) {
                logger.warn(`Could not fetch pool state for position ${pos.position.toBase58()}, skipping`);
                continue;
            }

            const tokenAMint = poolState.tokenAMint;
            const tokenBMint = poolState.tokenBMint;
            const hasFed = tokenAMint.equals(FED_TOKEN_MINT) || tokenBMint.equals(FED_TOKEN_MINT);

            // Note: Actual claimable fees are calculated from checkpoints by the SDK
            // feeAPending/feeBPending may show 0 but fees can still be claimable

            logger.log(`  Position: ${pos.position.toBase58().slice(0, 12)}...`);
            logger.log(`    Pool: ${poolAddress.toBase58().slice(0, 12)}...`);
            logger.log(`    Contains $FED: ${hasFed ? 'YES' : 'No'}`);

            if (hasFed) {
                fedPositions.push({
                    positionAddress: pos.position,
                    positionNftAccount: pos.positionNftAccount,
                    poolAddress: poolAddress,
                    tokenAMint: tokenAMint,
                    tokenBMint: tokenBMint,
                    unclaimedFeeA: BigInt(0),
                    unclaimedFeeB: BigInt(0)
                });
            }
        }

        result.positionsFound = fedPositions.length;

        if (fedPositions.length === 0) {
            logger.log('No positions containing $FED token found');
            return result;
        }

        logger.log(`\nFound ${fedPositions.length} $FED position(s) to claim fees from`);

        if (dryRun) {
            logger.log('[DRY RUN] Would collect fees from these positions');
            return result;
        }

        // Collect fees from each position
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < fedPositions.length; i++) {
            const posInfo = fedPositions[i];
            logger.log(`\n[${i + 1}/${fedPositions.length}] Claiming from: ${posInfo.positionAddress.toBase58().slice(0, 16)}...`);

            try {
                // Detect token programs
                const tokenAProgram = await detectTokenProgram(connection, posInfo.tokenAMint);
                const tokenBProgram = await detectTokenProgram(connection, posInfo.tokenBMint);

                // Fetch pool state for vault addresses
                const poolState = await cpAmm.fetchPoolState(posInfo.poolAddress);

                // Build claim fee transaction
                const claimFeeParams = {
                    owner: keypair.publicKey,
                    pool: posInfo.poolAddress,
                    position: posInfo.positionAddress,
                    positionNftAccount: posInfo.positionNftAccount,
                    tokenAVault: poolState.tokenAVault,
                    tokenBVault: poolState.tokenBVault,
                    tokenAMint: posInfo.tokenAMint,
                    tokenBMint: posInfo.tokenBMint,
                    tokenAProgram: tokenAProgram,
                    tokenBProgram: tokenBProgram,
                    receiver: keypair.publicKey,
                    feePayer: keypair.publicKey
                };

                const claimFeeTx = await cpAmm.claimPositionFee2(claimFeeParams);

                // Get recent blockhash
                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

                // Set blockhash and sign
                if ('recentBlockhash' in claimFeeTx) {
                    claimFeeTx.recentBlockhash = blockhash;
                    claimFeeTx.feePayer = keypair.publicKey;
                    claimFeeTx.sign(keypair);
                }

                // Send transaction
                const signature = await connection.sendTransaction(claimFeeTx, [keypair], {
                    skipPreflight: false,
                    preflightCommitment: 'confirmed',
                    maxRetries: 3
                });

                logger.log(`   Sent: ${signature.slice(0, 20)}...`);

                // Wait for confirmation
                const confirmation = await connection.confirmTransaction({
                    signature,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (confirmation.value.err) {
                    logger.error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
                    failCount++;
                } else {
                    logger.success(`Fees claimed: https://solscan.io/tx/${signature}`);
                    successCount++;
                }

                // Small delay between transactions
                if (i < fedPositions.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (error: unknown) {
                const err = error as Error;
                logger.error(`Error: ${err.message}`);
                failCount++;
            }
        }

        // Get final balance and calculate fees collected
        const finalBalance = await getUsd1Balance(connection, keypair.publicKey, logger);
        result.feesCollected = finalBalance - initialBalance;

        logger.log(`\nFee Collection Summary:`);
        logger.log(`  Successful: ${successCount}`);
        logger.log(`  Failed: ${failCount}`);
        logger.log(`  USD1 collected: ${result.feesCollected.toLocaleString()}`);
        logger.log(`  Final USD1 balance: ${finalBalance.toLocaleString()}`);

        result.success = failCount === 0;
        return result;

    } catch (error: unknown) {
        const err = error as Error;
        logger.error(`Fee collection failed: ${err.message}`);
        result.success = false;
        return result;
    }
}

// Phase 2: Run distribution (imports and calls distribute-tokens.ts main)
async function runDistribution(
    logger: UnifiedLogger,
    dryRun: boolean
): Promise<{ success: boolean; distributed: number; recipients: number }> {
    logger.section('PHASE 2: TOKEN DISTRIBUTION');

    const result = {
        success: true,
        distributed: 0,
        recipients: 0
    };

    if (dryRun) {
        logger.log('[DRY RUN] Would run distribution to $FED holders');
        return result;
    }

    try {
        // Dynamically import and run the distribution script
        // We use child_process to keep logs separate and handle errors cleanly
        const { spawn } = await import('child_process');

        return new Promise((resolve) => {
            logger.log('Starting distribution script...\n');

            const distributionProcess = spawn('npx', ['tsx', 'distribute-tokens.ts'], {
                cwd: __dirname,
                stdio: ['inherit', 'pipe', 'pipe']
            });

            let stdout = '';
            let stderr = '';

            distributionProcess.stdout?.on('data', (data: Buffer) => {
                const text = data.toString();
                stdout += text;
                // Output in real-time
                process.stdout.write(text);
            });

            distributionProcess.stderr?.on('data', (data: Buffer) => {
                const text = data.toString();
                stderr += text;
                process.stderr.write(text);
            });

            distributionProcess.on('close', (code: number | null) => {
                if (code === 0) {
                    logger.success('Distribution completed successfully');

                    // Try to parse results from output
                    const distributedMatch = stdout.match(/Successfully distributed: ([\d.]+)/);
                    const recipientsMatch = stdout.match(/Recipients: (\d+)/);

                    if (distributedMatch) {
                        result.distributed = parseFloat(distributedMatch[1]);
                    }
                    if (recipientsMatch) {
                        result.recipients = parseInt(recipientsMatch[1]);
                    }

                    result.success = true;
                } else {
                    logger.error(`Distribution script exited with code ${code}`);
                    result.success = false;
                }
                resolve(result);
            });

            distributionProcess.on('error', (err: Error) => {
                logger.error(`Failed to start distribution: ${err.message}`);
                result.success = false;
                resolve(result);
            });
        });

    } catch (error: unknown) {
        const err = error as Error;
        logger.error(`Distribution failed: ${err.message}`);
        result.success = false;
        return result;
    }
}

// Main entry point
async function main() {
    const options = parseArgs();
    const logger = new UnifiedLogger();

    logger.log(`\nOptions: collect-only=${options.collectOnly}, distribute-only=${options.distributeOnly}, dry-run=${options.dryRun}`);

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
        logger.log(`RPC: ${RPC_ENDPOINT.split('?')[0]}...`);

        let feeResult = { success: true, feesCollected: 0, positionsFound: 0 };
        let distResult = { success: true, distributed: 0, recipients: 0 };

        // Phase 1: Collect fees (unless --distribute-only)
        if (!options.distributeOnly) {
            feeResult = await collectFees(connection, keypair, logger, options.dryRun);

            if (!feeResult.success && !options.collectOnly) {
                logger.warn('Fee collection had errors, but continuing to distribution...');
            }
        }

        // Phase 2: Distribute (unless --collect-only)
        if (!options.collectOnly) {
            // Check if balance meets minimum threshold
            const currentBalance = await getUsd1Balance(connection, keypair.publicKey, logger);

            if (currentBalance < MIN_DISTRIBUTION_BALANCE) {
                logger.log(`\n⏭️ Skipping distribution: USD1 balance (${currentBalance.toFixed(2)}) is below minimum threshold (${MIN_DISTRIBUTION_BALANCE})`);
                logger.log(`   Will distribute when balance reaches ${MIN_DISTRIBUTION_BALANCE} USD1`);
            } else {
                // Small delay between phases
                if (!options.distributeOnly) {
                    logger.log('\nWaiting 3 seconds before distribution...');
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }

                distResult = await runDistribution(logger, options.dryRun);
            }
        }

        // Final Summary
        logger.section('FINAL SUMMARY');
        logger.log(`Fee Collection:`);
        logger.log(`  Positions found: ${feeResult.positionsFound}`);
        logger.log(`  USD1 collected: ${feeResult.feesCollected.toLocaleString()}`);
        logger.log(`  Status: ${feeResult.success ? '✅ SUCCESS' : '❌ ERRORS'}`);
        logger.log(`\nDistribution:`);
        logger.log(`  USD1 distributed: ${distResult.distributed.toLocaleString()}`);
        logger.log(`  Recipients: ${distResult.recipients}`);
        logger.log(`  Status: ${distResult.success ? '✅ SUCCESS' : '❌ ERRORS'}`);
        logger.log(`\nLog file: ${logger.getLogPath()}`);

        // Exit with appropriate code
        const overallSuccess = feeResult.success && distResult.success;
        if (!overallSuccess) {
            process.exit(1);
        }

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

// Run the script
main().catch(console.error);
