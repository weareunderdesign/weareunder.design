"""Glyph constructors. Each takes a Master and returns (contours, sidebearing kinds).

Proportions are measured from the current Regular text master; everything that
changes with weight or size comes from spec.py.
"""
from spec import ZONES, CORNER, APERTURE, E_BAR, SECONDARY, OPEN_COUNTER
from geom import Pen, rect, ring, ellipse, split, t_at, quad

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
    return [p.close(), eye], ('x_round', 'x_round')


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
