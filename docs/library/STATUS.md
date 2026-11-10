# Status: where things stand (10 Nov 2026, evening)

Back to the library: [docs/README.md](../README.md). Update this file during and at the end of every session; it's the first thing the next chat reads after [WORKING_WITH_DAVID.md](WORKING_WITH_DAVID.md). Finished items move to [DONE.md](DONE.md); every change is in `CHANGELOG.md`. Site tasks are in [SITE.md](SITE.md). David's own to-do list: `docs/dragonsword_david_todo_by_priority.html` (updated 10 Nov).

## Where David's account is (10 Nov)
- **All 20 heroes Lv.70**, base stats measured (test 08) and in `HERO_BASE_STATS`.
- **All 16 masteries unlocked** (10 Nov). Reina, Roxy, Dana and Alex's masteries don't change combat numbers. Results: [TEST01_RESULTS.md](TEST01_RESULTS.md), "Mastery retests".
- **Awakenings** (can't be undone; all 77 levels he had are spent): **A6** Castella, Cerese, Charlotte, Dana, Johnny, Kalien, Kalsion, Ornette, Reina, Roxy, Ryza, Theresia; **A3** Aria, Astria, Eileen, Lute, Othello, Sion, Tarte; **A0** Alex. Charlotte had A1 before every earlier test. Results: [AWAKENING_TESTS.md](AWAKENING_TESTS.md).
- **Signature Karmas owned:** Theresia, Kalien, Kalsion, Othello, Cerese, Dana, Ornette, Charlotte, Ryza, Roxy. Ryza's and Ornette's levelled to Lv.70 (10 Nov).
- **Gear:** David is gearing the six main teams with the builds in [GAME_MATH.md](GAME_MATH.md) 4.3 and running the raid for Perfect runes (10 Nov evening).
- Titles 40 of 109; familiars 16 of 29 (all four Insects).

## Waiting on David (10 Nov)
1. **Orange Defense Ignore substat** (and Attack Power Up): any Orange piece that has it, with its +level. Both are still estimates, and Defense Ignore is on every piece of every main-team build.
2. **Perfect rune values**, above all a Perfect Crit Damage rune (it would need about 11–13% to beat a 6.80% Crit Rate rune).
3. **Hunt boss weaknesses on Nightmare (Test 07)**; the boss ratings wait on it.
4. Alex's awakenings, tested alone, when materials allow. A team round **with gear** once the main teams are geared.

## Next for Claude (10 Nov)
- **Awakening view of the tier list** (agreed 10 Nov): a button showing ratings with all awakenings, rated at A6 with the signature where the hero needs it; the purple signature card stays in that view; Needs A and Late bloomer leave the main view (done). Ratings to be debated with David first (Charlotte S in groups proposed). Evidence: [AWAKENING_TESTS.md](AWAKENING_TESTS.md) and the team round in [TEAM_TESTS.md](TEAM_TESTS.md).
- **Preview builds from the full model**: port `tools/team_gear.py` / `endgame_gear.py` to the page behind `?tiers=new` (Python and JS kept identical). Agreed defaults (David, 9–10 Nov): toughest boss (Defense 1825) with a Training Ogre (1000) switch; set effects counted as always on; must-have substats first (Defense Ignore, Attack Power Up), then a slot labelled "team status Additional Attack Power"; physical-status AAP is worth twice elemental; role switch (on-field damage dealer or Breaker); 5 Crit Rate runes once Perfect values are settled.
- **Karma level slider** on the Karma page is now possible (rule in GAME_MATH 2.3; only breakthrough steps measured).
- The repository structure proposal (10 Nov) waits on David's answer: see SITE.md.

## Open items that can wait
- **Boss and Tower ratings**: every hero's `bosses.all` is still empty. After Test 07. Debate first.
- **Team Planner**: every main team and its alternatives are marked Works except Ice Prison (No); team 9 (Nightmare support, with Alex) was deleted. Only the six main teams were retested after awakenings; David doesn't expect the alternatives to beat them (10 Nov), so their retest can wait.
- **Signature Karma priorities** ([TEAM_TESTS.md](TEAM_TESTS.md)): update with the post-awakening gains (Charlotte's signature +16%, Kalsion's +10%, Theresia's and Roxy's together +27%).
- **Gear values still estimated** (note the +0 main stat of any drop before disassembling): Legs Attack Power Up, Chest Max HP Up and Legs Defense Up, Max HP Up and Defense Up on Helmet, Gloves and Boots. Sources: `GEAR_STATS.valueSources`.
- Crit Rate awakenings were rated before the 30 Oct gear rebuild; re-check whether they're worth more now.
- Hero review texts on the profiles still describe the old ratings; David will redo them later (10 Nov), so leave them.
- Test 06 inside the Towers of Trials; new enemies, Quest items and World Bosses as David meets them.
- Coloured signature Karma icons (Ryza's and Roxy's cards have no art); banner art for Eroded Underground Cemetery and Residual Worm Cleanup Zone; Hunt rating rewards and Fame stages above 3.
