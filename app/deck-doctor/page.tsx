'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type CardOption = {
  key: string;
  name: string;
  type: string;
  rarity?: string;
  elixir: number;
};

type SwapRecommendation = {
  remove: string;
  add: string;
  reason: string;
};

type DeckAnalysis = {
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  avgElixir: number;
  archetype: string;
  archetypeDescription: string;
  strengths: string[];
  weaknesses: string[];
  swapRecommendations: SwapRecommendation[];
  playstyleTips: string[];
  matchupNotes: string;
};

export default function DeckDoctor() {
  const searchParams = useSearchParams();
  const [cards, setCards] = useState<string[]>(Array(8).fill(''));
  const [cardOptions, setCardOptions] = useState<CardOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DeckAnalysis | null>(null);
  const [error, setError] = useState('');

  // Load cards from URL parameters
  useEffect(() => {
    const cardsParam = searchParams.get('cards');
    if (cardsParam) {
      const cardNames = cardsParam.split(',').map(c => c.trim()).filter(c => c);
      if (cardNames.length > 0) {
        const newCards = Array(8).fill('');
        cardNames.forEach((name, idx) => {
          if (idx < 8) {
            newCards[idx] = name;
          }
        });
        setCards(newCards);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/cards');
        const data = await res.json();
        if (!cancelled && data?.success && Array.isArray(data.cards)) {
          setCardOptions(data.cards);
        }
      } catch (err) {
        // Autocomplete is optional; log but don't block UI
        console.warn('Failed to load card autocomplete:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cardNameSet = useMemo(() => {
    return new Set(cardOptions.map((c) => c.name.toLowerCase()));
  }, [cardOptions]);

  const handleCardChange = (index: number, value: string) => {
    const newCards = [...cards];
    newCards[index] = value;
    setCards(newCards);
  };

  const normalizeIfExactMatch = (index: number) => {
    const raw = cards[index]?.trim();
    if (!raw) return;
    const match = cardOptions.find((c) => c.name.toLowerCase() === raw.toLowerCase());
    if (!match || match.name === raw) return;
    const next = [...cards];
    next[index] = match.name;
    setCards(next);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/deck-doctor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: cards.filter(c => c.trim()) }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      S: 'text-yellow-500',
      A: 'text-green-500',
      B: 'text-blue-500',
      C: 'text-orange-500',
      D: 'text-red-500',
      F: 'text-red-700',
    };
    return colors[grade] || 'text-gray-500';
  };

  const getGradeBg = (grade: string) => {
    const colors: Record<string, string> = {
      S: 'bg-yellow-500/10 border-yellow-500/30',
      A: 'bg-green-500/10 border-green-500/30',
      B: 'bg-blue-500/10 border-blue-500/30',
      C: 'bg-orange-500/10 border-orange-500/30',
      D: 'bg-red-500/10 border-red-500/30',
      F: 'bg-red-700/10 border-red-700/30',
    };
    return colors[grade] || 'bg-gray-500/10 border-gray-500/30';
  };

  const filledCardCount = cards.filter(c => c.trim()).length;
  const canAnalyze = filledCardCount === 8 && !loading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Deck Doctor
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Enter Your 8 Cards
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start typing and pick from the autocomplete (e.g., &quot;Hog Rider&quot;, &quot;Zap&quot;, &quot;Wizard&quot;)
          </p>

          <datalist id="cr-card-names">
            {cardOptions.map((c) => (
              <option key={c.key} value={c.name} />
            ))}
          </datalist>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card, index) => (
              <div key={index}>
                <label htmlFor={`card-${index}`} className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Card {index + 1}
                </label>
                <input
                  id={`card-${index}`}
                  type="text"
                  value={card}
                  onChange={(e) => handleCardChange(index, e.target.value)}
                  onBlur={() => normalizeIfExactMatch(index)}
                  placeholder={`Card ${index + 1}`}
                  list="cr-card-names"
                  autoComplete="off"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {card.trim() && cardOptions.length > 0 && !cardNameSet.has(card.trim().toLowerCase()) && (
                  <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    Pick from dropdown to avoid typos
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors"
              aria-label="Analyze deck"
            >
              {loading ? 'Analyzing with AI...' : 'Analyze Deck'}
            </button>
            {filledCardCount < 8 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filledCardCount}/8 cards entered
              </span>
            )}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg" role="alert">
              {error}
            </div>
          )}
        </div>

        {analysis && (
          <>
            {/* Grade and Archetype Display */}
            <div className={`rounded-lg shadow-lg p-8 mb-6 border-2 ${getGradeBg(analysis.grade)}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className={`text-8xl font-bold mb-2 ${getGradeColor(analysis.grade)}`} aria-label={`Grade ${analysis.grade}`}>
                    {analysis.grade}
                  </div>
                  <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Score: {analysis.score}/100
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-400">
                    Average Elixir: {analysis.avgElixir}
                  </div>
                </div>
                <div className="flex-1 md:max-w-md">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {analysis.archetype}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {analysis.archetypeDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-lg p-8 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-300">
                  Strengths
                </h3>
                <ul className="space-y-2" role="list">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="text-green-700 dark:text-green-400 flex items-start gap-2">
                      <span className="text-green-500 mt-1">+</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {analysis.weaknesses.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-lg p-8 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-red-800 dark:text-red-300">
                  Weaknesses
                </h3>
                <ul className="space-y-2" role="list">
                  {analysis.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-red-700 dark:text-red-400 flex items-start gap-2">
                      <span className="text-red-500 mt-1">-</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Swap Recommendations */}
            {analysis.swapRecommendations.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow-lg p-8 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-300">
                  Suggested Card Swaps
                </h3>
                <div className="space-y-4">
                  {analysis.swapRecommendations.map((swap, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                          {swap.remove}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 text-xl">→</span>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                          {swap.add}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {swap.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playstyle Tips */}
            {analysis.playstyleTips.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-lg p-8 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">
                  How to Play This Deck
                </h3>
                <ul className="space-y-3" role="list">
                  {analysis.playstyleTips.map((tip, idx) => (
                    <li key={idx} className="text-blue-700 dark:text-blue-400 flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Matchup Notes */}
            {analysis.matchupNotes && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg shadow-lg p-8 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-amber-800 dark:text-amber-300">
                  Matchup Analysis
                </h3>
                <p className="text-amber-700 dark:text-amber-400">
                  {analysis.matchupNotes}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
