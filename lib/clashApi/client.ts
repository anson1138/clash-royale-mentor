// Clash Royale API Client
const API_BASE_URL = 'https://api.clashroyale.com/v1';

interface ClashRoyaleConfig {
  token: string;
  enabled: boolean;
}

export function getConfig(): ClashRoyaleConfig {
  const token = process.env.CLASH_ROYALE_API_TOKEN || '';
  const mode = process.env.CR_API_MODE || 'local_only';
  const isProd = process.env.NODE_ENV === 'production';
  
  return {
    token,
    enabled: mode !== 'local_only' || !isProd,
  };
}

export class ClashRoyaleAPI {
  private token: string;
  
  constructor(token: string) {
    this.token = token;
  }
  
  private async request(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`CR API Error: ${response.status} - ${error}`);
    }
    
    return response.json();
  }
  
  /**
   * Get player info by tag (tag should include #, e.g., "#ABC123")
   */
  async getPlayer(playerTag: string) {
    // Encode the # symbol
    const encodedTag = encodeURIComponent(playerTag);
    return this.request(`/players/${encodedTag}`);
  }
  
  /**
   * Get player's battle log (last 25 battles)
   */
  async getBattleLog(playerTag: string) {
    const encodedTag = encodeURIComponent(playerTag);
    return this.request(`/players/${encodedTag}/battlelog`);
  }
}

export function createClient() {
  const config = getConfig();
  
  if (!config.token) {
    throw new Error('CLASH_ROYALE_API_TOKEN environment variable is not set');
  }
  
  if (!config.enabled) {
    throw new Error('Clash Royale API is disabled in production. Set up a static-IP proxy first.');
  }
  
  return new ClashRoyaleAPI(config.token);
}
