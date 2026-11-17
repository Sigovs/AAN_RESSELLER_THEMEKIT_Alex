/* AAN · Staff UI · Feeds Incoming — GENERATION 11
   Built from the system only: Manage Dealers' list skeleton and nav data, the
   shared components, the backend's own columns, filters and actions. */
(function () {
  'use strict';
  var MD = window.MD, D = window.FI;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ic(id) { return '<svg class="i" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function nf(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  /* the backend's filters: feed status (lanes), account status, tag, and the company/feed search */
  var S = { status: 'All Statuses', acct: '', tag: '', q: '', sort: 'name', dir: 'asc' };
  var TONE = { A: 'ok', P: 'info', T: 'quiet' };   /* the same tones Manage Dealers gives the account mark */

  /* ── nav: the staff menus, as on every staff page; this page lives under Feed Management ── */
  var NAV_HIDDEN = ['Add New OEM', 'View OEM Accounts', 'Add New Reseller Group', 'View Reseller Groups'];
  function renderNav() {
    $('#nav').innerHTML = MD.nav.map(function (g, i) {
      if (g.g === 'AAN Projects') return '';
      var id = 'p-nav-' + i, on = g.g === 'Feed Management';
      return '<div class="nav__it' + (on ? ' nav__it--on' : '') + '">' +
        '<button class="nav__b" type="button" data-pop="' + id + '" aria-haspopup="true" aria-expanded="false">' + esc(g.g) + ic('i-chev') + '</button>' +
        '<div class="pop" id="' + id + '"><div class="caps pop__lab">' + esc(g.g) + '</div>' +
          g.i.filter(function (l) { return NAV_HIDDEN.indexOf(l) < 0; }).map(function (l) {
            var href = l === 'Feeds Incoming' ? 'feeds-incoming-gen11.html' : l === 'View Dealers' ? 'manage-dealers-gen11.html' : l === 'My Work' ? 'my-work-queue-gen11.html' : '#';
            return '<a class="mn__it' + (l.indexOf('--') === 0 ? ' mn__it--sub' : '') + '" href="' + href + '"' + (l === 'Feeds Incoming' ? ' aria-current="page"' : '') + '>' + esc(l) + '</a>';
          }).join('') + '</div></div>';
    }).join('');
  }

  /* ── counts: read-only, as Manage Dealers' roster strip ── */
  function renderTally() {
    var c = D.counts;
    var items = [['Dealers', c.dealers], ['Active', c.A], ['Pending', c.P], ['Client Intake', c.T], ['Feeds', c.feeds], ['With feeds', c.withFeeds], ['No feeds', c.noFeeds], ['Switched off', c.off]];
    $('#tally').innerHTML = '<span class="caps tally__l">Feeds</span>' + items.map(function (x) {
      return '<span class="tl"><span>' + esc(x[0]) + '</span><b>' + nf(x[1]) + '</b></span>';
    }).join('');
  }

  /* ── feed-status lanes: the backend's status select. Only "All" has a sample here; the others are
       computed by the backend and are marked, as Manage Dealers marks its modes without a sample ── */
  function renderModes() {
    $('#modes').innerHTML = D.statuses.map(function (s, i) {
      var on = s === S.status, nod = i > 0;
      return '<button class="lane ui-view' + (on ? ' lane--on ui-view--on' : '') + (nod ? ' lane--nodata' : '') + '" type="button" data-status="' + esc(s) +
        '" aria-pressed="' + on + '"' + (nod ? ' title="Filtered by the backend; no sample in this mockup"' : '') + '><span>' + esc(i === 0 ? 'All' : s) + '</span>' +
        (i === 0 ? '<b>' + nf(D.counts.dealers) + '</b>' : '') + '</button>';
    }).join('');
  }

  function menu(list, cur, key, allLabel) {
    return '<button class="mn__it" type="button" data-' + key + '="">' + (cur ? '' : ic('i-check')) + esc(allLabel) + '</button>' +
      list.map(function (x) {
        var v = x[0], l = x[1];
        return '<button class="mn__it" type="button" data-' + key + '="' + esc(v) + '">' + (cur === v ? ic('i-check') : '') + esc(l) + '</button>';
      }).join('');
  }
  function renderFacets() {
    $('#acct-list').innerHTML = menu([['A', 'A · Active'], ['P', 'P · Pending'], ['T', 'T · Client Intake']], S.acct, 'acct', 'All accounts');
    $('#acct-v').textContent = S.acct ? S.acct + ' · ' + D.marks[S.acct] : 'All';
    $('#tag-list').innerHTML = menu(D.tags.map(function (t) { return [t, t]; }), S.tag, 'tag', 'All Tags');
    $('#tag-v').textContent = S.tag || 'All Tags';
    $('#legend').innerHTML = Object.keys(D.images).map(function (k) {
      return '<span title="From the feed file: ' + esc(D.images[k]) + '"><span class="ft fi-img">' + k + '</span> ' + esc(D.images[k]) + '</span>';
    }).join('');
  }

  /* ── rows ── */
  function ts(s) { var d = new Date(s); return isNaN(d) ? 0 : d.getTime(); }
  function latest(r) { return Math.max.apply(null, r[3].map(function (f) { return ts(f[1]); })); }
  function visible() {
    var q = S.q.toLowerCase();
    var rows = D.rows.filter(function (r) {
      if (S.acct && r[0] !== S.acct) return false;
      if (S.tag && !r[3].some(function (f) { return f[2] === S.tag; })) return false;
      if (q && r[2].toLowerCase().indexOf(q) < 0 && !r[3].some(function (f) { return f[0].toLowerCase().indexOf(q) >= 0; })) return false;
      return true;
    });
    rows.sort(function (a, b) {
      var v = S.sort === 'time' ? latest(a) - latest(b) : a[2].localeCompare(b[2], 'en', { sensitivity: 'base' });
      return S.dir === 'asc' ? v : -v;
    });
    return rows;
  }
  function timeCell(s) {
    var m = /^(.+?),\s*(.+)$/.exec(s);
    return m ? '<b>' + esc(m[1]) + '</b><i>' + esc(m[2]) + '</i>' : '<b>' + esc(s) + '</b>';
  }
  function rowHTML(r) {
    var n = r[3].length;
    var h = '<div class="row" data-id="' + r[1] + '" style="--n:' + n + '">' +
      '<span class="c-mark" title="' + esc(D.marks[r[0]]) + '"><span class="mk mk--' + TONE[r[0]] + '">' + r[0] + '</span></span>' +
      '<span class="c-name"><a href="dealer-edit-gen11.html?dealer=' + r[1] + '" title="' + esc(r[2]) + '">' + esc(r[2]) +
        '<span class="fi-n">#' + r[1] + (n > 1 ? ' · ' + n + ' feeds' : '') + '</span></a></span>';
    r[3].forEach(function (f, i) {
      var cls = 'fl' + (i ? ' fl--next' : '') + (f[5] ? '' : ' fl--off');
      var who = esc(r[2]);
      h += '<span class="c-feed ' + cls + '"><a class="fi-feed" href="#" title="Edit this feed for ' + who + ': ' + esc(f[0]) + '">' + esc(f[0]) + '</a></span>' +
        '<span class="c-time ' + cls + '">' + timeCell(f[1]) + '</span>' +
        '<span class="c-tag ' + cls + '">' + (f[2]
          ? '<button class="fi-tag" type="button" data-tag="' + esc(f[2]) + '" title="Tag (not a group): list the dealers whose incoming feeds carry &quot;' + esc(f[2]) + '&quot;">' + esc(f[2]) + '</button>'
          : '<span class="dash">—</span>') + '</span>' +
        '<span class="c-img ' + cls + '">' + (f[3]
          ? '<span class="ft fi-img" title="Images: from the feed file, ' + esc(D.images[f[3]]) + '">' + esc(f[3]) + '</span>' : '<span class="dash">—</span>') + '</span>' +
        '<span class="c-runs ' + cls + '" title="Runs in the last 24 hours">' + f[4] + '</span>' +
        '<span class="c-on ' + cls + '"><label class="ui-switch" title="ON / OFF"><input type="checkbox" role="switch"' + (f[5] ? ' checked' : '') +
          ' aria-label="' + esc(f[0]) + ' ON / OFF"><span class="ui-switch__t"></span></label></span>' +
        '<span class="c-act ' + cls + '">' +
          '<a class="ra" href="#" title="Edit Feed" aria-label="Edit Feed">' + ic('i-edit') + '</a>' +
          '<a class="ra" href="#" title="Log" aria-label="Log">' + ic('i-note') + '</a>' +
          '<a class="ra" href="#" title="Rerun" aria-label="Rerun">' + ic('i-refresh') + '</a>' +
        '</span>';
    });
    h += '<span class="c-new"><a class="ra" href="#" title="New Feed for ' + esc(r[2]) + '" aria-label="New Feed for ' + esc(r[2]) + '">' + ic('i-plus') + '</a></span></div>';
    return h;
  }
  function render() {
    var rows = visible(), feeds = rows.reduce(function (a, r) { return a + r[3].length; }, 0);
    $('#tb').innerHTML = rows.map(rowHTML).join('');
    var emp = $('#empty');
    emp.hidden = rows.length > 0;
    if (!rows.length) emp.innerHTML = '<b>No dealer in this sample matches</b><p>Clear the search or a filter. The full roster (364 dealers) is filtered by the backend.</p>';
    var f = [];
    if (S.acct) f.push(S.acct + ' · ' + D.marks[S.acct]);
    if (S.tag) f.push('tag ' + S.tag);
    if (S.q) f.push('"' + S.q + '"');
    $('#scope').innerHTML = 'Showing <b>' + rows.length + '</b> dealers · <b>' + feeds + '</b> feeds' + (f.length ? ' · ' + esc(f.join(' · ')) : '') +
      ' <span class="muted">· demo sample: 24 of the ' + D.counts.withFeeds + ' dealers with feeds</span>';
    $('#foot-n').textContent = rows.length + ' dealers';
    $$('.hd .s').forEach(function (b) {
      var on = b.getAttribute('data-sort') === S.sort;
      b.classList.toggle('s--on', on); b.classList.toggle('s--asc', on && S.dir === 'asc');
      b.parentNode.setAttribute('aria-sort', on ? (S.dir === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }

  /* ── popovers: Manage Dealers' behaviour ── */
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
    if ((el = e.target.closest('[data-acct]'))) { S.acct = el.getAttribute('data-acct'); closePops(null); renderFacets(); render(); return; }
    if ((el = e.target.closest('[data-tag]'))) { S.tag = S.tag === el.getAttribute('data-tag') && el.classList.contains('fi-tag') ? '' : el.getAttribute('data-tag'); closePops(null); renderFacets(); render(); return; }
    if ((el = e.target.closest('[data-status]'))) { if (!el.classList.contains('lane--nodata')) { S.status = el.getAttribute('data-status'); renderModes(); render(); } return; }
    if ((el = e.target.closest('.hd [data-sort]'))) { var k = el.getAttribute('data-sort'); S.dir = S.sort === k && S.dir === 'asc' ? 'desc' : 'asc'; S.sort = k; render(); return; }
    if (e.target.closest('[data-act="mainlog"]')) { $('#log-date').textContent = D.mainLog.date; $('#log-text').textContent = D.mainLog.text; $('#mainlog').showModal(); return; }
    if (e.target.closest('a[href="#"]')) e.preventDefault();
    if (!e.target.closest('.pop')) closePops(null);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePops(null); });
  $('#q').addEventListener('input', function () { S.q = this.value.trim(); render(); });

  renderNav(); renderTally(); renderModes(); renderFacets(); render();
})();
