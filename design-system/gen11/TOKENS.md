# AAN Gen 11 — Tokens

**Every value in this file was read out of the running Gen 11 pages, not chosen.**
Extraction method: each of the ten shipped pages was loaded at 1440×900 and every
custom property declared on `:root` / `.app` was read back through
`getComputedStyle`. Where a token resolves to the same value on every page that
declares it, it is recorded here as a foundation value. Where it differs, the
difference is recorded as a **role** (deliberate, per-archetype) or as an
**exception** (genuine inconsistency), and is never averaged away.

- Source of truth: `pages/_aan-family.css`, `pages/_aan-components.css`
- Extracted from: `4be2ce7`
- Tokens found: **193**. Identical on every page that declares them: **188**.
  Varying: **5** (`--mono`, `--dock`, `--row`, `--stick-total`, `--anchor-gap`).

---

## 1 · Colour

### 1.1 Grounds and surfaces

| Token | Value | Role |
|---|---|---|
| `--ground` | `#eef1f5` | The page itself. Nothing floats on white. |
| `--ground-2` | `#e3e7ee` | The ground one step down — pressed/again-behind. |
| `--sheet` | `#ffffff` | A working surface: table sheet, form sheet, panel. |
| `--wash` | `#eef1f5` | Hover fill on a light row or quiet control. |
| `--well` | `#e4e9f0` | A sunken track or an inactive chip. |

`--wash` and `--ground` are the same value. They are **not** merged, because they
answer different questions: `--ground` is "what the page is", `--wash` is "what a
thing becomes when you point at it". If the page ground ever moves, only one of
them should follow.

### 1.2 Ink

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0d1320` | Primary reading ink, headings, figures. |
| `--ink-2` | `#353e4e` | Secondary — control labels, body on a sheet. |
| `--ink-3` | `#576070` | Supporting — helper text, column context. |
| `--ink-4` | `#697181` | Muted — caps keys, counts, disabled-looking meta. |

### 1.3 Ink on the dark focal surface

| Token | Value | Role |
|---|---|---|
| `--focal-ink` | `#f3f6fb` | Figures and headings on `--focal`. |
| `--focal-ink-2` | `#bdc6d5` | Supporting text on `--focal`. |
| `--focal-ink-3` | `#97a3b7` | Caps keys and meta on `--focal`. |

### 1.4 The dark focal surface

| Token | Value | Role |
|---|---|---|
| `--focal` | `#172234` | The one dark mass a page is allowed to open with. |
| `--focal-2` | `#223049` | Its raised/hover step. |
| `--focal-line` | `#2b3850` | A divider inside the dark surface. |
| `--focal-inset` | `#111a29` | A sunken area inside the dark surface. |

### 1.5 Brand

| Token | Value | Role |
|---|---|---|
| `--brand` | `#1f5fe0` | Primary action fill, focus ring. |
| `--brand-btn` | `#1f5fe0` | Alias used by button rules. Same value. |
| `--brand-hover` | `#1a50c4` | Primary action, pointer down/over. |
| `--brand-ink` | `#1747b3` | Brand as *text* — links, active nav ink. |
| `--brand-soft` | `#e9f0fe` | Active nav fill, selected row. |
| `--brand-soft-2` | `#cddbfb` | The hairline on a soft brand fill. |

**Blue means one of two things and nothing else: this is a link, or you are here.**
A numeral is not blue. An editable value is not blue.

### 1.6 Lines

| Token | Value | Role |
|---|---|---|
| `--line` | `#d8dee7` | A structural boundary — section break, table rule. |
| `--line-2` | `#e5e9ef` | A quiet internal hairline — row divider, control ring. |
| `--line-3` | `#c5cbd5` | An emphasised edge — scroll thumb, group divider. |

### 1.7 Status — the semantic triad

Each state ships four values: ink, fill, soft ground, line.

| State | `ink` | `fill` | `soft` | `line` |
|---|---|---|---|---|
| Warning / attention | `--signal` `#945000` | `--signal-fill` `#f2a12b` | `--signal-soft` `#fff2dc` | `--signal-line` `#efcd93` |
| Success | `--ok` `#12704a` | `--ok-fill` `#2fb46f` | `--ok-soft` `#e0f4e8` | `--ok-line` `#b9e2c9` |
| Error / destructive | `--danger` `#bd3328` | `--danger-fill` `#e35548` | `--danger-soft` `#fde8e5` | `--danger-line` `#f1bab3` |

### 1.8 The chip tone set

Nine hues, each a `bg` / `ink` pair, used only by status chips (`.bdg`, `.tag`)
where the product itself has that many distinct states.

| Tone | bg | ink |
|---|---|---|
| blue | `#dfeafa` | `#1a55a8` |
| amber | `#faeecb` | `#8a5c00` |
| green | `#d9f1e1` | `#156b38` |
| red | `#fadddd` | `#a82424` |
| violet | `#e9e2fa` | `#5b34b0` |
| magenta | `#f9e0ef` | `#a81866` |
| teal | `#d5f0ef` | `#0f6b66` |
| orange | `#fae5d2` | `#94500a` |
| slate | `#e5eaf0` | `#48586c` |
| cyan | `#d8edf7` | `#0d617e` |

### 1.9 Age band (inventory only)

`--age-fresh` `#2fb46f` · `--age-mid` `#a9b1be` · `--age-late` `#f2a12b` ·
`--age-stale` `#e35548` · `--age-mid-focal` `#5b6577` (the mid band, restated for
the dark surface).

### 1.10 Focus

| Token | Value |
|---|---|
| `--focus` | `0 0 0 2px #ffffff, 0 0 0 4px #1f5fe0` |
| `--focus-w` | `2px` |
| `--focus-offset` | `2px` |
| `--focus-color` | `#1f5fe0` |
| `--focus-color-on-dark` | `#ffd98a` |

Focus on a dark surface switches to amber because brand blue does not carry
against `--focal`.

---

## 2 · Typography

Family: `--font: "Archivo", "Segoe UI", system-ui, sans-serif` — a variable face,
weights 100–900, shipped from `ds/fonts/`, not a CDN.
Mono: `--mono: "Plex Mono", ui-monospace, monospace`.

> `--mono` is one of the five varying tokens: most pages declare
> `"Plex Mono", ui-monospace, monospace`; the declaration order differs on one
> page. The resolved face is the same everywhere.

### 2.1 Roles, measured

Counts are occurrences across the ten pages at 1440. The dominant value is the
role; the others are listed where they are a second role rather than drift.

| Role | Value | Evidence |
|---|---|---|
| Page title | `22px / 650`, tracking `-0.018em` | dominant on the record pages |
| Section title | `17px / 650`, tracking `-0.012em` | ×26 — the most consistent role in the system |
| Panel title | `15px / 650`, tracking `-0.008em` | ×3, dock and side panels |
| Caps key | `11px / 700`, `uppercase`, tracking `0.08em` | ×24 |
| Table header | `11px / 700`, `uppercase`, tracking `0.08em` | ×51 — identical to the caps key, deliberately |
| Table cell | `13px / 400` | ×5,821 — the single most common type in the product |
| Control, quiet | `14px / 500` | ×281 |
| Control, emphasised | `14px / 600` | ×205 — primary action, active control |
| Helper | `13px / 400`, `--ink-3` | ×24, no variance found |
| Mono / tabular | `12px / 400` | ×19, stock numbers, VINs, timestamps |

**The 13px floor.** Nothing that a user has to read sits below 13px except the
caps key at 11px, which is a label, not prose.

### 2.2 Type exceptions found

| Where | Value | Status |
|---|---|---|
| Login, hero line | `28px / 600` | **Role.** The only marketing-weight type in the kit; it is the only page with no data on it. |
| Dark focal figures | `22px / 600` and `30px / 600` | **Role.** A figure on `--focal` is a display number, not a heading. |
| Section title on two pages | `19px / 600` and `19px / 650` | **Exception.** Drift against the 17/650 role. Listed in RULES.md §Exceptions. |
| Section title on Single Vehicle | `15px / 650` | **Exception.** Reads as a panel title inside a section rail. |

---

## 3 · Spacing

### 3.1 The scale

`--s1` `4px` · `--s2` `8px` · `--s3` `12px` · `--s4` `16px` · `--s5` `24px` ·
`--s6` `32px` · `--s7` `40px` · `--s8` `48px` · `--s9` `64px`

Confirmed identical on every page. **There is no `20px`, no `28px`, no `36px`
step.** A value not on this list is a defect unless it appears in §3.3.

### 3.2 Named spacing roles

| Token | Value | Role |
|---|---|---|
| `--gutter` | `16px` | Page edge to content, every page, every width. |
| `--sheet-inset` | `16px` | Sheet edge to its content. |
| `--inset` | `16px` | Structural inset inside a component (toolbar, table row). |
| `--inset-ctl` | `12px` | Text inset inside a *control* (chip, view item, nav item). |
| `--zone-air` | `32px` | Air above a zone heading on the editor archetype. |

**Two insets, deliberately.** 16px is structural, 12px is a control. A control
that uses 16 looks inflated; a table row that uses 12 looks cramped.

### 3.3 The vertical block rhythm

Measured at the page joints and set deliberately:

| Joint | Value |
|---|---|
| Platform chrome → page identity | `16px` |
| Inside a block (bento card to bento card) | `16px` |
| Block → block (identity → module → sheet) | `24px` |

The rule: **a break between blocks must be larger than the gap inside a block**,
or the break carries no hierarchy.

### 3.4 The documented exception

`--anchor-gap` — the gap between the sticky stack and a selected row when it comes
to rest.

| Value | Pages |
|---|---|
| `10px` | All Vehicles, Single Vehicle, All Leads, Single Lead, Accounting |
| `12px` | **Single Ticket** |

10px is the intended value and is itself an intentional off-scale number: it is an
optical gap under a sticky stack, not a layout step. The 12px on Single Ticket is
**an unresolved inconsistency**, not a role. See RULES.md §Exceptions.

---

## 4 · Control heights

Three tiers, declared and used:

| Token | Value | Who may use it |
|---|---|---|
| `--ctl-dense` | `30px` | Chips, filters, row actions, compact buttons (`.btn--sm`), icon buttons (`.tbtn`), view items. |
| `--ctl` | `36px` | The default. Toolbar buttons, selects in a toolbar, search, segmented tracks. |
| `--ctl-lg` | `44px` | Form fields on a dedicated form page, and the one action that submits them. |

### 4.1 Heights in use, measured

| Component | Height | Consistent? |
|---|---|---|
| `.ui-view` / `.ui-view--on` | `30px` | yes — 6 pages |
| `.ui-filter` | `30px` | yes |
| `.ui-nav__i` / `--on` | `34px` | yes — 2 pages |
| `.tbtn` | `30px` | yes |
| `.ui-thead` | `48px` min | yes — 4 pages |
| `.fld` (form field) | `40px` | yes |
| `.sel` (form select) | `40px` | yes |
| `.ck` (checkbox) | `16–17px` | **varies** |
| `.btn--primary` | `30px` or `36px` | **varies** |

### 4.2 The fourth height

`--ctl-h: 40px` exists and is used by form fields and selects. It is a **role**,
not drift: a form field is taller than a toolbar control because it holds typed
input. It sits between `--ctl` 36 and `--ctl-lg` 44 and should be named
`--ctl-field` in any future pass.

### 4.3 Row heights — a per-archetype role

`--row` is deliberately different per page because the row carries different things:

| Value | Page | Why |
|---|---|---|
| `74px` | All Vehicles, All Leads, Single Lead | Rows carry a thumbnail or a two-line identity. |
| `64px` | My Work Queue | Operational row, two-line meta, no media. |
| `56px` | Manage Dealers | Register row, one line. |
| `52px` | Accounting | Ledger row, one line, numeric. |

This is **not** an inconsistency. Do not normalise it.

---

## 5 · Radius

| Token | Value | Role |
|---|---|---|
| `--r-micro` | `4px` | A mark, a swatch, an inline tag chip. |
| `--r-s` / `--r-inner` | `7px` | A control inside a surface: button, field, chip, view item. |
| `--r-control` | `9px` | A standalone control on the ground: toolbar button, search, select. |
| `--r-m` | `10px` | A compact panel. |
| `--r-panel` | `12px` | An attached panel, save bar. |
| `--r-card` / `--r-l` | `14px` | A floating surface: sheet, bento card, popover. |
| `--r-sheet-o` | `28px` | The outer page shell on the login archetype only. |
| `--r-pill` | `999px` | Status chips and true capsules **only**. |

**Two pairs share a value under two names** — `--r-s`/`--r-inner` at 7px and
`--r-card`/`--r-l` at 14px. They are aliases from two authoring passes. Prefer
`--r-inner` and `--r-card`; treat `--r-s` and `--r-l` as deprecated aliases and do
not introduce them in new work.

---

## 6 · Depth

| Token | Use |
|---|---|
| `--el-1` | `0 1px 2px rgba(16,24,40,.08), 0 0 0 1px rgba(16,24,40,.06)` — a resting card. |
| `--el-2` | `0 12px 30px -14px …` — a lifted panel. |
| `--el-3` | `0 30px 64px -18px …` — a popover or dialog. |
| `--sh-ctl` | A control that sits proud of its surface. |
| `--sh-soft` | The floating sheet. Blue-cast, long, with a top inner highlight. |
| `--sh-card` | The dark focal card. |
| `--sh-pill` | A lifted capsule. |
| `--sh-thumb` | The white thumb on a sunken track. |

The shadows are **blue-cast** (`rgba(34,58,118,…)`, `rgba(15,27,61,…)`), not grey.
That cast is part of the Gen 11 character; a neutral grey shadow reads as a
different system.

---

## 7 · Layers

### 7.1 The z ladder

| Token | Value |
|---|---|
| `--z-ground` | `0` |
| `--z-content` | `1` |
| `--z-raised` | `3` |
| `--z-rail` | `8` |
| `--z-sticky-hd` / `--z-sticky-head` | `10` |
| `--z-sticky-cmd` / `--z-sticky-sec` / `--z-sticky-cockpit` | `12` |
| `--z-platform` | `20` |
| `--z-tray` / `--z-savebar` | `30` |
| `--z-menu` | `40` |

### 7.2 Sticky offsets

| Token | Value |
|---|---|
| `--stick-bar` | `56px` — the platform bar |
| `--stick-cmd` | `56px` — the command toolbar |
| `--stick-hd` | `40px` — the table header |
| `--stick-sec` | `56px` — the section band (record pages) |
| `--stick-head` | `96px` — the page identity (editor pages) |
| `--stick-cockpit` | `72px` — the vehicle cockpit |
| `--bar-track` | `76px` — the grid row the platform bar occupies |

**Offsets are derived, never copied.** `--stick-hd-top` is
`calc(56px + 56px)` and `--stick-rail-top` is `calc(56px + 96px + 16px)` — each
built from the tokens above rather than written as a literal.

### 7.3 Stack totals — a per-archetype role

| Value | Pages |
|---|---|
| `calc(56px + 56px + 40px)` = **152px** | All Vehicles, All Leads, Single Lead |
| `calc(56px + 72px)` = **128px** | Single Vehicle |

Different archetypes stack different chrome. Verified at runtime: All Vehicles
reports a 152px stack with a selected-row anchor error of 0px.

---

## 8 · Motion

| Token | Value |
|---|---|
| `--dur` | `160ms` |
| `--dur2` | `240ms` |
| `--ease` | `cubic-bezier(.2,0,0,1)` |

One duration for state, one for movement, one curve. Everything honours
`prefers-reduced-motion: reduce`.

---

## 9 · Summary of variance

| Token | Verdict |
|---|---|
| `--row` | **Role** — per archetype. Keep. |
| `--dock` | **Role** — `440px` on list pages, `400px` on record pages. Keep. |
| `--stick-total` | **Role** — derived from what each archetype stacks. Keep. |
| `--mono` | **Cosmetic** — same resolved face, different declaration order. |
| `--anchor-gap` | **Exception** — 10px everywhere, 12px on Single Ticket. Unresolved. |
