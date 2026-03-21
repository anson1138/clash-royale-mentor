import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCardInfo } from './cardDatabase';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export interface SwapRecommendation {
  remove: string;
  add: string;
  reason: string;
}

export interface LLMDeckAnalysis {
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  avgElixir: number;
  archetype: string;
  archetypeDescription: string;
  strengths: string[];
  weaknesses: string[];
  swapRecommendations: SwapRecommendation[];
  playstyleTips: string[];
  matchupNotes: string;
}

const SYSTEM_PROMPT = `You are a top-200 global Clash Royale coach and Grand Challenge specialist. You analyze decks the way a pro player would evaluate them before a $100K tournament.

CORE DECK BUILDING RULES YOU MUST EVALUATE:
1. Win condition check: Every deck MUST have at least one clear win condition (Hog Rider, Golem, Lava Hound, X-Bow, Mortar, Graveyard, Royal Giant, Giant, Goblin Barrel, Ram Rider, Balloon, Three Musketeers, Miner+wallbreakers, etc.)
2. Spell balance: Competitive decks run a big spell (Fireball, Poison, Lightning, Rocket) AND a small spell (Zap, Log, Snowball, Arrows). Missing either is a serious flaw.
3. Air defense: Must have at least 2 cards that target air (Musketeer, Electro Wizard, Inferno Dragon, Baby Dragon, Archers, etc.). No air defense = auto-loss vs Lavaloon/Balloon.
4. Tank killer: Need at least 1 high-DPS unit (Mini PEKKA, PEKKA, Inferno Tower, Inferno Dragon, Hunter) to handle tanks like Golem, Giant, Royal Giant.
5. Elixir curve: Cycle decks 2.6-3.2 avg, control 3.2-3.8, beatdown 3.8-4.5. Outside these ranges is usually problematic.
6. Card roles: Every card should serve a purpose. Redundant roles (e.g., two tank killers but no cycle card) hurt the deck.
7. Synergy chains: Cards should combo — e.g., Hog+Ice Golem (pig push), Golem+Night Witch (death damage spawns bats), Lava Hound+Balloon (Lavaloon), Miner+Poison (chip control).

KNOWN META DECKS TO RECOGNIZE (grade A or S if close match):
- 2.6 Hog Cycle: Hog, Musketeer, Ice Golem, Ice Spirit, Cannon, Fireball, Log, Skeletons
- Classic Log Bait: Goblin Barrel, Princess, Goblin Gang, Knight, Inferno Tower, Rocket, Log, Ice Spirit
- Golem Beatdown: Golem, Night Witch, Lumberjack, Baby Dragon, Mega Minion, Tornado, Lightning, Barb Barrel
- Lavaloon: Lava Hound, Balloon, Mega Minion, Tombstone, Fireball, Arrows, Minions, Guards
- PEKKA Bridge Spam: PEKKA, Bandit, Battle Ram, Electro Wizard, Royal Ghost, Poison, Zap, Minions
- X-Bow Cycle: X-Bow, Tesla, Archers, Ice Spirit, Skeletons, Fireball, Log, Knight
- Miner Control: Miner, Poison, Electro Wizard, Valkyrie, Inferno Tower, Log, Skeletons, Bats
- Royal Giant: Royal Giant, Fisherman, Mother Witch, Lightning, Log, Mega Minion, Guards, Goblin Cage

ANTI-SYNERGIES TO FLAG:
- Wizard + Executioner (redundant splash, both too expensive)
- Witch + Mother Witch (both fragile, poor DPS)
- Rage + no tank to rage behind
- Mirror in non-bait decks (usually a waste)
- Multiple 6+ elixir cards with no cycle cards (will be out-cycled)
- No building vs Hog/Ram/Royal Giant decks

Your analysis should sound like a coaching session, not a textbook. Be direct and specific.`;

function buildAnalysisPrompt(cards: string[], elixirCosts: number[]): string {
  const avgElixir = elixirCosts.reduce((a, b) => a + b, 0) / elixirCosts.length;
  const cardList = cards.map((card, i) => `${card} (${elixirCosts[i]} elixir)`).join(', ');

  return `Analyze this Clash Royale deck like a top-200 global player would:

Cards: ${cardList}
Average Elixir: ${avgElixir.toFixed(1)}

STEP 1 - ROLE AUDIT: Identify each card's role:
- Win condition(s): Which card(s) deal primary tower damage?
- Big spell: Which card handles medium troops + chip damage?
- Small spell: Which card handles swarms + reset?
- Tank killer: Which card stops Golem/Giant/PEKKA?
- Air defense: Which cards target air units?
- Cycle/support: Which cards enable rotations?
Flag any missing roles.

STEP 2 - SYNERGY CHECK: Identify key combos and anti-synergies between these specific cards.

STEP 3 - META MATCHUP SCAN: How does this deck perform vs the 5 most common ladder archetypes (Hog 2.6, Log Bait, Golem, Lavaloon, PEKKA BS)?

Return your analysis as JSON:
{
  "grade": "S/A/B/C/D/F",
  "score": 0-100,
  "archetype": "Closest archetype name or 'Off-Meta: [description]'",
  "archetypeDescription": "How this archetype wins games — the game plan in 2 sentences",
  "strengths": ["2-4 SPECIFIC strengths referencing actual cards, e.g., 'Musketeer + Ice Golem kite combo shuts down single-target tanks'"],
  "weaknesses": ["2-4 SPECIFIC weaknesses, e.g., 'No building means Hog Rider gets guaranteed hits every push'"],
  "swapRecommendations": [
    {
      "remove": "Card to remove",
      "add": "Better replacement",
      "reason": "Specific reason referencing card interactions, e.g., 'Wizard costs 5 elixir but dies to Fireball. Musketeer costs 4, survives Fireball, and enables faster Hog cycles'"
    }
  ],
  "playstyleTips": ["3-4 tips specific to THIS deck, e.g., 'In single elixir, defend and cycle Ice Golems. Save Hog + prediction Fireball for double elixir pushes'"],
  "matchupNotes": "2-3 sentences covering best and worst matchups with specific card interactions"
}

Grading:
- S: Proven meta deck or variant, optimal card roles filled, strong synergy chains, 55%+ GC win rate
- A: Tournament-viable, all core roles filled, minor optimization possible, 50-55%
- B: Ladder-viable but has a gap (missing big spell, weak to air, etc.), 48-50%
- C: Multiple gaps, relies on opponent mistakes, below 48%
- D: Missing win condition OR tank killer OR air defense — fundamental flaw
- F: No coherent strategy, 3+ missing roles, unplayable at competitive level

CRITICAL: Reference ACTUAL card names and interactions. Never give generic advice like "consider adding more defense." Instead say "Replace Wizard with Musketeer — she costs 1 less elixir, survives Fireball, and her 6-tile range outranges most threats."

Return ONLY valid JSON.`;
}

export async function analyzeDeckWithLLM(cardNames: string[]): Promise<LLMDeckAnalysis> {
  // Get card info and elixir costs
  const cardsWithInfo = cardNames.map(name => {
    const info = getCardInfo(name);
    return {
      name: info?.name || name,
      elixir: info?.elixir || 4, // default to 4 if unknown
    };
  });

  const displayNames = cardsWithInfo.map(c => c.name);
  const elixirCosts = cardsWithInfo.map(c => c.elixir);
  const avgElixir = elixirCosts.reduce((a, b) => a + b, 0) / elixirCosts.length;

  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const prompt = buildAnalysisPrompt(displayNames, elixirCosts);

  try {
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: prompt },
    ]);

    const responseText = result.response.text();
    const analysis = JSON.parse(responseText) as LLMDeckAnalysis;

    // Ensure avgElixir is set correctly
    analysis.avgElixir = Number(avgElixir.toFixed(2));

    // Validate and normalize the response
    return {
      grade: validateGrade(analysis.grade),
      score: Math.max(0, Math.min(100, Number(analysis.score) || 50)),
      avgElixir: analysis.avgElixir,
      archetype: analysis.archetype || 'Unknown Archetype',
      archetypeDescription: analysis.archetypeDescription || '',
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [],
      swapRecommendations: Array.isArray(analysis.swapRecommendations) 
        ? analysis.swapRecommendations.slice(0, 3) // Limit to 3 swaps
        : [],
      playstyleTips: Array.isArray(analysis.playstyleTips) ? analysis.playstyleTips : [],
      matchupNotes: analysis.matchupNotes || '',
    };
  } catch (error) {
    console.error('LLM analysis error:', error);
    throw new Error('Failed to analyze deck with AI. Please try again.');
  }
}

function validateGrade(grade: string): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
  const validGrades = ['S', 'A', 'B', 'C', 'D', 'F'];
  const upperGrade = (grade || 'C').toUpperCase();
  return validGrades.includes(upperGrade) 
    ? (upperGrade as 'S' | 'A' | 'B' | 'C' | 'D' | 'F')
    : 'C';
}
