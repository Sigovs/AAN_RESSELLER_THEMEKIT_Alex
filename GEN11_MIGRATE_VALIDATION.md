# GEN 11 — ALL VEHICLES · MIGRATE VALIDATION (Stage 1 foundation)

**Subject** `pages/dealer/all-vehicles-gen11.{html,css,js,data.js}` (CSS 1347 lines · JS 458 · HTML 235)
**Reads against** `GEN11_AUDIT.md` (2026-09-27)
**Date** 2026-09-27 · **Status** VALIDATION ONLY. No HTML/CSS/JS/data file was modified. This is the only file written.
**Method** project-local `ui-design` skill, **MIGRATE mode**, as far as the brief allows:
Step 1 (audit) reused `GEN11_AUDIT.md` instead of re-auditing. Step 2 (extract the dominant patterns) was run as a
token/class/z-index census of the source plus a headless Chromium probe (Playwright, since the chrome-devtools
browser was locked by another session) at 1280 / 1366 / 1440 / 1920. Step 3 (write `design-system.md`) was
**deliberately not run**, because the brief forbids new files and the tokens are not settled yet. Step 4 (phase plan)
was re-cut for this codebase. The skill's default order ("Phase 1 CSS variables → Phase 2 atoms → Phase 3 layouts")
does **not** fit Gen 11 as written. §7 explains why.

**Locked decisions honoured, not reopened:** Gen 11 stays the working version; no Gen 12; the selected vehicle
becomes an in-flow contextual workspace under a predictable top anchor (not a modal, popover or absolute card);
Market/Pricing + Comps stay as a demo / not-connected concept; Needs Attention, the lane rail, the inline detail and
the dense list are preserved.

---

## 1. MIGRATION VERDICT

**Doing the foundation first is correct.** The file has no single current state to build on, and three of the P0s
(sticky, dark, focus) are caused by source order rather than by design. So any fix made before the file is
consolidated becomes a thirteenth layer.

**The A–J order needs three changes:**

1. **Stage 0.5, a measured baseline, has to come before A.** The consolidation can only be declared "safe" if
   nothing that currently renders changes by accident. Today there is no reference to compare against. Several
   rules that look dead are still producing visible output (§6, V1/V2/V5), and several classes that look dead are
   built at runtime by JS (§5, R6).
2. **F (stacking ladder) moves up, ahead of G and H.** The ladder does not need the in-flow expansion. Once `.exp`
   sits in the tier it will occupy in-flow (content, below sticky chrome), two of the three P0-8 collisions go away
   with zero geometry change, and the `.hd--veil` mechanism can be deleted rather than repaired.
3. **I (theme tokens) cannot mean "dark works" in Stage 1. It has to include gating dark off.** Measured: in
   `data-theme="dark"` today, `--sheet` is `#ffffff`, `--ink` is `#0d1320` and `--ground` is `#e5e9ef`. Every token
   resolves to its light value, and only `color-scheme: dark` flips. The cause is that the `[data-theme="dark"]`
   block (css:44) and the later `:root` blocks (css:1169, 1212) have **equal specificity**, so the later `:root`
   wins on `<html>`. The moment A/B collapses the `:root` blocks into one block placed *above* the dark block (the
   natural order), the orphaned Gen 8-era dark palette **comes back to life** over surfaces that are still painted
   with light literals. That would produce a new half-dark state, and `localStorage['aan-theme']` is shared with the
   Gen 8/9/10 pages and `all-leads-gen10`, so users will arrive in it. Stage 1 must either delete the dark block or
   gate it. It must not reorder it.

**Stage 1 must also stop being "no visible change".** Two current defects fall on your target widths and inside
Stage 1's own work (the column definition and the focus ring). They should be fixed there, not preserved:

- 1366px horizontal overflow (V3).
- The invisible lane focus ring (V2).

---

## 2. CONFIRMED STAGE 1 ITEMS

| # | Item | Status | Tied to |
|---|---|---|---|
| A | Consolidate the stylesheet | **CONFIRMED.** Method: resolve every selector to its *currently rendered* declaration, then delete the losing declarations. Do not rewrite by banner, because banners lie (css:1321 claims a sticky scope line that css:1340 cancels). | `.field` ×19 `--cols`, `.row.open` ×9 layers, `.exp__in` ×12, `.hd` top ×5, `.cmd` ×9 |
| B | One authoritative token layer | **CONFIRMED** (light only, see I). | 12 `:root` blocks → 1 |
| C | Consolidate duplicated component definitions | **CONFIRMED**, except the two quarantined families in §8 (expansion, `dock-open`). | `.btn` (146 → 1077 → 1116), `.facet__b` (238 → 1085 → 1120 → 1239), `.seg*`, `.lane*`, `.value/.attn`, `.focal` |
| F | One stacking ladder | **CONFIRMED, and moved earlier.** | 16 z-index declarations, 10 distinct values, ties `.sub` 5 = `.hd` 5 = `.tray` 5 |
| G | Sticky dimensions from one source | **CONFIRMED**, but only the measurement half (see §3). | js:449–450, css:1346–1347, `--top` |
| J | Outline-based focus | **CONFIRMED**, plus a fix the audit missed (V2). | css:74 |

Also confirmed from the audit's Stage 1 list:

- **Delete unused tokens.** Census: `--accent*` (4, overridden at 1204–1207; targets `.ring__a`, `.gauge__a`,
  `.spark` and `.ar--ok`, none of which exist), `--glass-edge`, `--zone`, `--zone-line`, `--r-sheet`, `--sh-float`,
  `--lot`, `--lot-strip`, `--cmdh`, and `--hdh` (declared 48, rendered 52). `--sh-pop` is used at css:1261 but never
  declared (the fallback is always taken).
- **Delete provably dead code.**
  - CSS: `.lot`, `.id / .id__n / .id__m / .id__vin`, `.spec / .spec__t / .spec__c`, `.c-spec`, `.cmd__sp`,
    `.scope__sp`, `.app.veh-open` (css:597), `.ring__a / .gauge__a / .spark / .ar--ok`, `.vf` and `.pop--up` (only
    reachable from `vehicleFoot()`, which is never called), `.facet__b--icon`, `.rows::-webkit-scrollbar`,
    `.lot::-webkit-scrollbar`.
  - JS: `vehicleFoot()` (js:307–313), `S.expNow`, and the `#dock-nav` prev/next buttons (hidden at runtime, no
    handler).

---

## 3. ITEMS TO MODIFY BEFORE IMPLEMENTATION

**D — Spacing roles → MODIFY: tokenise only the structural relationships.** "No literal anywhere" is rejected as
dogma (see §4). Stage 1 tokenises only the values that take part in cross-component alignment or in JS arithmetic:

- page gutter (`--gap` 16)
- sheet inset (the `16px` shared by `.hd/.row` padding (css:685), `.scope`, `.foot`, `.sub`, `.exp__in`, the
  "one vertical rhythm" rule at css:817)
- the row module (`--row` 74)
- column gap (8 / 6 / 6, now in three places)
- the sticky-stack heights (bar 68, band 72, header 52)
- the expansion offset (`+ 8` in js:125)

Intra-component padding literals (the eight inner-inset variants in the audit's P1-9) stay literal until Stage 6.
Choosing final values there is a composition job.

**E — Radius / depth roles → MODIFY: name at rendered values; snap only ≤ 2px.** Build a role ladder, not one
radius. Proposed roles, all at today's rendered values:

| Role | Value | Current users |
|---|---|---|
| pill | 999 | `.btn`, `.facet__b`, `.lane`, `.seg`, `.tag`, `.chip` |
| sheet | 28 | `.field` |
| card | 24 | `.focal/.value/.attn`, `.top`, `.cmd` |
| panel | 16–18 | `.exp__in` 18, `.veh__img/kv/pr` 16, `.pop` 18 |
| control | 12–14 | `.cmd .facet__b` 14, `.acc` 14, `.search` 14 |
| inner | 8–10 | `.rows` 10, `.mn__it` 8, `.fld` 9 |
| micro | 4–5 | `.demo`, `.stock` |

Snaps allowed in Stage 1 are listed in advance and nothing else moves: 9 → 8, 7 → 8, 13 → 12, 11 → 12. Anything
bigger (for example 18 → 16 on the panel) is a Stage 6 decision.

Depth:

- Keep the rendered set: `--el-1/2/3` and `--sh-soft/pill/card` (css:1192–1197 values) plus `--edge`.
- Delete `--sh-ctl` (every use is overridden later by `--sh-pill` or css:1224) and `--sh-float`.
- Blue-cast shadow literals that appear in rules (css:1202, 1224, 1312, 1317) become tokens at their current values.

**G — Sticky derivation → MODIFY: fix the measurement; do not switch the Gen 10 payload back on.**

- Correcting js:449–450 from 56.5 / 114.5 to 68 / 140 would switch on `.cmd--stuck` (css:810–828). That rule
  applies negative margins, 32/48px padding and **`.cmd--stuck::after { border-color: #6A7285 }`**. It is Gen 10's
  grey band, and it would reappear as a 10px grey frame around Gen 11's white glass band.
- `.hd--stuck::before` (css:873) extends a sheet 16px past `.field` on both sides.

So in Stage 1:

1. Publish the stack from CSS as custom properties (`--stick-bar`, `--stick-cmd`, `--stick-hd`, plus
   `--stick-total`).
2. Have JS read them with `getComputedStyle` instead of literals.
3. **Delete** the stale stuck payloads (css:809–828 and 870–875).
4. Keep the class toggles as empty state hooks, so the engaged look can be authored once in Stage 3/6.
5. Delete `.hd--veil` (css:1042–1046 plus its JS branch in js:450). Hiding persistent chrome is never the remedy,
   and F makes it unnecessary.
6. Align the Filters dock (`.dock { top: var(--top) }` = 88, css:1028) to the same stack value. It is currently 20px
   off the band.

**H — Absolute-expansion dependencies → MODIFY: decouple, but do not change the geometry.** Stage 1 removes the
things that depend on the popover:

- the `z-index: 40` tier (F)
- `.hd--veil` (G)
- any sticky or ladder rule written around it

It does **not** change the popover's position, box or open/close path. Replacing `position: absolute` with in-flow
is Stage 4's contract (anchor + reserved space + transition), and doing half of it here reactivates Gen 10's in-flow
rules uncontrolled (R3).

**I — Theme tokens → MODIFY: tokenise the light surfaces now and gate dark off.**

1. Every surface literal (`rgba(255,255,255,.58)` at css:1132, `.72/.93/.88` on `.cmd`, `#6A7285` ×6,
   `rgba(255,255,255,.x)` inside `.attn`/`.lane`/`.row.open`) becomes a named **composited** token, keeping its
   current light value.
2. Both dark sources, the `[data-theme="dark"]` block and the 27 `[data-theme="dark"] …` rules, move into one
   quarantined, **inactive** section.
3. Gate the theme in two places: the head script (html:7) ignores a stored `dark` for this page, and
   `setTheme('dark')` is a no-op here.

Re-solving dark is Stage 3. The one irreversible mistake would be reordering the dark block during consolidation
(§1.3).

**J — Focus → CONFIRMED, with two amendments.**

1. `.lane:focus-visible { outline: 2px solid var(--focal-on) }` (css:972) is **white on the `#eef1f5` lane track:
   1.13:1, measured.** The rule was written for the old dark bento and survived the lane rail's move into `.cmdtop`.
   The audit's P0-5 cites `.lane` as "the correct pattern already in the file". The property is right, but the colour
   makes it invisible.
2. Outline replaces `box-shadow` only if no clipping ancestor hides it. It is fully clipped inside
   `.exp__l { overflow: hidden }` (css:890; measured: the action buttons are width 100% inside it). It is at risk in
   `.focal` (css:162, agerows with `margin: 0 -6px`) and `.value/.attn` (css:902). Use a negative `outline-offset`
   for full-bleed items, or remove the clip. Also drop `border-radius: var(--r-s)` from the global `:focus-visible`
   (css:74), because it reshapes any focusable element that has no later radius.

**Audit positional-selector item → MODIFY (cheap part now, model later).** `.hd > span:nth-child(10)` (css:791) and
`nth-child(11)` (css:982–993) can be swapped in Stage 1 for classes on the header spans (html:215 already uses
`c-trim` / `c-ext`; add `c-status` / `c-health`). The full column-definition model (identity, rank, drop order) is
Stage 5.

**1366 overflow → add to Stage 1 (it lives in the `--cols` consolidation).** Measured at 1366 × 800:

- `documentElement.scrollWidth` is **1394** against a clientWidth of 1366.
- The Actions cell ends at **1376** while `.field` ends at 1350, so the row overflows its sheet by 26px.
- Headless has no scrollbar. With `body { overflow-y: scroll }` (css:1027) and a classic Windows scrollbar it gets
  about 17px worse.

Cause: the base `--cols` (css:1002) needs about 1376px of field. The only compact set sits behind
`max-width: 1320px` (css:1052). 1280 fits with 17px to spare, 1440 with about 15px. When C collapses the 19 `--cols`
declarations into one table, that table has to hold at 1366.

---

## 4. ITEMS TO DEFER TO STAGE 2+

| Item | Defer to | Why not Stage 1 |
|---|---|---|
| Lane filtering + four contradictory counts (P0-3) | Stage 2 | Behaviour, not foundation. **But** keep `.stat--sold/--staging` (CSS) and the `S.lane → row()` coupling (js:111) intact through Stage 1. |
| Per-figure provenance, live/staged/stub (P0-7, P2-1) | Stage 2 | Content truth, independent of CSS |
| Dark palette re-solve (P0-4) | Stage 3 | Gated in Stage 1 (§3 I) |
| List identity: patch rows, keep focus, live region (P0-6) | Stage 3 | `render()` innerHTML (js:120) is JS architecture. Outline focus (J) does **not** fix it; don't claim it does. |
| Engaged sticky *look* (`.cmd--stuck` / `.hd--stuck` styling) | Stage 3/6 | Stage 1 keeps empty hooks only |
| In-flow expansion, anchor scroll, transition, 200ms `setTimeout` (P0-1, P1-2, P1-19/20/21) | Stage 4 | The locked decision. Its own contract. |
| Detail section structure; 2-col accordion reflow (P1-3/4) | Stage 4 | Market/Comps stay (locked). The layout mechanism is chosen with the in-flow model. |
| Column identity, drop order, VIN policy, exception slot map (P1-10/11/16/17) | Stage 5 | Needs the column model |
| Row dimming `.field.has-open` (P1-18) | Stage 4 | Exists only because of the popover model |
| Type scale / roles (P1-8) | Stage 6 | **Blanket font-size increase rejected.** Stage 1 keeps every size. |
| Signal budget (P1-6), "one dark object per page" | Stage 6 | **Rejected as a Stage 1 rule.** The navy bento is a current decision. Whether the navy Value and Attention cards (css:902) stay dark is a composition call, not a consolidation. |
| "No literal anywhere, including JS" | never, as stated | **Rejected as dogma.** Structural values only (§3 D). |
| One universal radius | never | **Rejected.** Role ladder (§3 E). |
| Mobile / tablet | Stage 5+ | **Out of scope.** Targets are 1280/1366/1440/1920. Stage 1 only has to not break ≥1280. |
| Motion contract (700ms counter, 650ms `meter-in` `width` keyframe, thumbnail `width` transitions) | Stage 6 | Keep as is. Do not "clean" `@keyframes meter-in` by accident: it is referenced at css:998. |

---

## 5. CSS → JS DEPENDENCY RISKS

These are the contracts that must migrate **together**. In each case, changing one side silently breaks the other.

- **R1 · Sticky thresholds.**
  - Links: js:449–450 (`<= 56.5`, `<= 114.5`, veil band `114 + 48`) ⇄ css:1346–1347 (`top: 68px` / `140px`) ⇄
    `.cmd--stuck`, `.hd--stuck`, `.hd--veil`.
  - Risk: fixing the numbers alone activates Gen 10's grey payload (§3 G).
- **R2 · `--top` has three meanings** (measured: `--top` = 88px while `.top` renders 68px at y = 16).
  - It is the grid track (css:1021, `grid-template-rows: var(--top) …`), which sets the whole page's vertical
    position.
  - It is `.nav__it { height }` (css:97). Measured: nav items are 88px tall inside a 68px bar, and the megamenu is
    offset from that (`top: calc(100% - 6px)`, css:104).
  - It is `.dock { top; max-height }` (css:1028).
  - Setting `--top: 68px` to "fix sticky" moves the page up 20px, pulls the menus 20px up over the bar (changing the
    hover gap), and re-seats the dock. Split it into `--bar-track` (88) and `--stick-bar` (68) first.
- **R3 · Expansion geometry chain.**
  - Links: `.exp { position: absolute; z-index: 40 }` (css:1257) ⇄ `#tb { position: relative }` (css:1256) ⇄
    js:124–125 (`ex.style.top = rb.bottom − hb.top + 8`) ⇄ `#exp-space` injected by js:120 and hidden by css:1264 ⇄
    `.exp--open` ⇄ `setTimeout(…, 200)` (js:226, 230).
  - If `#tb`'s `position: relative` is lost in consolidation, the panel positions against `.field` and lands roughly
    300px low.
  - If the popover layer (css:1255–1265) is deleted, the Gen 10 in-flow rules still in the file revive (grid
    `0fr → 1fr` at 572–576, 594–595, 673–680, 766–777, 1035–1040), while JS keeps writing `style.top`. The result is
    a half-installed Gen 10 accordion.
- **R4 · The self-cancelling `dock-open` pair.** css:507–520 (Gen 8 "Lot becomes a gauge strip") hides `.lanes`,
  `.kv`, `.agemix`, `.ar__m`, `.ar__p` and `.full`. css:613–630 restores them, but only under `.bento`.
  - Deleting the "restore" half as redundant collapses the bento whenever Filters opens.
  - Deleting the Gen 8 half is correct, but it also **changes today's behaviour**: `.app.dock-open .lanes
    { display: none }` currently **hides the lane rail when Filters is open.** Measured: `display: none`. The lanes
    moved to `.cmdtop`, which the restore rule does not cover. Decide whether that is intended; it almost certainly
    is not.
- **R5 · Dock-open column contract.** The 0px tracks in the `dock-open --cols` (css:798) and the
  `visibility: hidden` cells (css:791; measured `.st` width 0 when Filters is open) are tied to:
  - the positional header selectors `nth-child(10/11)`
  - the JS tag budget `max = S.dock === 'filters' ? 1 : 2` (js:99)
  - `.price__sub { display: none }` under dock-open (css:1013)

  Change the track count and all four drift together.
- **R6 · Runtime-built class names.** A literal scan of HTML+JS flags 30 CSS classes as unused. **13 of them are
  live**, because JS assembles them from strings:
  - `stat--ok / --sold / --staging` (js:111)
  - `tag--danger / --slate / --violet` (js:87 via `TONE`)
  - `hl--ok / --bad / --red / --vio` (js:299)
  - `age--fresh / --stale` (js:113)

  Also state-only (never present in a default load): `ar--on`, `acc--open`, `lane--on`, `tray--on`, `pop--open`,
  `nav__it--open`, `fv--on`, `fv--signal`, `swb--on`, `mn__it--on`, `facet__b--on`, `.on`, `.sel`, `.open`,
  `.has-open`, `exp--open`, `dock-open`, `th--none`, `price--none`, `tag--more`, `suggest`, `delta--*`,
  `dist__mk--med`. **Dead-code removal must use the class census plus every review state (§9), never coverage from
  a default page load.**
- **R7 · Token names used from JS/HTML strings.**
  - `var(--age-fresh / -mid / -late / -stale)` (js:18)
  - `var(--age-mid-focal)` etc. inline (html:155)
  - `var(--danger / --ok / --ink)` inline (js:297)
  - component-local `--w`, `--b`, `--c`, `--seg`, `--tone*` (never declared in `:root`; set inline or per variant)

  Renaming or "globalising" these in B breaks them without any error.
- **R8 · `className` overwrite.** `$('#dock-f').className = 'dock__f dock__f--row'` (js:356) and `= 'dock__f'`
  (js:217) wipe any class the migration adds to the dock footer. Use state hooks elsewhere or change these to
  `classList`.
- **R9 · Focus restore hack.** `tog()` (js:183–184) re-focuses dock items only if focus fell to `body`. J's outline
  change does not interact with it, but moving focus styling onto `outline` will make the focus loss after every
  `render()` **visible** (the ring disappears on each tick). That is expected. Log it as P0-6, not as a J regression.
- **R10 · Theme source order + shared storage** (§1.3). `[data-theme="dark"]` (css:44) ties `:root` in specificity.
  `aan-theme` in localStorage is shared with `all-vehicles-gen8/9/10` and `all-leads-gen10`.
- **R11 · `.field` / `.rows` overflow.** css:218 `.field { overflow: hidden }` vs css:666 `overflow: visible`;
  css:293 `.rows { overflow: auto }` vs css:667 `visible`. If a merge picks the early value, `.cmd` and `.hd` stop
  sticking entirely (a scroll container is created). If the 28px `.field` radius should ever clip, use
  `overflow: clip`, never `hidden`.
- **R12 · `.sub` stacking context.**
  - `.sub { position: relative; z-index: 5 }` (css:836, 861) clamps the Make/Year/Price popovers (`.pop` z-40) to 5,
    tied with `.hd` 5, which wins on DOM order (P0-8a).
  - The fix is to remove `.sub`'s `z-index` and give `.pop` the menu tier. **Do not** raise `.sub` above `.hd`:
    `.sub` is not sticky, so its chips would paint over the stuck header while scrolling through the 140–192 band.
- **R13 · Review harness.** The hash states (js:430–442: `#vehicle=`, `#filters`, `#dark`, `#open=`, `#close=`,
  `#f=`, `#attn=`) and `window.G8demo` (js:457) are the only reproducible way to reach states. Keep them working;
  they are the Stage 1 regression rig.
- **R14 · Cache busters.** `?v=202609170250` on the CSS (html:8), data and JS (html:232–233). A consolidated file
  served under an old query string will show reviewers a mixed state. Bump all three together.

---

## 6. VISUAL REGRESSION RISKS

Rules that look superseded but are **still rendering**, and places where cleaning too aggressively changes the page.

- **V1 · Unscoped Gen 10 lane rules still style the `.cmdtop` rail.** `.lane` / `.lanes` rules at css:173–179,
  548–550, 600–608 and 951–979 were written for lanes on the dark bento. The lanes now live in `.cmdtop`
  (html:179–187) and are only partly overridden by css:1231–1236. What still comes from the "dead" layers:
  - the hover lift `translateY(-1px)` (965)
  - the count pill `.lane b { padding; radius; font-size: 12px }` (967)
  - the active count tint `.lane--on b` (969)
  - **`.lane--zero { opacity: .7 }` (970)**. css:1252 "fixed" the zero lane to `--ink-3` (5.60:1 on the track),
    but the opacity composites it to **3.00:1** (computed: `#848c98` on `#eef1f5`), which fails AA.

  Deleting the old block as dead changes hover, the count pill and the zero state. Keep the pieces you want as
  explicit `.cmdtop .lane` rules, then delete the rest.
- **V2 · Lane focus ring is white on the light track, 1.13:1** (css:972; see §3 J).
- **V3 · 1366px horizontal overflow** (§3). Keeping the current layout exactly would also keep the defect.
- **V4 · `.exp__l` is 300px in a 420px track.** `.exp__l { width: 300px }` (css:890) survives the recomposition's
  `grid-template-columns: 420px …` (css:1281). Measured: photo 300 × 264, and a 148px gap between the left column
  and `.exp__r`. The "object dominates" plan (css:1267–1276) was only half installed. Consolidation will pick one of
  the two by accident unless someone decides. Recommendation: keep today's 300 (render-preserving) and leave the
  composition to Stage 4.
- **V5 · Needs Attention padding jumps when Filters opens.** Measured: 14/18/18 closed vs 14/12/10 open (css:938/945
  vs 625). This is a leftover of the R4 pair. Resolve it to one value during C.
- **V6 · Header height.** `--hdh` 48 (css:930) vs `.hd { height: 52px }` (css:1135, rendered). JS assumes 48
  (js:450). Tokenising at 48 shrinks the sticky header by 4px and moves every row.
- **V7 · Command band translucency.** The rendered value comes from the `@supports` branch (css:1313–1315:
  `rgba(255,255,255,.88)` + blur), not from css:1311 (.93). Keep the `@supports` pair together.
- **V8 · `.cmd::after` frame.** `.cmd::after` (css:763) is a 10px `var(--sheet)` frame with a 23px radius, painted
  under the band at rest, together with `isolation: isolate`. Removing it as "stuck-state machinery" changes the
  band's resting edge.
- **V9 · `.row.open` resolves to the flat `#6A7285` grey tab** (css:736–750, 767, 852–856). The navy-focal (717–733)
  and brand-soft (674–680) layers are fully overridden, except:
  - `.row.open { margin-top: 10px }` (767) is still active
  - the dark literal `#4f576a` (751, 776, 854, 1040) lives in the gated dark set

  Tokenise the grey as `--row-open` and delete the losing layers.
- **V10 · Outline clipping** (§3 J): `.exp__l`, `.focal`, `.value`, `.attn`.
- **V11 · Global `:focus-visible { border-radius }`** (css:74). Removing it is correct, but it changes the focused
  shape of components that have no later radius (`.brand`, `.dealer`, `.hd .s`). Check them.
- **V12 · Platform bar at rest.** The bar sits at y = 16 because of the 88px track, `margin-top: 12px` and
  `align-self: center` (css:1213). If R2 is handled carelessly, the floating inset disappears or doubles.
- **V13 · Health column tint.** The tint (css:982–993) is addressed by `nth-child(11)` on the header and by `.tags`
  in rows. Swapping to a class (§3) must reproduce the negative margins `-4px -6px` exactly, or the tinted band
  steps sideways against its cells.
- **V14 · Card surfaces.** The navy Value and Attention cards come from css:902–927, which overrides the light
  gradient cards at css:878–887. Their scoped token overrides (css:915–918: `--signal`, `--danger`, `--line-3`
  re-declared on `.attn`) are what make the chips legible on navy. Moving all colour into one `:root` layer must keep
  these **component-scoped** overrides, or Attention's counts go dark-on-dark.

**28 migration risks in total: R1–R14 plus V1–V14.**

---

## 7. RECOMMENDED SAFE MIGRATION ORDER (inside Stage 1)

The skill's default order (variables → atoms → layouts) is replaced by the order below, because in this file tokens,
components and layout are tangled through source order. Each step ends with the §9 checks and a screenshot diff.

0. **Baseline.**
   - Commit or tag the current Gen 11.
   - Capture screenshots and computed-style dumps at 1280/1366/1440/1920 for each review state: default · scrolled
     400/900 · `#vehicle=<stock>` · `#vehicle=…&open=market,comps,spec,hist` · `#filters` · `#f=make:Porsche` ·
     `#attn=no_price` · each lane · 3 rows selected (tray) · empty result.
   - Record the §6 known defects as *expected diffs*.
1. **Quarantine first.** Move the expansion family (`.exp*`, `.row.open*`, `.has-open`, `#tb` positioning,
   `.exp-space`) and the `dock-open` family into two labelled sections, unchanged. Move the dark block and every
   `[data-theme="dark"]` rule into a third, inactive section. After this step the file should render
   **byte-identically**.
2. **Gate dark.** Head script (html:7) and `setTheme` (js:373) ignore dark on this page, and the toggle is hidden.
   Must land **before** step 3 (R10).
3. **Token layer (B).** One `:root` block, placed first, holding the resolved light values (css:1169 palette plus the
   surviving structure tokens). Delete the unused tokens (§2). Split `--top` into bar-track and stick-bar (R2) at the
   same values. Keep the component-scoped overrides on `.attn` (V14) and the inline-referenced names (R7).
4. **Dead code** (R6-safe list only, §2). Keep every runtime-built class.
5. **Component resolution (C)**, one family at a time, keeping rendered values: `.btn`, `.facet__b` + `.cmd .facet__b`,
   `.seg`, `.lane` (with V1 decisions), `.value/.attn/.focal`, `.search`, `.pop/.mn`, `.hd`, `.row`, `.tags/.tag`,
   `.price`, `.foot`. The column table becomes one `--cols` per breakpoint, fixed so 1366 fits (V3), and positional
   header selectors become classes (V13).
6. **Stacking ladder (F).**
   - Tokens: `--z-raised` (row/expansion) < `--z-sticky-hd` < `--z-sticky-cmd` < `--z-platform` < `--z-tray` <
     `--z-menu`.
   - `.exp` joins `--z-raised`, which fixes P0-8b (tray) and P0-8c (header) at no geometry cost.
   - Remove `z-index` from `.sub` and put `.pop` in `--z-menu` (R12), which fixes P0-8a.
7. **Sticky source of truth (G).** Stack custom properties; JS reads them; delete the Gen 10 stuck payloads and
   `.hd--veil` (+ js:450 veil branch); align the dock (R1, V6, V8, V12).
8. **Expansion decoupling (H).** Verify that nothing outside the quarantine still references `.exp` geometry. Keep
   the `+8` as a named constant read from CSS.
9. **Surfaces onto tokens (I, light only).** Composited surface tokens replace the literals (`.field`, `.cmd`,
   `.row.open`, `.attn` translucent rows, `.lane` fills).
10. **Focus (J).** `outline` + `outline-offset` owned at product level; remove `:focus { outline: none }` and the
    `box-shadow` focus; fix V2; resolve V10 clips.
11. **Spacing and radius naming (D, E)** at rendered values, with only the pre-listed snaps.
12. Bump the cache busters (R14), then do the final diff against the baseline.

---

## 8. DO-NOT-TOUCH-YET LIST

- **Expansion geometry.** `.exp { position: absolute }`, `#tb { position: relative }`, js:124–126, `showVehicle` /
  `closeVehicle` and their 200ms `setTimeout`, `.exp-space`, the popover's size and padding, `.exp .exp__accs`
  two-column grid (css:1299–1304). All Stage 4, with only the z-tier (F) changed in Stage 1.
- **Detail content.** Market & pricing, Recent comps, the `market()` generator, the Demo badges (locked; Stage 2
  provenance).
- **`render()` / innerHTML architecture**, `tog()` focus hack (Stage 3).
- **Lane logic.** `list()`, `setLane()`, `countTo()` and the hardcoded counts (Stage 2).
- **Bento composition.** Navy cards, radial lighting, `meter-in` and neon hover (Stage 6; keep rendered).
- **`.field.has-open` dimming** (Stage 4, dies with the popover).
- **Type sizes, `.caps`, and `font-feature-settings: "tnum"` on body** (Stage 6).
- **Column content and order, tag budget, VIN truncation** (Stage 5; only the `--cols` sum for 1366 changes).
- **The 1360 / 1320 media queries.** Their numbers change for V3; nothing responsive below 1280 is added.
- **Review harness** (js:430–457).

---

## 9. ACCEPTANCE CHECKLIST FOR STAGE 1

**Structure**
- [ ] Exactly **one** `:root` block, and it comes before every rule. Zero `[data-theme="dark"]` rules outside the
      inactive quarantine.
- [ ] Each of `.field --cols`, `.row.open`, `.exp__in`, `.hd` (top/height/z), `.cmd` (top/background/z) and `.lane`
      is declared in one place (plus explicit breakpoint and state variants).
- [ ] No token declared-but-unused. No `var()` of an undeclared global (`--sh-pop` resolved).
- [ ] No `nth-child` column addressing.
- [ ] All z-index values are ladder tokens. No two siblings share a tier by accident.
- [ ] JS contains no sticky pixel literals: `grep -nE "56\.5|114\.5|114 \+ 48" all-vehicles-gen11.js` returns
      nothing.

**Behaviour preserved** (checked in every §7.0 baseline state)
- [ ] Every runtime-built class from R6 still renders (click each lane, select rows, open Filters, open a vehicle
      with all sections, trigger the empty state).
- [ ] `.cmd` sticks at the bar's bottom edge and `.hd` sticks at the band's bottom edge, with no daylight between
      them at scrollY 200/400/900. The Filters dock header sits level with the band.
- [ ] The popover opens in the same place as the baseline (±0px) and still closes on the second click and on Escape.
- [ ] Popovers in `.sub` (Make/Year/Price) are fully hit-testable while scrolled (P0-8a). With 3 rows selected and a
      vehicle open, the tray is clickable (P0-8b). The sticky header is never painted over by the panel (P0-8c).
- [ ] Filters open: the bento keeps its full form and the lane rail stays visible (R4 decision recorded). Attention
      padding does not jump (V5).
- [ ] Dark is unreachable from the toggle, from `#dark` and from a stored `aan-theme=dark`.

**Target widths**
- [ ] `document.documentElement.scrollWidth === clientWidth` at 1280, 1366, 1440 and 1920, with a real
      (non-overlay) scrollbar.
- [ ] Row right edge ≤ `.field` right edge at each width.

**Focus**
- [ ] Tab through the bar, head buttons, lanes, band, quick filters, rows, row actions, the opened vehicle and the
      Filters dock. Every stop shows an outline with ≥ 3:1 against its adjacent colours, and none is clipped (V2, V10).
- [ ] No `outline: none` anywhere except where an equal replacement is declared on the same selector.

**Visual diff**
- [ ] Screenshot diff against the baseline shows only the listed expected changes (V2, V3, V1 zero-lane contrast,
      the snaps in §3 E, and removal of the dead stuck payloads). Nothing else moves by more than 1px.
- [ ] The zero lane reaches ≥ 4.5:1.
- [ ] Console clean; the `?v=` query bumped on all three assets.

---

## 10. FINAL GO / NO-GO

**GO**, on three preconditions that are part of the pass rather than blockers to it:

1. **§7.0 baseline captured first.** Without it, "no unintended change" is unprovable in a file where the losing
   declarations still render.
2. **Dark gated before the `:root` blocks collapse** (§1.3, R10). Consolidating in the natural order revives an
   orphaned palette.
3. **Expansion and `dock-open` families quarantined, not cleaned** (R3, R4). Stage 1 changes only their z-tier.

The file is messy but mechanically legible. Every current value can be traced to its winning declaration, the
census found no hidden external consumers (only `index.html` links to Gen 11, and no other page imports its CSS or
JS), and the JS couples to CSS through a finite, listed set of contracts (R1–R14). Nothing here needs a new
generation, and nothing in Stage 1 forces a decision that the locked in-flow model would later have to undo.

*End of validation. No source file was modified. `GEN11_AUDIT.md` was not edited.*
