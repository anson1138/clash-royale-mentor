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

// Simplified card database (expand this with all cards)
export const CARDS: Record<string, {
  name: string;
  elixir: number;
  roles: string[];
  targets?: 'ground' | 'air' | 'both';
  type: 'troop' | 'spell' | 'building';
}> = {
  'hog-rider': {
    name: 'Hog Rider',
    elixir: 4,
    roles: [CARD_ROLES.WIN_CONDITION],
    targets: 'ground',
    type: 'troop',
  },
  'mega-knight': {
    name: 'Mega Knight',
    elixir: 7,
    roles: [CARD_ROLES.TANK, CARD_ROLES.SPLASH],
    targets: 'ground',
    type: 'troop',
  },
  'pekka': {
    name: 'P.E.K.K.A',
    elixir: 7,
    roles: [CARD_ROLES.TANK_KILLER],
    targets: 'ground',
    type: 'troop',
  },
  'musketeer': {
    name: 'Musketeer',
    elixir: 4,
    roles: [CARD_ROLES.AIR_DEFENSE],
    targets: 'both',
    type: 'troop',
  },
  'wizard': {
    name: 'Wizard',
    elixir: 5,
    roles: [CARD_ROLES.SPLASH, CARD_ROLES.AIR_DEFENSE],
    targets: 'both',
    type: 'troop',
  },
  'zap': {
    name: 'Zap',
    elixir: 2,
    roles: [CARD_ROLES.SPELL_SMALL],
    type: 'spell',
  },
  'fireball': {
    name: 'Fireball',
    elixir: 4,
    roles: [CARD_ROLES.SPELL_BIG],
    type: 'spell',
  },
  'cannon': {
    name: 'Cannon',
    elixir: 3,
    roles: [CARD_ROLES.BUILDING],
    targets: 'ground',
    type: 'building',
  },
  'valkyrie': {
    name: 'Valkyrie',
    elixir: 4,
    roles: [CARD_ROLES.SPLASH],
    targets: 'ground',
    type: 'troop',
  },
  'skeleton-army': {
    name: 'Skeleton Army',
    elixir: 3,
    roles: [CARD_ROLES.SWARM],
    targets: 'ground',
    type: 'troop',
  },
  'knight': {
    name: 'Knight',
    elixir: 3,
    roles: [CARD_ROLES.TANK, CARD_ROLES.CYCLE],
    targets: 'ground',
    type: 'troop',
  },
  'ice-spirit': {
    name: 'Ice Spirit',
    elixir: 1,
    roles: [CARD_ROLES.CYCLE],
    targets: 'both',
    type: 'troop',
  },
  'mini-pekka': {
    name: 'Mini P.E.K.K.A',
    elixir: 4,
    roles: [CARD_ROLES.TANK_KILLER],
    targets: 'ground',
    type: 'troop',
  },
  'balloon': {
    name: 'Balloon',
    elixir: 5,
    roles: [CARD_ROLES.WIN_CONDITION],
    targets: 'ground',
    type: 'troop',
  },
  'goblin-barrel': {
    name: 'Goblin Barrel',
    elixir: 3,
    roles: [CARD_ROLES.WIN_CONDITION, CARD_ROLES.SWARM],
    targets: 'ground',
    type: 'spell',
  },
};

// Normalize card names (handle variations)
export function normalizeCardName(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Get card info by name
export function getCardInfo(name: string) {
  const normalized = normalizeCardName(name);
  return CARDS[normalized] || null;
}
