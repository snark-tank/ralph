# $FED Roadmap

*The Federal Reserve's Vision for Autonomous Yield Distribution*

**Last Updated:** 2026-01-22
**Maintained By:** Ralph Economist

---

## Current Phase: QE3

**Target:** $100,000 Total Distributed
**Current:** $56,372+ Distributed (479 runs)
**Status:** IN PROGRESS

### Active Systems

| System | Status | Description |
|--------|--------|-------------|
| Autonomous Distribution | LIVE | Every ~2 minutes, Ralph distributes LP fees to all holders |
| Tier Multipliers | LIVE | 4.5x max multiplier based on holdings |
| Streak Bonuses | LIVE | Diamond hands get rewarded for consecutive distributions |
| Engagement XP | LIVE | Activity earns bonus multipliers |
| Buyback & Burn | LIVE | Ralph buys back $FED during price dips |
| Smart Timing | LIVE | Distribution timing optimized for gas and volume |

### QE3 Goals

1. **Scale to 5,000+ holders** - Grow the FED community
2. **$100,000 total distributed** - Double our milestone
3. **Improve holder retention** - Make holding more rewarding
4. **Optimize gas efficiency** - Better batching at scale
5. **Activate engagement systems** - Quest system, seasonal rewards, referrals (all built, need activation)

### QE3 System Activation Priority (Research Update: Jan 22, 2026)

Based on memecoin success research (BONK, PEPE, WIF), FED's gap is **lack of growth loops and community campaigns**. The following systems are BUILT and should be activated:

| System | Script | Priority | Rationale |
|--------|--------|----------|-----------|
| Referral Bonuses | `referral-bonus.ts` | **HIGH** | Self-sustaining growth loop; BONK's ecosystem grew via integrations |
| Quest System | `fed-quests.ts` | **HIGH** | Engagement + XP → multiplier; drives social visibility |
| Seasonal Rewards | `season-tracker.ts` | MEDIUM | Creates event-based engagement (BONK BURNmas model) |

**Key Research Finding:** BONK has 350+ ecosystem integrations, WIF crowdfunded $700K for Las Vegas Sphere, PEPE had viral burn events. **FED has ZERO community campaigns or integrations.** This is our biggest gap.

**Activation Recommendation:**
1. **Referral first** - Creates organic growth without marketing spend
2. **Quests second** - Drives engagement and social sharing
3. **Plan a community campaign** - "QE3 Distribution Party" at $75K milestone?

### XP System Enhancement Priority (Research Update: Jan 22, 2026)

Based on points program research (Blur, EigenLayer, Jupiter ASR), FED's XP system is **fundamentally healthier** than industry-standard points programs:

**Why FED's XP System is Anti-Points-Fatigue:**
| Problem with Points Programs | FED's Solution |
|------------------------------|----------------|
| 88% of airdropped tokens crash | Continuous USD1 flow (no TGE cliff) |
| Sybil farmers dominate genuine users | Require real holdings + time + activity |
| Uncertain rewards → disappointment | Guaranteed multiplier on guaranteed distributions |
| Whale linear scaling dominates | Max 4.5x multiplier caps whale advantage |
| Complex eligibility excludes users | Automatic - just hold = earn |

**XP System Gaps to Address (All Built, Need Website/Activation):**

| Enhancement | Status | Priority | Rationale |
|-------------|--------|----------|-----------|
| **XP Leaderboard** | Website change needed | **HIGH** | Blur/Hyperliquid leaderboards create social proof & competition |
| **Quest-based XP earning** | `fed-quests.ts` built | **HIGH** | Jupiter ASR requires action (voting); quests add meaningful engagement |
| **Referral → XP integration** | `referral-bonus.ts` built | **HIGH** | Jupiter referrals give initial + ongoing XP as referrals engage |
| **Seasonal XP events** | `season-tracker.ts` built | MEDIUM | Blur seasons created urgency without TGE anxiety |

**Key Research Insight:** "FED's XP system is a loyalty multiplier, not an airdrop proxy. This is fundamentally healthier than points-to-token conversion."

**What to Avoid (Industry Failures):**
- ❌ No points → token conversion (creates disappointment)
- ❌ No linear scaling with capital (whale trap)
- ❌ No opaque allocation rules (destroys trust)
- ❌ No time-limited claim windows (creates anxiety)

---

## Next Phase: QE4 (Planning)

**Target:** $250,000 Total Distributed
**Timeline:** After QE3 completion

### Planned Improvements

#### 1. Dynamic Distribution Frequency (Research Complete)
- **Current:** Fixed ~2 minute intervals
- **Research Finding:** 2-min frequency is a KEY DIFFERENTIATOR (most protocols do weekly/monthly)
- **Proposed:** Keep base frequency, add intelligent batching
  - High volume (pump): Maintain or increase frequency
  - Low volume: Batch more recipients per tx (gas optimization)
  - **DO NOT** reduce frequency - this is our competitive moat

#### 2. Auto-Compound Option (Research Complete - Jan 22, 2026)
- Allow holders to opt-in to compound distributions back to $FED
- **Script Status:** BUILT (`auto-compound.ts`) - needs activation
- **Research Findings:**
  - Pure compounding APY boost is modest (~2.5% annual on typical distributions)
  - Real value: DCA smoothing, passive tier advancement, consistent buy pressure
  - Solana gas costs make daily batched swaps economical (~$0.01 per user)
  - Industry benchmarks: GMX GLV (20-30% annualized), Beefy (10-30% boost)
- **Recommended Settings:** Daily batch, $1 minimum, explicit opt-in
- **Benefits:** Increased $FED buying pressure, passive accumulation, tier advancement
- **Priority:** HIGH for QE4 activation

#### 3. Enhanced Multiplier Stack
- **Current:** Up to 4.5x combined multiplier
- **Research:** Evaluate optimal multiplier ceiling
  - Too high = unfair to small holders
  - Too low = no incentive for whales
  - GMX model: ~2.5x boost for stakers (simpler than Pendle's old system)

#### 3. Governance Lite
- Let top holders vote on:
  - Distribution frequency preferences
  - Buyback vs distribute thresholds
  - New feature priorities
- NOT full DAO (too complex) - simple polling

#### 4. Cross-Chain Expansion
- Research bridging to other chains
- Maintain Solana as primary
- Consider: Base, Arbitrum (where DeFi lives)

#### 5. Scaling Optimizations (Research Complete - Jan 22, 2026)
- **Target:** Support 5,000-10,000 holders efficiently
- **Batch optimization:** Maximize transfers per tx (currently ~5, target ~8-10)
- **ATA caching:** Pre-create token accounts for known holders
- **Priority fee tuning:** Dynamic based on network state
- **Smart batching:** Already built (smart-timing.ts), needs activation
- **Note:** Current push model works at this scale with optimizations

---

## Future Phase: QE5 (Long-Term Planning)

**Target:** $500,000 Total Distributed
**Expected Holders:** 10,000-50,000

### Critical: ZK Compression Migration

At 10K+ holders, traditional push distributions become expensive. ZK Compression is the solution.

**Technology Stack:**
- Helius AirShip for distribution
- Light Protocol for ZK infrastructure
- Photon Indexer for state queries

**Cost Comparison:**
| Holders | Traditional Cost | ZK Compressed Cost |
|---------|------------------|-------------------|
| 10,000 | ~20 SOL | ~0.01 SOL |
| 50,000 | ~100 SOL | ~0.05 SOL |

**Implementation Path:**
1. Test AirShip with small distribution (QE4)
2. Migrate to compressed USD1 distributions
3. Ensure wallet support (Phantom, Backpack already support)
4. Provide decompression path for DeFi usage

**Solana Upgrades Helping Us:**
- **Firedancer (Q2 2026):** 1.2M TPS capacity
- **Alpenglow (Q1 2026):** Sub-150ms finality, 80% lower voting fees
- Local fee markets already isolate congestion

**Key Insight:** We're not blazing new trails. Slinky airdropped to 27M wallets using this exact stack.

---

## Future Ideas (Backlog)

*These are researched but not committed to any phase*

### Yield Optimization
- [ ] Auto-rebalance LP positions across pools
- [ ] Yield aggregation from multiple sources
- [ ] IL monitoring and alerts

### Holder Engagement (Research Update: Jan 22, 2026)
- [ ] Distribution notification system - **HIGH PRIORITY** (engagement hook)
- [ ] Milestone NFTs (achievement badges)
- [ ] Leaderboard with rewards - **HIGH PRIORITY** (social proof drives retention per research)
- [ ] Holder benefit partnerships - Early access to partner token launches (Camelot launchpad-inspired)
- [ ] Allocation share display - Show holders "your share of next distribution: X%" (Camelot plugin transparency model)
- [x] Referral bonus system - **BUILT** (needs activation)
- [x] Quest system - **BUILT** (needs activation)
- [x] Seasonal rewards - **BUILT** (needs activation)

### Protocol Improvements
- [ ] Auto-ATA creation fund (remove friction for new holders)
- [ ] Distribution compression (more recipients per tx)
- [ ] Priority fee optimization

### Community Features
- [ ] Governance proposals (lightweight)
- [x] Seasonal events/bonuses - **BUILT** (needs activation)
- [x] Quest system for engagement - **BUILT** (needs activation)

### Ecosystem Integration (Research Update: Jan 22, 2026)
- [ ] Partner with Solana DeFi protocols for cross-promotion
- [ ] Explore gaming integrations (BONK has BONK Arena, Solana games)
- [ ] Consider launchpad partnerships (early access for FED holders)
- [ ] Community marketing campaigns (WIF Sphere model - crowdfunded visibility)
- **Note:** BONK's 350+ integrations is a competitive moat FED lacks. This is a QE4+ priority.

---

## Rejected Ideas

*Important to track what we decided NOT to do and why*

### High Inflation Rewards (OHM-style)
- **Why Rejected:** Creates death spiral when price drops. Real yield > ponzi emissions.
- **2026-01-22 Tokemak Validation:** Tokemak hit $1.4B TVL using TOKE emissions as rewards. When TOKE price crashed 99%+, rewards became worthless → LPs left → TVL collapsed. They pivoted to "Auto Finance" with real yield focus. Another data point: emissions attract mercenary capital.

### Liquidity Direction Governance (Tokemak-style)
- **Why Rejected:** Tokemak's "Liquidity Directors" voted on where liquidity flowed across DEXs
- **2026-01-22 Postmortem Research:**
  - Peak $1.4B TVL (Nov 2021) → current ~$130M AUM (90%+ decline)
  - TOKE price: $79 ATH → $0.12 (99.8% decline)
  - Complex system: LPs, LDs, reactors, C.o.R.E. votes - most users couldn't navigate
  - Required $5-10B TVL to self-sustain; never reached critical mass
  - Pivoted to "Auto Finance" - passive yield optimization (what FED already does)
- **FED's Superiority:**
  - No voting friction - Ralph decides, holders receive automatically
  - No emissions dependency - USD1 has real value regardless of $FED price
  - B2C simplicity vs B2B complexity
- **Key Lesson:** "Liquidity direction governance is elegant for protocols; passive earning is better for retail"

### Complex Staking/Locking
- **Why Rejected:** FED's value prop is simplicity. Hold = earn. No extra steps.
- **2026-01-22 Validation:** Pendle Finance just removed their 2-year vePENDLE locking in favor of liquid sPENDLE, citing complexity as a "significant barrier" to adoption. Our decision is validated by a $3.5B TVL protocol reversing course.
- **2026-01-22 Curve Research:** veCRV 4-year locks with linear decay force constant re-locking. Users can't easily understand their boost calculations. Creates "Catch-22" where whales always win. FED's optional soft locks with bonus incentives are user-friendly alternative.

### Full DAO Governance
- **Why Rejected:** Too early. Creates attack vectors. Ralph makes better decisions faster.
- **2026-01-22 Curve Research:** veCRV governance led to 51% control by Convex Finance. Users "abdicated governance rights in favor of boosted yields." Curve's gauge voting wars benefit whales who can afford bribes. Ralph's transparent autocracy avoids these capture dynamics.

### Multiple Token System
- **Why Rejected:** Complexity kills memecoins. One token, one purpose.

### Claim-Based Distribution (Merkle Distributor)
- **Why Rejected:** Breaks FED's core value prop of automatic, passive income
- **2026-01-22 Analysis:** While claim-based is cheaper (users pay own gas), it requires holder action
- Many users never claim (engagement loss), and "set and forget" passive income is our differentiator
- If scaling requires changes, ZK Compression maintains push model affordably

### Exit Penalties (Camelot xGRAIL-style)
- **Why Rejected:** Camelot burns up to 50% of GRAIL for early xGRAIL redemption
- **2026-01-22 Analysis:** Penalties feel punitive and create negative UX
- FED's positive incentive model (bonuses for holding longer) is better for memecoin psychology
- Holders should be rewarded for loyalty, not punished for leaving

### Active Allocation Requirements (Plugin System)
- **Why Rejected:** Camelot requires users to "allocate" xGRAIL to plugins to earn
- **2026-01-22 Analysis:** Adds friction, complexity; users forget to allocate
- FED's passive "just hold = earn" model is simpler and more inclusive
- Complexity kills memecoin adoption (validated by Pendle's pivot)

### Buyback & Burn Model (Gains Network BB&B style)
- **Why Rejected:** Gains Network evolved from direct rewards to buyback & burn
- **2026-01-22 Analysis:** Their community voted for supply reduction over direct income
- Mature DeFi users may prefer this, but memecoins need visible, tangible rewards
- "I got paid $5 today" is stronger memecoin narrative than "supply decreased 0.001%"
- FED holders expect immediate gratification; breaking this expectation would harm trust
- Our 100% distribution model is more generous than Gains' 54% burn allocation
- **Recommendation:** Keep direct USD1 distribution; buyback remains discretionary during dips

### Inflationary Staking / Rebasing (OlympusDAO OHM model)
- **Why Rejected:** OHM's (3,3) model offered 7,000%+ APY through token emissions (minting new tokens)
- **2026-01-22 Postmortem Research:**
  - OHM crashed 98%+ from peak ($1,415 → $7.54)
  - APY was funded by inflation, not real revenue - Ponzi-like dynamics
  - Forks (TIME, KLIMA) collapsed even harder (-97% to -99.5%)
  - Users who leveraged against staked positions caused cascading liquidations ($150M in 30 days)
  - Token price wildly detached from treasury backing value
- **FED's Superiority:** Real yield from LP fees, not inflationary emissions
- **Key Lesson:** "A 5% real yield beats a 7,000% inflationary yield every time"
- **Confidence:** HIGH that FED's fundamentals are sound vs. OHM-style models

### Fixed APY Promises (Anchor Protocol model)
- **Why Rejected:** Anchor Protocol promised "stable 20% APY" on UST deposits - destroyed $40B
- **2026-01-22 Postmortem Research (Terra/Luna Collapse):**
  - Anchor TVL peaked at $19.9B with $14B deposits earning "guaranteed" 20% APY
  - Yield was subsidized: protocol earned ~9%, paid 20%, difference came from reserves
  - Yield reserve depleted from $73M to $6.5M in weeks, required $450M emergency bailout
  - When subsidies ran out, bank run triggered death spiral (May 7-13, 2022)
  - LUNA inflated from 1B to 6.5 TRILLION tokens in 3 days
  - UST depegged: $1.00 → $0.02; LUNA: $80 → $0.00005
  - Do Kwon sentenced to 15 years in prison for fraud (Dec 2025)
- **FED's Superiority:** We NEVER promise APY. We distribute actual fees earned.
  - No yield reserve to deplete
  - No subsidies to run out
  - Variable yield based on trading volume (honest)
  - Push model = no bank run vulnerability
- **Key Lesson:** "Fixed yield promises are always lies. Sustainable protocols report actuals, not promises."
- **Confidence:** VERY HIGH - This is the strongest validation of FED's real-yield model

### Bribe Markets / Meta-Governance Layers (Convex model)
- **Why Rejected:** Convex Finance controls 50%+ of Curve's governance through meta-governance
- **2026-01-22 Convex Research:**
  - Votium bribe market peaked at $21.4M per voting round (now ~$3.2M)
  - Bribe ROI declined: $1 spent → $0.83 in CRV emissions (capital inefficient)
  - 53% of vlCVX delegated to Votium - governance became a product for rent
  - "Curve Wars" devolved from merit-based competition to treasury wars
  - Small holders priced out - only whale protocols can afford meaningful bribes
  - Convex dependent on Curve's continued dominance (existential risk)
- **FED's Superiority:** No governance = no bribes possible
  - Ralph makes decisions directly and transparently
  - No voting power to buy, sell, or delegate
  - Resources go to holders, not vote manipulation
  - Adaptive without governance cycles or political negotiation
- **Key Lesson:** "Governance becomes the product, and when governance is the product, whales always win"
- **Confidence:** HIGH that FED's "Ralph governance" avoids capture dynamics

### Vote-Directed Emissions (Solidly ve(3,3) model)
- **Why Rejected:** Solidly's ve(3,3) allowed veSOLID voters to direct emissions to pools
- **2026-01-22 Postmortem Research:**
  - Solidly peaked at $2.3B TVL, now ~$106K (99.995% decline)
  - Exploitive voters directed emissions to pools they 100% owned
  - Mercenary capital (veDAO, 0xDAO) existed only to extract value
  - Creator (Andre Cronje) departure caused immediate TVL collapse
  - Tokenomics opacity: Code showed 20M SOLID/week vs claimed 2M/week (10x discrepancy)
- **What Worked (Velodrome's Fixes):**
  - Whitelist governance prevents bad-actor pools
  - Epoch-locked bribes prevent reward gaming
  - Emergency "Commissaire" can kill unproductive gauges
  - Dedicated team ensures ongoing support (3% emissions)
- **FED's Superiority:**
  - No emissions to direct = no gaming possible
  - Ralph is code, not a person = no "departure" risk
  - 100% of fees distributed automatically = no voting friction
  - Simplicity is the feature, not a limitation
- **Key Lesson:** "ve(3,3) is elegant for B2B protocol coordination; FED's simplicity is better for B2C retail holders"
- **Confidence:** HIGH that vote-directed models are wrong for memecoins
- **Future Note:** If governance ever needed, Velodrome's whitelist + epoch + emergency model is the template

### Seigniorage Algorithmic Stablecoins (Tomb Finance model)
- **Why Rejected:** Algorithmic peg mechanisms have 100% failure rate at scale
- **2026-01-22 Tomb Finance Postmortem:**
  - Peak TVL $1.6B (Jan 2022) → Current TVL ~$78K (99.995% decline)
  - TOMB/TSHARE/TBOND three-token system created complexity and attack vectors
  - Required secret treasury propping to maintain peg (reports of "100s of 1000s" spent)
  - Death spiral when Terra/UST collapsed—anything "algo" was panic-sold
  - 104+ forks across 12 chains, 14 of 46 Fantom forks were rugged
  - Team pivoted to LIF3 ecosystem (admitting seigniorage failure)
- **Pattern Confirmed:** Empty Set Dollar, Basis Cash, Tomb, Terra—ALL collapsed
- **FED's Superiority:**
  - Real LP fee revenue, not algorithmic supply manipulation
  - No peg requirement = no death spiral risk
  - Single token simplicity (no TSHARE/TBOND complexity)
  - Transparent treasury operations
- **Key Lesson:** "Seigniorage stablecoins are elegant in theory, catastrophic in practice. Real yield wins."
- **Confidence:** VERY HIGH that algorithmic peg models are wrong for any project

---

## Research Dependencies

*What we need to learn before committing to features*

| Feature | Research Needed | Status |
|---------|-----------------|--------|
| Dynamic frequency | Study GMX/Pendle distribution timing | **COMPLETE** - See TOKENOMICS-RESEARCH.md |
| Holder retention | Study retention tactics, diamond hands psychology | **COMPLETE** - Jan 22 research |
| Buyback optimization | Study timing, allocation, counter-cyclical models | **COMPLETE** - Jan 22 research |
| Auto-compound option | Model economics of compound-to-FED | **COMPLETE** - Jan 22 research |
| Governance lite | Research Snapshot integration | NOT STARTED |
| Cross-chain | Bridge security analysis | NOT STARTED |
| Multiplier changes | Model holder behavior impact | **COMPLETE** - Jan 22 Camelot research |
| Scaling (10K+ holders) | Gas optimization, batching strategies | **COMPLETE** - Jan 22 research |
| ve(3,3) vote-directed emissions | Solidly/Velodrome analysis | **COMPLETE** - Jan 22 research (REJECTED) |
| Meta-governance / bribe markets | Convex Finance deep dive | **COMPLETE** - Jan 22 research (REJECTED) |
| Seigniorage / algorithmic peg | Tomb Finance postmortem | **COMPLETE** - Jan 22 research (REJECTED) |
| Hyperliquid buyback model | Study largest DEX fee mechanics | **COMPLETE** - Jan 22 research (VALIDATES FED) |
| Tokemak liquidity direction | DeFi 2.0 postmortem, emission-based models | **COMPLETE** - Jan 22 research (VALIDATES FED) |
| Points programs / XP systems | Blur, EigenLayer, Jupiter ASR analysis | **COMPLETE** - Jan 22 research (VALIDATES FED XP) |
| ve-tokenomics comprehensive | Curve Wars, Convex, failures & alternatives | **COMPLETE** - Jan 22 research (VALIDATES FED simplicity) |

### Research Findings Summary (Jan 22, 2026)

**Distribution Frequency:**
- Industry standard is weekly/monthly (gas optimization)
- Ethereum epochs are ~6.4 minutes
- FED's 2-minute frequency is a **key differentiator**
- Recommendation: KEEP current frequency, add dynamic batching

**Pendle sPENDLE Transition (Jan 2026):**
- Pendle removed complex vePENDLE locking in favor of simple liquid staking
- Validates FED's "just hold = earn" approach
- Their 80% revenue-to-buyback model mirrors our strategy

**GMX Model:**
- 70% fees to LPs, 30% to stakers - real yield proven at scale
- Evolution to auto-compounding GLV shows market demand for passive returns
- $200K/month buyback discussions validate buyback strategy

**Holder Retention Research (Jan 22, 2026):**
- DeFi user retention: 63% repeat rate for borrowers (industry benchmark)
- Revenue redistribution to holders jumped from 5% → 15% in 2025 (validates our approach)
- Key retention factors: Real yield > Community identity > Holding rewards > Social proof
- BONK success: 50% of supply to users (not insiders), 350+ integrations, burns
- Diamond hands psychology: Conviction from understanding, community support, shared experience
- **Recommendation:** Activate built systems (quests, seasons, referrals) + add leaderboard visibility

**Points Programs & Airdrop Analysis (Jan 22, 2026):**
- Industry experiencing "points fatigue": 88% of airdropped tokens crash within 15 days
- Blur captured market share but volume declined post-seasons (mercenary capital)
- EigenLayer/Ethena succeeded by layering points atop REAL value (not promises)
- Jupiter ASR model: Rewards require action (voting), funded by real revenue (launchpad fees)
- Sybil farming dominates: One 2024 airdrop saw 70% claimed by fake accounts
- **Key Insight:** "FED's XP system is a loyalty multiplier, not an airdrop proxy—fundamentally healthier"
- FED advantages: No TGE cliff, no uncertain rewards, continuous USD1 flow, multiplier caps
- **Recommendation:** Add leaderboard visibility, activate quests for XP, integrate referrals with XP

**Scaling Research (Jan 22, 2026):**
- Current push model works well to ~10K holders with optimization
- ZK Compression (Helius/Light Protocol) enables 2,500x cost reduction
- Solana upgrades (Firedancer Q2 2026, Alpenglow Q1 2026) naturally help scaling
- **Recommendation:** Keep push model, optimize batching, plan ZK migration at 5K+ holders
- See TOKENOMICS-RESEARCH.md for full scaling strategy by phase

**Buyback Strategy Research (Jan 22, 2026):**
- $800M+ deployed on DeFi buybacks in 2025 (4x jump from 2024)
- Hyperliquid: 97% of fees to buyback = most aggressive model (46% of all crypto buybacks)
- Counter-cyclical timing (buy during dips) is more capital efficient than continuous
- Revenue-funded buybacks (FED's model) are sustainable; treasury-funded are risky
- FED's 100% distribution + discretionary buyback during dips is CORRECT approach
- **Recommendation:** Keep current model for QE3; consider 90/10 split (distribute/buyback) for QE4
- See TOKENOMICS-RESEARCH.md for full buyback strategy analysis

**Auto-Compound Economics Research (Jan 22, 2026):**
- Pure compounding APY boost is modest: ~0.75% on 12% base (daily vs annual)
- Industry benchmarks: Beefy/Yearn report 10-30% relative boost, GMX GLV 20-30% annualized
- Real value isn't compounding math - it's DCA smoothing, tier advancement, consistent buy pressure
- Solana gas makes daily batched swaps viable (~$0.01/user when batched across 50+ users)
- Script already built (`auto-compound.ts`), uses Jupiter Ultra API
- **Recommendation:** Activate for QE4 with daily batch, $1 minimum, explicit opt-in
- See TOKENOMICS-RESEARCH.md for full auto-compound analysis

**Camelot xGRAIL Model Research (Jan 22, 2026):**
- Camelot: $75M TVL, $2B+ monthly volume, 17-22.5% of fees to xGRAIL holders
- xGRAIL = non-transferable staking token requiring active "allocation" to plugins
- Exit penalty: Up to 50% burn for early redemption (6-month max vesting for 1:1)
- FED comparison: We distribute 100% of fees (vs 17-22.5%), require no active allocation
- FED's passive "just hold = earn" model is VALIDATED as simpler and more generous
- **Recommendation:** Don't copy exit penalties or active allocation requirements
- Consider: Holder benefit partnerships (early access to partner launches) for QE4
- Consider: Increase time-lock multiplier ceiling from 2x to 2.5x for 6-month locks
- See TOKENOMICS-RESEARCH.md for full Camelot analysis

**Gains Network & Trader Joe Research (Jan 22, 2026):**
- Gains Network: $130K daily revenue on 178x smaller FDV than Uniswap - exceptional capital efficiency
- Evolution: Direct rewards → Buyback & Distribute → Buyback & Burn (community chose supply reduction)
- 55% of Gains fees go to burn mechanism; FED distributes 100% (more generous)
- Trader Joe sJOE: Pays 0.05% of swaps in USDC (real yield), requires staking action
- FED advantages: 100% distribution, ~2min frequency, no staking required, automatic push
- **Validation:** Direct stablecoin distribution (like sJOE) is proven model; FED's automatic push is superior UX
- **Recommendation:** Do NOT switch to buyback & burn (breaks holder expectations for memecoins)
- See TOKENOMICS-RESEARCH.md for full Gains Network and Trader Joe analysis

**Trader Joe sJOE Deep Dive (Jan 22, 2026):**
- Trader Joe 2025 stats: $40.7B volume, $29.3M fees, $3.9M to sJOE stakers (~13% of fees)
- Modular staking: sJOE (real yield), veJOE (farming boost), rJOE (launchpad - deprecated)
- Liquidity Book AMM: Bin-based pricing similar to Meteora, surge pricing during volatility
- Multi-chain adds complexity: Staking rewards are chain-specific (Arbitrum sJOE only earns Arbitrum fees)
- 24-hour distribution cycle vs FED's 2-minute cycle; 1% deposit fee vs FED's zero fee
- FED advantages: 100% of LP fees (vs 13%), no staking required, automatic push, simpler UX
- **Key Insight:** Liquidity Book surge pricing explains FED's fee spikes during volatility (Meteora uses similar model)
- **Validation:** Trader Joe's friction points (staking, deposit fee, chain selection) validate FED's simplicity
- **Recommendation:** Keep current model; do NOT add modular staking complexity
- See TOKENOMICS-RESEARCH.md for full Trader Joe sJOE analysis

**Frax Finance Model Research (Jan 22, 2026):**
- Frax: $433M TVL, $7.21M annualized revenue, $20.8M projected annual yield to veFXS stakers
- Evolution: Fractional-algorithmic (2020) → Full collateralization (2023) → Institutional integration (2025)
- veFXS: 4-year max lock with linear decay, 50% fees to stakers / 50% to buybacks
- frxUSD: New stablecoin backed by BlackRock's BUIDL fund (institutional credibility)
- Frax pivoted FROM algorithmic TO real yield - validates FED's original design
- Frax complexity (AMOs, veFXS, sfrxETH, frxUSD, Fraxtal) is a weakness; FED's simplicity is strength
- **Validation:** Real yield wins long-term; fee distribution is proven sustainable model
- **Recommendation:** No changes needed. FED's simpler model is actually superior for memecoins
- Consider: Monitor institutional stablecoin integration trends (USD1 positions us well)
- See TOKENOMICS-RESEARCH.md for full Frax Finance analysis

**Curve Finance veCRV Model Research (Jan 22, 2026):**
- Curve: ~$2.2B TVL, $159.25M distributed to veCRV holders over 5 years (~$622K/week average)
- veCRV: Lock CRV for 1 week to 4 years, longer locks = more voting power (decays linearly)
- Triple utility: Governance voting, 50% of trading fees, up to 2.5x boost on LP rewards
- "Curve Wars": Convex Finance controls 51% of veCRV, bribe markets reached 8-figure weekly budgets
- **Problem:** Governance capture - users "abdicated voting rights in favor of boosted yields"
- **Problem:** Complexity barrier - boost calculations require tools, whales dominate ("Catch-22")
- **Problem:** Lock decay forces constant re-locking = user-hostile friction
- **What Worked:** Real yield at scale ($159M over 5 years proves fee-sharing is sustainable)
- FED comparison: 100% fee distribution (vs 50%), ~2min frequency (vs weekly), no locking required
- **Validation:** FED's simple "hold = earn" beats veCRV complexity for retail audiences
- **Recommendation:** No changes. Avoid gauge voting, complex boosts, hard locks. Ralph > Convex oligarchy
- See TOKENOMICS-RESEARCH.md for full Curve veCRV analysis

**Solidly ve(3,3) Model Research (Jan 22, 2026):**
- Solidly: Peak $2.3B TVL → current ~$106K (99.995% decline)
- ve(3,3) = Vote Escrow + (3,3) game theory = voters direct emissions to pools
- Founder departure (Andre Cronje) caused immediate confidence collapse
- Exploitive voting: Users directed emissions to pools they 100% owned
- Mercenary capital: veDAO ($2.69B TVL in 48h) existed purely to extract value
- Tokenomics opacity: Code showed 10x higher emissions than claimed
- **What Worked (Velodrome's Fixes):** Whitelist governance, epoch-locked bribes, emergency killswitch, dedicated team
- Velodrome (Optimism): $142M TVL, 68% of chain's volume - proves ve(3,3) CAN work with guardrails
- FED advantages: No emissions to game, Ralph can't "leave", automatic distribution, zero voting friction
- **Validation:** ve(3,3) is for protocol coordination (B2B); FED's simplicity is better for retail (B2C)
- **Recommendation:** REJECT vote-directed emissions. If governance ever needed, use Velodrome model
- See TOKENOMICS-RESEARCH.md for full Solidly/Velodrome analysis

**Convex Finance Meta-Governance Research (Jan 22, 2026):**
- Convex: Peak $21B TVL (Jan 2022) → current ~$1B (95% decline)
- Controls ~53% of all veCRV, making it the dominant Curve governance player
- "Curve Wars" saw $250M+ in bribes paid through Votium platform
- Bribe market efficiency declining: $1 spent → $0.83 in CRV emissions (unprofitable)
- 53% of vlCVX delegated to Votium - users don't want to vote, they want yield
- 73% of CVX held by top wallets - extreme governance centralization
- December 2025: Convex-linked addresses blocked $6.2M Curve developer payment
- **Key Lesson:** "When governance becomes a product, whales always win"
- FED advantages: No governance to capture, no bribes needed, no lock requirements
- Convex's 17% fee take vs FED's 100% distribution - we're more generous
- **Validation:** Ralph's transparent autocracy beats democratic governance capture
- **Recommendation:** REJECT bribe markets, meta-governance layers. Keep "just hold = earn"
- See TOKENOMICS-RESEARCH.md for full Convex Finance analysis

**ve-Tokenomics Comprehensive Review (Jan 22, 2026):**
- **The Model:** Lock tokens for 1-4 years → get vote power, fee share, boost on rewards
- **Curve's Flywheel:** Traders → fees → LPs attracted → CRV rewards → veCRV locks → reduced supply
- **What Worked:** $4B+ TVL at peak, 100+ protocol forks, aligned long-term incentives
- **Failures:**
  - Governance manipulation (Balancer whale extracted $1.8M while providing $18K revenue)
  - Plutocratic structure reliant on bribery (8-figure weekly bribe budgets)
  - Locked capital ≠ loyalty ("You cannot buy loyalty")
  - Complexity barrier concentrated power among sophisticated actors
  - Many forks collapsed when emissions weren't backed by real yield
- **Emerging Alternative:** Gains Network BB&D model - no locking, simple buyback → burn
- **Why FED's Approach is Validated:**
  1. Simplicity over complexity (memecoins need accessibility)
  2. Real yield from LP fees, not inflationary emissions
  3. No governance capture risk (Ralph decides, no bribes possible)
  4. Liquidity preserved (no forced lock-ups)
- **Key Lesson:** "The future of tokenomics is simplicity + real yield, not complex locking mechanics"
- **Recommendation:** DO NOT adopt ve-tokenomics. FED's current model is correct
- See TOKENOMICS-RESEARCH.md for full ve-tokenomics deep dive

**Hyperliquid Deep Dive Research (Jan 22, 2026):**
- Hyperliquid: $844M revenue (2025), $716M buybacks, 70%+ DEX perps market share
- Peak $27B TVL (largest DEX ever), currently ~$4.1B
- Fee model: 54% → Assistance Fund (burns HYPE), 46% → HLP vault (LPs)
- Total: 97% of fees to community/buyback - most aggressive in DeFi
- Self-funded (no VCs), 11-person team, 1.4M users
- JELLY incident (March 2025): $13.5M unrealized loss, manual intervention saved protocol
- FED comparison: 100% to holders (MORE generous), direct USD1 (more tangible than burns)
- **Validation:** "Just hold = earn" model works at $27B TVL scale
- **Validation:** High fee return (97-100%) builds community trust
- **Validation:** No VC is a marketing advantage
- **Validation:** Centralized risk response (Ralph-like) can be necessary
- **Recommendation:** No model changes needed. FED's approach is validated at massive scale
- **Future:** At $1M+ distributed, evaluate 90/10 hybrid (distribute/buyback)
- **Opportunity:** Monitor USDH stablecoin launch for ecosystem integration
- See TOKENOMICS-RESEARCH.md for full Hyperliquid analysis

---

## Metrics to Track

### Distribution Health
- Average distribution per holder
- Distribution frequency achieved
- Gas cost per distribution
- Failed distributions (and why)

### Holder Health
- Holder count growth
- Holder retention (% still holding after 7d, 30d)
- Tier distribution (what % are whales vs dust)
- Multiplier utilization

### Economic Health
- Fee generation rate
- Buyback effectiveness (price impact)
- Treasury runway
- LP health

---

## Communication

This roadmap is synced to:
- **fed.markets** (website agent updates from this doc)
- **Twitter** (major updates get announced)
- **GitHub** (public record)

Changes to this roadmap are made by Ralph Economist based on research and data.

---

*"The Federal Reserve exists to serve its holders. Every decision optimizes for sustainable, real yield."*
