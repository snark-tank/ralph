/**
 * Fed Treasury Buyback & Burn Mechanism
 *
 * Uses Jupiter Ultra Swap API to buy back $FED with accumulated USD1,
 * then burns the purchased tokens by sending to a dead address.
 *
 * Inspired by Uniswap's UNIfication event where they burned 100M UNI
 * using protocol fee revenue.
 *
 * Usage:
 *   npx ts-node treasury-buyback.ts --amount 100       # Buy back $100 worth
 *   npx ts-node treasury-buyback.ts --percent 10       # Buy back 10% of balance
 *   npx ts-node treasury-buyback.ts --status           # Show buyback stats
 *   npx ts-node treasury-buyback.ts --simulate 50      # Simulate $50 buyback
 */

import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
    createBurnInstruction,
    getAccount,
    getMint,
} from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Token addresses
const USD1_MINT = 'USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB';
const FED_MINT = '132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed';

// Jupiter Ultra Swap API
const JUPITER_ULTRA_ORDER_API = 'https://api.jup.ag/ultra/v1/order';
const JUPITER_ULTRA_EXECUTE_API = 'https://api.jup.ag/ultra/v1/execute';
const JUPITER_API_KEY = '86a2564b-34e7-47a9-b6ba-6d99852ea252';

// Burn address - using Solana's standard burn pattern (transfer to null/dead address)
// For SPL tokens, the proper way is to use the burn instruction which reduces supply
const BURN_ADDRESS = '1111111111111111111111111111111111111111111';

// Data file for tracking buyback history
const BUYBACK_DATA_FILE = path.join(__dirname, 'buyback-data.json');

// Buyback data structure
interface BuybackRecord {
    timestamp: string;
    usd1Spent: number;
    fedBought: number;
    fedBurned: number;
    txSignature: string;
    burnSignature?: string;
    priceImpact: number;
    effectivePrice: number; // USD1 per FED
}

interface BuybackData {
    lastUpdated: string;
    settings: {
        enabled: boolean;
        defaultSlippage: number; // basis points
        minBuybackAmount: number; // minimum USD1 to trigger buyback
        maxBuybackPercent: number; // max % of balance to use per buyback
    };
    stats: {
        totalUsd1Spent: number;
        totalFedBought: number;
        totalFedBurned: number;
        buybackCount: number;
        averagePrice: number;
        lastBuybackAt: string | null;
    };
    history: BuybackRecord[];
}

// Load buyback data
function loadBuybackData(): BuybackData {
    try {
        if (fs.existsSync(BUYBACK_DATA_FILE)) {
            return JSON.parse(fs.readFileSync(BUYBACK_DATA_FILE, 'utf-8'));
        }
    } catch (error) {
        console.warn('Could not load buyback data, creating new file');
    }

    return {
        lastUpdated: new Date().toISOString(),
        settings: {
            enabled: true,
            defaultSlippage: 100, // 1%
            minBuybackAmount: 10, // $10 minimum
            maxBuybackPercent: 50, // max 50% of balance per buyback
        },
        stats: {
            totalUsd1Spent: 0,
            totalFedBought: 0,
            totalFedBurned: 0,
            buybackCount: 0,
            averagePrice: 0,
            lastBuybackAt: null,
        },
        history: [],
    };
}

// Save buyback data
function saveBuybackData(data: BuybackData): void {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(BUYBACK_DATA_FILE, JSON.stringify(data, null, 2));
}

// Jupiter Ultra Swap interfaces
interface UltraSwapOrder {
    requestId: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    otherAmountThreshold: string;
    swapType: string;
    priceImpactPct: string;
    transaction: string;
    expireAt: number;
}

interface UltraSwapExecuteResult {
    signature: string;
    status: string;
    inputAmountResult: string;
    outputAmountResult: string;
}

// Get Jupiter Ultra Swap order
async function getUltraSwapOrder(
    amountInLamports: number,
    takerPublicKey: string,
    slippageBps: number = 100
): Promise<UltraSwapOrder | null> {
    try {
        const response = await fetch(JUPITER_ULTRA_ORDER_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': JUPITER_API_KEY,
            },
            body: JSON.stringify({
                inputMint: USD1_MINT,
                outputMint: FED_MINT,
                amount: amountInLamports.toString(),
                taker: takerPublicKey,
                slippageBps: slippageBps,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`Jupiter Ultra order failed: ${response.status} - ${errorText}`);
            return null;
        }

        return await response.json() as UltraSwapOrder;
    } catch (error) {
        console.log(`Jupiter Ultra order error: ${error}`);
        return null;
    }
}

// Execute Ultra Swap order
async function executeUltraSwapOrder(
    requestId: string,
    signedTransaction: string
): Promise<UltraSwapExecuteResult | null> {
    try {
        const response = await fetch(JUPITER_ULTRA_EXECUTE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': JUPITER_API_KEY,
            },
            body: JSON.stringify({
                requestId: requestId,
                signedTransaction: signedTransaction,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`Jupiter Ultra execute failed: ${response.status} - ${errorText}`);
            return null;
        }

        return await response.json() as UltraSwapExecuteResult;
    } catch (error) {
        console.log(`Jupiter Ultra execute error: ${error}`);
        return null;
    }
}

// Get a quote without executing (for simulation)
async function getQuote(usd1Amount: number, slippageBps: number): Promise<{
    fedAmount: number;
    priceImpact: number;
    effectivePrice: number;
} | null> {
    const amountLamports = Math.floor(usd1Amount * 1e6);

    // Use a dummy public key for quote (won't execute)
    const dummyPubkey = 'DmfXmFVMGAEdpHUwrmb3DRwqmBGjzS1Yzv3abiXQCHUi';

    const order = await getUltraSwapOrder(amountLamports, dummyPubkey, slippageBps);

    if (!order) {
        return null;
    }

    const fedAmount = Number(order.outAmount) / 1e6;
    const priceImpact = parseFloat(order.priceImpactPct || '0');
    const effectivePrice = usd1Amount / fedAmount;

    return {
        fedAmount,
        priceImpact,
        effectivePrice,
    };
}

// Execute buyback: USD1 -> $FED
async function executeBuyback(
    connection: Connection,
    treasuryKeypair: Keypair,
    usd1Amount: number,
    slippageBps: number
): Promise<{ success: boolean; fedBought: number; signature: string; priceImpact: number; effectivePrice: number } | null> {
    const amountLamports = Math.floor(usd1Amount * 1e6);

    console.log(`\n   Getting Ultra Swap order for $${usd1Amount.toFixed(2)} USD1...`);

    const order = await getUltraSwapOrder(
        amountLamports,
        treasuryKeypair.publicKey.toBase58(),
        slippageBps
    );

    if (!order || !order.transaction) {
        console.log('   Could not get Ultra Swap order');
        return null;
    }

    const fedOutput = Number(order.outAmount) / 1e6;
    const priceImpact = parseFloat(order.priceImpactPct || '0');
    const effectivePrice = usd1Amount / fedOutput;

    console.log(`   Quote: $${usd1Amount.toFixed(2)} USD1 -> ${fedOutput.toLocaleString()} $FED`);
    console.log(`   Price impact: ${priceImpact.toFixed(4)}%`);
    console.log(`   Effective price: $${effectivePrice.toFixed(8)} per $FED`);

    // Sign and execute
    console.log(`   Executing swap via Jupiter Ultra...`);

    const swapTxBuffer = Buffer.from(order.transaction, 'base64');
    const swapTx = Transaction.from(swapTxBuffer);
    swapTx.sign(treasuryKeypair);
    const signedTxBase64 = swapTx.serialize().toString('base64');

    const executeResult = await executeUltraSwapOrder(order.requestId, signedTxBase64);

    if (!executeResult || executeResult.status !== 'Success') {
        // Fall back to direct send
        console.log(`   Ultra execute returned ${executeResult?.status || 'null'}, trying direct send...`);

        try {
            const signature = await connection.sendRawTransaction(swapTx.serialize(), {
                skipPreflight: false,
                preflightCommitment: 'confirmed',
                maxRetries: 3,
            });

            const confirmation = await connection.confirmTransaction(signature, 'confirmed');
            if (confirmation.value.err) {
                console.log(`   Direct send failed: ${JSON.stringify(confirmation.value.err)}`);
                return null;
            }

            return {
                success: true,
                fedBought: fedOutput,
                signature: signature,
                priceImpact,
                effectivePrice,
            };
        } catch (error) {
            console.log(`   Direct send error: ${error}`);
            return null;
        }
    }

    const actualFedReceived = Number(executeResult.outputAmountResult) / 1e6;

    return {
        success: true,
        fedBought: actualFedReceived,
        signature: executeResult.signature,
        priceImpact,
        effectivePrice: usd1Amount / actualFedReceived,
    };
}

// Burn $FED tokens
async function burnFedTokens(
    connection: Connection,
    treasuryKeypair: Keypair,
    fedAmount: number
): Promise<{ success: boolean; signature: string } | null> {
    try {
        const fedMint = new PublicKey(FED_MINT);
        const fedTokenProgram = TOKEN_PROGRAM_ID;

        // Get treasury's $FED token account
        const treasuryFedAccount = getAssociatedTokenAddressSync(
            fedMint,
            treasuryKeypair.publicKey,
            false,
            fedTokenProgram,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        // Verify we have the tokens
        const accountInfo = await getAccount(connection, treasuryFedAccount, 'confirmed', fedTokenProgram);
        const currentBalance = Number(accountInfo.amount) / 1e6;

        if (currentBalance < fedAmount) {
            console.log(`   Insufficient $FED balance: ${currentBalance.toLocaleString()} < ${fedAmount.toLocaleString()}`);
            return null;
        }

        // Create burn transaction
        const burnTx = new Transaction();
        const { blockhash } = await connection.getLatestBlockhash();
        burnTx.recentBlockhash = blockhash;
        burnTx.feePayer = treasuryKeypair.publicKey;

        const amountLamports = Math.floor(fedAmount * 1e6);

        // Use the SPL burn instruction - this permanently removes tokens from supply
        burnTx.add(
            createBurnInstruction(
                treasuryFedAccount,
                fedMint,
                treasuryKeypair.publicKey,
                amountLamports,
                [],
                fedTokenProgram
            )
        );

        console.log(`   Burning ${fedAmount.toLocaleString()} $FED...`);

        const signature = await sendAndConfirmTransaction(
            connection,
            burnTx,
            [treasuryKeypair],
            { skipPreflight: false, commitment: 'confirmed' }
        );

        return {
            success: true,
            signature,
        };
    } catch (error) {
        console.log(`   Burn error: ${error}`);
        return null;
    }
}

// Get treasury balances
async function getTreasuryBalances(
    connection: Connection,
    treasuryPubkey: PublicKey
): Promise<{ usd1Balance: number; fedBalance: number }> {
    const usd1Mint = new PublicKey(USD1_MINT);
    const fedMint = new PublicKey(FED_MINT);

    let usd1Balance = 0;
    let fedBalance = 0;

    try {
        // USD1 uses regular TOKEN_PROGRAM_ID
        const usd1Account = getAssociatedTokenAddressSync(
            usd1Mint,
            treasuryPubkey,
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );
        const usd1Info = await getAccount(connection, usd1Account, 'confirmed', TOKEN_PROGRAM_ID);
        usd1Balance = Number(usd1Info.amount) / 1e6;
    } catch (error) {
        // Account may not exist
    }

    try {
        // $FED uses regular SPL
        const fedAccount = getAssociatedTokenAddressSync(
            fedMint,
            treasuryPubkey,
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );
        const fedInfo = await getAccount(connection, fedAccount, 'confirmed', TOKEN_PROGRAM_ID);
        fedBalance = Number(fedInfo.amount) / 1e6;
    } catch (error) {
        // Account may not exist
    }

    return { usd1Balance, fedBalance };
}

// Show buyback stats
function showStats(data: BuybackData): void {
    console.log('\n========================================');
    console.log('FED TREASURY BUYBACK & BURN STATS');
    console.log('========================================\n');

    console.log('Settings:');
    console.log(`   Enabled: ${data.settings.enabled ? 'YES' : 'NO'}`);
    console.log(`   Default slippage: ${data.settings.defaultSlippage / 100}%`);
    console.log(`   Min buyback amount: $${data.settings.minBuybackAmount}`);
    console.log(`   Max buyback percent: ${data.settings.maxBuybackPercent}%`);

    console.log('\nAll-Time Stats:');
    console.log(`   Total USD1 spent: $${data.stats.totalUsd1Spent.toFixed(2)}`);
    console.log(`   Total $FED bought: ${data.stats.totalFedBought.toLocaleString()}`);
    console.log(`   Total $FED burned: ${data.stats.totalFedBurned.toLocaleString()}`);
    console.log(`   Total buybacks: ${data.stats.buybackCount}`);
    console.log(`   Average price: $${data.stats.averagePrice.toFixed(8)} per $FED`);
    console.log(`   Last buyback: ${data.stats.lastBuybackAt || 'Never'}`);

    if (data.history.length > 0) {
        console.log('\nRecent Buybacks:');
        const recent = data.history.slice(-5).reverse();
        for (const record of recent) {
            const date = new Date(record.timestamp).toLocaleDateString();
            console.log(`   ${date}: $${record.usd1Spent.toFixed(2)} -> ${record.fedBurned.toLocaleString()} $FED burned (${record.txSignature.slice(0, 12)}...)`);
        }
    }

    console.log('\n========================================\n');
}

// Main function
async function main(): Promise<void> {
    const args = process.argv.slice(2);

    // Load buyback data
    const data = loadBuybackData();

    // Handle --status flag
    if (args.includes('--status') || args.includes('-s')) {
        showStats(data);
        return;
    }

    // Handle --simulate flag
    const simulateIndex = args.indexOf('--simulate');
    if (simulateIndex !== -1) {
        const amount = parseFloat(args[simulateIndex + 1] || '100');
        console.log(`\nSimulating buyback of $${amount} USD1...\n`);

        const quote = await getQuote(amount, data.settings.defaultSlippage);
        if (quote) {
            console.log('Quote Results:');
            console.log(`   Input: $${amount.toFixed(2)} USD1`);
            console.log(`   Output: ${quote.fedAmount.toLocaleString()} $FED`);
            console.log(`   Price impact: ${quote.priceImpact.toFixed(4)}%`);
            console.log(`   Effective price: $${quote.effectivePrice.toFixed(8)} per $FED`);
            console.log(`\nNote: This is a simulation only. No tokens were swapped.`);
        } else {
            console.log('Could not get quote. Check Jupiter API status.');
        }
        return;
    }

    // Load treasury keypair
    let treasuryKeypair: Keypair;
    try {
        const keyData = JSON.parse(fs.readFileSync('keypair_distro.json', 'utf-8'));
        treasuryKeypair = Keypair.fromSecretKey(new Uint8Array(keyData));
    } catch (error) {
        console.error('Could not load treasury keypair from keypair_distro.json');
        process.exit(1);
    }

    // Create connection
    const connection = new Connection(
        'https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6',
        'confirmed'
    );

    // Get treasury balances
    const balances = await getTreasuryBalances(connection, treasuryKeypair.publicKey);

    console.log('\n========================================');
    console.log('FED TREASURY BUYBACK & BURN');
    console.log('========================================\n');
    console.log(`Treasury: ${treasuryKeypair.publicKey.toBase58()}`);
    console.log(`USD1 Balance: $${balances.usd1Balance.toFixed(2)}`);
    console.log(`$FED Balance: ${balances.fedBalance.toLocaleString()}`);

    // Determine buyback amount
    let buybackAmount = 0;

    const amountIndex = args.indexOf('--amount');
    const percentIndex = args.indexOf('--percent');

    if (amountIndex !== -1) {
        buybackAmount = parseFloat(args[amountIndex + 1] || '0');
    } else if (percentIndex !== -1) {
        const percent = parseFloat(args[percentIndex + 1] || '10');
        buybackAmount = balances.usd1Balance * (percent / 100);
        console.log(`\nUsing ${percent}% of balance: $${buybackAmount.toFixed(2)}`);
    } else {
        console.log('\nUsage:');
        console.log('  npx ts-node treasury-buyback.ts --amount 100     # Buy back $100 worth');
        console.log('  npx ts-node treasury-buyback.ts --percent 10    # Buy back 10% of balance');
        console.log('  npx ts-node treasury-buyback.ts --simulate 50   # Simulate $50 buyback');
        console.log('  npx ts-node treasury-buyback.ts --status        # Show stats');
        return;
    }

    // Validate amount
    if (buybackAmount < data.settings.minBuybackAmount) {
        console.log(`\nBuyback amount ($${buybackAmount.toFixed(2)}) is below minimum ($${data.settings.minBuybackAmount})`);
        return;
    }

    if (buybackAmount > balances.usd1Balance) {
        console.log(`\nInsufficient USD1 balance. Have: $${balances.usd1Balance.toFixed(2)}, Need: $${buybackAmount.toFixed(2)}`);
        return;
    }

    const maxAmount = balances.usd1Balance * (data.settings.maxBuybackPercent / 100);
    if (buybackAmount > maxAmount) {
        console.log(`\nBuyback amount exceeds ${data.settings.maxBuybackPercent}% limit. Max: $${maxAmount.toFixed(2)}`);
        buybackAmount = maxAmount;
        console.log(`Adjusted to: $${buybackAmount.toFixed(2)}`);
    }

    console.log(`\nProceeding with buyback of $${buybackAmount.toFixed(2)} USD1...`);

    // Step 1: Execute buyback (USD1 -> $FED)
    console.log('\n--- STEP 1: BUYBACK ---');
    const buybackResult = await executeBuyback(
        connection,
        treasuryKeypair,
        buybackAmount,
        data.settings.defaultSlippage
    );

    if (!buybackResult || !buybackResult.success) {
        console.log('\nBuyback failed. No tokens were swapped.');
        return;
    }

    console.log(`\n   Buyback successful!`);
    console.log(`   Bought: ${buybackResult.fedBought.toLocaleString()} $FED`);
    console.log(`   TX: ${buybackResult.signature}`);

    // Step 2: Burn the purchased $FED
    console.log('\n--- STEP 2: BURN ---');

    // Wait a moment for the swap to settle
    await new Promise(resolve => setTimeout(resolve, 2000));

    const burnResult = await burnFedTokens(
        connection,
        treasuryKeypair,
        buybackResult.fedBought
    );

    let fedBurned = 0;
    let burnSignature: string | undefined;

    if (burnResult && burnResult.success) {
        fedBurned = buybackResult.fedBought;
        burnSignature = burnResult.signature;
        console.log(`\n   Burn successful!`);
        console.log(`   Burned: ${fedBurned.toLocaleString()} $FED`);
        console.log(`   TX: ${burnSignature}`);
    } else {
        console.log(`\n   Burn failed. $FED tokens remain in treasury.`);
        console.log(`   You can manually burn later or they will be included in the next buyback.`);
    }

    // Record the buyback
    const record: BuybackRecord = {
        timestamp: new Date().toISOString(),
        usd1Spent: buybackAmount,
        fedBought: buybackResult.fedBought,
        fedBurned: fedBurned,
        txSignature: buybackResult.signature,
        burnSignature: burnSignature,
        priceImpact: buybackResult.priceImpact,
        effectivePrice: buybackResult.effectivePrice,
    };

    // Update stats
    data.stats.totalUsd1Spent += buybackAmount;
    data.stats.totalFedBought += buybackResult.fedBought;
    data.stats.totalFedBurned += fedBurned;
    data.stats.buybackCount++;
    data.stats.lastBuybackAt = new Date().toISOString();

    // Calculate running average price
    if (data.stats.totalFedBought > 0) {
        data.stats.averagePrice = data.stats.totalUsd1Spent / data.stats.totalFedBought;
    }

    data.history.push(record);

    // Keep only last 100 records
    if (data.history.length > 100) {
        data.history = data.history.slice(-100);
    }

    saveBuybackData(data);

    // Final summary
    console.log('\n========================================');
    console.log('BUYBACK & BURN COMPLETE');
    console.log('========================================');
    console.log(`USD1 spent: $${buybackAmount.toFixed(2)}`);
    console.log(`$FED bought: ${buybackResult.fedBought.toLocaleString()}`);
    console.log(`$FED burned: ${fedBurned.toLocaleString()}`);
    console.log(`Price impact: ${buybackResult.priceImpact.toFixed(4)}%`);
    console.log(`Effective price: $${buybackResult.effectivePrice.toFixed(8)} per $FED`);
    console.log('\nAll-Time Totals:');
    console.log(`   Total USD1 spent: $${data.stats.totalUsd1Spent.toFixed(2)}`);
    console.log(`   Total $FED burned: ${data.stats.totalFedBurned.toLocaleString()}`);
    console.log('========================================\n');
}

// Run
main().catch(console.error);
