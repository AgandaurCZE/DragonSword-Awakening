# Task: Dungeons section (preview only)

> **Historical brief — implementation is complete.** This 1 Nov 2026 request predates the current Normal, Trait and Currency Dungeons implementation and contains superseded scope, data-shape and artwork instructions. Do not resume this checklist as an open task. See `AGENTS.md`, `CHATGPT.md` and `docs/PROJECT_HANDOFF.txt` for the current state and remaining work.

Written by Claude for whichever assistant builds this (1 Nov 2026). Read `AGENTS.md` first: every rule in it applies here.

## The one rule that matters most

**All content comes from `data.json`. Don't type any dungeon name, set name, material, amount, colour or level into `index.html`.**
If something you need isn't in the data, add it to `data.json` (and to the key table in `AGENTS.md`). Don't put it in the HTML. The page must update itself when David adds a dungeon, changes an amount or discovers the two missing Currency Dungeons, without anyone touching the JavaScript.

## Data you will use (already in `data.json`)

- `DUNGEONS`
  - `difficulties[{name, roman, color}]`: Normal/I, Hard/II, Very Hard/III, with their in-game colours.
  - `farmGroups[]`: the order to show the groups in. Each dungeon's `farm` is one of these.
  - `emblem{name, icon}`: Adventurer's Emblem. `expLabel` is the label for the EXP reward.
  - `normal[]`: 15 dungeons, each `{name, farm, set, slots[], difficulties[3]{name, gear[rarities], exp, emblem, material{name, amount, icon}}}`. The three entries in `difficulties` are in the same order as `DUNGEONS.difficulties`.
  - `currency[{name, gives}]`, `currencyNote`, `undiscovered.currency` (2): show that many locked "not discovered yet" cards, like the locked boss tabs on the new tier list (`.v2-boss.locked`).
- `GEAR_DATA[]`: set name, icon and `source` (`"Normal Dungeons"` for the three general sets). Look up a dungeon's set icon here by `set` name.
- `TRAIT_DUNGEONS`: the existing Trait Dungeons page. Don't change its data or rendering.
- Rarity colours: reuse `gxRarColor()` in `index.html` (Green/Blue/Purple/Orange). Don't add another colour table.

## David's confirmed card design (2 Nov 2026)

The Normal Dungeons cards must use the in-game Normal Dungeon menu screenshot as their visual source, not a generic blank rectangle:

- Preserve the pale, ornate title-panel background from the left side of each in-game dungeon row.
- Remove/mask the original dungeon-name lettering, the large gear/reward tiles, and the Location button. Fill the removed right-hand area with the matching adjacent panel colour/texture so there is no obvious empty cut-out.
- Render the dungeon name as live website text, larger and horizontally/vertically centred in the title panel. This allows long names to scale or wrap cleanly.
- Put the three difficulty circles at the top-left, side by side: grey I = Normal, green II = Hard, blue III = Very Hard. Reuse the visual style and interaction pattern of Trait Dungeons' .tr-diff controls, but bind each card to its own selected difficulty and its own Normal Dungeon reward data.
- Put small square reward/item icons at the bottom-left, using the existing extracted item icons in assets/items/icons/ (not the large screenshot tiles).
- Keep the card title text, controls and reward icons legible; the earlier assistant sketch was only a layout guide, not the intended final background.

This design is specific to Normal Dungeons. Do not change the existing Trait Dungeons rendering or behaviour. Currency Dungeons remains a navigation entry only for now, unless David asks otherwise.

## What to build

### 1. A collapsible "Dungeons" group in the left menu

- One menu entry, **Dungeons**, that opens and closes. It contains three sub-items: **Normal Dungeons** (new page), **Trait Dungeons** (the existing `trait` page, moved here) and **Currency Dungeons** (new page).
- Give the new pages ids `dungeons` and `currency`, add them to `PAGE_IDS`, and add both to `PREVIEW_PAGES`, next to `trait`.
- When none of the three is visible (not in preview), the group header must be hidden too. Extend `applyPreviewGate()`; don't write a second gate.
- Opening a sub-page opens the group and highlights the sub-item. Use the same `.nav-item` / `.active` classes the menu uses now, plus as little new CSS as possible, matching the current look.

### 2. Normal Dungeons page (`renderDungeons()`)

- One card per dungeon, grouped under headings in `farmGroups` order.
- Each card shows: the dungeon name; the set icon and name; the slots; and an **I / II / III selector** (copy how the Trait Dungeons banner selector works) that switches the card's rewards: gear rarity chips (coloured with `gxRarColor`), EXP, Adventurer's Emblem with its icon, and the material with its icon and amount.
- Filters at the top, like the Gear page filters:
  - search box (dungeon or material name);
  - gear set;
  - slot;
  - farm group;
  - "drops Orange at this difficulty".

  Build every filter's options from the data, never from a typed list.
- Deep links: `openDungeons({set, material, slot})` switches to the page, sets those filters, scrolls to the first match and outlines it for about 1.8 s, the way `openGearSet()` does. Also support `#dungeons?set=Battle%20Will` in the URL so a link can be shared.
- A small "Source: David's in-game screenshots, 1 Nov 2026" line, taken from `DUNGEONS.note`.

### 3. Currency Dungeons page

- A card per `DUNGEONS.currency` entry (name and what it gives), `currencyNote` underneath, then `undiscovered.currency` locked cards.
- No per-difficulty amounts yet: David hasn't recorded them. Don't invent any. If he records them later, add them to `DUNGEONS.currency[]` and show them the way the Normal Dungeons cards do.

### 4. Links into the new page (preview only; the public Gear page must not change)

Wrap every one of these in `if (IS_PREVIEW)`.
- Gear page, **"General sets"** heading: make it a link to `openDungeons()`.
- On each general-set card, the source line **"Normal Dungeons"** links to `openDungeons()`, and the **set name** links to `openDungeons({set: <name>})`.
- Helper `dungeonSourcesFor(materialName)`: returns `[{dungeon, difficulty, amount}]` built from `DUNGEONS.normal`. Use it for a small "Where to get" link next to any material shown elsewhere. On the Gear page upgrade calculator, the Mana materials come from the Currency Dungeon "Endless Summoning Grounds": link that one to the Currency page.

## Don't

- Don't change any numbers in `data.json`, any tier, or anything on the tier list.
- Don't touch the public (non-preview) look of any page.
- Don't remove the old `trait` page logic. Only move its menu button into the group.
- Don't add libraries or new files. Everything goes in `index.html` and `data.json`, as with the rest of the site.

## Before you commit

1. `python3 tools/validate_data.py` passes.
2. `python3 -m http.server`, then open `http://localhost:8000/?tiers=new`. Check:
   - no console errors;
   - the Dungeons group opens and closes;
   - all three sub-pages render;
   - the I/II/III selector changes the rewards;
   - every filter works;
   - clicking "General sets", "Normal Dungeons" and a set name on the Gear page lands on the filtered list;
   - `#dungeons?set=The%20Infiltrator` works.
3. Open `http://localhost:8000/` (no preview): the menu and Gear page look exactly as before, with no Dungeons group.
4. Update `CHANGELOG.md` and `AGENTS.md`: add the new pages to the Preview section, `renderDungeons()` under `DUNGEONS`, and the functions you added.
5. Small commits with clear messages. Never force-push `main`.

## Spot checks (the page must show these, read from the data)

- Ashen Ruins, Very Hard: Orange gear only, EXP 1400, 35 Adventurer's Emblems, 5 Shape Grinder.
- Warg Cave, Hard: Blue and Purple gear, EXP 500, 10 Adventurer's Emblems, 10 Low-Grade Monster Claw.
- Filter set = Ballad of Life: Warg Cave, Goblin Bandits' Cave, Warg Enclosure, Dark Swamp and Collapsed Sanctuary (5 dungeons).
