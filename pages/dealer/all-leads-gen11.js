/* ============================================================================
   AAN · Dealer UI · ALL LEADS — GENERATION 11

   The Lead Desk's own elements — five lanes, seven filters, eleven columns, the
   assign tray, 70-per-page pagination and the inline lead sheet — on the Gen 11
   contract. Behaviour is Gen 10's; what is re-derived is how it is obtained.

   Three things this file does NOT do, each because Gen 10 did and it was
   measured as a defect:

     1  It does not hardcode the sticky stack. Gen 10 carried `- 56 - 58 - 48`
        in the anchor and `<= 56.5` / `<= 114.5` in the scroll handler, against
        a CSS layout that says 68 / 72 / 52. CSS publishes the geometry; this
        file reads it. Custom properties are substituted but not evaluated, so
        `getPropertyValue('--stick-total')` returns the literal text
        `calc(68px + 72px + 52px)` and parseFloat gives NaN — the three plain
        values are summed instead (DESIGN.md §7).

     2  It does not toggle `hd--veil`. The column header never disappears. An
        expanded lead travels *under* the band and the header on the layer
        ladder, which is what made hiding the header look necessary.

     3  It does not choreograph with setTimeout. Gen 10 paid for a 200ms exit
        fade on an element the next render destroyed, which is why switching
        leads felt late. Switching is an ordinary open of another row.

   Prototype JS. The record set is the Gen 10 set, unchanged: vehicles, lead
   types, sources, statuses, providers and reps are the dealer's export; people,
   messages and dates are synthetic. Anything shown that the record does not
   carry is marked, in the region it appears in, before it is read (§13).
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var nf = function (n) { return Number(n).toLocaleString('en-US'); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (id) { return '<svg class="i"><use href="#' + id + '"/></svg>'; };

  var D = window.LD, T = D.totals, V = D.leads;
  var TODAY = '2026-09-09';

  /* Fourteen statuses, seven badge tones, grouped by what the status means for
     the day's work. The label always carries the meaning; the tone only sorts. */
  var STCLS = {
    'New Lead': 'new', 'Active Prospect': 'active', 'Hot': 'hot',
    'Pending': 'pend', 'Sale Pending': 'pend', 'Trade Appraisal': 'trade',
    'Long Term Lead': 'quiet', 'Just Looking': 'quiet', 'Bought Here': 'won',
    'Service': 'quiet', 'Storage': 'quiet', 'Galleria': 'quiet',
    'Looking': 'quiet', 'Unassigned': 'quiet'
  };

  /* Meter tone for the By-status inset. These are the fill-level tokens, which
     is what the equivalent Age-mix meter uses on the same focal material. One
     substitution: `New Lead` would take --brand (#1f5fe0), which measures
     1.9:1 against the composited track on this surface — illegible. It takes
     the focal surface's own secondary ink instead, and it is the largest bucket
     on the page, so quiet-but-legible is the right reading. */
  var STTONE = {
    'New Lead': 'var(--focal-ink-2)',
    'Active Prospect': 'var(--ok-fill)',
    'Hot': 'var(--danger-fill)',
    'Pending': 'var(--violet-fill)',
    'Sale Pending': 'var(--violet-fill)',
    'Trade Appraisal': 'var(--signal-fill)',
    'Long Term Lead': 'var(--slate-fill)',
    'Just Looking': 'var(--slate-fill)',
    'Bought Here': 'var(--ok-fill)'
  };

  V.forEach(function (l) {
    l.d = l.created.slice(0, 10);
    l.isToday = l.d === TODAY;
    l.hasCar = !!l.car;
    l.unassigned = l.rep === 'Unassigned';
  });

  var S = {
    q: '', lane: 'search', sort: 'created', dir: 'desc',
    status: 'Any', rep: 'Any', source: 'Any', provider: 'Any', type: 'Any',
    created: 'any', flag: null, page: 1, sel: {}, cur: null,
    thirdParty: false, archived: false,
    /* The five regions of the lead workspace. Vehicle of interest opens by
       default and can also be closed; any number may be open at once (§9). */
    acc: { vehicle: true, contact: false, activity: false, emails: false, trade: false }
  };

  var FLAGS = [
    ['pastdue',    'Past due',   'follow-up date passed',        'danger', function (l) { return l.pastDue; }],
    ['newmail',    'New mail',   'unread reply from the buyer',  'signal', function (l) { return l.newMail; }],
    ['unassigned', 'Unassigned', 'no sales rep yet',             'slate',  function (l) { return l.unassigned; }],
    ['novehicle',  'No vehicle', 'no vehicle of interest',       'slate',  function (l) { return !l.hasCar; }],
    ['today',      'Today',      'came in today',                'violet', function (l) { return l.isToday; }],
    ['tradein',    'Trade-in',   'trade-in or consignment lead', 'signal', function (l) { return /tradein|consignment/.test(l.type); }]
  ];

  var LANE_NAME = { search: 'All leads', uncat: 'Uncategorized', newmail: 'New Mail', today: 'Today', pastdue: 'Past Due' };


  /* ── dates ──────────────────────────────────────────────────────────── */
  function daysAgo(d) { return Math.round((new Date(TODAY) - new Date(d)) / 86400000); }
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function fd(iso) { var p = iso.split('-'); return p[1] + '/' + p[2] + '/' + p[0]; }
  function fdate(iso) { var d = new Date(iso); return p2(d.getMonth() + 1) + '/' + p2(d.getDate()) + '/' + d.getFullYear(); }
  function ftime(iso) { var d = new Date(iso); return p2(d.getHours()) + ':' + p2(d.getMinutes()); }


  /* ── the list ───────────────────────────────────────────────────────── */
  function list() {
    var q = S.q.trim().toLowerCase();
    var L = V.filter(function (l) {
      if (q && (l.name + ' ' + l.email + ' ' + l.phone + ' ' + (l.stock || '') + ' ' + (l.car || '') + ' #' + l.id).toLowerCase().indexOf(q) < 0) return false;
      if (S.lane === 'newmail' && !l.newMail) return false;
      if (S.lane === 'today' && !l.isToday) return false;
      if (S.lane === 'pastdue' && !l.pastDue) return false;
      if (S.lane === 'uncat' && l.status !== 'New Lead') return false;
      if (S.status !== 'Any' && (S.status === 'Unassigned' ? !l.unassigned : l.status !== S.status)) return false;
      if (S.rep !== 'Any' && l.rep !== S.rep) return false;
      if (S.source !== 'Any' && l.src.indexOf(S.source) !== 0) return false;
      if (S.provider !== 'Any' && l.provider !== S.provider) return false;
      if (S.type !== 'Any' && l.type.indexOf(S.type) !== 0) return false;
      if (S.created === 'today' && !l.isToday) return false;
      if (S.created === '7' && daysAgo(l.d) > 7) return false;
      if (S.created === '30' && daysAgo(l.d) > 30) return false;
      if (S.flag) { var f = FLAGS.filter(function (x) { return x[0] === S.flag; })[0]; if (f && !f[4](l)) return false; }
      return true;
    });
    var s = S.sort, k = S.dir === 'asc' ? 1 : -1;
    L.sort(function (a, b) {
      var x, y;
      if (s === 'name') { x = a.name.toLowerCase(); y = b.name.toLowerCase(); }
      else if (s === 'status') { x = a.status; y = b.status; }
      else if (s === 'rep') { x = a.rep; y = b.rep; }
      else if (s === 'follow') { x = a.follow || ''; y = b.follow || ''; }
      else { x = a.created; y = b.created; }
      return x < y ? -k : x > y ? k : 0;
    });
    return L;
  }


  /* ── the board ──────────────────────────────────────────────────────── */
  function renderBoard() {
    $('#ln-newmail').textContent = nf(T.newMail);
    $('#ln-today').textContent = nf(T.today);
    $('#ln-pastdue').textContent = nf(T.pastDue);

    $$('.lane').forEach(function (b) {
      var on = b.dataset.lane === S.lane;
      b.classList.toggle('lane--on', on); b.classList.toggle('ui-view--on', on);
      b.setAttribute('aria-pressed', on);
    });

    var laneN = { search: T.all, uncat: T.uncat, newmail: T.newMail, today: T.today, pastdue: T.pastDue }[S.lane];
    countTo($('#scope-n'), laneN);
    $('#scope-l').textContent = LANE_NAME[S.lane];
    $('#scope-of').textContent = S.lane === 'search' ? nf(T.uncat) + ' uncategorized' : 'of ' + nf(T.all) + ' leads';

    /* By status — the five biggest buckets on this page */
    var counts = {};
    V.forEach(function (l) { counts[l.status] = (counts[l.status] || 0) + 1; });
    var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 5);
    var max = counts[top[0]] || 1;
    $('#statusrows').innerHTML = top.map(function (st) {
      var on = S.status === st;
      return '<button type="button" class="agerow' + (on ? ' on' : '') + '" data-status="' + esc(st) + '" aria-pressed="' + on + '" title="' + esc(st) + ' · ' + counts[st] + ' of ' + V.length + ' on this page">' +
        '<span class="agerow__l">' + esc(st) + '</span>' +
        '<span class="agerow__m"><i style="--seg:' + (STTONE[st] || 'var(--slate-fill)') + ';width:' + Math.round(counts[st] / max * 100) + '%"></i></span>' +
        '<b>' + counts[st] + '</b><em>' + Math.round(counts[st] / V.length * 100) + '%</em></button>';
    }).join('');

    /* Assigned — who is holding this page's leads */
    var un = V.filter(function (l) { return l.unassigned; }).length, reps = {};
    V.forEach(function (l) { if (!l.unassigned) reps[l.rep] = 1; });
    $('#assigned-kv').innerHTML =
      '<div><div class="v' + (un ? ' warn' : '') + '">' + un + '</div><div class="l">unassigned</div></div>' +
      '<div><div class="v">' + (V.length - un) + '</div><div class="l">assigned to ' + Object.keys(reps).length + ' reps</div></div>' +
      '<div><div class="v">' + D.reps.length + '</div><div class="l">sales reps · rotation</div></div>';

    /* Flags — six queues over this page */
    $('#attn-g').innerHTML = FLAGS.map(function (f) {
      var n = V.filter(f[4]).length, pc = Math.round(n / V.length * 100), on = S.flag === f[0];
      return '<button class="ar ar--' + f[3] + (on ? ' ar--on' : '') + '" type="button" data-flag="' + f[0] + '" aria-pressed="' + on + '" title="' + esc(f[2]) + '">' +
        '<span class="ar__n">' + n + '</span>' +
        '<span class="ar__b"><span class="ar__l"><span class="full">' + f[1] + '</span><span class="short">' + f[1] + '</span></span>' +
        '<span class="ar__m"><i style="--w:' + pc + '%"></i></span></span>' +
        '<span class="ar__p">' + pc + '%</span></button>';
    }).join('');
  }


  /* ── the row ────────────────────────────────────────────────────────────
     Two-line cells are the row's grammar: subject on top, qualifier under it.
     Created, Follow-up and Activity adopt it as well, which is what lets them
     carry 14px type inside their tracks without truncating.                */
  function row(l) {
    var open = S.cur === l.id;
    return '<div class="row' + (S.sel[l.id] ? ' sel' : '') + (open ? ' open' : '') + '" data-id="' + l.id + '" tabindex="0" aria-label="' + esc(l.name) + ' #' + l.id + '">' +

      '<input class="ck" type="checkbox" data-sel="' + l.id + '"' + (S.sel[l.id] ? ' checked' : '') + ' aria-label="Select lead ' + esc(l.name) + '">' +

      '<div class="ld"><span class="ld__n"><a href="single-lead-gen11.html?id=' + l.id + '" data-stop title="Open lead #' + l.id + '">' + esc(l.name) + '</a></span>' +
        '<span class="ld__id">#' + l.id + (l.newMail ? ' · <span class="ld__nm">new mail</span>' : '') + '</span></div>' +

      '<div class="ct" title="' + esc(l.email + (l.phone ? ' · ' + l.phone : '')) + '"><span class="ct__e">' + esc(l.email) + '</span>' +
        '<span class="ct__p' + (l.phone ? '' : ' none') + '">' + (l.phone ? esc(l.phone) : 'no phone') + '</span></div>' +

      (l.car
        ? '<div class="vh" title="' + esc(l.car) + (l.stock ? ' · stock ' + esc(l.stock) : '') + '"><span class="vh__n">' + esc(l.car) + '</span>' + (l.stock ? '<span class="vh__s">' + esc(l.stock) + '</span>' : '') + '</div>'
        : '<div class="vh vh--none"><span class="vh__n">no vehicle</span></div>') +

      '<div class="ty" title="Lead type ' + esc(l.type) + '">' + esc(l.type) + '</div>' +

      '<div class="sc" title="Source ' + esc(l.src) + '">' + esc(l.src).replace(' · ', ' <em>·</em> ') + '</div>' +

      '<div class="st"><span class="stat stat--' + (STCLS[l.status] || 'quiet') + '">' + esc(l.status) + '</span></div>' +

      '<div class="as' + (l.unassigned ? ' as--none' : '') + '" title="Assigned to ' + esc(l.rep) + '">' + esc(l.rep) + '</div>' +

      '<div class="cr" title="Created ' + fdate(l.created) + ' ' + ftime(l.created) + '"><b>' + fdate(l.created) + '</b><span>' + ftime(l.created) + '</span></div>' +

      (l.follow
        ? '<div class="fu' + (l.pastDue ? ' fu--due' : '') + '"><b>' + fd(l.follow) + '</b>' + (l.pastDue ? '<span class="fu__due">' + ic('i-alert') + 'past due</span>' : '') + '</div>'
        : '<div class="fu fu--none"><b>no follow-up</b></div>') +

      (l.act
        ? '<div class="ac" title="' + esc(l.act.k) + ' · ' + fd(l.act.d) + '"><b>' + esc(l.act.k) + '</b><span>' + fd(l.act.d) + '</span></div>'
        : '<div class="ac ac--none"><b>no activity</b></div>') +

      '</div>';
  }


  /* ── regions ────────────────────────────────────────────────────────────
     `extra` is where a region declares its provenance, beside the title and
     before anything in it has been read (DESIGN.md §13).                   */
  function acc(key, title, summary, inner, extra) {
    var o = !!S.acc[key];
    return '<section class="acc' + (o ? ' acc--open' : '') + '" data-acc="' + key + '">' +
      '<h3><button class="acc__h" type="button" aria-expanded="' + o + '" aria-controls="acc-' + key + '">' +
      '<span class="acc__t">' + title + '</span>' + (extra || '') +
      '<span class="acc__s">' + summary + '</span>' + ic('i-chev') + '</button></h3>' +
      '<div class="acc__p" id="acc-' + key + '"' + (o ? '' : ' inert') + '><div><div class="acc__in">' + inner + '</div></div></div></section>';
  }
  function setAccOpen(sec, open) {
    sec.classList.toggle('acc--open', open);
    var b = $('.acc__h', sec), p = $('.acc__p', sec);
    if (b) b.setAttribute('aria-expanded', open);
    if (p) { if (open) p.removeAttribute('inert'); else p.setAttribute('inert', ''); }
  }

  /* ── the lead workspace ─────────────────────────────────────────────────
     An object header — the buyer's message, then identity, figures and actions
     — and then the five regions across the full width beneath it (§9).     */
  function sheet(l) {
    var fld = function (k, v) { return '<div><span>' + k + '</span>' + (v ? '<b>' + esc(v) + '</b>' : '<b class="none">not recorded</b>') + '</div>'; };

    /* the object: the buyer's own words, verbatim, on the focal material */
    var msg = '<div class="lsheet__msg"><span class="caps">The buyer\'s message</span>' +
      '<p>' + esc(l.msg) + '</p>' +
      '<span class="via">via ' + esc(l.src) + ' · ' + esc(l.type) + ' · created ' + fd(l.d) + '</span></div>';

    /* identity */
    var meta = '<div class="veh__m"><span class="idtag">#' + l.id + '</span><span class="mono">' + esc(l.email) + '</span>' +
      '<span class="stat stat--' + (STCLS[l.status] || 'quiet') + '">' + esc(l.status) + '</span>' +
      (l.newMail ? '<span class="lock" title="Unread reply from the buyer">' + ic('i-bell') + '</span>' : '') + '</div>';
    var tags = '<div class="veh__tags">' + FLAGS.filter(function (f) { return f[4](l); })
      .map(function (f) { return '<span class="tag tag--' + f[3] + '">' + f[1] + '</span>'; }).join('') + '</div>';

    /* figures */
    var kv = '<div class="veh__kv">' +
      '<div><div class="v' + (l.pastDue ? ' warn' : '') + '">' + (l.follow ? fd(l.follow).slice(0, 5) : '—') + '</div><div class="l">follow-up</div></div>' +
      '<div><div class="v">' + l.emails + '</div><div class="l">emails</div></div>' +
      '<div><div class="v">' + l.notes + '</div><div class="l">notes</div></div></div>';

    /* actions — sized by their label, the primary first */
    var acts = '<div class="veh__acts">' +
      '<a class="btn btn--primary" href="single-lead-gen11.html?id=' + l.id + '">' + ic('i-ext') + '<span>Open lead</span></a>' +
      '<button class="btn btn--sheet" type="button">' + ic('i-rss') + '<span>Email</span></button>' +
      '<button class="btn btn--sheet" type="button">' + ic('i-edit') + '<span>Note</span></button>' +
      '<button class="btn btn--sheet" type="button">' + ic('i-file') + '<span>Assign…</span></button>' +
      '<button class="btn btn--sheet" type="button">' + ic('i-tag') + '<span>Status…</span></button></div>';

    /* region 1 — vehicle of interest */
    var vcard = l.car
      ? '<div class="vcard"><span class="none" title="No photograph on this lead">' + ic('i-cam-off') + '</span>' +
        '<div><b>' + esc(l.car) + '</b><span class="m">' + (l.stock ? 'Stock ' + esc(l.stock) : 'no stock number') + '</span>' +
        '<div class="acts2"><button class="btn btn--sheet btn--sm" type="button">Open in Inventory</button>' +
        '<button class="btn btn--quiet btn--sm" type="button">Change vehicle…</button>' +
        '<button class="btn btn--quiet btn--sm" type="button">Remove vehicle</button></div></div></div>'
      : '<div class="hint">No vehicle of interest on this lead. <button class="btn btn--sheet btn--sm" type="button">Search Inventory</button></div>';

    /* region 2 — contact & address */
    var cf = '<div class="cf">' + fld('Email', l.email) + fld('Day phone', l.phone) + fld('City', l.city) +
      fld('Best time to call', null) + fld('Provider', l.provider) + fld('Lead type', l.type) + '</div>';

    /* region 3 — activity. Both entries come off the record. */
    var tl = '<div class="tl">' +
      (l.act ? '<div><i>' + ic('i-check') + '</i><div><b>' + esc(l.act.k) + '</b><span>by ' + (l.unassigned ? 'Chicago Motor Cars' : esc(l.rep)) + '</span></div><em>' + fd(l.act.d) + '</em></div>' : '') +
      '<div><i>' + ic('i-plus') + '</i><div><b>Lead created</b><span>' + esc(l.src) + ' · ' + esc(l.type) + '</span></div><em>' + fd(l.d) + '</em></div>' +
      '</div><div class="note"><input class="fld" type="text" placeholder="Add a note…" aria-label="Add a note"><button class="btn btn--sheet" type="button">Add Note</button></div>';

    /* region 4 — emails. The count is on the record; the thread is not, so the
       region says so beside its title before the list is read. */
    var em = l.emails
      ? '<p class="prov"><b>' + l.emails + ' emails on this lead</b> · thread not connected in this view</p><div class="tl">' +
        Array.apply(null, Array(Math.min(l.emails, 3))).map(function (_, i) {
          return '<div><i>' + ic('i-rss') + '</i><div><b>' + (i % 2 ? 'Re: ' : '') + esc(l.car || 'Your enquiry') + '</b>' +
            '<span>' + (i % 2 ? 'from ' + esc(l.name) : 'to ' + esc(l.name)) + '</span></div><em>' + fd(l.d) + '</em></div>';
        }).join('') + '</div>'
      : '<div class="hint">No emails on this lead yet.</div>';

    /* region 5 — trade-in. `type` is the export's; the submitted detail is not
       in this record, so it is shown as what it is rather than invented. */
    var isTrade = /tradein|consignment/.test(l.type);
    var trade = isTrade
      ? '<p class="prov"><b>Kind · ' + (l.type === 'consignment' ? 'Consignment' : 'Trade-in') + '</b> · the submitted detail is on the full lead record</p>' +
        '<div class="cf">' + fld('Vehicle', null) + fld('Mileage', null) + fld('Estimated payoff', null) + '</div>'
      : '<div class="hint">No trade-in or consignment on this lead.</div>';

    var accs =
      acc('vehicle',  'Vehicle of interest',        l.car ? esc(l.car) : 'none', vcard) +
      acc('contact',  'Contact &amp; address',      esc(l.city), cf) +
      acc('activity', 'Activity',                   (l.act ? 2 : 1) + ' entries', tl) +
      acc('emails',   'Emails',                     l.emails ? l.emails + ' emails' : 'none', em, l.emails ? '<span class="demo">Demo</span>' : '') +
      acc('trade',    'Trade-in / Consignment',     isTrade ? (l.type === 'consignment' ? 'consignment' : 'trade-in') : 'none', trade);

    return '<div class="exp__l">' + msg + '</div>' +
      '<div class="exp__r"><div class="exp__top"><div><h3 class="veh__n">' + esc(l.name) + '</h3>' + meta + tags + '</div>' +
      '<button class="exp__x" type="button" data-act="close-lead" aria-label="Close lead">' + ic('i-x') + '</button></div>' +
      kv + acts + '</div>' +
      '<div class="exp__accs">' + accs + '</div>';
  }


  /* ── sticky geometry, read from the one place that declares it ───────────
     CSS publishes; JS reads. `--stick-total` is a calc() and comes back as
     literal text, so the three plain values are summed (DESIGN.md §7).     */
  var CSSV = getComputedStyle(document.documentElement);
  function cssPx(n, f) { var v = parseFloat(CSSV.getPropertyValue(n)); return isNaN(v) ? f : v; }
  function stickTotal() { return cssPx('--stick-bar', 68) + cssPx('--stick-cmd', 72) + cssPx('--stick-hd', 52); }
  function reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ── the anchor ─────────────────────────────────────────────────────────
     The selected lead comes to rest at a named position under the sticky
     stack: stack + --anchor-gap. Near the end of the list there is not enough
     page left to scroll, so #exp-space lends the document exactly the
     shortfall. It measures 0 almost always and is still load-bearing.      */
  function anchorRow(id) {
    var r = $('.row[data-id="' + id + '"]'); if (!r) return;
    var y = Math.max(0, Math.round(r.getBoundingClientRect().top + window.scrollY - stickTotal() - cssPx('--anchor-gap', 10)));
    var sp = $('#exp-space');
    if (sp) {
      sp.style.height = '0px';
      var need = y - (document.documentElement.scrollHeight - window.innerHeight);
      sp.style.height = need > 0 ? Math.ceil(need) + 'px' : '0px';
    }
    window.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }


  /* ── render ─────────────────────────────────────────────────────────── */
  function render() {
    var L = list();

    $('#tb').innerHTML = L.length
      ? L.map(function (l) {
          return row(l) + (S.cur === l.id ? '<div class="exp" id="exp"><div><div class="exp__in">' + sheet(l) + '</div></div></div>' : '');
        }).join('') + (S.cur ? '<div class="exp-space" id="exp-space"></div>' : '')
      : '<div class="empty">No leads match these filters.<button type="button" data-act="clear-all">Clear all</button></div>';

    /* reading offsetWidth commits the inserted node before the state class
       lands, so the disclosure actually plays instead of being skipped */
    var ex = $('#exp'); if (ex) { void ex.offsetWidth; ex.classList.add('exp--open'); }
    $('.field').classList.toggle('has-open', !!S.cur);

    /* scope line and its removable chips */
    var chips = [];
    var ch = function (k, v, cls) {
      if (S[k] !== 'Any' && S[k] !== 'any') chips.push({ v: v || S[k], cls: cls, off: function () { S[k] = k === 'created' ? 'any' : 'Any'; } });
    };
    ch('status'); ch('rep'); ch('source'); ch('provider'); ch('type');
    ch('created', { today: 'Today', '7': 'Last 7 days', '30': 'Last 30 days' }[S.created]);
    if (S.flag) chips.push({ v: FLAGS.filter(function (f) { return f[0] === S.flag; })[0][1], cls: 'chip--attn', off: function () { S.flag = null; } });
    if (S.q) chips.push({ v: '“' + S.q + '”', off: function () { S.q = ''; $('#q').value = ''; } });

    var totalN = S.lane === 'search' && !chips.length ? T.all : L.length;
    $('#scope').innerHTML = '<span class="scope__n">' + LANE_NAME[S.lane] + '</span><span>·</span><span><b>' + nf(totalN) + '</b> leads</span>' +
      (chips.length
        ? chips.map(function (c, i) { return '<span class="chip ' + (c.cls || '') + '">' + esc(c.v) + '<button class="chip__x" type="button" data-chip="' + i + '" aria-label="Remove ' + esc(c.v) + '">' + ic('i-x') + '</button></span>'; }).join('') +
          '<button class="scope__clear" type="button" data-act="clear-all">Clear all</button>'
        : '');
    $('#scope')._chips = chips;
    $('#sub-shown').textContent = S.sort === 'created' && S.dir === 'desc' ? 'newest first' : '';
    $('#head-ctx').textContent = nf(totalN) + ' leads · newest first · Dealer #' + T.dealerId;

    /* footer and pagination — 70 per page */
    var pages = S.lane === 'search' && !chips.length ? T.pages : Math.max(1, Math.ceil(L.length / T.perPage));
    var from = L.length ? (S.page - 1) * T.perPage + 1 : 0;
    var to = Math.min(from + L.length - 1, S.page * T.perPage);
    $('#shown').textContent = 'Showing ' + nf(from) + '–' + nf(to) + ' of ' + nf(totalN);
    $('#pg').innerHTML = pager(S.page, pages);

    /* facet values and engaged states */
    $('#status-v').textContent = S.status === 'Any' ? 'any' : S.status;
    $('#rep-v').textContent = S.rep === 'Any' ? 'any' : S.rep;
    $('#source-v').textContent = S.source === 'Any' ? 'any' : S.source;
    $('#provider-v').textContent = S.provider === 'Any' ? 'any' : S.provider;
    $('#type-v').textContent = S.type === 'Any' ? 'any' : S.type;
    $('#created-v').textContent = { any: 'any time', today: 'today', '7': 'last 7 days', '30': 'last 30 days' }[S.created];
    ['status', 'rep', 'source', 'provider', 'type'].forEach(function (k) {
      $$('#p-' + k + ' .mn__it').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset[k] === S[k]); });
      $('[data-pop="p-' + k + '"]').classList.toggle('facet__b--on', S[k] !== 'Any');
    });
    $('[data-pop="p-created"]').classList.toggle('facet__b--on', S.created !== 'any');

    /* sort: the band's value, the menu's ticks, and the header's arrow */
    $('#sort-v').textContent = ({ created: S.dir === 'desc' ? 'Newest first' : 'Oldest first', name: 'Lead', status: 'Status', rep: 'Assigned', follow: 'Follow-up' })[S.sort] +
      (S.sort === 'created' ? '' : S.dir === 'asc' ? ' ↑' : ' ↓');
    $$('.hd .s').forEach(function (h) {
      var on = h.dataset.sort === S.sort;
      h.classList.toggle('on', on);
      var i = $('.i', h); if (i) i.remove();
      if (on) h.insertAdjacentHTML('beforeend', ' ' + ic(S.dir === 'asc' ? 'i-up' : 'i-dn'));
    });
    $$('#p-sort [data-sort]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.sort === S.sort); });
    $$('#p-sort [data-dir]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.dir === S.dir); });

    /* selection tray, flags, status rows */
    var n = Object.keys(S.sel).length;
    $('#tray-n').textContent = n;
    $('#tray').classList.toggle('tray--on', n > 0);
    $$('.ar').forEach(function (b) { var on = b.dataset.flag === S.flag; b.classList.toggle('ar--on', on); b.setAttribute('aria-pressed', on); });
    $$('.agerow').forEach(function (b) { var on = b.dataset.status === S.status; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  }

  function pager(p, n) {
    var seq = [], push = function (i) { if (seq.indexOf(i) < 0) seq.push(i); };
    push(1); push(2); push(3);
    for (var i = p - 1; i <= p + 1; i++) if (i > 0 && i <= n) push(i);
    push(n);
    seq = seq.filter(function (i) { return i >= 1 && i <= n; }).sort(function (a, b) { return a - b; });
    var h = '<button type="button" data-page="' + (p - 1) + '" aria-label="Previous page"' + (p <= 1 ? ' disabled' : '') + '>‹</button>', last = 0;
    seq.forEach(function (i) {
      if (i - last > 1) h += '<span>…</span>';
      h += '<button type="button" data-page="' + i + '"' + (i === p ? ' class="on" aria-current="page"' : '') + '>' + i + '</button>';
      last = i;
    });
    return h + '<button type="button" data-page="' + (p + 1) + '" aria-label="Next page"' + (p >= n ? ' disabled' : '') + '>›</button>';
  }

  function countTo(el, to) {
    var from = parseInt(String(el.textContent).replace(/[^0-9]/g, ''), 10) || 0;
    if (from === to || reducedMotion()) { el.textContent = nf(to); return; }
    if (el._raf) cancelAnimationFrame(el._raf);
    var t0 = performance.now(), dur = 700;
    var step = function (t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = nf(Math.round(from + (to - from) * e));
      if (p < 1) el._raf = requestAnimationFrame(step); else el._raf = null;
    };
    el._raf = requestAnimationFrame(step);
  }


  /* ── open and close ─────────────────────────────────────────────────────
     Switching leads is an ordinary open of another row. Closing does nothing
     to the scroll position: someone who opens at 1600, scrolls down to read,
     then closes must not be thrown back to where they started.             */
  function showLead(id) {
    if (S.cur === id) { closeLead(); return; }
    S.cur = id;
    render();
    anchorRow(id);
  }
  function closeLead() { S.cur = null; render(); }


  /* ── platform chrome ────────────────────────────────────────────────── */
  function closeMenus(except) {
    $$('.nav__it--open').forEach(function (it) {
      if (it !== except) { it.classList.remove('nav__it--open'); var b = $('[data-menu]', it); if (b) b.setAttribute('aria-expanded', 'false'); }
    });
  }
  function closePops() { $$('.pop--open').forEach(function (p) { p.classList.remove('pop--open'); }); }

  /* Dark is gated off for Gen 11 while its palette is re-solved (DESIGN.md §5).
     The `aan-theme` key is shared with the Gen 10 pages, so a stored `dark`
     must not be able to reach this page. Temporary. */
  var DARK_ENABLED = false;
  function setTheme(t, keep) {
    if (t === 'dark' && !DARK_ENABLED) t = 'light';
    document.documentElement.setAttribute('data-theme', t);
    if (keep) try { localStorage.setItem('aan-theme', t); } catch (e) {}
    var btn = $('[data-act="theme"]');
    if (btn) btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }


  /* ── events ─────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var t = e.target, el;

    if ((el = t.closest('[data-menu]'))) {
      var it = el.closest('.nav__it'), open = !it.classList.contains('nav__it--open');
      closeMenus(it); it.classList.toggle('nav__it--open', open); el.setAttribute('aria-expanded', open); return;
    }
    if (!t.closest('.nav__it')) closeMenus();

    if ((el = t.closest('[data-pop]'))) {
      var p = $('#' + el.dataset.pop), wasOpen = p && p.classList.contains('pop--open');
      closePops(); if (p && !wasOpen) p.classList.add('pop--open'); return;
    }
    if (!t.closest('.pop')) closePops();

    if ((el = t.closest('[data-act="theme"]'))) { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); return; }

    if ((el = t.closest('[data-sort]'))) {
      var s = el.dataset.sort;
      if (el.classList.contains('mn__it')) { S.sort = s; }
      else if (S.sort === s) { S.dir = S.dir === 'asc' ? 'desc' : 'asc'; }
      else { S.sort = s; S.dir = (s === 'created' || s === 'follow') ? 'desc' : 'asc'; }
      closePops(); render(); return;
    }
    if ((el = t.closest('[data-dir]'))) { S.dir = el.dataset.dir; closePops(); render(); return; }
    if ((el = t.closest('[data-lane]'))) { S.lane = el.dataset.lane; S.page = 1; renderBoard(); render(); return; }
    if ((el = t.closest('[data-status]'))) { S.status = (S.status === el.dataset.status && el.classList.contains('agerow')) ? 'Any' : el.dataset.status; closePops(); render(); return; }
    if ((el = t.closest('[data-act="clear-status"]'))) { e.preventDefault(); S.status = 'Any'; render(); return; }
    if ((el = t.closest('[data-rep]'))) { S.rep = el.dataset.rep; closePops(); render(); return; }
    if ((el = t.closest('[data-source]'))) { S.source = el.dataset.source; closePops(); render(); return; }
    if ((el = t.closest('[data-provider]'))) { S.provider = el.dataset.provider; closePops(); render(); return; }
    if ((el = t.closest('[data-type]'))) { S.type = el.dataset.type; closePops(); render(); return; }
    if ((el = t.closest('[data-created]'))) { S.created = el.dataset.created; closePops(); render(); return; }
    if ((el = t.closest('[data-flag]'))) { S.flag = S.flag === el.dataset.flag ? null : el.dataset.flag; closePops(); render(); return; }

    if ((el = t.closest('[data-page]'))) {
      var pg = +el.dataset.page;
      if (pg >= 1 && !el.disabled) {
        S.page = pg; render();
        window.scrollTo({ top: Math.max(0, Math.round($('.field').getBoundingClientRect().top + window.scrollY - cssPx('--stick-bar', 68))), behavior: reducedMotion() ? 'auto' : 'smooth' });
      }
      return;
    }

    if ((el = t.closest('[data-act="thirdparty"]'))) { S.thirdParty = !S.thirdParty; el.setAttribute('aria-pressed', S.thirdParty); $('#tp-v').textContent = S.thirdParty ? 'On' : 'Off'; return; }
    if ((el = t.closest('[data-act="archived"]'))) { S.archived = !S.archived; el.setAttribute('aria-pressed', S.archived); $('#ar-v').textContent = S.archived ? 'Shown' : 'Hidden'; return; }

    if ((el = t.closest('[data-assign]'))) {
      Object.keys(S.sel).forEach(function (id) {
        var l = V.filter(function (x) { return x.id === +id; })[0];
        if (l) { l.rep = el.dataset.assign; l.unassigned = false; }
      });
      S.sel = {}; closePops(); renderBoard(); render(); return;
    }
    if ((el = t.closest('[data-act="unassign"]'))) {
      Object.keys(S.sel).forEach(function (id) {
        var l = V.filter(function (x) { return x.id === +id; })[0];
        if (l) { l.rep = 'Unassigned'; l.unassigned = true; }
      });
      S.sel = {}; renderBoard(); render(); return;
    }
    if ((el = t.closest('[data-act="close-lead"]'))) { closeLead(); return; }
    if ((el = t.closest('[data-act="clear-all"]'))) {
      S.q = ''; $('#q').value = '';
      S.status = S.rep = S.source = S.provider = S.type = 'Any';
      S.created = 'any'; S.flag = null; S.lane = 'search'; S.page = 1;
      renderBoard(); render(); return;
    }
    if ((el = t.closest('[data-act="clear-sel"]'))) { S.sel = {}; render(); return; }
    if ((el = t.closest('[data-chip]'))) { $('#scope')._chips[+el.dataset.chip].off(); render(); return; }

    if ((el = t.closest('.acc__h'))) {
      var sec = el.closest('.acc');
      S.acc[sec.dataset.acc] = !sec.classList.contains('acc--open');
      setAccOpen(sec, S.acc[sec.dataset.acc]); return;
    }

    if (t.closest('[data-stop]') || t.closest('.exp')) return;
    if (t.closest('a[href="#"]')) { e.preventDefault(); return; }
    if (t.closest('a')) return;
    if ((el = t.closest('.row'))) { if (t.classList.contains('ck')) return; showLead(+el.dataset.id); return; }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-sel]')) { if (t.checked) S.sel[t.dataset.sel] = true; else delete S.sel[t.dataset.sel]; render(); }
  });

  $('#q').addEventListener('input', function (e) { S.q = e.target.value; S.page = 1; render(); });

  document.addEventListener('keydown', function (e) {
    var a = document.activeElement;
    if (e.key === '/' && a !== $('#q') && !/INPUT|TEXTAREA|SELECT/.test(a.tagName)) { e.preventDefault(); $('#q').focus(); return; }
    if (e.key === 'Escape') {
      if ($('.nav__it--open') || $('.pop--open')) { closeMenus(); closePops(); }
      else if (S.cur) closeLead();
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && a && a.classList && a.classList.contains('row')) { e.preventDefault(); showLead(+a.dataset.id); }
  });


  /* ── engaged sticky state ───────────────────────────────────────────────
     Published in three places by one handler: `.cmd--stuck`, `.hd--stuck` and
     `#app.is-stuck`. The last is needed because the platform bar is a *sibling*
     of the field and cannot see the command band in the selector tree, so it
     could not otherwise square the two corners the band parks against.

     There is no fourth branch. Gen 10 had one — it toggled `hd--veil` whenever
     an expansion overlapped the header band, which took the column header to
     opacity 0 for roughly 400px of scrolling. The header is a landmark and it
     never disappears here; the layer ladder carries content under it instead. */
  (function () {
    var cmd = $('.cmd'); if (!cmd) return;
    var hd = $('.hd'), app = $('#app');
    var stuck = null, hdStuck = null, cmdTop, hdTop;
    function readStack() { cmdTop = cssPx('--stick-bar', 68); hdTop = cmdTop + cssPx('--stick-cmd', 72); }
    function onScroll() {
      var s = window.scrollY > 0 && cmd.getBoundingClientRect().top <= cmdTop + 0.5;
      if (s !== stuck) { stuck = s; cmd.classList.toggle('cmd--stuck', s); app.classList.toggle('is-stuck', s); }
      if (hd) {
        var h = window.scrollY > 0 && hd.getBoundingClientRect().top <= hdTop + 0.5;
        if (h !== hdStuck) { hdStuck = h; hd.classList.toggle('hd--stuck', h); }
      }
    }
    readStack();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { readStack(); onScroll(); });
    onScroll();
  })();


  /* ── boot ───────────────────────────────────────────────────────────── */
  setTheme(document.documentElement.getAttribute('data-theme') || 'light', false);
  $('#scope-n').textContent = '0';
  renderBoard();
  render();

  /* review states via hash: #lead=16994 · #open=contact,activity · #lane=pastdue */
  (function fromHash() {
    var parts = location.hash.slice(1).split('&').filter(Boolean), P = {};
    parts.forEach(function (p) { var kv = p.split('='); P[kv[0]] = decodeURIComponent(kv[1] || ''); });
    if (P.open) P.open.split(',').forEach(function (x) { if (x in S.acc) S.acc[x] = true; });
    if (P.close) P.close.split(',').forEach(function (x) { if (x in S.acc) S.acc[x] = false; });
    if (P.lane && LANE_NAME[P.lane]) { S.lane = P.lane; renderBoard(); }
    if (P.status) S.status = P.status;
    if (P.flag) S.flag = P.flag;
    if (P.open || P.close || P.status || P.flag) render();
    if (P.lead) { var l = V.filter(function (x) { return String(x.id) === P.lead; })[0]; if (l) showLead(l.id); }
  })();

  window.LDdemo = { showLead: showLead, closeLead: closeLead, anchorRow: anchorRow, stickTotal: stickTotal, S: S, V: V };
})();
