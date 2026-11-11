# Notes for ChatGPT / Codex

Hello from Claude. David works with both of us on this repository: mostly ChatGPT for artwork and some UI, Claude for data, notes and site code. This file is yours; the shared rules are in `AGENTS.md`.

## Beta launch (11 Nov 2026)
David explicitly approved promoting the preview and deleting the legacy public view. Root is Shortcuts; all features are public, with clean paths and unified hero/tier addresses. Read the current Beta workflow in AGENTS and routing in DATA_REFERENCE. Edit root index only, regenerate route copies with `python3 tools/build_routes.py`, run full checks and pixel comparison. Preserve the share art, golden favicon, original logo and LF. Older preview-only instructions below are historical, not current requirements.

## Approved work (11 Nov 2026)
David approved cleanup of clearly stale notes and selected task #9 option A (shared account data for tools; retain website maximum-build defaults) and #7 option A (exact visitor-settings restore with review and recovery). Confirmed-complete notes have been reconciled. Task #9 is complete (explicit account levels; signatures from existing flags); task #7 is implemented in the preview Tools tab (exact restore with validation, review and undo). See DATA_REFERENCE for both contracts; do not reimplement the completed handovers. The earlier Actions API block is resolved in this environment; check actual access and exact deployment SHA each session.

## Codex review (11 Nov 2026)
Reviewed all 18 Markdown files and the current architecture/checks at `da91cfa`; the full `check_all.py` passed locally, including browser and parity checks. That review could not verify deployment then; API access was subsequently restored. The eleven SITE handover entries were assessed, not implemented: #1/#2/#3/#5/#6 suit a cheaper model with focused review; #7/#9 and later #8 merit stronger implementation/review; #4 needs approval/art, #10 launch approval, #11 is explicitly do-not-do. Details and stale-note examples are in the matching CHANGELOG entry. The old PROJECT_HANDOFF is retired; use the library. Read current data rather than old snapshots of David's account; all five Currency Dungeons are now known.

## Note from Claude (11 Nov 2026): golden rules and automatic checks — read this first
David asked for a big structural upgrade and for its rules to be the most important ones for all of us. They are at the top of `AGENTS.md` ("Golden rules"); the machinery is explained in `docs/library/SITE.md`, "Checks and publishing". The short version:
1. **Before every commit: `python3 tools/check_all.py`.** Commit only on `ALL CHECKS PASSED`. It replaces the manual list that used to be here (JSON parse, `node --check`, validator, console check).
2. **GitHub runs the same checks on every push and publishes the site only if they pass.** A red run on the Actions tab means your commit is not live. Fix it with a new commit; never loosen a check to get a pass.
3. **The pixel check is a tool now: `python3 tools/public_diff.py`** before committing any change to `index.html`, `css/`, `js/` or an image (also for artwork you replace: a changed public picture will be reported, which is fine when it's the change David asked for; say so in CHANGELOG).
4. **`js/` and `css/` are formatted** (one statement or declaration per line). After editing them: `npx --yes prettier@3.9.10 --write js css`, and a new `?v=` for each changed file (now checked).
5. **A new or renamed data key** needs `python3 tools/check_shape.py --update` (read what it prints) and a line in `docs/DATA_REFERENCE.md`.
6. Open site tasks anyone can take are listed in `docs/library/SITE.md`, "Handed over on 11 Nov".

## Note from Claude (9 Nov 2026)
David asked me to tidy every note file so only current information is left. What changed for you:
- **Start at `docs/README.md`.** It indexes every note. Where things stand: `docs/library/STATUS.md`. The site and its code map: `docs/library/SITE.md`. Every data key: `docs/DATA_REFERENCE.md`. Finished work: `docs/library/DONE.md`.
- `docs/PROJECT_HANDOFF.txt`, `docs/NEW_CHAT_BRIEFING.md`, `docs/TASK_dungeons_page.md` and `TODO_David_2026-10-29.txt` are retired (their content was moved, and they stay in git history). **Record your work in `CHANGELOG.md`** (newest first) and, if it changes what's open, in `docs/library/STATUS.md`.
- The long architecture summary that used to be here duplicated `AGENTS.md`, `SITE.md` and `DATA_REFERENCE.md`, so I replaced it with the pointers above. Nothing in it was lost.
- The GitHub repo is the only source of truth: all numbers come from David's in-game measurements, screenshots and the codex.
- (Superseded 10 Nov: all 20 heroes are Lv.70 now.)

Leave me notes here or in the CHANGELOG whenever you like; I'll read them.

## Note from Claude (10 Nov 2026)
- David's account moved a lot today: all 20 heroes Lv.70, all masteries, 12 heroes at A6 and 7 at A3 (`docs/library/STATUS.md`). The preview tier list was re-rated with Masteries (`docs/library/DECISIONS.md`).
- **Historical, superseded at Beta launch:** `IS_PREVIEW` adds the class `pv` to `<html>`, and the last block of `css/site.css` ("Preview-only fixes") holds rules prefixed `.pv `. If you change how something looks in the preview only, add it there; the public page stays untouched. I checked the public page pixel by pixel on every tab after my changes.
- `index.html` has a map of the script and styles at their tops, and `// ====` section headers. I removed 4 unused functions and 24 unused CSS rules (listed in CHANGELOG).
- The preview no longer waits for the dungeon banners at start-up; `preloadDungeonBanners()` now runs when a Dungeons page is first opened, and Normal Dungeons draws on first open. If you add art that must be ready before a page shows, preload it on that page's first open, not at start-up.
- `tools/validate_data.py` now also checks `FAMILIARS.owned` against the owned flags, and that every new-tier-list hero and tag exists.

## Note from Claude (10 Nov 2026, later): the page is now split into files
David approved it. `index.html` is just the layout; styles are in `css/site.css`; the script is nine files in `js/`, loaded in order (`01-core` … `09-startup`), sharing one global scope. Three things to know:
1. **Bump `?v=` in `index.html`** for any CSS or JS file you change, or visitors may get the old copy for a few minutes.
2. **Code that runs at load time may only use what earlier files define** (function calls inside event handlers or after `startApp()` are fine).
3. **Image paths put into CSS variables from the script go through `absUrl()`** (e.g. `--bg:url('${absUrl(path)}')`), because `url()` in a variable resolves against `css/`. Inside `css/site.css` itself, asset paths start with `../assets/`.
Also new today: source screenshots live in `assets/sources/`, research-only data in `data/research.json`. Everything was checked pixel by pixel on both URLs.

## David's main-only preview workflow (confirmed 2 Nov 2026)
- Work directly on `main`; no other branches unless David asks. Fetch first and build on the latest `origin/main`, keeping other assistants' changes; fetch again before pushing; never force-push.
- Superseded by David's approved Beta launch (11 Nov): former preview is public; root Shortcuts, clean paths, old hashes accepted. Do not restore the gate.
- Keep `index.html`, `css/site.css` and `js/*.js` in LF line endings (`index.html` was once converted to CRLF by accident; restored 3 Nov).
- Don't modify `AGENTS.md` or `CLAUDE.md` unless David asks.

## Mandatory checks after every change (updated 11 Nov: see the golden rules in `AGENTS.md`)
1. **Run `python3 tools/check_all.py`** (data rules, data shape, stored builds, file rules, JS syntax, cache numbers, the site in a browser on both URLs). For page files and pictures also `python3 tools/public_diff.py`.
2. **Check the diff:** the intended change is there, nothing duplicated or malformed, nothing removed by accident.
3. **Look at it yourself:** serve with `python3 -m http.server` (not `file://`) and look at the affected page with `?tiers=new` and without. If the browser checks couldn't run on your machine, say so; never claim a test that didn't run.
4. **CHANGELOG.md:** date, files, what changed, and the validation actually done.
5. **After pushing:** re-fetch and confirm the committed files contain the change and the changelog entry, then check the "Check and publish" run for your commit on the Actions tab: the site is only updated when it's green.

## Artwork
- Workflow and lessons: `docs/DUNGEON_ARTWORK_WORKFLOW.md` (one Normal preview first, then **Proceed** or **Stop**; 1672×240 banners; keep subjects anchored across I/II/III).
- Still open: banners for Eroded Underground Cemetery and Residual Worm Cleanup Zone.
- Provenance: the original Normal Dungeons design and artwork foundation are David's, made with the ChatGPT chat version. Later work moved the rewards to the key/count format shared with Trait Dungeons.
