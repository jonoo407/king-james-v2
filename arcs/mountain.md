# Mountain Arc — "The Cold Mountain"

> Authoring follow-up arcs? First read [`../DESIGN_LESSONS.md`](../DESIGN_LESSONS.md) and tick the **"Quick checklist for shipping a new arc"** at the bottom.


**Region:** 🏔️ Cold Mountain
**Treasure:** 🗡️ Blade of Bravery → unlocks ⚔️ Armory
**Target level range:** entered at ~lv3, exits at ~lv5
**Estimated length:** 12–14 min playtime, ~14 scenes
**Arc theme:** *Bravery — the scary thing isn't always the villain.*

---

## 1. Story

The mountain village lives in terror. A giant Yeti has been raiding their farms nightly, stealing livestock and breaking fences. Worse — the village heirloom, the **Blade of Bravery**, is missing. A small girl tells James her little brother took the Blade up the mountain *to be a hero* and never came back.

James climbs. He finds Frost Sprites, a surly Mountain Goat, and an old Frozen Knight guarding the way. Deeper up he finally sees the Yeti — huge, red-eyed, terrifying. The obvious move is to fight him.

**But if James listens instead of swings**, the Yeti drops to his knees sobbing. His *baby* was stolen. Not by the village — by an **Ice Wraith** who lives in the cave above. The Wraith stole the Blade too, out of bitter loneliness. Nobody talks about wraiths. He wanted to be remembered, even as a villain.

James rescues Baby Yeti, faces the Wraith, and reclaims the Blade. Papa Yeti joins the final battle (as a buff, not a combatant) if befriended. Village cheers. Armory opens. James goes home with a real weapon and a lesson: **scary isn't the same as bad**.

### The villain
**Glimmer the Ice Wraith** — petty, insecure, attention-starved. Doesn't want to kill the village — just wants them to notice him. Stole the Blade because "it was pretty and they'd finally care about me." Kidnapped Baby Yeti as leverage. Redemption optional at finale (kid picks).

---

## 2. Cast of characters

| Character | Role | Type | Notes |
|---|---|---|---|
| **Gus the Mountain Goat** 🐐 | New ally | 🌿 Earth | Grumpy, dry, territorial. Headbutts problems. Scene ability: **cliff-climb** (opens vertical paths in future arcs) |
| **Frost Sprites** ❄️ | Trash enemy | 💧 Water | Weak to ✨ Magic (magic splits water) — Gem of Wisdom's "Think Fast" is MVP here |
| **Ice Rabbit** 🐇 | Wild-catch | 💧 Water | Optional side-path ally via Friendship Charm |
| **Sir Frostbeard** (Frozen Knight) 🛡️ | Mid-boss | 💧 Water/🌿 Earth | Fights or answers riddles. Honorable. Gruff. |
| **Papa Yeti** 🦍❄️ | Scary-but-sad | Not fought if befriended | Huge, red-eyed, sobs uncontrollably |
| **Baby Yeti** 🐻‍❄️ | Rescue target | NPC | Stolen; used as leverage by Wraith |
| **Glimmer the Wraith** 👻 | Final boss | 💧 Water | Petty, theatrical, lonely |

---

## 3. Scene breakdown

### Act 1 — Base of the mountain (2 scenes)

**mountain_intro** *(dialogue)*
- Crown briefs James: second treasure awaits. Cold winds.
- James: "Swords! Finally a REAL weapon."
- Crown: "The Blade is for people with bravery. Not mouths."

**mountain_village** *(choice)*
Village square. Shivering villagers. Small girl tells the story.
| Option | Cost | Reward |
|---|---|---|
| 🛡️ Visit the blacksmith for a warm tip | -5g | set flag `knows_cave` → shortcut later |
| 🧪 Buy an emergency heal scroll | -25g | +1 Heal Scroll in consumables |
| 🪙 Give the scared girl a coin | -10g | set flag `village_friend` → village bonus at end (+50g) |
| ⛰️ Climb now | 0g | straight to Gus |

No option strictly dominates. Tradeoff: upfront cost vs. late-arc payoff.

---

### Act 2 — The climb (6–7 scenes)

**mountain_goat** *(choice)* — meet Gus.
Gus blocks the path. Smells you. Judges you.
| Option | Cost | Result |
|---|---|---|
| 🍎 Offer an apple | -5g | Recruit Gus |
| 💪 Headbutt contest | -4 HP | Recruit + Gus's respect (flag `gus_respect` → Gus hits harder vs Knight) |
| 🧠 Tell him a clever joke | Needs Owlette | Recruit + Owlette roasts Gus (flavor, +1 gold coin joke) |
| 💨 Push past | 0 | Skip; Gus hireable at Pompadour later |

**mountain_frost** *(battle)* — 2 Frost Sprites (💧 Water type).
- Teaches: ✨ **Magic beats Water** (magic splits water). Kid sees "weak: ✨" on sprite cards — the **Gem of Wisdom's "Think Fast"** (magic pwr 8, the treasure from Forest!) is super here. The **Lucky Charm "Lucky Throw"** (magic pwr 5) also shines. Beautiful payoff for picking up Forest magic gear.
- Rewards: ~14 XP, 10-16g, **25% chance of 💎 Frost Charm** (trinket, +3 DEF +2 SPD, "Ice Shard" water pwr 7).

**mountain_bridge** *(choice)* — icy crevasse to cross.
| Option | Cost | Result |
|---|---|---|
| ⚡ Run across | -3 HP | Fast |
| 🤸 Inch across carefully | 0 | Miss the shiny: no side coin pile |
| 🐸 Ribbit slimes the ice for grip | Needs Ribbit | No cost + bonus +15g (scavenged coins on the slow crossing) |

**mountain_side_rabbit** *(optional wild encounter)* — branch off path.
- Scene offers: explore the burrow (enter wild battle) or skip.
- Battle: Wild Ice Rabbit (lv 3, 18 HP). Charm-capturable below 50% HP.
- Adds ally **Snip** 🐇 (water, fast, scene ability: sniff-out-hidden-things).

**mountain_knight** *(choice)* — Sir Frostbeard guards the summit path.
Gruff frozen knight, honorable. Tests travelers. **Different choice = different gear** (real tradeoff, not a token change).
| Option | Cost | Result |
|---|---|---|
| ⚔️ Fight | Battle | +35 XP, ~30g, **50% chance of ❄️ Frost Fang Sword** (weapon, +5 ATK, "Ice Cut" water pwr 9) |
| 🧠 Answer his 3 courage riddles | Puzzle | +15 XP, badge "Brave Mind", **100% 🪖 Knight's Helm** gifted (armor, +4 DEF +4 HP, "Ward" heal+10) + flag `knight_respect` |
| 🪙 Bribe | -50g | Pass immediately, no XP, no gear. Knight: *"I have kids. I'll take it."* |

**mountain_knight_fight** *(battle)* — Sir Frostbeard (lv 4, 40 HP, water/earth). Uses **Frost Slash** (water, pwr 7).

**mountain_knight_riddle** *(puzzle)* — 3 word riddles about courage:
1. "I'm heavier than stone but you carry me inside. What?" → 💔 Fear / ❤️ Love / 💎 Gem → Fear
2. "I shake but do not fall. I speak but do not shout. What?" → 🍃 Leaf / 💨 Wind / 🫀 Heart → Heart (of a brave person)
3. "I follow you always, bigger at night, scared of morning. What?" → 👤 Shadow / 👻 Ghost / 🦇 Bat → Shadow
- No hints allowed here (raise stakes) — if fail any, reroute to fight.

---

### Act 3 — The summit (4–5 scenes)

**mountain_summit_approach** *(dialogue)* — ominous buildup.
- Crown: "Something HUGE is up here..."
- James: "Pfft. I got this. I got the Blade. Somewhere. I will."
- Crown: "You don't have the Blade yet, genius."

**mountain_yeti** *(choice)* — Papa Yeti appears: giant, red eyes, huge roar.
| Option | Cost | Result |
|---|---|---|
| ⚔️ Attack! | -3 HP scuffle, flag `yeti_angry` | Yeti flees; final boss harder |
| 👂 Put weapon down, listen | 0 | Yeti sobs; flag `yeti_friend`; opens rescue path |
| 🪙 Toss him gold as distraction | -30g | Yeti confused; drops revealing-he's-sad; same as listen |
| 🏃 Flee back | Loop scene | Coward loop (crown scolds) |

**mountain_yeti_listen** *(dialogue)*
- Yeti: *"GRAAR..."* [sniffle] *"...BABY! My baby!"*
- Story comes out: Wraith stole the baby AND the Blade.
- Yeti tells James where the cave is.

**mountain_cave** *(choice)* — wraith's icy lair.
| Option | Cost | Result |
|---|---|---|
| ⚔️ Charge in | 0 | Normal battle |
| 🤫 Sneak in | Needs Foxy | Wraith starts at 75% HP (ambushed) |
| 📜 Prep Fire Bolt first | Consumes 1 Fire Bolt scroll | Wraith takes 15 pre-damage |
| 🪙 Shout + bluff loudly (-10g tossed coin) | -10g | Wraith loses 1 turn "Who dares?!" stunned |

Multiple ways to gain an edge with different currencies (gold / ally / scroll).

**mountain_wraith_battle** *(battle)*
- Normal: **Glimmer the Wraith** (lv 5, 60 HP, 🔥 weak) + 1 Frost Sprite
- If `yeti_angry`: +1 extra Frost Sprite (harder). No heal blessing.
- If `yeti_friend`: pre-battle **heal_party +20** ("Yeti blessing"). Wraith also starts -10 HP.
- Wraith's signature: **Freeze** (water, pwr 8, 20% chance to stun 1 turn — simplified implementation: 20% chance to deal +2 extra damage as a substitute).
- Drops: ~120g, **100% 🧥 Wraith's Cloak** (armor, +4 DEF +3 SPD, "Shadow Step" wind pwr 8). The **Blade of Bravery** itself is granted at the reward scene, not here.

**mountain_reward** *(dialogue)*
- Wraith reduced to a whimper. Optional redemption: James offers friendship. Wraith joins Dame Pompadour's hire list (200g — fun callback).
- Yeti reunites with baby. Massive hug. Yeti gives James the Blade.
- Crown: clearer now (*"Two down, three to go. Also, the village girl says thanks."*)
- Effects:
  - `grant_treasure: blade_of_bravery` (applies +3 ATK + unlocks permanent move **Brave Strike** (fire, pwr 10))
  - `unlock_room: armory`
  - `grant_trophy: wraith_statue`
  - `complete_quest: mountain`
  - `grant_gold: 60`
  - If `village_friend` flag: extra +50g from the girl's thank-you
  - If `gus_respect` flag: Gus gifts 🥾 **Crampon Boots** (boots, +4 SPD +1 DEF, "Sure Step" earth pwr 6) as parting gift
  - `recruit_ally` option: **Baby Yeti** 🐻‍❄️ (water, tank type, slow but huge HP) — OR mark met so Pompadour sells him later

**Full Mountain loot haul (all-paths run):**
- 🗡️ Blade of Bravery (treasure — guaranteed, +3 ATK permanent + "Brave Strike" fire pwr 10)
- ❄️ Frost Fang Sword OR 🪖 Knight's Helm (choice-gated at Frostbeard)
- 🧥 Wraith's Cloak (100%)
- 💎 Frost Charm (25% from Frost Sprites; replayable)
- 🥾 Crampon Boots (if `gus_respect` flag)
- Miscellaneous gold from battles + village bonus

That's **4–5 new gear pieces** plus a permanent treasure bonus — the kid feels the power spike.

Return to castle. Armory appears as a room.

---

## 4. Mechanics this arc uses

| Mechanic | Where | Why |
|---|---|---|
| Pre-combat prep choices (HP/gold/item/ally) | 5 scenes | Core of existing design; this is what we've been tuning |
| Ally-gated options | Goat scene, Bridge, Cave (Ribbit/Owlette/Foxy) | Rewards investment from Forest run |
| Puzzle as combat alternative | Knight scene | Same pattern as Riddle Tree; escalates — no hints allowed |
| Wild catch with Charm | Ice Rabbit side-path | Introduces a water ally; kid spends the 1 Starter Charm |
| Scrolls usable in battle | Cave prep, combat | Pays off the Library crafting loop from session 1 |
| Flag-driven consequences | yeti_friend vs yeti_angry | Kid sees their earlier choice matter in a big fight |
| Treasure with `addMove` | Blade of Bravery unlocks "Brave Strike" | Completes the treasure-bonus system proved with Gem of Wisdom |
| Castle room unlock | Armory opens | Continues the hub-growing sense of progression |
| Dame Pompadour as safety net | Anyone skipped (Gus, Ice Rabbit, Wraith, Baby Yeti) | Missed allies hirable later |

**No new engine mechanics needed.** Everything plugs into existing systems. This is a pure data arc — the proof that our architecture works.

---

## 5. Balance targets (aligned with CONCEPT §P25a)

- James enters at lv 3, exits ~lv 5
- XP earn ceiling (fight-everything run): ~28 (frost) + ~10 (rabbit) + ~35 (knight) + ~80 (wraith) = **~153 XP**, crossing level 4 (105 XP) and approaching level 5 (160 XP)
- XP earn floor (skip-everything run): ~80 (wraith only) = still levels once
- Gold ceiling: ~220g from wins + drops + bonuses
- Gold floor: ~80g if bribe-heavy

**Battle tuning targets:**
- Frost Sprites: 90% win with mash-swing, 100% with any ✨ Magic move (Gem of Wisdom's "Think Fast" crushes; Owlette's Moon Beam works too)
- Sir Frostbeard (water): 70% win with iron sword, 90% with ✨ magic moves or a scroll as backup. Gus's earth moves are neutral here — bring Owlette for type advantage, or accept neutral damage.
- Wraith (water): 60% first try solo, 80-90% with yeti_friend path, 95% with scrolls + yeti_friend

---

## 6. Humor beats (examples — writers' room for dialogue)

**Gus the Goat:**
- "This is MY mountain. You're the guest. Act like it."
- "You smell like flatland."
- "Did you bring snacks? No?? Uncultured."
- "Fine. I lead. You walk in my hoof-prints. Literally."

**Frozen Knight:**
- "HALT, tiny human! What is the nature of — oh, oh you're a KID kid. Huh."
- [bribe] "Knights have families too. I'll take it. Don't tell anyone."
- [riddle correct] "...fine. You thought about it. Rare."

**Papa Yeti:**
- "GRAAAAAAR!" [sniffle] "GRAAAAR!" [big tear]
- "Me no take sheep! Me take... potatoes. Only. Food for baby."
- "Baby... soft... small... MINE..." [weeps into enormous paws]

**Glimmer the Wraith (villain):**
- "Oh NOW you people notice me. How DRAMATIC."
- "I stole the Blade because no one writes songs about wraiths. NO ONE."
- "Fine! Fine. Here. Take your shiny sword. Enjoy your POEMS about it."

**Crown (mentor):**
- [before Yeti] "Big guy. REALLY big. Swing the sword? Sure, kid. Let me know how that goes."
- [if attack] "Huh. Yep. That went about as expected."
- [if listen] "Oh. Oh no. He's just a dad."

**Baby Yeti:**
- "Goo." [hugs James's leg]
- [when rescued] "Dadda?" [immediately distracted by a snowflake]

**James:**
- "I'm gonna stab the mountain." / "I… I don't think that works."
- "You can't just ATTACK your way up a cliff, James." — James, learning.
- [post-wraith] "That wraith was just… mean because nobody liked him?" / Crown: "Kid gets it."

---

## 7. Content the build session will create

- `data/quests/mountain.js` — ~14 scenes (replace current one-line stub)
- `data/allies.js` — +1 entry for Gus + maybe Baby Yeti
- `data/enemies.js` — +4 entries (Frost Sprite, Ice Rabbit wild, Sir Frostbeard, Glimmer the Wraith)
- `data/moves.js` — +3-5 moves (Frost Bolt, Headbutt, Frost Slash, Brave Strike, Freeze)
- `data/gear.js` — +5 entries per `arcs/gear-progression.md` Tier 3:
  - ❄️ Frost Fang Sword (weapon)
  - 🪖 Knight's Helm (armor)
  - 🧥 Wraith's Cloak (armor)
  - 💎 Frost Charm (trinket)
  - 🥾 Crampon Boots (boots)
- `data/treasures.js` — update Blade of Bravery to include `addMove: 'brave_strike'`
- `data/badges.js` — +2 (Brave Mind for no-hint riddles, Gentle Giant for yeti_friend run)
- `data/regions.js` — remove `locked: true` so Mountain is accessible after Forest
- `data/crown-dialogue.js` — +1-2 lines for coherence 1 (crown gets clearer)
- `engine/ui/castle.js` — add **Armory** stub room (can be empty for now, full impl = separate task)

Nothing in `engine/` needs to change — this is a pure data arc.

---

## 8. Build-time checklist (when we implement)

1. Write the 14 scenes with schemas from `BUILD_ARCHITECTURE.md` §9
2. Add supporting data (allies, enemies, moves, gear) before referencing them in scenes
3. Register the quest with `Registry.quests.add` at the bottom of `mountain.js`
4. Verify with existing `loadtest.js` — all IDs should resolve
5. Playthrough 3 paths:
   - "All kindness, all allies" run — gets Gus, befriends Yeti, rescues baby
   - "Rush" run — fights Yeti, bribes Knight — still beats the arc, with fewer rewards
   - "Owlette expert" run — solves Knight riddles, uses Ribbit slime, gets max bonuses
6. Confirm Blade of Bravery grants +3 ATK and unlocks "Brave Strike" (fire type, pwr 10) in James's move list
7. Balance pass per §5 targets

---

## 9. What this arc leaves hooks for

- **Armory room** — open for future: forge/upgrade weapons, smelt raw materials. Plants a seed.
- **Baby Yeti as ally** — introduces a TANK archetype (big HP, slow SPD)
- **Glimmer redemption** — if kid is curious, hire him from Pompadour later; fun running gag
- **Village as trusted base** — flag `village_friend` could carry into later arcs as a fast-travel or shop discount
- **Frostbeard's kid** — throwaway joke in the bribe dialogue becomes a recurring "knight family" gag if fun

---

**Ready to build when you approve.** Roughly 1 dev session to author all scenes, data entries, and tune balance. Because the engine is solid, this is mostly writing content.
