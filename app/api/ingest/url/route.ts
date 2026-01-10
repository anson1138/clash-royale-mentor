import { NextResponse } from 'next/server';
import { ingestUrl } from '@/lib/ingest/urlIngestion';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, tags = [] } = body;
    
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }
    
    const sourceId = await ingestUrl(url, tags);
    
    return NextResponse.json({
      success: true,
      message: 'URL ingested successfully',
      sourceId,
    });
  } catch (error) {
    console.error('URL ingestion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
