# GEN 11 — UI CLEANUP PASS

**Date** 2026-09-29 · **Scope** all ten Gen 11 pages · **Mode** implementation only.
No audit, no new features, no Gen 12, nothing committed or pushed.

Every fix below lives in **`pages/_aan-family.css`**, the shared layer that loads
last on all ten pages, so the family agrees in one file instead of drifting in ten.
Sections `11a`–`11p`.

---

## What changed, by symptom

### 1 · Legacy tabs are gone (`11g`)
Lanes carried **two selection mechanisms at once** — a 2px inset brand underline
*and* a brand-soft fill — the underline being the 2015 backend's. Now one
mechanism: a recessed track, the current lane on a raised white thumb, no
separators, no underline. Applied family-wide, so All Vehicles, All Leads and My
Work Queue select the same way.

### 2 · Bands stopped floating inside sheets (`11f`)
The command band had its own radius, its own hairline ring and its own shadow
while sitting flush inside `.field` — it read as a slab dropped on the page with
its corners cut off by the sheet it lived in. A band inside a surface now
separates with a hairline; the sheet keeps the corners.

### 3 · One radius scale, actually applied (`11a`, `11b`)
All Vehicles alone carried **nineteen different radii (2→28)** after the Gen 9
transplant: sheets at 28, cards at 24, bars at 24, popovers at 18, insets at 16.
The scale already existed in the family layer and was never applied. Now:
surfaces `14`, panels and bands `12`, controls `9`, inner surfaces `7`, media `4`.
The pill is reserved for status, lanes, segmented controls, filter chips,
counters, avatars and switches — never for buttons, facets, fields or sheets.

### 4 · Nothing overflows its own box (`11h`, `11j`, `11k`, `11l`, `11m`, `11n`)
Measured, not guessed:
- staff nav needed **846px in a 770px box** — the last destination rendered as
  "Accc". Tightened to fit; now 770/770 with all eight destinations intact.
- the go-live strip overflowed by **666px** and was amputated mid-word; it
  scrolls now, with the edge fading so "there is more" reads.
- six table cells on My Work Queue cut text mid-glyph; cells truncate with an
  ellipsis.
- the All Leads command row measured **1403px inside a 1393px sheet**, so the
  sheet itself overflowed; the search field is elastic and every child may shrink.
- Single Lead's section band measured **987 in a 977 sheet**; it scrolls. The raw
  ADF block and mail previews no longer run past their boxes.

### 5 · Sticky layers are one material (`11c`)
The bands were sticky already — the failure was transparency: rows scrolled
through a .72-alpha band and a borderless white header. Both are dense now, with
a hairline and a shadow, in light and dark.

### 6 · Controls are one family (`11d`, `11i`)
Same heights and paddings everywhere: buttons 36 (small 30, large 44), facets 36,
segmented 36, chips 24. A toolbar row no longer mixes a bordered field, a
containerless sort block and bare text links.

### 7 · The save bar is a footer, not an island (`11o`)
Dealer Edit shipped it as a 229px translucent slab fixed at bottom-right,
floating over the "Projects / My Garage" heading. It spans the work area now,
sits on a solid surface with a hairline above it, and the page reserves its height.

### 8 · No rail hangs past its panel (`11p`)
Single Ticket's rail list sat 8px outside its container on both sides via negative
margins, and the container clipped it — a hanging slab with cut edges.

---

## Pages touched

All ten, through the shared layer:
`all-vehicles` · `all-leads` · `single-lead` · `single-vehicle` · `dealer-login` ·
`my-work-queue` · `single-ticket` · `manage-dealers` · `dealer-edit` ·
`accounting-view-all`.

Only the shared layer and the ten `?v=` asset stamps were edited. No page markup,
no data, no behaviour.

---

## Deferred, deliberately

- **User-resizable / user-ordered columns** — a feature, not a visual fix.
- **Dark theme sweep** beyond the sticky layers — the surfaces were checked, a
  full per-page dark pass is its own job.
- **The two remaining radius outliers** (2px meters, 5px micro-bars) — decorative
  hairlines, not component radii.
- **All Vehicles' popover internals** — the photo does not fill its 420px lane and
  the right column still runs short; structural, needs its own pass.
- **Accounting's 211 "hanging" hits** — detector artefact from the scrollable
  table, not a visible defect.
