"""Run every check. THE command to run before every commit (Claude, 11 Nov 2026).

    python3 tools/check_all.py                 everything (about 2 minutes)
    python3 tools/check_all.py --no-browser    skip the browser checks (data-only work on a machine without Playwright)
    python3 tools/check_all.py --base REF      compare the ?v= cache numbers against REF instead of the last commit

GitHub runs this same script on every push to main (.github/workflows/deploy.yml) and only publishes the site if it
passes. So a commit that fails here does not go live: fix it, don't work around it.

What runs, in order (each is also a script you can run alone):
  1. data rules      tools/validate_data.py     names, numbers and image paths in data.json make sense
  2. data shape      tools/check_shape.py       no misspelt, misplaced or missing keys; right types
  3. stored builds   tools/hero_stats.py        HERO_BUILDS and HERO_BASE_STATS match what the optimiser gives ("No changes.")
  4. file rules      (here)                     LF line endings, data.json formatting, every script listed in index.html with ?v=
  5. JS syntax       node --check               every js/*.js file parses
  6. cache numbers   (here)                     a changed css/js file has a new ?v= in index.html
  7. browser         tools/check_site.py        no console errors or missing files on canonical and legacy URLs, Beta routes work,
                                                the JS ports give the same answers as the Python tools
  8. formatting      prettier --check           js/ and css/ are in the agreed format (a warning, not a failure)

Exit codes: 0 = all passed; 1 = something failed; 2 = everything that ran passed, but the browser checks could not run.
"""
import glob, json, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRETTIER = 'prettier@3.9.10'     # one version for everyone, so the format never flips between machines
os.chdir(ROOT)
results = []                    # (name, 'ok' | 'FAIL' | 'warn' | 'not run', detail)


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def step(name, status, detail=''):
    results.append((name, status, detail))
    print(f'[{status:^7}] {name}' + (f'\n{detail}' if detail and status != 'ok' else ''))


def script(name, args, ok_text=None):
    r = run([sys.executable] + args)
    out = (r.stdout + r.stderr).strip()
    good = r.returncode == 0 and (ok_text is None or ok_text in out)
    step(name, 'ok' if good else 'FAIL', '' if good else indent(out))


def indent(text, limit=60):
    lines = text.splitlines()
    return '\n'.join('          ' + l for l in lines[:limit]) + (f'\n          ... {len(lines) - limit} more lines' if len(lines) > limit else '')


def site_files():
    """(path, version) for every stylesheet and script index.html loads."""
    html = open('src/index.html', encoding='utf-8').read()
    return re.findall(r'(?:href|src)="((?:css|js)/[^"?]+)(?:\?v=([^"]*))?"', html)


def file_rules():
    bad = []
    for f in ['src/index.html', 'data.json'] + sorted(glob.glob('src/css/*.css')) + sorted(glob.glob('src/js/*.js')):
        if b'\r' in open(f, 'rb').read(): bad.append(f'{f}: has CRLF line endings; this file must use LF')
    raw = open('data.json', encoding='utf-8').read()
    try:
        if json.dumps(json.loads(raw), ensure_ascii=False, indent=1) != raw.rstrip('\n'):
            bad.append('data.json: not in the agreed format (UTF-8, 1-space indent, real characters instead of \\u escapes). '
                       'Rewrite it with json.dump(d, f, ensure_ascii=False, indent=1)')
        json.load(open('data/research.json', encoding='utf-8'))
    except ValueError as e:
        bad.append(f'data.json or data/research.json is not valid JSON: {e}')
    linked = site_files()
    for path, version in linked:
        if not os.path.exists('src/' + path): bad.append(f'index.html loads {path}, which does not exist')
        if not version: bad.append(f'index.html loads {path} without ?v=')
    listed = [p for p, _ in linked]
    for f in sorted(glob.glob('src/js/*.js')) + sorted(glob.glob('src/css/*.css')):
        if f.replace(os.sep, '/').removeprefix('src/') not in listed: bad.append(f'{f} exists but index.html does not load it (delete it or add it)')
    scripts = [p for p in listed if p.startswith('js/')]
    if scripts != sorted(scripts): bad.append('index.html: the js/ files are not loaded in their numbered order')
    step('file rules', 'FAIL' if bad else 'ok', indent('\n'.join(bad)))


def js_syntax():
    if not shutil.which('node'):
        return step('JS syntax', 'not run', '          node is not installed')
    bad = [r.stderr.strip() for r in (run(['node', '--check', f]) for f in sorted(glob.glob('src/js/*.js'))) if r.returncode]
    step('JS syntax', 'FAIL' if bad else 'ok', indent('\n'.join(bad)))


def cache_numbers(base):
    """A changed css/js file needs a new ?v= in index.html, or returning visitors keep the old copy for a while."""
    old_html = run(['git', 'show', f'{base}:src/index.html'])
    if old_html.returncode:
        old_html = run(['git', 'show', f'{base}:index.html'])  # before the folder reorganisation
    if old_html.returncode:
        return step('cache numbers', 'not run', f'          git cannot read {base!r} here (shallow clone?)')
    old = dict(re.findall(r'(?:href|src)="((?:css|js)/[^"?]+)\?v=([^"]*)"', old_html.stdout))
    new = dict(site_files())
    bad = []
    for path, version in new.items():
        previous = run(['git', 'show', f'{base}:src/{path}'])
        if previous.returncode:
            previous = run(['git', 'show', f'{base}:{path}'])
        if previous.returncode == 0 and previous.stdout != open('src/' + path, encoding='utf-8').read() and old.get(path) == version:
            bad.append(f'{path} content changed since {base}, but its ?v= is still {version}: give it a new value')
    step('cache numbers', 'FAIL' if bad else 'ok', indent('\n'.join(bad)))


def browser():
    if '--no-browser' in sys.argv:
        return step('browser', 'not run', '          skipped with --no-browser; GitHub will run it before the site is published')
    r = subprocess.run([sys.executable, 'tools/check_site.py'], capture_output=True, text=True)
    out = (r.stdout + r.stderr).strip()
    step('browser', {0: 'ok', 2: 'not run'}.get(r.returncode, 'FAIL'), indent(out))


def formatting():
    npx = shutil.which('npx')
    if not npx:
        return step('formatting', 'not run', '          npx is not installed')
    r = run([npx, '--yes', PRETTIER, '--check', 'src/js', 'src/css'])
    if r.returncode == 0:
        return step('formatting', 'ok')
    files = [l for l in (r.stdout + r.stderr).splitlines() if l.startswith('[warn]')]
    step('formatting', 'warn', indent('\n'.join(files) + f'\nFix: npx --yes {PRETTIER} --write src/js src/css   (then run the checks again)'))


def main():
    base = sys.argv[sys.argv.index('--base') + 1] if '--base' in sys.argv else 'HEAD'
    script('data rules', ['tools/validate_data.py'])
    script('data shape', ['tools/check_shape.py'])
    script('stored builds', ['tools/hero_stats.py'], ok_text='No changes.')
    script('clean URL entries', ['tools/build_routes.py', '--check'])
    file_rules()
    js_syntax()
    cache_numbers(base)
    browser()
    formatting()
    failed = [n for n, s, _ in results if s == 'FAIL']
    skipped = [n for n, s, _ in results if s == 'not run']
    print()
    if failed:
        print(f'CHECKS FAILED: {", ".join(failed)}. Do not commit until they pass.')
        return 1
    if skipped:
        print(f'Passed, but NOT RUN: {", ".join(skipped)}. The site only goes live after GitHub runs them all; check the result of your push.')
        return 2
    print('ALL CHECKS PASSED.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
