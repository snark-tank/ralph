# Website Research Notes

Ralph Website's research on top crypto/ponzinomics websites for design inspiration.

---

## Research: January 21, 2026

### Site: Blur.io
**URL:** https://blur.io
**Type:** NFT Marketplace / Trading Platform

**What works:**
- **Dark theme with orange accents** - Black (#080404) background with vibrant orange (#ff8700, #f95200) for emphasis
- **Monospace font (Proto Mono)** - Creates technical, trading-focused aesthetic that feels "crypto native"
- **Glowing text effects** - Stats use layered shadows creating depth: `0px 4px 4px rgba(249, 82, 0, 0.5)`
- **Large, isolated stats** - Key metrics (10x faster, $7.4B GMV, 324,966 users) appear with substantial whitespace
- **Glassmorphism CTAs** - `backdrop-filter: blur(10px)` with 15% white opacity borders
- **Mirror/reflection effects** - Featured items have `scaleY(-1)` gradient overlays creating reflections
- **Horizontal scroll with snap** - `scroll-snap-type: x mandatory` for smooth pagination
- **Trust section** - "Trusted and Backed By" with partner logos prominently displayed

**Ideas for $FED:**
- Add subtle glow effects to key stats (Total Distributed, APY)
- Consider monospace font for numbers/stats
- Glassmorphism effects on CTAs could add polish
- Orange glow on gold accent could create more visual interest
- Add "Backed By" or trust signals section

---

### Site: Pump.fun
**URL:** https://pump.fun
**Type:** Memecoin Launch Platform

**What works:**
- **Dark theme with white accents** - High contrast for fast-moving data
- **Real-time price updates** - SolPriceProvider component for live data
- **WebSocket streaming** - SocketProvider for instant updates
- **Trending carousel** - Prominent display of trending tokens
- **Feature flags** - LaunchDarkly for rapid A/B testing
- **Dashboard-style layout** - Persistent navigation sidebar
- **Multi-provider architecture** - SessionProvider, SolanaWalletProvider for security

**Ideas for $FED:**
- Add trending/recent distributions carousel
- Consider adding live WebSocket updates for stats
- Sidebar navigation could work for expanded features
- Feature flags for testing new UI elements

---

### Site: OlympusDAO
**URL:** https://app.olympusdao.finance
**Type:** OG Ponzinomics / DeFi Protocol

**Note:** Site requires JavaScript, limited analysis possible.

**What we know from reputation:**
- Heavy focus on APY display (the famous 7,000%+ APY)
- Clean staking/bonding interfaces
- Treasury transparency metrics
- (3,3) game theory visualizations
- Dashboard-centric design

**Ideas for $FED:**
- Create prominent APY/Fed Funds Rate display (already have!)
- Add treasury transparency section
- Gamification of holder tiers similar to (3,3) memes

---

### Site: Jupiter (jup.ag)
**URL:** https://jup.ag
**Type:** Solana DEX Aggregator

**What works:**
- **Inter font family** - Clean, modern, professional
- **Multiple font weights (300-700)** - Good typography hierarchy
- **Strong social proof** - Links to Discord, Telegram, X, YouTube, Reddit, GitHub
- **Help Center** - Customer support infrastructure
- **Next.js optimization** - Fast loading, good performance

**Ideas for $FED:**
- Add more social links/community integration
- Consider Help/FAQ section
- Keep performance focus (Next.js already!)

---

## Design Patterns to Implement

### High Priority
1. **Glow effects on stats** - Blur.io style glow on key numbers
2. **Monospace for numbers** - More "trading terminal" feel
3. **Trust/backed by section** - Add credibility
4. **Glassmorphism CTAs** - Modern, polished buttons

### Medium Priority
5. **Horizontal scroll carousel** - For recent distributions
6. **Live indicator animation** - More prominent "LIVE" status
7. **Mirror/reflection effects** - On featured cards

### Lower Priority
8. **WebSocket live updates** - Real-time stat changes
9. **Sidebar navigation** - If features expand
10. **Feature flags** - For A/B testing

---

## Current $FED Design Audit

**Strengths:**
- Dark theme already implemented (#111, #1a1a1a)
- Gold accent (#c9a227) is unique and "Federal Reserve" themed
- Green for positive stats (#22c55e)
- Stats prominently displayed
- Mobile responsive

**Opportunities:**
- Stats could have more visual impact (glow, animation)
- CTAs could be more prominent
- No explicit trust signals section
- Typography is good but numbers could use monospace
- "LIVE" indicator could be more eye-catching

---

## Next Actions
1. Add glow effect to "Total Distributed" stat
2. Make numbers use monospace font
3. Enhance "LIVE" indicator with better animation
4. Consider adding trust signals section
