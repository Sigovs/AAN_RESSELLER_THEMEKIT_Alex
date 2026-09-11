/* All Vehicles — Gen 3 behaviour. 22 demo rows, local thumbs, no network. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (id, c) { return '<svg class="i ' + (c || '') + '"><use href="#' + id + '"/></svg>'; };

  var SW = [['silver', '#b7bbc1'], ['grey', '#8d9197'], ['gray', '#8d9197'], ['white', '#f0f0ec'], ['black', '#1c1d21'], ['red', '#c8272c'], ['blue', '#2a5db8'], ['green', '#2f6b47'], ['yellow', '#e8c027'], ['orange', '#e8721c'], ['verde', '#245c3e'], ['volcan', '#d8ad2c'], ['diamond', '#ece9e2']];
  function swatch(name) { var n = (name || '').toLowerCase(); for (var i = 0; i < SW.length; i++) if (n.indexOf(SW[i][0]) >= 0) return SW[i][1]; return '#c9ccd2'; }

  var V = (window.AAN_G3 || []).map(function (r, i) {
    var f = r.flags || [];
    return { id: 'v' + i, stock: r.stock, vin: r.vin, year: r.year, make: r.make, model: r.model, trim: r.trim || '', ext: r.ext || '', price: r.price, days: r.days, thumb: r.thumb, lock: r.lock, status: 'Available',
      no_price: f.some(function (t) { return /No price/.test(t); }), no_photos: f.some(function (t) { return /No photos/.test(t); }), hidden: f.some(function (t) { return /Hidden/.test(t); }), feed_excluded: f.some(function (t) { return /Excluded/.test(t); }), sale_pending: f.some(function (t) { return /Sale pend/.test(t); }) };
  });
  V.forEach(function (v) { v.issues = ['no_price', 'no_photos', 'hidden', 'feed_excluded', 'sale_pending'].filter(function (k) { return v[k]; }).length; });

  var MAKES = [['Porsche',54],['Ford',47],['Ferrari',42],['Lamborghini',27],['McLaren',20],['Mercedes-Benz',20],['Chevrolet',16],['Dodge',12],['Land Rover',12],['Audi',11],['BMW',9],['Ducati',9],['Cadillac',7],['Nissan',6],['Bentley',5],['Kenworth',4],['Peterbilt',4],['Acura',3],['Aston Martin',3],['GMC',3],['Rolls-Royce',3],['Tesla',3],['Jeep',2],['Jensen',2],['Karma',2],['Toyota',2],['Chaparral',1],['Honda',1],['Kia',1],['Koenigsegg',1],['Terex',1],['SUNDOWNER',1]];
  var ATTN = { no_price: 'No price', no_photos: 'No photos', hidden: 'Hidden on site', feed_excluded: 'Excluded from feeds', sale_pending: 'Sale pending', aging365: 'Aging over 1 year' };
  var AGE = { fresh: 'New ≤ 30d', mid: '31–90 days', late: '91–365 days', stale: 'Over 1 year' };
  var SLOTS = [
    { k: 'no_price', h: 'No price', icon: 'i-tag-off', tone: '' },
    { k: 'no_photos', h: 'No photos', icon: 'i-cam-off', tone: '' },
    { k: 'feed_excluded', h: 'Excluded from feeds', icon: 'i-ban', tone: 'danger' },
    { k: 'hidden', h: 'Hidden on site', icon: 'i-eye-off', tone: 'slate' },
    { k: 'sale_pending', h: 'Sale pending', icon: 'i-clock', tone: 'violet' }
  ];
  var S = { sort: 'stock', dir: 'asc', attn: {}, age: null, makes: {}, sel: {}, lane: 'Available' };

  function band(d) { return d <= 30 ? 'fresh' : d <= 90 ? 'mid' : d <= 365 ? 'late' : 'stale'; }
  function ageLabel(d) { return d > 365 ? (d / 365).toFixed(1) + 'y' : d + 'd'; }
  function thumb(v) { return v.thumb ? '<img class="th" alt="" loading="lazy" src="img/' + esc(v.thumb) + '">' : '<span class="th th--none" title="No photos uploaded">' + ic('i-cam-off') + '</span>'; }
  function price(v) { return v.price == null ? '<span class="price price--none">No price</span>' : '<span class="price"><em>$</em>' + v.price.toLocaleString('en-US') + '</span>'; }
  function age(v) { var b = band(v.days), w = Math.min(100, Math.round(v.days / 730 * 100)); return '<span class="age age--' + b + '" title="' + v.days.toLocaleString('en-US') + ' days in stock"><i style="--w:' + w + '%"></i>' + ageLabel(v.days) + '</span>'; }
  function strip(v) {
    var list = SLOTS.filter(function (s) { return v[s.k]; }).map(function (s) { return s.h; });
    return '<span class="strip" title="' + (list.length ? esc(list.join(' · ')) : 'No attention flags') + '"><span class="strip__n' + (v.issues ? '' : ' strip__n--0') + '">' + (v.issues || '–') + '</span><span class="strip__s">' + SLOTS.map(function (s) { return '<i class="' + (v[s.k] ? 'on ' + s.tone : '') + '"></i>'; }).join('') + '</span></span>';
  }
  function acts(v) { return '<span class="acts"><a class="ract" href="#" title="Edit vehicle" data-stop>' + ic('i-edit') + '</a><a class="ract" href="#" title="Photos" data-stop>' + ic('i-cam') + '</a><a class="ract" href="#" title="Window sticker" data-stop>' + ic('i-print') + '</a><button class="ract" type="button" title="More" data-menu="' + v.id + '" data-stop>' + ic('i-more') + '</button></span>'; }

  var COLS = [
    { k: 'ck', cls: 'c-ck', th: '<th class="ckc"><input class="ck" type="checkbox" id="ck-all" aria-label="Select all"></th>' },
    { k: 'th', cls: 'c-th', th: '<th></th>' },
    { k: 'stock', cls: 'c-id', label: 'Stock', sort: 'stock' },
    { k: 'veh', cls: 'c-veh', label: 'Vehicle', sort: 'make' },
    { k: 'trim', cls: 'c-trim', label: 'Trim', sort: 'trim' },
    { k: 'ext', cls: 'c-ext', label: 'Ext. color', sort: 'ext' },
    { k: 'price', cls: 'c-price', label: 'Price', sort: 'price', r: true },
    { k: 'age', cls: 'c-age', label: 'Age', sort: 'days', r: true },
    { k: 'st', cls: 'c-st', label: 'Status', sort: 'status' },
    { k: 'attn', cls: 'c-attn' },
    { k: 'act', cls: 'c-act', th: '<th></th>' }
  ];

  function filtered() {
    return V.filter(function (v) {
      for (var a in S.attn) if (S.attn[a]) { if (a === 'aging365' ? v.days <= 365 : !v[a]) return false; }
      if (S.age && band(v.days) !== S.age) return false;
      var mk = Object.keys(S.makes).filter(function (m) { return S.makes[m]; });
      if (mk.length && mk.indexOf(v.make) < 0) return false;
      return true;
    }).sort(function (a, b) {
      var k = S.sort, d = S.dir === 'asc' ? 1 : -1, x = a[k], y = b[k];
      if (k === 'price') { x = x == null ? -1 : x; y = y == null ? -1 : y; }
      if (k === 'issues') { x = -a.issues; y = -b.issues; }
      if (typeof x === 'string') { x = x.toLowerCase(); y = y.toLowerCase(); }
      return (x > y ? 1 : x < y ? -1 : 0) * d;
    });
  }

  function render() {
    $('#cg').innerHTML = COLS.map(function (c) { return '<col class="' + c.cls + '">'; }).join('');
    $('#thr').innerHTML = COLS.map(function (c) {
      if (c.th) return c.th;
      if (c.k === 'attn') return '<th class="th-attn"><span class="lab">Attention</span><span class="strip__h">' + SLOTS.map(function (s) { return '<button type="button" class="' + (S.attn[s.k] ? 'on' : '') + '" data-attn="' + s.k + '" title="' + esc(s.h) + ' — click to filter">' + ic(s.icon) + '</button>'; }).join('') + '</span></th>';
      var on = S.sort === c.sort;
      return '<th' + (c.r ? ' class="r"' : '') + '><button class="sort' + (on ? ' sort--on' : '') + '" type="button" data-sort="' + c.sort + '"><span>' + esc(c.label) + '</span>' + ic(on && S.dir === 'desc' ? 'i-dn' : 'i-up') + '</button></th>';
    }).join('');
    var list = filtered();
    $('#tb').innerHTML = list.map(function (v) {
      return '<tr data-id="' + v.id + '" class="' + (S.sel[v.id] ? 'sel' : '') + '" tabindex="0">' + COLS.map(function (c) {
        switch (c.k) {
          case 'ck': return '<td class="ckc"><input class="ck" type="checkbox" data-sel="' + v.id + '"' + (S.sel[v.id] ? ' checked' : '') + ' aria-label="Select ' + esc(v.stock) + '"></td>';
          case 'th': return '<td>' + thumb(v) + '</td>';
          case 'stock': return '<td><a class="id" href="#" data-stop>' + esc(v.stock) + '</a>' + (v.lock ? '<span class="lockb" title="' + esc(v.lock) + '">' + ic('i-lock') + '</span>' : '') + '</td>';
          case 'veh': return '<td><span class="veh"><span class="veh__n" title="' + v.year + ' ' + esc(v.make) + ' ' + esc(v.model) + '"><em>' + v.year + '</em>' + esc(v.make) + ' ' + esc(v.model) + '</span><span class="veh__v"><span>VIN</span>' + esc(v.vin) + '</span></span></td>';
          case 'trim': return '<td class="trim" title="' + esc(v.trim) + '">' + (v.trim ? esc(v.trim) : '<span style="color:var(--ink-4)">—</span>') + '</td>';
          case 'ext': return '<td title="' + esc(v.ext) + '"><span class="sw" style="--c:' + swatch(v.ext) + '"></span>' + esc(v.ext) + '</td>';
          case 'price': return '<td class="r">' + price(v) + '</td>';
          case 'age': return '<td class="r">' + age(v) + '</td>';
          case 'st': return '<td><span class="st st--ok">Available</span></td>';
          case 'attn': return '<td>' + strip(v) + '</td>';
          case 'act': return '<td class="r">' + acts(v) + '</td>';
        }
      }).join('') + '</tr>';
    }).join('');
    var lab = { stock: 'Stock', year: 'Year', make: 'Make', model: 'Model', trim: 'Trim', ext: 'Ext. color', price: 'Price', status: 'Status', days: 'Age', issues: 'Attention' };
    $('#sort-v').textContent = lab[S.sort] + (S.dir === 'asc' ? ' ↑' : ' ↓');
    $$('#p-sort [data-sort]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.sort === S.sort); });
    $$('#p-sort [data-dir]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.dir === S.dir); });
    $('#shown').textContent = $('#shown2').textContent = list.length ? '1–' + list.length : '0';
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
  function renderBulk() { var n = Object.keys(S.sel).filter(function (k) { return S.sel[k]; }).length; $('#bulk').hidden = n === 0; $('#listbar').hidden = n > 0; $('#bulk-n').textContent = n; }
  function renderMakes() { $('#make-list').innerHTML = MAKES.map(function (m) { return '<label class="pop__it" data-v="' + esc(m[0].toLowerCase()) + '"><input class="ck" type="checkbox" data-make="' + esc(m[0]) + '"' + (S.makes[m[0]] ? ' checked' : '') + '><span>' + esc(m[0]) + '</span><span class="c">' + m[1] + '</span></label>'; }).join(''); }
  function renderCols() { $('#cols-list').innerHTML = ['Photo', 'Stock #', 'Vehicle (year · make · model · VIN)', 'Trim', 'Exterior color', 'Price', 'Days in stock', 'Status', 'Attention', 'Actions'].map(function (n) { return '<div class="pop__it"><span class="ract" style="cursor:grab">' + ic('i-drag') + '</span><span>' + n + '</span><button class="ract" type="button" title="Remove">' + ic('i-x') + '</button></div>'; }).join(''); }
  function setAttn(k, on) { S.attn[k] = on; $$('.ar[data-attn="' + k + '"]').forEach(function (b) { b.classList.toggle('ar--on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }); render(); }
  function setAge(b) { S.age = b; $$('[data-age]').forEach(function (el) { var on = el.dataset.age === b; el.classList.toggle('mix__seg--on', on && el.classList.contains('mix__seg')); el.classList.toggle('ml--on', on && el.classList.contains('ml')); }); render(); }
  function setLane(l) { S.lane = l; $$('[data-lane]').forEach(function (b) { var on = b.dataset.lane === l; b.classList.toggle('lane--on', on && b.classList.contains('lane')); b.classList.toggle('tab--on', on && b.classList.contains('tab')); }); var n = $('.tab[data-lane="' + l + '"] b').textContent; $('#scope-n').textContent = n; $('#scope-l').textContent = l === 'All' ? 'on file' : l.toLowerCase(); $('#scope-sub').textContent = n + ' ' + (l === 'All' ? 'on file' : l.toLowerCase()); }

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
    if ((el = t.closest('[data-act="insights"]'))) { var ins = $('#insights'); ins.hidden = !ins.hidden; return; }
    if ((el = t.closest('[data-act="more"]'))) { var m = $('#more'); m.hidden = !m.hidden; $('[data-act="more"].facet__b').classList.toggle('facet__b--on', !m.hidden); return; }
    if ((el = t.closest('[data-lane]'))) { setLane(el.dataset.lane); return; }
    if ((el = t.closest('[data-attn]'))) { setAttn(el.dataset.attn, !S.attn[el.dataset.attn]); return; }
    if ((el = t.closest('[data-age]'))) { setAge(S.age === el.dataset.age ? null : el.dataset.age); return; }
    if ((el = t.closest('[data-chip]'))) { $('#chips')._items[+el.dataset.chip].off(); render(); return; }
    if ((el = t.closest('[data-act="clear-all"]'))) { S.attn = {}; S.makes = {}; $$('.ar--on').forEach(function (b) { b.classList.remove('ar--on'); }); setAge(null); renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="clear-makes"]'))) { S.makes = {}; renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="clear-sel"]'))) { S.sel = {}; render(); return; }
    if ((el = t.closest('.sort'))) { var k = el.dataset.sort; if (S.sort === k) S.dir = S.dir === 'asc' ? 'desc' : 'asc'; else { S.sort = k; S.dir = 'asc'; } render(); return; }
    if ((el = t.closest('.mn__it[data-sort]'))) { S.sort = el.dataset.sort; render(); closePops(); return; }
    if ((el = t.closest('[data-dir]'))) { S.dir = el.dataset.dir; render(); closePops(); return; }
    if ((el = t.closest('[data-view]'))) { $$('[data-view]').forEach(function (b) { b.classList.toggle('seg__b--on', b === el); }); return; }
    if ((el = t.closest('[data-menu]'))) { e.preventDefault(); e.stopPropagation(); var r = el.getBoundingClientRect(), mnu = $('#rowmenu'); closePops(); mnu.classList.add('pop--open'); mnu.style.top = (r.bottom + 4) + 'px'; mnu.style.left = Math.min(r.left, innerWidth - 240) + 'px'; mnu.dataset.id = el.dataset.menu; return; }
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
    if (t.id === 'ck-all') { filtered().forEach(function (v) { S.sel[v.id] = t.checked; }); render(); }
  });
  document.addEventListener('input', function (e) { if (e.target.matches('[data-filter]')) { var q = e.target.value.toLowerCase(); $$('#' + e.target.dataset.filter + ' .pop__it').forEach(function (it) { it.style.display = it.dataset.v.indexOf(q) >= 0 ? '' : 'none'; }); } });

  for (var y = 2027; y >= 1929; y--) { $('#y1').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); $('#y2').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); }
  renderMakes(); renderCols(); render();
})();
