# GEN 11 — STAGE 1 FOUNDATION MIGRATION · REPORT

**Date** 2026-09-27 · **Scope** `pages/dealer/all-vehicles-gen11.*` only
**Reads against** `GEN11_AUDIT.md` and `GEN11_MIGRATE_VALIDATION.md`
**Guidance** project-local `ui-design` skill, MIGRATE mode. Its step 3 writes a `design-system.md`; the brief forbids that
file, so the skill was used for its method (audit → extract dominant patterns → harmonise → phase) and the output lives here.

---

## 1 · SOURCE FILES CHANGED

| File | Changed | Note |
|---|---|---|
| `pages/dealer/all-vehicles-gen11.css` | yes | consolidated, quarantined, systems installed |
| `pages/dealer/all-vehicles-gen11.html` | yes | dark gate in the head script, theme toggle hidden, header cells named |
| `pages/dealer/all-vehicles-gen11.js` | yes | sticky reads the stack from CSS, veil branch deleted, dark gated |
| `pages/dealer/all-vehicles-gen11.data.js` | **no** | untouched |

Also created (permitted): `reference/gen11-stage1-baseline/`, `reference/gen11-stage1-after/`, this report.
No other page was opened or modified.

---

## 2 · BEFORE / AFTER

| Measure | Before | After |
|---|---|---|
| CSS lines | 1347 | 2865 |
| CSS rules (parsed) | 1021 | 747 |
| Duplicated selectors | 136 | 45 |
| `:root` blocks | 12 | **1** |
| Active `[data-theme="dark"]` rules | 20 | **0** |
| Ordinal column selectors (`nth-child`) | 6 | **0** |
| Raw `z-index` literals on ladder-owned selectors | 14 | **0** |
| Stale sticky thresholds in JS | 3 | **0** |
| JS lines | 458 | 484 |
| HTML lines | 235 | 238 |

**On the line count.** The file got longer while the rule count fell 27%. Two reasons, both deliberate: every rule is now on
its own line instead of several per line, and the file carries the reasoning for each system. The number that matters for
maintenance is the rule count and the duplicate count.

**On the residual 45 duplicates.** These are not sediment. Each is a base definition plus an explicitly labelled Stage 1
rule — `.hd` appears 4 times: its own definition, the cascade restoration, its sticky offset and its layer tier. They are
grouped, commented and greppable, which is what the next stage needs in order to fold them in. The 136 historical
duplicates, where `.field` was declared seventeen times across twelve layers with no comment linking them, are gone.

---

## 3 · DUPLICATE COMPONENT FAMILIES RESOLVED

Merged to one definition each (occurrence count before):

`.field` 17 · `.hd` 14 · `.exp__in` 12 · `.cmd` 11 · `.lane` 10 · `.lanes` 7 · `.app.dock-open .field` 7 ·
`.exp__in::before` 7 · `.focal` 6 · `.attn` 6 · `.row.open::before` 6 · `.app` 5 · `.top` 5 · `.dock` 5 · `.agemix` 5 ·
`.row.open .stock` 5 · `.btn--primary` 4 · `.lane--all` 4 · `.ar` 4 · `.seg` 4 · `.seg__b` 4 · `.seg__b--on` 4 ·
`.scope` 4 · `.row.open` 4 — and 112 more.

Method: every occurrence of a selector was concatenated in source order into one rule at the position of its last
occurrence. Concatenation rather than per-property replacement, because within a rule the cascade is order-based, so
keeping every declaration in its original order reproduces the exact same winner including shorthand/longhand
interactions.

**Dead code removed** (only what the validation proved dead): 25 rules — `.lot`, `.id*`, `.spec*`, `.c-spec`, `.cmd__sp`,
`.scope__sp`, `.app.veh-open`, `.ring__a`, `.gauge__a`, `.spark`, `.ar--ok`, `.facet__b--icon`, `.vf`, `.pop--up`, the two
scrollbar rules, and the orphaned `.cmd--stuck` / `.hd--stuck` payloads. 7 dead tokens — `--accent-soft`, `--accent-line`,
`--zone`, `--zone-line`, `--glass-edge`, `--sh-float`, `--r-sheet`.

**Runtime-built classes were preserved**, per R6. `stat--ok/--sold/--staging`, `tag--danger/--slate/--violet`,
`hl--ok/--bad/--red/--vio`, `age--fresh/--stale` and every state-only class are assembled from strings in JS; a literal
scan calls them unused and they are not. Removal used the validation's proven list, never coverage from a page load.

---

## 4 · FINAL STRUCTURAL TOKEN GROUPS

One `:root`, 89 inherited tokens plus five new groups:

1. **Sticky stack** — `--bar-track` 88px, `--stick-bar` 68px, `--stick-cmd` 72px, `--stick-hd` 52px, `--stick-cmd-top`,
   `--stick-hd-top`, `--stick-total`. The overloaded `--top` is split: it meant the grid row (88), the bar height (68) and
   the dock offset at once, which is how a 20px error propagated into three unrelated places.
2. **Layer ladder** — `--z-ground/content/raised/sticky-hd/sticky-cmd/platform/tray/menu`.
3. **Structural spacing** — `--sheet-inset` 16px, `--col-gap` 8px, `--exp-offset` 8px. Only values that cross a component
   boundary or feed JS arithmetic. Intra-component padding stays literal until the composition stage, per the validation's
   rejection of "no literal anywhere" as dogma.
4. **Radius ladder** — `--r-pill` 999 · `--r-sheet-o` 28 · `--r-card` 24 · `--r-panel` 18 · `--r-control` 14 ·
   `--r-inner` 10 · `--r-micro` 5. Named at the values Gen 11 already rendered; nothing was snapped in this pass.
5. **Focus** — `--focus-w`, `--focus-offset`, `--focus-color`, `--focus-color-on-dark`.

Component-scoped overrides were preserved, notably `.attn`'s re-declared `--signal` / `--danger` / `--slate` / `--violet`
(V14) — globalising them would have put the attention counts dark-on-dark.

---

## 5 · FINAL Z-INDEX LADDER

| Tier | Token | Value | Holder |
|---|---|---|---|
| ground | `--z-ground` | 0 | page |
| content | `--z-content` | 1 | `.row.open` |
| raised content | `--z-raised` | 3 | `.exp` (the vehicle sheet) |
| sticky header | `--z-sticky-hd` | 10 | `.hd` |
| sticky controls | `--z-sticky-cmd` | 12 | `.cmd` |
| platform nav | `--z-platform` | 20 | `.top` |
| tray / drawer | `--z-tray` | 30 | `.tray` |
| menu / popover | `--z-menu` | 40 | `.menu`, `.pop` |

Two `z-index: -1` remain, both on pseudo-elements inside their own isolated stacking contexts. They are local paint order,
not tiers.

**Collisions this resolved, verified by hit-testing:**

- **Selection tray under the vehicle sheet.** Before: with 3 rows selected and a vehicle open, all three probe points
  inside the tray's own box returned `.exp__in` — the bar was completely unclickable. After: all three return the tray.
- **Sheet over the persistent column header.** `.exp` moved from 40 to 3, below `.hd` at 10. Content now travels under
  chrome, so the `.hd--veil` mechanism that hid the header to avoid the collision is unnecessary and was deleted.
- **Filter popovers clipped by the header.** `.sub` carried `z-index: 5`, making it a stacking context that trapped the
  Make / Model / Year / Price popovers at its level, where `.hd` — tied at 5 and later in the document — drew over them.
  `.sub` and `.scope` now take `z-index: auto`; `.pop` sits in the menu tier.

---

## 6 · STICKY SOURCE OF TRUTH

CSS publishes the stack; JS reads it with `getComputedStyle` and keeps no copy.

```
.cmd { top: var(--stick-cmd-top); }     /* 68  */
.hd  { top: var(--stick-hd-top); }      /* 140 */
.dock{ top: var(--stick-cmd-top); }     /* was 88 — 20px below the band it is commented as sitting level with */
```

The JS previously tested `<= 56.5` and `<= 114.5`, thresholds from a layout with a 56px bar, while the CSS had moved to 68
and 140. They could never be met, so `cmd--stuck`, `hd--stuck` and `hd--veil` never fired at any scroll position and the
entire engaged state was unreachable code.

**Measured after:** `cmd--stuck` false at scrollY 0, **true at 400 and 900**. `hd--stuck` false at 0 and 400, **true at
900**. Gap between the bar and the band when engaged: **0px**. Gap between the band and the header when both are engaged:
**0px**.

The stale visual payloads were **deleted**, not reactivated — they were Gen 10's edge-to-edge grey band with a `#6A7285`
border, which against Gen 11's white glass band would have rendered as a 10px grey frame. `.cmd--stuck` and `.hd--stuck`
remain as empty hooks so the engaged look can be authored once, later. `.hd--veil` and its JS branch are gone: hiding
persistent chrome is never the remedy for a collision.

---

## 7 · 1366 OVERFLOW

**Before:** `scrollWidth` 1393 against `clientWidth` 1354 — **39px of horizontal overflow**, with the Actions cell ending
26px past the field. Cause: the compact column set was gated at `max-width: 1320px` and the compact platform bar at
`max-width: 1360px`, so 1366 fell through both and rendered the full-width layout in a box that could not hold it.

**Fix:** one boundary at `max-width: 1400px` carrying the compact columns, the compact bar and a 6px column gap. 1440 and
wider keep the full set untouched.

**After — `document.documentElement.scrollWidth === clientWidth` at every target width, in default, filters-open and
vehicle-expanded states:**

| Width | Overflow | Row right edge vs `.field` |
|---|---|---|
| 1280 | 0 | 0 |
| 1366 | 0 | 0 |
| 1440 | 0 | 0 |
| 1920 | 0 | 0 |

No functional text was shrunk to achieve this; the compact set is the one Gen 11 already used below 1320.

---

## 8 · FOCUS

The only focus style was `:focus-visible { box-shadow: var(--focus) }` alongside `:focus { outline: none }`. Because the
ring rode on `box-shadow` — a single-slot property that every decorative shadow below overwrote at equal specificity — the
page's main action set had **no focus indicator at all**.

Focus now owns `outline` + `outline-offset` and nothing else sets them. The global `border-radius: var(--r-s)` was removed
from `:focus-visible`, so focusing no longer reshapes elements that have no radius of their own.

**Measured, 13 keyboard stops:**

| Stop | Before | After |
|---|---|---|
| Add vehicle, Export, Sort, quick-filter facets | **no indicator** | visible, 4.57–5.57:1 |
| lane tab | white ring on a light track, **1.13:1** | visible, 4.91:1 |
| attention tile | visible | visible, 15.97:1 |
| search, row, row action, pager, brand, view switch | mixed | visible, 3.26–5.57:1 |
| sortable column header | not focusable | **still not focusable** — see §12 |

Clipping was handled: items inside `.focal`, `.value`, `.attn` and `.exp__l` take a negative outline offset so the ring
stays inside the clip, and items on the navy cards use a warm ring instead of the brand green, which is nearly invisible
there.

---

## 9 · DARK GATING

Three independent gates, because the storage key `aan-theme` is shared with the other Gen pages and a user can arrive
already set to dark:

1. **CSS** — the `[data-theme="dark"]` block and all 20 dark rules are fenced in a labelled section and carry a
   `[data-aan-dark]` prefix that the page never sets. They cannot match. The work is preserved verbatim; re-enabling is
   removing the prefix.
2. **Head script** — only a stored `light` is honoured, so a stored `dark` cannot land the page in a broken state at load.
3. **`setTheme`** — `DARK_ENABLED = false` coerces `dark` to `light`, which also covers the `#dark` hash state. The toggle
   button is `hidden`.

**Verified:** clicking the toggle leaves `data-theme="light"`; a `localStorage['aan-theme'] = 'dark'` followed by a reload
leaves the page light; `.field` background unchanged.

This is a temporary implementation state, not a design-system rule, and it is commented as such in all three places.

---

## 10 · REGRESSION EVIDENCE

`reference/gen11-stage1-baseline/` — 10 screenshots (1440 default / scroll400 / scroll900 / vehicle / vehicle+market /
vehicle+all / filters, plus 1366, 1280, 1920 defaults), computed geometry for `.top`, `.cmd`, `.hd`, `.field`, `.rows`,
`.exp`, `.dock` at all four widths, and a **full render fingerprint**: 14 review states × ~2 100 elements × 60 computed
properties, plus the box of every element.

`reference/gen11-stage1-after/` — the same fingerprint after each step, and four confirmation screenshots.

`reference/gen11-stage1-baseline/harness.js` — the capture rig: it drives the review states through the page's own
`window.G8demo` API, freezes the hero counter (it animates for 700ms and made captures non-deterministic) and pins scroll.

**Final fingerprint diff, baseline vs shipped: 509 property changes, every one attributable to a named intentional
change.** With the layer ladder and the four intentional areas excluded, the unexplained remainder is **0** — the only
entries left are the lane rail reappearing and the widths that shift because of it.

---

## 11 · INTENTIONAL VISUAL REFINEMENTS

Six, each an existing component corrected, none new.

**1 · Summary cards restored to one material** *(regression introduced and fixed inside this pass)*
Consolidation moved `.value, .attn`'s earliest declaration — a light gradient from a superseded layer — past the later
navy declaration, so both cards went white while keeping their on-dark near-white ink. The labels "Value", "$66.3M",
"No price", "No photos", "Feed excluded", "Hidden on site", "Aging over 1 year", "Sale pending" became almost invisible
while the Lot card stayed dark. **Why:** the three cards are one material lit from three edges; losing the surface on two
of them breaks both the hierarchy and the contrast. **After:** all three `rgb(23,34,52)`, radius 24px, one `--sh-card`
elevation; measured contrast 6.27–14.74:1 on every label and metric. **Function and content unchanged.**

**2 · The lane rail stays visible when Filters opens**
`.app.dock-open .lanes { display: none }` is a Gen 8 rule from when the lanes lived on the bento; they now live in the
command zone and the rule was never re-scoped, so the page's highest-order scope control vanished whenever the filter
panel opened. **After:** `display: flex`, measured visible. **No control was added or removed** — one that already existed
stopped disappearing.

**3 · Needs-attention no longer changes padding when Filters opens**
Measured `14px 18px 18px` closed against `14px 12px 10px` open, a leftover of the same self-cancelling pair, so the queue
jumped as the panel appeared. **After:** one value in both states.

**4 · The Filters dock header sits level with the command band**
`.dock` used `top: var(--top)` = 88 while the band sticks at 68 — 20px apart, though the file's own comment says they
should be level. Two persistent headers at two offsets cannot read as one layer regardless of their fills.

**5 · The theme toggle is hidden**
It switched to a theme that renders the exception queue white-on-white. A control that leads only to a broken state should
not be offered while that state is being repaired. **Temporary**, reversed by the dark stage.

**6 · The 1366 column set**
See §7. This is a defect correction, not a design change: the same column set Gen 11 already defines, applied at a width
that was falling through the gap.

Everything else that moved is a consequence of the layer ladder or of the toggle being hidden.

---

## 12 · DEFERRED, AND WHY

Per the brief's do-not-touch list and the validation's staging: lane filtering and the four contradictory counts
(Stage 2) · per-figure provenance and live/staged/stub (Stage 2) · the dark palette re-solve (Stage 3) · list identity,
`render()`/innerHTML, focus survival across re-renders and a live region (Stage 3) · the engaged sticky *look*
(Stage 3/6) · in-flow expansion, anchor scroll, the 200ms `setTimeout`, row dimming (Stage 4) · detail-section structure
and the 2-column accordion (Stage 4) · column identity, drop order, VIN policy, the exception slot map (Stage 5) · type
scale, signal budget, bento composition, motion values (Stage 6) · anything below 1280.

Two items surfaced during this pass and are deferred with a reason:

- **Sortable column headers are still not keyboard-focusable.** They are `<span>` elements with no `tabindex` and no
  `aria-sort`. Giving them focus means giving them table semantics, which is the Stage 5 column model. Stage 1 made every
  *existing* focus stop visible; it did not create new ones.
- **`--hdh` (48px) still disagrees with the rendered header height (52px)**, and `--cmdh` (58) with the rendered band
  (72). Both are now bypassed for anything structural — the sticky stack uses its own tokens — but the stale pair is left
  in place because rules still read them and reconciling them moves rows. It belongs with the row module in Stage 5/6.

---

## 13 · WHAT COULD NOT BE COMPLETED SAFELY

**Physically relocating the three families into contiguous sections.** The brief asks for the expansion, dock-open and dark
families to be *moved* into labelled sections. It was implemented, measured, and reverted: in this file source order *is*
the cascade, and moving the families flipped **19 same-specificity conflicts** — `.attn__h h2` fell from 16px/700 to
15px/600, `.value__h .s` from 13px to 14px, `.th--none` from `display: grid` to `block`, `.price--none` from weight 400 to
600, and more. Each would have needed a specificity patch, which is the kind of layer Stage 1 exists to remove.

**What was done instead:** every family is fenced where it already lives, with `/* >> QUARANTINE · … */` and
`/* << end … */` markers and an index at the top of the file. The dark family additionally cannot match at all, so its
position is irrelevant. The organisational goal — the families are identifiable, grouped and not half-cleaned — is met;
the physical move is not, and it should be done as part of the in-flow expansion stage, which rewrites that section anyway.

**One residual render difference: the Filters dock is 1.6px shorter.** It propagates from `#dock-b` to `.field` and shifts
the dock footer by 1–2px. Seven elements, sub-pixel, no colour, type or page-position consequence, and it sits inside a
panel with its own scroll. Traced far enough to establish it is a sub-pixel rounding difference in the dock's flex
column, not a lost rule. Recorded rather than chased.

**Three process errors, found and fixed inside the pass** — recorded because they affected intermediate results:

1. **The browser served a cached stylesheet** for the first three verification rounds, so three "identical render" results
   were comparing the original against itself. Found by checking that the loaded sheet still had 12 `:root` blocks. Every
   result in this report comes from a run with a verified cache key and a verified rule count.
2. **The merge collapsed three `@font-face` rules into one**, because they share a "selector". Archivo stopped loading and
   every text metric shifted. At-rules are now never merged.
3. **Dead-rule removal deleted only a multi-line rule's opening line**, leaving its body and closing brace and breaking the
   stylesheet, which made the browser silently discard the following rule. Caught by a brace-balance check, now part of the
   build. The stylesheet is brace-balanced.

---

## 14 · ACCEPTANCE

**Structure** — one `:root`, first in the file ✔ · zero active dark rules outside the inactive quarantine ✔ · major
components defined once plus explicit, labelled state and breakpoint rules ✔ · no `nth-child` column addressing ✔ · no
undeclared global token references ✔ · no raw z-index on ladder-owned selectors ✔ · no stale sticky pixel thresholds in JS
✔ (`grep -nE "56\.5|114\.5|114 \+ 48"` matches only a comment describing the defect).

**Width** — `scrollWidth === clientWidth` at 1280 / 1366 / 1440 / 1920, with a real scrollbar, in default, filters-open and
vehicle-expanded states ✔ · rows do not exceed `.field` at any width ✔.

**Sticky** — the engaged state activates ✔ · no daylight between bar, band and header ✔ · the dock aligns with the band ✔ ·
popovers remain usable while scrolled ✔ · the vehicle sheet never paints over the persistent header ✔ · the selection tray
stays clickable with a vehicle open ✔.

**Filters** — the lane rail stays visible ✔ · Needs-attention geometry does not jump ✔ · no content disappears ✔ · no
stacking collision ✔ · no horizontal overflow ✔.

**Focus** — every existing keyboard stop shows an outline at ≥ 3:1 ✔ · none clipped ✔ · no `outline: none` without a
replacement on the same selector ✔. One stop is not focusable at all and is deferred (§12).

**Dark** — unreachable from the toggle, from `#dark` and from a stored preference ✔ · a stored `dark` cannot put the page
into a broken state ✔.

**Other** — console clean, no errors or warnings, in every review state ✔ · hash states and `window.G8demo` still work ✔ ·
`?v=` bumped to `202609271700` on CSS, data JS and main JS together ✔.

---

## 15 · EXPLICIT CONFIRMATIONS

- **NO NEW FEATURES ADDED**
- **NO NEW FUNCTIONALITY INVENTED**
- **NO NEW DATA OR ANALYTICS INVENTED**
- **NO NEW CONTROLS OR SECTIONS ADDED**
- **EXPANSION GEOMETRY NOT REDESIGNED** — `.exp` keeps `position: absolute`, its JS `top` measurement, `#tb`'s positioning
  context, `.exp-space`, the 200ms transition path and the 2-column detail grid. Only its layer tier changed.
- **DETAIL ACCORDION ARCHITECTURE NOT REDESIGNED**
- **LANE BUSINESS LOGIC NOT CHANGED** — `list()`, `setLane()`, `countTo()` and the hardcoded counts are untouched, and the
  `S.lane → row()` status coupling is intact.
- **NO OTHER PAGE MODIFIED** — `git status` shows exactly three modified files, all Gen 11.
- **NO GEN 12 CREATED**
- **NO DESIGN.MD CREATED**
- **NO GIT PUSH**

**STOP.** Stage 2 was not started.
