import { adminDb, isAdminConfigured, Source, SourceChunk } from '@/lib/instantdb-admin';
import { generateEmbedding, cosineSimilarity } from '@/lib/ingest/embeddings';

export interface Citation {
  sourceId: string;
  sourceTitle: string;
  sourceType: string;
  sourceUrl?: string;
  chunkContent: string;
  relevanceScore: number;
}

export interface RagResult {
  answer: string;
  citations: Citation[];
}

/**
 * Search for relevant chunks based on a query
 */
export async function searchKnowledgeBase(
  query: string,
  topK: number = 5,
  minSimilarity: number = 0.5
): Promise<Citation[]> {
  try {
    // Check if InstantDB admin is configured
    if (!isAdminConfigured()) {
      console.warn('InstantDB admin token not configured, returning empty results');
      return [];
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    
    // Fetch all sources and chunks from InstantDB
    const result = await adminDb.query({
      sources: {},
      sourceChunks: {},
    });

    const sources = (result?.sources || []) as Source[];
    const chunks = (result?.sourceChunks || []) as SourceChunk[];
    
    // Create a map of sources for quick lookup
    const sourceMap = new Map<string, Source>();
    for (const source of sources) {
      if (source.status === 'completed') {
        sourceMap.set(source.id, source);
      }
    }
    
    // Calculate similarity scores
    const scoredChunks = chunks
      .map(chunk => {
        // Only include chunks from completed sources
        const source = sourceMap.get(chunk.sourceId);
        if (!source || !chunk.embedding) return null;
        
        try {
          const chunkEmbedding = JSON.parse(chunk.embedding);
          const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
          
          return {
            chunk,
            source,
            similarity,
          };
        } catch (error) {
          console.error('Error parsing embedding:', error);
          return null;
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null && item.similarity >= minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    
    // Convert to citations
    return scoredChunks.map(({ chunk, source, similarity }) => ({
      sourceId: source.id,
      sourceTitle: source.title,
      sourceType: source.type,
      sourceUrl: source.url || undefined,
      chunkContent: chunk.content,
      relevanceScore: similarity,
    }));
  } catch (error) {
    console.error('Database query failed, returning empty results:', error);
    // Return empty results if database is not available
    return [];
  }
}

/**
 * Format citations for display
 */
export function formatCitations(citations: Citation[]): string {
  if (citations.length === 0) return '';
  
  return citations
    .map((citation, idx) => {
      const sourceInfo = citation.sourceUrl 
        ? `[${citation.sourceTitle}](${citation.sourceUrl})`
        : citation.sourceTitle;
      
      return `[${idx + 1}] ${sourceInfo} (${citation.sourceType})`;
    })
    .join('\n');
}

/**
 * Generate a cited answer using RAG
 */
export async function generateCitedAnswer(
  query: string,
  systemPrompt?: string
): Promise<RagResult> {
  // Search for relevant context
  const citations = await searchKnowledgeBase(query);
  
  if (citations.length === 0) {
    return {
      answer: "I don't have enough expert knowledge in the database yet to answer this question confidently. Please add more sources in the Admin panel.",
      citations: [],
    };
  }
  
  // Build context from top citations
  const context = citations
    .map((c, idx) => `[${idx + 1}] ${c.chunkContent}`)
    .join('\n\n');
  
  // Generate answer (you can integrate with OpenAI or another LLM here)
  // For now, we'll return the top citation as a simple answer
  const answer = `Based on expert sources:\n\n${citations[0].chunkContent}\n\n${formatCitations(citations)}`;
  
  return {
    answer,
    citations,
  };
}
