# AAN — GEN 11 DESIGN SYSTEM

**Written for:** anyone building or reviewing an AAN Gen 11 page.

This is an operational dealer control panel. Density, legibility and predictable position beat
decoration. Nothing in this document asks for an effect. Every value was read out of the running
pages at 1440×900 (computed style), not proposed in advance; where a number looks arbitrary, the
note says what it is load-bearing for.

Part I (§0–§35) says what each thing looks like; Part II (§36–§41) says how to build a page from it:
the page types, copy-paste markup with states, which pattern for which need, and the hand-in check.
Section numbers are stable — code comments cite them (`DESIGN.md §18`). New topics get new numbers;
an old number is never reused for something else.

---

## 0 · How the system works

**Precedence = the order the pages were made:**

```
1 All Vehicles → 2 Single Vehicle → 3 All Leads → 4 Single Lead → 5 Dealer Login
→ 6 My Work Queue → 7 Single Ticket → 8 Manage Dealers → 9 Dealer Edit → 10 Accounting
```

- When two pages disagree, **the earlier page wins.** All Vehicles is the base; Single Vehicle second.
- Each later page inherits everything from the pages before it.
- A pattern first introduced on a later page (the feed and reply tree of Single Ticket) becomes the
  rule for every page after it **and** for any earlier page that has the same kind of element.
- When a rule written in this document contradicts what All Vehicles measures, All Vehicles wins and
  the rule is corrected, never All Vehicles.

**Origin.** Every component below carries an `Origin:` line — the first page, in that order, where it
appears — and the values are that page's measured values.

**Layers.**

| layer | file | holds |
|---|---|---|
| tokens | `pages/_aan-family.css` (loaded after each page CSS) | colour, radius, line, shadow tokens; the platform bar; avatars |
| shared components | `pages/_aan-components.css` (loaded last); the `ONE SYSTEM` block at its end | each shared component **defined once**, from its origin page's values |
| page | `pages/<role>/<page>-gen11.css` | page-specific layout only |

A page stylesheet does not restyle a shared component. An override that exists only to make a page
match the system is moved into the shared definition and deleted from the page. Dealer pages also
load `all-vehicles-gen11.css` (the origin page's own file); a rule there that reaches another page is
pinned back in the shared block, never in the other page.

**Check.** `node tools/ds-check/ds-check.mjs` (a) lists every page-CSS selector that restyles a shared
component or role — the backlog of this section — and (b) measures each role on all ten pages against
its origin page and prints the differences, overflow and console errors; `--widths` adds (c), overflow,
touch targets and the sticky stack per width. `node tools/ds-check/features.mjs` is the feature
inventory (§41). Run them after every change.

**Cache.** Plesk caches CSS/JS for a year: every stylesheet that changes gets a new `?v=` key in every
HTML file that loads it.

---

## 1 · Spacing — one 8pt ladder

Origin: All Vehicles.

```
--s1   4px      --s4  16px      --s7  40px
--s2   8px      --s5  24px      --s8  48px
--s3  12px      --s6  32px      --s9  64px
```

4 and 12 are the half-steps compact controls need; everything structural lands on 8. The same
relationship always takes the same token. Do not introduce 17 / 19 / 22 / 26 / 31 without an optical
reason recorded next to it.

| token | value | what it is |
|---|---|---|
| `--gutter` | 16px | the page gutter — every layer's left and right edge, at every width |
| `--sheet-inset` | 16px | header cells, rows, scope line, footer |
| `--col-gap` | 8px | between row columns |
| `--exp-detach` | 8px | air between the selected pair and the row above it |
| `--anchor-gap` | **10px** | off the scale on purpose — §8 |

**Page rhythm** (All Vehicles, 1440×900): platform bar at y 16, 56 tall · 16 to the page head ·
head row 32 · 24 to the board · board · 24 to the field. Record pages replace the head row with the
§21 card (margin 8 above, 16 below).

---

## 2 · Surfaces — ATTACHED or FLOATING, never both

Origin: All Vehicles. Decide this for every boundary before styling it.

**ATTACHED** — touching corners square · one shared edge, a single hairline (`--line-2`) · no shadow
between the two · the same horizontal inset as its neighbours · no gap.

**FLOATING** — a visible gap on every side · its own complete radius · one restrained shadow ·
never intersecting another rounded surface.

Hairlines are drawn with `box-shadow: inset 0 ±1px 0`, not `border`, on any layer whose height is part
of `--stick-total` — a border adds a pixel the sticky arithmetic cannot absorb.

| surface | class | |
|---|---|---|
| platform bar | `.top` | FLOATING at rest · ATTACHED once engaged |
| command band | `.cmd` | ATTACHED — full width inside the field |
| column header | `.hd` | ATTACHED — owns the stack's bottom edge |
| inventory field | `.field` | FLOATING — `--r-card`, one shadow |
| rows / footer | `.rows` `.foot` | ATTACHED inside the field |
| dock | `.dock` | FLOATING — one gutter from the field |
| selection tray, menus, popovers | `.tray` `.menu` `.pop` | FLOATING |

With the dock open, `.top` stays full width while the field narrows: the bar is the application
boundary, the field and the dock are two floating panes beneath it. That is the layout, not a seam.

---

## 3 · Radius

Origin: All Vehicles (computed; the scale is set in `_aan-family.css`).

```
--r-pill    999px   SEMANTIC ONLY — the list below
--r-card     14px   floating panes: the field, the record head card, the command search
--r-l        14px   page-level surfaces: the board cards (the dock computes 12px, §31)
--r-panel    12px   panels inside a pane; the platform bar
--r-control   9px   buttons, facet buttons, the dock's close
--r-inner     7px   inputs, selects, small menu items, nav items' family
--r-micro     4px   swatch, kbd, the Mock-addition tag
```

Checkboxes are **5px** (All Vehicles' `.ck`).

**The pill is semantic.** Allowed on: segmented-control tracks and thumbs · flag tags · counters ·
switch tracks · avatars · the record id pill. A nav item, a button, a facet, a field, a tab strip,
a save bar and a section rail are structure and take a radius from the scale. Status chips are 7px.

Force radius to `0` on any edge where two surfaces touch.

---

## 3b · The platform bar

Origin: All Vehicles. Family property: lives in `_aan-family.css` plus the shared block; identical on
the nine shell pages (Dealer Login has its own world, §15).

```
.top         56px · inset 16px both sides · radius 12px · white .76 glass · --sh-soft
.brand__mk   "AAN" · 39×18 · padding 2px 8px · radius 4px · --brand fill · #fff · 600 12.5px Plex Mono
             sits at x = 32 on every page (bar at 16 + 16 inset; the brand link has no padding)
.brand__t    15px / 600 ink · "All Auto Network"; 8px after the mark
.nav__b      30px · radius 8px · 13px / 500 ink-2
  current    brand-soft fill · brand-ink · 650 (the shipped .ui-topnav__trigger) — not a capsule
.gsearch     30px · radius 7px · 13px · white, 1px --line ring · placeholder ink-4, typed text ink
.tbtn        30×30 · radius 7px · glyph 17px ink-3
.atlas       24px · radius 7px · 11.5px / 600 ink-3 · 1px ring (staff only)
identity     .dealer / .me: 30px · 13px / 600 ink-2 · chevron ink-4
avatar       28×28 circle · 13px / 600 (staff .me__mk 28×28) — the only circles in the bar
```

Dealer and staff are told apart by the environment and the identity block on the right, never by the
colour of the mark. **One navigation per side:** one dealer menu on the four dealer pages, one staff
menu (the original's full set) on the five staff pages, with the same hidden items (`NAV_HIDDEN`,
`NAV_HIDDEN_GROUPS`); something removed from a menu is removed in every page's data.

---

## 3c · One page ground

`--ground` is `var(--wash)` on every page. A darker ground against the white workspace reads as a
second shell and turns the 16px gutter into a rail. The gutter is 16px at every width — where a table
needs space, the row inset steps down, never the page edge.

---

## 4 · Elevation

Origin: All Vehicles. One shadow per floating object, never two on one boundary.

| token | used on |
|---|---|
| `--sh-soft` `0 28px 64px -34px rgba(34,58,118,.42), 0 2px 8px -3px rgba(34,58,118,.10), inset 0 1px 0 rgba(255,255,255,.95)` | the platform bar, the record head card, **in-page popovers** (Sort, Make, a filter) |
| `--el-3` `0 30px 64px -18px rgba(16,24,40,.34), 0 0 0 1px rgba(16,24,40,.06)` | the platform bar's menus (nav, account) |
| `--el-2` `0 12px 30px -14px rgba(16,24,40,.22), …` | the dock, the board cards, a floating save bar |
| `--sh-pill` `0 1px 2px rgba(34,58,118,.12), 0 6px 14px -8px rgba(34,58,118,.32), inset 0 1px 0 #fff` | resting controls: sheet buttons, facet buttons, the command search |

The engaged sticky stack casts **one** shadow, at its bottom edge, on `.hd--stuck`:
`0 1px 0 var(--line), 0 10px 20px -16px rgba(34,58,118,.45)`. Interior shadows inside the stack are
removed, not softened.

---

## 5 · Colour roles

Origin: All Vehicles.

```
--ink      #0d1320   primary text            --sheet  #ffffff   surface
--ink-2    #353e4e   secondary text, controls --well   #e4e9f0   sunken
--ink-3    #576070   tertiary, labels, keys  --wash   #eef1f5   page, hover
--ink-4    #697181   placeholder, empty      --line   #d8dee7   divider
--line-2   #e5e9ef   hairline                --line-3 #c5cbd5   control ring
--brand      #1f5fe0  primary action         --ok      #12704a
--brand-ink  #1747b3  brand text, links      --danger  #bd3328
--brand-soft #e9f0fe  tint, bulk selection   --signal  #945000   --violet #5c42c9
--focal      #172234  dark focal surface (board, selected row)    --focal-ink #f3f6fb
```

**Red is for two things only:** Hidden on site, and Clear all (All Vehicles, All Leads).
Destructive actions use `--danger` text (§11), not a red fill.

Dark theme: on, switched from the bar (moon / sun, 1280 and up) and the account menu — tokens and rules in §42.

---

## 6 · Active and selected — one means per state

Origin: All Vehicles.

| state | how it is shown | where |
|---|---|---|
| primary action | solid `--brand` fill | Add vehicle, Save Ticket |
| chosen view / lane / section tab | brand fill, white label, **the same weight as its neighbours** (500), count white at 82% — one rule in `_aan-components.css` (`.ui-views > .ui-view--on`) | Lot lanes, All Leads' tabs, My Work lanes, Manage Dealers' views, Accounting lanes, the section navigators of Single Lead and Single Ticket |
| binary toggle | white thumb on a sunken track | `.seg`: Rows / Gallery, Yes / No |
| switchable state | a state chip that is also a button: outline with its glyph at rest, the state's tone when on, one label, 0px shift | Single Ticket's "Waiting on client" |
| current nav section | tinted, no fill | platform bar |
| chosen menu item | brand-ink 600 | every menu (§28) |
| **open for inspection** | dark `--focal` surface | the selected row |
| **bulk selected** | `--brand-soft` tint | checkbox rows |

Choosing a tab moves nothing: weight does not change on selection. "Open for inspection" and "bulk
selected" never look alike — they co-occur and answer different questions.

---

## 7 · Sticky stack

Origin: All Vehicles.

```
--bar-track 76px   the grid row the bar sits in at rest (bar at its start, 16px above)
--stick-bar 56px · --stick-cmd 56px · --stick-hd 40px · --stick-total = 152px
```

CSS publishes the geometry; JS reads it — never hardcode the stack in script. `getPropertyValue`
returns `calc(…)` unevaluated: read the three plain values and sum them. `--stick-cmd` is
load-bearing (`8 + 40 + 8` around the search). The layers take their heights from these tokens.
Engaged state is published by one scroll handler: `.cmd--stuck`, `.hd--stuck`, `#app.is-stuck`.

Z-index ladder — no component writes a raw z-index:
`--z-ground 0 · --z-content 1 · --z-raised 3 · --z-sticky-hd 10 · --z-sticky-cmd 12 · --z-platform 20 · --z-tray 30 · --z-menu 40`.
Content travels under chrome.

---

## 8 · Contextual in-flow expansion + the selected-row anchor

Origin: All Vehicles. **Do not replace it with a modal, a popover, a drawer or
`scrollIntoView({block:'center'})`.**

```
y = rowTop + scrollY − (--stick-bar + --stick-cmd + --stick-hd) − --anchor-gap  = 162px
```

`--anchor-gap: 10px` is the value All Leads shipped for years — do not round it. Measured deviation
−0.4…0px at 1280 / 1366 / 1440 / 1920, both directions, reduced motion, dock open.
`#exp-space` is a zero-height extender JS grows by the shortfall so the last rows can reach the
anchor — load-bearing, do not delete it because it measures 0.

The expansion is `position: static`, in flow; shares the row's edges (delta 0/0); seam 0; covers and
dims nothing; one hairline (`inset 0 0 0 1px var(--line)`), no elevation, no radius at the seam;
closing does nothing to the scroll position; switching vehicles is an ordinary open.

---

## 9 · Detail architecture — a vertical stacked accordion

Origin: All Vehicles' vehicle sheet. Merchandising Health → Market Intelligence → Specification →
History: one column, full sheet width, each opens independently, any number open, Health open by
default; ATTACHED to each other (no radius, one hairline, no shadow); opening one moves nothing above
it. Header `min-height 52px`, label left, one-line verdict right (legible while open), chevron.
The object header (photo | identity, figures, actions) is never shorter than 264px.

---

## 10 · Tables and lists

Origin: All Vehicles.

- Row `--row: 74px` (96px in the photo view). Columns are a named grid on `.field`
  (`--cols: 26 92 104 46 104 minmax(100,1fr) 84 92 118 80 218 76 108`); Model is the only flexible track.
- **No column is `position: sticky`** and nothing paints a frozen rail.
- Price · Status · Health · Age · Actions are a group, marked by **one divider where it begins**
  (`inset 1px 0 0 var(--line-2)` on the header cell and the cell) and nothing else.
- Header cells are addressed by semantic class (`.c-price`), never `nth-child`.
- **Head key:** 11px / 700, +0.08em, CAPS, ink-3 — the only caps in a table.
- **Cell:** 14px / 400 ink; the row's identifier 600. Money and counts `tabular-nums`, in `--font`.
- **Row divider:** `inset 0 -1px 0 color-mix(in srgb, var(--line-2) 65%, var(--sheet))` on every list.
- **Zebra on every monotonous block.** A block of many rows of the same shape (a list, a ledger, a log table) shades every second row with `color-mix(in srgb, var(--wash) 55%, var(--sheet))`, as All Vehicles. It is automatic on a list (`#tb > .row`; an open sheet between two rows does not break the count). Mark a table with `.zebra` (`<table class="lg zebra">`). Hover, the open row, a selected row and drag / jump targets keep their own tint. Not on feeds and timelines (entries are read one by one, not across), forms, menus, or a block of a few rows.
- **Row link** (the stock number): Plex Mono 13px / 700 brand-ink, no underline.
- Columns are left-aligned (numbers included) unless a column is a pure figure column with its own head.
- **A list never scrolls sideways and never hides a column** (Alex, 18 Nov 2026). When the columns do not fit
  1280 (My Work Queue, sixteen of them):
  - **short heads**, the full name in the head's `title` and in the Sort menu: Dealer, Age, Created,
    Modified, Since Modified, Est., My Est., Left, My Begin, My End, Begin, End (planned dates, so never "Done");
  - **every track `minmax(its minimum, a share)`** with a 6px gap. The minimums fit 1280; a wider screen spreads
    its extra width across all the columns in proportion, never to the free-text columns alone;
  - **the free-text columns wrap onto a second line** (Dealer, Subject) instead of an ellipsis; a third line
    ends in an ellipsis;
  - **every head starts on the top line**, so a one-line head keeps its second line free.

**Pager** — Origin: All Vehicles. On top **and** bottom of the list (`.pgr--top`, `.pgr`): a 48px bar
in the field, "Showing 1–100 of 359" 14px ink-3 at the left; page buttons 30×30, radius 8px,
14px / 500 ink-2, the current page ink fill with white figure; disabled at 35% opacity; rows-per-page
`select.sel--sm` 30px / 8px / 13px. My Work Queue and All Leads use the same pager.

**A–Z jump** — Origin: Manage Dealers (Accounting follows). A row of 24×22 letter buttons, radius 4px,
12px / 600 ink-2; a letter with no rows is `--line-3` and inert.

---

## 11 · Buttons

Origin: All Vehicles (default, primary, sheet, quiet); Single Vehicle (small).

**Radius 9px (`--r-control`) on every button, no exception.** One primary style.

| variant | spec |
|---|---|
| default tier | 36px · padding 0 14px · 14px / 500 |
| small (`.btn--sm`) | 30px · padding 0 11px · 14px / 500 — record-head actions, sheet actions |
| primary | `--brand` fill, white, `0 10px 22px -10px rgba(29,95,230,.70), inset 0 1px 0 rgba(255,255,255,.32)`; hover `--brand-hover` |
| sheet (`.btn--sheet`) | white, ink, `--sh-pill` |
| quiet (`.btn--quiet`) | no fill, ink-2; hover `--wash` |
| on (a toggle such as Workflow, Assigned To) | brand-soft fill, brand-ink, 1px `#cddbfb` ring, 13.5px / 600 |
| destructive | `--danger` text, `--danger-soft` hover, `margin-left: auto` at the far end of its group |

- One height per class of control within a page; icon-only buttons take the square of their tier.
- **Field heights (decided by Alex, 18 Nov 2026).** There are two heights for fields:
  - **36px in a form** (Dealer Edit, Single Lead's Workflow dock, Single Vehicle);
  - **30px in a dense working form or panel** (Single Lead's contact form, Single Ticket's work order and
    Assigned To dock, My Work Queue's row selects).

  32 and 40 are gone. A small button beside a dense field is 30, so the two stay level.
- Buttons are sized by their label; 8px between neighbours.
- A form's result ("Saved", or what is missing) stands beside the button that produced it, 16px to its
  left, and the button does not move when it appears (Single Ticket, Single Lead).
- **The way back** on a record page is the quiet small button "‹ Back to …" in the first row of the
  head card (§21), pointing at a Gen 11 page.

---

## 12 · Focus

Origin: All Vehicles (measured on a button, a facet, the search field and a nav item).
`outline: 2px solid var(--brand); outline-offset: 2px` on `:focus-visible`; `#ffd98a` on focal
surfaces and the tray. Focus owns `outline` and nothing else owns it — never put it on `box-shadow`,
never clip it with `overflow: hidden`.

---

## 13 · Provenance — the demo rule

Fabricated or unconnected data says so **before** the reader has to decide whether to believe it.

- **Demo tag** — Origin: All Vehicles marks demo columns in the column head (`.hd-demo`); the tag
  form (`.demo`) is Single Lead's: 18px, radius 4px, 12px / 600, sentence case, violet on violet-soft
  (on the dark board: `#d3caff` on `rgba(195,182,255,.16)`). It sits in the region header beside the title.
- **Mock addition tag** — Origin: Single Vehicle (`.chip-src`): 20px, radius 4px, 12px / 600, sentence
  case, violet — marks a control the original does not have.
- A not-connected source line precedes its visualisation, not under it. Never add a Demo tag to a
  region whose provenance has not been assessed; never invent replacement provenance.

---

## 14 · Motion

`--dur 160ms` · `--dur2 240ms` · `--ease cubic-bezier(.2,0,0,1)`. Transitions are for disclosure and
state, not for arrival.

**A list's Filters dock opens and closes softly** (Alex, 18 Nov 2026; All Vehicles, My Work Queue): it opens over
`--dur3 320ms` with `--ease-soft cubic-bezier(.22,.61,.36,1)`, opacity 0→1 and 16px from the right; it closes over
`--dur2` with `--ease-io cubic-bezier(.4,0,.2,1)`, sliding back out and fading **where it stands**
(`.dock--closing` on the dock itself, not on `.app`, so the start of the close restyles nothing else), and lets go of
its place only then; beside the list, the list takes the room back after the fade. Opening on load (a remembered
open dock) has no arrival. Nothing heavy runs in the motion: a list re-measure happens only where the list's width
changes (beside), and after the opening. Reduced motion: it appears and goes at once. No `setTimeout` choreography. Under `prefers-reduced-motion` the anchor lands
at the same place instantly. **Nothing jumps on a state change:** reserve the space (a status chip
sized to its longest state, a result line that is always there).

---

## 15 · Responsive — desktop and tablet

**Desktop, 1280 and up.** Verified at 1280×720 · 1366×768 · 1440×900 · 1920×1080, plus a 1366×610
height stress. 1366 is the binding desktop width; the desktop breakpoints sit at 1280 and above. Zero
horizontal overflow in every state. Do not compact to fit; let the flexible column absorb the difference.

**Tablet, 768–1279.** §41. **Mobile, below 768:** not designed; nothing may be built for it without a
decision.

**Dealer Login** is its own world (full-bleed video, 46px fields, 44px / 900 caps headline): it shares
the fonts, the mark and the brand colour, not the platform bar.

---

## 16 · Future — user-controlled columns

Researched, deliberately not built. Order if built: show/hide for Thumbnail, Trim, Colour, Status,
Health, Age → persisted per user → drag-resize last (with frozen columns only together with resize).
Health is 218px because of its worst case (`NO PRICE · NO PHOTOS · +2`) — the best candidate for a
user width.

---

## 17 · Code rules

- named tokens, never magic numbers; derived sticky geometry (CSS publishes, JS reads)
- explicit state classes (`.cmd--stuck`, `.hd--stuck`, `#app.is-stuck`, `.acc--open`); JS sets state, not position
- when a rule must beat another, match its specificity and say why in a comment
- `overflow: hidden` only where clipping is intended, never to hide a layout bug
- a shared component is defined once (§0); a page that needs another value records why next to it
- a dead rule (matches nothing in the page's HTML and JS) is deleted, not kept "in case"

---

## 18 · Typography — one face, fixed roles

Origin: All Vehicles (All Leads for the roles All Vehicles has no instance of). Every page loads
Archivo (variable, `font-stretch 62% 125%`) and Plex Mono from `ds/fonts` — never `local()` alone.

```
--font   Archivo     all text
--mono   Plex Mono   ONLY what a person copies or matches by eye: stock #, VIN, phone, IP,
                     lead-type codes, ids in pills, raw logs
```

Names, emails, addresses, money and dates are text in `--font`; money and counts `tabular-nums`.

| role | spec | origin |
|---|---|---|
| page title | 28px / 600, −0.022em, Archivo 92% width | All Vehicles (`h1`); Single Vehicle's `.cock__t` |
| section title | 18px / 600, −0.012em — `.sec__h h2`, `.zone__t` (one shared rule) | Single Vehicle |
| board card title | 16px / 700, −0.01em, sentence case | All Vehicles |
| board meta | 13px / 400 muted | All Vehicles |
| board hero figure | 52px / 600, −0.025em, 88% width | All Vehicles (Lot) |
| board figure | 24px / 700, −0.015em, 88% width | All Vehicles (Value) |
| tile figure | 26px / 700 | All Vehicles (Needs attention) |
| board label | 14px / 400 muted | All Vehicles |
| body · table cell | 14px / 400; identifier 600 | All Vehicles |
| field label | 13px / 600 ink-2, sentence case, `nowrap` (12.5px in `.form--dense` — the Appendix) | Single Vehicle |
| group title | 14px / 600 ink, sentence case | Single Ticket |
| dock / panel title | 15px / 650 | All Vehicles (dock) |
| button | 14px / 500 | All Vehicles |
| facet · filter | 13.5px / 600 | All Vehicles |
| view tab | 13.5px / 500 | All Leads |
| status chip | 13px / 600, sentence case | All Vehicles |
| flag tag | 12px / 600, sentence case, with its glyph | All Vehicles |
| caps key | 11px / 700, **+0.08em**, CAPS ink-3 — **only** table heads and spec-plate keys | All Vehicles |
| mono id | 12.5–13px Plex Mono | All Vehicles |

- **Caps is for keys, never for names.** A card title, chip, tag, button and field label are sentence case.
- **One role, one look, on every page.** When a shared rule from another page leaks in, pin the role
  back in the shared block and say so.
- **Weight carries the hierarchy, not new sizes.**

---

## 19 · Board — the dark row of cards at the top of a page

Origin: All Vehicles (Lot · Age mix · Value · Needs attention). All Leads, Single Lead, Single Ticket
and Accounting (a board of tiles) follow.

- `--focal` surface, `--r-l` radius, one row; the cards share its height (All Vehicles: 220px at
  1440×900)
- inset 24px at the sides, ~20px at the top; the card title starts at 24px in every card
- header: title left (board card title), meta right (board meta) or a Demo tag

| content | how |
|---|---|
| hero | one hero figure + one board label (Lot, Lead board) |
| rows | figure + label per row, hairline between, rows spread over the height (Value, Assigned, Activity) |
| tiles | 2 × 3 clickable tiles: figure, label, meter, % — chosen = brand fill, the check replaces the % |
| facts | caps key over value, two columns, hairlines, rows spread over the height (Lead facts) |
| object | a 3:2 photo, its name, its id, one route out (Vehicle of interest) |
| message | the quote, then contact tags (§33) at the foot |
| lanes | the Lot card's view lanes: 24px, radius 6px, 12.5px; chosen = brand fill (§6) |

Content never packs at the top over an empty bottom (`flex: 1; grid-auto-rows: 1fr`). One fact, one
place — a fact on the board is not repeated beside it.

---

## 20 · Disclosure — four patterns, chosen by place

Anything that opens looks openable at rest (a surface or frame, and a visible chevron) and changes
visibly when open.

| pattern | origin | at rest → open |
|---|---|---|
| sheet accordion row (`.acc`) | All Vehicles' vehicle sheet; All Leads' lead sheet | title + summary + chevron → chevron turns, summary hides |
| chip with chevron | Single Vehicle "Standard equipment" | chip → brand-soft fill, brand line, chevron turns |
| bar with a framed chevron (`.vacc`, `.glacc`) — the default when it must read as openable | Single Lead "Vehicle fields"; My Work Queue "Go Live List" | grey bar, white chevron button → bar and fields framed as one block, the button turns brand |
| Show / Hide button | Single Ticket "Changelog" | "⌄ Show" → "⌃ Hide" |

Default closed when the content repeats something visible; open by itself when it is the only way to
act (Single Lead opens Vehicle fields when the lead has no vehicle). A save never folds it.

---

## 21 · Record head — the card at the top of a record page

Origin: Single Vehicle. Single
Lead, Single Ticket and Dealer Edit follow.

One sheet card: `--sheet`, `--r-card`, `--sh-soft`, padding 12 / 24 / 24, not sticky.

| row | holds |
|---|---|
| 1 | the way back (quiet small button, pulled 12px into the inset) at the left; the record actions at the right — Prev / Next, Print, the primary save |
| 2 | the record's title (page-title role); on Single Vehicle a 72×48 thumbnail before it and the price (board-figure role) at its right |
| 3 | state chips (status-chip role, 24px / 7px), a switchable state chip if any (§6), **the id pill**, then the dates in 13px ink-3; the dates wrap to their own line without a leading dot |

**Id pill** (`.chip--id`, Single Vehicle `.idp`; one shared definition): 26px pill, padding 0 10px,
1px `--line-3` ring, label 12.5px / 500 ink-3, number Plex Mono 12.5px / 600 ink-2 ("Ticket number: 1047015").

Facts are not repeated: the dates live here, not on the board. On the dealer shell the page grid holds
the head row at `--headh` (68px); a page with the card sets `--headh: auto`.

**List pages** (All Vehicles and every later list page) have no card: one row, `h1` and its context
in one quiet line ("title · context", 14px ink-3), no caps section eyebrow — the platform bar already
names the section; the page actions at the right.

---

## 22 · Feed entries — actions, replies, removal

Origin: Single Ticket's Ticket History. It is the rule for every feed of posts,
including Single Lead's Activity (an earlier page, the same kind of element).

- **Entry:** a white card, radius 10px, padding 12 / 14, 1px `--line-2` ring (hover `--line`), 8px between
  entries, no timeline rail. Its kind is a sentence-case tag 12px / 600 ink-3 ("Note", "Mail", "Message").
- **Actions row** under the text: **Reply** first (outline pill, brand ink — the entry's main action, not a
  fill); **Edit** quiet beside it; **Remove** in danger text at the far right, under the date; it asks
  first and is logged where production logs it.
- **Reply is what the entry is:** under a client's message it answers the client (client-visible, says so
  in brand ink); under an internal note or ToDo it is an internal note.
- **Replies are a tree, card to card:** a branch leaves the answered card's bottom edge 20px in, turns
  (10px radius) into each reply's left edge at its avatar; a reply to a reply is 40px in, four levels
  max; replies in the order written.
- **A typed feed is sectioned, not filtered:** each type its own section, always shown, in
  a fixed order, a 3px tone rail on its left; the sections stand in the page's section navigator, each
  with a dot of its tone. Nothing filters.
- **The post box** of a section is one tinted card in its tone (header + composer), fields white inside.
- **A state is a mark, not a section:** "Waiting on client" is a box beside the post action, the same
  flag as the head's switchable chip.
- **Files** go with any post; a posted file sits in its entry and in the page's file list.

---

## 23 · Shared definitions — what `_aan-components.css` owns

The `ONE SYSTEM` block at the end of `_aan-components.css` is the single definition of: button radius
and the primary style · state chips (24px / 7px / 13 / 600) · the Demo tag · the menu sub-entry ·
the section title · the page-title width · the platform-bar inset and mark position · the avatar size ·
global-search typed text · the facet colour · menu-item colours · the record id pill. Everything else
listed in §24–§36 is defined in the origin page's file and the family; moving each into the shared
block is the backlog `tools/ds-check` prints.

---

## 24 · Form controls — input, select, textarea

Origin: All Vehicles (the popover search field and the dock's select); Single Vehicle for the editor.

| control | spec |
|---|---|
| text input (`.fld`, `.in`) | 36px · radius 7px · padding 0 10px (12px in the editor) · 14px / 400 ink · 1px `--line-3` (border on the dealer pages, an inset ring on Dealer Edit — the same edge) · placeholder ink-4 |
| select | 36px · radius 7px · 14px / 500 · our own chevron 12px from the right edge (`.ui-select`) |
| textarea | radius 7px · padding 8px 12px · 14px / 1.45 · vertical resize |
| mono input | Plex Mono 13px (VIN) |
| large figure input | 48px · 18px / 600 (Single Vehicle's price) |
| field label | §18 — above the control, 3–6px gap |
| required | the label carries it; never colour alone |
| missing value (Dealer Edit) | `--signal-soft` fill, `#efcd93` ring |

Heights on later pages differ (the Appendix, decision 1). Validation results stand beside the action
that produced them (§11).

---

## 25 · Checkbox, switch, segmented control, status picker

**Checkbox** — Origin: All Vehicles (`.ck`): 16×16, radius 5px, 1.5px `--line-3` edge, white; checked
`--brand-btn` fill with a white 8×5 tick; hover edge ink-4. Never the native box (the Appendix).

**Switch** — Origin: All Vehicles (`.sitesw`, the row's "On website"): 34×20 pill track, 16px white thumb;
on = `--ok`; off where off is a problem = `--danger` track, danger-soft chip and the label "Hidden on site"; the
control is as wide as its longer label in both states. Single Vehicle's `.sw` (42×24; on = `--ink`, `--brand` in the
visibility rows, `--danger` in a danger row) and My Work Queue's (30×18) converge on it — waiting for Alex.

**Segmented control** — Origin: All Vehicles (`.seg`, Rows / Gallery): one object — a sunken 36px pill
track, padding 3px, white 30px pill thumb with `--sh-pill`, ink-2 labels. Dealer Edit's Yes / No follows.
Anything that is not segmented gets real separation.

**Status picker** — Origin: Single Vehicle (Available / Sold / Pending, Used / New): a 46px track,
radius 9px, padding 5px; 36px segments, radius 7px, 14px / 600; the chosen state takes its tone fill
(Available `--ok`, white label). A three-way record state, not a view switch.

---

## 26 · Command band — search, facets, quick filters, view tabs

Origin: All Vehicles.

- **Command search** (`.search` in `.cmd`): 36px · radius 14px · padding-left 16px · white · `--sh-pill` ·
  glyph 16px ink-3 · input 15px ink, placeholder ink-4 · a `/` hint at the right. Manage Dealers,
  Accounting and My Work Queue follow (My Work Queue keeps a 1px ring instead of the shadow — the Appendix).
- **Facet button** (`.facet__b`): 36px · radius 9px · padding 0 12px · 13.5px / 600 ink-2 · white with
  `--sh-pill`; key muted 12px, value ink; chevron 13px. A secondary facet sits on `--wash` with a 1px
  `--line-2` ring. On (a filter set, the dock open): brand-soft fill, 1px `#cddbfb` ring. Count badge
  `.facet__cnt`.
- **Quick filters** (`.qf`): 34px · radius 9px · padding 0 10px · 13px · `--wash` with a 1px `--line-2`
  ring; hover `--well`.
- **View tabs** — Origin: All Leads (All Vehicles only has the board lanes, §19): a row
  (`.ui-views`) of 30px tabs, radius 7px, padding 0 12px, 13.5px / 500 ink-2, count 13px / 600; chosen
  per §6. Single Lead, My Work Queue, Single Ticket, Manage Dealers, Accounting follow.
- **Clear all** is the one red text action of the band.

---

## 27 · Chips and tags

| element | origin | spec |
|---|---|---|
| status chip (`.stat`, `.bdg`, `.chip`) | All Vehicles | 24px · radius 7px · padding 0 8px · 13px / 600 sentence case · its tone on its soft fill with a 1px tone ring (ok, new = brand, pending = violet, trade = signal, quiet = slate, won = white with ok ring) |
| flag tag (`.tag--flag`) | All Vehicles | 24px pill · padding 0 8px · 12px / 600 sentence case · ink-2 on `--wash`, 1px `--line-2` ring · its glyph first · never clipped; `+N` for the rest |
| record id pill | Single Vehicle | §21 |
| Demo / Mock addition | All Vehicles / Single Vehicle | §13 |
| counter badge (`.badge`) | Single Vehicle (section rail) | 18px pill · padding 0 8px · 11px / 600 · sentence case |
| entry kind | Single Ticket | §22 |
| switchable state chip | Single Ticket | §6 — the status-chip geometry, outline at rest |
| contact tag | Single Lead | §33 |

**No caps on any chip or tag.**

**Text inset** (Alex, Nov 17: text never touches the edge of its own element). Every word or number in a
filled, ringed or bordered element has at least **8px** each side: tags, chips, counters, `kbd`, the AAN mark,
nav items, the stock link, menu items; **10px** in a button; **16px** beside a divider or card edge. Centred
single-glyph tiles (avatars, the dealer mark, the A / P / T package letters, the photo index and count, a count
on a button) are glyphs and keep their square. One shared block, `TEXT INSET` at the end of
`_aan-components.css`, holds the rule for every page.

---

## 28 · Menus and popovers

Origin: All Vehicles.

- **In-page popover** (`.pop`: Sort, Make, a filter): FLOATING, white, radius 7px, padding 6px, `--sh-soft`,
  272px wide (a wide one 300px). Optional find field at the top (`.fld`, 36px); optional footer with
  Clear (quiet small button) and a note.
- **Platform-bar menu** (`.menu`, nav and account): white, radius 7px, padding 8px, `--el-3`; links
  `.menu__l` 35px, radius 9px, 14px ink.
- **Menu item** (`.mn__it`): a full-width block row, 34px (padding 8px 10px), radius 7px, 14px / 400 **ink**;
  hover `--wash`; chosen **brand-ink 600**; a sub-entry ("--Last 200") indented 24px, 13px ink-3;
  danger item `--danger`.
- **Group label** (`.mn__lab`): 11px / 700 caps ink-3, padding 6px 10px — a key, so caps.
- **Separator** (`.mn__sep`): 1px `--line-2`, 4px inset.
- A popover opens under its trigger, closes on outside click and Escape, and never covers the control
  that opened it.

---

## 29 · Tooltips and hints

Origin: All Vehicles (native `title`); Single Vehicle (the "?" mark, the dark tip, the field help line).

- **Tooltip = the native `title`.** A truncated cell carries its full text in `title`; internal names
  and codes may appear **only** there.
- **"?" mark** (`.f__q`, Single Vehicle — the only page that has one): a 15px circle, 10px / 700 white
  on ink-4, 2px after its label, `cursor: help`, focusable (`tabindex="0"`, focus ring §12); the text
  is in `title` and `aria-label`.
- **Dark tip** (`.lock__tip`, Single Vehicle's edit lock): 300px, padding 10px 12px, radius 7px,
  13px / 1.45 white on ink, shown on hover and focus, `opacity` only — it never moves the layout.
- **Field help line** (`.f__help`): 13px / 1.45 ink-3 under a control — only where the original has
  the same line.
- **No explanatory text on dealer pages** beyond that. A staff page may state a state the user
  must know ("Client-visible — …", `.hint` 13px ink-3).

## 30 · Empty and not-set states

Origin: All Vehicles.

- **Empty list** (`.empty`): centred in the field, padding 48px 16px, 14px ink-3, one action as a
  brand 600 text button beside the sentence. A lane with nothing in it (`.empty--lane`): min-height
  296px, a 16px / 650 ink line over a 14px ink-3 line.
- **Empty popover** (`.pop__empty`): padding 16px, 14px ink-3.
- **Not-set value**: "—" or "not set" in ink-4, in the value's own font (mono for an id). Never blank.
- An empty state reserves the space the content will take — nothing jumps when it fills.

---

## 31 · Dock — the side panel

Origin: All Vehicles (Filters). Single Lead (Workflow) and Single Ticket (Assigned To) follow.

FLOATING to the right of the field, one gutter from it, radius 12px, `--el-2` (Single Ticket
`--sh-soft`), 440px wide (Single Lead and Single Ticket 400px — the Appendix).

| part | spec |
|---|---|
| head `.dock__h` | 58px · padding 0 12px 0 24px · 1px `--line-2` under it |
| title `.dock__t` | 15px / 650 |
| context `.dock__c` | 14px ink-3, fills the row |
| close `.dock__x` | 34×34 · radius 9px · glyph 16px ink-2 · hover `--wash` |
| body `.dock__b` | padding 16px 24px, scrolls inside |
| foot `.dock__f` | padding 12px 24px; the note 13px ink-3 at the left ("No unsaved changes"), actions right |

**A list's Filters dock stands beside the list only where the list still fits beside it** (Alex, 18 Nov 2026):
the list must keep at least the room it has at 1440 with the dock closed, so nothing in it changes. Narrower, the
dock lies **over** the list instead: at its right, a 16px inset in, starting under the list's controls (search band,
scope line, top pager: it covers no control), sticking under the stuck search band on scroll, `--el-3`. The list
does not move, no column steps aside and no track changes for the dock.

| list | dock | beside from | over |
|---|---|---|---|
| All Vehicles (Filters) | 440 | 1900 (list 1412 vs 1408) | 1280–1899; below 1280 the tablet overlay |
| My Work Queue (Filters) | 440 | 1900 (list 1412 vs 1408) | 1280–1899; below 1280 the tablet overlay |

Classes: `.dock-beside` / `.dock-over` (All Vehicles), `.dock-open` + the 1280–1899 block (My Work Queue). All
Vehicles' older `.dock-open`, which dropped Status, Trim, Color, Mileage and Spec and used narrower tracks, is no
longer set; its rules stay in the quarantine, unused. My Work Queue's dock is closed by default, stays open until it
is closed, and the browser remembers it (Bill, 11 Nov).

**A work panel is not a filter dock**: Single Lead's Workflow, Single Ticket's and Create A Ticket's Assigned To are
worked on together with the record beside them, so they always stand beside it and narrow the content.

---

## 32 · Save bar

Origin: Single Vehicle. Dealer Edit follows (floating, right-aligned over the form, 52px, `--r-card`, `--el-2`).

A bar fixed at the foot of the viewport while the record is long: "N unsaved change(s)" 14px / 600 at
the left; a 1px divider; buttons 34px, radius 9px, 14px / 600 — Review changes, Discard (danger text),
Save Vehicle. It counts changes, it does not hide; with nothing changed the save is disabled.
Dealer Edit shows `Ctrl+S` as a 12px ink-4 hint.

---

## 33 · Copy button and contact tags

**Copy button** — Origin: Single Vehicle (`.copy` in the id pill): 20×20, radius 6px, glyph 13px ink-4;
hover ink; `.copy--done` shows the tick for a moment without changing size.

**Contact tag** — Origin: Single Lead (`.ctag`, on the dark board): 32px, radius 8px, padding 0 4px 0 10px,
fill `rgba(255,255,255,.055)`, line `rgba(255,255,255,.07)`, a 14px glyph, the value (email in `--font`,
phone in `--mono` 12.5px), a 24×24 copy button (radius 6px). Single Ticket's dealer card follows.

---

## 34 · Icons

Origin: All Vehicles (`.i`). One stroke set: `fill: none; stroke: currentColor; stroke-width: 1.6;
round caps and joins`, drawn from the page's `<symbol>` sprite.

| size | where |
|---|---|
| 16px | default — inside buttons, facets, fields, the dock |
| 17px | platform-bar utilities (`.tbtn`) |
| 14px | the global search, small buttons, text links, contact tags |
| 13px | chevrons in nav items and facets; copy |
| 12px | in-chip glyphs and chip close (stroke 2.2) |

An icon never carries meaning alone: a label or an `aria-label` goes with it.

---

## 35 · Links

Origin: All Vehicles.

- **Row link** (the record's id in a list): Plex Mono 13px / 700 brand-ink, no underline; hover brand.
- **Text action** (`.linkbtn`, "Show all 23 makes"): 14px / 600 brand-ink, optional 14px glyph; hover brand.
- **Links in running text**: brand-ink, underline on hover.
- A link goes to a Gen 11 page or says where it goes (an external glyph for an outside site).

---

---

# PART II — BUILDING A PAGE

Part I says what each thing looks like. Part II says how to build a page from it without asking.
Every class name below is real and is styled by the files a page loads; copy the markup, change the
words.

## 36 · Starting a page

**Every new page starts from the template page of its type (§37):** copy its HTML, its page CSS and
its JS skeleton, keep the platform bar and the sprite as they are, and replace the content. There is
no separate component stylesheet yet: components are styled by the template page's CSS plus the two
shared files, which is why a page is never built from an empty file.

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page title · Dealer name — AAN</title>
<link rel="stylesheet" href="<template-page>-gen11.css?v=YYYYMMDD-x">   <!-- 1 page / template CSS -->
<link rel="stylesheet" href="../_aan-family.css?v=YYYYMMDD-x">          <!-- 2 tokens + platform bar -->
<link rel="stylesheet" href="../_aan-components.css?v=YYYYMMDD-x">      <!-- 3 shared, always last -->
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <!-- the icon sprite, copied from the template: <symbol id="i-search" viewBox="0 0 24 24">…</symbol> -->
</svg>
<div class="app" id="app">
  <header class="top">…copied from the template, nav for this side…</header>
  <!-- zones of the page type, §37 -->
</div>
<script src="<page>-gen11.data.js?v=…"></script>
<script src="<page>-gen11.js?v=…"></script>
</body>
</html>
```

- A dealer page loads `all-vehicles-gen11.css` first and its own CSS second (All Leads, Single Lead do).
- Icons: `<svg class="i"><use href="#i-name"/></svg>`; add a symbol to the sprite, never an `<img>`.
- The platform bar is copied whole from a page of the same side; the current section gets
  `nav__it--on` on its `.nav__it`.
- Every stylesheet that changes gets a new `?v=` in every HTML file that loads it.

## 37 · Page types

Every page is one of these five. A page that fits none of them goes to Alex before it is built.

### 37.1 List page — template: All Vehicles (`pages/dealer/all-vehicles-gen11.*`)

For: many records of one kind to find, filter and act on (inventory, leads, tickets, dealers, billing).
Followed by All Leads, My Work Queue, Manage Dealers, Accounting.

```html
<div class="app" id="app">
  <header class="top">…</header>
  <div class="head">                                   <!-- 1 page head, one row -->
    <h1>Vehicle Inventory</h1>
    <span class="head__sp"></span>
    <button class="btn btn--sheet" type="button"><svg class="i"><use href="#i-down"/></svg> Export</button>
    <button class="btn btn--primary" type="button"><svg class="i"><use href="#i-plus"/></svg> Add vehicle</button>
  </div>
  <section class="bento" aria-label="…">…board cards, §19…</section>   <!-- 2 board (optional) -->
  <section class="field" aria-label="…">               <!-- 3 the list -->
    <div class="cmd ui-toolbar">…search, facets, view toggle, §38.8–38.10…</div>
    <div class="sub ui-toolbar ui-toolbar--sub">…scope line, quick filters…</div>
    <div class="foot pgr pgr--top" aria-label="Pages">…pager, §38.17…</div>
    <div class="rows ui-table">
      <div class="hd ui-thead">…head keys…</div>
      <div id="tb">…rows…</div>
    </div>
    <div class="foot pgr" aria-label="Pages">…pager…</div>
  </section>
  <aside class="dock" id="dock" aria-label="Filters">…§31…</aside>  <!-- 4 dock (optional) -->
</div>
```

Order: platform bar → page head → board → field (command band → sub band → pager → head → rows →
pager) → dock. View tabs (§38.10) sit in the sub band or above the command band when the list has
queues. Components: buttons, board, command search, facets, quick filters, view tabs, status chips,
flag tags, checkbox, menus/popovers, pager, A–Z (long alphabetical lists), empty state, dock,
in-row expansion (§8).

### 37.2 Record view — template: Single Vehicle (`pages/dealer/single-vehicle-gen11.*`)

For: one record edited in many sections (a vehicle, a long settings record).

```html
<div class="app" id="app">
  <header class="top">…</header>
  <div class="cockpit cockpit--card" id="cockpit">      <!-- 1 record head card, §21 -->
    <div class="cock__top">
      <a class="btn btn--quiet btn--sm cock__back" href="all-vehicles-gen11.html"><svg class="i"><use href="#i-left"/></svg> Back to inventory</a>
      <span class="cock__sp"></span>
      …Prev / Next (btn--sheet btn--sm btn--icon), Preview, Save (btn--primary btn--sm)…
    </div>
    <div class="cock__main">…thumbnail, <h1 class="cock__t">2023 Ferrari 812 GTS</h1>, price…</div>
    <div class="cock__sub">…status chip, id pills, dates…</div>
  </div>
  <div class="body">
    <nav class="rail ui-nav" id="rail" aria-label="Sections">…section rail…</nav>   <!-- 2 rail -->
    <div class="zones" id="zones">                                                  <!-- 3 sections -->
      <section class="zone" id="zStatus" aria-labelledby="t-status">
        <div class="zone__h"><h2 class="zone__t" id="t-status">Status &amp; Visibility</h2></div>
        <div class="zone__b">…fields, §38.11…</div>
      </section>
    </div>
  </div>
  <div class="savebar" id="savebar">…§32…</div>                                     <!-- 4 save bar -->
</div>
```

Order: platform bar → record head card → rail | sections → save bar. Components: record head, id
pills with copy, section rail with counter badges, section titles, fields, switches, status picker,
segmented controls, chips with chevron, save bar, "?" marks.

### 37.3 Record with a feed — template: Single Ticket (`pages/staff/single-ticket-gen11.*`)

For: one record that is worked through posts over time (a ticket, a lead). Single Lead follows.

```html
<div class="app dock-open" id="app">
  <header class="top">…</header>
  <div class="head head--card">                         <!-- 1 record head card, §21 -->
    <div class="head__top">
      <a class="btn btn--quiet btn--sm" href="my-work-queue-gen11.html"><svg class="i"><use href="#i-left"/></svg> Back to queue</a>
      <span class="head__sp"></span>
      <span class="walk" role="group" aria-label="Record navigation">…Prev / Next…</span>
      <button class="btn btn--sheet btn--sm" type="button">Print</button>
      <button class="btn btn--primary btn--sm" type="button">Save Ticket</button>
    </div>
    <h1>SEO and Buy Cars Start</h1>
    <div class="head__sub">
      <div class="chips"><span class="chip chip--proj chip--dot">Marketing Project Open</span></div>
      <span class="chip chip--id"><span class="head__k">Ticket number:</span> <b>1047015</b></span>
      <span class="head__meta">opened 03/31/2026 · last activity 06/15/2026 8:45 PM</span>
    </div>
  </div>
  <section class="bento">…board: the related party, the record's figures…</section>  <!-- 2 board -->
  <section class="field">                                                             <!-- 3 sections -->
    <nav class="secnav ui-views" aria-label="Sections on this page">…section navigator…</nav>
    <section class="sec" id="s-thread"><div class="sec__h"><h2>Ticket History</h2></div>…feed, §22…</section>
  </section>
  <aside class="dock" id="dock">…the record's side task (Assigned To, Workflow)…</aside>  <!-- 4 dock -->
</div>
```

Order: platform bar → head card → board → section navigator + sections (the feed is one of them) →
dock. Components: head card, board, view tabs as section navigator, section titles, feed entries,
post boxes, replies, files, dock, form fields.

### 37.4 Edit form — template: Dealer Edit (`pages/staff/dealer-edit-gen11.*`)

For: one record that is mostly a long form (a dealer, a user, a setting group).

```html
<div class="app" id="app">
  <header class="top">…</header>
  <header class="head" id="head">…head card rows as §21: back · title · status chips, id pill, audit…</header>
  <div class="body" id="body">
    <nav class="rail ui-nav" id="rail">…zones…</nav>
    <div class="zones" id="zones">
      <section class="zone" id="zIdent" aria-labelledby="zIdent-h">
        <header class="zone__hd"><h2 class="zone__t" id="zIdent-h">Identity &amp; Status</h2></header>
        <div class="fg">
          <div class="fw"><label class="fl" for="f1">Account Status</label><select class="fld" id="f1">…</select></div>
        </div>
      </section>
    </div>
    <aside class="side" id="side"><section class="panel"><div class="panel__hd">Options</div><div class="panel__bd">…</div></section></aside>
  </div>
  <div class="savebar" id="savebar" role="status">…Discard · Save Dealer (btn--primary) · Ctrl+S…</div>
</div>
```

Order: platform bar → head card → rail | zones | side panels → floating save bar.

### 37.5 Login — template: Dealer Login (`pages/dealer/dealer-login-gen11.html`, `dealer-login-video.css`)

Its own world: no platform bar, no shared CSS. Copy it whole; change only words and links.

## 38 · Component reference

Format: **purpose · origin · markup · states · do / don't.** States not listed behave as the default.
Two rules apply to every component: **nothing moves when a state changes** (reserve the space), and
**every interactive element has a visible hover and the §12 focus ring.** Loading: a region keeps its
final size and shows "Loading…" in 13px ink-4 where the value will be; a submitting button is
`disabled` with its label unchanged. Error: the message stands beside the action that failed, in
`--danger`, 13px (§11). Long content: one line with ellipsis and the full text in `title`, unless the
component says it wraps.

### 38.1 Button
Purpose: an action. Origin: All Vehicles.
```html
<button class="btn btn--primary" type="button"><svg class="i"><use href="#i-plus"/></svg> Add vehicle</button>
<button class="btn btn--sheet" type="button">Export</button>
<button class="btn btn--quiet" type="button">Inline edit</button>
<button class="btn btn--sheet btn--sm" type="button">Print</button>
<button class="btn btn--sheet btn--sm btn--icon" type="button" aria-label="Next vehicle" title="Next vehicle"><svg class="i"><use href="#i-right"/></svg></button>
```
States: hover (primary `--brand-hover`; sheet/quiet `--wash`) · on/toggled (brand-soft, §11) ·
disabled (`disabled`, no shadow, 50% label) · loading (disabled, same label).
Do: one primary per view; sentence-case label ≤ 3 words; an icon-only button has `aria-label` + `title`.
Don't: a second filled button; a pill; a red fill; a button that changes width when its label changes.

### 38.2 Platform bar
Purpose: the application boundary. Origin: All Vehicles. Markup: copy `header.top` from a page of the
same side (§36). States: current section `.nav__it--on`; menus open on click (`data-menu`).
Don't: add page actions to the bar; restyle it in page CSS.

### 38.3 Page head (list page)
Purpose: what the page is and its page actions. Origin: All Vehicles.
```html
<div class="head">
  <div class="head__id"><h1>Manage Dealers</h1><div class="head__meta">365 dealers · View Active Dealers</div></div>
  <span class="head__sp"></span>
  <div class="head__actions"><button class="btn btn--sheet" type="button">Dealers CSV</button><a class="btn btn--primary" href="…">Add New Dealer</a></div>
</div>
```
Don't: a caps eyebrow over the title; a second title line explaining the page.

### 38.4 Record head card
Purpose: which record, its state, the way back. Origin: Single Vehicle. Markup: §37.2 / §37.3.
States: long title — one line, ellipsis, full title in `title`; many chips — row 3 wraps, dates take
their own line. Don't: repeat the dates or the id on the board; make it sticky.

### 38.5 Board card
Purpose: the page's figures, at a glance, clickable where they filter. Origin: All Vehicles.
```html
<section class="attn" aria-label="Needs attention">
  <div class="attn__h"><h2>Needs attention</h2><span class="s">click to filter the list</span></div>
  <div class="attn__g">
    <button class="ar" type="button" data-attn="no_price"><span class="ar__n">133</span><span class="ar__b"><span class="ar__l">No price</span><span class="ar__m"><i style="--w:37%"></i></span></span><span class="ar__p">37%</span></button>
  </div>
</section>
```
States: tile chosen = brand fill, the check replaces the %; a zero figure stays legible (ink-3), never hidden.
Do: one content kind per card (§19). Don't: pack content at the top of a card; repeat a fact.

### 38.6 Status chip
Purpose: the state of a record. Origin: All Vehicles.
```html
<span class="stat stat--ok">Available</span>      <!-- --ok --new --active --pend --trade --quiet --won -->
```
States: none (not interactive). Long: never truncated; the column is sized to the longest state.
Do: sentence case, the record's own state word. Don't: caps; a pill; a chip for a count.

### 38.7 Flag tag, counter badge, Demo, Mock addition
Purpose: a flag on a record / a count / provenance. Origin: All Vehicles; Single Vehicle; Single Lead; Single Vehicle.
```html
<span class="tag tag--flag"><svg class="i"><use href="#i-tag"/></svg>No price</span>
<span class="tag tag--more">+3</span>
<span class="badge">64</span>          <span class="badge badge--ok">yes</span>
<span class="demo">Demo</span>         <span class="chip-src">Mock addition</span>
```
Do: show at most two flags and `+N`. Don't: caps; a flag in red unless it is Hidden on site.

### 38.8 Command search
Purpose: find within the list. Origin: All Vehicles.
```html
<label class="search"><svg class="i"><use href="#i-search"/></svg><input type="search" id="q" placeholder="Find a vehicle — stock, VIN, year, make, model, color…" autocomplete="off"><kbd>/</kbd></label>
```
States: focus — the §12 ring; typed — results update, the pager says how many; no result — §38.18.
Don't: a search button; a second search for the same list (Manage Dealers' phone search is a different key).

### 38.9 Facet button and popover
Purpose: one filter or sort with few values. Origin: All Vehicles.
```html
<div class="facet">
  <button class="facet__b" type="button" data-pop="p-sort"><span class="facet__k">Sort</span><span class="facet__v" id="sort-v">When added ↑</span><svg class="i"><use href="#i-chev"/></svg></button>
  <div class="pop pop--right mn" id="p-sort">
    <div class="caps mn__lab">Sort by</div>
    <button class="mn__it mn__it--on" type="button"><svg class="i"><use href="#i-check"/></svg>Stock</button>
    <button class="mn__it" type="button"><svg class="i"><use href="#i-check"/></svg>Year</button>
    <div class="mn__sep"></div>
  </div>
</div>
```
A list of many values: `.pop` with `.pop__search` (`input.fld`), `.pop__list` of
`label.pop__it` + `input.ck`, `.pop__foot` with Clear. States: open — `pop--open`; value set — the
facet shows it in `facet__v`; on — `facet__b--on`; nothing to show — `.pop__empty`.
Don't: a native `<select>` in the command band; a popover that covers its own trigger.

### 38.10 View tabs (lanes) and section navigator
Purpose: switch the saved view of a list / jump between sections of a record. Origin: All Leads.
```html
<div class="lanes ui-views" role="group" aria-label="Lane">
  <button class="lane ui-view ui-view--on" type="button" aria-pressed="true"><span>Search — all leads</span><b>16,574</b></button>
  <button class="lane ui-view" type="button" aria-pressed="false"><span>New Mail</span><b>5</b></button>
</div>
<nav class="secnav ui-views" aria-label="Sections on this page">
  <a class="secnav__b ui-view ui-view--on" href="#s-overview" aria-current="true">Overview</a>
  <a class="secnav__b ui-view" href="#s-activity">Activity <b>4</b></a>
</nav>
```
States: chosen — brand fill, same weight; zero — count stays, ink-3. Don't: two rows of tabs; a tab
that filters a feed (§22).

### 38.11 Field (label + control)
Purpose: one value to read or edit. Origin: Single Vehicle (label), All Vehicles (control).
```html
<label class="f"><span>Stock #</span><input class="fld" type="text" name="stock" autocomplete="off"></label>
<label class="f"><span>Status</span><select class="sel" id="wf-status">…</select></label>
<label class="f"><span>Message</span><textarea class="fld" rows="3"></textarea></label>
```
States: focus — ring; disabled — `--wash` fill, ink-3 text; missing required — `--signal-soft` fill,
`#efcd93` ring and the label says it; invalid — danger text under the field, 13px; empty read-only
value — "not set" ink-4. Do: label above, sentence case. Don't: placeholder instead of a label; caps labels.

### 38.12 Checkbox, switch, segmented control, status picker
Origin: All Vehicles; Single Vehicle; All Vehicles; Single Vehicle.
```html
<input class="ck" type="checkbox" aria-label="Select lead Patrick Weber">
<label class="sw"><input type="checkbox" aria-label="Specials"><span class="sw__t"></span></label>
<div class="seg" role="group" aria-label="View">
  <button class="seg__b seg__b--on" type="button" aria-pressed="true" aria-label="Rows"><svg class="i"><use href="#i-table"/></svg></button>
  <button class="seg__b" type="button" aria-pressed="false" aria-label="Gallery"><svg class="i"><use href="#i-cards"/></svg></button>
</div>
```
Status picker: the same `.seg` markup inside a status field (`.f.scard--status`), §25.
States: checked / on / chosen as §25; disabled — 45% opacity, `cursor: default`. Don't: a native box;
a switch for something that needs Save to take effect without the save bar counting it.

### 38.13 Menu (platform bar) and popover menu
Origin: All Vehicles. Bar menus: `.menu` with `.menu__col`, `.menu__t` (caps key), `a.menu__l` (`<b>` name
+ `<span>` one-line description). In-page: §38.9. States: chosen — `mn__it--on` / `menu__l--on` + `aria-current`;
danger — `mn__it--danger` last; sub-entry — `mn__it--sub`. Don't: icons on every item; more than one level.

### 38.14 Dock
Purpose: a side task for the page or the open record, beside the list. Origin: All Vehicles.
```html
<aside class="dock" id="dock" aria-label="Workflow">
  <div class="dock__h"><h2 class="dock__t">Workflow</h2><span class="dock__c">#16994</span><button class="dock__x" type="button" aria-label="Close workflow"><svg class="i"><use href="#i-x"/></svg></button></div>
  <div class="dock__b">…</div>
  <div class="dock__f dock__f--row"><span class="dock__note">No unsaved changes</span>…Discard · Save…</div>
</aside>
```
Open: `.app.dock-open` (a work panel) or `.dock-beside` / `.dock-over` (a list's Filters, §31). Don't: a modal.

### 38.15 Save bar
Origin: Single Vehicle. Markup: copy `.savebar` from Single Vehicle (record view) or Dealer Edit (edit
form). States: clean — "0 unsaved change(s)", Review and Discard disabled; dirty — the count, all
enabled; saving — Save disabled, label unchanged; saved — the result beside the button (§11).

### 38.16 Feed entry, post box, reply
Origin: Single Ticket. Markup: copy `li.ev` and `form.composer` from Single Ticket.
```html
<li class="ev ev--message"><span class="ev__i"><svg class="i"><use href="#i-mail"/></svg></span>
  <div class="ev__b"><div class="ev__t"><span class="kind">Message</span><span class="who">Samantha Beck</span></div><span class="ev__n">…</span></div>
  <div class="ev__d">03/31/2026<small>10:26 AM</small></div>
  <div class="ev__acts"><button class="ev__reply ev__reply--main" type="button">Reply</button><button class="ev__reply" type="button">Edit</button><button class="ev__rm" type="button">Remove message</button></div>
</li>
```
States: empty section — the post box alone, the header count 0; long text — wraps, never clipped;
removed — asks first, logged. Don't: filter the feed; put a state in its own section.

### 38.17 Pager
Origin: All Vehicles. Top **and** bottom of every paged list.
```html
<div class="foot pgr pgr--top" aria-label="Pages">
  <span class="pgr__n">Showing <b>1–100</b> of <b>359</b></span><span class="sp"></span>
  <span class="pg"><button type="button" aria-label="Previous page" disabled>‹</button><button type="button" class="on" aria-current="page">1</button><button type="button">2</button><span>…</span><button type="button">4</button><button type="button" aria-label="Next page">›</button></span>
  <label class="pgr__per"><span>Rows</span><select class="sel sel--sm" aria-label="Rows per page"><option>50</option><option selected>100</option></select></label>
</div>
```
One page only: the pager still shows "Showing 1–12 of 12", the buttons disabled.

### 38.18 Empty, not set
Origin: All Vehicles. List: `<div class="empty">No vehicles match. <button type="button">Clear filters</button></div>`.
Lane: `<div class="empty--lane"><b>No pending vehicles</b><span>Pending sales will appear here.</span></div>`.
Value: `<span class="none">not set</span>` (ink-4). Don't: a blank cell; an illustration.

### 38.19 Id pill with copy, contact tag
Origin: Single Vehicle; Single Lead.
```html
<span class="idp"><span class="idp__k">Stock:</span> <b>0P0300236 PS</b><button class="copy" type="button" data-copy="stock" aria-label="Copy stock number" title="Copy stock number"><svg class="i"><use href="#i-copy"/></svg></button></span>
<span class="chip chip--id"><span class="head__k">Ticket number:</span> <b>1047015</b></span>
<span class="ctag"><svg class="i"><use href="#i-mail"/></svg><b title="name@example.com">name@example.com</b><button type="button" data-copy="name@example.com" aria-label="Copy email address"><svg class="i"><use href="#i-copy"/></svg></button></span>
```
States: copied — `.copy--done` shows the tick, same size.

### 38.20 "?" mark and tooltip
Origin: Single Vehicle; All Vehicles.
```html
<span class="f__l">Status (sold)<i class="f__q" tabindex="0" title="Switching to Sold clears Pending Sale when you save." aria-label="Switching to Sold clears Pending Sale when you save.">?</i></span>
<div class="clip-c" title="Full text of the cell">Full text of the cell</div>
```
Don't: a "?" on a dealer page where the original has none; an internal code outside `title`.

### 38.21 Disclosure
Origin: All Vehicles (`.acc`); Single Lead (`.vacc`).
```html
<section class="acc vacc">
  <h3><button class="acc__h" type="button" aria-expanded="false" aria-controls="acc-x"><span class="acc__t">Vehicle fields</span><span class="acc__s">Stock 21902 · 2015 Aston Martin Vanquish</span><svg class="i"><use href="#i-chev"/></svg></button></h3>
  <div class="acc__p" id="acc-x" inert><div><div class="acc__in">…</div></div></div>
</section>
```
States: open — `aria-expanded="true"`, `acc--open`, chevron turns, `inert` removed.

### 38.22 A–Z jump
Origin: Manage Dealers.
`<nav class="az" aria-label="Jump to letter"><button class="az__b" type="button" data-jump="A">A</button>…</nav>`
A letter with no rows: `disabled`.

## 39 · Which pattern for which need

| need | use | not |
|---|---|---|
| show more of something already summarised | disclosure, closed (§20) | a modal |
| the only way to act is inside it | disclosure, open by default | a hidden form |
| a whole optional section | Show / Hide button | an accordion of one |
| narrow a list by one dimension with few values | facet button + popover | a native select in the band |
| narrow a list by many dimensions | Filters → dock | a second filter bar |
| saved views of one list | view tabs | facets |
| parts of one record | section navigator (record) or rail (long form) | tabs that hide content |
| types of posts in one feed | sections, all shown | filter pills |
| the state of a record | status chip | a flag tag, a badge |
| a flag on a record (missing, off) | flag tag with glyph | a status chip, red |
| a count beside a label | counter badge / `<b>` in a tab | a chip |
| an id, VIN, phone, code someone copies | `--mono`, with a copy button in a record head | mono for names, money, dates |
| money, dates, counts | `--font`, `tabular-nums` | mono |
| result of a save / validation | beside the button that produced it, 16px left | a toast, an alert box |
| unsaved changes on a long record | save bar | a sticky primary button |
| a side task on the same page | dock | a new page, a modal |
| a destructive action | danger text, far end, confirm first | a red fill |
| an explanation | `title` / "?" mark (where the original has one) | a paragraph on a dealer page |
| no data | empty state sentence + one action | a blank area |
| provenance unknown / mock | Demo or Mock addition tag | nothing |
| a long alphabetical list | A–Z jump + pager | infinite scroll |
| many rows of the same shape | zebra (§10): every second row in the wash | a divider alone; stripes on a feed or a form |

## 40 · Before you hand in a page

- [ ] It is one of the five page types (§37) and was started from that type's template.
- [ ] Every component is from §38 with its real class names; nothing restyled in page CSS.
- [ ] Only the roles of §18 — no new size, weight, caps or font.
- [ ] Caps only in table head keys and spec keys; chips, tags, buttons, labels in sentence case.
- [ ] One primary button per view; buttons 9px; red only for Hidden on site and Clear all.
- [ ] No explanatory text on a dealer page; internal names and codes only in `title`.
- [ ] Nothing moves on any state change (hover, select, open, save, error).
- [ ] Table columns left-aligned; a pager at the top and bottom of a paged list.
- [ ] Empty, loading, error and long-content states shown in the browser.
- [ ] No horizontal overflow at 1280, 1366, 1440 and 1920, nor at 768, 834, 1024 and 1180 (§41); no console errors.
- [ ] `node tools/ds-check/features.mjs` (after `--save` at 1440 for a new page): every item reachable at every tablet width.
- [ ] Touch: nothing only on hover; every control 36px or an invisible 36px hit area (§41).
- [ ] `?v=` bumped on every changed stylesheet in every HTML that loads it.
- [ ] **`node tools/ds-check/ds-check.mjs` run; no new rule in part (a) for your page and no deviation in
      part (b) that is not in the Appendix.**


---

## 41 · Breakpoints — desktop and tablet

Origin: All Vehicles (the list, the board, the dock); every other page inherits the same rules. The
shared rules live once in `_aan-components.css` (the `TABLET` block) and `_aan-tablet.js`; a page
stylesheet only adds what is its own layout (Dealer Edit's side panels, Single Vehicle's lock tip).

| range | what it is |
|---|---|
| **1280 and up** | desktop. Nothing in the tablet block applies; the desktop build is pixel-identical with and without it |
| **1180–1279** | tablet, landscape: the staff platform bar on two rows, lists scroll in their own container, docks still beside the content |
| **1024–1179** | the dealer bar still on one row; boards reflow; docks become overlays |
| **768–1023** | the dealer bar on two rows too |
| below 768 | not designed |

**Nothing is dropped.** What does not fit wraps, reflows, scrolls inside its own container or moves
behind a visible, labelled control (a menu, the dock toggle). No `display: none` to make room, no
column removed, no smaller type: the §18 roles are the same at every width; controls may grow, text
does not shrink. `node tools/ds-check/features.mjs` proves it: it inventories every nav item, button,
link, field, tab, facet, column head, section, rail entry, board tile and dock trigger at 1440 and
fails if any of them is missing, clipped or hidden without a visible trigger at a tablet width.

**Platform bar.** Where the destinations do not fit in one row (staff below 1280, dealer below 1024)
the bar takes two rows, `--stick-bar: 100px`: the mark, the global search (with its field, never a
bare glyph), the utilities and the identity on the first; every nav group on the second, in the same
order. Menus open under their item as on desktop; on a touch screen a tap opens and closes them.

**Page head.** One row while it fits; the actions wrap to a second row under the title (`--headh:
auto`). Record head cards wrap their action row the same way; the title stays one line.

**Boards** (below 1180): the first card across the row, the others two by two
(`minmax(0, 1fr) minmax(0, 1.8fr)`); a card left alone on its row spans the row. Board type does not
shrink; the tiles get the width instead.

**Lists — the table-scroll rule.** A list never makes the page scroll sideways. Below 1280 the rows
(`#tb`) scroll horizontally inside the field; every row and the column head take the table's own
width (`--tw`, measured from the grid, so they line up); the column head stays sticky on the page and
follows the rows sideways (`--sx`); the record's name / id column (`.stk`, `.ld`, `.c-tkt`, `.c-name`)
stays in view, sticky at the left, with a 1px `--line-2` edge. The zebra (§10) runs the full table
width, the sticky column included. An open row sheet (`.exp`) and the empty state stay in view at
the left. The band under the command band wraps: the scope line on its own row, the filters under
it; the A–Z jump wraps.

**Dock rule.** At 1180 and up the dock stands beside the content. Below 1180 it is an overlay at the
right: fixed under the platform bar, a gutter from the edges, `min(440px, 100vw − 32px)` wide, `--el-3`,
over the page; its own toggle and its close button work as on desktop. A page that opens its dock on
load (Single Lead's Workflow, Single Ticket's Assigned To) starts with it closed at overlay widths.
Side panels that do not fit (Dealer Edit's Options, Danger & Locks) go under the form. A list's Filters dock
lies over the list on desktop too, wherever the list would not keep its 1440 room beside it (§31).

**Touch** (`hover: none` / `pointer: coarse`, in the tablet range). Nothing waits for a hover: row
actions, filter-by-value buttons, the site link and the photo remove button are shown; a "?" mark
and the edit-lock tip open on tap. Every control is at least 36px tall — buttons, nav items, tabs,
facets, menu items and fields grow to 36px; small things (links in cells, glyph buttons, switches,
checkboxes) keep their drawn size and get an invisible 36 × 36 hit area (`::before`).

**Sticky stack.** Bar + command band + column head is 204px at most (20% of 768×1024, 27% of
1024×768); a sticky stack never takes more than a third of a tablet screen.

**Checked at** 768×1024 · 820×1180 · 834×1112 · 1024×768 · 1024×1366 · 1112×834 · 1180×820 · 1279×800,
portrait and landscape, with `node tools/ds-check/ds-check.mjs --widths` (overflow, targets, stack)
and `features.mjs`.

---

## 42 · Dark theme

Approved by Alex on 18 Nov 2026 ("dimmed graphite", v3). It is on for the nine pages that have the account menu.
Two controls switch it:
- **the moon / sun button in the bar**, beside the bell, at 1280 and up (the bar has no room for it at 1180);
- **the "Dark theme" item in the account / user menu**, at every width.
Dealer Login keeps its own video styling.

**The idea in one line:** neutral graphite for everything you work on, and the board alone in navy. That
gives two materials, exactly as in light, where everything is white and the board alone is dark.

**What Alex said, and the rules they became:**
- **Dark is not "as dark as possible".** The ground is `#191b1f`, never black.
- **The type is not white.** It is a soft near-white `#dcdfe5` and steps down from there.
- **Not "everything in a heap".** Surfaces step up in light: ground → sheet → wash → controls.

**Switching it on.** Set `<html data-theme="dark">`. That is the same attribute the new backend already uses.
- The choice is stored in `localStorage['aan-theme']` and is shared by every Gen page.
- A `#dark` / `#light` hash is for review only.
- Dealer pages switch in their page JS; staff pages share `pages/_aan-theme.js`. Both are loaded in `<head>`, so
  the page never paints in the wrong theme.

**Tokens** — `pages/_aan-family.css`, block `html[data-theme="dark"]`:

```
--ground  #191b1f  page ground (in light it equals --wash; in dark it is its own step)
--sheet   #24272d  cards, sheets, fields              --wash  #2d3037  hover, chips
--well    #292c32  tracks — in dark a step ABOVE the sheet (a sunken black read as a hole)
--line    #393d45  --line-2 #30333a  --line-3 #4b505a
--ink     #dcdfe5 11.2:1   --ink-2 #b8bec8 8.0   --ink-3 #a1a8b3 6.2   --ink-4 #9198a4 5.2   (on the sheet)
--brand   #2f6be6 (white on it 4.8)   --brand-ink #9dbdff   --brand-soft #263858
--focal   #1f2f52 board, the row open for inspection   --focal-2 #283b63
--ok #62cf9e  --signal #f2b860  --danger #ff8a7d  --violet #b8a9ff  --slate #adb4c1, each with a -soft fill
```

The staff pages' local palettes (`--t-*` department colours, `--b-*` badges) take the backend's own dark
`--status-*` pairs (5.7–7.2:1).

**Rules**

1. **Re-solve, don't invert.** A token keeps its role, not its lightness. `--well` sinks in light and lifts
   in dark. Hover lightens in dark.
2. **AA is measured on the composited render, not on the token.**
   - A white at 82% that passes on the light brand fails on the lighter dark brand. Counts on a chosen view
     are therefore full white.
   - Any text that sits on a light fill in dark (a section count, the chosen status) takes dark type.
3. **Paper stays paper.** Two areas stay white in dark:
   - the window-sticker preview;
   - the description editor's text area. It previews the dealer's light website, and the stored HTML
     carries its own inline colours (`color:#000000` in the data).

   The editor's toolbar is dark: the skin's icons are inverted and its labels take the ink.
4. **Thumbs and knobs are light.** A switch thumb painted with `--sheet` vanishes on a dark track.
5. **Shadows read again** on a dimmed ground. Each elevation also gets a faint light edge,
   `0 0 0 1px rgba(255,255,255,.05–.08)`.

**For the new backend:**
- `handoff/aan-gen11-theme.css` maps the same backend tokens in its `[data-theme="dark"]` block.
- `handoff/aan-gen11-components.css` routes every literal through a `--g11-*` variable with a dark value.
- `handoff/design-system.html` shows every colour in both themes and draws every component in either
  (switch at the top left).

**Checked:** all nine pages at 1440 · 1280 · 1024 · 768 — no overflow, no text under AA.
- Left as they are on purpose: the decorative "·" separators and the disabled A–Z letters.
- The probe is `node tools/ds-check/dark-audit.mjs <page> [width]`, a dark-surface and composited-contrast audit.

---

## Appendix — open decisions

Design decisions, not mechanical drift. When one is decided, move its rule into its section and delete
it here. `tools/ds-check` prints the measured state of each. **None is open on 18 Nov 2026**: the DS pass
below closed them by the precedence rule (the earlier page wins, All Vehicles first).

**Known in the code, invisible on the page** (for the developers; no visual decision is left in them):
1. **Inert tokens:** `all-vehicles-gen11.css` still declares an older radius scale (`--r-card 24px` …)
   that `_aan-family.css` overrides on load.
2. **Class-name aliases:** later pages carry their own names for origin components — section head
   `.zone__hd` (Dealer Edit) for `.zone__h`, field `.fw` + `.fl` (Dealer Edit) for `.f` + `.f__l`, record
   head `.head--card` for `.cockpit--card`. New pages use the origin names in §38.
3. **`--stick-hd` says 40px; every list's column head measures 48px** (All Vehicles, All Leads, My Work
   Queue, Manage Dealers, Accounting, Feeds Incoming — the same everywhere). The sticky offsets are measured
   by the pages, so nothing on screen depends on the token; correct it with the 162px anchor (§8).
4. **Sticky column head on tablet** follows the rows sideways by a transform driven from the rows' scroll
   (`_aan-tablet.js`); without JavaScript the head stays put while the rows scroll.

**The DS pass, 18 Nov 2026 (Alex: "по правилу, одним заходом").** Each former open item, and what it is now:
- **Field label 13px everywhere.** The dense forms (Single Lead, Single Ticket, Create A Ticket) were 12.5px.
  Below 900px Single Ticket's Work Order takes its narrow arrangement (Classification across, Contact |
  Schedule under it), so no label or date field is cut at 768.
- **One checkbox: All Vehicles' `.ck`** (16px, 5px radius, brand fill, white tick). Single Ticket, Create A
  Ticket (Flag note, ToDo, Waiting, Billable) and Accounting's row checkbox (`bck ck`, was the browser's 14px
  box) now use it, so it also takes the touch hit area.
- **List cells 14px** on Manage Dealers and Feeds Incoming (13px before). Manage Dealers' Reseller column
  became `minmax(140px, .4fr)`: at 1920 it shows every reseller in full; at 1280–1440 the company name keeps
  the slack, so more long names end in an ellipsis than at 13px (235 of 365 at 1280, 42 at 1440).
- **Command search:** `--sh-pill` at rest on every list (My Work Queue had a 1px ring), and one shared focus
  state, the pill plus a 1px brand ring (`_aan-components.css`); All Vehicles had no focus state on it.
- **Two menu states, both already consistent:** the *current page* in a bar menu is a brand-soft fill with
  brand-ink text (`.menu__l--on`, Accounting's nav `.mn__it--on`); the *chosen option* in a list menu is
  brand-ink text with the brand check glyph (Sort, queues). Not one component drawn two ways.
- **Key hint `/` only on the field the key focuses.** ⌘K on the dealer pages focused nothing; `/` in the
  global search of My Work Queue, Manage Dealers, Feeds Incoming, Accounting and Dealer Edit focused nothing
  or another field. Those hints are commented out. `/` stays on the command search (All Vehicles, All Leads,
  Accounting) and on the global search where `/` focuses it (Single Ticket, Create A Ticket). No shortcut was
  added (facelift only).
- **One Filters dock, 440px** (All Vehicles). My Work Queue's was 340; it now stands beside the list from
  1900, as All Vehicles' does (list 1412 vs 1408), and lies over it below. The work panel (Workflow,
  Assigned To) is a different component and stays 400 (§31).
- **Caps only on keys.** Sentence case now: Single Ticket's "Potential" in the contact tag, and the ToDo
  field labels Spent / Est. / Begin / Done by (13px / 600, the field label role). Keys that stay caps: the
  `.tally` group label ("Roster", "Feeds" — the label of a counts line, like a menu's `.mn__lab`), fact and
  tile keys, Dealer Edit's form group labels (`.fsec`).
- **Status and flag shapes.** A status is the status chip (24px, 7px radius, 13 / 600, tone ring): My Work
  Queue's production statuses gained the ring; Manage Dealers' package is the dealer's state, so a status
  chip at 13px. A flag is All Vehicles' flag tag (24px pill, 12 / 600, ring): Manage Dealers' feature tags
  were 22px with a 6px radius. Dealer Edit's database link chip is the record id pill (26px, 12.5px mono,
  `--line-3` ring). My Work Queue's Archived is a switch, a control, not a status.
- **Single Lead's platform bar is the .76 glass** like every other page (it was solid white, for the dense
  form text under it; Single Ticket and My Work Queue carry the same text under the glass).
- **Selects have two roles, both from All Vehicles:** a form select 36px / 7px radius / 14px (30px / 13.5px
  in a dense form), and a toolbar select 36px / 9px radius / 13.5px (All Vehicles' popover rows, Accounting's
  facets, My Work Queue's page size). ds-check measures them as one role and lists the toolbar ones.
- **Column-header height** is one value already (48px) — see item 3 above.

**Decided on 18 Nov 2026 (Alex):**
- the field heights are 36 / 30 (§11);
- Accounting's per-row Pay **stays** as it is;
- no tap-and-hold photo preview on tablet: the larger photo stays one tap away in the row's sheet;
- My Work Queue's table fits 1280 with no horizontal scroll (§10): short heads, `minmax` tracks, two-line
  Dealer / Subject, heads on the top line. Its Filters dock lies over the list below 1900 and pushes it from
  1900 up (§31; 1800 with the 340px dock until the DS pass). It was Bill's side panel (11 Nov); its behaviour is his, only the overlay is new;
- All Vehicles' Filters dock follows the same rule: over the list below 1900, beside it from 1900; the list keeps
  every column with Filters open. Work panels (Workflow, Assigned To) stay beside their record (§31).

- Explanatory lines on dealer pages keep only what the live system has (checked on reseller.aansupport.com).
  The following are commented out, not deleted:
  - Single Lead's "Logged as …" under the note box;
  - Single Vehicle's five visibility-switch descriptions;
  - Single Vehicle's CARFAX description;
  - Single Vehicle's "Renew listing on save" description.

- All Vehicles' Model filter **stays a stub until go-live.** Its popover says "Pick a make first", while the
  live system shows a plain list of every model.
- Single Vehicle's **"Renew listing on save" stays.** It is the live system's `reset_when_added`. There, when a
  car's status changes to Available, a confirm asks "Do you want to reset 'When Added' date to today's? Click
  cancel to keep original date." Gen 11 shows it as a switch in Utilities instead of the confirm.

