import * as cheerio from 'cheerio';
import { NormalizedNewsItem } from './types';

const CHANNEL_HANDLE = 'ClashRoyale';
const CHANNEL_ID = 'UC_F8DoJf9MZogEOU51TpTbQ';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

/**
 * Try RSS feed first (fast, structured), fall back to channel page scraping.
 */
export async function fetchYouTubeNews(): Promise<NormalizedNewsItem[]> {
  // Try RSS feed first
  try {
    const items = await fetchFromRSS();
    if (items.length > 0) return items;
  } catch {
    // RSS may be unavailable for some channels
  }

  // Fallback: scrape the channel videos page
  return fetchFromChannelPage();
}

async function fetchFromRSS(): Promise<NormalizedNewsItem[]> {
  const response = await fetch(RSS_URL, {
    headers: { 'User-Agent': 'clash-royale-mentor/1.0' },
  });

  if (!response.ok) {
    throw new Error(`YouTube RSS returned ${response.status}`);
  }

  const xml = await response.text();
  const $ = cheerio.load(xml, { xmlMode: true });
  const items: NormalizedNewsItem[] = [];

  $('entry').each((_, el) => {
    try {
      const $entry = $(el);
      const title = $entry.find('title').text().trim();
      const videoId = $entry.find('yt\\:videoId, videoId').text().trim();
      const published = $entry.find('published').text().trim();
      const description =
        $entry.find('media\\:description, description').text().trim();

      if (!title || !videoId) return;

      const summary = description
        ? description.substring(0, 200) + (description.length > 200 ? '...' : '')
        : title;

      items.push({
        title,
        summary,
        source: 'youtube',
        sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        publishedAt: new Date(published).getTime() || Date.now(),
      });
    } catch {
      // Skip individual entry parse errors
    }
  });

  return items.slice(0, 10);
}

async function fetchFromChannelPage(): Promise<NormalizedNewsItem[]> {
  const response = await fetch(
    `https://www.youtube.com/@${CHANNEL_HANDLE}/videos`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`YouTube channel page returned ${response.status}`);
  }

  const html = await response.text();

  // Extract video data from the page's embedded JSON
  const videoIds = new Set<string>();
  const videoIdMatches = html.matchAll(/"videoId":"([^"]+)"/g);
  for (const match of videoIdMatches) {
    videoIds.add(match[1]);
    if (videoIds.size >= 10) break;
  }

  // Extract video titles from the page
  const titleMap = new Map<string, string>();
  const titleMatches = html.matchAll(
    /"videoId":"([^"]+)".*?"title":\{"runs":\[\{"text":"([^"]+)"\}/g
  );
  for (const match of titleMatches) {
    titleMap.set(match[1], match[2]);
  }

  return Array.from(videoIds).map((videoId) => ({
    title: titleMap.get(videoId) || `Clash Royale Video`,
    summary: titleMap.get(videoId) || 'Watch on YouTube',
    source: 'youtube' as const,
    sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    publishedAt: Date.now(), // Can't reliably extract dates from page scraping
  }));
}
