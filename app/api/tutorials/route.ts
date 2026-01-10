import { NextResponse } from 'next/server';
import { init } from '@instantdb/admin';

// Initialize InstantDB Admin
const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID || '4529e179-cfd4-4a05-98fa-6c108177452f',
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

export async function GET() {
  try {
    // Fetch tutorials from InstantDB
    const result = await db.query({
      tutorials: {},
    });
    
    // Sort tutorials by order
    const tutorials = (result.tutorials || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    
    return NextResponse.json({
      success: true,
      tutorials,
    });
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
