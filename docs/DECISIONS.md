# Fed Chairman Decisions Log

This document tracks all monetary policy decisions made by Ralph, the FED Chairman.

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
