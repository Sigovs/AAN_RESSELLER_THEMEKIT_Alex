# AAN Gen 11: handoff for the dev team and for agents

This package is the design for the AAN control panel. It covers both themes, light and dark. It is also
what you use to bring the new backend (Laravel/Livewire, `ui-*` components, `theme.css`) to the Gen 11 look.

Start with **[the design system](https://sigovs.github.io/aan-gen11-v3-preview/handoff/design-system.html)**. It is the main document.

Download everything for the backend in one zip: https://sigovs.github.io/aan-gen11-v3-preview/handoff/aan-gen11-handoff.zip

## What is in it

| File | What it is | Who it is for |
|---|---|---|
| [`design-system.html`](https://sigovs.github.io/aan-gen11-v3-preview/handoff/design-system.html) (open in a browser) | **The design system.** It covers every colour token in light and dark with its contrast and the backend token that carries it. It also covers type roles, spacing, radius, elevation, the 69 icons, focus and motion, and layout. Every component appears with its variants and states. A **Light / Dark** switch sits at the top left. Each component is drawn by its origin page's own CSS, so the file cannot drift from the pages. | everyone; read it first |
| [`rules-and-backend.html`](https://sigovs.github.io/aan-gen11-v3-preview/handoff/rules-and-backend.html) (open in a browser) | **Rules and backend map.** The 14 principles, the problems we solved and must not bring back, which pattern to use for which need, and each component with the Gen 11 reference next to the backend's `ui-*` markup restyled by the two layers below. Tokens and breakpoints are not repeated here: they are in the design system. | anyone restyling the backend |
| [`aan-gen11-theme.css`](https://raw.githubusercontent.com/Sigovs/AAN_RESSELLER_THEMEKIT_Alex/handoff/handoff/aan-gen11-theme.css) | **The token layer for the backend.** It gives the backend's own tokens (`--color-*`, `--status-*`, `--radius-*`, `--shadow-*`, `--control-height*`, fonts) their Gen 11 values, light in `:root` and dark in `[data-theme="dark"]`. It changes no markup. | backend devs |
| [`aan-gen11-components.css`](https://raw.githubusercontent.com/Sigovs/AAN_RESSELLER_THEMEKIT_Alex/handoff/handoff/aan-gen11-components.css) | **The component layer for the backend.** It restyles the `ui-*` components to Gen 11, and its header lists the markup changes it needs. Every colour goes through a token or a `--g11-*` variable, so it is right in both themes. | backend devs |
| `fonts/` (in the zip) | Archivo (variable) and IBM Plex Mono, self-hosted. `aan-gen11-theme.css` loads them from `fonts/` beside it. | — |
| [`DESIGN.md`](https://raw.githubusercontent.com/Sigovs/AAN_RESSELLER_THEMEKIT_Alex/handoff/DESIGN.md) (also in the zip) | The full written system, §0–42. It is the source of every rule. §42 is the dark theme. | agents, reviewers |
| [The ten reference pages](https://www.allautonetwork.com/previews/aan_reseller_2026_design_v3/) | **The Gen 11 pages** with real data. Source: [`pages/`](https://github.com/Sigovs/AAN_RESSELLER_THEMEKIT_Alex/tree/handoff/pages). Where this package and a page disagree, the page wins. | everyone |
| [`tools/ds-check/`](https://github.com/Sigovs/AAN_RESSELLER_THEMEKIT_Alex/tree/handoff/tools/ds-check) | Checks: `ds-check.mjs` (drift against the system, widths), `dark-audit.mjs` (dark theme: light surfaces and text under AA on the rendered page), `features.mjs` (nothing lost on tablet). | agents, QA |

## Bringing the backend to Gen 11

1. Load the CSS in this order: the backend's `theme.css`, then `aan-gen11-theme.css`, then
   `aan-gen11-components.css`. Nothing in the backend's own files is edited.
2. Make the markup changes listed in the header of `aan-gen11-components.css`, for example
   `aria-current="page"` on the current top-nav group.
3. Check each screen against its Gen 11 reference page side by side, at 1440 × 900, 1366 × 768 and
   1280 × 800. Measure the first screen too: where the first field sits and how many fields are visible
   without scrolling. A work screen needs density, so put the air *between* groups, not inside rows.
4. Dark needs no extra step. The backend already switches with `<html data-theme="dark">`, and both
   layers carry their dark values.

## Dark theme in one paragraph

The dark theme is called "dimmed graphite". Everything you work on is neutral graphite, and the board alone
is navy. That gives two materials, as in light.
- The ground is `#191b1f`, not black. Text is a soft near-white, `#dcdfe5`, and steps down from there.
- Tokens keep their **role**, not their lightness. The well and hover lift in dark instead of sinking.
- Two "paper" areas stay white: the window-sticker preview and the description editor's text area,
  because that area previews the dealer's light website.
- Every text pair passes AA, measured on the rendered page.

The details are in DESIGN.md §42. You can see it live on the reference pages: the moon / sun button in the top bar
(1280px and wider), or account menu → **Dark theme**, or add `#dark` to the URL. The choice is stored in `localStorage['aan-theme']` and shared by all pages.

## Known limits of this handoff

- **The backend layers are not yet checked on every backend screen.** In light, 45 of the 73 selectors in
  `aan-gen11-components.css` were matched against live backend screens. The other 28 come from `theme.css`
  class names on screens not opened yet; the file's header lists them. Check them against the Blade markup
  before relying on them.
- **The dark layer has not been run on the backend yet.** Its values are the Gen 11 pages' own, one to one.
  The exceptions are `--color-surface-2` and `--color-surface-inset`, which Gen 11 has no role for. They are
  derived and marked so in the file.
- **Open design decisions** are listed at the end of DESIGN.md: small differences between pages, such as
  a label size, a menu check mark or a dock width. Until they are decided, use the **origin page's** value,
  the earliest page in the order below. Field heights are decided: 36 in a form, 30 in a dense working form.
- **The test pages are not references.** Feeds Incoming and Create A Ticket were built from the system as
  experiments. They are not a model for form density.

## Rules an agent must keep

- **Take, don't invent.** Every value comes from a reference page, `DESIGN.md`, or the backend's own token.
  If Gen 11 has no role for something, keep the backend's value and mark it "kept".
- **One system.** When two pages disagree, the earlier page wins:
  All Vehicles → Single Vehicle → All Leads → Single Lead → Dealer Login → My Work Queue → Single Ticket →
  Manage Dealers → Dealer Edit → Accounting.
  - The same component has the same width, height and inner metrics on every page.
- **Nothing jumps.** Reserve space, so no state change moves the layout.
- **Text never touches its edge.** Keep at least 8px inside chips, tags, menu items and nav items, 10px
  inside buttons, and 16px beside a divider.
- **Sentence case.** No caps on chips. Labels never wrap. Table columns are left-aligned.
- **Facelift.** A control the live system doesn't have is a product decision, not a design one. Comment it
  out and list it under New features; never delete it.
- **Verify in a browser** at 1920 · 1440 · 1366 · 1280 · 1024 · 768. Check for no horizontal overflow and
  no console errors, and run `dark-audit.mjs` for dark.
