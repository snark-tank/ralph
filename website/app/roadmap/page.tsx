import { getMarkdownContent } from '@/lib/markdown';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RoadmapPage() {
  const phase2 = await getMarkdownContent('PHASE2.md');

  const milestones = [
    { phase: 'Phase 1', title: 'Foundation', status: 'completed', items: [
      'Basic distribution system',
      'Fee collection from Meteora LP',
      'PM2 automation (2-min cycles)',
      'Website sync via Redis',
      '$10 minimum threshold',
    ]},
    { phase: 'Phase 2', title: 'Intelligence', status: 'completed', items: [
      'Dynamic threshold management',
      'Intelligent distribution timing',
      'Gas optimization (Helius Priority Fee API)',
      'Volume-aware distribution',
      'Smart timing decisions',
    ]},
    { phase: 'Phase 3', title: 'Tiers & Rewards', status: 'completed', items: [
      'Holder tier system (Chairman/Governor/Director/Member/Citizen)',
      'Diamond Hands streak multipliers (up to 1.25x)',
      'Engagement XP system (up to 1.2x)',
      'Time Lock commitments (up to 2.0x)',
      'Auto-compound via Jupiter Ultra',
      'QE Milestone celebrations',
    ]},
    { phase: 'Phase 4', title: 'Advanced Features', status: 'completed', items: [
      'Fed Credit Score (reputation system)',
      'Quest & badge system',
      'Referral bonuses',
      'Sybil detection',
      'Treasury buyback & burn',
      'Season Pass tracking',
    ]},
    { phase: 'Phase 5', title: 'Solana Program', status: 'completed', items: [
      'On-chain user opt-ins for features',
      'Auto-compound enrollment via wallet connect',
      'Time-lock preferences stored on-chain',
      'Streak tracking with on-chain state',
      'Trustless & verifiable preferences',
      'DEPLOYED TO MAINNET: HBsfAtXFmgsr5EHDqiDJDyjuGVHhYU7ACWaEhKpVACqz',
    ]},
    { phase: 'Phase 6', title: 'Governance', status: 'planned', items: [
      'Community voting',
      'Parameter adjustments via DAO',
      'Treasury management proposals',
      'New feature voting',
    ]},
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#c9a227] mb-2">Roadmap</h1>
        <p className="text-gray-400">
          The evolution of Ralph&apos;s Federal Reserve. From basic distribution to fully autonomous DeFi agent.
        </p>
      </div>

      {/* Visual Roadmap */}
      <div className="space-y-6 mb-12">
        {milestones.map((milestone, index) => (
          <div key={index} className="relative">
            {/* Connector Line */}
            {index < milestones.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-full bg-[#222]" />
            )}

            <div className={`bg-[#111] border rounded-xl p-6 ${
              milestone.status === 'completed' ? 'border-green-500/50' :
              milestone.status === 'in_progress' ? 'border-[#c9a227]/50' :
              'border-[#222]'
            }`}>
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  milestone.status === 'completed' ? 'bg-green-500/20' :
                  milestone.status === 'in_progress' ? 'bg-[#c9a227]/20' :
                  'bg-[#222]'
                }`}>
                  {milestone.status === 'completed' ? '✓' :
                   milestone.status === 'in_progress' ? '⏳' : '📋'}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      milestone.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      milestone.status === 'in_progress' ? 'bg-[#c9a227]/20 text-[#c9a227]' :
                      'bg-[#222] text-gray-400'
                    }`}>
                      {milestone.phase}
                    </span>
                    <h3 className="text-xl font-bold text-white">{milestone.title}</h3>
                  </div>

                  <ul className="space-y-2 mt-3">
                    {milestone.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-400">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'in_progress' ? 'bg-[#c9a227]' :
                          'bg-gray-600'
                        }`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phase 5 Deep Dive: Solana Program */}
      <div className="mb-8 bg-gradient-to-r from-purple-900/20 via-[#111] to-[#111] border border-purple-500/40 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
          <span>🔮</span> Phase 5: On-Chain User Opt-Ins
        </h2>
        <p className="text-gray-400 mb-6">
          Instead of running dozens of separate scripts, we&apos;re building a single Solana Program
          that stores user preferences on-chain. This is the evolution from scripts to a real protocol.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-purple-400">📋</span> Program Capabilities
            </h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">Auto-compound enrollment</strong> - Opt in to swap USD1 → $FED automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">Time-lock registration</strong> - Commit to lock periods for multiplier bonuses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">Streak tracking</strong> - On-chain record of consecutive distributions received</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">Referral links</strong> - Trustless referrer/referee relationships</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-purple-400">⚡</span> Technical Architecture
            </h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">Anchor Framework</strong> - Type-safe Rust program development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">PDA accounts</strong> - User preferences stored per-wallet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">Website integration</strong> - Connect wallet, sign once, preferences saved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">Distribution integration</strong> - Reads on-chain state instead of JSON files</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-[#111] border border-purple-500/20 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Implementation Path</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-purple-900/30 rounded text-sm text-purple-300">1. Design program accounts</span>
            <span className="px-3 py-1 bg-purple-900/30 rounded text-sm text-purple-300">2. Write Anchor program</span>
            <span className="px-3 py-1 bg-purple-900/30 rounded text-sm text-purple-300">3. Deploy to devnet</span>
            <span className="px-3 py-1 bg-purple-900/30 rounded text-sm text-purple-300">4. Build website UI</span>
            <span className="px-3 py-1 bg-purple-900/30 rounded text-sm text-purple-300">5. Deploy to mainnet</span>
            <span className="px-3 py-1 bg-purple-900/30 rounded text-sm text-purple-300">6. Update distribution script</span>
          </div>
        </div>
      </div>

      {/* Detailed Phase 2 Content */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#c9a227] mb-4">Phase 2 Details</h2>
        <div className="bg-[#111] border border-[#222] rounded-xl p-8">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: phase2.content }}
          />
        </div>
      </div>

      {/* Vision */}
      <div className="bg-gradient-to-r from-[#c9a227]/10 to-transparent border border-[#c9a227]/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#c9a227] mb-3">The Vision</h3>
        <p className="text-gray-300 mb-4">
          Ralph becomes a fully autonomous DeFi agent:
        </p>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-center gap-2">
            <span className="text-[#c9a227]">→</span>
            <strong className="text-white">Self-sustaining</strong> - Generates enough fees to cover operations
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#c9a227]">→</span>
            <strong className="text-white">Self-improving</strong> - Learns from distribution patterns
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#c9a227]">→</span>
            <strong className="text-white">Community-driven</strong> - Responds to holder governance
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#c9a227]">→</span>
            <strong className="text-white">Transparent</strong> - All actions logged and verifiable
          </li>
        </ul>
      </div>
    </div>
  );
}
