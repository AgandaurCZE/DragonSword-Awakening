# Testing: the Test Kit and how David measures

Back to the library: [docs/README.md](../README.md). Results: [TEST01_RESULTS.md](TEST01_RESULTS.md), [TEAM_TESTS.md](TEAM_TESTS.md). Measured mechanics in the data: `DAMAGE_TESTS`, `DEFENSE_MODEL` (see [DATA_REFERENCE.md](../DATA_REFERENCE.md)).

## The Test Kit artifact
- Live page: https://claude.ai/artifact/UefeH47GdLPfBV8kA8zdyt (David's measurement notebook; v32 as of 8 Nov). Source: `docs/testkit/dragonsword-test-kit.html`. To change it, edit the source and publish to the same URL; a new chat must read the artifact first.
- Storage: collection `results`; each entry has `testId`, `test`, `savedAt`, `inputs{}`, `summary`. Read with ArtifactData `query` (`where testId == …`, `out_dir` to save files). Writes to an existing document need `if_version`. New entry ids: `<testId>-<timestamp>`, e.g. `apply-1794430012000`.

| Test | `testId` | Status |
|---|---|---|
| 01 Status application per skill | `apply` | Lv.70 redo complete for all 20 heroes (8 Nov). Mastery retests pending. |
| 02 Skill buffs by level | `buffs` | Eight rows, 7 skills. More when David can. |
| 03 Gear upgrade row | `gear` | Open. |
| 04 Defense Ignore and Armor Penetration | `defign` | Done 4 Nov; off the page, entries kept. |
| 05 Level-up cost | `lvlcost` | Answered; moved to Already answered. |
| 06 Enemy Defense | `enemydef` | Ongoing: new enemies as David meets them; tower floors open. |
| 07 Hunt boss weakness (Nightmare and up) | `huntweak` | Not started. |

## Test 01 conventions (Lv.70 redo)
- Enemy: **Training Ogre**, Lv.90 boss dummy, Super Armor **not broken**. Hero Lv.70, no gear, no Karma, no awakenings, no masteries.
- One entry per skill and status: `inputs{hero, skill, st, enemy, lv:"90", broken:"Not broken", presses:"1", stacks, note}`.
- `stacks` = fraction of one stack the skill adds (0.25 = a quarter).
- **Super Armor gauge** is stored as `st: "Break (Super Armor)"`, `stacks` = fraction of the gauge (0.12 = 12%), read with David's % overlay.
- **All-out break time**: skill `Full rotation, going all out (time to break)`, `stacks: "1"`, the seconds in the note. Castella's 18 s has no separate entry.
- Skill names follow the codex (`CHARACTER_PROFILE_DATA[hero].skills[].skill`), with the case in brackets: Skill, Ultimate, Special A/B, whole basic combo, jump attack, dash attack, mode names, stack counts ("at 2 Bleed stacks"), per charge, etc.
- David's method for small values: reach 0.25 of a stack, divide by the number of sequences needed, round **down** to 2 decimals (e.g. Kalien's basic 0.01, really 0.015625). Notes say so where it applies.
- Application and gauge don't depend on hero or skill level (David, 8 Nov).
- Grabs often need stacks: Roxy's Bleeding Grab applies Bleed only at 1 stack; Johnny, Roxy and Ryza gain their physical status at 2 stacks; Ryza's Thunder Grab gives Knockdown at both.

## Team tests (Team Planner)
- Damage in 1 minute on the Training Ogre. The 9 Nov runs: all Lv.70, no gear, no Karma (signatures only where stated).
- Results go in the Team Planner `teams[].davidNote` with the date and conditions. See [TEAM_TESTS.md](TEAM_TESTS.md).
- Single runs vary by up to about 70k on hard teams: don't explain smaller gaps from one run each, and check what changed between two runs before comparing.

## Recording rule
When David sends numbers: save them in the artifact straight away, then CHANGELOG (newest first), `docs/PROJECT_HANDOFF.txt` (newest last) and the matching library file. Commit and push.
