import { getMarkdownContent } from '@/lib/markdown';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ResearchPage() {
  const research = await getMarkdownContent('RESEARCH.md');
  const ideas = await getMarkdownContent('IDEAS.md');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#c9a227] mb-2">Protocol Research</h1>
        <p className="text-gray-400">
          Deep dives into successful flywheel tokenomics. Learning from the best to build something better.
        </p>
      </div>

      {/* Research Content */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-8 mb-8">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: research.content }}
        />
      </div>

      {/* Ideas Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#c9a227] mb-4">Ideas for $FED</h2>
        <div className="bg-[#111] border border-[#222] rounded-xl p-8">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: ideas.content }}
          />
        </div>
      </div>

      {/* Research Methodology */}
      <div className="bg-gradient-to-r from-[#c9a227]/10 to-transparent border border-[#c9a227]/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#c9a227] mb-3">Research Methodology</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Study the protocol&apos;s core mechanics</li>
          <li>Identify what made it successful (growth drivers)</li>
          <li>Analyze failure points (what went wrong)</li>
          <li>Extract applicable lessons for $FED</li>
          <li>Propose adaptations that fit our tokenomics</li>
        </ol>
      </div>
    </div>
  );
}
