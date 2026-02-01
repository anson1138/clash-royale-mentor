import { NextRequest, NextResponse } from 'next/server';
import { analyzeBattleWithAI, BattleAnalysis } from '@/lib/replayAnalyzer/battleAnalysis';
import { Battle } from '@/lib/clashApi/client';

export async function POST(request: NextRequest) {
  try {
    const { battle, playerTag } = await request.json();

    if (!battle) {
      return NextResponse.json({
        success: false,
        error: 'Battle data is required',
      });
    }

    if (!playerTag) {
      return NextResponse.json({
        success: false,
        error: 'Player tag is required',
      });
    }

    // Check for Gemini API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Battle analysis is not configured. Please set GOOGLE_GEMINI_API_KEY.',
      }, { status: 500 });
    }

    // Analyze the battle with AI
    const analysis = await analyzeBattleWithAI(battle as Battle, playerTag);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Battle analysis error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
