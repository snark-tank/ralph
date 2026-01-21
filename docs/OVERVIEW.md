# $FED - The Federal Reserve Token

## Ralph's Money Printer Operation

### What is $FED?

$FED is a Solana meme token that redistributes trading fees to holders in **USD1** (a stablecoin). Every buy/sell incurs an 8% tax that gets collected and distributed proportionally to all $FED holders.

Ralph acts as the **Federal Reserve Chairman** - controlling the money printer that goes BRRR.

---

## The Flywheel

```
Traders Buy/Sell $FED
        ↓
    8% Tax Collected
        ↓
  Fees Accumulate in LP
        ↓
  Ralph Collects Fees (USD1)
        ↓
  Ralph Distributes to Holders
        ↓
  Holders Happy, Buy More
        ↓
    (Repeat)
```

---

## How It Works

### 1. Fee Collection
- $FED trades on Meteora DAMM v2 pools
- 8% buy/sell tax generates USD1 fees in the pool
- Ralph runs `collect-dammv2-fees.ts` to claim fees from LP positions

### 2. Distribution
- Ralph runs `run-distribution.ts` every 2 minutes via PM2
- Script checks if USD1 balance >= $10 threshold
- If threshold met, distributes proportionally to all $FED holders
- Skips PDAs, pools, and blacklisted addresses
- Syncs stats to website via Redis API

### 3. Website Tracking
- https://fed.markets shows live distribution stats
- Baseline: $5,000 across 70 distributions (historical)
- New distributions sync in real-time via Redis

---

## Key Addresses

| Item | Address |
|------|---------|
| $FED Token | `132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed` |
| USD1 Token | `USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB` |
| Distribution Wallet | `4Br5iKfRkYMk8WMj6w8YASynuq7Eoas16rkyvWsAdL4P` |
| Meteora Pool | `8mLRmqBVfe91twjpCF3hqTtGNMJMsukhEd6GGjXpqs2i` |

---

## Current Stats (as of deployment)

- **Total Distributed:** $5,000+ USD1
- **Distributions Completed:** 70+
- **Holders Paid:** 250+
- **Distribution Frequency:** Every 2 minutes (when threshold met)
- **Minimum Threshold:** $10 USD1

---

## Ralph's Role

Ralph is the autonomous agent controlling the $FED money printer:

1. **Fee Collection** - Monitors and claims LP fees
2. **Distribution** - Sends USD1 to all eligible holders
3. **Website Sync** - Updates live stats on fed.markets
4. **Documentation** - Maintains this repo with updates

The money printer never stops. BRRR.
