# Gen 11 — MIGRATION

Taking an old backend page to Gen 11 without inventing anything.

---

## The split

**PRESERVE — the old page is the authority**

- every field, and its label as the business says it
- every action, and what it does
- the data, the counts, the states
- the workflow: what happens on save, what cascades, what is admin-only
- the destinations a control navigates to
- the information architecture: what belongs on this page at all

**REPLACE — the old page has no authority**

- every visual treatment: colour, type, spacing, radius, shadow, borders
- the layout grammar
- the control shapes
- the density

**NEVER**

- invent a field, an action, a state or a page because the layout looked thin
- copy an old visual treatment because it "looked right there"
- change what a control does while reskinning it
- decide a product question (a permission, a read-only policy) that the old page
  does not already answer — record it and ask

---

## The method

### 1 · Read the old page for meaning, not for looks

List the fields, the actions, the states and the workflow. That list is the
contract. If Gen 11 has no component for something on it, that is a gap to
report, not a licence to design.

### 2 · Pick the archetype

| the page is… | use | see |
|---|---|---|
| a list of records you scan and act on | operational list | All Vehicles, Manage Dealers |
| a list where you open records in place | list + in-flow expansion | All Leads |
| one record read top to bottom | record page | Single Lead, Single Ticket |
| one record you edit field by field | editor | Single Vehicle, Dealer Edit |
| a dense staff worklist | dense table | My Work Queue |
| money | money table | Accounting |

`PATTERNS.md` has the shell for each.

### 3 · Map the controls

| old backend | Gen 11 |
|---|---|
| `<input type=submit>` styled blue | `.btn.btn--primary` — **one per group** |
| a row of equal grey buttons | `.btn.btn--sheet` siblings, 8px apart |
| a link that performs an action | `.btn.btn--quiet` |
| a red "Delete" button | `.btn.btn--quiet.btn--del` — ink, not a red fill |
| an icon in a table cell | `.acts > button`, dense tier, 8px apart |
| `<select>` | `.fld` — same height as a text field |
| a checkbox with a paragraph | `.swrow` / `.opt` — the consequence is spelled out |
| tabs that swap panels | `.secnav` — a segmented control that scrolls a continuous page |
| a long blue underline for "current" | ink + weight + a restrained surface |
| a status word in a coloured cell | `.st` / `.bdg` — a chip, soft fill, semantic ink |
| a modal for a record | in-flow expansion under the row |
| a sticky footer CTA bar | `.savebar`, right-aligned over the workspace |
| a sidebar of links | `.rail` — a flat panel, current on a brand edge |
| pagination as numbered links | `.foot > .pg` |

### 4 · Use the tokens, not the numbers

Take `dist/aan-gen11.css` for the shared layer. Declare the page's own density
(`--row`, `--cols`) on the ladder. Never copy a pixel value out of another page
because it happened to look close.

### 5 · Check it against the contract

Before calling it done, from `RULES.md`:

- [ ] page gutter is 16px at every supported width
- [ ] every surface that holds text declares its own 16px inset
- [ ] no two interactive surfaces are closer than 6px; standalone actions are 8px
- [ ] one primary action per group
- [ ] all functional text is 11px or larger
- [ ] numeric columns are tabular and right-set
- [ ] the sticky total is derived, not hardcoded
- [ ] horizontal overflow is 0 at 1920 / 1440 / 1366 / 1280
- [ ] no control is clipped by a container
- [ ] nothing touches a surface edge

---

## Worked shapes

### A list page

    .app > .top / .head / [.bento] / .cmdtop>.lanes / .field

Put the summary above the list only if it is read before the list; it scrolls
away. The lane strip attaches to the workspace. The command band is sticky with
the bar and the column header — three layers, and their sum is derived.

If the columns stop fitting, the **list** scrolls sideways inside the workspace.
Do not drop a column, and do not freeze one.

### A detail page

    .app > .top / .head / .bento / .cmd.cmd--sec>.secnav / .field>.secs>.sec* / .dock

Continuous sections divided by a full-bleed rule. The section control scrolls the
page. Everything is present and printable.

### An editor

    .app > .top / .head / .body>(.rail + .zones + .side) / .savebar

The rail, the form and the utilities are one material. The commit bar is
right-aligned with the form. Field label is 12–13px/600 above a 40px control;
zone titles are 17px so they outrank the fields under them.

### A dense employee table

Keep every column. Row height on the ladder for the content. Status as a soft
badge, time and money tabular. A ticker or filter row above the list is one line,
hairline-separated — not a field of capsules.

### A workflow page

The state control lives in a dock beside the record, not inside the form. Flags
are checkboxes with their consequence written out. Dirty state is visible before
the commit, and the commit is the only thing that saves.

---

## What to do when Gen 11 has no answer

Report it. Add it to `PAGE-SPECIFIC.md` with the page, the selector, the geometry
and why it is unique. A pattern used once is recorded as used once — it does not
get promoted into a shared family until a second page needs it, and it does not
get quietly dropped because it is inconvenient.
