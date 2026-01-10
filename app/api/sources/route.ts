import { NextResponse } from 'next/server';
import { init } from '@instantdb/admin';

// Initialize InstantDB Admin
const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID || '4529e179-cfd4-4a05-98fa-6c108177452f',
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

export async function GET() {
  try {
    // Check if admin token is configured
    if (!process.env.INSTANT_ADMIN_TOKEN) {
      return NextResponse.json({
        success: true,
        sources: [],
        message: 'INSTANT_ADMIN_TOKEN not configured',
      });
    }
    
    // Query sources from InstantDB
    const result = await db.query({
      sources: {
        $: {
          order: {
            serverCreatedAt: 'desc',
          },
        },
      },
    });
    
    const sources = result.sources || [];
    
    // Get chunk counts for each source
    const sourcesWithCounts = await Promise.all(
      sources.map(async (source: any) => {
        const chunks = await db.query({
          sourceChunks: {
            $: {
              where: {
                sourceId: source.id,
              },
            },
          },
        });
        
        return {
          id: source.id,
          type: source.type,
          title: source.title,
          url: source.url,
          author: source.author,
          status: source.status,
          chunkCount: chunks.sourceChunks?.length || 0,
          createdAt: source.createdAt,
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      sources: sourcesWithCounts,
    });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
