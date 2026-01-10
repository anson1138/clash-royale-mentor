import { NextResponse } from 'next/server';
import { analyzeDeck } from '@/lib/deckDoctor/rubric';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cards } = body;
    
    if (!cards || !Array.isArray(cards)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: cards must be an array' },
        { status: 400 }
      );
    }

    if (cards.length !== 8) {
      return NextResponse.json(
        { success: false, error: `Must provide exactly 8 card names (received ${cards.length})` },
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
    
    // Return user-friendly error message
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
