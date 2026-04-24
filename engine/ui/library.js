// King James 2 — Library UI
// Craft magical scrolls with gold. Scrolls are consumables used in battle.

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.Library = (function () {

  function render() {
    const state = KJ.State.get();
    const app = document.getElementById('app');
    const scrolls = KJ.Registry.scrolls.all();

    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-scene-wrap kj-library-bg">
        <h2 class="kj-h2">📚 Library</h2>
        <div class="kj-lib-tabs">
          <button class="kj-btn-secondary" id="kj-btn-elements">📖 Elements Guide</button>
        </div>
        <p class="kj-muted" style="text-align:center;">Craft magical scrolls. Use them in battle.</p>
        <div class="kj-scroll-shop">
          ${scrolls.map(s => scrollCard(s, state)).join('')}
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
    document.getElementById('kj-btn-elements').onclick = () => {
      KJ.Audio.play('click');
      renderGuide();
    };
    document.querySelectorAll('.kj-scroll-buy').forEach(b => {
      b.onclick = () => {
        KJ.Audio.play('click');
        buy(b.dataset.scroll);
        render();
      };
    });
  }

  function renderGuide() {
    const app = document.getElementById('app');
    const T = KJ.Types;
    const order = ['fire','earth','wind','water','magic'];

    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-scene-wrap kj-library-bg">
        <h2 class="kj-h2">📖 Elements Guide</h2>
        <div class="kj-elem-mnemonic">
          Water puts out Fire. Fire burns Plants. Plants stop Wind. Wind blows Magic. Magic splits Water.
        </div>
        <div class="kj-elem-circle">
          ${order.map((t, i) => `
            <div class="kj-elem-node" data-elem="${t}">
              <div class="kj-elem-big">${T.ICONS[t]}</div>
              <div class="kj-elem-name">${T.LABELS[t]}</div>
              <div class="kj-elem-line">${T.MNEMONIC[t]}</div>
            </div>
          `).join('')}
        </div>

        <h3 class="kj-h3" style="text-align:center;">Tap a type to learn</h3>
        <div class="kj-elem-strip">
          ${order.map(t => `<button class="kj-elem-btn" data-type="${t}">${T.ICONS[t]}</button>`).join('')}
        </div>
        <div class="kj-elem-detail" id="kj-elem-detail">Tap an icon above.</div>

        <div class="kj-footer-nav">
          <button class="kj-btn-secondary" id="kj-btn-back2">⬅️ Back</button>
        </div>
      </div>
    `;
    KJ.UI.HUD.attach();
    document.getElementById('kj-btn-back2').onclick = () => {
      KJ.Audio.play('click');
      render();
    };
    document.querySelectorAll('.kj-elem-btn').forEach(b => {
      b.onclick = () => {
        KJ.Audio.play('click');
        showDetail(b.dataset.type);
      };
    });
  }

  function showDetail(type) {
    const T = KJ.Types;
    // What does this type BEAT (forward super-effective)?
    const beats = T.list.find(d => T.effectiveness(type, d) >= KJ.TUNABLES.superEffectiveMult);
    // What type beats THIS type (reverse super-effective)?
    const beatenBy = T.list.find(a => T.effectiveness(a, type) >= KJ.TUNABLES.superEffectiveMult);

    const el = document.getElementById('kj-elem-detail');
    el.innerHTML = `
      <div class="kj-elem-card">
        <div class="kj-elem-title">${T.ICONS[type]} ${T.LABELS[type]}</div>
        <div>Beats: ${beats ? T.ICONS[beats] + ' ' + T.LABELS[beats] : '—'}</div>
        <div>Weak to: ${beatenBy ? T.ICONS[beatenBy] + ' ' + T.LABELS[beatenBy] : '—'}</div>
      </div>
    `;
  }

  function scrollCard(s, state) {
    const owned = state.inventory.consumables[s.id] || 0;
    const price = KJ.Traits ? KJ.Traits.priceAfterDiscount(s.price) : s.price;
    const canAfford = state.inventory.gold >= price;
    const discountTag = price !== s.price ? ' <em style="color:#6f6">(Fast Talker)</em>' : '';
    return `
      <div class="kj-scroll-card">
        <div class="kj-scroll-top">
          <span class="kj-scroll-emoji">${s.emoji}</span>
          <span class="kj-scroll-name">${s.name}</span>
          <span class="kj-scroll-owned" title="in inventory">x${owned}</span>
        </div>
        <div class="kj-scroll-desc">${s.desc}</div>
        <div class="kj-scroll-foot">
          <span class="kj-scroll-price">🪙 ${price}${discountTag}</span>
          <button class="kj-scroll-buy kj-btn-secondary" data-scroll="${s.id}" ${canAfford ? '' : 'disabled'}>Craft</button>
        </div>
      </div>
    `;
  }

  function buy(sid) {
    const state = KJ.State.get();
    const s = KJ.Registry.scrolls.get(sid);
    if (!s) return;
    const price = KJ.Traits ? KJ.Traits.priceAfterDiscount(s.price) : s.price;
    if (state.inventory.gold < price) {
      KJ.Effects.toast('Not enough gold');
      return;
    }
    state.inventory.gold -= price;
    state.inventory.consumables[sid] = (state.inventory.consumables[sid] || 0) + 1;
    KJ.Events.emit('gold_changed', { delta: -price });
    KJ.Audio.play('star');
    KJ.Effects.toast('Crafted: ' + s.name, { icon: s.emoji });
  }

  return { render };
})();
