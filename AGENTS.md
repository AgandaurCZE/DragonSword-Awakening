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
| `assets/` | Images as WebP: `heroes/<name>.webp` (portraits), `archetypes/<archetype>.webp`, `roles/<role>.webp`, `gear/<set>.webp`. File names are lowercase with hyphens. |
| `AGENTS.md` / `CLAUDE.md` | These notes. |

How the page starts: `index.html` runs `fetch('data.json')`, copies each top-level key into a global variable of the same name (`HEROES`, `TEAM_DATA`, …), then calls `startApp()`, which draws every tab. Opening `index.html` directly from disk (`file://`) fails because browsers block the fetch. Test with a local server instead, e.g. `python3 -m http.server` in the repository folder.

## `data.json` keys

| Key | Shape | Used by |
|---|---|---|
| `meta` | `{patch, balancePatch, updated, note}` | The header and the hover cards show "patch X (no balance changes since Y)". Update `patch` when the game patches. |
| `HEROES` | list of 20 `{name, archetype, portrait, archIcon, tiers{Early-game, Mid-game, End-game}, owned, role, classType}` | Tier List, Heroes, hover cards and filters. `role` must be exactly `Main DPS`, `Sub-DPS` or `Support` (it picks the role icon). `classType` must be one of `Damage / Control`, `Healer`, `Buffer`, `Tank`. `owned` is David's collection. |
| `ROLE_ICONS` | `{role: image path}` | Role badges and filters. |
| `ARCHES` | list of the 9 archetypes | Order of the archetype filter buttons. |
| `TIER_ORDER`, `TIER_COLORS` | tiers shown and their colours | Tier List page. |
| `ARCH_COLORS` | `{archetype: hex}`, sampled from the archetype icons | Colours of status words in skill text. |
| `STATUS_ARCHETYPE` | `{status word: archetype}`, e.g. `Poison → Venom` | Decides which skill-text words are coloured, and in which colour. |
| `TEAM_DATA` | list of `{tier, name, accent, lead, arch, members[{name, alts[]}], tags[], note}` | Teams page, plus the Synergy section on character pages. `lead` = `members[0].name` (the big portrait). Slot order: Main DPS, Sub-DPS, Support/enabler. `alts` are swap-ins for that slot. |
| `KARMA_DATA` | list of 53 `{archetype, name, signature, source, exclusive, traits[{label, a0, a6}], base{Attack, Defense, Max HP}}` | Karma tab **and** the hover cards on character pages; both are built by the same function, so one edit updates both. `a0` = Lv. 1 / Ascension 0, `a6` = Lv. 70 / Ascension 6, both from screenshots. |
| `CHARACTER_PROFILE_DATA` | `{heroName: {archetype, role, karma, gear, skills[{slot, skill, description}]}}` | Character pages (open one by clicking a hero). |
| `GEAR_DATA` | list of 12 `{name, source, two, three, icon, twoBonus[], threeBonus[]}` | Gear tab and the gear section on character pages. `two`/`three` are the display text; `twoBonus`/`threeBonus` are the same effects as `{stat, value, condition?}` for the stat totals. A 3-piece set gives its 2-piece bonus too (confirmed in-game: Ballad of Life +9% at 2 pieces, +15% at 3, nothing more at 5). |
| `GEAR_STATS` | `{slots: {Helmet, Chest, Legs, Gloves, Boots: {main: {stat: [16 values for +0..+15]}, sub: {stat: value}}}, percentStats[], rarities[], substatUnlockLevels[]}` | Best Main Stats and the stat totals. From David's in-game gear info (source of truth). |
| `HERO_BASE_STATS` | `{hero: {Attack, Defense, Max HP, Critical Hit Chance, Critical Damage, estimated, profile}}` | Level-70 hero stats with no gear or Karma. **Currently estimates** (`estimated: true`). Replace with measured values and set `estimated` to `false`. |
| `HERO_STAT_MODEL` | measurements + formula | Documents how the estimates were made (see "Hero base-stat estimates" below). Not read by the page except as reference. |
| `HERO_BUILDS` | `{hero: {type, why, rarity, level, pieces: {slot: {main, subs[5]}}}}` | Best Main Stats cards and the Recommended Endgame Stats totals on character pages. Stat names must match `GEAR_STATS` exactly. |
| `TITLES` | `{note, totalCount, ownedCount, ownedCumulative[], list[{name, obtained, passive[{stat, value}] or null}]}` | Achievement titles. Their passives apply to every hero. **Not shown on the page yet**: `titleBonusTotals()` in `index.html` sums them. Flat title stats add before % multipliers; title % joins the % pool (confirmed in-game). Only Novice Mercenary Crew's passive (Max HP +50) is known; `null` means not checked yet. |
| `SKILL_LEVEL_MULTIPLIERS` | `{note, byMaxLevel: {"7": [7 values], "10": [10 values]}, measured}` | Skill level slider (character pages and skill previews). Lv.1 = max ÷ 1.75; each level = Lv.1 × multiplier. `null` = not measured; the page fills those in evenly and marks them "(est.)". |
| `KARMA_ASCENSION` | `{note, multipliers[7], measured, rounding}` | Karma A0–A6 values (`karmaLevels()`): A0 × multiplier, rounded like the game (whole % and nearest 5). A1 = ×4/3 and A2 = ×5/3 (measured), A6 = ×5; A3–A5 are `null`, filled in evenly and marked "est.". |

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
- the generic fallback Karma per archetype (`genericKarmaByArchetype` in `renderProfileBuild`)
- the Karma-tab accent colours (`KARMA_ACCENTS`)
- the team tier label colours (`renderTeams`)
- the kit-type filter options (the `<select id="classType">`)
- the "NEW" badge on Ryza (`renderHeroes`)
- the skill-level ratio `SKILL_MAX_TO_LV1 = 1.75`
- the Karma trait → stat name mapping (`KARMA_TRAIT_STAT`) and the gear slot list (`GEAR_SLOTS`)

## Data rules

1. **Sources of truth:** hero skill data comes from the in-game codex; Karma stats, gear-set effects and the game's Recommended Combinations come from David's screenshots. If anything conflicts, the codex wins. Flag the conflict; don't guess.
2. **Never invent numbers.** Status mechanics (tick damage, durations) are unverified. The only calculated values on the site are clearly labelled:
   - **Skill levels below max:** Lv. 1 = max ÷ 1.75 and measured multipliers for Lv. 2–5 (`SKILL_LEVEL_MULTIPLIERS`). Unmeasured levels (6–9 on level-10 skills, 6 on level-7 skills) are filled in evenly and marked "(est.)".
   - **Karma Ascension 3–5:** filled in evenly between the measured A2 (×5/3) and A6 (×5) and marked "est.".
3. Codex values are post-patch 1.1.0. Patch 1.1.2 changed nothing in the balance.
4. **Dodge** can't be upgraded in the game and always shows the same value as the jump attack in the codex. This is correct; don't "fix" it.
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
6. **Default build:** a 3-piece set matching the archetype + 2-piece Battle Will. Exceptions:
   - Castella and Astria: 3 Ruinsbreaker + 2 Holy Arbiter
   - Alex: 3 Earthshatterer + 2 Battle Will

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
- Only the signature Karma counts; the second Karma doesn't.

**How `HERO_BUILDS` was chosen** (by role and team position, after checking skill text):
- **Damage builds** (Main DPS, Sub-DPS and the enablers Reina and Kalien): every combination of Attack Power Up, Crit Rate and Crit Damage main stats was tried. The one with the highest Attack × (1 + Crit Rate × Crit Damage) won, with Crit Rate capped at 100% and set bonuses excluded. Spare substat slots get Defense Ignore, then the hero's own status Additional Attack Power.
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
4. **Crit Rate above 100%:** the game says the final crit chance depends on the target's Critical Hit Resistance, so whether extra Crit Rate is useful hasn't been tested. The builds currently treat 100% as the most that counts.
5. **Recalculating a damage build after the numbers change:** try all 3⁵ main-stat combinations as described above, or ask David before hand-editing.

## How to make changes

- **Don't change the look** unless David asks. Content changes go in `data.json`.
- Keep `data.json` valid JSON, UTF-8, and indented with 1 space as it is now. Don't rename keys; the page reads them by name.
- **New hero:** add a portrait to `assets/heroes/`, then add entries to `HEROES` and `CHARACTER_PROFILE_DATA`, the hero's Karma to `KARMA_DATA`, and team slots to `TEAM_DATA` if needed.
- **Make small commits with clear messages** (e.g. "Update Theresia Karma values"), so a single change can be reverted.
- `main` is protected against force-pushes and deletion. Don't try to rewrite history; use `git revert`.
- For larger or experimental work, use a branch and open a pull request instead of pushing straight to `main`.
- Before committing, check the page on a local server: no console errors, and the changed tab looks right.
