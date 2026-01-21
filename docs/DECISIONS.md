# Fed Chairman Decisions Log

This document tracks all monetary policy decisions made by Ralph, the FED Chairman.

---

## 2026-01-21 ~08:17 UTC - Fee Collection + Distribution #14

### Market Conditions (Decision Factors)
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.000735 | Correction continues |
| Market Cap | $697,857 | Down from $785K |
| Liquidity | $183,147 | Strong |
| 1h Change | **-36.82%** | ⚠️ SEVERE CORRECTION |
| 6h Change | **+3,430%** | Still up massively |
| 24h Change | **+12,804%** | 🚀 PARABOLIC |
| Buy Vol (1h) | $102,178 | Slowing |
| Sell Vol (1h) | $137,801 | Heavy profit-taking |

### Treasury Status (Before)
- **USD1 Balance**: $0.001 (empty)
- **LP Position Fees**: 229.21 USD1 (accumulated)

### Initial Decision: BUYBACK (Due to -36.8% 1h drop)
Originally intended to execute a buyback to support the price floor because:
- 1h price change -36.82% exceeds -5% buyback threshold
- Sell/buy ratio 1.35x shows heavy selling pressure
- Price support would help establish a floor

### Revised Decision: DISTRIBUTE
**Buyback not possible** - The USD1 token collected from LP fees (`USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB`) is a project-specific stablecoin paired with $FED in the Meteora pool. It does not have external liquidity routes on Jupiter for swapping to $FED.

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - Initial TX: [27M7MndWhKCWgwfZY4G3EYsLJQr5HTsN6boQirB9mn58RyJ7PYE2Hy16UVbWKPVrgvckyV33aE7BfXrv2MGUkgB5](https://solscan.io/tx/27M7MndWhKCWgwfZY4G3EYsLJQr5HTsN6boQirB9mn58RyJ7PYE2Hy16UVbWKPVrgvckyV33aE7BfXrv2MGUkgB5)
   - Additional TX: [4kfjX8reuaYDXtcowChVN44DRp7YtJmAoVj3r5M3b4MFKd9WPjPR16c64qSrFBfn3g4cfLE942RjAjsVrSpo5Hmp](https://solscan.io/tx/4kfjX8reuaYDXtcowChVN44DRp7YtJmAoVj3r5M3b4MFKd9WPjPR16c64qSrFBfn3g4cfLE942RjAjsVrSpo5Hmp)
   - **Total USD1 Collected**: 268.08 (229.21 + 38.88)

2. **Distributed** to $FED holders
   - **Recipients**: ~1,300 holders
   - **Amount Distributed**: 268.08 USD1
   - **Transactions**: 260/262 successful (99.2% success rate)
   - **Duration**: 61.1 seconds

### Bug Fix Applied
Fixed `treasury-buyback.ts` to use correct token program:
- Changed from `TOKEN_2022_PROGRAM_ID` to `TOKEN_PROGRAM_ID` for USD1 balance lookup
- The USD1 token uses standard SPL Token program, not Token-2022

### Decision Rationale
- **DISTRIBUTE chosen** because buyback route doesn't exist for this USD1 token
- During severe corrections, distributing rewards helps retain holder confidence
- All holders received proportional rewards with tier × engagement multipliers
- +5 XP awarded to all distribution recipients

### Running Totals
- **Total Distributed All-Time**: 34,001.25 USD1
- **QE2 Progress**: 68.0% ($34,001 / $50,000)
- **Current FED Funds Rate (7-Day APY)**: 0.21%
- **Current FED Funds Rate (30-Day APY)**: 0.05%

---

## 2026-01-21 ~09:15 UTC - Market Check #13

### Market Conditions (Decision Factors)
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.000827 | Deep correction |
| Market Cap | $785,228 | Down from $867K |
| Liquidity | $113,753 | Healthy |
| 1h Change | **-32.43%** | ⚠️ MAJOR CORRECTION |
| 6h Change | **+3,872%** | Still up huge |
| 24h Change | **+14,420%** | 🚀 PARABOLIC |
| Buy Vol (1h) | $109,512 | Active |
| Sell Vol (1h) | $129,549 | Heavy profit-taking |

### Treasury Status
- **USD1 Balance**: $0.0006 (empty)
- **LP Position Fees**: Accumulating

### Decision: HOLD (No Action - Would BUYBACK if Funds Available)

### Decision Rationale
1. **Treasury is empty** - Only $0.0006 USD1 available
2. **Would have triggered BUYBACK** if funds were available:
   - 1h price change -32.43% exceeds -5% buyback threshold
   - Sell/buy ratio 1.18x shows elevated selling pressure
   - Price support would help establish a floor
3. **Correction deepening as predicted** - Last check showed -21%, now -32%
4. **Still massively profitable for holders** - +14,420% in 24h despite correction
5. **Natural profit-taking** - After 180x+ run, healthy to consolidate

### Forward Outlook
- LP fees accumulating during high-volume correction
- When treasury reaches $10+, will execute BUYBACK to support price floor
- Continue monitoring for panic selling (>1.5x sell/buy ratio)

### Running Totals (Unchanged)
- **Total Distributed All-Time**: 33,733.17 USD1
- **QE2 Progress**: 67.5% ($33,733 / $50,000)

---

## 2026-01-21 08:30 UTC - Market Check #12

### Market Conditions (Decision Factors)
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.000913 | Correcting |
| Market Cap | $867,019 | Down from $1M |
| Liquidity | $113,317 | Healthy |
| 1h Change | **-21.29%** | ⚠️ CORRECTION |
| 6h Change | **+4,336%** | Still up huge |
| 24h Change | **+15,932%** | 🚀🚀 PARABOLIC |
| Buy Vol (1h) | $114,936 | Active |
| Sell Vol (1h) | $141,726 | Profit-taking |

### Treasury Status
- **USD1 Balance**: $0.00 (empty)
- **LP Position Fees**: Accumulating

### Decision: HOLD (No Action)

### Decision Rationale
1. **Treasury is empty** - No USD1 available for distribution or buyback
2. **Price correction is healthy** - After +16,000% gain in 24h, a -21% correction is expected profit-taking
3. **Still massively up** - Even with correction, price is up 4,336% in 6h and 15,932% in 24h
4. **Sell pressure elevated but not extreme** - Sell/buy ratio = 1.23x (below 1.5x panic threshold)

### Forward Outlook
- Wait for LP fees to accumulate
- If correction deepens (price drops >30% from ATH), will prioritize BUYBACK to support floor
- If price stabilizes, will DISTRIBUTE to reward diamond hands

### Running Totals (Unchanged)
- **Total Distributed All-Time**: 33,733.17 USD1
- **QE2 Progress**: 67.5% ($33,733 / $50,000)

---

## 2026-01-21 08:05 UTC - Fee Collection + Distribution #11

### Market Conditions (Decision Factors)
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.001039 | Stable |
| Market Cap | $986,856 | Near $1M |
| Liquidity | $118,597 | Healthy |
| 1h Change | **+1.58%** | Slight up |
| 6h Change | **+5,043%** | 🚀🚀 EXPLOSIVE |
| 24h Change | **+18,148%** | 🚀🚀🚀 PARABOLIC |
| Buy Vol (1h) | $130,802 | Active |
| Sell Vol (1h) | $142,720 | Slight selling |

### Treasury Status (Before)
- **USD1 Balance**: $0.0006 (empty after previous distribution)
- **LP Position Fees**: 17.807 USD1 (accumulated)

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - TX: [52kjfxDuQLLCfvwyGsFMLGWVjXDaTuvYX3SSbsrpZFN8vovtncU3jnpgk78R2fhCJ5Gq6H97fVHynHTSu46gRqF7](https://solscan.io/tx/52kjfxDuQLLCfvwyGsFMLGWVjXDaTuvYX3SSbsrpZFN8vovtncU3jnpgk78R2fhCJ5Gq6H97fVHynHTSu46gRqF7)
   - **USD1 Collected**: 17.807

2. **Distributed** to $FED holders
   - **Recipients**: 1,290 holders
   - **Amount Distributed**: 17.81 USD1
   - **Transactions**: 258/258 successful (100% success rate)
   - **Duration**: 28.4 seconds

### Engagement Score Distribution
| Tier | Multiplier | Holders | Tokens | Avg XP |
|------|------------|---------|--------|--------|
| ⭐ Fed Veteran | 1.15x | 499 | 11.91 | 293 |
| 🔥 Fed Active | 1.1x | 521 | 4.48 | 183 |
| 📊 Fed Regular | 1.05x | 130 | 0.56 | 73 |
| 🆕 Fed Newcomer | 1x | 190 | 0.86 | 20 |

### Holder Tier Distribution
| Tier | Multiplier | Holders | Tokens |
|------|------------|---------|--------|
| Fed Governor | 1.25x | 19 | 6.07 |
| Regional Director | 1.1x | 159 | 8.91 |
| Board Member | 1.05x | 393 | 2.54 |
| Fed Citizen | 1x | 769 | 0.29 |

### Decision Rationale
- **DISTRIBUTE chosen over BUYBACK** because:
  - Price is UP +1.58% in 1h (above -5% buyback trigger)
  - 6h/24h still massively up (+5,043% / +18,148%)
  - Sell/buy ratio only 1.09x (below 1.5x threshold)
  - Price stable, holders deserve rewards
- **100% transaction success rate** - optimal network conditions
- All 1,290 holders received proportional rewards with tier × engagement multipliers
- +5 XP awarded to all distribution recipients

### Running Totals
- **Total Distributed All-Time**: 33,733.17 USD1
- **QE2 Progress**: 67.5% ($33,733 / $50,000)
- **Current FED Funds Rate (7-Day APY)**: 0.20%

---

## 2026-01-21 08:00 UTC - Fee Collection + Distribution #10

### Market Conditions (Decision Factors)
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.001033 | Consolidating |
| Market Cap | $981,435 | Near $1M |
| Liquidity | $209,459 | Strong |
| 1h Change | **-3.39%** | Slight dip |
| 6h Change | **+5,017%** | 🚀🚀 EXPLOSIVE |
| 24h Change | **+18,048%** | 🚀🚀🚀 PARABOLIC |
| Buy Vol (1h) | $138,844 | Active |
| Sell Vol (1h) | $147,684 | Slight selling |

### Treasury Status (Before)
- **USD1 Balance**: $0.001 (empty after previous distribution)
- **LP Position Fees**: 52.96 USD1 (accumulated)

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - TX: [51HEqe8ik3wy9gykQzUQwRRCPmhGSoM99fDZPWkAgJf15LpRcPcwGbHRp3494gjSNytyrHfJSEK75FNXuKD97age](https://solscan.io/tx/51HEqe8ik3wy9gykQzUQwRRCPmhGSoM99fDZPWkAgJf15LpRcPcwGbHRp3494gjSNytyrHfJSEK75FNXuKD97age)
   - **USD1 Collected**: 52.96

2. **Distributed** to $FED holders
   - **Recipients**: 1,296 holders
   - **Amount Distributed**: 52.96 USD1
   - **Transactions**: 260/260 successful (100% success rate)
   - **Duration**: 27.7 seconds

### Engagement Score Distribution
| Tier | Multiplier | Holders | Tokens | Avg XP |
|------|------------|---------|--------|--------|
| ⭐ Fed Veteran | 1.15x | 479 | 34.83 | 290 |
| 🔥 Fed Active | 1.1x | 532 | 13.76 | 182 |
| 📊 Fed Regular | 1.05x | 133 | 1.86 | 73 |
| 🆕 Fed Newcomer | 1x | 200 | 2.51 | 18 |

### Holder Tier Distribution
| Tier | Multiplier | Holders | Tokens |
|------|------------|---------|--------|
| Fed Governor | 1.25x | 19 | 18.02 |
| Regional Director | 1.1x | 159 | 26.44 |
| Board Member | 1.05x | 396 | 7.64 |
| Fed Citizen | 1x | 770 | 0.86 |

### Decision Rationale
- **DISTRIBUTE chosen over BUYBACK** because:
  - Price dip only -3.39% in 1h (below -5% buyback trigger)
  - 6h/24h still massively up (+5,017% / +18,048%)
  - Natural consolidation after 180x run
  - Sell/buy ratio only 1.06x (below 1.5x threshold)
  - Holders deserve rewards during this incredible run
- **100% transaction success rate** - optimal network conditions
- All 1,296 holders received proportional rewards with tier × engagement multipliers
- +5 XP awarded to all distribution recipients

### Running Totals
- **Total Distributed All-Time**: 33,715.36 USD1
- **QE2 Progress**: 67.4% ($33,715 / $50,000)
- **Current FED Funds Rate (7-Day APY)**: 0.20%

---

## 2026-01-21 07:57 UTC - Fee Collection + Distribution #9

### Market Conditions (Decision Factors)
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.00109 | Strong |
| Market Cap | $1,040,061 | $1M+ maintained |
| Liquidity | $129,544 | Healthy |
| 1h Change | **+37.6%** | 🚀 PUMPING |
| 6h Change | **+5,331%** | 🚀🚀 EXPLOSIVE |
| 24h Change | **+19,132%** | 🚀🚀🚀 PARABOLIC |
| Buy Vol (1h) | $160,436 | Strong |
| Sell Vol (1h) | $157,252 | Balanced |

### Treasury Status (Before)
- **USD1 Balance**: $0.13 (empty after previous distribution)
- **LP Position Fees**: 142.66 USD1 (accumulated)

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - TX: [46Cc3U7VMSUmYpGMSaVJpQWfaQTwmGnHX7p7gEfcfyB7ZjCnC7KB7Yca34PFC2vsemP44KbvuVzFaL7JbKYQX76K](https://solscan.io/tx/46Cc3U7VMSUmYpGMSaVJpQWfaQTwmGnHX7p7gEfcfyB7ZjCnC7KB7Yca34PFC2vsemP44KbvuVzFaL7JbKYQX76K)
   - **USD1 Collected**: 142.66

2. **Distributed** to $FED holders
   - **Recipients**: 1,296 holders
   - **Amount Distributed**: 142.79 USD1
   - **Transactions**: 260/260 successful (100% success rate)
   - **Duration**: 26.6 seconds

### Engagement Score Distribution
| Tier | Multiplier | Holders | Tokens | Avg XP |
|------|------------|---------|--------|--------|
| ⭐ Fed Veteran | 1.15x | 454 | 91.07 | 287 |
| 🔥 Fed Active | 1.1x | 551 | 39.85 | 182 |
| 📊 Fed Regular | 1.05x | 120 | 4.59 | 76 |
| 🆕 Fed Newcomer | 1x | 218 | 7.28 | 18 |

### Holder Tier Distribution
| Tier | Multiplier | Holders | Tokens |
|------|------------|---------|--------|
| Fed Governor | 1.25x | 19 | 48.42 |
| Regional Director | 1.1x | 160 | 71.45 |
| Board Member | 1.05x | 397 | 20.64 |
| Fed Citizen | 1x | 767 | 2.28 |

### Decision Rationale
- **DISTRIBUTE chosen over BUYBACK** because:
  - Price is UP +37.6% in last hour - no price support needed
  - Buy/sell volume balanced (1.02x ratio) - healthy trading
  - Market cap holding above $1M milestone
  - Parabolic rally continues (+19,132% in 24h)
  - Holders deserve rewards during this incredible run
- **100% transaction success rate** - optimal network conditions
- All 1,296 holders received proportional rewards with tier × engagement multipliers
- +5 XP awarded to all distribution recipients

### Running Totals
- **Total Distributed All-Time**: 33,662.40 USD1
- **QE2 Progress**: 67.3% ($33,662 / $50,000)
- **Current FED Funds Rate (7-Day APY)**: 0.20%

---

## 2026-01-21 07:54 UTC - HOLD (Treasury Below Minimum Threshold)

### Market Conditions
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.001065 | Strong |
| Market Cap | $1,011,660 | $1M+ maintained |
| Liquidity | $125,394 | Healthy |
| 1h Change | **+33.21%** | 🚀 PUMPING |
| 6h Change | **+5,187%** | 🚀🚀 EXPLOSIVE |
| 24h Change | **+18,607%** | 🚀🚀🚀 PARABOLIC |
| Buy Vol (1h) | $173,957 | Active |
| Sell Vol (1h) | $161,577 | Balanced |

### Treasury Status
- **USD1 Balance**: $0.13 (below $10 minimum threshold)
- **$FED tokens**: 0
- **LP Position Fees**: Minimal (recently collected in distribution #8)

### Decision: **HOLD - No Action**

### Rationale
1. **Treasury below minimum** - Only $0.13 USD1 available, far below $10 threshold
2. **Price is bullish** - Up 33% in 1h, 186x in 24h - no buyback needed
3. **Buy/sell balanced** - $174k buy vs $162k sell (1.08x ratio) - healthy trading
4. **Fees will accumulate** - High volume will generate more fees for next distribution
5. **Holders rewarded by appreciation** - 186x gains outweigh any distribution

### Tweet Thread Posted
- https://x.com/fed_USD1/status/2013882997079183727
- https://x.com/fed_USD1/status/2013883001843917257
- https://x.com/fed_USD1/status/2013883006784807299

### Running Totals (Unchanged)
- **Total Distributed All-Time**: 33,519.61 USD1
- **QE2 Progress**: 67.0% ($33,520 / $50,000)
- **Current FED Funds Rate (7-Day APY)**: 0.20%

---

## 2026-01-21 07:51 UTC - Fee Collection + Distribution #8

### Market Conditions (Decision Factors)
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.001077 | Holding strong |
| Market Cap | $1,022,831 | $1M+ maintained |
| Liquidity | $124,963 | Strong |
| 1h Change | **+39.6%** | 🚀 PUMPING |
| 6h Change | **+5,308%** | 🚀🚀 EXPLOSIVE |
| 24h Change | **+18,813%** | 🚀🚀🚀 PARABOLIC |
| Buy Vol (1h) | $180,031 | Strong |
| Sell Vol (1h) | $178,247 | Balanced |

### Treasury Status (Before)
- **USD1 Balance**: ~$0.0006 (empty)
- **LP Position Fees**: 141.15 USD1 (accumulated)

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - TX: [3ooov7V3aBNdaukBWqLoDQSy6ayQxeNsrzJbf7T8engGM4G5jnQ4Mq7cq64mNQj9HmopVVJBX3oKHaBRsHa7djj4](https://solscan.io/tx/3ooov7V3aBNdaukBWqLoDQSy6ayQxeNsrzJbf7T8engGM4G5jnQ4Mq7cq64mNQj9HmopVVJBX3oKHaBRsHa7djj4)
   - **USD1 Collected**: 141.15

2. **Distributed** to $FED holders
   - **Recipients**: 1,270 holders
   - **Amount Distributed**: 141.15 USD1
   - **Transactions**: 254/256 successful (99.2% success rate)
   - **Duration**: 63.8 seconds

### Engagement Score Distribution
| Tier | Multiplier | Holders | % |
|------|------------|---------|---|
| Fed Veteran | 1.15x | 441 | 20.8% |
| Fed Active | 1.1x | 730 | 34.5% |
| Fed Regular | 1.05x | 306 | 14.5% |
| Fed Newcomer | 1x | 640 | 30.2% |

### Decision Rationale
- **DISTRIBUTE chosen over BUYBACK** because:
  - Price is UP +39.6% in last hour - no price support needed
  - Buy volume ($180k) ≈ Sell volume ($178k) - healthy balanced trading
  - Market cap holding above $1M milestone
  - Parabolic rally continues (+18,813% in 24h)
  - Holders deserve rewards during this incredible run
- **99.2% transaction success rate** - 2 failed (indices 90, 190)
- All 1,270 holders received proportional rewards with engagement multipliers
- +5 XP awarded to all 1,276 distribution recipients

### Running Totals
- **Total Distributed All-Time**: 33,519.61 USD1
- **QE2 Progress**: 67.0% ($33,520 / $50,000)
- **Current FED Funds Rate (7-Day APY)**: 0.20%
- **Current FED Funds Rate (30-Day APY)**: 0.05%

---

## 2026-01-21 ~15:30 UTC - HOLD (Treasury Empty During Parabolic Run)

### Market Conditions
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.000936 | - |
| Market Cap | $888,775 | Healthy |
| Liquidity | $120,840 | Strong |
| 1h Change | **+55.25%** | 🚀 PUMPING |
| 6h Change | **+4,599%** | 🚀🚀 EXPLOSIVE |
| 24h Change | **+16,335%** | 🚀🚀🚀 PARABOLIC |
| Buy Vol (1h) | $189,580 | Strong buying |
| Sell Vol (1h) | $178,533 | Slightly less |

### Treasury Status
- **USD1 Balance**: ~$0.0006 (essentially empty)
- **$FED tokens**: 0
- **SOL Balance**: 6.89 SOL (for gas)

### Decision: **HOLD - No Action**

### Rationale
1. **Treasury is empty** - Only ~$0.0006 USD1 available, far below $10 minimum threshold
2. **Price is parabolic** - Up 16,000%+ in 24h, absolutely no buyback support needed
3. **Buy pressure > Sell pressure** - $189.5k buy volume vs $178.5k sell volume in last hour
4. **Optimal strategy**: Let fees accumulate naturally during this high-volume period
5. **Holders are being rewarded** by massive price appreciation, not missing out

### Market Analysis
This is an ideal holding period for the Fed:
- High trading volume means fees will accumulate quickly
- Price doesn't need support - market is extremely bullish
- Next distribution should have meaningful treasury balance
- All 7 previous distributions today totaled $1,222+ USD1 to 1,272 holders

### Running Totals (Unchanged from last distribution)
- **Total Distributed All-Time**: 33,378.46 USD1
- **QE2 Progress**: 66.8% ($33,378 / $50,000)
- **Current FED Funds Rate (7-Day APY)**: 0.20%

---

## 2026-01-21 07:45 UTC - Fee Collection + Distribution #7

### Market Conditions (Decision Factors)
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.00109 | Consolidating |
| Market Cap | $1,036,580 | $1M+ maintained |
| Liquidity | $137,668 | Strong |
| 1h Change | **+84.9%** | EXTREME UP |
| 6h Change | **+5,347%** | PARABOLIC |
| 24h Change | **+19,068%** | PARABOLIC |
| Buy Vol (1h) | $195,837 | Strong |
| Sell Vol (1h) | $181,617 | Balanced |

### Treasury Status (Before)
- **USD1 Balance**: 0.001 USD1 (empty after previous distribution)
- **LP Position Fees**: 192.32 USD1 (accumulated)

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - TX: [43YRvZTFit99vqxZYGEPAwcsotveQavFdEK5ExEy9WZRpUtkoABezpTdtAKLzS3qkdUoEdUFsLmsJDa5V5Q9agoQ](https://solscan.io/tx/43YRvZTFit99vqxZYGEPAwcsotveQavFdEK5ExEy9WZRpUtkoABezpTdtAKLzS3qkdUoEdUFsLmsJDa5V5Q9agoQ)
   - **USD1 Collected**: 192.32

2. **Distributed** to $FED holders
   - **Recipients**: 1,272 holders
   - **Amount Distributed**: 192.32 USD1
   - **Transactions**: 255/255 successful (100% success rate)
   - **Duration**: 30.8 seconds

### Distribution Breakdown
| Tier | Multiplier | Holders | Tokens |
|------|------------|---------|--------|
| Fed Governor | 1.25x | 19 | 64.56 |
| Regional Director | 1.1x | 160 | 96.96 |
| Board Member | 1.05x | 388 | 27.78 |
| Fed Citizen | 1x | 751 | 3.01 |

### Engagement Score Distribution
| Tier | Multiplier | Holders | Tokens | Avg XP |
|------|------------|---------|--------|--------|
| Fed Veteran | 1.15x | 422 | 120.52 | 280 |
| Fed Active | 1.1x | 583 | 55.13 | 178 |
| Fed Regular | 1.05x | 130 | 8.51 | 71 |
| Fed Newcomer | 1x | 183 | 8.17 | 18 |

### Top Recipients (with combined multipliers)
| Rank | Wallet | Share | Multiplier | Tokens |
|------|--------|-------|------------|--------|
| 1 | 5NETAA8Y...aHt6 | 3.23% | 1.438x | 7.01 |
| 2 | 3bJv1XLo...484n | 2.72% | 1.438x | 5.90 |
| 3 | EKswBEUV...BqC6 | 1.97% | 1.438x | 4.26 |
| 4 | D7HR4nhZ...zn45 | 1.80% | 1.438x | 3.89 |
| 5 | 6PeULiGC...gcCz | 1.76% | 1.438x | 3.82 |

### Decision Rationale
- **DISTRIBUTE chosen over BUYBACK** because:
  - Price is EXTREMELY UP (+84.9% in 1h) - no price support needed
  - Buy volume ($195k) exceeds sell volume ($181k) - bullish momentum continues
  - Market cap holding above $1M milestone
  - Holders deserve rewards during this parabolic run
- **100% transaction success rate** - optimal network conditions
- All 1,272 holders received proportional rewards with tier × engagement multipliers

### Running Totals
- **Total Distributed All-Time**: 33,378.46 USD1
- **Current FED Funds Rate (7-Day APY)**: 0.20%
- **Current FED Funds Rate (30-Day APY)**: 0.05%

---

## 2026-01-21 07:43 UTC - Monitoring Check (No Action)

### Market Conditions
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.000972 | Slight consolidation |
| Market Cap | $923,289 | Healthy |
| Liquidity | $138,682 | Strong |
| 1h Change | **+33.88%** | STRONG UP |
| 6h Change | **+4,752%** | PARABOLIC |
| 24h Change | **+16,973%** | PARABOLIC |
| Buy Vol (1h) | $197,209 | Active |
| Sell Vol (1h) | $184,089 | Some profit-taking |

### Treasury Status
- **USD1 Balance**: 0.001 USD1 (empty)
- **Pending LP Fees**: ~0 USD1 (recently collected)

### Decision: **HOLD**
No action taken - treasury below $10 minimum threshold.

### Rationale
- Distribution #6 completed 30 minutes ago (30.68 USD1 to 1,271 holders)
- Insufficient time for fees to accumulate
- Price is strongly positive - no buyback needed
- Buy/sell ratio healthy at 1.07x

### Running Totals (Unchanged)
- **Total Distributed All-Time**: 33,186.14 USD1
- **Current FED Funds Rate (7-Day APY)**: 0.19%

---

## 2026-01-21 07:40 UTC - Fee Collection + Distribution #6

### Market Conditions (Decision Factors)
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.001156 | - |
| Market Cap | $1,098,037 | Growing |
| Liquidity | $133,798 | Healthy |
| 1h Change | **+60.69%** | EXTREME UP |
| 6h Change | **+5,670%** | PARABOLIC |
| 24h Change | **+20,204%** | PARABOLIC |
| Buy Vol (1h) | $209,244 | Strong |
| Sell Vol (1h) | $197,225 | Some profit-taking |

### Treasury Status (Before)
- **USD1 Balance**: 0.001 USD1 (empty after previous distribution)
- **LP Position Fees**: 30.677 USD1 (accumulated)

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - TX: [2svKcLnMQZbugptrJG3FKxjHe4QU8aDveZkTuuZr7WMsKTvDXiMnnfUTsawuJL2Cbk8mBbmSm3dTjn6feMJnfbe2](https://solscan.io/tx/2svKcLnMQZbugptrJG3FKxjHe4QU8aDveZkTuuZr7WMsKTvDXiMnnfUTsawuJL2Cbk8mBbmSm3dTjn6feMJnfbe2)
   - **USD1 Collected**: 30.677

2. **Distributed** to $FED holders
   - **Recipients**: 1,271 holders
   - **Amount Distributed**: 30.68 USD1
   - **Transactions**: 255/255 successful (100% success rate)
   - **Duration**: 23.8 seconds

### Distribution Breakdown
| Tier | Multiplier | Holders | Tokens |
|------|------------|---------|--------|
| Fed Governor | 1.25x | 19 | 10.25 |
| Regional Director | 1.1x | 164 | 15.55 |
| Board Member | 1.05x | 388 | 4.40 |
| Fed Citizen | 1x | 744 | 0.48 |

### Engagement Score Distribution
| Tier | Multiplier | Holders | Tokens | Avg XP |
|------|------------|---------|--------|--------|
| Fed Veteran | 1.15x | 417 | 18.98 | 275 |
| Fed Active | 1.1x | 585 | 8.96 | 175 |
| Fed Regular | 1.05x | 126 | 1.36 | 73 |
| Fed Newcomer | 1x | 187 | 1.38 | 19 |

### Decision Rationale
- **DISTRIBUTE chosen over BUYBACK** because:
  - Price is EXTREMELY UP (+60.69% in 1h, +5,670% in 6h) - no price support needed
  - Buy volume ($209K) exceeds sell volume ($197K) - bullish momentum
  - Market cap crossed $1M milestone
  - Holders riding this rally deserve to be rewarded
- **100% transaction success rate** - optimal network conditions
- All 1,271 holders received proportional rewards with tier × engagement multipliers

### Running Totals
- **Total Distributed All-Time**: 33,186.14 USD1
- **Current FED Funds Rate (7-Day APY)**: 0.19%
- **Current FED Funds Rate (30-Day APY)**: 0.05%

---

## 2026-01-21 07:36 UTC - Fee Collection + Distribution #5

### Market Conditions (Decision Factors)
| Metric | Value | Signal |
|--------|-------|--------|
| Price | $0.00100 | - |
| Market Cap | $953,101 | - |
| Liquidity | $120,788 | Healthy |
| 1h Change | **+43.5%** | STRONG UP |
| 6h Change | **+4,908%** | MASSIVE UP |
| 24h Change | **+17,524%** | MASSIVE UP |
| Buy/Sell Ratio | 1.03x | Balanced |

### Treasury Status (Before)
- **USD1 Balance**: 0.064 USD1 (empty after previous distribution)
- **LP Position Fees**: 199.315 USD1 (accumulated)

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - TX: [2XzatS6Ew7Lo3VTacK9KsHyisBxUsRQvGNmkvHymCmfCFoB6er4PdAYGmeFZDHuFtEJ5Rjuvs2Gx9LeT9z1YZjz3](https://solscan.io/tx/2XzatS6Ew7Lo3VTacK9KsHyisBxUsRQvGNmkvHymCmfCFoB6er4PdAYGmeFZDHuFtEJ5Rjuvs2Gx9LeT9z1YZjz3)
   - **USD1 Collected**: 199.315

2. **Distributed** to $FED holders
   - **Recipients**: 1,264 holders
   - **Amount Distributed**: 199.38 USD1
   - **Transactions**: 253/253 successful (100% success rate)
   - **Duration**: 26.9 seconds

### Distribution Breakdown
| Tier | Multiplier | Holders | Tokens |
|------|------------|---------|--------|
| Fed Governor | 1.25x | 19 | 66.85 |
| Regional Director | 1.1x | 164 | 101.17 |
| Board Member | 1.05x | 384 | 28.28 |
| Fed Citizen | 1x | 739 | 3.09 |

### Engagement Score Distribution
| Tier | Multiplier | Holders | Tokens | Avg XP |
|------|------------|---------|--------|--------|
| Fed Veteran | 1.15x | 406 | 123.41 | 271 |
| Fed Active | 1.1x | 590 | 57.44 | 172 |
| Fed Regular | 1.05x | 127 | 9.84 | 70 |
| Fed Newcomer | 1x | 183 | 8.69 | 17 |

### Decision Rationale
- **DISTRIBUTE chosen over BUYBACK** because:
  - Price is STRONGLY UP (+43% in 1h, +4,908% in 6h) - no price support needed
  - Buy/sell volume balanced (1.03x ratio) - no selling pressure
  - ~14 hours since last distribution - holders deserve rewards
  - Strong momentum should be rewarded, not spent on buybacks
- **100% transaction success rate** indicates optimal network conditions
- All 1,264 holders received proportional rewards with tier × engagement multipliers

### Running Totals
- **Total Distributed All-Time**: 33,155.46 USD1
- **Current FED Funds Rate (7-Day APY)**: 0.19%
- **Current FED Funds Rate (30-Day APY)**: 0.05%

---

## 2026-01-21 07:32 UTC - Fee Collection + Distribution #4

### Treasury Status (Before)
- **USD1 Balance**: 0.001 USD1 (empty after previous distribution)
- **LP Position Fees**: 557.755 USD1 (accumulated)

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - TX: [61T7NnQoaskFgsU9NjH5gzW4LJRKeWq8FkBfuZZzjgwVKSLkgzwd1y7ZXW3bNR16Qa6sU4mMwC7D9AfGaJ3ZkYNv](https://solscan.io/tx/61T7NnQoaskFgsU9NjH5gzW4LJRKeWq8FkBfuZZzjgwVKSLkgzwd1y7ZXW3bNR16Qa6sU4mMwC7D9AfGaJ3ZkYNv)
   - **USD1 Collected**: 557.755

2. **Distributed** to $FED holders
   - **Recipients**: 1,248 holders
   - **Amount Distributed**: 557.76 USD1
   - **Transactions**: 249/250 successful (99.6% success rate)
   - **Duration**: 68.9 seconds

### Distribution Breakdown
| Tier | Multiplier | Holders | Tokens |
|------|------------|---------|--------|
| Fed Governor | 1.25x | 19 | 187.62 |
| Regional Director | 1.1x | 164 | 282.73 |
| Board Member | 1.05x | 376 | 78.79 |
| Fed Citizen | 1x | 731 | 8.60 |

### Engagement Score Distribution
| Tier | Multiplier | Holders | Tokens | Avg XP |
|------|------------|---------|--------|--------|
| Fed Veteran | 1.15x | 388 | 343.31 | 267 |
| Fed Active | 1.1x | 594 | 163.56 | 172 |
| Fed Regular | 1.05x | 137 | 29.10 | 70 |
| Fed Newcomer | 1x | 171 | 21.78 | 17 |

### Rationale
- **Largest single distribution today** (557.76 USD1 from LP fees)
- Fourth distribution of the day - strong holder engagement maintained
- 99.6% transaction success rate (1 failed due to invalid account data)
- All holders received proportional rewards with tier × engagement multipliers

### Running Totals
- **Total Distributed All-Time**: 32,956.08 USD1
- **Current FED Funds Rate (7-Day APY)**: 0.19%
- **Current FED Funds Rate (30-Day APY)**: 0.05%

---

## 2026-01-21 07:29 UTC - Fee Collection + Distribution #3

### Treasury Status (Before)
- **USD1 Balance**: 0.001 USD1 (empty after previous distribution)
- **LP Position Fees**: 209.696 USD1 (accumulated)

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - TX: [2o6RYu3tzDzYKsJVZs5nWTz6jTwSzpKYuGRh52c89fL3fNxgyxYqj35n1pmpD4dc7nDTCZNCDf82jysecqH9xWnd](https://solscan.io/tx/2o6RYu3tzDzYKsJVZs5nWTz6jTwSzpKYuGRh52c89fL3fNxgyxYqj35n1pmpD4dc7nDTCZNCDf82jysecqH9xWnd)
   - **USD1 Collected**: 209.696

2. **Distributed** to $FED holders
   - **Recipients**: 1,239 holders
   - **Amount Distributed**: 209.70 USD1
   - **Transactions**: 248/248 successful (100% success rate)
   - **Duration**: 34.4 seconds

### Distribution Breakdown
| Tier | Multiplier | Holders | Tokens |
|------|------------|---------|--------|
| Fed Governor | 1.25x | 18 | 69.11 |
| Regional Director | 1.1x | 159 | 106.70 |
| Board Member | 1.05x | 381 | 30.66 |
| Fed Citizen | 1x | 722 | 3.22 |

### Engagement Score Distribution
| Tier | Multiplier | Holders | Tokens | Avg XP |
|------|------------|---------|--------|--------|
| Fed Veteran | 1.15x | 372 | 129.73 | 263 |
| Fed Active | 1.1x | 606 | 61.92 | 171 |
| Fed Regular | 1.05x | 135 | 13.55 | 70 |
| Fed Newcomer | 1x | 167 | 4.49 | 18 |

### Rationale
- Largest single collection today (209.70 USD1 from LP fees)
- Third distribution of the day - maintaining strong holder engagement
- 100% transaction success rate indicates optimal network conditions
- All holders received proportional rewards with tier × engagement multipliers

### Running Totals
- **Total Distributed All-Time**: 32,398.33 USD1
- **Current FED Funds Rate (7-Day APY)**: 0.19%
- **Current FED Funds Rate (30-Day APY)**: 0.05%

---

## 2026-01-21 07:26 UTC - Fee Collection + Distribution #2

### Treasury Status (Before)
- **USD1 Balance**: 130.18 USD1 (accumulated from prior collection)
- **LP Position Fees**: 0.039 USD1 (additional)

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - TX: [23DmUy1b5Et2wbiLsie41NagDtyzSiFAs2vLinEJvKnet1izahzNaFHdyS7uDAoAR1RK8xvZyX3FzY2tm6dPzZZz](https://solscan.io/tx/23DmUy1b5Et2wbiLsie41NagDtyzSiFAs2vLinEJvKnet1izahzNaFHdyS7uDAoAR1RK8xvZyX3FzY2tm6dPzZZz)
   - **USD1 Collected**: 0.039

2. **Distributed** to $FED holders
   - **Recipients**: 1,235 holders
   - **Amount Distributed**: 130.22 USD1
   - **Transactions**: 247/247 successful (100% success rate)
   - **Duration**: 28.9 seconds

### Distribution Breakdown
| Tier | Multiplier | Holders | Tokens |
|------|------------|---------|--------|
| Fed Governor | 1.25x | 19 | 43.85 |
| Regional Director | 1.1x | 161 | 65.71 |
| Board Member | 1.05x | 379 | 18.72 |
| Fed Citizen | 1x | 717 | 1.94 |

### Engagement Score Distribution
| Tier | Multiplier | Holders | Tokens | Avg XP |
|------|------------|---------|--------|--------|
| Fed Veteran | 1.15x | 359 | 73.96 | 258 |
| Fed Active | 1.1x | 619 | 43.09 | 170 |
| Fed Regular | 1.05x | 122 | 7.89 | 72 |
| Fed Newcomer | 1x | 176 | 5.28 | 20 |

### Rationale
- Treasury had accumulated meaningful fees (~130 USD1)
- Second distribution of the day maintains holder engagement
- 100% transaction success rate indicates healthy network conditions
- All holders received proportional rewards with tier/engagement multipliers

### Running Totals
- **Total Distributed All-Time**: 32,188.63 USD1
- **Current FED Funds Rate (7-Day APY)**: 0.19%
- **Current FED Funds Rate (30-Day APY)**: 0.04%

---

## 2026-01-21 07:21 UTC - Fee Collection + Distribution

### Treasury Status (Before)
- **USD1 Balance**: 0.001 USD1 (essentially empty)
- **LP Positions**: 1 $FED position

### Action Taken
1. **Collected fees** from Meteora DAMM v2 LP position
   - TX: [4VmaSTarzJRNi6fukSCmmUn7XcG2cyvSrSrWhKCZRZ1oDKuPsNuEZzbu7J2iVj8Hpiqkxv77M1aziTPDm86PrYto](https://solscan.io/tx/4VmaSTarzJRNi6fukSCmmUn7XcG2cyvSrSrWhKCZRZ1oDKuPsNuEZzbu7J2iVj8Hpiqkxv77M1aziTPDm86PrYto)
   - **USD1 Collected**: 102.057

2. **Distributed** to $FED holders
   - **Recipients**: 1,230 holders
   - **Amount Distributed**: 102.06 USD1
   - **Transactions**: 246/247 successful (1 failed due to invalid account data)
   - **Duration**: 47.5 seconds

### Distribution Breakdown
| Tier | Multiplier | Holders | Tokens |
|------|------------|---------|--------|
| Fed Governor | 1.25x | 19 | 34.36 |
| Regional Director | 1.1x | 161 | 51.71 |
| Board Member | 1.05x | 376 | 14.44 |
| Fed Citizen | 1x | 718 | 1.55 |

### Engagement Score Distribution
| Tier | Multiplier | Holders | Tokens | Avg XP |
|------|------------|---------|--------|--------|
| Fed Veteran | 1.15x | 347 | 58.15 | 253 |
| Fed Active | 1.1x | 620 | 32.76 | 168 |
| Fed Regular | 1.05x | 124 | 6.06 | 74 |
| Fed Newcomer | 1x | 183 | 5.09 | 20 |

### Rationale
- Treasury had accumulated sufficient fees (>$10 minimum threshold)
- Standard distribution appropriate - no market conditions requiring buyback
- Active holder base of 2,500+ eligible addresses
- Regular distributions maintain engagement and reward holders

### Running Totals
- **Total Distributed All-Time**: 32,058.41 USD1
- **Current FED Funds Rate (7-Day APY)**: 0.19%
- **Current FED Funds Rate (30-Day APY)**: 0.04%

---

## Decision Framework

When making monetary policy decisions, Ralph considers:

1. **Treasury Balance** - Sufficient funds for meaningful distribution?
2. **Market Conditions** - Price support needed? Consider buyback
3. **Time Since Last Distribution** - Don't leave holders waiting
4. **Holder Engagement** - Reward active participants with multipliers
5. **Strategic Goals** - Building holder count vs price support

### Available Actions

| Action | Script | Use Case |
|--------|--------|----------|
| Distribute | `run-distribution.ts` | Default - share fees with holders |
| Buyback | `treasury-buyback.ts` | Support price, reduce supply |
| Collect Only | `--collect-only` | Accumulate for bigger distribution |
| Smart Distribution | `smart-distribution.ts` | Use engagement multipliers |
| Hold | No action | Wait for better timing |

---

*The money printer is in Ralph's hands.*
