"""The stroke primitive: a centre-line thickened into an outline.

Contrast comes from the direction of travel: vertical travel gets the vertical
thickness V, horizontal travel the horizontal thickness H, everything between
blends (the centre-line is offset in a space squashed by V/H, then un-squashed).
Ends are cut level: 'h' cuts along the end point's y, 'v' along its x, None
leaves a square end (for ends buried inside another shape).

The node structure depends only on the centre-line's structure, so a glyph drawn
with the same centre-line in every master stays interpolation-compatible.
"""
import numpy as np


def P(x, y):
    return np.array([x, y], float)


def line(a, b):
    return ('L', P(*a), P(*b))


def curve(a, b, c, d):
    return ('C', P(*a), P(*b), P(*c), P(*d))


def _unit(v):
    n = np.linalg.norm(v)
    return v / n if n > 1e-9 else v


def _left(v):
    return np.array([-v[1], v[0]])


def _intersect(p, d, q, e):
    m = np.array([d, -e]).T
    if abs(np.linalg.det(m)) < 1e-6:
        return None
    return p + d * np.linalg.solve(m, q - p)[0]


def _half(c):
    p0, p1, p2, p3 = c
    a, b, cc = (p0 + p1) / 2, (p1 + p2) / 2, (p2 + p3) / 2
    d, e = (a + b) / 2, (b + cc) / 2
    f = (d + e) / 2
    return [p0, a, d, f], [f, e, cc, p3]


def _split(c, t):
    p0, p1, p2, p3 = c
    a, b, cc = p0 + (p1 - p0) * t, p1 + (p2 - p1) * t, p2 + (p3 - p2) * t
    d, e = a + (b - a) * t, b + (cc - b) * t
    f = d + (e - d) * t
    return [p0, a, d, f], [f, e, cc, p3]


def _at(c, t):
    mt = 1 - t
    return mt ** 3 * c[0] + 3 * mt * mt * t * c[1] + 3 * mt * t * t * c[2] + t ** 3 * c[3]


def _offset_cubic(c, dist):
    edges = [(c[0], c[1]), (c[1], c[2]), (c[2], c[3])]
    fallback = _unit(c[3] - c[0])
    dirs = [_unit(b - a) if np.linalg.norm(b - a) > 1e-6 else fallback for a, b in edges]
    q0 = c[0] + _left(dirs[0]) * dist
    q3 = c[3] + _left(dirs[2]) * dist
    o = [a + _left(d) * dist for (a, _), d in zip(edges, dirs)]
    q1 = _intersect(o[0], dirs[0], o[1], dirs[1])
    q2 = _intersect(o[1], dirs[1], o[2], dirs[2])
    if q1 is None or np.linalg.norm(q1 - c[1]) > 3 * abs(dist):
        q1 = c[1] + _left(_unit(dirs[0] + dirs[1])) * dist
    if q2 is None or np.linalg.norm(q2 - c[2]) > 3 * abs(dist):
        q2 = c[2] + _left(_unit(dirs[1] + dirs[2])) * dist
    return [q0, q1, q2, q3]


def _side(segs, dist):
    out = []
    for s in segs:
        if s[0] == 'L':
            d = _unit(s[2] - s[1])
            out.append(['L', s[1] + _left(d) * dist, s[2] + _left(d) * dist])
        else:
            for h in _half(list(s[1:])):
                out.append(['C'] + _offset_cubic(h, dist))
    for a, b in zip(out, out[1:]):
        ea, sb = a[-1], b[1]
        if np.linalg.norm(ea - sb) < 0.5:
            m = (ea + sb) / 2
        else:
            ta = _unit(a[-1] - a[-2]) if np.linalg.norm(a[-1] - a[-2]) > 1e-6 else _unit(a[-1] - a[1])
            tb = _unit(b[2] - b[1]) if np.linalg.norm(b[2] - b[1]) > 1e-6 else _unit(b[-1] - b[1])
            m = _intersect(ea, ta, sb, tb)
            if m is None or np.linalg.norm(m - (ea + sb) / 2) > 4 * abs(dist):
                m = (ea + sb) / 2
        da, db = m - a[-1], m - b[1]
        a[-1] = m
        if a[0] == 'C':
            a[-2] = a[-2] + da
        b[1] = m
        if b[0] == 'C':
            b[2] = b[2] + db
    return out


def _cut(seg, at_start, value, axis):
    idx, hidx = (1, 2) if at_start else (-1, -2)
    if seg[0] == 'C':
        c = list(seg[1:])
        ts = np.linspace(0, 1, 401)
        vals = np.array([_at(c, t)[axis] - value for t in ts])
        cross = [i for i in range(400) if (vals[i] <= 0) != (vals[i + 1] <= 0)]
        end, inner = (vals[0], vals[-1]) if at_start else (vals[-1], vals[0])
        if cross and np.sign(end) != np.sign(inner):
            i = cross[0] if at_start else cross[-1]
            t0, t1 = ts[i], ts[i + 1]
            for _ in range(40):
                tm = (t0 + t1) / 2
                if (_at(c, t0)[axis] - value <= 0) == (_at(c, tm)[axis] - value <= 0):
                    t0 = tm
                else:
                    t1 = tm
            first, second = _split(c, (t0 + t1) / 2)
            seg[1:] = second if at_start else first
            return
    p = seg[idx]
    d = seg[hidx] - seg[idx]
    t = _unit(d) if np.linalg.norm(d) > 1e-6 else _unit(seg[-1] - seg[1])
    if abs(t[axis]) < 0.1:
        return
    delta = t * (value - p[axis]) / t[axis]
    seg[idx] = p + delta
    if seg[0] == 'C':
        seg[hidx] = seg[hidx] + delta


def stroke(segs, V, H, cuts=('h', 'h')):
    """segs: list of line()/curve() along the centre-line. Returns one contour."""
    k = V / H
    sq = np.array([1.0, k])
    squashed = [(s[0],) + tuple(p * sq for p in s[1:]) for s in segs]
    right, left = _side(squashed, -V / 2), _side(squashed, V / 2)
    back = np.array([1.0, 1 / k])
    for part in (right, left):
        for s in part:
            for i in range(1, len(s)):
                s[i] = s[i] * back
    start, end = segs[0][1], segs[-1][-1]
    for part in (right, left):
        for at_start, how, pt in ((True, cuts[0], start), (False, cuts[1], end)):
            if how:
                axis = 1 if how == 'h' else 0
                _cut(part[0] if at_start else part[-1], at_start, pt[axis], axis)
    nodes = []
    for s in right:
        nodes += [(*s[2], 'line')] if s[0] == 'L' else [(*s[2], 'offcurve'), (*s[3], 'offcurve'), (*s[4], 'curve')]
    nodes.append((*left[-1][-1], 'line'))
    for s in reversed(left):
        nodes += [(*s[1], 'line')] if s[0] == 'L' else [(*s[3], 'offcurve'), (*s[2], 'offcurve'), (*s[1], 'curve')]
    nodes.append((*right[0][1], 'line'))
    return [(float(x), float(y), t) for x, y, t in nodes]
