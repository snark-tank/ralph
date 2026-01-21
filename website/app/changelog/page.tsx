import { getGitLog, getMarkdownContent } from '@/lib/markdown';

function CalendarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function FileTextIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getCommitType(message: string): { type: string; color: string } {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.startsWith('research:') || lowerMsg.includes('research')) {
    return { type: 'Research', color: 'bg-purple-500/20 text-purple-400' };
  }
  if (lowerMsg.startsWith('feat:') || lowerMsg.includes('feature') || lowerMsg.includes('add')) {
    return { type: 'Feature', color: 'bg-green-500/20 text-green-400' };
  }
  if (lowerMsg.startsWith('fix:') || lowerMsg.includes('fix')) {
    return { type: 'Fix', color: 'bg-red-500/20 text-red-400' };
  }
  if (lowerMsg.startsWith('docs:') || lowerMsg.includes('doc')) {
    return { type: 'Docs', color: 'bg-blue-500/20 text-blue-400' };
  }
  if (lowerMsg.startsWith('improve:') || lowerMsg.includes('improve') || lowerMsg.includes('update')) {
    return { type: 'Improve', color: 'bg-yellow-500/20 text-yellow-400' };
  }
  if (lowerMsg.startsWith('idea:') || lowerMsg.includes('idea')) {
    return { type: 'Idea', color: 'bg-pink-500/20 text-pink-400' };
  }
  return { type: 'Update', color: 'bg-gray-500/20 text-gray-400' };
}

export default async function ChangelogPage() {
  const commits = await getGitLog(50);
  const changelog = await getMarkdownContent('CHANGELOG.md');

  // Group commits by date
  const groupedCommits = commits.reduce((acc, commit) => {
    const date = commit.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(commit);
    return acc;
  }, {} as Record<string, typeof commits>);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#c9a227] mb-2">Changelog</h1>
        <p className="text-gray-400">
          Every change Ralph makes, automatically tracked. Watch the evolution in real-time.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">Research</span>
        <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">Feature</span>
        <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">Improve</span>
        <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">Docs</span>
        <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">Fix</span>
        <span className="px-2 py-1 rounded text-xs bg-pink-500/20 text-pink-400">Idea</span>
      </div>

      {/* Git Commits Timeline */}
      <div className="space-y-8 mb-12">
        {Object.entries(groupedCommits).map(([date, dateCommits]) => (
          <div key={date}>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-[#c9a227]"><CalendarIcon className="w-5 h-5" /></span>
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>

            <div className="space-y-3">
              {dateCommits.map((commit, index) => {
                const { type, color } = getCommitType(commit.message);
                return (
                  <div key={index} className="bg-[#111] border border-[#222] rounded-lg p-4 flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${color}`}>
                        {type}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white">{commit.message}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <code className="text-[#c9a227]">{commit.hash}</code>
                        <span>•</span>
                        <span>by Ralph</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {commits.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="flex justify-center mb-4">
              <FileTextIcon className="w-12 h-12" />
            </div>
            <p>No commits yet. Ralph is preparing to start his research journey!</p>
          </div>
        )}
      </div>

      {/* Manual Changelog (if exists) */}
      {changelog.content !== '<p>Content not yet available.</p>' && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#c9a227] mb-4">Release Notes</h2>
          <div className="bg-[#111] border border-[#222] rounded-xl p-8">
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: changelog.content }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#c9a227]">{commits.length}</div>
          <div className="text-gray-500 text-sm">Total Commits</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#c9a227]">{Object.keys(groupedCommits).length}</div>
          <div className="text-gray-500 text-sm">Active Days</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#c9a227]">
            {commits.filter(c => getCommitType(c.message).type === 'Research').length}
          </div>
          <div className="text-gray-500 text-sm">Research Entries</div>
        </div>
      </div>
    </div>
  );
}
