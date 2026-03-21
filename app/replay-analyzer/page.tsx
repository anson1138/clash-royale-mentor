'use client';

import { useState } from 'react';
import { BattlePattern } from '@/lib/clashApi/patternMiner';

interface BattleAnalysis {
  summary: string;
  outcome: 'win' | 'loss' | 'draw';
  keyFactors: string[];
  whatWentWell: string[];
  whatCouldImprove: string[];
  matchupAnalysis: {
    playerDeckType: string;
    opponentDeckType: string;
    matchupFavorability: 'favorable' | 'even' | 'unfavorable';
    explanation: string;
  };
  tacticalTips: string[];
  deckDoctorRecommendation: string;
}

export default function ReplayAnalyzer() {
  const [playerTag, setPlayerTag] = useState('#VY9Q20PR9');
  const [loading, setLoading] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<any>(null);
  const [battles, setBattles] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<BattlePattern[]>([]);
  const [expertAdvice, setExpertAdvice] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [selectedBattle, setSelectedBattle] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlayerInfo(null);
    setBattles([]);
    setPatterns([]);
    setExpertAdvice([]);
    setDisabled(false);
    setSelectedBattle(null);

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
      case 'high': return 'bg-error/10 border-l-4 border-error text-error';
      case 'medium': return 'bg-yellow-500/10 border-l-4 border-yellow-500 text-yellow-400';
      case 'low': return 'bg-primary/10 border-l-4 border-primary text-primary';
      default: return 'bg-surface-container border-l-4 border-outline text-on-surface-variant';
    }
  };

  return (
    <div className="p-12 space-y-8">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mission Log</span>
          <h2 className="text-4xl font-black tracking-tight text-white uppercase italic mt-1">Tactical Replays</h2>
        </div>
      </div>

      {disabled && (
        <div className="bg-secondary-container/10 border-l-4 border-secondary-container p-6 rounded-r-xl">
          <div className="text-secondary-container">
            <div className="font-bold text-lg mb-2">Production Mode Notice</div>
            <p className="text-on-surface-variant mb-2">
              The Replay Analyzer is currently disabled in production because it requires IP allowlisting with the Clash Royale API.
            </p>
            <p className="text-sm text-outline">
              To enable this feature in production, you need to set up a static-IP proxy service. See the README for instructions.
            </p>
          </div>
        </div>
      )}

      {/* Search Form */}
      <div className="bg-surface-container-low rounded-xl p-8 border border-white/5">
        <form onSubmit={handleAnalyze}>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
            Enter Your Player Tag
          </label>
          <p className="text-sm text-on-surface-variant mb-4">
            Find your player tag in-game by tapping your profile. It looks like #ABC123XYZ
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              value={playerTag}
              onChange={(e) => setPlayerTag(e.target.value)}
              placeholder="#ABC123XYZ"
              className="flex-1 px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-lg text-lg text-on-surface focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:outline-none transition-all placeholder:text-outline"
              required
            />
            <button
              type="submit"
              disabled={loading || disabled}
              className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Analyzing...' : 'Analyze Battles'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-error/10 border border-error/20 text-error rounded-lg">
            {error}
          </div>
        )}
      </div>

      {playerInfo && (
        <>
          {/* Player Info Card */}
          <div className="bg-surface-container-low rounded-xl p-8 border border-white/5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">Player Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-high rounded-lg p-4">
                <div className="text-[10px] uppercase tracking-widest text-outline mb-1">Name</div>
                <div className="text-xl font-semibold text-on-surface">{playerInfo.name}</div>
              </div>
              <div className="bg-surface-container-high rounded-lg p-4">
                <div className="text-[10px] uppercase tracking-widest text-outline mb-1">Tag</div>
                <div className="text-xl font-semibold text-on-surface">{playerInfo.tag}</div>
              </div>
              <div className="bg-surface-container-high rounded-lg p-4">
                <div className="text-[10px] uppercase tracking-widest text-outline mb-1">Trophies</div>
                <div className="text-xl font-semibold text-secondary-container">{playerInfo.trophies}</div>
              </div>
              <div className="bg-surface-container-high rounded-lg p-4">
                <div className="text-[10px] uppercase tracking-widest text-outline mb-1">Best</div>
                <div className="text-xl font-semibold text-primary">{playerInfo.bestTrophies}</div>
              </div>
            </div>
          </div>

          {/* Patterns Detected */}
          {patterns.length > 0 ? (
            <div className="bg-surface-container-low rounded-xl p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-secondary-container">radar</span>
                <h2 className="text-sm font-bold text-white uppercase tracking-tight">Patterns Detected</h2>
              </div>
              <div className="space-y-4">
                {patterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-lg ${getSeverityColor(pattern.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-on-surface">
                        {pattern.description}
                      </h3>
                      <span className="px-3 py-1 bg-surface-container-high rounded-full text-sm font-semibold text-on-surface">
                        {pattern.occurrences}x
                      </span>
                    </div>
                    <div className="mb-3 text-on-surface-variant">
                      <strong>What to do:</strong> {pattern.recommendation}
                    </div>
                    <div className="text-[10px] uppercase font-black tracking-widest">
                      Severity: {pattern.severity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-green-400">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">
                  No Major Issues Detected!
                </h3>
                <p className="text-on-surface-variant">
                  Your recent battle performance looks solid. Keep it up!
                </p>
              </div>
            </div>
          )}

          {/* Expert Advice */}
          {expertAdvice.length > 0 && (
            <div className="bg-surface-container rounded-xl p-8 border border-tertiary-container/10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-tertiary">school</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Expert Coaching Tips</h3>
              </div>
              <div className="space-y-4">
                {expertAdvice.map((advice, idx) => (
                  <div key={idx} className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10">
                    <div className="text-on-surface-variant mb-3 leading-relaxed">
                      {advice.advice}
                    </div>
                    <div className="text-sm text-outline">
                      Source: {advice.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Battle History */}
          {battles.length > 0 && (
            <div className="bg-surface-container-low rounded-xl p-8 border border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-tight mb-6">
                Battle History ({battles.length} battles)
              </h3>

              {/* Column Headers */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 pb-3 border-b border-outline-variant/20">
                <div className="md:col-span-1 text-[10px] font-black uppercase tracking-widest text-outline">Result</div>
                <div className="md:col-span-2 text-[10px] font-black uppercase tracking-widest text-outline">Score</div>
                <div className="md:col-span-3 text-[10px] font-black uppercase tracking-widest text-outline">Opponent</div>
                <div className="md:col-span-2 text-[10px] font-black uppercase tracking-widest text-outline">Type</div>
                <div className="md:col-span-2 text-[10px] font-black uppercase tracking-widest text-outline">Mode</div>
                <div className="md:col-span-2 text-[10px] font-black uppercase tracking-widest text-outline">Time</div>
              </div>

              <div className="space-y-3">
                {battles.map((battle, idx) => {
                  const playerTeam = battle.team?.[0] || {};
                  const opponent = battle.opponent?.[0] || {};
                  const playerCrowns = playerTeam.crowns || 0;
                  const opponentCrowns = opponent.crowns || 0;
                  const result = playerCrowns > opponentCrowns ? 'WIN' : playerCrowns < opponentCrowns ? 'LOSS' : 'DRAW';
                  const resultColor = result === 'WIN' ? 'text-green-400' : result === 'LOSS' ? 'text-red-400' : 'text-outline';
                  const borderColor = result === 'WIN' ? 'border-l-primary' : result === 'LOSS' ? 'border-l-error-container' : 'border-l-outline';
                  const glowColor = result === 'WIN' ? 'shadow-[0_0_15px_rgba(169,199,255,0.1)]' : result === 'LOSS' ? 'shadow-[0_0_15px_rgba(147,0,10,0.1)]' : '';

                  const battleDate = battle.battleTime ? parseCRDate(battle.battleTime) : null;
                  const timeAgo = battleDate && !isNaN(battleDate.getTime()) ? getTimeAgo(battleDate) : 'Unknown';

                  return (
                    <div
                      key={idx}
                      className={`relative overflow-hidden p-4 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all duration-300 border-l-4 ${borderColor} ${glowColor} cursor-pointer group`}
                      onClick={() => setSelectedBattle(battle)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className={`md:col-span-1 text-lg font-black ${resultColor}`}>
                          {result}
                        </div>
                        <div className="md:col-span-2 text-on-surface">
                          <span className="font-semibold">{playerCrowns}</span>
                          <span className="mx-2 text-outline">-</span>
                          <span className="font-semibold">{opponentCrowns}</span>
                        </div>
                        <div className="md:col-span-3 text-sm text-on-surface-variant">
                          vs {opponent.name || 'Unknown'}
                        </div>
                        <div className="md:col-span-2">
                          {battle.type && (
                            <div className="inline-block px-2 py-1 bg-surface-container-highest rounded text-sm text-on-surface-variant">
                              {battle.type.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          {battle.gameMode?.name && (
                            <div className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                              {battle.gameMode.name}
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2 text-sm text-outline whitespace-nowrap">
                          {timeAgo}
                        </div>
                      </div>

                      {battle.team?.[0]?.trophyChange !== undefined && (
                        <div className="mt-2 text-sm">
                          <span className="text-outline">Trophy change: </span>
                          <span className={battle.team[0].trophyChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {battle.team[0].trophyChange >= 0 ? '+' : ''}{battle.team[0].trophyChange}
                          </span>
                        </div>
                      )}

                      <div className="mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Click for detailed analysis
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Battle Detail Modal */}
      {selectedBattle && (
        <BattleDetailModal
          battle={selectedBattle}
          onClose={() => setSelectedBattle(null)}
          playerTag={playerInfo?.tag}
        />
      )}
    </div>
  );
}

function parseCRDate(crDate: string): Date | null {
  if (!crDate || crDate.length < 15) return null;

  const year = crDate.substring(0, 4);
  const month = crDate.substring(4, 6);
  const day = crDate.substring(6, 8);
  const hour = crDate.substring(9, 11);
  const min = crDate.substring(11, 13);
  const sec = crDate.substring(13, 15);
  const ms = crDate.substring(15);

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

interface BattleDetailModalProps {
  battle: any;
  onClose: () => void;
  playerTag?: string;
}

function BattleDetailModal({ battle, onClose, playerTag }: BattleDetailModalProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<BattleAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState('');

  const playerTeam = battle.team?.[0] || {};
  const opponent = battle.opponent?.[0] || {};
  const playerCrowns = playerTeam.crowns || 0;
  const opponentCrowns = opponent.crowns || 0;
  const result = playerCrowns > opponentCrowns ? 'WIN' : playerCrowns < opponentCrowns ? 'LOSS' : 'DRAW';
  const resultColor = result === 'WIN' ? 'text-green-400' : result === 'LOSS' ? 'text-red-400' : 'text-outline';
  const borderColor = result === 'WIN' ? 'border-primary' : result === 'LOSS' ? 'border-error' : 'border-outline';

  const battleDate = battle.battleTime ? parseCRDate(battle.battleTime) : null;
  const timeAgo = battleDate && !isNaN(battleDate.getTime()) ? getTimeAgo(battleDate) : 'Unknown';

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisError('');

    try {
      const response = await fetch('/api/replay-analyzer/analyze-battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ battle, playerTag }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setAnalysisError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setAnalyzing(false);
    }
  };

  const getFavorabilityColor = (favorability: string) => {
    switch (favorability) {
      case 'favorable': return 'text-green-400 bg-green-500/10';
      case 'unfavorable': return 'text-red-400 bg-red-500/10';
      default: return 'text-yellow-400 bg-yellow-500/10';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-surface-container-low rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b-2 ${borderColor} sticky top-0 z-10 bg-surface-container-low`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-3xl font-black ${resultColor} mb-2`}>
                {result}
              </h2>
              <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                <span>{timeAgo}</span>
                {battle.gameMode?.name && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                    {battle.gameMode.name}
                  </span>
                )}
                {battle.type && (
                  <span className="px-2 py-1 bg-surface-container-highest rounded">
                    {battle.type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                )}
                {battle.arena?.name && (
                  <span className="text-outline">{battle.arena.name}</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-outline hover:text-on-surface text-2xl transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Battle Stats */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Player Side */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-on-surface">
                  {playerTeam.name || 'You'}
                </h3>
                <div className="text-2xl font-bold text-primary">
                  {playerCrowns}
                </div>
              </div>

              {playerTeam.trophyChange !== undefined && (
                <div className="mb-4 p-3 bg-surface-container-high rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Trophy Change</span>
                    <span className={`text-lg font-bold ${playerTeam.trophyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {playerTeam.trophyChange >= 0 ? '+' : ''}{playerTeam.trophyChange}
                    </span>
                  </div>
                  {playerTeam.startingTrophies !== undefined && (
                    <div className="text-xs text-outline mt-1">
                      Starting: {playerTeam.startingTrophies}
                    </div>
                  )}
                </div>
              )}

              {playerTeam.kingTowerHitPoints !== undefined && (
                <div className="mb-4 p-3 bg-surface-container-high rounded-lg">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tower HP</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">King Tower</span>
                      <span className={playerTeam.kingTowerHitPoints > 0 ? 'text-green-400' : 'text-red-400'}>
                        {playerTeam.kingTowerHitPoints > 0 ? `${playerTeam.kingTowerHitPoints} HP` : 'Destroyed'}
                      </span>
                    </div>
                    {playerTeam.princessTowersHitPoints?.map((hp: number, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Princess Tower {idx + 1}</span>
                        <span className={hp > 0 ? 'text-green-400' : 'text-red-400'}>
                          {hp > 0 ? `${hp} HP` : 'Destroyed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Deck Used</h4>
                <div className="grid grid-cols-4 gap-2">
                  {playerTeam.cards?.map((card: any, idx: number) => (
                    <div key={idx} className="relative group">
                      <div className="bg-surface-container-high border border-primary/20 rounded-lg p-2 shadow-md">
                        <img
                          src={card.iconUrls?.medium || '/placeholder-card.png'}
                          alt={card.name}
                          className="w-full h-auto rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-card.png';
                          }}
                        />
                        <div className="absolute top-1 right-1 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                          {card.level}
                        </div>
                      </div>
                      <div className="text-xs text-center mt-1 text-on-surface-variant truncate">
                        {card.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Opponent Side */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-on-surface">
                  {opponent.name || 'Opponent'}
                </h3>
                <div className="text-2xl font-bold text-error">
                  {opponentCrowns}
                </div>
              </div>

              {opponent.trophyChange !== undefined && (
                <div className="mb-4 p-3 bg-surface-container-high rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Trophy Change</span>
                    <span className={`text-lg font-bold ${opponent.trophyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {opponent.trophyChange >= 0 ? '+' : ''}{opponent.trophyChange}
                    </span>
                  </div>
                  {opponent.startingTrophies !== undefined && (
                    <div className="text-xs text-outline mt-1">
                      Starting: {opponent.startingTrophies}
                    </div>
                  )}
                </div>
              )}

              {opponent.kingTowerHitPoints !== undefined && (
                <div className="mb-4 p-3 bg-surface-container-high rounded-lg">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tower HP</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">King Tower</span>
                      <span className={opponent.kingTowerHitPoints > 0 ? 'text-green-400' : 'text-red-400'}>
                        {opponent.kingTowerHitPoints > 0 ? `${opponent.kingTowerHitPoints} HP` : 'Destroyed'}
                      </span>
                    </div>
                    {opponent.princessTowersHitPoints?.map((hp: number, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Princess Tower {idx + 1}</span>
                        <span className={hp > 0 ? 'text-green-400' : 'text-red-400'}>
                          {hp > 0 ? `${hp} HP` : 'Destroyed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Opponent&apos;s Deck</h4>
                <div className="grid grid-cols-4 gap-2">
                  {opponent.cards?.map((card: any, idx: number) => (
                    <div key={idx} className="relative group">
                      <div className="bg-surface-container-high border border-error/20 rounded-lg p-2 shadow-md">
                        <img
                          src={card.iconUrls?.medium || '/placeholder-card.png'}
                          alt={card.name}
                          className="w-full h-auto rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-card.png';
                          }}
                        />
                        <div className="absolute top-1 right-1 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                          {card.level}
                        </div>
                      </div>
                      <div className="text-xs text-center mt-1 text-on-surface-variant truncate">
                        {card.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Battle Info */}
          <div className="mt-6 p-4 bg-surface-container rounded-lg border border-outline-variant/10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Battle Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {battle.deckSelection && (
                <div>
                  <span className="text-outline">Deck Selection:</span>
                  <div className="font-medium text-on-surface capitalize">
                    {battle.deckSelection}
                  </div>
                </div>
              )}
              {battle.isLadderTournament !== undefined && (
                <div>
                  <span className="text-outline">Ladder Tournament:</span>
                  <div className="font-medium text-on-surface">
                    {battle.isLadderTournament ? 'Yes' : 'No'}
                  </div>
                </div>
              )}
              {playerTeam.tag && (
                <div>
                  <span className="text-outline">Your Tag:</span>
                  <div className="font-medium text-on-surface">
                    {playerTeam.tag}
                  </div>
                </div>
              )}
              {opponent.tag && (
                <div>
                  <span className="text-outline">Opponent Tag:</span>
                  <div className="font-medium text-on-surface">
                    {opponent.tag}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Section */}
          {!analysis && (
            <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-primary mb-1">
                    AI Battle Analysis
                  </h4>
                  <p className="text-sm text-on-surface-variant">
                    Get AI-powered insights on why you {result.toLowerCase() === 'win' ? 'won' : result.toLowerCase() === 'loss' ? 'lost' : 'drew'} and how to improve
                  </p>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-semibold rounded-lg transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 flex items-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">psychology</span>
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>
              {analysisError && (
                <div className="mt-4 p-3 bg-error/10 text-error rounded-lg text-sm">
                  {analysisError}
                </div>
              )}
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="mt-6 space-y-6">
              {/* Summary */}
              <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  <h4 className="text-lg font-bold text-primary">AI Battle Analysis</h4>
                </div>
                <p className="text-on-surface leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* Matchup Analysis */}
              <div className="p-6 bg-surface-container rounded-lg border border-outline-variant/10">
                <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-4">
                  Matchup Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-[10px] text-primary uppercase font-semibold mb-1">Your Deck</div>
                    <div className="font-bold text-on-surface">{analysis.matchupAnalysis.playerDeckType}</div>
                  </div>
                  <div className="text-center p-3 bg-surface-container-high rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline text-2xl">swords</span>
                  </div>
                  <div className="text-center p-3 bg-error/10 rounded-lg">
                    <div className="text-[10px] text-error uppercase font-semibold mb-1">Opponent Deck</div>
                    <div className="font-bold text-on-surface">{analysis.matchupAnalysis.opponentDeckType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-on-surface-variant">Matchup:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getFavorabilityColor(analysis.matchupAnalysis.matchupFavorability)}`}>
                    {analysis.matchupAnalysis.matchupFavorability}
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm">
                  {analysis.matchupAnalysis.explanation}
                </p>
              </div>

              {/* Key Factors */}
              {analysis.keyFactors.length > 0 && (
                <div className="p-6 bg-secondary-container/5 rounded-lg border border-secondary-container/10">
                  <h4 className="text-sm font-bold text-secondary-container uppercase tracking-tight mb-3">
                    Key Factors
                  </h4>
                  <ul className="space-y-2">
                    {analysis.keyFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-on-surface-variant text-sm">
                        <span className="text-secondary-container mt-0.5">&#8226;</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What Went Well */}
              {analysis.whatWentWell.length > 0 && (
                <div className="p-6 bg-green-500/5 rounded-lg border border-green-500/10">
                  <h4 className="text-sm font-bold text-green-400 uppercase tracking-tight mb-3">
                    What Went Well
                  </h4>
                  <ul className="space-y-2">
                    {analysis.whatWentWell.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-on-surface-variant text-sm">
                        <span className="text-green-400 mt-0.5">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What Could Improve */}
              {analysis.whatCouldImprove.length > 0 && (
                <div className="p-6 bg-error/5 rounded-lg border border-error/10">
                  <h4 className="text-sm font-bold text-error uppercase tracking-tight mb-3">
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {analysis.whatCouldImprove.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-on-surface-variant text-sm">
                        <span className="text-error mt-0.5">&rarr;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tactical Tips */}
              {analysis.tacticalTips.length > 0 && (
                <div className="p-6 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-tight mb-3">
                    Tactical Tips
                  </h4>
                  <ul className="space-y-3">
                    {analysis.tacticalTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-on-surface-variant text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Deck Doctor Recommendation */}
              <div className="p-6 bg-tertiary-container/5 rounded-lg border border-tertiary-container/10">
                <h4 className="text-sm font-bold text-tertiary uppercase tracking-tight mb-3">
                  Deck Doctor Recommendation
                </h4>
                <p className="text-on-surface-variant mb-4 text-sm leading-relaxed">
                  {analysis.deckDoctorRecommendation}
                </p>
                <a
                  href={`/deck-doctor?cards=${encodeURIComponent(playerTeam.cards?.map((c: any) => c.name).join(',') || '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary-container text-white font-semibold rounded-lg transition-colors hover:bg-tertiary-container/80"
                >
                  <span className="material-symbols-outlined text-sm">healing</span>
                  Open Deck Doctor
                </a>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            {!analysis && (
              <a
                href={`/deck-doctor?cards=${encodeURIComponent(playerTeam.cards?.map((c: any) => c.name).join(',') || '')}`}
                className="px-6 py-3 bg-tertiary-container text-white font-semibold rounded-lg transition-colors hover:bg-tertiary-container/80"
              >
                Analyze Your Deck
              </a>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-surface-container-high text-on-surface font-semibold rounded-lg transition-colors hover:bg-surface-container-highest"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
