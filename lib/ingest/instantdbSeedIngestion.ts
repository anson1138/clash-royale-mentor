import fs from 'fs/promises';
import path from 'path';
import { db } from '@/lib/instantdb';
import { randomUUID } from 'crypto';

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
 * Chunk text into smaller segments
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
 * Ingest seed markdown into InstantDB
 */
export async function ingestSeedToInstantDB() {
  const seedPath = path.join(process.cwd(), 'deck-doctor-tutorials.md');
  
  console.log('📚 Parsing seed markdown file...');
  const tutorials = await parseSeedMarkdown(seedPath);
  
  console.log(`Found ${tutorials.length} tutorials`);
  
  // Create source record in InstantDB using UUID
  const sourceId = randomUUID();
  const source = {
    id: sourceId,
    type: 'seed_markdown',
    title: 'Deck Doctor Seed Tutorials',
    author: 'Internal',
    status: 'processing',
    createdAt: Date.now(),
  };
  
  let totalChunks = 0;
  const tutorialRecords = [];
  const chunkRecords = [];
  
  for (let i = 0; i < tutorials.length; i++) {
    const tutorial = tutorials[i];
    console.log(`Processing: ${tutorial.title}`);
    
    // Create tutorial record with UUID
    const tutorialId = randomUUID();
    tutorialRecords.push({
      id: tutorialId,
      title: tutorial.title,
      category: tutorial.category,
      content: tutorial.content,
      difficulty: tutorial.category === 'advanced' ? 'advanced' : 'intermediate',
      order: i + 1,
      sourceId,
      createdAt: Date.now(),
    });
    
    // Chunk the content
    const fullText = `${tutorial.title}\n\n${tutorial.content}`;
    const chunks = chunkText(fullText);
    
    console.log(`  → ${chunks.length} chunks`);
    
    // Create chunk records with UUID
    for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
      const chunk = chunks[chunkIdx];
      chunkRecords.push({
        id: randomUUID(),
        sourceId,
        content: chunk,
        chunkIndex: totalChunks + chunkIdx,
        metadata: JSON.stringify({
          tutorialTitle: tutorial.title,
          category: tutorial.category,
          chunkWithinTutorial: chunkIdx,
        }),
        createdAt: Date.now(),
      });
    }
    
    totalChunks += chunks.length;
  }
  
  console.log(`✅ Prepared ${totalChunks} chunks from ${tutorials.length} tutorials`);
  
  return {
    source,
    tutorials: tutorialRecords,
    chunks: chunkRecords,
    tutorialsCount: tutorials.length,
    chunksCount: totalChunks,
  };
}
