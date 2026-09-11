# 01 — Product read: Dealer UI / All Vehicles (Inventory Manager)

Source of truth: `aan-design-export-2026-09-09/pages/d03-inventory-1.html` (Chicago Motor Cars #277,
Available lane, 359 units, page 1 of 4 at 100 rows) plus variants `d03-inventory-2` (gallery + active
filters), `d03-inventory-3` (Photos preset, Sold lane), `d04-inventory-states-1` (Insights open),
`d04-inventory-states-2` (Columns open), `d04-inventory-states-3` (19-car lot).

## Page anatomy, top to bottom (as shipped)

| # | Block | Contents | Height @1440 |
|---|---|---|---|
| 1 | Topbar | ☰ (build-phase, goes away), AAN mark + "All Auto Network" + "BACKEND", Light/Dark pill, account name → Logout | 46 |
| 2 | Header nav | Site Management ▾ (Site Content Manager) · Inventory Management ▾ (Inventory Manager, Lead Manager, Auto Locator, Inventory Aging Report, Sold Inventory Report) · Dealer Tools ▾ (View Site Statistics) · Support ▾ (View tickets, Create ticket) · Marketing Applications ▾ (Newsletter Tools) · right: Home, Support | 36 |
| 3 | Page header | H1 "Inventory — Chicago Motor Cars", meta "359 vehicles shown · dealer #277"; actions **Inline Edit** (legacy grid: price/status/flags across the listing), **Download Inventory** (CSV of current scope), **Carfax Reports** (link), **Add Vehicle** (primary) | 66 |
| 4 | Deck row | Status scope pills with counts: All 13,587 · Available 359 · Sold 13,212 · Pending 0 · Staging 16; right: **Insights ▾** toggle, layout segment **Table / Gallery / Photos** | 44 |
| 5 | Pulse cards | 7 click-to-filter toggles: New ≤ 30d (73) · Aging > 1yr (40) · No Photos (95) · No Price (133) · Hidden on Site (61) · Feed Excluded (67) · Sale Pending (49); + non-clickable stat **$66,311,600 asking value · avg $293,414** | 76 |
| 5b | Insights drawer (toggle) | 4 mini charts, every bar click-to-filter: Top makes (10) · By decade · Lot aging (≤30 / 31–90 / 91–365 / >1y) · Price mix (no price / <10k / 10–25k / 25–50k / 50–100k / 100k+) | 300 |
| 6 | Find row | Omni search (stock #, VIN, year, make, model, color; `/` shortcut, 300ms debounce) · **Make** facet (multi-select checkboxes, 54 makes with counts, search box, Clear, "counts = Available scope") · **Model** facet (scoped to chosen make) · Year from / Year to selects (1929–2027) · $ min / $ max · **More ▾** | 48 |
| 6b | More panel (toggle) | Type (Any/New/Used) · Stock # · VIN · Feed (Any / Excluded (nofeedout) / Feeding) · Custom field (10 keys) + value; note: "Colors, Missing Items and per-dealer filters live in the SEARCH sidebar." | 48 |
| 7 | Chips row | Active filters as removable chips (`Make Ferrari ×`, `Flag No photos ×`, `× Clear all`) or hint text "No filters — showing all Available. Click a card, pick a make, or type to search." | 24 |
| 8 | Legacy filterbar | Interior color (text) · Exterior color (text) · Location (All + 6 rooftops) · No display filter (All / Hidden / Display Vehicle In Inventory) · Pending Sale (All / Pending Sales) · **Sort By** (Stock, Year, Make, Model, Trim, Ext Color, Price, Status, Age) · **Missing Items** (27 fields: images, 1 image or less, VIN decoding, stock#, make, model, trim, year, body, trans, mileage, ext/int color, price, discounted/invoice/lease price, lease term, vehicle type, intro/caption/main/bulleted/description 2, VIN, buyers guide, location, fuel) | 78 |
| 9 | Columns (details) | Current columns as badges each with ◀ ▶ ✕; "Add column…" select (VIN, Type, Certified, Transmission, Discount Price, Interior Color, Body, Mileage, Engine, Location, Specials, MPG cty/hwy, Car Fax, Make-Model, Make-Model-Trim, Year-Make-Model-Trim, Lease Price/Term, When Added/Modified, # Photos, Photo, Video, Invoice Price, Sale Pending, Do Not Display, Outgoing Feed Status, pending sale name); **Reset to default** | 36 |
| 10 | Table toolbar | "Showing 1–100 of 359" · pagination ‹ 1 2 3 4 › · Rows 50/100/250/500/1000 | 40 |
| 11 | Table | see below | 52/row |
| 12 | Table footer | same toolbar again | 40 |
| — | Delete modal | "Delete vehicle? This permanently deletes vehicle #… (legacy hard delete — no undo)" Cancel / Delete | — |
| — | Loading | spinner "Loading…" (wire:loading) | — |

**~515 px of chrome above the first row** (topbar → toolbar) at 1440 wide, with the content column
capped at 1152 px.

## Table (default column set, Available lane)

| Column | Type | Rendering today |
|---|---|---|
| Thumb | 56 px image or dashed 📷 placeholder | 58/100 rows have a photo |
| Stock | link → vehicle editor | sortable |
| Year | numeric | sortable |
| Make | text | sortable |
| Model | text | sortable |
| Trim | text — often marketing copy ("Only 953 Miles! Serviced! Full Luggage!") | sortable, truncated to ~11 chars |
| Ext Color | text | sortable, truncated |
| Price | right-aligned number, or amber **no price** badge (49/100 rows) | sortable |
| Status | filled green badge **Available** on 100/100 rows in this lane | sortable |
| Health | emoji iconlets: 💲 no price (49) · 📷 no photos (42) · 🙈 hidden on site (38) · ⛔ feed excluded (40) · 🤝 sale pending (16) · 🔒 "Being edited by … since …" (1) | not sortable |
| Age | pill: green ≤30d (3) · slate 31–90d (7) · amber 91–365d (54) · red >1y (36); label "23d" / "1.7y" | sortable (daysinstock) |
| Actions | ✏️ Edit · 📷 Photos · 🖨️ Window sticker · 🗑️ Delete (confirm modal) | — |

Whole row is a link to the editor (`data-href`). No checkboxes / bulk selection exist; bulk editing is
**Inline Edit** (a separate legacy grid). Zebra striping, `min-width:1080px; table-layout:fixed`,
nowrap + ellipsis.

## Tasks

Primary: find a specific unit (stock/VIN/text) → open editor; work the merchandising defects (no
photos, no price, hidden, feed-excluded); add a vehicle; see what's aging; check the lane counts.
Secondary: export CSV, inline-edit prices/status, Carfax, sticker, photos, delete, switch to gallery /
photos preset, configure columns, lot analytics (Insights), per-rooftop location filter, missing-items
audits, custom-field lookups.

## Friction and hierarchy problems

1. **Four stacked filter surfaces** (pulse cards, find row, More panel, legacy filterbar) plus a
   Sort-By select and a Columns details — six control strips before the first row. Half the viewport
   is chrome.
2. **Duplicated controls**: Hidden on Site card ≡ "No display filter" select ≡ 🙈 iconlet; Sale Pending
   card ≡ "Pending Sale" select ≡ 🤝; No Photos / No Price cards ≡ Missing Items → Images / Price ≡
   iconlets; Stock # / VIN fields in More ≡ omni search; Sort By select ≡ sortable headers.
3. **Vehicle identity is fragmented** into four truncated columns (Year | Make | Model | Trim) while
   the Trim column mostly carries marketing copy that is cut to 11 characters — the most-read cell is
   the least readable.
4. **Status column is 100 % noise inside a lane** (100 identical green "Available" badges); it only
   carries information in the All lane.
5. **Colour everywhere → colour means nothing**: 90/100 age pills are amber or red; 49 amber
   "no price" badges; 100 green status badges; emoji health icons in five colours. The eye has no
   resting surface, so exceptions do not pop.
6. **Emoji as icons**: platform-dependent rendering, no stroke consistency, meaning by picture only.
7. **Delete sits next to Print** in the action cluster with equal weight.
8. The **asking-value stat** is styled like the seven clickable cards but is not clickable.
9. The page header meta ("359 vehicles shown · dealer #277") duplicates the pill count.
10. The header nav is a second bar under the topbar; the ☰ toggle in the topbar is a build artefact.
11. Two pagination bars are correct (top for orientation, bottom for continuation) — keep.
12. The Columns editor exposes raw keys (`_thumb`, `_health`) and ◀ ▶ ✕ buttons.

## What is over-promoted / buried

Over-promoted: status badge per row, mid-band age colour, the asking-value stat, the "No filters" hint,
the legacy filter bar (always open, six fields, mostly unused).
Buried: the trim/description text, the health flags (emoji at 12 px), the sort state (no indicator on the
active column), the Insights drawer (a real analytical tool hidden behind a small deck button), the
lock ("being edited by") state.
