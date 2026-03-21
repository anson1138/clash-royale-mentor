import { NextResponse } from 'next/server';
import { getAICounterStrategy } from '@/lib/counterGuide/llmCounterGuide';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cardName } = body;

    if (!cardName) {
      return NextResponse.json(
        { success: false, error: 'Card name is required' },
        { status: 400 }
      );
    }

    // Generate AI-powered counter strategy
    const strategy = await getAICounterStrategy(cardName);

    return NextResponse.json({
      success: true,
      strategy,
      expertAdvice: [],
    });
  } catch (error) {
    console.error('Counter guide error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
