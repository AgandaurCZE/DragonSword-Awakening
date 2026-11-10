# Done: finished tasks and answered questions

Back to the library: [docs/README.md](../README.md). Open work: [STATUS.md](STATUS.md) (game) and [SITE.md](SITE.md) (site). Every change in detail: [CHANGELOG.md](../../CHANGELOG.md).

Nothing on this page needs doing again. It exists so finished work is never mistaken for an open task. Newest first within each section. When a task in STATUS, SITE or the to-do page finishes, move it here with the date.

## Game tasks and tests (David)
- **10 Nov:** title One Who Broke the Dragon Horn (40 of 109); first Radiant and Perfect rune values.
- **10 Nov:** Karma base stats Lv.20–70 before and after each breakthrough on Ryza's (Balanced) and Ornette's (Attack) signatures; levelling rule in [GAME_MATH.md](GAME_MATH.md) 2.3.
- **10 Nov:** team round on the six main teams with masteries and awakenings ([TEAM_TESTS.md](TEAM_TESTS.md)).
- **10 Nov:** awakening batch 3, A4–A6 on 12 heroes; results in [AWAKENING_TESTS.md](AWAKENING_TESTS.md).
- **10 Nov:** awakening batch 2, A2 and A3 on 19 heroes (Alex later); results in [AWAKENING_TESTS.md](AWAKENING_TESTS.md).
- **10 Nov:** awakening batch 1, A1 on 19 heroes (Alex later); results in [AWAKENING_TESTS.md](AWAKENING_TESTS.md).
- **10 Nov:** all 16 masteries unlocked; mastery retests (changed skill and full break) in [TEST01_RESULTS.md](TEST01_RESULTS.md).
- **10 Nov:** title Chest Addict obtained; last insect familiar, Red Ladybug, owned (colour card cut from David's screenshot); materials for all 16 masteries farmed.
- **9 Nov evening:** all 20 heroes Lv.70; Test 08 base stats for all 20 (the 11 known ones re-measured and matching); 3 skill buffs (Tarte Cure, Alex Guard Counter, Astria Reload); 19 gear rows, mostly Blue and Purple (all match the tables, and they confirm Legs Attack Power Up, Legs Max HP Up, Helmet and Boots Defense Up and Boots Crit).
- **9–10 Nov:** Signature Karma tests (test 09) for every owned signature, and team verdicts in the planner (all Works except Ice Prison, No; Nightmare support stays an Idea) ([TEAM_TESTS.md](TEAM_TESTS.md)).
- **9 Nov:** gearless team redo: all three heroes in each tested team at Lv.70, no gear, no Karma, 1 min on the Training Ogre, plus signature runs ([TEAM_TESTS.md](TEAM_TESTS.md)).
- **9 Nov:** levelled to 70: Ryza, Theresia, Roxy, Castella, Tarte, Sion, Charlotte (with Johnny, Reina, Kalsion and Kalien, 11 heroes are at 70).
- **8 Nov:** Test 01 redo, status application, Super Armor gauge and all-out break time for all 20 heroes ([TEST01_RESULTS.md](TEST01_RESULTS.md)).
- **8 Nov:** Lv.70 base stats measured for 11 heroes; three breakthrough profiles A, B, C found ([GAME_MATH.md](GAME_MATH.md) 2.1).
- **8 Nov:** breakthrough materials for all 20 heroes and every Karma archetype; Insignia and Chronograph shop prices.
- **8 Nov:** Fame cups for all five achievement categories; Quest item; Codex icon for Guides.
- **7 Nov:** all six Hero Quests (Cerese, Othello, Ornette, Kalien, Dana, Theresia); their signature Karmas owned.
- **5 Nov:** main story finished (chapter 8); all Hunt bosses, Raids and Currency Dungeons discovered.
- **4–5 Nov:** Test 06 in dungeons and Currency Dungeons: the Defense curve holds from Lv.10 to 75; Currency Dungeons ×0.4.
- **4 Nov:** Test 04, Defense Ignore and Armor Penetration (K = 1,000).
- **3 Nov:** Test 05, level-up costs (the levelling calculator matches 43 of 45 entries).
- **30 Oct–4 Nov:** Test 03 gear rows (93 rows; tables match apart from two small misses).
- **29 Oct–3 Nov:** ratings agreed for all 20 heroes in `TIER_LIST_V2.heroes` (reasoning in [DECISIONS.md](DECISIONS.md)).

## Answered questions (now rules in [GAME_MATH.md](GAME_MATH.md))
- Castella's and Theresia's mastery "Super Armor reduction" protects their own Super Armor, not the enemy's break (10 Nov; Theresia's Ultimate damage identical with and without it).
- Karma base stats follow one level curve for every card type, plus breakthrough shares that depend on the type (10 Nov, GAME_MATH 2.3).
- Rune slots: one per gear piece, 1 Anonymous Artisan's Crafting Tool each; removal returns the rune for 10,000 Gold (10 Nov).
- Status hit bonuses add with no cap: Stun + Knockdown + Airborne = ×4 (31 Oct).
- Team buffs (Eileen's Brave One, Sion's Bless) join the Attack Power Up pool and add (31 Oct).
- Break gives no hit bonus and lasts 8 s; physical statuses still build up under Super Armor (29–31 Oct).
- Trait Dungeon weakness doubles the status hit bonus; difficulty III roughly halves build-up against I (29–30 Oct).
- Status application and gauge damage don't depend on hero or skill level (8 Nov).
- The Hunt list shows the level of the highest difficulty picked on that boss (31 Oct).
- Crit Rate above 100% does nothing (patch 1.1.0).
- Gear rebuild with measured Orange Crit Rate and Crit Damage pieces (30 Oct); a stat can be both main and substat.
- Level curve refitted with Lv.40, Lv.50 and Lv.70 measurements (31 Oct–8 Nov).

## Site work (preview unless noted)
- **10 Nov:** site check: preview starts ~5× faster (no longer waits for the 45 dungeon banners), phone layout fixes (Gear, tier list, Tools, Titles), Trait chips from the new tier list, tab titles, dead code removed, code map added; public page pixel-identical (CHANGELOG).
- **10 Nov:** tier list re-rated with Masteries (16 heroes), Ornette Enabler and Applies, purple signature card for Theresia and Ryza, Needs A and Late bloomer gone from the main view; hover shows the latest patch line.
- **10 Nov:** main-team gear builds (`tools/team_gear.py`, GAME_MATH 4.3), also with 5 Perfect Crit Rate runes.
- **9 Nov:** notes library, GAME_MATH, SITE; Test Kit v33 (tests 08 and 09); Team Planner intro.
- **8 Nov:** Super Armor break tag (`sa`) for Castella, Astria, Dana, Kalien.
- **8 Nov:** levelling calculator: hero breakthrough materials by hero, Karma materials by archetype, dungeon runs.
- **4–8 Nov:** damage calculator (Tools page) with enemy type, level and place (World, Normal, Trait, Currency Dungeon), towers and Hunt weakness.
- **4 Nov:** Item Database (Materials, Ingredients, Important, Quest); Achievements tracker; Guides placeholder cards; News entry (disabled).
- **3 Nov:** Gear page: upgrade calculator, Disassemble returns, Runes box.
- **1–3 Nov:** Dungeons group: Normal Dungeons (15 cards, I/II/III, filters, links from the Gear page), Trait Dungeons banners, Currency Dungeons (4 discovered, 1 locked). Built from the 1 Nov brief, which is now retired. The original Normal Dungeons design and artwork foundation are David's, made with ChatGPT.
- **2–3 Nov:** banner art for all 15 Normal Dungeons, three difficulties each; Goblin Bandits' Cave replaced with one shared crop; Currency Dungeon background fitted inside its frame (9 px inset, 8 px radius); David checked both live.
- **31 Oct–1 Nov:** new tier list v2 with Overall, Bosses (5 Hunt bosses, Raid Gauron with its fights, strategy and rewards panels) and Towers modes; Hunt rating rewards panel.
- **29 Oct–1 Nov:** Familiars, Titles, Cookbook, Trait Dungeons pages; preview gate.
