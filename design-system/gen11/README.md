# AAN Gen 11 — living design system

The shipped Gen 11 UI, extracted from the ten live pages. Every specimen in the
catalogue is the product's own DOM, rendered by the product's own stylesheets.
Nothing is drawn for the catalogue.

    open:  design-system/gen11/index.html

---

## Why this was rebuilt

The first version of this catalogue drew its own components — a `Primary /
Sheet / Quiet / Pressed / Disabled` button set that existed nowhere in the
product. That was not laziness; it was forced by the architecture.

`dist/aan-gen11.css` is `pages/_aan-family.css` + `pages/_aan-components.css`.
Those two files are **override layers**: they correct and normalise components,
they do not define them. Measured across the ten pages:

| | |
|---|---|
| class tokens on visible boxes | **667** |
| component blocks | **309** |
| blocks the shared layer styles outright | **36** |
| blocks that need at least one page stylesheet | **273** |

A catalogue loading only the bundle can render 36 of 309 blocks. The other 273
render as unstyled divs — so the previous catalogue had no choice but to
approximate. `SOURCE-MAP.md` has the full measurement.

---

## How the catalogue renders real components

Ten pages use **eight distinct stylesheet stacks**, and the stacks collide: each
page declares its own `.app` grid, its own `--row`, its own `--cols`. They cannot
be concatenated into one document.

So each chapter of the catalogue is an `<iframe>` pointing at a **specimen host**
that loads exactly one page's stack, from `pages/`, in the page's own order:

    specimens/lead.html
      ../../../pages/dealer/all-vehicles-gen11.css
      ../../../pages/dealer/single-lead-gen11.css
      ../../../pages/_aan-family.css
      ../../../pages/_aan-components.css
      _specimen.css          ← catalogue chrome, every rule namespaced sp-*

Nothing is copied. The specimen loads the same file the shipped page loads, so a
specimen **cannot** drift from the product: change the product and the catalogue
changes with it.

### The ancestor chain

Gen 11 scopes a great deal of its CSS. `.veh__acts` has no rules of its own —
every rule that gives it layout is written `.exp .veh__acts`. A leaf lifted out of
its context renders unstyled, which is the other half of why the old catalogue had
to redraw things.

So each specimen carries the real ancestor chain, taken from the live DOM:

    <div class="app" data-sp-chain><section class="field has-open" data-sp-chain>…
      <div class="veh__acts">…the real fragment…</div>
    …</section></div>

The wrappers are marked `data-sp-chain` and flattened by `_specimen.css` — they
exist to satisfy a selector, not to be seen. `.app` is a 100vh page grid; left
alone it would make every specimen 900px tall and nine-tenths empty. **The
specimen itself is never in that set**, and no catalogue rule ever touches it.

The chain is printed under every specimen as CONTEXT.

### The stage stands in for the container

Flattening the chain removes the boxes that did the sizing, and almost nothing
in Gen 11 sizes itself. A status chip is the width of its grid cell. A metric
tile is as tall as the tallest tile in its strip. The global search is the width
of its flex basis inside the platform bar, not the width its own rule declares.

Measured before this was addressed: **80 of 120 specimens rendered at the wrong
size.** The chip that ships at 80px was 1396px wide.

So each stage is given the box the extractor measured on the shipped page, and
then four containers are tried — block, grid, a grid whose track fills the
stage, and a flex row — and whichever reproduces the product's box is kept. The
chosen one is written onto the stage as `data-sp-fit`, with the score for each,
so it can be read in devtools.

Nothing in this lands on the specimen. That is the point of searching for the
container rather than declaring the size on the component.

Two things the stage also handles, both measured rather than declared:

- a component that ships `position: fixed` — the commit bar — anchors to the
  stage rather than the viewport, because the stage is given a transform and
  becomes its containing block. The specimen keeps its own `position: fixed`.
- a component wider than its stage scrolls inside it, and only then.

**Where the catalogue still differs from the product**, at 1440, is four
specimens out of 120, all in height only, and two of those are the product
clipping its own content — see the head row under *Known product defects* in
`ANTI-PATTERNS.md`. Run `_tools/qa.html` to see the current list.

---

## Files

| | |
|---|---|
| `index.html` | the catalogue — ten chapters, one per page stack |
| `specimens/*.html` | **generated.** one host per stack, 120 specimens |
| `specimens/_specimen.css` | catalogue chrome. Every rule namespaced `sp-` |
| each host's `<svg>` sprite | **the page's own**, copied verbatim. Ten pages ship ten different sets — 34 symbols on All Vehicles, 24 on Single Ticket, 2 on Login — and one shared sprite left 24 icons pointing at symbols that were not there |
| `specimens/_specimen.js` | reports host height to the catalogue frame |
| `_tools/spec.json` | which components to extract, and what to say about them |
| `_tools/extract.html` | **step 1.** reads the ten live pages, writes the census |
| `_tools/gen-specimens.js` | **step 2.** writes the ten specimen hosts |
| `_tools/gen-docs.js` | writes INVENTORY.md and PAGE-SPECIFIC.md |
| `_tools/gen-tokens.js` | writes TOKENS.md from computed values |
| `_tools/gen-components.js` | writes COMPONENTS.md |
| `_tools/qa.html` | the width sweep: overflow, bleed, clipping, inset, drift |
| `_tools/compare.html` | one component, product vs catalogue, every value |
| `_tools/probe.html` | rule lookup for one element on one page |
| `dist/aan-gen11.css` | the shared layer, for consumers outside this repo |
| `dist/build.sh` | regenerates the bundle with provenance |

### Documents

| | |
|---|---|
| `SOURCE-MAP.md` | which file styles what. Generated, 309 blocks |
| `INVENTORY.md` | every reusable element, role, geometry, usage. Generated |
| `PAGE-SPECIFIC.md` | the 205 families that belong to one page. Generated |
| `TOKENS.md` | 193 custom properties as the pages compute them. Generated |
| `RULES.md` | the contracts: spacing, separation, surfaces, controls, states |
| `PATTERNS.md` | how the pieces are assembled on a real page |
| `ANTI-PATTERNS.md` | what the system refuses, and what it does instead |
| `MIGRATION.md` | taking an old backend page to Gen 11 |

---

## Regenerating

The census comes first. Everything else is written from it.

    # 1 · read the product. Open in a browser, then in the console:
    #     design-system/gen11/_tools/extract.html
    #     await window.extract()          → downloads frags.json
    #
    #     It has to be a browser: a specimen is the element as it exists at
    #     runtime, after the page's script has built the rows and opened the
    #     expansion. The HTML file alone is the markup before any of that.

    # 2 · write the catalogue and the documents from it
    set FRAGS=<path to frags.json>
    node design-system/gen11/_tools/gen-specimens.js
    node design-system/gen11/_tools/gen-components.js
    node design-system/gen11/_tools/gen-docs.js
    node design-system/gen11/_tools/gen-tokens.js

    # 3 · after changing the shared layer
    bash design-system/gen11/dist/build.sh

    # 4 · check it
    #     design-system/gen11/_tools/qa.html
    #     await window.sweep(1440)   also 1920, 1366, 1280

The bundle build warns when the working tree is dirty: if the bundle and the
sources disagree, **the sources win** and the bundle is stale.

Generated hosts link every stylesheet with a build stamp. Without it the browser
serves a cached product stylesheet and the catalogue quietly shows last week's
product — which it did, until the queue's lane strip wrapped onto two lines here
and one line there and gave it away.

---

## The one rule this system is built on

**If it is not shipped in Gen 11, it is not a specimen.**

Every visible thing in the catalogue maps to a real selector, a real source file,
a real page and real effective CSS. Where a pattern could not be traced, it was
recorded in `PAGE-SPECIFIC.md` rather than tidied into a shared abstraction that
does not exist.
