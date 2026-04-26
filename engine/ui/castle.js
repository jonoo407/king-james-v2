// King James 2 — Castle Hub (Throne Hall)
// Central UI: crown speech, room navigation, mentor voice.

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.Castle = (function () {

  function render() {
    const state = KJ.State.get();
    // Resolve any pending level-up allocations before showing the hub
    if (KJ.UI.LevelUp &&
        (state.player.pendingStatPoints > 0 || state.player.pendingTraitPicks > 0)) {
      KJ.UI.LevelUp.showIfPending(() => KJ.UI.Castle.render());
      return;
    }
    const app = document.getElementById('app');
    const crownData = pickCrownLine('castle_general');
    const rooms = availableRooms(state);

    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-castle-bg kj-scene-wrap">
        <div class="kj-castle-throne">
          <div class="kj-throne-crown" title="Click for crown hint">👑</div>
          <div class="kj-crown-bubble">${crownData.text}</div>
        </div>

        <div class="kj-castle-rooms">
          ${rooms.map(r => `
            <button class="kj-room-card" data-room="${r.id}">
              <div class="kj-room-emoji">${r.emoji}</div>
              <div class="kj-room-name">${r.name}</div>
            </button>
          `).join('')}
        </div>

        <div class="kj-castle-footer">
          <button class="kj-btn-secondary" id="kj-btn-reset" title="Start over">🆕 New Game</button>
        </div>
      </div>
    `;

    KJ.UI.HUD.attach();
    attachRooms(rooms);
    // Voice the crown bubble line (400ms delay so the render is visible first)
    if (crownData.poolId) {
      setTimeout(() => KJ.Audio.voicePath(
        `audio/voices/crown/cd_${crownData.poolId}_${crownData.lineIdx}.mp3`
      ), 400);
    }
    const resetBtn = document.getElementById('kj-btn-reset');
    if (resetBtn) resetBtn.onclick = () => {
      // Two-step gate: a kid can hit one confirm by accident, two means intent.
      // First prompt: vague — lots of kids tap through. Second prompt asks them
      // to type "RESET" so it's an actual decision, not a tantrum-tap.
      if (!confirm('Start over? All progress will be erased.')) return;
      const typed = prompt('Type RESET (in capitals) to confirm. Cancel to keep your save.');
      if (typed !== 'RESET') return;
      KJ.State.reset();
      KJ.Scene.goto('intro_mud');
    };
  }

  function availableRooms(state) {
    // Built-in rooms defined here; additional via Registry.castleRooms
    const builtin = [
      { id: 'map',    name: 'Kingdom Map', emoji: '🗺️' },
      { id: 'gear',   name: 'Gear Chest',  emoji: '📦' },
      { id: 'ally',   name: 'Ally Room',   emoji: '🏠' },
      { id: 'library',name: 'Library',     emoji: '📚' },
      { id: 'armory', name: 'Armory',      emoji: '🔨' },
      { id: 'trophy', name: 'Trophy Hall', emoji: '🏆' },
    ];
    const installed = KJ.Registry.castleRooms.all();
    const all = [...builtin, ...installed];
    const unlocked = state.progress.castleRooms || [];
    return all.filter(r => unlocked.includes(r.id));
  }

  function attachRooms(rooms) {
    document.querySelectorAll('.kj-room-card').forEach(btn => {
      btn.onclick = () => {
        KJ.Audio.play('click');
        const id = btn.dataset.room;
        openRoom(id);
      };
    });
  }

  function openRoom(id) {
    switch (id) {
      case 'map':
        if (KJ.UI.Map && KJ.UI.Map.render) KJ.UI.Map.render();
        else toast('Map coming soon');
        break;
      case 'gear':
        if (KJ.UI.GearChest && KJ.UI.GearChest.render) KJ.UI.GearChest.render();
        else toast('Gear Chest coming soon');
        break;
      case 'ally':
        if (KJ.UI.AllyRoom && KJ.UI.AllyRoom.render) KJ.UI.AllyRoom.render();
        else toast('Ally Room coming soon');
        break;
      case 'library':
        if (KJ.UI.Library && KJ.UI.Library.render) KJ.UI.Library.render();
        else toast('Library unavailable');
        break;
      case 'armory':
        if (KJ.UI.Armory && KJ.UI.Armory.render) KJ.UI.Armory.render();
        else toast('Armory coming soon');
        break;
      case 'trophy':
        if (KJ.UI.TrophyHall && KJ.UI.TrophyHall.render) KJ.UI.TrophyHall.render();
        else toast('No trophies yet!');
        break;
      default:
        // Check registered rooms
        const room = KJ.Registry.castleRooms.get(id);
        if (room && room.open) room.open({ state: KJ.State.get() });
        else toast('Unknown room: ' + id);
    }
  }

  function pickCrownLine(context) {
    const state = KJ.State.get();
    const coherence = state.progress.crownCoherence || 0;
    const pools = KJ.Registry.crownDialogue.all()
      .filter(p => p.context === context && p.coherenceRequired <= coherence);
    // pick highest coherence-required pool the player qualifies for
    pools.sort((a, b) => b.coherenceRequired - a.coherenceRequired);
    if (!pools.length) return { text: '👑 ...', poolId: null, lineIdx: 0 };
    const pool = pools[0];
    const lineIdx = Math.floor(Math.random() * pool.lines.length);
    return { text: pool.lines[lineIdx], poolId: pool.id, lineIdx };
  }

  function toast(msg) { KJ.Effects.toast(msg); }

  // Helper: go "back" from a sub-screen like Character or Gear Chest.
  // If we're mid-quest, re-render the current scene (kid picked up in the middle of something).
  // Otherwise, return to the Castle hub.
  function back() {
    const cur = KJ.Scene.current();
    if (cur && cur.id && cur.id !== 'castle' && cur.type !== '_castle') {
      KJ.Scene.goto(cur.id);
    } else {
      KJ.UI.Castle.render();
    }
  }

  return { render, pickCrownLine, back };
})();
