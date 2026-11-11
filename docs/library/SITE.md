# The site: code, checks, data structure, GitHub and open site tasks

Back to the library: [docs/README.md](../README.md). Rules: [AGENTS.md](../../AGENTS.md). Every data key in detail: [DATA_REFERENCE.md](../DATA_REFERENCE.md).

## How the site works · updated 10 Nov
- One static page in three parts (split on 10 Nov): `index.html` (layout, ~18 KB), `css/site.css` (every style, ~100 KB; asset paths start with `../`) and the script in nine files loaded in order: `01-core` (globals, `$`, `absUrl`), `02-teams-karma`, `03-profile`, `04-gear-builds` (JS port of `tools/hero_stats.py`), `05-tierlist-heroes-patches`, `06-dungeons`, `07-tierlist-v2-cookbook` (sets `IS_PREVIEW`), `08-items-tools-guides`, `09-startup` (runs last). **No guide data** in any of them. The files share one global scope, so code that runs at load time may only use what earlier files define; everything else runs after the last file. **Bump `?v=` in `index.html` for any CSS or JS file you change** (GitHub Pages lets browsers keep a copy for about 10 minutes). **Image paths written into CSS variables from the script must go through `absUrl()`**, or the browser resolves them against `css/`. Hosted on GitHub Pages from the root of `main`: https://agandaurcze.github.io/DragonSword-Awakening/. No build step, framework or server. Since 11 Nov a GitHub workflow runs every check on each push and publishes only when they pass (Checks and publishing, below); the published site is still exactly the committed files. `js/` and `css/` are formatted with Prettier since 11 Nov (one statement or declaration per line).
- Start-up: `js/09-startup.js` fetches `data.json` with `cache:'no-cache'` (since 10 Nov: the browser revalidates every visit, so it's always current but only re-downloads when the file changed; before, a `?v=` timestamp and `no-store` forced the full 712 KB every time), copies every top-level key into a global of the same name, then calls `startApp()`, which draws every tab (`render()`, `renderTeams()`, `renderKarmas()`, `renderHeroes()`, `renderGear()`, `renderPatches()`, the simple pages, `initTierV2()` …). That drawing takes about 85 ms (measured 10 Nov). In the preview, Normal Dungeons draws and the 45 dungeon banners preload only when a Dungeons page is first opened (until 10 Nov the preview waited for all ~9 MB of banners before drawing anything).
- Pages are `.nav-item[data-page]`: heroes, tier, teams, karma, gear, patches (public) and familiars, titles, dungeons, trait, currency, cookbook, guides, tools, news, items, achievements (preview).
- **Preview gate:** `IS_PREVIEW` is true with `?tiers=new` or `?preview=1`; it also sets `html.pv`, and preview-only CSS goes in the "Preview-only fixes" block at the end of `css/site.css`, every rule prefixed `.pv ` (drop the prefix at launch). `PREVIEW_PAGES` lists the preview-only tabs; `applyPreviewGate()` hides them otherwise. The new tier list (`TIER_LIST_V2`) only renders in preview. The plain URL must not change until David approves launch. Any new tab goes into `PREVIEW_PAGES`.
- Item Database and Achievements load `assets/items/*.json` when opened.
- Test locally with `python3 -m http.server` (file:// fails). The checks are scripts since 11 Nov: `python3 tools/check_all.py` before every commit, and `python3 tools/public_diff.py` (the pixel check) for any change to the page files; see Checks and publishing below. Then look at the changed tab yourself.

## Code map (search for these names; each `js/` file says what it holds in its first line) · 10 Nov
| Area | Look for |
|---|---|
| Data loading | `fetch('data.json` near the end; `startApp()` |
| Character pages | `openCharacterProfile`, Skills tab layout comment, `Status effects box`, Review tab (`[[hero:…]]` rich text) |
| Skill levels | `SKILL_LEVEL_MULTIPLIERS` comment (value at a lower level) |
| Karma cards | `One Karma card, built from KARMA_DATA`; Ascension comment |
| Awakenings | `AWAKENINGS in data.json` comment |
| Builds and stat totals | `Gear builds and end-game stat totals`; the JS port of `tools/hero_stats.py` (keep identical) |
| Preview Back button | `navInit`, `navRecord`, `navShow` in `js/09-startup.js` (addresses `#page`, `#hero/Name/tab`) |
| Preview gear model | `/*GM-START*/` in `js/04-gear-builds.js` (port of `tools/team_gear.py`, keep identical); `gmMount`, `gmDraw`, `gmRun`, `gmShow`; data `GEAR_MODEL` |
| Patch notes | `Patch Notes (PATCH_NOTES` |
| Simple pages | `Simple pages: Familiars, Titles, Trait Dungeons`; Normal and Currency Dungeons comment |
| New tier list | `New tier list (TIER_LIST_V2)`; `v2Card`, `v2Chip`, `v2Role`, `v2AppliesChip`, `V2_ICONS`, Towers mode |
| Cookbook | `Cookbook (COOKBOOK` |
| Preview gate | `PREVIEW_PAGES`, `applyPreviewGate` |
| Damage calculator | `Damage calculator (Tools page`; `dcEnemyDef`, `dcWeak`, `dcTower`, `dcExtras` |
| Levelling calculator | `Levelling calculator (Tools page`; `lvSrc`, `lvMats`, `lvKarmaMats` |

## Data structure · 9 Nov
- `data.json`: **all guide content**, UTF-8, 1-space indent, `ensure_ascii=False`. Never rename keys. Key groups (full shapes in DATA_REFERENCE):
  - Heroes: `HEROES`, `CHARACTER_PROFILE_DATA`, `AWAKENINGS`, `HERO_BASE_STATS`, `HERO_STAT_MODEL`, `HERO_BUILDS`, `SKILL_LEVEL_MULTIPLIERS`, `SKILL_BUFF_LEVELS`.
  - Tiers and teams: `TIER_LIST_V2` (preview), `TOWER_TRIALS`, `TEAM_DATA`, `TIER_ORDER`, `TIER_COLORS`.
  - Karma: `KARMA_DATA`, `KARMA_ASCENSION`, `KARMA_LEVELLING`, `GENERIC_KARMA`.
  - Gear: `GEAR_DATA`, `GEAR_STATS`, `GEAR_UPGRADE`, `RUNES`.
  - Mechanics: `DEFENSE_MODEL`, `DAMAGE_CALC`, `STATUS_EFFECTS`, `LEVEL_COSTS` (formulas explained in [GAME_MATH.md](GAME_MATH.md)).
- `data/research.json` (10 Nov): research the page never shows (`DAMAGE_TESTS`, the training-dummy results behind GAME_MATH). Visitors don't download it; the validator checks it parses.
  - Other pages: `DUNGEONS`, `TRAIT_DUNGEONS`, `FAMILIARS`, `TITLES`, `COOKBOOK`, `GUIDES`, `PATCH_NOTES`.
  - Shared: `meta`, `schemaVersion`, `ARCHES`, `ARCH_COLORS`, `STATUS_ARCHETYPE`, `ROLE_ICONS`, `UI_ICONS`.
- `assets/`: images and source notes by topic (heroes, karma, gear, items, bosses, dungeons, tower, raid, roles, ui, upcoming …). Portraits are `.webp`; delete David's source PNGs after cutting.
- `tools/`: `validate_data.py` (run before every commit), `hero_stats.py` (base stats and builds; run without `--write` first), `skill_meta.py --write` (after editing skill text or Karma/gear sentences), `tools/image/` (codex card cutting: `codex_recolor.py <karma|familiars|heroes> <file.webp,...>` matches each card in David's screenshots in `assets/<kind>/*.png` to the existing card by shape and overwrites the named ones, using `detect.py` `cards()` and `final.py` `clean()`, which paints out the printed name; afterwards set `owned: true` in data.json and delete the PNGs).
- `docs/`: notes (this library) and the artifact sources and backups in `docs/testkit/`.

## GitHub and publishing · 2 Nov, updated 9 Nov
- Repo `AgandaurCZE/DragonSword-Awakening`, branch **`main` only** (no other branches unless David asks). `main` is protected against force-push and deletion; undo with `git revert`.
- Before work: `git pull`. Before pushing: fetch and rebase onto `origin/main`, keeping others' changes (David also uses ChatGPT/Codex on this repo; check its work for data damage, e.g. CRLF in `index.html`).
- Small commits with clear messages, ending with the trailer lines in the current session's instructions.
- Every push to `main` is checked and then published by the workflow "Check and publish" (11 Nov; details in Checks and publishing below): about 1–2 minutes, and nothing is published if a check fails. See the run with `gh run list -R AgandaurCZE/DragonSword-Awakening -L 3`. Report if the result can't be checked. (Until 11 Nov GitHub's own `pages build and deployment` published every push unchecked in 48 s to 6 min.)
- During and before ending a task: update `CHANGELOG.md` (newest first), [STATUS.md](STATUS.md), [DONE.md](DONE.md) for finished tasks, and DATA_REFERENCE for new or changed keys. (`docs/PROJECT_HANDOFF.txt` was retired on 9 Nov; its history is in CHANGELOG and git.)

## Checks and publishing · 11 Nov
The rules are AGENTS.md, "Golden rules". This is how the machinery works. Everything is a plain script in `tools/`; nothing is built or transformed.

| Script | What it proves | When it fails |
|---|---|---|
| `tools/check_all.py` | Runs everything below in order and prints one line per check. Run before every commit. `--no-browser` skips the browser part; `--base REF` compares cache numbers against another commit. | Fix the named check; don't commit. Exit 2 = passed but the browser part couldn't run. |
| `tools/validate_data.py` | Names, numbers and image paths in data.json make sense (existing rules). | The message names the entry. |
| `tools/check_shape.py` | Every key in `data.json` and `assets/items/*.json` is one recorded in `tools/data_shape.json`, at the right level, with the right type; no field that every sibling has is missing. | A typo: fix the data. A key you added on purpose: document it, then `--update` and read the printed differences. |
| `tools/hero_stats.py` (no `--write`) | `HERO_BUILDS` and `HERO_BASE_STATS` are what the optimiser gives from the current tables: it must print `No changes.` | Inspect the listed changes, then `--write`. |
| file rules (in `check_all.py`) | LF line endings; data.json in its format (UTF-8, 1-space indent); every `js/` and `css/` file is loaded by index.html, in order, with `?v=`. | The message says which file. |
| `node --check` | Every `js/*.js` parses. | Syntax error with line number. |
| cache numbers (in `check_all.py`) | A css/js file that changed since the last commit has a new `?v=` in index.html. | Give that file's link a new `?v=`. |
| `tools/check_site.py` | In a headless browser, on the public URL and `?tiers=new`, at 1400 px and 390 px: every menu page at both widths, all 20 hero profiles with their three tabs at 1400 px, and Ryza/Sion/Alex profiles at 390 px with no console error, script error or missing file; no preview page, `html.pv` or new tier list on the public URL; backup/restore download, review, cancellation, undo and failure recovery at both widths; `optBest` reproduces every stored build; `gmBuild` equals `tools/team_gear.py` on nine builds (`GM_CASES`, including A3 and A0 account cases). `--quick` = 3 heroes, no parity. | `FAIL` lines say the URL, width and what happened. |
| prettier (warning) | `js/` and `css/` are in the agreed format (`.prettierrc.json`). | `npx --yes prettier@3.9.10 --write js css`. |
| `tools/public_diff.py` (not part of `check_all.py`; golden rule 4) | Every public page and hero profile renders the same as in the last commit, pixel by pixel (42 views with `--quick`, 87 normally, 194 with `--preview`). A colour step of 1–2 of 255 is ignored and a differing view is rendered twice before it's reported. | It lists the views, how many pixels and where, and keeps before/after pictures. Acceptable only if it's exactly what David asked for. |

- **Needs:** Python 3, Node (for `node --check` and `npx prettier`), and for the browser checks `pip install playwright` plus a Chromium (`python3 -m playwright install chromium`) or an installed Chrome.
- **Publishing:** `.github/workflows/deploy.yml` ("Check and publish") runs on every push to `main`: it installs Playwright, runs `check_all.py`, and only if that passes uploads the committed files (`git archive HEAD`: nothing generated, nothing left out) and publishes them to GitHub Pages. The Pages source is set to "GitHub Actions" (David, 11 Nov; before that GitHub's Jekyll built the site straight from the branch, with no checks). A failed run publishes nothing: the live site stays on the last good commit. Publishing takes about 1–2 minutes from the push (1 min 14 s on the first good run). To publish again without a new commit: Actions tab → Check and publish → Run workflow.
- **Seeing the result:** the repository's Actions tab, or `gh run list -R AgandaurCZE/DragonSword-Awakening -L 3` and `gh run view <id> --log-failed`. The run page shows the full `check_all.py` output in its summary. If api.github.com is blocked by the environment, the normal `github.com/.../actions` run page may still be readable: match the run to the exact commit and read its visible Status and publish job. This fallback verified 92a4e43 on 11 Nov; signed-out log access remains limited.
- **Format:** `js/` and `css/` are formatted with Prettier 3.9.10 since 11 Nov (one statement or declaration per line). Long lines that remain in `js/` are template strings holding HTML; split one only while changing that code, and prove it with `public_diff.py --preview`.
- **When a check itself needs changing** (a new parity case, a new data file, a new kind of view): do it in the same commit as the change that needs it, say so in CHANGELOG, and never loosen a check to get a pass (golden rule 3).

## Open site tasks · updated 11 Nov
Game-side tasks and David's to-do list are in [STATUS.md](STATUS.md). Site work still open:
- **Launch** (David's approval needed): the checklist and the public text changes waiting for it are in [LAUNCH_CHANGES.md](../LAUNCH_CHANGES.md).
- **Tier list:** the awakening view button (agreed 10 Nov, see DECISIONS); boss ratings (`bosses.all` empty for every hero) and tower ratings, after Test 07; review texts David will redo later (10 Nov).
- **Builds:** the preview "Best Gear" box (done 10 Nov) replaces the old build boxes on the Build tab; still open: a role switch (on-field damage dealer or Breaker) and David's review of the box.
- **Karma:** a Karma level slider is now possible: levels 1–70 measured on two card types and the rule found (10 Nov, GAME_MATH 2.3; only breakthrough steps measured).
- **Dungeons:** banner art for Eroded Underground Cemetery and Residual Worm Cleanup Zone.
- **Guides:** the 8 categories are placeholder cards; content not written. News page is disabled and comes last.
- **Optional, only if David asks:** Test 01 application and gauge table in each hero profile (preview); a Super Armor gauge column in the damage calculator; a short line in the Status Effects box that physical statuses still build up under Super Armor and only control the enemy after Break (in the game's words, `assets/sources/help/notes.txt`); Karma exchange costs on the Karma tab (`assets/sources/exchange/prices.txt`); a small "Coming next" box on the Patch Notes page (`assets/sources/upcoming/notes.txt`).
- **Not worth doing yet:** quest tracker, interactive map.

### Handed over on 11 Nov (Claude's site review; any assistant can take these, all under the golden rules)
1. **Done 11 Nov (Claude): menu names.** Every menu button now has an `aria-label` on both URLs (invisible) and a tooltip in the preview; the visible phone look is still David's call. Original note: **Phone menu has no labels (preview and public).** Under 800 px `.nav-label{display:none}` leaves 15 bare icons with no tooltip and no name for screen readers. Safe on both URLs: give each `.nav-item` an `aria-label` and `title` from its label at start-up (no visible change). The look itself (labels under icons, or a slide-out menu) is David's call and belongs under `.pv`.
2. **Done 11 Nov (Claude):** under 800 px the preview card is 190 px tall and the name sits on its own line between the difficulty row and the rewards. Original note: **Normal Dungeon cards on phones (preview).** At 390 px the dungeon name (`.dng-name`) sits under the difficulty circles (`.dng-diff`) and the level chip (`.dng-lv`). Fix in the "Preview-only fixes" block of `css/site.css`.
3. **Done 11 Nov (Claude), preview only:** `.pv #profilePage` 22 px sides, 10 px on phones (arrives with the launch). Original note: **Hero profile has no side padding (public and preview).** `#profilePage` has 0 padding; the breadcrumb and headings touch the menu edge (other pages: 22 px, 10 px on phones). It changes the public look, so put it under `.pv` (it then arrives with the launch) or ask David.
4. **Share tags and a favicon** in `<head>`: description, `og:title`, `og:description`, `og:image`, `twitter:card`, `theme-color`, `<link rel="icon">`. Needs a 1200×630 picture (art task). Gives proper link cards for the launch post. Touches public `index.html` (nothing visible on the page): ask David.
5. **Done 11 Nov (Claude):** `README.md` at the root (no screenshot yet: that needs a new image file). Original note: **Root `README.md` for people** (what the guide is, the live link, a screenshot, the credit line from LAUNCH_CHANGES). GitHub currently shows `docs/README.md`, the assistants' index, to visitors. Keep `docs/README.md` as the library index.
6. **Done 11 Nov (Claude):** October moved to `docs/library/CHANGELOG_2026-10.md` (a file, not a new folder, under David's folder rule); linked from the top of CHANGELOG and from docs/README. Original note: **Archive old CHANGELOG months** (the file is over 130 KB): move everything before the current month into `docs/library/changelog/<year>-<month>.md`, link them from the top of `CHANGELOG.md` and from `docs/README.md`. Makes every new chat cheaper.
7. **Completed 11 Nov (Codex): Backup & restore** on the preview Tools page. Downloads all five agreed progress/settings keys; validates uploads and shows a review before exact replacement. Saves a recovery copy before writing; Undo survives reload. Malformed files are rejected without writes and unrelated preferences stay untouched. Browser tests cover download/upload, cancel, restore/undo and storage-write rollback at desktop/phone widths. Format and details: DATA_REFERENCE, "Visitor progress backups".
8. **Colour and spacing variables** (after launch): `css/site.css` has 416 different colours, 14 variables and 9 breakpoints. Replace repeated values with variables, a section at a time, each step proven with `public_diff.py --preview`.
9. **Completed 11 Nov (Codex): shared account data.** `tools/team_gear.py` derives signature ownership from `KARMA_DATA[].owned` and reads explicit levels for every hero from `GEAR_MODEL.account.awakenings`; the implicit A6 fallback is gone. The website keeps its maximum-build defaults. Validator coverage and nine Python/JS comparison cases guard the shared inputs. Update the account record, not Python constants, after David confirms a change.
10. **Public wording waiting for launch:** the "workbook" lines and the "Netlify" error message, listed in [LAUNCH_CHANGES.md](../LAUNCH_CHANGES.md).
11. **Decided, don't do (David, 11 Nov):** the icon, gear, Karma and portrait files keep their size and encoding (quality comes first; the safe saving was only about 0.3 MB); the raid glow stays as it is.

## Completed structure upgrade (Claude, 10 Nov; historical proposal retained below)
**Completed:** David approved A–E and all five shipped on 10 Nov. This table records the original proposal, not outstanding work.

Measured before the split on 10 Nov: `index.html` 323 KB in one file (CSS 99 KB, script 206 KB, lines up to 8,900 characters); `data.json` 712 KB (546 KB without indentation; GitHub Pages compresses it in transit); public first load ~2.7 MB, preview ~2.9 MB now that banners wait; start-up drawing ~85 ms.

| # | Change | Benefit | Downside |
|---|---|---|---|
| A | **Split `index.html`** into `index.html` (layout), `css/site.css` and a few `js/*.js` files by section (tier list, profiles, gear, dungeons, tools, start-up), loaded in the same order | Readable diffs; ChatGPT and Claude can edit one section without touching 8,900-character lines; far less risk of one bad edit breaking the whole page; the browser can cache CSS and JS between visits | One large one-off commit (proved invisible with the pixel check on every public tab); two new folders; every AI's notes change; after a deploy, visitors may hold the old CSS/JS for up to 10 min unless file names carry a version (`?v=`) |
| B | **Move research-only data out of `data.json`** (`DAMAGE_TESTS` 69 KB, `KARMA_LEVELLING`, `SKILL_BUFF_LEVELS`) into e.g. `data/research.json`, read only by the tools | Every visitor downloads ~10% less; `data.json` holds only what the page shows | Tools and the validator need the second file; AGENTS.md's "data.json holds all guide content" needs a line; one new folder |
| C | **Let browsers cache `data.json` safely**: fetch with `cache:'no-cache'` instead of a timestamp plus `no-store` | Return visits get a "not modified" reply instead of re-downloading 712 KB, and still always see the newest data | Touches the public page's loading (no visible change); needs David's OK under the public-page rule |
| D | **Gather source screenshots** (`assets/awakenings` 19 MB of PNGs, `assets/sources/help` 7.6 MB, `merc-crew`, `exchange`, `raid` and `tower` sources; the page reads none of them directly) into one `assets/sources/` folder | Repo tidier; clear split between site images and source material | Moving folders breaks links in the notes until updated; no speed gain for visitors (they never download them); folder rule: needs David's OK |
| E | **Artifact backups as a routine**: refresh `docs/testkit/` snapshots of the Test Kit and Team Planner at the end of every session that wrote to them | Their data can't be lost if an artifact breaks | A little extra work per session; no structural change |

Claude's recommendation: **C and E now** (tiny, safe), **B** next, **A** before launch (it makes the launch edits much easier), **D** only if David wants a tidier repo.

**David's answer (10 Nov evening): do all five (A–E). All five done the same evening** (details in CHANGELOG): C safe caching, E backups routine, B `data/research.json` (only `DAMAGE_TESTS` moved; `KARMA_LEVELLING` and `SKILL_BUFF_LEVELS` stay because the page will use them), D `assets/sources/`, A `css/` + `js/`.
