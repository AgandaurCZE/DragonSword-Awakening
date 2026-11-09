# Notes for ChatGPT / Codex

Hello from Claude. David works with both of us on this repository: mostly ChatGPT for artwork and some UI, Claude for data, notes and site code. This file is yours; the shared rules are in `AGENTS.md`.

## Note from Claude (9 Nov 2026)
David asked me to tidy every note file so only current information is left. What changed for you:
- **Start at `docs/README.md`.** It indexes every note. Where things stand: `docs/library/STATUS.md`. The site and its code map: `docs/library/SITE.md`. Every data key: `docs/DATA_REFERENCE.md`. Finished work: `docs/library/DONE.md`.
- `docs/PROJECT_HANDOFF.txt`, `docs/NEW_CHAT_BRIEFING.md`, `docs/TASK_dungeons_page.md` and `TODO_David_2026-10-29.txt` are retired (their content was moved, and they stay in git history). **Record your work in `CHANGELOG.md`** (newest first) and, if it changes what's open, in `docs/library/STATUS.md`.
- The long architecture summary that used to be here duplicated `AGENTS.md`, `SITE.md` and `DATA_REFERENCE.md`, so I replaced it with the pointers above. Nothing in it was lost.
- The GitHub repo is the only source of truth: all numbers come from David's in-game measurements, screenshots and the codex.
- Only 11 heroes are Lv.70 (9 Nov); the other 9 are being levelled. Earlier notes wrongly said all 20.

Leave me notes here or in the CHANGELOG whenever you like; I'll read them.

## David's main-only preview workflow (confirmed 2 Nov 2026)
- Work directly on `main`; no other branches unless David asks. Fetch first and build on the latest `origin/main`, keeping other assistants' changes; fetch again before pushing; never force-push.
- The public URL without a query must not change. All new work goes behind `?tiers=new` (`PREVIEW_PAGES`, `applyPreviewGate()`). Don't remove the gate before David approves the launch (`docs/LAUNCH_CHANGES.md`).
- Keep `index.html` in LF line endings (it was once converted to CRLF by accident; restored 3 Nov).
- Don't modify `AGENTS.md` or `CLAUDE.md` unless David asks.

## Mandatory checks after every change
1. **Validate syntax:** parse `data.json`; syntax-check the JavaScript in `index.html`; run `python3 tools/validate_data.py`.
2. **Check the diff:** the intended change is there, nothing duplicated or malformed, nothing removed by accident.
3. **Functional check:** serve with `python3 -m http.server` (not `file://`) and test the affected page with `?tiers=new` and without. If browser testing isn't available, say so; never claim a test that didn't run.
4. **CHANGELOG.md:** date, files, what changed, and the validation actually done.
5. **After pushing:** re-fetch and confirm the committed files contain the change and the changelog entry.

## Artwork
- Workflow and lessons: `docs/DUNGEON_ARTWORK_WORKFLOW.md` (one Normal preview first, then **Proceed** or **Stop**; 1672×240 banners; keep subjects anchored across I/II/III).
- Still open: banners for Eroded Underground Cemetery and Residual Worm Cleanup Zone.
- Provenance: the original Normal Dungeons design and artwork foundation are David's, made with the ChatGPT chat version. Later work moved the rewards to the key/count format shared with Trait Dungeons.
