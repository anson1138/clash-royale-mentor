import { NextResponse } from 'next/server';
import { createClient, getConfig } from '@/lib/clashApi/client';
import { analyzeBattles } from '@/lib/clashApi/patternMiner';
// import { searchKnowledgeBase } from '@/lib/rag/retrieval'; // Temporarily disabled - requires OpenAI API key

export async function POST(request: Request) {
  try {
    // Check if API is enabled
    const config = getConfig();
    if (!config.enabled) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Replay Analyzer is disabled in production. It requires a static-IP proxy setup for the Clash Royale API.',
          disabled: true,
        },
        { status: 503 }
      );
    }
    
    const body = await request.json();
    const { playerTag } = body;
    
    if (!playerTag) {
      return NextResponse.json(
        { success: false, error: 'Player tag is required' },
        { status: 400 }
      );
    }
    
    // Ensure tag starts with #
    const normalizedTag = playerTag.startsWith('#') ? playerTag : `#${playerTag}`;
    
    const client = createClient();
    
    // Fetch player info and battle log
    const [playerInfo, battleLog] = await Promise.all([
      client.getPlayer(normalizedTag),
      client.getBattleLog(normalizedTag),
    ]);
    
    // Analyze battles for patterns
    const patterns = analyzeBattles(battleLog);
    
    // Expert advice temporarily disabled until OpenAI API key is configured
    // const expertAdvice = [];
    // for (const pattern of patterns.slice(0, 2)) {
    //   const citations = await searchKnowledgeBase(pattern.description, 2);
    //   if (citations.length > 0) {
    //     expertAdvice.push({
    //       pattern: pattern.pattern,
    //       advice: citations[0].chunkContent,
    //       source: citations[0].sourceTitle,
    //     });
    //   }
    // }
    
    return NextResponse.json({
      success: true,
      player: {
        tag: playerInfo.tag,
        name: playerInfo.name,
        trophies: playerInfo.trophies,
        bestTrophies: playerInfo.bestTrophies,
      },
      battles: battleLog,
      patterns,
      expertAdvice: [], // Disabled until OpenAI API configured
      battleCount: battleLog.length,
    });
  } catch (error) {
    console.error('Replay analyzer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
