import { Citation } from '@/lib/rag/retrieval';

interface CitationCardProps {
  citations: Citation[];
}

export function CitationCard({ citations }: CitationCardProps) {
  if (citations.length === 0) return null;
  
  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Sources ({citations.length})
      </h3>
      <div className="space-y-2">
        {citations.map((citation, idx) => (
          <div 
            key={idx} 
            className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded border dark:border-gray-700"
          >
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[1.5rem]">
                [{idx + 1}]
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                    {citation.sourceType}
                  </span>
                  {citation.sourceUrl ? (
                    <a 
                      href={citation.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      {citation.sourceTitle}
                    </a>
                  ) : (
                    <span className="font-medium text-gray-900 dark:text-white">
                      {citation.sourceTitle}
                    </span>
                  )}
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    ({Math.round(citation.relevanceScore * 100)}% match)
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
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
