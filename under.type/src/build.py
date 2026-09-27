"""Build under-next from spec.py + letters.py.

    python build.py            writes ../next/under-next.glyphs and ../next/under-next.ttf
"""
import os
import subprocess
import sys
from glyphsLib import classes as G
from spec import MASTERS, ZONES, UPM, REGULAR, SPACE
from letters import GLYPHS
from geom import area, reverse, Hole


def flips(ch):
    """Which contours to reverse, decided once on the Regular master so every
    master keeps the same node order: ink counter-clockwise, holes clockwise."""
    if ch == ' ':
        return []
    ref, _ = GLYPHS[ch](REGULAR)
    return [(area(c) > 0) == isinstance(c, Hole) for c in ref]


HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'next')

WEIGHT_NAMES = [(100, 'Thin'), (200, 'ExtraLight'), (300, 'Light'), (400, 'Regular'), (500, 'Medium'),
                (600, 'SemiBold'), (700, 'Bold'), (800, 'ExtraBold'), (900, 'Black')]


def glyph_for(m, ch):
    if ch == ' ':
        return [], SPACE * (0.5 + 0.5 * m.sb_scale)
    contours, (left, right) = GLYPHS[ch](m)
    contours = [reverse(c) if f else c for c, f in zip(contours, flips(ch))]
    xs = [x for c in contours for x, _, t in c if t != 'offcurve']
    x0, x1 = min(xs), max(xs)
    lsb, rsb = m.sb(left), m.sb(right)
    shift = lsb - x0
    moved = [[(x + shift, y, t) for x, y, t in c] for c in contours]
    return moved, (x1 - x0) + lsb + rsb


def build():
    font = G.GSFont()
    font.format_version = 3
    font.familyName = 'under next'
    font.upm = UPM
    font.versionMajor, font.versionMinor = 0, 1
    font.axes = [G.GSAxis(), G.GSAxis()]
    font.axes[0].name, font.axes[0].axisTag = 'Weight', 'wght'
    font.axes[1].name, font.axes[1].axisTag = 'Optical size', 'opsz'
    for m in MASTERS:
        gm = G.GSFontMaster()
        gm.name = m.name
        gm.axes = [m.wght, m.opsz]
        gm.customParameters['Axis Location'] = [{'Axis': 'Weight', 'Location': m.wght}, {'Axis': 'Optical size', 'Location': m.opsz}]
        gm.ascender, gm.capHeight, gm.xHeight, gm.descender = 904, ZONES['cap'], ZONES['x'], -241
        font.masters.append(gm)
        m.id = gm.id
    for size, opsz in (('', 16), (' Display', 48)):
        for w, wn in WEIGHT_NAMES:
            inst = G.GSInstance()
            inst.name = wn + size
            inst.axes = [w, opsz]
            inst.weightClass = w
            font.instances.append(inst)
    for ch in [' '] + list(GLYPHS):
        g = G.GSGlyph(f'uni{ord(ch):04X}')
        g.unicode = f'{ord(ch):04X}'
        font.glyphs.append(g)
        for m in MASTERS:
            contours, adv = glyph_for(m, ch)
            layer = G.GSLayer()
            layer.layerId = layer.associatedMasterId = m.id
            layer.width = round(adv)
            for c in contours:
                path = G.GSPath()
                path.closed = True
                path.nodes = [G.GSNode((round(x), round(y)), t) for x, y, t in c]
                layer.paths.append(path)
            g.layers.append(layer)
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, 'under-next.glyphs')
    font.save(path)
    return path


def validate():
    """Outlines never cross themselves, and holes never touch the outline: a hole sharing an
    edge with the outside shows up as a hairline between masters."""
    from shapely.geometry import Polygon
    from shapely.ops import unary_union
    from fit import flatten
    problems = []
    for ch in GLYPHS:
        for m in MASTERS:
            contours, _ = GLYPHS[ch](m)
            polys = [(c, Polygon(flatten(c))) for c in contours]
            for i, (c, p) in enumerate(polys):
                if not p.is_valid:
                    problems.append(f'{ch} {m.name}: contour {i} crosses itself')
            ink = unary_union([p for c, p in polys if not isinstance(c, Hole)])
            for i, (c, p) in enumerate(polys):
                if isinstance(c, Hole) and not ink.buffer(-2).contains(p):
                    problems.append(f'{ch} {m.name}: hole {i} touches the outline')
    return problems


if __name__ == '__main__':
    issues = validate()
    if issues:
        print('\n'.join(sorted(set(issues))))
        sys.exit(1)
    p = build()
    print('wrote', os.path.relpath(p))
    if '--no-ttf' not in sys.argv:
        ttf = os.path.join(OUT, 'under-next.ttf')
        r = subprocess.run([os.path.join(os.path.dirname(sys.executable), 'fontmake'), '-g', p, '-o', 'variable',
                            '--output-path', ttf], capture_output=True, text=True)
        errs = [l for l in (r.stdout + r.stderr).splitlines() if 'ERROR' in l or 'rror' in l.split(':')[0]]
        print('\n'.join(errs[:10]) if r.returncode else 'wrote ' + os.path.relpath(ttf))
