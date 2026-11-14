# Done: finished tasks and answered questions

## 14 Nov — Tier list re-rated, Awakenings view filled

Every hero re-rated from David's tier-list file: Overall (single, groups; the main Overall tier is the higher of the two, David's choice), the six Hunts, both Raids and the three Towers, as A0 + Mastery in the normal view and A6 + Signature Karma + Mastery in the Awakenings view.

## 12 Nov — Hunt boss weaknesses and Defense

All six Hunt bosses' weak elements are in the data (header icons and split title). Their Defense on every difficulty is worked out from David's Ryza readings: table in GAME_MATH 3.4, with Gallore's fist gimmick and the buff ratio. Since 13 Nov they're in the Damage Calculator (Hunt boss button), which reproduces David's readings.

## 12 Nov — Furcas and Vanak header artwork

David approved both left-corner cutouts. The 1120 × 760 transparent PNGs are in `assets/bosses/bosses-header/`.

## 12 Nov — Residual Worm Cleanup Zone banner

David approved the cavern panorama with the giant worm’s ringed shaft and a smaller worm surfacing beyond the rim. This completes all five Currency Dungeon banners.

## 12 Nov — Eroded Underground Cemetery banner

David approved the candlelit crypt with gold-filled chests and faint red eyes in the rear arch. The same banner is used for all three Currency Dungeon difficulties.

## 12 Nov — Repository folder organisation (complete; checked)
Website source grouped in `src/`, generated URL pages in `routes/`, Python tools kept in `tools/`. Assets and Markdown files remain in place. Assembly preserves the public paths; use `tools/serve_site.py` for local testing. Full checks passed, all 218 pixel views matched the previous release, and clean Git archive assembly passed.

## 11 Nov — Public Beta implementation (Codex; checked)
Shortcuts home and clean public routes implemented from the former preview. Legacy public tier renderer/gate removed, original uploaded logo added as home link with BETA, existing share art/favicon retained. Full `check_all.py` passed; 39 direct routes/reloads, both browser widths, existing parity/storage checks and the new interaction checks passed. Full pixel comparison completed with the approved launch differences. CHANGELOG records validation; the release commit is published only when its GitHub check and publish jobs pass.

Back to the library: [docs/README.md](../README.md). Open work: [STATUS.md](STATUS.md) (game) and [SITE.md](SITE.md) (site). Every change in detail: [CHANGELOG.md](../../CHANGELOG.md).

Nothing on this page needs doing again. It exists so finished work is never mistaken for an open task. Newest first within each section. When a task in STATUS, SITE or the to-do page finishes, move it here with the date.

## Game tasks and tests (David)
- **13 Nov:** Karma base stats at every level (Lv.1–70, before and after each breakthrough) for all four stat types ([GAME_MATH.md](GAME_MATH.md) 2.3).
- **13 Nov:** gear main stats at every rarity and upgrade level follow from the Test 03 rows; Test 03 complete ([GAME_MATH.md](GAME_MATH.md) 2.4).
- **11 Nov:** title One Who Broke the Thunderbolt (41 of 109); more rune values; Radiant runes synthesise 5 into 1 Perfect; geared damage tests on Ryza and Sion (formula matches every hit, GAME_MATH 3.1).
- **10 Nov evening:** all Orange +15 substats read from 31 pieces (GEAR_STATS confirmed and corrected); Perfect runes Defense 95, Crit Rate 5.10%, Crit Damage 11.20%.
- **10 Nov:** title One Who Broke the Dragon Horn (40 of 109); first Radiant and Perfect rune values.
- **10 Nov:** Karma base stats Lv.20–70 before and after each breakthrough on Ryza's (Balanced) and Ornette's (Attack) signatures; levelling rule in [GAME_MATH.md](GAME_MATH.md) 2.3.
- **10 Nov:** team round on the six main teams with masteries and awakenings ([TEAM_TESTS.md](TEAM_TESTS.md)).
- **10 Nov:** awakening batch 3, A4–A6 on 12 heroes; results in [AWAKENING_TESTS.md](AWAKENING_TESTS.md).
- **10 Nov:** awakening batch 2, A2 and A3 on 19 heroes (Alex later); results in [AWAKENING_TESTS.md](AWAKENING_TESTS.md).
- **10 Nov:** awakening batch 1, A1 on 19 heroes (Alex later); results in [AWAKENING_TESTS.md](AWAKENING_TESTS.md).
- **10 Nov:** all 16 masteries unlocked; mastery retests (changed skill and full break) in [TEST01_RESULTS.md](TEST01_RESULTS.md).
- **10 Nov:** title Chest Addict obtained; last insect familiar, Red Ladybug, owned (colour card cut from David's screenshot); materials for all 16 masteries farmed.
- **9 Nov evening:** all 20 heroes Lv.70; Test 08 base stats for all 20 (the 11 known ones re-measured and matching); 3 skill buffs (Tarte Cure, Alex Guard Counter, Astria Reload); 19 gear rows, mostly Blue and Purple (all match the tables, and they confirm Legs Attack Power Up, Legs Max HP Up, Helmet and Boots Defense Up and Boots Crit).
- **9–10 Nov:** Signature Karma tests (test 09) for every owned signature, and team verdicts in the planner (all Works except Ice Prison, No; team 9 deleted) ([TEAM_TESTS.md](TEAM_TESTS.md)).
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
- **14 Nov:** second clean-up pass: no "measured / tested / recorded" wording left on the pages (reviews, status rules, Damage Calculator notes, single lines); Runes line colouring refined; every familiar passive step lit.
- **13 Nov:** internal notes and David's name removed from the pages (his list); a check now fails if a page shows his name.
- **13 Nov:** hero Build tab shows each stat as base + awakenings + titles + runes, coloured and hoverable; runes line larger.
- **13 Nov:** Counter mark in Towers mode for every hero who inflicts the tower's status; Teams page emptied with an "End-game speed runs" toggle.
- **13 Nov:** first-pass ratings for every hero on the three Towers of Trials; new wording for the S+ and S ratings.
- **13 Nov:** first-pass ratings for every hero on the six Hunt bosses; "All bosses" tab removed; Hunt and Raid bosses on separate rows of tabs.
- **13 Nov:** Karma level picker shows every level from Lv.1 to Lv.70 and both breakthrough values, exact for all four stat types (David's readings of 13 Nov).
- **13 Nov:** Awakenings toggle next to Tags on the tier list (foundation: every hero unrated while it is on; the ratings are still to be agreed).
- **12 Nov:** Hunt rewards by difficulty for all six Hunt bosses, with six game-style circles (I Normal to VI Hell).
- **12 Nov:** Raid rewards by difficulty as icon tiles (Gauron completed from David's list); Normal/Currency Dungeon emblem and Gold icons on blue tiles.
- **12 Nov:** boss header art on the tier list (PC): corner art, Raid humanoid/dragon swap synced to the card, Raid title look and glow, Hunt title split in weakness colours once known.
- **12 Nov:** browser tab names as David set them (home, "<Page> | DragonSword: Awakening", "Tier List" for every tier view, "<Hero> Build Guide"); the checks test them.
- **Amplitude icon report closed by David:** after restarting his PC and reopening Firefox, the icon stays visible. No site fix applied; original cause unconfirmed. Do not resume browser installation or change image loading unless the issue recurs.
- **11 Nov evening:** handover #1 (menu names), #2 (phone dungeon cards), #3 (profile padding), #5 (root README), #6 (October changelog archived); Karma level picker on the Karma page; browser check for it and for the Back button.
- **11 Nov (Codex, handover #7):** preview Tools Backup & restore downloads the five agreed visitor-progress keys, reviews/validates imports before exact replacement, saves recovery before writing and supports undo after reload. Invalid inputs and partial storage failures are browser-tested at desktop/phone widths.
- **11 Nov (Codex, handover #9):** shared account preset in `GEAR_MODEL.account`, ownership derived from existing Karma flags; no implicit A6 fallback in the offline tool. Website maximum-build defaults unchanged. Added validator coverage and A3/A0 Python/JS parity cases.
- **11 Nov (Codex):** confirmed-complete facts reconciled across reference notes, status and the to-do page; old comparisons kept as dated history. No game values or public presentation changed.
- **11 Nov (Codex review only):** all 18 Markdown files, new check/publish workflow and relevant data/code reviewed at `da91cfa`; full check_all passed locally, including browser and parity. Eleven handover entries assessed for model/task fit, none implemented. Stale-note examples recorded in CHANGELOG and STATUS. GitHub deployment result could not be verified (API Forbidden).
- **11 Nov (structure; public and preview unchanged to the pixel):** golden rules and automatic checks. `tools/check_all.py` (one command before every commit), `tools/check_shape.py` with the recorded data shape, `tools/check_site.py` (browser smoke test, preview gate, JS ports against Python), `tools/public_diff.py` (the pixel check as a tool); `js/` and `css/` reformatted with Prettier (syntax trees, CSS rules and 194 views identical); LF line endings enforced by `.gitattributes`; GitHub workflow "Check and publish" that publishes only when the checks pass; three stale set-choice figures refreshed; dead duplicate code removed from `tools/team_gear.py`; unused `assets/ui/preview.jpg` deleted. Rules: AGENTS.md "Golden rules"; details: [SITE.md](SITE.md).
- **10 Nov, late evening (public and preview):** Karma art 43 of 53 in colour; owned flags match (Ryza's and Roxy's signatures now marked).
- **10 Nov, late evening:** Best Gear as a ranked list with % of the best; browser Back and Forward work in the preview (each page and hero tab has its own address).
- **10 Nov late evening:** "Best Gear" box on the hero Build tab (port of `tools/team_gear.py`, checked identical for 13 heroes), replacing the old build boxes in the preview.
- **10 Nov:** repository restructure approved by David and done: `index.html` split into `css/site.css` and nine `js/` files; `data.json` loads with safe caching (both URLs); `DAMAGE_TESTS` moved to `data/research.json`; source screenshots gathered in `assets/sources/`; artifact backups as an end-of-session routine. Public page pixel-identical throughout.
- **10 Nov:** site check: preview starts ~5× faster (no longer waits for the 45 dungeon banners), phone layout fixes (Gear, tier list, Tools, Titles), Trait chips from the new tier list, tab titles, dead code removed, code map added; public page pixel-identical (CHANGELOG).
- **10 Nov:** tier list re-rated with Masteries (16 heroes), Ornette Enabler and Applies, purple signature card for Theresia and Ryza, Needs A and Late bloomer gone from the main view; hover shows the latest patch line.
- **10 Nov:** main-team gear builds (`tools/team_gear.py`, GAME_MATH 4.3), also with 5 Perfect Crit Rate runes.
- **9 Nov:** notes library, GAME_MATH, SITE; Test Kit v33 (tests 08 and 09); Team Planner intro.
- **8 Nov:** Super Armor break tag (`sa`) for Castella, Astria, Dana, Kalien.
- **8 Nov:** levelling calculator: hero breakthrough materials by hero, Karma materials by archetype, dungeon runs.
- **4–8 Nov:** damage calculator (Tools page) with enemy type, level and place (World, Normal, Trait, Currency Dungeon), towers and Hunt weakness.
- **4 Nov:** Item Database (Materials, Ingredients, Important, Quest); Achievements tracker; Guides placeholder cards; News entry (disabled).
- **3 Nov:** Gear page: upgrade calculator, Disassemble returns, Runes box.
- **1–3 Nov:** Dungeons group: Normal Dungeons (15 cards, I/II/III, filters, links from the Gear page), Trait Dungeons banners, Currency Dungeon foundation (all 5 discovered by 5 Nov; no locked entries remain). Built from the 1 Nov brief, which is now retired. The original Normal Dungeons design and artwork foundation are David's, made with ChatGPT.
- **2–3 Nov:** banner art for all 15 Normal Dungeons, three difficulties each; Goblin Bandits' Cave replaced with one shared crop; Currency Dungeon background fitted inside its frame (9 px inset, 8 px radius); David checked both live.
- **31 Oct–1 Nov:** new tier list v2 with Overall, Bosses (5 Hunt bosses, Raid Gauron with its fights, strategy and rewards panels) and Towers modes; Hunt rating rewards panel.
- **29 Oct–1 Nov:** Familiars, Titles, Cookbook, Trait Dungeons pages; preview gate.
