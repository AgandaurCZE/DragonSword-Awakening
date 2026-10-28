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
Damage builds also get their 2-piece set chosen here (HERO_BUILDS[hero].setChoice; the 3-piece stays the archetype set).
Options: Battle Will (+6% Attack Power Up), The Infiltrator (+9% Crit Rate), and the set of any status that one of the
hero's skills needs to activate (Azure Gale = Airborne, Earthshatterer = Knockdown, Holy Arbiter = Stun, Ruinsbreaker = Break).
A status set's +15% Additional Damage only counts on hits against an enemy with that status (measured, see DAMAGE_TESTS):
  r       = share of the hero's skill % (each damage skill once) from skills that NEED the status; other hits are ignored
  share   = damage share of those hits: 2.5r / (2.5r + 1.5(1-r))  (Airborne/Knockdown/Stun +100% and the own status +50%;
            1.5r / (1.5r + 1.5(1-r)) = r for Break, whose hit bonus isn't measured)
  gain    = 0.15 / (1 + (Additional Damage already on that status + on the hero's own status) / 100)
            (assumes Additional Damage of different statuses ADDS; if it multiplies, status sets are worth more)
  value   = Attack x crit value x (1 + share x gain)
Blazing Flames' 3-piece (+15% Crit Rate for 12 s after applying Burn) counts as always on for Aria, Kalien and Kalsion,
who apply Burn with almost every skill; other 3-piece bonuses stay out (their triggers aren't constant).
Mains are re-optimised for every option. Profile 'gear' sentences and 'build.sets' are rewritten to match.
The 'why' texts in HERO_BUILDS are kept; only main stats, substats and setChoice are recalculated.
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

def damage_index(hero, pieces, extra=None):
    """Attack x expected crit multiplier from hero base + signature Karma (A6) + all six awakenings + gear
    + extra (the always-on bonus of the 2-piece set being tried). The 3-piece set's bonuses are conditional and left out.
    Crit Rate counts up to 100%."""
    hb, k = base[hero], KARMA[hero]; kb = karma_bonus(k) + awakening_bonus(hero) + collections.Counter(extra or {})
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

def best_damage(hero, fixed, dmg_slots, priority, extra=None, mult=1.0):
    arch = [h['archetype'] for h in d['HEROES'] if h['name'] == hero][0]
    extras = ['Defense Ignore', STATUS_OF[arch] + ' Additional Attack Power', 'Armor Penetration', 'All Status Effect Additional Attack Power']
    best = None
    for combo in itertools.product(['Attack Power Up', 'Critical Hit Chance', 'Critical Damage'], repeat=len(dmg_slots)):
        pieces = {s: dict(p, subs=list(p['subs'])) for s, p in fixed.items()}
        for s, m in zip(dmg_slots, combo): pieces[s] = {'main': m, 'subs': subs_for(s, m, priority + extras)}
        while True:  # drop Crit Rate substats that only push past 100%
            _, cr = damage_index(hero, pieces, extra)
            c = sorted((G[s]['sub']['Critical Hit Chance'], s) for s in pieces if 'Critical Hit Chance' in pieces[s]['subs'])
            c = [(v, s) for v, s in c if cr - v >= 100]
            if not c: break
            p = pieces[c[0][1]]
            rest = [x for x in priority + extras if x not in (p['main'], 'Critical Hit Chance') and x not in p['subs']]
            p['subs'] = [x for x in p['subs'] if x != 'Critical Hit Chance'] + rest[:1]
        score, _ = damage_index(hero, pieces, extra)
        key = (round(score * mult, 3), -sum(p['main'] == 'Critical Hit Chance' for p in pieces.values()))
        if best is None or key > best[0]: best = (key, pieces)
    return {s: best[1][s] for s in SLOTS}, best[0][0]

# ---------------------------------------------------------------- 2-piece set choice (damage builds)
GEAR = {g['name']: g for g in d['GEAR_DATA']}
STATUS_SET = {'Airborne': 'Azure Gale', 'Knockdown': 'Earthshatterer', 'Stun': 'Holy Arbiter', 'Break': 'Ruinsbreaker'}
PHYSICAL = ('Airborne', 'Knockdown', 'Stun')

def required_share(hero):
    """Share of the hero's skill % that comes from skills needing each status (each damage skill counted once;
    a skill that accepts any of several statuses counts equally towards each)."""
    by_name = {}
    for sk in d['CHARACTER_PROFILE_DATA'][hero]['skills']:
        m = sk.get('meta') or {}
        if not m.get('attackPct') or 'Mastery' in sk.get('slot', ''): continue
        nm = sk['skill'].split('  (')[0].strip()
        if nm not in by_name or m['attackPct'] > by_name[nm][0]: by_name[nm] = (m['attackPct'], m.get('requiresAny', []))
    total = sum(v[0] for v in by_name.values()); out = collections.Counter()
    for pct, req in by_name.values():
        req = [r for r in req if r in STATUS_SET]
        for r in req: out[r] += pct / len(req) / total
    return out

def status_ad(hero, status, three_set):
    """Additional Damage % already on a status: signature Karma (A6) + awakenings + the 3-piece set's 2-piece bonus."""
    v = karma_bonus(KARMA[hero])[status + ' Additional Damage'] + awakening_bonus(hero)[status + ' Additional Damage']
    v += sum(x['value'] for x in GEAR[three_set]['twoBonus'] if x['stat'] == status + ' Additional Damage')
    return v

def set_options(hero, three_set):
    arch = [h['archetype'] for h in d['HEROES'] if h['name'] == hero][0]
    own = STATUS_OF[arch] if three_set != 'Ruinsbreaker' else 'Break'
    base_extra = collections.Counter({'Critical Hit Chance': 15}) if three_set == 'Blazing Flames' else collections.Counter()
    opts = {'Battle Will': (base_extra + collections.Counter({'Attack Power Up': 6}), 1.0, None),
            'The Infiltrator': (base_extra + collections.Counter({'Critical Hit Chance': 9}), 1.0, None)}
    for st, r in required_share(hero).items():
        name = STATUS_SET[st]
        if name == three_set or r <= 0: continue
        w = 2.5 if st in PHYSICAL else 1.5
        share = w * r / (w * r + 1.5 * (1 - r))
        gain = 0.15 / (1 + (status_ad(hero, st, three_set) + status_ad(hero, own, three_set)) / 100)
        gain_mult = 0.15 / (1 + status_ad(hero, st, three_set) / 100)
        opts[name] = (base_extra, 1 + share * gain, {'status': st, 'skillShare': round(r * 100), 'damageShare': round(share * 100),
                      'gainOnThoseHits': round(gain * 100, 1), 'gainIfBonusesMultiply': round(gain_mult * 100, 1), 'multIfBonusesMultiply': 1 + share * gain_mult})
    return opts

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
        pieces, _ = best_damage(n, fixed, ['Helmet', 'Gloves', 'Boots'], ['Max HP Up', 'Attack Power Up', 'Critical Hit Chance', 'Critical Damage'])
    else:
        btype = 'Damage'
        three = [x['set'] for x in d['CHARACTER_PROFILE_DATA'][n]['build']['sets'] if x['pieces'] == 3][0]
        results = {}
        for name, (extra, mult, info) in set_options(n, three).items():
            results[name] = best_damage(n, {}, SLOTS, DMG, extra, mult) + (info,)
        ref = results['Battle Will'][1]
        best_set = max(results, key=lambda k: results[k][1])
        pieces = results[best_set][0]
        choice = {'set': best_set, 'threePiece': three,
                  'vsBattleWill': {k: round((v[1] / ref - 1) * 100, 1) for k, v in sorted(results.items(), key=lambda kv: -kv[1][1])}}
        opts = set_options(n, three)
        alt = {k: round((v[1] / opts[k][1] * v[2]['multIfBonusesMultiply'] / ref - 1) * 100, 1) for k, v in results.items() if v[2]}
        if alt: choice['statusSetsIfBonusesMultiply'] = alt
        if results[best_set][2]: choice.update({k: v for k, v in results[best_set][2].items() if k != 'multIfBonusesMultiply'})
    b = builds.setdefault(n, {'why': '', 'rarity': 'Orange', 'level': LV})
    b['type'] = btype; b['pieces'] = pieces
    if btype == 'Damage': b['setChoice'] = choice
    else: b.pop('setChoice', None)

# ---------------------------------------------------------------- report / write
changes = []
for n in base:
    for s in ('Attack', 'Defense', 'Max HP'):
        if base[n][s] != d['HERO_BASE_STATS'][n][s]: changes.append(f'{n} {s}: {d["HERO_BASE_STATS"][n][s]} -> {base[n][s]}')
for n in builds:
    for s in SLOTS:
        old, new = d['HERO_BUILDS'].get(n, {}).get('pieces', {}).get(s), builds[n]['pieces'][s]
        if old != new: changes.append(f'{n} {s}: {old} -> {new}')
    if d['HERO_BUILDS'].get(n, {}).get('setChoice') != builds[n].get('setChoice'):
        changes.append(f"{n} 2-piece: {builds[n].get('setChoice')}")

def sync_profile(n):
    """Rewrite the profile's gear sentence and build.sets from HERO_BUILDS (3-piece kept, 2-piece from setChoice)."""
    p = d['CHARACTER_PROFILE_DATA'][n]; b = builds[n]
    sets = p['build']['sets']; three = [x['set'] for x in sets if x['pieces'] == 3][0]
    two = b.get('setChoice', {}).get('set') or [x['set'] for x in sets if x['pieces'] == 2][0]
    p['build']['sets'] = [{'set': three, 'pieces': 3}, {'set': two, 'pieces': 2}]
    mains = ', '.join(f"{b['pieces'][s]['main']} {s.lower()}" for s in SLOTS)
    p['gear'] = f"Recommended Gear sets: 3 {three} + 2 {two}. Main stats: {mains}. Substats: see Best Main Stats"
print('\n'.join(changes) if changes else 'No changes.')
if '--write' in sys.argv and changes:
    for n in builds: sync_profile(n)
    d['HERO_BASE_STATS'] = base; d['HERO_BUILDS'] = builds
    json.dump(d, open(PATH, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('data.json updated. Run tools/validate_data.py next.')
