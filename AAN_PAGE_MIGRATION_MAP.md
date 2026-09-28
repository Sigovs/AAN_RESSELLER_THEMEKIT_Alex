# AAN — PAGE MIGRATION MAP

**Date** 2026-09-27 · **Status** planning only. No implementation was started.
**Reads against** `AAN_CROSS_PAGE_DESIGN_AUDIT.md`, `GEN11_STAGE2_INTERACTION_BLUEPRINT.md`,
`AAN_DESIGN_SYSTEM_INPUT.md`, and the three Gen 11 reports.

**Project direction honoured:** Gen 11 All Vehicles stabilises first · `DESIGN.md` is written only
after the system has been proven · All Leads and Single Lead are the validation pages.

---

## 0 · THE DEPENDENCY THAT SHAPES EVERYTHING

```
all-vehicles-gen10.css   (1057 lines · 8 :root blocks · 893 rules)
        │
        ├── all-vehicles-gen10.html
        ├── all-leads-gen10.html      + 149 lines of its own
        └── single-lead-gen10.html    + 301 lines of its own

all-vehicles-gen11.css   (2865 lines · 1 :root · 747 rules)   ← Stage 1 landed here only
        └── all-vehicles-gen11.html

assets/theme.css         (2346 rules · 2 :root)   ← the shipped backend
        ├── d05-vehicle-editor-*.html   (Single Vehicle)
        └── s01-work-queue-*.html       (My Work Queue)
```

Three implementation families, not five pages. **Every Stage 1 gain is currently quarantined to one
page**, and three of the P0s it fixed are still live in the Gen 10 base that feeds two of the
validation pages.

**The good news, measured:** Gen 11's token layer is a strict **superset** of Gen 10's — 0 tokens
exist only in Gen 10, 37 only in Gen 11, and every semantic colour is already byte-identical. The
token migration is additive, not a conflict.

---

## 1 · ALL VEHICLES — GEN 11

*Archetype: dense inventory list + contextual object workspace. The reference page.*

| Class | Work |
|---|---|
| **FOUNDATION ALREADY COMPATIBLE** | One `:root`, 110 tokens. Layer ladder as tokens. Derived sticky offsets read by JS. Outline focus, 3.26–15.97:1 on twelve stops. Semantic column classes. 1400 breakpoint, zero overflow at all four widths. Dark quarantined behind three gates. |
| **VISUAL-ONLY MIGRATION** | The engaged sticky composition — four stacked rounded panels to one workspace. Summary-card emphasis (three identical materials, no dominant). Lane-rail selected state (white on `#eef1f5` is a ~1.06:1 surface step; selection rides on the shadow). Button/facet sizes once §5.1 of the design-system input is answered. |
| **INTERACTION MIGRATION** | **Stage 2**: selected-row anchor, in-flow expansion, switch-as-transition, scroll restoration, detail restructure. Fully specified in the blueprint. |
| **INFORMATION-HIERARCHY MIGRATION** | Detail: Merchandising health → Market intelligence → Specification → History. Exception slot map. VIN policy. Column priority. |
| **PAGE-SPECIFIC WORK** | The bento's content. The market/comps concept. The 359-row inventory grammar. |
| **HIGH-RISK AREA** | Converting `.exp` from absolute to flow **and** adding the anchor. The blueprint separates them into steps 3 and 4 deliberately so a failure can be isolated. Second risk: the detail restructure touching `vehicleBody()`, which every other detail surface may later borrow from. |

---

## 2 · ALL LEADS — GEN 10

*Archetype: dense lead list + pipeline + expanded row. **Validation page #1** — it proves the list and
expansion patterns transfer.*

| Class | Work |
|---|---|
| **FOUNDATION ALREADY COMPATIBLE** | Flexible `minmax` column tracks — **better than Gen 11's** and the model Gen 11 should adopt. In-flow expansion — **the reference implementation for Stage 2**. The `.focal`/`.value`/`.attn` composition. Semantic colours already identical to Gen 11. |
| **VISUAL-ONLY MIGRATION** | Navy `#0f1626` → the unified emphasis surface. Radius ladder 18/14/9 → the agreed roles. Neutral drift (5 tokens, 1–3 points). Card radius 18 → 24 if Gen 11's ladder wins. |
| **INTERACTION MIGRATION** | **P0** the expansion paints over the sticky column header — apply the Stage 1 layer ladder. **P0** the command band changes width on engage (1376@26 → 1428@0 against a header at 1396@16) — apply the one-inset rule. The first row under the engaged header is sliced with no separation. Bulk tray from tier 5 to tier 30. |
| **INFORMATION-HIERARCHY MIGRATION** | "By status" is a second queue competing with Flags for the same job; moving it beside Flags is a reorganisation of existing content. Duplicate sort display ("Sort · Newest first" and "newest first", 60px apart). Truncation: 59 of 70 email cells at 1366. |
| **PAGE-SPECIFIC WORK** | Lead lane semantics. The pipeline model. Follow-up dates and their red overdue treatment. |
| **HIGH-RISK AREA** | It shares `all-vehicles-gen10.css` with two other pages. **Any edit to that file is a three-page edit.** Decide fork-or-migrate (§6) before touching it. |

---

## 3 · SINGLE LEAD — GEN 10

*Archetype: detail + forms + workflow rail + communication. **Validation page #2** — it proves the
detail and rail patterns transfer.*

| Class | Work |
|---|---|
| **FOUNDATION ALREADY COMPATIBLE** | The composition is sound: identity summary → sticky tabs → tabbed form → persistent workflow rail. The tabs already stick correctly at 56 and the summary already scrolls away — the desired behaviour is present. Workflow flags already hold one inline row at 1440 and 1366 (verified). |
| **VISUAL-ONLY MIGRATION** | Focal split 61.7/38.3 → ~65/35 (one grid track). Navy unification. Tab vertical air (38px tabs in a 48px bar). The buyer's-message card is the one place the emphasis material carries a *reading* surface rather than a metric — scope-limit the rule rather than restyling the card. |
| **INTERACTION MIGRATION** | **P0** the tab bar detaches on engage (960@26 → 996@0 over a 980@16 sheet). **P1** the workflow rail is fixed-height with `overflow: hidden` — it fits today and will clip silently on the next field. Focus system from the Gen 10 base. |
| **INFORMATION-HIERARCHY MIGRATION** | The form does not distinguish read-only record state, editable fields and workflow decisions. **The shipped Single Vehicle already solves this** with spine-coloured sections and field-level provenance — adopt, do not invent. Activity and Emails tabs were not reached in this pass and need their own look. |
| **PAGE-SPECIFIC WORK** | The workflow rail is not a drawer and not the Filters dock: it stays open while the object is worked. Its own contract. |
| **HIGH-RISK AREA** | It loads **four** stylesheets and **three** data files, two of them borrowed from other pages. Highest coupling in the project. Also the only page whose two-column grid does not share width loss: at 1366 the rail holds 400px and the form absorbs everything. |

**Correction carried forward:** the brief's note that the workflow rail "feels too narrow, target
300–340px" is contradicted by measurement — it is **400px** with a 360px content column, already
60–100px above that target. The note appears to predate the current build.

---

## 4 · SINGLE VEHICLE *(shipped backend)*

*Archetype: full object detail. **Not a migration target yet** — it is a source of patterns.*

| Class | Work |
|---|---|
| **FOUNDATION ALREADY COMPATIBLE** | A coherent layer ladder ordered by permanence (40/60/70/80/90/120). One shadow on the page. Six radii. 145px of chrome for a 10 697px page. |
| **VISUAL-ONLY MIGRATION** | Everything, eventually, and it is the largest visual gap in the project: 3px corners against 24px, one shadow against eighteen. **Blocked** on which product the system descends from. |
| **INTERACTION MIGRATION** | Little needed. Its sticky behaviour is the least broken of the five. |
| **INFORMATION-HIERARCHY MIGRATION** | None identified. Its hierarchy is the clearest in the product. |
| **PAGE-SPECIFIC WORK** | Photo studio, feeds, custom fields, prints — none of which the redesign has touched. |
| **HIGH-RISK AREA** | It is **live production**. Migrating it is not a redesign exercise; it is a release. It should be last. |

**What it gives the system now, without being touched:** the object identity cockpit (C-16), the
section rail with live counts (C-17) — the shipped answer to the locked no-accordion direction — the
section card with a semantic spine (C-13), field-level provenance (C-20), and a legible conflict/lock
state (C-22).

---

## 5 · MY WORK QUEUE *(shipped backend)*

*Archetype: employee queue / prioritisation. **Not a migration target yet.***

| Class | Work |
|---|---|
| **FOUNDATION ALREADY COMPATIBLE** | The lane rail with counts — eleven lanes, and a semantic lane state the dealer rail lacks (red outline on "Pending 4"). Four radii, one shadow. |
| **VISUAL-ONLY MIGRATION** | Blocked on the same descent question, and additionally on the 13px density decision. |
| **INTERACTION MIGRATION** | Sticky `thead` at 82 works. Needs the layer ladder if the design system's other planes arrive. |
| **INFORMATION-HIERARCHY MIGRATION** | **P0** 16 columns, every header wrapping at 1440. The column-priority model queued for All Vehicles Stage 5 is needed *here* most. The scope line is plain text doing a real job. |
| **PAGE-SPECIFIC WORK** | Manual drag priority ordering, multi-assignee cells, cell-level attention highlight, the GO LIVE watchlist. **Do not flatten these to the dealer row model.** |
| **HIGH-RISK AREA** | Its density is a decision, not drift: 94 rows × 16 columns in 1141px cannot be set at 14px. Any product-wide type rule that ignores this breaks the page. |

---

## 6 · THE `all-vehicles-gen10.css` DECISION

Three pages depend on it. Two options, both real:

**A · Migrate the base.** Apply Stage 1's method to `all-vehicles-gen10.css` itself — consolidate its
8 `:root` blocks, install the layer ladder, the outline focus and the 1400 breakpoint. All three Gen 10
pages inherit the fixes at once.
*For:* fixes three P0s across two validation pages in one pass; the tooling exists and is proven
(merge → restructure → strip → fingerprint diff).
*Against:* it is a three-page blast radius, and `all-vehicles-gen10.html` is a superseded generation
nobody is going to ship.

**B · Fork per page.** Give All Leads and Single Lead their own copies, freeze the shared file, retire
`all-vehicles-gen10.html`.
*For:* the blast radius drops to one page at a time.
*Against:* it triples the surface the eventual migration has to touch, and it is how the twelve-layer
problem started.

**Recommendation: A, narrowly scoped** — apply only the three P0 fixes (breakpoint, layer ladder,
focus) to the shared base, with the Stage 1 fingerprint rig proving no render change on all three
pages. Leave the consolidation until `DESIGN.md` exists. The three fixes are mechanical, they are
already written for Gen 11, and leaving two validation pages overflowing at 1366 while validating a
design system on them is not defensible.

---

## 7 · PROPOSED IMPLEMENTATION SEQUENCE

### Phase 0 — unblock the validation pages *(before Stage 2)*
1. 1400 breakpoint into `all-vehicles-gen10.css` — clears +26px overflow on All Leads and Single Lead.
2. Layer ladder into the same file — stops the All Leads expansion painting over the sticky header, lifts the tray above content.
3. Outline focus into the same file — removes the erased `box-shadow` ring from two pages.
4. Fingerprint all three Gen 10 pages before and after; the only expected deltas are the three fixes.

*Why first: they are P0, they are already-written code, and they make the validation pages honest.*

### Phase 1 — All Vehicles Stage 2
5. Engaged sticky composition; re-measure `--stick-total`.
6. Expansion to flow.
7. Anchor + scroll restoration.
8. Switch-as-transition.
9. Detail restructure into four ordered regions.
10. Row disclosure contract.

*Gate: all acceptance tests in the blueprint pass at 1280/1366/1440/1920.*

### Phase 2 — validate on All Leads
11. Adopt All Leads' flexible column tracks **into Gen 11** — the flow runs this direction.
12. Apply the one-inset workspace rule to All Leads; the band stops changing width.
13. Apply the anchor + in-flow contract to All Leads' expansion (it is already in flow; it needs the anchor and the layering).
14. Move "By status" beside Flags.

*Gate: the patterns survive a second, differently-shaped list.*

### Phase 3 — validate on Single Lead
15. Tab bar keeps its sheet's width and inset on engage.
16. Workflow rail becomes content-sized or scrollable.
17. Focal split to ~65/35.
18. Form hierarchy using the shipped section + provenance pattern.
19. Look at Activity and Emails, which this research did not reach.

*Gate: the detail and rail patterns survive a page that is not a list.*

### Phase 4 — write `DESIGN.md`
20. Only now. Resolve the four blocked questions first (descent, colour semantics, type density, identity-module scope).

### Phase 5 — the shipped backend
21. Column-priority model, starting with My Work Queue.
22. Single Vehicle last: it is a production release, not a redesign.

---

## 8 · RISK REGISTER

| Risk | Where | Mitigation |
|---|---|---|
| A shared-base edit changes three pages | Phase 0 | Fingerprint all three before and after; the rig exists |
| Flow conversion + anchor land together and mask each other | Phase 1 | Blueprint steps 3 and 4 are deliberately separate |
| The detail restructure changes `vehicleBody()`, which other surfaces may borrow | Phase 1 | Content builders stay; only arrangement changes |
| Single Lead's four stylesheets and three data files | Phase 3 | Map the coupling before editing; it is the highest in the project |
| A product-wide type rule breaks the employee queue | Phase 4 | Density classes, not one scale |
| The system is written before it has survived a non-list page | Phase 4 | Phase 3 is the gate; do not move it |
| Migrating Single Vehicle is treated as a design task | Phase 5 | It is a production release |

---

*End of migration map. No implementation was started.*
