# Technical Setup Guide

## Prerequisites

- Node.js 18+
- PM2 (`npm install -g pm2`)
- Solana CLI (optional)
- Access to Helius RPC

---

## Environment Variables

Create a `.env` file or export these:

```bash
# RPC
HELIUS_API_KEY=your_helius_api_key

# Website API
WEBSITE_API_URL=https://fed.markets/api/distributions
DISTRIBUTION_API_KEY=your_api_key

# Redis (for website)
REDIS_URL=redis://...your_redis_url...
```

---

## Directory Structure

```
fed/
├── script/
│   ├── run-distribution.ts      # Main orchestrator
│   ├── distribute-tokens.ts     # Distribution logic
│   ├── collect-dammv2-fees.ts   # Fee collection
│   └── keypair_distro.json      # Distribution wallet (KEEP SECRET)
├── src/
│   └── app/
│       └── api/
│           └── distributions/   # Website API
└── public/
    └── logo.png
```

---

## Running the Distribution

### Manual Run

```bash
cd /home/ubuntu/fed/script
npx ts-node run-distribution.ts
```

### With PM2 (Every 2 Minutes)

```bash
pm2 start "npx ts-node run-distribution.ts" --name fed-distribution --cwd /home/ubuntu/fed/script --cron-restart="*/2 * * * *" --no-autorestart
```

### PM2 Commands

```bash
pm2 logs fed-distribution    # View logs
pm2 status                   # Check status
pm2 stop fed-distribution    # Stop
pm2 restart fed-distribution # Restart
pm2 delete fed-distribution  # Remove
```

---

## Scripts Overview

### run-distribution.ts

Main orchestrator that:
1. Collects fees from Meteora DAMM v2 positions
2. Checks USD1 balance against threshold ($10)
3. If threshold met, runs distribution
4. Logs everything

**Options:**
- `--collect-only` - Only collect fees, don't distribute
- `--distribute-only` - Only distribute, skip fee collection
- `--dry-run` - Simulate without executing

### collect-dammv2-fees.ts

Standalone fee collector:
1. Finds all Meteora DAMM v2 positions for wallet
2. Filters positions containing $FED
3. Claims accumulated fees (USD1)

### distribute-tokens.ts

Distribution engine:
1. Fetches all $FED holders
2. Filters out pools, PDAs, blacklisted addresses
3. Calculates proportional amounts
4. Batches transactions (5 transfers per tx)
5. Sends with parallel processing
6. Syncs to website API

---

## Website Deployment

### Vercel Environment Variables

```
REDIS_URL=redis://...
DISTRIBUTION_API_KEY=your_key
```

### API Endpoints

**GET /api/distributions**
Returns distribution stats (baseline + live)

**POST /api/distributions**
Updates stats (called by distribution script)

---

## Monitoring

### Check Distribution Logs

```bash
tail -f /home/ubuntu/fed/script/distribution-logs/*.log
```

### Check PM2 Logs

```bash
pm2 logs fed-distribution --lines 100
```

### Check Website API

```bash
curl https://fed.markets/api/distributions | jq
```

---

## Troubleshooting

### "No fees to claim"
- Fees are calculated from checkpoints, not stored directly
- Script will attempt claim anyway (SDK handles calculation)

### "Balance below threshold"
- Wait for more fees to accumulate
- Or run with `--distribute-only` to force

### "Transaction failed"
- Check Solana network status
- Verify RPC endpoint is working
- Check wallet has enough SOL for fees

### ES Module Errors
- Ensure `fileURLToPath` imports are present
- Don't use `require()` or `__dirname` without polyfill

---

## Security Notes

1. **Never commit keypair_distro.json**
2. **Keep API keys in environment variables**
3. **Use .gitignore for sensitive files**
4. **Rotate keys periodically**

---

## Useful Commands

```bash
# Check $FED token holders
curl "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY" \
  -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getTokenAccounts","params":{"mint":"132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed"}}'

# Check wallet USD1 balance
spl-token balance USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB --owner 4Br5iKfRkYMk8WMj6w8YASynuq7Eoas16rkyvWsAdL4P

# View recent transactions
solana transaction-history 4Br5iKfRkYMk8WMj6w8YASynuq7Eoas16rkyvWsAdL4P --limit 10
```
