# ChatGPT-specific project workflow

Read `AGENTS.md` before making changes; it is the repository's source of truth. Do not modify `AGENTS.md` or `CLAUDE.md` unless the user explicitly asks.

## Mandatory post-change checks

After **every** repository change, do not consider the task complete until you have:

1. **Validate syntax.** For JavaScript in `index.html`, extract/check the script with a JavaScript parser or equivalent syntax checker. For `data.json`, parse it as JSON. Check any other changed format with an appropriate validator.
2. **Check the change itself.** Review the diff and confirm the intended code/data is present, no duplicate or malformed blocks were introduced, and existing behavior/data was not accidentally removed.
3. **Run relevant functional checks.** Use a local web server (not `file://`, because the page fetches `data.json`) and test the affected interaction/page when the environment supports it. If browser testing is unavailable, run every feasible automated/static check and clearly state that live behavior remains unverified; never claim a test was run when it wasn't.
4. **Update `CHANGELOG.md` for every change**, including this instruction-file change. Record the date, files changed, what changed, and the validation actually performed and its results. Do not claim validation that was not performed.
5. **Re-fetch/review the committed files** after pushing, and verify the final committed version contains both the intended change and the changelog entry.

A successful commit or a clean-looking snippet is not proof that the site works. Fix any validation failures before reporting completion. If a check cannot be performed, explicitly identify the limitation.
