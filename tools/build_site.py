"""Assemble the publishable site without changing public URLs.

Sources: src/ (editable website), routes/ (generated URL entry pages).
Assets, data and notes are copied unchanged. Output must be a new/empty directory.
Usage: python3 tools/build_site.py --output /tmp/dragonsword-site
"""
import argparse
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent


def build(output):
    output = Path(output).resolve()
    if output == ROOT or ROOT in output.parents:
        raise ValueError('Build outside the repository to keep generated output out of source control')
    if output.exists() and any(output.iterdir()):
        raise ValueError(f'Output must be empty: {output}')
    output.mkdir(parents=True, exist_ok=True)
    shutil.copytree(ROOT / 'routes', output, dirs_exist_ok=True)
    for name in ('js', 'css'):
        shutil.copytree(ROOT / 'src' / name, output / name)
    for name in ('assets', 'data', 'docs', 'tools'):
        shutil.copytree(ROOT / name, output / name, dirs_exist_ok=True,
                        ignore=shutil.ignore_patterns('__pycache__', '*.pyc', 'node_modules'))
    shutil.copy2(ROOT / 'data.json', output / 'data.json')
    for note in ROOT.glob('*.md'):
        shutil.copy2(note, output / note.name)
    print(f'Site assembled: {output}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True)
    build(parser.parse_args().output)
