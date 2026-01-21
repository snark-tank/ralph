import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

async function main() {
  const conn = new Connection('https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6');
  const USD1 = new PublicKey('EKiMq8cRXg7LkTwBPGPhVU6PnVdBmqbJb6MhPCNsJXUf');
  const FED = new PublicKey('86RYQ7Nnye4cqSC8muJFu4p9S3ixYqajtTQ3HRZgaP7p');
  const treasury = new PublicKey('4Br5iKfRkYMk8WMj6w8YASynuq7Eoas16rkyvWsAdL4P');
  
  console.log('=== Treasury Status ===');
  console.log('Treasury Address:', treasury.toBase58());
  
  // Check USD1 ATA
  try {
    const usd1Ata = await getAssociatedTokenAddress(USD1, treasury);
    console.log('USD1 ATA:', usd1Ata.toBase58());
    const usd1Balance = await conn.getTokenAccountBalance(usd1Ata);
    console.log('Treasury USD1 Balance:', usd1Balance.value.uiAmount);
  } catch (e: any) {
    console.log('USD1 ATA: Does not exist (no balance)');
  }
  
  // Check FED ATA (for buyback holdings)
  try {
    const fedAta = await getAssociatedTokenAddress(FED, treasury);
    console.log('FED ATA:', fedAta.toBase58());
    const fedBalance = await conn.getTokenAccountBalance(fedAta);
    console.log('Treasury FED Balance:', fedBalance.value.uiAmount);
  } catch (e: any) {
    console.log('FED ATA: Does not exist (no balance)');
  }
  
  // Check SOL balance for gas
  const solBalance = await conn.getBalance(treasury);
  console.log('Treasury SOL Balance:', solBalance / 1e9);
}

main().catch(console.error);
