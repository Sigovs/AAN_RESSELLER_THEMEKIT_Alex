# AAN Gen 11 — Components

Every component below **exists in the shipped pages**. Geometry is measured, not
specified: each figure was read with `getComputedStyle` off the running page at
1440×900. Where a component renders identically on every page that uses it, it
says so. Where it varies, the variance is named.

Two layers, loaded in this order and never the other way round:

```html
<link rel="stylesheet" href="_aan-family.css">      <!-- 1 · the family layer -->
<link rel="stylesheet" href="_aan-components.css">  <!-- 2 · the ui-* layer  -->
```

The component layer is last on purpose: it is the normalised system, and it must
outrank whatever a page's own stylesheet still carries.

---

## 0 · What is actually shared

Measured across all ten pages: **753 distinct classes**, of which **41 appear on
six or more pages** and **505 appear on exactly one**.

The `ui-*` components are the system. They render identically everywhere:

| Component | Geometry | Consistency |
|---|---|---|
| `.ui-view` | h30 · pad `0 12px` · r7 · 13.5/500 | identical on 6 pages |
| `.ui-view--on` | h30 · pad `0 12px` · r7 · 13.5/650 · `--sheet` | identical on 6 pages |
| `.ui-thead` | min-h48 · pad `9px 16px` · 11/700 caps | identical on 4 pages |
| `.ui-nav__i` | h34 · pad `0 12px` · r7 · 13.5/500 | identical |
| `.ui-nav__i--on` | h34 · r7 · 13.5/600 · `--brand-soft` | identical |
| `.ui-filter` | h30 · pad `0 10px` · r7 · 13/500 · `--well` | identical |
| `.tbtn` | h30 · pad `0 8px` · r7 | identical |

The older per-page classes are **not** the system and still carry drift — see
§9 Exceptions. When migrating a page, reach for `ui-*` first.

---

## 0.1 Platform bar — `.top`

The first object on every page. Present on **9 of 10** (the Gateway has none).

```html
<header class="top">
  <a class="brand" href="#">
    <span class="brand__mk">AAN</span>
    <span class="brand__t">All Auto Network</span>
    <span class="brand__env">Backend</span>
  </a>
  <nav class="nav" aria-label="Platform">
    <span class="nav__it nav__it--on"><button class="nav__b">Inventory</button></span>
    <span class="nav__it"><button class="nav__b">Leads</button></span>
  </nav>
  <span class="top__sp"></span>
  <label class="gsearch">…</label>
  <span class="top__div"></span>
  <button class="tbtn">…</button>
</header>
```

| Part | Value |
|---|---|
| `.top` | h56, pad `0 16px`, r `--r-panel` 12px, `rgba(255,255,255,.76)`, sticky at `--stick-bar`, z `--z-platform` 20 |
| `.brand__mk` | h18, pad `2px 7px`, r `--r-micro` 4px, `--brand` fill, white, 12.5px/600 — **consistent everywhere** |
| `.brand__t` | 15px/600, the wordmark |
| `.brand__env` | 11px/600 — the environment word ("Backend"). **`display: none` at ≤1500px**: it is the first thing the bar gives up |
| `.nav__it` | the item wrapper; carries `--on` and owns any popover |
| `.nav__b` | h30, pad `0 5px`, r 8px, 13px/500, `--ink-2` |
| `.nav__it--on > .nav__b` | `--brand-soft` fill, `--brand-ink`, 650 — **never an underline** |
| `.top__div` | 1×20px `--line` — a divider between right-hand clusters. **Consistent** |
| `.top__sp` | `flex: 1 1 0` — the spacer that yields first |

**Responsive ladder** (family §18), in the order things are given up:
environment word → nav padding and tracking → Atlas label → search width.
`.nav` itself is `flex: 0 0 auto` — **it never shrinks below its content**, because
a clipped destination is one nobody can read.

---

## 0.2 Page identity — `.head`

```html
<div class="head">
  <h1 class="head__t">Vehicle Inventory</h1>
  <span class="head__ctx">Inventory manager</span>
  <span class="head__sp"></span>
  <button class="btn btn--sheet">Export</button>
  <button class="btn btn--primary">Add vehicle</button>
</div>
```

| Part | Value |
|---|---|
| `.head` | `flex`, `align-items: baseline`, `gap: 8–12px`; margin `12px` above, **`24px` below** |
| `.head__t` | 22px/650, tracking `-.018em` |
| `.head__ctx` | 11px/700 caps, tracking `.08em`, `--ink-3` — **consistent** |
| `.head__sp` | `flex: 1` — pushes the page actions right |

Height varies 32–64px by page because some identities carry a second meta line.
Padding and gaps do not vary.

---

## 0.3 Legacy aliases still in the markup

Several pages still carry the pre-normalisation class beside the `ui-*` one. They
are **paired in the stylesheet on purpose**, so the component wins by specificity
rather than by source order:

| Legacy | Current | Note |
|---|---|---|
| `.lanes` | `.ui-views` | the track |
| `.lane` | `.ui-view` | the item |
| `.lane--on` | `.ui-view--on` | measured identical on 3 pages: h30 · pad `0 12px` · r7 · 13.5/650 · `--sheet` |
| `.secnav__b` | `.ui-view` | the section band on record pages |
| `.rail__b`, `.rail__i` | `.ui-nav__i` | the editor rail |
| `.tl` | `.ui-filter` | the filter chip |

**Write the `ui-*` class in new markup.** Keep the legacy one only where existing
page CSS still needs it as a hook.

---

## 1 · View track — `.ui-views`

The one control that answers *which view am I in*.

```html
<div class="ui-views" role="group" aria-label="Views">
  <button class="ui-view ui-view--on" type="button" aria-pressed="true">
    My Work <b>94</b>
  </button>
  <button class="ui-view" type="button" aria-pressed="false">
    All Open <b>802</b>
  </button>
  <span class="lanes__div"></span>          <!-- optional group divider -->
  <button class="ui-view" type="button">Billing <b>12</b></button>
</div>
```

| Property | Value |
|---|---|
| Track | `inline-flex`, `flex-wrap: wrap`, `gap: 3px 1px`, min-height `--ctl` 36px, **no background, no ring** |
| Item | h30, pad `0 --inset-ctl` (12px), r `--r-inner` 7px, 13.5px/500, `--ink-2` |
| Item, current | `--sheet` fill, 13.5px/650, `--ink`, `0 1px 2px rgba(16,24,40,.08)` + `inset 0 0 0 1px --line-3` |
| Item, hover | `--well` fill |
| Count `<b>` | 12.5px/600 `--ink-3`; on the current item `--brand-ink` |
| Divider | 1px × 18px `--line-3`, margin `0 5px` |

**The track has no well.** My Work Queue carries twelve lanes; a sunken track
around them was a 1250px grey bar and the heaviest object on a page whose subject
is the list below it. Only the current lane is an object; the rest are labels.

**The track is the one toolbar item allowed to give up width** —
`.ui-toolbar > .ui-views { flex: 0 1 auto }`. Held rigid it pushes its neighbour
off the sheet.

Children are styled by `.ui-views > *`, not by the class, because several tracks
are rendered by page JS that may not emit `.ui-view`.

---

## 2 · Toolbar — `.ui-toolbar`

```html
<div class="ui-toolbar">
  <div class="ui-views">…</div>
  <span class="ui-toolbar__sp"></span>   <!-- flex spacer -->
  <button class="btn btn--sheet">Filters</button>
</div>
<div class="ui-toolbar ui-toolbar--sub">…</div>   <!-- the second, quieter row -->
```

| Property | Value |
|---|---|
| Geometry | min-height 56px, pad `8px --inset`, `gap: 8px` |
| Surface | `--sheet`, `border-radius: 0`, bottom `1px solid --line-2` |
| Children | `flex: 0 0 auto; min-width: 0` — except `.ui-views` |

Measured height varies 53–56px by page because each page's toolbar holds controls
of different tiers. The **padding and gap do not vary**.

The toolbar is **attached**: it is the top of the sheet, so it has square corners
and no shadow of its own.

---

## 3 · Table — `.ui-table`, `.ui-thead`, `.ui-row`

```html
<div class="ui-table">
  <div class="hd ui-thead">
    <span></span>
    <span class="s" data-sort="stock">Stock</span>
    <span class="r s on" data-sort="price">Price <svg class="i"><use href="#i-dn"/></svg></span>
    <span class="r">Actions</span>
  </div>
  <div class="row" data-id="v1" tabindex="0">…</div>
</div>
```

| Property | Value |
|---|---|
| Header | min-height **48px**, pad `9px --inset`, `align-items: center`, 11px/700 caps, tracking `.08em`, `--ink-3`, bottom `1px solid --line` |
| Header, sortable cell | a `<span data-sort>`; the control **inherits** the header's type — `font: inherit; letter-spacing: inherit; text-transform: inherit` |
| Header, active sort | adds `.on` → `--ink`, plus the direction glyph |
| Row | pad `0 --inset`, bottom `1px solid --line-2`, height from `--row` |
| Row, hover | `--wash` |
| Row, selected | `--brand-soft` |
| Row actions | `.ui-row__act` — `inline-flex`, `gap: 4px`, buttons at `--ctl-dense` |
| Numeric cell | `.r` → right aligned, `font-variant-numeric: tabular-nums` |

**Header labels are centred, not bottom-aligned.** Bottom alignment glued the
one-line labels to the hairline beneath them while the two-line labels floated.

**Row height is a per-archetype role** — 74 / 64 / 56 / 52. See TOKENS §4.3.

### 3.1 Configurable columns (All Vehicles)

A reusable pattern, documented in PATTERNS. **Do not add it to another page
without being asked.** The contract:

- one `COLS` model drives header cells, row cells, the grid template and the control
- the grid template is built from the **visible** columns — never a fixed template with `0px` tracks
- locked columns cannot be hidden and are stated, not offered
- persistence in `localStorage` under a page-scoped key, validated on read

---

## 4 · Section nav — `.ui-nav`

The left rail on an editor page.

```html
<nav class="rail ui-nav" aria-label="Sections">
  <button class="ui-nav__i ui-nav__i--on" type="button" data-zone="z1">
    Identity &amp; Status <span class="ui-nav__n">8</span>
  </button>
  <button class="ui-nav__i" type="button" data-zone="z2">People</button>
</nav>
```

| Property | Value |
|---|---|
| Rail | `flex` column, `gap: 2px`, **`padding: 8px`** |
| Item | h34, pad `0 --inset-ctl`, r `--r-inner`, 13.5px/500, `--ink-2`, full width |
| Item, hover | `--well` |
| Item, current | `--brand-soft` fill, `--brand-ink`, 600, **no stripe, no shadow** |
| Count | `.ui-nav__n` — margin-left auto, 12.5px/600 `--ink-4` |

The rail has its own 8px padding so the active pill is **inset inside its card**.
A full-bleed item with a coloured left stripe reads as a slab cut into the panel,
not as "you are here" — `.ui-nav__i--on::before/::after { content: none }` exists
to keep any legacy stripe out.

---

## 5 · Filter set — `.ui-filters` / `.ui-filter`

A different object from the view track: it narrows what the current view shows.

```html
<div class="ui-filters">
  <span class="caps flt__k">Roster</span>
  <button class="tl ui-filter tl--on" type="button" aria-pressed="true">Active <b>317</b></button>
  <button class="tl ui-filter" type="button">Pending <b>24</b></button>
</div>
```

| Property | Value |
|---|---|
| Set | `flex`, `flex-wrap: wrap`, `gap: 6px` |
| Key | `.flt__k` — 11px/700 caps, tracking `.08em`, `--ink-4`, margin-right 4px |
| Chip | h30 (`--ctl-dense`), pad `0 10px`, r `--r-inner`, `--well` fill, `inset 0 0 0 1px --line-2`, 13px/500 |
| Chip, hover | `--wash` |
| Chip, on | `--brand-soft` fill, `--brand-ink`, `inset 0 0 0 1px --brand-soft-2` |

Chips sit on the page ground with no sunken well, so the set never reads as a
second view track.

---

## 6 · Buttons

### 6.1 The family

| Class | Surface | Measured |
|---|---|---|
| `.btn--primary` | `--brand` fill, white ink | h36 · pad `0 14px` · r9 · 14/500 |
| `.btn--sheet` | `--sheet` fill, ring | h30–36 · pad `0 11–14px` · r7–9 |
| `.btn--quiet` | transparent | h36 · pad `0 12–14px` · r9 |
| `.btn--sm` | any of the above at the dense tier | h30 · pad `0 8–12px` · r7 |
| `.tbtn` | icon only, transparent | h30 · pad `0 8px` · r7 |
| `.btn--lg` / `.ui-ctl--lg` | the 44px tier | h44 · pad `0 20px` · r9 · 15px |

### 6.2 States

| State | Treatment |
|---|---|
| hover | primary → `--brand-hover`; sheet/quiet → `--well` |
| focus | `--focus` ring; on a dark surface `--focus-color-on-dark` |
| pressed / on | `.btn--on` → `--brand-soft` fill, `--brand-ink`, `inset 0 0 0 1px --brand-soft-2` |
| disabled | primary on a dark bar → `--focal-2` fill with `rgba(255,255,255,.62)` ink |
| with a count | `.btn__n` — 12px/700 `--ink-3`; `--brand-ink` when the button is on |

### 6.3 Placement

- Gap between adjacent buttons: **8px** (`--s2`). Never 1–3px, never negative margin.
- Icon inside a button: 16px, `gap: 7–8px` to its label.
- **One primary per group.** A second primary beside it means neither is primary.
- A toolbar toggle (Crew, Workflow, Filters) is a **button with `.btn--on`**, not a tab.

---

## 7 · Form controls

| Component | Geometry | Notes |
|---|---|---|
| `.fld` text input | h40, pad `0 10–12px`, r `--r-inner`, 14/400, `--sheet` | the field tier |
| `.sel` select in a form | h40, pad `0 34px 0 12px`, r `--r-inner` | 34px right gutter reserves the arrow |
| `.ui-select` wrapper | h `--ctl` 36, r9 | the toolbar tier |
| `.ck` checkbox | 16px, r4–5, `appearance: none` | |
| `.search` | h36, pad `0 12px 0 14px`, r9 | one page uses r14 — see §9 |
| textarea | min-height 66px, `resize: vertical` | |

### 7.1 The arrow

Every select draws **our** arrow, never the platform's:

- inside a wrapper → the wrapper's `::after` at `right: 13px; top: 50%`
- standing alone → an inline SVG background at `right 12px center`, 12×12

The native arrow sat wherever the platform put it — on a 36px control that left it
adrift in the middle of a 34px gutter. A pair of CSS gradients was tried and
rendered as a smudge at this size; the SVG is the version that ships.

### 7.2 Label and helper

```html
<label class="fl">Company Name <span class="req">*</span></label>
<input class="fld" type="text">
<p class="f__help">Helper text, 13px, --ink-3</p>
```

Label sits **above** its control — 78 left-aligned labels in two columns produce
four ragged edges; above, they produce two.

---

## 8 · Popovers — `.pop`

```html
<div class="facet">
  <button class="facet__b" data-pop="p-cols" aria-expanded="false"
          aria-controls="p-cols" aria-haspopup="true">Columns</button>
  <div class="pop pop--right cols" id="p-cols" role="group" aria-label="Columns"></div>
</div>
```

| Property | Value |
|---|---|
| Surface | `--sheet`, r `--r-card` 14px, `--sh-soft`, min-width 268–272px |
| **Max width** | `min(420px, calc(100vw - --s6))` — a menu must never size to `max-content` |
| Open | `.pop.pop--open { display: block }` — **paired selector**, not order-dependent |
| Alignment | `.pop--right` → right edge locked to the trigger |
| Item | `.pop__it` — `flex`, `gap: 10px`, pad `6–7px 8px`, r8, hover `--wash` |
| Layer | `--z-menu` 40 |

### 8.0 Anchoring — `fitPop()`

A `.pop` is **left-anchored to its trigger** by default. A facet sitting in the
right half of a toolbar therefore runs past the workspace edge, and the
workspace clips it: All Vehicles' Price filter opened 407px wide at x=1088 and
lost 105px of its quick-range buttons at 1440.

`fitPop(p)` flips a panel to **right-anchored when, and only when, it would
overflow its workspace**. Measured after: every facet on All Vehicles and All
Leads opens fully inside the field — Columns and Price flip, Make / Model / Year
/ Sort stay left-anchored.

The 420px cap above is the other half of the same fix. The clip was never the
defect; it only made the missing cap visible.

### 8.1 Viewport-aware placement (the Columns panel)

The strongest current example, and the contract for any new popover:

- measures the room below and above the trigger
- **flips above** when there is more room there
- takes a `max-height` from the side it opened on
- **only the inner list scrolls** — heading and footer action stay put
- Escape closes and returns focus to the trigger; outside click closes
- while open it is **moved to `<body>`**, because the sheet sets `overflow: clip`
  and the command band carries a `backdrop-filter` — inside them, `position: fixed`
  is fixed to the *band*, not the viewport. It is returned to its markup home on close.

Verified: 1440×900 opens down; 1366×768 and 1366×610 flip up, clear the platform
bar, keep Reset reachable; below ~520px tall the inner list scrolls.

---

## 8.2 Menu item — `.mn__it`

The row inside a `.pop` used as a menu (sort, dealer switcher, account, platform
sub-nav). Present on **7 pages**.

```html
<div class="pop mn" id="p-sort">
  <div class="caps mn__lab">Sort by</div>
  <button class="mn__it mn__it--on" type="button" data-sort="days">
    <svg class="i"><use href="#i-check"/></svg> Age
  </button>
  <div class="mn__sep"></div>
  <button class="mn__it" type="button">Stock</button>
</div>
```

| Property | Value |
|---|---|
| Item | `flex`, full width, pad `6px 10px`, r `--r-inner`, 14px/400, `gap: 8px` |
| Item, hover | `--wash` |
| Item, current | `.mn__it--on` → `--brand-ink`, 600; its leading icon `--brand` |
| Item, destructive | `.mn__it--danger` → `--danger` ink and icon |
| Group label | `.mn__lab` — the caps key, pad `6px 10px 4px` |
| Separator | `.mn__sep` — 1px `--line-2`, margin `6px 4px` |
| Menu container | `.mn` — pad 6px, min-width 224px |

**Variance:** All Vehicles uses `8px 10px` padding and a 10px gap against
`6px 10px` / 8px elsewhere. Minor drift; take the 6/8 values.

**`.mn__it` is exempt from the blanket centring rule — deliberately.** It is a
full-width row in a column of choices, not an inline object, so it keeps
**block-level** `display: flex; width: 100%` and takes only the vertical
centring. When it was swept into the `inline-flex` list, every `.mn` laid its
items out on one line — All Leads' bulk-assign menu put all fourteen dealers on
a single 2426px row, 1662px past the workspace clip, and eleven of them became
unreachable. See RULES §1.5.

---

## 8.3 Global search — `.gsearch`

The search in the platform bar. Present on **9 pages** — the most widely shared
control in the kit after the button.

```html
<label class="gsearch">
  <svg class="i"><use href="#i-search"/></svg>
  <input type="search" placeholder="Search anywhere" aria-label="Search">
  <kbd>/</kbd>
</label>
```

| Property | Value |
|---|---|
| Control | h30 (`--ctl-dense`), pad `0 8px 0 10px`, r `--r-inner`, `--sheet`, `gap: 8px`, ring `inset 0 0 0 1px --line` |
| Input | transparent, borderless, 13px/400, no ring of its own |
| Icon | 14px, `--ink-4` |
| Hint | a `<kbd>` showing `/`, `--ink-4` |

**Width is responsive, by design:** `flex: 0 1 232px` with `min-width: 132px`.
It is the element that yields first when the bar is tight — the nav does not
shrink, because a clipped destination is one nobody can read.

Measured: 232px at 1440, 190px at ≤1380, 150–151px on the pages whose platform bar
also carries a long account name. **This is a role, not drift.**

---

## 9 · Exceptions — components that still drift

These are **documented, not silently normalised**. Each is a migration target.

| Component | Variants found | Verdict |
|---|---|---|
| `.btn--primary` | 5: h36/r9 and h30/r7; gap 7 and 8; **one white instead of brand** (Accounting) | Drift. The white one is a mis-classed button. |
| `.btn--sheet` | 5: h30/h36, pad 8/11/14 | Drift. Tier should follow the toolbar it sits in. |
| `.btn--sm` | 4: pad 8/11/12, fill white vs transparent | Drift. |
| `.search` | 3: r9 twice, **r14 on All Vehicles**, h36 vs h40 | Drift. r14 is a surface radius on a control. |
| `.ck` | 3: r5, r4, **r0** | Drift. |
| `.bdg` | h26 (My Work Queue) vs **h12** (Manage Dealers) | Drift. 12px is below the readable floor. |
| `.sel` | 3: h40 twice, h36 with no fill on Accounting | Partly role (form vs toolbar), partly drift. |
| `.tag` | 11.5/700 vs 12.5/700, pad 6 vs 9 | Role: the inventory chip is tighter because three sit in one cell. |
| `.nav__b` gap | 4px vs 6px | Cosmetic drift. |
| `--anchor-gap` | 10px vs **12px** (Single Ticket) | Unresolved inconsistency. |
| Section title | 17/650 vs 19/600 vs 19/650 vs 15/650 | Drift against the measured role. |

**Rule for Ivaylo:** if a component appears in this table, do not copy its current
page value. Use the role value from TOKENS.md and the `ui-*` component.
