import { Connection, PublicKey } from '@solana/web3.js';

async function main() {
  const conn = new Connection('https://mainnet.helius-rpc.com/?api-key=d009b341-8551-40fa-aa5e-bae4ce0c8cf6');
  const USD1 = new PublicKey('EKiMq8cRXg7LkTwBPGPhVU6PnVdBmqbJb6MhPCNsJXUf');
  const USD1_ALT = new PublicKey('USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB');
  const treasury = new PublicKey('4Br5iKfRkYMk8WMj6w8YASynuq7Eoas16rkyvWsAdL4P');
  
  console.log('=== Treasury Token Accounts ===');
  
  // Get all token accounts owned by treasury
  const tokenAccounts = await conn.getParsedTokenAccountsByOwner(treasury, {
    programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
  });
  
  console.log(`Found ${tokenAccounts.value.length} SPL token accounts:`);
  for (const account of tokenAccounts.value) {
    const parsed = account.account.data.parsed;
    console.log(`  Mint: ${parsed.info.mint}`);
    console.log(`  Balance: ${parsed.info.tokenAmount.uiAmount}`);
    console.log('');
  }
  
  // Also check Token2022 accounts
  const token2022Accounts = await conn.getParsedTokenAccountsByOwner(treasury, {
    programId: new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb')
  });
  
  console.log(`Found ${token2022Accounts.value.length} Token2022 accounts:`);
  for (const account of token2022Accounts.value) {
    const parsed = account.account.data.parsed;
    console.log(`  Mint: ${parsed.info.mint}`);
    console.log(`  Balance: ${parsed.info.tokenAmount.uiAmount}`);
    console.log('');
  }
}

main().catch(console.error);
