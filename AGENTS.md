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
| `GEAR_DATA` | list of 12 `{name, source, two, three, icon}` | Gear tab and the gear section on character pages. |

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

## Data rules

1. **Sources of truth:** hero skill data comes from the in-game codex; Karma stats, gear-set effects and the game's Recommended Combinations come from David's screenshots. If anything conflicts, the codex wins. Flag the conflict; don't guess.
2. **Never invent numbers.** Status mechanics (tick damage, durations) are unverified. The only calculated values on the site are clearly labelled:
   - **Skill levels below max:** Lv. 1 = max ÷ 1.75, rising in even steps, marked "(est.)". The 1.75 ratio holds for every skill changed in patch 1.1.0.
   - **Karma Ascension 1–5:** even steps between `a0` and `a6`.
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

   Main stats: a Crit DMG chest only if the build gives Crit Rate, otherwise a Cooldown Reduction chest; Attack on the legs for everyone. Karma: the signature first, then the best general card of the hero's own archetype.
7. The old Excel workbook (`DragonSword_Awakening_Master_Reference_Claude_Edit_27Oct_v2.xlsx`, kept on David's Google Drive) is **out of date**. Use `data.json` instead.

## How to make changes

- **Don't change the look** unless David asks. Content changes go in `data.json`.
- Keep `data.json` valid JSON, UTF-8, and indented with 1 space as it is now. Don't rename keys; the page reads them by name.
- **New hero:** add a portrait to `assets/heroes/`, then add entries to `HEROES` and `CHARACTER_PROFILE_DATA`, the hero's Karma to `KARMA_DATA`, and team slots to `TEAM_DATA` if needed.
- **Make small commits with clear messages** (e.g. "Update Theresia Karma values"), so a single change can be reverted.
- `main` is protected against force-pushes and deletion. Don't try to rewrite history; use `git revert`.
- For larger or experimental work, use a branch and open a pull request instead of pushing straight to `main`.
- Before committing, check the page on a local server: no console errors, and the changed tab looks right.
