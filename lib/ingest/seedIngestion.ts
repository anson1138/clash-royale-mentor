import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';
import { generateEmbedding } from './embeddings';

interface Tutorial {
  title: string;
  content: string;
  category: string;
}

/**
 * Parse the deck-doctor-tutorials.md file into structured tutorials
 */
export async function parseSeedMarkdown(filePath: string): Promise<Tutorial[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  const tutorials: Tutorial[] = [];
  
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
 * Ingest the seed markdown file into the database
 */
export async function ingestSeedMarkdown() {
  const seedPath = path.join(process.cwd(), 'deck-doctor-tutorials.md');
  
  console.log('📚 Parsing seed markdown file...');
  const tutorials = await parseSeedMarkdown(seedPath);
  
  console.log(`Found ${tutorials.length} tutorials`);
  
  // Check if seed source already exists
  let source = await prisma.source.findFirst({
    where: { type: 'seed_markdown', title: 'Deck Doctor Seed Tutorials' },
  });
  
  if (source) {
    console.log('⚠️  Seed source already exists. Deleting old chunks...');
    await prisma.sourceChunk.deleteMany({
      where: { sourceId: source.id },
    });
  } else {
    console.log('Creating new seed source...');
    source = await prisma.source.create({
      data: {
        type: 'seed_markdown',
        title: 'Deck Doctor Seed Tutorials',
        author: 'Internal',
        tags: JSON.stringify(['deck-building', 'strategy', 'fundamentals']),
        status: 'processing',
      },
    });
  }
  
  // Process each tutorial
  let totalChunks = 0;
  for (let i = 0; i < tutorials.length; i++) {
    const tutorial = tutorials[i];
    console.log(`Processing: ${tutorial.title}`);
    
    // Create tutorial record
    const existingTutorial = await prisma.tutorial.findFirst({
      where: { title: tutorial.title },
    });
    
    if (!existingTutorial) {
      await prisma.tutorial.create({
        data: {
          title: tutorial.title,
          category: tutorial.category,
          content: tutorial.content,
          difficulty: tutorial.category === 'advanced' ? 'advanced' : 'intermediate',
          order: i + 1,
          sourceId: source.id,
        },
      });
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
        
        await prisma.sourceChunk.create({
          data: {
            sourceId: source.id,
            content: chunk,
            embedding: JSON.stringify(embedding),
            chunkIndex: totalChunks + chunkIdx,
            metadata: JSON.stringify({
              tutorialTitle: tutorial.title,
              category: tutorial.category,
              chunkWithinTutorial: chunkIdx,
            }),
          },
        });
      } catch (error) {
        console.error(`  ✗ Error embedding chunk ${chunkIdx}:`, error);
      }
    }
    
    totalChunks += chunks.length;
  }
  
  // Update source status
  await prisma.source.update({
    where: { id: source.id },
    data: { status: 'completed' },
  });
  
  console.log(`✅ Ingestion complete! Created ${totalChunks} chunks from ${tutorials.length} tutorials`);
  
  return {
    tutorialsCount: tutorials.length,
    chunksCount: totalChunks,
  };
}
