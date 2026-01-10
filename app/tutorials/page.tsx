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
      case 'beginner': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'advanced': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'basics': return '📖';
      case 'synergy': return '🔗';
      case 'advanced': return '⚡';
      default: return '📚';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Deck Building Tutorials
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600 dark:text-gray-300">Loading tutorials...</div>
          </div>
        ) : tutorials.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300 mb-2">
                No Tutorials Yet
              </h3>
              <p className="text-yellow-700 dark:text-yellow-400 mb-4">
                Ingest the seed content first to populate the tutorials.
              </p>
              <a href="/admin/sources" className="text-blue-600 dark:text-blue-400 hover:underline">
                Go to Admin Sources →
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category === 'all' ? '📚 All' : `${getCategoryEmoji(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
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
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">{getCategoryEmoji(tutorial.category)}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    {tutorial.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {tutorial.content.substring(0, 150)}...
                  </p>
                  <div className="mt-4 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    Read More →
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tutorial Modal */}
        {selectedTutorial && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTutorial(null)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{getCategoryEmoji(selectedTutorial.category)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedTutorial.difficulty)}`}>
                        {selectedTutorial.difficulty}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedTutorial.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedTutorial(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {selectedTutorial.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
