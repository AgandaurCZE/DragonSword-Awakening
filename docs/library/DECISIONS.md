# Decisions: ratings, roles and tags

Back to the library: [docs/README.md](../README.md). Data shape: `TIER_LIST_V2` in [DATA_REFERENCE.md](../DATA_REFERENCE.md). Evidence: [TEST01_RESULTS.md](TEST01_RESULTS.md), [TEAM_TESTS.md](TEAM_TESTS.md).

## Ground rules
- `TIER_LIST_V2.heroes` holds only ratings agreed with David, after debate. **Never set a tier by formula.** Ratings are on base kits: no awakenings, no signature, no mastery.
- All new tier-list work is preview-only (`?tiers=new`). The public page keeps `HEROES[].tiers` until David approves launch.
- Hunt bosses are rated on **Nightmare and above** only (that's where the weakness mechanic matters).

## Roles (`TIER_LIST_V2.heroes[].role`)
Four roles: **Main DPS, Sub-DPS, Enabler, Support**. Enabler has the blue icon (`assets/roles/enabler.webp`).
- Johnny is Sub-DPS with the Enabler tag. Reina, Castella and Roxy are Enablers. Ornette is Sub-DPS.
- The Applies chip (`applies{main, also}`) shows a hero's statuses: bold = main. Castella's chain is Break, then Stun, then Airborne. Johnny's Airborne stays plain.
- **A hero who applies their own needed status slowly still needs an enabler** to reach full potential fast (David, 9 Nov; e.g. Theresia's own Stun and Bleed are too slow on a boss).
- Enabler is judged on bosses. Caveat agreed 9 Nov: a hero who must build their own setup first (Othello: Ice Grab Knockdown needs 2 Frost stacks) enables later than one who applies from the first second (Reina).

## Tags: rules agreed with David
- At most **three tags** per hero (the auto-added Counter aside). If a new tag would make four, either rethink the existing ones or don't give it.
- **Super Armor break (`sa`)**, 8 Nov: break the Training Ogre's whole gauge alone in **25 s or less** in Test 01. Given to Castella, Astria, Dana, Kalien. Othello (20 s) and Ryza (25 s) qualify but already have three tags (Gatherer, Self-sufficient, Expert), so they go without. The Ice Prison credit for the 7 s freeze-team break goes to Dana, who lands the 35% Knuckles. Theresia (27 s) gets another look after her mastery retest, and would still need a tag dropped.
- **Self-sufficient + Expert** together (Othello, Ryza): kept. The tier list is rated on someone who knows the kit; Expert's drop number covers players who don't. Played well, both build their own stacks.

## Findings that shape ratings (not yet turned into rating changes)
- Application speed decides team damage (David, 9 Nov). Reina's Airborne is "above everyone": 0.89 of a stack from her own kit with no condition on two of three skills.
- Castella "doesn't provide anything useful" in team runs (David, 9 Nov): her Stun Blow (0.33) only works once Super Armor is broken, and Reina or Kalien score far higher in the same slot.
- Kalien beat Castella in every comparison, with fewer signatures on.
- Stun sources besides Castella and Lute for Theresia: Roxy (Crimson Spiral 0.20; also Bleed), Kalien (Finale 0.20, needs clones), Tarte (Thunderbolt 0.25, needs Shock), Astria (Precision Shot basic 0.20 over 8 s).

## Alex in team tests (David, 10 Nov)
- Alex is still tested **alone** (Test 01 style, mastery and awakening retests); only team tests leave him out. Teams with Alex are dropped from testing for now: a fair 60 s run needs a parry every time **and** dodging the Training Ogre in aggro mode, so a clean run takes hours for underwhelming damage. Revisit once he is geared, or with his signature or awakenings.

## Astria (David, 10 Nov)
- Her Ultimate needs very little Rage: 3 basic attacks in Precision Shot mode refill it. Very easy to break with. Worth raising in her rating debate.

## Rating reasoning from the first debates (29 Oct – 3 Nov)
Moved here on 9 Nov from David's old `TODO_David_2026-10-29.txt` (retired; still in git history). This is the reasoning behind the ratings at the time. **The current tiers and tags are the ones in `TIER_LIST_V2.heroes`; where they differ, data.json wins.**

- **Tag rules (29 Oct):** no "Team-dependent" tag; Enabler covers heroes like Reina. Rate every hero at A0 first; awakenings only change things through the Needs-awakening tag and notes. **Self-sufficient** (new bar, 29 Oct 18:38): only heroes who run their whole kit alone **and** are strong doing it (Roxy and Aria lost it then). Claude must say so whenever a proposed tag doesn't meet its definition.
- **How Airborne plays (David, from Reina):** the bonus lasts only while the enemy is in the air, and single lifts are short. Rotating everyone's Specials in a team built to keep enemies up keeps them up much longer, so Airborne heroes are much stronger in such a team than alone.
- **Status application depends on the enemy:** Johnny puts 2.5–3 Poison stacks on low-level mobs but about 1.5–2 on Lv.90 goblins. Bosses resist more than mobs (see GAME_MATH 3.3).
- **Reina:** S (single S, groups S+). Applies Airborne so fast you can swap and rotate; Wind Slayer has two charges. Needs A3 only when played as a damage dealer.
- **Johnny:** A (single A, groups S). Within Venom he'd be S: Charlotte doesn't reach her numbers without him; he works without her. Enabler (Poison, far more than Charlotte) and Self-sufficient (he lifts for Venom Cutter and stacks his own Poison). No Needs Airborne tag: he covers it himself. Review cons to use: his Airborne slashes can carry him away from the fight, and a badly timed swap drags the next hero along Venom Cutter's path.
- **Charlotte:** A, Expert −1 (casual B); single A, groups B, groups A possible with her signature. Needs Airborne: her only own source is Illusion Kick (needs Poison or Stealth, long cooldown). Shadow Grab is her key single-target hit; the slam barely hurts others. Her Clone explodes after about 15 s for a big AoE and breaks small enemies, but most groups are dead by then. Rage gain can only be raised by hero-specific sources (Sion's signature, Alex A1/A6, Lute's Mastery, Just Dodge).
- **Castella:** B (single B, groups B). Really a Breaker: too slow as Main or Sub-DPS. Easy: broken enemies don't act for 8 s, which helps newer players. A1 (Knockdown on Stun Blow) lets her stand in for a Knockdown enabler.
- **Lute:** C. His only real plus is Stun Slash's one-press Stun (small cone); Swordgrab's Knockdown is slow and single target; Relic Fall needs Knockdown and can pick a far-off target. The heal suits casual players. Enabler (Stun) and Easy. A1 untested.
- **Roxy:** B (single B, groups C). Unlocks her whole kit herself (Skill, Special A, 3× Special B, Ultimate) but damage is on the low side. Her Stun unlocks Theresia's Divine Arc, Astria's Bolt Bombard and Castella's Upper Blow; her Bleed unlocks Theresia's Holy Rise.
- **Aria:** B (single B only thanks to Multiple Bolt, groups A). Air Bomb gives Burn and Airborne at once; play Skill, Ultimate, Special A, then swap. Her Burn helps Kalien's Fox Grab only with Kalien's A1.
- **Ornette:** B (single B, groups B), Easy. Loops Judgment and Holy Grab on her own Shock and Knockdown, so no Needs Shock tag; numbers feel small. A1 makes Holy Cross aimable; A3's bigger, longer Holy Circle could make her an off-field damage dealer.
- **Kalien:** needs Awakening 1 (David: close to unplayable without it; Fox Grab needs Break before A1).
- **Eileen (31 Oct):** S, Team buffer + Expert −1 (casual A). Not Enabler: her banner keeps enemies Airborne but she barely applies it. Brave One (+15% Attack) and Vanguard Banner (+20% Crit Rate) together about +17–21% team damage at end game (modelled). Works best with a Gatherer.
- **Cerese (31 Oct):** B (groups A, single C). Gatherer (Ice Storm pulls everyone; not in the codex text) and Late bloomer (signature and A1 improve Ice Storm). Weak Frost build-up on bosses.
- **Gatherers seen (31 Oct):** Kalien (Twin Tails), Kalsion (Explosion), Cerese (Ice Storm), a little from Roxy's held Crimson Spiral; awakenings Charlotte A3, Sion A3, Ornette A6.

## Team-building observations (not used on the site yet)
- Teams where several heroes apply the same status (Charlotte, Johnny and Reina all apply some Airborne) can spam freely; teams that rely on two specific skills to fill a stack on a broken boss need Break-bar timing (David, 8 Nov). Candidate for a team-difficulty note.
