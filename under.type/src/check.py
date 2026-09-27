"""Measure the built font and compare every rule against spec.py.

    python check.py            reads ../next/under-next.ttf
"""
import os
import sys
import numpy as np
from PIL import Image, ImageDraw
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from spec import MASTERS, ZONES, OVERSHOOT, ROUND_TOP

HERE = os.path.dirname(os.path.abspath(__file__))
TTF = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'next', 'under-next.ttf')
TOL = 1.5


class Flat(BasePen):
    def __init__(self, gs):
        super().__init__(gs)
        self.polys, self.cur = [], []

    def _moveTo(self, p): self.cur = [p]
    def _lineTo(self, p): self.cur.append(p)

    def _qCurveToOne(self, a, b):
        p0 = np.array(self.cur[-1])
        for t in np.linspace(0, 1, 24)[1:]:
            self.cur.append(tuple((1 - t) ** 2 * p0 + 2 * (1 - t) * t * np.array(a) + t * t * np.array(b)))

    def _curveToOne(self, a, b, c):
        p0 = np.array(self.cur[-1])
        for t in np.linspace(0, 1, 32)[1:]:
            mt = 1 - t
            self.cur.append(tuple(mt ** 3 * p0 + 3 * mt * mt * t * np.array(a) + 3 * mt * t * t * np.array(b) + t ** 3 * np.array(c)))

    def _closePath(self): self.polys.append(self.cur); self.cur = []
    _endPath = _closePath


def raster(gs, name):
    g = gs[name]
    pen = Flat(gs)
    g.draw(pen)
    W, H, ox, oy = int(g.width) + 400, 1400, 200, 1100
    acc = np.zeros((H, W), np.int16)
    for poly in pen.polys:
        im = Image.new('L', (W, H), 0)
        ImageDraw.Draw(im).polygon([(x + ox, oy - y) for x, y in poly], fill=1)
        a = sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(poly, poly[1:] + poly[:1]))
        acc += np.where(np.array(im) > 0, 1 if a < 0 else -1, 0).astype(np.int16)
    return acc != 0, ox, oy


def runs(a):
    a = np.concatenate([[0], a.astype(int), [0]])
    d = np.diff(a)
    return list(zip(np.nonzero(d == 1)[0], np.nonzero(d == -1)[0] - np.nonzero(d == 1)[0]))


def main():
    font = TTFont(TTF)
    cm = font.getBestCmap()
    name = lambda ch: cm[ord(ch)]
    fails = 0
    for m in MASTERS:
        gs = font.getGlyphSet(location={'wght': m.wght, 'opsz': m.opsz})
        rows = []

        def check(label, got, want):
            nonlocal fails
            ok = abs(got - want) <= TOL + 0.01 * abs(want)
            fails += not ok
            rows.append(f"{'ok  ' if ok else 'FAIL'} {label:28} {got:7.1f}  spec {want:7.1f}")

        H, ox, oy = raster(gs, name('H'))
        check('H stem', runs(H[oy - 200])[0][1], m.V)
        cols = np.nonzero(H.any(0))[0]
        check('H bar', runs(H[:, (cols[0] + cols[-1]) // 2])[0][1], m.bar)
        ys = np.nonzero(H.any(1))[0]
        check('cap height', oy - ys[0] + 1, ZONES['cap'])
        vav, ox, oy = raster(gs, name('ו'))
        check('Hebrew stem (vav)', runs(vav[oy - 200])[0][1], m.V)
        ys = np.nonzero(vav.any(1))[0]
        check('x-height (vav)', oy - ys[0] + 1, ZONES['x'])
        for ch, zone in (('O', 'cap'), ('o', 'x')):
            r, ox, oy = raster(gs, name(ch))
            ys = np.nonzero(r.any(1))[0]
            check(f'{ch} overshoot top', (oy - ys[0] + 1) - ZONES[zone], OVERSHOOT[zone])
            check(f'{ch} overshoot bottom', (ys[-1] + 1) - oy, OVERSHOOT[zone])
            cols = np.nonzero(r.any(0))[0]
            mid = (cols[0] + cols[-1]) // 2
            check(f'{ch} top thickness', runs(r[:, mid])[0][1], m.round_top(zone))
            yc = oy - (ZONES[zone] // 2)
            check(f'{ch} side thickness', runs(r[yc])[0][1], m.round_side)
        print(f'\n{m.name}')
        print('\n'.join(rows))
    print(f'\n{fails} failing checks')
    return fails


if __name__ == '__main__':
    sys.exit(1 if main() else 0)
