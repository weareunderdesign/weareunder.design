"""Measure the drawing from a reference font.

Each letter's proportions at Regular (drawing.json) are fitted so its outline
matches the reference font's Regular as closely as possible. Only the drawing is
fitted; weights and sizes still come from the rules.

    python fit.py              fit every letter, report before/after, write drawing.json
    python fit.py n a          fit only these
    python fit.py --report     report only
"""
import json
import os
import sys
import numpy as np
from PIL import Image, ImageDraw
from scipy.optimize import minimize
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from spec import REGULAR, MASTERS
import letters

HERE = os.path.dirname(os.path.abspath(__file__))
REFERENCE = os.path.join(HERE, '..', 'under.ttf')
SCALE = 0.5
W, H, OX, OY = 900, 700, 20, 520


class Flat(BasePen):
    def __init__(self, gs=None):
        super().__init__(gs)
        self.polys, self.cur = [], []

    def _moveTo(self, p): self.cur = [p]
    def _lineTo(self, p): self.cur.append(p)

    def _qCurveToOne(self, a, b):
        p0 = np.array(self.cur[-1])
        for t in np.linspace(0, 1, 16)[1:]:
            self.cur.append(tuple((1 - t) ** 2 * p0 + 2 * (1 - t) * t * np.array(a) + t * t * np.array(b)))

    def _curveToOne(self, a, b, c):
        p0 = np.array(self.cur[-1])
        for t in np.linspace(0, 1, 16)[1:]:
            mt = 1 - t
            self.cur.append(tuple(mt ** 3 * p0 + 3 * mt * mt * t * np.array(a) + 3 * mt * t * t * np.array(b) + t ** 3 * np.array(c)))

    def _closePath(self): self.polys.append(self.cur); self.cur = []
    _endPath = _closePath


def flatten(contour):
    pen = Flat()
    start = contour[-1]
    pen.moveTo((start[0], start[1]))
    buf = []
    for x, y, t in contour:
        if t == 'offcurve':
            buf.append((x, y))
        elif t == 'curve':
            pen.curveTo(*buf, (x, y)); buf = []
        else:
            pen.lineTo((x, y))
    pen.closePath()
    return pen.polys[0]


def rasterize(polys):
    xs = [x for p in polys for x, _ in p]
    x0 = min(xs) if xs else 0
    acc = np.zeros((H, W), np.int16)
    for poly in polys:
        if len(poly) < 3:
            continue
        im = Image.new('L', (W, H), 0)
        ImageDraw.Draw(im).polygon([(OX + (x - x0) * SCALE, OY - y * SCALE) for x, y in poly], fill=1)
        a = sum(p[0] * q[1] - q[0] * p[1] for p, q in zip(poly, poly[1:] + poly[:1]))
        acc += np.where(np.array(im) > 0, 1 if a > 0 else -1, 0).astype(np.int16)
    return acc != 0


_ref_font = None


def reference(ch, wght=400, opsz=16):
    global _ref_font
    _ref_font = _ref_font or TTFont(REFERENCE)
    gs = _ref_font.getGlyphSet(location={'wght': wght, 'opsz': opsz})
    pen = Flat(gs)
    gs[_ref_font.getBestCmap()[ord(ch)]].draw(pen)
    polys = [[(x, y) for x, y in p] for p in pen.polys]
    # TrueType outers are clockwise; flip to match our counter-clockwise ink
    return rasterize([p[::-1] for p in polys])


def ours(ch, m, drawing):
    from build import flips
    from geom import reverse
    contours, _ = letters.make(ch, m, drawing)
    contours = [reverse(c) if fl else c for c, fl in zip(contours, flips(ch))]
    return rasterize([flatten(c) for c in contours])


def diff(ref, mine, tol=2):
    """Share of the reference's ink that differs by more than tol pixels (tol x 2 units)."""
    from scipy.ndimage import binary_dilation
    k = np.ones((2 * tol + 1, 2 * tol + 1), bool)
    miss = ref & ~binary_dilation(mine, k)
    extra = mine & ~binary_dilation(ref, k)
    return (miss.sum() + extra.sum()) / max(ref.sum(), 1)


def error(ch, drawing, m=REGULAR, ref=None):
    ref = reference(ch) if ref is None else ref
    try:
        mine = ours(ch, m, drawing)
    except Exception:
        return 10.0
    return diff(ref, mine)


def fit(ch, drawing):
    d0 = dict(drawing[ch])
    keys = [k for k, v in d0.items() if isinstance(v, (int, float))]
    if not keys:
        return d0
    ref = reference(ch)
    x0 = np.array([d0[k] for k in keys], float)

    def f(x):
        trial = dict(drawing)
        trial[ch] = {**d0, **{k: float(v) for k, v in zip(keys, x0 * x)}}
        return error(ch, trial, ref=ref)

    x = np.ones(len(keys))
    for spread in (0.25, 0.12, 0.05, 0.02):
        simplex = np.vstack([x] + [x + spread * np.eye(len(keys))[i] for i in range(len(keys))])
        best = minimize(f, x, method='Nelder-Mead',
                        options={'initial_simplex': simplex, 'xatol': 1e-4, 'fatol': 1e-5, 'maxiter': 300 * len(keys)})
        x = best.x
    fitted = {**d0, **{k: round(float(v), 4) for k, v in zip(keys, x0 * x)}}
    return fitted


def main():
    drawing = json.load(open(letters.DRAWING_PATH))
    only = [a for a in sys.argv[1:] if not a.startswith('--')]
    report_only = '--report' in sys.argv
    chars = only or [c for c in letters._CONSTRUCT if c not in ('.', 'ו', 'ס')]
    for ch in chars:
        before = error(ch, drawing)
        if report_only or ch not in drawing:
            print(f'{ch}  {before * 100:5.1f}%')
            continue
        drawing[ch] = fit(ch, drawing)
        after = error(ch, drawing)
        print(f'{ch}  {before * 100:5.1f}% -> {after * 100:5.1f}%   {drawing[ch]}')
    if not report_only:
        json.dump(drawing, open(letters.DRAWING_PATH, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()


def fit_rules():
    """Fit the counter rule (one factor per weight, and the round response) to the
    reference font's Thin and Black, across every letter at once."""
    import spec
    drawing = json.load(open(letters.DRAWING_PATH))
    chars = [c for c in letters._CONSTRUCT if c not in ('.', 'ו', 'ס')]
    refs = {(ch, w): reference(ch, w) for ch in chars for w in (100, 900)}

    def score(w, name):
        m = spec.Master(name, 'text')
        errs = []
        for ch in chars:
            try:
                errs.append(diff(refs[(ch, w)], ours(ch, m, drawing)))
            except Exception:
                errs.append(1.0)
        return float(np.mean(errs))

    def black(x):
        spec.COUNTER['Black'], spec.ROUND_RESPONSE = x
        return score(900, 'Black')

    def thin(x):
        spec.COUNTER['Thin'] = x[0]
        return score(100, 'Thin')

    b0 = [spec.COUNTER['Black'], spec.ROUND_RESPONSE]
    t0 = [spec.COUNTER['Thin']]
    print(f'Black {black(b0) * 100:.1f}%  Thin {thin(t0) * 100:.1f}%  (before)')
    rb = minimize(black, b0, method='Nelder-Mead', options={'xatol': 1e-3, 'fatol': 1e-4})
    black(rb.x)
    rt = minimize(thin, t0, method='Nelder-Mead', options={'xatol': 1e-3, 'fatol': 1e-4})
    print(f'Black {rb.fun * 100:.1f}%  Thin {rt.fun * 100:.1f}%  (after)')
    print(f"COUNTER Thin {rt.x[0]:.3f}  Black {rb.x[0]:.3f}  ROUND_RESPONSE {rb.x[1]:.3f}")
    return rt.x[0], rb.x[0], rb.x[1]
