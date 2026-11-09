# The site: code, data structure, GitHub and open site tasks

Back to the library: [docs/README.md](../README.md). Rules: [AGENTS.md](../../AGENTS.md). Every data key in detail: [DATA_REFERENCE.md](../DATA_REFERENCE.md).

## How the site works
- One static page, `index.html` (about 2,150 lines: layout, CSS and all JavaScript; **no guide data**). Hosted on GitHub Pages from the root of `main`: https://agandaurcze.github.io/DragonSword-Awakening/. No build step, framework or server.
- Start-up: the script at the end of `index.html` fetches `data.json` (`?v=` timestamp, `no-store`), copies every top-level key into a global of the same name, then calls `startApp()`, which draws every tab (`render()`, `renderTeams()`, `renderKarmas()`, `renderHeroes()`, `renderGear()`, `renderPatches()`, the simple pages, `initTierV2()` …).
- Pages are `.nav-item[data-page]`: heroes, tier, teams, karma, gear, patches (public) and familiars, titles, dungeons, trait, currency, cookbook, guides, tools, news, items, achievements (preview).
- **Preview gate:** `IS_PREVIEW` is true with `?tiers=new` or `?preview=1`. `PREVIEW_PAGES` lists the preview-only tabs; `applyPreviewGate()` hides them otherwise. The new tier list (`TIER_LIST_V2`) only renders in preview. The plain URL must not change until David approves launch. Any new tab goes into `PREVIEW_PAGES`.
- Item Database and Achievements load `assets/items/*.json` when opened.
- Test locally with `python3 -m http.server` (file:// fails) and check both URLs with Playwright: no console errors, the changed tab looks right, the public page unchanged.

## Code map of `index.html` (search for these comments)
| Area | Look for |
|---|---|
| Data loading | `fetch('data.json` near the end; `startApp()` |
| Character pages | `openCharacterProfile`, Skills tab layout comment, `Status effects box`, Review tab (`[[hero:…]]` rich text) |
| Skill levels | `SKILL_LEVEL_MULTIPLIERS` comment (value at a lower level) |
| Karma cards | `One Karma card, built from KARMA_DATA`; Ascension comment |
| Awakenings | `AWAKENINGS in data.json` comment |
| Builds and stat totals | `Gear builds and end-game stat totals`; the JS port of `tools/hero_stats.py` (keep identical) |
| Patch notes | `Patch Notes (PATCH_NOTES` |
| Simple pages | `Simple pages: Familiars, Titles, Trait Dungeons`; Normal and Currency Dungeons comment |
| New tier list | `New tier list (TIER_LIST_V2)`; `v2Card`, `v2Chip`, `v2Role`, `v2AppliesChip`, `V2_ICONS`, Towers mode |
| Cookbook | `Cookbook (COOKBOOK` |
| Preview gate | `PREVIEW_PAGES`, `applyPreviewGate` |
| Damage calculator | `Damage calculator (Tools page`; `dcEnemyDef`, `dcWeak`, `dcTower`, `dcExtras` |
| Levelling calculator | `Levelling calculator (Tools page`; `lvSrc`, `lvMats`, `lvKarmaMats` |

## Data structure
- `data.json`: **all guide content**, UTF-8, 1-space indent, `ensure_ascii=False`. Never rename keys. Key groups (full shapes in DATA_REFERENCE):
  - Heroes: `HEROES`, `CHARACTER_PROFILE_DATA`, `AWAKENINGS`, `HERO_BASE_STATS`, `HERO_STAT_MODEL`, `HERO_BUILDS`, `SKILL_LEVEL_MULTIPLIERS`, `SKILL_BUFF_LEVELS`.
  - Tiers and teams: `TIER_LIST_V2` (preview), `TOWER_TRIALS`, `TEAM_DATA`, `TIER_ORDER`, `TIER_COLORS`.
  - Karma: `KARMA_DATA`, `KARMA_ASCENSION`, `KARMA_LEVELLING`, `GENERIC_KARMA`.
  - Gear: `GEAR_DATA`, `GEAR_STATS`, `GEAR_UPGRADE`, `RUNES`.
  - Mechanics: `DAMAGE_TESTS`, `DEFENSE_MODEL`, `DAMAGE_CALC`, `STATUS_EFFECTS`, `LEVEL_COSTS` (formulas explained in [GAME_MATH.md](GAME_MATH.md)).
  - Other pages: `DUNGEONS`, `TRAIT_DUNGEONS`, `FAMILIARS`, `TITLES`, `COOKBOOK`, `GUIDES`, `PATCH_NOTES`.
  - Shared: `meta`, `schemaVersion`, `ARCHES`, `ARCH_COLORS`, `STATUS_ARCHETYPE`, `ROLE_ICONS`, `UI_ICONS`.
- `assets/`: images and source notes by topic (heroes, karma, gear, items, bosses, dungeons, tower, raid, roles, ui, upcoming …). Portraits are `.webp`; delete David's source PNGs after cutting.
- `tools/`: `validate_data.py` (run before every commit), `hero_stats.py` (base stats and builds; run without `--write` first), `skill_meta.py --write` (after editing skill text or Karma/gear sentences), `tools/image/` (codex card cutting: `codex_recolor.py <karma|familiars|heroes> <file.webp,...>` matches each card in David's screenshots in `assets/<kind>/*.png` to the existing card by shape and overwrites the named ones, using `detect.py` `cards()` and `final.py` `clean()`, which paints out the printed name; afterwards set `owned: true` in data.json and delete the PNGs).
- `docs/`: notes (this library) and the artifact sources and backups in `docs/testkit/`.

## GitHub and publishing
- Repo `AgandaurCZE/DragonSword-Awakening`, branch **`main` only** (no other branches unless David asks). `main` is protected against force-push and deletion; undo with `git revert`.
- Before work: `git pull`. Before pushing: fetch and rebase onto `origin/main`, keeping others' changes (David also uses ChatGPT/Codex on this repo; check its work for data damage, e.g. CRLF in `index.html`).
- Small commits with clear messages, ending with the trailer lines in the current session's instructions.
- Every push to `main` deploys in about a minute (`pages build and deployment`; `gh run list -R AgandaurCZE/DragonSword-Awakening -L 1`). A failed deploy on GitHub's side was fixed twice by a new push. Report if deploy status can't be checked.
- During and before ending a task: update `CHANGELOG.md` (newest first), [STATUS.md](STATUS.md), [DONE.md](DONE.md) for finished tasks, and DATA_REFERENCE for new or changed keys. (`docs/PROJECT_HANDOFF.txt` was retired on 9 Nov; its history is in CHANGELOG and git.)

## Open site tasks
Game-side tasks and David's to-do list are in [STATUS.md](STATUS.md). Site work still open:
- **Launch** (David's approval needed): the checklist and the public text changes waiting for it are in [LAUNCH_CHANGES.md](../LAUNCH_CHANGES.md).
- **Tier list:** boss ratings (`bosses.all` empty for every hero) and tower ratings, after Test 07; review texts and verdicts to match the new ratings.
- **Builds:** use `DEFENSE_MODEL` in builds (the value of Armor Penetration and Defense Ignore substats); refresh `HERO_BASE_STATS` when the 9 estimated heroes are measured and rerun `tools/hero_stats.py`.
- **Karma:** a Karma level slider once Karma stats for levels 40–70 are measured (`KARMA_LEVELLING`); coloured signature Karma icons when David uploads them.
- **Dungeons:** banner art for Eroded Underground Cemetery and Residual Worm Cleanup Zone.
- **Guides:** the 8 categories are placeholder cards; content not written. News page is disabled and comes last.
- **Optional, only if David asks:** Test 01 application and gauge table in each hero profile (preview); a Super Armor gauge column in the damage calculator; a short line in the Status Effects box that physical statuses still build up under Super Armor and only control the enemy after Break (in the game's words, `assets/help/notes.txt`); Karma exchange costs on the Karma tab (`assets/exchange/prices.txt`); a small "Coming next" box on the Patch Notes page (`assets/upcoming/notes.txt`).
- **Not worth doing yet:** quest tracker, interactive map.
