# Dungeon artwork workflow and pending fixes

Library index: [docs/README.md](README.md). Current state: [library/STATUS.md](library/STATUS.md).

## Required workflow

- Generate one Normal-difficulty preview first. Show it once, then present exactly two choices: **Proceed** or **Stop**.
- **Proceed** authorises the matching II/III variants, necessary site integration, validation, changelog and commit. **Stop** means wait for David's additional art direction before revising.
- Keep work focused to conserve time and weekly usage. Prepare art for one dungeon at a time; small approved batches may be integrated together. Different dungeons can have distinct settings; do not reuse the Warg cave composition by default.

## Composition lessons from the goblins (2 Nov 2026)

- The final banner is 1672×240. Compose for this shallow aspect ratio from the first generation; don't generate a tall scene and squeeze it to fit.
- The existing decorative frame covers the edges. Keep complete hair, ears, eyes, snouts, teeth and chins safely inside the central vertical area, with generous space above and below both heads. Shoulders may extend beyond the visible area.
- Leave the left controls/reward area and central title area usable. Put foreground enemies toward the right, but within the curved frame ends.
- Derive difficulty variants from the approved Normal image and lock character positions, scale, silhouette and major scene landmarks. Change lighting, aura and danger details, rather than independently recomposing the characters.
- Check the art inside the real frame before making all variants; compare the same dungeon in I/II/III at 1920×1080 and 2560×1440 before committing.
- Frame files share a 1672×240 canvas, but their painted borders have different internal insets. Respect the per-frame CSS clipping; don't assume identical canvas dimensions mean identical visible openings.

## Completed replacement — Goblin Bandits' Cave (3 November 2026)

- David supplied replacement artwork for Normal, Hard and Very Hard after the original Normal banner showed the left goblin at a different position/scale. The three source images share the same 2172×724 canvas and goblin placement.
- Replaced the three existing files using one pixel-identical crop for every variant: source rectangle x=0, y=250, width=2172, height=312; resized each to the required 1672×240 banner canvas. Existing asset names and data.json references were retained.
- The previous Difficulty I alignment correction is complete; all three difficulty variants now keep the goblins anchored to matching positions.

## Shared frame geometry (2 November 2026)

- Preserve the original blue, purple and red frame artwork and colours. Purple/red use measured vertical size and position corrections to match the blue outer corner span (source y=8…239); all cards retain the same dimensions and shared background crop. Do not recolour the blue frame with hue filters: David wants the original purple and fiery red appearance.
- For commits intended for David's visual review, complete checks before pushing and end the task immediately after the push; do not wait for Pages deployment.

## Currency Dungeon background fit (3 November 2026)

- The three discovered Currency Dungeon cards keep the existing full-card SVG frame overlay. The preview background layer (`.dng-currency-preview:before`) is inset 9px and clipped to an 8px corner radius so the artwork sits inside the frame. Its `cover` fit, card content and frame asset are unchanged; the two locked placeholders are unaffected.
- David checked the live preview after GitHub checks completed: the artwork fits the frame in the difficulty states and switching difficulties works. Mark this fit correction complete.

## Corruption art direction supplied by David

- Difficulty II corruption is associated with human Dragon Worshippers: concealed faces, dark cloaks, necromancy and control of beasts/orcs. Introduce these as occasional background details where appropriate.
- Difficulty III may suggest dragons or beings with their traits. Existing Furcas, Barduk and especially Gauron's dragon form are visual references; don't assume every dungeon needs a literal dragon.
- Corrupted Bedchamber is an underground tomb in a graveyard near the Royal Capital. David says an Origin Dragon recently descended and destroyed a Goddess statue. Its approved art uses constructed crypt masonry, broken Goddess statuary, bronze-green armoured skeletons and a torchlit door; preserve the same two foreground skeleton positions in all variants.

## Four-dungeon artwork batch (2 November 2026)

- Approved and integrated: Underground Goblin Village, Silver Tusk Bandits' Supply Depot, Warg Enclosure and Coastal Cliff Cave Outpost, three variants each.
- Village: elevated scouting viewpoint; everyday settlement to primitive war camp to timber stronghold. Depot: stolen supplies to leaking contraband to buckling chained cargo; preserve distinct non-inferno palette. Enclosure: harsh breeding pens to bloodstained corruption to Ironclad-led pack.
- Coastal: keep blue Tribal Hero and throne positioned clear of central title; II adds whispering human Dragon Worshipper and spreading control; III shows destructive granted power consuming his home. David rejected fused nose/mouth anatomy: use the corrected Normal reference, with separate nostrils/nose, mouth, jaw and chin on Hero and both archers.
- Continue approving one Normal preview at a time, then collect 3–4 completed dungeon sets for one integration batch. Do not publish each dungeon independently during collection.

## Final four-dungeon artwork batch (2 November 2026)

- Integrated three difficulties each for Rock Tribe Base, Collapsed Sanctuary, The Graveyard Where Tragedy Sleeps and Ashen Ruins behind the existing preview gate.
- Ashen Ruins is the correct name; David clarified Tomb of Greed was a typo. Use its existing rewards unchanged.
- Sanctuary escalates lich/soul magic without fire. Graveyard II preserves the sleeping dragon; III raises its head in spectral rage while body and landmarks stay anchored. Ashen Ruins reuses the commander with spiders and an undead troll, escalating venom and a greed curse.
- Keep shared subject framing across each set. Local original masters and prompt summaries are in the Rock Tribe chat outputs/dungeon-art-batch-3 folder.
- All 15 dungeon sets now have artwork. The Goblin Bandits' Cave replacement is documented above; the former Difficulty I alignment item was completed on 3 Nov 2026.
