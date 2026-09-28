# GEN 11 — STAGE 2 INTERACTION BLUEPRINT

**Date** 2026-09-27 · **Status** specification only. Nothing here was implemented.
**Subject** `pages/dealer/all-vehicles-gen11.{html,css,js}` after Stage 1 (`?v=202609271700`).
**Honours** the locked in-flow vehicle model, the locked no-accordion detail direction, the locked
sticky-workspace direction, the no-new-features rule, and the 1280/1366/1440/1920 desktop targets.

**Reference implementation.** All Leads Gen 10 already expands a row **in normal document flow**
(measured: `position: static`, `z-index: auto`). Stage 2 is not inventing a mechanism; it is adopting
the one the product already ships, plus the anchor All Leads lacks.

---

## 1 · TARGET SPATIAL MODEL

One page-level scroll. One persistent workspace at the top. One list. One expansion that is part of
the list.

```
┌ viewport ────────────────────────────────────────────────────────────┐
│ PERSISTENT WORKSPACE  (opaque, one material, one bottom edge)        │
│   platform bar · lane rail · command controls · column header        │
├──────────────────────────────────────────────────────────────────────┤  ← ANCHOR
│ SELECTED ROW            (flush with the list, same columns)          │
│ VEHICLE WORKSPACE       (in flow, reserves its own height)           │
├──────────────────────────────────────────────────────────────────────┤
│ the rest of the inventory, undimmed and fully legible                │
└──────────────────────────────────────────────────────────────────────┘
```

Invariants:

- **One scroll container.** `html`/`body` scroll; the list never gets its own scroller.
- **The workspace is chrome.** It always paints above content and content always travels under it.
- **The expansion is content.** It never overlaps a sibling row and never enters the chrome band.
- **The anchor is a named position**, not a computed one: the selected row's top edge rests at
  `--stick-total` (the workspace's bottom edge).

---

## 2 · STICKY ENGAGED COMPOSITION

**Measured today (engaged, 1440):** platform bar 0→68 glass radius 24 inset 16 · command band 68→140
glass radius 24-top inset 26 · column header 140→192 opaque white square inset 16. Three materials,
three insets, 192px — **79% of a 1366×768 viewport before the first row**.

**Target.** One region, `0 → --stick-total`.

| Property | At rest | Engaged |
|---|---|---|
| material | the page's own surfaces, separately readable | **one opaque surface** for the whole stack |
| outer radius | as today at the top corners only | **0** — the stack meets the viewport edge |
| inner radii | as today | **0** where two layers touch |
| inset | **one value** for every layer (today: 16 / 26 / 16) | same single value |
| shadow | none | **one**, at the bottom edge of the whole stack |
| separators | as today | one hairline between band and header; none elsewhere |

**Which boundaries survive:** the stack's bottom edge (it is the anchor, and the thing that makes a
half-row read as passing under rather than being cut) and the hairline under the column header.
**Which disappear:** every radius between touching layers, the per-layer shadows, and the 10px white
shoulders created by the 26px band inset.

**Height.** `--stick-total` is already published by Stage 1 as
`--stick-bar + --stick-cmd + --stick-hd` = 68 + 72 + 52 = 192. The reduction target is a Stage 6
composition decision; the contract here only requires that the value stay derived and that the anchor
read it. Production's comparable stack is 145px (46 + 36 + 63) for a page with more chrome.

**Filters joins the same system.** Stage 1 already aligned `.dock` to `--stick-cmd-top`. Stage 2 adds:
the dock's header shares the workspace's material and bottom edge, so an open Filters panel reads as
the workspace extending downward on the right, not as a separate floating sheet.

---

## 3 · SELECTED-ROW ANCHOR CONTRACT

**Anchor definition.** The selected row's top edge comes to rest at exactly `--stick-total` — the
first pixel below the persistent workspace.

**Rules.**

1. **Named, not computed.** The target is the workspace's bottom edge, the same position for every
   row. Explicitly **not** `scrollIntoView({block:'center'})`: a centred target is a different place
   every time and pushes the row away from the controls that operate it.
2. **Minimum travel.** If the row's top is already within a tolerance band of the anchor
   (proposal: ±1 row height), the page does **not** move. The user chose their scroll position.
3. **Downward-only correction where possible.** A row above the anchor scrolls down to it; a row below
   scrolls up to it. Both land on the same line.
4. **Never scroll past the document end.** When the document cannot deliver the anchor (the last rows
   on the page), the row rests as close as the document allows and the expansion is still fully
   reachable by ordinary scrolling — the anchor is a target, not a guarantee.
5. **One animation, interruptible.** Smooth scroll at the existing `--dur2`; a second selection during
   the travel retargets rather than queueing.
6. **Reduced motion.** Instant jump to the same anchor. The invariant is preserved; only the travel
   is removed.

**Why this is required, in one measurement.** At an 801px viewport (a 1366×768 laptop) the current
build shows **12% of the panel for row 1 and 0% for rows 2, 3 and 4**, with `scrollY` unchanged. The
anchor is not a refinement; it is what makes the interaction observable.

---

## 4 · IN-FLOW EXPANSION CONTRACT

| Property | Today (measured) | Stage 2 |
|---|---|---|
| positioning | `position: absolute`, `top` written by JS | **in normal flow**, immediately after its row |
| space | `.exp-space { display: none }` — none reserved | **reserves its own height**; the list below moves down |
| width | `left: 8px; right: 8px` — 16px narrower than rows | **shares the row's left and right edges** |
| column origin | private `420px 1fr` grid | **the row's own column origins** for the identity band; free grid below it |
| layer | `--z-raised` (3) after Stage 1 | **content**; no tier above the list |
| shadow | `0 30px 64px -18px` on all four sides | **none** — it is not floating |
| radius | 18px card | **0** at the seam with its row; outer radius only at the pair's bottom corners |
| gap to its row | `+8px`, filled by a dimmed neighbouring row | **0** — no seam |
| sibling rows | `opacity: .55` on 15 rows | **untouched, fully legible** |
| close control | its own `×` | the row's own toggle; no second affordance |

**The pair is one object.** Selected row and workspace share one outer border, one background family
and one radius envelope. The row loses its bottom radius; the workspace loses its top radius; nothing
is drawn between them.

**Scroll compensation.** Because the expansion now occupies real height, opening a row moves
everything below it. The anchor (§3) is what keeps this from feeling like a jump: the row is travelling
to a known line at the same moment the content below it grows.

---

## 5 · OPEN BEHAVIOUR

1. Record the current `scrollY` as the **return position**.
2. Mark the row selected; set `aria-expanded="true"` on the trigger.
3. Insert the workspace in flow after the row, height auto.
4. Scroll to the anchor (§3), minimum travel, interruptible.
5. Move focus to the workspace's heading (the vehicle identity line), so keyboard and screen-reader
   users arrive where sighted users are looking.

**Perceivability rule.** The open must produce a visible change **inside the viewport the click
happened in**. With the anchor this is automatic; without it, it is not, which is the Stage 1 finding.

---

## 6 · CLOSE BEHAVIOUR

1. Remove the workspace from flow; the list closes up.
2. Restore the **return position** recorded at open, so the round trip is lossless.
3. Return focus to the row that was the trigger.
4. `Escape` closes the workspace before it closes anything else — Gen 11's existing Escape ladder
   (menus/popovers → vehicle → dock) is correct and is preserved.

---

## 7 · SWITCH-VEHICLE BEHAVIOUR

**Today (measured):** `showVehicle` on an already-open panel removes the open class, waits a hardcoded
`setTimeout(…, 200)`, then `render()` destroys and rebuilds the DOM and positions a new panel at a new
`top`. No shared element, no direction, 40ms of dead time after a 160ms fade, and because the class is
added in the same frame as insertion the enter transition frequently does not run at all.

**Stage 2:** a replacement is a **transition, not a close followed by an open**.

1. The new row travels to the **same anchor**. The anchor never moves, so the object appears to stay
   still while its contents change.
2. The workspace's outer box persists; its contents swap. Height animates from old to new.
3. No `setTimeout`. State changes are driven by transition completion, or committed immediately.
4. `↑`/`↓` with a workspace open moves the selection and keeps the anchor — which turns "work the 133
   no-price cars" into a keyboard loop instead of 133 click-scroll-close cycles.
5. Reduced motion: instant swap at the same anchor.

---

## 8 · SCROLL RESTORATION

| Event | Behaviour |
|---|---|
| open | remember `scrollY`; travel to the anchor |
| switch | keep the anchor; do not touch the remembered position |
| close | restore the remembered position exactly |
| filter / sort / lane change while open | close first, then apply; the remembered position is discarded because the list identity changed |
| resize | re-derive the anchor from `--stick-total`; if a workspace is open, keep its row at the anchor |
| browser back/forward into a `#vehicle=` hash | open at the anchor; there is no remembered position to restore |

---

## 9 · SELECTED ROW + WORKSPACE VISUAL CONTINUITY

Five separate cues currently say "two objects". Each is a line of CSS and each must reverse:

| Cue today (measured) | Stage 2 |
|---|---|
| 8px gap showing a dimmed neighbouring row between a car and its own detail | no gap |
| workspace 16px narrower than its row | identical edges |
| 360° drop shadow including the edge facing the row | no shadow on the pair |
| opposite materials — `#6A7285` row, white workspace | one material family; the row is the pair's header |
| row stripped of radius, shadow and accent spine while the workspace is a rounded card | one radius envelope around the pair |

**Selected colour.** `#6A7285` was adopted to match the Gen 10 command band. Gen 11's band is now
glass, so the grey is an orphan with no remaining rationale — and it is the only surface of its kind
in the product. The selected state should be expressed in the palette the product already uses for
selection (`--brand-soft` / `--brand-soft-2`, which `.row.sel` uses for bulk selection today), so that
"ticked for a batch action" and "open for inspection" stop being two unrelated colour languages.

---

## 10 · DETAIL ARCHITECTURE

**Locked:** not five equal accordion bars. **Measured problem:** `.exp .exp__accs` is a two-column grid
with `.acc--open { grid-column: 1 / -1 }`; opening Market & pricing moves three untouched sections
−435 / +435 / −435px horizontally **at frame 0, unanimated**, while the touched one eases over 240ms.

**Target structure.**

### 10.1 MERCHANDISING HEALTH — always visible, never a section
It is the reason the row was flagged and the reason the workspace was opened. It renders as the
workspace's **status line**, directly under the identity band: the failing checks only, in the fixed
slot order used by the row's exception cell, with the passing ones collapsed to one quiet line
("merchandising clear"). No header, no disclosure control.
*Existing content only: the six checks already computed in `vehicleBody()`.*

### 10.2 MARKET INTELLIGENCE — one region, two parts
Market & Pricing and Recent Comps are **one argument and its evidence** and must not be separated by a
grid cell. One region, the distribution and the delta above, the five comparable listings below,
one "All N comparable listings" link.
*Provenance: this region is `Demo / not connected` today. The disclosure belongs **before** the
visualisation, not under it — a convincing chart with a disclaimer below it is a chart, not a
disclaimer. The feature concept stays; only its honesty improves.*

### 10.3 SPECIFICATION — compact reference, quieter
Trim, Exterior, Type, Mileage, Location, Stock #. Three of those six repeat cells that are already
columns in the row above it. Render as a quiet definition list, not a card, and drop the fields the
row already shows when the row is showing them.
*Removing a duplicated rendering is not removing information.*

### 10.4 HISTORY — lowest priority, available without competing
A chronological list at the bottom of the workspace. Quietest treatment on the surface.
*It fabricates an attributed audit trail today; keep it badged.*

**Mechanism, not accordions.** Two options, both precedented in the product, neither inventing a
control:

- **A — continuous scroll + section rail.** Exactly the shipped Single Vehicle pattern: the four
  regions run one after another and a compact rail lists them with live counts
  (Health "2 of 6" · Market · Specification · History). Strongest precedent; costs horizontal space.
- **B — continuous scroll, no rail.** The four regions in priority order. Health and Market are
  visible on open at 1440; Specification and History are reached by scrolling the page.
  Cheapest, no new control, and the safest reading of the no-new-features rule.

**Recommendation: B for Stage 2**, with A recorded as the Stage 5+ option once the workspace's height
is known. A rail is a new control in the workspace even though it exists elsewhere in the product,
and Stage 2 should not spend its risk budget there.

**Hard rule regardless of option:** an expansion changes the size of exactly one thing. No layout in
which opening one region relocates another.

---

## 11 · FILTERS RELATIONSHIP

- The Filters dock is **not** the vehicle workspace and never shares its geometry.
- Both are anchored to the same stack (`--stick-cmd-top`), aligned by Stage 1.
- Opening Filters while a vehicle is open: the vehicle stays open and stays at the anchor. The list
  narrows; the workspace narrows with it.
- Stage 1 fixed the two foundation defects here — the lane rail no longer vanishes, and
  Needs-attention no longer changes padding. Stage 2 must not regress either.
- The dock-open column collapse (Trim, Colour, **Status** dropped to 0px tracks) is **Stage 5**, not
  Stage 2, but Stage 2 must not deepen its dependency on the current `--cols` string.

---

## 12 · CSS → JS MIGRATION CONTRACT

Stage 1 established the direction: CSS publishes, JS reads. Stage 2 extends it to the expansion.

| Value | Publisher | Consumer |
|---|---|---|
| `--stick-total` | CSS (already exists) | the anchor calculation |
| `--exp-offset` | CSS (already exists, 8px) | retired — no gap in flow |
| expansion height | layout engine | nobody; JS stops measuring it |
| anchor tolerance | CSS custom property | the open/switch handler |
| transition duration | `--dur2` | transition events, not `setTimeout` |

**The JS stops positioning anything.** `ex.style.top` disappears with the popover. That removes the
one-shot-measurement defect (`GEN11_AUDIT.md` P1-20) at its root rather than patching it with resize
listeners.

---

## 13 · EXACT SELECTORS, FUNCTIONS AND STATE

**JS (`all-vehicles-gen11.js`)**

| Symbol | Line (current) | Stage 2 |
|---|---|---|
| `showVehicle(id)` | 219–227 | rewritten: set state → render in flow → travel to anchor → move focus |
| `closeVehicle()` | 228–231 | rewritten: remove from flow → restore `scrollY` → return focus |
| `render()` | 133–159 | the `#exp` branch emits in-flow markup; the `ex.style.top` block (124–126) is deleted |
| `setTimeout(…, 200)` | 226, 230 | deleted — transition-driven |
| `S.cur` | 41 | unchanged |
| `S.expNow` | — | deleted (written twice, never read) |
| `window.G8demo` | 457 | preserved — it is the regression harness |
| hash states | 430–442 | preserved, including `#vehicle=` |

**CSS (`all-vehicles-gen11.css`)** — the whole `QUARANTINE · vehicle expansion` section is the unit of
work. It was fenced in Stage 1 precisely so Stage 2 could replace it in one place.

**HTML** — the row gains a real disclosure contract: `role`, `aria-expanded`, `aria-controls` pointing
at the workspace, Space as well as Enter. The workspace gains `aria-labelledby` back to the row.

---

## 14 · RULES THAT MUST BE DELETED

1. `.exp { position: absolute; left: 8px; right: 8px; z-index: … }` — the popover geometry.
2. `.exp-space` — the never-reserved spacer, and its injection in `render()`.
3. `.exp__in`'s 360° drop shadow and 18px radius.
4. `.field.has-open .row:not(.open) { opacity: .55 }` **and** its `:hover { opacity: 1 }` partner —
   dimming 15 live, clickable rows below AA and then gating their legibility on hover.
5. `.exp__x` — the workspace's own close button; the row is the toggle.
6. `.row.open`'s `#6A7285` colour block (§9).
7. The dead accordion machinery still shipping: `.exp { display: grid; grid-template-rows: 0fr→1fr }`,
   `.exp > div { overflow: hidden }`, and the 240ms transition that has not applied since the popover
   layer landed.
8. `.exp .exp__accs` two-column grid and `.acc--open { grid-column: 1 / -1 }` (§10).

---

## 15 · RULES THAT CAN BE REUSED

- The **accordion component itself** (`acc()` / `setAccOpen()`, correct `aria-expanded` and `inert`)
  — the best-behaved control on the page. Reuse it for *local* disclosure inside a region if content
  volume genuinely requires it; do not use it as the region architecture.
- `vehicleBody()`'s content builders — health checks, market model, comps, spec, history — all stay.
  Only their arrangement changes.
- The identity band markup (`veh__n`, `veh__m`, `idtag`, VIN) — it is the seed of the shared identity
  module (see `AAN_DESIGN_SYSTEM_INPUT.md`).
- The `.demo` provenance badge.
- Stage 1's layer ladder, sticky tokens, focus system and semantic column classes.
- `.row.sel` / `--brand-soft` as the selection colour language (§9).

---

## 16 · TRANSITION AND TIMING RISKS

1. **Height animation on a variable-height region.** `grid-template-rows: 0fr → 1fr` is the correct
   mechanism and is already in the file (dead). It animates a layout property; at 70 rows per page the
   cost is bounded because only one region animates.
2. **Anchor travel racing the height change.** The row must reach the anchor while the content below
   it grows. Do the scroll and the insert in the same frame; do not chain them.
3. **Interruption.** A second selection mid-travel must retarget, not queue. The current 200ms
   `setTimeout` makes this impossible, which is why it goes.
4. **Reduced motion.** A shorter path to the same state, not the same wait with the animation removed.
   Today the `setTimeout` runs unconditionally, so a reduced-motion user gets 200ms of nothing.
5. **Focus during travel.** Move focus after the scroll settles, or the browser will fight the
   programmatic scroll.

---

## 17 · WIDTH RISKS

- **1366 is the constraint.** Stage 1 brought the page to zero overflow there with a compact column
  set at ≤1400. The workspace inherits the row's edges, so it inherits that budget: at 1366 the
  content area is ~1290px, and a `420px + 1fr` identity/detail split leaves ~850px for the detail
  regions.
- **1280** is the floor; below it nothing is authored and nothing should be.
- **Filters open at 1366** is the tightest combination on the page: the list loses 440px to the dock
  while the workspace must still hold the identity band. Test it explicitly.
- **The workspace must not reintroduce fixed px tracks.** All Leads' flexible `minmax` model is the
  better precedent.

---

## 18 · ACCEPTANCE TESTS

**Anchor**
- [ ] Opening any row places its top edge at `--stick-total` ±1px, at 1280/1366/1440/1920.
- [ ] Opening a row already at the anchor moves the page **0px**.
- [ ] Closing restores `scrollY` to the value recorded at open, exactly.
- [ ] Switching vehicles leaves the anchor unchanged; the workspace box does not jump.
- [ ] Under `prefers-reduced-motion` every one of the above holds, instantly.

**In-flow**
- [ ] The workspace's left and right edges equal the row's, at every width.
- [ ] No sibling row is covered by the workspace at any scroll position.
- [ ] No sibling row is dimmed.
- [ ] The document's scroll height grows by the workspace's height when it opens.
- [ ] The pagination footer is always below the workspace.

**Layers**
- [ ] At every scroll position the workspace paints **under** the command band and column header.
- [ ] With three rows selected and a vehicle open, all three probe points inside the tray return the
      tray (the Stage 1 test, re-run).
- [ ] Filter popovers remain fully hit-testable while scrolled with a vehicle open.

**Detail**
- [ ] Opening any region relocates no other region — measured deltas of untouched regions are 0.
- [ ] Merchandising health is visible without interaction.
- [ ] The Market region's not-connected statement precedes its visualisation.

**Regression**
- [ ] `document.documentElement.scrollWidth === clientWidth` at 1280/1366/1440/1920, in default,
      filters-open and vehicle-open states.
- [ ] Lane rail visible with Filters open; Needs-attention padding unchanged (Stage 1 gains held).
- [ ] Every hash state and `window.G8demo` still work.
- [ ] Console clean.
- [ ] `?v=` bumped on CSS, data JS and main JS together.

---

## 19 · IMPLEMENTATION ORDER

1. **Capture a Stage 2 baseline** with the Stage 1 harness — the same 14 states × 60 properties. The
   expansion's geometry is *expected* to change; everything else is not.
2. **Author the engaged sticky composition** (§2) and re-measure `--stick-total`. The anchor depends
   on it, so it must settle first.
3. **Convert the expansion to flow** (§4): delete the popover geometry, reserve space, share edges.
   No anchor yet — verify the list reflows correctly and nothing is covered.
4. **Add the anchor** (§3) with minimum travel and the return position.
5. **Add switch-vehicle as a transition** (§7) and delete the `setTimeout` path.
6. **Restructure the detail** (§10) into four ordered regions, option B.
7. **Give the row its disclosure contract** (§13).
8. **Re-run the acceptance tests** at all four widths.

Steps 3 and 4 are the risk; they are separated deliberately so a failure can be isolated.

---

## 20 · DO-NOT-BREAK LIST

- Needs-attention, the lane rail, the dense row, Market & Pricing, Recent Comps — all locked, all
  preserved.
- Lane business logic (`list()`, `setLane()`, `countTo()`, the hardcoded counts) — Stage 2 does not
  touch it. It remains a known P0 scheduled for the provenance/truth stage.
- `render()` / innerHTML architecture — Stage 3. Stage 2 must not make list identity *worse*, but it
  does not fix it.
- Dark theme — stays gated. Stage 2 must not remove the three gates.
- Stage 1's token layer, layer ladder, sticky derivation, focus system, semantic column classes and
  1400 breakpoint.
- The review harness: hash states, `window.G8demo`, and the `reference/gen11-stage1-baseline/`
  fingerprint rig.
- Column content, order, tag budget and VIN policy — Stage 5.
- Type scale, signal budget, bento composition, motion values — Stage 6.
- No other page.

---

*End of blueprint. Nothing here was implemented.*
