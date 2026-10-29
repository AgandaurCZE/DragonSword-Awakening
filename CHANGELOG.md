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

