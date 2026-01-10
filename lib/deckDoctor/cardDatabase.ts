import cardsData from '../../data/royaleapi/cards.json';
import characterStatsData from '../../data/cr-api-data/cards_stats_characters.json';
import buildingStatsData from '../../data/cr-api-data/cards_stats_building.json';

// Card roles and properties for deck analysis
export const CARD_ROLES = {
  WIN_CONDITION: 'win_condition',
  TANK: 'tank',
  TANK_KILLER: 'tank_killer',
  SPLASH: 'splash',
  AIR_DEFENSE: 'air_defense',
  BUILDING: 'building',
  SPELL_SMALL: 'spell_small',
  SPELL_BIG: 'spell_big',
  CYCLE: 'cycle',
  SWARM: 'swarm',
  CHAMPION: 'champion',
} as const;

export type CardTargets = 'ground' | 'air' | 'both';
export type CardType = 'troop' | 'spell' | 'building';

export interface CardInfo {
  name: string;
  elixir: number;
  roles: string[];
  targets?: CardTargets;
  type: CardType;
}

type CardsJsonCard = {
  key: string;
  name: string;
  elixir: number;
  type: CardType;
  rarity?: string;
};

type StatsEntry = {
  name: string;
  attacks_air?: boolean;
  attacks_ground?: boolean;
  target_only_buildings?: boolean;
  area_damage_radius?: number;
  multiple_targets?: number;
  all_targets_hit?: boolean;
  hitpoints?: number;
};

function normalizeForJoin(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '');
}

// Normalize for UI input & slugs ("The Log" -> "the-log")
export function normalizeCardName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function inferTargets(stats?: StatsEntry): CardTargets | undefined {
  if (!stats) return undefined;
  const air = !!stats.attacks_air;
  const ground = !!stats.attacks_ground;
  if (air && ground) return 'both';
  if (air) return 'air';
  if (ground) return 'ground';
  return undefined;
}

function inferSwarm(key: string, name: string, elixir: number): boolean {
  const k = normalizeCardName(key);
  const n = normalizeCardName(name);
  if (elixir > 5) return false;
  return (
    k.includes('gang') ||
    k.includes('horde') ||
    k.includes('army') ||
    k.includes('recruits') ||
    k.includes('bats') ||
    k.includes('skeletons') ||
    k.includes('goblins') ||
    k.includes('minions') ||
    n.includes('gang') ||
    n.includes('horde') ||
    n.includes('army') ||
    n.includes('recruits')
  );
}

const WIN_CONDITION_KEYS = new Set<string>([
  // Non-"target_only_buildings" win cons and edge cases
  'miner',
  'graveyard',
  'goblin-barrel',
  'x-bow',
  'mortar',
  // Some players use these as primary win cons / tower finishers
  'rocket',
]);

const TANK_KILLER_KEYS = new Set<string>([
  'pekka',
  'mini-pekka',
  'inferno-dragon',
  'inferno-tower',
  'hunter',
  'mighty-miner',
]);

const characterStatsByName = new Map<string, StatsEntry>();
for (const s of characterStatsData as unknown as StatsEntry[]) {
  if (s?.name) characterStatsByName.set(normalizeForJoin(s.name), s);
}

const buildingStatsByName = new Map<string, StatsEntry>();
for (const s of buildingStatsData as unknown as StatsEntry[]) {
  if (s?.name) buildingStatsByName.set(normalizeForJoin(s.name), s);
}

function statsFor(card: CardsJsonCard): StatsEntry | undefined {
  const key = normalizeForJoin(card.name);
  if (card.type === 'building') return buildingStatsByName.get(key);
  if (card.type === 'troop') return characterStatsByName.get(key);
  return undefined;
}

function buildCardInfo(card: CardsJsonCard): CardInfo {
  const stats = statsFor(card);
  const targets = inferTargets(stats);

  const roles: string[] = [];

  if (card.rarity === 'champion') roles.push(CARD_ROLES.CHAMPION);

  if (card.type === 'spell') {
    roles.push(card.elixir <= 3 ? CARD_ROLES.SPELL_SMALL : CARD_ROLES.SPELL_BIG);
    if (WIN_CONDITION_KEYS.has(card.key)) roles.push(CARD_ROLES.WIN_CONDITION);
  } else if (card.type === 'building') {
    roles.push(CARD_ROLES.BUILDING);
    if (WIN_CONDITION_KEYS.has(card.key)) roles.push(CARD_ROLES.WIN_CONDITION);
  } else {
    // troop
    if (stats?.target_only_buildings || WIN_CONDITION_KEYS.has(card.key)) {
      roles.push(CARD_ROLES.WIN_CONDITION);
    }
  }

  // General heuristics for rubric compatibility
  if (targets === 'air' || targets === 'both') roles.push(CARD_ROLES.AIR_DEFENSE);
  if (card.type === 'troop' && card.elixir <= 2) roles.push(CARD_ROLES.CYCLE);
  if (card.type === 'troop' && inferSwarm(card.key, card.name, card.elixir)) roles.push(CARD_ROLES.SWARM);
  if (stats && ((stats.area_damage_radius ?? 0) > 0 || (stats.multiple_targets ?? 0) > 0 || stats.all_targets_hit)) roles.push(CARD_ROLES.SPLASH);
  if (card.type === 'troop' && stats && (stats.hitpoints ?? 0) >= 1500 && card.elixir >= 5) roles.push(CARD_ROLES.TANK);
  if (card.type === 'troop' && TANK_KILLER_KEYS.has(card.key)) roles.push(CARD_ROLES.TANK_KILLER);

  // De-dupe roles while preserving order
  const dedupedRoles = Array.from(new Set(roles));

  return {
    name: card.name,
    elixir: card.elixir,
    roles: dedupedRoles,
    targets,
    type: card.type,
  };
}

// Full card database generated from RoyaleAPI cr-api-data JSON
export const CARDS: Record<string, CardInfo> = Object.fromEntries(
  (cardsData as unknown as CardsJsonCard[])
    .filter((c) => c && c.key && c.name && typeof c.elixir === 'number' && c.type)
    .map((c) => [c.key, buildCardInfo(c)])
);

// Lookup index: many user-entered variants -> canonical `key`
const CARD_KEY_BY_NORMALIZED: Record<string, string> = {};

function addIndex(normalized: string, key: string) {
  if (!normalized) return;
  CARD_KEY_BY_NORMALIZED[normalized] = key;
}

for (const [key, card] of Object.entries(CARDS)) {
  // canonical key
  addIndex(normalizeForJoin(key), key);
  addIndex(normalizeCardName(key), key);

  // display name
  addIndex(normalizeForJoin(card.name), key);
  addIndex(normalizeCardName(card.name), key);

  // key without hyphens (common in user input)
  addIndex(normalizeForJoin(key.replace(/-/g, ' ')), key);

  // Special-case common articles
  if (card.name.toLowerCase().startsWith('the ')) {
    addIndex(normalizeForJoin(card.name.slice(4)), key);
    addIndex(normalizeCardName(card.name.slice(4)), key);
  }
}

// Get card info by name or key (robust against punctuation like "P.E.K.K.A")
export function getCardInfo(name: string): CardInfo | null {
  const raw = (name ?? '').trim();
  if (!raw) return null;

  // Allow common user input for evolutions by mapping to base card ("Evolved Archers" -> "Archers")
  const evolvedStripped = raw.replace(/^evolved\s+/i, '').trim();

  // direct key match first (fast-path)
  const slug = normalizeCardName(raw);
  if (CARDS[slug]) return CARDS[slug];

  // join-normalized lookup (handles "P.E.K.K.A" -> "pekka")
  const joinNorm = normalizeForJoin(raw);
  const key =
    CARD_KEY_BY_NORMALIZED[joinNorm] ||
    CARD_KEY_BY_NORMALIZED[normalizeForJoin(slug)] ||
    (evolvedStripped !== raw ? CARD_KEY_BY_NORMALIZED[normalizeForJoin(evolvedStripped)] : undefined) ||
    (evolvedStripped !== raw ? CARD_KEY_BY_NORMALIZED[normalizeForJoin(normalizeCardName(evolvedStripped))] : undefined);
  return key ? CARDS[key] : null;
}
