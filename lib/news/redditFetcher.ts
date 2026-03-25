import { NormalizedNewsItem } from './types';

const APIFY_ACTOR = 'trudax~reddit-scraper-lite';
const SUBREDDIT_URL = 'https://www.reddit.com/r/ClashRoyale/hot/';
const MAX_ITEMS = 10;

interface ApifyRedditPost {
  title: string;
  body?: string;
  url: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  createdAt?: string;
  isAd?: boolean;
}

export async function fetchRedditNews(): Promise<NormalizedNewsItem[]> {
  const apiToken = process.env.APIFY_API_TOKEN;

  if (!apiToken) {
    console.warn('APIFY_API_TOKEN not set — skipping Reddit news');
    return [];
  }

  const response = await fetch(
    `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${apiToken}&timeout=60`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startUrls: [{ url: SUBREDDIT_URL }],
        maxItems: MAX_ITEMS,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Apify Reddit returned ${response.status}`);
  }

  const posts: ApifyRedditPost[] = await response.json();

  return posts
    .filter((post) => post.title && !post.isAd)
    .map((post) => {
      const summary = post.body
        ? post.body.substring(0, 200) + (post.body.length > 200 ? '...' : '')
        : post.title;

      const thumbnailUrl =
        post.imageUrls?.[0] ||
        (post.thumbnailUrl && post.thumbnailUrl !== 'self' && post.thumbnailUrl.startsWith('http')
          ? post.thumbnailUrl
          : undefined);

      return {
        title: post.title,
        summary,
        source: 'reddit' as const,
        sourceUrl: post.url,
        thumbnailUrl,
        publishedAt: post.createdAt ? new Date(post.createdAt).getTime() : Date.now(),
      };
    });
}
