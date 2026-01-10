import { NextResponse } from 'next/server';
import { analyzeDeck } from '@/lib/deckDoctor/rubric';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cards } = body;
    
    if (!cards || !Array.isArray(cards) || cards.length !== 8) {
      return NextResponse.json(
        { success: false, error: 'Must provide exactly 8 card names' },
        { status: 400 }
      );
    }
    
    // Run deck analysis
    const analysis = analyzeDeck(cards);
    
    // TODO: Add expert advice from InstantDB knowledge base
    // For now, return empty expert advice
    const expertAdvice: any[] = [];
    
    return NextResponse.json({
      success: true,
      analysis,
      expertAdvice,
    });
  } catch (error) {
    console.error('Deck analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
