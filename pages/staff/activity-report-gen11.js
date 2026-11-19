/* AAN · Staff UI · Activity Report — GENERATION 11
   Built from the system only: the staff list skeleton and nav data (Feeds Incoming, Manage Dealers), the board of
   All Vehicles / Accounting, the backend's own filters, figures and log. Everything here only reads: the range,
   the filters, the staff rows and the sort narrow or order the 13 sampled log rows client-side. */
(function () {
  'use strict';
  var MD = window.MD, D = window.AR;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ic(id, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function nf(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  /* ── dates: the backend read on Nov 18, 2026; its week is Nov 16 – Nov 19 ── */
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var TODAY = '2026-11-18';
  var PRESET = {
    'Today': [TODAY, TODAY],
    'Yesterday': ['2026-11-17', '2026-11-17'],
    'This Week': [D.week.start, D.week.end],
    'This Month': ['2026-11-01', '2026-11-30']
  };
  function iso(us) { var p = us.split('/'); return p[2] + '-' + p[0] + '-' + p[1]; }
  function md(isoS) { var p = isoS.split('-'); return MON[+p[1] - 1] + ' ' + (+p[2]); }
  function rangeLine(a, b) {
    if (!a || !b) return 'no dates set';
    var y = a.slice(0, 4);
    return a === b ? md(a) + ', ' + y : md(a) + ' – ' + md(b) + ', ' + b.slice(0, 4);
  }
  function rangeChip(a, b) {
    if (!a || !b) return 'No dates';
    if (a === b) return md(a);
    return a.slice(0, 7) === b.slice(0, 7) ? md(a) + '–' + (+b.slice(8)) : md(a) + '–' + md(b);
  }
  function mins(t) { var m = /(\d+):(\d+)\s*(am|pm)/i.exec(t); var h = +m[1] % 12 + (m[3].toLowerCase() === 'pm' ? 12 : 0); return h * 60 + +m[2]; }

  /* the log, keyed once */
  var LOG = D.log.map(function (r, i) {
    return { i: i, date: r[0], time: r[1], iso: iso(r[0]), t: iso(r[0]) + ' ' + String(mins(r[1]) + 10000), emp: r[2], tk: r[3], dlr: r[4], subj: r[5],
      act: r[6], glyph: r[7], key: r[8], hrs: r[9], note: r[10] };
  });

  var DEF = { range: 'This Week', start: D.week.start, end: D.week.end, user: '', action: '', dealer: '', q: '' };
  var S = Object.assign({ dir: 'desc', dq: '' }, DEF);
  function isDefault() { return ['range', 'start', 'end', 'user', 'action', 'dealer', 'q'].every(function (k) { return S[k] === DEF[k]; }); }
  /* the sample is This Week's first 13 rows: a range inside the week can be read from it, any other cannot */
  function inSample() { return S.start && S.end && S.start >= D.week.start && S.end <= D.week.end; }
  function isWeek() { return S.start === D.week.start && S.end === D.week.end; }

  /* ── nav: the staff menus, as on every staff page; this page lives under Work ── */
  var NAV_HIDDEN = ['Add New OEM', 'View OEM Accounts', 'Add New Reseller Group', 'View Reseller Groups'];
  var HREF = { 'Feeds Incoming': 'feeds-incoming-gen11.html', 'View Dealers': 'manage-dealers-gen11.html', 'My Work': 'my-work-queue-gen11.html',
    'Create A Ticket': 'create-ticket-gen11.html', 'Activity Report': 'activity-report-gen11.html' };
  function renderNav() {
    $('#nav').innerHTML = MD.nav.map(function (g, i) {
      if (g.g === 'AAN Projects') return '';
      var id = 'p-nav-' + i, on = g.g === 'Work';
      return '<div class="nav__it' + (on ? ' nav__it--on' : '') + '">' +
        '<button class="nav__b" type="button" data-pop="' + id + '" aria-haspopup="true" aria-expanded="false">' + esc(g.g) + ic('i-chev') + '</button>' +
        '<div class="pop" id="' + id + '"><div class="caps pop__lab">' + esc(g.g) + '</div>' +
          g.i.filter(function (l) { return NAV_HIDDEN.indexOf(l) < 0; }).map(function (l) {
            return '<a class="mn__it' + (l.indexOf('--') === 0 ? ' mn__it--sub' : '') + '" href="' + (HREF[l] || '#') + '"' +
              (l === 'Activity Report' ? ' aria-current="page"' : '') + '>' + esc(l) + '</a>';
          }).join('') + '</div></div>';
    }).join('');
  }

  /* ── head: the backend's range line ── */
  function renderHead() {
    $('#head-meta').textContent = S.range === 'This Week' && isWeek()
      ? D.week.label + ' · ' + D.week.line + ' · ' + nf(D.found) + ' found (' + nf(D.shown) + ' shown)'
      : (S.range === 'Custom…' ? 'Custom' : S.range) + ' · ' + rangeLine(S.start, S.end) + ' · count not read for this demo';
  }

  /* ── board ── */
  function renderBoard() {
    $('#sum-m').textContent = D.week.label + ' · ' + D.week.line.replace(', 2026', '') + (isWeek() ? '' : ' — the range read for this demo');
    $('#tiles').innerHTML = D.tiles.map(function (t) {
      var q = t[3] ? '<i class="f__q" tabindex="0" title="The backend\'s note on this figure was not read for this demo." aria-label="The backend\'s note on this figure was not read for this demo.">?</i>' : '';
      return '<div class="tile"><span class="caps tile__k">' + esc(t[0]) + '</span><span class="tile__v">' + esc(t[1]) + '</span>' +
        '<span class="tile__s"><span title="' + esc(t[2]) + '">' + esc(t[2]) + '</span>' + q + '</span></div>';
    }).join('');
    $('#staff').innerHTML = D.staff.map(function (p) {
      var on = S.user === p[0];
      return '<button class="acr-st' + (on ? ' acr-st--on' : '') + '" type="button" data-staff="' + esc(p[0]) + '" aria-pressed="' + on + '"' +
        ' title="' + (on ? 'Show every employee' : 'Filter the log to ' + esc(p[0])) + '"' +
        ' aria-label="' + esc(p[0]) + ': ' + p[1] + ' rows, ' + p[2].toFixed(1) + '%, ' + p[3] + ' tickets, ' + p[4] + ' notes, hours ' + (p[5] || 'none') + '. ' + (on ? 'Filtered; click to show everyone' : 'Filter the log') + '">' +
        '<span class="acr-st__n">' + esc(p[0]) + '</span>' +
        '<span class="acr-st__r">' + p[1] + '</span>' +
        '<span class="ar__m"><i style="--w:' + p[2] + '%"></i></span>' +
        '<span class="acr-st__p">' + p[2].toFixed(1) + '%</span>' +
        '<span>' + p[3] + '</span><span>' + p[4] + '</span>' +
        '<span>' + (p[5] ? esc(p[5]) : '—') + '</span>' +
        '<span class="acr-st__go">' + ic('i-arrow', 'i-off') + ic('i-check', 'i-on') + '</span></button>';
    }).join('');
  }

  /* ── range tabs and dates ── */
  function renderRanges() {
    $('#ranges').innerHTML = D.ranges.map(function (r) {
      var on = r === S.range;
      return '<button class="lane ui-view' + (on ? ' lane--on ui-view--on' : '') + '" type="button" data-range="' + esc(r) + '" aria-pressed="' + on + '"' +
        (r === 'This Week' ? '' : r === 'Custom…' ? ' title="Set the Start and End dates"' : r === 'This Month' ? ' title="Read live by the backend; this demo carries This Week"' : ' title="Read from the This Week sample of this demo"') + '>' + esc(r) + '</button>';
    }).join('');
    $('#d-start').value = S.start; $('#d-end').value = S.end;
  }

  /* ── facets ── */
  function item(key, val, label, cur) {
    var on = cur === val;
    return '<button class="mn__it' + (on ? ' mn__it--on' : '') + '" type="button" data-' + key + '="' + esc(val) + '"' + (on ? ' aria-current="true"' : '') + '>' +
      ic('i-check') + '<span>' + esc(label) + '</span></button>';
  }
  function renderFacets() {
    $('#act-list').innerHTML = item('action', '', 'All', S.action) + D.actions.map(function (a) { return item('action', a, a, S.action); }).join('');
    $('#act-foot').innerHTML = '<b>' + D.actions.length + '</b> of the backend\'s <b>' + D.actionsTotal + '</b> actions in this demo';
    $('#act-v').textContent = S.action || 'All';
    var users = D.staff.map(function (p) { return p[0]; }).sort(function (a, b) { return a.localeCompare(b); });
    $('#user-list').innerHTML = item('user', '', 'All', S.user) + item('user', 'Not assigned', 'Not assigned', S.user) + users.map(function (u) { return item('user', u, u, S.user); }).join('');
    $('#user-foot').innerHTML = 'The 12 active this week; the backend lists <b>' + D.usersTotal + '</b>';
    $('#user-v').textContent = S.user || 'All';
    var q = S.dq.toLowerCase();
    var list = D.dealers.filter(function (d) { return !q || d.toLowerCase().indexOf(q) >= 0; });
    $('#dlr-list').innerHTML = (q ? '' : item('dealer', '', 'All dealers', S.dealer)) +
      (list.length ? list.map(function (d) { return item('dealer', d, d, S.dealer); }).join('') : '<div class="pop__empty">No dealer in this demo\'s list matches.</div>');
    $('#dlr-foot').innerHTML = '<b>' + list.length + '</b> of <b>' + D.dealers.length + '</b> dealers in this demo match · the backend lists <b>' + nf(D.dealersTotal) + '</b>';
    $('#dlr-v').textContent = S.dealer || 'All dealers';
    [['p-act', S.action], ['p-user', S.user], ['p-dlr', S.dealer]].forEach(function (f) {
      $('[data-pop="' + f[0] + '"]').classList.toggle('facet__b--on', !!f[1]);
    });
  }

  /* ── the log ── */
  function visible() {
    if (!inSample()) return [];
    var q = S.q.replace(/\D/g, '');
    var rows = LOG.filter(function (r) {
      if (r.iso < S.start || r.iso > S.end) return false;
      if (S.user && r.emp !== S.user) return false;
      if (S.action && r.key !== S.action) return false;
      if (S.dealer && r.dlr !== S.dealer) return false;
      if (q && r.tk.indexOf(q) < 0) return false;
      return true;
    });
    /* oldest-first order of two rows; rows in the same minute keep the backend's order (index) */
    rows.sort(function (a, b) { var v = a.t < b.t ? -1 : a.t > b.t ? 1 : b.i - a.i; return S.dir === 'desc' ? -v : v; });
    return rows;
  }
  var GLYPH = { todo: 'i-todo', check: 'i-check', clock: 'i-clock', edit: 'i-edit', plus: 'i-plus', mail: 'i-mail' };
  function note(s) {
    if (!s) return '<span class="dash">—</span>';
    return '<span class="acr-2l" title="' + esc(s) + '">' + esc(s).replace(/\u{1F4CE}\s?/gu, ic('i-clip') + '<span class="vh">Attached file </span>') + '</span>';
  }
  function hours(h) {
    if (!h) return '<span class="dash">—</span>';
    return '<span><b>' + esc(h[0]) + '</b>' + (h[2] ? '<span class="d">' + esc(h[2]) + '</span>' : '') + '</span>' +
      (h[1] ? '<small title="' + esc(h[1]) + '">' + esc(h[1]) + '</small>' : '');
  }
  function rowHTML(r) {
    return '<div class="row" role="row">' +
      '<span class="c-when"><span>' + esc(r.date) + '</span><small>' + esc(r.time) + '</small></span>' +
      '<span class="c-emp" title="' + esc(r.emp) + '">' + esc(r.emp) + '</span>' +
      '<span class="c-tk"><a class="tkt" href="single-ticket-gen11.html" title="Ticket ' + esc(r.tk) + ' — opens the Gen 11 sample ticket">' + esc(r.tk) + '</a></span>' +
      '<span class="c-dlr"><span class="acr-2l" title="' + esc(r.dlr) + '">' + esc(r.dlr) + '</span></span>' +
      '<span class="c-subj"><span class="acr-2l" title="' + esc(r.subj) + '">' + esc(r.subj) + '</span></span>' +
      '<span class="c-type">' + (GLYPH[r.glyph] ? ic(GLYPH[r.glyph]) : '<span class="acr-g" aria-hidden="true"></span>') + '<span class="acr-2l" title="' + esc(r.act) + '">' + esc(r.act) + '</span></span>' +
      '<span class="c-hrs">' + hours(r.hrs) + '</span>' +
      '<span class="c-note">' + note(r.note) + '</span>' +
    '</div>';
  }
  function chips() {
    var c = [{ k: 'dates', v: rangeChip(S.start, S.end) }];
    if (S.user) c.push({ k: 'user', v: S.user, l: 'User' });
    if (S.action) c.push({ k: 'action', v: S.action, l: 'Action' });
    if (S.dealer) c.push({ k: 'dealer', v: S.dealer, l: 'Dealer' });
    if (S.q) c.push({ k: 'q', v: S.q, l: 'Ticket #' });
    $('#chips').innerHTML = c.map(function (x) {
      return '<span class="fchip">' + (x.l ? '<span class="fchip__k">' + esc(x.l) + '</span> ' : '') + esc(x.v) +
        '<button class="fchip__x" type="button" data-chip="' + x.k + '" aria-label="Remove ' + esc(x.l ? x.l + ' ' : 'dates ') + esc(x.v) + '"' +
        (x.k === 'dates' ? ' title="Back to This Week"' : '') + '>' + ic('i-x') + '</button></span>';
    }).join('') + '<button class="scope__clear" type="button" data-act="reset"' + (isDefault() ? ' disabled' : '') + '>Reset all</button>';
  }
  function render() {
    var rows = visible();
    $('#tb').innerHTML = rows.map(rowHTML).join('');
    var emp = $('#empty'); emp.hidden = rows.length > 0;
    if (!rows.length) {
      if (!inSample()) {
        emp.innerHTML = '<b>This demo carries This Week only</b><p>The backend reads ' + esc(S.range === 'Custom…' ? 'any range' : S.range) + ' (' + esc(rangeLine(S.start, S.end)) +
          ') live; those rows were not read for this test page.</p><button class="btn btn--sheet btn--sm" type="button" data-act="week">Back to This Week</button>';
      } else {
        var p = S.user && D.staff.filter(function (x) { return x[0] === S.user; })[0], last = LOG[0];
        if (S.start > last.iso && !S.user && !S.action && !S.dealer && !S.q) {
          /* the sample is the newest 13 rows: nothing newer than its first row existed when the backend was read */
          emp.innerHTML = '<b>Nothing logged in this range yet</b><p>The newest row when the backend was read (' + esc(D.read) + ') is ' +
            esc(last.date) + ', ' + esc(last.time) + '.</p><button class="btn btn--sheet btn--sm" type="button" data-act="week">Back to This Week</button>';
        } else
        emp.innerHTML = '<b>No row in this 13-row sample matches</b><p>' +
          (p ? esc(p[0]) + ' has ' + p[1] + ' rows this week in the backend. ' : '') +
          'The sample holds the newest 13 of the ' + D.logRows + ' log rows; the backend filters all of them.</p>' +
          '<button class="btn btn--sheet btn--sm" type="button" data-act="reset">Reset all</button>';
      }
    }
    var filtered = !isDefault();
    $('#scope').innerHTML = !inSample() ? 'Not read for this demo'
      : !filtered ? '<b>' + rows.length + '</b> of <b>' + D.logRows + '</b> log rows shown in this demo'
      : '<b>' + rows.length + '</b> of the <b>' + LOG.length + '</b> sample rows match';
    $('#foot-n').innerHTML = 'Showing <b>' + rows.length + '</b> of <b>' + LOG.length + '</b> sample rows · <b>' + D.logRows + '</b> in the backend\'s log';
    var s = $('.hd [data-sort="when"]');
    s.classList.toggle('s--asc', S.dir === 'asc');
    s.parentNode.setAttribute('aria-sort', S.dir === 'asc' ? 'ascending' : 'descending');
    chips(); renderHead(); renderBoard(); renderFacets();
  }

  /* ── state changes ── */
  function setRange(r) {
    S.range = r;
    if (PRESET[r]) { S.start = PRESET[r][0]; S.end = PRESET[r][1]; }
    renderRanges(); render();
    if (r === 'Custom…') $('#d-start').focus();
  }
  function resetAll() { Object.assign(S, DEF); $('#q').value = ''; renderRanges(); render(); }

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
      closePops(open ? p : null); p.classList.toggle('pop--open', open); t.setAttribute('aria-expanded', String(open));
      if (open && p.id === 'p-dlr') $('#dlr-q').focus();
      return;
    }
    var el;
    if ((el = e.target.closest('[data-staff]'))) { var n = el.getAttribute('data-staff'); S.user = S.user === n ? '' : n; render(); return; }
    if ((el = e.target.closest('[data-user]'))) { S.user = el.getAttribute('data-user'); closePops(null); render(); return; }
    if ((el = e.target.closest('[data-action]'))) { S.action = el.getAttribute('data-action'); closePops(null); render(); return; }
    if ((el = e.target.closest('[data-dealer]'))) { S.dealer = el.getAttribute('data-dealer'); closePops(null); render(); return; }
    if ((el = e.target.closest('[data-range]'))) { setRange(el.getAttribute('data-range')); return; }
    if ((el = e.target.closest('[data-chip]'))) {
      var k = el.getAttribute('data-chip');
      if (k === 'dates') { setRange('This Week'); return; }
      S[k] = ''; if (k === 'q') $('#q').value = '';
      render(); return;
    }
    if (e.target.closest('[data-act="reset"]')) { resetAll(); return; }
    if (e.target.closest('[data-act="week"]')) { setRange('This Week'); return; }
    if ((el = e.target.closest('[data-act="summary"]'))) {
      var show = el.getAttribute('aria-expanded') !== 'true';
      el.setAttribute('aria-expanded', String(show)); el.title = show ? 'Hide the summary' : 'Show the summary';
      $('#board').hidden = !show; return;
    }
    if ((el = e.target.closest('.hd [data-sort]'))) { S.dir = S.dir === 'desc' ? 'asc' : 'desc'; render(); return; }
    if (e.target.closest('a[href="#"]')) e.preventDefault();
    if (!e.target.closest('.pop')) closePops(null);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePops(null); });
  $('#q').addEventListener('input', function () { S.q = this.value.trim(); render(); });
  $('#dlr-q').addEventListener('input', function () { S.dq = this.value.trim(); renderFacets(); });
  ['d-start', 'd-end'].forEach(function (id) {
    $('#' + id).addEventListener('change', function () {
      S[id === 'd-start' ? 'start' : 'end'] = this.value;
      var hit = Object.keys(PRESET).filter(function (k) { return PRESET[k][0] === S.start && PRESET[k][1] === S.end; })[0];
      S.range = hit || 'Custom…';
      renderRanges(); render();
    });
  });

  /* ── the engaged sticky stack (§7): one scroll handler publishes the state; CSS publishes the geometry ── */
  var app = $('#app'), cmd = $('#cmd'), hd = $('#hd');
  function px(v) { return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(v)) || 0; }
  function stuck() {
    var bar = px('--stick-bar'), y = window.scrollY > 0;
    app.classList.toggle('is-stuck', y);
    var c = y && cmd.getBoundingClientRect().top <= bar + .5;
    cmd.classList.toggle('cmd--stuck', c);
    hd.classList.toggle('hd--stuck', c && hd.getBoundingClientRect().top <= bar + cmd.offsetHeight + .5);
  }
  window.addEventListener('scroll', stuck, { passive: true });

  renderNav(); renderRanges(); render(); stuck();
})();
