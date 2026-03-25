export interface NormalizedNewsItem {
  title: string;
  summary: string;
  source: 'supercell' | 'reddit' | 'youtube' | 'twitter';
  sourceUrl: string;
  thumbnailUrl?: string;
  publishedAt: number; // epoch ms
}
