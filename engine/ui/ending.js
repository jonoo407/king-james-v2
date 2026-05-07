// King James 2 — Ending Scene Renderer (Volcano finale curtain)
// Data shape:
//   { id, type: 'ending', bg, beats: [{speaker,text}], showBadges, showTrophies,
//     video?, effects, next }
//
// Renders the closing-credit card: optionally a portrait video header
// (autoplays once, freezes on last frame) followed by a sequence of beats
// (Crown's sign-off, voiced) and a summary panel of every badge earned and
// trophy collected, then a single "End" button that runs effects + goes to
// next. If no `video` field, falls back to the original 👑 emoji header.

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.EndingScene = (function () {

  function render(scene, ctx) {
    const app = document.getElementById('app');
    const bg = scene.bg || 'volcano';
    const beats = (scene.beats || []).slice();
    let idx = 0;

    // Header: video if specified, else the wobbling crown emoji.
    // muted + playsinline are required for iOS Safari autoplay; loop is OFF
    // so the video plays once and the last frame holds while the kid reads
    // the Crown's sign-off beats.
    const headerHtml = scene.video
      ? `<video class="kj-ending-video" src="${scene.video}" autoplay muted playsinline preload="auto"></video>`
      : `<div class="kj-ending-crown">👑</div>`;

    app.innerHTML = `
      <div class="kj-scene-wrap kj-bg-${bg} kj-ending-wrap">
        <div class="kj-ending-stage">
          ${headerHtml}
          <div class="kj-ending-speaker" id="kj-ending-speaker"></div>
          <div class="kj-ending-text" id="kj-ending-text"></div>
          <div class="kj-ending-summary" id="kj-ending-summary" style="display:none"></div>
        </div>
        <div class="kj-choices">
          <button class="kj-choice-btn kj-big-btn" id="kj-ending-next">▶️ Next</button>
        </div>
      </div>
    `;

    function showBeat() {
      if (idx >= beats.length) return showSummary();
      const b = beats[idx];
      document.getElementById('kj-ending-speaker').innerHTML = speakerLine(b.speaker);
      document.getElementById('kj-ending-text').textContent = b.text;
      if (KJ.Audio && KJ.Audio.voice) KJ.Audio.voice(b.speaker, scene.id, idx);
      idx++;
    }

    function showSummary() {
      const state = KJ.State.get();
      const earned = (state.progress.badges || [])
        .map(id => KJ.Registry.badges.get(id)).filter(Boolean);
      const trophies = (state.progress.trophies || []);

      const badgeHtml = scene.showBadges !== false && earned.length
        ? `<div class="kj-ending-section">
             <div class="kj-ending-section-title">🎖️ Badges (${earned.length})</div>
             <div class="kj-ending-badges">${earned.map(b =>
               `<span class="kj-badge-chip" title="${b.description||''}">${b.emoji||'🎖️'} ${b.name}</span>`
             ).join('')}</div>
           </div>` : '';

      const trophyHtml = scene.showTrophies !== false && trophies.length
        ? `<div class="kj-ending-section">
             <div class="kj-ending-section-title">🏆 Trophies (${trophies.length})</div>
             <div class="kj-ending-trophies">${trophies.map(t =>
               `<span class="kj-trophy-chip">🏆 ${t}</span>`
             ).join('')}</div>
           </div>` : '';

      document.getElementById('kj-ending-text').textContent = '';
      document.getElementById('kj-ending-speaker').innerHTML = '';
      const sum = document.getElementById('kj-ending-summary');
      sum.style.display = 'block';
      sum.innerHTML = `
        <div class="kj-ending-final">
          <div class="kj-ending-headline">🌟 The End 🌟</div>
          ${badgeHtml}
          ${trophyHtml}
        </div>
      `;
      document.getElementById('kj-ending-next').textContent = '▶️ End';
      idx = -1; // marker: now in summary, next click = done
    }

    function done() {
      if (scene.effects) ctx.applyEffects(scene.effects);
      if (scene.next) ctx.goto(scene.next);
    }

    document.getElementById('kj-ending-next').onclick = () => {
      if (KJ.Audio && KJ.Audio.play) KJ.Audio.play('click');
      if (idx === -1) done();
      else showBeat();
    };

    showBeat();
  }

  function speakerLine(s) {
    return ({
      crown: '👑 <em>The Crown</em>',
      james: '🧒 James',
      narrator: '📜 Narrator',
      mornox: '🧙‍♂️ Mornox',
    })[s] || (s || '');
  }

  return { render };
})();

KJ.Registry.sceneTypes.add({
  id: 'ending',
  render: (scene, ctx) => KJ.UI.EndingScene.render(scene, ctx),
});
