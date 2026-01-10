"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeDeck = analyzeDeck;
const cardDatabase_1 = require("./cardDatabase");
/**
 * Analyze a deck of 8 cards and return a grade with feedback
 */
function analyzeDeck(cardNames) {
    if (cardNames.length !== 8) {
        throw new Error('Deck must contain exactly 8 cards');
    }
    const cards = cardNames.map(name => (0, cardDatabase_1.getCardInfo)(name)).filter(Boolean);
    if (cards.length !== cardNames.length) {
        const unknownCards = cardNames.filter(name => !(0, cardDatabase_1.getCardInfo)(name));
        throw new Error(`Unknown cards: ${unknownCards.join(', ')}`);
    }
    const issues = [];
    const strengths = [];
    const recommendations = [];
    const checkResults = {};
    // Calculate average elixir
    const avgElixir = cards.reduce((sum, card) => sum + card.elixir, 0) / cards.length;
    let score = 100; // Start at perfect score, deduct points for issues
    // Check 1: Win Condition
    const winConditions = cards.filter(c => c.roles.includes(cardDatabase_1.CARD_ROLES.WIN_CONDITION));
    if (winConditions.length === 0) {
        checkResults.winCondition = {
            passed: false,
            message: 'No win condition detected. You need a card that reliably targets buildings.',
            severity: 'critical',
        };
        issues.push('Missing win condition');
        recommendations.push('Add a win condition like Hog Rider, Goblin Barrel, or Balloon');
        score -= 30;
    }
    else {
        checkResults.winCondition = {
            passed: true,
            message: `Win condition: ${winConditions.map(c => c.name).join(', ')}`,
            severity: 'minor',
        };
        strengths.push(`Has ${winConditions.length} win condition(s)`);
    }
    // Check 2: Two-Spell Standard
    const smallSpells = cards.filter(c => c.roles.includes(cardDatabase_1.CARD_ROLES.SPELL_SMALL));
    const bigSpells = cards.filter(c => c.roles.includes(cardDatabase_1.CARD_ROLES.SPELL_BIG));
    const totalSpells = smallSpells.length + bigSpells.length;
    if (totalSpells === 0) {
        checkResults.spells = {
            passed: false,
            message: 'No spells. You need at least a small spell to deal with swarms.',
            severity: 'critical',
        };
        issues.push('No spells');
        recommendations.push('Add Zap or Arrows for swarms, and Fireball or Poison for medium troops');
        score -= 25;
    }
    else if (smallSpells.length === 0) {
        checkResults.spells = {
            passed: false,
            message: 'Missing small spell (2-3 elixir) to counter swarms quickly.',
            severity: 'major',
        };
        issues.push('No small spell');
        recommendations.push('Add Zap, Arrows, or Log to counter Skeleton Army and Goblin Gang');
        score -= 15;
    }
    else if (bigSpells.length === 0) {
        checkResults.spells = {
            passed: false,
            message: 'Missing big spell (4+ elixir) for area damage and finishing towers.',
            severity: 'major',
        };
        issues.push('No big spell');
        recommendations.push('Add Fireball or Poison to punish clumped troops');
        score -= 15;
    }
    else {
        checkResults.spells = {
            passed: true,
            message: `Balanced spell coverage: ${smallSpells.length} small, ${bigSpells.length} big`,
            severity: 'minor',
        };
        strengths.push('Two-spell standard met');
    }
    // Check 3: Average Elixir Cost
    if (avgElixir > 4.5) {
        checkResults.elixirCost = {
            passed: false,
            message: `Average elixir (${avgElixir.toFixed(1)}) is too high. You'll struggle in single elixir.`,
            severity: 'critical',
        };
        issues.push('Deck too heavy');
        recommendations.push('Replace expensive cards with cheaper alternatives (aim for 3.0-4.0 average)');
        score -= 20;
    }
    else if (avgElixir > 4.0) {
        checkResults.elixirCost = {
            passed: false,
            message: `Average elixir (${avgElixir.toFixed(1)}) is slightly high. Consider cheaper options.`,
            severity: 'minor',
        };
        issues.push('Deck slightly heavy');
        score -= 5;
    }
    else if (avgElixir < 2.5) {
        checkResults.elixirCost = {
            passed: false,
            message: `Average elixir (${avgElixir.toFixed(1)}) is too low. May lack defensive power.`,
            severity: 'minor',
        };
        issues.push('Deck very light');
        score -= 5;
    }
    else {
        checkResults.elixirCost = {
            passed: true,
            message: `Average elixir (${avgElixir.toFixed(1)}) is in the optimal range (3.0-4.0)`,
            severity: 'minor',
        };
        strengths.push('Optimal elixir cost');
    }
    // Check 4: Air Defense
    const airDefense = cards.filter(c => c.roles.includes(cardDatabase_1.CARD_ROLES.AIR_DEFENSE) ||
        c.targets === 'both' ||
        c.targets === 'air');
    if (airDefense.length === 0) {
        checkResults.airDefense = {
            passed: false,
            message: 'No air defense! Balloon and Lava Hound will destroy you.',
            severity: 'critical',
        };
        issues.push('No air counters');
        recommendations.push('Add Musketeer, Electro Wizard, or Mega Minion for air defense');
        score -= 30;
    }
    else if (airDefense.length < 2) {
        checkResults.airDefense = {
            passed: false,
            message: 'Only one air defense unit. Add backup for heavy air decks.',
            severity: 'major',
        };
        issues.push('Weak air defense');
        recommendations.push('Add a second air-targeting troop for reliability');
        score -= 10;
    }
    else {
        checkResults.airDefense = {
            passed: true,
            message: `Solid air defense: ${airDefense.map(c => c.name).join(', ')}`,
            severity: 'minor',
        };
        strengths.push('Strong air defense');
    }
    // Check 5: Tank Killer
    const tankKillers = cards.filter(c => c.roles.includes(cardDatabase_1.CARD_ROLES.TANK_KILLER));
    const buildings = cards.filter(c => c.roles.includes(cardDatabase_1.CARD_ROLES.BUILDING));
    if (tankKillers.length === 0 && buildings.length === 0) {
        checkResults.tankKiller = {
            passed: false,
            message: 'No high-DPS units or buildings. Tanks like Golem will overwhelm you.',
            severity: 'major',
        };
        issues.push('No tank killer');
        recommendations.push('Add Mini P.E.K.K.A, Inferno Dragon, or Inferno Tower');
        score -= 15;
    }
    else {
        checkResults.tankKiller = {
            passed: true,
            message: 'Has tank-killing capability',
            severity: 'minor',
        };
        strengths.push('Can handle tanks');
    }
    // Check 6: Role Redundancy
    const roleCount = {};
    cards.forEach(card => {
        card.roles.forEach(role => {
            roleCount[role] = (roleCount[role] || 0) + 1;
        });
    });
    const redundantRoles = Object.entries(roleCount)
        .filter(([role, count]) => count > 3 && role === cardDatabase_1.CARD_ROLES.SPLASH)
        .map(([role]) => role);
    if (redundantRoles.length > 0) {
        checkResults.redundancy = {
            passed: false,
            message: 'Too many cards doing the same job. Diversify your roles.',
            severity: 'minor',
        };
        issues.push('Redundant roles');
        recommendations.push('Replace one splash unit with a cycle card or different role');
        score -= 10;
    }
    else {
        checkResults.redundancy = {
            passed: true,
            message: 'Balanced role distribution',
            severity: 'minor',
        };
    }
    // Determine grade based on score
    let grade;
    if (score >= 90)
        grade = 'S';
    else if (score >= 80)
        grade = 'A';
    else if (score >= 70)
        grade = 'B';
    else if (score >= 60)
        grade = 'C';
    else if (score >= 50)
        grade = 'D';
    else
        grade = 'F';
    return {
        grade,
        score: Math.max(0, score),
        avgElixir: Number(avgElixir.toFixed(2)),
        issues,
        strengths,
        recommendations,
        checkResults,
    };
}
