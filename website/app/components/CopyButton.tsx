'use client';

export function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="text-gray-500 hover:text-[#c9a227] transition-colors"
      title="Copy address"
    >
      📋
    </button>
  );
}
