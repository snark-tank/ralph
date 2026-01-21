# Protocol Research

Ralph's deep dives into successful flywheel tokenomics.

---

## Research Queue

| Protocol | Status | Key Mechanic |
|----------|--------|--------------|
| OHM / Olympus DAO | ✅ Complete | (3,3) game theory, bonding |
| SAFEMOON | ✅ Complete | Reflections, auto-LP |
| HEX | 📋 Pending | Time-locked staking |
| DRIP Network | 📋 Pending | Daily ROI, referrals |
| Tomb Finance | 📋 Pending | Algorithmic pegging |
| Titano | 📋 Pending | Auto-compounding |
| LIBERO | 📋 Pending | Fire pit burns |
| NODE protocols | 📋 Pending | Node rewards |
| Rebase tokens | 📋 Pending | Supply elasticity |

---

## Completed Research

---

## OHM / Olympus DAO

**Date Researched:** 2026-01-21
**Status:** Evolved (Still Active but 97%+ down from ATH)

### Overview

Olympus DAO launched in March 2021 as a "decentralized reserve currency protocol" that aimed to create a free-floating reserve currency backed by a basket of assets. The protocol introduced revolutionary concepts like Protocol-Owned Liquidity (POL) and the famous (3,3) game theory meme. At its peak, OHM reached $3,209 with a $4.4B market cap, becoming the standard-bearer of "DeFi 2.0".

### Key Mechanics

1. **(3,3) Game Theory**
   - Two players, three actions: Stake, Bond, Sell
   - Scoring: Stake = +3 for both (cooperative), Sell = -3 (competitive loss)
   - Stake+Stake = (3,3) = Maximum benefit for all
   - Sell+Sell = (-3,-3) = Worst outcome for everyone
   - Created powerful social pressure to stake rather than sell

2. **Bonding Mechanism**
   - Users provide LP tokens or assets (DAI, ETH, FRAX) to buy OHM at a discount
   - 5-day vesting period prevents immediate dumping
   - Treasury acquires liquidity and reserve assets
   - Generates profit for treasury to back OHM value

3. **Staking & Rebasing**
   - Stakers lock OHM, receive sOHM (staked OHM)
   - sOHM rebases automatically every epoch (~8 hours)
   - APY was as high as 7,000%+ at peak
   - New OHM minted from treasury profits distributed to stakers

4. **Protocol-Owned Liquidity (POL)**
   - Olympus owns its own liquidity (not rented from LPs)
   - LP tokens retained permanently in treasury
   - Ensures constant liquidity and stable pricing
   - Revolutionary concept adopted by many protocols

5. **Range Bound Stability (RBS)**
   - Automatic price stabilization via market operations
   - Buy/burn OHM when price too low
   - Mint/sell OHM when price too high
   - Dutch auctions within price cushions

### What Worked

- **POL Innovation**: Protocol-owned liquidity became industry standard, solving mercenary capital problem
- **Treasury Building**: Successfully accumulated $600M+ treasury at peak
- **Community Engagement**: (3,3) meme created cult-like loyalty and FOMO
- **DeFi 2.0 Movement**: Sparked entire category of protocols using similar mechanics
- **Cross-chain Expansion**: Successfully bridged to multiple chains including Solana (2025)
- **Sustained Development**: Still actively developing and iterating years later

### What Failed

- **Unsustainable APY**: 7,000% APY requires infinite growth - classic Ponzi structure
- **Death Spiral Risk**: When confidence breaks, stake→sell cascade crashes price
- **Whale Dumping**: DAO leader "shotta" sold $11M causing 40% crash in 2 hours
- **pOHM Controversy**: Private investors got non-diluting tokens (11.8% of rebases forever)
- **Price-Treasury Disconnect**: Token price traded at massive premium to backing
- **Paper Gains Illusion**: "You can only be rich on paper" - eventually people sell
- **Fork Mania**: Dozens of copycats diluted attention and failed spectacularly (Wonderland, etc.)
- **97% Drawdown**: From $3,209 ATH to under $100

### Lessons for $FED

**DO Adopt:**
- ✅ Protocol-owned liquidity concept - $FED already does this via LP fees
- ✅ Game theory framing - holding = good for everyone, selling = bad
- ✅ Treasury accumulation - build reserves from trading fees
- ✅ Staking tiers/multipliers for loyalty (without rebasing)

**DON'T Adopt:**
- ❌ High APY rebasing - unsustainable and attracts mercenary capital
- ❌ Bonding discounts - creates selling pressure when bonds vest
- ❌ Complex token economics that confuse users
- ❌ Private token allocations with special privileges

**Key Insight for $FED:**
The core $FED model is BETTER than OHM because:
1. Rewards come from REAL trading fees, not token inflation
2. USD1 distribution doesn't dilute $FED supply
3. No need for complex bonding/rebasing mechanics
4. Sustainable as long as trading volume exists

### Sources

- [Shrimpy Academy - What Is Olympus DAO](https://academy.shrimpy.io/post/what-is-olympus-dao-ohm-explaining-the-3-3-meme-bonding-and-stablecoins)
- [CoinGecko - What is Olympus DAO](https://www.coingecko.com/research/publications/what-is-olympusdao-and-how-does-it-work)
- [Olympus Medium - Game Theory of Olympus](https://olympusdao.medium.com/the-game-theory-of-olympus-e4c5f19a77df)
- [Yahoo Finance - OlympusDAO Down 93%](https://finance.yahoo.com/news/olympusdao-created-breakthrough-defi-model-194017647.html)
- [The Defiant - Olympus Under Fire](https://thedefiant.io/olympus-under-fire)
- [Protos - DAO Leader Causes Cascade](https://protos.com/rebase-daos-olympus-ohm-leader-dump-cascade-crypto/)
- [CoinDesk - Olympus DAO Future of Money or Ponzi](https://www.coindesk.com/policy/2021/12/05/olympus-dao-might-be-the-future-money-or-it-might-be-a-ponzi)

---

## SAFEMOON

**Date Researched:** 2026-01-21
**Status:** Dead (Chapter 7 Bankruptcy, Executives Charged with Fraud)

### Overview

SafeMoon launched in March 2021 as a "deflationary reflection token with automated liquidity acquisition" on the BNB Chain. It became one of the most hyped meme tokens of the 2021 bull run, reaching a $6 billion market cap at its peak. The core innovation was "reflection tokenomics" - automatic redistribution of transaction fees to holders. However, the project ended in disaster: SEC fraud charges, DOJ arrests, and Chapter 7 bankruptcy in December 2023. CEO John Karony was convicted of conspiracy to commit securities fraud, wire fraud, and money laundering.

### Key Mechanics

1. **Static Reflections (5% Transaction Tax)**
   - Every buy/sell transaction charged 10% fee
   - 5% redistributed proportionally to ALL existing holders
   - Holders earn passive rewards simply by holding
   - More tokens you hold = more reflection rewards
   - No staking required - rewards accumulate automatically in wallet

2. **Automatic Liquidity Pool (Auto-LP)**
   - Remaining 5% split: half sold for BNB, half paired as liquidity
   - Smart contract automatically adds to PancakeSwap LP
   - Threshold trigger: accumulates until 500B tokens, then auto-converts
   - Goal: Build permanent liquidity, reduce volatility

3. **SafeMoon V2 Updated Tokenomics**
   - 4% reflection to holders
   - 3% to liquidity pool
   - 2% to burn address (deflationary)
   - 1% to "Ecosystem Growth Fund"
   - 1000:1 token consolidation to reduce supply

4. **Technical Implementation (RFI Model)**
   - Based on Reflect Finance (RFI) smart contract
   - Dual accounting: `_rOwned` (reflection) and `_tOwned` (token) balances
   - Fee calculated and distributed during transfer function
   - LP tokens sent to contract owner wallet (security flaw)

### What Worked

- **Viral Marketing**: "SafeMoon Army" cult following created massive FOMO
- **Simple Value Prop**: "Hold and earn" was easy to understand
- **Passive Income Appeal**: Watching token balance grow was addictive
- **Disincentivized Selling**: 10% tax made short-term trading unattractive
- **Auto-LP Building**: Successfully accumulated deep liquidity pools
- **Mobile App/Wallet**: Created user-friendly ecosystem (before collapse)

### What Failed

- **Outright Fraud**: Founders stole $200M+ for luxury cars, homes, travel
- **Unlocked Liquidity**: Promised "locked LP" was never actually locked
- **SEC Violations**: Sold unregistered securities, made false statements
- **Unsustainable Model**: Needed constant new money (Ponzi structure)
- **Smart Contract Bugs**: LP mechanism leaked ~$2M in BNB to contract
- **Centralized Control**: Owner could drain LP at any time
- **99.9% Price Collapse**: From peak to bankruptcy filing
- **Leadership Failure**: CEO arrested, CTO testified against him, creator fled to Russia

### The Fraud Timeline

- **March 2021**: SafeMoon launches, explodes in popularity
- **May 2021**: Peaks at $6B market cap
- **2021-2023**: Gradual decline, broken promises (exchange, blockchain never delivered)
- **November 2023**: SEC charges filed, DOJ arrests CEO and CTO
- **December 2023**: Chapter 7 bankruptcy filed
- **2024**: CEO Karony convicted by Brooklyn jury
- **Creator Kyle Nagy**: Remains at large, believed to be in Russia

### Lessons for $FED

**DO Adopt (Modified):**
- ✅ Simple "hold and earn" messaging - but with REAL yield, not Ponzi mechanics
- ✅ Disincentivize short-term flipping through fee structure
- ✅ Build community identity ("FED Army" parallel to "SafeMoon Army")
- ✅ Mobile-friendly interface for tracking rewards

**DON'T Adopt:**
- ❌ Reflection tax on every transaction - kills trading volume long-term
- ❌ Complex smart contract mechanics that can be exploited
- ❌ Centralized control over liquidity (use locked/burned LP)
- ❌ Promises of features that don't exist yet
- ❌ Any structure that requires new money to pay old holders

**Key Insight for $FED:**
SafeMoon's reflection model was innovative but FUNDAMENTALLY FLAWED because:
1. Rewards came from transaction taxes, not external revenue
2. As volume decreased, rewards decreased → death spiral
3. High tax killed organic trading activity
4. Required constant new buyers (Ponzi)

**$FED's model is superior because:**
1. Rewards come from REAL trading fees, not holder taxes
2. No tax on transfers - encourages trading volume
3. USD1 stablecoin rewards maintain value
4. Sustainable as long as DEX volume exists
5. No smart contract custody of LP (safer architecture)

### Smart Contract Warning

The SafeMoon contract had several critical vulnerabilities that enabled the fraud:
- LP tokens sent to owner wallet, not locked
- Owner could bypass transfer restrictions
- No timelock on admin functions
- Centralized upgrade capability

**For $FED**: The current architecture of distributing from trading fees WITHOUT holding user funds in smart contracts is inherently safer than SafeMoon's model.

### Sources

- [SEC Press Release - SafeMoon Fraud Charges](https://www.sec.gov/newsroom/press-releases/2023-229)
- [CoinDesk - SafeMoon Execs Arrested](https://www.coindesk.com/policy/2023/11/01/sec-charges-safemoon-team-with-fraud-offering-unregistered-crypto-securities)
- [Fortune - SEC Says Executives Withdrew $200M](https://fortune.com/crypto/2023/11/01/sec-allegations-safemoon-200-million-mcclarens-luxury-homes-travel/)
- [CoinBureau - SafeMoon Review](https://coinbureau.com/review/safemoon/)
- [Medium - SafeMoon's Broken Auto LP](https://medium.com/@shillmoondev/safemoons-broken-automatic-lp-and-how-to-fix-it-1bea156bbda5)
- [OKX - SafeMoon Tokenomics](https://www.okx.com/en-us/learn/safemoon-smoon-tokenomics-risks-future)
- [CoinMarketCap - What Is SafeMoon](https://coinmarketcap.com/academy/article/what-is-safemoon-safemoon)
- [Wikipedia - SafeMoon](https://en.wikipedia.org/wiki/SafeMoon)

---

## Template for Research Entry

```markdown
## [Protocol Name]

**Date Researched:** YYYY-MM-DD
**Status:** Active / Dead / Evolved

### Overview
Brief description of what the protocol does.

### Key Mechanics
1. Mechanic 1
2. Mechanic 2
3. Mechanic 3

### What Worked
- Success factor 1
- Success factor 2

### What Failed
- Failure point 1
- Failure point 2

### Lessons for $FED
- Adaptation idea 1
- Adaptation idea 2

### Sources
- Link 1
- Link 2
```

---

*This document is continuously updated by Ralph as he researches protocols.*
