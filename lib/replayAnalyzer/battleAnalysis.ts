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

const SYSTEM_PROMPT = `You are a professional Clash Royale coach who reviews battles for competitive players. You analyze battles like a pro player would review their own replays.

BATTLE ANALYSIS FRAMEWORK:

1. MATCHUP IDENTIFICATION:
- Identify both deck archetypes precisely (not just "beatdown" — say "Golem Night Witch Beatdown" or "2.6 Hog Cycle")
- Determine inherent matchup favorability. Key matchup dynamics:
  * Beatdown (Golem/Lava) beats Siege (X-Bow/Mortar) — too much HP to break through
  * Siege beats Cycle (Hog/Miner) — X-Bow locks on tower, cycle can't break through
  * Cycle beats Beatdown — fast enough to punish slow pushes
  * Bridge Spam beats Control — too many threats from the bridge
  * Control beats Beatdown — buildings + high DPS shut down big pushes
  * Bait beats single-spell decks — can't Log Goblin Barrel AND Princess AND Goblin Gang

2. TOWER DAMAGE FORENSICS:
- If King Tower HP is low: opponent likely activated King Tower early (Tornado, Firecracker, etc.) or got spell cycled
- If one Princess Tower is destroyed but other is full HP: single-lane pressure was dominant. The player either defended one lane well or abandoned it
- If both Princess Towers are damaged: opponent applied dual-lane pressure effectively
- Tower HP difference = how close the game was. E.g., "Opponent's tower at 247 HP means one more Fireball would have won the game"
- Crown count + tower HP tells you if it was a blowout or a close game

3. ELIXIR & TEMPO ANALYSIS:
- Compare average elixir costs. The lighter deck should be cycling faster and punishing.
- Heavy deck (4.0+) vs light deck (2.8): heavy deck MUST build big pushes in double/triple elixir. If they lost, they probably leaked elixir or got punished in single elixir.
- If both decks are similar cost: the game was decided by card interactions and placement skill.

4. TROPHY RANGE CONTEXT:
- Below 5000: Players often overcommit, don't track opponent's card cycle, place troops at the bridge reactively
- 5000-6000: Players understand basic counters but leak elixir, poor spell timing
- 6000-7000: Matchup knowledge matters most. Players need to know their win condition timing.
- 7000+: Micro-placement (1 tile difference), prediction spells, and elixir counting separate players

5. KEY CARD INTERACTIONS TO ANALYZE:
- Did the player have a counter to the opponent's win condition? If not, that's the #1 issue.
- Did the player save their key defensive card (e.g., not using PEKKA on offense when opponent has Golem)?
- Spell value: Was their big spell used efficiently? (Fireball on Musketeer + Tower > Fireball on Skeletons)
- Did the player have Zap/Log for the opponent's bait cards?

Be brutally honest but constructive. Reference specific cards by name. Never give vague advice.`;

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

  return `Analyze this Clash Royale battle like a pro coach reviewing a replay:

BATTLE DATA:
Result: ${result} (${playerCrowns}-${opponentCrowns} crowns)
Mode: ${battle.gameMode?.name || 'Unknown'} | Arena: ${battle.arena?.name || 'Unknown'}
${trophyContext}

PLAYER'S DECK (${playerAvgElixir} avg elixir):
${playerCards}

OPPONENT'S DECK (${opponentAvgElixir} avg elixir):
${opponentCards}

TOWER DAMAGE AT END:${towerAnalysis || '\nNo tower HP data available'}

ANALYZE IN THIS ORDER:
1. Identify both deck archetypes precisely (e.g., "Pekka Bridge Spam" not just "bridge spam")
2. Determine matchup favorability based on known archetype matchups
3. Read the tower damage to reconstruct what likely happened:
   - Which lane was pressured? (check which princess towers took damage)
   - How close was the game? (tower HP remaining)
   - Was King Tower activated? (if King HP is lower than starting)
4. Identify the KEY INTERACTION that decided the game (e.g., "Player had no answer to Lava Hound + Balloon because their only air counter was Musketeer, which dies to opponent's Fireball")
5. Give advice calibrated to the trophy range

Return JSON:
{
  "summary": "2-3 sentences reconstructing the likely game flow from tower damage data. E.g., 'This was a close single-lane battle where the opponent's Hog Rider likely got repeated chip damage (princess tower at 1,200 HP). The player's Golem pushes in double elixir secured 2 crowns but left their own tower vulnerable to spell cycle.'",
  "outcome": "${result.toLowerCase()}",
  "keyFactors": [
    "2-4 factors referencing SPECIFIC CARDS. E.g., 'Opponent had Inferno Tower which hard-counters your Golem — you needed Lightning or Electro Wizard to reset it'"
  ],
  "whatWentWell": [
    "2-3 positives referencing card interactions. E.g., 'Your PEKKA was the perfect answer to their Golem pushes — it likely got positive elixir trades on defense'"
  ],
  "whatCouldImprove": [
    "2-3 SPECIFIC actionable tips. Not 'improve your defense' but 'Against Hog Rider, place your Cannon at (9,18) BEFORE the Hog crosses the bridge — reactive placements let Hog get 1-2 free hits'"
  ],
  "matchupAnalysis": {
    "playerDeckType": "Specific archetype name",
    "opponentDeckType": "Specific archetype name",
    "matchupFavorability": "favorable/even/unfavorable",
    "explanation": "WHY this matchup favors one side, referencing the rock-paper-scissors dynamics (beatdown > siege > cycle > beatdown, etc.) and specific card interactions"
  },
  "tacticalTips": [
    "3-4 tips specific to THIS matchup. E.g., 'Against their Log Bait, save your Log exclusively for Goblin Barrel. Use Zap or Ice Spirit for Princess. If you Log the Princess, they'll punish with naked Barrel for 1,000+ damage.'"
  ],
  "deckDoctorRecommendation": "Specific advice about their deck composition. E.g., 'Your deck lacks a big spell — adding Fireball for Wizard would let you answer their Musketeer + chip tower, which likely cost you this game.'"
}

CRITICAL RULES:
- Every point MUST reference specific card names from the actual decks above
- Tower HP forensics: Use remaining HP to infer what happened (low HP = close game or spell cycle, 0 = that tower fell)
- If the matchup was unfavorable, acknowledge it and explain how to play it (you can win unfavorable matchups with perfect play)
- Calibrate advice to the trophy range — don't tell a 4000-trophy player about micro-placement tile tricks

Return ONLY valid JSON.`;
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
