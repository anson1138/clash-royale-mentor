import { NextResponse } from 'next/server';
import { getAllCounterCards } from '@/lib/counterGuide/strategies';

export async function GET() {
  try {
    const cardKeys = getAllCounterCards();
    
    // Convert keys to display names (capitalize and replace hyphens)
    const cardNames = cardKeys.map(key => {
      // Convert "hog-rider" to "Hog Rider"
      return key
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    });
    
    return NextResponse.json({
      success: true,
      cards: cardNames.sort(),
    });
  } catch (error) {
    console.error('Error fetching card list:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
