# 04 — The decisions that matter (All Vehicles, gen 1)

1. **One chrome band instead of two.** Brand, product nav groups, context links, theme and account
   share a 52 px graphite bar in both themes. It is the only authored surface; the workspace stays
   neutral. Saves 30 px and puts navigation next to identity.
2. **Six control strips became three.** Lane tabs · pulse strip · one find row (+ chips only when
   active). The legacy filterbar and the "More" panel are one grouped panel (Identity / Merchandising /
   Attributes). First row of data at ~365 px instead of ~515 px, without dropping a single filter.
3. **Status scope is a tab strip, not pills.** Lanes are mutually exclusive; tabs say that. The view
   switch and Insights sit on the same rule because they are all "how am I looking at this scope".
4. **Lot health is an instrument, not eight boxes.** Dot · number · label toggles separated by
   hairlines, pressed state in the tone colour, asking value as a trailing stat that is visibly not a
   button.
5. **Vehicle identity is one cell.** `2005 Porsche Carrera GT` bold, trim/description beneath in
   muted ink. The four truncated columns (Year | Make | Model | Trim…) were the least readable part of
   the old row; this is the most readable part of the new one. Sorting by each key survives.
6. **Colour marks exceptions only.** Age: green ≤30 d, red >1 y, everything between is ink. Status
   inside a lane is a dot and a word, not 100 green badges. Price is black; "No price" is the only
   amber text. Result: the unmerchandised cluster (no photo + no price + hidden + feed-excluded +
   stale) is visible from across the room.
7. **Health flags are a matrix.** Fixed slots, the same defect always in the same column, real icons
   (one stroke family) with tooltips instead of emoji. Scan a column, not a row.
8. **Delete is one step further away.** Edit / Photos / Sticker stay as visible quiet icons; Delete
   lives in the row menu under a separator and still confirms. No destructive control sits next to
   Print any more.
9. **Sort state is always visible** — arrow on the header and the Sort facet label ("Stock ↑") —
   so the gallery and photos views also know how they are ordered.
10. **Full-width workspace.** 24 px gutters up to 1600 px instead of a 1152 px column; the table gets
    the room the 14 px floor needs.
11. **Archivo + Plex Mono.** A grotesque with a real width axis (used at 96 % in data cells) and
    tabular figures, paired with the mono AAN already owns for identifiers. Reads technical and
    automotive without cosplay.
12. **Dark is re-solved, not inverted.** Surfaces step up, status hues are lifted, soft fills become
    alpha tints. Same `aan-theme` key as production so the toggle is real on day one.

## What I rejected on the way
- Filled status badges in every row (noise). Bordered pulse "cards" (they read as more controls).
  Amber for the 91–365 d band (54 % of rows lit up). Emoji for flags. A left rail. Bulk checkboxes
  (no bulk actions exist; Inline Edit is the bulk tool). Infinite scroll. A gallery-first default.
