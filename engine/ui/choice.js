// King James 2 — Choice Scene Renderer
// Data shape: { type: 'choice', art, bg, caption, crownLine, choices:[...] }

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.ChoiceScene = (function () {

  function render(scene, ctx) {
    const app = document.getElementById('app');
    const bg = scene.bg || 'neutral';
    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-scene-wrap kj-bg-${bg}">
        <div class="kj-scene-art">${scene.art || '❓'}</div>
        ${scene.crownLine ? `<div class="kj-crown-bubble">👑 ${scene.crownLine}</div>` : ''}
        <div class="kj-caption">${scene.caption || ''}</div>
        <div class="kj-choices" id="kj-choices"></div>
      </div>
    `;
    KJ.UI.HUD.attach();
    const cont = document.getElementById('kj-choices');
    (scene.choices || []).forEach((c, i) => {
      if (!KJ.Scene.checkCondition(c.condition)) return;
      const btn = document.createElement('button');
      btn.className = 'kj-choice-btn';
      btn.innerHTML = `<span class="kj-choice-icon">${c.icon || '▶️'}</span> <span>${c.label}</span>`;
      btn.onclick = () => {
        KJ.Audio.play('click');
        if (c.effects) ctx.applyEffects(c.effects);
        if (c.next) ctx.goto(c.next);
      };
      cont.appendChild(btn);
    });
  }

  return { render };
})();

// Register renderer
KJ.Registry.sceneTypes.add({
  id: 'choice',
  render: (scene, ctx) => KJ.UI.ChoiceScene.render(scene, ctx),
});
