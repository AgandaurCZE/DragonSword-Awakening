# Project Instructions for ChatGPT and Other Contributors

These instructions apply to all future edits in this repository.

## Source of truth
- Treat the repository's current implementation and the user's latest instructions as the source of truth for website structure and behavior.
- For DragonSword: Awakening game data (heroes, skills, Karmas, gear, teams, effects, stats, acquisition sources, and rankings), use the user's in-game Excel/database data. Do not replace it with internet guides, community opinions, or external tier lists.
- Preserve existing behavior and styling unless the user requests a change. Inspect the current repository files before editing; do not assume older exported HTML files are current.

## Mandatory changelog
- **Every change made by ChatGPT must be documented in `CHANGELOG.md`. This is mandatory, not optional.**
- Add a dated entry for every change, describing the files changed, what changed, and any checks performed. Do not silently combine unrelated changes into an undocumented edit.
- Update the changelog in the same change/commit as the implementation whenever possible.
- Never claim a change was committed or deployed unless the GitHub tool confirms the write succeeded. GitHub Pages deployment may take time after a commit.

## Editing and validation
- Make future requested edits directly in this GitHub repository, `AgandaurCZE/DragonSword-Awakening`, on the appropriate branch, unless the user explicitly asks for a separate local file or branch.
- Inspect the existing code and related assets before modifying anything. Keep the lightweight, faster repository implementation rather than reverting to old, large self-contained exports.
- Validate JavaScript syntax and relevant data/links when possible. Clearly disclose checks that could not be performed.
- Do not invent missing game data. Use explicit placeholders where the user has said the data is not available.
- Keep assets in the repository's asset structure and prefer references to separate assets over embedding large Base64 images in HTML.
