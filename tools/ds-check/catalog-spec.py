"""Write the measured spec tables into handoff/catalog.html.

python tools/ds-check/catalog-spec.py
Reads handoff/catalog/gen11-components-measured.json (made by catalog.mjs) and fills every
<!--SPEC:i,j,k-->…<!--/SPEC--> block with a table of those measured components, so the numbers on the
catalogue are the computed values of the origin pages, never typed by hand.
"""
import json, re, os, html

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
J = os.path.join(ROOT, 'handoff', 'catalog', 'gen11-components-measured.json')
H = os.path.join(ROOT, 'handoff', 'catalog.html')
M = json.load(open(J, encoding='utf-8'))

TOK = {  # DESIGN.md §5 roles, so a value reads as the token it is
    '#0d1320': 'ink', '#353e4e': 'ink-2', '#576070': 'ink-3', '#697181': 'ink-4', '#ffffff': 'sheet',
    '#e4e9f0': 'well', '#eef1f5': 'wash', '#dfe3ea': 'line', '#e9ecf1': 'line-2', '#c5cbd5': 'line-3',
    '#1f5fe0': 'brand', '#1747b3': 'brand-ink', '#e9f0fe': 'brand-soft', '#12704a': 'ok', '#bd3328': 'danger',
    '#945000': 'signal', '#5c42c9': 'violet', '#172234': 'focal', '#f3f6fb': 'focal-ink',
}
SH = [  # DESIGN.md §4
    ('rgba(29, 95, 230, 0.7) 0px 10px 22px -10px', 'primary glow'),
    ('rgba(34, 58, 118, 0.42) 0px 28px 64px -34px', '--sh-soft'),
    ('rgba(16, 24, 40, 0.34) 0px 30px 64px -18px', '--el-3'),
    ('rgba(16, 24, 40, 0.22) 0px 12px 30px -14px', '--el-2'),
    ('rgba(34, 58, 118, 0.12) 0px 1px 2px', '--sh-pill'),
    ('rgba(15, 27, 61, 0.55) 0px 22px 44px -22px', 'board card'),
    ('rgba(34, 58, 118, 0.4) 0px -10px 24px -20px', 'hairline + upward (save bar)'),
]


def hexc(v):
    m = re.match(r'rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)', v or '')
    if not m:
        return v or ''
    r, g, b, a = m.groups()
    if a is not None and float(a) == 0:
        return 'none'
    h = '#%02x%02x%02x' % (int(r), int(g), int(b))
    name = TOK.get(h)
    out = h + (' ' + name if name else '')
    return out + (' · %d%%' % round(float(a) * 100) if a is not None and float(a) < 1 else '')


def shadow(v):
    if not v or v == 'none':
        return 'none'
    for k, n in SH:
        if k in v:
            return n
    if 'inset' in v and v.count('px') <= 5:
        return 'hairline (inset)'
    return 'own shadow'


def px(v):
    return re.sub(r'(\d+)\.\d+px', r'\1px', v or '')


def row(i):
    c = M[i]['comp']
    name = M[i]['name'].replace('Â·', '·')
    page = M[i]['page'].split('/')[-1].replace('-gen11.html', '').replace('-', ' ').title()
    hidden = c.get('display') == 'none' or M[i]['size'] == '0x0'
    size = 'opens on demand' if hidden else (M[i]['size'].replace('x', ' × ') if int(M[i]['size'].split('x')[0]) < 700 else 'h ' + M[i]['size'].split('x')[1])
    typ = '%s / %s' % (c['fontSize'], c['fontWeight']) + (' caps' if c.get('textTransform') == 'uppercase' else '')
    if 'Mono' in c.get('fontFamily', '').split(',')[0]:
        typ += ' mono'
    cells = [name, page, size, px(c['padding']), px(c['borderRadius']), typ, hexc(c['color']), hexc(c['backgroundColor']), shadow(c['boxShadow'])]
    return '<tr>' + ''.join('<td>%s</td>' % html.escape(x) for x in cells) + '</tr>'


def table(ids):
    head = ''.join('<th>%s</th>' % h for h in ['Part', 'Origin page', 'Size', 'Padding', 'Radius', 'Type', 'Ink', 'Fill', 'Shadow'])
    return ('<div class="spec"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div>' %
            (head, ''.join(row(int(i)) for i in ids)))


s = open(H, encoding='utf-8').read()
n = 0


def rep(m):
    global n
    n += 1
    return '<!--SPEC:%s-->%s<!--/SPEC-->' % (m.group(1), table(m.group(1).split(',')))


s = re.sub(r'<!--SPEC:([\d,]+)-->.*?<!--/SPEC-->', rep, s, flags=re.S)
open(H, 'w', encoding='utf-8').write(s)
print('spec tables', n)
