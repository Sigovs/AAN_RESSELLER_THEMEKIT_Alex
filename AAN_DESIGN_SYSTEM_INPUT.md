# AAN — DESIGN SYSTEM INPUT

**This is not `DESIGN.md`.** It is the research material `DESIGN.md` will be written from.
**Date** 2026-09-27 · **Evidence** five surfaces measured in a real browser at 1280/1366/1440/1920;
see `AAN_CROSS_PAGE_DESIGN_AUDIT.md` for the measurements each entry rests on.

**How to read the confidence column.**
**READY** — the evidence is consistent across pages and the rule can go into `DESIGN.md` as written.
**NEEDS VALIDATION** — the pattern is real but one page contradicts it, or it has only one
implementation, or a product decision has to be made first.
**BLOCKED** — a contradiction in §5 must be resolved before the rule can be stated at all.

**Page keys:** `AV` All Vehicles Gen 11 · `AL` All Leads Gen 10 · `SL` Single Lead Gen 10 ·
`SV` Single Vehicle (shipped) · `WQ` My Work Queue (shipped).

---

# FOUNDATION

## F-1 · Colour roles

The product does not need more colours; it needs the ones it has to mean one thing each.

| Role | Evidence | Strongest implementation | Contradiction | Confidence |
|---|---|---|---|---|
| application ground | all 5 | AV `#e5e9ef` | AL/SL `#e8ebf0`, SV/WQ `#eef1f5` — 3-point drift, nobody chose it | READY (fold to one) |
| primary surface | all 5 | `#ffffff`, unanimous | none | **READY** |
| raised surface | AV, AL, SL | AV `--well` / `--wash` | AL and AV swapped the two values | READY (fold) |
| **emphasis surface** | AV, AL, SL | AV `#172234` | AL/SL `#0f1626` — two navies, one job | READY (pick AV) |
| selected surface | AV, AL | AV `--brand-soft` for bulk select | AV uses orphan `#6A7285` for *open* select | READY (unify on brand-soft) |
| hover surface | all 5 | AV `--wash` | — | READY |
| border subtle / strong | all 5 | AV `--line-2` / `--line-3` | 1–2 point drift vs AL | READY (fold) |
| ink primary / secondary / tertiary | all 5 | AV `--ink` / `--ink-2` / `--ink-3` | 1–3 point drift vs AL | READY (fold) |
| positive · warning · danger · attention · violet | all 5 | **byte-identical in AV and AL already** | WQ colours by department (§5.2) | READY for dealer, BLOCKED product-wide |
| focus | AV only | AV Stage 1 `outline` + offset, 3.26–15.97:1 measured | AL/SL still carry the erased `box-shadow` ring | **READY** |
| dark-surface ink | AV, AL, SL | AV `--focal-ink` / `-ink-2` / `-ink-3`, 6.27–14.74:1 measured | — | **READY** |

**Rule candidates.**
- A colour appears in a rule as a token or it is a bug — including its alpha. A translucent surface
  declares its *composited* result per theme, not an alpha over an assumed ground. *(AV Stage 1,
  learned the hard way: `rgba(255,255,255,.58)` is a hardcoded relationship to "white", and it is why
  dark theme could not be re-solved by token substitution.)* **READY**
- State colour is reserved for deviation from normal. Anything true of every row renders as plain
  text. *(AV renders a filled green "Available" pill on 16 of 16 rows and a grey tint down the Health
  column on all 359.)* **READY**
- Focus owns `outline` and nothing else may set or remove it. Elevation never shares the property.
  **READY**

## F-2 · Type roles

| Role | AV | AL | SL | SV | WQ |
|---|---|---|---|---|---|
| body / data | 14px | 13–13.5px | 14px | 14–15px | **13px** |
| metadata | 12–13px | 12–12.5px | 13px | 13px | 13px |
| micro | 9.5–11.5px | 12px | 12px | 10px | 10px |
| distinct styles on one page | **27** | 24 | 29 | 17 | 15 |

**The product has two density classes, not one scale.** The dealer redesign is 14px-led; the employee
backend is 13px-led and carries 94 rows × 16 columns in 1141px. A single size list will make one of
them wrong.

**Rule candidates.**
- A bounded scale with **named roles** (`figure`, `page-title`, `panel-title`, `data`, `meta`,
  `micro`) mapped to sizes, so a size cannot be chosen by eye at the point of use. **READY**
- Casing is applied **by role**: uppercase for structural labels that must not be mistaken for data,
  banned in the data layer. *(AV's `.caps` class is overridden to sentence case at 16px in one place —
  a class named for a casing that renders in the other one.)* **READY**
- Identifiers (VIN, stock, ticket) are codes, not text: monospace, tabular, complete or absent, never
  ellipsed. *(AV truncates 16 of 16 VINs; AL truncates 59 of 70 emails at 1366.)* **READY**
- A functional-text floor exists **per density class**, not per product. **NEEDS VALIDATION** — the
  employee product's floor has to be set by someone who works that queue.

## F-3 · Spacing roles

| Relationship | AV | AL / SL | SV / WQ |
|---|---|---|---|
| page gutter | 16 | 16 | ~24 (content column) |
| sheet inset | **16, but the band uses 26** | **16, band 26** | n/a — full-bleed sections |
| column gap | 8 (6 ≤1400) | 8 | table default |
| row module | 74 | 62 | 67 |
| sticky stack | **192** | 162 | 145 / 159 |

**Rule candidates.**
- Spacing is a property of a **relationship**, not of a component: workspace inset, panel inset,
  header-to-content, label-to-value, control-to-control, within-group vs between-group, panel-to-panel,
  sticky-stack height. One token each. **READY**
- Internal gaps are always smaller than the container's external gap. **READY**
- **One inset for the whole workspace.** Three pages currently run a command band at 26px inside a
  sheet at 16px, producing a 10px white shoulder at rest and a width jump on engage. **READY**
- The sticky stack's height is a **budget with a stated maximum**, expressed as a share of the
  smallest supported viewport. **NEEDS VALIDATION** — nobody has set the number; 192px is 79% of a
  1366×768 viewport before the first row.

## F-4 · Radius roles

| Role | AV | AL / SL | SV / WQ |
|---|---|---|---|
| pill | 999 | 999 | 99 / 999 |
| sheet | 28 | 18 | 0 (full-bleed) |
| card | 24 | 18 | 3 |
| panel | 18 | 14 | 3 |
| control | 14 | 9–10 | 3 |
| inner | 10 | 8 | 3 |
| micro | 5 | 5 | 3 |

**Rule candidates.**
- A **role ladder**, never one universal radius. One radius everywhere is itself the generic-SaaS tell.
  **READY**
- Where two sticky surfaces touch, the inner radii collapse to 0 and only the outer envelope keeps its
  curve. *(AV's engaged stack currently reads as four stacked rounded panels.)* **READY**
- A child's radius is never larger than a meaningful fraction of its parent's. **READY**
- **Which ladder the product descends from is BLOCKED** on §5.1: the redesign's 24px card and the
  shipped 3px card cannot both be "the AAN card".

## F-5 · Depth roles

Distinct box-shadows on one page: **AV 18 · AL 15 · SL 8 · SV 1 · WQ 1.**

**Rule candidates.**
- Shadow is reserved for **actual overlap**. A surface that never crosses another gets an edge, a
  ground contrast, or nothing. **READY**
- Three planes maximum: content · raised · temporary. **READY**
- Nesting two surfaces of the same hue means one of them is doing nothing. *(AV: ground → `.field`
  58%-white → `.rows` white → workspace white → accordion well → open accordion white — six
  surfaces, four radii.)* **READY**
- The shipped product proves an operational UI can run on **one** shadow. Treat 18 as the anomaly,
  not the baseline. **READY**

## F-6 · Layer roles

| Tier | AV (Stage 1) | AL / SL | SV / WQ |
|---|---|---|---|
| content | 1 | — | — |
| raised content | 3 | auto | — |
| sticky header | 10 | 4 | 3 |
| sticky controls | 12 | 6 | 60 |
| platform | 20 | 50 | 80 / 90 |
| tray / drawer | 30 | **5** | 70 |
| menu / popover | 40 | 40 | — |
| toast | — | — | 120 |

**Rule candidates.**
- One product-level enumeration, ordered by permanence, declared as tokens. Components name a tier,
  never a number. **READY**
- **Persistent chrome always outranks content; content travels under it.** *(AL's expanded row paints
  over the sticky column header today — measured by hit test.)* **READY**
- **Temporary planes always outrank content**, because the temporary one is what the user is
  operating. *(AL's tray sits at 5, below its own expansion.)* **READY**
- A persistent element is never hidden to resolve a collision. *(AV's deleted `.hd--veil`.)* **READY**
- No tie resolved by document order. *(AL: `.sub` 5 = `.hd` 5.)* **READY**

---

# COMPONENTS

| # | Component | Pages | Strongest implementation | Contradiction | Confidence |
|---|---|---|---|---|---|
| C-1 | **Button** | all 5 | — | AV 44px/999r · AL-SL 38px/10r · SV ~34px/3r. Three products' worth of buttons | **BLOCKED** on §5.1 |
| C-2 | **Field / input** | SL, SV, WQ | SV — grouped into spine-coloured sections with inline provenance | SL renders read-only and editable identically | NEEDS VALIDATION |
| C-3 | **Tabs** | SL, SV | SL `.cmd--nav` | SL's bar detaches from its sheet on engage (960@26 → 996@0) | NEEDS VALIDATION |
| C-4 | **Chip / tag** | AV, AL, WQ | AV `.tag` with tone variants | WQ colours by department, AV/AL by state | **BLOCKED** on §5.2 |
| C-5 | **Filter facet** | AV, AL, WQ | AV `.qf .facet__b` (34px, 9r, count badge) | AV's command-band facet is 56px — same control, two sizes, one page | READY after C-1 |
| C-6 | **Lane / scope selector** | AV, WQ | **WQ** — 11 lanes, counts, plus a semantic lane state (red outline on "Pending 4") | none | **READY** |
| C-7 | **Table / list** | AV, AL, WQ | **AL** — flexible `minmax` tracks; AV is 11 fixed px tracks | WQ: 16 columns, every header wraps at 1440 | READY for the track model |
| C-8 | **Selected row** | AV, AL | AL (in flow) for behaviour; neither for appearance | AV's `#6A7285` is an orphan colour | NEEDS VALIDATION |
| C-9 | **Contextual expansion** | AL, AV(S2) | AL — in flow, no scrim | AL's expansion paints over chrome | READY for the model, not the layering |
| C-10 | **Panel / card** | all 5 | SV — border + spine, one shadow | AV nests four white surfaces | READY after F-5 |
| C-11 | **Timeline / history** | SL, SV, AV | not reached in this pass | — | **NEEDS VALIDATION** |
| C-12 | **Communication item** | SL | not reached in this pass | — | **NEEDS VALIDATION** |
| C-13 | **Form group** | SL, SV | SV — semantic left spine per section | SL has no section identity | NEEDS VALIDATION |
| C-14 | **Drawer / dock** | AV, SL | AV (Stage 1 aligned it to the stack) | SL's is fixed-height with `overflow: hidden` — silent clipping | READY for the contract |
| C-15 | **Bulk tray** | AV, AL | AV after Stage 1 (tier 30, above content) | AL's is at 5, below its own expansion | **READY** |
| C-16 | **Object identity module** | SV, SL, AV workspace | **SV cockpit** — back link · thumbnail · title · stock+copy · VIN+copy · status · type · price · prev/next · photos · prints · save | AV renders the same facts across a row and a workspace header | NEEDS VALIDATION (scope decision §5.4) |
| C-17 | **Section rail with counts** | SV | SV — 11 sections, live counts and states | none in the product | NEEDS VALIDATION (is it a new control in the workspace?) |
| C-18 | **Exception / attention queue** | AV, AL | AV Needs-attention — count + label + meter + %, filters the list on click | AL's Flags is the same pattern with a different name | **READY** |
| C-19 | **Operational summary card** | AV, AL, SL | AV after Stage 1 (one material, 6.27–14.74:1) | SL uses the same material for the buyer's own words — a reading surface, not a metric surface | READY with a scope limit |
| C-20 | **Field-level provenance** | SV | SV — "2 changes · last −$300" / "no history" under each price field | the redesign badges whole sections instead | **READY** |
| C-21 | **Empty state** | AV, AL | AV `.empty` | copy is wrong when the lane, not the filter, is empty | NEEDS VALIDATION |
| C-22 | **Conflict / lock state** | AV, SV | **SV** — "🔒 you hold the edit lock" beside Added/Modified/Views/Change log | AV renders it as a 20×20 padlock with a `title` | **READY** |

---

# COMPOSITIONS

## K-1 · Operational list · `AV`, `AL`, `WQ` · **READY**
Workspace shell → persistent header → scope selector → command controls → column header → dense rows
→ pagination. All three pages already have this shape. What differs is only which parts persist.
**Rule candidate:** persistence ranks by *consequence of forgetting*. Scope, active filters and result
count outrank sort, columns and view. *(All three pages currently persist the arrangement controls and
scroll the scope away.)*

## K-2 · Contextual object workspace · `AV` (Stage 2), `AL` (today) · **READY**
A row expands in flow into a workspace that shares its edges, reserves its height, covers nothing and
dims nothing, anchored below the persistent workspace. Specified in
`GEN11_STAGE2_INTERACTION_BLUEPRINT.md`.

## K-3 · Full object detail · `SV` · **READY**
Sticky identity cockpit → section rail with counts → one continuous scroll of spine-coloured sections
→ sticky save bar. 145px of chrome for a 10 697px page.
**Rule candidate:** a full object page uses a section rail; a contextual workspace does not. The rail
is what lets eleven sections exist without accordions.

## K-4 · Detail + workflow rail · `SL` · **NEEDS VALIDATION**
Identity summary → sticky tab bar → tabbed form → persistent workflow rail. The composition is sound;
three defects sit on top of it (tab bar detaches, rail can clip, form has no hierarchy).
**Rule candidate:** a workflow rail is not a drawer. It stays open while the object is worked, it is
content-sized or scrollable, and it never clips.

## K-5 · Work queue · `WQ` · **NEEDS VALIDATION**
Scope line → pinned watchlist → lane rail → filters → very wide table with manual priority ordering.
Needs the column-priority model before it can be systematised.

## K-6 · Sticky workspace · all 5 · **NEEDS VALIDATION**
Every page has one; no two agree on its material, inset, height or engaged state. The Stage 2
blueprint proposes the first authored version. It has to prove itself on All Vehicles before it is
written as a rule.

---

# INTERACTION

| # | Contract | Evidence | Confidence |
|---|---|---|---|
| I-1 | Sticky offsets are **derived**, never typed; a scroll state read by JS reads from the same source the CSS positions from | AV's stale 56.5/114.5 were *correct on AL* and copied | **READY** |
| I-2 | Every state change is perceivable **in the viewport it was initiated from** | AV: 12% of the panel visible for row 1, 0% for rows 2–4 at 801px | **READY** |
| I-3 | Opening a record brings it to a **named anchor** below the persistent workspace, minimum travel, lossless round trip | AL has in-flow expansion but no anchor | **READY** |
| I-4 | A replacement is a **transition**, not close-then-open | AV: 200ms `setTimeout`, DOM destroyed, new position | **READY** |
| I-5 | An expansion changes the size of **exactly one thing** | AV: opening one region moves three others ±435px at frame 0 | **READY** |
| I-6 | Content travels under chrome; temporary planes outrank content | AL and AV both violated it, differently | **READY** |
| I-7 | Anything that expands something is a real disclosure control: role, `aria-expanded`, `aria-controls`, keyboard parity, defined focus destination | AV's row is a focusable `div` with no role and no Space handler | **READY** |
| I-8 | A list's identity survives its own updates; focus, selection and scroll persist; one live region announces "N results, M selected" | AV rebuilds `#tb` innerHTML on every state change | **READY** (Stage 3) |
| I-9 | Reduced motion is a **shorter path to the same state**, not the same wait without the animation | AV's `setTimeout` runs unconditionally | **READY** |
| I-10 | A sticky panel is content-sized or scrollable, never fixed-height with `overflow: hidden` | SL's workflow rail | **READY** |
| I-11 | Provenance is a property of **every figure**, marked at the number | SV does it per field; the redesign badges sections | **READY** |
| I-12 | A prototype declares live / staged / stub once, visibly | AV: ~12 fully styled inert controls | **READY** |

---

# 5 · WHAT IS BLOCKED, AND ON WHAT

**5.1 · Which product does the system descend from?**
Blocks C-1 (buttons), F-4 (radius ladder) and most of F-5 (depth). The redesign is richer; the shipped
backend is measurably more systematic — 1 shadow, 6 radii, 17 type styles on a page against 18, 17 and
27. A rule that says "cards are 24px and lift" makes every backend screen wrong; a rule that says
"cards are 3px and flat" discards the redesign. This is a product decision, not a design one.

**5.2 · Does colour carry state or ownership?**
Blocks C-4 (chips) and the semantic half of F-1. `WQ` colours four *open* tickets four different ways
by owning department; `AV`/`AL` colour by state. Both ship.

**5.3 · One type scale or one per density class?**
Blocks the F-2 floor. 13px is a decision in the employee product, not drift.

**5.4 · Is the object identity module shared?**
Blocks C-16 and C-17. Sharing the `SV` cockpit with the `AV` workspace is the largest available
cross-page win and the largest scope risk. The Stage 2 blueprint deliberately does **not** depend on
it — it can be adopted later without rework.

---

# 6 · READY-NOW SHORTLIST

If `DESIGN.md` were written tomorrow, these could go in as written, with the evidence already gathered:

1. Layer ladder ordered by permanence, as tokens (F-6).
2. Derived sticky offsets, single source of truth (I-1).
3. Focus owns `outline`; nothing else sets it (F-1).
4. Tokens are total — no literal colour, including alphas (F-1).
5. Shadow only for real overlap; three planes; one shadow where the shipped product uses one (F-5).
6. Spacing by relationship, one inset per workspace (F-3).
7. Radius as a **role ladder**, with inner radii collapsing where sticky surfaces touch (F-4) — the
   ladder's *values* wait on §5.1, its *shape* does not.
8. Lane / scope selector with counts and a semantic lane state (C-6).
9. Exception queue: count + label + meter + click-to-filter (C-18).
10. Bulk tray above content (C-15).
11. Flexible `minmax` column tracks, never a hand-written fixed-track string (C-7).
12. In-flow contextual expansion with a named anchor (K-2, I-3).
13. Conflict/lock as a legible named state (C-22).
14. Field-level provenance (C-20, I-11).
15. Disclosure contract for anything that expands (I-7).

---

*End of input. This is not `DESIGN.md` and no rule here is final.*
