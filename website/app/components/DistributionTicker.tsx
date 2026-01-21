'use client';

interface DistributionTickerProps {
  distributions: {
    date: string;
    amount: number;
    recipients: number;
    txSignature?: string;
  }[];
}

export function DistributionTicker({ distributions }: DistributionTickerProps) {
  if (distributions.length === 0) return null;

  // Create a ticker string from recent distributions
  const tickerItems = distributions.slice(0, 5).map((dist, i) => {
    const timeAgo = getTimeAgo(new Date(dist.date));
    return (
      <span key={i} className="inline-flex items-center gap-2 mx-8">
        <span className="text-[#22c55e]">+${dist.amount.toFixed(2)}</span>
        <span className="text-gray-500">to</span>
        <span className="text-white">{dist.recipients}</span>
        <span className="text-gray-500">holders</span>
        <span className="text-gray-600">({timeAgo})</span>
        {dist.txSignature && (
          <a
            href={`https://solscan.io/tx/${dist.txSignature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a227] hover:underline text-xs"
          >
            verify
          </a>
        )}
      </span>
    );
  });

  return (
    <div className="w-full overflow-hidden bg-[#0a0a0a] border-y border-[#1a1a1a] py-2">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Double the content for seamless loop */}
        <div className="flex items-center text-sm font-mono">
          <span className="text-gray-400 mx-4 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
            </span>
            LIVE
          </span>
          {tickerItems}
        </div>
        <div className="flex items-center text-sm font-mono">
          <span className="text-gray-400 mx-4 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
            </span>
            LIVE
          </span>
          {tickerItems}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
