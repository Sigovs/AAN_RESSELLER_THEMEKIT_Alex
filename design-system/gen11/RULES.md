# Gen 11 — RULES

Positive contracts. Every number here was measured on the ten shipped pages at
1440×900; where the product is inconsistent, the inconsistency is named rather
than averaged away.

The companion documents are `ANTI-PATTERNS.md` (what the system refuses, and what
it does instead) and `TOKENS.md` (the values, read out of the running product).

---

## 1 · The spacing contract

The ladder is **4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64**, published as `--s1`…`--s9`.
A value off the ladder is a decision, and a decision needs a comment.

### Structural

| relationship | value | measured on |
|---|---|---|
| page gutter | **16px** | all ten pages, every supported width |
| structural inset — content inside a surface | **16px** (`--inset`) | table rows `0 16px`, column header `9px 16px` |
| control inset — text inside a control | **12px** (`--inset-ctl`) | table cells, swatch meta, menu rows |
| section padding | 24–32px top, 32–40px bottom | zones on the two editor pages |
| block rhythm inside a section | 16px between blocks, 8px inside a block | Single Ticket worklog, Single Lead fields |

**Every structural surface owns its content inset.** A child never relies on
whatever padding its parent happens to have. If a surface holds text, the surface
declares the inset — not the first element that noticed the problem.

### Separation — the rule that keeps being broken

Two interactive surfaces never touch, and never come close enough to read as one
object.

| group | gap | why |
|---|---|---|
| standalone actions in a row | **8px** | `.head__actions`, `.veh__acts`, `.cock__acts`, `.c-act` |
| members of a segmented control | **6px** | `.secnav`, `.seg`, `.lanes`, `.tally`, `.statuses`, the platform bar |
| the platform bar's own clusters | **6px** | `.top` |

The 8px figure is the system's own: *one primary per group, 8px apart, never
touching.* 6px is the tier below, for members that share a tray and are already
read as one control.

This has been repaired three times — the platform nav at 0px, the section tabs at
1px, the record arrows at 2px — each time because width was bought by deleting the
gap. **Separation is never the elastic member.** When a row does not fit, the
width comes out of a field, a label, or a scroller. It never comes out of the space
between two things you can click.

### What is allowed to share an edge

Some things are a list, not a row of buttons, and a hairline is the separator:

- the go-live ticker on My Work Queue — items butt, divided by `inset -1px 0 0`
- rows in a table — divided by `inset 0 -1px 0`
- zones in an editor — divided by a 1px top border
- menu rows in a popover — full-bleed, divided by hover

In each case the text inside is still inset, and the divider is drawn once.

---

## 2 · Controls

Four heights, and each one means something.

| tier | height | radius | horizontal padding | where |
|---|---|---|---|---|
| dense | **30px** | 7px | 11px | inside a section, inside a row, `.btn--sm` |
| standard | **32–36px** | 9px | 12–14px | toolbars, the platform bar |
| record | **40px** | 9px | 14–24px | the action row above a record |
| field | **40–44px** | 7–9px | 12px | form controls, `.fld` |

`.btn--primary` is the brand fill and carries a restrained glow. **One per group.**
`.btn--sheet` carries a surface; `.btn--quiet` sits on the ground. Destructive is
carried by ink (`.btn--del`), never by a red fill.

Icon-only actions are square at their tier's height. A row's action cluster is the
dense tier at 27–30px, 8px apart.

---

## 3 · Surfaces

### Attached

Two surfaces that share a structural edge:

- the edge is **square on both sides**
- the line is drawn **once**, by one of them, as an inset shadow
- **no gap**, and no shadow between them
- radius survives only on the outer corners of the pair

Examples: the lane strip attached to the top of the workspace; the column header
attached to the first row; the record head attached to the bottom of the platform
bar; a zone attached to the zone above it.

### Floating

A surface with air around it:

- a **real gap** on every side
- a **complete radius**
- **one** shadow, never two on the same boundary
- it sits above the ground, not on it

Examples: the workspace sheet, the dock, a popover, the commit bar.

### Sunken

A track that holds controls: `--well` fill, one inset hairline, no drop shadow.

### Dark focal

The one panel per page allowed to dominate: `--focal` ground, a restrained
directional gradient, `--focal-ink` type. It carries figures, never form controls.

### The five levels, in order

    PAGE              --wash    #eef1f5
    WORK SURFACE      --sheet   #ffffff
    SECONDARY REGION  --well    #e4e9f0
    CONTROL           --sheet + 1px --line
    FOCAL / PRIMARY   --brand fill, or the dark --focal panel

The step from page to sheet is the one that has to be visible. It was 3% and is
now twice that, which is why the workspace reads as a sheet instead of needing a
shadow to prove it exists.

---

## 4 · The sticky stack

CSS publishes the geometry; JS reads it.

    --stick-bar  56px    platform bar
    --stick-cmd  56px    command band
    --stick-hd   40px    column header
    --stick-total = calc(56px + 56px + 40px) = 152px

`--stick-total` is **derived** — the three layers take their heights *from* the
tokens, so the sum is always what the layers measure. Custom properties are
substituted but not evaluated, so `getPropertyValue('--stick-total')` returns the
literal `calc(...)` text: read the three plain values and add them.

A hairline inside the stack is `box-shadow: inset`, never `border` — a border adds
a pixel to a layer whose height the selected-row anchor depends on.

The anchor is `--stick-total + --anchor-gap`, and nothing hardcodes a scroll offset.

---

## 5 · Type

| role | size | weight | where |
|---|---|---|---|
| page title | 19–26px | 650 | `h1` |
| section title | 17px | 650 | `.zone__t`, `.sec__t` |
| subject / record name | 15px | 600–650 | row subject, specimen name |
| body / control | 13–14px | 400–500 | fields, buttons, cells |
| metadata | 12.5–13px | 400 | under a title, beside a value |
| caps micro-label | **11px** | 700, `.09em` | column headers, section labels |

**11px is the floor** for anything functional. A caps label at 10.5px is not a
style choice; it is a legibility failure that survives only because the person
writing it was leaning into the screen.

Numbers that line up vertically are `font-variant-numeric: tabular-nums`.

---

## 6 · States

Only states the product actually implements:

`default` · `hover` · `focus-visible` · `current` (a destination or lane) ·
`selected` (a row picked for a bulk action) · `open` (an expansion or popover) ·
`stuck` (the sticky stack engaged) · `dirty` (unsaved edits) · `disabled` ·
`warning` / `error` / `success` (semantic, carried by ink and a soft fill).

**Current and selected are different questions** — "which one am I reading" versus
"which ones will this action hit" — and they co-occur, so they never look alike.

Focus is one thing everywhere: `2px solid var(--brand)` at `2px` offset. Nothing
else owns the outline.

---

## 7 · Overlays

A popover is left-anchored to its trigger and flips to right-anchored when, and
only when, it would overflow its workspace (`fitPop()`). It is capped at 420px so
it cannot size to `max-content` and run off the page.

A menu is a **column** of choices: `.mn__it` is block-level flex at full width.
An inline-flex menu row is a bug — it puts every choice on one line.

---

## 8 · Tables

One header voice: 11px caps, `.05em`, `--ink-3`, on an inset hairline.

Row height is page-level density (`--row`): 74px where a row carries a thumbnail,
64px for the work queue, 56px for the roster, 52px for money. Row padding is
`0 16px` on every page.

Numeric columns are right-set and tabular. Identifier columns are left-set and
carry the weight. An action cell is the dense tier, 8px apart, right-aligned.

When columns stop fitting, the **list** scrolls horizontally inside the workspace.
Columns are never dropped, and never frozen.
