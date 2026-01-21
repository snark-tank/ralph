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
    { phase: 'Phase 2', title: 'Intelligence', status: 'in_progress', items: [
      'Dynamic threshold management',
      'Intelligent distribution timing',
      'Gas optimization',
      'Volume-aware distribution',
    ]},
    { phase: 'Phase 3', title: 'Tiers & Rewards', status: 'planned', items: [
      'Holder tier system (Diamond/Gold/Silver/Bronze)',
      'Reward multipliers',
      'Loyalty bonuses',
      'Staking duration rewards',
    ]},
    { phase: 'Phase 4', title: 'Governance', status: 'planned', items: [
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
