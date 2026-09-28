# AAN — DESIGN SYSTEM INPUT VERIFICATION

**Date** 2026-09-27 · Adversarial review of `AAN_DESIGN_SYSTEM_INPUT.md`. That document is not
overwritten; this one re-classifies it.

**Classes used:** `READY FOR EVENTUAL DESIGN.MD` · `NEEDS MORE VALIDATION` · `PAGE-SPECIFIC` ·
`REJECT`.

**Bias corrected.** The first pass rated 15 candidates READY. Re-tested against evidence from 13
page-variants, **8 survive as READY**, 4 move to NEEDS VALIDATION, 4 become PAGE-SPECIFIC, and 3 are
rejected — two of them because they are new functionality wearing a rule's clothing.

---

## 1 · FOUNDATION

### F-1 Colour roles
| Sub-rule | First pass | Now | Evidence |
|---|---|---|---|
| a colour in a rule is a token or a bug | READY | **READY** | Stage 1 proved it: `rgba(255,255,255,.58)` is a hardcoded relationship to "white" and is why dark could not be re-solved by substitution. |
| one emphasis surface (pick `#172234`) | READY | **READY** | Two navies for one job, measured on three pages. |
| fold the 1–3 point neutral drift | READY | **READY** | Accidental values; no page depends on the difference. |
| semantic colours are already shared | READY | **READY (dealer only)** | `--brand`, `--ok`, `--danger`, `--signal`, `--slate`, `--violet` are byte-identical in Gen 10 and Gen 11. |
| state colour reserved for deviation | READY | **NEEDS MORE VALIDATION** | Sound for the dealer list. But the shipped product uses colour for *department* in the Work Queue and for *state* on the dealer pages, and both ship. The rule cannot be written product-wide until that is settled. |
| focus owns `outline` | READY | **READY** | Stage 1, measured 3.26–15.97:1 across twelve stops. |

**New sub-rule earned this pass — READY:** **a semantic colour must survive its own opacity.**
Measured: `.lane--zero` is `--ink-3` at `opacity: .7`, which composites to **≈2.95:1** on the lane
track and fails AA at 13px. The colour alone passes at 5.6:1. Opacity applied to a token silently
invalidates the token's contrast guarantee.

**New observation — NEEDS VALIDATION:** one warn amber, `rgb(138,92,0)` on `rgb(250,238,203)`, is
used by the shipped product for both the "Photos none" rail badge (Single Vehicle) and the removable
keyword chip (Work Queue s01-3). Cross-product consistency exists here already; worth adopting, but
the meaning differs (deficiency vs active filter) and should be resolved first.

### F-2 Type roles
| Sub-rule | First pass | Now |
|---|---|---|
| bounded scale with named roles | READY | **READY** |
| casing by role | READY | **READY** — `.caps` rendering in sentence case at 16px is still the counterexample |
| identifiers complete or absent, never ellipsed | READY | **NEEDS MORE VALIDATION** — the principle is right, but Gen 11 truncates 16/16 VINs and All Leads 59/70 emails at 1366. Making identifiers complete costs column width that the 1366 budget does not have. The rule needs a width policy attached before it can be stated. |
| "identifiers carry a copy action" | implied READY | **REJECT for the redesign** — copy buttons exist **only** on Single Vehicle (`⧉` beside Stock and VIN). Proposing them for All Vehicles or All Leads is new functionality. Keep as an observation of Single Vehicle. |
| functional-text floor **per density class** | READY | **READY** — reinforced: the dealer redesign is 14px-led, the employee product 13px-led with 944 uses of 13px/400. One floor product-wide would break the queue. |

### F-3 Spacing roles
| Sub-rule | Now | Evidence |
|---|---|---|
| spacing by relationship, one token each | **READY** | unchanged |
| internal gaps smaller than the container's external gap | **READY** | unchanged |
| **one inset for the whole workspace** | **READY, strengthened** | Measured on three pages: command band inset 26 inside a sheet inset 16 → a 10px white shoulder at rest, and on All Leads a 52px width jump on engage. |
| sticky stack height as a budget with a stated maximum | **REJECT as a single number** | Measured: 104 / 145 / 159 / 162 / 192px across five pages, i.e. 13.5%–25% of a 1366×768 viewport. The variation is archetype-driven, not drift. Replace with **an archetype-specific budget**: operational lists ≈160–190px, object pages ≈105–145px. |

### F-4 Radius roles
**READY for the ladder's shape · BLOCKED on its values** — unchanged from the first pass, and now
better grounded: the redesign uses 3px in zero places and the shipped product uses it 421 times on one
page. The role ladder is right; which product's values fill it is a product decision.

**Narrowed sub-rule — READY:** *where two persistent layers touch, the upper layer's bottom corners
and the lower layer's top corners both go square.* Measured: this single rule accounts for the
"stack of rounded panels" seam on Gen 11. The first pass's broader "zero inner radii" is rejected.

### F-5 Depth roles
| Sub-rule | Now |
|---|---|
| shadow only for real overlap | **READY** |
| three planes maximum | **READY** |
| no two same-hue surfaces nested | **READY** |
| "treat 18 shadows as the anomaly; one is achievable" | **NEEDS MORE VALIDATION** — one shadow per page is achievable *in a flat 3px product*. Whether Gen 11's glass direction can reach it without losing its identity is untested. State the direction, not the number. |

### F-6 Layer roles
**READY**, and the strongest-evidenced group in the document — with one correction.

The first pass justified "persistent chrome always outranks content" by citing All Leads' expansion
painting over the header. **That justification is wrong** (see the verification document): the header
was hiding itself via `.hd--veil`. The rule is still right and is still supported by Gen 11's
pre-Stage-1 tray-under-content inversion and by the `.sub` stacking-context trap. Only the citation
changes.

**Companion rule promoted to READY:** *a persistent layer is never hidden to resolve a collision.*
Measured cost on All Leads: the column header is invisible for ~400px of scrolling whenever an
expansion crosses it.

---

## 2 · COMPONENTS

| # | Component | First pass | **Now** | Why |
|---|---|---|---|---|
| C-1 | Button | BLOCKED | **BLOCKED** | unchanged; three products' worth of buttons |
| C-2 | Field / input | NEEDS VALIDATION | **NEEDS MORE VALIDATION** | Single Lead still renders read-only and editable identically; Single Vehicle's spine-section + per-field provenance is the better model but is a different archetype |
| C-3 | Tabs | NEEDS VALIDATION | **REJECT as "tabs"** | Single Lead's "tabs" are **same-page section anchors** (`href="#s-activity"`), not panel switchers. The product has no verified tab component. Re-file as *section navigator*. |
| C-4 | Chip / tag | BLOCKED | **BLOCKED** | unchanged; department-vs-state colour unresolved |
| C-5 | Filter facet | READY after C-1 | **READY after C-1** | unchanged |
| C-6 | Lane / scope selector | READY | **READY** | strengthened: Work Queue runs 11 lanes across three variants, with a **segmented pair + pill group** structure and a semantic lane state (red "Pending 4"). Two measured cautions for Gen 11's rail: selected surface step is **1.13:1**, zero state composites to **2.95:1**. |
| C-7 | Table / list | READY (track model) | **READY (track model only)** | All Leads' `minmax` tracks remain the better model. The copy-action clause is removed (F-2). |
| C-8 | Selected row | NEEDS VALIDATION | **NEEDS MORE VALIDATION** | `#6A7285` is an orphan; `--brand-soft` already means *bulk-selected*. Two states cannot share one appearance without a decision. |
| C-9 | Contextual expansion | READY (model) | **READY** | upgraded: All Leads reserves space (517px for 507px), covers 0 rows, **and lands on an anchor**. The three defects not to transfer are named. |
| C-10 | Panel / card | READY after F-5 | **READY after F-5** | unchanged |
| C-11 | Timeline / history | NEEDS VALIDATION | **READY** | **upgraded on new evidence**: Single Lead's Activity is a real feed — composer, vertical connector, per-kind icon, kind label, body, author, timestamp, kinds `note`/`mail`/`created`. The product has its own pattern; nothing needs importing. |
| C-12 | Communication item | NEEDS VALIDATION | **READY** | **upgraded**: Single Lead's Emails list — header row, IN/OUT direction chip, subject + inline preview, date, count, "Write email". |
| C-13 | Form group | NEEDS VALIDATION | **NEEDS MORE VALIDATION** | unchanged |
| C-14 | Drawer / dock | READY (contract) | **MODIFY → READY with a corrected rule** | The first pass's rule ("never fixed-height with `overflow: hidden`") was written from a defect that does not exist: stress-tested at a 601px viewport, Single Lead's rail clamps to `max-height`, its body scrolls, and the bottom is reachable. Corrected rule: **a sticky panel is content-sized up to a derived `max-height`, and its body is the scroller.** That is what the product already does. |
| C-15 | Bulk tray | READY | **READY** | unchanged |
| C-16 | Object identity module | NEEDS VALIDATION | **PAGE-SPECIFIC (Single Vehicle) for now** | The cockpit is excellent and fully evidenced across three variants. Introducing it into the All Vehicles workspace is a scope decision with new controls attached (prev/next, copy, prints). Keep it documented; do not promote it. |
| C-17 | Section rail with counts | NEEDS VALIDATION | **PAGE-SPECIFIC** | Evidenced on Single Vehicle (vertical, 11 items, state badges) and Single Lead (horizontal, 5 items, counts). **Not permission to add one to All Vehicles.** |
| C-18 | Exception / attention queue | READY | **READY** | unchanged; the redesign's clearest win |
| C-19 | Operational summary card | READY with a scope limit | **READY with a scope limit** | confirmed: all three Gen 11 cards share material and radius exactly; contrast 6.27–14.74:1 |
| C-20 | Field-level provenance | READY | **NEEDS MORE VALIDATION** | The pattern is real and repeated ("↺ no history" ×4 in the warning variant). But adding provenance lines to a page that has none is **added information**. It is right; it is not free. |
| C-21 | Empty state | NEEDS VALIDATION | **NEEDS MORE VALIDATION** | unchanged |
| C-22 | Conflict / lock state | READY | **NEEDS MORE VALIDATION** | Single Vehicle's "🔒 you hold the edit lock" is clearly better than Gen 11's `title`-only padlock. But making it legible on All Vehicles means **adding holder and time**, which is new information. Record the gap; do not state it as a ready rule. |

**New component evidenced this pass — NEEDS MORE VALIDATION:**
**C-23 · Removable filter chip.** Work Queue s01-3 renders `"carfax" ×` in the shared warn amber. Gen
11 has removable scope chips in `.scope`. Two implementations, one idea; worth reconciling.

---

## 3 · COMPOSITIONS

| # | Composition | First pass | Now |
|---|---|---|---|
| K-1 | Operational list | READY | **READY** — persistence ranks by consequence of forgetting; all three list pages currently persist the arrangement controls and scroll the scope away |
| K-2 | Contextual object workspace | READY | **READY, upgraded** — All Leads implements it end to end including the anchor and the document extender |
| K-3 | Full object detail | READY | **READY** — three variants confirm the cockpit + rail + continuous scroll shape is stable across full, sparse and warning states |
| K-4 | Detail + workflow rail | NEEDS VALIDATION | **NEEDS MORE VALIDATION**, with one defect struck — the rail does **not** clip |
| K-5 | Work queue | NEEDS VALIDATION | **NEEDS MORE VALIDATION** — three variants show the column set itself changes per lane, so a column-priority model must be lane-aware |
| K-6 | Sticky workspace | NEEDS VALIDATION | **NEEDS MORE VALIDATION** — and the first pass's proposed composition is now narrowed to two corners plus one inset, not "one opaque surface" |

---

## 4 · INTERACTION

| # | Contract | First pass | Now |
|---|---|---|---|
| I-1 | derived sticky offsets | READY | **READY** — strengthened: All Leads hardcodes `56 − 58 − 48 − 10` in JS, the same disease Stage 1 cured |
| I-2 | every state change perceivable in the initiating viewport | READY | **READY** |
| I-3 | open brings the record to a **named anchor** | READY | **READY, and reclassified as existing behaviour** — All Leads lands every row at stack+10px from any start |
| I-4 | replacement is a transition | READY | **NEEDS MORE VALIDATION** — deleting the 200ms `setTimeout` is confirmed; a shared-container cross-fade is a new transition |
| I-5 | an expansion changes the size of exactly one thing | READY | **READY** |
| I-6 | content under chrome; temporary planes above content | READY | **READY** (citation corrected, see F-6) |
| I-7 | full disclosure contract for anything that expands | READY | **READY as a rule · DEFERRED as work** — Single Lead's email rows already implement `role`/`tabindex`/`aria-expanded`, so the product knows the shape; applying it to the All Vehicles row is added behaviour |
| I-8 | list identity survives updates; **one live region announces "N results, M selected"** | READY | **SPLIT** — "focus, selection and scroll survive a re-render" is **READY**; "a live region announces" is **NEEDS MORE VALIDATION**, because it adds a behaviour the product does not have |
| I-9 | reduced motion is a shorter path to the same state | READY | **READY** |
| I-10 | sticky panel never fixed-height with `overflow: hidden` | READY | **REPLACED** — see C-14 |
| I-11 | provenance per figure | READY | **NEEDS MORE VALIDATION** — see C-20 |
| I-12 | a prototype declares live / staged / stub | READY | **READY** |

**New contract earned this pass — READY:**
**I-13 · An anchor that cannot be reached must extend the document, not degrade.** Measured: All Leads
grows `#exp-space` to 603px for the last row so the anchor still lands. The first pass proposed
accepting a degraded anchor near the list end; the product already solves it properly.

---

## 5 · WHAT IS STILL BLOCKED

Unchanged from the first pass, with one sharpened:

1. **Which product does the system descend from?** Now answerable *per role* rather than wholesale:
   interaction discipline, layering, provenance, state legibility and section architecture descend
   from production; visual direction, the exception queue and the summary composition descend from
   Gen 11. This is a recommendation, not a decision.
2. **State or ownership for colour?**
3. **One type scale or one per density class?** Evidence now favours **per density class**.
4. **Is the object identity module shared?** Now classified PAGE-SPECIFIC until decided.

---

## 6 · CORRECTED READY-NOW SHORTLIST

Eight, down from fifteen. Each is evidenced on at least two surfaces and adds no functionality.

1. **Layer ladder ordered by permanence, as tokens** (F-6).
2. **Derived sticky offsets, one source of truth** (I-1).
3. **Focus owns `outline`; nothing else sets it** (F-1).
4. **Tokens are total — no literal colour, including alphas; and a token must survive its own
   opacity** (F-1).
5. **One inset for the whole workspace; touching layers square their meeting corners** (F-3, F-4).
6. **Shadow only for real overlap; three planes** (F-5).
7. **Flexible `minmax` column tracks, never a hand-written fixed-track string** (C-7).
8. **In-flow contextual expansion with a named anchor that extends the document when it must**
   (C-9, I-3, I-13).

**Dropped from the shortlist** and why: universal radius values (blocked on descent) · one shadow per
page (unvalidated for glass) · exception slot map (needs the column model) · copy action (new control)
· live region (new behaviour) · disclosure contract as *work* (deferred) · field provenance (added
information) · conflict state (added information) · bulk-action contract (three new controls) ·
identifiers-never-truncated (needs a width policy) · section rail (page-specific).

---

*End of verification. No rule here is final and `DESIGN.md` was not created.*
