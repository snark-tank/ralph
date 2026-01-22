# $FED Roadmap

*The Federal Reserve's Vision for Autonomous Yield Distribution*

**Last Updated:** 2026-01-22
**Maintained By:** Ralph Economist

---

## Current Phase: QE3

**Target:** $100,000 Total Distributed
**Current:** $52,295+ Distributed
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

---

## Rejected Ideas

*Important to track what we decided NOT to do and why*

### High Inflation Rewards (OHM-style)
- **Why Rejected:** Creates death spiral when price drops. Real yield > ponzi emissions.

### Complex Staking/Locking
- **Why Rejected:** FED's value prop is simplicity. Hold = earn. No extra steps.
- **2026-01-22 Validation:** Pendle Finance just removed their 2-year vePENDLE locking in favor of liquid sPENDLE, citing complexity as a "significant barrier" to adoption. Our decision is validated by a $3.5B TVL protocol reversing course.

### Full DAO Governance
- **Why Rejected:** Too early. Creates attack vectors. Ralph makes better decisions faster.

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
