/* AAN · Staff UI · Field Management — GENERATION 11
   Built from the system only: Feeds Incoming's staff skeleton and Manage Dealers' nav data, the shared
   components, the backend's own modes, filters, columns and actions. Everything here only reads:
   Enable and Disable write nothing (the result line says so). */
(function () {
  'use strict';
  var MD = window.MD, D = window.FM;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ic(id) { return '<svg class="i" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function nf(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  /* the backend's state: mode, dealer #, Show inactive, Group / Core / Source flag; q is the template's search */
  var S = { mode: 'global', dealer: '', inactive: false, group: '', core: '', flag: '', q: '' };
  var REG = {};
  D.registry.forEach(function (r) { REG[r[0]] = r; });

  /* review links: #dealer=277 opens that dealer's set, #mode=dealer the empty Dealer Field Set */
  location.hash.slice(1).split('&').forEach(function (p) {
    var kv = p.split('=');
    if (kv[0] === 'dealer' && /^\d+$/.test(kv[1] || '')) { S.dealer = kv[1]; S.mode = 'dealer'; }
    if (kv[0] === 'mode' && (kv[1] === 'dealer' || kv[1] === 'global')) S.mode = kv[1];
  });

  /* ── nav: the staff menus, as on every staff page; the registry is a System Tools screen ── */
  var NAV_HIDDEN = ['Add New OEM', 'View OEM Accounts', 'Add New Reseller Group', 'View Reseller Groups'];
  function renderNav() {
    $('#nav').innerHTML = MD.nav.map(function (g, i) {
      if (g.g === 'AAN Projects') return '';
      var id = 'p-nav-' + i, on = g.g === 'System Tools';
      return '<div class="nav__it' + (on ? ' nav__it--on' : '') + '">' +
        '<button class="nav__b" type="button" data-pop="' + id + '" aria-haspopup="true" aria-expanded="false">' + esc(g.g) + ic('i-chev') + '</button>' +
        '<div class="pop" id="' + id + '"><div class="caps pop__lab">' + esc(g.g) + '</div>' +
          g.i.filter(function (l) { return NAV_HIDDEN.indexOf(l) < 0; }).map(function (l) {
            var href = l === 'Feeds Incoming' ? 'feeds-incoming-gen11.html' : l === 'View Dealers' ? 'manage-dealers-gen11.html' : l === 'My Work' ? 'my-work-queue-gen11.html' : l === 'Create A Ticket' ? 'create-ticket-gen11.html' : l === 'Accounting' ? 'accounting-view-all-gen11.html' : '#';
            return '<a class="mn__it' + (l.indexOf('--') === 0 ? ' mn__it--sub' : '') + '" href="' + href + '">' + esc(l) + '</a>';
          }).join('') + '</div></div>';
    }).join('');
  }

  /* ── counts of the whole registry: read-only, as Manage Dealers' roster strip ── */
  function renderTally() {
    var c = D.counts;
    function tl(l, n) { return '<span class="tl"><span>' + esc(l) + '</span><b>' + nf(n) + '</b></span>'; }
    if (!$('#tally')) return;   /* the breakdown is commented out in the HTML (facelift only) */
    $('#tally').innerHTML = '<span class="caps tally__l">Registry</span>' +
      tl('Core', c.core) + tl('Custom', c.custom) + tl('With source flag', c.withFlag) +
      '<span class="caps tally__l fm-tally2">Physical types</span>' +
      c.types.map(function (t) { return tl(t[0], t[1]); }).join('');
  }

  /* ── facets: the backend's three filters, one popover each ── */
  function menu(list, cur, key, allLabel, mono) {
    function it(v, l) {
      var on = cur === v;
      return '<button class="mn__it' + (on ? ' mn__it--on' : '') + '" type="button" data-' + key + '="' + esc(v) + '" aria-pressed="' + on + '">' +
        ic('i-check') + (mono && v ? '<span class="fm-code">' + esc(l) + '</span>' : esc(l)) + '</button>';
    }
    return it('', allLabel) + list.map(function (x) { return it(x[0], x[1]); }).join('');
  }
  function coreLabel(v) { for (var i = 0; i < D.cores.length; i++) if (D.cores[i][0] === v) return D.cores[i][1]; return 'All'; }
  function renderFacets() {
    $('#group-list').innerHTML = menu(D.groups.map(function (g) { return [g, g]; }), S.group, 'group', 'All');
    $('#group-v').textContent = S.group || 'All';
    $('#core-list').innerHTML = menu(D.cores, S.core, 'core', 'All');
    $('#core-v').textContent = coreLabel(S.core);
    $('#flag-list').innerHTML = menu(D.sourceFlags.map(function (f) { return [f, f]; }), S.flag, 'flag', 'All', true);
    var fv = $('#flag-v');
    fv.textContent = S.flag || 'All'; fv.classList.toggle('fm-code', !!S.flag); fv.title = S.flag || '';
    [['p-group', S.group], ['p-core', S.core], ['p-flag', S.flag]].forEach(function (x) {
      $('[data-pop="' + x[0] + '"]').classList.toggle('facet__b--on', !!x[1]);
    });
  }

  /* ── the list ── */
  var HEAD = {
    global: [['c-name', 'Key'], ['c-label', 'Label'], ['c-type', 'Physical type'], ['c-group', 'Group'], ['c-core', 'Core'], ['c-flag', 'Source flag (provenance)']],
    dealer: [['c-name', 'Key'], ['c-label', 'Label'], ['c-type', 'Physical type'], ['c-group', 'Group'], ['c-core', 'Core'], ['c-src', 'Source'], ['c-active', 'Active'], ['c-act', '']]
  };
  function renderHead() {
    $('#hd').innerHTML = HEAD[S.mode].map(function (h) {
      return '<span class="' + h[0] + '" role="columnheader">' + (h[1] ? esc(h[1]) : '<span class="vh">Action</span>') + '</span>';
    }).join('');
    $('#rows').classList.toggle('fm-rows--dealer', S.mode === 'dealer');
  }
  function none() { return '<span class="dash">—</span>'; }
  function matches(r) {
    var q = S.q.toLowerCase();
    if (S.group && r[3] !== S.group) return false;
    if (S.core && r[4] !== S.core) return false;
    if (S.flag && r[5] !== S.flag) return false;
    if (q && r[0].toLowerCase().indexOf(q) < 0 && r[1].toLowerCase().indexOf(q) < 0) return false;
    return true;
  }
  function cellsCommon(r) {
    return '<span class="c-name fm-key" title="' + esc(r[0]) + '">' + esc(r[0]) + '</span>' +
      '<span class="c-label" title="' + esc(r[1]) + '">' + esc(r[1]) + '</span>' +
      '<span class="c-type fm-attr">' + esc(r[2]) + '</span>' +
      '<span class="c-group fm-attr">' + (r[3] ? esc(r[3]) : none()) + '</span>' +
      '<span class="c-core fm-attr">' + esc(r[4]) + '</span>';
  }
  function globalRow(r) {
    return '<div class="row" role="row" data-key="' + esc(r[0]) + '">' + cellsCommon(r) +
      '<span class="c-flag">' + (r[5] ? '<span class="fm-code" title="' + esc(r[5]) + '">' + esc(r[5]) + '</span>' : none()) + '</span></div>';
  }
  function dealerRow(d) {
    var r = REG[d[0]], on = d[2];
    return '<div class="row" role="row" data-key="' + esc(d[0]) + '">' + cellsCommon(r) +
      '<span class="c-src fm-code">' + esc(d[1]) + '</span>' +
      '<span class="c-active"><span class="stat ' + (on ? 'stat--ok">Active' : 'stat--quiet">Inactive') + '</span></span>' +
      '<span class="c-act"><button class="btn btn--quiet btn--sm" type="button" data-row-act title="Demo — nothing is saved" aria-label="' + (on ? 'Disable ' : 'Enable ') + esc(d[0]) + ' (demo, nothing is saved)">' + (on ? 'Disable' : 'Enable') + '</button></span></div>';
  }
  function filterDesc() {
    var f = [];
    if (S.group) f.push('group ' + S.group);
    if (S.core) f.push(coreLabel(S.core).toLowerCase());
    if (S.flag) f.push(S.flag);
    if (S.q) f.push('"' + S.q + '"');
    return f.length ? ' <span class="fm-sep">·</span> ' + esc(f.join(' · ')) : '';
  }
  /* "Showing 56 of 397 fields · demo sample" — the real total, and how much of it this demo carries;
     filtered, the count is of the sample, and says so */
  function scopeLine(shown, sample, total) {
    var f = filterDesc();
    if (!f && shown === sample) return 'Showing <b>' + shown + '</b> of <b>' + nf(total) + '</b> fields <span class="muted">· demo sample</span>';
    return 'Showing <b>' + shown + '</b> of the ' + sample + ' sampled' + f;
  }
  function empty(title, text, action) {
    return '<div class="empty"><b>' + esc(title) + '</b>' + (text ? '<p>' + text + '</p>' : '') + (action || '') + '</div>';
  }

  function render() {
    var tb = $('#tb'), scope = $('#scope'), foot = $('#foot-n'), meta = $('#page-meta');
    var dealer = S.dealer && D.dealers[S.dealer];
    var any = S.group || S.core || S.flag || S.q;
    $('#fm-table').hidden = true;
    var clear = '<button class="linkbtn" type="button" data-act="clear">' + ic('i-x') + 'Clear filters</button>';

    /* modes */
    $$('[data-mode]').forEach(function (b) {
      var on = b.getAttribute('data-mode') === S.mode;
      b.classList.toggle('ui-view--on', on); b.classList.toggle('lane--on', on); b.setAttribute('aria-pressed', String(on));
    });
    var dn = $('#mode-dealer-n'); dn.hidden = !dealer; dn.textContent = dealer ? nf(dealer.total) : '';
    $('#dealer-x').hidden = !S.dealer;
    renderHead();

    if (S.mode === 'global') {
      $('#enable').hidden = true;
      meta.textContent = nf(D.total) + ' registry fields';
      var rows = D.registry.filter(matches);
      tb.innerHTML = rows.length ? rows.map(globalRow).join('') :
        empty('No field in this sample matches', 'Clear the search or a filter. The full registry (' + nf(D.total) + ' fields) is filtered by the backend.', clear);
      scope.innerHTML = scopeLine(rows.length, D.registry.length, D.total);
      foot.innerHTML = '<b>' + nf(D.total) + '</b> registry fields';
      return;
    }

    /* Dealer Field Set */
    if (!S.dealer) {
      $('#enable').hidden = true;
      meta.textContent = nf(D.total) + ' registry fields';
      tb.innerHTML = empty('Enter a dealer # to view and manage its vehicle field set.', '',
        '<button class="linkbtn" type="button" data-open="277">Demo sample: Chicago Motor Cars — dealer #277</button>');
      scope.innerHTML = 'No dealer chosen';
      foot.innerHTML = 'Dealer field set';
      return;
    }
    if (!dealer) {
      $('#enable').hidden = true;
      meta.textContent = 'dealer #' + S.dealer;
      tb.innerHTML = empty('No sample for dealer #' + S.dealer + ' in this demo',
        'The backend opens any dealer’s set; this demo carries the one that was read.',
        '<button class="linkbtn" type="button" data-open="277">Open Chicago Motor Cars — dealer #277</button>');
      scope.innerHTML = 'Dealer #<b>' + esc(S.dealer) + '</b> <span class="muted">· not in this demo</span>';
      foot.innerHTML = 'Dealer #' + esc(S.dealer);
      return;
    }
    $('#enable').hidden = false;
    $('#fm-table').hidden = false;
    $('#enable-table').textContent = dealer.table;
    meta.textContent = dealer.name + ' — dealer #' + S.dealer;
    var drows = dealer.rows.filter(function (d) { return (S.inactive || d[2]) && matches(REG[d[0]]); });
    tb.innerHTML = drows.length ? drows.map(dealerRow).join('') :
      empty('No field in this sample matches', 'Clear the search or a filter. The dealer’s full set (' + dealer.total + ' fields) is filtered by the backend.', clear);
    scope.innerHTML = scopeLine(drows.length, dealer.rows.length, dealer.total);
    foot.innerHTML = '<b>' + dealer.total + '</b> fields';
  }

  /* ── Enable field: reads the key, writes nothing; the result stands beside it, its room reserved ── */
  $('#keys').innerHTML = D.registry.map(function (r) { return '<option value="' + esc(r[0]) + '">'; }).join('');
  function result(kind) {
    var r = $('.fm-res'); r.classList.toggle('fm-res--ok', kind === 'ok'); r.classList.toggle('fm-res--err', kind === 'err');
  }
  $('#enable').addEventListener('submit', function (e) {
    e.preventDefault();
    result($('#enable-key').value.trim() ? 'ok' : 'err');
  });
  $('#enable-key').addEventListener('input', function () { result(''); });

  /* ── popovers: Feeds Incoming's behaviour ── */
  function closePops(except) {
    $$('.pop--open').forEach(function (p) {
      if (p === except) return;
      p.classList.remove('pop--open');
      var t = $('[data-pop="' + p.id + '"]'); if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-pop]');
    if (t) {
      var p = document.getElementById(t.getAttribute('data-pop')), open = !p.classList.contains('pop--open');
      closePops(open ? p : null); p.classList.toggle('pop--open', open); t.setAttribute('aria-expanded', String(open)); return;
    }
    var el;
    if ((el = e.target.closest('[data-group]'))) { S.group = el.getAttribute('data-group'); closePops(null); renderFacets(); render(); return; }
    if ((el = e.target.closest('[data-core]'))) { S.core = el.getAttribute('data-core'); closePops(null); renderFacets(); render(); return; }
    if ((el = e.target.closest('[data-flag]'))) { S.flag = el.getAttribute('data-flag'); closePops(null); renderFacets(); render(); return; }
    if ((el = e.target.closest('[data-mode]'))) { S.mode = el.getAttribute('data-mode'); result(''); render(); return; }
    if ((el = e.target.closest('[data-open]'))) { S.dealer = el.getAttribute('data-open'); S.mode = 'dealer'; $('#dealer').value = S.dealer; render(); return; }
    if (e.target.closest('[data-act="clear"]')) { S.group = S.core = S.flag = S.q = ''; $('#q').value = ''; renderFacets(); render(); return; }
    if (e.target.closest('#dealer-x')) { S.dealer = ''; $('#dealer').value = ''; result(''); render(); $('#dealer').focus(); return; }
    if (e.target.closest('a[href="#"]')) e.preventDefault();
    if (!e.target.closest('.pop')) closePops(null);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePops(null); });
  $('#q').addEventListener('input', function () { S.q = this.value.trim(); render(); });
  $('#dealer').addEventListener('input', function () {
    var v = this.value.replace(/\D+/g, '');
    if (v !== this.value) this.value = v;
    S.dealer = v; if (v) S.mode = 'dealer'; result(''); render();
  });
  $('#inactive').addEventListener('change', function () { S.inactive = this.checked; render(); });

  /* ── the engaged sticky stack (DESIGN.md §7): one handler publishes .cmd--stuck, .hd--stuck and
       #app.is-stuck; CSS publishes the geometry, the script reads the plain values ── */
  (function () {
    var cmd = $('#cmd'), hd = $('#hd'), app = $('#app');
    var stuck = null, hdStuck = null, cmdTop, hdTop;
    function cssPx(name, d) { var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)); return isNaN(v) ? d : v; }
    function read() { cmdTop = cssPx('--stick-bar', 56); hdTop = cmdTop + cssPx('--stick-cmd', 56); }
    function onScroll() {
      var s = window.scrollY > 0 && cmd.getBoundingClientRect().top <= cmdTop + 0.5;
      if (s !== stuck) { stuck = s; cmd.classList.toggle('cmd--stuck', s); app.classList.toggle('is-stuck', s); }
      var h = window.scrollY > 0 && hd.getBoundingClientRect().top <= hdTop + 0.5;
      if (h !== hdStuck) { hdStuck = h; hd.classList.toggle('hd--stuck', h); }
    }
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { read(); onScroll(); });
    onScroll();
  })();

  $('#dealer').value = S.dealer;
  renderNav(); renderTally(); renderFacets(); render();
})();
