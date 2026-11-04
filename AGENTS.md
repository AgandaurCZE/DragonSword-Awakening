# DragonSword: Awakening guide — notes for AI assistants

Read this before changing anything in this repository.

- Preserve existing line endings when editing files. `index.html` uses LF (Unix) line endings; never convert it to CRLF or rewrite unrelated lines.
- **Detail lives in `docs/DATA_REFERENCE.md`:** every data key's shape and renderer, text formats, the full data rules, the build and base-stat methods, assets and tool details. Read the relevant section before editing that data or code. Document new or changed keys there.
- New chat? `docs/NEW_CHAT_BRIEFING.md` has how David likes to work, the Test Kit and the open items. History: `CHANGELOG.md` (newest first) and `docs/PROJECT_HANDOFF.txt` (newest last).

## David's main-only preview workflow — confirmed 2 Nov 2026

- Work directly on `main`. Do not create additional branches for planned work unless David explicitly requests an exception.
- Before starting changes, fetch the latest remote commits and check available deployment status. Apply our work on top of the latest `origin/main`, preserving newer data, other assistants' changes and existing local work. Fetch again before pushing; integrate any intervening commits without force-pushing. Verify the resulting remote commit after pushing and check deployment status separately; if deployment status is unavailable, report that limitation rather than claiming deployment succeeded.
- The public URL without a query parameter must retain its current appearance, content and behaviour. All planned Codex/Claude changes belong behind `?tiers=new` on the same main branch. This is a runtime preview gate, not a separate branch or separate deployment.
- Commits to main deploy the shared files, but deployment must not promote preview features to public visitors. Verify both URLs whenever relevant. Do not treat main-only publishing as a request to launch the preview publicly.
- Once David and Claude's planned work is complete, David will approve converting the preview into the new public main site. Do not remove the gate before that approval.
- Before ending each task or reaching a chat limit, update repository Markdown handoff notes AND `docs/PROJECT_HANDOFF.txt`: request/scope, decisions/approvals, actual changes and files, validation and limitations, publication commits, completed versus pending work, and exact next steps. Update CHANGELOG.md for changes. Do not rely on chat memory or local-only outputs as the sole handoff.

## What this is

A fan-made guide for **DragonSword: Awakening** (HOUND13, PC/Steam): one static page on **GitHub Pages** from the `main` branch root, https://agandaurcze.github.io/DragonSword-Awakening/. Every commit to `main` goes live about a minute later. No build step, framework or server. The owner is David (UK English). He checks claims, so don't state anything the data can't back up.

- `data.json` holds **all guide content**. `index.html` holds layout, CSS and JavaScript, and no guide data. `assets/` holds images and source notes. `tools/` holds offline Python scripts. `docs/` holds notes and the Test Kit backup.
- At start-up `index.html` fetches `data.json`, copies each top-level key into a global of the same name, then `startApp()` draws every tab. `file://` fails, so test with `python3 -m http.server`.

## Preview gate

New work stays hidden until David says to launch. It appears only with `?tiers=new` (or `?preview=1`), through `PREVIEW_PAGES` and `applyPreviewGate()`. Add any new tab to `PREVIEW_PAGES`. The plain URL must not change.

## `data.json` key index

| Area | Keys |
|---|---|
| Heroes | `HEROES`, `CHARACTER_PROFILE_DATA`, `AWAKENINGS`, `HERO_BASE_STATS`, `HERO_STAT_MODEL`, `HERO_BUILDS`, `SKILL_LEVEL_MULTIPLIERS`, `SKILL_BUFF_LEVELS` |
| Tiers and teams | `TIER_LIST_V2`, `TOWER_TRIALS`, `TEAM_DATA`, `TIER_ORDER`, `TIER_COLORS` |
| Karma | `KARMA_DATA`, `KARMA_ASCENSION`, `KARMA_LEVELLING`, `GENERIC_KARMA` |
| Gear | `GEAR_DATA`, `GEAR_STATS`, `GEAR_UPGRADE`, `RUNES` |
| Mechanics | `DAMAGE_TESTS`, `DEFENSE_MODEL`, `DAMAGE_CALC`, `STATUS_EFFECTS`, `LEVEL_COSTS` |
| Other pages | `DUNGEONS`, `TRAIT_DUNGEONS`, `FAMILIARS`, `TITLES`, `COOKBOOK`, `GUIDES`, `PATCH_NOTES` |
| Shared | `meta`, `schemaVersion`, `ARCHES`, `ARCH_COLORS`, `STATUS_ARCHETYPE`, `ROLE_ICONS`, `UI_ICONS` |

Item Database and Achievements read `assets/items/*.json` when opened.

## Core data rules

1. **Never invent numbers.** Hero skill data comes from the in-game codex; Karma stats, gear-set effects and Recommended Combinations from David's screenshots. If sources conflict, the codex wins: flag it, don't guess.
2. **Tiers are never set by formula.** `TIER_LIST_V2.heroes` holds only ratings agreed with David.
3. Keep names exact: heroes, Karmas, sets, stats and archetypes are cross-references. Some profile sentences have fixed formats, so check "Text formats" in the reference before editing them.
4. If the Python optimiser (`tools/hero_stats.py`) changes, change its JS port in `index.html` too.
5. Generated fields: run `tools/skill_meta.py --write` after editing skill text or the Karma or gear sentences. Run `tools/hero_stats.py` without `--write` first to inspect changes.

## How to make changes

- **Don't change the look** unless David asks. Content changes go in `data.json`.
- Keep `data.json` valid JSON, UTF-8, and indented with 1 space as it is now. Don't rename keys; the page reads them by name.
- **New hero:** add a portrait to `assets/heroes/`, then add entries to `HEROES` and `CHARACTER_PROFILE_DATA`, the hero's Karma to `KARMA_DATA`, and team slots to `TEAM_DATA` if needed.
- **Make small commits with clear messages** (e.g. "Update Theresia Karma values"), so a single change can be reverted.
- `main` is protected against force-pushes and deletion. Don't try to rewrite history; use `git revert`.
- Work directly on `main` under David's main-only preview workflow above; do not create extra branches unless he explicitly requests them.
- Before committing:
  - run `python3 tools/validate_data.py`;
  - check the page on a local server: no console errors, and the changed tab looks right.
