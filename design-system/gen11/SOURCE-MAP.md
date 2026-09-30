# Gen 11 — STYLE SOURCE MAP

**What makes every visible Gen 11 component look the way it does, and which file does it.**

This document is generated, not written. A probe walked all ten shipped pages at
1440×900, recorded every class token on a visible box, and for each token asked the
browser which CSS rules actually match it and from which stylesheet. The numbers
below are measurements of the running product.

    regenerate:  design-system/gen11/_tools/probe.html  →  map-all.json  →  this file

---

## 0 · The finding that reshaped the catalogue

`dist/aan-gen11.css` contains `pages/_aan-family.css` + `pages/_aan-components.css`.
Those two files are **override layers**. They do not define the components; they
correct and normalise components that the page stylesheets define.

Measured across the ten pages:

| | |
|---|---|
| distinct class tokens on visible boxes | **667** |
| appear on 2 or more pages (shared) | **197** |
| appear on exactly one page | **470** |
| component blocks (BEM roots) | **309** |
| blocks styled **only** by the two shared files | **36** |
| blocks that need at least one page stylesheet | **273** |

So a catalogue that loads only the dist bundle can render a small minority of the
system. Everything else renders unstyled — which is why the previous catalogue had
to draw substitutes. The fix is architectural and is described in `README.md`:
each specimen is hosted against the real stylesheet stack of the page it came from.

### The eight stylesheet stacks

Ten pages, eight distinct stacks. Load order is significant — the page sheet first,
then the family layer, then the component layer.

| stack | pages | stylesheets, in order |
|---|---|---|
| `av` | All Vehicles | all-vehicles · ~family · ~components |
| `leads` | All Leads | all-vehicles · all-leads · ~family · ~components |
| `lead` | Single Lead | all-vehicles · single-lead · ~family · ~components |
| `vehicle` | Single Vehicle | single-vehicle · ~family · ~components |
| `login` | Dealer Login | dealer-login · ~family · ~components |
| `queue` | My Work Queue | my-work-queue · ~family · ~components |
| `ticket` | Single Ticket | single-ticket · ~family · ~components |
| `dealers` | Manage Dealers | manage-dealers · ~family · ~components |
| `dealer-edit` | Dealer Edit | dealer-edit · ~family · ~components |
| `accounting` | Accounting — View All | accounting-view-all · ~family · ~components |

---

## 1 · Shared component blocks

Present on two or more pages. Sorted by reach, then by how often they are used.

| block | pages | tokens | uses | rules come from |
|---|---|---|---|---|
| `.btn` | 10 | 12 | 1414 | dealer-login · ~family · ~components · all-vehicles · single-vehicle · my-work-queue · single-ticket · manage-dealers · dealer-edit · accounting-view-all · single-lead |
| `.nav` | 9 | 5 | 178 | all-vehicles · ~family · single-vehicle · my-work-queue · single-ticket · manage-dealers · dealer-edit · accounting-view-all · ~components |
| `.brand` | 9 | 3 | 27 | all-vehicles · ~family · single-vehicle · my-work-queue · single-ticket · manage-dealers · dealer-edit · accounting-view-all |
| `.caps` | 9 | 1 | 26 | dealer-login · ~family · ~components · all-vehicles · single-vehicle · my-work-queue · single-ticket · manage-dealers · accounting-view-all |
| `.tbtn` | 9 | 2 | 17 | all-vehicles · ~family · ~components · single-vehicle · my-work-queue · single-ticket · manage-dealers · dealer-edit · accounting-view-all |
| `.app` | 9 | 1 | 9 | all-vehicles · single-vehicle · ~family · my-work-queue · single-ticket · manage-dealers · dealer-edit · accounting-view-all |
| `.top` | 9 | 1 | 9 | all-vehicles · ~family · single-vehicle · single-lead · my-work-queue · single-ticket · manage-dealers · dealer-edit · accounting-view-all |
| `.gsearch` | 9 | 1 | 9 | all-vehicles · ~family · single-vehicle · my-work-queue · single-ticket · manage-dealers · dealer-edit · accounting-view-all |
| `.head` | 8 | 11 | 31 | all-vehicles · ~family · single-lead · my-work-queue · single-ticket · manage-dealers · dealer-edit · accounting-view-all · all-leads |
| `.s` | 7 | 3 | 58 | all-vehicles · my-work-queue · ~components · single-ticket · manage-dealers · accounting-view-all |
| `.ui-view` | 7 | 2 | 46 | ~components |
| `.ui-toolbar` | 7 | 2 | 27 | ~components |
| `.cmd` | 7 | 2 | 9 | all-vehicles · ~family · single-lead · my-work-queue · manage-dealers · accounting-view-all · single-ticket |
| `.ui-views` | 7 | 1 | 8 | ~components |
| `.field` | 7 | 1 | 7 | all-vehicles · ~family · all-leads · single-lead · my-work-queue · single-ticket · manage-dealers · accounting-view-all |
| `.lane` | 6 | 6 | 47 | all-vehicles · ~family · ~components · all-leads · my-work-queue · single-ticket · manage-dealers · accounting-view-all |
| `.search` | 6 | 3 | 9 | all-vehicles · ~family · ~components · my-work-queue · manage-dealers · accounting-view-all · single-lead |
| `.lanes` | 6 | 1 | 6 | all-vehicles · all-leads · my-work-queue · single-ticket · manage-dealers · accounting-view-all |
| `.row` | 5 | 2 | 774 | all-vehicles · all-leads · my-work-queue · manage-dealers · accounting-view-all |
| `.ck` | 5 | 1 | 101 | all-vehicles · single-ticket · dealer-edit |
| `.facet` | 5 | 6 | 83 | all-vehicles · ~family · my-work-queue · manage-dealers · ~components · accounting-view-all |
| `.sel` | 5 | 2 | 20 | single-vehicle · ~family · ~components · all-vehicles · single-lead · my-work-queue · single-ticket · accounting-view-all |
| `.me` | 5 | 3 | 13 | my-work-queue · ~family · single-ticket · manage-dealers · dealer-edit · accounting-view-all |
| `.sub` | 5 | 2 | 7 | all-vehicles · ~components · all-leads · my-work-queue · manage-dealers · accounting-view-all |
| `.scope` | 5 | 2 | 7 | all-vehicles · ~family |
| `.atlas` | 5 | 2 | 7 | my-work-queue · ~family · single-ticket · manage-dealers · dealer-edit · accounting-view-all |
| `.foot` | 5 | 2 | 6 | all-vehicles · all-leads · my-work-queue · manage-dealers · accounting-view-all |
| `.cmdtop` | 5 | 1 | 5 | all-vehicles · ~family · all-leads · my-work-queue · manage-dealers · accounting-view-all |
| `.rows` | 5 | 1 | 5 | all-vehicles · ~family · my-work-queue · manage-dealers · accounting-view-all |
| `.ui-table` | 5 | 1 | 5 | ~components |
| `.hd` | 5 | 1 | 5 | all-vehicles · ~family · all-leads · my-work-queue · manage-dealers · accounting-view-all |
| `.ui-thead` | 5 | 1 | 5 | ~components |
| `.dealer` | 4 | 4 | 16 | all-vehicles · ~family · single-vehicle |
| `.v` | 4 | 3 | 12 | all-vehicles · single-lead · my-work-queue |
| `.focal` | 4 | 3 | 11 | all-vehicles · ~family · all-leads · single-lead · single-ticket |
| `.r` | 4 | 1 | 11 | all-vehicles · ~components · my-work-queue · accounting-view-all |
| `.bento` | 4 | 1 | 4 | all-vehicles · ~family · all-leads · single-lead · single-ticket |
| `.c-act` | 3 | 1 | 665 | my-work-queue · ~family · manage-dealers · accounting-view-all |
| `.stat` | 3 | 9 | 176 | all-vehicles · all-leads · single-lead |
| `.f` | 3 | 6 | 159 | single-vehicle · all-vehicles · single-lead · single-ticket · ~components |
| `.sw` | 3 | 4 | 137 | all-vehicles · ~family · single-vehicle · my-work-queue |
| `.fld` | 3 | 3 | 130 | all-vehicles · single-lead · ~family · single-ticket · dealer-edit |
| `.st` | 3 | 1 | 87 | all-vehicles · ~family · all-leads · single-lead |
| `.seg` | 3 | 5 | 45 | all-vehicles · ~family · single-vehicle · dealer-edit |
| `.rail` | 3 | 9 | 28 | single-vehicle · ~family · single-ticket · dealer-edit · ~components |
| `.none` | 3 | 1 | 27 | all-leads · single-lead |
| `.flag` | 3 | 5 | 27 | single-lead · single-ticket · dealer-edit |
| `.grid` | 3 | 5 | 21 | single-vehicle · single-lead · single-ticket |
| `.mono` | 3 | 1 | 16 | all-vehicles · single-lead · single-ticket · dealer-edit |
| `.full` | 3 | 1 | 15 | all-vehicles |
| `.form` | 3 | 5 | 12 | dealer-login · ~family · single-lead · single-ticket · ~components |
| `.l` | 3 | 1 | 9 | all-vehicles · all-leads · single-lead |
| `.attn` | 3 | 3 | 9 | all-vehicles · ~family · single-lead · all-leads |
| `.value` | 3 | 2 | 6 | all-vehicles · ~family · single-lead |
| `.on` | 3 | 1 | 5 | all-vehicles · my-work-queue |
| `.av` | 3 | 1 | 3 | all-vehicles · ~family |
| `.kv` | 3 | 1 | 3 | all-vehicles |
| `.pg` | 3 | 1 | 3 | all-vehicles · all-leads · my-work-queue |
| `.c` | 2 | 2 | 3733 | my-work-queue · accounting-view-all |
| `.mk` | 2 | 4 | 746 | all-vehicles · manage-dealers |
| `.c-name` | 2 | 1 | 572 | accounting-view-all |
| `.ev` | 2 | 17 | 541 | single-lead · single-ticket |
| `.c-mod` | 2 | 3 | 475 | manage-dealers · my-work-queue |
| `.c-st` | 2 | 1 | 461 | my-work-queue · manage-dealers |
| `.bdg` | 2 | 8 | 306 | my-work-queue · ~components · manage-dealers |
| `.fw` | 2 | 3 | 227 | manage-dealers · dealer-edit |
| `.rowx` | 2 | 1 | 184 | single-vehicle · single-ticket |
| `.more` | 2 | 1 | 103 | my-work-queue · accounting-view-all |
| `.zone` | 2 | 6 | 86 | single-vehicle · ~components · dealer-edit · ~family |
| `.ar` | 2 | 10 | 82 | all-vehicles |
| `.kind` | 2 | 1 | 48 | single-lead · single-ticket |
| `.tile` | 2 | 10 | 44 | single-ticket · accounting-view-all |
| `.grp` | 2 | 7 | 35 | single-lead · single-ticket · ~components |
| `.age` | 2 | 5 | 34 | all-vehicles · single-vehicle |
| `.tag` | 2 | 3 | 31 | all-vehicles · ~family · ~components · my-work-queue |
| `.az` | 2 | 2 | 28 | manage-dealers · accounting-view-all |
| `.sec` | 2 | 3 | 27 | single-lead · ~family · ~components · single-ticket |
| `.agerow` | 2 | 3 | 23 | all-vehicles · all-leads |
| `.ui-nav` | 2 | 3 | 23 | ~components |
| `.dock` | 2 | 9 | 17 | all-vehicles · ~family · single-ticket · ~components · single-lead |
| `.panel` | 2 | 9 | 16 | dealer-login · ~family · dealer-edit |
| `.secnav` | 2 | 4 | 15 | single-lead · ~family · single-ticket · ~components |
| `.composer` | 2 | 6 | 11 | single-lead · single-ticket · ~components |
| `.chip` | 2 | 7 | 11 | single-ticket · ~family · ~components · dealer-edit |
| `.savebar` | 2 | 7 | 10 | single-vehicle · ~family · dealer-edit · ~components |
| `.tl` | 2 | 1 | 9 | manage-dealers · ~components |
| `.hero` | 2 | 4 | 8 | all-vehicles |
| `.money` | 2 | 2 | 8 | single-vehicle · single-ticket |
| `.c-sec` | 2 | 1 | 5 |  |
| `.slot` | 2 | 5 | 5 | single-lead · single-ticket |
| `.src` | 2 | 1 | 5 | single-lead · single-ticket |
| `.agemix` | 2 | 2 | 4 | all-vehicles · all-leads |
| `.feed` | 2 | 2 | 4 | single-lead · single-ticket |
| `.agerows` | 2 | 1 | 2 | all-vehicles · all-leads |
| `.qf` | 2 | 1 | 2 | all-vehicles |
| `.c-status` | 2 | 1 | 2 | all-leads |
| `.lock` | 2 | 1 | 2 | all-vehicles · ~family · single-vehicle |
| `.body` | 2 | 1 | 2 | single-vehicle · dealer-edit |
| `.zones` | 2 | 1 | 2 | single-vehicle · ~components · dealer-edit |
| `.dock-open` | 2 | 1 | 2 | all-vehicles · single-ticket |
| `.walk` | 2 | 1 | 2 | single-lead · single-ticket |
| `.ui-ctl` | 2 | 1 | 2 | ~components |
| `.secs` | 2 | 1 | 2 | single-lead · ~components · single-ticket |
| `.tot` | 2 | 1 | 2 | my-work-queue · accounting-view-all |

### The six blocks the shared layer owns outright

These are the only blocks whose every rule lives in `_aan-family.css` or
`_aan-components.css`. They are the parts of Gen 11 that have finished migrating
into the shared layer.

- `.ui-view` — 7 pages, 46 uses, tokens: `.ui-view` `.ui-view--on`
- `.ui-toolbar` — 7 pages, 27 uses, tokens: `.ui-toolbar` `.ui-toolbar--sub`
- `.ui-views` — 7 pages, 8 uses, tokens: `.ui-views`
- `.ui-table` — 5 pages, 5 uses, tokens: `.ui-table`
- `.ui-thead` — 5 pages, 5 uses, tokens: `.ui-thead`
- `.ui-nav` — 2 pages, 23 uses, tokens: `.ui-nav` `.ui-nav__i` `.ui-nav__i--on`
- `.c-sec` — 2 pages, 5 uses, tokens: `.c-sec`
- `.ui-ctl` — 2 pages, 2 uses, tokens: `.ui-ctl`

---

## 2 · Every block, with its measured geometry

One row per class token that appears on a visible box, with the box it produced at
1440×900, the ancestor chain the CSS depends on, and the files that style it.

### `.btn`

Pages: dealer-login, all-vehicles, single-vehicle, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, dealer-edit, accounting · 1414 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.btn` | BUTTON | 380x44 | 0px 20px | 8px | 9px | dealer-login ~family ~components all-vehicles single-vehicle my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |
| `.btn--xs` | BUTTON | 50x36 | 0px 14px | 8px | 9px | accounting-view-all |
| `.btn--sheet` | BUTTON | 93x36 | 0px 14px | 7px | 9px | all-vehicles single-vehicle single-ticket manage-dealers dealer-edit accounting-view-all |
| `.btn--primary` | BUTTON | 380x44 | 0px 20px | 8px | 9px | dealer-login all-vehicles single-vehicle my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |
| `.btn--sm` | BUTTON | 36x30 | 0px 8px | 7px | 7px | single-vehicle ~family all-vehicles single-ticket dealer-edit accounting-view-all |
| `.btn--quiet` | BUTTON | 134x36 | 0px 12px | 7px | 9px | all-vehicles single-lead my-work-queue single-ticket manage-dealers |
| `.btn--icon` | BUTTON | 36x30 | 0px 8px | 7px | 7px | single-vehicle ~components |
| `.btn__n` | SPAN | 18x18 | 0px 5px | — | 4px | single-vehicle ~components |
| `.btn--lg` | BUTTON | 380x44 | 0px 20px | 8px | 9px | ~family ~components |
| `.btn--on` | BUTTON | 105x36 | 0px 12px | 7px | 9px | ~components |
| `.btn--del` | BUTTON | 146x30 | 0px 11px | 7px | 7px | single-lead |
| `.btn--lock` | BUTTON | 176x30 | 0px 11px | 8px | 7px | dealer-edit |

Context of `.btn`: `auth › form › form__in › FORM`

### `.nav`

Pages: all-vehicles, single-vehicle, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, dealer-edit, accounting · 178 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.nav__it` | DIV | 47x76 | 0px | — | 0px | all-vehicles ~family single-vehicle my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |
| `.nav__b` | A | 47x30 | 0px 6px | 6px | 8px | all-vehicles ~family ~components single-vehicle my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |
| `.nav` | NAV | 786x30 | 0px | 8px 6px | 0px | all-vehicles ~family single-vehicle my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |
| `.nav__it--on` | DIV | 87x76 | 0px | — | 0px | — |
| `.nav__it--r` | DIV | 36x76 | 0px | — | 0px | — |

Context of `.nav__it`: `app › top › nav`

### `.brand`

Pages: all-vehicles, single-vehicle, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, dealer-edit, accounting · 27 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.brand` | A | 164x21 | 0px | 8px | 0px | all-vehicles ~family single-vehicle my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |
| `.brand__mk` | SPAN | 37x18 | 2px 7px | — | 4px | all-vehicles ~family single-vehicle my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |
| `.brand__t` | SPAN | 121x22 | 0px | — | 0px | all-vehicles ~family single-vehicle my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |

Context of `.brand`: `app › top`

### `.caps`

Pages: dealer-login, all-vehicles, single-vehicle, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, accounting · 26 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.caps` | SPAN | 50x13 | 0px 4px 0px 0px | — | 0px | dealer-login ~family ~components all-vehicles single-vehicle my-work-queue single-ticket manage-dealers accounting-view-all |

Context of `.caps`: `app › tally`

### `.tbtn`

Pages: all-vehicles, single-vehicle, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, dealer-edit, accounting · 17 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tbtn` | BUTTON | 36x30 | 0px 8px | — | 7px | all-vehicles ~family ~components single-vehicle my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |
| `.tbtn__dot` | SPAN | 8x8 | 0px | — | 50% | all-vehicles single-vehicle |

Context of `.tbtn`: `app › top › nav__it`

### `.app`

Pages: all-vehicles, single-vehicle, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, dealer-edit, accounting · 9 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.app` | DIV | 1428x5342 | 0px 16px 68px | — | 0px | all-vehicles single-vehicle ~family my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |

### `.top`

Pages: all-vehicles, single-vehicle, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, dealer-edit, accounting · 9 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.top` | HEADER | 1396x56 | 0px 16px | 0px 6px | 12px | all-vehicles ~family single-vehicle single-lead my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |

Context of `.top`: `app`

### `.gsearch`

Pages: all-vehicles, single-vehicle, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, dealer-edit, accounting · 9 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.gsearch` | LABEL | 112x30 | 0px 8px 0px 10px | 8px | 7px | all-vehicles ~family single-vehicle my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |

Context of `.gsearch`: `app › top`

### `.head`

Pages: all-vehicles, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, dealer-edit, accounting · 31 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.head` | DIV | 1396x32 | 0px | 8px | 0px | all-vehicles ~family single-lead my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |
| `.head__ctx` | SPAN | 244x18 | 0px | — | 0px | all-vehicles ~family all-leads single-lead my-work-queue manage-dealers accounting-view-all |
| `.head__id` | DIV | 512x48 | 0px | — | 0px | my-work-queue single-ticket manage-dealers dealer-edit accounting-view-all |
| `.head__meta` | DIV | 512x19 | 0px | — | 0px | my-work-queue single-ticket manage-dealers accounting-view-all |
| `.head__actions` | DIV | 370x36 | 0px | 8px | 0px | my-work-queue ~family manage-dealers |
| `.head__ttl` | DIV | 512x26 | 0px | 8px | 0px | my-work-queue |
| `.head__back` | A | 34x34 | 0px | — | 7px | dealer-edit |
| `.head__row` | DIV | 872x25 | 0px | 8px | 0px | dealer-edit |
| `.head__n` | SPAN | 30x15 | 0px | — | 0px | dealer-edit |
| `.head__audit` | P | 872x18 | 0px | 4px 16px | 0px | dealer-edit |
| `.head__quick` | NAV | 411x23 | 3px 0px 0px | 4px 8px | 0px | dealer-edit |

Context of `.head`: `app`

### `.s`

Pages: all-vehicles, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, accounting · 58 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.s` | SPAN | 48x18 | 0px | — | 0px | all-vehicles my-work-queue ~components single-ticket manage-dealers accounting-view-all |
| `.s--on` | BUTTON | 115x14 | 0px | 3px | 0px | manage-dealers ~components accounting-view-all |
| `.s--asc` | BUTTON | 115x14 | 0px | 3px | 0px | — |

Context of `.s`: `app › bento › value › value__h`

### `.ui-view`

Pages: all-vehicles, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, accounting · 46 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ui-view` | BUTTON | 110x30 | 0px 12px | 6px | 7px | ~components |
| `.ui-view--on` | BUTTON | 110x30 | 0px 12px | 6px | 7px | ~components |

Context of `.ui-view`: `app › field › cmdtop › lanes`

### `.ui-toolbar`

Pages: all-vehicles, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, accounting · 27 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ui-toolbar` | DIV | 1396x53 | 8px 16px | 8px | 0px | ~components |
| `.ui-toolbar--sub` | DIV | 1396x53 | 8px 16px | 8px | 0px | ~components |

Context of `.ui-toolbar`: `app › field`

### `.cmd`

Pages: all-vehicles, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, accounting · 9 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.cmd` | DIV | 980x56 | 4px 16px | 8px | 0px | all-vehicles ~family single-lead my-work-queue manage-dealers accounting-view-all |
| `.cmd--sec` | DIV | 980x56 | 4px 16px | 8px | 0px | single-lead ~family single-ticket |

Context of `.cmd`: `app › field`

### `.ui-views`

Pages: all-vehicles, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, accounting · 8 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ui-views` | DIV | 536x36 | 0px | 4px 6px | 0px | ~components |

Context of `.ui-views`: `app › field › cmdtop`

### `.field`

Pages: all-vehicles, all-leads, single-lead, my-work-queue, single-ticket, manage-dealers, accounting · 7 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.field` | SECTION | 980x3169 | 0px | — | 14px | all-vehicles ~family all-leads single-lead my-work-queue single-ticket manage-dealers accounting-view-all |

Context of `.field`: `app`

### `.lane`

Pages: all-vehicles, all-leads, my-work-queue, single-ticket, manage-dealers, accounting · 47 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.lane` | BUTTON | 95x30 | 0px 12px | 6px | 7px | all-vehicles ~family ~components all-leads my-work-queue single-ticket manage-dealers accounting-view-all |
| `.lane--on` | BUTTON | 110x30 | 0px 12px | 6px | 7px | all-vehicles ~family ~components my-work-queue single-ticket manage-dealers accounting-view-all |
| `.lane--nodata` | BUTTON | 159x30 | 0px 12px | 6px | 7px | — |
| `.lane--all` | BUTTON | 191x30 | 0px 12px | 6px | 7px | all-vehicles all-leads |
| `.lane--zero` | BUTTON | 88x30 | 0px 12px | 6px | 7px | all-vehicles |
| `.lane--hot` | BUTTON | 87x30 | 0px 12px | 6px | 7px | my-work-queue |

Context of `.lane`: `app › field › cmdtop › lanes`

### `.search`

Pages: all-vehicles, all-leads, single-lead, my-work-queue, manage-dealers, accounting · 9 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.search` | LABEL | 952x36 | 0px 12px 0px 16px | 8px | 14px | all-vehicles ~family ~components my-work-queue manage-dealers accounting-view-all |
| `.search--sm` | LABEL | 948x40 | 0px 4px 0px 12px | 8px | 9px | single-lead |
| `.search--phone` | LABEL | 512x36 | 0px 12px 0px 14px | 6px | 9px | manage-dealers |

Context of `.search`: `app › field › cmd`

### `.lanes`

Pages: all-vehicles, all-leads, my-work-queue, single-ticket, manage-dealers, accounting · 6 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.lanes` | DIV | 655x40 | 5px | 4px | 0px | all-vehicles all-leads my-work-queue single-ticket manage-dealers accounting-view-all |

Context of `.lanes`: `app › field › cmdtop`

### `.row`

Pages: all-vehicles, all-leads, my-work-queue, manage-dealers, accounting · 774 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.row` | DIV | 1396x74 | 0px 16px | 8px | 0px | all-vehicles all-leads my-work-queue manage-dealers accounting-view-all |
| `.row--letter` | DIV | 1396x56 | 0px 16px | 8px | 0px | manage-dealers |

Context of `.row`: `app › field › rows › DIV`

### `.ck`

Pages: all-vehicles, all-leads, single-lead, single-ticket, dealer-edit · 101 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ck` | INPUT | 17x17 | 0px | — | 4px | all-vehicles single-ticket dealer-edit |

Context of `.ck`: `app › body › zones › zone › fg › fw › opt`

### `.facet`

Pages: all-vehicles, all-leads, my-work-queue, manage-dealers, accounting · 83 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.facet` | DIV | 89x36 | 0px | — | 0px | all-vehicles ~family my-work-queue manage-dealers |
| `.facet__b` | BUTTON | 89x36 | 0px 12px | 6px | 9px | all-vehicles ~family ~components my-work-queue manage-dealers |
| `.facet__v` | SPAN | 36x14 | 0px | — | 0px | all-vehicles ~components my-work-queue manage-dealers |
| `.facet__k` | SPAN | 23x12 | 0px | — | 0px | all-vehicles ~components my-work-queue manage-dealers |
| `.facet--sel` | LABEL | 188x36 | 0px 0px 0px 12px | 8px | 9px | accounting-view-all ~components |
| `.facet__b--icon` | BUTTON | 81x36 | 0px 12px | 6px | 9px | my-work-queue |

Context of `.facet`: `app › field › cmd`

### `.sel`

Pages: single-vehicle, single-lead, my-work-queue, single-ticket, accounting · 20 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.sel` | SELECT | 352x40 | 0px 34px 0px 10px | — | 7px | single-vehicle ~family ~components all-vehicles single-lead my-work-queue single-ticket accounting-view-all |
| `.sel--sm` | SELECT | 181x32 | 0px 34px 0px 12px | — | 7px | single-ticket |

Context of `.sel`: `app › dock › dock__b › wf › f`

### `.me`

Pages: my-work-queue, single-ticket, manage-dealers, dealer-edit, accounting · 13 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.me` | BUTTON | 156x30 | 0px 8px 0px 4px | 8px | 7px | my-work-queue ~family single-ticket manage-dealers dealer-edit accounting-view-all |
| `.me__mk` | SPAN | 26x26 | 0px | — | 50% | my-work-queue ~family single-ticket manage-dealers dealer-edit accounting-view-all |
| `.me__n` | SPAN | 90x19 | 0px | — | 0px | my-work-queue ~family single-ticket accounting-view-all |

Context of `.me`: `app › top › nav__it`

### `.sub`

Pages: all-vehicles, all-leads, my-work-queue, manage-dealers, accounting · 7 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.sub` | DIV | 1396x56 | 8px 16px | 8px | 0px | all-vehicles ~components all-leads my-work-queue manage-dealers accounting-view-all |
| `.sub__shown` | SPAN | 69x19 | 0px | — | 0px | all-vehicles |

Context of `.sub`: `app › field`

### `.scope`

Pages: all-vehicles, all-leads, my-work-queue, manage-dealers, accounting · 7 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.scope` | DIV | 198x39 | 8px 16px | 8px | 0px | all-vehicles ~family |
| `.scope__n` | SPAN | 67x23 | 0px | — | 0px | all-vehicles |

Context of `.scope`: `app › field › sub`

### `.atlas`

Pages: my-work-queue, single-ticket, manage-dealers, dealer-edit, accounting · 7 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.atlas` | A | 56x24 | 0px 8px | 5px | 7px | my-work-queue ~family single-ticket manage-dealers dealer-edit accounting-view-all |
| `.atlas__t` | SPAN | 26x17 | 0px | — | 0px | — |

Context of `.atlas`: `app › top`

### `.foot`

Pages: all-vehicles, all-leads, my-work-queue, manage-dealers, accounting · 6 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.foot` | DIV | 1396x48 | 0px 16px | 12px | 0px 0px 14px 14px | all-vehicles all-leads my-work-queue manage-dealers accounting-view-all |
| `.foot__prov` | SPAN | 430x17 | 0px | — | 0px | manage-dealers |

Context of `.foot`: `app › field`

### `.cmdtop`

Pages: all-vehicles, all-leads, my-work-queue, manage-dealers, accounting · 5 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.cmdtop` | DIV | 1396x57 | 8px 16px | 8px | 0px | all-vehicles ~family all-leads my-work-queue manage-dealers accounting-view-all |

Context of `.cmdtop`: `app › field`

### `.rows`

Pages: all-vehicles, all-leads, my-work-queue, manage-dealers, accounting · 5 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.rows` | DIV | 1396x1232 | 0px | — | 0px | all-vehicles ~family my-work-queue manage-dealers accounting-view-all |

Context of `.rows`: `app › field`

### `.ui-table`

Pages: all-vehicles, all-leads, my-work-queue, manage-dealers, accounting · 5 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ui-table` | DIV | 1396x1232 | 0px | — | 0px | ~components |

Context of `.ui-table`: `app › field`

### `.hd`

Pages: all-vehicles, all-leads, my-work-queue, manage-dealers, accounting · 5 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.hd` | DIV | 1396x48 | 9px 16px | 8px | 0px | all-vehicles ~family all-leads my-work-queue manage-dealers accounting-view-all |

Context of `.hd`: `app › field › rows`

### `.ui-thead`

Pages: all-vehicles, all-leads, my-work-queue, manage-dealers, accounting · 5 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ui-thead` | DIV | 1396x48 | 9px 16px | 8px | 0px | ~components |

Context of `.ui-thead`: `app › field › rows`

### `.dealer`

Pages: all-vehicles, single-vehicle, all-leads, single-lead · 16 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.dealer` | BUTTON | 222x30 | 0px 8px 0px 4px | 8px | 7px | all-vehicles ~family single-vehicle |
| `.dealer__mk` | SPAN | 24x24 | 0px | — | 7px | all-vehicles ~family single-vehicle |
| `.dealer__n` | SPAN | 119x18 | 0px | — | 0px | — |
| `.dealer__id` | SPAN | 30x18 | 0px | — | 0px | all-vehicles single-vehicle |

Context of `.dealer`: `app › top › nav__it`

### `.v`

Pages: all-vehicles, all-leads, single-lead, my-work-queue · 12 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.v` | DIV | 12x22 | 0px | — | 0px | all-vehicles single-lead |
| `.v--neg` | SPAN | 12x18 | 0px | — | 0px | my-work-queue |
| `.v--ok` | B | 54x19 | 0px | — | 0px | my-work-queue |

Context of `.v`: `app › bento › value › kv › DIV`

### `.focal`

Pages: all-vehicles, all-leads, single-lead, single-ticket · 11 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.focal` | DIV | 550x241 | 0px | — | 14px | all-vehicles ~family all-leads single-lead single-ticket |
| `.focal__h` | DIV | 309x13 | 0px | — | 0px | all-vehicles single-lead single-ticket |
| `.focal__main` | DIV | 357x241 | 16px 24px | — | 0px | all-vehicles single-lead |

Context of `.focal`: `app › bento`

### `.r`

Pages: all-vehicles, all-leads, my-work-queue, accounting · 11 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.r` | SPAN | 39x15 | 0px | 4px | 0px | all-vehicles ~components my-work-queue accounting-view-all |

Context of `.r`: `app › field › rows › hd`

### `.bento`

Pages: all-vehicles, all-leads, single-lead, single-ticket · 4 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.bento` | SECTION | 1396x241 | 0px | 16px | 0px | all-vehicles ~family all-leads single-lead single-ticket |

Context of `.bento`: `app`

### `.c-act`

Pages: my-work-queue, manage-dealers, accounting · 665 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-act` | SPAN | 36x32 | 0px | 1px 8px | 0px | my-work-queue ~family manage-dealers accounting-view-all |

Context of `.c-act`: `app › field › rows › DIV › row`

### `.stat`

Pages: all-vehicles, all-leads, single-lead · 176 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.stat` | SPAN | 75x24 | 0px 8px | — | 7px | all-vehicles all-leads single-lead |
| `.stat--new` | SPAN | 75x24 | 0px 8px | — | 7px | all-leads single-lead |
| `.stat--ok` | SPAN | 71x24 | 0px 8px | — | 7px | all-vehicles |
| `.stat--active` | SPAN | 111x24 | 0px 8px | — | 7px | all-leads |
| `.stat--pend` | SPAN | 66x24 | 0px 8px | — | 7px | all-leads |
| `.stat--quiet` | SPAN | 93x24 | 0px 8px | — | 7px | all-leads |
| `.stat--trade` | SPAN | 110x24 | 0px 8px | — | 7px | all-leads |
| `.stat--won` | SPAN | 91x24 | 0px 8px | — | 7px | all-leads |
| `.stat--hot` | SPAN | 37x24 | 0px 8px | — | 7px | all-leads |

Context of `.stat`: `app › field › rows › DIV › row › st`

### `.f`

Pages: single-vehicle, single-lead, single-ticket · 159 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.f` | DIV | 306x59 | 0px | 6px | 0px | single-vehicle all-vehicles single-lead single-ticket |
| `.f__l` | SPAN | 306x17 | 0px | 6px | 0px | single-vehicle |
| `.f__raw` | SPAN | 53x11 | 0px | — | 0px | single-vehicle |
| `.f__help` | P | 1124x19 | 0px | — | 0px | single-vehicle ~components |
| `.f--wide` | LABEL | 370x62 | 0px | 4px | 0px | single-lead single-ticket |
| `.f--big` | LABEL | 305x62 | 0px | 4px | 0px | — |

Context of `.f`: `app › body › zones › zone › zone__b › statusrow`

### `.sw`

Pages: all-vehicles, single-vehicle, my-work-queue · 137 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.sw` | SPAN | 10x10 | 0px | — | 999px | all-vehicles ~family single-vehicle my-work-queue |
| `.sw__t` | SPAN | 42x24 | 0px | — | 999px | single-vehicle my-work-queue |
| `.sw--ok` | LABEL | 42x24 | 0px | — | 999px | — |
| `.sw--danger` | LABEL | 42x24 | 0px | — | 999px | — |

Context of `.sw`: `app › field › rows › DIV › row › ext`

### `.fld`

Pages: single-lead, single-ticket, dealer-edit · 130 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.fld` | INPUT | 177x40 | 0px 10px | — | 7px | all-vehicles single-lead ~family single-ticket dealer-edit |
| `.fld--area` | TEXTAREA | 860x62 | 8px 12px | — | 7px | dealer-edit |
| `.fld--num` | INPUT | 418x40 | 0px 12px | — | 7px | dealer-edit |

Context of `.fld`: `app › field › secs › sec › sec__b › form › grp › grid › f`

### `.st`

Pages: all-vehicles, all-leads, single-lead · 87 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.st` | DIV | 132x24 | 0px 0px 0px 12px | — | 0px | all-vehicles ~family all-leads single-lead |

Context of `.st`: `app › field › rows › DIV › row`

### `.seg`

Pages: all-vehicles, single-vehicle, dealer-edit · 45 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.seg__o` | LABEL | 42x30 | 0px | — | 0px | dealer-edit |
| `.seg` | DIV | 144x36 | 3px | 2px 6px | 999px | all-vehicles ~family single-vehicle dealer-edit |
| `.seg__b` | BUTTON | 42x30 | 0px | — | 999px | all-vehicles ~family single-vehicle |
| `.seg__b--on` | BUTTON | 42x30 | 0px | — | 999px | all-vehicles ~family single-vehicle |
| `.seg--unset` | SPAN | 107x36 | 3px | 3px 6px | 999px | dealer-edit |

Context of `.seg__o`: `app › body › zones › zone › fg › fw › seg`

### `.rail`

Pages: single-vehicle, single-ticket, dealer-edit · 28 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.rail__i` | BUTTON | 208x34 | 0px 12px | 8px | 7px | single-vehicle ~family |
| `.rail__b` | BUTTON | 168x34 | 0px 12px | 8px | 7px | dealer-edit ~family |
| `.rail` | NAV | 184x342 | 8px | 2px | 12px | single-vehicle ~family single-ticket dealer-edit |
| `.rail__i--on` | BUTTON | 208x34 | 0px 12px | 8px | 7px | single-vehicle ~family |
| `.rail__k` | DIV | 469x23 | 0px 18px 10px | — | 0px | single-ticket ~components |
| `.rail__who` | DIV | 469x55 | 0px 18px 12px | — | 0px | single-ticket |
| `.rail__ls` | DIV | 469x100 | 0px 8px | 2px 4px | 0px | single-ticket ~family |
| `.rail__b--on` | BUTTON | 168x34 | 0px 12px | 8px | 7px | dealer-edit ~family |
| `.rail__hint` | SPAN | 168x23 | 6px 4px 0px | — | 0px | dealer-edit ~components |

Context of `.rail__i`: `app › body › rail`

### `.none`

Pages: all-leads, single-lead, accounting · 27 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.none` | SPAN | 177x15 | 0px | — | 0px | all-leads single-lead |

Context of `.none`: `app › field › rows › DIV › row › ct`

### `.flag`

Pages: single-lead, single-ticket, dealer-edit · 27 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.flag` | LABEL | 72x20 | 0px | 8px | 0px | single-lead single-ticket dealer-edit |
| `.flag__r` | SPAN | 248x40 | 0px | 8px | 0px | dealer-edit |
| `.flag__l` | SPAN | 128x18 | 0px | — | 0px | dealer-edit |
| `.flag__why` | SPAN | 188x17 | 0px | — | 0px | dealer-edit |
| `.flag__why--cas` | SPAN | 223x35 | 0px | — | 0px | dealer-edit |

Context of `.flag`: `app › dock › dock__b › wf › wf__flags › workflow-flags`

### `.grid`

Pages: single-vehicle, single-lead, single-ticket · 21 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.grid` | DIV | 1124x207 | 0px | 24px 16px | 0px | single-vehicle single-lead single-ticket |
| `.grid--3` | DIV | 948x62 | 0px | 16px | 0px | single-lead single-ticket |
| `.grid--4` | DIV | 948x140 | 0px | 16px | 0px | single-lead single-ticket |
| `.grid--5` | DIV | 948x219 | 0px | 16px | 0px | single-lead |
| `.grid--2` | DIV | 948x258 | 0px | 16px | 0px | single-lead |

Context of `.grid`: `app › body › zones › zone › zone__b`

### `.mono`

Pages: single-lead, single-ticket, dealer-edit · 16 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.mono` | SPAN | 187x18 | 0px | — | 0px | all-vehicles single-lead single-ticket dealer-edit |

Context of `.mono`: `app › bento › focal › focal__main › ident › ident__row`

### `.full`

Pages: all-vehicles, all-leads, single-lead · 15 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.full` | SPAN | 70x16 | 0px | — | 0px | all-vehicles |

Context of `.full`: `app › bento › attn › attn__h › H2`

### `.form`

Pages: dealer-login, single-lead, single-ticket · 12 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.form` | SECTION | 657x868 | 48px 48px 32px | — | 12px | dealer-login ~family |
| `.form__f` | DIV | 948x52 | 16px 0px 0px | 16px | 0px | single-lead single-ticket |
| `.form__note` | SPAN | 208x19 | 0px | — | 0px | single-lead ~components single-ticket |
| `.form__in` | DIV | 380x502 | 0px | — | 0px | dealer-login |
| `.form__foot` | DIV | 380x23 | 0px | — | 0px | dealer-login |

Context of `.form`: `auth`

### `.l`

Pages: all-vehicles, all-leads, single-lead · 9 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.l` | DIV | 72x20 | 0px | — | 0px | all-vehicles all-leads single-lead |

Context of `.l`: `app › bento › value › kv › DIV`

### `.attn`

Pages: all-vehicles, all-leads, single-lead · 9 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.attn` | SECTION | 582x241 | 16px | — | 14px | all-vehicles ~family single-lead |
| `.attn__h` | DIV | 550x27 | 0px 8px 8px | 8px | 0px | all-vehicles single-lead |
| `.attn__g` | DIV | 522x193 | 0px | 8px | 0px | all-vehicles all-leads single-lead |

Context of `.attn`: `app › bento`

### `.value`

Pages: all-vehicles, all-leads, single-lead · 6 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.value` | DIV | 232x241 | 16px 24px | — | 14px | all-vehicles ~family single-lead |
| `.value__h` | DIV | 192x21 | 0px | 8px | 0px | all-vehicles |

Context of `.value`: `app › bento`

### `.on`

Pages: all-vehicles, all-leads, my-work-queue · 5 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.on` | SPAN | 43x15 | 0px | 4px | 0px | all-vehicles my-work-queue |

Context of `.on`: `app › field › rows › hd`

### `.av`

Pages: all-vehicles, all-leads, single-lead · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.av` | BUTTON | 28x28 | 0px | — | 50% | all-vehicles ~family |

Context of `.av`: `app › top › nav__it`

### `.kv`

Pages: all-vehicles, all-leads, single-lead · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.kv` | DIV | 184x183 | 0px | 0px | 0px | all-vehicles |

Context of `.kv`: `app › bento › value`

### `.pg`

Pages: all-vehicles, all-leads, my-work-queue · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.pg` | SPAN | 256x32 | 0px | 4px | 0px | all-vehicles all-leads my-work-queue |

Context of `.pg`: `app › field › foot`

### `.c`

Pages: my-work-queue, accounting · 3733 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c` | SPAN | 20x32 | 0px | 1px | 0px | my-work-queue accounting-view-all |
| `.c--1` | A | 84x19 | 0px | — | 0px | accounting-view-all |

Context of `.c`: `app › field › rows › DIV › row`

### `.mk`

Pages: all-vehicles, manage-dealers · 746 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.mk` | DIV | 104x20 | 0px | — | 0px | all-vehicles manage-dealers |
| `.mk--ok` | SPAN | 20x20 | 0px | — | 4px | manage-dealers |
| `.mk--quiet` | SPAN | 20x20 | 0px | — | 4px | manage-dealers |
| `.mk--info` | SPAN | 20x20 | 0px | — | 4px | manage-dealers |

Context of `.mk`: `app › field › rows › DIV › row`

### `.c-name`

Pages: manage-dealers, accounting · 572 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-name` | SPAN | 385x15 | 0px | 3px | 0px | accounting-view-all |

Context of `.c-name`: `app › field › rows › hd`

### `.ev`

Pages: single-lead, single-ticket · 541 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ev` | LI | 948x126 | 12px 14px | 12px | 10px | single-lead single-ticket |
| `.ev__i` | SPAN | 36x36 | 0px | — | 50% | single-lead single-ticket |
| `.ev__b` | DIV | 794x102 | 2px 0px 0px | 8px | 0px | single-lead single-ticket |
| `.ev__t` | DIV | 794x20 | 0px | 8px | 0px | single-lead single-ticket |
| `.ev__d` | DIV | 67x41 | 6px 0px 0px | — | 0px | single-lead single-ticket |
| `.ev__n` | SPAN | 794x20 | 0px | — | 0px | single-lead single-ticket |
| `.ev__acts` | DIV | 794x26 | 0px | 4px | 0px | single-ticket |
| `.ev__reply` | BUTTON | 68x26 | 0px 9px | 6px | 7px | single-ticket |
| `.ev--note` | LI | 948x105 | 12px 0px | 12px | 0px | — |
| `.ev--field` | LI | 948x121 | 16px 0px | 12px | 0px | — |
| `.ev--todo` | LI | 948x186 | 12px 14px | 12px | 10px | — |
| `.ev__m` | DIV | 821x18 | 0px | — | 0px | single-lead |
| `.ev__n--clamp` | SPAN | 656x122 | 0px | — | 0px | single-ticket |
| `.ev__more` | BUTTON | 656x19 | 0px | — | 0px | single-ticket |
| `.ev--mail` | LI | 948x105 | 12px 0px | 12px | 0px | — |
| `.ev--created` | LI | 948x105 | 12px 0px | 12px | 0px | — |
| `.ev--message` | LI | 948x166 | 12px 14px | 12px | 10px | — |

Context of `.ev`: `app › field › secs › sec › sec__b › feed`

### `.c-mod`

Pages: my-work-queue, manage-dealers · 475 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-mod` | SPAN | 80x29 | 0px | 1px | 0px | manage-dealers |
| `.c-mod--flag` | SPAN | 108x41 | 4px 8px | 1px | 7px | my-work-queue |
| `.c-mod__f` | SPAN | 15x12 | 0px | — | 0px | my-work-queue |

Context of `.c-mod`: `app › field › rows › hd`

### `.c-st`

Pages: my-work-queue, manage-dealers · 461 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-st` | SPAN | 100x14 | 0px | — | 0px | my-work-queue manage-dealers |

Context of `.c-st`: `app › field › rows › hd`

### `.bdg`

Pages: my-work-queue, manage-dealers · 306 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.bdg` | SPAN | 100x26 | 0px 11px | — | 999px | my-work-queue ~components manage-dealers |
| `.bdg--project_ongoing` | SPAN | 100x26 | 0px 11px | — | 999px | my-work-queue |
| `.bdg--high` | SPAN | 72x12 | 0px 8px | — | 999px | manage-dealers |
| `.bdg--projdevopen` | SPAN | 100x26 | 0px 11px | — | 999px | my-work-queue |
| `.bdg--project_open` | SPAN | 100x26 | 0px 11px | — | 999px | my-work-queue |
| `.bdg--leadtracking_open` | SPAN | 100x26 | 0px 11px | — | 999px | my-work-queue |
| `.bdg--open` | SPAN | 100x26 | 0px 11px | — | 999px | my-work-queue |
| `.bdg--billing_open` | SPAN | 100x26 | 0px 11px | — | 999px | my-work-queue |

Context of `.bdg`: `app › field › rows › DIV › row › c`

### `.fw`

Pages: manage-dealers, dealer-edit · 227 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.fw` | SPAN | 14x14 | 0px | — | 0px | manage-dealers dealer-edit |
| `.fw--fail` | SPAN | 14x14 | 0px | — | 0px | manage-dealers |
| `.fw--span` | DIV | 860x30 | 0px | — | 0px | dealer-edit |

Context of `.fw`: `app › field › rows › DIV › row › c-feat`

### `.rowx`

Pages: single-vehicle, single-ticket · 184 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.rowx` | BUTTON | 36x36 | 0px | — | 7px | single-vehicle single-ticket |

Context of `.rowx`: `app › body › zones › zone › zone__b › featgrp › featrow`

### `.more`

Pages: my-work-queue, accounting · 103 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.more` | SPAN | 24x15 | 0px 5px | — | 4px | my-work-queue accounting-view-all |

Context of `.more`: `app › field › rows › DIV › row › c › c-who__l`

### `.zone`

Pages: single-vehicle, dealer-edit · 86 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.zone` | SECTION | 908x931 | 0px 24px 32px | — | 0px | single-vehicle ~components dealer-edit |
| `.zone__t` | H2 | 135x21 | 0px | — | 0px | single-vehicle ~family ~components dealer-edit |
| `.zone__s` | SPAN | 977x18 | 0px | — | 0px | single-vehicle ~family dealer-edit |
| `.zone__h` | DIV | 1156x52 | 8px 16px | 12px | 0px | single-vehicle |
| `.zone__b` | DIV | 1156x361 | 4px 16px 32px | — | 0px | single-vehicle |
| `.zone__hd` | HEADER | 860x66 | 32px 0px 12px | 8px 12px | 0px | dealer-edit ~components |

Context of `.zone`: `app › body › zones`

### `.ar`

Pages: all-vehicles, all-leads · 82 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ar` | BUTTON | 272x44 | 0px 10px | 8px | 12px | all-vehicles |
| `.ar__n` | SPAN | 50x26 | 0px | — | 0px | all-vehicles |
| `.ar__b` | SPAN | 146x25 | 0px | — | 0px | all-vehicles |
| `.ar__l` | SPAN | 146x15 | 0px | — | 0px | all-vehicles |
| `.ar__m` | SPAN | 146x4 | 0px | — | 2px | all-vehicles |
| `.ar__p` | SPAN | 38x20 | 0px | — | 0px | all-vehicles |
| `.ar--danger` | BUTTON | 272x44 | 0px 10px | 8px | 12px | all-vehicles |
| `.ar--slate` | BUTTON | 272x44 | 0px 10px | 8px | 12px | all-vehicles |
| `.ar--violet` | BUTTON | 272x44 | 0px 10px | 8px | 12px | all-vehicles |
| `.ar--signal` | BUTTON | 257x44 | 0px 10px | 8px | 12px | — |

Context of `.ar`: `app › bento › attn › attn__g`

### `.kind`

Pages: single-lead, single-ticket · 48 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.kind` | SPAN | 35x15 | 0px | 24px | 0px | single-lead single-ticket |

Context of `.kind`: `app › field › secs › sec › sec__b › feed › ev › ev__b › ev__t`

### `.tile`

Pages: single-ticket, accounting · 44 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tile` | DIV | 173x107 | 0px 12px 0px 0px | — | 0px | single-ticket accounting-view-all |
| `.tile__k` | DIV | 305x16 | 0px | — | 0px | single-ticket accounting-view-all |
| `.tile__v` | DIV | 305x29 | 0px | — | 0px | single-ticket accounting-view-all |
| `.tile__s` | DIV | 305x29 | 12px 0px 0px | — | 0px | single-ticket accounting-view-all |
| `.tile__f` | SPAN | 305x16 | 0px | 5px | 0px | accounting-view-all |
| `.tile--static` | DIV | 337x132 | 16px 16px 12px | — | 14px | — |
| `.tile__v--range` | DIV | 149x19 | 0px | — | 0px | single-ticket |
| `.tile--on` | BUTTON | 337x132 | 16px 16px 12px | — | 14px | accounting-view-all |
| `.tile--danger` | DIV | 337x132 | 16px 16px 12px | — | 14px | — |
| `.tile__note` | SPAN | 305x17 | 0px | — | 0px | accounting-view-all |

Context of `.tile`: `app › bento › focal › pulse`

### `.grp`

Pages: single-lead, single-ticket · 35 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.grp` | DIV | 948x191 | 12px 0px 0px | — | 0px | single-lead single-ticket |
| `.grp__h` | DIV | 948x21 | 0px | 12px | 0px | single-lead single-ticket |
| `.grp__t` | SPAN | 234x21 | 0px | — | 0px | single-lead ~components single-ticket |
| `.grp__ed` | SPAN | 91x20 | 0px 7px | 5px | 4px | single-lead single-ticket |
| `.grp__s` | SPAN | 599x18 | 0px | — | 0px | single-lead single-ticket |
| `.grp--req` | DIV | 948x202 | 24px 0px 0px | — | 0px | — |
| `.grp__s--client` | SPAN | 779x19 | 0px | — | 0px | single-ticket |

Context of `.grp`: `app › field › secs › sec › sec__b › form`

### `.age`

Pages: all-vehicles, single-vehicle · 34 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.age` | DIV | 76x20 | 0px | 8px | 0px | all-vehicles single-vehicle |
| `.age--stale` | DIV | 76x20 | 0px | 8px | 0px | all-vehicles |
| `.age--mid` | DIV | 36x20 | 0px 7px | — | 4px | single-vehicle |
| `.age--late` | DIV | 76x20 | 0px | 8px | 0px | — |
| `.age--fresh` | DIV | 76x20 | 0px | 8px | 0px | all-vehicles |

Context of `.age`: `app › field › rows › DIV › row`

### `.tag`

Pages: all-vehicles, my-work-queue · 31 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tag` | SPAN | 70x24 | 0px 6px | — | 999px | all-vehicles ~family ~components my-work-queue |
| `.tag--more` | SPAN | 25x24 | 0px 5px | — | 999px | all-vehicles |
| `.tag--danger` | SPAN | 71x24 | 0px 6px | — | 999px | all-vehicles |

Context of `.tag`: `app › field › rows › DIV › row › tags`

### `.az`

Pages: manage-dealers, accounting · 28 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.az__b` | BUTTON | 22x24 | 0px 3px | — | 4px | manage-dealers |
| `.az` | NAV | 622x24 | 0px | 2px | 0px | manage-dealers accounting-view-all |

Context of `.az__b`: `app › field › sub › az`

### `.sec`

Pages: single-lead, single-ticket · 27 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.sec` | SECTION | 980x754 | 30px 0px 40px | — | 12px | single-lead ~family ~components single-ticket |
| `.sec__h` | DIV | 980x52 | 0px 16px 12px | 10px | 0px | single-lead ~components single-ticket |
| `.sec__b` | DIV | 980x628 | 8px 16px 0px | — | 0px | single-lead single-ticket |

Context of `.sec`: `app › field › secs`

### `.agerow`

Pages: all-vehicles, all-leads · 23 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.agerow` | BUTTON | 235x32 | 0px 8px | 8px | 7px | all-vehicles all-leads |
| `.agerow__l` | SPAN | 104x20 | 0px | — | 0px | all-vehicles all-leads |
| `.agerow__m` | SPAN | 27x6 | 0px | — | 999px | all-vehicles |

Context of `.agerow`: `app › bento › focal › agemix › agerows`

### `.ui-nav`

Pages: single-vehicle, dealer-edit · 23 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ui-nav__i` | BUTTON | 208x34 | 0px 12px | 8px | 7px | ~components |
| `.ui-nav` | NAV | 224x410 | 8px | 2px | 12px | ~components |
| `.ui-nav__i--on` | BUTTON | 208x34 | 0px 12px | 8px | 7px | ~components |

Context of `.ui-nav__i`: `app › body › rail`

### `.dock`

Pages: single-lead, single-ticket · 17 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.dock` | ASIDE | 400x790 | 0px | — | 12px | all-vehicles ~family single-ticket |
| `.dock__h` | DIV | 400x58 | 0px 12px 0px 24px | 8px | 0px | all-vehicles single-ticket |
| `.dock__t` | H2 | 65x20 | 0px | — | 0px | all-vehicles ~components single-ticket |
| `.dock__c` | SPAN | 249x20 | 0px | — | 0px | all-vehicles single-ticket |
| `.dock__x` | BUTTON | 34x34 | 0px | — | 9px | all-vehicles single-ticket |
| `.dock__b` | DIV | 400x673 | 16px 24px 8px | — | 0px | all-vehicles single-ticket |
| `.dock__f` | DIV | 400x59 | 12px 24px 16px | 8px | 0px | all-vehicles single-ticket |
| `.dock__note` | SPAN | 152x19 | 0px | 6px | 0px | all-vehicles single-lead ~components single-ticket |
| `.dock__f--row` | DIV | 400x59 | 12px 24px 16px | 8px | 0px | all-vehicles single-lead |

Context of `.dock`: `app`

### `.panel`

Pages: dealer-login, dealer-edit · 16 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.panel` | SECTION | 727x868 | 48px | 48px | 14px | dealer-login ~family dealer-edit |
| `.panel__hd` | DIV | 272x35 | 8px 12px | 8px | 0px | dealer-edit |
| `.panel__bd` | DIV | 272x193 | 12px | — | 0px | dealer-edit |
| `.panel__brand` | DIV | 631x29 | 0px | 12px | 0px | dealer-login |
| `.panel__say` | DIV | 395x260 | 0px | — | 0px | dealer-login |
| `.panel__n` | SPAN | 20x18 | 1px 6px | — | 999px | dealer-edit |
| `.panel--danger` | SECTION | 272x133 | 0px | — | 14px | — |
| `.panel__bd--stack` | DIV | 272x98 | 12px | 8px | 0px | dealer-edit |
| `.panel__hint` | P | 248x36 | 0px | — | 0px | dealer-edit |

Context of `.panel`: `auth`

### `.secnav`

Pages: single-lead, single-ticket · 15 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.secnav__b` | A | 97x30 | 0px 12px | 6px | 7px | single-lead ~family single-ticket |
| `.secnav` | NAV | 453x38 | 0px | 4px 6px | 0px | single-lead ~family single-ticket |
| `.secnav__b--on` | A | 84x30 | 0px 12px | 6px | 7px | single-lead ~components single-ticket |
| `.secnav__note` | SPAN | 135x19 | 0px | — | 0px | single-lead ~components single-ticket |

Context of `.secnav__b`: `app › field › cmd › secnav`

### `.composer`

Pages: single-lead, single-ticket · 11 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.composer` | FORM | 948x123 | 0px | 12px | 0px | single-lead single-ticket |
| `.composer__who` | SPAN | 36x36 | 0px | — | 50% | single-lead single-ticket |
| `.composer__b` | DIV | 900x123 | 0px | 8px | 0px | single-lead single-ticket |
| `.composer__lab` | LABEL | 900x13 | 0px | — | 0px | single-lead ~components single-ticket |
| `.composer__f` | DIV | 900x30 | 0px | 12px | 0px | single-lead single-ticket |
| `.composer--on` | FORM | 948x133 | 0px | 12px | 0px | single-ticket |

Context of `.composer`: `app › field › secs › sec › sec__b`

### `.chip`

Pages: single-ticket, dealer-edit · 11 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.chip` | SPAN | 175x24 | 0px 9px | 4px | 999px | single-ticket ~family ~components dealer-edit |
| `.chip--proj` | SPAN | 175x24 | 0px 9px | 4px | 999px | single-ticket |
| `.chip--dot` | SPAN | 175x24 | 0px 9px | 4px | 999px | — |
| `.chip--hot` | SPAN | 47x24 | 0px 9px | 4px | 999px | single-ticket |
| `.chip--type` | SPAN | 122x24 | 0px 9px | 4px | 999px | single-ticket |
| `.chip--green` | SPAN | 53x24 | 0px 9px | 5px | 999px | dealer-edit |
| `.chip--blue` | SPAN | 66x24 | 0px 9px | 5px | 999px | dealer-edit |

Context of `.chip`: `app › head › chips`

### `.savebar`

Pages: single-vehicle, dealer-edit · 10 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.savebar__b` | BUTTON | 151x34 | 0px 12px | 6px | 7px | single-vehicle ~family |
| `.savebar` | DIV | 1428x48 | 10px 24px | 10px 8px | 0px | single-vehicle ~family dealer-edit |
| `.savebar__n` | SPAN | 136x20 | 0px | — | 0px | single-vehicle ~family |
| `.savebar__hint` | SPAN | 380x19 | 0px | — | 0px | single-vehicle ~family ~components |
| `.savebar__b--discard` | BUTTON | 96x34 | 0px 12px | 6px | 7px | single-vehicle ~family |
| `.savebar__b--save` | BUTTON | 128x34 | 0px 12px | 6px | 7px | single-vehicle ~family |
| `.savebar__kbd` | SPAN | 64x17 | 0px | 2px | 0px | dealer-edit |

Context of `.savebar__b`: `app › savebar › pop-wrap`

### `.tl`

Pages: manage-dealers, accounting · 9 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tl` | SPAN | 83x30 | 0px 10px | 6px | 7px | manage-dealers ~components |

Context of `.tl`: `app › tally`

### `.hero`

Pages: all-vehicles, all-leads · 8 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.hero` | DIV | 276x52 | 0px | 16px | 0px | all-vehicles |
| `.hero__n` | DIV | 87x52 | 0px | — | 0px | all-vehicles |
| `.hero__l` | DIV | 98x42 | 0px 0px 3px | — | 0px | all-vehicles |
| `.hero__of` | SPAN | 98x15 | 0px | — | 0px | — |

Context of `.hero`: `app › bento › focal › focal__main`

### `.money`

Pages: single-vehicle, single-ticket · 8 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.money` | DIV | 364x48 | 0px | — | 0px | single-vehicle single-ticket |
| `.money--lg` | DIV | 364x48 | 0px | — | 0px | — |

Context of `.money`: `app › body › zones › zone › zone__b › grid › f`

### `.c-sec`

Pages: all-vehicles, all-leads · 5 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-sec` | DIV | 114x36 | 0px | — | 0px | — |

Context of `.c-sec`: `app › field › sub › qf`

### `.slot`

Pages: single-lead, single-ticket · 5 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.slot--enquiry` | DIV | 550x241 | 0px | — | 14px | single-lead |
| `.slot--counts` | DIV | 232x241 | 16px 24px | — | 14px | single-lead |
| `.slot--facts` | SECTION | 582x241 | 16px | — | 14px | single-lead |
| `.slot--pulse` | DIV | 911x202 | 20px 24px | — | 14px | single-ticket |
| `.slot--dealer` | NAV | 469x202 | 8px 0px | — | 14px | single-ticket |

Context of `.slot--enquiry`: `app › bento`

### `.src`

Pages: single-lead, single-ticket · 5 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.src` | P | 948x18 | 0px | — | 0px | single-lead single-ticket |

Context of `.src`: `app › field › secs › sec › sec__b`

### `.agemix`

Pages: all-vehicles, all-leads · 4 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.agemix` | DIV | 268x254 | 24px | — | 0px 14px 14px 0px | all-vehicles all-leads |
| `.agemix__h` | DIV | 167x20 | 0px | — | 0px | all-vehicles |

Context of `.agemix`: `app › bento › focal`

### `.feed`

Pages: single-lead, single-ticket · 4 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.feed` | OL | 948x421 | 0px | — | 0px | single-lead single-ticket |
| `.feed--clog` | OL | 948x2138 | 0px | — | 0px | — |

Context of `.feed`: `app › field › secs › sec › sec__b`

### `.agerows`

Pages: all-vehicles, all-leads · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.agerows` | DIV | 235x176 | 0px | 4px | 0px | all-vehicles all-leads |

Context of `.agerows`: `app › bento › focal › agemix`

### `.qf`

Pages: all-vehicles, all-leads · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.qf` | DIV | 537x36 | 0px | 4px | 0px | all-vehicles |

Context of `.qf`: `app › field › sub`

### `.c-status`

Pages: all-vehicles, all-leads · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-status` | SPAN | 132x15 | 0px | 4px | 0px | all-leads |

Context of `.c-status`: `app › field › rows › hd`

### `.lock`

Pages: all-vehicles, single-vehicle · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.lock` | SPAN | 20x20 | 0px | — | 7px | all-vehicles ~family single-vehicle |

Context of `.lock`: `app › field › rows › DIV › row › stk › stk__l`

### `.body`

Pages: single-vehicle, dealer-edit · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.body` | DIV | 1396x5066 | 16px 0px 0px | 16px | 0px | single-vehicle dealer-edit |

Context of `.body`: `app`

### `.zones`

Pages: single-vehicle, dealer-edit · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.zones` | DIV | 1156x12570 | 0px | — | 14px | single-vehicle ~components dealer-edit |

Context of `.zones`: `app › body`

### `.dock-open`

Pages: single-lead, single-ticket · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.dock-open` | DIV | 1428x3940 | 0px 16px 16px | 0px 16px | 0px | all-vehicles single-ticket |

### `.walk`

Pages: single-lead, single-ticket · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.walk` | SPAN | 157x30 | 0px | 4px | 0px | single-lead single-ticket |

Context of `.walk`: `app › head`

### `.ui-ctl`

Pages: single-lead, single-ticket · 2 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ui-ctl` | BUTTON | 105x36 | 0px 12px | 7px | 9px | ~components |

Context of `.ui-ctl`: `app › field › cmd`

### `.secs`

Pages: single-lead, single-ticket · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.secs` | DIV | 980x3113 | 0px | — | 0px | single-lead ~components single-ticket |

Context of `.secs`: `app › field`

### `.tot`

Pages: my-work-queue, accounting · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tot` | SPAN | 381x19 | 0px | 24px | 0px | my-work-queue accounting-view-all |

Context of `.tot`: `app › field › foot`

### `.c1`

Pages: manage-dealers · 1480 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c1` | SPAN | 294x19 | 0px | — | 0px | manage-dealers |

Context of `.c1`: `app › field › rows › DIV › row`

### `.ra`

Pages: manage-dealers · 1095 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ra` | A | 24x26 | 0px | — | 4px | manage-dealers |

Context of `.ra`: `app › field › rows › DIV › row › c-act`

### `.in`

Pages: single-vehicle · 772 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.in` | INPUT | 364x48 | 0px 12px 0px 30px | — | 7px | single-vehicle |
| `.in--sm` | INPUT | 200x36 | 0px 12px | — | 7px | single-vehicle |
| `.in--mono` | INPUT | 364x40 | 0px 12px | — | 7px | single-vehicle |

Context of `.in`: `app › body › zones › zone › zone__b › grid › f › money`

### `.ed`

Pages: my-work-queue · 564 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ed` | BUTTON | 26x22 | 2px 5px | — | 4px | my-work-queue |
| `.ed--num` | BUTTON | 26x22 | 2px 5px | — | 4px | my-work-queue |

Context of `.ed`: `app › field › rows › DIV › row › c`

### `.bstat`

Pages: accounting · 410 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.bstat` | SPAN | 14x14 | 0px | — | 0px | accounting-view-all |
| `.bstat--green` | SPAN | 14x14 | 0px | — | 0px | accounting-view-all |
| `.bstat--blue` | SPAN | 14x14 | 0px | — | 0px | accounting-view-all |
| `.bstat--amber` | SPAN | 14x14 | 0px | — | 0px | accounting-view-all |

Context of `.bstat`: `app › field › rows › DIV › row › c`

### `.pdot`

Pages: accounting · 410 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.pdot` | SPAN | 7x7 | 0px | — | 50% | accounting-view-all |
| `.pdot--ok` | SPAN | 7x7 | 0px | — | 50% | accounting-view-all |
| `.pdot--warn` | SPAN | 7x7 | 0px | — | 50% | accounting-view-all |
| `.pdot--bad` | SPAN | 7x7 | 0px | — | 50% | accounting-view-all |

Context of `.pdot`: `app › field › rows › DIV › row › c`

### `.num`

Pages: accounting · 410 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.num` | SPAN | 108x18 | 0px 0px 0px 12px | 6px | 0px | accounting-view-all |

Context of `.num`: `app › field › rows › DIV › row`

### `.c-state`

Pages: manage-dealers · 366 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-state` | SPAN | 46x14 | 0px | — | 0px | — |

Context of `.c-state`: `app › field › rows › hd`

### `.c-cre`

Pages: manage-dealers · 366 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-cre` | SPAN | 80x29 | 0px | 1px | 0px | manage-dealers |

Context of `.c-cre`: `app › field › rows › hd`

### `.c-feat`

Pages: manage-dealers · 366 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-feat` | SPAN | 124x14 | 0px | 3px | 0px | manage-dealers |

Context of `.c-feat`: `app › field › rows › hd`

### `.c-ver`

Pages: manage-dealers · 366 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-ver` | SPAN | 70x14 | 0px | 1px | 0px | manage-dealers |

Context of `.c-ver`: `app › field › rows › hd`

### `.c-mark`

Pages: manage-dealers · 365 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-mark` | SPAN | 32x20 | 0px | 2px | 0px | manage-dealers |

Context of `.c-mark`: `app › field › rows › DIV › row`

### `.id`

Pages: manage-dealers · 365 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.id` | SPAN | 26x13 | 0px | — | 0px | manage-dealers |

Context of `.id`: `app › field › rows › DIV › row › c-name › A`

### `.frf`

Pages: manage-dealers · 365 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.frf` | BUTTON | 20x20 | 0px | — | 4px | manage-dealers |

Context of `.frf`: `app › field › rows › DIV › row › c-feat`

### `.c-res`

Pages: manage-dealers · 363 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-res` | SPAN | 140x14 | 0px | — | 0px | manage-dealers |

Context of `.c-res`: `app › field › rows › hd`

### `.c-who`

Pages: my-work-queue · 247 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-who__l` | SPAN | 80x18 | 0px | 4px | 0px | my-work-queue |
| `.c-who` | SPAN | 80x14 | 0px | — | 0px | my-work-queue |

Context of `.c-who__l`: `app › field › rows › DIV › row › c`

### `.ld`

Pages: all-leads · 215 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ld` | DIV | 157x37 | 0px | — | 0px | all-leads |
| `.ld__n` | SPAN | 157x18 | 0px | — | 0px | all-leads |
| `.ld__id` | SPAN | 157x15 | 0px | — | 0px | all-leads |
| `.ld__nm` | SPAN | 48x13 | 0px | — | 0px | all-leads |

Context of `.ld`: `app › field › rows › DIV › row`

### `.ct`

Pages: all-leads · 210 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ct` | DIV | 177x37 | 0px | — | 0px | all-leads |
| `.ct__e` | SPAN | 177x18 | 0px | — | 0px | all-leads |
| `.ct__p` | SPAN | 177x15 | 0px | — | 0px | all-leads |

Context of `.ct`: `app › field › rows › DIV › row`

### `.ft`

Pages: manage-dealers · 206 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ft` | SPAN | 25x17 | 1px 6px 2px | — | 4px | manage-dealers |
| `.ft--more` | SPAN | 26x17 | 1px 6px 2px | — | 4px | manage-dealers |

Context of `.ft`: `app › field › rows › DIV › row › c-feat`

### `.c-stat`

Pages: accounting · 206 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-stat` | SPAN | 44x14 | 0px | 5px | 0px | accounting-view-all |

Context of `.c-stat`: `app › field › rows › hd`

### `.c-to`

Pages: accounting · 206 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-to` | SPAN | 56x15 | 0px | 3px | 0px | accounting-view-all |

Context of `.c-to`: `app › field › rows › hd`

### `.c-pay`

Pages: accounting · 206 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-pay` | SPAN | 72x15 | 0px | 3px | 0px | accounting-view-all |

Context of `.c-pay`: `app › field › rows › hd`

### `.c-mail`

Pages: accounting · 206 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-mail` | SPAN | 275x14 | 0px | — | 0px | accounting-view-all |

Context of `.c-mail`: `app › field › rows › hd`

### `.c-lp`

Pages: accounting · 206 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-lp` | SPAN | 132x15 | 0px | 3px | 0px | accounting-view-all |

Context of `.c-lp`: `app › field › rows › hd`

### `.c-bal`

Pages: accounting · 206 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-bal` | SPAN | 108x15 | 0px | 3px | 0px | accounting-view-all |

Context of `.c-bal`: `app › field › rows › hd`

### `.c-mo`

Pages: accounting · 206 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-mo` | SPAN | 100x15 | 0px | 3px | 0px | accounting-view-all |

Context of `.c-mo`: `app › field › rows › hd`

### `.bck`

Pages: accounting · 205 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.bck` | INPUT | 14x14 | 0px | — | 0px | accounting-view-all |

Context of `.bck`: `app › field › rows › DIV › row › c`

### `.did`

Pages: accounting · 205 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.did` | SPAN | 27x17 | 0px | — | 0px | accounting-view-all |

Context of `.did`: `app › field › rows › DIV › row › c`

### `.vh`

Pages: all-leads · 200 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.vh` | DIV | 144x37 | 0px | — | 0px | all-leads |
| `.vh__n` | SPAN | 144x18 | 0px | — | 0px | all-leads |
| `.vh__s` | SPAN | 144x15 | 0px | — | 0px | all-leads |
| `.vh--none` | DIV | 144x18 | 0px | — | 0px | — |

Context of `.vh`: `app › field › rows › DIV › row`

### `.amt`

Pages: accounting · 196 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.amt` | SPAN | 51x18 | 0px | — | 0px | accounting-view-all |

Context of `.amt`: `app › field › rows › DIV › row › c`

### `.paydate`

Pages: accounting · 196 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.paydate` | SPAN | 40x19 | 0px | — | 0px | accounting-view-all |

Context of `.paydate`: `app › field › rows › DIV › row › c`

### `.featrow`

Pages: single-vehicle · 183 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.featrow` | DIV | 1124x36 | 0px | 8px | 0px | single-vehicle |

Context of `.featrow`: `app › body › zones › zone › zone__b › featgrp`

### `.fu`

Pages: all-leads · 159 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.fu` | DIV | 96x18 | 0px | — | 0px | all-leads |
| `.fu--none` | DIV | 96x18 | 0px | — | 0px | — |
| `.fu--due` | DIV | 96x40 | 0px | — | 0px | — |
| `.fu__due` | SPAN | 64x15 | 0px | 4px | 0px | all-leads |

Context of `.fu`: `app › field › rows › DIV › row`

### `.due`

Pages: accounting · 124 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.due` | SPAN | 51x18 | 0px | — | 0px | accounting-view-all |

Context of `.due`: `app › field › rows › DIV › row › c`

### `.c-note`

Pages: manage-dealers · 110 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-note` | SPAN | 56x14 | 0px | — | 0px | manage-dealers |

Context of `.c-note`: `app › field › rows › hd`

### `.nt`

Pages: manage-dealers · 109 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.nt` | SPAN | 49x19 | 1px 6px 2px | — | 4px | manage-dealers |

Context of `.nt`: `app › field › rows › DIV › row › c-note`

### `.ac`

Pages: all-leads · 107 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ac` | DIV | 124x18 | 0px | — | 0px | all-leads |
| `.ac--none` | DIV | 124x18 | 0px | — | 0px | — |

Context of `.ac`: `app › field › rows › DIV › row`

### `.c-rank`

Pages: my-work-queue · 95 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-rank` | SPAN | 72x14 | 0px | — | 0px | my-work-queue |

Context of `.c-rank`: `app › field › rows › hd`

### `.ctr`

Pages: my-work-queue · 95 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ctr` | SPAN | 72x14 | 0px | — | 0px | — |

Context of `.ctr`: `app › field › rows › hd`

### `.c-tkt`

Pages: my-work-queue · 95 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-tkt` | SPAN | 60x14 | 0px | — | 0px | — |

Context of `.c-tkt`: `app › field › rows › hd`

### `.c-dlr`

Pages: my-work-queue · 95 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-dlr` | SPAN | 111x14 | 0px | — | 0px | — |

Context of `.c-dlr`: `app › field › rows › hd`

### `.c-sub`

Pages: my-work-queue · 95 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-sub` | SPAN | 177x14 | 0px | — | 0px | my-work-queue |

Context of `.c-sub`: `app › field › rows › hd`

### `.c-age`

Pages: my-work-queue · 95 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-age` | SPAN | 52x28 | 0px | — | 0px | my-work-queue |

Context of `.c-age`: `app › field › rows › hd`

### `.c-amt`

Pages: my-work-queue · 95 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-amt` | SPAN | 68x29 | 0px 0px 0px 12px | — | 0px | my-work-queue |

Context of `.c-amt`: `app › field › rows › hd`

### `.c-est`

Pages: my-work-queue · 95 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-est` | SPAN | 64x28 | 0px | — | 0px | my-work-queue |

Context of `.c-est`: `app › field › rows › hd`

### `.c-left`

Pages: my-work-queue · 95 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-left` | SPAN | 80x28 | 0px | — | 0px | my-work-queue |

Context of `.c-left`: `app › field › rows › hd`

### `.c-beg`

Pages: my-work-queue · 95 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-beg` | SPAN | 52x28 | 0px | — | 0px | — |

Context of `.c-beg`: `app › field › rows › hd`

### `.c-done`

Pages: my-work-queue · 95 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-done` | SPAN | 92x28 | 0px | — | 0px | — |

Context of `.c-done`: `app › field › rows › hd`

### `.c-grip`

Pages: my-work-queue · 94 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-grip` | SPAN | 20x32 | 0px | 1px | 0px | my-work-queue |

Context of `.c-grip`: `app › field › rows › DIV › row`

### `.grip`

Pages: my-work-queue · 94 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.grip` | BUTTON | 20x32 | 0px | — | 4px | my-work-queue |

Context of `.grip`: `app › field › rows › DIV › row › c`

### `.tkt`

Pages: my-work-queue · 94 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tkt` | A | 60x15 | 0px | — | 0px | my-work-queue |

Context of `.tkt`: `app › field › rows › DIV › row › c`

### `.dlr`

Pages: my-work-queue · 94 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.dlr` | A | 111x18 | 0px | 3px | 0px | my-work-queue |

Context of `.dlr`: `app › field › rows › DIV › row › c`

### `.gear`

Pages: my-work-queue · 94 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.gear` | A | 32x32 | 0px | — | 7px | my-work-queue |

Context of `.gear`: `app › field › rows › DIV › row › c`

### `.feedrow`

Pages: single-vehicle · 93 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.feedrow` | DIV | 546x38 | 7px 0px | 12px | 0px | single-vehicle |
| `.feedrow__n` | SPAN | 437x20 | 0px | — | 0px | single-vehicle |
| `.feedrow__t` | SPAN | 43x12 | 0px | — | 0px | single-vehicle |

Context of `.feedrow`: `app › body › zones › zone › zone__b › feeds`

### `.zero`

Pages: accounting · 93 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.zero` | SPAN | 7x18 | 0px | — | 0px | accounting-view-all |

Context of `.zero`: `app › field › rows › DIV › row › c`

### `.dash`

Pages: manage-dealers · 89 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.dash` | SPAN | 13x16 | 0px | — | 0px | manage-dealers |

Context of `.dash`: `app › field › rows › DIV › row › c-ver`

### `.vt`

Pages: manage-dealers · 85 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.vt` | SPAN | 54x14 | 0px 5px | — | 4px | manage-dealers |

Context of `.vt`: `app › field › rows › DIV › row › c-ver`

### `.fl`

Pages: dealer-edit · 82 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.fl` | LABEL | 418x19 | 0px | — | 0px | dealer-edit |
| `.fl--req` | LABEL | 418x19 | 0px | — | 0px | — |

Context of `.fl`: `app › body › zones › zone › fg › fw`

### `.as`

Pages: all-leads · 81 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.as` | DIV | 116x20 | 0px | — | 0px | all-leads |
| `.as--none` | DIV | 116x20 | 0px | — | 0px | all-leads |

Context of `.as`: `app › field › rows › DIV › row`

### `.na`

Pages: my-work-queue · 81 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.na` | SPAN | 22x16 | 0px | — | 0px | my-work-queue |

Context of `.na`: `app › field › rows › DIV › row › c`

### `.c-wt`

Pages: my-work-queue · 79 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-wt` | SPAN | 88x14 | 0px | — | 0px | my-work-queue |

Context of `.c-wt`: `app › field › rows › hd`

### `.ty`

Pages: all-leads · 70 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ty` | DIV | 112x15 | 0px | — | 0px | all-leads |

Context of `.ty`: `app › field › rows › DIV › row`

### `.sc`

Pages: all-leads · 70 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.sc` | DIV | 104x20 | 0px | — | 0px | all-leads |

Context of `.sc`: `app › field › rows › DIV › row`

### `.cr`

Pages: all-leads · 70 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.cr` | DIV | 96x37 | 0px | — | 0px | all-leads |

Context of `.cr`: `app › field › rows › DIV › row`

### `.c-pkg`

Pages: manage-dealers · 66 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-pkg` | SPAN | 108x14 | 0px 0px 0px 12px | — | 0px | manage-dealers |

Context of `.c-pkg`: `app › field › rows › hd`

### `.who`

Pages: single-ticket · 62 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.who` | SPAN | 102x20 | 0px | — | 0px | single-ticket |

Context of `.who`: `app › field › secs › sec › sec__b › feed › ev › ev__b › ev__t`

### `.own`

Pages: my-work-queue · 57 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.own` | I | 27x18 | 0px | — | 0px | my-work-queue |

Context of `.own`: `app › field › rows › DIV › row › c › c-who__l`

### `.stk`

Pages: all-vehicles · 48 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.stk` | DIV | 104x38 | 0px | — | 0px | all-vehicles |
| `.stk__l` | SPAN | 104x19 | 0px | 5px | 0px | all-vehicles |
| `.stk__vin` | SPAN | 104x15 | 0px | — | 0px | all-vehicles |

Context of `.stk`: `app › field › rows › DIV › row`

### `.price`

Pages: all-vehicles · 42 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.price` | DIV | 118x18 | 0px 0px 0px 12px | 2px | 0px | all-vehicles |
| `.price__v` | DIV | 74x18 | 0px | 5px | 0px | all-vehicles |
| `.price--none` | DIV | 118x18 | 0px 0px 0px 12px | 2px | 0px | all-vehicles |
| `.price__sub` | DIV | 90x13 | 0px | 5px | 0px | all-vehicles |
| `.price__sub--lease` | DIV | 120x13 | 0px | 5px | 0px | — |
| `.price__sub--disc` | DIV | 90x13 | 0px | 5px | 0px | — |

Context of `.price`: `app › field › rows › DIV › row`

### `.att`

Pages: single-ticket · 40 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.att` | DIV | 948x44 | 12px 0px | 12px | 0px | single-ticket |
| `.att__f` | SPAN | 683x20 | 0px | — | 0px | single-ticket |
| `.att__gone` | SPAN | 92x20 | 0px 7px | — | 4px | single-ticket ~family |
| `.att__m` | SPAN | 221x19 | 0px | — | 0px | single-ticket |

Context of `.att`: `app › field › secs › sec › sec__b › atts`

### `.cc`

Pages: single-ticket · 40 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.cc` | DIV | 356x151 | 12px 0px | — | 0px | single-ticket |
| `.cc__r1` | DIV | 356x20 | 0px | 8px | 0px | single-ticket |
| `.cc__num` | SPAN | 21x17 | 0px | — | 0px | single-ticket |
| `.cc__n` | SPAN | 97x20 | 0px | — | 0px | single-ticket |
| `.cc__m` | DIV | 356x17 | 0px | — | 0px | single-ticket |
| `.cc__ctl` | DIV | 356x72 | 0px | 8px | 0px | single-ticket |
| `.cc__disc` | BUTTON | 63x32 | 0px 8px | 4px | 7px | single-ticket |
| `.cc--done` | DIV | 356x150 | 12px 0px | — | 0px | single-ticket |
| `.cc__num--ranked` | SPAN | 21x17 | 0px | — | 0px | single-ticket |

Context of `.cc`: `app › dock › dock__b › crew`

### `.tm`

Pages: single-ticket · 35 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tm` | SPAN | 76x72 | 0px | 4px | 0px | single-ticket |
| `.tm__k` | SPAN | 76x16 | 0px | — | 0px | single-ticket |
| `.tm__echo` | SPAN | 76x16 | 0px | — | 0px | single-ticket |
| `.tm--narrow` | SPAN | 62x72 | 0px | 4px | 0px | — |

Context of `.tm`: `app › dock › dock__b › crew › cc › cc__ctl`

### `.photo`

Pages: single-vehicle · 28 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.photo` | FIGURE | 118x79 | 0px | — | 7px | single-vehicle |
| `.photo__ix` | SPAN | 18x18 | 0px 5px | — | 4px | single-vehicle |
| `.photo--ph` | FIGURE | 118x79 | 0px | — | 7px | single-vehicle |
| `.photo__star` | SPAN | 20x20 | 0px | — | 4px | single-vehicle |
| `.photo--more` | DIV | 118x79 | 0px | — | 7px | single-vehicle |
| `.photo--add` | BUTTON | 118x79 | 0px | 5px | 7px | single-vehicle |

Context of `.photo`: `app › body › zones › zone › zone__b › photos`

### `.swrow`

Pages: single-vehicle · 26 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.swrow` | DIV | 546x65 | 12px 0px | 16px | 0px | single-vehicle |
| `.swrow__x` | SPAN | 488x41 | 0px | — | 0px | single-vehicle |
| `.swrow--danger` | DIV | 546x65 | 12px 0px | 16px | 0px | — |

Context of `.swrow`: `app › body › zones › zone › zone__b › vis`

### `.fact`

Pages: single-lead · 24 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.fact` | DIV | 263x43 | 4px 0px | 1px | 0px | single-lead |
| `.fact__l` | SPAN | 263x15 | 0px | — | 0px | single-lead |
| `.fact__v` | SPAN | 263x19 | 0px | — | 0px | single-lead |

Context of `.fact`: `app › bento › attn › attn__g`

### `.em`

Pages: single-lead · 24 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.em` | DIV | 948x64 | 12px 0px | 12px | 0px | single-lead |
| `.em__dir` | SPAN | 41x20 | 0px 7px | — | 4px | single-lead ~family |
| `.em__s` | SPAN | 492x40 | 0px | — | 0px | single-lead ~family |
| `.em__p` | SPAN | 492x18 | 0px | — | 0px | single-lead ~family |
| `.em__w` | SPAN | 208x18 | 0px | — | 0px | single-lead ~family |
| `.em__d` | SPAN | 124x18 | 0px | — | 0px | single-lead |
| `.em__x` | SPAN | 24x14 | 0px | — | 0px | single-lead |
| `.em__dir--out` | SPAN | 41x20 | 0px 7px | — | 4px | single-lead |
| `.em__dir--in` | SPAN | 27x20 | 0px 7px | — | 4px | single-lead |

Context of `.em`: `app › field › secs › sec › sec__b › mail`

### `.prev`

Pages: single-ticket · 24 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.prev` | SPAN | 822x22 | 2px 8px | — | 4px | single-ticket |
| `.prev--none` | SPAN | 822x22 | 2px 8px | — | 4px | single-ticket |

Context of `.prev`: `app › field › secs › sec › sec__b › disc › feed › ev › ev__b`

### `.c-sup`

Pages: manage-dealers · 24 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-sup` | SPAN | 66x14 | 0px | — | 0px | — |

Context of `.c-sup`: `app › field › rows › hd`

### `.seal`

Pages: dealer-edit · 21 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.seal__b` | BUTTON | 73x28 | 0px 10px | 5px | 7px | dealer-edit ~family |
| `.seal` | DIV | 418x40 | 0px 8px 0px 12px | 8px | 7px | dealer-edit |
| `.seal__lock` | SPAN | 14x14 | 0px | — | 0px | dealer-edit |
| `.seal__dots` | SPAN | 184x16 | 0px | — | 0px | dealer-edit |
| `.seal__none` | SPAN | 62x18 | 0px | — | 0px | dealer-edit |

Context of `.seal__b`: `app › body › zones › zone › fg › fw › seal`

### `.th`

Pages: all-vehicles · 19 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.th` | SPAN | 84x60 | 0px | — | 4px | all-vehicles ~family |
| `.th--none` | SPAN | 84x60 | 0px | — | 4px | all-vehicles |

Context of `.th`: `app › field › rows › DIV › row`

### `.tab`

Pages: single-vehicle · 18 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tab` | BUTTON | 96x30 | 0px 13px | 7px | 7px | single-vehicle ~family |
| `.tab__dot` | SPAN | 7x7 | 0px | — | 50% | single-vehicle |
| `.tab__dot--empty` | SPAN | 7x7 | 0px | — | 50% | single-vehicle |
| `.tab--on` | BUTTON | 107x30 | 0px 13px | 7px | 7px | single-vehicle ~family |

Context of `.tab`: `app › body › zones › zone › zone__b › tabs`

### `.by`

Pages: single-ticket · 18 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.by` | SPAN | 120x19 | 0px | — | 0px | single-ticket |

Context of `.by`: `app › field › secs › sec › sec__b › disc › feed › ev › ev__b › ev__t`

### `.for`

Pages: single-ticket · 17 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.for` | DIV | 822x19 | 0px | — | 0px | single-ticket |

Context of `.for`: `app › field › secs › sec › sec__b › disc › feed › ev › ev__b`

### `.stock`

Pages: all-vehicles · 16 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.stock` | A | 51x19 | 3px 6px | — | 5px | all-vehicles |

Context of `.stock`: `app › field › rows › DIV › row › stk › stk__l`

### `.yr`

Pages: all-vehicles · 16 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.yr` | DIV | 46x20 | 0px | — | 0px | all-vehicles |

Context of `.yr`: `app › field › rows › DIV › row`

### `.md`

Pages: all-vehicles · 16 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.md` | DIV | 120x20 | 0px | — | 0px | all-vehicles |

Context of `.md`: `app › field › rows › DIV › row`

### `.trim`

Pages: all-vehicles · 16 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.trim` | DIV | 84x20 | 0px | — | 0px | all-vehicles |

Context of `.trim`: `app › field › rows › DIV › row`

### `.ext`

Pages: all-vehicles · 16 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ext` | DIV | 92x20 | 0px | 7px | 0px | all-vehicles |

Context of `.ext`: `app › field › rows › DIV › row`

### `.tags`

Pages: all-vehicles · 16 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tags` | DIV | 230x73 | 0px 10px | 3px | 0px | all-vehicles |

Context of `.tags`: `app › field › rows › DIV › row`

### `.acts`

Pages: all-vehicles · 16 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.acts` | SPAN | 108x30 | 0px | 0px | 10px | all-vehicles |

Context of `.acts`: `app › field › rows › DIV › row`

### `.del`

Pages: all-vehicles · 16 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.del` | BUTTON | 27x30 | 0px | — | 7px | — |

Context of `.del`: `app › field › rows › DIV › row › acts`

### `.dot`

Pages: dealer-edit · 16 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.dot` | SPAN | 7x7 | 0px | — | 999px | dealer-edit ~family |
| `.dot--grey` | SPAN | 7x7 | 0px | — | 999px | dealer-edit |
| `.dot--green` | SPAN | 7x7 | 0px | — | 999px | dealer-edit |
| `.dot--amber` | SPAN | 7x7 | 0px | — | 999px | dealer-edit |

Context of `.dot`: `app › body › rail › rail__b`

### `.rec`

Pages: single-lead · 15 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.rec__l` | SPAN | 161x15 | 0px | — | 0px | single-lead |
| `.rec__v` | SPAN | 161x18 | 0px | — | 0px | single-lead |
| `.rec` | DIV | 948x208 | 8px 0px 24px | 24px | 0px | single-lead |
| `.rec__img` | DIV | 208x130 | 0px | — | 12px | single-lead |
| `.rec__b` | DIV | 716x176 | 0px | — | 0px | single-lead |
| `.rec__cap` | SPAN | 317x15 | 0px | 5px | 0px | single-lead |
| `.rec__n` | DIV | 716x37 | 0px | — | 0px | single-lead |
| `.rec__g` | DIV | 716x53 | 0px | 0px 24px | 0px | single-lead |
| `.rec__acts` | DIV | 716x30 | 0px | 8px | 0px | single-lead |

Context of `.rec__l`: `app › field › secs › sec › sec__b › rec › rec__b › rec__g › DIV`

### `.okmark`

Pages: all-vehicles · 11 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.okmark` | SPAN | 48x19 | 2px 6px | 5px | 0px | all-vehicles |

Context of `.okmark`: `app › field › rows › DIV › row › tags`

### `.badge`

Pages: single-vehicle · 11 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.badge` | SPAN | 25x18 | 0px 6px | — | 999px | single-vehicle ~family ~components |
| `.badge--ok` | SPAN | 45x18 | 0px 6px | — | 999px | single-vehicle |

Context of `.badge`: `app › cockpit › cock__acts › btn`

### `.rlink`

Pages: single-ticket · 11 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.rlink` | A | 225x32 | 0px 12px | 10px | 7px | single-ticket ~components |
| `.rlink__l` | SPAN | 162x14 | 0px | — | 0px | single-ticket |
| `.rlink--dev` | A | 453x32 | 0px 12px | 10px | 7px | single-ticket |

Context of `.rlink`: `app › bento › rail › rail__ls`

### `.muted`

Pages: accounting · 10 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.muted` | SPAN | 13x19 | 0px | — | 0px | accounting-view-all |

Context of `.muted`: `app › field › rows › DIV › row › c`

### `.cock`

Pages: single-vehicle · 9 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.cock__back` | A | 105x36 | 0px 12px 0px 10px | 6px | 7px | single-vehicle ~family |
| `.cock__thumb` | SPAN | 60x36 | 0px | — | 7px | single-vehicle |
| `.cock__id` | DIV | 626x46 | 0px | 3px | 0px | single-vehicle |
| `.cock__l1` | DIV | 626x21 | 0px | 8px | 0px | single-vehicle |
| `.cock__t` | H1 | 161x21 | 0px | — | 0px | single-vehicle |
| `.cock__l2` | DIV | 626x22 | 0px | 6px | 0px | single-vehicle |
| `.cock__acts` | DIV | 537x30 | 0px | 8px | 0px | single-vehicle ~family |
| `.cock__price` | SPAN | 91x28 | 0px | 2px | 0px | single-vehicle |
| `.cock__nav` | SPAN | 78x30 | 0px | 2px 6px | 0px | single-vehicle ~family |

Context of `.cock__back`: `app › cockpit`

### `.fsec`

Pages: dealer-edit · 9 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.fsec` | DIV | 860x29 | 12px 0px 0px | — | 0px | dealer-edit |

Context of `.fsec`: `app › body › zones › zone › fg`

### `.fg`

Pages: dealer-edit · 8 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.fg` | DIV | 860x828 | 0px | 16px 24px | 0px | dealer-edit |

Context of `.fg`: `app › body › zones › zone`

### `.gl`

Pages: my-work-queue · 7 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.gl` | A | 203x26 | 0px 14px 0px 0px | 7px | 0px | my-work-queue ~family ~components |
| `.gl--all` | A | 117x26 | 0px 14px | 7px | 0px | my-work-queue |

Context of `.gl`: `app › golive`

### `.fh`

Pages: dealer-edit · 7 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.fh` | P | 418x17 | 0px | — | 0px | dealer-edit |

Context of `.fh`: `app › body › zones › zone › fg › fw`

### `.featgrp`

Pages: single-vehicle · 6 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.featgrp` | DIV | 1124x56 | 0px | — | 0px | — |
| `.featgrp__h` | DIV | 1124x30 | 0px | 12px | 0px | single-vehicle |

Context of `.featgrp`: `app › body › zones › zone › zone__b`

### `.tog`

Pages: all-leads · 6 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tog` | BUTTON | 137x36 | 0px 12px | 6px | 9px | all-leads |
| `.tog__k` | SPAN | 87x12 | 0px | — | 0px | all-leads ~components |
| `.tog__v` | SPAN | 19x14 | 0px | — | 0px | all-leads |

Context of `.tog`: `app › field › cmd`

### `.vcar`

Pages: single-lead · 6 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.vcar` | DIV | 192x241 | 16px | 4px | 0px | single-lead |
| `.vcar__cap` | DIV | 160x15 | 0px | — | 0px | single-lead |
| `.vcar__img` | DIV | 160x88 | 0px | — | 7px | single-lead |
| `.vcar__t` | DIV | 160x35 | 0px | — | 0px | single-lead |
| `.vcar__m` | DIV | 160x15 | 0px | — | 0px | single-lead |
| `.vcar__acts` | DIV | 160x28 | 8px 0px 0px | — | 0px | single-lead |

Context of `.vcar`: `app › bento › focal`

### `.lk`

Pages: manage-dealers · 6 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.lk` | SPAN | 11x19 | 0px | — | 0px | manage-dealers |

Context of `.lk`: `app › field › rows › DIV › row › c-mark`

### `.pkgl`

Pages: manage-dealers · 6 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.pkgl` | BUTTON | 96x19 | 0px | — | 0px | manage-dealers |

Context of `.pkgl`: `app › field › rows › DIV › row › c-pkg`

### `.xb`

Pages: dealer-edit · 6 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.xb` | BUTTON | 40x40 | 0px | — | 7px | dealer-edit |

Context of `.xb`: `app › body › zones › zone › fg › fw › rep › rep__r`

### `.pill`

Pages: single-vehicle · 5 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.pill` | SPAN | 83x20 | 0px 7px | — | 999px | single-vehicle ~family ~components |
| `.pill--ok` | SPAN | 83x20 | 0px 7px | — | 999px | single-vehicle |

Context of `.pill`: `app › cockpit › cock__id › cock__l1`

### `.prov`

Pages: single-vehicle · 5 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.prov` | BUTTON | 364x18 | 0px | 5px | 0px | single-vehicle |
| `.prov--has` | BUTTON | 364x18 | 0px | 5px | 0px | single-vehicle |

Context of `.prov`: `app › body › zones › zone › zone__b › grid › f`

### `.featcat`

Pages: single-vehicle · 5 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.featcat` | DIV | 1124x17 | 0px | — | 0px | single-vehicle |

Context of `.featcat`: `app › body › zones › zone › zone__b › featgrp`

### `.ring`

Pages: single-ticket · 5 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ring` | INPUT | 20x20 | 0px | — | 50% | single-ticket |

Context of `.ring`: `app › dock › dock__b › crew › cc › cc__r1`

### `.opt`

Pages: dealer-edit · 5 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.opt` | SPAN | 19x40 | 0px 0px 0px 2px | 8px | 0px | dealer-edit |
| `.opt--bare` | SPAN | 19x40 | 0px 0px 0px 2px | 8px | 0px | dealer-edit |

Context of `.opt`: `app › body › zones › zone › fg › fw`

### `.vitals`

Pages: single-vehicle · 4 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.vitals__f` | SPAN | 234x20 | 0px | 6px | 0px | single-vehicle |
| `.vitals` | DIV | 1396x48 | 12px 8px 8px | 8px 24px | 0px | single-vehicle |

Context of `.vitals__f`: `app › vitals`

### `.aicta`

Pages: single-vehicle · 4 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.aicta` | BUTTON | 1124x44 | 12px 16px | 12px | 9px | single-vehicle |
| `.aicta__k` | SPAN | 18x18 | 0px | — | 0px | single-vehicle |
| `.aicta__x` | SPAN | 938x20 | 0px | — | 0px | single-vehicle |
| `.aicta__go` | SPAN | 112x20 | 0px | — | 0px | single-vehicle |

Context of `.aicta`: `app › body › zones › zone › zone__b`

### `.sep`

Pages: single-lead · 4 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.sep` | SPAN | 4x18 | 0px | — | 0px | single-lead |

Context of `.sep`: `app › bento › focal › focal__main › ident › ident__row`

### `.demo`

Pages: single-lead · 4 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.demo` | SPAN | 49x18 | 0px 6px | — | 4px | all-vehicles single-lead |

Context of `.demo`: `app › bento › attn › attn__h`

### `.facts`

Pages: single-lead · 4 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.facts` | DIV | 352x216 | 16px 0px | — | 0px | single-lead |
| `.facts__h` | DIV | 352x18 | 0px | 8px | 0px | single-lead |

Context of `.facts`: `app › dock › dock__b`

### `.rt`

Pages: dealer-edit · 4 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.rt--warn` | TR | 860x48 | 0px | — | 0px | — |

Context of `.rt--warn`: `app › body › zones › zone › fg › fw › routing › rtbl › TBODY`

### `.control`

Pages: dealer-login · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.control` | DIV | 380x44 | 0px | — | 0px | dealer-login |
| `.control--pw` | DIV | 380x44 | 0px | — | 0px | — |

Context of `.control`: `auth › form › form__in › FORM › formrow`

### `.copy`

Pages: single-vehicle · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.copy` | BUTTON | 22x22 | 0px | — | 6px | single-vehicle |

Context of `.copy`: `app › cockpit › cock__id › cock__l2`

### `.ident`

Pages: single-lead · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ident__row` | DIV | 309x48 | 0px | 4px 12px | 0px | single-lead |
| `.ident` | DIV | 309x104 | 12px 0px 0px | 4px | 0px | single-lead |

Context of `.ident__row`: `app › bento › focal › focal__main › ident`

### `.mail`

Pages: single-lead · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.mail` | DIV | 948x253 | 0px | — | 0px | single-lead |
| `.mail__h` | DIV | 948x31 | 8px 0px | 12px | 0px | single-lead |
| `.mail__f` | DIV | 948x30 | 12px 0px 0px | 12px | 0px | single-lead |

Context of `.mail`: `app › field › secs › sec › sec__b`

### `.wf`

Pages: single-lead · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.wf` | FORM | 352x355 | 0px 0px 24px | 16px | 0px | single-lead |
| `.wf__state` | DIV | 352x40 | 0px 0px 16px | 12px | 0px | single-lead |
| `.wf__flags` | FIELDSET | 352x41 | 0px | — | 0px | single-lead |

Context of `.wf`: `app › dock › dock__b`

### `.golive`

Pages: my-work-queue · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.golive` | DIV | 1396x46 | 10px 16px | 0px | 0px | my-work-queue ~family ~components |
| `.golive__l` | SPAN | 94x13 | 0px 4px 0px 0px | 6px | 0px | my-work-queue ~family ~components |
| `.golive__n` | B | 7x13 | 0px | — | 0px | my-work-queue |

Context of `.golive`: `app`

### `.rep`

Pages: dealer-edit · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.rep__r` | DIV | 860x40 | 0px | 8px | 0px | dealer-edit |
| `.rep` | DIV | 860x128 | 0px | 8px | 0px | dealer-edit |

Context of `.rep__r`: `app › body › zones › zone › fg › fw › rep`

### `.addb`

Pages: dealer-edit · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.addb` | BUTTON | 69x32 | 0px 12px | 6px | 7px | dealer-edit ~family |

Context of `.addb`: `app › body › zones › zone › fg › fw › rep`

### `.fpair`

Pages: dealer-edit · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.fpair` | DIV | 418x40 | 0px | 8px | 0px | dealer-edit |

Context of `.fpair`: `app › body › zones › zone › fg › fw`

### `.routing`

Pages: dealer-edit · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.routing` | DIV | 860x322 | 0px | 12px | 0px | dealer-edit |
| `.routing__hint` | P | 860x19 | 0px | — | 0px | dealer-edit |
| `.routing__xref` | P | 860x19 | 0px | — | 0px | dealer-edit |

Context of `.routing`: `app › body › zones › zone › fg › fw`

### `.note`

Pages: dealer-edit · 3 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.note` | DIV | 248x34 | 0px | 2px | 7px | dealer-edit ~family |
| `.note__who` | SPAN | 248x13 | 0px | — | 0px | dealer-edit |
| `.note__txt` | SPAN | 248x19 | 0px | — | 0px | dealer-edit |

Context of `.note`: `app › body › side › panel › panel__bd › notes`

### `.ui-filter`

Pages: accounting · 3 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ui-filter` | BUTTON | 83x30 | 0px 10px | 6px | 7px | ~components |

Context of `.ui-filter`: `app › field › cmdtop › statuses`

### `.support`

Pages: dealer-login · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.support` | DIV | 631x68 | 24px 0px 0px | 8px | 0px | dealer-login |
| `.support__rows` | DIV | 631x22 | 0px | 8px 32px | 0px | dealer-login |

Context of `.support`: `auth › panel`

### `.formrow`

Pages: dealer-login · 2 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.formrow` | DIV | 380x72 | 0px | — | 0px | — |

Context of `.formrow`: `auth › form › form__in › FORM`

### `.pop-wrap`

Pages: single-vehicle · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.pop-wrap` | SPAN | 105x30 | 0px | — | 0px | single-vehicle |

Context of `.pop-wrap`: `app › cockpit › cock__acts`

### `.vinbar`

Pages: single-vehicle · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.vinbar` | DIV | 1124x50 | 10px 12px | 8px 12px | 9px | single-vehicle |
| `.vinbar__v` | SPAN | 156x15 | 0px | — | 0px | single-vehicle |

Context of `.vinbar`: `app › body › zones › zone › zone__b`

### `.ta`

Pages: single-vehicle · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ta` | TEXTAREA | 1124x304 | 10px 12px | — | 7px | single-vehicle |
| `.ta--tall` | TEXTAREA | 1124x304 | 10px 12px | — | 7px | single-vehicle |

Context of `.ta`: `app › body › zones › zone › zone__b › desc › DIV › f`

### `.featnone`

Pages: single-vehicle · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.featnone` | P | 1124x18 | 0px | — | 0px | single-vehicle |

Context of `.featnone`: `app › body › zones › zone › zone__b › featgrp`

### `.refbox`

Pages: single-vehicle · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.refbox` | DIV | 1124x99 | 12px 0px | 8px | 0px | single-vehicle |

Context of `.refbox`: `app › body › zones › zone › zone__b`

### `.hint`

Pages: single-lead · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.hint` | P | 948x26 | 0px 0px 8px | — | 0px | all-vehicles single-lead |

Context of `.hint`: `app › field › secs › sec › sec__b`

### `.emails`

Pages: single-ticket · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.emails` | DIV | 305x63 | 0px | 4px | 0px | single-ticket |
| `.emails__r` | DIV | 305x40 | 0px | 4px | 0px | single-ticket |

Context of `.emails`: `app › field › secs › sec › sec__b › form › grp › grid › f`

### `.assign`

Pages: single-ticket · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.assign` | DIV | 356x32 | 0px | 8px | 0px | single-ticket |

Context of `.assign`: `app › dock › dock__b`

### `.crewfoot`

Pages: single-ticket · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.crewfoot` | DIV | 356x32 | 12px 0px 0px | 16px | 0px | single-ticket |
| `.crewfoot__done` | SPAN | 27x19 | 0px | — | 0px | single-ticket |

Context of `.crewfoot`: `app › dock › dock__b`

### `.follow`

Pages: single-ticket · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.follow` | DIV | 356x107 | 16px 0px 0px | — | 0px | single-ticket |
| `.follow__v` | SPAN | 356x19 | 0px | 4px | 0px | single-ticket |

Context of `.follow`: `app › dock › dock__b`

### `.tally`

Pages: manage-dealers · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tally` | DIV | 1396x42 | 0px 0px 12px | 6px | 0px | manage-dealers ~family ~components |
| `.tally__l` | SPAN | 50x13 | 0px 4px 0px 0px | — | 0px | manage-dealers ~components |

Context of `.tally`: `app`

### `.projact`

Pages: dealer-edit · 2 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.projact` | DIV | 860x30 | 0px | 8px | 0px | dealer-edit |
| `.projact__hint` | SPAN | 420x17 | 0px | — | 0px | dealer-edit |

Context of `.projact`: `app › body › zones › zone › fg › fw`

### `.ui-select`

Pages: accounting · 2 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ui-select` | LABEL | 188x36 | 0px 0px 0px 12px | 8px | 9px | ~components |

Context of `.ui-select`: `app › field › cmd`

### `.auth`

Pages: dealer-login · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.auth` | MAIN | 1440x900 | 16px | 24px | 0px | dealer-login |

### `.mark`

Pages: dealer-login · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.mark` | SPAN | 53x29 | 4px 11px | — | 6px | dealer-login ~family |

Context of `.mark`: `auth › panel › panel__brand`

### `.eye`

Pages: dealer-login · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.eye` | BUTTON | 36x36 | 1px 6px | — | 7px | dealer-login |

Context of `.eye`: `auth › form › form__in › FORM › formrow › control`

### `.legal`

Pages: dealer-login · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.legal` | DIV | 380x99 | 24px 0px 0px | 8px 24px | 0px | dealer-login |

Context of `.legal`: `auth › form › form__in`

### `.live`

Pages: all-vehicles · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.live` | SPAN | 131x20 | 0px | 7px | 0px | all-vehicles |

Context of `.live`: `app › head`

### `.c-cols`

Pages: all-vehicles · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-cols` | DIV | 138x36 | 0px | — | 0px | — |

Context of `.c-cols`: `app › field › cmd`

### `.c-trim`

Pages: all-vehicles · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-trim` | SPAN | 84x15 | 0px | — | 0px | — |

Context of `.c-trim`: `app › field › rows › hd`

### `.c-ext`

Pages: all-vehicles · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-ext` | SPAN | 92x15 | 0px | — | 0px | — |

Context of `.c-ext`: `app › field › rows › hd`

### `.c-price`

Pages: all-vehicles · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-price` | SPAN | 39x15 | 0px | 4px | 0px | all-vehicles |

Context of `.c-price`: `app › field › rows › hd`

### `.c-health`

Pages: all-vehicles · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-health` | SPAN | 218x29 | 0px | 4px | 0px | all-vehicles |

Context of `.c-health`: `app › field › rows › hd`

### `.avt`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.avt` | BUTTON | 34x34 | 0px | — | 50% | single-vehicle |

Context of `.avt`: `app › top › nav__it`

### `.cockpit`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.cockpit` | DIV | 1396x72 | 0px 16px | 12px | 14px | single-vehicle |

Context of `.cockpit`: `app`

### `.vin`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.vin` | SPAN | 133x13 | 0px | — | 0px | single-vehicle |

Context of `.vin`: `app › cockpit › cock__id › cock__l2`

### `.linkbtn`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.linkbtn` | BUTTON | 86x18 | 0px | 5px | 0px | single-vehicle |

Context of `.linkbtn`: `app › vitals`

### `.statusrow`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.statusrow` | DIV | 1124x59 | 0px | 24px | 0px | single-vehicle |

Context of `.statusrow`: `app › body › zones › zone › zone__b`

### `.vis`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.vis` | DIV | 1124x215 | 0px | normal 32px | 0px | single-vehicle |

Context of `.vis`: `app › body › zones › zone › zone__b`

### `.photos`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.photos` | DIV | 1124x165 | 0px | 8px | 0px | single-vehicle |

Context of `.photos`: `app › body › zones › zone › zone__b`

### `.chip-src`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.chip-src` | SPAN | 196x20 | 0px 8px | 5px | 4px | single-vehicle |

Context of `.chip-src`: `app › body › zones › zone › zone__h`

### `.tabs`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tabs` | DIV | 692x38 | 4px | 2px 6px | 9px | single-vehicle ~family |

Context of `.tabs`: `app › body › zones › zone › zone__b`

### `.desc`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.desc` | DIV | 1124x351 | 0px | 16px | 0px | single-vehicle |

Context of `.desc`: `app › body › zones › zone › zone__b`

### `.feedtools`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.feedtools` | DIV | 1124x38 | 0px | 8px 12px | 0px | single-vehicle |

Context of `.feedtools`: `app › body › zones › zone › zone__b`

### `.feeds`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.feeds` | DIV | 1124x608 | 0px | normal 32px | 0px | single-vehicle |

Context of `.feeds`: `app › body › zones › zone › zone__b`

### `.feedfoot`

Pages: single-vehicle · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.feedfoot` | DIV | 1124x36 | 0px | 12px | 0px | single-vehicle |

Context of `.feedfoot`: `app › body › zones › zone › zone__b`

### `.warn`

Pages: all-leads · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.warn` | DIV | 25x24 | 0px | — | 0px | — |

Context of `.warn`: `app › bento › value › kv › DIV`

### `.c-lead`

Pages: all-leads · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-lead` | SPAN | 157x15 | 0px | 4px | 0px | — |

Context of `.c-lead`: `app › field › rows › hd`

### `.c-contact`

Pages: all-leads · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-contact` | SPAN | 177x15 | 0px | — | 0px | — |

Context of `.c-contact`: `app › field › rows › hd`

### `.c-vehicle`

Pages: all-leads · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-vehicle` | SPAN | 144x15 | 0px | — | 0px | — |

Context of `.c-vehicle`: `app › field › rows › hd`

### `.c-type`

Pages: all-leads · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-type` | SPAN | 112x15 | 0px | — | 0px | — |

Context of `.c-type`: `app › field › rows › hd`

### `.c-source`

Pages: all-leads · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-source` | SPAN | 104x15 | 0px | — | 0px | — |

Context of `.c-source`: `app › field › rows › hd`

### `.c-rep`

Pages: all-leads · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-rep` | SPAN | 116x15 | 0px | 4px | 0px | — |

Context of `.c-rep`: `app › field › rows › hd`

### `.c-created`

Pages: all-leads · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-created` | SPAN | 76x15 | 0px | 4px | 0px | all-leads |

Context of `.c-created`: `app › field › rows › hd`

### `.c-follow`

Pages: all-leads · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-follow` | SPAN | 96x15 | 0px | 4px | 0px | — |

Context of `.c-follow`: `app › field › rows › hd`

### `.c-activity`

Pages: all-leads · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.c-activity` | SPAN | 124x15 | 0px | — | 0px | — |

Context of `.c-activity`: `app › field › rows › hd`

### `.quote`

Pages: single-lead · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.quote` | BLOCKQUOTE | 309x45 | 0px | — | 0px | single-lead |

Context of `.quote`: `app › bento › focal › focal__main`

### `.raw`

Pages: single-lead · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.raw` | DETAILS | 948x34 | 16px 0px 0px | — | 0px | single-lead ~family |

Context of `.raw`: `app › field › secs › sec › sec__b`

### `.workflow-flags`

Pages: single-lead · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.workflow-flags` | DIV | 352x20 | 0px | 24px | 0px | single-lead |

Context of `.workflow-flags`: `app › dock › dock__b › wf › wf__flags`

### `.utm`

Pages: single-lead · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.utm` | PRE | 352x114 | 12px | — | 7px | single-lead |

Context of `.utm`: `app › dock › dock__b › facts`

### `.ui-strip`

Pages: my-work-queue · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ui-strip` | DIV | 1396x46 | 10px 16px | 0px | 0px | ~components |

Context of `.ui-strip`: `app`

### `.tid`

Pages: single-ticket · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.tid` | SPAN | 81x21 | 0px | — | 0px | single-ticket |

Context of `.tid`: `app › head › head__id › H1`

### `.chips`

Pages: single-ticket · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.chips` | DIV | 360x24 | 0px | 4px 8px | 0px | single-ticket ~family |

Context of `.chips`: `app › head`

### `.pulse`

Pages: single-ticket · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.pulse` | DIV | 863x107 | 0px | 0px | 0px | single-ticket |

Context of `.pulse`: `app › bento › focal`

### `.cash`

Pages: single-ticket · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.cash` | SPAN | 104x30 | 0px | — | 0px | single-ticket |

Context of `.cash`: `app › bento › focal › pulse › tile › tile__v`

### `.rowadd`

Pages: single-ticket · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.rowadd` | BUTTON | 73x19 | 0px | — | 0px | single-ticket |

Context of `.rowadd`: `app › field › secs › sec › sec__b › form › grp › grid › f › emails`

### `.composers`

Pages: single-ticket · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.composers` | DIV | 948x133 | 0px | — | 0px | single-ticket |

Context of `.composers`: `app › field › secs › sec › sec__b`

### `.disc`

Pages: single-ticket · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.disc` | DIV | 948x2138 | 0px | — | 0px | — |

Context of `.disc`: `app › field › secs › sec › sec__b`

### `.atts`

Pages: single-ticket · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.atts` | DIV | 948x440 | 0px | — | 0px | single-ticket |

Context of `.atts`: `app › field › secs › sec › sec__b`

### `.crew`

Pages: single-ticket · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.crew` | DIV | 356x782 | 0px | 8px | 0px | single-ticket |

Context of `.crew`: `app › dock › dock__b`

### `.legend`

Pages: single-ticket · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.legend` | DETAILS | 356x35 | 16px 0px 0px | — | 0px | single-ticket |

Context of `.legend`: `app › dock › dock__b`

### `.dbchip`

Pages: dealer-edit · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.dbchip` | A | 216x22 | 0px 8px | 5px | 999px | dealer-edit |

Context of `.dbchip`: `app › head › head__id › head__row`

### `.doms`

Pages: dealer-edit · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.doms` | DIV | 860x88 | 0px | 8px | 0px | dealer-edit |

Context of `.doms`: `app › body › zones › zone › fg › fw`

### `.rtbl`

Pages: dealer-edit · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.rtbl` | TABLE | 860x215 | 0px | — | 0px | dealer-edit |

Context of `.rtbl`: `app › body › zones › zone › fg › fw › routing`

### `.opts`

Pages: dealer-edit · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.opts` | SPAN | 860x40 | 0px | 8px 24px | 0px | dealer-edit |

Context of `.opts`: `app › body › zones › zone › fg › fw`

### `.side`

Pages: dealer-edit · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.side` | ASIDE | 272x769 | 0px | 16px | 0px | dealer-edit |

Context of `.side`: `app › body`

### `.notes`

Pages: dealer-edit · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.notes` | DIV | 248x34 | 0px | 12px | 0px | dealer-edit |

Context of `.notes`: `app › body › side › panel › panel__bd`

### `.utils`

Pages: accounting · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.utils` | NAV | 388x32 | 0px | 4px | 0px | accounting-view-all |

Context of `.utils`: `app › head`

### `.deck`

Pages: accounting · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.deck` | SECTION | 1396x148 | 0px 0px 16px | 16px | 0px | accounting-view-all |

Context of `.deck`: `app`

### `.statuses`

Pages: accounting · 1 uses · needs a page stylesheet

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.statuses` | DIV | 352x30 | 0px | 6px | 0px | accounting-view-all ~family |

Context of `.statuses`: `app › field › cmdtop`

### `.ui-filters`

Pages: accounting · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.ui-filters` | DIV | 352x30 | 0px | 6px | 0px | ~components |

Context of `.ui-filters`: `app › field › cmdtop`

### `.flt`

Pages: accounting · 1 uses · **shared layer only**

| token | tag | box | padding | gap | radius | files |
|---|---|---|---|---|---|---|
| `.flt__k` | SPAN | 45x13 | 0px | — | 0px | ~components |

Context of `.flt__k`: `app › field › cmdtop › statuses`

---

## 3 · How to read a rule line

Each token above resolves to a list of matching rules in cascade order. They are
kept out of this file for length; regenerate with the probe to see them. The shape is:

    <stylesheet>[@media ...] | <selector> { <declarations> }

The practical consequence, and the reason specimens carry an ancestor chain: a great
deal of Gen 11 is scoped. `.veh__acts` has no rules of its own — every rule that gives
it layout is written `.exp .veh__acts`. Lift the leaf out of `.exp` and it renders as
an unstyled block.
