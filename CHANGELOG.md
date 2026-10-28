# Changelog

All changes to this project made by ChatGPT must be recorded here. Entries are newest first.

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
