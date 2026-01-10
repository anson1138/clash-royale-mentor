#!/usr/bin/env node

/**
 * Counter Guide Strategy Update Script
 * 
 * This script helps maintain and update the counter strategies database
 * for the Clash Royale Mentor application.
 * 
 * Usage:
 *   node scripts/updateCounterStrategies.mjs [command]
 * 
 * Commands:
 *   verify   - Verify all cards have counter strategies
 *   stats    - Show statistics about coverage
 *   missing  - List cards without counter strategies
 *   export   - Export strategies to JSON for review
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load data
const cardsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/royaleapi/cards.json'), 'utf-8')
);

// Load strategies from the TypeScript file (we'll parse it)
const strategiesFile = fs.readFileSync(
  path.join(__dirname, '../lib/counterGuide/strategies.ts'),
  'utf-8'
);

// Extract counter strategy keys from the COUNTER_STRATEGIES object
function extractCounterStrategyKeys(content) {
  const keys = [];
  const regex = /['"]([a-z0-9-]+)['"]\s*:\s*\{[\s\S]*?targetCard:/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.push(match[1]);
  }
  return keys;
}

const counterStrategyKeys = new Set(extractCounterStrategyKeys(strategiesFile));

function normalizeCardName(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Cards that typically don't need counter strategies (spirits, cycle cards, etc.)
const SKIP_CARDS = new Set([
  'tower-princess',
  'cannoneer',
  'royal-chef',
  'dagger-duchess',
  'mirror', // Mirror is situational
  'clone', // Clone doesn't attack
]);

// Priority cards that MUST have counter strategies (meta cards)
const PRIORITY_CARDS = new Set([
  'hog-rider',
  'mega-knight',
  'balloon',
  'golem',
  'x-bow',
  'royal-giant',
  'goblin-barrel',
  'graveyard',
  'electro-giant',
  'sparky',
  'lava-hound',
  'pekka',
  'prince',
  'ram-rider',
  'miner',
  'archer-queen',
  'golden-knight',
  'skeleton-king',
  'monk',
  'phoenix',
  'little-prince',
]);

function verifyStrategies() {
  console.log('🔍 Verifying Counter Strategies...\n');

  const missingPriority = [];
  const missingOther = [];
  const covered = [];

  const playableCards = cardsData.filter(
    (card) =>
      card.type !== 'tower' &&
      !SKIP_CARDS.has(card.key) &&
      typeof card.elixir === 'number' &&
      card.elixir > 0
  );

  for (const card of playableCards) {
    const normalized = normalizeCardName(card.name);

    if (counterStrategyKeys.has(normalized)) {
      covered.push(card.name);
    } else if (PRIORITY_CARDS.has(card.key)) {
      missingPriority.push(card.name);
    } else {
      missingOther.push(card.name);
    }
  }

  const coveragePercent = Math.round((covered.length / playableCards.length) * 100);
  console.log(`✅ Coverage: ${covered.length}/${playableCards.length} cards (${coveragePercent}%)\n`);

  if (missingPriority.length > 0) {
    console.log('⚠️  PRIORITY cards missing counter strategies:');
    missingPriority.forEach((card) => console.log(`   - ${card}`));
    console.log();
  } else {
    console.log('✅ All priority cards have counter strategies!\n');
  }

  if (missingOther.length > 0) {
    console.log(`ℹ️  Other cards without strategies (${missingOther.length}):`);
    // Show first 10, then count
    missingOther.slice(0, 10).forEach((card) => console.log(`   - ${card}`));
    if (missingOther.length > 10) {
      console.log(`   ... and ${missingOther.length - 10} more`);
    }
    console.log();
  }
}

function showStats() {
  console.log('📊 Counter Guide Statistics\n');

  const counterCards = Array.from(counterStrategyKeys);
  const totalCounters = counterCards.length;

  console.log(`Total cards with strategies: ${totalCounters}\n`);

  // Parse counter details from the file
  const counterCardUsage = new Map();
  const regex = /card:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(strategiesFile)) !== null) {
    const card = match[1];
    counterCardUsage.set(card, (counterCardUsage.get(card) || 0) + 1);
  }

  console.log('Top 15 most recommended counter cards:');
  Array.from(counterCardUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([card, count], idx) => {
      const bar = '█'.repeat(Math.floor(count / 2));
      console.log(`  ${(idx + 1).toString().padStart(2)}. ${card.padEnd(20)} ${bar} (${count}x)`);
    });
  console.log();
}

function listMissing() {
  console.log('📝 Cards Missing Counter Strategies\n');

  const playableCards = cardsData.filter(
    (card) =>
      card.type !== 'tower' &&
      !SKIP_CARDS.has(card.key) &&
      typeof card.elixir === 'number' &&
      card.elixir > 0
  );

  const missing = playableCards.filter(
    (card) => !counterStrategyKeys.has(normalizeCardName(card.name))
  );

  console.log('Priority cards (should have strategies):');
  const priorityMissing = missing.filter((card) => PRIORITY_CARDS.has(card.key));
  if (priorityMissing.length === 0) {
    console.log('  ✅ None! All priority cards covered.\n');
  } else {
    priorityMissing.forEach((card) => {
      console.log(`  - ${card.name} (${card.elixir} elixir, ${card.type})`);
    });
    console.log();
  }

  console.log('Other cards:');
  const otherMissing = missing.filter((card) => !PRIORITY_CARDS.has(card.key));
  otherMissing.forEach((card) => {
    console.log(`  - ${card.name} (${card.elixir} elixir, ${card.type})`);
  });

  console.log(`\nTotal missing: ${missing.length}/${playableCards.length}`);
}

function exportStrategies() {
  const outputPath = path.join(__dirname, '../data/counter-strategies-export.json');

  const exportData = {
    generated: new Date().toISOString(),
    version: '2026.1',
    totalCards: counterStrategyKeys.size,
    coveredCards: Array.from(counterStrategyKeys).sort(),
    note: 'This is an export of covered cards. See lib/counterGuide/strategies.ts for full strategies.',
  };

  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

  const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`✅ Exported strategy metadata to: ${outputPath}`);
  console.log(`   Total cards: ${exportData.totalCards}`);
  console.log(`   File size: ${sizeKB} KB`);
}

function showHelp() {
  console.log(`
Counter Strategy Update Tool
=============================

Usage: node scripts/updateCounterStrategies.mjs [command]

Commands:
  verify   - Verify all important cards have counter strategies
  stats    - Show statistics about coverage and usage
  missing  - List all cards without counter strategies
  export   - Export strategies to JSON file for review
  help     - Show this help message

Examples:
  node scripts/updateCounterStrategies.mjs verify
  node scripts/updateCounterStrategies.mjs stats
  node scripts/updateCounterStrategies.mjs missing
  node scripts/updateCounterStrategies.mjs export

Tips:
  - Run 'verify' before deploying to ensure priority cards are covered
  - Run 'stats' to see which counter cards are most recommended
  - Run 'export' to create a backup or review in other tools
  - The counter strategies are defined in lib/counterGuide/strategies.ts
  `);
}

// Main execution
const command = process.argv[2] || 'help';

switch (command) {
  case 'verify':
    verifyStrategies();
    break;
  case 'stats':
    showStats();
    break;
  case 'missing':
    listMissing();
    break;
  case 'export':
    exportStrategies();
    break;
  case 'help':
  default:
    showHelp();
    break;
}
