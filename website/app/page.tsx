import { getStats, getGitLog } from '@/lib/markdown';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard() {
  const stats = await getStats();
  const commits = await getGitLog(10);

  // Research queue - Ralph will update this as he progresses
  const researchQueue = [
    { name: 'OHM / Olympus DAO', mechanic: '(3,3) game theory, bonding', status: 'completed' },
    { name: 'SAFEMOON', mechanic: 'Reflections, auto-LP', status: 'completed' },
    { name: 'HEX', mechanic: 'Time-locked staking', status: 'completed' },
    { name: 'DRIP Network', mechanic: 'Daily ROI, referrals', status: 'completed' },
    { name: 'Tomb Finance', mechanic: 'Algorithmic pegging', status: 'completed' },
    { name: 'Titano', mechanic: 'Auto-compounding', status: 'pending' },
    { name: 'LIBERO', mechanic: 'Fire pit burns', status: 'pending' },
    { name: 'NODE protocols', mechanic: 'Node rewards', status: 'pending' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <div className="text-gray-500 text-sm mb-1">Total Distributed</div>
          <div className="text-3xl font-bold text-[#22c55e]">${stats.totalDistributed}</div>
          <div className="text-gray-600 text-xs mt-1">USD1 to holders</div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <div className="text-gray-500 text-sm mb-1">Distributions</div>
          <div className="text-3xl font-bold text-[#c9a227]">{stats.distributions}</div>
          <div className="text-gray-600 text-xs mt-1">Completed payouts</div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <div className="text-gray-500 text-sm mb-1">Holders Paid</div>
          <div className="text-3xl font-bold text-white">{stats.holders}</div>
          <div className="text-gray-600 text-xs mt-1">Unique wallets</div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <div className="text-gray-500 text-sm mb-1">Frequency</div>
          <div className="text-3xl font-bold text-white">2 min</div>
          <div className="text-gray-600 text-xs mt-1">Distribution cycle</div>
        </div>
      </div>

      {/* Recent Distributions */}
      {stats.recentDistributions.length > 0 && (
        <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
            <span>💸</span> Recent Distributions
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
                  <tr key={index} className="border-b border-[#1a1a1a] hover:bg-[#0a0a0a]">
                    <td className="py-3 px-3 text-gray-400">
                      {new Date(dist.date).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-[#22c55e] font-mono">
                      ${dist.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-white">
                      {dist.recipients}
                    </td>
                    <td className="py-3 px-3">
                      <a
                        href={`https://solscan.io/tx/${dist.txSignature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#c9a227] hover:underline font-mono text-xs"
                      >
                        {dist.txSignature.slice(0, 8)}...
                      </a>
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

      {/* Current Focus */}
      <div className="mt-8 bg-gradient-to-r from-[#c9a227]/10 to-transparent border border-[#c9a227]/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-3 flex items-center gap-2">
          <span>🎯</span> Current Focus
        </h2>
        <p className="text-gray-300">
          Researching flywheel tokenomics from successful DeFi protocols. Goal: Extract the best mechanics
          and adapt them for $FED to create the most sustainable rewards system in crypto.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-[#1a1a1a] rounded-full text-sm text-gray-400">Bonding</span>
          <span className="px-3 py-1 bg-[#1a1a1a] rounded-full text-sm text-gray-400">Reflections</span>
          <span className="px-3 py-1 bg-[#1a1a1a] rounded-full text-sm text-gray-400">Auto-compound</span>
          <span className="px-3 py-1 bg-[#1a1a1a] rounded-full text-sm text-gray-400">Staking tiers</span>
          <span className="px-3 py-1 bg-[#1a1a1a] rounded-full text-sm text-gray-400">Game theory</span>
        </div>
      </div>

      {/* Last Update */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        Last distribution: {stats.lastUpdate}
      </div>
    </div>
  );
}
