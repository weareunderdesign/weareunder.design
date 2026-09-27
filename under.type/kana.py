import math
import numpy as np

MASTERS = {
    'm01': dict(name='Regular text', V=92, H=81, ink=1.0, sb=53, black=False),
    'F2C6FA2E-D08A-4B94-92D2-D7CA5820546A': dict(name='Thin text', V=23, H=20, ink=0.877, sb=76, black=False),
    'F8E60EAC-58E2-4CB8-A8B6-FD6FE89414CC': dict(name='Black text', V=342, H=228, ink=1.673, sb=39, black=True),
    'm004': dict(name='Regular display', V=92, H=81, ink=1.0, sb=40, black=False),
    'm005': dict(name='Thin display', V=24, H=20, ink=0.877, sb=57, black=False),
    'm006': dict(name='Black display', V=342, H=228, ink=1.673, sb=29, black=True),
}
BOTTOM, TOP = -30, 770
WEIGHT = {False: 0.94, True: 0.8}
SMALL_SCALE, SMALL_WEIGHT = 0.72, 0.86
UNIT = 740


def P(x, y):
    return np.array([x, y], float)


def L(*pts):
    return [('L', P(*a), P(*b)) for a, b in zip(pts, pts[1:])]


def C(a, b, c, d):
    return [('C', P(*a), P(*b), P(*c), P(*d))]


def S(*parts):
    out = []
    for p in parts:
        out += p
    return out


# Regular skeletons, unit frame (x 0..1, y 0..1 bottom to top). Each stroke is a list of segments.
R = {
    'ア': (0.90, [S(L((0.04, 0.93), (0.94, 0.93)), C((0.94, 0.93), (0.87, 0.80), (0.76, 0.70), (0.62, 0.61))),
                  C((0.46, 0.72), (0.46, 0.36), (0.36, 0.12), (0.06, 0.0))]),
    'イ': (0.84, [C((0.92, 1.0), (0.72, 0.76), (0.44, 0.56), (0.02, 0.42)),
                  L((0.58, 0.68), (0.58, 0.0))]),
    'ウ': (0.86, [L((0.50, 1.04), (0.50, 0.80)),
                  L((0.06, 0.80), (0.06, 0.52)),
                  S(L((0.06, 0.80), (0.94, 0.80)), C((0.94, 0.80), (0.92, 0.36), (0.64, 0.08), (0.18, 0.0)))]),
    'エ': (0.90, [L((0.10, 0.84), (0.90, 0.84)), L((0.50, 0.84), (0.50, 0.08)), L((0.0, 0.08), (1.0, 0.08))]),
    'オ': (0.92, [L((0.0, 0.68), (1.0, 0.68)), L((0.64, 1.0), (0.64, 0.0)),
                  C((0.56, 0.62), (0.44, 0.40), (0.26, 0.22), (0.04, 0.10))]),
    'カ': (0.88, [S(L((0.04, 0.72), (0.92, 0.72)), C((0.92, 0.72), (0.92, 0.30), (0.88, 0.10), (0.72, 0.0))),
                  C((0.44, 1.0), (0.42, 0.60), (0.30, 0.25), (0.04, 0.0))]),
    'キ': (0.90, [L((0.13, 0.76), (0.86, 0.76)), L((0.03, 0.44), (0.97, 0.44)), L((0.44, 1.0), (0.56, 0.0))]),
    'ク': (0.88, [L((0.40, 1.0), (0.04, 0.52)),
                  S(L((0.29, 0.84), (0.93, 0.84)), C((0.93, 0.84), (0.89, 0.40), (0.62, 0.12), (0.16, 0.0)))]),
    'ケ': (0.92, [L((0.36, 1.0), (0.02, 0.50)), L((0.22, 0.74), (0.98, 0.74)),
                  C((0.66, 0.74), (0.66, 0.40), (0.54, 0.14), (0.24, 0.0))]),
    'コ': (0.86, [S(L((0.06, 0.88), (0.94, 0.88)), L((0.94, 0.88), (0.94, 0.06))), L((0.06, 0.06), (0.94, 0.06))]),
    'サ': (0.94, [L((0.0, 0.70), (1.0, 0.70)), L((0.28, 1.0), (0.28, 0.34)),
                  C((0.72, 1.0), (0.72, 0.40), (0.60, 0.12), (0.26, 0.0))]),
    'シ': (0.88, [L((0.12, 0.93), (0.38, 0.84)), L((0.04, 0.64), (0.30, 0.55)),
                  C((0.08, 0.02), (0.55, 0.10), (0.83, 0.36), (0.95, 0.84))]),
    'ス': (0.90, [S(L((0.12, 0.90), (0.85, 0.90)), C((0.85, 0.90), (0.78, 0.50), (0.46, 0.14), (0.04, 0.0))),
                  L((0.50, 0.44), (0.97, 0.0))]),
    'セ': (0.94, [S(L((0.0, 0.68), (0.98, 0.68)), L((0.98, 0.68), (0.80, 0.44))),
                  S(L((0.30, 1.0), (0.30, 0.20)), C((0.30, 0.20), (0.30, 0.06), (0.38, 0.02), (0.54, 0.02)),
                    L((0.54, 0.02), (0.92, 0.02)))]),
    'ソ': (0.86, [L((0.06, 0.88), (0.20, 0.56)),
                  C((0.94, 0.92), (0.90, 0.44), (0.62, 0.10), (0.18, 0.0))]),
    'タ': (0.88, [L((0.40, 1.0), (0.05, 0.54)),
                  S(L((0.29, 0.84), (0.92, 0.84)), C((0.92, 0.84), (0.88, 0.40), (0.62, 0.12), (0.17, 0.0))),
                  L((0.28, 0.58), (0.72, 0.36))]),
    'チ': (0.92, [L((0.86, 1.02), (0.12, 0.86)), L((0.0, 0.60), (1.0, 0.60)),
                  C((0.52, 0.90), (0.52, 0.34), (0.40, 0.10), (0.10, 0.0))]),
    'ツ': (0.90, [L((0.06, 0.88), (0.17, 0.60)), L((0.38, 0.92), (0.47, 0.64)),
                  C((0.94, 0.92), (0.92, 0.44), (0.64, 0.10), (0.20, 0.0))]),
    'テ': (0.92, [L((0.14, 0.92), (0.86, 0.92)), L((0.0, 0.64), (1.0, 0.64)),
                  C((0.52, 0.64), (0.52, 0.30), (0.40, 0.10), (0.12, 0.0))]),
    'ト': (0.70, [L((0.20, 1.0), (0.20, 0.0)), L((0.22, 0.66), (0.96, 0.40))]),
    'ナ': (0.92, [L((0.0, 0.66), (1.0, 0.66)), C((0.60, 1.0), (0.60, 0.36), (0.46, 0.10), (0.10, 0.0))]),
    'ニ': (0.90, [L((0.12, 0.80), (0.88, 0.80)), L((0.0, 0.12), (1.0, 0.12))]),
    'ヌ': (0.88, [S(L((0.10, 0.90), (0.86, 0.90)), C((0.86, 0.90), (0.78, 0.50), (0.46, 0.14), (0.04, 0.0))),
                  L((0.24, 0.58), (0.92, 0.12))]),
    'ネ': (0.92, [L((0.50, 1.04), (0.50, 0.82)),
                  S(L((0.10, 0.82), (0.86, 0.82)), C((0.86, 0.82), (0.66, 0.56), (0.38, 0.38), (0.02, 0.26))),
                  L((0.50, 0.50), (0.50, 0.0)), L((0.62, 0.44), (0.98, 0.18))]),
    'ノ': (0.80, [C((0.92, 1.0), (0.86, 0.50), (0.54, 0.14), (0.06, 0.0))]),
    'ハ': (0.94, [C((0.36, 0.90), (0.30, 0.50), (0.20, 0.24), (0.02, 0.04)),
                  C((0.62, 0.90), (0.76, 0.56), (0.86, 0.30), (0.98, 0.04))]),
    'ヒ': (0.84, [S(L((0.12, 1.0), (0.12, 0.16)), C((0.12, 0.16), (0.12, 0.04), (0.20, 0.0), (0.36, 0.0)),
                    L((0.36, 0.0), (0.94, 0.0))),
                  L((0.14, 0.56), (0.88, 0.78))]),
    'フ': (0.84, [S(L((0.06, 0.88), (0.92, 0.88)), C((0.92, 0.88), (0.88, 0.40), (0.62, 0.10), (0.14, 0.0)))]),
    'ヘ': (0.96, [S(L((0.0, 0.34), (0.30, 0.72)), L((0.30, 0.72), (1.0, 0.06)))]),
    'ホ': (0.94, [L((0.04, 0.72), (0.96, 0.72)), L((0.50, 1.0), (0.50, 0.0)),
                  L((0.27, 0.52), (0.05, 0.12)), L((0.73, 0.52), (0.95, 0.12))]),
    'マ': (0.92, [S(L((0.02, 0.86), (0.96, 0.86)), C((0.96, 0.86), (0.84, 0.62), (0.66, 0.44), (0.48, 0.32))),
                  L((0.30, 0.58), (0.64, 0.06))]),
    'ミ': (0.84, [L((0.16, 0.96), (0.84, 0.84)), L((0.22, 0.62), (0.80, 0.50)), L((0.06, 0.28), (0.92, 0.06))]),
    'ム': (0.92, [S(L((0.42, 1.0), (0.10, 0.10)), L((0.10, 0.10), (0.88, 0.16))), L((0.66, 0.44), (0.96, 0.0))]),
    'メ': (0.86, [C((0.86, 1.0), (0.72, 0.56), (0.44, 0.22), (0.04, 0.0)), L((0.24, 0.66), (0.86, 0.18))]),
    'モ': (0.92, [L((0.10, 0.88), (0.90, 0.88)), L((0.0, 0.56), (1.0, 0.56)),
                  S(L((0.46, 0.88), (0.46, 0.16)), C((0.46, 0.16), (0.46, 0.04), (0.54, 0.0), (0.70, 0.0)),
                    L((0.70, 0.0), (0.96, 0.0)))]),
    'ヤ': (0.92, [S(L((0.02, 0.70), (0.96, 0.70)), C((0.96, 0.70), (0.92, 0.60), (0.86, 0.52), (0.76, 0.44))),
                  L((0.34, 1.0), (0.56, 0.0))]),
    'ユ': (0.92, [S(L((0.10, 0.78), (0.82, 0.78)), L((0.82, 0.78), (0.82, 0.08))), L((0.0, 0.08), (1.0, 0.08))]),
    'ヨ': (0.80, [S(L((0.06, 0.90), (0.94, 0.90)), L((0.94, 0.90), (0.94, 0.04))),
                  L((0.12, 0.47), (0.94, 0.47)), L((0.06, 0.04), (0.94, 0.04))]),
    'ラ': (0.84, [L((0.14, 0.94), (0.86, 0.94)),
                  S(L((0.06, 0.66), (0.92, 0.66)), C((0.92, 0.66), (0.88, 0.30), (0.62, 0.08), (0.18, 0.0)))]),
    'リ': (0.70, [L((0.14, 0.96), (0.14, 0.34)), C((0.86, 1.0), (0.86, 0.40), (0.72, 0.12), (0.30, 0.0))]),
    'ル': (0.94, [C((0.32, 0.96), (0.32, 0.50), (0.24, 0.20), (0.0, 0.02)),
                  S(L((0.58, 1.0), (0.58, 0.06)), L((0.58, 0.06), (0.98, 0.36)))]),
    'レ': (0.80, [S(L((0.12, 1.0), (0.12, 0.06)), L((0.12, 0.06), (0.96, 0.50)))]),
    'ロ': (0.84, [L((0.06, 0.90), (0.06, 0.0)), S(L((0.06, 0.90), (0.94, 0.90)), L((0.94, 0.90), (0.94, 0.0))),
                  L((0.06, 0.06), (0.94, 0.06))]),
    'ワ': (0.86, [L((0.06, 0.90), (0.06, 0.54)),
                  S(L((0.06, 0.90), (0.94, 0.90)), C((0.94, 0.90), (0.92, 0.40), (0.64, 0.10), (0.20, 0.0)))]),
    'ヲ': (0.86, [S(L((0.06, 0.90), (0.92, 0.90)), C((0.92, 0.90), (0.90, 0.40), (0.62, 0.10), (0.20, 0.0))),
                  L((0.06, 0.54), (0.84, 0.54))]),
    'ン': (0.86, [L((0.06, 0.80), (0.36, 0.69)),
                  C((0.10, 0.02), (0.55, 0.10), (0.83, 0.38), (0.95, 0.86))]),
    'ー': (0.94, [L((0.02, 0.48), (0.98, 0.48))]),
}

# Black: same structure, points moved so strokes that are close in Regular stay apart at Black weight.
B = {
    'ア': (0.90, [S(L((0.0, 1.0), (1.0, 1.0)), C((1.0, 1.0), (0.97, 0.85), (0.93, 0.70), (0.86, 0.52))),
                  C((0.44, 0.70), (0.44, 0.30), (0.30, 0.08), (0.0, 0.0))]),
    'イ': (0.86, [C((1.0, 1.0), (0.78, 0.76), (0.46, 0.60), (0.0, 0.48)),
                  L((0.64, 0.66), (0.64, 0.0))]),
    'ウ': (0.88, [L((0.50, 1.08), (0.50, 0.86)),
                  L((0.0, 0.76), (0.0, 0.46)),
                  S(L((0.0, 0.76), (1.0, 0.76)), C((1.0, 0.76), (0.98, 0.34), (0.66, 0.08), (0.10, 0.0)))]),
    'エ': (0.90, [L((0.08, 0.94), (0.92, 0.94)), L((0.50, 0.94), (0.50, 0.04)), L((0.0, 0.04), (1.0, 0.04))]),
    'オ': (0.94, [L((0.0, 0.72), (1.0, 0.72)), L((0.68, 1.04), (0.68, 0.0)),
                  C((0.48, 0.54), (0.40, 0.36), (0.24, 0.18), (0.0, 0.06))]),
    'カ': (0.90, [S(L((0.0, 0.76), (1.0, 0.76)), C((1.0, 0.76), (1.0, 0.30), (0.96, 0.10), (0.80, 0.0))),
                  C((0.40, 1.04), (0.38, 0.60), (0.26, 0.24), (0.0, 0.0))]),
    'キ': (0.90, [L((0.10, 0.84), (0.90, 0.84)), L((0.0, 0.34), (1.0, 0.34)), L((0.46, 1.06), (0.54, 0.0))]),
    'ク': (0.90, [L((0.32, 1.04), (0.0, 0.52)),
                  S(L((0.22, 0.90), (1.0, 0.90)), C((1.0, 0.90), (0.96, 0.40), (0.66, 0.10), (0.08, 0.0)))]),
    'ケ': (0.94, [L((0.28, 1.04), (0.0, 0.50)), L((0.16, 0.80), (1.0, 0.80)),
                  C((0.68, 0.80), (0.68, 0.40), (0.56, 0.12), (0.18, 0.0))]),
    'コ': (0.86, [S(L((0.0, 0.96), (1.0, 0.96)), L((1.0, 0.96), (1.0, 0.02))), L((0.0, 0.02), (1.0, 0.02))]),
    'サ': (0.96, [L((0.0, 0.72), (1.0, 0.72)), L((0.22, 1.04), (0.22, 0.30)),
                  C((0.76, 1.04), (0.76, 0.40), (0.62, 0.10), (0.20, 0.0))]),
    'シ': (0.88, [L((0.02, 1.02), (0.28, 0.90)), L((0.0, 0.52), (0.26, 0.40)),
                  C((0.0, 0.0), (0.50, 0.05), (0.86, 0.36), (1.0, 1.0))]),
    'ス': (0.90, [S(L((0.04, 1.0), (0.94, 1.0)), C((0.94, 1.0), (0.86, 0.52), (0.52, 0.12), (0.0, 0.0))),
                  L((0.50, 0.47), (1.0, 0.0))]),
    'セ': (0.96, [S(L((0.0, 0.74), (1.0, 0.74)), L((1.0, 0.74), (0.86, 0.42))),
                  S(L((0.24, 1.04), (0.24, 0.22)), C((0.24, 0.22), (0.24, 0.06), (0.32, 0.0), (0.50, 0.0)),
                    L((0.50, 0.0), (0.98, 0.0)))]),
    'ソ': (0.88, [L((0.0, 1.0), (0.10, 0.66)),
                  C((1.0, 1.0), (0.97, 0.42), (0.66, 0.08), (0.10, 0.0))]),
    'タ': (0.90, [L((0.30, 1.04), (0.0, 0.52)),
                  S(L((0.22, 0.90), (1.0, 0.90)), C((1.0, 0.90), (0.97, 0.40), (0.66, 0.10), (0.10, 0.0))),
                  L((0.30, 0.46), (0.62, 0.38))]),
    'チ': (0.94, [L((0.90, 1.08), (0.10, 0.94)), L((0.0, 0.58), (1.0, 0.58)),
                  C((0.52, 0.94), (0.52, 0.30), (0.38, 0.08), (0.04, 0.0))]),
    'ツ': (0.96, [L((0.0, 1.0), (0.06, 0.70)), L((0.42, 1.0), (0.48, 0.70)),
                  C((1.0, 1.0), (0.98, 0.40), (0.66, 0.08), (0.10, 0.0))]),
    'テ': (0.94, [L((0.10, 1.0), (0.90, 1.0)), L((0.0, 0.62), (1.0, 0.62)),
                  C((0.52, 0.62), (0.52, 0.28), (0.38, 0.08), (0.04, 0.0))]),
    'ト': (0.76, [L((0.10, 1.0), (0.10, 0.0)), L((0.22, 0.60), (1.0, 0.36))]),
    'ナ': (0.94, [L((0.0, 0.70), (1.0, 0.70)), C((0.62, 1.04), (0.62, 0.36), (0.46, 0.08), (0.04, 0.0))]),
    'ニ': (0.90, [L((0.10, 0.90), (0.90, 0.90)), L((0.0, 0.04), (1.0, 0.04))]),
    'ヌ': (0.90, [S(L((0.04, 1.0), (0.94, 1.0)), C((0.94, 1.0), (0.86, 0.52), (0.52, 0.12), (0.0, 0.0))),
                  L((0.16, 0.62), (1.0, 0.10))]),
    'ネ': (0.96, [L((0.50, 1.10), (0.50, 0.90)),
                  S(L((0.04, 0.86), (0.92, 0.86)), C((0.92, 0.86), (0.72, 0.58), (0.40, 0.40), (0.0, 0.30))),
                  L((0.50, 0.44), (0.50, 0.0)), L((0.70, 0.40), (1.0, 0.14))]),
    'ノ': (0.84, [C((1.0, 1.0), (0.94, 0.48), (0.58, 0.12), (0.0, 0.0))]),
    'ハ': (0.96, [C((0.30, 0.94), (0.24, 0.50), (0.16, 0.22), (0.0, 0.02)),
                  C((0.70, 0.94), (0.82, 0.56), (0.90, 0.28), (1.0, 0.02))]),
    'ヒ': (0.86, [S(L((0.08, 1.04), (0.08, 0.18)), C((0.08, 0.18), (0.08, 0.04), (0.16, 0.0), (0.34, 0.0)),
                    L((0.34, 0.0), (1.0, 0.0))),
                  L((0.20, 0.52), (0.94, 0.80))]),
    'フ': (0.86, [S(L((0.0, 1.0), (1.0, 1.0)), C((1.0, 1.0), (0.97, 0.45), (0.66, 0.10), (0.06, 0.0)))]),
    'ヘ': (0.98, [S(L((0.0, 0.30), (0.30, 0.76)), L((0.30, 0.76), (1.0, 0.02)))]),
    'ホ': (0.98, [L((0.0, 0.80), (1.0, 0.80)), L((0.50, 1.04), (0.50, 0.0)),
                  L((0.12, 0.40), (0.0, 0.04)), L((0.88, 0.40), (1.0, 0.04))]),
    'マ': (0.94, [S(L((0.0, 0.96), (1.0, 0.96)), C((1.0, 0.96), (0.90, 0.66), (0.72, 0.46), (0.54, 0.34))),
                  L((0.26, 0.52), (0.60, 0.0))]),
    'ミ': (0.86, [L((0.12, 1.06), (0.88, 0.94)), L((0.16, 0.60), (0.84, 0.48)), L((0.0, 0.16), (1.0, -0.04))]),
    'ム': (0.94, [S(L((0.36, 1.04), (0.02, 0.06)), L((0.02, 0.06), (0.80, 0.12))), L((0.70, 0.52), (1.0, 0.0))]),
    'メ': (0.88, [C((0.94, 1.04), (0.78, 0.56), (0.46, 0.20), (0.0, 0.0)), L((0.14, 0.72), (0.92, 0.14))]),
    'モ': (0.94, [L((0.06, 0.96), (0.94, 0.96)), L((0.0, 0.54), (1.0, 0.54)),
                  S(L((0.40, 0.96), (0.40, 0.18)), C((0.40, 0.18), (0.40, 0.04), (0.48, 0.0), (0.66, 0.0)),
                    L((0.66, 0.0), (1.0, 0.0)))]),
    'ヤ': (0.94, [S(L((0.0, 0.62), (1.0, 0.62)), C((1.0, 0.62), (0.97, 0.52), (0.93, 0.42), (0.86, 0.30))),
                  L((0.28, 1.04), (0.46, 0.0))]),
    'ユ': (0.94, [S(L((0.06, 0.86), (0.84, 0.86)), L((0.84, 0.86), (0.84, 0.04))), L((0.0, 0.04), (1.0, 0.04))]),
    'ヨ': (0.84, [S(L((0.0, 0.98), (1.0, 0.98)), L((1.0, 0.98), (1.0, 0.0))),
                  L((0.06, 0.49), (1.0, 0.49)), L((0.0, 0.0), (1.0, 0.0))]),
    'ラ': (0.86, [L((0.08, 1.04), (0.92, 1.04)),
                  S(L((0.0, 0.64), (1.0, 0.64)), C((1.0, 0.64), (0.96, 0.28), (0.66, 0.06), (0.10, 0.0)))]),
    'リ': (0.76, [L((0.04, 1.0), (0.04, 0.34)), C((0.96, 1.04), (0.96, 0.40), (0.80, 0.10), (0.28, 0.0))]),
    'ル': (0.98, [C((0.24, 1.0), (0.24, 0.50), (0.16, 0.18), (0.0, 0.0)),
                  S(L((0.60, 1.04), (0.60, 0.04)), L((0.60, 0.04), (1.0, 0.40)))]),
    'レ': (0.82, [S(L((0.04, 1.04), (0.04, 0.02)), L((0.04, 0.02), (1.0, 0.54)))]),
    'ロ': (0.86, [L((0.0, 0.98), (0.0, 0.0)), S(L((0.0, 0.98), (1.0, 0.98)), L((1.0, 0.98), (1.0, 0.0))),
                  L((0.0, 0.02), (1.0, 0.02))]),
    'ワ': (0.88, [L((0.0, 0.96), (0.0, 0.50)),
                  S(L((0.0, 0.96), (1.0, 0.96)), C((1.0, 0.96), (0.98, 0.40), (0.66, 0.08), (0.10, 0.0)))]),
    'ヲ': (0.88, [S(L((0.0, 0.98), (1.0, 0.98)), C((1.0, 0.98), (0.98, 0.40), (0.66, 0.08), (0.10, 0.0))),
                  L((0.0, 0.54), (0.90, 0.54))]),
    'ン': (0.86, [L((0.0, 1.0), (0.26, 0.84)),
                  C((0.0, 0.0), (0.50, 0.05), (0.86, 0.36), (1.0, 1.0))]),
    'ー': (0.94, [L((0.0, 0.48), (1.0, 0.48))]),
}

DAKU = {'ガ': 'カ', 'ギ': 'キ', 'グ': 'ク', 'ゲ': 'ケ', 'ゴ': 'コ', 'ザ': 'サ', 'ジ': 'シ', 'ズ': 'ス', 'ゼ': 'セ', 'ゾ': 'ソ',
        'ダ': 'タ', 'ヂ': 'チ', 'ヅ': 'ツ', 'デ': 'テ', 'ド': 'ト', 'バ': 'ハ', 'ビ': 'ヒ', 'ブ': 'フ', 'ベ': 'ヘ', 'ボ': 'ホ',
        'ヴ': 'ウ'}
HANDAKU = {'パ': 'ハ', 'ピ': 'ヒ', 'プ': 'フ', 'ペ': 'ヘ', 'ポ': 'ホ'}
SMALL = {'ァ': 'ア', 'ィ': 'イ', 'ゥ': 'ウ', 'ェ': 'エ', 'ォ': 'オ', 'ッ': 'ツ', 'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ',
         'ヮ': 'ワ', 'ヵ': 'カ', 'ヶ': 'ケ'}


def structure(strokes):
    return [[s[0] for s in st] for st in strokes]


for k in R:
    assert structure(R[k][1]) == structure(B[k][1]), k


def ln_int(p, d, q, e):
    m = np.array([d, -e]).T
    if abs(np.linalg.det(m)) < 1e-6:
        return None
    t = np.linalg.solve(m, q - p)
    return p + d * t[0]


def unit(v):
    n = np.linalg.norm(v)
    return v / n if n > 1e-9 else v


def left(v):
    return np.array([-v[1], v[0]])


def split(c):
    p0, p1, p2, p3 = c
    a, b, cc = (p0 + p1) / 2, (p1 + p2) / 2, (p2 + p3) / 2
    d, e = (a + b) / 2, (b + cc) / 2
    f = (d + e) / 2
    return [p0, a, d, f], [f, e, cc, p3]


def offset_cubic(c, dist):
    p = c
    edges = [(p[0], p[1]), (p[1], p[2]), (p[2], p[3])]
    dirs = []
    for a, b in edges:
        dirs.append(unit(b - a) if np.linalg.norm(b - a) > 1e-6 else None)
    fallback = unit(p[3] - p[0])
    dirs = [d if d is not None else fallback for d in dirs]
    q0 = p[0] + left(dirs[0]) * dist
    q3 = p[3] + left(dirs[2]) * dist
    o = [(a + left(d) * dist, d) for (a, _), d in zip(edges, dirs)]
    q1 = ln_int(o[0][0], o[0][1], o[1][0], o[1][1])
    q2 = ln_int(o[1][0], o[1][1], o[2][0], o[2][1])
    if q1 is None or np.linalg.norm(q1 - p[1]) > 3 * abs(dist):
        q1 = p[1] + left(unit(dirs[0] + dirs[1])) * dist
    if q2 is None or np.linalg.norm(q2 - p[2]) > 3 * abs(dist):
        q2 = p[2] + left(unit(dirs[1] + dirs[2])) * dist
    return [q0, q1, q2, q3]


def side(segs, dist):
    out = []
    for s in segs:
        if s[0] == 'L':
            d = unit(s[2] - s[1])
            out.append(['L', s[1] + left(d) * dist, s[2] + left(d) * dist])
        else:
            for h in split(list(s[1:])):
                out.append(['C'] + offset_cubic(h, dist))
    for a, b in zip(out, out[1:]):
        ea, sb = a[-1], b[1]
        if np.linalg.norm(ea - sb) < 0.5:
            m = (ea + sb) / 2
        else:
            ta = unit(a[-1] - a[-2]) if np.linalg.norm(a[-1] - a[-2]) > 1e-6 else unit(a[-1] - a[1])
            tb = unit(b[2] - b[1]) if np.linalg.norm(b[2] - b[1]) > 1e-6 else unit(b[-1] - b[1])
            m = ln_int(ea, ta, sb, tb)
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


def split_at(c, t):
    p0, p1, p2, p3 = c
    a, b, cc = p0 + (p1 - p0) * t, p1 + (p2 - p1) * t, p2 + (p3 - p2) * t
    d, e = a + (b - a) * t, b + (cc - b) * t
    f = d + (e - d) * t
    return [p0, a, d, f], [f, e, cc, p3]


def bez_at(c, t):
    p0, p1, p2, p3 = c
    mt = 1 - t
    return mt ** 3 * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t ** 3 * p3


def cut_axis(d):
    return 1 if abs(d[1]) >= 0.55 * abs(d[0]) else 0


def cut(seg, at_start, skel_pt, skel_dir, line_offset=0.0):
    axis = cut_axis(skel_dir)
    line = skel_pt[axis] + line_offset
    idx, hidx = (1, 2) if at_start else (-1, -2)
    if seg[0] == 'C':
        c = list(seg[1:])
        ts = np.linspace(0, 1, 401)
        vals = np.array([bez_at(c, t)[axis] - line for t in ts])
        side_end = vals[0] if at_start else vals[-1]
        inner = vals[-1] if at_start else vals[0]
        cross = [i for i in range(400) if (vals[i] <= 0) != (vals[i + 1] <= 0)]
        if cross and np.sign(side_end) != np.sign(inner):
            i = cross[0] if at_start else cross[-1]
            t0, t1 = ts[i], ts[i + 1]
            for _ in range(30):
                tm = (t0 + t1) / 2
                if (bez_at(c, t0)[axis] - line <= 0) == (bez_at(c, tm)[axis] - line <= 0):
                    t0 = tm
                else:
                    t1 = tm
            t = (t0 + t1) / 2
            first, second = split_at(c, t)
            seg[1:] = second if at_start else first
            return
    p = seg[idx]
    t = unit(seg[hidx] - seg[idx]) if np.linalg.norm(seg[hidx] - seg[idx]) > 1e-6 else unit(seg[-1] - seg[1])
    if abs(t[axis]) < 0.15:
        return
    s = (line - p[axis]) / t[axis]
    delta = t * s
    seg[idx] = p + delta
    if seg[0] == 'C':
        seg[hidx] = seg[hidx] + delta


def stroke_nodes(segs, V, H, edges=(None, None)):
    k = V / H
    sc = np.array([1.0, k])
    ss = [(s[0],) + tuple(p * sc for p in s[1:]) for s in segs]
    right = side(ss, -V / 2)
    leftside = side(ss, V / 2)
    back = np.array([1.0, 1 / k])
    for part in (right, leftside):
        for s in part:
            for i in range(1, len(s)):
                s[i] = s[i] * back
    first, last = segs[0], segs[-1]
    d0 = unit(first[2] - first[1]) if first[0] == 'L' else unit(first[2] - first[1] if np.linalg.norm(first[2] - first[1]) > 1e-6 else first[4] - first[1])
    d1 = unit(last[-1] - last[-2]) if np.linalg.norm(last[-1] - last[-2]) > 1e-6 else unit(last[-1] - last[1])
    offs = []
    for d, e, outward in ((d0, edges[0], -d0), (d1, edges[1], d1)):
        ax = cut_axis(d)
        o = 0.0
        if e is not None and (e[ax] <= 0.03 or e[ax] >= 0.97):
            o = (V if ax == 0 else H) / 2 * np.sign(outward[ax])
        offs.append(o)
    for part in (right, leftside):
        cut(part[0], True, first[1], d0, offs[0])
        cut(part[-1], False, last[-1], d1, offs[1])
    nodes = []
    for s in right:
        if s[0] == 'L':
            nodes.append((s[2], 'l'))
        else:
            nodes += [(s[2], 'o'), (s[3], 'o'), (s[4], 'c')]
    nodes.append((leftside[-1][-1], 'l'))
    for s in reversed(leftside):
        if s[0] == 'L':
            nodes.append((s[1], 'l'))
        else:
            nodes += [(s[3], 'o'), (s[2], 'o'), (s[1], 'c')]
    nodes[-1] = (nodes[-1][0], nodes[-1][1])
    start = right[0][1]
    nodes.append((start, 'l'))
    if nodes[-2][1] == 'c' or nodes[-2][1] == 'l':
        pass
    return nodes if signed_area(nodes) > 0 else reverse_nodes(nodes)


def fix_start(nodes):
    # the left side ends at its start point (on-curve), then the start cap closes to the right side start
    return nodes


def reverse_nodes(nodes):
    ons = [i for i, (_, t) in enumerate(nodes) if t != 'o']
    segs = []
    for j, i in enumerate(ons):
        prev = ons[j - 1]
        offs = [nodes[x] for x in range(prev + 1, i)] if prev < i else [nodes[x] for x in list(range(prev + 1, len(nodes))) + list(range(0, i))]
        segs.append((nodes[prev][0], offs, nodes[i]))
    out = []
    for start, offs, (end, t) in reversed(segs):
        out += [(p, 'o') for p, _ in reversed(offs)] + [(start, t)]
    return out


def signed_area(nodes):
    pts = [p for p, _ in nodes]
    return sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(pts, pts[1:] + pts[:1])) / 2


def ellipse_nodes(cx, cy, rx, ry, ccw=True):
    kk = 0.5523
    pts = [np.array(p, float) for p in [(cx + rx, cy), (cx, cy + ry), (cx - rx, cy), (cx, cy - ry)]]
    tang = [np.array(t, float) for t in [(0, ry), (-rx, 0), (0, -ry), (rx, 0)]]
    out = []
    for i in range(4):
        a, b = pts[i], pts[(i + 1) % 4]
        out += [(a + tang[i] * kk, 'o'), (b - tang[(i + 1) % 4] * kk, 'o'), (b, 'c')]
    return out if ccw else reverse_nodes(out)


def build(char, m):
    base, mark, small = char, None, False
    if char in DAKU: base, mark = DAKU[char], 'daku'
    if char in HANDAKU: base, mark = HANDAKU[char], 'handaku'
    if char in SMALL: base, small = SMALL[char], True
    black = m['black']
    fw, strokes = (B if black else R)[base]
    kw = WEIGHT[black] * (SMALL_WEIGHT if small else 1)
    V, H = m['V'] * kw, m['H'] * kw
    width = fw * UNIT * m['ink']
    height = TOP - BOTTOM
    sc = SMALL_SCALE if small else 1
    w, h = width * sc, height * sc
    x0 = width * 0.06 if small else 0
    ix, iy = w - V, h - H

    def mp(p):
        return np.array([x0 + V / 2 + p[0] * ix, BOTTOM + H / 2 + p[1] * iy])

    contours = []
    for st in strokes:
        segs = [(s[0],) + tuple(mp(p) for p in s[1:]) for s in st]
        contours.append(stroke_nodes(segs, V, H, (st[0][1], st[-1][-1])))
    extra = 0
    if mark == 'daku':
        mv, mh = V * 0.85, H * 0.85
        gap = mv * 1.3 + 40
        dx = 0.06 * height
        mx = x0 + w + (mv * 0.3 if black else -mv * 0.1 - 10)
        for off in (0.0, gap):
            pa = np.array([mx + off, BOTTOM + 1.05 * height])
            pb = np.array([mx + off + dx, BOTTOM + 0.84 * height])
            contours.append(stroke_nodes([('L', pa, pb)], mv, mh))
        extra = gap + dx + mv * 0.7
    elif mark == 'handaku':
        rad = 60 + V * 0.25
        mv, mh = V * 0.8, H * 0.8
        cx = x0 + w + (rad * 0.9 if black else rad * 0.2)
        cy = BOTTOM + height * 0.97 - rad * 0.3
        contours.append(ellipse_nodes(cx, cy, rad + mv / 2, rad + mh / 2, True))
        contours.append(ellipse_nodes(cx, cy, rad - mv / 2, rad - mh / 2, False))
        extra = rad * 1.6 + mv * 0.4
    adv = x0 + w + extra + m['sb'] * 2 + (width * 0.06 if small else 0)
    shift = np.array([m['sb'], 0])
    contours = [[(p + shift, t) for p, t in c] for c in contours]
    return contours, round(adv)


def extra_glyphs(m):
    black = m['black']
    kw = WEIGHT[black]
    V, H = m['V'] * kw, m['H'] * kw
    out = {}
    side_ = max(V, H) * 1.1
    w = side_ + m['sb'] * 2 + 120 * m['ink']
    cx, cy = w / 2, 370
    sq = [(np.array([cx + side_ / 2, cy - side_ / 2]), 'l'), (np.array([cx + side_ / 2, cy + side_ / 2]), 'l'),
          (np.array([cx - side_ / 2, cy + side_ / 2]), 'l'), (np.array([cx - side_ / 2, cy - side_ / 2]), 'l')]
    out['・'] = ([sq], round(w))
    return out


def all_chars():
    return list(R) + list(DAKU) + list(HANDAKU) + list(SMALL) + ['・']


if __name__ == "__main__":
    import sys, re, datetime
    PATH = sys.argv[1]
    src = open(PATH).read()
    src, n = re.subn(r',\n\{\nexport = 0;\nglyphname = uni30[0-9A-F]{2};\n.*?\nnote = "draft katakana, generated";\nunicode = \d+;\n\}', '', src, flags=re.S)
    print('removed', n)
    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S +0000')
    def fmt(v): return str(int(round(v)))
    def nodes_text(c):
        return '{\nclosed = 1;\nnodes = (\n' + ',\n'.join(f'({fmt(p[0])},{fmt(p[1])},{t})' for p, t in c) + '\n);\n}'
    names, entries = [], []
    for ch in all_chars():
        layers = []
        for mid, m in MASTERS.items():
            cs, adv = extra_glyphs(m)['・'] if ch == '・' else build(ch, m)
            lid = f'"{mid}"' if '-' in mid else mid
            layers.append('{\nlayerId = ' + lid + ';\nshapes = (\n' + ',\n'.join(nodes_text(c) for c in cs) + f'\n);\nwidth = {adv};\n}}')
        name = f'uni{ord(ch):04X}'
        names.append(name)
        entries.append('{\nexport = 0;\n' + f'glyphname = {name};\nlastChange = "{now}";\nlayers = (\n' + ',\n'.join(layers) + f'\n);\nnote = "draft katakana, generated";\nunicode = {ord(ch)};\n}}')
    marker = '}\n);\ninstances = ('
    assert src.count(marker) == 1
    src = src.replace(marker, '},\n' + ',\n'.join(entries) + '\n);\ninstances = (')
    m = re.search(r'name = glyphOrder;\nvalue = \(\n(.*?)\n\);', src, re.S)
    existing = m.group(1).split(',\n')
    add = [x for x in names if x not in existing]
    if add:
        src = src[:m.end(1)] + ',\n' + ',\n'.join(add) + src[m.end(1):]
    open(PATH, 'w').write(src)
    print(len(entries), 'glyphs written,', len(add), 'added to glyphOrder')
