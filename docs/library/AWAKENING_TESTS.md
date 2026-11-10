# Awakening tests: batches and results

Back to the library: [docs/README.md](../README.md). Plan: [STATUS.md](STATUS.md). The "before" numbers are from [TEST01_RESULTS.md](TEST01_RESULTS.md), including the 10 Nov mastery retests.

Same setup as Test 01: Training Ogre, no gear, no Karma, all masteries on. Stat-only awakenings aren't tested (the model counts them). Awakenings unlock in order, so testing goes in batches: A1 for everyone first.

## Batch 1: A1 (prepared 10 Nov)

| Hero | A1 | Skill and numbers before (status per use, gauge per use) | What to note |
|---|---|---|---|
| Alex | The Shield of the Seasoned One: Defensive Stance shockwave gets more range, Super Armor Break damage and knockback; more Rage when hit | Guard Stance (Ultimate) 1%; each blocked hit's counter shockwave about 1% | Gauge per shockwave (tested alone) |
| Aria | A Burning Premonition: Rolling Bomb twice in a row | Rolling Bomb (Ultimate): Burn 0.23, Airborne 0.10, gauge 6% | Both casts together |
| Astria | Mighty Power: after Reload, Ballista Shot or Stunt Shot fires an enhanced arrow | Ballista Shot (6 bolts) 12% (about 4 s); Precision Shot mode: Stun 0.20, gauge 35% (about 8 s); Stunt Shot (jump) 2.5% | The enhanced arrow on its own |
| Castella | An Axe That Shakes the Earth: Stun Blow more hits, adds Knockdown | Stun Blow (Special A): Stun 0.33; gauge can't be measured (needs Break) | Stun and the new Knockdown |
| Cerese | Ice Crystal: Ice Storm bigger and longer | Ice Storm (full 5 s): Frost 0.25, Airborne 0.20, gauge 15% | Whole storm, and its new length |
| Charlotte | My Mother's Hands: Poison Dagger also throws a large shuriken | Poison Dagger (Ultimate): Poison 0.50, gauge 6% | Whole Ultimate |
| Dana | Frozen Sparkle: Chako Knuckle advances, more and faster hits; on a Frozen target the final blow does more damage and Super Armor damage | Chako Knuckle at 1 Frost stack: Frost 0.25, gauge 22%; at 2 stacks (Knockdown or Ice Block): gauge 35% | Both versions (Frozen needs a team, can wait) |
| Eileen | A Sharply Polished Spear: bigger Brave One area | Brave One (Ultimate): gauge 0.5% (buff skill) | Area only: nothing to measure |
| Johnny | An Unstoppable Dagger: Phantom Slash twice in a row | Phantom Slash (Ultimate): Airborne 0.20, gauge 5% | Both casts together |
| Kalien | Fuse of Valor: Fox Grab usable on a Burning target, not only on Break | Fox Grab (Special A): Burn 0.30, gauge 15% | Fox Grab on an unbroken, Burning Ogre |
| Kalsion | The Unshakable Throne: Explosion fireball lasts the full duration without holding | Explosion (Special B): press 5%, charge 12% | The new Explosion (one press) |
| Lute | Sword Light Descending from the Sky: the relic stays and gives allies Attack Power (more with his signature) | Relic Fall (Special B): gauge 2.5% | The buff value and how long the area lasts |
| Ornette | A Steadfast Vow of Faith: Holy Cross becomes a charge skill you can aim, lasts longer | Holy Cross: swing Shock 0.24, gauge 5%; moving cross Shock 0.10, gauge 7.5% | Charged Holy Cross, whole |
| Othello | The Wounded Lion: Frozen Stinger faster and stronger | Frozen Stinger (Skill): Frost 0.20, gauge 7.5%; Frozen Burst per spear (3 per cast) Frost 0.01, gauge 1% | Frozen Stinger, and whether it still leaves spears |
| Reina | Resolute Will: Tempest more hits | Tempest (Special A): gauge 3% | Gauge, and any Airborne |
| Roxy | Dancing with You: hold Crimson Spiral for longer; less damage taken and more Super Armor reduction while it's active | Crimson Spiral press: Bleed 0.10, Stun 0.20, gauge 6%; charge: Bleed 0.24, Stun 0.20, gauge 7.5% | Held to the end. The wording matches Castella's mastery (her own Super Armor?) |
| Ryza | Echoes of Lightning: Flash becomes a charge that pierces and hits once per spear on the field, adds Airborne | Flash (Special A): Shock 0.10, gauge 5% | Charged, with how many spears were out |
| Sion | Manifestation of Divinity: relic buffs stronger (Blessing Crit Rate +10%, Protection Crit Damage Reduction +25%) | Buff only | Nothing to measure |
| Tarte | A Glimmering Touch: Cure also shields allies and pushes enemies away | Cure: heal, no application data | Nothing to measure |
| Theresia | The Mace of Branding: Holy Rise's upward strike becomes a whirlwind with more hits | Holy Rise (Special B): Bleed 0.10, Airborne 0.20, gauge 8% | Whole Holy Rise |

### Results (David, 10 Nov)
Measured rows are also in the Test Kit (`testId: apply`, notes say "A1").

| Hero | Result |
|---|---|
| Alex | Tested last (alone). |
| Aria | Rolling Bomb has two charges; each cast gives the old numbers, so twice per use. |
| Astria | Doubles the gauge damage of Ballista Shot and Stunt Shot, but **only the first bolt after a Reload**. |
| Castella | Stun Blow (target broken): Stun 0.33 → **0.45**, Knockdown **0.25** (new). |
| Cerese | Ice Storm lasts twice as long (she's locked in place twice as long) and is much bigger; about double the old numbers (Frost about 0.50, Airborne about 0.40, gauge about 30%: inferred from "double", not read off). |
| Charlotte | **Had A1 all along** (since before Test 01), so her Test 01 Poison Dagger numbers and her team tests already include it. |
| Dana | Chako Knuckle's big blow (2 Frost stacks, Knockdown or Ice Block): gauge 35% → **about 54–55%**. With Othello's Ultimate on she breaks in **about 4 s** (before 7 s). |
| Eileen | No damage change; not tested. |
| Johnny | Phantom Slash: same numbers, two charges. |
| Kalien | Fox Grab works whenever the target burns (cooldown about 12 s), so she uses it all the time. Alone: **full break in 15 s** (before 20 s), **all 3 Burn stacks in 25 s**, her Stun in **43–46 s**. Fox Grab per use as before (Burn 0.30, gauge 15%). |
| Kalsion | Explosion: the fireball is cast and stays while he moves and uses other skills. Big quality-of-life gain, possibly more damage and a different playstyle. |
| Lute | Relic area buff lasts about 5 s: Castella 1245 → +249 Attack, Ornette 1288 → +257 Attack. Both are exactly **+20%** of the base Attack shown in the panel (hero Lv.70 base 1100 / 1143 plus the owned titles' +145), so it's a **+20% Attack Power** buff (Claude's reading; it should add to the other Attack Power Up buffs like Eileen's and Sion's). |
| Ornette | Holy Cross lasts longer and can be aimed; no other change seen. |
| Othello | Frozen Stinger: Frost 0.20 → **about 0.28**, gauge 7.5% → **about 10%**. Full break not retested (it comes from dash attacks and the Ultimate). |
| Reina | Tempest: 5–6 hits → **9–10 hits**. Gauge not read (3% before; if per hit, about 5% now: Claude's estimate, not measured). |
| Roxy | Crimson Spiral, charge held: Bleed 0.24 → **0.33**, Stun 0.20 (same), gauge 7.5% → **10%**. |
| Ryza | Flash charged, both Lightning Javelins on the target: Shock 0.10 → **0.50**, Airborne **0.10** (new), gauge 5% → **15%**. |
| Sion, Tarte | No damage change; not tested. |
| Theresia | Holy Rise: Bleed 0.10 → **0.25**, Airborne 0.20 → **0.30**, gauge 8% → **15%**. |

## Batch 2: A2 and A3 (prepared 10 Nov)

David has 77 levels (25 Stigma Awaken Stones plus 52 to buy). Everyone to A3 costs 41 (19 heroes × 2, Alex 3), which leaves 36: enough to take 12 heroes from A3 to A6 in batch 3. **Every A2 is stat-only: no test.** Before numbers are from Test 01 (with masteries and A1 where they touch the same skill).

| Hero | A3 | Skill and numbers before | What to note |
|---|---|---|---|
| Alex | A Subtle Opening: Pounding Grab usable on Knockdown or Stun | Pounding Grab (Special A) 8% | Tested last, alone |
| Aria | A Burning Wick: Air Bomb's burning ground keeps applying Burn | Air Bomb (Skill): Burn 0.22, Airborne 0.20, gauge 12% | Burn from the ground, standing in it to the end |
| Astria | Orbis Shooting Practice: Bolt Bombard's burning ground keeps applying Burn | Bolt Bombard (Special A) 18%, no Burn | The new Burn |
| Castella | A Cool Shout: Howling bigger, lowers the enemy's Defense for a while | Howling (Ultimate) 15% | Gauge, and the Defense drop: damage of one skill before and right after Howling, or the debuff's value if shown |
| Cerese | Endlessly Rising Magic: Frozen Needles more Frost, adds Knockdown | Frozen Needles (Special A): Frost 0.25, gauge 4% | Frost and the new Knockdown |
| Charlotte | The Path of Shadows: Shadow Grab pulls in nearby enemies and slams them | Shadow Grab (Special B): Knockdown 0.25, gauge 10% | Groups only: just check the boss numbers didn't change |
| Dana | Companion of Snow: Summon Chako fully charges Rime Energy | Summon Chako (Skill): Frost 0.15, Knockdown 0.10, gauge 12% | What full Rime does to her rotation; full break time |
| Eileen | Training Is a Knight's Fundamental Duty: Rolling Upper more hits | Rolling Upper (Special A) 4% | Gauge, and any Airborne |
| Johnny | A Spectacular Entrance!: an extra thrust during Fatal Sting | Fatal Sting (dash attack): Poison 0.12, gauge 2.5% | With the extra thrust |
| Kalien | Pact of Scorching Fire: Sur stays longer; its attack lifts and slams; a tail hit adds Stun | Fox Chase (Ultimate): Burn 0.23, gauge 12.5% | Whole Ultimate: the new Airborne and Stun |
| Kalsion | Noon Sunlight: Royal Flame lasts longer and adds Attack | Royal Flame skills: Flame Wave press Burn 0.33, Airborne 0.20, gauge 10% (no single number for the mode) | How long the mode lasts now and the Attack added (panel) |
| Lute | Swordplay Imbued with Tenderness: Swordgrab twice in a row | Swordgrab (Special A): Knockdown 0.25, gauge 10% | Both together |
| Ornette | Compassion as Deep as the Sea: Holy Circle bigger and longer | Holy Circle (Ultimate): Shock 0.22, gauge 4% | Whole Ultimate |
| Othello | Sharpening Days: Frozen Burst bigger and stronger | Frozen Burst: Ice Grab spear Frost 0.10, gauge 5%; per Frozen Stinger spear Frost 0.01, gauge 1%; Ice Prison (5 explosions) Frost 0.10, gauge 5% | Any of them |
| Reina | Flash (rated **Game-changing**): Wind Grab resets Tempest's cooldown | Wind Grab (Special B): Airborne 0.25, gauge 11%; Tempest 3% (5–6 hits; 9–10 with A1) | **Full break time** and how fast she reaches a full Airborne stack alone (before: break 50 s) |
| Roxy | The Hunter of the Battlefield: Double Shot's plunge stacks Crit Damage; shorter Forward Jump cooldown after aerial actions | Double Shot (jump attack) 1% | The Crit Damage per stack and the maximum (panel) |
| Ryza | Awakened Thunder: Stormbringer adds a lightning strike; bigger and longer pillar | Stormbringer (Ultimate): Shock 0.33, Airborne 0.20, gauge 10% | Whole Ultimate |
| Sion | Legacy of Faith: Justice Fall pulls nearby enemies in | Justice Fall (Special B): Knockdown 0.20, gauge 2% | Groups only: just check the boss numbers |
| Tarte | Affection Filled with Longing: Lightning Shock bigger, full charge adds Stun | Lightning Shock charge: Shock 0.33 (0.5 with 8 orbs, 0.9 with all 26), gauge 7.5% | The new Stun at full charge |
| Theresia | Time of Judgment: Divine Arc hits harder, extends Heretic Judgment and adds Attack for a while | Divine Arc (Special A): Bleed 0.23, gauge 6% | Divine Arc numbers, the mode's new length, the Attack added (panel) |

### Results
(none yet)
