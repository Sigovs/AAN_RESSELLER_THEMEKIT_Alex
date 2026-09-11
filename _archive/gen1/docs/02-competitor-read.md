# 02 — Competitor read: DriveCentric Inventory (research only)

Scope: `drivecentric_reference/drivecentric/blueprint/04-inventory.md`, `15-app-chrome-navigation.md`
and the two inventory viewport captures. Nothing else opened. No file, asset, wording or code moves out
of the reference folder.

## Patterns worth interpreting for AAN

| Pattern | What DriveCentric does | What AAN should take from it |
|---|---|---|
| **Facets as a single named row** | One row of facet buttons (Status · Price · Make · Model · Year · Color · Mileage · Trim …), each opening its own popover; `Clear All` right-aligned. | Collapse AAN's four filter strips into **one facet row** with popovers; active filters become chips under it. |
| **Self-excluding facet counts** | A facet's counts are computed excluding its own selection, so picking Ferrari never zeroes the Make list. | AAN's Make facet already shows counts "= Available scope"; keep counts, note self-exclusion as the correct behaviour. |
| **One toolbar for search + sort + view** | Search box, sort dropdown and grid/list toggle on the same line. | Search and Sort share a row; view switch lives with the lane tabs (the two are both "how am I looking at this scope"). |
| **Composed vehicle identity** | Card header: `USED · stock #` eyebrow, then bold `Year Make Model`, then trim, then store. | In the table, render **Year Make Model** as one bold cell with the trim/description as a second muted line, instead of four truncated columns. |
| **Price as the headline number** | Large, bold, tabular price per card; `-` when zero. | Price gets the strongest weight in the row after the identity; "no price" is an explicit state, never "$0". |
| **Age ascending is the default sort** | `daysOld` asc. | Keep AAN's Stock default but make the sort state visible; Age is one click away. |
| **Calm, low-chroma chrome** | Grey rail, white page, one accent colour used only for selection. | Colour only for state and exceptions; the resting surface is neutral. |
| **Lead/deal counts on the vehicle** | `leadsCount`, `lastLeadOn`, `dealsCount` as columns. | Not in AAN's data today — flagged as a future column candidate (Leads per vehicle) once Lead Manager and Inventory share data. Not built now. |

## What must NOT transfer

- **Read-only sales tool vs merchandising tool.** DriveCentric exposes no edit / photos / sticker /
  delete / feed / hidden-on-site controls. AAN's page is an operations surface — action density and
  health flags are the point. Do not strip them to look "clean".
- **Gallery-first default.** A 359-unit lot with 15 configurable columns is table work. Table stays the
  default; gallery / photos remain presets.
- **Dealer-branded placeholder banner for missing photos.** In AAN a missing photo is a defect to fix,
  not something to dress up. Keep it visibly empty and flagged.
- **Infinite scroll.** AAN users page at 100–1000 rows and need "1–100 of 359"; keep pagination top
  and bottom.
- **Icon-only left rail with badge counts and slide-over panels.** AAN's header nav is the permanent
  navigation and the left rail is explicitly being removed at launch.
- **Their brand accent, typeface, card radius, purple primary.** Nothing visual is copied.
- **`Undefined` leaking into cells.** Missing = `—`, never a literal.
