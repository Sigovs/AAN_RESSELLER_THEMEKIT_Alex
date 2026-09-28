# AAN — CROSS-PAGE DESIGN AUDIT

**Date** 2026-09-27 · **Type** research only. No application source file was modified.
**Reads against** `GEN11_AUDIT.md`, `GEN11_MIGRATE_VALIDATION.md`, `GEN11_STAGE1_REPORT.md`
**Method** twelve passes over five surfaces in a real Chromium session at 1280 / 1366 / 1440 / 1920,
with a read-only probe (`reference/aan-cross-page-design-research/probe.js`) that measures layers,
stacking contexts, token layers, surface/radius/shadow/type censuses, contrast on the composited
render, truncation and sub-floor text. Every number below is measured, not estimated.

---

## 1 · EXECUTIVE FINDINGS

**1. There are two AAN products, and the design system has to admit it.**
The dealer redesign (All Vehicles Gen 11, All Leads Gen 10, Single Lead Gen 10) and the shipped AAN
backend (Single Vehicle, My Work Queue) are different design languages by every measure: the shipped
product renders **1 distinct box-shadow** on a whole page against the redesign's **18**, **6 radii**
against **17**, **17 type styles** against **27**, and a 3px corner against a 24px one. The shipped
product is *more systematic than the redesign*. Anything called "the AAN design system" has to state
which of the two it is descending from, per role, or the migration will read as regression to the
people who use the backend every day.

**2. Gen 11 is not the shared foundation yet — `all-vehicles-gen10.css` is.**
All Leads and Single Lead both `@import` the Gen 10 stylesheet and layer 149 / 301 lines on top.
That file still carries **8 `:root` blocks** — the exact disease Stage 1 removed from Gen 11 — and it
feeds three pages. Every Stage 1 gain is currently quarantined to one page.

**3. The 1366 overflow Stage 1 fixed is still live on two other pages.**
Measured: All Leads **+26px**, Single Lead **+26px** at 1366, both from `button.av` in the platform
bar at x=1380 against a 1354 client width. Same root cause as Gen 11's (the brand-hiding breakpoint
sits at 1360, six pixels below the commonest dealer laptop). The Stage 1 fix — one boundary at 1400 —
transfers verbatim.

**4. Gen 11 inherited its broken sticky thresholds from a page where they are correct.**
All Leads' `.cmd` sticks at 56 and `.hd` at 114; its JS tests `<= 56.5` and `<= 114.5`, and **the
engaged state fires correctly at every scroll position**. Gen 11 copied the thresholds, changed the
geometry to 68/140, and the state became unreachable. This is the clearest possible argument for the
derived-offsets rule: the numbers were not wrong, they were *copied*.

**5. The locked in-flow expansion model already ships — on All Leads.**
Measured: All Leads' expanded row is `position: static`, `z-index: auto`, in normal flow. It is the
reference implementation for the All Vehicles Stage 2 contract, and it already exhibits the defect
Stage 2 must avoid: its content paints over the sticky column header.

**6. The locked "no accordion bars" direction already has a shipped answer.**
Single Vehicle solves eleven sections with a **sticky section rail carrying live counts** — Status
AVAIL · Pricing $1100k · Photos 64 · Specs & VIN · Colors · Descriptions • · Features 183 · Feeds
"all on" · Custom Fields 10 · More Details · Utilities — over one continuous scroll, with a coloured
spine per section. No accordions anywhere.

**7. The lane rail is genuinely product-wide.**
My Work Queue runs eleven lanes with counts (My Work 94 · All Open 802 · Pending 4 · Support 25 …)
in the employee product. The pattern is not automotive; it is "scope this list, and tell me how big
each scope is". It should be promoted.

**8. Token divergence is mostly accidental, which is good news.**
Gen 11's token layer is a strict **superset** of Gen 10's: 0 tokens exist only in Gen 10, 37 only in
Gen 11. Of 29 key tokens, 12 are byte-identical — including every semantic colour. Of the 17 that
differ, three are decisions (radius ladder, `--focal`, `--top`) and the rest are 1–3 point neutral
drift nobody chose.

**Counts: 6 × P0 · 21 × P1 · 15 × P2 = 42 findings**, plus 3 prior observations tested and recorded as
**not** findings (F28 workflow flags already inline · F31 Activity/Emails not reached · F45 no genuine
contrast failure on Gen 11).

---

## 2 · EXACT PAGES AND FILES INSPECTED

| # | Surface | Archetype | Files |
|---|---|---|---|
| 1 | **All Vehicles Gen 11** | dense inventory list + contextual object workspace | `AAN_RESSELLER_THEMEKIT_ALEX/pages/dealer/all-vehicles-gen11.{html,css,js,data.js}` |
| 2 | **All Leads Gen 10** | dense lead list + pipeline + expanded row | `…/all-leads-gen10.{html,css,js,data.js}` **+ `all-vehicles-gen10.css`** |
| 3 | **Single Lead Gen 10** | detail + forms + workflow rail + communication | `…/single-lead-gen10.{html,css,js}` **+ `all-vehicles-gen10.css` + `all-leads-gen10.data.js` + `all-vehicles-gen10.data.js`** |
| 4 | **Single Vehicle** | full object detail | `aan-design-export-2026-09-09/pages/d05-vehicle-editor-1.html` (+ `assets/theme.css`) |
| 5 | **My Work Queue** | employee queue / prioritisation | `aan-design-export-2026-09-09/pages/s01-work-queue-1.html` (+ `assets/theme.css`) |

**Which file, and why.** Surfaces 4 and 5 have **no redesigned generation anywhere in the project**;
the newest meaningful implementation is the 2026-09-10 design export of the live backend. For Single
Vehicle I used variant 1 ("2023 Ferrari 812 GTS — everything full, 64 photos") because it is the only
variant that exercises every section; variants 2 and 3 are a sparse new unit and a warning state. For
My Work Queue I used variant 1 ("My Work — 17-column lane, 94 rows"), the densest and the default
landing lane. Variants 2 and 3 are filtered/archived states of the same screen.

**Measured page facts**

| Page | rules | `:root` blocks | tokens | doc height | sticky chrome | row h | surfaces | radii | shadows | type styles |
|---|---|---|---|---|---|---|---|---|---|---|
| All Vehicles G11 | 747 | **1** | 110 | 1882 | **192px** | 74 | 27 | 17 | 18 | 27 |
| All Leads G10 | 1019 | **9** | 73 | 4949 | 162px | 62 | 22 | 12 | 15 | 24 |
| Single Lead G10 | 1143 | **10** | 74 | 3018 | 104px | — | 18 | 13 | 8 | 29 |
| Single Vehicle | 2346 | 2 | 94 | 10697 | 145px | — | 13 | **6** | **1** | 17 |
| My Work Queue | 2346 | 2 | 94 | 8453 | 159px | 67 | 17 | **4** | **1** | 15 |

---

## 3 · IMPLEMENTATION DNA — WHO ACTUALLY SHARES WHAT

**Genuinely shared (one stylesheet, three pages):** All Vehicles Gen 10, All Leads Gen 10 and Single
Lead Gen 10 all load `all-vehicles-gen10.css`. Their `.focal` / `.value` / `.attn` bento is the *same
grid* — All Leads and Single Lead resolve to identical track widths `626.492px 232px 505.242px` — and
their `.cmd`, `.hd`, `.row`, `.btn`, `.facet__b`, `.tag`, `.tray` are literally the same rules.

**Merely similar:** All Vehicles Gen 11 shares the class *names* but none of the rules; it has its own
1:1 stylesheet. Single Vehicle and My Work Queue share `theme.css` with each other and nothing with
the redesign.

**Consequence.** There are three implementation families, not five pages:
`gen10-base` (3 pages) · `gen11` (1 page) · `production theme.css` (2 pages).

---

## 4 · SHARED VISUAL INCONSISTENCIES

### F1 · Two navies do the same job · **P1** · VISUAL/TOKEN · all pages
The dark summary material is `#172234` on Gen 11 and `#0f1626` on All Leads and Single Lead.
Both are "the operational summary surface". Side by side the pages cannot match.
**Cause** `--focal` diverged when Gen 11 forked its token layer.
**Recommendation** one `--surface-emphasis`; pick Gen 11's, which is the newer decision.
**Dependency** token unification before any page migrates.

### F2 · The radius ladder silently doubled · **P1** · VISUAL/TOKEN
`--r-s` 6→10, `--r-m` 10→16, `--r-l` 18→24 between Gen 10 and Gen 11. Every card, sheet and control
on the two lead pages is therefore rounder or squarer than its Gen 11 twin by a factor nobody
recorded. Against the shipped backend the gap is a chasm: **3px is used 421 times** on Single Vehicle.
**Recommendation** a role ladder, not a scale multiplier, and an explicit statement of which product
each role descends from.

### F3 · Neutral tokens drift by 1–3 points with no decision behind it · **P1** · TOKEN
`--ground` `#e8ebf0`/`#e5e9ef` · `--ink` `#0e1421`/`#0d1320` · `--line` `#dce1e8`/`#dfe3ea` ·
`--well` `#f3f5f8`/`#eef1f5` · `--wash` `#edf0f4`/`#f3f5f8`. Invisible individually, and it
guarantees the two pages can never be pixel-reconciled. **ACCIDENTAL VALUE** — fold to one set.

### F4 · Control heights forked · **P1** · VISUAL
| Control | Gen 11 | Gen 10 pages | Production |
|---|---|---|---|
| primary button | **44px**, radius **999px** | 38px, radius 10px | ~34px, radius 3px |
| command facet | **56px**, radius 14px | 38px, radius 9px | — |
| quick-filter facet | 34px, radius 9px | 38px, radius 9px | — |
| input | — | 36px, radius 9px | ~32px, radius 3px |

Gen 11 grew every control and switched primary buttons to full pills. Undocumented, and it is the
single most visible reason the pages look unrelated.

### F5 · Gen 11 has 7 button heights and 8 button radii on one page · **P2** · VISUAL
Measured heights 26/30/34/36/40/44/56; radii 999/16/50%/7/12/14/8/9. Gen 10 pages: 6 heights,
6 radii. Production: 3 radii. Controlled variation has stopped being controlled.

### F6 · Type baselines differ by product · **P2** · TYPOGRAPHY
Dealer redesign is a 14px product with 12–13px accents. My Work Queue is a **13px product** (13px/400
used 944 times). Single Vehicle is 14px/500-led. A single type scale across both will make one of
them wrong; the scale needs a density axis, not one size list.

### F7 · The bento slots are positional, not semantic · **P1** · SYSTEM
`.focal` / `.value` / `.attn` carry Lot + Age mix / Value / Needs attention on All Vehicles;
Lead Board + By status / Assigned / Flags on All Leads; Buyer's message + Vehicle of interest /
Activity / Lead facts on Single Lead. Same class names, three unrelated meanings. A component named
for its grid position cannot be a design-system component.
**Recommendation** keep the three-slot *composition*; rename the slots for their role
(`summary-primary` / `summary-compact` / `summary-queue`) and stop treating them as a component.

---

## 5 · SHARED INTERACTION INCONSISTENCIES

### F8 · Three unrelated z-index ladders · **P1** · SYSTEM
| Layer | Gen 11 (after Stage 1) | Gen 10 pages | Production |
|---|---|---|---|
| platform bar | 20 | **50** | 90 (+ sub-nav 80) |
| command band | 12 | **6** | cockpit 60 |
| column header | 10 | **4** | thead 3 |
| selection tray | 30 | **5** | savebar 70 |
| menus / popovers | 40 | 40 | toasts 120 |

Production's ladder is ordered by permanence and is the only coherent one of the three. The Gen 10
pages have the same tray-below-content inversion Stage 1 fixed on Gen 11.

### F9 · The sticky budget is unmanaged across the product · **P1** · STICKY
Measured chrome above the first row: Gen 11 **192px** · All Leads 162 · My Work Queue 159 · Single
Vehicle 145 · Single Lead 104. At a 1366×768 laptop Gen 11 spends **79% of the viewport** before the
first row. The redesign is the heaviest of the five while being the densest list.

### F10 · Every page invents its own engaged sticky state · **P1** · STICKY
Gen 11: white glass, radii retained, the engaged payload deleted in Stage 1 and not yet reauthored.
All Leads: grey `#6A7285` band that goes edge-to-edge on engage. Single Lead: the same grey bar,
which **detaches from its sheet**. Production: opaque white, no transition at all.

### F11 · The column model runs backwards · **P1** · RESPONSIVE
All Leads' `--cols` is `26px minmax(136px,1.1fr) minmax(156px,1.2fr) minmax(136px,1.1fr) 96px …` —
**four flexible tracks**. Gen 11's is 13 tracks with **11 fixed px**. The older page has the better
column model. Gen 11 should adopt All Leads' approach, not the other way round.

### F12 · Selection and expansion have no shared contract · **P1** · INTERACTION
All Leads expands **in flow** (`position: static`). Gen 11 expands as an **absolute popover**
(Stage 1 left the geometry untouched by design). Single Vehicle **navigates**. Same product, three
answers to "show me this record".

---

## 6 · ALL VEHICLES — GEN 11 FINDINGS

### F13 · The sticky stack reads as four stacked rounded panels · **P1** · VISUAL/STICKY
Measured engaged: platform bar 0→68 (glass, radius 24, inset 16), command band 68→140 (glass,
radius 24 top, inset 26), column header 140→192 (opaque white, square, inset 16). Three materials,
three insets (16 / 26 / 16), two radii, one opaque layer among two translucent ones — 192px of it.
**Recommendation** one operational workspace: a single opaque region from y=0 to the header's bottom,
outer radius only where it meets the page ground, radii collapsing to 0 where layers touch, one
shadow at the bottom edge of the whole stack rather than one per layer.

### F14 · The three summary cards are clones in material and near-clones in weight · **P2** · VISUAL
Measured: identical `#172234`, identical radius 24, identical `--sh-card`; widths 540 / 240 / 584.
The *widest* card is Needs-attention, the *hero number* lives in the narrower Lot card.
Contrast is healthy everywhere (6.27–14.74:1 measured on every label and metric).
**This is not a defect** — Stage 1's restoration was correct. The open question is emphasis: three
equal materials mean the page has no single dominant. Needs-attention is the only one that is
actionable, and it already has the most width; giving it the emphasis and quieting Value is a
composition decision for Stage 6, not a Stage 2 change.

### F15 · The lane rail's system is sound; its selected state is carried by shadow alone · **P2** · VISUAL
Measured: track 623×50, recessed `#eef1f5`, radius 999, padding 5. All five lanes 40px tall, padding
0 16px, gaps uniformly **3px**. Selected = white fill + `--sh-pill` + brand ink. Zero-count lane gets
`--ink-3`.
The rail is **not** arbitrary and the active pill is **not** oversized — widths (125/117/110/107/142)
track label length exactly. Two real observations: white `#ffffff` on `#eef1f5` is a ~1.06:1 surface
step, so "selected" depends almost entirely on the shadow and the ink; and the widest pill in the rail
("All on file 13,587", 142px) is not the selected one, which reads as mis-emphasis.
**Correction to the brief:** Stage 1 did not change lane spacing. It restored the rail's *visibility*
when Filters is open (it was `display: none`). The spacing system was already there.

### F16 · Sub-floor text and truncation persist · **P2** · TYPOGRAPHY/RESPONSIVE
Measured at 1440: below a 14px floor — `stock` 13px ×16, `stk__vin` 12px ×16, `stat` 13px ×16,
`tag` 12px ×12, `price__sub` 11.5px ×3, lease label **9.5px ×3**. Truncated: `stk__vin` **16 of 16**,
`trim` 12, `tags` 4. Unchanged from `GEN11_AUDIT.md` and correctly deferred to Stage 5.

---

## 7 · ALL LEADS GEN 10 — THE SIX PRIOR OBSERVATIONS, TESTED

### F17 · "White workspace terminates awkwardly" — **REAL, but not where it was reported** · **P1**
Measured at the bottom of a 4949px page: the sheet ends at 4933, the last row at 4885, the footer at
4933. **The sheet does not terminate early.** The real defect is at the top: at rest the command band
is inset **26px** inside a sheet inset **16px**, so a 10px white shoulder frames a grey bar on three
sides; on engage the band jumps to **0→1428** while the header and rows stay **16→1412**. Three left
edges in one stack (0 / 16 / 26) and a band that changes width mid-scroll.
**Cause** `.cmd` at rest takes the sheet's inner margin; `.cmd--stuck` applies negative margins sized
for a different container. **Recommendation** one inset for the whole workspace; the band never
changes width, only its material.

### F18 · "Global header does not span the viewport" — **NOT REPRODUCED as stated** · **P2**
Measured: `.top` is 0→1428 at every scroll position and every width. It spans correctly. What does
not span consistently is the **command band** (F17). Recording the correction.

### F19 · "Sticky transition can lose or crop parts" — **REAL** · **P0**
Two mechanisms, both measured. (a) The band's width discontinuity (F17). (b) The first row under the
engaged column header is sliced with no separation: `.hd` is opaque white on white rows with only a
1px hairline, so a half-row reads as a cropped fragment rather than content passing under chrome.
**Recommendation** the stack's bottom edge needs a real boundary — a shadow or a tint step — at the
moment it engages.

### F20 · "Expanded content can be covered by the sticky header" — **REAL, and inverted** · **P0**
Measured with a row expanded and the page at y=1200: the expansion's box overlaps the header band
(114→162), and hit-testing at the centre of that band returns **`.acc__s`, inside the expansion**.
The expansion is painting **over** the persistent header, not under it. Same class of defect as Gen 11
pre-Stage-1, different mechanism: here `.exp` is in flow with `z-index: auto` but contains positioned
descendants, while `.hd` sits at a z-index of only 4.
**Recommendation** the layer ladder from Stage 1, applied to the Gen 10 base.

### F21 · "Lead Board / By status feels cramped" — **REAL** · **P1**
Measured: the `.focal` card is 626px and splits into Lead Board + a "By status" column inside it, with
five status rows (New Lead 28 40% · Active Prospect 14 20% · Pending 9 13% · Just Looking 6 9% ·
Trade Appraisal 4 6%) each carrying a label, a tick, a count and a percentage in a sub-column of a
626px card that is already holding a 16,574 hero number, four filter chips and a search field.
**Recommendation** this is an information-density problem, not a padding problem: By status is a
*second* queue competing with the Flags card for the same job. Reorganising existing content — moving
By status beside Flags — is in scope; widening the card is not enough.

### F22 · Heavy truncation in the list · **P2** · RESPONSIVE
Measured at 1440: `ac` 27/70 · `sc` 26/70 · `vh__n` 17/70 · `ct__e` 17/70. At 1366: `ct__e` **59/70**,
`vh__n` 45/70. Sub-floor at 1440: seven cell types at 12–13.5px across **all 70 rows**.

### F23 · Duplicate state display · **P2** · IA
The band shows "Sort · Newest first" and the filter row below ends with the text "newest first".
One fact, two places, 60px apart.

---

## 8 · SINGLE LEAD GEN 10 — THE TWELVE PRIOR OBSERVATIONS, TESTED

### F24 · "Buyer's Message too large, too dark, poorly balanced" — **PARTLY REAL** · **P1**
Measured: `.focal` splits `386.492px 240px` → **Buyer 61.7% / Vehicle 38.3%**. The brief's target of
65–70 / 30–35 is a **3–8 point shift**, not a redesign; `1fr 208px` lands at 65/35.
"Too dark" is the F1 navy question, not a Single Lead issue.

### F25 · Sticky behaviour is wrong — **REAL, and precisely measurable** · **P0**
Measured: the lead tab bar is **960px at left 26** at rest and **996px at left 0** when engaged, while
its sheet is 980px at left 16. On engage the bar grows 36px, slides to the viewport edge and
overhangs the form on the left. That is the "dark clipped remnant": a grey bar extending past the
white sheet it belongs to.
**Desired behaviour is otherwise already correct** — measured, the bento (Buyer's Message + Vehicle of
Interest) scrolls away and the tabs stick at 56, exactly as the brief asks.

### F26 · The large white form lacks hierarchy — **REAL** · **P1** · IA
Measured/observed: read-only and editable fields are the same 36px box with the same 9px radius and
the same border. "Stock # 21902" is an input; so is "Make: Aston" and "Model: Martin Vanquish".
Nothing distinguishes *record state* (what the feed says), *editable* (what you may change) and
*workflow* (what you must decide). **The shipped product already solves this**: Single Vehicle groups
fields into spine-coloured sections with inline provenance under each price field ("2 changes · last
−$300", "no history").
**Recommendation** adopt the section + provenance pattern that already exists; do not invent a new
field taxonomy.

### F27 · Tabs have insufficient breathing room — **PARTLY REAL** · **P2**
Measured: the bar is 48px with 5px/8px padding holding 38px tabs — 5px of vertical air. The tab group
itself occupies **456px of a 960px bar**, with a 355px spacer before the Workflow button. So the bar
is not crowded; the *tabs* are vertically tight inside a bar that is mostly empty.

### F28 · Workflow flags must stay one inline row — **ALREADY SATISFIED** · verified
Measured at 1440 and 1366: `Internet` (x 1032) and `Mgmt checkoff` (x 1124) share `top = 708`. No wrap,
no overlap. The Stage-1-era fix held.

### F29 · "Workflow panel feels too narrow, target ~300–340px" — **CONTRADICTED BY MEASUREMENT** · **P2**
Measured: the dock is **400px** wide with a 360px content column — already **60–100px wider** than the
stated target. At 1366 it stays 400 while the form absorbs the loss (906px).
**Correction:** the note appears to predate the current build. If the panel still *feels* narrow the
cause is not its width; the candidates are the 36px control height inside a 400px column and the
single-column field stack. Recording rather than acting.

### F30 · Workflow panel can clip its own content · **P1** · STICKY
Measured: `.dock` is sticky at top 56, **625px tall, `overflow: hidden`**. Today its content fits
(`scrollHeight == clientHeight`), so nothing is chopped. With one more workflow field it will be —
silently, with no scrollbar. That is exactly the "chopped content on scroll" the brief remembers.
**Recommendation** a sticky panel is either content-sized or scrollable; never fixed-height with
`overflow: hidden`.

### F31 · Activity and Emails were not reachable in this variant · **noted, not a finding**
The tab bar exposes Activity (3) and Emails (3). The audit inspected the Overview tab; the
chronological-history and communication-history recommendations in `AAN_DESIGN_SYSTEM_INPUT.md` are
derived from the shipped product's timeline patterns, and are marked **needs validation**.

---

## 9 · SINGLE VEHICLE — FINDINGS

### F32 · This page already answers the locked detail question · **P1** · SYSTEM (opportunity)
Measured composition: fixed topbar 46 + fixed sub-nav 36 + **sticky cockpit 63** (= 145px), a 198px
left rail whose inner block is sticky at 154, one continuous 10 697px form, and a sticky save bar.
The cockpit holds a complete **vehicle identity module**: ← Inventory · thumbnail · "2023 Ferrari 812
GTS" · Stock 0P0300236 PS with copy · VIN ZFF97CMA0P0300236 with copy · AVAILABLE · USED ·
$1,099,500 · ◀ ▶ prev/next · Photos 64 · Prints ▾ · Save.
The rail is a **section navigator with live counts**. This is the shipped answer to "many sections
without accordion bars", and it is the strongest reference implementation in the product.

### F33 · Operational state is legible here and illegible in the redesign · **P1** · IA
Single Vehicle renders "🔒 you hold the edit lock" as a full, coloured, readable statement beside
Added / Modified / Views / Change log ↗. All Vehicles Gen 11 renders the same fact as a **20×20
padlock with a `title` attribute** — not focusable, no holder, no time.

### F34 · Field-level provenance already exists · **P1** · IA (opportunity)
"2 changes · last −$300" under Price; "no history" under Discount, Invoice, Lease. The redesign's
provenance problem (`GEN11_AUDIT.md` P0-7) has a shipped precedent at a finer grain than the section
badges Gen 11 uses.

### F35 · Sections use a semantic left spine · **P2** · VISUAL (opportunity)
Purple for Status & Visibility, green for Pricing, 3px radius, one shadow on the page. A cheap,
legible section-identity device the redesign does not have.

---

## 10 · MY WORK QUEUE — FINDINGS

### F36 · Sixteen column headers, all of them wrapping at 1440 · **P0** · RESPONSIVE
Measured: 16 columns, header row 77px tall, **every header wraps** — "Remaini/ng Time",
"Assigne/d", "My Est./Time", "Completion/Date". Row height 67px, 94 rows.
**Cause** a fixed 16-column table with no column-priority model in a 1141px content area.
**Recommendation** the column-priority model queued for All Vehicles Stage 5 is needed here first —
this is the densest table in the product.

### F37 · The lane rail pattern is already product-wide · **P1** · SYSTEM (opportunity)
Eleven lanes with counts, plus a semantic lane state the dealer rail lacks: "Pending 4" is rendered
with a **red outline** because it needs attention. That is a genuine improvement on Gen 11's rail,
already shipped, and it costs nothing to adopt.

### F38 · Status colour encodes department, not state · **P1** · SEMANTIC
Mktg Open (pink) · Client Open (purple) · Internal Open (teal) · Leads Open (green). All four are the
same *state* — open — coloured by owning department. Meanwhile the dealer pages use colour for state
(New Lead / Active Prospect / Pending). One product, two contradictory colour semantics.
**Recommendation** decide once: colour carries state; department carries a label. Do not unify the
palettes before the semantics are settled.

### F39 · Cell-level attention highlight · **P2** · VISUAL (opportunity)
One "Last Modified" cell is highlighted amber to mark a recent third-party edit. A precise, cheap
exception device operating at cell rather than row level — the dealer pages have no equivalent.

### F40 · The scope line is plain text · **P2** · IA
"58 Dealers / 94 Open / 17 Waiting on Client or Third party / 1 GD2 Items · Ivaylo Guenkov" does the
same job as All Vehicles' scope line but is unstyled and unclickable.

---

## 11 · CROSS-WIDTH FINDINGS (1280 / 1366 / 1440 / 1920)

| Page | 1280 | 1366 | 1440 | 1920 |
|---|---|---|---|---|
| All Vehicles G11 | 0 | **0** (fixed in Stage 1) | 0 | 0 |
| All Leads G10 | 0 | **+26px** | 0 | 0 |
| Single Lead G10 | 0 | **+26px** | 0 | 0 |
| Single Vehicle | — | — | 0 | — |
| My Work Queue | — | — | 0 (but all headers wrap) | — |

**F41 · 1366 is the product's blind spot · P0 · RESPONSIVE.** Both remaining redesign pages overflow
by 26px at the commonest dealer laptop width, from the same element (`button.av`) and the same cause
(the 1360 breakpoint). Fixed on Gen 11 in Stage 1; unfixed in the shared base.

**F42 · Single Lead's two-column grid does not share the loss · P2 · RESPONSIVE.** Measured at 1366
the grid is `906px 400px`: the workflow dock holds its 400px and the form absorbs the entire
reduction. At 1280 the form would be ~820px while the dock stays 400.

---

## 12 · ACCESSIBILITY AND LEGIBILITY FINDINGS

**F43 · Focus is solved on one page out of five · P0 · ACCESSIBILITY.**
Gen 11 now owns `outline` product-correctly (Stage 1, measured 3.26–15.97:1 on twelve stops). The
Gen 10 base still carries the `box-shadow`-only focus ring that Stage 1 proved is erased by every
decorative shadow — and it feeds All Leads and Single Lead. The same P0 exists, unfixed, on two pages.

**F44 · Sub-floor functional text is systemic, not a Gen 11 quirk · P2.**
Gen 11: 16 distinct sub-14px roles. All Leads: seven cell types at 12.5–13.5px across **all 70 rows**.
My Work Queue: a 13px body. A "14px floor" cannot be declared product-wide without re-deciding the
employee product's density.

**F45 · Contrast is healthy where it was measured · not a finding.**
Gen 11's composited render produced three apparent failures, all traced to the probe reading the
parent surface of an element that carries its own opaque chip background (`.brand__mk`, `.dealer__mk`,
active pager). No genuine contrast failure was found on Gen 11 after Stage 1. The navy summary cards
measure 6.27–14.74:1.

---

## 13 · SHARED PATTERN CANDIDATES

Full treatment in `AAN_DESIGN_SYSTEM_INPUT.md`. Summary of what the evidence supports promoting:

| Candidate | Appears on | Strongest implementation | Confidence |
|---|---|---|---|
| Workspace shell + page gutter | all 5 | Gen 11 (16px, single token) | high |
| Persistent platform header | all 5 | production (opaque, 46+36, z90/80) | high |
| Sticky command workspace | AV, AL, SL, WQ | **none yet** — Gen 11 has the mechanism, nobody has the composition | medium |
| Lane / scope selector with counts | AV, WQ, (AL tabs) | My Work Queue (11 lanes + semantic lane state) | high |
| Dense operational list | AV, AL, WQ | All Leads (flexible `minmax` tracks) | high |
| Exception / attention queue | AV, AL | All Vehicles Needs-attention | high |
| Row selection + bulk tray | AV, AL | Gen 11 after Stage 1 (tray above content) | high |
| Contextual in-flow expansion | AL, (AV Stage 2) | All Leads (in flow today) | high |
| Full object detail | SV, SL | Single Vehicle (cockpit + section rail) | high |
| Object identity module | SV, SL, AV workspace | Single Vehicle cockpit | high |
| Section rail with counts | SV | Single Vehicle | medium |
| Section card with semantic spine | SV | Single Vehicle | medium |
| Field-level provenance | SV | Single Vehicle | medium |
| Status / tag semantics | all 5 | **contradictory** — see F38 | low |
| Filter facet control | AV, AL, WQ | Gen 11 `.qf .facet__b` | high |
| Side workflow rail | SL | Single Lead (needs the clipping fix) | medium |
| Timeline / history | SL, SV, AV | needs validation | low |

---

## 14 · WHAT MUST STAY PAGE-SPECIFIC

- **The lane rail does not belong on Single Lead or Single Vehicle.** Those are single-object pages;
  there is no scope to select. Single Lead's tab bar is the right control for its job.
- **Dark summary cards belong where high-level operational metrics drive the next action** — All
  Vehicles and All Leads. On Single Lead the same material currently carries the buyer's own words,
  which is a reading surface, not a metric surface. Do not generalise the material to "the top of
  every page".
- **Single Lead's workflow rail is not a drawer and not the Filters dock.** It is a persistent
  decision surface that must stay open while the form is worked. Different contract, different
  component.
- **My Work Queue needs denser priority signalling than the dealer pages** — manual drag ordering, a
  numeric priority column, cell-level highlighting. Do not flatten it to the dealer row model.
- **Single Vehicle needs more reference depth than the inline workspace can hold.** The inline
  workspace is for triage; the page is for the full record. Forcing one layout on both would either
  bloat the list or truncate the page.
- **The employee product's 13px density is a decision, not drift.** 94 rows × 16 columns cannot be
  set at 14px in 1141px.

---

## 15 · CONTRADICTIONS REQUIRING A FUTURE DECISION

1. **Which product does the system descend from?** The redesign is richer; the shipped backend is more
   systematic. Until this is answered, "consistency" has no direction.
2. **Does colour carry state or ownership?** (F38.) Both are shipped today.
3. **Is there one type scale or one per density class?** (F6, F44.)
4. **Does the vehicle workspace reuse the Single Vehicle cockpit, or is the cockpit reserved for the
   full page?** Sharing it is the strongest cross-page win available and the biggest scope risk.
5. **What is the sticky budget?** Nobody has stated a maximum. Gen 11 spends 192px; production spends
   145px for a page with more chrome.
6. **Who owns `all-vehicles-gen10.css`?** Three pages depend on it. It is either migrated wholesale or
   frozen and forked per page; both have costs and neither has been chosen.

---

## 16 · TOP 25 NEXT ACTIONS

Ordered by dependency and risk, not by page.

### A · BEFORE ALL VEHICLES STAGE 2
1. Fix the 1366 overflow in `all-vehicles-gen10.css` — move the 1360 breakpoint to 1400 (F41, P0). Two pages, one line.
2. Apply the Stage 1 layer ladder to the Gen 10 base so the expansion stops painting over the sticky header on All Leads (F20, P0).
3. Replace the `box-shadow` focus ring in the Gen 10 base with the Stage 1 `outline` system (F43, P0).
4. Decide the sticky budget as a number, and measure the four pages against it (F9).
5. Decide `--focal`: one navy for the emphasis surface (F1).
6. Freeze the neutral drift: one set of `--ground/--ink/--line/--well/--wash` (F3).
7. Answer contradiction #1 — which product the system descends from. Everything below inherits it.

### B · ALL VEHICLES STAGE 2
8. Implement the selected-row anchor and in-flow expansion per `GEN11_STAGE2_INTERACTION_BLUEPRINT.md`, using All Leads' in-flow expansion as the reference implementation (F12).
9. Author the engaged sticky composition as **one** workspace, not four panels (F13).
10. Restructure the vehicle detail into Merchandising health → Market intelligence → Specification → History, without accordion bars, using the Single Vehicle section rail as the precedent (F32).
11. Give the expansion the `--z-raised` tier it already has, and verify it travels under the header at every scroll position.
12. Fix the `.exp` one-shot `top` measurement as part of moving to flow (it disappears with the popover).
13. Re-author `.cmd--stuck` / `.hd--stuck` payloads — the hooks exist and are empty.

### C · AFTER ALL VEHICLES STAGE 2
14. Give All Leads the same workspace inset so the band stops changing width mid-scroll (F17, F19, P0).
15. Fix Single Lead's tab bar detachment: it must keep its sheet's width and inset on engage (F25, P0).
16. Make Single Lead's workflow rail content-sized or scrollable; remove `overflow: hidden` from the fixed-height sticky panel (F30).
17. Shift Single Lead's focal split from 61.7/38.3 to ~65/35 (F24) — one grid track.
18. Move All Leads' "By status" out of the Lead Board card and beside Flags (F21) — reorganisation of existing content only.
19. Adopt All Leads' flexible `minmax` column tracks for Gen 11 (F11) — the older page has the better model.

### D · BEFORE DESIGN.MD
20. Settle the status-colour semantics across dealer and employee products (F38, contradiction #2).
21. Settle the type scale question — one scale or a density axis (F6, F44, contradiction #3).
22. Decide whether the vehicle identity module is shared between Single Vehicle and the workspace (contradiction #4) — the single biggest cross-page win, and the biggest scope risk.
23. Validate the timeline / communication-history patterns against the real Activity and Emails tabs, which this audit did not reach (F31).

### E · AFTER DESIGN.MD / PAGE MIGRATION
24. Give My Work Queue a column-priority model; 16 wrapping headers is the densest unsolved table in the product (F36, P0).
25. Decide the fate of `all-vehicles-gen10.css` — migrate the three pages onto the new foundation, or fork it per page and retire it (contradiction #6).

---

*End of audit. No application source file was modified. Stage 2 was not implemented. `DESIGN.md` was
not created.*
