# GEN 11 — STAGE 2 REPORT
## Selected vehicle in-flow migration + detail IA

**Date** 2026-09-27 · **Scope** `all-vehicles-gen11.{html,css,js}` only · **Cache key** `202609271700` → `202609272130`
**Authority** Where the original Stage 2 blueprint and `GEN11_STAGE2_BLUEPRINT_VERIFICATION.md` disagreed, the verification document decided. Every such case is named in §7.

| file | before | after |
|---|---|---|
| `all-vehicles-gen11.css` | 2865 lines | 3013 lines |
| `all-vehicles-gen11.js` | 484 lines | 526 lines |
| `all-vehicles-gen11.html` | 238 lines | 238 lines (cache key only) |

Nothing outside these three files was touched. No Gen 12, no `DESIGN.md`, no Git.

---

## 1 · What the baseline actually measured

Captured before any source change, at 1280 / 1366 / 1440 / 1920, into
`reference/gen11-stage2-baseline/` (`baseline.json`, five screenshots, `harness2.js`).

The five owner concerns were not opinions. Every one of them is a number:

| | baseline | meaning |
|---|---|---|
| expansion `position` | `absolute`, `z-index: 3` | it had left the list |
| its edges vs the row's | **+8 / −8px** | inset inside its own row |
| gap to the row | **8px** | with a dimmed foreign row showing through it |
| radius / shadow | **18px** / `0 30px 64px −18px` | a floating card, i.e. a modal |
| sibling rows painted over | **up to 14** | of 15 |
| sibling rows dimmed | **15** | all of them |
| document growth | **+11px** for 696px of content | it reserved nothing |
| `#exp-space` | present, `display: none`, `0px` | the document extender was dead |
| selected row's rest position | **84 / 454 / 602 / 1120px** below the sticky stack | there was no anchor; the row stayed wherever it happened to be, because opening scrolled nothing |
| footer below the workspace | **false** in the tall states | the workspace ran past the pagination |
| detail container | `grid-template-columns: 1fr 1fr` + `.acc--open { grid-column: 1/-1 }` | five equal bars in a 2×2 grid; opening one re-flowed the other four into new columns |

Two baseline facts worth keeping: horizontal overflow was already **0** at all four widths
(Stage 1 holds), and at 1366×768 the page shows **one row at rest** — the sticky stack ends at
635px because of the bento, not because of the bars.

---

## 2 · The expansion is now part of the list

`position: static`. It sits between its row and the next one, reserves its own height and shares
the row's left and right edges exactly.

| | before | after |
|---|---|---|
| position | `absolute` + a one-shot `ex.style.top` | `static` |
| edge delta L/R | +8 / −8 | **0 / 0** |
| seam gap | 8px | **0** |
| rows covered | up to 14 | **0** |
| rows dimmed | 15 | **0** |
| document growth | +11px for 696px | **+716px for 696px** (the +20 is the two detach margins) |
| footer below the workspace | false | **true** |
| elevation | `0 30px 64px −18px` | `inset 0 0 0 1px var(--line)` — a hairline |

Identical at 1280, 1366, 1440 and 1920.

`ex.style.top` was the root defect, not a detail: it was written once at render and never
corrected, so any later reflow — a filter, the dock, a resize — left the sheet behind its row.
Height now belongs to the layout engine, which cannot fall out of step.

**The dimming is gone.** `.field.has-open .row:not(.open) { opacity: .55 }` and its `:hover`
partner were deleted outright, as instructed.

**`.exp__x` is kept.** It exists on both Gen 11 and All Leads today; the original blueprint
proposed deleting it and the verification reversed that (§4). It still closes the vehicle.

---

## 3 · The anchor

Restored, not invented. It is the behaviour `all-leads-gen10.js:187` has shipped all along, where
it is spelled `− 56 − 58 − 48 − 10`. Here the geometry is read from the tokens CSS already
publishes instead of being hardcoded a second time:

```
y = rowTop + scrollY − (--stick-bar + --stick-cmd + --stick-hd) − --anchor-gap
                        68     +   72     +   52       +   10     = 202px
```

| test | result |
|---|---|
| first row | delta **10** |
| middle row | delta **9** |
| last row | delta **9** |
| travelling **upward** (1331 → 517) | delta **10** |
| under `prefers-reduced-motion` | settled within **60ms**, delta **10** |
| with Filters open | delta **10** |
| at 1280 / 1366 / 1440 / 1920 | **10 / 10 / 10 / 10** |

**The document extender works.** `#exp-space` is live again (`display: block`, height owned by JS).
At 1920×1042 the last row cannot reach the anchor on its own; the spacer lends the shortfall —
measured **69px**, document 2526 → 2595, and `maxScroll` lands exactly on the anchor target of
1553. Without it the last rows would never reach the anchor, which is why the blueprint's proposal
to delete `#exp-space` was reversed (§14.2).

**Closing does nothing to the scroll.** Measured drift: **0px**. Scroll restoration was rejected on
evidence — it does not exist in the shipped product, and it would have thrown a user who opened at
1623, scrolled to 2223 to read and then closed back to 1500, 723px from what they were reading.

**Switching is an ordinary open of another row.** The 200ms `setTimeout` is gone: it paid for an
exit fade on an element the next render destroyed anyway, and frequently skipped the entrance.
`S.expNow` is gone (it was written twice and never read).

**§11 checked, no action needed.** The verification asked whether the anchor survives the dock
changing the row grid. Measured: 10 before opening Filters, 10 with it open, 10 after closing. Row
height is unchanged at 74px. No re-anchoring code was added.

---

## 4 · The detail is four ordered regions

The 2×2 grid and `.acc--open { grid-column: 1 / -1 }` are deleted. One column, hairline
separators, ordered by what the reader needs first:

**Merchandising health → Market intelligence → Specification → History**

**Health has no disclosure.** It is the first thing the sheet says, so it is a heading, not a
question. It uses the product's existing strings — `All clear` and `N of 6 need work` — not the
blueprint's invented "merchandising clear" (§10). The failing checks are listed as rows; the
passing ones collapse to one quiet line that still names them, so nothing is lost.

**Market and Comps are one region.** They were always reporting the same N — Market's "Comparable
listings · N · last 90 days" and Comps' "All N comparable listings" are the same number. Grouping
them changes no meaning.

**Provenance precedes the visualisation.** `visor.vin market data · not connected` was the last row
of a table underneath the chart. It is now the first line of the region, before the numbers it
qualifies.

### Opening a region changes the size of exactly one thing

| region | top before | top after opening Market | delta |
|---|---|---|---|
| health | 892 | 892 | **0** |
| market | 996 | 996 | **0** |
| spec | 1043 | 1808 | +765 |
| hist | 1089 | 1855 | +766 |

Nothing above the opened region moves, and the two below shift by exactly its growth. All four
regions share one left edge and one width — the 2×2 grid used to move sections into different
columns as you opened them. Titles align at x=490, summaries at x=1841.

---

## 5 · Nothing was broken

| check | result |
|---|---|
| horizontal overflow, 1280 / 1366 / 1440 / 1920 | **0 / 0 / 0 / 0**, in default, filters-open and vehicle-open |
| rows at rest, 1366×768 | 1 before → **1 after** |
| bento at 1280 (the §17 concern) | `540px 240px 423.733px` — correctly assigned, does **not** reproduce Single Lead's defect |
| workspace vs chrome, every scroll position | the **header wins**; the workspace paints under it |
| header opacity while scrolling | **1** at 600 / 900 / 1200 / 1500 — no `hd--veil` reintroduced |
| tray hit-testable with a vehicle open | **yes** (left / centre / right) |
| Stage 1 · lane rail with Filters open | `display: flex` |
| Stage 1 · Attention padding | `14px 18px 18px` |
| Stage 1 · sticky engaged state fires | `cmd--stuck` + `hd--stuck`, stack bottom 192 |
| Stage 1 · focus outline | `2px solid rgb(31,95,224)`, offset 2px, `:focus-visible` matches on Tab |
| `window.G8demo` | intact — `S V closeDock closeVehicle showFilters showVehicle` |
| hash states | `#vehicle=19495&open=market` opens that vehicle at anchor 10 with Market open |
| console | **clean** — no errors, no warnings |
| CSS brace balance | 790 / 790 |

---

## 6 · Judgement calls, stated plainly

Four places where I decided something the brief did not settle. Each is one line to reverse.

**1 · The selected row is navy (`--focal`), not `#6A7285` and not `--brand-soft`.**
`#6A7285` existed to match Gen 10's grey command band, which Gen 11 no longer has — the band is
glass now. The verification (§9) flagged that moving it to `--brand-soft` would collide with
`.row.sel`, which means bulk selection: two different states sharing one appearance. `--focal` is
the file's own token, it is what the rule originally reached for before the override, and every
`.row.open` ink rule (white text, `#b9f0d2`, `#ffc7bf`) was already written for a dark surface.

**2 · Specification carries a `Demo` badge.**
Measured, its six fields are: Trim, Exterior and Stock # (all three duplicate the row) and Type =
"Used", Mileage = "Not recorded", Location = "Chicago Motor Cars" (all three hardcoded constants).
The verification said not to silently empty the region and to record that it carries no unique
real data. Badging it uses an element already on three sibling regions rather than inventing
anything, and it stops three constants reading as facts. Revert by dropping the last argument to
that one `acc(...)` call.

**3 · No height animation on the expansion.**
The `0fr → 1fr` grid technique is kept in the markup and CSS shape (§14.7), but the open state
commits to full height immediately. Animating the height while computing a scroll anchor makes the
anchor non-deterministic — the document height is an input to the extender. The content still
fades in; the entrance now actually plays, because the inserted element is committed with a reflow
read before the state class lands, which the old code never did.

**4 · The merged region is called "Market intelligence".**
Three of the four region names in your brief match existing headings. This one does not, because
the merged region did not exist before and had no name. I used yours.

---

## 7 · Where the verification document overruled the blueprint

Applied as written, all of them:

| | blueprint proposed | applied |
|---|---|---|
| ↑ / ↓ vehicle switching | add it | **not added** |
| focus to the workspace heading on open | add it | **not added** |
| focus back to the trigger on close | add it | **not added** |
| scroll restoration on close | remember / restore / discard / re-derive | **not added**, drift measured at 0 |
| section rail inside the workspace | option A | **not added** |
| delete `.exp__x` | delete | **kept** |
| delete `#exp-space` | delete | **restored to use** — it is load-bearing for the anchor |
| "merchandising clear" | new string | **existing** "All clear" / "N of 6 need work" |
| anchor at `--stick-total` flush | flush | **`--stick-total + 10px`**, the shipped value |
| anchor tolerance band, downward-only travel | add | **not added** — measured, the shipped anchor always lands exactly, in both directions |
| retire `--exp-offset` | delete | **renamed** `--anchor-gap`, which is what it is |
| re-author the engaged sticky composition | in Stage 2 | **not touched** — it changes `--stick-total`, which the anchor depends on |

No new buttons, controls, shortcuts, keyboard behaviour, live regions, analytics, data, workflow
actions or state management were added anywhere in this pass.

---

## 8 · Two things I found on the way

**The published-token reader was broken and had been passing by luck.** Custom properties are
substituted but not evaluated, so `getPropertyValue('--stick-hd-top')` returns the literal text
`calc(68px + 72px)` and `parseFloat` gives `NaN`. Stage 1's sticky code fell back to `140`, which
happens to be the right answer — so the bug was invisible. The anchor needs a reader that actually
works, so both now sum the three plain values (`--stick-bar`, `--stick-cmd`, `--stick-hd`). No
value and no design changed; the contract just functions now.

**Specificity, not source order, decides the region headings.** `.exp .exp__accs .acc__h` is
(0,3,0) and outranks a (0,2,0) rule however late it appears, so my first attempt left the three
disclosed headings indented 10px and the static one not. Caught by measuring, fixed by matching the
weight. Same class of trap as Stage 1's relocation problem, from the opposite direction.

---

## 9 · Carried forward, not fixed

**The sheet has a void when every region is collapsed.** The left column (photo, figures, seven
action buttons) is 650px; the fully collapsed region column is 321px, so 329px of the sheet is
empty. This is **not new** — the baseline had roughly 270px of the same void, and the sheet's
height was already driven by the left column (696px then, 696px now). The restructure made the
right column more compact, which widened the gap by about 59px. Opening any region closes it —
Market alone takes the right column to about 1085px.

Fixing it properly means recomposing the two-column sheet, which is a composition decision beyond
this pass. It belongs with the sticky-band work that §19 also moved out of Stage 2.

**Also deliberately untouched:** the sticky stack's height and its engaged composition, the
`.top` / `.cmd` two-corner seam, the dock-open column collapse, and the row's disclosure semantics
(`role`, `aria-expanded`, Space) — all deferred by the verification to later stages.

---

## 10 · Evidence

```
reference/gen11-stage2-baseline/
  baseline.json                      every number in §1
  harness2.js                        deterministic states + the measured contract
  verify2.js                         the acceptance sweep
  1366-default-atrest.png            one row at rest
  1366-vehicle-all-regions-full.png  the 2x2 grid with everything open
  1440-vehicle-open.png
  1920-default.png
  1920-vehicle-open-full.png         the floating card over dimmed rows
  all-vehicles-gen11.{css,js,html}   pre-Stage-2 source snapshot

reference/gen11-stage2-after/
  after.json                         every number in §2–§5
  1280-filters-plus-vehicle.png
  1366-vehicle-open.png
  1440-vehicle-open.png
  1440-vehicle-all-regions-full.png
  1920-vehicle-market-full.png       the workspace in flow, rows continuing below it
```

---

## 11 · Correction pass — 2026-09-27

Verification accepted the anchor and the in-flow conversion and rejected two things. Both are fixed.
Cache key `202609272130` → `202609272300`. CSS 3013 → 3021 lines, JS 526 → 529.

### 11.1 · The last three top-level accordions are gone

The verification was right and my §4 was wrong about what it had delivered. Stage 2 removed the 2×2
grid but left Market intelligence, Specification and History as three independent top-level
accordions, collapsed by default — so at rest the sheet read as one open section above three closed
53px bars, not as a continuous workspace.

All four regions are now built with `staticRegion()`. There are **zero** disclosure buttons in the
sheet.

| | before | after |
|---|---|---|
| top-level regions | 4 | 4 |
| independently collapsible | 3 | **0** |
| collapsed by default | market, spec, hist | **none** |
| workspace height at 1440 | 696px | 1445px |

Region content heights at 1440: health 40 · market 766 · spec 92 · history 196.

**Inspected before deleting — and kept, because the Filters dock still needs all of it:** `acc()`
(11 facet groups), the `.acc__h` click handler, `.acc--open`, `setAccOpen()`, and the `0fr → 1fr`
`.acc__p` mechanism. Verified after the change: the dock still has 11 disclosure buttons, toggling
works, `aria-expanded` tracks, the panel animates (measured 366px), and `S.acc` is still written.

**Deleted as genuinely dead:** the sheet's `S.acc` keys (`health/market/comps/spec/hist` — a fresh
load now shows only the eleven `f-*` keys), and the `.acc--static > .acc__hd::after` rule that
reserved a chevron slot for a chevron that no longer exists anywhere in the sheet.

**Added:** `.exp .acc--static > .acc__p { display: block }` and `> div { overflow: visible }`. A
region that can never open has no use for the disclosure grid, and dropping it also drops the
`overflow: hidden` that came with it — which is what would clip a region whose height resolves late,
such as the market histogram. The mechanism itself stays in the file for the dock.

### 11.2 · The Specification Demo badge is gone

It was mine, added in Stage 2, and Specification's provenance was deferred — so it was out of scope.
The call is back to the pre-Stage-2 shape (minus the accordion):

```
acc('spec', …, specIn, ' <span class="demo">Demo</span>')
  →  staticRegion('spec', 'Specification', esc(v.tr || 'No trim recorded'), specIn)
```

No provenance redesign, no data change, no replacement wording. Market intelligence keeps its `Demo`
badge and its `visor.vin market data · not connected` line, which is still the region's first line.
History keeps its badge.

### 11.3 · Accepted behaviour re-verified

| | 1440 | 1366×768 | final row | Filters + vehicle |
|---|---|---|---|---|
| selected-row top (target 202) | 201.33 | 201.33 | 201.47 | 201.33 |
| deviation | −0.67 | −0.67 | −0.53 | −0.67 |
| seam | 0 | 0 | 0 | 0 |
| workspace vs row edges | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| sibling overlap | 0 | 0 | 0 | 0 |
| unrelated rows dimmed | 0 | 0 | 0 | 0 |
| horizontal overflow | 0 | 0 | 0 | 0 |
| sheet accordion buttons | 0 | 0 | 0 | 0 |

Console clean. Sticky geometry, sticky visuals, lane controls, summary cards, global controls,
Filters behaviour and bulk selection all untouched.

### 11.4 · `#exp-space` has changed status — worth knowing

The mechanism is intact: the node exists, `display: block`, and JS writes its height (`0px`). At
1440 with the last row open the arithmetic reads `target 1553` against `scrollable max 2470`, so
`need = −917` and the spacer correctly stays at zero.

But the continuous workspace is now ~1445–1468px tall instead of 624px, so it supplies far more
run-out below the anchor than it used to. The spacer would only be needed at a viewport height above
roughly **1672px**, which this display cannot produce — before the correction it fired at 69px on a
1042px-tall viewport. **It is now a safety net rather than an active path.** I could not make it
engage again, so the last live proof of it firing is the pre-correction capture.

### 11.5 · One scare, chased down

During re-verification a run showed the selected row drifting 45–240px past the anchor after
settling. I wrapped `window.scrollTo` and `Element.scrollIntoView`: exactly **one** programmatic
scroll was recorded — `anchorRow` at t=8ms — and no second call. A clean run (fresh load, one click,
16 samples over 4s) travels to the anchor by ~1000ms and holds `rowTop` at 201.5 for the next three
seconds. It was my own test sequence — back-to-back resets and clicks leaving a smooth scroll in
flight — not the product. The harness has been changed to stop writing the now-dead `S.acc` keys.

### 11.6 · Evidence

```
reference/gen11-stage2-correction/
  correction.json
  01-1440-selected-vehicle.png
  02-1366x768-selected-vehicle.png
  03-final-row-anchored.png
  04-workspace-four-continuous-regions-full.png
  05-filters-plus-selected-vehicle.png
```

**STAGE 2 COMPLETE — corrections applied.**
