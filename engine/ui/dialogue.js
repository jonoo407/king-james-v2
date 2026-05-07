// King James 2 — Dialogue / Cutscene Scene Renderer
// Data shape: { type: 'dialogue', bg, beats:[{speaker,text}], effects, next }

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.DialogueScene = (function () {

  function render(scene, ctx) {
    const app = document.getElementById('app');
    const bg = scene.bg || 'neutral';
    const beats = (scene.beats || []).slice();
    let idx = 0;

    // Optional celebration video — used by per-arc reward scenes
    // (forest_reward, mountain_reward, beach_reward, desert_reward).
    // Plays muted + autoplay + playsinline (iOS-safe), no loop, holds on
    // last frame while the kid reads the dialogue beats. Falls back to
    // no header if scene.video is unset.
    const videoHtml = scene.video
      ? `<video class="kj-dialogue-video" src="${scene.video}" autoplay muted playsinline preload="auto"></video>`
      : '';

    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-scene-wrap kj-bg-${bg}">
        <div class="kj-dialogue-stage" id="kj-dialogue-stage">
          ${videoHtml}
          <div class="kj-dialogue-speaker" id="kj-dialogue-speaker"></div>
          <div class="kj-dialogue-text" id="kj-dialogue-text"></div>
        </div>
        <div class="kj-choices">
          <button class="kj-choice-btn" id="kj-next">▶️ Next</button>
        </div>
      </div>
    `;
    KJ.UI.HUD.attach();

    function showBeat() {
      if (idx >= beats.length) return done();
      const b = beats[idx];
      document.getElementById('kj-dialogue-speaker').innerHTML = speakerDisplay(b.speaker);
      document.getElementById('kj-dialogue-text').textContent = b.text;
      KJ.Audio.voice(b.speaker, scene.id, idx);
      idx++;
      if (idx >= beats.length) {
        document.getElementById('kj-next').textContent = '▶️ Done';
      }
    }

    function done() {
      if (scene.effects) ctx.applyEffects(scene.effects);
      if (scene.next) ctx.goto(scene.next);
    }

    document.getElementById('kj-next').onclick = () => {
      KJ.Audio.play('click');
      if (idx >= beats.length) done();
      else showBeat();
    };

    showBeat();
  }

  function speakerDisplay(s) {
    return ({
      crown: '👑 <em>The Crown</em>',
      james: '🧒 James',
      narrator: '📜 Narrator',
      foxy: '🦊 Foxy',
      ribbit: '🐸 Ribbit',
      owlette: '🦉 Owlette',
      gus: '🐐 Gus',
      frostbeard: '🧔‍♂️ Sir Frostbeard',
      yeti: '🦍❄️ Papa Yeti',
      wraith: '👻 Glimmer',
      pompadour: '💅 Dame Pompadour',
      mornox: '🧙‍♂️ Mornox',
      sirena:  '🧜‍♀️ Queen Sirena',
      finn:    '🦦 Finn',
      joon:    '👦 Joon',
      drifter: '🧙‍♀️ Drifter',
      zephyra: '🧙‍♀️ Zephyra',
      widow:   '👵 The Widow',
    })[s] || (s || '');
  }

  return { render };
})();

KJ.Registry.sceneTypes.add({
  id: 'dialogue',
  render: (scene, ctx) => KJ.UI.DialogueScene.render(scene, ctx),
});
