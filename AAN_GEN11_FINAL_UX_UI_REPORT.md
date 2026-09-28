# AAN — GEN 11 FINAL UX/UI REPORT

**Date** 2026-09-28 · **Cache key across the family** `202609282140` · **No Git push performed.**

---

## 1 · Files created and changed

**Created**

| file | |
|---|---|
| `DESIGN.md` | the design system, extracted from the running implementation |
| `pages/dealer/dealer-login-gen11.{html,css,js}` | Dealer Login |
| `pages/dealer/all-leads-gen11.{html,css,js,data.js}` | All Leads |
| `pages/dealer/single-lead-gen11.{html,css,js}` | Single Lead |
| `pages/dealer/single-vehicle-gen11.{html,css,js,data.js}` | Single Vehicle |
| `pages/staff/my-work-queue-gen11.{html,css,js,data.js}` | My Work Queue |
| `pages/staff/single-ticket-gen11.{html,css,js,data.js}` | Single Ticket |
| `pages/staff/manage-dealers-gen11.{html,css,js,data.js}` | Manage Dealers |
| `pages/staff/dealer-edit-gen11.{html,css,js,data.js}` | Dealer Edit |
| `pages/staff/accounting-view-all-gen11.{html,css,js,data.js}` | Accounting — View All |
| `reference/gen11-visual-system/` | sweep script + 10 screenshots |
| `reference/gen11-family-final/` | cross-page probe + 27 screenshots |

**Changed**

- `pages/dealer/all-vehicles-gen11.{html,css,js}` — the Phase 1 visual-system pass (CSS 2 865 → 3 296 lines)
- `index.html` — Gen 11 promoted to the top of the catalogue

**Not touched:** every `*-gen10.*` file, the production export, `.claude/settings.json`.

---

## 2 · Pages completed

All ten. Every one verified in a real browser, not just in code.

| # | page | file | evidence |
|---|---|---|---|
| 1 | Dealer Login | `pages/dealer/dealer-login-gen11` | reveal toggle works, aria tracks |
| 2 | All Vehicles | `pages/dealer/all-vehicles-gen11` | the reference implementation |
| 3 | Single Vehicle | `pages/dealer/single-vehicle-gen11` | 12 zones, 456 fields, edit lock, per-field history |
| 4 | All Leads | `pages/dealer/all-leads-gen11` | 70 rows, anchor −0.4px, 0 dimmed |
| 5 | Single Lead | `pages/dealer/single-lead-gen11` | 5 anchors, **0 tabs**, navigator lands at exactly 134px |
| 6 | My Work Queue | `pages/staff/my-work-queue-gen11` | 94 rows, 16 columns, **0 mid-word breaks in 467 cells** |
| 7 | Single Ticket | `pages/staff/single-ticket-gen11` | thread, crew, 8 todos, changelog |
| 8 | Manage Dealers | `pages/staff/manage-dealers-gen11` | 365 rows, 13 columns, 0 sticky cells |
| 9 | Dealer Edit | `pages/staff/dealer-edit-gen11` | 105 fields, 7 zones |
| 10 | Accounting — View All | `pages/staff/accounting-view-all-gen11` | 205 billable, 440 of 636 numeric cells tabular |

## 3 · Blocked / deferred

**Nothing is blocked.** One interruption is worth recording because it shaped how the work was done:

six parallel build agents were terminated mid-run by an account session limit (HTTP 429). Their files
had already been written and were verified intact — JS parses, CSS braces balance, HTML closes — but
their own verification passes never ran. **I re-verified all eight of their pages myself**, which is
where the numbers in this report come from. Two of them needed small corrections (§6).

Deferred by decision, not by obstacle:

- **User-controlled columns** — researched and documented (`DESIGN.md` §16), deliberately not built.
- **Dark mode** — stays gated off across the family.
- **Row disclosure semantics** on All Vehicles (`role`, `aria-expanded`, Space) — carried forward from the Stage 2 verification.

---

## 4 · All Vehicles visual fixes

Measured before and after at 1280 / 1366 / 1440 / 1920.

| | before | after |
|---|---|---|
| sticky layer insets | 16 / **26** / 16 | **16 / 16 / 16** |
| seam: platform bar → command band | 24px radius pressed into a flat surface → light holes | **0**, corners squared |
| seam: command band → column header | 0 | **0** |
| shadows inside the stack | 3, overlapping | **1**, at the bottom edge only |
| translucency | .76 / .88 / 1.0 — read as banding | **one glass value, .94** |
| HEALTH column | grey slab down the whole list | **removed** — no column is sticky, so nothing pretends to be |
| operational column group | unmarked | **one divider** at Price |
| workspace void | **234px** | **0** in every state |
| workspace region width | two thirds of the sheet | **full sheet width** |
| action buttons | 7 pills at 275px each | sized to label, 8px apart, destructive last |
| off-scale spacing declarations | **114** | **1** (`--anchor-gap: 10px`, deliberate) |
| horizontal overflow | 0 | **0** |
| selected-row anchor | −0.4px | **−0.4px** (unchanged, as required) |
| sticky stack total | 192px | **192px** (unchanged — the anchor depends on it) |

### Detail IA — changed to a vertical stacked accordion

Per the mid-pass instruction, the four regions are now independently collapsible again, but in the
stacked form, never the 2×2 grid:

- **Merchandising Health → Market Intelligence → Specification → History**, one column, full width
- Health open by default and closable like the rest; any number may be open at once
- opening a region moves nothing above it (measured **delta 0**) and pushes what is below by exactly
  its own growth
- attached to each other: no radius between sections, one hairline, no shadow
- header height 52px on all four; the one-line verdict stays legible while open

---

## 5 · Sticky / surface system

The rule, now written into `DESIGN.md` §2 and applied on every page:

**ATTACHED** — touching corners square · one shared edge as a single hairline · no shadow between ·
one inset · no gap, real or implied.
**FLOATING** — a visible gap on every side · its own complete radius · one restrained shadow · never
intersecting another rounded surface.

On All Vehicles the platform bar, command band and column header are one attached surface while
engaged; the field, dock, tray and menus float. Hairlines inside the stack are drawn with
`box-shadow: inset`, never `border`, because a border would add a pixel to a layer whose height
`--stick-total` depends on.

**One intentional exception, documented:** with the dock open, the platform bar stays full width
while the field narrows. The bar is the application boundary; the field and the dock are two floating
panes beneath it, separated by one `--gutter`. That is the layout, not a seam.

---

## 6 · 8pt spacing system

```
--s1 4 · --s2 8 · --s3 12 · --s4 16 · --s5 24 · --s6 32 · --s7 40 · --s8 48 · --s9 64
--gutter / --sheet-inset 16 · --col-gap 8 · --exp-detach 8 · --anchor-gap 10 (off-scale, see below)
```

Normalisation applied across the family: **127 authored declarations** moved onto the ladder — 113 on
All Vehicles, 7 on Single Vehicle, 7 across the six other pages. The agents had largely followed the
system already; the residue was 9 / 11 / 13 / 14 / 18 / 20 / 26px.

`--anchor-gap: 10px` is the one deliberate exception. It is the measured value All Leads has shipped
for years (`− 56 − 58 − 48 − 10`); rounding it to 8 for tidiness would move a position users know.

After normalisation the sticky stack still measures 68 / 72 / 52 = **192**, the row is still 74, and
the anchor is still −0.4. The ladder was applied without moving anything load-bearing.

---

## 7 · Active / selected hierarchy

Five states, five different means — only one is a blue fill:

| state | how it is shown |
|---|---|
| primary action | solid `--brand` fill |
| current view / lane | white thumb on a sunken track |
| current nav section | tinted, no fill |
| **open for inspection** | dark `--focal` surface, on-dark ink |
| **bulk selected** | `--brand-soft` tint |

Two changes made this true: the view switcher's active segment lost its blue fill and 22px glow in
favour of a white thumb, and the bulk-selected row lost its 3px brand stripe — the `--brand-soft`
fill already said it, and a left stripe is the most template-looking shape in the catalogue.

---

## 8 · Table and frozen-column treatment

**There is no frozen rail, because no column is `position: sticky`** — verified on All Vehicles (0 of
13), My Work Queue (0 of 16) and Manage Dealers (0 of 13). The grey band that used to run down the
HEALTH column was a background on the header cell plus a background on every row's tag cell. It
signalled a behaviour the table does not have and made the column that usually reads "OK" the loudest
thing in the row.

Price · Status · Health · Age · Actions **are** a group — what you act on rather than what you
identify the car by — so the group is marked by one divider where it begins and nothing else. Header
cells are addressed by semantic class (`.c-price`, `.c-status`, `.c-health`), never `nth-child`.

**HEALTH stays 218px.** Most rows read "✓ OK"; a bad row reads `NO PRICE · NO PHOTOS · +2`. The width
is sized for the worst case, and narrowing it would truncate operational signal. It is the single best
candidate for a user-controlled width (§17).

---

## 9 · Button and control geometry

- one height per class — 40px for sheet actions
- buttons sized by their label; never stretched to fill a band
- `--s2` 8px between neighbours
- a segmented control is **one object**: sunken track, pill radius, 5px padding, 2px internal gap,
  white thumb for the active segment. The eight "collisions" the sweep reported were all inside
  segmented groups — the view switcher and the pagination — which is correct, not a defect
- destructive: `--danger` ink, right-aligned to the end of the band. A fixed gap with a divider was
  tried and rejected — when the row wraps at 1366 the divider survives onto the next line with
  nothing beside it

---

## 10 · DESIGN.md

Seventeen sections, written **from** the implementation rather than ahead of it: spacing, surfaces,
radius, elevation, colour roles, active/selected logic, the sticky stack and its derived offsets, the
z-index ladder, the anchor contract, detail architecture, tables, buttons, focus, the demo/provenance
rule, motion, responsive rules, and the column-architecture research.

Every number in it was read out of the running page. Where a value looks arbitrary, the note says
what it is load-bearing for.

---

## 11 · Per-page migration summary

**Dealer Login** — production front door. Marketing panel and support block as one dark focal pane,
the form as a floating sheet. The dark-mode toggle was **not** carried over: Gen 11 ships with dark
gated off.

**All Leads** — kept its already-good in-flow expansion and re-derived it on the Gen 11 contract.
Fixed: `hd--veil` gone (the header never disappears), sticky geometry read from CSS instead of
hardcoded, command band on the page gutter, unrelated-row dimming removed, 1366 overflow 0.

**Single Lead** — five sections as real anchors on one page, verified simultaneously present and
surviving navigation. The buyer's message is one of four facts at the top instead of dominating them.
Workflow flags are exactly `Internet` and `Mgmt checkoff`.

**Single Vehicle** — the production cockpit's architecture (12 zones, edit lock, dirty-diff save bar,
per-field change history) on Gen 11 surfaces. Uses a left zone rail; see §15.

**My Work Queue** — density preserved. 94 rows, 16 columns, and a precise check for the thing the
verification warned about: **0 genuine mid-word breaks across 467 cells.** The clean two-line wraps
were left exactly as they were.

**Single Ticket** — thread, crew, todos, changelog; the chronological parts reuse the Gen 11 timeline.

**Manage Dealers** — 365-row roster at full density, no faked frozen rail.

**Dealer Edit** — 105 fields across seven real zones, separated by rhythm and hairlines.

**Accounting — View All** — tabular numerals on the money columns, and an honest note on Past Due
where the figure does not resolve to the rows in the snapshot.

---

## 12 · Catalogue

`index.html` now opens with **GEN 11 — CURRENT**: a family grid of all ten pages, a twelve-item
"what changed" checklist, a nav link, and the primary button pointing at Gen 11 instead of Gen 10.
Older generations stay published below, untouched.

**All ten links were fetched and returned 200.** No fake links; nothing unfinished is presented as
finished.

---

## 13 · Responsive verification matrix

Re-measured in the reconciliation pass at a controlled viewport for every page — the earlier table
had one wrong entry, recorded in §18f.

| page | 1280 | 1366 | 1440 | 1920 | 1366×610 |
|---|---|---|---|---|---|
| All Vehicles | ovf 0 | ovf 0 | ovf 0 | ovf 0 | ovf 0 |
| All Leads | — | ovf 0 | ovf 0 | — | — |
| Single Lead | ovf 0 | ovf 0 | ovf 0 | — | — |
| Single Vehicle | — | ovf 0 | ovf 0 | — | — |
| Dealer Login | — | ovf 0 | ovf 0 | — | — |
| My Work Queue | — | ovf 0 | ovf 0 | ovf 0 | — |
| Single Ticket | — | ovf 0 | ovf 0 | — | — |
| Manage Dealers | — | ovf 0 | ovf 0 | — | — |
| Dealer Edit | — | ovf 0 | ovf 0 | — | — |
| Accounting | — | ovf 0 | ovf 0 | — | — |

Nav-rail overflow and hidden-but-painting elements were measured alongside overflow on every page at
both widths: **0 and 0 everywhere.**

All Vehicles was additionally swept through twelve states at each of the four widths: default,
sticky-engaged, vehicle near top / middle / near bottom, filters open, filters + vehicle, 3 bulk
selected + vehicle, Market open, all regions open, all regions closed, empty. Every state: overflow 0,
seams 0/0, stack 192, 0 clipped text, 0 rows covered, 0 rows dimmed, 0 band void, regions aligned.

At **1366×610** the engaged stack is 31% of the viewport with 5 rows visible. Usable, and recorded as
a limitation.

### Cross-page consistency

| | result |
|---|---|
| page gutter (`.top`, `.cmd`, `.hd`, `.field`, `.foot`, `.bento`) | **16px on every page**, all layers |
| sticky tokens 68 / 72 / 52 | identical on every list page |
| `--gutter`, `--s4` | 16px everywhere |
| focus rule present | every page |
| unrelated rows dimmed | 0 on every list page |
| faked frozen rail | none |

---

## 14 · Screenshot locations

```
reference/gen11-family-final-acceptance/   10 — one per page at 1440×900, in its meaningful state
  01-all-vehicles-1440-vehicle-open-anchored   06-my-work-queue-1440-lane-sticky
  02-dealer-login-1440                         07-single-ticket-1440-work-order
  03-all-leads-1440-lead-open-anchored         08-manage-dealers-1440-roster-sticky
  04-single-lead-1440-dossier                  09-dealer-edit-1440-dealer-file
  05-single-vehicle-1440-editor-sticky         10-accounting-view-all-1440-billing-sticky
  accept.js                                    the visual acceptance probe

reference/gen11-visual-system/     10 — All Vehicles, before/after and all four widths
reference/gen11-family-final/
  all-leads/ 1 · single-lead/ 11 · single-vehicle/ 5 · dealer-login/ 1
  work-queue/ 1 · single-ticket/ 1 · manage-dealers/ 4 · dealer-edit/ 2 · accounting/ 1
  xpage.js                         the cross-page consistency probe
reference/gen11-stage2-baseline/   pre-Stage-2 evidence, unchanged
reference/gen11-stage2-correction/ Stage 2 correction evidence, unchanged
```

---

## 15 · Accessibility findings

- **Contrast: 0 failures** on All Vehicles, computed on the composited render with alpha taken into
  account, against the 4.5:1 / 3:1 floors.
- **Focus:** owns `outline` alone on every page; `:focus-visible` confirmed on a real Tab press
  (2px solid, 2px offset).
- **Text below 11px:** two found and fixed on All Vehicles — the dealer monogram (10px) and the lease
  marker (9.5px).
- **Heading order** is sane on every page checked.
- **Hit targets below 24px:** 36 on All Vehicles, of which the meaningful ones are the 16×16 row
  checkboxes. Enlarging them changes the 26px column track and the row grid, so it is recorded rather
  than changed late in this pass.
- **No inaccessible opacity tricks, no text under overlays, no pointer-blocking invisible layers** —
  the row-dimming that was the one such trick is gone.

**Intentional exceptions, documented:** Single Vehicle uses a left zone rail and Single Lead a section
navigator. Both are product-specific — the production sources have them — and neither is the "section
rail inside the All Vehicles workspace" that the Stage 2 verification rejected.

---

## 16 · Known limitations and deferred product questions

### Accepted limitations of the implementation

1. **The engaged sticky stack is 192px** — 25% of a 1366×768 viewport, 31% at 610px tall.
   Archetype-appropriate but the heaviest of its kind by ~30px. Reducing it changes `--stick-total`,
   which the anchor is derived from, so it is a deliberate separate job.
2. **`#exp-space` is now a safety net rather than an active path.** The continuous workspace is tall
   enough that the document always reaches the anchor by itself; the extender would only be needed
   above a ~1672px viewport. The mechanism is intact and correctly evaluates to zero.
3. **The staff nav compresses from 1560px down.** Eight top-level menus need 992px. Below 1560 the
   wordmark, the search field and the menu chevrons collapse so the rail keeps all eight reachable.
   An overflow menu would be the better answer and is new functionality, so it was not built.
4. **Button heights vary by density class, deliberately** — 28–32 compact, 36–40 default, 44–48
   prominent. Radius is uniform (pill). See `DESIGN.md` §11.

### Deferred product questions — decisions, not defects

These need a product answer before they can be implemented. None is blocked by the design system.

1. **User-controlled columns.** Researched in full (`DESIGN.md` §16, and §17 below). Must remain
   visible: Stock · Make · Model · Price · Actions. Could hide: thumbnail · Trim · Colour · Status ·
   Health · Age. Recommended order: show/hide, then persisted per-user configuration, then
   drag-resize. **Not built — the base table had to be correct first.**
2. **Dealer Edit's read-only field policy.** All 105 fields are currently editable. If the real
   dealer file has fields that only certain roles may change, the rule needs stating before the
   visual distinction can be designed. The system already has the means (a read-only field reads as
   a value on the surface rather than a control).
3. **Row disclosure semantics on All Vehicles** — `role`, `aria-expanded`, `aria-controls` and Space
   on the row. Correct and wanted, but it is added keyboard behaviour; the Stage 2 verification
   deferred it to the accessibility stage and that still stands.
4. **The 16×16 row checkbox hit area.** Below the 24px floor. Enlarging it changes the 26px column
   track and therefore the row grid on every list page, so it needs to be done as one deliberate
   table-density change rather than late in a visual pass.
5. **Dark mode.** Gated off family-wide and now with no control anywhere that suggests otherwise.
   Re-enabling needs a palette and a contrast pass.

## 17 · Future: user-controlled columns

Researched, deliberately not built — the base table must be correct before users are given tools to
repair it by hand. Full table in `DESIGN.md` §16.

Must remain visible: Stock · Make · Model · Price · Actions. Could reasonably hide: thumbnail · Trim ·
Colour · Status · Health · Age. Only one flexible track exists today (Model, `minmax(100px, 1fr)`).

Recommended order: **(1) show/hide** for the six hideable columns, **(2) persisted per-user
configuration**, **(3) drag-resize last** — it is the most expensive and the least valuable of the
three. Frozen columns should only arrive together with resize; faking a frozen rail with a background
is exactly what this pass had to undo.

---

## 18 · Console and errors

**Clean.** No errors or warnings on All Vehicles, All Leads, Dealer Login, or any page during the
verification sweeps.

Three false alarms of my own are worth recording, because each nearly became a "defect":

1. A **backgrounded tab** throttles timers and smooth scroll. Measuring All Vehicles while the agents
   held the foreground produced anchor deviations of 504–1022px. Foregrounded, the same sweep gives
   0.4px.
2. A **settle detector** that waits for three identical scroll readings fires during a smooth scroll's
   slow start. It made Single Lead's section navigator look broken; with a proper wait, every section
   lands at exactly its 134px anchor.
3. A **screenshot taken immediately after a resize** can capture the pre-resize frame. One All
   Vehicles capture showed the page at rest when the measurement said it was anchored.

---

## 18b · Detector triage (Impeccable)

Run over the eight agent-built pages after re-verification. Thirty-two findings, triaged in context
rather than accepted or dismissed wholesale.

**Fixed — four real defects**

| finding | where | what it was |
|---|---|---|
| `layout-transition` | `single-vehicle.css:469` | the sticky cockpit animated `margin` and `border-radius` as it stuck — the same defect the command band had on All Vehicles. Now `transition: background` only |
| `undersized-ui-text` | `single-vehicle` | the dealer monogram at 10px, below the 11px legibility floor → 11px |
| `all-caps-body` | `my-work-queue` | re-checked: every instance is an 11px/700 letterspaced micro-label, the established Gen 11 caps pattern — ignored, not changed |
| `repeating-stripes-gradient` | `single-vehicle` | the photo placeholder's diagonal hatch, commented in source as a provenance device: a placeholder must not be mistakable for a photo — sanctioned |

**Verified false positives — measured, not assumed**

- **`nested-cards` ×20.** Checked on Manage Dealers, the page with the most elevation (14 raised
  surfaces): only 3 are nested, and all 3 are correct — `.lanes` whose "shadow" is a 1px ring, not
  elevation, and two popovers, which DESIGN.md §2 defines as floating above a pane. **Zero genuine
  card-inside-card.** The detector counts any nested container that has a background.
- **`dark-glow #e35548`.** A conic-gradient on the "Other" colour swatch in the filter list. A colour
  wheel, not a halo.
- **`dark-glow #223a76`.** `--sh-soft`, the family's standard elevation token, landing on a dark card
  where it is invisible. Harmless, not chromatic.
- **`cramped-padding` ×5** (`.rows`, `.hd`, `.foot`, `.zones`, `.cockpit`). Attached containers whose
  children carry the inset — the documented ATTACHED pattern. **Left un-ignored on purpose:** the rule
  is worth keeping sharp, and these five will simply keep reporting.

**Recorded, not acted on**

- `flat-type-hierarchy` on Single Vehicle (body 13 / h2 15 / h1 18, step 1.20 against a 1.25 target)
  — a compressed ramp is appropriate for a 456-field editor.
- `monotonous-spacing` on Single Ticket (4px in 61% of values) — dense page, smallest step used often.

**Ignores persisted** in `.impeccable/config.json`, all file-scoped to the Gen 11 pages:
`nested-cards=*`, `all-caps-body=*`, `repeating-stripes-gradient=*`.

---

## 18c · Final QA on the detector exceptions

### Ignores narrowed to the smallest scope the config allows

The config supports three axes — `rule`, `value`, `files` — but the detector reports no extractable
`value` for these three rules, so **files is the only axis available**. Each ignore was re-scoped to
the exact files that produce it, measured per file rather than assumed:

| rule | before | after | verified |
|---|---|---|---|
| `all-caps-body` | `pages/**/*-gen11.*` (10 files) | **1 file** — `my-work-queue-gen11.html` | only file that fires it |
| `repeating-stripes-gradient` | `single-vehicle-gen11.*` | **1 file** — `single-vehicle-gen11.html` | one rule, `.photo--ph` |
| `nested-cards` | `pages/**/*-gen11.*` (glob) | **explicit list of 8 files** | all 8 re-tested, see below |

The `nested-cards` list is written out file by file rather than as a glob, so a new Gen 11 page
cannot silently inherit the exception. Each entry carries a `note` in `.impeccable/config.json`
recording what justifies it.

### What justifies each — and one real defect it uncovered

**`nested-cards`.** My first test was wrong: it looked for `inset` at the *start* of a shadow string,
but in computed styles `inset` is a **suffix**. That made every sunken track (`.lanes`, `.search`)
read as a raised card. Corrected test — opaque background, radius ≥ 8, and a non-inset shadow with
blur ≥ 2 — run over all eight files:

| page | elevated surfaces | nested | floating (popover/menu/tray/dock) | **genuine** |
|---|---|---|---|---|
| all-leads | 23 | 18 | 18 | **0** |
| all-vehicles | 21 | 15 | 15 | **0** |
| single-vehicle | 14 | 10 | 10 | **0** |
| accounting | 15 | 10 | 10 | **0** |
| dealer-edit | 16 | 10 | 10 | **0** |
| manage-dealers | 14 | 12 | 12 | **0** |
| my-work-queue | 16 | 13 | 12 | **1** ← |
| single-ticket | 14 | 10 | 10 | **0** |

**The one genuine instance was real and is fixed.** My Work Queue's `.search` carried
`--sh-pill`, a true drop shadow, making it the only actually-raised element inside a field card in
the whole family. It is now `inset 0 0 0 1px var(--line)` with a brand ring on `:focus-within` — a
control on a surface, not a card above one. Re-tested: **0 genuine nested cards on all eight pages.**

The test is kept at `reference/gen11-family-final/nestcheck.js` for re-verification.

**`all-caps-body`** — 32 characters of uppercase on My Work Queue, every instance an 11px/700
letterspaced micro-label (column headers, caps labels). The established Gen 11 caps pattern, not body
copy set in capitals.

**`repeating-stripes-gradient`** — one rule, `.photo--ph`, the photo placeholder's 135° hatch,
commented in source as a provenance device: a placeholder must not be mistakable for a photograph.

### Manual QA item

**These three detectors are suppressed on the files above and will not warn again.** Re-check by hand
when any of those files gains a new raised container, a new uppercase run, or a new gradient:

```
node  reference/gen11-family-final/nestcheck.js      (paste into the page console)
impeccable detect <file>                              after temporarily clearing the ignore
```

A fourth ignore, `monotonous-spacing`, was added later in the same pass for `single-ticket-gen11.html`
— see §18e for the measurements behind it.

`cramped-padding` and `dark-glow` were **deliberately left un-ignored** — they fire on five known
attached containers and two known token shadows, and the rules are worth keeping sharp.

---

## 18d · Single Vehicle typography — verified, not assumed

The `flat-type-hierarchy` finding compared h1/h2/body sizes only. Measured at **1366×768 and
1440×900** (identical — the page has no fluid type and no `font-size` inside a media query):

| role | size | weight | colour | caps |
|---|---|---|---|---|
| page title | 18 | 600 | `--ink` | — |
| field value (`.in`) | 18 | 600 | `--ink` | — |
| section title (`.zone__t`) | 15 | 600 | `--ink` | — |
| section summary (`.zone__s`) | 14 | 400 | `--ink-3` | — |
| action label | 14 | 600 | `--ink` | — |
| helper / meta (`.f__help`) | 13 | 400 | `--ink-3` | — |
| field label (`.f__l`) | **12** | **700** | `--ink-3` | **uppercase** |

**The hierarchy is immediately readable, and the type scale was not increased.** It separates roles
on four axes at once — size, weight, colour and capitalisation — not on size alone, which is all the
detector measured. The field label is the clearest case: at 12px it is the *smallest* text on the
page, yet unmistakably a label, because it is the only thing that is 700-weight, grey and uppercase.

Two observations recorded rather than changed:

- **Page title and field value are both 18/600.** In an editor the values *are* the content, so a
  title that does not shout over them is defensible; the title is distinguished by its header band,
  the thumbnail and the status chips beside it.
- **The price renders larger than the page title.** Deliberate in a vehicle editor.

A compressed ramp (1.20 rather than 1.25) is appropriate for a 456-field editor. No change made.

---

## 18e · Single Ticket spacing — the 4px question answered

The detector reported "~4px used 28/46 times (61%)". Measured against the authored stylesheet, that
is **not** what is happening: it had bucketed a 5/6px cluster in with 4px.

**Authored distribution — before / after**

| | before | after |
|---|---|---|
| on the 8pt ladder | 68.4% | **76.8%** |
| 4px | 16 (8.4%) | 31 (16.3%) |
| 8px | 52 (27.4%) | 52 (27.4%) |
| 12px | 28 (14.7%) | 29 (15.3%) |
| 16px | 24 (12.6%) | 24 (12.6%) |
| 24px | 8 (4.2%) | 8 (4.2%) |
| 32 / 64px | 2 | 2 |
| off-scale | 60 (31.6%) | 44 (23.2%) |

**Where the small values actually occur** — classified in the rendered page by the relationship each
one governs:

| value | icon-to-label | stacked metadata | table / list | section / panel | page / layout | compact internal |
|---|---|---|---|---|---|---|
| 4px | — | — | — | **1** | **3** | 140 |
| 5px | — | — | — | 2 | — | 113 |
| 6px | — | 12 | — | — | — | 101 |
| **8px** | — | — | 3 | **27** | **4** | 348 |

**Verdict: 4px is not substituting for structural spacing.** Structural relationships — section and
panel separation, page layout — are carried by 8px and above, by 31 occurrences to 4px's 4. 4px lives
where the system permits it: inside compact controls and inline groups.

**What was corrected.** Not the 4px, but the off-scale cluster it was hiding. All internal `gap`
declarations were moved onto the ladder (3→4, 5→4, 6→4, 10→12; 16 declarations). **Paddings were
deliberately left alone** — they set control heights and widths in a dense table, and the 5px padding
on `.secnav` and `.lanes` is the documented segmented-track value from `DESIGN.md` §11, not a stray.

Verified after: 1366×768, horizontal overflow **0**, no loosening, nav items at their normal 2px
spacing with no collision.

### `monotonous-spacing` re-checked after the change — and it is mine to answer for

The gap normalisation raised the 4px share (16 → 31 authored declarations; the detector moved from
"28/46 (61%)" to "19/30 (63%)"). That is a fair thing for it to notice, so the rhythm was measured on
the rendered page rather than argued from the stylesheet:

| level | measured separation |
|---|---|
| inside one field — label → control → help | **4px** |
| list rows (`.tl li`, crew, todos) | **12px** |
| between sections (`.sec`) | **24px top + 32px bottom = 56px** |

A six-fold spread from tightest to loosest. The page has rhythm; sections are separated by padding
rather than by margins, which is why a gap-based sample sees mostly small numbers.

The detector counts 19 of 30 gaps at ~4px because a form-heavy page has many `.f` triplets and each
contributes exactly one 4px gap — **the count tracks how many fields exist, not an absence of
hierarchy.** And every gap this pass moved to 4px is an icon-to-label or label-to-value relationship,
which is what the half-step is for. Ignore persisted, scoped to that one file, with the measurements
in the config note.

---

## 18f · Reconciliation and visual acceptance pass

A final pass over the four things the report and the implementation disagreed about. Three of them
turned out to be real.

### 1 · The cache-key contradiction — resolved

The report claimed one family key while Single Vehicle, My Work Queue and Single Ticket carried newer
ones. Each page was internally consistent; the family was not. Rather than downgrade the newer keys,
everything was moved forward to **`202609282140`** after all of this pass's edits landed. Proof in §19.

### 2 · Dark-mode controls — a real leak, fixed

The report said Accounting and the staff nav exposed a dark-mode toggle. Nearly right: the button
carried the `hidden` attribute, **but still painted.** A component rule setting `display: grid` beats
the user agent's `[hidden] { display: none }`, because both are author-level display declarations.

Two pages leaked — Single Ticket (3 elements) and Accounting (2), the extra ones being hidden
empty-state paragraphs. **One guard now applies family-wide:**

```css
[hidden] { display: none !important; }
```

Re-measured on all ten pages at 1366 and 1440: **0 hidden elements painting, 0 visible dark-mode
controls.** No dark mode was implemented, and no control now suggests it works.

### 3 · Button geometry — consolidated where the difference was accidental

Measured across all ten pages by role.

**Radius was genuinely inconsistent and is now uniform.** Nine of the ten pages already used the pill;
Dealer Login was the outlier at `--r-control` 14px. It is a pill now, and `DESIGN.md` §3 was corrected
— it had said `--r-control` was for "buttons and inputs" when the implementation has always said
inputs.

**Height was not an accident and was left alone.** 28–32 in dense staff tables, 36–40 for page and
section actions, 44–48 for a dealer sheet's primary. `DESIGN.md` §11 now documents the three tiers
rather than pretending to one number.

**Pagination** was 2px on Work Queue and All Leads against All Vehicles' 4px — the same conceptual
control styled differently. Now `--s1` everywhere it appears.

**The Hide on site / Delete pair, re-checked as instructed:** at 1440 all seven sheet actions sit on
one line at 40px height, pill radius, 8px apart, with Delete right-aligned at the end. At 1366 the row
wraps and Delete takes the second line alone, still right-aligned. **Zero overlaps at either width.**
An earlier reading of "−60px" was my own probe comparing two buttons on different lines.

### 4 · A real overflow the earlier report had missed

**Accounting overflowed 390px at 1440.** The earlier "ovf 0" for that page was measured at a 2048px
viewport, because a `resize_page` call had not applied and I recorded the number without checking the
viewport it came from. That is a reporting error, not a late regression.

The cause: `.app` is a grid, its implicit column is `auto`, and a grid item's `min-width` is `auto` —
so the widest row of a nine-column table sized the whole shell to 1801px. The guard:

```css
.app { grid-template-columns: minmax(0, 1fr); }
```

Added to Accounting, Manage Dealers and Dealer Edit, which lacked it. **That fix then exposed the next
layer:** with the shell no longer expanding, the eight-menu staff nav had 600px for 992px of items and
ran under the search and account chip. Compression from 1560px down — wordmark, search field and menu
chevrons — brings the rail to 781px in 781px. Verified: **nav overflow 0 on every staff page at both
widths.**

### Visual acceptance — every page looked at, not only measured

All ten pages inspected in a real browser at 1366 and 1440 (All Vehicles also at 1280 and 1920), in
their meaningful state: vehicle open and anchored, lead open and anchored, editor scrolled with the
cockpit stuck, queues and rosters with the stack engaged.

| checked | result |
|---|---|
| holes between sticky layers | none — seams 0/0 on every page |
| attached surfaces keeping a radius | none |
| double shadows in the stack | none — one shadow, on `.hd` |
| coloured triangles, clipped corners | none seen |
| text under another surface | none confirmed; the one probe hit was a cell-boundary artefact |
| buttons touching | none outside segmented groups, where 2px is the design |
| focus clipping | none |
| horizontal overflow | **0** on all ten pages at both widths |
| nav-rail overflow | **0** on all ten pages at both widths |
| hidden elements painting | **0** |

---

## 19 · Cache and version keys

**One key across the whole family: `202609282140`.**

| | |
|---|---|
| All Vehicles, start of the work | `202609271700` |
| All Vehicles, through Phase 1 | `202609272100 → 202609280410` (14 bumps) |
| family, first unification | `202609281800` |
| family, after the reconciliation pass | **`202609282140`** |

Verified on disk: **32 asset references across 10 HTML files, one distinct key.** Each page's CSS,
JS and data file carry the same key as the HTML that references them.

The earlier report claimed one family key while three pages carried newer ones — that contradiction
is what §18f was opened to resolve.

## 20 · Acceptance checklist

| | |
|---|---|
| All Vehicles visual-system pass complete | **yes** |
| holes, seams and overlaps eliminated | **yes** — seams 0/0, 0 rows covered, 0 dimmed, insets equal |
| 8pt spacing tokens in use | **yes** — one off-scale value left, deliberately |
| button geometry consistent | **yes** — radius uniform (pill); height by documented density tier |
| dark-mode controls consistent with gated dark | **yes** — 0 visible, 0 painting, family-wide `[hidden]` guard |
| cache key single and verified | **yes** — `202609282140`, 32 refs, 1 distinct key |
| visual acceptance, all 10 pages | **yes** — 1366 and 1440, inspected not only measured |
| sticky surfaces visually coherent | **yes** — one attached surface, one shadow, one glass value |
| detail IA is a vertical stacked accordion | **yes** — four regions, Health open, independent |
| selected-row anchor preserved | **yes** — −0.4px, unchanged |
| Gen 11 family exists | **yes** — all ten pages |
| catalogue updated | **yes** — Gen 11 at the top, ten live links, all 200 |
| DESIGN.md created from the implementation | **yes** |
| cross-page QA done | **yes** — gutter, tokens, sticky, focus, dimming compared across all pages |
| responsive verified | **yes** — 1280 / 1366 / 1440 / 1920 + a 610px-tall stress |
| console clean | **yes** |
| Gen 10 preserved | **yes** — no `*-gen10.*` file touched |
| Gen 12 created | **no** |
| `impeccable init` / `document` run | **no** |
| **Git push** | **NOT PERFORMED** |
