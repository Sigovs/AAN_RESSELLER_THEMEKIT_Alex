# GEN 11 — ALL VEHICLES · MULTI-SKILL AUDIT

**Subject** `pages/dealer/all-vehicles-gen11.{html,css,js,data.js}` — the current working version of Dealer UI · All Vehicles.
**Date** 2026-09-27 · **Status** AUDIT ONLY. No source file was modified. No Gen 12. No Git push.
**Scope** All Vehicles only. All Leads, Single Lead and Single Vehicle were not audited.

---

## EXECUTIVE SUMMARY

Gen 11 is a well-drawn page with a broken installation. Almost every serious finding below is not a matter of taste — it is a
mechanism that was designed, written into the file, and then switched off, overwritten or never wired up. Four independent design
lenses, working from the same measured browser session but without seeing each other's reports, converged on the same short list.

**The five things that matter most:**

1. **The page's primary interaction produces no perceivable response.** Clicking a row opens the detail panel *below the fold* and
   does not scroll. Measured at a 977px viewport: click row 8, the panel opens 963px off-screen, `scrollY` unchanged. Measured at an
   801px viewport (a 1366×768 laptop): **row 1 shows 12% of the panel, rows 2, 3 and 4 show 0%.** The chrome above the first row is
   635px — 79% of that viewport. This is not an edge case; at the stated target of 70 rows per page it is the normal case. Under
   `prefers-reduced-motion` the interaction becomes a literal no-op.

2. **The sticky system's "engaged" identity is unreachable code.** `all-vehicles-gen11.js:449–450` tests `<= 56.5` and `<= 114.5`;
   the elements now stick at 68 and 140. Measured `false` at every scroll position. So `.cmd--stuck` (edge-to-edge grey band),
   `.hd--stuck::before` (the column header's sheet, border and shadow) and `.hd--veil` are all written and never switched on. The
   toolbar does not "dissolve into white" because it was styled badly — it dissolves because its stuck styling never runs.

3. **The lane control does not filter anything, and the page states four contradictory counts at once.** `S.lane` never reaches
   `list()`. Verified live: click **Pending · 0** and the hero reads **0**, the scope line reads **Pending · 359 vehicles**, the
   footer reads **1–16 of 359**, and the list shows **16 Available cars with their status pill relabelled "Pending"**.

4. **Dark theme is dead on the inventory surface, and it takes the exception queue with it.** `.field` stays
   `rgba(255,255,255,.58)`, row text stays near-black, only `.cmd` flips. `.value` and `.attn` take near-white ink over a light
   ground, so **"No price", "No photos", "Feed excluded", "Hidden on site", "Aging over 1 year", "Sale pending"** render at roughly
   **1.0–1.3:1** — invisible. The toggle persists to `localStorage`, so a user can land on that page at load.

5. **The stylesheet has no single source of truth.** `:root` is re-opened **12 times** with four complete palettes;
   `.field { --cols }` is redeclared **10+ times**; `.row.open` **5 times** including two full colour reversals; `.exp__in`
   **8 times**; `.hd`'s `top` **5 times**. The `--top` token says 88px for an element that renders 68px. Three of the P0s below are
   *caused* by this — the focus ring is erased by later `box-shadow` rules, the dark theme is broken by literals in later `:root`
   blocks, and the stuck classes are orphaned from their JS thresholds.

**Counts:** **8 × P0** · **21 × P1** · **13 × P2** · **2 × P3**.

**What is genuinely good and must survive any rework:** the Needs-attention queue as a pattern (six counts that filter the list on
click — the best idea in the product); the lane rail as an operations control; the accordion component itself (correct
`aria-expanded`, correct `inert`); the 35-symbol 24-box icon set; the `.demo` provenance badge as a device; the Escape ladder; and
light-theme contrast, which passes AA at every sampled point.

---

## METHOD, AND WHAT EACH SKILL ACTUALLY CONTRIBUTED

A real Chromium session was driven through the page before any skill pass ran: default, scrolled, selected, expanded, accordion-open,
filters-open, dark, and at 1431px and 1267px. Geometry, computed styles, contrast ratios, stacking order and hit-testing were measured
and handed to all four passes as shared fact, so no pass is working from a screenshot. **Browser/render inspection was available and
was used.** No console errors or warnings occur at any point.

Four lenses then ran in isolation so none could suppress another.

### Pass 1 — ui-ux-pro-max@claude-code-ui-ux-skill (v2.11.0)
**Honest note:** the plugin was installed mid-session, so its skills are not registered with the Skill tool. Its instruction files
were read directly from disk (`SKILL.md`, `references/pro-rules.md`, `references/quick-reference.md`,
`design-system/references/states-and-variants.md`) and applied as the rule set. The plugin exposes **no dedicated audit command**.
**Unique contribution:** the accessibility and control-contract layer no other pass reached — the erased focus ring (P0-7), the
re-render that destroys focus with no live region (P0-8), the absence of table semantics and keyboard sorting (P1-12), the missing
bulk-action safety layer (P1-13), and the census of five open/close idioms and three selected-state idioms that is the direct answer
to concern E.

### Pass 2 — frontend-design@claude-plugins-official
Skill loaded normally. **Unique contribution:** the composition and system-integrity layer — the twelve `:root` blocks as the *cause*
rather than a hygiene complaint (P1-1), the signal-budget inversion (P1-4), the four-deep card soup with four radii (P1-5), the
eighteen-size non-scale (P1-6), the spacing audit that found **five different values (1/3/4/5/6px) for the single most repeated
relationship in the product**, and the observation that the page arrived at generic blue SaaS by *overwriting* two more distinctive
directions whose rationale is still narrated in the comments.

### Pass 3 — genjutsu@genjutsu (v3.3.0)
`genjutsu:paint` and `genjutsu:cast` both loaded and were used for critique only; neither build pipeline was run.
**Unique contribution:** structural divergence — the six assumptions being carried rather than decided, four genuinely different
spatial models for the selected vehicle (below), the elevation census (nine shadow tokens across four scales, ~15 shadowed elements
on one screen), and the motion verdict: **the two longest animations on the page both animate facts** (a 700ms hero counter, a 650ms
`width` keyframe on the exception meters) while the action the user actually takes gets a 160ms fade that may play off-screen.

### Pass 4 — nateherk-design@nateherk (v0.2.0)
**Honest note, stated plainly:** this plugin ships exactly one skill — `scrollcraft`, a build pipeline for scroll-driven marketing
landing pages. It has **no audit capability whatsoever**, and it is a poor fit for an inventory grid. Nothing in this report was
produced by the plugin. Three ideas from its reference files transferred legitimately and were used: *every scroll position is a
separate frame* (`verify.md`), *the cold check diffed against stated intent* (`feel.md` §6), and `taste.md`'s content rules
("no invented statistics", "real numbers or no numbers", "redefining a token on a subtree does not re-ink the text under it").
**Unique contribution, and the highest-value single finding in the whole audit:** the lane control does not filter (P0-3). Also the
provenance arithmetic (P0-6), the layer collisions derived from stacking contexts rather than screenshots (P0-8), the finding that
**the CSS documents a sticky-scope decision it cancels 14 lines later**, and the observation that the page's failure modes are
*correlated with its purpose* — the `+N` chip clips first on the vehicles with the most flags.

**Verification note.** Four subagent claims were re-tested independently in the browser rather than accepted: the erased focus ring
(confirmed, 4 of 8 sampled controls), the lane lie (confirmed, worse than described), the header-over-popover collision (confirmed),
and the tray-under-panel collision (confirmed, and total rather than partial).

---

## UNIFIED PRIORITY FINDINGS

### P0 — broken or dangerous

---

**P0-1 · Opening a vehicle produces no perceivable response**
**CATEGORY** INTERACTION · **SYSTEMIC**

**WHAT IS WRONG.** `.exp` is `position: absolute; z-index: 40` positioned by a JS measurement; `.exp-space { display: none }` reserves
nothing; `showVehicle()` deliberately does not move the page (its own comment: *"a popover comes to the row — no scrolling the page to
it, no spacer to make room"*). Measured at 977px viewport: click row 8 (top at y=1153), `scrollY` is 0 before **and after**, panel
opens 1245→1940, i.e. **963px below the fold**. Measured at 801px viewport: chrome above the first row is **635px = 79% of the
viewport**, only **2 rows** are fully visible at rest, and opening row 1 / 2 / 3 / 4 shows **12% / 0% / 0% / 0%** of the panel. The
only feedback is a 160ms fade on an off-screen element; under `prefers-reduced-motion` the blanket `.01ms` rule removes even that.

**WHY IT MATTERS.** A click that appears to do nothing is read as a broken build. The recovery behaviour is to click again — which
`showVehicle` interprets as *close* — so the page silently toggles state with zero feedback in either direction. This is owner
concern **A**, and Gen 11's stated intent fails on its own terms: the popover comes to a row the user cannot see.

**WHERE** `all-vehicles-gen11.js:219–227` (`showVehicle`), `:124–126` (positioning); `all-vehicles-gen11.css:1257` (`.exp`),
`:1264` (`.exp-space`).

**RECOMMENDED PRINCIPLE.** Every state change the user initiated must be perceivable **in the viewport they initiated it from**.
Opening a record establishes a *named resting position* — its identity row comes to rest immediately below the last persistent layer
— and the page travels the **minimum** distance needed to satisfy that, never moving if the invariant already holds. Closing returns
to the reading position, so open/close is a lossless round trip. Under reduced motion this becomes an instant jump to the same place,
never the removal of the invariant. Explicitly **not** `scrollIntoView(center)`: a named anchor is learned once and predicted
thereafter; a centred target is a different place every time and pushes the row away from the toolbar it is operated from.

---

**P0-2 · The "engaged" state of the entire sticky stack is unreachable code**
**CATEGORY** STICKY-SCROLL / CODE-RISK · **SYSTEMIC**

**WHAT IS WRONG.** `js:449–450` tests `cmd.getBoundingClientRect().top <= 56.5` and `hd…top <= 114.5`. Those thresholds belong to an
abandoned `--top: 56px` / `--cmdh: 58px` layout. The elements now stick at **68** and **140**, so the tests can never pass. Measured
`cmdStuck: false, hdStuck: false` at scrollY 0 / 200 / 400 / 600 / 900. Dead as a result: `.cmd--stuck` (edge-to-edge grey band,
radius → 0), `.hd--stuck::before` (edge-to-edge sheet + bottom border + drop shadow) and `.hd--veil`. Roughly 30 lines of exactly the
differentiation this stack needs, written and switched off by two stale numbers. Compounding it: `--top` is declared **88px** while
`.top` renders **68px**, so `.hd`'s `top` is declared five times across the file (`var(--top)`, `calc(--top + --cmdh)`, 168, 198, 160,
140) and the Filters dock — which still uses the token at `top: var(--top)` — sits **20px out of alignment** with the command band it
is commented as being level with.

**WHY IT MATTERS.** This is the mechanical root of owner concern **D**. Both sticky layers arrive at their positions *in their at-rest
costume* and dissolve into the sheet white behind them. Nothing is styled badly; the design is simply not installed.

**WHERE** `js:443–453`; `css:808–828` (`.cmd--stuck`), `:866–875` (`.hd--stuck::before`), `:1041–1046` (`.hd--veil`), `:1212–1213`
(`--top` vs `.top`), `:1024–1028` (dock), `:1346–1347`.

**RECOMMENDED PRINCIPLE.** Sticky offsets are **derived, never typed**. Each persistent layer publishes its measured height to the
layer below, so the stack's total is one value the rest of the page can reason about. Any scroll state read by JS is read from the
same source the CSS positions from, or it rots silently on the next height change. A state class must never be able to disagree with
the layout that produces it.

---

**P0-3 · The lane control does not filter, and the page asserts four contradictory counts simultaneously**
**CATEGORY** SYSTEM / CODE-RISK · **SYSTEMIC**

**WHAT IS WRONG.** `list()` filters on attention flags, age band, make, year and price. **`S.lane` is never used.** `setLane()` only
re-labels: it rolls the hero counter to a hardcoded count and `row()` swaps the Status pill text. Verified live — clicking
**Pending · 0** yields, on one screen: hero **0** · scope line **"Pending · 359 vehicles"** · footer **"1–16 of 359"** · **16 rows**,
each an Available car with its pill rewritten to "Pending". Sold (13,212) and All (13,587) behave the same way. The 0-count lane is
not `aria-disabled` and remains fully clickable; if its empty state were ever reached it would read *"No vehicles match these
filters"* with no filter set.

**WHY IT MATTERS.** The lane rail is the page's primary scope control and the widest persistent object in the command zone — a client
will click it first. Four mutually contradictory counts on one screen destroys trust in every other number on the page, including the
correct ones. In a review artefact this is worse than a visibly unimplemented control, because it returns a confident wrong answer.

**WHERE** `js:62–84` (`list`), `:173–178` (`setLane`), `:111` (`row`), `:127/135` (`render`); `html:181–186`.

**RECOMMENDED PRINCIPLE.** A scope control that does not scope is worse than an absent one. In a prototype, a control either operates
on the demo set or is visibly staged — never labelled with an authoritative count it cannot produce.

---

**P0-4 · Dark theme is dead on the inventory surface, and it erases the exception queue**
**CATEGORY** ACCESSIBILITY / SYSTEM · **SYSTEMIC**

**WHAT IS WRONG.** Measured in `data-theme="dark"`: `.field` background, `.mk` row text, `body` background, `.stk__vin`,
`.sub__shown`, `.foot`, `.trim`, `.hd` and `.cmd .facet__k` are **byte-identical to light mode**. Only `.cmd` flips, producing a dark
slab floating in a light page. `.value` and `.attn` take near-white `--focal-ink` over a reverted light gradient, so **"Value",
"$66.3M", "$293K", "146", "No price", "No photos", "Feed excluded", "Hidden on site", "Aging over 1 year", "Sale pending"** render at
roughly **1.0–1.3:1**. The mechanism: `[data-theme="dark"]` (css:44–62) redefines *tokens only*, while the late layers paint with
literals — `rgba(255,255,255,.58)`, `rgba(255,255,255,.72)`, `rgba(255,255,255,.93)`, `#6A7285`, `#4f576a` — which no token
substitution can reach. A later `:root` block (css:1169) introduced the Gen 9 palette with **no matching dark re-declaration**, so the
dark block now sets a palette that no longer exists. The toggle persists to `localStorage`, so this state survives reload.

**WHY IT MATTERS.** The failure lands precisely on the six exception labels — the page's entire reason to exist. And the deeper point
is structural: the moment translucency became the identity device, the theme stopped being invertible by token substitution.
`rgba(255,255,255,.58)` is not a colour, it is a hardcoded relationship to "white". Every future theme, brand or white-label hits the
same wall on the same selectors.

**WHERE** `css:44–62` (orphaned dark block) vs `:222`, `:736–752`, `:902–904`, `:1036–1040`, `:1131–1135`, `:1169`, `:1311–1318`;
toggle `js:373–377`.

**RECOMMENDED PRINCIPLE.** A colour in a rule is a token or it is a bug — including its alpha. A translucent surface declares its
**composited** result as a per-theme token, not an alpha over an assumed ground. A theme ships only when the *exception layer* has
been verified in it on the composited render; the signal surfaces are the acceptance test, not the body text.

---

**P0-5 · The focus indicator is erased on most primary controls**
**CATEGORY** ACCESSIBILITY · **SYSTEMIC**

**WHAT IS WRONG.** The only global focus style is `:focus-visible { box-shadow: var(--focus) }` at `css:74`, alongside
`:focus { outline: none }`. The ring therefore rides on `box-shadow` — a single-slot property — and every later class rule that sets
`box-shadow` has equal specificity and wins by order. **Verified live on 8 controls:** `Add vehicle` (`.btn--primary`), `Export`
(`.btn--sheet`), `Sort` (`.cmd .facet__b`) and the quick-filter facets (`.qf .facet__b`) show **`outline: none` and an unchanged
`box-shadow` on focus — no focus indicator of any kind.** `.lane` and `.attn .ar` *do* show a ring, because they use
`outline: solid 1.6px` — the correct pattern is already in the file, applied to two elements out of roughly forty.

**WHY IT MATTERS.** An inventory manager working a 359-row queue by keyboard has no idea where they are on the page's main action set.
It is invisible in review because it only appears on Tab.

**WHERE** `css:74` vs `:136`, `:840`, `:1113`, `:1115`, `:1122`, `:1128`, `:1219`, `:1240`. Correct pattern at `:927`, `:972`.

**RECOMMENDED PRINCIPLE.** Focus is a **layer, not a shadow**. Give it a property no decorative rule competes for (`outline` +
`outline-offset`), state ownership of that property once at product level, and forbid components from setting or removing it. Never
remove `outline` globally.

---

**P0-6 · Every state change rebuilds the list, destroying focus; nothing is announced**
**CATEGORY** ACCESSIBILITY / INTERACTION · **SYSTEMIC**

**WHAT IS WRONG.** `render()` does `$('#tb').innerHTML = …` on every filter toggle, sort change, lane change, selection checkbox
change and vehicle open/close. All row DOM — including the checkbox the user just operated — is replaced, so `document.activeElement`
becomes `body`. Keyboard multi-select is therefore impossible: tick one box and you are returned to the top of the document. There is
**no `aria-live` region anywhere** in the page, so neither the new result count nor the selection count is ever announced. `tog()`
contains a focus-restore hack for the dock only — evidence the author hit this and patched one surface.

**WHY IT MATTERS.** The core loop of an ops tool is *filter → scan → select several → act*. This breaks the *select several* step for
every non-mouse user and loses DOM identity for everyone.

**WHERE** `js:133–159` (`render`), `:181` (`tog`), `:415` (`[data-sel]` change handler).

**RECOMMENDED PRINCIPLE.** A list's identity must survive its own updates: rows are addressable objects that are patched, not a string
that is rewritten. Any change to the size or membership of a result set is an **announcement**, not merely a number that happens to be
different — one polite live region owns "N vehicles, M selected" for the whole page.

---

**P0-7 · Provenance: four "Demo" badges over roughly twelve fabricated surfaces, and the unbadged ones carry the decision weight**
**CATEGORY** SYSTEM · **SYSTEMIC**

**WHAT IS WRONG.** `<span class="demo">Demo</span>` is attached to Market & pricing, Recent comps, History, the Options facet and the
dock footer. It is **absent** from every number a dealer would act on: the bento figures (`359`, `of 13,587 on file`, `$66.3M`,
`$293K`, `146`, the age mix `73/115/131/40`); **all six Needs-attention counts** (`133/95/67/61/40/49` with meters and percentages);
all five lane counts; every facet count (the Make popover even footnotes *"counts = current lane"*, which is false); the pager
`1 2 3 … 23` and `16 per page`; and `Updated 5 min ago` beside a live green pulse dot that asserts a feed. `Specification` is
unbadged and hardcodes `Type: Used`, `Mileage: Not recorded`, `Location: Chicago Motor Cars` for **every** vehicle — including a 2021
trailer and a Terex — while the Location facet claims six rooftops with counts.

**And the fabrication is deterministic, which makes it worse, not better.** `market()` seeds `rng(hash(v.s))` off the stock number, so
the same car shows the same median, the same days-to-sell and the same five comps with the same mileages, distances and states on
every reload, across sessions, on the client's machine and yours. Random-per-load fabrication announces itself; **stable fabrication
is indistinguishable from a real integration.** The one honest line — `Source: visor.vin market data · not connected` — is the last
row of a list at 14px grey, *below* the chart, visible only when that accordion is open.

**WHY IT MATTERS.** The badge marks the three sections a reviewer is least likely to believe and leaves unmarked the six numbers a
reviewer will absolutely believe and act on. A dealer shown "Aging over 1 year: 40" will ask which 40 cars. Separately, `History`
fabricates an **attributed audit trail** ("Edited by Parin, 3 days ago", "Asking price set to $X, 42 days ago") — a different category
of risk from a fabricated market median.

**WHERE** `html:138`, `:151–172`, `:181–186`, `:203`, `:219`; `js:20–36`, `:188–202`, `:284–291`, `:300–303`, `:348`, `:357`.

**RECOMMENDED PRINCIPLE.** Provenance is a property of **every figure, not of a section**, in three tiers decided per number:
**derived** (computed from the loaded demo set, therefore true of what is on screen — no mark needed, and most of the bento could be
derived today); **illustrative** (a fixed plausible figure, marked **at the number**, inside the tab stop, not in a section header);
**not connected** (the integration does not exist — said **before** the visualisation, not under it; a convincing chart with a
disclaimer below it is a chart, not a disclaimer).

---

**P0-8 · Layer collisions: the column header slices open dropdowns, and the detail panel hides the bulk-action bar**
**CATEGORY** STICKY-SCROLL / CODE-RISK · **SYSTEMIC**

**WHAT IS WRONG.** Three collisions, all **verified live**, all requiring one control to be open *while* scrolled — a state a
screenshot pass does not reach.

- **Header over popovers.** `.sub` is `position: relative; z-index: 5`, which makes it a stacking context, clamping the
  Make/Model/Year/Price popovers inside it (`.pop { z-index: 40 }`) to 5 against the page. `.hd` is also `z-index: 5` and comes later
  in DOM order, so it wins the tie. Verified: at scrollY 400 the Make popover occupies 183→608 and the header band 183→235; hit-testing
  inside the band returns the **header cell**, not the popover. A 52px opaque band slices the list of makes.
- **Panel over the selection tray.** `.exp { z-index: 40 }` sits in the root stacking context; `.tray` (the bulk-action bar) is
  `position: fixed; z-index: 5`. Verified: select 3 rows, open a vehicle, scroll — **all three probe points inside the tray's own box
  return `.exp__in`.** The tray is completely painted over and unclickable. You build a selection, open one car to check it, and the
  bar you were building the selection for disappears.
- **Panel over the persistent column header.** At scrollY ≥ ~1100 the panel's top (183) sits inside the sticky `.hd` band (140→192),
  and z-40 beats z-5. The written remedy is `.hd--veil { opacity: 0 }` — *make the persistent layer vanish* — and it is gated on the
  dead `hdStuck` flag (P0-2), so neither the collision nor its remedy is coherent.

Underneath all three: five unrelated z-scales in one file (70, 50, 40, 40, 6, 5, 5, 5, 3, −1) with two accidental ties; `.hd`
declared at z-index 2, 3, 4 then 5 in four separate layers.

**WHY IT MATTERS.** These are not cosmetic overlaps — two of them make a control the user is actively operating unreachable. And the
sanctioned remedy inverts the correct policy: the answer to a floating card colliding with persistent chrome is never to hide the
chrome.

**WHERE** `css:253`, `:349`, `:669`, `:762`, `:836`, `:860–863`, `:1041`, `:1257`, `:1316`, `:218`.

**RECOMMENDED PRINCIPLE.** One product-level stacking enumeration — ground → content → expansion → sticky chrome → drawer → overlay →
menu → toast — declared as tokens. Components name a tier, never a number. **Temporary planes always outrank content planes**, because
the temporary one is what the user is currently operating; **persistent layers always outrank content**, and content travels *under*
them. A tie resolved by DOM order is not a decision. A persistent element is never hidden to resolve a collision — if it is hideable,
it was not persistent.

---

### P1 — important UX or system problem

**P1-1 · The stylesheet is a changelog, not a design system** · CODE-RISK / SYSTEM · SYSTEMIC
`:root` re-opened **12 times** (css:15, 533, 598, 606, 633, 754, 930, 934, 1065, 1107, 1169, 1212) with four complete palettes left in
place. `--r-s/--r-m/--r-l` declared three times with different values, then bypassed by literals almost everywhere.
`.field { --cols }` **10+ times**, `.exp__in` **8**, `.row.open` **5** (including two complete colour reversals: focal-navy →
`#6A7285` grey), `--bento-h` **3**, `.hd`'s `top` **5**, `.cmd`'s **4**. The banners actively contradict each other: css:817 declares
*"one vertical rhythm… all start at the same x"* and css:1340/1281 break it; css:1035 declares *"part of the list, not a floating
card"* and css:1255 declares *"a popover… floating over the list"*. **This is not hygiene — it is the direct cause of P0-2, P0-4 and
P0-5.** *Principle:* a design system is a declaration, not a sediment. A component is styled once; when a decision reverses, the
reversed rule is deleted. An override layer is acceptable during exploration and is debt the moment a direction locks.

**P1-2 · The expanded vehicle is a modal in everything but the word — and every connective device was built, then deleted** · SYSTEM / VISUAL · SYSTEMIC · **owner concern B**
Modal cues present: `position: absolute; z-index: 40`, opaque, 18px radius, a 64px 360° drop shadow, its own `×` close button, covers
8 live rows, and `.field.has-open .row:not(.open) { opacity: .55 }` dims 15 more — a scrim in all but name. Modal guarantees absent:
no `aria-modal`, no focus trap, no `inert` background, background rows still clickable and focusable, and it overflows the `.field`
sheet by **903px**. Five independent cues say "separate object": an **8px gap that shows a dimmed neighbouring row between a car and
its own detail**; **16px narrower on each side** (`left: 8px; right: 8px`) so the panel's edge aligns with no column; a **360° shadow
including the edge facing the row**; **opposite materials** (grey row, white panel); and the row **stripped of its own radius, shadow
and accent spine**. The file had solved this at css:1036–1040 — three-sided inset hairlines, zero margin, next row's border removed —
and the final layer overwrote all of it. *Principle:* an expansion is a **change of state in the list, not an object on top of it** —
it shares the list's edges and column origins, reserves its own space, forms one continuous surface with its row under one shadow
envelope, and dims nothing. If a floating layer is genuinely wanted it is a different component with the full modal contract. There is
no third option.

**P1-3 · The detail grid teleports three untouched sections** · INTERACTION / SPACING-LAYOUT · SYSTEMIC · **owner concern C**
`.exp .exp__accs` is a 2-column grid of **five** cards; `.acc--open { grid-column: 1 / -1 }`. Measured on opening *Market & pricing*:
Recent comps **−435px** horizontally / +419 vertically, Specification **+435** / +361, History **−435** / +419. Worse — the opened card
widens over **240ms** while the three untouched cards move **at frame 0, unanimated**, because grid reflow is not transitionable. One
slow change and three infinitely fast ones in a single click; the eye follows the fast thing, which is the wrong thing. The panel's
`top` is also computed once and never recomputed as it grows 696 → 795 → 1535px. *Principle:* an expansion changes the size of exactly
one thing. A grid where opening one cell relocates its siblings is not a grid. Multi-column accordion fields are banned; where deep
content needs width, use a fixed-position region with exactly one section visible.

**P1-4 · The five detail sections are not peers** · SYSTEM / IA · SYSTEMIC · **owner concern C, the deeper half**
All four passes independently rejected the premise. **Merchandising health** is the exception surface — the reason the page exists.
**Market & pricing** and **Recent comps** are one decision plus its evidence and should never be separated by a grid cell.
**Specification** restates Trim and Colour — which are already *columns* — plus three hardcoded constants. **History** is a 1–5 entry
demo log. Three of the five carry "Demo" badges. So: one real payload, three impressive unconnected demos, one near-empty duplicate,
presented as five peers in a uniform grid. *Principle:* **rank by content, then compose; never let a uniform grid assign rank.** Count
the information *kinds* before choosing a container: sections that always open together are one section; a section that reproduces
data already on screen is not a section; a collapsible whose summary is more informative than its body should be a line of text. The
honest structure is two regions and one link — health always visible (it is why you are here), pricing-with-comps as one region, and
spec/history as a link to the vehicle page where the full record already lives.

**P1-5 · What persists is the arrangement controls; what scrolls away is the state** · STICKY-SCROLL / IA · SYSTEMIC · **owner concern D, the half no restyling fixes**
Permanently held (192px, ~20% of viewport): platform nav, search + Sort + view + Columns, thirteen column labels. Permanently lost
after ~150px of scroll: the **lane track** (which lane am I in) and the **scope line** (the active filter **chips** — the only place a
filter can be seen or removed — plus the result count). Scrolled 600px into a filtered list, the user can see *how* to sort but not
*what they are looking at*, and the only way to remove a filter is to scroll back up. **The file records this decision and then
cancels it:** css:1321–1326 reasons correctly that pinning the lane track would put ~270px of chrome over a 900px viewport and commits
to sticking the thin scope line instead; css:1340 reverts it to `position: static` and **nothing replaced it**. The comment was never
deleted, so the file asserts a sticky scope line it does not have. *Principle:* **persistence ranks by consequence of forgetting, not
by frequency of use.** A dealer memorises thirteen column labels in a week; they never memorise which four facets they stacked eight
minutes ago. Scope outranks arrangement. And when the implementation of a requirement fails, the requirement survives and gets a
different implementation — it does not silently become "static".

**P1-6 · The signal budget is inverted: the summary shouts, the exceptions whisper** · VISUAL / SYSTEM · SYSTEMIC
Three **dark navy cards** with radial-gradient lighting, 24px radius and shared elevation occupy 220px at the top — the highest-contrast
mass on the page — and one of them is a vanity aggregate nobody clicks. The attention meters get a two-layer neon glow plus
`brightness(1.15)` on hover and a `width` keyframe; the hero number rolls for 700ms on load and on every lane change. Meanwhile, in
the list: `.stat--ok` renders a filled ringed green pill reading **"Available" on 16 of 16 rows**; `.okmark` renders a green check for
every healthy car; a grey `--well` band is painted down the Health column for **all 359 cars**; and an actual exception — "No price" —
is a 12px pill of the same size, weight and construction as the constant green one beside it. *Principle:* **colour, mass, elevation,
motion and surface change are a budget, and the budget is spent on deviation from normal.** Anything true of every row renders as
plain text or nothing. One dark object per page, and it is the page's subject. In an operations list, **pass states collapse and fail
states expand**: six green checks become one line, and only the failures get a box.

**P1-7 · Card soup — four nested near-white surfaces, four radii, four edge treatments** · VISUAL · SYSTEMIC
`body #e5e9ef` → `.field` `rgba(255,255,255,.58)` r28 → `.rows` `#fff` r10 → `.exp__in` `#fff` r18 → `.acc` `--well` r14 →
`.acc--open` `#fff` lifted. Inside `.exp__l`, three more 16px blocks while peer content in `.exp__r` uses 14px. `.field` earns
nothing: a 58%-white translucent frame whose entire contribution is 8px of tinted margin and a radius mismatch — and its `overflow` is
`visible`, so its 28px radius does not even clip. Supporting census: **nine shadow tokens across four parallel elevation scales**
(`--el-1/2/3`, `--sh-soft/pill/ctl/card/pop/float`) with ~15 shadowed elements on one screen; radius values 999, 28, 24, 18, 16, 14,
12, 10, 9, 8, 7, 6, 5, 4, 2. *Principle:* **a surface must earn its edge.** Shadow is reserved for actual overlap; a surface that never
crosses another gets an edge or nothing. Three planes maximum. Nesting two surfaces of the same hue means one is doing nothing —
delete the outer one. Radius belongs to a **ladder tied to role**, not to the component. Not "remove all radius" — build the ladder.

**P1-8 · No type scale: eighteen sizes, five widths, and a `.caps` class that is not caps** · VISUAL · SYSTEMIC
Distinct sizes: 60, 28, 26, 24, 22, 20, 17, 16, 15, 14, 13, 12, 11.5, 11, 9.5 px (plus 34, 22, 56 in superseded layers) — with no
ratio: 14→15→16→17 are four steps inside three points while 28→60 jumps unmediated. Archivo's variable width axis is used at **84%,
86%, 88%, 92%, 94%** — five widths, one per component, with no rule linking width to role. `.caps` (12px/700/uppercase) is overridden
for `.value__h` to **16px, sentence case** — a class named for a casing that renders in the other one. `font-feature-settings: "tnum"`
is forced on `body` — flattening running prose — then ceremonially restated on ~20 selectors where it changes nothing. *Principle:*
declare a **bounded scale with named roles** (`figure`, `page-title`, `panel-title`, `data`, `meta`, `micro`) so a size cannot be
chosen by eye at the point of use. Casing is applied **by role** — uppercase for structural labels that must not be mistaken for data,
banned in the data layer. One width for data, one for display. Tabular figures are a role decision, not a global blanket.

**P1-9 · No spacing system: the most repeated relationship in the product has five different values** · SPACING-LAYOUT · SYSTEMIC
`--gap: 16px` is the **only** spacing token in 1347 lines and governs three things. Everything else is a literal chosen at the point of
writing. Measured contradictions on the same relationship: **label → value = 1, 3, 4, 5, 6px**. **Component inner inset = eight
different values** (18/26/24/26 · 16/20/20/20 · 18/26/22/26 · 14/18/18/18 · 8 · 22/24/24 · 0/16 · 8/18/6), four of them on adjacent
peers in one bento row. **Section header → content = 8, 10, 6, 8, 18.** **Control → control = 2, 3, 4, 6, 8, 10** with related controls
sometimes *tighter* than unrelated ones. **Row: thirteen tracks, one uniform 8px gap**, so between-cell (8) is barely larger than
within-cell (4–5) and the row has no groups at all. The expanded object's only spacing value — `+ 8` — lives in JavaScript, matches no
token, and the gap it creates is filled by a dimmed neighbouring row. *Principle:* **spacing is a property of a relationship, not of a
component.** Name the relationships first — workspace inset, panel inset, header-to-content, label-to-value, control-to-control,
within-group vs between-group, panel-to-panel, sticky-stack height — and give each exactly one token. Two hard rules Gen 11 breaks
everywhere: internal gaps are always smaller than the container's external gap, and **no literal in any padding, margin, gap or sticky
offset — including in JavaScript.** Do not pick final values yet; derive them from the row module and the type scale, then publish.

**P1-10 · The exception column is the most truncated thing on the page, and it clips worst on the worst vehicles** · IA / RESPONSIVE · SYSTEMIC
A vehicle can carry six flags; the row shows **two** plus a `+N` chip whose only expansion is a `title` tooltip — and with the Filters
dock open it drops to **one**. Measured at 1267px: **4 of 16 health groups overflow their box**, and because the chip sits last with
`flex-wrap: nowrap; overflow: hidden`, **the `+N` indicator is the element that gets cut** — on exactly the vehicles with the most
flags. The page degrades in proportion to how much a vehicle needs attention. *Principle:* the column a page exists for cannot be the
column that yields space. Encode a **closed** set of exceptions as a fixed slot map — six known positions, present or absent — so the
cell has constant width, position itself carries identity, and a clean vehicle reads as quiet emptiness. An overflow indicator gets a
reserved, non-shrinking slot and is the **last** thing clipped, never the first. No exception is ever disclosed only by `title`.

**P1-11 · The VIN is truncated on 16 of 16 rows, at 12px, recoverable only by hover** · VISUAL / RESPONSIVE · SYSTEMIC
Measured at 1267px: **16/16 VINs**, **12/16 Trims**, **4/16 Models** truncated. The VIN is not text — it is a fixed-length 17-character
identifier whose purpose is exact comparison and which is the most-copied string in the workflow (Carfax, auctions, title work).
Rendered at 12px mono and ellipsed, it **looks like data and cannot be used as data**, and a truncated VIN invites a misread in a way
an absent one does not. Trim is the second failure: the data shows it is dealer free text ("Only 953 Miles Serviced", "LS3 525hp
Restomod Coffman") — the discriminator between two otherwise identical cars — in a 104px track. *Principle:* **identifiers are codes,
not text: they fit completely or they are not shown.** A field that is copied rather than read must be complete and selectable, or it
is not a cell — it is a copy action. A column carrying free text of unknown length gets a two-line allowance or its full value must be
reachable without hover.

**P1-12 · A 13-column data grid with no table semantics; sorting is mouse-only and has two divergent controls** · ACCESSIBILITY · SYSTEMIC
`.rows` / `.hd` / `.row` are all `div`s with zero table roles (the only `role` in the document is `group`, twice). Sortable headers are
`<span data-sort>` — not focusable, not buttons, no `aria-sort`; the current sort is a lightness step plus an arrow glyph hardcoded
onto Age only. Column sorting is therefore unreachable by keyboard and unreadable by a screen reader. The same job is done a second
time by the Sort popover, which shows direction as text and covers one field the headers do not ("Attention first") — two controls,
different capabilities, one shared state. *Principle:* tabular data declares itself as tabular, with current sort exposed on the header
rather than inferred from an arrow. One job, one control: a menu is a *view* of the same control, not a second implementation.

**P1-13 · The row is the disclosure trigger but is not a control** · ACCESSIBILITY · SYSTEMIC
`.row` is a `div` with `tabindex="0"` and an `aria-label`, containing a checkbox, a link and four buttons. It has no `role`, no
`aria-expanded`, no `aria-controls`, and **no Space handler** — the one key a screen-reader user will press on something announced as
actionable. The panel it controls has no `aria-labelledby` back to it and focus is never moved into it. Per-row actions are
`display: none` until `:hover`/`:focus-within`, so they cannot be discovered without a pointer. The page proves it knows the correct
pattern fifty lines away: `acc()` writes `aria-expanded` + `aria-controls` + `inert`. *Principle:* whatever expands an object must
**be** a disclosure control with the full contract — role, expanded state, a named relationship to the region, keyboard parity with a
native button, and a defined focus destination on open **and** on close. A container that is simultaneously a tab stop and a host for
six other tab stops is not a control.

**P1-14 · The bulk-action workflow has no keyboard layer and no safety layer** · INTERACTION · SYSTEMIC
Six bulk actions over 359 vehicles with: no select-all in the header, no shift-click range selection, no announced count, focus
destroyed after every tick (P0-6), and `Delete…` in the same row as Export and Stickers distinguished **only by colour**. In the row,
four 27×30px icon buttons sit adjacent and the fourth is *Delete vehicle*. Nothing models a confirmation or an undo. *Principle:* any
surface that can act on many records owes three things before it ships — a way to build the set (select-all in scope, range selection,
an accurate announced count), **spatial** separation of destructive actions from routine ones, and a reversal path. Per-row destructive
actions belong in an overflow, not in a sub-30px icon cluster.

**P1-15 · One job, two controls, three times over** · SYSTEM · SYSTEMIC · **the direct answer to owner concern E**
In one page: **five** open/close idioms (hover-or-click megamenu with `aria-expanded`; `[data-pop]` popover with no expanded state and
no role; accordion done correctly with `inert`; a sticky dock toggled by a button with no state; an absolutely-positioned panel with no
ARIA at all). **Three** selected-state idioms (`aria-pressed`; a bare `on`/`--on` class with no ARIA; `aria-current`) — and the six
attention filters ship with **no `aria-pressed` at all** until JS touches them. Price is filterable in two places with unequal
capability (both min/max pairs are **inert**); Year likewise; Sort twice; column visibility has two owners. *Principle:* one job, one
control, with **views** of it rather than reimplementations — and if two entry points exist they expose identical capability and
identical state. One vocabulary for "expanded", one for "selected", one for "current", chosen once at product level. Inert duplicates
teach the user the control is broken.

**P1-16 · Opening the Filters panel silently deletes a data column, via a positional selector** · IA / CODE-RISK · SYSTEMIC
`.app.dock-open` collapses Trim, Colour **and Status** to 0px tracks with `visibility: hidden`, with no affordance telling the user a
column was dropped — while the Columns menu still lists Status as "Showing". The selector is
`.app.dock-open .field .hd > span:nth-child(10)`; the Health column's tint uses `nth-child(11)`. The Columns menu offers eight more
columns and *"All 30 columns…"*. **The advertised feature is structurally blocked:** adding one column moves the Health tint onto the
wrong data and the Status hide onto a visible column. *Principle:* **columns are data with identity, never ordinals.** Tracks, header
cells, per-column styling, hide-on-narrow and drop order all derive from one ordered column definition. A contextual panel may change
the *density* of the primary object; it must never change which fields exist — and if width genuinely forces a field out, the user is
told.

**P1-17 · There is no authored layout below ~1200px** · RESPONSIVE · SYSTEMIC
Two width breakpoints exist in 1347 lines: 1360 (hides the brand wordmark) and 1320 (one hand-written `--cols` string). The row grid is
13 tracks, 11 of them fixed px; below ~1320 it sums to roughly 1182px minimum, and both `.rows` and `.field` are `overflow: visible`,
so it will exceed its container rather than adapt. `.cmd` is a nowrap flex; `.bento` floors at ~812px before its third track — the six
attention buttons — collapses. There is no tablet or phone story, not a degraded one, none. A dealer's workstation is frequently a
1366×768 laptop, and dealers check inventory on a phone standing next to the car. *Principle:* a data table's responsive story is
**column priority, not scaling**. Each column declares a minimum legible width, a wrap/truncate rule and a rank in the yield order; the
visible set at any width is then derived and reviewable, and the drop is visible to the user.

**P1-18 · Fifteen live rows are dimmed below AA, and their legibility is gated on hover** · ACCESSIBILITY · SYSTEMIC
`.field.has-open .row:not(.open) { opacity: .55 }` dims 15 rows that remain in flow, clickable, focusable and tabbable; body text at
6.34:1 lands near 3:1 and the exception tags go with it. The fix offered is `:hover { opacity: 1 }` — hover it to read it. Worse, under
an opaque z-40 card covering 8 of them, a user can hover a partly visible row back, click it, and trigger the blank-then-relocate
switch (P1-19); keyboard focus can land on a control the panel is painting over. *Principle:* emphasis is achieved by **raising the
subject, not degrading legible interactive content.** Content is either inert and properly scrimmed, or live and fully legible — never
live at 55%. If a surface is modal enough to dim what is behind it, it is modal enough to make it inert.

**P1-19 · Switching cars is 200ms of nothing, then the panel reappears somewhere else** · INTERACTION · SYSTEMIC
`showVehicle()` on an already-open panel removes the open class and `setTimeout(go, 200)` — unconditionally, including under
`prefers-reduced-motion` where the transition is already 0.01ms. The 160ms fade runs, 40ms of dead time follows, then `render()`
**destroys and rebuilds the DOM** and positions a new panel at a new `top`. No scroll, no shared element, no directional cue. Because
the class is added in the same frame as insertion with no layout flush, the enter transition frequently does not run at all — so the
file pays a 200ms delay for an exit fade on an element it then throws away, and gets no entrance in return. *Principle:* a replacement
is a **transition, not a close followed by an open**. State changes are driven by transition completion or immediate commit, never by a
hardcoded duration a second declaration can contradict. Reduced motion is a *shorter path to the same state*, not the same wait with
the animation removed.

**P1-20 · The panel's position is a one-shot measurement of a page that keeps moving** · CODE-RISK · SYSTEMIC
`ex.style.top` is computed once inside `render()`. The only resize listener recomputes the two dead stuck classes and nothing else. So
resizing the window, opening an accordion (696 → 795 → 1535px), opening the dock (which re-solves the row grid), or a font load all
leave the panel detached from the row it belongs to. Because `.exp-space` is `display: none`, the panel contributes nothing to
`.field`'s height — which is why it overflows the sheet by 903px. *Principle:* an object positioned by measurement owes a re-measure on
every event that can change the measurement — which is the argument for not positioning it by measurement at all. An expansion that
belongs to a row belongs in that row's flow, so the layout engine owns the relationship and there is nothing to keep in sync.

**P1-21 · The page does not resolve** · STICKY-SCROLL · SYSTEMIC
With all five accordions open the panel is **1535px tall and overflows the `.field` sheet by 903px**, painting over the pagination
footer and out onto the page ground with the whole left column empty white for ~1200px. **At max scroll the viewport contains only the
panel** — no rows, no column header, no command band, no footer, no scope, no count. The page's terminal element and its deepest
content occupy the same space with no relationship. *Principle:* a page's last screen names the page. An expansion either reserves its
space in the flow — so the footer stays below it — or it is a separate surface with its own frame and its own close. Never a
free-floating card that outgrows the document.

---

### P2 — refinement

- **P2-1 · Dead controls are visually identical to live ones.** No handler exists for the Rows/Gallery/Photos view switcher
  (`aria-pressed` hardcoded, never changes), every pagination button, every Columns item including *"All 30 columns…"*, all six tray
  actions, the dock's prev/next vehicle buttons, Inline edit / Carfax reports / Export / Add vehicle, all seven panel actions, both
  min/max pairs, Set price and Upload photos — roughly a dozen fully styled, fully stateful, completely inert controls. A client
  clicking Gallery and getting silence concludes the build is broken. *This is the mirror of P0-7: a prototype's honesty budget covers
  capability as well as data.* Declare live / staged / stub, once, visibly.
- **P2-2 · Three competing result counters and an inert pager that contradicts them.** "Available · 359 vehicles" / "1–16 shown" /
  "1–16 of 359"; two of the three scroll away. The pager shows 23 pages regardless of filtering, and "16 per page" is static text.
  (The recorded target is 70 per page — the 16 is demo-data shape, not a decision.) *One authoritative count, stated once, in the layer
  that persists. Filters, sort, page and the open record are addressable state and belong in the URL.*
- **P2-3 · The platform bar jumps 16px on the first scroll tick.** `.top` is a glass panel inset 16px at rest and `sticky; top: 0`, so
  it snaps flush the instant scrolling starts. The "floating panel" identity exists for exactly one scroll position.
- **P2-4 · The hero counter animates a fact for 700ms.** `countTo` rolls 0→359 on load and on every lane switch, so the page's most
  prominent number reads 0, 84, 210, 312 before it is true. Ironically it carries the file's only hand-written reduced-motion guard.
- **P2-5 · A 650ms `width` keyframe plus a neon glow on the six most-used controls.** `meter-in` re-draws the attention meters from
  zero on every hover — animating a *measurement*, so for ~400ms the bar shows a false value — on the page's six primary entry points.
  *Never animate a value that encodes data; hover changes a control's frame, not its measurement.*
- **P2-6 · Sixteen thumbnails transition `width`/`height`**, triggered by opening the Filters dock — a layout animation on an event
  that has nothing to do with photographs, drawing the eye to the images exactly when attention should move to the filters.
- **P2-7 · The empty state contradicts the pager and mis-describes an empty lane.** One line of grey text under a live 13-column
  header, beside `0 of 0` and a pager claiming 23 pages; copy is always *"No vehicles match these filters"* even when no filter is set.
  The only exit is Clear all — four stacked facets must all be discarded — and the chips that caused the zero are off-screen at any
  scroll.
- **P2-8 · The lock state is a rumour.** "Being edited by another user" is a non-focusable 20×20 padlock with a `title` and nothing
  else: no holder, no time, no constrained actions. The row stays fully clickable and every panel action behaves as if the vehicle were
  free. *A conflict state names the holder and constrains the actions it conflicts with, or it is decoration.*
- **P2-9 · Escape has no focus destination.** The Escape ladder (menus → vehicle → dock) is genuinely good design, but closing anything
  returns focus nowhere — and for the vehicle it cannot, because the close path rebuilds the list. The `⌘K` badge on the global search
  has no handler (`/` does). *A keyboard hint rendered in the UI is a promise.*
- **P2-10 · Megamenus open on hover over a dense operations surface**, and only the click path updates `aria-expanded` — so a
  hover-opened menu reports itself closed and the chevron rotates with no state behind it.
- **P2-11 · One fact, three prominences.** "No price" is a grey `—` in the Price cell *and* a tag in Health — but the tag budget is 2 +
  `+N`, so on a four-flag car it may be shown, collapsed into `+2`, or clipped entirely. The page's largest exception class (133 of
  359) has a prominence that depends on how many *other* problems the car has.
- **P2-12 · Functional text below the floor, with `title` as its only fallback.** 9.5px tracked uppercase (lease term), 11.5px (price
  qualifiers), 11px (VIN with the dock open), 12px (VIN, facet labels, tags), 13px (column header). Contrast passes everywhere; **size
  does not.** *A value that will not fit above the floor belongs in the expanded object, or the cell earns width — the 9.5px lease
  label should not exist at any size.*
- **P2-13 · Three conventions for absence** — `<i>—</i>` for no trim, `—` for no price, "Not recorded" for mileage. In inventory
  operations *empty*, *not applicable* and *not yet fetched* are operationally different; here they are three renderings with no rule.
  Related: a missing thumbnail file has no `onerror` and no CSS fallback, so a broken path renders a 92×60 void rather than the
  designed `.th--none`.

### P3 — optional exploration

- **P3-1 · Dead machinery still ships and still runs.** `.exp`'s accordion model (`grid-template-rows: 0fr→1fr`, 240ms) is overridden
  by `position: absolute` but its transition, its `overflow: hidden` wrapper, `.exp-space` (still injected into the DOM) and the 200ms
  `setTimeout` round-trip all remain. `vehicleFoot()` is defined and never called. `.lot` grid rules target an element that no longer
  exists. `.app.veh-open` is never set. `S.expNow` is written twice, never read. The dock's prev/next buttons are in the HTML and
  hidden at runtime.
- **P3-2 · Accordion state is shared across two different objects.** One `S.acc` map holds both the vehicle inspector's sections and
  the Filters dock's facets, namespaced only by prefix; `applyFq()` forces sections open/closed without writing back, so after a filter
  search the DOM and the model disagree and the next `render()` reasserts the old state.

---

## FINDINGS BY THEME

**INTERACTION / STICKY / SCROLL** — P0-1, P0-2, P0-8, P1-2, P1-3, P1-5, P1-18, P1-19, P1-20, P1-21, P2-3, P2-4, P2-5, P2-6.

*The scroll journey, end to end.* **0→1px:** the platform bar loses its inset and snaps flush. **0→~150px:** the only complete state
the page ever shows — bento, lane track, command band, scope line with chips, column header, two rows. **~150→~350px:** the state
layers leave and never return; the lane goes, the chips go, the count goes, and both sticky layers arrive at their positions in their
at-rest costume because their engaged classes are dead. **~350px→end — the long middle, where all the work happens:** 192px of
permanent chrome holds search, sort, view, columns and thirteen labels, while **nothing on screen says which lane is selected, which
filters are active, or how many results there are.** At 70 rows per page this stage is roughly 5.3 screens long. **Any click on a row:**
nothing perceivable. **Open + scrolled up:** the z-40 panel paints over the sticky column header the whole system exists to preserve.
**Open + accordions:** the panel outgrows the sheet by 903px and the last screen contains nothing but the panel.

*Continuity — the eye loses the object five times:* list → selected (total loss, the object appears below the fold); selected → its own
detail (five cues say "two objects"); one accordion open (three untouched cards jump 435px at frame 0 while the touched one eases over
240ms); car A → car B (dissolve, 200ms of nothing, a different object elsewhere); open → scrolled (the one fixed landmark is painted
over). Plus a sixth, not about the vehicle: filtered → scrolled, where the user loses the object "my current query".

**VISUAL / HIERARCHY** — P1-6, P1-7, P1-8, P0-4, P2-12. The page reads as generic blue SaaS glass, and it got there by **overwriting**
two more distinctive directions whose rationale is still narrated in the comments (Gen 8's warm green-grey with bottle green `#24614a`;
an explicit graphite/bottle-green layer with `--accent: #1e4634`). Dead tokens `--accent`, `--accent-fill`, `--accent-soft`,
`--accent-line`, `--zone`, `--zone-line`, `--glass-edge` are defined and unused. Six hues live simultaneously in the row grammar, so a
single row can show a blue stock pill, a green status pill, a green OK mark, an amber tag, a violet tag and a colour-coded age bar —
colour is the page's default texture rather than its signal. Two smaller tells: `.attn__h .s` reads *"tap to filter the list"* — an
instruction line standing in for an affordance, in touch vocabulary, in a mouse-driven back office (the author diagnosed and removed
exactly this failure for `.exp__accs::before` and left this one); and in the age mix the bar widths (56/88/100/31%) and the printed
percentages (20/32/36/11%) are two encodings of the same quantity that disagree on screen.

**SPACING / SURFACE** — P1-7, P1-9, P1-2. See the measured relationship table in P1-9. The single clearest proof that no system exists:
**label → value takes 1, 3, 4, 5 and 6px** across peer components. The clearest proof that surfaces do not encode meaning: a `--well`
grey band is painted down the Health column for **all 359 cars**, spending the strongest device available — a surface change — on a
constant, while `.hd` (`#ffffff`) sits on `.rows` (`#ffffff`) with only a hairline between the column header and the data it labels.
The page has separation where things belong together and none where separation is the element's whole job.

**RESPONSIVE** — P1-17, P1-10, P1-11, P2-12. No horizontal page overflow at any width tested, but heavy truncation begins well above
the laptop widths dealers actually use, and there is no authored behaviour below ~1200px.

---

## SYSTEM VS LOCAL

**Systemic (will recur on All Leads, Single Lead, Single Vehicle, dealer and employee pages):** P0-1 through P0-8 (all eight), P1-1
through P1-17, P1-19, P1-20, P1-21, P2-1, P2-2, P2-12, P3-2. These are contracts the product does not have — open-anchor, expanded
object, layer ladder, sticky derivation, column identity, provenance, focus ownership, list identity.

**Local (Gen 11 only, though several expose a systemic pattern):** P1-18 (the dimming rule), P2-3, P2-4, P2-5, P2-6, P2-7, P2-8, P2-9,
P2-10, P2-11, P2-13, P3-1.

**The honest answer to concern E:** nothing in the *concept* blocks a single product-wide system. **This file blocks it.** There is no
ladder to generalise — only a sediment of point fixes. A system extracted from this file would inherit the sediment. The right move is
to derive the system from the *decisions* the file records — several of which are good, and several of which were abandoned without
being replaced — and then rebuild against it.

---

## CANDIDATES FOR A FUTURE DESIGN.md

**Not to be written yet. These are the principles proposed for review and approval.** Ordered by dependency: each one, if it existed,
would close findings named above.

1. **Token authority.** One token layer is the sole source of truth — palette, type scale, spacing scale, radius ladder, elevation
   ladder, durations. A literal colour, size, spacing value or sticky offset in a component is a build error, in CSS **and** in
   JavaScript. Every other candidate depends on this. *(P1-1, P0-4, P0-5)*
2. **Sticky region contract.** An ordered, named stack whose offsets are **derived** from the measured heights of the layers above it,
   expressed once, so the total chrome budget is a value the rest of the page can reason about. A scroll state read by JS reads from the
   same source the CSS positions from. Both the at-rest and the engaged state are authored. *(P0-2)*
3. **State-persistence rank.** Per persistent element, a declared answer to: *can the user reconstruct this from what is on screen?*
   What cannot be reconstructed (active filters, current scope, result count) outranks what can (column labels). Sticky slots are
   allocated by rank, not by DOM order. *(P1-5)*
4. **Stacking ladder.** One enumeration — ground → content → expansion → sticky chrome → drawer → overlay → menu → toast — as tokens.
   Components name a tier, never a number. Temporary planes outrank content planes; persistent layers outrank content and content
   travels under them; a persistent layer is never hidden to resolve a collision; no ties. *(P0-8)*
5. **Expanded-object contract.** Three legal modes and no fourth: *in-flow* (reserves space, shares the owner's edges and column
   origins, one continuous surface under one shadow envelope, no scrim, no z-index above chrome, no close button of its own), *beside*
   (a bounded region with its own frame), *over* (a real dialog with scrim, `inert` background, focus trap, `aria-modal` and a defined
   dismissal contract). Opening brings the trigger to a named anchor under the persistent stack, travelling the minimum distance;
   replacement is a transition, not close-then-open; closing restores the reading position. *(P0-1, P1-2, P1-19, P1-20, P1-21)*
6. **Disclosure contract.** Anything that expands something is a real control: role, `aria-expanded`, `aria-controls`, keyboard parity
   with a native button, and a defined focus destination on open **and** close. *(P1-13)*
7. **Section-set rule.** The choice between accordion, tabs and a single column is made by one test: **an accordion is legal only where
   opening one section cannot relocate another.** Multi-column accordion grids are banned. And rank by content before composing —
   count the information *kinds* first. *(P1-3, P1-4)*
8. **Column definition.** Columns are data with identity, rank, a minimum legible width and a truncation policy. Tracks, header cells,
   per-column styling, hide-on-narrow and drop order all derive from one ordered list; **no rule addresses a column by ordinal**; a
   dropped column is reported to the user; identifiers are complete-or-absent and carry a copy action. *(P1-10, P1-11, P1-16, P1-17)*
9. **Exception encoding.** A closed set of exception flags renders as a fixed slot map of constant width — every flag always visible,
   position carrying identity, a clean record reading as quiet emptiness. The overflow indicator gets a reserved non-shrinking slot and
   is the last thing clipped. No exception is ever disclosed only by `title`. *(P1-10, P2-11)*
10. **Signal budget.** Colour, mass, elevation, motion and surface change are reserved for **deviation from normal**. Anything true of
    every row renders as plain text or nothing. Pass states collapse; fail states expand. One dark object per page, and it is the
    page's subject. A product-wide list of state hues with exact meanings, and a rule that a constant never gets one. *(P1-6)*
11. **Depth model.** Three planes (workspace / content / temporary), one radius and one elevation per plane, shadow reserved for actual
    overlap, and no two surfaces of the same hue nested. *(P1-7)*
12. **Type scale with named roles.** A bounded scale mapped to roles (`figure`, `page-title`, `panel-title`, `data`, `meta`, `micro`),
    one width for data and one for display, casing applied by role, and a functional-text floor below which a value moves rather than
    shrinks. *(P1-8, P2-12)*
13. **Spacing by relationship.** Named relationships each own exactly one token; internal gaps are always smaller than the container's
    external gap. *(P1-9)*
14. **List identity.** Rows are addressable objects patched in place; focus, selection and scroll survive every state change; one polite
    live region owns "N results, M selected". *(P0-6)*
15. **Focus ownership.** `outline` + offset belongs to the focus state alone, stated once at product level; no component sets or removes
    it; elevation never shares the property. *(P0-5)*
16. **One job, one control.** Two entry points to a job expose identical capability and identical state. One vocabulary each for
    expanded / selected / current. Exactly-one-of-a-set is a radio or tab pattern. *(P1-15, P1-12)*
17. **Provenance.** Three tiers — derived / illustrative / not connected — applied **per figure**, marked at the number, inside the tab
    stop. And the same discipline for capability: live / staged / stub, declared once and visible. *(P0-7, P2-1)*
18. **State inventory.** Every data surface ships eight states: loading, empty-by-nature, empty-by-query, partial, error,
    conflict/locked, over-capacity, happy path. Empty-by-query states the cause and offers the cheapest single release; conflict names
    the holder and constrains the actions it conflicts with. *(P2-7, P2-8, P2-13)*
19. **Motion contract.** Two durations and one easing; **data never animates**; motion's job is to show what changed when the user
    acted; reduced motion is an authored shorter path to the same state, not a global kill switch standing in for a static design.
    *(P2-4, P2-5, P2-6, P1-19)*
20. **Bulk-action contract.** Set-building (select-all in scope, range selection, announced count), spatial separation of destructive
    actions, and a reversal path — confirmation for the irreversible, undo for the rest. *(P1-14)*

**Two things to preserve rather than systematise:** the **Needs-attention queue** as a pattern — six counts that filter the list on
click is the correct shape for exception hunting, and it should never be reduced, merged or demoted to a menu; and the **lane rail** as
a segmented scope control, where the pill idiom is genuinely correct. Both need their *presentation* and *wiring* fixed, not their idea.

---

## DISAGREEMENTS BETWEEN THE PASSES

Recorded rather than resolved, because the disagreements are where the real decisions are.

1. **Restore Gen 10's top anchor — or not?** Passes 1 and 4 say restore it; it is "the cheapest fix available" and repairs four findings
   at once. **Pass 3 dissents:** moving the page under the user's click is *also* a violation, because the user chose that scroll
   position deliberately. Its narrower invariant: *the detail must be perceivable in the viewport the click happened in* — which two of
   its four structural models satisfy with **no scroll at all**. Pass 3 asks that concern A be graded as "the current model fails", not
   as "Gen 10 was right". **All four agree the current behaviour is broken; they disagree on whether the remedy is a scroll.**
2. **Should the panel become an honest modal?** Passes 1, 2 and 3 all reject this explicitly and independently — hardening the modal
   semantics would make the wrong spatial model permanent. Pass 1 puts it as a fork (*inline object* or *overlay inspector*, no third
   option) and notes the workflow forces the inline answer; pass 3 puts it as a three-way contract and says "over" is the one mode this
   page should not choose. **No pass argues for the modal.**
3. **Priority of the accordion teleport.** Pass 4 grades it P0, pass 2 grades it P2, passes 1 and 3 grade it P1. Pass 3 adds a further
   dissent: it should not be graded as a *layout* finding at all, because fixing the count (five peers → two regions and a link) makes
   the layout problem disappear without choosing a layout mechanism. **Filed here as P1-3 (the mechanism) plus P1-4 (the count).**
4. **When to fix dark theme.** All four call it P0. **Pass 3 dissents on sequencing:** do not fix it on top of this CSS, because doing
   so adds a seventh override layer and guarantees a Gen 12 of the same kind — dark theme is a *reason to consolidate the stylesheet*
   and should be scheduled with that consolidation, not before it. Pass 2 agrees the stylesheet is the cause. **This is the single most
   consequential disagreement for the fix order below.**
5. **Row height and density.** An expected recommendation to drop to a ~40px text row is pre-emptively rejected by pass 2: photo
   presence and the two-line identity are real operational content. The fault is the *direction of causation* — a CSS layer titled
   "larger thumbnails" set the row height. Decide the module first, then fit the image, which lands nearer 56–60px than 40; the win
   comes from group gaps and truncation policy, not from maximising rows per screen.
6. **The bento.** Pass 2 expects it to be dismissed as a marketing dashboard and defends Needs-attention strongly. Pass 3 defends the
   queue even more strongly but attacks its *placement* — a top banner separated from the list it filters by the entire command band —
   and argues moving it adjacent to the list, or into the lane track, is a bigger improvement than anything that could be done to it
   where it stands. Pass 1 notes the bento is "the most finished thing on the page and the least load-bearing" and warns it will absorb
   attention that belongs to the row grid, the sticky stack, the panel and the dark theme.
7. **12px type.** Pass 1 flags it against a 14px floor. Pass 2 disagrees with blanket scaling: some strings need *more* than 14px and
   should stop truncating (VIN); others should **cease to exist** rather than grow (the 9.5px tracked lease label). A floor constrains
   text that must be read; it is not a licence to scale the page up two points and lose the density an ops list needs.
8. **Uppercase.** Pass 2 partly dissents from a blanket ban: uppercase is correct for the column header row, whose whole job is to not
   be mistaken for data. What must go is uppercase as a *voice for content*. Apply casing by role.
9. **Radius.** Pass 2 rejects standardising on one value — one radius everywhere is itself a named AI-default tell. Build a ladder tied
   to role so radius communicates what kind of thing you are looking at.
10. **Sortable-header affordance.** Pass 2 rejects putting an arrow on all 13 headers as 13 units of noise; the distinction belongs in
    the header cell's resting treatment, with only the *active* sort made unmistakable.
11. **The Health column tint.** Pass 2 rejects it outright as a surface change spent on a constant; it would make it conditional on the
    row having flags or remove it. No other pass defended it.
12. **"Light contrast passes and the console is clean, so the page is healthy."** All four reject this explicitly. A clean console says
    nothing about whether the design's intent is *installed* — roughly 30 lines of the sticky hierarchy are switched off by two stale
    numbers with no error anywhere, and the dark theme renders the exception queue at ~1.1:1 while persisting that state.

**One structural note from pass 3, recorded because it reframes the brief rather than answering it:** three of the five detail sections
are unconnected demo data and one duplicates the row. If the market integration never connects, the panel has been composed around
furniture — which makes "what is the inline detail *for*?" a product question worth settling before any layout work. Pass 3's answer,
offered for argument rather than adoption: the inline detail is for **triage** (is this fixable from here? then fix it), and the full
record belongs on the vehicle page, which already exists and is already linked from the stock number.

---

## PROPOSED ORDER OF FIXES

Sequenced by dependency, not by severity. Nothing here is an instruction to build — it is the order proposed for approval.

**Stage 0 — settle two questions before touching anything.**
(a) Which **spatial model** does a selected vehicle use: in-flow expansion, a bounded region beside the list, or navigation? Every
sticky, layer, spacing and composition decision below depends on the answer. (b) Is the **market/comps integration** real? If it is
not, the panel is composed around three demo sections and P1-4's restructure is the first move, not a later one.

**Stage 1 — consolidate the stylesheet (the disagreement in §4 lands here).** One token layer as sole authority; delete every
superseded layer, every dead rule, every unused token, every positional selector. This is not hygiene: **P0-2, P0-4 and P0-5 cannot be
fixed reliably on top of the current file**, and three passes said so independently. Everything after this stage is cheap; everything
attempted before it adds a seventh layer.

**Stage 2 — truth.** Wire the lane control or visibly stage it (P0-3). Apply provenance per figure, deriving from the loaded demo set
wherever possible (P0-7). Declare live / staged / stub for every control (P2-1). One authoritative count (P2-2). *These are the findings
that damage the client's trust in the review artefact itself, and they are independent of every design decision above.*

**Stage 3 — install the systems that are already half-written.** Derive the sticky offsets and switch the engaged states on (P0-2).
Declare the stacking ladder and resolve the three collisions (P0-8). Restore focus ownership to `outline` (P0-5). Make the list survive
its own updates and announce itself (P0-6). Fix dark theme, which by now is mostly a consequence of Stage 1 (P0-4).

**Stage 4 — the object.** Implement the chosen spatial model (P0-1, P1-2, P1-19, P1-20, P1-21). Restructure the detail by content rank
and remove the reflowing grid (P1-3, P1-4). Give the row a real disclosure contract (P1-13).

**Stage 5 — the list.** Column identity and priority order (P1-16, P1-17). Exception slot map and the `+N` reserved slot (P1-10).
Identifier policy for the VIN (P1-11). Table semantics and one sort control (P1-12). Bulk-action safety (P1-14). Stop dimming live rows
(P1-18).

**Stage 6 — composition, on a page that finally behaves.** Signal budget (P1-6), depth model (P1-7), type scale (P1-8), spacing
relationships (P1-9), motion contract (P2-4, P2-5, P2-6), and the identity question the comments still describe but the code abandoned.

**Stage 7 — the remaining P2s and P3s**, and only then propose `DESIGN.md` from what the rebuild actually proved.

---

*End of audit. No source file was modified; `git status` on the repository is clean apart from this report. Gen 12 was not created,
Gen 10 was not modified, nothing was pushed, and no finding was auto-fixed.*
