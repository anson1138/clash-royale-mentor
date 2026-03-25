import { adminDb } from '@/lib/instantdb-admin';
import { id as createId } from '@instantdb/admin';
import { fetchSupercellNews } from './supercellFetcher';
import { fetchRedditNews } from './redditFetcher';
import { fetchYouTubeNews } from './youtubeFetcher';
import { fetchTwitterNews } from './twitterFetcher';
import { NormalizedNewsItem } from './types';

const SOURCE_NAMES = ['supercell', 'reddit', 'youtube', 'twitter'] as const;

export async function refreshAllNews(): Promise<{
  inserted: number;
  errors: string[];
}> {
  const errors: string[] = [];
  const allItems: NormalizedNewsItem[] = [];

  // Fetch from all sources concurrently
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

  if (allItems.length === 0) {
    return { inserted: 0, errors };
  }

  // Query existing news to deduplicate by sourceUrl
  const existing = await adminDb.query({ news: {} });
  const existingUrls = new Set(
    (existing.news || []).map((item: any) => item.sourceUrl)
  );

  const newItems = allItems.filter((item) => !existingUrls.has(item.sourceUrl));

  if (newItems.length === 0) {
    console.log('[news] No new items to insert');
    return { inserted: 0, errors };
  }

  // Insert new items in batches of 10
  const BATCH_SIZE = 10;
  for (let i = 0; i < newItems.length; i += BATCH_SIZE) {
    const batch = newItems.slice(i, i + BATCH_SIZE);
    const txns = batch.map((item) =>
      adminDb.tx.news[createId()].update({
        title: item.title,
        summary: item.summary,
        source: item.source,
        sourceUrl: item.sourceUrl,
        thumbnailUrl: item.thumbnailUrl || '',
        publishedAt: item.publishedAt,
        fetchedAt: Date.now(),
      })
    );
    await adminDb.transact(txns);
  }

  console.log(`[news] Inserted ${newItems.length} new items`);
  return { inserted: newItems.length, errors };
}
