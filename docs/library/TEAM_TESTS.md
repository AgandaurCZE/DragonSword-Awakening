# Team tests and Signature Karma notes

Back to the library: [docs/README.md](../README.md). Where things stand: [STATUS.md](STATUS.md).

Live data is in the **Team Planner** artifact https://claude.ai/artifact/7k9fC5D1pShnjkX8R3PtYD (collections `teams`, doc ids `t01`…`t11` = order number, and `sigs`, doc id = hero name in lower case; source page `docs/testkit/dragonsword-planner.html`). This file is a snapshot taken 9 Nov 2026; JSON copy: `docs/testkit/planner-backup-2026-11-09.json`. If the artifact and this file disagree, the artifact is newer.

## Test conditions

- **8 Nov runs:** mixed levels and gear (written per team). Damage in 1 minute on the Training Ogre.
- **9 Nov runs (the planned gearless redo, to-do item 2):** all three heroes Lv.70, **no gear, no Karma**, damage in 1 minute. Runs marked "with signature" have only the named signature Karmas on and no other Karma.
- One run each unless stated. David calls Holy Bleed a hard team: the same setup gave 500k and 430k, so gaps under about 70k between single runs mean little.
- Main lesson (David, 9 Nov): application speed decides these teams. Reina applies Airborne from the first second with no condition; Castella's Stun only comes after Super Armor is broken, so she adds little. Kalien beats Castella in every comparison.
- Signature runs so far compare signature vs **no** Karma, so they include the Karma's own stats. The planned clean test (to-do item 4: signature vs a normal Karma of the same level) is **not done yet** and must happen before awakenings.

## Teams

### 1. Airborne burst (t01, status: works)

Heroes: Reina (Enabler), Kalsion (Sub-DPS), Johnny (Sub-DPS).

Why: Reina keeps enemies Airborne almost whenever you want, which unlocks Kalsion's Explosion and Johnny's Venom Cutter. Johnny's Poison comes on top. Two Sub-DPS and an Enabler.

Results (David):

- 8 Nov: 2 million in 1 min, no signatures, all Lv.70 with full builds.
- 9 Nov: 420k in 1 min, all Lv.70, no gear, no Karma.
- 9 Nov: 510k with Kalsion's signature on (Johnny and Reina without).

Claude's note: The team David has been playing for the last few days.

### 2. Shadow Poison (t02, status: idea)

Heroes: Charlotte (Main DPS), Johnny (Sub-DPS), Reina (Enabler).

Why: Charlotte's Illusion Kick needs Poison or Stealth and her Shadow Grab needs Airborne. Johnny brings Poison and some Airborne, Reina brings the rest, so Charlotte can spend her time picking targets in Stealth.

Results (David):

- 8 Nov: 2 million in 1 min, no signatures. Charlotte Lv.50 with some gear, Johnny and Reina Lv.70 built.
- 9 Nov: 440k in 1 min, all Lv.70, no gear, no Karma.
- 9 Nov: 560k with Charlotte's signature on (Johnny and Reina without).

### 3. Holy Bleed (t03, status: test)

Heroes: Theresia (Main DPS), Roxy (Enabler), Castella (Enabler).

Why: On bosses Theresia needs Stun or Bleed from someone else. Roxy applies both, and Theresia's Stun in turn opens Roxy's Kick Storm. Castella breaks Super Armor fast, which opens her own Stun. One damage dealer and two Enablers.

Results (David):

- 8 Nov: 45k in 1 min, no signatures. Theresia and Roxy Lv.1, Castella Lv.20.
- 9 Nov: 250k in 1 min, all Lv.70, no gear, no Karma.
- 9 Nov: 350k with Theresia's and Roxy's signatures on.
- 9 Nov: 330k with only Theresia's signature on.
- David: hard team (big run-to-run spread).

Claude's note: David plans team tests with Roxy; Roxy may count as Sub-DPS here.

### 4. Deep Frost (t04, status: idea)

Heroes: Othello (Main DPS), Dana (Sub-DPS), Cerese (Sub-DPS).

Why: Othello's Frozen Burst needs Frozen enemies. Dana stacks Frost fast and Chako keeps fighting while she's swapped out; Cerese gathers with her tornado, adds Frost and shatters. Othello doesn't strictly need either of them, so this is about speed.

Results (David):

- 8 Nov: 42k in 1 min, no signatures, all Lv.1.

### 5. Storm (t05, status: idea)

Heroes: Ryza (Main DPS), Tarte (Enabler), Sion (Support).

Why: Tarte builds a full Shock stack in about 17–18 s and her Ultimate's orbs keep coming after you swap out; Ryza's Shock hits pop them. Sion adds +15% team Attack and more Shock. Ryza's Thunder Grab needs Shock.

Results (David):

- 8 Nov: 50k in 1 min, no signatures, all Lv.1.
- 9 Nov: 330k in 1 min, all Lv.70, no gear, no Karma, after runs of 250k and 300k; the Expert tag at its best, and still could do more.
- 9 Nov: 400k with Ryza's signature on.

Claude's note: Ryza can stack Shock alone, so check whether Tarte's opener actually speeds her up.

### 6. Thunder pair (t06, status: test)

Heroes: Ryza (Main DPS), Ornette (Sub-DPS), Sion (Support).

Why: Ornette's Judgment needs Shock and her Holy Grab needs Knockdown. Ryza supplies Shock, Sion supplies Shock and Knockdown plus the Attack buff.

Claude's note: David wants to see whether Ryza and Ornette work together at all.

### 7. Burn chain (t07, status: idea)

Heroes: Kalsion (Sub-DPS), Aria (Enabler), Kalien (Enabler).

Why: A Burn team without Reina. Aria applies Burn and Airborne, Kalien stacks more Burn. Kalsion's Burst Grab needs Burn and his Explosion needs Airborne, both covered.

Results (David):

- 8 Nov: 1.1 million in 1 min, no signatures. Kalien Lv.50 no gear, Aria Lv.1 no gear, Kalsion Lv.70 built.

### 8. Break and burn (t08, status: idea)

Heroes: Castella (Enabler), Kalien (Enabler), Kalsion (Sub-DPS).

Why: Kalien's Fox Grab needs Break, and Castella breaks Super Armor fastest. Castella's Upper Blow then launches the enemy, giving Kalsion the Airborne for Explosion.

Results (David):

- 9 Nov: 330k in 1 min, all Lv.70, no gear, no Karma.
- 9 Nov: 380k with Kalsion's and Kalien's signatures on (Castella has none).

Claude's note: A variant of Burn chain for bosses with a big Super Armor gauge.

### 9. Nightmare support (t09, status: idea)

Heroes: Ryza (Main DPS), Eileen (Support), Alex (Support).

Why: For the hardest bosses. Eileen adds +15% Attack and +20% Crit Rate; Alex's parry lowers the boss's Defense by 20% for 10 s (about +11% team damage, and it stacks with Earthshatterer). Two Supports around one damage dealer.

Claude's note: Both Supports are Expert: timing matters a lot here.

### 10. Fox and wind (t10, status: test)

Heroes: Kalien (Enabler), Kalsion (Sub-DPS), Reina (Enabler).

Why: David's own test: Kalien's Burn and Reina's Airborne both feed Kalsion.

Results (David):

- 8 Nov: 1 million in 1 min, no signatures. Kalien Lv.50 no gear, Kalsion and Reina Lv.70 built.
- 9 Nov: 390k and 460k in 1 min (two runs), all Lv.70, no gear, no Karma.
- 9 Nov: 560k with Kalsion's and Kalien's signatures on (Reina without).

Claude's note: Compare with Burn chain: swapping Reina (Lv.70 built) for Aria (Lv.1) gave slightly more, not less.

### 11. Holy Bleed with Kalien (t11, status: test)

Heroes: Theresia (Main DPS), Roxy (Enabler), Kalien (Enabler).

Why: Holy Bleed with Kalien in Castella's slot: Kalien's Finale adds Stun with no condition, plus Burn.

Results (David):

- 9 Nov: 380k in 1 min, all Lv.70, no gear, with only Theresia's signature Karma on.
- 9 Nov: 350k with Theresia's and Kalien's signatures, Roxy's off.
- 9 Nov: 500k and 430k (two runs) with Theresia's, Roxy's and Kalien's signature Karmas on (no other Karma).
- David: hard team (big run-to-run spread).

Claude's note: Holy Bleed with Castella: 250k with no signatures, 350k with Theresia's and Roxy's.

## Signature Karma priority list

| Rank | Hero | Karma | Priority | Status | Why / notes |
|---|---|---|---|---|---|
| 1 | Astria | Wildflowers Bloom Through the Wind | High | Not owned | Her charged shot of all loaded arrows may be the fix for her single target and Stun. David thinks she needs it. |
| 2 | Kalien | The Chosen One of the Crimson Flame | High | Owned | The tier list already marks her as needing it: more foxes from Fox Grab, her key skill. |
| 3 | Kalsion | The Sun Blazes Again | High | Owned | Explosion is his main damage. More range and damage on an A-tier hero that sits in several Airborne teams. |
| 4 | Charlotte | The Conviction Left in Darkness | High | Owned | Changes her playstyle: re-using Invisible detonates the clone at once. Worth seeing on an Expert Main DPS. |
| 5 | Ryza | The Scar Lightning Left Behind | Medium | Farming | Adds a new thrust attack after Flash on our strongest Main DPS. |
| 6 | Aria | Explosion Is Art | Medium | Not owned | A bigger Switch On! explosion that adds Burn and Airborne: more application for an Enabler. |
| 7 | Johnny | Wandering Blade | Medium | Not owned | Phantom Slash leaves blades that add damage and Poison. |
| 8 | Roxy | The Noble Lady's Wild Hobby | Medium | Not owned | More arrows from Kick Storm, her Stun-gated skill. |
| 9 | Othello | The Spear That Fells the Sun | Medium | Owned | Frozen Stinger's final hit gets bigger and faster. |
| 10 | Theresia | Merciful Death Sentence | Medium | Owned | David: not needed, but a big boost to Heretic Judgment. 9 Nov (Lv.70, no gear, 1 min): Theresia-Roxy-Kalien 380k with only her signature on; Theresia-Roxy-Castella 250k with none and 350k with hers and Roxy's. Not yet measured alone: the same team with and without only her signature. Claude's maths for the Karma's Lv.1 stats (Attack +80 on her 1245, Defense Ignore 2% on the Training Ogre's 1000 Defense, Bleed / Stun Additional Attack Power +105 / +210 while those statuses are up): her own hits +7.5% with no status, +16% with Bleed up, +33% with Bleed and Stun up. |
| 11 | Cerese | Eternal Blizzard | Medium | Owned | Her Ice Storm moves to the nearest enemy when it ends. |
| 12 | Ornette | Sacred Lightning Baptism | Medium | Owned | Holy Cross gets bigger with more hits inside Holy Circle. |
| 13 | Eileen | Between Chivalry and Bookmarks | Low | Not owned | Already S. More Crit inside Brave One, so strong but not urgent. |
| 14 | Reina | The Wind That Protects the Kingdom | Low | Not owned | Already S. Tempest becomes a sword aura. |
| 15 | Dana | A Sparkling Tea Time | Low | Owned | David: not a must, and it needs enemies grouped first. |
| 16 | Castella | Noisy Duet | Low | Not owned | Howling becomes a hold action for a longer duration. |
| 17 | Sion | Fate Spoke to the Boy | Low | Not owned | Restores some Rage when retrieving the relic. |
| 18 | Tarte | A Helping Hand for Good Kids | Low | Not owned | David: not needed. It only improves her heal. |
| 19 | Lute | A Sword Summoned for a Friend | Low | Not owned | More relics from Relic Fall. |
| 20 | Alex | Loyalty Amidst Lethargy | Low | Not owned | David: doesn't help him with anything. |
