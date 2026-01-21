'use client';

import PreferencesPanel from '../components/PreferencesPanel';

export default function PreferencesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#c9a227] mb-2">Your $FED Preferences</h1>
        <p className="text-gray-400">
          Manage your on-chain preferences for $FED distributions.
          All settings are stored on-chain via the FED Solana Program.
        </p>
      </div>

      <div className="grid gap-6">
        <PreferencesPanel />

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-[#111] rounded-xl p-6 border border-[#222]">
            <h3 className="text-lg font-bold text-white mb-2">Auto-Compound</h3>
            <p className="text-gray-400 text-sm">
              When enabled, your USD1 distributions will be automatically converted to $FED
              at the current market rate. This means you&apos;ll accumulate more $FED tokens
              instead of receiving USD1 directly.
            </p>
          </div>

          <div className="bg-[#111] rounded-xl p-6 border border-[#222]">
            <h3 className="text-lg font-bold text-white mb-2">Time Lock</h3>
            <p className="text-gray-400 text-sm">
              Commit to holding your tokens for a period of time to earn bonus multipliers
              on distributions. The longer you lock, the higher your multiplier:
            </p>
            <ul className="mt-2 text-sm text-gray-500 space-y-1">
              <li>7 days: 1.05x</li>
              <li>30 days: 1.15x</li>
              <li>90 days: 1.30x</li>
              <li>180 days: 1.50x</li>
              <li>365 days: 2.00x</li>
            </ul>
          </div>

          <div className="bg-[#111] rounded-xl p-6 border border-[#222]">
            <h3 className="text-lg font-bold text-white mb-2">Streak Bonus</h3>
            <p className="text-gray-400 text-sm">
              Claim distributions within 48 hours of each other to build a streak.
              Each consecutive claim adds +1% to your distribution multiplier,
              up to a maximum of +25%.
            </p>
          </div>

          <div className="bg-[#111] rounded-xl p-6 border border-[#222]">
            <h3 className="text-lg font-bold text-white mb-2">Referrals</h3>
            <p className="text-gray-400 text-sm">
              Coming soon: Refer friends to earn bonus distributions when they claim.
              Referral relationships are stored on-chain and cannot be changed once set.
            </p>
          </div>
        </div>

        {/* Program Info */}
        <div className="bg-[#111] rounded-xl p-6 border border-[#222]">
          <h3 className="text-lg font-bold text-white mb-2">Program Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Program ID:</span>
              <a
                href="https://solscan.io/account/HBsfAtXFmgsr5EHDqiDJDyjuGVHhYU7ACWaEhKpVACqz"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[#c9a227] hover:underline"
              >
                HBsfAtXFmgsr...ACWaEhKpVACqz
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network:</span>
              <span className="text-green-400">Mainnet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Source Code:</span>
              <a
                href="https://github.com/snark-tank/ralph/tree/main/fed_project/fed_program"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c9a227] hover:underline"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
