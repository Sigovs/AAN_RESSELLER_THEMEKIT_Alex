# Gen 11 — PATTERNS

How the pieces are assembled on a real page. Each pattern below is rendered in the
catalogue from the page named, and can be read there against its provenance.

---

## The page shell

Every page except the front door is the same three-part shell:

    .app                      grid, 16px gutter, min-height 100vh
      .top                    the platform bar — sticky, 56px, glass, radius 12
      .head                   title, context, page actions
      .field                  the workspace — white sheet, radius 14, one shadow

The bar's grid row is `--bar-track` (76px) and the bar sits at the **start** of it
with a 16px top margin, so the space above the bar is the page gutter and not
whatever centring left over.

---

## The operational list — All Vehicles, All Leads, Manage Dealers, Accounting, My Work Queue

    .head                     title · context · actions (one primary, right)
    .bento / .deck            the summary: one dark focal panel + lighter figures
    .cmdtop > .lanes          the lane strip, attached to the top of the workspace
    .field
      .cmd                    sticky: search, sort, view switch
      .sub                    scope line + facets
      .rows
        .hd                   sticky column header
        #tb .row              the records
      .foot                   count and pagination

The three sticky layers are the bar, the command band and the column header:
56 + 56 + 40 = **152px**, published as `--stick-total` and derived from the layers
themselves.

The summary is read before the list, so it scrolls away. The lane strip is
attached to the workspace because it scopes what is in it.

---

## Contextual in-flow expansion — All Vehicles, All Leads

Clicking a row opens the record **under that row, in the flow of the list**. Not a
modal, not a drawer, not a popover.

    #tb
      .row.open               the selected row, dark
      .exp.exp--open          the sheet, in flow
        .exp__in
          .exp__l / .exp__r   photo and identity, then facts and actions
          .veh__acts          one primary, four neutral, 8px apart
          .acc                stacked accordion — Health open, the rest closed
      .exp-space              lends the document height near the end of the list

The selected row comes to rest at `--stick-total + --anchor-gap` — a named
position under the sticky stack, measured at 161.6px against a 162px target.
Closing does nothing to the scroll: someone who opened at 1623, scrolled to 2223
to read, then closed would be thrown 723px from what they were reading.

---

## The record page — Single Lead, Single Ticket

    .head                     back · name · state · prev/next · actions
    .bento                    the dark summary: message, activity, facts
    .cmd.cmd--sec > .secnav   section navigation — scrolls the page, does not swap panels
    .field > .secs > .sec     continuous sections, divided by a full-bleed rule
    .dock                     the contextual panel: workflow, or crew

The page is **continuous**. The section control is a segmented control that moves
you down the page; there are no tabs and no hidden panels. Every section is
present, in order, and printable.

---

## The editor — Single Vehicle, Dealer Edit

    .cockpit / .head          which record, its headline figure, what you can do
    .prov                     added · modified · views · who holds the lock
    .body
      .rail                   the sections, a flat panel, current on a brand edge
      .zones > .zone          the form, one zone per section
      .side                   utilities: notes, options, locks
    .savebar                  the commit bar, over the workspace it commits

The rail, the form and the utilities are the **same material** — one sheet, one
hairline. The commit bar floats because the record is thousands of pixels long,
but it is right-aligned with the form, not centred on the viewport.

---

## The dense staff table — My Work Queue

Seventeen columns of live work. Nothing is dropped and nothing is frozen.

    .golive                   the go-live ticker: one line, hairline-separated
    .lanes                    twelve lanes, a joined strip
    .cmd                      search · sort · filters · clear
    .rows                     below 1340 this scrolls horizontally, the page does not

Row height is 64px because the row carries two lines in places. Status is a soft
badge, priority is a number, time is tabular.

---

## The front door — Dealer Login

The only page with no platform bar.

    .auth
      .panel                  dark, one directional brand illumination, the mark
      .form                   two fields and one action, on the optical centre
        .legal                attached to the foot of the sheet

The submit is the one focal control on the page and the only place the glow is
used.

---

## Overlays

A popover opens under its trigger, left-anchored, and flips right when it would
overflow the workspace (`fitPop()`). It is capped at 420px. A menu is a column:
`.mn__it` is block-level at full width.

The Columns popover is the one that leaves its parent — it is moved to `<body>`
and positioned, because it must escape the workspace's clip.

---

## Bulk selection

    .row .ck                  per-row checkbox
    .tray.tray--on            the action tray, appearing when a selection exists

The tray carries the actions that apply to the selection, 8px apart, and a count.
Selection and "currently open" are different states and never look alike.
