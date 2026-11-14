# Testing: the Test Kit and how David measures

Back to the library: [docs/README.md](../README.md). Results: [TEST01_RESULTS.md](TEST01_RESULTS.md), [TEAM_TESTS.md](TEAM_TESTS.md). Measured mechanics in the data: `DAMAGE_TESTS`, `DEFENSE_MODEL` (see [DATA_REFERENCE.md](../DATA_REFERENCE.md)).

## The Test Kit artifact · updated 10 Nov
- Live page: https://claude.ai/artifact/UefeH47GdLPfBV8kA8zdyt (David's measurement notebook; version 34, 13 Nov). Sections: Before awakenings (08, 09; both done), Most useful (01, 07), When you can (02, 03, 06), and Already answered. Source: `docs/testkit/dragonsword-test-kit.html`. To change it, edit the source and publish to the same URL; a new chat must read the artifact first.
- Storage: collection `results`; each entry has `testId`, `test`, `savedAt`, `inputs{}`, `summary`. Read with ArtifactData `query` (`where testId == …`, `out_dir` to save files). Writes to an existing document need `if_version`. New entry ids: `<testId>-<timestamp>`, e.g. `apply-1794430012000`.

| Test | `testId` | Status |
|---|---|---|
| 01 Status application per skill | `apply` | Redo complete for all 20 heroes (8 Nov). Mastery retests (10 Nov) and awakening tests A1, A3, A6 (10 Nov) saved as more `apply` entries; their summary ends "Mastery retest" or "Awakening A1/A3/A6 test". Results: [TEST01_RESULTS.md](TEST01_RESULTS.md), [AWAKENING_TESTS.md](AWAKENING_TESTS.md). |
| 02 Skill buffs by level | `buffs` | Complete since 9 Nov: every scaling buff on a levellable skill, except Alex's two hostility values (no damage effect). In `SKILL_BUFF_LEVELS`. |
| 03 Gear upgrade row | `gear` | **Done 13 Nov.** 117 rows; every unfilled main stat follows from them (GAME_MATH 2.4). Add a row only if a number in the game differs from the site. |
| 04 Defense Ignore and Armor Penetration | `defign` | Done 4 Nov; off the page, entries kept. |
| 05 Level-up cost | `lvlcost` | Answered; moved to Already answered. |
| 06 Enemy Defense | `enemydef` | Ongoing: new enemies as David meets them; tower floors open. |
| 07 Hunt boss weakness (Nightmare and up) | `huntweak` | The weak elements of all six Hunt bosses are known (David, 12 Nov; GAME_MATH 3.3), found outside the Test Kit. Build-up resistances were read on Furcas only. |
| 08 Hero stats at level 70 | `stats70` | Done 9 Nov for all 20 heroes, in `HERO_BASE_STATS`. The page takes titles off (Attack −145, Max HP −1,575, Defense ÷ 1.053 − 30) and names the matching profile. Copy results into `HERO_BASE_STATS`. |
| 09 Signature Karma against a normal Karma | `sigtest` | Done 9–10 Nov for every owned signature (results in TEAM_TESTS). Fields: hero, normal Karma, Karma level (compare with a normal Karma of the same level and archetype; Ryza's and Ornette's signatures are Lv.70 since 10 Nov, the rest Lv.1), target, team, damage with each (several runs comma-separated); shows the average gain. Copy results into the Team Planner `sigs` notes. |

## Test 01 conventions (Lv.70 redo) · 8 Nov
- Enemy: **Training Ogre**, Lv.90 boss dummy, Super Armor **not broken**. No gear, no Karma, no awakenings, no masteries. The redo was recorded as Lv.70, but only 11 heroes were Lv.70 on 9 Nov (see STATUS); the other 9 were tested below 70. Application and gauge don't depend on hero level (David, 8 Nov), so their numbers stand. Break times stand too: hero level doesn't change Super Armor gauge damage (David, 9 Nov: Castella removed the same gauge at Lv.20 as at Lv.70).
- One entry per skill and status: `inputs{hero, skill, st, enemy, lv:"90", broken:"Not broken", presses:"1", stacks, note}`.
- `stacks` = fraction of one stack the skill adds (0.25 = a quarter).
- **Super Armor gauge** is stored as `st: "Break (Super Armor)"`, `stacks` = fraction of the gauge (0.12 = 12%), read with David's % overlay.
- **All-out break time**: skill `Full rotation, going all out (time to break)`, `stacks: "1"`, the seconds in the note. Castella's 18 s has no separate entry.
- Skill names follow the codex (`CHARACTER_PROFILE_DATA[hero].skills[].skill`), with the case in brackets: Skill, Ultimate, Special A/B, whole basic combo, jump attack, dash attack, mode names, stack counts ("at 2 Bleed stacks"), per charge, etc.
- David's method for small values: reach 0.25 of a stack, divide by the number of sequences needed, round **down** to 2 decimals (e.g. Kalien's basic 0.01, really 0.015625). Notes say so where it applies.
- Application and gauge don't depend on hero or skill level (David, 8 Nov).
- Grabs often need stacks: Roxy's Bleeding Grab applies Bleed only at 1 stack; Johnny, Roxy and Ryza gain their physical status at 2 stacks; Ryza's Thunder Grab gives Knockdown at both.

## Team tests (Team Planner) · 9–10 Nov
- Damage in 1 minute on the Training Ogre. The 9–10 Nov runs: every hero in those teams Lv.70, no gear, normal Lv.1 Karmas (signatures only where stated). The 10 Nov team round repeats the six main teams with masteries and awakenings.
- Results go in the Team Planner `teams[].davidNote` with the date and conditions. See [TEAM_TESTS.md](TEAM_TESTS.md).
- Single runs vary by up to about 70k on hard teams: don't explain smaller gaps from one run each, and check what changed between two runs before comparing.

## Recording rule · 9 Nov
When David sends numbers: save them in the artifact straight away, then CHANGELOG (newest first) and the matching library file. Commit and push.
