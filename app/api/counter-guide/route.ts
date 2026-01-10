import { NextResponse } from 'next/server';
import { getCounterStrategy } from '@/lib/counterGuide/strategies';

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
    
    // Get counter strategy
    const strategy = getCounterStrategy(cardName);
    
    if (!strategy) {
      return NextResponse.json(
        { success: false, error: `No counter strategy found for "${cardName}"` },
        { status: 404 }
      );
    }
    
    // TODO: Add expert advice from InstantDB knowledge base
    // For now, return empty expert advice
    const expertCitations: any[] = [];
    
    return NextResponse.json({
      success: true,
      strategy,
      expertAdvice: expertCitations,
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
