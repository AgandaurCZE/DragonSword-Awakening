"""Pixel check: does the site still look exactly the same? (Claude, 11 Nov 2026)

The public URL (no ?tiers=new) must not change until David approves the launch. This tool proves it: it renders every
public page and hero profile from a reference commit and from your working files, and compares them pixel by pixel.

Run from the repository root, BEFORE committing a change to index.html, css/, js/ or an image:
    python3 tools/public_diff.py                 working files against the last commit (HEAD)
    python3 tools/public_diff.py origin/main     working files against another commit, tag or branch
    python3 tools/public_diff.py --preview       also compare the preview (?tiers=new); use it for refactors that must change nothing
    python3 tools/public_diff.py --quick         5 heroes instead of 20

Result: "identical" (exit 0), or a list of the views that differ with the share of changed pixels and where (exit 1);
the before/after pictures of those views are kept in the folder it prints. A pixel counts as changed when a colour
channel moves by more than 2 of 255: the browser itself varies by 1 on the odd rounded corner between two renders of
the same files, and nobody can see that. A difference is only acceptable when it is
exactly the change David asked for (for example new data he sent); say so in CHANGELOG.md. Anything else: fix it.

Needs Playwright (see tools/check_site.py). Exit 2 = the browser could not be started, so nothing was compared.
"""
import os, shutil, subprocess, sys, tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from check_site import ROOT, serve, launch  # noqa: E402

ARGS = [a for a in sys.argv[1:] if not a.startswith('--')]
REF = ARGS[0] if ARGS else 'HEAD'
QUICK, PREVIEW = '--quick' in sys.argv, '--preview' in sys.argv
QUICK_HEROES = ['Ryza', 'Sion', 'Alex', 'Kalsion', 'Charlotte']
WIDTHS = [(1400, 900), (390, 844)]
# Stop everything that moves, so two renders of the same files give the same pixels.
FREEZE = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}'
SETTLE = """async()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');
 await Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));
 if(document.fonts&&document.fonts.ready)await document.fonts.ready;window.scrollTo(0,0);
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}"""
COMPARE = """async([a,b])=>{const load=u=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=u});
 const A=await load(a),B=await load(b);if(A.width!==B.width||A.height!==B.height)return {size:[A.width,A.height,B.width,B.height]};
 const T=2,H=2048,c=document.createElement('canvas');c.width=A.width;c.height=H;const g=c.getContext('2d',{willReadFrequently:true});
 let n=0,x0=1e9,y0=1e9,x1=-1,y1=-1;
 for(let y=0;y<A.height;y+=H){const h=Math.min(H,A.height-y);g.clearRect(0,0,c.width,H);g.drawImage(A,0,y,A.width,h,0,0,A.width,h);const p=g.getImageData(0,0,A.width,h).data;
  g.clearRect(0,0,c.width,H);g.drawImage(B,0,y,A.width,h,0,0,A.width,h);const q=g.getImageData(0,0,A.width,h).data;
  for(let i=0;i<p.length;i+=4)if(Math.abs(p[i]-q[i])>T||Math.abs(p[i+1]-q[i+1])>T||Math.abs(p[i+2]-q[i+2])>T){n++;const px=(i/4)%A.width,py=y+Math.floor(i/4/A.width);if(px<x0)x0=px;if(px>x1)x1=px;if(py<y0)y0=py;if(py>y1)y1=py;}}
 return {n,total:A.width*A.height,box:[x0,y0,x1,y1]};}"""


def shoot(browser, base, out, only=None):
    """Full-page pictures of every view (or just the views named in `only`); returns the list of file names."""
    names = []
    modes = [('public', '')] + ([('preview', '?tiers=new')] if PREVIEW else [])
    for mode, query in modes:
        for w, h in WIDTHS:
            ctx = browser.new_context(viewport={'width': w, 'height': h})
            page = ctx.new_page()
            page.goto(base + query, wait_until='networkidle')
            page.wait_for_function("typeof HEROES!=='undefined' && HEROES.length>0 && document.getElementById('board').children.length>0", timeout=20000)
            page.add_style_tag(content=FREEZE)

            def snap(name):
                if only is not None and name not in only: return
                page.evaluate(SETTLE)
                page.wait_for_load_state('networkidle')
                page.screenshot(path=os.path.join(out, name), full_page=True)
                names.append(name)
            info = page.evaluate("()=>({nav:[...document.querySelectorAll('.nav-item[data-page]')].filter(b=>!b.hidden&&!b.disabled).map(b=>b.dataset.page),heroes:HEROES.map(x=>x.name)})")
            for pg in info['nav']:
                page.evaluate("p=>document.querySelector('.nav-item[data-page=\"'+p+'\"]').click()", pg)
                if mode == 'preview' and pg in ('dungeons', 'trait', 'currency'):
                    page.wait_for_timeout(600)   # banners preload when a Dungeons page is first opened
                snap(f'{mode}-{w}-{pg}.png')
            heroes = QUICK_HEROES if (QUICK or w < 1000) else info['heroes']
            for hero in heroes:
                for tab in ('skills', 'review', 'build'):
                    page.evaluate('([n,t])=>openCharacterProfile(n,t)', [hero, tab])
                    if tab == 'build' and mode == 'preview' and (only is None or f'{mode}-{w}-hero-{hero}-{tab}.png' in only):
                        page.wait_for_function("()=>{const o=document.getElementById('gmOut');return !o||!/Working out|Fitting runes/.test(o.textContent)}", timeout=60000)
                    snap(f'{mode}-{w}-hero-{hero}-{tab}.png')
            ctx.close()
    return names


def main():
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print('public_diff: Playwright is not installed (pip install playwright). Nothing was compared.')
        return 2
    work = tempfile.mkdtemp(prefix='public_diff_')
    ref_dir, before, after = (os.path.join(work, d) for d in ('ref', 'before', 'after'))
    for d in (ref_dir, before, after):
        os.makedirs(d)
    # The reference commit's files, without touching the working tree.
    arch = subprocess.run(['git', '-C', ROOT, 'archive', '--format=tar', REF], capture_output=True)
    if arch.returncode:
        print(f'public_diff: git cannot read {REF!r}: {arch.stderr.decode().strip()}')
        return 2
    subprocess.run(['tar', '-x', '-C', ref_dir], input=arch.stdout, check=True)
    with sync_playwright() as p:
        try:
            browser = launch(p)
        except Exception as e:
            print('public_diff: no browser could be started (%s). Nothing was compared.' % str(e).splitlines()[0])
            return 2
        with serve(ref_dir) as base:
            names_before = shoot(browser, base, before)
        with serve(ROOT) as base:
            names_after = shoot(browser, base, after)
        diffs = []
        if names_before != names_after:
            only = sorted(set(names_before) ^ set(names_after))
            diffs.append('the two versions do not have the same pages: ' + ', '.join(only))
        same = [n for n in names_after if n in set(names_before)]

        def compare(names):
            found = {}
            with serve(work) as wbase:
                page = browser.new_page()
                page.goto(wbase)
                for n in names:
                    if open(os.path.join(before, n), 'rb').read() == open(os.path.join(after, n), 'rb').read(): continue
                    r = page.evaluate(COMPARE, [f'{wbase}before/{n}', f'{wbase}after/{n}'])
                    if 'size' in r:
                        found[n] = f'{n}: page size changed {r["size"][0]}x{r["size"][1]} -> {r["size"][2]}x{r["size"][3]}'
                    elif r['n']:
                        found[n] = f'{n}: {r["n"]} pixels differ ({100 * r["n"] / r["total"]:.3f}%), inside x {r["box"][0]}-{r["box"][2]}, y {r["box"][1]}-{r["box"][3]}'
                page.close()
            return found
        found = compare(same)
        if found:
            # Second look: now and then the browser draws a dotted underline one pixel along on a very tall page.
            # Render the views that differed once more; only a view that differs both times is a real difference.
            again = set(found)
            with serve(ref_dir) as base:
                shoot(browser, base, before, again)
            with serve(ROOT) as base:
                shoot(browser, base, after, again)
            found = compare([n for n in same if n in again])
        diffs += list(found.values())
        for n in same:
            if n not in found:
                os.remove(os.path.join(before, n)); os.remove(os.path.join(after, n))
        browser.close()
    what = 'public' + (' and preview' if PREVIEW else '')
    if diffs:
        print(f'public_diff: {len(diffs)} of {len(names_after)} {what} views differ from {REF}:')
        for d in diffs:
            print('  ' + d)
        print(f'Before/after pictures: {before} and {after}')
        return 1
    shutil.rmtree(work, ignore_errors=True)
    print(f'public_diff OK: all {len(names_after)} {what} views match {REF} pixel for pixel.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
