"""Browser checks for the site (Claude, 11 Nov 2026). Part of tools/check_all.py; CI runs it before every deploy.

Run from the repository root:   python3 tools/check_site.py            (everything, about 2 minutes)
                                python3 tools/check_site.py --quick    (3 heroes instead of 20, no parity)

It serves the repository on a local port, opens it in headless Chromium (Playwright) and fails if:
  1. SMOKE   any page logs a console error, throws, or asks for a file that is missing. Every menu page is opened
             on the public URL and on ?tiers=new, at 1400 px and 390 px, plus every hero profile and its three tabs. Clean routes are tested with direct loads and reloads, including the repository prefix.
  2. ROUTES  Beta pages, direct clean links, unified hero/tier addresses and legacy aliases must work.
  3. PARITY  the JS ports in js/04-gear-builds.js no longer give the same answers as the Python tools:
             a) optBest (port of tools/hero_stats.py) must reproduce every stored HERO_BUILDS piece with no titles ticked;
             b) gmBuild (port of tools/team_gear.py) must give the same main stats, substats and damage value as Python.

Needs: pip install playwright, and a Chromium (python3 -m playwright install chromium) or an installed Chrome.
Exit codes: 0 = all passed, 1 = a check failed, 2 = the browser could not be started (the checks did NOT run).
"""
import contextlib, functools, http.server, json, os, sys, threading, tempfile, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUICK = '--quick' in sys.argv
QUICK_HEROES = ['Ryza', 'Sion', 'Alex']          # a Damage, a Support and the Tank build
MODES = [('public', ''), ('preview', '?tiers=new')]
WIDTHS = [(1400, 900), (390, 844)]
# gmBuild parity cases: (hero, 3-piece, 2-piece, statuses, physical statuses up half the time?, enemy Defense)
GM_CASES = [
    ('Ryza', 'Earthshatterer', 'Thunderrush', ['Shock', 'Knockdown', 'Airborne'], True, 1825),
    ('Theresia', 'Earthshatterer', 'Bloodstained Chaser', ['Bleed', 'Stun', 'Airborne'], True, 1825),
    ('Kalsion', 'Blazing Flames', 'The Infiltrator', ['Burn', 'Airborne', 'Other'], True, 1825),
    ('Charlotte', 'Earthshatterer', 'Venomfog Shade', ['Poison', 'Airborne'], False, 1825),
    ('Sion', 'Thunderrush', 'Battle Will', ['Shock', 'Knockdown'], True, 1000),
    ('Castella', 'Ruinsbreaker', 'Holy Arbiter', ['Bleed', 'Stun', 'Airborne', 'Break'], False, 1000),
    # Recorded A3 and A0 heroes guard against the old implicit A6 fallback.
    ('Othello', 'Earthshatterer', 'Froststorm', ['Frost', 'Knockdown'], True, 1825),
    ('Aria', 'Blazing Flames', 'Azure Gale', ['Burn', 'Airborne'], True, 1000),
    ('Alex', 'Earthshatterer', 'Ruinsbreaker', ['Break', 'Knockdown'], False, 1000),
]
problems = []


def bad(msg):
    problems.append(msg)
    print('  FAIL ' + msg)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


@contextlib.contextmanager
def serve(directory, prefix=''):
    """Serve the assembled artifact; old commits without src/ still serve as before.

    The pixel tool uses this same function for reference archives and working files.
    """
    with tempfile.TemporaryDirectory(prefix='site_check_') as temporary:
        directory = os.path.abspath(directory)
        assembled = os.path.join(temporary, prefix) if prefix else temporary
        if os.path.isfile(os.path.join(directory, 'src', 'index.html')):
            subprocess.run([sys.executable, os.path.join(directory, 'tools', 'build_site.py'),
                            '--output', assembled], check=True, capture_output=True)
            directory = temporary
        elif prefix:
            raise ValueError('Prefix hosting requires the assembled layout')
        handler = functools.partial(QuietHandler, directory=directory)
        srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        try:
            yield 'http://127.0.0.1:%d/' % srv.server_address[1] + (prefix + '/' if prefix else '')
        finally:
            srv.shutdown()


def launch(p):
    """Playwright's own Chromium if installed, otherwise a Chrome or Chromium already on the machine."""
    try:
        return p.chromium.launch()
    except Exception as first:
        for exe in ('/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
                    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                    r'C:\Program Files\Google\Chrome\Application\chrome.exe'):
            if os.path.exists(exe):
                return p.chromium.launch(executable_path=exe, args=['--no-sandbox'])
        raise first


def watch(page, where, base):
    """Record console errors, script errors and missing files for this page."""
    def short(u):
        return u.replace(base, '')
    def console(m):
        # A full Chrome asks for /favicon.ico by itself; the site has none yet (SITE.md, handover task 4), so that one 404 is not an error.
        if m.type == 'error' and not str((m.location or {}).get('url', '')).endswith('favicon.ico'):
            bad(f'{where}: console error: {m.text[:300]} ({short((m.location or {}).get("url", ""))})')
    page.on('console', console)
    page.on('pageerror', lambda e: bad(f'{where}: script error: {str(e)[:300]}'))
    page.on('requestfailed', lambda r: None if r.url.startswith('data:') else bad(f'{where}: request failed: {short(r.url)}'))
    page.on('response', lambda r: bad(f'{where}: HTTP {r.status} for {short(r.url)}')
            if r.status >= 400 and not r.url.endswith('favicon.ico') else None)


def open_site(ctx, base, query, where):
    page = ctx.new_page()
    watch(page, where, base)
    page.goto(base + query, wait_until='networkidle')
    page.wait_for_function("typeof HEROES!=='undefined' && HEROES.length>0 && typeof NAV!=='undefined' && NAV.ready && document.getElementById('shortcutsBody').children.length>0", timeout=20000)
    return page


def smoke(browser, base):
    for mode, query in MODES:
        for w, h in WIDTHS:
            where = f'{mode} {w}px'
            ctx = browser.new_context(viewport={'width': w, 'height': h})
            page = open_site(ctx, base, query, where)
            state = page.evaluate("""()=>({
                beta: document.documentElement.classList.contains('beta'),
                v2: !!document.getElementById('tierV2'), legacy: !!document.getElementById('board') || !!document.getElementById('v2Legacy'),
                nav: [...document.querySelectorAll('.nav-item[data-page]')].map(b=>({page:b.dataset.page, hidden:b.hidden, disabled:b.disabled})),
                heroes: HEROES.map(x=>x.name)})""")
            if not state['beta'] or not state['v2'] or state['legacy']:
                bad(f'{where}: Beta launch missing or legacy public tier list remains')
            if page.evaluate("document.getElementById('homePage').hidden"):
                bad(f'{where}: Shortcuts is not the default view')
            for n in state['nav']:
                if n['hidden']:
                    bad(f"{where}: Beta menu page '{n['page']}' is hidden")
            # SMOKE: every menu page a visitor can open.
            pages = [n['page'] for n in state['nav'] if not n['hidden'] and not n['disabled']]
            for pg in pages:
                page.evaluate("p=>document.querySelector('.nav-item[data-page=\"'+p+'\"]').click()", pg)
                page.wait_for_timeout(120)
                shown = page.evaluate("p=>{const s=document.getElementById(p+'Page');return s?!s.hidden:null}", pg)
                if shown is False:
                    bad(f"{where}: clicking '{pg}' did not show its page")
            # Hero profiles: all 20 at 1400 px (the preview Build tab runs the gear model), a few at 390 px.
            heroes = QUICK_HEROES if (QUICK or w < 1000) else state['heroes']
            for name in heroes:
                for tab in ('skills', 'review', 'build'):
                    page.evaluate('([n,t])=>openCharacterProfile(n,t)', [name, tab])
                    if tab == 'build':
                        try:
                            page.wait_for_function("()=>{const o=document.getElementById('gmOut');return !o||!/Working out|Fitting runes/.test(o.textContent)}", timeout=60000)
                        except Exception:
                            bad(f'{where}: {name}: the Best Gear box did not finish within 60 s')
                    else:
                        page.wait_for_timeout(40)
                if page.evaluate("document.getElementById('profilePage').hidden"):
                    bad(f'{where}: {name}: the profile page did not open')
            page.wait_for_load_state('networkidle')
            print(f'  {where}: {len(pages)} pages, {len(heroes)} hero profiles')
            ctx.close()


def python_gm():
    """Load tools/team_gear.py the way it loads itself (it expects the repo root as the working directory)."""
    src = open(os.path.join(ROOT, 'tools', 'team_gear.py'), encoding='utf-8').read().split("\nif __name__ == '__main__':")[0]
    ns, argv = {}, sys.argv
    try:
        exec(compile(src, 'tools/team_gear.py', 'exec'), ns)
    finally:
        sys.argv = argv
    return ns


def parity(browser, base):
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900})
    page = open_site(ctx, base, '', 'parity')
    # a) optBest against the stored builds (what liveBuild() does, with no titles ticked)
    miss = page.evaluate("""()=>{const out=[];for(const name in HERO_BUILDS){const b=HERO_BUILDS[name];let p=null;
        if(b.type==='Damage')p=optBest(name,{},GEAR_SLOTS,['Attack Power Up','Critical Hit Chance','Critical Damage','Attack'],optSetExtra(name));
        else if(b.type==='Support')p=optBest(name,{Chest:b.pieces.Chest,Legs:b.pieces.Legs},['Helmet','Gloves','Boots'],['Max HP Up','Attack Power Up','Critical Hit Chance','Critical Damage'],{});
        if(p)GEAR_SLOTS.forEach(s=>{if(JSON.stringify(p[s])!==JSON.stringify(b.pieces[s]))out.push(name+' '+s+': page '+JSON.stringify(p[s])+' / stored '+JSON.stringify(b.pieces[s]))});}
        return out}""")
    for m in miss:
        bad('PARITY optBest (js/04-gear-builds.js) differs from HERO_BUILDS in data.json: ' + m)
    print(f'  parity a) optBest reproduces the stored builds: {"no" if miss else "yes"}')
    # b) gmBuild against tools/team_gear.py
    ns = python_gm()
    for hero, s3, s2, statuses, half, defense in GM_CASES:
        up = {s: (0.5 if half and (s in ns['PHYS'] or s == 'Other') else 1.0) for s in statuses}
        v, mains, subs, _ = ns['build'](hero, s3, s2, up, defense)
        js = page.evaluate("""([h,awk,sig,s3,s2,S,def])=>{const r=gmBuild(gmSetBase(gmHeroBase(h,awk,sig),s3,s2),S,def);return {v:r.v,mains:r.mains,subs:r.subs}}""",
                           [hero, ns['AWK'][hero], hero in ns['OWNED'], s3, s2, [[s, u] for s, u in up.items()], defense])
        label = f'PARITY gmBuild {hero} {s3} + {s2} {"half" if half else "full"} Def {defense}'
        if js['mains'] != mains:
            bad(f'{label}: main stats differ: page {js["mains"]} / Python {mains}')
        if js['subs'] != subs:
            bad(f'{label}: substats differ: page {js["subs"]} / Python {subs}')
        if abs(js['v'] - v) > 1e-9 * abs(v):
            bad(f'{label}: damage value differs: page {js["v"]!r} / Python {v!r}')
    print(f'  parity b) gmBuild matches tools/team_gear.py on {len(GM_CASES)} builds')
    ctx.close()


def progress_backups(browser, base):
    """Exercise real download/upload/reload/undo, rejection and write-failure recovery (handover #7)."""
    for width in (1400, 390):
        ctx = browser.new_context(viewport={'width': width, 'height': 900}, accept_downloads=True)
        page = open_site(ctx, base, '?tiers=new', f'progress {width}px')
        page.wait_for_function('ITEMDB.ach && ITEMDB.ach.items && ITEMDB.ach.items.length > 0')
        fixture = page.evaluate("""()=>{
            const storage={
                [TITLE_KEY]:[TITLES.list[0].name],
                'dsw.achievements.v1':{[ITEMDB.ach.items[0].name]:1},
                'dsw.cooked.v1':[COOKBOOK.dishes[0].id],
                'dsw.dmgcalc.v1':{...DC_DEF,hero:'Ryza',attack:1234,st:{Shock:{on:true,aap:'2',ad:3}}},
                'dsw.lvcalc.v1':{...LV_DEF,kind:'hero',hero:'Ryza',arch:'Thunderbolt',from:1,to:20}
            };
            for(const [k,v] of Object.entries(storage))localStorage.setItem(k,JSON.stringify(v));
            localStorage.setItem('progress-test-unrelated','keep me');return storage;
        }""")
        page.locator('[data-page="tools"]').click()
        page.locator('[data-tool="backup"]').click()
        with page.expect_download() as event:
            page.locator('#progressExport').click()
        with open(event.value.path(), encoding='utf-8') as f:
            doc = json.load(f)
        if doc['storage'] != fixture:
            bad(f'progress {width}px: exported file did not reproduce all five saved sections')
        before = page.evaluate("""()=>{
            localStorage.removeItem(TITLE_KEY);localStorage.setItem('dsw.cooked.v1','[]');
            localStorage.removeItem('dsw.dmgcalc.v1');return progressSnapshot();
        }""")
        payload = {'name': 'progress.json', 'mimeType': 'application/json', 'buffer': json.dumps(doc).encode()}
        page.locator('#progressFile').set_input_files(payload)
        page.locator('#progressRestore').wait_for(state='visible')
        if page.evaluate('progressSnapshot()') != before:
            bad(f'progress {width}px: merely opening a file changed progress')
        page.locator('#progressCancel').click()
        if page.evaluate('progressSnapshot()') != before:
            bad(f'progress {width}px: Cancel changed progress')
        page.locator('#progressFile').set_input_files(payload)
        page.locator('#progressRestore').wait_for(state='visible')
        with page.expect_navigation(wait_until='networkidle'):
            page.locator('#progressRestore').click()
        page.wait_for_function('HEROES.length > 0 && !!document.getElementById("progressUndo")')
        actual = page.evaluate('()=>Object.fromEntries(Object.entries(progressSnapshot()).map(([k,v])=>[k,v===null?null:JSON.parse(v)]))')
        if actual != fixture or page.evaluate('localStorage.getItem("progress-test-unrelated")') != 'keep me':
            bad(f'progress {width}px: restore changed unrelated storage or lost progress')
        with page.expect_navigation(wait_until='networkidle'):
            page.locator('#progressUndo').click()
        page.wait_for_function('HEROES.length > 0 && !!document.getElementById("progressUndo")')
        if page.evaluate('progressSnapshot()') != before:
            bad(f'progress {width}px: Undo did not restore the exact original raw values and absent keys')
        # Invalid uploads, future formats, unknown keys, bad nested settings: none may write.
        invalid = json.loads(json.dumps(doc))
        invalid['storage']['dsw.lvcalc.v1']['off'] = 'not a list'
        page.locator('#progressFile').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':json.dumps(invalid).encode()})
        page.wait_for_function('document.getElementById("progressStatus").textContent.startsWith("Cannot restore")')
        if page.evaluate('progressSnapshot()') != before or page.locator('#progressReview').is_visible():
            bad(f'progress {width}px: invalid upload was not rejected without writes')
        issues = page.evaluate("""doc=>{
            const errors=[], clone=()=>JSON.parse(JSON.stringify(doc));
            const cases=[
                d=>d.version=999,
                d=>d.storage['unrelated']='bad',
                d=>delete d.storage['dsw.cooked.v1'],
                d=>d.storage['dsw.selectedTitles.v1']=['<img src=x onerror=alert(1)>'],
                d=>d.storage['dsw.dmgcalc.v1'].st={Shock:{on:'yes'}},
                d=>d.storage['dsw.lvcalc.v1'].kind='invalid',
                d=>d.storage['dsw.lvcalc.v1'].from=-10
            ];
            for(const [i,mutate] of cases.entries()){
                const d=clone();mutate(d);try{progressRestore(d);errors.push('invalid case '+i+' accepted')}catch(e){}
            }
            const before=JSON.stringify(progressSnapshot()), undo=localStorage.getItem(PROGRESS_UNDO);
            const setter=Storage.prototype.setItem;let fail=true;
            Storage.prototype.setItem=function(k,v){if(k==='dsw.cooked.v1'&&fail){fail=false;throw new DOMException('test failure','QuotaExceededError')}return setter.call(this,k,v)};
            let rejected=false;
            try{progressRestore(doc)}catch(e){rejected=true}finally{Storage.prototype.setItem=setter}
            if(!rejected||JSON.stringify(progressSnapshot())!==before||localStorage.getItem(PROGRESS_UNDO)!==undo)
                errors.push('mid-write failure did not roll back progress and recovery');
            const absent=clone();for(const k in absent.storage)absent.storage[k]=null;
            progressRestore(absent);
            if(Object.values(progressSnapshot()).some(v=>v!==null))errors.push('absent sections did not reset');
            progressUndo();
            if(JSON.stringify(progressSnapshot())!==before)errors.push('empty restore could not be undone');
            return errors;
        }""", doc)
        for issue in issues:
            bad(f'progress {width}px: {issue}')
        print(f'  progress {width}px: download, review, cancel, restore, reload, undo, invalid files, absent keys and write rollback')
        ctx.close()


def preview_views(browser, base):
    """Preview views the menu walk can't reach (Claude, 11 Nov 2026): every Karma level in the picker shows the measured
    table for Balanced and Attack cards, and legacy #hero/Name/tab links canonicalize and go Back correctly."""
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900})
    page = open_site(ctx, base, '?tiers=new#karma', 'preview Karma levels')
    with open(os.path.join(ROOT, 'data.json'), encoding='utf-8') as f:
        d = json.load(f)
    tables = {}
    for name, t in d['KARMA_LEVELLING']['measured'].items():
        for typ in ('Balanced', 'Attack'):
            if '(' + typ in name and 'Lv70' in t and typ not in tables:
                tables[typ] = t
    if not page.query_selector('#karmaLevel'):
        bad('preview Karma levels: the level picker is missing')
    else:
        for lv in page.evaluate("[...document.querySelectorAll('#karmaLevel option')].map(o=>o.value)"):
            page.select_option('#karmaLevel', lv)
            got = page.evaluate("""()=>{const o={};document.querySelectorAll('#karmaBoard .karma-card').forEach(c=>{const k=KARMA_DATA.find(x=>x.name===c.dataset.karmaName);if(!k||o[k.statType])return;o[k.statType]=[...c.querySelectorAll('[data-karma-stat] b')].map(b=>b.textContent)});return o}""")
            for typ, t in tables.items():
                want = [str(v) for v in t[lv]]
                if got.get(typ) != want:
                    bad(f'preview Karma levels: {typ} at {lv} shows {got.get(typ)}, measured {want}')
    page.goto(base + '?tiers=new#hero/Ryza/build', wait_until='networkidle')
    page.wait_for_timeout(800)
    if page.evaluate("document.getElementById('profilePage').hidden || currentProfileName!=='Ryza'"):
        bad('preview addresses: #hero/Ryza/build did not open Ryza')
    page.evaluate("document.querySelector('.nav-item[data-page=\"gear\"]').click()")
    page.wait_for_timeout(300)
    page.go_back()
    page.wait_for_timeout(800)
    if page.evaluate("document.getElementById('profilePage').hidden"):
        bad('preview addresses: Back from Gear did not return to the hero profile')
    print('  preview Karma levels and Back button checked')
    ctx.close()


def beta_routes(browser, base):
    """Launch contract: direct loads/reloads and UI/history reach the same clean URLs."""
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900})
    page = open_site(ctx, base, '', 'Beta routes')
    config = page.evaluate('()=>({site:SITE,heroes:HEROES.map(h=>h.name)})')
    expected = [
        ['Heroes','Tier List','Karma','Teams','Gear','Familiars','Titles','Cookbook','Item Database'],
        ['Trait Dungeons','Normal Dungeons','Currency Dungeons','Bosses Tier List','Tower Tier List'],
        ['Guide coming soon']*3, ['Damage Calculator','Levelling Calculator']]
    actual = page.locator('.shortcut-group').evaluate_all("ss=>ss.map(s=>[...s.querySelectorAll('.shortcut-card>span:first-of-type')].map(e=>e.textContent))")
    if actual != expected or page.locator('.shortcut-soon[aria-disabled="true"]').count() != 3:
        bad('Beta shortcuts: wrong category order, card order or guide placeholders')
    if not page.locator('.beta-badge').is_visible() or page.locator('.brand-home img').get_attribute('src') != 'assets/logo_2x.png':
        bad('Beta branding: original logo or BETA badge missing')
    for selector, value in [('meta[property="og:image"]','assets/ui/og-image.jpg'), ('link[rel="icon"]','assets/ui/favicon.png')]:
        got = page.locator(selector).get_attribute('content' if selector.startswith('meta') else 'href')
        if not got or not got.endswith(value):
            bad('Beta branding: share art or golden favicon changed')
    cases = [(r, p, None) for p,r in config['site']['routes'].items() if r and p != 'tools']
    cases += [(r, 'tools', t) for t,r in config['site']['toolRoutes'].items()]
    cases += [(h, 'hero', h) for h in config['heroes']]
    cases += [('dungeons','home',None)]
    for path, pg, detail in cases:
        response = page.goto(base+path, wait_until='networkidle')
        page.wait_for_function('NAV.ready')
        state = page.evaluate('navCurrent()')
        want_path = '' if path == 'dungeons' else path
        if response.status != 200 or state['page'] != pg or page.url != base+want_path:
            bad(f'Beta direct route {path}: HTTP {response.status}, state {state}, URL {page.url}')
        if pg == 'hero' and state.get('hero') != detail or pg == 'tools' and state.get('tool') != detail:
            bad(f'Beta direct route {path}: wrong hero/tool {state}')
        page.reload(wait_until='networkidle')
        page.wait_for_function('NAV.ready')
        if page.evaluate('navCurrent().page') != pg:
            bad(f'Beta refresh {path}: wrong view')
    page.goto(base, wait_until='networkidle')
    page.wait_for_function('NAV.ready')
    for label, mode in [('Bosses Tier List','bosses'), ('Tower Tier List','towers')]:
        page.locator('.shortcut-card').filter(has_text=label).click()
        page.wait_for_timeout(80)
        if page.url != base+'tierlist' or page.evaluate('V2.mode') != mode:
            bad(f'Beta shortcut {label}: wrong mode or URL')
        page.locator('.brand-home').click()
    page.evaluate("openCharacterProfile('Ryza','skills')")
    page.wait_for_timeout(100)
    for tab in ('review','build','skills'):
        page.locator(f'[data-profile-tab="{tab}"]').click()
        if page.url != base+'Ryza':
            bad('Beta hero tab changed the unified address')
    page.locator('[data-page="gear"]').click()
    page.wait_for_timeout(100)
    page.go_back()
    page.wait_for_timeout(100)
    if page.url != base+'Ryza' or page.evaluate('navCurrent().hero') != 'Ryza':
        bad('Beta Back did not return to the hero')
    page.go_forward()
    page.wait_for_timeout(100)
    if page.url != base+'gear' or page.evaluate('navCurrent().page') != 'gear':
        bad('Beta Forward did not return to Gear')
    for old, canonical in [('?tiers=new#teams','teams'), ('?preview=1#gear','gear'), ('?tiers=new#hero/Johnny/review','Johnny')]:
        page.goto(base+old, wait_until='networkidle')
        page.wait_for_function('NAV.ready')
        if page.url != base+canonical:
            bad(f'Beta legacy alias {old}: not canonicalized')
    print(f'  Beta: shortcut order, branding, {len(cases)} direct routes and refreshes, unified hero URL, Back/Forward, old links')
    ctx.close()


def beta_interactions(browser, base):
    for width in (1400, 390):
        ctx = browser.new_context(viewport={'width':width,'height':900}, has_touch=width<1000)
        page = open_site(ctx, base, '', f'Beta interactions {width}px')
        issues = page.evaluate("""()=>{
            const failures=[], select=p=>document.querySelector(`[data-page="${p}"]`).click();
            select('dungeons');
            const names=DUNGEONS.normal.map(x=>x.name);
            for(const name of names)for(let i=0;i<3;i++){
                [...document.querySelectorAll('[data-dng]')].find(b=>b.dataset.dng===name&&Number(b.dataset.level)===i).click();
                const b=[...document.querySelectorAll('[data-dng]')].find(b=>b.dataset.dng===name&&Number(b.dataset.level)===i);
                if(!b.classList.contains('on')||DNG.selected[name]!==i)failures.push('normal difficulty '+name+'/'+i);
            }
            select('currency');
            for(const x of DUNGEONS.currency)for(let i=0;i<3;i++){
                [...document.querySelectorAll('[data-currency-dungeon]')].find(b=>b.dataset.currencyDungeon===x.name&&Number(b.dataset.currencyLevel)===i).click();
                if(CURRENCY_DNG_STATE.selected[x.name]!==i)failures.push('currency difficulty '+x.name+'/'+i);
            }
            select('home');select('currency');
            if(Object.keys(CURRENCY_DNG_STATE.selected).length)failures.push('currency reset on leave');
            select('trait');
            for(const c of document.querySelectorAll('.tr-card'))for(const b of c.querySelectorAll('.tr-diff')){
                b.click();if(!b.classList.contains('on')||!c.querySelector('.tr-rewards').children.length)failures.push('trait difficulty');
            }
            select('gear');
            document.querySelector('.gear-section-general .gear-card h3 a').click();
            if(document.getElementById('dungeonsPage').hidden||!DNG.set)failures.push('gear set dungeon crosslink');
            select('tier');
            document.querySelector('[data-v2mode="bosses"]').click();
            for(const b of document.querySelectorAll('[data-v2boss]')){
                const id=b.dataset.v2boss;
                document.querySelector(`[data-v2boss="${id}"]`).click();
                if(V2.boss!==id)failures.push('boss button '+id);
            }
            const alts=[...document.querySelectorAll('.v2-boss-alt')];
            if(alts.length!==2)failures.push('Ursula/Gauron alternate pictures missing');
            for(const a of alts){
                if(getComputedStyle(a).animationName!=='v2alt'||!getComputedStyle(a).backgroundImage.includes('assets/'))failures.push('boss crossfade missing');
                const glow=getComputedStyle(a.parentElement).animationName;
                if(!['v2raid','v2succubus'].includes(glow))failures.push('raid glow missing');
                const anim=a.getAnimations()[0]; if(!anim)failures.push('boss animation not running');
                else {anim.pause();anim.effect.updateTiming({delay:0});anim.currentTime=1000;const off=+getComputedStyle(a).opacity;anim.currentTime=40000;const on=+getComputedStyle(a).opacity;if(on<=off)failures.push('boss pictures do not crossfade');}
            }
            document.querySelector('[data-v2mode="towers"]').click();
            for(const t of TOWER_TRIALS.towers){document.querySelector(`[data-v2tower="${t.id}"]`).click();if(V2.tower!==t.id)failures.push('tower '+t.id);}
            return failures;
        }""")
        for issue in issues:
            bad(f'Beta interactions {width}px: {issue}')
        if page.url != base+'tierlist':
            bad(f'Beta interactions {width}px: tier controls changed unified URL')
        page.evaluate("navNavigate({page:'tools',tool:'damage'})")
        attack = page.locator('[data-k="attack"]')
        attack.fill('1000')
        a = page.locator('#dcOut').inner_text()
        attack.fill('2000')
        if page.locator('#dcOut').inner_text() == a:
            bad(f'Beta interactions {width}px: Damage Calculator did not update')
        page.locator('[data-tool="level"]').click()
        page.locator('#lvTo').fill('20')
        a = page.locator('#lvOut').inner_text()
        page.locator('#lvTo').fill('40')
        if page.locator('#lvOut').inner_text() == a or page.url != base+'tools/LevellingCalculator':
            bad(f'Beta interactions {width}px: Levelling Calculator output or URL wrong')
        page.evaluate("openCharacterProfile('Ryza','review')")
        ref = page.locator('#profileReview [data-ref-type="hero"]').first
        if ref.count():
            if width<1000:
                ref.tap()
            else:
                ref.hover()
            page.locator('#karmaPopover').wait_for(state='visible')
        else:
            bad(f'Beta interactions {width}px: review hero crosslinks missing')
        page.evaluate("navNavigate({page:'home'})")
        page.screenshot(path=f'/tmp/beta-home-{width}.png',full_page=True)
        if page.evaluate('document.documentElement.scrollWidth>innerWidth'):
            bad(f'Beta home {width}px: horizontal overflow')
        print(f'  Beta interactions {width}px: dungeon difficulties, crosslinks, tier modes, raid glow/crossfade, calculators, rich-link popover')
        ctx.close()



def beta_subpath(browser, base):
    """GitHub Pages serves below the repository prefix, not the domain root."""
    ctx = browser.new_context(viewport={'width':390,'height':844})
    page = open_site(ctx, base, 'dungeons/normal', 'repository prefix')
    page.locator('.brand-home').click()
    page.locator('.shortcut-card').filter(has_text='Gear').click()
    if page.url != base+'gear':
        bad('repository prefix: navigation escaped the repository')
    page.reload(wait_until='networkidle')
    page.wait_for_function('NAV.ready')
    page.locator('.gear-section-general .gear-card h3 a').first.click()
    page.wait_for_timeout(100)
    if page.url != base+'dungeons/normal' or not page.evaluate('DNG.set'):
        bad('repository prefix: Gear crosslink failed')
    broken = page.evaluate("[...document.images].filter(i=>!i.complete||i.naturalWidth===0).filter(i=>i.getBoundingClientRect().width>0&&i.loading!=='lazy').map(i=>i.src)")
    if broken:
        bad(f'repository prefix: broken loaded images {broken}')
    print('  GitHub Pages repository prefix: direct route, home, Gear, reload and dungeon crosslink')
    ctx.close()



def tab_titles(browser, base):
    """Browser tab names (David, 11 Nov 2026; check added by Claude 12 Nov): home, pages, tool views, a hero, Back."""
    G = ' | DragonSword: Awakening'
    want = [('', 'DragonSword: Awakening, Guides, tools & Tier List'), ('tierlist', 'Tier List' + G), ('karma', 'Karma' + G),
            ('dungeons/trait', 'Trait Dungeons' + G), ('tools/DamageCalculator', 'Damage Calculator' + G),
            ('tools/LevellingCalculator', 'Levelling Calculator' + G), ('tools', 'Backup & Restore' + G), ('Ryza', 'Ryza Build Guide' + G)]
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900})
    for path, title in want:
        page = open_site(ctx, base, path, f'tab name /{path}')
        if page.title() != title:
            bad(f'tab name: /{path} shows "{page.title()}", expected "{title}"')
        page.close()
    page = open_site(ctx, base, 'Ryza', 'tab name steps')
    page.evaluate("document.querySelector('[data-profile-tab=\"build\"]').click()")
    page.wait_for_timeout(200)
    if page.title() != 'Ryza Build Guide' + G:
        bad(f'tab name: Ryza Build tab shows "{page.title()}"')
    page.evaluate("document.querySelector('.nav-item[data-page=\"gear\"]').click()")
    page.wait_for_timeout(200)
    if page.title() != 'Gear' + G:
        bad(f'tab name: Gear after a hero shows "{page.title()}"')
    page.go_back()
    page.wait_for_timeout(500)
    if page.title() != 'Ryza Build Guide' + G:
        bad(f'tab name: Back to Ryza shows "{page.title()}"')
    print('  tab names checked')
    ctx.close()


def main():
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print('check_site: Playwright is not installed (pip install playwright). The browser checks did NOT run.')
        return 2
    os.chdir(ROOT)
    with serve(ROOT) as base, sync_playwright() as p:
        try:
            browser = launch(p)
        except Exception as e:
            print('check_site: no browser could be started (%s). The browser checks did NOT run.' % str(e).splitlines()[0])
            return 2
        print('check_site: Beta smoke test and legacy URL compatibility')
        smoke(browser, base)
        beta_routes(browser, base)
        beta_interactions(browser, base)
        tab_titles(browser, base)
        with serve(ROOT, prefix=os.path.basename(ROOT)) as prefixed:
            beta_subpath(browser, prefixed)
        if not QUICK:
            print('check_site: JS ports against the Python tools')
            parity(browser, base)
            progress_backups(browser, base)
            preview_views(browser, base)
        browser.close()
    if problems:
        print(f'check_site: {len(problems)} problem(s).')
        return 1
    print('check_site OK: no console errors, no missing files, Beta routes and legacy aliases work' + ('' if QUICK else ', JS ports match Python') + '.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
