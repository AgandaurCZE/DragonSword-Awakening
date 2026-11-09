# Status: where things stand (9 Nov 2026)

Back to the library: [docs/README.md](../README.md). Update this file at the end of every session; it's the first thing the next chat reads after [WORKING_WITH_DAVID.md](WORKING_WITH_DAVID.md).

## What David is doing in the game
- All 20 heroes are **Lv.70**. As of 9 Nov he has taken **no awakenings and no masteries** on any hero. He is about to start, and they **can't be undone**.
- He has just finished about 20 hours of testing: the Test 01 redo for all 20 heroes ([TEST01_RESULTS.md](TEST01_RESULTS.md)) and the gearless team runs ([TEAM_TESTS.md](TEAM_TESTS.md)).

## Must be done BEFORE any awakening or mastery
1. **Lv.70 base stats (Test Kit test 08) for the 9 heroes still estimated:** Aria, Ornette, Lute, Eileen, Cerese, Othello, Dana, Alex and Astria. For each: no gear, no Karma, panel Attack, Defense and Max HP. Subtract titles (Attack +145, Max HP +1,575, Defense +30 then Defense Up +5.3%) and save in `HERO_BASE_STATS` (method in [DATA_REFERENCE.md](../DATA_REFERENCE.md); profiles A, B, C). The other 11 are measured.
2. **Signature Karma tests (Test Kit test 09):** the same hero with the signature Karma, then with a normal Karma of the same level (ideally the same stat type). On a boss: Ryza, Theresia, Charlotte. Groups as well: Kalsion, Dana, Cerese, Ornette. The 9 Nov runs compared signature vs **no** Karma, so they include the Karma's stats and don't replace this test.
3. Optional: Theresia, Roxy and Kalien with **no** signatures, the one missing run to isolate Theresia's signature.

## After awakenings and masteries: mastery retests
Test the changed skill first, then redo the all-out break time (same setup as Test 01: Training Ogre, Lv.70, no gear, no Karma). Compare with [TEST01_RESULTS.md](TEST01_RESULTS.md).

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

## Open items that can wait (not affected by awakenings)
From David's to-do page `docs/dragonsword_david_todo_by_priority.html` (items 3–11; items 1–2 are the before-awakening list above), in his priority order:
- **Hunt boss weaknesses on Nightmare (Test 07).** From Nightmare, Hunt bosses get a big damage resistance buff that the right status removes (Furcas: Burn). The boss ratings wait on this.
- **Boss and Tower ratings.** Every hero's `bosses.all` is still empty. Use Test 01 and the team tests as evidence. Debate first.
- **Rating re-debates the tests suggest** (not agreed yet; David decides): Kalien (B overall, C single) is in both top teams and beat Castella every time; Castella (B) adds little because her Stun needs Break first; Theresia (B single) scored 330–500k in a hard team.
- **Signature Karma priorities**: update with measured gains once item 2 above is done.
- Test 06 inside the Towers of Trials; new enemies, Quest items and World Bosses (Test 06 entries); more skill buffs (Test 02). Test 03 (gear rows) is done unless a number looks wrong.
- Coloured signature Karma icons; banner art for Eroded Underground Cemetery and Residual Worm Cleanup Zone; Hunt rating rewards and Fame stages above 3.
- Optional feature, only if David wants it: show the Test 01 table in each hero's profile (preview only).

## Done recently
- 9 Nov: gearless Lv.70 team runs and signature runs ([TEAM_TESTS.md](TEAM_TESTS.md)); to-do items 1 and 2 marked done.
- 8–9 Nov: Test 01 redo for all 20 heroes, with break times ([TEST01_RESULTS.md](TEST01_RESULTS.md)). Older Test 01 entries deleted at David's request (backup in `docs/testkit/`).
- 8 Nov: Super Armor break tag (`sa`) for Castella, Astria, Dana and Kalien ([DECISIONS.md](DECISIONS.md)), preview only.
