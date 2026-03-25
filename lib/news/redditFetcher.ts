import { NormalizedNewsItem } from './types';

const REDDIT_URL =
  'https://www.reddit.com/r/ClashRoyale/search.json?q=flair%3ANews&sort=new&restrict_sr=on&limit=10';

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
      'User-Agent': 'clash-royale-mentor/1.0 (news aggregator)',
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
