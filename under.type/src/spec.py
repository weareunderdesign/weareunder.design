"""under: the rules.

Seven rules build every glyph. A glyph is drawn once, at Regular, as its outer
shape minus its counters; every other weight and size comes from these rules.

1  Zones           where things sit
2  Strokes         stem and bar thickness per weight
3  One curve       every round is the same superellipse
4  Counters        white space scales by one factor per weight, and wins when space runs out
5  Joins           where a curve meets a stem it thins to the join thickness
6  Apertures       openings are counters too; optical size tightens them
7  Spacing         sidebearings from the edge type, scaled per weight and size
"""

UPM = 1000

# 1 Zones
ZONES = {'cap': 727, 'x': 545, 'desc': -181, 'tail': -216}
OVERSHOOT = {'cap': 12, 'x': 10}

# 2 Strokes. stem, bar as a fraction of stem, and the extra weight rounds carry.
WEIGHTS = {
    'Thin':    dict(wght=100, stem=24,  bar=0.85, gain=1.06),
    'Regular': dict(wght=400, stem=92,  bar=0.88, gain=1.08),
    'Bold':    dict(wght=700, stem=200, bar=0.80, gain=1.06),
    'Black':   dict(wght=900, stem=342, bar=0.67, gain=1.02),
}

# Rounds carry thinner tops and bottoms than straight bars (fraction of the bar).
ROUND_TOP = {'cap': 0.97, 'x': 0.84}

# 3 One curve: from a top/bottom extreme the handle runs 0.675 of the horizontal
# radius, from a side extreme 0.55 of the vertical radius (measured from O, o, n).
ROUND = {'hx': 0.675, 'hy': 0.55}

# 4 Counters: one factor per weight. Horizontally, width = counters x factor + strokes.
# Vertically, counters never shrink below Regular x factor; strokes give way instead.
COUNTER = {'Thin': 1.28, 'Regular': 1.0, 'Bold': 0.72, 'Black': 0.5}

# 5 Joins: thickness where a curve leaves a stem, as a fraction of the bar.
JOIN = {'Thin': 1.10, 'Regular': 0.94, 'Bold': 0.80, 'Black': 0.67}

# Optical size: display gets more contrast, finer joins, tighter apertures (6) and spacing (7).
OPSZ = {
    'text':    dict(opsz=16, bar=1.00, join=1.00, aperture=1.00, spacing=1.00),
    'display': dict(opsz=48, bar=0.92, join=0.90, aperture=0.90, spacing=0.75),
}

# 7 Spacing: sidebearing by edge type at Regular text.
SIDEBEARING = {'straight': 51, 'round': 46, 'cap_straight': 67, 'cap_round': 53, 'diagonal': 36, 'dot': 32}
SPACING = {'Thin': 1.45, 'Regular': 1.0, 'Bold': 0.85, 'Black': 0.72}
SPACE = 241

# Named exceptions: optical corrections the rules don't produce. Keep this list short.
EXCEPTIONS = {
    # Dots flatten in Black so they don't read as blobs. (width, height) x stem.
    'dot': {'Thin': (1.42, 1.46), 'Regular': (1.14, 1.16), 'Bold': (1.0, 0.85), 'Black': (0.85, 0.56)},
}


class Master:
    def __init__(self, weight, size):
        w, o = WEIGHTS[weight], OPSZ[size]
        self.weight, self.size = weight, size
        self.name = f'{weight} {size}'
        self.wght, self.opsz = w['wght'], o['opsz']
        self.V = w['stem']
        self.bar = w['stem'] * w['bar'] * o['bar']
        self.R = w['stem'] * w['gain']
        self.join = self.bar * JOIN[weight] * o['join']
        self.cf = COUNTER[weight]
        self.aperture = COUNTER[weight] * o['aperture']
        self.sb_scale = SPACING[weight] * o['spacing']

    # 4 horizontally
    def stroke(self, k):
        return {'V': self.V, 'R': self.R}[k]

    def ink(self, regular_ink, strokes):
        counter = regular_ink - sum(REGULAR.stroke(k) for k in strokes)
        return counter * self.cf + sum(self.stroke(k) for k in strokes)

    # 4 vertically
    def budget(self, total, strokes, counters):
        """Split a fixed height between strokes (at this master's rule thickness)
        and counters (given at Regular). Counters never go below Regular x factor."""
        free = total - sum(strokes)
        cs = [c * free / sum(counters) for c in counters]
        if self.cf < 1 and free < sum(counters) * self.cf:
            cs = [c * self.cf for c in counters]
            room = total - sum(cs)
            strokes = [s * room / sum(strokes) for s in strokes]
        return strokes, cs

    def round_top(self, zone):
        return self.bar * ROUND_TOP[zone]

    def sb(self, kind):
        return SIDEBEARING[kind] * self.sb_scale

    def top(self, zone):
        return ZONES[zone] + OVERSHOOT[zone]

    def bottom(self, zone):
        return -OVERSHOOT[zone]


REGULAR = Master('Regular', 'text')
MASTERS = [Master(w, s) for s in ('text', 'display') for w in ('Thin', 'Regular', 'Bold', 'Black')]
