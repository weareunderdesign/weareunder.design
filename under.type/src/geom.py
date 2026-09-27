"""Outline primitives. Every primitive returns contours with a fixed node
structure, so the same glyph built for any master is interpolation-compatible.

A contour is a list of (x, y, type) with type in 'line', 'curve', 'offcurve';
the last node is the start point (Glyphs convention).
"""
from spec import ROUND


class Hole(list):
    """A contour that cuts a counter. Everything else is ink."""


class Pen:
    def __init__(self, start):
        self.start = start
        self.nodes = []

    def line(self, p):
        self.nodes.append((*p, 'line'))
        return self

    def curve(self, h1, h2, p):
        self.nodes += [(*h1, 'offcurve'), (*h2, 'offcurve'), (*p, 'curve')]
        return self

    def close(self):
        last = self.nodes[-1] if self.nodes else None
        if not last or (last[0], last[1]) != tuple(self.start):
            self.line(self.start)
        return self.nodes


def area(contour):
    pts = [(x, y) for x, y, _ in contour]
    return sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(pts, pts[1:] + pts[:1])) / 2


def reverse(contour):
    start = contour[-1]
    segs, cur = [], []
    prev = (start[0], start[1])
    for n in contour:
        cur.append(n)
        if n[2] != 'offcurve':
            segs.append((prev, cur))
            prev, cur = (n[0], n[1]), []
    out = []
    for begin, seg in reversed(segs):
        offs = [s for s in seg if s[2] == 'offcurve']
        kind = seg[-1][2]
        out += [(o[0], o[1], 'offcurve') for o in reversed(offs)]
        out.append((begin[0], begin[1], kind))
    return out


def orient(contour, outer=True):
    a = area(contour)
    return contour if (a > 0) == outer else reverse(contour)


def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def split(c, t):
    p0, p1, p2, p3 = c
    a, b, cc = lerp(p0, p1, t), lerp(p1, p2, t), lerp(p2, p3, t)
    d, e = lerp(a, b, t), lerp(b, cc, t)
    f = lerp(d, e, t)
    return [p0, a, d, f], [f, e, cc, p3]


def at(c, t):
    mt = 1 - t
    return tuple(mt ** 3 * c[0][i] + 3 * mt * mt * t * c[1][i] + 3 * mt * t * t * c[2][i] + t ** 3 * c[3][i] for i in (0, 1))


def t_at(c, axis, value):
    lo, hi = 0.0, 1.0
    rising = at(c, 1)[axis] > at(c, 0)[axis]
    for _ in range(60):
        mid = (lo + hi) / 2
        if (at(c, mid)[axis] < value) == rising:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def quad(a, b, from_side, h=ROUND):
    """Quarter superellipse from extreme a to extreme b.
    from_side: a is a side extreme (vertical tangent)."""
    rx, ry = abs(b[0] - a[0]), abs(b[1] - a[1])
    if from_side:
        h1 = (a[0], a[1] + (1 if b[1] > a[1] else -1) * h['hy'] * ry)
        h2 = (b[0] + (1 if a[0] > b[0] else -1) * h['hx'] * rx, b[1])
    else:
        h1 = (a[0] + (1 if b[0] > a[0] else -1) * h['hx'] * rx, a[1])
        h2 = (b[0], b[1] + (1 if a[1] > b[1] else -1) * h['hy'] * ry)
    return [a, h1, h2, b]


def ellipse(x0, y0, x1, y1, h=ROUND):
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    R, T, L, B = (x1, cy), (cx, y1), (x0, cy), (cx, y0)
    return [quad(R, T, True, h), quad(T, L, False, h), quad(L, B, True, h), quad(B, R, False, h)]


def ellipse_at(x0, y0, x1, y1, top_x=None, bottom_x=None, h=ROUND):
    """Superellipse whose top and bottom extremes can sit off-centre."""
    cy = (y0 + y1) / 2
    tx = (x0 + x1) / 2 if top_x is None else top_x
    bx = (x0 + x1) / 2 if bottom_x is None else bottom_x
    R, T, L, B = (x1, cy), (tx, y1), (x0, cy), (bx, y0)
    return [quad(R, T, True, h), quad(T, L, False, h), quad(L, B, True, h), quad(B, R, False, h)]


def from_cubics(cubics):
    pen = Pen(cubics[0][0])
    for c in cubics:
        pen.curve(c[1], c[2], c[3])
    return pen.close()


def rect(x0, y0, x1, y1):
    return orient(Pen((x0, y0)).line((x1, y0)).line((x1, y1)).line((x0, y1)).close())


def ring(outer, inner, h=ROUND):
    return [orient(from_cubics(ellipse(*outer, h=h))), Hole(orient(from_cubics(ellipse(*inner, h=h)), outer=False))]


def quad_nodes(pen, c):
    pen.curve(c[1], c[2], c[3])


def arch(x0, x1, y_bottom, y_top, ry, apex=None):
    """Flat bottom, superellipse top (n counter, n silhouette, ascending shapes). Ink direction."""
    ax = (x0 + x1) / 2 if apex is None else apex
    p = Pen((x1, y_bottom)).line((x1, y_top - ry))
    p.curve(*quad((x1, y_top - ry), (ax, y_top), True)[1:])
    p.curve(*quad((ax, y_top), (x0, y_top - ry), False)[1:])
    p.line((x0, y_bottom))
    return p.close()


def cup(x0, x1, y_top, y_bottom, ry, low=None):
    """Flat top, superellipse bottom (u, U, ש). Ink direction."""
    bx = (x0 + x1) / 2 if low is None else low
    p = Pen((x0, y_top)).line((x0, y_bottom + ry))
    p.curve(*quad((x0, y_bottom + ry), (bx, y_bottom), True)[1:])
    p.curve(*quad((bx, y_bottom), (x1, y_bottom + ry), False)[1:])
    p.line((x1, y_top))
    return p.close()


def hole(contour):
    return Hole(reverse(contour))
