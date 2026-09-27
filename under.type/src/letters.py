"""Letters, counter-first.

Each glyph is its outer shape minus its counters, drawn once with Regular
measurements. The numbers here are the drawing (proportions at Regular); how
anything changes with weight or size comes only from the rules in spec.py:

    m.V, m.R, m.bar, m.round_top   stroke thickness        (rule 2)
    quad / ellipse / arch / cup    the one curve            (rule 3)
    m.ink, m.budget, m.cf          counters                 (rule 4)
    m.join                         joins                    (rule 5)
    m.aperture                     openings                 (rule 6)
"""
from spec import ZONES, EXCEPTIONS, REGULAR
from geom import Pen, rect, ring, ellipse, split, t_at, at, quad, arch, cup, hole

CAP, XH, TAIL = ZONES['cap'], ZONES['x'], ZONES['tail']


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def rounded(m, zone, reg_ink, reg_counter_h):
    """o-like: silhouette ellipse minus counter ellipse."""
    W = m.ink(reg_ink, 'RR')
    y0, y1 = m.bottom(zone), m.top(zone)
    t = m.round_top(zone)
    (tt, tb), _ = m.budget(y1 - y0, [t, t], [reg_counter_h])
    return ring((0, y0, W, y1), (m.R, y0 + tb, W - m.R, y1 - tt))


# --- Latin ---------------------------------------------------------------------

def H(m):
    W, V = m.ink(563, 'VV'), m.V
    yc = CAP / 2
    return [rect(0, 0, V, CAP), rect(W - V, 0, W, CAP),
            rect(V / 2, yc - m.bar / 2, W - V / 2, yc + m.bar / 2)], ('cap_straight', 'cap_straight')


def O(m):
    return rounded(m, 'cap', 653, 591), ('cap_round', 'cap_round')


def o(m):
    return rounded(m, 'x', 525, 429), ('round', 'round')


def n(m):
    W, V = m.ink(450, 'VV'), m.V
    top = m.top('x')
    (J,), _ = m.budget(top, [m.join], [top - REGULAR.join])
    c = W - 2 * V
    apex = V + 0.535 * c
    ry = 0.54 * c
    ink = arch(0.7 * V, W, 0, top, ry + J, apex)
    counter = hole(arch(V, W - V, 0, top - J, ry, apex))
    return [rect(0, 0, V, XH), ink, counter], ('straight', 'straight')


def e(m):
    W = m.ink(478, 'RR')
    y0, y1 = m.bottom('x'), m.top('x')
    t = m.round_top('x')
    (tt, eb, tb), (eye, low) = m.budget(y1 - y0, [t, 0.96 * m.bar, t], [175, 174])
    it = y1 - tt
    bt = it - eye
    bb = bt - eb
    cut = bb - 56 * m.aperture
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


def a(m):
    W, V = m.ink(446, 'VR'), m.V
    R0 = W - V
    y0, top = m.bottom('x'), m.top('x')
    bowl_top = 0.635 * XH
    (tb, tt), _ = m.budget(bowl_top - y0, [m.round_top('x'), m.join], [212])
    bowl = ring((0, y0, R0 + V / 2, bowl_top), (m.R, y0 + tb, R0, bowl_top - tt))
    yht = bowl_top + 46 * m.aperture
    x_to = 0.065 * W
    x_ti = x_to + V
    apex = 0.54 * W
    J = m.join
    ry_i = (top - J) - yht
    hook = arch(x_to, W, yht, top, ry_i + J, apex)
    hook_counter = hole(arch(x_ti, R0, yht, top - J, ry_i, apex))
    return [rect(R0, 0, W, yht), hook, hook_counter] + bowl, ('round', 'straight')


def s(m):
    W = m.ink(454, 'RR')
    V = m.R
    Hs = 0.97 * m.bar
    y0, y1 = m.bottom('x'), m.top('x')
    (top, sp, bot), (cu, cl) = m.budget(y1 - y0, [Hs, 1.12 * Hs, Hs], [159, 159])
    in1_top = y1 - top
    in1_bot = in1_top - cu
    ym1 = in1_bot - sp
    ym2 = ym1 + sp
    in2_top, in2_bot = ym1, ym1 - cl
    uw = 0.94 * W
    ux0 = (W - uw) / 2
    oRT, oTL, oLB, oBR = ellipse(ux0, ym1, ux0 + uw, y1)
    iRT, iTL, iLB, iBR = ellipse(ux0 + V, in1_bot, ux0 + uw - V, in1_top)
    oRT2, oTL2, oLB2, oBR2 = ellipse(0, y0, W, ym2)
    iRT2, iTL2, iLB2, iBR2 = ellipse(V, in2_bot, W - V, in2_top)
    yc1, yc2 = (ym1 + y1) / 2, (y0 + ym2) / 2
    yu = min(in1_bot + 59 * m.aperture, yc1 - 5)
    yl = max(in2_top - 56 * m.aperture, yc2 + 5)
    t = clamp(0.6 + 0.74 * (1 - m.cf), 0.5, 0.97)

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
        lam = 0.36 * ((b_[0] - a_[0]) ** 2 + (b_[1] - a_[1]) ** 2) ** 0.5
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


def b(m):
    W, V = m.ink(499, 'VR'), m.V
    y0, y1 = m.bottom('x'), m.top('x')
    t = m.round_top('x')
    (tb, tt), _ = m.budget(y1 - y0, [t, t], [415])
    return [rect(0, 0, V, CAP)] + ring((0.45 * V, y0, W, y1), (V, y0 + tb, W - m.R, y1 - tt)), ('straight', 'round')


def g(m):
    W, V = m.ink(513, 'RV'), m.V
    R0 = W - V
    y0, y1 = m.bottom('x'), m.top('x')
    t = m.round_top('x')
    (tb_, tt_), _ = m.budget(y1 - y0, [t, t], [421])
    bowl = ring((0, y0, R0 + V / 2, y1), (m.R, y0 + tb_, R0, y1 - tt_))
    (tt,), (depth,) = m.budget(-TAIL, [t], [142])
    ib, tb = -depth, TAIL
    rx_i, ry_i = 156 * m.cf, 174 * m.cf
    xb = R0 - rx_i
    yc = ib + ry_i
    term = y0 - 32 * m.aperture
    o_right = quad((W, yc), (xb, tb), True)
    i_right = quad((R0, yc), (xb, ib), True)
    o_left = quad((xb, tb), (0, tb + ry_i + tt), False)
    i_left = quad((xb, ib), (V, ib + ry_i), False)
    o_left = split(o_left, t_at(o_left, 1, term))[0]
    i_left = split(i_left, t_at(i_left, 1, term))[0]
    p = Pen((R0, XH)).line((W, XH)).line((W, yc)).curve(*o_right[1:]).curve(*o_left[1:])
    p.line(i_left[3]).curve(i_left[2], i_left[1], i_left[0]).curve(i_right[2], i_right[1], i_right[0])
    return [p.close()] + bowl, ('round', 'straight')


def v(m):
    W, Vd = m.ink(523, 'RR'), m.R
    span = Vd + max(0.0, m.V - m.join)
    b0 = W / 2 - span / 2
    left = Pen((0, XH)).line((b0, 0)).line((b0 + Vd, 0)).line((Vd, XH)).close()
    right = Pen((W - Vd, XH)).line((b0 + span - Vd, 0)).line((b0 + span, 0)).line((W, XH)).close()
    return [left, right], ('diagonal', 'diagonal')


def one(m):
    V, FL = m.V, 156
    ft, yft, k = m.bar * 0.88, 0.8 * CAP, 0.25 * V
    p = Pen((FL, 0)).line((FL + V, 0)).line((FL + V, CAP)).line((FL + k, CAP))
    p.curve((FL + k, CAP - 0.5 * (CAP - yft)), (0.75 * (FL + k), yft), (0, yft))
    p.line((0, yft - ft)).line((FL, yft - ft))
    return [p.close()], ('straight', 'straight')


def period(m):
    w, h = (f * m.V for f in EXCEPTIONS['dot'][m.weight])
    return [rect(0, 0, w, h)], ('dot', 'dot')


# --- Hebrew --------------------------------------------------------------------

def vav(m):
    return [rect(0, 0, m.V, XH)], ('straight', 'straight')


def samekh(m):
    return o(m)


def he(m):
    W, V, bar = m.ink(443, 'VV'), m.V, m.bar
    ri_h, ri_v = 114 * m.cf, 122 * m.cf
    ro_h, ro_v = ri_h + V, ri_v + bar
    yb = XH - bar
    p = Pen((W - V, yb - ri_v))
    p.curve(*quad((W - V, yb - ri_v), (W - V - ri_h, yb), True)[1:])
    p.line((0, yb)).line((0, XH)).line((W - ro_h, XH))
    p.curve(*quad((W - ro_h, XH), (W, XH - ro_v), False)[1:])
    p.line((W, 0)).line((W - V, 0))
    yu = yb - 106 * m.aperture
    yl = yu - min(0.6 * V, 0.1 * XH)
    leg = Pen((0, 0)).line((V, 0)).line((V, yu)).line((0, yl)).close()
    return [p.close(), leg], ('straight', 'straight')


def alef(m):
    W, V, Vd, J = m.ink(498, 'VR'), m.V, m.R, m.join
    c_t = 268 * m.cf
    xtl = max(0.0, W - V - Vd - c_t)
    ax = xtl + Vd + c_t
    mid = lambda y: (xtl + Vd / 2) + (W - Vd - xtl) * (1 - y / XH)
    diag = Pen((xtl, XH)).line((W - Vd, 0)).line((W, 0)).line((xtl + Vd, XH)).close()

    ry = 300 * m.cf
    arm = Pen((ax, XH))
    arm.curve(*quad((ax, XH), (mid(XH - ry), XH - ry), True)[1:])
    arm.line((mid(XH - ry - J), XH - ry - J))
    arm.curve(*quad((mid(XH - ry - J), XH - ry - J), (ax + V, XH), False)[1:])

    ryl = 330 * m.cf
    leg = Pen((0, 0)).line((V, 0))
    leg.curve(*quad((V, 0), (mid(ryl), ryl), True)[1:])
    leg.line((mid(ryl + J), ryl + J))
    leg.curve(*quad((mid(ryl + J), ryl + J), (0, 0), False)[1:])
    return [diag, arm.close(), leg.close()], ('diagonal', 'diagonal')


def shin(m):
    """The U silhouette minus two counters. The middle arm is what's left between them."""
    W, V = m.ink(601, 'VVV'), m.V
    xm = V + 182 * m.cf
    y0 = m.bottom('x')
    (t,), (inner_h,) = m.budget(XH - y0, [m.round_top('x') * 1.1], [474])
    silhouette = cup(0, W, XH, y0, 0.58 * (XH - y0))

    # right counter: bounded by the arm's edge, the bowl's inner curve and the right wall
    yb = y0 + t
    ry = min(1.18 * (W - 2 * V) / 2, 0.9 * inner_h)
    bowl_l = quad((V, yb + ry), (W / 2, yb), True)
    bowl_r = quad((W / 2, yb), (W - V, yb + ry), False)
    # The arm's lower edge is the right counter's upper-left corner. A bend is never
    # flatter than round, so its width is capped by its height. When the arm is wider
    # than the bend (heavy weights), the edge dips and turns back up into the bowl.
    ylb, ryl = XH - 289 * m.cf, 216 * m.cf
    ya = ylb + ryl
    ry_e = ryl + 0.7 * m.join
    rx_e = min(xm, ry_e)
    low = (xm + V - rx_e, ya - ry_e)
    down = quad((xm + V, ya), low, True)
    d = low[0] - V
    up = quad(low, (V, low[1] + 0.5 * d * ry_e / rx_e), False)

    def wall(y):
        return V if y >= bowl_l[0][1] else at(bowl_l, t_at(bowl_l, 1, y))[0]

    def meet(c):
        """Parameter where curve c crosses the bowl wall, or None if it stays inside."""
        if at(c, 0)[0] <= wall(at(c, 0)[1]):
            return 0.0
        if at(c, 1)[0] > wall(at(c, 1)[1]):
            return None
        lo, hi = 0.0, 1.0
        for _ in range(60):
            mid = (lo + hi) / 2
            px, py = at(c, mid)
            lo, hi = (mid, hi) if px > wall(py) else (lo, mid)
        return lo

    t_up = meet(up)
    if t_up is not None:
        down_in, up_in = down, split(up, t_up)[0]
    else:
        down_in = split(down, meet(down))[0]
        p0 = down_in[3]
        up_in = [p0, p0, p0, p0]
    crotch = up_in[3]
    bowl_in = split(bowl_l, t_at(bowl_l, 1, crotch[1]))[1] if crotch[1] < bowl_l[0][1] else bowl_l
    right = Pen((xm + V, XH)).line((xm + V, ya)).curve(*down_in[1:]).curve(*up_in[1:])
    right.line(bowl_in[0]).curve(*bowl_in[1:]).curve(*bowl_r[1:]).line((W - V, XH))

    # left counter: a notch between the left wall and the arm
    left = Pen((V, XH)).line((V, ylb))
    left.curve(*quad((V, ylb), (xm, ya), False)[1:]).line((xm, XH))
    return [silhouette, hole(right.close()), hole(left.close())], ('straight', 'straight')


GLYPHS = {
    'H': H, 'O': O, 'n': n, 'o': o, 'a': a, 'e': e, 'v': v, 's': s, 'b': b, 'g': g, '1': one, '.': period,
    'א': alef, 'ה': he, 'ו': vav, 'ס': samekh, 'ש': shin,
}
