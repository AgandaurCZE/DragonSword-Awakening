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
