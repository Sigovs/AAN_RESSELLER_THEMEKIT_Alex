# GEN 11 — STAGE 2 BLUEPRINT VERIFICATION

**Date** 2026-09-27 · **Type** review of `GEN11_STAGE2_INTERACTION_BLUEPRINT.md`. That document is
**not** overwritten; this one corrects it.
**Rule applied throughout:** anything the page does not already do is new functionality, even if
another AAN page does it. Reuse of a pattern from elsewhere still counts as new if All Vehicles does
not have it today.

**Summary of verdicts: 9 CONFIRMED · 8 MODIFY · 3 DEFER · 6 REJECT.**

**The single most important correction:** the anchor the blueprint specifies **already exists in the
product**, implemented on All Leads Gen 10 by the existing row click, with a document-extender that
the blueprint proposed to delete. Stage 2 is therefore *restoring a behaviour Gen 11 lost*, not
introducing one — which narrows its scope and removes its largest risk.

---

## §1 · TARGET SPATIAL MODEL

**ORIGINAL** One page scroll · persistent workspace on top · list · expansion that is part of the
list · four invariants (one scroll container, workspace is chrome, expansion is content, anchor is a
named position).

**VERDICT: CONFIRMED.**

All four invariants are satisfied by All Leads today and violated by Gen 11 today. Nothing in the
model requires a control that does not exist.

---

## §2 · STICKY ENGAGED COMPOSITION

**ORIGINAL** "One opaque surface for the whole stack · zero inner radii · one shadow at the bottom
edge · one inset."

**VERDICT: MODIFY — three of the four claims were hypotheses and two do not survive measurement.**

Measured on Gen 11 at 1366, engaged:

| layer | background | radius | inset | own shadow |
|---|---|---|---|---|
| `.top` | `rgba(255,255,255,.76)` + blur | **24px all corners** | 16 → 1338 | `0 28px 64px` |
| `.cmd` | `rgba(255,255,255,.88)` + blur | 24px top, 0 bottom | **26 → 1328** | 1px ring |
| `.hd` | `#ffffff` opaque | 0 | 16 → 1338 | `0 1px 0` bottom |

| Original claim | Verdict | Corrected |
|---|---|---|
| one opaque surface | **REJECT** | The alpha ladder .76 → .88 → 1.0 is a coherent depth cue and is Gen 11's visual identity. Flattening it discards the direction to fix a seam that radius and inset actually cause. |
| zero inner radii | **MODIFY** | Only two corners are at fault: `.top`'s **bottom** corners meeting `.cmd`'s **top** corners at y=68. `.cmd`'s bottom radius is already 0; `.hd` is already square. |
| one bottom shadow | **MODIFY** | `.hd` already owns the stack's bottom edge. Remove the two interior shadows (`.top`'s 28/64px and `.cmd`'s ring) that are invisible where layers touch. |
| one inset | **CONFIRMED** | `.cmd` at 26 against 16 above and below is the 10px white shoulder. One value for all three. |

**Corrected §2:** keep the translucency ladder; square `.top`'s bottom corners while `.cmd` is
engaged; give all three layers the same inset; drop the two interior shadows. The column header is
**not** part of the problem and must not be restyled.

**Height.** The blueprint left `--stick-total` as-is and called reduction a Stage 6 matter.
**CONFIRMED, and strengthened:** 192px engaged is 25% of a 1366×768 viewport and 18.4% of
1920×1080, against 145–162px on comparable pages. It is the heaviest of its archetype by ~30px, not
excessive. The real at-rest cost (635px, 82.5%, one visible row at 1366×768) is the bento and the two
control rows, which scroll away. **Do not reduce the sticky stack in Stage 2.**

---

## §3 · SELECTED-ROW ANCHOR CONTRACT

**ORIGINAL** Anchor at `--stick-total`; named not computed; minimum travel with a ±1-row tolerance;
downward-only correction; never scroll past the document end ("the row rests as close as the document
allows"); one interruptible animation; reduced motion = instant jump.

**VERDICT: CONFIRMED in principle · MODIFY in four specifics · one part REJECTED.**

The anchor exists. `all-leads-gen10.js:187`:
```
y = rowTop + scrollY − 56 − 58 − 48 − 10        // sticky stack + 10px
exp-space.height = max(0, y − (docHeight − viewportHeight))   // extend the document if needed
scrollTo({ top: y, behavior: 'smooth' })
```
Measured: every open lands the row at **y ≈ 172** from any start, in either direction, with the
expansion fully visible.

| Original clause | Verdict | Corrected |
|---|---|---|
| anchor = `--stick-total` | **MODIFY** | The shipped anchor is `--stick-total` **+ 10px**. Adopt the existing value; do not invent a flush anchor. |
| named, not `scrollIntoView(center)` | **CONFIRMED** | Matches the shipped implementation. |
| minimum travel, ±1-row tolerance, "do not move if already close" | **REJECT** | Invented. Measured: All Leads moved **−17px** to place a row that was already 27px from the anchor. It always lands exactly. A tolerance band is new behaviour and makes the anchor unpredictable. |
| downward-only correction | **REJECT** | Invented. The shipped anchor travels both ways (measured +1003 and −17). |
| "rests as close as the document allows" near the end of the list | **REJECT** | The shipped behaviour **extends the document** via `#exp-space` (603px for the last row, document 4949 → 6070). Adopt that; do not accept a degraded anchor. |
| one interruptible animation | **DEFER** | The shipped implementation uses `behavior: 'smooth'` with no interruption handling. Interruption is a new guarantee; note it, do not require it in Stage 2. |
| reduced motion = instant jump to the same anchor | **CONFIRMED** | `behavior: 'auto'` under `prefers-reduced-motion` preserves the invariant and removes only the travel. |

---

## §4 · IN-FLOW EXPANSION CONTRACT

**ORIGINAL** In flow · reserves height · shares row edges · row's column origins for the identity band
· content tier · no shadow · no radius at the seam · no gap · siblings untouched · **no close control
of its own**.

**VERDICT: CONFIRMED except one clause, which is REJECTED.**

Verified on All Leads: document grows **517px** for a **507px** expansion; **0 sibling rows covered**.

| Clause | Verdict | Note |
|---|---|---|
| in flow, reserves height | **CONFIRMED** | measured |
| shares the row's left/right edges | **CONFIRMED** | Gen 11's `left: 8px; right: 8px` is the defect |
| no shadow, no seam radius, no gap | **CONFIRMED** | Gen 11's 8px gap shows a dimmed neighbouring row between a car and its own detail |
| siblings untouched, not dimmed | **CONFIRMED** | All Leads dims 69 rows via the shared base; this is a defect **not** to copy |
| **"no close control of its own — delete `.exp__x`"** | **REJECT** | `exp__x` / `data-act="close-veh"` exist on **both** Gen 11 and All Leads today. Deleting it removes existing functionality. **Keep the close button.** |
| "the row's own column origins for the identity band" | **DEFER** | Aligning the identity band to the row's 13-track grid is a composition decision with a real width cost at 1366. Not required for the in-flow conversion. |

---

## §5 · OPEN BEHAVIOUR

**ORIGINAL** record return position → mark selected + `aria-expanded` → insert in flow → scroll to
anchor → **move focus to the workspace heading**.

**VERDICT: MODIFY — two steps removed.**

| Step | Verdict | Corrected |
|---|---|---|
| record the return position | **REJECT** | See §8. |
| mark selected | **CONFIRMED** | existing |
| set `aria-expanded` | **DEFER** | The row has no disclosure contract today; adding one is a behaviour change. It is correct and it belongs with the row's `role`/Space handler, which is itself deferred. Not Stage 2. |
| insert in flow | **CONFIRMED** | |
| scroll to anchor, extending the document if needed | **CONFIRMED** | the shipped behaviour |
| **move focus to the workspace heading** | **REJECT** | New keyboard behaviour. All Leads does not do it. The brief forbids adding keyboard functionality. |

**Corrected §5:** record nothing · mark the row selected · insert in flow · scroll to the anchor,
extending the document if required. Four steps, all existing behaviour.

---

## §6 · CLOSE BEHAVIOUR

**ORIGINAL** remove from flow → **restore the return position** → return focus to the trigger →
Escape closes the workspace first.

**VERDICT: MODIFY — one step REJECTED, one DEFERRED.**

| Step | Verdict | Corrected |
|---|---|---|
| remove from flow | **CONFIRMED** | |
| **restore the pre-open scrollY** | **REJECT** | See §8 — measured as both non-existent in the product and actively harmful. |
| return focus to the trigger | **DEFER** | New keyboard behaviour; belongs with the disclosure contract. |
| Escape ladder preserved | **CONFIRMED** | Gen 11's existing ladder (menus/popovers → vehicle → dock) is correct and untouched. |

**Corrected §6:** remove the workspace from flow and do nothing to the scroll. The list closes up
beneath the viewport; the browser's scroll anchoring absorbs the change.

---

## §7 · SWITCH-VEHICLE BEHAVIOUR

**ORIGINAL** the new row travels to the same anchor · the workspace box persists and its contents swap
with an animated height change · no `setTimeout` · **`↑`/`↓` moves the selection and keeps the anchor**
· reduced motion = instant swap.

**VERDICT: MODIFY — one clause REJECTED outright, one DEFERRED.**

| Clause | Verdict | Corrected |
|---|---|---|
| the new row travels to the same anchor via the **existing row click** | **CONFIRMED** | this is exactly what All Leads does |
| delete the 200ms `setTimeout`; drive from transition completion or commit immediately | **CONFIRMED** | the current path pays 200ms for an exit fade on an element it then destroys, and frequently skips the entrance |
| the workspace box persists, contents swap, height animates | **DEFER** | A shared-container cross-fade is a new transition the product does not have. `render()` rebuilds the DOM today. Valuable, not required, and it interacts with the Stage 3 list-identity work. |
| **`↑`/`↓` keyboard switching** | **REJECT** | **New product functionality. Never requested. Removed from the plan.** |
| reduced motion = instant | **CONFIRMED** | |

**Corrected §7:** switching happens the way it happens today — the user clicks another row — and that
row travels to the same anchor. No new navigation of any kind.

---

## §8 · SCROLL RESTORATION

**ORIGINAL** a table of remembered-position rules: remember on open, keep on switch, **restore exactly
on close**, discard on filter/sort/lane change, re-derive on resize, none for a hash entry.

**VERDICT: REJECT the whole section.**

**Measured on All Leads, four cycles:**

| start | row | after open | user then scrolled | before close | after close | restored to start? |
|---|---|---|---|---|---|---|
| 0 | 10 | 1003 | — | 1003 | 1003 | no |
| 1500 | 20 | 1623 | — | 1623 | 1623 | no |
| 1500 | 20 | 1623 | **+600** | 2223 | **2109** | no |
| 3000 | 40 | 2863 | **−400** | 2463 | 2463 | no |

The shipped product **does not restore** the pre-open position, and row 3 shows why that is right: a
user who opened at 1623, scrolled to 2223 to read the workspace and then closed would have been thrown
back to 1500 — **723px away from what they were reading**. The blueprint's rule fights the user's
later scroll, which the brief explicitly warned against.

It is also new state management (remember / discard / re-derive) for a problem the product does not
have.

**Corrected §8 — the minimum behaviour:** on close, do not touch the scroll. Remove the remembered
position, the discard rules and the resize re-derivation. Browser scroll anchoring already prevents
the jump when the removed expansion was above the viewport (measured: 114px of drift in the worst of
the four cycles, against a 487px expansion).

---

## §9 · SELECTED ROW + WORKSPACE VISUAL CONTINUITY

**ORIGINAL** five cues reversed (gap, width, shadow, materials, radius envelope) and the selected
colour moved from the orphan `#6A7285` into `--brand-soft`.

**VERDICT: CONFIRMED, with one caution.**

All five cues are real and measured. The `#6A7285` rationale (matching the Gen 10 command band) is
genuinely gone now that Gen 11's band is glass.

**Caution:** `--brand-soft` is currently used by `.row.sel` for **bulk selection**. Using the same
token for "open for inspection" makes two different states share one appearance. Either differentiate
within the brand family or state explicitly that the two states are mutually exclusive in practice.
This is a decision, not a defect — flag it rather than assume it.

---

## §10 · DETAIL ARCHITECTURE

**ORIGINAL** Merchandising health as an always-visible status line (with a **"merchandising clear"**
line when nothing fails) · Market & Pricing + Recent Comps as one region · Specification quieter, with
row-duplicated fields dropped · History last · **option A: a section rail; option B: continuous
sections** — recommending B.

**VERDICT: CONFIRMED in structure · MODIFY in three details · one option REMOVED.**

| Clause | Verdict | Corrected |
|---|---|---|
| health always visible, not an accordion | **CONFIRMED** | |
| **"merchandising clear"** | **REJECT** | Invented string. The product already has **"All clear"** and **"N of 6 need work"** (`healthSum`, js:256). Use the existing strings. |
| show failing checks, collapse passing ones | **CONFIRMED** | expressible entirely with existing content: the failing `hl--bad/red/vio` items plus the existing summary line. Record honestly that check 5, "VIN decoded", is a hardcoded constant — the six checks are five real ones plus one always-ok. |
| Market + Comps as one region | **CONFIRMED and strengthened** | Market's "Comparable listings · N · last 90 days" and Comps' "All N comparable listings" are the **same N**. Grouping changes no meaning. |
| Specification quieter, drop row-duplicated fields | **MODIFY** | Measured, the six fields are: Trim (duplicates the row), Exterior (duplicates the row), Stock # (duplicates the row), Type = "Used", Mileage = "Not recorded", Location = "Chicago Motor Cars" — **the last three are hardcoded constants**. Dropping the duplicates would leave the region empty. Do **not** silently empty it: record that Specification currently carries no unique real data and defer its content to the provenance stage. |
| History quietest, keep it badged | **CONFIRMED** | Measured: one real entry ("Added to inventory", from `v.d`); four with fabricated dates, one of which fabricates an actor ("Edited by Parin"). Already `Demo`-badged. |
| **option A — a section rail inside the workspace** | **REJECT / REMOVED** | A rail is a control All Vehicles does not have. Single Vehicle's rail and Single Lead's section navigator are **evidence that AAN supports continuous multi-section detail**; they are not permission to add one here. |
| option B — continuous sections, no new control | **CONFIRMED** | the only option carried forward |
| "an expansion changes the size of exactly one thing" | **CONFIRMED** | measured: opening Market moves three untouched sections ±435px at frame 0 |

---

## §11 · FILTERS RELATIONSHIP

**ORIGINAL** the dock is not the workspace · both anchored to the same stack · opening Filters keeps
the vehicle open and at the anchor · Stage 1's two fixes must not regress · the dock-open column
collapse is Stage 5.

**VERDICT: CONFIRMED.** No invented behaviour. One addition: Stage 2 should verify the anchor is
recomputed when the dock opens, because the dock changes the row grid and therefore row heights.

---

## §12 · CSS → JS MIGRATION CONTRACT

**ORIGINAL** CSS publishes, JS reads · `--exp-offset` retired · expansion height owned by layout ·
anchor tolerance as a custom property · transitions drive state.

**VERDICT: MODIFY.**

| Clause | Verdict | Corrected |
|---|---|---|
| CSS publishes the stack, JS reads it | **CONFIRMED** | Stage 1 already does this; All Leads hardcodes `56 − 58 − 48 − 10`, which is the defect to avoid |
| `--exp-offset` retired | **REJECT** | It becomes the **anchor gap** (the 10px in All Leads' formula). Keep it, rename it for what it is. |
| expansion height owned by the layout engine | **CONFIRMED** | removes the one-shot `ex.style.top` defect at its root |
| anchor **tolerance** as a custom property | **REJECT** | There is no tolerance (§3). |
| transition-driven state | **CONFIRMED** | |

---

## §13 · EXACT SELECTORS, FUNCTIONS AND STATE

**VERDICT: MODIFY — one deletion reversed, one addition deferred.**

- `showVehicle` / `closeVehicle` rewrite — **CONFIRMED**, minus the focus move (§5).
- `render()`'s `ex.style.top` block deleted — **CONFIRMED**.
- `setTimeout(…, 200)` deleted — **CONFIRMED**.
- `S.expNow` deleted — **CONFIRMED** (written twice, never read).
- `window.G8demo` and the hash states preserved — **CONFIRMED**.
- **Row gains `role`, `aria-expanded`, `aria-controls`, Space** — **DEFER**. Correct, but it is added
  behaviour; it belongs to the accessibility stage, not to Stage 2. Note that Single Lead's email rows
  already implement exactly this contract, so the product knows the shape.

---

## §14 · RULES THAT MUST BE DELETED — RE-EXAMINED

| # | Original | Verdict |
|---|---|---|
| 1 | `.exp { position: absolute; left: 8px; right: 8px; z-index }` | **CONFIRMED** |
| 2 | **`.exp-space`** and its injection | **REJECT — reverse it.** It is the document extender that makes the anchor reachable near the end of the list (measured: 603px for the last row). It must be **restored to use**, not deleted. |
| 3 | `.exp__in` 360° shadow and 18px radius | **CONFIRMED** |
| 4 | `.field.has-open .row:not(.open) { opacity: .55 }` + its `:hover` partner | **CONFIRMED** |
| 5 | **`.exp__x`** | **REJECT** — existing control on both pages (§4). |
| 6 | `.row.open`'s `#6A7285` block | **CONFIRMED**, with §9's caution |
| 7 | dead accordion machinery (`grid-template-rows: 0fr→1fr`, `overflow: hidden` wrapper, 240ms) | **MODIFY** — the `0fr → 1fr` mechanism is the correct way to animate the in-flow height and is already in the file. Delete the *dead wiring*, keep the technique. |
| 8 | `.exp .exp__accs` 2-col grid and `.acc--open { grid-column: 1/-1 }` | **CONFIRMED** |

---

## §15 · RULES THAT CAN BE REUSED

**VERDICT: CONFIRMED**, with one addition and one caution.

- Add: **`#exp-space`** (§14.2) and **`.exp__x`** (§4).
- Caution on "reuse the accordion for local disclosure inside a region": permitted only where content
  volume genuinely requires it, and never as the region architecture. The locked direction is explicit.

---

## §16 · TRANSITION AND TIMING RISKS

**VERDICT: CONFIRMED**, minus the focus clause.

Risk 5 ("move focus after the scroll settles") is removed with the focus move itself (§5).
Risk 3 (interruption) is downgraded to a **note**: the shipped anchor does not handle interruption, so
requiring it in Stage 2 would be a new guarantee.

---

## §17 · WIDTH RISKS

**VERDICT: CONFIRMED and sharpened.**

- 1366 remains the binding constraint; Stage 1 holds it at zero overflow.
- **New:** at 1366×768 the page shows **one row at rest** and **six engaged**. The in-flow expansion
  will push the list further down at rest. Stage 2 must measure the at-rest case, not only the engaged
  one.
- **New:** Single Lead's bento mis-assigns its grid at 1280. Gen 11's bento uses the same three-slot
  composition and must be checked at 1280 before Stage 2 changes anything below it.

---

## §18 · ACCEPTANCE TESTS — CORRECTED

**Removed** (they test behaviour that is no longer proposed):
- "Closing restores `scrollY` to the value recorded at open, exactly."
- "Opening a row already at the anchor moves the page 0px."
- anything asserting focus movement or keyboard switching.

**Corrected and added:**

**Anchor**
- [ ] Opening any row places its top edge at `--stick-total + anchor-gap` ±2px, at 1280/1366/1440/1920.
- [ ] Opening a row near the **end** of the list still reaches the anchor — the document extends.
- [ ] The travel works in both directions (row above and row below the anchor).
- [ ] Under `prefers-reduced-motion` the row lands at the same anchor, instantly.

**In-flow**
- [ ] Document height grows by the expansion's height ±30px.
- [ ] Zero sibling rows covered; zero siblings dimmed.
- [ ] Workspace left/right edges equal the row's at every width.
- [ ] The pagination footer is always below the workspace.

**Close**
- [ ] Closing does not move the scroll position by more than the reflow requires.
- [ ] The close control still exists and works.

**Layers**
- [ ] The workspace paints under the command band and column header at every scroll position.
- [ ] **The column header never disappears** — no `hd--veil` behaviour is introduced.
- [ ] Tray and filter popovers remain hit-testable with a vehicle open.

**Detail**
- [ ] Opening any region relocates no other region (measured delta 0).
- [ ] Health is visible without interaction and uses the existing "All clear" / "N of 6 need work".
- [ ] The Market region's not-connected statement precedes its visualisation.

**Regression**
- [ ] Zero horizontal overflow at all four widths in default, filters-open and vehicle-open states.
- [ ] At-rest row count at 1366×768 recorded before and after.
- [ ] Stage 1 gains hold: lane rail visible with Filters open, Attention padding unchanged, sticky
      engaged state fires, focus outlines present.
- [ ] Hash states and `window.G8demo` still work; console clean; `?v=` bumped on all three assets.

---

## §19 · IMPLEMENTATION ORDER — CORRECTED

1. Capture a Stage 2 baseline with the Stage 1 harness (**unchanged**).
2. **Removed from Stage 2:** authoring the engaged sticky composition. Evidence says the height is
   archetype-appropriate and the seam is a two-corner problem. Doing it inside Stage 2 changes
   `--stick-total`, which the anchor depends on, for no interaction gain. **Do it before or after,
   not during.**
3. Convert the expansion to flow: delete the popover geometry, **restore `#exp-space`**, share edges,
   stop dimming siblings. Verify nothing is covered.
4. Add the anchor at `--stick-total + gap`, both directions, with the document extender.
5. Delete the `setTimeout` path; let switching be an ordinary open of another row.
6. Restructure the detail into four ordered regions, continuous, no new control.
7. Re-run the corrected acceptance tests at all four widths.

Steps 3 and 4 stay separate.

---

## §20 · DO-NOT-BREAK LIST

**CONFIRMED** in full, with three additions:

- **`#exp-space`** — it is load-bearing for the anchor.
- **`.exp__x`** — an existing control.
- **The existing health strings** "All clear" and "N of 6 need work".

---

## §21 · NEW FUNCTIONALITY REMOVED FROM THE PLAN

| # | Proposal | Where it was | Status |
|---|---|---|---|
| 1 | `↑`/`↓` keyboard vehicle switching | blueprint §7.4 | **REMOVED** |
| 2 | Move focus to the workspace heading on open | §5.5, §13, §16.5 | **REMOVED** |
| 3 | Return focus to the trigger on close | §6.3 | **REMOVED** |
| 4 | Scroll restoration (remember / restore / discard / re-derive) | §6.2, §8 | **REMOVED** |
| 5 | Section rail inside the workspace (option A) | §10 | **REMOVED** |
| 6 | Deleting `.exp__x` (removes an existing control) | §14.5 | **REVERSED** |
| 7 | "merchandising clear" as a new string | §10.1 | **REPLACED** with the existing "All clear" |
| 8 | Anchor tolerance band / downward-only travel | §3.2, §3.3 | **REMOVED** |
| 9 | Row `role` / `aria-expanded` / Space handler | §13 | **DEFERRED** out of Stage 2 (added behaviour) |
| 10 | Shared-container cross-fade on switch | §7.2 | **DEFERRED** (new transition) |

**Also removed from the sibling documents:**

| Proposal | Document | Status |
|---|---|---|
| "one live region announces N results, M selected" | `AAN_DESIGN_SYSTEM_INPUT.md` I-8 | **DEFERRED** — adds behaviour; flag it as such rather than listing it READY |
| "identifiers carry a copy action" applied to All Vehicles | `AAN_DESIGN_SYSTEM_INPUT.md` F-2 / C-7 | **REMOVED** for All Vehicles — copy buttons exist on Single Vehicle only; keep as an observation |
| "using the Single Vehicle section rail as the precedent" (action 10) | `AAN_CROSS_PAGE_DESIGN_AUDIT.md` §16 | **REWORDED** — evidence that continuous multi-section detail works, not permission to add a rail |
| "select-all in scope, range selection, announced count" | `AAN_DESIGN_SYSTEM_INPUT.md` (bulk contract) | **DEFERRED** — three new controls; not for Stage 2 and not READY |

**Existing behaviour — safe, confirmed not new:**
the anchor itself · the document extender · the in-flow expansion · the close button · the Escape
ladder · "All clear" / "N of 6 need work" · moving "By status" beside Flags on All Leads (content
reorganisation, no new control) · the column-priority model for wide tables (a layout policy).

---

*End of verification. The original blueprint is unchanged. Stage 2 was not implemented.*
