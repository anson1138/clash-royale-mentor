'use client';

import { useState, useEffect, useRef } from 'react';
import { ArenaRenderer } from '@/components/ArenaRenderer';
import { CounterStrategy } from '@/lib/counterGuide/strategies';
import { Citation } from '@/lib/rag/retrieval';

export default function CounterGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<CounterStrategy | null>(null);
  const [expertAdvice, setExpertAdvice] = useState<Citation[]>([]);
  const [error, setError] = useState('');
  const [allCards, setAllCards] = useState<string[]>([]);
  const [filteredCards, setFilteredCards] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch all card names on component mount
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/counter-guide/cards');
        const data = await response.json();
        if (data.success) {
          setAllCards(data.cards);
        }
      } catch (err) {
        console.error('Failed to fetch cards:', err);
      }
    };
    fetchCards();
  }, []);

  // Filter cards based on search term
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setFilteredCards([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = allCards.filter(card =>
      card.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCards(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [searchTerm, allCards]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredCards.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          selectCard(filteredCards[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const selectCard = (card: string) => {
    setSearchTerm(card);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim whitespace from search term
    const trimmedSearchTerm = searchTerm.trim();
    
    if (!trimmedSearchTerm) {
      setError('Please enter a card name');
      return;
    }
    
    setLoading(true);
    setError('');
    setStrategy(null);
    setExpertAdvice([]);

    try {
      const response = await fetch('/api/counter-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardName: trimmedSearchTerm }),
      });

      const data = await response.json();

      if (data.success) {
        setStrategy(data.strategy);
        setExpertAdvice(data.expertAdvice || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Counter Guide
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <form onSubmit={handleSearch}>
            <label className="block text-lg font-medium mb-4 text-gray-900 dark:text-white">
              How do I counter...
            </label>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  name="cardName"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (filteredCards.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder="e.g., Hog Rider, Mega Knight, Balloon"
                  className="w-full px-4 py-3 border rounded-lg text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  autoComplete="off"
                  required
                />
                
                {/* Autocomplete suggestions */}
                {showSuggestions && filteredCards.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredCards.slice(0, 10).map((card, index) => (
                      <div
                        key={card}
                        onClick={() => selectCard(card)}
                        className={`px-4 py-2 cursor-pointer transition-colors ${
                          index === selectedIndex
                            ? 'bg-blue-100 dark:bg-blue-900'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {card}
                        </div>
                      </div>
                    ))}
                    {filteredCards.length > 10 && (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center border-t dark:border-gray-600">
                        +{filteredCards.length - 10} more cards
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
              ❌ {error}
            </div>
          )}
          
          {/* Helper text */}
          {!searchTerm && allCards.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              💡 Start typing to see suggestions from {allCards.length} available cards
            </div>
          )}
        </div>

        {strategy && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                How to Counter {strategy.targetCard}
              </h2>

              {strategy.counterCards.map((counter, idx) => (
                <div key={idx} className="mb-8 pb-8 border-b last:border-b-0 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {counter.card}
                    </div>
                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold">
                      {counter.cost} Elixir
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      counter.effectiveness === 'excellent' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      counter.effectiveness === 'good' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                      'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {counter.effectiveness}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                        Placement Diagram
                      </h4>
                      <ArenaRenderer placements={counter.placement} width={300} height={400} />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                        Steps
                      </h4>
                      <ol className="space-y-3 mb-4">
                        {counter.placement.map((step, stepIdx) => (
                          <li key={stepIdx} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-sm">
                              {stepIdx + 1}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {step.description}
                            </span>
                          </li>
                        ))}
                      </ol>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="font-semibold mb-2 text-blue-900 dark:text-blue-300">
                          💡 Pro Tip
                        </div>
                        <div className="text-blue-800 dark:text-blue-400">
                          {counter.notes}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {expertAdvice.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-300">
                  🎓 Expert Insights
                </h3>
                <div className="space-y-4">
                  {expertAdvice.map((advice, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-purple-700 dark:text-purple-400 mb-2">
                        {advice.chunkContent}
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-500">
                        Source: {advice.sourceTitle} ({Math.round(advice.relevanceScore * 100)}% match)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
