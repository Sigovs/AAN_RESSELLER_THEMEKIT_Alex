# AAN Reseller redesign — All Vehicles

Open `index.html` to pick a version: Original AAN (static), Gen 2 — Command Center, Gen 3 — Ref2 / 2027, Gen 4 — Object rows / zoned surfaces, Gen 5 — Spatial / 2027 Workspace, Gen 6 A/B/C, Gen 7 — Rail · Lot · Field · Dock, **Gen 8 — top navigation + Dock accordions (leading)**, **Gen 9 — exotic/supercar workspace with a three-mode context plane (in review)**.
Gen 8 review states open by URL hash: `all-vehicles-gen8.html#vehicle=20171`, `#filters`, `#dark`, `#open=comps,hist`, `#f=price:none`.
Gen 9 takes the same hashes plus `#lot`, `#light` and `#attn=no_price` (`#comps` is accepted as an alias of `#market`). Hashes are read on load — change one and refresh.
Each generation is isolated: `pages/dealer/all-vehicles.{html,css,js}` (Gen 2) and `pages/dealer/all-vehicles-gen3.{html,css,js,data.js}` (Gen 3).
Edit → refresh. No network, no build. Fonts in `ds/fonts/`; 16 small demo thumbs in `pages/dealer/img/`. Visual reference for Gen 3: `reference/ref2.png`.
`_archive/gen1/` is the rejected first pass.
