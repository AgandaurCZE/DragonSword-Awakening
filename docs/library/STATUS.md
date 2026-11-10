# Status: where things stand (9 Nov 2026, evening)

Back to the library: [docs/README.md](../README.md). Update this file during and at the end of every session; it's the first thing the next chat reads after [WORKING_WITH_DAVID.md](WORKING_WITH_DAVID.md). Finished items move to [DONE.md](DONE.md). Site tasks are in [SITE.md](SITE.md).

## What David is doing in the game
- **All 20 heroes are Lv.70** (9 Nov evening), all measured (test 08) and in `HERO_BASE_STATS` (`estimated: false` for all 20).
- No awakenings and no masteries taken on any hero yet. They **can't be undone**.

## Current task (10 Nov, 07:05)
- **All 16 masteries unlocked and retested (10 Nov)**; results in [TEST01_RESULTS.md](TEST01_RESULTS.md) (Mastery retests). Castella's and Theresia's mastery buffs protect their own Super Armor, not the enemy's break. David asked for every Castella and Theresia skill's gauge % to compare (sent).
- **Next (agreed 10 Nov 08:26):** awakenings in batches, A1 for everyone first. The list with before numbers is in [AWAKENING_TESTS.md](AWAKENING_TESTS.md); David notes every change and Claude saves the results there. Stat-only awakenings aren't tested.

## Earlier this session (Claude, 9 Nov evening)
- Done: breakthrough profiles explained (GAME_MATH 2.1: one axis, B melee, C ranged, A halfway, D Alex); skill buffs checked; 19 new gear rows checked (all match); endgame gear and set analysis (GAME_MATH 4.1).
- David's answers (9 Nov): base stats written to data.json (done). Builds: switch to the full model **in the preview now, public at launch**. Signal uptime: almost always on in groups; on bosses from about half to most of the fight, depending on the team.
- **Next site task (Claude):** preview-only builds from the full model (`tools/endgame_gear.py` logic, ported to JS behind `?tiers=new`, Python and JS kept identical). Agreed defaults (David, 9 Nov): toughest boss (Defense 1825) with a switch to the Training Ogre (1000); statuses = only those the hero applies themselves (a solo measurement; teams belong in the calculator), open point below; set effects always on, or a chart showing always-on and half of a 60 s fight. Agreed 10 Nov: own archetype status plus the one physical status the hero needs. **Substat layout agreed in principle (David, 10 Nov 01:31; Claude agrees):** show the must-have substats first, then a team-dependent slot labelled e.g. "team status Additional Attack Power", so nothing reads as play this one status only. Numbers (Claude, Johnny, Ryza, Reina, Kalsion vs Defense 1825): a build made for an always-broken boss loses 7.5–10% on an unbroken one and vice versa, so Break only pays above about half the fight broken. **Must-have on every piece in both cases: Defense Ignore and Attack Power Up.** Status AAP goes to the status the team keeps on the target most, usually a shared physical status (physical AAP substats are worth twice elemental ones), not automatically the hero's own element (David, 10 Nov, from the Ursula speed run; GAME_MATH 4.2). Builds also follow the role: on-field damage dealer (core plus Crit) or Breaker (Break and status AAP, Crit mains). Runes (always Crit) go into the model once David has Perfect rune values. Flexible slots: Break and All Status AAP (bosses you keep broken) or team status AAP, otherwise Crit Rate, Crit Damage or Attack. No new application test needed: Test 01 already has every skill's application. Enablers like Reina and Alex count one status; the builds pick gear and never set ratings, so this doesn't undervalue them (label any damage shown as solo).
- **Next for David: Signature Karma test 09** (agreed 9 Nov), then team tests.

## Must be done BEFORE any awakening or mastery
1. ~~Lv.70 base stats (test 08)~~ done 9 Nov for all 20, written to `data.json`.
2. ~~Signature Karma tests (test 09)~~ done 9–10 Nov (Ryza, Ornette, Theresia, Roxy, Charlotte, Kalsion, Kalien, Othello, Cerese, Dana); every tested team's normal vs signature damage is on its planner card and in [TEAM_TESTS.md](TEAM_TESTS.md).
3. Optional: Theresia, Roxy and Kalien with **no** signatures, the one missing run to isolate Theresia's signature.

## Masteries and awakenings: plan (10 Nov)
- David has materials for **9 masteries** (16 heroes need a retest) and **29 awakening levels** (77 if he exchanges Fragment of Sacred Light for Stigma Awaken Stones; 120 for A6 on all 20).
- **Order per hero: mastery → retest → only then awakenings.** A retest after an awakening changes two things at once and can't be compared with Test 01.
- First 9 masteries (Claude's suggestion, heroes in the Works teams first): Ryza, Kalsion, Kalien, Charlotte, Johnny, Ornette, Sion, Cerese, Theresia. Later: Castella, Aria, Tarte, Astria, Othello, Eileen, Lute.
- **Awakening retests (agreed 10 Nov):** same method as masteries (the changed skill's application and gauge first, then the all-out break time), but **only for awakenings that change a status or Super Armor**: about 25 of 120 (Castella A1, A6; Aria A3; Dana A1, A6; Kalien A1, A3; Roxy A1; Ornette A6; Tarte A3, A6; Kalsion A6; Cerese A3, A6; Reina A6; Astria A1, A3, A6; Othello A1, A3; Charlotte A1, A6; Ryza A1; Alex A1, A3: tested alone, never in a team test). Stat-only awakenings need no test; the model already counts them. Take one at a time and test before the next on the same hero.
- **No team tests in between.** One team round at the end, with the main version of each planner group (6 teams), once masteries and awakenings are in (ideally with gear).
- Awakenings have no other retest list. Suggestion: A1 for everyone first (20 of the 29; most A1s are rated 4 and several change the kit, e.g. Kalien's Fox Grab without Break), then by rating.

## Mastery retests: done 10 Nov (kept for reference)
A mastery costs 10 of a special material from legendary chests. Test the changed skill first, then redo the all-out break time (same setup as Test 01: Training Ogre, no gear, no Karma). Compare with [TEST01_RESULTS.md](TEST01_RESULTS.md).

| Hero | What the mastery changes |
|---|---|
| Castella | Shoulder Crusher (dash attack) |
| Kalsion | Burst Grab (Special A) |
| Kalien | Twin Tails (dash attack) |
| Charlotte | Shadow Dance 4th hit; enhanced Shadow Leaf and Poison Step (jump and dash attacks) |
| Eileen | Barraging Spear (Skill) |
| Johnny | Venom Dance (Skill) |
| Ryza | Thunder Grab (Special B), also triggered by physical statuses |
| Theresia | Dodge in Heretic Judgment mode: 5 s buff to her own Super Armor and damage reduction (not the enemy's break) |
| Tarte | Bolt Bubble (Ultimate); orbs while jumping |
| Sion | Orzea's Blessing areas (Bless, Divine Smash, Justice Fall) bigger, also apply Shock |
| Lute | Kick Combo (dash attack), more hits, adds Stun |
| Aria | Shoot and Bomb (jump attack) throws another bomb |
| Astria | Slide (dash attack) enhanced; Dodge reloads an arrow in Precision Shot mode |
| Othello | Half-Moon Cutter (dash attack) becomes a charge attack |
| Cerese | Frozen Road (dash attack) path lasts longer, adds Frost |
| Ornette | Holy Cutter (dash attack) extra swing with Shock and Knockdown |

No retest needed: Reina and Roxy (masteries only change Dodge), Dana (shields, ally buff, Defense), Alex (Taunt).

## Open items that can wait (in David's to-do order)
The to-do page `docs/dragonsword_david_todo_by_priority.html` (items 3–11; items 1–2 are the list above):
- **Hunt boss weaknesses on Nightmare (Test 07).** From Nightmare, Hunt bosses get a big damage-resistance buff that the right status removes (Furcas: Burn; Venom and Airborne didn't). The boss ratings wait on this.
- **Boss and Tower ratings.** Every hero's `bosses.all` is still empty. Use Test 01 and the team tests as evidence. Debate first.
- **Ratings re-set with Masteries (10 Nov, done, DECISIONS).** Still open: the awakening view button (all awakenings, rated at A6 with signature where needed); hero review texts on profiles still describe the old ratings (public page: launch item).
- **Rating re-debates the tests suggest** (not agreed; David decides): Kalien (B overall, C single) is in both top teams and beat Castella every time; Castella (B) adds little because her Stun needs Break first; Theresia (B single) scored 330–500k in a hard team. Older ideas for later comparisons, once built with the same gear: Othello vs Kalsion in groups; Ryza vs Kalsion on a single target.
- **Signature Karma priorities**: update with measured gains once item 2 above is done.
- ~~Team tests at Lv.70~~ done 10 Nov for every planner team (normal vs signature on each card). **Team Planner verdicts** (David, next): Shadow Poison, Storm and Break and burn are tested but still say Idea (the four statuses are explained in [TEAM_TESTS.md](TEAM_TESTS.md)). Teams 12–16 are new ideas from Claude's independent check (9 Nov), not tested yet. All team tests wait until every hero is Lv.70, so damage is comparable (David, 9 Nov).
- Test 06 inside the Towers of Trials; new enemies, Quest items and World Bosses (Test 06 entries); more skill buffs (Test 02).
- **Gear values still estimated** (no crafting needed: note the +0 main stat of any drop before disassembling it): Legs Attack Power Up (every damage build), Chest Max HP Up and Legs Defense Up (supports), Max HP Up and Defense Up on Helmet, Gloves, Boots (tank). Sources: `GEAR_STATS.valueSources`.
- Awakening ratings for Crit Rate awakenings were modelled before the 30 Oct gear rebuild; re-check with David whether they're worth more now.
- Coloured signature Karma icons; banner art for Eroded Underground Cemetery and Residual Worm Cleanup Zone; Hunt rating rewards and Fame stages above 3.
