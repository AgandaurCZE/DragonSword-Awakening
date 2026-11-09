# Project library: start here

This is the index of every note in the repository. A new chat (Claude, Codex or anyone else) should read this file first, then only the files the task needs. Each file links back here.

Written by Claude, 9 Nov 2026, so that nothing depends on chat memory.

## Read first, every new chat

| File | What it holds |
|---|---|
| [`../AGENTS.md`](../AGENTS.md) | The repository rules: main-only workflow, the `?tiers=new` preview gate, data rules, how to commit. Binding. |
| [`library/WORKING_WITH_DAVID.md`](library/WORKING_WITH_DAVID.md) | How David likes to work, tone, and the mistakes past chats made. Read before replying to him. |
| [`library/STATUS.md`](library/STATUS.md) | **Where things stand right now**: what David is doing in the game, what must happen before he takes awakenings, open to-do items, mastery retests. Game tasks live here and on the to-do page; site tasks in [`library/SITE.md`](library/SITE.md). |

## Reference, by topic

| Topic | File |
|---|---|
| Every `data.json` key, its shape and renderer; text formats; build and base-stat methods; assets; tools | [`DATA_REFERENCE.md`](DATA_REFERENCE.md) (open only the section you need) |
| The Test Kit: each test, how David measures, how entries are stored, conventions | [`library/TESTING.md`](library/TESTING.md) |
| Test 01 results: status application and Super Armor gauge per skill, break times, all 20 heroes | [`library/TEST01_RESULTS.md`](library/TEST01_RESULTS.md) |
| Team tests (1-minute damage runs) and the Signature Karma priority list | [`library/TEAM_TESTS.md`](library/TEAM_TESTS.md) |
| Agreed ratings rules, roles, tags and the reasoning behind contested calls | [`library/DECISIONS.md`](library/DECISIONS.md) |
| **Game math**: every measured formula from levelling and stats to damage, Defense, statuses, Super Armor and each game mode, with definitions | [`library/GAME_MATH.md`](library/GAME_MATH.md) |
| **The site**: how `index.html` works, a code map, the data structure, GitHub and publishing, open site tasks | [`library/SITE.md`](library/SITE.md) |
| David's to-do list in priority order (game tasks; open it in a browser) | [`dragonsword_david_todo_by_priority.html`](dragonsword_david_todo_by_priority.html) |
| Changes that touch the public page and wait for David's launch approval | [`LAUNCH_CHANGES.md`](LAUNCH_CHANGES.md) |
| Dungeon banner art workflow | [`DUNGEON_ARTWORK_WORKFLOW.md`](DUNGEON_ARTWORK_WORKFLOW.md) |
| The Dungeons page brief (historical task file) | [`TASK_dungeons_page.md`](TASK_dungeons_page.md) |
| Older new-chat briefing (4 Nov; project overview, tools outside the repo, measured mechanics) | [`NEW_CHAT_BRIEFING.md`](NEW_CHAT_BRIEFING.md) |

## History

| File | Order |
|---|---|
| [`../CHANGELOG.md`](../CHANGELOG.md) | Every change, newest first |
| [`PROJECT_HANDOFF.txt`](PROJECT_HANDOFF.txt) | Running handoff log, newest last |

## Data backups in the repo

The two artifacts below keep their data outside the repo. Copies are kept here so nothing is lost.

| Artifact | Live link | Page source | Data copies |
|---|---|---|---|
| Test Kit (David's measurement notebook) | https://claude.ai/artifact/UefeH47GdLPfBV8kA8zdyt | `testkit/dragonsword-test-kit.html` | `testkit/test01-apply-2026-11-09.json` (current Test 01), `testkit/test01-apply-backup-2026-11-08.json` (superseded pre-redo entries) |
| Team Planner (teams and signature list) | https://claude.ai/artifact/7k9fC5D1pShnjkX8R3PtYD | `testkit/dragonsword-planner.html` | `testkit/planner-backup-2026-11-09.json` |
| David's to-do list (priority order) | not published; a file in the repo | `dragonsword_david_todo_by_priority.html` | n/a (the file itself) |

## Keeping the library current
- When you add a note file, list it in this index and put a "Back to the library" line at its top.
- When David sends results: save them in the artifact, then the matching library file ([TESTING.md](library/TESTING.md) says where).
- After changing the Test Kit or Team Planner page, publish the repo source to the same artifact URL, and refresh the data copies in `testkit/` now and then (they are snapshots).
- At the end of every session: update [STATUS.md](library/STATUS.md), the to-do page, `CHANGELOG.md` and `PROJECT_HANDOFF.txt`.
