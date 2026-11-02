# Dragon Sword: Awakening — Dungeon UI assets

All files are PNG with RGBA transparency, extracted from the supplied source sheet.

## Banner frames
- `banner-frame-blue.png` — blue frame, with I / II / III medallions integrated at top-left
- `banner-frame-purple.png` — purple frame, with I / II / III medallions integrated at top-left
- `banner-frame-red.png` — red frame, with I / II / III medallions integrated at top-left

These are complete overlays. Place the dungeon artwork/background underneath them.
Do not render a second set of difficulty buttons on top of the integrated medallions.

Approximate clickable hit areas, relative to the top-left of each banner image:
- I: center (116, 73), radius 45 px
- II: center (209, 73), radius 45 px
- III: center (303, 73), radius 45 px

The source banner crops are 1672 px wide. Scale hit areas by the same factor as the image.

## Standalone medallions
- `medallion-blue-I.png`
- `medallion-purple-II.png`
- `medallion-red-III.png`

These are optional standalone assets for other UI locations. The banner versions already contain all three difficulty medallions.

## Decorative dividers
- `divider-blue.png`
- `divider-purple.png`
- `divider-red.png`

## Notes
- Reward icons are intentionally not included as replacements; keep the project's existing reward icons.
- EXP should appear only in the bottom-left rewards row, not in the top-right metadata.
- No dungeon background artwork is included; those backgrounds are intended to be separate layers.
