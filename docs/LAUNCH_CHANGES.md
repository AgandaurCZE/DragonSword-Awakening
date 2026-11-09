# Changes waiting for launch

Library index: [docs/README.md](README.md). Current state: [library/STATUS.md](library/STATUS.md).

These touch public pages, so they can't go in until David approves the launch. Hero pages, `HEROES` and `CHARACTER_PROFILE_DATA` are public.

## Launch checklist (David, 29 Oct; for when the project is done)
1. Apply every hero change below.
2. Footer: replace the current line (it still cites the old 27 Oct workbook) with the credit line: "Fan-made guide. Not affiliated with or endorsed by HOUND13. DragonSword: Awakening and all game assets belong to their respective owners."
3. Corner links: Discord (David's server; ask him for the invite link), GitHub (the repo), and a Claude credit ("Built with Claude" linking to claude.ai, unless Anthropic's brand rules allow the logo). Check each brand's current logo rules first (web search, with David's OK).
4. Optional: a short "how this was made" note (David's in-game testing, the data, open questions).
5. Remove the preview gate (`PREVIEW_PAGES`) and make the new tier list the default.
6. Post on the game's subreddit.

## Kalsion
- `HEROES[].obtain`: story reward for completing Chapter 4, Adventure Quest 40 (David, 8 Nov 2026).
- Pros: "S tier at every stage" and "second-biggest skill hit" need rewriting. Explosion's codex value of 2173% is neither way of using it: press is about 1304% and hold about 2934% at Lv.10, if the shares measured at Lv.7 hold.
- Cons: remove "noticeably weaker while Royal Flame is down"; David opens with it and it stays on when he swaps out.
- Cons or review: Burn adds a lot (hit bonus x2 to x2.5 with Airborne) but his own application is slow on bosses, about 0.42 of a stack per skill and Flame Wave press.
- Verdict and review: "S tier at every stage" no longer matches. New rating: A overall, B single target, S groups. Best for bosses with Reina and Eileen.

## Cerese
- `HEROES[].obtain`: story reward, Adventure Quest 30, end of Chapter 3 (David, 31 Oct 2026).

## Ryza
- Verdict and pros: "Good later", "A tier at end-game" and "isn't a starter in any team" no longer match. New rating: A overall, A single target, S groups; Gatherer, Self-sufficient, Expert −1.
- Review: mention the 17–20 second Shock stack alone, and that a Shock teammate makes it easier and reaches 2 stacks for the mount.

## Sion
- Review and verdict: match the new rating, B overall, B single target, A groups; Team buffer, Enabler, Needs A1. His old tiers are A from mid-game.
- `TEAM_DATA` and review text: check that they describe Divine Smash and Justice Fall as Knockdown.

## Othello
- `HEROES[].obtain`: story reward for finishing chapter 5 (David, 5 Nov 2026).
- Review and verdict: match the new rating, B overall, B single target, A groups; Gatherer, Self-sufficient, Expert −1.
- Cons: "In the Crushing team he has no Frost partner, so his Frozen-only skills fire less often" no longer holds; he reaches Frozen alone.
- `TEAM_DATA`, Frostbite team: David found Cerese gets in his way (explodes his prison and Frozen enemies, lifts Knockdown targets). Review with Dana once he owns her.

## Charlotte
- Cons: "Only 2 of her skills apply Poison (Poison Step and Poison Dagger)" is wrong: 4 do. Test 01 also measured Poison on Invisible's clone explosion (0.24) and Illusion Kick (0.15) (agreed 29 Oct, never applied).
- Skill cards: add a note that the clone explosion applies Poison and Airborne and Illusion Kick applies Poison, which the codex doesn't say. Skill text stays word for word from the codex; add Poison and Airborne to `meta.inflicts` by hand (`skill_meta.py` reads only the codex text, so check it doesn't overwrite them).

## Johnny
- Venom Cutter: Test 01 measured 0.20 Airborne, and it spreads Airborne to other enemies hit, but `meta.inflicts` lists only Poison. Add Airborne by hand, as for Charlotte.

## Castella
- Review: A1 mainly lets her stand in for a dedicated Knockdown enabler in more teams. Pros: breaks enemies fast, and broken enemies don't act for 8 s (forgiving for newer and casual players). Agreed 29 Oct, never applied.

