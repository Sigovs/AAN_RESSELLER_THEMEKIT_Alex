# Gen 11 design system — overnight rebuild, what was done

The product separation repair is committed as **5361e8c**, and the catalogue
below was extracted from exactly that source. The gate table further down was
recorded against the uncommitted working tree the night the rebuild ran; it is
kept as it was, because it is the evidence that nothing in the product moved
while the design system was being built.

---

## The gates first

| | |
|---|---|
| baselined product files with a changed checksum | **0** of 83 |
| final `git diff pages/ index.html` vs the baseline diff | **identical**, 373 lines both |
| files modified outside `design-system/gen11/` | **12** — exactly your separation-repair set, untouched |
| staged for commit | 0 |
| commits made | 0 |
| pushes | 0 |

The baseline is in the session scratchpad: `baseline/pages.md5`,
`baseline/product.diff`, `baseline/status.txt`.

---

## What the catalogue is now

**120 specimens, 10 chapters, every one of them the product's own DOM rendered
by the product's own stylesheets.** Nothing is drawn for the catalogue.

    open  design-system/gen11/index.html

Each chapter is an `<iframe>` onto a specimen host that loads exactly one
page's stylesheet stack, from `pages/`, in the page's own order. Change the
product and the catalogue changes with it — there is no copy to go stale.

### The thing that was actually wrong, and is now fixed

The catalogue rendered the right components at the **wrong sizes**. Measured:
**80 of 120 specimens.** A status chip the product draws at 80px was 1396px
wide. A group of health tags the product wraps onto three lines at 230px was
one line at 1408px.

The cause: almost nothing in Gen 11 sizes itself. A cell is the width of its
grid track, a tile the height of the tallest tile beside it, the global search
the width of its flex basis inside the bar — not the width its own rule
declares. Lifting a component out of its row takes the sizing with it, and the
catalogue has to flatten those ancestors or every specimen is 900px of empty
page grid.

The fix: the extractor records the box each component has on the shipped page,
and the catalogue **stage** stands in for the container that gave it that box.
Four containers are tried per specimen and the one that reproduces the product
is kept; the choice is written onto the element as `data-sp-fit` so you can read
it in devtools. Nothing lands on the specimen itself.

**Drift is now 4 of 120**, all height-only, and two of those four are the
product clipping its own content.

### Six other defects found and fixed in the catalogue

1. **The catalogue was showing an older product.** Specimen hosts linked the
   product stylesheets without the `?v=` cache-buster the pages use, so the
   browser served whatever it had. Caught because the queue's lane strip
   wrapped onto two lines here and one line there. Hosts now carry a build
   stamp on every stylesheet and script.
2. **24 icons did not draw.** The sprite had been copied from one page; the ten
   pages ship ten different sets (34 symbols, 24, 16, 2). Each host now inlines
   its own page's sprite. Zero missing symbols, zero broken images.
3. **Chain wrappers were absorbing the layout.** They are now
   `display: contents` — no box at all, still in the DOM so every scoped
   selector still matches — and their pseudo-elements are suppressed.
4. **The Lead and Contact cells rendered white on white**, because the cells
   were read from the row that the extractor had opened, and an open row is
   dark. The extractor now opens a later row: the cells are read in their
   default state, and the open row is still shown whole as the expansion.
5. **The platform bar showed its scrolled state** as if it were the component.
   The extractor returns to the top before measuring.
6. **Sub-pixel truncation flipped a wrap.** The census rounded boxes to whole
   pixels; the lane strip is 1233.46px and its lanes end at exactly 1233.46, so
   at 1233 the last one wrapped. The census now keeps two decimals.

Also: the commit bar (`position: fixed`) no longer stretches across the whole
catalogue 3000px below where it belongs; the theme toggle, which ships `hidden`
on all ten pages, is no longer presented as a specimen; and the catalogue's own
chrome no longer uses 10.5px type, which broke the 11px floor it publishes.

---

## Visual QA — 1920 / 1440 / 1366 / 1280, plus the short viewport

| | 1920×900 | 1440×900 | 1366×900 | 1280×900 | 1366×610 |
|---|---|---|---|---|---|
| horizontal overflow | 0 | 0 | 0 | 0 | 0 |
| specimens bleeding out of their stage | 0 | 0 | 0 | 0 | 0 |
| **text flush against a surface edge** | **0** | **0** | **0** | **0** | **0** |
| specimens collapsed to nothing | 0 | 0 | 0 | 0 | 0 |
| size drift vs the product | 0 | 4 | 0 | 0 | 0 |
| controls clipped by an ancestor | 4 | 4 | 4 | 4 | 4 |

The inset rule holds at every width on every chapter: **nothing touches an
edge.** That was the complaint that started this, and it is now measured on
every build rather than eyeballed.

Evidence: `reference/final/` — the button proof, ten chapters in full at 1440,
the index at 1440 and 1366, and `QA.md` with the numbers and the defect list.

The measuring harness is `_tools/qa.html`. It sizes an iframe in pixels rather
than resizing the browser, because this machine's browser applies a 1.25 device
scale — asking for 1440 gives you 1152, and a 1366 that is really 1093 proves
nothing.

---

## The Single Lead button proof

`_tools/compare.html?w=1440` renders the action row twice — in the shipped page
and in the catalogue — cropped to the same window, and compares every computed
value.

**68 of 68 identical**, across the row, the primary, the first and last
neutrals, plus the measured pixel separation between adjacent controls.
Screenshot: `reference/final/00-proof-single-lead-actions-1440.png`.

---

## Product defects found — recorded, NOT fixed

Per the brief. Full detail in `reference/final/QA.md`.

**A · the page-head row is 4px too short for its own actions.** `--headh: 68px`
minus `.head`'s `margin: 12px 0 24px` leaves a **32px** row holding **36px**
buttons, so every page-head action hangs 2px above and below its row. All
Vehicles and Single Lead, and any page on the same ladder. `--headh: 72px`
clears it. This is the largest of the four remaining catalogue drifts: the
catalogue draws the head at the 36px its content occupies, so the buttons are
whole there and clipped in the product.

**B · My Work Queue clips its inline edit buttons.** `button.ed` is 5px wider
than the `c-beg` and `c-done` cells, which are `overflow: hidden`.

**C · Accounting clips its primary row action.** `.btn--xs` starts 4.4px left
of `span.c.c-act` and is cut there.

**D · Single Ticket ships 10.5px functional text.** `span.kind`, against the
11px floor the system publishes in `RULES.md`.

**E · the theme toggle ships hidden on all ten pages**, with
`title="Dark theme is being re-solved"`.

---

## The pipeline, so this is maintainable

It is four steps and they are written down in `README.md`:

    1  _tools/extract.html      → reads the ten live pages, writes the census
    2  gen-specimens.js         → writes the ten hosts
       gen-components.js / gen-docs.js / gen-tokens.js → write the documents
    3  dist/build.sh            → the shared bundle + stacks.json
    4  _tools/qa.html           → the width sweep

Step 1 was missing before — the census had been produced by a console script
that existed nowhere. It is now a documented tool with the interaction it
performs, the states it prepares, and the reasons written next to the code.

`dist/aan-gen11.css` carries its provenance header and names the commit it was
cut from — **5361e8c**, the commit that carries the separation repair. It
warns when the working tree is dirty; it is not warning now, because the product
source the catalogue was extracted from is committed. `dist/stacks.json` names
which stylesheets each page archetype loads, in order, for anyone consuming this
outside the repo.

---

## Documents

| | lines | |
|---|---|---|
| `SOURCE-MAP.md` | 3643 | which file styles what, 309 blocks |
| `INVENTORY.md` | 1395 | every reusable element, role, geometry, usage |
| `COMPONENTS.md` | 433 | the index of what the catalogue shows |
| `TOKENS.md` | 335 | 193 custom properties as the pages compute them |
| `PAGE-SPECIFIC.md` | 265 | the 205 families that belong to one page |
| `ANTI-PATTERNS.md` | 247 | what the system refuses, and the product-defect register |
| `RULES.md` | 214 | spacing, separation, surfaces, controls, states |
| `README.md` | 186 | the architecture and the pipeline |
| `MIGRATION.md` | 145 | taking an old backend page to Gen 11, for Ivaylo |
| `PATTERNS.md` | 141 | how the pieces are assembled on a real page |

---

## What I would not claim

Two specimens are short in height and I left them short: the health tags by
5.6px and the ticket's dark summary by 13.8px. I chased both to the bottom.
The dark summary has 188.3px of its own content and measures 202.1px on the
page only because `.bento`'s single grid row is sized by the *other* item in
it; it is also placed by a named grid area that exists nowhere else. The health
tags are a cell stretched to the height of their row. Reproducing either number
needs the sibling, which means showing a whole bento or a whole table row
instead of the component — or writing the product's grid template into
catalogue CSS, which is the one thing this architecture exists to avoid. Both
are in `QA.md` with the measurements and the reason.

Four controls are reported as clipped and one label as under 11px. All five
were checked against the shipped page with the same detector and occur there
too — they are the product's, faithfully reproduced, and they are defects B, C
and D above.

Three categories were cleared rather than counted, each after being measured:
closed accordions (a closed disclosure is not a clip), content inside a
scrolling panel (reachable), and the list scrolling sideways at 1280 (the
shipped behaviour). The two docks were checked directly at 1366×610 — the
lead's dock body scrolls 422/673 and scrolling it to the end brings the cut
content fully inside, so nothing there is unreachable. I had them down as a
defect until I checked.
