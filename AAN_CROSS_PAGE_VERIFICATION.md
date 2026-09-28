# AAN — CROSS-PAGE ADVERSARIAL VERIFICATION (PASS 2)

**Date** 2026-09-27 · **Type** research only. No application source file was modified.
**Method** every P0 and every system-level P1 from `AAN_CROSS_PAGE_DESIGN_AUDIT.md` was reproduced
independently in a real Chromium session, with in-memory style experiments used to test the *stated
cause*, not just the symptom. Where the first audit's mechanism could not be reproduced, it is
rejected even when the symptom is real.

**Headline: the first audit was right about roughly two thirds of what it claimed, wrong about three
mechanisms, and missed one architectural fact that changes the Stage 2 plan.**

---

## 1 · PAGES AND VARIANTS ACTUALLY INSPECTED

| # | Surface | Variants | File(s) |
|---|---|---|---|
| 1 | All Vehicles Gen 11 | current build `?v=202609271700` | `pages/dealer/all-vehicles-gen11.{html,css,js}` |
| 2 | All Leads Gen 10 | current build | `pages/dealer/all-leads-gen10.*` + `all-vehicles-gen10.css` |
| 3 | Single Lead Gen 10 | **Overview · Contact · Trade-in · Activity · Emails** (all five) | `pages/dealer/single-lead-gen10.*` |
| 4 | Single Vehicle | **d05-1** full · **d05-2** sparse new unit · **d05-3** warning ($0, no photos) · **d06-2** AI dock | `aan-design-export-2026-09-09/pages/` |
| 5 | My Work Queue | **s01-1** My Work · **s01-2** All Open filtered · **s01-3** archived + keyword | `aan-design-export-2026-09-09/pages/` |

**13 page-variants** inspected against 5 in the first pass.

## 2 · VIEWPORTS ACTUALLY TESTED

1280×720 · 1366×768 · 1440×900 · 1920×1080, plus a **601px-tall stress viewport** used to force the
Single Lead workflow rail past its `max-height`. Viewport width was asserted inside each measurement;
readings taken before layout settled were discarded (see §5, R3).

---

## 3 · FIRST-AUDIT P0 VERIFICATION

### P0-a · F41 — 1366 overflow on All Leads and Single Lead → **CONFIRMED**
**Page/viewport/state** All Leads, 1366×768, default.
**Measured** `scrollWidth` 1380 vs `clientWidth` 1354 = **+26px**. The page is genuinely
horizontally scrollable (`maxScrollX` 25.6), so it is user-visible, not a phantom.
**Selector** `div.nav__it.nav__it--r` › `button.av` (the account avatar), right edge 1380.
**Cause confirmed** the topbar's flex spacer `.top__sp` has collapsed to **0px**; the brand wordmark
is still 157px wide because the hiding breakpoint is `max-width: 1360px` and the viewport is 1366.
**Same on Single Lead**: +26px, same offender.
**Fix from Stage 1 verified sufficient**: hiding `.brand__t` alone removes 113px against a 26px
deficit. Reusing the existing 1360 query at 1400 introduces no new rules.

### P0-b · F20 — "expanded content covered by the sticky header" → **SYMPTOM CONFIRMED · MECHANISM REJECTED**
This is the most consequential correction in the pass.

**What the first audit said:** the expansion paints over the header because `.hd` sits at `z-index: 4`;
fix with the Stage 1 layer ladder.

**What actually happens, measured.** With a row expanded and the page at y=1100, five probe points
across the full width of the header band all return elements *inside the expansion*. But:

- `.exp` is `position: static`, `z-index: auto`. No ancestor of either element creates a stacking
  context (verified by walking both ancestor chains).
- **In-memory experiment:** setting `.hd { z-index: 10 }`, then `999`, then additionally giving `.exp`
  an explicit lower tier — **the hit test does not change in any of the three cases.**
- Reason: at that moment `.hd` has **`opacity: 0`** and **`pointer-events: none`**.
  `elementsFromPoint` shows the header is not in the stack at all.

**The header is not being covered. It is removing itself.** The rule is `.hd--veil { opacity: 0;
pointer-events: none }`, live in `all-vehicles-gen10.css` — the same veil Stage 1 deleted from Gen 11,
still shipping in the shared base. The JS toggles it whenever an expansion overlaps the header band
(`all-leads-gen10.js:241`).

**User-visible behaviour, measured by scroll sweep:** the column header is fully visible at y=600,
**invisible from y≈800 to y≈1200** (opacity 0, ~400px of travel), and returns at y=1400.

**Consequence for the plan:** applying the layer ladder to the Gen 10 base **would not fix this**.
The fix is deletion of `.hd--veil` and its JS branch — mechanically identical to what Stage 1 already
did on Gen 11. The ladder is still worth applying (see P1-b) but for a different defect.
**Evidence:** `verification-pass/all-leads/1440-y600-header-present.webp` vs
`1440-y1100-header-veiled-away.webp`.

### P0-c · F19 — "sticky transition loses or crops parts" → **PARTLY CONFIRMED · PARTLY REJECTED**
**Confirmed — the band changes width mid-scroll.** Measured on All Leads:
at rest `.cmd` 26→1402 (1376 wide) inside a sheet at 16→1412; engaged `.cmd` **0→1428**, while `.hd`,
`.row` and `.field` stay 16→1412. Three left edges in one stack (0 / 16 / 26) and a 52px width change
on engage. Visible in the screenshot: a full-bleed grey band over an inset white sheet.

**Rejected — "the first row is sliced with no separation."** The engaged header carries
`::before { left: -16px; right: -16px; background: #fff; box-shadow: rgba(14,20,33,.22) 0 8px 16px -8px }`.
There *is* an edge-to-edge background and a drop shadow. The separation is **weak**, not absent.
The first audit overstated it.

### P0-d · F25 — Single Lead sticky tab bar detaches → **CONFIRMED, with exact geometry**
Measured across y = 0 / 300 / 700 / 1543 / 2200:
- at rest: `.cmd--nav` **26→986** (960 wide) inside `.field` **16→996** — inset 10px each side.
- engaged: `.cmd--nav` **0→996** (996 wide) — flush with the sheet's right edge, **16px past its left
  edge**, touching the viewport.
The bar grows 36px and becomes asymmetric relative to the content it labels. This is the "dark clipped
remnant on the left". **Evidence:** `verification-pass/single-lead/…`.

### P0-e · F36 — My Work Queue "all 16 headers wrap at 1440" → **MODIFIED AND DOWNGRADED P0 → P2**
The first audit's measurement was wrong. It tested `th.scrollHeight > 24`, but every `th` is stretched
to the tallest cell in the header row (77px), so **every** column reported as wrapping regardless of
its text.

**Re-measured properly** with `Range.getClientRects()` on the text runs, s01-1 at 1440:
- 14 labelled columns (16 cells, two empty). **8 wrap**, not 16.
- 6 of those 8 wrap cleanly at a word boundary — "Ticket / Age", "Work / Type", "Begin / Date".
- **2 break inside a word**: "Remainin/g Time" and "Assigne/d", both in 75px columns, caused by
  `overflow-wrap: break-word` + `hyphens: auto`.
- s01-2 (different column set): 11 of 16 wrap, **0 mid-word breaks**.

**Verdict on the brief's question.** Two-line word-boundary wrapping in a 16-column operational table
is **expected dense-table behaviour**, not a usability failure. The genuine defect is narrow: two
labels break mid-word for want of roughly eight pixels. That is **P2**.

### P0-f · F43 — focus solved on one page of five → **CONFIRMED**
`all-vehicles-gen10.css` still carries the `box-shadow`-only focus ring that Stage 1 proved is erased
by every later decorative shadow, and it feeds All Leads, Single Lead and All Vehicles Gen 10. The
Stage 1 `outline` system exists only in Gen 11's own stylesheet.

---

## 4 · SYSTEM-LEVEL P1 VERIFICATION

### P1-a · "All Leads has in-flow expansion but **no anchor**" → **REJECTED. The anchor already exists.**
This is the second consequential correction, and it removes the largest open question from the Stage 2
plan.

**Measured, four scenarios on All Leads:**

| start scrollY | row | row top after open | page moved | expansion visible |
|---|---|---|---|---|
| 0 | 2 | **172** | +507 | 529px of 529 |
| 0 | 10 | **173** | +1003 | 487px of 487 |
| 1500 | 20 | **172** | +123 | 487px of 487 |
| 3500 | 50 | **172** | −17 | 507px of 507 |

Every open places the selected row's top at **y ≈ 172**, from any starting position, travelling in
either direction, with the expansion fully on screen every time.

**Source** `all-leads-gen10.js:187`:
```
var y = Math.max(0, r.getBoundingClientRect().top + window.scrollY - 56 - 58 - 48 - 10);
var sp = $('#exp-space');
if (sp) { var need = y - (document.documentElement.scrollHeight - window.innerHeight);
          sp.style.height = need > 0 ? Math.ceil(need) + 'px' : '0px'; }
window.scrollTo({ top: y, behavior: 'smooth' });
```
Anchor = sticky stack (56 + 58 + 48) **+ 10px**, hardcoded. `behavior: 'smooth'`.

**`.exp-space` is not dead code.** It is the **document extender** that makes the anchor reachable for
rows near the end of the list. Measured: opening the **last** row grows it to **603px** and the
document from 4949 → 6070; opening a mid-list row leaves it at **0px**.
The first-pass blueprint listed `.exp-space` under "rules that must be deleted". That is wrong and is
corrected in `GEN11_STAGE2_BLUEPRINT_VERIFICATION.md`.

**Consequence:** the Stage 2 anchor is **not new functionality**. It is an existing product behaviour,
reached by the existing row click, that All Vehicles Gen 11 lost when it adopted the popover.

### P1-b · In-flow expansion mechanism → **CONFIRMED as reusable, with three defects that must not transfer**
Measured on All Leads: document grows **517px** for a **507px** expansion (reserves its space);
**0 sibling rows covered**.

**Defects that must not transfer:**
1. **69 sibling rows dimmed** — `.field.has-open .row:not(.open) { opacity: .55 }` lives in the
   **shared base** (`all-vehicles-gen10.css:731`), so it affects All Leads today and Gen 11 by copy.
2. **The `hd--veil`** header-vanishing (P0-b).
3. **The band width discontinuity** (P0-c).

### P1-c · F30 — Single Lead workflow rail "will clip silently" → **REJECTED**
Stress-tested at a **601px-tall viewport**, which forces `max-height` down to 529px against 625px of
content:
- `.dock` clamps to 529 and is **not clipped** (`scrollHeight == clientHeight`).
- `.dock__b` has `overflow: auto`, becomes scrollable (506 content in a 411 box).
- **The user can reach the bottom of the content** (verified by scripted scroll).

The panel is a correctly-built scrollable sticky region. The first audit's prediction was wrong. If
the brief's memory of "chopped content" is real it belongs to an earlier build.

### P1-d · F9 — "Gen 11's 192px sticky stack is excessive" → **MODIFIED. Height is not the problem.**
Measured at two viewports, Gen 11:

| viewport | at rest: first row at | % of viewport | engaged: sticky bottom | % of viewport | rows visible engaged |
|---|---|---|---|---|---|
| 1366×768 | 635px | **82.5%** | 192px | **25.0%** | **6** |
| 1920×1080 | 635px | 60.9% | 192px | 18.4% | 10 |

Both values are **constant in pixels**; the percentage is purely a function of viewport height.

**Separating the two problems the brief asked about:**
- **HEIGHT PROBLEM — mild.** 192px engaged is 18–25%. Comparable pages: Single Vehicle 145px, All
  Leads 162px, My Work Queue 159px. Gen 11 is the heaviest by ~30px, not by a category.
- **AT-REST PROBLEM — severe, and it is not the sticky stack.** The 635px before the first row is
  page head (68) + bento (220) + lane track (50) + scope line (48) + the stack (192). Four of those
  five scroll away. At 1366×768 that leaves **one visible row** on first paint.
- **VISUAL STACKING PROBLEM — separate, and narrower than the first audit claimed.** See §7.

**Classification: ARCHETYPE-SPECIFIC.** An operational list needs scope + command + column header; a
detail page does not. Declaring one universal maximum is not supported by the evidence.

### P1-e · F7 — the bento slots are positional, not semantic → **CONFIRMED, and worse than reported**
New evidence at **1280 on Single Lead**: the grid computes as three tracks
(`537.9px 232px 433.8px`) but the children land as `.focal` **spanning all three** (1236px) on row 1,
then `.value` at **538px** and `.attn` at **232px** on row 2 — with the **433.8px third track left
empty**. The most important card (Lead facts) is squeezed into the track sized for the smallest one.
**This is a new P1** the first pass missed because it only measured Single Lead at 1440 and 1366.
**Evidence:** `verification-pass/single-lead/1280-bento-grid-misassigned.webp`.

### P1-f · F24 — Buyer's Message / Vehicle of Interest proportions → **MODIFIED**
The first audit reported 61.7 / 38.3 and recommended "shift to ~65/35, one grid track". Re-measured
across widths:

| viewport | focal grid | Buyer | Vehicle |
|---|---|---|---|
| 1280 | `995.7px 240px` (bento reflowed) | **80.6%** | 19.4% |
| 1440 | `386.5px 240px` | **61.7%** | 38.3% |
| 1920 | `652.2px 240px` | **73.1%** | 26.9% |

The structure is `1fr 240px`: the Vehicle card is **fixed**, so the ratio is a consequence of the
available width, not a setting. The stated 65–70 / 30–35 target is met at **no** tested width and
falls between 1440 and 1920. A single "change one track to 65/35" instruction is therefore wrong.

### P1-g · Single Lead "tabs" → **CORRECTED. They are section anchors, not tabs.**
`<a class="secnav__b" href="#s-overview" data-sec="s-overview">` — all five entries are same-page
anchors, and all five sections are present in one continuous scroll (measured y-positions 465 / 1121 /
1939 / 2054 / 2639). Two carry counts (Activity 3, Emails 3).
**Single Lead already has a horizontal section navigator with counts.** This matters for the
no-accordion question (§8) and it means Single Lead is not a tabbed page.

### P1-h · C-11 / C-12 timeline and communication history → **UPGRADED from "needs validation"**
The first pass never reached these tabs and proposed borrowing patterns from Single Vehicle. Single
Lead provides its own, stronger evidence:
- **Activity** — a note composer (`textarea` + "Add Note", logged-as line) above a `.feed` of `.ev`
  events with a vertical connector, a per-kind icon chip, a title, a kind label (NOTE / MAIL), body
  text, an author line and a right-aligned date+time. Kinds present: `ev--note`, `ev--mail`,
  `ev--created`.
- **Emails** — a `.mail` list with a header row (Subject / From-To / Date), an **IN/OUT direction
  chip**, subject plus inline preview, a count line and a "Write email" action.
**Do not import a timeline from another page. This page has one.**

### P1-i · Emails rows already carry the disclosure contract → **NEW, CONFIRMED**
`<div class="em" role="button" tabindex="0" aria-expanded="false">`. The contract that
`GEN11_AUDIT.md` found missing on the All Vehicles row is **already implemented** on Single Lead's
email rows, and correctly implemented on the Gen 11 accordion. All Vehicles' row is the outlier, not
the product.

### P1-j · F39 — cell-level attention highlight → **MODIFIED**
s01-1 highlights a "Last Modified" cell amber where another user made the edit. s01-3 uses **the same
amber** (`rgba(250,204,21,.35)`) for **keyword-match highlighting** across 5 cells, while 399 cells
carry a grey tint for **archived** rows. One visual, at least two meanings. Record as a semantics
question, not as a pattern to promote.

---

## 5 · FINDINGS REJECTED

| Ref | First-pass claim | Verdict | Evidence |
|---|---|---|---|
| F20 mechanism | "expansion paints over the header because `.hd` is z-index 4" | **REJECTED** | z-index 10 / 999 / explicit tier — no change. `.hd` is `opacity: 0; pointer-events: none` via `.hd--veil`. |
| F19 part | "first row sliced with **no separation**" | **REJECTED** | `.hd--stuck::before` paints an edge-to-edge sheet with `0 8px 16px -8px` at 22%. |
| F30 | Single Lead rail "will clip silently on the next field" | **REJECTED** | 601px stress test: body scrolls, bottom reachable. |
| F36 scale | "all 16 headers wrap" | **REJECTED** | 8 of 14; measurement error in the first pass. |
| P1-a | "All Leads has no anchor" | **REJECTED** | Anchor exists at stack+10px with a document extender. |
| R3 | "All Leads overflows 10px at 1920" *(observed once during this pass)* | **REJECTED as artifact** | Re-measured after layout settled: 0. Recorded so it is not repeated. |

---

## 6 · FINDINGS MODIFIED

1. **F19** — keep the band width discontinuity; drop "no separation"; the separation is weak.
2. **F20** — keep the symptom; replace the mechanism and therefore the fix.
3. **F24** — replace "shift to 65/35" with "the Vehicle card is a fixed 240px; decide fixed vs
   proportional, then measure at each target width".
4. **F36** — 8 of 14 wrap; 2 mid-word breaks; **P0 → P2**.
5. **F9** — split into a mild engaged-height issue and a severe at-rest issue; the at-rest cost is the
   bento and the two control rows, not the sticky stack.
6. **F13** — the "stack of rounded panels" is **two** surfaces, not three (see §7).
7. **F39** — the cell highlight has at least two meanings; not yet a pattern.
8. **C-11 / C-12** — upgraded; Single Lead supplies its own evidence.

---

## 7 · WHICH ASPECTS ACTUALLY CREATE THE "STACK OF ROUNDED PANELS"

Measured on Gen 11 at 1366, engaged:

| layer | y | background | radius | inset (l→r) | own shadow |
|---|---|---|---|---|---|
| `.top` | 0→68 | `rgba(255,255,255,.76)` + blur | **24px all corners** | 16 → 1338 | `0 28px 64px` |
| `.cmd` | 68→140 | `rgba(255,255,255,.88)` + blur | **24px top, 0 bottom** | **26 → 1328** | 1px ring |
| `.hd` | 140→192 | `#ffffff` opaque | 0 | 16 → 1338 | `0 1px 0` bottom edge |

**The seam is created by exactly two things:**
1. `.top`'s **bottom** corners are 24px while `.cmd` begins immediately beneath it at y=68 — two
   rounded edges meeting with no gap.
2. `.cmd` is inset **26px** while everything above and below it is inset **16px** — a 10px white
   shoulder on each side that reads as a separate floating slab.

**The column header is not part of the problem.** It is opaque, square and flush with the rows; it
reads as the table's own top edge, which is correct.

**Testing the first audit's three hypotheses:**

| Hypothesis | Verdict | Why |
|---|---|---|
| "one opaque surface" | **REJECT** | The alpha ladder .76 → .88 → 1.0 is a coherent depth cue and is Gen 11's visual identity. Flattening it to opaque discards the direction to fix a seam caused by radius and inset. |
| "zero inner radii" | **MODIFY → narrow it** | Only `.top`'s bottom corners and `.cmd`'s top corners are at fault. `.cmd`'s bottom radius is already 0 and `.hd` is already square. |
| "one bottom shadow" | **MODIFY** | `.hd` already owns the stack's bottom edge. The redundant ones are `.top`'s 28/64px shadow and `.cmd`'s ring, both invisible where the layers touch. |

**Corrected direction (hypothesis, not decision):** one inset for all three layers; `.top`'s bottom
corners square when `.cmd` is engaged; drop the two interior shadows; keep the translucency ladder.

---

## 8 · PRODUCTION VS REDESIGN — TESTING THE FIRST AUDIT'S CLAIM

The first audit said the shipped backend is "more systematic" and implied it might be the source of
truth. Tested properly, separating *systematic* from *visually desirable*:

| Dimension | Production (SV / WQ) | Redesign (AV / AL / SL) | Honest verdict |
|---|---|---|---|
| distinct shadows per page | **1** | 8–18 | production is more disciplined |
| distinct radii | 4–6 | 12–17 | production is more disciplined |
| distinct type styles | 15–17 | 24–29 | production is more disciplined |
| z-index ladder | ordered by permanence (40/60/70/80/90/120) | three unrelated ladders | **production wins outright** |
| section architecture | rail + continuous scroll + counts + state badges | accordion grid that relocates siblings | **production wins outright** |
| field provenance | per field ("2 changes · last −$300", "no history") | per section badge | **production wins outright** |
| conflict state | "🔒 you hold the edit lock", readable | 20×20 padlock with a `title` | **production wins outright** |
| exception signalling | amber badge inside the navigator ("Photos none") | dedicated attention queue that filters the list | **redesign wins** |
| scope selection | lane pills with counts + a semantic lane state | lane rail with counts | **tie; production has the extra state** |
| density control | 13px, 16 columns, 67px rows | 14px, 13 columns, 74px rows | different archetypes; not comparable |
| contemporary visual quality | flat, 3px, utilitarian | glass, 24px, composed | **redesign wins** |
| hierarchy within a page | strong (spine-coloured sections, one shadow) | weaker (three coequal dark cards, 18 shadows) | production wins |
| maintainability | one theme, 2 `:root` | three families, 8–12 `:root` in the Gen 10 base | production wins |

**Conclusion: no winner should be forced, and the first audit came close to forcing one.**
The defensible split is:
- **Interaction discipline, layering, provenance, state legibility and section architecture** →
  descend from production.
- **Visual direction, surface language, the exception queue and the summary composition** →
  descend from Gen 11.

Production is more *systematic*; it is not more *desirable*. Both statements are supported.

---

## 9 · SINGLE LEAD — ACTIVITY AND EMAILS FINDINGS

1. **Activity is a real chronological feed**, not a stub: composer → event list with connector, kind
   icon, kind label, body, author, timestamp. Three kinds present (`note`, `mail`, `created`).
2. **Emails is a compact communication list**, not stacked raw text: header row, IN/OUT direction
   chip, subject + inline preview, date, count, "Write email".
3. **Email rows already carry `role="button"`, `tabindex="0"`, `aria-expanded="false"`.**
4. **The section navigator does not anchor to the sticky stack.** Clicking "Activity" scrolls so the
   section top lands at **y≈511**, well below the 104px stack — unlike All Leads' row anchor, which
   lands precisely. Two anchoring behaviours in one product.
5. **The Workflow rail has a dirty state** — "Unsaved changes · Discard · Save" — which the first pass
   did not see because it never changed a value. Existing functionality; record it.
6. The rail also holds a **MARKETING UTM TRACE** block and a Newsletter flag below the Save bar, so
   its content is longer than the first pass measured. It still does not clip (§4, P1-c).

---

## 10 · SINGLE VEHICLE — MULTI-VARIANT FINDINGS

| | d05-1 (full) | d05-2 (sparse) | d05-3 (warning) |
|---|---|---|---|
| document height | 10 697 | 4 693 | 10 716 |
| cockpit | full identity line | same structure | same structure |
| rail items | 11 | 11 | 11 |
| counts | Pricing $1100k · Photos 64 · Features 183 | Pricing $14.5k · Photos 17 · **Features 0** | Pricing **$0** · Photos **none** · Features 185 |

1. **The rail is stable across states**; only its counts change. Zero counts are shown, not hidden
   ("Features 0").
2. **Deficient values are stated plainly** in the cockpit: "$0", "📷 Photos none".
3. **The rail carries semantic state badges**: "Photos none" renders as
   `ui-vrail__bdg--warn`, `rgb(138,92,0)` on `rgb(250,238,203)` — the same amber the Work Queue uses
   for its keyword chip. **One warn colour across two products.**
4. **Provenance markers repeat**: "↺ no history" appears four times in the warning variant.
5. d06-2's AI dock is an inline panel in the export, not a high-z overlay; it yielded no layering
   evidence.

---

## 11 · MY WORK QUEUE — MULTI-VARIANT FINDINGS

| | s01-1 My Work | s01-2 All Open filtered | s01-3 archived + keyword |
|---|---|---|---|
| rows | 94 | 23 | 50 |
| columns | 16 | 16 (different set) | 16 |
| header wraps | 8 of 14 | 11 of 16 | — |
| mid-word breaks | **2** | **0** | — |
| overflow @1440 | 0 | 0 | 0 |

1. **Variant 1 is not the complete model.** The column set changes between lanes (s01-2 has "Date
   Created", "Days Since Modified", "Priority ▲"; s01-1 has "Remaining Time", "My Est. Time").
2. **The lane rail has two groups**: a left segmented pair ("My Work 94", "My Following 4", square
   corners, white) and a pill group with counts (`radius: 999px`, tinted). The active pill is blue on
   `rgb(227,236,249)`; **"Pending 4" is red-on-light with a red border** — a semantic lane state.
3. **s01-3 adds a removable keyword chip** — `"carfax" ×` in the shared warn amber — and renders
   **399 archived cells on a grey tint**, a row-level de-emphasis treatment.
4. **Cell-level highlight has two meanings** across variants (§4, P1-j).

---

## 12 · STICKY BUDGET FINDINGS

| Page | engaged chrome | % @1366×768 | % @1920×1080 | at-rest first content | % @1366 |
|---|---|---|---|---|---|
| All Vehicles G11 | **192px** | 25.0% | 18.4% | 635px | **82.5%** |
| All Leads G10 | 162px | 21.1% | 15.5% | 544px | 70.8% |
| My Work Queue | 159px | 20.7% | 15.3% | — | — |
| Single Vehicle | 145px | 18.9% | 13.9% | — | — |
| Single Lead G10 | 104px | 13.5% | 10.0% | — | — |

**Classification: ARCHETYPE-SPECIFIC.**
- Operational lists (AV, AL, WQ) run 159–192px because they carry scope + command + column header.
- Object pages (SV, SL) run 104–145px because they carry identity + section navigation only.
- A single product-wide maximum would either starve the lists or leave the detail pages padded.

**For Gen 11 specifically:** the engaged 192px is **not excessive**; it is 30px above the next
heaviest page of the same archetype. The genuine cost is the **635px of at-rest content above the
list**, which leaves one visible row at 1366×768 — and four fifths of that is scrolling content, not
chrome.

---

## 13 · CROSS-WIDTH MATRIX

| Page / variant | 1280 | 1366 | 1440 | 1920 | notes |
|---|---|---|---|---|---|
| All Vehicles G11 | 0 | 0 | 0 | 0 | Stage 1 fix holds at all four |
| All Leads G10 | 0 | **+26px** | 0 | 0 | `button.av`; page is horizontally scrollable at 1366 |
| Single Lead G10 | 0 | **+26px** | 0 | 0 | same offender; **bento grid mis-assigns at 1280** |
| Single Vehicle d05-1/2/3 | — | — | 0 | — | export fixed-width shell |
| My Work Queue s01-1/2/3 | — | — | 0 | — | 2 mid-word header breaks at 1440 in s01-1 |

**Truncation / sub-floor** (unchanged from pass 1, re-confirmed): Gen 11 truncates 16/16 VINs and
12/16 trims at 1440; All Leads truncates 59/70 emails at 1366 and renders seven cell types at
12.5–13.5px across all 70 rows.

---

## 14 · ACCESSIBILITY VERIFICATION

**Method correction.** The first pass's contrast probe read the *parent's* background for elements
carrying their own opaque chip, producing three false failures on Gen 11 (`.brand__mk`,
`.dealer__mk`, the active pager). Those are confirmed **not** failures.

**Genuine, measured findings:**

1. **Lane rail zero state fails AA.** `.lane--zero` is `rgb(87,96,112)` at **`opacity: .7`** over the
   `rgb(238,241,245)` track. Composited: `rgb(132,140,152)` on `rgb(238,241,245)` = **≈2.95:1** at
   13px, against a 4.5 requirement. The colour alone would pass at 5.6:1; the opacity is what fails it.
2. **Lane rail selected state carries almost no surface signal.** White fill on the track is
   **1.13:1**. Selection is carried by the shadow and the brand ink (8.11:1 ink-on-fill). Legible
   today, but fragile.
3. **The focus system is correct on Gen 11 only** (P0-f). The shared Gen 10 base still uses the
   erased `box-shadow` ring.
4. **`.hd--veil` removes a persistent landmark for ~400px of scrolling** on All Leads (P0-b) — an
   orientation failure, not only a visual one.
5. **All Leads dims 69 live, clickable rows to 55%** — the shared-base rule.
6. **No new keyboard functionality is proposed anywhere in this pass.**

---

## 15 · UNRESOLVED QUESTIONS

1. **Descent per role** (from §8). Interaction discipline from production, visual direction from
   Gen 11 is defensible — but it has not been agreed, and every token decision waits on it.
2. **Does colour carry state or ownership?** Work Queue colours open tickets by department; the dealer
   pages colour by state. Unchanged from pass 1, still unresolved.
3. **What does the amber cell highlight mean?** Modified-by-another-user in s01-1, keyword match in
   s01-3.
4. **Should the Vehicle-of-Interest card be fixed (240px) or proportional?** The stated ratio target
   cannot be met at both 1440 and 1920 with a fixed track.
5. **Should section navigators anchor to the sticky stack?** All Leads' row anchor does; Single Lead's
   section anchor does not.
6. **Is the 10px gap below the anchor a decision or an accident?** It is hardcoded in All Leads' JS
   alongside the three stack heights.
7. **What is the fate of `all-vehicles-gen10.css`?** Unchanged from pass 1. Three pages depend on it
   and it carries three P0s.

---

*End of verification. No application source file was modified. No new product functionality is
proposed. Stage 2 was not implemented. `DESIGN.md` was not created.*
