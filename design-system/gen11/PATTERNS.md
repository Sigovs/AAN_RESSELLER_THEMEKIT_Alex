# AAN Gen 11 — Page Patterns

Four archetypes cover all ten shipped pages. **Do not force one layout on every
page** — identify which archetype a page belongs to, then use that archetype's
composition.

| Archetype | Pages |
|---|---|
| A · Gateway | Login |
| B · List / register | All Vehicles · All Leads · My Work Queue · Manage Dealers · Accounting |
| C · Record / dossier | Single Lead · Single Ticket |
| D · Editor | Single Vehicle · Dealer Edit |

---

## A · Gateway

The only page in the kit with no data on it, and the only one allowed
marketing-weight type (28px/600) and the outer shell radius `--r-sheet-o` 28px.

```
┌─────────────────────┬─────────────────────┐
│  dark brand panel   │  the form           │
│  wordmark           │  44px fields         │
│  proposition        │  44px submit         │
│  support line ↓     │  legal ↓             │
└─────────────────────┴─────────────────────┘
```

Rules: fields and the one action that submits them share the **44px** tier. The
form row wrapper must not be called `.field` — that name belongs to the working
surface in the family layer.

---

## B · List / register

The working archetype. Five pages, one composition, four densities.

```
platform bar                        sticky  z20   56px
page identity (title · context · actions)
┌── intelligence band (optional, dark) ──┐  --focal, r14
│  figures · attention tiles             │
└────────────────────────────────────────┘
        ↕ 24px
┌── the sheet ───────────────────────────┐  --sheet, r14, --sh-soft
│  view track                    toolbar │  sticky z12  56px
│  search · sort · filters    sub-toolbar│
│  scope line                            │
│  table header                  sticky z10  40px
│  rows …                                │
└────────────────────────────────────────┘
```

**Row height is the density dial** — 74 (media) / 64 (operational) / 56 (register)
/ 52 (ledger). Everything else stays identical.

The intelligence band is optional: All Vehicles, All Leads and Accounting carry
one; My Work Queue and Manage Dealers do not. A page without one goes straight
from identity to sheet.

**Selected row** (All Vehicles, All Leads): the row opens **in flow**, directly
under itself, and comes to rest at `stack + anchor-gap`. It is not a modal, not a
side panel, and not centred by `scrollIntoView`.

---

## C · Record / dossier

A single record read top to bottom, with a working rail beside it.

```
platform bar                        sticky  z20
page identity (subject · state chips · prev/next · save)
┌── focal summary (dark) ──┬── identity panel ──┐
│  the figures that matter │  who this is about │
└──────────────────────────┴────────────────────┘
        ↕ 24px
┌── the sheet ─────────────────┐ ┌── dock ──┐  400px
│ section band        sticky z12│ │ workflow │
│ 01 ▁▁▁ chapter (white)        │ │ state    │
│ 02 ▒▒▒ chapter (wash)         │ │ actions  │
│ 03 ▁▁▁ chapter                │ │          │
│ 04 ▓▓▓ chapter (live, warm)   │ │          │
│ 05 ▒▒▒ chapter                │ └──────────┘
└───────────────────────────────┘
```

### C.1 Chapters

The rhythm that makes a long record readable:

- ground **alternates** — `--chapter-wash #f5f8fc` on even chapters
- the chapter where the work happens takes the one warm ground —
  `--chapter-live #fdf9f2` (`#s-activity`, `#s-thread`)
- every boundary is a **full-bleed rule**, not a 1px inset that vanishes
- every chapter opens with its number via a CSS counter, so position is countable
- chapter padding `30px 0 40px`; head padding-bottom 12px with a hairline under it

Applies to `.sec` (record pages) and `.zone` (editor pages) from one shared block.

### C.2 Conversation thread

Where a record carries a history people talk in:

- each entry is a **white object on the chapter's warm ground**, r10, pad `12px 14px`, 8px apart
- the **author leads** (14px/650); the kind is demoted to a 10.5px caps mark
- every entry offers **Reply**
- a reply nests **directly under what it answers**, indented 30px, on `--wash`, with a corner connector
- a reply is an ordinary internal note that remembers its parent — no new record type

---

## D · Editor

A form long enough to need an index.

```
platform bar                        sticky z20
page identity (record · state · external links)
┌─ rail ─┐ ┌── zones ──────────────┐ ┌─ utilities ─┐
│ 01 ●   │ │ 01 ▁▁▁ zone (white)   │ │ notes       │
│ 02 ●   │ │ 02 ▒▒▒ zone (wash)    │ │ options     │
│ 03 ○   │ │ 03 ▁▁▁ zone           │ │ danger      │
│ …      │ │ …                      │ │             │
│ Jump / │ └────────────────────────┘ └─────────────┘
└────────┘
┌── save bar ────────────────────────────────────┐ fixed, full-bleed
```

- the rail is `.ui-nav` with 8px of its own padding; the current item is an **inset
  pill**, never a full-bleed slab with a stripe
- zones carry the same chapter rhythm as C.1
- fields sit in a two-column grid, label **above** control
- the save bar is **attached**: full-bleed, flush, square, top hairline, and the
  page reserves its **measured** height

---

## Cross-archetype patterns

### P1 · Configurable columns (currently All Vehicles only)

One `COLS` model drives header cells, row cells, the grid template and the
control. Reusable, but **do not add it to another page without being asked**.

Contract: template built from visible columns only · locked columns stated not
offered · freed width goes to the flexible columns in a documented order ·
`localStorage` under a page-scoped key, validated on read, safe fallback to the
approved default.

### P2 · Fitted strip

A single-line rail that cannot scroll sideways. It measures its **content box**
(not `clientWidth`, which includes padding), shows what fits, and hands the
remainder to a tail action that carries the count and anchors the right edge.

### P3 · Viewport-aware popover

See COMPONENTS §8.1. Flip, cap, scroll the inner list only, move to `<body>` while
open, restore focus on close.

### P4 · Measured fixed chrome

Any fixed bar publishes its own height to CSS and the page reserves that, plus one
gutter. Never a guessed constant.
