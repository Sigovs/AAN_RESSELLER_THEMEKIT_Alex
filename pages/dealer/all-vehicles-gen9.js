/* Gen 9 — behaviour. Functional and content parity with Gen 8 (every control, label, filter, sort, view,
   state and review hash), presented through one persistent context plane with three modes.
   DEMO data, marked in the UI: facet counts, trim/dealer/option facets, market figures, recently listed, history. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (id) { return '<svg class="i"><use href="#' + id + '"/></svg>'; };
  var nf = function (n) { return Number(n).toLocaleString('en-US'); };
  var V = window.G9 || [];
  V.forEach(function (v, i) { v.id = 'v' + i; });

  var TONE = { 'Feed off': 'danger', 'Hidden': 'slate', 'Pending': 'violet' };
  var ATTN = { no_price: 'No price', no_photos: 'No photos', feed_off: 'Feed off', hidden: 'Hidden', aging: 'Aging > 1 yr', pending: 'Pending' };
  var AGE = { fresh: '≤ 30 days', mid: '31–90 days', late: '91–365 days', stale: 'Over 1 year' };
  var COL = { fresh: 'var(--age-fresh)', mid: 'var(--age-mid)', late: 'var(--age-late)', stale: 'var(--age-stale)' };
  var LOT_AGE = [['fresh', 73, '≤ 30 days', '20%'], ['mid', 115, '31–90 days', '32%'], ['late', 131, '91–365 days', '36%'], ['stale', 40, 'Over 1 year', '11%']];
  var LOT_ATTN = [['no_price', 133, 'No price', '37%', ''], ['no_photos', 95, 'No photos', '26%', ''], ['feed_off', 67, 'Feed excluded', '19%', 'danger'], ['hidden', 61, 'Hidden on site', '17%', 'slate'], ['aging', 40, 'Aging over 1 year', '11%', 'danger'], ['pending', 49, 'Sale pending', '14%', 'violet']];

  /* ── demo facet counts for the Available lane (359) ─────────────────── */
  var MAKES = [['Porsche', 54, 186400], ['Ford', 47, 63900], ['Ferrari', 42, 412000], ['Lamborghini', 27, 338500], ['McLaren', 20, 241000], ['Mercedes-Benz', 20, 118700], ['Chevrolet', 16, 96800], ['Dodge', 12, 88200], ['Land Rover', 12, 104300], ['Audi', 11, 71500], ['BMW', 9, 69900], ['Bentley', 5, 152000], ['Kenworth', 4, 96400], ['Peterbilt', 4, 51300], ['Aston Martin', 3, 187000], ['Rolls-Royce', 3, 356000], ['Jensen', 2, 94000], ['Toyota', 2, 108000], ['Chaparral', 1, 42800], ['Honda', 1, 18900], ['Kia', 1, null], ['Terex', 1, null], ['SUNDOWNER', 1, null]];
  var G = {
    model: [['911', 'Porsche 911', 31], ['mustang', 'Ford Mustang', 26], ['huracan', 'Lamborghini Huracán', 14], ['gclass', 'Mercedes-Benz G-Class', 11], ['812', 'Ferrari 812', 9], ['cgt', 'Porsche Carrera GT', 6]],
    trim: [['base', 'Base / not recorded', 86], ['s', 'S · Sport', 41], ['gt', 'GT · GTS', 37], ['turbo', 'Turbo · Turbo S', 29], ['open', 'Convertible · Spider', 33], ['other', 'Other trims', 133]],
    year: [['2020s', '2020 – 2027', 96], ['2010s', '2010 – 2019', 118], ['2000s', '2000 – 2009', 61], ['1990s', '1990 – 1999', 43], ['1980s', '1980 – 1989', 17], ['1970s', '1970 – 1979', 11], ['pre70', 'Before 1970', 13]],
    price: [['none', 'No price', 133], ['lt25', 'Under $25K', 14], ['25-50', '$25K – 50K', 28], ['50-100', '$50K – 100K', 38], ['100-250', '$100K – 250K', 88], ['250+', '$250K and up', 58]],
    mile: [['lt1k', 'Under 1,000 mi', 58], ['1-10k', '1,000 – 10,000 mi', 97], ['10-50k', '10,000 – 50,000 mi', 104], ['50-100k', '50,000 – 100,000 mi', 49], ['100k+', 'Over 100,000 mi', 22], ['nr', 'Not recorded', 29]],
    loc: [['cmc', 'Chicago Motor Cars', 214], ['nap', 'CMC · Naperville', 52], ['kc', 'CMC · KC', 38], ['sc', 'CMC · SC', 27], ['diesel', 'CMS Diesel', 19], ['boats', 'Boats', 9]],
    dealer: [['grp', 'Chicago Motor Cars group', 331], ['diesel', 'CMS Diesel', 19], ['boats', 'CMC Boats', 9]],
    type: [['used', 'Used', 331], ['new', 'New', 28]],
    merch: [['shown', 'Shown on site', 298], ['hidden', 'Hidden on site', 61], ['feeding', 'Feeding to partners', 292], ['feedoff', 'Excluded from feeds', 67], ['pending', 'Sale pending', 49]],
    opt: [['awd', 'All-wheel drive', 88], ['manual', 'Manual transmission', 64], ['open', 'Convertible / open top', 52], ['ccb', 'Carbon-ceramic brakes', 23], ['diesel', 'Diesel engine', 21]]
  };
  var COLORS = [['Black', '#1c1d21', 71], ['White', '#eeeeec', 64], ['Silver', '#b7bbc1', 46], ['Red', '#b3261e', 41], ['Grey', '#6b6f76', 38], ['Blue', '#2a5db8', 33], ['Green', '#2f6b47', 22], ['Yellow', '#e3b21b', 14], ['Orange', '#e8721c', 11], ['Other', 'conic-gradient(#e35548, #f2a12b, #2fb46f, #1f5fe0, #8f78ea, #e35548)', 19]];
  var GL = { make: 'Make', model: 'Model', trim: 'Trim', year: 'Year', price: 'Price', mile: 'Mileage', loc: 'Location', dealer: 'Dealer', type: 'Type', merch: 'Merchandising', color: 'Colour', opt: 'Options' };
  var DOCK_ONLY = ['model', 'trim', 'mile', 'loc', 'dealer', 'type', 'merch', 'color', 'opt'];
  var BASE = { Kia: 14500, Terex: 38500, SUNDOWNER: 52000, Porsche: 180000, Dodge: 92000, Ford: 58000 };
  var STATES = ['IL', 'WI', 'IN', 'MI', 'OH', 'MO', 'MN', 'IA', 'KY'];
  var NO_MILES = { Chaparral: 1, SUNDOWNER: 1, Terex: 1 };
  var VARIANTS = ['', 'Premium', 'Launch Edition', 'Sport', 'Touring', 'Limited'];

  var S = {
    mode: 'lot', prev: 'lot', cur: null, sort: 'days', dir: 'desc', attn: {}, age: null, sel: {}, lane: 'Available', fq: '', allMakes: false,
    f: { make: {}, model: {}, trim: {}, year: {}, price: {}, mile: {}, loc: {}, dealer: {}, type: {}, merch: {}, color: {}, opt: {} },
    acc: { market: true, health: false, spec: false, hist: false, 'f-make': true, 'f-price': true, 'f-year': false, 'f-model': false, 'f-trim': false, 'f-mile': false, 'f-loc': false, 'f-dealer': false, 'f-type': false, 'f-merch': false, 'f-color': false, 'f-opt': false, 'f-audit': false }
  };

  function band(d) { return d <= 30 ? 'fresh' : d <= 90 ? 'mid' : d <= 365 ? 'late' : 'stale'; }
  function lab(d) { return d > 365 ? (d / 365).toFixed(1) + 'y' : d + 'd'; }
  function fmt(n) { return n == null ? null : '$' + nf(n); }
  function k(n) { return n >= 1e6 ? '$' + (n / 1e6).toFixed(2) + 'M' : '$' + (n >= 1e5 ? Math.round(n / 1000) : (n / 1000).toFixed(1)) + 'K'; }
  function priceB(p) { return p == null ? 'none' : p < 25000 ? 'lt25' : p < 50000 ? '25-50' : p < 100000 ? '50-100' : p < 250000 ? '100-250' : '250+'; }
  function yearB(y) { return y >= 2020 ? '2020s' : y >= 2010 ? '2010s' : y >= 2000 ? '2000s' : y >= 1990 ? '1990s' : y >= 1980 ? '1980s' : y >= 1970 ? '1970s' : 'pre70'; }
  function sel(g) { return Object.keys(S.f[g]).filter(function (x) { return S.f[g][x]; }); }
  function nSel(groups) { return (groups || Object.keys(S.f)).reduce(function (n, g) { return n + sel(g).length; }, 0); }
  function attnOn() { return Object.keys(S.attn).some(function (x) { return S.attn[x]; }); }
  function filtered() { return nSel() > 0 || !!S.age || attnOn(); }
  function labelOf(g, key) { if (g === 'make' || g === 'color') return key; var h = (G[g] || []).filter(function (x) { return x[0] === key; })[0]; return h ? h[1] : key; }
  function byId(id) { return V.filter(function (x) { return x.id === id; })[0]; }

  function list() {
    var mk = sel('make'), yb = sel('year'), pb = sel('price');
    return V.filter(function (v) {
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
      else if (s === 'price') { x = a.p == null ? -1 : a.p; y = b.p == null ? -1 : b.p; }
      else { x = a.d; y = b.d; }
      return (x > y ? 1 : x < y ? -1 : 0) * d;
    });
  }

  /* ── rows ─────────────────────────────────────────────────────────── */
  function tag(t) { return '<span class="tag' + (TONE[t] ? ' tag--' + TONE[t] : '') + '">' + esc(t) + '</span>'; }
  function row(v) {
    var b = band(v.d), max = v.f.length > 3 ? 2 : 3, tags = v.f.slice(0, max), rest = v.f.length - tags.length, name = v.y + ' ' + v.mk + ' ' + v.md;
    return '<div class="vrow' + (S.sel[v.id] ? ' sel' : '') + (S.mode === 'vehicle' && S.cur === v.id ? ' open' : '') + '" data-id="' + v.id + '" tabindex="0" aria-label="' + esc(name) + '">' +
      '<input class="ck" type="checkbox" data-sel="' + v.id + '"' + (S.sel[v.id] ? ' checked' : '') + ' aria-label="Select ' + esc(name) + '">' +
      (v.t ? '<img class="th" alt="" src="img/' + esc(v.t) + '">' : '<span class="th th--none" title="No photos uploaded">' + ic('i-cam-off') + '</span>') +
      '<div class="id"><span class="id__n" title="' + esc(name) + '"><em>' + v.y + '</em>' + esc(v.mk) + ' ' + esc(v.md) + '</span><span class="id__m"><span class="idtag">' + esc(v.s) + '</span>' + (v.lock ? '<span class="lock" title="Being edited by another user">' + ic('i-lock') + '</span>' : '') + '<span class="id__vin">' + esc(v.vin) + '</span></span></div>' +
      '<div class="spec"><span class="spec__t" title="' + esc(v.tr) + '">' + (v.tr ? esc(v.tr) : '<i>No trim recorded</i>') + '</span><span class="spec__c"><span class="sw" style="--c:' + v.hx + '"></span>' + esc(v.c) + '</span></div>' +
      (v.p != null ? '<div class="price"><em>$</em>' + nf(v.p) + '</div>' : '<div class="price price--none" aria-label="No price">—</div>') +
      '<div class="age age--' + b + '" title="' + nf(v.d) + ' days in stock">' + lab(v.d) + '<i style="--w:' + Math.min(100, Math.round(v.d / 730 * 100)) + '%;--b:' + COL[b] + '"></i></div>' +
      '<div class="tags">' + tags.map(tag).join('') + (rest > 0 ? '<span class="tag tag--more" title="' + esc(v.f.slice(tags.length).join(' · ')) + '">+' + rest + '</span>' : '') + '</div>' +
      '<span class="acts"><button type="button" aria-label="Edit vehicle" data-stop>' + ic('i-edit') + '</button><button type="button" aria-label="Photos" data-stop>' + ic('i-cam') + '</button><button type="button" aria-label="Window sticker" data-stop>' + ic('i-print') + '</button><button type="button" aria-label="More" data-stop>' + ic('i-more') + '</button></span>' +
      '</div>';
  }

  function render() {
    var L = list(), F = filtered(), total = F ? L.length : 359;
    $('#tb').innerHTML = L.length ? L.map(row).join('') : '<div class="empty">No vehicles match these filters.<button type="button" data-act="clear-all">Clear all</button></div>';
    $('#shown').textContent = (L.length ? '1–' + L.length : '0') + ' of ' + total;

    var chips = [];
    if (S.age) chips.push({ cls: 'chip--attn', v: 'Age ' + AGE[S.age], off: function () { setAge(null); } });
    Object.keys(S.f).forEach(function (g) {
      sel(g).forEach(function (key) { chips.push({ cls: '', v: (g === 'make' ? '' : GL[g] + ': ') + labelOf(g, key), off: function () { S.f[g][key] = false; if (g === 'make') renderMakes(); } }); });
    });
    $('#chips').innerHTML = chips.map(function (c, i) { return '<span class="chip ' + c.cls + '">' + esc(c.v) + '<button class="chip__x" type="button" data-chip="' + i + '" aria-label="Remove ' + esc(c.v) + '">' + ic('i-x') + '</button></span>'; }).join('') + (F ? '<button class="clearall" type="button" data-act="clear-all">Clear all</button>' : '');
    $('#chips')._chips = chips;
    $$('.lens[data-attn]').forEach(function (b) { b.setAttribute('aria-pressed', !!S.attn[b.dataset.attn]); });
    var na = Object.keys(S.attn).filter(function (a) { return S.attn[a]; }).length;
    $('#attn-cnt').hidden = !na; $('#attn-cnt').textContent = na;
    $('[data-pop="p-attn"]').classList.toggle('fbtn--on', na > 0);

    var mk = sel('make'), yb = sel('year'), pb = sel('price');
    $('#make-v').textContent = !mk.length ? 'Any' : mk.length === 1 ? mk[0] : mk[0] + ' +' + (mk.length - 1);
    $('#year-v').textContent = !yb.length ? 'Any' : yb.length === 1 ? labelOf('year', yb[0]) : yb.length + ' ranges';
    $('#price-v').textContent = !pb.length ? 'Any' : pb.length === 1 ? labelOf('price', pb[0]) : pb.length + ' ranges';
    $('[data-pop="p-make"]').classList.toggle('fbtn--on', mk.length > 0);
    $('[data-pop="p-year"]').classList.toggle('fbtn--on', yb.length > 0);
    $('[data-pop="p-price"]').classList.toggle('fbtn--on', pb.length > 0);
    $$('[data-fk]').forEach(function (b) { var p = b.dataset.fk.split(':'); var on = !!S.f[p[0]][p[1]]; b.classList.toggle('on', on); if (b.closest('.pop__quick, .sws')) b.setAttribute('aria-pressed', on); });
    var nd = nSel(DOCK_ONLY), na = nSel();
    $('#fcnt').hidden = !nd; $('#fcnt').textContent = nd;
    $('#mode-fn').hidden = !na; $('#mode-fn').textContent = na;
    $$('#p-sort [data-sort]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.sort === S.sort); });
    $$('#p-sort [data-dir]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.dir === S.dir); });
    $('#sort-v').textContent = ({ days: 'Age', price: 'Price', stock: 'Stock', year: 'Year', make: 'Make', issues: 'Attention' })[S.sort] + (S.dir === 'asc' ? ' ↑' : ' ↓');
    var n = Object.keys(S.sel).filter(function (x) { return S.sel[x]; }).length;
    $('#tray').classList.toggle('tray--on', n > 0); $('#tray-n').textContent = n;

    if (S.mode === 'lot') renderLot();
    if (S.mode === 'filters') renderFilters();
    if (S.mode === 'vehicle') { var v = byId(S.cur), i = L.indexOf(v); $('#ctx-c').textContent = i >= 0 ? (i + 1) + ' of ' + L.length : 'not in current filter'; }
  }
  function renderMakes() {
    $('#make-list').innerHTML = MAKES.map(function (m) { return '<label class="pop__it"><input class="ck" type="checkbox" data-f="make" data-k="' + esc(m[0]) + '"' + (S.f.make[m[0]] ? ' checked' : '') + '><span>' + esc(m[0]) + '</span><span class="c">' + m[1] + '</span></label>'; }).join('');
  }
  function setAttn(a, on) { S.attn[a] = on; render(); }
  function setAge(b) { S.age = b; render(); }
  function setLane(l) {
    S.lane = l;
    $$('[data-lane]').forEach(function (b) { var on = b.dataset.lane === l; b.classList.toggle('lane--on', on); b.setAttribute('aria-pressed', on); });
    render();
  }
  function tog(g, key, on) {
    S.f[g][key] = on === undefined ? !S.f[g][key] : on;
    if (g === 'make') renderMakes();
    render();
    var el = $('#ctx-b [data-f="' + g + '"][data-k="' + key + '"], #ctx-b [data-fk="' + g + ':' + key + '"]');
    if (el && document.activeElement === document.body) el.focus({ preventScroll: true });
  }

  /* ── context plane: modes ─────────────────────────────────────────── */
  function setMode(m) {
    if (m === 'vehicle' && !byId(S.cur)) m = 'lot';
    if (m !== S.mode && S.mode !== 'filters') S.prev = S.mode;
    S.mode = m;
    $('#app').setAttribute('data-mode', m);
    $$('.mode[data-mode]').forEach(function (b) { var on = b.dataset.mode === m; b.classList.toggle('mode--on', on); b.setAttribute('aria-selected', on); });
    $('.mode[data-mode="vehicle"]').disabled = !byId(S.cur);
    $('#ctx-nav').hidden = m !== 'vehicle';
    $('.ctxp__x').hidden = m === 'lot';
    $('[data-act="filters"]').classList.toggle('fbtn--on', m === 'filters');
    var b = $('#ctx-b'), f = $('#ctx-f');
    b.scrollTop = 0; f.className = 'ctxp__f'; f.innerHTML = '';
    if (m === 'vehicle') { var v = byId(S.cur); b.innerHTML = vehicleBody(v); f.innerHTML = vehicleFoot(v); }
    render();
  }
  function showVehicle(id) {
    if (!byId(id)) return;
    S.cur = id; setMode('vehicle');
    var r = $('.vrow[data-id="' + id + '"]'); if (r) r.scrollIntoView({ block: 'nearest' });
  }

  function renderLot() {
    var b = $('#ctx-b'), st = b.scrollTop, mx = 131;
    b.innerHTML =
      '<section class="mod anchor" aria-label="Lot"><div class="mod__h"><span class="eyebrow">Lot</span><span class="mod__m">6 rooftops</span></div>' +
        '<div class="anchor__top"><div class="anchor__hero"><div class="anchor__n">' + $('.lane--on b').textContent + '</div><div class="anchor__l"><b>' + (S.lane === 'All' ? 'All on file' : esc(S.lane)) + '</b>of 13,587 on file</div></div>' + ring(146 / 359, '41%', '146 over $100K') + '</div>' +
        '<div class="anchor__kv anchor__kv--2"><div><div class="v" title="$66,311,600">$66.3M</div><div class="l">asking value</div></div><div><div class="v" title="$293,414">$293K</div><div class="l">average</div></div></div></section>' +
      '<section class="mod" aria-label="Age mix"><div class="mod__h"><span class="mod__t">Age mix <span class="mod__m">· days in stock</span></span><span class="mod__m"><a href="#">Aging report</a></span></div>' +
        '<div class="agebars">' + LOT_AGE.map(function (a) { return '<button type="button" class="agebar' + (S.age === a[0] ? ' on' : '') + '" data-age="' + a[0] + '" aria-pressed="' + (S.age === a[0]) + '" aria-label="' + a[1] + ' vehicles ' + a[2] + '"><b>' + a[1] + '</b><i style="--h:' + Math.round(a[1] / mx * 100) + '%;--c:' + COL[a[0]] + '"></i></button>'; }).join('') + '</div>' +
        '<div class="agelabs">' + LOT_AGE.map(function (a) { return '<span>' + a[2] + '<i>' + a[3] + '</i></span>'; }).join('') + '</div></section>' +
      '<section class="mod" aria-label="Needs attention"><div class="mod__h"><span class="mod__t">Needs attention</span><span class="mod__m">tap to filter</span></div>' +
        LOT_ATTN.map(function (a) { var on = !!S.attn[a[0]]; return '<button type="button" class="q' + (a[4] ? ' q--' + a[4] : '') + (on ? ' q--on' : '') + '" data-attn="' + a[0] + '" aria-pressed="' + on + '"><span class="q__n">' + a[1] + '</span><span class="q__b"><span class="q__l">' + a[2] + '</span><span class="q__m"><i style="--w:' + a[3] + '"></i></span></span><span class="q__p">' + a[3] + '</span></button>'; }).join('') + '</section>';
    b.scrollTop = st;
  }

  /* ── demo market model: deterministic per stock number ────────────── */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var s = seed || 1; return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
  function r100(n) { return Math.round(n / 100) * 100; }
  function market(v) {
    var r = rng(hash(v.s)), base = v.p != null ? v.p : (BASE[v.mk] || 60000), i;
    var med = r100(base * (v.p != null ? 0.9 + r() * 0.24 : 0.94 + r() * 0.12));
    var lo = r100(med * (0.8 + r() * 0.06)), hi = r100(med * (1.15 + r() * 0.08));
    var m = { med: med, lo: lo, hi: hi, n: 7 + Math.floor(r() * 26), dts: 19 + Math.floor(r() * 64), wk: 1 + Math.floor(r() * 5), min: med * 0.55, max: med * 1.45, bins: [], comps: [] };
    for (i = 0; i < 22; i++) { var x = (i - 10.5) / 7.8; m.bins.push(0.08 + Math.exp(-x * x) * (0.55 + r() * 0.45)); }
    for (i = 0; i < 5; i++) {
      m.comps.push({ y: Math.min(2026, v.y + Math.round((r() - 0.5) * 4)), p: r100(med * (0.86 + r() * 0.28)), mi: NO_MILES[v.mk] ? null : Math.round((1500 + r() * 60000) / 100) * 100, ago: Math.floor(r() * 12), dist: 14 + Math.floor(r() * 600), st: STATES[Math.floor(r() * STATES.length)], vr: VARIANTS[Math.floor(r() * VARIANTS.length)] });
    }
    m.comps.sort(function (a, b) { return a.ago - b.ago; });
    return m;
  }
  function when(d) { return d === 0 ? 'Today' : d === 1 ? '1 day ago' : d + ' days ago'; }

  /* ── embedded charts (SVG, no library) ────────────────────────────── */
  var UID = 0;
  function smooth(p) {
    var d = 'M' + p[0][0].toFixed(1) + ',' + p[0][1].toFixed(1);
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ',' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ',' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d;
  }
  function ring(frac, center, caption) {
    var r = 34, c = 2 * Math.PI * r, ang = frac * 2 * Math.PI - Math.PI / 2;
    return '<div class="ring" role="img" aria-label="' + esc(caption) + ', ' + esc(center) + ' of the lane"><svg viewBox="0 0 88 88" aria-hidden="true"><circle class="ring__t" cx="44" cy="44" r="' + r + '"/><circle class="ring__a" cx="44" cy="44" r="' + r + '" stroke-dasharray="' + (frac * c).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 44 44)"/><circle class="ring__e" cx="' + (44 + r * Math.cos(ang)).toFixed(1) + '" cy="' + (44 + r * Math.sin(ang)).toFixed(1) + '" r="4.5"/></svg><b>' + center + '</b><span>' + caption + '</span></div>';
  }
  function grad(id) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--chart);stop-opacity:.40"/><stop offset="1" style="stop-color:var(--chart);stop-opacity:0"/></linearGradient>'; }
  /* market: smooth density curve · typical range on the baseline · median and your price on the curve */
  function densityChart(m, v) {
    var W = 360, H = 124, top = 40, base = 100, n = m.bins.length, span = m.max - m.min, mx = Math.max.apply(null, m.bins), id = 'g9d' + (++UID);
    var X = function (x) { return Math.max(6, Math.min(W - 6, (x - m.min) / span * W)); };
    var pts = [[0, base]].concat(m.bins.map(function (b, i) { return [(i + 0.5) / n * W, base - b / mx * (base - top)]; })).concat([[W, base]]);
    var yAt = function (x) { for (var i = 0; i < pts.length - 1; i++) if (x >= pts[i][0] && x <= pts[i + 1][0]) { var t = (x - pts[i][0]) / ((pts[i + 1][0] - pts[i][0]) || 1); return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t; } return base; };
    var line = smooth(pts), area = line + ' L' + W + ',' + base + ' L0,' + base + ' Z', lo = X(m.lo), hi = X(m.hi), md = X(m.med), yp = v.p != null ? X(v.p) : null;
    var svg = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true"><defs>' + grad(id) + '<clipPath id="' + id + 'c"><rect x="' + lo.toFixed(1) + '" y="0" width="' + (hi - lo).toFixed(1) + '" height="' + H + '"/></clipPath></defs>' +
      '<path class="c-muted" d="' + area + '"/><path d="' + area + '" fill="url(#' + id + ')" clip-path="url(#' + id + 'c)"/><path class="c-line" d="' + line + '"/>' +
      '<line class="c-base" x1="0" x2="' + W + '" y1="' + base + '" y2="' + base + '"/>' +
      '<line class="c-range" x1="' + lo.toFixed(1) + '" x2="' + hi.toFixed(1) + '" y1="' + (base + 13) + '" y2="' + (base + 13) + '"/><circle class="c-knob" cx="' + lo.toFixed(1) + '" cy="' + (base + 13) + '" r="6"/><circle class="c-knob" cx="' + hi.toFixed(1) + '" cy="' + (base + 13) + '" r="6"/>' +
      '<line class="c-med" x1="' + md.toFixed(1) + '" x2="' + md.toFixed(1) + '" y1="26" y2="' + base + '"/><circle class="c-dot c-dot--med" cx="' + md.toFixed(1) + '" cy="' + yAt(md).toFixed(1) + '" r="5"/>' +
      (yp != null ? '<line class="c-you" x1="' + yp.toFixed(1) + '" x2="' + yp.toFixed(1) + '" y1="26" y2="' + base + '"/><circle class="c-dot" cx="' + yp.toFixed(1) + '" cy="' + yAt(yp).toFixed(1) + '" r="6"/>' : '') + '</svg>';
    var pc = function (x) { return (x / W * 100).toFixed(1) + '%'; };
    var youLeft = yp != null && (yp < md);
    var side = function (x, wantLeft) { return x / W < 0.22 ? 'r' : x / W > 0.78 ? 'l' : wantLeft ? 'l' : 'r'; };
    /* when the two prices sit close together the labels would collide — drop "You" to a second row */
    var near = yp != null && Math.abs(yp - md) / W < 0.34;
    var chips = '<span class="cchip cchip--med cchip--' + side(md, yp != null && !youLeft) + '" style="left:' + pc(md) + '">Median ' + k(m.med) + '</span>' +
      (yp != null ? '<span class="cchip cchip--' + side(yp, youLeft) + (near ? ' cchip--lower' : '') + '" style="left:' + pc(yp) + '">You ' + k(v.p) + '</span>' : '');
    return '<div class="chartwrap">' + svg + chips + '</div>';
  }
  /* recently listed: asking prices of the latest comparable listings, oldest → newest, against your price */
  function rlChart(comps, v) {
    var W = 360, H = 92, cs = comps.slice().sort(function (a, b) { return b.ago - a.ago; }), vals = cs.map(function (c) { return c.p; }).concat(v.p != null ? [v.p] : []);
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), sp = (mx - mn) || 1, id = 'g9r' + (++UID);
    var Y = function (p) { return H - 14 - (p - mn) / sp * (H - 46); }, X = function (i) { return 14 + i / (cs.length - 1) * (W - 28); };
    var pts = cs.map(function (c, i) { return [X(i), Y(c.p)]; }), line = smooth(pts), last = pts[pts.length - 1];
    var area = line + ' L' + last[0].toFixed(1) + ',' + (H - 4) + ' L' + pts[0][0].toFixed(1) + ',' + (H - 4) + ' Z';
    var svg = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true"><defs>' + grad(id) + '</defs><path d="' + area + '" fill="url(#' + id + ')"/>' +
      (v.p != null ? '<line class="c-you" x1="0" x2="' + W + '" y1="' + Y(v.p).toFixed(1) + '" y2="' + Y(v.p).toFixed(1) + '"/>' : '') +
      '<path class="c-line" d="' + line + '"/>' + pts.map(function (p, i) { var l = i === pts.length - 1; return '<circle class="c-pt' + (l ? ' c-pt--last' : '') + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (l ? 6 : 4) + '"/>'; }).join('') + '</svg>';
    var newest = cs[cs.length - 1];
    return '<div class="chartwrap">' + svg + '<span class="cchip cchip--med cchip--l" style="left:' + (last[0] / W * 100).toFixed(1) + '%">' + when(newest.ago) + ' ' + k(newest.p) + '</span>' +
      (v.p != null ? '<span class="cchip cchip--soft cchip--r" style="left:3%">You ' + k(v.p) + '</span>' : '') + '</div>';
  }
  function rangeSlider(g, rows) {
    var n = rows.length, on = rows.map(function (r, i) { return S.f[g][r[0]] ? i : -1; }).filter(function (i) { return i >= 0; });
    var a = on.length ? Math.min.apply(null, on) : 0, b = on.length ? Math.max.apply(null, on) : n - 1, L = a / n * 100, R = (b + 1) / n * 100;
    return '<div class="range" aria-hidden="true"><span class="range__track"></span><span class="range__fill" style="left:' + L.toFixed(1) + '%;right:' + (100 - R).toFixed(1) + '%"></span><span class="range__knob" style="left:' + L.toFixed(1) + '%"></span><span class="range__knob" style="left:' + R.toFixed(1) + '%"></span></div>';
  }
  function toggleList(g, rows) {
    return '<div class="fvs">' + rows.map(function (x) { var on = !!S.f[g][x[0]]; return '<label class="fv fv--toggle' + (on ? ' fv--on' : '') + '"><span class="fv__n"><span class="fv__l">' + esc(x[1]) + '</span></span><span class="fv__c">' + nf(x[2]) + '</span><input class="tg" type="checkbox" data-f="' + g + '" data-k="' + x[0] + '"' + (on ? ' checked' : '') + ' aria-label="' + esc(x[1]) + '"></label>'; }).join('') + '</div>';
  }
  function spark(vals) {
    var w = 120, h = 26, mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), span = mx - mn || 1;
    var pts = vals.map(function (v, i) { return [Math.round(i / (vals.length - 1) * w), Math.round(h - 3 - (v - mn) / span * (h - 6))]; });
    var last = pts[pts.length - 1];
    return '<svg viewBox="-4 -2 ' + (w + 8) + ' ' + (h + 4) + '" aria-hidden="true"><polyline points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>' +
      pts.map(function (p, i) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === pts.length - 1 ? 3.6 : 2.6) + '" fill="' + (i === pts.length - 1 ? 'currentColor' : 'var(--surface)') + '" stroke="currentColor" stroke-width="1.6"/>'; }).join('') + '</svg>';
  }

  /* ── accordion ────────────────────────────────────────────────────── */
  function acc(key, title, summary, inner, extra, cls) {
    var o = !!S.acc[key];
    return '<section class="acc' + (cls ? ' ' + cls : '') + (o ? ' acc--open' : '') + '" data-acc="' + key + '"><h3><button class="acc__h" type="button" aria-expanded="' + o + '" aria-controls="acc-' + key + '"><span class="acc__t">' + title + '</span>' + (extra || '') + '<span class="acc__s">' + summary + '</span><span class="chev">' + ic('i-chev') + '</span></button></h3>' +
      '<div class="acc__p" id="acc-' + key + '"' + (o ? '' : ' inert') + '><div><div class="acc__in">' + inner + '</div></div></div></section>';
  }
  function setAccOpen(sec, open) {
    sec.classList.toggle('acc--open', open);
    var bt = $('.acc__h', sec), p = $('.acc__p', sec);
    if (bt) bt.setAttribute('aria-expanded', open);
    if (p) { if (open) p.removeAttribute('inert'); else p.setAttribute('inert', ''); }
  }

  /* ── vehicle ──────────────────────────────────────────────────────── */
  function vehicleBody(v) {
    var b = band(v.d), has = function (t) { return v.f.indexOf(t) >= 0; }, m = market(v), name = v.y + ' ' + v.mk + ' ' + v.md;
    var H = [
      has('No price') ? ['bad', 'i-alert', 'No asking price'] : ['ok', 'i-check', 'Priced'],
      has('No photos') ? ['bad', 'i-alert', 'No photos'] : ['ok', 'i-check', nf(v.ph || 0) + ' photos'],
      has('Feed off') ? ['red', 'i-x', 'Excluded from feeds'] : ['ok', 'i-check', 'Feeding to partners'],
      has('Hidden') ? ['bad', 'i-alert', 'Hidden on site'] : ['ok', 'i-check', 'Shown on site'],
      ['ok', 'i-check', 'VIN decoded'],
      has('Pending') ? ['vio', 'i-clock', 'Sale pending'] : ['ok', 'i-check', 'No pending sale']
    ];
    var issues = H.filter(function (h) { return h[0] !== 'ok'; }).length;
    var healthSum = issues ? '<span class="' + (has('Feed off') ? 'red' : 'bad') + '">' + issues + ' of 6 need work</span>' : '<span class="good">All clear</span>';

    /* market position + distribution */
    var span = m.max - m.min, pos = function (x) { return Math.max(0, Math.min(100, (x - m.min) / span * 100)); }, bx = Math.max.apply(null, m.bins);
    var youBin = v.p != null ? Math.floor(pos(v.p) / 100 * m.bins.length) : -1;
    var bars = m.bins.map(function (h, i) { var mid = m.min + span * (i + 0.5) / m.bins.length; return '<i class="' + (mid >= m.lo && mid <= m.hi ? 'in' : '') + (i === youBin ? ' here' : '') + '" style="height:' + Math.max(6, Math.round(h / bx * 100)) + '%"></i>'; }).join('');
    var d = v.p != null ? (v.p - m.med) / m.med : 0, flat = Math.abs(d) < 0.03;
    var deltaTxt = flat ? 'At market' : (Math.abs(d) * 100).toFixed(1) + '% ' + (d < 0 ? 'below' : 'above');
    var mktSum = v.p != null ? '<span class="' + (flat ? '' : d < 0 ? 'good' : 'bad') + '">' + deltaTxt + (flat ? '' : ' market') + '</span>' : '<span class="bad">Suggested ' + k(m.med) + '</span>';
    var pY = v.p != null ? pos(v.p) : null, pM = pos(m.med), close = pY != null && Math.abs(pY - pM) < 22;
    var edge = function (p) { return p < 9 ? ' pos__lab--edge-l' : p > 91 ? ' pos__lab--edge-r' : ''; };
    var posHtml = '<div class="pos" aria-hidden="true"><span class="pos__track"></span><span class="pos__band" style="left:' + pos(m.lo).toFixed(1) + '%;right:' + (100 - pos(m.hi)).toFixed(1) + '%"></span>' +
      '<span class="pos__med" style="left:' + pM.toFixed(1) + '%"></span><span class="pos__lab pos__lab--med' + (close ? ' pos__lab--b' : '') + edge(pM) + '" style="left:' + pM.toFixed(1) + '%">Median</span>' +
      (pY != null ? '<span class="pos__you" style="left:' + pY.toFixed(1) + '%"></span><span class="pos__lab' + edge(pY) + '" style="left:' + pY.toFixed(1) + '%">You</span>' : '') + '</div>';
    var comps = m.comps, sparkVals = comps.slice().reverse().map(function (c) { return c.p; });
    var rlHtml = '<div class="rl"><div class="rl__h"><span class="rl__t">Recently listed</span><span class="lanes__sp"></span><span class="spark" title="Asking prices of the latest listings, oldest to newest">' + spark(sparkVals) + '</span><span class="rl__m">5 of ' + m.n + '</span></div>' +
      comps.map(function (c) {
        var diff = v.p != null ? c.p - v.p : null;
        var spec = [c.vr || v.tr || 'Base', c.mi != null ? nf(c.mi) + ' mi' : null, c.dist + ' mi away, ' + c.st].filter(Boolean).join(' · ');
        return '<div class="rl__it">' + (v.t ? '<img class="rl__th" alt="" src="img/' + esc(v.t) + '">' : '<span class="rl__th"></span>') + '<b>' + c.y + ' ' + esc(v.mk) + ' ' + esc(v.md) + '</b><span class="rl__p">' + fmt(c.p) + '</span>' +
          '<span class="rl__s" title="' + esc(spec) + '">' + when(c.ago) + ' · ' + esc(spec) + '</span>' +
          (diff != null ? '<span class="rl__d ' + (diff >= 0 ? 'up' : 'dn') + '" title="Compared with your asking price">' + (diff >= 0 ? '+' : '−') + k(Math.abs(diff)) + ' vs yours</span>' : '<span class="rl__d new">' + (c.ago <= 1 ? 'New' : '') + '</span>') + '</div>';
      }).join('') + '<button class="linkbtn" type="button">All ' + m.n + ' comparable listings' + ic('i-right') + '</button></div>';
    var mktIn =
      '<div class="mk__row">' +
        (v.p != null ? '<div><div class="mk__v">' + fmt(v.p) + '</div><div class="mk__l">Your asking price</div></div>' : '<div><div class="mk__v warn">No price</div><div class="mk__l">Your asking price</div></div>') +
        '<div><div class="mk__v">' + fmt(m.med) + '</div><div class="mk__l">Market median</div></div>' +
        (v.p != null ? '<span class="delta' + (flat ? '' : d < 0 ? ' delta--ok' : ' delta--warn') + '">' + (flat ? '' : ic(d < 0 ? 'i-dn' : 'i-up')) + deltaTxt + '</span>' : '<span></span>') +
      '</div>' + densityChart(m, v) +
      '<div class="dist__ax"><span>Low<b>' + k(m.min) + '</b></span><span>Median<b>' + k(m.med) + '</b></span><span>High<b>' + k(m.max) + '</b></span></div>' +
      (v.p == null ? '<div class="suggest"><span>Price at the market median: <b>' + fmt(m.med) + '</b></span><button class="btn btn--lift btn--sm" type="button">Set price</button></div>' : '') +
      '<dl class="kvl"><div><dt>Typical range</dt><dd>' + k(m.lo) + ' – ' + k(m.hi) + '</dd></div><div><dt>Comparable listings</dt><dd>' + m.n + ' · last 90 days</dd></div><div><dt>Median days to sell</dt><dd>' + m.dts + ' days</dd></div><div><dt>Market supply</dt><dd>' + m.n + ' active · +' + m.wk + ' this week</dd></div><div><dt>Source</dt><dd>visor.vin market data · not connected</dd></div></dl>' +
      rlHtml;

    var sd = hash(v.s), T = [['i-edit', 'Edited by Parin', '3 days ago']];
    if (v.ph) T.push(['i-cam', 'Photos updated · ' + v.ph + ' photos', Math.min(v.d, 9) + ' days ago']);
    if (v.p != null) T.push(['i-tag', 'Asking price set to ' + fmt(v.p), Math.min(v.d, 14 + sd % 50) + ' days ago']);
    if (has('Feed off')) T.push(['i-rss', 'Excluded from partner feeds', Math.min(v.d, 60 + sd % 90) + ' days ago']);
    T.push(['i-plus', 'Added to inventory', nf(v.d) + ' days ago']);
    var histIn = '<ul class="tl">' + T.map(function (t) { return '<li><span class="tl__i">' + ic(t[0]) + '</span><span>' + esc(t[1]) + '</span><span>' + t[2] + '</span></li>'; }).join('') + '</ul>';
    var specIn = '<div class="spec2"><div><span>Trim</span><span title="' + esc(v.tr) + '">' + (esc(v.tr) || '—') + '</span></div><div><span>Exterior</span><span>' + esc(v.c) + '</span></div><div><span>Type</span><span>Used</span></div><div><span>Mileage</span><span>Not recorded</span></div><div><span>Location</span><span>Chicago Motor Cars</span></div><div><span>Stock #</span><span class="mono">' + esc(v.s) + '</span></div></div>';

    return '<div class="vhead"><div class="stage">' + (v.t ? '<img alt="' + esc(name) + '" src="img/' + esc(v.t) + '"><span class="glass">' + ic('i-cam') + nf(v.ph || 0) + ' photos</span>' : '<div class="none">' + ic('i-cam-off') + 'No photos uploaded<button class="btn btn--sm" type="button">' + ic('i-plus') + ' Upload photos</button></div>') + '</div>' +
      '<div class="ident"><h3 class="ident__n"><em>' + v.y + '</em>' + esc(v.mk) + ' ' + esc(v.md) + '</h3>' +
      '<div class="ident__m"><span><span class="id__k">STK</span> <span class="mono">' + esc(v.s) + '</span></span><span><span class="id__k">VIN</span> <span class="mono">' + esc(v.vin) + '</span></span></div>' +
      '<span class="status">Available</span>' + (v.lock ? ' <span class="lock" title="Being edited by another user">' + ic('i-lock') + '</span>' : '') + '</div></div>' +
      (v.f.length ? '<div class="ident__tags">' + v.f.map(tag).join('') + '</div>' : '') +
      '<div class="ktr"><div><div class="v' + (v.p == null ? ' warn' : '') + '">' + (v.p == null ? 'No price' : fmt(v.p)) + '</div><div class="l">asking price</div></div><div class="' + (b === 'stale' ? 'is-stale' : '') + '"><div class="v" style="color:' + (b === 'stale' ? 'var(--danger)' : b === 'fresh' ? 'var(--ok)' : 'var(--ink)') + '">' + lab(v.d) + '</div><div class="l">' + nf(v.d) + ' days</div></div><div><div class="v">' + (v.ph || 0) + '</div><div class="l">photos</div></div></div>' +
      acc('market', 'Market &amp; pricing', mktSum, mktIn, ' <span class="demo">Demo</span>', 'acc--zone') +
      acc('health', 'Merchandising health', healthSum, '<div class="health">' + H.map(function (h) { return '<div class="hl hl--' + h[0] + '"><i>' + ic(h[1]) + '</i>' + esc(h[2]) + '</div>'; }).join('') + '</div>') +
      acc('spec', 'Specification', esc(v.tr || 'No trim recorded'), specIn) +
      acc('hist', 'History', 'Edited 3 days ago', histIn, ' <span class="demo">Demo</span>');
  }
  function vehicleFoot(v) {
    var has = function (t) { return v.f.indexOf(t) >= 0; };
    return '<div class="vf"><button class="btn btn--primary btn--lg" type="button">' + ic('i-edit') + ' Edit vehicle</button>' +
      '<button class="btn btn--lift btn--lg" type="button">' + ic('i-cam') + ' Photos</button><button class="btn btn--lift btn--lg" type="button">' + ic('i-print') + ' Sticker</button>' +
      '<div class="facet"><button class="btn btn--lift btn--lg btn--icon" type="button" data-pop="p-vmore" aria-label="More actions">' + ic('i-more') + '</button>' +
      '<div class="pop pop--up pop--right mn" id="p-vmore"><button class="mn__it" type="button">' + ic('i-file') + 'Carfax report</button><button class="mn__it" type="button">' + ic('i-rss') + (has('Feed off') ? 'Include in feeds' : 'Exclude from feeds') + '</button><button class="mn__it" type="button">' + ic('i-eye') + (has('Hidden') ? 'Show on site' : 'Hide on site') + '</button><div class="mn__sep"></div><button class="mn__it mn__it--danger" type="button">' + ic('i-trash') + 'Delete vehicle…</button></div></div></div>';
  }

  /* ── filters ──────────────────────────────────────────────────────── */
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
  function hist(g, rows, sig, ax) {
    var max = Math.max.apply(null, rows.map(function (x) { return x[2]; }));
    return '<div class="hist" aria-hidden="true">' + rows.map(function (x) { return '<button type="button" tabindex="-1" class="' + (sig && x[0] === sig ? 'sig' : '') + (S.f[g][x[0]] ? ' on' : '') + '" data-fk="' + g + ':' + x[0] + '" style="height:' + Math.max(8, Math.round(x[2] / max * 100)) + '%" title="' + esc(x[1]) + ' · ' + x[2] + '"></button>'; }).join('') + '</div>' +
      (ax ? '<div class="hist__ax" aria-hidden="true"><span>' + ax[0] + '</span><span>' + ax[1] + '</span></div>' : '');
  }
  function sum(g, dflt) { var s = sel(g); return s.length ? '<b>' + esc(s.map(function (x) { return labelOf(g, x); }).join(', ')) + '</b>' : dflt; }

  function renderFilters() {
    var b = $('#ctx-b'), st = b.scrollTop, L = list(), F = filtered(), na = nSel();
    var makes = S.allMakes ? MAKES : MAKES.slice(0, 8);
    var active = [];
    Object.keys(S.f).forEach(function (g) { sel(g).forEach(function (key) { active.push('<span class="chip">' + esc((g === 'make' ? '' : GL[g] + ': ') + labelOf(g, key)) + '<button class="chip__x" type="button" data-fk="' + g + ':' + esc(key) + '" aria-label="Remove">' + ic('i-x') + '</button></span>'); }); });
    var h = '<label class="fsearch">' + ic('i-search') + '<input type="search" data-fq placeholder="Search filters — make, colour, location…" value="' + esc(S.fq) + '" aria-label="Search filters"></label>';
    if (active.length) h += '<div class="factive"><span>Active</span>' + active.join('') + '</div>';
    h += acc('f-make', 'Make', sum('make', MAKES.length + ' makes'),
      '<div class="fvs">' + makes.map(function (m) { return fv('make', m[0], esc(m[0]), m[1], 54, m[2] ? 'avg ' + k(m[2]) : 'no prices'); }).join('') + '</div>' +
      '<button class="linkbtn" type="button" data-act="all-makes">' + (S.allMakes ? 'Show top 8' : 'Show all ' + MAKES.length + ' makes') + '</button>');
    h += acc('f-model', 'Model', sum('model', 'Top models'), facetList('model', G.model) + '<p class="hint">Choose a make to list every model it has.</p>');
    h += acc('f-trim', 'Trim', sum('trim', 'Grouped trims'), facetList('trim', G.trim), ' <span class="demo">Demo</span>');
    h += acc('f-year', 'Year', sum('year', '1929 – 2027'), hist('year', G.year.slice().reverse(), null, null) + rangeSlider('year', G.year.slice().reverse()) + '<div class="hist__ax" aria-hidden="true"><span>Before 1970</span><span>2027</span></div>' + facetList('year', G.year) +
      '<div class="pop__row f-range"><select class="sel" aria-label="Year from"><option>From</option><option>2027</option><option>2020</option><option>2010</option><option>2000</option><option>1990</option><option>1970</option><option>1929</option></select><span>–</span><select class="sel" aria-label="Year to"><option>To</option><option>2027</option><option>2020</option><option>2010</option><option>2000</option><option>1990</option><option>1970</option></select></div>');
    h += acc('f-price', 'Price', sum('price', '<span class="bad">133 without a price</span>'), hist('price', G.price, 'none', null) + rangeSlider('price', G.price) + '<div class="hist__ax" aria-hidden="true"><span>No price</span><span>$250K +</span></div>' + facetList('price', G.price, 'none') +
      '<div class="pop__row f-range"><input class="fld" type="search" inputmode="numeric" placeholder="$ min" aria-label="Minimum price"><span>–</span><input class="fld" type="search" inputmode="numeric" placeholder="$ max" aria-label="Maximum price"></div>');
    h += acc('f-mile', 'Mileage', sum('mile', 'Any'), hist('mile', G.mile.slice(0, 5), null, ['Under 1,000 mi', 'Over 100,000 mi']) + facetList('mile', G.mile));
    h += acc('f-loc', 'Location', sum('loc', '6 rooftops'), facetList('loc', G.loc));
    h += acc('f-dealer', 'Dealer', sum('dealer', '3 accounts'), facetList('dealer', G.dealer), ' <span class="demo">Demo</span>');
    h += acc('f-type', 'Type', sum('type', 'New · Used'), facetList('type', G.type));
    h += acc('f-merch', 'Merchandising', sum('merch', 'Site · feeds · pending'), toggleList('merch', G.merch));
    h += acc('f-color', 'Exterior colour', sum('color', 'Any'), '<div class="sws">' + COLORS.map(function (c) { var on = !!S.f.color[c[0]]; return '<button type="button" class="swb' + (on ? ' swb--on' : '') + '" data-fk="color:' + c[0] + '" aria-pressed="' + on + '"><span class="sw" style="--c:' + c[1] + '"></span>' + c[0] + '<b>' + c[2] + '</b></button>'; }).join('') + '</div>');
    h += acc('f-opt', 'Options', sum('opt', 'Decoded from VIN'), facetList('opt', G.opt), ' <span class="demo">Demo</span>');
    h += acc('f-audit', 'Audit', 'Missing items · custom field',
      '<label class="f"><span>Missing items</span><select class="sel"><option value="">— any —</option><optgroup label="Photos"><option>Images</option><option>1 image or less</option></optgroup><optgroup label="Identity"><option>VIN decoding</option><option>Stock number</option><option>Make</option><option>Model</option><option>Trim</option><option>Year</option><option>VIN number</option><option>Vehicle type</option></optgroup><optgroup label="Specs"><option>Body</option><option>Transmission</option><option>Mileage</option><option>Exterior colour</option><option>Interior colour</option><option>Fuel</option><option>Location</option></optgroup><optgroup label="Pricing"><option>Price</option><option>Discounted price</option><option>Invoice price</option><option>Lease price</option><option>Lease term</option></optgroup><optgroup label="Copy"><option>Intro description</option><option>Caption</option><option>Main description</option><option>Bulleted text</option><option>Description 2</option><option>Buyers guide text</option></optgroup></select></label>' +
      '<div class="f"><span>Custom field</span><div class="pop__row"><select class="sel" aria-label="Custom field"><option value="">—</option><option>cfx_date</option><option>trucks_and_equipment</option><option>ove_feed_data</option><option>no_carfax</option><option>pending_sale_name</option><option>truck_trailer</option><option>images_timestamp</option><option>no_vin</option><option>carfax_timestamp</option></select><input class="fld" type="search" placeholder="value…" aria-label="Custom field value"></div></div>' +
      '<div class="f2"><label class="f"><span>Stock #</span><input class="fld" type="search" placeholder="Exact stock"></label><label class="f"><span>VIN</span><input class="fld" type="search" placeholder="Full or partial"></label></div>');
    var focusFq = document.activeElement && document.activeElement.matches && document.activeElement.matches('[data-fq]');
    b.innerHTML = h; b.scrollTop = st; applyFq();
    if (focusFq) { var q = $('[data-fq]'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
    var f = $('#ctx-f');
    f.className = 'ctxp__f ctxp__f--row';
    f.innerHTML = '<button class="btn btn--quiet" type="button" data-act="reset-f"' + (na ? '' : ' disabled') + '>Reset</button><span class="ctxp__note"><span class="demo">Demo</span> counts</span><button class="btn btn--primary" type="button" data-act="apply">Show ' + nf(F ? L.length : 359) + ' vehicles</button>';
  }
  function applyFq() {
    var q = S.fq.trim().toLowerCase();
    $$('#ctx-b .acc').forEach(function (sec) {
      var t = $('.acc__t', sec).textContent.toLowerCase(), rows = $$('.fv, .swb', sec), hit = 0, titleHit = q && t.indexOf(q) >= 0;
      rows.forEach(function (r) { var mm = !q || titleHit || r.textContent.toLowerCase().indexOf(q) >= 0; r.hidden = !mm; if (mm) hit++; });
      $$('.hist, .hist__ax, .linkbtn, .hint', sec).forEach(function (x) { x.hidden = !!q && !titleHit; });
      sec.hidden = !!q && !hit && !titleHit;
      setAccOpen(sec, q ? !sec.hidden : !!S.acc[sec.dataset.acc]);
    });
  }

  /* ── platform menus, theme ────────────────────────────────────────── */
  function closeMenus(except) { $$('.nav__it--open').forEach(function (it) { if (it !== except) { it.classList.remove('nav__it--open'); var bt = $('[data-menu]', it); if (bt) bt.setAttribute('aria-expanded', 'false'); } }); }
  function closePops() { $$('.pop--open').forEach(function (p) { p.classList.remove('pop--open'); }); }
  function setTheme(t, keep) {
    document.documentElement.setAttribute('data-theme', t);
    if (keep) try { localStorage.setItem('aan-theme', t); } catch (e) {}
    $('[data-act="theme"]').setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  /* ── events ───────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-menu]'))) { var it = el.closest('.nav__it'), open = !it.classList.contains('nav__it--open'); closeMenus(it); it.classList.toggle('nav__it--open', open); el.setAttribute('aria-expanded', open); return; }
    if (!t.closest('.nav__it')) closeMenus();
    if ((el = t.closest('[data-pop]'))) { var p = $('#' + el.dataset.pop), was = p.classList.contains('pop--open'); closePops(); if (!was) p.classList.add('pop--open'); return; }
    if (!t.closest('.pop')) closePops();
    if ((el = t.closest('.acc__h'))) { var sec = el.closest('.acc'), key = sec.dataset.acc; S.acc[key] = !sec.classList.contains('acc--open'); setAccOpen(sec, S.acc[key]); return; }
    if ((el = t.closest('.mode[data-mode]'))) { if (!el.disabled) setMode(el.dataset.mode); return; }
    if ((el = t.closest('[data-act="theme"]'))) { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); return; }
    if ((el = t.closest('[data-act="filters"]'))) { setMode(S.mode === 'filters' ? S.prev : 'filters'); return; }
    if ((el = t.closest('[data-act="apply"]'))) { setMode(S.prev); return; }
    if ((el = t.closest('[data-act="close"]'))) { setMode('lot'); return; }
    if ((el = t.closest('[data-act="all-makes"]'))) { S.allMakes = !S.allMakes; render(); return; }
    if ((el = t.closest('[data-act="reset-f"]'))) { Object.keys(S.f).forEach(function (g) { S.f[g] = {}; }); renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="prev"], [data-act="next"]'))) { var L = list(), i = L.findIndex(function (x) { return x.id === S.cur; }); var nx = L[(i + (el.dataset.act === 'next' ? 1 : -1) + L.length) % L.length]; if (nx) showVehicle(nx.id); return; }
    if ((el = t.closest('[data-fk]'))) { var fk = el.dataset.fk.split(':'); tog(fk[0], fk[1]); return; }
    if ((el = t.closest('[data-lane]'))) { setLane(el.dataset.lane); return; }
    if ((el = t.closest('[data-attn]'))) { setAttn(el.dataset.attn, !S.attn[el.dataset.attn]); return; }
    if ((el = t.closest('[data-age]'))) { setAge(S.age === el.dataset.age ? null : el.dataset.age); return; }
    if ((el = t.closest('[data-chip]'))) { $('#chips')._chips[+el.dataset.chip].off(); render(); return; }
    if ((el = t.closest('[data-act="clear-all"]'))) { S.attn = {}; S.age = null; Object.keys(S.f).forEach(function (g) { S.f[g] = {}; }); renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="clear-makes"]'))) { S.f.make = {}; renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="clear-sel"]'))) { S.sel = {}; render(); return; }
    if ((el = t.closest('.mn__it[data-sort]'))) { S.sort = el.dataset.sort; render(); closePops(); return; }
    if ((el = t.closest('.hd [data-sort]'))) { if (S.sort === el.dataset.sort) S.dir = S.dir === 'asc' ? 'desc' : 'asc'; else S.sort = el.dataset.sort; render(); return; }
    if ((el = t.closest('[data-dir]'))) { S.dir = el.dataset.dir; render(); closePops(); return; }
    if ((el = t.closest('.vrow[data-id]')) && !t.closest('[data-stop]') && !t.closest('.ck')) { showVehicle(el.dataset.id); return; }
    if (t.closest('a[href="#"]')) e.preventDefault();
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-f]')) { tog(t.dataset.f, t.dataset.k, t.checked); return; }
    if (t.matches('[data-sel]')) { S.sel[t.dataset.sel] = t.checked; render(); }
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.matches('[data-filter]')) { var q = t.value.toLowerCase(); $$('#make-list .pop__it').forEach(function (it) { it.style.display = it.textContent.toLowerCase().indexOf(q) >= 0 ? '' : 'none'; }); }
    if (t.matches('[data-fq]')) { S.fq = t.value; applyFq(); }
  });
  document.addEventListener('keydown', function (e) {
    var a = document.activeElement;
    if (e.key === 'Escape') { if ($('.nav__it--open') || $('.pop--open')) { closeMenus(); closePops(); } else if (S.mode !== 'lot') setMode('lot'); return; }
    if (e.key === 'Enter' && a && a.matches && a.matches('.vrow[data-id]')) { showVehicle(a.dataset.id); return; }
    if (e.key === '/' && !/input|select|textarea/i.test(a.tagName)) { e.preventDefault(); $('#q').focus(); }
  });

  for (var y = 2027; y >= 1929; y--) { $('#y1').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); $('#y2').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); }
  setTheme(document.documentElement.getAttribute('data-theme') || 'light', false);
  renderMakes();

  /* review states via hash (Gen 8 compatible): #vehicle=20171 · #filters · #lot · #dark · #light · #open=market,health · #close=market · #f=make:Porsche,price:none · #attn=no_price */
  (function fromHash() {
    var P = {};
    location.hash.slice(1).split('&').filter(Boolean).forEach(function (p) { var kv = p.split('='); P[kv[0]] = decodeURIComponent(kv[1] || ''); });
    if ('dark' in P) setTheme('dark', false);
    if ('light' in P) setTheme('light', false);
    var alias = function (x) { return x === 'comps' ? 'market' : x; };
    if (P.open) P.open.split(',').forEach(function (x) { S.acc[alias(x)] = true; });
    if (P.close) P.close.split(',').forEach(function (x) { S.acc[alias(x)] = false; });
    if (P.f) P.f.split(',').forEach(function (x) { var q = x.split(':'); if (S.f[q[0]]) S.f[q[0]][q[1]] = true; });
    if (P.attn) S.attn[P.attn] = true;
    renderMakes();
    if (P.vehicle) { var v = V.filter(function (x) { return x.s === P.vehicle; })[0] || V[+P.vehicle]; if (v) { showVehicle(v.id); return; } }
    setMode('filters' in P ? 'filters' : 'lot');
  })();
  window.G9demo = { showVehicle: showVehicle, setMode: setMode, S: S, V: V };
})();
