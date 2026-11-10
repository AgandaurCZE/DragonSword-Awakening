# Team tests and Signature Karma notes

Back to the library: [docs/README.md](../README.md). Where things stand: [STATUS.md](STATUS.md).

Live data is in the **Team Planner** artifact https://claude.ai/artifact/7k9fC5D1pShnjkX8R3PtYD (collections `teams`, doc ids `t01`…`t11` = order number, and `sigs`, doc id = hero name in lower case; source page `docs/testkit/dragonsword-planner.html`). This file is a snapshot taken 9 Nov 2026 (teams refreshed 04:45 after Claude's second check: teams 12–16 added, an outdated Lv.1 number removed from team 5 and an invalid comparison in team 10's note replaced; facts David confirmed in game restored in 4 and 5); JSON copy: `docs/testkit/planner-backup-2026-11-09.json`. If the artifact and this file disagree, the artifact is newer.

## Team statuses

Each planner team has one of four statuses, chosen with the drop-down on its card: **Idea** (proposed on paper from the skill data, never played; the default for a new team), **To test** (David plans to run it), **Works** (tested and good), **Doesn't work** (tested and dropped). Claude set the first statuses when it wrote the teams on 8 Nov; David sets them from now on. Shadow Poison, Storm and Break and burn have results but still say Idea.

## Test conditions

- **8 Nov runs:** mixed levels and gear (written per team). Damage in 1 minute on the Training Ogre.
- **9 Nov runs (the planned gearless redo, to-do item 2):** all three heroes Lv.70, **no gear, no Karma**, damage in 1 minute. Runs marked "with signature" have only the named signature Karmas on and no other Karma.
- One run each unless stated. David calls Holy Bleed a hard team: the same setup gave 500k and 430k, so gaps under about 70k between single runs mean little.
- Main lesson (David, 9 Nov): application speed decides these teams. Reina applies Airborne from the first second with no condition; Castella's Stun only comes after Super Armor is broken, so she adds little. Kalien beats Castella in every comparison.
- Signature runs so far compare signature vs **no** Karma, so they include the Karma's own stats. The planned clean test (to-do item 2, Test Kit test 09: signature vs a normal Karma of the same level) is **not done yet** and must happen before awakenings.

## Team round after masteries and awakenings (prepared 10 Nov)

The six main teams again, same setup as the 9–10 Nov runs (Lv.70, **no gear**, 1 min on the Training Ogre), now with all masteries and the awakenings from [AWAKENING_TESTS.md](AWAKENING_TESTS.md). Same Karma setup as before, so the gap is the masteries and awakenings only: first normal Lv.1 Karmas, then the signature run. Holy Bleed varies a lot, so two runs if you can.

**Results (David, 10 Nov 12:07):** every team gained 23–91%; four of six reach 1 million with signatures. Biggest jumps: Holy Bleed (both runs about +90%) and Thunder pair (+80% / +90%). Saved on the planner cards (the badge now shows the new numbers; the old ones are the second line of David's note).

| Team | Heroes (awakening) | Before: normal → signature | After: normal → signature (gain normal / signature) |
|---|---|---|---|
| Airborne burst | Kalsion A6, Johnny A6, Reina A6 | 600k → 630k (Kalsion's) || 820k → 900k (+37% / +43%) |
| Shadow Poison | Charlotte A6, Johnny A6, Reina A6 | 680k → 700k (Charlotte's) || 950k → 1.1M (+40% / +57%) |
| Holy Bleed | Theresia A6, Roxy A6, Castella A6 | 330k → 420k (Theresia's and Roxy's) || 630k → 800k (+91% / +90%) |
| Thunder pair | Ryza A6, Ornette A6, Sion **A3** | 500k → 580k (Ryza's and Ornette's) || 900k → 1.1M (+80% / +90%) |
| Fox and wind | Kalsion A6, Kalien A6, Reina A6 | 650k → 700k (Kalsion's on in both; then Kalien's) || 800k → 1M (+23% / +43%; Kalsion's on in both, to confirm) |
| Frost tornado | Dana A6, Cerese A6, Reina A6 | 490k → 530k (Cerese's) || 800k → 1M (+63% / +89%; signature run now Dana's and Cerese's) |

## Teams

**Groups in the planner (10 Nov):** teams built around the same damage dealer share one box (`group`); the main version (`main: true`) shows first and the alternatives open from buttons on the right. **Kalsion, burst and swap** (he only comes in for Explosion and his Ultimate): Airborne burst (main), Burn chain, Fire and venom. **Kalsion, field time:** Fox and wind (main), Break and burn, Fox and crossbow. **Ryza:** Thunder pair (main), Storm, Double blessing, Lightning break. **Dana:** Frost tornado (main), Deep Frost, Ice Prison. **Theresia:** Holy Bleed (main), Holy Bleed with Kalien. **Charlotte:** Shadow Poison. Verdicts (David, 10 Nov): all Works except Ice Prison.

Damage: 1 minute on the Training Ogre, all Lv.70, no gear. "Normal" = everyone on a Lv.1 normal Karma; "signature" = the named signature Karmas on (9–10 Nov, Test Kit test 09). Teams with Alex were dropped (10 Nov, DECISIONS).

### 1. Airborne burst (t01, status: works, group kalsion-burst, main) — normal 600k → signature 630k (+5%, Kalsion's)

Heroes: Kalsion (Sub-DPS), Johnny (Sub-DPS), Reina (Enabler).

Why: Reina keeps enemies Airborne almost whenever you want, which unlocks Kalsion's Explosion and Johnny's Venom Cutter. Johnny's Poison comes on top. Two Sub-DPS and an Enabler.

Results (David):

- Lv.70, no gear, 1 min: 600k with normal Lv.1 Karmas; 630k with Kalsion's signature (Johnny: So Good It's to Die For, Reina: Become a Star in That Sky).
- No Karma at all (9 Nov): 420k; 510k with Kalsion's signature.

Claude's notes:

- Claude (8 Nov): The team David has been playing for the last few days.
- Claude (9 Nov, second check, built this team independently): Airborne comes from two heroes here. Reina adds about 0.89 of the gauge per rotation (Rising Cutter 0.24, Wind Slayer 0.40 with both charges, Wind Grab 0.25), Johnny about 0.6 (Venom Dance, Phantom Slash, Venom Cutter 0.20 each). With Burn, Poison and Airborne up, every hit gets +200% (x3).

### 2. Shadow Poison (t02, status: works) — normal 680k → signature 700k (+3%, Charlotte's)

Heroes: Charlotte (Main DPS), Johnny (Sub-DPS), Reina (Enabler).

Why: Charlotte's Illusion Kick needs Poison or Stealth and her Shadow Grab needs Airborne. Johnny brings Poison and some Airborne, Reina brings the rest, so Charlotte can spend her time picking targets in Stealth.

Results (David):

- Lv.70, no gear, 1 min: 680k with normal Lv.1 Karmas; 700k with Charlotte's signature. With her signature a 600k+ run is more reliable.
- No Karma at all (9 Nov): 440k; 560k with Charlotte's signature.

Claude's notes:

- Claude (9 Nov, built this team independently): Charlotte applies Poison herself on 4 skills (Test 01: Poison Dagger 0.50, clone explosion 0.24, Illusion Kick 0.15, Poison Step 0.08), so Johnny's Poison is mostly redundant here. His real value is Airborne (about 0.6 per rotation) for Shadow Grab, plus his own damage. Her only own Airborne is Illusion Kick (0.20) on a long cooldown, which is why the agreed rating says she needs it.

### 3. Holy Bleed (t03, status: works, group theresia, main) — normal 330k → signature 420k (+27%, Theresia's and Roxy's)

Heroes: Theresia (Main DPS), Roxy (Enabler), Castella (Enabler).

Why: Theresia's Divine Arc needs Stun and her Holy Rise needs Bleed. She applies both herself, but slowly on a boss, so she needs an enabler to reach her full potential fast: Roxy adds both, and Theresia's Stun in turn opens Roxy's Kick Storm. Castella breaks Super Armor fast, which opens her own Stun. One damage dealer and two Enablers.

Results (David):

- Lv.70, no gear, 1 min: 330k with normal Lv.1 Karmas; 400k with Theresia's signature; 350k with only Roxy's; 420k with both.
- No Karma at all (9 Nov): 250k.
- David: hard team (big run-to-run spread).

Claude's notes:

- Claude (8 Nov): David plans team tests with Roxy; Roxy may count as Sub-DPS here.
- Claude (9 Nov check): her own sources per Test 01: Celestial Verdict 0.20 Stun (0.25 in Heretic Judgment), Consecration 0.15 Bleed plus 0.12 from the 10 s aura. Too slow on a boss, which is why she needs an enabler (David's rule: a hero who applies their own needs slowly still needs an enabler). Castella's Stun Blow (0.33) only works on a broken boss.

### 4. Deep Frost (t04, status: works, group dana) — normal 300k → signature 480k (+60%, all three)

Heroes: Othello (Main DPS), Dana (Sub-DPS), Cerese (Sub-DPS).

Why: Othello's Frozen Burst needs Frozen enemies. Dana stacks Frost fast and Chako keeps fighting while she's swapped out; Cerese gathers with her tornado and adds Frost. Othello doesn't strictly need either of them, so this is about speed.

Results (David):

- Lv.70, no gear, 1 min: 300k with Season of Bitter Cold on all three; 350k with Othello's signature; 430k with Othello's and Cerese's; 480k with all three signatures.

Claude's notes:

- Claude (9 Nov check): Cerese shatters Othello's Ice Prison if she's played after him (David confirmed), and lifts his Knockdown targets, so she works against his setup. Dana is now rated higher than Othello (A vs B). My version without Cerese is t14, Ice Prison.

### 5. Storm (t05, status: works, group ryza) — normal 380k → signature 430k (+13%, Ryza's)

Heroes: Ryza (Main DPS), Tarte (Enabler), Sion (Support).

Why: Tarte builds Shock fast, and her Bolt Bubble keeps casting after she swaps out, so orbs keep coming while the main damage dealer is on the field; a Shock attack from any ally explodes them for big damage and more Shock, so Ryza's Shock hits detonate them. Sion adds team Attack (+15% at Lv.10, while a relic is placed) and more Shock. Ryza's Thunder Grab needs Shock.

Results (David):

- Lv.70, no gear, 1 min: 380k with normal Lv.1 Karmas; 430k with Ryza's signature.
- No Karma at all (9 Nov): 330k after runs of 250k and 300k (the Expert tag at its best, and still could do more); 400k with Ryza's signature.

Claude's notes:

- Claude (8 Nov): Ryza can stack Shock alone, so check whether Tarte's opener actually speeds her up.
- Claude (9 Nov check): David confirmed the orbs keep coming after Tarte swaps out. The old "full Shock stack in about 17–18 s" came from a Lv.1 estimate in the superseded Test 01 entries, so it stays out until it's measured at Lv.70 (the Lv.70 Test 01 has her charged Skill at 0.90 Shock with all 26 orbs).

### 6. Thunder pair (t06, status: works, group ryza, main) — normal 500k → signature 580k (+16%, Ryza's and Ornette's)

Heroes: Ryza (Main DPS), Ornette (Sub-DPS), Sion (Support).

Why: Ornette's Judgment needs Shock and her Holy Grab needs Knockdown. Ryza supplies Shock, Sion supplies Shock and Knockdown plus the Attack buff.

Results (David):

- Lv.70, no gear, 1 min: 500k with normal Lv.1 Karmas; 550k with Ryza's signature; 540k with only Ornette's; 580k with both.
- David (10 Nov): feels much better than Tarte (Storm). Tarte gives more Shock, but Ornette gives more Knockdown, which matters far more; played really well, she applies Knockdown and Airborne at the same time.

Claude's notes:

- Claude (8 Nov): David wants to see whether Ryza and Ornette work together at all.
- Claude (9 Nov, built this team independently): all three apply Shock, and Knockdown comes from three sources (Ryza's Thunder Grab 0.20–0.25, Ornette's Judgment 0.25, or 0.40 at 2 Shock stacks, Sion's Divine Smash and Justice Fall 0.20 each). Shock and Knockdown give +150% on hits. Almost no Airborne: Ryza's Stormbringer 0.20, and Ornette's Holy Grab didn't apply it on the boss.

### 7. Burn chain (t07, status: works, group kalsion-burst) — normal 490k → signature 520k (+6%, Kalsion's; Kalien's on in both runs)

Heroes: Kalsion (Sub-DPS), Aria (Enabler), Kalien (Enabler).

Why: A Burn team without Reina. Aria applies Burn and Airborne, Kalien stacks more Burn. Kalsion's Burst Grab needs Burn and his Explosion needs Airborne, both covered.

Results (David):

- Lv.70, no gear, 1 min: 490k with Kalsion on The Burning Taste of Fire; 520k with his signature. Kalien on her signature in both runs (her own gain is known from other tests).

### 8. Break and burn (t08, status: works, group kalsion) — normal 430k → signature 460k (+7%, Kalsion's and Kalien's)

Heroes: Kalsion (Sub-DPS), Kalien (Enabler), Castella (Enabler).

Why: Kalien's Fox Grab needs Break, and Castella breaks Super Armor fastest. Castella's Upper Blow then launches the enemy, giving Kalsion the Airborne for Explosion.

Results (David):

- Lv.70, no gear, 1 min: 430k with Kalsion without his signature; 460k with Kalsion and Kalien both on their signatures.
- No Karma at all (9 Nov): 330k; 380k with Kalsion's and Kalien's signatures.

Claude's notes:

- A variant of Burn chain for bosses with a big Super Armor gauge.

### 10. Fox and wind (t10, status: works, group kalsion, main) — normal 650k → signature 700k (+8%, Kalien's; Kalsion's signature on in both runs)

Heroes: Kalsion (Sub-DPS), Kalien (Enabler), Reina (Enabler).

Why: David's own test: Kalien's Burn and Reina's Airborne both feed Kalsion.

Results (David):

- Lv.70, no gear, 1 min: 650k with Kalsion's signature on (Kalien and Reina on normal Lv.1 Karmas); 700k with Kalien's signature too. Kalsion's own signature gain is measured in team 1.
- No Karma at all (9 Nov): 390k and 460k (two runs); 560k with Kalsion's and Kalien's signatures.

### 11. Holy Bleed with Kalien (t11, status: works, group theresia) — normal 320k → signature 450k (+41%, Theresia's, Roxy's and Kalien's)

Heroes: Theresia (Main DPS), Roxy (Enabler), Kalien (Enabler).

Why: Holy Bleed with Kalien in Castella's slot: Kalien's Finale adds Stun with no condition, plus Burn.

Results (David):

- Lv.70, no gear, 1 min: 320k with normal Lv.1 Karmas; 450k with all three signatures.
- No other Karma (9 Nov): 380k with only Theresia's signature; 350k with Theresia's and Kalien's; 500k and 430k with all three.
- David: hard team (big run-to-run spread).

Claude's notes:

- Claude (8 Nov): Holy Bleed with Castella: 250k with no signatures, 350k with Theresia's and Roxy's.
- Claude (9 Nov, built this team independently): Kalien's Finale gives Stun (0.20) with no condition, and her Burn adds a second damage-over-time status: Bleed, Burn and Stun give +200% on hits. Her Fox Grab needs Break and nobody here is a Breaker, but Kalien (25 s) and Theresia (27 s) break the gauge fast alone.

### 12. Fire and venom (t12, status: works, group kalsion-burst) — normal 420k → signature 450k (+7%, Kalsion's)

Heroes: Kalsion (Sub-DPS), Johnny (Sub-DPS), Aria (Enabler).

Why: Airborne burst without Reina. Aria applies both statuses Kalsion needs (Burn for Burst Grab, Airborne for Explosion); Johnny adds Airborne for both Explosion and his own Venom Cutter, plus Poison.

Results (David):

- Lv.70, no gear, 1 min: 420k with normal Lv.1 Karmas; 450k with Kalsion's signature.

Claude's notes:

- Claude (9 Nov): Aria alone gives about 0.4 Airborne per rotation (Air Bomb 0.20, Rolling Bomb 0.10, Switch On! 0.10), less than half of Reina's 0.89. With Johnny's 0.6 the two together come close to Reina, and Aria adds Burn (about 0.65 per rotation). Burn, Poison and Airborne: +200% on hits. Frees Reina for another team.

### 13. Double blessing (t13, status: works, group ryza) — normal 370k → signature 410k (+11%, Ryza's)

Heroes: Ryza (Main DPS), Sion (Support), Eileen (Support).

Why: Ryza covers her own needs, so both partners add damage: Sion's Bless and Eileen's Brave One each give +15% Attack (Lv.10) and add together, the banner gives +20% Crit Rate, and Sion adds Shock and Knockdown.

Results (David):

- Lv.70, no gear, 1 min: 370k with normal Lv.1 Karmas; 410k with Ryza's signature.

Claude's notes:

- Claude (9 Nov): a variant of Nightmare support (t09) with Sion instead of Alex. Alex's parry is about +11% team damage on a 1000-Defense boss and needs exact timing. Sion's +15% Attack needs a relic placed but no timing, and he adds statuses. Only one Expert here (Eileen). Teammates must stand in the buff circles.

### 14. Ice Prison (t14, status: doesn't work, group dana) — normal 300k → signature 340k (+13%, Othello's)

Heroes: Dana (Main DPS), Othello (Sub-DPS), Sion (Support).

Why: Othello's Ice Crown makes the Ice Prison (about 20 s); Dana's Chako Knuckle on Ice Block hits 35% of the Super Armor gauge each, up to 4 in one prison. Sion adds Knockdown for Dana's Chako Spin, Shock, and team Attack.

Results (David):

- Lv.70, no gear, 1 min: 300k with normal Lv.1 Karmas; 340k with Othello's signature.
- David: feels terrible. Sion can't apply enough Shock on his own without a weird rotation that costs a ton of damage.

Claude's notes:

- Claude (9 Nov): Deep Frost (t04) without Cerese, since she breaks Othello's prison and Frozen enemies, and with Dana as the Main DPS (rated A, Othello B). Measured: Dana broke the whole gauge in about 7 s after Othello's Ultimate. Knockdown and Shock: +150% on hits, plus +50% while Frozen.

### 15. Fox and crossbow (t15, status: works, group kalsion) — normal 380k → signature 400k (+5%, Kalsion's)

Heroes: Kalsion (Sub-DPS), Kalien (Enabler), Astria (Sub-DPS).

Why: Kalien and Astria unlock each other: Kalien's Finale gives Stun, which Astria's Bolt Bombard needs; Astria breaks Super Armor in about 18 s, which Kalien's Fox Grab needs. Both feed Kalsion Burn.

Results (David):

- Lv.70, no gear, 1 min: 380k with normal Lv.1 Karmas; 400k with Kalsion's signature.
- David: very easy to break. Discovery: Astria's Ultimate needs very little Rage; 3 basic attacks in Precision Shot mode give it back.

Claude's notes:

- Claude (9 Nov): Break and burn (t08) with Astria in Castella's slot. Weak spot: little Airborne for Kalsion's Explosion (only his own Burst Grab 0.25 and Royal Flame's Flame Wave 0.20), where Castella adds Upper Blow (0.33 Airborne). Worth one run to see whether Astria's own damage makes up for it.

### 16. Frost tornado (t16, status: works, group dana, main) — normal 490k → signature 530k (+8%, Cerese's)

Heroes: Dana (Main DPS), Cerese (Sub-DPS), Reina (Enabler).

Why: For groups. Cerese gathers with Ice Storm; her Frozen Needles needs Airborne and Frost, which Reina and Dana supply. Dana's Frost brings enemies to Frozen for Cerese's Shattering Touch.

Results (David):

- Lv.70, no gear, 1 min: 490k with normal Lv.1 Karmas; 530k with Cerese's signature.

Claude's notes:

- Claude (9 Nov): untested question: does Airborne keep or end Frozen and Ice Blocks? If it ends them, swap Reina for Sion. Dana groups S, Cerese groups A, Reina groups S+.

### 17. Lightning break (t17, status: works, group ryza) — normal 360k → signature 410k (+14%, Ryza's)

Heroes: Ryza (Main DPS), Castella (Enabler), Sion (Support).

Why: Ryza's Thunder Grab needs Shock, which she and Sion apply. Castella breaks the boss fast, which doubles physical build-up, then Stuns it; Sion adds team Attack and Knockdown.

Results (David):

- Lv.70, no gear, 1 min: 360k with normal Lv.1 Karmas (Sion: The One Chosen by Lightning, Castella: Destruction is the Mother of Creation); 410k with Ryza's signature. With it the boss ends each rotation on a full Shock stack; without, at about 75%. Expert team, could still do better.

Claude's notes:

- Claude (10 Nov): added from David's signature test runs; this team wasn't in the planner.

## Signature Karma priority list

| Rank | Hero | Karma | Priority | Status | Why / notes |
|---|---|---|---|---|---|
| 1 | Astria | Wildflowers Bloom Through the Wind | High | Not owned | Her charged shot of all loaded arrows may be the fix for her single target and Stun. David thinks she needs it. |
| 2 | Kalien | The Chosen One of the Crimson Flame | High | Owned | The tier list already marks her as needing it: more foxes from Fox Grab, her key skill. |
| 3 | Kalsion | The Sun Blazes Again | High | Owned | Explosion is his main damage. More range and damage on an A-tier hero that sits in several Airborne teams. |
| 4 | Charlotte | The Conviction Left in Darkness | High | Owned | Changes her playstyle: re-using Invisible detonates the clone at once. Worth seeing on an Expert Main DPS. |
| 5 | Ryza | The Scar Lightning Left Behind | Medium | Owned | Adds a new thrust attack after Flash on our strongest Main DPS. |
| 6 | Aria | Explosion Is Art | Medium | Not owned | A bigger Switch On! explosion that adds Burn and Airborne: more application for an Enabler. |
| 7 | Johnny | Wandering Blade | Medium | Not owned | Phantom Slash leaves blades that add damage and Poison. |
| 8 | Roxy | The Noble Lady's Wild Hobby | Medium | Owned | More arrows from Kick Storm, her Stun-gated skill. |
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

### Test 09 results (David, 9 Nov evening)
Training Ogre, every hero Lv.70, no gear, 1 minute. Every hero wears a Lv.1 normal Karma; then only the named hero swaps to their Lv.1 signature. One run each side, so a gap under about 70k may be chance; Ryza's gain repeats in three teams, so it is the most reliable.

| Hero | Team | Normal Karma | Signature | Gain |
|---|---|---|---|---|
| Ryza | Ryza, Castella, Sion | 360k | 410k | +14% (with it the boss ends each rotation at a full Shock stack; about 75% without) |
| Ryza | Ryza, Tarte, Sion | 380k | 430k | +13% |
| Ryza | Ryza, Ornette, Sion | 500k | 550k | +10% |
| Ornette | Ryza, Ornette, Sion | 500k | 540k | +8% (within chance) |
| Ryza + Ornette | Ryza, Ornette, Sion | 550k (Ryza's alone) | 580k (both) | +5.5% for Ornette's on top (within chance) |
| Theresia | Theresia, Roxy, Castella | 330k | 400k | +21% |
| Roxy | Theresia, Roxy, Castella | 330k | 350k | +6% (within chance) |
| Theresia + Roxy | Theresia, Roxy, Castella | 400k (Theresia's alone) | 420k (both) | +5% for Roxy's on top (within chance) |
| Kalien, Theresia, Roxy | Theresia, Roxy, Kalien | 320k (all normal) | 450k (all three signatures) | +41% for all three together; Kalien's own share not split (David's choice) |

Reading: Ryza's and Theresia's signatures are clear gains (about +10–14% and +21% team damage). Roxy's and Ornette's are small or within chance. Still open: Charlotte on a boss; group runs for Kalsion, Dana, Cerese and Ornette.
