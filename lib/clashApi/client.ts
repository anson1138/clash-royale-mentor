/**
 * Clash Royale API Client using RoyaleAPI Proxy
 * 
 * This client uses the RoyaleAPI proxy service which allows API access
 * without requiring a static IP address. The proxy is whitelisted with IP 45.79.218.79
 * 
 * @see https://docs.royaleapi.com/proxy.html
 */

const CLASH_API_TOKEN = process.env.CLASH_ROYALE_API_TOKEN;
const PROXY_BASE_URL = 'https://proxy.royaleapi.dev/v1';

export class ClashRoyaleAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'ClashRoyaleAPIError';
  }
}

/**
 * Clean and format a player tag for API requests
 */
export function formatPlayerTag(tag: string): string {
  // Remove # if present, convert to uppercase
  const cleanTag = tag.replace('#', '').toUpperCase();
  // Return with # prefix for API
  return `#${cleanTag}`;
}

/**
 * Encode player tag for URL
 */
export function encodePlayerTag(tag: string): string {
  const formattedTag = formatPlayerTag(tag);
  return encodeURIComponent(formattedTag);
}

/**
 * Make a request to the Clash Royale API via RoyaleAPI Proxy
 */
async function makeAPIRequest<T>(endpoint: string): Promise<T> {
  if (!CLASH_API_TOKEN) {
    throw new ClashRoyaleAPIError(
      'Clash Royale API token not configured. Please set CLASH_ROYALE_API_TOKEN in your .env file.'
    );
  }

  const url = `${PROXY_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${CLASH_API_TOKEN}`,
        Accept: 'application/json',
      },
      // Cache for 5 minutes to avoid rate limiting
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Clash API Error [${response.status}]:`,
        endpoint,
        errorText
      );
      
      throw new ClashRoyaleAPIError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ClashRoyaleAPIError) {
      throw error;
    }
    
    console.error('Clash API Network Error:', error);
    throw new ClashRoyaleAPIError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export interface PlayerData {
  tag: string;
  name: string;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  wins: number;
  losses: number;
  battleCount: number;
  threeCrownWins: number;
  challengeCardsWon: number;
  challengeMaxWins: number;
  tournamentCardsWon: number;
  tournamentBattleCount: number;
  role?: string;
  donations: number;
  donationsReceived: number;
  totalDonations: number;
  warDayWins: number;
  clanCardsCollected: number;
  clan?: {
    tag: string;
    name: string;
    badgeId: number;
  };
  arena: {
    id: number;
    name: string;
  };
  leagueStatistics?: {
    currentSeason: {
      rank?: number;
      trophies: number;
      bestTrophies: number;
    };
    previousSeason?: {
      id: string;
      rank?: number;
      trophies: number;
      bestTrophies: number;
    };
    bestSeason?: {
      id: string;
      rank?: number;
      trophies: number;
    };
  };
  badges: Array<{
    name: string;
    level: number;
    maxLevel: number;
    progress: number;
    target: number;
  }>;
  achievements: Array<{
    name: string;
    stars: number;
    value: number;
    target: number;
    info: string;
  }>;
  cards: Array<{
    name: string;
    id: number;
    level: number;
    maxLevel: number;
    count: number;
    iconUrls: {
      medium: string;
    };
  }>;
  currentDeck: Array<{
    name: string;
    id: number;
    level: number;
    maxLevel: number;
    iconUrls: {
      medium: string;
    };
  }>;
  currentFavouriteCard: {
    name: string;
    id: number;
    maxLevel: number;
    iconUrls: {
      medium: string;
    };
  };
}

export interface Battle {
  type: string;
  battleTime: string;
  isLadderTournament?: boolean;
  arena: {
    id: number;
    name: string;
  };
  gameMode: {
    id: number;
    name: string;
  };
  deckSelection?: string;
  team: Array<{
    tag: string;
    name: string;
    startingTrophies?: number;
    trophyChange?: number;
    crowns: number;
    kingTowerHitPoints?: number;
    princessTowersHitPoints?: number[];
    cards: Array<{
      name: string;
      id: number;
      level: number;
      maxLevel: number;
      iconUrls: {
        medium: string;
      };
    }>;
  }>;
  opponent: Array<{
    tag: string;
    name: string;
    startingTrophies?: number;
    trophyChange?: number;
    crowns: number;
    kingTowerHitPoints?: number;
    princessTowersHitPoints?: number[];
    cards: Array<{
      name: string;
      id: number;
      level: number;
      maxLevel: number;
      iconUrls: {
        medium: string;
      };
    }>;
  }>;
}

/**
 * Get player profile data
 */
export async function getPlayer(playerTag: string): Promise<PlayerData> {
  const encodedTag = encodePlayerTag(playerTag);
  return makeAPIRequest<PlayerData>(`/players/${encodedTag}`);
}

/**
 * Get player battle log (last 25 battles)
 */
export async function getPlayerBattles(playerTag: string): Promise<Battle[]> {
  const encodedTag = encodePlayerTag(playerTag);
  return makeAPIRequest<Battle[]>(`/players/${encodedTag}/battlelog`);
}

/**
 * Get upcoming chests for a player
 */
export async function getPlayerUpcomingChests(
  playerTag: string
): Promise<{ items: Array<{ index: number; name: string }> }> {
  const encodedTag = encodePlayerTag(playerTag);
  return makeAPIRequest(`/players/${encodedTag}/upcomingchests`);
}

/**
 * Get all available cards
 */
export async function getCards(): Promise<{ items: any[] }> {
  return makeAPIRequest('/cards');
}

/**
 * Check if the API is available and configured correctly
 */
export async function healthCheck(): Promise<boolean> {
  try {
    if (!CLASH_API_TOKEN) {
      return false;
    }
    
    // Try to fetch cards list as a health check
    await getCards();
    return true;
  } catch (error) {
    console.error('Clash API health check failed:', error);
    return false;
  }
}
