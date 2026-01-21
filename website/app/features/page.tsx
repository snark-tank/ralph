import {
  BuildingIcon,
  DiamondIcon,
  GamepadIcon,
  LockIcon,
  RefreshIcon,
  TrendingUpIcon,
  ChartIcon,
  UsersIcon,
  ZapIcon,
  TargetIcon,
  CrystalBallIcon,
  CheckIcon,
} from '../components/Icons';

// Custom icons for features page
function CalculatorIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <line x1="8" y1="6" x2="16" y2="6"/>
      <line x1="8" y1="10" x2="8" y2="10"/>
      <line x1="12" y1="10" x2="12" y2="10"/>
      <line x1="16" y1="10" x2="16" y2="10"/>
      <line x1="8" y1="14" x2="8" y2="14"/>
      <line x1="12" y1="14" x2="12" y2="14"/>
      <line x1="16" y1="14" x2="16" y2="14"/>
      <line x1="8" y1="18" x2="8" y2="18"/>
      <line x1="12" y1="18" x2="16" y2="18"/>
    </svg>
  );
}

function ShieldIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function AlertIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

export default function FeaturesPage() {
  const holderTiers = [
    { name: 'Fed Chairman', minHolding: '50,000,000', multiplier: '1.5x' },
    { name: 'Fed Governor', minHolding: '10,000,000', multiplier: '1.25x' },
    { name: 'Regional Director', minHolding: '1,000,000', multiplier: '1.1x' },
    { name: 'Board Member', minHolding: '100,000', multiplier: '1.05x' },
    { name: 'Fed Citizen', minHolding: 'Any', multiplier: '1.0x' },
  ];

  const streakTiers = [
    { name: 'Founding Father', days: '365+', multiplier: '1.25x' },
    { name: 'OG Fed', days: '180+', multiplier: '1.2x' },
    { name: 'Fed Loyalist', days: '90+', multiplier: '1.15x' },
    { name: 'Diamond Hands', days: '30+', multiplier: '1.1x' },
    { name: 'Holder', days: '7+', multiplier: '1.05x' },
    { name: 'Newcomer', days: '0-6', multiplier: '1.0x' },
  ];

  const engagementTiers = [
    { name: 'Fed Elite', xp: '500+', multiplier: '1.2x', benefits: 'Priority announcements, Elite badge' },
    { name: 'Fed Veteran', xp: '250+', multiplier: '1.15x', benefits: 'Early access to features' },
    { name: 'Fed Active', xp: '100+', multiplier: '1.1x', benefits: 'Active member badge' },
    { name: 'Fed Regular', xp: '50+', multiplier: '1.05x', benefits: 'Regular badge' },
    { name: 'Fed Newcomer', xp: '0+', multiplier: '1.0x', benefits: 'Welcome to the Fed!' },
  ];

  const timeLockTiers = [
    { name: 'Fed Bond', duration: '2 years', multiplier: '2.0x' },
    { name: 'Fed Covenant', duration: '1 year', multiplier: '1.75x' },
    { name: 'Fed Vow', duration: '6 months', multiplier: '1.5x' },
    { name: 'Fed Oath', duration: '3 months', multiplier: '1.3x' },
    { name: 'Fed Promise', duration: '1 month', multiplier: '1.15x' },
    { name: 'Fed Pledge', duration: '1 week', multiplier: '1.05x' },
  ];

  const qeMilestones = [
    { milestone: '$10,000', event: 'QE1', bonus: '1.5x', status: 'achieved' },
    { milestone: '$25,000', event: 'QE1.5', bonus: '1.25x', status: 'achieved' },
    { milestone: '$50,000', event: 'QE2', bonus: '1.5x', status: 'upcoming' },
    { milestone: '$100,000', event: 'QE3', bonus: '2.0x', status: 'upcoming' },
    { milestone: '$250,000', event: 'QE4', bonus: '2.0x', status: 'upcoming' },
    { milestone: '$500,000', event: 'QE5', bonus: '2.5x', status: 'upcoming' },
    { milestone: '$1,000,000', event: 'QE Infinity', bonus: '3.0x', status: 'upcoming' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#c9a227] mb-4">
          $FED Features
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          The most advanced rewards distribution system in DeFi. All multipliers STACK for maximum rewards.
        </p>
      </div>

      {/* Multiplier Calculator Preview */}
      <div className="mb-12 bg-gradient-to-r from-[#22c55e]/20 via-[#111] to-[#111] border border-[#22c55e]/40 rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#22c55e] mb-4 flex items-center gap-2">
          <CalculatorIcon className="w-5 h-5" /> How Multipliers Stack
        </h2>
        <p className="text-gray-400 mb-4">
          Example: A Fed Governor (1.25x) with 90-day streak (1.15x), Fed Active engagement (1.1x), and 3-month time lock (1.3x):
        </p>
        <div className="flex flex-wrap items-center gap-2 text-lg">
          <span className="text-white">1.25x</span>
          <span className="text-gray-500">x</span>
          <span className="text-white">1.15x</span>
          <span className="text-gray-500">x</span>
          <span className="text-white">1.1x</span>
          <span className="text-gray-500">x</span>
          <span className="text-white">1.3x</span>
          <span className="text-gray-500">=</span>
          <span className="text-3xl font-bold text-[#22c55e]">2.06x</span>
          <span className="text-gray-500 text-sm ml-2">rewards!</span>
        </div>
      </div>

      {/* Holder Tiers */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <BuildingIcon className="w-5 h-5" /> Holder Tier System
        </h2>
        <p className="text-gray-500 mb-4">Rewards multiplied based on your $FED holdings</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-[#222]">
                <th className="text-left py-2 px-3">Tier</th>
                <th className="text-right py-2 px-3">Min Holdings</th>
                <th className="text-right py-2 px-3">Multiplier</th>
              </tr>
            </thead>
            <tbody>
              {holderTiers.map((tier, index) => (
                <tr key={index} className="border-b border-[#1a1a1a] hover:bg-[#0a0a0a]">
                  <td className="py-3 px-3 text-white">{tier.name}</td>
                  <td className="py-3 px-3 text-right text-gray-400 font-mono">
                    {tier.minHolding} $FED
                  </td>
                  <td className="py-3 px-3 text-right text-[#22c55e] font-bold">
                    {tier.multiplier}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diamond Hands Streaks */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <DiamondIcon className="w-5 h-5" /> Diamond Hands Streak System
        </h2>
        <p className="text-gray-500 mb-4">Long-term holders earn additional multipliers for consistent holding</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-[#222]">
                <th className="text-left py-2 px-3">Streak</th>
                <th className="text-right py-2 px-3">Duration</th>
                <th className="text-right py-2 px-3">Multiplier</th>
              </tr>
            </thead>
            <tbody>
              {streakTiers.map((tier, index) => (
                <tr key={index} className="border-b border-[#1a1a1a] hover:bg-[#0a0a0a]">
                  <td className="py-3 px-3 text-white">{tier.name}</td>
                  <td className="py-3 px-3 text-right text-gray-400">{tier.days} days</td>
                  <td className="py-3 px-3 text-right text-[#22c55e] font-bold">
                    {tier.multiplier}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Score */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <GamepadIcon className="w-5 h-5" /> Engagement Score System
        </h2>
        <p className="text-gray-500 mb-4">Earn XP through participation and unlock bonus multipliers</p>
        <div className="mb-4 p-4 bg-[#0a0a0a] rounded-lg">
          <h3 className="text-white font-semibold mb-2">How to Earn XP:</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>- Receiving distributions: +5 XP each</li>
            <li>- Daily check-in: +10 XP</li>
            <li>- 3-day streak bonus: +5 XP</li>
            <li>- 7-day streak bonus: +10 XP</li>
            <li>- 14-day streak bonus: +25 XP</li>
            <li>- 30-day streak bonus: +50 XP</li>
          </ul>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-[#222]">
                <th className="text-left py-2 px-3">Tier</th>
                <th className="text-right py-2 px-3">XP Required</th>
                <th className="text-right py-2 px-3">Multiplier</th>
                <th className="text-left py-2 px-3">Benefits</th>
              </tr>
            </thead>
            <tbody>
              {engagementTiers.map((tier, index) => (
                <tr key={index} className="border-b border-[#1a1a1a] hover:bg-[#0a0a0a]">
                  <td className="py-3 px-3 text-white">{tier.name}</td>
                  <td className="py-3 px-3 text-right text-gray-400">{tier.xp} XP</td>
                  <td className="py-3 px-3 text-right text-[#22c55e] font-bold">
                    {tier.multiplier}
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-xs">{tier.benefits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time Lock Commitments */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <LockIcon className="w-5 h-5" /> Time Lock Commitment System
        </h2>
        <p className="text-gray-500 mb-4">
          Voluntarily commit to holding for boosted rewards. Soft lock - tokens stay liquid in your wallet.
        </p>
        <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg flex items-start gap-2">
          <AlertIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-500 text-sm">
            Breaking commitment removes bonus retroactively and impacts your Fed Credit Score
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-[#222]">
                <th className="text-left py-2 px-3">Commitment</th>
                <th className="text-right py-2 px-3">Duration</th>
                <th className="text-right py-2 px-3">Multiplier</th>
              </tr>
            </thead>
            <tbody>
              {timeLockTiers.map((tier, index) => (
                <tr key={index} className="border-b border-[#1a1a1a] hover:bg-[#0a0a0a]">
                  <td className="py-3 px-3 text-white">{tier.name}</td>
                  <td className="py-3 px-3 text-right text-gray-400">{tier.duration}</td>
                  <td className="py-3 px-3 text-right text-[#22c55e] font-bold">
                    {tier.multiplier}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto-Compound */}
      <div className="mb-8 bg-gradient-to-r from-[#c9a227]/10 to-transparent border border-[#c9a227]/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <RefreshIcon className="w-5 h-5" /> Auto-Compound Feature
        </h2>
        <p className="text-gray-400 mb-4">
          Automatically reinvest your USD1 rewards back into $FED via Jupiter Ultra API.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Benefits</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>- Automatic position growth</li>
              <li>- No manual swaps needed</li>
              <li>- Move up tiers faster</li>
              <li>- Reduces gas costs</li>
              <li>- Creates $FED buy pressure</li>
            </ul>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">How to Enable</h3>
            <code className="text-[#c9a227] text-xs block mt-2 bg-[#111] p-2 rounded">
              npx ts-node scripts/auto-compound.ts --register YOUR_ADDRESS
            </code>
            <p className="text-gray-500 text-xs mt-2">
              Min compound amount: $0.10 USD1 | Max slippage: 1%
            </p>
          </div>
        </div>
      </div>

      {/* QE Milestones */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <TrendingUpIcon className="w-5 h-5" /> QE Milestone Events
        </h2>
        <p className="text-gray-500 mb-4">
          Special celebration distributions when we hit total distribution milestones
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-[#222]">
                <th className="text-left py-2 px-3">Milestone</th>
                <th className="text-center py-2 px-3">Event</th>
                <th className="text-right py-2 px-3">Bonus</th>
                <th className="text-center py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {qeMilestones.map((milestone, index) => (
                <tr key={index} className="border-b border-[#1a1a1a] hover:bg-[#0a0a0a]">
                  <td className="py-3 px-3 text-white font-mono">{milestone.milestone}</td>
                  <td className="py-3 px-3 text-center text-[#c9a227] font-bold">
                    {milestone.event}
                  </td>
                  <td className="py-3 px-3 text-right text-[#22c55e] font-bold">
                    {milestone.bonus}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded flex items-center justify-center gap-1 ${
                      milestone.status === 'achieved'
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {milestone.status === 'achieved' ? <><CheckIcon className="w-3 h-3" /> Achieved</> : 'Upcoming'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Features */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <ZapIcon className="w-5 h-5" /> Additional Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <ChartIcon className="w-4 h-4 text-[#c9a227]" /> Fed Credit Score
            </h3>
            <p className="text-gray-500 text-sm">
              Reputation system tracking commitment history and reliability.
            </p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <TargetIcon className="w-4 h-4 text-[#c9a227]" /> Quest System
            </h3>
            <p className="text-gray-500 text-sm">
              Complete quests to earn badges and achievements.
            </p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-[#c9a227]" /> Referral System
            </h3>
            <p className="text-gray-500 text-sm">
              Earn bonuses for bringing new holders to the Fed.
            </p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <ShieldIcon className="w-4 h-4 text-[#c9a227]" /> Sybil Detection
            </h3>
            <p className="text-gray-500 text-sm">
              Quality over quantity - anti-sybil protection.
            </p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4 text-[#c9a227]" /> Holder Analytics
            </h3>
            <p className="text-gray-500 text-sm">
              Comprehensive reports aggregating all holder data.
            </p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <BuildingIcon className="w-4 h-4 text-[#c9a227]" /> Fed Funds Rate
            </h3>
            <p className="text-gray-500 text-sm">
              Real-time APY tracking based on actual fee distributions.
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon: On-Chain Opt-In Program */}
      <div className="mb-8 bg-gradient-to-r from-purple-900/20 via-[#111] to-[#111] border border-purple-500/40 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-purple-400">
            <CrystalBallIcon className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-purple-400 mb-2 flex items-center gap-2">
              Coming Soon: On-Chain User Opt-Ins
              <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">Phase 5</span>
            </h2>
            <p className="text-gray-400 mb-4">
              We&apos;re building a Solana Program that lets you opt into features directly on-chain.
              No more CLI commands - just connect your wallet and choose your preferences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#0a0a0a] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">What You&apos;ll Be Able To Do:</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>- Enable auto-compound with one click</li>
                  <li>- Set time-lock commitments on-chain</li>
                  <li>- Register referral relationships trustlessly</li>
                  <li>- Track your streak on-chain (verifiable)</li>
                  <li>- Manage all preferences from the website</li>
                </ul>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Why On-Chain Matters:</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>- Trustless - verify your settings anytime</li>
                  <li>- Transparent - all preferences are public</li>
                  <li>- Permanent - no central database needed</li>
                  <li>- Composable - other apps can read your status</li>
                  <li>- User-controlled - you sign, you own it</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-purple-400">Built with Anchor Framework</span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-500">Devnet testing coming soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Ready to maximize your rewards?</p>
        <a
          href="https://jup.ag/swap/SOL-132STreShuLRNgkyF1QECv37yP9Cdp8JBAgnKBgKafed"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#c9a227] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#e0b82a] transition-colors btn-glow"
        >
          Buy $FED on Jupiter
        </a>
      </div>
    </div>
  );
}
