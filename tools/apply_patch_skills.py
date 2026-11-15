"""Apply skill damage changes from official Steam patch notes to the hero data (David, 15 Nov 2026).

Reads data/steam-news.json (written by tools/steam_news.py). For every balance patch newer than
meta.balancePatch, each recognised "before -> after" row updates that hero's skill: the
"Attack Power N% Damage" value in the description and meta.attackPct. A row is applied only when
the skill still shows the "before" value (within 2, the rounding of the patch-note conversion);
a skill that already shows the "after" value is left alone, anything else is reported, not guessed.
meta.patch, meta.balancePatch and meta.patchDates follow the newest patches. Tier ratings are
never changed: the tier list marks heroes patched after meta.tierReviewedPatch.

Run: python3 tools/apply_patch_skills.py [--dry-run]. Afterwards run tools/hero_stats.py --write so
the stored builds follow the new skill values (the Steam workflow does both).
"""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def version_key(v):
    return tuple(int(x) for x in v.split('.'))


def skill_name(entry):
    return re.split(r'\s+\(Lv\.', entry['skill'])[0].strip()


def apply(data, feed):
    meta = data['meta']
    profiles = data['CHARACTER_PROFILE_DATA']
    base = version_key(meta.get('balancePatch', '0.0.0'))
    applied, skipped = [], []
    patches = sorted(feed.get('patches', []), key=lambda p: version_key(p['version']))
    for patch in patches:
        v = patch['version']
        meta.setdefault('patchDates', {}).setdefault(v, patch.get('date'))
        if version_key(v) > version_key(meta.get('patch', '0.0.0')):
            meta['patch'] = v
        if not patch.get('balance') or version_key(v) <= base:
            continue
        for hero, change in (patch.get('heroChanges') or {}).items():
            for row in change.get('changes', []):
                if 'after' not in row or hero not in profiles:
                    continue
                entry = next((s for s in profiles[hero]['skills']
                              if skill_name(s) == row['skill'] and s.get('slot') == row['slot']), None)
                if not entry or not entry.get('meta', {}).get('attackPct'):
                    skipped.append(f'{v} {hero} / {row["skill"]}: skill not found')
                    continue
                now, before, after = entry['meta']['attackPct'], row['before'], row['after']
                after = int(round(after))
                if abs(now - after) <= 1:
                    continue
                if abs(now - before) > 2:
                    skipped.append(f'{v} {hero} / {row["skill"]}: shows {now}, patch says {before} -> {after}')
                    continue
                text = entry['description']
                pattern = re.compile(r'(Attack Power\s+)' + str(now) + r'(%)')
                if len(pattern.findall(text)) != 1:
                    skipped.append(f'{v} {hero} / {row["skill"]}: {now}% not found once in the text')
                    continue
                entry['description'] = pattern.sub(lambda m: f'{m.group(1)}{after}{m.group(2)}', text)
                entry['meta']['attackPct'] = after
                applied.append(f'{v} {hero} / {row["skill"]}: {now}% -> {after}%')
        meta['balancePatch'] = v
    return applied, skipped


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--feed', type=Path, default=ROOT / 'data' / 'steam-news.json')
    options = parser.parse_args()
    path = ROOT / 'data.json'
    raw = path.read_text(encoding='utf-8')
    data = json.loads(raw)
    feed = json.loads(options.feed.read_text(encoding='utf-8'))
    before = json.dumps(data, ensure_ascii=False, indent=1) + '\n'
    applied, skipped = apply(data, feed)
    for line in applied:
        print('applied', line)
    for line in skipped:
        print('skipped', line)
    after = json.dumps(data, ensure_ascii=False, indent=1) + '\n'
    if after != before and not options.dry_run:
        tmp = path.with_suffix('.tmp')
        tmp.write_text(after, encoding='utf-8', newline='\n')
        tmp.replace(path)
    print(f'apply_patch_skills: {len(applied)} applied, {len(skipped)} skipped' + (' (dry run)' if options.dry_run else ''))


if __name__ == '__main__':
    main()
