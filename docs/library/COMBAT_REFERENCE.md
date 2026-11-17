# Boss buildup and skill availability

[Back to the project library](../README.md)

The Finder uses the November Test 01 baseline, Mastery and Awakening readings on the Lv.90 Training Ogre. The 382 public rows retain separate variants for different casts, conditions and attack sequences. They omit the 19 all-out rotation rows and the ambiguous Finale Super Armor reading during recovery. Castella’s baseline Whirlwind uses the later 17.5% correction. The raw Test Kit export stays intact.

| Skill | Nov. Ogre reading | Relevant official change |
|---|---|---|
| Reina · Wind Slayer | 20% of one Airborne gauge per charge | 1.1.0 doubled Airborne buildup |
| Lute · Swordgrab | 25% of one Knockdown gauge | 1.1.0 doubled Knockdown buildup |
| Eileen · Barraging Spear | 25% Airborne at A0, 33% with Mastery | 1.1.0 lowered Rage cost by 30% |
| Charlotte · Poison Dagger | 50% of one Poison stack | 1.1.0 raised Rage cost by 40% |

The Test 01 readings were taken after 1.1.0. The official deltas are historical context and should not be applied a second time. Neither 1.1.1 nor 1.1.2 supplies absolute Rage costs, Signal cooldowns or an encounter resistance table. Community guides and player descriptions often use “cooldown” for the tag-switch lockout, a ready animation, and rebuilding Rage. They cannot establish per-skill values. The 1.0.4 Roxy 1.5-second figure is for her A3 aerial re-jump, not a Signal timer.

- **Nightmare/Hell Hunts.** The Furcas comparison gives roughly ×1.36 on weak elements, ×0.2 on non-weak elements and ×0.5 on the physical gauges before Break. The site applies the shared Hunt rule and doubles physical buildup during Break only when the Ogre row wasn't already taken during Break. This is a conversion for the selected context and cast, not an individually measured skill value on that boss.
- **Raids.** Stronger resistance is known. No supportable numerical crosswalk from the Ogre or Hunt tables was found. Story, World Boss and dungeon encounters likewise have different resistances. Tower checks display the required status and the Ogre reference.
- **Rage and cooldown.** Skill and Ultimate need Rage. Signals have their own activation condition and cooldown. The site shows 14 documented relative Rage cost/gain deltas and six quantified buildup or Super Armor changes. It gives no absolute values for either Rage or Signal timing.

A way to add reliable timings without reading game files:

1. Record the current patch, hero, awakening, Karma, Mastery, gear and target at a fixed frame rate. Use the same target and settings for each repeat.
2. For a Signal, record the frame the first cast spends its ready state. Recreate the same valid trigger throughout recovery. Record the first frame the Signal is usable again, and keep separate columns for Signal availability, the swap lockout and the end of the animation. If the trigger disappears during the attempt, record the run as inconclusive.
3. For Rage, record the Active Skill and Ultimate meters before spending, immediately after spending and after controlled basic-hit sequences. Keep resource gains separate from skill costs and record full or partial charge, resets and refunds. Where the Active Skill bar is legible, use a Just Dodge as the 10%-of-gauge scale check. The official description does not extend that calibration to the Ultimate gauge. Report meter fractions or countable recovery actions until the game exposes native units.

Sources: [Test 01 readings](TEST01_RESULTS.md), [Awakening tests](AWAKENING_TESTS.md), [Hunt mechanics](GAME_MATH.md), [Hound13 Update Notes 1.1.0](https://dragonsword-awakening.hound13.com/en/news/2/), [Hound13 Update Notes 1.0.11](https://store.steampowered.com/news/posts/?enddate=1788404410&feed=steam_community_announcements), and the committed 1.1.1/1.1.2 patch notes.
