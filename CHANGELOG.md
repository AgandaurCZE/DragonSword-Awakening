## 2026-10-28 — Claude: full-resolution colour portraits for Roxy, Reina and Ornette
- `assets/heroes/roxy.webp`, `reina.webp`, `ornette.webp` rebuilt from David's original colour screenshots (415×486 to 414×489). The previous versions were half-size (180×211) and lossy (about 7 KB), so they looked soft next to the others.
- The colour art was scaled ×0.75 and placed by image matching onto the original greyscale portraits, so each keeps its exact original size (Ornette 359×399, Roxy 337×390, Reina 337×406), frame position and blue border. Saved as lossless WebP like the other portraits.
- `data.json`: Roxy, Reina and Ornette marked `owned: true`.
- Validation: the checker passes. A 50/50 overlay of old and new showed no misalignment (the name text stays sharp), and the tier board renders the three like the other colour portraits, with no script errors.

## 2026-10-28 — Restore full-frame Roxy, Ornette and Reina portraits
- Replaced `assets/heroes/roxy.webp`, `assets/heroes/ornette.webp`, and `assets/heroes/reina.webp` using the original supplied character-card artwork, retaining each decorative frame, archetype emblem, and character name instead of the cropped portrait-only versions.
- Kept all existing portrait paths and `data.json` connections unchanged. Encoded the recovered artwork as WebP at the original card aspect ratios for the existing card and profile layouts.
- Validation: recovered and inspected the three original uploads, checked their image dimensions, verified the portrait paths in `data.json`, and prepared valid WebP replacements. Live browser rendering has not been tested in this session.

