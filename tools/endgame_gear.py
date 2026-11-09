"""Endgame gear analysis (Claude, 9 Nov 2026), separate from tools/hero_stats.py (which ranks builds by Attack x crit only).
Model: Orange +15 gear, all 109 titles, signature Karma A6, all six awakenings; enemy Defense, Defense Ignore, Armor Penetration,
status Additional Attack Power (own status + one physical on the target) and Additional Damage counted (GAME_MATH 3.1).
Every 3-piece effect and every 2-piece Additional Damage counted as active (David's request). Subs chosen greedily, 5 per piece.
Usage (repo root): python3 tools/endgame_gear.py data.json Johnny Airborne [--defense 1825]
"""

import json, sys, itertools, collections
d = json.load(open(sys.argv[1], encoding='utf-8'))
G = d['GEAR_STATS']['slots']; SLOTS = ['Helmet', 'Chest', 'Legs', 'Gloves', 'Boots']; LV = 15
ARCH = {h['name']: h['archetype'] for h in d['HEROES']}
STATUS_OF = {a: s for s, a in d['STATUS_ARCHETYPE'].items() if s not in ('Frozen', 'Freeze')}
KARMA = {k['signature']: k for k in d['KARMA_DATA'] if k.get('signature')}
TRAIT = {'Attack Power': 'Attack Power Up', 'Critical Rate': 'Critical Hit Chance', 'Max HP': 'Max HP Up', 'Defense': 'Defense Up'}
TITLES = collections.Counter()
for t in d['TITLES']['list']:
    for p in t.get('passive') or []: TITLES[p['stat']] += p['value']
SETS = {g['name']: g for g in d['GEAR_DATA']}
ELEM_SET = {'Poison': 'Venomfog Shade', 'Burn': 'Blazing Flames', 'Frost': 'Froststorm', 'Shock': 'Thunderrush', 'Bleed': 'Bloodstained Chaser'}
THREE = {  # 3-piece effects, counted as always active (on top of the 2-piece bonus)
    'The Infiltrator': {'Critical Hit Chance': 6}, 'Battle Will': {'Attack Power Up': 4}, 'Ballad of Life': {'Max HP Up': 6},
    'Venomfog Shade': {'Critical Hit Chance': 12}, 'Blazing Flames': {'Critical Hit Chance': 15},
    'Froststorm': {'Attack Power Up': 10}, 'Thunderrush': {'Critical Hit Chance': 6, 'Critical Damage': 10},
    'Azure Gale': {'Attack Power Up': 10}, 'Holy Arbiter': {'Attack Power Up': 9}, 'Bloodstained Chaser': {'Attack Power Up': 9},
    'Earthshatterer': {'Defense Ignore': 20}, 'Ruinsbreaker': {'Defense Ignore': 10}}

def two(name):
    out = collections.Counter()
    for x in SETS[name]['twoBonus']: out[x['stat']] += x['value']
    return out

def hero_base(h):
    b = d['HERO_BASE_STATS'][h]; c = collections.Counter(TITLES)
    c['flat'] = b['Attack'] + TITLES['Attack'] + float(KARMA[h]['base']['Attack'])
    c['Critical Hit Chance'] += b['Critical Hit Chance']; c['Critical Damage'] += b['Critical Damage']
    for t in KARMA[h]['traits']: c[TRAIT.get(t['label'], t['label'])] += float(str(t['a6']).rstrip('%'))
    for a in d['AWAKENINGS']['heroes'].get(h, {}).get('list', []):
        for e in a.get('effects', []): c[e['stat']] += e['value']
    return c

def value(c, own, phys, defense, statuses):
    atk = c['flat'] + c['Attack'] * 0  # 'Attack' key from titles already in flat
    atk = (c['flat'] + c['gearAttack']) * (1 + c['Attack Power Up'] / 100)
    aap = 0
    if own in statuses: aap += c[own + ' Additional Attack Power']
    if phys in statuses: aap += c[phys + ' Additional Attack Power']
    aap += c['All Status Effect Additional Attack Power'] * len(statuses)
    aap *= 1 + c['Status Effect Additional Attack Power Increase'] / 100
    eff = max(0.0, defense * (1 - min(c['Defense Ignore'], 100) / 100) - c['Armor Penetration'])
    dm = 1000 / (1000 + eff)
    crit = 1 + min(c['Critical Hit Chance'], 100) / 100 * c['Critical Damage'] / 100
    ad = 1 + sum(c[s + ' Additional Damage'] for s in statuses) / 100
    return (atk + aap) * dm * crit * ad

MAINS = ['Attack', 'Attack Power Up', 'Critical Hit Chance', 'Critical Damage']

def optimise(h, sets3, sets2, defense, statuses, phys, allow_aap=True):
    own = STATUS_OF[ARCH[h]]
    base = hero_base(h) + two(sets3) + collections.Counter(THREE[sets3]) + two(sets2)
    subs_ok = ['Attack', 'Attack Power Up', 'Critical Hit Chance', 'Critical Damage', 'Defense Ignore', 'Armor Penetration']
    if allow_aap: subs_ok += [own + ' Additional Attack Power', phys + ' Additional Attack Power',
                              'All Status Effect Additional Attack Power', 'Status Effect Additional Attack Power Increase']
    def add(c, slot, stat, v):
        c['gearAttack' if stat == 'Attack' else stat] += v
    best = None
    hgb = list(itertools.combinations_with_replacement(MAINS, 3))
    for trip in hgb:
        for ch in MAINS:
            for lg in MAINS:
                mains = {'Helmet': trip[0], 'Gloves': trip[1], 'Boots': trip[2], 'Chest': ch, 'Legs': lg}
                c = collections.Counter(base)
                for s, m in mains.items(): add(c, s, m, G[s]['main'][m][LV])
                subs = {s: [] for s in SLOTS}
                for _ in range(25):
                    cur = value(c, own, phys, defense, statuses); pick = None
                    for s in SLOTS:
                        if len(subs[s]) >= 5: continue
                        for st in subs_ok:
                            if st in subs[s]: continue
                            c2 = collections.Counter(c); add(c2, s, st, G[s]['sub'][st])
                            g = value(c2, own, phys, defense, statuses) - cur
                            if pick is None or g > pick[0]: pick = (g, s, st)
                    add(c, pick[1], pick[2], G[pick[1]]['sub'][pick[2]]); subs[pick[1]].append(pick[2])
                v = value(c, own, phys, defense, statuses)
                if best is None or v > best[0]:
                    best = (v, mains, subs, dict(cr=c['Critical Hit Chance'], cd=c['Critical Damage'], apu=c['Attack Power Up'],
                            di=c['Defense Ignore'], atk=(c['flat'] + c['gearAttack']) * (1 + c['Attack Power Up'] / 100)))
    return best

def fixed(h, sets3, sets2, mains, subs, defense, statuses, phys):
    own = STATUS_OF[ARCH[h]]
    c = hero_base(h) + two(sets3) + collections.Counter(THREE[sets3]) + two(sets2)
    for s in SLOTS:
        m = mains[s]; c['gearAttack' if m == 'Attack' else m] += G[s]['main'][m][LV]
        for st in subs[s]: c['gearAttack' if st == 'Attack' else st] += G[s]['sub'][st]
    return value(c, own, phys, defense, statuses), c

def optimise_c(h, sets3, sets2, defense, statuses, phys, min_cr=0, min_cd=0, force=(), allow_aap=True):
    """Like optimise, but every piece first takes the stats in `force` as substats, and only builds reaching min_cr / min_cd count."""
    own = STATUS_OF[ARCH[h]]
    base = hero_base(h) + two(sets3) + collections.Counter(THREE[sets3]) + two(sets2)
    subs_ok = ['Attack', 'Attack Power Up', 'Critical Hit Chance', 'Critical Damage', 'Defense Ignore', 'Armor Penetration']
    if allow_aap: subs_ok += [own + ' Additional Attack Power', phys + ' Additional Attack Power',
                              'All Status Effect Additional Attack Power', 'Status Effect Additional Attack Power Increase']
    def add(c, stat, v): c['gearAttack' if stat == 'Attack' else stat] += v
    best = None
    for trip in itertools.combinations_with_replacement(MAINS, 3):
        for ch in MAINS:
            for lg in MAINS:
                mains = {'Helmet': trip[0], 'Gloves': trip[1], 'Boots': trip[2], 'Chest': ch, 'Legs': lg}
                c = collections.Counter(base)
                for s, m in mains.items(): add(c, m, G[s]['main'][m][LV])
                subs = {s: list(force) for s in SLOTS}
                for s in SLOTS:
                    for st in force: add(c, st, G[s]['sub'][st])
                for _ in range(25 - 5 * len(force)):
                    cur = value(c, own, phys, defense, statuses); pick = None
                    for s in SLOTS:
                        if len(subs[s]) >= 5: continue
                        for st in subs_ok:
                            if st in subs[s]: continue
                            c2 = collections.Counter(c); add(c2, st, G[s]['sub'][st])
                            g = value(c2, own, phys, defense, statuses) - cur
                            if pick is None or g > pick[0]: pick = (g, s, st)
                    add(c, pick[2], G[pick[1]]['sub'][pick[2]]); subs[pick[1]].append(pick[2])
                if c['Critical Hit Chance'] < min_cr or c['Critical Damage'] < min_cd: continue
                v = value(c, own, phys, defense, statuses)
                if best is None or v > best[0]:
                    best = (v, mains, subs, dict(cr=round(c['Critical Hit Chance'], 1), cd=round(c['Critical Damage'], 1),
                            apu=round(c['Attack Power Up'], 1), di=round(c['Defense Ignore'], 1)))
    return best

# --- set Additional Damage counted as active, and the final value() used by optimise_c
_two=two
def two(name):  # set Additional Damage counted as active: book it under a key that always applies
    c=_two(name); r=collections.Counter()
    for k,v in c.items(): r['SetAD' if k.endswith('Additional Damage') else k]+=v
    return r
def value(c, own, phys, defense, statuses):
    atk=(c['flat']+c['gearAttack'])*(1+c['Attack Power Up']/100)
    aap=0
    if own in statuses: aap+=c[own+' Additional Attack Power']
    if phys in statuses: aap+=c[phys+' Additional Attack Power']
    aap+=c['All Status Effect Additional Attack Power']*len(statuses)
    aap*=1+c['Status Effect Additional Attack Power Increase']/100
    eff=max(0.0,defense*(1-min(c['Defense Ignore'],100)/100)-c['Armor Penetration'])
    crit=1+min(c['Critical Hit Chance'],100)/100*c['Critical Damage']/100
    ad=1+(sum(c[s+' Additional Damage'] for s in statuses)+c['SetAD'])/100
    return (atk+aap)*1000/(1000+eff)*crit*ad

if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('hero'); ap.add_argument('physical', help='the physical status the team keeps on the target, e.g. Airborne')
    ap.add_argument('--defense', type=float, default=1825, help='enemy Defense (default 1825: Lv.50 Trait Dungeon boss, the highest recorded)')
    a = ap.parse_args(sys.argv[2:])
    own = STATUS_OF[ARCH[a.hero]]; S = [own, a.physical]; res = []
    for s3 in THREE:
        if s3 == 'Ballad of Life': continue
        for s2 in THREE:
            if s2 in (s3, 'Ballad of Life'): continue
            b = optimise_c(a.hero, s3, s2, a.defense, S, a.physical); res.append((b[0], s3, s2, b[3], b[1], b[2]))
    res.sort(key=lambda x: -x[0]); top = res[0][0]; seen = set()
    print(f"{a.hero} vs Defense {a.defense:.0f}, target has {own} + {a.physical}; every set effect counted as active")
    for v, s3, s2, st, m, subs in res:
        if s3 in seen: continue
        seen.add(s3); print(f"  3-piece {s3:20} + 2-piece {s2:20} {100*(v/top-1):6.1f}%  CR {st['cr']} CD {st['cd']} APU {st['apu']} DI {st['di']}")
    print('  best mains:', res[0][4]); [print('  ', s, res[0][5][s]) for s in SLOTS]
