// King James 2 — Joker trait (auto-unlocks by level)
// Level 3:  🃏 Class Clown    — 20% proc after any James action
// Level 10: 🎩 Prank Master   — 40% proc, unlocks tier 2 jokes
// Level 17: 👑 Supreme Jester — 60% proc, unlocks tier 3 legendary jokes

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.Joker = (function () {

  // Returns {tier, procChance, jokes} or null if not unlocked yet.
  function currentTier() {
    const s = KJ.State && KJ.State.get && KJ.State.get();
    const lvl = s ? s.player.level : 1;
    if (lvl >= 17) return { tier: 3, name: '👑 Supreme Jester', proc: 0.40, pool: ALL };
    if (lvl >= 10) return { tier: 2, name: '🎩 Prank Master',   proc: 0.40, pool: [...TIER1, ...TIER2] };
    if (lvl >= 3)  return { tier: 1, name: '🃏 Class Clown',    proc: 0.20, pool: TIER1 };
    return null;
  }

  // Prank definitions. Each has: name, voice line, effect(battle).
  // voiceFile = speaker 'james' + sceneId 'joker' + beat index.

  const TIER1 = [
    {
      id: 'banana_peel', name: '🍌 Banana Peel',
      voiceIdx: 0,
      subtext: "Oops! Watch your step…",
      effect: (battle) => {
        const t = randomAliveEnemy(battle); if (!t) return;
        KJ.Statuses && KJ.Statuses.apply(t, 'dizzy', { turns: 2 });
      },
    },
    {
      id: 'whoopie', name: '💨 Whoopie Cushion',
      voiceIdx: 1,
      subtext: "BPPRRRT! Got 'em!",
      effect: (battle) => {
        battle.enemyTeam.filter(c => c.stats.hp > 0).forEach(e => { e.stats.hp = Math.max(0, e.stats.hp - 2); });
        battle.playerTeam.filter(c => c.stats.hp > 0).forEach(p => {
          p.stats.hp = Math.min(p.maxHP, p.stats.hp + 2);
        });
      },
    },
    {
      id: 'wig_swap', name: '🤡 Wig Swap',
      voiceIdx: 2,
      subtext: "You look GREAT in pink!",
      effect: (battle) => {
        const t = randomAliveEnemy(battle); if (!t) return;
        KJ.Statuses && KJ.Statuses.apply(t, 'stun', { turns: 1 });
      },
    },
    {
      id: 'rubber_worm', name: '🐛 Rubber Worm',
      voiceIdx: 3,
      subtext: "Is that a worm? It's rubber. BUT STILL.",
      effect: (battle) => {
        const t = randomAliveEnemy(battle); if (!t) return;
        KJ.Statuses && KJ.Statuses.apply(t, 'dizzy', { turns: 2 });
        battle.playerTeam.filter(c => c.stats.hp > 0).forEach(p => {
          p.stats.hp = Math.min(p.maxHP, p.stats.hp + 4);
        });
      },
    },
  ];

  const TIER2 = [
    {
      id: 'pie_face', name: '🥧 Pie to the Face',
      voiceIdx: 4,
      subtext: "SPLAT! Dessert's ready.",
      effect: (battle) => {
        const t = randomAliveEnemy(battle); if (!t) return;
        KJ.Statuses && KJ.Statuses.apply(t, 'blinded', { turns: 2 });
        t.stats.hp = Math.max(0, t.stats.hp - 6);
      },
    },
    {
      id: 'glitter_bomb', name: '💥 Glitter Bomb',
      voiceIdx: 5,
      subtext: "SPARKLE EXPLOSION!",
      effect: (battle) => {
        battle.enemyTeam.filter(c => c.stats.hp > 0).forEach(e => {
          KJ.Statuses && KJ.Statuses.apply(e, 'dizzy', { turns: 1 });
        });
      },
    },
    {
      id: 'fake_snake', name: '🐍 Fake Snake',
      voiceIdx: 6,
      subtext: "AHHHHH — gotcha.",
      effect: (battle) => {
        const t = randomAliveEnemy(battle); if (!t) return;
        KJ.Statuses && KJ.Statuses.apply(t, 'stun',  { turns: 1 });
        KJ.Statuses && KJ.Statuses.apply(t, 'sleep', { turns: 1 });
      },
    },
    {
      id: 'duck_army', name: '🦆 Rubber Duck Army',
      voiceIdx: 7,
      subtext: "QUACK QUACK QUACK QUACK…",
      effect: (battle) => {
        battle.enemyTeam.filter(c => c.stats.hp > 0).forEach(e => { e.stats.hp = Math.max(0, e.stats.hp - 5); });
        const james = battle.playerTeam.find(c => c.id === 'james');
        if (james && KJ.Statuses) KJ.Statuses.apply(james, 'pumped', { turns: 2 });
      },
    },
  ];

  const TIER3 = [
    {
      id: 'circus_chaos', name: '🎪 Circus of Chaos',
      voiceIdx: 8,
      subtext: "LADIES AND GENTLEMEN — THE SHOW!",
      effect: (battle) => {
        battle.enemyTeam.filter(c => c.stats.hp > 0).forEach(e => {
          KJ.Statuses && KJ.Statuses.apply(e, 'dizzy', { turns: 2 });
          e.stats.hp = Math.max(0, e.stats.hp - 10);
        });
        const james = battle.playerTeam.find(c => c.id === 'james');
        if (james && KJ.Statuses) {
          KJ.Statuses.apply(james, 'pumped', { turns: 2 });
        }
      },
    },
    {
      id: 'impostor', name: '🎭 Impostor',
      voiceIdx: 9,
      subtext: "Wait… are you on our team?",
      effect: (battle) => {
        // Simple sim: target is stunned AND damages its own team via engine quirk.
        const t = randomAliveEnemy(battle); if (!t) return;
        KJ.Statuses && KJ.Statuses.apply(t, 'dizzy', { turns: 2 });  // dizzy already has self-hit logic
        KJ.Statuses && KJ.Statuses.apply(t, 'stun',  { turns: 1 });
      },
    },
    {
      id: 'surprise_gift', name: '🎁 Surprise Gift',
      voiceIdx: 10,
      subtext: "Open it! …IT'S A BEE!",
      effect: (battle) => {
        const roll = Math.random();
        if (roll < 0.34) {
          battle.playerTeam.filter(c => c.stats.hp > 0).forEach(p => {
            p.stats.hp = Math.min(p.maxHP, p.stats.hp + 15);
          });
        } else if (roll < 0.67) {
          battle.enemyTeam.filter(c => c.stats.hp > 0).forEach(e => {
            KJ.Statuses && KJ.Statuses.apply(e, 'stun', { turns: 1 });
          });
        } else {
          KJ.State.get().inventory.gold += 50;
          KJ.Events.emit('gold_changed', { delta: 50 });
        }
      },
    },
    {
      id: 'gone_fishing', name: '🫥 Gone Fishing',
      voiceIdx: 11,
      subtext: "See ya! Have fun fishing.",
      effect: (battle) => {
        const t = randomAliveEnemy(battle); if (!t) return;
        KJ.Statuses && KJ.Statuses.apply(t, 'sleep', { turns: 2 });
      },
    },
  ];

  const ALL = [...TIER1, ...TIER2, ...TIER3];

  function randomAliveEnemy(battle) {
    const alive = battle.enemyTeam.filter(c => c.stats.hp > 0);
    if (!alive.length) return null;
    return alive[Math.floor(Math.random() * alive.length)];
  }

  // Called after James's normal action resolves. Fires a prank based on tier+proc chance.
  function maybeProc(battle) {
    const t = currentTier();
    if (!t) return;
    if (Math.random() > t.proc) return;
    const jokes = t.pool;
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    // Apply the effect
    joke.effect(battle);
    battle.log.push({ kind: 'joker_prank', data: { name: joke.name, subtext: joke.subtext } });
    // Voice the joke
    KJ.Audio && KJ.Audio.voicePath && KJ.Audio.voicePath(
      `audio/voices/james/joker_${joke.voiceIdx}.mp3`
    );
    // Recompute battle state
    if (battle.enemyTeam.every(c => c.stats.hp <= 0)) battle.state = 'VICTORY';
  }

  // ---- Unlock announcements (fired on level_up) ----
  // Full-screen overlay with narrator + crown voiced lines.
  const UNLOCKS = {
    3: {
      tierName: '🃏 Class Clown',
      narrator: "Something just clicked. All those dumb jokes James tells at dinner? They just started working.",
      crown:    "Oh no. OH NO. Kid — this is a SUPERPOWER now. Try not to break anything.",
      voiceNarrator: 'audio/voices/narrator/joker_unlock_0.mp3',
      voiceCrown:    'audio/voices/crown/joker_unlock_0.mp3',
    },
    10: {
      tierName: '🎩 Prank Master',
      narrator: "James has leveled up. So have his pranks. He's got props now. And timing.",
      crown:    "Is that a pie in your backpack? …it is. Wild.",
      voiceNarrator: 'audio/voices/narrator/joker_unlock_1.mp3',
      voiceCrown:    'audio/voices/crown/joker_unlock_1.mp3',
    },
    17: {
      tierName: '👑 Supreme Jester',
      narrator: "The kingdom has a new name for James: The Show. The monsters don't like it.",
      crown:    "You, sir, are no longer a kid. You are a whole ENTERTAINMENT DIVISION.",
      voiceNarrator: 'audio/voices/narrator/joker_unlock_2.mp3',
      voiceCrown:    'audio/voices/crown/joker_unlock_2.mp3',
    },
  };

  // Queue so two+ unlocks (e.g. bulk debug level-up) show sequentially, not stacked.
  const _queue = [];
  let _active = false;

  function showUnlockOverlay(level) {
    _queue.push(level);
    _pump();
  }

  function _pump() {
    if (_active) return;
    const level = _queue.shift();
    if (level == null) return;
    const u = UNLOCKS[level];
    if (!u) { _pump(); return; }
    _active = true;

    const host = document.createElement('div');
    host.className = 'kj-joker-unlock-overlay';
    host.innerHTML = `
      <div class="kj-joker-unlock-panel">
        <div class="kj-joker-unlock-title">JOKER POWER UNLOCKED</div>
        <div class="kj-joker-unlock-tier">${u.tierName}</div>
        <div class="kj-joker-unlock-line"><span class="kj-ju-speaker">📜 Narrator</span><br>${u.narrator}</div>
        <div class="kj-joker-unlock-line"><span class="kj-ju-speaker">👑 Crown</span><br>${u.crown}</div>
        <button class="kj-big-btn kj-ju-ok-btn">▶️ Let's go</button>
      </div>
    `;
    document.body.appendChild(host);
    // Play narrator; chain crown off the 'ended' event so the narrator actually
    // finishes before crown starts (lines vary in length; fixed timeout cut off
    // the end of the narrator clip).
    const narratorAudio = KJ.Audio && KJ.Audio.voicePath && KJ.Audio.voicePath(u.voiceNarrator);
    let crownPlayed = false;
    function playCrown() {
      if (crownPlayed) return;
      crownPlayed = true;
      KJ.Audio && KJ.Audio.voicePath && KJ.Audio.voicePath(u.voiceCrown);
    }
    let crownTimer = null;
    if (narratorAudio) {
      narratorAudio.addEventListener('ended', () => setTimeout(playCrown, 400));
      // Safety fallback: if 'ended' never fires (error / 404 / browser quirk),
      // play crown after a generous 12s window.
      crownTimer = setTimeout(playCrown, 12000);
    } else {
      // Muted / voice off — just show the text; no audio chain.
    }

    // Scope the button lookup to THIS overlay, not document — old bug stacked
    // two overlays with duplicate ids and getElementById grabbed the wrong one.
    host.querySelector('.kj-ju-ok-btn').onclick = () => {
      if (crownTimer) clearTimeout(crownTimer);
      host.remove();
      KJ.Audio && KJ.Audio.stop && KJ.Audio.stop();
      _active = false;
      _pump();
    };
    // Also dismiss on overlay background click as a fallback
    host.onclick = (e) => {
      if (e.target === host) host.querySelector('.kj-ju-ok-btn').click();
    };
  }

  // Fire unlock overlay once per tier, the first time player reaches that level.
  KJ.Events && KJ.Events.on && KJ.Events.on('level_up', (ev) => {
    const lvl = ev.newLevel;
    const s = KJ.State.get();
    s.progress.flags = s.progress.flags || {};
    const key = '_joker_unlocked_' + lvl;
    if (UNLOCKS[lvl] && !s.progress.flags[key]) {
      s.progress.flags[key] = true;
      // Defer so the level-up UI doesn't collide
      setTimeout(() => showUnlockOverlay(lvl), 2400);
    }
  });

  return {
    currentTier, maybeProc, showUnlockOverlay,
    _TIER1: TIER1, _TIER2: TIER2, _TIER3: TIER3, _ALL: ALL,
  };
})();
