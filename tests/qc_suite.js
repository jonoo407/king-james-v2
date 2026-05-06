// King James 2 — QC Suite
// Runs in Node via a minimal browser shim, loads all engine + data scripts,
// then executes a battery of tests:
//   A) Registry integrity (orphan refs, unknown effect types, scene graph)
//   B) Balance sims — 3 player archetypes vs Forest + Mountain battles
//   C) Edge-case bug hunt (treasure bonuses, gear swap, KO rescue, Pompadour, pending levelups, speaker coverage)
//
// Usage (from repo root): node tests/qc_suite.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ---------------- Browser shim ----------------
const _localStore = {};
const shim = {
  console,
  window: {},
  localStorage: {
    getItem: k => _localStore[k] || null,
    setItem: (k, v) => { _localStore[k] = v; },
    removeItem: k => { delete _localStore[k]; },
  },
  document: {
    getElementById: () => ({ innerHTML: '', appendChild(){}, classList:{add(){}, remove(){}}, style:{}, offsetWidth:0, getBoundingClientRect(){return{left:0,top:0,width:0,height:0}} }),
    createElement: () => ({ style: {}, classList: {add(){}, remove(){}}, appendChild(){}, remove(){}, addEventListener(){} }),
    body: { appendChild(){} },
    head: { appendChild(){} },
    addEventListener(){},
  },
  setTimeout: (fn, ms) => ({ ref(){}, unref(){} }),
  clearTimeout: () => {},
  fetch: () => Promise.reject(new Error('fetch not available in test shim')),
  Audio: function () { return { volume: 0, play: () => Promise.resolve(), pause(){}, currentTime: 0 }; },
  Math, JSON, Date, Promise,
};
shim.window = shim; // self-ref so `window.KJ` works
shim.global = shim;

const ctx = vm.createContext(shim);

// ---------------- Load files in index.html order ----------------
const ROOT = path.resolve(__dirname, '..');
const scripts = [
  'engine/constants.js',
  'engine/events.js',
  'engine/registry.js',
  'engine/state.js',
  'engine/audio.js',
  'engine/effects.js',
  'engine/scene.js',
  'engine/combat.js',
  'engine/ui/hud.js',
  'engine/ui/castle.js',
  'engine/ui/map.js',
  'engine/ui/character.js',
  'engine/ui/gear-chest.js',
  'engine/ui/ally-room.js',
  'engine/ui/trophy-hall.js',
  'engine/ui/levelup.js',
  'engine/ui/library.js',
  'engine/ui/choice.js',
  'engine/ui/dialogue.js',
  'engine/ui/puzzle.js',
  'engine/ui/battle.js',
  'data/types.js',
  'data/moves.js',
  'data/gear.js',
  'data/allies.js',
  'data/enemies.js',
  'data/treasures.js',
  'data/regions.js',
  'data/traits.js',
  'data/badges.js',
  'data/crown-dialogue.js',
  'data/scrolls.js',
  'data/quests/intro.js',
  'data/quests/forest.js',
  'data/quests/mountain.js',
  'data/quests/beach.js',
  'data/quests/desert.js',
  'data/quests/volcano.js',
];

for (const rel of scripts) {
  const p = path.join(ROOT, rel);
  const code = fs.readFileSync(p, 'utf8');
  try {
    vm.runInContext(code, ctx, { filename: rel });
  } catch (e) {
    console.error('LOAD FAILED:', rel, e.message);
    process.exit(1);
  }
}

const KJ = ctx.KJ;

// ---------------- Test infra ----------------
const results = { pass: 0, fail: 0, warn: 0, sections: [] };
function section(name) {
  const s = { name, items: [] };
  results.sections.push(s);
  return s;
}
function check(sec, label, ok, detail) {
  if (ok) {
    sec.items.push({ level: 'pass', label });
    results.pass++;
  } else {
    sec.items.push({ level: 'fail', label, detail });
    results.fail++;
  }
}
function warn(sec, label, detail) {
  sec.items.push({ level: 'warn', label, detail });
  results.warn++;
}

// ==================================================================
// A) REGISTRY / DATA INTEGRITY
// ==================================================================
const A = section('A. Registry & scene-graph integrity');

// Declarative effect types the engine understands (from scene.js EFFECTS table).
const KNOWN_EFFECTS = new Set([
  'damage_party','heal_party','grant_gear','grant_gold','grant_charms',
  'consume_charm','grant_scroll','recruit_ally','mark_met_ally',
  'grant_treasure','unlock_room','grant_trophy','set_flag','complete_quest',
  'grant_sparks',
  'grant_xp',
]);

const KNOWN_CONDITIONS = new Set([
  'has_gear','ally_in_party','ally_recruited','treasure_owned',
  'flag_set','flag_not_set','level_at_least','gold_at_least','charms_at_least',
  'volcano_can_listen',
]);

// Collect all scenes across all quests
const allScenes = new Map();
for (const q of KJ.Registry.quests.all()) {
  for (const s of q.scenes || []) {
    if (allScenes.has(s.id)) {
      check(A, `unique scene id: ${s.id}`, false, 'duplicate scene id across quests');
    } else {
      allScenes.set(s.id, { ...s, _quest: q.id });
    }
  }
}
check(A, `scenes loaded`, allScenes.size > 0, `count=${allScenes.size}`);

// Walk every scene — verify all `next`/`onDefeat`/choice.next resolve
function isKnownDestination(id) {
  return id === 'castle' || allScenes.has(id);
}

let brokenRefs = 0, badEffects = 0, badConds = 0, brokenEnemyRefs = 0, brokenGearRefs = 0, brokenAllyRefs = 0;
const brokenDetails = [];

for (const s of allScenes.values()) {
  const refs = [];
  if (s.next) refs.push(['next', s.next]);
  if (s.onDefeat) refs.push(['onDefeat', s.onDefeat]);
  if (s.choices) for (const c of s.choices) if (c.next) refs.push([`choice:${c.label}`, c.next]);
  for (const [tag, id] of refs) {
    if (!isKnownDestination(id)) {
      brokenRefs++;
      brokenDetails.push(`${s.id} ${tag} -> ${id} (UNKNOWN)`);
    }
  }

  // Effect validation
  const effectLists = [];
  if (s.effects) effectLists.push(s.effects);
  if (s.choices) for (const c of s.choices) if (c.effects) effectLists.push(c.effects);
  if (s.onSolveAllNoHints) effectLists.push(s.onSolveAllNoHints);
  for (const lst of effectLists) {
    for (const ef of lst) {
      if (!KNOWN_EFFECTS.has(ef.type)) {
        badEffects++;
        brokenDetails.push(`${s.id} unknown effect: ${ef.type}`);
      }
      // spot-check the referenced ids
      if (ef.type === 'grant_gear' && !KJ.Registry.gear.has(ef.id)) { brokenGearRefs++; brokenDetails.push(`${s.id} grant_gear unknown: ${ef.id}`); }
      if (ef.type === 'grant_treasure' && !KJ.Registry.treasures.has(ef.id)) brokenDetails.push(`${s.id} grant_treasure unknown: ${ef.id}`);
      if (ef.type === 'recruit_ally' && !KJ.Registry.allies.has(ef.id)) { brokenAllyRefs++; brokenDetails.push(`${s.id} recruit_ally unknown: ${ef.id}`); }
      if (ef.type === 'mark_met_ally' && !KJ.Registry.allies.has(ef.id)) { brokenAllyRefs++; brokenDetails.push(`${s.id} mark_met_ally unknown: ${ef.id}`); }
      if (ef.type === 'grant_scroll' && !KJ.Registry.scrolls.has(ef.id)) { brokenDetails.push(`${s.id} grant_scroll unknown: ${ef.id}`); }
    }
  }

  // Condition validation
  if (s.choices) for (const c of s.choices) if (c.condition) {
    if (!KNOWN_CONDITIONS.has(c.condition.type)) {
      badConds++;
      brokenDetails.push(`${s.id} unknown condition: ${c.condition.type}`);
    }
  }

  // Battle scene: enemy refs exist + have moves that exist
  if (s.type === 'battle') {
    for (const eid of s.enemies || []) {
      if (!KJ.Registry.enemies.has(eid)) { brokenEnemyRefs++; brokenDetails.push(`${s.id} enemy missing: ${eid}`); }
    }
    for (const d of (s.rewards && s.rewards.drops) || []) {
      if (d.gear && !KJ.Registry.gear.has(d.gear)) { brokenGearRefs++; brokenDetails.push(`${s.id} drop gear missing: ${d.gear}`); }
    }
  }
}
check(A, `no broken scene refs`, brokenRefs === 0, brokenDetails.filter(x=>x.includes('UNKNOWN')).join(' | '));
check(A, `no unknown effect types`, badEffects === 0, brokenDetails.filter(x=>x.includes('unknown effect')).join(' | '));
check(A, `no unknown condition types`, badConds === 0, brokenDetails.filter(x=>x.includes('unknown condition')).join(' | '));
check(A, `enemy refs valid in all battles`, brokenEnemyRefs === 0, brokenDetails.filter(x=>x.includes('enemy missing')).join(' | '));
check(A, `gear refs valid`, brokenGearRefs === 0, brokenDetails.filter(x=>x.includes('gear')).join(' | '));
check(A, `ally refs valid`, brokenAllyRefs === 0, brokenDetails.filter(x=>x.includes('ally unknown')).join(' | '));

// Every enemy move exists
let badEnemyMoves = 0; const badMoveDetails = [];
for (const e of KJ.Registry.enemies.all()) {
  for (const m of e.moves || []) {
    if (!KJ.Registry.moves.has(m)) { badEnemyMoves++; badMoveDetails.push(`${e.id}: move ${m}`); }
  }
}
check(A, `enemy moves all exist`, badEnemyMoves === 0, badMoveDetails.join(', '));

// Every gear move exists + slot is valid
let badGearMoves = 0, badGearSlots = 0;
for (const g of KJ.Registry.gear.all()) {
  if (g.move && !KJ.Registry.moves.has(g.move)) badGearMoves++;
  if (!KJ.GEAR_SLOTS.includes(g.slot)) badGearSlots++;
}
check(A, `gear moves all exist`, badGearMoves === 0);
check(A, `gear slots all valid`, badGearSlots === 0);

// Every ally learnset move exists
let badAllyMoves = 0;
for (const a of KJ.Registry.allies.all()) {
  for (const e of a.learnset || []) if (!KJ.Registry.moves.has(e.move)) badAllyMoves++;
}
check(A, `ally learnset moves exist`, badAllyMoves === 0);

// Every treasure.jamesBonus.addMove exists
let badTreasureMoves = 0;
for (const t of KJ.Registry.treasures.all()) {
  const m = t.jamesBonus && t.jamesBonus.addMove;
  if (m && !KJ.Registry.moves.has(m)) badTreasureMoves++;
}
check(A, `treasure addMove ids exist`, badTreasureMoves === 0);

// Speaker coverage — Rule 6.3
const speakerDisplayMap = {
  crown:1,james:1,narrator:1,foxy:1,ribbit:1,owlette:1,gus:1,
  frostbeard:1,yeti:1,wraith:1,pompadour:1,mornox:1,
  finn:1,drifter:1,joon:1,sirena:1,zephyra:1,widow:1,
};
const unknownSpeakers = new Set();
for (const s of allScenes.values()) {
  if (s.type !== 'dialogue') continue;
  for (const b of s.beats || []) if (b.speaker && !speakerDisplayMap[b.speaker]) unknownSpeakers.add(b.speaker);
}
check(A, `all dialogue speakers in speakerDisplay (Rule 6.3)`, unknownSpeakers.size === 0, [...unknownSpeakers].join(', '));

// Rule 1.2 — every kid-accessible move has a vulnerable enemy in the game
const kidMoves = new Set();
// Starter + Forest tier2 + Mountain tier3 gear moves (realistic v1 reach)
for (const g of KJ.Registry.gear.all()) if (g.tier <= 3 && g.move) kidMoves.add(g.move);
// Starter baseline James has these always via starter gear; ally move coverage too
for (const a of KJ.Registry.allies.all()) for (const l of a.learnset||[]) if (l.level<=3) kidMoves.add(l.move);
const homeless = [];
for (const mid of kidMoves) {
  const m = KJ.Registry.moves.get(mid);
  if (!m || m.heal) continue;
  const found = KJ.Registry.enemies.all().some(e => KJ.Types.effectiveness(m.type, e.type) >= 2);
  if (!found) homeless.push(`${mid} (${m.type})`);
}
if (homeless.length === 0) check(A, `every kid move has a super-effective target (Rule 1.2)`, true);
else {
  // Real v1 gap: game has no FIRE enemies — water moves are homeless.
  // The shipped arcs (Forest+Mountain) need at least one fire-type enemy to satisfy Rule 1.2.
  // Keeping as FAIL because DESIGN_LESSONS Rule 1.2 is load-bearing.
  check(A, `every kid move has a super-effective target (Rule 1.2) — FIX: add a fire-type enemy somewhere in v1 scope`,
        false, 'homeless moves: ' + homeless.join(', '));
}

// Rule 1.1 — every battle-arc covers ≥3 types; Rule 1.3 — ≥1 mixed-type battle
for (const q of KJ.Registry.quests.all()) {
  if (!['forest','mountain'].includes(q.id)) continue;
  const types = new Set();
  let mixedBattles = 0;
  for (const s of q.scenes) if (s.type === 'battle') {
    const battleTypes = new Set();
    for (const eid of s.enemies) {
      const e = KJ.Registry.enemies.get(eid);
      if (e) { types.add(e.type); battleTypes.add(e.type); }
    }
    if (battleTypes.size >= 2) mixedBattles++;
  }
  check(A, `arc "${q.id}" covers ≥3 elemental types (Rule 1.1)`, types.size >= 3, `types: ${[...types].join(',')}`);
  check(A, `arc "${q.id}" has ≥1 mixed-type battle (Rule 1.3)`, mixedBattles >= 1, `mixed count=${mixedBattles}`);
}

// Rule 5.3 — no hardcoded enemy `weak`/`strong` fields (should be derived from type chart)
let hardcodedWeakness = 0;
for (const e of KJ.Registry.enemies.all()) {
  if (Array.isArray(e.weak) || Array.isArray(e.strong)) hardcodedWeakness++;
}
check(A, `enemy cards derive weak/strong from chart (not hardcoded) (Rule 5.3)`, hardcodedWeakness === 0);

// Rule 2.3 — every boss has a pre-fight prep scene (check: battle onDefeat points back to intro AND there's a dialogue or choice scene immediately before)
const BOSSES = { forest: 'forest_troll_fight', mountain: 'mountain_wraith' };
for (const [arc, bossId] of Object.entries(BOSSES)) {
  // Find scenes whose `next` (or choice.next) lands on bossId
  let hasPrep = false;
  for (const s of allScenes.values()) {
    if (s._quest !== arc) continue;
    const nexts = [];
    if (s.next) nexts.push(s.next);
    if (s.choices) for (const c of s.choices) if (c.next) nexts.push(c.next);
    if (nexts.includes(bossId) && (s.type === 'choice' || s.type === 'dialogue')) {
      hasPrep = true; break;
    }
  }
  check(A, `arc "${arc}" boss has pre-fight prep scene (Rule 2.3)`, hasPrep);
}

// ==================================================================
// B) BALANCE SIMS — 3 archetypes
// ==================================================================
const B = section('B. Balance sims (3 archetypes × battles)');

// Clone an enemy combatant by id (fresh HP every battle)
function makeEnemy(id, index=0) {
  const def = KJ.Registry.enemies.get(id);
  return {
    side:'enemy', id: id+'_'+index, speciesId: id,
    name: def.name, emoji: def.emoji, type: def.type,
    stats: { ...def.stats }, maxHP: def.stats.hp,
    moves: def.moves.slice(), behavior: def.behavior,
    _moveCursor: 0,
  };
}

// Build James as a combatant given a stat snapshot & move pool
function makeJames({ level=1, bonusStats={}, extraMoves=[] }={}) {
  // Base starter stats + starter gear (wooden_sword/cloth_vest/plain_stone/old_boots)
  // base: hp 20 atk 5 def 3 spd 4; gear stats: wooden_sword atk+2, cloth_vest def+1, plain_stone hp+1, old_boots spd+1
  const stats = {
    hp: 20 + 1 + (bonusStats.hp||0),
    atk: 5 + 2 + (bonusStats.atk||0),
    def: 3 + 1 + (bonusStats.def||0),
    spd: 4 + 1 + (bonusStats.spd||0),
  };
  // Level scaling: +2 hp, +1 atk/def/spd per level after 1 (approx)
  for (let i=1;i<level;i++){ stats.hp+=3; stats.atk+=1; stats.def+=1; if (i%2===0) stats.spd+=1; }
  return {
    side:'player', id:'james', name:'James', emoji:'🧒', type:'earth',
    stats, maxHP: stats.hp,
    moves: ['swing','brace','spark','kick',...extraMoves],
  };
}
function makeAlly(id, level=1) {
  const a = KJ.Registry.allies.get(id);
  const grow = level - 1;
  const stats = {
    hp: a.baseStats.hp + grow*2,
    atk: a.baseStats.atk + Math.floor(grow*1.2),
    def: a.baseStats.def + Math.floor(grow*0.8),
    spd: a.baseStats.spd + Math.floor(grow*0.6),
  };
  return {
    side:'player', id:id, name:a.name, emoji:a.emoji, type:a.type,
    stats, maxHP: stats.hp,
    moves: (a.learnset||[]).filter(l=>l.level<=level).map(l=>l.move),
  };
}

// Archetypes: pick a move id given combatant state and current targets
// Uses preview (deterministic) to mimic what the kid sees via the UI.
const ARCH = {
  mash(self, enemies) {
    // TRUE mash: type-blind. Picks highest RAW power attack move (ignores effectiveness).
    // Auto-targets first alive enemy (like a kid who hammers the button without reading cards).
    const tgt = enemies.find(e => e.stats.hp > 0);
    let best = null;
    for (const mid of self.moves) {
      const m = KJ.Registry.moves.get(mid);
      if (!m || m.heal) continue;
      if (!best || m.power > best.power) best = { moveId: mid, targetId: tgt.id, power: m.power };
    }
    return best;
  },
  smart(self, enemies) {
    // For each enemy alive, compute best move+target by preview; pick highest.
    let best = null;
    for (const e of enemies) if (e.stats.hp > 0) {
      for (const mid of self.moves) {
        const m = KJ.Registry.moves.get(mid);
        if (!m || m.heal) continue;
        const p = KJ.Combat.previewDamage(self, m, e);
        const score = p.amount * (p.super ? 1.3 : 1); // prefer super
        if (!best || score > best.score) best = { moveId: mid, targetId: e.id, score };
      }
    }
    return best;
  },
  perfect(self, enemies, ctx) {
    // Smart, plus heal-at-low-HP if a heal is in kit and HP < 40%.
    const hpRatio = self.stats.hp / self.maxHP;
    if (hpRatio < 0.4) {
      const healId = self.moves.find(mid => {
        const m = KJ.Registry.moves.get(mid);
        return m && m.heal;
      });
      if (healId) return { moveId: healId, targetId: self.id };
    }
    return ARCH.smart(self, enemies);
  },
};
function pickHighest(self, target, moves) {
  let best = null;
  for (const mid of moves) {
    const m = KJ.Registry.moves.get(mid);
    if (!m || m.heal) continue;
    const p = KJ.Combat.previewDamage(self, m, target);
    if (!best || p.amount > best.amount) best = { moveId: mid, targetId: target.id, amount: p.amount };
  }
  return best;
}

// Seed-ish RNG for reproducibility (Math.random left as is; we run many trials)
function simBattle({ playerTeam, enemyIds, archetype, maxTurns=40 }) {
  const enemyTeam = enemyIds.map((id,i)=>makeEnemy(id,i));
  const battle = KJ.Combat.makeBattle({
    playerTeam: playerTeam.map(p => ({ ...p, stats: {...p.stats} })),
    enemyTeam,
    rewards: { xp: 0, gold:[0,0], drops: [] },
  });
  let turns = 0;
  while (battle.state === 'IN_PROGRESS' && turns < maxTurns) {
    // turn order by speed
    const order = KJ.Combat.turnOrder(battle);
    for (const actor of order) {
      if (battle.state !== 'IN_PROGRESS') break;
      if (actor.stats.hp <= 0) continue;
      if (actor.side === 'player') {
        const action = archetype(actor, battle.enemyTeam);
        if (!action) continue;
        KJ.Combat.applyAction(battle, { actorId: actor.id, moveId: action.moveId, targetId: action.targetId });
      } else {
        const a = KJ.Combat.chooseEnemyAction(battle, actor);
        if (a) KJ.Combat.applyAction(battle, a);
      }
    }
    turns++;
  }
  return { state: battle.state, turns };
}

function winRate(trials, fn) {
  let w=0, l=0, other=0, turns=[];
  for (let i=0;i<trials;i++){ const r=fn(); if(r.state==='VICTORY')w++; else if(r.state==='DEFEAT')l++; else other++; turns.push(r.turns); }
  return { winPct: Math.round(100*w/trials), w, l, other, avgTurns: (turns.reduce((a,b)=>a+b,0)/trials).toFixed(1) };
}

const N = 200;

// Forest trash: 2 goblin scouts, baseline James
{
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames()],
    enemyIds: ['goblin_scout','goblin_scout'],
    archetype: ARCH.mash,
  }));
  check(B, `Forest trash (2 goblins) — MASH ≥85% winrate`, r.winPct >= 85, JSON.stringify(r));
}
{
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames(), makeAlly('foxy',1)],
    enemyIds: ['goblin_scout','goblin_scout'],
    archetype: ARCH.smart,
  }));
  check(B, `Forest trash + Foxy — SMART ≥95% winrate`, r.winPct >= 95, JSON.stringify(r));
}

// Forest glade: mixed sprite + bat
{
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames()],
    enemyIds: ['forest_sprite','whirl_bat'],
    archetype: ARCH.smart,
  }));
  check(B, `Forest glade (mixed) — SMART ≥70%`, r.winPct >= 70, JSON.stringify(r));
}

// Forest wolf — solo James who mashes without understanding types is expected to struggle.
// Design decision: spark (fire SE vs earth) or Foxy fix it; kid also has climb/lure escape paths.
// We only assert that this difficulty is NOT unwinnable (>0%) so the fight isn't broken.
{
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames({level:2})],
    enemyIds: ['briar_wolf'],
    archetype: ARCH.mash,
  }));
  check(B, `Forest Wolf (SOLO) — MASH not zero (lossy-by-design but winnable on luck)`, r.winPct > 0, JSON.stringify(r));
}
{
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames({level:2}), makeAlly('foxy',2)],
    enemyIds: ['briar_wolf'],
    archetype: ARCH.smart,
  }));
  check(B, `Forest Wolf + Foxy — SMART ≥70% (Rule §P25a)`, r.winPct >= 70, JSON.stringify(r));
}
{
  // Solo James SMART — does type awareness rescue a foxy-less run?
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames({level:2})],
    enemyIds: ['briar_wolf'],
    archetype: ARCH.smart,
  }));
  check(B, `Forest Wolf (SOLO) — SMART ≥45% (kid who thinks can still win)`, r.winPct >= 45, JSON.stringify(r));
}

// Forest boss troll trio
{
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames({level:3}), makeAlly('foxy',3), makeAlly('owlette',2)],
    enemyIds: ['hoarder_troll','thornpup','forest_sprite'],
    archetype: ARCH.mash,
  }));
  // Rule 9.2: mash should "lose or narrowly win" a boss. Expect ≤75%.
  const narrow = r.winPct <= 80;
  check(B, `Forest Troll boss — MASH narrow (≤80%)`, narrow, JSON.stringify(r));
}
{
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames({level:3}), makeAlly('foxy',3), makeAlly('owlette',2)],
    enemyIds: ['hoarder_troll','thornpup','forest_sprite'],
    archetype: ARCH.smart,
  }));
  check(B, `Forest Troll boss — SMART ≥60% (target)`, r.winPct >= 60, JSON.stringify(r));
}
{
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames({level:4, bonusStats:{atk:1, hp:3}, extraMoves:['iron_slash','ember_burst']}), makeAlly('foxy',3), makeAlly('owlette',3)],
    enemyIds: ['hoarder_troll','thornpup','forest_sprite'],
    archetype: ARCH.perfect,
  }));
  check(B, `Forest Troll boss — PERFECT ≥85% (cruise)`, r.winPct >= 85, JSON.stringify(r));
}

// Mountain boss climax — requires think_fast from gem_of_wisdom + iron_slash/ember_burst from forest drops
{
  // Perfect player: post-Forest James, party w/ Owlette + Foxy
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames({level:5, bonusStats:{hp:5, atk:1, def:1}, extraMoves:['iron_slash','ember_burst','think_fast']}),
                 makeAlly('foxy',4), makeAlly('owlette',4)],
    enemyIds: ['glimmer_wraith','frost_sprite','snow_drake'],
    archetype: ARCH.perfect,
  }));
  check(B, `Mountain Wraith trio — PERFECT ≥70%`, r.winPct >= 70, JSON.stringify(r));
}
{
  // Smart, slightly under-leveled
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames({level:5, bonusStats:{hp:5}, extraMoves:['iron_slash','think_fast']}),
                 makeAlly('foxy',4), makeAlly('owlette',4)],
    enemyIds: ['glimmer_wraith','frost_sprite','snow_drake'],
    archetype: ARCH.smart,
  }));
  check(B, `Mountain Wraith trio — SMART ≥50%`, r.winPct >= 50, JSON.stringify(r));
}
{
  // WITH think_fast (post-Gem): mash accidentally picks SE move. WAD per Rule 4.3 (treasure pays off).
  // Control: run the SAME player WITHOUT think_fast — mash should struggle, proving gem is what carries.
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames({level:5, bonusStats:{hp:5}, extraMoves:['iron_slash']}),  // NO think_fast
                 makeAlly('foxy',4)],
    enemyIds: ['glimmer_wraith','frost_sprite','snow_drake'],
    archetype: ARCH.mash,
  }));
  // Without the gem's magic move, mash should legitimately struggle at this boss
  check(B, `Mountain Wraith — MASH w/o Gem's magic move ≤70% (gem must matter)`, r.winPct <= 70, JSON.stringify(r));
}
{
  // Sanity: Owlette's magic moves (hoot/moon_beam) should let a SMART player win even if James has no think_fast
  const r = winRate(N, () => simBattle({
    playerTeam: [makeJames({level:5, extraMoves:['iron_slash']}),  // NO think_fast; no Gem
                 makeAlly('owlette',4)],
    enemyIds: ['glimmer_wraith','frost_sprite'],
    archetype: ARCH.smart,
  }));
  check(B, `Mountain w/o Gem + Owlette — SMART still ≥50%`, r.winPct >= 50, JSON.stringify(r));
}

// ==================================================================
// C) EDGE-CASE BUGS
// ==================================================================
const C = section('C. Edge-case bug hunt');

function freshState() { return KJ.State.reset(); }

// C1 — grant_treasure applies jamesBonus stats AND makes addMove available
{
  const st = freshState();
  const beforeHp  = st.player.baseStats.hp;
  const beforeMax = st.player.baseStats.hp;
  KJ.Scene.applyEffects([{ type:'grant_treasure', id:'gem_of_wisdom' }]);
  const st2 = KJ.State.get();
  const hpOk = st2.player.baseStats.hp === beforeHp + 5;
  const moves = KJ.Scene.treasureMoves();
  const moveOk = moves.includes('think_fast');
  const roomOk = st2.progress.castleRooms.includes('library');
  check(C, `gem_of_wisdom grants +5 hp`, hpOk, `base: ${beforeHp} -> ${st2.player.baseStats.hp}`);
  check(C, `gem_of_wisdom adds think_fast move`, moveOk, moves.join(','));
  check(C, `gem_of_wisdom unlocks library`, roomOk, st2.progress.castleRooms.join(','));

  // Idempotent re-apply
  KJ.Scene.applyEffects([{ type:'grant_treasure', id:'gem_of_wisdom' }]);
  const st3 = KJ.State.get();
  check(C, `grant_treasure is idempotent (no stacking)`, st3.player.baseStats.hp === st2.player.baseStats.hp,
        `hp should stay ${st2.player.baseStats.hp}, got ${st3.player.baseStats.hp}`);
}

// C2 — recruit_ally auto-joins the party (Rule 7.2) but respects max
{
  freshState();
  KJ.Scene.applyEffects([{ type:'recruit_ally', id:'foxy' }]);
  KJ.Scene.applyEffects([{ type:'recruit_ally', id:'owlette' }]);
  KJ.Scene.applyEffects([{ type:'recruit_ally', id:'ribbit' }]);
  const st = KJ.State.get();
  check(C, `auto-join first ally into party`, st.roster.party.includes('foxy'));
  check(C, `auto-join second ally into party`, st.roster.party.includes('owlette'));
  check(C, `third ally does NOT auto-join (party full)`, !st.roster.party.includes('ribbit'), 'party: '+st.roster.party.join(','));
  check(C, `all three are in roster`, st.roster.allies.foxy && st.roster.allies.owlette && st.roster.allies.ribbit);
}

// C3 — missed ally recoverable via Pompadour (Rule 7.3)
{
  freshState();
  KJ.Scene.applyEffects([{ type:'mark_met_ally', id:'foxy' }]);
  const st = KJ.State.get();
  check(C, `mark_met_ally puts foxy on missed list`, st.roster.missed.includes('foxy'), st.roster.missed.join(','));

  // now recruit (simulating Pompadour hire) — should clear missed OR be idempotent-safe
  KJ.Scene.applyEffects([{ type:'recruit_ally', id:'foxy' }]);
  const st2 = KJ.State.get();
  check(C, `hiring missed ally adds to roster`, !!st2.roster.allies.foxy);
  // Note: code does not explicitly remove from `missed` on recruit; likely a small UX bug.
  if (st2.roster.missed.includes('foxy')) {
    warn(C, `⚠ missed list not cleared after recruit — Pompadour will still offer to rehire`, 'minor UX');
  }
}

// C4 — gear swap recomputes stats + moves
{
  freshState();
  const st = KJ.State.get();
  // Starter equip: wooden_sword + cloth_vest + plain_stone + old_boots
  const before = KJ.Scene.equippedGear();
  const expectedMoves = ['swing','brace','spark','kick'];
  check(C, `starter gear moves present`, expectedMoves.every(m=>before.moves.includes(m)), before.moves.join(','));

  // Equip iron_sword (needs inventory first)
  st.inventory.gear.push('iron_sword');
  st.player.equipped.weapon = 'iron_sword';
  const after = KJ.Scene.equippedGear();
  check(C, `gear swap: iron_sword move replaces swing`, after.moves.includes('iron_slash') && !after.moves.includes('swing'));
  check(C, `gear swap: stats update (atk +2)`, after.stats.atk === before.stats.atk + 2, `${before.stats.atk}->${after.stats.atk}`);
}

// C5 — battle scene enemies have moves that exist AND telegraph works
{
  const troll = KJ.Registry.enemies.get('hoarder_troll');
  const tele = KJ.Combat.enemyTelegraph({playerTeam:[], enemyTeam:[]}, { ...troll, id:'t0', _moveCursor:0 });
  check(C, `enemy telegraph returns a string`, typeof tele === 'string' && tele.length > 0, tele);
}

// C6 — type chart sanity (5-way cycle: every type has exactly one SE and one NV)
{
  const issues = [];
  for (const a of KJ.TYPES) {
    let se=0, nv=0;
    for (const d of KJ.TYPES) {
      const v = KJ.Types.effectiveness(a,d);
      if (v >= 2) se++;
      else if (v <= 0.5) nv++;
    }
    if (se !== 1) issues.push(`${a} has ${se} SE (expected 1)`);
    if (nv !== 1) issues.push(`${a} has ${nv} NV (expected 1)`);
  }
  check(C, `type chart: 5-way cycle (1 SE, 1 NV per attacker)`, issues.length===0, issues.join('; '));
}

// C7 — heal move does not overheal
{
  const st = freshState();
  const james = KJ.Combat.buildPlayerTeam ? null : null; // skip — we'll drive directly
  // Simulate: give brace to self, verify clamps to maxHP
  const c = {
    side:'player',id:'t',name:'test',emoji:'',type:'earth',
    stats:{hp:5,atk:0,def:0,spd:0}, maxHP:20, moves:['brace']
  };
  const e = {
    side:'enemy',id:'e',name:'e',emoji:'',type:'earth',
    stats:{hp:10,atk:0,def:0,spd:0}, maxHP:10, moves:['bite']
  };
  const b = KJ.Combat.makeBattle({ playerTeam:[c], enemyTeam:[e] });
  KJ.Combat.applyAction(b, { actorId:'t', moveId:'brace', targetId:'t' });
  check(C, `heal move respects maxHP clamp`, b.playerTeam[0].stats.hp <= 20 && b.playerTeam[0].stats.hp > 5, `hp=${b.playerTeam[0].stats.hp}`);
}

// C8 — KO keeps progress (Rule 8.2) — simulated: player loses, verify state fields preserved
{
  freshState();
  const st = KJ.State.get();
  st.inventory.gold = 99;
  st.player.xp = 42;
  st.roster.allies.foxy = { level:2, xp:0, moves:['quick_pounce'], hp:18 };
  st.roster.party = ['foxy'];
  // Simulate engine's "knockout -> back to castle": gold/xp/gear/allies preserved.
  // The engine currently does NOT have a dedicated function — the onDefeat in quest data
  // sends back to the intro. Check the invariant: resetting scene does not reset inventory/xp/roster.
  const snap = {
    gold: st.inventory.gold, xp: st.player.xp,
    foxy: st.roster.allies.foxy, gear: st.inventory.gear.slice(),
  };
  KJ.Scene.applyEffects([{ type:'heal_party', amount: 100 }]); // simulates Crown rescue restoring HP
  check(C, `after simulated rescue: gold preserved`, KJ.State.get().inventory.gold === snap.gold);
  check(C, `after simulated rescue: xp preserved`, KJ.State.get().player.xp === snap.xp);
  check(C, `after simulated rescue: ally preserved`, !!KJ.State.get().roster.allies.foxy);
}

// C9 — pending level-up counter wiring
{
  freshState();
  const st = KJ.State.get();
  // Simulate a hypothetical grant (no effect type exists to award pending) — this is the bug check
  st.player.pendingStatPoints = 2;
  st.player.pendingTraitPicks = 1;
  // Rule 3.3: pending counters must have a consumer UI. Engine must expose it.
  const lvlupOk = !!(KJ.UI && KJ.UI.LevelUp);
  check(C, `LevelUp UI exists to consume pending`, lvlupOk);
}

// C10a — damage preview math: type multiplier tags are correct on a super/weak example
{
  const wolf = { ...KJ.Registry.enemies.get('briar_wolf'), stats: { ...KJ.Registry.enemies.get('briar_wolf').stats } };
  const james = makeJames();
  const sparkPrev = KJ.Combat.previewDamage(james, KJ.Registry.moves.get('spark'), wolf);
  check(C, `preview: spark (fire) vs wolf (earth) marked SUPER`, sparkPrev.super === true);
  const windPrev = KJ.Combat.previewDamage(james, KJ.Registry.moves.get('kick'), wolf);
  check(C, `preview: kick (wind) vs wolf (earth) marked WEAK`, windPrev.weak === true);
}

// C11 — Rule 4.3: arc's treasure arms kid for next arc's primary enemy
{
  // Forest treasure = gem_of_wisdom -> addMove: think_fast (magic) -> should SE vs Mountain main type (water)
  const gemMove = KJ.Registry.moves.get('think_fast');
  const mountainMainType = 'water';
  check(C, `Gem of Wisdom's think_fast is super-effective vs Mountain's water enemies`,
        KJ.Types.effectiveness(gemMove.type, mountainMainType) >= 2,
        `mult=${KJ.Types.effectiveness(gemMove.type, mountainMainType)}`);

  // Mountain treasure = blade_of_bravery -> addMove: brave_strike (wind) -> next arc beach primary? check
  const bladeMove = KJ.Registry.moves.get('brave_strike');
  // Look at beach quest to find most-frequent enemy type
  const beachQ = KJ.Registry.quests.get('beach');
  if (beachQ) {
    const typeCount = {};
    for (const s of beachQ.scenes) if (s.type==='battle') for (const eid of s.enemies) {
      const e = KJ.Registry.enemies.get(eid);
      if (e) typeCount[e.type] = (typeCount[e.type]||0) + 1;
    }
    const nextType = Object.entries(typeCount).sort((a,b)=>b[1]-a[1])[0]?.[0];
    if (nextType) {
      const mult = KJ.Types.effectiveness(bladeMove.type, nextType);
      if (mult >= 2) check(C, `Blade of Bravery SE vs beach primary (${nextType})`, true);
      else warn(C, `Blade of Bravery (wind) NOT SE vs beach primary (${nextType}), mult=${mult}`, 'check if beach arc should be redesigned to magic');
    } else {
      warn(C, `beach quest has no battles yet — skipping Rule 4.3 check`, '');
    }
  } else {
    warn(C, `beach quest not registered — Rule 4.3 check skipped`, '');
  }
}

// ==================================================================
// PRINT REPORT
// ==================================================================
for (const sec of results.sections) {
  console.log('\n=== ' + sec.name + ' ===');
  for (const it of sec.items) {
    const icon = it.level==='pass' ? '✅' : it.level==='fail' ? '❌' : '⚠️ ';
    const tail = it.detail ? '  — ' + it.detail : '';
    console.log(`${icon} ${it.label}${tail}`);
  }
}
console.log('\n---');
console.log(`PASS: ${results.pass}   FAIL: ${results.fail}   WARN: ${results.warn}`);
process.exit(results.fail > 0 ? 1 : 0);
