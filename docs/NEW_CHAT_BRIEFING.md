# Briefing for a new Claude chat (written by Claude, 4 Nov 2026)

**Superseded in part (9 Nov 2026): start at the library index [docs/README.md](README.md), then [library/WORKING_WITH_DAVID.md](library/WORKING_WITH_DAVID.md) and [library/STATUS.md](library/STATUS.md). This file stays for the project overview, the tools outside the repo and the measured mechanics; its "Open / next steps" section is out of date.**

Paste this whole file into the first message of a new chat. It replaces the memory of the old chat.

## Who you're working with
- **David** (UK English, Prague time). He runs a fan guide for **DragonSword: Awakening** (HOUND13, PC/Steam) and plays the game daily, recording data for the guide.
- He checks claims. Never state anything the data can't back up, and never invent numbers.
- How he likes to work:
  - "Just make edits, don't ask permission" for anything he has asked for.
  - For changes he didn't ask for, ask first or flag them.
  - Don't search the web unless he asks.
  - Tiers are never set by formula: agree them with him.
- Tone that works: direct, warm, a colleague. Short replies; tables when comparing. Say plainly what's done, what isn't, and what you need from him. Admit mistakes simply.
- He watches his Claude usage closely (weekly limit, resets Wednesday 08:00). Be efficient: batch work, avoid re-reading big files, and don't spawn agents.
- He also uses ChatGPT/Codex on the same repo, mostly for artwork and some UI. Check its work for data damage. It once converted `index.html` to CRLF line endings.

## The project
- **Site:** https://agandaurcze.github.io/DragonSword-Awakening/ (GitHub Pages, repo `AgandaurCZE/DragonSword-Awakening`, branch `main`). Every push goes live in about a minute.
- **Clone:** `/home/claude/dragonsword-awakening`. Attach the repo with the add_repo tool if the new session doesn't have it.
- **`AGENTS.md`** has the rules, a key index and the workflow. `docs/DATA_REFERENCE.md` is the full manual: open only the section a task needs. `docs/PROJECT_HANDOFF.txt` and `CHANGELOG.md` record everything done, newest notes at the end and top respectively.
- **Rules from AGENTS.md:**
  - Work on `main` only.
  - Before work: `git pull`. Before push: `git fetch` + rebase.
  - Never force-push.
  - Run `python3 tools/validate_data.py` before each commit.
  - Check the page with a local server (`python3 -m http.server`) and Playwright (installed) for console errors.
  - Keep `index.html` line endings as LF.
  - Update `CHANGELOG.md`, `AGENTS.md` and `docs/PROJECT_HANDOFF.txt` before finishing.
- **Preview gate:** all new work is visible only with `?tiers=new` in the URL (`PREVIEW_PAGES`, `applyPreviewGate()`). The public page must not change until David says to launch.
- **Commit trailer:**
  ```
  Co-Authored-By: Claude <noreply@anthropic.com>
  Claude-Session: <the new session's link>
  ```

## Tools that live outside the repo
- **Test Kit** (Claude artifact, David's measurement notebook): https://claude.ai/artifact/UefeH47GdLPfBV8kA8zdyt
  - Its results are in the artifact database, collection `results`, field `testId`: `apply`, `buffs`, `gear`, `defign`, `lvlcost`, `enemydef`. Read them with the ArtifactData tool (query with `out_dir` to save files).
  - Tests:
    - 01: status application.
    - 02: skill buffs by level.
    - 03: gear main-stat rows. Has a coverage panel showing which main stats are saved per slot and rarity.
    - 04: Defense Ignore and Armor Penetration (done 4 Nov 2026; off the page, entries kept).
    - 05: level-up cost, one step at a time (Hero, Karma, Gear, Skill, breakthroughs).
    - 06: Enemy Defense: one clean Wind Sword hit gives an enemy's Defense. Has a green/red table by enemy type, which David will extend with bosses.
  - A backup copy of the page is in the repo at `docs/testkit/dragonsword-test-kit.html`.
  - To change it, edit that file and publish to the same artifact URL (Artifact tool, `url` = the link above). A new chat must read the artifact first.
- **Image tools** (`tools/image/`), used for cutting colour Codex cards out of David's screenshots:
  - `codex_recolor.py <karma|familiars|heroes> <file.webp,...>` matches each card in `assets/<kind>/*.png` to the existing card by shape and overwrites the named ones.
  - Uses `detect.py` (`cards()`) and `final.py` (`clean()`: paints out the printed name).
  - Afterwards set `owned:true` in data.json and delete the PNGs.

## What's done (preview unless noted)
- **Tier lists:**
  - New tier list v2 with Overall, Bosses and Towers modes. Bosses: 5 Hunt bosses including Ghoul Greed, plus Raid Gauron with a red glow and a dragon fade.
  - Hunt bosses have a Rating rewards panel. Gauron has fights, strategy and rewards panels.
  - Hero ratings: all 15 owned heroes agreed, rated on base kits (A0, no signature, no Mastery). Dana, Alex, Theresia, Tarte and Astria wait until he owns them.
- **Gear page:**
  - Upgrade calculator: Gold is worked out per item (gear items: Mana Shard 300, Crystal 700, Ore 2,000, Raw Mana Stone 5,000 Gold).
  - Disassemble returns: 80% of EXP spent plus the piece's base materials, paid out in the largest materials; leftovers under 200 EXP are lost; pieces disassembled together are pooled.
  - Runes box, with type icons.
- **Other pages:**
  - Dungeons (Normal, Trait, Currency, including the new Eroded Underground Cemetery, still without banner art).
  - Familiars, Titles (25/109), Cookbook.
  - Guides: 8 categories of placeholder cards.
  - Tools (damage calculator with an enemy type + level picker; levelling calculator) and News (disabled).
  - Item Database (tabs Materials, Ingredients, Important, Quest; Quest has no data yet).
  - Achievements tracker (per-browser ticks).
- **Measured mechanics** (see `DAMAGE_TESTS`, `DEFENSE_MODEL`, `LEVEL_COSTS`, `SKILL_BUFF_LEVELS`, `GEAR_UPGRADE`):
  - **Damage:** ∝ Attack × skill %; crit ×(1 + Crit Damage); status hit bonuses add.
  - **Damage-over-time ticks:** 50/75/100% of Attack at 1/2/3 stacks.
  - **Towers:** +400% for the tower's own status, +100% for DoT statuses.
  - **Defence:** damage ∝ 1000 / (1000 + Defense × (1 − Defense Ignore) − Armor Penetration). K = 1,000 is a constant. The Training Ogre has 1,000 Defense and World Boss Barpedin about 1,197.
  - **Level-up Gold is per item:**
    - Hero texts: 200 / 650 / 1,800.
    - Arcanas: 150 / 400 / 1,300 / 3,000.
    - Gear items: as listed above.
  - **Level-up EXP:** Hero and Karma EXP measured to level 50 (the same from level 3).
  - **Skill costs:** the same for every hero.
  - **Breakthrough Gold:**

    | Level | Hero | Karma |
    |---|---|---|
    | 20 | 4,000 | 5,000 |
    | 30 | 6,400 | 10,000 |
    | 40 | 16,000 | 20,000 |
    | 50 | 32,000 | 50,000 |

## Open / next steps
- **From David:**
  - Fame stage rewards and the "Name of the Strong" icon.
  - Quest items.
  - The Guides icon (Codex book).
- **For Claude:**
  - Use `DEFENSE_MODEL` in builds (value of Armor Penetration and Defense Ignore substats).
  - Hero/Karma levelling calculator (Tools page), once EXP data is complete.
  - Profile/Review text updates once all heroes are rated.
  - Write the guide content.
- **Not worth doing yet:** quest tracker and interactive map. News comes last.

## Waiting for launch
Changes to public pages are listed in `docs/LAUNCH_CHANGES.md`.

## Story status (5 Nov 2026)
David finished the main story (chapter 8). All Hunt bosses, Raids and Currency Dungeons are discovered. Open: banner art for Eroded Underground Cemetery and Residual Worm Cleanup Zone (next week, via ChatGPT); Hunt rating rewards, which differ a little per boss (David shares them later). David's plan: max his main team, run the new Currency Dungeon, do the remaining Hero Quests and test those heroes, then choose the next priority together. Keep marking titles he reports as obtained in `TITLES`.
