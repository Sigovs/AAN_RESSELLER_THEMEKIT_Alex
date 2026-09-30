# NEVER DO THIS IN GEN 11

Every entry was built at some point in Gen 11, shipped, was caught, and had to be
undone. The evidence column says where, so none of this reads as opinion.

---

## Surfaces

### ❌ NO giant white slabs
A section does not become a card because it needs separating.
**Evidence:** the record pages ran ~3,300px of unbroken white with five
identically weighted titles — 3,857px of document, five sections, zero tonal
change. Read as "one bedsheet".
**Instead:** tonal rhythm, a full-bleed boundary, a counted head. No new rectangle.

### ❌ NO card inside a card without a real layer reason
**Evidence:** the login page used `.field` for its form-row wrappers, which
collided with the family's `.field` (the working surface) — every row drew a white
card behind a text input.
**Instead:** name your wrapper something the system does not already own.

### ❌ NO giant empty grey cavity
A half-empty card is the same failure as a slab.
**Evidence:** Single Ticket's dark summary (≈150px of content) sat beside a 277px
panel. Centring the content made two holes; pushing it down made one; spreading it
through the tiles made five.
**Instead:** let each card take its own content height; the leftover is page
ground, which is air.

### ❌ NO rounded card touching another rounded card
### ❌ NO fake gap made from a background sliver
### ❌ NO hanging or clipped side ears
### ❌ NO shadow sandwich
Decide attached or floating (RULES §2) and commit to it.

### ❌ NO `overflow: hidden` on a sheet that contains a sticky child
**Evidence:** it makes the sheet a scroll container, which pushed the section band
down by its own `top` and then stopped it sticking — 56px of dead white above the
band on Single Ticket.
**Instead:** `overflow: clip`.

---

## Spacing

### ❌ NO random padding
**Evidence:** `.btn--sheet` renders with `0 8px`, `0 11px` and `0 14px` across
three pages.
**Instead:** the scale, and the right inset role (16 structural / 12 control).

### ❌ NO text glued to a surface edge
Every text-bearing surface carries an inner inset.

### ❌ NO buttons touching
No 1px/2px/3px gaps, no negative margins to fake grouping. 8px minimum.

### ❌ NO bottom-aligned text in a control
**Evidence:** the table header was `align-items: end`, so one-line labels sat on
the hairline while two-line labels floated above it.
**Instead:** centre it.

### ❌ NO sweeping a component into a blanket layout rule without checking what it is
A rule that sets `display` on a list of classes changes the layout model of every
one of them. Twice now that has broken a component that was already correct.
**Evidence 1:** `.seg__b` is `inline-grid; place-items: center`. A blanket
`inline-flex; align-items: center` rule kept the vertical centring and discarded
the horizontal — every icon sat against the left edge of its slot.
**Evidence 2:** `.mn__it` is a full-width row. The same rule made it
`inline-flex`, so every menu laid out on one line — All Leads' bulk-assign menu
became a single **2426px** row, **1662px** past the workspace clip, and eleven of
its fourteen dealers were unreachable.
**Instead:** a shared rule may set colour, type and spacing freely; it sets
`display` only on components you have checked are the same kind of object.

---

## Shape and colour

### ❌ NO pill soup
Pills are for status chips and true capsules. Not toolbar buttons, not navigation,
not filters, not titles, not actions.

### ❌ NO random radii
Eight semantic roles exist. `--r-pill` on a structural element and `--r-card` on a
control are both defects.
**Evidence:** `.search` carries a 14px surface radius on one page.

### ❌ NO random shadows
Seven depth tokens exist, all blue-cast. A neutral grey shadow reads as a
different system.

### ❌ NO blue that is not a link or "you are here"
**Evidence:** ~370 blue numerals on one My Work Queue screen, which left the 94
real ticket links with nothing to distinguish them.

### ❌ NO light hover on a dark surface
**Evidence:** `button.tile:hover { background: var(--wash) }` outranked
`.tile--on:hover` by specificity and turned the page's one dark card into a pale
slab with near-white text — **1.2:1**.

### ❌ NO uncontrolled typography or icon sizes
Ten measured roles exist (TOKENS §2.1). Icons are 12 / 14 / 16px by context.

---

## Navigation

### ❌ NO legacy blue underline tabs
Not on the platform bar, not on a view track, not on a section nav. The family
rule that produced them was deleted; do not reintroduce it.

### ❌ NO sunken well around a long view track
**Evidence:** twelve lanes in a sunken track produced a 1250px grey bar — a rounded
container full of rounded containers, and the heaviest object on a page whose
subject is the list below it.
**Instead:** no track; only the current lane is an object.

### ❌ NO filter dressed as navigation, and no view dressed as a filter
Four distinct concepts, four treatments (RULES §5).

### ❌ NO section nav pretending to be tabs
If the content all stays in the document, the control moves the scroll.

---

## Tables

### ❌ NO fixed grid template with `0px` tracks for hidden columns
**Evidence:** the pre-11.1 All Vehicles template padded hidden columns to `0px`
and kept their cells in the DOM.
**Instead:** derive the template from the visible columns.

### ❌ NO fake frozen columns and NO fake rails made from background strips
### ❌ NO rows-as-cards conversion
### ❌ NO horizontal scrolling
**Evidence:** the go-live strip scrolled sideways with a scrollbar mid-chrome and a
sticky label sitting on top of the first dealer.
**Instead:** show what fits and count the rest in the label.

### ❌ NO clipped chips
**Evidence:** 4 of 16 Health cells overflowed at ≤1400; the worst needed 241px
against a 180px cell.
**Instead:** tighten the chip's own fitting first, then take the difference from
the flexible column so the row still sums to the same width.

---

## Interaction

### ❌ NO arbitrary centre `scrollIntoView`
A selected row rests at `stack + anchor-gap`, a named position.

### ❌ NO dimming of unrelated rows
### ❌ NO floating save CTA where a sticky save bar is the pattern
### ❌ NO guessed reserved height for fixed chrome
**Evidence:** the page reserved a hard-coded 84px against bars that measure 48px
and 52px.
**Instead:** measure the bar, publish `--savebar-h`, re-measure on resize.

### ❌ NO menu that sizes to `max-content`
**Evidence:** with no `max-width`, a menu grew to its longest label and the
workspace clipped the overflow.
**Instead:** `.pop { max-width: min(420px, calc(100vw - --s6)) }`, and flip the
anchor side when the panel would overflow its workspace.

### ❌ NO popover that cannot be reached
**Evidence:** at 1366×610 the panel ran past the bottom edge and Reset was
unreachable; a first attempt at `position: fixed` was captured by a
`backdrop-filter` ancestor and positioned against the toolbar instead of the
viewport.
**Instead:** measure both sides, flip, cap the height, scroll only the inner list,
and move the element to `<body>` while open.

---

## Process

### ❌ NO copying old backend visual styling
The export is authoritative for **content, fields, features, workflow, labels and
actions** — and for nothing visual.

### ❌ NO feature invention while reskinning
If it was not in the export, it does not appear because the layout looked empty.

### ❌ NO "generated" decorative slab
An element that exists because a region looked bare has no rank and dilutes
everything around it.

### ❌ NO silent normalisation of an inconsistency
If two pages disagree, decide whether it is a **role** or a **defect**, write it in
the exceptions register, and change it in a deliberate pass — not during an
unrelated one.
