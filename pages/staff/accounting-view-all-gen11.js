/* ============================================================================
   AAN · Staff UI · ACCOUNTING — VIEW ALL — GENERATION 11

   Renders the export's own 363 dealer rows, its four deck figures, its lanes,
   its filters and its A–Z index. Opening a row discloses that dealer's ledger
   in flow, on the Gen 11 anchor.

   Rules this file keeps, in DESIGN.md's order:

     1  GEOMETRY IS READ, NEVER RETYPED (§7). The sticky stack is published as
        `--stick-bar` + `--stick-cmd` + `--stick-hd`; this file reads the three
        plain values and sums them. It never reads `--stick-total`: a custom
        property is substituted but not evaluated, so that token comes back as
        the literal text "calc(68px + 72px + 52px)" and parseFloat gives NaN.

     2  ONE ANCHOR ARITHMETIC IN ONE PLACE (§8): rowTop + scrollY − stack −
        --anchor-gap. The document extender grows by exactly the shortfall when
        the target is past the end of the document, so the last rows can reach
        the anchor. Closing a row does nothing to the scroll position.

     3  MONEY IS NEVER RE-TYPED EITHER. Every total on the page is summed from
        the rows it claims to describe, at render time. The deck's four figures
        are the export's own and are verified against these rows by the fixture
        header; the footer's two are the sums of the FILTERED set, which is why
        they move when a filter does.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var ic = function (id) { return '<svg class="i"><use href="#' + id + '"/></svg>'; };

  var D = window.AC;
  var ALL = D.dealers;

  /* ── money ────────────────────────────────────────────────────────────── */
  function usd(n) {
    if (n == null) return '—';
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function shortDate(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return MON[+p[1] - 1] + ' ' + (+p[2]);
  }

  /* ── sticky geometry: published by CSS, read here ─────────────────────── */
  function px(name) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    var n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }
  function stack() { return px('--stick-bar') + px('--stick-cmd') + px('--stick-hd'); }
  function anchorGap() { return px('--anchor-gap'); }
  function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ── state ────────────────────────────────────────────────────────────── */
  var S = {
    lane: 'billable',       /* the export's default: the Billable population   */
    status: null,           /* Active | Pending | Client Intake | null         */
    tile: null,             /* 'owing' when the Open balance tile is engaged   */
    q: '',
    reseller: '',
    group: '',
    az: null,
    sort: 'name',
    dir: 1,
    open: null              /* dealer id of the row disclosing its ledger      */
  };

  /* ══ NAV ════════════════════════════════════════════════════════════════
     The eight staff nav groups the export ships. Accounting is the current
     section: tinted, no fill (DESIGN.md §6). */
  function renderNav() {
    $('#nav').innerHTML = D.nav ? navHtml(D.nav) : '';
  }
  function navHtml(groups) {
    return groups.map(function (g, gi) {
      var on = g.label === 'Accounting';
      var items = g.items.map(function (it) {
        var cls = 'mn__it' + (it.kind === 'sub' ? ' mn__it--sub' : '')
          + (it.kind === 'accounting-view-all-gen11.html' ? ' mn__it--on' : '');
        var href = (it.kind && it.kind !== 'ext' && it.kind !== 'sub') ? it.kind : '#';
        return '<a class="' + cls + '" href="' + href + '">' + esc(it.label) + (it.kind === 'ext' ? ic('i-ext') : '') + '</a>';
      }).join('');
      return '<div class="nav__it' + (on ? ' nav__it--on' : '') + '">'
        + '<button class="nav__b" type="button" data-pop="p-nav-' + gi + '" aria-haspopup="true" aria-expanded="false">'
        + esc(g.label) + ic('i-chev') + '</button>'
        + '<div class="pop" id="p-nav-' + gi + '"><div class="caps pop__lab">' + esc(g.label) + '</div>' + items + '</div></div>';
    }).join('');
  }

  function renderUtils() {
    var parts = D.utils.map(function (u) { return '<a href="#">' + esc(u) + '</a>'; });
    var pdfs = '<div class="nav__it">'
      + '<button type="button" data-pop="p-pdf" aria-haspopup="true" aria-expanded="false">Inv PDFs' + ic('i-chev') + '</button>'
      + '<div class="pop pop--r" id="p-pdf"><div class="caps pop__lab">Invoice PDFs</div>'
      + D.pdfs.map(function (p) { return '<a class="mn__it" href="#">' + ic('i-file') + esc(p) + '</a>'; }).join('')
      + '</div></div>';
    $('#utils').innerHTML = parts.join('<span class="utils__sep">·</span>') + '<span class="utils__sep">·</span>' + pdfs;
  }

  /* ══ DECK ═══════════════════════════════════════════════════════════════ */
  function renderDeck() {
    $('#deck').innerHTML = D.deck.map(function (t) {
      var on = t.filter && S.tile === t.filter;
      var lanesOn = t.filter === 'billable' && S.lane === 'billable' && !S.tile;
      var isBtn = !!t.filter;
      var cls = 'tile'
        + (t.tone === 'danger' ? ' tile--danger' : '')
        + (isBtn ? '' : ' tile--static')
        + ((on || lanesOn) ? ' tile--on' : '');
      var inner = '<span class="tile__k">' + esc(t.k) + '</span>'
        + '<span class="tile__v">' + esc(t.v) + '</span>'
        + '<span class="tile__s">' + esc(t.s) + '</span>'
        + (isBtn
            ? '<span class="tile__f">' + ic('i-dn') + ((on || lanesOn) ? 'showing' : 'filter') + '</span>'
            : (t.k === 'Past due'
                ? '<span class="tile__note">not resolvable to rows in this snapshot</span>'
                : ''));
      return isBtn
        ? '<button class="' + cls + '" type="button" data-tile="' + esc(t.filter) + '" aria-pressed="' + !!(on || lanesOn) + '"'
          + (t.title ? ' title="' + esc(t.title) + '"' : '') + '>' + inner + '</button>'
        : '<div class="' + cls + '"' + (t.title ? ' title="' + esc(t.title) + '"' : '') + '>' + inner + '</div>';
    }).join('');
  }

  /* ══ COMMAND ════════════════════════════════════════════════════════════ */
  function renderLanes() {
    $('#lanes').innerHTML = D.lanes.map(function (l) {
      return '<button class="lane ui-view' + (S.lane === l.k ? ' lane--on ui-view--on' : '') + '" type="button" data-lane="' + l.k
        + '" aria-pressed="' + (S.lane === l.k) + '">' + esc(l.label) + '<b>' + l.n.toLocaleString('en-US') + '</b></button>';
    }).join('');
    /* status is a filter, not a view: it narrows what the current view shows,
       so it wears the filter chip and never the view track's pill. */
    $('#statuses').innerHTML = '<span class="caps flt__k">Status</span>' + D.statuses.map(function (s) {
      return '<button class="tl ui-filter' + (S.status === s.k ? ' tl--on' : '') + '" type="button" data-status="' + esc(s.k)
        + '" aria-pressed="' + (S.status === s.k) + '">' + esc(s.k) + '<b>' + s.n + '</b></button>';
    }).join('');
  }
  function renderFilters() {
    $('#f-reseller').innerHTML = D.resellers.map(function (r, n) {
      return '<option value="' + (n === 0 ? '' : esc(r)) + '"' + (S.reseller === (n === 0 ? '' : r) ? ' selected' : '') + '>' + esc(r) + '</option>';
    }).join('');
    $('#f-group').innerHTML = D.groups.map(function (g, n) {
      return '<option value="' + (n === 0 ? '' : esc(g)) + '"' + (S.group === (n === 0 ? '' : g) ? ' selected' : '') + '>' + esc(g) + '</option>';
    }).join('');
    /* The reseller and group filters are real production controls, and the
       export ships their full option lists — but a dealer row in the export does
       NOT carry which reseller it belongs to. Rather than filter on a field the
       data does not have, each control says what it would narrow and is left
       inert, which is the honest version of a control whose key is missing. */
    var note = 'The export’s dealer rows do not carry a reseller key, so this control cannot narrow them here.';
    $('#f-reseller').title = note;
    $('#f-group').title = note;
    $('#f-reseller').disabled = true;
    $('#f-group').disabled = true;
  }

  /* ══ FILTER · SORT ══════════════════════════════════════════════════════ */
  function rows() {
    var q = S.q.trim().toLowerCase();
    var digits = /^\d{4,}$/.test(q);
    var out = ALL.filter(function (d) {
      if (S.lane === 'billable' && !d.bactive) return false;
      if (S.status && d.status !== S.status) return false;
      if (S.tile === 'owing' && !d.bal) return false;
      if (S.az && (d.name[0] || '').toUpperCase() !== S.az) return false;
      if (q) {
        if (digits) { if (String(d.id).indexOf(q) < 0) return false; }
        else {
          var hay = (d.name + ' ' + d.emails.join(' ')).toLowerCase();
          if (hay.indexOf(q) < 0) return false;
        }
      }
      return true;
    });
    var k = S.sort, dir = S.dir;
    out.sort(function (a, b) {
      var av = a[k], bv = b[k];
      if (k === 'bal' || k === 'mo') { av = av == null ? -1 : av; bv = bv == null ? -1 : bv; }
      if (k === 'lpDate') { av = av || ''; bv = bv || ''; }
      if (typeof av === 'string' && typeof bv === 'string') {
        var c = av.localeCompare(bv, 'en', { sensitivity: 'base' });
        return c * dir || a.name.localeCompare(b.name);
      }
      return (av < bv ? -1 : av > bv ? 1 : 0) * dir || a.name.localeCompare(b.name);
    });
    return out;
  }

  /* ══ ROWS ═══════════════════════════════════════════════════════════════ */
  var STATI = { green: 'i-check', blue: 'i-half', amber: 'i-dot' };
  function rowHtml(d) {
    var open = S.open === d.id;
    var mail = d.emails.length
      ? '<span class="c--1">' + esc(d.emails[0]) + '</span>'
        + (d.emails.length > 1 ? '<span class="more" title="' + esc(d.emails.join(', ')) + '">+' + (d.emails.length - 1) + '</span>' : '')
      : '<span class="none muted">—</span>';
    var lp = d.lpAmt == null
      ? '<span class="pdot pdot--bad" title="no payment found"></span><i class="none">not found</i>'
      : '<span class="pdot pdot--' + esc(d.lpTone) + '" title="' + (d.lpTone === 'ok' ? 'paid this cycle' : 'last payment is older than this cycle') + '"></span>'
        + '<span class="amt">' + usd(d.lpAmt) + '</span>'
        + '<span class="paydate" title="' + esc(d.lpDate || '') + '">· ' + esc(shortDate(d.lpDate)) + '</span>';
    return '<div class="row' + (open ? ' open' : '') + '" data-id="' + d.id + '" tabindex="0" role="button"'
      + ' aria-expanded="' + open + '" aria-label="' + esc(d.name) + ' — open ledger">'
      + '<span class="c c-stat">'
        + '<span class="bstat bstat--' + esc(d.tone) + '" role="img" title="' + esc(d.status) + '" aria-label="' + esc(d.status) + '">' + ic(STATI[d.tone] || 'i-dot') + '</span>'
        + '<input class="bck" type="checkbox"' + (d.bactive ? ' checked' : '') + ' data-bill="' + d.id + '"'
        + ' title="Billing active for ' + esc(d.name) + '" aria-label="Billing active for ' + esc(d.name) + '">'
      + '</span>'
      + '<span class="c c-name"><a href="#" data-id="' + d.id + '" class="c--1">' + esc(d.name) + '</a><span class="did">#' + d.id + '</span></span>'
      + '<span class="c c-to">' + (d.billTo ? esc(d.billTo) : '<span class="none">—</span>') + '</span>'
      + '<span class="c c-pay">' + (d.payWith && d.payWith !== 'Undefined' ? esc(d.payWith) : '<span class="none">' + esc(d.payWith || '—') + '</span>') + '</span>'
      + '<span class="c c-mail">' + mail + '</span>'
      + '<span class="c c-lp">' + lp + '</span>'
      + '<span class="c num c-bal">' + (d.bal ? '<span class="due">' + usd(d.bal) + '</span>' : '<span class="zero">—</span>') + '</span>'
      + '<span class="c num c-mo">' + (d.mo ? usd(d.mo) : '<span class="zero">—</span>') + '</span>'
      + '<span class="c c-act">'
        + '<button class="btn btn--primary btn--xs" type="button" data-pay="' + d.id + '" title="Unpaid balances / post payments">Pay</button>'
        + '<button class="btn btn--sheet btn--xs" type="button" data-hist="' + d.id + '" title="Ledger / history">History</button>'
      + '</span>'
      + '</div>'
      + (open ? expHtml(d) : '');
  }

  /* ══ THE OPEN ROW — the dealer's ledger ═════════════════════════════════
     Three dealers in the export have a ledger page, so three dealers have real
     invoice rows here. For every other dealer the row's own figures are shown —
     they ARE real — and the ledger states that the export does not carry it,
     rather than a plausible invoice history being generated to fill the space
     (DESIGN.md §13). */
  function expHtml(d) {
    var led = D.ledgers[String(d.id)];
    var meta = D.lmeta[String(d.id)];
    var head = '<div class="exp__h">'
      + '<span class="exp__t">' + esc(d.name) + '<span class="did">#' + d.id + '</span></span>'
      + '<span class="exp__sp"></span>'
      + '<button class="btn btn--sheet btn--xs" type="button">Note</button>'
      + '<button class="btn btn--primary btn--xs" type="button">Create Custom Invoice</button>'
      + '<button class="btn btn--quiet btn--xs" type="button" data-close="1">' + ic('i-x') + ' Close</button>'
      + '</div>';

    var ident = '';
    if (meta) {
      var line = meta.ident.replace(/⧉$/, '').trim();
      ident = '<div class="ident">' + line.split(' · ').map(function (part, n) {
        var b = part.replace(/^([^(]+)\s\(accountant\)$/, '<b>$1</b> (accountant)');
        return (n ? '<span class="ident__sep">·</span>' : '') + '<span>' + b + '</span>';
      }).join('')
      + '<button class="copy" type="button" title="Copy the billing email" aria-label="Copy the billing email" data-copy="' + esc(d.emails[0] || '') + '">' + ic('i-copy') + '</button>'
      + '</div>';
    } else {
      ident = '<div class="ident"><span>' + (d.emails.length ? esc(d.emails.join(' · ')) : 'no billing email on file') + '</span></div>';
    }

    /* the chips: the dealer's own five figures. Balance / Monthly / Last paid
       come off the row for every dealer; Past due and Next auto-bill exist only
       on a ledger page, so they are shown only where the export has them. */
    var chips = '<div class="chips">'
      + '<span class="bch' + (d.bal ? ' bch--bad' : ' bch--ok') + '">Balance <b>' + (d.bal ? usd(d.bal) : '$0.00') + '</b></span>'
      + '<span class="bch">Monthly <b>' + (d.mo ? usd(d.mo) : '—') + '</b></span>'
      + '<span class="bch">Last paid <b>' + (d.lpDate ? esc(shortDate(d.lpDate)) + ', ' + d.lpDate.slice(0, 4) : '—') + '</b></span>'
      + '<span class="bch">Bill to <b>' + esc(d.billTo || '—') + '</b></span>'
      + '<span class="bch">Pay with <b>' + esc(d.payWith || '—') + '</b></span>'
      + '</div>';

    if (!led) {
      return '<div class="exp">' + head + ident + chips
        + '<p class="exp__src">Ledger not in this export. The figures above are this dealer’s own row; the invoice history behind them is on three dealers only '
        + '(<a href="#" data-goto="241">Gullwing Motor Cars #241</a>, <a href="#" data-goto="999">Theodore Clarke &amp; Co. #999</a>, '
        + '<a href="#" data-goto="186">Miller Motorcars #186</a>). Nothing has been generated to stand in for it.</p>'
        + '</div>';
    }

    /* totals over the WHOLE ledger, not over the capped view */
    var tTotal = 0, tPaid = 0, tBal = 0;
    led.forEach(function (r) { tTotal += r.total || 0; tPaid += r.paid || 0; tBal += r.bal || 0; });

    var cap = 12;
    var showAll = !!expOpen[d.id];
    var view = showAll ? led : led.slice(0, cap);
    var body = view.map(function (r) {
      return '<tr>'
        + '<td class="inv"><a href="#">' + esc(r.inv) + '</a></td>'
        + '<td>' + esc(r.created) + '</td>'
        + '<td class="faint">' + (r.sent ? esc(r.sent) : '<span class="none">not sent</span>') + '</td>'
        + '<td class="num">' + usd(r.total) + '</td>'
        + '<td class="num' + (r.paid ? ' paid' : '') + '">' + (r.paid ? usd(r.paid) : '<span class="none">—</span>') + '</td>'
        + '<td>' + (r.datePaid ? esc(r.datePaid) : '<span class="none">—</span>') + '</td>'
        + '<td class="faint">' + (r.ref ? esc(r.ref) : '<span class="none">—</span>') + '</td>'
        + '<td class="num' + (r.bal ? ' owe' : '') + '">' + (r.bal ? usd(r.bal) : '<span class="none">—</span>') + '</td>'
        + '<td><span class="type' + (r.type === 'Auto' ? ' type--auto' : '') + '">' + esc(r.type) + '</span></td>'
        + '</tr>';
    }).join('');

    var tabs = meta.tabs.slice(1).map(function (t) { return '<a href="#">' + esc(t) + '</a>'; }).join('');

    return '<div class="exp">' + head + ident + chips
      + '<div class="lgw">'
      + '<div class="lgh"><span class="caps">Ledger</span><span class="s">'
      + led.length + ' invoices · showing ' + view.length + '</span></div>'
      + '<table class="lg"><thead><tr>'
      + '<th>Invoice</th><th>Created</th><th>Sent</th><th class="num">Total</th><th class="num">Paid</th>'
      + '<th>Date Paid</th><th>Reference</th><th class="num">Balance</th><th>Type</th>'
      + '</tr></thead>'
      + '<tbody>' + body + '</tbody>'
      + '<tfoot><tr>'
      + '<td class="lab" colspan="3">All ' + led.length + ' invoices</td>'
      + '<td class="num">' + usd(tTotal) + '</td>'
      + '<td class="num">' + usd(tPaid) + '</td>'
      + '<td colspan="2"></td>'
      + '<td class="num' + (tBal ? ' owe' : '') + '">' + usd(tBal) + '</td>'
      + '<td></td>'
      + '</tr></tfoot>'
      + '</table>'
      + '<div class="lg__f">'
      + (led.length > cap
          ? '<button class="btn btn--sheet btn--xs" type="button" data-all="' + d.id + '">'
            + (showAll ? 'Show the latest ' + cap : 'Show all ' + led.length) + '</button>'
          : '')
      + '<span class="sp"></span><span class="lgtabs">' + tabs + '</span></div>'
      + '</div></div>';
  }
  var expOpen = {};

  /* ══ RENDER ═════════════════════════════════════════════════════════════ */
  function renderHeadMeta() {
    $('#head-meta').innerHTML = esc(D.header.meta).replace(/^(\d+ dealers)/, '<b>$1</b>');
  }
  function renderAZ() {
    var present = {};
    ALL.forEach(function (d) { present[(d.name[0] || '').toUpperCase()] = true; });
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    $('#az').innerHTML = letters.map(function (L) {
      var has = !!present[L];
      return '<button type="button" data-az="' + L + '"' + (has ? '' : ' disabled')
        + (S.az === L ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"')
        + ' aria-label="Dealers starting with ' + L + '">' + L + '</button>';
    }).join('')
    + '<button type="button" data-az="" ' + (S.az ? '' : 'disabled') + ' aria-label="Clear the letter filter">All</button>';
  }
  function renderSortMarks() {
    $$('.hd .s').forEach(function (h) {
      var on = h.dataset.sort === S.sort;
      h.classList.toggle('s--on', on);
      var arrow = h.querySelector('.i');
      if (arrow) arrow.remove();
      if (on) h.insertAdjacentHTML('beforeend', ic(S.dir > 0 ? 'i-up' : 'i-dn'));
      h.setAttribute('aria-sort', on ? (S.dir > 0 ? 'ascending' : 'descending') : 'none');
    });
  }
  function render() {
    var R = rows();
    $('#tb').innerHTML = R.map(rowHtml).join('');
    $('#empty').hidden = R.length > 0;

    var bal = 0, mo = 0, owe = 0;
    R.forEach(function (d) { bal += d.bal || 0; mo += d.mo || 0; if (d.bal) owe++; });

    var scope = [];
    scope.push('<b>' + R.length.toLocaleString('en-US') + '</b> of ' + ALL.length + ' dealers');
    if (S.lane === 'billable') scope.push('billing active');
    if (S.status) scope.push(esc(S.status));
    if (S.tile === 'owing') scope.push('with an open balance');
    if (S.az) scope.push('starting with ' + S.az);
    $('#scope').innerHTML = scope.join(' · ');

    $('#shown').innerHTML = R.length.toLocaleString('en-US') + ' dealers shown · ' + owe + ' with an open balance';
    $('#tot').innerHTML =
      '<span>Balance <b class="' + (bal ? 'due' : '') + '">' + usd(bal) + '</b></span>'
      + '<span>Monthly <b>' + usd(mo) + '</b></span>';

    $('#fchips').innerHTML = S.q
      ? '<span class="fchip"><span class="fchip__k">match</span>' + esc(S.q)
        + '<button class="fchip__x" type="button" data-act="clear-q" aria-label="Clear the search">' + ic('i-x') + '</button></span>'
      : '';

    renderDeck(); renderLanes(); renderAZ(); renderSortMarks();
    sizeExtender();
  }

  /* ══ THE ANCHOR (DESIGN.md §8) ══════════════════════════════════════════ */
  function anchorOf(row) {
    return Math.max(0, Math.round(row.getBoundingClientRect().top + window.scrollY - stack() - anchorGap()));
  }
  function sizeExtender() {
    var sp = $('#exp-space'), last = $$('.row').pop();
    if (!sp || !last) return;
    sp.style.height = '0px';
    var need = anchorOf(last) - (document.documentElement.scrollHeight - window.innerHeight);
    sp.style.height = need > 0 ? Math.ceil(need) + 'px' : '0px';
  }
  function openRow(id) {
    var same = S.open === id;
    S.open = same ? null : id;
    if (same) { render(); return; }            /* closing does nothing to scroll */
    render();
    var row = $('.row[data-id="' + id + '"]');
    if (!row) return;
    sizeExtender();
    window.scrollTo({ top: anchorOf(row), behavior: reduced() ? 'auto' : 'smooth' });
  }

  /* engaged state, published in three places by one handler — the platform bar
     is a SIBLING of the field and cannot see the band in the selector tree */
  var engaged = null;
  function onScroll() {
    var cmd = $('#cmd'), hd = $('#hd'), app = $('#app');
    var on = cmd.getBoundingClientRect().top <= px('--stick-bar') + 0.5;
    if (on !== engaged) {
      engaged = on;
      cmd.classList.toggle('cmd--stuck', on);
      hd.classList.toggle('hd--stuck', on);
      app.classList.toggle('is-stuck', on);
    }
  }

  /* ══ MENUS ══════════════════════════════════════════════════════════════ */
  function closePops(except) {
    $$('.pop--open').forEach(function (p) {
      if (p === except) return;
      p.classList.remove('pop--open');
      var b = $('[data-pop="' + p.id + '"]');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  /* ══ EVENTS ═════════════════════════════════════════════════════════════ */
  document.addEventListener('click', function (e) {
    var t = e.target, el;

    if ((el = t.closest('[data-pop]'))) {
      var pop = $('#' + el.dataset.pop);
      var on = !pop.classList.contains('pop--open');
      closePops(on ? pop : null);
      pop.classList.toggle('pop--open', on);
      el.setAttribute('aria-expanded', String(on));
      return;
    }
    if (!t.closest('.pop')) closePops();

    if (t.closest('[data-act="print"]')) { window.print(); return; }
    if (t.closest('[data-act="clear-q"]')) { S.q = ''; $('#q').value = ''; render(); return; }

    if ((el = t.closest('[data-tile]'))) {
      var f = el.dataset.tile;
      if (f === 'billable') { S.lane = 'billable'; S.tile = null; }
      else { S.tile = S.tile === f ? null : f; if (S.tile) { S.sort = 'bal'; S.dir = -1; } }
      S.open = null;
      render();
      return;
    }
    if ((el = t.closest('[data-lane]'))) { S.lane = el.dataset.lane; S.open = null; render(); return; }
    if ((el = t.closest('[data-status]'))) {
      var v = el.dataset.status;
      S.status = S.status === v ? null : v;
      S.open = null; render();
      return;
    }
    if ((el = t.closest('[data-az]'))) { S.az = el.dataset.az || null; S.open = null; render(); return; }

    if ((el = t.closest('.hd .s'))) {
      var k = el.dataset.sort;
      if (S.sort === k) { S.dir = -S.dir; } else { S.sort = k; S.dir = (k === 'bal' || k === 'mo' || k === 'lpDate') ? -1 : 1; }
      render();
      return;
    }

    if ((el = t.closest('[data-goto]'))) { e.preventDefault(); openRow(+el.dataset.goto); return; }
    if ((el = t.closest('[data-all]'))) {
      var id = +el.dataset.all;
      expOpen[id] = !expOpen[id];
      render(); sizeExtender();
      return;
    }
    if (t.closest('[data-close]')) { S.open = null; render(); return; }
    if ((el = t.closest('[data-copy]'))) {
      try { navigator.clipboard.writeText(el.dataset.copy); } catch (x) {}
      return;
    }
    /* the billing-active toggle is a per-dealer setting, not a row selection, so
       it must not also open the row */
    if (t.closest('[data-bill]')) { e.stopPropagation(); return; }
    if (t.closest('[data-pay]') || t.closest('[data-hist]')) { return; }

    if ((el = t.closest('.row'))) { e.preventDefault(); openRow(+el.dataset.id); return; }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.hasAttribute && t.hasAttribute('data-bill')) {
      var id = +t.dataset.bill;
      ALL.forEach(function (d) { if (d.id === id) d.bactive = t.checked; });
      /* the lane counts are the export's snapshot and are not rewritten by a
         local toggle; what changes is which rows the Billable lane shows */
      render();
    }
  });

  /* rows are operable from the keyboard — the contract the markup declares */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if ($('.pop--open')) { closePops(); return; }
      if (S.open != null) { S.open = null; render(); return; }
    }
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) {
      e.preventDefault(); $('#q').focus(); return;
    }
    var row = e.target.closest && e.target.closest('.row');
    if (row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openRow(+row.dataset.id); }
  });

  var qt = null;
  $('#q').addEventListener('input', function () {
    clearTimeout(qt);
    var v = this.value;
    qt = setTimeout(function () { S.q = v; S.open = null; render(); }, 120);
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', sizeExtender);

  renderNav();
  renderUtils();
  renderHeadMeta();
  renderFilters();
  render();
  onScroll();
})();
