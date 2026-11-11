# Status: where things stand (11 Nov 2026, night)

Back to the library: [docs/README.md](../README.md). Update this file during and at the end of every session; it's the first thing the next chat reads after [WORKING_WITH_DAVID.md](WORKING_WITH_DAVID.md). Finished items move to [DONE.md](DONE.md); every change is in `CHANGELOG.md`. Site tasks are in [SITE.md](SITE.md). David's own to-do list: `docs/dragonsword_david_todo_by_priority.html` (updated 10 Nov).

## Where David's account is (10 Nov)
- **All 20 heroes Lv.70**, base stats measured (test 08) and in `HERO_BASE_STATS`.
- **All 16 masteries unlocked** (10 Nov). Reina, Roxy, Dana and Alex's masteries don't change combat numbers. Results: [TEST01_RESULTS.md](TEST01_RESULTS.md), "Mastery retests".
- **Awakenings** (can't be undone; all 77 levels he had are spent): **A6** Castella, Cerese, Charlotte, Dana, Johnny, Kalien, Kalsion, Ornette, Reina, Roxy, Ryza, Theresia; **A3** Aria, Astria, Eileen, Lute, Othello, Sion, Tarte; **A0** Alex. Charlotte had A1 before every earlier test. Results: [AWAKENING_TESTS.md](AWAKENING_TESTS.md).
- **Signature Karmas owned:** Theresia, Kalien, Kalsion, Othello, Cerese, Dana, Ornette, Charlotte, Ryza, Roxy. Ryza's and Ornette's levelled to Lv.70 (10 Nov).
- **Gear:** David is gearing the six main teams with the builds in [GAME_MATH.md](GAME_MATH.md) 4.3 and running the raid for Perfect runes (10 Nov evening).
- Karmas owned (colour art): 43 of 53 (10 Nov).
- Titles 41 of 109; familiars 16 of 29 (all four Insects).

## Waiting on David (10 Nov)
1. **Perfect rune tops still unconfirmed:** Crit Rate 8.5%, Defense 100 and Max HP 1500 are predicted, not measured. Attack 140 and Crit Damage 14% are already seen; do not ask for those again. Other current readings are in `RUNES.seen`. Orange +15 substats were completed on 10 Nov.
3. **Hunt boss weaknesses on Nightmare (Test 07)**; the boss ratings wait on it.
4. Alex's awakenings, tested alone, when materials allow. A team round **with gear** once the main teams are geared.

## Site upgrade, 11 Nov (done; rules in AGENTS.md "Golden rules")
- David asked for the structural upgrades to be done at once and written down as the most important rules. Done: one command for every check (`python3 tools/check_all.py`: data rules, data shape, stored builds, file rules, JS syntax, cache numbers, the site in a browser, JS ports against Python), the pixel check as a tool (`tools/public_diff.py`), `js/` and `css/` reformatted (layout only, proven identical), LF line endings enforced, and a GitHub workflow that runs the checks on every push and publishes the site only when they pass. Details: [SITE.md](SITE.md) "Checks and publishing"; every step in CHANGELOG (11 Nov, parts 1–3).
- **Left for any assistant:** the list "Handed over on 11 Nov" in [SITE.md](SITE.md) (phone menu labels, dungeon cards on phones, profile padding, share tags and favicon, a root README, CHANGELOG archive, export of ticks, colour variables, launch wording).
- David's decisions the same night: icon, gear, Karma and portrait files keep their size (quality first); the raid glow stays; notes, Test Kit and planner files stay published with the site.

## Codex familiarisation review (11 Nov)
- Reviewed the latest fetched `da91cfa` and all 18 Markdown files, plus the check/publish machinery and relevant data/code. Full `python3 tools/check_all.py`: ALL CHECKS PASSED, browser and parity included. GitHub Actions API returned Forbidden; remote deployment not verified.
- **David approved tasks #9 and #7 (11 Nov):** #9 uses shared account data for tools while keeping website maximum-build defaults; #7 uses exact settings restore with review and recovery. Implement #9 first, then #7, under the golden rules. #8 remains after launch; no other handover item started.
- **Note reconciliation completed 11 Nov:** current references now mark all 20 base stats, five discovered Currency Dungeons, measured Orange DI/APU substats and Ryza/Roxy signature art as complete. Historical test conditions and changelog entries remain dated history.

## Next for Claude (10 Nov)
- **Awakening view of the tier list** (agreed 10 Nov): a button showing ratings with all awakenings, rated at A6 with the signature where the hero needs it; the purple signature card stays in that view; Needs A and Late bloomer leave the main view (done). Ratings to be debated with David first (Charlotte S in groups proposed). Evidence: [AWAKENING_TESTS.md](AWAKENING_TESTS.md) and the team round in [TEAM_TESTS.md](TEAM_TESTS.md).
- **Preview "Best Gear" box on the hero Build tab: built 10 Nov** (port of `tools/team_gear.py`, identical results for the 13 main-team heroes; `GEAR_MODEL` in DATA_REFERENCE). Controls: enemy (toughest boss 1825 / Training Ogre), physical statuses half or all the time, awakenings A0–A6, signature on/off, Perfect runes best mix or none, status ticks (main-team defaults). Since late 10 Nov a ranked list of the six best set pairs with % of the best (David's design request) and a working Back button in the preview. Each row shows the strongest skill's total damage (11 Nov; formula checked on Ryza and Sion). **Next:** David's look and feedback; still not done from the 9–10 Nov wish list: a role switch (on-field damage dealer or Breaker) and labelling substats as "must-have" vs "team status AAP".
- **Karma level slider** on the Karma page is now possible (rule in GAME_MATH 2.3; only breakthrough steps measured).
- The repository restructure (all five steps David approved on 10 Nov) is done; see SITE.md and CHANGELOG. New layout: `index.html` + `css/site.css` + `js/01…09`, `data/research.json`, `assets/sources/`. The 11 Nov upgrade added the checks and the publish workflow (section above).

## Open items that can wait
- **Boss and Tower ratings**: every hero's `bosses.all` is still empty. After Test 07. Debate first.
- **Team Planner**: every main team and its alternatives are marked Works except Ice Prison (No); team 9 (Nightmare support, with Alex) was deleted. Only the six main teams were retested after awakenings; David doesn't expect the alternatives to beat them (10 Nov), so their retest can wait.
- **Signature Karma priorities** ([TEAM_TESTS.md](TEAM_TESTS.md)): update with the post-awakening gains (Charlotte's signature +16%, Kalsion's +10%, Theresia's and Roxy's together +27%).
- **Gear main-stat readings still useful:** Chest Max HP Up, Legs Defense Up, and Max HP Up / Defense Up on Helmet, Gloves and Boots. Legs Attack Power Up at +15 is measured (30.68, 10 Nov); only its lower-level scaling remains derived. Orange +15 substats, including Defense Ignore and Attack Power Up, are measured and complete. See `GEAR_STATS.valueSources`.
- Crit Rate awakenings were rated before the 30 Oct gear rebuild; re-check whether they're worth more now.
- Hero review texts on the profiles still describe the old ratings; David will redo them later (10 Nov), so leave them.
- Test 06 inside the Towers of Trials; new enemies, Quest items and World Bosses as David meets them.
- Banner art for Eroded Underground Cemetery and Residual Worm Cleanup Zone; Hunt rating rewards and Fame stages above 3.
