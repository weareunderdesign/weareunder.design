"""under: every rule as a number.

Glyph constructors read only from here. Change a value, rebuild, and every
glyph that uses the rule changes with it.
"""

UPM = 1000

ZONES = {
    'cap': 727,
    'x': 545,
    'desc': -181,
}

OVERSHOOT = {'cap': 12, 'x': 10}

# Superellipse handles, measured from O, o and the n arch in the current font:
# from a top/bottom extreme the handle runs 0.675 of the horizontal radius,
# from a side extreme 0.55 of the vertical radius.
ROUND = {'hx': 0.675, 'hy': 0.55}
CORNER = {'hx': 0.62, 'hy': 0.55}

WEIGHTS = {
    #          stem  bar/stem  round side gain  join (x bar)  shoulder (v/h)
    'Thin':    dict(wght=100, stem=24,  bar=0.85, gain=1.06, join=1.10, shoulder=0.94),
    'Regular': dict(wght=400, stem=92,  bar=0.88, gain=1.08, join=0.94, shoulder=0.94),
    'Bold':    dict(wght=700, stem=200, bar=0.80, gain=1.06, join=0.80, shoulder=0.85),
    'Black':   dict(wght=900, stem=342, bar=0.67, gain=1.02, join=0.67, shoulder=0.78),
}

# Width: one counter factor per weight. A glyph's ink width is its Regular
# counter space scaled by this factor, plus its strokes at the master's weight.
# Counters open up in Thin, stay put at Regular and close toward Black while
# the strokes push the letter wider: that is how weight becomes width.
COUNTER = {'Thin': 1.28, 'Regular': 1.0, 'Bold': 0.72, 'Black': 0.5}

# Round top/bottom thickness as a fraction of the bar.
ROUND_TOP = {'cap': 0.97, 'x': 0.84}

# Sidebearings at Regular text, scaled per weight and optical size.
SIDEBEARING = {'cap_straight': 67, 'cap_round': 53, 'x_straight': 51, 'x_round': 46, 'diagonal': 36, 'dot': 32}
SIDEBEARING_SCALE = {'Thin': 1.45, 'Regular': 1.0, 'Bold': 0.85, 'Black': 0.72}

# Optical size: text is the reference; display gets more contrast, finer joins,
# tighter apertures and tighter spacing. Stems stay the same so colour matches.
OPSZ = {
    'text':    dict(opsz=16, bar=1.00, join=1.00, aperture=1.00, spacing=1.00),
    'display': dict(opsz=48, bar=0.92, join=0.90, aperture=0.90, spacing=0.75),
}

# Apertures close as weight grows. Per-glyph fractions of the x-height.
APERTURE = {
    'e_cut':   {'Thin': 0.275, 'Regular': 0.323, 'Bold': 0.35, 'Black': 0.387},
    'he_gap':  {'Thin': 0.34,  'Regular': 0.195, 'Bold': 0.13, 'Black': 0.08},
}

E_BAR = {'Thin': 1.10, 'Regular': 0.96, 'Bold': 0.60, 'Black': 0.33}

# Small counters (e eye, a bowl) survive Black by thinning the horizontals around them.
# Factor on the normal round top/bottom thickness.
OPEN_COUNTER = {'Thin': 1.0, 'Regular': 1.0, 'Bold': 0.82, 'Black': 0.62}
# Secondary strokes (ה leg, א arms) thin out in heavy weights to keep counters open.
SECONDARY = {'Thin': 1.0, 'Regular': 1.0, 'Bold': 0.90, 'Black': 0.82}

# Word space, scaled with the spacing of the master.
SPACE = 241

# Diagonals meeting at a vertex (v w V W): the flat vertex widens with weight so the
# crotch stays open. Extra width as a fraction of the stem.
VERTEX = {'Thin': 0.6, 'Regular': 0.06, 'Bold': 0.25, 'Black': 0.42}

# Dots (. , : i j) are optically square in light weights and flatten in Black so
# they don't read as blobs. (width, height) as fractions of the stem.
DOT = {'Thin': (1.42, 1.46), 'Regular': (1.14, 1.16), 'Bold': (1.0, 0.85), 'Black': (0.85, 0.56)}

# s: terminal heights inside the stroke's inner box (0 bottom, 1 top).
# s: two stacked rings; their overlap is the spine. Terminal heights as fractions
# of the x-height; the upper ring is narrower than the lower one.
S_RINGS = {'upper_width': 0.94, 'spine': 1.12, 'term_upper': 0.69, 'term_lower': 0.315}
# The spine leaves the upper ring part-way round its lower-left curve and lands
# part-way round the lower ring's upper-right curve (curve parameter, 1 = at the
# level extreme). Light weights leave early for a diagonal; Black leaves at the
# extreme for a flat slab.
S_SPINE = {'Thin': 0.52, 'Regular': 0.6, 'Bold': 0.8, 'Black': 0.97}

# 1: flag length, and flag top as a fraction of cap height.
ONE_FLAG = {'length': 156, 'top': 0.8}

# Single-story g tail, per weight.
G_TAIL = {
    'Thin':    dict(bottom=-216, bowl=-12, outer=-1, inner=-1, term_x=0.06,  term_y=-81),
    'Regular': dict(bottom=-216, bowl=-10, outer=32, inner=32, term_x=0.053, term_y=-42),
    'Bold':    dict(bottom=-228, bowl=5,   outer=60, inner=20, term_x=0.03,  term_y=-20),
    'Black':   dict(bottom=-241, bowl=23,  outer=96, inner=9,  term_x=0.0,   term_y=1),
}

# Hebrew U-shapes (ש, and later ם ס-like bottoms): squarer bottom than o.
U_ROUND = {'hx': 0.8, 'hy': 0.45}


class Master:
    def __init__(self, weight, size):
        w, o = WEIGHTS[weight], OPSZ[size]
        self.weight, self.size = weight, size
        self.name = f'{weight} {size}'
        self.wght, self.opsz = w['wght'], o['opsz']
        self.V = w['stem']
        self.bar = w['stem'] * w['bar'] * o['bar']
        self.round_side = w['stem'] * w['gain']
        self.join = self.bar * w['join'] * o['join']
        self.shoulder = w['shoulder']
        self.aperture = o['aperture']
        self.sb_scale = SIDEBEARING_SCALE[weight] * o['spacing']

    def stroke(self, kind):
        return {'V': self.V, 'R': self.round_side, 'S': self.V * SECONDARY[self.weight]}[kind]

    def ink(self, regular_ink, strokes):
        """Ink width from the Regular ink width and the strokes crossing it, e.g. 'VV' for H, 'RR' for o."""
        counter = regular_ink - sum(REGULAR.stroke(k) for k in strokes)
        return counter * COUNTER[self.weight] + sum(self.stroke(k) for k in strokes)

    def round_top(self, zone):
        return self.bar * ROUND_TOP[zone]

    def sb(self, kind):
        return SIDEBEARING[kind] * self.sb_scale

    def top(self, zone, round_=False):
        return ZONES[zone] + (OVERSHOOT[zone] if round_ else 0)

    def bottom(self, zone, round_=False):
        return -OVERSHOOT[zone] if round_ else 0


REGULAR = Master('Regular', 'text')
MASTERS = [Master(w, s) for s in ('text', 'display') for w in ('Thin', 'Regular', 'Bold', 'Black')]
