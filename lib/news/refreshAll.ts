import { fetchSupercellNews } from './supercellFetcher';
import { fetchRedditNews } from './redditFetcher';
import { fetchYouTubeNews } from './youtubeFetcher';
import { fetchTwitterNews } from './twitterFetcher';
import { NormalizedNewsItem } from './types';

const SOURCE_NAMES = ['supercell', 'reddit', 'youtube', 'twitter'] as const;

// In-memory cache with timestamp
let cachedNews: NormalizedNewsItem[] = [];
let cacheTime = 0;
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function fetchAllNews(): Promise<{
  news: NormalizedNewsItem[];
  errors: string[];
  fromCache: boolean;
}> {
  // Return cache if fresh
  if (cachedNews.length > 0 && Date.now() - cacheTime < CACHE_TTL) {
    return { news: cachedNews, errors: [], fromCache: true };
  }

  return forceRefreshNews();
}

export async function forceRefreshNews(): Promise<{
  news: NormalizedNewsItem[];
  errors: string[];
  fromCache: boolean;
}> {
  const errors: string[] = [];
  const allItems: NormalizedNewsItem[] = [];

  const results = await Promise.allSettled([
    fetchSupercellNews(),
    fetchRedditNews(),
    fetchYouTubeNews(),
    fetchTwitterNews(),
  ]);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`[news] ${SOURCE_NAMES[index]}: fetched ${result.value.length} items`);
      allItems.push(...result.value);
    } else {
      const msg = `${SOURCE_NAMES[index]}: ${result.reason?.message || 'Unknown error'}`;
      console.error(`[news] ${msg}`);
      errors.push(msg);
    }
  });

  // Deduplicate by sourceUrl
  const seen = new Set<string>();
  const deduplicated = allItems.filter((item) => {
    if (seen.has(item.sourceUrl)) return false;
    seen.add(item.sourceUrl);
    return true;
  });

  // Sort by publishedAt descending
  deduplicated.sort((a, b) => b.publishedAt - a.publishedAt);

  // Update cache
  cachedNews = deduplicated;
  cacheTime = Date.now();

  return { news: deduplicated, errors, fromCache: false };
}
