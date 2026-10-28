"""Derive searchable skill details and structured build recommendations in data.json.

Run from the repository root after editing skill text or the Karma/gear recommendation sentences:
    python3 tools/skill_meta.py           # show a summary
    python3 tools/skill_meta.py --write   # write into data.json

Adds to every skill in CHARACTER_PROFILE_DATA[hero].skills:
  meta = {maxLevel, attackPct, inflicts[], requiresAny[]}
    maxLevel     number in "(Lv.N)" in the skill name (null for passives and mode headings)
    attackPct    the max-level "Attack Power N% Damage" value (first one in the text), or null
    inflicts     statuses the skill applies: from "(Status)" tags in its name and "inflicts/applies" lines
    requiresAny  statuses or states named in its "Activation Conditions" line (any one of them is enough)
Adds to every profile:
  build = {karma: {signature, second, alternatives[]}, sets: [{set, pieces}]}
    parsed from the "Recommended Karma: ..." and "Recommended Gear sets: ..." sentences, which stay as the readable source.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'data.json')
d = json.load(open(PATH, encoding='utf-8'))
STATUS = sorted(set(d['STATUS_ARCHETYPE']), key=len, reverse=True)       # Poison, Burn, ..., Frozen, Freeze
STATES = ['Super Armor Break', 'Stealth']

def found(text, words):
    out = []
    for w in words:
        if re.search(r'\b' + re.escape(w) + r'\b', text) and w not in out: out.append(w)
    return out

def skill_meta(sk):
    name, desc = sk.get('skill') or '', sk.get('description') or ''
    lines = desc.split('\n')
    mm = re.search(r'\(Lv\.?\s*(\d+)\)', name)
    atk = re.findall(r'Attack Power (\d+)% Damage', desc)
    cond = ' '.join(l for l in lines if l.startswith('Activation Condition'))
    inflict_text = ' '.join(l for l in lines if re.search(r'\b(inflict|inflicts|applies)\b', l, re.I) and not l.startswith('Activation'))
    inflicts = found(inflict_text, STATUS)
    for tag in re.findall(r'\(([^)]*)\)', name.split('  (Lv')[0]):
        for t in (x.strip() for x in tag.split('/')):
            if t in d['STATUS_ARCHETYPE'] and t not in inflicts: inflicts.append(t)
    return {'maxLevel': int(mm.group(1)) if mm else None, 'attackPct': int(atk[0]) if atk else None,
            'inflicts': inflicts, 'requiresAny': found(cond, STATUS + STATES)}

def build(p):
    k = p.get('karma', '')
    main = re.sub(r'^Recommended Karma:\s*', '', k, flags=re.I).split('Alternatives')[0].strip().rstrip('.')
    parts = [x.strip() for x in re.split(r'\s+\+\s+', main) if x.strip()]
    sig = re.sub(r'\s*\(signature[^)]*\)', '', parts[0]).strip() if parts else None
    second = parts[1].strip().rstrip('.') if len(parts) > 1 else None
    alt = re.search(r'Alternatives?:\s*(.*)$', k)
    alts = [x.strip().rstrip('.') for x in alt.group(1).split(',')] if alt else []
    g = re.sub(r'^Recommended Gear sets:\s*', '', p.get('gear', ''), flags=re.I).split('. Main stats:')[0]
    sets = [{'set': m.group(2).strip(), 'pieces': int(m.group(1))} for m in (re.match(r'^(\d+)\s+(.+)$', x.strip()) for x in g.split('+')) if m]
    return {'karma': {'signature': sig, 'second': second, 'alternatives': alts}, 'sets': sets}

P = d['CHARACTER_PROFILE_DATA']
counts = {}
for n, p in P.items():
    for sk in p['skills']:
        if str(sk.get('slot', '')).startswith('MODE SWITCH'): sk.pop('meta', None); continue
        sk['meta'] = skill_meta(sk)
        for s in sk['meta']['inflicts']: counts.setdefault(s, set()).add(n)
    p['build'] = build(p)
for s, hs in sorted(counts.items()): print(f'{s:10} inflicted by {len(hs):2}: {", ".join(sorted(hs))}')
print('Charlotte build:', P['Charlotte']['build'])
if '--write' in sys.argv:
    json.dump(d, open(PATH, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('data.json updated. Run tools/validate_data.py next.')
