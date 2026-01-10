interface Battle {
  type: string;
  battleTime: string;
  team: any[];
  opponent: any[];
  deckSelection?: string;
}

export interface BattlePattern {
  pattern: string;
  description: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
  occurrences: number;
}

/**
 * Analyze a player's battle log to find patterns and mistakes
 */
export function analyzeBattles(battles: Battle[]): BattlePattern[] {
  const patterns: BattlePattern[] = [];
  
  if (!battles || battles.length === 0) {
    return patterns;
  }
  
  // Pattern 1: Current loss streak (only report if player is currently on a losing streak)
  // Check most recent battles (battles array is newest first)
  let currentLossStreak = 0;
  
  for (const battle of battles) {
    const playerTeam = battle.team[0];
    const result = playerTeam.crowns > battle.opponent[0].crowns ? 'win' : 'loss';
    
    if (result === 'loss') {
      currentLossStreak++;
    } else {
      // Hit a win, stop counting - we only care about CURRENT streak
      break;
    }
  }
  
  // Only report if currently on a 3+ loss streak
  if (currentLossStreak >= 3) {
    patterns.push({
      pattern: 'loss_streak',
      description: `You lost ${currentLossStreak} battles in a row`,
      recommendation: 'Take a break! Tilt can make you play poorly. Come back with a fresh mindset.',
      severity: 'high',
      occurrences: currentLossStreak,
    });
  }
  
  // Pattern 2: Same archetype losses
  const lossArchetypes: Record<string, number> = {};
  
  for (const battle of battles) {
    const playerTeam = battle.team[0];
    const opponentTeam = battle.opponent[0];
    const result = playerTeam.crowns > opponentTeam.crowns ? 'win' : 'loss';
    
    if (result === 'loss') {
      // Simple archetype detection based on deck selection
      const archetype = battle.deckSelection || 'unknown';
      lossArchetypes[archetype] = (lossArchetypes[archetype] || 0) + 1;
    }
  }
  
  for (const [archetype, count] of Object.entries(lossArchetypes)) {
    if (count >= 3) {
      patterns.push({
        pattern: 'archetype_weakness',
        description: `Lost ${count} times against ${archetype} decks`,
        recommendation: `Study how to counter ${archetype}. Check the Counter Guide for specific matchup tips.`,
        severity: 'medium',
        occurrences: count,
      });
    }
  }
  
  // Pattern 3: Low crown wins (suggests passive play)
  let oneCrownWins = 0;
  let totalWins = 0;
  
  for (const battle of battles) {
    const playerTeam = battle.team[0];
    const result = playerTeam.crowns > battle.opponent[0].crowns ? 'win' : 'loss';
    
    if (result === 'win') {
      totalWins++;
      if (playerTeam.crowns === 1) {
        oneCrownWins++;
      }
    }
  }
  
  if (totalWins > 0 && oneCrownWins / totalWins > 0.7) {
    patterns.push({
      pattern: 'passive_wins',
      description: `${Math.round(oneCrownWins / totalWins * 100)}% of your wins are 1-crown victories`,
      recommendation: 'You\'re playing too defensively. After a successful defense, counter-push aggressively for more crowns.',
      severity: 'low',
      occurrences: oneCrownWins,
    });
  }
  
  // Pattern 4: High-loss rate (overall performance)
  const totalBattles = battles.length;
  const losses = battles.filter(b => {
    const playerTeam = b.team[0];
    const opponentTeam = b.opponent[0];
    return playerTeam.crowns < opponentTeam.crowns;
  }).length;
  
  const lossRate = losses / totalBattles;
  
  if (lossRate > 0.6) {
    patterns.push({
      pattern: 'high_loss_rate',
      description: `You've lost ${Math.round(lossRate * 100)}% of your recent battles`,
      recommendation: 'Your deck might not be working. Try the Deck Doctor to analyze and improve your deck composition.',
      severity: 'high',
      occurrences: losses,
    });
  }
  
  return patterns.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}
