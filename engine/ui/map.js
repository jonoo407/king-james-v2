// King James 2 — Kingdom Map
// Shows all regions; tap an unlocked one to start (or replay) the quest.

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.Map = (function () {

  function render() {
    const state = KJ.State.get();
    const app = document.getElementById('app');
    const regions = KJ.Registry.regions.all();

    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-map-bg kj-scene-wrap">
        <h2 class="kj-h2">🗺️ Kingdom Map</h2>
        <div class="kj-map-grid">
          ${regions.map(r => renderRegionCard(r, state)).join('')}
        </div>
        <div class="kj-footer-nav">
          <button class="kj-btn-secondary" id="kj-btn-back">⬅️ Back to Castle</button>
        </div>
      </div>
    `;
    KJ.UI.HUD.attach();
    document.getElementById('kj-btn-back').onclick = () => {
      KJ.Audio.play('click'); KJ.UI.Castle.render();
    };
    document.querySelectorAll('.kj-region-card').forEach(b => {
      b.onclick = () => handleRegionClick(b.dataset.region);
    });
  }

  function renderRegionCard(region, state) {
    const locked = isLocked(region, state);
    const completed = state.progress.questsCompleted.includes(region.questId);
    const badge = completed ? '✅' : locked ? '🔒' : '⚔️';
    return `
      <button class="kj-region-card ${locked ? 'locked' : ''}" data-region="${region.id}">
        <div class="kj-region-emoji">${region.emoji}</div>
        <div class="kj-region-name">${region.name}</div>
        <div class="kj-region-badge">${badge}</div>
      </button>
    `;
  }

  function isLocked(region, state) {
    if (region.locked === false) return false;
    if (!region.unlockCondition) return !!region.locked;
    return !KJ.Scene.checkCondition(region.unlockCondition);
  }

  function handleRegionClick(id) {
    const region = KJ.Registry.regions.get(id);
    if (!region) return;
    const state = KJ.State.get();
    if (isLocked(region, state)) {
      KJ.Effects.toast('Locked. Come back later!', { icon: '🔒' });
      return;
    }
    KJ.Audio.play('click');
    const quest = KJ.Registry.quests.get(region.questId);
    if (!quest) {
      KJ.Effects.toast('This region has no quest yet!', { icon: '🚧' });
      return;
    }
    // Pre-quest type hint — what types of enemies to expect + what to bring/avoid
    if (region.primaryEnemyTypes && region.primaryEnemyTypes.length && KJ.Types) {
      const icons = KJ.Types.ICONS;
      const mainType = region.primaryEnemyTypes[0];
      const beats  = KJ.Types.list.find(a => KJ.Types.effectiveness(a, mainType) >= KJ.TUNABLES.superEffectiveMult);
      const loses  = KJ.Types.list.find(d => KJ.Types.effectiveness(mainType, d) >= KJ.TUNABLES.superEffectiveMult);
      const hint = `${region.emoji} Mostly ${icons[mainType]}. Bring ${icons[beats]}! Avoid ${icons[loses]}.`;
      KJ.Effects.toast(hint);
    }
    if (state.progress.questsCompleted.includes(quest.id)) {
      if (!confirm('You already beat this quest. Replay for ½ rewards?')) return;
      // mark as replay (half rewards, no unique drops)
      state.progress.flags['_replay_' + quest.id] = true;
    } else {
      state.progress.flags['_replay_' + quest.id] = false;
    }
    // Resume mid-quest if there's saved progress; else start from entry
    const inprog = state.progress.questsInProgress[quest.id];
    const startScene = (inprog && inprog.sceneId) || quest.entryScene;
    KJ.Scene.goto(startScene);
  }

  return { render };
})();
