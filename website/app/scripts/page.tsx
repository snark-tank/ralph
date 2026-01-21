export default function ScriptsPage() {
  const coreScripts = [
    {
      name: 'run-distribution.ts',
      description: 'Main orchestrator - collects fees from Meteora DAMM v2 and triggers distribution',
      status: 'active',
      schedule: 'PM2 - Every 2 min',
    },
    {
      name: 'distribute-tokens.ts',
      description: 'Distribution engine with all 4 multiplier systems (tier, streak, engagement, time lock)',
      status: 'active',
      schedule: 'Called by run-distribution',
    },
    {
      name: 'collect-dammv2-fees.ts',
      description: 'Fee collector - claims USD1 from Meteora DAMM v2 LP position',
      status: 'active',
      schedule: 'Called by run-distribution',
    },
  ];

  const multiplierScripts = [
    {
      name: 'streak-tracker.ts',
      description: 'Tracks consecutive holding days - Diamond Hands multipliers from 1.0x to 1.25x',
      status: 'integrated',
      multiplier: '1.0x - 1.25x',
    },
    {
      name: 'engagement-score.ts',
      description: 'XP-based engagement system - earn XP from distributions and check-ins',
      status: 'integrated',
      multiplier: '1.0x - 1.2x',
    },
    {
      name: 'time-lock.ts',
      description: 'Voluntary commitment locks - soft locks that boost rewards without locking tokens',
      status: 'integrated',
      multiplier: '1.05x - 2.0x',
    },
    {
      name: 'auto-compound.ts',
      description: 'Automatically swaps USD1 rewards to $FED via Jupiter Ultra API',
      status: 'integrated',
      multiplier: 'N/A',
    },
  ];

  const analyticsScripts = [
    {
      name: 'holder-report.ts',
      description: 'Unified holder analytics - aggregates tier, streak, engagement, and time lock data',
      purpose: 'Analytics API',
    },
    {
      name: 'reputation-score.ts',
      description: 'Fed Credit Score - reputation tracking based on commitment history',
      purpose: 'Credit Scoring',
    },
    {
      name: 'milestone-tracker.ts',
      description: 'QE milestone event tracking - triggers celebration bonuses at milestones',
      purpose: 'Event Tracking',
    },
    {
      name: 'fed-funds-rate.ts',
      description: 'Calculates real-time APY based on distribution history',
      purpose: 'APY Calculation',
    },
    {
      name: 'rate-decision.ts',
      description: 'AI-powered analysis of optimal distribution timing',
      purpose: 'Timing Optimization',
    },
  ];

  const gamificationScripts = [
    {
      name: 'season-tracker.ts',
      description: 'Seasonal competition tracking with leaderboards',
      status: 'ready',
    },
    {
      name: 'fed-quests.ts',
      description: 'Quest and badge system for holder achievements',
      status: 'ready',
    },
    {
      name: 'referral-bonus.ts',
      description: 'Referral rewards program for bringing new holders',
      status: 'ready',
    },
  ];

  const treasuryScripts = [
    {
      name: 'treasury-buyback.ts',
      description: 'Treasury buyback & burn - uses portion of fees to buy and burn $FED',
      status: 'ready',
    },
    {
      name: 'smart-timing.ts',
      description: 'Intelligent distribution timing based on gas prices and volume',
      status: 'ready',
    },
    {
      name: 'smart-distribution.ts',
      description: 'AI-powered distribution optimization',
      status: 'ready',
    },
    {
      name: 'sybil-detector.ts',
      description: 'Anti-sybil detection - quality over quantity protection',
      status: 'ready',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#c9a227] mb-4">
          Distribution Scripts
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          19 specialized TypeScript scripts powering the most advanced rewards distribution system in DeFi.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#22c55e]">19</div>
          <div className="text-gray-500 text-sm">Total Scripts</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#c9a227]">7</div>
          <div className="text-gray-500 text-sm">Active/Integrated</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">7</div>
          <div className="text-gray-500 text-sm">Ready for PM2</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">5</div>
          <div className="text-gray-500 text-sm">Analytics</div>
        </div>
      </div>

      {/* Core Distribution */}
      <div className="mb-8 bg-[#111] border border-green-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#22c55e] mb-4 flex items-center gap-2">
          <span>&#9889;</span> Core Distribution (PM2 Automated)
        </h2>
        <p className="text-gray-500 mb-4">These scripts run automatically via PM2 cron every 2 minutes</p>
        <div className="space-y-3">
          {coreScripts.map((script, index) => (
            <div key={index} className="flex items-start justify-between p-4 bg-[#0a0a0a] rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-[#c9a227] font-mono text-sm">{script.name}</code>
                  <span className="text-xs px-2 py-0.5 bg-green-900/50 text-green-400 rounded">Active</span>
                </div>
                <p className="text-gray-400 text-sm">{script.description}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-500 text-xs">{script.schedule}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multiplier Systems */}
      <div className="mb-8 bg-[#111] border border-[#c9a227]/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <span>&#10006;</span> Multiplier Systems (Integrated)
        </h2>
        <p className="text-gray-500 mb-4">These scripts are integrated directly into distribute-tokens.ts</p>
        <div className="space-y-3">
          {multiplierScripts.map((script, index) => (
            <div key={index} className="flex items-start justify-between p-4 bg-[#0a0a0a] rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-[#c9a227] font-mono text-sm">{script.name}</code>
                  <span className="text-xs px-2 py-0.5 bg-[#c9a227]/20 text-[#c9a227] rounded">Integrated</span>
                </div>
                <p className="text-gray-400 text-sm">{script.description}</p>
              </div>
              <div className="text-right">
                <span className="text-[#22c55e] font-mono text-sm">{script.multiplier}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics & Reporting */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>&#128202;</span> Analytics & Reporting
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analyticsScripts.map((script, index) => (
            <div key={index} className="p-4 bg-[#0a0a0a] rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <code className="text-[#c9a227] font-mono text-sm">{script.name}</code>
              </div>
              <p className="text-gray-400 text-sm mb-2">{script.description}</p>
              <span className="text-xs px-2 py-0.5 bg-[#222] text-gray-400 rounded">{script.purpose}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gamification */}
      <div className="mb-8 bg-[#111] border border-purple-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
          <span>&#127918;</span> Gamification (Ready for Activation)
        </h2>
        <p className="text-gray-500 mb-4">These scripts are ready but need PM2 cron setup to activate</p>
        <div className="space-y-3">
          {gamificationScripts.map((script, index) => (
            <div key={index} className="flex items-start justify-between p-4 bg-[#0a0a0a] rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-[#c9a227] font-mono text-sm">{script.name}</code>
                  <span className="text-xs px-2 py-0.5 bg-purple-900/50 text-purple-400 rounded">Ready</span>
                </div>
                <p className="text-gray-400 text-sm">{script.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treasury Operations */}
      <div className="mb-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>&#128176;</span> Treasury Operations (Ready for PM2)
        </h2>
        <p className="text-gray-500 mb-4">Advanced treasury management scripts ready for deployment</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {treasuryScripts.map((script, index) => (
            <div key={index} className="p-4 bg-[#0a0a0a] rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <code className="text-[#c9a227] font-mono text-sm">{script.name}</code>
                <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded">Ready</span>
              </div>
              <p className="text-gray-400 text-sm">{script.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to Run */}
      <div className="mb-8 bg-gradient-to-r from-[#c9a227]/10 to-transparent border border-[#c9a227]/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#c9a227] mb-4 flex items-center gap-2">
          <span>&#128187;</span> How Scripts Run
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">PM2 Automated (Currently Active)</h3>
            <code className="text-xs text-gray-400 block bg-[#111] p-2 rounded mb-2">
              PM2 Task 0: fed-distribution<br/>
              Cron: */2 * * * * (every 2 min)<br/>
              Script: run-distribution.ts
            </code>
            <p className="text-gray-500 text-sm">
              The main distribution runs automatically. All integrated scripts (multipliers) are called within this flow.
            </p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">To Activate Additional Scripts</h3>
            <code className="text-xs text-gray-400 block bg-[#111] p-2 rounded mb-2">
              pm2 start &quot;npx tsx script.ts&quot; \<br/>
              &nbsp;&nbsp;--name &quot;fed-script&quot; \<br/>
              &nbsp;&nbsp;--cron &quot;*/10 * * * *&quot;
            </code>
            <p className="text-gray-500 text-sm">
              Ready scripts can be activated by adding them to PM2 with a cron schedule.
            </p>
          </div>
        </div>
      </div>

      {/* GitHub Link */}
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">All scripts are open source and available on GitHub</p>
        <a
          href="https://github.com/snark-tank/ralph/tree/main/fed_project/scripts"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#222] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#333] transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}
