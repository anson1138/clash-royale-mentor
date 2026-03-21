'use client';

import { useState, useEffect } from 'react';

interface Tutorial {
  id: string;
  title: string;
  category: string;
  content: string;
  difficulty: string;
  order: number;
}

export default function Tutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const response = await fetch('/api/tutorials');
      const data = await response.json();
      if (data.success) {
        setTutorials(data.tutorials);
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(tutorials.map(t => t.category)))];
  const filteredTutorials = selectedCategory === 'all'
    ? tutorials
    : tutorials.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-400';
      case 'intermediate': return 'bg-primary/10 text-primary';
      case 'advanced': return 'bg-tertiary-container/20 text-tertiary';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics': return 'menu_book';
      case 'synergy': return 'link';
      case 'advanced': return 'bolt';
      default: return 'school';
    }
  };

  return (
    <div className="p-12 space-y-8">
      {/* Section Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Learning Milestone</span>
        <h2 className="text-4xl font-black tracking-tight text-white uppercase italic mt-1">Archive Masterclass</h2>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
          </div>
          <div className="text-on-surface-variant">Loading tutorials...</div>
        </div>
      ) : tutorials.length === 0 ? (
        <div className="bg-secondary-container/5 border border-secondary-container/10 rounded-xl p-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-secondary-container/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-secondary-container text-3xl">school</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-container mb-2">
              No Tutorials Yet
            </h3>
            <p className="text-on-surface-variant mb-4">
              Ingest the seed content first to populate the tutorials.
            </p>
            <a href="/admin/sources" className="text-primary hover:underline font-semibold">
              Go to Admin Sources &rarr;
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Category Filter */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-white/5">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-container text-white'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                  }`}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tutorial Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                onClick={() => setSelectedTutorial(tutorial)}
                className="bg-surface-container rounded-xl p-6 border border-white/5 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">{getCategoryIcon(tutorial.category)}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-on-surface group-hover:text-primary transition-colors">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-on-surface-variant line-clamp-3">
                  {tutorial.content.substring(0, 150)}...
                </p>
                <div className="mt-4 text-primary font-semibold text-xs uppercase tracking-widest">
                  Read More &rarr;
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tutorial Modal */}
      {selectedTutorial && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTutorial(null)}
        >
          <div
            className="bg-surface-container-low rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-surface-container-low border-b border-outline-variant/20 p-6 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary text-2xl">{getCategoryIcon(selectedTutorial.category)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedTutorial.difficulty)}`}>
                      {selectedTutorial.difficulty}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-on-surface">
                    {selectedTutorial.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTutorial(null)}
                  className="text-outline hover:text-on-surface text-2xl transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="whitespace-pre-wrap text-on-surface-variant leading-relaxed">
                {selectedTutorial.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
