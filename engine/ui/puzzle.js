// King James 2 — Puzzle Scene Renderer
// v1 supports 'word_riddle' subtype.
// Data shape: { type: 'puzzle', puzzleType: 'word_riddle', data: {...}, next, onSolveAllNoHints }

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.PuzzleScene = (function () {

  function render(scene, ctx) {
    const sub = scene.puzzleType;
    if (sub === 'word_riddle') return renderWordRiddle(scene, ctx);
    renderUnknown(scene, ctx);
  }

  function renderWordRiddle(scene, ctx) {
    const app = document.getElementById('app');
    const bg = scene.bg || 'forest_clearing';
    const d = scene.data || {};
    const riddles = d.riddles || [];
    let idx = 0;
    let triesThis = 0;
    let hintsUsed = 0;

    function show() {
      if (idx >= riddles.length) return done();
      const r = riddles[idx];
      app.innerHTML = `
        ${KJ.UI.HUD.html()}
        <div class="kj-scene-wrap kj-bg-${bg}">
          <div class="kj-scene-art">🌳</div>
          <div class="kj-caption kj-riddle-prompt">${r.prompt}</div>
          <div class="kj-choices" id="kj-puzzle-opts"></div>
          <div class="kj-puzzle-progress">Riddle ${idx + 1} of ${riddles.length} · ${hintsUsed} hints used</div>
        </div>
      `;
      KJ.UI.HUD.attach();
      const cont = document.getElementById('kj-puzzle-opts');
      r.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'kj-choice-btn';
        btn.innerHTML = `<span class="kj-choice-icon">${opt}</span>`;
        btn.onclick = () => pick(r, i);
        cont.appendChild(btn);
      });
    }

    function pick(r, i) {
      KJ.Audio.play('click');
      if (i === r.correct) {
        KJ.Audio.play('star');
        KJ.Effects.toast('Correct!', { icon: '✅' });
        idx++; triesThis = 0;
        show();
      } else {
        triesThis++;
        if (triesThis >= 2 && d.allowHints) {
          hintsUsed++;
          KJ.Effects.toast('🦉 Owlette: the answer is... that one!', {});
          setTimeout(() => {
            idx++; triesThis = 0; show();
          }, 1500);
        } else {
          KJ.Audio.play('weak');
          KJ.Effects.toast('Try again!', { icon: '❌' });
        }
      }
    }

    function done() {
      if (hintsUsed === 0 && scene.onSolveAllNoHints) {
        ctx.applyEffects(scene.onSolveAllNoHints);
      }
      if (scene.effects) ctx.applyEffects(scene.effects);
      if (scene.next) ctx.goto(scene.next);
    }

    show();
  }

  function renderUnknown(scene, ctx) {
    const app = document.getElementById('app');
    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-scene-wrap">
        <h2>🧩 Puzzle: ${scene.puzzleType}</h2>
        <em>(Not yet implemented)</em>
        <div class="kj-footer-nav">
          <button class="kj-choice-btn" id="kj-btn-skip">⏭️ Skip</button>
        </div>
      </div>
    `;
    KJ.UI.HUD.attach();
    document.getElementById('kj-btn-skip').onclick = () => {
      if (scene.effects) ctx.applyEffects(scene.effects);
      if (scene.next) ctx.goto(scene.next);
    };
  }

  return { render };
})();

KJ.Registry.sceneTypes.add({
  id: 'puzzle',
  render: (scene, ctx) => KJ.UI.PuzzleScene.render(scene, ctx),
});
