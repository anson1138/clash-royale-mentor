import { NextResponse } from 'next/server';
import { ingestSeedToInstantDB } from '@/lib/ingest/instantdbSeedIngestion';
import { init } from '@instantdb/admin';

// Initialize InstantDB Admin
const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID || '4529e179-cfd4-4a05-98fa-6c108177452f',
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

export async function POST() {
  try {
    // Check if admin token is configured
    if (!process.env.INSTANT_ADMIN_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'INSTANT_ADMIN_TOKEN not configured. Please add it to .env.local from your InstantDB dashboard.',
      }, { status: 200 });
    }
    
    console.log('🗑️ Clearing existing seed data...');
    
    // Delete existing seed data
    try {
      const existingSources = await db.query({
        sources: {
          $: {
            where: {
              type: 'seed_markdown',
            },
          },
        },
      });
      
      const sourceIds = existingSources.sources.map((s: any) => s.id);
      
      if (sourceIds.length > 0) {
        // Delete chunks associated with these sources
        const existingChunks = await db.query({
          sourceChunks: {
            $: {
              where: {
                sourceId: { in: sourceIds },
              },
            },
          },
        });
        
        for (const chunk of existingChunks.sourceChunks) {
          await db.transact([db.tx.sourceChunks[chunk.id].delete()]);
        }
        
        // Delete tutorials associated with these sources
        const existingTutorials = await db.query({
          tutorials: {
            $: {
              where: {
                sourceId: { in: sourceIds },
              },
            },
          },
        });
        
        for (const tutorial of existingTutorials.tutorials) {
          await db.transact([db.tx.tutorials[tutorial.id].delete()]);
        }
        
        // Delete the sources themselves
        for (const source of existingSources.sources) {
          await db.transact([db.tx.sources[source.id].delete()]);
        }
        
        console.log('✅ Cleared existing data');
      }
    } catch (cleanupError) {
      console.warn('Warning during cleanup:', cleanupError);
      // Continue even if cleanup fails
    }
    
    // Parse and prepare the data
    const result = await ingestSeedToInstantDB();
    
    // Write to InstantDB
    console.log('📝 Writing to InstantDB...');
    
    // Write source
    await db.transact([
      db.tx.sources[result.source.id].update(result.source),
    ]);
    
    // Write tutorials in batches
    for (const tutorial of result.tutorials) {
      await db.transact([
        db.tx.tutorials[tutorial.id].update(tutorial),
      ]);
    }
    
    // Write chunks in batches (to avoid overwhelming the API)
    const batchSize = 10;
    for (let i = 0; i < result.chunks.length; i += batchSize) {
      const batch = result.chunks.slice(i, i + batchSize);
      const transactions = batch.map(chunk => 
        db.tx.sourceChunks[chunk.id].update(chunk)
      );
      await db.transact(transactions);
      console.log(`  → Wrote chunks ${i + 1}-${Math.min(i + batchSize, result.chunks.length)} of ${result.chunks.length}`);
    }
    
    // Update source status to completed
    await db.transact([
      db.tx.sources[result.source.id].update({ status: 'completed' }),
    ]);
    
    console.log('✅ Successfully ingested to InstantDB!');
    
    return NextResponse.json({
      success: true,
      message: 'Seed markdown ingested successfully',
      data: {
        tutorialsCount: result.tutorialsCount,
        chunksCount: result.chunksCount,
      },
    });
  } catch (error) {
    console.error('Seed ingestion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to trigger seed ingestion',
  });
}
