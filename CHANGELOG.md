Older months: [October 2026](docs/library/CHANGELOG_2026-10.md). Newest first.

## 12 Nov 2026 — Browser tab names (Claude)
- Restore point: `4daf3ce`.
- David's scheme (11 Nov): home "DragonSword: Awakening, Guides, tools & Tier List"; every other view "<Name> | DragonSword: Awakening": the menu name (e.g. "Karma", "Normal Dungeons", "Item Database", "Patch Notes"); every tier list mode "Tier List"; a hero on any tab "<Hero> Build Guide"; the tool views "Damage Calculator", "Levelling Calculator" and "Backup & Restore" (`/tools`). Was "DragonSword: Awakening — <page>" and "— Beta guide".
- Code: `setTabTitle` and `tabTitleFor` in `src/js/01-core.js`, used by the page switch (05), hero profile (03), tier close (04) and the address history (09: after every recorded view, on load and on Back/Forward, so tool switches and Back get the right name). `src/index.html` `<title>` is the home name, so every route entry starts with it until the script runs; the share tags are unchanged. Route entries regenerated (`tools/build_routes.py`). `?v=20261112a` on js 01, 03, 04, 05, 09.
- Checks: new `tab_titles()` in `tools/check_site.py` (golden rule 8; nothing removed or loosened): eight addresses, the Ryza Build tab, Gear after a hero and Back. `public_diff.py`: all 109 views match. `check_all.py`: ALL CHECKS PASSED.

## 12 Nov 2026 — Organise site source and URL folders (Codex; David requested)

- Restore point: `a7644fbc734227ad715cb70e82ddf3f6c4d2d29d`, latest main and successful Beta deployment confirmed before work.
- Moved editable HTML/CSS/JS together under `src/`; generated home/hero/page/tool entry files together under `routes/`. Removed the generated entry folders from the repository root and Python tools directory. `tools/` remains the Python development/checking folder. Assets and all Markdown files retain their locations; only current path/workflow references and required work logs are updated in the notes.
- Added `tools/build_site.py` and `tools/serve_site.py`. Publishing assembles a clean committed Git archive: URL entries at the public root, scripts/styles at their original `/js` and `/css` paths, and assets, data, notes, Test Kit and planner copied unchanged. No URL, view, calculation, image or game-data changes intended.
- Adapted path-dependent checks, formatter discovery, local browser/pixel serving and the publish assembly step to this requested layout. No check removed/skipped or tolerance loosened. The cache check compares file contents across old/new paths (rather than treating a move as a content change); changed contents still require a version bump. Route checks now include the generated home and reject URL entries outside `routes/`.
- Assembly initially found a collision between the `/tools` route and copied Python tools; fixed by merging those directories in the output, preserving both at their original public paths.
- Verification so far: all 675 published asset/data/code/URL files match the previous release byte for byte (generated HTML comments excluded); temporary cache-guard probe rejected modified JS with an unchanged cache version across the move, and source bytes were restored exactly. Final `python3 tools/check_all.py`: ALL CHECKS PASSED. `python3 tools/public_diff.py --preview`: all 218 views match HEAD pixel for pixel. Formatter discovery confirmed (`ignored:false` for moved JavaScript); clean staged Git archive assembly passed, including public URL entries and online notes/Test Kit. Release commit: “Organise website source and URL folders”; publication remains gated by its exact-SHA GitHub checks.

## 11 Nov 2026 — Public Beta launch (Codex; David approved)

- Restore point before migration: `6c5f5167e927fc670a0ece5facd692bef83913f3` (David's exact `assets/logo_2x.png` upload). Fetched latest main and confirmed its Check and publish run succeeded; all new branding and previous assistants' work retained.
- Former `?tiers=new` features are public; legacy public tier markup/renderers and runtime preview gate removed. Root opens ordered Shortcuts (Database, Dungeons, three disabled Guide placeholders, Tools). Centred capital bold section headings enlarged; game assets reused for cards. Original logo links home; separate BETA badge. Share strip, golden favicon and touch icon bytes unchanged.
- Clean paths for every page, unified hero and tier URLs, dungeon and calculator paths as David specified. Old query/hash links canonicalize. Browser history stores views/scroll; hero tabs and tier modes replace the same address. GitHub Pages gets real, committed route entry shells so direct links and refresh return 200; `tools/build_routes.py --check` guards synchronization with root index.
- Preview dungeon frames/art, difficulty selectors, Karma levels, title effects and full gear model promoted everywhere. Old workbook/Netlify public wording replaced; displayed profile ratings use the agreed current ratings. Review prose is still David's separate rewrite.
- New `SITE` data contract documented in DATA_REFERENCE; all 20 shape additions inspected (only SITE/configuration and its children). No game measurements, formulas, build records, ownership flags or review prose altered. Route/card asset checks added to validator.
- Launch approval supersedes the old preview gate contract: browser assertions now require the public Beta instead of hiding it. The pixel tool now recognizes either the old shell or Beta startup and waits for completed gear output on both URLs; pixel tolerance and the second-render comparison are unchanged. No quality checks skipped: original smoke, parity, progress restore/undo and Karma level checks retained; direct/reload routes, shortcut order, unified URLs, Back/Forward, compatibility links, repository-prefix hosting, dungeon controls, calculators, rich-link popovers and boss glow/crossfade covered.
- Validation: final `python3 tools/check_all.py` ended with `ALL CHECKS PASSED` (data, shape, stored builds, 39 route entries, LF/file rules, JS syntax, cache versions, complete browser/parity/storage/interaction tests and Prettier). Desktop and phone home/profile layouts reviewed. `python3 tools/public_diff.py --preview` completed both render passes: 218 views captured, 194 shared views changed dimensions and 24 additional public/home views are present (reported as 195 difference records). Expected exit 1 for the explicitly approved migration, not a claim of pixel identity. Reviewed the home, profile and Gear layouts; no unexpected source/data/art changes. Expected pixel changes are exactly the approved public promotion, home, branding, headings, launch wording/current rating displays and former preview layout fixes. The release commit is titled “Launch public Beta with shortcuts and clean URLs”; GitHub must pass its exact-SHA check and publish jobs before the release is live.

## 11 Nov 2026 — Amplitude icon report closed after David's confirmation
- David reports the icon remains visible in Firefox after restarting his PC and reopening the site; no filter redraw is needed. Investigation closed unless it recurs. The original cause remains unconfirmed.
- Updated STATUS and DONE; superseded the transferable pending-investigation handoff. No site source, asset, data, commit or deployment change was needed. No further Firefox installation or network expansion is required for this report.

## 11 Nov 2026 — Investigate Firefox Amplitude filter placeholder (Codex; subsequently closed without a site fix)
- Scope: Amplitude filter icon appears as a square until redraw on Firefox desktop in Heroes/Karma. Fetched main at 52e17ef; API confirms its checks and publishing succeeded.
- Asset path is correct; amplitude.webp is unchanged since 3 Nov and decodes correctly. Six clean Chromium loads (public/preview) passed. Injecting a first-request failure reproduced the sticky placeholder and redraw recovery, but is not proof of the original cause.
- Historical blocker at investigation time (report subsequently closed by David): Firefox-specific reproduction was pending; Firefox is not installed and the official Playwright download is blocked at cdn.playwright.dev / playwright.download.prss.microsoft.com. No source, asset or data change applied. David subsequently confirmed the symptom disappeared after a PC restart; no next steps unless it recurs.
## 11 Nov 2026 — Share picture and tab icon (Claude)
- **Handover #4, approved by David to go live now (both URLs):** `<head>` gets a description, `theme-color`, Open Graph tags (title "DragonSword: Awakening, Guides, tools & Tier List", description, URL, picture with size and alt text) and `twitter:card` = large picture. New files in `assets/ui/`: `og-image.jpg` (1200×630, David's pick: all 20 hero portraits under the title in the site's gothic font), `favicon.png` (64 px) and `apple-touch-icon.png` (180 px), both the gold hero emblem from the menu on the page's dark background. Visible on the public page: only the browser-tab icon.
- David asked for only these two things now; the new tab names and the home page are the next steps (STATUS).
- Checks: `public_diff.py` OK (87 views); icon file loads in a browser; `check_all.py` below.

## 11 Nov 2026 — Handover tasks 1, 2, 3, 5, 6 and the Karma level picker (Claude)
- Restore point: `52e17ef`.
- **#1 menu names:** at start-up every `.nav-item` gets `aria-label` from its label (both URLs, nothing visible); in the preview also `title`, so the icon-only phone menu shows names on hover/long-press.
- **#2 phone dungeon cards (preview):** under 800 px the card is 190 px (was 148) and `.dng-name` sits left-aligned between the difficulty row and the rewards, so it no longer hides behind them. Checked on five cards, two-line names included.
- **#3 profile padding (preview):** `.pv #profilePage` 22 px left and right, 10 px under 800 px, the same as the Karma page.
- **#5:** root `README.md` for visitors (what the guide is, the link, the credit line from LAUNCH_CHANGES, a pointer to AGENTS.md for assistants). Its feature list names only what the public page shows.
- **#6:** October 2026 entries (from "31 Oct 2026 — Cookbook tab" down) moved unchanged to `docs/library/CHANGELOG_2026-10.md`, linked from the top of this file and from docs/README. A file instead of the suggested `changelog/` folder, because new folders need David's OK.
- **Karma level picker (preview):** "Base stats at" on the Karma page (Lv.1, Lv.20–60 before and after each breakthrough, Lv.70). Balanced and Attack cards show the measured tables from `KARMA_LEVELLING.measured` (every card of a type shares the same stats; checked for all 53); Defense and High Attack cards say "not measured yet" between Lv.1 and Lv.70, nothing is interpolated. `KARMA_LEVELLING` is now loaded by the page (`js/01-core.js`, `js/09-startup.js`); its note string updated. Code in `js/02-teams-karma.js`.
- **Checks:** new `preview_views()` in `tools/check_site.py` (golden rule 8; nothing removed or loosened): every picker level against the measured tables, and the `#hero/Ryza/build` address plus Back. `public_diff.py`: all 87 public views match. `python3 tools/check_all.py`: ALL CHECKS PASSED. `?v=20261111c` on css, js/01, js/02, js/09.

## 11 Nov 2026 — Preview visitor progress backup and restore (Codex, handover #7)
- David chose exact restore with review and recovery (option A). Restore point: 92a4e43. Added a third Tools tab, Backup & restore, only in the existing preview. No account preset or additional public page.
- Downloads a versioned JSON file containing exactly the five agreed title/achievement/cookbook/calculator keys. Validates the entire upload (including nested calculator inputs) before a review is shown; Cancel writes nothing. Exact restore removes sections absent in the saved state and leaves unrelated preferences untouched.
- Saves the five original raw values as a recovery copy before any write. Restore failures roll back; Undo survives reload and restores absent keys as well as saved values. Restore/Undo reload to refresh in-memory title/calculator state. One recovery copy is retained on this browser; exported files provide the portable backup.
- Files: js/08-items-tools-guides.js, preview-scoped CSS, index.html (hidden root and bumped CSS/JS cache versions); additive progress_backups coverage in tools/check_site.py. Formatted with pinned Prettier. Data and game calculations unchanged.
- Validation: real download/upload, review/cancel, exact restore and undo across reload, malformed/future/unknown inputs, absent sections, unrelated preferences and simulated mid-write rollback passed at 1400 and 390 px. `public_diff.py`: all 87 public views match HEAD; desktop/phone review screenshots inspected with no sideways overflow. `python3 tools/check_all.py`: ALL CHECKS PASSED, including the expanded backup tests and nine gear comparisons. No existing check weakened.
- Deployment verification fallback: the normal GitHub Actions run page is readable even while the API proxy is denied. Run 42947152789 matched full commit 92a4e438d30738e713f9ba70fa1331c93f9b0d44 and showed Success for checking and publishing (1m 40s). Use this fallback for the next commit; detailed logs may still require authenticated API access.

## 11 Nov 2026 — Shared account inputs for offline gear tools (Codex, handover #9)
- David chose option A: centralise his confirmed account inputs without adding website preset UI or changing its maximum-build defaults. Restore point: 65e0ae0.
- Added `GEAR_MODEL.account` (updated date and explicit awakening levels for all 20 heroes). The previous Python fallback treated every hero except Sion as A6; now Aria/Astria/Eileen/Lute/Othello/Tarte are correctly A3 and Alex A0. The twelve A6 heroes and Sion A3 retain their previous inputs.
- Signature ownership is derived from the existing `KARMA_DATA` flags; no duplicate signature list. Corrected the obsolete Charlotte-only profileRule provenance note to point at the measured A/B/C/D profiles.
- Added account-coverage/range validation and three extra browser/Python comparison cases (Othello A3, Aria A3, Alex A0); no existing check weakened. Documented the schema; check_shape --update printed exactly four intended additions, committed in tools/data_shape.json.
- Validation: data rules and schema passed. `python3 tools/check_all.py`: ALL CHECKS PASSED, including all nine Python/JS cases. No HTML, CSS, JS, ownership flags, game values or website defaults changed.

## 11 Nov 2026 — Close confirmed-complete notes and start approved handover work (Codex)
- Reconciled current references and the to-do page with existing evidence: all 20 base-stat measurements, all five Currency Dungeons, all ten owned signature cards, completed Test 09 and team verdicts, Orange +15 substats, measured rune tops, completed structural work and Theresia's mastery review. Kept historical measurements dated; Alex's awakening tests remain explicitly pending.
- Corrected non-rendered provenance strings in data.json (former gear estimates and the resolved crit-resistance question); no game number, ownership flag, schema or build changed. Fixed the after-awakening team table's extra separator and documented actual desktop/phone browser coverage.
- David selected task #9 option A (shared account data for tools, website maximum-build defaults unchanged) and task #7 option A (exact backup restore with review and recovery). Implement each separately; CSS-variable work remains after launch. Restore point before this work: da91cfa.
- Diagnosis: Git remote access works; api.github.com is denied by the environment proxy (HTTP CONNECT 403), before GitHub authentication. This blocks Actions/log verification, not local commits or Git pushes. Add api.github.com to the environment's allowed domains, then recheck existing authentication before requesting credentials.
- Validation: focused data comparison restricted changes to three non-rendered note strings, git diff --check passed; `python3 tools/check_all.py`: ALL CHECKS PASSED (browser and parity included). No check was changed or weakened.

## 11 Nov 2026 — Codex familiarisation review (no site changes)
- Scope: David asked for a review of the last week's repository changes, every Markdown file, the new golden rules and the eleven handover items, followed by advice on which work suits a cheaper model. No implementation of those items was requested.
- Fetched and fast-forwarded the existing main checkout to `da91cfa`; read all 18 Markdown files, the to-do page, the check-and-publish workflow, check scripts, data structure changes and relevant startup/gear code. `python3 tools/check_all.py` completed with `ALL CHECKS PASSED`, including the browser and both JS/Python comparisons. GitHub Actions API returned Forbidden, so remote deployment success was not independently verified.
- Current data checked directly: all 20 base-stat entries measured; 43/53 Karmas owned, 41/109 titles, 16/29 familiars, 15 Normal Dungeons and all 5 Currency Dungeons (0 undiscovered). Public and preview gear models are separate; parity verifies matching implementations, not all game assumptions.
- Handover assessment: cheaper-model candidates #1 (accessible menu names), #2 (phone dungeon layout), #3 (preview-only profile padding), #5 (root README), #6 (careful monthly changelog archive); #4 needs David's approval and suitable artwork, #10 waits for launch approval. Stronger implementation/review recommended for #7 (validated import/export with no accidental loss of visitor storage), #9 (account source/defaults and both gear implementations), and later #8 (CSS variables, after launch, in pixel-verified steps). #11 is a decision to preserve icons and raid glow, not an open task.
- Documentation discrepancies found, not silently corrected: DATA_REFERENCE still describes 11 measured base-stat heroes and 4 discovered Currency Dungeons; GAME_MATH still calls measured Orange DI/APU substats estimates; WORKING_WITH_DAVID and the to-do page still say Ryza/Roxy's signature art is missing. Current data and the newer changelog entries take precedence. Account defaults in team_gear.py also need separating from general visitor settings when #9 is scoped.
- Review recorded in CHATGPT.md, STATUS.md and DONE.md. No application code, JSON, artwork, checks or configuration changed; no commit or push as part of this familiarisation review. Next: David selects the implementation scope; preserve the public gate and run the required checks for that work.

## 11 Nov 2026 — Title, rune values, synthesis rule (Claude)
- Title **One Who Broke the Thunderbolt** obtained: 41 of 109. `TITLES.ownedCount` (was a stale 38) and `ownedCumulative` recalculated from the obtained titles' passives (not read by the page).
- Runes seen (David): Perfect Determination 105, 112; Vitality 900, 975; Focus 7.65%; Amplification 10.50%, 11.90% (the rest already recorded). Radiant Focus 6.50%, Vitality 1035, Amplification 7.35%. Refined Amplification 5.60%, 7%; Vitality 750. Every new Perfect value fits top × n/20 (GAME_MATH 2.2). Synthesis rule: 5 runes become 1 of the next grade at every step, Radiant to Perfect included.
- Checks: `python3 tools/check_all.py`: ALL CHECKS PASSED (data only, no page code changed).

## 11 Nov 2026 — Big upgrade, part 4: the gate's first run; Pages switched to GitHub Actions (Claude)
- **David switched the Pages source to "GitHub Actions"** (11 Nov, night). From now on only the workflow "Check and publish" publishes the site.
- **The first run (commit `93768d4`) failed and published nothing, as designed.** Cause: GitHub's runner uses a full Chrome, which asks for `/favicon.ico` by itself; the site has no favicon, so the console logged one 404 and the smoke test counted it. `tools/check_site.py` now ignores that single request (and prints the address with any console error). A real favicon is handover task 4 in SITE.md. All other checks passed on GitHub on the first run.
- **The second run (commit `6cc932b`) passed and published:** checks and publishing took 1 min 14 s in total, GitHub's old `pages build and deployment` no longer runs, and the live site serves the new files (`tools/check_all.py` and the to-do page open on the site address). The gate is working in both directions.

## 11 Nov 2026 — Big upgrade, part 3: checks before publishing, golden rules, clean-up (Claude)
- **New `.github/workflows/deploy.yml` ("Check and publish"):** on every push to `main` GitHub runs `tools/check_all.py` and publishes the site to GitHub Pages only if every check passes; a failed run publishes nothing (the live site stays on the last good commit). It publishes exactly the committed files (`git archive HEAD`), so notes, the to-do page, Test Kit and planner files stay online as David asked. Before: GitHub's Jekyll published every push unchecked. Needs the Pages source set to "GitHub Actions" (David). Publishing now takes about 3–5 minutes instead of about one.
- **Golden rules at the top of `AGENTS.md`** (David: the most important rules for every assistant): the ten rules on the checks, the publish gate, never weakening a check, the pixel check, data-structure changes, calculation changes, code format, new pages, backups and notes. The old "before committing" list now points to them. `CHATGPT.md`: a note for ChatGPT/Codex and the updated mandatory checks. `docs/library/SITE.md`: new section "Checks and publishing" (every script, what it proves, what to do when it fails) and "Handed over on 11 Nov" (11 open tasks for any assistant). `docs/DATA_REFERENCE.md`: the new tools and files, procedure 5 for new keys. `docs/README.md`, `STATUS.md`, `DONE.md`, `WORKING_WITH_DAVID.md` updated. `docs/LAUNCH_CHANGES.md`: all nine public "workbook" lines and the "Netlify" error message listed for launch.
- **Removed:** `assets/ui/preview.jpg` (an old preview sheet of the three dungeon frames; nothing loads or mentions it). In `tools/team_gear.py`, the first `value()` and `build()` definitions (dead code: the second definitions further down replaced them when the file ran); the parity check gives the same six builds before and after. Nothing else could go safely: the other files the page doesn't load are David's cited sources (`assets/dungeons/Drops*.webp` in `DUNGEONS.note`, `assets/runes/`) or the spare icons listed in DATA_REFERENCE.
- **Not done, by David's decision (11 Nov):** shrinking the icon files (shown at up to 42, 25 and 58 px from 256 and 240 px files; a version with no risk to quality would have saved only about 0.3 MB of the first visit) and portrait thumbnails; the raid glow stays.
- Checks: `check_all.py` all passed; `public_diff.py --preview` 194 views match.

## 11 Nov 2026 — Big upgrade, part 2: js/ and css/ reformatted, nothing else changed (Claude)
- **What changed:** the nine `js/*.js` files and `css/site.css` were run through Prettier 3.9.10 (`.prettierrc.json`: 120 columns, single quotes; `.prettierignore` limits it to `js/` and `css/`). Before: dense lines up to 5,034 characters (JS) and 8,642 (CSS), 1,597 + 662 lines. After: one statement or declaration per line, 6,182 + 6,914 lines; the longest CSS line is 211 characters. Long lines that remain in `js/` are template strings holding HTML, which a formatter must not re-flow. No code was rewritten by hand. `?v=20261111b` on every CSS and JS link.
- **Why:** a diff now shows the line that changed instead of a whole 5,000-character line, a single line can be reverted, and an assistant can read or edit one function without loading or re-typing a giant line (the main cause of accidental damage in the old layout).
- **Proof that only the layout changed:** (1) every JS file parses to the identical syntax tree before and after, apart from 15 object keys whose needless quotes were dropped (`{'Attack': 1}` → `{Attack: 1}`, same meaning); all 81 comments kept. (2) The browser reads the old and new CSS as the same 1,237 rules, in the same order. (3) `public_diff.py --preview`: all 194 views (public and preview, 1400 px and 390 px, every page, all 20 heroes × 3 tabs) match pixel for pixel. (4) `check_all.py` all passed, including JS-vs-Python parity.
- **Keeping it:** after editing a file in `js/` or `css/`, run `npx --yes prettier@3.9.10 --write js css`. `check_all.py` warns when a file is out of format (a warning, so a data fix is never blocked by spacing).
- **`tools/public_diff.py`:** a view that differs is now rendered a second time and reported only if it differs both times (on very tall pages the browser sometimes draws a dotted underline one pixel along; seen on 2 of 194 views, gone on the second look).
- **The checks were tested by breaking things on purpose:** a letter-spacing change in the CSS (pixel check: 14 of 42 views reported), a wrong portrait path in data.json (browser check: HTTP 404 reported on every page that shows it), ×1.01 in the crit formula of the JS gear model (parity: all six builds reported with both values). All restored.

## 11 Nov 2026 — Big upgrade, part 1: one command that checks everything (Claude)
David asked for the structural upgrades to be done now, with backups, and written down as rules for every assistant. Restore point for the whole upgrade: commit `1a15e2a` (the state before it; `git revert` the upgrade commits, or copy a file back with `git checkout 1a15e2a -- <file>`).
- **New `tools/check_all.py`: run it before every commit.** It runs, in order: `validate_data.py` (data rules), the new `check_shape.py` (data shape), `hero_stats.py` (stored builds still current), file rules (LF endings, data.json format, every script listed in index.html with `?v=`), `node --check`, the `?v=` cache numbers (a changed css/js file must get a new one), the new `check_site.py` (browser) and the code format (warning only). Exit 0 = all passed, 1 = failed, 2 = passed but the browser checks couldn't run.
- **New `tools/check_shape.py` + `tools/data_shape.json`:** the recorded shape of `data.json` and the six `assets/items/*.json` files (1,300 paths: which keys exist where, required or optional, and their types). Catches a misspelt key, a key at the wrong level, a missing field, text where a number belongs. After adding or changing a key on purpose: `python3 tools/check_shape.py --update` and read the differences it prints. Tested by breaking data.json four ways (typo `teir`, a list for a number, a missing `role`, `"9%"` for 9): all four reported with the exact place.
- **New `tools/check_site.py` (headless browser, about 1 minute):** opens every menu page on the public URL and on `?tiers=new` at 1400 px and 390 px plus all 20 hero profiles and their three tabs, and fails on any console error, script error or missing file; checks the preview gate (no preview page, `html.pv` or new tier list on the public URL); and checks the two JS ports against Python: `optBest` must reproduce every stored `HERO_BUILDS` piece, `gmBuild` must give the same mains, substats and damage value as `tools/team_gear.py` on six builds. The "keep the two identical" rule is now tested, not just written down.
- **New `tools/public_diff.py` (the pixel check as a tool):** renders every public page and hero profile from the last commit and from the working files and compares them pixel by pixel (`--preview` adds the preview, `--quick` uses 5 heroes; a ref such as `origin/main` compares against that). Prints the views that differ, how much and where, and keeps the before/after pictures. A colour step of 1–2 of 255 is ignored (the browser itself varies by 1 on a rounded corner between two renders of the same files).
- **`.gitattributes`:** every text file is LF on every machine (`* text=auto eol=lf`; images and fonts binary). 20 `.txt` source notes that were CRLF are now LF (content unchanged). `.gitignore`: `__pycache__/`, `node_modules/`.
- **Found by the new checks:** `hero_stats.py` reported three stale stored figures since the 10 Nov gear-table corrections: `HERO_BUILDS[Aria|Tarte|Othello].setChoice.vsBattleWill["The Infiltrator"]` 2.3 → 2.4, 3.7 → 3.8, 3.7 → 3.8. Refreshed with `hero_stats.py --write` (the documented step). No build piece changed; the page only reads `setChoice.set`, so nothing visible changed.
- Checks: `check_all.py` all passed; `public_diff.py --preview`: 194 views, no visible difference.

## 11 Nov 2026 — Strongest-skill damage in the Best Gear rows (Claude)
- Each set-pair row in the preview Best Gear box now starts with the hero's strongest skill (highest codex % at max skill level, whole skill with all hits added, `DAMAGE_CALC.skillAdjust` applied) and its damage with that build: no crit · every hit a crit, against the chosen enemy with every ticked status on it at once (David, 11 Nov: totals only, no single hits). Same formula as the Tools calculator, checked on Ryza and Sion within 0.05%. Frost stacks add no hit bonus (only Frozen does). Code: `gmSkill`, `gmSkillDmg` in `js/04-gear-builds.js`; `?v=20261111a`. Public pages pixel-identical; no console errors.

## 11 Nov 2026 — Damage formula checked on a geared hero (Claude)
- David's Ryza test (Lightning Javelin, Training Ogre, five status cases, panel screenshots): the hit formula matches all ten readings within 0.03% (a typo in one crit, 119,900, was corrected by David to 106,496; the formula gives 106,487). Recorded in GAME_MATH 3.1. Sion's Divine Smash (11 Nov): three hits of 2% + 60% + 40% of the codex %, every case predicted within 0.05%; added to `DAMAGE_CALC.skillAdjust` (Tools calculator: "All three hits" ×1.02, "Biggest hit" ×0.6). Next: the biggest-hit boxes in the Best Gear rows.

## 10 Nov 2026 — Karma art: 43 of 53 in colour (Claude)
- From David's nine Codex screenshots (one per archetype, uploaded to `assets/karma/`): each card found by matching the site picture against the screenshot, cut at the site size (392×467), the printed name painted out as before, saved as WebP. **20 cards now in colour:** Merciful Death Sentence, A Coincidental Yet Perfect Plan, Legends Left Behind by the Master, Merciless Kick, Stay Sharp. Always, The Wind Blows Again, The Noble Lady's Wild Hobby (Roxy), The Chosen One of the Crimson Flame, The Sun Blazes Again, Leg Scale of Blazing Flames (now 392×467 like the rest), The Spear That Fells the Sun, Eternal Blizzard, A Sparkling Tea Time, The Scar Lightning Left Behind (Ryza), Sacred Lightning Baptism, The Conviction Left in Darkness, Dominating Head, Destruction Is the Mother of Creation, The Way of the Wild, A Cut Above.
- `KARMA_DATA.owned`: 43 true (12 changed: the new colour cards that weren't marked yet, Ryza's and Roxy's signatures among them). Eight signatures were already marked owned but still had grey art; now they match. Still grey (10): A Sword Summoned for a Friend, Loyalty Amidst Lethargy, Between Chivalry and Bookmarks, The Wind That Protects the Kingdom, Explosion Is Art, A Helping Hand for Good Kids, Fate Spoke to the Boy, Wandering Blade, Noisy Duet, Wildflowers Bloom Through the Wind.
- The nine source PNGs deleted (David's rule for uploads). The pictures are shared files, so the public Karma page shows the colour art too (as with earlier batches; David asked for the replacement). Validator OK; Karma page loads with no missing files.

## 10 Nov 2026 — Best Gear as a ranked list; Back button in the preview (Claude)
- **Best Gear box** (David's request, inspired by a set-ranking layout he liked): the six best set pairs as rows, each with a % badge (best = 100%, the rest compared with it), both set icons, "(3-PC) + (2-PC)" names and small boxes for Crit Rate / Crit Damage, Defense Ignore, Attack Power Up and the rune mix. Click a row to open its pieces, rune line and totals (the best is open at first); set names link to the Gear page. With runes on, every listed pair gets its own best rune mix (21 mixes tried each) and the rows are ranked by that. Results are kept per hero and settings, so returning to a hero redraws at once.
- **Back and Forward buttons (preview only):** every page and hero profile tab now has its own address (`#gear`, `#karma`, `#hero/Ryza/build`); the browser's Back returns to the previous view and its scroll position; the addresses work as links. Code: `navInit`, `navRecord`, `navShow` in `js/09-startup.js`. The public page keeps its old behaviour.
- `?v=20261110e`. Checks: Back/Forward through Heroes → Ryza Build → Gear set → back (scroll restored) → Heroes → forward; deep link `#hero/Dana/build`; preview pages clicked through with no console errors; desktop and 390 px phone; public pages pixel-identical.

## 10 Nov 2026 — Preview "Best Gear" box on the hero Build tab (Claude)
- New in the preview only (`?tiers=new`): the hero Build tab's Best Gear Sets, Best Main Stats and Recommended Endgame Stats boxes give way to one **Best Gear** box that works out the build in the browser: the best 3-piece + 2-piece set pair, the main stat and five substats on each piece, the best Perfect rune mix, totals (Attack, Attack Power Up, Crit Rate, Crit Damage, Defense Ignore, AAP) and the next four set pairs in %. Controls: enemy (toughest boss, Defense 1825 / Training Ogre 1000), physical statuses up half or all the time, awakenings A0–A6, signature Karma on or off, Perfect runes best mix or none, and tick boxes for the statuses the team keeps on the target (the 13 main-team heroes start with their team's statuses, the rest with their own status). Set names link to the Gear page.
- Code: the model is a port of `tools/team_gear.py` in `js/04-gear-builds.js` (between `/*GM-START*/` and `/*GM-END*/`; keep the two identical), plus the box (`gmMount`, `gmDraw`, `gmRun`, `gmShow`). Stats are held in a typed array and only the changed damage factor is recomputed, with Python's arithmetic in the same order; 2-piece sets whose bonus needs an unticked status are skipped. One hero takes about 1–2 s, drawn in steps with a progress line.
- Data: new key `GEAR_MODEL` (settings and the main teams' statuses), declared in `js/01-core.js` and loaded in `js/09-startup.js`; documented in DATA_REFERENCE. Styles for the controls in the preview-only block of `css/site.css`. `?v=20261110d` on every CSS and JS link.
- Checks: JS against Python for the 13 main-team heroes at David's settings (Sion A3, others A6, signature traits only where owned, physical statuses half the time, Defense 1825): identical mains, substats and damage value (to the last digit) for all 110 set pairs of every hero. All 20 heroes' Build tabs open in the preview with no console errors (desktop and 390 px phone, no sideways scroll); the controls re-run; validator OK; public pages pixel-identical at 1400 and 390 px.
- Notes: GAME_MATH 4.3 (the page version and the rune mixes per hero), SITE (code map, open tasks), STATUS, DONE.
## 10 Nov 2026 — Perfect Attack rune 126 (Claude)
- `RUNES.seen` Perfect Determination 126 (18 × 7, fits the n/20 rule).
## 10 Nov 2026 — Perfect rune synthesis; two more values (Claude)
- `RUNES.rules`: 3 Perfect runes synthesise into 1 random Perfect rune of a random type (David's screenshots: 3 Vitality gave Vitality, 3 Determination gave Focus); ★5 runes can't be recovered. `RUNES.seen` Perfect: Crit Rate 8.08% (predicted by the n/20 rule: 19 × 0.425), Max HP 1125 (15 × 75). GAME_MATH updated.
## 10 Nov 2026 — More Perfect rune values (Claude)
- `RUNES.seen` Perfect: Attack 133, 140; Defense 80; Max HP 1200, 1275; Crit Rate 5.95%; Crit Damage 13.30%, 14%. Every Perfect value fits top × n/20 (GAME_MATH unknowns): tops Attack 140 and Crit Damage 14% seen; Defense 100, Max HP 1500, Crit Rate 8.5% predicted.
## 10 Nov 2026 — Every Orange +15 substat measured; Perfect runes; unused PNGs removed (Claude)
- David's 31 Orange +15 pieces (screenshots in `assets/sources/upcoming/`): every substat has one fixed value per slot; Helmet, Gloves and Boots share a table; all elemental AAP is equal and all physical AAP is equal on a piece. **Defense Ignore (1.94 / 2.77 / 2.50) and Attack Power Up (3.18 / 4.54 / 4.09) confirm the old estimates.** `GEAR_STATS` corrections: Crit Damage substat 2.50 (H/G/B), Chest Attack Power Up 4.54, Chest Status AAP Increase **5.55** (was 5.02), Chest All Status AAP 55, Legs Status AAP Increase 5.00; mains at +15 Crit Rate 11.66 / 16.66, Legs Crit Damage 24.10, and **Legs Attack Power Up measured 30.68** (was estimated 30.64; table rescaled). `valueSources` updated. Ryza's and Theresia's builds re-run: unchanged. Public hero Build tabs checked for all 20 heroes: unchanged.
- `RUNES.seen` Perfect: Defense 95, Crit Rate 5.10%, Crit Damage 11.20%. Rune advice re-run (GAME_MATH 4.3): best is mostly 3 Crit Rate + 2 Crit Damage, any mix with 2–4 Crit Rate within ~0.5%.
- **Unused PNGs removed (David's request):** every PNG the page doesn't load (182 files): the 31 gear screenshots, the 120 awakening screenshots (`assets/sources/awakenings/`, folder gone; the validator no longer checks them; `AWAKENINGS.note` and DATA_REFERENCE say they're in git history), 25 old UI icons in `assets/ui/` and 7 familiar ability images (the page uses the `.webp` copies). Only `assets/awakenings/Awakening_Icon.png` remains (used). `assets/` 41 MB.
- Checks: validator OK; both URLs clicked through with no missing files or console errors; public pages pixel-identical.
- **Correction on deploy speed:** the slow "deploy (dynamic)" step was *not* caused by the PNGs. Deploy times today: 48–58 s with the 90 MB of PNGs in the repo (f627686: 57 s), then 6 min 16 s right after removing them (d13593c). The time varies on GitHub's side; a slow run can be left to finish or ignored, and a later push redeploys anyway.
## 10 Nov 2026 — index.html split into css/ and js/ (structure step A, Claude)
- `index.html` (323 KB) is now the layout only (18 KB). Styles: `css/site.css` (asset `url()`s rewritten to `../assets/`). Script: nine files in `js/`, loaded in the old order and sharing one global scope: `01-core`, `02-teams-karma`, `03-profile`, `04-gear-builds`, `05-tierlist-heroes-patches`, `06-dungeons`, `07-tierlist-v2-cookbook`, `08-items-tools-guides`, `09-startup`. Each file starts with what it holds; `01-core` keeps the map of the whole script. Content of the code unchanged apart from the next point.
- New helper `absUrl()` in `01-core`: the six places that write image paths into CSS variables (`--bg`, `--dng-art`, `--currency-banner`) now pass absolute URLs, because a `url()` inside a variable resolves against `css/` once the CSS lives there (the first try gave three 404s on the tier-list mode banners, caught by the click-through).
- Every CSS and JS link carries `?v=20261110c`; bump it when a file changes (GitHub Pages lets browsers keep copies for ~10 min).
- Checks: each JS file passes `node --check`; both URLs clicked through every page (tier modes, boss tabs, a hero profile and its tabs, the three Dungeons pages) with no missing files and no console errors; public and preview pixel-identical to the pre-split page at 1400 px and 390 px, Dungeons pages included; first view after ~0.62 s (public) and ~0.69 s (preview) on a 20 Mbit/s line.
- Notes updated for everyone: AGENTS.md (line endings, where the code lives, the `?v=` rule, the optimiser port is in `js/04-gear-builds.js`), SITE, DATA_REFERENCE, GAME_MATH, LAUNCH_CHANGES, README, and a note for ChatGPT in CHATGPT.md with the three rules (bump `?v=`, load order, `absUrl()`).
## 10 Nov 2026 — Source screenshots gathered in assets/sources/ (structure step D, Claude)
- Moved with `git mv` (history kept) into `assets/sources/`: `help`, `merc-crew`, `exchange`, `raid`, `tower`, `rift`, `upcoming`, `titles`, and the 20 hero folders of awakening screenshots (`assets/sources/awakenings/<Hero>/A1–A6.png`). 39 MB of material the page never loads; `assets/awakenings/Awakening_Icon.png` stays (the page uses it).
- Updated: the validator's awakening-screenshot check, `AWAKENINGS.note` and `TOWER_TRIALS.note` in data.json, DATA_REFERENCE, SITE, and two source notes that pointed at their own folder.
- Checks: validator OK; every tab of both URLs clicked through (tier modes, boss tabs, a hero profile and its tabs) with no missing files and no console errors; public pages pixel-identical.
## 10 Nov 2026 — Research data moved out of data.json (structure step B, Claude)
- `DAMAGE_TESTS` (training-dummy research the page never reads) moved unchanged to the new `data/research.json`; `data.json` 712 → 629 KB for every visitor. `KARMA_LEVELLING` and `SKILL_BUFF_LEVELS` stay (4 KB; the Karma slider and builds will use them).
- `tools/validate_data.py` checks `data/research.json` parses, holds `DAMAGE_TESTS`, and that the key doesn't drift back into data.json. AGENTS.md key index, SITE, GAME_MATH, DATA_REFERENCE and the `hero_stats.py` docstring point to the new file.
- Checks: validator OK; public pages pixel-identical; preview identical apart from the Familiars Insect step 4 (the owned-count fix earlier today); no console errors.
## 10 Nov 2026 — Artifact backups as a routine (structure step E, Claude)
- Full exports: `docs/testkit/testkit-results-2026-11-10.json` (all 830 Test Kit entries: 402 Test 01, 149 enemy Defense, 115 gear, 95 level costs, 22 signature, 20 Lv.70 stats, 12 buffs and the rest) and `docs/testkit/planner-backup-2026-11-10.json` (16 teams, 20 signatures). They replace `test01-apply-2026-11-09.json` and `planner-backup-2026-11-09.json` (checked: every old entry is in the new files, unchanged). `test01-apply-backup-2026-11-08.json` stays (pre-redo entries no longer in the artifact).
- Routine written into `docs/README.md`: export both artifacts at the end of every session that wrote to them.
- **Correction:** the notes check (part 2) added a "team 9, Nightmare support (Idea)" section; that came from an old export in Claude's scratch folder. The planner has no t09 (it was deleted before the 10 Nov runs); TEAM_TESTS, STATUS and DONE fixed.
## 10 Nov 2026 — data.json cached safely (structure step C, Claude)
- David approved all five structure steps (SITE.md). Step C: `index.html` loads `data.json` with `cache:'no-cache'` instead of `?v=`timestamp + `no-store`. Every visit still asks the server for the newest file, but an unchanged file comes back as "not modified" (measured: 105 bytes instead of 712 KB on a reload). Public page pixel-identical; no console errors.
## 10 Nov 2026 — Notes check, part 2: every library file (Claude)
- Read every note file and fixed what was out of date or wrong:
  - **GAME_MATH:** "Crit above 100% unknown" contradicted DONE (answered: it does nothing); new 3.6 with today's buffs, debuffs and rules (Castella −20% Defense, Lute +20% Attack Power, Kalsion and Theresia Attack Power, Roxy Crit Damage stacks, Othello's Frost refill, Tarte's 40 bubbles, break times by stage); the new title's Attack Power Up and what it means for future panel readings (marked as Claude's reading); rune values and the estimated substats in the unknowns.
  - **DECISIONS:** the open questions about the awakening view were answered on 10 Nov (all awakenings at A6, signature where needed, Late bloomer dropped); today's re-rating moved out of the 29 Oct history into "Current ratings"; Super Armor tag re-based on the mastery times; purple-card holders listed.
  - **SITE:** start-up (banner preload, 85 ms drawing), `html.pv`, the pixel-check method, the code map; removed "9 estimated heroes" and "Karma slider waits on Lv.40–70".
  - **TESTING:** tests 02, 08 and 09 are done; Test 01 holds the mastery and awakening entries; signatures' levels.
  - **TEAM_TESTS:** after-awakening numbers on each main team; team 9 (Nightmare support, an Idea with Alex) was missing; doc ids go to t17.
  - **TEST01_RESULTS:** 7 "Mastery not unlocked: retest" notes now point to the retests; Theresia's note no longer suggests her mastery breaks faster.
  - **WORKING_WITH_DAVID:** the before-numbers routine for skill changes, "just ask for finer data", and three mistakes from today (unchecked "all familiars owned", an old note quoted as David's view, removing code without running the page).
  - **DONE:** test 09, today's site work and answered questions added. **LAUNCH_CHANGES:** old "New rating" lines point to `TIER_LIST_V2`; the preview CSS step and the Gear footnote added. **CHATGPT.md:** a 10 Nov note (preview CSS home, code map, validator checks). **DATA_REFERENCE:** Karma levels, the familiar check, the gear tools, preview CSS. **README:** awakening file and data copies.
- **Dates:** every section heading in the library files now ends with when it was measured or last changed (from CHANGELOG; git history only starts on 9 Nov).
- **CHANGELOG:** headings now share one style ("31 Oct 2026 — title (author)"); two 2 Nov entries that sat below 28 Oct moved into place. Entry text unchanged.
## 10 Nov 2026 — Notes check, part 1: STATUS, to-do page, a familiar count (Claude)
- **Bug:** `FAMILIARS.owned` (per-group counts the Familiars page uses for the passive steps) still said 3 Insects; Red Ladybug made it 4, so the 4th Insect passive showed as locked. Fixed, and `tools/validate_data.py` now checks these counts against the owned flags (and that every new-tier-list hero and tag exists).
- `docs/library/STATUS.md` rewritten to the current state (account, what David is asked, next for Claude, open items); stale lines removed (no masteries/awakenings yet, planner verdicts still Idea, the Kalien/Castella re-debate, the pre-mastery plans).
- `docs/dragonsword_david_todo_by_priority.html` updated (it dated from 9 Nov 04:30): finished items removed (Lv.70, signature tests, mastery retests, Test 02, which the data shows complete since 9 Nov), new asks added (Orange Defense Ignore substat, Perfect runes, awakening view, Alex, team round with gear, Karma in-between levels).
## 10 Nov 2026 — Code tidy and data check (Claude)
- `index.html`: removed 4 functions and 24 CSS rules nothing used (showTip, showHeroTip, positionTip, titleBonusTotals; old page-placeholder, karma-awakening, profile-intro/back, simple-card/grid, trait-row, arch-chip styles). Added a map of the script and of the styles at their tops and "// ====" section headers. Public and preview pixel-identical before and after; start-up script work measured at ~85 ms, so no lazy rendering needed.
- Preview tier list: the Tags legend only lists tags some hero carries (Needs A and Late bloomer hidden until the awakening view); `TIER_LIST_V2.tags.sa` now says the 25 s rule uses the Lv.70 tests with Masteries (10 Nov).
- data.json review: `DAMAGE_TESTS` (69 KB, 10% of the file) is only read by the offline tools, yet every visitor downloads it; moving it is in the structure proposal. Orange Defense Ignore and Attack Power Up substats are still estimates; asked in STATUS.
## 10 Nov 2026 — Site check: preview fixes and a faster preview start (Claude)
- **Restore point:** commit `60ad0b3` is the last state before this clean-up (main can't be rewritten, so `git revert` back to it is always possible). Tags can't be pushed through the session proxy.
- Method: every tab of the public URL and the preview screenshotted at 1400 px and 390 px before and after; the public page is pixel-identical on all tabs (desktop and phone), no console errors on either URL.
- `index.html`, preview only (`html.pv` class set when `IS_PREVIEW`; CSS block "Preview-only fixes" at the end of `<style>`):
  - **Start-up speed:** the preview no longer waits for all 45 dungeon banners (~9 MB) before drawing; they preload when a Dungeons page is first opened, and Normal Dungeons draws on first open. Preview visible after 0.64 s instead of 3.1 s on a 20 Mbit/s line.
  - `#dungeons?set=…` links now open the Dungeons page (they never did on load).
  - Browser tab title said "undefined" on Cookbook, Item Database, Achievements, Guides, Tools; fixed. The header line names the open page instead of "Visual tier list … hover a hero" on other pages.
  - Trait Dungeons rating chips used the old tier list; they now show the new single-target rating.
  - Gear: stray gap before full stops in set effects; Upgrade calculator and Runes boxes overflowed phones sideways; rune type cards now line up.
  - Phones: tier list hides empty role rows and shortens the mode banners; Tools status table and Titles table re-flow instead of being cut off.
  - Sidebar scrolls when the Dungeons group is open on short screens; Achievements in two columns on desktop.
## 10 Nov 2026 — Rune slot rules; builds with Perfect Crit Rate runes (Claude)
- `RUNES.rules` (David): one slot per gear piece (5 per hero), unlocked per piece for 1 Anonymous Artisan's Crafting Tool (the old "5" was wrong); any type or grade in any slot, duplicates allowed; removal returns the rune for 10,000 Gold.
- GAME_MATH 4.3: the main-team builds re-run with 5 Perfect Crit Rate runes: Crit Rate runes win; Crit Rate substats become Crit Damage; a few mains switch to Crit Damage.
## 10 Nov 2026 — Title One Who Broke the Dragon Horn; new rune values (Claude)
- `TITLES`: One Who Broke the Dragon Horn obtained (Attack Power Up +2.3%, Crit Rate +2%); 40 of 109.
- `RUNES.seen` (David's file): Refined Attack 56, Max HP 600; Radiant Defense 67 (first Radiant value); Perfect Attack 119, Max HP 1050, Crit Rate 6.80% (first Perfect values). Removal costs 10,000 Gold for every grade. Rune slot cost: David saw 1 Anonymous Artisan's Crafting Tool where the data says 5 (asked). Rune box and Titles are preview-only; public page checked unchanged.
## 10 Nov 2026 — Karma levels Lv.1–70 measured; levelling rule (Claude)
- `KARMA_LEVELLING.measured`: David's Lv.20–70 values (before and after each breakthrough) for The Scar Lightning Left Behind (Balanced) and Sacred Lightning Baptism (Attack); `note` rewritten with the rule (shared level curve, breakthrough shares 6/12–10/12 of Lv.1, type factors). GAME_MATH 2.3, STATUS, DONE updated. Not used by the page yet. Validator OK.
## 10 Nov 2026 — Main-team gear builds (Claude)
- New `tools/team_gear.py` (team-aware version of `endgame_gear.py`: all team statuses on the target, real awakening levels, owned signatures only, physical statuses at full or half uptime). Builds for the 13 heroes of the six main teams in GAME_MATH 4.3. Offline tool only; no site change.
## 10 Nov 2026 — Team round after awakenings saved (Claude)
- David's runs on the six main teams (masteries and awakenings, no gear): Airborne burst 820k→900k, Shadow Poison 950k→1.1M, Holy Bleed 630k→800k, Thunder pair 900k→1.1M, Fox and wind 800k→1M, Frost tornado 800k→1M (signature run now Dana's and Cerese's). Planner cards updated (badge shows the new numbers; old ones kept in the note); TEAM_TESTS, backup and STATUS updated.
## 10 Nov 2026 — Team round prepared (Claude)
- TEAM_TESTS: new section with the six main teams, their awakening levels and the 9–10 Nov numbers to compare against.
## 10 Nov 2026 — A6 results saved (Claude)
- David's A6 tests: 24 Test Kit entries (`apply`) and the JSON copy; results and every hero's awakening level in AWAKENING_TESTS. Castella's Whirlwind corrected to 17.5% before A6 (note on the Test 01 row). STATUS and DONE updated.
## 10 Nov 2026 — A3 results saved; batch 3 prepared (Claude)
- David's A3 tests: 20 Test Kit entries (`apply`) and the JSON copy; results in AWAKENING_TESTS (Castella's Howling read as Defense −20%; Kalsion's Royal Flame +10% → +20% Attack Power; Theresia's A3 +10% Attack Power; Othello's Frozen Burst +50% damage; Roxy +10% Crit Damage per stack, 5 max). Batch 3 list (A4–A6 for the 12 heroes in the main planner teams). STATUS and DONE updated.
## 10 Nov 2026 — Awakening batch 2 (A2, A3) prepared (Claude)
- AWAKENING_TESTS: batch 2 list with before numbers. David has 77 levels: everyone to A3 costs 41, leaving 36 for batch 3 (12 heroes A3 → A6).
## 10 Nov 2026 — A1 results saved (Claude)
- David's A1 tests: 14 Test Kit entries (`apply`) and the JSON copy; results table in AWAKENING_TESTS. Lute's A1 buff read as +20% Attack Power. Charlotte had A1 all along (noted in TEST01_RESULTS and DECISIONS). STATUS and DONE updated.
## 10 Nov 2026 — Awakening test batch 1 (A1) prepared (Claude)
- New `docs/library/AWAKENING_TESTS.md`: every hero's A1, the skill it changes with the Test 01 numbers (with masteries), and what to note. Listed in the README index; STATUS updated.
## 10 Nov 2026 — Patch line in the preview tier tooltip; Ornette applies Shock and Knockdown (Claude)
- `index.html` `v2TipHtml` (preview tier list only): hovering a hero shows the latest balance patch, its direction and the skill damage %, the same line as the other hero hover cards. The preview tooltip never had it.
- `TIER_LIST_V2.heroes.Ornette`: Enabler tag and Applies Shock, Knockdown (David, 10 Nov: her mastery adds both). Kalien and Astria keep their purple signature cards.
- Validator OK; checked locally: Ornette's tooltip shows the patch line, no console errors, public page unchanged.
## 10 Nov 2026 — Tier list v2 re-rated with Masteries (Claude)
- `TIER_LIST_V2.heroes` (preview only): 16 heroes changed after debate with David (list in DECISIONS). `signatureKarma` added for Theresia and Ryza; `awk` removed from Kalien, Sion, Astria and `late` from Cerese (tag definitions kept). `about` text: ratings now include Masteries.
- Validator OK; preview tier list checked locally.
## 10 Nov 2026 — Ratings count the mastery (Claude)
- David's decision: tier ratings are on base kits with mastery; a separate awakening view comes later and the Needs A tag leaves the tier list. DECISIONS and STATUS updated. No ratings changed yet.
## 10 Nov 2026 — Mastery retests saved (Claude)
- David's retests with all 16 masteries (no gear, no Karma, Training Ogre): 27 new Test Kit entries (`apply`), also in `docs/testkit/test01-apply-2026-11-09.json`; new Mastery retests section in TEST01_RESULTS (before → after, break times, David's notes). Biggest change: Lute 75 → 41 s.
- Castella's and Theresia's mastery buffs protect their own Super Armor, not the enemy's break (David). STATUS and DONE updated.
## 10 Nov 2026 — Chest Addict, Red Ladybug (Claude)
- `TITLES`: Chest Addict obtained (Defense +15; owned titles now Defense +45 flat, GAME_MATH 2.2). `FAMILIARS`: Red Ladybug owned; `assets/familiars/red-ladybug.webp` replaced with the colour card cut from David's `insect.png` by `tools/image/codex_recolor.py` (same 392×467 size and style, checked by eye next to the other beetles), then the PNG was deleted.
- STATUS: David has materials for all 16 masteries; solo retests with no gear and no Karma.
- Validator OK. Titles and Familiars are preview-only pages.
## 10 Nov 2026 — Kalsion split into two groups; equal card widths (Claude)
- David's answers: Kalsion only bursts and swaps in Airborne burst, Burn chain and Fire and venom (new group `kalsion-burst`, main Airborne burst); he gets field time in Fox and wind (main), Break and burn and Fox and crossbow.
- Thunder pair note (David): Ornette beats Tarte because Knockdown matters more than extra Shock.
- Planner page: teams without alternatives keep the same width as grouped ones. Published to the same link; repo source, backup and TEAM_TESTS refreshed.
## 10 Nov 2026 — Team Planner grouped by damage dealer (Claude)
- At David's request: teams that share a damage dealer are one box with the main version first and alternatives as buttons on the right; an alternative opens over the main version, stays fully editable, and × Back returns. New team fields `group` and `main` (set for the Kalsion, Ryza, Dana and Theresia groups). Tested headless with the real team data (switching, editing an alternative saves to its own team, back). Published to the same link; repo source, backup and TEAM_TESTS updated.
- David's verdicts (10 Nov): all teams Works except Ice Prison (Doesn't work).
## 10 Nov 2026 — Last team tests saved; Alex teams dropped (Claude)
- Saved on the planner cards: Burn chain 490k→520k, Break and burn 430k→460k, Fire and venom 420k→450k, Double blessing 370k→410k, Ice Prison 300k→340k (David: feels terrible, Sion can't keep Shock up), Fox and crossbow 380k→400k, Frost tornado 490k→530k.
- Nightmare support (Ryza, Eileen, Alex) deleted at David's request: Alex can't be tested fairly over 60 s (parry every time while dodging the aggroed Ogre). DECISIONS records this and the Astria finding (Ultimate refills from 3 Precision Shot basic attacks).
- Every planner team is now tested at Lv.70. TEAM_TESTS and the planner backup refreshed.
## 10 Nov 2026 — Team tests at Lv.70: normal vs signature on every card (Claude)
- David's Lv.70 runs (normal Lv.1 Karma vs signature, 9–10 Nov) saved on the planner teams: Airborne burst 600k→630k, Shadow Poison 680k→700k, Holy Bleed 330k→420k, Deep Frost 300k→480k, Storm 380k→430k, Thunder pair 500k→580k, Fox and wind 650k→700k (Kalsion's signature on in both), Holy Bleed with Kalien 320k→450k. New team 17 Lightning break (Ryza, Castella, Sion) 360k→410k, tested but not in the planner before.
- Removed the 8 Nov Lv.1 and mixed-level runs from the notes (Burn chain's note is now empty).
- Team Planner page: coloured damage badge beside each team name (normal vs signature; the better in green, the worse in red, with an arrow and %); intro updated. Published to the same link; repo source `docs/testkit/dragonsword-planner.html`, backup and TEAM_TESTS refreshed.
## 10 Nov 2026 — Status AAP follows the team's shared status (Claude)
- David's point from the Ursula run: the whole team uses Stun AAP, the status all three apply, not their own elements. Physical AAP substats are twice elemental ones, so the build rule changes: status AAP goes to the team's most-kept status (GAME_MATH 4.2, STATUS). The green panel buffs are most likely food (Tomato Stew gives Defense Ignore).
## 10 Nov 2026 — Ursula speed-run builds compared with the model (Claude)
- David's screenshots: Roxy and Theresia match the model's on-field build; Castella matches the always-broken build. Her Crit mains are explained by flat AAP being larger than her Attack. Runes (one per piece, always Crit) added to the analysis; they push builds towards 80/150. GAME_MATH 4.2.
## 10 Nov 2026 — Broken vs unbroken boss builds compared (Claude)
- A build made for an always-broken boss loses 7.5–10% on an unbroken one, and vice versa (Johnny, Ryza, Reina, Kalsion, Defense 1825). Defense Ignore and own-status AAP are on every piece in both. Agreed in principle: must-have substats first, then a labelled team-dependent slot (STATUS).
## 10 Nov 2026 — Signature Karma test 09 results saved (Claude)
- David's runs (9 Nov evening, Test Kit): Ryza +10–14% in three teams; Theresia +21%; Ornette +8% and Roxy +6% (both within chance); the Kalien team +41% with all three signatures. Table in TEAM_TESTS; Ryza's and Roxy's signatures are now marked Owned.
- STATUS: test 09 remaining runs; build status rule agreed (own status + the physical the hero needs).
## 9 Nov 2026 (late) — Skill buffs complete; build-model defaults agreed (Claude)
- `SKILL_BUFF_LEVELS`: added Tarte's Cure, Alex's Guard Counter, Astria's Reload and Siege Assault (20% → 40% Attack Power). Every scaling buff on a levellable skill is now recorded.
- Defaults David set for the preview builds: toughest boss with a Training Ogre switch; only statuses the hero applies; set effects always on, or always on and half of a 60 s fight side by side (STATUS).
## 9 Nov 2026 (late) — All 20 Lv.70 base stats in data.json (Claude)
- With David's OK: `HERO_BASE_STATS` for Eileen, Lute, Othello (B), Aria, Cerese, Astria, Dana (C), Ornette (A) and Alex (new profile D) are now measured (`estimated: false`). All C heroes are stored with Defense 320 (the panel gives 319.5). `HERO_STAT_MODEL` gets profile D, profile labels (melee, ranged, halfway, Defender) and an updated note.
- `tools/hero_stats.py`: no build changes. Validator OK. Local check: plain and `?tiers=new` load with no console errors.
- David's answers recorded: full-model builds go into the preview now and public at launch (SITE, LAUNCH_CHANGES); Signal uptime (GAME_MATH 4.1).
## 9 Nov 2026 (evening) — Lv.70 profiles explained, gear rows checked, endgame gear analysis (Claude)
- **Test 08, all 20 heroes at Lv.70** (Test Kit, David): the 11 already measured match their records (Sion's entry reads 1142 Attack, 1 below his stored 1143; rounding). The 9 new heroes: B Eileen, Lute, Othello; C Aria, Cerese, Astria, Dana; A Ornette; **new profile D: Alex 1014 / 379 / 7850**. Not in `data.json` yet (asked David first, because hero pages show base stats).
- **Profiles explained** (GAME_MATH 2.1): one defence-to-offence axis; B = all melee basic attacks, C = all ranged, A = exactly halfway, D = one step below B. Monster material, second material, archetype, faction, role and source ruled out.
- **Skill buffs** (Test 02): every scaling buff on a levellable skill is recorded except Astria's Siege Assault (+40% Attack Power at Lv.10) and two hostility values on Alex (no damage effect). Mastery passives don't level.
- **Gear rows** (Test 03): 19 new rows (Blue, Purple, Orange) all match the tables within rounding. Values confirmed by the new rows: Legs Attack Power Up (was an estimate), Legs Max HP Up, Helmet and Boots Defense Up, Boots Crit Rate and Crit Damage.
- **Endgame analysis** (GAME_MATH 4.1, new `tools/endgame_gear.py`): against Defense 1825, Attack Power Up mains are still best; the optimum is about 52–74% Crit Rate and 82–120% Crit Damage; forcing 80/150 costs 3.6–8.3%. Defense Ignore is the top substat, and status AAP substats beat Attack Power Up substats when the statuses are up. Earthshatterer is the best 3-piece for all five heroes tested (next best 6–9% behind) if its 10 s window is up more than about 52–57% of the time.
- No change to `data.json`, `index.html` or the site.
## 9 Nov 2026 — David's answers recorded (Claude)
- Hero level doesn't change Super Armor gauge damage (Castella Lv.20 vs Lv.70), so all Test 01 break times stand (TESTING, GAME_MATH).
- All team tests wait until every hero is Lv.70 (STATUS).
- Test 09: the signatures are Lv.1, so compare with any Lv.1 normal Karma of the same archetype (TESTING, STATUS).
- Launch checklist: rebuild the public Teams page (`TEAM_DATA`) from the tested and rated planner teams (LAUNCH_CHANGES).
## 9 Nov 2026 — Team Planner: in-game facts restored (Claude)
- David confirmed in game what Claude's check had wrongly removed: Tarte's Bolt Bubble keeps casting after she swaps out (the next hero's Shock detonates the orbs), and Chako keeps fighting while Dana is swapped out. He also confirmed that Cerese shatters Othello's Ice Prison. Restored in planner teams t04 and t05. t03 now states David's rule: a hero who applies their own needed status slowly still needs an enabler (Theresia).
- Recorded in GAME_MATH (3.3), DECISIONS (roles), WORKING_WITH_DAVID (mistake: don't delete in-game facts the codex doesn't state; ask). TEAM_TESTS and the planner backup refreshed.
## 9 Nov 2026 — Team Planner checked: teams rebuilt independently, false claims fixed, 5 new teams (Claude)
- At David's request, Claude built teams from the hero data alone (skills, statuses needed and applied, Test 01 rates, roles) before reading the planner, then compared. Matches: Airborne burst (t01), Shadow Poison (t02), Thunder pair (t06), Holy Bleed with Kalien (t11); each got a second, dated Claude note with what's new (Airborne per rotation, hit bonus totals, Charlotte's own Poison making Johnny's mostly redundant).
- Fixed (Why or note):
  - t03 said Theresia needs Stun or Bleed "from someone else"; she applies both, slowly.
  - t04 claimed Chako keeps fighting while Dana is swapped out (not in the codex), and listed Cerese's shattering as a plus (David found it works against Othello).
  - t05's "17–18 s" came from a superseded Lv.1 estimate; "orbs keep coming after you swap out" isn't in the codex (asked David).
  - t10's note compared runs at different levels and gear; replaced.
- New ideas, status Idea: t12 Fire and venom (Kalsion, Johnny, Aria), t13 Double blessing (Ryza, Sion, Eileen), t14 Ice Prison (Dana, Othello, Sion), t15 Fox and crossbow (Kalsion, Kalien, Astria), t16 Frost tornado (Dana, Cerese, Reina).
- Repo: `docs/library/TEAM_TESTS.md` teams section regenerated from the planner; `docs/testkit/planner-backup-2026-11-09.json` teams refreshed; STATUS updated.
## 9 Nov 2026 — Notes cleaned up: one source of truth, finished work separated (Claude)
- David asked for every note to hold only current information, finished work moved to its own file, and `CHANGELOG.md` as the only log.
- **Correction:** only 11 heroes are Lv.70 (the 11 measured in `HERO_BASE_STATS`). Aria, Ornette, Lute, Eileen, Cerese, Othello, Dana, Alex and Astria are being levelled now. An earlier chat had written "all 20 heroes are Lv.70". Fixed in STATUS, TESTING, TEST01_RESULTS and the to-do page (item 1 is now "level the last 9 to 70, then measure"). Test 01 numbers stand, because application doesn't depend on hero level.
- New `docs/library/DONE.md`: finished tasks and answered questions. The to-do page's Done block and the completed parts of the old notes moved there.
- Retired, with their content moved: `docs/PROJECT_HANDOFF.txt` (the log now lives only in CHANGELOG), `docs/NEW_CHAT_BRIEFING.md`, `docs/TASK_dungeons_page.md`, `TODO_David_2026-10-29.txt`. The old to-do file's rating reasoning went to DECISIONS. Its launch checklist and three agreed-but-unapplied hero fixes went to LAUNCH_CHANGES: Charlotte's wrong "only 2 skills apply Poison" con, hidden statuses for Charlotte and Johnny, and Castella's review points. Its parked site ideas went to SITE.
- `DATA_REFERENCE.md`: the two dungeon sections are merged into one, and outdated lines are fixed:
  - `HERO_BASE_STATS` is no longer described as all estimates.
  - `TIER_LIST_V2` lists all 20 heroes as rated.
  - `DEFENSE_MODEL` and `LEVEL_COSTS` are shown as used by the calculators.
  - The title note is updated.
  - The old base-stat estimates and "open tasks" sections are replaced by a pointer to GAME_MATH and a short Procedures list.
- STATUS has a current-task line, the still-estimated gear values and the Crit Rate awakening re-check (both from the old to-do file). WORKING_WITH_DAVID has David's 9 Nov rules: the repo is the only source of truth; ask before touching folders or his PC; uploaded PNGs may be deleted after processing; say when the chat is compacted. TEAM_TESTS explains the planner statuses (Idea, To test, Works, Doesn't work). GAME_MATH records the mastery material cost. DUNGEON_ARTWORK_WORKFLOW keeps only the rules and the two open banners.
- `CHATGPT.md` was shortened: the architecture summary that duplicated AGENTS, SITE and DATA_REFERENCE is replaced by pointers, and a note from Claude explains the changes. `AGENTS.md` and `docs/README.md` were updated to match.
- Validation: `tools/validate_data.py` OK; no change to `data.json`, `index.html` or assets.
## 9 Nov 2026 — Game math and site notes; Test Kit v33; planner and to-do refreshed (Claude)
- New `docs/library/GAME_MATH.md` (every measured formula: levelling, EXP items, breakthroughs, skill levels, gear upgrades, stats, titles, Karma, the hit formula with definitions, DoT, status build-up, places and game modes, towers, Hunt bosses, Super Armor, the optimiser, known unknowns) and `docs/library/SITE.md` (how the page works, code map, data structure, GitHub and publishing, open site tasks). Both listed in `docs/README.md`.
- Test Kit v33 (artifact and `docs/testkit/dragonsword-test-kit.html`): new Before awakenings section with test 08 (Lv.70 stats: takes titles off and names the profile) and test 09 (signature vs a normal Karma, average gain); Test 01 text says the Lv.70 redo is done and explains gauge and break-time entries; the goblin-dummy coverage tag is off; tests 01–03 have fixed numbers.
- Team Planner: intro states the 9 Nov test conditions and the run-to-run spread (artifact v2 and source).
- To-do page: before-awakening items first (stats, signature tests, with their Test Kit numbers), done items moved to the bottom, renumbered 1–11.
- `DEFENSE_MODEL.levelCurve.note`: no longer says the calculator lacks a Currency Dungeon option (it has one).
## 9 Nov 2026 — Notes library (Claude)
- New `docs/README.md` (index of every note file) and `docs/library/`: `STATUS.md` (where things stand, the before-awakening checklist, mastery retests, open items), `WORKING_WITH_DAVID.md` (preferences and past mistakes), `TESTING.md` (Test Kit tests and conventions), `TEST01_RESULTS.md` (all 20 heroes' Lv.70 application, gauge and break times, generated from the Test Kit), `TEAM_TESTS.md` (team and signature runs, signature list), `DECISIONS.md` (roles, tags, rating rules and debates). Data copies: `docs/testkit/test01-apply-2026-11-09.json`, `docs/testkit/planner-backup-2026-11-09.json`. Every older doc and `AGENTS.md` now points to the index. To-do items 1 and 2 marked done.
## 8 Nov 2026 — Super Armor break tag for Castella, Astria, Dana and Kalien (Claude)
- `TIER_LIST_V2.heroes`: `sa` tag added to Castella, Astria, Dana and Kalien (break the gauge alone in 25 s or less). Othello and Ryza also qualify but already have three tags, so they go without; Theresia (27 s) waits for her mastery retest. The tag's description now states the rule. Preview only.
## 8 Nov 2026 — Alex's status application and Super Armor gauge; Test 01 redo complete (Claude)
- Test 01: 13 Alex entries at Lv.70 (David). Knockdown Smash 0.20 Knockdown; Guard Counter 0.33 Knockdown and 8% on a parry, 4% when it fails; about 1% per hit blocked in Guard Stance. Whole gauge in about 45 s. All 20 heroes now redone at Lv.70; the to-do page keeps the mastery retests.
## 8 Nov 2026 — Ornette's status application and Super Armor gauge (Claude)
- Test 01: 17 Ornette entries at Lv.70 (David). Holy Cross 0.24 Shock and 5% from the swing, 0.10 and 7.5% from the moving cross; Holy Circle 0.22 Shock; Judgment 0.25 Knockdown at 1 Shock stack, 0.40 at 2, 10% gauge; Holy Grab 0.28 Shock and 12.5%, no Airborne on the boss. Whole gauge in about 30 s.
## 8 Nov 2026 — Cerese's status application and Super Armor gauge (Claude)
- Test 01: 16 Cerese entries at Lv.70 (David). Ice Storm (full 5 s tornado) 0.25 Frost, 0.20 Airborne, 15% gauge; Frozen Needles 0.25 Frost; the rest under 5%. Whole gauge in about 40 s. Othello's 20 s break explained (short cooldowns, quick dash attack, Ice Grab mount in about 10 s).
## 8 Nov 2026 — Othello's status application and Super Armor gauge (Claude)
- Test 01: 20 Othello entries at Lv.70 (David). Frozen Stinger 0.20 Frost; Ice Crown 0.15 Knockdown and Frost rising from 0.05 to 0.20 over the Ice Prison (about 20 s); Ice Grab 0.20 Frost at 1 stack, 0.25 Knockdown at 2; Frozen Burst per source. Gauge 1–10% per skill, yet the whole gauge goes in about 20 s. With his Ice Prison, Dana fits at most 4 Ice Block Chako Knuckles.
## 8 Nov 2026 — Dana's status application and Super Armor gauge (Claude)
- Test 01: 17 Dana entries at Lv.70 (David). Chako Knuckle 0.25 Frost and 22% gauge at 1 stack, 35% as the single blow (2 stacks, Knockdown or Ice Block); Chako Spin 0.15 Frost, 17.5%; Summon Chako 0.15 Frost, 0.10 Knockdown, 12%. Whole gauge in about 23 s alone, about 7 s in the freeze team.
## 8 Nov 2026 — Astria's status application and Super Armor gauge (Claude)
- Test 01: 10 Astria entries at Lv.70 (David), normal and Precision Shot mode. Wide Shot 17.5% (22.5% in the mode), Bolt Bombard 18%, basic 6 bolts 12% (0.20 Stun and 35% in the mode). Whole gauge in about 18 s, tied with Castella.
## 8 Nov 2026 — Aria's status application and Super Armor gauge (Claude)
- Test 01: 16 Aria entries at Lv.70 (David). Air Bomb 0.22 Burn, 0.20 Airborne and 12% gauge; Rolling Bomb 0.23 Burn, 0.10 Airborne, 6%; Switch On! with 3 bolts 0.20 Burn, 0.10 Airborne, 6% (a basic Bomb Arrow explodes like one bolt). Whole gauge in about 50 s. Lute's Healing Circle corrected to 0.25% gauge.
## 8 Nov 2026 — Lute's status application and Super Armor gauge; mastery retest list (Claude)
- Test 01: 10 Lute entries at Lv.70 (David). Stun Slash 0.20 Stun; Swordgrab 0.25 Knockdown and 10% gauge; the rest 0.05–3%. Whole gauge in about 75 s. David's to-do page now lists a mastery retest for each tested hero, naming the skill to test first, then the all-out break time.
## 8 Nov 2026 — Sion's status application and Super Armor gauge (Claude)
- Test 01: 17 Sion entries at Lv.70 (David). Divine Crash 0.25 Shock and 12.5% gauge with no relic placed, 0.27 and 2.5% with one; Divine Smash and Justice Fall 0.20 Knockdown each; the rest under 2% gauge. Whole gauge in about 50 s.
## 8 Nov 2026 — Tarte's status application and Super Armor gauge; Theresia retest noted (Claude)
- Test 01: 20 Tarte entries at Lv.70 (David). Lightning Shock press 0.25 Shock (0.60 with all 26 Bolt Bubble orbs), charge 0.33 (about 0.50 with 8 basic orbs, 0.90 with 26 Ultimate orbs); Thunderbolt 0.15 Shock and 0.25 Stun; gauge at most 7.5%. Only 50% of the gauge after about 67 s. Theresia: basic in Heretic Judgment mode 4% gauge (same as outside); dash rotation 35 s; retest after her mastery is unlocked added to David's to-do page, whose Test 01 item now lists the heroes still to redo.
## 8 Nov 2026 — Theresia's status application and Super Armor gauge (Claude)
- Test 01: 19 Theresia entries at Lv.70 (David), normal and Heretic Judgment mode. Consecration 0.15 Bleed and 4% gauge plus the 10 s blood aura (0.12 Bleed, 2%); Celestial Verdict 0.20 Stun and 10% gauge, 0.25 and 15% in the mode; Holy Rise 0.20 Airborne. Whole gauge in about 27 s.
## 8 Nov 2026 — Ryza's status application and Super Armor gauge (Claude)
- Test 01: 17 Ryza entries at Lv.70 (David). Shock 0.06–0.33 (Stormbringer 0.33 with 0.20 Airborne); Thunder Grab Knockdown 0.20 at 1 stack, 0.25 at 2; gauge 10–12% on Stormbringer and Thunder Grab, 5% on basic and jump. Whole gauge in about 25 s.
## 8 Nov 2026 — Johnny's status application and Super Armor gauge (Claude)
- Test 01: 17 Johnny entries at Lv.70 (David). Poison 0.12–0.25 and Airborne 0.20–0.25 on four skills; Poison Grab 10% gauge at 1 or 2 stacks, the rest 1.5–6%. Whole gauge in about 39 s.
## 8 Nov 2026 — Roxy's status application and Super Armor gauge (Claude)
- Test 01: 19 Roxy entries at Lv.70 (David). Bleed 0.06–0.33 per skill, Crimson Spiral 0.20 Stun, Bleeding Grab at 2 stacks 0.25 Knockdown and 10% gauge; the rest 1–7.5%. Whole gauge in about 50 s. Eileen's Rolling Upper confirmed: launches enemies without the Airborne status.
## 8 Nov 2026 — Eileen's status application and Super Armor gauge (Claude)
- Test 01: 9 Eileen entries at Lv.70 (David). Barraging Spear 0.25 Airborne; Vanguard Banner 15% gauge (spread over time), the rest 0.5–4%. Whole gauge in about 61 s.
## 8 Nov 2026 — Reina's status application and Super Armor gauge (Claude)
- Test 01: 11 Reina entries at Lv.70 (David). Airborne 0.20–0.25 per skill (Wind Slayer per charge, 2 charges); Wind Grab 11% gauge, everything else 2.5–4%. Whole gauge in about 50 s.
## 8 Nov 2026 — Test 01 cleared for David's Lv.70 redo; Charlotte recorded (Claude)
- Test Kit storage: the 201 older Test 01 entries removed at David's request (he is redoing every hero); all 254 entries as they were are kept in `docs/testkit/test01-apply-backup-2026-11-08.json`. Kept: today's Castella gauge, Kalsion and Kalien. Added 15 Charlotte entries: Poison Dagger 0.50 Poison, Shadow Grab 10% gauge as her best, whole gauge in about 40–41 s.
## 8 Nov 2026 — Kalien's status application and Super Armor gauge (Claude)
- Test 01: 16 Kalien entries on the Training Ogre at Lv.70 (David). Big skills 0.23–0.30 Burn and 10–15% gauge; Finale adds 0.20 Stun; small attacks 1–3% gauge. Whole gauge in about 25 s going all out.
## 8 Nov 2026 — Kalsion's status application and Super Armor gauge (Claude)
- Test 01: 27 Kalsion entries on the Training Ogre at Lv.70 (David, % overlay for the gauge): every skill with and without Royal Flame. Best gauge damage: Explosion charge and Flame Wave long-range charge, 12% each. Royal Flame Flame Wave press: 0.33 Burn, 0.20 Airborne, 10% gauge. Whole gauge in about 30 s going all out (Castella 18 s).
## 8 Nov 2026 — Castella's Super Armor gauge damage (Claude)
- Test 01: 9 Castella entries on the Training Ogre, measured with David's % overlay on the boss bar (Skill ~23%, Ultimate ~15%, whole gauge in 18 s). `DAMAGE_TESTS.findings`: application and gauge damage don't depend on hero or skill level.
## 8 Nov 2026 — Test 01 entries for the five newest heroes (Claude)
- Test Kit storage: 33 status-application entries for Theresia, Tarte, Dana, Alex and Astria, taken from David's training-ground reports during the rating debates (Lv.1 heroes, marked 'From chat with Claude, estimate'). Test 01's note corrected: Reina, Aria, Roxy, Johnny, Lute and Sion already had boss entries.
## 8 Nov 2026 — Six more Lv.70 heroes measured (Claude)
- `HERO_BASE_STATS`: Ryza, Theresia, Castella profile B (1100 / 350 / 7388); Roxy, Sion profile A (1143 / 335 / 7157); Tarte profile C (1186 / 320 / 6927). 11 of 20 heroes now measured.
## 8 Nov 2026 — Reina and Kalsion Lv.70 measured (Claude)
- `HERO_BASE_STATS`: Reina 1100 / 350 / 7388 (same as Johnny, profile B); Kalsion 1099 / 350 / 7388, one Attack lower for an unknown reason.
## 8 Nov 2026 — Kalien Lv.50–70 measured: a third breakthrough profile (Claude)
- `HERO_BASE_STATS.Kalien` measured at Lv.70 (1186 / 320 / 6927), profile C: her breakthroughs add more Attack and less Defense and HP than A or B (192 / 45 / 692 up to Lv.50, then +65 / +15 / +231 at Lv.60). Her 21 levels from 50 to 70 follow the shared level curve within 2 Attack and 12 HP; curve refitted on them. Other estimates moved by up to +9 Max HP.
## 8 Nov 2026 — Johnny's Lv.70 stats measured; level curve refitted (Claude)
- `HERO_BASE_STATS.Johnny`: 1100 / 350 / 7388 measured (David; no gear or Karma, titles removed). Charlotte and Johnny, on different breakthrough profiles, came out with the same level part at Lv.70 (929.7 / 260 / 6003), so the level curve, not the Lv.60 breakthrough, was low. `HERO_STAT_MODEL.levelCurve` refitted with Lv.70 added; `hero_stats.py --write` raised every estimated hero by about +10 Attack, +1 Defense and +50 Max HP (profile B now 1100 / 350 / 7386).
## 8 Nov 2026 — Charlotte's Lv.70 base stats measured (Claude)
- `HERO_BASE_STATS.Charlotte`: 1143 / 335 / 7157 (Attack / Defense / Max HP), measured by David with no gear or Karma and the owned titles taken off. The estimate was 1133 / 335 / 7105 (Attack 0.9% and HP 0.7% low). First measured Lv.70 hero.
## 8 Nov 2026 — A cup for every achievement category (Claude)
- `achievements.json` `fame.categories`: Pioneer's Title (Explore), Name of Prowess (Quest), Title of Wisdom (Collect), Name of the Strong (Combat), The Fame of the Challenger (Special), each with its cup icon, description, points per achievement and the stages seen. The Achievements page shows all five. Special gives 25 points per achievement and its Stage 1 needs 100 Fame. Name of Prowess recut to match the others; uploads removed.
## 8 Nov 2026 — David's priority to-do list updated (Claude)
- `docs/dragonsword_david_todo_by_priority.html`: done items removed (ratings, combo check, Test 05, obtain info, Fame icon, Quest items, Codex icon, Barbarian and region checks); new items for levelling to 70, Lv.70 team tests, Hunt weakness (Test 07), signature tests, Tower Defense and boss application. Now kept in the repo so it isn't lost again.
## 8 Nov 2026 — Quest item, Name of Prowess, Codex icon, Test Kit refresh (Claude)
- Item Database Quest tab: new `assets/items/quest.json` with A Thank-You Note from the Phantom Thief of Dawn and its icon; descriptions keep their paragraph breaks.
- Achievements: Fame note now read from `achievements.json` `fame` (renamed Name of Prowess, with its cup icon cut out and the stage rewards: stages 1 to 3 at 50/100/150 Fame per category, each 100,000 Gold + 50 purple crystals).
- Menu: Guides uses the Codex book icon, recut from David's menu screenshot (`assets/ui/guides.webp`, `UI_ICONS.guides`).
- `docs/LAUNCH_CHANGES.md`: Kalsion's obtain confirmed as Chapter 4, Adventure Quest 40; Cerese's (Adventure Quest 30, end of Chapter 3) added.
- Test Kit: test 05 (level costs) and the Defense debuff stacking moved to Already answered; all 20 heroes in the hero lists; tests 01, 02 and 06 updated to what's still open (boss application, Towers of Trials Defense); new test 07, Hunt boss weakness on Nightmare and up.
- Uploaded screenshots in `assets/ToDo_NeedsToBeSorted/` removed after cutting (in git history).
## 8 Nov 2026 — Levelling calculator: Karma materials by archetype (preview, Claude)
- In Karma mode, pick an archetype icon to see the crystal, Trait Stones and Chronographs for the range, with runs (crystal from its Normal Dungeon, stones from the archetype's Trait Dungeon boss), Chronograph prices (Klonie 150,000 Gold or 20 Adventurer's Emblems each) and EXP runs of Residual Worm Cleanup Zone on Very Hard (60 Arcana of the Future each). New `karmaPattern.table`; the Lv.40 example's 'Orb of Recollection' typo fixed.
## 8 Nov 2026 — Titles 38/109; calculator level cap and Insignia prices (Claude)
- `TITLES`: Feather of Burning Ashes, Hungry Eye, Crushing Darkness obtained (38/109).
- Levelling calculator (preview): From and To level boxes stop at 70 (`calc.maxLevel`). Insignia lines show the price from Klonie in Orbis Castle (100,000 Gold each) or the Exchange (20 Adventurer's Emblems each), from `calc.insigniaBuy`.
## 8 Nov 2026 — Levelling calculator: hero picker, materials and dungeon runs (preview, Claude)
- Pick an archetype icon, then a hero portrait (both with hover names), to see that hero's breakthrough materials for the level range and how many runs of each Normal Dungeon difficulty they take. EXP shows runs of Residual Worm Cleanup Zone on Very Hard (45 Tomes of Heroes each); Insignia are shown as Exchange only; Gold isn't counted. New `breakthroughs.heroTable` and `heroPattern.insignia`. Kalien's Lv.50 example corrected to 5 Insignia (David).
## 8 Nov 2026 — Dana's breakthrough materials; all 20 recorded (Claude)
- `LEVEL_COSTS.breakthroughs.heroPattern`: Dana uses Monster Hide + Drop of Purity. All 20 heroes recorded; first material has no rule.
## 8 Nov 2026 — Breakthrough materials for Alex, Theresia, Tarte, Sion, Astria (Claude)
- `LEVEL_COSTS.breakthroughs.heroPattern`: 19 of 20 heroes recorded. New first material Monster Carapace (Alex); Monster Essence adds Theresia and Astria; Tarte uses Monster Hide; Crushing uses Fruit of Vitality.
## 7 Nov 2026 — Hero Quest signature Karmas owned (Claude)
- `KARMA_DATA`: Cerese, Othello, Ornette, Dana and Theresia signature Karmas marked owned (Hero Quest rewards), with Kalien, Kalsion and Charlotte: 8 of 20.
## 7 Nov 2026 — Title Inquisitor, signature Karmas owned (Claude)
- `TITLES`: Inquisitor obtained, 35/109. `KARMA_DATA`: Kalien, Kalsion and Charlotte signature Karmas marked owned.
## 7 Nov 2026 — Team Planner artifact (Claude)
- New shared planner (https://claude.ai/artifact/7k9fC5D1pShnjkX8R3PtYD, source `docs/testkit/dragonsword-planner.html`): 9 team ideas and a 20-hero Signature Karma farming order, editable by David, stored in its db (`teams`, `sigs`).
## 7 Nov 2026 — Tier list Overall / Single target / Groups switch (preview, Claude)
- In the Overall view, a switch re-sorts the grid by single-target or group ratings, without hovering.
## 7 Nov 2026 — Tag toggles, Castella applies Break (preview, Claude)
- New tier list: a small arrow under each hero with tags shows or hides that hero's tags, and a Tags button beside the filters shows or hides all of them (remembered per browser). Castella's Applies chip: Break in bold, then Stun and Airborne.
## 7 Nov 2026 — Applies chip, Johnny to Sub-DPS (preview, Claude)
- New `applies{main, also}` on Enablers and Enabler-tagged heroes, shown as an Applies chip in archetype colours (main in bold). Johnny moved to Sub-DPS with the Enabler tag.
## 7 Nov 2026 — Tier list roles: Main DPS, Sub-DPS, Enabler, Support (preview, Claude)
- New tier list has four role columns. Preview roles live in `TIER_LIST_V2.heroes[].role` (public `HEROES.role` unchanged). New Enabler role icon `assets/roles/enabler.webp` (the Enabler tag's puzzle piece on a blue circle). The Enabler tag is removed from heroes whose role is now Enabler and kept for Lute and Sion; its description now says it's an extra on top of the main role.
## 7 Nov 2026 — Theresia rated; all 20 heroes rated (preview, Claude)
- `TIER_LIST_V2.heroes.Theresia`: A overall, B single, S+ groups, Gatherer, Needs Stun or Bleed, agreed with David at base.
## 7 Nov 2026 — Alex rated (preview, Claude)
- `TIER_LIST_V2.heroes.Alex`: C overall, B single, C groups, Team buffer and Expert (−1), agreed with David. Team buffer tag text now includes lowering the enemy's Defense.
## 7 Nov 2026 — Finding: Defense debuffs multiply with Defense Ignore (Claude)
- `DAMAGE_TESTS.findings`: Alex's Guard Counter debuff (−10% Lv.1, −20% Lv.10, about 10 s, carries over on swap) multiplies with Earthshatterer's Defense Ignore. The calculator has no debuff input yet.
## 7 Nov 2026 — Tarte rated (preview, Claude)
- `TIER_LIST_V2.heroes.Tarte`: C overall, C single, B groups, Enabler, agreed with David at base.
## 7 Nov 2026 — Dana rated (preview, Claude)
- `TIER_LIST_V2.heroes.Dana`: A overall, A single, S groups, Easy, agreed with David at base (Lv.1, not yet built). He'll revisit once she's built like the others.
## 7 Nov 2026 — Astria rated (preview, Claude)
- `TIER_LIST_V2.heroes.Astria`: C overall, C single, C groups, Needs A? (level untested) and signature Karma, agreed with David after debate.
## 7 Nov 2026 — Coloured heroes, Refreshing Canary, titles, tower selector (Claude)
- Dana, Alex, Theresia, Tarte and Astria: colour portraits cut from David's Codex screenshots with `tools/image/codex_recolor.py`, now owned (all 20 heroes). Refreshing Canary: colour picture, owned; Bird group 2/4. Titles: Snow Alchemist, Saintess of the Dawn, Red Fox obtained (34/109). Source PNGs removed (in git history).
- Damage calculator (preview): the Tower of Trials selector shows, and counts, only with the World switch on, ready for a separate Tower switch once tower Defense is tested.
## 7 Nov 2026 — Calculator: Weak to only in Trait Dungeons (preview, Claude)
- The Weak to selector shows, and counts, only with the Trait Dungeon switch on.
## 7 Nov 2026 — Calculator: coloured tower and weakness bonuses (preview, Claude)
- Status table shows a gold +xx% badge, with a hover note, beside the hit bonus when the Trait Dungeon weakness is set and beside Additional Damage when a Tower of Trials is chosen. Display only; the maths is unchanged.
## 7 Nov 2026 — Notes on upcoming heroes and content (Claude)
- New `assets/upcoming/` with David's notes on Jerome, Veronica, Logan and Viola, the story premise and announced expansions, plus his Veronica screenshot. Not shown on the site.
## 6 Nov 2026 — Title Sage of the Blue Moon (Claude)
- `TITLES`: Sage of the Blue Moon obtained, 31 of 109.
## 6 Nov 2026 — Ogre added (preview, Claude)
- `DEFENSE_MODEL.types`: Ogre ×1.1 from one Lv.75 World hit; Harpy note adds Lv.67.
## 6 Nov 2026 — Calculator: Where switch and Boss checkbox (preview, Claude)
- Damage calculator's enemy section now has World (default), Normal Dungeon, Trait Dungeon and Currency Dungeon switches, with a Boss checkbox except in Currency. New `DEFENSE_MODEL.places`; dungeon entries left `types`.
## 6 Nov 2026 — Hidden enemy variants, Troll merged (preview, Claude)
- `DEFENSE_MODEL`: identical-looking Harpies measured at both ×1.0 and ×1.05, noted on the curve. Troll merged back to one entry at ×1.1, as David confirmed the earlier ×1.1 hits were blue.
## 6 Nov 2026 — Currency Dungeon Defense confirmed, Ent and Troll colours (preview, Claude)
- `DEFENSE_MODEL`: Currency Dungeons confirmed at ×0.4 in two dungeons, curve gains Lv.20 and Lv.35 from them. Ent ×1.05 added; Troll split into blue ×1.05 and purple ×1.1.
## 6 Nov 2026 — Enemy Defense: recolours, new types, Currency Dungeons (preview, Claude)
- `DEFENSE_MODEL.types`: Goblin Barbarian ×1.05 → ×1.1, Spider ×1.05 → ×1.0, new Armored Warg, Orc Barbarian and Sand Claw at ×1.1. Curve note records recolour results, Sand Claw Dragus and the low Currency Dungeon Defense. Test Kit: Orc Barbarian and Sand Claw added to test 06.
## 6 Nov 2026 — Enemy Defense at Lv.75 (preview, Claude)
- `DEFENSE_MODEL`: World Lv.75 basic enemy measured at 841 and added to the curve. Notes added to Ghoul, Harpy, Spider and Troll, whose hits disagree across levels. Endless Summoning Grounds noted as not following the curve.
## 6 Nov 2026 — Enemy levels for all dungeons (preview, Claude)
- `enemyLevel` recorded for all 15 Normal and 5 Currency Dungeons at each difficulty, from David's in-game checks.
## 6 Nov 2026 — Enemy level bar on dungeon cards (preview, Claude)
- Normal and Currency Dungeon cards show a small "Enemy Lv." bar beside the I/II/III circles, which follows the chosen difficulty. It shows `?` until David's levels are recorded in `enemyLevel`.
## 6 Nov 2026 — Calculator locks required statuses (preview, Claude)
- Damage calculator: choosing a skill that needs a status ticks and locks it. Your own ticks come back when you change skill.
## 5 Nov 2026 — Levelling calculator (preview, Claude)
- Tools page: Hero and Karma levelling calculator, using the game's item-picking rule, with tabs for the two tools. `LEVEL_COSTS` has Karma EXP to 70, the Karma breakthrough at 60 and item icons.
## 5 Nov 2026 — Hero EXP to 70, Tome of Heroes (preview, Claude)
- `LEVEL_COSTS`: Hero EXP measured to level 70, hero breakthrough at 60 (80,000 Gold), Tome of Heroes at 5,000 Gold. Icon added to the Currency Dungeon and the Item Database.
## 5 Nov 2026 — Barpedin, Tome of Heroes (preview, Claude)
- World Boss spelling corrected to Barpedin. Tome of Heroes added to `LEVEL_COSTS` at 20,000 Hero EXP (Gold unknown) and to Test Kit test 05.
## 5 Nov 2026 — Chapter 8: last bosses, dungeon, familiar, titles, runes (preview, Claude)
- Tier list: Hunt boss Earthlander of the Ravenous Earth and Raid boss Ursula, whose tab fades between her two forms in purple, with a new self-hosted font. No locked boss tabs left.
- Currency Dungeons: Residual Worm Cleanup Zone, no locked entry left. Tome of Heroes shows as text until it has an icon.
- Stormy Direwolf in colour and owned; `TITLES` at 28; `RUNES` values added; Gigantic Tooth in the Item Database; 3 more gear rows checked.
- Uploaded PNGs converted to WebP and deleted.
## 5 Nov 2026 — Test 01 entries from the rating chat (Claude)
- Test Kit: 47 status entries saved from David's rating discussions, marked as estimates; Kalien, Othello and Ryza added to the hero lists.
## 5 Nov 2026 — Othello rated (preview, Claude)
- `TIER_LIST_V2`: Othello B overall, B single target, A groups, Gatherer, Self-sufficient, Expert −1. New finding in `DAMAGE_TESTS`: Ryza and Othello at equal Attack. Public text changes added to `docs/LAUNCH_CHANGES.md`.
## 5 Nov 2026 — Towers start Unrated (preview, Claude)
- New tier list, Towers mode: heroes are Unrated until rated for that tower, rather than showing their Overall tier faded.
## 5 Nov 2026 — Sion rated (preview, Claude)
- `TIER_LIST_V2`: Sion B overall, B single target, A groups, Team buffer, Enabler, Needs A1. New finding in `DAMAGE_TESTS`; Divine Smash corrected from Stun to Knockdown there and in the Test Kit.
## 5 Nov 2026 — Ryza rated (preview, Claude)
- `TIER_LIST_V2`: Ryza A overall, A single target, S groups, Gatherer, Self-sufficient, Expert −1. New finding in `DAMAGE_TESTS`. Public text changes added to `docs/LAUNCH_CHANGES.md`.
## 5 Nov 2026 — Kalien rated (preview, Claude)
- `TIER_LIST_V2`: Kalien B overall, C single target, A groups, Enabler, Needs A1, signature card. About text: Masteries aren't part of the base kit. New finding in `DAMAGE_TESTS`, including that ticks keep the Attack from when Burn was applied.
## 5 Nov 2026 — Kalsion rated; ratings are for base kits (preview, Claude)
- `TIER_LIST_V2`: Kalsion A overall, B single target, S groups, Gatherer, Needs Airborne. The About text and signature Karma text now say heroes are rated on their base kit.
- New `docs/LAUNCH_CHANGES.md`: Kalsion's corrections that touch public pages.
## 5 Nov 2026 — Calculator: Explosion press and hold (preview, Claude)
- `DAMAGE_CALC.skillAdjust`: Kalsion's Explosion, press 5 hits x0.6 and hold 15 hits x1.35 of the codex %, measured from David's hit numbers with Airborne up. New finding in `DAMAGE_TESTS`.
## 5 Nov 2026 — Calculator: press and hold, measured skill corrections (preview, Claude)
- David's whole-skill tests on Reina and Kalsion: new `DAMAGE_CALC.skillAdjust`, a "How it's used" choice for Flame Wave, and notes on Royal Flame's Attack buff. New finding in `DAMAGE_TESTS`.
## 4 Nov 2026 — Calculator enemy picker (preview, Claude)
- Damage calculator: pick enemy type, dungeon or world and level, and it works out Defense from test 06 (`dcEnemyDef()`). World Bosses and the dummy stay fixed values; typing a Defense still works. Rough Mantius entries removed, now covered by Trait Dungeon types.
- `DEFENSE_MODEL`: `levelCurve` merged into one curve with `worldFactor`; new `types` list replaces `typeMultipliers`. New finding in `DAMAGE_TESTS`.
- Back-test on all 101 entries: 93 within 1 damage, 96 within 1%. The 5 misses are listed in `docs/PROJECT_HANDOFF.txt`.
## 4 Nov 2026 — Enemy Defense: third test batch, gear rows (Claude)
- `DEFENSE_MODEL`: dungeon curve to Lv.70, world curve at about x0.8, updated type multipliers and open questions. New finding in `DAMAGE_TESTS`. Not used by the page yet.
- `GEAR_STATS.valueSources`: 93 Test Kit rows checked against the tables, upgrade steps per rarity recorded. The "flat stats 1–2% high" note is resolved: it came from comparing with 4x the +0 value.
- Test Kit test 06: Save button now sits above the enemy table.
## 4 Nov 2026 — Enemy Defense: second test batch (Claude)
- `DEFENSE_MODEL`: separate dungeon and world curves, more type multipliers, dungeon bosses x1.3, and 5 World Bosses added (they now appear in the calculator's enemy list). New finding in `DAMAGE_TESTS`.
- Test Kit test 06: Goblin Barbarian replaces Goblin Chief, Reaper added, Fierce Ironclad Warg replaces the Warg boss placeholder.
## 4 Nov 2026 — Enemy Defense: first test batch (Claude)
- `DEFENSE_MODEL`: new `levelCurve` and `typeMultipliers` from Test Kit test 06; new finding in `DAMAGE_TESTS`, including that Break doesn't lower Defense. Not used by the page yet.
## 4 Nov 2026 — Damage calculator and Enemy Defense test (preview, Claude)
- Tools page: damage calculator from panel stats (non-crit, crit, average), with small print for what Armor Penetration and Defense Ignore add. New key `DAMAGE_CALC`. Public page unchanged.
- Checked against 41 of David's recorded hits: all within 0.21%. 23 use the clean hit as their baseline, so they test the bonuses rather than Defense.
- Test Kit: new test 06 Enemy Defense, with a green/red table by enemy type.
## 4 Nov 2026 — AGENTS.md trimmed, test 04 done (Claude)
- `AGENTS.md` is now rules, workflow and a key index (loaded with every message). All the detail moved unchanged to the new `docs/DATA_REFERENCE.md`.
- `DEFENSE_MODEL`: Berpedin is Lv.80, above the Lv.90 dummies' Defense, so Defense doesn't follow level alone.
- Test Kit: test 04 moved to Already answered (entries kept in storage); the level-up test keeps number 05.
## 4 Nov 2026 — Defence formula confirmed on a World Boss; notes brought up to date (Claude)
- `DEFENSE_MODEL`: from David's 3 Test Kit hits on Berpedin, the Crushing Darkness: K = 1,000 is a constant and Berpedin has about 1,197 Defense (1,193–1,201). All 10 test hits fit within 0.5 damage. Added enemies (rough ones marked), checks and what each point is worth. New finding in `DAMAGE_TESTS`. Not on the page.
- Stale notes fixed in `AGENTS.md`, `CHATGPT.md`, `docs/PROJECT_HANDOFF.txt` and `docs/NEW_CHAT_BRIEFING.md`: Goblin alignment done, Currency now 4 discovered and 1 locked, full preview page list, item catalogues in use, levelling calculator waits on levels 51–70. This file's newest-first order fixed.
## 4 Nov 2026 — Handoff files (Claude)
- `docs/NEW_CHAT_BRIEFING.md` (briefing for a new chat), `docs/testkit/dragonsword-test-kit.html` (Test Kit backup), `tools/image/` (Codex card-cutting scripts).
## 4 Nov 2026 — Defense formula, costs to level 50, titles 25/109 (Claude)
- New `DEFENSE_MODEL`: damage ∝ K / (K + Defense × (1 − Defense Ignore) − Armor Penetration); Training Ogre Defense 1,000, K 1,000; fits all 7 test points within 0.06%.
- `LEVEL_COSTS`: Arcana of the Future 3,000 Gold; Hero/Karma EXP to level 50; breakthrough examples (Karma 50 = 50,000 Gold).
- Titles 25/109 (Restorer of Grace, Pioneer of the Wind Path, Guide of the World, Tycoon). 8 more gear rows match the tables.
## 4 Nov 2026 — Item Database and Achievements (preview, Claude)
- Item Database page: tabs Materials / Ingredients / Important / Quest (Quest has no data yet), search, rarity filter; reads `assets/items/<tab>.json` when opened.
- Achievements page: search, category and ticked filters, a tick per achievement saved in the viewer's browser (`dsw.achievements.v1`), and a Fame stage rewards box (only Stage 1 recorded).
## 4 Nov 2026 — Guides, Tools and News menus (preview, Claude)
- New preview-only menu entries: Guides (book icon placeholder until David's Codex icon), Tools (wrench, empty page) and News (newspaper, disabled for now). Guides shows 8 categories from the new `GUIDES` key with placeholder 'soon' cards. Public page unchanged (checked).
## 4 Nov 2026 — Item list additions (Claude)
- `assets/items/materials.json`: Tangled Forgetfulness and Remembrance, Stilled Core of Collapse (Gallore the Collapse) and High-Grade Venom Stone, with icons, descriptions and sources from David's inventory screenshots.
- Ghoul Greed's note now names its last two rewards: Secret Text of the Warrior ×10, Record of Battle ×20.
## 4 Nov 2026 — David's Chapter 6 batch (Claude)
- New Hunt boss tab Ghoul Greed (Lv.45, preview tier list); the second Hunt slot stays undiscovered. Hunt bosses now show a Rating rewards panel (S 36,000 pts: 1 Stigma Awaken Stone; A–D: 50/25/15/10 Fragment of Sacred Light), from `TIER_LIST_V2.huntRatingRewards`.
- Necklace Soaked in Greed added to `assets/items/materials.json` with its icon.
- New Currency Dungeon Eroded Underground Cemetery (Gold), with description and rewards for I/II/III; banner art to come. One Currency Dungeon left undiscovered.
- Ryza owned (colour portrait); `profileFaction: The Six Heroes` (Codex group stays Other). Knightage Griffon owned (Griffon 2/4). Titles 21/109 (Elite Mercenary Crew, +190 Max HP).
- Runes seen: Damaged Protection 15 and 20, Intact Focus 1.80%.
- Raw Mana Stone costs 5,000 Gold per use (gear calculator updated). New `SKILL_BUFF_LEVELS` with the 8 buff rows from Test Kit test 02 (Kalsion's Weapon Blaze added).
- Gear rows: all % main stats match; Purple Defense and Blue Attack read ~1–2% above the estimate (noted in `GEAR_STATS.valueSources.flatLowerRarityNote`, tables unchanged).
## 3 Nov 2026 — Keep work current with GitHub

David requested always checking for newer commits and deployments, and applying this chat's work on top of them. Added the rule to AGENTS.md, including preserving other assistants' changes, checking again before pushing, and verifying the remote result. Fetched origin/main: b4f9bfe was current. GitHub deployment API returned Forbidden, so deployment status could not be independently verified. Documentation only; no application or data changes.

## 3 Nov 2026 — Restore original index.html line endings

Restored LF line endings without changing page content, and added an explicit preservation rule to AGENTS.md. Applied on top of the latest main changes. Verified identical content after newline normalisation and ran the data validator. User requested committing and applying the fix to GitHub.

## 3 Nov 2026 — Fit Currency Dungeon backgrounds inside the frame

- Inset the Currency Dungeon background image layer 9px with rounded clipping so it sits within the existing frame on all sides. This affects the three discovered preview cards; locked placeholders and frame artwork are unchanged.
- Updated `index.html`, `CHATGPT.md`, `docs/PROJECT_HANDOFF.txt` and `docs/DUNGEON_ARTWORK_WORKFLOW.md`; the change remains behind the existing `?tiers=new` preview gate. No data, frame asset or locked placeholder changed.
- Validation: inspected the frame SVG geometry and CSS stacking, reviewed the focused diff, then David confirmed on the live preview that all three discovered backgrounds fit inside the frame and difficulty switching works. Live visual verification was performed by David after GitHub checks completed.





## 3 Nov 2026 — Hero/Karma EXP to level 40, breakthrough costs (Claude)
- `LEVEL_COSTS`: EXP per level up to 40 and breakthrough Gold with material examples, from David's Test Kit entries.
## 3 Nov 2026 — Skill level costs (Claude)
- `LEVEL_COSTS.skills`: Gold and materials for every skill level, measured by David on Kalien (Explosion to Lv.10, Great Rush to Lv.7).
## 3 Nov 2026 — Level-up costs measured (Claude)
- Test Kit test 05 (David): Hero 1→20, Karma 1→20, Orange gear +0→+15. Gold is a price per EXP item: Basic/Advanced/Core Combat Text 200/650/1,800; Arcana of War/Beginnings/Peace 150/400/1,300; Mana Shard/Crystal/Ore 300/700/2,000. All 52 steps match. New key `LEVEL_COSTS`.
- Gear upgrade calculator (preview) now works Gold out from the items it picks.
- Fixed 19 Test Kit entries saved as Hero that were Karma (Rock-Splitting Ice).
## 3 Nov 2026 — David's 3 Nov batch (Claude)
- Titles: 20/109 (Dungeon Conqueror, Specter of Thirst, The Roamer, Tyrant, Falling, Skilled Hunter, The Predator, Scraping, Dark Necromancer added); cumulative bonuses recalculated from the passives.
- Karma: 21 cards now in colour and marked owned (23 owned), cut from David's Codex screenshots (name painted out as before); source PNGs deleted.
- Familiars: Abyssal Direwolf, Guardian Griffon and Brave Baby Dragon in colour and owned; species counts updated, so their first passive step now shows as unlocked.
- Runes: new values seen (Damaged Determination 21, Damaged Focus 1.60%, Refined Determination 49); removing an engraved Intact or Refined rune also costs 10,000 Gold. Rune screenshots converted to WebP.
- Gear: all 63 Test Kit main-stat rows match the gear tables (`GEAR_STATS.valueSources.testKitRows`).
- Checked the page after the ChatGPT/Codex changes: every page opens in the preview with no console errors; data.json validates.
## 3 Nov 2026 — Replace Goblin Bandits' Cave preview banners

- Replaced the existing Normal, Hard and Very Hard Goblin Bandits' Cave banner images with David's three supplied variants. Kept the existing filenames and data.json paths.
- All sources were 2172×724. Applied the same source-pixel crop to each (x=0, y=250, width=2172, height=312), then resized to the site's 1672×240 banner canvas. Blue is Normal, purple is Hard, and red is Very Hard.
- Preview-only dungeon visibility and the live public no-query view are unchanged; no HTML or guide data changed.
- Validation: confirmed all three source dimensions, output dimensions, matching crop geometry and aligned goblin placement in a comparison image; reviewed the diff. Browser rendering was not available in this task.

## 3 Nov 2026 — Reconcile Dungeons handoff and project notes

- Updated `AGENTS.md`, `CHATGPT.md` and `docs/PROJECT_HANDOFF.txt` to describe the shipped preview state instead of the obsolete pre-implementation Dungeons brief. Marked `docs/TASK_dungeons_page.md` as historical so future contributors do not follow superseded scope.
- Provenance: David clarified that he created the original Normal Dungeons foundation with the ChatGPT chat version. This project separately migrated Normal rewards to the Trait-style key/count model and data-driven item label/icon map, including EXP.
- Recorded current Normal page/artwork and the pending Goblin Bandits' Cave Difficulty I alignment; Currency's three discovered entries, two locked entries, complete confirmed reward tiers, data-driven icons, selection reset and approved backgrounds; and the nine Trait boss banner assignments.
- Preserved the release boundary: all new Dungeons content stays gated behind `?tiers=new`; the public no-query page is unchanged. Currency frame corner polish remains deferred to David's separate graphics pass.
- Documentation-only update; website code, data and artwork were not changed. Validation: reviewed diffs and confirmed the notes distinguish completed, pending and prior ChatGPT-authored work.

## 2 Nov 2026 — Main-only preview policy and durable handoff

- Updated AGENTS.md and CHATGPT.md with David's explicit main-only / ?tiers=new development policy, replacing conflicting branch advice. Added docs/PROJECT_HANDOFF.txt with the completed four-dungeon request, decisions, files, validation, publication method/commits and pending work.
- Removed three obsolete artwork staging branches after confirming no open PRs and all their banner references already present on main. Main retained.
- Validation: documentation-only changes; reviewed policy consistency and recorded completed versus pending work. Branch inventory and committed note contents verified after publication. Site code/data/assets unchanged in this task.

## 2 Nov 2026 — Final four Normal Dungeon artwork sets

- Added twelve 1672×240 WebP banners for Rock Tribe Base, Collapsed Sanctuary, The Graveyard Where Tragedy Sleeps and Ashen Ruins. Added only their per-difficulty banner paths in data.json; rewards, names, renderer, frames and preview gating remain unchanged.
- Rock Tribe uses corruption/inferno; Sanctuary uses escalating lich necromancy; Graveyard progresses from sleeping skeletal dragon to gathering spirits to spectral awakening; Ashen Ruins combines the skeleton commander, spiders and an undead troll with a venomous greed curse. David clarified that Tomb of Greed was a naming typo and Ashen Ruins is correct.
- Artwork generated using built-in imagegen. Production fitting preserves subject proportions with separate environment/subject framing and one consistent transform per dungeon across difficulties. Illustration masters remain saved locally.
- Validation: repository data validator passed; structural comparison against HEAD confirms only twelve banner paths changed. Browser checked all twelve difficulty selections at 1920×1080 and 2560×1440, including corresponding rewards and constant card size. Reviewed framed exports and local browser fit, browser error log empty; normal public URL hides dungeon navigation. index.html unchanged. Deployment wait intentionally omitted.

## 2 Nov 2026 — Match dungeon frame geometry across difficulties

## 2 Nov 2026 — Four more dungeon backgrounds

- Added all three difficulty backgrounds for Rusted Tusk Treasure Vault, Fang Bandits Arena, Dark Swamp and Forest of Entangled Roots. Existing frame colours, sizes, controls and rewards are unchanged.

## 2 Nov 2026 — Four-dungeon artwork batch

- Added twelve 1672×240 WebP backgrounds for Underground Goblin Village, Silver Tusk Bandits' Supply Depot, Warg Enclosure and Coastal Cliff Cave Outpost.
- `data.json`: added only their twelve per-difficulty banner paths. No rewards, existing artwork, frame geometry/colours or preview gating changed.
- Coastal artwork uses the corrected separate goblin nose/mouth anatomy approved by David; its variants add the whispering Dragon Worshipper and destructive power consuming the throne room. Other sets keep their distinct village, contraband and breeding-pen themes.
- `docs/DUNGEON_ARTWORK_WORKFLOW.md`: recorded batch publication and facial-anatomy lesson. Original illustration masters remain saved locally; production assets use consistent per-dungeon framing for difficulty switching.
- Validation: JSON/data validator passed; exact browser-edited JSON matches the validated local data; structural comparison confirmed only the twelve new banner paths. Tested every new card at all three difficulties at 1920×1080 and 2560×1440; selected artwork and reward values switch independently. Local visual screenshots reviewed; deployment wait omitted at David's request.


## 2 Nov 2026 — Corrupted Bedchamber difficulty artwork

- Added three 1672×240 WebP banners under `assets/dungeons/banners/`: the approved royal crypt and armoured skeletons, violet Dragon Worshipper necromancy for Hard, and an ember-red draconic presence for Very Hard (visually inspired by Gauron's dragon reference).
- `data.json`: added only the three per-difficulty banner paths for Corrupted Bedchamber. Rewards and other dungeon records are unchanged. Existing frame colours, geometry and preview gate are unchanged.
- `docs/DUNGEON_ARTWORK_WORKFLOW.md`: saved David's Dragon Worshipper/dragon art direction and the tomb's location/story context.
- Validation: JSON/data validator passed; exact browser-edited JSON matched the local validated data; structural comparison confirmed only the intended banner fields changed. Checked all three difficulty selections, frames, rewards and artwork at 1920×1080 and 2560×1440 in the local browser. Used the built-in image generation tool, with shared positioning and frame-fit exports.


## 2 Nov 2026 — Restore original dungeon frame colours

- `index.html`: restored the original purple and red frame assets without colour filters. Applied measured vertical size/position corrections to keep their outer corner spans matched to blue; retained the shared card dimensions and background crop.
- `docs/DUNGEON_ARTWORK_WORKFLOW.md`: corrected the frame rule to preserve the original colours.
- Validation: JavaScript syntax check passed; reviewed the three-line renderer diff; local browser comparison confirmed original assets, no colour filter, equal card heights and identical background clip paths. Visually inspected a three-frame comparison.


- `index.html`: all difficulties now share the blue frame master; purple/red colour filters affect only the frame. Removed the old per-frame crop offsets so backgrounds use one opening, and preserved the existing controls and rewards.
- `docs/DUNGEON_ARTWORK_WORKFLOW.md`: recorded the shared geometry rule and David's instruction to finish review tasks immediately after pushing.
- Validation: JavaScript syntax check passed; local browser checked independent Normal/Hard selections alongside Very Hard, identical frame source, dimensions and clip paths; visually inspected all three colours. No dungeon artwork regenerated or data changed.

## 2 Nov 2026 — Correct dungeon background clipping for each frame
- `index.html`: give the purple and red frames their own background clipping insets. All frame images have a 1672×240 canvas, but the painted top edges differ (blue around y=14, purple y=22, red y=20–21). The old shared crop started at y=18, exposing artwork above II/III. Updated both the illustration and tint/pending-art overlay clipping; purple's bottom crop also stays within its painted edge. Card/frame dimensions, control positions, game data and artwork files are unchanged.
- `docs/DUNGEON_ARTWORK_WORKFLOW.md`: recorded composition/framing lessons, the one-preview Proceed/Stop flow, and the Difficulty I goblin position/scale mismatch as a deferred fix due ASAP after all backgrounds are completed.
- `CHATGPT.md`: linked the artwork workflow so future work picks it up.
- Validation: inline JavaScript passed `node --check` and is unchanged; CSS braces balanced and targeted diff reviewed. Inspected purple/red illustrated cards and a blue pending card at 1920×1080 and 2560×1440; all cards measured 1224×175.6875 CSS pixels at both viewport sizes. Confirmed each difficulty's computed clip and existing rewards; no captured console errors. No images were regenerated.

## 2 Nov 2026 — Goblin Bandits' Cave difficulty artwork
- `assets/dungeons/banners/goblin-bandits-cave-{normal,hard,very-hard}.webp`: added the approved Normal preview and matching purple-corruption and red-inferno variants, generated from David's goblin screenshots and the approved cave composition. All three are 1672×240 and contain no UI; the goblin portraits are inset to keep both faces clear of the existing frame.
- `data.json`: added only the three optional difficulty banner paths for Goblin Bandits' Cave. Existing rewards, frames, controls, preview gating, other dungeons and renderer are unchanged.
- Validation: `tools/validate_data.py` passed; compared parsed data with the previous version and confirmed only these image references changed. Exercised all three selectors and verified their background URLs and existing reward values, inspected rendered screenshots at 1920×1080 and 2560×1440, and checked the browser console (no captured errors).

## 2 Nov 2026 — Warg Cave artwork for each difficulty
- `assets/dungeons/banners/warg-cave-{normal,hard,very-hard}.webp`: added three 1672×240 AI-generated, reference-based cavern backgrounds without baked-in UI. Normal uses cool teal lighting, Hard adds a purple aura, and Very Hard adds an inferno and a skull integrated into the cave.
- `data.json`: linked Warg Cave's existing difficulties to their artwork via optional `difficulties[].banner`, with the Normal image as the dungeon fallback. Game rewards and all other content are unchanged.
- `index.html`: prefer the selected difficulty's banner, falling back to the dungeon banner; reduce the old placeholder darkening on cards with artwork. Existing frames, controls, rewards, pending cards and preview gating remain intact.
- Validation: `tools/validate_data.py` and extracted inline JavaScript `node --check` passed; CSS braces balanced; reviewed the targeted source/data diff and verified game data is unchanged apart from image paths. Inspected all three rendered states at 1920×1080 and 2560×1440, checked the corresponding background URL and reward values, confirmed card size remains stable, the Ballad of Life filter returns 5 cards, and another dungeon's selection remains unchanged. No browser console errors were captured.

## 2 Nov 2026 — Visually verified dungeon control and reward placement
- `index.html`: moved only Difficulty III's overlay slightly right and down (18.36%, 33.7%) to align with the existing painted circle; I and II remain unchanged. Inset the lower-left reward row to 6% from the left and 20% from the bottom, including the mobile override; quantity badges now sit inside their boxes. Existing artwork, data, interactions and preview gating are preserved.
- `CHANGELOG.md`: recorded this fix and validation.
- Validation: inspected local HTTP preview screenshots at 1920×1080 and 2560×1440, including blue/purple/red frames; exercised Warg Cave's I/II/III rewards and the Ballad of Life filter (5 cards); confirmed Dungeons navigation is hidden without preview. No browser console errors were captured. `tools/validate_data.py` passed with the referenced assets present; inline JavaScript passed `node --check` and is unchanged; CSS braces balanced and targeted diff reviewed.

## 2 Nov 2026 — Fine alignment of dungeon difficulty II and III
- `index.html`: nudged the Difficulty II button overlay horizontally from 12.42% to 12.58% and III from 18.07% to 18.22% to better match the painted circle centres in both supplied fullscreen screenshots. Difficulty I, ring styling, banners and rewards are unchanged.
- Validation: verified only these two selectors changed; the inline JavaScript passed syntax parsing and was unchanged, CSS braces were balanced. Live browser render/interactions were not tested.

## 2 Nov 2026 — Normal Dungeons visual alignment
- `index.html`: aligned the three difficulty-button overlays more closely with their painted frame circles; replaced the selected button's outside glow with an inset highlight and softened unselected shading.
- Repositioned the reward row inside the ornate banner and inset quantity badges to keep them clear of the bottom border. Mobile override now retains relative banner alignment instead of applying fixed offsets.
- Validation: checked the JavaScript in the inline `<script>` with a parser-equivalent syntax check and confirmed CSS braces balanced. Reviewed each targeted CSS replacement against the previous text. Browser screenshot/rendered interaction testing was not available in this session.

## 2 Nov 2026 — ChatGPT: first Dungeons preview implementation
- `index.html`: added a collapsible Dungeons navigation group with Normal, Trait and Currency sub-pages; the new pages and menu entries are gated by `?tiers=new`, while the existing Trait Dungeons renderer/data remain unchanged.
- Normal Dungeons: renders all data-driven dungeon cards grouped by farm category, per-card I/II/III difficulty selection, gear rarity chips, EXP/emblem/material rewards, and search/set/slot/farm/Orange filters.
- Currency Dungeons: renders the three recorded entries and two locked undiscovered placeholders; no amounts are invented.
- Added `openDungeons({set, material, slot})` for filtered navigation and a temporary highlight.
- Validation in this session: re-fetched the committed `index.html` and confirmed the new renderer is present. Browser interaction, JavaScript parser validation and visual comparison against the source screenshot have not yet been performed. The card currently uses a neutral reconstructed panel, not a final screenshot-derived crop; visual refinement remains.


## 2 Nov 2026 — Dungeon banner frames fixed
- Difficulty buttons sit exactly on the frame's I/II/III circles; unselected ones are dimmed, the selected one has a thin ring.
- All three frames are the same size (WebP), so cards don't change height between difficulties; banner art is clipped to the inside of the frame.
## 2 Nov 2026 — Normal Dungeons banner restyle (preview)
- Replaced the paper-like Normal Dungeon tiles with wide cinematic banner cards, using independent I/II/III selectors styled after Trait Dungeons, real per-difficulty reward icons/amounts, and rarity chips.
- Added farm-group-specific heading typography and a consistent pending-artwork state for dungeons without a banner.
- Added the first Warg Cave banner asset at `assets/dungeons/banners/warg-cave.svg` and connected it through `DUNGEONS.normal[].banner`. Other dungeons intentionally remain artwork placeholders.
- Preview only; no public-page behavior change. Browser rendering and GitHub Pages deployment still need visual confirmation.

## 2 Nov 2026 — Normal Dungeon card details
- Normal Dungeon cards: removed the visible set/slot text while retaining the underlying set and slot filter data; added the correct Gear set icon as a fourth reward, tinted by the highest rarity available at the selected difficulty. Moved rarity chips and EXP to the card's top-right corner.

## 1 Nov 2026 — Help pages and Crew grades (Claude)
- `assets/help/`: David's Help screenshots (converted to WebP) with their text in `notes.txt`, plus the five Mercenary Crew promotions (requirements, unlocks, rewards). Notes only.






## 1 Nov 2026 — Dungeons data for the planned page
- `DUNGEONS` key in data.json (Normal and Currency Dungeons, with material icons).
- `docs/TASK_dungeons_page.md`: brief for building the Dungeons pages in the preview.
## 1 Nov 2026 — Normal Dungeon rewards
- `assets/dungeons/dungeons.json` and `notes.txt`: gear set, slots, rarities, EXP, Adventurer's Emblems and materials for all 15 Normal Dungeons on all three difficulties.
## 1 Nov 2026 — Small fixes
- Gauron's tab fade follows the clock, so switching tabs or views no longer restarts it.
- Runes box uses the in-game type icons (tab order from David).
- Disassemble typos confirmed by David; dungeon notes: what each group of Normal Dungeons is farmed for.
## 1 Nov 2026 — Gear upgrade calculator, Disassemble, Runes (preview)
- Gear page (preview only): upgrade calculator (EXP, Gold and auto-selected materials per level and in total), Disassemble returns (80% of EXP spent plus base materials), and a Runes box (types, stats, grades, values seen, Synthesis).
- New data keys `GEAR_UPGRADE` and `RUNES` from David's runes_gear_information.txt.
- Gauron's boss tab fades to his dragon form and back once a minute.
- `DAMAGE_TESTS`: Reina's 20% Defense Ignore test (+11.6%).
- All 39 main-stat rows in the Test Kit match the gear tables (`GEAR_STATS.valueSources.testKitRows`).
- `assets/dungeons/notes.txt`: Normal and Currency Dungeon list.
## 1 Nov 2026 — Gauron raid tab
- Raid boss tab glows red and its name is red with a black outline (`theme: "raid"`).
- New boss info panels under the boss tabs (The fights, Strategy, Rewards), filled for Gauron from David's raid screenshots and notes.
## 1 Nov 2026 — Story chapter 5 batch
- Colour portraits for Kalien and Othello (now owned); Dawn Wing Cat familiar (owned).
- Titles 11/109: Impregnable, One Who Erases Names, I Want to Do Missions, High-Ranking Mercenary Crew.
- Cerese, Othello, Ornette, Kalien, Dana and Theresia's signature Karmas: source is now their Hero Quest reward.
- Items: Wild Onion ingredient; Intermediate Monster Bone Fragment, Claw and Essence materials.
- Level 50 measurements (Reina, Charlotte): level curve refitted on L1–L50, L50 breakthroughs measured for both profiles; `hero_stats.py --write` rerun.
- Raid: Gauron added as the first Raid boss tab in the new tier list (preview); `assets/raid/` screenshots converted to WebP with `notes.txt`.
- Runes: five types and five grades recorded in `assets/runes/README.txt` from David's Raid video.

## 1 Nov 2026 — achievements, Mercenary Crew Level (Claude)
- `assets/items/achievements.json`: 103 achievements with conditions, David's progress and the title each gives. Titles tab: Curious Hands and 【777】 now show their achievements.
- `assets/merc-crew/`: the free Crew Level reward track (screenshots + notes).
