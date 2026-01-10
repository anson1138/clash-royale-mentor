import { NextRequest, NextResponse } from 'next/server';
import { analyzeBattles } from '@/lib/clashApi/patternMiner';
import {
  getPlayer,
  getPlayerBattles,
  ClashRoyaleAPIError,
} from '@/lib/clashApi/client';

export async function POST(request: NextRequest) {
  try {
    const { playerTag } = await request.json();

    if (!playerTag) {
      return NextResponse.json({
        success: false,
        error: 'Player tag is required',
      });
    }

    // Fetch player data and battles using the RoyaleAPI proxy client
    const playerData = await getPlayer(playerTag);
    const battles = await getPlayerBattles(playerTag);

    // Analyze patterns in battle history
    const patterns = analyzeBattles(battles);

    // RAG/expert advice is optional - can be added later if needed
    const expertAdvice: any[] = [];

    return NextResponse.json({
      success: true,
      player: {
        name: playerData.name,
        tag: playerData.tag,
        trophies: playerData.trophies,
        bestTrophies: playerData.bestTrophies,
        wins: playerData.wins,
        losses: playerData.losses,
      },
      battles,
      patterns,
      expertAdvice,
    });
  } catch (error) {
    console.error('Replay Analyzer Error:', error);

    // Handle API-specific errors
    if (error instanceof ClashRoyaleAPIError) {
      // Check if it's a configuration error
      if (error.message.includes('not configured')) {
        return NextResponse.json({
          success: false,
          error:
            'Clash Royale API is not configured. Please add your API token to .env file.',
          disabled: true,
        });
      }

      return NextResponse.json({
        success: false,
        error: `API Error: ${error.message}`,
      });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}
