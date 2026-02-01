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

const SYSTEM_PROMPT = `You are an expert Clash Royale deck analyst and coach. You have deep knowledge of:
- All deck archetypes (2.6 Hog Cycle, Log Bait, Golem Beatdown, Lavaloon, X-Bow, Mortar Bait, Bridge Spam, Miner Control, Graveyard, etc.)
- Current meta trends and win rates
- Card synergies and anti-synergies
- Optimal deck building principles
- How to identify and fix deck weaknesses

Your analysis should be practical and actionable, not generic. Focus on what makes this specific deck work or not work.`;

function buildAnalysisPrompt(cards: string[], elixirCosts: number[]): string {
  const avgElixir = elixirCosts.reduce((a, b) => a + b, 0) / elixirCosts.length;
  const cardList = cards.map((card, i) => `${card} (${elixirCosts[i]} elixir)`).join(', ');

  return `Analyze this Clash Royale deck:

Cards: ${cardList}
Average Elixir: ${avgElixir.toFixed(1)}

Provide your analysis in the following JSON format:
{
  "grade": "S/A/B/C/D/F based on competitive viability",
  "score": "0-100 numeric score",
  "archetype": "The deck archetype name (e.g., '2.6 Hog Cycle', 'Classic Log Bait', 'Golem Beatdown', 'Off-Meta Hybrid')",
  "archetypeDescription": "Brief explanation of what archetype this is and how it should be played",
  "strengths": ["Array of 2-4 specific strengths of this deck"],
  "weaknesses": ["Array of 2-4 specific weaknesses or vulnerabilities"],
  "swapRecommendations": [
    {
      "remove": "Card to remove",
      "add": "Card to add instead", 
      "reason": "Why this swap improves the deck"
    }
  ],
  "playstyleTips": ["Array of 2-3 tips on how to play this deck effectively"],
  "matchupNotes": "Brief note on what matchups this deck is strong/weak against"
}

Grading criteria:
- S: Meta-defining deck, 55%+ win rate potential, optimal synergies
- A: Strong competitive deck, 50-55% win rate, tournament viable
- B: Viable but has clear weaknesses, 48-50% win rate, requires skill
- C: Off-meta, below 48% win rate, struggles against top decks
- D: Significant issues, missing key components
- F: Fundamentally broken (no win condition, way too heavy, etc.)

Important guidelines:
1. If this is a known meta deck or close variant, recognize it and grade appropriately (don't penalize meta decks)
2. Swap recommendations should be specific and explain WHY (e.g., "Replace Wizard with Musketeer because Musketeer provides better value and synergizes with Hog cycle")
3. If the deck is already strong, you can have fewer or no swap recommendations
4. Consider card synergies - some "weak" cards work well in specific decks
5. Be honest but constructive - explain issues clearly but offer solutions

Return ONLY valid JSON, no other text.`;
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
