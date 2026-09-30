# AAN Gen 11 — Implementation Rules

Rules, not advice. Each one is written because the opposite was built at some
point in Gen 11 and had to be undone. Where a rule has an exit, the exit is
stated; where it has none, it has none.

---

## 1 · Spacing

### R1.1 — Every spacing value is on the scale

`4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64` (`--s1`…`--s9`).

There is no 20, no 28, no 36 step. A value off the scale is a defect unless it is
in the exceptions register (§10).

### R1.2 — Two insets, and they are not interchangeable

- **Structural inset — 16px** (`--inset`, `--sheet-inset`, `--gutter`): sheet edge
  to content, toolbar padding, table row padding, page gutter.
- **Control inset — 12px** (`--inset-ctl`): text inside a chip, a view item, a nav
  item, a select.

A control padded to 16 looks inflated. A table row padded to 12 looks cramped.

### R1.3 — A break between blocks exceeds the gap inside a block

Measured and set on the record pages:

| Joint | Value |
|---|---|
| chrome → page identity | 16px |
| inside a block | 16px |
| block → block | **24px** |

If the break equals the internal gap, the break communicates nothing. This was the
actual defect on the record pages: the module cleared the sheet by 16px — the same
16px it used between its own cards.

### R1.4 — Nothing touches

No two elements meet unless the pattern names them as one compound control.

- minimum air between adjacent controls: **8px**
- no 1px, 2px or 3px accidental gaps
- no negative margins used to fake grouping
- every text-bearing surface has an inner inset; text never meets an edge
- fixed chrome is a boundary: content stops short of it or it clears the content

**Exit:** a deliberately joined control group (a segmented track), which shares a
structural edge and is documented as one control.

### R1.5 — Vertical centring, always

Text inside a pill, chip, badge, button, lane, nav item or table-header cell is
optically centred on its box. Never bottom-aligned, never baseline-aligned inside
a control.

**Two components are exempt from the blanket `inline-flex` treatment, and both
exemptions are load-bearing:**

- `.seg__b` centres with `display: inline-grid; place-items: center`. Flattening
  it to `inline-flex` with `align-items` alone keeps the vertical centring and
  throws away the horizontal — every icon ends up against the left edge of its
  slot.
- `.mn__it` is a **full-width row** in a column of choices. `inline-flex` laid
  every menu out on one line; All Leads' bulk-assign menu became a single 2426px
  row and the workspace clip made eleven of its fourteen items unreachable.

**The general rule:** vertical centring is applied to *inline* objects. Before
adding a class to that list, check whether the component is a row, a grid or a
full-width control — if it is, give it its own rule instead.

---

## 2 · Surfaces — the attached / floating contract

### R2.1 — Decide which one it is, then commit

**ATTACHED** — the thing is part of the surface beneath it:
- shares a structural edge, no gap
- square corners on the joined edge
- **no shadow between attached surfaces**
- separation carried by a hairline (`--line-2`) or a change of ground

**FLOATING** — the thing sits above its surroundings:
- a real gap on every side
- complete radius (`--r-card` 14px)
- one restrained shadow (`--sh-soft`, `--el-1`…`--el-3`)
- a clear layer on the z ladder

### R2.2 — Never build these

- a rounded card touching another rounded card
- a fake gap made from a background sliver
- a hanging or clipped side "ear"
- a button visually glued to the panel it belongs to
- a shadow sandwich — two shadowed surfaces stacked with no ground between

### R2.3 — Clipping a sheet uses `clip`, not `hidden`

`overflow: hidden` on a working surface makes it a **scroll container**, and a
scroll container that is also the containing block pushes its own sticky child
down by its `top` and then refuses to let it stick. This put 56px of empty white
above the section band on Single Ticket. Use `overflow: clip`.

Consequence: a popover that must escape the sheet cannot rely on `position: fixed`
either — the command band carries a `backdrop-filter` and becomes the containing
block. Move the element to `<body>` while it is open.

---

## 3 · No white slabs

### R3.1 — A light surface must have a named role

Permitted roles: table sheet · form sheet · toolbar · reading surface · explicit
panel · floating surface.

**A section does not become a card because it needs separation.**

### R3.2 — Separate with rhythm, not with another rectangle

In order of preference:
1. tonal rhythm — alternating ground between chapters
2. a full-bleed rule on the boundary
3. typographic hierarchy and a counted head
4. spacing that makes the break larger than the internal gap

Gen 11's own worked example: the record pages ran ~3,300px of identical white with
five equally weighted titles. The fix added no card — it alternated the ground,
made the boundary a full-bleed rule, numbered the chapters and gave the live
chapter the one warm ground on the page.

### R3.3 — No giant empty grey cavity either

A card that is half empty is the same failure as a slab. On Single Ticket the dark
summary sat beside a taller panel; every attempt to reconcile them put the slack
somewhere (centred → two holes; bottom → one hole; spread → five holes). The
answer was to stop reconciling: each card takes the height of its own content and
the leftover is page ground, which is air rather than an empty card.

---

## 4 · No pill soup

### R4.1 — `--r-pill` is for status, not for structure

Legitimate pill users:
- status chips and tags (`.bdg`, `.tag`)
- a true compact state indicator

**Not** pills: toolbar buttons, navigation, filters, card titles, actions, section
heads. Those take `--r-inner` 7px or `--r-control` 9px.

### R4.2 — Locked or fixed facts are stated, not offered

A thing the user cannot change is not a disabled control. In the Columns panel the
five locked columns are one line of text — *Always shown: Stock · Make · Model ·
Price · Actions* — not five dead switches.

---

## 5 · Navigation, view, filter, section — four different things

| Concept | Question it answers | Treatment |
|---|---|---|
| **Platform nav** (`.nav__b`) | which area of the product | ink by default; current gets `--brand-soft` fill + `--brand-ink` |
| **View / lane** (`.ui-views`) | which view of this list | raised light thumb on **no** track; only the current item is an object |
| **Filter** (`.ui-filters`) | which records are visible | chips on the ground with a caps key; must not read as navigation |
| **Section nav** (`.ui-nav`) | where in this record | inset pill, soft brand fill, no stripe |

### R5.1 — No legacy blue underline tabs

Not on the platform bar, not on a view track, not on a section nav. The rule that
produced them has been removed from the family layer; do not reintroduce it.

### R5.2 — Section nav does not pretend to be tabs

If all the content stays in the document, the control **moves the scroll**. It
does not hide the other sections.

---

## 6 · Buttons

- one primary per group; a second primary means neither is
- 8px between adjacent buttons; never less
- tier follows context: dense 30 in a row or a compact bar, standard 36 in a
  toolbar, large 44 only for a form's own submit
- a toggle is a button with `.btn--on`, not a tab
- a destructive action is `--danger` ink on a light surface; it is never the only
  coloured thing on the screen
- a primary on a dark bar keeps **light** ink, including when disabled

---

## 7 · Colour discipline

### R7.1 — Blue means link, or "you are here"

Nothing else. Not a numeral, not an editable value, not a date. ~370 blue numerals
once sat on My Work Queue and the 94 real ticket links had nothing to distinguish
them.

### R7.2 — A dark surface stays dark on hover

A generic `button:hover { background: var(--wash) }` will, by specificity, reach
the one dark card on the page and turn it into a pale slab with near-white text —
1.2:1, the whole card gone. Scope hover rules away from `--on`/dark variants.

### R7.3 — Contrast floor

Body and control text: **4.5:1** against its **composited** background, not
against the token it was authored for. Check the rendered pixel.

---

## 8 · Sticky and layers

- the stack is declared in tokens and **derived**, never copied:
  `--stick-hd-top: calc(56px + 56px)`
- All Vehicles stacks 56 + 56 + 40 = **152px**, with a **10px** selected-row anchor
  gap; verified anchor error 0px
- a selected row comes to rest at `stack + anchor-gap`; it is not centred with
  `scrollIntoView`
- no dimming of unrelated rows
- a save footer is **attached**: full-bleed, flush to the bottom, square, top
  hairline; the page reserves its **measured** height (`--savebar-h`), not a
  guessed one. No floating save CTA where a sticky save bar is the pattern.

---

## 9 · Responsive

Verified widths: **1280 · 1366 · 1440 · 1920**, plus short viewport **1366×610**.

- page gutter stays **16px** at every width
- **no horizontal scrolling anywhere.** A strip that cannot fit shows what fits and
  counts the rest in its label; a track wraps; a table's columns re-derive
- the tier boundary in the current implementation is **1400px** — not the 1320 an
  inner comment claims. The row gap steps 8 → 6 on the same line
- nothing may be clipped at the resting viewport edge
- a popover must remain fully reachable at 1366×610

---

## 10 · Exceptions register

Real inconsistencies in the current build. Documented so they are not mistaken for
intent, and not silently redesigned.

| # | Exception | Where | Status |
|---|---|---|---|
| E1 | `--anchor-gap: 12px` instead of 10px | Single Ticket | unresolved |
| E2 | `.btn--primary` renders white, not brand | Accounting | mis-classed button |
| E3 | `.ck` radius 0 | Single Ticket | drift |
| E4 | `.bdg` height 12px | Manage Dealers | below the readable floor |
| E5 | `.search` radius 14px (a surface radius on a control) | All Vehicles | drift |
| E6 | Section title at 19px and 15px | two pages | drift from the 17/650 role |
| E7 | `--r-s`/`--r-inner` and `--r-card`/`--r-l` are aliases | shared layer | deprecate the `-s`/`-l` names |
| E8 | `--ctl-h: 40px` is a fourth, unnamed tier | shared layer | role; should be named `--ctl-field` |
| E9 | Health chips overflow at ≤1400 before the Gen 11.1 fix | All Vehicles | **resolved** in 11.1 |

**None of these were "fixed" during extraction.** Changing them is a separate,
deliberate pass.
