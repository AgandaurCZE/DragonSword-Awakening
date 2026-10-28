"""Recalculate HERO_BASE_STATS (level-70 estimates) and HERO_BUILDS (recommended gear) from the inputs in data.json.

Run from the repository root:
    python3 tools/hero_stats.py           # show what would change
    python3 tools/hero_stats.py --write   # write the changes into data.json

Inputs (all in data.json):
  HERO_STAT_MODEL.levelCurve           a + b*(exp(r*(L-1)) - 1) per stat (refit it when new level measurements arrive)
  HERO_STAT_MODEL.breakthroughProfiles Lv20/Lv30 bonuses and the per-tier increase
  HERO_BASE_STATS[hero].profile        which breakthrough profile a hero uses
  HERO_BASE_STATS[hero].estimated      false = measured in-game: this script never overwrites that hero's numbers
  GEAR_STATS, KARMA_DATA, HEROES, CHARACTER_PROFILE_DATA, AWAKENINGS (stat effects of all six awakenings count as always on)
The 'why' texts in HERO_BUILDS are kept; only main stats and substats are recalculated.
"""
import json, math, os, sys, itertools, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'data.json')
d = json.load(open(PATH, encoding='utf-8'))
M = d['HERO_STAT_MODEL']
SLOTS = ['Helmet', 'Chest', 'Legs', 'Gloves', 'Boots']
G = d['GEAR_STATS']['slots']
LV = 15
STATUS_OF = {a: s for s, a in d['STATUS_ARCHETYPE'].items() if s not in ('Frozen', 'Freeze')}

# ---------------------------------------------------------------- level-70 base stats
def level_part(stat, L=70):
    c = M['levelCurve'][stat]
    return c['a'] + c['b'] * (math.exp(c['r'] * (L - 1)) - 1)

def breakthroughs(profile, stat):
    p = M['breakthroughProfiles'][profile][stat]
    return sum(p['Lv20'] + p['perTierIncrease'] * i for i in range(len(M['breakthroughs'])))

base = json.loads(json.dumps(d['HERO_BASE_STATS']))
for n, b in base.items():
    if b.get('estimated') is False: continue
    for s in ('Attack', 'Defense', 'Max HP'):
        b[s] = round(level_part(s) + breakthroughs(b['profile'], s))

# ---------------------------------------------------------------- builds
KARMA = {k['signature']: k for k in d['KARMA_DATA'] if k.get('signature')}
TRAIT = {'Attack Power': 'Attack Power Up', 'Critical Rate': 'Critical Hit Chance', 'Max HP': 'Max HP Up', 'Defense': 'Defense Up'}

def awakening_bonus(hero):
    out = collections.Counter()
    for a in d.get('AWAKENINGS', {}).get('heroes', {}).get(hero, {}).get('list', []):
        for e in a.get('effects', []): out[e['stat']] += e['value']
    return out

def karma_bonus(k):
    out = collections.Counter()
    for t in k['traits']: out[TRAIT.get(t['label'], t['label'])] += float(str(t['a6']).rstrip('%'))
    return out

def damage_index(hero, pieces):
    """Attack x expected crit multiplier from hero base + signature Karma (A6) + all six awakenings + gear.
    Set bonuses excluded (several are conditional). Crit Rate counts up to 100%."""
    hb, k = base[hero], KARMA[hero]; kb = karma_bonus(k) + awakening_bonus(hero)
    flat = hb['Attack'] + float(k['base']['Attack']); pct = kb['Attack Power Up']
    cr = hb['Critical Hit Chance'] + kb['Critical Hit Chance']; cd = hb['Critical Damage'] + kb['Critical Damage']
    for s, p in pieces.items():
        for st, v in [(p['main'], G[s]['main'][p['main']][LV])] + [(x, G[s]['sub'][x]) for x in p['subs']]:
            if st == 'Attack': flat += v
            elif st == 'Attack Power Up': pct += v
            elif st == 'Critical Hit Chance': cr += v
            elif st == 'Critical Damage': cd += v
    return flat * (1 + pct / 100) * (1 + min(cr, 100) / 100 * cd / 100), cr

def subs_for(slot, main, priority, n=5):
    out = [s for s in priority if s != main and s in G[slot]['sub']][:n]
    assert len(out) == n, (slot, main, priority)
    return out

def best_damage(hero, fixed, dmg_slots, priority):
    arch = [h['archetype'] for h in d['HEROES'] if h['name'] == hero][0]
    extras = ['Defense Ignore', STATUS_OF[arch] + ' Additional Attack Power', 'Armor Penetration', 'All Status Effect Additional Attack Power']
    best = None
    for combo in itertools.product(['Attack Power Up', 'Critical Hit Chance', 'Critical Damage'], repeat=len(dmg_slots)):
        pieces = {s: dict(p, subs=list(p['subs'])) for s, p in fixed.items()}
        for s, m in zip(dmg_slots, combo): pieces[s] = {'main': m, 'subs': subs_for(s, m, priority + extras)}
        while True:  # drop Crit Rate substats that only push past 100%
            _, cr = damage_index(hero, pieces)
            c = sorted((G[s]['sub']['Critical Hit Chance'], s) for s in pieces if 'Critical Hit Chance' in pieces[s]['subs'])
            c = [(v, s) for v, s in c if cr - v >= 100]
            if not c: break
            p = pieces[c[0][1]]
            rest = [x for x in priority + extras if x not in (p['main'], 'Critical Hit Chance') and x not in p['subs']]
            p['subs'] = [x for x in p['subs'] if x != 'Critical Hit Chance'] + rest[:1]
        score, _ = damage_index(hero, pieces)
        key = (round(score, 3), -sum(p['main'] == 'Critical Hit Chance' for p in pieces.values()))
        if best is None or key > best[0]: best = (key, pieces)
    return {s: best[1][s] for s in SLOTS}

DMG = ['Attack Power Up', 'Critical Hit Chance', 'Critical Damage', 'Attack']
SUPPORT = ['Max HP Up', 'Attack Power Up', 'Critical Hit Chance', 'Critical Damage', 'Defense Up', 'Defense Ignore']
TANK = ['Max HP Up', 'Defense Up', 'Max HP', 'Defense', 'Critical Damage Reduction', 'Critical Hit Resistance']

builds = json.loads(json.dumps(d['HERO_BUILDS']))
for h in d['HEROES']:
    n = h['name']; role_text = d['CHARACTER_PROFILE_DATA'][n]['role']
    if h['classType'] == 'Tank':
        btype = 'Tank'
        mains = {'Helmet': 'Max HP Up', 'Chest': 'Max HP Up', 'Legs': 'Defense Up', 'Gloves': 'Defense Up', 'Boots': 'Max HP Up'}
        pieces = {s: {'main': mains[s], 'subs': subs_for(s, mains[s], TANK)} for s in SLOTS}
    elif h['role'] == 'Support' and 'Enabler' not in role_text:
        btype = 'Support'
        fixed = {'Chest': {'main': 'Max HP Up', 'subs': subs_for('Chest', 'Max HP Up', SUPPORT)},
                 'Legs': {'main': 'Defense Up', 'subs': subs_for('Legs', 'Defense Up', SUPPORT)}}
        pieces = best_damage(n, fixed, ['Helmet', 'Gloves', 'Boots'], ['Max HP Up', 'Attack Power Up', 'Critical Hit Chance', 'Critical Damage'])
    else:
        btype = 'Damage'
        pieces = best_damage(n, {}, SLOTS, DMG)
    b = builds.setdefault(n, {'why': '', 'rarity': 'Orange', 'level': LV})
    b['type'] = btype; b['pieces'] = pieces

# ---------------------------------------------------------------- report / write
changes = []
for n in base:
    for s in ('Attack', 'Defense', 'Max HP'):
        if base[n][s] != d['HERO_BASE_STATS'][n][s]: changes.append(f'{n} {s}: {d["HERO_BASE_STATS"][n][s]} -> {base[n][s]}')
for n in builds:
    for s in SLOTS:
        old, new = d['HERO_BUILDS'].get(n, {}).get('pieces', {}).get(s), builds[n]['pieces'][s]
        if old != new: changes.append(f'{n} {s}: {old} -> {new}')
print('\n'.join(changes) if changes else 'No changes.')
if '--write' in sys.argv and changes:
    d['HERO_BASE_STATS'] = base; d['HERO_BUILDS'] = builds
    json.dump(d, open(PATH, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('data.json updated. Run tools/validate_data.py next.')
