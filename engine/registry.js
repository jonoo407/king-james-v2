// King James 2 — Plugin Registries
// Data files (catalogs + quests) register entries here at load time.
// Engine code reads via Registry.<kind>.get(id) / .all() / .has(id).
//
// CRITICAL RULE: engine/*.js MUST NEVER hard-code specific content IDs
// (e.g., 'foxy', 'gem_of_wisdom'). Engine dispatches by type, never by name.

window.KJ = window.KJ || {};

KJ._RegistryClass = class Registry {
  constructor(kind) {
    this.kind = kind;
    this._map = new Map();
  }
  add(entry) {
    if (!entry || !entry.id) {
      throw new Error(`[registry:${this.kind}] add() requires an {id}`);
    }
    if (this._map.has(entry.id)) {
      console.warn(`[registry:${this.kind}] overriding existing id=${entry.id}`);
    }
    this._map.set(entry.id, entry);
    return entry;
  }
  get(id) { return this._map.get(id); }
  has(id) { return this._map.has(id); }
  all() { return Array.from(this._map.values()); }
  ids() { return Array.from(this._map.keys()); }
  size() { return this._map.size; }
  filter(pred) { return this.all().filter(pred); }
};

KJ.Registry = {
  moves:         new KJ._RegistryClass('move'),
  gear:          new KJ._RegistryClass('gear'),
  allies:        new KJ._RegistryClass('ally'),
  enemies:       new KJ._RegistryClass('enemy'),
  treasures:     new KJ._RegistryClass('treasure'),
  regions:       new KJ._RegistryClass('region'),
  traits:        new KJ._RegistryClass('trait'),
  badges:        new KJ._RegistryClass('badge'),
  quests:        new KJ._RegistryClass('quest'),
  scrolls:       new KJ._RegistryClass('scroll'),
  sceneTypes:    new KJ._RegistryClass('sceneType'),
  castleRooms:   new KJ._RegistryClass('castleRoom'),
  statusEffects: new KJ._RegistryClass('status'),
  crownDialogue: new KJ._RegistryClass('crownContext'),
};
