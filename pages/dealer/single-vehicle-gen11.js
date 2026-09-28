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
    ['bookvalue', 'Bookvalue'], ['discount', 'Discount'], ['original_price', 'Original Price'],
    ['location', 'Location'], ['modelnumber', 'Modelnumber'], ['bodyCode', 'BodyCode'],
    ['add_options', 'Add Options'], ['video_url', 'Video Url']
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
    if (JSON.stringify(v.std) !== JSON.stringify(b.std)) out.push({ k: 'features', label: 'Features (rows changed)', group: true });
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
    if (x >= 100000) return '$' + Math.round(x / 1000) + 'k';
    return '$' + (x / 1000).toFixed(1) + 'k';
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

    var st = $('#cock-status');
    st.textContent = v.status.toUpperCase();
    st.className = 'pill ' + (v.status === 'Available' ? 'pill--ok' : v.status === 'Pending' ? 'pill--violet' : v.status === 'Sold' ? 'pill--bad' : '');
    $('#cock-type').textContent = v.vtype.toUpperCase();

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
    var abbr = { Available: 'AVAIL', Sold: 'SOLD', Pending: 'PEND', Staging: 'STAGE' };
    st.textContent = abbr[v.status];
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

  function renderVis() {
    $('#vis').innerHTML = D.vis.map(function (s) {
      return '<div class="swrow' + (s.tone === 'danger' ? ' swrow--danger' : '') + '">' +
        '<span class="swrow__x"><b>' + esc(s.label) + '</b><span>' + esc(s.help) + '</span></span>' +
        '<label class="sw' + (s.tone === 'danger' ? ' sw--danger' : '') + '">' +
        '<input type="checkbox" id="core-' + s.id + '" name="core-' + s.id + '" data-vis="' + s.id + '" aria-label="' + esc(s.label) + '"' +
        (S.v.vis[s.id] ? ' checked' : '') + '><span class="sw__t"></span></label>' +
        '</div>';
    }).join('');
  }

  function renderPhotos() {
    var v = S.v, n = v.photos, tiles = [], i;
    var shown = Math.min(n, 8);
    for (i = 1; i <= shown; i++) {
      if (i === 1 && v.thumb) {
        tiles.push('<figure class="photo"><img src="' + esc(v.thumb) + '" alt="Photo 1 of the ' + esc(v.title) + '">' +
          '<span class="photo__ix">1</span><span class="photo__star" title="Main photo">' + ic('i-star') + '</span></figure>');
      } else {
        tiles.push('<figure class="photo photo--ph" title="Image file not in this kit">' + ic('i-image') +
          '<span class="photo__ix">' + i + '</span>' +
          (i === 1 ? '<span class="photo__star" title="Main photo">' + ic('i-star') + '</span>' : '') + '</figure>');
      }
    }
    if (n > shown) tiles.push('<div class="photo photo--more">+' + nf(n - shown) + '</div>');
    tiles.push('<button class="photo photo--add" type="button" data-act="studio">' + ic('i-plus') + 'Add photos</button>');
    $('#photos').innerHTML = tiles.join('');

    $('#s-photos').innerHTML = n
      ? '<b>' + nf(n) + '</b> on disk · #1 is the main photo'
      : '<span class="warn">No photos on disk</span>';

    var placeholders = shown - (v.thumb ? 1 : 0);
    var note = $('#photos-note');
    if (placeholders > 0) {
      note.hidden = false;
      note.innerHTML = 'Hatched tiles are placeholders: ' + placeholders + ' of the ' + nf(n) +
        ' image files are not part of this kit. The count is the export’s.';
    } else {
      note.hidden = true;
      note.innerHTML = '';
    }
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

  function renderDescPane() {
    var t = D.descTabs.filter(function (x) { return x.id === S.tab; })[0];
    var id = 'desc-' + t.id;
    var html =
      '<div class="f" data-f="desc.' + t.id + '">' +
      '<label class="f__l" for="' + id + '">' + esc(t.label) + '</label>' +
      '<textarea class="ta' + (t.rich ? ' ta--tall' : '') + '" id="' + id + '" data-desc="' + t.id + '" rows="' +
      (t.rich ? 14 : 8) + '" spellcheck="' + (t.rich ? 'false' : 'true') + '"></textarea>' +
      (t.rich ? '<span class="f__help">Stored HTML — the same source the rich-text editor writes.</span>' : '') +
      (t.id === 'buyers_guide_text'
        ? '<div class="desc__foot"><span class="f__help">This text prints on the buyers guide. It is autosaved when you click a print link in the Prints menu.</span>' +
          '<button class="btn btn--sheet btn--sm" type="button" data-act="save-bg">Save Buyers Guide Text</button></div>'
        : '') +
      '</div>';
    $('#desc-pane').innerHTML = html;
    $('#' + id).value = S.v.desc[t.id];
    $('#desc').classList.toggle('desc--dock', S.ai);
    $('#aidock').hidden = !S.ai;
    $('#ai-btn').innerHTML = ic('i-spark') + (S.ai ? 'Close AI Writer' : 'AI Writer');
    $('#ai-cta').hidden = S.ai;
  }

  function renderFeatures() {
    var v = S.v;
    var custom = v.std.filter(function (r) { return r[2] === 'option'; });
    var optional = v.std.filter(function (r) { return r[2] === 'optional'; });
    var standard = v.std.filter(function (r) { return !r[2]; });

    function rows(list, kind) {
      if (!list.length) return '<p class="featnone">None on this vehicle.</p>';
      var out = [], last = null;
      list.forEach(function (r) {
        var gi = v.std.indexOf(r);
        if (kind === 'standard' && r[0] !== last) {
          last = r[0];
          var n = list.filter(function (x) { return x[0] === last; }).length;
          out.push('<div class="featcat">' + esc(last) + ' · ' + n + '</div>');
        }
        out.push('<div class="featrow">' +
          '<input class="in in--sm" type="text" id="feat-' + gi + '-cat" name="feat-' + gi + '-cat" placeholder="Category" value="' + esc(r[0]) + '" data-feat="' + gi + '" data-col="0" aria-label="Category of feature row ' + (gi + 1) + '">' +
          '<input class="in in--sm" type="text" id="feat-' + gi + '-val" name="feat-' + gi + '-val" placeholder="Value" value="' + esc(r[1]) + '" data-feat="' + gi + '" data-col="1" aria-label="Value of feature row ' + (gi + 1) + '">' +
          '<button class="rowx" type="button" data-featx="' + gi + '" aria-label="Remove this feature row" title="Remove">' + ic('i-x') + '</button>' +
          '</div>');
      });
      return out.join('');
    }

    $('#feat').innerHTML =
      '<div class="featgrp"><div class="featgrp__h"><span class="caps">Additional options (custom) · ' + custom.length + '</span>' +
      '<button class="btn btn--sheet btn--sm" type="button" data-featadd="option">' + ic('i-plus') + 'Add option</button></div>' + rows(custom, 'option') + '</div>' +
      '<div class="featgrp"><div class="featgrp__h"><span class="caps">Optional equipment · ' + optional.length + '</span>' +
      '<button class="btn btn--sheet btn--sm" type="button" data-featadd="optional">' + ic('i-plus') + 'Add optional</button></div>' + rows(optional, 'optional') + '</div>' +
      '<div class="featgrp"><div class="featgrp__h"><span class="caps">Standard equipment · ' + standard.length + '</span>' +
      '<button class="btn btn--sheet btn--sm" type="button" data-featadd="standard">' + ic('i-plus') + 'Add standard</button></div>' + rows(standard, 'standard') + '</div>';
  }

  function renderFeeds() {
    var q = S.feedQ.toLowerCase();
    var html = D.feeds.map(function (f, i) {
      if (q && f[0].toLowerCase().indexOf(q) < 0 && f[1].toLowerCase().indexOf(q) < 0) return '';
      var on = S.v.feeds[i];
      return '<div class="feedrow' + (on ? '' : ' feedrow--off') + '">' +
        '<label class="sw sw--ok"><input type="checkbox" id="feed-' + i + '" name="feed-' + i + '" data-feed="' + i + '"' + (on ? ' checked' : '') +
        ' aria-label="Send this vehicle to ' + esc(f[0]) + '"><span class="sw__t"></span></label>' +
        '<span class="feedrow__n" title="' + esc(f[0]) + '">' + esc(f[0]) + '</span>' +
        '<span class="feedrow__t">' + esc(f[1]) + '</span></div>';
    }).join('');
    $('#feeds').innerHTML = html || '<p class="featnone">No feed matches that filter.</p>';
    var on = feedsOn(), total = S.v.feeds.length, off = total - on;
    $('#s-feeds').innerHTML = 'sending to <b>' + on + '</b> of ' + total + ' feeds · ' +
      (off ? '<span class="warn">' + off + ' excluded</span>' : '0 excluded');
  }

  function renderCustom() {
    $('#custom').innerHTML = D.custom.map(function (c) {
      if (c.type === 'switch') {
        return '<div class="swrow" style="box-shadow:none;align-self:end">' +
          '<span class="swrow__x"><b>' + esc(c.label) + '<span class="f__raw">' + esc(c.raw) + '</span></b></span>' +
          '<label class="sw"><input type="checkbox" id="custom-' + c.id + '" name="custom-' + c.id + '" data-custom="' + c.id + '" aria-label="' + esc(c.label) + '"' +
          (S.v.custom[c.id] ? ' checked' : '') + '><span class="sw__t"></span></label></div>';
      }
      return '<div class="f" data-f="custom.' + c.id + '">' +
        '<label class="f__l" for="custom-' + c.id + '">' + esc(c.label) + '<span class="f__raw">' + esc(c.raw) + '</span></label>' +
        '<input class="in" id="custom-' + c.id + '" name="custom-' + c.id + '" type="text" autocomplete="off" data-custom="' + c.id + '" value="' + esc(S.v.custom[c.id]) + '">' +
        '</div>';
    }).join('');
  }

  function renderCarfax() {
    var v = S.v;
    $('#carfax').innerHTML = v.carfax
      ? '<a class="pill pill--ok" href="' + esc(v.carfax) + '" target="_blank" rel="noopener" style="height:26px;padding:0 10px;font-size:12px;letter-spacing:.04em">Free CARFAX Report ' + ic('i-ext') + '</a>'
      : '<span class="ro">No CARFAX report on this vehicle’s cfx columns</span>';
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

  function renderAll() {
    renderCockpit();
    renderRail();
    renderVitals();
    renderVis();
    renderPhotos();
    renderDescTabs();
    renderDescPane();
    renderFeatures();
    renderFeeds();
    renderCustom();
    renderCarfax();
    renderValues();
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

  var ZONES = ['zStatus', 'zPricing', 'zPhotos', 'zSpecs', 'zColors', 'zDesc', 'zFeat', 'zFeeds', 'zCustom', 'zMore', 'zUtil'];
  function spy() {
    var line = stickTotal() + cssPx('--anchor-gap', 10) + 1, cur = ZONES[0], i, el;
    for (i = 0; i < ZONES.length; i++) {
      el = document.getElementById(ZONES[i]);
      if (el && el.getBoundingClientRect().top <= line) cur = ZONES[i];
    }
    $$('.rail__i').forEach(function (b) {
      var on = b.dataset.jump === cur;
      b.classList.toggle('rail__i--on', on);
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

  function doSave() {
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
    var t = e.target, el;

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
      S.v.std.splice(+el.dataset.featx, 1);
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
    if ((el = t.closest('[data-act="studio"]'))) { e.preventDefault(); say('Photo Studio is a separate page — not part of this kit.'); return; }
    if ((el = t.closest('[data-act="changelog"]'))) { say('The change log is a separate page — not part of this kit.'); return; }
    if ((el = t.closest('[data-act="pricehist"]'))) { say('Price history comes from changeslog — not connected here.'); return; }

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
        renderDirty();
        return;
      }
    }
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
    if (el.dataset.vis) {
      S.v.vis[el.dataset.vis] = el.checked;
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
