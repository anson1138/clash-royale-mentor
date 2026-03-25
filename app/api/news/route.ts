import { NextResponse } from 'next/server';
import { init } from '@instantdb/admin';

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID || '4529e179-cfd4-4a05-98fa-6c108177452f',
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');

    const result = await db.query({
      news: {
        $: {
          ...(source ? { where: { source } } : {}),
        },
      },
    });

    // Sort by publishedAt descending, limit to 50
    const news = (result.news || [])
      .sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0))
      .slice(0, 50);

    return NextResponse.json({
      success: true,
      news,
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
