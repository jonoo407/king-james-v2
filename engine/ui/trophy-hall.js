// King James 2 — Trophy Hall (v1 stub)
window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.TrophyHall = (function () {
  function render() {
    const state = KJ.State.get();
    const app = document.getElementById('app');
    const trophies = state.progress.trophies || [];
    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-scene-wrap kj-trophy-bg">
        <h2 class="kj-h2">🏆 Trophy Hall</h2>
        <div class="kj-trophy-row">
          ${trophies.length === 0
            ? '<em>No trophies yet. Beat a boss!</em>'
            : trophies.map(id => `<span class="kj-trophy">🗿 ${id}</span>`).join('')}
        </div>
        <div class="kj-footer-nav">
          <button class="kj-btn-secondary" id="kj-btn-back">⬅️ Back</button>
        </div>
      </div>
    `;
    KJ.UI.HUD.attach();
    document.getElementById('kj-btn-back').onclick = () => {
      KJ.Audio.play('click');
      KJ.UI.Castle.render();
    };
  }
  return { render };
})();
