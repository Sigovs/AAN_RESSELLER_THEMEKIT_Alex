# AAN Design System v0.1

Grown from one page — Dealer UI / All Vehicles. Nothing here was invented ahead of need; every
token and component below exists because that page uses it. Files: `tokens.css` (all tokens, light +
dark), `base.css` (reset, type roles, focus, icon glyph rule), `components.css` (the components).
Page-specific composition lives beside the page (`pages/dealer/all-vehicles.css`), never here.

## Rulings inherited from the current app (not taste)
- **14 px readability floor.** Anything a person reads to decide is ≥ 14 px (`--text-sm`). 13 px
  (`--text-xs`) only for incidental chrome: kbd hints, pager glyphs, the brand env tag.
- **Horizontal cell padding stays tight** (`--cell-px: 10px`); breathing room is spent on Y.
- **Light and Dark are both first-class**, same `localStorage` key as the live app (`aan-theme`),
  same `[data-theme="dark"]` attribute on `<html>`.

## Typography
| Role | Face | Size / weight | Where |
|---|---|---|---|
| UI | **Archivo** (variable: weight 100–900, width 62–125 %) | 14–24 px | everything |
| Data | Archivo at `font-stretch: 96%` (`--stretch-data`) | 14 px | table cells — the width axis buys density without breaking the floor |
| Identifiers | **Plex Mono** 400/600 | 14 px | stock numbers, VINs |
| Caps label | Archivo 600, `letter-spacing: .06em`, uppercase | 14 px / 12 px | section titles in insight panel & filter groups, menu group labels |

Scale: `--text-xs 13` · `--text-sm 14` · `--text-md 15` · `--text-lg 17` · `--text-xl 24` · `--text-2xl 28`.
Tabular figures are on globally (`font-feature-settings: "tnum"`). Every number that sits in a column is
tabular; prices carry a muted `$` so the digits align.

## Colour roles
Two surfaces families and one accent:
- **Chrome** (`--chrome-*`): the graphite band that carries brand + product navigation. Fixed dark in
  both themes — it is the one authored, identity-carrying surface.
- **Workspace** (`--surface-0…3`, `--surface-inset`): cool paper page, white panels, header strip,
  hover wash, zebra/inset.
- **Ink** (`--ink-1…4`): primary, secondary, muted, placeholder.
- **Lines** (`--line-1`, `--line-2`, `--line-strong`).
- **Brand** (`--brand`, hover/active, `--brand-soft`, `--brand-ink`): AAN blue. Used for the primary
  action, the active lane, links/IDs, and selection. Nowhere else.
- **Status roles** — the only other colour on the workspace: `--ok` green · `--warn` amber · `--danger`
  red · `--slate` · `--violet` (sale pending). Each has `-soft` and `-soft-2` fills.
- **Age bands** map data to colour and deliberately leave the middle bands neutral:
  `--age-fresh` (≤30 d, green) · `--age-mid` (31–90 d, ink-3) · `--age-late` (91–365 d, ink-2) ·
  `--age-stale` (>1 y, red). Colour marks exceptions, not the majority.

Dark is a **re-solve**, not an inversion: surfaces step up in lightness, status hues are lifted to hold
contrast on dark, soft fills become alpha tints so they sit on any surface.

## Space, shape, density
- 4 px grid: `--sp-1…10` (4, 8, 12, 16, 20, 24, 32, 40). Page gutter 24 px. Page max width 1600 px.
- Radii: `--r-xs 2` · `--r-sm 4` (controls, tags, thumbs) · `--r-md 6` (panels, popovers) · `--r-lg 10`
  (modal only) · `--r-pill` (count badges only). No rounded-card language on the workspace.
- Density: row 52 px (two-line vehicle cell) / 40 px dense; control 36 px / 30 px small / 26 px xs;
  thumb 64×42.
- Elevation: three shadows; only popovers, menus and modals float. Nothing on the workspace has a
  decorative shadow.
- Motion: two durations (90 / 160 ms), one ease. Hover/pressed transitions only. Reduced-motion
  respected.

## Components (all in `components.css`)
| Block | Purpose | States |
|---|---|---|
| `.topbar` `.brand` `.nav` `.ctx` `.theme-toggle` `.account` | One chrome band: brand, product nav groups with dropdown menus, context links, theme, account | hover, focus-visible (chrome ring), `.nav__group--on`, `.nav__link--on` |
| `.page-head` | eyebrow · title · actions | — |
| `.btn` | `--primary` `--secondary` `--quiet` `--danger`; `--sm` `--xs` `--icon` | hover, active, disabled, focus |
| `.ract` | 28 px row/inline icon action | hover, `--danger` hover |
| `.input` `.select` `.search` `.kbd` `.check` `.field` | fields | hover, focus (brand ring), placeholder |
| `.facet` | filter button: label + value + caret | hover, `--on` (has a value), `--open`, `.facet__count` |
| `.pop` | anchored popover: `__search` `__list` `__item` `__foot` `__body` `__row`; `--right`; `--panel` (grouped grid) | `--open` |
| `.menu` | action/sort menu: `__item`, `--on`, `--danger`, `__sep`, `__label` | hover |
| `.tabs` `.tab` | lane tabs with counts | `--on`, `--zero` |
| `.seg` | segmented control | `--on` |
| `.pulse` | instrument strip: dot · number · label toggles + trailing stat; hairline-separated | hover, `--on` (tone fill + tone border), tone modifiers |
| `.chips` `.chip` | active filters with key/value and remove | — |
| `.tag` | status: dot + label; `--ok/--warn/--danger/--slate/--violet`; `--fill` when it must dominate | — |
| `.flags` `.flag` | health flag matrix: fixed slots, same flag always in the same column; tone fills | `--empty` keeps the slot |
| `.age` | age value with band colour; dot only on the exceptions | `--fresh/--mid/--late/--stale` |
| `.price` | tabular price with muted currency; `--none` | — |
| `.dt` | data table: sticky head, sortable headers with hanging arrow on numeric columns, hover wash, link rows, thumb, `.vehicle` two-line identity cell, `.dt__id` mono link, `.dt__actions` | hover, focus-within, `.is-selected`, loading, skeleton |
| `.toolbar` `.pager` | counts, pagination, rows-per-page | `--cur`, disabled |
| `.modal` | confirm dialog | `--open` |
| `.insights` `.bars` `.bar` `.cols` `.col` | click-to-filter bar lists / mini column chart | hover |
| `.cards` `.vcard` | gallery card: media, id, name, sub, price + flags | hover |
| `.notice` | inline info / warn | `--warn` |

Icons: one inline SVG symbol set (`#i-*`), 24-unit grid, 1.75 stroke, sized 14/16/18 px optically.
No emoji anywhere. Meaning is never carried by colour alone — every flag has a tooltip/aria label.

## Interaction rules encoded
- Whole table row is a link (cursor + wash); inline actions stop propagation.
- Destructive action lives only in the row menu, separated by a rule, and always confirms.
- `/` focuses search; `Esc` closes any popover or modal.
- Sort state is always visible (header arrow + the Sort facet label).
- Active filters always render as removable chips with a "Clear all"; the chips row is absent when
  nothing is active (no hint copy).
