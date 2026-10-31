Items (not used by the page yet). ingredients.json = the Ingredients tab.
 important.json = the Important tab (9 items: Fragment of Sacred Light, Fragment of Memory,
Anonymous Artisan's Crafting Tool (unlocks Rune Slots; Exchange Special, Raid), Stigma Awaken Stone (Exchange Awaken),
Whirling Thoughts (Transmutation; Tower of Trials), Forging Mold, Shape Grinder, Moon Key, Adventurer's Emblem).
materials.json = every item in David's Materials tab (31 Oct 2026, 63 items, game order):
name, type, rarity colour, icon (icons/<slug>.webp, cut from the inventory grid), description, use line, main sources.

WHAT LEVELS WHAT (from the use lines)
- Hero EXP: Basic Combat Text 500, Advanced Combat Text 2,000. Source: Currency Dungeon "Dragon W...".
- Karma EXP: Arcana of War 300, Beginnings 1,000, Peace 4,000, the Future 10,000. Source: Currency Dungeons "Trace of t..." / "Residual...".
- Equipment EXP: Mana Shard 200, Mana Crystal 500, Mana Ore 1,500, Raw Mana Stone 5,000. Source: Currency Dungeons "Endless S..." / "Residual...".
- Skill enhancement: Record of Battle, Secret Text of the Warrior, Secret Text of Victory (Hunt, Exchange), Tome of Insight
  (Sudden Missions, Exchange), Forbidden Grimoire (Legendary treasure chests), and the Hunt boss materials
  (Spiny Fin / Furcas, Blood-stained Hook / Vanak, Sage's Blood / Barduk; Stilled Core of Collapse / Gallore not owned yet).
- Hero Breakthrough: monster materials (Lowest / Low / Intermediate Essence, Hide, Bone Fragment, Carapace, Claw: world
  monsters and Normal Dungeons, lowest grade also Klonie's shop), gathering materials (Fruit of Vitality, Primordial Seed,
  Drop of Purity, Leaf of Vigor) and the five faction Insignias (Exchange).
- Karma Breakthrough: the four mining crystals (Remembrance, Recollection, Reverie, Oblivion), Chronograph of Ages, trait stones.
- Equipment crafting: Binding and Piercing Crystal (mining), Red Pyroxene, Tangled Memories and Reminiscences, trait stones.

NOT IN DAVID'S INVENTORY YET: Intermediate Venom and Bloodburst stones, any Venom low-grade stone, High-Grade trait stones,
Vein Crystal, Tangled Forgetfulness and Remembrance, Stilled Core of Collapse, Fragment of Sacrifice.

INGREDIENTS (ingredients.json, 31 ingredients): category (Meat, Seafood, Eggs, Vegetables, Mushrooms, Herbs, Grains,
Natural Foods), stars 1-4, description, sources (hunting the animal, gathering, farm, shops: Lizzie, Harben, Erena).
Walnuts, Honey and Peanuts can also be eaten raw (red + badge): Walnuts 80 HP, Peanuts 20 HP/s for 5 s, Honey 5% HP on revive.

COOKING (David, 31 Oct 2026): 3 methods (Grilling, Boiling, Slicing); the in-game Cookbook lists 73 recipes and shows
only a silhouette, '?' ingredients and the method until you cook one. 3 slots, one ingredient per slot, so 1-3
ingredients. Many recipes take any ingredient of a category (Scallop Sashimi: any two Seafood, mixed or the same).
Each ingredient gives a different dish per method (eggs: Grilled = Fried Egg [Personal] restores 24% Max HP;
Boiled = Hard-boiled Egg [Team] Attack +130 for 15 min at 4 stars; Sliced = Egg Renew [Team] restores 40% of the
Familiar's Stamina). Dish stars follow the ingredients' rarity: 3x Bird Eggs (2 stars) -> 3-star dish (+105 Attack),
3x Goose Eggs (3 stars) -> 4-star dish (+130 Attack).

TREASURE MAPS (Important tab): e.g. Predator's Treasure Map, "Once you obtain a treasure map, you can open the hidden
treasure chest at that location." Each shows its own map; they disappear once the chest is opened.

COOKBOOK (cookbook.json): 73 recipes = 25 Grilling, 26 Boiling, 22 Slicing; 17 discovered so far, with effects,
stars, ingredients and slot substitutes where David opened them. Food buffs: Meat Stew [Team] Attack +20% (5 stars),
Seafood Stew [Team] Crit Damage +21% (4 stars), Hard-boiled Egg [Team] Attack +130 (4 stars), all 15 minutes.
STAR RULE (45 combinations, all match): dish stars = 1 + floor(sum of ingredient stars / 3), so 1-ingredient dishes max 2 stars,
2-ingredient 3, 3-ingredient 5. Effects per star are a per-dish table (cookbook.json effectsByStars).
