"""Check data.json for broken cross-references and impossible values.

Run from the repository root:   python3 tools/validate_data.py
Exits with code 1 and lists every problem if anything is wrong. Run it before every commit that touches data.json.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(os.path.join(ROOT, 'data.json'), encoding='utf-8'))
problems = []
def bad(msg): problems.append(msg)

ROLES = {'Main DPS', 'Sub-DPS', 'Support'}
KITS = {'Damage / Control', 'Healer', 'Buffer', 'Tank'}
SLOTS = ['Helmet', 'Chest', 'Legs', 'Gloves', 'Boots']

heroes = [h['name'] for h in d['HEROES']]
H = set(heroes)
arches = set(d['ARCHES'])
statuses = set(d['STATUS_ARCHETYPE'])
karma = {k['name']: k for k in d['KARMA_DATA']}
gear = {g['name']: g for g in d['GEAR_DATA']}
G = d.get('GEAR_STATS', {}).get('slots', {})
sub_pool = set().union(*(set(G[s]['sub']) for s in G)) if G else set()
main_pool = set().union(*(set(G[s]['main']) for s in G)) if G else set()
# Every stat name the totals understand: gear stats, "<Status> Additional Damage/Attack Power", plus a few Karma-only ones.
known_stats = sub_pool | main_pool | {f'{s} Additional Damage' for s in statuses} | {f'{s} Additional Attack Power' for s in statuses} | {'Critical Hit Chance', 'Critical Damage', 'Defense Ignore'}

def asset(path, where):
    if not path or not os.path.exists(os.path.join(ROOT, path)): bad(f'{where}: missing file {path!r}')

# HEROES
if len(H) != len(heroes): bad('HEROES: duplicate names')
for h in d['HEROES']:
    n = h['name']
    if h['archetype'] not in arches: bad(f'HEROES[{n}]: unknown archetype {h["archetype"]!r}')
    if h['role'] not in ROLES: bad(f'HEROES[{n}]: role {h["role"]!r} not one of {sorted(ROLES)}')
    if h['classType'] not in KITS: bad(f'HEROES[{n}]: classType {h["classType"]!r} not one of {sorted(KITS)}')
    for p in ('Early-game', 'Mid-game', 'End-game'):
        if h['tiers'].get(p) not in d['TIER_ORDER']: bad(f'HEROES[{n}]: tier {p} = {h["tiers"].get(p)!r}')
    asset(h['portrait'], f'HEROES[{n}].portrait'); asset(h['archIcon'], f'HEROES[{n}].archIcon')
    for key in ('CHARACTER_PROFILE_DATA', 'HERO_BASE_STATS', 'HERO_BUILDS'):
        if n not in d.get(key, {}): bad(f'{key}: no entry for {n}')
    if n not in d.get('AWAKENINGS', {}).get('heroes', {}): bad(f'AWAKENINGS: no entry for {n}')
    if not any(k.get('signature') == n for k in d['KARMA_DATA']): bad(f'KARMA_DATA: no signature Karma for {n}')
for k in d['ROLE_ICONS'].values(): asset(k, 'ROLE_ICONS')
for a, c in d['ARCH_COLORS'].items():
    if a not in arches: bad(f'ARCH_COLORS: unknown archetype {a}')
for s, a in d['STATUS_ARCHETYPE'].items():
    if a not in arches: bad(f'STATUS_ARCHETYPE[{s}]: unknown archetype {a}')

# Profiles: role prefix, Karma and set names, structured build (if present)
for n, p in d['CHARACTER_PROFILE_DATA'].items():
    if n not in H: bad(f'CHARACTER_PROFILE_DATA: {n} is not in HEROES'); continue
    role = [h['role'] for h in d['HEROES'] if h['name'] == n][0]
    if not p['role'].replace('Role: ', '').startswith(role): bad(f'{n}: profile role text does not start with {role!r}')
    b = p.get('build')
    if b:
        for kn in [b['karma']['signature'], b['karma'].get('second')] + b['karma'].get('alternatives', []):
            if kn and kn not in karma: bad(f'{n}.build.karma: unknown Karma {kn!r}')
        if karma.get(b['karma']['signature'], {}).get('signature') != n: bad(f'{n}.build.karma.signature is not {n}\'s signature card')
        for s in b['sets']:
            if s['set'] not in gear: bad(f'{n}.build.sets: unknown set {s["set"]!r}')
        if sum(s['pieces'] for s in b['sets']) != 5: bad(f'{n}.build.sets: pieces do not add up to 5')
    for sk in p['skills']:
        m = sk.get('meta')
        if m:
            for st in m.get('inflicts', []) + m.get('requires', []):
                if st not in statuses and st not in ('Frozen', 'Super Armor Break', 'Stealth', 'Heretic Judgment'): bad(f'{n} / {sk["skill"]}: unknown status {st!r} in meta')
            mm = re.search(r'\(Lv\.?\s*(\d+)\)', sk['skill'])
            if mm and m.get('maxLevel') != int(mm.group(1)): bad(f'{n} / {sk["skill"]}: meta.maxLevel {m.get("maxLevel")} != name')
            a = re.findall(r'Attack Power (\d+)% Damage', sk['description'] or '')
            if (int(a[0]) if a else None) != m.get('attackPct'): bad(f'{n} / {sk["skill"]}: meta.attackPct does not match text')

# Teams
for t in d['TEAM_DATA']:
    if t['arch'] not in arches: bad(f'TEAM {t["name"]}: unknown archetype')
    if t['lead'] != t['members'][0]['name']: bad(f'TEAM {t["name"]}: lead is not the first member')
    for m in t['members']:
        for x in [m['name']] + m.get('alts', []):
            if x not in H: bad(f'TEAM {t["name"]}: unknown hero {x!r}')

# Karma: A6 = 5 x A0 for every trait (holds for all recorded cards)
for k in d['KARMA_DATA']:
    if k.get('signature') and k['signature'] not in H: bad(f'KARMA {k["name"]}: unknown signature hero')
    if k['archetype'] not in arches: bad(f'KARMA {k["name"]}: unknown archetype')
    for t in k['traits']:
        a0, a6 = float(str(t['a0']).rstrip('%')), float(str(t['a6']).rstrip('%'))
        if abs(a6 - 5 * a0) > 1e-9: bad(f'KARMA {k["name"]} / {t["label"]}: A6 {t["a6"]} is not 5 x A0 {t["a0"]} (check the screenshot)')

# Gear sets
for g in d['GEAR_DATA']:
    asset(g['icon'], f'GEAR_DATA[{g["name"]}].icon')
    for b in g.get('twoBonus', []) + g.get('threeBonus', []):
        if b['stat'] not in known_stats: bad(f'GEAR_DATA[{g["name"]}]: unknown bonus stat {b["stat"]!r}')

# Gear tables and builds
for s in SLOTS:
    if s not in G: bad(f'GEAR_STATS: missing slot {s}'); continue
    for st, vals in G[s]['main'].items():
        if len(vals) != 16: bad(f'GEAR_STATS[{s}].main[{st}]: needs 16 values (+0..+15)')
        if vals != sorted(vals): bad(f'GEAR_STATS[{s}].main[{st}]: values should rise with level')
for n, b in d.get('HERO_BUILDS', {}).items():
    if n not in H: bad(f'HERO_BUILDS: {n} is not in HEROES')
    for s in SLOTS:
        p = b['pieces'].get(s)
        if not p: bad(f'HERO_BUILDS[{n}]: missing {s}'); continue
        if p['main'] not in G[s]['main']: bad(f'HERO_BUILDS[{n}].{s}: main {p["main"]!r} cannot roll on {s}')
        if len(p['subs']) != 5 or len(set(p['subs'])) != 5: bad(f'HERO_BUILDS[{n}].{s}: needs 5 different substats')
        for x in p['subs']:
            if x not in G[s]['sub']: bad(f'HERO_BUILDS[{n}].{s}: substat {x!r} cannot roll on {s}')
        if p['main'] in p['subs']: bad(f'HERO_BUILDS[{n}].{s}: {p["main"]!r} is both main and substat')

# Base stats
for n, b in d.get('HERO_BASE_STATS', {}).items():
    for k in ('Attack', 'Defense', 'Max HP', 'Critical Hit Chance', 'Critical Damage'):
        if not isinstance(b.get(k), (int, float)): bad(f'HERO_BASE_STATS[{n}]: {k} missing')

# Awakenings
AW = d.get('AWAKENINGS', {})
if len(AW.get('ratingScale', [])) != 6: bad('AWAKENINGS.ratingScale needs 6 labels (0-5)')
asset(AW.get('icon'), 'AWAKENINGS.icon')
for n, a in AW.get('heroes', {}).items():
    if n not in H: bad(f'AWAKENINGS: {n} is not in HEROES')
    if [x['level'] for x in a['list']] != [1, 2, 3, 4, 5, 6]: bad(f'AWAKENINGS[{n}]: needs levels 1-6 in order')
    if a['best'] not in range(1, 7): bad(f'AWAKENINGS[{n}]: best must be 1-6')
    for x in a['list']:
        if not 0 <= x['rating'] <= 5: bad(f'AWAKENINGS[{n}] A{x["level"]}: rating must be 0-5')
        for e in x.get('effects', []):
            if e['stat'] not in known_stats: bad(f'AWAKENINGS[{n}] A{x["level"]}: unknown effect stat {e["stat"]!r}')
        asset(f'assets/awakenings/{n}/A{x["level"]}.png', f'AWAKENINGS[{n}] A{x["level"]} source screenshot')

# Step tables
for ml, arr in d.get('SKILL_LEVEL_MULTIPLIERS', {}).get('byMaxLevel', {}).items():
    if len(arr) != int(ml) or arr[0] != 1 or arr[-1] is None: bad(f'SKILL_LEVEL_MULTIPLIERS[{ml}]: needs {ml} values, first 1, last known')
m = d.get('KARMA_ASCENSION', {}).get('multipliers', [])
if len(m) != 7 or m[0] != 1 or m[6] is None: bad('KARMA_ASCENSION.multipliers: needs 7 values, A0 = 1, A6 known')

# Karma and Familiar pictures
for k in d['KARMA_DATA']:
    if k.get('image'): asset(k['image'], f"KARMA_DATA[{k['name']}].image")
for n_, ab in d.get('FAMILIARS', {}).get('abilities', {}).items():
    asset(ab['icon'], f'FAMILIARS.abilities[{n_}].icon')
for g_, ps in d.get('FAMILIARS', {}).get('passives', {}).items():
    for p_ in ps:
        for n_ in re.findall(r'\[([^\]]+)\]', p_['text']):
            if n_ not in d['FAMILIARS'].get('abilities', {}): bad(f'FAMILIARS.passives[{g_}]: unknown ability {n_!r}')
for c_, cur in d.get('FAMILIARS', {}).get('currencies', {}).items():
    asset(cur['icon'], f'FAMILIARS.currencies[{c_}].icon')
for f in d.get('FAMILIARS', {}).get('list', []):
    o_ = f.get('obtain')
    if isinstance(o_, dict) and o_.get('type') == 'currency' and o_.get('currency') not in d['FAMILIARS'].get('currencies', {}): bad(f"FAMILIARS[{f['name']}]: unknown currency {o_.get('currency')!r}")
    if f.get('image'): asset(f['image'], f"FAMILIARS[{f['name']}].image")

# Patch notes: hero names, badge and direction keys, source files
PN = d.get('PATCH_NOTES', {})
pn_versions = [p['version'] for p in PN.get('patches', [])]
if PN and PN.get('latestBalance') not in pn_versions: bad('PATCH_NOTES.latestBalance is not a listed patch')
for p in PN.get('patches', []):
    v = p['version']
    asset(p.get('source', ''), f'PATCH_NOTES {v} source')
    for b in p.get('badges', []) + [h['badge'] for h in p.get('highlights', [])]:
        if b not in PN.get('badgeTypes', {}): bad(f'PATCH_NOTES {v}: unknown badge {b!r}')
    for h in p.get('highlights', []):
        for n in h.get('heroes', []):
            if n not in heroes: bad(f'PATCH_NOTES {v}: unknown hero {n!r} in highlights')
    for n, c in p.get('heroChanges', {}).items():
        if n not in heroes: bad(f'PATCH_NOTES {v}: unknown hero {n!r} in heroChanges')
        if c.get('direction') not in PN.get('directions', {}): bad(f'PATCH_NOTES {v} {n}: unknown direction {c.get("direction")!r}')

if problems:
    print(f'{len(problems)} problem(s):'); [print(' -', p) for p in problems]; sys.exit(1)
print(f'data.json OK: {len(heroes)} heroes, {len(karma)} Karmas, {len(gear)} gear sets, {len(d["TEAM_DATA"])} teams checked.')
