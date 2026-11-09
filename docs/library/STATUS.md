# Status: where things stand (9 Nov 2026)

Back to the library: [docs/README.md](../README.md). Update this file during and at the end of every session; it's the first thing the next chat reads after [WORKING_WITH_DAVID.md](WORKING_WITH_DAVID.md). Finished items move to [DONE.md](DONE.md). Site tasks are in [SITE.md](SITE.md).

## What David is doing in the game
- **11 heroes are Lv.70:** Charlotte, Roxy, Sion, Johnny, Reina, Kalsion, Ryza, Theresia, Castella, Kalien, Tarte (all measured in `HERO_BASE_STATS`).
- **9 are not Lv.70 yet:** Aria, Ornette, Lute, Eileen, Cerese, Othello, Dana, Alex, Astria. David is levelling them now (9 Nov). An earlier chat wrongly wrote that all 20 were Lv.70; corrected 9 Nov.
- No awakenings and no masteries taken on any hero yet. They **can't be undone**.

## Current task
Levelling the 9 heroes above to 70. Claude waits for their Lv.70 stats (test 08).

## Must be done BEFORE any awakening or mastery
1. **Lv.70 base stats (Test Kit test 08)** for the 9 heroes above, once each reaches 70. For each: no gear, no Karma, panel Attack, Defense and Max HP. Subtract titles (Attack +145, Max HP +1,575, Defense +30 then Defense Up +5.3%) and save in `HERO_BASE_STATS` with `estimated: false` and the matching profile (A, B or C, [GAME_MATH.md](GAME_MATH.md) 2.1). Then run `tools/hero_stats.py` (inspect first, then `--write`).
2. **Signature Karma tests (Test Kit test 09):** the same hero with the signature Karma, then with a normal Karma of the same level (ideally the same stat type). On a boss: Ryza, Theresia, Charlotte. Groups as well: Kalsion, Dana, Cerese, Ornette. The 9 Nov runs compared signature vs **no** Karma, so they include the Karma's stats and don't replace this test.
3. Optional: Theresia, Roxy and Kalien with **no** signatures, the one missing run to isolate Theresia's signature.

## After awakenings and masteries: mastery retests
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
| Theresia | Dodge in Heretic Judgment mode raises Super Armor reduction (27 s now, 35 s with a dash rotation) |
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
- **Rating re-debates the tests suggest** (not agreed; David decides): Kalien (B overall, C single) is in both top teams and beat Castella every time; Castella (B) adds little because her Stun needs Break first; Theresia (B single) scored 330–500k in a hard team. Older ideas for later comparisons, once built with the same gear: Othello vs Kalsion in groups; Ryza vs Kalsion on a single target.
- **Signature Karma priorities**: update with measured gains once item 2 above is done.
- **Team Planner verdicts** (David, next): Shadow Poison, Storm and Break and burn are tested but still say Idea (the four statuses are explained in [TEAM_TESTS.md](TEAM_TESTS.md)). Teams 12–16 are new ideas from Claude's independent check (9 Nov), not tested yet.
- Test 06 inside the Towers of Trials; new enemies, Quest items and World Bosses (Test 06 entries); more skill buffs (Test 02).
- **Gear values still estimated** (no crafting needed: note the +0 main stat of any drop before disassembling it): Legs Attack Power Up (every damage build), Chest Max HP Up and Legs Defense Up (supports), Max HP Up and Defense Up on Helmet, Gloves, Boots (tank). Sources: `GEAR_STATS.valueSources`.
- Awakening ratings for Crit Rate awakenings were modelled before the 30 Oct gear rebuild; re-check with David whether they're worth more now.
- Coloured signature Karma icons; banner art for Eroded Underground Cemetery and Residual Worm Cleanup Zone; Hunt rating rewards and Fame stages above 3.
