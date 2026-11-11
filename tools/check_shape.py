"""Shape check: is every key in the data files one the site knows, and of the right type? (Claude, 11 Nov 2026)

tools/validate_data.py checks that names and numbers make sense. This check catches what it can't: a misspelt key
("teir" for "tier"), a key put at the wrong level, a missing field every other entry has, a number typed as text,
a list where an object belongs. The page reads keys by name, so such a slip shows nothing or breaks a tab.

Run from the repository root:
    python3 tools/check_shape.py             compare the data files with the recorded shape (tools/data_shape.json)
    python3 tools/check_shape.py --update    record the current shape, after you ADDED or CHANGED a key ON PURPOSE

Rule for --update: read the list of differences it prints first. Every line must be a change you meant to make and
have documented in docs/DATA_REFERENCE.md. Never run --update just to make an error go away.

How the shape is described (tools/data_shape.json, generated; don't edit by hand):
    {"types": [...]}          the JSON types allowed here: string, number, bool, null
    "record": {req, opt}      an object with fixed keys: `req` must be there, `opt` may be, anything else is an error
    "map": <shape>            an object whose keys are data (hero names, set names, levels ...): every value has this shape
    "list": <shape>           a list: every item has this shape
Paths in messages: `KEY.sub` for a record field, `{}` for any map key, `[]` for any list item.
"""
import difflib, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHAPE_FILE = os.path.join(ROOT, 'tools', 'data_shape.json')
FILES = ['data.json', 'assets/items/materials.json', 'assets/items/ingredients.json', 'assets/items/important.json',
         'assets/items/quest.json', 'assets/items/achievements.json', 'assets/items/cookbook.json']
# Objects the guess below gets wrong. Paths as printed in the messages.
FORCE_MAP = {
    'DAMAGE_CALC.requireAlias', 'FAMILIARS.passiveNotes', 'GEAR_MODEL.runeMix', 'GEAR_STATS.valueSources',
    'GEAR_STATS.observedBlue.rows[].subs', 'GEAR_STATS.observedBlue.subRatios.blueVsDatabaseOrange',
    'GEAR_STATS.observedBlue.subRatios.pieces[].subs', 'HERO_STAT_MODEL.breakthroughProfiles', 'KARMA_ASCENSION.measured{}',
    'KARMA_LEVELLING.measured', 'KARMA_LEVELLING.measured{}', 'LEVEL_COSTS.breakthroughs.heroPattern.insignia',
    'LEVEL_COSTS.breakthroughs.heroPattern.monsterMaterial', 'RUNES.seen', 'RUNES.seen{}', 'TIER_LIST_V2.tierColors', 'ROLE_ICONS',
    'TIER_LIST_V2.heroes{}.bosses', 'TIER_LIST_V2.heroes{}.towers', 'TIER_LIST_V2.undiscovered', 'FAMILIARS.currencies', 'DUNGEONS.undiscovered',
    'effectsByStars', 'effectsByStars{}', 'discovered[].effectsByStars', 'methodCounts',   # assets/items/cookbook.json
}
FORCE_RECORD = set()


def kind(v):
    if v is None: return 'null'
    if isinstance(v, bool): return 'bool'
    if isinstance(v, (int, float)): return 'number'
    if isinstance(v, str): return 'string'
    return 'list' if isinstance(v, list) else 'object'


def names_in(data):
    """Every name used as a cross-reference: a key made only of these is data (a map), not a field name."""
    out = set()
    if not isinstance(data, dict): return out
    out |= {h.get('name') for h in data.get('HEROES', [])}
    out |= {k.get('name') for k in data.get('KARMA_DATA', [])}
    out |= {g.get('name') for g in data.get('GEAR_DATA', [])}
    arches = set(data.get('ARCHES', []))
    out |= arches | {a.lower() for a in arches} | set(data.get('STATUS_ARCHETYPE', {}))
    out |= set(data.get('GEAR_STATS', {}).get('slots', {})) | {'Green', 'Blue', 'Purple', 'Orange'} | set(data.get('TIER_ORDER', []))
    out |= {m.get('name') for m in data.get('TIER_LIST_V2', {}).get('roles', []) if isinstance(m, dict)}
    out.discard(None)
    return out


def is_map(objs, path, names):
    """Guess whether the objects at this path have data as keys. Used only for paths the recorded shape doesn't know yet.
    `objs` is every object found at the path (all 20 heroes for HEROES[], say), so the guess is the same for all of them."""
    if path in FORCE_MAP: return True
    if path in FORCE_RECORD: return False
    keys = {k for o in objs for k in o}
    vals = [v for o in objs for v in o.values()]
    kinds = {kind(v) for v in vals} - {'null'}
    if not keys or len(kinds) > 1: return False
    if all(k in names or k.replace('.', '').replace('-', '').isdigit() for k in keys): return True
    if kinds == {'object'}:
        sets = [set(v) for v in vals if isinstance(v, dict)]
        return len(keys) >= 3 and len(set.intersection(*sets)) >= 0.5 * max(1, len(set.union(*sets)))
    return len(keys) >= 6 and not path.endswith('[]')   # a list item with many text fields is still a record


def infer(values, path, names, old=None):
    """The shape that fits every value found at this path. `old` is the recorded shape here: its map/record decisions are kept."""
    old = old or {}
    shape = {}
    types = sorted({kind(v) for v in values} - {'list', 'object'})
    if types: shape['types'] = types
    lists = [v for v in values if isinstance(v, list)]
    if lists:
        shape['list'] = infer([x for l in lists for x in l], path + '[]', names, old.get('list'))
    objs = [v for v in values if isinstance(v, dict)]
    if objs:
        if 'map' in old or ('record' not in old and is_map(objs, path, names)):
            shape['map'] = infer([x for o in objs for x in o.values()], path + '{}', names, old.get('map'))
        else:
            rec = old.get('record', {})
            known = dict(rec.get('req', {}), **rec.get('opt', {}))
            req, opt = {}, {}
            for key in dict.fromkeys(k for o in objs for k in o):
                sub = infer([o[key] for o in objs if key in o], (path + '.' if path else '') + key, names, known.get(key))
                (req if all(key in o for o in objs) else opt)[key] = sub
            shape['record'] = {'req': req, 'opt': opt}
    return shape


def check(v, shape, path, out):
    k = kind(v)
    if k == 'list':
        if 'list' not in shape: return out.append(f'{path}: is a list, expected {allowed(shape)}')
        for i, x in enumerate(v): check(x, shape['list'], f'{path}[{label(x, i)}]', out)
    elif k == 'object':
        if 'map' in shape:
            for key, x in v.items(): check(x, shape['map'], f'{path}{{{key}}}', out)
        elif 'record' in shape:
            req, opt = shape['record']['req'], shape['record']['opt']
            for key in req:
                if key not in v: out.append(f'{path}: missing key "{key}" (every other entry has it)')
            for key, x in v.items():
                if key in req or key in opt:
                    check(x, req.get(key) or opt[key], f'{path}.{key}', out)
                else:
                    near = difflib.get_close_matches(key, list(req) + list(opt), 1, 0.6)
                    out.append(f'{path}: unknown key "{key}"' + (f' (did you mean "{near[0]}"?)' if near else ''))
        else:
            out.append(f'{path}: is an object, expected {allowed(shape)}')
    elif k not in shape.get('types', []):
        out.append(f'{path}: is {k} ({json.dumps(v, ensure_ascii=False)[:60]}), expected {allowed(shape)}')


def label(x, i):
    """Name list items by their name where they have one, so messages say HEROES[Ryza], not HEROES[19]."""
    if isinstance(x, dict):
        for key in ('name', 'id', 'version', 'skill', 'title', 'level'):
            if isinstance(x.get(key), (str, int)): return str(x[key])
    return str(i)


def allowed(shape):
    parts = list(shape.get('types', [])) + [k if k != 'record' else 'an object' for k in ('list', 'map', 'record') if k in shape]
    return ' or '.join('an object' if p == 'map' else p for p in parts) or 'nothing (empty so far)'


def paths(shape, path='', out=None):
    """Flat {path: description} view of a shape, for showing what --update changes."""
    out = {} if out is None else out
    desc = '/'.join(shape.get('types', []) + [k for k in ('list', 'map', 'record') if k in shape])
    if path: out[path] = desc
    if 'list' in shape: paths(shape['list'], path + '[]', out)
    if 'map' in shape: paths(shape['map'], path + '{}', out)
    if 'record' in shape:
        for key, s in shape['record']['req'].items(): paths(s, f'{path}.{key}' if path else key, out)
        for key, s in shape['record']['opt'].items(): paths(s, (f'{path}.{key}' if path else key) + '?', out)
    return out


def main():
    recorded = json.load(open(SHAPE_FILE, encoding='utf-8')) if os.path.exists(SHAPE_FILE) else {}
    data = {f: json.load(open(os.path.join(ROOT, f), encoding='utf-8')) for f in FILES}
    names = names_in(data['data.json'])
    if '--update' in sys.argv:
        new = {f: infer([data[f]], '', names, recorded.get(f)) for f in FILES}
        changes = 0
        for f in FILES:
            a, b = paths(recorded.get(f, {})), paths(new[f])
            a_plain, b_plain = {p.rstrip('?'): p for p in a}, {p.rstrip('?'): p for p in b}
            for p in sorted(set(a_plain) | set(b_plain)):
                pa, pb = a_plain.get(p), b_plain.get(p)
                if pa is None: line = f'+ added    {pb}: {b[pb]}'
                elif pb is None: line = f'- removed  {pa}: {a[pa]}'
                elif pa != pb: line = f'~ {"now optional" if pb.endswith("?") else "now required"}  {p}'
                elif a[pa] != b[pb]: line = f'~ changed  {p}: {a[pa]} -> {b[pb]}'
                else: continue
                changes += 1
                if recorded: print(f'{f}: {line}')
        json.dump(new, open(SHAPE_FILE, 'w', encoding='utf-8'), ensure_ascii=False, indent=1, sort_keys=True)
        print(f'tools/data_shape.json {"updated" if recorded else "created"}: {changes if recorded else len(FILES)} {"difference(s)" if recorded else "files recorded"}.'
              + (' Check that every line above is a change you meant, and document new keys in docs/DATA_REFERENCE.md.' if recorded and changes else ''))
        return 0
    if not recorded:
        print('check_shape: tools/data_shape.json is missing. Restore it from git; do not recreate it without checking the data first.')
        return 1
    problems = []
    for f in FILES:
        if f not in recorded:
            problems.append(f'{f}: no recorded shape')
            continue
        out = []
        check(data[f], recorded[f], '', out)
        problems += [f'{f}: {m.lstrip(".")}' for m in out]
    if problems:
        print(f'check_shape: {len(problems)} problem(s):')
        for m in problems[:80]: print('  ' + m)
        if len(problems) > 80: print(f'  ... and {len(problems) - 80} more')
        print('If a line is a key you added or changed on purpose: python3 tools/check_shape.py --update (read what it prints).')
        return 1
    print(f'check_shape OK: {len(FILES)} data files match the recorded shape.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
