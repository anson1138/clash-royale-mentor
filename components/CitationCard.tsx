import { Citation } from '@/lib/rag/retrieval';

interface CitationCardProps {
  citations: Citation[];
}

export function CitationCard({ citations }: CitationCardProps) {
  if (citations.length === 0) return null;

  return (
    <div className="mt-4 border-t border-outline-variant/20 pt-4">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-on-surface-variant">
        Sources ({citations.length})
      </h3>
      <div className="space-y-2">
        {citations.map((citation, idx) => (
          <div
            key={idx}
            className="text-xs bg-surface-container-low p-3 rounded-lg border border-outline-variant/10"
          >
            <div className="flex items-start gap-2">
              <span className="font-bold text-primary min-w-[1.5rem]">
                [{idx + 1}]
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-semibold">
                    {citation.sourceType}
                  </span>
                  {citation.sourceUrl ? (
                    <a
                      href={citation.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      {citation.sourceTitle}
                    </a>
                  ) : (
                    <span className="font-medium text-on-surface">
                      {citation.sourceTitle}
                    </span>
                  )}
                  <span className="text-outline text-xs">
                    ({Math.round(citation.relevanceScore * 100)}% match)
                  </span>
                </div>
                <p className="text-on-surface-variant line-clamp-3">
                  {citation.chunkContent}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
