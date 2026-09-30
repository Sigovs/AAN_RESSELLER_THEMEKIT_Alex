# Gen 11 catalogue — visual QA

Produced by `_tools/qa.html`, which loads each specimen host into a pixel-exact
iframe at a given width and measures it. The screenshots beside this file are
the same build.

    open  design-system/gen11/_tools/qa.html
    then  await window.sweep(1440)

The iframe is sized in pixels rather than by resizing the browser, because the
browser's own resize applies a 1.25 device scale here — asking for 1440 gives a
1152px viewport, and a 1366 that is really 1093 proves nothing about the 1366
someone uses.

---

## Result

| | 1920×900 | 1440×900 | 1366×900 | 1280×900 | 1366×610 |
|---|---|---|---|---|---|
| horizontal overflow | **0** | **0** | **0** | **0** | **0** |
| specimens bleeding out of their stage | **0** | **0** | **0** | **0** | **0** |
| text flush against a surface edge | **0** | **0** | **0** | **0** | **0** |
| specimens collapsed to nothing | **0** | **0** | **0** | **0** | **0** |
| size drift vs the product | **0** | **4** | **0** | **0** | **0** |
| controls clipped by an ancestor | 4 | 4 | 4 | 4 | 4 |
| functional text under 11px | 1 | 1 | 1 | 1 | 1 |

120 specimens in 10 chapters at each viewport.

1366×610 is the short viewport: a 1366×768 laptop with browser chrome leaves
about 610px of page, which is what the sticky stack has to fit into before the
list gets any room at all. Run it with `await window.sweep(1366, null, 610)`.

The clipped and tiny findings are the **product's**, reproduced faithfully. Each
was checked against the shipped page with the same detector and occurs there
too — they are defects B, C and D below.

Size drift is only checked at 1440×900, the viewport the census was measured
at. At other sizes a difference is the product being responsive, which is the
point. A component whose height comes from the viewport — the workflow dock and
the crew dock are sticky with a `max-height: calc(100vh - …)` — is only held to
its recorded height at that reference; below it the stage reproduces the width
and lets the component be as tall as the viewport makes it.

### What the detector deliberately does not count

Three things look like clipping and are not, and each one was costing false
findings until it was measured rather than assumed:

- **a closed disclosure.** Gen 11 closes an accordion with
  `grid-template-rows: 0fr` over an `overflow: hidden` panel, so its contents
  sit outside a zero-height box. That is what closed means. 9 findings.
- **content inside a scroller.** Once anything between the control and the
  stage scrolls, the control is reachable and nothing above it can clip it
  away. The ticket's crew dock is exactly this: `.dock__b` scrolls 714/1084
  inside an `aside.dock` that does not. 5 findings.
- **the list scrolling sideways.** At 1280 the All Vehicles row is wider than
  the sheet, and Gen 11 scrolls the list rather than dropping a column. That is
  the shipped behaviour, not a bleed. 6 findings at 1280, 3 at 1366.

Both docks were checked directly at 1366×610 before being cleared: the lead's
dock body scrolls 422/673, and scrolling it to the end brings the facts block
fully inside the dock. Nothing in either dock is unreachable.

---

## The four drifts at 1440

    av    Page head      product 1396x32   → catalogue 1396x36   (+0, +4)
    lead  Record head    product 1396x32   → catalogue 1396x36   (+0, +4)
    av    Health tags    product 230x73.2  → catalogue 230.5x67.6 (+0.5, -5.6)
    ticket Dark summary  product 910.6x202.1 → catalogue 911.1x188.3 (+0.5, -13.8)

**The two heads are the product clipping itself.** `--headh` is 68px and `.head`
carries `margin: 12px 0 24px`, leaving a 32px row — but the actions in that row
are 36px buttons. On the shipped page they hang 2px above and 2px below the row.
The catalogue draws the head at the 36px its content actually occupies, so the
buttons are whole. Defect A below.

**Health tags** and **Dark summary** are short by 5.6px and 13.8px, and both
are short for the same reason: **their height is lent by a sibling that is not
in the specimen.**

- `div.focal.slot--pulse` on Single Ticket has 188.3px of its own content. It
  measures 202.1px on the page because `.bento` is a grid whose single row is
  sized by the *other* item in it, `.rail.slot--dealer`, which is 202.1px tall.
  It is also placed by name — its computed `grid-row` is `pulse`, an area that
  exists only on `.bento`'s template.
- `div.tags` on All Vehicles is a cell stretched to the height of the row it
  sits in, which is 74px because of what is in the *other* cells.

Reproducing either number needs the sibling, which means bringing `.bento` or
`.row` along unflattened — and then the specimen is a 1396×218 bento or a whole
table row, not the component the entry is about. The alternative is declaring
the product's grid template inside catalogue CSS, which is the one thing this
architecture exists to avoid.

So they are left short and written down. A 5.6px and a 13.8px difference in
height, with the reason stated, is worth more than a number forced to match by
a declaration that would make every other specimen on the page a little less
trustworthy.

The 0.5px on the last two is the stage's deliberate sub-pixel slack — see the
lane strip note in `_specimen.js`. It is well inside the 2px tolerance.

---

## Known product defects

Found while building the catalogue. **None of these are fixed here** — the brief
for this pass was to record product defects, not to implement them.

### A · the page-head row is 4px too short for its own actions

`--headh: 68px`, and `.head` carries `margin: 12px 0 24px` = 36px, leaving a
**32px** row. The actions in that row are **36px** buttons, so every one of them
hangs 2px above and 2px below the row it sits in.

    pages/dealer/all-vehicles-gen11.css:32     --headh: 68px;
    pages/dealer/all-vehicles-gen11.css:1090   .head { grid-row: 2; display: flex; ... }

Seen on All Vehicles and Single Lead; any page on the same `--headh` ladder has
it. `--headh: 72px` would clear it.

### B · My Work Queue clips the inline edit buttons in two columns

`button.ed` is 5px wider than the `c-beg` and `c-done` cells that hold it, and
those cells are `overflow: hidden`, so 5px of the control is cut at every row.

    pages/staff/my-work-queue-gen11.css   .c-beg, .c-done are 52px and 92px tracks

### C · Accounting clips the primary row action

`button.btn.btn--primary.btn--xs` in `span.c.c-act` starts **4.4px** left of its
cell and is cut there. The cell is 128px and `overflow: hidden`; the control is
50px and does not fit the cell's own inset.

### D · Single Ticket ships 10.5px functional text

`span.kind` in the event list computes to **10.5px**. `RULES.md` publishes an
11px floor for functional text, so the product is below its own rule by half a
pixel. Everything else in all ten pages clears it.

### E · the theme toggle ships hidden on all ten pages

`button.tbtn[data-act="theme"]` carries `hidden` and
`title="Dark theme is being re-solved"` on every Gen 11 page. It is in the
markup and styled, but nothing shows it. The catalogue therefore documents one
of the two utility buttons that do ship — see the note on *Utility button* in
`COMPONENTS.md`.

---

## Files here

| | |
|---|---|
| `00-proof-single-lead-actions-1440.png` | one component, product vs catalogue, 68 computed values compared |
| `01…10-chapter-*-1440.png` | each chapter in full, at 1440 |
| `11-catalogue-index-1440.png` | the catalogue front matter and chapter list |
| `12-catalogue-index-1366.png` | the same at 1366 |
