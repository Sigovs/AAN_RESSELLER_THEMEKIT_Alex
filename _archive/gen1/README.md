# AAN Reseller — hardcore redesign (FINALE)

New unified AAN design system, grown page by page. First page: **Dealer UI / All Vehicles**.

## Open it
1. **`index.html`** (or `lab/index.html`) — the design lab. Original AAN page and the redesign side by
   side, both at the same virtual viewport, both scrolled by one scrollbar.
   Modes: Original · Redesign · Side-by-side · Swipe (keys `1`–`4`). Viewport 1280 / 1440 / 1600 /
   1920 / fit. Light / Dark for both frames. Pick which captured original state to compare against.
   `R` reloads both frames after you edit CSS.
2. **`pages/dealer/all-vehicles.html`** — the redesign on its own (real data: the 100 rows of
   Chicago Motor Cars #277, Available lane, from the export).

The lab loads the original from `../aan-design-export-2026-09-09/pages/` — keep this folder next to
the export. The export is never modified.

## What is where
| Path | What |
|---|---|
| `lab/index.html` | Review shell (neutral, minimal). `lab/shots/` — reference PNGs of the redesign. |
| `ds/tokens.css` | DS v0.1 tokens — type, space, density, shape, elevation, light + dark palettes |
| `ds/base.css` | Reset, type roles, focus, icon rule |
| `ds/components.css` | DS v0.1 components (chrome, buttons, fields, facets/popovers, tabs, segments, pulse, chips, tags, flags, age, table, pager, modal, insights, cards) |
| `ds/DS-v0.1.md` | The system, written down — what exists and why |
| `ds/fonts/` | Archivo (variable, OFL) + IBM Plex Mono (from the AAN export) |
| `pages/dealer/all-vehicles.html/.css/.js` | The redesign; page-specific layout stays in its own CSS; JS renders rows and wires states for review |
| `pages/dealer/all-vehicles.data.js` | The 100 real rows extracted from the original DOM |
| `pages/dealer/img/` | The 58 vehicle thumbnails those rows reference (copied from the export) |
| `docs/01-product-read-all-vehicles.md` | Every data point, action, filter, sort, column, state and friction on the current page |
| `docs/02-competitor-read.md` | What was learned from the DriveCentric reference and what must not transfer |
| `docs/03-functional-mapping-all-vehicles.md` | Original → redesign, function by function |
| `docs/04-decisions-all-vehicles.md` | The UX/UI decisions and what was rejected |
| `tools/extract-rows.js` | How the data file was produced (re-runnable) |

## Rules in force
- The AAN export is the functional source of truth and is read-only.
- DriveCentric is research only; nothing from it is copied or stored here.
- 14 px floor for anything read to decide; tight X cell padding; light and dark both first-class.
