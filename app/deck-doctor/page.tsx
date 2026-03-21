'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
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
  return (
    <Suspense fallback={<DeckDoctorLoading />}>
      <DeckDoctorContent />
    </Suspense>
  );
}

function DeckDoctorLoading() {
  return (
    <div className="p-12 space-y-8">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Tactical Analysis</span>
        <h2 className="text-4xl font-black tracking-tight text-white uppercase italic mt-1">Deck Doctor</h2>
      </div>
      <div className="bg-surface-container-low rounded-xl p-8 border border-white/5">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-container-high rounded w-1/3 mb-4" />
          <div className="h-4 bg-surface-container-high rounded w-2/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-surface-container-high rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DeckDoctorContent() {
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
      S: 'text-yellow-400',
      A: 'text-green-400',
      B: 'text-primary',
      C: 'text-orange-400',
      D: 'text-red-400',
      F: 'text-red-600',
    };
    return colors[grade] || 'text-outline';
  };

  const getGradeBg = (grade: string) => {
    const colors: Record<string, string> = {
      S: 'bg-yellow-500/10 border-yellow-500/20',
      A: 'bg-green-500/10 border-green-500/20',
      B: 'bg-primary/10 border-primary/20',
      C: 'bg-orange-500/10 border-orange-500/20',
      D: 'bg-red-500/10 border-red-500/20',
      F: 'bg-red-700/10 border-red-700/20',
    };
    return colors[grade] || 'bg-surface-container border-outline-variant';
  };

  const filledCardCount = cards.filter(c => c.trim()).length;
  const canAnalyze = filledCardCount === 8 && !loading;

  return (
    <div className="p-12 space-y-8">
      {/* Section Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Tactical Analysis</span>
        <h2 className="text-4xl font-black tracking-tight text-white uppercase italic mt-1">Deck Doctor Analysis</h2>
        <p className="text-on-surface-variant max-w-2xl font-medium tracking-wide mt-2">
          Advanced heuristic scan. Visualizing tactical synergies and counter-threat vectors for your loadout.
        </p>
      </div>

      {/* Card Input Section */}
      <div className="bg-surface-container-low rounded-xl p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #A9C7FF 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Active Deck Slot</h3>
            <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-[10px] font-bold text-primary">{filledCardCount}/8 CARDS</span>
            </div>
          </div>

          <p className="text-on-surface-variant text-sm mb-6">
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
                <label htmlFor={`card-${index}`} className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-on-surface-variant">
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
                  className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-lg text-on-surface focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:outline-none transition-all placeholder:text-outline"
                />
                {card.trim() && cardOptions.length > 0 && !cardNameSet.has(card.trim().toLowerCase()) && (
                  <div className="mt-1 text-xs text-secondary-container">
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
              className="px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Analyze deck"
            >
              {loading ? 'Analyzing with AI...' : 'Analyze Deck'}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-error/10 border border-error/20 text-error rounded-lg" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>

      {analysis && (
        <div className="space-y-6">
          {/* Grade and Archetype Display */}
          <div className={`rounded-xl p-8 border-2 ${getGradeBg(analysis.grade)}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="text-center md:text-left">
                <div className={`text-8xl font-black mb-2 ${getGradeColor(analysis.grade)}`} aria-label={`Grade ${analysis.grade}`}>
                  {analysis.grade}
                </div>
                <div className="text-xl font-semibold text-on-surface">
                  Score: {analysis.score}/100
                </div>
                <div className="text-lg text-on-surface-variant">
                  Average Elixir: {analysis.avgElixir}
                </div>
              </div>
              <div className="flex-1 md:max-w-md">
                <div className="text-2xl font-bold text-white mb-2">
                  {analysis.archetype}
                </div>
                <p className="text-on-surface-variant">
                  {analysis.archetypeDescription}
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="glass-panel rounded-xl p-6 border border-green-500/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <span className="material-symbols-outlined text-green-400">check_circle</span>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight">Strengths</h3>
                </div>
                <ul className="space-y-2" role="list">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="text-green-400 flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">+</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {analysis.weaknesses.length > 0 && (
              <div className="glass-panel rounded-xl p-6 border border-red-500/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center border border-error/20">
                    <span className="material-symbols-outlined text-error">warning</span>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight">Weaknesses</h3>
                </div>
                <ul className="space-y-2" role="list">
                  {analysis.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-red-400 flex items-start gap-2 text-sm">
                      <span className="text-red-500 mt-0.5">-</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Swap Recommendations */}
          {analysis.swapRecommendations.length > 0 && (
            <div className="bg-surface-container rounded-xl p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-tertiary">swap_horiz</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Suggested Card Swaps</h3>
              </div>
              <div className="space-y-4">
                {analysis.swapRecommendations.map((swap, idx) => (
                  <div key={idx} className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm font-medium">
                        {swap.remove}
                      </span>
                      <span className="text-outline text-xl">&rarr;</span>
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                        {swap.add}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm">
                      {swap.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playstyle Tips */}
          {analysis.playstyleTips.length > 0 && (
            <div className="bg-surface-container rounded-xl p-8 border border-primary/10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">strategy</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">How to Play This Deck</h3>
              </div>
              <ul className="space-y-3" role="list">
                {analysis.playstyleTips.map((tip, idx) => (
                  <li key={idx} className="text-on-surface-variant flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
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
            <div className="bg-surface-container rounded-xl p-8 border border-secondary-container/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-secondary-container">analytics</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Matchup Analysis</h3>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {analysis.matchupNotes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
