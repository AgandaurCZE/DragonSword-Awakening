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
