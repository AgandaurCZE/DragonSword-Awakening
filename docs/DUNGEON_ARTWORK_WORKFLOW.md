# Dungeon artwork workflow and pending fixes

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

## Deferred fix — ASAP after all dungeon backgrounds are completed

- **Goblin Bandits' Cave, Difficulty I:** align both goblins' position/scale with II and III. In I, the left goblin has less of its head/body visible. David explicitly requested this be deferred until all backgrounds are done, then fixed as soon as possible. Preserve the approved cave scene.

## Shared frame geometry (2 November 2026)

- Preserve the original blue, purple and red frame artwork and colours. Purple/red use measured vertical size and position corrections to match the blue outer corner span (source y=8…239); all cards retain the same dimensions and shared background crop. Do not recolour the blue frame with hue filters: David wants the original purple and fiery red appearance.
- For commits intended for David's visual review, complete checks before pushing and end the task immediately after the push; do not wait for Pages deployment.
