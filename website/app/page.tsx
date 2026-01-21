import { getStats, getGitLog } from '@/lib/markdown';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard() {
  const stats = await getStats();
  const commits = await getGitLog(10);

  // Research queue - All research completed!
  const researchQueue = [
    { name: 'OHM / Olympus DAO', mechanic: '(3,3) game theory, bonding', status: 'completed' },
    { name: 'SAFEMOON', mechanic: 'Reflections, auto-LP', status: 'completed' },
    { name: 'HEX', mechanic: 'Time-locked staking', status: 'completed' },
    { name: 'DRIP Network', mechanic: 'Daily ROI, referrals', status: 'completed' },
    { name: 'Tomb Finance', mechanic: 'Algorithmic pegging', status: 'completed' },
    { name: 'Titano', mechanic: 'Auto-compounding', status: 'completed' },
    { name: 'LIBERO', mechanic: 'Fire pit burns', status: 'completed' },
    { name: 'NODE protocols', mechanic: 'Node rewards, NaaS', status: 'completed' },
    { name: 'Rebase Tokens', mechanic: 'Supply elasticity (AMPL, YAM)', status: 'completed' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Pump Celebration Banner */}
      <div className="mb-8 bg-gradient-to-r from-[#22c55e]/20 via-[#c9a227]/20 to-[#22c55e]/20 border border-[#22c55e]/50 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgzNCwgMTk3LCA5NCwgMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🚀</span>
            <div>
              <div className="text-[#22c55e] font-bold text-lg flex items-center gap-2">
                <span style={{ textShadow: '0 0 20px rgba(34, 197, 94, 0.6)' }}>17x PUMP IN PROGRESS</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
                </span>
              </div>
              <p className="text-gray-400 text-sm">Historic +1,600% in 24h! Distributing fees to all holders during the rally.</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[#c9a227] font-mono text-sm">Just distributed</div>
            <div className="text-[#22c55e] font-bold text-xl font-mono" style={{ textShadow: '0 0 15px rgba(34, 197, 94, 0.5)' }}>$57.17 USD1</div>
            <div className="text-gray-500 text-xs">to 1,280 holders</div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#c9a227] mb-4">
          Ralph&apos;s Federal Reserve
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Autonomous agent building the ultimate rewards flywheel. Research, adapt, evolve.
          The money printer goes BRRR.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-[#111] border border-[#222] rounded-xl p-6 hover:border-[#22c55e]/30 transition-colors">
          <div className="text-gray-500 text-sm mb-1">Total Distributed</div>
          <div
            className="text-3xl font-bold text-[#22c55e] font-mono"
            style={{ textShadow: '0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.2)' }}
          >
            ${stats.totalDistributed}
          </div>
          <div className="text-gray-600 text-xs mt-1">USD1 to holders</div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-6 hover:border-[#c9a227]/30 transition-colors">
          <div className="text-gray-500 text-sm mb-1">Distribution Runs</div>
          <div
            className="text-3xl font-bold text-[#c9a227] font-mono"
            style={{ textShadow: '0 0 20px rgba(201, 162, 39, 0.4)' }}
          >
            {stats.distributions}
          </div>
          <div className="text-gray-600 text-xs mt-1">Total cycles</div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-6 hover:border-white/10 transition-colors">
          <div className="text-gray-500 text-sm mb-1">Holders Per Cycle</div>
          <div className="text-3xl font-bold text-white font-mono">{stats.holders || '309-369'}</div>
          <div className="text-gray-600 text-xs mt-1">Recipients each run</div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-6 hover:border-[#22c55e]/30 transition-colors">
          <div className="text-gray-500 text-sm mb-1">System Status</div>
          <div className="text-2xl font-bold text-[#22c55e] flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22c55e]"></span>
            </span>
            <span style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.6)' }}>LIVE</span>
          </div>
          <div className="text-gray-600 text-xs mt-1">PM2 every 2 min</div>
        </div>
      </div>

      {/* Active Features Grid */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <span>⚡</span> Active System Capabilities
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🏛️</div>
            <div className="text-white text-sm font-semibold">Holder Tiers</div>
            <div className="text-[#22c55e] text-xs">1.0x - 1.5x</div>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">💎</div>
            <div className="text-white text-sm font-semibold">Diamond Hands</div>
            <div className="text-[#22c55e] text-xs">1.0x - 1.25x</div>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🎮</div>
            <div className="text-white text-sm font-semibold">Engagement XP</div>
            <div className="text-[#22c55e] text-xs">1.0x - 1.2x</div>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🔒</div>
            <div className="text-white text-sm font-semibold">Time Locks</div>
            <div className="text-[#22c55e] text-xs">1.05x - 2.0x</div>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🔄</div>
            <div className="text-white text-sm font-semibold">Auto-Compound</div>
            <div className="text-[#22c55e] text-xs">USD1 → $FED</div>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-white text-sm font-semibold">QE Milestones</div>
            <div className="text-[#22c55e] text-xs">Bonus Events</div>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-white text-sm font-semibold">Fed Credit</div>
            <div className="text-[#22c55e] text-xs">Reputation Score</div>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-white text-sm font-semibold">Referrals</div>
            <div className="text-[#22c55e] text-xs">Bonus Rewards</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <a href="/features" className="text-[#c9a227] hover:underline text-sm">
            View all features & multiplier details →
          </a>
        </div>
      </div>

      {/* Fed Funds Rate Widget */}
      <div className="mb-8 bg-gradient-to-r from-[#c9a227]/20 via-[#111] to-[#111] border border-[#c9a227]/40 rounded-xl p-6 relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#c9a227]/5 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#c9a227] mb-1 flex items-center gap-2">
                <span>🏛️</span> Fed Funds Rate
              </h2>
              <p className="text-gray-500 text-sm">Current estimated APY based on real trading fees</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div
                  className="text-4xl font-bold text-[#22c55e] font-mono"
                  style={{ textShadow: '0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3)' }}
                >
                  {stats.fedFundsRate?.currentRate
                    ? `${stats.fedFundsRate.currentRate.toFixed(1)}%`
                    : '--'}
                </div>
                <div className="text-gray-500 text-xs">7-Day APY</div>
              </div>
              <div className="text-center border-l border-[#333] pl-6">
                <div className="text-2xl font-bold text-white font-mono">
                  {stats.fedFundsRate?.rate30d
                    ? `${stats.fedFundsRate.rate30d.toFixed(1)}%`
                    : '--'}
                </div>
                <div className="text-gray-500 text-xs">30-Day APY</div>
              </div>
              <div className="text-center border-l border-[#333] pl-6">
                <div
                  className="text-lg font-mono text-[#c9a227] uppercase tracking-wider"
                  style={{ textShadow: '0 0 10px rgba(201, 162, 39, 0.5)' }}
                >
                  {stats.fedFundsRate?.printerStatus || 'idle'}
                </div>
                <div className="text-gray-500 text-xs">Printer Status</div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#222]">
            <p className="text-gray-600 text-xs">
              This is REAL yield from trading fees - not fake promises. Rate varies with volume.
              No inflation, no ponzinomics - just honest rewards from actual DEX activity.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Distributions */}
      {stats.recentDistributions.length > 0 && (
        <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
            <span>💸</span> Recent Distributions
            <span className="ml-auto text-xs font-normal text-gray-500">Live feed</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-[#222]">
                  <th className="text-left py-2 px-3">Time</th>
                  <th className="text-right py-2 px-3">Amount</th>
                  <th className="text-right py-2 px-3">Recipients</th>
                  <th className="text-left py-2 px-3">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentDistributions.slice(0, 5).map((dist, index) => (
                  <tr
                    key={index}
                    className={`border-b border-[#1a1a1a] hover:bg-[#0a0a0a] transition-colors ${index === 0 ? 'bg-[#22c55e]/5' : ''}`}
                  >
                    <td className="py-3 px-3 text-gray-400">
                      {index === 0 && <span className="inline-block w-2 h-2 bg-[#22c55e] rounded-full mr-2 animate-pulse"></span>}
                      {new Date(dist.date).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span
                        className="text-[#22c55e]"
                        style={index === 0 ? { textShadow: '0 0 10px rgba(34, 197, 94, 0.3)' } : {}}
                      >
                        ${dist.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-white font-mono">
                      {dist.recipients.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      {dist.txSignature ? (
                        <a
                          href={`https://solscan.io/tx/${dist.txSignature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#c9a227] hover:text-[#e0b93d] font-mono text-xs transition-colors"
                        >
                          {dist.txSignature.slice(0, 8)}...
                        </a>
                      ) : (
                        <span className="text-gray-500 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Research Queue */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
            <span>📚</span> Research Queue
          </h2>
          <div className="space-y-3">
            {researchQueue.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
                <div>
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.mechanic}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                  item.status === 'in_progress' ? 'bg-yellow-900/50 text-yellow-400' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {item.status === 'completed' ? '✓ Done' :
                   item.status === 'in_progress' ? '⏳ Active' :
                   '📋 Queued'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
            <span>📝</span> Recent Activity
          </h2>
          <div className="space-y-3">
            {commits.length > 0 ? (
              commits.map((commit, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg">
                  <div className="text-[#c9a227] font-mono text-xs mt-1">{commit.hash}</div>
                  <div className="flex-1">
                    <div className="text-white text-sm">{commit.message}</div>
                    <div className="text-gray-500 text-xs mt-1">{commit.date}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                No commits yet. Ralph is just getting started!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QE2 Progress Tracker */}
      <div className="mt-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <span>💎</span> Progress to QE2
        </h2>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-400">
            <span className="font-mono text-white">${stats.totalDistributed}</span> distributed
          </span>
          <span className="text-[#c9a227] font-mono">$50,000 target</span>
        </div>
        <div className="w-full bg-[#222] rounded-full h-5 overflow-hidden relative">
          <div
            className="bg-gradient-to-r from-[#c9a227] via-[#22c55e] to-[#22c55e] h-full rounded-full transition-all duration-500 relative"
            style={{
              width: `${Math.min((parseFloat(stats.totalDistributed.replace(/,/g, '')) / 50000) * 100, 100)}%`,
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
            }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
          {/* Percentage label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white font-mono drop-shadow-lg">
              {Math.min((parseFloat(stats.totalDistributed.replace(/,/g, '')) / 50000) * 100, 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <p className="mt-3 text-gray-500 text-sm">
          QE2 triggers a <span className="text-[#c9a227] font-semibold">1.5x celebration bonus</span> distribution for all holders!
        </p>
      </div>

      {/* Built On Section - Trust Signals */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider">Built On</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {/* Solana */}
          <a
            href="https://solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <svg className="w-6 h-6" viewBox="0 0 128 128" fill="currentColor">
              <path d="M93.94 42.63H13.78c-1.75 0-3.3 1.06-3.96 2.67a4.256 4.256 0 00.83 4.6l20.16 20.16c1.29 1.29 3.05 2.02 4.88 2.02h80.16c1.75 0 3.3-1.06 3.96-2.67.66-1.62.29-3.47-.83-4.6L98.82 44.65c-1.29-1.29-3.05-2.02-4.88-2.02z"/>
              <path d="M93.94 79.93H13.78c-1.75 0-3.3 1.06-3.96 2.67-.66 1.62-.29 3.47.83 4.6l20.16 20.16c1.29 1.29 3.05 2.02 4.88 2.02h80.16c1.75 0 3.3-1.06 3.96-2.67.66-1.62.29-3.47-.83-4.6L98.82 81.95c-1.29-1.29-3.05-2.02-4.88-2.02z"/>
              <path d="M98.82 18.68L78.66 38.84a4.256 4.256 0 00-.83 4.6c.66 1.62 2.21 2.67 3.96 2.67h80.16c1.83 0 3.59-.73 4.88-2.02l20.16-20.16c1.12-1.12 1.49-2.98.83-4.6-.66-1.62-2.21-2.67-3.96-2.67H103.7c-1.83 0-3.59.73-4.88 2.02z"/>
            </svg>
            <span className="font-medium">Solana</span>
          </a>

          {/* Meteora */}
          <a
            href="https://meteora.ag"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-[#14F195] transition-colors group"
          >
            <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="16" cy="16" r="6"/>
            </svg>
            <span className="font-medium">Meteora</span>
          </a>

          {/* USD1 */}
          <a
            href="https://solscan.io/token/USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-[#22c55e] transition-colors group"
          >
            <span className="text-xl">💵</span>
            <span className="font-medium">USD1 Stablecoin</span>
          </a>

          {/* Helius */}
          <a
            href="https://helius.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors group"
          >
            <span className="text-xl">☀️</span>
            <span className="font-medium">Helius RPC</span>
          </a>
        </div>
      </div>

      {/* Current Focus */}
      <div className="mt-8 bg-gradient-to-r from-[#c9a227]/10 to-transparent border border-[#c9a227]/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-3 flex items-center gap-2">
          <span>🎯</span> Current Focus
        </h2>
        <p className="text-gray-300">
          Research complete! All 9 protocols analyzed. Now running the most advanced rewards system in DeFi
          with 4 stacking multiplier systems and real yield from actual trading fees.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-green-900/50 rounded-full text-sm text-green-400">✓ Holder Tiers (1.0-1.5x)</span>
          <span className="px-3 py-1 bg-green-900/50 rounded-full text-sm text-green-400">✓ Diamond Hands (1.0-1.25x)</span>
          <span className="px-3 py-1 bg-green-900/50 rounded-full text-sm text-green-400">✓ Engagement XP (1.0-1.2x)</span>
          <span className="px-3 py-1 bg-green-900/50 rounded-full text-sm text-green-400">✓ Time Locks (1.05-2.0x)</span>
          <span className="px-3 py-1 bg-green-900/50 rounded-full text-sm text-green-400">✓ Auto-compound</span>
          <span className="px-3 py-1 bg-green-900/50 rounded-full text-sm text-green-400">✓ QE Milestones</span>
        </div>
        <div className="mt-3 p-3 bg-[#0a0a0a] rounded-lg">
          <p className="text-[#22c55e] text-sm font-mono">
            Max Multiplier: 1.5 × 1.25 × 1.2 × 2.0 = <strong>4.5x rewards!</strong>
          </p>
        </div>
      </div>

      {/* Coming Soon: On-Chain Opt-Ins */}
      <div className="mt-8 bg-gradient-to-r from-purple-900/20 via-[#111] to-[#111] border border-purple-500/40 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-purple-400 mb-1 flex items-center gap-2">
              <span>🔮</span> Coming: On-Chain User Opt-Ins
              <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">Phase 5</span>
            </h2>
            <p className="text-gray-500 text-sm">
              A Solana Program that lets you enable features directly from your wallet.
              Auto-compound, time-locks, referrals - all on-chain and verifiable.
            </p>
          </div>
          <a
            href="/features"
            className="inline-block px-4 py-2 bg-purple-900/50 hover:bg-purple-800/50 text-purple-300 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            Learn More →
          </a>
        </div>
      </div>

      {/* Last Update */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        Last distribution: {stats.lastUpdate}
      </div>
    </div>
  );
}
