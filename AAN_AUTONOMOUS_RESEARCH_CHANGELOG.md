# AAN — AUTONOMOUS RESEARCH CHANGELOG

**What changed between Pass 1 (cross-page audit) and Pass 2 (adversarial verification).**
Written so the first audit is never mistaken for settled truth.

**Date** 2026-09-27 · Pass 1: 5 surfaces, 1 variant each, measured at 1440 with spot checks.
Pass 2: **13 page-variants**, four viewports plus a 601px stress viewport, with in-memory style
experiments used to test stated *causes* rather than symptoms.

**Scorecard:** 9 confirmed · 8 corrected · 6 rejected · 10 new findings · 10 pieces of invented
functionality removed from the plan.

---

## 1 · CONFIRMED FROM PASS 1

These survived an attempt to disprove them.

| # | Finding | How it was re-tested |
|---|---|---|
| 1 | **1366 overflow on All Leads and Single Lead, +26px** | Reproduced on both; offender isolated to `button.av`; the page is genuinely horizontally scrollable (`maxScrollX` 25.6), so it is user-visible. Cause confirmed as the 1360 breakpoint missing 1366 by six pixels. |
| 2 | **Single Lead's sticky tab bar detaches** | Measured at five scroll positions: 26→986 at rest, **0→996** engaged, over a sheet at 16→996. It grows 36px and overhangs the form's left edge by 16px. |
| 3 | **The command band changes width mid-scroll on All Leads** | At rest 26→1402; engaged **0→1428**; header and rows stay 16→1412. Three left edges in one stack. |
| 4 | **Focus is solved on one page of five** | The `box-shadow`-only ring is still in `all-vehicles-gen10.css`, feeding three pages. |
| 5 | **Gen 10 base is the real shared foundation, with 8 `:root` blocks** | Re-confirmed; three pages depend on it. |
| 6 | **The bento slots are positional, not semantic** | Confirmed, and now shown to fail structurally at 1280 (see §4, N1). |
| 7 | **Gen 11's summary cards are one material after Stage 1** | All three `rgb(23,34,52)`, radius 24, one `--sh-card`; contrast 6.27–14.74:1. |
| 8 | **The in-flow expansion mechanism is reusable** | Document grows 517px for a 507px expansion; **0 sibling rows covered**. |
| 9 | **Token layer of Gen 11 is a superset of Gen 10** | 0 tokens exist only in Gen 10; semantic colours byte-identical. |

---

## 2 · CORRECTED FROM PASS 1

The finding was real; the description, the cause, the scale or the fix was wrong.

| # | Pass 1 said | Pass 2 measured | Consequence |
|---|---|---|---|
| 1 | "The expansion **paints over** the sticky header because `.hd` is z-index 4 — fix with the layer ladder." | `.hd` is **`opacity: 0; pointer-events: none`** via **`.hd--veil`**, live in the Gen 10 base. Raising `.hd` to z-index 10, then 999, then giving `.exp` an explicit lower tier changed **nothing**. The header **hides itself** for ~400px of scrolling (visible y=600, gone y=800–1200, back at y=1400). | **The proposed fix would not have worked.** The fix is deleting the veil, exactly as Stage 1 did on Gen 11. |
| 2 | "The first row under the engaged header is sliced **with no separation**." | `.hd--stuck::before` paints an edge-to-edge sheet with `rgba(14,20,33,.22) 0 8px 16px -8px`. The separation is **weak, not absent**. | Overstatement removed. |
| 3 | "**All 16** Work Queue headers wrap at 1440 — P0." | The measurement was wrong (it divided the *cell* height, stretched to 77px, by line-height). Re-measured with `Range.getClientRects()`: **8 of 14 wrap**, 6 cleanly at word boundaries, **2 break mid-word** ("Remainin/g", "Assigne/d"). Variant 2: 11 of 16 wrap, **0 mid-word breaks**. | **P0 → P2.** Clean two-line wrapping in a 16-column table is expected dense-table behaviour. |
| 4 | "Gen 11 spends **79% of the viewport** before the first row — the 192px stack is excessive." | Both numbers are constants. At 1366×768: at rest 635px = **82.5%**, **but engaged the stack is 192px = 25%** with **6 rows visible**. At 1920×1080: 18.4%, 10 rows. Comparable pages run 145–162px. | **Split into two findings.** Engaged height is archetype-appropriate; the severe cost is the 635px of at-rest content, four fifths of which scrolls away. A universal maximum is rejected. |
| 5 | "The 'stack of rounded panels' is three materials, three insets, two radii, 192px of it." | The seam is **two surfaces**: `.top`'s bottom corners (24px) meeting `.cmd`'s top corners at y=68, plus `.cmd`'s 26px inset against 16px above and below. The column header is opaque, square and flush — **not part of the problem**. | Diagnosis narrowed from a composition rewrite to two corners and one inset. |
| 6 | "Buyer / Vehicle is 61.7 / 38.3 — shift one grid track to ~65/35." | The grid is `1fr 240px`. Measured: **80.6/19.4 at 1280**, 61.7/38.3 at 1440, **73.1/26.9 at 1920**. The stated 65–70/30–35 target is met at no tested width. | A single-number instruction is wrong. The decision is fixed vs proportional track. |
| 7 | "Single Lead's Activity/Emails were not reached; derive timeline patterns from Single Vehicle." | Both inspected. Activity is a real feed (composer, connector, per-kind icons, kinds `note`/`mail`/`created`). Emails is a compact list with IN/OUT chips **and rows that already carry `role="button"`, `tabindex`, `aria-expanded`**. | Nothing needs importing. Two components upgraded from NEEDS VALIDATION to READY. |
| 8 | "Single Lead's tabs" | They are **same-page section anchors** (`href="#s-activity"`), and all five sections exist in one continuous scroll. | The product has no verified tab component. Re-filed as *section navigator*. |

---

## 3 · REJECTED FROM PASS 1

| # | Claim | Why it fell |
|---|---|---|
| 1 | "**All Leads has in-flow expansion but no anchor.**" | The anchor **exists**. `all-leads-gen10.js:187` computes `rowTop + scrollY − 56 − 58 − 48 − 10` and scrolls smoothly to it. Measured across four scenarios: every open lands the row at **y ≈ 172**, from any start, in either direction, with the expansion fully visible. |
| 2 | "`.exp-space` is dead machinery — delete it." | It is the **document extender** that makes the anchor reachable near the end of the list. Measured: **603px** for the last row, document 4949 → 6070; **0px** mid-list. Deleting it would break the anchor. |
| 3 | "Single Lead's workflow rail **will clip silently** on the next field." | Stress-tested at a 601px viewport, which forces `max-height` to 529 against 625 of content: the dock clamps and is **not clipped**, its body has `overflow: auto`, becomes scrollable, and the bottom is **reachable**. |
| 4 | "Restore the exact pre-open `scrollY` on close, so the round trip is lossless." | The product **does not** restore it, in any of four measured cycles. And it would be harmful: a user who opened at 1623, scrolled to 2223 to read, then closed would be thrown back to 1500 — 723px from what they were reading. |
| 5 | "All Leads overflows 10px at 1920." *(observed once during Pass 2 itself)* | A transient read taken before layout settled. Re-measured: **0**. Recorded so the mistake is not repeated. |
| 6 | Three contrast failures on Gen 11 (`.brand__mk`, `.dealer__mk`, active pager). | Probe artefact: it read the *parent's* background for elements carrying their own opaque chip. Not failures. |

---

## 4 · NEW EVIDENCE

Found in Pass 2, absent from Pass 1.

| # | Finding | Severity |
|---|---|---|
| N1 | **Single Lead's bento grid mis-assigns its cards at 1280.** The grid computes three tracks (`537.9 / 232 / 433.8`) but `.focal` spans all three on row 1 while `.value` (538px) and `.attn` (232px) drop to row 2 — leaving the **433.8px track empty** and squeezing the most important card into the smallest slot. | **P1, new** |
| N2 | **The lane rail's zero state fails AA.** `.lane--zero` is `--ink-3` at `opacity: .7`, compositing to **≈2.95:1** on the track at 13px. The colour alone passes at 5.6:1 — the opacity is what fails it. | **P1, new** |
| N3 | **The lane rail's selected surface step is 1.13:1.** White on `rgb(238,241,245)`; selection is carried almost entirely by the shadow and the brand ink (8.11:1 ink-on-fill). Legible today, fragile. | P2, new |
| N4 | **`.exp-space` is the anchor's document extender** (see §3.2). | architectural |
| N5 | **Close does not restore scroll, and should not** (see §3.4). | architectural |
| N6 | **Single Lead's "tabs" are section anchors**; its section navigator does **not** anchor to the sticky stack (a section lands at y≈511 against a 104px stack), unlike All Leads' row anchor, which lands precisely. Two anchoring behaviours in one product. | P2, new |
| N7 | **Email rows already implement the full disclosure contract** that `GEN11_AUDIT.md` found missing on the All Vehicles row. The All Vehicles row is the outlier, not the product. | evidence |
| N8 | **Specification contains no unique real data.** Its six fields are Trim, Exterior and Stock # (all duplicated from the row) plus Type = "Used", Mileage = "Not recorded", Location = "Chicago Motor Cars" (**hardcoded constants**). Dropping the duplicates would empty the region. | P1, new |
| N9 | **"All clear" and "N of 6 need work" already exist** (`healthSum`). The blueprint's "merchandising clear" was invented. Also: health check 5, "VIN decoded", is a hardcoded always-ok — the six checks are five real ones plus a constant. | correction |
| N10 | **The shipped product already carries semantic state inside its section navigator** — Single Vehicle's `ui-vrail__bdg--warn` renders "Photos none" in amber `rgb(138,92,0)` on `rgb(250,238,203)`, the **same amber** the Work Queue uses for its removable keyword chip. One warn colour across two products, two meanings. | evidence |

**Multi-variant evidence added:** Single Vehicle across full / sparse / warning states (rail stable,
counts adapt, zero counts shown not hidden, deficient values stated plainly); Work Queue across My
Work / filtered / archived (the **column set itself changes per lane**, the lane rail is a segmented
pair plus a pill group, archived rows carry a grey tint across 399 cells, and cell-level amber means
*modified by another user* in one variant and *keyword match* in another).

---

## 5 · INVENTED FUNCTIONALITY REMOVED FROM THE PLAN

Pass 1 proposed ten things the product does not do. All are removed or deferred; full table in
`GEN11_STAGE2_BLUEPRINT_VERIFICATION.md` §21.

| Proposal | Status |
|---|---|
| `↑`/`↓` keyboard vehicle switching | **REMOVED** |
| Move focus to the workspace heading on open | **REMOVED** |
| Return focus to the trigger on close | **REMOVED** |
| Scroll restoration (remember / restore / discard / re-derive) | **REMOVED** |
| Section rail inside the All Vehicles workspace | **REMOVED** |
| Deleting `.exp__x` (an existing control on both pages) | **REVERSED** |
| "merchandising clear" as a new string | **REPLACED** with the existing "All clear" |
| Anchor tolerance band and downward-only travel | **REMOVED** |
| "Identifiers carry a copy action" applied to the redesign | **REMOVED** (exists on Single Vehicle only) |
| A live region announcing "N results, M selected" | **DEFERRED** and reclassified as added behaviour |

---

## 6 · REMAINING UNCERTAINTY

1. **Descent per role.** Pass 2 can now propose a split — interaction discipline, layering,
   provenance, state legibility and section architecture from production; visual direction, the
   exception queue and the summary composition from Gen 11 — but it is a recommendation, not a
   decision, and every token value waits on it.
2. **Does colour carry state or ownership?** Unchanged, and now sharper: the Work Queue colours four
   *open* tickets four ways by department.
3. **What does the amber cell highlight mean?** Two meanings across two variants of one screen.
4. **Fixed or proportional Vehicle-of-Interest card?** The stated ratio cannot be met at both 1440 and
   1920 with a fixed 240px track.
5. **Should section navigators anchor to the sticky stack?** The product does it both ways.
6. **Is the 10px anchor gap a decision or an accident?** It is hardcoded alongside three stack heights
   in All Leads' JS.
7. **The fate of `all-vehicles-gen10.css`.** Three pages, three P0s, unchanged since Pass 1.
8. **Unmeasured:** Single Lead's Contact and Trade-in sections were loaded but not analysed in depth;
   d06's create state and prints menu yielded no layering evidence in the static export; no page was
   tested below 1280, by design.

---

## 7 · HOW TO READ THE TWO PASSES TOGETHER

- `AAN_CROSS_PAGE_DESIGN_AUDIT.md` — the survey. Treat every mechanism in it as provisional unless
  this changelog lists it under §1.
- `AAN_CROSS_PAGE_VERIFICATION.md` — the evidence. Where the two disagree, this one is measured
  against more variants and more viewports.
- `GEN11_STAGE2_INTERACTION_BLUEPRINT.md` — superseded in ten places by
  `GEN11_STAGE2_BLUEPRINT_VERIFICATION.md`. Do not implement from the original alone.
- `AAN_DESIGN_SYSTEM_INPUT.md` — re-classified by `AAN_DESIGN_SYSTEM_INPUT_VERIFICATION.md`. The
  READY list fell from 15 to 8.

**The single most useful thing Pass 2 established:** the Stage 2 interaction model is not a new
design. It is a behaviour the product already ships on All Leads — anchor, in-flow expansion, document
extender, close-without-restore — that All Vehicles Gen 11 lost when it adopted the popover. Stage 2
is a restoration, which is a much smaller and much safer piece of work than Pass 1 described.

---

*End of changelog. No application source file was modified in either pass.*
