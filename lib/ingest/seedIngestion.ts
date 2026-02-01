import fs from 'fs/promises';
import path from 'path';
import { adminDb, isAdminConfigured, Source, SourceChunk, Tutorial } from '@/lib/instantdb-admin';
import { generateEmbedding } from './embeddings';
import { id as createId } from '@instantdb/admin';

interface TutorialData {
  title: string;
  content: string;
  category: string;
}

/**
 * Parse the deck-doctor-tutorials.md file into structured tutorials
 */
export async function parseSeedMarkdown(filePath: string): Promise<TutorialData[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  const tutorials: TutorialData[] = [];
  
  // Split by numbered sections (e.g., "1. ", "2. ", etc.)
  const sections = content.split(/(?=^\d+\.\s)/m);
  
  for (const section of sections) {
    if (!section.trim()) continue;
    
    // Extract title (first line)
    const lines = section.trim().split('\n');
    const firstLine = lines[0];
    const titleMatch = firstLine.match(/^\d+\.\s+(.+)$/);
    
    if (!titleMatch) continue;
    
    const title = titleMatch[1];
    const tutorialContent = lines.slice(1).join('\n').trim();
    
    // Determine category based on content or position
    let category = 'basics';
    if (section.includes('Synergy')) category = 'synergy';
    else if (section.includes('Advanced') || section.includes('Champion') || section.includes('Evolution')) {
      category = 'advanced';
    } else if (section.includes('Archetype') || section.includes('Combo')) {
      category = 'synergy';
    }
    
    tutorials.push({
      title,
      content: tutorialContent,
      category,
    });
  }
  
  return tutorials;
}

/**
 * Chunk text into smaller segments for embedding
 */
export function chunkText(text: string, maxChunkSize: number = 500): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Ingest the seed markdown file into InstantDB
 */
export async function ingestSeedMarkdown() {
  if (!isAdminConfigured()) {
    throw new Error('InstantDB admin token not configured');
  }

  const seedPath = path.join(process.cwd(), 'deck-doctor-tutorials.md');
  
  console.log('📚 Parsing seed markdown file...');
  const tutorials = await parseSeedMarkdown(seedPath);
  
  console.log(`Found ${tutorials.length} tutorials`);
  
  // Check if seed source already exists
  const result = await adminDb.query({
    sources: {
      $: {
        where: {
          type: 'seed_markdown',
          title: 'Deck Doctor Seed Tutorials',
        },
      },
    },
  });

  let sourceId: string;
  const existingSources = (result?.sources || []) as Source[];
  
  if (existingSources.length > 0) {
    console.log('⚠️  Seed source already exists. Deleting old chunks...');
    sourceId = existingSources[0].id;
    
    // Delete old chunks for this source
    const chunkResult = await adminDb.query({
      sourceChunks: {
        $: {
          where: { sourceId },
        },
      },
    });
    
    const oldChunks = (chunkResult?.sourceChunks || []) as SourceChunk[];
    if (oldChunks.length > 0) {
      await adminDb.transact(
        oldChunks.map(chunk => adminDb.tx.sourceChunks[chunk.id].delete())
      );
    }
  } else {
    console.log('Creating new seed source...');
    sourceId = createId();
    await adminDb.transact(
      adminDb.tx.sources[sourceId].update({
        type: 'seed_markdown',
        title: 'Deck Doctor Seed Tutorials',
        author: 'Internal',
        tags: JSON.stringify(['deck-building', 'strategy', 'fundamentals']),
        status: 'processing',
        createdAt: Date.now(),
      })
    );
  }
  
  // Process each tutorial
  let totalChunks = 0;
  for (let i = 0; i < tutorials.length; i++) {
    const tutorial = tutorials[i];
    console.log(`Processing: ${tutorial.title}`);
    
    // Check if tutorial already exists
    const tutorialResult = await adminDb.query({
      tutorials: {
        $: {
          where: { title: tutorial.title },
        },
      },
    });
    
    const existingTutorials = (tutorialResult?.tutorials || []) as Tutorial[];
    
    if (existingTutorials.length === 0) {
      const tutorialId = createId();
      await adminDb.transact(
        adminDb.tx.tutorials[tutorialId].update({
          title: tutorial.title,
          category: tutorial.category,
          content: tutorial.content,
          difficulty: tutorial.category === 'advanced' ? 'advanced' : 'intermediate',
          order: i + 1,
          sourceId,
          createdAt: Date.now(),
        })
      );
    }
    
    // Chunk the content
    const fullText = `${tutorial.title}\n\n${tutorial.content}`;
    const chunks = chunkText(fullText);
    
    console.log(`  → ${chunks.length} chunks`);
    
    // Generate embeddings and store chunks
    for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
      const chunk = chunks[chunkIdx];
      
      try {
        const embedding = await generateEmbedding(chunk);
        const chunkId = createId();
        
        await adminDb.transact(
          adminDb.tx.sourceChunks[chunkId].update({
            sourceId,
            content: chunk,
            embedding: JSON.stringify(embedding),
            chunkIndex: totalChunks + chunkIdx,
            metadata: JSON.stringify({
              tutorialTitle: tutorial.title,
              category: tutorial.category,
              chunkWithinTutorial: chunkIdx,
            }),
            createdAt: Date.now(),
          })
        );
      } catch (error) {
        console.error(`  ✗ Error embedding chunk ${chunkIdx}:`, error);
      }
    }
    
    totalChunks += chunks.length;
  }
  
  // Update source status
  await adminDb.transact(
    adminDb.tx.sources[sourceId].update({
      status: 'completed',
    })
  );
  
  console.log(`✅ Ingestion complete! Created ${totalChunks} chunks from ${tutorials.length} tutorials`);
  
  return {
    tutorialsCount: tutorials.length,
    chunksCount: totalChunks,
  };
}
