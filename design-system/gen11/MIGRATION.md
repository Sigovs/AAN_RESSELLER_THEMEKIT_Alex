# Migrating a backend page to Gen 11

For Ivaylo. This is a recipe, not a philosophy.

---

## The contract

**KEEP — the old page is authoritative for all of this:**
content · real fields · field types · features · workflow · labels · actions ·
states the product actually has · validation · permissions · what each control
does

**REMOVE — the old page is authoritative for none of this:**
styling · typography · colour · tabs · navigation appearance · radii · shadows ·
cards · spacing · table styling · legacy active states · headers

**REBUILD — from:**
`TOKENS.md` → `COMPONENTS.md` → `PATTERNS.md`, in that order.

**DO NOT:** invent a feature because a region looks empty · copy a legacy
appearance · create a new component style when an existing one fits · normalise
something listed in RULES §10 as part of an unrelated pass.

---

## Step 0 · Wire the system

```html
<link rel="stylesheet" href="…/aan-gen11.css">
```

or, inside this repo, the two source files in order:

```html
<link rel="stylesheet" href="../_aan-family.css">
<link rel="stylesheet" href="../_aan-components.css">
```

Ship Archivo and Plex Mono from `ds/fonts/`. No CDN font.

---

## Step 1 · Name the archetype

| If the page is… | It is | Composition |
|---|---|---|
| a sign-in or a standalone gate | **A · Gateway** | PATTERNS §A |
| a list of records with filters | **B · List** | PATTERNS §B |
| one record read top to bottom | **C · Record** | PATTERNS §C |
| a long form with an index | **D · Editor** | PATTERNS §D |

Get this right first. Everything else follows from it.

---

## Step 2 · Inventory the old page

Write two columns before you touch markup.

| Old thing | Gen 11 component |
|---|---|
| tab strip with a blue underline | `.ui-views` — view track, no well, no underline |
| left nav with a coloured stripe | `.ui-nav` — inset pill, soft brand fill |
| "filter" buttons that look like tabs | `.ui-filters` + `.ui-filter` + a caps key |
| toolbar of mixed-height buttons | `.ui-toolbar` + `.btn--*` at one tier |
| `<table>` with borders | `.ui-table` / `.ui-thead` / `.row` |
| status text in a coloured cell | `.bdg` with a tone pair from TOKENS §1.8 |
| a modal for row detail | in-flow row expansion (List archetype) |
| stacked panels of white cards | chapters — tonal rhythm, not more cards |
| a floating Save button | attached sticky save bar, measured height |
| native `<select>` | `.sel` / `.ui-select` with our own arrow |

Anything with **no** Gen 11 equivalent: stop and ask. Do not invent a component.

---

## Step 3 · Build the shell

Every page, every archetype:

```html
<div class="app">
  <header class="top">…platform bar…</header>     <!-- sticky, z20, 56px -->
  <div class="head">…page identity…</div>
  …archetype body…
</div>
```

- page gutter **16px** at every width
- chrome → identity **16px**; block → block **24px**
- the identity row carries the subject, its state chips and the page's actions —
  one primary, the rest sheet or quiet

---

## Step 4 · Build the body

### List

1. optional dark intelligence band (`--focal`, r14, `--sh-card`)
2. the sheet (`--sheet`, r14, `--sh-soft`, `overflow: clip`)
3. inside the sheet, in order: view track → toolbar → sub-toolbar → scope line →
   `.ui-thead` → rows
4. pick the row height from the density table (TOKENS §4.3)
5. sticky: bar 56 + toolbar 56 + header 40; derive offsets, never copy them

### Record

1. focal summary + identity panel, each its own content height
2. the sheet with a sticky section band
3. sections as **numbered chapters** with alternating ground
4. the working rail as a dock (400px)

### Editor

1. `.ui-nav` rail · zones · utilities column
2. zones as numbered chapters
3. two-column field grid, label above control
4. attached save bar, measured height

---

## Step 5 · Worked examples

### 5.1 List page — a legacy table screen

```html
<!-- BEFORE: legacy -->
<ul class="tabs">
  <li class="active"><a href="#">Active</a></li>   <!-- blue underline -->
</ul>
<table class="grid" border="1">
  <tr class="hdr"><td>Company</td><td>Status</td></tr>
</table>
```

```html
<!-- AFTER: Gen 11 -->
<section class="field">
  <div class="ui-toolbar">
    <div class="ui-views" role="group" aria-label="Views">
      <button class="ui-view ui-view--on" aria-pressed="true">Active <b>317</b></button>
      <button class="ui-view" aria-pressed="false">All <b>1,109</b></button>
    </div>
    <span class="ui-toolbar__sp"></span>
    <button class="btn btn--sheet">Filters</button>
  </div>

  <div class="ui-filters">
    <span class="caps flt__k">Roster</span>
    <button class="tl ui-filter tl--on" aria-pressed="true">Pending <b>24</b></button>
  </div>

  <div class="ui-table">
    <div class="hd ui-thead"><span>Company</span><span>Status</span></div>
    <div class="row">…</div>
  </div>
</section>
```

The tab strip became a **view track**; the filters became a **filter set with a
caps key** so the two read as different jobs.

### 5.2 Detail page — a record with sections

Old: five white panels stacked with 24px between them.
New: one sheet, five **chapters** — alternating ground, full-bleed boundary,
counted head. No extra card is created.

```html
<div class="secs">
  <section class="sec" id="s-overview">
    <div class="sec__h"><h2>Overview</h2><span class="s">what this is</span></div>
    <div class="sec__b">…</div>
  </section>
  <section class="sec" id="s-activity">…</section>   <!-- warm live ground -->
</div>
```

### 5.3 Edit page — a long form

Old: labels left of controls, mixed field heights, a floating Save.
New: `.ui-nav` rail, zones as chapters, label above control, all fields at the
**40px field tier**, one attached save bar whose height the page reserves.

### 5.4 Staff table — a dense operational grid

Same as 5.1 with `--row: 64px`, two-line meta in the identity cell, and row
actions at `--ctl-dense` 30px with 4px between them.

### 5.5 Workflow page — a record you act on

Record archetype plus a dock. State lives in the dock, not scattered through the
form. History gets the thread pattern (PATTERNS §C.2) if people talk in it.

---

## Step 6 · Verify before you call it done

Run these against the rebuilt page:

- [ ] every spacing value is on the scale (RULES §1.1)
- [ ] nothing touches; 8px minimum between controls (§1.4)
- [ ] text is vertically centred in every pill, chip, badge, cell (§1.5)
- [ ] no horizontal scrolling at 1280 / 1366 / 1440 / 1920 (§9)
- [ ] no clipped label at the resting viewport edge
- [ ] header and row grid templates are **identical strings**
- [ ] blue appears only on links and "you are here" (§7.1)
- [ ] every dark surface keeps a dark hover (§7.2)
- [ ] body and control text ≥ 4.5:1 against the **composited** background (§7.3)
- [ ] sticky offsets are derived from tokens, not literals (§8)
- [ ] a selected row rests at `stack + anchor-gap`, not centred
- [ ] fixed chrome publishes its measured height and the page reserves it
- [ ] any popover is fully reachable at 1366×610
- [ ] no component from ANTI-PATTERNS.md is present

Measure the rendered page, not the source. A gap that exists in CSS and collapses
at a breakpoint is a failure.

---

## Step 7 · When something genuinely has no home

If the old page has a control with no Gen 11 equivalent:

1. describe what it **does**, not what it looks like
2. check whether an existing component does that job in a different shape
3. if nothing does, raise it — a new component enters the system deliberately,
   with its tokens, states and a line in COMPONENTS.md

**Never** solve it by inventing a one-off style on the page. That is how 505
page-specific classes accumulated.
