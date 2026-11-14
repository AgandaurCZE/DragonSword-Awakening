# Working with David

Back to the library: [docs/README.md](../README.md). Repository rules: [AGENTS.md](../../AGENTS.md).

## Who he is · 9 Nov
- David, UK English, Prague time. He runs this fan guide and plays DragonSword: Awakening daily to collect the data. He often tests for many hours at a stretch; respect his time and memory.
- He checks claims. Never state anything the data can't back up, and **never invent numbers**.

## Source of truth · 9 Nov
- **The GitHub repository is the only source of truth.** Every number comes from David's in-game measurements, screenshots and the codex, stored in the repo (and the Test Kit and Team Planner artifacts, backed up in `docs/testkit/`). AIs make sense of those numbers; they don't add outside data. No web or wiki data unless David asks.
- If two notes disagree, `data.json` wins, then the newest library file. Fix the older one; don't keep both.

## How he wants to work · 9 Nov, updated 10 Nov
- He wants a working relationship, not order and serve: discuss, give your own view, and tell him plainly if something he says doesn't add up (point to the file, number or formula).
- Make the edits he asks for without asking permission. Flag anything you changed that he didn't ask for. **Ask first when a task is unclear.**
- **Debate first.** Ratings, tags and roles are agreed by discussion; he confirms only after hearing your reply. Never set a tier by formula.
- Short, direct, warm replies, like a colleague. Tables when comparing. Say plainly what's done, what isn't and what you need from him.
- Be usage-efficient: batch work, don't re-read big files, **don't use agents**, don't search the web unless he asks, don't add tasks he didn't ask for.
- Use the correct pronouns: `CHARACTER_PROFILE_DATA[hero].review.pronoun`. Lute is male.
- When he sends test numbers, save them in the right place straight away (Test Kit storage, Team Planner) **and** in the repo (CHANGELOG and the library files). He relies on the repo, not on chat memory.
- Before he takes anything that changes a skill (an awakening, a mastery), prepare the list of affected skills with their current numbers, so he can note what changed (format: [AWAKENING_TESTS.md](AWAKENING_TESTS.md); all masteries and 77 awakening levels were done this way on 10 Nov).
- **If finer data would help, just ask.** He often has it already (10 Nov: "if you needed per level too you could have just asked", about Karma levels).

## Checks and quality (David, 11 Nov)
- **The checks are the golden rule** (top of [AGENTS.md](../../AGENTS.md)): run `python3 tools/check_all.py` before every commit, and never loosen a check to get a pass. David asked for this to be the most important rule for every assistant.
- **Picture quality comes before file size.** A change to icons, gear, Karma or hero pictures is only allowed if what the site shows doesn't get worse; when in doubt, leave them. (The 11 Nov idea of shrinking the icons was dropped for this reason.)
- He wants backups before big changes (every commit is one; note the hash to go back to) and a dated note of what was changed into what, as you go.
- **Push in batches (David, 13 Nov).** Don't push every small change on its own; each push waits minutes for GitHub's checks. Commit locally (still only after `check_all.py` passes) and push a batch when there's a meaningful set of changes, or when David wants something live. Say what is committed but not pushed yet.
- Usage is limited: do the hard parts yourself, and leave clearly described tasks for other assistants in [SITE.md](SITE.md) instead of half-doing them.

## Permissions (David, 9 Nov)
- **Folders:** ask before creating, moving, deleting or changing the contents of any folder, unless it's part of the task.
- **His uploads:** PNGs he sends for cutting or converting to WebP may be deleted afterwards, with their folder if it's no longer needed, without asking.
- **His PC:** ask him personally before looking through it. GitHub: look anywhere.
- **Site changes (updated 11 Nov):** David approved the public Beta launch. Former preview features are public; follow AGENTS' Beta routing workflow. The old preview-only restriction is superseded.

## What David owns (check before planning tests) · 10 Nov
- **Signature Karmas (confirmed 10–11 Nov): Theresia, Kalien, Kalsion, Othello, Cerese, Dana, Ornette, Charlotte, Ryza, Roxy.** The Team Planner and `KARMA_DATA[].owned` now agree on all ten signatures. Ryza's and Roxy's colour art was added on 10 Nov; that artwork task is complete. Recheck the current flags and planner before planning future purchases or tests.
- Titles: `TITLES` in data.json (all 109 recorded; the in-fight panel includes the owned ones). Familiars: `FAMILIARS.list[].owned`.
- Masteries and awakenings per hero: [STATUS.md](STATUS.md), "Where David's account is".

## Keeping memory in the repo · 9 Nov
- Long chats get compacted (older messages summarised). Tell David when it happens, and keep everything needed in the repo as you go, not only at the end: [STATUS.md](STATUS.md) (current task and next steps), `CHANGELOG.md` (every change), [DONE.md](DONE.md) (finished tasks). There is no separate handoff file any more (retired 9 Nov).
- Other assistants (ChatGPT, mainly for artwork) work on the same repo. Leave them notes in `CHATGPT.md`; be kind, and check their changes rather than undoing them.

## Mistakes past chats made: don't repeat them · updated 13 Nov
- **Internal notes on the public pages (David, 13 Nov):** pages carried his name, dates, "measured with Reina's Ultimate, floor 1, 1,759…", "seen up to floor 5", "tested by David", where files are stored and Python tool names. Visitors must see facts only: never his name, who or how something was measured, where data lives, or "measured / tested / seen / recorded". Keep such notes in unprinted `note` fields or in `docs/`. Rule and check: AGENTS.md, "How to make changes".
- **Removing in-game facts because the codex text doesn't state them** (9 Nov: Tarte's orbs after a swap, Chako after a swap). David's play knowledge is a source. If something isn't in the repo, ask him; don't delete it.
- **Writing that all 20 heroes were Lv.70** (9 Nov) when only 11 were. Check `HERO_BASE_STATS` (`estimated`) and STATUS before stating levels.
- **Forgetting agreed plans.** On 9 Nov a chat didn't recognise the gearless Lv.70 team redo it had planned itself, and twice left out the Signature Karma tests when asked what must happen before awakenings. Before answering "what's left" or "what is this", read [STATUS.md](STATUS.md) and the to-do page (`docs/dragonsword_david_todo_by_priority.html`).
- **Drawing conclusions from runs that changed two things at once** (Theresia's signature and Kalien for Castella in the same comparison). Check what changed between two numbers before explaining the gap.
- **Calling a hero an Enabler without the caveat** that they must build their own setup first (Othello only applies Knockdown via Ice Grab after 2 Frost stacks).
- Claiming data was missing when it was saved (Test 01 boss entries, Castella's application); forgetting Hero Quests already in the CHANGELOG; wrong pronoun for Lute; splitting look-alike enemies wrongly; extrapolating a number David didn't measure without saying so.
- **Stating something about his account without checking the data** (10 Nov: "all familiars owned" when it was 16 of 29). Count it from data.json first.
- **Repeating an old note as his opinion** (10 Nov: "Kalien close to unplayable without A1", a 29 Oct note credited to David that he no longer holds). When a note is old, say when it's from.
- **Removing code that looked unused without running the page** (10 Nov: `dcEnemyDef` was called through `...dcEnemyDef(`, which the search missed; the pixel check caught it before commit). After any code removal, load both URLs and check the console.
- In general: when unsure, look it up in the repo or the artifact before answering, and say where the answer came from.
