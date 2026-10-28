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

