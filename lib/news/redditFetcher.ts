import { NormalizedNewsItem } from './types';

// Use /hot instead of flair search — the "News" flair is rarely used
const REDDIT_URL =
  'https://www.reddit.com/r/ClashRoyale/hot.json?limit=10';

const INVALID_THUMBNAILS = new Set(['self', 'default', 'nsfw', 'spoiler', 'image', '']);

interface RedditPost {
  data: {
    title: string;
    selftext: string;
    permalink: string;
    url: string;
    thumbnail: string;
    created_utc: number;
    link_flair_text?: string;
  };
}

export async function fetchRedditNews(): Promise<NormalizedNewsItem[]> {
  const response = await fetch(REDDIT_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Reddit returned ${response.status}`);
  }

  const json = await response.json();
  const posts: RedditPost[] = json?.data?.children || [];

  return posts.map((post) => {
    const { title, selftext, permalink, thumbnail, created_utc } = post.data;

    const summary = selftext
      ? selftext.substring(0, 200) + (selftext.length > 200 ? '...' : '')
      : title;

    const thumbnailUrl =
      thumbnail && !INVALID_THUMBNAILS.has(thumbnail) && thumbnail.startsWith('http')
        ? thumbnail
        : undefined;

    return {
      title,
      summary,
      source: 'reddit' as const,
      sourceUrl: `https://www.reddit.com${permalink}`,
      thumbnailUrl,
      publishedAt: created_utc * 1000,
    };
  });
}
