# Gen 11 — ANTI-PATTERNS

Each entry is something this product has actually done, usually more than once.
Every prohibition is followed by what Gen 11 does instead, because a rule that
only says *no* gets broken by the next person who needs to ship something.

---

## Text glued to a surface edge

**Seen:** the design-system catalogue printed every chapter number, title and
descriptor at x = 0 of the card. The chapter was `padding: 30px 0 40px`, so the
body remembered an inset of its own and the header never got one.

**Gen 11 uses this instead:** every structural surface owns its content inset —
16px, declared once, on the surface. A child never depends on whatever padding its
parent happens to have. If you find yourself adding padding to a heading because
it is touching an edge, the padding belongs to the container.

---

## Buttons touching

**Seen three times.** The platform nav at `column-gap: 0`, because eight
destinations were 16px short at 1440 and the width was taken from the gap. The
section tabs at `gap: 3px 1px`, so four bordered boxes read as one slab. The
record's prev/next arrows at 2px.

**Gen 11 uses this instead:** 8px between standalone actions, 6px between members
of a segmented control. **Separation is never the elastic member** — when a row
does not fit, the width comes out of a search field, a label, or a scroller.

---

## Random padding, spacing, radius, shadow

**Seen:** `.spec { margin-top: 20px }`, `.gb__b { padding: 14px }`, `10px` gaps,
`2px` page nudges, a 30px chapter pad, three different radii for the same control
on three pages.

**Gen 11 uses this instead:** the ladder — 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64
— and one radius scale: 4 micro, 7 inner, 9 control, 12 panel, 14 card, 999 pill.
One shadow per floating object, never two on the same boundary.

---

## Pill soup

**Seen:** 98 rules setting a 999px radius, on nav items, account controls,
toolbars, search fields, tab strips, save bars and section rails as well as on the
chips that want one. The lane rail was a capsule containing capsules, on the page,
above a rounded workspace — three rounded containers deep for "which lane am I in".

**Gen 11 uses this instead:** the pill is reserved, by semantic role, for status
chips, segmented thumbs, filter chips, counters, lane items, switch tracks and
avatars. Everything structural takes a radius from the scale. A lane rail is a
joined strip with one hairline, attached to the workspace it scopes.

---

## Giant white slabs

**Seen:** a full-width white rectangle whose only job was to contain text, with
the content floating in the middle of it.

**Gen 11 uses this instead:** rhythm, dividers and attached sections. A sheet
exists because something operational lives on it — a list, a form, a record. If
the only content is prose, it goes on the ground with a rule above it.

---

## Giant dead grey cavities

**Seen:** Dealer Edit's 208px rail held 331px of links beside a 5,224px form, so
the left sixth of the page was empty ground for 4,893px, with one rounded brand
capsule floating in it as the current section.

**Gen 11 uses this instead:** the rail is a panel in the same material as the form
it indexes, and the current section is a full-width row with a brand edge. A
sticky column that travels with the reader is fine; a column of nothing is not.

---

## A blank slab inside a dark panel

**Seen:** Single Ticket's summary panel was 259px tall and held 19px of label at
the top and 86px of metrics at the bottom — 122px of nothing between them, because
its height was set by the rail beside it.

**Gen 11 uses this instead:** when a panel is stretched by a neighbour, the slack
is shared above and below the content, not stacked into one hole.

---

## Generic SaaS cards, and cards inside cards

**Seen:** crew assignments as cards inside the Crew card inside the dock. Notes
and Options as floating cards with drop shadows beside a form that is a flat sheet.

**Gen 11 uses this instead:** one material per workspace. Repeated items are rows
separated by a hairline. A panel beside a form is the same sheet with the same
hairline, not a card with a shadow.

---

## Legacy blue underline tabs

**Seen:** the staff bar marked the current destination with a long blue underline
bar, the old web-nav pattern.

**Gen 11 uses this instead:** the current destination is carried by ink, weight
and a restrained surface. Blue means "you are here", so every destination cannot
be blue.

---

## Fake frozen columns

**Never shipped, and must not be.** A sticky first column in a seventeen-column
table looks like a fix and behaves like a bug at every width you did not test.

**Gen 11 uses this instead:** below the width where the columns stop fitting, the
**list** scrolls horizontally inside the workspace. Every column stays. The page
itself never scrolls sideways.

---

## Unrelated-row dimming

**Removed.** When a row was selected, the rest of the list was dimmed. It made the
list unreadable at the exact moment the operator wanted to compare.

**Gen 11 uses this instead:** the selected row takes the dark treatment; every
other row is untouched and fully legible.

---

## Arbitrary scroll centring

**Removed.** `scrollIntoView({ block: 'center' })` puts the record wherever the
viewport happens to allow.

**Gen 11 uses this instead:** the selected row comes to rest at
`--stick-total + --anchor-gap`, a named position under the sticky stack. Nothing
hardcodes an offset; `#exp-space` lends the document the shortfall near the end of
a list.

---

## A floating save CTA

**Seen:** Save Dealer as a 60px pill fixed to the centre of the viewport — the
shape a marketing site uses for "Get started".

**Gen 11 uses this instead:** the commit bar sits over the workspace it commits,
right-aligned with the form, at card radius and control height. It still floats,
because a 5,000px record needs the commit reachable; it does not advertise.

---

## A global rule that changes `display`

**Seen:** a blanket "nothing sticks to an edge" rule set `display: inline-flex` on
every small labelled object — and swept `.mn__it` in with the chips. Every menu in
the product then laid its items out on one line. It only became visible where the
labels were long: the bulk-assign menu rendered 2426px wide and was cut off.

**Gen 11 uses this instead:** a shared rule may set padding, margin, typography and
colour across elements that genuinely share a role. It may not set `display`,
position, flex/grid behaviour or width across unrelated component types. A menu
item and a status chip are not the same role.

---

## Copying the old backend's visual styling

**Gen 11 uses this instead:** the shipped backend is the authority for *content* —
labels, fields, destinations, workflow, what a control does. It is not the
authority for how anything looks. Take the meaning, leave the treatment.

---

## Inventing features during a reskin

**Gen 11 uses this instead:** if a control has no source, it does not ship. When a
Gen 11 page appeared to need something the old page did not have, the right move
was to report the gap, not to design it.

---

## Flattening the character away

Restrained is not the same as absent. Gen 11 keeps its dark focal panels, its
directional brand gradients, and one restrained glow on a true primary. A page
where every surface is white and every state is grey has solved the wrong problem.

**Gen 11 uses this instead:** one focal object per page, one primary per group, and
the glow only on the control that commits.

---

## A specimen with no provenance

**Seen:** a catalogue of `Primary / Sheet / Quiet / Pressed / Disabled` buttons
that existed nowhere in the product, drawn because the bundle the catalogue loaded
could not render the real ones.

**Gen 11 uses this instead:** every specimen is the product's own DOM, in the
ancestor chain its CSS is scoped to, rendered by the product's own stylesheets,
with the selector, the source files and the pages printed underneath it. No
provenance, no specimen.

---

## A specimen that is the right component at the wrong size

**Seen:** a status chip the product draws at 80px, shown 1396px wide. A group of
health tags the product wraps onto three lines at 230px, shown on one line at
1408px. The component was real, its CSS was real, and the picture was still a
lie — because almost nothing in Gen 11 sizes itself, and lifting a component out
of its row or its bento or its bar takes the sizing with it.

Measured before this was addressed: **80 of 120 specimens** rendered at the
wrong size.

**Gen 11 uses this instead:** the extractor records the box each component has
on the shipped page, and the catalogue stage stands in for the container that
gave it that box. The stage is chrome; nothing lands on the specimen. What is
left is checked on every build — `_tools/qa.html` prints the drift, and it is
4 of 120 at the time of writing, all in height, two of them the product
clipping its own content.

---

## Known product defects, recorded and not fixed

A design system that quietly patches the product it documents stops being a
mirror of it. Defects found while building the catalogue are written down with
the file and the number, and left alone:

`reference/final/QA.md` → *Known product defects*

At the time of writing: the page-head row is 4px too short for its own 36px
actions; My Work Queue clips its inline edit buttons by 5px in two columns;
Accounting clips its primary row action by 4.4px; Single Ticket ships one
10.5px label under the system's own 11px floor; the theme toggle ships `hidden`
on all ten pages.
