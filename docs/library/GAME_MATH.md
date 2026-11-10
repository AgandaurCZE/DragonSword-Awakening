# Game math: every measured formula, from levelling to damage

Back to the library: [docs/README.md](../README.md). Evidence for each rule: `DAMAGE_TESTS.findings` in `data/research.json` and the Test Kit ([TESTING.md](TESTING.md)). Data shapes: [DATA_REFERENCE.md](../DATA_REFERENCE.md).

**Dates:** each heading ends with when the rule was measured or last changed (from CHANGELOG).

**How to read this file.** Each section gives the rule, a short definition of the terms and the `data.json` key that holds the full tables. Everything here was measured by David in-game unless it says *estimate* or *untested*. If something here and `data.json` disagree, `data.json` is newer: fix this file. Never fill a gap with a guess; mark it untested.

---

## 1. Levelling

### 1.1 Hero and Karma EXP (`LEVEL_COSTS.exp`) · 3–4 Nov
- `toNext[i]` = EXP from level *i+1* to *i+2*, measured to Lv.70 for both heroes and Karmas. They are identical from level 3; only the first two steps differ (Hero 150, 250; Karma 200, 200).
- Level cap: **70** (`LEVEL_COSTS.calc.maxLevel`). Breakthroughs at **20, 30, 40, 50, 60**. EXP left over at a breakthrough level is **lost**; the bar restarts at 0.

### 1.2 EXP items and Gold (`LEVEL_COSTS.items`, `pickRule`) · 3 Nov
- Gold is paid **per item used**, not per level:
  - Hero texts: Basic Combat Text 500 EXP / 200 Gold; Advanced 2,000 / 650; Core 6,000 / 1,800; Tome of Heroes 20,000 / 5,000.
  - Karma arcanas: War 300 / 150; Beginnings 1,000 / 400; Peace 4,000 / 1,300; Future 10,000 / 3,000.
- **Pick rule:** the game uses the largest item whose EXP fits in what the bar still needs, repeats, and finishes with the smallest item if anything is left (that last one overshoots; the excess carries to the next level, except at a breakthrough level).

### 1.3 Breakthroughs (`LEVEL_COSTS.breakthroughs`) · 3 Nov
- Gold is fixed per level: Hero 4,000 / 6,400 / 16,000 / 32,000 at 20 / 30 / 40 / 50 (Karma 5,000 / 10,000 / 20,000 / 50,000; Lv.60 in the data).
- Hero materials (`heroTable`, `heroPattern`): first material is set per hero (Claw, Hide, Bone Fragment, Essence, Carapace: no visible rule); the second follows the archetype; the Insignia follows the hero's faction.
- Karma materials (`karmaPattern`): only the archetype matters, its crystal plus its own trait stones. Signature Karmas cost the same.
- Insignia and Chronograph can be bought from Klonie, Orbis Castle (`calc.insigniaBuy`, `calc.chronographBuy`).

### 1.4 Skill levels (`LEVEL_COSTS.skills`, `SKILL_LEVEL_MULTIPLIERS`) · 28 Oct, costs 3 Nov
- Costs: fixed Gold and materials per level, the same for every hero and skill (Lv.7 materials differ between max-7 and max-10 skills).
- Max level 10 for Skill, Ultimate, Special A and B; 7 for basic, jump and dash attacks; dodge stays Lv.1; mastery can't be levelled. A mastery is unlocked with 10 of a special material from legendary chests (David, 30 Oct).
- **Skill % at level L = Lv.1 value × multiplier(L)**: max-10 skills ×1, 1.05, 1.1, 1.15, 1.23, 1.3, 1.38, 1.48, 1.58, **1.75**; max-7 skills ×1, 1.1, 1.2, 1.33, 1.45, 1.6, **1.75**. The page only knows the max value, so it uses `round(max / 1.75 × multiplier)` (47 of 57 checks exact, the rest 1 off).
- Buffs scale with level too, in even steps then a double step at max (Sion's Bless +10% at Lv.1 to +15% at Lv.10; Invisible's Crit Damage +10% to +15%).
- Skill level does **not** change status application or Super Armor gauge damage.

### 1.5 Gear upgrades (`GEAR_UPGRADE`) · 1 Nov
- EXP and Gold to each level by rarity (Orange to +15, Purple +12, Blue +9, Green +6), the same for every slot. EXP items: Raw Mana Stone 5,000 EXP / 5,000 Gold, Mana Ore 1,500 / 2,000, Mana Crystal 500 / 700, Mana Shard 200 / 300. Same pick rule as 1.2.
- **Disassemble:** returns the piece's base materials plus **80% of the Equipment EXP spent**, paid in the largest EXP items that fit; under 200 EXP left over is lost; pieces disassembled together are pooled first. Gold isn't returned.

## 2. Stats

### 2.1 Hero base stats (`HERO_STAT_MODEL`, `HERO_BASE_STATS`) · 8–9 Nov
- Every hero follows one level curve: **stat(L) = a + b × (e^(r(L−1)) − 1)** per stat (Attack, Defense, Max HP), plus their breakthrough bonuses.
- Breakthrough bonuses come in **four profiles**, all 20 heroes measured at Lv.70 (9 Nov, Test Kit test 08; Attack / Defense / Max HP without titles):
  - **B (melee):** 1100 / 350 / 7388: Johnny, Lute, Castella, Theresia, Kalsion, Reina, Eileen, Othello, Ryza. Every B hero's basic attack is a melee weapon swing.
  - **C (ranged):** 1186 / 320 / 6927 (panels give 319.5; stored as 320, as measured on Kalien on 8 Nov): Aria, Dana, Kalien, Tarte, Cerese, Astria. Every C hero's basic attack is a projectile.
  - **A:** 1143 / 335 / 7157: Charlotte, Roxy, Sion, Ornette. **Exactly halfway between B and C** (to rounding).
  - **D (Defender):** 1014 / 379 / 7850: Alex only, the game's only Tank. **B minus the C−B step.**
  - So the profiles lie on **one axis** from defence to offence: D = −1, B = 0, A = ½, C = +1 step, where one step is +86 Attack, −31 Defense, −461 Max HP. Melee and ranged fit B and C; why Charlotte, Roxy, Sion and Ornette sit halfway is open (their basic attacks are 2 melee, 2 ranged). Not decided by monster material, second material, archetype, faction, game role or how the hero is obtained (checked 9 Nov).
- Base Crit Rate 5%, Crit Damage 50%. Every status resistance is 50 with no gear.

### 2.2 Titles (`TITLES`) · 29 Oct, updated 10 Nov
- Titles give passives to every hero, slotted or not. David's set: Attack +145, Max HP +1,575 flat; Defense +30 flat then Defense Up +5.3% (all Lv.70 base stats were measured with this). **From 10 Nov (Chest Addict obtained): Defense +45 flat.** Subtract +45 from new panel readings. **Also from 10 Nov (One Who Broke the Dragon Horn): Attack Power Up +2.3% and Crit Rate +2%**. Claude's reading, not yet checked on a panel: Attack Power Up should scale the panel Attack, so a new reading would be divided by 1.023 before subtracting the flat +145.
- The levelling screen and `HERO_BASE_STATS` exclude titles. The in-fight panel includes them.

### 2.3 Karma stats (`KARMA_DATA`, `KARMA_LEVELLING`, `KARMA_ASCENSION`) · Ascension 28 Oct, levels 10 Nov
- **Karma level rule (David's Lv.1–70 measurements on a Balanced and an Attack card, 10 Nov; fit by Claude):** stat = Lv.1 value × (level curve + breakthrough share × type factor). The **level curve is shared by every type**: +0.913 (Lv.1→20), +0.77 (20→30), +1.088 (30→40), +1.52 (40→50), +2.05 (50→60), +2.68 (60→70), in multiples of Lv.1. **Breakthrough bonuses** at Lv.20/30/40/50/60 are 6/12, 7/12, 8/12, 9/12, 10/12 of Lv.1 on a Balanced card; the Attack type gets Attack ×13/12, Defense ×1, Max HP ×0.8 of that. Reproduces all 22 measured points within 10 (Defense within 6). Checked against the known Lv.70 values: the Defense type behaves like Balanced (predicts 748/374/9241 vs 749/374/9230); High Attack fits Attack ×1.07, Max HP ×0.66 (from its Lv.70 only, so unconfirmed). Levels between breakthroughs aren't measured. Data: `KARMA_LEVELLING`.
- Each Karma has a stat type (Balanced, Attack, …) set by its Lv.1 stats; its base Attack, Defense and HP add flat to the hero.
- **Trait at Ascension n = A0 value × (1, 4/3, 5/3, 2, 8/3, 11/3, 5)** for A0 to A6. The game rounds % to whole numbers and flat values to the nearest 5.

### 2.4 Gear stats (`GEAR_STATS`) · 30 Oct
- Each piece reaches **4× its +0 value** at max; Orange rises +0.2× per level.
- Green / Blue / Purple main stats are 0.375 / 0.467 / 0.600 of Orange; substats Blue 0.5, Purple 0.75.
- Set bonuses add like gear (Ballad of Life: +9% Max HP at 2 pieces, +15% total at 3).

### 2.5 How stats combine · 31 Oct
- **Attack = (base + Karma + gear flat + title flat) × (1 + Attack Power Up %)**: the model the optimiser and calculator use. Measured part: team buffs (Eileen's Brave One, Sion's Bless) join the same Attack Power Up pool as gear and **add** (748 → 797 with either, 847 with both).
- Crit Rate counts up to 100%; anything above does nothing (patch 1.1.0: 100% means every hit crits; see DONE, answered questions).

## 3. Damage

### 3.1 The hit formula (`DAMAGE_CALC.formula`, `DEFENSE_MODEL`) · 28 Oct, Defense 4 Nov

```
hit = (Attack + Σ status Additional Attack Power) × skill %
      × 1000 / (1000 + Defense × (1 − Defense Ignore) × (1 − Defense debuff) − Armor Penetration)
      × (1 + Σ status hit bonuses)
      × (1 + Σ Additional Damage)
crit = hit × (1 + Critical Damage)
```

Terms:
- **Skill %**: the codex value at the skill's level (1.4). Some skills deal more or less than their codex %: `DAMAGE_CALC.skillAdjust` (Reina's Rising Cutter ×1.03, Kalsion's Flame Wave hold ×0.85, Royal Flame press ×1.046, Explosion press 60% and hold 135% of codex).
- **Status Additional Attack Power (AAP)**: flat, added to Attack only on hits against an enemy with that status. "All Status AAP" counts **once per status** on the target, Break included. "Status Effect AAP Increase" (a % substat) raises your status AAP by that %.
- **Defense**: K = 1000 is a constant of the formula. Training Ogre Defense 1000. Each Armor Penetration point removes 1 Defense; each 1% Defense Ignore removes 1% of Defense. Enemy Defense debuffs (Alex's Guard Counter, 10% at Lv.1 to 20% at Lv.10, about 10 s) **multiply** with Defense Ignore.
- **Status hit bonuses** (add, no cap): +50% for each damage-over-time status (Poison, Bleed, Burn, Shock), +100% each for Airborne, Knockdown and Stun, +50% for Frozen. Break gives **no** hit bonus. Measured up to ×4 (three physical statuses).
- **Additional Damage**: a status's Additional Damage counts only while that status is on the target; different statuses' Additional Damage add together. Tower bonuses join this pool (3.4).
- Each hit of a multi-hit attack rolls its own crit.
- **Geared check, 11 Nov (David, Ryza, Lightning Javelin Lv.3 at 424%, one javelin, Training Ogre):** panel Attack 5524, Defense Ignore 21.09%, Crit Damage 59.10%, Shock / Knockdown / All Status AAP 346 / 1000 / 169, AAP Increase 22.19%, Additional Damage Shock 34% and Knockdown 15%. The formula above gives every hit within 0.03%: no status 13,091 (seen 13,093; crit 20,828 vs 20,831), Shock 29,312 (29,314; crit 46,636 vs 46,639), Knockdown 37,896 (37,900; crit 60,293 vs 60,299), Shock + Knockdown + Break 68,754 (68,759; crit 109,388 vs 109,396). Confirms on real gear: AAP Increase multiplies the summed AAP, All Status AAP counts once per status **including Break**, Break adds no hit bonus, hit bonuses and Additional Damage are separate multipliers. Shock + Knockdown without Break: 66,931 (seen 66,936; crit 106,487 vs 106,496). All ten readings match.
- **Sion, Divine Smash Lv.1 (588%), 11 Nov (David):** three hits, 2% + 60% + 40% of the codex % (102% in total, like Reina's ×1.03): no status 203 + 6,105 + 4,070 = 10,378 (formula ×1.02: 10,375); Shock 439 + 13,176 + 8,784 (crit 15,450 = 8,784 × 1.7588) = 22,399 (formula 22,395). The Ultimate's own Knockdown doesn't count for its own hits. Knockdown: 597 + 31,500 (crit) + 11,940, formula 597 + 31,493 + 11,937. Knockdown + Break: 602 + 18,086 + 21,207 (crit), formula 603 + 18,082 + 21,202. Shock + Knockdown: 1,001 + 30,057 + 35,243 (crit), formula 1,002 + 30,050 + 35,235. All match within 0.05% (an earlier total of 39,960 was a mixed reading). In `DAMAGE_CALC.skillAdjust`.

### 3.2 Damage over time (`STATUS_EFFECTS.damageOverTime`) · 29–30 Oct
- Poison, Bleed, Burn and Shock: **5 ticks per application** (0, 2.5, 5, 7.5, 10 s), up to 3 stacks.
- **Tick = 50% / 75% / 100% of the Attack of the hero who applied the first stack**, at 1 / 2 / 3 stacks, rounded down, using that hero's Attack at the moment of application.
- Ticks ignore Defense, never crit, and aren't raised by AAP, Additional Damage or status sets.
- Frost has no ticks: 3 stacks Freeze the enemy, and Frozen takes +50% from hits. Only Cerese's Shattering Touch shatters Frozen enemies and Ice Blocks.

### 3.3 Status build-up (Test 01; [TEST01_RESULTS.md](TEST01_RESULTS.md)) · 29 Oct – 9 Nov
- Each skill adds a fixed fraction of one stack (or of the gauge, for Airborne, Knockdown and Stun, which fill once and trigger). Values per skill are in TEST01_RESULTS.
- Not affected by hero or skill level, and neither is Super Armor gauge damage (Castella removed the same gauge at Lv.20 as at Lv.70).
- **Super Armor Break doubles the build-up of physical statuses** (Stun, Knockdown, Airborne), not Frost or DoTs.
- Bosses resist build-up more than mobs, and more at higher difficulty (Trait Dungeon I to III roughly halves it). A weakness raises build-up about 2–3× and doubles that status's hit bonus.
- Leftover build-up stays on the enemy after a physical status ends.
- Some skills apply statuses the codex doesn't mention (Charlotte's Illusion Kick and Clone explosion apply Poison and Airborne; Johnny's Venom Cutter spreads Airborne).
- **Effects that continue after a swap or interact across heroes** (David, in game, 9 Nov; not in the codex text): Tarte's Bolt Bubble keeps casting after she swaps out, so orbs keep coming while the next hero is on the field and that hero's Shock hits detonate them. Dana's Chako keeps fighting while she's swapped out. Cerese's Shattering Touch shatters Othello's Ice Prison if she's played after him.

### 3.4 Places and game modes (`DEFENSE_MODEL.places`, `levelCurve`, `types`) · 31 Oct – 5 Nov
- **Enemy Defense = level curve × place factor × type multiplier.**
  - Level curve (`levelCurve.dungeon`): basic dungeon enemy, e.g. Lv.30 157.9, Lv.50 569.4, Lv.70 850.3, Lv.75 1051.3. Species doesn't matter. Straight lines between measured points.
  - **World**: ×0.8 of the dungeon curve. The highest basic World enemy is Lv.75. World Difficulty 6 appears to add +10 levels.
  - **Normal Dungeon**: ×1; bosses ×1.3 (one duo boss ×1.04).
  - **Trait Dungeon**: minions ×1.6, bosses ×3.2. The weak archetype's status hit bonus is doubled.
  - **Currency Dungeon**: ×0.4, with no type or boss multiplier.
  - Type multipliers (`types`): e.g. Goblin Archer ×0.8, Barbarian and Berserker ×1.1, Lesser Dragon ×1.2, Greater Dragon ×1.5, named enemies with visible changes ×1.15. Look-alike enemies can differ by one 5% step.
- **Towers of Trials** (`TOWER_TRIALS.bonus`): hits on an enemy with the tower's own status get **+400%**, and each damage-over-time status **+100%**, added to the Additional Damage pool. Other statuses add nothing. Crushing isn't measured.
- **Hunt bosses, Nightmare and up**: a big damage-resistance buff that applying the boss's weak status removes (Furcas: Burn). The other bosses are untested (Test 07).
- **Raid** (Gauron): structure in `TIER_LIST_V2.bosses[].info`; no separate damage rule measured.

### 3.5 Super Armor (Test 01) · 29 Oct, 8 Nov
- Bosses have a Super Armor gauge; skills remove a fixed % of it (per skill in TEST01_RESULTS). Break lasts **8 s** whatever hero breaks it.
- While broken: no hit bonus, but Break AAP and All Status AAP count, and physical build-up is doubled. Some skills only work on a broken boss (Castella's Stun Blow).
- Breaker weakness (Drosophia of Breaker) seems to mean a bigger gauge that Breakers lose less to (rough counts).
- Hero all-out break times on the Training Ogre: TEST01_RESULTS.

### 3.6 Buffs, debuffs and rules from masteries and awakenings (David, 10 Nov; [AWAKENING_TESTS.md](AWAKENING_TESTS.md)) · 10 Nov
- **Castella's and Theresia's masteries** ("Super Armor reduction increased") protect **their own** Super Armor and cut damage taken; they don't break the enemy faster. Castella's buff shows only during the dash attack; Theresia's lasts 5 s.
- **Castella A3 (Howling): enemy Defense −20% for 5 s** (a hit 780 → 867 on the Training Ogre, Defense 1000: 2000/1800 = 1.111; Claude's reading).
- **Lute A1 relic area: +20% Attack Power for about 5 s** (Castella +249 on 1245, Ornette +257 on 1288; Claude's reading).
- **Kalsion A3 Royal Flame: +10% → +20% Attack Power, 15 s → 22 s** (+124 → +249 on 1244).
- **Theresia A3: +10% Attack Power** while the buff lasts (1431 → +125; 1431 is 1245 with A2's +15%); Heretic Judgment lasts 15 s instead of 10 s.
- **Roxy A3: +10% Crit Damage per Double Shot plunge, up to 5 stacks (+50%), about 8 s, refreshed by each stack.**
- **Othello A3: Frozen Burst hits +50%** (after taking A2's +15% Attack out).
- **Othello's charged Half-Moon Cutter (mastery)** never completes a Frost stack: if it would, it only refills the bar (about 0.99 of a stack with only charged dash attacks).
- **Tarte A3 Bolt Bubble casts 40 bubbles** but she can't pop the extra ones herself: they feed other Shock heroes.
- Full break times alone, base → mastery → awakenings: Kalien 25 → 20 → 15 (A1) → 12 (A3) → 10 s (A6); Dana 23 → 20 (A3) → 15 s (A6); Reina 50 → 44 (A3) → 36 s (A6); Castella 18 → 16 → 15 s (A6); Lute 75 → 41 s (mastery).

## 4. Builds and the optimiser (`tools/hero_stats.py`, its JS port in `js/04-gear-builds.js`) · 30 Oct
- **Damage index = Attack × (1 + Crit Rate × Crit Damage)** (crit capped at 100%), from base + signature Karma at A6 + all six awakenings + gear + the 2-piece set's always-on bonus. 3-piece bonuses are left out except Blazing Flames' Crit Rate for Aria, Kalien and Kalsion.
- A status set's +15% Additional Damage counts only for the share of hits that need that status (formula in the script's docstring).
- Spare substats go to Defense Ignore, then the hero's own status AAP.
- The Python script and the JS port must stay identical (AGENTS.md rule 4).

### 4.1 Endgame gear analysis, 9 Nov (`tools/endgame_gear.py`)
Full hit formula (3.1) against Defense **1825** (Lv.50 Trait Dungeon boss, the highest recorded), with all 109 titles (Attack +235, Attack Power Up +11.6%, Crit Rate +27%, Crit Damage +32.3%, Armor Penetration +85, Defense Ignore +2.7%), signature Karma A6, all awakenings, Orange +15. Target carries the hero's own status and one physical status; every set effect counted as active. Checked on Johnny, Ryza, Kalsion, Dana, Theresia.
- **Main stats:** Attack Power Up stays best on almost every slot; at most one Crit main. The optimum lands around **52–74% Crit Rate and 82–120% Crit Damage**, not higher.
- **Forcing 80% Crit Rate / 150% Crit Damage** (Crit Rate and Crit Damage on every piece, plus Crit mains): **−3.6%** with status Additional Attack Power substats allowed, **−8.3%** without (Johnny).
- **Substats:** at high Defense, **Defense Ignore is the first substat on every piece**, and when the statuses are on the target, own-status and physical-status Additional Attack Power beat Attack Power Up substats. The stored builds (`HERO_BUILDS`, scored by Attack × crit only) come out 8.5–9.3% below the best build with the same sets.
- **3-piece sets** (best 2-piece added; all five heroes agree within 1.5%): **Earthshatterer best**; Blazing Flames −6 to −8%, Ruinsbreaker −8 to −9%, Thunderrush −8 to −9%, Venomfog Shade −8 to −9%, Froststorm and Azure Gale −12 to −13%, Holy Arbiter and Bloodstained Chaser −12 to −14%, The Infiltrator −14 to −17%, Battle Will −19 to −22%. The 2-piece: any status set whose status is on the target (+15% Additional Damage), in practice the hero's own.
- **Caveat:** Earthshatterer's +20% Defense Ignore lasts 10 s after a Signal skill. It's worth +17 to +19% damage while active, so it stays ahead of Blazing Flames only above about **52–57% uptime**. David (9 Nov): Signal skills come from applying statuses, so in groups the window is almost always on; on bosses it runs from about half to most of the fight, depending on how fast the team breaks the boss and applies statuses. All 3-piece triggers were counted as always on.

### 4.2 Compared with an endgame Ursula speed run (David's screenshots, 10 Nov)
Panels from a top player's hardest-difficulty Ursula run. Every gear piece has a rune slot (Roxy and Theresia use Crit runes on every piece).
- **Roxy** (on field): Attack Power Up mains, substats Attack Power Up, Defense Ignore, Crit Rate, Crit Damage, Stun AAP; panel 74.9% / 110.6%. **Theresia** (on field, signature Karma): Attack Power Up mains (Crit Rate Boots), same substats; 79.5% / 138.6%. Both match the model's unbroken build (4.1); the Stun AAP is the team status (Castella stuns).
- **Castella** (Breaker, Karma *Destruction is the Mother of Creation*, not her signature): Crit Rate mains (Attack Power Up Legs), Crit Damage runes, substats Defense Ignore, Status Effect AAP Increase, All Status AAP, Break AAP, Stun AAP; panel Attack 3464, Break AAP 2625, Stun AAP 1000, All Status AAP 219, Status AAP Increase 22.19%, Break Additional Damage 80%, 83.6% / 152.3%. Matches the model's always-broken substats.
- **Why Castella goes for Crit mains:** her flat status AAP (about 3,800 on a broken, stunned boss) is larger than her Attack. Attack Power Up only scales Attack, while crit scales Attack and AAP together. In the model, an AAP-heavy build moves to Crit mains and about 85% / 135% once strong runes are added. **Runes weren't in the model before**; they always go to Crit (the other rune types give little), which pushes every build towards 80/150. Perfect rune values are still unknown (best seen: Refined Focus 4.50%, Amplification 4.90%).
- **Status AAP follows the team, not the hero's element** (David, 10 Nov): the whole team runs Stun AAP, the one status all three apply (Roxy is Bloodburst, yet takes Stun, not Bleed). It's the status most often on the target, and physical-status AAP substats are **twice** elemental ones (175–250 vs 87–125 per piece). So the AAP substat should go to the status the team keeps up most, usually a shared physical status, not by default to the hero's own element.
- Conclusion (David and Claude): on bosses, breaking is a must, for the damage and for the doubled physical build-up. Builds follow the role: **on-field damage dealers**: must-have substats plus Crit; **Breakers**: Break and status AAP, Crit mains.

### 4.3 Main-team builds after awakenings, 10 Nov (`tools/team_gear.py`)
For David's six main teams, Orange +15, enemy Defense 1825, awakenings as owned (Sion A3, the rest A6), signature traits only where owned. Every status the team keeps on the target counts; the team's element is always up, **physical statuses half the time** (Claude's assumption: they come and go; with them always up the results move by 0–3% and the sets tie). Set 3-piece effects counted as always on (agreed). Runes not included (values unknown; they add Crit, which suits the Attack Power Up mains).

**Rule that fell out for all 13:** 3-piece **Earthshatterer** + 2-piece **the team's element set**; mains **Attack Power Up** on every piece (exceptions below); every piece has **Defense Ignore** plus the team's **physical-status AAP** substats (worth twice elemental ones).

| Hero (team) | 2-piece | Mains (not APU) | Substats on every piece | 5th substat | Crit before runes |
|---|---|---|---|---|---|
| Charlotte (Shadow Poison) | Venomfog Shade | — | DI, Airborne AAP, Poison AAP, APU | Crit Rate | 51 / 102 |
| Johnny (Shadow Poison, Airborne burst) | Venomfog Shade | — | DI, Airborne AAP, Poison AAP, APU | Crit Rate | 51 / 82 |
| Reina (4 teams) | Azure Gale | — | DI, Airborne AAP, APU, Crit Rate | Attack | 51 / 97 |
| Ryza (Thunder pair) | Thunderrush | — | DI, Knockdown AAP, Airborne AAP, Shock AAP | All Status AAP or AAP Increase | 52 / 82 |
| Ornette (Thunder pair) | Thunderrush | — | DI, Knockdown AAP, Shock AAP, APU | Crit Rate | 51 / 92 |
| Sion (Thunder pair) | Thunderrush | — | DI, Knockdown AAP, Shock AAP, APU | Crit Rate | 41 / 92 |
| Kalsion (Fox and wind, Airborne burst) | Blazing Flames | — | DI, Airborne AAP, Burn AAP, APU | Crit Rate or All Status AAP | 57 / 97 |
| Kalien (Fox and wind) | Blazing Flames | — | DI, Airborne AAP, APU, Crit Rate | Stun AAP | 51 / 97 |
| Dana (Frost tornado) | Froststorm | — | DI, Airborne AAP, APU, Crit Rate | Knockdown AAP | 51 / 97 |
| Cerese (Frost tornado) | Froststorm | — | DI, Airborne AAP, Knockdown AAP, APU | Crit Rate | 49 / 82 |
| Theresia (Holy Bleed) | Bloodstained Chaser | Chest Crit Rate, Boots Crit Damage | DI, Stun AAP, Airborne AAP, Bleed AAP | AAP Increase or All Status AAP | 59 / 101 |
| Roxy (Holy Bleed) | Bloodstained Chaser | Boots Crit Rate | DI, Stun AAP, Airborne AAP, Bleed AAP | APU | 44 / 82 |
| Castella (Holy Bleed) | Bloodstained Chaser | — | DI, Stun AAP, Airborne AAP, Bleed AAP | Crit Rate, All Status AAP or APU | 35 / 82 |

**With 5 Perfect Crit Rate runes (6.80% each, +34% Crit Rate; rule added 10 Nov):** Crit Rate runes beat Attack runes (119) for 11 of 13 heroes by 0.5–5.7% (Johnny and Reina are within 0.5% either way). A Perfect Crit Damage rune would need about 11–13% per rune to beat them (not seen yet; Refined Crit Damage 4.90% vs Refined Crit Rate 4.50%). With the runes, the **Crit Rate substat becomes Crit Damage** everywhere, and a few mains switch to Crit Damage: Ryza Gloves and Boots, Kalsion Legs, Cerese Boots, Theresia Legs and Boots, Roxy Legs (Roxy's Boots back to Attack Power Up, Theresia's Chest back to Attack Power Up). Crit ends at 66–86% rate and 90–125% damage.

**Update 10 Nov evening (Perfect Crit Damage rune 11.20%, Crit Rate runes 5.10–6.80%):** with 6.80% Crit Rate and 11.20% Crit Damage runes, the best mix is **3 Crit Rate + 2 Crit Damage** for most of the 13 (Kalsion 2, Ryza and Theresia 1, Castella, Reina and Sion 4), but every mix with 2–4 Crit Rate runes is within about 0.5%, and all five Crit Rate within 0.1–1%. Perfect values are a top value × n/20 (see the unknowns list); at the tops the Crit Damage to Crit Rate ratio (14 / 8.5) is the same as for 11.20 / 6.80, so the mix advice holds. Gear substats were measured on all 31 of David's Orange +15 pieces the same evening and confirmed the tables (DI and Attack Power Up included); the only real correction, Chest Status AAP Increase 5.55% (was 5.02%), doesn't change any build.

Next best set pairs are 1–7% behind (often the element set as the 3-piece with The Infiltrator). Within 1% for Kalsion (Blazing Flames + The Infiltrator).

**On the page (preview), 10 Nov:** the hero Build tab's "Best Gear" box runs this model in the browser (`GEAR_MODEL` in DATA_REFERENCE). Checked against `tools/team_gear.py` for all 13 main-team heroes at David's settings: identical mains, substats and values for every set pair. The page skips 2-piece sets whose bonus needs a status that isn't ticked (they add nothing), so a hero takes 1–2 s instead of 4. With Perfect runes at the top values (Crit Rate 8.08%, Crit Damage 14%, Attack 140) the best mix varies by hero: 3 Crit Rate + 2 Crit Damage for most, Ryza 1 + 4, Theresia 5 Crit Damage, Charlotte, Castella, Roxy, Sion and Kalsion 2 + 3.

## 5. Known unknowns · updated 10 Nov
- Levels 71–74 enemy Defense; what happens when Armor Penetration exceeds the remaining Defense.
- Hunt boss weaknesses and immunities (Test 07); Crushing tower bonus; Bleed and Shock tower DoT bonus (assumed like Poison and Burn).
- Rune values (`RUNES.seen`, 10 Nov): every value is a **top value × n/20** (Claude's reading; it fits all 18 Perfect values seen): Perfect Attack 119/126/133/140 = 17, 18, 19, 20 × 7; Defense 80/95 = 16, 19 × 5; Max HP 1050/1125/1200/1275 = 14, 15, 16, 17 × 75; Crit Rate 5.10/5.95/6.80/8.08 = 12, 14, 16, 19 × 0.425 (8.08 was predicted before it was seen); Crit Damage 11.20/13.30/14.00 = 16, 19, 20 × 0.70. So the Perfect tops are **Attack 140 and Crit Damage 14%** (both seen) and, by the same steps, Defense 100, Max HP 1500 and Crit Rate 8.5% (not seen yet). Synthesis: 5 runes of a grade give 1 random rune of the next grade; **3 Perfect runes give 1 random Perfect rune** (random type). Lower grades fit the same idea (Refined Attack 49/56/70 = 14, 16, 20 × 3.5). Radiant: Defense 67 only.
- Orange Defense Ignore and Attack Power Up substats are estimates (Blue × 0.5 and × 0.955); Defense Ignore is on every main-team build. The green +100 Attack and +17% Defense Ignore on the Ursula panels are a buff, most likely food: Tomato Stew gives team Defense Ignore (12% at tier 2; 17% at a higher tier would fit).
- Why Charlotte, Roxy, Sion and Ornette get the halfway profile A (B = melee, C = ranged, D = Defender are explained). Kalsion's old −1 Attack is gone: his 9 Nov panel gives 1100.
- Whether skill-damage adjustments hold at other skill levels.
