// King James 2 — Profiles
// Multi-profile save management. One save key per profile, plus an "active"
// pointer the State module reads to know which slot to read/write.
//
// Storage:
//   king_james_2_save:<normalized_name>   per-profile save (existing State shape)
//   king_james_2_active                   normalized name of the active profile
//   king_james_2_save                     legacy single-slot key (migrated on first boot)

window.KJ = window.KJ || {};

KJ.Profiles = (function () {
  const PREFIX = 'king_james_2_save:';
  const ACTIVE_KEY = 'king_james_2_active';
  const LEGACY_KEY = 'king_james_2_save';
  const MAX_LEN = 12;

  function trimAndCollapse(s) {
    return String(s || '').trim().replace(/\s+/g, ' ');
  }

  function validate(displayName) {
    const s = trimAndCollapse(displayName);
    if (s.length === 0) return { ok: false, error: 'Type a name first.' };
    if (s.length > MAX_LEN) return { ok: false, error: `Too long — ${MAX_LEN} letters max.` };
    if (!/[\p{L}\p{N}]/u.test(s)) return { ok: false, error: 'Need a letter or number.' };
    return { ok: true };
  }

  function normalize(displayName) {
    if (!validate(displayName).ok) return null;
    return trimAndCollapse(displayName).toLowerCase();
  }

  function displayOf(displayName) {
    if (!validate(displayName).ok) return null;
    return trimAndCollapse(displayName);
  }

  function exists(name) {
    return localStorage.getItem(PREFIX + name) !== null;
  }

  function list() {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      let data = null;
      try { data = JSON.parse(localStorage.getItem(k)); } catch (e) { continue; }
      if (!data) continue;
      out.push({
        name: k.slice(PREFIX.length),
        displayName: (data.meta && data.meta.profileDisplayName) || k.slice(PREFIX.length),
        lastSavedAt: (data.meta && data.meta.lastSavedAt) || 0,
        level: (data.player && data.player.level) || 1,
        treasures: (data.progress && Array.isArray(data.progress.treasures)) ? data.progress.treasures.length : 0,
      });
    }
    out.sort((a, b) => b.lastSavedAt - a.lastSavedAt);
    return out;
  }

  function getActive() { return localStorage.getItem(ACTIVE_KEY); }
  function setActive(name) {
    if (!name) return false;
    localStorage.setItem(ACTIVE_KEY, name);
    return true;
  }
  function clearActive() { localStorage.removeItem(ACTIVE_KEY); }

  function create(displayName) {
    const v = validate(displayName);
    if (!v.ok) return { created: false, error: v.error };
    const name = normalize(displayName);
    if (exists(name)) return { created: false, error: "That name's taken — pick it below." };
    const fresh = KJ.State.freshState();
    fresh.meta = fresh.meta || {};
    fresh.meta.profileDisplayName = displayOf(displayName);
    fresh.meta.lastSavedAt = Date.now();
    localStorage.setItem(PREFIX + name, JSON.stringify(fresh));
    setActive(name);
    KJ.State.replace(fresh);
    return { created: true, name };
  }

  function load(name) {
    if (!exists(name)) return { loaded: false, reason: 'no_save' };
    setActive(name);
    return KJ.State.load();
  }

  function deleteProfile(name) {
    if (!exists(name)) return { deleted: false, reason: 'no_save' };
    localStorage.removeItem(PREFIX + name);
    if (getActive() === name) clearActive();
    return { deleted: true };
  }

  function hasLegacySave() { return localStorage.getItem(LEGACY_KEY) !== null; }

  function migrateLegacy(displayName) {
    const v = validate(displayName);
    if (!v.ok) return { migrated: false, error: v.error };
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return { migrated: false, error: 'No legacy save to migrate.' };
    const name = normalize(displayName);
    if (exists(name)) return { migrated: false, error: "That name's taken — pick it below." };
    let data = null;
    try { data = JSON.parse(raw); } catch (e) {
      return { migrated: false, error: 'Legacy save was corrupted.' };
    }
    data.meta = data.meta || {};
    data.meta.profileDisplayName = displayOf(displayName);
    localStorage.setItem(PREFIX + name, JSON.stringify(data));
    localStorage.removeItem(LEGACY_KEY);
    return { migrated: true, name };
  }

  return {
    validate, normalize,
    list, exists,
    create, load, delete: deleteProfile,
    getActive, setActive, clearActive,
    hasLegacySave, migrateLegacy,
    PREFIX, ACTIVE_KEY, LEGACY_KEY,
  };
})();
