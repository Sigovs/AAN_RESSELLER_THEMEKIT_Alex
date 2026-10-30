/* ============================================================================
   AAN · Dealer UI · SINGLE VEHICLE — GENERATION 11

   Behaviour is the production editor's, not an invention of this file. Every
   rule implemented below is one the export states in its own copy:

     · "only changed fields post (dirty-diff) · conflict check on save · Ctrl+S"
       → the dirty ledger, the Review-changes list, Discard, and Ctrl+S
     · "Switching to Sold auto-clears Pending Sale on save (existing rule)"
       → applied by the save handler, visibly
     · "excluding ALL auto-flips Do Not Feed Out"
       → applied when the last feed is switched off, and released when one
         comes back on
     · "Switch ON (green) = sending to that feed"
       → the green switch tone is the export's own convention, not a choice
     · "printing autosaves the additional text"
       → the Prints menu writes Buyers Guide Text into the baseline

   Nothing else fires a request, and nothing here pretends to. The three
   controls that would need a live backend — Decode VIN, the AI writer and Save
   — say so where they are, rather than performing success.

   Geometry: CSS publishes the sticky stack, this file reads it. A custom
   property is substituted but not evaluated, so --stick-total comes back as the
   literal text "calc(68px + 72px)" and parseFloat returns NaN. The two plain
   values are summed instead.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.SV11;
  if (!D) { return; }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var ic = function (id) { return '<svg class="i"><use href="#' + id + '"/></svg>'; };
  var nf = function (n) { return Number(n).toLocaleString('en-US'); };

  /* ── sticky geometry, read from the one place that defines it ────────── */
  var CSSV = getComputedStyle(document.documentElement);
  function cssPx(name, fallback) {
    var v = parseFloat(CSSV.getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }
  function stickTotal() { return cssPx('--stick-bar', 68) + cssPx('--stick-cockpit', 72); }
  function reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ── state ───────────────────────────────────────────────────────────── */
  var S = {
    ix: 0,           /* which of the three export vehicles is open */
    v: null,         /* the working copy — what the form edits      */
    base: null,      /* the saved copy — what dirty compares against */
    tab: 'main_text_1',
    ai: false,
    feedQ: ''
  };

  /* Field identities. `label` is what Review changes prints, and it is the
     label the zone itself shows. */
  var CORE = [
    ['price', 'Price'], ['discount_price', 'Discount Price'], ['invoice_price', 'Invoice (Cost) Price'],
    ['lease_price', 'Lease Price'], ['lease_term', 'Lease Term'],
    ['stockno', 'Stock'], ['vin', 'VIN'], ['year', 'Year'], ['make', 'Make'], ['model', 'Model'],
    ['trim', 'Trim'], ['body', 'Body'], ['mileage', 'Mileage'], ['engine', 'Engine'],
    ['trans', 'Transmission'], ['mpg_cty', 'MPG City'], ['mpg_hwy', 'MPG Highway'], ['fuel', 'Fuel Type'],
    ['drivetrain', 'Drivetrain'], ['cylinders', 'Cylinders'], ['displacement', 'Displacement'],
    ['curb_weight', 'Curb Weight'], ['doors', 'Doors'], ['vehicle_type', 'Vehicle Type'],
    ['YouTube_url', 'YouTube URL'],
    ['ext_color', 'Exterior Color'], ['basic_ext_color', 'Basic Exterior Color'],
    ['int_color', 'Interior Color'], ['basic_int_color', 'Basic Interior Color'],
    ['bookvalue', 'Book Value'], ['discount', 'Discount'], ['original_price', 'Original Price'],
    ['location', 'Location'], ['modelnumber', 'Model Number'], ['bodyCode', 'Body Code'],
    ['add_options', 'Add Options'], ['video_url', 'Video URL']
  ];
  var CORE_LABEL = {};
  CORE.forEach(function (c) { CORE_LABEL[c[0]] = c[1]; });

  var DESC_LABEL = {};
  D.descTabs.forEach(function (t) { DESC_LABEL[t.id] = t.label; });

  var VIS_LABEL = {};
  D.vis.forEach(function (v) { VIS_LABEL[v.id] = v.label; });

  var CUSTOM_LABEL = {};
  D.custom.forEach(function (c) { CUSTOM_LABEL[c.id] = c.label; });

  /* ── working copy ────────────────────────────────────────────────────── */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function load(ix) {
    S.ix = ix;
    var src = D.vehicles[ix];
    S.v = clone(src);
    /* the six description fields: only main_text_1 carries content in the
       export; the other five are empty in all three variants */
    S.v.desc = {
      intro_text: '', main_text_1: src.main_text_1 || '', main_text_2: '',
      main_text_3: '', caption: '', buyers_guide_text: ''
    };
    S.v.reset_when_added = false;
    S.base = clone(S.v);
    S.tab = 'main_text_1';
    S.ai = false;
    S.feedQ = '';
    renderAll();
  }

  /* ── the dirty ledger ────────────────────────────────────────────────── */
  function changes() {
    var out = [], v = S.v, b = S.base, i;
    CORE.forEach(function (c) {
      if (String(v[c[0]]) !== String(b[c[0]])) out.push({ k: 'core.' + c[0], label: c[1], from: b[c[0]], to: v[c[0]] });
    });
    ['status', 'vtype', 'certified'].forEach(function (k) {
      if (String(v[k]) !== String(b[k])) {
        out.push({ k: 'core.' + k, label: k === 'vtype' ? 'Type' : k === 'status' ? 'Status (sold)' : 'Certified', from: b[k], to: v[k] });
      }
    });
    if ((v.carfax || null) !== (b.carfax || null)) out.push({ k: 'core.carfax', label: 'CARFAX report link', from: b.carfax || '', to: v.carfax || '' });
    Object.keys(v.vis).forEach(function (k) {
      if (v.vis[k] !== b.vis[k]) out.push({ k: 'core.' + k, label: VIS_LABEL[k], from: b.vis[k], to: v.vis[k] });
    });
    Object.keys(v.custom).forEach(function (k) {
      if (String(v.custom[k]) !== String(b.custom[k])) out.push({ k: 'custom.' + k, label: CUSTOM_LABEL[k], from: b.custom[k], to: v.custom[k] });
    });
    Object.keys(v.desc).forEach(function (k) {
      if (v.desc[k] !== b.desc[k]) out.push({ k: 'desc.' + k, label: DESC_LABEL[k], from: b.desc[k], to: v.desc[k] });
    });
    if (v.zero_down !== b.zero_down) out.push({ k: 'core.zero_down', label: 'Zero Down', from: b.zero_down, to: v.zero_down });
    if (v.reset_when_added !== b.reset_when_added) out.push({ k: 'reset', label: 'Renew listing on save', from: b.reset_when_added, to: v.reset_when_added });
    for (i = 0; i < v.feeds.length; i++) {
      if (v.feeds[i] !== b.feeds[i]) { out.push({ k: 'feeds', label: 'Feeds (rows changed)', group: true }); break; }
    }
    if (JSON.stringify(v.std) !== JSON.stringify(b.std) || JSON.stringify(v.stdOff || {}) !== JSON.stringify(b.stdOff || {})) out.push({ k: 'features', label: 'Features (rows changed)', group: true });
    return out;
  }

  function dirtySet() {
    var m = {};
    changes().forEach(function (c) { m[c.k] = true; });
    return m;
  }

  /* ── rendering ───────────────────────────────────────────────────────── */
  function moneyK(n) {
    var x = Number(n) || 0;
    if (!x) return '$0';
    if (x >= 1000000) return '$' + (x / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (x >= 100000) return '$' + Math.round(x / 1000) + 'K';
    return '$' + (x / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  function ageTone(d) { return d <= 30 ? 'fresh' : d <= 90 ? 'mid' : d <= 365 ? 'late' : 'stale'; }
  function ageLabel(d) { return d > 365 ? (d / 365).toFixed(1) + 'y' : d + 'd'; }
  function hasDesc() { return Object.keys(S.v.desc).some(function (k) { return S.v.desc[k].trim() !== ''; }); }
  function feedsOn() { return S.v.feeds.filter(Boolean).length; }

  function renderCockpit() {
    var v = S.v;
    $('#cock-title').textContent = v.title;
    $('#cock-stock').textContent = v.stockno;
    $('#cock-vin').textContent = v.vin;

    /* Status, large in the header (Ivaylo, SV note 9: "SO SO CRITICAL … in the
       subheading of the page"): a coloured chip with a dot, in sentence case,
       that follows the Status control at once; "Hidden on site" joins it in
       red while Do Not Display is on. Used / New is quiet text beside it. */
    var st = $('#cock-status');
    $('b', st).textContent = v.status;
    st.className = 'stchip stchip--' + String(v.status).toLowerCase();
    $('#cock-type').textContent = v.vtype;
    $('#cock-hidden').hidden = !v.vis.no_display;
    /* both Preview buttons — header and save bar (SV note 25) */
    $$('[data-act="preview"]').forEach(function (pv) {
      pv.classList.toggle('btn--hidden-site', !!v.vis.no_display);
      pv.title = v.vis.no_display
        ? 'Preview — this car is hidden from the public site; only you can see this preview'
        : 'Open this car on the dealer’s site';
    });
    $('#scard-status').dataset.st = String(v.status).toLowerCase();

    var p = Number(v.price) || 0;
    var price = $('#cock-price');
    price.innerHTML = '<small>$</small>' + nf(p);
    price.className = 'cock__price' + (p === 0 ? ' cock__price--zero' : '');
    price.title = p === 0 ? 'No asking price' : '$' + nf(p);

    var ph = $('#cock-ph');
    ph.textContent = v.photos ? nf(v.photos) : 'none';
    ph.className = 'badge' + (v.photos ? '' : ' badge--warn');

    var th = $('#cock-thumb');
    th.innerHTML = v.thumb
      ? '<img src="' + esc(v.thumb) + '" alt="Main photo of the ' + esc(v.title) + '">'
      : ic('i-image');
    th.title = v.thumb ? 'Main photo' : 'No main photo in this kit';
  }

  function renderRail() {
    var v = S.v;
    var st = $('#b-status');
    /* the status word itself, sentence case (DESIGN.md §18: no caps chips) */
    st.textContent = v.status;
    st.className = 'badge' + (v.status === 'Available' ? ' badge--ok' : '');

    var pr = $('#b-pricing');
    pr.textContent = moneyK(v.price);
    pr.className = 'badge' + (Number(v.price) ? '' : ' badge--warn');

    var ph = $('#b-photos');
    ph.textContent = v.photos ? nf(v.photos) : 'none';
    ph.className = 'badge' + (v.photos ? '' : ' badge--warn');

    var de = $('#b-desc');
    de.textContent = '●';
    de.className = 'badge' + (hasDesc() ? ' badge--ok' : '');
    de.title = hasDesc() ? 'Has description copy' : 'No description copy';

    $('#b-feat').textContent = nf(v.std.length);

    var fo = v.feeds.length - feedsOn();
    var fb = $('#b-feeds');
    fb.textContent = fo === 0 ? 'all on' : fo === v.feeds.length ? 'all off' : fo + ' off';
    fb.className = 'badge' + (fo === 0 ? ' badge--ok' : ' badge--warn');
  }

  function renderVitals() {
    var v = S.v;
    $('#v-added').textContent = v.added;
    $('#v-modified').textContent = v.modified;
    $('#v-views').textContent = nf(v.views);
    var a = $('#v-age');
    a.textContent = ageLabel(v.ageDays);
    a.className = 'age age--' + ageTone(v.ageDays);
    a.title = nf(v.ageDays) + ' days in stock';
  }

  function fillSelects() {
    $$('[data-opt]').forEach(function (sel) {
      var list = D.opt[sel.dataset.opt] || [];
      sel.innerHTML = list.map(function (o) {
        return '<option value="' + esc(o) + '">' + (o === '' ? '—' : esc(o)) + '</option>';
      }).join('');
    });
  }

  /* An ON switch is stated by its whole cell, not just its track (Ivaylo,
     SV note 8: "a more significant ACTIVE signifier"): normal ones tint blue
     and say "On"; the two that take the car off the market tint red and say
     what that means. The cell keeps its size in both states. */
  var VIS_ON = { no_display: 'Hidden on site', nofeedout: 'Not sent to feeds' };
  function renderVis() {
    $('#vis').innerHTML = D.vis.map(function (s) {
      var on = !!S.v.vis[s.id];
      return '<div class="swrow' + (s.tone === 'danger' ? ' swrow--danger' : '') + (on ? ' swrow--on' : '') + '">' +
        '<span class="swrow__x"><b title="' + esc(s.label) + '">' + esc(s.label) + '</b><span>' + esc(s.help) + '</span><i class="swrow__on">' + esc(VIS_ON[s.id] || 'On') + '</i></span>' +
        '<label class="sw' + (s.tone === 'danger' ? ' sw--danger' : '') + '">' +
        '<input type="checkbox" id="core-' + s.id + '" name="core-' + s.id + '" data-vis="' + s.id + '" aria-label="' + esc(s.label) + '"' +
        (S.v.vis[s.id] ? ' checked' : '') + '><span class="sw__t"></span></label>' +
        '</div>';
    }).join('');
  }

  /* Photo row (Ivaylo, SV note 10 · Alex): the uploaded photos, then one
     card right after the last of them — "Add photos" on the left, the rest
     of the set ("+63 · Studio →") on the right. In the mock it works as an
     imitation: "Add photos" puts a neutral "New" tile into the row (no
     invented car photos), the card steps one place right and "+N" drops by
     one; once the row is full the total grows instead. Each photo has a
     remove (×). The kit holds one real image per car.
     DRAG TO REORDER is a mock addition (Alex) — the original does reorder
     only in the Photo Studio. Drop a tile on #1 and it becomes the main
     photo; ←/→ on a focused tile does the same by keyboard. To take it out:
     drop `draggable`/`tabindex` in tileOf() and the two drag listeners. */
  var ROW_MAX = 8;
  S.rowBy = {};
  S.newSeq = 0;
  function photoRow() {
    if (!S.rowBy[S.ix]) S.rowBy[S.ix] = S.v.thumb && S.v.photos > 0 ? [{ real: true }] : [];
    return S.rowBy[S.ix];
  }
  function tileOf(it, i) {
    var v = S.v;
    var x = '<button class="photo__x" type="button" data-photox="' + i + '" aria-label="Remove photo ' + i + '" title="Remove photo">' + ic('i-x') + '</button>';
    var star = i === 1 ? '<span class="photo__star" title="Main photo">' + ic('i-star') + '</span>' : '';
    var attrs = ' draggable="true" tabindex="0" data-pi="' + i + '" aria-label="Photo ' + i + (i === 1 ? ', main photo' : '') + ' — drag or use arrow keys to move"';
    return it.real
      ? '<figure class="photo"' + attrs + '><img src="' + esc(v.thumb) + '" alt="" draggable="false">' +
          '<span class="photo__ix">' + i + '</span>' + star + x + '</figure>'
      : '<figure class="photo photo--new"' + attrs + ' title="Added in this demo — a sample tile, not a real photo">' + ic('i-image') +
          '<span class="photo__ix">' + i + '</span>' + star + '<span class="photo__tag">New</span>' + x + '</figure>';
  }
  function renderPhotos() {
    var v = S.v, n = v.photos, row = photoRow();
    var tiles = row.map(function (it, k) { return tileOf(it, k + 1); });
    var rest = Math.max(0, n - row.length);
    tiles.push('<div class="photo photo--studio">' +
      '<button class="studio__add" type="button" data-act="addphoto">' +
        '<span class="studio__k">' + ic('i-plus') + '</span><b>Add photos</b></button>' +
      '<button class="studio__more" type="button" data-act="studio" title="Open the Photo Studio">' +
        (rest ? '<b>+' + nf(rest) + '</b>' : '<b>' + ic('i-cam') + '</b>') +
        '<span>Studio ' + ic('i-arrow') + '</span></button>' +
      '</div>');
    $('#photos').innerHTML = tiles.join('');

    $('#s-photos').innerHTML = n
      ? '<b>' + nf(n) + '</b> on disk · #1 is the main photo'
      : '<span class="warn">No photos on disk</span>';

    var note = $('#photos-note');
    note.hidden = false;
    note.innerHTML = '<span class="chip-src">Mock addition</span> <b>Drag to reorder</b> (#1 = main) is added here and is not in the original — easy to remove. ' +
      'Demo: <b>Add photos</b> adds a sample tile; real uploads, watermarks and feed selection are in the Photo Studio.';
  }
  function photosChanged(focusSel) {
    renderPhotos(); renderRail(); renderCockpit();
    var el = focusSel && $(focusSel); if (el) el.focus();
  }
  function removePhoto(i) {
    var row = photoRow();
    row.splice(i - 1, 1);
    S.v.photos = Math.max(0, S.v.photos - 1);
    photosChanged(row.length ? '[data-photox="' + Math.min(i, row.length) + '"]' : '[data-act="addphoto"]');
  }
  function addPhoto() {
    var row = photoRow();
    if (row.length < ROW_MAX) {
      row.push({ id: ++S.newSeq });
      if (S.v.photos < row.length) S.v.photos = row.length;
    } else {
      S.v.photos += 1;
    }
    photosChanged('[data-act="addphoto"]');
  }
  function movePhoto(from, to) {
    var row = photoRow();
    if (from === to || from < 1 || to < 1 || from > row.length || to > row.length) return;
    row.splice(to - 1, 0, row.splice(from - 1, 1)[0]);
    photosChanged('[data-pi="' + to + '"]');
  }
  /* drag (mouse) and ←/→ (keyboard) reorder */
  (function () {
    var host = document.getElementById('photos'), from = 0;
    host.addEventListener('dragstart', function (e) {
      var t = e.target.closest && e.target.closest('[data-pi]');
      if (!t) return;
      from = +t.dataset.pi;
      t.classList.add('photo--dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', String(from)); } catch (err) { /* old browsers */ }
    });
    host.addEventListener('dragover', function (e) {
      var t = e.target.closest && e.target.closest('[data-pi]');
      if (!t || !from) return;
      e.preventDefault();
      $$('.photo--over', host).forEach(function (o) { if (o !== t) o.classList.remove('photo--over'); });
      t.classList.add('photo--over');
    });
    host.addEventListener('dragleave', function (e) {
      var t = e.target.closest && e.target.closest('[data-pi]');
      if (t && !t.contains(e.relatedTarget)) t.classList.remove('photo--over');
    });
    host.addEventListener('drop', function (e) {
      var t = e.target.closest && e.target.closest('[data-pi]');
      if (!t || !from) return;
      e.preventDefault();
      var to = +t.dataset.pi; var f = from; from = 0;
      movePhoto(f, to);
    });
    host.addEventListener('dragend', function () {
      from = 0;
      $$('.photo--dragging, .photo--over', host).forEach(function (o) { o.classList.remove('photo--dragging', 'photo--over'); });
    });
    host.addEventListener('keydown', function (e) {
      var t = e.target.matches && e.target.matches('[data-pi]') ? e.target : null;
      if (!t || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
      e.preventDefault();
      var i = +t.dataset.pi;
      movePhoto(i, e.key === 'ArrowLeft' ? i - 1 : i + 1);
    });
  })();

  /* Window Sticker (SV note 18, mock addition): a small preview sheet built
     from the record, Print / Open PDF, and a factory-sticker upload slot */
  S.stkBy = {};
  function renderSticker() {
    var v = S.v;
    /* one line per equipment category, written out ("Antenna type: diversity") */
    var seen = {}, feats = v.std.filter(function (r) {
      if (r[2] || !r[1] || seen[r[0]]) return false;
      seen[r[0]] = 1; return true;
    }).slice(0, 6);
    var featTxt = function (val) { var p = String(val).split(' : '); return (p.length > 1 ? p.slice(1) : p).join(': '); };
    var row = function (k, val) { return val ? '<div class="ws__kv"><span>' + k + '</span><b>' + esc(val) + '</b></div>' : ''; };
    $('#wstk-sheet').innerHTML =
      '<div class="ws__h">WINDOW STICKER</div>' +
      '<div class="ws__t">' + esc(v.title) + '</div>' +
      '<div class="ws__vin">VIN ' + esc(v.vin) + ' · Stock ' + esc(v.stockno) + '</div>' +
      '<div class="ws__grid">' + row('Engine', v.engine) + row('Transmission', v.trans) + row('Drivetrain', v.drivetrain) +
        row('Exterior', v.ext_color) + row('Mileage', v.mileage ? nf(v.mileage) : '') + '</div>' +
      ((v.mpg_cty || v.mpg_hwy) ? '<div class="ws__mpg"><div><b>' + esc(v.mpg_cty || '—') + '</b><span>City MPG</span></div><div><b>' + esc(v.mpg_hwy || '—') + '</b><span>Hwy MPG</span></div></div>' : '') +
      (feats.length ? '<ul class="ws__list">' + feats.map(function (r) { return '<li>' + esc(featTxt(r[1])) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="ws__price"><span>Price</span><b>' + (Number(v.price) ? '$' + nf(v.price) : 'Call for price') + '</b></div>';
    var f = S.stkBy[S.ix];
    $('#wstk-up').innerHTML = f
      ? '<span class="wstk__file">' + ic('i-file') + '<b>' + esc(f) + '</b></span>' +
        '<button class="btn btn--sheet btn--sm" type="button" data-act="sticker-rm">' + ic('i-x') + 'Remove</button>'
      : '<label class="btn btn--sheet"><input type="file" accept="application/pdf" id="wstk-file" class="sr">' + ic('i-plus') + 'Upload factory sticker (PDF)</label>';
  }

  function renderDescTabs() {
    $('#desc-tabs').innerHTML = D.descTabs.map(function (t) {
      var filled = S.v.desc[t.id].trim() !== '';
      return '<button class="tab' + (S.tab === t.id ? ' tab--on' : '') + '" type="button" role="tab"' +
        ' aria-selected="' + (S.tab === t.id) + '" data-tab="' + t.id + '">' + esc(t.label) +
        '<span class="tab__dot' + (filled ? '' : ' tab__dot--empty') + '" title="' +
        (filled ? 'Has content' : 'Empty') + '"></span></button>';
    }).join('');
  }

  /* Rich tabs (Main Text 1 / 3) edit in CKEditor 4, full preset — the same
     editor and buttons dealers know from the backend (Ivaylo, SV note 6, and
     2026-10-22: "keep our old text tools"). TinyMCE was tried as a proposal
     and set aside. Without the CDN the plain HTML field shows. */
  var CK = null;
  function dropEditor() {
    if (CK) { try { CK.destroy(true); } catch (e) { /* already gone */ } CK = null; }
  }
  function mountEditor(id, key) {
    if (!window.CKEDITOR) return false;
    CKEDITOR.config.versionCheck = false;
    CK = CKEDITOR.replace(id, { height: 520, removeButtons: 'About', language: 'en' });
    CK.on('change', function () { S.v.desc[key] = CK.getData(); renderDirty(); });
    CK.on('mode', function () {
      if (CK.mode !== 'source') return;
      var ta = CK.editable && CK.editable();
      if (ta) ta.on('input', function () { S.v.desc[key] = CK.getData(); renderDirty(); });
    });
    return true;
  }
  function renderDescPane() {
    dropEditor();
    var t = D.descTabs.filter(function (x) { return x.id === S.tab; })[0];
    var id = 'desc-' + t.id;
    var html =
      '<div class="f" data-f="desc.' + t.id + '">' +
      '<label class="' + (t.rich && window.CKEDITOR ? 'sr' : 'f__l') + '" for="' + id + '">' + esc(t.label) + '</label>' +
      '<textarea class="ta' + (t.rich ? ' ta--tall' : '') + '" id="' + id + '" data-desc="' + t.id + '" rows="' +
      (t.rich ? 14 : 8) + '" spellcheck="' + (t.rich ? 'false' : 'true') + '"></textarea>' +
      (t.rich && !window.CKEDITOR ? '<span class="f__help">The text editor could not load — this is the stored HTML.</span>' : '') +
      (t.id === 'buyers_guide_text'
        ? '<div class="desc__foot"><span class="f__help">This text prints on the buyers guide. It is autosaved when you click a print link in the Window Stickers menu.</span>' +
          '<button class="btn btn--sheet btn--sm" type="button" data-act="save-bg">Save Buyers Guide Text</button></div>'
        : '') +
      '</div>';
    $('#desc-pane').innerHTML = html;
    $('#desc-pane').classList.toggle('desc-pane--rich', !!(t.rich && window.CKEDITOR));
    $('#' + id).value = S.v.desc[t.id];
    if (t.rich) mountEditor(id, t.id);
    $('#desc').classList.toggle('desc--dock', S.ai);
    $('#aidock').hidden = !S.ai;
    $('#ai-btn').innerHTML = ic('i-spark') + (S.ai ? 'Close AI Writer' : 'AI Writer');
    $('#ai-cta').hidden = S.ai;
  }

  /* Features & Equipment, compacted (Ivaylo, SV note 5: "super ugly and
     space wasting, maybe X2 columns"). Inside a Standard category the
     category is the group heading, so each row keeps only its Value, laid
     out two to a line. Rows without a category yet (just added) keep both
     fields so one can be typed. Additional options and Optional equipment
     — usually empty — sit side by side on one line. Same rows, same data. */
  S.featOpen = {};
  function catName(c) {
    var t = String(c).replace(/_/g, ' ').trim();
    return t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : 'New rows · set a category';
  }
  function renderFeatures() {
    var v = S.v;
    var custom = v.std.filter(function (r) { return r[2] === 'option'; });
    var optional = v.std.filter(function (r) { return r[2] === 'optional'; });
    var standard = v.std.filter(function (r) { return !r[2]; });

    function x(gi) {
      return '<button class="rowx" type="button" data-featx="' + gi + '" aria-label="Remove this feature row" title="Remove">' + ic('i-x') + '</button>';
    }
    function cat(gi, r) {
      return '<input class="in in--sm" type="text" id="feat-' + gi + '-cat" name="feat-' + gi + '-cat" placeholder="Category" value="' + esc(r[0]) + '" data-feat="' + gi + '" data-col="0" aria-label="Category of feature row ' + (gi + 1) + '">';
    }
    function val(gi, r) {
      return '<input class="in in--sm" type="text" id="feat-' + gi + '-val" name="feat-' + gi + '-val" placeholder="Value" value="' + esc(r[1]) + '" data-feat="' + gi + '" data-col="1" aria-label="' + esc(r[0] ? catName(r[0]) + ': value' : 'Value') + ' of feature row ' + (gi + 1) + '">';
    }
    /* a row with both fields: options, optional equipment, uncategorised */
    function fullrows(list) {
      if (!list.length) return '<p class="featnone">None on this vehicle.</p>';
      return list.map(function (r) {
        var gi = v.std.indexOf(r);
        return '<div class="featrow">' + cat(gi, r) + val(gi, r) + x(gi) + '</div>';
      }).join('');
    }
    function standardRows() {
      if (!standard.length) return '<p class="featnone">None on this vehicle.</p>';
      var groups = [], by = {};
      standard.forEach(function (r) {
        var k = r[0] || '';
        if (!by[k]) { by[k] = []; groups.push(k); }
        by[k].push(r);
      });
      /* folded by default (Scott, SV note 20): one row of category chips with
         counts + "Show all"; a chip opens just that category, laid out in the
         same 3-up value grid as before. Rows still without a category (just
         added) are always open. */
      var open = S.featOpen, all = groups.every(function (k) { return !k || open[k]; });
      var chips = '<div class="fchips" role="group" aria-label="Standard equipment categories">' +
        groups.filter(function (k) { return k; }).map(function (k) {
          var on = !!open[k];
          return '<button class="fchip' + (on ? ' fchip--on' : '') + '" type="button" data-featcat="' + esc(k) + '" aria-expanded="' + on + '">' +
            esc(catName(k)) + '<span>' + by[k].length + '</span>' + ic('i-chev') + '</button>';
        }).join('') +
        '<button class="fchip fchip--all" type="button" data-featall="' + (all ? '0' : '1') + '">' + (all ? 'Hide all' : 'Show all') + '</button></div>';
      return chips + groups.map(function (k) {
        var list = by[k];
        if (k && !open[k]) return '';
        /* Standard equipment as checkboxes (Bill): every decoded item is
           checked by default — the car has it; unchecking says it does not.
           No text fields, no ×. Rows still without a category stay fields. */
        var off = v.stdOff || {};
        var on = list.filter(function (r) { return !off[v.std.indexOf(r)]; }).length;
        return '<div class="featcat"><b>' + esc(catName(k)) + '</b><span>' + (k && on !== list.length ? on + ' of ' + list.length : list.length) + '</span></div>' +
          (k ? '<div class="featvals featvals--ck">' + list.map(function (r) {
            var gi = v.std.indexOf(r), txt = String(r[1]).split(' : ').join(' · '), isOn = !off[gi];
            return '<label class="featck' + (isOn ? '' : ' featck--off') + '" title="' + esc(txt) + '">' +
              '<input class="ck" type="checkbox" data-featck="' + gi + '"' + (isOn ? ' checked' : '') + '><span>' + esc(txt) + '</span></label>';
          }).join('') + '</div>' : fullrows(list));
      }).join('');
    }
    function head(label, n, kind, add) {
      /* Standard equipment carries its rule in a "?" (SV note 29) */
      var q = kind === 'standard' ? '<i class="f__q" tabindex="0" title="A VIN decode refreshes Standard equipment" aria-label="A VIN decode refreshes Standard equipment">?</i>' : '';
      return '<div class="featgrp__h"><span class="featgrp__t">' + label + ' <span>' + n + '</span>' + q + '</span>' +
        '<button class="btn btn--sheet btn--sm" type="button" data-featadd="' + kind + '">' + ic('i-plus') + add + '</button></div>';
    }

    $('#feat').innerHTML =
      '<div class="featpair">' +
        '<div class="featgrp">' + head('Additional options', custom.length, 'option', 'Add option') + fullrows(custom) + '</div>' +
        '<div class="featgrp">' + head('Optional equipment', optional.length, 'optional', 'Add optional') + fullrows(optional) + '</div>' +
      '</div>' +
      '<div class="featgrp featgrp--std">' + head('Standard equipment', standard.length, 'standard', 'Add standard') + standardRows() + '</div>';
  }

  function renderFeeds() {
    var q = S.feedQ.toLowerCase();
    var html = D.feeds.map(function (f, i) {
      if (q && f[0].toLowerCase().indexOf(q) < 0 && f[1].toLowerCase().indexOf(q) < 0) return '';
      var on = S.v.feeds[i];
      return '<div class="feedrow' + (on ? '' : ' feedrow--off') + '">' +
        '<label class="sw sw--ok"><input type="checkbox" id="feed-' + i + '" name="feed-' + i + '" data-feed="' + i + '"' + (on ? ' checked' : '') +
        ' aria-label="Send this vehicle to ' + esc(f[0]) + '"><span class="sw__t"></span></label>' +
        /* the feed's system code (n_1844…) is for support, not the dealer:
           it lives in the name's tooltip only (Scott, SV note 17) */
        '<span class="feedrow__n" title="' + esc(f[0]) + ' · ' + esc(f[1]) + '">' + esc(f[0]) + '</span></div>';
    }).join('');
    $('#feeds').innerHTML = html || '<p class="featnone">No feed matches that filter.</p>';
    var on = feedsOn(), total = S.v.feeds.length, off = total - on;
    $('#s-feeds').innerHTML = 'sending to <b>' + on + '</b> of ' + total + ' feeds · ' +
      (off ? '<span class="warn">' + off + ' excluded</span>' : '0 excluded');
  }

  /* Custom Fields: the text fields share the form grid; the switches get
     their own band of equal rows below, so inputs and toggles never
     interleave (a mixed grid read as a jumble — Alex, SV note 2). */
  var CUSTOM_HINT = {
    ove_feed_data: 'Data for the OVE.com (Manheim) dealer-to-dealer wholesale feed'
  };
  /* the three CARFAX columns live in the CARFAX section, not here */
  var CFX_IDS = { cfx_date: 1, carfax_timestamp: 1, no_carfax: 1 };
  function renderCustom() {
    var fields = D.custom.filter(function (c) { return c.type !== 'switch' && !CFX_IDS[c.id]; });
    var sws = D.custom.filter(function (c) { return c.type === 'switch' && !CFX_IDS[c.id]; });
    $('#custom').innerHTML =
      '<div class="grid">' + fields.map(function (c) {
        return '<div class="f" data-f="custom.' + c.id + '">' +
          /* the raw column name lives in the label's tooltip only (Scott, SV note 21);
             a field that needs a word of explanation gets it there too (SV note 22) */
          '<label class="f__l' + (CUSTOM_HINT[c.id] ? ' f__l--hint' : '') + '" for="custom-' + c.id + '" title="' + esc(c.label) + ' · ' + esc(c.raw) +
            (CUSTOM_HINT[c.id] ? ' — ' + esc(CUSTOM_HINT[c.id]) : '') + '">' + esc(c.label) +
            (CUSTOM_HINT[c.id] ? '<i class="f__q" aria-hidden="true">?</i>' : '') + '</label>' +
          '<input class="in" id="custom-' + c.id + '" name="custom-' + c.id + '" type="text" autocomplete="off" data-custom="' + c.id + '" value="' + esc(S.v.custom[c.id]) + '">' +
          '</div>';
      }).join('') + '</div>' +
      (sws.length ? '<div class="cfsw">' + sws.map(function (c) {
        return '<label class="cfsw__i" for="custom-' + c.id + '" title="' + esc(c.label) + ' · ' + esc(c.raw) + '">' +
          '<span class="cfsw__x"><b>' + esc(c.label) + '</b></span>' +
          '<span class="sw"><input type="checkbox" id="custom-' + c.id + '" name="custom-' + c.id + '" data-custom="' + c.id + '"' +
          (S.v.custom[c.id] ? ' checked' : '') + '><span class="sw__t"></span></span></label>';
      }).join('') + '</div>' : '');
  }

  /* Video (Karen): a preview frame from the YouTube link — the video's own
     thumbnail with a play mark, opening the video in a new tab — or an
     empty frame asking for a link. */
  function ytId(u) {
    var m = String(u || '').match(/(?:youtube\.com\/(?:embed\/|watch\?(?:.*&)?v=|shorts\/)|youtu\.be\/)([\w-]{11})/);
    return m ? m[1] : '';
  }
  function renderVideo() {
    var id = ytId(S.v.YouTube_url), a = $('#vid-prev'), has = !!(id || S.v.video_url);
    if (id) {
      a.href = 'https://www.youtube.com/watch?v=' + id;
      a.className = 'vid__prev';
      a.innerHTML = '<img src="https://img.youtube.com/vi/' + id + '/mqdefault.jpg" alt="YouTube video preview">' +
        '<span class="vid__play">' + ic('i-play') + '</span>';
      a.title = 'Open the video on YouTube';
    } else {
      a.removeAttribute('href');
      a.className = 'vid__prev vid__prev--none';
      a.innerHTML = '<span class="vid__none">' + ic('i-play') + '<b>No video yet</b><span>Paste a YouTube link</span></span>';
      a.title = '';
    }
    var b = $('#b-video');
    b.textContent = has ? 'yes' : 'none';
    b.className = 'badge' + (has ? ' badge--ok' : '');
  }

  /* CARFAX (SV note 23): status first, then the two ways in — paste the
     report link (a real field, tracked as an unsaved change) or upload the
     PDF (mock: a real file picker that shows the name) — and, beside it,
     the reporting columns that used to sit in Custom Fields. */
  S.cfxFile = {};
  function cfxField(id, label) {
    return '<div class="f" data-f="custom.' + id + '"><label class="f__l" for="custom-' + id + '">' + label + '</label>' +
      '<input class="in" id="custom-' + id + '" name="custom-' + id + '" type="text" autocomplete="off" data-custom="' + id + '" value="' + esc(S.v.custom[id]) + '"></div>';
  }
  function renderCarfaxStatus() {
    var v = S.v, file = S.cfxFile[S.ix], has = !!(v.carfax || file);
    $('#s-carfax').textContent = has ? 'vehicle history report attached' : 'no report on this vehicle yet';
    var b = $('#b-carfax');
    b.textContent = has ? 'yes' : 'none';
    b.className = 'badge' + (has ? ' badge--ok' : ' badge--warn');
    $('#cfx-state').innerHTML = has
      ? '<span class="cfx__dot cfx__dot--ok">' + ic('i-check') + '</span><span><b>Report attached</b>' +
          (v.carfax ? '<a href="' + esc(v.carfax) + '" target="_blank" rel="noopener">Open report ' + ic('i-ext') + '</a>' : '<span>' + esc(file) + '</span>') + '</span>'
      : '<span class="cfx__dot">' + ic('i-file') + '</span><span><b>No CARFAX report</b><span>Paste the report link or upload the PDF</span></span>';
  }
  function renderCarfax() {
    var v = S.v, file = S.cfxFile[S.ix];
    $('#cfx').innerHTML =
      '<div class="cfx__card">' +
        '<div class="cfx__state" id="cfx-state"></div>' +
        '<div class="f"><label class="f__l" for="cfx-link">Report link</label>' +
          '<input class="in" id="cfx-link" type="url" inputmode="url" spellcheck="false" autocomplete="off" placeholder="https://www.carfax.com/vehiclehistory/…" value="' + esc(v.carfax || '') + '"></div>' +
        '<div class="cfx__up">' +
          (file
            ? '<span class="wstk__file">' + ic('i-file') + '<b>' + esc(file) + '</b></span><button class="btn btn--sheet btn--sm" type="button" data-act="cfx-rm">' + ic('i-x') + 'Remove</button>'
            : '<label class="btn btn--sheet"><input type="file" accept="application/pdf" id="cfx-file" class="sr">' + ic('i-plus') + 'Upload CARFAX report (PDF)</label>') +
          '<span class="chip-src">Mock addition</span>' +
        '</div>' +
      '</div>' +
      '<div class="cfx__card">' +
        '<label class="cfx__sw" for="custom-no_carfax">' +
          '<span class="sw"><input type="checkbox" id="custom-no_carfax" name="custom-no_carfax" data-custom="no_carfax"' + (v.custom.no_carfax ? ' checked' : '') + '><span class="sw__t"></span></span>' +
          '<span><b>Do Not Report VIN To Carfax</b><span>Keeps this VIN out of the CARFAX dealer feed</span></span></label>' +
        '<div class="cfx__dates">' + cfxField('cfx_date', 'Report date') + cfxField('carfax_timestamp', 'Last checked') + '</div>' +
      '</div>';
    renderCarfaxStatus();
  }

  function renderPrints() {
    var g = D.prints;
    $('#p-prints').innerHTML =
      '<div class="caps pop__t">Window sticker</div>' +
      g.sticker.map(function (s) { return '<button class="pop__i" type="button" role="menuitem" data-print="' + esc(s) + '">' + ic('i-print') + '<span>' + esc(s) + '</span></button>'; }).join('') +
      '<div class="pop__sep"></div>' +
      '<div class="caps pop__t">Buyers guides</div>' +
      '<div class="pop__empty">Printing autosaves the additional text.</div>' +
      g.guides.map(function (s) { return '<button class="pop__i" type="button" role="menuitem" data-print="' + esc(s) + '">' + ic('i-file') + '<span>' + esc(s) + '</span></button>'; }).join('');
  }

  function renderValues() {
    CORE.forEach(function (c) {
      var el = document.getElementById('core-' + c[0]);
      if (el) el.value = S.v[c[0]] == null ? '' : S.v[c[0]];
    });
    $('#vinbar-v').textContent = S.v.vin;
    $('#core-zero_down').checked = !!S.v.zero_down;
    $('#reset-when-added').checked = !!S.v.reset_when_added;

    $$('[data-seg]').forEach(function (seg) {
      var key = seg.dataset.seg;
      var cur = key === 'certified' ? (S.v.certified ? 'on' : 'off') : String(S.v[key]);
      $$('.seg__b', seg).forEach(function (b) {
        var on = b.dataset.v === cur;
        b.classList.toggle('seg__b--on', on);
        b.setAttribute('aria-pressed', on);
      });
    });

    /* field-level provenance (C-20) — only Price carries history in the export */
    $('#prov-price').outerHTML = S.v.priceHistory
      ? '<button class="prov prov--has" type="button" id="prov-price" data-act="pricehist">' + ic('i-undo') + esc(S.v.priceHistory) + '</button>'
      : '<span class="prov" id="prov-price">' + ic('i-undo') + 'no history</span>';
  }

  function renderDirty() {
    var list = changes(), map = {};
    list.forEach(function (c) { map[c.k] = c; });

    $$('.f[data-f]').forEach(function (f) {
      var k = f.dataset.f;
      var key = k.indexOf('.') < 0 ? 'core.' + k : k;
      var on = !!map[key];
      f.classList.toggle('f--dirty', on);
      var lab = $('.f__l', f);
      if (!lab) return;
      var dot = $('.f__dot', lab);
      if (on && !dot) lab.insertAdjacentHTML('afterbegin', '<span class="f__dot" title="Changed, not saved"></span>');
      if (!on && dot) dot.remove();
    });

    var n = list.length;
    $('#save-n').innerHTML = '<b>' + n + '</b> unsaved change(s)';
    $('#save-n').classList.toggle('savebar__n--dirty', n > 0);
    var cd = $('#cock-dirty');
    cd.textContent = n;
    cd.className = 'btn__n' + (n ? ' btn__n--dirty' : '');
    ['#review-btn', '#discard-btn', '#save-btn'].forEach(function (s) { $(s).disabled = n === 0; });

    $('#p-changes').innerHTML = n
      ? '<div class="caps pop__t">Changed fields (this session)</div>' + list.map(function (c) {
          return '<div class="pop__i"><span>' + esc(c.label) + '</span><code>' + esc(c.k) + '</code></div>';
        }).join('')
      : '<div class="pop__empty">Nothing changed yet.</div>';
  }

  /* Factory colors from the VIN decode (Ivaylo, SV note 1: "the exterior color
     often has a vin decoded color picker … the CORRECT color like Storm Grey or
     Aztec Gold, not just a free field"). The original's Colors zone promises
     exactly this — "factory swatches from the decode — click to fill" — but the
     export's decode returned none, so these palettes are DEMO: real factory
     paint names for the model, standing in until the decoder feeds them.
     A click fills Exterior Color and sets Basic Exterior Color, as a normal
     edit (it lands in the dirty ledger). [name, swatch, basic colour] */
  var FACTORY = {
    '0P0300236 PS': [['Verde Zeltweg', '#2f4a36', 'Green'], ['Rosso Corsa', '#c41e1e', 'Red'], ['Rosso Fuoco', '#9e1a17', 'Red-Metallic'],
      ['Giallo Modena', '#f2c200', 'Yellow'], ['Blu Pozzi', '#1f3557', 'Blue-Metallic'], ['Nero Daytona', '#121214', 'Black'],
      ['Grigio Silverstone', '#71767b', 'Gray'], ['Bianco Avus', '#efefea', 'White']],
    '22928': [['GT Silver Metallic', '#b9bab6', 'Silver'], ['Guards Red', '#c8102e', 'Red'], ['Carrara White Metallic', '#ecebe6', 'White'],
      ['Black', '#0d0d0f', 'Black'], ['Agate Grey Metallic', '#5f6264', 'Gray']]
  };
  function factoryOf(v) { return FACTORY[v.stockno] || []; }
  function renderSwatches() {
    var list = factoryOf(S.v), cur = (S.v.ext_color || '').trim().toLowerCase();
    var hit = list.filter(function (c) { return c[0].toLowerCase() === cur; })[0];
    $('#ext-dot').style.background = hit ? hit[1] : 'transparent';
    $('#ext-dot').classList.toggle('inw__dot--none', !hit);
    $('#fsw').innerHTML = '<div class="fsw__h"><b>Factory colors</b><span>from the VIN decode</span><span class="chip-src">Demo</span></div>' +
      (list.length
        ? '<div class="fsw__l" role="group" aria-label="Factory exterior colors">' + list.map(function (c) {
            var on = c[0].toLowerCase() === cur;
            return '<button class="fsw__c' + (on ? ' fsw__c--on' : '') + '" type="button" data-swatch="' + esc(c[0]) + '" aria-pressed="' + on + '">' +
              '<i style="background:' + c[1] + '"></i><span>' + esc(c[0]) + '</span>' + (on ? ic('i-check') : '') + '</button>';
          }).join('') + '</div>'
        : '<p class="fsw__none">No factory colors from the decode for this vehicle — type the color above.</p>');
  }
  function renderAll() {
    renderCockpit();
    renderRail();
    renderVitals();
    renderVis();
    renderPhotos();
    renderDescTabs();
    renderDescPane();
    renderFeatures();
    renderSticker();
    renderFeeds();
    renderCustom();
    renderVideo();
    renderCarfax();
    renderValues();
    renderSwatches();
    renderDirty();
    spy();
  }

  /* ── jump + anchor · DESIGN.md §8 ────────────────────────────────────── */
  function jump(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var y = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - stickTotal() - cssPx('--anchor-gap', 10)));
    var sp = $('#jump-space');
    if (sp) {
      sp.style.height = '0px';
      var need = y - (document.documentElement.scrollHeight - window.innerHeight);
      sp.style.height = need > 0 ? Math.ceil(need) + 'px' : '0px';
    }
    window.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  /* All Vehicles · Photos view links here as #photos: arrive on the Photos
     section, placed as the rail places it, without a scroll ride from the top */
  if (location.hash === '#photos') window.addEventListener('load', function () {
    requestAnimationFrame(function () {
      var el = document.getElementById('zPhotos'); if (!el) return;
      window.scrollTo({ top: Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - stickTotal() - cssPx('--anchor-gap', 10))), behavior: 'auto' });
    });
  });

  var ZONES = ['zStatus', 'zPricing', 'zCustom', 'zPhotos', 'zVideo', 'zCarfax', 'zSpecs', 'zColors', 'zDesc', 'zFeat', 'zSticker', 'zFeeds', 'zMore', 'zUtil'];
  function spy() {
    var line = stickTotal() + cssPx('--anchor-gap', 10) + 1, cur = ZONES[0], i, el;
    for (i = 0; i < ZONES.length; i++) {
      el = document.getElementById(ZONES[i]);
      if (el && el.getBoundingClientRect().top <= line) cur = ZONES[i];
    }
    $$('.rail__i').forEach(function (b) {
      var on = b.dataset.jump === cur;
      b.classList.toggle('rail__i--on', on); b.classList.toggle('ui-nav__i--on', on);
      if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
  }

  /* ── engaged sticky state ────────────────────────────────────────────
     Published in two places by one handler: the cockpit itself, and the shell,
     because the platform bar is a sibling and cannot see the cockpit in the
     selector tree. */
  (function () {
    var cockpit = $('#cockpit'), app = $('#app'), stuck = null;
    function onScroll() {
      var s = window.scrollY > 0 && cockpit.getBoundingClientRect().top <= cssPx('--stick-bar', 68) + 0.5;
      if (s !== stuck) {
        stuck = s;
        cockpit.classList.toggle('cockpit--stuck', s);
        app.classList.toggle('is-stuck', s);
      }
      spy();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  })();

  /* ── transient message on the save bar ───────────────────────────────── */
  var sayT = null;
  function say(msg) {
    var el = $('#save-say');
    el.textContent = msg;
    el.hidden = false;
    if (sayT) clearTimeout(sayT);
    sayT = setTimeout(function () { el.hidden = true; }, 4000);
  }

  /* ── menus ───────────────────────────────────────────────────────────── */
  function closeMenus(except) {
    $$('.nav__it--open').forEach(function (it) {
      if (it !== except) {
        it.classList.remove('nav__it--open');
        var b = $('[data-menu]', it);
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  }
  function closePops(except) {
    $$('.pop--open').forEach(function (p) {
      if (p === except) return;
      p.classList.remove('pop--open');
      var t = $('[data-pop="' + p.id + '"]');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  /* ── the export's stated rules ───────────────────────────────────────── */
  function applyFeedRule() {
    /* "excluding ALL auto-flips Do Not Feed Out" */
    var on = feedsOn();
    if (on === 0 && !S.v.vis.nofeedout) {
      S.v.vis.nofeedout = true;
      say('Every feed excluded — “Do Not Feed Out” flipped on.');
    } else if (on > 0 && S.v.vis.nofeedout && S.base.vis.nofeedout === false) {
      S.v.vis.nofeedout = false;
    }
  }

  /* edit lock (SV note 19): shown only while someone else holds it */
  S.locked = false;
  function renderLock() {
    $('#lock').hidden = !S.locked;
    $('#lock-mine').hidden = S.locked;
    $$('[data-act="save"]').forEach(function (b) {
      b.setAttribute('aria-disabled', String(S.locked));
      b.classList.toggle('is-locked', S.locked);
      b.title = S.locked ? 'Mike R. is editing this car — saving is blocked' : 'Save (Ctrl+S)';
    });
  }
  function doSave() {
    if (S.locked) { say('Mike R. is editing this car — saving is blocked until they close it.'); return; }
    var n = changes().length;
    if (!n) return;
    /* "Switching to Sold auto-clears Pending Sale on save (existing rule)" */
    var cleared = false;
    if (S.v.status === 'Sold' && S.v.vis.pending_sale) { S.v.vis.pending_sale = false; cleared = true; }
    say('Prototype — nothing is written' + (cleared ? '; Pending Sale would clear (Sold).' : '.'));
    renderVis();
    renderDirty();
  }

  /* ── events ──────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var sw = e.target.closest && e.target.closest('[data-swatch]');
    if (sw) {
      var pick = factoryOf(S.v).filter(function (c) { return c[0] === sw.dataset.swatch; })[0];
      if (pick) {
        S.v.ext_color = pick[0];
        if (D.opt.basicExt.indexOf(pick[2]) >= 0) S.v.basic_ext_color = pick[2];
        renderValues(); renderSwatches(); renderDirty();
        var again = $('[data-swatch="' + pick[0] + '"]'); if (again) again.focus();
      }
      return;
    }
    var t = e.target, el;

    /* hover-only top menus, as on the old site (Matthew, note 8): with a mouse a
       click does not pin a menu open, so two can never overlap. Touch has no
       hover and keeps the tap-to-open; keyboard uses :focus-within. */
    if ((el = t.closest('[data-menu]')) && window.matchMedia('(hover: hover) and (pointer: fine)').matches) { closeMenus(); return; }
    if ((el = t.closest('[data-menu]'))) {
      var it = el.closest('.nav__it'), open = !it.classList.contains('nav__it--open');
      closeMenus(it); closePops();
      it.classList.toggle('nav__it--open', open);
      el.setAttribute('aria-expanded', open);
      return;
    }
    if (!t.closest('.nav__it')) closeMenus();

    if ((el = t.closest('[data-pop]'))) {
      var p = document.getElementById(el.dataset.pop), wasOpen = p.classList.contains('pop--open');
      closePops(); closeMenus();
      if (!wasOpen) { p.classList.add('pop--open'); el.setAttribute('aria-expanded', 'true'); }
      return;
    }
    if (!t.closest('.pop')) closePops();

    if ((el = t.closest('[data-jump]'))) { jump(el.dataset.jump); return; }

    if ((el = t.closest('[data-copy]'))) {
      var val = el.dataset.copy === 'vin' ? S.v.vin : S.v.stockno;
      var done = function () {
        el.classList.add('copy--done');
        setTimeout(function () { el.classList.remove('copy--done'); }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(val).then(done, function () {});
      else done();
      return;
    }

    if ((el = t.closest('.seg__b'))) {
      var seg = el.closest('[data-seg]'), key = seg.dataset.seg;
      if (key === 'certified') S.v.certified = el.dataset.v === 'on';
      else S.v[key] = el.dataset.v;
      renderValues(); renderCockpit(); renderRail(); renderDirty();
      return;
    }

    if ((el = t.closest('[data-tab]'))) { S.tab = el.dataset.tab; renderDescTabs(); renderDescPane(); renderDirty(); return; }
    if ((el = t.closest('[data-act="ai"]'))) { S.ai = !S.ai; renderDescPane(); return; }
    if ((el = t.closest('[data-act="ai-close"]'))) { S.ai = false; renderDescPane(); return; }

    if ((el = t.closest('[data-featx]'))) {
      var gx = +el.dataset.featx;
      S.v.std.splice(gx, 1);
      /* keep the unchecked marks on their own rows after the splice */
      if (S.v.stdOff) {
        var moved = {};
        Object.keys(S.v.stdOff).forEach(function (k) { k = +k; if (k !== gx) moved[k > gx ? k - 1 : k] = 1; });
        S.v.stdOff = moved;
      }
      renderFeatures(); renderRail(); renderDirty();
      return;
    }
    if ((el = t.closest('[data-featadd]'))) {
      var kind = el.dataset.featadd;
      S.v.std.push(kind === 'standard' ? ['', ''] : ['', '', kind]);
      renderFeatures(); renderRail(); renderDirty();
      return;
    }

    if ((el = t.closest('[data-act="feeds-all"]'))) {
      S.v.feeds = S.v.feeds.map(function () { return true; });
      applyFeedRule(); renderFeeds(); renderRail(); renderVis(); renderDirty();
      return;
    }
    if ((el = t.closest('[data-act="feeds-none"]'))) {
      S.v.feeds = S.v.feeds.map(function () { return false; });
      applyFeedRule(); renderFeeds(); renderRail(); renderVis(); renderDirty();
      return;
    }
    if ((el = t.closest('[data-act="save-feeds"]'))) { say('Prototype — feed control is not written.'); return; }
    if ((el = t.closest('[data-act="save-bg"]'))) { say('Prototype — buyers guide text is not written.'); return; }
    if ((el = t.closest('[data-act="addphoto"]'))) { addPhoto(); return; }
    if ((el = t.closest('[data-act="preview"]'))) {
      say('Preview opens this car on the dealer’s site in a new tab' +
        (changes().length ? ' — it shows the last saved version, not your unsaved changes.' : '.') +
        (S.v.vis.no_display ? ' The car is hidden from the public.' : '') + ' (Not part of this kit.)');
      return;
    }
    if ((el = t.closest('[data-act="cfx-rm"]'))) { delete S.cfxFile[S.ix]; renderCarfax(); return; }
    if ((el = t.closest('[data-featcat]'))) { var fk = el.dataset.featcat; S.featOpen[fk] = !S.featOpen[fk]; renderFeatures(); var fb = $('[data-featcat="' + fk + '"]'); if (fb) fb.focus(); return; }
    if ((el = t.closest('[data-featall]'))) { var on = el.dataset.featall === '1'; S.v.std.forEach(function (r) { if (!r[2] && r[0]) S.featOpen[r[0]] = on; }); renderFeatures(); var fa = $('[data-featall]'); if (fa) fa.focus(); return; }
    if ((el = t.closest('[data-act="sticker-pdf"]'))) { say('The sticker PDF opens from the backend — not part of this kit.'); return; }
    if ((el = t.closest('[data-act="sticker-rm"]'))) { delete S.stkBy[S.ix]; renderSticker(); return; }
    if ((el = t.closest('[data-photox]'))) { removePhoto(+el.dataset.photox); return; }
    if ((el = t.closest('[data-act="studio"]'))) { e.preventDefault(); say('Photo Studio is a separate page — not part of this kit.'); return; }
    if ((el = t.closest('[data-act="changelog"]'))) { say('The change log is a separate page — not part of this kit.'); return; }
    if ((el = t.closest('[data-act="pricehist"]'))) { say('Price history is not connected in this preview.'); return; }

    if ((el = t.closest('[data-act="decode"]'))) {
      var note = $('#decode-note');
      note.hidden = false;
      setTimeout(function () { note.hidden = true; }, 5000);
      return;
    }

    if ((el = t.closest('[data-print]'))) {
      /* "printing autosaves the additional text" — so the print action commits
         Buyers Guide Text into the baseline, and nothing else */
      S.base.desc.buyers_guide_text = S.v.desc.buyers_guide_text;
      closePops();
      renderDescTabs(); renderDirty();
      say('Prototype — “' + el.dataset.print + '” would print; buyers guide text autosaved.');
      return;
    }

    if ((el = t.closest('[data-act="prev"]')) || (el = t.closest('[data-act="next"]'))) {
      var dir = el.dataset.act === 'prev' ? -1 : 1;
      var next = (S.ix + dir + D.vehicles.length) % D.vehicles.length;
      if (changes().length && !window.confirm('You have unsaved changes. Leave this vehicle and lose them?')) return;
      load(next);
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    if ((el = t.closest('[data-act="save"]'))) { doSave(); return; }
    if ((el = t.closest('[data-act="discard"]'))) {
      if (!changes().length) return;
      S.v = clone(S.base);
      renderAll();
      say('Changes discarded.');
      return;
    }

    if (t.closest('a[href="#"]')) e.preventDefault();
  });

  document.addEventListener('input', function (e) {
    var el = e.target, k;
    if (el.id && el.id.indexOf('core-') === 0) {
      k = el.id.slice(5);
      if (CORE_LABEL[k]) {
        S.v[k] = el.value;
        if (k === 'price') renderCockpit();
        if (k === 'price') renderRail();
        if (k === 'vin') { $('#vinbar-v').textContent = el.value; renderCockpit(); }
        if (k === 'stockno') renderCockpit();
        if (k === 'ext_color') renderSwatches();
        if (k === 'YouTube_url' || k === 'video_url') renderVideo();
        renderDirty();
        return;
      }
    }
    if (el.id === 'cfx-link') { S.v.carfax = el.value.trim() || null; renderCarfaxStatus(); renderDirty(); return; }
    if (el.dataset.custom) { S.v.custom[el.dataset.custom] = el.value; renderDirty(); return; }
    if (el.dataset.desc) {
      S.v.desc[el.dataset.desc] = el.value;
      renderDescTabs(); renderRail(); renderDirty();
      return;
    }
    if (el.dataset.feat != null) { S.v.std[+el.dataset.feat][+el.dataset.col] = el.value; renderDirty(); return; }
    if (el.id === 'feed-q') { S.feedQ = el.value; renderFeeds(); return; }
  });

  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.dataset && el.dataset.featck != null) {
      var gi = +el.dataset.featck, offm = S.v.stdOff || (S.v.stdOff = {});
      if (el.checked) delete offm[gi]; else offm[gi] = 1;
      renderFeatures(); renderDirty();
      var again = $('[data-featck="' + gi + '"]'); if (again) again.focus();
      return;
    }
    if (el.id === 'demo-lock') { S.locked = el.checked; renderLock(); return; }
    if (el.id === 'cfx-file') { if (el.files && el.files[0]) { S.cfxFile[S.ix] = el.files[0].name; renderCarfax(); } return; }
    if (el.id === 'wstk-file') {
      if (el.files && el.files[0]) { S.stkBy[S.ix] = el.files[0].name; renderSticker(); }
      return;
    }
    if (el.dataset.vis) {
      S.v.vis[el.dataset.vis] = el.checked;
      el.closest('.swrow').classList.toggle('swrow--on', el.checked);
      if (el.dataset.vis === 'no_display') renderCockpit();
      renderDirty();
      return;
    }
    if (el.dataset.feed != null) {
      S.v.feeds[+el.dataset.feed] = el.checked;
      applyFeedRule();
      el.closest('.feedrow').classList.toggle('feedrow--off', !el.checked);
      renderRail(); renderVis(); renderDirty();
      var on = $('#s-feeds'), n = feedsOn(), total = S.v.feeds.length, off = total - n;
      on.innerHTML = 'sending to <b>' + n + '</b> of ' + total + ' feeds · ' +
        (off ? '<span class="warn">' + off + ' excluded</span>' : '0 excluded');
      return;
    }
    if (el.dataset.custom) { S.v.custom[el.dataset.custom] = el.checked; renderDirty(); return; }
    if (el.dataset.sw === 'zero_down') { S.v.zero_down = el.checked; renderDirty(); return; }
    if (el.dataset.sw === 'reset_when_added') { S.v.reset_when_added = el.checked; renderDirty(); return; }
    if (el.id && el.id.indexOf('core-') === 0 && el.tagName === 'SELECT') {
      S.v[el.id.slice(5)] = el.value;
      renderDirty();
      return;
    }
  });

  document.addEventListener('keydown', function (e) {
    /* Ctrl+S / ⌘S — the only shortcut on this page, and the savebar says so */
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      doSave();
      return;
    }
    if (e.key === 'Escape') { closePops(); closeMenus(); }
  });

  /* an editor with unsaved work warns on leave — the export's dirty-diff model */
  window.addEventListener('beforeunload', function (e) {
    if (changes().length) { e.preventDefault(); e.returnValue = ''; }
  });

  /* ── boot ────────────────────────────────────────────────────────────── */
  fillSelects();
  renderPrints();
  load(0);

  window.SV11demo = { S: S, load: load, changes: changes, jump: jump, stickTotal: stickTotal };
})();

/* ── the page reserves exactly the height of its save footer ────────────────
   The footer is fixed, so it is out of flow; the working surface has to hold
   its height back or the last field of the form sits underneath it. The bar
   grows when the unsaved-changes note appears, so it is measured rather than
   assumed. */
(function () {
  function sizeSaveBar() {
    var bar = document.querySelector('.savebar');
    if (!bar) return;
    document.documentElement.style.setProperty('--savebar-h', Math.ceil(bar.getBoundingClientRect().height) + 'px');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sizeSaveBar);
  else sizeSaveBar();
  window.addEventListener('resize', sizeSaveBar);
  if (window.ResizeObserver) {
    var bar = document.querySelector('.savebar');
    if (bar) new ResizeObserver(sizeSaveBar).observe(bar);
  }
})();
