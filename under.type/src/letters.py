"""Glyph constructors. Each takes a Master and returns (contours, sidebearing kinds).

Proportions are measured from the current Regular text master; everything that
changes with weight or size comes from spec.py.
"""
from spec import ZONES, CORNER, APERTURE, E_BAR, SECONDARY, OPEN_COUNTER
from geom import Pen, rect, ring, ellipse, split, t_at, quad, Hole

CAP, XH = ZONES['cap'], ZONES['x']
ARCH = {'hx': 0.55, 'hy': 0.55}
SHOULDER = {'hx': 0.58, 'hy': 0.55}


def H(m):
    W = m.ink(563, 'VV')
    yc = CAP / 2
    return [rect(0, 0, m.V, CAP), rect(W - m.V, 0, W, CAP),
            rect(m.V / 2, yc - m.bar / 2, W - m.V / 2, yc + m.bar / 2)], ('cap_straight', 'cap_straight')


def O(m):
    W = m.ink(653, 'RR')
    y0, y1 = m.bottom('cap', True), m.top('cap', True)
    s, t = m.round_side, m.round_top('cap')
    return ring((0, y0, W, y1), (s, y0 + t, W - s, y1 - t)), ('cap_round', 'cap_round')


def o(m):
    W = m.ink(525, 'RR')
    y0, y1 = m.bottom('x', True), m.top('x', True)
    s, t = m.round_side, m.round_top('x')
    return ring((0, y0, W, y1), (s, y0 + t, W - s, y1 - t)), ('x_round', 'x_round')


def samekh(m):
    return o(m)


def vav(m):
    return [rect(0, 0, m.V, XH)], ('x_straight', 'x_straight')


def n(m):
    W, V = m.ink(450, 'VV'), m.V
    top = m.top('x', True)
    yit = top - m.join
    R0 = W - V
    xi = V + 0.535 * (R0 - V)
    yj, yr = yit - (xi - V), yit - (R0 - xi)
    xo = xi + 0.35 * V
    xol = 0.7 * V
    yor = top - (W - xo) * m.shoulder
    yol = top - (xo - xol) * m.shoulder
    p = Pen((xol, yol)).line((xol, 0)).line((V, 0)).line((V, yj))
    for c in (quad((V, yj), (xi, yit), True, ARCH), quad((xi, yit), (R0, yr), False, ARCH)):
        p.curve(*c[1:])
    p.line((R0, 0)).line((W, 0)).line((W, yor))
    for c in (quad((W, yor), (xo, top), True, SHOULDER), quad((xo, top), (xol, yol), False, SHOULDER)):
        p.curve(*c[1:])
    return [rect(0, 0, V, XH), p.close()], ('x_straight', 'x_straight')


def e(m):
    W = m.ink(478, 'RR')
    y0, y1 = m.bottom('x', True), m.top('x', True)
    s, t = m.round_side, m.round_top('x') * OPEN_COUNTER[m.weight]
    outer = ellipse(0, y0, W, y1)
    inner = ellipse(s, y0 + t, W - s, y1 - t)
    yc = (y0 + y1) / 2
    eb = m.bar * E_BAR[m.weight]
    bb, bt = yc - eb / 2, yc + eb / 2
    cut = XH * APERTURE['e_cut'][m.weight]
    cut = bb - (bb - cut) * m.aperture

    iRT, iTL, iLB, iBR = inner
    eye_r = split(iRT, t_at(iRT, 1, bt))[1]
    eye_l = split(iTL, t_at(iTL, 1, bt))[0]
    eye = Pen(eye_r[0]).curve(*eye_r[1:]).curve(*eye_l[1:]).close()

    oRT, oTL, oLB, oBR = outer
    o_low, o_rest = split(oBR, t_at(oBR, 1, cut))
    o_bar = split(oBR, t_at(oBR, 1, bb))[1]
    i_low = split(iBR, t_at(iBR, 1, cut))[0]
    i_lb = split(iLB, t_at(iLB, 1, bb))[1]
    p = Pen(oLB[0]).curve(*oLB[1:]).curve(*o_low[1:])
    p.line(i_low[3]).curve(i_low[2], i_low[1], i_low[0])
    p.curve(i_lb[2], i_lb[1], i_lb[0]).line(o_bar[0])
    p.curve(*o_bar[1:]).curve(*oRT[1:]).curve(*oTL[1:])
    return [p.close(), Hole(eye)], ('x_round', 'x_round')


A_TERMINAL_X = {'Thin': 0.125, 'Regular': 0.065, 'Bold': 0.058, 'Black': 0.05}
A_TERMINAL_Y = {'Thin': 0.72, 'Regular': 0.72, 'Bold': 0.69, 'Black': 0.66}


def a(m):
    W, V = m.ink(446, 'VR'), m.V
    R0, R1 = W - V, W
    top = m.top('x', True)
    ti_top = top - m.join * 0.82
    ys = top - 0.36 * XH
    ysi = 0.655 * XH
    bowl_top = 0.635 * XH
    yht = XH * A_TERMINAL_Y[m.weight]
    yht = bowl_top + (yht - bowl_top) * m.aperture
    xto = A_TERMINAL_X[m.weight] * W
    xti = xto + V
    xt = 0.54 * W
    xit = xti + 0.5 * (R0 - xti)
    p = Pen((R1, 0)).line((R1, ys))
    p.curve((R1, ys + 0.44 * (top - ys)), (R1, top), (xt, top))
    p.curve((xt - 0.705 * (xt - xto), top), (xto + 0.058 * (xt - xto), yht + 0.58 * (top - yht)), (xto, yht))
    p.line((xti, yht))
    p.curve((xti + 0.06 * (xit - xti), yht + 0.53 * (ti_top - yht)), (xit - 0.72 * (xit - xti), ti_top), (xit, ti_top))
    p.curve((xit + 0.84 * (R0 - xit), ti_top), (R0, ysi + 0.5 * (ti_top - ysi)), (R0, ysi))
    p.line((R0, 0))
    y0 = m.bottom('x', True)
    k = OPEN_COUNTER[m.weight]
    bowl = ring((0, y0, R0 + V / 2, bowl_top), (m.round_side, y0 + m.round_top('x') * k, R0, bowl_top - m.bar * 0.9 * k * k))
    return [p.close()] + bowl, ('x_round', 'x_straight')


def he(m):
    W, V = m.ink(443, 'VS'), m.V
    leg = V * SECONDARY[m.weight]
    ro = 0.37 * XH + 0.1 * (V - 92)
    ri_h, ri_v = max(ro - V, 0.075 * XH), max(ro - m.bar, 0.075 * XH)
    yb = XH - m.bar
    p = Pen((W - V, yb - ri_v))
    p.curve(*quad((W - V, yb - ri_v), (W - V - ri_h, yb), True, CORNER)[1:])
    p.line((0, yb)).line((0, XH)).line((W - ro, XH))
    p.curve(*quad((W - ro, XH), (W, XH - ro), False, CORNER)[1:])
    p.line((W, 0)).line((W - V, 0))
    gap = XH * APERTURE['he_gap'][m.weight] * m.aperture
    yu = yb - gap
    yl = yu - min(0.6 * leg, 0.09 * XH)
    legc = Pen((0, 0)).line((leg, 0)).line((leg, yu)).line((0, yl)).close()
    return [p.close(), legc], ('x_straight', 'x_straight')


ALEF = {
    'Thin':    dict(tl=0.108, arm=0.865, yai=0.52,  yao=0.50,  yli=0.635, ylo=0.657),
    'Regular': dict(tl=0.010, arm=0.762, yai=0.558, yao=0.484, yli=0.572, ylo=0.644),
    'Bold':    dict(tl=0.024, arm=0.690, yai=0.67,  yao=0.482, yli=0.44,  ylo=0.647),
    'Black':   dict(tl=0.0375, arm=0.618, yai=0.78, yao=0.48,  yli=0.31,  ylo=0.65),
}


def alef(m):
    k = ALEF[m.weight]
    W = m.ink(505, 'RS')
    Vd, aw = m.round_side, m.V * SECONDARY[m.weight]
    xtl = k['tl'] * W
    xr = lambda y: W + (xtl + Vd - W) * (y / XH)
    xl = lambda y: (W - Vd) + (xtl - (W - Vd)) * (y / XH)
    yai, yao, yli, ylo = (k[x] * XH for x in ('yai', 'yao', 'yli', 'ylo'))
    ax = k['arm'] * W
    P, Q = (xr(yai), yai), (ax, XH)
    P2, Q2 = (xr(yao), yao), (ax + aw, XH)
    P3, Q3 = (xl(yli), yli), (aw, 0)
    P4, Q4 = (xl(ylo), ylo), (0, 0)
    p = Pen((xtl + Vd, XH)).line(P)
    p.curve((P[0] + 0.78 * (Q[0] - P[0]), P[1] + 0.15 * (Q[1] - P[1])), (Q[0], Q[1] - 0.47 * (Q[1] - P[1])), Q)
    p.line(Q2)
    p.curve((Q2[0], Q2[1] - 0.58 * (Q2[1] - P2[1])), (P2[0] + 0.6 * (Q2[0] - P2[0]), P2[1] + 0.08 * (Q2[1] - P2[1])), P2)
    p.line((W, 0)).line((W - Vd, 0)).line(P3)
    p.curve((P3[0] - 0.66 * (P3[0] - Q3[0]), P3[1] * 0.86), (Q3[0], 0.46 * P3[1]), Q3)
    p.line(Q4)
    p.curve((Q4[0], 0.6 * P4[1]), (P4[0] - 0.55 * (P4[0] - Q4[0]), P4[1] * 0.9), P4)
    p.line((xtl, XH))
    return [p.close()], ('diagonal', 'diagonal')


GLYPHS = {
    'H': H, 'O': O, 'n': n, 'o': o, 'a': a, 'e': e,
    'א': alef, 'ה': he, 'ו': vav, 'ס': samekh,
}


# --- set 2 -------------------------------------------------------------------
from spec import VERTEX, DOT, S_RINGS, S_SPINE, ONE_FLAG, G_TAIL, U_ROUND
from stroke import stroke, line, curve


def v(m):
    W, Vd = m.ink(523, 'RR'), m.round_side
    span = Vd * (1 + VERTEX[m.weight])
    b0 = W / 2 - span / 2
    left = Pen((0, XH)).line((b0, 0)).line((b0 + Vd, 0)).line((Vd, XH)).close()
    right = Pen((W - Vd, XH)).line((b0 + span - Vd, 0)).line((b0 + span, 0)).line((W, XH)).close()
    return [left, right], ('diagonal', 'diagonal')


def s(m):
    W = m.ink(454, 'RR')
    V = m.round_side
    Hs = m.bar * 0.97 * OPEN_COUNTER[m.weight]
    Hsp = Hs * S_RINGS['spine']
    t = S_SPINE[m.weight]
    y0, y1 = m.bottom('x', True), m.top('x', True)
    h = ((y1 - y0) + Hsp) / 2
    ym1, ym2 = y1 - h, y0 + h
    uw = W * S_RINGS['upper_width']
    ux0 = (W - uw) / 2
    oRT, oTL, oLB, oBR = ellipse(ux0, ym1, ux0 + uw, y1)
    iRT, iTL, iLB, iBR = ellipse(ux0 + V, ym1 + Hsp, ux0 + uw - V, y1 - Hs)
    oRT2, oTL2, oLB2, oBR2 = ellipse(0, y0, W, ym2)
    iRT2, iTL2, iLB2, iBR2 = ellipse(V, y0 + Hs, W - V, ym2 - Hsp)
    yc1, yc2 = (ym1 + y1) / 2, (y0 + ym2) / 2
    close_by = (1 - m.aperture) * 40
    yu = min(XH * S_RINGS['term_upper'] - close_by, yc1 - 5)
    yl = max(XH * S_RINGS['term_lower'] + close_by, yc2 + 5)

    o_term = split(oBR, t_at(oBR, 1, yu))[1]
    i_term = split(iBR, t_at(iBR, 1, yu))[1]
    oq = split(oTL2, t_at(oTL2, 1, yl))[1]
    iq = split(iTL2, t_at(iTL2, 1, yl))[1]
    oL1, iL1 = split(oLB, t)[0], split(iLB, t)[0]
    oR2, iR2 = split(oRT2, t)[0], split(iRT2, t)[0]

    def leave(c):
        return c[3], unit(c[3][0] - c[2][0], c[3][1] - c[2][1])

    P1, d1 = leave(oL1)
    iP1, di1 = leave(iL1)
    O2, e2 = leave(oR2)
    I2, ei2 = leave(iR2)

    def bridge(pen, a, da, b, db):
        lam = 0.36 * ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2) ** 0.5
        pen.curve((a[0] + da[0] * lam, a[1] + da[1] * lam), (b[0] - db[0] * lam, b[1] - db[1] * lam), b)

    p = Pen(o_term[0]).curve(*o_term[1:]).curve(*oRT[1:]).curve(*oTL[1:]).curve(*oL1[1:])
    bridge(p, P1, d1, I2, (-ei2[0], -ei2[1]))
    p.curve(iR2[2], iR2[1], iR2[0]).curve(iBR2[2], iBR2[1], iBR2[0]).curve(iLB2[2], iLB2[1], iLB2[0])
    p.curve(iq[2], iq[1], iq[0]).line(oq[0]).curve(*oq[1:]).curve(*oLB2[1:]).curve(*oBR2[1:]).curve(*oR2[1:])
    bridge(p, O2, e2, iP1, (-di1[0], -di1[1]))
    p.curve(iL1[2], iL1[1], iL1[0]).curve(iTL[2], iTL[1], iTL[0]).curve(iRT[2], iRT[1], iRT[0])
    p.curve(i_term[2], i_term[1], i_term[0])
    return [p.close()], ('x_round', 'x_round')


def unit(dx, dy):
    n = (dx * dx + dy * dy) ** 0.5 or 1
    return dx / n, dy / n


def b(m):
    W, V = m.ink(499, 'VR'), m.V
    y0, y1 = m.bottom('x', True), m.top('x', True)
    t, side = m.round_top('x'), m.round_side
    return [rect(0, 0, V, CAP)] + ring((0.45 * V, y0, W, y1), (V, y0 + t, W - side, y1 - t)), ('x_straight', 'x_round')


def g(m):
    k = G_TAIL[m.weight]
    W, V = m.ink(513, 'RV'), m.V
    R0 = W - V
    y1 = m.top('x', True)
    t, side = m.round_top('x'), m.round_side
    bowl = ring((0, k['bowl'], R0 + V / 2, y1), (side, k['bowl'] + t, R0, y1 - t))
    tb, ib = k['bottom'], k['bottom'] + t
    xb, xto = 0.51 * W, k['term_x'] * W
    xti = xto + V
    yt = k['term_y'] + (1 - m.aperture) * 150
    yco, yci = k['outer'], k['inner']
    p = Pen((R0, XH)).line((W, XH)).line((W, yco))
    p.curve((W, yco - 0.556 * (yco - tb)), (xb + 0.75 * (W - xb), tb), (xb, tb))
    p.curve((xb - 0.53 * (xb - xto), tb), (xto + 0.12 * (xb - xto), yt - 0.67 * (yt - tb)), (xto, yt))
    p.line((xti, yt))
    p.curve((xti + 0.08 * (xb - xti), yt - 0.53 * (yt - ib)), (xb - 0.64 * (xb - xti), ib), (xb, ib))
    p.curve((xb + 0.75 * (R0 - xb), ib), (R0, yci - 0.6 * (yci - ib)), (R0, yci))
    return [p.close()] + bowl, ('x_round', 'x_straight')


def one(m):
    V, FL = m.V, ONE_FLAG['length']
    ft = m.bar * 0.88
    yft = ONE_FLAG['top'] * CAP
    k = 0.25 * V
    p = Pen((FL, 0)).line((FL + V, 0)).line((FL + V, CAP)).line((FL + k, CAP))
    p.curve((FL + k, CAP - 0.5 * (CAP - yft)), (0.75 * (FL + k), yft), (0, yft))
    p.line((0, yft - ft)).line((FL, yft - ft))
    return [p.close()], ('x_straight', 'x_straight')


def period(m):
    w, h = (f * m.V for f in DOT[m.weight])
    return [rect(0, 0, w, h)], ('dot', 'dot')


def shin(m):
    W, V = m.ink(595, 'VVV'), m.V
    yc = 0.58 * XH
    y0 = m.bottom('x', True)
    t = m.round_top('x') * 1.1
    p = Pen((0, XH)).line((0, yc))
    p.curve(*quad((0, yc), (W / 2, y0), True, U_ROUND)[1:])
    p.curve(*quad((W / 2, y0), (W, yc), False, U_ROUND)[1:])
    p.line((W, XH)).line((W - V, XH)).line((W - V, yc))
    p.curve(*quad((W - V, yc), (W / 2, y0 + t), True, U_ROUND)[1:])
    p.curve(*quad((W / 2, y0 + t), (V, yc), False, U_ROUND)[1:])
    p.line((V, XH))
    ha = m.bar * 0.66
    xm, yb = 0.53 * W, 0.8 * XH
    ye = max(0.42 * XH, y0 + t + 0.5 * ha + 20)
    arm = [line((xm, XH), (xm, yb)),
           curve((xm, yb), (xm, yb - 0.5 * (yb - ye)), (V / 2 + 0.45 * (xm - V / 2), ye), (V * 0.3, ye))]
    return [p.close(), stroke(arm, V, ha, ('h', None))], ('x_straight', 'x_straight')


GLYPHS.update({'v': v, 's': s, 'b': b, 'g': g, '1': one, '.': period, 'ש': shin})
