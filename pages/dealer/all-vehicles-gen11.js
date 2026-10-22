/* Gen 11 — bento intelligence on top, vehicle opens INLINE under its row (accordion sheet), Dock = Filters only.
   Platform menus, Light/Dark, facet counts
   (Filters with facet counts; vehicle inspector with Market & pricing, Recent comps, History).
   Prototype JS. Every facet count, market figure, comparable listing and history entry is DEMO data. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (id) { return '<svg class="i"><use href="#' + id + '"/></svg>'; };
  var nf = function (n) { return Number(n).toLocaleString('en-US'); };
  var V = window.G8 || [];
  V.forEach(function (v, i) { v.id = 'v' + i; });

  var TONE = { 'Feed off': 'danger', 'Hidden': 'slate', 'Pending': 'violet' };
  var ATTN = { no_price: 'No price', no_photos: 'No photos', feed_off: 'Feed off', hidden: 'Hidden', aging: 'Aging > 1 yr', pending: 'Pending' };
  var AGE = { fresh: '≤ 30 days', mid: '31–90 days', late: '91–365 days', stale: 'Over 1 year' };
  var COL = { fresh: 'var(--age-fresh)', mid: 'var(--age-mid)', late: 'var(--age-late)', stale: 'var(--age-stale)' };

  /* ── demo facet counts for the Available lane (359) ─────────────────── */
  var MAKES = [['Porsche', 54, 186400], ['Ford', 47, 63900], ['Ferrari', 42, 412000], ['Lamborghini', 27, 338500], ['McLaren', 20, 241000], ['Mercedes-Benz', 20, 118700], ['Chevrolet', 16, 96800], ['Dodge', 12, 88200], ['Land Rover', 12, 104300], ['Audi', 11, 71500], ['BMW', 9, 69900], ['Bentley', 5, 152000], ['Kenworth', 4, 96400], ['Peterbilt', 4, 51300], ['Aston Martin', 3, 187000], ['Rolls-Royce', 3, 356000], ['Jensen', 2, 94000], ['Toyota', 2, 108000], ['Chaparral', 1, 42800], ['Honda', 1, 18900], ['Kia', 1, null], ['Terex', 1, null], ['SUNDOWNER', 1, null]];
  var G = {
    model: [['911', 'Porsche 911', 31], ['mustang', 'Ford Mustang', 26], ['huracan', 'Lamborghini Huracán', 14], ['gclass', 'Mercedes-Benz G-Class', 11], ['812', 'Ferrari 812', 9], ['cgt', 'Porsche Carrera GT', 6]],
    year: [['2020s', '2020 – 2027', 96], ['2010s', '2010 – 2019', 118], ['2000s', '2000 – 2009', 61], ['1990s', '1990 – 1999', 43], ['1980s', '1980 – 1989', 17], ['1970s', '1970 – 1979', 11], ['pre70', 'Before 1970', 13]],
    price: [['none', 'No price', 133], ['lt25', 'Under $25K', 14], ['25-50', '$25K – 50K', 28], ['50-100', '$50K – 100K', 38], ['100-250', '$100K – 250K', 88], ['250+', '$250K and up', 58]],
    mile: [['lt1k', 'Under 1,000 mi', 58], ['1-10k', '1,000 – 10,000 mi', 97], ['10-50k', '10,000 – 50,000 mi', 104], ['50-100k', '50,000 – 100,000 mi', 49], ['100k+', 'Over 100,000 mi', 22], ['nr', 'Not recorded', 29]],
    loc: [['cmc', 'Chicago Motor Cars', 214], ['nap', 'CMC · Naperville', 52], ['kc', 'CMC · KC', 38], ['sc', 'CMC · SC', 27], ['diesel', 'CMS Diesel', 19], ['boats', 'Boats', 9]],
    type: [['used', 'Used', 331], ['new', 'New', 28]],
    merch: [['shown', 'Shown on site', 298], ['hidden', 'Hidden on site', 61], ['feeding', 'Feeding to partners', 292], ['feedoff', 'Excluded from feeds', 67], ['pending', 'Sale pending', 49]],
    opt: [['awd', 'All-wheel drive', 88], ['manual', 'Manual transmission', 64], ['open', 'Convertible / open top', 52], ['ccb', 'Carbon-ceramic brakes', 23], ['diesel', 'Diesel engine', 21]]
  };
  var COLORS = [['Black', '#1c1d21', 71], ['White', '#eeeeec', 64], ['Silver', '#b7bbc1', 46], ['Red', '#b3261e', 41], ['Grey', '#6b6f76', 38], ['Blue', '#2a5db8', 33], ['Green', '#2f6b47', 22], ['Yellow', '#e3b21b', 14], ['Orange', '#e8721c', 11], ['Other', 'conic-gradient(#e35548, #f2a12b, #2fb46f, #1f5fe0, #8f78ea, #e35548)', 19]];
  var GL = { make: 'Make', model: 'Model', year: 'Year', price: 'Price', mile: 'Mileage', loc: 'Location', type: 'Type', merch: 'Merchandising', color: 'Color', opt: 'Options' };
  var BASE = { Kia: 14500, Terex: 38500, SUNDOWNER: 52000, Porsche: 180000, Dodge: 92000, Ford: 58000 };
  var STATES = ['IL', 'WI', 'IN', 'MI', 'OH', 'MO', 'MN', 'IA', 'KY'];
  /* where "open in the vehicle editor" goes (Matthew: the stock number promised
     it and did nothing). The mock has one editor page, so every car opens it. */
  var EDITOR = 'single-vehicle-gen11.html';
  var NO_MILES = { Chaparral: 1, SUNDOWNER: 1, Terex: 1 };
  /* Mileage (review note 15: "both mileage and photo count need to be here").
     The original carries Mileage as a column. Our sample lot has no mileage,
     so these are sample figures like the rest of the demo data (Alex chose not
     to badge them) — except the Carrera GT's 953, which is its own listing
     ("Only 953 Miles"). A trailer,
     a jet boat and a compact track loader have no odometer: null shows "—". */
  var MILES = { '001253 PS': 953, '0P0300236 PS': 1840, '1284NEBR MS': 2310, '18421': null, '18837C': 64820, '19495': 412600,
    '19953': 8450, '1X289324 JJ': 12980, '20171': 286300, '20536': null, '20834E': 6120, '21577C': 71400, '21790': 58900,
    '21814': 131700, '21834': null, '21848': 92300 };
  V.forEach(function (v) { v.mi = MILES.hasOwnProperty(v.s) ? MILES[v.s] : null; });

  var S = {
    sort: 'days', dir: 'asc', per: 100, page: 1, attn: {}, age: null, lane: 'Available', dock: null, cur: null, fq: '', allMakes: false, q: '',
    f: { make: {}, model: {}, year: {}, price: {}, mile: {}, loc: {}, type: {}, merch: {}, color: {}, opt: {} },
    /* Open state for both disclosure families: the vehicle sheet's four stacked
       regions, then the Filters dock's facet groups. */
    acc: { health: true, market: false, spec: false, hist: false, 'f-make': true, 'f-price': true, 'f-year': false, 'f-model': false, 'f-mile': false, 'f-loc': false, 'f-type': false, 'f-merch': false, 'f-color': false, 'f-opt': false, 'f-audit': false },
    cols: null
  };

  /* ══ COLUMNS ═══════════════════════════════════════════════════════════
     One configuration drives four things: the cells the header renders, the
     cells each row renders, the grid template both sit on, and the Columns
     control. Nothing about a column is stated twice.

     `track` holds the approved Gen 11 widths per tier — the same numbers the
     stylesheet used to carry, moved here so the template can be built from
     the visible set instead of padding hidden columns out to 0px:
       lg      > 1400, Filters closed        sm      ≤ 1400, Filters closed
       dock    > 1400, Filters open           dockSm  ≤ 1400, Filters open
     (1400 is where the stylesheet actually switches — an inner comment says
     1320, but a later `@media (max-width: 1400px)` block is the one that
     wins, and the row gap steps from 8px to 6px on the same line.)
     `grow` marks the columns that absorb width freed by a hidden column, in
     the order the brief asks for: Model first, then Stock / Trim / Colour.
     Health deliberately has no weight — its minimum track is already wider
     than any fr share it could win, so a weight there would never resolve to
     a single extra pixel. Its `sm` track is 194 rather than 168 because the
     widest chip row needs 204px of cell once the chips are tightened; the
     26px comes out of Model, which is the flexible track, so the row still
     sums to the same width. Model's `sm` floor drops to 88 for the same
     reason — at 1280 it is pinned to that floor either way.
     `dockOff` preserves the approved behaviour where opening Filters drops
     the three widest optional columns — existing layout, not a new rule. */
  var COLS = [
    /* review 2026-10: the row checkboxes and their bulk tray are gone (neither is
       in the original); Status takes the leading column instead. It still steps
       aside when Filters is open, as it always has. */
    { id: 'status',  label: 'Status',    grp: 'Listing & feeds', locked: true, sort: 'status', cls: 'c-status', dockOff: true, track: { lg: 96, sm: 88 } },
    { id: 'thumb',   label: 'Thumbnail', grp: 'Listing & feeds', track: { lg: 92, sm: 76, dock: 68, dockSm: 60 } },
    { id: 'stock',   label: 'Stock',     grp: 'Vehicle', locked: true, sort: 'stock', track: { lg: 104, sm: 92, dock: 100, dockSm: 88 }, grow: 1 },
    { id: 'year',    label: 'Year',      grp: 'Vehicle', sort: 'year', track: { lg: 46, sm: 42, dock: 40, dockSm: 40 } },
    { id: 'make',    label: 'Make',      grp: 'Vehicle', locked: true, sort: 'make', track: { lg: 104, sm: 92, dock: 86, dockSm: 84 } },
    { id: 'model',   label: 'Model',     grp: 'Vehicle', locked: true, sort: 'model', track: { lg: 100, sm: 88, dock: 80, dockSm: 80 }, grow: 6 },
    { id: 'trim',    label: 'Trim',      grp: 'Vehicle', sort: 'trim', cls: 'c-trim', dockOff: true, track: { lg: 84, sm: 88 }, grow: 1 },
    { id: 'colour',  label: 'Color',     grp: 'Vehicle', sort: 'colour', cls: 'c-ext', dockOff: true, track: { lg: 92, sm: 84 }, grow: 1 },
    { id: 'miles',   label: 'Mileage',   grp: 'Vehicle', sort: 'miles', cls: 'c-miles', dockOff: true, track: { lg: 96, sm: 80 } },
    { id: 'price',   label: 'Price',     grp: 'Pricing', locked: true, sort: 'price', cls: 'c-price', track: { lg: 118, sm: 84, dock: 80, dockSm: 76 } },
    { id: 'health',  label: 'Listing',    grp: 'Listing & feeds', sort: 'issues', cls: 'c-health', track: { lg: 246, sm: 124, dock: 120, dockSm: 116 } },
    { id: 'age',     label: 'Added',     grp: 'Dates', sort: 'days', track: { lg: 104, sm: 96, dock: 96, dockSm: 92 } },
    /* ── optional columns (Bill, AV note 36: "all possible columns") ──────
       Off by default; the dealer adds them in Columns, as far as the table has
       room (no sideways scroll — the panel says when it is full). Columns the
       sample lot has no data for say so in the panel and show "—": nothing is
       invented. Hidden while Filters is open. */
    { id: 'vin',    label: 'VIN',                    grp: 'Vehicle', off: true, dockOff: true, track: { lg: 160, sm: 150 }, cell: function (v) { return '<div class="mono-c" title="' + esc(v.vin) + '">' + esc(v.vin) + '</div>'; } },
    { id: 'vtype',  label: 'Type',                   grp: 'Vehicle', off: true, dockOff: true, nodata: true, track: { lg: 72, sm: 68 } },
    { id: 'body',   label: 'Body',                   grp: 'Vehicle', off: true, dockOff: true, nodata: true, track: { lg: 96, sm: 88 } },
    { id: 'engine', label: 'Engine',                 grp: 'Vehicle', off: true, dockOff: true, nodata: true, track: { lg: 120, sm: 110 } },
    { id: 'trans',  label: 'Transmission',           grp: 'Vehicle', off: true, dockOff: true, nodata: true, track: { lg: 120, sm: 110 } },
    { id: 'intc',   label: 'Interior Color',         grp: 'Vehicle', off: true, dockOff: true, nodata: true, track: { lg: 112, sm: 104 } },
    { id: 'mpgc',   label: 'MPG City',               grp: 'Vehicle', off: true, dockOff: true, nodata: true, track: { lg: 80, sm: 76 } },
    { id: 'mpgh',   label: 'MPG Hwy',                grp: 'Vehicle', off: true, dockOff: true, nodata: true, track: { lg: 80, sm: 76 } },
    { id: 'cert',   label: 'Certified',              grp: 'Vehicle', off: true, dockOff: true, nodata: true, track: { lg: 84, sm: 80 } },
    { id: 'loc',    label: 'Location',               grp: 'Vehicle', off: true, dockOff: true, nodata: true, track: { lg: 120, sm: 110 } },
    { id: 'disc',   label: 'Discount Price',         grp: 'Pricing', off: true, dockOff: true, track: { lg: 112, sm: 104 }, cell: function (v) { return money(v.disc); } },
    { id: 'inv',    label: 'Invoice Price',          grp: 'Pricing', off: true, dockOff: true, track: { lg: 108, sm: 100 }, cell: function (v) { return money(v.inv); } },
    { id: 'lease',  label: 'Lease Price',            grp: 'Pricing', off: true, dockOff: true, track: { lg: 100, sm: 96 }, cell: function (v) { return money(v.lease); } },
    { id: 'lterm',  label: 'Lease Term',             grp: 'Pricing', off: true, dockOff: true, track: { lg: 92, sm: 88 }, cell: function (v) { return v.lt ? '<div>' + v.lt + ' mo</div>' : NOD; } },
    { id: 'nph',    label: '# Photos',               grp: 'Listing & feeds', off: true, dockOff: true, track: { lg: 80, sm: 76 }, cell: function (v) { return '<div class="num-c">' + nf(v.ph || 0) + '</div>'; } },
    { id: 'hide',   label: 'Do Not Display On Site', grp: 'Listing & feeds', off: true, dockOff: true, track: { lg: 120, sm: 112 }, cell: function (v) { return v.f.indexOf('Hidden') >= 0 ? '<div class="yn yn--bad">Hidden</div>' : '<div class="yn">No</div>'; } },
    { id: 'feed',   label: 'Outgoing Feed Status',   grp: 'Listing & feeds', off: true, dockOff: true, track: { lg: 120, sm: 112 }, cell: function (v) { return v.f.indexOf('Feed off') >= 0 ? '<div class="yn">Off</div>' : '<div class="yn yn--ok">On</div>'; } },
    { id: 'pend',   label: 'Sale Pending',           grp: 'Listing & feeds', off: true, dockOff: true, track: { lg: 96, sm: 92 }, cell: function (v) { return v.f.indexOf('Pending') >= 0 ? '<div class="yn yn--warn">Pending</div>' : NOD; } },
    { id: 'specials', label: 'Specials',             grp: 'Listing & feeds', off: true, dockOff: true, nodata: true, track: { lg: 84, sm: 80 } },
    { id: 'video',  label: 'Video',                  grp: 'Listing & feeds', off: true, dockOff: true, nodata: true, track: { lg: 72, sm: 68 } },
    { id: 'carfax', label: 'Carfax',                 grp: 'Listing & feeds', off: true, dockOff: true, nodata: true, track: { lg: 76, sm: 72 } },
    { id: 'days',   label: 'Days In Stock',          grp: 'Dates', off: true, dockOff: true, sort: 'days', track: { lg: 100, sm: 96 }, cell: function (v) { return '<div class="num-c">' + nf(v.d) + '</div>'; } },
    { id: 'mod',    label: 'When Modified',          grp: 'Dates', off: true, dockOff: true, nodata: true, track: { lg: 108, sm: 104 } },
    { id: 'mm',     label: 'Make-Model',             grp: 'Combined', off: true, dockOff: true, track: { lg: 170, sm: 150 }, cell: function (v) { return clip(v.mk + ' ' + v.md); } },
    { id: 'mmt',    label: 'Make-Model-Trim',        grp: 'Combined', off: true, dockOff: true, track: { lg: 210, sm: 180 }, cell: function (v) { return clip(v.mk + ' ' + v.md + (v.tr ? ' ' + v.tr : '')); } },
    { id: 'ymmt',   label: 'Year-Make-Model-Trim',   grp: 'Combined', off: true, dockOff: true, track: { lg: 230, sm: 200 }, cell: function (v) { return clip(v.y + ' ' + v.mk + ' ' + v.md + (v.tr ? ' ' + v.tr : '')); } },
    { id: 'cf_cfx_date',       label: 'Carfax Report Date',            grp: 'Custom fields', off: true, dockOff: true, nodata: true, track: { lg: 120, sm: 112 } },
    { id: 'cf_pending_name',   label: 'Pending Sale Name',             grp: 'Custom fields', off: true, dockOff: true, nodata: true, track: { lg: 120, sm: 112 } },
    { id: 'cf_tt_category',    label: 'Truck / Trailer Category',      grp: 'Custom fields', off: true, dockOff: true, nodata: true, track: { lg: 130, sm: 120 } },
    { id: 'cf_ove',            label: 'OVE Feed Data',                 grp: 'Custom fields', off: true, dockOff: true, nodata: true, track: { lg: 112, sm: 104 } },
    { id: 'cf_no_carfax',      label: 'Do Not Report VIN To Carfax',   grp: 'Custom fields', off: true, dockOff: true, nodata: true, track: { lg: 130, sm: 120 } },
    { id: 'cf_no_vin',         label: 'Do Not Display VIN On Website', grp: 'Custom fields', off: true, dockOff: true, nodata: true, track: { lg: 130, sm: 120 } },
    { id: 'actions', label: 'Actions',   locked: true, track: { lg: 108, sm: 112, dock: 104, dockSm: 92 } }
  ];
  var COLKEY = 'aan.gen11.allVehicles.columns';

  function colDefaults() { var o = {}; COLS.forEach(function (c) { o[c.id] = !c.off; }); return o; }
  var NOD = '<div class="nd" title="Not in the sample data">—</div>';
  function money(n) { return n ? '<div class="num-c">$' + nf(n) + '</div>' : NOD; }
  function clip(t) { return '<div class="clip-c" title="' + esc(t) + '">' + esc(t) + '</div>'; }

  /* Anything in storage is treated as a suggestion: unknown ids are ignored,
     non-boolean values are ignored, locked columns are forced back on, and a
     malformed blob falls through to the approved default. */
  function loadCols() {
    var d = colDefaults();
    try {
      var raw = window.localStorage.getItem(COLKEY);
      if (!raw) return d;
      var saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return d;
      COLS.forEach(function (c) {
        if (c.locked || c.system) return;
        if (typeof saved[c.id] === 'boolean') d[c.id] = saved[c.id];
      });
    } catch (e) { return colDefaults(); }
    return d;
  }
  function saveCols() {
    try {
      var o = {};
      COLS.forEach(function (c) { if (!c.locked && !c.system) o[c.id] = S.cols[c.id] !== false; });
      window.localStorage.setItem(COLKEY, JSON.stringify(o));
    } catch (e) { /* private mode: the session still works, it just will not remember */ }
  }

  /* Column order (the original's Columns picker moves a column left or right
     with ◀ ▶). Every column can move except Actions, which stays at the end.
     Stored as a list of ids; unknown ids are dropped and missing ones are
     appended in their default place, so a stale blob can never lose a column. */
  var ORDKEY = 'aan.gen11.allVehicles.order';
  function orderDefault() { return COLS.filter(function (c) { return c.id !== 'actions'; }).map(function (c) { return c.id; }); }
  function loadOrder() {
    var d = orderDefault();
    try {
      var saved = JSON.parse(window.localStorage.getItem(ORDKEY) || 'null');
      if (!Array.isArray(saved)) return d;
      var o = saved.filter(function (id, i) { return d.indexOf(id) >= 0 && saved.indexOf(id) === i; });
      d.forEach(function (id) { if (o.indexOf(id) < 0) o.push(id); });
      return o;
    } catch (e) { return d; }
  }
  function saveOrder() { try { window.localStorage.setItem(ORDKEY, JSON.stringify(S.order)); } catch (e) { /* private mode */ } }
  function colById(id) { return COLS.filter(function (c) { return c.id === id; })[0]; }
  function orderedCols() { return S.order.map(colById).concat([colById('actions')]); }
  function moveCol(id, step) {
    var i = S.order.indexOf(id), j = i + step;
    while (j >= 0 && j < S.order.length && !colOn(colById(S.order[j]))) j += step;
    if (i < 0 || j < 0 || j >= S.order.length) return false;
    S.order[i] = S.order[j]; S.order[j] = id; saveOrder(); return true;
  }
  /* Room (Alex): a column can be added only while the table still fits its
     width — no sideways scroll. Measured from the minimum track widths of what
     is shown against the table's own width. */
  function trackPx(c) {
    var t = colTier();
    if (c.id === 'health' && t === 'lg' && CHIPMQ.matches) return c.track.sm;   /* as colTemplate() */
    return c.track[t] != null ? c.track[t] : (c.track.sm || c.track.lg);
  }
  function tableRoom() {
    var tb = $('#tb') || $('.field'); if (!tb) return 9999;
    var vis = visibleCols(), used = vis.reduce(function (a, c) { return a + trackPx(c); }, 0) + 8 * (vis.length - 1) + 32;
    return tb.clientWidth - used;
  }
  function fits(c) { return trackPx(c) + 8 <= tableRoom(); }
  function updateRoom() {
    var p = $('#p-cols'); if (!p) return;
    var full = true;
    $$('input[data-col]', p).forEach(function (ck) {
      if (ck.checked) return;
      var c = colById(ck.dataset.col), ok = fits(c);
      if (ok) full = false;
      ck.disabled = !ok || (dockOpen() && c.dockOff);
      ck.closest('.cols__it').classList.toggle('cols__it--full', !ok);
      ck.closest('.cols__it').title = ok ? '' : 'Table is full — turn a column off first';
    });
    var n = $('.cols__room', p);
    if (n) n.hidden = !full;
  }

  function dockOpen() { return S.dock === 'filters'; }
  /* The tier is watched, not sampled. A first render can happen before the
     viewport has settled on its final width, and the template would then keep
     the tier it was born with; the media query tells us when to rebuild. */
  var COLMQ = window.matchMedia('(max-width: 1400px)');
  /* Health shows one chip + "+N" up to 1600 now that Mileage shares the row
     (review note 15); two chips only where the row has room for them. */
  var CHIPMQ = window.matchMedia('(max-width: 1600px)');
  function oneChip() { return dockOpen() || CHIPMQ.matches; }
  function colTier() {
    var narrow = COLMQ.matches;
    return dockOpen() ? (narrow ? 'dockSm' : 'dock') : (narrow ? 'sm' : 'lg');
  }
  function colOn(c) { return c.locked || c.system || S.cols[c.id] !== false; }
  function visibleCols() {
    var dk = dockOpen();
    return fitCols(orderedCols().filter(function (c) { return (!dk || !c.dockOff) && colOn(c); }));
  }
  /* The safety net under the room limit: columns saved on a wide screen may
     not fit a narrower one. Added (non-default) columns then step out from
     the right until the row fits — never a default one, never sideways
     scroll. The choice is kept; the panel marks them "No room". */
  function fitCols(list) {
    var tb = $('#tb'); if (!tb || !tb.clientWidth) return list;
    var avail = tb.clientWidth - 32, px = function (c) { return trackPx(c) + 8; };
    var tot = list.reduce(function (a, c) { return a + px(c); }, -8);
    for (var i = list.length - 1; i >= 0 && tot > avail; i--) {
      if (list[i].off) { tot -= px(list[i]); list.splice(i, 1); }
    }
    return list;
  }
  function hiddenCount() {
    return COLS.filter(function (c) { return !c.locked && !c.system && !c.off && S.cols[c.id] === false; }).length;
  }
  /* The template is the visible columns and nothing else — no zero-width
     tracks. With every column on, Model alone takes the slack, which is the
     approved layout exactly. Once something is hidden, Stock / Trim / Colour
     share the freed width with it, weighted so Model still leads. */
  function colTemplate() {
    var tier = colTier(), freed = hiddenCount() > 0;
    return visibleCols().map(function (c) {
      var px = (c.id === 'health' && tier === 'lg' && CHIPMQ.matches ? c.track.sm : (c.track[tier] != null ? c.track[tier] : c.track.lg)) + 'px';
      if (!c.grow) return px;
      if (c.id === 'model') return 'minmax(' + px + ', ' + (freed ? c.grow : 1) + 'fr)';
      return freed ? 'minmax(' + px + ', ' + c.grow + 'fr)' : px;
    }).join(' ');
  }

  function headerHTML() {
    return visibleCols().map(function (c) {
      var cls = [];
      if (c.align === 'r') cls.push('r');
      if (c.sort) { cls.push('s'); if (c.sort === S.sort) cls.push('on'); }
      if (c.cls) cls.push(c.cls);
      var label = (c.system || c.id === 'thumb') ? '' : esc(c.label) + (c.demo ? '<i class="hd-demo" title="Demo figures — no mileage in the sample data">demo</i>' : '');
      var arrow = (c.sort && c.sort === S.sort) ? ' ' + ic(S.dir === 'asc' ? 'i-up' : 'i-dn') : '';
      return '<span' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') +
        (c.sort ? ' data-sort="' + c.sort + '"' : '') + '>' + label + arrow + '</span>';
    }).join('');
  }

  function applyCols() {
    var f = $('.field');
    if (f) f.style.setProperty('--cols', colTemplate());
    var hd = $('#hd');
    if (hd) hd.innerHTML = headerHTML();
    var btn = $('#cols-btn');
    if (btn) btn.classList.toggle('facet__b--on', hiddenCount() > 0);
    /* the open panel is not rebuilt here — that would destroy the checkbox
       under the pointer and drop focus; only its counter moves */
    var n = $('#p-cols .cols__n');
    if (n) n.textContent = visibleCols().filter(function (c) { return !c.system; }).length + ' of ' + COLS.length + ' shown';
  }

  if (COLMQ.addEventListener) COLMQ.addEventListener('change', function () { applyCols(); if (typeof render === 'function') render(); });
  if (CHIPMQ.addEventListener) CHIPMQ.addEventListener('change', function () { applyCols(); if (typeof render === 'function') render(); });
  else if (COLMQ.addListener) COLMQ.addListener(function () { applyCols(); });
  window.addEventListener('load', function () { applyCols(); });

  /* The panel is placed against the viewport, not just hung off the button.
     The Columns button sits low in a sticky toolbar, so on a short screen the
     panel ran past the bottom edge and Reset became unreachable.

     Two things in the page make the naive fix fail, and both are why the panel
     is moved to <body> while it is open:
       · the sheet sets `overflow: clip`, so a panel opening upward is cut at
         the sheet's top edge;
       · the command band carries a backdrop-filter, which makes it the
         containing block for `position: fixed` descendants — "fixed" inside it
         is fixed to the band, not to the viewport.
     Out in <body> neither applies, so the coordinates mean what they say. Only
     the optional list scrolls, so the heading and Reset are always reachable. */
  var colsHome = null;
  function placeColsPop() {
    var p = $('#p-cols'), b = $('#cols-btn');
    if (!p || !b || !p.classList.contains('pop--open')) return;
    var GAP = 8, EDGE = 8;
    var topBar = $('.top');
    var TOPLIMIT = (topBar ? topBar.getBoundingClientRect().bottom : 68) + 8;
    var list = p.querySelector('.cols__body');

    if (list) { list.style.maxHeight = ''; list.style.overflowY = ''; }
    p.style.maxHeight = '';
    var btn = b.getBoundingClientRect();
    var w = Math.round(p.getBoundingClientRect().width);
    var natural = p.scrollHeight;

    var below = window.innerHeight - btn.bottom - GAP - EDGE;
    var above = btn.top - GAP - TOPLIMIT;
    var up = natural > below && above > below;
    var room = Math.max(120, up ? above : below);

    p.classList.toggle('pop--up', up);
    var h = Math.min(natural, room);
    p.style.left = Math.round(Math.max(EDGE, btn.right - w)) + 'px';
    p.style.top = Math.round(up ? Math.max(TOPLIMIT, btn.top - GAP - h) : btn.bottom + GAP) + 'px';

    if (natural > room) {
      p.style.maxHeight = room + 'px';
      if (list) {
        var fixed = natural - list.scrollHeight;
        list.style.maxHeight = Math.max(72, room - fixed) + 'px';
        list.style.overflowY = 'auto';
      }
    }
  }
  window.addEventListener('resize', placeColsPop);
  window.addEventListener('scroll', placeColsPop, { passive: true });

  function keepPaneScroll(p) {
    var t = {};
    $$('.cols__list', p).forEach(function (l) { t[l.dataset.pane] = l.scrollTop; });
    return function () { $$('.cols__list', p).forEach(function (l) { if (t[l.dataset.pane]) l.scrollTop = t[l.dataset.pane]; }); };
  }
  function filterColsPanel(q) {
    q = String(q || '').toLowerCase().trim();
    var p = $('#p-cols'); if (!p) return;
    var add = p.querySelector('[aria-label="Columns you can add"]'); if (!add) return;
    $$('.cols__it', add).forEach(function (it) { it.hidden = !!q && it.dataset.colname.indexOf(q) < 0; });
    $$('.cols__grp', add).forEach(function (g) {
      var n = g.nextElementSibling, any = false;
      while (n && !n.classList.contains('cols__grp')) { if (!n.hidden) any = true; n = n.nextElementSibling; }
      g.hidden = !any;
    });
  }
  var COL_GROUPS = ['Vehicle', 'Pricing', 'Listing & feeds', 'Dates', 'Combined', 'Custom fields'];
  function colsPopHTML() {
    var dk = dockOpen();
    var shownList = S.order.map(colById).filter(colOn);
    var shown = visibleCols().filter(function (c) { return !c.system; }).length;
    var nameOf = function (c) { return c.id === 'thumb' ? 'Photo' : c.label; };
    var item = function (c, i, n) {
      var sus = dk && c.dockOff, name = nameOf(c);
      var sw = c.locked
        ? '<span class="cols__lk" title="Always shown">' + ic('i-lock') + '</span>'
        : '<input class="ck" type="checkbox" data-col="' + c.id + '"' + (colOn(c) ? ' checked' : '') + (sus ? ' disabled' : '') + ' aria-label="Show ' + esc(name) + '">';
      return '<div class="pop__it cols__it' + (sus ? ' cols__it--sus' : '') + (c.locked ? ' cols__it--lock' : '') + '" data-colname="' + esc(name.toLowerCase()) + '">' +
        '<label class="cols__l">' + sw + '<span>' + esc(name) + '</span></label>' +
        (sus ? '<span class="cols__note" title="Not shown while the Filters panel is open">Filters</span>' : '') +
        (!sus && i != null && c.off && visibleCols().indexOf(c) < 0 ? '<span class="cols__note cols__note--room" title="No room at this screen width — turn another column off to bring it back">No room</span>' : '') +
        (c.nodata ? '<span class="cols__nd" title="The sample lot has no data for this column — it shows “—”">no sample data</span>' : '') +
        (i != null ? '<span class="cols__mv">' +
          '<button type="button" data-mv="' + c.id + '|-1" aria-label="Move ' + esc(name) + ' left"' + (i === 0 ? ' disabled' : '') + '>◀</button>' +
          '<button type="button" data-mv="' + c.id + '|1" aria-label="Move ' + esc(name) + ' right"' + (i === n - 1 ? ' disabled' : '') + '>▶</button>' +
        '</span>' : '') + '</div>';
    };
    var adds = COL_GROUPS.map(function (g) {
      var cs = S.order.map(colById).filter(function (c) { return c.grp === g && !colOn(c); });
      return cs.length ? '<div class="cols__grp">' + esc(g) + '</div>' + cs.map(function (c) { return item(c); }).join('') : '';
    }).join('');
    return '<div class="cols__h"><h2 class="dock__t">Columns</h2>' +
        '<span class="dock__c cols__n">' + shown + ' of ' + COLS.length + ' shown</span>' +
        '<button class="dock__x" type="button" data-act="cols-close" aria-label="Close Columns">' + ic('i-x') + '</button></div>' +
      '<div class="cols__body">' +
        '<div class="cols__pane">' +
          '<div class="cols__sub" id="cols-opt-lab"><b>Shown</b><span>left to right</span></div>' +
          '<div class="cols__list" data-pane="shown" role="group" aria-labelledby="cols-opt-lab">' + shownList.map(function (c, i) { return item(c, i, shownList.length); }).join('') + '</div>' +
        '</div>' +
        '<div class="cols__pane cols__pane--add">' +
          '<div class="cols__sub"><b>Add a column</b></div>' +
          '<div class="cols__qw"><input class="fld cols__q" type="search" placeholder="Find a column…" aria-label="Find a column" data-colq></div>' +
          '<p class="cols__room" hidden>' + ic('i-alert') + 'Table is full — turn a column off to add another.</p>' +
          '<div class="cols__list" data-pane="add" role="group" aria-label="Columns you can add">' + adds + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="cols__f"><p class="cols__lock">' + ic('i-lock') + '<span>Locked columns are always shown; Actions stays last.</span></p>' +
      '<button class="btn btn--quiet cols__reset" type="button" data-act="cols-reset">Reset to default</button></div>';
  }

  S.order = loadOrder();
  S.cols = loadCols();

  function band(d) { return d <= 30 ? 'fresh' : d <= 90 ? 'mid' : d <= 365 ? 'late' : 'stale'; }
  function lab(d) { return d > 365 ? (d / 365).toFixed(1) + 'y' : d + 'd'; }
  function fmt(n) { return n == null ? null : '$' + nf(n); }
  function k(n) { return n >= 1e6 ? '$' + (n / 1e6).toFixed(2) + 'M' : '$' + (n >= 1e5 ? Math.round(n / 1000) : (n / 1000).toFixed(1)) + 'K'; }
  function priceB(p) { return p == null ? 'none' : p < 25000 ? 'lt25' : p < 50000 ? '25-50' : p < 100000 ? '50-100' : p < 250000 ? '100-250' : '250+'; }
  function yearB(y) { return y >= 2020 ? '2020s' : y >= 2010 ? '2010s' : y >= 2000 ? '2000s' : y >= 1990 ? '1990s' : y >= 1980 ? '1980s' : y >= 1970 ? '1970s' : 'pre70'; }
  function sel(g) { return Object.keys(S.f[g]).filter(function (x) { return S.f[g][x]; }); }
  function nSel(groups) { return (groups || Object.keys(S.f)).reduce(function (n, g) { return n + sel(g).length; }, 0); }
  function attnOn() { return Object.keys(S.attn).some(function (x) { return S.attn[x]; }); }
  function filtered() { return nSel() > 0 || !!S.age || attnOn() || !!S.q.trim(); }
  function labelOf(g, key) {
    if (g === 'make') return key;
    if (g === 'color') return key;
    var hit = (G[g] || []).filter(function (x) { return x[0] === key; })[0];
    return hit ? hit[1] : key;
  }
  function byId(id) { return V.filter(function (x) { return x.id === id; })[0]; }

  /* the lane's own size, read from its button (Pending is 0, Sold 13,212 …);
     the sample cars stand in for every non-empty lane, an empty lane is empty
     (Matthew: "Pending has 0 vehicles … but displays all of the available ones") */
  function laneTotal() { var b = $('[data-lane="' + S.lane + '"] b'); var n = b ? parseInt(b.textContent.replace(/[^0-9]/g, ''), 10) : 359; return isNaN(n) ? 359 : n; }
  function list() {
    var mk = sel('make'), yb = sel('year'), pb = sel('price');
    if (laneTotal() === 0) return [];
    /* "Find a vehicle" (Karen, AV note 35): every word must match somewhere in
       stock, VIN, year, make, model, trim or color — "2019 porsche" narrows */
    var words = S.q.toLowerCase().split(/\s+/).filter(Boolean);
    return V.filter(function (v) {
      if (words.length) {
        var hay = [v.s, v.vin, v.y, v.mk, v.md, v.tr, v.c].join(' ').toLowerCase();
        for (var w = 0; w < words.length; w++) if (hay.indexOf(words[w]) < 0) return false;
      }
      for (var a in S.attn) if (S.attn[a]) {
        if (a === 'aging') { if (v.d <= 365) return false; }
        else if (v.f.indexOf(ATTN[a]) < 0) return false;
      }
      if (S.age && band(v.d) !== S.age) return false;
      if (mk.length && mk.indexOf(v.mk) < 0) return false;
      if (yb.length && yb.indexOf(yearB(v.y)) < 0) return false;
      if (pb.length && pb.indexOf(priceB(v.p)) < 0) return false;
      return true;
    }).sort(function (a, b) {
      var s = S.sort, d = S.dir === 'asc' ? 1 : -1, x, y;
      if (s === 'issues') { x = a.f.length; y = b.f.length; }
      else if (s === 'stock') { x = a.s; y = b.s; }
      else if (s === 'year') { x = a.y; y = b.y; }
      else if (s === 'make') { x = a.mk.toLowerCase(); y = b.mk.toLowerCase(); }
      else if (s === 'model') { x = a.md.toLowerCase(); y = b.md.toLowerCase(); }
      else if (s === 'trim') { x = (a.tr || '').toLowerCase(); y = (b.tr || '').toLowerCase(); }
      else if (s === 'colour') { x = (a.c || '').toLowerCase(); y = (b.c || '').toLowerCase(); }
      else if (s === 'miles') { x = a.mi == null ? -1 : a.mi; y = b.mi == null ? -1 : b.mi; }
      else if (s === 'status') { x = a.f.indexOf('Pending') >= 0 ? 1 : 0; y = b.f.indexOf('Pending') >= 0 ? 1 : 0; }
      else if (s === 'price') { x = a.p == null ? -1 : a.p; y = b.p == null ? -1 : b.p; }
      else { x = -a.d; y = -b.d; }   // when added: more days in stock = an earlier date
      return (x > y ? 1 : x < y ? -1 : 0) * d;
    });
  }

  /* ── rows ─────────────────────────────────────────────────────────── */
  /* Listing flags (review notes 16 + 19): conditions of the listing, often the
     dealer's own choice — stated, not judged. One neutral chip per flag with its
     own glyph; nothing flagged reads as nothing, not as a green "OK". */
  var FLAG_ICON = { 'No price': 'i-tag', 'No photos': 'i-cam-off', 'Feed off': 'i-rss', 'Hidden': 'i-eye-off', 'Pending': 'i-clock' };
  function tag(t) { return '<span class="tag tag--flag">' + (FLAG_ICON[t] ? ic(FLAG_ICON[t]) : '') + esc(t) + '</span>'; }
  /* price cell — only the export's own price fields:
       Price, then Discount Price and Lease Price · Lease Term as the qualifiers under it */
  function priceCell(v) {
    if (v.p == null) return '<div class="price price--none" aria-label="No price">—</div>';
    var h = '<div class="price"><div class="price__v"><em>$</em>' + nf(v.p) + '</div>';
    if (v.disc && v.disc < v.p) h += '<div class="price__sub price__sub--disc" title="Discount Price ' + fmt(v.disc) + ' · ' + fmt(v.p - v.disc) + ' off Price"><s>' + fmt(v.p) + '</s><b>' + fmt(v.disc) + '</b></div>';
    if (v.lease) h += '<div class="price__sub price__sub--lease" title="Lease Price ' + fmt(v.lease) + ' per month' + (v.lt ? ' · Lease Term ' + v.lt + ' months' : '') + '"><span>' + fmt(v.lease) + '<em>/mo</em></span><i>lease' + (v.lt ? ' ' + v.lt : '') + '</i></div>';
    return h + '</div>';
  }
  function kfmt(n) { if (n < 1000) return '$' + nf(n); var k = (n / 1000).toFixed(1); return '$' + k.replace(/\.0$/, '') + 'K'; }
  /* The row builds every cell, then emits the ones the model says are visible
     — in the model's order, so header and row can never drift apart. */
  function rowCells(v) {
    var b = band(v.d), max = oneChip() ? 1 : 2, tags = v.f.slice(0, max), rest = v.f.length - tags.length;
    var name = v.y + ' ' + v.mk + ' ' + v.md;
    return {
      thumb: (v.t ? '<span class="thw"><img class="th" alt="" src="img/' + esc(v.t) + '"><span class="thn" title="' + nf(v.ph || 0) + ' photos">' + ic('i-cam') + nf(v.ph || 0) + '</span></span>' : '<span class="th th--none" title="No photos uploaded">' + ic('i-cam-off') + '</span>'),
      miles: v.mi == null ? '<div class="mil mil--none" title="No odometer">—</div>' : '<div class="mil" title="' + nf(v.mi) + ' miles">' + nf(v.mi) + '</div>',
      stock: '<div class="stk"><span class="stk__l"><a class="stock" href="' + EDITOR + '" data-stop title="Open in the vehicle editor">' + esc(v.s) + '</a>' + (v.lock ? '<span class="lock" title="Being edited by another user">' + ic('i-lock') + '</span>' : '') + '</span><span class="stk__vin" title="VIN ' + esc(v.vin) + '">' + esc(v.vin) + '</span></div>',
      year: '<div class="yr">' + v.y + '</div>',
      make: '<div class="mk" title="' + esc(v.mk) + '">' + esc(v.mk) + '</div>',
      model: '<div class="md" title="' + esc(v.md) + '">' + esc(v.md) + '</div>',
      trim: '<div class="trim" title="' + esc(v.tr) + '">' + (v.tr ? esc(v.tr) : '<i>—</i>') + '</div>',
      colour: '<div class="ext" title="' + esc(v.c) + '"><span class="sw" style="--c:' + v.hx + '"></span><span>' + esc(v.c) + '</span></div>',
      price: priceCell(v),
      status: '<div class="st"><span class="stat stat--' + (S.lane === 'Sold' ? 'sold' : 'ok') + '">' + (S.lane === 'All' ? 'Available' : esc(S.lane)) + '</span></div>',
      health: '<div class="tags">' + (v.f.length ? tags.map(tag).join('') + (rest > 0 ? '<span class="tag tag--more" title="' + esc(v.f.slice(tags.length).join(' · ')) + '">+' + rest + '</span>' : '') : '<span class="noflag" title="No listing flags">—</span>') + '</div>',
      age: '<div class="added age--' + b + '" title="Added ' + addedOn(v.d) + ' · ' + nf(v.d) + ' days in stock"><b>' + addedOn(v.d) + '</b><span>' + lab(v.d) + '</span></div>',
      actions: '<span class="acts"><button type="button" title="Edit vehicle" aria-label="Edit vehicle" data-stop data-go="' + EDITOR + '">' + ic('i-edit') + '</button><button type="button" title="Photos" aria-label="Photos" data-stop>' + ic('i-cam') + '</button><button type="button" title="Window sticker" aria-label="Window sticker" data-stop>' + ic('i-print') + '</button><button type="button" class="del" title="Delete vehicle" aria-label="Delete vehicle" data-stop>' + ic('i-trash') + '</button></span>'
    };
  }
  /* Added: the demo lot's day count read back from the date of this snapshot,
     so the dates stay fixed between visits. */
  var ASOF = Date.UTC(2026, 9, 1), MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function addedOn(d) { var t = new Date(ASOF - d * 864e5); return MON[t.getUTCMonth()] + ' ' + t.getUTCDate() + ', ' + t.getUTCFullYear(); }
  function row(v, i) {
    var cells = rowCells(v), name = v.y + ' ' + v.mk + ' ' + v.md;
    return '<div class="row' + (i % 2 ? ' row--alt' : '') + (S.cur === v.id ? ' open' : '') + '" data-id="' + v.id + '" tabindex="0" aria-label="' + esc(name) + '">' +
      visibleCols().map(function (c) { return cells[c.id] != null ? cells[c.id] : c.cell ? c.cell(v) : NOD; }).join('') +
      '</div>';
  }

  /* CSS publishes the sticky geometry; JS reads it rather than keeping a second
     copy. Custom properties are substituted but not evaluated, so --stick-total
     comes back as the literal text "calc(68px + 72px + 52px)" and parseFloat
     returns NaN — the three plain values are summed here instead. The same trap
     silently disabled the old --stick-hd-top read, which survived only because
     its fallback happened to equal the right number. */
  var CSSV = getComputedStyle(document.documentElement);
  function cssPx(n, f) { var v = parseFloat(CSSV.getPropertyValue(n)); return isNaN(v) ? f : v; }
  function stickTotal() { return cssPx('--stick-bar', 68) + cssPx('--stick-cmd', 72) + cssPx('--stick-hd', 52); }
  function reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* The anchor. The selected row comes to rest at a named position under the
     sticky stack — the behaviour All Leads has always had, where it is spelled
     `- 56 - 58 - 48 - 10` in the source. Near the end of the list there is not
     enough page left to scroll, so #exp-space lends the document the shortfall. */
  function anchorRow(id) {
    var r = $('.row[data-id="' + id + '"]'); if (!r) return;
    var y = Math.max(0, Math.round(r.getBoundingClientRect().top + window.scrollY - stickTotal() - cssPx('--anchor-gap', 10)));
    var sp = $('#exp-space');
    if (sp) {
      sp.style.height = '0px';
      var need = y - (document.documentElement.scrollHeight - window.innerHeight);
      sp.style.height = need > 0 ? Math.ceil(need) + 'px' : '0px';
    }
    window.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  function render() {
    var L = list(), F = filtered();
    applyCols();
    $('#tb').innerHTML = L.length ? L.map(function (v, i) { return row(v, i) + (S.cur === v.id ? '<div class="exp' + (S.still ? ' exp--open' : '') + '" id="exp"><div><div class="exp__in">' + vehicleSheet(v) + '</div></div></div>' : ''); }).join('') + (S.cur ? '<div class="exp-space" id="exp-space"></div>' : '') : (laneTotal() === 0 ? '<div class="empty empty--lane"><b>No vehicles ' + esc(S.lane.toLowerCase()) + '</b><span>Vehicles marked Sale pending appear here.</span></div>' : '<div class="empty">No vehicles match these filters.<button type="button" data-act="clear-all">Clear all</button></div>');
    $('.field').classList.toggle('has-open', !!S.cur);
    // the sheet sits in the list; reading offsetWidth commits the inserted
    // element before the state class lands, so the entrance actually plays
    var ex = $('#exp'); if (ex && !S.still) { void ex.offsetWidth; ex.classList.add('exp--open'); }
    S.still = false;
    renderPager(F || !laneTotal() ? L.length : laneTotal());

    var chips = [];
    Object.keys(S.attn).forEach(function (a) { if (S.attn[a]) chips.push({ cls: 'chip--attn', v: ATTN[a], off: function () { setAttn(a, false); } }); });
    if (S.q.trim()) chips.push({ cls: '', v: '“' + S.q.trim() + '”', off: function () { S.q = ''; $('#q').value = ''; } });
    if (S.age) chips.push({ cls: 'chip--attn', v: 'Age ' + AGE[S.age], off: function () { setAge(null); } });
    Object.keys(S.f).forEach(function (g) {
      sel(g).forEach(function (key) { chips.push({ cls: '', v: (g === 'make' ? '' : GL[g] + ': ') + labelOf(g, key), off: function () { S.f[g][key] = false; if (g === 'make') renderMakes(); } }); });
    });
    $('#scope').innerHTML = '<span class="scope__n">' + (S.lane === 'All' ? 'All vehicles' : esc(S.lane)) + '</span><span>·</span><span><b>' + nf(F || !laneTotal() ? L.length : laneTotal()) + '</b> vehicles</span>' +
      (chips.length ? chips.map(function (c, i) { return '<span class="chip ' + c.cls + '">' + esc(c.v) + '<button class="chip__x" type="button" data-chip="' + i + '" aria-label="Remove ' + esc(c.v) + '">' + ic('i-x') + '</button></span>'; }).join('') + '<button class="scope__clear" type="button" data-act="clear-all">Clear all</button>' : '') +
      '';
    $('#sub-shown').textContent = (L.length ? '1–' + L.length : '0') + ' shown';
    $('#scope')._chips = chips;

    var mk = sel('make'), yb = sel('year'), pb = sel('price');
    $('#make-v').textContent = !mk.length ? 'Any' : mk.length === 1 ? mk[0] : mk[0] + ' +' + (mk.length - 1);
    $('#year-v').textContent = !yb.length ? 'Any' : yb.length === 1 ? labelOf('year', yb[0]) : yb.length + ' ranges';
    $('#price-v').textContent = !pb.length ? 'Any' : pb.length === 1 ? labelOf('price', pb[0]) : pb.length + ' ranges';
    $('[data-pop="p-make"]').classList.toggle('facet__b--on', mk.length > 0);
    $('[data-pop="p-year"]').classList.toggle('facet__b--on', yb.length > 0);
    $('[data-pop="p-price"]').classList.toggle('facet__b--on', pb.length > 0);
    $$('[data-fk]').forEach(function (b) { var p = b.dataset.fk.split(':'); b.classList.toggle('on', !!S.f[p[0]][p[1]]); if (b.closest('.pop__quick, .sws')) b.setAttribute('aria-pressed', !!S.f[p[0]][p[1]]); });
    var nf2 = nSel(['model', 'mile', 'loc', 'type', 'merch', 'color', 'opt']);
    $('#fcnt').hidden = !nf2; $('#fcnt').textContent = nf2;
    $$('#p-sort [data-sort]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.sort === S.sort); });
    $$('#p-sort [data-dir]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.dir === S.dir); });
    $('#sort-v').textContent = ({ days: 'When added', price: 'Price', stock: 'Stock', year: 'Year', make: 'Make', model: 'Model', miles: 'Mileage', trim: 'Trim', colour: 'Color', status: 'Status', issues: 'Listing flags' })[S.sort] + (S.dir === 'asc' ? ' ↑' : ' ↓');
    if (S.dock === 'filters') renderFilters();
  }
  /* Pagination: the original's pager, above the table and again below it
     (review note: "I have it on bottom AND on top"). Showing a–b of N,
     ‹ pages ›, and Rows 50 / 100 / 250 / 500 / 1000. The demo lot is one page
     of sample cars, so changing page moves the counts, not the rows. */
  var PER = [50, 100, 250, 500, 1000];
  function renderPager(total) {
    var pages = Math.max(1, Math.ceil(total / S.per));
    if (S.page > pages) S.page = pages;
    var a = total ? (S.page - 1) * S.per + 1 : 0, z = Math.min(total, S.page * S.per);
    var nums = [], p;
    for (p = 1; p <= pages; p++) if (p === 1 || p === pages || Math.abs(p - S.page) <= 1) nums.push(p);
    var btns = '', last = 0;
    nums.forEach(function (n) {
      if (n - last > 1) btns += '<span>…</span>';
      btns += '<button type="button" data-pg="' + n + '"' + (n === S.page ? ' class="on" aria-current="page"' : '') + '>' + n + '</button>';
      last = n;
    });
    var html = '<span class="pgr__n">Showing <b>' + nf(a) + '–' + nf(z) + '</b> of <b>' + nf(total) + '</b></span><span class="sp"></span>' +
      '<span class="pg"><button type="button" data-pg="prev" aria-label="Previous page"' + (S.page <= 1 ? ' disabled' : '') + '>‹</button>' + btns +
      '<button type="button" data-pg="next" aria-label="Next page"' + (S.page >= pages ? ' disabled' : '') + '>›</button></span>' +
      '<label class="pgr__per"><span>Rows</span><select class="sel sel--sm" data-per aria-label="Rows per page">' + PER.map(function (n) { return '<option' + (n === S.per ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>';
    $$('.pgr').forEach(function (el) { el.innerHTML = html; el._pages = pages; });
  }
  function renderMakes() {
    $('#make-list').innerHTML = MAKES.map(function (m) { return '<label class="pop__it"><input class="ck" type="checkbox" data-f="make" data-k="' + esc(m[0]) + '"' + (S.f.make[m[0]] ? ' checked' : '') + '><span>' + esc(m[0]) + '</span><span class="c">' + m[1] + '</span></label>'; }).join('');
  }
  function setAttn(a, on) { S.attn[a] = on; $$('.ar[data-attn="' + a + '"]').forEach(function (b) { b.classList.toggle('ar--on', on); b.setAttribute('aria-pressed', on); }); render(); }
  function setAge(b) { S.age = b; $$('[data-age]').forEach(function (el) { el.classList.toggle('on', el.dataset.age === b); }); render(); }
  /* hero number as a counter: rolls from the current value to the new one (~700ms, eased); instant when reduced motion is on */
  function countTo(el, text) {
    var to = parseInt(String(text).replace(/[^0-9]/g, ''), 10); if (isNaN(to)) { el.textContent = text; return; }
    var from = parseInt(String(el.textContent).replace(/[^0-9]/g, ''), 10) || 0;
    if (from === to || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) { el.textContent = nf(to); return; }
    if (el._raf) cancelAnimationFrame(el._raf);
    var t0 = performance.now(), dur = 700;
    var step = function (t) { var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = nf(Math.round(from + (to - from) * e)); if (p < 1) el._raf = requestAnimationFrame(step); else el._raf = null; };
    el._raf = requestAnimationFrame(step);
  }
  /* Sold, this year by month (review note 11, Ivaylo: "total sold lifetime
     isn't that useful … a chart of sales over time"). The figures are the
     original's own Sold Inventory Report for 2026 (d10), summed across makes;
     September is partial because the export was cut on Sep 9. */
  var SOLD = { year: 2026, ytd: 1701, months: [194, 198, 244, 177, 196, 184, 220, 248, 40], partial: 8, asof: 'Sep 9' };
  var MONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function soldChart() {
    var max = Math.max.apply(null, SOLD.months);
    var bars = MONS.map(function (m, i) {
      var n = SOLD.months[i], has = n != null;
      var t = has ? m + ' ' + SOLD.year + ': ' + nf(n) + ' sold' + (i === SOLD.partial ? ' (to ' + SOLD.asof + ')' : '') : m + ': not yet';
      return '<span class="soldmo__c' + (i === SOLD.partial ? ' soldmo__c--part' : '') + (has ? '' : ' soldmo__c--none') + '" title="' + t + '">' +
        '<i style="--h:' + (has ? Math.max(4, Math.round(n / max * 100)) : 0) + '%"></i><em>' + m.charAt(0) + '</em></span>';
    }).join('');
    return '<span class="soldmo__bars">' + bars + '</span>';
  }
  function setLane(l) {
    S.lane = l;
    $$('[data-lane]').forEach(function (b) { var on = b.dataset.lane === l; b.classList.toggle('lane--on', on); b.classList.toggle('ui-view--on', on); b.setAttribute('aria-pressed', on); });
    var sold = l === 'Sold', ch = $('#soldmo');
    countTo($('#scope-n'), sold ? nf(SOLD.ytd) : $('[data-lane="' + l + '"] b').textContent);
    $('#scope-l').textContent = sold ? 'Sold in ' + SOLD.year : l === 'All' ? 'All on file' : l;
    $('.hero__of').textContent = sold ? $('[data-lane="Sold"] b').textContent + ' sold all time' : 'of 13,587 on file';
    if (ch) {
      if (sold && !ch.innerHTML) ch.innerHTML = soldChart();
      ch.hidden = !sold; ch.title = 'Open the Sold Inventory Report';
      ch.setAttribute('aria-label', 'Sold in ' + SOLD.year + ' by month: ' + MONS.slice(0, SOLD.months.length).map(function (m, i) { return m + ' ' + SOLD.months[i]; }).join(', ') + '. Open the Sold Inventory Report');
    }
    render();
  }
  function tog(g, key, on) {
    S.f[g][key] = on === undefined ? !S.f[g][key] : on;
    if (g === 'make') renderMakes();
    render();
    var el = $('#dock-b [data-f="' + g + '"][data-k="' + key + '"], #dock-b [data-fk="' + g + ':' + key + '"]');
    if (el && document.activeElement === document.body) el.focus({ preventScroll: true });
  }

  /* ── demo market model: deterministic per stock number ────────────── */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var s = seed || 1; return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
  function r100(n) { return Math.round(n / 100) * 100; }
  function market(v) {
    var r = rng(hash(v.s)), base = v.p != null ? v.p : (BASE[v.mk] || 60000), i;
    var med = r100(base * (v.p != null ? 0.9 + r() * 0.24 : 0.94 + r() * 0.12));
    var lo = r100(med * (0.8 + r() * 0.06)), hi = r100(med * (1.15 + r() * 0.08));
    var m = { med: med, lo: lo, hi: hi, n: 7 + Math.floor(r() * 26), dts: 19 + Math.floor(r() * 64), min: med * 0.55, max: med * 1.45, bins: [], comps: [] };
    for (i = 0; i < 20; i++) { var x = (i - 9.5) / 7.5; m.bins.push(0.08 + Math.exp(-x * x) * (0.55 + r() * 0.45)); }
    for (i = 0; i < 5; i++) {
      m.comps.push({ y: Math.min(2026, v.y + Math.round((r() - 0.5) * 4)), p: r100(med * (0.86 + r() * 0.28)), mi: NO_MILES[v.mk] ? null : Math.round((1500 + r() * 60000) / 100) * 100, ago: 1 + Math.floor(r() * 38), dist: 14 + Math.floor(r() * 600), st: STATES[Math.floor(r() * STATES.length)] });
    }
    m.comps.sort(function (a, b) { return a.ago - b.ago; });
    return m;
  }

  /* ── dock ─────────────────────────────────────────────────────────── */
  function acc(key, title, summary, inner, extra) {
    var o = !!S.acc[key];
    return '<section class="acc' + (o ? ' acc--open' : '') + '" data-acc="' + key + '"><h3><button class="acc__h" type="button" aria-expanded="' + o + '" aria-controls="acc-' + key + '"><span class="acc__t">' + title + '</span>' + (extra || '') + '<span class="acc__s">' + summary + '</span>' + ic('i-chev') + '</button></h3>' +
      '<div class="acc__p" id="acc-' + key + '"' + (o ? '' : ' inert') + '><div><div class="acc__in">' + inner + '</div></div></div></section>';
  }
  function setAccOpen(sec, open) {
    sec.classList.toggle('acc--open', open);
    var b = $('.acc__h', sec), p = $('.acc__p', sec);
    if (b) b.setAttribute('aria-expanded', open);
    if (p) { if (open) p.removeAttribute('inert'); else p.setAttribute('inert', ''); }
  }
  function openDock() { $('#app').classList.add('dock-open'); $('[data-act="filters"]').classList.toggle('facet__b--on', S.dock === 'filters'); }
  function closeDock() { S.dock = null; $('#app').classList.remove('dock-open'); $('[data-act="filters"]').classList.remove('facet__b--on'); $('#dock-f').className = 'dock__f'; render(); }

  function showVehicle(id) {
    var v = byId(id); if (!v) return;
    if (S.cur === id) { closeVehicle(); return; }
    // switching is an ordinary open of another row: the old sheet went through a
    // 200ms exit fade on an element the next render destroyed anyway
    S.cur = id;
    render();
    anchorRow(id);
  }
  /* Closing does nothing to the scroll. Restoring the pre-open position was
     measured against the shipped product and against the user: someone who
     opens at 1623, scrolls to 2223 to read, then closes would be thrown 723px
     away from what they were reading. Scroll anchoring absorbs the reflow. */
  function closeVehicle() { S.cur = null; render(); }

  /* On website (review note 20, Ivaylo: "a toggle to quick hide from site …
     glow red and say hidden on site"). A real switch, not a button that
     renames itself: on = shown, off = red with "Hidden on site". It works in
     the mock — flipping it updates the chip under the name, the Listing fact
     and the row in the table, without closing the sheet. */
  function siteSwitch(v) {
    var hid = v.f.indexOf('Hidden') >= 0;
    return '<button class="sitesw' + (hid ? ' sitesw--off' : '') + '" type="button" role="switch" aria-checked="' + !hid + '" data-site="' + v.id + '">' +
      '<span class="sitesw__t" aria-hidden="true"><i></i></span><span class="sitesw__l">' + (hid ? 'Hidden on site' : 'On website') + '</span></button>';
  }
  function vehicleSheet(v) {
    var has = function (t) { return v.f.indexOf(t) >= 0; };
    var ab = function (cls, icon, label) { return '<button class="btn ' + cls + '" type="button">' + ic(icon) + '<span>' + label + '</span></button>'; };
    /* Edit vehicle is the way into the full editor, so it leads the key figures
       at their own height instead of sitting first in a row of six peers
       (review note, Ivaylo 2026-10-07). The row below keeps the secondary actions. */
    var lead = '<button class="btn btn--primary btn--lead" type="button" data-go="' + EDITOR + '">' + ic('i-edit') + '<span>Edit vehicle</span>' + ic('i-right') + '</button>';
    var acts = '<div class="veh__acts">' +
      ab('btn--sheet', 'i-cam', 'Photos') + ab('btn--sheet', 'i-print', 'Window sticker') +
      ab('btn--sheet', 'i-file', 'Carfax') + ab('btn--sheet', 'i-rss', has('Feed off') ? 'Include in feeds' : 'Exclude feeds') +
      siteSwitch(v) + ab('btn--sheet btn--del', 'i-trash', 'Delete…') + '</div>';
    var p = vehicleBody(v);
    /* The sheet is an object header and then a stack of regions, not two tall
       columns. The figures, price rows and actions belong beside the photo —
       leaving them under it made the left column 578px against a 344px right
       column, which is where the 234px of white came from. The regions then
       take the whole sheet width instead of two thirds of it. */
    return '<div class="exp__l">' + p.img + '</div>' +
      '<div class="exp__r"><div class="exp__top"><div><h3 class="veh__n"><em>' + v.y + '</em>' + esc(v.mk) + ' ' + esc(v.md) + '</h3>' + p.facts + p.meta + p.tags + '</div><button class="exp__x" type="button" data-act="close-veh" aria-label="Close vehicle">' + ic('i-x') + '</button></div>' +
        '<div class="veh__lead">' + lead + p.kv + '</div>' + (p.pricing || '') + acts + '</div>' +
      '<div class="exp__accs">' + p.accs + '</div>';
  }

  function vehicleBody(v) {
    var b = band(v.d), has = function (t) { return v.f.indexOf(t) >= 0; }, m = market(v);
    /* Listing: the six facts of the listing, each with its own glyph, the set
       ones in ink and the rest quiet. No "need work", no "passing" — a hidden
       car or a feed exclusion is often the dealer's intent (Ivaylo, 16 + 19). */
    var L6 = [
      ['i-tag', 'Price', has('No price') ? 'not set' : fmt(v.p), has('No price')],
      [v.ph ? 'i-cam' : 'i-cam-off', 'Photos', v.ph ? nf(v.ph) : 'none', !v.ph],
      ['i-rss', 'Partner feeds', has('Feed off') ? 'excluded' : 'included', has('Feed off')],
      [has('Hidden') ? 'i-eye-off' : 'i-eye', 'Website', has('Hidden') ? 'hidden' : 'shown', has('Hidden')],
      ['i-file', 'VIN', 'decoded', false],
      ['i-clock', 'Sale', has('Pending') ? 'pending' : 'none pending', has('Pending')]
    ];
    var SHORT = { 'No price': 'No price', 'No photos': 'No photos', 'Feed off': 'Feeds off', 'Hidden': 'Hidden', 'Pending': 'Sale pending' };
    var healthSum = v.f.length ? '<span class="lsum">' + v.f.map(function (x) { return esc(SHORT[x] || x); }).join(' · ') + '</span>' : '<span class="lsum lsum--none">No flags</span>';
    var healthIn = '<div class="lst">' + L6.map(function (r) {
      return '<div class="lst__r' + (r[3] ? ' lst__r--set' : '') + '"><i>' + ic(r[0]) + '</i><span class="lst__k">' + r[1] + '</span><span class="lst__v">' + esc(r[2]) + '</span></div>';
    }).join('') + '</div>';

    /* market & pricing */
    var span = m.max - m.min, pos = function (x) { return Math.max(0, Math.min(100, (x - m.min) / span * 100)); }, mx = Math.max.apply(null, m.bins);
    var bars = m.bins.map(function (h, i) { var mid = m.min + span * (i + 0.5) / m.bins.length; return '<i class="' + (mid >= m.lo && mid <= m.hi ? 'in' : '') + '" style="height:' + Math.max(4, Math.round(h / mx * 100)) + '%"></i>'; }).join('');
    var d = v.p != null ? (v.p - m.med) / m.med : 0, flat = Math.abs(d) < 0.03;
    var deltaTxt = flat ? 'At market' : (Math.abs(d) * 100).toFixed(1) + '% ' + (d < 0 ? 'below' : 'above');
    var mktSum = v.p != null ? '<span class="' + (flat ? '' : d < 0 ? 'good' : 'bad') + '">' + deltaTxt + (flat ? '' : ' market') + '</span>' : '<span class="bad">Suggested ' + k(m.med) + '</span>';
    var mktIn =
      '<div class="prov"><b>visor.vin market data</b><span>· not connected</span></div>' +
      '<div class="mkt__row">' +
        (v.p != null ? '<div><div class="mkt__v">' + fmt(v.p) + '</div><div class="mkt__l">Your asking price</div></div>' : '<div><div class="mkt__v warn">No price</div><div class="mkt__l">Your asking price</div></div>') +
        '<div><div class="mkt__v">' + fmt(m.med) + '</div><div class="mkt__l">Market median</div></div>' +
        (v.p != null ? '<span class="delta' + (flat ? '' : d < 0 ? ' delta--ok' : ' delta--warn') + '">' + (flat ? '' : ic(d < 0 ? 'i-dn' : 'i-up')) + deltaTxt + '</span>' : '<span></span>') +
      '</div>' +
      '<div class="dist" aria-hidden="true"><span class="dist__band" style="left:' + pos(m.lo).toFixed(1) + '%;right:' + (100 - pos(m.hi)).toFixed(1) + '%"></span>' + bars +
        (v.p != null ? '<span class="dist__mk" style="left:' + pos(v.p).toFixed(1) + '%"><b>You</b></span>' : '<span class="dist__mk dist__mk--med" style="left:' + pos(m.med).toFixed(1) + '%"><b>Median</b></span>') + '</div>' +
      '<div class="dist__ax" aria-hidden="true"><span>' + k(m.min) + '</span><span>Price distribution · ' + m.n + ' listings</span><span>' + k(m.max) + '</span></div>' +
      (v.p == null ? '<div class="suggest"><span>Price at the market median: <b>' + fmt(m.med) + '</b></span><button class="btn btn--sheet btn--sm" type="button">Set price</button></div>' : '') +
      '<dl class="kvl"><div><dt>Typical range</dt><dd>' + k(m.lo) + ' – ' + k(m.hi) + '</dd></div><div><dt>Comparable listings</dt><dd>' + m.n + ' · last 90 days</dd></div><div><dt>Median days to sell</dt><dd>' + m.dts + ' days</dd></div></dl>';

    /* recent comps */
    var compsIn = '<ul class="cps">' + m.comps.map(function (c) {
      var diff = v.p != null ? c.p - v.p : null;
      return '<li class="cp"><div class="cp__id"><b>' + c.y + ' ' + esc(v.mk) + ' ' + esc(v.md) + '</b><span>' + (c.mi != null ? nf(c.mi) + ' mi · ' : '') + 'listed ' + c.ago + 'd ago · ' + c.dist + ' mi away, ' + c.st + '</span></div>' +
        '<div class="cp__p"><b>' + fmt(c.p) + '</b>' + (diff != null ? '<span class="' + (diff >= 0 ? 'up' : 'dn') + '" title="Compared with your asking price">' + (diff >= 0 ? '+' : '−') + k(Math.abs(diff)) + ' vs yours</span>' : '') + '</div></li>';
    }).join('') + '</ul><button class="linkbtn" type="button">All ' + m.n + ' comparable listings' + ic('i-right') + '</button>';
    mktIn += '<div class="reg__sub">Recent comps<span class="demo">Demo</span></div>' + compsIn;

    /* history */
    var sd = hash(v.s), T = [['i-edit', 'Edited by Parin', '3 days ago']];
    if (v.ph) T.push(['i-cam', 'Photos updated · ' + v.ph + ' photos', Math.min(v.d, 9) + ' days ago']);
    if (v.p != null) T.push(['i-tag', 'Asking price set to ' + fmt(v.p), Math.min(v.d, 14 + sd % 50) + ' days ago']);
    if (has('Feed off')) T.push(['i-rss', 'Excluded from partner feeds', Math.min(v.d, 60 + sd % 90) + ' days ago']);
    T.push(['i-plus', 'Added to inventory', nf(v.d) + ' days ago']);
    var histIn = '<ul class="tl">' + T.map(function (t) { return '<li><span class="tl__i">' + ic(t[0]) + '</span><span>' + esc(t[1]) + '</span><span>' + t[2] + '</span></li>'; }).join('') + '</ul>';

    /* the four facts a dealer reads first, lifted out of Specification so they
       need no click (review note 18) — Trim · Mileage · Exterior · Type */
    var factsIn = '<div class="veh__facts">' + [
      ['Trim', v.tr || '—'], ['Mileage', v.mi == null ? '—' : nf(v.mi) + ' mi'], ['Exterior', v.c || '—'], ['Type', 'Used']
    ].map(function (x) { return '<span><em>' + x[0] + '</em>' + esc(x[1]) + '</span>'; }).join('') + '</div>';
    var specIn = '<div class="spec2"><div><span>Trim</span><span title="' + esc(v.tr) + '">' + (esc(v.tr) || '—') + '</span></div><div><span>Exterior</span><span>' + esc(v.c) + '</span></div><div><span>Type</span><span>Used</span></div><div><span>Mileage</span><span>' + (v.mi == null ? 'No odometer' : nf(v.mi) + ' mi') + '</span></div><div><span>Location</span><span>Chicago Motor Cars</span></div><div><span>Stock #</span><span class="mono">' + esc(v.s) + '</span></div></div>';

    return {
      img: '<div class="veh__img">' + (v.t ? '<img alt="' + esc(v.y + ' ' + v.mk + ' ' + v.md) + '" src="img/' + esc(v.t) + '"><span class="cnt">' + ic('i-cam') + nf(v.ph || 0) + ' photos</span>' : '<div class="none">' + ic('i-cam-off') + 'No photos uploaded<button class="btn btn--sm" type="button">' + ic('i-plus') + ' Upload photos</button></div>') + '</div>',
      facts: factsIn,
      meta: '<div class="veh__m"><span class="idtag">' + esc(v.s) + '</span><span class="mono">VIN ' + esc(v.vin) + '</span><span class="veh__st">Available</span>' + (v.lock ? '<span class="lock" title="Being edited by another user">' + ic('i-lock') + '</span>' : '') + '</div>',
      tags: '<div class="veh__tags">' + v.f.map(tag).join('') + '</div>',   // always present: flipping On website must not move the sheet
      /* Price and Invoice cost side by side, then age and photos (Alex): the
         separate full-width price strip is gone. Discount and lease ride under
         the price, as in the table; cost is a cell on every car ("—" when the
         field is empty) so the panel never changes shape between vehicles. */
      kv: '<div class="veh__kv veh__kv--4">' +
        '<div><div class="v' + (v.p == null ? ' warn' : '') + '">' + (v.p == null ? 'No price' : fmt(v.p)) + '</div><div class="l">price</div>' +
          (v.disc && v.p != null && v.disc < v.p ? '<div class="kv__sub"><b class="ok">' + fmt(v.disc) + '</b> discount</div>' : '') +
          (v.lease ? '<div class="kv__sub"><b>' + fmt(v.lease) + '/mo</b> lease' + (v.lt ? ' · ' + v.lt + ' mo' : '') + '</div>' : '') + '</div>' +
        '<div><div class="v' + (v.inv ? '' : ' none') + '">' + (v.inv ? fmt(v.inv) : '—') + '</div><div class="l">invoice cost</div></div>' +
        '<div><div class="v" style="color:' + (b === 'stale' ? 'var(--danger)' : b === 'fresh' ? 'var(--ok)' : 'var(--ink)') + '">' + lab(v.d) + '</div><div class="l">' + nf(v.d) + ' days</div></div>' +
        '<div><div class="v">' + (v.ph || 0) + '</div><div class="l">photos</div></div></div>',
      pricing: '',   // folded into the key figures above
      /* Four regions stacked down one column, each opening in place and pushing
         the ones below it. Independent — any number may be open at once, and
         health, which opens by default, can be closed like the rest. */
      accs: acc('health', 'Listing', healthSum, healthIn) +
        /* Market intelligence removed from the mock (review note 17, Ivaylo: "remove
           this from mockup. not to be added now"). market(), mktSum and mktIn
           stay above, unused, so the block can come back in one line. */
        acc('spec', 'Specification', esc(v.tr || 'No trim recorded'), specIn) +
        acc('hist', 'History', 'Edited 3 days ago', histIn, ' <span class="demo">Demo</span>')
    };
  }

  function vehicleFoot(v) {
    var has = function (t) { return v.f.indexOf(t) >= 0; };
    return '<div class="vf"><button class="btn btn--primary btn--lg" type="button">' + ic('i-edit') + ' Edit vehicle</button>' +
      '<button class="btn btn--sheet btn--lg" type="button">' + ic('i-cam') + ' Photos</button><button class="btn btn--sheet btn--lg" type="button">' + ic('i-print') + ' Sticker</button>' +
      '<div class="facet"><button class="btn btn--sheet btn--lg btn--icon" type="button" data-pop="p-vmore" aria-label="More actions">' + ic('i-more') + '</button>' +
      '<div class="pop pop--up pop--right mn" id="p-vmore"><button class="mn__it" type="button">' + ic('i-file') + 'Carfax report</button><button class="mn__it" type="button">' + ic('i-rss') + (has('Feed off') ? 'Include in feeds' : 'Exclude feeds') + '</button><button class="mn__it" type="button">' + ic('i-eye') + (has('Hidden') ? 'Show on site' : 'Hide on site') + '</button><div class="mn__sep"></div><button class="mn__it mn__it--danger" type="button">' + ic('i-trash') + 'Delete vehicle…</button></div></div></div>';
  }

  function fv(g, key, label, count, max, extra, cls) {
    var on = !!S.f[g][key];
    return '<label class="fv' + (on ? ' fv--on' : '') + (cls ? ' ' + cls : '') + '"><input class="ck" type="checkbox" data-f="' + g + '" data-k="' + esc(key) + '"' + (on ? ' checked' : '') + '>' +
      '<span class="fv__n"><span class="fv__l">' + label + '</span><span class="fv__m"><i style="width:' + Math.max(2, Math.round(count / max * 100)) + '%"></i></span></span>' +
      '<span class="fv__x">' + (extra || '') + '</span><span class="fv__c">' + nf(count) + '</span></label>';
  }
  function facetList(g, rows, sig) {
    var max = Math.max.apply(null, rows.map(function (x) { return x[2]; }));
    return '<div class="fvs">' + rows.map(function (x) { return fv(g, x[0], esc(x[1]), x[2], max, '', sig && x[0] === sig ? 'fv--signal' : ''); }).join('') + '</div>';
  }
  function hist(g, rows, sig) {
    var max = Math.max.apply(null, rows.map(function (x) { return x[2]; }));
    return '<div class="hist" aria-hidden="true">' + rows.map(function (x) { return '<button type="button" tabindex="-1" class="' + (sig && x[0] === sig ? 'sig' : '') + (S.f[g][x[0]] ? ' on' : '') + '" data-fk="' + g + ':' + x[0] + '" style="height:' + Math.max(6, Math.round(x[2] / max * 100)) + '%" title="' + esc(x[1]) + ' · ' + x[2] + '"></button>'; }).join('') + '</div>';
  }
  function sum(g, dflt) { var s = sel(g); return s.length ? '<b>' + esc(s.map(function (x) { return labelOf(g, x); }).join(', ')) + '</b>' : dflt; }

  function renderFilters() {
    var b = $('#dock-b'), st = b.scrollTop, L = list(), F = filtered();
    $('#dock-t').textContent = 'Filters'; $('#dock-c').textContent = nSel() ? nSel() + ' active' : ''; $('#dock-nav').hidden = true;
    var makes = S.allMakes ? MAKES : MAKES.slice(0, 8);
    var h = '<label class="fsearch">' + ic('i-search') + '<input type="search" data-fq placeholder="Search filters — make, color, location…" value="' + esc(S.fq) + '" aria-label="Search filters"></label>';
    h += acc('f-make', 'Make', sum('make', MAKES.length + ' makes'),
      '<div class="fvs">' + makes.map(function (m) { return fv('make', m[0], esc(m[0]), m[1], 54, m[2] ? 'avg ' + k(m[2]) : 'no prices'); }).join('') + '</div>' +
      '<button class="linkbtn" type="button" data-act="all-makes">' + (S.allMakes ? 'Show top 8' : 'Show all ' + MAKES.length + ' makes') + '</button>');
    h += acc('f-model', 'Model', sum('model', 'Top models'), facetList('model', G.model) + '<p class="hint">Choose a make to list every model it has.</p>');
    h += acc('f-year', 'Year', sum('year', '1929 – 2027'), hist('year', G.year) + facetList('year', G.year));
    h += acc('f-price', 'Price', sum('price', '<span class="bad">133 without a price</span>'), hist('price', G.price, 'none') + facetList('price', G.price, 'none') +
      '<div class="pop__row f-range"><input class="fld" type="search" inputmode="numeric" placeholder="$ min" aria-label="Minimum price"><span>–</span><input class="fld" type="search" inputmode="numeric" placeholder="$ max" aria-label="Maximum price"></div>');
    h += acc('f-mile', 'Mileage', sum('mile', 'Any'), facetList('mile', G.mile));
    h += acc('f-loc', 'Location', sum('loc', '6 rooftops'), facetList('loc', G.loc));
    h += acc('f-type', 'Type', sum('type', 'New · Used'), facetList('type', G.type));
    h += acc('f-merch', 'Merchandising', sum('merch', 'Site · feeds · pending'), facetList('merch', G.merch));
    h += acc('f-color', 'Exterior color', sum('color', 'Any'), '<div class="sws">' + COLORS.map(function (c) { var on = !!S.f.color[c[0]]; return '<button type="button" class="swb' + (on ? ' swb--on' : '') + '" data-fk="color:' + c[0] + '" aria-pressed="' + on + '"><span class="sw" style="--c:' + c[1] + '"></span>' + c[0] + '<b>' + c[2] + '</b></button>'; }).join('') + '</div>');
    h += acc('f-opt', 'Options', sum('opt', 'Decoded from VIN'), facetList('opt', G.opt), ' <span class="demo">Demo</span>');
    h += acc('f-audit', 'Audit', 'Missing items · custom field',
      '<label class="f"><span>Missing items</span><select class="sel"><option value="">— any —</option><optgroup label="Photos"><option>Images</option><option>1 image or less</option></optgroup><optgroup label="Identity"><option>VIN decoding</option><option>Stock number</option><option>Make</option><option>Model</option><option>Trim</option><option>Year</option><option>VIN number</option><option>Vehicle type</option></optgroup><optgroup label="Specs"><option>Body</option><option>Transmission</option><option>Mileage</option><option>Exterior color</option><option>Interior color</option><option>Fuel</option><option>Location</option></optgroup><optgroup label="Pricing"><option>Price</option><option>Discounted price</option><option>Invoice price</option><option>Lease price</option><option>Lease term</option></optgroup><optgroup label="Copy"><option>Intro description</option><option>Caption</option><option>Main description</option><option>Bulleted text</option><option>Description 2</option><option>Buyers guide text</option></optgroup></select></label>' +
      '<div class="f"><span>Custom field</span><div class="pop__row"><select class="sel" aria-label="Custom field"><option value="">—</option><option>cfx_date</option><option>trucks_and_equipment</option><option>ove_feed_data</option><option>no_carfax</option><option>pending_sale_name</option><option>truck_trailer</option><option>images_timestamp</option><option>no_vin</option><option>carfax_timestamp</option></select><input class="fld" type="search" placeholder="value…" aria-label="Custom field value"></div></div>' +
      '<div class="f2"><label class="f"><span>Stock #</span><input class="fld" type="search" placeholder="Exact stock"></label><label class="f"><span>VIN</span><input class="fld" type="search" placeholder="Full or partial"></label></div>');
    var focusFq = document.activeElement && document.activeElement.matches && document.activeElement.matches('[data-fq]');
    b.innerHTML = h; b.scrollTop = st; applyFq();
    if (focusFq) { var q = $('[data-fq]'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
    $('#dock-f').className = 'dock__f dock__f--row';
    $('#dock-f').innerHTML = '<button class="btn btn--quiet" type="button" data-act="reset-f"' + (nSel() ? '' : ' disabled') + '>Reset</button><span class="dock__note"><span class="demo">Demo</span> counts</span><button class="btn btn--primary" type="button" data-act="close">Show ' + nf(F ? L.length : 359) + ' vehicles</button>';
  }
  function applyFq() {
    var q = S.fq.trim().toLowerCase();
    $$('#dock-b .acc').forEach(function (sec) {
      var t = $('.acc__t', sec).textContent.toLowerCase(), rows = $$('.fv, .swb', sec), hit = 0, titleHit = q && t.indexOf(q) >= 0;
      rows.forEach(function (r) { var m = !q || titleHit || r.textContent.toLowerCase().indexOf(q) >= 0; r.hidden = !m; if (m) hit++; });
      $$('.hist, .linkbtn, .hint', sec).forEach(function (x) { x.hidden = !!q && !titleHit; });
      sec.hidden = !!q && !hit && !titleHit;
      setAccOpen(sec, q ? !sec.hidden : !!S.acc[sec.dataset.acc]);
    });
  }
  function showFilters() { S.dock = 'filters'; $('#dock-b').scrollTop = 0; openDock(); render(); }

  /* ── platform menus, theme ────────────────────────────────────────── */
  function closeMenus(except) { $$('.nav__it--open').forEach(function (it) { if (it !== except) { it.classList.remove('nav__it--open'); var b = $('[data-menu]', it); if (b) b.setAttribute('aria-expanded', 'false'); } }); }
  /* Dark is gated off for Gen 11 while its palette is re-solved.
     It was authored against the Gen 8 tokens; the surfaces underneath are now
     painted with literals it cannot reach, so the exception labels in Value and
     Needs-attention rendered white-on-white. The CSS is quarantined and
     inactive, and this keeps the attribute from ever being set — including from
     an `aan-theme=dark` left in localStorage by one of the other Gen pages,
     which share that key. Temporary: the dark-theme stage removes this gate. */
  var DARK_ENABLED = false;
  function setTheme(t, keep) {
    if (t === 'dark' && !DARK_ENABLED) t = 'light';
    document.documentElement.setAttribute('data-theme', t);
    if (keep) try { localStorage.setItem('aan-theme', t); } catch (e) {}
    var btn = $('[data-act="theme"]');
    if (btn) btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  /* ── events ───────────────────────────────────────────────────────── */
  function closePops() {
    var had = $('#p-cols') && $('#p-cols').classList.contains('pop--open');
    var inside = had && $('#p-cols').contains(document.activeElement);
    $$('.pop--open').forEach(function (p) { p.classList.remove('pop--open'); });
    var cp = $('#p-cols');
    if (cp && colsHome && cp.parentNode === document.body) {
      cp.removeAttribute('style');
      cp.classList.remove('pop--up');
      colsHome.appendChild(cp);
    }
    $$('[data-pop]').forEach(function (b) { if (b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded', 'false'); });
    /* focus must not vanish with the panel that held it */
    if (inside && $('#cols-btn')) $('#cols-btn').focus();
  }
  /* A popover is left-anchored to its trigger. For a facet in the right half
     of the toolbar that runs the panel past the workspace edge, and the
     workspace clips — the Price filter lost 105px of its quick-range buttons
     at 1440. Flip to right-anchored when, and only when, it would overflow. */
  function fitPop(p) {
    p.classList.remove('pop--right');
    var host = p.closest('.field') || document.documentElement;
    var hb = host.getBoundingClientRect(), b = p.getBoundingClientRect();
    if (b.right > hb.right - 1) p.classList.add('pop--right');
  }

  function openColsPop() {
    var p = $('#p-cols'), b = $('#cols-btn');
    p.innerHTML = colsPopHTML();
    if (!colsHome) colsHome = p.parentNode;
    if (p.parentNode !== document.body) document.body.appendChild(p);
    p.classList.add('pop--open');
    if (b) b.setAttribute('aria-expanded', 'true');
    placeColsPop();
    updateRoom();
    /* Focus stays on the trigger. The panel is the trigger's next sibling, so
       Tab walks straight into it — the seven toggles, then Reset — and Escape
       hands focus back. Pulling focus in would fight the browser's own
       post-click focus and would be wrong for a non-modal disclosure. */
  }
  document.addEventListener('click', function (e) {
    var t = e.target, el;
    /* hover-only top menus, as on the old site (Matthew, note 8): with a mouse a
       click does not pin a menu open, so two can never overlap. Touch has no
       hover and keeps the tap-to-open; keyboard uses :focus-within. */
    if ((el = t.closest('[data-menu]')) && window.matchMedia('(hover: hover) and (pointer: fine)').matches) { closeMenus(); return; }
    if ((el = t.closest('[data-menu]'))) { var it = el.closest('.nav__it'), open = !it.classList.contains('nav__it--open'); closeMenus(it); it.classList.toggle('nav__it--open', open); el.setAttribute('aria-expanded', open); return; }
    if (!t.closest('.nav__it')) closeMenus();
    if ((el = t.closest('[data-pop]'))) {
      var p = $('#' + el.dataset.pop), wasOpen = p.classList.contains('pop--open');
      closePops();
      if (!wasOpen) {
        if (el.dataset.pop === 'p-cols') openColsPop();
        else { p.classList.add('pop--open'); fitPop(p); if (el.hasAttribute('aria-expanded')) el.setAttribute('aria-expanded', 'true'); }
      }
      return;
    }
    if ((el = t.closest('[data-go]'))) { location.href = el.dataset.go; return; }
    if ((el = t.closest('[data-site]'))) {
      var sv = byId(el.dataset.site), at = sv.f.indexOf('Hidden');
      if (at >= 0) sv.f.splice(at, 1); else sv.f.push('Hidden');
      // keep the end-of-list spacer and the scroll exactly where they were:
      // a re-render recreates the spacer at 0px, and near the end of the list
      // the shorter page would pull the scroll up
      var sp0 = $('#exp-space'), keepH = sp0 ? sp0.style.height : '', y0 = window.scrollY;
      S.still = true; render();
      var sp1 = $('#exp-space'); if (sp1 && keepH) sp1.style.height = keepH;
      window.scrollTo(0, y0);
      var again = $('[data-site="' + sv.id + '"]'); if (again) again.focus();
      return;
    }
    if ((el = t.closest('[data-act="cols-close"]'))) { closePops(); var cb = $('#cols-btn'); if (cb) cb.focus(); return; }
    if ((el = t.closest('[data-mv]'))) {
      var mv = el.dataset.mv.split('|');
      if (moveCol(mv[0], +mv[1])) {
        render();
        var pc = $('#p-cols'), tops = keepPaneScroll(pc);
        pc.innerHTML = colsPopHTML();
        tops(); placeColsPop();
        updateRoom();
        var again = pc.querySelector('[data-mv="' + el.dataset.mv + '"]');
        if (again && !again.disabled) again.focus(); else { var other = pc.querySelector('[data-mv="' + mv[0] + '|' + (-mv[1]) + '"]'); if (other) other.focus(); }
      }
      return;
    }
    if ((el = t.closest('[data-act="cols-reset"]'))) {
      S.cols = colDefaults(); saveCols(); S.order = orderDefault(); saveOrder(); render();
      $('#p-cols').innerHTML = colsPopHTML();
      updateRoom();
      var rb = $('#p-cols .cols__reset'); if (rb) rb.focus();
      return;
    }
    if (!t.closest('.pop')) closePops();
    if ((el = t.closest('.acc__h'))) { var sec = el.closest('.acc'), key = sec.dataset.acc; S.acc[key] = !sec.classList.contains('acc--open'); setAccOpen(sec, S.acc[key]); return; }
    if ((el = t.closest('[data-act="theme"]'))) { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); return; }
    if ((el = t.closest('[data-act="filters"]'))) { if (S.dock === 'filters') closeDock(); else showFilters(); return; }
    if ((el = t.closest('[data-act="close"]'))) { closeDock(); return; }
    if ((el = t.closest('[data-act="close-veh"]'))) { closeVehicle(); return; }
    if ((el = t.closest('[data-act="all-makes"]'))) { S.allMakes = !S.allMakes; render(); return; }
    if ((el = t.closest('[data-act="reset-f"]'))) { Object.keys(S.f).forEach(function (g) { S.f[g] = {}; }); renderMakes(); render(); return; }
        if ((el = t.closest('[data-fk]'))) { var fk = el.dataset.fk.split(':'); tog(fk[0], fk[1]); return; }
    if ((el = t.closest('[data-lane]'))) { setLane(el.dataset.lane); return; }
    if ((el = t.closest('.ar[data-attn]'))) { setAttn(el.dataset.attn, !S.attn[el.dataset.attn]); return; }
    if ((el = t.closest('[data-age]'))) { setAge(S.age === el.dataset.age ? null : el.dataset.age); return; }
    if ((el = t.closest('[data-chip]'))) { $('#scope')._chips[+el.dataset.chip].off(); render(); return; }
    if ((el = t.closest('[data-act="clear-all"]'))) { S.q = ''; $('#q').value = ''; S.attn = {}; Object.keys(S.f).forEach(function (g) { S.f[g] = {}; }); $$('.ar--on').forEach(function (b) { b.classList.remove('ar--on'); b.setAttribute('aria-pressed', 'false'); }); renderMakes(); setAge(null); return; }
    if ((el = t.closest('[data-act="clear-makes"]'))) { S.f.make = {}; renderMakes(); render(); return; }
    if ((el = t.closest('[data-pg]'))) { var pg = el.dataset.pg, np = $('.pgr')._pages || 1; S.page = pg === 'prev' ? Math.max(1, S.page - 1) : pg === 'next' ? Math.min(np, S.page + 1) : +pg; render(); return; }
    if ((el = t.closest('.mn__it[data-sort]'))) { S.sort = el.dataset.sort; render(); closePops(); return; }
    if ((el = t.closest('.hd [data-sort]'))) { if (S.sort === el.dataset.sort) S.dir = S.dir === 'asc' ? 'desc' : 'asc'; else S.sort = el.dataset.sort; render(); return; }
    if ((el = t.closest('[data-dir]'))) { S.dir = el.dataset.dir; render(); closePops(); return; }
    if ((el = t.closest('.row[data-id]')) && !t.closest('[data-stop]')) { showVehicle(el.dataset.id); return; }
    if (t.closest('a[href="#"]')) e.preventDefault();
  });
  document.addEventListener('change', function (e) {
    var col = e.target.closest ? e.target.closest('input[data-col]') : null;
    if (col) {
      var cid = col.dataset.col;
      S.cols[cid] = col.checked; saveCols(); render();
      /* the column moves between "Shown" and "Add a column": rebuild the panel,
         keep its scroll and the search, and put focus back on the same box */
      var pc = $('#p-cols');
      if (pc && pc.classList.contains('pop--open')) {
        var tops = keepPaneScroll(pc), qv = (pc.querySelector('[data-colq]') || {}).value || '';
        pc.innerHTML = colsPopHTML();
        tops();
        var qi = pc.querySelector('[data-colq]'); if (qi && qv) { qi.value = qv; filterColsPanel(qv); }
        updateRoom(); placeColsPop();
        var back = pc.querySelector('input[data-col="' + cid + '"]'); if (back) back.focus();
      }
      return;
    }
    var t = e.target;
    if (t.matches('[data-f]')) { tog(t.dataset.f, t.dataset.k, t.checked); return; }
    if (t.matches('[data-per]')) { S.per = +t.value; S.page = 1; render(); }
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.matches('[data-filter]')) { var q = t.value.toLowerCase(); $$('#make-list .pop__it').forEach(function (it) { it.style.display = it.textContent.toLowerCase().indexOf(q) >= 0 ? '' : 'none'; }); }
    if (t.matches('[data-fq]')) { S.fq = t.value; applyFq(); }
    if (t.id === 'q') { S.q = t.value; S.page = 1; render(); }
    if (t.matches('[data-colq]')) filterColsPanel(t.value);
  });
  document.addEventListener('keydown', function (e) {
    var a = document.activeElement;
    if (e.key === 'Escape') { if ($('.nav__it--open') || $('.pop--open')) { closeMenus(); closePops(); } else if (S.cur) closeVehicle(); else if (S.dock) closeDock(); return; }
    if (e.key === 'Enter' && a && a.matches && a.matches('.row[data-id]')) { showVehicle(a.dataset.id); return; }
    if (e.key === '/' && !/input|select|textarea/i.test(a.tagName)) { e.preventDefault(); $('#q').focus(); }
  });

  /* Photo preview on hover (review note, Ivaylo): rest on a thumbnail and a
     larger shot of the car appears beside it; leave and it goes at once. The
     short delay keeps it from flashing while the pointer travels down the
     list. Pointer-only: touch has no hover, and the row still opens the car. */
  (function () {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var pv = document.createElement('div'), img = document.createElement('img'), timer = null, on = null;
    pv.className = 'thpv'; pv.setAttribute('aria-hidden', 'true'); img.alt = ''; pv.appendChild(img); document.body.appendChild(pv);
    function hide() { clearTimeout(timer); timer = null; on = null; pv.classList.remove('thpv--on'); }
    function show(th) {
      var r = th.getBoundingClientRect(), W = 280, H = Math.round(W * (th.naturalHeight / th.naturalWidth || .665)), gap = 12;
      var x = r.right + gap, y = r.top + r.height / 2 - H / 2;
      if (x + W > innerWidth - 8) x = r.left - gap - W;
      y = Math.max(8, Math.min(innerHeight - H - 8, y));
      img.src = th.src; pv.style.width = W + 'px'; pv.style.height = H + 'px';
      pv.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
      pv.classList.add('thpv--on');
    }
    $('#tb').addEventListener('mouseover', function (e) {
      var th = e.target.closest && e.target.closest('img.th');
      if (!th || th === on) return;
      hide(); on = th; timer = setTimeout(function () { if (on === th) show(th); }, 300);
    });
    $('#tb').addEventListener('mouseout', function (e) {
      if (on && e.target === on) hide();
    });
    window.addEventListener('scroll', hide, { passive: true });
  })();

  for (var y = 2027; y >= 1929; y--) { $('#y1').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); $('#y2').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); }
  setTheme(document.documentElement.getAttribute('data-theme') || 'light', false);
  renderMakes(); render();

  /* review states via hash: #vehicle=20171 · #filters · #dark · #open=comps,hist · #f=make:Porsche,price:none · #lane=Sold */
  (function fromHash() {
    var parts = location.hash.slice(1).split('&').filter(Boolean), P = {};
    parts.forEach(function (p) { var kv = p.split('='); P[kv[0]] = decodeURIComponent(kv[1] || ''); });
    if ('dark' in P) setTheme('dark', false);
    if ('light' in P) setTheme('light', false);
    if (P.open) P.open.split(',').forEach(function (x) { S.acc[x] = true; });
    if (P.close) P.close.split(',').forEach(function (x) { S.acc[x] = false; });
    if (P.f) P.f.split(',').forEach(function (x) { var q = x.split(':'); if (S.f[q[0]]) S.f[q[0]][q[1]] = true; });
    if (P.attn) setAttn(P.attn, true);
    // after the hero's load-in count, which would otherwise count to the old lane's figure
    if (P.lane && document.querySelector('[data-lane="' + P.lane + '"]')) setTimeout(function () { setLane(P.lane); }, 0);
    if (P.vehicle) { var v = V.filter(function (x) { return x.s === P.vehicle; })[0] || V[+P.vehicle]; if (v) showVehicle(v.id); }
    else if ('filters' in P) showFilters();
    else render();
  })();
  /* Sticky state, read from the one place that defines it.
     This used to carry its own copy of the geometry — `<= 56.5` and `<= 114.5`,
     from a layout with a 56px bar — while the CSS had moved on to 68 and 140.
     The thresholds could therefore never be met, so the engaged state never
     switched on at any scroll position. Reading --stick-cmd-top / --stick-hd-top
     means the two can no longer drift apart. */
  (function () {
    var cmd = $('.cmd'); if (!cmd) return;
    var hd = $('.hd');
    var stuck = null, hdStuck = null;
    var cmdTop, hdTop;
    function readStack() { cmdTop = cssPx('--stick-bar', 68); hdTop = cmdTop + cssPx('--stick-cmd', 72); }
    var app = document.getElementById('app');
    function onScroll() {
      var s = window.scrollY > 0 && cmd.getBoundingClientRect().top <= cmdTop + 0.5;
      // the platform bar cannot see the command band in the selector tree — they
      // are siblings — so the engaged state is published on the shell as well,
      // which is what lets the bar square the two corners the band parks against
      if (s !== stuck) { stuck = s; cmd.classList.toggle('cmd--stuck', s); app.classList.toggle('is-stuck', s); }
      if (hd) {
        var h = window.scrollY > 0 && hd.getBoundingClientRect().top <= hdTop + 0.5;
        if (h !== hdStuck) { hdStuck = h; hd.classList.toggle('hd--stuck', h); }
      }
    }
    readStack();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { readStack(); onScroll(); applyCols(); });
    onScroll();
  })();

  (function () { var n = $('#scope-n'); if (n) { var v = n.textContent; n.textContent = '0'; requestAnimationFrame(function () { countTo(n, v); }); } })();

  window.G8demo = { showVehicle: showVehicle, closeVehicle: closeVehicle, showFilters: showFilters, closeDock: closeDock, S: S, V: V };
})();
