# Changes waiting for launch

Library index: [docs/README.md](README.md). Current state: [library/STATUS.md](library/STATUS.md).

These touch public pages, so they can't go in until David approves the launch. Hero pages, `HEROES` and `CHARACTER_PROFILE_DATA` are public.

**Ratings (10 Nov):** the tier list was re-rated with Masteries on 10 Nov, so the ratings quoted in the hero notes below are out of date: take every rating from `TIER_LIST_V2.heroes` at launch. David will rewrite the review texts himself later (10 Nov).

**Preview CSS:** at launch, drop the `.pv ` prefix from the "Preview-only fixes" block at the end of `<style>` (10 Nov) so its fixes reach everyone, and the `IS_PREVIEW` checks in the code become always-on.

## Launch checklist (David, 29 Oct; for when the project is done)
1. Apply every hero change below.
2. Footer: replace the current line (it still cites the old 27 Oct workbook) with the credit line: "Fan-made guide. Not affiliated with or endorsed by HOUND13. DragonSword: Awakening and all game assets belong to their respective owners." The Gear page's own footnote ("transcribed from the workbook's Gear Sets & Acquisition sheet") cites the workbook too; update it at the same time (Claude, 10 Nov).
3. Corner links: Discord (David's server; ask him for the invite link), GitHub (the repo), and a Claude credit ("Built with Claude" linking to claude.ai, unless Anthropic's brand rules allow the logo). Check each brand's current logo rules first (web search, with David's OK).
4. Optional: a short "how this was made" note (David's in-game testing, the data, open questions).
5. Hero builds: switch the public builds to the full damage model from the preview (David, 9 Nov).
6. Teams page: rebuild `TEAM_DATA` from the tested and rated planner teams (David, 9 Nov). Teams that don't work are deleted and replaced; later, testing against real enemies adds the real feel.
7. Remove the preview gate (`PREVIEW_PAGES`) and make the new tier list the default.
8. Post on the game's subreddit.

## Kalsion · 8 Nov
- `HEROES[].obtain`: story reward for completing Chapter 4, Adventure Quest 40 (David, 8 Nov 2026).
- Pros: "S tier at every stage" and "second-biggest skill hit" need rewriting. Explosion's codex value of 2173% is neither way of using it: press is about 1304% and hold about 2934% at Lv.10, if the shares measured at Lv.7 hold.
- Cons: remove "noticeably weaker while Royal Flame is down"; David opens with it and it stays on when he swaps out.
- Cons or review: Burn adds a lot (hit bonus x2 to x2.5 with Airborne) but his own application is slow on bosses, about 0.42 of a stack per skill and Flame Wave press.
- Verdict and review: "S tier at every stage" no longer matches (rating: `TIER_LIST_V2`). Best for bosses with Reina and Eileen.

## Cerese · 31 Oct
- `HEROES[].obtain`: story reward, Adventure Quest 30, end of Chapter 3 (David, 31 Oct 2026).

## Ryza · 5 Nov
- Verdict and pros: "Good later", "A tier at end-game" and "isn't a starter in any team" no longer match (rating: `TIER_LIST_V2`; tags Gatherer, Self-sufficient, Expert −1, signature card).
- Review: mention the 17–20 second Shock stack alone, and that a Shock teammate makes it easier and reaches 2 stacks for the mount.

## Sion · 5 Nov
- Review and verdict: match the rating in `TIER_LIST_V2` (tags Team buffer, Enabler). His old tiers are A from mid-game.
- `TEAM_DATA` and review text: check that they describe Divine Smash and Justice Fall as Knockdown.

## Othello · 5 Nov
- `HEROES[].obtain`: story reward for finishing chapter 5 (David, 5 Nov 2026).
- Review and verdict: match the rating in `TIER_LIST_V2` (tags Gatherer, Self-sufficient, Expert −1).
- Cons: "In the Crushing team he has no Frost partner, so his Frozen-only skills fire less often" no longer holds; he reaches Frozen alone.
- `TEAM_DATA`, Frostbite team: David found Cerese gets in his way (explodes his prison and Frozen enemies, lifts Knockdown targets). Review with Dana once he owns her.

## Charlotte · 29 Oct
- Cons: "Only 2 of her skills apply Poison (Poison Step and Poison Dagger)" is wrong: 4 do. Test 01 also measured Poison on Invisible's clone explosion (0.24) and Illusion Kick (0.15) (agreed 29 Oct, never applied).
- Skill cards: add a note that the clone explosion applies Poison and Airborne and Illusion Kick applies Poison, which the codex doesn't say. Skill text stays word for word from the codex; add Poison and Airborne to `meta.inflicts` by hand (`skill_meta.py` reads only the codex text, so check it doesn't overwrite them).

## Johnny · 8 Nov
- Venom Cutter: Test 01 measured 0.20 Airborne, and it spreads Airborne to other enemies hit, but `meta.inflicts` lists only Poison. Add Airborne by hand, as for Charlotte.

## Castella · 29 Oct
- Review: A1 mainly lets her stand in for a dedicated Knockdown enabler in more teams. Pros: breaks enemies fast, and broken enemies don't act for 8 s (forgiving for newer and casual players). Agreed 29 Oct, never applied.

