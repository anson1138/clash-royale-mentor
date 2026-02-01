import { GoogleGenerativeAI } from '@google/generative-ai';
import { Battle } from '@/lib/clashApi/client';
import { getCardInfo } from '@/lib/deckDoctor/cardDatabase';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export interface BattleAnalysis {
  summary: string;
  outcome: 'win' | 'loss' | 'draw';
  keyFactors: string[];
  whatWentWell: string[];
  whatCouldImprove: string[];
  matchupAnalysis: {
    playerDeckType: string;
    opponentDeckType: string;
    matchupFavorability: 'favorable' | 'even' | 'unfavorable';
    explanation: string;
  };
  tacticalTips: string[];
  deckDoctorRecommendation: string;
}

const SYSTEM_PROMPT = `You are an expert Clash Royale coach and battle analyst. You have deep knowledge of:
- All deck archetypes (2.6 Hog Cycle, Log Bait, Golem Beatdown, Lavaloon, X-Bow, Mortar Bait, Bridge Spam, etc.)
- Card interactions and counters
- Elixir management and trade concepts
- Common mistakes players make at different trophy ranges
- Matchup dynamics between deck types
- Tower damage patterns and what they indicate about the battle flow

Your analysis should be specific, actionable, and based on the concrete data available. Focus on what the player can learn and improve.`;

function calculateAvgElixir(cards: Array<{ name: string }>): number {
  let total = 0;
  let count = 0;
  for (const card of cards) {
    const info = getCardInfo(card.name);
    if (info?.elixir) {
      total += info.elixir;
      count++;
    }
  }
  return count > 0 ? Number((total / count).toFixed(1)) : 4.0;
}

function buildBattlePrompt(battle: Battle, playerTag: string): string {
  const isPlayerTeam0 = battle.team[0]?.tag?.toUpperCase().replace('#', '') === playerTag.toUpperCase().replace('#', '');
  const playerTeam = isPlayerTeam0 ? battle.team[0] : battle.team[1] || battle.team[0];
  const opponent = battle.opponent[0];

  const playerCrowns = playerTeam?.crowns || 0;
  const opponentCrowns = opponent?.crowns || 0;
  const result = playerCrowns > opponentCrowns ? 'WIN' : playerCrowns < opponentCrowns ? 'LOSS' : 'DRAW';

  const playerCards = playerTeam?.cards?.map(c => c.name).join(', ') || 'Unknown';
  const opponentCards = opponent?.cards?.map(c => c.name).join(', ') || 'Unknown';

  const playerAvgElixir = playerTeam?.cards ? calculateAvgElixir(playerTeam.cards) : 0;
  const opponentAvgElixir = opponent?.cards ? calculateAvgElixir(opponent.cards) : 0;

  // Tower HP analysis
  let towerAnalysis = '';
  if (playerTeam?.kingTowerHitPoints !== undefined || playerTeam?.princessTowersHitPoints) {
    const kingHP = playerTeam.kingTowerHitPoints ?? 'destroyed';
    const princessHP = playerTeam.princessTowersHitPoints?.join(', ') || 'unknown';
    towerAnalysis += `\nPlayer Tower HP - King: ${kingHP}, Princess Towers: ${princessHP}`;
  }
  if (opponent?.kingTowerHitPoints !== undefined || opponent?.princessTowersHitPoints) {
    const kingHP = opponent.kingTowerHitPoints ?? 'destroyed';
    const princessHP = opponent.princessTowersHitPoints?.join(', ') || 'unknown';
    towerAnalysis += `\nOpponent Tower HP - King: ${kingHP}, Princess Towers: ${princessHP}`;
  }

  // Trophy context
  let trophyContext = '';
  if (playerTeam?.startingTrophies) {
    trophyContext = `\nTrophy Range: ${playerTeam.startingTrophies}`;
    if (playerTeam?.trophyChange !== undefined) {
      trophyContext += ` (${playerTeam.trophyChange >= 0 ? '+' : ''}${playerTeam.trophyChange} after battle)`;
    }
  }

  return `Analyze this Clash Royale battle:

BATTLE RESULT: ${result}
Final Score: ${playerCrowns} - ${opponentCrowns} crowns

GAME MODE: ${battle.gameMode?.name || 'Unknown'}
ARENA: ${battle.arena?.name || 'Unknown'}
${trophyContext}

PLAYER'S DECK:
Cards: ${playerCards}
Average Elixir: ${playerAvgElixir}

OPPONENT'S DECK:
Cards: ${opponentCards}
Average Elixir: ${opponentAvgElixir}

TOWER DAMAGE:${towerAnalysis || '\nNo tower HP data available'}

Based on this battle data, provide your analysis in the following JSON format:
{
  "summary": "A 2-3 sentence summary of the battle explaining the key reason for the outcome",
  "outcome": "${result.toLowerCase()}",
  "keyFactors": ["Array of 2-4 main factors that determined the outcome"],
  "whatWentWell": ["Array of 2-3 things the player did well or had going for them"],
  "whatCouldImprove": ["Array of 2-3 specific, actionable improvements the player could make"],
  "matchupAnalysis": {
    "playerDeckType": "The archetype/type of the player's deck",
    "opponentDeckType": "The archetype/type of the opponent's deck",
    "matchupFavorability": "favorable/even/unfavorable - from the player's perspective",
    "explanation": "Why this matchup favors one side or is even"
  },
  "tacticalTips": ["Array of 2-3 specific tactical tips for this deck against this opponent type"],
  "deckDoctorRecommendation": "A brief recommendation about whether they should analyze their deck with Deck Doctor and why"
}

Analysis guidelines:
1. Be specific - reference actual cards in the decks
2. Consider the tower HP data to infer what happened during the battle
3. For losses, focus on constructive improvement suggestions rather than criticism
4. For wins, still identify areas that could be improved
5. Base matchup analysis on the actual deck compositions
6. Tactical tips should be specific to the card matchups present

Return ONLY valid JSON, no other text.`;
}

export async function analyzeBattleWithAI(
  battle: Battle,
  playerTag: string
): Promise<BattleAnalysis> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const prompt = buildBattlePrompt(battle, playerTag);

  try {
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: prompt },
    ]);

    const responseText = result.response.text();
    const analysis = JSON.parse(responseText) as BattleAnalysis;

    // Validate and normalize the response
    return {
      summary: analysis.summary || 'Unable to generate summary.',
      outcome: validateOutcome(analysis.outcome),
      keyFactors: Array.isArray(analysis.keyFactors) ? analysis.keyFactors : [],
      whatWentWell: Array.isArray(analysis.whatWentWell) ? analysis.whatWentWell : [],
      whatCouldImprove: Array.isArray(analysis.whatCouldImprove) ? analysis.whatCouldImprove : [],
      matchupAnalysis: {
        playerDeckType: analysis.matchupAnalysis?.playerDeckType || 'Unknown',
        opponentDeckType: analysis.matchupAnalysis?.opponentDeckType || 'Unknown',
        matchupFavorability: validateFavorability(analysis.matchupAnalysis?.matchupFavorability),
        explanation: analysis.matchupAnalysis?.explanation || '',
      },
      tacticalTips: Array.isArray(analysis.tacticalTips) ? analysis.tacticalTips : [],
      deckDoctorRecommendation: analysis.deckDoctorRecommendation || 
        'Consider using Deck Doctor to analyze your deck for potential improvements.',
    };
  } catch (error) {
    console.error('Battle analysis error:', error);
    throw new Error('Failed to analyze battle with AI. Please try again.');
  }
}

function validateOutcome(outcome: string): 'win' | 'loss' | 'draw' {
  const lower = (outcome || '').toLowerCase();
  if (lower === 'win' || lower === 'loss' || lower === 'draw') {
    return lower as 'win' | 'loss' | 'draw';
  }
  return 'draw';
}

function validateFavorability(favorability: string): 'favorable' | 'even' | 'unfavorable' {
  const lower = (favorability || '').toLowerCase();
  if (lower === 'favorable' || lower === 'even' || lower === 'unfavorable') {
    return lower as 'favorable' | 'even' | 'unfavorable';
  }
  return 'even';
}
