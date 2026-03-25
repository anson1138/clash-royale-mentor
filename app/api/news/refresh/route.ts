import { NextResponse } from 'next/server';
import { refreshAllNews } from '@/lib/news/refreshAll';

export async function POST(request: Request) {
  try {
    // Optional auth check for cron security
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const result = await refreshAllNews();

    return NextResponse.json({
      success: true,
      message: `News refresh complete. Inserted ${result.inserted} new items.`,
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
