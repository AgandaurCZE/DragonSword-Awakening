# Project library: start here

This is the index of every note in the repository. A new chat (Claude, ChatGPT, Codex or anyone else) reads this file first, then only the files the task needs. Each file links back here. **The repository is the only source of truth**: if two notes disagree, `data.json` wins, then the newer library file.

## Read first, every new chat

| File | What it holds |
|---|---|
| [`../AGENTS.md`](../AGENTS.md) | The repository rules: main-only workflow, the `?tiers=new` preview gate, data rules, how to commit. Binding. |
| [`library/WORKING_WITH_DAVID.md`](library/WORKING_WITH_DAVID.md) | How David likes to work, his permissions, and the mistakes past chats made. Read before replying to him. |
| [`library/STATUS.md`](library/STATUS.md) | **Where things stand right now**: what David is doing in the game, the current task, what must happen before awakenings, mastery retests, open items. |

## Reference, by topic

| Topic | File |
|---|---|
| Every `data.json` key, its shape and renderer; text formats; build method; assets; tools | [`DATA_REFERENCE.md`](DATA_REFERENCE.md) (open only the section you need) |
| **The site**: how `index.html` works, a code map, GitHub and publishing, open site tasks | [`library/SITE.md`](library/SITE.md) |
| **Game math**: every measured formula from levelling and stats to damage, Defense, statuses, Super Armor and each game mode | [`library/GAME_MATH.md`](library/GAME_MATH.md) |
| The Test Kit: each test, how David measures, how entries are stored | [`library/TESTING.md`](library/TESTING.md) |
| Test 01 results: status application, Super Armor gauge and break times, all 20 heroes | [`library/TEST01_RESULTS.md`](library/TEST01_RESULTS.md) |
| Team tests (1-minute damage runs), team statuses, the Signature Karma priority list | [`library/TEAM_TESTS.md`](library/TEAM_TESTS.md) |
| Rating rules, roles, tags, and the reasoning behind each hero's rating | [`library/DECISIONS.md`](library/DECISIONS.md) |
| David's to-do list in priority order (game tasks; open it in a browser) | [`dragonsword_david_todo_by_priority.html`](dragonsword_david_todo_by_priority.html) |
| The launch checklist and public text changes waiting for launch | [`LAUNCH_CHANGES.md`](LAUNCH_CHANGES.md) |
| Dungeon banner art workflow | [`DUNGEON_ARTWORK_WORKFLOW.md`](DUNGEON_ARTWORK_WORKFLOW.md) |
| Notes for ChatGPT / Codex | [`../CHATGPT.md`](../CHATGPT.md) |

## History

| File | What it holds |
|---|---|
| [`library/DONE.md`](library/DONE.md) | Finished tasks and answered questions: nothing there needs doing again |
| [`../CHANGELOG.md`](../CHANGELOG.md) | Every change, newest first |

Retired on 9 Nov 2026 (content moved into the files above; still in git history): `PROJECT_HANDOFF.txt`, `NEW_CHAT_BRIEFING.md`, `TASK_dungeons_page.md`, `TODO_David_2026-10-29.txt`.

## Tools and data outside the repo

The two artifacts below keep their data outside the repo. Copies are kept here so nothing is lost.

| Artifact | Live link | Page source | Data copies |
|---|---|---|---|
| Test Kit (David's measurement notebook) | https://claude.ai/artifact/UefeH47GdLPfBV8kA8zdyt | `testkit/dragonsword-test-kit.html` | `testkit/test01-apply-2026-11-09.json` (current Test 01), `testkit/test01-apply-backup-2026-11-08.json` (superseded pre-redo entries) |
| Team Planner (teams and signature list) | https://claude.ai/artifact/7k9fC5D1pShnjkX8R3PtYD | `testkit/dragonsword-planner.html` | `testkit/planner-backup-2026-11-09.json` |

## Keeping the library current
- When you add a note file, list it in this index and put a "Back to the library" line at its top.
- When David sends results: save them in the artifact, then the matching library file ([TESTING.md](library/TESTING.md) says where), then CHANGELOG.
- After changing the Test Kit or Team Planner page, publish the repo source to the same artifact URL, and refresh the data copies in `testkit/` now and then (they are snapshots).
- As you go, not only at the end: update [STATUS.md](library/STATUS.md), the to-do page and `CHANGELOG.md`; move finished tasks to [DONE.md](library/DONE.md).
