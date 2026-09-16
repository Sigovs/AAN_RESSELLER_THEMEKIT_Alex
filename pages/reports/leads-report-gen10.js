/* Leads Report — Gen 10. Same behaviour vocabulary as All Vehicles Gen 10:
   bento on top (fleet · months · quality · attention queue as filters), search-first band that sticks under the
   platform bar, sticky column header, page scroll, a dealer opens inline as an accordion sheet under its row. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var nf = function (n) { return Number(n).toLocaleString('en-US'); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (id) { return '<svg class="i"><use href="#' + id + '"/></svg>'; };
  var pct = function (a, b) { return b ? Math.round(a / b * 100) : 0; };
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var D = window.LR, T = D.totals, V = D.dealers;

  /* derived flags */
  V.forEach(function (d) {
    d.dupr = d.total ? d.dup / d.total : 0;
    d.extr = d.total ? d.ext / d.total : 0;
    d.f = [];
    if (d.stale) d.f.push('Stale');
    if (d.total > 0 && d.dupr >= 0.4) d.f.push('Dup > 40%');
    if (d.total === 0) d.f.push('Zero-rate');
    if (!d.stale && !d.never && d.ago > 14) d.f.push('Quiet 14 d');
    if (d.extr >= 0.5) d.f.push('External-led');
    if (d.total > 0 && d.pace > 5) d.f.push('Slow pace');
  });
  var ATTN = [
    ['stale', 'Stale', 'newest lead beyond own pace', 'danger', function (d) { return d.stale; }],
    ['dup', 'Dup > 40%', 'duplicate rate over 40%', 'signal', function (d) { return d.total > 0 && d.dupr >= 0.4; }],
    ['quiet', 'Quiet 14 d', 'no lead in two weeks', 'signal', function (d) { return !d.stale && !d.never && d.ago > 14; }],
    ['zero', 'Zero-rate', 'no leads this year', 'slate', function (d) { return d.total === 0; }],
    ['ext', 'External-led', 'over half from third parties', 'violet', function (d) { return d.extr >= 0.5; }],
    ['slow', 'Slow pace', 'more than 5 days per lead', 'signal', function (d) { return d.total > 0 && d.pace > 5; }]
  ];
  var TONE = { 'Stale': 'danger', 'Dup > 40%': 'signal', 'Quiet 14 d': 'signal', 'Zero-rate': 'slate', 'External-led': 'violet', 'Slow pace': 'signal' };

  var S = { q: '', sort: 'total', dir: 'desc', attn: null, month: null, stale: false, site: 'any', year: '2026', cur: null, sel: {}, dock: null, expNow: false,
            acc: { months: true, quality: true, sources: false, leads: false, notes: false } };

  /* ── list ── */
  function list() {
    var q = S.q.trim().toLowerCase();
    var L = V.filter(function (d) {
      if (q && (d.name + ' ' + d.id + ' ' + d.city).toLowerCase().indexOf(q) < 0) return false;
      if (S.stale && !d.stale) return false;
      if (S.site !== 'any' && d.site !== S.site) return false;
      if (S.attn) { var a = ATTN.filter(function (x) { return x[0] === S.attn; })[0]; if (a && !a[4](d)) return false; }
      if (S.month != null && !(d.months[S.month] > 0)) return false;
      return true;
    });
    var s = S.sort, k = S.dir === 'asc' ? 1 : -1;
    L.sort(function (a, b) {
      var x, y;
      if (s === 'name') { x = a.name.toLowerCase(); y = b.name.toLowerCase(); return x < y ? -k : x > y ? k : 0; }
      if (s === 'total') { x = S.month != null ? a.months[S.month] : a.total; y = S.month != null ? b.months[S.month] : b.total; }
      else if (s === 'good') { x = a.good; y = b.good; }
      else if (s === 'dupr') { x = a.dupr; y = b.dupr; }
      else if (s === 'ext') { x = a.ext; y = b.ext; }
      else if (s === 'pace') { x = a.pace || 999; y = b.pace || 999; }
      else if (s === 'ago') { x = a.ago; y = b.ago; }
      else if (s === 'issues') { x = a.f.length * 1000 + (a.stale ? 500 : 0) + a.ago; y = b.f.length * 1000 + (b.stale ? 500 : 0) + b.ago; }
      return (x - y) * k || a.name.localeCompare(b.name);
    });
    return L;
  }

  /* ── bento ── */
  function renderBento() {
    // months: network totals per month, September partial
    var tot = new Array(12).fill(0); V.forEach(function (d) { d.months.forEach(function (n, i) { tot[i] += n; }); });
    var max = Math.max.apply(null, tot) || 1;
    $('#mbars').innerHTML = tot.map(function (n, i) {
      var future = i > 8;
      return '<button type="button" class="mbar' + (S.month === i ? ' mbar--on' : '') + (future ? ' mbar--future' : '') + '" data-month="' + i + '" data-n="' + nf(n) + '" title="' + MON[i] + ' · ' + nf(n) + ' leads"' + (future ? ' disabled' : '') + ' aria-pressed="' + (S.month === i) + '"><i style="--h:' + (future ? 3 : Math.max(4, Math.round(n / max * 100))) + '%"></i><b>' + MON[i][0] + '</b></button>';
    }).join('');
    // attention queue
    $('#attn-g').innerHTML = ATTN.map(function (a) {
      var n = V.filter(a[4]).length, p = pct(n, V.length);
      return '<button class="ar ar--' + a[3] + (S.attn === a[0] ? ' ar--on' : '') + '" type="button" data-attn="' + a[0] + '" aria-pressed="' + (S.attn === a[0]) + '" title="' + esc(a[2]) + '"><span class="ar__n">' + n + '</span><span class="ar__b"><span class="ar__l"><span class="full">' + a[1] + '</span><span class="short">' + a[1] + '</span></span><span class="ar__m"><i style="--w:' + p + '%"></i></span></span><span class="ar__p">' + p + '%</span></button>';
    }).join('');
    // hero follows the month
    var n = S.month == null ? T.total : tot[S.month];
    countTo($('#scope-n'), n);
    $('#scope-l').textContent = S.month == null ? '2026' : MON[S.month] + ' 2026';
    $('#scope-of').textContent = S.month == null ? 'Jan – Sep · year to date' : 'one month of ' + nf(T.total);
  }

  /* ── rows ── */
  function tag(t) { return '<span class="tag tag--' + (TONE[t] || 'signal') + '">' + esc(t) + '</span>'; }
  function initials(name) { return name.replace(/^www\./, '').replace(/\.(com|net)\b.*/i, '').split(/[\s\-–&.,]+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join(''); }
  function paceCol(p) { return p <= 1 ? 'var(--ok)' : p <= 3 ? 'var(--signal-fill)' : 'var(--danger-fill)'; }
  function agoText(d) {
    if (d.never) return d.ago > 365 ? (d.ago / 365).toFixed(1).replace(/\.0$/, '') + ' years ago · never flags' : Math.round(d.ago / 30) + ' months ago · never flags';
    return d.ago === 0 ? 'today' : d.ago === 1 ? 'yesterday' : d.ago + ' days ago' + (d.stale ? ' · past pace' : '');
  }
  function fdate(iso) { var p = iso.split('-'); return p[1] + '/' + p[2] + '/' + p[0]; }
  function row(d) {
    var total = S.month != null ? d.months[S.month] : d.total;
    var dupCls = d.total === 0 ? ' n--zero' : d.dupr >= 0.4 ? ' n--bad' : d.dupr >= 0.25 ? ' n--warn' : '';
    var tags = d.f.slice(0, 2), rest = d.f.length - tags.length;
    return '<div class="row' + (S.sel[d.id] ? ' sel' : '') + (S.cur === d.id ? ' open' : '') + '" data-id="' + d.id + '" tabindex="0" aria-label="' + esc(d.name) + '">' +
      '<input class="ck" type="checkbox" data-sel="' + d.id + '"' + (S.sel[d.id] ? ' checked' : '') + ' aria-label="Select ' + esc(d.name) + '">' +
      '<span class="mk">' + esc(initials(d.name)) + '</span>' +
      '<div class="dl"><span class="dl__n" title="' + esc(d.name) + '">' + esc(d.name) + '</span><span class="dl__m"><span class="id">#' + d.id + '</span><span>' + esc(d.city) + '</span><span>' + esc(d.site) + '</span></span></div>' +
      '<div class="n' + (total === 0 ? ' n--zero' : '') + '">' + nf(total) + (S.month != null ? '<small>of ' + nf(d.total) + '</small>' : '') + '</div>' +
      '<div class="n' + dupCls + '">' + nf(d.dup) + '<small>' + (d.total ? Math.round(d.dupr * 100) + '% of total' : '—') + '</small></div>' +
      '<div class="n c-good' + (d.good === 0 ? ' n--zero' : '') + '">' + nf(d.good) + '</div>' +
      '<div class="n c-ext' + (d.ext === 0 ? ' n--zero' : '') + '">' + nf(d.ext) + (d.ext ? '<small>' + Math.round(d.extr * 100) + '%</small>' : '') + '</div>' +
      (d.pace ? '<div class="pace" title="' + d.pace + ' days per lead, 90-day average"><i style="--w:' + Math.min(100, Math.round(d.pace / 10 * 100)) + '%;--pc:' + paceCol(d.pace) + '"></i><b>' + d.pace + '</b><em>d / lead</em></div>' : '<div class="pace pace--none"><b>—</b><em>no recent pace</em></div>') +
      '<div class="last' + (d.stale ? ' last--stale' : d.never ? ' last--never' : '') + '"><span class="last__d"><span class="dot"></span>' + fdate(d.last) + '</span><span class="last__a">' + esc(agoText(d)) + '</span></div>' +
      '<div class="tags">' + (d.f.length ? tags.map(tag).join('') + (rest > 0 ? '<span class="tag tag--more" title="' + esc(d.f.slice(2).join(' · ')) + '">+' + rest + '</span>' : '') : '<span class="okmark" title="No flags">' + ic('i-check') + 'OK</span>') + '</div>' +
      '<span class="acts"><a href="#" title="Open Lead Desk" aria-label="Open Lead Desk" data-stop>' + ic('i-ext') + '</a><a href="#" title="Dealer file" aria-label="Dealer file" data-stop>' + ic('i-file') + '</a><a href="#" title="Copy dealer id" aria-label="Copy dealer id" data-stop data-copy="' + d.id + '">' + ic('i-tag') + '</a></span>' +
      '</div>';
  }

  /* ── inline dealer sheet ── */
  function acc(key, title, summary, inner, extra) {
    var o = !!S.acc[key];
    return '<section class="acc' + (o ? ' acc--open' : '') + '" data-acc="' + key + '"><h3><button class="acc__h" type="button" aria-expanded="' + o + '" aria-controls="acc-' + key + '"><span class="acc__t">' + title + '</span>' + (extra || '') + '<span class="acc__s">' + summary + '</span>' + ic('i-chev') + '</button></h3>' +
      '<div class="acc__p" id="acc-' + key + '"' + (o ? '' : ' inert') + '><div><div class="acc__in">' + inner + '</div></div></div></section>';
  }
  function setAccOpen(sec, open) { sec.classList.toggle('acc--open', open); var b = $('.acc__h', sec), p = $('.acc__p', sec); if (b) b.setAttribute('aria-expanded', open); if (p) { if (open) p.removeAttribute('inert'); else p.setAttribute('inert', ''); } }
  function sheet(d) {
    var max = Math.max.apply(null, d.months) || 1;
    var spark = '<div class="spark">' + d.months.map(function (n, i) { return '<span><i class="' + (i > 8 ? 'f' : '') + '" style="--h:' + (i > 8 ? 2 : Math.max(3, Math.round(n / max * 100))) + '%" title="' + MON[i] + ' · ' + nf(n) + '"></i><b>' + MON[i][0] + '</b></span>'; }).join('') + '</div>';
    var srcs = Object.keys(d.mix).sort(function (a, b) { return d.mix[b] - d.mix[a]; });
    var mmax = srcs.length ? d.mix[srcs[0]] : 1;
    var mix = srcs.length ? '<div class="mix">' + srcs.map(function (s) { return '<div><span>' + esc(s) + '</span><i style="--w:' + Math.round(d.mix[s] / mmax * 100) + '%"></i><b>' + nf(d.mix[s]) + '</b></div>'; }).join('') + '</div>' : '<div class="hint">No leads this year.</div>';
    var ql = '<div class="ql"><div><div class="v ok">' + nf(d.good) + '</div><div class="l">good · ' + (d.total ? Math.round(d.good / d.total * 100) : 0) + '%</div></div><div><div class="v' + (d.dupr >= 0.4 ? ' bad' : d.dupr >= 0.25 ? ' warn' : '') + '">' + nf(d.dup) + '</div><div class="l">duplicates · ' + Math.round(d.dupr * 100) + '%</div></div><div><div class="v">' + nf(d.ext) + '</div><div class="l">external · ' + Math.round(d.extr * 100) + '%</div></div></div>';
    var names = ['Jason Flicek', 'David Barton', 'Daniela Rodriguez', 'Alec Nero', 'Swayze Morales', 'Kenny Boy', 'Robert Strobel', 'Gagan Singh'];
    var cars = ['2006 Ferrari F430', '2019 Mercedes-Benz SL550', '2019 Lamborghini Urus', '2016 McLaren 675LT', '2020 Audi R8', '2025 Ferrari SF90 XX', '2011 BMW M3', '2026 Tesla Model S Plaid'];
    var leads = d.total ? '<div class="leads">' + [0, 1, 2, 3, 4].map(function (i) { var k = (d.id + i * 3) % names.length; return '<div><b>' + names[k] + '</b><span>' + cars[(k + i) % cars.length] + '</span><em>' + (d.ago + i * 2) + ' d ago</em></div>'; }).join('') + '</div>' : '<div class="hint">Nothing to show.</div>';
    var kv = '<div class="veh__kv"><div><div class="v">' + nf(d.total) + '</div><div class="l">leads 2026</div></div><div><div class="v' + (d.stale ? ' warn' : '') + '">' + (d.pace ? d.pace + ' d' : '—') + '</div><div class="l">per lead · 90 d</div></div><div><div class="v' + (d.stale ? ' warn' : '') + '">' + (d.ago === 0 ? 'today' : d.ago + ' d') + '</div><div class="l">since last lead</div></div></div>';
    var acts = '<div class="veh__acts"><button class="btn btn--primary" type="button">' + ic('i-ext') + '<span>Open Lead Desk</span></button>' +
      '<button class="btn btn--sheet" type="button">' + ic('i-file') + '<span>Dealer file</span></button><button class="btn btn--sheet" type="button">' + ic('i-buoy') + '<span>Create ticket</span></button>' +
      '<button class="btn btn--sheet" type="button">' + ic('i-rss') + '<span>Feeds</span></button><button class="btn btn--sheet" type="button">' + ic('i-tag') + '<span>Copy id</span></button>' +
      '<button class="btn btn--sheet" type="button">' + ic('i-bell') + '<span>Notify rep</span></button><button class="btn btn--sheet" type="button">' + ic('i-print') + '<span>Print</span></button></div>';
    var left = '<div class="dsheet__mk">' + esc(initials(d.name)) + '<small>#' + d.id + ' · ' + esc(d.city) + '</small><span class="site">' + esc(d.site) + '</span></div>' + kv + acts;
    var health = '<div class="health">' + (d.f.length ? d.f.map(function (f) { return '<div class="hl hl--' + (TONE[f] === 'danger' ? 'bad' : 'warn') + '"><i>' + ic('i-alert') + '</i>' + esc(f) + '</div>'; }).join('') : '<div class="hl hl--ok"><i>' + ic('i-check') + '</i>Producing at pace</div>') + '</div>';
    var accs = acc('months', 'Leads by month', nf(d.total) + ' in 2026', spark + '<div class="hint">Sep is partial · counted to 09/10.</div>', ' <span class="demo">Demo</span>') +
      acc('quality', 'Quality', Math.round(d.dupr * 100) + '% duplicates', ql + health) +
      acc('sources', 'Sources', srcs.length ? srcs.length + ' sources' : '—', mix, ' <span class="demo">Demo</span>') +
      acc('leads', 'Latest leads', d.total ? '5 of ' + nf(d.total) : '—', leads, ' <span class="demo">Demo</span>') +
      acc('notes', 'Notes', 'none', '<div class="hint">No notes for this dealer. Notes here are visible to AAN staff only.</div>');
    var meta = '<div class="veh__m"><span class="idtag">#' + d.id + '</span><span class="mono">' + esc(d.city) + '</span><span class="veh__st">' + (d.stale ? 'Stale' : d.total ? 'Producing' : 'Zero-rate') + '</span></div>';
    var tags = d.f.length ? '<div class="veh__tags">' + d.f.map(tag).join('') + '</div>' : '';
    return '<div class="exp__l">' + left + '</div><div class="exp__r"><div class="exp__top"><div><h3 class="veh__n">' + esc(d.name) + '</h3>' + meta + tags + '</div><button class="exp__x" type="button" data-act="close-veh" aria-label="Close">' + ic('i-x') + '</button></div><div class="exp__accs">' + accs + '</div></div>';
  }

  /* ── render ── */
  function render() {
    var L = list(), F = S.q || S.attn || S.month != null || S.stale || S.site !== 'any';
    $('#tb').innerHTML = L.length ? L.map(function (d) { return row(d) + (S.cur === d.id ? '<div class="exp" id="exp"><div><div class="exp__in">' + sheet(d) + '</div></div></div>' : ''); }).join('') + (S.cur ? '<div class="exp-space" id="exp-space"></div>' : '') : '<div class="empty">No dealers match these filters.<button type="button" data-act="clear-all">Clear all</button></div>';
    var ex = $('#exp'); if (ex) { if (S.expNow) ex.classList.add('exp--open'); else requestAnimationFrame(function () { requestAnimationFrame(function () { ex.classList.add('exp--open'); }); }); S.expNow = true; }
    $('.field').classList.toggle('has-open', !!S.cur);
    var chips = [];
    if (S.month != null) chips.push({ v: MON[S.month] + ' 2026', off: function () { S.month = null; } });
    if (S.attn) chips.push({ v: ATTN.filter(function (a) { return a[0] === S.attn; })[0][1], cls: 'chip--signal', off: function () { S.attn = null; } });
    if (S.stale) chips.push({ v: 'Stale only', cls: 'chip--danger', off: function () { S.stale = false; } });
    if (S.site !== 'any') chips.push({ v: S.site, off: function () { S.site = 'any'; } });
    if (S.q) chips.push({ v: '“' + S.q + '”', off: function () { S.q = ''; $('#q').value = ''; } });
    $('#scope').innerHTML = '<span class="scope__n">' + (S.stale ? 'Stale dealers' : S.attn ? 'Attention' : 'All dealers') + '</span><span>·</span><span><b>' + L.length + '</b> of ' + V.length + '</span>' +
      (chips.length ? chips.map(function (c, i) { return '<span class="chip ' + (c.cls || '') + '">' + esc(c.v) + '<button class="chip__x" type="button" data-chip="' + i + '" aria-label="Remove">' + ic('i-x') + '</button></span>'; }).join('') + '<button class="scope__clear" type="button" data-act="clear-all">Clear all</button>' : '');
    $('#scope')._chips = chips;
    $('#sub-shown').textContent = L.length + ' shown';
    $('#shown').textContent = L.length + ' of ' + V.length + ' dealers';
    $('#sort-v').textContent = ({ name: 'Dealer', total: 'Total', good: 'Good', dupr: 'Dup rate', ext: 'External', pace: 'Pace', ago: 'Last lead', issues: 'Attention' })[S.sort] + (S.dir === 'asc' ? ' ↑' : ' ↓');
    $$('.hd .s').forEach(function (h) { h.classList.toggle('on', h.dataset.sort === S.sort); var i = $('.i', h); if (i) i.remove(); if (h.dataset.sort === S.sort) h.insertAdjacentHTML('beforeend', ' ' + ic(S.dir === 'asc' ? 'i-up' : 'i-dn')); });
    $$('#p-sort [data-sort]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.sort === S.sort); });
    $$('#p-sort [data-dir]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.dir === S.dir); });
    $('[data-act="stale"]').classList.toggle('facet__b--stale', S.stale);
    $('#site-v').textContent = S.site === 'any' ? 'Any' : S.site;
    var n = Object.keys(S.sel).length; $('#tray-n').textContent = n; $('#tray').classList.toggle('tray--on', n > 0);
    $$('.mbar').forEach(function (b) { b.classList.toggle('mbar--on', +b.dataset.month === S.month); });
    $$('.ar').forEach(function (b) { b.classList.toggle('ar--on', b.dataset.attn === S.attn); b.setAttribute('aria-pressed', b.dataset.attn === S.attn); });
    var fc = (S.stale ? 1 : 0) + (S.site !== 'any' ? 1 : 0); $('#fcnt').hidden = !fc; $('#fcnt').textContent = fc;
  }

  /* hero counter */
  function countTo(el, to) {
    var from = parseInt(String(el.textContent).replace(/[^0-9]/g, ''), 10) || 0;
    if (from === to || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) { el.textContent = nf(to); return; }
    if (el._raf) cancelAnimationFrame(el._raf);
    var t0 = performance.now(), dur = 700;
    var step = function (t) { var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = nf(Math.round(from + (to - from) * e)); if (p < 1) el._raf = requestAnimationFrame(step); else el._raf = null; };
    el._raf = requestAnimationFrame(step);
  }

  /* ── inline open / close ── */
  function showDealer(id) {
    if (S.cur === id) { closeDealer(); return; }
    var ex = $('#exp'); S.cur = id; S.expNow = false;
    var go = function () { render(); var r = $('.row[data-id="' + id + '"]'); if (r) { var y = Math.max(0, r.getBoundingClientRect().top + window.scrollY - 56 - 58 - 48 - 10); var sp = $('#exp-space'); if (sp) { var need = y - (document.documentElement.scrollHeight - window.innerHeight); sp.style.height = need > 0 ? Math.ceil(need) + 'px' : '0px'; } window.scrollTo({ top: y, behavior: 'smooth' }); } };
    if (ex) { ex.classList.remove('exp--open'); setTimeout(go, 200); } else go();
  }
  function closeDealer() { var ex = $('#exp'); S.cur = null; if (ex) { ex.classList.remove('exp--open'); setTimeout(render, 200); } else render(); }

  /* ── dock: period & filters ── */
  function dockBody() {
    return '<div class="dk"><h4>Year</h4><div class="chips">' + ['All', '2023', '2024', '2025', '2026'].map(function (y) { return '<button type="button" class="' + ((y === '2026' && S.year === '2026') || (y === 'All' && S.year === 'all') ? 'on' : '') + '" data-year="' + (y === 'All' ? 'all' : y) + '">' + y + '</button>'; }).join('') + '</div>' +
      '<h4>Months</h4><div class="chips">' + MON.map(function (m, i) { return '<button type="button" class="' + (S.month === i ? 'on' : '') + '" data-month="' + i + '"' + (i > 8 ? ' disabled' : '') + '>' + m + '</button>'; }).join('') + '</div>' +
      '<h4>Dates</h4><div class="row2"><input class="fld" type="date" value="2026-01-01" aria-label="From"><input class="fld" type="date" value="2026-09-10" aria-label="To"></div><div class="note">Settled reports count to 06:00 of the report date. September is partial.</div>' +
      '<h4>Dealers</h4><label class="sw"><span>Stale only</span><input type="checkbox" data-act="stale-sw"' + (S.stale ? ' checked' : '') + '></label><label class="sw"><span>Include zero-rate dealers</span><input type="checkbox" checked></label><label class="sw"><span>Include skipped (30)</span><input type="checkbox"></label>' +
      '<h4>Platform</h4><div class="chips">' + ['any', 'WordPress', 'cms4'].map(function (s) { return '<button type="button" class="' + (S.site === s ? 'on' : '') + '" data-site="' + s + '">' + (s === 'any' ? 'Any' : s) + '</button>'; }).join('') + '</div>' +
      '<div class="note">● Stale = newest lead older than 72 h + the dealer\'s own pace (90-day average). Zero-rate dealers never flag.</div></div>';
  }
  function openDock() { S.dock = 'filters'; $('#dock-t').textContent = 'Period & filters'; $('#dock-c').textContent = ''; $('#dock-b').innerHTML = dockBody(); $('#dock-f').innerHTML = '<button class="btn btn--quiet" type="button" data-act="clear-all">Reset</button><span class="dock__foot-n">' + list().length + ' dealers</span><button class="btn btn--primary" type="button" data-act="close">Done</button>'; $('#app').classList.add('dock-open'); $$('[data-act="filters"]').forEach(function (b) { b.classList.add('facet__b--on'); }); }
  function closeDock() { S.dock = null; $('#app').classList.remove('dock-open'); $$('[data-act="filters"]').forEach(function (b) { b.classList.remove('facet__b--on'); }); render(); }

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
    if ((el = t.closest('[data-sort]'))) { var s = el.dataset.sort; if (el.classList.contains('mn__it')) { S.sort = s; } else if (S.sort === s) { S.dir = S.dir === 'asc' ? 'desc' : 'asc'; } else { S.sort = s; S.dir = s === 'name' ? 'asc' : 'desc'; } closePops(); render(); return; }
    if ((el = t.closest('[data-dir]'))) { S.dir = el.dataset.dir; closePops(); render(); return; }
    if ((el = t.closest('[data-month]'))) { var m = +el.dataset.month; S.month = S.month === m ? null : m; renderBento(); render(); return; }
    if ((el = t.closest('[data-act="clear-months"]'))) { e.preventDefault(); S.month = null; renderBento(); render(); return; }
    if ((el = t.closest('[data-attn]'))) { S.attn = S.attn === el.dataset.attn ? null : el.dataset.attn; render(); return; }
    if ((el = t.closest('[data-year]'))) { $$('[data-year]').forEach(function (b) { var on = b.dataset.year === el.dataset.year; if (b.classList.contains('lane')) { b.classList.toggle('lane--on', on); b.setAttribute('aria-pressed', on); } if (b.classList.contains('mn__it')) b.classList.toggle('mn__it--on', on); }); S.year = el.dataset.year; $('#year-v').textContent = el.dataset.year === 'all' ? 'All' : el.dataset.year; closePops(); if (S.dock) openDock(); return; }
    if ((el = t.closest('[data-site]'))) { S.site = el.dataset.site; $$('#p-site .mn__it').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.site === S.site); }); closePops(); if (S.dock) openDock(); render(); return; }
    if ((el = t.closest('[data-act="stale"]'))) { S.stale = !S.stale; render(); return; }
    if ((el = t.closest('[data-act="filters"]'))) { if (S.dock) closeDock(); else { openDock(); render(); } return; }
    if ((el = t.closest('[data-act="close"]'))) { closeDock(); return; }
    if ((el = t.closest('[data-act="close-veh"]'))) { closeDealer(); return; }
    if ((el = t.closest('[data-act="clear-all"]'))) { S.q = ''; $('#q').value = ''; S.attn = null; S.month = null; S.stale = false; S.site = 'any'; renderBento(); if (S.dock) openDock(); render(); return; }
    if ((el = t.closest('[data-act="clear-sel"]'))) { S.sel = {}; render(); return; }
    if ((el = t.closest('[data-chip]'))) { $('#scope')._chips[+el.dataset.chip].off(); renderBento(); render(); return; }
    if ((el = t.closest('[data-copy]'))) { e.preventDefault(); try { navigator.clipboard.writeText(el.dataset.copy); } catch (x) {} return; }
    if ((el = t.closest('[data-act="copy-ids"]'))) { try { navigator.clipboard.writeText(list().map(function (d) { return d.id; }).join(', ')); } catch (x) {} el.querySelector('svg').nextSibling.textContent = ' Copied'; setTimeout(function () { el.querySelector('svg').nextSibling.textContent = ' Copy all IDs'; }, 1400); return; }
    if ((el = t.closest('.acc__h'))) { var sec = el.closest('.acc'); S.acc[sec.dataset.acc] = !S.acc[sec.dataset.acc]; setAccOpen(sec, S.acc[sec.dataset.acc]); return; }
    if (t.closest('[data-stop]') || t.closest('.exp') || t.closest('a')) return;
    if ((el = t.closest('.row'))) { if (t.classList.contains('ck')) return; showDealer(+el.dataset.id); return; }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-sel]')) { if (t.checked) S.sel[t.dataset.sel] = true; else delete S.sel[t.dataset.sel]; render(); }
    if (t.matches('[data-act="stale-sw"]')) { S.stale = t.checked; render(); }
  });
  $('#q').addEventListener('input', function (e) { S.q = e.target.value; render(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== $('#q') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); }
    if (e.key === 'Escape') { if ($('.nav__it--open') || $('.pop--open')) { closeMenus(); closePops(); } else if (S.cur) closeDealer(); else if (S.dock) closeDock(); return; }
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement.classList && document.activeElement.classList.contains('row')) { e.preventDefault(); showDealer(+document.activeElement.dataset.id); }
  });

  /* sticky band + column header state */
  (function () {
    var cmd = $('.cmd'), hd = $('.hd'), stuck = null, hdStuck = null;
    function onScroll() {
      var s = window.scrollY > 0 && cmd.getBoundingClientRect().top <= 56.5; if (s !== stuck) { stuck = s; cmd.classList.toggle('cmd--stuck', s); }
      var h = window.scrollY > 0 && hd.getBoundingClientRect().top <= 114.5; if (h !== hdStuck) { hdStuck = h; hd.classList.toggle('hd--stuck', h); }
    }
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); onScroll();
  })();

  /* first paint: hero rolls up */
  var hero = $('#scope-n'); hero.textContent = '0';
  renderBento(); render();
  window.LRdemo = { showDealer: showDealer, closeDealer: closeDealer, openDock: openDock, closeDock: closeDock, S: S, V: V };
})();
