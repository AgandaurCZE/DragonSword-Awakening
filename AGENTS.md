# DragonSword: Awakening guide — notes for AI assistants

Read this before changing anything in this repository.

## Golden rules: the checks come first (David, 11 Nov 2026)

David's instruction: these are the most important rules in the repository. They bind every assistant (Claude, ChatGPT, Codex, anyone) and come before everything else in this file.

1. **Before every commit, run `python3 tools/check_all.py`, and commit only when it ends with `ALL CHECKS PASSED`.** It checks the data rules, the data shape, the stored builds, line endings and file layout, JS syntax, the `?v=` cache numbers, and the site itself in a browser (no console errors or missing files on both URLs, the preview gate, the JS ports against Python). If it ends with `NOT RUN` (no browser on your machine), say so in your reply and in CHANGELOG, and treat rule 2 as the check.
2. **A push is published only if GitHub passes the same checks.** The workflow "Check and publish" (`.github/workflows/deploy.yml`) runs `check_all.py` on every push to `main` and publishes the site only when it passes. After pushing, look at the run for your commit (the repository's Actions tab, or `gh run list -L 3`). Green: live a few minutes later. Red: **your commit is not live, and nothing pushed after it will be until it's fixed.** Read the failed step, fix it with a new commit (never force-push, never undo someone else's work to get a pass). If you can't see the result, tell David you couldn't verify it; don't say it's live.
3. **Never weaken a check to get a pass.** Don't delete, skip, loosen or work around a check. Don't edit `.github/workflows/deploy.yml`, `tools/check_*.py`, `tools/public_diff.py`, `tools/validate_data.py`, `.gitattributes` or `.prettierrc.json` to make a failure go away, and never run `tools/check_shape.py --update` just to silence an error. If you think a check is wrong, stop, tell David, change it only with his OK, and record why in CHANGELOG.
4. **The public URL must not change before launch: prove it.** Before committing any change to `index.html`, `css/`, `js/` or an image, run `python3 tools/public_diff.py`. It must end with `public_diff OK`. A difference it reports is acceptable only when it is exactly the change David asked for; name it in CHANGELOG. For a change that should alter nothing anywhere (a tidy-up, a refactor), run it with `--preview` too.
5. **Changing the structure of the data** (a new, renamed or moved key, a different type, a new data file): document it in `docs/DATA_REFERENCE.md`, update the code that reads it, then run `python3 tools/check_shape.py --update` and read every line it prints: each must be a change you meant. Commit `tools/data_shape.json` with the data. A new data file the page reads goes into `FILES` in `tools/check_shape.py`. Adding entries (a hero, a Karma, a dish, a patch) needs no update.
6. **Changing a calculation.** The page's JS ports must give the same answers as the Python tools: `optBest` and `tools/hero_stats.py`, `gmBuild` and `tools/team_gear.py`. Change both sides in the same commit; the browser check compares them. A new calculation that exists in both languages gets its own comparison in `parity()` in `tools/check_site.py`. After changing gear tables, Karma values or awakening effects, run `python3 tools/hero_stats.py` (inspect, then `--write`): the "stored builds" check fails until the stored builds are current.
7. **Changing code.** After editing a file in `js/` or `css/`: run `npx --yes prettier@3.9.10 --write js css` (the agreed format), give every changed file a new `?v=` in `index.html`, keep LF line endings. A new script file is added to `index.html` in its numbered place.
8. **Adding to the site.** A new tab goes into `PREVIEW_PAGES` (the gate check fails if a preview page shows on the public URL). The browser check opens every menu page and every hero tab by itself; a new kind of view it can't reach that way (a pop-up, a calculator mode, a new deep link) must be added to `tools/check_site.py` in the same commit.
9. **Backups.** Every commit is a restore point, so keep commits small and undo with `git revert <commit>`. Before a large or risky change, write the current commit hash into your CHANGELOG entry as the point to go back to. The state before the 11 Nov 2026 upgrade is commit `1a15e2a`.
10. **Write it down as you go:** `CHANGELOG.md` (what changed from what into what, the date, the checks you ran and their result), `docs/library/STATUS.md`, `docs/library/DONE.md`.

How the checks work, what each message means and how to fix it: `docs/library/SITE.md`, "Checks and publishing".

- Preserve existing line endings when editing files. `index.html`, `css/site.css` and `js/*.js` use LF (Unix) line endings; never convert them to CRLF or rewrite unrelated lines. (`.gitattributes` enforces LF for every text file since 11 Nov 2026, and `check_all.py` fails on CRLF.)
- **Start at the library index `docs/README.md`.** It lists every note file by topic; `docs/library/STATUS.md` says where things stand and `docs/library/WORKING_WITH_DAVID.md` how David works and which mistakes to avoid. Keep both up to date.
- **Detail lives in `docs/DATA_REFERENCE.md`:** every data key's shape and renderer, text formats, the full data rules, the build and base-stat methods, assets and tool details. Read the relevant section before editing that data or code. Document new or changed keys there.
- New chat? Read `docs/library/WORKING_WITH_DAVID.md` and `docs/library/STATUS.md`. History: `CHANGELOG.md` (newest first); finished tasks: `docs/library/DONE.md`.
- **The GitHub repo is the only source of truth.** All numbers come from David's in-game measurements, screenshots and the codex, stored here; no outside data unless David asks.

## David's main-only preview workflow — confirmed 2 Nov 2026

- Work directly on `main`. Do not create additional branches for planned work unless David explicitly requests an exception.
- Before starting changes, fetch the latest remote commits and check available deployment status. Apply our work on top of the latest `origin/main`, preserving newer data, other assistants' changes and existing local work. Fetch again before pushing; integrate any intervening commits without force-pushing. Verify the resulting remote commit after pushing and check deployment status separately; if deployment status is unavailable, report that limitation rather than claiming deployment succeeded.
- The public URL without a query parameter must retain its current appearance, content and behaviour. All planned Codex/Claude changes belong behind `?tiers=new` on the same main branch. This is a runtime preview gate, not a separate branch or separate deployment.
- Commits to main deploy the shared files, but deployment must not promote preview features to public visitors. Verify both URLs whenever relevant. Do not treat main-only publishing as a request to launch the preview publicly.
- Once David and Claude's planned work is complete, David will approve converting the preview into the new public main site. Do not remove the gate before that approval.
- During each task and before ending it or reaching a chat limit, record in the repo: `CHANGELOG.md` (what changed, files, validation, commits), `docs/library/STATUS.md` (current task, what's pending, exact next steps) and `docs/library/DONE.md` (tasks that finished). Do not rely on chat memory or local-only outputs. (`docs/PROJECT_HANDOFF.txt` was retired on 9 Nov 2026.)

## What this is

A fan-made guide for **DragonSword: Awakening** (HOUND13, PC/Steam): one static page on **GitHub Pages** from the `main` branch root, https://agandaurcze.github.io/DragonSword-Awakening/. Every commit to `main` is checked by GitHub and, only if every check passes, published a few minutes later (golden rule 2). No build step, framework or server: the published site is exactly the committed files. The owner is David (UK English). He checks claims, so don't state anything the data can't back up.

- `data.json` holds **all guide content** (research the page never shows, `DAMAGE_TESTS`, is in `data/research.json` since 10 Nov 2026). Since 10 Nov 2026 the page is `index.html` (layout only), `css/site.css` (every style) and `js/01-core.js` … `js/09-startup.js` (the script, in load order); none of them holds guide data. When you change a CSS or JS file, bump its `?v=` in `index.html`. `assets/` holds images and source notes. `tools/` holds offline Python scripts. `docs/` holds notes and the Test Kit backup.
- At start-up `js/09-startup.js` fetches `data.json`, copies each top-level key into a global of the same name, then `startApp()` draws every tab. `file://` fails, so test with `python3 -m http.server`.

## Preview gate

New work stays hidden until David says to launch. It appears only with `?tiers=new` (or `?preview=1`), through `PREVIEW_PAGES` and `applyPreviewGate()`. Add any new tab to `PREVIEW_PAGES`. The plain URL must not change.

## `data.json` key index

| Area | Keys |
|---|---|
| Heroes | `HEROES`, `CHARACTER_PROFILE_DATA`, `AWAKENINGS`, `HERO_BASE_STATS`, `HERO_STAT_MODEL`, `HERO_BUILDS`, `SKILL_LEVEL_MULTIPLIERS`, `SKILL_BUFF_LEVELS` |
| Tiers and teams | `TIER_LIST_V2`, `TOWER_TRIALS`, `TEAM_DATA`, `TIER_ORDER`, `TIER_COLORS` |
| Karma | `KARMA_DATA`, `KARMA_ASCENSION`, `KARMA_LEVELLING`, `GENERIC_KARMA` |
| Gear | `GEAR_DATA`, `GEAR_STATS`, `GEAR_UPGRADE`, `RUNES` |
| Mechanics | `DEFENSE_MODEL`, `DAMAGE_CALC`, `STATUS_EFFECTS`, `LEVEL_COSTS` (training-dummy research `DAMAGE_TESTS` lives in `data/research.json`, which the page doesn't load) |
| Other pages | `DUNGEONS`, `TRAIT_DUNGEONS`, `FAMILIARS`, `TITLES`, `COOKBOOK`, `GUIDES`, `PATCH_NOTES` |
| Shared | `meta`, `schemaVersion`, `ARCHES`, `ARCH_COLORS`, `STATUS_ARCHETYPE`, `ROLE_ICONS`, `UI_ICONS` |

Item Database and Achievements read `assets/items/*.json` when opened.

## Core data rules

1. **Never invent numbers.** Hero skill data comes from the in-game codex; Karma stats, gear-set effects and Recommended Combinations from David's screenshots. If sources conflict, the codex wins: flag it, don't guess.
2. **Tiers are never set by formula.** `TIER_LIST_V2.heroes` holds only ratings agreed with David.
3. Keep names exact: heroes, Karmas, sets, stats and archetypes are cross-references. Some profile sentences have fixed formats, so check "Text formats" in the reference before editing them.
4. If the Python optimiser (`tools/hero_stats.py`) changes, change its JS port in `js/04-gear-builds.js` too; the same for `tools/team_gear.py` and `gmBuild` (golden rule 6: the browser check compares them).
5. Generated fields: run `tools/skill_meta.py --write` after editing skill text or the Karma or gear sentences. Run `tools/hero_stats.py` without `--write` first to inspect changes.

## How to make changes

- **Don't change the look** unless David asks. Content changes go in `data.json`.
- Keep `data.json` valid JSON, UTF-8, and indented with 1 space as it is now. Don't rename keys; the page reads them by name.
- **New hero:** add a portrait to `assets/heroes/`, then add entries to `HEROES` and `CHARACTER_PROFILE_DATA`, the hero's Karma to `KARMA_DATA`, and team slots to `TEAM_DATA` if needed.
- **Make small commits with clear messages** (e.g. "Update Theresia Karma values"), so a single change can be reverted.
- `main` is protected against force-pushes and deletion. Don't try to rewrite history; use `git revert`.
- Work directly on `main` under David's main-only preview workflow above; do not create extra branches unless he explicitly requests them.
- Before committing: `python3 tools/check_all.py` (golden rule 1), and `python3 tools/public_diff.py` if you touched `index.html`, `css/`, `js/` or an image (golden rule 4). Then look at the changed tab yourself on a local server: the checks prove nothing broke, not that the new thing looks right.
