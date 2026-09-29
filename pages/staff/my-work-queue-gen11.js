/* ============================================================================
   AAN · Staff UI · My Work Queue — GENERATION 11

   State, not position. CSS owns the layout and publishes the sticky geometry;
   this file reads it. Every label, count, option and row comes from
   my-work-queue-gen11.data.js, which was read out of the production export.

   What this file deliberately does not do
     · it invents no workflow. Reporting and Show are real production filters
       whose predicates live on the server (Past Due, Due Today, Tagged As
       Completed, Marketing Clients); they are omitted rather than shown as
       controls that would do nothing or, worse, guess.
     · it adds no keyboard shortcut. The one keyboard path production has —
       typing a new work priority into the rank cell — is the one implemented.
     · it fabricates no rows. A lane with no exported sample says so.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.WQ;
  if (!D) return;

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function ic(id, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function num(v) { var n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? -Infinity : n; }

  /* ── state ───────────────────────────────────────────────────────────────
     `edits` is the local record of an inline change, keyed by row id + field.
     Nothing is persisted: there is no endpoint behind this page. */
  var S = {
    view: 'mywork',
    archived: false,
    sort: null,        /* null = production's Default order */
    dir: 'asc',
    f: { dealer: '', status: '', dept: '', priority: '', assignee: '' },
    kw: '',
    kwTyped: false,   /* a keyword the operator typed filters the lane; the one
                         a fixture arrives with is already the result set */
    chips: [],
    order: null,       /* row ids, when the queue has been re-ordered by hand */
    edits: {}
  };

  /* ── column sets ─────────────────────────────────────────────────────────
     Two of them, because production ships two. The header is addressed by
     semantic class, never by nth-child (DESIGN.md §10). */
  var COLS = {
    mine: [
      { c: 'c-grip', l: '' },
      { c: 'c-rank', l: 'Priority',        s: 'rank',    ctr: true },
      { c: 'c-tkt',  l: 'Ticket',          s: 'ticket' },
      { c: 'c-dlr',  l: 'Dealership',      s: 'dealer' },
      { c: 'c-sub',  l: 'Subject',         s: 'subject' },
      { c: 'c-st',   l: 'Status',          s: 'status' },
      { c: 'c-wt',   l: 'Work Type',       s: 'work' },
      { c: 'c-age',  l: 'Ticket Age',      s: 'age',     r: true },
      { c: 'c-amt',  l: 'Dollar Amount',                 r: true },
      { c: 'c-est',  l: 'My Est. Time',                  r: true },
      { c: 'c-left', l: 'Remaining Time',                r: true },
      { c: 'c-mod',  l: 'Last Modified',   s: 'mod' },
      { c: 'c-who',  l: 'Assigned' },
      { c: 'c-beg',  l: 'Begin Date',      s: 'begin' },
      { c: 'c-done', l: 'Completion Date', s: 'done' },
      { c: 'c-act',  l: '' }
    ],
    open: [
      { c: 'c-tkt',   l: 'Ticket',              s: 'ticket' },
      { c: 'c-dlr',   l: 'Dealership',          s: 'dealer' },
      { c: 'c-sub',   l: 'Subject',             s: 'subject' },
      { c: 'c-st',    l: 'Status',              s: 'status' },
      { c: 'c-pri',   l: 'Priority',            s: 'pri' },
      { c: 'c-cre',   l: 'Date Created',        s: 'created' },
      { c: 'c-age',   l: 'Ticket Age',          s: 'age',   r: true },
      { c: 'c-wt',    l: 'Work Type',           s: 'work' },
      { c: 'c-amt',   l: 'Dollar Amount',                   r: true },
      { c: 'c-est',   l: 'Est. Time',                       r: true },
      { c: 'c-mod',   l: 'Last Modified',       s: 'mod' },
      { c: 'c-since', l: 'Days Since Modified', s: 'since', r: true },
      { c: 'c-who',   l: 'Assigned' },
      { c: 'c-beg',   l: 'Begin Date',          s: 'begin' },
      { c: 'c-done',  l: 'Completion Date',     s: 'done' },
      { c: 'c-act',   l: '' }
    ]
  };

  function view() { return D.views[S.view]; }
  function set() { return COLS[view().cols]; }

  /* ── platform nav ────────────────────────────────────────────────────── */
  function renderNav() {
    $('#nav').innerHTML = D.nav.map(function (g, i) {
      var id = 'p-nav-' + i;
      return '<div class="nav__it' + (g.on ? ' nav__it--on' : '') + '">' +
        '<button class="nav__b" type="button" data-pop="' + id + '" aria-haspopup="true" aria-expanded="false">' +
          esc(g.g) + ic('i-chev') + '</button>' +
        '<div class="pop" id="' + id + '"><div class="caps pop__lab">' + esc(g.g) + '</div>' +
          g.i.map(function (l) {
            return '<a class="mn__it" href="#">' + esc(l) + '</a>';
          }).join('') +
        '</div></div>';
    }).join('');
  }

  function renderGoLive() {
    $('#golive').innerHTML = '<span class="caps golive__l">Go Live List<b class="golive__n">' + D.goLive.length + '</b></span>' +
      D.goLive.map(function (g) {
        return '<a class="gl" href="#" title="' + esc(g.host + ' — go live ' + g.date) + '">' +
          '<b>' + esc(g.host.replace(/^www\./, '')) + '</b><i>' + esc(g.date) + '</i></a>';
      }).join('') +
      '<a class="gl gl--all" href="#">All Go Lives</a>';
    fitGoLive();
  }

  /* The strip never scrolls sideways. It shows the dealers that fit on the
     line and hands the rest to "All Go Lives", which carries the remainder so
     nothing is silently dropped.

     The room is the CONTENT box, not clientWidth: clientWidth includes the
     strip's own 16px of padding on each side, so measuring against it let the
     last chip run 62px past the inner edge at 1366 and get clipped by the
     overflow. */
  /* The strip's own 16px of right padding is the edge air, and the overflow
     action is pushed to that inner edge, so no extra tail is withheld here —
     withholding one cost a dealer that missed the line by four pixels. */
  var GOLIVE_TAIL = 0;
  function fitGoLive() {
    var strip = $('#golive'); if (!strip) return;
    var cs = getComputedStyle(strip);
    var room = strip.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - GOLIVE_TAIL;
    var all = strip.querySelector('.gl--all');
    var items = [].slice.call(strip.querySelectorAll('.gl:not(.gl--all)'));

    items.forEach(function (el) { el.hidden = false; });
    if (all) { all.hidden = false; all.textContent = 'All Go Lives +' + items.length; }

    var label = strip.querySelector('.golive__l');
    var used = label ? label.offsetWidth : 0;
    var reserve = all ? all.offsetWidth + 8 : 0;

    /* Two passes: the first reserve is measured against the widest possible
       remainder label, so the fit is safe; once the real remainder is known
       the label is narrower, and the second pass spends the width that frees
       up. Without it the row dropped a dealer it had room for. */
    var shown = 0, pass;
    for (pass = 0; pass < 3; pass++) {
      var run = used, count = 0;
      for (var i = 0; i < items.length; i++) {
        var w = items[i].offsetWidth;
        if (run + w + reserve > room) break;
        run += w; count++;
      }
      if (count === shown && pass > 0) break;
      shown = count;
      if (!all) break;
      all.textContent = 'All Go Lives +' + (items.length - shown);
      var next = all.offsetWidth + 8;
      if (next === reserve) break;
      reserve = next;
    }

    for (var j = 0; j < items.length; j++) items[j].hidden = j >= shown;
    var rest = items.length - shown;
    if (all) {
      all.hidden = rest === 0;
      all.textContent = 'All Go Lives +' + rest;
    }
  }
  window.addEventListener('resize', fitGoLive);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitGoLive);

  function renderQueues() {
    $('#queue-list').innerHTML = D.queues.map(function (q) {
      return '<button class="mn__it' + (q.n === D.user ? ' mn__it--on' : '') + '" type="button" data-queue="' + esc(q.n) + '">' +
        ic('i-check') + esc(q.n) + '</button>';
    }).join('');
  }

  /* ── lane rail ───────────────────────────────────────────────────────────
     One exclusive control in one sunken track. The "my" pair, a hairline, then
     the department lanes. Only the three lanes the export sampled carry rows;
     the rest keep their real count and the list says what is missing. */
  var HAS_ROWS = { work_assigned: 'mywork', all_open: 'allopen', keyword: 'keyword' };

  function renderLanes() {
    var cur = view().lane;
    var group = S.archived ? D.rail.archived : D.rail.open;
    function lane(x) {
      var on = x.k === cur;
      var hot = x.t === 'hot' && !on;
      return '<button class="lane ui-view' + (on ? ' lane--on ui-view--on' : '') + (hot ? ' lane--hot' : '') + '" type="button"' +
        ' data-lane="' + x.k + '" aria-pressed="' + (on ? 'true' : 'false') + '"' +
        (x.off ? ' disabled title="' + esc(x.off) + '"' : '') + '>' +
        '<span>' + esc(x.l) + '</span>' + (x.c ? '<b>' + esc(x.c) + '</b>' : '') + '</button>';
    }
    $('#lanes').innerHTML =
      D.rail.mine.map(lane).join('') +
      '<span class="lanes__div" aria-hidden="true"></span>' +
      group.map(lane).join('');

    var sw = $('#arch');
    sw.setAttribute('aria-checked', S.archived ? 'true' : 'false');
  }

  /* ── command band ────────────────────────────────────────────────────── */
  function renderChips() {
    var out = S.chips.map(function (c, i) {
      return '<span class="fchip"><span class="fchip__k">' + esc(c.k) + ':</span> ' + esc(c.v) +
        '<button class="fchip__x" type="button" data-chip="' + i + '" aria-label="Remove filter ' + esc(c.k) + '">' + ic('i-x') + '</button></span>';
    });
    if (S.kw) {
      out.unshift('<span class="fchip fchip--kw">“' + esc(S.kw) + '”' +
        '<button class="fchip__x" type="button" data-kw aria-label="Remove keyword">' + ic('i-x') + '</button></span>');
    }
    $('#chips').innerHTML = out.join('');
    var n = S.chips.length + (S.kw ? 1 : 0);
    var cnt = $('#fcnt');
    cnt.hidden = !n;
    cnt.textContent = n;
  }

  function renderSortMenu() {
    var cols = set().filter(function (c) { return c.s; });
    $('#sort-list').innerHTML =
      '<button class="mn__it' + (S.sort ? '' : ' mn__it--on') + '" type="button" data-sort="">' +
        ic('i-check') + 'Default order</button>' +
      '<div class="pop__sep"></div>' +
      cols.map(function (c) {
        var on = S.sort === c.s;
        return '<button class="mn__it' + (on ? ' mn__it--on' : '') + '" type="button" data-sort="' + c.s + '">' +
          ic('i-check') + esc(c.l) + '<span class="sp"></span>' +
          (on ? '<span class="hint">' + (S.dir === 'asc' ? '↑' : '↓') + '</span>' : '') +
          '</button>';
      }).join('');
    $('#sort-v').textContent = S.sort
      ? (cols.filter(function (c) { return c.s === S.sort; })[0] || { l: '' }).l + ' ' + (S.dir === 'asc' ? '↑' : '↓')
      : 'Default';
  }

  var FILTERS = [
    { k: 'dealer',   l: 'Dealer',    o: 'dealer',   w: 240 },
    { k: 'status',   l: 'Status',    o: 'status',   w: 200, hint: 'in this view' },
    { k: 'dept',     l: 'Work Type', o: 'dept',     w: 200 },
    { k: 'priority', l: 'Priority',  o: 'priority', w: 170 },
    { k: 'assignee', l: 'Assigned',  o: 'assignee', w: 190 }
  ];

  function renderFilterMenu() {
    $('#filt-list').innerHTML = FILTERS.map(function (f) {
      var opts = D.opts[f.o].map(function (o) {
        return '<option value="' + esc(o.v) + '"' + (S.f[f.k] === o.v ? ' selected' : '') + '>' +
          esc(o.l || ('Any ' + f.l.toLowerCase())) + '</option>';
      }).join('');
      return '<div class="mn__row"><label class="caps" style="min-width:74px" for="f-' + f.k + '">' + esc(f.l) + '</label>' +
        '<select class="sel" id="f-' + f.k + '" data-filter="' + f.k + '" style="max-width:' + f.w + 'px">' + opts + '</select></div>';
    }).join('');
  }

  function renderPer() {
    $('#per').innerHTML = D.opts.per.map(function (p, i) {
      return '<option' + (i === 1 ? ' selected' : '') + '>' + esc(p) + '</option>';
    }).join('');
  }

  /* ── header ──────────────────────────────────────────────────────────────
     A label with no sort is a plain span; a sortable one is a button. Nothing
     asks the browser to break a word: see the .hd rules. */
  function renderHead() {
    $('#hd').innerHTML = set().map(function (c) {
      var cls = c.c + (c.r ? ' r' : '') + (c.ctr ? ' ctr' : '');
      if (!c.l) return '<span class="' + cls + '" role="columnheader"></span>';
      if (!c.s) return '<span class="' + cls + '" role="columnheader">' + esc(c.l) + '</span>';
      var on = S.sort === c.s;
      return '<span class="' + cls + '" role="columnheader" aria-sort="' +
        (on ? (S.dir === 'asc' ? 'ascending' : 'descending') : 'none') + '">' +
        '<button class="s' + (on ? ' s--on' : '') + '" type="button" data-sort="' + c.s + '">' +
        esc(c.l) + ic(S.dir === 'asc' ? 'i-up' : 'i-dn') + '</button></span>';
    }).join('');
  }

  /* ── rows ────────────────────────────────────────────────────────────── */
  function hl(s) {
    if (!S.kw) return esc(s);
    var i = String(s).toLowerCase().indexOf(S.kw.toLowerCase());
    if (i < 0) return esc(s);
    return esc(String(s).slice(0, i)) + '<mark>' + esc(String(s).slice(i, i + S.kw.length)) +
      '</mark>' + esc(String(s).slice(i + S.kw.length));
  }

  function editVal(r, field, fallback) {
    var k = r.id + ':' + field;
    return Object.prototype.hasOwnProperty.call(S.edits, k) ? S.edits[k] : fallback;
  }

  function cNum(r, field, value, cls) {
    var v = value == null || value === '' ? '—' : value;
    if (v === 'N/A') return '<span class="c ' + cls + '" role="cell"><span class="na">N/A</span></span>';
    var neg = num(v) < 0;
    return '<span class="c ' + cls + '" role="cell"><span' + (neg ? ' class="v--neg"' : '') + '>' + esc(v) + '</span></span>';
  }

  function cBadge(b, cls) {
    if (!b) return '<span class="c ' + cls + '" role="cell"></span>';
    return '<span class="c ' + cls + '" role="cell"><span class="bdg bdg--' + esc(b.tone) + '" title="' +
      esc(b.title || b.label) + '">' + esc(b.label) + '</span></span>';
  }

  function cMod(r) {
    var f = r.mod.flag;
    return '<span class="c c-mod' + (f ? ' c-mod--flag' : '') + '" role="cell"' +
      (f ? ' title="' + esc(f) + '"' : '') + '>' +
      '<b>' + (f ? '<span class="c-mod__f">' + ic('i-flag') + '<span class="vh">' + esc(f) + '. </span></span>' : '') +
        '<span>' + esc(r.mod.who) + '</span></b>' +
      '<i>' + esc(r.mod.at) + '</i></span>';
  }

  function cWho(r) {
    var w = r.who || [];
    if (!w.length) return '<span class="c c-who" role="cell"></span>';
    var vis = w.slice(0, 2), rest = w.length - vis.length;
    var all = w.map(function (x) { return x.o ? '(' + x.n + ')' : x.n; }).join(' · ');
    function nm(x) { return x.o ? '<i class="own">(' + esc(x.n) + ')</i>' : '<span>' + esc(x.n) + '</span>'; }
    /* two lines, never three: the overflow count rides with the second name so
       a four-assignee ticket is the same height as a one-assignee ticket */
    var l1 = nm(vis[0]);
    var l2 = vis[1] ? nm(vis[1]) : '';
    var more = rest > 0 ? '<span class="more" aria-hidden="true">+' + rest + '</span>' : '';
    return '<span class="c c-who" role="cell" title="' + esc(all) + '">' +
      '<span class="c-who__l">' + l1 + (l2 ? '' : more) + '</span>' +
      (l2 ? '<span class="c-who__l">' + l2 + more + '</span>' : '') + '</span>';
  }

  function cDate(r, field, obj, editable) {
    var v = editVal(r, field, obj.date);
    var inner = editable
      ? '<button class="ed" type="button" data-ed="' + field + '" data-kind="date" title="Edit ticket ' +
        (field === 'begin' ? 'begin' : 'completion') + ' date">' + esc(v || '—') + '</button>'
      : '<span class="d">' + esc(v || '—') + '</span>';
    return '<span class="c c-' + (field === 'begin' ? 'beg' : 'done') + '" role="cell">' +
      (obj.note ? '<span class="tag" title="' + esc(obj.note) + '">Waiting</span>' : '') +
      inner + '</span>';
  }

  function rowMine(r) {
    var url = D.ticketBase + r.id;
    return '<div class="row" role="row" data-id="' + r.id + '">' +
      '<span class="c c-grip" role="cell"><button class="grip" type="button" draggable="true" ' +
        'aria-label="Reorder ticket ' + esc(r.ticket) + '" title="Drag to reorder">' + ic('i-grip') + '</button></span>' +
      '<span class="c c-rank ctr" role="cell"><button class="ed ed--num" type="button" data-ed="rank" data-kind="rank" ' +
        'title="Set work priority (0–299)">' + esc(editVal(r, 'rank', r.rank)) + '</button></span>' +
      '<span class="c c-tkt" role="cell"><a class="tkt" href="' + url + '">' + hl(r.ticket) + '</a></span>' +
      cDealer(r) +
      cSubject(r, url) +
      cBadge(r.status, 'c-st') +
      cWork(r) +
      cNum(r, 'age', r.age, 'c-age') +
      cNum(r, 'amt', r.dollar, 'c-amt') +
      '<span class="c c-est" role="cell"><button class="ed ed--num" type="button" data-ed="est" data-kind="time" ' +
        'title="Edit my estimated time">' + esc(editVal(r, 'est', r.est)) + '</button></span>' +
      cNum(r, 'left', r.left, 'c-left') +
      cMod(r) +
      cWho(r) +
      cDate(r, 'begin', { date: r.begin }, true) +
      cDate(r, 'done', r.done, true) +
      cAct(r, url) +
      '</div>';
  }

  function rowOpen(r) {
    var url = D.ticketBase + r.id;
    return '<div class="row" role="row" data-id="' + r.id + '">' +
      '<span class="c c-tkt" role="cell"><a class="tkt" href="' + url + '">' + hl(r.ticket) + '</a></span>' +
      cDealer(r) +
      cSubject(r, url) +
      cBadge(r.status, 'c-st') +
      cBadge(r.pri, 'c-pri') +
      '<span class="c c-cre" role="cell">' + esc(r.created) + '</span>' +
      cNum(r, 'age', r.age, 'c-age') +
      cWork(r) +
      cNum(r, 'amt', r.dollar, 'c-amt') +
      cNum(r, 'est', r.est, 'c-est') +
      cMod(r) +
      cNum(r, 'since', r.since, 'c-since') +
      cWho(r) +
      cDate(r, 'begin', { date: r.begin }, false) +
      cDate(r, 'done', r.done, false) +
      cAct(r, url) +
      '</div>';
  }

  function cDealer(r) {
    var d = r.dealer;
    if (!d.url) return '<span class="c c-dlr" role="cell" title="' + esc(d.name) + '"><span>' + hl(d.name) + '</span></span>';
    return '<span class="c c-dlr" role="cell"><a class="dlr" href="' + esc(d.url) + '" target="_blank" rel="noopener" ' +
      'title="' + esc(d.name + ' — opens in a new tab') + '"><span>' + hl(d.name) + '</span>' + ic('i-ext') + '</a></span>';
  }
  function cSubject(r, url) {
    return '<span class="c c-sub" role="cell"><a href="' + url + '" title="' + esc(r.subject) + '">' + hl(r.subject) + '</a></span>';
  }
  function cWork(r) {
    return '<span class="c c-wt" role="cell"' + (r.work ? ' title="' + esc(r.work) + '"' : '') + '>' +
      (r.work ? '<span>' + hl(r.work) + '</span>' : '') + '</span>';
  }
  function cAct(r, url) {
    return '<span class="c c-act" role="cell"><a class="gear" href="' + url + '" title="Open ticket ' + esc(r.ticket) + '" ' +
      'aria-label="Open ticket ' + esc(r.ticket) + '">' + ic('i-cog') + '</a></span>';
  }

  /* ── list ────────────────────────────────────────────────────────────── */
  function rows() {
    var v = view(), L = v.rows.slice();

    if (S.order) {
      var pos = {};
      S.order.forEach(function (id, i) { pos[id] = i; });
      L.sort(function (a, b) { return (pos[a.id] == null ? 1e9 : pos[a.id]) - (pos[b.id] == null ? 1e9 : pos[b.id]); });
    }

    var f = S.f;
    if (S.kw && S.kwTyped) {
      var q = S.kw.toLowerCase();
      L = L.filter(function (r) {
        return [r.ticket, r.dealer.name, r.subject, r.work || '',
                (r.who || []).map(function (x) { return x.n; }).join(' '),
                r.mod.who].join(' ').toLowerCase().indexOf(q) >= 0;
      });
    }
    L = L.filter(function (r) {
      if (f.dealer && r.dealer.name !== dealerLabel(f.dealer)) return false;
      if (f.status && (!r.status || r.status.tone !== f.status)) return false;
      if (f.dept && r.work !== deptLabel(f.dept)) return false;
      if (f.priority && (!r.pri || r.pri.label !== f.priority)) return false;
      if (f.assignee && !(r.who || []).some(function (x) { return x.n === assigneeLabel(f.assignee).split(' ')[0]; })) return false;
      return true;
    });

    if (S.sort) {
      var d = S.dir === 'asc' ? 1 : -1, s = S.sort;
      L.sort(function (a, b) {
        var x = key(a, s), y = key(b, s);
        return (x > y ? 1 : x < y ? -1 : 0) * d;
      });
    }
    return L;
  }

  function key(r, s) {
    switch (s) {
      case 'rank':    return num(editVal(r, 'rank', r.rank));
      case 'ticket':  return num(r.ticket);
      case 'dealer':  return r.dealer.name.toLowerCase();
      case 'subject': return r.subject.toLowerCase();
      case 'status':  return r.status ? r.status.title.toLowerCase() : '';
      case 'pri':     return r.pri ? r.pri.label.toLowerCase() : '';
      case 'work':    return (r.work || '').toLowerCase();
      case 'age':     return num(r.age);
      case 'since':   return num(r.since);
      case 'created': return stamp(r.created);
      case 'mod':     return stamp(r.mod.at);
      case 'begin':   return stamp(editVal(r, 'begin', r.begin));
      case 'done':    return stamp(editVal(r, 'done', r.done.date));
      default:        return 0;
    }
  }
  /* m/d/yy [hh:mm] — the export's only date shape */
  function stamp(v) {
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{2})(?:\s+(\d{1,2}):(\d{2}))?/.exec(String(v || ''));
    if (!m) return -Infinity;
    return (2000 + +m[3]) * 1e8 + (+m[1]) * 1e6 + (+m[2]) * 1e4 + (+(m[4] || 0)) * 100 + (+(m[5] || 0));
  }

  function dealerLabel(v) { return pick(D.opts.dealer, v); }
  function deptLabel(v)   { return pick(D.opts.dept, v); }
  function assigneeLabel(v) { return pick(D.opts.assignee, v); }
  function pick(list, v) {
    var hit = list.filter(function (o) { return o.v === v; })[0];
    return hit ? hit.l : v;
  }

  function render() {
    var v = view(), L = rows();

    $('#field').setAttribute('data-cols', v.cols);
    $('#page-t').textContent = v.title;
    $('#page-meta').textContent = v.meta + ' · ' + D.user;
    document.title = v.title + ' · Work Queue — AAN (Gen 11)';

    var rowsEl = $('#rows');
    if (v.archived) rowsEl.setAttribute('data-archived', ''); else rowsEl.removeAttribute('data-archived');

    renderLanes();
    renderHead();
    renderChips();
    renderSortMenu();

    var body = v.cols === 'mine' ? rowMine : rowOpen;
    $('#tb').innerHTML = L.length
      ? L.map(body).join('')
      : (v.rows.length
        ? '<div class="empty"><b>Nothing matches these filters.</b>' +
          '<button class="btn btn--sheet btn--sm" type="button" data-act="clear">Clear filters</button></div>'
        : '<div class="empty"><b>This lane is not part of the exported sample.</b>' +
          'Its count above is production’s. Only My Work, All Open and Found By Keyword were captured, ' +
          'so no rows are shown rather than invented.' +
          '<button class="btn btn--sheet btn--sm" type="button" data-lane="work_assigned">Back to My Work</button></div>');

    /* scope line and footer — counts are computed, never typed */
    var total = v.rows.length;
    $('#scope').innerHTML = L.length
      ? 'Showing <b>1–' + L.length + '</b> of <b>' + total + '</b>' + (L.length !== total ? ' matching' : '')
      : (total ? 'No match in <b>' + total + '</b>' : 'No rows in this lane');
    $('#shown').innerHTML = L.length ? '1–' + L.length + ' of ' + total : '0 of ' + total;

    $('#totals').innerHTML = v.totals
      ? 'Dollar Amount Total <b class="v--ok">' + esc(v.totals.dollar) + '</b>' +
        '<span>Hourly Estimate Total <b>' + esc(v.totals.hours) + '</b></span>'
      : '';

    $('#pg').innerHTML =
      '<button type="button" disabled aria-label="Previous page">' + ic('i-left') + '</button>' +
      '<button type="button" class="on" aria-current="page">1</button>' +
      '<button type="button" disabled aria-label="Next page">' + ic('i-right') + '</button>';
  }

  /* ── menus ──────────────────────────────────────────────────────────────
     One open at a time. A popover is FLOATING and temporary; it never becomes
     a second persistent layer. */
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
      var p = $('#' + t.getAttribute('data-pop'));
      var open = p.classList.contains('pop--open');
      closePops();
      if (!open) { p.classList.add('pop--open'); t.setAttribute('aria-expanded', 'true'); }
      e.preventDefault();
      return;
    }
    if (!e.target.closest('.pop')) closePops();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePops();
  });

  /* ── actions ─────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var el;

    if ((el = e.target.closest('[data-lane]'))) {
      if (el.disabled) return;
      var k = el.getAttribute('data-lane');
      if (HAS_ROWS[k]) {
        S.view = HAS_ROWS[k];
        S.archived = !!view().archived;
        S.kw = view().kw || '';
        S.kwTyped = false;
        S.chips = (view().chips || []).slice();
        S.sort = null; S.dir = 'asc'; S.order = null;
        S.f = { dealer: '', status: '', dept: '', priority: '', assignee: '' };
      } else {
        /* an unsampled lane: keep the rail honest and show nothing */
        D.views.__none = D.views.__none || {
          lane: k, title: '', meta: '', cols: 'open', sort: 'Default', chips: [], rows: []
        };
        D.views.__none.lane = k;
        D.views.__none.title = (el.querySelector('span') || el).textContent.trim();
        D.views.__none.meta = 'lane not captured in the design export';
        S.view = '__none'; S.chips = []; S.kw = ''; S.kwTyped = false; S.sort = null; S.order = null;
      }
      render();
      window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
      return;
    }

    if ((el = e.target.closest('[data-sort]'))) {
      var s = el.getAttribute('data-sort');
      if (!s) { S.sort = null; S.dir = 'asc'; }
      else if (S.sort === s) { S.dir = S.dir === 'asc' ? 'desc' : 'asc'; }
      else { S.sort = s; S.dir = 'asc'; }
      closePops();
      render();
      return;
    }

    if ((el = e.target.closest('[data-chip]'))) {
      var i = +el.getAttribute('data-chip');
      var c = S.chips[i];
      if (c && c.f) S.f[c.f] = '';
      S.chips.splice(i, 1);
      render(); renderFilterMenu();
      return;
    }
    if (e.target.closest('[data-kw]')) { S.kw = ''; S.kwTyped = false; $('#q').value = ''; render(); return; }

    if ((el = e.target.closest('[data-queue]'))) {
      $('#queue-v').textContent = el.getAttribute('data-queue');
      D.user = el.getAttribute('data-queue');
      closePops();
      render();
      return;
    }

    if ((el = e.target.closest('[data-act]'))) {
      var a = el.getAttribute('data-act');
      if (a === 'clear') {
        S.f = { dealer: '', status: '', dept: '', priority: '', assignee: '' };
        S.chips = []; S.kw = ''; S.kwTyped = false; S.sort = null; S.dir = 'asc';
        $('#q').value = '';
        render(); renderFilterMenu();
      }
      return;
    }

    if ((el = e.target.closest('.ed'))) { openEdit(el); e.preventDefault(); return; }
  });

  $('#arch').addEventListener('click', function () {
    S.archived = !S.archived;
    /* archived on has exactly one sampled lane, and that is the one production
       lands on when the keyword search is what produced the archive view */
    if (S.archived) { S.view = 'keyword'; S.kw = D.views.keyword.kw; S.chips = []; }
    else { S.view = 'mywork'; S.kw = ''; S.chips = []; }
    S.kwTyped = false;
    $('#q').value = '';
    S.sort = null; S.order = null;
    S.f = { dealer: '', status: '', dept: '', priority: '', assignee: '' };
    render(); renderFilterMenu();
  });

  $('#q').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    S.kw = this.value.trim();
    S.kwTyped = !!S.kw;
    render();
  });

  document.addEventListener('change', function (e) {
    var sel = e.target.closest('[data-filter]');
    if (!sel) return;
    var k = sel.getAttribute('data-filter');
    S.f[k] = sel.value;
    var meta = FILTERS.filter(function (f) { return f.k === k; })[0];
    S.chips = S.chips.filter(function (c) { return c.f !== k; });
    if (sel.value) S.chips.push({ k: meta.l, v: pick(D.opts[meta.o], sel.value), f: k });
    closePops();
    render();
  });

  /* ── inline edit ─────────────────────────────────────────────────────────
     Production's own affordance: the value is a button, clicking it swaps in a
     field, Enter commits and Escape reverts. Local only — there is no endpoint. */
  function openEdit(btn) {
    var cell = btn.parentNode;
    var row = btn.closest('.row');
    var field = btn.getAttribute('data-ed');
    var kind = btn.getAttribute('data-kind');
    var cur = btn.textContent.trim();
    var inp = document.createElement('input');
    inp.className = 'edin';
    inp.setAttribute('aria-label', btn.title || field);
    if (kind === 'rank') { inp.type = 'number'; inp.min = 0; inp.max = 299; inp.value = cur; }
    else if (kind === 'time') { inp.type = 'number'; inp.step = '0.01'; inp.min = 0; inp.value = cur; }
    else { inp.type = 'text'; inp.value = cur === '—' ? '' : cur; inp.placeholder = 'm/d/yy'; }

    btn.hidden = true;
    cell.insertBefore(inp, btn);
    inp.focus();
    if (inp.select) inp.select();

    var closed = false;
    function done(commit) {
      if (closed) return;           /* removing a focused input fires blur, and
                                       blur must not run a second, reverting pass */
      if (commit) {
        var v = inp.value.trim();
        if (kind === 'date' && v && !/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(v)) { flag(); return; }
        S.edits[row.getAttribute('data-id') + ':' + field] = v;
      }
      closed = true;
      inp.remove();
      btn.hidden = false;
      if (commit) render();
    }
    function flag() {
      inp.style.boxShadow = 'inset 0 0 0 2px var(--danger)';
      inp.setAttribute('aria-invalid', 'true');
      inp.focus();
    }
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); done(true); }
      if (e.key === 'Escape') { e.preventDefault(); done(false); }
    });
    inp.addEventListener('blur', function () { done(false); });
  }

  /* ── drag reorder ────────────────────────────────────────────────────────
     Production reorders My Work by dragging, which is what the Priority rank
     column records. The rank cell is the keyboard path for the same operation,
     so no new shortcut is introduced. */
  (function () {
    var tb = $('#tb'), from = null;
    tb.addEventListener('dragstart', function (e) {
      var g = e.target.closest('.grip'); if (!g) return;
      from = g.closest('.row');
      from.classList.add('row--drag');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', from.getAttribute('data-id'));
    });
    tb.addEventListener('dragover', function (e) {
      if (!from) return;
      var r = e.target.closest('.row'); if (!r || r === from) return;
      e.preventDefault();
      $$('.row--over', tb).forEach(function (x) { x.classList.remove('row--over'); });
      r.classList.add('row--over');
    });
    tb.addEventListener('drop', function (e) {
      if (!from) return;
      var r = e.target.closest('.row'); if (!r) return;
      e.preventDefault();
      var ids = $$('.row', tb).map(function (x) { return x.getAttribute('data-id'); });
      var a = ids.indexOf(from.getAttribute('data-id'));
      var b = ids.indexOf(r.getAttribute('data-id'));
      ids.splice(b, 0, ids.splice(a, 1)[0]);
      S.order = ids;
      S.sort = null;
      render();
    });
    tb.addEventListener('dragend', function () {
      if (from) from.classList.remove('row--drag');
      $$('.row--over', tb).forEach(function (x) { x.classList.remove('row--over'); });
      from = null;
    });
  })();

  /* ── the engaged sticky stack ────────────────────────────────────────────
     CSS publishes the geometry; this reads it. --stick-total is deliberately
     not read: custom properties are substituted but not evaluated, so it comes
     back as the literal text of its calc() and parseFloat gives NaN. The three
     plain values are summed instead. */
  var CSSV = getComputedStyle(document.documentElement);
  function cssPx(n, f) { var v = parseFloat(CSSV.getPropertyValue(n)); return isNaN(v) ? f : v; }
  function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  (function () {
    var cmd = $('#cmd'), hd = $('#hd'), app = $('#app');
    var stuck = null, hdStuck = null, cmdTop, hdTop;
    function read() { cmdTop = cssPx('--stick-bar', 68); hdTop = cmdTop + cssPx('--stick-cmd', 72); }
    function onScroll() {
      var s = window.scrollY > 0 && cmd.getBoundingClientRect().top <= cmdTop + 0.5;
      /* the platform bar is a SIBLING of the field and cannot see the band in
         the selector tree, so the engaged state is published on the shell too */
      if (s !== stuck) { stuck = s; cmd.classList.toggle('cmd--stuck', s); app.classList.toggle('is-stuck', s); }
      var h = window.scrollY > 0 && hd.getBoundingClientRect().top <= hdTop + 0.5;
      if (h !== hdStuck) { hdStuck = h; hd.classList.toggle('hd--stuck', h); }
    }
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { read(); onScroll(); });
    onScroll();
  })();

  /* ── boot ────────────────────────────────────────────────────────────── */
  renderNav();
  renderGoLive();
  renderQueues();
  renderFilterMenu();
  renderPer();
  render();

  window.WQ11 = { S: S, render: render, cols: COLS };
})();
