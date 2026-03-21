import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export interface AICounterCard {
  card: string;
  cost: number;
  effectiveness: 'excellent' | 'good' | 'fair';
  placement: {
    position: { x: number; y: number };
    card: string;
    description: string;
  }[];
  notes: string;
}

export interface AICounterStrategy {
  targetCard: string;
  overview: string;
  counterCards: AICounterCard[];
  generalTips: string[];
}

const SYSTEM_PROMPT = `You are a top-200 global Clash Royale player who specializes in defensive play and counter strategies. You coach players to make POSITIVE ELIXIR TRADES on every defense.

KEY CLASH ROYALE MECHANICS YOU MUST CONSIDER:
- Aggro/targeting: Troops target the closest enemy. Buildings pull troops by being placed in their aggro range.
- Kiting: Placing a cheap troop (Ice Golem, Skeletons) on the opposite lane to pull troops across, wasting their time while both Princess Towers shoot them.
- Pulling: Buildings placed 4-3 tiles from the river in the center pull win conditions (Hog, Giant, Golem, Ram) to the center so BOTH Princess Towers + the building hit them.
- Reset mechanics: Zap, Electro Wizard, Electro Spirit, Lightning reset Inferno Tower/Dragon, Sparky charge, and Prince charge.
- Spawn damage: Some troops (Lumberjack death → Rage, Golem death → Golemites, Elixir Golem death → Blobs) have death effects to play around.
- Spell interactions: Know which troops survive Fireball, Lightning, Arrows, Log, etc. E.g., Musketeer survives Fireball, Wizard doesn't. Goblin Barrel goblins die to Zap at equal level.
- DPS vs HP tradeoffs: Mini PEKKA (high DPS, low HP) vs Knight (medium DPS, high HP). Choose counters based on what you need.
- Splash vs single-target: Splash (Baby Dragon, Valkyrie, Executioner) for swarms. Single-target DPS (Mini PEKKA, Hunter) for tanks.

ARENA COORDINATE SYSTEM:
- 18 tiles wide (x: 0-17), 32 tiles tall (y: 0-31)
- Origin (0,0) = top-left corner. y increases downward.
- YOUR side: y 16-31. OPPONENT side: y 0-15. River: y 15-16.
- Your King Tower: (9, 30). Princess Towers: (3.5, 28) and (14.5, 28)
- Opponent King: (9, 2). Opponent Princess: (3.5, 4) and (14.5, 4)

CRITICAL DEFENSIVE PLACEMENTS:
- "4-3 plant" (building to pull): x=9, y=18 — pulls Hog/Giant/Golem to center
- "Anti-Hog reactive" (building): x=7, y=18 (left lane) or x=11, y=18 (right lane) — Cannon/Tesla 1 tile off-center
- "King Tower activation": x=9, y=20 — pull troops like Magic Archer, Tornado to activate King
- "Kite to opposite lane": If troop is at x=4 (left lane), kite card at x=14, y=19 (right lane)
- "Same-lane DPS behind tower": x=9, y=24 — place ranged unit behind King to snipe safely
- "Surround": Place Skeleton Army or Guards directly on top of single-target troop to surround it

ELIXIR TRADE PHILOSOPHY:
- Always aim for +2 or more elixir advantage
- Skeletons (1 elixir) can counter Prince, Mini PEKKA with proper surround
- Ice Spirit (1 elixir) + Tower can counter Minion Horde, Goblin Barrel
- Tornado (3 elixir) + King activation = permanent value for the rest of the game`;

function buildCounterPrompt(cardName: string): string {
  return `How do I counter "${cardName}" in Clash Royale?

ANALYSIS STEPS:
1. What makes ${cardName} dangerous? (speed, damage type, HP, targeting, special mechanics)
2. What are its weaknesses? (slow speed, single-target, dies to spell X, etc.)
3. What 3 cards counter it best while giving a POSITIVE elixir trade?
4. Where EXACTLY on the arena grid do I place each counter?

Return JSON:
{
  "targetCard": "${cardName}",
  "overview": "Why ${cardName} is threatening + its key weakness to exploit. Reference specific stats like 'Hog Rider's fast speed (very fast) means you have ~1 second to react after it crosses the bridge' or 'Mega Knight's spawn damage deals 480 damage so never clump troops in a 2-tile radius'",
  "counterCards": [
    {
      "card": "Counter card name",
      "cost": "ACCURATE elixir cost (integer)",
      "effectiveness": "excellent/good/fair",
      "placement": [
        {
          "position": { "x": 9, "y": 18 },
          "card": "Counter card name",
          "description": "SPECIFIC instruction: WHEN to place (reactive? proactive? after it crosses bridge?), WHERE (reference tile position and why), WHAT HAPPENS (e.g., 'Cannon pulls Hog to center, both Princess Towers lock on, Hog gets 0 hits on tower')"
        }
      ],
      "notes": "Pro tip that separates 6000+ trophy players from everyone else. E.g., 'After defending Hog with Cannon, immediately place Ice Golem at the bridge to kite any support troops. The leftover Cannon + Ice Golem become a counter-push lane pressure.'"
    }
  ],
  "generalTips": [
    "3-4 tips that apply regardless of counter card chosen. Include: timing windows, spell interactions, what NOT to do (common mistakes), and how to convert defense into counter-push"
  ]
}

RULES:
- Elixir costs MUST be accurate (e.g., Skeletons=1, Ice Spirit=1, Log=2, Knight=3, Musketeer=4, PEKKA=7)
- Effectiveness = excellent only if it's a hard counter with +2 or more elixir trade
- Placements MUST use y: 16-31 (your side) with realistic x coordinates
- Every counter must explain the ELIXIR TRADE (e.g., "3-elixir Cannon fully counters 4-elixir Hog = +1 trade")
- Include at least one cheap/cycle counter option (1-3 elixir) if one exists
- Notes should teach ADVANCED technique, not basics

Return ONLY valid JSON.`;
}

export async function getAICounterStrategy(cardName: string): Promise<AICounterStrategy> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const prompt = buildCounterPrompt(cardName);

  try {
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: prompt },
    ]);

    const responseText = result.response.text();
    const strategy = JSON.parse(responseText) as AICounterStrategy;

    // Validate and normalize
    return {
      targetCard: strategy.targetCard || cardName,
      overview: strategy.overview || '',
      counterCards: Array.isArray(strategy.counterCards)
        ? strategy.counterCards.slice(0, 3).map(c => ({
            card: c.card || 'Unknown',
            cost: Math.max(1, Math.min(10, Number(c.cost) || 4)),
            effectiveness: validateEffectiveness(c.effectiveness),
            placement: Array.isArray(c.placement)
              ? c.placement.map(p => ({
                  position: {
                    x: Math.max(0, Math.min(17, Number(p.position?.x) || 9)),
                    y: Math.max(0, Math.min(31, Number(p.position?.y) || 17)),
                  },
                  card: p.card || c.card || 'Unknown',
                  description: p.description || '',
                }))
              : [],
            notes: c.notes || '',
          }))
        : [],
      generalTips: Array.isArray(strategy.generalTips) ? strategy.generalTips : [],
    };
  } catch (error) {
    console.error('AI counter guide error:', error);
    throw new Error('Failed to generate counter strategy with AI. Please try again.');
  }
}

function validateEffectiveness(eff: string): 'excellent' | 'good' | 'fair' {
  const valid = ['excellent', 'good', 'fair'];
  return valid.includes(eff) ? (eff as 'excellent' | 'good' | 'fair') : 'good';
}
