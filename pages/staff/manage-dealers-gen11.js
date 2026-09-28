/* ============================================================================
   AAN · Staff UI · Manage Dealers — GENERATION 11

   JS sets state; CSS owns layout and position (DESIGN.md §17). The sticky
   geometry is published by CSS and read here, never retyped.

   Behaviour is the export's and nothing more: six saved filters, a company-name
   query, a phone query, a reseller filter, a reseller-group filter, six
   sortable columns, the A–Z jump, per-row feature recompute, and the Dealer
   Package dialog. No bulk actions, no keyboard shortcuts, no analytics.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.MD;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function ic(id) { return '<svg class="i" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function nf(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var BY_ID = {};
  D.rows.forEach(function (r) { BY_ID[r.id] = r; });

  /* ── state ──────────────────────────────────────────────────────────────
     Exactly the five query parameters the production component carries:
     mode, q, phone, rid, rgid — plus the sort pair the column headers set. */
  var S = {
    mode: 'active',
    q: '',
    phone: '',
    rid: '',
    rgid: '',
    sort: 'name',   /* the roster arrives in company-name order */
    dir: 'asc'
  };

  /* the badge tone production ships per account-status letter */
  /* production's own badge tone per account-status letter:
   A = feed_ok, T (Client Intake) = priority_low, P (Pending) = priority_normal */
  var MARK_TONE = { feed_ok: 'ok', priority_high: 'high', priority_low: 'quiet', priority_normal: 'info' };

  /* ── the row set for a mode ─────────────────────────────────────────────
     Two of the six modes have an exported row sample. Two more are exact
     subsets of the active roster and are derived from its own status column.
     The remaining two have neither, and the list says so. */
  function modeRows(k) {
    if (k === 'active')    return D.orderActive.map(function (id) { return BY_ID[id]; });
    if (k === 'marketing') return D.orderMarketing.map(function (id) { return BY_ID[id]; });
    if (k === 'pending')   return D.orderActive.map(function (id) { return BY_ID[id]; })
                                  .filter(function (r) { return r.status === 'Pending'; });
    return null;   /* all · new_orders · inactive — no exported sample */
  }

  /* the default order each mode arrives in, as exported */
  var MODE_SORT = { marketing: { sort: 'modified', dir: 'desc' } };

  function tsKey(s) {
    /* MM-DD-YYYY HH:MM:SS → sortable. An empty Last Modified sorts last. */
    if (!s) return '';
    var m = /^(\d{2})-(\d{2})-(\d{4}) (.+)$/.exec(s);
    return m ? m[3] + m[1] + m[2] + ' ' + m[4] : s;
  }

  var KEY = {
    name:     function (r) { return r.name.toLowerCase(); },
    state:    function (r) { return r.state; },
    reseller: function (r) { return r.reseller.toLowerCase(); },
    status:   function (r) { return r.status; },
    created:  function (r) { return tsKey(r.created); },
    modified: function (r) { return tsKey(r.modified); }
  };

  function visible() {
    var rows = modeRows(S.mode);
    if (!rows) return null;
    var q = S.q.trim().toLowerCase();
    var ph = S.phone.replace(/\D/g, '');
    rows = rows.filter(function (r) {
      if (q && r.name.toLowerCase().indexOf(q) < 0) return false;
      if (S.rid && r.reseller !== S.rid) return false;
      /* Two of production's five filters cannot be answered from this export
         and are held rather than faked. The phone search matches a contact
         column the list does not render, across all dealers including disabled
         ones. The reseller GROUP is stored on the reseller, and the roster
         renders the reseller name only — there is no dealer→group mapping in
         the captured rows. Both return nothing and the list says why. */
      if (ph) return false;
      if (S.rgid) return false;
      return true;
    });
    if (S.sort) {
      var k = KEY[S.sort];
      rows = rows.slice().sort(function (a, b) {
        var x = k(a), y = k(b);
        if (x === y) return KEY.name(a) < KEY.name(b) ? -1 : 1;
        /* an empty value always sorts to the end, in either direction */
        if (x === '') return 1;
        if (y === '') return -1;
        return (x < y ? -1 : 1) * (S.dir === 'asc' ? 1 : -1);
      });
    }
    return rows;
  }

  /* ══ RENDER ═══════════════════════════════════════════════════════════════ */

  function renderNav() {
    $('#nav').innerHTML = D.nav.map(function (g, i) {
      var id = 'p-nav-' + i;
      return '<div class="nav__it' + (g.on ? ' nav__it--on' : '') + '">' +
        '<button class="nav__b" type="button" data-pop="' + id + '" aria-haspopup="true" aria-expanded="false">' +
          esc(g.g) + ic('i-chev') + '</button>' +
        '<div class="pop" id="' + id + '"><div class="caps pop__lab">' + esc(g.g) + '</div>' +
          g.i.map(function (l) {
            var href = '#';
            if (l === 'Add New Dealer') href = 'dealer-edit-gen11.html?dealer=new';
            else if (l === 'View Dealers' || l === 'View Pending Dealers') href = 'manage-dealers-gen11.html';
            else if (l === 'My Work') href = 'my-work-queue-gen11.html';
            return '<a class="mn__it" href="' + href + '">' + esc(l) + '</a>';
          }).join('') +
        '</div></div>';
    }).join('');
  }

  function renderTally() {
    $('#tally').innerHTML = '<span class="caps tally__l">Roster</span>' +
      D.counts.map(function (c) {
        return '<span class="tl"><span>' + esc(c.l) + '</span><b>' + nf(c.n) + '</b></span>';
      }).join('');
  }

  function renderModes() {
    $('#modes').innerHTML = D.modes.map(function (m) {
      var on = m.k === S.mode;
      var nod = modeRows(m.k) === null;
      return '<button class="lane' + (on ? ' lane--on' : '') + (nod ? ' lane--nodata' : '') +
        '" type="button" data-mode="' + m.k + '" aria-pressed="' + (on ? 'true' : 'false') +
        (nod ? '" title="No row sample for this saved filter in the 2026-09-09 export' : '') + '">' +
        '<span>' + esc(m.l) + '</span>' + (m.n == null ? '' : '<b>' + nf(m.n) + '</b>') + '</button>';
    }).join('');
  }

  function renderResellerMenu() {
    var f = ($('#rid-f').value || '').toLowerCase();
    $('#rid-list').innerHTML = D.resellers.filter(function (o) {
      return !f || o.l.toLowerCase().indexOf(f) >= 0;
    }).map(function (o) {
      var val = o.v === '' ? '' : o.l;
      var on = val === S.rid;
      return '<button class="mn__it' + (on ? ' mn__it--on' : '') + '" type="button" data-rid="' + esc(val) + '">' +
        ic('i-check') + '<span class="sp">' + esc(o.l) + '</span></button>';
    }).join('') || '<div class="mn__who">No reseller matches that.</div>';
  }

  function renderGroupMenu() {
    $('#rgid-list').innerHTML = D.rgroups.map(function (o) {
      var val = o.v;
      var on = val === S.rgid;
      return '<button class="mn__it' + (on ? ' mn__it--on' : '') + '" type="button" data-rgid="' + esc(val) + '">' +
        ic('i-check') + '<span class="sp">' + esc(o.l) + '</span></button>';
    }).join('');
  }

  function renderPkgSelect() {
    /* "Active + Pending dealers only (legacy dropdown predicate)" */
    var sel = $('#pkg-d');
    sel.innerHTML = D.rows.filter(function (r) {
      return r.status === 'Active' || r.status === 'Pending';
    }).sort(function (a, b) { return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1; })
      .map(function (r) { return '<option value="' + r.id + '">' + esc(r.name) + '</option>'; }).join('');
  }

  /* ── cells ────────────────────────────────────────────────────────────── */

  function cellDate(v) {
    if (!v) return '<span class="dash">—</span>';
    var p = v.split(' ');
    return '<b>' + esc(p[0]) + '</b><i>' + esc(p[1] || '') + '</i>';
  }

  function cellFeat(r) {
    var all = r.feat.map(function (f) { return f.t; });
    var out = [];
    if (r.warn) {
      out.push('<span class="fw' + (r.warn === 'connection_failed' ? ' fw--fail' : '') +
        '" title="' + esc(r.warn === 'connection_failed' ? 'Connection failed' : 'No connection row') + '">' +
        ic('i-alert') + '</span>');
    }
    r.feat.slice(0, 2).forEach(function (f) {
      out.push('<span class="ft" title="' + esc(f.title) + '">' + esc(f.t) + '</span>');
    });
    if (r.feat.length > 2) {
      out.push('<span class="ft ft--more">+' + (r.feat.length - 2) + '</span>');
    }
    out.push('<button class="frf" type="button" data-refresh="' + r.id +
      '" title="Recompute this dealer&rsquo;s features now" aria-label="Recompute features">' + ic('i-refresh') + '</button>');
    var t = (all.length ? all.join(' · ') : 'no features') +
            (r.asOf ? ' — computed ' + r.asOf : '');
    return '<span class="vh">' + esc(t) + '</span>' + out.join('');
  }

  function cellVer(v) {
    if (!v) return '<span class="dash">—</span>';
    var p = v.split('/').map(function (x) { return x.trim(); }).filter(Boolean);
    var year = /^\d{4}$|^WP$|^OLD$/.test(p[0]) ? p[0] : '';
    var tag = p.filter(function (x) { return x !== year; })[0] || '';
    return (year ? '<b>' + esc(year) + '</b>' : '') +
           (tag ? '<span class="vt">' + esc(tag) + '</span>' : '');
  }

  var ST_CLASS = { 'Inactive': 'c-st--inactive' };

  function rowHTML(r, letterBreak) {
    var tone = MARK_TONE[r.stTone] || 'quiet';
    var pkg = '';
    if (r.pkg && r.pkg.k === 'badge') {
      pkg = '<span class="bdg bdg--high" title="' + esc(r.pkg.title) + '">' + esc(r.pkg.t) + '</span>';
    } else if (r.pkg && r.pkg.k === 'link') {
      pkg = '<button class="pkgl" type="button" data-pkg="' + r.pkg.pid + '" title="' +
        esc(r.pkg.t + ' — open the Dealer Package') + '">' + esc(r.pkg.t) + '</button>';
    }
    var sup = '';
    if (r.sup && r.sup.all) {
      sup = '<a href="my-work-queue-gen11.html" title="All support work for this dealer">View All</a>';
    } else if (r.sup) {
      sup = '<a href="' + esc(D.base + '/work/tickets/' + r.sup.id) + '" title="Ticket ' + r.sup.id + '">View</a>';
    }

    return '<div class="row' + (letterBreak ? ' row--letter' : '') + '" data-id="' + r.id + '"' +
      (letterBreak ? ' id="jump-' + letterBreak + '"' : '') + '>' +

      '<span class="c-mark" title="' + esc(r.stTitle) + '">' +
        '<span class="mk mk--' + tone + '">' + esc(r.stMark) + '</span>' +
        (r.locked ? '<span class="lk" title="Locked — rejects edits from non-admins">' + ic('i-lock') + '</span>' : '') +
      '</span>' +

      '<span class="c-name c1"><a href="dealer-edit-gen11.html?dealer=' + r.id + '" title="' + esc(r.name) + '">' +
        esc(r.name) + '<span class="id">#' + r.id + '</span></a></span>' +

      '<span class="c-state c1">' + (r.state
        ? '<a href="https://www.google.com/maps/place/' + esc(encodeURIComponent(r.addr || r.state)) +
          '" target="_blank" rel="noopener" title="' + esc(r.addr || r.state) + '">' + esc(r.state) + '</a>'
        : '<span class="dash">—</span>') + '</span>' +

      '<span class="c-res c1" title="' + esc(r.reseller) + '">' + esc(r.reseller) + '</span>' +

      '<span class="c-st c1 ' + (ST_CLASS[r.status] || '') + '">' + esc(r.status) + '</span>' +

      '<span class="c-cre">' + cellDate(r.created) + '</span>' +
      '<span class="c-mod">' + cellDate(r.modified) + '</span>' +
      '<span class="c-pkg">' + pkg + '</span>' +
      '<span class="c-feat">' + cellFeat(r) + '</span>' +
      '<span class="c-sup c1">' + sup + '</span>' +
      '<span class="c-note">' + (r.notes
        ? '<span class="nt" title="This dealer has notes on file">Notes</span>' : '') + '</span>' +

      '<span class="c-act">' +
        '<a class="ra" href="dealer-edit-gen11.html?dealer=' + r.id + '" title="Edit dealer" aria-label="Edit dealer">' + ic('i-edit') + '</a>' +
        '<a class="ra" href="' + esc(D.base + '/manage/dealers/' + r.id + '/setup') + '" title="Setup" aria-label="Setup">' + ic('i-cog') + '</a>' +
        (r.site ? '<a class="ra" href="' + esc(r.site) + '" target="_blank" rel="noopener" title="' + esc(r.site) +
          '" aria-label="Web site">' + ic('i-globe') + '</a>' : '<span class="ra" aria-hidden="true"></span>') +
      '</span>' +

      '<span class="c-ver">' + cellVer(r.ver) + '</span>' +
    '</div>';
  }

  function render() {
    renderModes();

    var mode = D.modes.filter(function (m) { return m.k === S.mode; })[0];
    var rows = visible();
    var tb = $('#tb'), emp = $('#empty'), hd = $('#hd');

    /* head meta — the export's "365 dealers · View Active Dealers" */
    $('#page-meta').textContent =
      (mode.n == null ? '' : nf(mode.n) + ' dealers · ') + mode.l;

    /* sort indicators, on the six sortable columns only */
    $$('.hd .s').forEach(function (b) {
      var on = b.getAttribute('data-sort') === S.sort;
      b.classList.toggle('s--on', on);
      b.classList.toggle('s--asc', on && S.dir === 'asc');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      var cell = b.parentNode;
      if (on) cell.setAttribute('aria-sort', S.dir === 'asc' ? 'ascending' : 'descending');
      else cell.removeAttribute('aria-sort');
    });

    /* the query chips, shown in the box they were typed in */
    var chips = '';
    if (S.q) chips += '<span class="fchip"><span class="fchip__k">name</span>' + esc(S.q) +
      '<button class="fchip__x" type="button" data-clear="q" aria-label="Clear the name filter">' + ic('i-x') + '</button></span>';
    $('#q-chips').innerHTML = chips;

    $('#rid-v').textContent = S.rid || 'Show all';
    $('#rgid-v').textContent = S.rgid
      ? (D.rgroups.filter(function (o) { return o.v === S.rgid; })[0] || {}).l
      : 'Any';
    $('.facet__b[data-pop="p-rid"]').classList.toggle('facet__b--on', !!S.rid);
    $('.facet__b[data-pop="p-rgid"]').classList.toggle('facet__b--on', !!S.rgid);

    /* the A–Z jump belongs to name order and to nothing else */
    var nameOrder = S.sort === 'name' && S.dir === 'asc';
    renderAZ(nameOrder ? rows : null);

    if (rows === null) {
      hd.hidden = true;
      tb.innerHTML = '';
      emp.hidden = false;
      emp.innerHTML = '<b>' + esc(mode.l) + ' — ' +
        (mode.n == null ? 'no count in this export' : nf(mode.n) + ' dealers') + '</b>' +
        '<p>The 2026-09-09 production export captured the row sample for the active roster ' +
        'and for Marketing Dealers only, so this saved filter has a real count and no rows. ' +
        'Nothing has been filled in to stand for them.</p>';
      $('#foot-n').innerHTML = '';
      $('#foot-prov').innerHTML = '';
      return;
    }

    hd.hidden = false;
    emp.hidden = true;

    var seen = {}, out = [];
    rows.forEach(function (r) {
      var L = null;
      if (nameOrder) {
        var c = r.name.charAt(0).toUpperCase();
        if (/[A-Z]/.test(c) && !seen[c]) { seen[c] = 1; L = c; }
      }
      out.push(rowHTML(r, L));
    });
    tb.innerHTML = out.join('');

    if (!rows.length) {
      emp.hidden = false;
      if (S.phone) {
        emp.innerHTML = '<b>The phone search runs on the server</b><p>Production matches contact-phone ' +
          'digits across all dealers including disabled ones, in a column this list does not render. ' +
          'There is no server behind this build, so the query is held rather than answered with a guess.</p>';
      } else if (S.rgid) {
        emp.innerHTML = '<b>Reseller Group is resolved on the server</b><p>A group is a property of the ' +
          'reseller, and the captured roster renders the reseller name only — there is no dealer&#8202;→&#8202;group ' +
          'mapping in the 2026-09-09 export, so the filter is held rather than guessed at.</p>';
      } else {
        emp.innerHTML = '<b>No dealer matches</b><p>Clear the name or reseller filter to widen the roster.</p>';
      }
    }

    var total = modeRows(S.mode).length;
    $('#foot-n').innerHTML = rows.length === total
      ? 'Showing all <b>' + nf(total) + '</b> dealers'
      : 'Showing <b>' + nf(rows.length) + '</b> of ' + nf(total) + ' dealers';
    $('#scope').innerHTML = $('#foot-n').innerHTML +
      (S.phone ? ' · phone query held: server-side in production' : '') +
      (S.rgid ? ' · reseller-group filter held: server-side in production' : '');
    $('#foot-prov').innerHTML = 'Features computed <b>' +
      esc(D.featAsOf[0].slice(0, 16)) + '</b> — one sweep, recomputable per dealer';
  }

  function renderAZ(rows) {
    var az = $('#az');
    if (!rows) { az.innerHTML = ''; az.hidden = true; return; }
    az.hidden = false;
    var has = {};
    rows.forEach(function (r) { has[r.name.charAt(0).toUpperCase()] = 1; });
    az.innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function (c) {
      return '<button class="az__b" type="button" data-jump="' + c + '"' +
        (has[c] ? '' : ' disabled') + '>' + c + '</button>';
    }).join('');
  }

  /* ══ EVENTS ═══════════════════════════════════════════════════════════════ */

  /* popovers: one open at a time, click-outside and Escape close them */
  function closePops(except) {
    $$('.pop--open').forEach(function (p) {
      if (p === except) return;
      p.classList.remove('pop--open');
      var t = $('[data-pop="' + p.id + '"]');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-pop]');
    if (t) {
      var p = document.getElementById(t.getAttribute('data-pop'));
      var open = !p.classList.contains('pop--open');
      closePops(open ? p : null);
      p.classList.toggle('pop--open', open);
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && p.id === 'p-rid') { $('#rid-f').value = ''; renderResellerMenu(); $('#rid-f').focus(); }
      return;
    }
    if (!e.target.closest('.pop')) closePops(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePops(null);
  });

  /* saved filters */
  $('#modes').addEventListener('click', function (e) {
    var b = e.target.closest('[data-mode]');
    if (!b) return;
    S.mode = b.getAttribute('data-mode');
    var d = MODE_SORT[S.mode] || { sort: 'name', dir: 'asc' };
    S.sort = d.sort; S.dir = d.dir;
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  /* the two queries */
  var qt;
  $('#q').addEventListener('input', function () {
    clearTimeout(qt);
    qt = setTimeout(function () { S.q = $('#q').value; render(); }, 220);
  });
  $('#phone').addEventListener('input', function () {
    clearTimeout(qt);
    qt = setTimeout(function () { S.phone = $('#phone').value; render(); }, 220);
  });
  $('#q-chips').addEventListener('click', function (e) {
    if (!e.target.closest('[data-clear="q"]')) return;
    S.q = ''; $('#q').value = ''; render();
  });

  /* reseller + reseller group */
  $('#rid-f').addEventListener('input', renderResellerMenu);
  $('#rid-list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-rid]'); if (!b) return;
    S.rid = b.getAttribute('data-rid'); closePops(null); render();
  });
  $('#rgid-list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-rgid]'); if (!b) return;
    S.rgid = b.getAttribute('data-rgid'); closePops(null); render();
  });

  /* sortable columns */
  $('#hd').addEventListener('click', function (e) {
    var b = e.target.closest('[data-sort]'); if (!b) return;
    var k = b.getAttribute('data-sort');
    if (S.sort === k) S.dir = S.dir === 'asc' ? 'desc' : 'asc';
    else { S.sort = k; S.dir = (k === 'created' || k === 'modified') ? 'desc' : 'asc'; }
    render();
  });

  /* A–Z jump. The sticky stack is 192px tall, so a jump target has to clear it
     or it lands under the column header. The offset is read from CSS. */
  $('#az').addEventListener('click', function (e) {
    var b = e.target.closest('[data-jump]'); if (!b || b.disabled) return;
    var el = document.getElementById('jump-' + b.getAttribute('data-jump'));
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.scrollY - stackH() - 10;
    window.scrollTo({ top: Math.max(0, y), behavior: reduced() ? 'auto' : 'smooth' });
  });

  /* per-row feature recompute — the export's ↻ button. There is no server here,
     so the control reports that rather than animating a fake success. */
  $('#tb').addEventListener('click', function (e) {
    var b = e.target.closest('[data-refresh]');
    if (b) {
      b.disabled = true;
      b.title = 'Recompute runs on the server; this build has none';
      return;
    }
    var p = e.target.closest('[data-pkg]');
    if (p) openPkg(p.getAttribute('data-pkg'));
  });

  /* ── the Dealer Package dialog ──────────────────────────────────────────── */
  var dlg = $('#pkg');

  function openPkg(id) {
    renderPkgSelect();
    var rec = (D.pkgRecord || {})[String(id)] || null;
    var row = BY_ID[id];
    if (row) $('#pkg-d').value = String(id);
    $('#pkg-m').checked = rec ? !!rec.marketing
      : !!(row && row.pkg && row.pkg.k === 'badge');
    $('#pkg-ti').value = rec ? rec.title : (row && row.pkg ? row.pkg.t : '');
    $('#pkg-de').value = rec ? rec.details : '';
    $('[data-act="pkg-del"]').disabled = !(row && row.pkg);
    if (typeof dlg.showModal === 'function') dlg.showModal();
  }

  $('[data-act="pkg-new"]').addEventListener('click', function () {
    renderPkgSelect();
    $('#pkg-m').checked = false;
    $('#pkg-ti').value = '';
    $('#pkg-de').value = '';
    $('[data-act="pkg-del"]').disabled = true;
    if (typeof dlg.showModal === 'function') dlg.showModal();
  });
  $('#pkg-d').addEventListener('change', function () {
    /* "Selecting a dealer loads its existing note." */
    openPkgFields($('#pkg-d').value);
  });
  function openPkgFields(id) {
    var rec = (D.pkgRecord || {})[String(id)] || null;
    var row = BY_ID[id];
    $('#pkg-m').checked = rec ? !!rec.marketing : !!(row && row.pkg && row.pkg.k === 'badge');
    $('#pkg-ti').value = rec ? rec.title : (row && row.pkg && row.pkg.k === 'link' ? row.pkg.t : '');
    $('#pkg-de').value = rec ? rec.details : '';
    $('[data-act="pkg-del"]').disabled = !(row && row.pkg);
  }

  /* Print — the export's page is printable and the stylesheet has a print rule */
  $('[data-act="print"]').addEventListener('click', function () { window.print(); });
  $('[data-act="csv"]').addEventListener('click', function (e) {
    e.currentTarget.title = 'Dealers CSV is generated on the server; this build has none';
  });

  /* ── the engaged sticky stack ────────────────────────────────────────────
     CSS publishes the geometry; this reads it. --stick-total is deliberately
     not read: custom properties are substituted but not evaluated, so it comes
     back as the literal text of its calc() and parseFloat gives NaN. The three
     plain values are summed instead. */
  var CSSV = getComputedStyle(document.documentElement);
  function cssPx(n, f) { var v = parseFloat(CSSV.getPropertyValue(n)); return isNaN(v) ? f : v; }
  function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function stackH() { return cssPx('--stick-bar', 68) + cssPx('--stick-cmd', 72) + cssPx('--stick-hd', 52); }

  (function () {
    var cmd = $('#cmd'), hd = $('#hd'), app = $('#app');
    var stuck = null, hdStuck = null, cmdTop, hdTop;
    function read() { cmdTop = cssPx('--stick-bar', 68); hdTop = cmdTop + cssPx('--stick-cmd', 72); }
    function onScroll() {
      var s = window.scrollY > 0 && cmd.getBoundingClientRect().top <= cmdTop + 0.5;
      /* the platform bar is a SIBLING of the field and cannot see the band in
         the selector tree, so the engaged state is published on the shell too */
      if (s !== stuck) { stuck = s; cmd.classList.toggle('cmd--stuck', s); app.classList.toggle('is-stuck', s); }
      var h = window.scrollY > 0 && !hd.hidden && hd.getBoundingClientRect().top <= hdTop + 0.5;
      if (h !== hdStuck) { hdStuck = h; hd.classList.toggle('hd--stuck', h); }
    }
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { read(); onScroll(); });
    onScroll();
  })();

  /* ── boot ────────────────────────────────────────────────────────────── */
  renderNav();
  renderTally();
  renderGroupMenu();
  renderResellerMenu();
  render();

  window.MD11 = { S: S, render: render };
})();
