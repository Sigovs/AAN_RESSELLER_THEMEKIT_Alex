# AAN — GEN 11 DESIGN SYSTEM

**Written for:** anyone building or reviewing an AAN Gen 11 page.

Every value here was read out of the running implementation of
`pages/dealer/all-vehicles-gen11.html` after the Phase 1 visual-system pass, not proposed in
advance. Where a number looks arbitrary, the note says what it is load-bearing for. Where the
system deliberately allows two answers, the note says which evidence forced that.

This is an operational dealer control panel. Density, legibility and predictable position beat
decoration. Nothing in this document asks for an effect.

---

## 1 · Spacing — one 8pt ladder

```
--s1   4px      --s4  16px      --s7  40px
--s2   8px      --s5  24px      --s8  48px
--s3  12px      --s6  32px      --s9  64px
```

4 and 12 are the half-steps compact controls need. Everything structural lands on 8.

**The rule that matters:** the same relationship always takes the same token. A gap should be
readable as an intention, not guessed at. Do not introduce 17 / 19 / 22 / 26 / 31 without a
concrete optical reason recorded next to it.

### Structural spacing

| token | value | what it is |
|---|---|---|
| `--gutter` | `var(--s4)` 16px | the page gutter — **every** layer's left and right edge |
| `--sheet-inset` | `var(--s4)` 16px | field gutter: header cells, rows, scope line, footer |
| `--col-gap` | `var(--s2)` 8px | between row columns |
| `--exp-detach` | `var(--s2)` 8px | air between the selected pair and the row above it |
| `--anchor-gap` | **10px** | **off the scale on purpose** — see §8 |

---

## 2 · Surfaces — ATTACHED or FLOATING, never both

Decide this for every boundary before styling it. Most of the defects Phase 1 removed were
surfaces that had not been assigned.

**ATTACHED**
- touching corners are **square**
- one shared edge, drawn as a single hairline (`--line-2`)
- **no** shadow between the two — an interior shadow is invisible where surfaces meet and only
  ever shows as a dark fragment at the seam
- the same horizontal inset as its neighbours
- no gap, real or implied

**FLOATING**
- a visible gap on every side
- its own complete radius
- one restrained shadow
- never intersecting another rounded surface

**Hairlines are drawn with `box-shadow: inset 0 ±1px 0`, not `border`,** on any layer whose height
is part of `--stick-total`. A border adds a pixel; the sticky arithmetic cannot absorb it.

### What is what on All Vehicles

| surface | class | |
|---|---|---|
| platform bar | `.top` | FLOATING at rest · ATTACHED once engaged |
| command band | `.cmd` | ATTACHED always — full width inside the field |
| column header | `.hd` | ATTACHED — owns the stack's bottom edge |
| inventory field | `.field` | FLOATING — `--r-card`, one shadow |
| rows / footer | `.rows` `.foot` | ATTACHED inside the field — no radius, no ring of their own |
| filters dock | `.dock` | FLOATING — 16px gutter from the field, `--r-card` |
| selection tray | `.tray` | FLOATING |
| menus, popovers | `.menu` `.pop` | FLOATING |

**Intentional exception:** with the dock open, `.top` stays full width while the field narrows to
make room. The bar is the application boundary; the field and the dock are two floating panes
beneath it, separated by one `--gutter`. The bar's bottom edge therefore spans both. That is the
layout, not a seam.

---

## 3 · Radius

```
--r-pill    999px   pills, lanes, segmented tracks, chips
--r-card     24px   floating panes: field, dock, summary cards
--r-panel    18px   panels inside a pane: photo box, workspace
--r-control  14px   inputs and fields (buttons are pills — see §11)
--r-inner    10px   things inside a control
--r-micro     5px   checkbox, swatch
--r-sheet-o  28px   legacy outer sheet — being retired into --r-card
```

Do not force one radius everywhere. **Do** force radius to `0` on any edge where two surfaces
touch.

---

## 4 · Elevation

One shadow per floating object. Never two on the same boundary.

```
--el-1  0 1px 2px …, 0 0 0 1px …        resting control
--el-2  0 12px 30px -14px …             floating pane
--el-3  0 30px 64px -18px …             menu / popover
```

The engaged sticky stack casts **one** shadow, at its bottom edge, on `.hd--stuck`:
`0 1px 0 var(--line), 0 10px 20px -16px rgba(34,58,118,.45)`.

Interior shadows inside the stack are removed, not softened.

---

## 5 · Colour roles

```
--ink      #0d1320   primary text            --sheet  #ffffff   surface
--ink-2    #353e4e   secondary text          --well   #eef1f5   sunken
--ink-3    #576070   tertiary / labels       --wash   #f3f5f8   page
--line     #dfe3ea   divider                 --line-2 #e9ecf1   hairline
--brand      #1f5fe0   primary action        --ok      #12704a
--brand-ink  #1747b3   brand text            --danger  #bd3328
--brand-soft #e9f0fe   bulk selection        --signal  #945000
--focal      #172234   dark focal surface (summary cards, selected row)
--focal-ink  #f3f6fb   ink on focal
```

Dark mode is **gated off** (`DARK_ENABLED = false`). Its rules remain in the file behind
`[data-aan-dark]` and are inert. Do not restyle them; do not re-enable without a contrast pass.

---

## 6 · Active and selected — five states, five means

This is the part that most easily collapses into "everything is blue". It must not.

| state | how it is shown | |
|---|---|---|
| primary action | solid `--brand` fill | `Edit vehicle` |
| current view / lane | **white thumb on a sunken track** | segmented controls, lane rail |
| current nav section | tinted, no fill | top navigation |
| **open for inspection** | dark `--focal` surface, on-dark ink | the selected row |
| **bulk selected** | `--brand-soft` tint | checkbox rows |

Only one of the five is a blue fill.

"Open for inspection" and "bulk selected" must never look alike — they are different questions
("which one am I reading" vs "which ones will this action hit") and they co-occur.

---

## 7 · Sticky stack

```
--stick-bar  68px      platform bar
--stick-cmd  72px      command band
--stick-hd   52px      column header
--stick-total = 68 + 72 + 52 = 192px
```

**CSS publishes the geometry; JS reads it.** Never hardcode the stack in script.

Custom properties are substituted but not *evaluated*: `getPropertyValue('--stick-total')` returns
the literal text `calc(68px + 72px + 52px)` and `parseFloat` gives `NaN`. Read the three plain
values and sum them.

`--stick-cmd` is load-bearing: the command band's vertical padding is `8 + 56 + 8`. Changing that
padding changes `--stick-total`, which changes the anchor.

Engaged state is published in three places by one scroll handler: `.cmd--stuck`, `.hd--stuck`,
and `#app.is-stuck` — the last because the platform bar is a *sibling* of the field and cannot
see the band in the selector tree.

At 1366×768 the engaged stack is 25% of the viewport; at 1366×610 it is 31%. Both usable. The
at-rest stack is 608px because of the bento, which scrolls away.

### Z-index ladder — no component writes a raw z-index

```
--z-ground 0 · --z-content 1 · --z-raised 3 · --z-sticky-hd 10
--z-sticky-cmd 12 · --z-platform 20 · --z-tray 30 · --z-menu 40
```

Content travels **under** chrome. An expanded row paints below the command band and the column
header — which is what made hiding the header (`hd--veil`, deleted) look necessary.

---

## 8 · Contextual in-flow expansion + the selected-row anchor

The shipped interaction, restored and generalised. **Do not replace it with a modal, a popover,
a drawer or `scrollIntoView({block:'center'})`.**

**Anchor**

```
y = rowTop + scrollY − (--stick-bar + --stick-cmd + --stick-hd) − --anchor-gap
                        68     +   72     +   52        +   10      = 202px
```

`--anchor-gap: 10px` is off the 8pt scale deliberately: it is the measured value All Leads has
shipped for years (`− 56 − 58 − 48 − 10`). Adopt it; do not round it to 8 for tidiness.

Measured deviation from the 202px target: **−0.67px to 0**, at 1280 / 1366 / 1440 / 1920, in both
travel directions, under reduced motion, and with the dock open.

**Document extender** — `#exp-space` is a zero-height block after the list that JS grows by
exactly the shortfall when the anchor target is past the end of the document. Without it the last
rows can never reach the anchor. It is load-bearing; do not delete it because it measures 0.

**Expansion**

- `position: static`, in flow, reserves its own height
- shares the row's left and right edges exactly (delta 0 / 0)
- seam to the row: **0**
- covers **0** sibling rows; dims **0** unrelated rows
- one hairline (`inset 0 0 0 1px var(--line)`), no elevation, no radius at the seam
- closing does **nothing** to the scroll position
- switching vehicles is an ordinary open of another row — no `setTimeout` choreography

---

## 9 · Detail architecture — a vertical stacked accordion

Inside the selected-vehicle workspace, in this order:

**Merchandising Health → Market Intelligence → Specification → History**

- one column, **full sheet width**, one after another
- each opens and closes independently; **any number may be open at once**
- Health opens by default and can also be closed
- no 2×2 grid, no section rail, no tabs, no column teleporting
- ATTACHED to each other: no radius between sections, one hairline between them, no shadow
- opening a region pushes the ones below it down and moves nothing above it (measured delta 0)

Section header: `min-height 52px`, label left, one-line verdict right, restrained chevron. The
verdict stays legible while the region is open — a stack of four is read as a whole.

**Workspace composition:** an object header (photograph | identity, figures, actions) and then the
region stack across the full width. The header band is as tall as its taller column and never
shorter than 264px, so neither side leaves a hole.

---

## 10 · Tables and lists

Row height `--row: 74px`. Columns are a named grid on `.field`:

```
--cols: 26 92 104 46 104 minmax(100,1fr) 84 92 118 80 218 76 108
         ck  th stk  yr  mk   model      trim ext price st health age acts
```

**No column in this table is `position: sticky`.** There is no frozen rail, so do not paint one.
The grey band that used to run down the HEALTH column was a background on the header cell plus a
background on every row's tag cell; it signalled a behaviour the table does not have and made the
column that usually reads "OK" the loudest thing in the row. It is gone.

Price · Status · Health · Age · Actions **are** a group — what you act on, rather than what you
identify the car by. The group is marked by **one divider where it begins** (`inset 1px 0 0
var(--line-2)` on `.hd > .c-price` and `.row > .price`) and nothing else.

Header cells are addressed by **semantic class** (`.c-price`, `.c-status`, `.c-health`), never
`nth-child`.

---

## 11 · Buttons and control geometry

**Radius: buttons are pills (`--r-pill`), without exception.** Measured across all ten pages; the
one outlier at 14px was corrected rather than documented. `--r-control` is for inputs and fields.

**Height is set by density class, not by one global value.** Forcing a single height would break
either the dense staff tables or the roomy dealer sheets. Three tiers, measured in use:

| tier | height | where |
|---|---|---|
| compact | 28–32px | in-row and in-table actions (Accounting's per-row Pay, Single Ticket's inline actions) |
| default | 36–40px | page and section actions (most staff pages, Single Vehicle) |
| prominent | 44–48px | the primary action of a dealer sheet, and the login submit |

Within one page and one tier the height must be identical; across pages it follows the density of
the surface. Icon-only buttons take the square of their tier.

- one height per class of control within a page — 40px for sheet actions
- buttons are sized by their label; do not stretch to fill a wide band
- `var(--s2)` 8px between neighbours
- a **segmented control** is one object: a sunken track, `--r-pill`, 5px padding, 2px internal
  gap, and a white thumb for the active segment. Anything that is not segmented gets real
  separation
- **destructive**: `--danger` text, `--danger-soft` hover, and `margin-left: auto` so it sits at
  the far end of the group and cannot be hit on the way to something else. Distinguishable, not
  theatrical
- no shadow collision, no clipped focus ring, no arbitrary radius mismatch

---

## 12 · Focus

Focus owns `outline` and nothing else owns it.

```
--focus-w 2px · --focus-offset 2px · --focus-color #1f5fe0
--focus-color-on-dark #ffd98a   (focal surfaces, tray)
```

It used to ride on `box-shadow`, a single-slot property every decorative shadow overwrote. Never
put focus back on `box-shadow`. Never clip it with `overflow: hidden`.

---

## 13 · Provenance — the demo rule

Fabricated or unconnected data must say so **before** the reader has to decide whether to believe
it, not after.

- the `Demo` chip sits in the region header, beside the title
- a not-connected source line precedes its visualisation — Market Intelligence states
  `visor.vin market data · not connected` above the price distribution, not under it
- never add a `Demo` chip to a region whose provenance has not been assessed, and never invent
  replacement provenance

---

## 14 · Motion

`--dur 160ms` · `--dur2 240ms` · `--ease cubic-bezier(.2,0,0,1)`.

Transitions are for disclosure and state, not for arrival. No `setTimeout` choreography — it pays
for an exit on an element the next render destroys. Under `prefers-reduced-motion` the anchor
lands at the same place instantly (`behavior: 'auto'`).

---

## 15 · Responsive — desktop only

Verified at **1280×720 · 1366×768 · 1440×900 · 1920×1080**, plus a 1366×610 height stress.

1366 is the binding width. One breakpoint, `@media (max-width: 1400px)`. Zero horizontal overflow
is a hard requirement in every state, including filters-open and vehicle-open.

Do not compact the UI to fit; use the 8 / 16 / 24 / 32 relationships and let the flexible column
absorb the difference.

---

## 16 · Future — user-controlled columns

**Researched, deliberately not built.** The base table must be correct before users are given
tools to repair it by hand.

| column | track | priority | could hide |
|---|---|---|---|
| checkbox | 26px fixed | structural | no |
| thumbnail | 92px fixed | high | yes |
| Stock | 104px fixed | **must remain** | no |
| Year | 46px fixed | high | no |
| Make | 104px fixed | **must remain** | no |
| Model | `minmax(100px, 1fr)` | **must remain** — the only flexible track | no |
| Trim | 84px fixed | medium | yes |
| Colour | 92px fixed | low | yes |
| Price | 118px fixed | **must remain** | no |
| Status | 80px fixed | high | yes |
| Health | 218px fixed | high | yes |
| Age | 76px fixed | high | yes |
| Actions | 108px fixed | **must remain** | no |

**Health is 218px because of its worst case, not its usual one.** Most rows read "✓ OK"; a bad
row reads `NO PRICE · NO PHOTOS · +2`. Narrowing it truncates operational signal. It is the single
best candidate for a user-controlled width.

Recommended order if this is built: (1) show/hide for the four "could hide" columns, (2) persisted
per-user configuration, (3) drag-resize last — resize is the most expensive and the least
valuable of the three. Frozen columns should only be introduced together with resize; faking a
frozen rail with a background is what Phase 1 had to undo.

---

## 17 · Code quality rules

- named tokens, never magic numbers scattered across rules
- derived sticky geometry — CSS publishes, JS reads
- explicit state classes (`.cmd--stuck`, `.hd--stuck`, `#app.is-stuck`, `.acc--open`)
- CSS-driven layout; JS sets state, not position
- no giant override blocks; when a rule must beat an existing one, **match its specificity and say
  why in a comment** — `.exp .exp__accs .acc__h` is (0,3,0) and silently outranks `.exp .acc__h`
- `overflow: hidden` only where clipping is actually intended (the photo crop), never to hide a
  layout bug
