/* Gen 7 — workspace behaviour: rows as objects, dock (vehicle / filters), lot lenses, selection tray. Prototype JS. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (id) { return '<svg class="i"><use href="#' + id + '"/></svg>'; };
  var V = window.G7 || [];
  V.forEach(function (v, i) { v.id = 'v' + i; });
  var TONE = { 'Feed off': 'danger', 'Hidden': 'slate', 'Pending': 'violet' };
  var ATTN = { no_price: 'No price', no_photos: 'No photos', feed_off: 'Feed off', hidden: 'Hidden', aging: 'Aging > 1 yr', pending: 'Pending' };
  var AGE = { fresh: 'New ≤ 30 days', mid: '31–90 days', late: '91–365 days', stale: 'Over 1 year' };
  var COL = { fresh: 'var(--age-fresh)', mid: 'var(--age-mid)', late: 'var(--age-late)', stale: 'var(--age-stale)' };
  var S = { sort: 'days', dir: 'desc', attn: {}, age: null, makes: {}, sel: {}, lane: 'Available', dock: null, cur: null };
  var MAKES = [['Porsche',54],['Ford',47],['Ferrari',42],['Lamborghini',27],['McLaren',20],['Mercedes-Benz',20],['Chevrolet',16],['Dodge',12],['Land Rover',12],['Audi',11],['BMW',9],['Bentley',5],['Kenworth',4],['Peterbilt',4],['Aston Martin',3],['Rolls-Royce',3],['Jensen',2],['Toyota',2],['Chaparral',1],['Honda',1],['Kia',1],['Terex',1],['SUNDOWNER',1]];

  function band(d) { return d <= 30 ? 'fresh' : d <= 90 ? 'mid' : d <= 365 ? 'late' : 'stale'; }
  function lab(d) { return d > 365 ? (d / 365).toFixed(1) + 'y' : d + 'd'; }
  function fmt(n) { return n == null ? null : '$' + n.toLocaleString('en-US'); }

  function list() {
    return V.filter(function (v) {
      for (var k in S.attn) if (S.attn[k]) {
        if (k === 'aging') { if (v.d <= 365) return false; }
        else if (v.f.indexOf(ATTN[k]) < 0) return false;
      }
      if (S.age && band(v.d) !== S.age) return false;
      var mk = Object.keys(S.makes).filter(function (m) { return S.makes[m]; });
      if (mk.length && mk.indexOf(v.mk) < 0) return false;
      return true;
    }).sort(function (a, b) {
      var k = S.sort, d = S.dir === 'asc' ? 1 : -1, x, y;
      if (k === 'issues') { x = -a.f.length; y = -b.f.length; }
      else if (k === 'stock') { x = a.s; y = b.s; }
      else if (k === 'year') { x = a.y; y = b.y; }
      else if (k === 'make') { x = a.mk.toLowerCase(); y = b.mk.toLowerCase(); }
      else if (k === 'price') { x = a.p == null ? -1 : a.p; y = b.p == null ? -1 : b.p; }
      else { x = a.d; y = b.d; }
      return (x > y ? 1 : x < y ? -1 : 0) * d;
    });
  }

  function row(v) {
    var b = band(v.d), max = S.dock ? 1 : (v.f.length > 3 ? 2 : 3), tags = v.f.slice(0, max), rest = v.f.length - tags.length;
    return '<div class="row' + (S.sel[v.id] ? ' sel' : '') + (S.cur === v.id ? ' open' : '') + '" data-id="' + v.id + '">' +
      '<input class="ck" type="checkbox" data-sel="' + v.id + '"' + (S.sel[v.id] ? ' checked' : '') + ' aria-label="Select">' +
      (v.t ? '<img class="th" alt="" src="img/' + esc(v.t) + '">' : '<span class="th th--none" title="No photos uploaded">' + ic('i-cam-off') + '</span>') +
      '<div class="id"><span class="id__n" title="' + v.y + ' ' + esc(v.mk) + ' ' + esc(v.md) + '"><em>' + v.y + '</em>' + esc(v.mk) + ' ' + esc(v.md) + '</span><span class="id__m"><span class="idtag">' + esc(v.s) + '</span>' + (v.lock ? '<span class="lock" title="Being edited by another user">' + ic('i-lock') + '</span>' : '') + '<span class="id__vin"><span>VIN</span>' + esc(v.vin) + '</span></span></div>' +
      '<div class="spec"><span class="spec__t" title="' + esc(v.tr) + '">' + (v.tr ? esc(v.tr) : '<span style="color:var(--ink-4)">No trim recorded</span>') + '</span><span class="spec__c"><span class="sw" style="--c:' + v.hx + '"></span>' + esc(v.c) + '</span></div>' +
      (v.p != null ? '<div class="price"><em>$</em>' + v.p.toLocaleString('en-US') + '</div>' : '<div class="price price--none">—</div>') +
      '<div class="age age--' + b + '" title="' + v.d.toLocaleString('en-US') + ' days in stock"><i style="--w:' + Math.min(100, Math.round(v.d / 730 * 100)) + '%;--b:' + COL[b] + '"></i>' + lab(v.d) + '</div>' +
      '<div class="tags">' + (tags.length ? tags.map(function (t) { return '<span class="tag' + (TONE[t] ? ' tag--' + TONE[t] : '') + '">' + esc(t) + '</span>'; }).join('') + (rest > 0 ? '<span class="tag tag--more" title="' + esc(v.f.slice(tags.length).join(' · ')) + '">+' + rest + '</span>' : '') : '') + '</div>' +
      '<span></span>' +
      '<span class="acts"><button type="button" title="Edit vehicle" data-stop>' + ic('i-edit') + '</button><button type="button" title="Photos" data-stop>' + ic('i-cam') + '</button><button type="button" title="Window sticker" data-stop>' + ic('i-print') + '</button><button type="button" title="More" data-stop>' + ic('i-more') + '</button></span>' +
      '</div>';
  }

  function render() {
    var L = list();
    $('#tb').innerHTML = L.map(row).join('');
    $('#shown').textContent = (L.length ? '1–' + L.length : '0') + ' of ' + (Object.keys(S.attn).some(function (k) { return S.attn[k]; }) || S.age ? L.length : 359);
    // scope line
    var chips = [];
    Object.keys(S.attn).forEach(function (k) { if (S.attn[k]) chips.push({ cls: 'chip--attn', v: ATTN[k], off: function () { setAttn(k, false); } }); });
    if (S.age) chips.push({ cls: 'chip--attn', v: AGE[S.age], off: function () { setAge(null); } });
    Object.keys(S.makes).forEach(function (m) { if (S.makes[m]) chips.push({ cls: '', v: m, off: function () { S.makes[m] = false; renderMakes(); } }); });
    $('#scope').innerHTML = '<span class="scope__n" id="scope-name">' + (S.lane === 'All' ? 'All vehicles' : S.lane) + '</span><span>·</span><span><b>' + (chips.length ? L.length : 359) + '</b> vehicles</span>' +
      (chips.length ? '<span style="color:var(--ink-4)">filtered by</span>' + chips.map(function (c, i) { return '<span class="chip ' + c.cls + '">' + esc(c.v) + '<button class="chip__x" type="button" data-chip="' + i + '" aria-label="Remove">' + ic('i-x') + '</button></span>'; }).join('') + '<button class="scope__clear" type="button" data-act="clear-all">Clear all</button>' : '') +
      '<span class="scope__sp"></span><span class="scope__meta">' + (L.length ? '1–' + L.length : '0') + ' shown</span>';
    $('#scope')._chips = chips;
    $('#make-v').textContent = (function () { var mk = Object.keys(S.makes).filter(function (m) { return S.makes[m]; }); return !mk.length ? 'Any' : mk.length === 1 ? mk[0] : mk[0] + ' +' + (mk.length - 1); })();
    $('[data-pop="p-make"]').classList.toggle('facet__b--on', Object.keys(S.makes).some(function (m) { return S.makes[m]; }));
    $$('#p-sort [data-sort]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.sort === S.sort); });
    $$('#p-sort [data-dir]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.dir === S.dir); });
    $('#sort-v').textContent = ({ days: 'Age', price: 'Price', stock: 'Stock', year: 'Year', make: 'Make', issues: 'Attention' })[S.sort] + (S.dir === 'asc' ? ' ↑' : ' ↓');
    var n = Object.keys(S.sel).filter(function (k) { return S.sel[k]; }).length;
    $('#tray').classList.toggle('tray--on', n > 0); $('#tray-n').textContent = n;
  }
  function renderMakes() { $('#make-list').innerHTML = MAKES.map(function (m) { return '<label class="pop__it"><input class="ck" type="checkbox" data-make="' + esc(m[0]) + '"' + (S.makes[m[0]] ? ' checked' : '') + '><span>' + esc(m[0]) + '</span><span class="c">' + m[1] + '</span></label>'; }).join(''); }
  function setAttn(k, on) { S.attn[k] = on; $$('.ar[data-attn="' + k + '"]').forEach(function (b) { b.classList.toggle('ar--on', on); }); render(); }
  function setAge(b) { S.age = b; $$('[data-age]').forEach(function (el) { el.classList.toggle('on', el.dataset.age === b); }); render(); }
  function setLane(l) { S.lane = l; $$('[data-lane]').forEach(function (b) { b.classList.toggle('lane--on', b.dataset.lane === l); }); var n = $('[data-lane="' + l + '"] b').textContent; $('#scope-n').textContent = n; $('#scope-l').textContent = l === 'All' ? 'All on file' : l; render(); }

  /* ── dock ─────────────────────────────────────────────────────────── */
  function openDock(kind) { S.dock = kind; $('#app').classList.add('dock-open'); $('[data-act="filters"]').classList.toggle('facet__b--on', kind === 'filters'); }
  function closeDock() { S.dock = null; S.cur = null; $('#app').classList.remove('dock-open'); $('[data-act="filters"]').classList.remove('facet__b--on'); render(); }
  function showVehicle(id) {
    var v = V.filter(function (x) { return x.id === id; })[0]; if (!v) return;
    S.cur = id; var L = list(), idx = L.indexOf(v);
    $('#dock-t').textContent = 'Vehicle'; $('#dock-nav').hidden = false; $('#dock-f').hidden = true;
    var b = band(v.d);
    var has = function (t) { return v.f.indexOf(t) >= 0; };
    $('#dock-b').innerHTML =
      '<div class="veh__img">' + (v.t ? '<img alt="" src="img/' + esc(v.t) + '">' : '<div class="none">No photos uploaded</div>') + '<span class="cnt">' + (idx + 1) + ' of ' + L.length + '</span></div>' +
      '<div class="veh__n"><em>' + v.y + '</em>' + esc(v.mk) + ' ' + esc(v.md) + '</div>' +
      '<div class="veh__m"><span class="idtag">' + esc(v.s) + '</span><span class="mono">VIN ' + esc(v.vin) + '</span><span>· Available</span>' + (v.lock ? '<span class="lock" title="Being edited by another user">' + ic('i-lock') + '</span>' : '') + '</div>' +
      '<div class="veh__kv"><div><div class="v' + (v.p == null ? ' warn' : '') + '">' + (v.p == null ? 'No asking price' : fmt(v.p)) + '</div><div class="l">asking price</div></div><div><div class="v" style="color:' + (b === 'stale' ? 'var(--danger)' : b === 'fresh' ? 'var(--ok)' : 'var(--ink)') + '">' + lab(v.d) + '</div><div class="l">' + v.d.toLocaleString('en-US') + ' days in stock</div></div><div><div class="v">' + (v.ph || 0) + '</div><div class="l">photos</div></div></div>' +
      '<div class="veh__sec"><span class="caps">Merchandising health</span><div class="health">' +
        '<div class="hl ' + (has('No price') ? 'hl--bad' : 'hl--ok') + '"><i>' + (has('No price') ? '!' : '✓') + '</i>' + (has('No price') ? 'No asking price' : 'Priced') + '</div>' +
        '<div class="hl ' + (has('No photos') ? 'hl--bad' : 'hl--ok') + '"><i>' + (has('No photos') ? '!' : '✓') + '</i>' + (has('No photos') ? 'No photos' : (v.ph || 0) + ' photos') + '</div>' +
        '<div class="hl ' + (has('Feed off') ? 'hl--red' : 'hl--ok') + '"><i>' + (has('Feed off') ? '✕' : '✓') + '</i>' + (has('Feed off') ? 'Excluded from feeds' : 'Feeding to partners') + '</div>' +
        '<div class="hl ' + (has('Hidden') ? 'hl--bad' : 'hl--ok') + '"><i>' + (has('Hidden') ? '!' : '✓') + '</i>' + (has('Hidden') ? 'Hidden on site' : 'Shown on site') + '</div>' +
        '<div class="hl hl--ok"><i>✓</i>VIN decoded</div>' +
        '<div class="hl ' + (has('Pending') ? '' : 'hl--ok') + '"><i' + (has('Pending') ? ' style="background:var(--violet-soft);color:var(--violet)"' : '') + '>' + (has('Pending') ? '◔' : '✓') + '</i>' + (has('Pending') ? 'Sale pending' : 'No pending sale') + '</div>' +
      '</div></div>' +
      '<div class="veh__sec"><span class="caps">Specification</span><div class="spec2"><div><span>Trim</span><span title="' + esc(v.tr) + '">' + (esc(v.tr) || '—') + '</span></div><div><span>Exterior</span><span>' + esc(v.c) + '</span></div><div><span>Type</span><span>Used</span></div><div><span>Location</span><span>Chicago Motor Cars</span></div><div><span>Stock #</span><span class="mono">' + esc(v.s) + '</span></div><div><span>Modified</span><span>3 days ago</span></div></div></div>' +
      '<div class="veh__acts"><button class="btn btn--primary" type="button">' + ic('i-edit') + ' Edit vehicle</button><button class="btn btn--sheet" type="button">' + ic('i-cam') + ' Photos</button><button class="btn btn--sheet" type="button">' + ic('i-print') + ' Window sticker</button><button class="btn btn--sheet" type="button">' + ic('i-file') + ' Carfax</button><button class="btn btn--sheet" type="button">' + ic('i-rss') + ' Feed on / off</button><button class="btn btn--quiet" type="button" style="color:var(--danger)">' + ic('i-trash') + ' Delete…</button></div>';
    openDock('vehicle'); render();
    var r = $('.row[data-id="' + id + '"]'); if (r) r.scrollIntoView({ block: 'nearest' });
  }
  function showFilters() {
    S.cur = null; $('#dock-t').textContent = 'Filters'; $('#dock-nav').hidden = true; $('#dock-f').hidden = false;
    $('#dock-b').innerHTML =
      '<div class="grp"><span class="caps">Identity</span><div class="f2"><label class="f"><span>Type</span><select class="sel"><option>Any</option><option>New</option><option>Used</option></select></label><label class="f"><span>Location</span><select class="sel"><option>All rooftops</option><option>Boats</option><option>Chicago Motor Cars</option><option>CMC · KC</option><option>CMC · Naperville</option><option>CMC · SC</option><option>CMS Diesel</option></select></label></div><div class="f2"><label class="f"><span>Stock #</span><input class="fld" type="search" placeholder="Exact stock"></label><label class="f"><span>VIN</span><input class="fld" type="search" placeholder="Full or partial"></label></div></div>' +
      '<div class="grp"><span class="caps">Merchandising</span><label class="f"><span>Display on site</span><select class="sel"><option>All</option><option>Hidden</option><option>Displayed</option></select></label><div class="f2"><label class="f"><span>Outbound feed</span><select class="sel"><option>Any</option><option>Excluded</option><option>Feeding</option></select></label><label class="f"><span>Pending sale</span><select class="sel"><option>All</option><option>Pending only</option></select></label></div></div>' +
      '<div class="grp"><span class="caps">Colour</span><div class="f2"><label class="f"><span>Exterior</span><input class="fld" type="search" placeholder="e.g. Rosso"></label><label class="f"><span>Interior</span><input class="fld" type="search" placeholder="e.g. Tan"></label></div></div>' +
      '<div class="grp"><span class="caps">Audit</span><label class="f"><span>Missing items</span><select class="sel"><option value="">— any —</option><optgroup label="Photos"><option>Images</option><option>1 image or less</option></optgroup><optgroup label="Identity"><option>VIN decoding</option><option>Stock number</option><option>Make</option><option>Model</option><option>Trim</option><option>Year</option><option>VIN number</option><option>Vehicle type</option></optgroup><optgroup label="Specs"><option>Body</option><option>Transmission</option><option>Mileage</option><option>Exterior colour</option><option>Interior colour</option><option>Fuel</option><option>Location</option></optgroup><optgroup label="Pricing"><option>Price</option><option>Discounted price</option><option>Invoice price</option><option>Lease price</option><option>Lease term</option></optgroup><optgroup label="Copy"><option>Intro description</option><option>Caption</option><option>Main description</option><option>Bulleted text</option><option>Description 2</option><option>Buyers guide text</option></optgroup></select></label><div class="f"><span>Custom field</span><div class="pop__row"><select class="sel"><option value="">—</option><option>cfx_date</option><option>trucks_and_equipment</option><option>ove_feed_data</option><option>no_carfax</option><option>pending_sale_name</option><option>truck_trailer</option><option>images_timestamp</option><option>no_vin</option><option>carfax_timestamp</option></select><input class="fld" type="search" placeholder="value…"></div></div></div>';
    openDock('filters'); render();
  }

  /* ── events ───────────────────────────────────────────────────────── */
  function closePops() { $$('.pop--open').forEach(function (p) { p.classList.remove('pop--open'); }); }
  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-pop]'))) { var p = $('#' + el.dataset.pop), open = p.classList.contains('pop--open'); closePops(); if (!open) p.classList.add('pop--open'); return; }
    if (!t.closest('.pop')) closePops();
    if ((el = t.closest('[data-act="filters"]'))) { if (S.dock === 'filters') closeDock(); else showFilters(); return; }
    if ((el = t.closest('[data-act="close"]'))) { closeDock(); return; }
    if ((el = t.closest('[data-act="prev"], [data-act="next"]'))) { var L = list(), i = L.findIndex(function (x) { return x.id === S.cur; }); var n = L[(i + (el.dataset.act === 'next' ? 1 : -1) + L.length) % L.length]; if (n) showVehicle(n.id); return; }
    if ((el = t.closest('[data-lane]'))) { setLane(el.dataset.lane); return; }
    if ((el = t.closest('.ar[data-attn]'))) { setAttn(el.dataset.attn, !S.attn[el.dataset.attn]); return; }
    if ((el = t.closest('[data-age]'))) { setAge(S.age === el.dataset.age ? null : el.dataset.age); return; }
    if ((el = t.closest('[data-chip]'))) { $('#scope')._chips[+el.dataset.chip].off(); render(); return; }
    if ((el = t.closest('[data-act="clear-all"]'))) { S.attn = {}; S.makes = {}; $$('.ar--on').forEach(function (b) { b.classList.remove('ar--on'); }); setAge(null); renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="clear-makes"]'))) { S.makes = {}; renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="clear-sel"]'))) { S.sel = {}; render(); return; }
    if ((el = t.closest('.mn__it[data-sort]'))) { S.sort = el.dataset.sort; render(); closePops(); return; }
    if ((el = t.closest('.hd [data-sort]'))) { if (S.sort === el.dataset.sort) S.dir = S.dir === 'asc' ? 'desc' : 'asc'; else { S.sort = el.dataset.sort; } render(); return; }
    if ((el = t.closest('[data-dir]'))) { S.dir = el.dataset.dir; render(); closePops(); return; }
    if ((el = t.closest('.row[data-id]')) && !t.closest('[data-stop]') && !t.closest('.ck')) { showVehicle(el.dataset.id); return; }
    if (t.closest('a[href="#"]')) e.preventDefault();
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-make]')) { S.makes[t.dataset.make] = t.checked; render(); }
    if (t.matches('[data-sel]')) { S.sel[t.dataset.sel] = t.checked; render(); }
  });
  document.addEventListener('input', function (e) { if (e.target.matches('[data-filter]')) { var q = e.target.value.toLowerCase(); $$('#make-list .pop__it').forEach(function (it) { it.style.display = it.textContent.toLowerCase().indexOf(q) >= 0 ? '' : 'none'; }); } });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePops(); closeDock(); }
    if (e.key === '/' && !/input|select|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); }
  });
  for (var y = 2027; y >= 1929; y--) { $('#y1').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); $('#y2').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); }
  renderMakes(); render();
  window.G7demo = { showVehicle: showVehicle, showFilters: showFilters, closeDock: closeDock, V: V };
})();
