"""Build handoff/design-system.html — the Gen 11 design system as one file.

python tools/ds-check/design-system.py

Foundations (colour, type, space, radius, elevation, icons, focus and motion, layout) are written
from the values computed on the pages. Every component is drawn by its ORIGIN page's own CSS stack
inside an isolated frame, so the design system cannot drift from the pages: change a page, rebuild.
Icons are read from the pages' sprites; an icon drawn differently on two pages is listed.
"""
import glob, html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'handoff', 'design-system.html')
SPEC = os.path.join(ROOT, 'tools', 'ds-check', 'design-system-components.html')
E = html.escape

# ── icons: the union of the pages' sprites ───────────────────────────────────
sym, draw, where = {}, {}, {}
for f in sorted(glob.glob(os.path.join(ROOT, 'pages', '*', '*-gen11.html'))):
    page = os.path.basename(f).replace('-gen11.html', '').replace('-', ' ').title()
    s = open(f, encoding='utf-8').read()
    for m in re.finditer(r'<symbol id="([^"]+)"([^>]*)>(.*?)</symbol>', s, re.S):
        i, attrs, body = m.group(1), m.group(2), re.sub(r'\s+', ' ', m.group(3)).strip()
        where.setdefault(i, set()).add(page)
        draw.setdefault(i, {}).setdefault(body, set()).add(page)
        sym.setdefault(i, (attrs, body))
SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + ''.join(
    '<symbol id="%s"%s>%s</symbol>' % (i, a, b) for i, (a, b) in sorted(sym.items())) + '</svg>'
DRIFT = {i: d for i, d in draw.items() if len(d) > 1}

# ── colour (computed on All Vehicles; equal on every page) ───────────────────
COL = [
    ('Text', [('Ink', '--ink', '#0d1320', '--color-ink', 'Primary text, values, titles'),
              ('Ink 2', '--ink-2', '#353e4e', '—', 'Secondary text, control labels'),
              ('Ink 3', '--ink-3', '#576070', '--color-ink-muted', 'Labels, keys, meta'),
              ('Ink 4', '--ink-4', '#697181', '--color-ink-faint', 'Placeholder, "not set"')]),
    ('Surfaces', [('Sheet', '--sheet', '#ffffff', '--color-surface-1', 'Cards, sheets, fields'),
                  ('Wash', '--wash', '#eef1f5', '--color-surface-0', 'Page ground, hover'),
                  ('Well', '--well', '#e4e9f0', '--color-surface-3', 'Sunken tracks, chips')]),
    ('Lines', [('Line', '--line', '#d8dee7', '--color-border', 'Dividers'),
               ('Line 2', '--line-2', '#e5e9ef', '—', 'Hairlines inside a sheet'),
               ('Line 3', '--line-3', '#c5cbd5', '--color-border-strong', 'Control edge')]),
    ('Brand', [('Brand', '--brand', '#1f5fe0', '--color-brand', 'Primary action, chosen view'),
               ('Brand hover', '--brand-hover', '#1a50c4', '--color-brand-strong', 'Primary hover'),
               ('Brand ink', '--brand-ink', '#1747b3', '—', 'Links, brand text'),
               ('Brand soft', '--brand-soft', '#e9f0fe', '--color-brand-soft', 'Bulk selection, filter on')]),
    ('Status', [('OK', '--ok', '#12704a', '--color-success', 'Running, available'),
                ('OK soft', '--ok-soft', '#e0f4e8', '--color-success-soft', 'Its chip fill'),
                ('Signal', '--signal', '#945000', '--color-warning', 'Pending, missing'),
                ('Signal soft', '--signal-soft', '#fff2dc', '--color-warning-soft', 'Its chip fill'),
                ('Danger', '--danger', '#bd3328', '--color-danger', 'Hidden on site, Clear all, destructive text'),
                ('Danger soft', '--danger-soft', '#fde8e5', '--color-danger-soft', 'Destructive hover'),
                ('Violet', '--violet', '#5c42c9', '—', 'Provenance: Demo, Mock addition'),
                ('Violet soft', '--violet-soft', '#eeeafc', '—', 'Its tag fill'),
                ('Slate', '--slate', '#586171', '--color-neutral', 'Quiet state'),
                ('Slate soft', '--slate-soft', '#eceef2', '--color-neutral-soft', 'Its chip fill')]),
    ('Dark surface', [('Focal', '--focal', '#172234', '—', 'Board cards, the row open for inspection'),
                      ('Focal ink', '--focal-ink', '#f3f6fb', '--color-ink-inverse', 'Text on the focal surface')]),
]

# ── type roles (computed; DESIGN.md §18) ─────────────────────────────────────
TYPE = [
    ('Page title', '600 28px/1.1 var(--font)', '-.022em', 'font-stretch:92%', '28 / 600 · −0.022em · width 92%', 'Manage Dealers', 'h1 on every page; the record name in a head card'),
    ('Section title', '600 18px/1.25 var(--font)', '-.012em', '', '18 / 600 · −0.012em', 'Identity & Status', 'A section of a record or form'),
    ('Board card title', '700 16px/1.3 var(--font)', '-.01em', '', '16 / 700 · −0.01em', 'Lead board', 'The dark board cards'),
    ('Dock title', '650 15px/1.3 var(--font)', '-.008em', '', '15 / 650', 'Workflow', 'Dock and panel heads'),
    ('Body · cell', '400 14px/1.45 var(--font)', '0', '', '14 / 400 · identifier 600', 'Ten pages, dealer and staff, on one system.', 'Running text, table cells'),
    ('Button', '500 14px/1 var(--font)', '0', '', '14 / 500', 'Add vehicle', 'Every button'),
    ('Facet · filter', '600 13.5px/1 var(--font)', '0', 'color:var(--ink-2)', '13.5 / 600 ink-2', 'Sort  When added', 'Facet buttons, quick filters'),
    ('View tab', '500 13.5px/1 var(--font)', '0', 'color:var(--ink-2)', '13.5 / 500 ink-2', 'New Mail', 'View tabs, section navigator'),
    ('Field label', '600 13px/1.3 var(--font)', '0', 'color:var(--ink-2);white-space:nowrap', '13 / 600 ink-2 · one line', 'Primary contact email', 'Above every field'),
    ('Status chip', '600 13px/1 var(--font)', '0', '', '13 / 600', 'Sale pending', 'Status chips'),
    ('Meta', '400 13px/1.4 var(--font)', '0', 'color:var(--ink-3)', '13 / 400 ink-3', 'opened 03/31/2026 · last activity 06/15/2026', 'Dates, context lines, help'),
    ('Flag tag', '600 12px/1 var(--font)', '0', 'color:var(--ink-2)', '12 / 600 ink-2', 'No photos', 'Flag tags, entry kinds'),
    ('Caps key', '700 11px/1.2 var(--font)', '.08em', 'text-transform:uppercase;color:var(--ink-3)', '11 / 700 · +0.08em · CAPS ink-3', 'Company name', 'Table head keys, spec keys, menu group labels — nowhere else'),
    ('Mono · code', '500 13px/1.3 var(--mono)', '0', '', 'Plex Mono 12.5–13', 'ZFF97CMA0P0300236', 'Stock #, VIN, phone, IP, ids — what a person copies'),
]

SPACE = [('--s1', 4, 'half-step: inside compact controls'), ('--s2', 8, 'between neighbours, row column gap'), ('--s3', 12, 'half-step: compact padding'),
         ('--s4', 16, 'gutter, sheet inset'), ('--s5', 24, 'between page blocks, card inset'), ('--s6', 32, ''), ('--s7', 40, ''), ('--s8', 48, 'empty-state padding'), ('--s9', 64, '')]
NAMED = [('--gutter', '16px', 'the page edge, every width'), ('--sheet-inset', '16px', 'header cells, rows, footer'), ('--col-gap', '8px', 'between row columns'),
         ('--anchor-gap', '10px', 'the opened row lands 10px under the sticky stack — off the scale on purpose')]
RADII = [('4', '4px', 'Micro', 'swatch, kbd, Mock-addition tag'), ('5', '5px', 'Checkbox', 'the checkbox only'), ('7', '7px', 'Inner', 'fields, status chips, menus, menu items'),
         ('9', '9px', 'Control', 'every button, facets'), ('12', '12px', 'Panel', 'platform bar, dock'), ('14', '14px', 'Card', 'field sheet, head card, board, dialog'),
         ('pill', '999px', 'Pill — semantic only', 'segmented track, flag tag, switch, counter, avatar, id pill')]
ELEV = [('--sh-pill', '0 1px 2px rgba(34,58,118,.12), 0 6px 14px -8px rgba(34,58,118,.32), inset 0 1px 0 #fff', 'Resting controls', 'sheet buttons, facets, the command search'),
        ('--sh-soft', '0 28px 64px -34px rgba(34,58,118,.42), 0 2px 8px -3px rgba(34,58,118,.10), inset 0 1px 0 rgba(255,255,255,.95)', 'Floating sheets', 'platform bar, field sheet, record head, in-page popovers'),
        ('--el-2', '0 12px 30px -14px rgba(16,24,40,.22), 0 0 0 1px rgba(16,24,40,.05)', 'Side panel', 'the dock'),
        ('--el-3', '0 30px 64px -18px rgba(16,24,40,.34), 0 0 0 1px rgba(16,24,40,.06)', 'Overlays', 'bar menus, dialogs, overlay dock'),
        ('stack', '0 1px 0 #d8dee7, 0 10px 20px -16px rgba(34,58,118,.45)', 'Sticky stack, engaged', 'one shadow at the bottom of bar + band + column head')]
ICON_SIZES = [(12, 'in-chip glyphs, chip close (stroke 2.2)'), (13, 'chevrons in nav items and facets; copy'), (14, 'global search, small buttons, links, contact tags'),
              (16, 'default: buttons, facets, fields, the dock'), (17, 'platform-bar utilities')]
BREAK = [('1280 and up', 'Desktop. Checked at 1280 · 1366 · 1440 · 1920; 1366 is the binding width.'),
         ('1180–1279', 'Tablet landscape: staff bar on two rows; lists scroll inside their own box; docks beside the content.'),
         ('1024–1179', 'Dealer bar still one row; boards two by two; docks become overlays.'),
         ('768–1023', 'Dealer bar on two rows too. Touch: 36px controls or an invisible 36 × 36 hit area.'),
         ('below 768', 'Not designed.')]
Z = [('--z-content', 1), ('--z-raised', 3), ('--z-sticky-hd', 10), ('--z-sticky-cmd', 12), ('--z-platform', 20), ('--z-tray', 30), ('--z-menu', 40)]


def lum(h):
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
    f = lambda c: c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4
    return .2126 * f(r) + .7152 * f(g) + .0722 * f(b)


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + .05) / (lb + .05)


def board(id_, title, lead, body, src=''):
    return ('<section class="b" id="%s"><header class="b__h"><h2>%s</h2>%s</header><p class="b__lead">%s</p>%s</section>'
            % (id_, E(title), '<span class="b__src">%s</span>' % src if src else '', lead, body))


# ── dark values: read from the pages' own dark block, so this file cannot drift from them ──────
_fam = open(os.path.join(ROOT, 'pages', '_aan-family.css'), encoding='utf-8').read()
_m = re.search(r'html\[data-theme="dark"\] \{(.*?)\n\}', _fam, re.S)
DARK = dict(re.findall(r'(--[\w-]+):\s*(#[0-9a-fA-F]{6})', _m.group(1))) if _m else {}
DARK_SHEET, DARK_INK = DARK.get('--sheet', '#24272d'), DARK.get('--ink', '#dcdfe5')


def chip(hx, light_ink, dark_ink, label):
    text_on = light_ink if ratio(hx, light_ink) >= ratio(hx, dark_ink) else dark_ink
    return ('<div class="sw__c" style="background:%s;color:%s"><em>%s</em><span>Aa</span><small>%.1f : 1</small></div>'
            % (hx, text_on, label, ratio(hx, text_on)))


def aa(r):
    return ' · AA text' if r >= 4.5 else (' · AA large' if r >= 3 else '')


# ── foundations ───────────────────────────────────────────────────────────────
F = []
rows = ''
for grp, items in COL:
    cells = ''
    for name, tok, hx, be, use in items:
        dk = DARK.get(tok, hx)
        on_white, on_dark = ratio(hx, '#ffffff'), ratio(dk, DARK_SHEET)
        cells += ('<div class="sw"><div class="sw__cc">%s%s</div>'
                  '<div class="sw__t"><b>%s</b><code>%s</code><span class="hex">%s <i>light</i> · %s <i>dark</i></span><span class="be">%s</span><span class="use">%s</span>'
                  '<span class="ct">light: on white %.1f : 1%s</span><span class="ct">dark: on the dark sheet %.1f : 1%s</span></div></div>') % (
            chip(hx, '#ffffff', '#0d1320', 'Light'), chip(dk, DARK_INK, '#191b1f', 'Dark'),
            E(name), tok, hx.upper(), dk.upper(), ('backend ' + be) if be != '—' else 'no backend token', E(use),
            on_white, aa(on_white), on_dark, aa(on_dark))
    rows += '<h3 class="grp">%s</h3><div class="sws">%s</div>' % (grp, cells)
rows += ('<div class="rules"><div><h4>Red, twice only</h4><p>Red marks Hidden on site and Clear all. A destructive action is danger <i>text</i>, never a red fill.</p></div>'
         '<div><h4>One means per state</h4><p>Brand fill = chosen view. Focal dark = the record open for inspection. Brand soft = bulk selection. They never look alike.</p></div>'
         '<div><h4>Never colour alone</h4><p>A tone always comes with its word. Status reads in words; red never grades a fact.</p></div></div>')
F.append(board('colour', 'Colour', 'Every colour on the ten pages, in both themes. Each swatch shows the light value and the dark value with their own text colour and contrast; the lines under it say what it is for and which backend token carries it. The dark values are read from the pages’ own dark block (<code>_aan-family.css</code>, <code>html[data-theme="dark"]</code>).', rows, 'DESIGN.md §5 · §6 · §42'))

fam = ('<div class="fams"><div class="fam"><div class="fam__aa" style="font-family:var(--font)">Aa</div><div><b>Archivo</b><p>All text. Variable: weight 100–900, width 62–125%. '
       'Weights in use: 400 · 500 · 600 · 650 · 700.</p><div class="fam__w">' +
       ''.join('<span style="font:%d 22px var(--font)">Ag %d</span>' % (w, w) for w in (400, 500, 600, 650, 700)) +
       '</div><div class="fam__g" style="font-family:var(--font)">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz 0123456789 · $1,099,500</div></div></div>'
       '<div class="fam"><div class="fam__aa" style="font-family:var(--mono)">Aa</div><div><b>IBM Plex Mono</b><p>Only what a person copies or matches by eye: stock #, VIN, phone, IP, ids in pills, raw logs. '
       'Names, money and dates are Archivo.</p><div class="fam__g" style="font-family:var(--mono)">ZFF97CMA0P0300236 · 0P0300236 PS<br>(203) 629-1234 · 192.168.0.1</div></div></div></div>')
trows = ''.join('<tr><td><b>%s</b><span>%s</span></td><td><span class="spec" style="font:%s;letter-spacing:%s;%s">%s</span></td><td>%s</td></tr>'
                % (E(n), E(s), f, ls, x, E(t), E(w)) for n, f, ls, x, s, t, w in TYPE)
typ = fam + '<table class="tt"><thead><tr><th>Role</th><th>Specimen, real size</th><th>Where</th></tr></thead><tbody>' + trows + '</tbody></table>' + \
      ('<div class="rules"><div><h4>Weight, not size</h4><p>Hierarchy comes from weight. No size outside these roles.</p></div>'
       '<div><h4>Caps for keys only</h4><p>Table head keys, spec keys and menu group labels. Never on a name, chip, tag, button or label.</p></div>'
       '<div><h4>Same at every width</h4><p>Type never shrinks on tablet; controls may grow. Money and counts use tabular figures.</p></div></div>')
F.append(board('type', 'Typography', 'One face for everything, a mono face for codes, and fourteen fixed roles. Every specimen is drawn at its real size.', typ, 'DESIGN.md §18'))

sp = '<div class="ladder">' + ''.join('<div class="ld"><code>%s</code><i style="width:%dpx"></i><b>%dpx</b><span>%s</span></div>' % (t, v * 4, v, E(u)) for t, v, u in SPACE) + '</div>'
sp += '<table class="tt tt--sm"><tbody>' + ''.join('<tr><td><code>%s</code></td><td><b>%s</b></td><td>%s</td></tr>' % (t, v, E(u)) for t, v, u in NAMED) + '</tbody></table>'
sp += ('<div class="rhythm"><div class="rh rh--bar">Platform bar · 56</div><div class="gap">16</div><div class="rh rh--head">Page head · 32</div><div class="gap">24</div>'
       '<div class="rh rh--board">Board</div><div class="gap">24</div><div class="rh rh--field">Field sheet</div></div><p class="cap">Page rhythm, All Vehicles at 1440: the bar sits 16 from the top; 16 to the head; 24 to the board; 24 to the field. The gutter is 16 at every width.</p>')
F.append(board('space', 'Spacing', 'An 8-point ladder with 4 and 12 as half-steps for compact controls. The same relationship always takes the same step.', sp, 'DESIGN.md §1'))

rd = '<div class="tiles">' + ''.join('<div class="tile"><div class="tile__s" style="border-radius:%s"></div><b>%s</b><span>%s</span><em>%s</em></div>' % (r, n, E(l), E(u)) for n, r, l, u in RADII) + '</div>'
rd += ('<div class="rules"><div><h4>Square where surfaces touch</h4><p>Radius 0 on every touching edge. A band inside a sheet has no radius of its own; the sheet keeps the corners.</p></div>'
       '<div><h4>Buttons are 9, always</h4><p>No pill buttons, fields, facets or tab strips. The pill is a meaning: a state, a flag, a count.</p></div></div>')
F.append(board('radius', 'Radius', 'Six radii and a semantic pill. Each has one job.', rd, 'DESIGN.md §3'))

ev = '<div class="tiles tiles--ev">' + ''.join('<div class="tile"><div class="tile__e" style="box-shadow:%s"></div><b>%s</b><span>%s</span><em>%s</em></div>' % (v, n, E(l), E(u)) for n, v, l, u in ELEV) + '</div>'
ev += '<div class="rules"><div><h4>One shadow per floating object</h4><p>Never two shadows on one boundary. Attached surfaces have none: they share a hairline.</p></div><div><h4>The sticky stack casts one</h4><p>Bar, band and column head engage as one surface with one shadow at the bottom edge. Interior shadows are removed, not softened.</p></div></div>'
F.append(board('elevation', 'Elevation', 'Four shadows and the sticky-stack edge. Depth says what floats; it is never decoration.', ev, 'DESIGN.md §2 · §4'))

ic = '<div class="icons">' + ''.join('<div class="ic"><svg class="i"><use href="#%s"/></svg><code>%s</code></div>' % (i, i) for i in sorted(sym)) + '</div>'
ic += '<h3 class="grp">Sizes</h3><div class="isz">' + ''.join('<div><svg class="i" style="width:%dpx;height:%dpx"><use href="#i-search"/></svg><b>%dpx</b><span>%s</span></div>' % (s, s, s, E(u)) for s, u in ICON_SIZES) + '</div>'
ic += ('<div class="rules"><div><h4>One stroke set</h4><p><code>fill: none</code> <code>stroke: currentColor</code> <code>stroke-width: 1.6</code>, round caps and joins, drawn from the page sprite. Never an <code>&lt;img&gt;</code>.</p></div>'
       '<div><h4>Never alone</h4><p>An icon carries a label or an <code>aria-label</code>. An icon-only button also has a <code>title</code>.</p></div></div>')
if DRIFT:
    dr = ''
    for i, d in sorted(DRIFT.items()):
        dr += '<div class="drift"><code>%s</code>' % i
        for body, pages in d.items():
            dr += '<div><svg viewBox="0 0 24 24" class="i i--lg">%s</svg><span>%s</span></div>' % (body, E(', '.join(sorted(pages))))
        dr += '</div>'
    ic += '<h3 class="grp">Drawn differently on different pages — to converge</h3><p class="cap">The same icon name carries a different drawing on these pages. The first drawing of each pair is the origin page\'s; the others converge on it.</p><div class="drifts">' + dr + '</div>'
F.append(board('icons', 'Iconography', '%d icons, one stroke set. Hover a tile for its name in the sprite.' % len(sym), ic, 'DESIGN.md §34'))

fm = ('<div class="fm"><div><div class="fm__s"><button type="button" class="demo-btn">Add vehicle</button></div><b>Focus on light</b><span>2px brand outline, offset 2</span></div>'
      '<div><div class="fm__s fm__s--dark"><button type="button" class="demo-btn demo-btn--dark">Clear</button></div><b>Focus on dark</b><span>2px #ffd98a outline, offset 2</span></div>'
      '<div><div class="fm__s"><span class="dur"><i></i></span></div><b>160 ms</b><span>colour, state — --dur</span></div>'
      '<div><div class="fm__s"><span class="dur dur--2"><i></i></span></div><b>240 ms</b><span>disclosure — --dur2</span></div>'
      '<div><div class="fm__s"><code>cubic-bezier(.2, 0, 0, 1)</code></div><b>One easing</b><span>--ease, everywhere</span></div></div>'
      '<div class="rules"><div><h4>Focus owns the outline</h4><p>Only <code>:focus-visible</code> draws it; nothing draws focus with a shadow; nothing clips it.</p></div>'
      '<div><h4>Nothing jumps</h4><p>Motion is for disclosure and state, never for arrival. No state change moves layout: space is reserved. Reduced motion lands in the same place instantly.</p></div></div>')
F.append(board('focus', 'Focus and motion', 'How the system shows where you are and how it changes state.', fm, 'DESIGN.md §12 · §14'))

ly = '<table class="tt tt--sm"><tbody>' + ''.join('<tr><td><b>%s</b></td><td>%s</td></tr>' % (E(a), E(b_)) for a, b_ in BREAK) + '</tbody></table>'
ly += ('<div class="stack"><div class="st st--bar">Platform bar<em>--stick-bar 56</em></div><div class="st st--cmd">Command band<em>--stick-cmd 56 = 8 + 40 + 8</em></div>'
       '<div class="st st--hd">Column head<em>--stick-hd 40</em></div><div class="st st--sum"><b>152</b> sticky total · tablet ≤ 204, never a third of the screen</div></div>')
ly += '<h3 class="grp">Layers</h3><div class="zs">' + ''.join('<div><code>%s</code><b>%d</b></div>' % (n, v) for n, v in Z) + '</div><p class="cap">No component writes a raw z-index. Content always passes under the sticky chrome.</p>'
F.append(board('layout', 'Layout', 'Breakpoints, the sticky stack and the layer ladder.', ly, 'DESIGN.md §7 · §15 · §41'))

# ── components: frames drawn by the origin page's CSS ────────────────────────
ORIGIN_NAME = {'AV': 'All Vehicles', 'SV': 'Single Vehicle', 'AL': 'All Leads', 'SL': 'Single Lead', 'ST': 'Single Ticket', 'MD': 'Manage Dealers', 'DE': 'Dealer Edit'}
comp = open(SPEC, encoding='utf-8').read() if os.path.exists(SPEC) else ''
comp = re.sub(r'\A<!--.*?-->', '', comp, flags=re.S)   # the header comment is documentation, not a block
C, NAV_C = [], []
for m in re.finditer(r'<!--C (\w+) \| ([^|]+) \| (\w+) \| ([^|]*) \| ([^>]*)-->(.*?)<!--/C-->', comp, re.S):
    cid, title, origin, src, lead, body = m.groups()
    NAV_C.append((cid, title.strip()))
    frames = ''
    for fm_ in re.finditer(r'<!--F(?: ([^>]*))?-->(.*?)<!--/F-->', body, re.S):
        cap, inner = (fm_.group(1) or '').strip(), fm_.group(2)
        o = origin
        mo = re.search(r'\s@([A-Z]{2})$', cap)
        if mo:
            o, cap = mo.group(1), cap[:mo.start()].strip()
        frames += '%s<iframe class="fr" title="%s" data-origin="%s" data-src="%s"></iframe>' % (
            '<h3 class="grp">%s%s</h3>' % (E(cap), '<small> · drawn with %s\'s CSS</small>' % ORIGIN_NAME[o] if o != origin else '') if cap else '',
            E(title.strip()), o, E(inner.strip()))
    notes = re.search(r'<!--N-->(.*?)<!--/N-->', body, re.S)
    C.append(board(cid, title.strip(), lead.strip(), frames + (notes.group(1) if notes else ''), 'Origin: %s · %s' % (ORIGIN_NAME[origin], src.strip())))

NAV_F = [('colour', 'Colour'), ('type', 'Typography'), ('space', 'Spacing'), ('radius', 'Radius'), ('elevation', 'Elevation'), ('icons', 'Iconography'), ('focus', 'Focus and motion'), ('layout', 'Layout')]
tpl = open(os.path.join(ROOT, 'tools', 'ds-check', 'design-system.tpl.html'), encoding='utf-8').read()
out = (tpl.replace('{{NAV_F}}', ''.join('<a href="#%s">%s</a>' % x for x in NAV_F))
          .replace('{{NAV_C}}', ''.join('<a href="#%s">%s</a>' % x for x in NAV_C))
          .replace('{{FOUNDATIONS}}', '\n'.join(F)).replace('{{COMPONENTS}}', '\n'.join(C))
          .replace('{{SPRITE}}', SPRITE).replace('{{SPRITE_JSON}}', json.dumps(SPRITE))
          .replace('{{COUNTS}}', '%d colours · %d type roles · %d icons · %d components' % (sum(len(i) for _, i in COL), len(TYPE), len(sym), len(NAV_C))))
open(OUT, 'w', encoding='utf-8').write(out)
print('written', OUT, '| icons', len(sym), '| drift', len(DRIFT), '| components', len(NAV_C))
