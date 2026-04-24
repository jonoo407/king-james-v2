// King James 2 — Battle Scene Renderer
// Minimal v1 UI on top of the Combat engine.
// Data shape: { type: 'battle', bg, enemies:[enemyId], rewards, next, onDefeat }

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.BattleScene = (function () {

  function render(scene, ctx) {
    const state = KJ.State.get();
    const playerTeam = KJ.Combat.buildPlayerTeam(state);
    const enemyTeam = (scene.enemies || []).map((id, i) => KJ.Combat.enemyToCombatant(id, i)).filter(Boolean);
    const battle = KJ.Combat.makeBattle({ playerTeam, enemyTeam, rewards: scene.rewards });

    // First-battle tutorial: inject 2 crown quips into the log (visible in battle log)
    if (!state.progress.flags['tutorial_battle_done']) {
      injectTutorialQuips();
    }

    function injectTutorialQuips() {
      const pool = KJ.Registry.crownDialogue.all().find(p => p.context === 'battle_tutorial');
      if (!pool || !pool.lines.length) return;
      // 2 tutorial lines pushed as log entries labelled "crown"
      battle.log.push({ kind: 'crown_tutorial', data: { text: pool.lines[0] } });
      battle.log.push({ kind: 'crown_tutorial', data: { text: pool.lines[3] || pool.lines[0] } });
      // Voice the first quip once the battle UI has rendered
      setTimeout(() => KJ.Audio.voicePath(
        `audio/voices/crown/cd_${pool.id}_0.mp3`
      ), 600);
    }

    function run() {
      draw();
      if (battle.state === 'VICTORY') return onVictory();
      if (battle.state === 'DEFEAT') return onDefeat();
      nextTurn();
    }

    // Debug hook — KO all enemies and jump to victory
    KJ.UI.BattleScene._debugForceVictory = function () {
      battle.enemyTeam.forEach(c => { c.stats.hp = 0; });
      battle.state = 'VICTORY';
      onVictory();
    };

    function draw() {
      const app = document.getElementById('app');
      const bg = scene.bg || 'neutral';
      const telegraph = firstEnemyTelegraph();
      app.innerHTML = `
        ${KJ.UI.HUD.html()}
        <div class="kj-scene-wrap kj-bg-${bg} kj-battle">
          <div class="kj-battle-enemies">
            ${battle.enemyTeam.map(teamCardHTML).join('')}
          </div>
          ${telegraph ? `<div class="kj-telegraph">⚠️ ${telegraph}</div>` : ''}
          <div class="kj-battle-log" id="kj-battle-log">${renderLog()}</div>
          <div class="kj-battle-party">
            ${battle.playerTeam.map(teamCardHTML).join('')}
          </div>
          <div class="kj-battle-actions" id="kj-battle-actions"></div>
        </div>
      `;
      KJ.UI.HUD.attach();
    }

    function teamCardHTML(c) {
      const pct = Math.max(0, Math.round(100 * c.stats.hp / c.maxHP));
      const icons = { fire:'🔥', water:'💧', earth:'🌿', wind:'💨', magic:'✨' };
      const typeIcon = icons[c.type] || '·';
      const ko = c.stats.hp <= 0 ? 'ko' : '';

      // For enemies, show weakness + resistance so kids can plan moves
      let weakLine = '';
      let strongLine = '';
      if (c.side === 'enemy' && c.stats.hp > 0) {
        const weakTypes = KJ.Combat.findWeakness(c.type) || [];
        if (weakTypes.length) {
          weakLine = `<div class="kj-cb-weak">weak: ${weakTypes.map(t => icons[t]).join('')}</div>`;
        }
        // Types that this creature RESISTS (takes 0.5x from)
        const resistedFrom = (KJ.Types && KJ.Types.list) ? KJ.Types.list.filter(a => KJ.Types.effectiveness(a, c.type) <= KJ.TUNABLES.notVeryEffectiveMult) : [];
        if (resistedFrom.length) {
          strongLine = `<div class="kj-cb-strong">strong: ${resistedFrom.map(t => icons[t]).join('')}</div>`;
        }
      }

      return `
        <div class="kj-cb-card ${ko}" data-id="${c.id}">
          <div class="kj-cb-emoji">${c.emoji}</div>
          <div class="kj-cb-name">${c.name} ${typeIcon}</div>
          <div class="kj-cb-hpbar"><div class="kj-cb-hpfill" style="width:${pct}%"></div></div>
          <div class="kj-cb-hpnum">${c.stats.hp}/${c.maxHP}</div>
          ${weakLine}
          ${strongLine}
        </div>
      `;
    }

    function renderLog() {
      const lines = battle.log.slice(-4).map(entry => logLine(entry)).filter(Boolean);
      return lines.join('<br>');
    }

    function logLine(entry) {
      if (entry.kind === 'action') {
        const d = entry.data;
        if (d.result.heal) {
          return `${d.actor.emoji} used <strong>${d.move.name}</strong> → +${d.result.heal} HP`;
        }
        if (d.result.miss) return `${d.actor.emoji} ${d.actor.name} missed!`;
        let s = `${d.actor.emoji} used <strong>${d.move.name}</strong> → ${d.target.emoji} -${d.result.amount}`;
        if (d.result.crit) s += ' 💥';
        if (d.result.super) s += ' ⚡ <em>Super effective!</em>';
        else if (d.result.weak) s += ' 🥱 <em>Not very effective...</em>';
        return s;
      }
      if (entry.kind === 'scroll') {
        return `📜 used <strong>${entry.data.name}</strong>!`;
      }
      if (entry.kind === 'crown_tutorial') {
        return `👑 <em>${entry.data.text}</em>`;
      }
      if (entry.kind === 'victory') return '🎉 Victory!';
      if (entry.kind === 'defeat') return '😵 Knocked out!';
      if (entry.kind === 'battle_start') return '⚔️ Battle start!';
      return null;
    }

    function firstEnemyTelegraph() {
      const alive = battle.enemyTeam.filter(c => c.stats.hp > 0);
      if (!alive.length) return null;
      return KJ.Combat.enemyTelegraph(battle, alive[0]);
    }

    // Turn loop — simplified: one full round per "run()" cycle:
    // 1) player picks a move for each alive player-side combatant (James first, then allies)
    // 2) each alive enemy acts once
    function nextTurn() {
      const actions = document.getElementById('kj-battle-actions');
      if (!actions) return;
      const actor = battle.playerTeam.find(c => c.stats.hp > 0 && !c._actedThisRound);
      if (actor) {
        promptPlayerAction(actor);
      } else {
        // All player acted; now enemies act
        enemiesAct().then(() => {
          battle.playerTeam.forEach(c => delete c._actedThisRound);
          battle.enemyTeam.forEach(c => delete c._actedThisRound);
          battle.turn++;
          run();
        });
      }
    }

    function promptPlayerAction(actor) {
      const actions = document.getElementById('kj-battle-actions');
      // Items are only usable by James, and only if there are any
      const scrolls = (actor.id === 'james') ? scrollsInInventory() : [];
      const itemsBtn = scrolls.length
        ? `<button class="kj-btn-secondary" id="kj-btn-items" style="width:100%; margin-top:8px;">🎒 Use Scroll (${scrolls.reduce((s, o) => s + o.count, 0)})</button>`
        : '';
      actions.innerHTML = `
        <div class="kj-battle-prompt"><strong>${actor.emoji} ${actor.name}</strong>, pick a move:</div>
        <div class="kj-move-grid">
          ${(actor.moves || []).map(mid => moveBtn(mid, actor)).join('')}
        </div>
        ${itemsBtn}
      `;
      if (scrolls.length) {
        document.getElementById('kj-btn-items').onclick = () => showItemPicker(actor);
      }
      actions.querySelectorAll('[data-move]').forEach(b => {
        b.onclick = () => {
          const mid = b.dataset.move;
          const move = KJ.Registry.moves.get(mid);
          if (!move) return;
          KJ.Audio.play('click');
          // Self-target (heals etc.)
          if (move.target === 'self') {
            commitAction(actor, mid, actor.id);
            return;
          }
          const alive = battle.enemyTeam.filter(c => c.stats.hp > 0);
          if (alive.length === 0) return;
          if (alive.length === 1) {
            commitAction(actor, mid, alive[0].id);
            return;
          }
          // Multiple enemies: show target picker so kid chooses who to hit
          showTargetPicker(actor, mid, alive);
        };
      });
    }

    function showTargetPicker(actor, mid, aliveEnemies) {
      const move = KJ.Registry.moves.get(mid);
      const icons = { fire:'🔥', water:'💧', earth:'🌿', wind:'💨', magic:'✨' };
      const actions = document.getElementById('kj-battle-actions');
      actions.innerHTML = `
        <div class="kj-battle-prompt">Pick a target for <strong>${icons[move.type]||''} ${move.name}</strong>:</div>
        <div class="kj-target-grid">
          ${aliveEnemies.map(e => {
            const p = KJ.Combat.previewDamage(actor, move, e);
            let cls = 'kj-target-btn';
            let tag = '';
            if (p.super) { cls += ' super'; tag = ' ⚡'; }
            else if (p.weak) { cls += ' weak'; tag = ' 🛡️'; }
            return `<button class="${cls}" data-target="${e.id}">
              <span class="kj-target-face">${e.emoji}</span>
              <span class="kj-target-name">${e.name}</span>
              <span class="kj-target-dmg">~${p.amount} dmg${tag}</span>
            </button>`;
          }).join('')}
        </div>
        <button class="kj-btn-secondary" id="kj-target-cancel" style="width:100%; margin-top:8px;">⬅️ Back to moves</button>
      `;
      actions.querySelectorAll('[data-target]').forEach(b => {
        b.onclick = () => {
          KJ.Audio.play('click');
          commitAction(actor, mid, b.dataset.target);
        };
      });
      document.getElementById('kj-target-cancel').onclick = () => {
        KJ.Audio.play('click');
        promptPlayerAction(actor);
      };
    }

    function commitAction(actor, mid, targetId) {
      if (!targetId) return;
      KJ.Combat.applyAction(battle, { actorId: actor.id, moveId: mid, targetId });
      actor._actedThisRound = true;
      const last = battle.log[battle.log.length - 1];
      if (last && last.kind === 'action') {
        const tEl = document.querySelector('[data-id="' + last.data.target.id + '"]');
        if (tEl) {
          if (last.data.result.heal) {
            KJ.Effects.damageNumber(tEl, -last.data.result.heal, { color: '#2ecc71' });
            KJ.Audio.play('kind');
          } else {
            KJ.Effects.damageNumber(tEl, last.data.result.amount, {
              crit: last.data.result.crit, super: last.data.result.super
            });
            if (last.data.result.super) KJ.Audio.play('super');
            else if (last.data.result.weak) KJ.Audio.play('weak');
            else KJ.Audio.play('bonk');
          }
        }
      }
      setTimeout(run, 350);
    }

    function moveBtn(mid, actor) {
      const m = KJ.Registry.moves.get(mid);
      if (!m) return `<button class="kj-move-btn" disabled>??? (${mid})</button>`;
      const icons = { fire:'🔥', water:'💧', earth:'🌿', wind:'💨', magic:'✨' };
      const typeIcon = icons[m.type] || '·';

      // Heal moves: show heal amount
      if (m.heal) {
        return `<button class="kj-move-btn kj-move-heal" data-move="${mid}" title="${m.flavor || ''}">
          💚 ${m.name}<br><small>heal +${m.heal}</small>
        </button>`;
      }

      // Damage moves: preview vs first alive enemy
      const target = battle.enemyTeam.find(c => c.stats.hp > 0);
      let previewTxt = `pwr ${m.power}`;
      let cls = 'kj-move-btn';
      if (target) {
        const p = KJ.Combat.previewDamage(actor, m, target);
        previewTxt = `~${p.amount} dmg`;
        if (p.super) { previewTxt += ' ⚡'; cls += ' kj-move-super'; }
        else if (p.weak) { previewTxt += ' 🛡️'; cls += ' kj-move-weak'; }
      }
      return `<button class="${cls}" data-move="${mid}" title="${m.flavor || ''}">
        ${typeIcon} ${m.name}<br><small>${previewTxt}</small>
      </button>`;
    }

    // -------- SCROLLS (items in battle) --------
    function scrollsInInventory() {
      const st = KJ.State.get();
      const out = [];
      for (const [sid, count] of Object.entries(st.inventory.consumables || {})) {
        if (count > 0) {
          const s = KJ.Registry.scrolls && KJ.Registry.scrolls.get(sid);
          if (s) out.push({ scroll: s, count });
        }
      }
      return out;
    }

    function showItemPicker(actor) {
      const actions = document.getElementById('kj-battle-actions');
      const owned = scrollsInInventory();
      const lvl = KJ.State.get().player.level;
      function livePreview(s) {
        const e = s.effect || {};
        const dmg  = e.amount + lvl * 3;
        const heal = e.amount + Math.floor(lvl * 1.5);
        if (e.kind === 'heal_party')         return `Heal party +${heal} HP`;
        if (e.kind === 'damage_enemy')       return `${dmg} damage to one enemy`;
        if (e.kind === 'damage_all_enemies') return `${dmg} damage to ALL enemies`;
        return s.desc;
      }
      actions.innerHTML = `
        <div class="kj-battle-prompt"><strong>🎒 Pick a scroll:</strong></div>
        <div class="kj-scroll-battle-list">
          ${owned.map(o => `
            <button class="kj-scroll-use-btn" data-scroll="${o.scroll.id}">
              <div>${o.scroll.emoji} <strong>${o.scroll.name}</strong> <span class="kj-scroll-count">x${o.count}</span></div>
              <div class="kj-scroll-sub">${livePreview(o.scroll)}</div>
            </button>
          `).join('')}
          <button class="kj-btn-secondary" id="kj-cancel-item">⬅️ Cancel</button>
        </div>
      `;
      actions.querySelectorAll('[data-scroll]').forEach(b => {
        b.onclick = () => {
          KJ.Audio.play('click');
          useScroll(b.dataset.scroll, actor);
        };
      });
      document.getElementById('kj-cancel-item').onclick = () => {
        KJ.Audio.play('click');
        promptPlayerAction(actor);
      };
    }

    function useScroll(sid, actor) {
      const st = KJ.State.get();
      const scroll = KJ.Registry.scrolls.get(sid);
      if (!scroll || (st.inventory.consumables[sid] || 0) <= 0) return;
      st.inventory.consumables[sid]--;
      applyScrollEffect(scroll);
      actor._actedThisRound = true;
      KJ.Audio.play('magic');
      setTimeout(run, 450);
    }

    function applyScrollEffect(scroll) {
      const e = scroll.effect || {};
      // Scale scroll potency with player level so they stay more powerful than
      // standard moves at every tier and justify their gold cost.
      const lvl = KJ.State.get().player.level;
      const dmg  = e.amount + lvl * 3;              // damage scrolls
      const heal = e.amount + Math.floor(lvl * 1.5); // healing scrolls
      switch (e.kind) {
        case 'heal_party':
          battle.playerTeam.filter(c => c.stats.hp > 0).forEach(c => {
            const before = c.stats.hp;
            c.stats.hp = Math.min(c.maxHP, c.stats.hp + heal);
            const delta = c.stats.hp - before;
            if (delta > 0) {
              const el = document.querySelector('[data-id="' + c.id + '"]');
              if (el) KJ.Effects.damageNumber(el, -delta, { color: '#2ecc71' });
            }
          });
          break;
        case 'damage_enemy': {
          const target = battle.enemyTeam.find(c => c.stats.hp > 0);
          if (target) {
            target.stats.hp = Math.max(0, target.stats.hp - dmg);
            const el = document.querySelector('[data-id="' + target.id + '"]');
            if (el) KJ.Effects.damageNumber(el, dmg, { super: true });
          }
          break;
        }
        case 'damage_all_enemies':
          battle.enemyTeam.filter(c => c.stats.hp > 0).forEach(c => {
            c.stats.hp = Math.max(0, c.stats.hp - dmg);
            const el = document.querySelector('[data-id="' + c.id + '"]');
            if (el) KJ.Effects.damageNumber(el, dmg, { super: true });
          });
          break;
      }
      battle.log.push({ kind: 'scroll', data: { name: scroll.name } });
      // Check end conditions
      if (battle.enemyTeam.every(c => c.stats.hp <= 0)) battle.state = 'VICTORY';
      else if (battle.playerTeam.every(c => c.stats.hp <= 0)) battle.state = 'DEFEAT';
    }

    function enemiesAct() {
      return new Promise(resolve => {
        const queue = battle.enemyTeam.filter(c => c.stats.hp > 0);
        function step() {
          if (!queue.length || battle.state !== 'IN_PROGRESS') return resolve();
          const e = queue.shift();
          const action = KJ.Combat.chooseEnemyAction(battle, e);
          if (action) {
            KJ.Combat.applyAction(battle, action);
            const last = battle.log[battle.log.length - 1];
            if (last && last.kind === 'action') {
              const tEl = document.querySelector('[data-id="' + last.data.target.id + '"]');
              if (tEl) KJ.Effects.damageNumber(tEl, last.data.result.amount, {
                crit: last.data.result.crit, super: last.data.result.super
              });
            }
            draw();
          }
          setTimeout(step, 500);
        }
        setTimeout(step, 300);
      });
    }

    function onVictory() {
      // Compute rewards
      const r = scene.rewards || {};
      const gold = Array.isArray(r.gold) ? KJ.randInt(r.gold[0], r.gold[1]) : (r.gold || 0);
      const xp = r.xp || 0;
      const state = KJ.State.get();
      state.inventory.gold += gold;
      state.player.xp += xp;
      // Process gear drops
      const drops = Array.isArray(r.drops) ? r.drops : [];
      let anyDropped = false;
      drops.forEach(d => {
        if (!d || !d.gear) return;
        const gearDef = KJ.Registry.gear.get(d.gear);
        if (!gearDef) return;
        const chance = (typeof d.chance === 'number') ? d.chance : 1;
        if (Math.random() > chance) return;
        if (!state.inventory.gear.includes(d.gear)) {
          state.inventory.gear.push(d.gear);
        }
        anyDropped = true;
        // Stagger toasts so they don't stack
        setTimeout(() => {
          KJ.Effects.toast('Got: ' + gearDef.name, { icon: gearDef.emoji });
          KJ.Audio.play('gold');
        }, 200 + drops.indexOf(d) * 400);
      });
      checkLevelUp(state);
      state.progress.flags['tutorial_battle_done'] = true;
      KJ.Events.emit('battle_won', { enemies: scene.enemies, xp, gold });
      KJ.Effects.confetti(40);
      KJ.Effects.bigText('VICTORY!');
      KJ.Audio.play('fanfare');
      if (anyDropped) {
        setTimeout(() => KJ.Effects.bigText('LOOT!'), 900);
      }
      const delay = anyDropped ? 2200 : 1400;
      setTimeout(() => {
        KJ.UI.LevelUp.showIfPending(() => {
          if (scene.next) ctx.goto(scene.next);
        });
      }, delay);
    }

    function onDefeat() {
      KJ.Events.emit('party_knocked_out', { scene: scene.id });
      KJ.Audio.play('sad');
      const rescueData = crownRescueLine();
      const app = document.getElementById('app');
      app.innerHTML = `
        ${KJ.UI.HUD.html()}
        <div class="kj-scene-wrap kj-bg-rescue">
          <div class="kj-rescue-crown">👑✨</div>
          <div class="kj-crown-bubble">${rescueData.text}</div>
          <div class="kj-caption">You wake up back at the castle. Your stuff is safe!</div>
          <div class="kj-choices">
            <button class="kj-choice-btn" id="kj-btn-home">🏰 Back to Castle</button>
          </div>
        </div>
      `;
      KJ.UI.HUD.attach();
      if (rescueData.audioPath) {
        setTimeout(() => KJ.Audio.voicePath(rescueData.audioPath), 800);
      }
      document.getElementById('kj-btn-home').onclick = () => {
        // Reset the quest to its entry
        const qid = (scene._questId || '');
        if (qid) {
          delete KJ.State.get().progress.questsInProgress[qid];
        }
        KJ.UI.Castle.render();
      };
    }

    function crownRescueLine() {
      const pool = KJ.Registry.crownDialogue.filter(p => p.context === 'death_rescue')[0];
      if (!pool || !pool.lines.length) return { text: '👑 "You are safe, somehow."', audioPath: null };
      const idx = Math.floor(Math.random() * pool.lines.length);
      return {
        text: '👑 "' + pool.lines[idx] + '"',
        audioPath: `audio/voices/crown/cd_${pool.id}_${idx}.mp3`,
      };
    }

    function checkLevelUp(state) {
      while (state.player.xp >= KJ.xpForLevel(state.player.level + 1)) {
        state.player.level++;
        state.player.pendingStatPoints += KJ.STAT_POINTS_PER_LEVEL;
        if (state.player.level % KJ.TRAIT_EVERY_N_LEVELS === 0) {
          state.player.pendingTraitPicks++;
        }
        KJ.Events.emit('level_up', { newLevel: state.player.level });
        KJ.Audio.play('levelup');
        KJ.Effects.bigText('LEVEL UP!');
      }
    }

    run();
  }

  return { render };
})();

KJ.Registry.sceneTypes.add({
  id: 'battle',
  render: (scene, ctx) => KJ.UI.BattleScene.render(scene, ctx),
});
