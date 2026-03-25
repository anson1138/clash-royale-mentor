'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  summary: string;
  source: 'supercell' | 'reddit' | 'youtube' | 'twitter';
  sourceUrl: string;
  thumbnailUrl?: string;
  publishedAt: number;
}

type SourceFilter = 'all' | 'supercell' | 'reddit' | 'youtube' | 'twitter';

const SOURCE_BADGES: Record<
  string,
  { label: string; icon: string; style: string }
> = {
  supercell: {
    label: 'Supercell',
    icon: 'verified',
    style: 'bg-primary-container/20 text-primary',
  },
  reddit: {
    label: 'Reddit',
    icon: 'forum',
    style: 'bg-orange-500/10 text-orange-400',
  },
  youtube: {
    label: 'YouTube',
    icon: 'play_circle',
    style: 'bg-red-500/10 text-red-400',
  },
  twitter: {
    label: 'X / Twitter',
    icon: 'tag',
    style: 'bg-sky-500/10 text-sky-400',
  },
};

const FILTERS: { value: SourceFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'supercell', label: 'Supercell' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter' },
];

function formatDate(epoch: number): string {
  const now = Date.now();
  const diff = now - epoch;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  return new Date(epoch).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<SourceFilter>('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.success) {
        setNews(data.news);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshResult(null);
    try {
      const response = await fetch('/api/news/refresh', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setRefreshResult(
          data.errors?.length
            ? `Inserted ${data.message.match(/\d+/)?.[0] || 0} items (${data.errors.length} source error${data.errors.length > 1 ? 's' : ''})`
            : data.message
        );
        await fetchNews();
      } else {
        setRefreshResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setRefreshResult('Failed to refresh news');
    } finally {
      setRefreshing(false);
      setTimeout(() => setRefreshResult(null), 5000);
    }
  };

  const filteredNews =
    selectedSource === 'all'
      ? news
      : news.filter((item) => item.source === selectedSource);

  return (
    <div className="p-12 space-y-8">
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            Intel Feed
          </span>
          <h2 className="text-4xl font-black tracking-tight text-white uppercase italic mt-1">
            News & Announcements
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {refreshResult && (
            <span className="text-xs text-on-surface-variant">{refreshResult}</span>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container/20 text-primary rounded-lg font-semibold text-sm hover:bg-primary-container/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}
            >
              {refreshing ? 'progress_activity' : 'refresh'}
            </span>
            {refreshing ? 'Refreshing...' : 'Refresh News'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary animate-spin">
              progress_activity
            </span>
          </div>
          <div className="text-on-surface-variant">Loading news...</div>
        </div>
      ) : news.length === 0 ? (
        <div className="bg-secondary-container/5 border border-secondary-container/10 rounded-xl p-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-secondary-container/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-secondary-container text-3xl">
                newspaper
              </span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-container mb-2">
              No News Yet
            </h3>
            <p className="text-on-surface-variant">
              News will appear here after the first refresh cycle runs.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Source Filter */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-white/5">
            <div className="flex flex-wrap gap-3">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedSource(filter.value)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    selectedSource === filter.value
                      ? 'bg-primary-container text-white'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          {filteredNews.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant">
              No news from this source yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => {
                const badge = SOURCE_BADGES[item.source];
                return (
                  <a
                    key={item.sourceUrl}
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-container rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 group"
                  >
                    {/* Thumbnail */}
                    {item.thumbnailUrl && (
                      <div className="aspect-video w-full overflow-hidden bg-surface-container-high">
                        <img
                          src={item.thumbnailUrl}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {/* Source Badge + Date */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${badge.style}`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {badge.icon}
                          </span>
                          {badge.label}
                        </span>
                        <span className="text-xs text-outline">
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold mb-2 text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-sm text-on-surface-variant line-clamp-3">
                        {item.summary}
                      </p>

                      {/* Read More */}
                      <div className="mt-4 text-primary font-semibold text-xs uppercase tracking-widest">
                        Read Original &rarr;
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
