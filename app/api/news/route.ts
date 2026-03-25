import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/news/refreshAll';

export async function GET() {
  try {
    const result = await fetchAllNews();

    return NextResponse.json({
      success: true,
      news: result.news,
      fromCache: result.fromCache,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
