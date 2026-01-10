'use client';

import { useState } from 'react';
import { DeckAnalysis } from '@/lib/deckDoctor/rubric';

export default function DeckDoctor() {
  const [cards, setCards] = useState<string[]>(Array(8).fill(''));
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DeckAnalysis | null>(null);
  const [expertAdvice, setExpertAdvice] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleCardChange = (index: number, value: string) => {
    const newCards = [...cards];
    newCards[index] = value;
    setCards(newCards);
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
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S': return 'text-yellow-500';
      case 'A': return 'text-green-500';
      case 'B': return 'text-blue-500';
      case 'C': return 'text-orange-500';
      case 'D': return 'text-red-500';
      case 'F': return 'text-red-700';
      default: return 'text-gray-500';
    }
  };

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
            Type the names of your cards (e.g., "Hog Rider", "Zap", "Wizard")
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card, index) => (
              <div key={index}>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Card {index + 1}
                </label>
                <input
                  type="text"
                  value={card}
                  onChange={(e) => handleCardChange(index, e.target.value)}
                  placeholder={`Card ${index + 1}`}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || cards.filter(c => c.trim()).length !== 8}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze Deck'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
              ❌ {error}
            </div>
          )}
        </div>

        {analysis && (
          <>
            {/* Grade Display */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
              <div className="text-center">
                <div className={`text-8xl font-bold mb-4 ${getGradeColor(analysis.grade)}`}>
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

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-lg p-8 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-300">
                  ✅ Strengths
                </h3>
                <ul className="space-y-2">
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
                <ul className="space-y-2">
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
                <ul className="space-y-2">
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
