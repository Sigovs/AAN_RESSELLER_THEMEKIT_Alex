# AAN Gen 11 — Design System & Reseller Theme Kit

The system that already exists in the ten shipped Gen 11 pages, extracted,
measured and packaged so another page can be migrated into the same language.

**This is not a redesign.** Nothing here was invented. Every value was read out of
the running implementation, and every rule exists because its opposite was built
in Gen 11 at some point and had to be undone.

---

## Provenance

| | |
|---|---|
| Source of truth | `pages/_aan-family.css` · `pages/_aan-components.css` |
| Extracted from | `28db54c` |
| Method | each of the ten pages loaded at 1440×900 (and 1366 / 1280 / 1920 / 1366×610 for responsive checks); every value read back with `getComputedStyle` |
| Pages changed by this work | **none** — `git diff` on `pages/` is empty |

The distributable stylesheet is **generated**, never hand-edited:

```bash
bash design-system/gen11/dist/build.sh
```

It concatenates the two source files with a provenance header naming the commit,
and marks the header if the sources are dirty. **If the bundle and the sources
disagree, the sources win and the bundle is stale.**

---

## Read in this order

| File | What it answers |
|---|---|
| **[index.html](index.html)** | *Show me.* The working catalogue — every component live, running on the real stylesheet. |
| **[TOKENS.md](TOKENS.md)** | *What are the values?* Colour, type, spacing, tiers, radius, depth, layers — with their semantic roles. |
| **[COMPONENTS.md](COMPONENTS.md)** | *What is the markup and what are its states?* |
| **[PATTERNS.md](PATTERNS.md)** | *How does a whole page go together?* Four archetypes. |
| **[RULES.md](RULES.md)** | *What must I not get wrong?* Hard implementation rules + the exceptions register. |
| **[ANTI-PATTERNS.md](ANTI-PATTERNS.md)** | *What must I never build?* With the evidence for each. |
| **[MIGRATION.md](MIGRATION.md)** | *How do I convert an old backend page?* Step by step, with worked examples. |

---

## Using it in a page

```html
<link rel="stylesheet" href="path/to/aan-gen11.css">
```

or, inside this repo, the two sources in order — the component layer **must** load
second, because it is the normalised system and has to outrank whatever a page's
own stylesheet still carries:

```html
<link rel="stylesheet" href="../_aan-family.css">
<link rel="stylesheet" href="../_aan-components.css">
```

Fonts ship from `ds/fonts/` — Archivo (variable, 100–900) and IBM Plex Mono. No
CDN font.

---

## The shape of the system, in numbers

| | |
|---|---|
| Tokens found | **193** — 188 identical on every page, 5 varying |
| Distinct classes across the ten pages | **753** |
| Classes shared by six or more pages | **41** — the shared layer |
| Classes used on exactly one page | **505** — page implementation, not system |
| Page archetypes | **4** — Gateway · List · Record · Editor |
| Documented exceptions | **9** |

### What is genuinely normalised

The `ui-*` components render **identically on every page that uses them** —
`ui-view`, `ui-view--on`, `ui-thead`, `ui-nav__i`, `ui-filter`, `tbtn`. Measured,
not asserted.

### What still drifts

The older per-page classes do not. `.btn--primary` has five variants across the
ten pages; `.ck` has three radii including `0`; `.bdg` has heights of 26px and
12px. These are listed in COMPONENTS §9 and RULES §10 and are **migration
targets** — they were not silently fixed during extraction.

**Practical rule:** when migrating, reach for the `ui-*` component first. If a
component appears in the exceptions register, use the role value from TOKENS.md,
not the value on whatever page you are copying from.

---

## One honest tension

The Gen 11 table cell is **13px** — the single most common type in the product
(5,821 occurrences). The house design DNA sets a 14px floor for functional text.
This kit documents what the product does rather than changing it; the 13px cell is
recorded as the measured role, and raising it would be a deliberate product
decision, not an extraction.
