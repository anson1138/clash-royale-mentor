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

/**
 * Comprehensive counter strategies for all major Clash Royale cards
 * Updated January 2026 with latest meta strategies from top players
 */
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
        notes: 'Cannon placement is critical. Too far forward and both towers won\'t target it. Meta standard in 2026.',
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
        notes: 'Knight will tank hits and minimize tower damage. Works best against lone Hog. Positive trade.',
      },
      {
        card: 'Tesla',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Tesla',
            description: 'Place Tesla in center defensive position',
          },
        ],
        notes: 'Tesla fully counters Hog with no damage. Can retarget after. Very reliable.',
      },
      {
        card: 'Tombstone',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Tombstone',
            description: 'Place Tombstone centrally to distract Hog and spawn skeletons',
          },
        ],
        notes: 'Spawned skeletons chip Hog. May allow 1-2 hits. Good cycle option.',
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
        notes: 'Never drop troops where MK is jumping. Let him land, THEN place Knight. 4 elixir advantage.',
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
        notes: 'Mini PEKKA shreds Mega Knight quickly. Keep away from other troops. Best tank killer counter.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Valkyrie',
            description: 'Place Valkyrie in center to tank MK and splash support troops',
          },
        ],
        notes: 'Valkyrie handles MK and support units. Good value if opponent has swarm behind MK.',
      },
      {
        card: 'P.E.K.K.A',
        cost: 7,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'P.E.K.K.A',
            description: 'Place PEKKA centrally to tank and eliminate Mega Knight',
          },
        ],
        notes: 'Hard counter to MK. Even trade but PEKKA survives for counterpush. Meta pick 2026.',
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
        notes: 'Musketeer will lock onto Balloon before it reaches tower. Survives death damage. Standard counter.',
      },
      {
        card: 'Mega Minion',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Mega Minion',
            description: 'Place Mega Minion in center to intercept Balloon',
          },
        ],
        notes: 'Best positive elixir trade vs Balloon. Shreds it quickly. Meta staple.',
      },
      {
        card: 'Bats',
        cost: 2,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Bats',
            description: 'Place Bats to swarm Balloon',
          },
        ],
        notes: 'Great trade if unzapped. Risk: easily spelled. Use when opponent is low on elixir.',
      },
      {
        card: 'Inferno Dragon',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 15 },
            card: 'Inferno Dragon',
            description: 'Place Inferno Dragon to melt Balloon',
          },
        ],
        notes: 'Melts Balloon instantly. Watch for zap/ewiz. Strong in 2026 meta.',
      },
    ],
  },
  'golem': {
    targetCard: 'Golem',
    counterCards: [
      {
        card: 'Inferno Tower',
        cost: 5,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Inferno Tower',
            description: 'Place Inferno Tower centrally to melt Golem',
          },
        ],
        notes: 'Hard counter. Melts Golem and Golemites. Watch for Lightning/EQ. Best building counter.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to shred Golem',
          },
        ],
        notes: 'High DPS vs Golem. Good trade. Add spell for support units. Meta pick.',
      },
      {
        card: 'P.E.K.K.A',
        cost: 7,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'P.E.K.K.A',
            description: 'Place PEKKA to tank and destroy Golem',
          },
        ],
        notes: 'Even trade but PEKKA survives for massive counterpush. Pro strategy 2026.',
      },
    ],
  },
  'x-bow': {
    targetCard: 'X-Bow',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Knight',
            description: 'Place Knight on top of X-Bow to tank and destroy it',
          },
        ],
        notes: 'Knight tanks X-Bow shots while your tower destroys it. Classic counter.',
      },
      {
        card: 'Rocket',
        cost: 6,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 21 },
            card: 'Rocket',
            description: 'Rocket the X-Bow immediately',
          },
        ],
        notes: 'Full counter. Even trade. Prevents all damage. Meta in X-Bow matchups.',
      },
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 21 },
            card: 'Earthquake',
            description: 'Cast Earthquake on X-Bow and support troops',
          },
        ],
        notes: 'Doesn\'t one-shot but severely weakens. Great vs X-Bow cycle. 2026 tech.',
      },
    ],
  },
  'royal-giant': {
    targetCard: 'Royal Giant',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to rush down Royal Giant',
          },
        ],
        notes: 'High DPS shreds RG fast. Minimizes tower damage. Meta counter.',
      },
      {
        card: 'Inferno Dragon',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Inferno Dragon',
            description: 'Place Inferno Dragon to melt Royal Giant',
          },
        ],
        notes: 'Melts RG quickly. Watch for Fisherman/Zap. Strong in 2026.',
      },
      {
        card: 'Barbarians',
        cost: 5,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Barbarians',
            description: 'Surround Royal Giant with Barbarians',
          },
        ],
        notes: 'Shreds RG with swarm damage. Vulnerable to Fireball. Classic option.',
      },
    ],
  },
  'goblin-barrel': {
    targetCard: 'Goblin Barrel',
    counterCards: [
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 30 },
            card: 'The Log',
            description: 'Cast Log to eliminate all Goblins',
          },
        ],
        notes: 'Perfect counter. Positive trade. Instant elimination. Meta must-have.',
      },
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 30 },
            card: 'Zap',
            description: 'Zap the Goblins immediately',
          },
        ],
        notes: 'Kills underleveled barrels. May need tower help. Fast reaction required.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 30 },
            card: 'Arrows',
            description: 'Cast Arrows on Goblins',
          },
        ],
        notes: 'Kills Goblins at any level. Even trade. Reliable but slower than Log.',
      },
      {
        card: 'Barbarian Barrel',
        cost: 2,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 29 },
            card: 'Barbarian Barrel',
            description: 'Roll Barbarian Barrel to eliminate Goblins',
          },
        ],
        notes: 'Positive trade. Spawns Barbarian for counterpush. 2026 popular pick.',
      },
    ],
  },
  'graveyard': {
    targetCard: 'Graveyard',
    counterCards: [
      {
        card: 'Poison',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 30 },
            card: 'Poison',
            description: 'Cast Poison on Graveyard area',
          },
        ],
        notes: 'Best counter. Kills skeletons and support troops. Even trade. Pro meta.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 30 },
            card: 'Valkyrie',
            description: 'Place Valkyrie on tower to splash skeletons',
          },
        ],
        notes: 'Splash kills all skeletons. Survives for counterpush. Classic counter.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 30 },
            card: 'Arrows',
            description: 'Cast Arrows on Graveyard',
          },
        ],
        notes: 'Kills most skeletons. Some may get hits. Positive trade. Quick reaction.',
      },
    ],
  },
  'electro-giant': {
    targetCard: 'Electro Giant',
    counterCards: [
      {
        card: 'Inferno Dragon',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Inferno Dragon',
            description: 'Place Inferno Dragon away from E-Giant to avoid zaps',
          },
        ],
        notes: 'Melts E-Giant. Stay at range to avoid reflected zaps. Meta counter.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA with swarm support',
          },
        ],
        notes: 'High DPS but takes reflected damage. Combine with cheap swarm. Tricky.',
      },
      {
        card: 'Hunter',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 15 },
            card: 'Hunter',
            description: 'Place Hunter at range to maximize shotgun damage',
          },
        ],
        notes: 'Close-range shreds E-Giant. Distance is key. Pro strategy 2026.',
      },
    ],
  },
  'sparky': {
    targetCard: 'Sparky',
    counterCards: [
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Zap',
            description: 'Zap Sparky to reset charge',
          },
        ],
        notes: 'Resets Sparky charge. Buys time for DPS units. Classic counter.',
      },
      {
        card: 'Electro Wizard',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Electro Wizard',
            description: 'Drop E-Wiz on Sparky to stun and reset',
          },
        ],
        notes: 'Continuous stun locks Sparky. Hard counter. Meta staple vs Sparky.',
      },
      {
        card: 'Rocket',
        cost: 6,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Rocket',
            description: 'Rocket Sparky and support units',
          },
        ],
        notes: 'Full elimination. Even trade. Best vs Sparky push. Pro play.',
      },
      {
        card: 'Skeleton Army',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Skeleton Army',
            description: 'Surround Sparky with Skeleton Army',
          },
        ],
        notes: 'Swarms and kills Sparky. Vulnerable to Zap/Log. Bait first.',
      },
    ],
  },
  'lava-hound': {
    targetCard: 'Lava Hound',
    counterCards: [
      {
        card: 'Inferno Dragon',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Inferno Dragon',
            description: 'Place Inferno Dragon to melt Lava Hound',
          },
        ],
        notes: 'Melts hound fast. Watch for support troops. Meta counter 2026.',
      },
      {
        card: 'Wizard',
        cost: 5,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 15 },
            card: 'Wizard',
            description: 'Place Wizard to splash pups and support',
          },
        ],
        notes: 'Kills hound and splashes pups/support. Strong defensive anchor.',
      },
      {
        card: 'Executioner',
        cost: 5,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 15 },
            card: 'Executioner',
            description: 'Place Executioner for piercing damage',
          },
        ],
        notes: 'Piercing shots hit hound and support. Kills pups. Pro pick.',
      },
    ],
  },
  'prince': {
    targetCard: 'Prince',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to stop Prince charge',
          },
        ],
        notes: 'Tanks charge hit. Good value. Standard counter.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Skeletons',
            description: 'Place Skeletons to break Prince charge',
          },
        ],
        notes: 'Breaks charge for massive positive trade. Requires good timing. Meta tech.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to eliminate Prince',
          },
        ],
        notes: 'Shreds Prince. Even trade. Reliable.',
      },
    ],
  },
  'p-e-k-k-a': {
    targetCard: 'P.E.K.K.A',
    counterCards: [
      {
        card: 'Inferno Tower',
        cost: 5,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Inferno Tower',
            description: 'Place Inferno Tower to melt PEKKA',
          },
        ],
        notes: 'Hard counter. Melts PEKKA fast. Watch for Zap/EQ. Meta standard.',
      },
      {
        card: 'Skeleton Army',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Skeleton Army',
            description: 'Surround PEKKA with Skeleton Army',
          },
        ],
        notes: 'Swarms PEKKA. Vulnerable to splash support. Bait spells first.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to trade with PEKKA',
          },
        ],
        notes: 'High DPS vs PEKKA. Add support. Positive trade with help.',
      },
    ],
  },
  'witch': {
    targetCard: 'Witch',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Witch and skeletons',
          },
        ],
        notes: 'Kills Witch and spawns. Positive trade. Meta standard.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to splash Witch and skeletons',
          },
        ],
        notes: 'Splash kills skeletons and Witch. Even trade. Reliable.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Rush Witch with Mini PEKKA',
          },
        ],
        notes: 'Quickly eliminates Witch. Even trade. Tower helps.',
      },
    ],
  },
  'ram-rider': {
    targetCard: 'Ram Rider',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA on Ram Rider',
          },
        ],
        notes: 'Shreds Ram quickly. Minimizes damage. Even trade.',
      },
      {
        card: 'Cannon',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Cannon',
            description: 'Place Cannon to distract Ram Rider',
          },
        ],
        notes: 'Pulls Ram. May take 1-2 hits on tower. Positive trade.',
      },
      {
        card: 'Barbarians',
        cost: 5,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Barbarians',
            description: 'Surround Ram Rider with Barbarians',
          },
        ],
        notes: 'Swarm eliminates Ram fast. Vulnerable to Fireball.',
      },
    ],
  },
  'miner': {
    targetCard: 'Miner',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 30 },
            card: 'Knight',
            description: 'Place Knight on tower to intercept Miner',
          },
        ],
        notes: 'Tanks and kills Miner. Minimizes damage. Meta counter.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 30 },
            card: 'Skeletons',
            description: 'Place Skeletons to distract Miner',
          },
        ],
        notes: 'Positive trade. Some tower damage allowed. Fast cycle.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 30 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to eliminate Miner',
          },
        ],
        notes: 'Kills Miner and support troops. Even trade. Versatile.',
      },
    ],
  },
  'wall-breakers': {
    targetCard: 'Wall Breakers',
    counterCards: [
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'The Log',
            description: 'Log the Wall Breakers before they reach tower',
          },
        ],
        notes: 'Perfect counter. Even trade. Instant elimination.',
      },
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Zap',
            description: 'Zap Wall Breakers instantly',
          },
        ],
        notes: 'Kills Wall Breakers. Even trade. Fast reaction.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 19 },
            card: 'Skeletons',
            description: 'Place Skeletons to distract Wall Breakers',
          },
        ],
        notes: 'Positive trade. Timing critical. Meta tech.',
      },
    ],
  },
  'battle-ram': {
    targetCard: 'Battle Ram',
    counterCards: [
      {
        card: 'Cannon',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Cannon',
            description: 'Place Cannon to pull and destroy Battle Ram',
          },
        ],
        notes: 'Pulls Ram. Prevents tower damage. Positive trade.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA on Battle Ram',
          },
        ],
        notes: 'Shreds Ram fast. Minimal damage. Even trade.',
      },
      {
        card: 'Barbarians',
        cost: 5,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Barbarians',
            description: 'Surround Battle Ram',
          },
        ],
        notes: 'Stops Ram and Barbarians. Vulnerable to Fireball.',
      },
    ],
  },
  'skeleton-barrel': {
    targetCard: 'Skeleton Barrel',
    counterCards: [
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 25 },
            card: 'Arrows',
            description: 'Cast Arrows to eliminate barrel and skeletons',
          },
        ],
        notes: 'Kills barrel and all skeletons. Even trade. Reliable.',
      },
      {
        card: 'Mega Minion',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Mega Minion',
            description: 'Place Mega Minion to shoot down barrel',
          },
        ],
        notes: 'Shoots barrel. May need tower for skeletons. Even trade.',
      },
      {
        card: 'Bats',
        cost: 2,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Bats',
            description: 'Place Bats to swarm barrel',
          },
        ],
        notes: 'Positive trade. Vulnerable to spells. Timing key.',
      },
    ],
  },
  'elixir-golem': {
    targetCard: 'Elixir Golem',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to shred Elixir Golem',
          },
        ],
        notes: 'High DPS shreds all forms. Good trade. Standard counter.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Valkyrie',
            description: 'Place Valkyrie to splash all Golem forms',
          },
        ],
        notes: 'Splash kills golem and blobs. Good vs support. Meta pick.',
      },
      {
        card: 'Inferno Dragon',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Inferno Dragon',
            description: 'Place Inferno Dragon to melt Golem',
          },
        ],
        notes: 'Melts main form. Retargets to blobs. Even trade.',
      },
    ],
  },
  'giant-skeleton': {
    targetCard: 'Giant Skeleton',
    counterCards: [
      {
        card: 'Inferno Tower',
        cost: 5,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Inferno Tower',
            description: 'Place Inferno Tower to melt Giant Skeleton',
          },
        ],
        notes: 'Melts GS fast. Place away from tower to avoid bomb. Meta standard.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to kill Giant Skeleton',
          },
        ],
        notes: 'High DPS. Move away after kill to avoid bomb. Positive trade.',
      },
      {
        card: 'Barbarians',
        cost: 5,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Barbarians',
            description: 'Surround Giant Skeleton with Barbarians',
          },
        ],
        notes: 'Swarm kills GS. Some die to bomb. Even trade.',
      },
    ],
  },
  'fisherman': {
    targetCard: 'Fisherman',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to tank and kill Fisherman',
          },
        ],
        notes: 'Tanks hook. Kills Fisherman. Even trade.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to eliminate Fisherman',
          },
        ],
        notes: 'Kills Fisherman and support. Positive when hitting multiples.',
      },
    ],
  },
  'electro-wizard': {
    targetCard: 'Electro Wizard',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Electro Wizard',
          },
        ],
        notes: 'One-shot kill. Even trade. Meta standard.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to tank and kill E-Wiz',
          },
        ],
        notes: 'Tanks stuns. Kills E-Wiz. Positive trade.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to eliminate E-Wiz',
          },
        ],
        notes: 'Kills E-Wiz and support. Even trade.',
      },
    ],
  },
  'inferno-dragon': {
    targetCard: 'Inferno Dragon',
    counterCards: [
      {
        card: 'Bats',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Bats',
            description: 'Place Bats to swarm Inferno Dragon',
          },
        ],
        notes: 'Positive trade. Resets beam. Fast kill.',
      },
      {
        card: 'Mega Minion',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Mega Minion',
            description: 'Place Mega Minion to kill Inferno Dragon',
          },
        ],
        notes: 'Air vs air. Positive trade. Reliable.',
      },
      {
        card: 'Electro Wizard',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Electro Wizard',
            description: 'Drop E-Wiz to stun Inferno Dragon',
          },
        ],
        notes: 'Stun resets beam. Hard counter. Even trade.',
      },
    ],
  },
  'bowler': {
    targetCard: 'Bowler',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to rush Bowler',
          },
        ],
        notes: 'High DPS shreds Bowler. Positive trade.',
      },
      {
        card: 'Prince',
        cost: 5,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Prince',
            description: 'Charge Prince at Bowler',
          },
        ],
        notes: 'Charge damage kills Bowler fast. Even trade.',
      },
      {
        card: 'Lightning',
        cost: 6,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Lightning',
            description: 'Lightning the Bowler and support',
          },
        ],
        notes: 'Kills Bowler and other troops. Positive when hitting multiples.',
      },
    ],
  },
  'phoenix': {
    targetCard: 'Phoenix',
    counterCards: [
      {
        card: 'Electro Wizard',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Electro Wizard',
            description: 'Drop E-Wiz to stun Phoenix',
          },
        ],
        notes: 'Stun prevents rebirth ability. Hard counter. Even trade. 2026 meta tech.',
      },
      {
        card: 'Mega Minion',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Mega Minion',
            description: 'Place Mega Minion to kill Phoenix',
          },
        ],
        notes: 'Air vs air. Positive trade. Handles rebirth.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Arrows',
            description: 'Cast Arrows on Phoenix',
          },
        ],
        notes: 'Kills both forms. Even trade. Quick counter.',
      },
    ],
  },
  'archer-queen': {
    targetCard: 'Archer Queen',
    counterCards: [
      {
        card: 'Rocket',
        cost: 6,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Rocket',
            description: 'Rocket the Archer Queen',
          },
        ],
        notes: 'One-shot kill. Positive trade. Meta vs champions. 2026 standard.',
      },
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Archer Queen',
          },
        ],
        notes: 'Heavy damage. Tower finishes. Positive trade.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Rush Archer Queen with Mini PEKKA',
          },
        ],
        notes: 'High DPS eliminates AQ fast. Positive trade. Reliable.',
      },
    ],
  },
  'golden-knight': {
    targetCard: 'Golden Knight',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to counter Golden Knight',
          },
        ],
        notes: 'Even elixir trade. Tanks dashes. Positive value. Meta counter 2026.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to eliminate Golden Knight',
          },
        ],
        notes: 'High DPS shreds GK. Even trade.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to tank and kill Golden Knight',
          },
        ],
        notes: 'Tanks dashes. Kills GK. Even trade.',
      },
    ],
  },
  'skeleton-king': {
    targetCard: 'Skeleton King',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to shred Skeleton King',
          },
        ],
        notes: 'High DPS. Even trade. Handles ability skeletons with tower.',
      },
      {
        card: 'Inferno Tower',
        cost: 5,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Inferno Tower',
            description: 'Place Inferno Tower to melt Skeleton King',
          },
        ],
        notes: 'Melts SK fast. Positive trade. Meta standard.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to splash SK and skeletons',
          },
        ],
        notes: 'Splash kills ability skeletons. Even trade.',
      },
    ],
  },
  'monk': {
    targetCard: 'Monk',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to counter Monk',
          },
        ],
        notes: 'Tanks deflected projectiles. Positive trade. 2026 tech.',
      },
      {
        card: 'Skeleton Army',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Skeleton Army',
            description: 'Surround Monk with Skeleton Army',
          },
        ],
        notes: 'Swarms Monk. Can\'t deflect melee. Positive trade.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to eliminate Monk',
          },
        ],
        notes: 'High melee DPS. Even trade. Reliable.',
      },
    ],
  },
  'mighty-miner': {
    targetCard: 'Mighty Miner',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to tank and kill Mighty Miner',
          },
        ],
        notes: 'Tanks hits. Positive trade. Meta counter.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to eliminate Mighty Miner',
          },
        ],
        notes: 'Splash handles bombs. Even trade.',
      },
      {
        card: 'Skeleton Army',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Skeleton Army',
            description: 'Surround Mighty Miner',
          },
        ],
        notes: 'Swarm eliminates fast. Even trade. Watch for bombs.',
      },
    ],
  },
  'little-prince': {
    targetCard: 'Little Prince',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Little Prince and Guardian',
          },
        ],
        notes: 'Kills both forms. Positive trade. 2026 meta standard.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to rush Little Prince',
          },
        ],
        notes: 'High DPS eliminates both forms. Positive trade.',
      },
      {
        card: 'Mega Minion',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Mega Minion',
            description: 'Place Mega Minion to kill Little Prince',
          },
        ],
        notes: 'Air counters both forms. Positive trade. Reliable.',
      },
    ],
  },
  'wizard': {
    targetCard: 'Wizard',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Wizard',
          },
        ],
        notes: 'One-shot kill. Even trade. Meta standard for dealing with Wizard.',
      },
      {
        card: 'Lightning',
        cost: 6,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Lightning',
            description: 'Lightning the Wizard and support',
          },
        ],
        notes: 'Kills Wizard instantly. Positive when hitting multiple troops.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to tank and kill Wizard',
          },
        ],
        notes: 'Tanks splash damage. Positive trade. Tower helps finish.',
      },
    ],
  },
  'musketeer': {
    targetCard: 'Musketeer',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Musketeer',
          },
        ],
        notes: 'One-shot kill. Even trade. Standard counter.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to rush Musketeer',
          },
        ],
        notes: 'Positive trade. Tanks hits while closing distance.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Rush with Mini PEKKA',
          },
        ],
        notes: 'Quick elimination. Even trade.',
      },
    ],
  },
  'baby-dragon': {
    targetCard: 'Baby Dragon',
    counterCards: [
      {
        card: 'Mega Minion',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Mega Minion',
            description: 'Place Mega Minion to counter Baby Dragon',
          },
        ],
        notes: 'Air vs air. Positive trade. Reliable counter.',
      },
      {
        card: 'Musketeer',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 15 },
            card: 'Musketeer',
            description: 'Place Musketeer to shoot down Baby Dragon',
          },
        ],
        notes: 'Even trade. Good range. Survives for counterpush.',
      },
      {
        card: 'Bats',
        cost: 2,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Bats',
            description: 'Swarm Baby Dragon with Bats',
          },
        ],
        notes: 'Positive trade if unzapped. Fast elimination.',
      },
    ],
  },
  'giant': {
    targetCard: 'Giant',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to shred Giant',
          },
        ],
        notes: 'High DPS melts Giant. Positive trade. Meta standard.',
      },
      {
        card: 'Inferno Tower',
        cost: 5,
        effectiveness: 'excellent',
        placement: [
          {
            position: PLACEMENT_POSITIONS.CENTER_DEFENSE,
            card: 'Inferno Tower',
            description: 'Place Inferno Tower to melt Giant',
          },
        ],
        notes: 'Hard counter. Even trade. Watch for Lightning/EQ.',
      },
      {
        card: 'Barbarians',
        cost: 5,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Barbarians',
            description: 'Surround Giant with Barbarians',
          },
        ],
        notes: 'Swarm kills Giant. Even trade. Watch for splash support.',
      },
    ],
  },
  'elite-barbarians': {
    targetCard: 'Elite Barbarians',
    counterCards: [
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to splash both E-Barbs',
          },
        ],
        notes: 'Splash hits both. Positive trade. Hard counter.',
      },
      {
        card: 'Skeleton Army',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Skeleton Army',
            description: 'Surround E-Barbs with Skeleton Army',
          },
        ],
        notes: 'Swarm eliminates fast. Positive trade. Watch for Zap/Log.',
      },
      {
        card: 'Bowler',
        cost: 5,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Bowler',
            description: 'Place Bowler to knockback E-Barbs',
          },
        ],
        notes: 'Knockback and damage. Even trade. Good with tower.',
      },
    ],
  },
  'bandit': {
    targetCard: 'Bandit',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to stop Bandit dash',
          },
        ],
        notes: 'Stops dash. Even trade. Reliable counter.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Skeletons',
            description: 'Place Skeletons to distract Bandit',
          },
        ],
        notes: 'Positive trade. Breaks dash. Timing critical.',
      },
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'The Log',
            description: 'Log the Bandit',
          },
        ],
        notes: 'Positive trade. Stops dash. May take tower hit.',
      },
    ],
  },
  'dark-prince': {
    targetCard: 'Dark Prince',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to tank Dark Prince charge',
          },
        ],
        notes: 'Tanks charge. Even trade. Standard counter.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Place Mini PEKKA to shred Dark Prince',
          },
        ],
        notes: 'High DPS. Even trade. Quick elimination.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Skeletons',
            description: 'Use Skeletons to break shield',
          },
        ],
        notes: 'Breaks shield and charge. Positive trade with tower help.',
      },
    ],
  },
  'executioner': {
    targetCard: 'Executioner',
    counterCards: [
      {
        card: 'Lightning',
        cost: 6,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Lightning',
            description: 'Lightning the Executioner',
          },
        ],
        notes: 'One-shot kill. Positive trade when hitting multiple units.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Rush Executioner with Mini PEKKA',
          },
        ],
        notes: 'High DPS. Positive trade. Fast elimination.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Tank Executioner with Knight',
          },
        ],
        notes: 'Tanks axes. Positive trade with tower help.',
      },
    ],
  },
  'night-witch': {
    targetCard: 'Night Witch',
    counterCards: [
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to splash Night Witch and bats',
          },
        ],
        notes: 'Splash kills witch and bats. Even trade.',
      },
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball Night Witch and bats',
          },
        ],
        notes: 'Kills witch and bats. Even trade. Clean counter.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Arrows',
            description: 'Arrows to kill bats, tower helps with witch',
          },
        ],
        notes: 'Kills bats. Positive trade with tower on witch.',
      },
    ],
  },
  'hunter': {
    targetCard: 'Hunter',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Hunter',
          },
        ],
        notes: 'One-shot kill. Even trade. Standard counter.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Rush Hunter with Mini PEKKA',
          },
        ],
        notes: 'Close range eliminates Hunter. Even trade.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Tank Hunter shots with Knight',
          },
        ],
        notes: 'Tanks damage. Positive trade with tower.',
      },
    ],
  },
  'lumberjack': {
    targetCard: 'Lumberjack',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to counter Lumberjack',
          },
        ],
        notes: 'Tanks hits. Positive trade. Move away from rage.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to eliminate Lumberjack',
          },
        ],
        notes: 'Even trade. Handles support troops with splash.',
      },
      {
        card: 'Skeleton Army',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Skeleton Army',
            description: 'Swarm Lumberjack with Skeleton Army',
          },
        ],
        notes: 'Fast kill. Even trade. Watch for Log/Zap.',
      },
    ],
  },
  'magic-archer': {
    targetCard: 'Magic Archer',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Magic Archer',
          },
        ],
        notes: 'One-shot kill. Even trade. Prevents chip damage.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Rush Magic Archer with Knight',
          },
        ],
        notes: 'Positive trade. Fast kill with tower.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Arrows',
            description: 'Arrows the Magic Archer',
          },
        ],
        notes: 'Kills Magic Archer. Even trade.',
      },
    ],
  },
  'princess': {
    targetCard: 'Princess',
    counterCards: [
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 25 },
            card: 'The Log',
            description: 'Log the Princess',
          },
        ],
        notes: 'Perfect counter. Positive trade. Instant elimination.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 25 },
            card: 'Arrows',
            description: 'Cast Arrows on Princess',
          },
        ],
        notes: 'One-shot kill. Even trade. Reliable.',
      },
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 25 },
            card: 'Fireball',
            description: 'Fireball the Princess',
          },
        ],
        notes: 'Kills Princess. Negative trade unless hitting tower/troops.',
      },
    ],
  },
  'royal-hogs': {
    targetCard: 'Royal Hogs',
    counterCards: [
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to splash Royal Hogs',
          },
        ],
        notes: 'Splash hits all hogs. Positive trade. Meta counter.',
      },
      {
        card: 'Bowler',
        cost: 5,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Bowler',
            description: 'Place Bowler to knockback Royal Hogs',
          },
        ],
        notes: 'Knockback and splash. Even trade. Strong counter.',
      },
      {
        card: 'Barbarians',
        cost: 5,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Barbarians',
            description: 'Spread Barbarians to counter Royal Hogs',
          },
        ],
        notes: 'Swarm eliminates hogs. Even trade.',
      },
    ],
  },
  'royal-ghost': {
    targetCard: 'Royal Ghost',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Place Knight to counter Royal Ghost',
          },
        ],
        notes: 'Even trade. Reveals ghost. Standard counter.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to kill Royal Ghost',
          },
        ],
        notes: 'Negative trade but handles support units.',
      },
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'The Log',
            description: 'Log the Royal Ghost',
          },
        ],
        notes: 'Positive trade. Reveals and damages ghost.',
      },
    ],
  },
  'mother-witch': {
    targetCard: 'Mother Witch',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Mother Witch',
          },
        ],
        notes: 'One-shot kill. Even trade. Prevents pig transformation.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Rush Mother Witch with Mini PEKKA',
          },
        ],
        notes: 'Fast elimination. Even trade. Single unit counters well.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Tank with Knight',
          },
        ],
        notes: 'Positive trade. Avoid swarm units that turn to pigs.',
      },
    ],
  },
  'goblin-gang': {
    targetCard: 'Goblin Gang',
    counterCards: [
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'The Log',
            description: 'Log the Goblin Gang',
          },
        ],
        notes: 'Perfect counter. Positive trade. Eliminates all goblins.',
      },
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Zap',
            description: 'Zap Goblin Gang',
          },
        ],
        notes: 'Kills all goblins. Even trade. Fast reaction.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Arrows',
            description: 'Cast Arrows on Goblin Gang',
          },
        ],
        notes: 'Full elimination. Negative trade but reliable.',
      },
    ],
  },
  'minion-horde': {
    targetCard: 'Minion Horde',
    counterCards: [
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Arrows',
            description: 'Cast Arrows on Minion Horde',
          },
        ],
        notes: 'Perfect counter. Positive trade. Eliminates all minions.',
      },
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Fireball',
            description: 'Fireball the Minion Horde',
          },
        ],
        notes: 'Kills all minions. Positive trade. Reliable.',
      },
      {
        card: 'Wizard',
        cost: 5,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 15 },
            card: 'Wizard',
            description: 'Splash Minion Horde with Wizard',
          },
        ],
        notes: 'Splash eliminates horde. Even trade.',
      },
    ],
  },
  'minions': {
    targetCard: 'Minions',
    counterCards: [
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Arrows',
            description: 'Cast Arrows on Minions',
          },
        ],
        notes: 'Perfect counter. Even trade.',
      },
      {
        card: 'Mega Minion',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Mega Minion',
            description: 'Counter with Mega Minion',
          },
        ],
        notes: 'Air vs air. Even trade. Survives for counterpush.',
      },
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Zap',
            description: 'Zap the Minions',
          },
        ],
        notes: 'Kills underleveled. Positive trade with tower help.',
      },
    ],
  },
  'bats': {
    targetCard: 'Bats',
    counterCards: [
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Zap',
            description: 'Zap the Bats',
          },
        ],
        notes: 'Perfect counter. Even trade. Instant elimination.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Arrows',
            description: 'Cast Arrows on Bats',
          },
        ],
        notes: 'Kills all bats. Negative trade but reliable.',
      },
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'fair',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'The Log',
            description: 'Log when Bats land (doesn\'t hit air)',
          },
        ],
        notes: 'Only works if bats are targeting ground units. Situational.',
      },
    ],
  },
  'goblin-drill': {
    targetCard: 'Goblin Drill',
    counterCards: [
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 29 },
            card: 'Valkyrie',
            description: 'Place Valkyrie on drill location',
          },
        ],
        notes: 'Splash kills all goblins. Even trade. Best counter.',
      },
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 29 },
            card: 'The Log',
            description: 'Log the emerging Goblins',
          },
        ],
        notes: 'Kills goblins. Positive trade. Timing critical.',
      },
      {
        card: 'Bomber',
        cost: 2,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 28 },
            card: 'Bomber',
            description: 'Place Bomber to splash goblins',
          },
        ],
        notes: 'Splash eliminates goblins. Positive trade.',
      },
    ],
  },
  'skeleton-dragons': {
    targetCard: 'Skeleton Dragons',
    counterCards: [
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Arrows',
            description: 'Cast Arrows on Skeleton Dragons',
          },
        ],
        notes: 'Kills both dragons. Positive trade.',
      },
      {
        card: 'Mega Minion',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Mega Minion',
            description: 'Use Mega Minion to counter',
          },
        ],
        notes: 'Air vs air. Negative trade but survives.',
      },
      {
        card: 'Musketeer',
        cost: 4,
        effectiveness: 'fair',
        placement: [
          {
            position: { x: 9, y: 15 },
            card: 'Musketeer',
            description: 'Shoot down Skeleton Dragons',
          },
        ],
        notes: 'Kills dragons. Even trade.',
      },
    ],
  },
  'rascals': {
    targetCard: 'Rascals',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Rascals',
          },
        ],
        notes: 'Kills girls, damages boy. Positive trade with tower.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Splash Rascals with Valkyrie',
          },
        ],
        notes: 'Splash hits all. Positive trade. Strong counter.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Arrows',
            description: 'Cast Arrows to kill girls',
          },
        ],
        notes: 'Kills Rascal Girls. Positive trade with tower on boy.',
      },
    ],
  },
  'three-musketeers': {
    targetCard: 'Three Musketeers',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball all Three Musketeers',
          },
        ],
        notes: 'Massive positive trade if hitting all three. Best counter.',
      },
      {
        card: 'Lightning',
        cost: 6,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Lightning',
            description: 'Lightning the group',
          },
        ],
        notes: 'Kills all three. Positive trade. Hard counter.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Tank and splash with Valkyrie',
          },
        ],
        notes: 'Tanks damage while dealing splash. Massive positive trade.',
      },
    ],
  },
  'guards': {
    targetCard: 'Guards',
    counterCards: [
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'The Log',
            description: 'Log the Guards',
          },
        ],
        notes: 'Breaks shields and eliminates. Positive trade.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Splash Guards with Valkyrie',
          },
        ],
        notes: 'Splash breaks shields and kills. Negative trade.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'fair',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Arrows',
            description: 'Cast Arrows on Guards',
          },
        ],
        notes: 'Breaks shields. Tower finishes. Even trade.',
      },
    ],
  },
  'barbarians': {
    targetCard: 'Barbarians',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Barbarians',
          },
        ],
        notes: 'Heavy damage to all. Positive trade with tower help.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Valkyrie',
            description: 'Place Valkyrie to splash Barbarians',
          },
        ],
        notes: 'Splash kills all. Positive trade. Hard counter.',
      },
      {
        card: 'Bomber',
        cost: 2,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Bomber',
            description: 'Splash Barbarians with Bomber',
          },
        ],
        notes: 'Splash damage eliminates. Positive trade.',
      },
    ],
  },
  'archers': {
    targetCard: 'Archers',
    counterCards: [
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Arrows',
            description: 'Cast Arrows on Archers',
          },
        ],
        notes: 'Kills both archers. Even trade.',
      },
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'The Log',
            description: 'Log the Archers',
          },
        ],
        notes: 'Kills both. Positive trade.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Rush Archers with Knight',
          },
        ],
        notes: 'Tanks and kills. Even trade.',
      },
    ],
  },
  'firecracker': {
    targetCard: 'Firecracker',
    counterCards: [
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 25 },
            card: 'The Log',
            description: 'Log the Firecracker',
          },
        ],
        notes: 'Perfect counter. Positive trade. Instant kill.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 25 },
            card: 'Arrows',
            description: 'Cast Arrows on Firecracker',
          },
        ],
        notes: 'One-shot kill. Even trade.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Rush Firecracker with Knight',
          },
        ],
        notes: 'Fast elimination. Even trade.',
      },
    ],
  },
  'dart-goblin': {
    targetCard: 'Dart Goblin',
    counterCards: [
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 25 },
            card: 'The Log',
            description: 'Log the Dart Goblin',
          },
        ],
        notes: 'Perfect counter. Positive trade.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 25 },
            card: 'Arrows',
            description: 'Cast Arrows on Dart Goblin',
          },
        ],
        notes: 'One-shot kill. Even trade.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Rush with Knight',
          },
        ],
        notes: 'Fast kill. Even trade.',
      },
    ],
  },
  'ice-wizard': {
    targetCard: 'Ice Wizard',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Knight',
            description: 'Rush Ice Wizard with Knight',
          },
        ],
        notes: 'Tanks and kills. Even trade.',
      },
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 18 },
            card: 'Fireball',
            description: 'Fireball the Ice Wizard',
          },
        ],
        notes: 'Heavy damage. Tower finishes. Even trade.',
      },
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'fair',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Mini P.E.K.K.A',
            description: 'Rush with Mini PEKKA',
          },
        ],
        notes: 'Quick elimination. Negative trade.',
      },
    ],
  },
  'electro-dragon': {
    targetCard: 'Electro Dragon',
    counterCards: [
      {
        card: 'Musketeer',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 15 },
            card: 'Musketeer',
            description: 'Place Musketeer to shoot down Electro Dragon',
          },
        ],
        notes: 'Air counter. Positive trade. Survives stuns.',
      },
      {
        card: 'Mega Minion',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Mega Minion',
            description: 'Counter with Mega Minion',
          },
        ],
        notes: 'Air vs air. Positive trade. Fast elimination.',
      },
      {
        card: 'Bats',
        cost: 2,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 17 },
            card: 'Bats',
            description: 'Swarm with Bats',
          },
        ],
        notes: 'Positive trade if unzapped. Watch for chain lightning.',
      },
    ],
  },
  'flying-machine': {
    targetCard: 'Flying Machine',
    counterCards: [
      {
        card: 'Musketeer',
        cost: 4,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 15 },
            card: 'Musketeer',
            description: 'Place Musketeer to counter Flying Machine',
          },
        ],
        notes: 'Air counter. Even trade. Good range.',
      },
      {
        card: 'Mega Minion',
        cost: 3,
        effectiveness: 'excellent',
        placement: [
          {
            position: { x: 9, y: 16 },
            card: 'Mega Minion',
            description: 'Counter with Mega Minion',
          },
        ],
        notes: 'Air vs air. Positive trade.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [
          {
            position: { x: 9, y: 20 },
            card: 'Arrows',
            description: 'Cast Arrows on Flying Machine',
          },
        ],
        notes: 'One-shot kill. Positive trade.',
      },
    ],
  },
  // === Defensive/Utility Cards & Spells - Comprehensive Coverage ===
  'knight': {
    targetCard: 'Knight',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Mini P.E.K.K.A', description: 'Counter Knight with Mini PEKKA' }],
        notes: 'High DPS shreds Knight. Negative trade but wins.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 17 }, card: 'Valkyrie', description: 'Trade with Valkyrie' }],
        notes: 'Even matchup. Valkyrie usually wins with tower.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Skeletons', description: 'Distract with Skeletons' }],
        notes: 'Positive trade. Tower kills Knight while distracted.',
      },
    ],
  },
  'valkyrie': {
    targetCard: 'Valkyrie',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Mini P.E.K.K.A', description: 'Counter with Mini PEKKA' }],
        notes: 'High single-target DPS beats Valkyrie. Even trade.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Tank with Knight' }],
        notes: 'Knight tanks. Positive trade with tower help.',
      },
      {
        card: 'Barbarians',
        cost: 5,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Barbarians', description: 'Surround with Barbarians' }],
        notes: 'Swarm beats splash. Negative trade but effective.',
      },
    ],
  },
  'mini-p-e-k-k-a': {
    targetCard: 'Mini P.E.K.K.A',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Tank with Knight' }],
        notes: 'Knight tanks hits. Positive trade with tower.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 18 }, card: 'Skeletons', description: 'Surround with Skeletons' }],
        notes: 'Massive positive trade. Skeletons distract while tower kills.',
      },
      {
        card: 'Skeleton Army',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Skeleton Army', description: 'Swarm with Skarmy' }],
        notes: 'Swarm eliminates fast. Even trade if not spelled.',
      },
    ],
  },
  'mega-minion': {
    targetCard: 'Mega Minion',
    counterCards: [
      {
        card: 'Musketeer',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 15 }, card: 'Musketeer', description: 'Shoot down with Musketeer' }],
        notes: 'Outranges. Negative trade but survives.',
      },
      {
        card: 'Bats',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Bats', description: 'Swarm with Bats' }],
        notes: 'Positive trade. Fast elimination if unzapped.',
      },
      {
        card: 'Minions',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 16 }, card: 'Minions', description: 'Counter air with air' }],
        notes: 'Air vs air. Even trade.',
      },
    ],
  },
  'skeletons': {
    targetCard: 'Skeletons',
    counterCards: [
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'Zap', description: 'Zap the Skeletons' }],
        notes: 'Instant elimination. Negative trade but clean.',
      },
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'The Log', description: 'Log the Skeletons' }],
        notes: 'Perfect counter. Negative trade.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 20 }, card: 'Arrows', description: 'Arrow the Skeletons' }],
        notes: 'Overkill. Very negative trade.',
      },
    ],
  },
  'goblins': {
    targetCard: 'Goblins',
    counterCards: [
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'Zap', description: 'Zap the Goblins' }],
        notes: 'Perfect counter. Even trade.',
      },
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'The Log', description: 'Log the Goblins' }],
        notes: 'Instant elimination. Even trade.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Arrows', description: 'Cast Arrows' }],
        notes: 'Kills all. Negative trade.',
      },
    ],
  },
  'spear-goblins': {
    targetCard: 'Spear Goblins',
    counterCards: [
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'Zap', description: 'Zap the Spear Goblins' }],
        notes: 'Perfect counter. Even trade.',
      },
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'The Log', description: 'Log them' }],
        notes: 'Instant kill. Even trade.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 20 }, card: 'Arrows', description: 'Cast Arrows' }],
        notes: 'Overkill. Negative trade.',
      },
    ],
  },
  'ice-golem': {
    targetCard: 'Ice Golem',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Counter with Knight' }],
        notes: 'Negative trade but Knight survives.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 18 }, card: 'Skeletons', description: 'Distract with Skeletons' }],
        notes: 'Positive trade. Tower kills Ice Golem.',
      },
      {
        card: 'Goblins',
        cost: 2,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Goblins', description: 'Use Goblins' }],
        notes: 'Even trade. Fast kill.',
      },
    ],
  },
  'ice-spirit': {
    targetCard: 'Ice Spirit',
    counterCards: [
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 20 }, card: 'Zap', description: 'Zap the Ice Spirit' }],
        notes: 'Negative trade. Prevents freeze.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Skeletons', description: 'Distract with Skeletons' }],
        notes: 'Even trade. Absorbs freeze.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Tank with Knight' }],
        notes: 'Very negative trade.',
      },
    ],
  },
  'fire-spirit': {
    targetCard: 'Fire Spirit',
    counterCards: [
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 20 }, card: 'Zap', description: 'Zap the Fire Spirit' }],
        notes: 'Negative trade. Prevents damage.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 18 }, card: 'Skeletons', description: 'Use Skeletons to absorb' }],
        notes: 'Even trade. Absorbs splash.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Tank with Knight' }],
        notes: 'Negative trade. Tanks damage.',
      },
    ],
  },
  'electro-spirit': {
    targetCard: 'Electro Spirit',
    counterCards: [
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 20 }, card: 'Zap', description: 'Zap to kill' }],
        notes: 'Even trade. Prevents stun.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 18 }, card: 'Skeletons', description: 'Absorb with Skeletons' }],
        notes: 'Positive trade. Absorbs stun.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Tank with Knight' }],
        notes: 'Negative trade. Tanks stun.',
      },
    ],
  },
  'heal-spirit': {
    targetCard: 'Heal Spirit',
    counterCards: [
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 20 }, card: 'Zap', description: 'Zap to kill' }],
        notes: 'Negative trade. Prevents heal.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 18 }, card: 'Skeletons', description: 'Absorb with Skeletons' }],
        notes: 'Even trade. Minimal impact.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 20 }, card: 'Arrows', description: 'Arrow it' }],
        notes: 'Negative trade. Overkill.',
      },
    ],
  },
  'skeleton-army': {
    targetCard: 'Skeleton Army',
    counterCards: [
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'The Log', description: 'Log the army' }],
        notes: 'Perfect counter. Positive trade. Meta standard.',
      },
      {
        card: 'Zap',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'Zap', description: 'Zap the army' }],
        notes: 'Kills all. Positive trade.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Valkyrie', description: 'Splash with Valkyrie' }],
        notes: 'Splash eliminates. Negative trade but clean.',
      },
    ],
  },
  'bomber': {
    targetCard: 'Bomber',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Rush with Knight' }],
        notes: 'Fast kill. Negative trade but worth it.',
      },
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'The Log', description: 'Log the Bomber' }],
        notes: 'Instant kill. Even trade.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Arrows', description: 'Cast Arrows' }],
        notes: 'One-shot. Negative trade.',
      },
    ],
  },
  'berserker': {
    targetCard: 'Berserker',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Tank with Knight' }],
        notes: 'Knight wins. Negative trade.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Skeletons', description: 'Distract with Skeletons' }],
        notes: 'Positive trade. Tower helps.',
      },
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'fair',
        placement: [{ position: { x: 9, y: 20 }, card: 'The Log', description: 'Log it' }],
        notes: 'Even trade. Knockback helps.',
      },
    ],
  },
  'suspicious-bush': {
    targetCard: 'Suspicious Bush',
    counterCards: [
      {
        card: 'The Log',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'The Log', description: 'Log the bush' }],
        notes: 'Reveals and kills. Even trade.',
      },
      {
        card: 'Arrows',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Arrows', description: 'Arrow it' }],
        notes: 'Kills bush and spawns. Negative trade.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Skeletons', description: 'Distract with Skeletons' }],
        notes: 'Positive trade. Reveals bush.',
      },
    ],
  },
  'zappies': {
    targetCard: 'Zappies',
    counterCards: [
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 18 }, card: 'Fireball', description: 'Fireball the Zappies' }],
        notes: 'Kills all three. Even trade.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Valkyrie', description: 'Splash with Valkyrie' }],
        notes: 'Splash eliminates. Even trade.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Tank stuns with Knight' }],
        notes: 'Positive trade. Tower helps.',
      },
    ],
  },
  // === Buildings ===
  'cannon': {
    targetCard: 'Cannon',
    counterCards: [
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Earthquake', description: 'Earthquake the Cannon' }],
        notes: 'Destroys cannon. Even trade. 2026 meta pick.',
      },
      {
        card: 'Miner',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Miner', description: 'Mine the Cannon' }],
        notes: 'Direct building damage. Even trade.',
      },
      {
        card: 'Royal Giant',
        cost: 6,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Royal Giant', description: 'Outrange with RG' }],
        notes: 'Outranges cannon. Negative trade.',
      },
    ],
  },
  'tesla': {
    targetCard: 'Tesla',
    counterCards: [
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Earthquake', description: 'EQ the Tesla' }],
        notes: 'Major damage. Positive trade. Meta counter.',
      },
      {
        card: 'Lightning',
        cost: 6,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Lightning', description: 'Lightning the Tesla' }],
        notes: 'Destroys Tesla. Negative trade but clean.',
      },
      {
        card: 'Miner',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 16 }, card: 'Miner', description: 'Mine the Tesla' }],
        notes: 'Direct damage. Even trade.',
      },
    ],
  },
  'inferno-tower': {
    targetCard: 'Inferno Tower',
    counterCards: [
      {
        card: 'Lightning',
        cost: 6,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Lightning', description: 'Lightning the Inferno' }],
        notes: 'Destroys it. Positive trade. Meta standard.',
      },
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Earthquake', description: 'EQ the Inferno' }],
        notes: 'Major damage. Positive trade. 2026 tech.',
      },
      {
        card: 'Electro Wizard',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Electro Wizard', description: 'Stun with E-Wiz' }],
        notes: 'Resets beam. Positive trade.',
      },
    ],
  },
  'tombstone': {
    targetCard: 'Tombstone',
    counterCards: [
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Earthquake', description: 'EQ the Tombstone' }],
        notes: 'Destroys building. Even trade.',
      },
      {
        card: 'Miner',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Miner', description: 'Mine the Tombstone' }],
        notes: 'Direct damage. Even trade.',
      },
      {
        card: 'Poison',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 16 }, card: 'Poison', description: 'Poison the Tombstone' }],
        notes: 'Kills building and skeletons. Negative trade.',
      },
    ],
  },
  'bomb-tower': {
    targetCard: 'Bomb Tower',
    counterCards: [
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Earthquake', description: 'EQ Bomb Tower' }],
        notes: 'Heavy damage. Positive trade.',
      },
      {
        card: 'Lightning',
        cost: 6,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Lightning', description: 'Lightning it' }],
        notes: 'Destroys tower. Negative trade.',
      },
      {
        card: 'Miner',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 16 }, card: 'Miner', description: 'Mine it' }],
        notes: 'Direct damage. Positive trade.',
      },
    ],
  },
  'furnace': {
    targetCard: 'Furnace',
    counterCards: [
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Earthquake', description: 'EQ the Furnace' }],
        notes: 'Destroys it. Positive trade.',
      },
      {
        card: 'Miner',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Miner', description: 'Mine the Furnace' }],
        notes: 'Direct damage. Positive trade.',
      },
      {
        card: 'Poison',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 16 }, card: 'Poison', description: 'Poison it' }],
        notes: 'Destroys building and spirits. Negative trade.',
      },
    ],
  },
  'goblin-cage': {
    targetCard: 'Goblin Cage',
    counterCards: [
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Earthquake', description: 'EQ the cage' }],
        notes: 'Destroys building. Even trade.',
      },
      {
        card: 'Miner',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Miner', description: 'Mine the cage' }],
        notes: 'Direct damage. Even trade.',
      },
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 16 }, card: 'Fireball', description: 'Fireball it' }],
        notes: 'Heavy damage. Negative trade.',
      },
    ],
  },
  'goblin-hut': {
    targetCard: 'Goblin Hut',
    counterCards: [
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Earthquake', description: 'EQ the hut' }],
        notes: 'Destroys building. Positive trade.',
      },
      {
        card: 'Miner',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Miner', description: 'Mine the hut' }],
        notes: 'Direct damage. Positive trade.',
      },
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 16 }, card: 'Fireball', description: 'Fireball it' }],
        notes: 'Heavy damage. Negative trade.',
      },
    ],
  },
  'barbarian-hut': {
    targetCard: 'Barbarian Hut',
    counterCards: [
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Earthquake', description: 'EQ the hut' }],
        notes: 'Destroys building. Positive trade.',
      },
      {
        card: 'Lightning',
        cost: 6,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Lightning', description: 'Lightning the hut' }],
        notes: 'Destroys building. Even trade.',
      },
      {
        card: 'Miner',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 16 }, card: 'Miner', description: 'Mine the hut' }],
        notes: 'Direct damage. Positive trade.',
      },
    ],
  },
  'elixir-collector': {
    targetCard: 'Elixir Collector',
    counterCards: [
      {
        card: 'Miner',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Miner', description: 'Mine the collector' }],
        notes: 'Direct damage. Positive trade. Meta counter.',
      },
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Earthquake', description: 'EQ the collector' }],
        notes: 'Destroys it. Positive trade.',
      },
      {
        card: 'Rocket',
        cost: 6,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Rocket', description: 'Rocket the collector' }],
        notes: 'Destroys it. Even trade.',
      },
    ],
  },
  'mortar': {
    targetCard: 'Mortar',
    counterCards: [
      {
        card: 'Earthquake',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 21 }, card: 'Earthquake', description: 'EQ the Mortar' }],
        notes: 'Major damage. Positive trade. Meta counter.',
      },
      {
        card: 'Miner',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 21 }, card: 'Miner', description: 'Mine the Mortar' }],
        notes: 'Direct damage. Even trade.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 21 }, card: 'Knight', description: 'Tank with Knight' }],
        notes: 'Tanks shots. Even trade.',
      },
    ],
  },
  // === Spells (Counter-counterplay) ===
  'arrows': {
    targetCard: 'Arrows',
    counterCards: [
      {
        card: 'Bait with swarm',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'Goblin Gang', description: 'Bait Arrows with Goblin Gang' }],
        notes: 'Force Arrows usage. Then use real threat.',
      },
      {
        card: 'Spread units',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Minions', description: 'Spread units to minimize value' }],
        notes: 'Spread deployment reduces Arrows value.',
      },
      {
        card: 'Tank first',
        cost: 5,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Giant', description: 'Deploy tank before swarm' }],
        notes: 'Opponent forced to save spell or use it.',
      },
    ],
  },
  'zap': {
    targetCard: 'Zap',
    counterCards: [
      {
        card: 'Bait with Inferno',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: PLACEMENT_POSITIONS.CENTER_DEFENSE, card: 'Inferno Tower', description: 'Bait Zap' }],
        notes: 'Force Zap. Then use real reset target.',
      },
      {
        card: 'Spread units',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Skarmy', description: 'Spread swarm' }],
        notes: 'Spread deployment reduces Zap value.',
      },
      {
        card: 'Tank first',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Knight', description: 'Deploy tank first' }],
        notes: 'Forces spell usage or ignored.',
      },
    ],
  },
  'the-log': {
    targetCard: 'The Log',
    counterCards: [
      {
        card: 'Air units',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Minions', description: 'Use air units' }],
        notes: 'Log can\'t hit air. Perfect immunity.',
      },
      {
        card: 'Bait with swarm',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'Goblin Gang', description: 'Bait Log' }],
        notes: 'Force Log usage. Then barrel/swarm.',
      },
      {
        card: 'Jump units',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Battle Ram', description: 'Use charging units' }],
        notes: 'Some units jump over Log.',
      },
    ],
  },
  'fireball': {
    targetCard: 'Fireball',
    counterCards: [
      {
        card: 'Spread units',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: { x: 8, y: 15 }, card: 'Musketeer', description: 'Spread units apart' }],
        notes: 'Forces single-target Fireball for low value.',
      },
      {
        card: 'Bait with swarm',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Witch', description: 'Bait Fireball' }],
        notes: 'Force Fireball. Then deploy real threat.',
      },
      {
        card: 'Tank',
        cost: 5,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Giant', description: 'Use tanks' }],
        notes: 'Tanks survive Fireball.',
      },
    ],
  },
  'poison': {
    targetCard: 'Poison',
    counterCards: [
      {
        card: 'Move troops out',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 10 }, card: 'Musketeer', description: 'Deploy out of range' }],
        notes: 'Deploy ranged troops outside Poison radius.',
      },
      {
        card: 'Heal Spirit',
        cost: 1,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 15 }, card: 'Heal Spirit', description: 'Heal through Poison' }],
        notes: 'Heal mitigates Poison damage.',
      },
      {
        card: 'Fast cycle',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 15 }, card: 'Knight', description: 'Cycle quickly' }],
        notes: 'Overwhelm with fast deployment.',
      },
    ],
  },
  'rocket': {
    targetCard: 'Rocket',
    counterCards: [
      {
        card: 'Spread units',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: { x: 8, y: 15 }, card: 'Musketeer', description: 'Never group units' }],
        notes: 'Forces low-value Rocket or tower chip.',
      },
      {
        card: 'Fast pressure',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: PLACEMENT_POSITIONS.BRIDGE_LEFT, card: 'Hog Rider', description: 'Pressure opposite lane' }],
        notes: 'Force defensive Rocket usage.',
      },
      {
        card: 'Bait it',
        cost: 6,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'X-Bow', description: 'Bait Rocket' }],
        notes: 'Use building to bait Rocket.',
      },
    ],
  },
  'lightning': {
    targetCard: 'Lightning',
    counterCards: [
      {
        card: 'Spread units',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: { x: 8, y: 15 }, card: 'Wizard', description: 'Space units apart' }],
        notes: 'Prevents multi-hit Lightning value.',
      },
      {
        card: 'Low HP units',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 15 }, card: 'Minions', description: 'Use cheap units' }],
        notes: 'Lightning wastes elixir on cheap troops.',
      },
      {
        card: 'Bait first',
        cost: 5,
        effectiveness: 'good',
        placement: [{ position: PLACEMENT_POSITIONS.CENTER_DEFENSE, card: 'Inferno Tower', description: 'Bait Lightning' }],
        notes: 'Force Lightning. Then deploy real threat.',
      },
    ],
  },
  'earthquake': {
    targetCard: 'Earthquake',
    counterCards: [
      {
        card: 'Troops not buildings',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Mini P.E.K.K.A', description: 'Use troops for defense' }],
        notes: 'EQ less effective vs non-buildings.',
      },
      {
        card: 'Spread buildings',
        cost: 5,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 16 }, card: 'Inferno Tower', description: 'Don\'t cluster buildings' }],
        notes: 'Single-target EQ is fair trade.',
      },
      {
        card: 'Fast cycle',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 16 }, card: 'Cannon', description: 'Cycle buildings' }],
        notes: 'Replace building quickly.',
      },
    ],
  },
  'freeze': {
    targetCard: 'Freeze',
    counterCards: [
      {
        card: 'Spread units',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: { x: 8, y: 15 }, card: 'Musketeer', description: 'Space defenders' }],
        notes: 'Minimizes Freeze impact area.',
      },
      {
        card: 'Predict placement',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 29 }, card: 'Knight', description: 'Deploy after Freeze' }],
        notes: 'Deploy new units as Freeze ends.',
      },
      {
        card: 'Tower damage',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: PLACEMENT_POSITIONS.BRIDGE_RIGHT, card: 'Hog Rider', description: 'Pressure opposite' }],
        notes: 'Trade towers. Freeze used defensively.',
      },
    ],
  },
  'tornado': {
    targetCard: 'Tornado',
    counterCards: [
      {
        card: 'Spread units',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: { x: 8, y: 20 }, card: 'Royal Hogs', description: 'Split push' }],
        notes: 'Tornado can\'t pull split lanes.',
      },
      {
        card: 'Heavy units',
        cost: 7,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Golem', description: 'Use heavy tanks' }],
        notes: 'Heavy units less affected by pull.',
      },
      {
        card: 'Fast cycle',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Hog Rider', description: 'Quick attacks' }],
        notes: 'Overwhelm with speed.',
      },
    ],
  },
  'rage': {
    targetCard: 'Rage',
    counterCards: [
      {
        card: 'Defensive building',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: PLACEMENT_POSITIONS.CENTER_DEFENSE, card: 'Cannon', description: 'Use buildings to kite' }],
        notes: 'Buildings pull troops away from Rage.',
      },
      {
        card: 'Hard counter',
        cost: 5,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'P.E.K.K.A', description: 'Use hard counters' }],
        notes: 'Rage doesn\'t overcome hard counters.',
      },
      {
        card: 'Reset',
        cost: 2,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Zap', description: 'Reset targets' }],
        notes: 'Reset attack speed advantage.',
      },
    ],
  },
  'barbarian-barrel': {
    targetCard: 'Barbarian Barrel',
    counterCards: [
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 29 }, card: 'Knight', description: 'Counter Barbarian with Knight' }],
        notes: 'Knight kills Barbarian. Negative trade.',
      },
      {
        card: 'Skeletons',
        cost: 1,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 29 }, card: 'Skeletons', description: 'Distract Barbarian' }],
        notes: 'Positive trade. Tower kills Barbarian.',
      },
      {
        card: 'Air units',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 25 }, card: 'Minions', description: 'Use air troops' }],
        notes: 'Immune to barrel knockback.',
      },
    ],
  },
  'royal-delivery': {
    targetCard: 'Royal Delivery',
    counterCards: [
      {
        card: 'Air units',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'Minions', description: 'Use air units' }],
        notes: 'Immune to Royal Delivery.',
      },
      {
        card: 'Spread units',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 8, y: 17 }, card: 'Archers', description: 'Space units' }],
        notes: 'Minimizes knockback impact.',
      },
      {
        card: 'Tank',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Use tanky units' }],
        notes: 'Survives and kills Royal Recruit.',
      },
    ],
  },
  'goblin-curse': {
    targetCard: 'Goblin Curse',
    counterCards: [
      {
        card: 'Spell',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'Zap', description: 'Zap cursed goblins' }],
        notes: 'Eliminates goblins. Even trade.',
      },
      {
        card: 'Splash',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Valkyrie', description: 'Splash the goblins' }],
        notes: 'Kills all goblins. Negative trade.',
      },
      {
        card: 'Fast clear',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Quick elimination' }],
        notes: 'Clears goblins fast.',
      },
    ],
  },
  'vines': {
    targetCard: 'Vines',
    counterCards: [
      {
        card: 'Air units',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'Minions', description: 'Use air troops' }],
        notes: 'Unaffected by Vines slow.',
      },
      {
        card: 'Spell clear',
        cost: 2,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Zap', description: 'Zap the Vines' }],
        notes: 'Clears Vines. Even trade.',
      },
      {
        card: 'Fast units',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Hog Rider', description: 'Speed through' }],
        notes: 'Fast units less affected.',
      },
    ],
  },
  'void': {
    targetCard: 'Void',
    counterCards: [
      {
        card: 'Spread units',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: { x: 8, y: 20 }, card: 'Royal Hogs', description: 'Deploy spread out' }],
        notes: 'Void can\'t affect all units.',
      },
      {
        card: 'Air troops',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Minions', description: 'Use air units' }],
        notes: 'Less affected by Void.',
      },
      {
        card: 'Fast cycle',
        cost: 1,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Skeletons', description: 'Cycle quickly' }],
        notes: 'Deploy new units constantly.',
      },
    ],
  },
  'giant-snowball': {
    targetCard: 'Giant Snowball',
    counterCards: [
      {
        card: 'Air units',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 20 }, card: 'Minions', description: 'Use air troops' }],
        notes: 'Less knockback on air.',
      },
      {
        card: 'Heavy units',
        cost: 5,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 20 }, card: 'Giant', description: 'Use tanks' }],
        notes: 'Tanks resist knockback.',
      },
      {
        card: 'Bait it',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Goblin Gang', description: 'Bait Snowball' }],
        notes: 'Force usage. Deploy real threat.',
      },
    ],
  },
  'spirit-empress': {
    targetCard: 'Spirit Empress',
    counterCards: [
      {
        card: 'Spread units',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: { x: 8, y: 17 }, card: 'Musketeer', description: 'Space defenders' }],
        notes: 'Minimizes spirit impact.',
      },
      {
        card: 'Tank',
        cost: 5,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Giant', description: 'Absorb spirits with tank' }],
        notes: 'Tank absorbs spirit damage.',
      },
      {
        card: 'Spell',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Fireball', description: 'Fireball the push' }],
        notes: 'Clears spirits and damage.',
      },
    ],
  },
  // === Champions & Special Units ===
  'goblinstein': {
    targetCard: 'Goblinstein',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Mini P.E.K.K.A', description: 'Shred with Mini PEKKA' }],
        notes: 'High DPS. Positive trade. Fast elimination.',
      },
      {
        card: 'Inferno Tower',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: PLACEMENT_POSITIONS.CENTER_DEFENSE, card: 'Inferno Tower', description: 'Melt with Inferno' }],
        notes: 'Melts Goblinstein. Even trade.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Valkyrie', description: 'Splash counter' }],
        notes: 'Handles Goblinstein and spawns. Positive trade.',
      },
    ],
  },
  'boss-bandit': {
    targetCard: 'Boss Bandit',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Mini P.E.K.K.A', description: 'Counter with Mini PEKKA' }],
        notes: 'High DPS. Positive trade. Stops dashes.',
      },
      {
        card: 'Inferno Tower',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: PLACEMENT_POSITIONS.CENTER_DEFENSE, card: 'Inferno Tower', description: 'Melt Boss Bandit' }],
        notes: 'Melts fast. Positive trade.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Tank with Knight' }],
        notes: 'Tanks dashes. Positive trade with tower.',
      },
    ],
  },
  'battle-healer': {
    targetCard: 'Battle Healer',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Mini P.E.K.K.A', description: 'Burst down with Mini PEKKA' }],
        notes: 'High burst beats healing. Even trade.',
      },
      {
        card: 'Inferno Dragon',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Inferno Dragon', description: 'Melt with Inferno Dragon' }],
        notes: 'Beam overpowers healing. Even trade.',
      },
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Fireball', description: 'Fireball the Healer' }],
        notes: 'Heavy damage. Tower finishes. Even trade.',
      },
    ],
  },
  'goblin-machine': {
    targetCard: 'Goblin Machine',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Mini P.E.K.K.A', description: 'Shred with Mini PEKKA' }],
        notes: 'High DPS. Positive trade.',
      },
      {
        card: 'Inferno Tower',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: PLACEMENT_POSITIONS.CENTER_DEFENSE, card: 'Inferno Tower', description: 'Melt it' }],
        notes: 'Hard counter. Even trade.',
      },
      {
        card: 'Barbarians',
        cost: 5,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Barbarians', description: 'Swarm with Barbs' }],
        notes: 'Swarm eliminates. Even trade.',
      },
    ],
  },
  'goblin-demolisher': {
    targetCard: 'Goblin Demolisher',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Mini P.E.K.K.A', description: 'Counter with Mini PEKKA' }],
        notes: 'High DPS. Even trade.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Tank with Knight' }],
        notes: 'Positive trade. Tower helps.',
      },
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Valkyrie', description: 'Counter with Valkyrie' }],
        notes: 'Even trade. Splash handles support.',
      },
    ],
  },
  'goblin-giant': {
    targetCard: 'Goblin Giant',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: PLACEMENT_POSITIONS.CENTER_DEFENSE, card: 'Mini P.E.K.K.A', description: 'Shred with Mini PEKKA' }],
        notes: 'High DPS. Positive trade.',
      },
      {
        card: 'Inferno Tower',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: PLACEMENT_POSITIONS.CENTER_DEFENSE, card: 'Inferno Tower', description: 'Melt Goblin Giant' }],
        notes: 'Hard counter. Positive trade.',
      },
      {
        card: 'Barbarians',
        cost: 5,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Barbarians', description: 'Swarm it' }],
        notes: 'Swarm shreds giant. Positive trade.',
      },
    ],
  },
  'cannon-cart': {
    targetCard: 'Cannon Cart',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Mini P.E.K.K.A', description: 'Rush with Mini PEKKA' }],
        notes: 'High DPS both forms. Positive trade.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Tank with Knight' }],
        notes: 'Tanks both forms. Positive trade.',
      },
      {
        card: 'Barbarians',
        cost: 5,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Barbarians', description: 'Swarm it' }],
        notes: 'Swarm eliminates. Even trade.',
      },
    ],
  },
  'royal-recruits': {
    targetCard: 'Royal Recruits',
    counterCards: [
      {
        card: 'Valkyrie',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Valkyrie', description: 'Splash with Valkyrie' }],
        notes: 'Splash hits all. Positive trade. Best counter.',
      },
      {
        card: 'Bomber',
        cost: 2,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 16 }, card: 'Bomber', description: 'Splash with Bomber' }],
        notes: 'Massive positive trade. Splash eliminates.',
      },
      {
        card: 'Fireball',
        cost: 4,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 18 }, card: 'Fireball', description: 'Fireball the group' }],
        notes: 'Heavy damage to all. Positive trade.',
      },
    ],
  },
  'rune-giant': {
    targetCard: 'Rune Giant',
    counterCards: [
      {
        card: 'Mini P.E.K.K.A',
        cost: 4,
        effectiveness: 'excellent',
        placement: [{ position: { x: 9, y: 17 }, card: 'Mini P.E.K.K.A', description: 'Counter with Mini PEKKA' }],
        notes: 'High DPS. Even trade. Fast elimination.',
      },
      {
        card: 'Inferno Tower',
        cost: 5,
        effectiveness: 'excellent',
        placement: [{ position: PLACEMENT_POSITIONS.CENTER_DEFENSE, card: 'Inferno Tower', description: 'Melt Rune Giant' }],
        notes: 'Melts fast. Negative trade.',
      },
      {
        card: 'Knight',
        cost: 3,
        effectiveness: 'good',
        placement: [{ position: { x: 9, y: 17 }, card: 'Knight', description: 'Tank with Knight' }],
        notes: 'Positive trade with tower help.',
      },
    ],
  },
};

export function getCounterStrategy(cardName: string): CounterStrategy | null {
  const normalized = cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return COUNTER_STRATEGIES[normalized] || null;
}

export function getAllCounterCards(): string[] {
  return Object.keys(COUNTER_STRATEGIES);
}
