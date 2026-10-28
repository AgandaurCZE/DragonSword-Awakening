# Changelog

## 2026-10-28 — Fix site-breaking JavaScript syntax error
- Removed an accidentally duplicated, malformed block inserted before `renderKarmas()` in `index.html`. It contained a stray regex fragment and caused the browser to fail parsing the entire script, preventing the site from initializing.
- Kept the valid Karma skill-preview implementation and the real `renderKarmas()` function intact.
- Validation: confirmed the malformed duplicate block is removed and only one `renderKarmas()` declaration remains. A live browser run was not available in this session.

All changes to this project made by ChatGPT must be recorded here. Entries are newest first.

## 2026-10-28 — Add signature Karma skill previews
- Updated `index.html` only. Skill names mentioned in signature Karma exclusive effects now show a hover/focus preview using the character's existing skill data and styling, including the level slider where applicable.
- Tapping/clicking a linked skill opens its character profile directly on the Skills tab, supporting mobile users.
- Reuses `CHARACTER_PROFILE_DATA`, `formatSkillText` and existing profile skill CSS; no new skill data or large embedded content was added.
- Added explicit links for Dana's “Chako is summoned” wording to Summon Chako and Eileen's “Banner Maid” wording to the recorded Vanguard Banner skill.
- Validation: checked signature effects against the skills recorded for all 20 signature owners; recognized skill names are matched from `data.json`. Live browser testing is not available in this editing session.

## 2026-10-28 — Link signature Karmas to character builds and color their effects
- Updated `index.html` only: each signature Karma now has a clickable character name that opens that character's profile directly on the Build and Teams tab.
- Signature exclusive-effect text now uses the existing skill-text formatter, which colors recognized status/effect terms by their mapped archetype. Matching is case-insensitive so terms such as `frost` and `Bleed` are handled consistently. No Karma records or effect wording in `data.json` were changed.
- Added a small style for the character-name link.
- Validation: inspected all 20 signature Karma records in `data.json`; every signature name matches a character in `HEROES`. Confirmed the formatter uses the existing `STATUS_ARCHETYPE` and `ARCH_COLORS` mappings.
- Runtime browser testing was not available in this repository-editing session.

## 2026-10-27 — Add changelog policy
- Created this `CHANGELOG.md` to maintain a durable record of future ChatGPT changes.
- Read the repository's existing `AGENTS.md` as the project guide; it remains the source of truth for project structure and data rules.
- Validation: confirmed the repository is `AgandaurCZE/DragonSword-Awakening` on branch `main`.
