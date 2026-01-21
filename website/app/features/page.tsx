export default function FeaturesPage() {
  const holderTiers = [
    { name: 'Fed Chairman', minHolding: '50,000,000', multiplier: '1.5x', emoji: '🏛️' },
    { name: 'Fed Governor', minHolding: '10,000,000', multiplier: '1.25x', emoji: '👔' },
    { name: 'Regional Director', minHolding: '1,000,000', multiplier: '1.1x', emoji: '📋' },
    { name: 'Board Member', minHolding: '100,000', multiplier: '1.05x', emoji: '🪪' },
    { name: 'Fed Citizen', minHolding: 'Any', multiplier: '1.0x', emoji: '🌐' },
  ];

  const streakTiers = [
    { name: 'Founding Father', days: '365+', multiplier: '1.25x', emoji: '🏛️' },
    { name: 'OG Fed', days: '180+', multiplier: '1.2x', emoji: '💎' },
    { name: 'Fed Loyalist', days: '90+', multiplier: '1.15x', emoji: '🔷' },
    { name: 'Diamond Hands', days: '30+', multiplier: '1.1x', emoji: '💠' },
    { name: 'Holder', days: '7+', multiplier: '1.05x', emoji: '🤝' },
    { name: 'Newcomer', days: '0-6', multiplier: '1.0x', emoji: '🆕' },
  ];

  const engagementTiers = [
    { name: 'Fed Elite', xp: '500+', multiplier: '1.2x', emoji: '🏆', benefits: 'Priority announcements, Elite badge' },
    { name: 'Fed Veteran', xp: '250+', multiplier: '1.15x', emoji: '⭐', benefits: 'Early access to features' },
    { name: 'Fed Active', xp: '100+', multiplier: '1.1x', emoji: '🔥', benefits: 'Active member badge' },
    { name: 'Fed Regular', xp: '50+', multiplier: '1.05x', emoji: '📊', benefits: 'Regular badge' },
    { name: 'Fed Newcomer', xp: '0+', multiplier: '1.0x', emoji: '🆕', benefits: 'Welcome to the Fed!' },
  ];

  const timeLockTiers = [
    { name: 'Fed Bond', duration: '2 years', multiplier: '2.0x', emoji: '📗' },
    { name: 'Fed Covenant', duration: '1 year', multiplier: '1.75x', emoji: '📚' },
    { name: 'Fed Vow', duration: '6 months', multiplier: '1.5x', emoji: '📕' },
    { name: 'Fed Oath', duration: '3 months', multiplier: '1.3x', emoji: '📖' },
    { name: 'Fed Promise', duration: '1 month', multiplier: '1.15x', emoji: '📋' },
    { name: 'Fed Pledge', duration: '1 week', multiplier: '1.05x', emoji: '📜' },
  ];

  const qeMilestones = [
    { milestone: '$10,000', event: 'QE1', bonus: '1.5x', status: 'achieved' },
    { milestone: '$25,000', event: 'QE1.5', bonus: '1.25x', status: 'achieved' },
    { milestone: '$50,000', event: 'QE2', bonus: '1.5x', status: 'upcoming' },
    { milestone: '$100,000', event: 'QE3', bonus: '2.0x', status: 'upcoming' },
    { milestone: '$250,000', event: 'QE4', bonus: '2.0x', status: 'upcoming' },
    { milestone: '$500,000', event: 'QE5', bonus: '2.5x', status: 'upcoming' },
    { milestone: '$1,000,000', event: 'QE∞', bonus: '3.0x', status: 'upcoming' },
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
          <span>🔢</span> How Multipliers Stack
        </h2>
        <p className="text-gray-400 mb-4">
          Example: A Fed Governor (1.25x) with 90-day streak (1.15x), Fed Active engagement (1.1x), and 3-month time lock (1.3x):
        </p>
        <div className="flex flex-wrap items-center gap-2 text-lg">
          <span className="text-white">1.25x</span>
          <span className="text-gray-500">×</span>
          <span className="text-white">1.15x</span>
          <span className="text-gray-500">×</span>
          <span className="text-white">1.1x</span>
          <span className="text-gray-500">×</span>
          <span className="text-white">1.3x</span>
          <span className="text-gray-500">=</span>
          <span className="text-3xl font-bold text-[#22c55e]">2.06x</span>
          <span className="text-gray-500 text-sm ml-2">rewards!</span>
        </div>
      </div>

      {/* Holder Tiers */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <span>🏛️</span> Holder Tier System
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
                  <td className="py-3 px-3 text-white">
                    <span className="mr-2">{tier.emoji}</span>
                    {tier.name}
                  </td>
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
          <span>💎</span> Diamond Hands Streak System
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
                  <td className="py-3 px-3 text-white">
                    <span className="mr-2">{tier.emoji}</span>
                    {tier.name}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-400">
                    {tier.days} days
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

      {/* Engagement Score */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <span>🎮</span> Engagement Score System
        </h2>
        <p className="text-gray-500 mb-4">Earn XP through participation and unlock bonus multipliers</p>
        <div className="mb-4 p-4 bg-[#0a0a0a] rounded-lg">
          <h3 className="text-white font-semibold mb-2">How to Earn XP:</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Receiving distributions: +5 XP each</li>
            <li>• Daily check-in: +10 XP</li>
            <li>• 3-day streak bonus: +5 XP</li>
            <li>• 7-day streak bonus: +10 XP</li>
            <li>• 14-day streak bonus: +25 XP</li>
            <li>• 30-day streak bonus: +50 XP</li>
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
                  <td className="py-3 px-3 text-white">
                    <span className="mr-2">{tier.emoji}</span>
                    {tier.name}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-400">
                    {tier.xp} XP
                  </td>
                  <td className="py-3 px-3 text-right text-[#22c55e] font-bold">
                    {tier.multiplier}
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-xs">
                    {tier.benefits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time Lock Commitments */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <span>🔒</span> Time Lock Commitment System
        </h2>
        <p className="text-gray-500 mb-4">
          Voluntarily commit to holding for boosted rewards. Soft lock - tokens stay liquid in your wallet.
        </p>
        <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <p className="text-yellow-500 text-sm">
            ⚠️ Breaking commitment removes bonus retroactively and impacts your Fed Credit Score
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
                  <td className="py-3 px-3 text-white">
                    <span className="mr-2">{tier.emoji}</span>
                    {tier.name}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-400">
                    {tier.duration}
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

      {/* Auto-Compound */}
      <div className="mb-8 bg-gradient-to-r from-[#c9a227]/10 to-transparent border border-[#c9a227]/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <span>🔄</span> Auto-Compound Feature
        </h2>
        <p className="text-gray-400 mb-4">
          Automatically reinvest your USD1 rewards back into $FED via Jupiter Ultra API.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Benefits</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Automatic position growth</li>
              <li>• No manual swaps needed</li>
              <li>• Move up tiers faster</li>
              <li>• Reduces gas costs</li>
              <li>• Creates $FED buy pressure</li>
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
          <span>📈</span> QE Milestone Events
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
                  <td className="py-3 px-3 text-white font-mono">
                    {milestone.milestone}
                  </td>
                  <td className="py-3 px-3 text-center text-[#c9a227] font-bold">
                    {milestone.event}
                  </td>
                  <td className="py-3 px-3 text-right text-[#22c55e] font-bold">
                    {milestone.bonus}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      milestone.status === 'achieved'
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {milestone.status === 'achieved' ? '✓ Achieved' : 'Upcoming'}
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
          <span>⚡</span> Additional Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span>📊</span> Fed Credit Score
            </h3>
            <p className="text-gray-500 text-sm">
              Reputation system tracking commitment history and reliability.
            </p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span>🎯</span> Quest System
            </h3>
            <p className="text-gray-500 text-sm">
              Complete quests to earn badges and achievements.
            </p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span>👥</span> Referral System
            </h3>
            <p className="text-gray-500 text-sm">
              Earn bonuses for bringing new holders to the Fed.
            </p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span>🔍</span> Sybil Detection
            </h3>
            <p className="text-gray-500 text-sm">
              Quality over quantity - anti-sybil protection.
            </p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span>📈</span> Holder Analytics
            </h3>
            <p className="text-gray-500 text-sm">
              Comprehensive reports aggregating all holder data.
            </p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span>🏛️</span> Fed Funds Rate
            </h3>
            <p className="text-gray-500 text-sm">
              Real-time APY tracking based on actual fee distributions.
            </p>
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
          className="inline-block bg-[#c9a227] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#e0b82a] transition-colors"
        >
          Buy $FED on Jupiter
        </a>
      </div>
    </div>
  );
}
