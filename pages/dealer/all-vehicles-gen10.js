/* Gen 10 — Gen 7 workspace behaviour, plus: platform menus, Light/Dark, and the Dock as accordions
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
  var GL = { make: 'Make', model: 'Model', year: 'Year', price: 'Price', mile: 'Mileage', loc: 'Location', type: 'Type', merch: 'Merchandising', color: 'Colour', opt: 'Options' };
  var BASE = { Kia: 14500, Terex: 38500, SUNDOWNER: 52000, Porsche: 180000, Dodge: 92000, Ford: 58000 };
  var STATES = ['IL', 'WI', 'IN', 'MI', 'OH', 'MO', 'MN', 'IA', 'KY'];
  var NO_MILES = { Chaparral: 1, SUNDOWNER: 1, Terex: 1 };

  var S = {
    sort: 'days', dir: 'desc', attn: {}, age: null, sel: {}, lane: 'Available', dock: null, cur: null, fq: '', allMakes: false,
    f: { make: {}, model: {}, year: {}, price: {}, mile: {}, loc: {}, type: {}, merch: {}, color: {}, opt: {} },
    acc: { health: false, market: true, comps: false, spec: false, hist: false, 'f-make': true, 'f-price': true, 'f-year': false, 'f-model': false, 'f-mile': false, 'f-loc': false, 'f-type': false, 'f-merch': false, 'f-color': false, 'f-opt': false, 'f-audit': false }
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
  function labelOf(g, key) {
    if (g === 'make') return key;
    if (g === 'color') return key;
    var hit = (G[g] || []).filter(function (x) { return x[0] === key; })[0];
    return hit ? hit[1] : key;
  }
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
    var b = band(v.d), max = S.dock ? 1 : (v.f.length > 3 ? 2 : 3), tags = v.f.slice(0, max), rest = v.f.length - tags.length;
    var name = v.y + ' ' + v.mk + ' ' + v.md;
    return '<div class="row' + (S.sel[v.id] ? ' sel' : '') + (S.cur === v.id ? ' open' : '') + '" data-id="' + v.id + '" tabindex="0" aria-label="' + esc(name) + '">' +
      '<input class="ck" type="checkbox" data-sel="' + v.id + '"' + (S.sel[v.id] ? ' checked' : '') + ' aria-label="Select ' + esc(name) + '">' +
      (v.t ? '<img class="th" alt="" src="img/' + esc(v.t) + '">' : '<span class="th th--none" title="No photos uploaded">' + ic('i-cam-off') + '</span>') +
      '<div class="id"><span class="id__n" title="' + esc(name) + '"><em>' + v.y + '</em>' + esc(v.mk) + ' ' + esc(v.md) + '</span><span class="id__m"><span class="idtag">' + esc(v.s) + '</span>' + (v.lock ? '<span class="lock" title="Being edited by another user">' + ic('i-lock') + '</span>' : '') + '<span class="id__vin">' + esc(v.vin) + '</span></span></div>' +
      '<div class="spec"><span class="spec__t" title="' + esc(v.tr) + '">' + (v.tr ? esc(v.tr) : '<i>No trim recorded</i>') + '</span><span class="spec__c"><span class="sw" style="--c:' + v.hx + '"></span>' + esc(v.c) + '</span></div>' +
      (v.p != null ? '<div class="price"><em>$</em>' + nf(v.p) + '</div>' : '<div class="price price--none" aria-label="No price">—</div>') +
      '<div class="age age--' + b + '" title="' + nf(v.d) + ' days in stock"><i style="--w:' + Math.min(100, Math.round(v.d / 730 * 100)) + '%;--b:' + COL[b] + '"></i>' + lab(v.d) + '</div>' +
      '<div class="tags">' + tags.map(tag).join('') + (rest > 0 ? '<span class="tag tag--more" title="' + esc(v.f.slice(tags.length).join(' · ')) + '">+' + rest + '</span>' : '') + '</div>' +
      '<span class="acts"><button type="button" aria-label="Edit vehicle" data-stop>' + ic('i-edit') + '</button><button type="button" aria-label="Photos" data-stop>' + ic('i-cam') + '</button><button type="button" aria-label="Window sticker" data-stop>' + ic('i-print') + '</button><button type="button" aria-label="More" data-stop>' + ic('i-more') + '</button></span>' +
      '</div>';
  }

  function render() {
    var L = list(), F = filtered();
    $('#tb').innerHTML = L.length ? L.map(row).join('') : '<div class="empty">No vehicles match these filters.<button type="button" data-act="clear-all">Clear all</button></div>';
    $('#shown').textContent = (L.length ? '1–' + L.length : '0') + ' of ' + (F ? L.length : 359);

    var chips = [];
    Object.keys(S.attn).forEach(function (a) { if (S.attn[a]) chips.push({ cls: 'chip--attn', v: ATTN[a], off: function () { setAttn(a, false); } }); });
    if (S.age) chips.push({ cls: 'chip--attn', v: 'Age ' + AGE[S.age], off: function () { setAge(null); } });
    Object.keys(S.f).forEach(function (g) {
      sel(g).forEach(function (key) { chips.push({ cls: '', v: (g === 'make' ? '' : GL[g] + ': ') + labelOf(g, key), off: function () { S.f[g][key] = false; if (g === 'make') renderMakes(); } }); });
    });
    $('#scope').innerHTML = '<span class="scope__n">' + (S.lane === 'All' ? 'All vehicles' : esc(S.lane)) + '</span><span>·</span><span><b>' + nf(F ? L.length : 359) + '</b> vehicles</span>' +
      (chips.length ? chips.map(function (c, i) { return '<span class="chip ' + c.cls + '">' + esc(c.v) + '<button class="chip__x" type="button" data-chip="' + i + '" aria-label="Remove ' + esc(c.v) + '">' + ic('i-x') + '</button></span>'; }).join('') + '<button class="scope__clear" type="button" data-act="clear-all">Clear all</button>' : '') +
      '<span class="scope__sp"></span><span>' + (L.length ? '1–' + L.length : '0') + ' shown</span>';
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
    $('#sort-v').textContent = ({ days: 'Age', price: 'Price', stock: 'Stock', year: 'Year', make: 'Make', issues: 'Attention' })[S.sort] + (S.dir === 'asc' ? ' ↑' : ' ↓');
    var n = Object.keys(S.sel).filter(function (x) { return S.sel[x]; }).length;
    $('#tray').classList.toggle('tray--on', n > 0); $('#tray-n').textContent = n;
    if (S.dock === 'filters') renderFilters();
    if (S.dock === 'vehicle') { var v = byId(S.cur), i = L.indexOf(v); $('#dock-c').textContent = i >= 0 ? (i + 1) + ' of ' + L.length : 'not in current filter'; }
  }
  function renderMakes() {
    $('#make-list').innerHTML = MAKES.map(function (m) { return '<label class="pop__it"><input class="ck" type="checkbox" data-f="make" data-k="' + esc(m[0]) + '"' + (S.f.make[m[0]] ? ' checked' : '') + '><span>' + esc(m[0]) + '</span><span class="c">' + m[1] + '</span></label>'; }).join('');
  }
  function setAttn(a, on) { S.attn[a] = on; $$('.ar[data-attn="' + a + '"]').forEach(function (b) { b.classList.toggle('ar--on', on); b.setAttribute('aria-pressed', on); }); render(); }
  function setAge(b) { S.age = b; $$('[data-age]').forEach(function (el) { el.classList.toggle('on', el.dataset.age === b); }); render(); }
  function setLane(l) {
    S.lane = l;
    $$('[data-lane]').forEach(function (b) { var on = b.dataset.lane === l; b.classList.toggle('lane--on', on); b.setAttribute('aria-pressed', on); });
    $('#scope-n').textContent = $('[data-lane="' + l + '"] b').textContent; $('#scope-l').textContent = l === 'All' ? 'All on file' : l;
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
  function closeDock() { S.dock = null; S.cur = null; $('#app').classList.remove('dock-open'); $('[data-act="filters"]').classList.remove('facet__b--on'); $('#dock-f').className = 'dock__f'; render(); }

  function showVehicle(id) {
    var v = byId(id); if (!v) return;
    S.cur = id; S.dock = 'vehicle';
    $('#dock-t').textContent = 'Vehicle'; $('#dock-nav').hidden = false;
    $('#dock-b').innerHTML = vehicleBody(v); $('#dock-b').scrollTop = 0;
    $('#dock-f').className = 'dock__f'; $('#dock-f').innerHTML = vehicleFoot(v);
    openDock(); render();
    var r = $('.row[data-id="' + id + '"]'); if (r) r.scrollIntoView({ block: 'nearest' });
  }

  function vehicleBody(v) {
    var b = band(v.d), has = function (t) { return v.f.indexOf(t) >= 0; }, m = market(v);
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

    /* market & pricing */
    var span = m.max - m.min, pos = function (x) { return Math.max(0, Math.min(100, (x - m.min) / span * 100)); }, mx = Math.max.apply(null, m.bins);
    var bars = m.bins.map(function (h, i) { var mid = m.min + span * (i + 0.5) / m.bins.length; return '<i class="' + (mid >= m.lo && mid <= m.hi ? 'in' : '') + '" style="height:' + Math.max(4, Math.round(h / mx * 100)) + '%"></i>'; }).join('');
    var d = v.p != null ? (v.p - m.med) / m.med : 0, flat = Math.abs(d) < 0.03;
    var deltaTxt = flat ? 'At market' : (Math.abs(d) * 100).toFixed(1) + '% ' + (d < 0 ? 'below' : 'above');
    var mktSum = v.p != null ? '<span class="' + (flat ? '' : d < 0 ? 'good' : 'bad') + '">' + deltaTxt + (flat ? '' : ' market') + '</span>' : '<span class="bad">Suggested ' + k(m.med) + '</span>';
    var mktIn =
      '<div class="mkt__row">' +
        (v.p != null ? '<div><div class="mkt__v">' + fmt(v.p) + '</div><div class="mkt__l">Your asking price</div></div>' : '<div><div class="mkt__v warn">No price</div><div class="mkt__l">Your asking price</div></div>') +
        '<div><div class="mkt__v">' + fmt(m.med) + '</div><div class="mkt__l">Market median</div></div>' +
        (v.p != null ? '<span class="delta' + (flat ? '' : d < 0 ? ' delta--ok' : ' delta--warn') + '">' + (flat ? '' : ic(d < 0 ? 'i-dn' : 'i-up')) + deltaTxt + '</span>' : '<span></span>') +
      '</div>' +
      '<div class="dist" aria-hidden="true"><span class="dist__band" style="left:' + pos(m.lo).toFixed(1) + '%;right:' + (100 - pos(m.hi)).toFixed(1) + '%"></span>' + bars +
        (v.p != null ? '<span class="dist__mk" style="left:' + pos(v.p).toFixed(1) + '%"><b>You</b></span>' : '<span class="dist__mk dist__mk--med" style="left:' + pos(m.med).toFixed(1) + '%"><b>Median</b></span>') + '</div>' +
      '<div class="dist__ax" aria-hidden="true"><span>' + k(m.min) + '</span><span>Price distribution · ' + m.n + ' listings</span><span>' + k(m.max) + '</span></div>' +
      (v.p == null ? '<div class="suggest"><span>Price at the market median: <b>' + fmt(m.med) + '</b></span><button class="btn btn--sheet btn--sm" type="button">Set price</button></div>' : '') +
      '<dl class="kvl"><div><dt>Typical range</dt><dd>' + k(m.lo) + ' – ' + k(m.hi) + '</dd></div><div><dt>Comparable listings</dt><dd>' + m.n + ' · last 90 days</dd></div><div><dt>Median days to sell</dt><dd>' + m.dts + ' days</dd></div><div><dt>Source</dt><dd>visor.vin market data · not connected</dd></div></dl>';

    /* recent comps */
    var compsIn = '<ul class="cps">' + m.comps.map(function (c) {
      var diff = v.p != null ? c.p - v.p : null;
      return '<li class="cp"><div class="cp__id"><b>' + c.y + ' ' + esc(v.mk) + ' ' + esc(v.md) + '</b><span>' + (c.mi != null ? nf(c.mi) + ' mi · ' : '') + 'listed ' + c.ago + 'd ago · ' + c.dist + ' mi away, ' + c.st + '</span></div>' +
        '<div class="cp__p"><b>' + fmt(c.p) + '</b>' + (diff != null ? '<span class="' + (diff >= 0 ? 'up' : 'dn') + '" title="Compared with your asking price">' + (diff >= 0 ? '+' : '−') + k(Math.abs(diff)) + ' vs yours</span>' : '') + '</div></li>';
    }).join('') + '</ul><button class="linkbtn" type="button">All ' + m.n + ' comparable listings' + ic('i-right') + '</button>';

    /* history */
    var sd = hash(v.s), T = [['i-edit', 'Edited by Parin', '3 days ago']];
    if (v.ph) T.push(['i-cam', 'Photos updated · ' + v.ph + ' photos', Math.min(v.d, 9) + ' days ago']);
    if (v.p != null) T.push(['i-tag', 'Asking price set to ' + fmt(v.p), Math.min(v.d, 14 + sd % 50) + ' days ago']);
    if (has('Feed off')) T.push(['i-rss', 'Excluded from partner feeds', Math.min(v.d, 60 + sd % 90) + ' days ago']);
    T.push(['i-plus', 'Added to inventory', nf(v.d) + ' days ago']);
    var histIn = '<ul class="tl">' + T.map(function (t) { return '<li><span class="tl__i">' + ic(t[0]) + '</span><span>' + esc(t[1]) + '</span><span>' + t[2] + '</span></li>'; }).join('') + '</ul>';

    var specIn = '<div class="spec2"><div><span>Trim</span><span title="' + esc(v.tr) + '">' + (esc(v.tr) || '—') + '</span></div><div><span>Exterior</span><span>' + esc(v.c) + '</span></div><div><span>Type</span><span>Used</span></div><div><span>Mileage</span><span>Not recorded</span></div><div><span>Location</span><span>Chicago Motor Cars</span></div><div><span>Stock #</span><span class="mono">' + esc(v.s) + '</span></div></div>';

    return '<div class="veh__img">' + (v.t ? '<img alt="' + esc(v.y + ' ' + v.mk + ' ' + v.md) + '" src="img/' + esc(v.t) + '"><span class="cnt">' + ic('i-cam') + nf(v.ph || 0) + ' photos</span>' : '<div class="none">' + ic('i-cam-off') + 'No photos uploaded<button class="btn btn--sm" type="button">' + ic('i-plus') + ' Upload photos</button></div>') + '</div>' +
      '<h3 class="veh__n"><em>' + v.y + '</em>' + esc(v.mk) + ' ' + esc(v.md) + '</h3>' +
      '<div class="veh__m"><span class="idtag">' + esc(v.s) + '</span><span class="mono">VIN ' + esc(v.vin) + '</span><span class="veh__st">Available</span>' + (v.lock ? '<span class="lock" title="Being edited by another user">' + ic('i-lock') + '</span>' : '') + '</div>' +
      (v.f.length ? '<div class="veh__tags">' + v.f.map(tag).join('') + '</div>' : '') +
      '<div class="veh__kv"><div><div class="v' + (v.p == null ? ' warn' : '') + '">' + (v.p == null ? 'No price' : fmt(v.p)) + '</div><div class="l">asking price</div></div><div><div class="v" style="color:' + (b === 'stale' ? 'var(--danger)' : b === 'fresh' ? 'var(--ok)' : 'var(--ink)') + '">' + lab(v.d) + '</div><div class="l">' + nf(v.d) + ' days</div></div><div><div class="v">' + (v.ph || 0) + '</div><div class="l">photos</div></div></div>' +
      acc('health', 'Merchandising health', healthSum, '<div class="health">' + H.map(function (h) { return '<div class="hl hl--' + h[0] + '"><i>' + ic(h[1]) + '</i>' + esc(h[2]) + '</div>'; }).join('') + '</div>') +
      acc('market', 'Market &amp; pricing', mktSum, mktIn, ' <span class="demo">Demo</span>') +
      acc('comps', 'Recent comps', '5 of ' + m.n + ' listings', compsIn, ' <span class="demo">Demo</span>') +
      acc('spec', 'Specification', esc(v.tr || 'No trim recorded'), specIn) +
      acc('hist', 'History', 'Edited 3 days ago', histIn, ' <span class="demo">Demo</span>');
  }

  function vehicleFoot(v) {
    var has = function (t) { return v.f.indexOf(t) >= 0; };
    return '<div class="vf"><button class="btn btn--primary btn--lg" type="button">' + ic('i-edit') + ' Edit vehicle</button>' +
      '<button class="btn btn--sheet btn--lg" type="button">' + ic('i-cam') + ' Photos</button><button class="btn btn--sheet btn--lg" type="button">' + ic('i-print') + ' Sticker</button>' +
      '<div class="facet"><button class="btn btn--sheet btn--lg btn--icon" type="button" data-pop="p-vmore" aria-label="More actions">' + ic('i-more') + '</button>' +
      '<div class="pop pop--up pop--right mn" id="p-vmore"><button class="mn__it" type="button">' + ic('i-file') + 'Carfax report</button><button class="mn__it" type="button">' + ic('i-rss') + (has('Feed off') ? 'Include in feeds' : 'Exclude from feeds') + '</button><button class="mn__it" type="button">' + ic('i-eye') + (has('Hidden') ? 'Show on site' : 'Hide on site') + '</button><div class="mn__sep"></div><button class="mn__it mn__it--danger" type="button">' + ic('i-trash') + 'Delete vehicle…</button></div></div></div>';
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
    var h = '<label class="fsearch">' + ic('i-search') + '<input type="search" data-fq placeholder="Search filters — make, colour, location…" value="' + esc(S.fq) + '" aria-label="Search filters"></label>';
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
    h += acc('f-color', 'Exterior colour', sum('color', 'Any'), '<div class="sws">' + COLORS.map(function (c) { var on = !!S.f.color[c[0]]; return '<button type="button" class="swb' + (on ? ' swb--on' : '') + '" data-fk="color:' + c[0] + '" aria-pressed="' + on + '"><span class="sw" style="--c:' + c[1] + '"></span>' + c[0] + '<b>' + c[2] + '</b></button>'; }).join('') + '</div>');
    h += acc('f-opt', 'Options', sum('opt', 'Decoded from VIN'), facetList('opt', G.opt), ' <span class="demo">Demo</span>');
    h += acc('f-audit', 'Audit', 'Missing items · custom field',
      '<label class="f"><span>Missing items</span><select class="sel"><option value="">— any —</option><optgroup label="Photos"><option>Images</option><option>1 image or less</option></optgroup><optgroup label="Identity"><option>VIN decoding</option><option>Stock number</option><option>Make</option><option>Model</option><option>Trim</option><option>Year</option><option>VIN number</option><option>Vehicle type</option></optgroup><optgroup label="Specs"><option>Body</option><option>Transmission</option><option>Mileage</option><option>Exterior colour</option><option>Interior colour</option><option>Fuel</option><option>Location</option></optgroup><optgroup label="Pricing"><option>Price</option><option>Discounted price</option><option>Invoice price</option><option>Lease price</option><option>Lease term</option></optgroup><optgroup label="Copy"><option>Intro description</option><option>Caption</option><option>Main description</option><option>Bulleted text</option><option>Description 2</option><option>Buyers guide text</option></optgroup></select></label>' +
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
  function showFilters() { S.cur = null; S.dock = 'filters'; $('#dock-b').scrollTop = 0; openDock(); render(); }

  /* ── platform menus, theme ────────────────────────────────────────── */
  function closeMenus(except) { $$('.nav__it--open').forEach(function (it) { if (it !== except) { it.classList.remove('nav__it--open'); var b = $('[data-menu]', it); if (b) b.setAttribute('aria-expanded', 'false'); } }); }
  function setTheme(t, keep) {
    document.documentElement.setAttribute('data-theme', t);
    if (keep) try { localStorage.setItem('aan-theme', t); } catch (e) {}
    $('[data-act="theme"]').setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  /* ── events ───────────────────────────────────────────────────────── */
  function closePops() { $$('.pop--open').forEach(function (p) { p.classList.remove('pop--open'); }); }
  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-menu]'))) { var it = el.closest('.nav__it'), open = !it.classList.contains('nav__it--open'); closeMenus(it); it.classList.toggle('nav__it--open', open); el.setAttribute('aria-expanded', open); return; }
    if (!t.closest('.nav__it')) closeMenus();
    if ((el = t.closest('[data-pop]'))) { var p = $('#' + el.dataset.pop), wasOpen = p.classList.contains('pop--open'); closePops(); if (!wasOpen) p.classList.add('pop--open'); return; }
    if (!t.closest('.pop')) closePops();
    if ((el = t.closest('.acc__h'))) { var sec = el.closest('.acc'), key = sec.dataset.acc; S.acc[key] = !sec.classList.contains('acc--open'); setAccOpen(sec, S.acc[key]); return; }
    if ((el = t.closest('[data-act="theme"]'))) { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); return; }
    if ((el = t.closest('[data-act="filters"]'))) { if (S.dock === 'filters') closeDock(); else showFilters(); return; }
    if ((el = t.closest('[data-act="close"]'))) { closeDock(); return; }
    if ((el = t.closest('[data-act="all-makes"]'))) { S.allMakes = !S.allMakes; render(); return; }
    if ((el = t.closest('[data-act="reset-f"]'))) { Object.keys(S.f).forEach(function (g) { S.f[g] = {}; }); renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="prev"], [data-act="next"]'))) { var L = list(), i = L.findIndex(function (x) { return x.id === S.cur; }); var nx = L[(i + (el.dataset.act === 'next' ? 1 : -1) + L.length) % L.length]; if (nx) showVehicle(nx.id); return; }
    if ((el = t.closest('[data-fk]'))) { var fk = el.dataset.fk.split(':'); tog(fk[0], fk[1]); return; }
    if ((el = t.closest('[data-lane]'))) { setLane(el.dataset.lane); return; }
    if ((el = t.closest('.ar[data-attn]'))) { setAttn(el.dataset.attn, !S.attn[el.dataset.attn]); return; }
    if ((el = t.closest('[data-age]'))) { setAge(S.age === el.dataset.age ? null : el.dataset.age); return; }
    if ((el = t.closest('[data-chip]'))) { $('#scope')._chips[+el.dataset.chip].off(); render(); return; }
    if ((el = t.closest('[data-act="clear-all"]'))) { S.attn = {}; Object.keys(S.f).forEach(function (g) { S.f[g] = {}; }); $$('.ar--on').forEach(function (b) { b.classList.remove('ar--on'); b.setAttribute('aria-pressed', 'false'); }); renderMakes(); setAge(null); return; }
    if ((el = t.closest('[data-act="clear-makes"]'))) { S.f.make = {}; renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="clear-sel"]'))) { S.sel = {}; render(); return; }
    if ((el = t.closest('.mn__it[data-sort]'))) { S.sort = el.dataset.sort; render(); closePops(); return; }
    if ((el = t.closest('.hd [data-sort]'))) { if (S.sort === el.dataset.sort) S.dir = S.dir === 'asc' ? 'desc' : 'asc'; else S.sort = el.dataset.sort; render(); return; }
    if ((el = t.closest('[data-dir]'))) { S.dir = el.dataset.dir; render(); closePops(); return; }
    if ((el = t.closest('.row[data-id]')) && !t.closest('[data-stop]') && !t.closest('.ck')) { showVehicle(el.dataset.id); return; }
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
    if (e.key === 'Escape') { if ($('.nav__it--open') || $('.pop--open')) { closeMenus(); closePops(); } else if (S.dock) closeDock(); return; }
    if (e.key === 'Enter' && a && a.matches && a.matches('.row[data-id]')) { showVehicle(a.dataset.id); return; }
    if (e.key === '/' && !/input|select|textarea/i.test(a.tagName)) { e.preventDefault(); $('#q').focus(); }
  });

  for (var y = 2027; y >= 1929; y--) { $('#y1').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); $('#y2').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); }
  setTheme(document.documentElement.getAttribute('data-theme') || 'light', false);
  renderMakes(); render();

  /* review states via hash: #vehicle=20171 · #filters · #dark · #open=comps,hist · #f=make:Porsche,price:none */
  (function fromHash() {
    var parts = location.hash.slice(1).split('&').filter(Boolean), P = {};
    parts.forEach(function (p) { var kv = p.split('='); P[kv[0]] = decodeURIComponent(kv[1] || ''); });
    if ('dark' in P) setTheme('dark', false);
    if ('light' in P) setTheme('light', false);
    if (P.open) P.open.split(',').forEach(function (x) { S.acc[x] = true; });
    if (P.close) P.close.split(',').forEach(function (x) { S.acc[x] = false; });
    if (P.f) P.f.split(',').forEach(function (x) { var q = x.split(':'); if (S.f[q[0]]) S.f[q[0]][q[1]] = true; });
    if (P.attn) setAttn(P.attn, true);
    if (P.vehicle) { var v = V.filter(function (x) { return x.s === P.vehicle; })[0] || V[+P.vehicle]; if (v) showVehicle(v.id); }
    else if ('filters' in P) showFilters();
    else render();
  })();
  window.G8demo = { showVehicle: showVehicle, showFilters: showFilters, closeDock: closeDock, S: S, V: V };
})();
