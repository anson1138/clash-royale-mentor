import { NextResponse } from 'next/server';
import { forceRefreshNews } from '@/lib/news/refreshAll';

export async function POST() {
  try {
    const result = await forceRefreshNews();

    return NextResponse.json({
      success: true,
      message: `Fetched ${result.news.length} news items from all sources.`,
      errors: result.errors,
    });
  } catch (error) {
    console.error('News refresh error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
