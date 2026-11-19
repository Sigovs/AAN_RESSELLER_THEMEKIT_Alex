/* AAN · Staff UI · Sales Report — GENERATION 11
   Built from the system only. Reads; never writes. What works: the year filter (only 2026 was read, the
   other years say so), Jump to (scrolls, and marks the section in view), sorting by Total, Print.
   Review states by hash: #loading (the backend's count sweep), #interrupted, #y2024 / #yAll (an unread year). */
(function () {
  'use strict';
  var MD = window.MD, D = window.SR;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ic(id, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function nf(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fig(n) { return n == null ? '<span class="dash" aria-label="none">—</span>' : nf(n); }
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

  var S = { year: String(D.year), state: '', dir: {} };   /* state: '' | 'loading' | 'interrupted' */
  D.sections.forEach(function (s) { S.dir[s.id] = 'desc'; });

  /* ── nav: the staff menus, as on every staff page. The Sales Report sits in no group, so none is current ── */
  var NAV_HIDDEN = ['Add New OEM', 'View OEM Accounts', 'Add New Reseller Group', 'View Reseller Groups'];
  var LINKS = { 'Feeds Incoming': 'feeds-incoming-gen11.html', 'View Dealers': 'manage-dealers-gen11.html', 'My Work': 'my-work-queue-gen11.html', 'Create A Ticket': 'create-ticket-gen11.html', 'Accounting': 'accounting-view-all-gen11.html' };
  function renderNav() {
    $('#nav').innerHTML = MD.nav.map(function (g, i) {
      if (g.g === 'AAN Projects') return '';
      var id = 'p-nav-' + i;
      return '<div class="nav__it">' +
        '<button class="nav__b" type="button" data-pop="' + id + '" aria-haspopup="true" aria-expanded="false">' + esc(g.g) + ic('i-chev') + '</button>' +
        '<div class="pop" id="' + id + '"><div class="caps pop__lab">' + esc(g.g) + '</div>' +
          g.i.filter(function (l) { return NAV_HIDDEN.indexOf(l) < 0; }).map(function (l) {
            return '<a class="mn__it' + (l.indexOf('--') === 0 ? ' mn__it--sub' : '') + '" href="' + (LINKS[l] || '#') + '">' + esc(l) + '</a>';
          }).join('') + '</div></div>';
    }).join('');
  }

  /* ── year: All · 2023 · 2024 · 2025 · 2026, and More years ── */
  function renderYears() {
    $('#years').innerHTML = D.years.map(function (y) {
      var v = String(y);
      return '<label class="seg__o"><input type="radio" name="year" value="' + v + '"' + (v === S.year ? ' checked' : '') +
        '><span data-l="' + v + '">' + v + '</span></label>';
    }).join('');
  }
  var read = function () { return S.year === String(D.year); };
  function yearWords() { return S.year === 'All' ? 'all years' : S.year; }

  /* ── board ── */
  function renderDeck() {
    var ok = read();
    $('#head-meta').textContent = S.year === 'All' ? 'All years' : S.year;
    $('#deck-t').textContent = S.year === 'All' ? 'Sales, all years' : 'Sales in ' + S.year;
    var m = $('#deck-m');
    if (!ok) m.textContent = (S.year === 'All' ? 'All years were' : S.year + ' was') + ' not read for this mockup · only ' + D.year + ' was';
    else if (S.state === 'loading') m.innerHTML = ic('i-refresh', 'sr-spin') + '<span>Counting…</span>';
    else if (S.state === 'interrupted') m.innerHTML = '<span>Count interrupted ·</span><button class="sr-resume" type="button" data-act="resume">Resume count</button>';
    else m.textContent = '';
    $('#tiles').innerHTML = D.tiles.map(function (t, i) {
      var k = i === 0 ? 'Fleet sold · ' + (S.year === 'All' ? 'all years' : S.year) : t.k;
      var v, cls = '';
      if (!ok) { v = '—'; cls = ' tile__v--none'; }
      else if (S.state === 'loading') { v = 'Loading…'; cls = ' tile__v--wait'; }
      else v = t.v;
      return '<div class="tile"><span class="tile__k" title="' + esc(k) + '">' + esc(k) + '</span>' +
        '<span class="tile__v' + cls + '" title="' + esc(v) + '"><span>' + esc(v) + '</span></span>' +
        '<span class="tile__s">' + (ok && S.state !== 'loading' ? esc(t.s) : '&nbsp;') + '</span></div>';
    }).join('');
  }

  /* ── jump to: the three sections with their totals ── */
  function renderJump() {
    var ok = read();
    /* an unread year has no sections to jump to: the tabs stay (nothing moves), none is current, none acts */
    $('#jump').innerHTML = D.sections.map(function (s, i) {
      var on = ok && i === 0;
      return '<a class="lane ui-view' + (on ? ' ui-view--on' : '') + '" href="#' + s.id + '" data-jump="' + s.id + '"' + (on ? ' aria-current="true"' : '') +
        (ok ? '' : ' aria-disabled="true" title="Nothing to jump to for ' + esc(yearWords()) + '"') + '>' +
        '<span>' + esc(s.jump) + '</span><b>' + (!ok ? '—' : S.state === 'loading' && s.ranked ? '…' : nf(s.total)) + '</b></a>';
    }).join('');
  }

  /* ── the three tables ── */
  function cols(s) {
    var h = '<colgroup>';
    if (s.ranked) h += '<col class="k-rank"><col><col class="k-tot"><col class="k-share">';
    else h += '<col><col class="k-tot2">';
    for (var i = 0; i < 12; i++) h += '<col class="k-m">';
    return h + '</colgroup>';
  }
  function head(s) {
    var d = S.dir[s.id];
    var h = '<thead><tr>';
    if (s.ranked) h += '<th scope="col" class="c-stick">#</th>';
    h += '<th scope="col" class="c-stick c-stick-edge' + (s.ranked ? ' c-stick--2' : '') + '">' + esc(s.first) + '</th>' +
      '<th scope="col" aria-sort="' + (d === 'asc' ? 'ascending' : 'descending') + '"><button class="s s--on' + (d === 'asc' ? ' s--asc' : '') +
        '" type="button" data-sort="' + s.id + '" title="Sort by total, ' + (d === 'asc' ? 'largest first' : 'smallest first') + '">Total (All Months)' + ic('i-dn') + '</button></th>';
    if (s.ranked) h += '<th scope="col">Share of fleet</th>';
    D.months.forEach(function (m, i) { h += '<th scope="col"' + (i === 0 ? ' class="c-m1"' : '') + '>' + m + '</th>'; });
    return h + '</tr></thead>';
  }
  function body(s) {
    var rows = s.rows.slice(), ti = s.ranked ? 2 : 1, d = S.dir[s.id];
    rows.sort(function (a, b) { return d === 'asc' ? a[ti] - b[ti] : b[ti] - a[ti]; });
    return '<tbody>' + rows.map(function (r) {
      var h = '<tr>';
      if (s.ranked) h += '<td class="c-rank c-stick">' + r[0] + '</td>';
      var name = s.ranked ? r[1] : r[0];
      h += '<td class="c-id c-stick c-stick-edge' + (s.ranked ? ' c-stick--2' : '') + '" title="' + esc(name) + '">' + esc(name) + '</td>';
      if (S.state === 'loading' && s.ranked) {
        h += '<td class="c-tot sr-wait">…</td><td class="sr-wait">…</td>';
        for (var w = 0; w < 12; w++) h += '<td class="sr-wait' + (w === 0 ? ' c-m1' : '') + '">…</td>';
        return h + '</tr>';
      }
      h += '<td class="c-tot">' + nf(r[ti]) + '</td>';
      if (s.ranked) h += '<td>' + esc(r[3]) + '</td>';
      (s.ranked ? r[4] : r[2]).forEach(function (n, i) { h += '<td' + (i === 0 ? ' class="c-m1"' : '') + '>' + fig(n) + '</td>'; });
      return h + '</tr>';
    }).join('') + '</tbody>';
  }
  function foot(s) {
    var f = s.foot, h = '<tfoot><tr>';
    h += '<td class="c-lab c-stick c-stick-edge"' + (s.ranked ? ' colspan="2"' : '') + '>' + esc(f.label) + '</td>';
    if (S.state === 'loading' && s.ranked) h += '<td class="sr-wait">Counting…</td>';
    else h += '<td>' + nf(f.total) + '</td>';
    if (s.ranked) h += '<td><span class="dash">—</span></td>';
    f.m.forEach(function (n, i) { h += '<td' + (i === 0 ? ' class="c-m1"' : '') + '>' + (S.state === 'loading' && s.ranked ? '<span class="sr-wait">…</span>' : fig(n)) + '</td>'; });
    return h + '</tr></tfoot>';
  }
  function section(s) {
    var n = s.ranked ? '<span class="sr-sec__n">Showing <b>' + s.rows.length + '</b> of <b>' + s.count + '</b> dealers · the rest are not in this sample</span>' : '';
    return '<section class="sr-sec" id="' + s.id + '" aria-labelledby="' + s.id + '-t">' +
      '<div class="sec__h"><h2 id="' + s.id + '-t">' + esc(s.title) + '</h2>' +
        (s.by ? '<span class="sr-sec__by">· ' + esc(s.by) + '</span>' : '') +
        '<span class="sr-sec__sp"></span>' + n + '</div>' +
      '<div class="sr-scroll"><table class="sr-tbl zebra' + (s.ranked ? ' sr-tbl--ranked' : '') + '" id="' + s.id + '-tbl">' +
        '<caption class="vh">' + esc(s.title + (s.by ? ' · ' + s.by : '') + ', ' + D.year + ', sold per month') + '</caption>' +
        cols(s) + head(s) + body(s) + foot(s) + '</table></div></section>';
  }
  function renderTables() {
    var ok = read(), emp = $('#empty');
    $('#secs').hidden = !ok;
    emp.hidden = ok;
    if (ok) $('#secs').innerHTML = D.sections.map(section).join('');
    else emp.innerHTML = '<b>No ' + esc(yearWords()) + ' figures in this mockup</b>' +
      '<p>Only ' + D.year + ' was read from the backend, on ' + esc(D.read) + '.</p>' +
      '<button class="linkbtn" type="button" data-year="' + D.year + '">Show ' + D.year + '</button>';
    $('#foot-n').innerHTML = ok ? '<b>' + D.sections.length + '</b> sections · All Dealers <b>40</b> of <b>232</b> rows' : 'Nothing shown for ' + esc(yearWords());
  }

  function render() { renderDeck(); renderJump(); renderTables(); spy(); }

  /* ── Jump to: scroll the chapter under the sticky band; mark the chapter in view ── */
  function stackBottom() {
    var cs = getComputedStyle(document.documentElement);
    var band = $('#band').getBoundingClientRect();
    return Math.max(parseFloat(cs.getPropertyValue('--stick-bar')) || 56, band.bottom);
  }
  function spy() {
    var secs = $$('.sr-sec'); if (!secs.length || !read()) return;
    var line = stackBottom() + 8, cur = secs[0].id;
    secs.forEach(function (s) { if (s.getBoundingClientRect().top <= line) cur = s.id; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) cur = secs[secs.length - 1].id;
    $$('#jump [data-jump]').forEach(function (a) {
      var on = a.getAttribute('data-jump') === cur;
      a.classList.toggle('ui-view--on', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  var spyQueued = false;
  window.addEventListener('scroll', function () {
    if (spyQueued) return; spyQueued = true;
    requestAnimationFrame(function () { spyQueued = false; spy(); });
  }, { passive: true });

  /* ── review states by hash ── */
  function fromHash() {
    var h = location.hash.slice(1).split('&');
    S.state = h.indexOf('loading') >= 0 ? 'loading' : h.indexOf('interrupted') >= 0 ? 'interrupted' : '';
    h.forEach(function (x) {
      var m = /^y(All|\d{4})$/i.exec(x);
      if (m) S.year = m[1].toLowerCase() === 'all' ? 'All' : m[1];
    });
  }

  /* ── popovers: the staff pages' behaviour ── */
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
    if ((el = e.target.closest('[data-jump]'))) {
      e.preventDefault();
      if (!read()) return;
      var sec = document.getElementById(el.getAttribute('data-jump'));
      if (sec) sec.scrollIntoView({ behavior: REDUCED.matches ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    if ((el = e.target.closest('[data-sort]'))) {
      var id = el.getAttribute('data-sort'), s = D.sections.filter(function (x) { return x.id === id; })[0];
      S.dir[id] = S.dir[id] === 'desc' ? 'asc' : 'desc';
      var tbl = document.getElementById(id + '-tbl');
      tbl.innerHTML = tbl.querySelector('caption').outerHTML + cols(s) + head(s) + body(s) + foot(s);
      var b = tbl.querySelector('[data-sort]'); if (b) b.focus();
      return;
    }
    if ((el = e.target.closest('[data-year]'))) { S.year = el.getAttribute('data-year'); renderYears(); render(); return; }
    if (e.target.closest('[data-act="resume"]')) { S.state = 'loading'; render(); return; }
    if (e.target.closest('[data-act="print"]')) { window.print(); return; }
    if (e.target.closest('a[href="#"]')) e.preventDefault();
    if (!e.target.closest('.pop')) closePops(null);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePops(null); });
  $('#years').addEventListener('change', function (e) { if (e.target.name === 'year') { S.year = e.target.value; render(); } });
  $('#more-years').addEventListener('change', function () { this.value = ''; });
  window.addEventListener('hashchange', function () { fromHash(); renderYears(); render(); });

  fromHash(); renderNav(); renderYears(); render();
})();
