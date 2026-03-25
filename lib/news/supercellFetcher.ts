import * as cheerio from 'cheerio';
import { NormalizedNewsItem } from './types';

const BLOG_URL = 'https://supercell.com/en/games/clashroyale/blog/';

export async function fetchSupercellNews(): Promise<NormalizedNewsItem[]> {
  const response = await fetch(BLOG_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Supercell blog returned ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const items: NormalizedNewsItem[] = [];
  const seenUrls = new Set<string>();

  // Blog post links match /en/games/clashroyale/blog/(news|release-notes)/slug/
  $('a[href*="/blog/news/"], a[href*="/blog/release-notes/"]').each((_, el) => {
    try {
      const $el = $(el);
      const href = $el.attr('href');
      if (!href) return;

      const sourceUrl = href.startsWith('http')
        ? href
        : `https://supercell.com${href}`;

      if (seenUrls.has(sourceUrl)) return;
      seenUrls.add(sourceUrl);

      // Structure: date text, "Blog – Clash Royale", actual title
      const textParts = $el
        .find('*')
        .map((_, child) => $(child).clone().children().remove().end().text().trim())
        .get()
        .filter((t: string) => t.length > 0);

      // The title is the last meaningful text part (not date, not "Blog – Clash Royale")
      const title =
        textParts.find(
          (t: string) =>
            !t.match(/^\d{1,2}\s\w{3}\s\d{4}$/) &&
            !t.includes('Blog – Clash Royale')
        ) || textParts[textParts.length - 1] || '';

      if (!title) return;

      // Extract date from the first text part
      const dateText = textParts.find((t: string) =>
        t.match(/^\d{1,2}\s\w{3}\s\d{4}$/)
      );
      const publishedAt = dateText
        ? new Date(dateText).getTime()
        : Date.now();

      // Extract thumbnail
      const thumbnailUrl = $el.find('img').first().attr('src') || undefined;

      items.push({
        title,
        summary: title,
        source: 'supercell',
        sourceUrl,
        thumbnailUrl,
        publishedAt: isNaN(publishedAt) ? Date.now() : publishedAt,
      });
    } catch {
      // Skip individual post parse errors
    }
  });

  return items.slice(0, 10);
}
