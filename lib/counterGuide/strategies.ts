// Arena tile coordinates (simplified 18x32 grid)
// Origin (0,0) is top-left, x increases right, y increases down
export interface TilePosition {
  x: number;
  y: number;
}

export interface PlacementStep {
  position: TilePosition;
  card: string;
  description: string;
}

// Common placement positions
export const PLACEMENT_POSITIONS = {
  // Defensive positions
  CENTER_DEFENSE: { x: 9, y: 16 } as TilePosition,
  LEFT_KING_DEFENSE: { x: 4, y: 16 } as TilePosition,
  RIGHT_KING_DEFENSE: { x: 14, y: 16 } as TilePosition,
  
  // Anti-Hog/Ram placements
  ANTI_HOG_LEFT: { x: 6, y: 18 } as TilePosition,
  ANTI_HOG_RIGHT: { x: 12, y: 18 } as TilePosition,
  
  // Kiting positions
  KITE_LEFT: { x: 3, y: 17 } as TilePosition,
  KITE_RIGHT: { x: 15, y: 17 } as TilePosition,
  
  // Bridge spam
  BRIDGE_LEFT: { x: 4, y: 22 } as TilePosition,
  BRIDGE_RIGHT: { x: 14, y: 22 } as TilePosition,
};

// Counter strategies database
export interface CounterStrategy {
  targetCard: string;
  counterCards: {
    card: string;
    cost: number;
    effectiveness: 'excellent' | 'good' | 'fair';
    placement: PlacementStep[];
    notes: string;
  }[];
}

export const COUNTER_STRATEGIES: Record<string, CounterStrategy> = {
  'hog-rider': {
    targetCard: 'Hog Rider',
    counterCards: [
      {
        card: 'Cannon',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Cannon',
            description: 'Place Cannon 3-4 tiles from river in center to pull Hog into both towers',
          },
        ],
        notes: 'Cannon placement is critical. Too far forward and both towers won\'t target it.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight directly on top of Hog Rider as it crosses the bridge',
          },
        ],
        notes: 'Knight will tank hits and minimize tower damage. Works best against lone Hog.',
      },
    ],
  },
  'mega-knight': {
    targetCard: 'Mega Knight',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Knight',
            description: 'Place Knight in center to pull Mega Knight into both tower ranges',
          },
        ],
        notes: 'Never drop troops where MK is jumping. Let him land, THEN place Knight.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA in front of MK after he crosses bridge',
          },
        ],
        notes: 'Mini PEKKA shreds Mega Knight quickly. Keep away from other troops.',
      },
    ],
  },
  'balloon': {
    targetCard: 'Balloon',
    counterCards: [
      {
        card: 'Musketeer',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 8, y: 15 },
            card: 'Musketeer',
            description: 'Place Musketeer in center, slightly back from river',
          },
        ],
        notes: 'Musketeer will lock onto Balloon before it reaches tower. Survives death damage.',
      },
    ],
  },
};

export function getCounterStrategy(cardName: string): CounterStrategy | null {
  const normalized = cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return COUNTER_STRATEGIES[normalized] || null;
}
