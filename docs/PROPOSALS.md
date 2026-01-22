# $FED Mechanism Proposals

*Research-backed proposals for evolving FED's tokenomics*

**Purpose:** When Ralph Economist has strong conviction about a mechanism change, it's documented here with full rationale. Treasury agent implements approved proposals.

---

## Proposal Status Legend

- **Draft** - Initial write-up, needs more research
- **Under Review** - Research complete, evaluating
- **Approved** - Ready for Treasury implementation
- **Implemented** - Live in production
- **Rejected** - Decided against (with rationale)

---

## Active Proposals

### Proposal: Optional Auto-Compound to $FED
**Date:** 2026-01-22
**Status:** Draft

#### Summary
Allow holders to opt-in to automatically convert their USD1 distributions back into $FED tokens, enabling passive accumulation without manual intervention.

#### Rationale
- **GMX Evolution:** GMX's move from GLP to GLV with auto-compounding achieved 20-30% historical annualized performance boost. The market clearly wants passive, optimized returns.
- **Reduces Sell Pressure:** Instead of holders receiving USD1 and potentially selling $FED to get more USD1, compounders continuously buy $FED.
- **Simplicity Preserved:** Opt-in only. Default behavior (receive USD1) unchanged. No mandatory complexity.
- **Compound Effect:** Small distributions compound faster when reinvested immediately vs. manual monthly buys.
- **Studied:** GMX GLV auto-compound, Pendle's fee distribution → token model

#### Mechanism
1. **Opt-In Registry:** Holders send a small tx (or sign message) to register for auto-compound
2. **Distribution Flow (Auto-Compound On):**
   - Calculate holder's USD1 distribution
   - Instead of sending USD1, swap USD1 → $FED via LP
   - Send $FED to holder's wallet
3. **Distribution Flow (Auto-Compound Off):** Unchanged - receive USD1 as normal
4. **Opt-Out:** Can disable at any time via same registry mechanism

#### Risks
1. **Gas Costs:** Each swap adds ~0.005 SOL gas. At scale, this adds up.
   - Mitigation: Batch swaps for multiple compounders in single tx
2. **Slippage:** Low-value distributions may suffer poor swap rates
   - Mitigation: Set minimum threshold (e.g., $0.50 USD1) before swap executes
   - Below threshold: Accumulate until threshold met, then swap
3. **Complexity:** Adds new opt-in state to track
   - Mitigation: Simple boolean flag per wallet in registry
4. **LP Impact:** Constant small buys may not meaningfully impact price
   - Counter: Aggregate buying pressure over time IS meaningful

#### Implementation Notes (For Treasury)
- New script: `auto-compound-registry.ts` - tracks opt-in wallets
- Modify distribution logic to check registry before sending
- Use Jupiter or direct LP swap for USD1 → $FED conversion
- Batch multiple compound swaps in single transaction where possible
- Track compound volumes separately in metrics

#### Expected Impact
- **Bullish:** More consistent $FED buying pressure
- **Retention:** "Set and forget" attracts passive holders
- **Differentiation:** Few memecoins offer this sophistication
- **Scalability:** Works better at higher holder counts (more batching)

#### Success Metrics
- % of holders opting in
- Volume of $FED purchased via compound
- Retention rate of compounders vs. non-compounders

#### Research Links
- [GMX GLV Documentation](https://gmxio.gitbook.io/gmx/glp)
- [Pendle sPENDLE Announcement](https://coinmarketcap.com/academy/article/pendle-launches-spendle-token-with-flexible-staking)

---

---

## Implemented Proposals

### Proposal: Tier-Based Distribution Multipliers
**Date:** 2026-01-15
**Status:** Implemented

#### Summary
Holders receive multiplied distributions based on their $FED holdings tier.

#### Rationale
- Incentivizes accumulation
- Rewards committed holders
- Creates aspirational holding targets
- Studied: GMX's staking tiers, Pendle's vePENDLE model

#### Mechanism
| Tier | Holdings | Multiplier |
|------|----------|------------|
| Governor | 1M+ | 4.5x |
| Director | 100K+ | 2.5x |
| Member | 10K+ | 1.5x |
| Citizen | 1K+ | 1.0x |

#### Implementation
Script: `distribute-tokens.ts`
Live since: 2026-01-16

---

### Proposal: Streak Bonuses (Diamond Hands)
**Date:** 2026-01-17
**Status:** Implemented

#### Summary
Holders who receive consecutive distributions without selling get bonus multipliers.

#### Rationale
- Discourages selling after distributions
- Rewards loyalty over time
- Creates "don't break your streak" psychology
- Studied: Duolingo streak mechanics, gaming retention

#### Mechanism
- 5+ consecutive: 1.1x bonus
- 20+ consecutive: 1.15x bonus
- 50+ consecutive: 1.25x bonus

#### Implementation
Script: `streak-tracker.ts`
Live since: 2026-01-18

---

### Proposal: Buyback During Dips
**Date:** 2026-01-19
**Status:** Implemented

#### Summary
When price drops significantly, Ralph uses treasury to buy back and burn $FED instead of distributing.

#### Rationale
- Provides price support during corrections
- Burns supply, benefiting all holders
- Studied: Pendle buyback model, CAKE burns
- Better use of treasury during fear periods

#### Mechanism
- If 1h price change < -10%: Initiate buyback
- If 24h price change < -20%: Larger buyback
- Burn purchased tokens (remove from supply)

#### Implementation
Script: Treasury decision logic
Live since: 2026-01-20

---

## Rejected Proposals

### Proposal: Staking/Locking Mechanism
**Date:** 2026-01-18
**Status:** Rejected

#### Summary
Require holders to stake/lock tokens to receive distributions.

#### Why Rejected
- Adds friction to FED's core value prop (hold = earn)
- Complexity kills memecoin adoption
- Gas costs for staking transactions
- "Just hold" is our differentiation

---

### Proposal: Distribution Lottery
**Date:** 2026-01-17
**Status:** Rejected

#### Summary
Random selection of holders for larger individual distributions.

#### Why Rejected
- Unfair to consistent holders
- Gambling mechanics bring regulatory risk
- Against FED's "everyone gets paid" ethos
- Studied: Lottery tokens - usually fail

---

## Proposal Template

```markdown
## Proposal: [Name]
**Date:** YYYY-MM-DD
**Status:** Draft

### Summary
[1-2 sentence description]

### Rationale
[Why this change? What research supports it?]
- Point 1
- Point 2
- Studied: [relevant projects/models]

### Mechanism
[How would it work technically?]

### Risks
[What could go wrong?]

### Implementation Notes
[Technical details for Treasury agent]

### Research Links
- [Link 1]
- [Link 2]
```

---

*Proposals are created by Ralph Economist based on research. Implementation by Ralph Treasury.*
