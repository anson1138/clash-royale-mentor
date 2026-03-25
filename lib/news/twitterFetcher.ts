import { NormalizedNewsItem } from './types';

// Uses apidojo/tweet-scraper (most popular Apify Twitter actor)
// May require an Apify actor subscription beyond the free platform credits.
// If no results are returned, this fetcher gracefully returns [].
const APIFY_ACTOR = 'apidojo~tweet-scraper';
const TWITTER_HANDLE = 'ClashRoyale';
const MAX_TWEETS = 10;

interface ApifyTweet {
  full_text?: string;
  text?: string;
  created_at?: string;
  createdAt?: string;
  id_str?: string;
  id?: string;
  url?: string;
  tweetUrl?: string;
  noResults?: boolean;
  entities?: {
    media?: Array<{
      media_url_https?: string;
    }>;
  };
  extendedEntities?: {
    media?: Array<{
      media_url_https?: string;
    }>;
  };
  media?: Array<{
    media_url_https?: string;
    url?: string;
  }>;
}

export async function fetchTwitterNews(): Promise<NormalizedNewsItem[]> {
  const apiToken = process.env.APIFY_API_TOKEN;

  if (!apiToken) {
    console.warn('APIFY_API_TOKEN not set — skipping Twitter news');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${apiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: [{ url: `https://x.com/${TWITTER_HANDLE}` }],
          maxItems: MAX_TWEETS,
          sort: 'Latest',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Apify returned ${response.status}: ${await response.text()}`);
    }

    const tweets: ApifyTweet[] = await response.json();

    // Filter out noResults/demo placeholders
    const validTweets = tweets.filter(
      (tweet) => !tweet.noResults && (tweet.full_text || tweet.text)
    );

    if (validTweets.length === 0) {
      console.warn('Twitter: Apify returned no valid tweets (actor may require subscription)');
      return [];
    }

    return validTweets.map((tweet) => {
      const text = tweet.full_text || tweet.text || '';
      const title = text.substring(0, 80) + (text.length > 80 ? '...' : '');
      const summary = text.substring(0, 300) + (text.length > 300 ? '...' : '');

      const media =
        tweet.extendedEntities?.media?.[0] ||
        tweet.entities?.media?.[0] ||
        tweet.media?.[0];
      const thumbnailUrl =
        media?.media_url_https || media?.url || undefined;

      const sourceUrl =
        tweet.tweetUrl ||
        tweet.url ||
        (tweet.id_str || tweet.id
          ? `https://x.com/${TWITTER_HANDLE}/status/${tweet.id_str || tweet.id}`
          : `https://x.com/${TWITTER_HANDLE}`);

      const dateStr = tweet.created_at || tweet.createdAt;
      const publishedAt = dateStr ? new Date(dateStr).getTime() : Date.now();

      return {
        title,
        summary,
        source: 'twitter' as const,
        sourceUrl,
        thumbnailUrl,
        publishedAt: isNaN(publishedAt) ? Date.now() : publishedAt,
      };
    });
  } catch (error) {
    console.warn(
      'Twitter fetch failed (non-fatal):',
      error instanceof Error ? error.message : error
    );
    return [];
  }
}
