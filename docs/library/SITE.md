# The site: code, data structure, GitHub and open site tasks

Back to the library: [docs/README.md](../README.md). Rules: [AGENTS.md](../../AGENTS.md). Every data key in detail: [DATA_REFERENCE.md](../DATA_REFERENCE.md).

## How the site works · updated 10 Nov
- One static page in three parts (split on 10 Nov): `index.html` (layout, ~18 KB), `css/site.css` (every style, ~100 KB; asset paths start with `../`) and the script in nine files loaded in order: `01-core` (globals, `$`, `absUrl`), `02-teams-karma`, `03-profile`, `04-gear-builds` (JS port of `tools/hero_stats.py`), `05-tierlist-heroes-patches`, `06-dungeons`, `07-tierlist-v2-cookbook` (sets `IS_PREVIEW`), `08-items-tools-guides`, `09-startup` (runs last). **No guide data** in any of them. The files share one global scope, so code that runs at load time may only use what earlier files define; everything else runs after the last file. **Bump `?v=` in `index.html` for any CSS or JS file you change** (GitHub Pages lets browsers keep a copy for about 10 minutes). **Image paths written into CSS variables from the script must go through `absUrl()`**, or the browser resolves them against `css/`. Hosted on GitHub Pages from the root of `main`: https://agandaurcze.github.io/DragonSword-Awakening/. No build step, framework or server.
- Start-up: `js/09-startup.js` fetches `data.json` with `cache:'no-cache'` (since 10 Nov: the browser revalidates every visit, so it's always current but only re-downloads when the file changed; before, a `?v=` timestamp and `no-store` forced the full 712 KB every time), copies every top-level key into a global of the same name, then calls `startApp()`, which draws every tab (`render()`, `renderTeams()`, `renderKarmas()`, `renderHeroes()`, `renderGear()`, `renderPatches()`, the simple pages, `initTierV2()` …). That drawing takes about 85 ms (measured 10 Nov). In the preview, Normal Dungeons draws and the 45 dungeon banners preload only when a Dungeons page is first opened (until 10 Nov the preview waited for all ~9 MB of banners before drawing anything).
- Pages are `.nav-item[data-page]`: heroes, tier, teams, karma, gear, patches (public) and familiars, titles, dungeons, trait, currency, cookbook, guides, tools, news, items, achievements (preview).
- **Preview gate:** `IS_PREVIEW` is true with `?tiers=new` or `?preview=1`; it also sets `html.pv`, and preview-only CSS goes in the "Preview-only fixes" block at the end of `css/site.css`, every rule prefixed `.pv ` (drop the prefix at launch). `PREVIEW_PAGES` lists the preview-only tabs; `applyPreviewGate()` hides them otherwise. The new tier list (`TIER_LIST_V2`) only renders in preview. The plain URL must not change until David approves launch. Any new tab goes into `PREVIEW_PAGES`.
- Item Database and Achievements load `assets/items/*.json` when opened.
- Test locally with `python3 -m http.server` (file:// fails) and check both URLs with Playwright: no console errors, the changed tab looks right, the public page unchanged. The safest public check: screenshot every public tab at 1400 px and 390 px before and after and compare pixels (how it was done on 10 Nov).

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
- Every push to `main` deploys in about a minute (`pages build and deployment`; `gh run list -R AgandaurCZE/DragonSword-Awakening -L 1`). A failed deploy on GitHub's side was fixed twice by a new push. Deploy time varies on GitHub's side (10 Nov: 48 s to 6 min for similar pushes); it doesn't track repo size. Report if deploy status can't be checked.
- During and before ending a task: update `CHANGELOG.md` (newest first), [STATUS.md](STATUS.md), [DONE.md](DONE.md) for finished tasks, and DATA_REFERENCE for new or changed keys. (`docs/PROJECT_HANDOFF.txt` was retired on 9 Nov; its history is in CHANGELOG and git.)

## Open site tasks · updated 10 Nov
Game-side tasks and David's to-do list are in [STATUS.md](STATUS.md). Site work still open:
- **Launch** (David's approval needed): the checklist and the public text changes waiting for it are in [LAUNCH_CHANGES.md](../LAUNCH_CHANGES.md).
- **Tier list:** the awakening view button (agreed 10 Nov, see DECISIONS); boss ratings (`bosses.all` empty for every hero) and tower ratings, after Test 07; review texts David will redo later (10 Nov).
- **Builds:** the preview "Best Gear" box (done 10 Nov) replaces the old build boxes on the Build tab; still open: a role switch (on-field damage dealer or Breaker) and David's review of the box.
- **Karma:** a Karma level slider is now possible: levels 1–70 measured on two card types and the rule found (10 Nov, GAME_MATH 2.3; only breakthrough steps measured). Coloured signature Karma icons when David uploads them.
- **Dungeons:** banner art for Eroded Underground Cemetery and Residual Worm Cleanup Zone.
- **Guides:** the 8 categories are placeholder cards; content not written. News page is disabled and comes last.
- **Optional, only if David asks:** Test 01 application and gauge table in each hero profile (preview); a Super Armor gauge column in the damage calculator; a short line in the Status Effects box that physical statuses still build up under Super Armor and only control the enemy after Break (in the game's words, `assets/sources/help/notes.txt`); Karma exchange costs on the Karma tab (`assets/sources/exchange/prices.txt`); a small "Coming next" box on the Patch Notes page (`assets/sources/upcoming/notes.txt`).
- **Not worth doing yet:** quest tracker, interactive map.

## Structure proposal (Claude, 10 Nov; waiting on David's choice)
Measured on 10 Nov: `index.html` 323 KB in one file (CSS 99 KB, script 206 KB, lines up to 8,900 characters); `data.json` 712 KB (546 KB without indentation; GitHub Pages compresses it in transit); public first load ~2.7 MB, preview ~2.9 MB now that banners wait; start-up drawing ~85 ms.

| # | Change | Benefit | Downside |
|---|---|---|---|
| A | **Split `index.html`** into `index.html` (layout), `css/site.css` and a few `js/*.js` files by section (tier list, profiles, gear, dungeons, tools, start-up), loaded in the same order | Readable diffs; ChatGPT and Claude can edit one section without touching 8,900-character lines; far less risk of one bad edit breaking the whole page; the browser can cache CSS and JS between visits | One large one-off commit (proved invisible with the pixel check on every public tab); two new folders; every AI's notes change; after a deploy, visitors may hold the old CSS/JS for up to 10 min unless file names carry a version (`?v=`) |
| B | **Move research-only data out of `data.json`** (`DAMAGE_TESTS` 69 KB, `KARMA_LEVELLING`, `SKILL_BUFF_LEVELS`) into e.g. `data/research.json`, read only by the tools | Every visitor downloads ~10% less; `data.json` holds only what the page shows | Tools and the validator need the second file; AGENTS.md's "data.json holds all guide content" needs a line; one new folder |
| C | **Let browsers cache `data.json` safely**: fetch with `cache:'no-cache'` instead of a timestamp plus `no-store` | Return visits get a "not modified" reply instead of re-downloading 712 KB, and still always see the newest data | Touches the public page's loading (no visible change); needs David's OK under the public-page rule |
| D | **Gather source screenshots** (`assets/awakenings` 19 MB of PNGs, `assets/sources/help` 7.6 MB, `merc-crew`, `exchange`, `raid` and `tower` sources; the page reads none of them directly) into one `assets/sources/` folder | Repo tidier; clear split between site images and source material | Moving folders breaks links in the notes until updated; no speed gain for visitors (they never download them); folder rule: needs David's OK |
| E | **Artifact backups as a routine**: refresh `docs/testkit/` snapshots of the Test Kit and Team Planner at the end of every session that wrote to them | Their data can't be lost if an artifact breaks | A little extra work per session; no structural change |

Claude's recommendation: **C and E now** (tiny, safe), **B** next, **A** before launch (it makes the launch edits much easier), **D** only if David wants a tidier repo.

**David's answer (10 Nov evening): do all five (A–E). All five done the same evening** (details in CHANGELOG): C safe caching, E backups routine, B `data/research.json` (only `DAMAGE_TESTS` moved; `KARMA_LEVELLING` and `SKILL_BUFF_LEVELS` stay because the page will use them), D `assets/sources/`, A `css/` + `js/`.
