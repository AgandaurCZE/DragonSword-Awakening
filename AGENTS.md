# DragonSword: Awakening guide — notes for AI assistants

Read this before changing anything in this repository.

## What this is

A fan-made guide for the game **DragonSword: Awakening** (HOUND13, PC/Steam). It's a single static web page hosted on **GitHub Pages** from the `main` branch, root folder:
https://agandaurcze.github.io/DragonSword-Awakening/

Every commit to `main` goes live about a minute later. There is no build step, no framework and no server. The owner is David (UK English). He checks claims, so don't state anything the data can't back up.

## Files

| File | What it is |
|---|---|
| `data.json` | **All guide content.** The single source of truth. Edit this for any content change. |
| `index.html` | Layout, CSS and JavaScript. Contains no guide data. It loads `data.json` at start-up and renders every page from it. |
| `assets/` | Images as WebP: `heroes/<name>.webp` (portraits), `archetypes/<archetype>.webp`, `roles/<role>.webp`, `gear/<set>.webp`. File names are lowercase with hyphens. `awakenings/<Hero>/A1–A6.png` are David's original screenshots: the source for `AWAKENINGS`, not shown on the page. `awakenings/Awakening_Icon.png` is shown on the cards. |
| `AGENTS.md` / `CLAUDE.md` | These notes. |
| `tools/` | Python scripts for the data (no build step; the site never runs them). See **Tools** below. |
| `assets/patch_notes/<version>.txt` | The official Steam patch notes, word for word (1.0.0 = the launch notice). The source for `PATCH_NOTES`; linked from the Patch Notes page. |
| `CHANGELOG.md` | A record of every change, newest first. |

How the page starts: `index.html` runs `fetch('data.json')`, copies each top-level key into a global variable of the same name (`HEROES`, `TEAM_DATA`, …), then calls `startApp()`, which draws every tab. Opening `index.html` directly from disk (`file://`) fails because browsers block the fetch. Test with a local server instead, e.g. `python3 -m http.server` in the repository folder.

## `data.json` keys

| Key | Shape | Used by |
|---|---|---|
| `meta` | `{patch, balancePatch, updated, note}` | The header and the hover cards show "patch X (no balance changes since Y)". Update `patch` when the game patches. |
| `HEROES` | list of 20 `{name, archetype, portrait, archIcon, tiers{Early-game, Mid-game, End-game}, owned, role, classType, obtain{method, cost?, note?}}` | Tier List, Heroes, hover cards and filters. `role` must be exactly `Main DPS`, `Sub-DPS` or `Support` (it picks the role icon). `classType` must be one of `Damage / Control`, `Healer`, `Buffer`, `Tank`. `owned` is David's collection. |
| `ROLE_ICONS` | `{role: image path}` | Role badges and filters. |
| `ARCHES` | list of the 9 archetypes | Order of the archetype filter buttons. |
| `TIER_ORDER`, `TIER_COLORS` | tiers shown and their colours | Tier List page. |
| `ARCH_COLORS` | `{archetype: hex}`, sampled from the archetype icons | Colours of status words in skill text. |
| `GENERIC_KARMA` | `{archetype: Karma name}` | The generic fallback card shown third under Best Karmas. |
| `STATUS_ARCHETYPE` | `{status word: archetype}`, e.g. `Poison → Venom` | Decides which skill-text words are coloured, and in which colour. |
| `TEAM_DATA` | list of `{tier, name, accent, lead, arch, members[{name, alts[]}], tags[], note}` | Teams page, plus the Synergy section on character pages. `lead` = `members[0].name` (the big portrait). Slot order: Main DPS, Sub-DPS, Support/enabler. `alts` are swap-ins for that slot. |
| `KARMA_DATA` | list of 53 `{archetype, name, signature, source, exclusive, traits[{label, a0, a6}], base{Attack, Defense, Max HP}, baseLv1{…}, statType}` | Karma tab **and** the hover cards on character pages; both are built by the same function, so one edit updates both. `a0` = Lv. 1 / Ascension 0, `a6` = Lv. 70 / Ascension 6, both from screenshots. |
| `CHARACTER_PROFILE_DATA` | `{heroName: {archetype, role, karma, gear, build, pros[], cons[], skills[{slot, skill, description, meta}]}}` | Character pages (open one by clicking a hero). `review` is the full review on the Review tab (`renderProfileReview()`): `{updated, pronoun, summary[], verdict{level, label, text[]}, howToPlay{intro[], loop[], combos[{name, sequence[], note}]}, kit[{title, points[]}], investment{skills[{priority High/Medium/Low, text}], awakening[], karma[], gear[]}, teams[]}`. Text may use links that open a hover/tap card: `[[hero:Name]]`, `[[skill:Skill]]` (own hero) or `[[skill:Hero/Skill]]`, `[[karma:Name]]`, `[[set:Name]]`, `[[awk:5]]` or `[[awk:Hero/5]]`, an optional label after `|`, and `**bold**`. Combo `sequence` items are skill names (`Hero/Skill` for another hero's). All 20 heroes have one (28 Oct 2026); numbers in them come from the codex, `DAMAGE_TESTS` and the end-game totals, so re-check them when those change. `pros`/`cons` are one-sentence points for the Pros & Cons box on the Review tab (`renderProfileProsCons()`): green with a plus icon, red with a minus icon; status and archetype names are coloured automatically, so write them capitalised (e.g. `Bleed`, `Venom`). Keep them backed by the data (tiers, teams, skill text, Karma, awakenings) and at least 3 on one side. `karma` and `gear` are the readable recommendation sentences. `build = {karma: {signature, second, alternatives[]}, sets: [{set, pieces}]}` is the same thing as data; the page reads `build` first. `meta = {maxLevel, attackPct, inflicts[], requiresAny[]}` makes skills searchable, e.g. "which heroes inflict Knockdown". `build` and `meta` are generated by `tools/skill_meta.py`. |
| `GEAR_DATA` | list of 12 `{name, source, two, three, icon, twoBonus[], threeBonus[]}` | Gear tab and the gear section on character pages. `two`/`three` are the display text; `twoBonus`/`threeBonus` are the same effects as `{stat, value, condition?}` for the stat totals. A 3-piece set gives its 2-piece bonus too (confirmed in-game: Ballad of Life +9% at 2 pieces, +15% at 3, nothing more at 5). |
| `GEAR_STATS` | `{slots: {Helmet, Chest, Legs, Gloves, Boots: {main: {stat: [16 values for +0..+15]}, sub: {stat: value}}}, percentStats[], rarities[], substatUnlockLevels[]}` | Best Main Stats and the stat totals. From David's in-game gear info (source of truth). |
| `HERO_BASE_STATS` | `{hero: {Attack, Defense, Max HP, Critical Hit Chance, Critical Damage, estimated, profile}}` | Level-70 hero stats with no gear or Karma. **Currently estimates** (`estimated: true`). Replace with measured values and set `estimated` to `false`. |
| `HERO_STAT_MODEL` | measurements + formula | Documents how the estimates were made (see "Hero base-stat estimates" below). Not read by the page except as reference. |
| `HERO_BUILDS` | `{hero: {type, why, rarity, level, pieces: {slot: {main, subs[5]}}}}` | Best Main Stats cards and the Recommended Endgame Stats totals on character pages. Stat names must match `GEAR_STATS` exactly. |
| `TITLES` | `{note, totalCount, ownedCount, ownedCumulative[], list[{name, obtained, passive[{stat, value}] or null}]}` | Achievement titles. Their passives apply to every hero. **Not shown on the page yet**: `titleBonusTotals()` in `index.html` sums them. Flat title stats add before % multipliers; title % joins the % pool (confirmed in-game). Only Novice Mercenary Crew's passive (Max HP +50) is known; `null` means not checked yet. |
| `SKILL_LEVEL_MULTIPLIERS` | `{note, byMaxLevel: {"7": [7 values], "10": [10 values]}, measured}` | Skill level slider (character pages and skill previews). Lv.1 = max ÷ 1.75; each level = Lv.1 × multiplier. All levels measured (7 skills, 5 heroes; same for everyone). The page shows round(max ÷ 1.75 × multiplier), which can be 1 off the game (47 of 57 exact). A `null` entry would be filled in evenly and marked "(est.)". |
| `KARMA_ASCENSION` | `{note, multipliers[7], measured, rounding}` | Karma A0–A6 values (`karmaLevels()`): the A0 value × 1, 4/3, 5/3, 2, 8/3, 11/3 or 5, rounded like the game (whole % and nearest 5). All measured in-game: 35 of 35 values match. |
| `KARMA_LEVELLING` | `{note, types, order, measured}` | Karma base stats by level (Lv1→Lv30 measured on two cards). Not used by the page yet; ready for a Karma level slider. Every card has one of four stat types (`KARMA_DATA[].statType`: Balanced, Attack, Defense, High Attack), set by its level-1 stats (`KARMA_DATA[].baseLv1`). |
| `DAMAGE_TESTS` | `{note, findings[], tests[], statsCheck}` | Training-dummy results and what they show (damage ∝ Attack × skill %, crit = ×(1 + Crit Damage), Poison, Bleed, Burn and Shock ticks = 50/75/100% of the first applier's Attack at 1/2/3 stacks, 4 ticks). Not used by the page yet. Blue gear values seen in the same tests are in `GEAR_STATS.observedBlue`. |
| `STATUS_EFFECTS` | `{note, damageOverTime: {statuses[], ticks, durationSeconds, tickEverySeconds, maxStacks, tickPctByStacks[], rules[], untested}}` | The Status Effects box on the Skills tab of character pages (`renderProfileStatus()`), shown for heroes whose skills inflict one of `statuses` (read from `skills[].meta.inflicts`). Edit the rules here, not in the HTML. |
| `PATCH_NOTES` | `{note, latestBalance, badgeTypes{key: label}, directions{key: label}, impactLabels[4], rating, patches[{version, title, date, time, buildId, balance, launch?, headline, highlights[{badge, text, heroes[]}], heroChanges{hero: {direction, impact 0–3, damagePct?, totalBefore?, totalAfter?, devNote?, changes[{skill, slot?, patchName?, before?, after?, text?}]}}, tierChanges[], fixCount, badges[], source}]}` | The Patch Notes page (`renderPatches()`), the green ▲ / red ▼ / amber mixed arrows on the Tier List, Teams and hero hover cards (from the `latestBalance` patch, via `latestArrow()`), and the Patch history card on the Review tab (`renderProfilePatches()`). Highlights are the important changes from `assets/patch_notes/`, with developer messages left out. 1.1.0 `heroChanges` come from the official before/after numbers (method in `rating`); other patches' directions are read from the notes. `tierChanges` records tier moves agreed with David after a patch; **tiers are never moved by a formula**. Badge keys: hero, balance, content, costume, quest, system, fix. |
| `AWAKENINGS` | `{note, ratingScale[6], icon, heroes: {hero: {best, list[{level, name, text, effects[{stat, value}], rating, why}]}}}` | Review tab on character pages (`renderProfileAwakenings()`). `text` is copied word for word from the screenshots in `assets/awakenings/<Hero>/A1–A6.png`, with `\n` for line breaks. `effects` are the always-on stat bonuses, using the `GEAR_STATS` stat names. They count in the end-game totals, where they're shown in purple, and in the build optimiser. `rating` runs 0–5: 0 = not needed, 5 = game-changing. Stat awakenings on damage heroes are rated by modelled end-game damage gain (15%+ = 4, 8–15% = 3, 3–8% = 2, 1–3% = 1; method in `AWAKENINGS.note`). `why` is shown under each card. `best` is the awakening shown in the Best Awakening card. |

### Text formats the page reads (keep them exactly)

- **Profile `karma`:** `Recommended Karma: <Signature> (signature) + <Second card>. Alternatives: <a>, <b>`. Karma names must match `KARMA_DATA[].name` exactly, or the hover card and the Karma-tab link won't find them.
- **Profile `gear`:** `Recommended Gear sets: 3 <Set> + 2 <Set>. Main stats: <stat> chest, <stat> legs. Substats: …`. Set names must match `GEAR_DATA[].name`.
- **Profile `role`:** `Role: <Main DPS|Sub-DPS|Support…>: <description>`. Its first words should match the hero's `role` in `HEROES`.
- **Skill `skill`:** a name ending in `(Lv.N)`, where N is the max level and sets the slider range. `(Lv.1)` gets no slider.
- **Skill `slot`:** a slot starting `MODE SWITCH` renders a mode heading. A slot containing `Mastery (passive)` gets no slider.
- **Skill `description`:** plain text with `\n` line breaks, copied from the in-game codex. Formatting is applied automatically when the page renders:
  - The number in `Attack Power N% Damage` is bold, and it's the only number the level slider changes.
  - Status words from `STATUS_ARCHETYPE`, and phrases like `Poison 2 stacks or more`, are bold in the archetype colour.
  - `[Bracketed names]`, Super Armor, Taunt, `%` values, seconds and `N times` are bold.
  - Any line starting `Activation Conditions` is red.

### Still hard-coded in `index.html`

Change these in the HTML if needed:
- a fallback copy of the generic Karma per archetype (`genericKarmaByArchetype`); `GENERIC_KARMA` in data.json takes priority
- the Karma-tab accent colours (`KARMA_ACCENTS`)
- the team tier label colours (`renderTeams`)
- the kit-type filter options (the `<select id="classType">`)
- the "NEW" badge on Ryza (`renderHeroes`)
- the patch badge colours and icons (`PB_COLORS`, `PB_ICONS`) and the arrow colours and shapes (`PA_COLOR`, `PA_SVG`)
- the skill-level ratio `SKILL_MAX_TO_LV1 = 1.75`
- the Karma trait → stat name mapping (`KARMA_TRAIT_STAT`) and the gear slot list (`GEAR_SLOTS`)

## Data rules

1. **Sources of truth:** hero skill data comes from the in-game codex; Karma stats, gear-set effects and the game's Recommended Combinations come from David's screenshots. If anything conflicts, the codex wins. Flag the conflict; don't guess.
2. **Never invent numbers.** Status mechanics are only partly measured (see `DAMAGE_TESTS`): Poison, Bleed, Burn and Shock tick 4 times, for 50/75/100% of the first applier's Attack at 1/2/3 stacks (max 3). All four last about 10 s (a tick every ~2.5 s). Frost, Stun and other statuses are unverified. The only calculated values on the site are clearly labelled:
   - **Skill levels below max:** Lv. 1 = max ÷ 1.75 times the measured multipliers (`SKILL_LEVEL_MULTIPLIERS`). Every level is measured; values can be 1 off the game because of rounding.
3. Codex values are post-patch 1.1.0. Patch 1.1.2 changed nothing in the balance. The 1.1.0 notes list every skill's Lv. 1 multiplier before and after; × 175 they equal the codex max-level % (124 of 126 exact; the notes swap the names of Alex's Auto and Jump attacks, Brandish and Dive Kick, so the codex names are kept).
4. **Dodge** (the `Dash` slot) can't be upgraded (always Lv.1) and does no damage: the hero's own skill window shows no damage value. The codex shows the jump attack's value next to it anyway. That number is kept out of the description and stored as the skill's `codexAttackPct`, which the page doesn't show. Don't put it back unless David confirms Dodge damage later in the game. Dash *attack* is a separate skill and does do damage.
   **Skill levels:** Auto, Dash and Jump attacks max at Lv.7; Skill, Ultimate, Special A and Special B at Lv.10; Mastery (passive) can't be levelled.
5. **Archetypes and their heroes:**
   - Venom (Poison): Johnny, Charlotte
   - Amplitude (Stun): Lute, Theresia
   - Crushing (Knockdown): Alex
   - Gale (Airborne): Reina, Eileen
   - Bloodburst (Bleed): Roxy
   - Blazeflame (Burn): Aria, Kalien, Kalsion
   - Frostbite (Frost): Dana, Cerese, Othello
   - Thunderbolt (Shock): Ornette, Sion, Tarte, Ryza
   - Breaker (Break): Castella, Astria

   Many heroes inflict Knockdown, but Alex is the only Crushing hero.
6. **Default build:** a 3-piece set matching the archetype, plus a 2-piece set chosen by `tools/hero_stats.py` (`HERO_BUILDS[hero].setChoice`). Since 28 Oct 2026 that's The Infiltrator for every damage build (about +0.4–1.6% over Battle Will), and Battle Will for the supports (Lute, Dana, Sion) and the tank. Exceptions to the 3-piece:
   - Castella and Astria: 3 Ruinsbreaker
   - Alex: 3 Earthshatterer

   Main stats and substats per slot are in `HERO_BUILDS` (see "Gear, builds and end-game stat totals" below). Karma: the signature first, then the best general card of the hero's own archetype.
7. The old Excel workbook (`DragonSword_Awakening_Master_Reference_Claude_Edit_27Oct_v2.xlsx`, kept on David's Google Drive) is **out of date**. Use `data.json` instead.

## Gear, builds and end-game stat totals

**Gear rules (from David's testing; may change):**
- Main stat values depend on the upgrade level. Each substat has one fixed value.
- Green gear maxes at +6 with 2 substats, Blue at +9 with 3, Purple at +12 with 4, Orange at +15 with 5. Substats unlock at +3, +6, +9, +12 and +15.
- A piece can't have the same stat as both main and substat. Flat and % versions (e.g. `Attack` and `Attack Power Up`) count as different stats. Substats on one piece are all different.
- Cooldown Reduction and Status Application Rate don't exist on armour. Don't recommend them.
- Helmet, Gloves and Boots have identical tables for now.

**How the page calculates the totals** (`endgameStats()` in `index.html`; all inputs are in `data.json`):
- Attack = (hero base + signature Karma base Attack + flat Attack from gear) × (1 + all Attack Power Up %). Defense and Max HP work the same way with Defense Up and Max HP Up.
- Every other stat is a plain sum: hero, Karma traits at Ascension 6, gear main stats at +15, and substats.
- Set bonuses (always-on and conditional) are calculated separately and shown in green next to the total, with a hover giving the source and the condition.
- Awakening stat bonuses (all six awakenings, from `AWAKENINGS[hero].list[].effects`) are added after the set bonuses and shown in purple, with a hover naming the awakening.
- Only the signature Karma counts; the second Karma doesn't.

**How `HERO_BUILDS` was chosen** (by role and team position, after checking skill text):
- **Damage builds** (Main DPS, Sub-DPS and the enablers Reina and Kalien): every combination of Attack Power Up, Crit Rate and Crit Damage main stats was tried. The one with the highest Attack × (1 + Crit Rate × Crit Damage) won. The calculation counts all six awakenings' stat bonuses and the 2-piece set's always-on bonus, caps Crit Rate at 100% and leaves out 3-piece bonuses, except Blazing Flames' Crit Rate for Aria, Kalien and Kalsion (they apply Burn with almost every skill). Spare substat slots get Defense Ignore, then the hero's own status Additional Attack Power.
- **2-piece set** (damage builds): the mains are re-optimised for Battle Will, The Infiltrator, and the set of every status one of the hero's skills needs (Azure Gale, Earthshatterer, Holy Arbiter, Ruinsbreaker). A status set's +15% Additional Damage only counts on hits from skills that need that status. Those hits are weighted for their status bonus (`DAMAGE_TESTS`), and different statuses' Additional Damage is assumed to add (the cautious case, untested). `setChoice` stores the comparison, including what status sets would give if the bonuses multiply. The profile `gear` sentence and `build.sets` are rewritten to match by `--write`.
- **Support builds** (Lute, Dana, Sion): Max HP Up chest and Defense Up legs, damage on the other three slots. Their heals and buffs are % of max HP or flat %, so their own stats can't raise them.
- **Tank build** (Alex): Max HP Up and Defense Up in every slot, with HP, Defense and crit-resistance substats.

**Observations not used in the totals yet** (in `HERO_STAT_MODEL.observations`):
- every status resistance is 50, at any level;
- Titles (achievement rewards) add account-wide passive bonuses to every hero. Base stats exclude them, and so do the totals until the title effects are known. Ask David whether a measurement was taken with titles active.
- displayed stats are rounded down.

### Hero base-stat estimates

Every hero levels identically; only breakthrough bonuses differ.
- **Levelling:** the level part follows `a + b(e^(r(L-1)) - 1)`, a best fit to the measured levels 1, 10, 20 and 30. It's within 1 point for Attack and Defense and within 5 for Max HP; a quadratic fits worse. At level 70 that's 828 Attack / 232 Defense / 5,375 Max HP before breakthroughs.
- **Level-40 check:** before the breakthrough, this curve predicts 426 / 132 / 2,852 for profile-B heroes and 440 / 127 / 2,777 for Charlotte. A measurement that differs means the curve should be refitted with the new point.
- **Breakthroughs** happen at levels 20, 30, 40, 50 and 60. Two profiles have been measured so far:
  - **Profile A** (Charlotte only): +32/+11/+173 at level 20 and +37/+13/+202 at level 30.
  - **Profile B** (measured on Johnny, Reina, Castella and Lute; used for everyone except Charlotte): +25/+13/+207 and +30/+16/+243. The profile isn't tied to role: Castella is a Main DPS and Lute a healer.
- The level 40–60 breakthroughs are assumed to keep rising by the same step each tier.

## Open tasks (for any assistant)

1. **When David sends measured level-70 stats for a hero:** put them in `HERO_BASE_STATS[hero]` and set `estimated: false`. If they're a breakthrough measurement instead, add it to `HERO_STAT_MODEL.measured` and recalculate that hero.
2. **If a measured hero doesn't match profile B**, add them to `HERO_STAT_MODEL.measured`, give them their own breakthrough numbers, re-estimate them and tell David.
3. **If testing changes the gear tables or rules**, update `GEAR_STATS`. Then re-check that each build in `HERO_BUILDS` doesn't use the same stat as both main and substat on one piece.
4. **Crit Rate above 100%:** settled by patch 1.1.0: crits happen exactly at your Critical Rate and monsters no longer have Critical Hit Resistance, so 100% is the most that counts. The builds already cap it there.
5. **Eileen as a crit buffer (waiting on David's tests):** Vanguard Banner gives +20% Crit Rate to allies in range, and Sion's Awakening 1 adds +10% to Orzea's Blessing. Because the builds sit at about 100% Crit Rate, those buffs are wasted on teammates. Once David measures Vanguard Banner's duration, cooldown or Rage and recast rate (TODO item 10), work out whether team-aware "with Eileen" builds pay off (Charlotte example: Crit Rate gloves → Crit Damage = +11% with the buff up, −2% without) and whether Eileen fits more teams. Ask David before adding such builds.
6. **Recalculating a damage build after the numbers change:** try all 3⁵ main-stat combinations as described above, or ask David before hand-editing.

## Tools

Run these from the repository root with Python 3; they need no extra packages.

- **`tools/validate_data.py`** checks every cross-reference and rule in data.json and exits with an error list if anything is wrong. Run it before every commit that touches data.json. It checks:
  - every name used in teams, builds and Karma exists;
  - gear builds are possible (each stat can roll on that slot, 5 different substats, main stat not repeated as a substat);
  - Karma A6 = 5 × A0;
  - awakening ratings are 0–5 and their effect stats are known;
  - every image path exists.
- **`tools/hero_stats.py`** recalculates `HERO_BASE_STATS` and the gear in `HERO_BUILDS` from the model and gear tables in data.json. Without `--write` it only shows the changes; with `--write` it saves them. Use it after:
  - refitting `HERO_STAT_MODEL.levelCurve` (e.g. with the level-40 numbers);
  - changing a breakthrough profile;
  - changing gear tables or signature Karma values.

  Heroes with `estimated: false` keep their measured numbers.
- **`tools/skill_meta.py --write`** regenerates `skills[].meta` and the profiles' `build`. Run it after editing skill text or the Karma or gear sentences.

## How to make changes

- **Don't change the look** unless David asks. Content changes go in `data.json`.
- Keep `data.json` valid JSON, UTF-8, and indented with 1 space as it is now. Don't rename keys; the page reads them by name.
- **New hero:** add a portrait to `assets/heroes/`, then add entries to `HEROES` and `CHARACTER_PROFILE_DATA`, the hero's Karma to `KARMA_DATA`, and team slots to `TEAM_DATA` if needed.
- **Make small commits with clear messages** (e.g. "Update Theresia Karma values"), so a single change can be reverted.
- `main` is protected against force-pushes and deletion. Don't try to rewrite history; use `git revert`.
- For larger or experimental work, use a branch and open a pull request instead of pushing straight to `main`.
- Before committing:
  - run `python3 tools/validate_data.py`;
  - check the page on a local server: no console errors, and the changed tab looks right.
