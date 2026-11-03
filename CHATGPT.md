## David's main-only preview workflow — confirmed 2 Nov 2026

- Work directly on `main`. Do not create additional branches for planned work unless David explicitly requests an exception.
- The public URL without a query parameter must retain its current appearance, content and behaviour. All planned Codex/Claude changes belong behind `?tiers=new` on the same main branch. This is a runtime preview gate, not a separate branch or separate deployment.
- Commits to main deploy the shared files, but deployment must not promote preview features to public visitors. Verify both URLs whenever relevant. Do not treat main-only publishing as a request to launch the preview publicly.
- Once David and Claude's planned work is complete, David will approve converting the preview into the new public main site. Do not remove the gate before that approval.
- Before ending each task or reaching a chat limit, update repository Markdown handoff notes AND `docs/PROJECT_HANDOFF.txt`: request/scope, decisions/approvals, actual changes and files, validation and limitations, publication commits, completed versus pending work, and exact next steps. Update CHANGELOG.md for changes. Do not rely on chat memory or local-only outputs as the sole handoff.

# ChatGPT-specific project workflow

Read `AGENTS.md` before making changes; it is the repository's source of truth. Do not modify `AGENTS.md` or `CLAUDE.md` unless the user explicitly asks.

For dungeon artwork, read [the workflow and pending fixes](docs/DUNGEON_ARTWORK_WORKFLOW.md). It records David's Proceed/Stop approval flow, the character/framing lessons, and the deferred Difficulty I goblin alignment fix.

## Mandatory post-change checks

After **every** repository change, do not consider the task complete until you have:

1. **Validate syntax.** For JavaScript in `index.html`, extract/check the script with a JavaScript parser or equivalent syntax checker. For `data.json`, parse it as JSON. Check any other changed format with an appropriate validator.
2. **Check the change itself.** Review the diff and confirm the intended code/data is present, no duplicate or malformed blocks were introduced, and existing behavior/data was not accidentally removed.
3. **Run relevant functional checks.** Use a local web server (not `file://`, because the page fetches `data.json`) and test the affected interaction/page when the environment supports it. If browser testing is unavailable, run every feasible automated/static check and clearly state that live behavior remains unverified; never claim a test was run when it wasn't.
4. **Update `CHANGELOG.md` for every change**, including this instruction-file change. Record the date, files changed, what changed, and the validation actually performed and its results. Do not claim validation that was not performed.
5. **Re-fetch/review the committed files** after pushing, and verify the final committed version contains both the intended change and the changelog entry.

A successful commit or a clean-looking snippet is not proof that the site works. Fix any validation failures before reporting completion. If a check cannot be performed, explicitly identify the limitation.

---

# Project handover notes — reviewed 1 Nov 2026

I reviewed the current main branch at HEAD 0417c53a2a89426b0b50b95033a9f5f506fa8cf1 (Claude's latest Gauron raid-tab commit), not just the older state from the previous task. The repository has 672 tracked files across 720 tree entries. This note records the current architecture and the rules I must follow before touching it.

## Non-negotiable architecture

- This is a static GitHub Pages site. There is no framework, bundler, backend, database server or build step.
- data.json is the single source of truth for guide content. index.html is the renderer: layout/CSS, interaction logic and calculations. It must not become a second source of truth.
- Startup is at the bottom of index.html: fetch('data.json?v='+Date.now(), {cache:'no-store'}), parse JSON, destructure selected top-level values into globals, assign remaining keys to globals with fallbacks, then call startApp(). Do not open the page using file://; use a local HTTP server for browser testing.
- startApp() renders the legacy tier list, teams, Karma, Heroes, Gear, patch notes, Familiars, Titles, Trait Dungeons and Cookbook; applies the preview gate; and optionally initialises Tier List V2.
- PAGE_IDS maps navigation keys to page DOM IDs. Character profiles are opened dynamically from CHARACTER_PROFILE_DATA and use the same page shell rather than a separate HTML file.
- ?tiers=new (also ?preview=1 for the general preview flag) is a deliberate unreleased-preview mechanism. PREVIEW_PAGES currently hides Familiars, Titles, Trait Dungeons and Cookbook from ordinary visitors; Tier List V2 is switched on by ?tiers=new. New unreleased tabs/features must respect this gate unless David explicitly says to launch them.
- Data changes normally mean editing data.json only. Change index.html only when a genuinely new rendering/interaction/layout behaviour is required, not to insert character-specific values, item records, ratings, text, numbers, paths or other content.

## Data loading and binding

At startup, index.html explicitly destructures these from the parsed object: HEROES, ROLE_ICONS, ARCHES, TIER_ORDER, TIER_COLORS, TEAM_DATA, KARMA_DATA, CHARACTER_PROFILE_DATA. It then assigns data-backed globals including ARCH_COLORS, STATUS_ARCHETYPE, GEAR_STATS, HERO_BASE_STATS, HERO_BUILDS, HERO_STAT_MODEL, TITLES, AWAKENINGS, GENERIC_KARMA, SKILL_LEVEL_MULTIPLIERS, KARMA_ASCENSION, STATUS_EFFECTS, DATA_META, PATCH_NOTES, FAMILIARS, TRAIT_DUNGEONS, UI_ICONS, TIER_LIST_V2, TOWER_TRIALS and COOKBOOK. The renderer reads these globals; it does not independently fetch or import individual content files.

Current top-level data.json keys:
- schemaVersion, meta
- HEROES (20), ROLE_ICONS (3), ARCHES (9), TIER_ORDER, TIER_COLORS, ARCH_COLORS, STATUS_ARCHETYPE, GENERIC_KARMA
- TEAM_DATA (9), KARMA_DATA (53), KARMA_ASCENSION, KARMA_LEVELLING
- CHARACTER_PROFILE_DATA (20), AWAKENINGS, SKILL_LEVEL_MULTIPLIERS
- GEAR_DATA (12), GEAR_STATS, HERO_STAT_MODEL, HERO_BASE_STATS (20), HERO_BUILDS (20)
- TITLES, DAMAGE_TESTS, STATUS_EFFECTS, PATCH_NOTES, FAMILIARS, TRAIT_DUNGEONS, UI_ICONS, TIER_LIST_V2, TOWER_TRIALS, COOKBOOK.

Treat names and enum strings as foreign keys: hero names must agree across HEROES, CHARACTER_PROFILE_DATA, HERO_BASE_STATS, HERO_BUILDS, Karma signature links, teams, patch notes, awakenings and tier-list ratings. Archetypes, roles, gear set names, stat names, statuses and image paths must match their canonical entries exactly. Preserve existing data shape and 1-space JSON indentation. Do not invent values or silently fill unknown ratings.

## Important data relationships

- HEROES drives the legacy tier list, hero browser, filters, hero portraits, archetypes, roles, owned state, obtain information and hover cards. tiers is the legacy/public rating; never auto-adjust it.
- CHARACTER_PROFILE_DATA[hero] drives the hero guide tabs: profile text, role, skills, skill metadata, pros/cons, Karma and gear recommendations, build data, review and its cross-links. Its readable karma and gear strings are parsed by tools/skill_meta.py into structured build; skills' meta is generated from skill names/descriptions. Keep the source sentences in the documented exact formats and run the generator after editing those source fields.
- Cross-link syntax in review/pros/cons is parsed by richText(): [[hero:Name]], [[skill:Skill]], [[skill:Hero/Skill]], [[karma:Name]], [[set:Name]], [[awk:5]] or [[awk:Hero/5]], optional |label, and **bold**. Verify referenced names exist; links are functional navigation, not decorative text.
- AWAKENINGS stores all six levels per hero, best pick, literal screenshot text, structured always-on stat effects and ratings/reasons. Source screenshots live in assets/awakenings/<Hero>/A1.png…A6.png; the shared awakening icon is assets/awakenings/Awakening_Icon.png. The effects are included in end-game totals and build optimisation.
- KARMA_DATA drives Karma cards and hover cards. Signature Karma base stats plus A6 traits are used in hero totals/build calculations; second Karma is recommendation only. KARMA_ASCENSION drives A0–A6 values.
- GEAR_DATA drives gear set cards and profile set descriptions. GEAR_STATS holds slot main-stat upgrade tables, substat values, rarity scaling, observed Blue values and source/estimate metadata. HERO_BUILDS supplies per-hero slot mains/substats and the selected 2-piece set. HERO_BASE_STATS and HERO_STAT_MODEL feed totals/optimisation.
- endgameStats() in the HTML combines base hero stats, signature Karma, gear mains/substats, set effects, all six awakening effects and the visitor's selected title bonuses. Set effects and awakenings are shown separately. liveBuild() is the browser-side optimiser and must remain equivalent to tools/hero_stats.py; the AGENTS note says the JS port was verified against all stored builds without titles. If the Python optimiser changes, update/check the JS port too.
- TITLES is the source for the Titles page and per-visitor title ticks (localStorage key dsw.selectedTitles.v1). Those ticks contribute account-wide bonuses to end-game stats and can cause live build re-optimisation.
- TIER_LIST_V2 is separate from the legacy HEROES[].tiers. It contains modes, bosses, tiers, tags, and only agreed hero ratings. Never calculate/fill tier placements by formula. The reasoning for ratings is in TODO_David_2026-10-29.txt. Boss tabs can include special theme/info structures; Gauron currently uses theme: "raid" and info panels (fights, strategy, rewards). TOWER_TRIALS provides tower mode data and measured tower rules.
- PATCH_NOTES is rendered by the Patch Notes tab and also drives buff/nerf/mixed arrows and each hero's patch history. Official source text is in assets/patch_notes/<version>.txt; keep the source path and patch version/date/build metadata coherent.
- FAMILIARS, TRAIT_DUNGEONS, COOKBOOK, TITLES, TIER_LIST_V2 and tower mode are data-driven preview features. Familiar abilities/passives and obtain text have source notes under assets/familiars/; Cookbook records recipes, effects, ingredients, images and star tiers.
- UI_ICONS maps menu icons. Some remaining visual constants are intentionally hard-coded in HTML and explicitly documented in AGENTS.md: Karma accent colours, team tier label colours, kit filter options, Ryza's NEW badge, V2 tag/kit SVG icons, patch badge/arrow visuals, skill max-to-Lv1 ratio, Karma trait-to-stat mapping and gear slot list. Do not casually move or duplicate these. If a request concerns one, first check the AGENTS documented exception and the relevant renderer.

## Folder map (current tree)

- assets/heroes/: 20 canonical hero portraits; referenced by HEROES[].portrait.
- assets/archetypes/, assets/roles/: archetype and role icons referenced by hero/filter data.
- assets/karma/: 53 Karma card artworks referenced by KARMA_DATA[].image.
- assets/gear/: 12 set icons referenced by GEAR_DATA[].icon.
- assets/awakenings/: per-hero A1–A6 source screenshots plus the shared awakening icon.
- assets/bosses/: full boss images and banner crops for V2 Hunt/Raid tabs.
- assets/trait/: Trait Dungeon banners and reward/emblem/EXP/archetype stone icons.
- assets/cooking/: discovered Cookbook dish pictures.
- assets/familiars/: familiar portraits, species ability source screenshots and cropped ability icons; the two text files are the source notes for obtain methods and passives.
- assets/ui/: menu/mode icons, gold variants, currency icons and Tower crests/reward icons; includes legacy PNG/SVG source/unused icons.
- assets/items/: item JSON catalogues (materials, important items, ingredients, achievements, cookbook) and 109 icons. These are reference/source data and not all are wired into the site; check before adding a UI.
- assets/help/: 67 Help-page screenshots plus transcription in notes.txt; reference-only, not currently rendered.
- assets/merc-crew/: 21 reward-track screenshots and notes; not transcribed level-by-level or rendered yet.
- assets/exchange/: source screenshots plus prices/chest-drop notes; not rendered yet.
- assets/runes/: rune type/slot icon assets and README with rules; not rendered yet.
- assets/raid/: raid introduction/reward screenshots and notes; Gauron is currently partly integrated into V2 data/UI.
- assets/rift/: portal image and Corrupted Entities notes; Rift mode not released and not rendered.
- assets/tower/: Tower of Trials screenshots and notes; tower mode/data is partly integrated into V2.
- assets/patch_notes/: official patch notes 1.0.0–1.1.2, verbatim source files.
- tools/: offline Python helpers only; the site does not execute them.

## Offline tools and required workflow

- tools/validate_data.py: validate JSON, canonical names/foreign keys, builds and stat validity, ratings, awakening effects and asset paths. Run it whenever data.json changes.
- tools/hero_stats.py: computes estimated base stats and recommended builds from model, Karma, awakenings, gear and skill data. It deliberately does not overwrite estimated: false measured hero stats. Run without --write to inspect proposed changes; use --write only when David's request and evidence justify recalculation. It also syncs profile gear sentences and structured sets.
- tools/skill_meta.py: derives each skill's meta (max level, attack percentage, inflicted statuses, activation requirements) and profile build from the canonical skill text and readable recommendation sentences. Run --write after changing those source fields.
- Tools require Python 3 and no extra packages. Run from repository root. No build process is involved.

## Change safety / validation checklist

1. Read AGENTS.md before every task. Use data.json as canonical content store. Do not add static guide content to index.html.
2. Before editing, inspect the exact current JSON object, corresponding renderer, and any generator/validator rules. Never infer the schema from an old memory or previous commit.
3. Make the smallest necessary change. Do not restructure unrelated keys, rewrite formatting broadly, or update generated fields manually when a generator owns them.
4. Keep unknown/unverified facts explicitly unknown; preserve estimates and their flags; do not convert modelled values into measurements.
5. After data edits: parse JSON; run python3 tools/validate_data.py; if source text changed, run python3 tools/skill_meta.py --write; if stats/gear model changed, inspect tools/hero_stats.py output and coordinate its browser-side optimiser counterpart. Review the diff.
6. For HTML edits: inspect all affected render paths and data references; syntax-check extracted JavaScript; do not introduce character-/item-specific content constants. Test via local HTTP server and browser when available.
7. For any UI feature, keep mobile behaviour, keyboard/focus, hover/tap and preview gating in mind.
8. Do not change the look unless David asks. Do not touch AGENTS.md or CLAUDE.md unless explicitly requested.
9. This user specifically prohibited repository changes during the familiarisation task except this CHATGPT.md update. No data, HTML, asset, TODO, AGENTS or CHANGELOG files were changed during this review. CHANGELOG was intentionally left untouched because the user limited permitted edits to CHATGPT.md.
10. After every future repository change, re-fetch committed files and verify the exact resulting content. Be honest about whether browser testing was actually available.

## Latest repository state reviewed

- Branch: main; latest commit reviewed: 0417c53a2a89426b0b50b95033a9f5f506fa8cf1 (1 Nov 2026, Gauron raid tab).
- Most recent work includes: chapter 5/story data, new portraits and familiar, additional titles/items, measured level-50 stats for Reina and Charlotte, Gauron Raid panels, Rune reference notes, Help-page transcriptions and Mercenary Crew reward-track screenshots.
- CHANGELOG.md is newest-first and is the historical narrative of Claude's work. Read its latest entries before any task to understand recent changes and avoid undoing them.
- David's TODO_David_2026-10-29.txt contains his detailed V2 tier-list rationale; never override those decisions without discussing them.
- CLAUDE.md is effectively empty (11 bytes); substantive Claude instructions/history are in AGENTS.md, CHANGELOG.md, TODO_David_2026-10-29.txt and the asset-folder notes/readmes.


## Completed Dungeons work — 3 Nov 2026

The earlier `docs/TASK_dungeons_page.md` is a historical task brief; it predates implementation and contains obsolete instructions (for example, that Currency Dungeons are only a navigation entry and that Normal artwork is unfinished). Use `AGENTS.md`, this completed handoff and `docs/PROJECT_HANDOFF.txt` for current state.

### Provenance and completed changes
- David clarified that the original Normal Dungeons structure and visual foundation were produced by him with the ChatGPT chat version. Do not attribute that foundation to this project. In the subsequent work here, the Normal reward records were migrated to the shared Trait-style key/count format, and their item labels/icons—including EXP—were resolved from `DUNGEONS.rewardItems`; set icons remain linked through `GEAR_DATA`.
- The 15 Normal Dungeon cards, per-difficulty I/II/III selection, reward display and three background variants per dungeon are present in the preview. The Goblin Bandits' Cave Difficulty I artwork alignment remains recorded as a pending visual correction in `docs/DUNGEON_ARTWORK_WORKFLOW.md`.
- Currency Dungeons has three discovered entries and two locked placeholders. The three discovered entries have key/count rewards for all three difficulties, item labels/icons resolve through `currencyRewardItems`, selectors reset to Normal when leaving the page, and each card has its approved custom background. The frame is a separate overlay; its slight corner alignment issue is deferred to David's separate graphics pass.
- The Currency reward data includes EXP, Gold, Adventurer's Emblem, Basic/Advanced/Core Combat Text, Mana Shard/Crystal/Ore and Arcana of War/Beginnings/Peace. Values were dictated and confirmed by David; do not infer amounts for the two locked dungeons.
- Trait Dungeons keeps its existing data and rendering. Nine preview banners were added and assigned in menu order to three Mantius, two Drosophia and four Ghagaroach variants. Archetype marks follow the explicit per-boss direction, including the agreed Bloodburst and Ghagaroach exceptions.
- The earlier Gear-menu links from General Sets and three named sets to Normal Dungeons are also part of the completed preview work; set links apply a data-derived filter, which clears on leaving Normal Dungeons while difficulty choices are otherwise retained as specified.

### Release boundary
- All these additions are served from `main` but gated by `?tiers=new`. The plain public URL must remain unchanged. Do not remove the preview gate or publish the preview publicly without David's explicit approval.
- Currency frame corner polish is deferred to David/Claude. The Goblin Bandits' Cave I alignment correction is separately pending. No other work is currently implied by this handoff.

## Completed artwork handoff

Read `docs/PROJECT_HANDOFF.txt` for the full four-dungeon task, approvals, exact publication commits, verification, publication obstacles and still-pending Goblin I alignment correction. All twelve final backgrounds are published; public promotion is not authorised.
