/**
 * Check Treasury Balance and $FED Price
 * Usage: npx tsx check-treasury.ts
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6';
const USD1_MINT = new PublicKey('USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB');
const FED_MINT = '132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed';
const TREASURY = new PublicKey('4Br5iKfRkYMk8WMj6w8YASynuq7Eoas16rkyvWsAdL4P');
const JUPITER_API_KEY = '86a2564b-34e7-47a9-b6ba-6d99852ea252';

async function main() {
    const conn = new Connection(HELIUS_RPC);

    // Check USD1 balance
    console.log('🏦 TREASURY STATUS\n');

    let usd1Balance = 0;
    try {
        const ata = await getAssociatedTokenAddress(USD1_MINT, TREASURY);
        const balance = await conn.getTokenAccountBalance(ata);
        usd1Balance = balance.value.uiAmount || 0;
        console.log(`💵 USD1 Balance: $${usd1Balance.toFixed(2)}`);
    } catch (e: any) {
        console.log('💵 USD1 Balance: $0.00 (no token account)');
    }

    // Check $FED price from Jupiter
    console.log('\n📊 $FED MARKET DATA\n');

    try {
        const response = await fetch(
            `https://api.jup.ag/tokens/v2/search?query=${FED_MINT}`,
            {
                headers: { 'x-api-key': JUPITER_API_KEY }
            }
        );
        const data = await response.json();

        if (data && data[0]) {
            const token = data[0];
            console.log(`💰 Price: $${token.usdPrice?.toFixed(8) || 'N/A'}`);
            console.log(`📈 Market Cap: $${token.mcap?.toLocaleString() || 'N/A'}`);
            console.log(`💧 Liquidity: $${token.liquidity?.toLocaleString() || 'N/A'}`);

            if (token.stats1h) {
                const change1h = token.stats1h.priceChange || 0;
                const arrow1h = change1h >= 0 ? '📈' : '📉';
                console.log(`${arrow1h} 1h Change: ${change1h >= 0 ? '+' : ''}${change1h.toFixed(2)}%`);
            }

            if (token.stats24h) {
                const change24h = token.stats24h.priceChange || 0;
                const arrow24h = change24h >= 0 ? '📈' : '📉';
                console.log(`${arrow24h} 24h Change: ${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`);

                const buyVol = token.stats24h.buyVolume || 0;
                const sellVol = token.stats24h.sellVolume || 0;
                console.log(`\n📊 24h Volume:`);
                console.log(`   Buy:  $${buyVol.toLocaleString()}`);
                console.log(`   Sell: $${sellVol.toLocaleString()}`);

                if (sellVol > buyVol * 1.5) {
                    console.log(`   ⚠️  Heavy sell pressure detected!`);
                }
            }

            // Decision recommendation
            console.log('\n💡 RECOMMENDATION:\n');

            const change1h = token.stats1h?.priceChange || 0;
            const change24h = token.stats24h?.priceChange || 0;
            const sellVol = token.stats24h?.sellVolume || 0;
            const buyVol = token.stats24h?.buyVolume || 0;

            if (usd1Balance < 10) {
                console.log('📥 COLLECT ONLY - Treasury balance too low (<$10)');
            } else if (change1h < -5 || change24h < -15 || sellVol > buyVol * 1.5) {
                console.log('🔄 BUYBACK - Price is down, consider supporting the floor');
            } else if (change1h > -2 && change24h > -5) {
                console.log('💸 DISTRIBUTE - Price is stable/up, reward holders');
            } else {
                console.log('⏸️  HOLD or COLLECT ONLY - Market uncertain, consider waiting');
            }
        } else {
            console.log('❌ Could not fetch $FED price data');
        }
    } catch (e: any) {
        console.log('❌ Error fetching price:', e.message);
    }
}

main().catch(console.error);
