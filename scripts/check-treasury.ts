import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

async function main() {
  const conn = new Connection('https://api.mainnet-beta.solana.com');
  const USD1 = new PublicKey('EKiMq8cRXg7LkTwBPGPhVU6PnVdBmqbJb6MhPCNsJXUf');
  const treasury = new PublicKey('4Br5iKfRkYMk8WMj6w8YASynuq7Eoas16rkyvWsAdL4P');
  const ata = await getAssociatedTokenAddress(USD1, treasury);
  const balance = await conn.getTokenAccountBalance(ata);
  console.log('Treasury USD1 Balance:', balance.value.uiAmount);
}

main().catch(console.error);
