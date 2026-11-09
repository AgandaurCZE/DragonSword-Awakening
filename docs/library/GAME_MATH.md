# Game math: every measured formula, from levelling to damage

Back to the library: [docs/README.md](../README.md). Evidence for each rule: `DAMAGE_TESTS.findings` in `data.json` and the Test Kit ([TESTING.md](TESTING.md)). Data shapes: [DATA_REFERENCE.md](../DATA_REFERENCE.md).

**How to read this file.** Each section gives the rule, a short definition of the terms and the `data.json` key that holds the full tables. Everything here was measured by David in-game unless it says *estimate* or *untested*. If something here and `data.json` disagree, `data.json` is newer: fix this file. Never fill a gap with a guess; mark it untested.

---

## 1. Levelling

### 1.1 Hero and Karma EXP (`LEVEL_COSTS.exp`)
- `toNext[i]` = EXP from level *i+1* to *i+2*, measured to Lv.70 for both heroes and Karmas. They are identical from level 3; only the first two steps differ (Hero 150, 250; Karma 200, 200).
- Level cap: **70** (`LEVEL_COSTS.calc.maxLevel`). Breakthroughs at **20, 30, 40, 50, 60**. EXP left over at a breakthrough level is **lost**; the bar restarts at 0.

### 1.2 EXP items and Gold (`LEVEL_COSTS.items`, `pickRule`)
- Gold is paid **per item used**, not per level:
  - Hero texts: Basic Combat Text 500 EXP / 200 Gold; Advanced 2,000 / 650; Core 6,000 / 1,800; Tome of Heroes 20,000 / 5,000.
  - Karma arcanas: War 300 / 150; Beginnings 1,000 / 400; Peace 4,000 / 1,300; Future 10,000 / 3,000.
- **Pick rule:** the game uses the largest item whose EXP fits in what the bar still needs, repeats, and finishes with the smallest item if anything is left (that last one overshoots; the excess carries to the next level, except at a breakthrough level).

### 1.3 Breakthroughs (`LEVEL_COSTS.breakthroughs`)
- Gold is fixed per level: Hero 4,000 / 6,400 / 16,000 / 32,000 at 20 / 30 / 40 / 50 (Karma 5,000 / 10,000 / 20,000 / 50,000; Lv.60 in the data).
- Hero materials (`heroTable`, `heroPattern`): first material is set per hero (Claw, Hide, Bone Fragment, Essence, Carapace: no visible rule); the second follows the archetype; the Insignia follows the hero's faction.
- Karma materials (`karmaPattern`): only the archetype matters, its crystal plus its own trait stones. Signature Karmas cost the same.
- Insignia and Chronograph can be bought from Klonie, Orbis Castle (`calc.insigniaBuy`, `calc.chronographBuy`).

### 1.4 Skill levels (`LEVEL_COSTS.skills`, `SKILL_LEVEL_MULTIPLIERS`)
- Costs: fixed Gold and materials per level, the same for every hero and skill (Lv.7 materials differ between max-7 and max-10 skills).
- Max level 10 for Skill, Ultimate, Special A and B; 7 for basic, jump and dash attacks; dodge stays Lv.1; mastery can't be levelled. A mastery is unlocked with 10 of a special material from legendary chests (David, 30 Oct).
- **Skill % at level L = Lv.1 value × multiplier(L)**: max-10 skills ×1, 1.05, 1.1, 1.15, 1.23, 1.3, 1.38, 1.48, 1.58, **1.75**; max-7 skills ×1, 1.1, 1.2, 1.33, 1.45, 1.6, **1.75**. The page only knows the max value, so it uses `round(max / 1.75 × multiplier)` (47 of 57 checks exact, the rest 1 off).
- Buffs scale with level too, in even steps then a double step at max (Sion's Bless +10% at Lv.1 to +15% at Lv.10; Invisible's Crit Damage +10% to +15%).
- Skill level does **not** change status application or Super Armor gauge damage.

### 1.5 Gear upgrades (`GEAR_UPGRADE`)
- EXP and Gold to each level by rarity (Orange to +15, Purple +12, Blue +9, Green +6), the same for every slot. EXP items: Raw Mana Stone 5,000 EXP / 5,000 Gold, Mana Ore 1,500 / 2,000, Mana Crystal 500 / 700, Mana Shard 200 / 300. Same pick rule as 1.2.
- **Disassemble:** returns the piece's base materials plus **80% of the Equipment EXP spent**, paid in the largest EXP items that fit; under 200 EXP left over is lost; pieces disassembled together are pooled first. Gold isn't returned.

## 2. Stats

### 2.1 Hero base stats (`HERO_STAT_MODEL`, `HERO_BASE_STATS`)
- Every hero follows one level curve: **stat(L) = a + b × (e^(r(L−1)) − 1)** per stat (Attack, Defense, Max HP), plus their breakthrough bonuses.
- Breakthrough bonuses come in three profiles; nothing visible decides which a hero gets:
  - **A:** Lv.70 base 1143 / 335 / 7157 (Charlotte, Roxy, Sion).
  - **B:** 1100 / 350 / 7388 (Johnny, Reina, Ryza, Theresia, Castella; Kalsion 1099 Attack, unexplained).
  - **C:** 1186 / 320 / 6927 (Kalien, Tarte).
- Base Crit Rate 5%, Crit Damage 50%. Every status resistance is 50 with no gear.
- Nine heroes are still estimates (`estimated: true`): measure them **before awakenings** ([STATUS.md](STATUS.md)).

### 2.2 Titles (`TITLES`)
- Titles give passives to every hero, slotted or not. David's current set: Attack +145, Max HP +1,575 flat; Defense +30 flat then Defense Up +5.3%.
- The levelling screen and `HERO_BASE_STATS` exclude titles. The in-fight panel includes them.

### 2.3 Karma stats (`KARMA_DATA`, `KARMA_LEVELLING`, `KARMA_ASCENSION`)
- Each Karma has a stat type (Balanced, Attack, …) set by its Lv.1 stats; its base Attack, Defense and HP add flat to the hero.
- **Trait at Ascension n = A0 value × (1, 4/3, 5/3, 2, 8/3, 11/3, 5)** for A0 to A6. The game rounds % to whole numbers and flat values to the nearest 5.

### 2.4 Gear stats (`GEAR_STATS`)
- Each piece reaches **4× its +0 value** at max; Orange rises +0.2× per level.
- Green / Blue / Purple main stats are 0.375 / 0.467 / 0.600 of Orange; substats Blue 0.5, Purple 0.75.
- Set bonuses add like gear (Ballad of Life: +9% Max HP at 2 pieces, +15% total at 3).

### 2.5 How stats combine
- **Attack = (base + Karma + gear flat + title flat) × (1 + Attack Power Up %)**: the model the optimiser and calculator use. Measured part: team buffs (Eileen's Brave One, Sion's Bless) join the same Attack Power Up pool as gear and **add** (748 → 797 with either, 847 with both).
- Crit Rate counts up to 100% (what happens above is unknown).

## 3. Damage

### 3.1 The hit formula (`DAMAGE_CALC.formula`, `DEFENSE_MODEL`)

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

### 3.2 Damage over time (`STATUS_EFFECTS.damageOverTime`)
- Poison, Bleed, Burn and Shock: **5 ticks per application** (0, 2.5, 5, 7.5, 10 s), up to 3 stacks.
- **Tick = 50% / 75% / 100% of the Attack of the hero who applied the first stack**, at 1 / 2 / 3 stacks, rounded down, using that hero's Attack at the moment of application.
- Ticks ignore Defense, never crit, and aren't raised by AAP, Additional Damage or status sets.
- Frost has no ticks: 3 stacks Freeze the enemy, and Frozen takes +50% from hits. Only Cerese's Shattering Touch shatters Frozen enemies and Ice Blocks.

### 3.3 Status build-up (Test 01; [TEST01_RESULTS.md](TEST01_RESULTS.md))
- Each skill adds a fixed fraction of one stack (or of the gauge, for Airborne, Knockdown and Stun, which fill once and trigger). Values per skill are in TEST01_RESULTS.
- Not affected by hero or skill level.
- **Super Armor Break doubles the build-up of physical statuses** (Stun, Knockdown, Airborne), not Frost or DoTs.
- Bosses resist build-up more than mobs, and more at higher difficulty (Trait Dungeon I to III roughly halves it). A weakness raises build-up about 2–3× and doubles that status's hit bonus.
- Leftover build-up stays on the enemy after a physical status ends.
- Some skills apply statuses the codex doesn't mention (Charlotte's Illusion Kick and Clone explosion apply Poison and Airborne; Johnny's Venom Cutter spreads Airborne).

### 3.4 Places and game modes (`DEFENSE_MODEL.places`, `levelCurve`, `types`)
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

### 3.5 Super Armor (Test 01)
- Bosses have a Super Armor gauge; skills remove a fixed % of it (per skill in TEST01_RESULTS). Break lasts **8 s** whatever hero breaks it.
- While broken: no hit bonus, but Break AAP and All Status AAP count, and physical build-up is doubled. Some skills only work on a broken boss (Castella's Stun Blow).
- Breaker weakness (Drosophia of Breaker) seems to mean a bigger gauge that Breakers lose less to (rough counts).
- Hero all-out break times on the Training Ogre: TEST01_RESULTS.

## 4. Builds and the optimiser (`tools/hero_stats.py`, its JS port in `index.html`)
- **Damage index = Attack × (1 + Crit Rate × Crit Damage)** (crit capped at 100%), from base + signature Karma at A6 + all six awakenings + gear + the 2-piece set's always-on bonus. 3-piece bonuses are left out except Blazing Flames' Crit Rate for Aria, Kalien and Kalsion.
- A status set's +15% Additional Damage counts only for the share of hits that need that status (formula in the script's docstring).
- Spare substats go to Defense Ignore, then the hero's own status AAP.
- The Python script and the JS port must stay identical (AGENTS.md rule 4).

## 5. Known unknowns
- Levels 71–74 enemy Defense; what happens when Armor Penetration exceeds the remaining Defense; Crit above 100%.
- Hunt boss weaknesses and immunities (Test 07); Crushing tower bonus; Bleed and Shock tower DoT bonus (assumed like Poison and Burn).
- Why heroes get breakthrough profile A, B or C; Kalsion's −1 Attack.
- Whether skill-damage adjustments hold at other skill levels.
