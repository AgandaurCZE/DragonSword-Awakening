# Test 01 results: status application and Super Armor gauge (8 Nov redo)

Back to the library: [docs/README.md](../README.md). Method and rules: [TESTING.md](TESTING.md). Mastery retests: [STATUS.md](STATUS.md).

David's redo, 8 Nov 2026: no gear, no Karma, no awakenings, no masteries, on the **Training Ogre (Lv.90 boss dummy), Super Armor not broken**. Status numbers are the fraction of one stack a skill adds (0.25 = a quarter of a stack). Gauge % is how much of the Super Armor gauge the skill removes, read with David's % overlay (stored in the Test Kit as status `Break (Super Armor)`, stacks = fraction of the gauge). Application and gauge don't depend on hero or skill level (David). Source: Test Kit storage (collection `results`, `testId: apply`); JSON copy: `docs/testkit/test01-apply-2026-11-09.json`. Pre-redo entries are in `docs/testkit/test01-apply-backup-2026-11-08.json` and are superseded.

## All-out break time (whole gauge, hero alone)

| Hero | Result |
|---|---|
| Castella | Whole gauge broken in about 18 s going all out (David, 8 Nov; no separate Test Kit entry). |
| Kalsion | Whole gauge broken in about 30 s going all out. |
| Kalien | Whole gauge broken in about 25 s going all out. |
| Charlotte | Whole gauge broken in about 40–41 s going all out. |
| Reina | Whole gauge broken in about 50 s going all out. |
| Eileen | Whole gauge broken in about 61 s going all out. Vanguard Banner does a lot, but spread over some time. |
| Roxy | Whole gauge broken in about 50 s going all out. |
| Johnny | Whole gauge broken in about 39 s going all out. |
| Ryza | Whole gauge broken in about 25 s going all out. |
| Theresia | Whole gauge broken in about 27 s going all out; a dash-attack rotation took about 35 s. Mastery not unlocked yet: retest once it is (dodging in Heretic Judgment mode raises Super Armor reduction). |
| Tarte | About 67 s just to bring the gauge to 50%, so he stopped there. At that rate a full break would take about 2 min 15 s. |
| Sion | Whole gauge broken in about 50 s going all out. Mastery not unlocked yet: retest once it is (blessing areas get bigger and also apply Shock). |
| Lute | Whole gauge broken in about 75 s going all out. Retest after the mastery (Kick Combo). |
| Aria | Whole gauge broken in about 50 s going all out. Retest after the mastery (Shoot and Bomb). |
| Astria | Whole gauge broken in about 18 s going all out. Retest after the mastery (Slide; Dodge reloads an arrow in Precision Shot mode). |
| Dana | Whole gauge broken in about 23 s going all out alone; about 7 s in the freeze team: after Othello's Ultimate she cast 3 Chako Knuckles back to back as the Ice Block version, 35% each. Othello's Ice Prison lasts about 20 s; 4 Ice Block Knuckles in total seems to be the maximum. |
| Othello | Whole gauge broken in about 20 s going all out. Why so fast with small hits: short cooldowns, a very quick dash attack to spam, and one Frost stack for the Ice Grab mount in about 10 s. Retest after the mastery (Half-Moon Cutter). |
| Cerese | Whole gauge broken in about 40 s going all out. Retest after the mastery (Frozen Road). |
| Ornette | Whole gauge broken in about 30 s going all out. Retest after the mastery (Holy Cutter). |
| Alex | Whole gauge broken in about 45 s going all out. Depends on how many parries land; a perfect run might be about 10 s faster (not tested). |

## Mastery retests (David, 10 Nov)

Same setup as above (Training Ogre, no gear, no Karma, no awakenings), all 16 masteries unlocked. Saved in the Test Kit (`testId: apply`, notes say "mastery") and in the JSON copy. Before → after.

| Hero | Skill | Status | Gauge | Full break |
|---|---|---|---|---|
| Aria | Shoot and Bomb (jump; the mastery repeats the last hit) | Burn 0.08 → 0.15, Airborne 0.01 → 0.03 | 0.8% → 1.25% | 50 → 47 s |
| Astria | Slide (dash attack; longer) | none | 1.6% → 1.8% | 18 → 15 s (no dash attacks: a waste of time) |
| Castella | Shoulder Crusher (dash attack) | none | 3% → 6%, plus 4% from the jump attack the sequence turns into | 18 → 16 s |
| Cerese | Frozen Road (dash attack) | Frost 0.05 → 0.08 over the whole time on the ground | unchanged (0.25%) | not retested (unchanged) |
| Charlotte | Shadow Dance (whole) / Shadow Leaf (jump) / Poison Step (dash) | not retested | 5% → 5% / 2% → 4% / 1% → 2.5% | 40–41 → 35 s |
| Eileen | Barraging Spear (Skill) | Airborne 0.25 → 0.33 | 4% → 7% | 61 → 56 s |
| Johnny | Venom Dance (Skill) | Poison 0.24 → 0.30; Airborne unchanged 0.20 (only the last hit) | 3% → 5% | 39 → 37 s |
| Kalien | Twin Tails (dash attack) | Burn 0.08 → 0.11 | 3% → 5% | 25 → 20 s |
| Lute | Kick Combo (dash attack) and Dropkick | each: Stun 0.05 (new) | 1.6% → 5%; Dropkick 5% | 75 → 41 s |
| Ornette | Holy Cutter (dash attack) | Shock 0.10 → 0.18, Knockdown 0.03 (new) | 2.5% → 5% | 30 → 26 s |
| Othello | Half-Moon Cutter (now a charged dash attack) | Frost 0.10 → 0.14 | 4% → 6% | 20 → 18 s |
| Reina | Dash (not the dash attack) | none | about 2% (new) | not retested |
| Sion | Bless (Special A) | Shock 0.04 → 0.06 | unchanged | not retested (unchanged) |
| Tarte | Spiky Bolt | Shock 0.08 | unchanged | not retested (unchanged) |

Notes from David:
- **Castella and Theresia:** the mastery buff protects **their own** Super Armor; it doesn't break the enemy's faster. The codex wording ("Super Armor damage reduction is increased") reads like either. Castella's buff icon shows only during the dash attack; Theresia's lasts 5 s. Castella's faster break comes from the longer Shoulder Crusher (more hits), not the buff.
- **Lute:** three uses of Kick Combo or Dropkick refresh his Skill.
- **Othello:** if a charged dash attack would complete a Frost stack it only refills the bar instead (with only charged dash attacks the bar sits at about 0.99 of a stack). Damage per use 2328 → 3452; the cast takes about 1.5 s instead of about 0.9–1 s.
- **Tarte:** Bolt Bubble now casts 40 bubbles, but she can't pop the extra ones herself: a buff for other Shock heroes' application. Each part of Spiky Bolt summons one bubble; the 3rd hit explodes them.
- **Sion:** the Shock applies only when Special A is pressed, not from the blessing area on its own; in most cases unusable.
- **Ryza:** Thunder Grab works as written: after any status (no Shock needed) she uses the mount attack as if the target had 2 Shock stacks; on groups she goes straight to the second version. Break unchanged.
- **Kalsion:** no change on bosses (his grab becomes a mount attack there); the change is for groups only.
- **Alex:** no change to damage or application. The debuff doesn't show when the Ultimate is used; Goblins dealt 6 damage before the Ultimate and after a quick cancel (needs a test on real enemies).
- **Dana:** no combat change. **Roxy:** moving around the field is easier, which helps her hold skill.

## Castella

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Whirlwind (Skill) | Gauge | 23% | About 23% of the Super Armor gauge (David's % overlay on the boss bar). Whole gauge in 18 s. |
| Howling (Ultimate) | Gauge | 15% | About 15% of the Super Armor gauge. |
| Stun Blow (Special A) | Stun | 0.33 | Only usable once the boss is broken, so its gauge damage can't be measured. |
| Upper Blow (Special B) | Airborne | 0.33 |  |
| Upper Blow (Special B) | Gauge | 6% | About 6% of the Super Armor gauge. |
| Wild Blow (whole basic combo) | Gauge | 4.5% | About 4.5% of the gauge per full combo. |
| Wild Crash (jump attack) | Gauge | 5% | About 5%. |
| Shoulder Crusher (dash attack) | Gauge | 3% | About 3%. |
| Full combo: basic, jump sequence, dash, back into basic | Gauge | 14% | About 14%. The dash after the last jump hit leads straight into the basic sequence. |

## Kalsion

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Weapon Blaze (Skill) | Burn | 0.1 |  |
| Weapon Blaze (Skill) | Gauge | 2% |  |
| Flame Wave (Ultimate, press) | Gauge | 10% |  |
| Flame Wave (Ultimate, charge, close range) | Gauge | 8% |  |
| Flame Wave (Ultimate, charge, long range) | Gauge | 12% |  |
| Burst Grab (Special A, at 1 Burn stack) | Burn | 0.15 |  |
| Burst Grab (Special A, at 1 Burn stack) | Gauge | 6% |  |
| Burst Grab (Special A, at 2 Burn stacks, whole 3-attack sequence) | Burn | 0.27 |  |
| Burst Grab (Special A, at 2 Burn stacks, whole 3-attack sequence) | Airborne | 0.25 |  |
| Burst Grab (Special A, at 2 Burn stacks, whole 3-attack sequence) | Gauge | 10% |  |
| Explosion (Special B, press) | Gauge | 5% |  |
| Explosion (Special B, charge) | Gauge | 12% |  |
| Great Rush (whole basic combo) | Gauge | 3% |  |
| Circle Cleave (jump attack) | Gauge | 4% |  |
| Circular Slash (dash attack) | Gauge | 1.5% |  |
| Flame Wave (Royal Flame, press) | Burn | 0.33 |  |
| Flame Wave (Royal Flame, press) | Airborne | 0.2 |  |
| Flame Wave (Royal Flame, press) | Gauge | 10% |  |
| Flame Wave (Royal Flame, charge, close or long range) | Burn | 0.25 |  |
| Flame Wave (Royal Flame, charge, close or long range) | Airborne | 0.2 |  |
| Flame Wave (Royal Flame, charge, close or long range) | Gauge | 8% |  |
| Great Rush (Royal Flame, whole basic combo) | Burn | 0.09 |  |
| Great Rush (Royal Flame, whole basic combo) | Gauge | 4% |  |
| Circle Cleave (Royal Flame, jump attack) | Burn | 0.1 |  |
| Circle Cleave (Royal Flame, jump attack) | Gauge | 5% |  |
| Circular Slash (Royal Flame, dash attack) | Burn | 0.05 |  |
| Circular Slash (Royal Flame, dash attack) | Gauge | 2.5% |  |

## Kalien

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Fox Parade (Skill) | Burn | 0.23 |  |
| Fox Parade (Skill) | Gauge | 10% |  |
| Fox Chase (Ultimate) | Burn | 0.23 |  |
| Fox Chase (Ultimate) | Gauge | 12.5% |  |
| Fox Grab (Special A) | Burn | 0.3 |  |
| Fox Grab (Special A) | Gauge | 15% |  |
| Finale (Special B) | Burn | 0.25 |  |
| Finale (Special B) | Stun | 0.2 |  |
| Finale (Special B) | Gauge | 6% | Uncertain: timed at the end of break recovery, may have hit before Super Armor was back. |
| Firefox (whole basic combo) | Burn | 0.01 | Burn per sequence: 0.25 ÷ number of sequences needed, rounded down to 2 decimals. Real value about 0.0156 (0.015625). |
| Firefox (whole basic combo) | Gauge | 1% |  |
| Pyro-Fang (jump attack) | Burn | 0.03 | Burn per sequence: 0.25 ÷ number of sequences needed, rounded down to 2 decimals. |
| Pyro-Fang (jump attack) | Gauge | 2.5% |  |
| Twin Tails (dash attack) | Burn | 0.08 | Burn per sequence: 0.25 ÷ number of sequences needed, rounded down to 2 decimals. |
| Twin Tails (dash attack) | Gauge | 3% |  |

## Charlotte

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Invisible (Skill, clone explosion) | Poison | 0.24 |  |
| Invisible (Skill, clone explosion) | Airborne | 0.1 |  |
| Invisible (Skill, clone explosion) | Gauge | 5.5% |  |
| Poison Dagger (Ultimate) | Poison | 0.5 |  |
| Poison Dagger (Ultimate) | Gauge | 6% |  |
| Illusion Kick (Special A) | Poison | 0.15 |  |
| Illusion Kick (Special A) | Airborne | 0.2 |  |
| Illusion Kick (Special A) | Gauge | 4% |  |
| Shadow Grab (Special B) | Knockdown | 0.25 |  |
| Shadow Grab (Special B) | Gauge | 10% |  |
| Shadow Dance (whole basic combo) | Gauge | 5% |  |
| Shadow Leaf (jump attack) | Gauge | 2% |  |
| Poison Step (dash attack) | Poison | 0.08 |  |
| Poison Step (dash attack) | Gauge | 1% |  |

## Reina

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Rising Cutter (Skill) | Airborne | 0.24 |  |
| Rising Cutter (Skill) | Gauge | 3.5% |  |
| Wind Slayer (Ultimate, per charge) | Airborne | 0.2 | Per charge; 2 charges, so 0.40 if both are used. |
| Wind Slayer (Ultimate, per charge) | Gauge | 2.5% | Per charge; 2 charges, so 5% if both are used. |
| Tempest (Special A) | Gauge | 3% |  |
| Wind Grab (Special B) | Airborne | 0.25 |  |
| Wind Grab (Special B) | Gauge | 11% |  |
| Wind Sword (whole basic combo) | Gauge | 2.5% |  |
| Silphid Spike (jump attack) | Gauge | 4% |  |
| Winchester (dash attack) | Gauge | 2.5% |  |

## Eileen

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Barraging Spear (Skill) | Airborne | 0.25 |  |
| Barraging Spear (Skill) | Gauge | 4% |  |
| Brave One (Ultimate) | Gauge | 0.5% |  |
| Rolling Upper (Special A) | Gauge | 4% |  |
| Vanguard Banner (Special B) | Gauge | 15% | Spread over some time. |
| Grand Spear (whole basic combo) | Gauge | 3% |  |
| Spin Presser (jump attack) | Gauge | 3% |  |
| Spiral Shave (dash attack) | Gauge | 1% |  |

## Roxy

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Crimson Spiral (Skill, press) | Bleed | 0.1 |  |
| Crimson Spiral (Skill, press) | Stun | 0.2 |  |
| Crimson Spiral (Skill, press) | Gauge | 6% |  |
| Crimson Spiral (Skill, charge) | Bleed | 0.24 |  |
| Crimson Spiral (Skill, charge) | Stun | 0.2 |  |
| Crimson Spiral (Skill, charge) | Gauge | 7.5% |  |
| Bloody Shower (Ultimate) | Bleed | 0.33 |  |
| Bloody Shower (Ultimate) | Gauge | 2.5% |  |
| Kick Storm (Special A) | Bleed | 0.15 |  |
| Kick Storm (Special A) | Gauge | 3.5% |  |
| Bleeding Grab (Special B, at 1 Bleed stack) | Bleed | 0.2 |  |
| Bleeding Grab (Special B, at 1 Bleed stack) | Gauge | 2.5% |  |
| Bleeding Grab (Special B, at 2 Bleed stacks) | Knockdown | 0.25 |  |
| Bleeding Grab (Special B, at 2 Bleed stacks) | Gauge | 10% |  |
| Bow Shot (whole basic combo) | Gauge | 1.5% |  |
| Double Shot (jump attack) | Gauge | 1% |  |
| Sliding Shot (dash attack) | Bleed | 0.06 |  |
| Sliding Shot (dash attack) | Gauge | 1.5% |  |

## Johnny

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Venom Dance (Skill) | Poison | 0.24 |  |
| Venom Dance (Skill) | Airborne | 0.2 |  |
| Venom Dance (Skill) | Gauge | 3% |  |
| Phantom Slash (Ultimate) | Airborne | 0.2 |  |
| Phantom Slash (Ultimate) | Gauge | 5% |  |
| Venom Cutter (Special A) | Poison | 0.25 |  |
| Venom Cutter (Special A) | Airborne | 0.2 |  |
| Venom Cutter (Special A) | Gauge | 6% |  |
| Poison Grab (Special B, at 1 Poison stack) | Poison | 0.2 |  |
| Poison Grab (Special B, at 1 Poison stack) | Gauge | 10% |  |
| Poison Grab (Special B, at 2 Poison stacks) | Airborne | 0.25 |  |
| Poison Grab (Special B, at 2 Poison stacks) | Gauge | 10% |  |
| Dirty Fight (whole basic combo) | Gauge | 2.5% |  |
| Piercing Step (jump attack) | Gauge | 1.5% |  |
| Fatal Sting (dash attack) | Poison | 0.12 |  |
| Fatal Sting (dash attack) | Gauge | 2.5% |  |

## Ryza

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Lightning Javelin (Skill, per charge) | Shock | 0.1 | Per charge; 2 charges, so 0.20 if both are used. |
| Lightning Javelin (Skill, per charge) | Gauge | 2% | Per charge; 2 charges, so 4% if both are used. |
| Stormbringer (Ultimate) | Shock | 0.33 |  |
| Stormbringer (Ultimate) | Airborne | 0.2 |  |
| Stormbringer (Ultimate) | Gauge | 10% |  |
| Flash (Special A) | Shock | 0.1 |  |
| Flash (Special A) | Gauge | 5% |  |
| Thunder Grab (Special B, at 1 Shock stack) | Shock | 0.2 |  |
| Thunder Grab (Special B, at 1 Shock stack) | Knockdown | 0.2 |  |
| Thunder Grab (Special B, at 1 Shock stack) | Gauge | 12% |  |
| Thunder Grab (Special B, at 2 Shock stacks) | Knockdown | 0.25 |  |
| Thunder Grab (Special B, at 2 Shock stacks) | Gauge | 10% |  |
| Volt Thrust (whole basic combo) | Gauge | 5% |  |
| Lightning Flow (jump attack) | Gauge | 5% |  |
| Lightning Step (dash attack) | Shock | 0.06 |  |
| Lightning Step (dash attack) | Gauge | 2.5% |  |

## Theresia

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Consecration (Skill, the skill's own hits) | Bleed | 0.15 | With the 10 s Heretic Judgment aura it comes to 0.27. |
| Consecration (Skill, the skill's own hits) | Gauge | 4% | With the 10 s Heretic Judgment aura it comes to 6%. |
| Heretic Judgment blood aura (whole 10 s mode) | Bleed | 0.12 | Aura on her maces, works passively during all attacks for the 10 s of the mode. |
| Heretic Judgment blood aura (whole 10 s mode) | Gauge | 2% | Aura on her maces over the 10 s mode. |
| Celestial Verdict (Ultimate) | Stun | 0.2 |  |
| Celestial Verdict (Ultimate) | Gauge | 10% |  |
| Divine Arc (Special A) | Bleed | 0.23 |  |
| Divine Arc (Special A) | Gauge | 6% |  |
| Holy Rise (Special B) | Bleed | 0.1 |  |
| Holy Rise (Special B) | Airborne | 0.2 |  |
| Holy Rise (Special B) | Gauge | 8% |  |
| Judgment Spiral (whole basic combo) | Gauge | 4% |  |
| Celestial Dive (jump attack) | Gauge | 4% |  |
| Heaven's Flick (dash attack) | Gauge | 1.5% |  |
| Celestial Verdict (Ultimate, Heretic Judgment mode) | Stun | 0.25 |  |
| Celestial Verdict (Ultimate, Heretic Judgment mode) | Gauge | 15% |  |
| Judgment Spiral (whole basic combo, Heretic Judgment mode) | Stun | 0.01 | Gauge same as outside the mode (4%); the mode only adds the Stun. |
| Heaven's Flick (dash attack, Heretic Judgment mode) | Gauge | 1.5% |  |
| Judgment Spiral (whole basic combo, Heretic Judgment mode) | Gauge | 4% | Same as outside the mode. |

## Tarte

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Lightning Shock (Skill, press, no orbs) | Shock | 0.25 | Holy Orbs from the basic attack do not raise the press. |
| Lightning Shock (Skill, press) | Gauge | 5% |  |
| Lightning Shock (Skill, press, with all 26 Bolt Bubble orbs) | Shock | 0.6 |  |
| Lightning Shock (Skill, charge, no orbs) | Shock | 0.33 |  |
| Lightning Shock (Skill, charge) | Gauge | 7.5% | Unchanged by orbs. |
| Lightning Shock (Skill, charge, with 8 orbs from the basic attack) | Shock | 0.5 | A tiny bit over 0.50. |
| Lightning Shock (Skill, charge, with all 26 Bolt Bubble orbs) | Shock | 0.9 |  |
| Bolt Bubble (Ultimate, 26 orbs, none exploded) | Gauge | 4% | The orbs' own damage only, no explosions. |
| Thunderbolt (Special A) | Shock | 0.15 |  |
| Thunderbolt (Special A) | Stun | 0.25 |  |
| Thunderbolt (Special A) | Gauge | 5% |  |
| Bolt Orb (whole basic combo) | Gauge | 0.25% | About 0.25%. |
| One Holy Orb (over its 5 s) | Gauge | 0.25% | About 0.25% across 5 s. |
| Spiky Bolt (jump attack) | Shock | 0.08 |  |
| Spiky Bolt (jump attack) | Gauge | 1.25% |  |
| Cannon Bolt (dash attack, big orb moving) | Shock | 0.1 | Hitting with both the moving orb and its explosion is very hard; usually only one of the two lands. |
| Cannon Bolt (dash attack, big orb moving) | Gauge | 1.25% |  |
| Cannon Bolt (dash attack, big orb explosion) | Shock | 0.125 | Hitting with both the moving orb and its explosion is very hard; usually only one of the two lands. |
| Cannon Bolt (dash attack, big orb explosion) | Gauge | 1.25% |  |

## Sion

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Divine Crash (Skill, no relic placed) | Shock | 0.25 |  |
| Divine Crash (Skill, no relic placed) | Gauge | 12.5% |  |
| Divine Crash (Skill, with a relic placed) | Shock | 0.27 |  |
| Divine Crash (Skill, with a relic placed) | Gauge | 2.5% |  |
| Divine Smash (Ultimate) | Knockdown | 0.2 |  |
| Divine Smash (Ultimate) | Gauge | 5% |  |
| Bless (Special A) | Shock | 0.04 |  |
| Bless (Special A) | Gauge | 0.8% |  |
| Justice Fall (Special B) | Knockdown | 0.2 |  |
| Justice Fall (Special B) | Gauge | 2% |  |
| Divine Bolt (whole basic combo) | Gauge | 1.6% |  |
| Air Bolt (jump attack) | Gauge | 1% |  |
| Sliding Bolt (dash attack, sphere moving, all 6 hits) | Shock | 0.1 | As with Tarte, usually only the moving sphere or its explosion lands; if both, fewer moving hits connect. |
| Sliding Bolt (dash attack, sphere moving, all 6 hits) | Gauge | 1.25% |  |
| Sliding Bolt (dash attack, sphere explosion) | Shock | 0.08 | Usually only the moving sphere or its explosion lands. |
| Sliding Bolt (dash attack, sphere explosion) | Gauge | 0.5% |  |

## Lute

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Stun Slash (Skill) | Stun | 0.2 |  |
| Stun Slash (Skill) | Gauge | 2.5% |  |
| Healing Circle (Ultimate) | Gauge | 0.25% | About 0.25% (corrected from 0.05%). |
| Swordgrab (Special A) | Knockdown | 0.25 |  |
| Swordgrab (Special A) | Gauge | 10% |  |
| Relic Fall (Special B) | Gauge | 2.5% |  |
| Sword Slash (whole basic combo) | Gauge | 3% |  |
| Dropkick (jump attack) | Gauge | 2.5% |  |
| Kick Combo (dash attack) | Gauge | 1.6% | Mastery not unlocked: retest Kick Combo once it is (more hits, adds Stun). |

## Aria

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Air Bomb (Skill) | Burn | 0.22 |  |
| Air Bomb (Skill) | Airborne | 0.2 |  |
| Air Bomb (Skill) | Gauge | 12% |  |
| Rolling Bomb (Ultimate) | Burn | 0.23 |  |
| Rolling Bomb (Ultimate) | Airborne | 0.1 |  |
| Rolling Bomb (Ultimate) | Gauge | 6% |  |
| Multiple Bolt (Special A) | Gauge | 3% |  |
| Switch On! (Special B, all 3 bolts on one target) | Burn | 0.2 | One bolt is a third of this (about 0.067); a Bomb Arrow from the basic combo explodes for the same as one bolt. |
| Switch On! (Special B, all 3 bolts on one target) | Airborne | 0.1 | One bolt is a third of this (about 0.033); a Bomb Arrow from the basic combo explodes for the same as one bolt. |
| Switch On! (Special B, all 3 bolts on one target) | Gauge | 6% | One bolt is a third of this (2%); a Bomb Arrow from the basic combo explodes for the same as one bolt. |
| Bolt Shot (whole basic combo, without the Bomb Arrow explosion) | Gauge | 0.8% | The Bomb Arrow explosion counts as one Switch On! bolt. |
| Shoot and Bomb (jump attack) | Burn | 0.08 | Mastery not unlocked: retest once it is (throws another bomb). |
| Shoot and Bomb (jump attack) | Airborne | 0.01 |  |
| Shoot and Bomb (jump attack) | Gauge | 0.8% |  |
| Rapid Shot (dash attack) | Gauge | 1.25% |  |

## Astria

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Wide Shot (Ultimate) | Gauge | 17.5% |  |
| Bolt Bombard (Special A) | Gauge | 18% |  |
| Ballista Shot (whole basic combo, 6 bolts) | Gauge | 12% | All 6 bolts take about 4 s. |
| Stunt Shot (jump attack) | Gauge | 2.5% |  |
| Slide (dash attack) | Gauge | 1.6% | Mastery not unlocked: retest once it is (Slide enhanced). |
| Ballista Shot (whole basic combo, 6 bolts, Precision Shot mode) | Stun | 0.2 | All 6 bolts take about 8 s. |
| Ballista Shot (whole basic combo, 6 bolts, Precision Shot mode) | Gauge | 35% | All 6 bolts take about 8 s. |
| Wide Shot (Ultimate, Precision Shot mode) | Gauge | 22.5% |  |
| Bolt Bombard (Special A, Precision Shot mode) | Gauge | 18% | Probably more in theory, but the mode's extra explosions spread so far that they basically never hit. |

## Dana

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Summon Chako (Skill) | Frost | 0.15 |  |
| Summon Chako (Skill) | Knockdown | 0.1 |  |
| Summon Chako (Skill) | Gauge | 12% |  |
| Chako Shield (Ultimate) | Gauge | 3% |  |
| Chako Knuckle (Special A, at 1 Frost stack) | Frost | 0.25 |  |
| Chako Knuckle (Special A, at 1 Frost stack) | Gauge | 22% |  |
| Chako Knuckle (Special A, at 2 Frost stacks, Knockdown or Ice Block) | Gauge | 35% | The powerful single blow. |
| Chako Spin (Special B) | Frost | 0.15 |  |
| Chako Spin (Special B) | Gauge | 17.5% |  |
| Snow Pop (whole basic combo) | Gauge | 2% |  |
| Snow Pop (charged basic) | Frost | 0.04 |  |
| Snow Pop (charged basic) | Gauge | 1% |  |
| Freezy Pop (jump attack) | Frost | 0.05 |  |
| Freezy Pop (jump attack) | Gauge | 2.5% |  |
| Snow Step (dash attack) | Frost | 0.08 |  |
| Snow Step (dash attack) | Gauge | 1% |  |

## Othello

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Frozen Stinger (Skill) | Frost | 0.2 |  |
| Frozen Stinger (Skill) | Gauge | 7.5% |  |
| Ice Crown (Ultimate, whole Ice Prison) | Frost | 0.2 | 0.05 at cast, rising to 0.20 during the Ice Prison (about 20 s). |
| Ice Crown (Ultimate) | Knockdown | 0.15 |  |
| Ice Crown (Ultimate) | Gauge | 7.5% |  |
| Ice Grab (Special A, at 1 Frost stack) | Frost | 0.2 |  |
| Ice Grab (Special A, at 1 Frost stack) | Gauge | 7% |  |
| Ice Grab (Special A, at 2 Frost stacks) | Knockdown | 0.25 |  |
| Ice Grab (Special A, at 2 Frost stacks) | Gauge | 10% |  |
| Frozen Burst (Special B, shattering the Ice Grab spear) | Frost | 0.1 |  |
| Frozen Burst (Special B, shattering the Ice Grab spear) | Gauge | 5% |  |
| Frozen Burst (Special B, per Frozen Stinger spear) | Frost | 0.01 | Per spear; Frozen Stinger leaves 3 per cast. |
| Frozen Burst (Special B, per Frozen Stinger spear) | Gauge | 1% | Per spear; Frozen Stinger leaves 3 per cast. |
| Frozen Burst (Special B, shattering the Ice Prison, all 5 explosions) | Frost | 0.1 | All 5 explosions; one is a fifth (0.02). |
| Frozen Burst (Special B, shattering the Ice Prison, all 5 explosions) | Gauge | 5% | All 5 explosions; one is a fifth (1%). |
| Avenger Circle (whole basic combo) | Gauge | 2.5% |  |
| Piercing Spike (jump attack) | Gauge | 4% |  |
| Half-Moon Cutter (dash attack) | Frost | 0.1 | Mastery not unlocked: retest once it is (becomes a charge attack). |
| Half-Moon Cutter (dash attack) | Gauge | 4% |  |

## Cerese

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Ice Storm (Skill, full 5 s tornado) | Frost | 0.25 | The tornado has to be cast for the full 5 s. |
| Ice Storm (Skill, full 5 s tornado) | Airborne | 0.2 |  |
| Ice Storm (Skill, full 5 s tornado) | Gauge | 15% |  |
| Frozen Spike (Ultimate) | Frost | 0.05 |  |
| Frozen Spike (Ultimate) | Airborne | 0.1 |  |
| Frozen Spike (Ultimate) | Gauge | 5% |  |
| Frozen Needles (Special A) | Frost | 0.25 |  |
| Frozen Needles (Special A) | Gauge | 4% |  |
| Shattering Touch (Special B) | Gauge | 5% |  |
| Ice Ball (whole basic combo) | Frost | 0.01 |  |
| Ice Ball (whole basic combo) | Gauge | 0.7% |  |
| Glacial Wave (jump attack) | Frost | 0.06 |  |
| Glacial Wave (jump attack) | Gauge | 2.5% |  |
| Frozen Road (dash attack) | Frost | 0.05 | Mastery not unlocked: retest once it is (longer path, adds Frost to enemies hit). |
| Frozen Road (dash attack) | Gauge | 0.25% |  |

## Ornette

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Holy Cross (Skill, the swing itself) | Shock | 0.24 | Without the moving cross. |
| Holy Cross (Skill, the swing itself) | Gauge | 5% |  |
| Holy Cross (Skill, the moving cross) | Shock | 0.1 |  |
| Holy Cross (Skill, the moving cross) | Gauge | 7.5% |  |
| Holy Circle (Ultimate) | Shock | 0.22 |  |
| Holy Circle (Ultimate) | Gauge | 4% |  |
| Judgment (Special A, at 1 Shock stack) | Knockdown | 0.25 |  |
| Judgment (Special A, at 1 Shock stack) | Gauge | 10% |  |
| Judgment (Special A, at 2 Shock stacks) | Knockdown | 0.4 |  |
| Judgment (Special A, at 2 Shock stacks) | Gauge | 10% |  |
| Holy Grab (Special B) | Shock | 0.28 | No Airborne against the boss. |
| Holy Grab (Special B) | Gauge | 12.5% |  |
| Pray (whole basic combo) | Gauge | 3% |  |
| Shining Spin (jump attack) | Gauge | 5% |  |
| Holy Cutter (dash attack) | Shock | 0.1 | Without mastery. With it: Shock 0.18, Knockdown 0.03 (Mastery retests, 10 Nov). |
| Holy Cutter (dash attack) | Gauge | 2.5% |  |

## Alex

| Skill | Status | Stacks / gauge | Note |
|---|---|---|---|
| Knockdown Smash (Skill) | Knockdown | 0.2 |  |
| Knockdown Smash (Skill) | Gauge | 4% |  |
| Pounding Grab (Special A) | Gauge | 8% |  |
| Guard Counter (Special B, successful parry) | Knockdown | 0.33 |  |
| Guard Counter (Special B, successful parry) | Gauge | 8% |  |
| Guard Counter (Special B, failed parry) | Gauge | 4% |  |
| Guard Stance (Ultimate) | Gauge | 1% | Each hit taken while blocking also takes about 1% (the counter shockwave). |
| Brandish (whole basic combo) | Gauge | 4% |  |
| Dive Kick (jump attack) | Gauge | 2.5% |  |
| Dodge Combo (dash attack) | Gauge | 2% |  |
| Brandish (whole basic combo, Defensive Stance) | Gauge | 4% |  |
| Dodge Combo (dash attack, Defensive Stance) | Gauge | 2.5% |  |
