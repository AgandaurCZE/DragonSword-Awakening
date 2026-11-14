"""Refresh the official Steam announcement feed consumed by GitHub Pages."""
import argparse
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
import json
from pathlib import Path
import re
from urllib.parse import urlencode, urlsplit
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
APP = 4570720
CHANNEL = 'steam_community_announcements'
API = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/'
PATCH = re.compile(r'^Update Notes\s+(\d+\.\d+\.\d+)(?=$|[\s:–—-])', re.I)
DAMAGE = re.compile(r'^(.+?):\s*(Base damage|Attack Power(?: coefficient)?)\s*:?\s*(\d+(?:\.\d+)?)(%?)\s*(?:→|->)\s*(\d+(?:\.\d+)?)(%?)\.?$', re.I)
MARKUP = re.compile(r'\[/?(?:h[1-6]|p|hr|list|olist|\*)\]', re.I)


def fetch():
    posts = {}
    cursor = None
    for _ in range(20):
        query = dict(appid=APP, feeds=CHANNEL, count=50, maxlength=0)
        if cursor is not None:
            query['enddate'] = cursor
        with urlopen(f'{API}?{urlencode(query)}', timeout=30) as response:
            result = json.load(response)['appnews']
        if int(result['appid']) != APP:
            raise ValueError('Unexpected Steam app')
        page = result['newsitems']
        posts.update((item['gid'], item) for item in page)
        if len(page) < 50:
            if len(posts) < result['count']:
                raise ValueError('Steam returned an incomplete history')
            return list(posts.values())
        before = min(item['date'] for item in page) + 1
        if cursor is not None and before >= cursor:
            break
        cursor = before
    raise ValueError('Steam pagination did not finish')


def skill_index(profile):
    skills = {}
    for entry in profile.get('skills', []):
        if entry.get('meta', {}).get('attackPct'):
            name = re.split(r'\s+\(Lv\.', entry['skill'])[0].strip()
            skills.setdefault(name.split(' (')[0].casefold(), (name, entry['slot']))
    return skills


def coefficient(value, percent):
    if percent:
        return float(value)
    return int((Decimal(value) * 175).quantize(Decimal('1'), rounding=ROUND_HALF_UP))


def changes(body, profiles):
    skills = {hero: skill_index(profile) for hero, profile in profiles.items()}
    names = {hero.casefold(): hero for hero in profiles}
    rows = {}
    current, balance, fixes, in_fixes = None, False, 0, False
    for raw in MARKUP.sub('\n', re.sub(r'\[/?b\]', '', body, flags=re.I)).splitlines():
        line = raw.strip()
        heading = line.strip('■ []').casefold()
        if re.fullmatch(r'(?:(?:hero|skill|combat) )?balance(?: changes| adjustments)?', heading):
            current, balance, in_fixes = None, True, False
            continue
        if heading in ('bug fixes', 'fixes'):
            current, in_fixes = None, True
            continue
        if line.startswith('■'):
            current, in_fixes = None, False
        if in_fixes:
            fixes += bool(re.match(r'^(?:Fixed|Resolved|Corrected|Addressed)\b', line, re.I))
            continue
        if heading in names:
            current = names[heading]
            continue
        m = DAMAGE.fullmatch(line)
        if m:
            label, stat, before, old_unit, after, new_unit = m.groups()
            key = re.sub(r'\s*\((?:Basic|Jump|Dodge|Dash) Attack\)$', '', label, flags=re.I).casefold()
            candidates = [current] if current else [hero for hero in skills if key in skills[hero]]
            if len(candidates) == 1 and key in skills[candidates[0]] and old_unit == new_unit:
                if (old_unit or stat.casefold() == 'base damage') and float(before) > 0:
                    hero = candidates[0]
                    name, slot = skills[hero][key]
                    rows.setdefault(hero, []).append(dict(skill=name, slot=slot,
                        before=coefficient(before, old_unit), after=coefficient(after, new_unit)))
                    balance = True
                    continue
        label, separator, description = line.partition(':')
        skill = skills.get(current, {}).get(label.casefold())
        if separator and skill and re.search(r'\b(?:Rage|Super Armor|damage|cooldown|application|build.up)\b', description, re.I):
            rows.setdefault(current, []).append(dict(skill=skill[0], slot=skill[1], text=description.strip()))
            balance = True
    return balance, fixes, {hero: summarise(entries, skills[hero]) for hero, entries in rows.items()}


def summarise(rows, skills):
    pairs = [row for row in rows if 'before' in row]
    up = any(row['after'] > row['before'] for row in pairs)
    down = any(row['after'] < row['before'] for row in pairs)
    result = dict(direction='mixed' if up and down else 'buff' if up else 'nerf' if down else 'adjusted',
                  impact=0, changes=rows)
    expected = set(skills.values())
    measured = {(row['skill'], row['slot']) for row in pairs}
    if pairs and measured == expected and len(pairs) == len(expected):
        before = sum(row['before'] for row in pairs)
        after = sum(row['after'] for row in pairs)
        pct = round((after - before) / before * 100, 1)
        result.update(damagePct=pct, totalBefore=round(before, 4), totalAfter=round(after, 4))
        if abs(pct) >= 3 and all('before' in row for row in rows):
            result['direction'] = 'buff' if pct > 0 else 'nerf'
        result['impact'] = 3 if abs(pct) >= 10 else 2 if abs(pct) >= 5 else 1 if abs(pct) >= 3 else 0
    return result


def make_feed(items, data):
    news, patches, versions = [], [], set()
    for item in sorted(items, key=lambda x: (x['date'], x['gid']), reverse=True):
        if (int(item['appid']) != APP or item['feedname'] != CHANNEL
                or not re.match(r'^hound13(?:\s*\||\s*$)', item['author'].strip(), re.I)):
            continue
        ident, title = str(item['gid']), item['title'].strip()
        if not ident.isascii() or not ident.isdecimal() or not title or not item['contents'].strip():
            raise ValueError('Steam post is missing its ID, title or full body')
        url = urlsplit(item['url'])
        if url.scheme != 'https' or url.netloc not in {
            'steamstore-a.akamaihd.net', 'store.steampowered.com', 'steamcommunity.com'
        }:
            raise ValueError('Unexpected source URL in the official Steam feed')
        post = dict(id=ident, title=title, date=datetime.fromtimestamp(item['date'], timezone.utc).date().isoformat(),
                    url=item['url'], body=item['contents'])
        match = PATCH.match(title)
        if not match:
            news.append(post)
            continue
        version = match[1]
        if version in versions:
            continue
        versions.add(version)
        post['version'] = version
        balance, fixes, heroes = changes(post['body'], data['CHARACTER_PROFILE_DATA'])
        post.update(balance=balance, fixCount=fixes, heroChanges=heroes,
                    badges=(['balance'] if balance else []) + (['fix'] if fixes else []))
        patches.append(post)
    if not news or not patches:
        raise ValueError('Steam returned no developer news or patches')
    return dict(posts=news, patches=patches)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', type=Path, help='Replay a saved Steam API response')
    parser.add_argument('--output', type=Path, default=ROOT / 'data' / 'steam-news.json')
    options = parser.parse_args()
    items = json.loads(options.input.read_text(encoding='utf-8'))['appnews']['newsitems'] if options.input else fetch()
    feed = make_feed(items, json.loads((ROOT / 'data.json').read_text(encoding='utf-8')))
    temporary = options.output.with_suffix('.tmp')
    temporary.write_text(json.dumps(feed, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8', newline='\n')
    temporary.replace(options.output)
    print(f"Steam feed: {len(feed['posts'])} news posts and {len(feed['patches'])} patches")


if __name__ == '__main__':
    main()
