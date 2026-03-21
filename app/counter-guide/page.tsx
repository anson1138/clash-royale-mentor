'use client';

import { useState, useEffect, useRef } from 'react';
import { ArenaRenderer } from '@/components/ArenaRenderer';
import { AICounterStrategy } from '@/lib/counterGuide/llmCounterGuide';

export default function CounterGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<AICounterStrategy | null>(null);
  const [error, setError] = useState('');
  const [allCards, setAllCards] = useState<string[]>([]);
  const [filteredCards, setFilteredCards] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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

    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      setError('Please enter a card name');
      return;
    }

    setLoading(true);
    setError('');
    setStrategy(null);

    try {
      const response = await fetch('/api/counter-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardName: trimmedSearchTerm }),
      });

      const data = await response.json();

      if (data.success) {
        setStrategy(data.strategy);
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
    <div className="p-12 space-y-8">
      {/* Section Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Threat Intelligence</span>
        <h2 className="text-4xl font-black tracking-tight text-white uppercase italic mt-1">Counter Guide</h2>
      </div>

      {/* Search Section */}
      <div className="bg-surface-container-low rounded-xl p-8 border border-white/5">
        <form onSubmit={handleSearch}>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
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
                className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-lg text-lg text-on-surface focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:outline-none transition-all placeholder:text-outline"
                autoComplete="off"
                required
              />

              {showSuggestions && filteredCards.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-surface-container-high border border-outline-variant rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {filteredCards.slice(0, 10).map((card, index) => (
                    <div
                      key={card}
                      onClick={() => selectCard(card)}
                      className={`px-4 py-2 cursor-pointer transition-colors ${
                        index === selectedIndex
                          ? 'bg-primary/10 text-primary'
                          : 'text-on-surface hover:bg-surface-container-highest'
                      }`}
                    >
                      <div className="font-medium">{card}</div>
                    </div>
                  ))}
                  {filteredCards.length > 10 && (
                    <div className="px-4 py-2 text-sm text-outline text-center border-t border-outline-variant">
                      +{filteredCards.length - 10} more cards
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-error/10 border border-error/20 text-error rounded-lg">
            {error}
          </div>
        )}

        {!searchTerm && allCards.length > 0 && (
          <div className="mt-4 text-sm text-on-surface-variant">
            Start typing to see suggestions from {allCards.length} available cards
          </div>
        )}
      </div>

      {strategy && (
        <>
          {/* Overview */}
          {strategy.overview && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-primary">psychology</span>
                <h3 className="text-sm font-bold text-primary uppercase tracking-tight">AI Analysis</h3>
              </div>
              <p className="text-on-surface-variant leading-relaxed">{strategy.overview}</p>
            </div>
          )}

          <div className="bg-surface-container-low rounded-xl p-8 border border-white/5">
            <h2 className="text-3xl font-black mb-6 text-white tracking-tight">
              How to Counter {strategy.targetCard}
            </h2>

            {strategy.counterCards.map((counter, idx) => (
              <div key={idx} className="mb-8 pb-8 border-b border-outline-variant/20 last:border-b-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-2xl font-bold text-primary">
                    {counter.card}
                  </div>
                  <div className="px-3 py-1 bg-tertiary-container/20 text-tertiary rounded-full text-sm font-semibold">
                    {counter.cost} Elixir
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    counter.effectiveness === 'excellent' ? 'bg-green-500/10 text-green-400' :
                    counter.effectiveness === 'good' ? 'bg-primary/10 text-primary' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {counter.effectiveness}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-on-surface text-xs uppercase tracking-widest">
                      Placement Diagram
                    </h4>
                    <ArenaRenderer placements={counter.placement} width={350} height={600} />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-on-surface text-xs uppercase tracking-widest">
                      Steps
                    </h4>
                    <ol className="space-y-3 mb-4">
                      {counter.placement.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-secondary-container rounded-full flex items-center justify-center font-bold text-sm text-on-secondary">
                            {stepIdx + 1}
                          </span>
                          <span className="text-on-surface-variant">
                            {step.description}
                          </span>
                        </li>
                      ))}
                    </ol>

                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                      <div className="font-semibold mb-2 text-primary text-xs uppercase tracking-widest">
                        Pro Tip
                      </div>
                      <div className="text-on-surface-variant text-sm leading-relaxed">
                        {counter.notes}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* General Tips */}
          {strategy.generalTips && strategy.generalTips.length > 0 && (
            <div className="bg-surface-container rounded-xl p-8 border border-secondary-container/10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-secondary-container">tips_and_updates</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">General Counter Tips</h3>
              </div>
              <ul className="space-y-3">
                {strategy.generalTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-on-surface-variant text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary-container/20 text-secondary-container flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
