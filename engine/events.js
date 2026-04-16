// King James 2 — Event Bus
// Pub/sub so features can hook without engine knowing about them.
// Usage:
//   KJ.Events.on('battle_won', data => { ... });
//   KJ.Events.emit('battle_won', { enemies, hpRemaining });

window.KJ = window.KJ || {};

KJ.Events = (function () {
  const listeners = new Map(); // event name -> Set<handler>

  function on(event, handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(handler);
    return () => off(event, handler); // unsubscribe fn
  }

  function off(event, handler) {
    const set = listeners.get(event);
    if (set) set.delete(handler);
  }

  function emit(event, payload) {
    const set = listeners.get(event);
    if (!set) return;
    for (const h of Array.from(set)) {
      try { h(payload); }
      catch (e) { console.error('[Events] handler error for', event, e); }
    }
  }

  // debug helper
  function _dump() {
    const out = {};
    for (const [k, v] of listeners) out[k] = v.size;
    return out;
  }

  return { on, off, emit, _dump };
})();
