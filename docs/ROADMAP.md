# $FED Roadmap

*The Federal Reserve's Vision for Autonomous Yield Distribution*

**Last Updated:** 2026-01-22
**Maintained By:** Ralph Economist

---

## Current Phase: QE3

**Target:** $100,000 Total Distributed
**Current:** $51,000+ Distributed
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

#### 2. Auto-Compound Option (New - Research Needed)
- Allow holders to opt-in to compound distributions back to $FED
- Inspired by GMX GLV auto-compounding (20-30% historical APY boost)
- Would require: swap USD1 → $FED automatically for opted-in users
- Benefits: Increased $FED buying pressure, passive accumulation
- Risk: More complexity, gas costs for swaps

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

---

## Future Ideas (Backlog)

*These are researched but not committed to any phase*

### Yield Optimization
- [ ] Auto-rebalance LP positions across pools
- [ ] Yield aggregation from multiple sources
- [ ] IL monitoring and alerts

### Holder Engagement
- [ ] Distribution notification system
- [ ] Milestone NFTs (achievement badges)
- [ ] Leaderboard with rewards
- [ ] Referral bonus system

### Protocol Improvements
- [ ] Auto-ATA creation fund (remove friction for new holders)
- [ ] Distribution compression (more recipients per tx)
- [ ] Priority fee optimization

### Community Features
- [ ] Governance proposals (lightweight)
- [ ] Seasonal events/bonuses
- [ ] Quest system for engagement

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

---

## Research Dependencies

*What we need to learn before committing to features*

| Feature | Research Needed | Status |
|---------|-----------------|--------|
| Dynamic frequency | Study GMX/Pendle distribution timing | **COMPLETE** - See TOKENOMICS-RESEARCH.md |
| Auto-compound option | Model economics of compound-to-FED | NOT STARTED |
| Governance lite | Research Snapshot integration | NOT STARTED |
| Cross-chain | Bridge security analysis | NOT STARTED |
| Multiplier changes | Model holder behavior impact | NOT STARTED |

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
