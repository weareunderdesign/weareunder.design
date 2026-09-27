"""Letters, counter-first.

Each glyph is its outer shape minus its counters. Its proportions at Regular (the
drawing) live in drawing.json, measured from the reference font by fit.py. How
anything changes with weight or size comes only from the rules in spec.py:

    m.V, m.R, m.bar, m.round_top   stroke thickness        (rule 2)
    quad / ellipse / arch / cup    the one curve            (rule 3)
    m.ink, m.budget, m.cf          counters                 (rule 4)
    m.join                         joins                    (rule 5)
    m.aperture                     openings                 (rule 6)
"""
import json
import os
from spec import ZONES, EXCEPTIONS, REGULAR
from geom import Pen, rect, ring, ellipse, ellipse_at, split, t_at, at, quad, arch, cup, hole, Hole, orient, from_cubics

CAP, XH, TAIL = ZONES['cap'], ZONES['x'], ZONES['tail']
DRAWING_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'drawing.json')
DRAWING = json.load(open(DRAWING_PATH))


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def crossing(c, f):
    """Curve parameter where f(point) changes sign (bisection), clamped to the curve."""
    a0, a1 = f(at(c, 0)), f(at(c, 1))
    if (a0 > 0) == (a1 > 0):
        return 1.0
    lo, hi = 0.0, 1.0
    for _ in range(60):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if (f(at(c, mid)) > 0) == (a0 > 0) else (lo, mid)
    return lo


def ellipse_ring(outer, inner, top_x, bottom_x):
    """A ring whose top and bottom extremes can lean (a's bowl)."""
    o_ = from_cubics(ellipse_at(*outer, top_x=top_x, bottom_x=bottom_x))
    i_ = from_cubics(ellipse_at(*inner, top_x=top_x, bottom_x=bottom_x))
    return [orient(o_), Hole(orient(i_, outer=False))]


def rounded(m, zone, d):
    """o-like: silhouette ellipse minus counter ellipse."""
    cap = zone == 'cap'
    W = m.ink(d['ink'], 'RR', round_=True, cap=cap)
    y0, y1 = m.bottom(zone), m.top(zone)
    t = m.round_top(zone)
    (tt, tb), _ = m.budget(y1 - y0, [t, t], [d['counter_h']], round_=True, cap=cap)
    return ring((0, y0, W, y1), (m.R, y0 + tb, W - m.R, y1 - tt))


# --- Latin ---------------------------------------------------------------------

def H(m, d):
    W, V = m.ink(d['ink'], 'VV', cap=True), m.V
    yc = CAP / 2
    return [rect(0, 0, V, CAP), rect(W - V, 0, W, CAP),
            rect(V / 2, yc - m.bar / 2, W - V / 2, yc + m.bar / 2)], ('cap_straight', 'cap_straight')


def O(m, d):
    return rounded(m, 'cap', d), ('cap_round', 'cap_round')


def o(m, d):
    return rounded(m, 'x', d), ('round', 'round')


def n(m, d):
    W, V = m.ink(d['ink'], 'VV'), m.V
    top = m.top('x')
    (J,), _ = m.budget(top, [m.join], [top - REGULAR.join])
    c = W - 2 * V
    apex = V + d['apex'] * c
    ry = d['ry'] * c
    ink = arch(d['outer_x0'] * V, W, 0, top, ry + J, apex + d.get('shoulder', 0) * c)
    counter = hole(arch(V, W - V, 0, top - J, ry, apex))
    return [rect(0, 0, V, XH), ink, counter], ('straight', 'straight')


def e(m, d):
    W = m.ink(d['ink'], 'RR', round_=True)
    y0, y1 = m.bottom('x'), m.top('x')
    t = m.round_top('x')
    (tt, eb, tb), (eye, low) = m.budget(y1 - y0, [t, d['bar'] * m.bar, t], [d['eye'], d['low']], round_=True)
    it = y1 - tt
    bt = it - eye
    bb = bt - eb
    cut = bb - d['aperture'] * m.aperture
    oRT, oTL, oLB, oBR = ellipse(0, y0, W, y1)
    iRT, iTL, iLB, iBR = ellipse(m.R, y0 + tb, W - m.R, it)
    silhouette = Pen(oRT[0])
    for q in (oRT, oTL, oLB, oBR):
        silhouette.curve(*q[1:])
    eye_r = split(iRT, t_at(iRT, 1, bt))[1]
    eye_l = split(iTL, t_at(iTL, 1, bt))[0]
    eye_h = Pen(eye_r[0]).curve(*eye_r[1:]).curve(*eye_l[1:]).close()
    i_lb = split(iLB, t_at(iLB, 1, bb))[1]
    i_br = split(iBR, t_at(iBR, 1, cut))[0]
    o_ap = split(oBR, t_at(oBR, 1, cut))[1]
    o_ap = split(o_ap, t_at(o_ap, 1, bb))[0]
    low_h = Pen(i_lb[0]).curve(*i_lb[1:]).curve(*i_br[1:]).line(o_ap[0]).curve(*o_ap[1:]).close()
    return [silhouette.close(), hole(eye_h), hole(low_h)], ('round', 'round')


def a(m, d):
    W, V = m.ink(d['ink'], 'VR'), m.V
    R0 = W - V
    y0, top = m.bottom('x'), m.top('x')
    bowl_top = d['bowl_top'] * XH
    (tb, tt), _ = m.budget(bowl_top - y0, [m.round_top('x'), m.join], [d['bowl_counter']], round_=True)
    lean = d.get('lean', 0) * R0
    bx = (R0 + V / 2) / 2
    bowl = [ellipse_ring((0, y0, R0 + V / 2, bowl_top), (m.R, y0 + tb, R0, bowl_top - tt), bx + lean, bx - lean)]
    bowl = bowl[0]
    yht = bowl_top + d['aperture'] * m.aperture
    x_to = d['term_x'] * W
    x_ti = x_to + V
    apex = d['apex'] * W
    J = m.join
    ry_i = (top - J) - yht
    hook = arch(x_to, W, yht, top, ry_i + J, apex)
    hook_counter = hole(arch(x_ti, R0, yht, top - J, ry_i, apex))
    return [rect(R0, 0, W, yht), hook, hook_counter] + bowl, ('round', 'straight')


def s(m, d):
    W = m.ink(d['ink'], 'RR', round_=True)
    V = m.R
    Hs = d['stroke'] * m.bar
    y0, y1 = m.bottom('x'), m.top('x')
    (top, sp, bot), (cu, cl) = m.budget(y1 - y0, [Hs, d['spine'] * Hs, Hs], [d['counter'], d['counter']], round_=True)
    in1_top = y1 - top
    in1_bot = in1_top - cu
    ym1 = in1_bot - sp
    ym2 = ym1 + sp
    in2_top, in2_bot = ym1, ym1 - cl
    uw = d['upper'] * W
    ux0 = (W - uw) / 2
    oRT, oTL, oLB, oBR = ellipse(ux0, ym1, ux0 + uw, y1)
    iRT, iTL, iLB, iBR = ellipse(ux0 + V, in1_bot, ux0 + uw - V, in1_top)
    oRT2, oTL2, oLB2, oBR2 = ellipse(0, y0, W, ym2)
    iRT2, iTL2, iLB2, iBR2 = ellipse(V, in2_bot, W - V, in2_top)
    yc1, yc2 = (ym1 + y1) / 2, (y0 + ym2) / 2
    yu = min(in1_bot + d['ap_upper'] * m.aperture, yc1 - 5)
    yl = max(in2_top - d['ap_lower'] * m.aperture, yc2 + 5)
    t = clamp(d['leave'] + 0.74 * (1 - m.cf_round), 0.5, 0.97)

    o_term = split(oBR, t_at(oBR, 1, yu))[1]
    i_term = split(iBR, t_at(iBR, 1, yu))[1]
    oq = split(oTL2, t_at(oTL2, 1, yl))[1]
    iq = split(iTL2, t_at(iTL2, 1, yl))[1]
    oL1, iL1 = split(oLB, t)[0], split(iLB, t)[0]
    oR2, iR2 = split(oRT2, t)[0], split(iRT2, t)[0]

    def leave(c):
        dx, dy = c[3][0] - c[2][0], c[3][1] - c[2][1]
        n_ = (dx * dx + dy * dy) ** 0.5 or 1
        return c[3], (dx / n_, dy / n_)

    def bridge(pen, a_, da, b_, db):
        lam = d['pull'] * ((b_[0] - a_[0]) ** 2 + (b_[1] - a_[1]) ** 2) ** 0.5
        pen.curve((a_[0] + da[0] * lam, a_[1] + da[1] * lam), (b_[0] - db[0] * lam, b_[1] - db[1] * lam), b_)

    P1, d1 = leave(oL1)
    iP1, di1 = leave(iL1)
    O2, e2 = leave(oR2)
    I2, ei2 = leave(iR2)
    p = Pen(o_term[0]).curve(*o_term[1:]).curve(*oRT[1:]).curve(*oTL[1:]).curve(*oL1[1:])
    bridge(p, P1, d1, I2, (-ei2[0], -ei2[1]))
    p.curve(iR2[2], iR2[1], iR2[0]).curve(iBR2[2], iBR2[1], iBR2[0]).curve(iLB2[2], iLB2[1], iLB2[0])
    p.curve(iq[2], iq[1], iq[0]).line(oq[0]).curve(*oq[1:]).curve(*oLB2[1:]).curve(*oBR2[1:]).curve(*oR2[1:])
    bridge(p, O2, e2, iP1, (-di1[0], -di1[1]))
    p.curve(iL1[2], iL1[1], iL1[0]).curve(iTL[2], iTL[1], iTL[0]).curve(iRT[2], iRT[1], iRT[0])
    p.curve(i_term[2], i_term[1], i_term[0])
    return [p.close()], ('round', 'round')


def b(m, d):
    W, V = m.ink(d['ink'], 'VR', round_=True), m.V
    y0, y1 = m.bottom('x'), m.top('x')
    t = m.round_top('x')
    (tb, tt), _ = m.budget(y1 - y0, [t, t], [d['counter_h']], round_=True)
    return [rect(0, 0, V, CAP)] + ring((d['bowl_x0'] * V, y0, W, y1), (V, y0 + tb, W - m.R, y1 - tt)), ('straight', 'round')


def g(m, d):
    W, V = m.ink(d['ink'], 'RV', round_=True), m.V
    R0 = W - V
    y0, y1 = m.bottom('x'), m.top('x')
    t = m.round_top('x')
    (tb_, tt_), _ = m.budget(y1 - y0, [t, t], [d['counter_h']], round_=True)
    bowl = ring((0, y0, R0 + V / 2, y1), (m.R, y0 + tb_, R0 - d.get('inset', 0) * m.cf_round, y1 - tt_))
    (tt,), (depth,) = m.budget(-TAIL, [t], [d['tail_counter']], round_=True)
    ib, tb = -depth, TAIL
    rx_i, ry_i = d['tail_rx'] * m.cf_round, d['tail_ry'] * m.cf_round
    xb = R0 - rx_i
    yc = ib + ry_i
    term = y0 - d['aperture'] * m.aperture
    o_right = quad((W, yc), (xb, tb), True)
    i_right = quad((R0, yc), (xb, ib), True)
    o_left = quad((xb, tb), (0, tb + ry_i + tt), False)
    i_left = quad((xb, ib), (V, ib + ry_i), False)
    o_left = split(o_left, t_at(o_left, 1, term))[0]
    i_left = split(i_left, t_at(i_left, 1, term))[0]
    p = Pen((R0, XH)).line((W, XH)).line((W, yc)).curve(*o_right[1:]).curve(*o_left[1:])
    p.line(i_left[3]).curve(i_left[2], i_left[1], i_left[0]).curve(i_right[2], i_right[1], i_right[0])
    return [p.close()] + bowl, ('round', 'straight')


def v(m, d):
    W, Vd = m.ink(d['ink'], 'RR'), m.R
    span = Vd + max(0.0, m.V - m.join)
    b0 = W / 2 - span / 2
    left = Pen((0, XH)).line((b0, 0)).line((b0 + Vd, 0)).line((Vd, XH)).close()
    right = Pen((W - Vd, XH)).line((b0 + span - Vd, 0)).line((b0 + span, 0)).line((W, XH)).close()
    return [left, right], ('diagonal', 'diagonal')


def one(m, d):
    V, FL = m.V, d['flag']
    ft, yft, k = m.bar * d['flag_bar'], d['flag_top'] * CAP, d['neck'] * V
    p = Pen((FL, 0)).line((FL + V, 0)).line((FL + V, CAP)).line((FL + k, CAP))
    p.curve((FL + k, CAP - 0.5 * (CAP - yft)), (0.75 * (FL + k), yft), (0, yft))
    p.line((0, yft - ft)).line((FL, yft - ft))
    return [p.close()], ('straight', 'straight')


def period(m, d):
    w, h = (f * m.V for f in EXCEPTIONS['dot'][m.weight])
    return [rect(0, 0, w, h)], ('dot', 'dot')


# --- Hebrew --------------------------------------------------------------------

def vav(m, d):
    return [rect(0, 0, m.V, XH)], ('straight', 'straight')


def samekh(m, d):
    return o(m, DRAWING['o'])


def he(m, d):
    W, V, bar = m.ink(d['ink'], 'VV'), m.V, m.bar
    ri_h, ri_v = d['corner_h'] * m.cf, d['corner_v'] * m.cf
    ro_h, ro_v = ri_h + V, ri_v + bar
    yb = XH - bar
    p = Pen((W - V, yb - ri_v))
    p.curve(*quad((W - V, yb - ri_v), (W - V - ri_h, yb), True)[1:])
    p.line((0, yb)).line((0, XH)).line((W - ro_h, XH))
    p.curve(*quad((W - ro_h, XH), (W, XH - ro_v), False)[1:])
    p.line((W, 0)).line((W - V, 0))
    yu = yb - d['aperture'] * m.aperture
    yl = yu - min(d['cut'] * V, 0.1 * XH)
    leg = Pen((0, 0)).line((V, 0)).line((V, yu)).line((0, yl)).close()
    return [p.close(), leg], ('straight', 'straight')


def alef(m, d):
    """A diagonal, and two strokes that bend toward it and stop where they touch it."""
    W, V, Vd, J = m.ink(d['ink'], 'VR'), m.V, m.R, m.join
    c_t = d['counter_top'] * m.cf
    xtl = max(0.0, W - V - Vd - c_t)
    ax = xtl + Vd + c_t
    edge_r = lambda y: (xtl + Vd) + (W - xtl - Vd) * (1 - y / XH)
    edge_l = lambda y: xtl + (W - Vd - xtl) * (1 - y / XH)
    diag = Pen((xtl, XH)).line((W - Vd, 0)).line((W, 0)).line((xtl + Vd, XH)).close()

    def tuck(p, side):
        """Carry a cut point half-way into the diagonal so the join is hidden in ink."""
        return (p[0] + side * Vd / 2, p[1])

    rx, ry = d['arm_rx'] * m.cf, d['arm_ry'] * m.cf
    a_in = quad((ax, XH), (ax - rx, XH - ry), True)
    # a bend is never flatter than round
    ro = min(rx + V, ry + J)
    a_out = quad((ax + V, XH), (ax + V - ro, XH - ry - J), True)
    a_in = split(a_in, crossing(a_in, lambda p: p[0] - edge_r(p[1])))[0]
    a_out = split(a_out, crossing(a_out, lambda p: p[0] - edge_r(p[1])))[0]
    arm = Pen((ax, XH)).curve(*a_in[1:]).line(tuck(a_in[3], -1)).line(tuck(a_out[3], -1)).line(a_out[3])
    arm.curve(a_out[2], a_out[1], a_out[0])

    rx, ry = d['leg_rx'] * m.cf, d['leg_ry'] * m.cf
    l_in = quad((V, 0), (V + rx, ry), True)
    ro = min(V + rx, ry + J)
    l_out = quad((0, 0), (ro, ry + J), True)
    l_in = split(l_in, crossing(l_in, lambda p: edge_l(p[1]) - p[0]))[0]
    l_out = split(l_out, crossing(l_out, lambda p: edge_l(p[1]) - p[0]))[0]
    leg = Pen((0, 0)).line((V, 0)).curve(*l_in[1:]).line(tuck(l_in[3], 1)).line(tuck(l_out[3], 1)).line(l_out[3])
    leg.curve(l_out[2], l_out[1], l_out[0])
    return [diag, arm.close(), leg.close()], ('diagonal', 'diagonal')


def shin(m, d):
    """The U silhouette minus two counters. The middle arm is what's left between them."""
    W, V = m.ink(d['ink'], 'VVV'), m.V
    xm = V + d['notch_w'] * m.cf
    y0 = m.bottom('x')
    (t,), (inner_h,) = m.budget(XH - y0, [m.round_top('x') * d['bottom']], [474])
    silhouette = cup(0, W, XH, y0, d['turn'] * (XH - y0))

    # right counter: bounded by the arm's edge, the bowl's inner curve and the right wall
    yb = y0 + t
    ry = min(d['bowl_ry'] * (W - 2 * V) / 2, 0.9 * inner_h)
    bowl_l = quad((V, yb + ry), (W / 2, yb), True)
    bowl_r = quad((W / 2, yb), (W - V, yb + ry), False)
    # The arm's lower edge is the right counter's upper-left corner. A bend is never
    # flatter than round, so its width is capped by its height. When the arm is wider
    # than the bend (heavy weights), the edge dips and turns back up into the bowl.
    ylb, ryl = XH - d['notch_depth'] * m.cf, d['notch_ry'] * m.cf
    ya = ylb + ryl
    ry_e = ryl + 0.7 * m.join
    rx_e = min(xm, ry_e)
    low = (xm + V - rx_e, ya - ry_e)
    down = quad((xm + V, ya), low, True)
    reach = low[0] - V
    up = quad(low, (V, low[1] + d['return'] * reach * ry_e / rx_e), False)

    def wall(y):
        return V if y >= bowl_l[0][1] else at(bowl_l, t_at(bowl_l, 1, y))[0]

    inside = lambda p: p[0] - wall(p[1])
    if inside(at(up, 0)) > 0:
        down_in, up_in = down, split(up, crossing(up, inside))[0]
    else:
        down_in, up_in = split(split(down, crossing(down, inside))[0], 0.97)
    crotch = up_in[3]
    bowl_in = split(bowl_l, t_at(bowl_l, 1, crotch[1]))[1] if crotch[1] < bowl_l[0][1] else bowl_l
    up_in = list(up_in[:3]) + [bowl_in[0]]   # meet the bowl exactly at the crotch
    right = Pen((xm + V, XH)).line((xm + V, ya)).curve(*down_in[1:]).curve(*up_in[1:])
    right.line(bowl_in[0]).curve(*bowl_in[1:]).curve(*bowl_r[1:]).line((W - V, XH))

    # left counter: a notch between the left wall and the arm
    left = Pen((V, XH)).line((V, ylb))
    left.curve(*quad((V, ylb), (xm, ya), False)[1:]).line((xm, XH))
    return [silhouette, hole(right.close()), hole(left.close())], ('straight', 'straight')


_CONSTRUCT = {
    'H': H, 'O': O, 'n': n, 'o': o, 'a': a, 'e': e, 'v': v, 's': s, 'b': b, 'g': g, '1': one, '.': period,
    'א': alef, 'ה': he, 'ו': vav, 'ס': samekh, 'ש': shin,
}


def make(ch, m, drawing=None):
    d = (drawing or DRAWING).get(ch, {})
    return _CONSTRUCT[ch](m, d)


GLYPHS = {ch: (lambda m, ch=ch: make(ch, m)) for ch in _CONSTRUCT}
