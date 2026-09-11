/*
 * All Vehicles — design-lab behaviour.
 * Renders the real rows (all-vehicles.data.js) and wires the states a
 * reviewer needs to judge: popovers, health toggles → chips, lanes,
 * views (table / gallery / photos preset), sorting, row menu, delete
 * confirm, theme. No framework; nothing here is production code.
 */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var icon = function (id, cls) { return '<svg class="i ' + (cls || '') + '"><use href="#' + id + '"/></svg>'; };

  var rows = (window.AAN_VEHICLES || []).slice();
  var state = { view: 'table', sort: 'stock', dir: 'asc', health: {}, makes: {} };

  /* ── Vocabulary: original flag titles → slots ─────────────────── */
  var FLAGS = [
    { key: 'no_photos',     match: 'No photos', icon: 'i-camera-off', tone: 'warn',   label: 'No photos uploaded' },
    { key: 'no_price',      match: 'No price',  icon: 'i-tag-off',    tone: 'warn',   label: 'No price set' },
    { key: 'hidden',        match: 'Hidden',    icon: 'i-eye-off',    tone: 'slate',  label: 'Hidden on site (Do Not Display)' },
    { key: 'feed_excluded', match: 'Excluded',  icon: 'i-ban',        tone: 'danger', label: 'Excluded from outbound feeds (nofeedout)' },
    { key: 'sale_pending',  match: 'Sale pend', icon: 'i-clock',      tone: 'violet', label: 'Sale pending' }
  ];
  var HEALTH_LABEL = { fresh30: 'New ≤ 30d', aging365: 'Aging > 1 yr', no_photos: 'No photos', no_price: 'No price', hidden: 'Hidden on site', feed_excluded: 'Feed excluded', sale_pending: 'Sale pending' };

  var MAKES = [['Porsche',54],['Ford',47],['Ferrari',42],['Lamborghini',27],['McLaren',20],['Mercedes-Benz',20],['Chevrolet',16],['Dodge',12],['Land Rover',12],['Audi',11],['BMW',9],['Ducati',9],['Cadillac',7],['Nissan',6],['Bentley',5],['Kenworth',4],['Peterbilt',4],['Acura',3],['AGROTK',3],['Aston Martin',3],['GMC',3],['Rolls-Royce',3],['Tesla',3],['Jeep',2],['Jensen',2],['Karma',2],['SDLANCH',2],['Toyota',2],['AM General',1],['Aviara',1],['Backdraft Shelby',1],['Bobcat',1],['Chaparral',1],['Coyote MFG Co.',1],['Cunningham',1],['Fisker',1],['Full Scale',1],['Harley-Davidson',1],['Honda',1],['International',1],['Isuzu',1],['Kawasaki',1],['Kia',1],['Koenigsegg',1],['Lexus',1],['Magic Tilt',1],['Mastercraft',1],['Rimac',1],['RUF',1],['Sea Ray',1],['Sea-Doo',1],['Subaru',1],['SUNDOWNER',1],['Terex',1]];

  /* ── Column plans ─────────────────────────────────────────────── */
  var COLS = {
    table: [
      { key: 'thumb',   cls: 'c-thumb',   label: '' },
      { key: 'stock',   cls: 'c-stock',   label: 'Stock', sort: 'stock' },
      { key: 'vehicle', cls: 'c-vehicle', label: 'Vehicle', sort: 'make' },
      { key: 'ext',     cls: 'c-ext',     label: 'Ext. color', sort: 'ext' },
      { key: 'price',   cls: 'c-price',   label: 'Price', sort: 'price', num: true },
      { key: 'status',  cls: 'c-status',  label: 'Status', sort: 'status' },
      { key: 'health',  cls: 'c-health',  label: 'Health' },
      { key: 'age',     cls: 'c-age',     label: 'Age', sort: 'days', num: true },
      { key: 'actions', cls: 'c-actions', label: '' }
    ],
    photos: [
      { key: 'stock',   cls: 'c-stock',  label: 'Stock', sort: 'stock' },
      { key: 'vin',     cls: 'c-vin',    label: 'VIN' },
      { key: 'type',    cls: 'c-type',   label: 'Type' },
      { key: 'year',    cls: 'c-year',   label: 'Year', sort: 'year', num: true },
      { key: 'make',    cls: 'c-make',   label: 'Make', sort: 'make' },
      { key: 'model',   cls: 'c-model',  label: 'Model', sort: 'model' },
      { key: 'trim',    cls: 'c-trim',   label: 'Trim', sort: 'trim' },
      { key: 'ext',     cls: 'c-ext',    label: 'Ext. color', sort: 'ext' },
      { key: 'photo',   cls: 'c-photo',  label: 'Photo' },
      { key: 'status',  cls: 'c-status', label: 'Status', sort: 'status' },
      { key: 'days',    cls: 'c-days',   label: 'Days', sort: 'days', num: true },
      { key: 'actions', cls: 'c-actions', label: '' }
    ]
  };
  var COL_LABELS = { thumb: 'Photo', stock: 'Stock #', vehicle: 'Vehicle (year · make · model · trim)', ext: 'Exterior color', price: 'Price', status: 'Status', health: 'Health flags', age: 'Days in stock', actions: 'Actions' };

  /* ── Cell renderers ───────────────────────────────────────────── */
  function ageBand(d) { return d <= 30 ? 'fresh' : d <= 90 ? 'mid' : d <= 365 ? 'late' : 'stale'; }
  function fmtPrice(p) { return p == null ? '<span class="price price--none" title="No price set">No price</span>' : '<span class="price"><span class="price__cur">$</span>' + p.toLocaleString('en-US') + '</span>'; }
  function thumb(v, big) {
    if (v.thumb) return '<img class="dt__thumb" alt="" loading="lazy" src="img/' + esc(v.thumb) + '">';
    return '<span class="dt__thumb dt__thumb--none" title="No photos uploaded">' + icon('i-camera-off') + '</span>';
  }
  function flags(v) {
    var out = '<span class="flags">';
    FLAGS.forEach(function (f) {
      var on = v.flags.some(function (t) { return t.indexOf(f.match) === 0; });
      out += on
        ? '<span class="flag flag--' + f.tone + '" title="' + esc(f.label) + '" aria-label="' + esc(f.label) + '">' + icon(f.icon) + '</span>'
        : '<span class="flag flag--empty" aria-hidden="true"></span>';
    });
    if (v.lock) out += '<span class="flag flag--info" title="' + esc(v.lock) + '" aria-label="' + esc(v.lock) + '">' + icon('i-lock') + '</span>';
    else out += '<span class="flag flag--empty" aria-hidden="true"></span>';
    return out + '</span>';
  }
  function statusTag(s) {
    var tone = { Available: 'ok', Sold: 'danger', Pending: 'warn', STAGING: 'slate', Staging: 'slate' }[s] || 'slate';
    return '<span class="tag tag--' + tone + '">' + esc(s === 'STAGING' ? 'Staging' : s) + '</span>';
  }
  function ageCell(v) { return '<span class="age age--' + ageBand(v.days) + '" title="' + v.days.toLocaleString('en-US') + ' days in stock">' + esc(v.ageLabel) + '</span>'; }
  function actions(v) {
    return '<span class="dt__actions">' +
      '<a class="ract" href="#" title="Edit vehicle" data-stop>' + icon('i-edit') + '</a>' +
      '<a class="ract" href="#" title="Photos" data-stop>' + icon('i-camera') + '</a>' +
      '<a class="ract" href="#" title="Window sticker" data-stop>' + icon('i-printer') + '</a>' +
      '<button class="ract" type="button" title="More actions" data-row-menu="' + esc(v.id) + '" data-stop>' + icon('i-more') + '</button>' +
      '</span>';
  }
  function cell(col, v) {
    switch (col.key) {
      case 'thumb':   return '<td class="cell-thumb">' + thumb(v) + '</td>';
      case 'photo':   return '<td>' + thumb(v, true) + '</td>';
      case 'stock':   return '<td><a class="dt__id" href="#" data-stop>' + esc(v.stock) + '</a></td>';
      case 'vehicle': return '<td><div class="vehicle"><div class="vehicle__name"><em>' + v.year + '</em>' + esc(v.make) + ' ' + esc(v.model) + '</div><div class="vehicle__sub' + (v.trim ? '' : ' vehicle__sub--empty') + '">' + (v.trim ? esc(v.trim) : 'No trim / description') + '</div></div></td>';
      case 'ext':     return '<td title="' + esc(v.ext) + '">' + (v.ext ? esc(v.ext) : '<span class="t-muted">—</span>') + '</td>';
      case 'price':   return '<td class="cell-num">' + fmtPrice(v.price) + '</td>';
      case 'status':  return '<td>' + statusTag(v.status) + '</td>';
      case 'health':  return '<td>' + flags(v) + '</td>';
      case 'age':     return '<td class="cell-num">' + ageCell(v) + '</td>';
      case 'days':    return '<td class="cell-num">' + ageCell(v) + '</td>';
      case 'actions': return '<td class="cell-num">' + actions(v) + '</td>';
      case 'vin':     return '<td class="t-mono t-muted">' + esc(v.vin || '—') + '</td>';
      case 'type':    return '<td>' + esc(v.type || 'Used') + '</td>';
      case 'year':    return '<td class="cell-num t-num">' + v.year + '</td>';
      case 'make':    return '<td>' + esc(v.make) + '</td>';
      case 'model':   return '<td title="' + esc(v.model) + '">' + esc(v.model) + '</td>';
      case 'trim':    return '<td title="' + esc(v.trim) + '">' + (v.trim ? esc(v.trim) : '<span class="t-muted">—</span>') + '</td>';
    }
    return '<td></td>';
  }

  /* ── Sorting ──────────────────────────────────────────────────── */
  var SORT_LABEL = { stock: 'Stock', year: 'Year', make: 'Make', model: 'Model', trim: 'Trim', ext: 'Ext. color', price: 'Price', status: 'Status', days: 'Age' };
  function sorted() {
    var k = state.sort, dir = state.dir === 'asc' ? 1 : -1;
    return rows.slice().sort(function (a, b) {
      var x = a[k], y = b[k];
      if (k === 'price') { x = x == null ? -1 : x; y = y == null ? -1 : y; }
      if (typeof x === 'string') x = x.toLowerCase();
      if (typeof y === 'string') y = y.toLowerCase();
      return (x > y ? 1 : x < y ? -1 : 0) * dir;
    });
  }

  /* ── Render ───────────────────────────────────────────────────── */
  function render() {
    var plan = COLS[state.view === 'photos' ? 'photos' : 'table'];
    var colgroup = $('#colgroup'), head = $('#thead-row'), body = $('#tbody');
    colgroup.innerHTML = plan.map(function (c) { return '<col class="' + c.cls + '">'; }).join('');
    head.innerHTML = plan.map(function (c) {
      var cls = c.num ? ' class="cell-num"' : '';
      if (!c.sort) return '<th' + cls + '>' + esc(c.label) + '</th>';
      var on = state.sort === c.sort;
      return '<th' + cls + '><button class="dt__sort' + (on ? ' dt__sort--on' : '') + '" type="button" data-sort="' + c.sort + '" aria-sort="' + (on ? state.dir + 'ending' : 'none') + '"><span>' + esc(c.label) + '</span>' + icon(on && state.dir === 'desc' ? 'i-arrow-down' : 'i-arrow-up') + '</button></th>';
    }).join('');
    var list = sorted();
    body.innerHTML = list.map(function (v) {
      return '<tr data-href="#edit-' + esc(v.id) + '" data-id="' + esc(v.id) + '" tabindex="0">' + plan.map(function (c) { return cell(c, v); }).join('') + '</tr>';
    }).join('');
    $('#table-view').classList.toggle('dt--photos', state.view === 'photos');
    $('#sort-label').textContent = SORT_LABEL[state.sort] + (state.dir === 'asc' ? ' ↑' : ' ↓');
    $$('#pop-sort [data-sort]').forEach(function (b) { b.classList.toggle('menu__item--on', b.dataset.sort === state.sort); });
    $$('#pop-sort [data-sort-dir]').forEach(function (b) { b.classList.toggle('menu__item--on', b.dataset.sortDir === state.dir); });
    renderGallery(list);
  }

  function renderGallery(list) {
    $('#gallery-view').innerHTML = list.map(function (v) {
      var media = v.thumb
        ? '<img alt="" loading="lazy" src="img/' + esc(v.thumb) + '">'
        : icon('i-camera-off', 'i-lg') ;
      return '<article class="vcard">' +
        '<div class="vcard__media' + (v.thumb ? '' : ' vcard__media--none') + '">' + media + '<span class="vcard__age">' + ageCell(v) + '</span></div>' +
        '<div class="vcard__body">' +
          '<div class="vcard__id">#' + esc(v.stock) + '</div>' +
          '<div class="vcard__name"><span class="t-quiet">' + v.year + '</span> ' + esc(v.make) + ' ' + esc(v.model) + '</div>' +
          '<div class="vcard__sub">' + (v.trim ? esc(v.trim) : '&nbsp;') + '</div>' +
          '<div class="vcard__foot">' + fmtPrice(v.price) + flags(v) + '</div>' +
        '</div></article>';
    }).join('');
  }

  function renderMakes() {
    $('#make-list').innerHTML = MAKES.map(function (m) {
      return '<label class="pop__item check" data-v="' + esc(m[0].toLowerCase()) + '"><input type="checkbox" value="' + esc(m[0]) + '" data-make' + (state.makes[m[0]] ? ' checked' : '') + '><span class="pop__item-name">' + esc(m[0]) + '</span><span class="pop__item-cnt">' + m[1] + '</span></label>';
    }).join('');
  }

  function renderCols() {
    $('#cols-list').innerHTML = COLS.table.map(function (c) {
      return '<div class="pop__item"><span class="ract" style="cursor:grab" title="Drag to reorder">' + icon('i-drag') + '</span><span class="pop__item-name">' + esc(COL_LABELS[c.key]) + '</span><button class="ract" type="button" title="Remove column">' + icon('i-x') + '</button></div>';
    }).join('');
  }

  function renderYears() {
    var f = $('#yr-from'), t = $('#yr-to');
    for (var y = 2027; y >= 1929; y--) { f.insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); t.insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); }
  }

  /* ── Chips (active filters) ───────────────────────────────────── */
  function renderChips() {
    var items = [];
    Object.keys(state.makes).forEach(function (m) { if (state.makes[m]) items.push({ k: 'Make', v: m, remove: function () { delete state.makes[m]; renderMakes(); } }); });
    Object.keys(state.health).forEach(function (h) { if (state.health[h]) items.push({ k: 'Flag', v: HEALTH_LABEL[h], remove: function () { setHealth(h, false); } }); });
    var box = $('#chips');
    box.hidden = items.length === 0;
    box.innerHTML = items.length ? '<span class="chips__label">Filters</span>' + items.map(function (it, i) {
      return '<span class="chip"><span class="chip__k">' + esc(it.k) + '</span> ' + esc(it.v) + '<button class="chip__x" type="button" data-chip="' + i + '" aria-label="Remove">' + icon('i-x') + '</button></span>';
    }).join('') + '<button class="chips__clear" type="button" data-action="clear-all">Clear all</button>' : '';
    box._items = items;
    var n = Object.keys(state.makes).filter(function (m) { return state.makes[m]; });
    $('[data-facet-value="make"]').textContent = n.length === 0 ? 'Any' : n.length === 1 ? n[0] : n[0] + ' +' + (n.length - 1);
    $('[data-pop="pop-make"]').classList.toggle('facet--on', n.length > 0);
  }
  function setHealth(k, on) {
    state.health[k] = on;
    var b = $('[data-health="' + k + '"]');
    b.classList.toggle('pulse__item--on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    renderChips();
  }

  /* ── Popovers ─────────────────────────────────────────────────── */
  function closePops(except) {
    $$('.pop--open').forEach(function (p) { if (p !== except) { p.classList.remove('pop--open'); } });
    $$('[data-pop]').forEach(function (b) { if (!except || b.dataset.pop !== except.id) { b.setAttribute('aria-expanded', 'false'); b.classList.remove('facet--open'); } });
  }
  document.addEventListener('click', function (e) {
    var t = e.target;
    var popBtn = t.closest('[data-pop]');
    if (popBtn) {
      var pop = $('#' + popBtn.dataset.pop);
      var open = pop.classList.contains('pop--open');
      closePops();
      if (!open) { pop.classList.add('pop--open'); popBtn.setAttribute('aria-expanded', 'true'); popBtn.classList.add('facet--open'); var inp = pop.querySelector('input[type=search]'); if (inp) setTimeout(function () { inp.focus(); }, 0); }
      return;
    }
    if (t.closest('.pop') && !t.closest('[data-action="close-pops"]') && !t.closest('#row-menu')) return;
    closePops();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePops(); $('#modal-delete').classList.remove('modal--open'); }
    if (e.key === '/' && !/input|select|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); $('#omni').focus(); }
  });

  /* ── Delegated actions ────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var t = e.target, el;

    if ((el = t.closest('[data-action="theme"]'))) {
      var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', cur);
      try { localStorage.setItem('aan-theme', cur); } catch (x) {}
      return;
    }
    if ((el = t.closest('[data-toggle="insights"]'))) {
      var ins = $('#insights'); ins.hidden = !ins.hidden; el.setAttribute('aria-expanded', String(!ins.hidden)); el.classList.toggle('btn--secondary', !ins.hidden); el.classList.toggle('btn--quiet', ins.hidden);
      return;
    }
    if ((el = t.closest('[data-view]'))) {
      state.view = el.dataset.view;
      $$('[data-view]').forEach(function (b) { b.classList.toggle('seg__btn--on', b === el); });
      $('#table-view').hidden = state.view === 'gallery';
      $('#gallery-view').hidden = state.view !== 'gallery';
      render();
      return;
    }
    if ((el = t.closest('[data-lane]'))) {
      $$('[data-lane]').forEach(function (b) { b.classList.toggle('tab--on', b === el); b.setAttribute('aria-selected', b === el ? 'true' : 'false'); });
      return;
    }
    if ((el = t.closest('[data-health]'))) { setHealth(el.dataset.health, el.getAttribute('aria-pressed') !== 'true'); return; }
    if ((el = t.closest('[data-chip]'))) { $('#chips')._items[+el.dataset.chip].remove(); renderChips(); return; }
    if ((el = t.closest('[data-action="clear-all"]'))) { state.makes = {}; Object.keys(state.health).forEach(function (h) { setHealth(h, false); }); renderMakes(); renderChips(); return; }
    if ((el = t.closest('[data-action="clear-makes"]'))) { state.makes = {}; renderMakes(); renderChips(); return; }
    if ((el = t.closest('[data-sort]')) && !el.classList.contains('menu__item')) {
      if (state.sort === el.dataset.sort) state.dir = state.dir === 'asc' ? 'desc' : 'asc'; else { state.sort = el.dataset.sort; state.dir = 'asc'; }
      render(); return;
    }
    if ((el = t.closest('.menu__item[data-sort]'))) { state.sort = el.dataset.sort; render(); closePops(); return; }
    if ((el = t.closest('[data-sort-dir]'))) { state.dir = el.dataset.sortDir; render(); closePops(); return; }
    if ((el = t.closest('[data-action="close-pops"]'))) { closePops(); return; }

    if ((el = t.closest('[data-row-menu]'))) {
      e.preventDefault(); e.stopPropagation();
      var menu = $('#row-menu'), r = el.getBoundingClientRect();
      closePops();
      menu.classList.add('pop--open');
      menu.style.top = (r.bottom + 4) + 'px';
      menu.style.left = Math.min(r.left, window.innerWidth - 240) + 'px';
      menu.dataset.id = el.dataset.rowMenu;
      return;
    }
    if ((el = t.closest('[data-row-action]'))) {
      var id = $('#row-menu').dataset.id; closePops();
      if (el.dataset.rowAction === 'delete') {
        var v = rows.filter(function (x) { return x.id === id; })[0];
        $('#modal-delete-name').textContent = v ? (v.stock + ' · ' + v.year + ' ' + v.make + ' ' + v.model) : 'this vehicle';
        $('#modal-delete').classList.add('modal--open');
        $('#modal-delete .modal__panel').focus();
      }
      return;
    }
    if ((el = t.closest('[data-action="close-modal"]'))) { $('#modal-delete').classList.remove('modal--open'); return; }

    if ((el = t.closest('tr[data-href]')) && !t.closest('[data-stop]')) { el.classList.add('is-selected'); setTimeout(function () { el.classList.remove('is-selected'); }, 400); return; }
    if (t.closest('a[href="#"]')) e.preventDefault();
  });

  document.addEventListener('change', function (e) {
    if (e.target.matches('[data-make]')) { state.makes[e.target.value] = e.target.checked; renderChips(); }
  });
  document.addEventListener('input', function (e) {
    if (e.target.matches('[data-pop-filter]')) {
      var q = e.target.value.toLowerCase();
      $$('#' + e.target.dataset.popFilter + ' .pop__item').forEach(function (it) { it.style.display = it.dataset.v.indexOf(q) >= 0 ? '' : 'none'; });
    }
  });

  // Lab hooks: theme from the review shell
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.type === 'aan:theme') { document.documentElement.setAttribute('data-theme', d.theme); }
    if (d.type === 'aan:scroll') { window.scrollTo(0, d.y); }
  });

  renderMakes(); renderCols(); renderYears(); render(); renderChips();
})();
