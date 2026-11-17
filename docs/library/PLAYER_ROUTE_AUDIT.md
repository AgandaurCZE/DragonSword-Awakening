# Player routes and combat audit — 17 Nov 2026

Back to the [project library](../README.md).

## Player routes

| Player | Route | Result |
| --- | --- | --- |
| First team | Shortcuts → Getting Started → Royal Inferno → Explosion → Kalsion Build and Teams → Levelling Calculator | The team link kept its lineup target. The skill and build links now keep their selection after refresh. Reached the levelling calculator and selected a hero. |
| Hell Hunt | Finder → Gallore on Hell → fight guide → Back to Finder → rankings → Damage Calculator | Finder and ranking URLs used to lose their selections. The encounter and difficulty now survive Back and reload. Checked the first Break note, the one-stack Frost opening, and the corresponding Hunt resistance in the calculator. |
| Ursula prep | Ursula guide → speedrun lineups → Gear search for Earthshatterer → Cookbook | The speedrun view now survives refresh. Matched Earthshatterer’s three-piece window and four-star Tomato Stew’s team buff to the Gear and Cookbook entries. |

## Combat checks

- Frost adds +50% to hits from the first completed stack. Freeze at three stacks enables Freeze-specific skills. Corrected the Damage Calculator label and the gear build preview, which had looked up `Frost` under a different key. Existing calculator saves and backups retain their key.
- Break doubles physical status buildup and has no inherent hit bonus. The Finder, Break guide and build calculation use the ordinary Additional Damage pool for gear bonuses. Gallore’s fist changes its Defense after recovery.
- On Nightmare and Hell, the model keeps 17.1% of unrestricted hit damage until a matching elemental status or Airborne, Knockdown or Stun is active. Frost opens the window after one stack on Frost-weak Hunts.
- The three Towers add +400% Additional Damage for their own physical status and +100% per active damage-over-time status. Stun is Amplitude, Airborne is Gale, and Knockdown is Crushing. The new-player and per-tower explanations agree with the calculator.
- Defense Ignore and an enemy Defense debuff act multiplicatively, with flat Armor Penetration applied afterwards. The published example leaves 500 Defense from 1,000, 20% debuff, 25% Ignore and 100 Penetration. The preview stops at zero Defense.
- Checked 1.1.2 hero fixes against the current walkthrough advice. Charlotte’s duplicate Invisible explosions, Ornette’s back-to-back Holy Cross with Exclusive Karma, Othello’s excess mounted Heavy Attacks and Ryza’s Thunder Grab movement are already covered in Patch Notes. The reviewed guide chains do not rely on those behaviours. No ratings changed. [Hound13 announcements](https://steamcommunity.com/app/4570720/announcements/)

## Screenshot shot list

| First shots to capture | Moment |
| --- | --- |
| Gauron | Dragon has put away his weapon, horns glow, and a pillar is visible in the charge lane. |
| Vanak | First red shockwave ring just after a jump lands, with the ring edge in view. |
| Ursula | Humanoid grab wind-up with the player still outside the grab path. A second frame from the opening of the dragon arena could illustrate the HP carry-over. |
| Gallore | First broken fist and the Super Armor gauge visible. |
| Barduk | Poison breath begins while the player is at a rear leg, so the safe positioning is clear. |
| Earthlander and Furcas | Nightmare ground hazard after the burrow or flight, with a safe route around it. |
| Ghoul Greed | The question mark after losing track of the player, before the approach from behind. |

The existing screenshots for menus, rewards, upgrading and the Exchange already explain those screens. Fight shots provide the most coverage next.

## In-game details still open

- The exact result above the amount of Armor Penetration needed to reach zero Defense. Only useful if a reproducible test becomes practical.
- Hell versions of the Furcas flight hazard and Earthlander’s burrow follow-up. The attack guides specify Nightmare for those cues until Hell footage confirms the pattern.
