## 10 Nov 2026 — Broken vs unbroken boss builds compared (Claude)
- A build made for an always-broken boss loses 7.5–10% on an unbroken one, and vice versa (Johnny, Ryza, Reina, Kalsion, Defense 1825). Defense Ignore and own-status AAP are on every piece in both. Agreed in principle: must-have substats first, then a labelled team-dependent slot (STATUS).
## 10 Nov 2026 — Signature Karma test 09 results saved (Claude)
- David's runs (9 Nov evening, Test Kit): Ryza +10–14% in three teams; Theresia +21%; Ornette +8% and Roxy +6% (both within chance); the Kalien team +41% with all three signatures. Table in TEAM_TESTS; Ryza's and Roxy's signatures are now marked Owned.
- STATUS: test 09 remaining runs; build status rule agreed (own status + the physical the hero needs).
## 9 Nov 2026 (late) — Skill buffs complete; build-model defaults agreed (Claude)
- `SKILL_BUFF_LEVELS`: added Tarte's Cure, Alex's Guard Counter, Astria's Reload and Siege Assault (20% → 40% Attack Power). Every scaling buff on a levellable skill is now recorded.
- Defaults David set for the preview builds: toughest boss with a Training Ogre switch; only statuses the hero applies; set effects always on, or always on and half of a 60 s fight side by side (STATUS).
## 9 Nov 2026 (late) — All 20 Lv.70 base stats in data.json (Claude)
- With David's OK: `HERO_BASE_STATS` for Eileen, Lute, Othello (B), Aria, Cerese, Astria, Dana (C), Ornette (A) and Alex (new profile D) are now measured (`estimated: false`). All C heroes are stored with Defense 320 (the panel gives 319.5). `HERO_STAT_MODEL` gets profile D, profile labels (melee, ranged, halfway, Defender) and an updated note.
- `tools/hero_stats.py`: no build changes. Validator OK. Local check: plain and `?tiers=new` load with no console errors.
- David's answers recorded: full-model builds go into the preview now and public at launch (SITE, LAUNCH_CHANGES); Signal uptime (GAME_MATH 4.1).
## 9 Nov 2026 (evening) — Lv.70 profiles explained, gear rows checked, endgame gear analysis (Claude)
- **Test 08, all 20 heroes at Lv.70** (Test Kit, David): the 11 already measured match their records (Sion's entry reads 1142 Attack, 1 below his stored 1143; rounding). The 9 new heroes: B Eileen, Lute, Othello; C Aria, Cerese, Astria, Dana; A Ornette; **new profile D: Alex 1014 / 379 / 7850**. Not in `data.json` yet (asked David first, because hero pages show base stats).
- **Profiles explained** (GAME_MATH 2.1): one defence-to-offence axis; B = all melee basic attacks, C = all ranged, A = exactly halfway, D = one step below B. Monster material, second material, archetype, faction, role and source ruled out.
- **Skill buffs** (Test 02): every scaling buff on a levellable skill is recorded except Astria's Siege Assault (+40% Attack Power at Lv.10) and two hostility values on Alex (no damage effect). Mastery passives don't level.
- **Gear rows** (Test 03): 19 new rows (Blue, Purple, Orange) all match the tables within rounding. Values confirmed by the new rows: Legs Attack Power Up (was an estimate), Legs Max HP Up, Helmet and Boots Defense Up, Boots Crit Rate and Crit Damage.
- **Endgame analysis** (GAME_MATH 4.1, new `tools/endgame_gear.py`): against Defense 1825, Attack Power Up mains are still best; the optimum is about 52–74% Crit Rate and 82–120% Crit Damage; forcing 80/150 costs 3.6–8.3%. Defense Ignore is the top substat, and status AAP substats beat Attack Power Up substats when the statuses are up. Earthshatterer is the best 3-piece for all five heroes tested (next best 6–9% behind) if its 10 s window is up more than about 52–57% of the time.
- No change to `data.json`, `index.html` or the site.
## 9 Nov 2026 — David's answers recorded (Claude)
- Hero level doesn't change Super Armor gauge damage (Castella Lv.20 vs Lv.70), so all Test 01 break times stand (TESTING, GAME_MATH).
- All team tests wait until every hero is Lv.70 (STATUS).
- Test 09: the signatures are Lv.1, so compare with any Lv.1 normal Karma of the same archetype (TESTING, STATUS).
- Launch checklist: rebuild the public Teams page (`TEAM_DATA`) from the tested and rated planner teams (LAUNCH_CHANGES).
## 9 Nov 2026 — Team Planner: in-game facts restored (Claude)
- David confirmed in game what Claude's check had wrongly removed: Tarte's Bolt Bubble keeps casting after she swaps out (the next hero's Shock detonates the orbs), and Chako keeps fighting while Dana is swapped out. He also confirmed that Cerese shatters Othello's Ice Prison. Restored in planner teams t04 and t05. t03 now states David's rule: a hero who applies their own needed status slowly still needs an enabler (Theresia).
- Recorded in GAME_MATH (3.3), DECISIONS (roles), WORKING_WITH_DAVID (mistake: don't delete in-game facts the codex doesn't state; ask). TEAM_TESTS and the planner backup refreshed.
## 9 Nov 2026 — Team Planner checked: teams rebuilt independently, false claims fixed, 5 new teams (Claude)
- At David's request, Claude built teams from the hero data alone (skills, statuses needed and applied, Test 01 rates, roles) before reading the planner, then compared. Matches: Airborne burst (t01), Shadow Poison (t02), Thunder pair (t06), Holy Bleed with Kalien (t11); each got a second, dated Claude note with what's new (Airborne per rotation, hit bonus totals, Charlotte's own Poison making Johnny's mostly redundant).
- Fixed (Why or note):
  - t03 said Theresia needs Stun or Bleed "from someone else"; she applies both, slowly.
  - t04 claimed Chako keeps fighting while Dana is swapped out (not in the codex), and listed Cerese's shattering as a plus (David found it works against Othello).
  - t05's "17–18 s" came from a superseded Lv.1 estimate; "orbs keep coming after you swap out" isn't in the codex (asked David).
  - t10's note compared runs at different levels and gear; replaced.
- New ideas, status Idea: t12 Fire and venom (Kalsion, Johnny, Aria), t13 Double blessing (Ryza, Sion, Eileen), t14 Ice Prison (Dana, Othello, Sion), t15 Fox and crossbow (Kalsion, Kalien, Astria), t16 Frost tornado (Dana, Cerese, Reina).
- Repo: `docs/library/TEAM_TESTS.md` teams section regenerated from the planner; `docs/testkit/planner-backup-2026-11-09.json` teams refreshed; STATUS updated.
## 9 Nov 2026 — Notes cleaned up: one source of truth, finished work separated (Claude)
- David asked for every note to hold only current information, finished work moved to its own file, and `CHANGELOG.md` as the only log.
- **Correction:** only 11 heroes are Lv.70 (the 11 measured in `HERO_BASE_STATS`). Aria, Ornette, Lute, Eileen, Cerese, Othello, Dana, Alex and Astria are being levelled now. An earlier chat had written "all 20 heroes are Lv.70". Fixed in STATUS, TESTING, TEST01_RESULTS and the to-do page (item 1 is now "level the last 9 to 70, then measure"). Test 01 numbers stand, because application doesn't depend on hero level.
- New `docs/library/DONE.md`: finished tasks and answered questions. The to-do page's Done block and the completed parts of the old notes moved there.
- Retired, with their content moved: `docs/PROJECT_HANDOFF.txt` (the log now lives only in CHANGELOG), `docs/NEW_CHAT_BRIEFING.md`, `docs/TASK_dungeons_page.md`, `TODO_David_2026-10-29.txt`. The old to-do file's rating reasoning went to DECISIONS. Its launch checklist and three agreed-but-unapplied hero fixes went to LAUNCH_CHANGES: Charlotte's wrong "only 2 skills apply Poison" con, hidden statuses for Charlotte and Johnny, and Castella's review points. Its parked site ideas went to SITE.
- `DATA_REFERENCE.md`: the two dungeon sections are merged into one, and outdated lines are fixed:
  - `HERO_BASE_STATS` is no longer described as all estimates.
  - `TIER_LIST_V2` lists all 20 heroes as rated.
  - `DEFENSE_MODEL` and `LEVEL_COSTS` are shown as used by the calculators.
  - The title note is updated.
  - The old base-stat estimates and "open tasks" sections are replaced by a pointer to GAME_MATH and a short Procedures list.
- STATUS has a current-task line, the still-estimated gear values and the Crit Rate awakening re-check (both from the old to-do file). WORKING_WITH_DAVID has David's 9 Nov rules: the repo is the only source of truth; ask before touching folders or his PC; uploaded PNGs may be deleted after processing; say when the chat is compacted. TEAM_TESTS explains the planner statuses (Idea, To test, Works, Doesn't work). GAME_MATH records the mastery material cost. DUNGEON_ARTWORK_WORKFLOW keeps only the rules and the two open banners.
- `CHATGPT.md` was shortened: the architecture summary that duplicated AGENTS, SITE and DATA_REFERENCE is replaced by pointers, and a note from Claude explains the changes. `AGENTS.md` and `docs/README.md` were updated to match.
- Validation: `tools/validate_data.py` OK; no change to `data.json`, `index.html` or assets.
## 9 Nov 2026 — Game math and site notes; Test Kit v33; planner and to-do refreshed (Claude)
- New `docs/library/GAME_MATH.md` (every measured formula: levelling, EXP items, breakthroughs, skill levels, gear upgrades, stats, titles, Karma, the hit formula with definitions, DoT, status build-up, places and game modes, towers, Hunt bosses, Super Armor, the optimiser, known unknowns) and `docs/library/SITE.md` (how the page works, code map, data structure, GitHub and publishing, open site tasks). Both listed in `docs/README.md`.
- Test Kit v33 (artifact and `docs/testkit/dragonsword-test-kit.html`): new Before awakenings section with test 08 (Lv.70 stats: takes titles off and names the profile) and test 09 (signature vs a normal Karma, average gain); Test 01 text says the Lv.70 redo is done and explains gauge and break-time entries; the goblin-dummy coverage tag is off; tests 01–03 have fixed numbers.
- Team Planner: intro states the 9 Nov test conditions and the run-to-run spread (artifact v2 and source).
- To-do page: before-awakening items first (stats, signature tests, with their Test Kit numbers), done items moved to the bottom, renumbered 1–11.
- `DEFENSE_MODEL.levelCurve.note`: no longer says the calculator lacks a Currency Dungeon option (it has one).
## 9 Nov 2026 — Notes library (Claude)
- New `docs/README.md` (index of every note file) and `docs/library/`: `STATUS.md` (where things stand, the before-awakening checklist, mastery retests, open items), `WORKING_WITH_DAVID.md` (preferences and past mistakes), `TESTING.md` (Test Kit tests and conventions), `TEST01_RESULTS.md` (all 20 heroes' Lv.70 application, gauge and break times, generated from the Test Kit), `TEAM_TESTS.md` (team and signature runs, signature list), `DECISIONS.md` (roles, tags, rating rules and debates). Data copies: `docs/testkit/test01-apply-2026-11-09.json`, `docs/testkit/planner-backup-2026-11-09.json`. Every older doc and `AGENTS.md` now points to the index. To-do items 1 and 2 marked done.
## 8 Nov 2026 — Super Armor break tag for Castella, Astria, Dana and Kalien (Claude)
- `TIER_LIST_V2.heroes`: `sa` tag added to Castella, Astria, Dana and Kalien (break the gauge alone in 25 s or less). Othello and Ryza also qualify but already have three tags, so they go without; Theresia (27 s) waits for her mastery retest. The tag's description now states the rule. Preview only.
## 8 Nov 2026 — Alex's status application and Super Armor gauge; Test 01 redo complete (Claude)
- Test 01: 13 Alex entries at Lv.70 (David). Knockdown Smash 0.20 Knockdown; Guard Counter 0.33 Knockdown and 8% on a parry, 4% when it fails; about 1% per hit blocked in Guard Stance. Whole gauge in about 45 s. All 20 heroes now redone at Lv.70; the to-do page keeps the mastery retests.
## 8 Nov 2026 — Ornette's status application and Super Armor gauge (Claude)
- Test 01: 17 Ornette entries at Lv.70 (David). Holy Cross 0.24 Shock and 5% from the swing, 0.10 and 7.5% from the moving cross; Holy Circle 0.22 Shock; Judgment 0.25 Knockdown at 1 Shock stack, 0.40 at 2, 10% gauge; Holy Grab 0.28 Shock and 12.5%, no Airborne on the boss. Whole gauge in about 30 s.
## 8 Nov 2026 — Cerese's status application and Super Armor gauge (Claude)
- Test 01: 16 Cerese entries at Lv.70 (David). Ice Storm (full 5 s tornado) 0.25 Frost, 0.20 Airborne, 15% gauge; Frozen Needles 0.25 Frost; the rest under 5%. Whole gauge in about 40 s. Othello's 20 s break explained (short cooldowns, quick dash attack, Ice Grab mount in about 10 s).
## 8 Nov 2026 — Othello's status application and Super Armor gauge (Claude)
- Test 01: 20 Othello entries at Lv.70 (David). Frozen Stinger 0.20 Frost; Ice Crown 0.15 Knockdown and Frost rising from 0.05 to 0.20 over the Ice Prison (about 20 s); Ice Grab 0.20 Frost at 1 stack, 0.25 Knockdown at 2; Frozen Burst per source. Gauge 1–10% per skill, yet the whole gauge goes in about 20 s. With his Ice Prison, Dana fits at most 4 Ice Block Chako Knuckles.
## 8 Nov 2026 — Dana's status application and Super Armor gauge (Claude)
- Test 01: 17 Dana entries at Lv.70 (David). Chako Knuckle 0.25 Frost and 22% gauge at 1 stack, 35% as the single blow (2 stacks, Knockdown or Ice Block); Chako Spin 0.15 Frost, 17.5%; Summon Chako 0.15 Frost, 0.10 Knockdown, 12%. Whole gauge in about 23 s alone, about 7 s in the freeze team.
## 8 Nov 2026 — Astria's status application and Super Armor gauge (Claude)
- Test 01: 10 Astria entries at Lv.70 (David), normal and Precision Shot mode. Wide Shot 17.5% (22.5% in the mode), Bolt Bombard 18%, basic 6 bolts 12% (0.20 Stun and 35% in the mode). Whole gauge in about 18 s, tied with Castella.
## 8 Nov 2026 — Aria's status application and Super Armor gauge (Claude)
- Test 01: 16 Aria entries at Lv.70 (David). Air Bomb 0.22 Burn, 0.20 Airborne and 12% gauge; Rolling Bomb 0.23 Burn, 0.10 Airborne, 6%; Switch On! with 3 bolts 0.20 Burn, 0.10 Airborne, 6% (a basic Bomb Arrow explodes like one bolt). Whole gauge in about 50 s. Lute's Healing Circle corrected to 0.25% gauge.
## 8 Nov 2026 — Lute's status application and Super Armor gauge; mastery retest list (Claude)
- Test 01: 10 Lute entries at Lv.70 (David). Stun Slash 0.20 Stun; Swordgrab 0.25 Knockdown and 10% gauge; the rest 0.05–3%. Whole gauge in about 75 s. David's to-do page now lists a mastery retest for each tested hero, naming the skill to test first, then the all-out break time.
## 8 Nov 2026 — Sion's status application and Super Armor gauge (Claude)
- Test 01: 17 Sion entries at Lv.70 (David). Divine Crash 0.25 Shock and 12.5% gauge with no relic placed, 0.27 and 2.5% with one; Divine Smash and Justice Fall 0.20 Knockdown each; the rest under 2% gauge. Whole gauge in about 50 s.
## 8 Nov 2026 — Tarte's status application and Super Armor gauge; Theresia retest noted (Claude)
- Test 01: 20 Tarte entries at Lv.70 (David). Lightning Shock press 0.25 Shock (0.60 with all 26 Bolt Bubble orbs), charge 0.33 (about 0.50 with 8 basic orbs, 0.90 with 26 Ultimate orbs); Thunderbolt 0.15 Shock and 0.25 Stun; gauge at most 7.5%. Only 50% of the gauge after about 67 s. Theresia: basic in Heretic Judgment mode 4% gauge (same as outside); dash rotation 35 s; retest after her mastery is unlocked added to David's to-do page, whose Test 01 item now lists the heroes still to redo.
## 8 Nov 2026 — Theresia's status application and Super Armor gauge (Claude)
- Test 01: 19 Theresia entries at Lv.70 (David), normal and Heretic Judgment mode. Consecration 0.15 Bleed and 4% gauge plus the 10 s blood aura (0.12 Bleed, 2%); Celestial Verdict 0.20 Stun and 10% gauge, 0.25 and 15% in the mode; Holy Rise 0.20 Airborne. Whole gauge in about 27 s.
## 8 Nov 2026 — Ryza's status application and Super Armor gauge (Claude)
- Test 01: 17 Ryza entries at Lv.70 (David). Shock 0.06–0.33 (Stormbringer 0.33 with 0.20 Airborne); Thunder Grab Knockdown 0.20 at 1 stack, 0.25 at 2; gauge 10–12% on Stormbringer and Thunder Grab, 5% on basic and jump. Whole gauge in about 25 s.
## 8 Nov 2026 — Johnny's status application and Super Armor gauge (Claude)
- Test 01: 17 Johnny entries at Lv.70 (David). Poison 0.12–0.25 and Airborne 0.20–0.25 on four skills; Poison Grab 10% gauge at 1 or 2 stacks, the rest 1.5–6%. Whole gauge in about 39 s.
## 8 Nov 2026 — Roxy's status application and Super Armor gauge (Claude)
- Test 01: 19 Roxy entries at Lv.70 (David). Bleed 0.06–0.33 per skill, Crimson Spiral 0.20 Stun, Bleeding Grab at 2 stacks 0.25 Knockdown and 10% gauge; the rest 1–7.5%. Whole gauge in about 50 s. Eileen's Rolling Upper confirmed: launches enemies without the Airborne status.
## 8 Nov 2026 — Eileen's status application and Super Armor gauge (Claude)
- Test 01: 9 Eileen entries at Lv.70 (David). Barraging Spear 0.25 Airborne; Vanguard Banner 15% gauge (spread over time), the rest 0.5–4%. Whole gauge in about 61 s.
## 8 Nov 2026 — Reina's status application and Super Armor gauge (Claude)
- Test 01: 11 Reina entries at Lv.70 (David). Airborne 0.20–0.25 per skill (Wind Slayer per charge, 2 charges); Wind Grab 11% gauge, everything else 2.5–4%. Whole gauge in about 50 s.
## 8 Nov 2026 — Test 01 cleared for David's Lv.70 redo; Charlotte recorded (Claude)
- Test Kit storage: the 201 older Test 01 entries removed at David's request (he is redoing every hero); all 254 entries as they were are kept in `docs/testkit/test01-apply-backup-2026-11-08.json`. Kept: today's Castella gauge, Kalsion and Kalien. Added 15 Charlotte entries: Poison Dagger 0.50 Poison, Shadow Grab 10% gauge as her best, whole gauge in about 40–41 s.
## 8 Nov 2026 — Kalien's status application and Super Armor gauge (Claude)
- Test 01: 16 Kalien entries on the Training Ogre at Lv.70 (David). Big skills 0.23–0.30 Burn and 10–15% gauge; Finale adds 0.20 Stun; small attacks 1–3% gauge. Whole gauge in about 25 s going all out.
## 8 Nov 2026 — Kalsion's status application and Super Armor gauge (Claude)
- Test 01: 27 Kalsion entries on the Training Ogre at Lv.70 (David, % overlay for the gauge): every skill with and without Royal Flame. Best gauge damage: Explosion charge and Flame Wave long-range charge, 12% each. Royal Flame Flame Wave press: 0.33 Burn, 0.20 Airborne, 10% gauge. Whole gauge in about 30 s going all out (Castella 18 s).
## 8 Nov 2026 — Castella's Super Armor gauge damage (Claude)
- Test 01: 9 Castella entries on the Training Ogre, measured with David's % overlay on the boss bar (Skill ~23%, Ultimate ~15%, whole gauge in 18 s). `DAMAGE_TESTS.findings`: application and gauge damage don't depend on hero or skill level.
## 8 Nov 2026 — Test 01 entries for the five newest heroes (Claude)
- Test Kit storage: 33 status-application entries for Theresia, Tarte, Dana, Alex and Astria, taken from David's training-ground reports during the rating debates (Lv.1 heroes, marked 'From chat with Claude, estimate'). Test 01's note corrected: Reina, Aria, Roxy, Johnny, Lute and Sion already had boss entries.
## 8 Nov 2026 — Six more Lv.70 heroes measured (Claude)
- `HERO_BASE_STATS`: Ryza, Theresia, Castella profile B (1100 / 350 / 7388); Roxy, Sion profile A (1143 / 335 / 7157); Tarte profile C (1186 / 320 / 6927). 11 of 20 heroes now measured.
## 8 Nov 2026 — Reina and Kalsion Lv.70 measured (Claude)
- `HERO_BASE_STATS`: Reina 1100 / 350 / 7388 (same as Johnny, profile B); Kalsion 1099 / 350 / 7388, one Attack lower for an unknown reason.
## 8 Nov 2026 — Kalien Lv.50–70 measured: a third breakthrough profile (Claude)
- `HERO_BASE_STATS.Kalien` measured at Lv.70 (1186 / 320 / 6927), profile C: her breakthroughs add more Attack and less Defense and HP than A or B (192 / 45 / 692 up to Lv.50, then +65 / +15 / +231 at Lv.60). Her 21 levels from 50 to 70 follow the shared level curve within 2 Attack and 12 HP; curve refitted on them. Other estimates moved by up to +9 Max HP.
## 8 Nov 2026 — Johnny's Lv.70 stats measured; level curve refitted (Claude)
- `HERO_BASE_STATS.Johnny`: 1100 / 350 / 7388 measured (David; no gear or Karma, titles removed). Charlotte and Johnny, on different breakthrough profiles, came out with the same level part at Lv.70 (929.7 / 260 / 6003), so the level curve, not the Lv.60 breakthrough, was low. `HERO_STAT_MODEL.levelCurve` refitted with Lv.70 added; `hero_stats.py --write` raised every estimated hero by about +10 Attack, +1 Defense and +50 Max HP (profile B now 1100 / 350 / 7386).
## 8 Nov 2026 — Charlotte's Lv.70 base stats measured (Claude)
- `HERO_BASE_STATS.Charlotte`: 1143 / 335 / 7157 (Attack / Defense / Max HP), measured by David with no gear or Karma and the owned titles taken off. The estimate was 1133 / 335 / 7105 (Attack 0.9% and HP 0.7% low). First measured Lv.70 hero.
## 8 Nov 2026 — A cup for every achievement category (Claude)
- `achievements.json` `fame.categories`: Pioneer's Title (Explore), Name of Prowess (Quest), Title of Wisdom (Collect), Name of the Strong (Combat), The Fame of the Challenger (Special), each with its cup icon, description, points per achievement and the stages seen. The Achievements page shows all five. Special gives 25 points per achievement and its Stage 1 needs 100 Fame. Name of Prowess recut to match the others; uploads removed.
## 8 Nov 2026 — David's priority to-do list updated (Claude)
- `docs/dragonsword_david_todo_by_priority.html`: done items removed (ratings, combo check, Test 05, obtain info, Fame icon, Quest items, Codex icon, Barbarian and region checks); new items for levelling to 70, Lv.70 team tests, Hunt weakness (Test 07), signature tests, Tower Defense and boss application. Now kept in the repo so it isn't lost again.
## 8 Nov 2026 — Quest item, Name of Prowess, Codex icon, Test Kit refresh (Claude)
- Item Database Quest tab: new `assets/items/quest.json` with A Thank-You Note from the Phantom Thief of Dawn and its icon; descriptions keep their paragraph breaks.
- Achievements: Fame note now read from `achievements.json` `fame` (renamed Name of Prowess, with its cup icon cut out and the stage rewards: stages 1 to 3 at 50/100/150 Fame per category, each 100,000 Gold + 50 purple crystals).
- Menu: Guides uses the Codex book icon, recut from David's menu screenshot (`assets/ui/guides.webp`, `UI_ICONS.guides`).
- `docs/LAUNCH_CHANGES.md`: Kalsion's obtain confirmed as Chapter 4, Adventure Quest 40; Cerese's (Adventure Quest 30, end of Chapter 3) added.
- Test Kit: test 05 (level costs) and the Defense debuff stacking moved to Already answered; all 20 heroes in the hero lists; tests 01, 02 and 06 updated to what's still open (boss application, Towers of Trials Defense); new test 07, Hunt boss weakness on Nightmare and up.
- Uploaded screenshots in `assets/ToDo_NeedsToBeSorted/` removed after cutting (in git history).
## 8 Nov 2026 — Levelling calculator: Karma materials by archetype (preview, Claude)
- In Karma mode, pick an archetype icon to see the crystal, Trait Stones and Chronographs for the range, with runs (crystal from its Normal Dungeon, stones from the archetype's Trait Dungeon boss), Chronograph prices (Klonie 150,000 Gold or 20 Adventurer's Emblems each) and EXP runs of Residual Worm Cleanup Zone on Very Hard (60 Arcana of the Future each). New `karmaPattern.table`; the Lv.40 example's 'Orb of Recollection' typo fixed.
## 8 Nov 2026 — Titles 38/109; calculator level cap and Insignia prices (Claude)
- `TITLES`: Feather of Burning Ashes, Hungry Eye, Crushing Darkness obtained (38/109).
- Levelling calculator (preview): From and To level boxes stop at 70 (`calc.maxLevel`). Insignia lines show the price from Klonie in Orbis Castle (100,000 Gold each) or the Exchange (20 Adventurer's Emblems each), from `calc.insigniaBuy`.
## 8 Nov 2026 — Levelling calculator: hero picker, materials and dungeon runs (preview, Claude)
- Pick an archetype icon, then a hero portrait (both with hover names), to see that hero's breakthrough materials for the level range and how many runs of each Normal Dungeon difficulty they take. EXP shows runs of Residual Worm Cleanup Zone on Very Hard (45 Tomes of Heroes each); Insignia are shown as Exchange only; Gold isn't counted. New `breakthroughs.heroTable` and `heroPattern.insignia`. Kalien's Lv.50 example corrected to 5 Insignia (David).
## 8 Nov 2026 — Dana's breakthrough materials; all 20 recorded (Claude)
- `LEVEL_COSTS.breakthroughs.heroPattern`: Dana uses Monster Hide + Drop of Purity. All 20 heroes recorded; first material has no rule.
## 8 Nov 2026 — Breakthrough materials for Alex, Theresia, Tarte, Sion, Astria (Claude)
- `LEVEL_COSTS.breakthroughs.heroPattern`: 19 of 20 heroes recorded. New first material Monster Carapace (Alex); Monster Essence adds Theresia and Astria; Tarte uses Monster Hide; Crushing uses Fruit of Vitality.
## 7 Nov 2026 — Hero Quest signature Karmas owned (Claude)
- `KARMA_DATA`: Cerese, Othello, Ornette, Dana and Theresia signature Karmas marked owned (Hero Quest rewards), with Kalien, Kalsion and Charlotte: 8 of 20.
## 7 Nov 2026 — Title Inquisitor, signature Karmas owned (Claude)
- `TITLES`: Inquisitor obtained, 35/109. `KARMA_DATA`: Kalien, Kalsion and Charlotte signature Karmas marked owned.
## 7 Nov 2026 — Team Planner artifact (Claude)
- New shared planner (https://claude.ai/artifact/7k9fC5D1pShnjkX8R3PtYD, source `docs/testkit/dragonsword-planner.html`): 9 team ideas and a 20-hero Signature Karma farming order, editable by David, stored in its db (`teams`, `sigs`).
## 7 Nov 2026 — Tier list Overall / Single target / Groups switch (preview, Claude)
- In the Overall view, a switch re-sorts the grid by single-target or group ratings, without hovering.
## 7 Nov 2026 — Tag toggles, Castella applies Break (preview, Claude)
- New tier list: a small arrow under each hero with tags shows or hides that hero's tags, and a Tags button beside the filters shows or hides all of them (remembered per browser). Castella's Applies chip: Break in bold, then Stun and Airborne.
## 7 Nov 2026 — Applies chip, Johnny to Sub-DPS (preview, Claude)
- New `applies{main, also}` on Enablers and Enabler-tagged heroes, shown as an Applies chip in archetype colours (main in bold). Johnny moved to Sub-DPS with the Enabler tag.
## 7 Nov 2026 — Tier list roles: Main DPS, Sub-DPS, Enabler, Support (preview, Claude)
- New tier list has four role columns. Preview roles live in `TIER_LIST_V2.heroes[].role` (public `HEROES.role` unchanged). New Enabler role icon `assets/roles/enabler.webp` (the Enabler tag's puzzle piece on a blue circle). The Enabler tag is removed from heroes whose role is now Enabler and kept for Lute and Sion; its description now says it's an extra on top of the main role.
## 7 Nov 2026 — Theresia rated; all 20 heroes rated (preview, Claude)
- `TIER_LIST_V2.heroes.Theresia`: A overall, B single, S+ groups, Gatherer, Needs Stun or Bleed, agreed with David at base.
## 7 Nov 2026 — Alex rated (preview, Claude)
- `TIER_LIST_V2.heroes.Alex`: C overall, B single, C groups, Team buffer and Expert (−1), agreed with David. Team buffer tag text now includes lowering the enemy's Defense.
## 7 Nov 2026 — Finding: Defense debuffs multiply with Defense Ignore (Claude)
- `DAMAGE_TESTS.findings`: Alex's Guard Counter debuff (−10% Lv.1, −20% Lv.10, about 10 s, carries over on swap) multiplies with Earthshatterer's Defense Ignore. The calculator has no debuff input yet.
## 7 Nov 2026 — Tarte rated (preview, Claude)
- `TIER_LIST_V2.heroes.Tarte`: C overall, C single, B groups, Enabler, agreed with David at base.
## 7 Nov 2026 — Dana rated (preview, Claude)
- `TIER_LIST_V2.heroes.Dana`: A overall, A single, S groups, Easy, agreed with David at base (Lv.1, not yet built). He'll revisit once she's built like the others.
## 7 Nov 2026 — Astria rated (preview, Claude)
- `TIER_LIST_V2.heroes.Astria`: C overall, C single, C groups, Needs A? (level untested) and signature Karma, agreed with David after debate.
## 7 Nov 2026 — Coloured heroes, Refreshing Canary, titles, tower selector (Claude)
- Dana, Alex, Theresia, Tarte and Astria: colour portraits cut from David's Codex screenshots with `tools/image/codex_recolor.py`, now owned (all 20 heroes). Refreshing Canary: colour picture, owned; Bird group 2/4. Titles: Snow Alchemist, Saintess of the Dawn, Red Fox obtained (34/109). Source PNGs removed (in git history).
- Damage calculator (preview): the Tower of Trials selector shows, and counts, only with the World switch on, ready for a separate Tower switch once tower Defense is tested.
## 7 Nov 2026 — Calculator: Weak to only in Trait Dungeons (preview, Claude)
- The Weak to selector shows, and counts, only with the Trait Dungeon switch on.
## 7 Nov 2026 — Calculator: coloured tower and weakness bonuses (preview, Claude)
- Status table shows a gold +xx% badge, with a hover note, beside the hit bonus when the Trait Dungeon weakness is set and beside Additional Damage when a Tower of Trials is chosen. Display only; the maths is unchanged.
## 7 Nov 2026 — Notes on upcoming heroes and content (Claude)
- New `assets/upcoming/` with David's notes on Jerome, Veronica, Logan and Viola, the story premise and announced expansions, plus his Veronica screenshot. Not shown on the site.
## 6 Nov 2026 — Title Sage of the Blue Moon (Claude)
- `TITLES`: Sage of the Blue Moon obtained, 31 of 109.
## 6 Nov 2026 — Ogre added (preview, Claude)
- `DEFENSE_MODEL.types`: Ogre ×1.1 from one Lv.75 World hit; Harpy note adds Lv.67.
## 6 Nov 2026 — Calculator: Where switch and Boss checkbox (preview, Claude)
- Damage calculator's enemy section now has World (default), Normal Dungeon, Trait Dungeon and Currency Dungeon switches, with a Boss checkbox except in Currency. New `DEFENSE_MODEL.places`; dungeon entries left `types`.
## 6 Nov 2026 — Hidden enemy variants, Troll merged (preview, Claude)
- `DEFENSE_MODEL`: identical-looking Harpies measured at both ×1.0 and ×1.05, noted on the curve. Troll merged back to one entry at ×1.1, as David confirmed the earlier ×1.1 hits were blue.
## 6 Nov 2026 — Currency Dungeon Defense confirmed, Ent and Troll colours (preview, Claude)
- `DEFENSE_MODEL`: Currency Dungeons confirmed at ×0.4 in two dungeons, curve gains Lv.20 and Lv.35 from them. Ent ×1.05 added; Troll split into blue ×1.05 and purple ×1.1.
## 6 Nov 2026 — Enemy Defense: recolours, new types, Currency Dungeons (preview, Claude)
- `DEFENSE_MODEL.types`: Goblin Barbarian ×1.05 → ×1.1, Spider ×1.05 → ×1.0, new Armored Warg, Orc Barbarian and Sand Claw at ×1.1. Curve note records recolour results, Sand Claw Dragus and the low Currency Dungeon Defense. Test Kit: Orc Barbarian and Sand Claw added to test 06.
## 6 Nov 2026 — Enemy Defense at Lv.75 (preview, Claude)
- `DEFENSE_MODEL`: World Lv.75 basic enemy measured at 841 and added to the curve. Notes added to Ghoul, Harpy, Spider and Troll, whose hits disagree across levels. Endless Summoning Grounds noted as not following the curve.
## 6 Nov 2026 — Enemy levels for all dungeons (preview, Claude)
- `enemyLevel` recorded for all 15 Normal and 5 Currency Dungeons at each difficulty, from David's in-game checks.
## 6 Nov 2026 — Enemy level bar on dungeon cards (preview, Claude)
- Normal and Currency Dungeon cards show a small "Enemy Lv." bar beside the I/II/III circles, which follows the chosen difficulty. It shows `?` until David's levels are recorded in `enemyLevel`.
## 6 Nov 2026 — Calculator locks required statuses (preview, Claude)
- Damage calculator: choosing a skill that needs a status ticks and locks it. Your own ticks come back when you change skill.
## 5 Nov 2026 — Levelling calculator (preview, Claude)
- Tools page: Hero and Karma levelling calculator, using the game's item-picking rule, with tabs for the two tools. `LEVEL_COSTS` has Karma EXP to 70, the Karma breakthrough at 60 and item icons.
## 5 Nov 2026 — Hero EXP to 70, Tome of Heroes (preview, Claude)
- `LEVEL_COSTS`: Hero EXP measured to level 70, hero breakthrough at 60 (80,000 Gold), Tome of Heroes at 5,000 Gold. Icon added to the Currency Dungeon and the Item Database.
## 5 Nov 2026 — Barpedin, Tome of Heroes (preview, Claude)
- World Boss spelling corrected to Barpedin. Tome of Heroes added to `LEVEL_COSTS` at 20,000 Hero EXP (Gold unknown) and to Test Kit test 05.
## 5 Nov 2026 — Chapter 8: last bosses, dungeon, familiar, titles, runes (preview, Claude)
- Tier list: Hunt boss Earthlander of the Ravenous Earth and Raid boss Ursula, whose tab fades between her two forms in purple, with a new self-hosted font. No locked boss tabs left.
- Currency Dungeons: Residual Worm Cleanup Zone, no locked entry left. Tome of Heroes shows as text until it has an icon.
- Stormy Direwolf in colour and owned; `TITLES` at 28; `RUNES` values added; Gigantic Tooth in the Item Database; 3 more gear rows checked.
- Uploaded PNGs converted to WebP and deleted.
## 5 Nov 2026 — Test 01 entries from the rating chat (Claude)
- Test Kit: 47 status entries saved from David's rating discussions, marked as estimates; Kalien, Othello and Ryza added to the hero lists.
## 5 Nov 2026 — Othello rated (preview, Claude)
- `TIER_LIST_V2`: Othello B overall, B single target, A groups, Gatherer, Self-sufficient, Expert −1. New finding in `DAMAGE_TESTS`: Ryza and Othello at equal Attack. Public text changes added to `docs/LAUNCH_CHANGES.md`.
## 5 Nov 2026 — Towers start Unrated (preview, Claude)
- New tier list, Towers mode: heroes are Unrated until rated for that tower, rather than showing their Overall tier faded.
## 5 Nov 2026 — Sion rated (preview, Claude)
- `TIER_LIST_V2`: Sion B overall, B single target, A groups, Team buffer, Enabler, Needs A1. New finding in `DAMAGE_TESTS`; Divine Smash corrected from Stun to Knockdown there and in the Test Kit.
## 5 Nov 2026 — Ryza rated (preview, Claude)
- `TIER_LIST_V2`: Ryza A overall, A single target, S groups, Gatherer, Self-sufficient, Expert −1. New finding in `DAMAGE_TESTS`. Public text changes added to `docs/LAUNCH_CHANGES.md`.
## 5 Nov 2026 — Kalien rated (preview, Claude)
- `TIER_LIST_V2`: Kalien B overall, C single target, A groups, Enabler, Needs A1, signature card. About text: Masteries aren't part of the base kit. New finding in `DAMAGE_TESTS`, including that ticks keep the Attack from when Burn was applied.
## 5 Nov 2026 — Kalsion rated; ratings are for base kits (preview, Claude)
- `TIER_LIST_V2`: Kalsion A overall, B single target, S groups, Gatherer, Needs Airborne. The About text and signature Karma text now say heroes are rated on their base kit.
- New `docs/LAUNCH_CHANGES.md`: Kalsion's corrections that touch public pages.
## 5 Nov 2026 — Calculator: Explosion press and hold (preview, Claude)
- `DAMAGE_CALC.skillAdjust`: Kalsion's Explosion, press 5 hits x0.6 and hold 15 hits x1.35 of the codex %, measured from David's hit numbers with Airborne up. New finding in `DAMAGE_TESTS`.
## 5 Nov 2026 — Calculator: press and hold, measured skill corrections (preview, Claude)
- David's whole-skill tests on Reina and Kalsion: new `DAMAGE_CALC.skillAdjust`, a "How it's used" choice for Flame Wave, and notes on Royal Flame's Attack buff. New finding in `DAMAGE_TESTS`.
## 4 Nov 2026 — Calculator enemy picker (preview, Claude)
- Damage calculator: pick enemy type, dungeon or world and level, and it works out Defense from test 06 (`dcEnemyDef()`). World Bosses and the dummy stay fixed values; typing a Defense still works. Rough Mantius entries removed, now covered by Trait Dungeon types.
- `DEFENSE_MODEL`: `levelCurve` merged into one curve with `worldFactor`; new `types` list replaces `typeMultipliers`. New finding in `DAMAGE_TESTS`.
- Back-test on all 101 entries: 93 within 1 damage, 96 within 1%. The 5 misses are listed in `docs/PROJECT_HANDOFF.txt`.
## 4 Nov 2026 — Enemy Defense: third test batch, gear rows (Claude)
- `DEFENSE_MODEL`: dungeon curve to Lv.70, world curve at about x0.8, updated type multipliers and open questions. New finding in `DAMAGE_TESTS`. Not used by the page yet.
- `GEAR_STATS.valueSources`: 93 Test Kit rows checked against the tables, upgrade steps per rarity recorded. The "flat stats 1–2% high" note is resolved: it came from comparing with 4x the +0 value.
- Test Kit test 06: Save button now sits above the enemy table.
## 4 Nov 2026 — Enemy Defense: second test batch (Claude)
- `DEFENSE_MODEL`: separate dungeon and world curves, more type multipliers, dungeon bosses x1.3, and 5 World Bosses added (they now appear in the calculator's enemy list). New finding in `DAMAGE_TESTS`.
- Test Kit test 06: Goblin Barbarian replaces Goblin Chief, Reaper added, Fierce Ironclad Warg replaces the Warg boss placeholder.
## 4 Nov 2026 — Enemy Defense: first test batch (Claude)
- `DEFENSE_MODEL`: new `levelCurve` and `typeMultipliers` from Test Kit test 06; new finding in `DAMAGE_TESTS`, including that Break doesn't lower Defense. Not used by the page yet.
## 4 Nov 2026 — Damage calculator and Enemy Defense test (preview, Claude)
- Tools page: damage calculator from panel stats (non-crit, crit, average), with small print for what Armor Penetration and Defense Ignore add. New key `DAMAGE_CALC`. Public page unchanged.
- Checked against 41 of David's recorded hits: all within 0.21%. 23 use the clean hit as their baseline, so they test the bonuses rather than Defense.
- Test Kit: new test 06 Enemy Defense, with a green/red table by enemy type.
## 4 Nov 2026 — AGENTS.md trimmed, test 04 done (Claude)
- `AGENTS.md` is now rules, workflow and a key index (loaded with every message). All the detail moved unchanged to the new `docs/DATA_REFERENCE.md`.
- `DEFENSE_MODEL`: Berpedin is Lv.80, above the Lv.90 dummies' Defense, so Defense doesn't follow level alone.
- Test Kit: test 04 moved to Already answered (entries kept in storage); the level-up test keeps number 05.
## 4 Nov 2026 — Defence formula confirmed on a World Boss; notes brought up to date (Claude)
- `DEFENSE_MODEL`: from David's 3 Test Kit hits on Berpedin, the Crushing Darkness: K = 1,000 is a constant and Berpedin has about 1,197 Defense (1,193–1,201). All 10 test hits fit within 0.5 damage. Added enemies (rough ones marked), checks and what each point is worth. New finding in `DAMAGE_TESTS`. Not on the page.
- Stale notes fixed in `AGENTS.md`, `CHATGPT.md`, `docs/PROJECT_HANDOFF.txt` and `docs/NEW_CHAT_BRIEFING.md`: Goblin alignment done, Currency now 4 discovered and 1 locked, full preview page list, item catalogues in use, levelling calculator waits on levels 51–70. This file's newest-first order fixed.
## 4 Nov 2026 — Handoff files (Claude)
- `docs/NEW_CHAT_BRIEFING.md` (briefing for a new chat), `docs/testkit/dragonsword-test-kit.html` (Test Kit backup), `tools/image/` (Codex card-cutting scripts).
## 4 Nov 2026 — Defense formula, costs to level 50, titles 25/109 (Claude)
- New `DEFENSE_MODEL`: damage ∝ K / (K + Defense × (1 − Defense Ignore) − Armor Penetration); Training Ogre Defense 1,000, K 1,000; fits all 7 test points within 0.06%.
- `LEVEL_COSTS`: Arcana of the Future 3,000 Gold; Hero/Karma EXP to level 50; breakthrough examples (Karma 50 = 50,000 Gold).
- Titles 25/109 (Restorer of Grace, Pioneer of the Wind Path, Guide of the World, Tycoon). 8 more gear rows match the tables.
## 4 Nov 2026 — Item Database and Achievements (preview, Claude)
- Item Database page: tabs Materials / Ingredients / Important / Quest (Quest has no data yet), search, rarity filter; reads `assets/items/<tab>.json` when opened.
- Achievements page: search, category and ticked filters, a tick per achievement saved in the viewer's browser (`dsw.achievements.v1`), and a Fame stage rewards box (only Stage 1 recorded).
## 4 Nov 2026 — Guides, Tools and News menus (preview, Claude)
- New preview-only menu entries: Guides (book icon placeholder until David's Codex icon), Tools (wrench, empty page) and News (newspaper, disabled for now). Guides shows 8 categories from the new `GUIDES` key with placeholder 'soon' cards. Public page unchanged (checked).
## 4 Nov 2026 — Item list additions (Claude)
- `assets/items/materials.json`: Tangled Forgetfulness and Remembrance, Stilled Core of Collapse (Gallore the Collapse) and High-Grade Venom Stone, with icons, descriptions and sources from David's inventory screenshots.
- Ghoul Greed's note now names its last two rewards: Secret Text of the Warrior ×10, Record of Battle ×20.
## 4 Nov 2026 — David's Chapter 6 batch (Claude)
- New Hunt boss tab Ghoul Greed (Lv.45, preview tier list); the second Hunt slot stays undiscovered. Hunt bosses now show a Rating rewards panel (S 36,000 pts: 1 Stigma Awaken Stone; A–D: 50/25/15/10 Fragment of Sacred Light), from `TIER_LIST_V2.huntRatingRewards`.
- Necklace Soaked in Greed added to `assets/items/materials.json` with its icon.
- New Currency Dungeon Eroded Underground Cemetery (Gold), with description and rewards for I/II/III; banner art to come. One Currency Dungeon left undiscovered.
- Ryza owned (colour portrait); `profileFaction: The Six Heroes` (Codex group stays Other). Knightage Griffon owned (Griffon 2/4). Titles 21/109 (Elite Mercenary Crew, +190 Max HP).
- Runes seen: Damaged Protection 15 and 20, Intact Focus 1.80%.
- Raw Mana Stone costs 5,000 Gold per use (gear calculator updated). New `SKILL_BUFF_LEVELS` with the 8 buff rows from Test Kit test 02 (Kalsion's Weapon Blaze added).
- Gear rows: all % main stats match; Purple Defense and Blue Attack read ~1–2% above the estimate (noted in `GEAR_STATS.valueSources.flatLowerRarityNote`, tables unchanged).
## 3 Nov 2026 — Keep work current with GitHub

David requested always checking for newer commits and deployments, and applying this chat's work on top of them. Added the rule to AGENTS.md, including preserving other assistants' changes, checking again before pushing, and verifying the remote result. Fetched origin/main: b4f9bfe was current. GitHub deployment API returned Forbidden, so deployment status could not be independently verified. Documentation only; no application or data changes.

## 3 Nov 2026 — Restore original index.html line endings

Restored LF line endings without changing page content, and added an explicit preservation rule to AGENTS.md. Applied on top of the latest main changes. Verified identical content after newline normalisation and ran the data validator. User requested committing and applying the fix to GitHub.

## 3 Nov 2026 — Fit Currency Dungeon backgrounds inside the frame

- Inset the Currency Dungeon background image layer 9px with rounded clipping so it sits within the existing frame on all sides. This affects the three discovered preview cards; locked placeholders and frame artwork are unchanged.
- Updated `index.html`, `CHATGPT.md`, `docs/PROJECT_HANDOFF.txt` and `docs/DUNGEON_ARTWORK_WORKFLOW.md`; the change remains behind the existing `?tiers=new` preview gate. No data, frame asset or locked placeholder changed.
- Validation: inspected the frame SVG geometry and CSS stacking, reviewed the focused diff, then David confirmed on the live preview that all three discovered backgrounds fit inside the frame and difficulty switching works. Live visual verification was performed by David after GitHub checks completed.





## 3 Nov 2026 — Hero/Karma EXP to level 40, breakthrough costs (Claude)
- `LEVEL_COSTS`: EXP per level up to 40 and breakthrough Gold with material examples, from David's Test Kit entries.
## 3 Nov 2026 — Skill level costs (Claude)
- `LEVEL_COSTS.skills`: Gold and materials for every skill level, measured by David on Kalien (Explosion to Lv.10, Great Rush to Lv.7).
## 3 Nov 2026 — Level-up costs measured (Claude)
- Test Kit test 05 (David): Hero 1→20, Karma 1→20, Orange gear +0→+15. Gold is a price per EXP item: Basic/Advanced/Core Combat Text 200/650/1,800; Arcana of War/Beginnings/Peace 150/400/1,300; Mana Shard/Crystal/Ore 300/700/2,000. All 52 steps match. New key `LEVEL_COSTS`.
- Gear upgrade calculator (preview) now works Gold out from the items it picks.
- Fixed 19 Test Kit entries saved as Hero that were Karma (Rock-Splitting Ice).
## 3 Nov 2026 — David's 3 Nov batch (Claude)
- Titles: 20/109 (Dungeon Conqueror, Specter of Thirst, The Roamer, Tyrant, Falling, Skilled Hunter, The Predator, Scraping, Dark Necromancer added); cumulative bonuses recalculated from the passives.
- Karma: 21 cards now in colour and marked owned (23 owned), cut from David's Codex screenshots (name painted out as before); source PNGs deleted.
- Familiars: Abyssal Direwolf, Guardian Griffon and Brave Baby Dragon in colour and owned; species counts updated, so their first passive step now shows as unlocked.
- Runes: new values seen (Damaged Determination 21, Damaged Focus 1.60%, Refined Determination 49); removing an engraved Intact or Refined rune also costs 10,000 Gold. Rune screenshots converted to WebP.
- Gear: all 63 Test Kit main-stat rows match the gear tables (`GEAR_STATS.valueSources.testKitRows`).
- Checked the page after the ChatGPT/Codex changes: every page opens in the preview with no console errors; data.json validates.
## 3 Nov 2026 — Replace Goblin Bandits' Cave preview banners

- Replaced the existing Normal, Hard and Very Hard Goblin Bandits' Cave banner images with David's three supplied variants. Kept the existing filenames and data.json paths.
- All sources were 2172×724. Applied the same source-pixel crop to each (x=0, y=250, width=2172, height=312), then resized to the site's 1672×240 banner canvas. Blue is Normal, purple is Hard, and red is Very Hard.
- Preview-only dungeon visibility and the live public no-query view are unchanged; no HTML or guide data changed.
- Validation: confirmed all three source dimensions, output dimensions, matching crop geometry and aligned goblin placement in a comparison image; reviewed the diff. Browser rendering was not available in this task.

## 3 Nov 2026 — Reconcile Dungeons handoff and project notes

- Updated `AGENTS.md`, `CHATGPT.md` and `docs/PROJECT_HANDOFF.txt` to describe the shipped preview state instead of the obsolete pre-implementation Dungeons brief. Marked `docs/TASK_dungeons_page.md` as historical so future contributors do not follow superseded scope.
- Provenance: David clarified that he created the original Normal Dungeons foundation with the ChatGPT chat version. This project separately migrated Normal rewards to the Trait-style key/count model and data-driven item label/icon map, including EXP.
- Recorded current Normal page/artwork and the pending Goblin Bandits' Cave Difficulty I alignment; Currency's three discovered entries, two locked entries, complete confirmed reward tiers, data-driven icons, selection reset and approved backgrounds; and the nine Trait boss banner assignments.
- Preserved the release boundary: all new Dungeons content stays gated behind `?tiers=new`; the public no-query page is unchanged. Currency frame corner polish remains deferred to David's separate graphics pass.
- Documentation-only update; website code, data and artwork were not changed. Validation: reviewed diffs and confirmed the notes distinguish completed, pending and prior ChatGPT-authored work.

## 2 Nov 2026 — Main-only preview policy and durable handoff

- Updated AGENTS.md and CHATGPT.md with David's explicit main-only / ?tiers=new development policy, replacing conflicting branch advice. Added docs/PROJECT_HANDOFF.txt with the completed four-dungeon request, decisions, files, validation, publication method/commits and pending work.
- Removed three obsolete artwork staging branches after confirming no open PRs and all their banner references already present on main. Main retained.
- Validation: documentation-only changes; reviewed policy consistency and recorded completed versus pending work. Branch inventory and committed note contents verified after publication. Site code/data/assets unchanged in this task.

## 2 Nov 2026 — Final four Normal Dungeon artwork sets

- Added twelve 1672×240 WebP banners for Rock Tribe Base, Collapsed Sanctuary, The Graveyard Where Tragedy Sleeps and Ashen Ruins. Added only their per-difficulty banner paths in data.json; rewards, names, renderer, frames and preview gating remain unchanged.
- Rock Tribe uses corruption/inferno; Sanctuary uses escalating lich necromancy; Graveyard progresses from sleeping skeletal dragon to gathering spirits to spectral awakening; Ashen Ruins combines the skeleton commander, spiders and an undead troll with a venomous greed curse. David clarified that Tomb of Greed was a naming typo and Ashen Ruins is correct.
- Artwork generated using built-in imagegen. Production fitting preserves subject proportions with separate environment/subject framing and one consistent transform per dungeon across difficulties. Illustration masters remain saved locally.
- Validation: repository data validator passed; structural comparison against HEAD confirms only twelve banner paths changed. Browser checked all twelve difficulty selections at 1920×1080 and 2560×1440, including corresponding rewards and constant card size. Reviewed framed exports and local browser fit, browser error log empty; normal public URL hides dungeon navigation. index.html unchanged. Deployment wait intentionally omitted.

## 2 Nov 2026 — Match dungeon frame geometry across difficulties

## 2 Nov 2026 — Four more dungeon backgrounds

- Added all three difficulty backgrounds for Rusted Tusk Treasure Vault, Fang Bandits Arena, Dark Swamp and Forest of Entangled Roots. Existing frame colours, sizes, controls and rewards are unchanged.

## 2 Nov 2026 — Four-dungeon artwork batch

- Added twelve 1672×240 WebP backgrounds for Underground Goblin Village, Silver Tusk Bandits' Supply Depot, Warg Enclosure and Coastal Cliff Cave Outpost.
- `data.json`: added only their twelve per-difficulty banner paths. No rewards, existing artwork, frame geometry/colours or preview gating changed.
- Coastal artwork uses the corrected separate goblin nose/mouth anatomy approved by David; its variants add the whispering Dragon Worshipper and destructive power consuming the throne room. Other sets keep their distinct village, contraband and breeding-pen themes.
- `docs/DUNGEON_ARTWORK_WORKFLOW.md`: recorded batch publication and facial-anatomy lesson. Original illustration masters remain saved locally; production assets use consistent per-dungeon framing for difficulty switching.
- Validation: JSON/data validator passed; exact browser-edited JSON matches the validated local data; structural comparison confirmed only the twelve new banner paths. Tested every new card at all three difficulties at 1920×1080 and 2560×1440; selected artwork and reward values switch independently. Local visual screenshots reviewed; deployment wait omitted at David's request.


## 2 Nov 2026 — Corrupted Bedchamber difficulty artwork

- Added three 1672×240 WebP banners under `assets/dungeons/banners/`: the approved royal crypt and armoured skeletons, violet Dragon Worshipper necromancy for Hard, and an ember-red draconic presence for Very Hard (visually inspired by Gauron's dragon reference).
- `data.json`: added only the three per-difficulty banner paths for Corrupted Bedchamber. Rewards and other dungeon records are unchanged. Existing frame colours, geometry and preview gate are unchanged.
- `docs/DUNGEON_ARTWORK_WORKFLOW.md`: saved David's Dragon Worshipper/dragon art direction and the tomb's location/story context.
- Validation: JSON/data validator passed; exact browser-edited JSON matched the local validated data; structural comparison confirmed only the intended banner fields changed. Checked all three difficulty selections, frames, rewards and artwork at 1920×1080 and 2560×1440 in the local browser. Used the built-in image generation tool, with shared positioning and frame-fit exports.


## 2 Nov 2026 — Restore original dungeon frame colours

- `index.html`: restored the original purple and red frame assets without colour filters. Applied measured vertical size/position corrections to keep their outer corner spans matched to blue; retained the shared card dimensions and background crop.
- `docs/DUNGEON_ARTWORK_WORKFLOW.md`: corrected the frame rule to preserve the original colours.
- Validation: JavaScript syntax check passed; reviewed the three-line renderer diff; local browser comparison confirmed original assets, no colour filter, equal card heights and identical background clip paths. Visually inspected a three-frame comparison.


- `index.html`: all difficulties now share the blue frame master; purple/red colour filters affect only the frame. Removed the old per-frame crop offsets so backgrounds use one opening, and preserved the existing controls and rewards.
- `docs/DUNGEON_ARTWORK_WORKFLOW.md`: recorded the shared geometry rule and David's instruction to finish review tasks immediately after pushing.
- Validation: JavaScript syntax check passed; local browser checked independent Normal/Hard selections alongside Very Hard, identical frame source, dimensions and clip paths; visually inspected all three colours. No dungeon artwork regenerated or data changed.

## 2 Nov 2026 — Correct dungeon background clipping for each frame
- `index.html`: give the purple and red frames their own background clipping insets. All frame images have a 1672×240 canvas, but the painted top edges differ (blue around y=14, purple y=22, red y=20–21). The old shared crop started at y=18, exposing artwork above II/III. Updated both the illustration and tint/pending-art overlay clipping; purple's bottom crop also stays within its painted edge. Card/frame dimensions, control positions, game data and artwork files are unchanged.
- `docs/DUNGEON_ARTWORK_WORKFLOW.md`: recorded composition/framing lessons, the one-preview Proceed/Stop flow, and the Difficulty I goblin position/scale mismatch as a deferred fix due ASAP after all backgrounds are completed.
- `CHATGPT.md`: linked the artwork workflow so future work picks it up.
- Validation: inline JavaScript passed `node --check` and is unchanged; CSS braces balanced and targeted diff reviewed. Inspected purple/red illustrated cards and a blue pending card at 1920×1080 and 2560×1440; all cards measured 1224×175.6875 CSS pixels at both viewport sizes. Confirmed each difficulty's computed clip and existing rewards; no captured console errors. No images were regenerated.

## 2 Nov 2026 — Goblin Bandits' Cave difficulty artwork
- `assets/dungeons/banners/goblin-bandits-cave-{normal,hard,very-hard}.webp`: added the approved Normal preview and matching purple-corruption and red-inferno variants, generated from David's goblin screenshots and the approved cave composition. All three are 1672×240 and contain no UI; the goblin portraits are inset to keep both faces clear of the existing frame.
- `data.json`: added only the three optional difficulty banner paths for Goblin Bandits' Cave. Existing rewards, frames, controls, preview gating, other dungeons and renderer are unchanged.
- Validation: `tools/validate_data.py` passed; compared parsed data with the previous version and confirmed only these image references changed. Exercised all three selectors and verified their background URLs and existing reward values, inspected rendered screenshots at 1920×1080 and 2560×1440, and checked the browser console (no captured errors).

## 2 Nov 2026 — Warg Cave artwork for each difficulty
- `assets/dungeons/banners/warg-cave-{normal,hard,very-hard}.webp`: added three 1672×240 AI-generated, reference-based cavern backgrounds without baked-in UI. Normal uses cool teal lighting, Hard adds a purple aura, and Very Hard adds an inferno and a skull integrated into the cave.
- `data.json`: linked Warg Cave's existing difficulties to their artwork via optional `difficulties[].banner`, with the Normal image as the dungeon fallback. Game rewards and all other content are unchanged.
- `index.html`: prefer the selected difficulty's banner, falling back to the dungeon banner; reduce the old placeholder darkening on cards with artwork. Existing frames, controls, rewards, pending cards and preview gating remain intact.
- Validation: `tools/validate_data.py` and extracted inline JavaScript `node --check` passed; CSS braces balanced; reviewed the targeted source/data diff and verified game data is unchanged apart from image paths. Inspected all three rendered states at 1920×1080 and 2560×1440, checked the corresponding background URL and reward values, confirmed card size remains stable, the Ballad of Life filter returns 5 cards, and another dungeon's selection remains unchanged. No browser console errors were captured.

## 2 Nov 2026 — Visually verified dungeon control and reward placement
- `index.html`: moved only Difficulty III's overlay slightly right and down (18.36%, 33.7%) to align with the existing painted circle; I and II remain unchanged. Inset the lower-left reward row to 6% from the left and 20% from the bottom, including the mobile override; quantity badges now sit inside their boxes. Existing artwork, data, interactions and preview gating are preserved.
- `CHANGELOG.md`: recorded this fix and validation.
- Validation: inspected local HTTP preview screenshots at 1920×1080 and 2560×1440, including blue/purple/red frames; exercised Warg Cave's I/II/III rewards and the Ballad of Life filter (5 cards); confirmed Dungeons navigation is hidden without preview. No browser console errors were captured. `tools/validate_data.py` passed with the referenced assets present; inline JavaScript passed `node --check` and is unchanged; CSS braces balanced and targeted diff reviewed.

## 2 Nov 2026 — Fine alignment of dungeon difficulty II and III
- `index.html`: nudged the Difficulty II button overlay horizontally from 12.42% to 12.58% and III from 18.07% to 18.22% to better match the painted circle centres in both supplied fullscreen screenshots. Difficulty I, ring styling, banners and rewards are unchanged.
- Validation: verified only these two selectors changed; the inline JavaScript passed syntax parsing and was unchanged, CSS braces were balanced. Live browser render/interactions were not tested.

## 2 Nov 2026 — Normal Dungeons visual alignment
- `index.html`: aligned the three difficulty-button overlays more closely with their painted frame circles; replaced the selected button's outside glow with an inset highlight and softened unselected shading.
- Repositioned the reward row inside the ornate banner and inset quantity badges to keep them clear of the bottom border. Mobile override now retains relative banner alignment instead of applying fixed offsets.
- Validation: checked the JavaScript in the inline `<script>` with a parser-equivalent syntax check and confirmed CSS braces balanced. Reviewed each targeted CSS replacement against the previous text. Browser screenshot/rendered interaction testing was not available in this session.

## 2 Nov 2026 — ChatGPT: first Dungeons preview implementation
- `index.html`: added a collapsible Dungeons navigation group with Normal, Trait and Currency sub-pages; the new pages and menu entries are gated by `?tiers=new`, while the existing Trait Dungeons renderer/data remain unchanged.
- Normal Dungeons: renders all data-driven dungeon cards grouped by farm category, per-card I/II/III difficulty selection, gear rarity chips, EXP/emblem/material rewards, and search/set/slot/farm/Orange filters.
- Currency Dungeons: renders the three recorded entries and two locked undiscovered placeholders; no amounts are invented.
- Added `openDungeons({set, material, slot})` for filtered navigation and a temporary highlight.
- Validation in this session: re-fetched the committed `index.html` and confirmed the new renderer is present. Browser interaction, JavaScript parser validation and visual comparison against the source screenshot have not yet been performed. The card currently uses a neutral reconstructed panel, not a final screenshot-derived crop; visual refinement remains.


## 2 Nov 2026 — Dungeon banner frames fixed
- Difficulty buttons sit exactly on the frame's I/II/III circles; unselected ones are dimmed, the selected one has a thin ring.
- All three frames are the same size (WebP), so cards don't change height between difficulties; banner art is clipped to the inside of the frame.
## 2026-11-01 — Claude: Help pages and Crew grades
- `assets/help/`: David's Help screenshots (converted to WebP) with their text in `notes.txt`, plus the five Mercenary Crew promotions (requirements, unlocks, rewards). Notes only.






## 1 Nov 2026 — Dungeons data for the planned page
- `DUNGEONS` key in data.json (Normal and Currency Dungeons, with material icons).
- `docs/TASK_dungeons_page.md`: brief for building the Dungeons pages in the preview.
## 1 Nov 2026 — Normal Dungeon rewards
- `assets/dungeons/dungeons.json` and `notes.txt`: gear set, slots, rarities, EXP, Adventurer's Emblems and materials for all 15 Normal Dungeons on all three difficulties.
## 1 Nov 2026 — Small fixes
- Gauron's tab fade follows the clock, so switching tabs or views no longer restarts it.
- Runes box uses the in-game type icons (tab order from David).
- Disassemble typos confirmed by David; dungeon notes: what each group of Normal Dungeons is farmed for.
## 1 Nov 2026 — Gear upgrade calculator, Disassemble, Runes (preview)
- Gear page (preview only): upgrade calculator (EXP, Gold and auto-selected materials per level and in total), Disassemble returns (80% of EXP spent plus base materials), and a Runes box (types, stats, grades, values seen, Synthesis).
- New data keys `GEAR_UPGRADE` and `RUNES` from David's runes_gear_information.txt.
- Gauron's boss tab fades to his dragon form and back once a minute.
- `DAMAGE_TESTS`: Reina's 20% Defense Ignore test (+11.6%).
- All 39 main-stat rows in the Test Kit match the gear tables (`GEAR_STATS.valueSources.testKitRows`).
- `assets/dungeons/notes.txt`: Normal and Currency Dungeon list.
## 1 Nov 2026 — Gauron raid tab
- Raid boss tab glows red and its name is red with a black outline (`theme: "raid"`).
- New boss info panels under the boss tabs (The fights, Strategy, Rewards), filled for Gauron from David's raid screenshots and notes.
## 1 Nov 2026 — Story chapter 5 batch
- Colour portraits for Kalien and Othello (now owned); Dawn Wing Cat familiar (owned).
- Titles 11/109: Impregnable, One Who Erases Names, I Want to Do Missions, High-Ranking Mercenary Crew.
- Cerese, Othello, Ornette, Kalien, Dana and Theresia's signature Karmas: source is now their Hero Quest reward.
- Items: Wild Onion ingredient; Intermediate Monster Bone Fragment, Claw and Essence materials.
- Level 50 measurements (Reina, Charlotte): level curve refitted on L1–L50, L50 breakthroughs measured for both profiles; `hero_stats.py --write` rerun.
- Raid: Gauron added as the first Raid boss tab in the new tier list (preview); `assets/raid/` screenshots converted to WebP with `notes.txt`.
- Runes: five types and five grades recorded in `assets/runes/README.txt` from David's Raid video.

## 2026-11-01 — Claude: achievements, Mercenary Crew Level
- `assets/items/achievements.json`: 103 achievements with conditions, David's progress and the title each gives. Titles tab: Curious Hands and 【777】 now show their achievements.
- `assets/merc-crew/`: the free Crew Level reward track (screenshots + notes).

## 2026-10-31 — Claude: Cookbook tab (preview only)
- New Cookbook tab, hidden in the preview: all 73 recipes (17 discovered, the rest as '?' cards), progress per method, effect and method filters, ingredient search, effect at every star level, per-visitor 'Mark as cooked' ticks, and the star calculator (dish stars = 1 + sum of ingredient stars ÷ 3, rounded down). Dish pictures and the chef-hat menu icon cut from David's screenshots and videos.

## 2026-10-31 — Claude: cookbook notes
- New `assets/items/cookbook.json`: the 73 recipes by method (25 Grilling, 26 Boiling, 22 Slicing), the 17 David has discovered, their effects, ingredients and slot substitutes. Notes only.

## 2026-10-31 — Claude: materials list
- New `assets/items/`: all 63 items from David's Materials tab the 9 from his Important tab (`important.json`) and the 31 ingredients (`ingredients.json`, with David's cooking notes in the README) with icons, descriptions, uses and sources (from his inventory video). Notes only, not on the page.

## 2026-10-31 — Claude: team buffs add
- `DAMAGE_TESTS`: Eileen's Brave One and Sion's Bless add to each other (Reina: 2,094 / 2,231 / 2,369 damage; adding predicts 2,368, multiplying 2,377). Data only.

## 2026-10-31 — Claude: level 40, Kalsion, Sion, Gallore, familiars, Rift notes
- Level-70 estimates: refitted the level curve with David's level-40 measurements and stored the Lv.40 breakthroughs (B +35/+18/+276, Charlotte +43/+15/+230). Every hero's estimated base stats rose (profile B 1003/327/6771 -> 1058/349/7136); no build changed. `tools/hero_stats.py` now uses every measured breakthrough tier.
- Kalsion and Sion owned, with colour portraits. Familiars in colour: Fierce Rhinoceros Beetle, Cowardly Firefly, Maple Flying Squirrel, Shadow Wing Cat, Sandstorm Sky Wolf (passive steps updated). Titles 7/109.
- New tier list (preview): Gallore the Collapse (Lv.35) as the fourth Hunt boss tab.
- `DAMAGE_TESTS`: Sion's Bless by level (10-15%), how his field works, and the first team-buff stacking test.
- Notes only: `assets/rift/` (Rift and Corrupted Entities), `assets/exchange/chest-drops.txt`. David's source PNGs deleted after cutting.

## 2026-10-31 — Claude: tower crests (preview only)
- Towers mode: each tower tab shows its crest, cut from David's deploy-screen Recommendations icons.

## 2026-10-31 — Claude: tower quotes (preview only)
- Towers mode: the in-game quotes for the towers of Crushing and Amplitude (from David).

## 2026-10-31 — Claude: Towers mode (preview only)
- New tier list: a third mode, Towers (Tower of Trials), with tabs for the towers of Amplitude, Gale and Crushing, the measured damage bonus (+400% for the tower's status, +100% for damage-over-time), floors and stars, and all rewards. New `TOWER_TRIALS` in data.json; icons for Fragment of Memory and Whirling Thoughts and the mode picture cut from David's screenshots. No tower ratings yet: heroes show their Overall tier faded, and the tower's archetype gets the Counter tag.

## 2026-10-31 — Claude: Tower of Trials damage bonus
- `DAMAGE_TESTS`: the Tower of Gale adds +400% to the Additional Damage pool on Airborne hits and +100% on Poison hits (two runs of Reina's Ultimate, all 7 hits fit). Data only.

## 2026-10-31 — Claude: Tower of Trials notes
- New `assets/tower/`: David's Tower of Trials screenshots and notes (towers of Amplitude, Gale and Crushing; 30 floors, 3 stars each; cumulative star rewards). Found the source of Whirling Thoughts (55 per tower). Not on the page yet.

## 2026-10-31 — Claude: Status Effects box: no cap
- Status Effects box on character pages: the line saying 3.5x was the highest seen (and suggesting a cap) now says bonuses add with no cap, with Stun + Knockdown + Airborne measured at 4x.

## 2026-10-31 — Claude: David's titles, two stale notes
- `TITLES`: Environmental Cleaner and Black Wings marked as obtained (5 of 109); cumulative effect matches the game (Defense +10, Max HP +100, Defense Up +1.50%, Critical Rate +1.30%).
- `STATUS_EFFECTS.damageOverTime.untested` and `HERO_STAT_MODEL.observations.titles` brought up to date (both described tests as missing that are done).

## 2026-10-31 — Claude: status hit bonuses have no cap
- `DAMAGE_TESTS`: David's clip of Reina's Wind Slayer on goblins shows Stun + Knockdown + Airborne = ×4 (1742 clean, 7311 with Stun + Knockdown, ~14407 with all three, 21611 as a crit at 50% Crit Damage). Hit bonuses keep adding; the old ×3.5 result was Bleed wearing off. Data only, nothing on the page changes.

## 2026-10-31 — Claude: Gatherer tag (preview only)
- New tier-list tag "Gatherer" (cyan, vortex icon) for heroes that pull enemies together. Not given to anyone yet; to be decided after testing how big each pull is.

## 2026-10-31 — Claude: third Hunt boss (preview only)
- New tier list, Bosses mode: Barduk the Corrupted (Lv.30) added as the third Hunt boss tab (banner cut from David's screenshot); 3 Hunt bosses left undiscovered. Cerese marked as owned.

## 2026-10-30 — Claude: real Orange gear values, new builds
- Gear tables corrected from David's in-game Orange and Purple pieces: Crit Rate main stats and substats were about 2.4x too high in the old database, Crit Damage about 1.65x too high, Stun/Airborne/Knockdown/Break Additional Attack Power substats half the real value, other status Additional Attack Power 0.8x, Defense Ignore about 2x too high (estimate). Plain stats matched and are unchanged. `GEAR_STATS.valueSources` marks what was measured.
- A stat can now be both main stat and substat (seen in-game on every rarity); the optimiser (Python and the page's live version) and the checker allow it.
- Builds re-run: with real Crit Rate values, every damage build now takes Attack Power Up in all five slots, with The Infiltrator as the 2-piece. Build explanations updated.
- Venomfog Shade 3-piece: up to 3 stacks (+12% Crit Rate).

## 2026-10-30 — Claude: Venomfog Shade 3-piece stacks
- Venomfog Shade's 3-piece Crit Rate bonus stacks up to 3 times (+4% per dodge, 12 s, up to +12%), from David's screenshot. The text now says so.

## 2026-10-30 — Claude: Trait Dungeons weakness note (preview only)
- The weakness box now says a weakness also speeds up status build-up (about 2–3×), and that bosses resist build-up more on higher difficulties. From David's Test Kit results (Johnny, Trait Dungeon I and III).

## 2026-10-29 — Claude: archetype badge lined up with the portrait emblem
- The archetype badge on hero cards (both tier lists) now sits exactly over the archetype emblem printed in the portrait's top-left corner and scales with the card (23% of its width), instead of a fixed 31 px badge 5 px in. Spotted by David.

## 2026-10-29 — Claude: kit-type filter on the new tier list (preview only)
- New icon buttons after the role filter: Damage / Control (crossed swords), Healer (cross), Buffer (arrow), Tank (shield), using `HEROES[].classType`. The search box is shorter so everything fits on one line on desktop.

## 2026-10-29 — Claude: new tier list, first ratings (preview only)
- `TIER_LIST_V2.heroes`: the 8 heroes David owns, rated together from his gameplay (Overall, Single target, Groups, tags, Charlotte's Expert −1 and Needs Airborne). The other 12 stay Unrated until David plays them.
- Tag texts: Self-sufficient now means "runs their whole kit alone and is strong doing it"; Needs means their own source of the status is too rare.
- The "Unrated" row label no longer gets cut off (smaller, vertical text).

## 2026-10-29 — Claude: stray names in Mastery text
- Removed a stray hero name at the end of 11 Mastery descriptions (e.g. Reina's ended with "Eileen"). It was the next hero's name from the Codex page, picked up when the text was copied. Spotted by David.

## 2026-10-29 — Claude: preview gate fix
- The hidden menu buttons (Familiars, Titles, Trait Dungeons) were still visible because the menu's `display:flex` style overrode the `hidden` attribute. Added `.nav-item[hidden]{display:none!important}`. Checked by testing what's actually on screen.
- Removed the new tier list's demo mode (`&demo=1`); we work in `?tiers=new` from now on.

## 2026-10-29 — Claude: new tabs hidden until launch
- At David's request, Familiars, Titles and Trait Dungeons are hidden from visitors. Their menu buttons only show with `?tiers=new` (or `?preview=1`), along with the new tier list. Title ticks only affect hero stats in the preview. Visitors see Heroes, the old Tier List, Teams, Gear, Karma and Patch Notes.

## 2026-10-29 — Claude: tick your titles; live end-game totals and gear
- Titles tab: every row has a tick box. Ticked titles are saved in the viewer's browser; "Ticked only" and the "Your titles" total use them, and a "clear" link resets them.
- Hero pages: the end-game totals count the ticked titles (gold values, hover for which titles). The recommended gear is re-optimised live with them, using a JavaScript copy of `tools/hero_stats.py`'s optimiser, checked to give exactly the stored builds with no titles ticked. When titles push Crit Rate up, main stats move to Crit Damage or Attack Power Up; changed pieces get a gold frame and the build text says which.

## 2026-10-29 — Claude: all 109 Titles
- The Titles tab lists every title with its passive and how to get it, read by OCR from David's screen recording. David owns 3: Curious Hands, 【777】 and Novice Mercenary Crew. Their total (Defense +10, Max HP +50, Defense Up +1.50%) matches the game's Cumulative Set Effect.
- At the top: David's total and the total of all 109 titles together. Below: search plus filters by category, by bonus stat and for owned titles only.
- Title names use the game's five colours, which follow passive strength (pink strongest, lavender weakest).
- Titles still don't count in the end-game stat totals.

## 2026-10-29 — Claude: Breaker boss explained (likely)
- Break lasts 8 s on both Drosophia bosses. Drosophia of Breaker has a much bigger Super Armor bar: Charlotte needs about 2× the hits, Castella only about 1.4×. That's the likely effect of the Breaker weakness; it's on the card and in the box, marked as likely. TODO item 12 is closed.

## 2026-10-29 — Claude: Breaker weakness doesn't speed up Super Armor break
- Same-monster test with Castella: 5 hits to break Drosophia of Bloodburst vs 7 on Drosophia of Breaker. Breaks last 8 s, whichever hero breaks it. Recorded on both Drosophia cards, in `DAMAGE_TESTS` and in TODO item 12 (one optional check left: break duration on the Breaker boss).

## 2026-10-29 — Claude: Super Armor break test
- Castella's test: breaking Super Armor gives no hit bonus (194 before and after, on two bosses), and the Breaker weakness didn't make breaking faster than on Mantius of Amplitude. Recorded in `DAMAGE_TESTS`, the Drosophia of Breaker card and `STATUS_EFFECTS`. TODO item 12 now asks for the same-family comparison (Drosophia of Breaker vs Drosophia of Bloodburst).

## 2026-10-29 — Claude: Drosophia tests
- Drosophia of Bloodburst: David tested every status; it really has no weakness (the "may be a typo" note is replaced).
- Drosophia of Breaker: its weakness doesn't change any status hit bonus. It probably speeds up Super Armor break, which is noted on the card, in `DAMAGE_TESTS`, and as TODO item 12.

## 2026-10-29 — Claude: DoT ticks are 5, not 4; flat status Attack Power confirmed
- David noticed that Poison, Bleed, Burn and Shock tick straight away and then every 2.5 s, so **5 ticks** per application, not 4. Fixed in `STATUS_EFFECTS` (the Status Effects box now shows 250/375/500% totals at 1/2/3 stacks), in Charlotte's review, in `DAMAGE_TESTS` and in AGENTS.md.
- Johnny's new test confirms two separate gear stats: flat "All Status Effect Additional Attack Power" (added to Attack before the status bonus) and the % "Status Effect Additional Attack Power Increase". Neither changes ticks. The values seen on blue gear are recorded in `GEAR_STATS.observedBlue`.

## 2026-10-29 — Claude: Trait Dungeon weakness solved
- David's clean Johnny repeat (dummy, neutral boss, Venom-weak boss): Poison ×1.50 / ×1.50 / ×2.01, ticks 322 everywhere. With Reina's test this shows that a weakness **doubles the matching status's hit bonus** (Poison +50% → +100%, Airborne +100% → +200%) and leaves ticks and status-free hits unchanged. Neutral bosses match the dummy.
- The earlier ×1.88 reading is marked superseded (most likely a mob hit). The Trait Dungeons box and `DAMAGE_TESTS.findings` are updated, and TODO item 11 is reduced to an optional difficulty check.

## 2026-10-29 — Claude: Johnny Poison weakness test, immunity bubble
- `DAMAGE_TESTS` has David's Johnny test: no gain without Poison, Poison ticks unchanged (322, 50% of Attack), Poisoned hit ×1.88 on the neutral boss vs ×2.01 on the Venom-weak boss. It's recorded without a conclusion because it doesn't match Reina's result yet.
- Trait Dungeons: the "What a weakness does" box now covers both tests. The Immune column has a note on what immunity does, from Ghagaroach of Venom: a Venom skill makes the boss raise a bubble that Breaks, exposes and stuns your hero.

## 2026-10-29 — Claude: what a Trait Dungeon weakness does
- From David's boss-only test with Reina: a weakness does nothing on hits without the status (143 on both bosses). On the weak boss Airborne's hit bonus rises from +100% to +200% (287 → 431). Recorded in `DAMAGE_TESTS` (test and finding), shown in the box on the Trait Dungeons page, and the follow-up test is on David's TODO list (item 11).

## 2026-10-29 — Claude: Trait Dungeon banners, difficulty selector and reward icons
- Every boss card now uses its in-game picture as the banner (cropped from David's Extreme screens).
- A I–IV selector in the banner's top-left switches difficulty (Normal, Hard, Very Hard, Extreme). It updates the recommended level (20/30/40/50) and the rewards, shown as in-game icons with amounts (EXP, Adventurer's Emblem and the boss's own green, blue or purple trait stones). Hover an icon for its name.
- 29 reward icons were cut out of the screenshots; the source PNGs were deleted afterwards (still in git history).
- On phones the banner contents stack so nothing overlaps.

## 2026-10-29 — Claude: first Trait Dungeon weakness test
- `DAMAGE_TESTS` has David's first weakness test: Reina's auto-attack first hit on an Airborne target did 473 on Mantius of Gale vs 320 on Mantius of Amplitude (about 1.48×), and Airborne built up faster. It's marked as a single test, with what's still open.
- The Trait Dungeons page shows this as a short "What a weakness does" box at the top.

## 2026-10-29 — Claude: Trait Dungeons page
- All 9 Trait Dungeon bosses, in David's layout. Each banner has the name in the middle, the weakness top-right (green ▲) and the immunity bottom-right (red ▼). Below it: "Strong here" (heroes of the weak archetype) and "Immune · leave at home" (heroes of the immune archetype, greyed), ranked by End-game tier. Hovering a hero shows the hero card; clicking opens their page.
- Weaknesses and immunities are from David's notes and are the same on every difficulty. Drosophia of Bloodburst shows "None" exactly as the game does.
- Mantius of Amplitude also shows its recommended level (20) and Normal rewards. Banners use a tinted archetype background until David's boss screenshots arrive.

## 2026-10-29 — Claude: how to get each Familiar
- Every Familiar card now shows how to get it, from David's list:
  - DLC: links to the Steam store page, with the price;
  - Gold and Adventurer's Emblem: the in-game currency icons with the amount;
  - Activities: the in-game requirement, e.g. Mining ×300;
  - Mercenary Crew promotions, the story quest and the free starter.
- The Gold coin and Adventurer's Emblem icons were cut out of David's screenshots (`assets/ui/gold.webp`, `assets/ui/adventurers-emblem.webp`).

## 2026-10-29 — Claude: Insect stamina note
- The Insect passive box notes that steps 2–4 each add 10% maximum stamina, are believed to add up, and that it isn't tested whether each 10% is of the base or the already raised stamina (`FAMILIARS.passiveNotes`).

## 2026-10-29 — Claude: Familiar passives and abilities; faction on hero pages; big screenshots removed
- **Familiars:** each species now has a passive-effect box beside its cards, with numbered diamond badges 1–4 drawn in the game's style (green = unlocked in David's game). Steps that only apply to that species carry a "<Species> only" tag with a hover note. Ability names such as Air Dash are chips with the ability's icon. Hovering (or tapping) one opens a pop-up with the icon, description and cooldown, all read from David's screenshots. Dragon moved to the bottom. One game typo fixed ("consumtion").
- **Hero pages:** Quick info now also shows Faction, Kit and How to get.
- The full Codex screenshots (Karma, heroes, Familiars) were deleted at David's request; the cut-out pictures stay, and the originals remain in git history.
- The validator checks the ability icons and that every `[Ability]` in the passives exists.

## 2026-10-29 — Claude: Karma art, new hero portraits, Familiars page
- From David's Codex screenshots, 102 card pictures were cut out automatically: 53 Karmas, 20 heroes and 29 Familiars. Each was named by reading the card text and matched to the data (every Karma and hero matched exactly). The in-game name printed on each card was painted out so only the art remains.
- **Heroes:** new, sharper portraits (392×467, was 337×406) without the baked-in name, used everywhere portraits appear. Colour and grey still match who David owns. New `faction` field (the Codex groups), shown on the hero hover card.
- **Karma:** card art now appears as the thumbnail on every Karma card (the Karma tab and Karma hover cards) and in the Best Karmas rows on hero pages; signature cards keep a small ✦. New `image` and `owned` fields (A Flame That Cuts Through the Moment and Frozen Fortress are in colour).
- **Familiars:** the tab now lists all 29 with pictures, grouped like the Codex. How to get them and their effects come later.
- The validator now checks the Karma and Familiar picture paths.

## 2026-10-29 — Claude: boss tabs re-cropped; tag tooltip shown once
- New tier list preview: the boss tabs are taller (104 px) with shading only behind the text. Furcas's banner now shows his horns, eye and teeth. Vanak's shows his hook, arm and horned helmet (mirrored so the helmet sits clear of the name).
- `assets/bosses/furcas.png` was empty after the GitHub rename; it's restored from the original upload.
- Tag and Signature Karma hovers in the preview used `data-tip`, which also triggered the site-wide CSS tooltip, so two boxes appeared. They now use `data-v2tip` and show one tooltip.

## 2026-10-29 — Claude: in-game icons and boss pictures
- David's in-game icons were cut out of their dark backgrounds and converted to WebP in `assets/ui/` (white versions plus `-gold`). The menu now uses them for Heroes, Teams, Familiars and Trait Dungeons, coloured like the menu text (grey, blue when selected). Exchange, Guides and Help are kept for later.
- New tier list preview: the Overall and Bosses mode buttons use David's backgrounds (the in-game badge strip cropped off). Furcas and Vanak the Bloody Hook have wide banner crops for their tabs and full portraits kept for later (`assets/bosses/`; `farkas.png` is stored as `furcas`).

## 2026-10-29 — Claude: new tier list foundation (hidden preview)
- The new tier list is in the code, but visitors still see the old one. Open it with `?tiers=new` at the end of the site address; add `&demo=1` to fill it with sample placements and tags.
- What's built:
  - Overall and Bosses modes. The Bosses mode has an All bosses tab, Furcas (Lv.20) and Vanak the Bloody Hook (Lv.25), and locked tabs for the 4 undiscovered Hunt bosses and the Raid.
  - Role columns (Main DPS, Sub-DPS, Support) and tiers S+ to C, plus an Unrated row.
  - Tags with icons, the Signature Karma corner badge, the patch arrows, and a Counter tag that appears automatically when a selected boss is weak to the hero's archetype.
  - Fold-out About, Modes, Tags and Ratings panels.
  - Hover cards with Overall, Groups and Single target tiers, or every boss's tier.
  - A "Legacy view" button that switches back to the old tier list.
- Data lives in the new `TIER_LIST_V2` key. Its `heroes` entry is empty until we decide ratings together. Mode and boss pictures are placeholders until David's screenshots arrive.

## 2026-10-29 — Claude: Familiars, Titles and Trait Dungeons tabs
- Three new tabs in the left menu, the foundation for later content:
  - **Titles:** the laurel-wreath icon (`assets/ui/titles.svg`) and the titles recorded so far with their passive bonuses (only Novice Mercenary Crew's is known).
  - **Familiars** and **Trait Dungeons:** placeholder pages that fill from the new `FAMILIARS` and `TRAIT_DUNGEONS` keys.
- `UI_ICONS` in data.json holds the menu icon paths. Familiars (♞) and Trait Dungeons (⚔) keep text symbols until David's icons are added.
- Page switching now uses one list of pages (`PAGE_IDS`), which also fixes the Patch Notes page staying visible under a character page opened from it.

## 2026-10-29 — Claude: patch arrow beside the tier chip
- On Tier List cards the ▲/▼ arrow (and Ryza's NEW) now sits just left of the tier letter in the top-right corner instead of bottom-left.

## 2026-10-29 — Claude: "damage moved between skills" counts as mixed; crit note updated
- Patch 1.1.0 rating rule: when a hero's total skill damage changed by less than 3% but one skill went up 15% or more and another down 15% or more, the hero is now **mixed** (amber), with impact from the share of damage moved. Charlotte, Kalien and Cerese change from nerf, and Kalsion, Tarte and Astria from adjusted, all to mixed. These are exactly the heroes whose developer notes say their "damage share shifted". Tooltips and the patch detail now say how much damage moved.
- Build tab: the "over 100%" Crit Rate note now states the 1.1.0 rule (crits happen exactly at your Crit Rate; monsters have no crit resistance) instead of the old untested caveat.

## 2026-10-29 — Claude: Patch Notes page, buff/nerf arrows, pronoun and data fixes
- New **Patch Notes** tab: every update from 1.0.0 (launch) to 1.1.2, newest first, with Steam dates and BuildIDs. Each patch shows badges (New hero, Balance, Content, Costumes, Story & quests, Systems & QoL, Bug fixes), the important changes without the developer messages, the bug-fix count and a link to the full official notes. You can filter by badge and by hero.
- 1.1.0 hero changes use the official before/after numbers. Click a hero for every skill's old and new max-level %, Rage and Super Armor changes and the developer note. Each hero gets a direction (buff, nerf, mixed, adjusted) and an impact (Minor, Moderate, Major) by a fixed rule, stored in `PATCH_NOTES.rating`.
- Green ▲ (buff), red ▼ (nerf) and amber (mixed) arrows from the latest balance patch now show on the Tier List cards, Team cards and hero hover cards. Clicking an arrow on the Tier List opens that hero's patch history. Tiers themselves are not changed.
- The Review tab has a new **Patch history** card per hero.
- Pronouns: Lute is now he/him and Kalien she/her in all review text, pros/cons and the build note.
- Ryza: obtained from the Story (Adventure Quest 53. Reunion), as patch 1.1.0 states.
- Frostbite: the "1.1.0 nerfed all three" wording is corrected. Othello and Cerese were nerfed; Dana's skill damage went up (+14.5% in total) with higher Rage costs.
- AGENTS.md: open task 4 (Crit Rate above 100%) is closed by the 1.1.0 crit rework. The validator now checks `PATCH_NOTES`.

## 2026-10-28 — Claude: Skills tab split into Basic Moves and Skills
- The Skills tab now starts with **Basic Moves**: Basic Attack Combo (shown in place of "Auto attack"; the data slot name is unchanged), Jump attack, Dash attack and Dash.
- A Gear-page-style divider, **Skills**, follows, with Skill and Ultimate, then Special A and Special B, then Mastery centred below (full width on phones).
- "Basic Moves" and "Skills" are both Gear-page-style dividers (text between two lines) in the hero's archetype colour.
- Alternate-mode sections (Theresia, Alex, Kalsion, Astria) follow unchanged. Grouping is done by `groupProfileSkills()`; `data.json` is not changed.

## 2026-10-28 — Claude: Skills tab split into Basic Moves and Skills
- The Skills tab now starts with **Basic Moves**: Basic Attack Combo (shown in place of "Auto attack"; the data slot name is unchanged), Jump attack, Dash attack and Dash.
- A Gear-page-style divider, **Skills**, follows, with Skill and Ultimate, then Special A and Special B, then Mastery centred below (full width on phones).
- Alternate-mode sections (Theresia, Alex, Kalsion, Astria) follow unchanged. Grouping is done by `groupProfileSkills()`; `data.json` is not changed.

## 2026-10-28 — Claude: always load fresh data
- `index.html` now fetches `data.json` with a unique query and `cache: 'no-store'`, so data changes show after a normal refresh once GitHub Pages has deployed.

## 2026-10-28 — Claude: skill names no longer split by status colouring
- `colourStatusWords()` leaves skill, Karma and set names that contain a status or archetype word (e.g. Venom Cutter, Poison Step, Frozen Burst, Defeating Poison with Poison) uncoloured, so only real status words are coloured in reviews, pros/cons and the Status Effects box.

## 2026-10-28 — Claude: full reviews for all 20 heroes
- The other 19 heroes get a full review in Charlotte's approved format: overview, verdict with how to get them, gameplay loop, 2–3 combos built from activation conditions, kit analysis, skill priorities, best awakening stop, Karma, gear and teams.
- Every hero, skill, Karma, set and awakening link and every combo chip was checked to resolve (0 unresolved), with no script errors.
- Numbers quoted come from the data:
  - skill % from the codex;
  - status bonuses from `DAMAGE_TESTS`;
  - awakening values from the modelled ratings;
  - Additional Attack Power as a share of each hero's end-game Attack from the Build tab totals.
- Where a fact isn't known, the review says so: how Kalsion, Cerese, Othello and Ryza are obtained; Frost; Break; whether heal and buff values grow with skill level.

## 2026-10-28 — Claude: one behaviour for all hover cards
- **Skill links** in reviews and pros/cons now use the same skill card as the older awakening and Karma skill links, with the level slider and the skill owner's archetype colour.
- **Clicking any link on desktop jumps to it:**
  - skill: the Skills tab, scrolled to the skill and highlighted;
  - Karma: the Karma tab, filtered to the card;
  - set: Gear Sets;
  - awakening: the Review tab, scrolled to the card;
  - hero: that hero's guide.
- **Phones:** a tap shows the card with an "Open …" button, because phones can't hover.
- **Hero hovers everywhere** (tier list, Heroes page, Teams page) now use the new hero card: tiers for all three stages, kit tag and an "Open guide" button. Clicking a hero on the Teams page now opens their guide instead of the Heroes page search.

## 2026-10-28 — Claude: hero pages coloured by archetype
- Hero pages use the hero's archetype colour (`ARCH_COLORS`, set as `--hero-accent` on `#profilePage`) in place of the fixed teal: name, banner edge, section underlines, tabs, skill slot labels, sliders, mode headings, Karma names, gear hover and the review cards.
- Combo chips for another hero's skill use that hero's archetype colour for the slot tag, the border and the hero's name (e.g. Reina in Gale colour in Charlotte's Venom team combo).
- Fixed the hero-name buttons in the Introduction, which showed as plain grey browser buttons because their style never applied.
- Links (heroes, skills, Karmas, sets) stay light blue so they don't look like status words.

## 2026-10-28 — Claude: full review layout (Charlotte sample)
- New `CHARACTER_PROFILE_DATA[].review` and `renderProfileReview()`, replacing the Review placeholder on the Review tab. Sections: Overview, Verdict (with how to get the hero), How to play (gameplay loop and combo chips), Kit analysis, Investment (skill priorities, awakening stop, Karma, gear), Teams, and tier rating boxes.
- **Links in reviews and pros/cons:** heroes, skills, Karmas, gear sets and awakenings open a card on hover. On phones a tap pins the card; hero cards have a button to open that hero's guide. Status and archetype names are coloured.
- `HEROES[].obtain`, from David:
  - Hero shop exchange (Fate's Invitation): Eileen, Astria, Alex, Kalien, Dana, Theresia, Tarte, Sion, Reina, Roxy, Charlotte.
  - Story Quests: Lute, Johnny, Aria, Castella, Ornette.
  - Not recorded yet: Kalsion, Cerese, Othello, Ryza.
- Charlotte has the first full review, as a sample for approval. Eileen's Karma pro now names Vanguard Banner (David's reading of "Banner Maid").
- Checked: all links resolve, and there are no script errors at desktop or phone width.

## 2026-10-28 — Claude: Pros & Cons for every hero
- New `pros` and `cons` lists in `CHARACTER_PROFILE_DATA` for all 20 heroes, drawn from their tiers, teams, skill text, signature Karmas and awakenings. S-tier heroes have more pros; C/B-tier heroes have more cons.
- Review tab: the Pros & Cons placeholders are replaced by `renderProfileProsCons()`:
  - green text with a drawn plus icon for pros, bright red with a minus icon for cons;
  - status and archetype names coloured in their archetype colour.
- Fixed Kalsion A1's explanation: Explosion (2173%) is the second-biggest skill hit, after Eileen's Vanguard Banner (2295%).
- Checked: all 20 heroes render with no errors, at desktop and phone width.

## 2026-10-28 — Claude: builds and awakening ratings re-checked with the measured damage formula
- **2-piece set:** `tools/hero_stats.py` now picks it together with the main stats (`HERO_BUILDS[].setChoice`).
  - All 16 damage builds change from Battle Will to The Infiltrator: +0.4% to +1.6%. Its +9% Crit Rate frees a main stat from Crit Rate. Castella and Astria change from Holy Arbiter.
  - Status sets (Azure Gale, Earthshatterer, Holy Arbiter, Ruinsbreaker) come out between −2% and +2.2% against Battle Will, depending on whether two statuses' Additional Damage adds or multiplies (untested). Close alternatives are named in each build's text.
  - Supports and Alex keep Battle Will.
  - Main stats re-optimised. Profile gear sentences and `build.sets` rewritten.
- **Awakening ratings** for damage heroes' stat awakenings now come from the modelled end-game damage gain, with the number in each explanation:
  - Own-status A5 awakenings (+15% Additional Damage plus a stat) are about +17–20%, so they go from rated 2 to 4.
  - Plain Attack Power +15% is about +9%, so it goes to 3.
  - Airborne, Knockdown and Stun Additional Damage awakenings are +2.6–6.4% as a lower bound.
  - Best awakening changed for Charlotte, Aria, Ornette and Tarte (now A5).
- Checked: the validator passes; all 20 heroes render with no errors; Charlotte's Build and Review tabs checked by eye.

## 2026-10-28 — Claude: Status Effects box on character pages
- New `STATUS_EFFECTS` key and `renderProfileStatus()`: heroes whose skills inflict Poison, Bleed, Burn or Shock get a Status Effects box under their skills (12 of 20 heroes). It shows:
  - a stacks table: 50/75/100% of Attack per tick, ×4 ticks over ~10 s;
  - the rules measured in `DAMAGE_TESTS`;
  - a note on what isn't tested yet.
- Checked on all 20 heroes at desktop and phone width with no script errors.
- Bleed, Burn and Shock also last about 10 s (David).

## 2026-10-28 — Claude: first training-dummy results
- New `DAMAGE_TESTS` key with David's dummy results and findings:
  - damage is proportional to Attack and to the skill %;
  - a crit multiplies damage by 1 + Crit Damage;
  - a Poison tick is 50% of the applier's Attack;
  - Reina's single hit dealt 0.50 × Attack × skill %;
  - Charlotte's auto-attack combo totals 0.63 × Attack × 332%, which isn't explained yet.
- `GEAR_STATS.observedBlue`: Blue gear values. Substats are half the Orange values.
- Neither is shown on the page.

## 2026-10-28 — Claude: Dodge shows no damage
- All 20 Dodge (`Dash` slot) descriptions lose the "Attack Power N% Damage" line. Dodge does no damage in-game (David); the codex number was the jump attack's. The number is kept as `codexAttackPct`, hidden. `skill_meta.py` re-run, so Dodge `meta.attackPct` is now null.
- TODO: recording each skill's levels, to remove the 1% rounding differences.

## 2026-10-28 — Claude: skill levels fully measured
- `SKILL_LEVEL_MULTIPLIERS`: all levels measured on 7 skills from 5 heroes (Reina, Johnny, Ornette, Charlotte, Castella). Level-10 skills: ×1, 1.05, 1.10, 1.15, 1.23, 1.30, 1.38, 1.48, 1.58, 1.75. Level-7 skills: ×1, 1.10, 1.20, 1.33, 1.45, 1.60, 1.75. Every hero uses the same multipliers, and nothing is marked "(est.)" any more.
- `skillLevelValue()` in `index.html` now uses round(max ÷ 1.75 × multiplier) instead of rounding Lv.1 first: 47 of 57 measured values exact (was 35), the rest 1 off. The game rounds a hidden unrounded Lv.1 value, so exact matches would need each skill's Lv.1 value.
- AGENTS.md: the max level of each skill slot, and Dodge does no damage (from David).

## 2026-10-28 — Claude: Karma Ascensions complete, Karma levelling data, awakenings in end-game totals
- `KARMA_ASCENSION`: the full measured table ×1, 4/3, 5/3, 2, 8/3, 11/3, 5 for A0–A6, matching all 35 values David measured. A3–A5 are no longer estimates.
- `KARMA_DATA[].baseLv1` and `.statType` added from the workbook. There are four stat types: Balanced 19 cards, Attack 18, Defense 10, High Attack 6. New `KARMA_LEVELLING` holds David's Lv1–Lv30 measurements for two cards; it isn't displayed yet.
- End-game totals now include all six awakenings' stat bonuses in purple, with a hover naming the awakening. `tools/hero_stats.py` counts them too, so 16 heroes' main stats were re-optimised; Crit Rate main stats mostly moved to smaller slots, since awakenings add Crit Rate.
- New `assets/titles/` folder with upload instructions. Karma Ascension test removed from the Test Kit. TODO list updated.
- Validation: the checker passes. Charlotte's totals checked by hand (Attack 3,793 + 135 set = 3,928; Crit Rate 84.19% + 4% set + 10% awakening). All 20 heroes render with no script errors.

## 2026-10-28 — Claude: full-resolution colour portraits for Roxy, Reina and Ornette
- `assets/heroes/roxy.webp`, `reina.webp`, `ornette.webp` rebuilt from David's original colour screenshots (415×486 to 414×489). The previous versions were half-size (180×211) and lossy (about 7 KB), so they looked soft next to the others.
- The colour art was scaled ×0.75 and placed by image matching onto the original greyscale portraits, so each keeps its exact original size (Ornette 359×399, Roxy 337×390, Reina 337×406), frame position and blue border. Saved as lossless WebP like the other portraits.
- `data.json`: Roxy, Reina and Ornette marked `owned: true`.
- Validation: the checker passes. A 50/50 overlay of old and new showed no misalignment (the name text stays sharp), and the tier board renders the three like the other colour portraits, with no script errors.

## 2026-10-28 — Restore full-frame Roxy, Ornette and Reina portraits
- Replaced `assets/heroes/roxy.webp`, `assets/heroes/ornette.webp`, and `assets/heroes/reina.webp` using the original supplied character-card artwork, retaining each decorative frame, archetype emblem, and character name instead of the cropped portrait-only versions.
- Kept all existing portrait paths and `data.json` connections unchanged. Encoded the recovered artwork as WebP at the original card aspect ratios for the existing card and profile layouts.
- Validation: recovered and inspected the three original uploads, checked their image dimensions, verified the portrait paths in `data.json`, and prepared valid WebP replacements. Live browser rendering has not been tested in this session.



## 2026-11-02 — Normal Dungeons banner restyle (preview)
- Replaced the paper-like Normal Dungeon tiles with wide cinematic banner cards, using independent I/II/III selectors styled after Trait Dungeons, real per-difficulty reward icons/amounts, and rarity chips.
- Added farm-group-specific heading typography and a consistent pending-artwork state for dungeons without a banner.
- Added the first Warg Cave banner asset at `assets/dungeons/banners/warg-cave.svg` and connected it through `DUNGEONS.normal[].banner`. Other dungeons intentionally remain artwork placeholders.
- Preview only; no public-page behavior change. Browser rendering and GitHub Pages deployment still need visual confirmation.

## 2026-11-02
- Normal Dungeon cards: removed the visible set/slot text while retaining the underlying set and slot filter data; added the correct Gear set icon as a fourth reward, tinted by the highest rarity available at the selected difficulty. Moved rarity chips and EXP to the card's top-right corner.
