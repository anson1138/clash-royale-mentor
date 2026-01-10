'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DeckAnalysis } from '@/lib/deckDoctor/rubric';

type CardOption = {
  key: string;
  name: string;
  type: string;
  rarity?: string;
  elixir: number;
};

export default function DeckDoctor() {
  const searchParams = useSearchParams();
  const [cards, setCards] = useState<string[]>(Array(8).fill(''));
  const [cardOptions, setCardOptions] = useState<CardOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DeckAnalysis | null>(null);
  const [expertAdvice, setExpertAdvice] = useState<any[]>([]);
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
    setExpertAdvice([]);

    try {
      const response = await fetch('/api/deck-doctor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: cards.filter(c => c.trim()) }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
        setExpertAdvice(data.expertAdvice || []);
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
                    ⚠️ Pick from dropdown to avoid typos
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
              {loading ? 'Analyzing...' : 'Analyze Deck'}
            </button>
            {filledCardCount < 8 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filledCardCount}/8 cards entered
              </span>
            )}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg" role="alert">
              ❌ {error}
            </div>
          )}
        </div>

        {analysis && (
          <>
            {/* Grade Display */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
              <div className="text-center">
                <div className={`text-8xl font-bold mb-4 ${getGradeColor(analysis.grade)}`} aria-label={`Grade ${analysis.grade}`}>
                  {analysis.grade}
                </div>
                <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Score: {analysis.score}/100
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  Average Elixir: {analysis.avgElixir}
                </div>
              </div>
            </div>

            {/* Grade Explanation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                What Does Your Grade Mean?
              </h3>
              
              {analysis.grade === 'S' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl font-bold text-yellow-500">S</span>
                    <div>
                      <h4 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                        Meta / Broken (55%+ Win Rate)
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        <strong>&quot;If you want to win easily, play this.&quot;</strong>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        The absolute best. This deck defines the current season and has favorable matchups against almost everything else.
                      </p>
                      <div className="mt-3">
                        <p className="text-green-600 dark:text-green-400 font-semibold">✅ Pros:</p>
                        <p className="text-gray-600 dark:text-gray-400 ml-4">Highest chance of winning; frequent &quot;free wins&quot; due to raw power.</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ Cons:</p>
                        <p className="text-gray-600 dark:text-gray-400 ml-4">Highly likely to be nerfed in the next update; everyone is trying to counter you.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {analysis.grade === 'A' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl font-bold text-green-500">A</span>
                    <div>
                      <h4 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                        Elite / Strong (50% - 55% Win Rate)
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        <strong>&quot;The Safe Bet.&quot;</strong>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Consistent, reliable, and tournament-ready. Strong, balanced, and capable of reaching the highest ranks (Ultimate Champion).
                      </p>
                      <div className="mt-3">
                        <p className="text-green-600 dark:text-green-400 font-semibold">✅ Pros:</p>
                        <p className="text-gray-600 dark:text-gray-400 ml-4">Very stable; safe to upgrade (unlikely to be nerfed heavily); works in almost all arenas.</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ Cons:</p>
                        <p className="text-gray-600 dark:text-gray-400 ml-4">You won&apos;t get &quot;carry&quot; wins—you still need to play well to beat S-Tier decks.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {analysis.grade === 'B' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl font-bold text-blue-500">B</span>
                    <div>
                      <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        Viable / Niche (48% - 50% Win Rate)
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        <strong>&quot;Skill Required.&quot;</strong>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Good, but requires high skill or mastery (One-Trick). These decks are decent but have clear weaknesses or &quot;hard counters&quot; in the current meta.
                      </p>
                      <div className="mt-3">
                        <p className="text-green-600 dark:text-green-400 font-semibold">✅ Pros:</p>
                        <p className="text-gray-600 dark:text-gray-400 ml-4">Opponents might not expect them; very rewarding for players who master a single deck.</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ Cons:</p>
                        <p className="text-gray-600 dark:text-gray-400 ml-4">You will lose automatically against certain decks (e.g., playing X-Bow when everyone has Earthquake).</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {analysis.grade === 'C' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl font-bold text-orange-500">C</span>
                    <div>
                      <h4 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                        Off-Meta (&lt; 48% Win Rate)
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        <strong>&quot;Uphill Battle.&quot;</strong>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Struggles against top decks; situational. These decks are technically functional but statistically weak and rely on the opponent making huge mistakes.
                      </p>
                      <div className="mt-3">
                        <p className="text-green-600 dark:text-green-400 font-semibold">✅ Pros:</p>
                        <p className="text-gray-600 dark:text-gray-400 ml-4">Fun for casual play; unique playstyles.</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ Cons:</p>
                        <p className="text-gray-600 dark:text-gray-400 ml-4">You will hit a &quot;trophy wall&quot; where you simply cannot climb higher.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(analysis.grade === 'D' || analysis.grade === 'F') && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className={`text-3xl font-bold ${analysis.grade === 'F' ? 'text-red-700' : 'text-red-500'}`}>
                      {analysis.grade}
                    </span>
                    <div>
                      <h4 className={`text-xl font-bold mb-2 ${analysis.grade === 'F' ? 'text-red-700 dark:text-red-500' : 'text-red-600 dark:text-red-400'}`}>
                        {analysis.grade === 'F' ? 'Trash / Meme (< 40% Win Rate)' : 'Off-Meta (< 48% Win Rate)'}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        <strong>&quot;{analysis.grade === 'F' ? 'Mathematical Failure' : 'Uphill Battle'}.&quot;</strong>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {analysis.grade === 'F' 
                          ? 'Fundamentally flawed. Do not use. These decks violate core principles of the game (e.g., no win condition, 5.0+ average elixir, all spells).'
                          : 'These decks struggle significantly and require major improvements to be competitive.'
                        }
                      </p>
                      {analysis.grade === 'F' && (
                        <>
                          <div className="mt-3">
                            <p className="text-green-600 dark:text-green-400 font-semibold">✅ Pros:</p>
                            <p className="text-gray-600 dark:text-gray-400 ml-4">None.</p>
                          </div>
                          <div className="mt-2">
                            <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ Cons:</p>
                            <p className="text-gray-600 dark:text-gray-400 ml-4">You will lose to any competent player. Please review the recommendations below.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-lg p-8 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-300">
                  ✅ Strengths
                </h3>
                <ul className="space-y-2" role="list">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="text-green-700 dark:text-green-400">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Issues */}
            {analysis.issues.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-lg p-8 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-red-800 dark:text-red-300">
                  ⚠️ Issues Found
                </h3>
                <ul className="space-y-2" role="list">
                  {analysis.issues.map((issue, idx) => (
                    <li key={idx} className="text-red-700 dark:text-red-400">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-lg p-8 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">
                  💡 Recommendations
                </h3>
                <ul className="space-y-2" role="list">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-blue-700 dark:text-blue-400">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expert Advice */}
            {expertAdvice.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-300">
                  🎓 Expert Advice
                </h3>
                <div className="space-y-4">
                  {expertAdvice.map((advice, idx) => (
                    <div key={idx} className="border-l-4 border-purple-500 pl-4">
                      <div className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                        {advice.issue}
                      </div>
                      <div className="text-purple-700 dark:text-purple-400 mb-2">
                        {advice.advice}
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-500">
                        Source: {advice.source}
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
