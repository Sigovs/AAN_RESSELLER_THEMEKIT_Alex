# 03 — Functional mapping: original All Vehicles → redesign

Every function on `d03-inventory-1.html` (and its state variants) and where it lives now.
**Nothing was removed.** Items marked *merged* or *relocated* are justified inline.

## Navigation & chrome
| Original | Redesign | Note |
|---|---|---|
| Topbar: AAN mark, "All Auto Network", BACKEND | `.brand` in the graphite topbar | kept |
| ☰ sidebar toggle + "Legacy Tools" rail | **dropped** | the export README rules it a build-phase artefact removed at launch |
| Light / Dark pill | `.theme-toggle` icon button; same `aan-theme` key | kept |
| Account name → Logout | `.account` chip (name + dealer) with menu affordance | kept |
| Header nav: 5 dropdown groups (Site Management · Inventory Management · Dealer Tools · Support · Marketing Applications) with all 10 links | `.nav` groups in the same bar, same labels, same links; active group underlined, current page marked | *merged* into one bar: saves 36 px and puts product nav next to the brand |
| Context links Home · Support | `.ctx` right of nav | kept |

## Page header
| Original | Redesign |
|---|---|
| H1 "Inventory — Chicago Motor Cars" + "359 vehicles shown · dealer #277" | Eyebrow "Chicago Motor Cars · dealer #277", title "Inventory". The row count moved to the lane tab and the toolbar ("Showing 1–100 of 359"), where it was duplicated anyway |
| Inline Edit | `Inline edit` quiet button (same tooltip) |
| Download Inventory (CSV of scope) | `Export CSV` secondary button |
| Carfax Reports | `Carfax reports` quiet button |
| Add Vehicle (primary) | `Add vehicle` primary button |

## Scope, views, analytics
| Original | Redesign |
|---|---|
| Status pills All / Available / Sold / Pending / Staging with counts | Lane **tabs** with the same counts; zero-count lane dimmed |
| Insights ▾ toggle | `Insights` toggle in the lane bar; opens the same 4 click-to-filter charts (Top makes · By decade · Lot aging · Price mix) with the same figures |
| Table / Gallery / Photos segment | `.seg` in the lane bar; all three views render (table, card gallery, photos preset with the Sold-lane column set) |
| 7 pulse cards (New ≤30d, Aging >1yr, No photos, No price, Hidden on site, Feed excluded, Sale pending) — toggle filters | `.pulse` instrument strip, same seven toggles, same counts, pressed state, each adds a removable chip |
| Asking value · avg (non-clickable stat) | trailing stat in the same strip, visibly not a button |

## Find & filter
| Original | Redesign |
|---|---|
| Omni search (stock/VIN/year/make/model/color, `/` shortcut) | same, `/` shortcut kept |
| Make facet: searchable multi-select, 54 makes with counts, Clear, "counts = Available scope" | same popover, same list, same footer |
| Model facet: scoped to make ("Pick a make first") | same |
| Year from / Year to selects (1929–2027) | **Year** facet popover with from/to selects + decade shortcuts |
| $ min / $ max | **Price** facet popover with min/max + range shortcuts |
| More ▾: Type · Stock # · VIN · Feed · Custom field + value | **More filters** panel → Identity group (Type, Stock #, VIN, Location) and Attributes group (Custom field + value) |
| Legacy filterbar: Interior color · Exterior color · Location · No display filter · Pending Sale · Missing Items (27 options) | **More filters** panel → Merchandising group (Display on site, Outbound feed, Pending sale, Missing items — all 27 options, grouped) and Attributes group (Exterior color, Interior color). *Relocated*: these six fields were always-open but rarely used; they now sit one click away, grouped by meaning, and show a count badge on the facet when active |
| Sort By select (Stock, Year, Make, Model, Trim, Ext Color, Price, Status, Age) | **Sort** facet menu with the same nine keys + direction; column headers remain sortable and show the arrow |
| Chips row (active filters ×, Clear all) / "No filters …" hint | `.chips` row with key/value chips and Clear all; hidden when empty (hint copy dropped — the empty state is self-evident) |
| Columns: reorder ◀ ▶, remove ✕, Add column… (30 options), Reset to default | **Columns** popover: drag handle, remove, add-column select (same options), Reset to default |

## Table
| Original column | Redesign |
|---|---|
| Thumb (56 px / dashed 📷) | 64×42 thumb; missing → quiet dashed box with camera-off glyph |
| Stock (link) | Stock, Plex Mono, link colour, sortable |
| Year · Make · Model · Trim (four columns) | **Vehicle** cell: `Year Make Model` bold on line 1, trim/description muted on line 2 with the full text available on hover. *Merged*: one identity instead of four truncated fragments. Sorting by year/make/model/trim is still available from the Sort menu; the photos preset keeps the four separate columns |
| Ext Color | Ext. color |
| Price / "no price" badge | Tabular price with muted `$`; `No price` as amber text |
| Status badge | Status tag (dot + label); tone by status; quiet inside a single lane, informative in All |
| Health iconlets (emoji) | Flag matrix: fixed slots — no photos · no price · hidden · feed excluded · sale pending · lock. Same tooltips as the original titles. Lock ("Being edited by …") kept as a sixth slot |
| Age pill (green/slate/amber/red) | Age value with band colour; only ≤30 d and >1 y carry colour |
| Actions: ✏️ Edit · 📷 Photos · 🖨️ Sticker · 🗑️ Delete | Edit · Photos · Sticker as visible icon actions; **Delete moved into the row menu (⋯)** beneath a separator, still confirmed by the same modal. Row menu also repeats Edit/Photos/Sticker and adds Carfax report (already a page action) |
| Whole row → editor | same (`data-href`, cursor, hover wash, keyboard focusable) |
| Zebra striping | hairline rows + hover wash; sticky header |
| Top + bottom toolbar (Showing x–y of n, pagination, Rows 50/100/250/500/1000) | same, top and bottom |
| Delete confirm modal (hard delete, no undo) | same copy, `Cancel` / `Delete` |
| Loading state | `.dt__loading` + skeleton rows in DS (not shown in the static lab) |

## Not built in this pass (declared, not lost)
- The Model facet list for a chosen make (the export has no chosen-make state on the table page).
- Column drag reorder is visual only; "Add column…" does not add a live column.
- Lane switching does not swap data (only the Available lane's 100 rows were exported with the table page).
- The 19-car near-empty lot and empty-result states.
