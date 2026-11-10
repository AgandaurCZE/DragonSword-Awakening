"""Team-aware endgame gear (Claude, 10 Nov 2026). Like endgame_gear.py, but every status the team keeps on the target counts
(AAP substats, status Additional Damage, set 2-piece Additional Damage only when that status is up), awakenings at David's levels
(Sion A3, others A6), signature Karma traits only for owned signatures. Two runs: every status always up ("full"), and physical
statuses up half the time ("half"; the recommended builds in GAME_MATH 4.3). "Other" = a team status with no AAP substat offered.
Usage (repo root): python3 tools/team_gear.py Kalien Burn,Airborne,Stun   (takes a few minutes)
"""
"""(internal) Team-aware gear: every status the team keeps on the target counts (AAP subs, status AD, set 2-piece AD only if that status is up).
Earthshatterer-style 3-piece effects counted as active (agreed). Awakenings at David's real levels. Signature Karma only if owned."""
import sys, json, itertools, collections, time
_args = sys.argv[1:]; sys.argv = ['x', 'data.json']
src = open('tools/endgame_gear.py', encoding='utf-8').read().split("if __name__ == '__main__':")[0]
ns = {}; exec(src, ns)
d, G, SLOTS, THREE, SETS, KARMA, TITLES, TRAIT = (ns[k] for k in 'd G SLOTS THREE SETS KARMA TITLES TRAIT'.split())
_two = ns['_two']
OWNED = {'Theresia','Kalien','Kalsion','Othello','Cerese','Dana','Ornette','Charlotte','Ryza','Roxy'}
AWK = {'Sion': 3}
def hero_base(h):
    b = d['HERO_BASE_STATS'][h]; c = collections.Counter(TITLES)
    kb = float(KARMA[h]['base']['Attack'])  # same Karma level base either way
    c['flat'] = b['Attack'] + TITLES['Attack'] + kb
    c['Critical Hit Chance'] += b['Critical Hit Chance']; c['Critical Damage'] += b['Critical Damage']
    if h in OWNED:
        for t in KARMA[h]['traits']: c[TRAIT.get(t['label'], t['label'])] += float(str(t['a6']).rstrip('%'))
    for a in d['AWAKENINGS']['heroes'][h]['list'][:AWK.get(h, 6)]:
        for e in a.get('effects', []): c[e['stat']] += e['value']
    return c
def value(c, S, defense):
    atk = (c['flat'] + c['gearAttack']) * (1 + c['Attack Power Up'] / 100)
    aap = sum(c[s + ' Additional Attack Power'] for s in S) + c['All Status Effect Additional Attack Power'] * len(S)
    aap *= 1 + c['Status Effect Additional Attack Power Increase'] / 100
    eff = max(0.0, defense * (1 - min(c['Defense Ignore'], 100) / 100) - c['Armor Penetration'])
    crit = 1 + min(c['Critical Hit Chance'], 100) / 100 * c['Critical Damage'] / 100
    ad = 1 + sum(c[s + ' Additional Damage'] for s in S) / 100
    return (atk + aap) * 1000 / (1000 + eff) * crit * ad
MAINS = ['Attack', 'Attack Power Up', 'Critical Hit Chance', 'Critical Damage']
def build(h, s3, s2, S, defense=1825):
    base = hero_base(h) + _two(s3) + collections.Counter(THREE[s3]) + _two(s2)
    subs_ok = ['Attack', 'Attack Power Up', 'Critical Hit Chance', 'Critical Damage', 'Defense Ignore', 'Armor Penetration',
               'All Status Effect Additional Attack Power', 'Status Effect Additional Attack Power Increase'] + [s + ' Additional Attack Power' for s in S]
    key = lambda st: 'gearAttack' if st == 'Attack' else st
    best = None
    for trip in itertools.combinations_with_replacement(MAINS, 3):
        for ch in MAINS:
            for lg in MAINS:
                mains = {'Helmet': trip[0], 'Gloves': trip[1], 'Boots': trip[2], 'Chest': ch, 'Legs': lg}
                c = collections.Counter(base)
                for s, m in mains.items(): c[key(m)] += G[s]['main'][m][15]
                subs = {s: [] for s in SLOTS}
                for _ in range(25):
                    cur = value(c, S, defense); pick = None
                    for s in SLOTS:
                        if len(subs[s]) >= 5: continue
                        for st in subs_ok:
                            if st in subs[s]: continue
                            k = key(st); v0 = c[k]; c[k] = v0 + G[s]['sub'][st]; g = value(c, S, defense) - cur; c[k] = v0
                            if pick is None or g > pick[0]: pick = (g, s, st)
                    c[key(pick[2])] += G[pick[1]]['sub'][pick[2]]; subs[pick[1]].append(pick[2])
                v = value(c, S, defense)
                if best is None or v > best[0]:
                    best = (v, mains, subs, dict(cr=round(c['Critical Hit Chance'], 1), cd=round(c['Critical Damage'], 1), apu=round(c['Attack Power Up'], 1), di=round(c['Defense Ignore'], 1)))
    return best
PHYS = {'Airborne','Knockdown','Stun','Break'}
def value(c, S, defense):  # S: {status: uptime}; 'Other' = a status with no AAP sub offered
    atk = (c['flat'] + c['gearAttack']) * (1 + c['Attack Power Up'] / 100)
    aap = sum(u * c[s + ' Additional Attack Power'] for s, u in S.items()) + c['All Status Effect Additional Attack Power'] * sum(S.values())
    aap *= 1 + c['Status Effect Additional Attack Power Increase'] / 100
    eff = max(0.0, defense * (1 - min(c['Defense Ignore'], 100) / 100) - c['Armor Penetration'])
    crit = 1 + min(c['Critical Hit Chance'], 100) / 100 * c['Critical Damage'] / 100
    ad = 1 + sum(u * c[s + ' Additional Damage'] for s, u in S.items()) / 100
    return (atk + aap) * 1000 / (1000 + eff) * crit * ad
def build(h, s3, s2, S, defense=1825):
    base = hero_base(h) + _two(s3) + collections.Counter(THREE[s3]) + _two(s2)
    subs_ok = ['Attack','Attack Power Up','Critical Hit Chance','Critical Damage','Defense Ignore','Armor Penetration',
               'All Status Effect Additional Attack Power','Status Effect Additional Attack Power Increase'] + [s + ' Additional Attack Power' for s in S if s != 'Other']
    key = lambda st: 'gearAttack' if st == 'Attack' else st
    best = None
    for trip in itertools.combinations_with_replacement(MAINS, 3):
        for ch in MAINS:
            for lg in MAINS:
                mains = {'Helmet': trip[0], 'Gloves': trip[1], 'Boots': trip[2], 'Chest': ch, 'Legs': lg}
                c = collections.Counter(base)
                for s, m in mains.items(): c[key(m)] += G[s]['main'][m][15]
                subs = {s: [] for s in SLOTS}
                for _ in range(25):
                    cur = value(c, S, defense); pick = None
                    for s in SLOTS:
                        if len(subs[s]) >= 5: continue
                        for st in subs_ok:
                            if st in subs[s]: continue
                            k = key(st); v0 = c[k]; c[k] = v0 + G[s]['sub'][st]; g = value(c, S, defense) - cur; c[k] = v0
                            if pick is None or g > pick[0]: pick = (g, s, st)
                    c[key(pick[2])] += G[pick[1]]['sub'][pick[2]]; subs[pick[1]].append(pick[2])
                v = value(c, S, defense)
                if best is None or v > best[0]:
                    best = (v, mains, subs, dict(cr=round(c['Critical Hit Chance'],1), cd=round(c['Critical Damage'],1), apu=round(c['Attack Power Up'],1), di=round(c['Defense Ignore'],1)))
    return best

if __name__ == '__main__':
    H, ST = _args[0], _args[1].split(',')
    out = {}
    for label, S in [('full', {s: 1.0 for s in ST}), ('half', {s: (0.5 if s in PHYS or s=='Other' else 1.0) for s in ST})]:
        res = []
        for s3 in THREE:
            if s3 == 'Ballad of Life': continue
            for s2 in THREE:
                if s2 in (s3, 'Ballad of Life'): continue
                b = build(H, s3, s2, S); res.append((b[0], s3, s2, b[1], b[2], b[3]))
        res.sort(key=lambda x: -x[0])
        out[label] = [dict(v=r[0], s3=r[1], s2=r[2], mains=r[3], subs=r[4], st=r[5]) for r in res[:12]]
    for lab in out:
        x = out[lab][0]; print(lab, x['s3'], '+', x['s2'], x['st'], x['mains']); [print('  ', s, x['subs'][s]) for s in SLOTS]
        print('  next:', [f"{y['s3']}+{y['s2']} {100*(y['v']/x['v']-1):.1f}%" for y in out[lab][1:4]])
    
