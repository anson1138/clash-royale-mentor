import { NextResponse } from 'next/server';
import { analyzeDeckWithLLM, LLMDeckAnalysis } from '@/lib/deckDoctor/llmAnalysis';
import { getCardInfo } from '@/lib/deckDoctor/cardDatabase';

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

    // Validate all cards exist
    const unknownCards = cards.filter((name: string) => !getCardInfo(name));
    if (unknownCards.length > 0) {
      return NextResponse.json(
        { success: false, error: `Unknown cards: ${unknownCards.join(', ')}` },
        { status: 400 }
      );
    }

    // Check for Gemini API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Deck analysis is not configured. Please set GOOGLE_GEMINI_API_KEY.' },
        { status: 500 }
      );
    }
    
    // Run LLM-powered deck analysis
    const analysis = await analyzeDeckWithLLM(cards);
    
    return NextResponse.json({
      success: true,
      analysis,
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
