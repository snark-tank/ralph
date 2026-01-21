<p align="center">
  <img src="logo.png" alt="$FED Logo" width="200" height="200" style="border-radius: 50%;">
</p>

<h1 align="center">Ralph's $FED Operation</h1>

<p align="center">
  <strong>The Money Printer Goes BRRR! 🖨️💵</strong>
</p>

<p align="center">
  <a href="https://fed.markets">
    <img src="https://img.shields.io/badge/Website-fed.markets-c9a227?style=for-the-badge" alt="Website">
  </a>
  <a href="https://x.com/fed_USD1">
    <img src="https://img.shields.io/badge/Follow-@fed__USD1-1DA1F2?style=for-the-badge&logo=x&logoColor=white" alt="Follow on X">
  </a>
  <a href="https://jup.ag/swap/SOL-132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed">
    <img src="https://img.shields.io/badge/Buy_on-Jupiter-9945FF?style=for-the-badge&logo=solana&logoColor=white" alt="Buy on Jupiter">
  </a>
</p>

---

## 🤖 About This Repo

This is **Ralph's operation center** for running the $FED Federal Reserve - an autonomous system that collects trading fees and distributes USD1 stablecoins to all $FED holders.

Ralph acts as the Federal Reserve Chairman, controlling the money printer that goes BRRR every 2 minutes.

---

## 📊 Live Stats

| Metric | Value |
|--------|-------|
| **Total Distributed** | $5,991+ USD1 |
| **Distributions** | 121 |
| **Holders Paid** | 309 |
| **Frequency** | Every 2 minutes |
| **Threshold** | $10 USD1 minimum |

*Last updated: January 21, 2026*

---

## 🔄 The Flywheel

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Traders       │     │   8% Tax        │     │   Ralph         │
│   Buy/Sell      │────▶│   Accumulates   │────▶│   Collects      │
│   $FED          │     │   in LP         │     │   USD1 Fees     │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
┌─────────────────┐     ┌─────────────────┐              │
│   Holders       │     │   Ralph         │◀─────────────┘
│   Buy More      │◀────│   Distributes   │
│   (Repeat)      │     │   to Holders    │
└─────────────────┘     └─────────────────┘
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📖 Overview](docs/OVERVIEW.md) | How the $FED system works |
| [🚀 Phase 2](docs/PHASE2.md) | Roadmap & Ralph's evolution |
| [🛠️ Setup](docs/SETUP.md) | Technical setup guide |

---

## 📁 Scripts

All distribution scripts (sanitized - add your own keys):

| Script | Purpose |
|--------|---------|
| `scripts/run-distribution.ts` | Main orchestrator - fee collection + distribution |
| `scripts/distribute-tokens.ts` | Distribution engine - sends USD1 to holders |
| `scripts/collect-dammv2-fees.ts` | Fee collector - claims from Meteora DAMM v2 |

---

## ⚡ Quick Start

```bash
# Clone this repo
git clone https://github.com/snark-tank/ralph.git
cd ralph

# Install dependencies
npm install

# Configure your keys (see docs/SETUP.md)
export HELIUS_API_KEY=your_key
export DISTRIBUTION_API_KEY=your_key

# Run manually
npx ts-node scripts/run-distribution.ts

# Or with PM2 (every 2 minutes)
pm2 start "npx ts-node scripts/run-distribution.ts" \
  --name fed-distribution \
  --cron-restart="*/2 * * * *" \
  --no-autorestart
```

---

## 🔑 Key Addresses

| Item | Address |
|------|---------|
| **$FED Token** | `132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed` |
| **USD1 Token** | `USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB` |
| **Distribution Wallet** | `4Br5iKfRkYMk8WMj6w8YASynuq7Eoas16rkyvWsAdL4P` |
| **Meteora Pool** | `8mLRmqBVfe91twjpCF3hqTtGNMJMsukhEd6GGjXpqs2i` |

---

## 📝 Ralph's Update Log

This repo is continuously updated as Ralph evolves the operation:

### Latest
- ✅ Automated fee collection from Meteora DAMM v2
- ✅ Proportional USD1 distribution to all holders
- ✅ Website sync via Redis API (fed.markets)
- ✅ PM2 automation (2-minute cycles)
- ✅ $10 minimum threshold before distribution

### Coming Soon (Phase 2)
- 🔄 Dynamic threshold management
- 🔄 Intelligent distribution timing
- 🔄 Holder tier system (Diamond/Gold/Silver/Bronze)
- 🔄 Governance integration

---

## 🔗 Links

| Platform | Link |
|----------|------|
| 🌐 **Website** | [fed.markets](https://fed.markets) |
| 🐦 **Twitter** | [@fed_USD1](https://x.com/fed_USD1) |
| 🪙 **Buy** | [Jupiter](https://jup.ag/swap/SOL-132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed) |
| 📊 **Chart** | [DexScreener](https://dexscreener.com/solana/132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed) |

---

## ⚠️ Disclaimer

$FED is a meme token. Cryptocurrency investments carry significant risk. DYOR. Never invest more than you can afford to lose.

---

<p align="center">
  <img src="logo.png" alt="$FED" width="60">
  <br>
  <strong>Ralph's Federal Reserve</strong>
  <br>
  <em>Making the Money Printer Go BRRR</em>
  <br><br>
  🖨️💵
</p>
