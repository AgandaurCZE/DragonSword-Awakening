"""Browser checks for the site (Claude, 11 Nov 2026). Part of tools/check_all.py; CI runs it before every deploy.

Run from the repository root:   python3 tools/check_site.py            (everything, about 2 minutes)
                                python3 tools/check_site.py --quick    (3 heroes instead of 20, no parity)

It serves the repository on a local port, opens it in headless Chromium (Playwright) and fails if:
  1. SMOKE   any page logs a console error, throws, or asks for a file that is missing. Every menu page is opened
             on the public URL and on ?tiers=new, at 1400 px and 390 px, plus every hero profile and its three tabs.
  2. GATE    a preview-only page or the new tier list is reachable on the public URL (the preview gate leaked).
  3. PARITY  the JS ports in js/04-gear-builds.js no longer give the same answers as the Python tools:
             a) optBest (port of tools/hero_stats.py) must reproduce every stored HERO_BUILDS piece with no titles ticked;
             b) gmBuild (port of tools/team_gear.py) must give the same main stats, substats and damage value as Python.

Needs: pip install playwright, and a Chromium (python3 -m playwright install chromium) or an installed Chrome.
Exit codes: 0 = all passed, 1 = a check failed, 2 = the browser could not be started (the checks did NOT run).
"""
import contextlib, functools, http.server, json, os, sys, threading

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
]
problems = []


def bad(msg):
    problems.append(msg)
    print('  FAIL ' + msg)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


@contextlib.contextmanager
def serve(directory):
    """Serve `directory` on a free local port; yields the base URL."""
    handler = functools.partial(QuietHandler, directory=directory)
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        yield 'http://127.0.0.1:%d/' % srv.server_address[1]
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
    page.on('console', lambda m: bad(f'{where}: console error: {m.text[:300]}') if m.type == 'error' else None)
    page.on('pageerror', lambda e: bad(f'{where}: script error: {str(e)[:300]}'))
    page.on('requestfailed', lambda r: None if r.url.startswith('data:') else bad(f'{where}: request failed: {short(r.url)}'))
    page.on('response', lambda r: bad(f'{where}: HTTP {r.status} for {short(r.url)}')
            if r.status >= 400 and not r.url.endswith('favicon.ico') else None)


def open_site(ctx, base, query, where):
    page = ctx.new_page()
    watch(page, where, base)
    page.goto(base + query, wait_until='networkidle')
    page.wait_for_function("typeof HEROES!=='undefined' && HEROES.length>0 && document.getElementById('board').children.length>0", timeout=20000)
    return page


def smoke(browser, base):
    for mode, query in MODES:
        for w, h in WIDTHS:
            where = f'{mode} {w}px'
            ctx = browser.new_context(viewport={'width': w, 'height': h})
            page = open_site(ctx, base, query, where)
            state = page.evaluate("""()=>({
                preview: typeof IS_PREVIEW!=='undefined' && IS_PREVIEW, pv: document.documentElement.classList.contains('pv'),
                v2: !!document.getElementById('tierV2'), previewPages: PREVIEW_PAGES,
                nav: [...document.querySelectorAll('.nav-item[data-page]')].map(b=>({page:b.dataset.page, hidden:b.hidden, disabled:b.disabled})),
                heroes: HEROES.map(x=>x.name)})""")
            # GATE: the public URL must not show preview work; the preview URL must show it.
            if mode == 'public':
                if state['preview'] or state['pv'] or state['v2']:
                    bad(f'{where}: GATE: the public URL is running in preview mode (IS_PREVIEW/html.pv/#tierV2)')
                for n in state['nav']:
                    if n['page'] in state['previewPages'] and not n['hidden']:
                        bad(f"{where}: GATE: preview page '{n['page']}' is visible in the public menu")
            elif not (state['preview'] and state['v2']):
                bad(f'{where}: the preview URL did not switch the preview on')
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
                    if tab == 'build' and mode == 'preview':
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
                           [hero, ns['AWK'].get(hero, 6), hero in ns['OWNED'], s3, s2, [[s, u] for s, u in up.items()], defense])
        label = f'PARITY gmBuild {hero} {s3} + {s2} {"half" if half else "full"} Def {defense}'
        if js['mains'] != mains:
            bad(f'{label}: main stats differ: page {js["mains"]} / Python {mains}')
        if js['subs'] != subs:
            bad(f'{label}: substats differ: page {js["subs"]} / Python {subs}')
        if abs(js['v'] - v) > 1e-9 * abs(v):
            bad(f'{label}: damage value differs: page {js["v"]!r} / Python {v!r}')
    print(f'  parity b) gmBuild matches tools/team_gear.py on {len(GM_CASES)} builds')
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
        print('check_site: smoke test and preview gate')
        smoke(browser, base)
        if not QUICK:
            print('check_site: JS ports against the Python tools')
            parity(browser, base)
        browser.close()
    if problems:
        print(f'check_site: {len(problems)} problem(s).')
        return 1
    print('check_site OK: no console errors, no missing files, the preview gate holds' + ('' if QUICK else ', JS ports match Python') + '.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
