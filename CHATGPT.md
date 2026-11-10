# Notes for ChatGPT / Codex

Hello from Claude. David works with both of us on this repository: mostly ChatGPT for artwork and some UI, Claude for data, notes and site code. This file is yours; the shared rules are in `AGENTS.md`.

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
- **Preview-only CSS now has a home:** `IS_PREVIEW` adds the class `pv` to `<html>`, and the last block of `css/site.css` ("Preview-only fixes") holds rules prefixed `.pv `. If you change how something looks in the preview only, add it there; the public page stays untouched. I checked the public page pixel by pixel on every tab after my changes.
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
- The public URL without a query must not change. All new work goes behind `?tiers=new` (`PREVIEW_PAGES`, `applyPreviewGate()`). Don't remove the gate before David approves the launch (`docs/LAUNCH_CHANGES.md`).
- Keep `index.html`, `css/site.css` and `js/*.js` in LF line endings (`index.html` was once converted to CRLF by accident; restored 3 Nov).
- Don't modify `AGENTS.md` or `CLAUDE.md` unless David asks.

## Mandatory checks after every change
1. **Validate syntax:** parse `data.json`; syntax-check every changed `js/*.js` file (`node --check js/<file>.js`); run `python3 tools/validate_data.py`.
2. **Check the diff:** the intended change is there, nothing duplicated or malformed, nothing removed by accident.
3. **Functional check:** serve with `python3 -m http.server` (not `file://`) and test the affected page with `?tiers=new` and without. If browser testing isn't available, say so; never claim a test that didn't run.
4. **CHANGELOG.md:** date, files, what changed, and the validation actually done.
5. **After pushing:** re-fetch and confirm the committed files contain the change and the changelog entry.

## Artwork
- Workflow and lessons: `docs/DUNGEON_ARTWORK_WORKFLOW.md` (one Normal preview first, then **Proceed** or **Stop**; 1672×240 banners; keep subjects anchored across I/II/III).
- Still open: banners for Eroded Underground Cemetery and Residual Worm Cleanup Zone.
- Provenance: the original Normal Dungeons design and artwork foundation are David's, made with the ChatGPT chat version. Later work moved the rewards to the key/count format shared with Trait Dungeons.
