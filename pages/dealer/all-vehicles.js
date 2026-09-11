/* All Vehicles gen 2 — demo behaviour. 22 invented demo vehicles, SVG placeholder thumbs, no network. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (id, c) { return '<svg class="i ' + (c || '') + '"><use href="#' + id + '"/></svg>'; };

  /* ── demo data (invented) ─────────────────────────────────────────── */
  // flags: P = no price, H = no photos, S = hidden on site, F = feed excluded, D = sale pending
  var V = [
    ['C2381',  2023, 'Porsche',       '911 GT3 RS',       'Weissach Package',        'Arctic Grey',        '#b9bcc0', 349900, 12,  '',     1],
    ['C2377',  2022, 'Ferrari',       '296 GTB',          'Assetto Fiorano',         'Rosso Corsa',        '#c8202c', 419500, 27,  '',     1],
    ['C2368',  2021, 'Lamborghini',   'Huracán STO',      '',                        'Arancio Borealis',   '#e8681c', 0,      41,  'P',    1],
    ['C2360',  2019, 'McLaren',       '720S',             'Performance',             'Papaya Spark',       '#f08a24', 279000, 58,  '',     1],
    ['C2352A', 2024, 'Mercedes-Benz', 'G 63 AMG',         '4x4 Squared',             'Obsidian Black',     '#26282b', 0,      66,  'PH',   0],
    ['C2349',  2020, 'Bentley',       'Continental GT',   'V8 Mulliner',             'Beluga',             '#1d1f22', 199800, 93,  '',     1],
    ['C2340',  1967, 'Chevrolet',     'Corvette',         'LS3 Restomod',            'Goodwood Green',     '#2f5b3f', 259500, 104, 'F',    1],
    ['C2333',  2018, 'Aston Martin',  'DB11',             'V12 Launch Edition',      'Magnetic Silver',    '#a7abb0', 0,      118, 'PS',   0],
    ['C2327',  2016, 'Kenworth',      'W900L',            'ICON 900 Sleeper',        'Daydream Blue',      '#2b64b8', 100800, 132, 'SF',   1],
    ['C2320',  2005, 'Porsche',       'Carrera GT',       '',                        'GT Silver Metallic', '#b4b7bb', 0,      151, 'P',    1],
    ['C2314',  2022, 'Rolls-Royce',   'Cullinan',         'Black Badge',             'Tempest Grey',       '#5c6066', 469000, 163, 'D',    1],
    ['C2308',  1995, 'Ford',          'Mustang SVT Cobra','R',                       'Bright Red',         '#d0261f', 69500,  178, 'H',    0],
    ['C2301',  2017, 'Kia',           'Forte',            'LX Sedan',                'Snow White Pearl',   '#e9eaea', 0,      201, 'PHSF', 0],
    ['C2296',  2021, 'Land Rover',    'Defender 110',     'X-Dynamic SE',            'Pangea Green',       '#48584a', 68900,  214, '',     1],
    ['C2290',  2019, 'Audi',          'RS 5',             'Sportback',               'Nardo Grey',         '#8d9094', 0,      233, 'PH',   0],
    ['C2283',  1989, 'Mercedes-Benz', '190E 2.5-16',      'Evolution',               'Blue-Black',         '#1c2338', 259500, 262, 'F',    1],
    ['C2277',  2010, 'Peterbilt',     '384',              'Single Axle',             'White',              '#eeeeea', 42800,  301, 'S',    1],
    ['C2270',  2014, 'Dodge',         'SRT Viper',        'GTS',                     'Venom Black',        '#1a1a1c', 0,      348, 'PD',   1],
    ['C2264',  2000, 'Ford',          'Mustang SVT Cobra','R',                       'Performance Red',    '#b81f22', 0,      412, 'PHSF', 0],
    ['C2258',  2021, 'SUNDOWNER',     'Sunlite Argo 40GN','Trailer',                 'White',              '#ececea', 0,      533, 'PHSF', 0],
    ['C2251',  1998, 'Porsche',       '911 Turbo',        'X50 Coupe',               'Red',                '#c3242b', 0,      588, 'PHSF', 0],
    ['C2244',  1971, 'Lamborghini',   'Espada',           'Series II',               'Silver',             '#b5b8bc', 149500, 727, 'F',    1]
  ].map(function (r, i) {
    return { id: 'v' + i, stock: r[0], year: r[1], make: r[2], model: r[3], trim: r[4], ext: r[5], hex: r[6], price: r[7] || null, days: r[8],
      no_price: r[9].indexOf('P') >= 0, no_photos: r[9].indexOf('H') >= 0, hidden: r[9].indexOf('S') >= 0, feed_excluded: r[9].indexOf('F') >= 0, sale_pending: r[9].indexOf('D') >= 0,
      photo: !!r[10], status: 'Available', lock: i === 8 ? 'Being edited by Ivaylo Guenkov since 09/09/2026 08:52 PM' : null };
  });
  V.forEach(function (v) { v.issues = ['no_price', 'no_photos', 'hidden', 'feed_excluded', 'sale_pending'].filter(function (k) { return v[k]; }).length; });

  var MAKES = [['Porsche',54],['Ford',47],['Ferrari',42],['Lamborghini',27],['McLaren',20],['Mercedes-Benz',20],['Chevrolet',16],['Dodge',12],['Land Rover',12],['Audi',11],['BMW',9],['Ducati',9],['Cadillac',7],['Nissan',6],['Bentley',5],['Kenworth',4],['Peterbilt',4],['Acura',3],['Aston Martin',3],['GMC',3],['Rolls-Royce',3],['Tesla',3],['Jeep',2],['Karma',2],['Toyota',2],['Kia',1],['Koenigsegg',1],['Lexus',1],['Rimac',1],['RUF',1],['Subaru',1],['SUNDOWNER',1]];
  var ATTN = { no_price: 'No price', no_photos: 'No photos', hidden: 'Hidden on site', feed_excluded: 'Excluded from feeds', sale_pending: 'Sale pending', aging365: 'Aging over 1 year' };
  var AGE = { fresh: 'New ≤ 30d', mid: '31–90 days', late: '91–365 days', stale: 'Over 1 year' };
  var MX = [
    { k: 'no_price',      h: 'No price',  icon: 'i-tag-off', tone: '' },
    { k: 'no_photos',     h: 'No photos', icon: 'i-cam-off', tone: '' },
    { k: 'hidden',        h: 'Hidden',    icon: 'i-eye-off', tone: 'slate' },
    { k: 'feed_excluded', h: 'No feed',   icon: 'i-ban',     tone: 'danger' },
    { k: 'sale_pending',  h: 'Pending',   icon: 'i-clock',   tone: 'violet' }
  ];

  var S = { sort: 'stock', dir: 'asc', attn: {}, age: null, makes: {}, sel: {}, view: 'table', lane: 'Available' };

  /* ── cells ────────────────────────────────────────────────────────── */
  function band(d) { return d <= 30 ? 'fresh' : d <= 90 ? 'mid' : d <= 365 ? 'late' : 'stale'; }
  function ageLabel(d) { return d > 365 ? (d / 365).toFixed(1) + 'y' : d + 'd'; }
  function thumb(v) {
    if (!v.photo) return '<span class="thumb thumb--none">No photo</span>';
    return '<span class="thumb" style="--ph:' + v.hex + '22;--car:' + v.hex + '"><svg><use href="#car"/></svg></span>';
  }
  function price(v) { return v.price == null ? '<span class="price price--none">No price</span>' : '<span class="price"><em>$</em>' + v.price.toLocaleString('en-US') + '</span>'; }
  function age(v) { var b = band(v.days), w = Math.min(100, Math.round(v.days / 730 * 100)); return '<span class="age age--' + b + '" title="' + v.days.toLocaleString('en-US') + ' days in stock"><i style="--w:' + w + '%"></i>' + ageLabel(v.days) + '</span>'; }
  function mark(v, m) { return v[m.k] ? '<span class="mark' + (m.tone ? ' mark--' + m.tone : '') + '" title="' + esc(m.h) + '"></span>' : '<span class="mark mark--none" aria-hidden="true"></span>'; }
  function acts(v) {
    return '<span class="acts"><a class="ract" href="#" title="Edit vehicle" data-stop>' + ic('i-edit') + '</a><a class="ract" href="#" title="Photos" data-stop>' + ic('i-cam') + '</a><a class="ract" href="#" title="Window sticker" data-stop>' + ic('i-print') + '</a><button class="ract" type="button" title="More" data-menu="' + v.id + '" data-stop>' + ic('i-more') + '</button></span>';
  }

  var COLS = [
    { k: 'ck', cls: 'c-ck', th: '<th class="ck"><span class="ck"><input type="checkbox" id="ck-all" aria-label="Select all"></span></th>' },
    { k: 'th', cls: 'c-th', th: '<th></th>' },
    { k: 'stock', cls: 'c-id', label: 'Stock', sort: 'stock' },
    { k: 'veh', cls: 'c-veh', label: 'Vehicle', sort: 'make' },
    { k: 'trim', cls: 'c-trim', label: 'Trim', sort: 'trim' },
    { k: 'ext', cls: 'c-ext', label: 'Ext. color', sort: 'ext' },
    { k: 'price', cls: 'c-price', label: 'Price', sort: 'price', r: true },
    { k: 'age', cls: 'c-age', label: 'Age', sort: 'days', r: true },
    { k: 'st', cls: 'c-st', label: 'Status', sort: 'status' },
    { k: 'mx', cls: 'c-mx' },
    { k: 'act', cls: 'c-act', th: '<th></th>' }
  ];

  function sorted() {
    var k = S.sort, d = S.dir === 'asc' ? 1 : -1;
    var rows = V.filter(function (v) {
      for (var a in S.attn) if (S.attn[a]) { if (a === 'aging365' ? v.days <= 365 : !v[a]) return false; }
      if (S.age && band(v.days) !== S.age) return false;
      var mk = Object.keys(S.makes).filter(function (m) { return S.makes[m]; });
      if (mk.length && mk.indexOf(v.make) < 0) return false;
      return true;
    });
    return rows.sort(function (a, b) {
      var x = a[k], y = b[k];
      if (k === 'price') { x = x == null ? -1 : x; y = y == null ? -1 : y; }
      if (k === 'issues') { x = -a.issues; y = -b.issues; }
      if (typeof x === 'string') { x = x.toLowerCase(); y = y.toLowerCase(); }
      return (x > y ? 1 : x < y ? -1 : 0) * d;
    });
  }

  function render() {
    $('#cg').innerHTML = COLS.map(function (c) { return c.k === 'mx' ? MX.map(function () { return '<col class="c-mx">'; }).join('') : '<col class="' + c.cls + '">'; }).join('');
    $('#thg').innerHTML = COLS.map(function (c) { return c.k === 'mx' ? '<th class="g" colspan="' + MX.length + '">Attention · click to filter</th>' : '<th></th>'; }).join('');
    $('#thr').innerHTML = COLS.map(function (c) {
      if (c.th) return c.th;
      if (c.k === 'mx') return MX.map(function (m, i) {
        var on = S.attn[m.k];
        return '<th class="mx' + (i === 0 ? ' mx--l' : '') + (i === MX.length - 1 ? ' mx--r' : '') + (on ? ' mx--on' : '') + '"><button type="button" data-attn="' + m.k + '" title="' + esc(m.h) + ' — click to filter">' + ic(m.icon) + '<span>' + esc(m.h) + '</span></button></th>';
      }).join('');
      var on = S.sort === c.sort;
      return '<th' + (c.r ? ' class="r"' : '') + '><button class="sort' + (on ? ' sort--on' : '') + '" type="button" data-sort="' + c.sort + '"><span>' + esc(c.label) + '</span>' + ic(on && S.dir === 'desc' ? 'i-dn' : 'i-up') + '</button></th>';
    }).join('');
    var list = sorted();
    $('#tb').innerHTML = list.map(function (v) {
      var tds = COLS.map(function (c) {
        switch (c.k) {
          case 'ck': return '<td class="ck"><span class="ck"><input type="checkbox" data-sel="' + v.id + '"' + (S.sel[v.id] ? ' checked' : '') + ' aria-label="Select ' + esc(v.stock) + '"></span></td>';
          case 'th': return '<td>' + thumb(v) + '</td>';
          case 'stock': return '<td><a class="id" href="#" data-stop>' + esc(v.stock) + '</a>' + (v.lock ? '<span class="lock" title="' + esc(v.lock) + '">' + ic('i-lock') + '</span>' : '') + '</td>';
          case 'veh': return '<td><span class="veh"><em>' + v.year + '</em>' + esc(v.make) + ' ' + esc(v.model) + '</span></td>';
          case 'trim': return '<td class="trim" title="' + esc(v.trim) + '">' + (v.trim ? esc(v.trim) : '<span style="color:var(--ink-4)">—</span>') + '</td>';
          case 'ext': return '<td title="' + esc(v.ext) + '">' + esc(v.ext) + '</td>';
          case 'price': return '<td class="r">' + price(v) + '</td>';
          case 'age': return '<td class="r">' + age(v) + '</td>';
          case 'st': return '<td><span class="tag tag--ok">Available</span></td>';
          case 'mx': return MX.map(function (m, i) { return '<td class="mx' + (i === 0 ? ' mx--l' : '') + (i === MX.length - 1 ? ' mx--r' : '') + '">' + mark(v, m) + '</td>'; }).join('');
          case 'act': return '<td class="r">' + acts(v) + '</td>';
        }
      }).join('');
      return '<tr data-id="' + v.id + '" class="' + (S.sel[v.id] ? 'sel' : '') + '" tabindex="0">' + tds + '</tr>';
    }).join('');
    var lab = { stock: 'Stock', year: 'Year', make: 'Make', model: 'Model', trim: 'Trim', ext: 'Ext. color', price: 'Price', status: 'Status', days: 'Age', issues: 'Attention' };
    $('#sort-v').textContent = lab[S.sort] + (S.dir === 'asc' ? ' ↑' : ' ↓');
    $$('#p-sort [data-sort]').forEach(function (b) { b.classList.toggle('menu__it--on', b.dataset.sort === S.sort); });
    $$('#p-sort [data-dir]').forEach(function (b) { b.classList.toggle('menu__it--on', b.dataset.dir === S.dir); });
    $$('.listbar__info b:first-child, .footbar .listbar__info b:first-child').forEach(function (b) { b.textContent = list.length ? '1–' + list.length : '0'; });
    renderChips(); renderBulk();
  }

  function renderChips() {
    var items = [];
    Object.keys(S.attn).forEach(function (k) { if (S.attn[k]) items.push({ cls: 'chip--attn', k: 'Attention', v: ATTN[k], off: function () { setAttn(k, false); } }); });
    if (S.age) items.push({ cls: 'chip--attn', k: 'Age', v: AGE[S.age], off: function () { setAge(null); } });
    Object.keys(S.makes).forEach(function (m) { if (S.makes[m]) items.push({ cls: '', k: 'Make', v: m, off: function () { S.makes[m] = false; renderMakes(); } }); });
    var box = $('#chips'); box.hidden = !items.length; box._items = items;
    box.innerHTML = items.length ? '<span class="chips__l">Filters</span>' + items.map(function (it, i) { return '<span class="chip ' + it.cls + '"><span class="chip__k">' + it.k + '</span>' + esc(it.v) + '<button class="chip__x" type="button" data-chip="' + i + '" aria-label="Remove">' + ic('i-x') + '</button></span>'; }).join('') + '<button class="chips__clear" type="button" data-act="clear-all">Clear all</button>' : '';
    var mk = Object.keys(S.makes).filter(function (m) { return S.makes[m]; });
    $('#make-v').textContent = !mk.length ? 'Any' : mk.length === 1 ? mk[0] : mk[0] + ' +' + (mk.length - 1);
    $('[data-pop="p-make"]').classList.toggle('facet__b--on', mk.length > 0);
  }
  function renderBulk() {
    var n = Object.keys(S.sel).filter(function (k) { return S.sel[k]; }).length;
    $('#bulk').hidden = n === 0; $('#listbar').hidden = n > 0; $('#bulk-n').textContent = n;
  }
  function renderMakes() {
    $('#make-list').innerHTML = MAKES.map(function (m) { return '<label class="pop__it" data-v="' + esc(m[0].toLowerCase()) + '"><input type="checkbox" data-make="' + esc(m[0]) + '"' + (S.makes[m[0]] ? ' checked' : '') + '><span>' + esc(m[0]) + '</span><span class="c">' + m[1] + '</span></label>'; }).join('');
  }
  function renderCols() {
    var names = ['Photo', 'Stock #', 'Vehicle (year · make · model)', 'Trim', 'Exterior color', 'Price', 'Days in stock', 'Status', 'Attention matrix', 'Actions'];
    $('#cols-list').innerHTML = names.map(function (n) { return '<div class="pop__it"><span class="ract" style="cursor:grab">' + ic('i-drag') + '</span><span>' + n + '</span><button class="ract" type="button" title="Remove">' + ic('i-x') + '</button></div>'; }).join('');
  }
  function setAttn(k, on) { S.attn[k] = on; $$('[data-attn="' + k + '"].arow').forEach(function (b) { b.classList.toggle('arow--on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }); render(); }
  function setAge(b) { S.age = b; $$('[data-age]').forEach(function (el) { var on = el.dataset.age === b; el.classList.toggle('agemeter__seg--on', on && el.classList.contains('agemeter__seg')); el.classList.toggle('agel--on', on && el.classList.contains('agel')); }); render(); }

  /* ── popovers ─────────────────────────────────────────────────────── */
  function closePops() { $$('.pop--open').forEach(function (p) { p.classList.remove('pop--open'); }); $$('[data-pop]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); b.classList.remove('facet__b--open'); }); }
  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-pop]'))) { var p = $('#' + el.dataset.pop), open = p.classList.contains('pop--open'); closePops(); if (!open) { p.classList.add('pop--open'); el.setAttribute('aria-expanded', 'true'); el.classList.add('facet__b--open'); } return; }
    if (t.closest('.pop') && !t.closest('#rowmenu')) return;
    closePops();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePops(); $('#modal').classList.remove('modal--open'); }
    if (e.key === '/' && !/input|select|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); }
  });

  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-act="theme"]'))) { var th = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', th); try { localStorage.setItem('aan-theme', th); } catch (x) {} return; }
    if ((el = t.closest('[data-act="insights"]'))) { var ins = $('#insights'); ins.hidden = !ins.hidden; el.classList.toggle('deckbtn--on', !ins.hidden); el.setAttribute('aria-expanded', String(!ins.hidden)); return; }
    if ((el = t.closest('[data-act="more"]'))) { var m = $('#more'); m.hidden = !m.hidden; $('[data-act="more"].facet__b').classList.toggle('facet__b--on', !m.hidden); return; }
    if ((el = t.closest('[data-lane]'))) { S.lane = el.dataset.lane; $$('[data-lane]').forEach(function (b) { b.classList.toggle('lane--on', b === el); b.setAttribute('aria-selected', b === el ? 'true' : 'false'); }); var n = el.querySelector('b').textContent; $('#scope-n').textContent = n; $('#scope-l').textContent = S.lane === 'All' ? 'All vehicles' : S.lane; return; }
    if ((el = t.closest('[data-attn]'))) { setAttn(el.dataset.attn, !S.attn[el.dataset.attn]); return; }
    if ((el = t.closest('[data-age]'))) { setAge(S.age === el.dataset.age ? null : el.dataset.age); return; }
    if ((el = t.closest('[data-chip]'))) { $('#chips')._items[+el.dataset.chip].off(); render(); return; }
    if ((el = t.closest('[data-act="clear-all"]'))) { S.attn = {}; S.makes = {}; $$('.arow--on').forEach(function (b) { b.classList.remove('arow--on'); }); setAge(null); renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="clear-makes"]'))) { S.makes = {}; renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="clear-sel"]'))) { S.sel = {}; render(); return; }
    if ((el = t.closest('th [data-sort], .sort'))) { var k = el.dataset.sort; if (S.sort === k) S.dir = S.dir === 'asc' ? 'desc' : 'asc'; else { S.sort = k; S.dir = 'asc'; } render(); return; }
    if ((el = t.closest('.menu__it[data-sort]'))) { S.sort = el.dataset.sort; S.dir = el.dataset.sort === 'issues' ? 'asc' : S.dir; render(); closePops(); return; }
    if ((el = t.closest('[data-dir]'))) { S.dir = el.dataset.dir; render(); closePops(); return; }
    if ((el = t.closest('[data-view]'))) { $$('[data-view]').forEach(function (b) { b.classList.toggle('seg__b--on', b === el); }); return; }
    if ((el = t.closest('[data-menu]'))) { e.preventDefault(); e.stopPropagation(); var r = el.getBoundingClientRect(), mnu = $('#rowmenu'); closePops(); mnu.classList.add('pop--open'); mnu.style.top = (r.bottom + 4) + 'px'; mnu.style.left = Math.min(r.left, innerWidth - 230) + 'px'; mnu.dataset.id = el.dataset.menu; return; }
    if ((el = t.closest('[data-row]'))) { var id = $('#rowmenu').dataset.id; closePops(); if (el.dataset.row === 'delete') { var v = V.filter(function (x) { return x.id === id; })[0]; $('#modal-name').textContent = v ? v.stock + ' · ' + v.year + ' ' + v.make + ' ' + v.model : 'this vehicle'; $('#modal').classList.add('modal--open'); } return; }
    if ((el = t.closest('[data-act="bulk-delete"]'))) { $('#modal-name').textContent = $('#bulk-n').textContent + ' selected vehicles'; $('#modal').classList.add('modal--open'); return; }
    if ((el = t.closest('[data-act="close"]'))) { $('#modal').classList.remove('modal--open'); return; }
    if ((el = t.closest('tr[data-id]')) && !t.closest('[data-stop]') && !t.closest('.ck')) { el.classList.add('sel'); setTimeout(function () { if (!S.sel[el.dataset.id]) el.classList.remove('sel'); }, 300); return; }
    if (t.closest('a[href="#"]')) e.preventDefault();
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-make]')) { S.makes[t.dataset.make] = t.checked; render(); }
    if (t.matches('[data-sel]')) { S.sel[t.dataset.sel] = t.checked; t.closest('tr').classList.toggle('sel', t.checked); renderBulk(); }
    if (t.id === 'ck-all') { sorted().forEach(function (v) { S.sel[v.id] = t.checked; }); render(); }
  });
  document.addEventListener('input', function (e) {
    if (e.target.matches('[data-filter]')) { var q = e.target.value.toLowerCase(); $$('#' + e.target.dataset.filter + ' .pop__it').forEach(function (it) { it.style.display = it.dataset.v.indexOf(q) >= 0 ? '' : 'none'; }); }
  });

  for (var y = 2027; y >= 1929; y--) { $('#y1').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); $('#y2').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); }
  renderMakes(); renderCols(); render();
})();
