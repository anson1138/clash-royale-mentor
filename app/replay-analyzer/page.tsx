'use client';

import { useState } from 'react';
import { BattlePattern } from '@/lib/clashApi/patternMiner';

export default function ReplayAnalyzer() {
  const [playerTag, setPlayerTag] = useState('#VY9Q20PR9');
  const [loading, setLoading] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<any>(null);
  const [battles, setBattles] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<BattlePattern[]>([]);
  const [expertAdvice, setExpertAdvice] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlayerInfo(null);
    setBattles([]);
    setPatterns([]);
    setExpertAdvice([]);
    setDisabled(false);

    try {
      const response = await fetch('/api/replay-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerTag }),
      });

      const data = await response.json();

      if (data.success) {
        setPlayerInfo(data.player);
        setBattles(data.battles || []);
        setPatterns(data.patterns || []);
        setExpertAdvice(data.expertAdvice || []);
      } else {
        setError(data.error);
        setDisabled(data.disabled || false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-900/20 border-gray-500 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Replay Analyzer
        </h1>

        {disabled && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 mb-6">
            <div className="flex items-start">
              <div className="text-yellow-700 dark:text-yellow-300">
                <div className="font-bold text-lg mb-2">⚠️ Production Mode Notice</div>
                <p className="mb-2">
                  The Replay Analyzer is currently disabled in production because it requires IP allowlisting with the Clash Royale API.
                </p>
                <p className="text-sm">
                  To enable this feature in production, you need to set up a static-IP proxy service. See the README for instructions.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <form onSubmit={handleAnalyze}>
            <label className="block text-lg font-medium mb-4 text-gray-900 dark:text-white">
              Enter Your Player Tag
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Find your player tag in-game by tapping your profile. It looks like #ABC123XYZ
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                value={playerTag}
                onChange={(e) => setPlayerTag(e.target.value)}
                placeholder="#ABC123XYZ"
                className="flex-1 px-4 py-3 border rounded-lg text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <button
                type="submit"
                disabled={loading || disabled}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                {loading ? 'Analyzing...' : 'Analyze Battles'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
              ❌ {error}
            </div>
          )}
        </div>

        {playerInfo && (
          <>
            {/* Player Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Player Profile
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Name</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">{playerInfo.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tag</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">{playerInfo.tag}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Trophies</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">🏆 {playerInfo.trophies}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Best</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">⭐ {playerInfo.bestTrophies}</div>
                </div>
              </div>
            </div>

            {/* Patterns Detected */}
            {patterns.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  🔍 Patterns Detected
                </h2>
                <div className="space-y-4">
                  {patterns.map((pattern, idx) => (
                    <div 
                      key={idx} 
                      className={`border-l-4 p-6 rounded-lg ${getSeverityColor(pattern.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold">
                          {pattern.description}
                        </h3>
                        <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-semibold">
                          {pattern.occurrences}x
                        </span>
                      </div>
                      <div className="mb-3">
                        💡 <strong>What to do:</strong> {pattern.recommendation}
                      </div>
                      <div className="text-sm uppercase font-semibold">
                        Severity: {pattern.severity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-lg p-8 mb-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
                    No Major Issues Detected!
                  </h3>
                  <p className="text-green-700 dark:text-green-400">
                    Your recent battle performance looks solid. Keep it up!
                  </p>
                </div>
              </div>
            )}

            {/* Expert Advice */}
            {expertAdvice.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow-lg p-8 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-300">
                  🎓 Expert Coaching Tips
                </h3>
                <div className="space-y-4">
                  {expertAdvice.map((advice, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                      <div className="text-purple-700 dark:text-purple-400 mb-3 leading-relaxed">
                        {advice.advice}
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-500">
                        💡 Source: {advice.source}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Battle History */}
            {battles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  📜 Battle History ({battles.length} battles)
                </h3>
                
                {/* Column Headers */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 pb-3 border-b border-gray-300 dark:border-gray-600">
                  <div className="md:col-span-1 text-sm font-semibold text-gray-600 dark:text-gray-400">Result</div>
                  <div className="md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Score</div>
                  <div className="md:col-span-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Opponent</div>
                  <div className="md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Type</div>
                  <div className="md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Mode</div>
                  <div className="md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</div>
                </div>
                
                <div className="space-y-3">
                  {battles.map((battle, idx) => {
                    const playerTeam = battle.team?.[0] || {};
                    const opponent = battle.opponent?.[0] || {};
                    const playerCrowns = playerTeam.crowns || 0;
                    const opponentCrowns = opponent.crowns || 0;
                    const result = playerCrowns > opponentCrowns ? 'WIN' : playerCrowns < opponentCrowns ? 'LOSS' : 'DRAW';
                    const resultColor = result === 'WIN' ? 'text-green-600 dark:text-green-400' : result === 'LOSS' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400';
                    const bgColor = result === 'WIN' ? 'bg-green-50 dark:bg-green-900/10' : result === 'LOSS' ? 'bg-red-50 dark:bg-red-900/10' : 'bg-gray-50 dark:bg-gray-900/10';
                    
                    // Parse date properly - Clash Royale API returns non-standard ISO format
                    // Format: 20260110T060158.000Z -> 2026-01-10T06:01:58.000Z
                    const battleDate = battle.battleTime ? parseCRDate(battle.battleTime) : null;
                    const timeAgo = battleDate && !isNaN(battleDate.getTime()) ? getTimeAgo(battleDate) : 'Unknown';
                    
                    return (
                      <div key={idx} className={`${bgColor} border border-gray-200 dark:border-gray-700 rounded-lg p-4`}>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          {/* Result */}
                          <div className={`md:col-span-1 text-lg font-bold ${resultColor}`}>
                            {result}
                          </div>
                          
                          {/* Score */}
                          <div className="md:col-span-2 text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">🏆 {playerCrowns}</span>
                            <span className="mx-2">-</span>
                            <span className="font-semibold">{opponentCrowns}</span>
                          </div>
                          
                          {/* Opponent */}
                          <div className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                            vs {opponent.name || 'Unknown'}
                          </div>
                          
                          {/* Type */}
                          <div className="md:col-span-2">
                            {battle.type && (
                              <div className="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-400">
                                {battle.type.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                            )}
                          </div>
                          
                          {/* Mode */}
                          <div className="md:col-span-2">
                            {battle.gameMode?.name && (
                              <div className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-sm">
                                {battle.gameMode.name}
                              </div>
                            )}
                          </div>
                          
                          {/* Time */}
                          <div className="md:col-span-2 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            🕐 {timeAgo}
                          </div>
                        </div>
                        
                        {/* Show trophy change if available */}
                        {battle.team?.[0]?.trophyChange !== undefined && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Trophy change: </span>
                            <span className={battle.team[0].trophyChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              {battle.team[0].trophyChange >= 0 ? '+' : ''}{battle.team[0].trophyChange}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function parseCRDate(crDate: string): Date | null {
  // Clash Royale API format: 20260110T060158.000Z -> 2026-01-10T06:01:58.000Z
  if (!crDate || crDate.length < 15) return null;
  
  const year = crDate.substring(0, 4);
  const month = crDate.substring(4, 6);
  const day = crDate.substring(6, 8);
  const hour = crDate.substring(9, 11);
  const min = crDate.substring(11, 13);
  const sec = crDate.substring(13, 15);
  const ms = crDate.substring(15); // .000Z
  
  const isoDate = `${year}-${month}-${day}T${hour}:${min}:${sec}${ms}`;
  return new Date(isoDate);
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}
