# AAN — GEN 11 DESIGN SYSTEM

**Written for:** anyone building or reviewing an AAN Gen 11 page.

This is an operational dealer control panel. Density, legibility and predictable position beat
decoration. Nothing in this document asks for an effect. Every value was read out of the running
pages at 1440×900 (computed style), not proposed in advance; where a number looks arbitrary, the
note says what it is load-bearing for.

Section numbers are stable — code comments cite them (`DESIGN.md §18`). New topics get new numbers;
an old number is never reused for something else.

---

## 0 · How the system works

**Precedence = the order the pages were made** (Alex, 2026-10-30):

```
1 All Vehicles → 2 Single Vehicle → 3 All Leads → 4 Single Lead → 5 Dealer Login
→ 6 My Work Queue → 7 Single Ticket → 8 Manage Dealers → 9 Dealer Edit → 10 Accounting
```

- When two pages disagree, **the earlier page wins.** All Vehicles is the base; Single Vehicle second.
- Each later page inherits everything from the pages before it.
- A pattern first introduced on a later page (the feed and reply tree of Single Ticket) becomes the
  rule for every page after it **and** for any earlier page that has the same kind of element.
- When a rule written in this document contradicts what All Vehicles measures, All Vehicles wins and
  the rule is corrected; the open cases are listed in **Appendix A**, never "fixed" on All Vehicles.

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
its origin page and prints the differences, overflow and console errors. Run it after every change.

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

Checkboxes are **5px** (All Vehicles' `.ck`) — Appendix A.

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
.brand__mk   "AAN" · 37×18 · padding 2px 7px · radius 4px · --brand fill · #fff · 600 12.5px Plex Mono
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
--ink-4    #697181   placeholder, empty      --line   #dfe3ea   divider
--line-2   #e9ecf1   hairline                --line-3 #c5cbd5   control ring
--brand      #1f5fe0  primary action         --ok      #12704a
--brand-ink  #1747b3  brand text, links      --danger  #bd3328
--brand-soft #e9f0fe  tint, bulk selection   --signal  #945000   --violet #5c42c9
--focal      #172234  dark focal surface (board, selected row)    --focal-ink #f3f6fb
```

**Red is for two things only:** Hidden on site, and Clear all (All Vehicles, All Leads; Alex
2026-10-29). Destructive actions use `--danger` text (§11), not a red fill.

Dark mode is gated off (`DARK_ENABLED = false`); its rules stay inert behind `[data-aan-dark]`.

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
- **Row link** (the stock number): Plex Mono 13px / 700 brand-ink, no underline.
- Columns are left-aligned (numbers included) unless a column is a pure figure column with its own head.

**Pager** — Origin: All Vehicles. On top **and** bottom of the list (`.pgr--top`, `.pgr`): a 48px bar
in the field, "Showing 1–100 of 359" 14px ink-3 at the left; page buttons 30×30, radius 8px,
14px / 500 ink-2, the current page ink fill with white figure; disabled at 35% opacity; rows-per-page
`select.sel--sm` 30px / 8px / 13px. My Work Queue and All Leads use the same pager.

**A–Z jump** — Origin: Manage Dealers (Accounting follows). A row of 24×22 letter buttons, radius 4px,
12px / 600 ink-2; a letter with no rows is `--line-3` and inert.

---

## 11 · Buttons

Origin: All Vehicles (default, primary, sheet, quiet); Single Vehicle (small).

**Radius 9px (`--r-control`) on every button, no exception** (Alex). One primary style.

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
state, not for arrival. No `setTimeout` choreography. Under `prefers-reduced-motion` the anchor lands
at the same place instantly. **Nothing jumps on a state change:** reserve the space (a status chip
sized to its longest state, a result line that is always there).

---

## 15 · Responsive — desktop only

Verified at 1280×720 · 1366×768 · 1440×900 · 1920×1080, plus a 1366×610 height stress. 1366 is the
binding width; one breakpoint, `@media (max-width: 1400px)`. Zero horizontal overflow in every state.
Do not compact to fit; let the flexible column absorb the difference.

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
| field label | 13px / 600 ink-2, sentence case, `nowrap` (12.5px in `.form--dense` — Appendix B) | Single Vehicle |
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

Origin: Single Vehicle (by order; the pattern was introduced on Single Ticket, 2026-10-29). Single
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

Origin: Single Ticket's Ticket History (introduced 2026-10-29). It is the rule for every feed of posts,
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
- **A typed feed is sectioned, not filtered** (Ivaylo ST #4): each type its own section, always shown, in
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

Heights on later pages differ (Appendix B, decision 1). Validation results stand beside the action
that produced them (§11).

---

## 25 · Checkbox, switch, segmented control, status picker

**Checkbox** — Origin: All Vehicles (`.ck`): 16×16, radius 5px, 1.5px `--line-3` edge, white; checked
`--brand-btn` fill with a white 8×5 tick; hover edge ink-4. Never the native box (Appendix B).

**Switch** — Origin: Single Vehicle (`.sw`): 42×24 pill track, white thumb; `--ok` when on;
`.sw--danger` for Hidden on site.

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
  Accounting and My Work Queue follow (My Work Queue keeps a 1px ring instead of the shadow — Appendix B).
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
| flag tag (`.tag--flag`) | All Vehicles | 24px pill · padding 0 6px · 12px / 600 sentence case · ink-2 on `--wash`, 1px `--line-2` ring · its glyph first · never clipped; `+N` for the rest |
| record id pill | Single Vehicle | §21 |
| Demo / Mock addition | All Vehicles / Single Vehicle | §13 |
| counter badge (`.badge`) | Single Vehicle (section rail) | 18px pill · padding 0 6px · 11px / 600 · sentence case |
| entry kind | Single Ticket | §22 |
| switchable state chip | Single Ticket | §6 — the status-chip geometry, outline at rest |
| contact tag | Single Lead | §33 |

**No caps on any chip or tag.**

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
- **Group label** (`.mn__lab`): 11px / 700 caps ink-3, padding 6px 10px (Appendix A, item 6).
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
- **No explanatory text on dealer pages** beyond that (Alex). A staff page may state a state the user
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
`--sh-soft`), 440px wide (Single Lead and Single Ticket 400px — Appendix B).

| part | spec |
|---|---|
| head `.dock__h` | 58px · padding 0 12px 0 24px · 1px `--line-2` under it |
| title `.dock__t` | 15px / 650 |
| context `.dock__c` | 14px ink-3, fills the row |
| close `.dock__x` | 34×34 · radius 9px · glyph 16px ink-2 · hover `--wash` |
| body `.dock__b` | padding 16px 24px, scrolls inside |
| foot `.dock__f` | padding 12px 24px; the note 13px ink-3 at the left ("No unsaved changes"), actions right |

Opening the dock narrows the field; it never covers it.

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

## Appendix A — DESIGN.md rules that contradicted All Vehicles (2026-10-30)

All Vehicles wins; the rule was corrected to the measurement. Nothing was changed on All Vehicles.

1. **Buttons "are pills, without exception"** (old §11) — superseded by Alex's 9px; All Vehicles is 9px.
2. **The mark "42×24, 700 11.5px, radius 6px"** and **nav items "32px, 13.5px, radius 7px"** (old §3b) —
   All Vehicles measures 37×18 / 600 12.5px / 4px and 30px / 13px / 8px.
3. **Caps key "+0.07em"** (old §18) — All Vehicles is +0.08em (0.88px at 11px). Dealer Edit was aligned.
4. **Search field "takes a radius from the scale" (9px)** (old §3) — All Vehicles' command search is 14px;
   Manage Dealers, Accounting, My Work Queue were aligned to it.
5. **Menus and popovers on `--el-3`** (old §4) — All Vehicles' in-page popovers use `--sh-soft`; only its
   bar menus use `--el-3`. The staff pages were aligned.
6. **"Caps only for table heads and spec keys"** — All Vehicles' own menu group labels ("SORT BY") are
   caps. Kept as a key; Alex to confirm.
7. **Segmented control "5px padding, 2px gap"** (old §11) — All Vehicles' `.seg` is a 36px track with 3px
   padding; the 5px track is Single Vehicle's status picker (§25).
8. **`--r-micro` 4px "checkbox"** (old §3) — All Vehicles' checkbox is 5px.
9. **Board row "298px at 1366–1440"** (old §19) — All Vehicles measures 220px at 1440×900.
10. **`--stick-hd` 40px** — All Vehicles' `.hd` measures 48px at rest. The anchor (§8) is computed from the
    tokens; re-measure the 162px target before changing either.
11. `all-vehicles-gen11.css` still declares the old radius scale (`--r-card 24px` …) that `_aan-family.css`
    overrides on load — inert, a cleanup candidate.

## Appendix B — open decisions (Alex)

Design decisions, not mechanical drift. When one is decided, move its rule into its section and delete
it here. `tools/ds-check` prints the measured state of each.

1. **Form-control height.** Origin 36px (All Vehicles, Single Vehicle). Single Lead's dense contact form
   30px / 13.5px, its dock fields 40px; Single Ticket 32px / 13px; Dealer Edit 40px.
2. **Dense field label.** Single Lead `.form--dense` labels 12.5px against the 13px role.
3. **Native checkboxes.** Single Ticket (Flag note, ToDo) and Accounting's row checkboxes (14px) are the
   browser's box, not §25's `.ck` (needs the checked-state styling, not only a value).
4. **Accounting's per-row Pay** is `.btn--primary` drawn as an outline (205 rows) — not the one primary style.
5. **Manage Dealers' table cells** are 13px against the 14px cell role.
6. **My Work Queue's command search** keeps a 1px ring (recorded reason in its CSS) instead of `--sh-pill`.
7. **Chosen menu item.** Staff menus also show a brand check glyph; dealer menus only the brand-ink text.
8. **Global search hint:** `⌘K` on the dealer pages, `/` on the staff pages.
9. **Dock width:** 440px (All Vehicles) against 400px (Single Lead, Single Ticket).
10. **Caps outside keys:** Manage Dealers' "ROSTER" eyebrow; Single Ticket's "POTENTIAL" inside a contact
    tag and "SPENT / EST." field labels in the dock.
11. **Staff status palette:** My Work Queue's production status colours carry no tone ring; Manage Dealers'
    package flags are 12px / 7px-radius `.bdg`; Dealer Edit's `.dbchip` is a 22px pill; My Work Queue's
    "Archived" is a 34px pill toggle — four shapes for what §27 has two of.
12. **Single Lead's platform bar** is solid white at rest; every other page is the .76 glass.
13. **Explanatory lines on dealer pages:** All Vehicles' empty Model popover ("Pick a make first — models
    scope to it."), Single Lead's "Logged as …" under the note box, Single Vehicle's toggle descriptions
    ("Feature this car in the site's Specials rail") — keep only those the original has.
