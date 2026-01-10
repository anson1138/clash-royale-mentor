import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const BASE = 'https://royaleapi.com';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeType(type) {
  const t = String(type || '').trim().toLowerCase();
  if (t === 'troop' || t === 'spell' || t === 'building') return t;
  return t;
}

function normalizeRarity(rarity) {
  return String(rarity || '').trim().toLowerCase();
}

async function fetchText(url, { maxRetries = 6 } = {}) {
  let attempt = 0;
  while (true) {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (DeckDoctorSync/1.0)' },
    });
    if (r.ok) return await r.text();

    // Basic backoff for rate limits / transient errors
    if ((r.status === 429 || r.status === 503) && attempt < maxRetries) {
      const retryAfter = Number(r.headers.get('retry-after') || '0');
      const backoff = Math.max(500, retryAfter * 1000, 500 * Math.pow(2, attempt));
      await sleep(backoff);
      attempt += 1;
      continue;
    }

    throw new Error(`${r.status} ${r.statusText} for ${url}`);
  }
}

function extractElixirFromCardPage(html) {
  const $ = cheerio.load(html);
  const labels = $('.ui.basic.label')
    .toArray()
    .map((el) => $(el).text().replace(/\s+/g, ' ').trim());
  for (const t of labels) {
    const m = t.match(/^Elixir:\s*(\d+)$/i);
    if (m) return Number(m[1]);
  }
  return null;
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (idx < items.length) {
      const current = idx++;
      results[current] = await fn(items[current], current);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  const html = await fetchText(`${BASE}/cards`);
  const $ = cheerio.load(html);

  const gridItems = $('div.grid_item[data-card]').toArray();
  const cards = gridItems
    .map((el) => {
      const attrs = el.attribs || {};
      const key = String(attrs['data-card'] || '').trim();
      const type = normalizeType(attrs['data-type']);
      const rarity = normalizeRarity(attrs['data-rarity']);
      const evo = String(attrs['data-evo'] || '').trim();
      const hero = String(attrs['data-hero'] || '').trim();
      const name = $(el).find('.card_name').first().text().replace(/\s+/g, ' ').trim();
      if (!key || !name || !type) return null;
      // Filter out evolution variants + non-deck entities to keep dataset focused on actual deck cards.
      if (evo === '1' || /-ev\\d+$/i.test(key)) return null;
      if (hero === '1') return null;
      return { key, name, type, rarity };
    })
    .filter(Boolean);

  // De-dupe (just in case)
  const byKey = new Map();
  for (const c of cards) byKey.set(c.key, c);
  const uniqueCards = Array.from(byKey.values()).sort((a, b) => a.key.localeCompare(b.key));

  const enriched = await mapLimit(uniqueCards, 3, async (c) => {
    // Be gentle to avoid rate limits.
    await sleep(120);
    const page = await fetchText(`${BASE}/card/${c.key}`);
    const elixir = extractElixirFromCardPage(page);
    if (typeof elixir !== 'number') {
      throw new Error(`Failed to parse elixir for ${c.key} (${c.name})`);
    }
    return { ...c, elixir };
  });

  const outDir = path.join(process.cwd(), 'data', 'royaleapi');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'cards.json');
  fs.writeFileSync(outFile, JSON.stringify(enriched, null, 2));

  console.log(`Saved ${enriched.length} cards -> ${path.relative(process.cwd(), outFile)}`);
  console.log('Contains Little Prince?', enriched.some((c) => c.key === 'little-prince' || c.name === 'Little Prince'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

