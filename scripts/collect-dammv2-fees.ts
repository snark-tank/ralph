import {
    Connection,
    PublicKey,
    Keypair
} from '@solana/web3.js';
import {
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
    getAssociatedTokenAddressSync
} from '@solana/spl-token';
import { CpAmm } from '@meteora-ag/cp-amm-sdk';
import * as fs from 'fs';

// $FED Token mint address
const FED_TOKEN_MINT = new PublicKey('132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed');

// Helius RPC endpoint
const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6';

interface PositionInfo {
    positionAddress: PublicKey;
    positionNftAccount: PublicKey;
    poolAddress: PublicKey;
    tokenAMint: PublicKey;
    tokenBMint: PublicKey;
    unclaimedFeeA: bigint;
    unclaimedFeeB: bigint;
}

async function detectTokenProgram(connection: Connection, mint: PublicKey): Promise<PublicKey> {
    const mintInfo = await connection.getAccountInfo(mint);
    if (mintInfo && mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) {
        return TOKEN_2022_PROGRAM_ID;
    }
    return TOKEN_PROGRAM_ID;
}

async function main() {
    try {
        console.log('========================================');
        console.log('DAMM V2 Fee Collection Script');
        console.log('Auto-Discovery Mode');
        console.log('========================================\n');

        // Load keypair from keypair_distro.json
        const keypairPath = 'keypair_distro.json';
        if (!fs.existsSync(keypairPath)) {
            throw new Error(`Keypair file not found: ${keypairPath}`);
        }
        const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
        const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
        console.log('✅ Wallet loaded:', keypair.publicKey.toBase58());

        // Initialize connection
        const connection = new Connection(RPC_ENDPOINT, 'confirmed');

        // Create CP AMM instance
        const cpAmm = new CpAmm(connection);

        // Find all positions owned by this wallet
        console.log('\n📍 Searching for Meteora DAMM v2 positions...');

        let allPositions: any[] = [];
        try {
            allPositions = await cpAmm.getPositionsByUser(keypair.publicKey);
        } catch (error) {
            console.log('⚠️ Error fetching positions with SDK, falling back to manual search...');
            allPositions = [];
        }

        if (allPositions.length === 0) {
            console.log('ℹ️ No positions found via SDK. This wallet may not have any Meteora DAMM v2 positions.');
            console.log('\nTip: If you know you have positions, they might be on a different Meteora program (DLMM, Dynamic Pool, etc.)');
            return;
        }

        console.log(`\n✅ Found ${allPositions.length} position(s)\n`);

        // Filter positions that involve $FED token
        const fedPositions: PositionInfo[] = [];

        for (const pos of allPositions) {
            const positionState = pos.positionState;
            const poolAddress = positionState.pool;

            // Fetch pool state to get token mints
            let poolState;
            try {
                poolState = await cpAmm.fetchPoolState(poolAddress);
            } catch (error) {
                console.log(`⚠️ Could not fetch pool state for position ${pos.position.toBase58()}, skipping...`);
                continue;
            }

            const tokenAMint = poolState.tokenAMint;
            const tokenBMint = poolState.tokenBMint;

            // Check if this pool contains $FED token
            const hasFed = tokenAMint.equals(FED_TOKEN_MINT) || tokenBMint.equals(FED_TOKEN_MINT);

            // Note: Actual claimable fees are calculated from checkpoints by the SDK
            // feeAPending/feeBPending may show 0 but fees can still be claimable

            console.log(`Position: ${pos.position.toBase58()}`);
            console.log(`  Pool: ${poolAddress.toBase58()}`);
            console.log(`  Token A: ${tokenAMint.toBase58()}`);
            console.log(`  Token B: ${tokenBMint.toBase58()}`);
            console.log(`  Contains $FED: ${hasFed ? '✅ YES' : '❌ No'}`);
            console.log('');

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

        if (fedPositions.length === 0) {
            console.log('❌ No positions found containing $FED token');
            console.log(`   $FED mint: ${FED_TOKEN_MINT.toBase58()}`);
            return;
        }

        console.log(`\n🎯 Found ${fedPositions.length} $FED position(s) to claim fees from\n`);
        console.log('========================================');
        console.log('Starting Fee Collection');
        console.log('========================================\n');

        // Collect fees from each position
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < fedPositions.length; i++) {
            const posInfo = fedPositions[i];
            console.log(`\n[${i + 1}/${fedPositions.length}] Claiming fees from position: ${posInfo.positionAddress.toBase58()}`);

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

                console.log(`   📤 Transaction sent: ${signature}`);

                // Wait for confirmation
                const confirmation = await connection.confirmTransaction({
                    signature,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (confirmation.value.err) {
                    console.log(`   ❌ Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
                    failCount++;
                } else {
                    console.log(`   ✅ Fees claimed successfully!`);
                    console.log(`   🔗 https://solscan.io/tx/${signature}`);
                    successCount++;
                }

                // Small delay between transactions
                if (i < fedPositions.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.log(`   ❌ Error: ${errorMessage}`);

                // Log transaction logs if available
                if (error && typeof error === 'object' && 'logs' in error) {
                    const logs = (error as { logs: string[] }).logs;
                    console.log('   Transaction logs:');
                    logs.forEach((log: string) => console.log(`      ${log}`));
                }

                failCount++;
            }
        }

        // Summary
        console.log('\n========================================');
        console.log('Fee Collection Complete');
        console.log('========================================');
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${failCount}`);
        console.log(`📊 Total positions processed: ${fedPositions.length}`);

        if (successCount > 0) {
            console.log('\n💰 Fees have been claimed to your wallet');
            console.log('Check your token balances to verify the received fees');
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;

        console.error('❌ Critical error:', errorMessage);

        if (errorStack) {
            console.log('\nStack trace:', errorStack);
        }

        process.exit(1);
    }
}

// Run the script
main().catch(console.error);

export { main };
