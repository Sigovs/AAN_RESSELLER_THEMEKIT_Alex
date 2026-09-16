/* All leads — Gen 10. The Lead Desk's own elements (lanes, filters, the eleven columns, selection bar, 70-per-page
   pagination) in the Gen 10 composition: bento on top, search-first sticky band, sticky column header, page scroll,
   a lead opens inline as an accordion sheet with the dossier's overview. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var nf = function (n) { return Number(n).toLocaleString('en-US'); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (id) { return '<svg class="i"><use href="#' + id + '"/></svg>'; };
  var D = window.LD, T = D.totals, V = D.leads;
  var TODAY = '2026-09-09';
  var STCLS = { 'New Lead': 'new', 'Active Prospect': 'active', 'Hot': 'hot', 'Pending': 'pend', 'Sale Pending': 'pend', 'Trade Appraisal': 'trade', 'Long Term Lead': 'quiet', 'Just Looking': 'quiet', 'Bought Here': 'won', 'Service': 'quiet', 'Storage': 'quiet', 'Galleria': 'quiet', 'Looking': 'quiet', 'Unassigned': 'quiet' };
  var STTONE = { 'New Lead': 'var(--brand)', 'Active Prospect': 'var(--ok)', 'Hot': 'var(--danger-fill)', 'Pending': 'var(--violet-fill)', 'Sale Pending': 'var(--violet-fill)', 'Trade Appraisal': 'var(--signal-fill)', 'Long Term Lead': 'var(--slate-fill)', 'Just Looking': 'var(--slate-fill)', 'Bought Here': '#2fbf7a' };

  V.forEach(function (l) { l.d = l.created.slice(0, 10); l.isToday = l.d === TODAY; l.hasCar = !!l.car; l.unassigned = l.rep === 'Unassigned'; });

  var S = { q: '', lane: 'search', sort: 'created', dir: 'desc', status: 'Any', rep: 'Any', source: 'Any', provider: 'Any', type: 'Any', created: 'any', flag: null, page: 1, sel: {}, cur: null, expNow: false, thirdParty: false, archived: false,
            acc: { msg: true, vehicle: true, contact: false, activity: false, emails: false, trade: false } };

  var FLAGS = [
    ['pastdue', 'Past due', 'follow-up date passed', 'danger', function (l) { return l.pastDue; }],
    ['newmail', 'New mail', 'unread reply from the buyer', 'signal', function (l) { return l.newMail; }],
    ['unassigned', 'Unassigned', 'no sales rep yet', 'slate', function (l) { return l.unassigned; }],
    ['novehicle', 'No vehicle', 'no vehicle of interest', 'slate', function (l) { return !l.hasCar; }],
    ['today', 'Today', 'came in today', 'violet', function (l) { return l.isToday; }],
    ['tradein', 'Trade-in', 'trade-in or consignment lead', 'signal', function (l) { return /tradein|consignment/.test(l.type); }]
  ];

  /* ── list ── */
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
  function daysAgo(d) { return Math.round((new Date(TODAY) - new Date(d)) / 86400000); }
  function fdt(iso) { var d = new Date(iso); var p = function (n) { return (n < 10 ? '0' : '') + n; }; return p(d.getMonth() + 1) + '/' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()); }
  function fd(iso) { var p = iso.split('-'); return p[1] + '/' + p[2] + '/' + p[0]; }

  /* ── bento ── */
  function renderBento() {
    // lanes
    $('#ln-newmail').textContent = nf(T.newMail); $('#ln-today').textContent = nf(T.today); $('#ln-pastdue').textContent = nf(T.pastDue);
    $$('.lane').forEach(function (b) { var on = b.dataset.lane === S.lane; b.classList.toggle('lane--on', on); b.setAttribute('aria-pressed', on); });
    var laneN = { search: T.all, uncat: T.uncat, newmail: T.newMail, today: T.today, pastdue: T.pastDue }[S.lane];
    countTo($('#scope-n'), laneN);
    $('#scope-l').textContent = { search: 'All leads', uncat: 'Uncategorized', newmail: 'New Mail', today: 'Today', pastdue: 'Past Due' }[S.lane];
    $('#scope-of').textContent = S.lane === 'search' ? nf(T.uncat) + ' uncategorized' : 'of ' + nf(T.all) + ' leads';
    // status mix (this page)
    var counts = {}; V.forEach(function (l) { counts[l.status] = (counts[l.status] || 0) + 1; });
    var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 5); var max = counts[top[0]] || 1;
    $('#statusrows').innerHTML = top.map(function (st) { return '<button type="button" class="agerow' + (S.status === st ? ' on' : '') + '" data-status="' + esc(st) + '" aria-pressed="' + (S.status === st) + '"><span class="agerow__l">' + esc(st) + '</span><span class="agerow__m"><i style="--seg:' + (STTONE[st] || 'var(--slate-fill)') + ';width:' + Math.round(counts[st] / max * 100) + '%"></i></span><b>' + counts[st] + '</b><em>' + Math.round(counts[st] / V.length * 100) + '%</em></button>'; }).join('');
    // assigned (this page)
    var un = V.filter(function (l) { return l.unassigned; }).length, reps = {}; V.forEach(function (l) { if (!l.unassigned) reps[l.rep] = 1; });
    $('#assigned-kv').innerHTML = '<div><div class="v' + (un ? ' warn' : '') + '">' + un + '</div><div class="l">unassigned</div></div><div><div class="v">' + (V.length - un) + '</div><div class="l">assigned to ' + Object.keys(reps).length + ' reps</div></div><div><div class="v">' + D.reps.length + '</div><div class="l">sales reps · rotation</div></div>';
    // flags
    $('#attn-g').innerHTML = FLAGS.map(function (f) { var n = V.filter(f[4]).length, p = Math.round(n / V.length * 100); return '<button class="ar ar--' + f[3] + (S.flag === f[0] ? ' ar--on' : '') + '" type="button" data-flag="' + f[0] + '" aria-pressed="' + (S.flag === f[0]) + '" title="' + esc(f[2]) + '"><span class="ar__n">' + n + '</span><span class="ar__b"><span class="ar__l"><span class="full">' + f[1] + '</span><span class="short">' + f[1] + '</span></span><span class="ar__m"><i style="--w:' + p + '%"></i></span></span><span class="ar__p">' + p + '%</span></button>'; }).join('');
  }

  /* ── rows ── */
  function row(l) {
    var open = S.cur === l.id;
    return '<div class="row' + (S.sel[l.id] ? ' sel' : '') + (open ? ' open' : '') + '" data-id="' + l.id + '" tabindex="0" aria-label="' + esc(l.name) + ' #' + l.id + '">' +
      '<input class="ck" type="checkbox" data-sel="' + l.id + '"' + (S.sel[l.id] ? ' checked' : '') + ' aria-label="Select row ' + l.id + '">' +
      '<div class="ld"><span class="ld__n"><a href="single-lead-gen10.html?id=' + l.id + '" data-stop title="Open lead #' + l.id + '">' + esc(l.name) + '</a></span><span class="ld__id">#' + l.id + (l.newMail ? '<span class="nm">' + ic('i-bell') + 'new mail</span>' : '') + '</span></div>' +
      '<div class="ct" title="' + esc(l.email + (l.phone ? ' ' + l.phone : '')) + '"><span class="ct__e">' + esc(l.email) + '</span><span class="ct__p' + (l.phone ? '' : ' none') + '">' + (l.phone ? esc(l.phone) : 'no phone') + '</span></div>' +
      (l.car ? '<div class="vh" title="' + esc(l.car) + '"><span class="vh__n">' + esc(l.car) + '</span>' + (l.stock ? '<span class="vh__s">' + esc(l.stock) + '</span>' : '') + '</div>' : '<div class="vh vh--none"><span class="vh__n">—</span></div>') +
      '<div class="ty" title="' + esc(l.type) + '">' + esc(l.type) + '</div>' +
      '<div class="sc" title="' + esc(l.src) + '">' + esc(l.src).replace(' · ', ' <em>·</em> ') + '</div>' +
      '<div class="st"><span class="stat stat--' + (STCLS[l.status] || 'quiet') + '">' + esc(l.status) + '</span></div>' +
      '<div class="as' + (l.unassigned ? ' as--none' : '') + '" title="' + esc(l.rep) + '">' + esc(l.rep) + '</div>' +
      '<div class="cr">' + fdt(l.created) + '</div>' +
      (l.follow ? '<div class="fu' + (l.pastDue ? ' fu--due' : '') + '" title="' + (l.pastDue ? 'Follow-up past due' : 'Follow-up') + '">' + fd(l.follow) + (l.pastDue ? ic('i-alert') : '') + '</div>' : '<div class="fu fu--none">—</div>') +
      (l.act ? '<div class="ac" title="' + esc(l.act.k) + ' · ' + fd(l.act.d) + '"><b>' + esc(l.act.k) + '</b> · ' + fd(l.act.d) + '</div>' : '<div class="ac ac--none">—</div>') +
      '</div>';
  }

  /* ── inline lead sheet (the dossier's overview) ── */
  function acc(key, title, summary, inner, extra) {
    var o = !!S.acc[key];
    return '<section class="acc' + (o ? ' acc--open' : '') + '" data-acc="' + key + '"><h3><button class="acc__h" type="button" aria-expanded="' + o + '" aria-controls="acc-' + key + '"><span class="acc__t">' + title + '</span>' + (extra || '') + '<span class="acc__s">' + summary + '</span>' + ic('i-chev') + '</button></h3>' +
      '<div class="acc__p" id="acc-' + key + '"' + (o ? '' : ' inert') + '><div><div class="acc__in">' + inner + '</div></div></div></section>';
  }
  function setAccOpen(sec, open) { sec.classList.toggle('acc--open', open); var b = $('.acc__h', sec), p = $('.acc__p', sec); if (b) b.setAttribute('aria-expanded', open); if (p) { if (open) p.removeAttribute('inert'); else p.setAttribute('inert', ''); } }
  function sheet(l) {
    var msg = '<div class="lsheet__msg"><span class="caps">The buyer\'s message</span><p>' + esc(l.msg) + '</p><span class="via">via ' + esc(l.src) + ' · ' + esc(l.type) + ' · created ' + fd(l.d) + '</span></div>';
    var kv = '<div class="veh__kv"><div><div class="v' + (l.pastDue ? ' warn' : '') + '">' + (l.follow ? fd(l.follow).slice(0, 5) : '—') + '</div><div class="l">follow-up</div></div><div><div class="v">' + l.emails + '</div><div class="l">emails</div></div><div><div class="v">' + l.notes + '</div><div class="l">notes</div></div></div>';
    var acts = '<div class="veh__acts"><a class="btn btn--primary" href="single-lead-gen10.html?id=' + l.id + '">' + ic('i-ext') + '<span>Open lead</span></a>' +
      '<button class="btn btn--sheet" type="button">' + ic('i-rss') + '<span>Email</span></button><button class="btn btn--sheet" type="button">' + ic('i-edit') + '<span>Note</span></button>' +
      '<button class="btn btn--sheet" type="button">' + ic('i-file') + '<span>Assign…</span></button><button class="btn btn--sheet" type="button">' + ic('i-tag') + '<span>Status…</span></button></div>';
    var vcard = l.car ? '<div class="vcard"><div class="none">' + ic('i-cam') + '</div><div><b>' + esc(l.car) + '</b><span class="m">' + (l.stock ? 'Stock ' + esc(l.stock) : 'no stock number') + '</span><div class="acts2"><button class="btn btn--sheet btn--sm" type="button">Open in Inventory →</button><button class="btn btn--quiet btn--sm" type="button">Change vehicle…</button><button class="btn btn--quiet btn--sm" type="button">Remove vehicle</button></div></div></div>' : '<div class="hint">No vehicle of interest. <button class="btn btn--sheet btn--sm" type="button">Search Inventory</button></div>';
    var cf = '<div class="cf"><div><span>Email</span><b>' + esc(l.email) + '</b></div><div><span>Day phone</span><b>' + (l.phone ? esc(l.phone) : '—') + '</b></div><div><span>City</span><b>' + esc(l.city) + '</b></div><div><span>Best time to call</span><b>—</b></div><div><span>Provider</span><b>' + esc(l.provider) + '</b></div><div><span>Lead type</span><b>' + esc(l.type) + '</b></div></div>';
    var tl = '<div class="tl">' + (l.act ? '<div><i>' + ic('i-check') + '</i><div><b>' + esc(l.act.k) + '</b><span>by ' + (l.unassigned ? 'Chicago Motor Cars' : esc(l.rep)) + '</span></div><em>' + fd(l.act.d) + '</em></div>' : '') + '<div><i>' + ic('i-plus') + '</i><div><b>Lead created</b><span>' + esc(l.src) + ' · ' + esc(l.type) + '</span></div><em>' + fd(l.d) + '</em></div></div><div class="note"><input class="fld" type="text" placeholder="Add a note…" aria-label="Add a note"><button class="btn btn--sheet" type="button">Add Note</button></div>';
    var em = l.emails ? '<div class="tl">' + Array.apply(null, Array(Math.min(l.emails, 3))).map(function (_, i) { return '<div><i>' + ic('i-rss') + '</i><div><b>' + (i % 2 ? 'Re: ' : '') + esc(l.car || 'Your enquiry') + '</b><span>' + (i % 2 ? 'from ' + esc(l.name) : 'to ' + esc(l.name)) + '</span></div><em>' + fd(l.d) + '</em></div>'; }).join('') + '</div>' : '<div class="hint">No emails yet.</div>';
    var accs = acc('vehicle', 'Vehicle of interest', l.car ? esc(l.car) : 'none', vcard) +
      acc('contact', 'Contact &amp; address', esc(l.email), cf) +
      acc('activity', 'Activity', (l.act ? 2 : 1) + ' entries', tl) +
      acc('emails', 'Emails', l.emails ? l.emails + ' emails' : 'none', em) +
      acc('trade', 'Trade-in / Consignment', /tradein|consignment/.test(l.type) ? 'submitted' : 'none', /tradein|consignment/.test(l.type) ? '<div class="cf"><div><span>Kind</span><b>' + (l.type === 'consignment' ? 'Consignment' : 'Trade-in') + '</b></div><div><span>Vehicle</span><b>2019 BMW M4</b></div><div><span>Mileage</span><b>31,200</b></div><div><span>Estimated payoff</span><b>—</b></div></div>' : '<div class="hint">No trade-in on this lead.</div>');
    var meta = '<div class="veh__m"><span class="idtag">#' + l.id + '</span><span class="mono">' + esc(l.email) + '</span><span class="veh__st">' + esc(l.status) + '</span>' + (l.newMail ? '<span class="lock" title="New mail">' + ic('i-bell') + '</span>' : '') + '</div>';
    var tags = '<div class="veh__tags">' + FLAGS.filter(function (f) { return f[4](l); }).map(function (f) { return '<span class="tag tag--' + f[3] + '">' + f[1] + '</span>'; }).join('') + '</div>';
    return '<div class="exp__l">' + msg + kv + acts + '</div><div class="exp__r"><div class="exp__top"><div><h3 class="veh__n">' + esc(l.name) + '</h3>' + meta + tags + '</div><button class="exp__x" type="button" data-act="close-veh" aria-label="Close">' + ic('i-x') + '</button></div><div class="exp__accs">' + accs + '</div></div>';
  }

  /* ── render ── */
  function render() {
    var L = list();
    $('#tb').innerHTML = L.length ? L.map(function (l) { return row(l) + (S.cur === l.id ? '<div class="exp" id="exp"><div><div class="exp__in">' + sheet(l) + '</div></div></div>' : ''); }).join('') + (S.cur ? '<div class="exp-space" id="exp-space"></div>' : '') : '<div class="empty">No leads match these filters.<button type="button" data-act="clear-all">Clear all</button></div>';
    var ex = $('#exp'); if (ex) { if (S.expNow) ex.classList.add('exp--open'); else requestAnimationFrame(function () { requestAnimationFrame(function () { ex.classList.add('exp--open'); }); }); S.expNow = true; }
    $('.field').classList.toggle('has-open', !!S.cur);
    // scope + chips
    var chips = [];
    var ch = function (k, v, cls) { if (S[k] !== 'Any' && S[k] !== 'any') chips.push({ v: v || S[k], cls: cls, off: function () { S[k] = k === 'created' ? 'any' : 'Any'; } }); };
    ch('status'); ch('rep', null); ch('source'); ch('provider'); ch('type'); ch('created', { today: 'Today', '7': 'Last 7 days', '30': 'Last 30 days' }[S.created]);
    if (S.flag) chips.push({ v: FLAGS.filter(function (f) { return f[0] === S.flag; })[0][1], cls: 'chip--signal', off: function () { S.flag = null; } });
    if (S.q) chips.push({ v: '“' + S.q + '”', off: function () { S.q = ''; $('#q').value = ''; } });
    var laneName = { search: 'All leads', uncat: 'Uncategorized', newmail: 'New Mail', today: 'Today', pastdue: 'Past Due' }[S.lane];
    var totalN = S.lane === 'search' && !chips.length ? T.all : L.length;
    $('#scope').innerHTML = '<span class="scope__n">' + laneName + '</span><span>·</span><span><b>' + nf(totalN) + '</b> leads</span>' +
      (chips.length ? chips.map(function (c, i) { return '<span class="chip ' + (c.cls || '') + '">' + esc(c.v) + '<button class="chip__x" type="button" data-chip="' + i + '" aria-label="Remove">' + ic('i-x') + '</button></span>'; }).join('') + '<button class="scope__clear" type="button" data-act="clear-all">Clear all</button>' : '');
    $('#scope')._chips = chips;
    $('#sub-shown').textContent = 'newest first';
    $('#head-ctx').textContent = nf(totalN) + ' leads · newest first · Dealer #' + T.dealerId;
    // foot + pagination (70 per page)
    var pages = S.lane === 'search' && !chips.length ? T.pages : Math.max(1, Math.ceil(L.length / T.perPage));
    var from = L.length ? (S.page - 1) * T.perPage + 1 : 0, to = Math.min(from + L.length - 1, S.page * T.perPage);
    $('#shown').textContent = 'Showing ' + nf(from) + '–' + nf(to) + ' of ' + nf(totalN);
    $('#pg').innerHTML = pager(S.page, pages);
    // facets
    $('#status-v').textContent = S.status === 'Any' ? 'any' : S.status; $('#rep-v').textContent = S.rep === 'Any' ? 'any' : S.rep; $('#source-v').textContent = S.source === 'Any' ? 'any' : S.source; $('#provider-v').textContent = S.provider === 'Any' ? 'any' : S.provider; $('#type-v').textContent = S.type === 'Any' ? 'any' : S.type; $('#created-v').textContent = { any: 'any time', today: 'today', '7': 'last 7 days', '30': 'last 30 days' }[S.created];
    ['status', 'rep', 'source', 'provider', 'type'].forEach(function (k) { $$('#p-' + k + ' .mn__it').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset[k] === S[k]); }); $('[data-pop="p-' + k + '"]').classList.toggle('facet__b--on', S[k] !== 'Any'); });
    $('[data-pop="p-created"]').classList.toggle('facet__b--on', S.created !== 'any');
    $('#sort-v').textContent = ({ created: S.dir === 'desc' ? 'Newest first' : 'Oldest first', name: 'Lead', status: 'Status', rep: 'Assigned', follow: 'Follow-up' })[S.sort] + (S.sort === 'created' ? '' : S.dir === 'asc' ? ' ↑' : ' ↓');
    $$('.hd .s').forEach(function (h) { h.classList.toggle('on', h.dataset.sort === S.sort); var i = $('.i', h); if (i) i.remove(); if (h.dataset.sort === S.sort) h.insertAdjacentHTML('beforeend', ' ' + ic(S.dir === 'asc' ? 'i-up' : 'i-dn')); });
    $$('#p-sort [data-sort]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.sort === S.sort); }); $$('#p-sort [data-dir]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.dir === S.dir); });
    var n = Object.keys(S.sel).length; $('#tray-n').textContent = n; $('#tray').classList.toggle('tray--on', n > 0);
    $$('.ar').forEach(function (b) { b.classList.toggle('ar--on', b.dataset.flag === S.flag); b.setAttribute('aria-pressed', b.dataset.flag === S.flag); });
    $$('.agerow').forEach(function (b) { b.classList.toggle('on', b.dataset.status === S.status); b.setAttribute('aria-pressed', b.dataset.status === S.status); });
  }
  function pager(p, n) {
    var seq = [], push = function (i) { if (seq.indexOf(i) < 0) seq.push(i); };
    push(1); push(2); push(3); for (var i = p - 1; i <= p + 1; i++) if (i > 0 && i <= n) push(i); push(n);
    seq = seq.filter(function (i) { return i >= 1 && i <= n; }).sort(function (a, b) { return a - b; });
    var h = '<button type="button" data-page="' + (p - 1) + '" aria-label="Previous page"' + (p <= 1 ? ' disabled' : '') + '>‹</button>', last = 0;
    seq.forEach(function (i) { if (i - last > 1) h += '<span>…</span>'; h += '<button type="button" data-page="' + i + '"' + (i === p ? ' class="on" aria-current="page"' : '') + '>' + i + '</button>'; last = i; });
    return h + '<button type="button" data-page="' + (p + 1) + '" aria-label="Next page"' + (p >= n ? ' disabled' : '') + '>›</button>';
  }
  function countTo(el, to) {
    var from = parseInt(String(el.textContent).replace(/[^0-9]/g, ''), 10) || 0;
    if (from === to || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) { el.textContent = nf(to); return; }
    if (el._raf) cancelAnimationFrame(el._raf);
    var t0 = performance.now(), dur = 700;
    var step = function (t) { var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = nf(Math.round(from + (to - from) * e)); if (p < 1) el._raf = requestAnimationFrame(step); else el._raf = null; };
    el._raf = requestAnimationFrame(step);
  }

  /* ── inline open / close ── */
  function showLead(id) {
    if (S.cur === id) { closeLead(); return; }
    var ex = $('#exp'); S.cur = id; S.expNow = false;
    var go = function () { render(); var r = $('.row[data-id="' + id + '"]'); if (r) { var y = Math.max(0, r.getBoundingClientRect().top + window.scrollY - 56 - 58 - 48 - 10); var sp = $('#exp-space'); if (sp) { var need = y - (document.documentElement.scrollHeight - window.innerHeight); sp.style.height = need > 0 ? Math.ceil(need) + 'px' : '0px'; } window.scrollTo({ top: y, behavior: 'smooth' }); } };
    if (ex) { ex.classList.remove('exp--open'); setTimeout(go, 200); } else go();
  }
  function closeLead() { var ex = $('#exp'); S.cur = null; if (ex) { ex.classList.remove('exp--open'); setTimeout(render, 200); } else render(); }

  /* ── platform menus, theme, pops ── */
  function closeMenus(except) { $$('.nav__it--open').forEach(function (it) { if (it !== except) { it.classList.remove('nav__it--open'); var b = $('[data-menu]', it); if (b) b.setAttribute('aria-expanded', 'false'); } }); }
  function closePops() { $$('.pop--open').forEach(function (p) { p.classList.remove('pop--open'); }); }
  function setTheme(t, keep) { document.documentElement.setAttribute('data-theme', t); if (keep) try { localStorage.setItem('aan-theme', t); } catch (e) {} $('[data-act="theme"]').setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); }

  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-menu]'))) { var it = el.closest('.nav__it'), open = !it.classList.contains('nav__it--open'); closeMenus(it); it.classList.toggle('nav__it--open', open); el.setAttribute('aria-expanded', open); return; }
    if (!t.closest('.nav__it')) closeMenus();
    if ((el = t.closest('[data-pop]'))) { var p = $('#' + el.dataset.pop), wasOpen = p && p.classList.contains('pop--open'); closePops(); if (p && !wasOpen) p.classList.add('pop--open'); return; }
    if (!t.closest('.pop')) closePops();
    if ((el = t.closest('[data-act="theme"]'))) { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); return; }
    if ((el = t.closest('[data-sort]'))) { var s = el.dataset.sort; if (el.classList.contains('mn__it')) { S.sort = s; } else if (S.sort === s) { S.dir = S.dir === 'asc' ? 'desc' : 'asc'; } else { S.sort = s; S.dir = s === 'created' || s === 'follow' ? 'desc' : 'asc'; } closePops(); render(); return; }
    if ((el = t.closest('[data-dir]'))) { S.dir = el.dataset.dir; closePops(); render(); return; }
    if ((el = t.closest('[data-lane]'))) { S.lane = el.dataset.lane; S.page = 1; renderBento(); render(); return; }
    if ((el = t.closest('[data-status]'))) { S.status = S.status === el.dataset.status && el.classList.contains('agerow') ? 'Any' : el.dataset.status; closePops(); render(); return; }
    if ((el = t.closest('[data-act="clear-status"]'))) { e.preventDefault(); S.status = 'Any'; render(); return; }
    if ((el = t.closest('[data-rep]'))) { S.rep = el.dataset.rep; closePops(); render(); return; }
    if ((el = t.closest('[data-source]'))) { S.source = el.dataset.source; closePops(); render(); return; }
    if ((el = t.closest('[data-provider]'))) { S.provider = el.dataset.provider; closePops(); render(); return; }
    if ((el = t.closest('[data-type]'))) { S.type = el.dataset.type; closePops(); render(); return; }
    if ((el = t.closest('[data-created]'))) { S.created = el.dataset.created; closePops(); render(); return; }
    if ((el = t.closest('[data-flag]'))) { S.flag = S.flag === el.dataset.flag ? null : el.dataset.flag; closePops(); render(); return; }
    if ((el = t.closest('[data-page]'))) { var pg = +el.dataset.page; if (pg >= 1 && !el.disabled) { S.page = pg; render(); window.scrollTo({ top: $('.field').getBoundingClientRect().top + window.scrollY - 56, behavior: 'smooth' }); } return; }
    if ((el = t.closest('[data-act="thirdparty"]'))) { S.thirdParty = !S.thirdParty; el.setAttribute('aria-pressed', S.thirdParty); $('#tp-v').textContent = S.thirdParty ? 'on' : 'off'; return; }
    if ((el = t.closest('[data-act="archived"]'))) { S.archived = !S.archived; el.setAttribute('aria-pressed', S.archived); return; }
    if ((el = t.closest('[data-assign]'))) { Object.keys(S.sel).forEach(function (id) { var l = V.filter(function (x) { return x.id === +id; })[0]; if (l) { l.rep = el.dataset.assign; l.unassigned = false; } }); S.sel = {}; closePops(); renderBento(); render(); return; }
    if ((el = t.closest('[data-act="unassign"]'))) { Object.keys(S.sel).forEach(function (id) { var l = V.filter(function (x) { return x.id === +id; })[0]; if (l) { l.rep = 'Unassigned'; l.unassigned = true; } }); S.sel = {}; renderBento(); render(); return; }
    if ((el = t.closest('[data-act="close-veh"]'))) { closeLead(); return; }
    if ((el = t.closest('[data-act="clear-all"]'))) { S.q = ''; $('#q').value = ''; S.status = S.rep = S.source = S.provider = S.type = 'Any'; S.created = 'any'; S.flag = null; S.lane = 'search'; S.page = 1; renderBento(); render(); return; }
    if ((el = t.closest('[data-act="clear-sel"]'))) { S.sel = {}; render(); return; }
    if ((el = t.closest('[data-chip]'))) { $('#scope')._chips[+el.dataset.chip].off(); render(); return; }
    if ((el = t.closest('.acc__h'))) { var sec = el.closest('.acc'); S.acc[sec.dataset.acc] = !S.acc[sec.dataset.acc]; setAccOpen(sec, S.acc[sec.dataset.acc]); return; }
    if (t.closest('[data-stop]') || t.closest('.exp') || t.closest('a')) return;
    if ((el = t.closest('.row'))) { if (t.classList.contains('ck')) return; showLead(+el.dataset.id); return; }
  });
  document.addEventListener('change', function (e) { var t = e.target; if (t.matches('[data-sel]')) { if (t.checked) S.sel[t.dataset.sel] = true; else delete S.sel[t.dataset.sel]; render(); } });
  $('#q').addEventListener('input', function (e) { S.q = e.target.value; S.page = 1; render(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== $('#q') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); }
    if (e.key === 'Escape') { if ($('.nav__it--open') || $('.pop--open')) { closeMenus(); closePops(); } else if (S.cur) closeLead(); return; }
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement.classList && document.activeElement.classList.contains('row')) { e.preventDefault(); showLead(+document.activeElement.dataset.id); }
  });

  /* sticky band + column header */
  (function () {
    var cmd = $('.cmd'), hd = $('.hd'), stuck = null, hdStuck = null;
    function onScroll() {
      var s = window.scrollY > 0 && cmd.getBoundingClientRect().top <= 56.5; if (s !== stuck) { stuck = s; cmd.classList.toggle('cmd--stuck', s); }
      var h = window.scrollY > 0 && hd.getBoundingClientRect().top <= 114.5; if (h !== hdStuck) { hdStuck = h; hd.classList.toggle('hd--stuck', h); }
    }
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); onScroll();
  })();

  $('#scope-n').textContent = '0';
  renderBento(); render();
  window.LDdemo = { showLead: showLead, closeLead: closeLead, S: S, V: V };
})();
