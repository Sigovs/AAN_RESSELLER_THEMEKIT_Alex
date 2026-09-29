/* ============================================================================
   AAN · Staff UI · SINGLE TICKET — GENERATION 11

   Renders one of the five export tickets. `?id=<ticket number>` selects it and
   Prev / Next walk the set, which is what makes the two states the export ships
   reachable rather than described: #1048675 is brand new with an EMPTY crew, and
   #1048648 is CLOSED with every crew ring completed.

   Three rules this file keeps, in DESIGN.md's order:

     1  GEOMETRY IS READ, NEVER RETYPED (§7). The sticky stack is published by
        the stylesheet as `--stick-bar` + `--stick-sec`; this file reads the two
        plain values and sums them. It never reads a calc() token — a custom
        property is substituted but not evaluated, so `getPropertyValue` on a
        calc() returns the literal text and `parseFloat` gives NaN.

     2  THE SECTION ANCHOR IS ONE ARITHMETIC IN ONE PLACE (§8): stack +
        --anchor-gap. `scroll-margin-top` in the stylesheet carries the same sum
        for hash navigation and the keyboard, which never pass through here. The
        document extender exists so the last section can reach that line.

     3  JS SETS STATE, NOT POSITION (§17). Engaged state is published in two
        places by one scroll handler — `.cmd--stuck` and `#app.is-stuck` — the
        second because the platform bar is a SIBLING of the field and cannot see
        the band in the selector tree.

   Nothing here fabricates content. Posting a message, a note, a WOC note or a
   ToDo prepends an entry authored by the signed-in user at the current time,
   because that is what the composer does; it does not invent history.
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

  var D = window.TK;
  var TICKETS = D.tickets;

  /* ── sticky geometry: published by CSS, read here ─────────────────────── */
  function px(name) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    var n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }
  function stack() { return px('--stick-bar') + px('--stick-sec'); }
  function anchorGap() { return px('--anchor-gap'); }
  function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ── which ticket ─────────────────────────────────────────────────────── */
  var want = new URLSearchParams(location.search).get('id') || '';
  var idx = 0;
  for (var i = 0; i < TICKETS.length; i++) { if (TICKETS[i].tid === want) { idx = i; break; } }
  var T = TICKETS[idx];

  /* Working copies. The fixture is the record; these are what the page edits,
     so Discard has something to go back to. */
  var crew = [], followers = [], thread = [], lane = 'all';

  /* ══ STATUS TONE ════════════════════════════════════════════════════════
     The export's chips name the production badge key they were drawn with. Those
     keys are mapped onto DESIGN.md §5's roles — open work is brand, project work
     is violet, pending/waiting is signal, closed is slate, priority may go red —
     rather than onto a new hue per key. Status is never hue alone: the chip
     always prints the status word. */
  var TONE = {
    project_ongoing: 'proj', projdevopen: 'proj', project_open: 'proj',
    pending: 'wait', dealer_pending: 'wait',
    closed: 'done', cancelled: 'done',
    priority_high: 'hot',
    open: 'open'
  };
  function toneOf(chip) {
    if (chip.badge && TONE[chip.badge]) return TONE[chip.badge];
    return 'open';
  }

  /* ══ TIME ══════════════════════════════════════════════════════════════
     Production stores decimal hours and shows `12h 35m`. Both forms are in the
     export, so both are shown: the input carries the human form the export
     carries, and the echo beside it carries the decimal that is saved. Parsing
     accepts exactly the four formats the export's own help text lists. */
  function toHours(s) {
    s = String(s || '').trim().toLowerCase();
    if (!s) return null;
    var m;
    if ((m = s.match(/^(\d+):([0-5]?\d)$/))) return +m[1] + +m[2] / 60;
    if ((m = s.match(/^(\d+(?:\.\d+)?)\s*h(?:rs?|ours?)?\s*(?:(\d+)\s*m)?$/))) return +m[1] + (m[2] ? +m[2] / 60 : 0);
    if ((m = s.match(/^(\d+)\s*m(?:in)?$/))) return +m[1] / 60;
    if ((m = s.match(/^(\d+(?:\.\d+)?)$/))) return +m[1];
    return NaN;
  }
  function hhmm(h) {
    if (h == null || isNaN(h) || h <= 0) return '—';
    var H = Math.floor(h + 1e-9), M = Math.round((h - H) * 60);
    if (M === 60) { H += 1; M = 0; }
    return (H ? H + 'h' : '') + (H && M ? ' ' : '') + (M ? M + 'm' : (H ? '' : '0m'));
  }
  function dec(h) { return (h == null || isNaN(h)) ? '' : h.toFixed(2); }

  /* ══ DATES ══════════════════════════════════════════════════════════════
     The export prints `MM/DD/YYYY hh:mm AM`. Sorting the thread needs an
     ordering key, so the printed form is parsed back rather than a second date
     format being introduced. An unparseable stamp sorts last and still prints
     exactly as the export printed it. */
  function key(when) {
    var m = String(when || '').match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})\s*(AM|PM)?/i);
    if (!m) return 0;
    var h = +m[4];
    if (m[6]) { var pm = /pm/i.test(m[6]); if (pm && h < 12) h += 12; if (!pm && h === 12) h = 0; }
    return Date.UTC(+m[3], +m[1] - 1, +m[2], h, +m[5]);
  }
  function stamp(d) {
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    var h = d.getHours(), ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (!h) h = 12;
    return p(d.getMonth() + 1) + '/' + p(d.getDate()) + '/' + d.getFullYear() + ' ' + p(h) + ':' + p(d.getMinutes()) + ' ' + ap;
  }
  function splitWhen(when) {
    var m = String(when || '').match(/^(\S+)\s+(.*)$/);
    return m ? { d: m[1], t: m[2] } : { d: String(when || ''), t: '' };
  }

  /* ══ SEED — one working copy per render ════════════════════════════════ */
  function seed() {
    crew = T.crew.map(function (c) {
      return {
        aid: c.aid, name: c.name, num: c.num, ranked: c.ranked, meta: c.meta,
        done: c.done, spent: c.spent, est: c.est,
        begin: c.begin, doneBy: c.doneBy, dates: false
      };
    });
    followers = T.following.slice();
    thread = [];
    var push = function (kind, items) {
      items.forEach(function (it, n) {
        thread.push({
          id: kind + '-' + n, kind: kind, who: it.who, when: it.when,
          body: it.body, atts: it.atts, k: key(it.when), open: false
        });
      });
    };
    push('message', T.messages);
    push('note', T.notes);
    push('todo', T.todos);
    push('woc', T.woc);
    thread.sort(function (a, b) { return b.k - a.k; });
    lane = 'all';
  }
  function cleanCrew() {
    return T.crew.map(function (c) {
      return [c.done, c.spent, c.est, c.begin, c.doneBy].join('|');
    }).join('~');
  }
  function nowCrew() {
    return crew.map(function (c) {
      return [c.done, c.spent, c.est, c.begin, c.doneBy].join('|');
    }).join('~');
  }

  /* ══ PLATFORM NAV ══════════════════════════════════════════════════════ */
  function renderNav() {
    $('#nav').innerHTML = D.nav.map(function (g, gi) {
      var on = g.label === 'Work';
      var items = g.items.map(function (it) {
        var cls = 'mn__it' + (it.kind === 'sub' ? ' mn__it--sub' : '');
        var href = '#';
        if (it.kind && it.kind !== 'ext' && it.kind !== 'sub') href = it.kind;
        var tail = it.kind === 'ext' ? ic('i-ext') : '';
        return '<a class="' + cls + '" href="' + href + '">' + esc(it.label) + tail + '</a>';
      }).join('');
      return '<div class="nav__it' + (on ? ' nav__it--on' : '') + '">'
        + '<button class="nav__b" type="button" data-pop="p-nav-' + gi + '" aria-haspopup="true" aria-expanded="false">'
        + esc(g.label) + ic('i-chev') + '</button>'
        + '<div class="pop" id="p-nav-' + gi + '"><div class="caps pop__lab">' + esc(g.label) + '</div>' + items + '</div>'
        + '</div>';
    }).join('');
  }

  /* ══ HEAD ══════════════════════════════════════════════════════════════ */
  function renderHead() {
    document.title = 'Ticket ' + T.tid + ' · ' + T.subject + ' — AAN (Gen 11)';
    $('#h-title').innerHTML = '<span class="tid">#' + esc(T.tid) + '</span>' + esc(T.subject);
    $('#h-meta').innerHTML = T.meta.replace(/^([^·]+)/, function (m) { return '<b>' + esc(m.trim()) + '</b> '; });
    $('#h-chips').innerHTML = T.chips.map(function (c) {
      var t = toneOf(c);
      var isType = /--worktype/.test(c.cls);
      var dot = /ui-badge--dot/.test(c.cls);
      var cls = isType ? 'chip chip--type' : 'chip chip--' + t + (dot ? ' chip--dot' : '');
      return '<span class="' + cls + '">' + esc(c.label) + '</span>';
    }).join('');
  }

  /* ══ BENTO ═════════════════════════════════════════════════════════════ */
  function renderPulse() {
    $('#pulse-s').textContent = T.dealer + ' · ticket #' + T.tid;
    $('#pulse').innerHTML = T.pulse.map(function (t) {
      var none = t.v === '—' || t.v === '— → —';
      var v = esc(t.v);
      /* money keeps its own ink on the focal surface: "Yes $15,996.00" */
      v = v.replace(/(\$[\d,]+\.\d{2})/, '<span class="cash">$1</span>');
      return '<div class="tile">'
        + '<div class="tile__k">' + esc(t.k) + '</div>'
        + '<div class="tile__v' + (t.range ? ' tile__v--range' : '') + (none ? ' tile__v--none' : '') + '">'
        + v + (t.small ? '<small>' + esc(t.small) + '</small>' : '') + '</div>'
        + '<div class="tile__s">' + esc(t.s) + '</div>'
        + '</div>';
    }).join('');
  }

  function renderRail() {
    $('#rail').innerHTML = '<div class="rail__k">Dealer</div>'
      + '<div class="rail__who"><b>' + esc(T.dealer) + '</b><span>' + esc(T.dealerMeta) + '</span></div>'
      + '<div class="rail__ls">' + T.links.map(function (l) {
        var label = l.label.replace(/\s*\(Potential Dev Link\)\s*$/i, '');
        return '<a class="rlink' + (l.dev ? ' rlink--dev' : '') + '" href="' + esc(l.href) + '"'
          + (/^https?:/.test(l.href) ? ' rel="noreferrer"' : '') + '>'
          + '<span class="rlink__l">' + esc(label) + '</span>'
          + (l.dev ? '' : ic('i-ext'))
          + '</a>';
      }).join('') + '</div>';
  }

  /* ══ SECTION NAVIGATOR ═════════════════════════════════════════════════ */
  var SECS = [
    { id: 's-work', label: 'Work order', n: null },
    { id: 's-thread', label: 'History', n: function () { return thread.length; } },
    { id: 's-clog', label: 'Changelog', n: function () { return T.clog.length; } },
    { id: 's-atts', label: 'Attachments', n: function () { return T.atts.length; } }
  ];
  function renderSecnav() {
    $('#secnav').innerHTML = SECS.map(function (s, n) {
      var c = s.n ? s.n() : null;
      return '<a class="secnav__b' + (n === 0 ? ' secnav__b--on' : '') + '" href="#' + s.id + '" data-sec="' + s.id + '">'
        + esc(s.label) + (c === null ? '' : '<b>' + c + '</b>') + '</a>';
    }).join('');
  }

  /* ══ WORK ORDER ════════════════════════════════════════════════════════ */
  function opts(list, sel) {
    return list.map(function (o) {
      var label = o === '' ? '—' : o;
      return '<option value="' + esc(o) + '"' + (o === sel ? ' selected' : '') + '>' + esc(label) + '</option>';
    }).join('');
  }
  function renderWork() {
    var f = T.form;
    /* The export ships a 366-entry dealer select. The list is the dealership
       field's real domain, but it is not in this fixture — carrying 366 names
       into a page about one ticket would be weight without a reader. The field
       therefore offers the ticket's own dealer, named, and says where the full
       list lives instead of pretending to be it. */
    $('#w-dealer').innerHTML = '<option selected>' + esc(T.dealer) + '</option>';
    $('#w-dealer').setAttribute('title', 'Dealer #' + (f.dealerSel || '') + ' — the full dealer list is the Dealer Management view');
    $('#w-subject').value = f.subject || '';
    $('#w-status').innerHTML = opts(D.workStatus, f.status);
    /* Work Type: the export's option list is the marketing department's. Two of
       the five tickets carry a value from another department ("System Enhance",
       "Project"), so the selected value is added to the list rather than the
       select silently falling back to its first option. */
    var types = D.workType.slice();
    if (f.dep && types.indexOf(f.dep) < 0) types.push(f.dep);
    $('#w-type').innerHTML = opts(types, f.dep);
    $('#w-priority').innerHTML = opts(D.priority, f.priority);
    $('#w-name').value = f.name || '';
    $('#w-phone').value = f.phone || '';
    $('#w-hint').textContent = f.emailHint || 'who asked';
    $('#w-hint').className = 'grp__s' + (f.emails.length ? ' grp__s--client' : '');
    renderEmails();
    $('#w-begin').value = f.begin || '';
    $('#w-completion').value = f.completion || '';
    $('#w-wait').checked = !!f.waiting;
    $('#w-billable').checked = !!f.billableAmt;
    $('#w-amount').value = f.billableAmt || '';
    $('#w-msg').textContent = '';
    $('#w-msg').classList.remove('form__msg--bad');
  }
  function renderEmails() {
    var list = T.form.emails;
    $('#w-emails').innerHTML = list.map(function (e, n) {
      return '<div class="emails__r"><input class="fld" type="email" value="' + esc(e) + '" placeholder="email@example.com" name="email-' + n + '" aria-label="Email ' + (n + 1) + '">'
        + '<button class="rowx" type="button" data-rm-email="' + n + '" aria-label="Remove ' + esc(e) + '">' + ic('i-x') + '</button></div>';
    }).join('') + '<button class="rowadd" type="button" data-act="add-email">+ Add email</button>';
  }

  /* ══ THREAD ════════════════════════════════════════════════════════════ */
  var LANES = [
    { k: 'all', label: 'All' },
    { k: 'message', label: 'Messages' },
    { k: 'note', label: 'Internal notes' },
    { k: 'todo', label: 'ToDos' },
    { k: 'woc', label: 'Waiting on client' }
  ];
  var KINDW = { message: 'Message', note: 'Internal Note', todo: 'ToDo', woc: 'Waiting on Client' };
  var KINDI = { message: 'i-mail', note: 'i-note', todo: 'i-todo', woc: 'i-clock' };

  function laneCount(k) {
    if (k === 'all') return thread.length;
    return thread.filter(function (e) { return e.kind === k; }).length;
  }
  function renderLanes() {
    $('#thread-lanes').innerHTML = LANES.map(function (l) {
      return '<button class="lane ui-view' + (l.k === lane ? ' lane--on ui-view--on' : '') + '" type="button" data-lane="' + l.k
        + '" aria-pressed="' + (l.k === lane) + '">' + esc(l.label) + '<b>' + laneCount(l.k) + '</b></button>';
    }).join('');
    $$('.composer').forEach(function (c) {
      var on = lane === 'all' ? c.dataset.lane === 'note' : c.dataset.lane === lane;
      c.classList.toggle('composer--on', on);
    });
  }
  /* A thread you can answer. Alex asked for this: a note is a post, and a post
     can be replied to, so the history reads as a conversation instead of a
     transcript. The reply is an internal note that remembers what it answers —
     no new record type, no new field on the ticket. */
  var replyOpen = null;
  function replyBox(e) {
    return '<li class="rbox"><form class="rbox__f" data-reply-to="' + esc(e.id) + '">'
      + '<textarea class="rbox__t" name="body" rows="3" placeholder="Reply to ' + esc(e.who || 'this entry') + '…" aria-label="Reply"></textarea>'
      + '<div class="rbox__r"><span class="rbox__who">Internal note · visible to the crew, not the dealer</span>'
      + '<button class="btn btn--quiet btn--sm" type="button" data-reply-cancel>Cancel</button>'
      + '<button class="btn btn--primary btn--sm" type="submit">Post reply</button></div>'
      + '</form></li>';
  }

  function renderThread() {
    var rows = thread.filter(function (e) { return lane === 'all' || e.kind === lane; });
    var msgs = laneCount('message'), notes = laneCount('note'), todos = laneCount('todo');
    $('#thread-s').textContent = msgs + ' client-visible · ' + notes + ' internal · ' + todos + ' ToDos';
    $('#thread').innerHTML = rows.map(function (e) {
      var w = splitWhen(e.when);
      var long = e.body && e.body.length > 420;
      var atts = e.atts && e.atts.length
        ? '<div class="evatt">Attachments: ' + e.atts.map(function (a) {
            return '<span class="evatt__f">' + ic('i-file') + esc(a) + ' <em>(file missing)</em></span>';
          }).join('') + '</div>'
        : '';
      return '<li class="ev ev--' + e.kind + (e.replyTo ? ' ev--reply' : '') + '" data-ev="' + esc(e.id) + '">'
        + '<span class="ev__i">' + ic(KINDI[e.kind]) + '</span>'
        + '<div class="ev__b">'
        + '<div class="ev__t"><span class="kind">' + esc(KINDW[e.kind]) + '</span><span class="who">' + esc(e.who || '—') + '</span></div>'
        + (e.body ? '<span class="ev__n' + (long && !e.open ? ' ev__n--clamp' : '') + '">' + esc(e.body) + '</span>' : '')
        + (long ? '<button class="ev__more" type="button" data-more="' + esc(e.id) + '">' + (e.open ? 'Show less' : 'Show all') + '</button>' : '')
        + atts
        + '<div class="ev__acts"><button class="ev__reply" type="button" data-reply="' + esc(e.id) + '">'
        + ic('i-hist') + 'Reply</button></div>'
        + '</div>'
        + '<div class="ev__d">' + esc(w.d) + '<small>' + esc(w.t) + '</small></div>'
        + '</li>'
        + (replyOpen === e.id ? replyBox(e) : '');
    }).join('');
    $('#thread-empty').hidden = rows.length > 0;
  }

  /* ══ CHANGELOG — the same timeline, on field changes ═══════════════════ */
  var CLOGI = {
    assignment_completed: 'i-check', hourly_spent_time: 'i-clock',
    hourly_estimated_time: 'i-clock', billable: 'i-cash',
    date_to_complete: 'i-cal', date_to_start: 'i-cal',
    completion_date_changed: 'i-cal', note_deleted: 'i-note',
    ticket_created: 'i-plus', completion: 'i-check', employee_assigned: 'i-user'
  };
  function renderClog() {
    $('#clog-s').textContent = T.clog.length
      ? T.clog.length + (T.clog.length === 1 ? ' field change' : ' field changes')
      : 'no field on this ticket has been changed';
    $('#clog-feed').innerHTML = T.clog.map(function (e) {
      var w = e.when.split(' ');
      var has = e.prev !== '' && e.prev !== '—';
      return '<li class="ev ev--field">'
        + '<span class="ev__i">' + ic(CLOGI[e.key] || 'i-hist') + '</span>'
        + '<div class="ev__b">'
        + '<div class="ev__t"><span class="who">' + esc(e.field) + '</span><span class="by">by ' + esc(e.who) + '</span></div>'
        + (has ? '<span class="prev">was ' + esc(e.prev) + '</span>' : '<span class="prev prev--none">no previous value</span>')
        + (e.assignee && e.assignee !== '—' ? '<div class="for">for <b>' + esc(e.assignee) + '</b></div>' : '')
        + '</div>'
        + '<div class="ev__d">' + esc(w[0]) + '<small>' + esc(w[1] || '') + '</small></div>'
        + '</li>';
    }).join('');
    $('#clog-empty').hidden = T.clog.length > 0;
    /* production ships the changelog collapsed unless it was left open */
    setClog(!!T.clogOpen);
  }
  function setClog(on) {
    var b = $('[data-act="clog"]');
    $('#clog').hidden = !on;
    b.setAttribute('aria-expanded', String(on));
    $('[data-clog-label]').textContent = on ? 'Hide' : 'Show';
    sizeExtender();
  }

  /* ══ ATTACHMENTS ═══════════════════════════════════════════════════════ */
  function renderAtts() {
    $('#atts-s').textContent = T.atts.length
      ? T.atts.length + (T.atts.length === 1 ? ' file' : ' files')
      : 'no attachments on this ticket';
    $('#atts-src').hidden = !T.atts.length;
    $('#atts').innerHTML = T.atts.length
      ? T.atts.map(function (a) {
          return '<div class="att">' + ic('i-file')
            + '<span class="att__f">' + esc(a.file) + '<span class="att__gone">file missing</span></span>'
            + '<span class="att__m">' + esc(a.by) + '</span></div>';
        }).join('')
      : '<p class="empty"><b>No attachments on this ticket</b><span>Files posted with a message or a note appear here.</span></p>';
  }

  /* ══ CREW ══════════════════════════════════════════════════════════════ */
  function renderCrew() {
    var done = crew.filter(function (c) { return c.done; }).length;
    $('#crew-cnt').textContent = crew.length;
    $('#dock-c').textContent = done + ' of ' + crew.length + ' complete';
    $('#crew').innerHTML = crew.map(function (c, n) {
      var sh = toHours(c.spent), eh = toHours(c.est);
      var unassigned = c.name === 'Not assigned';
      return '<div class="cc' + (c.done ? ' cc--done' : '') + '" data-cc="' + n + '">'
        + '<div class="cc__r1">'
        + '<input class="ring" type="checkbox" data-done="' + n + '" name="done-' + n + '"' + (c.done ? ' checked' : '')
        + ' aria-label="Mark ' + esc(c.name) + ' complete">'
        + '<span class="cc__num' + (c.ranked ? ' cc__num--ranked' : '') + '"'
        + (c.ranked ? ' title="queue rank"' : ' title="no queue rank"') + '>' + esc(c.num) + '</span>'
        + '<span class="cc__n">' + esc(c.name) + '</span>'
        + '</div>'
        + (c.meta ? '<div class="cc__m">' + esc(c.meta) + '</div>'
                  : (unassigned ? '<div class="cc__m">no assignment recorded yet</div>' : ''))
        + '<div class="cc__ctl">'
        + '<span class="tm"><span class="tm__k">Spent</span>'
        + '<input class="fld" type="text" value="' + esc(c.spent) + '" placeholder="—" data-spent="' + n + '" name="spent-' + n + '" aria-label="Time spent for ' + esc(c.name) + '">'
        + '<span class="tm__echo">' + (sh ? '= ' + dec(sh) : '') + '</span></span>'
        + '<span class="tm tm--narrow"><span class="tm__k">Est.</span>'
        + '<input class="fld" type="text" value="' + esc(c.est) + '" placeholder="—" data-est="' + n + '" name="est-' + n + '" aria-label="Estimated time for ' + esc(c.name) + '">'
        + '<span class="tm__echo">' + (eh ? '= ' + dec(eh) : '') + '</span></span>'
        + '<button class="cc__disc" type="button" data-dates="' + n + '" aria-expanded="' + c.dates + '">Dates' + ic('i-chev') + '</button>'
        + '</div>'
        + (c.dates
            ? '<div class="cc__dates">'
              + '<label>Begin<input class="fld" type="date" value="' + esc(c.begin) + '" data-begin="' + n + '" name="begin-' + n + '"></label>'
              + '<label>Done by<input class="fld" type="date" value="' + esc(c.doneBy) + '" data-doneby="' + n + '" name="doneby-' + n + '"></label>'
              + '</div>'
            : '')
        + '</div>';
    }).join('');

    /* the crew footer is the sum of what is in the cards, recomputed — not the
       export's printed string, which would stop being true on the first edit */
    var ts = 0, te = 0, any = false, anyE = false;
    crew.forEach(function (c) {
      var s = toHours(c.spent), e = toHours(c.est);
      if (s && !isNaN(s)) { ts += s; any = true; }
      if (e && !isNaN(e)) { te += e; anyE = true; }
    });
    var all = crew.length > 0 && done === crew.length;
    $('#crewfoot').innerHTML =
      '<span>Spent <b>' + (any ? hhmm(ts) + ' (' + dec(ts) + ')' : '—') + '</b></span>'
      + '<span>Est. <b>' + (anyE ? hhmm(te) + ' (' + dec(te) + ')' : '—') + '</b></span>'
      + '<span class="crewfoot__done' + (all ? ' crewfoot__done--all' : '') + '">'
      + (all ? ic('i-check') : '') + done + ' / ' + crew.length + '</span>';

    $('#follow').innerHTML = followers.length
      ? followers.map(function (f, n) {
          return '<span class="fchip">' + esc(f) + '<button class="fchip__x" type="button" data-unfollow="' + n
            + '" aria-label="Unfollow ' + esc(f) + '">' + ic('i-x') + '</button></span>';
        }).join('')
      : 'no followers yet';

    var assigned = crew.map(function (c) { return c.name; });
    $('#new-assignee').innerHTML = '<option value="">Assign to…</option>'
      + D.staff.filter(function (s) { return assigned.indexOf(s) < 0; })
        .map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
    $('#new-follower').innerHTML = '<option value="">Add follower…</option>'
      + D.staff.filter(function (s) { return followers.indexOf(s) < 0; })
        .map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');

    /* the ToDo assignee list is the crew, exactly as production restricts it —
       and when there is no crew it says so in the option, as the export does */
    var who = crew.filter(function (c) { return c.name !== 'Not assigned'; }).map(function (c) { return c.name; });
    $('#in-todo-who').innerHTML = who.length
      ? '<option value="">Select assignee</option>' + who.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('')
      : '<option value="">Assignment(s) needed before ToDo Notes can be created</option>';
    $('#in-todo-who').disabled = !who.length;
    $('#c-todo button[type="submit"]').disabled = !who.length;

    $('#in-flag-who').innerHTML = '<option value="">Select someone</option>'
      + D.staff.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');

    checkDirty();
  }

  function setDirty(on) {
    $('#app').classList.toggle('crew-dirty', on);
    $('#crew-note').textContent = on ? 'Unsaved crew changes' : 'No unsaved changes';
    $('[data-act="crew-discard"]').disabled = !on;
    $('[data-act="crew-save"]').disabled = !on;
  }
  function checkDirty() { setDirty(nowCrew() !== cleanCrew()); }

  /* ══ RENDER ════════════════════════════════════════════════════════════ */
  function render() {
    renderHead(); renderPulse(); renderRail();
    renderWork();
    renderLanes(); renderThread();
    renderClog(); renderAtts();
    renderCrew(); renderSecnav();
    $('#legend-ex').textContent = D.timeHelp;
    sizeExtender(); syncNav();
  }

  /* ══ THE SECTION ANCHOR (DESIGN.md §8) ═════════════════════════════════ */
  function anchorOf(sec) {
    return Math.max(0, Math.round(sec.getBoundingClientRect().top + window.scrollY - stack() - anchorGap()));
  }
  function goTo(sec) {
    if (!sec) return;
    sizeExtender();
    window.scrollTo({ top: anchorOf(sec), behavior: reduced() ? 'auto' : 'smooth' });
  }
  /* Without the extender the last section can never reach the anchor, because
     the document simply ends first. Measured with itself at zero so it never
     chases its own contribution. Load-bearing even when it computes to 0. */
  function sizeExtender() {
    var sp = $('#sec-space'), last = $$('.sec').pop();
    if (!sp || !last) return;
    sp.style.height = '0px';
    var need = anchorOf(last) - (document.documentElement.scrollHeight - window.innerHeight);
    sp.style.height = need > 0 ? Math.ceil(need) + 'px' : '0px';
  }
  /* Which section am I in — measured against the VIEWPORT, not `offsetTop`.
     `offsetTop` on a `.sec` is relative to the field, which starts hundreds of
     pixels down the document, so comparing it to scrollY is wrong by exactly
     that offset. A rect top against the anchor line needs no origin at all. */
  function syncNav() {
    var line = stack() + anchorGap() + 1, cur = null;
    $$('.sec').forEach(function (s) { if (s.getBoundingClientRect().top <= line) cur = s.id; });
    if (!cur) cur = ($$('.sec')[0] || {}).id;
    $$('.secnav__b').forEach(function (b) {
      var on = b.dataset.sec === cur;
      b.classList.toggle('secnav__b--on', on);
      if (on) { b.setAttribute('aria-current', 'true'); } else { b.removeAttribute('aria-current'); }
    });
  }
  /* engaged state, published in two places by one handler */
  var engaged = null;
  function onScroll() {
    var band = $('#band'), app = $('#app');
    var on = band.getBoundingClientRect().top <= px('--stick-bar') + 0.5;
    if (on !== engaged) {
      engaged = on;
      band.classList.toggle('cmd--stuck', on);
      app.classList.toggle('is-stuck', on);
    }
    syncNav();
  }

  /* ══ RECORD NAVIGATION ═════════════════════════════════════════════════ */
  function go(n) {
    if (n < 0 || n >= TICKETS.length) return;
    idx = n; T = TICKETS[idx];
    seed();
    history.replaceState(null, '', '?id=' + T.tid);
    render();
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  }

  /* ══ MENUS AND THE DOCK ════════════════════════════════════════════════ */
  function closePops(except) {
    $$('.pop--open').forEach(function (p) {
      if (p === except) return;
      p.classList.remove('pop--open');
      var b = $('[data-pop="' + p.id + '"]');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  function toggleDock(open) {
    var app = $('#app');
    var on = open == null ? !app.classList.contains('dock-open') : open;
    app.classList.toggle('dock-open', on);
    $$('[data-act="dock"]').forEach(function (b) {
      b.classList.toggle('facet__b--on', on);
      b.classList.toggle('btn--on', on);
      b.setAttribute('aria-expanded', String(on));
    });
    sizeExtender();
  }

  /* ══ POSTING ═══════════════════════════════════════════════════════════ */
  function post(kind, inputId) {
    var el = $('#' + inputId);
    var text = el.value.trim();
    if (!text) { el.classList.add('fld--bad'); el.focus(); return; }
    el.classList.remove('fld--bad');
    var when = stamp(new Date());
    thread.unshift({
      id: kind + '-new-' + Date.now(), kind: kind, who: D.me.name,
      when: when, body: text, atts: [], k: key(when), open: false
    });
    el.value = '';
    if (lane !== 'all' && lane !== kind) lane = kind;
    renderLanes(); renderThread(); renderSecnav(); sizeExtender();
  }

  function postReply(parentId, text) {
    text = (text || '').trim();
    if (!text) return false;
    var when = stamp(new Date());
    var at = -1;
    thread.forEach(function (x, i) { if (x.id === parentId) at = i; });
    var entry = {
      id: 'note-reply-' + Date.now(), kind: 'note', who: D.me.name,
      when: when, body: text, atts: [], k: key(when), open: false, replyTo: parentId
    };
    /* directly under what it answers, not at the top of the list */
    if (at >= 0) thread.splice(at + 1, 0, entry); else thread.unshift(entry);
    replyOpen = null;
    renderLanes(); renderThread(); renderSecnav(); sizeExtender();
    return true;
  }

  /* ══ EVENTS ════════════════════════════════════════════════════════════ */
  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-reply]'))) {
      replyOpen = replyOpen === el.dataset.reply ? null : el.dataset.reply;
      renderThread(); sizeExtender();
      var box = $('.rbox__t'); if (box) box.focus();
      return;
    }
    if (t.closest('[data-reply-cancel]')) { replyOpen = null; renderThread(); sizeExtender(); return; }

    if ((el = t.closest('[data-pop]'))) {
      var pop = $('#' + el.dataset.pop);
      var on = !pop.classList.contains('pop--open');
      closePops(on ? pop : null);
      pop.classList.toggle('pop--open', on);
      el.setAttribute('aria-expanded', String(on));
      return;
    }
    if (!t.closest('.pop')) closePops();

    if ((el = t.closest('[data-sec]'))) { e.preventDefault(); goTo($('#' + el.dataset.sec)); return; }
    if (t.closest('[data-act="prev"]')) { go(idx - 1); return; }
    if (t.closest('[data-act="next"]')) { go(idx + 1); return; }
    if (t.closest('[data-act="print"]')) { window.print(); return; }
    if (t.closest('[data-act="dock"]')) { toggleDock(); return; }
    if (t.closest('[data-act="close"]')) { toggleDock(false); return; }

    if ((el = t.closest('[data-act="clog"]'))) { setClog(el.getAttribute('aria-expanded') !== 'true'); return; }

    if ((el = t.closest('[data-lane]'))) { lane = el.dataset.lane; renderLanes(); renderThread(); sizeExtender(); return; }
    if (t.closest('[data-act="lane-woc"]')) { lane = 'woc'; renderLanes(); renderThread(); $('#in-woc').focus({ preventScroll: true }); return; }

    if ((el = t.closest('[data-more]'))) {
      var id = el.dataset.more;
      thread.forEach(function (x) { if (x.id === id) x.open = !x.open; });
      renderThread(); sizeExtender();
      return;
    }

    if ((el = t.closest('[data-rm-email]'))) { T.form.emails.splice(+el.dataset.rmEmail, 1); renderEmails(); return; }
    if (t.closest('[data-act="add-email"]')) { T.form.emails.push(''); renderEmails(); $$('#w-emails .fld').pop().focus(); return; }

    if ((el = t.closest('[data-dates]'))) {
      var n = +el.dataset.dates;
      crew[n].dates = !crew[n].dates;
      renderCrew(); sizeExtender();
      return;
    }
    if ((el = t.closest('[data-unfollow]'))) { followers.splice(+el.dataset.unfollow, 1); renderCrew(); return; }
    if (t.closest('[data-act="add-follower"]')) {
      var fv = $('#new-follower').value;
      if (fv) { followers.push(fv); renderCrew(); }
      return;
    }
    if (t.closest('[data-act="add-crew"]')) {
      var av = $('#new-assignee').value;
      if (!av) return;
      /* a new assignment has no rank, no history and no time — production shows
         exactly that, and nothing is invented to fill the card */
      if (crew.length === 1 && crew[0].name === 'Not assigned') crew = [];
      crew.push({ aid: 'new-' + Date.now(), name: av, num: '#0', ranked: false, meta: '', done: false, spent: '', est: '', begin: '', doneBy: '', dates: false });
      renderCrew(); sizeExtender();
      return;
    }
    if (t.closest('[data-act="crew-discard"]')) { seedCrewOnly(); renderCrew(); sizeExtender(); return; }
    if (t.closest('[data-act="crew-save"]')) {
      T.crew = crew.map(function (c) {
        return { aid: c.aid, name: c.name, num: c.num, ranked: c.ranked, meta: c.meta, done: c.done, spent: c.spent, spentEcho: '', est: c.est, begin: c.begin, doneBy: c.doneBy };
      });
      T.following = followers.slice();
      renderCrew();
      return;
    }
  });

  function seedCrewOnly() {
    crew = T.crew.map(function (c) {
      return { aid: c.aid, name: c.name, num: c.num, ranked: c.ranked, meta: c.meta, done: c.done, spent: c.spent, est: c.est, begin: c.begin, doneBy: c.doneBy, dates: false };
    });
    followers = T.following.slice();
  }

  document.addEventListener('change', function (e) {
    var t = e.target, n;
    if (t.hasAttribute && t.hasAttribute('data-done')) { n = +t.dataset.done; crew[n].done = t.checked; renderCrew(); return; }
    if (t.hasAttribute && t.hasAttribute('data-begin')) { crew[+t.dataset.begin].begin = t.value; checkDirty(); return; }
    if (t.hasAttribute && t.hasAttribute('data-doneby')) { crew[+t.dataset.doneby].doneBy = t.value; checkDirty(); return; }
  });

  document.addEventListener('input', function (e) {
    var t = e.target, n, card, echo, h;
    if (t.hasAttribute && t.hasAttribute('data-spent')) {
      n = +t.dataset.spent; crew[n].spent = t.value;
      h = toHours(t.value);
      card = t.closest('.tm'); echo = $('.tm__echo', card);
      t.classList.toggle('fld--bad', t.value !== '' && isNaN(h));
      echo.textContent = (h && !isNaN(h)) ? '= ' + dec(h) : (isNaN(h) ? 'not a time' : '');
      checkDirty();
      return;
    }
    if (t.hasAttribute && t.hasAttribute('data-est')) {
      n = +t.dataset.est; crew[n].est = t.value;
      h = toHours(t.value);
      card = t.closest('.tm'); echo = $('.tm__echo', card);
      t.classList.toggle('fld--bad', t.value !== '' && isNaN(h));
      echo.textContent = (h && !isNaN(h)) ? '= ' + dec(h) : (isNaN(h) ? 'not a time' : '');
      checkDirty();
      return;
    }
  });

  /* the four composers, each with the post action production gives it */
  document.addEventListener('submit', function (e) {
    var f = e.target.closest ? e.target.closest('form[data-reply-to]') : null;
    if (!f) return;
    e.preventDefault();
    var ta = f.querySelector('.rbox__t');
    if (!postReply(f.dataset.replyTo, ta.value)) { ta.classList.add('fld--bad'); ta.focus(); }
  }, true);

  $('#c-message').addEventListener('submit', function (e) { e.preventDefault(); post('message', 'in-message'); });
  $('#c-note').addEventListener('submit', function (e) { e.preventDefault(); post('note', 'in-note'); });
  $('#c-woc').addEventListener('submit', function (e) { e.preventDefault(); post('woc', 'in-woc'); });
  $('#c-todo').addEventListener('submit', function (e) { e.preventDefault(); post('todo', 'in-todo'); });

  /* the work order: required fields are stated in colour AND in words */
  $('#f-work').addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('#w-msg'), sub = $('#w-subject');
    $$('.fld--bad', $('#f-work')).forEach(function (x) { x.classList.remove('fld--bad'); });
    if (!sub.value.trim()) {
      sub.classList.add('fld--bad');
      msg.textContent = 'Subject is required.';
      msg.classList.add('form__msg--bad');
      sub.focus();
      return;
    }
    var f = T.form;
    f.subject = sub.value.trim();
    f.status = $('#w-status').value;
    f.dep = $('#w-type').value;
    f.priority = $('#w-priority').value;
    f.name = $('#w-name').value;
    f.phone = $('#w-phone').value;
    f.begin = $('#w-begin').value;
    f.completion = $('#w-completion').value;
    f.waiting = $('#w-wait').checked;
    f.billableAmt = $('#w-billable').checked ? ($('#w-amount').value || '0.00') : null;
    f.emails = $$('#w-emails .fld').map(function (x) { return x.value.trim(); }).filter(Boolean);
    T.subject = f.subject;
    msg.classList.remove('form__msg--bad');
    msg.textContent = 'Saved';
    renderHead();
    renderEmails();
  });
  $$('[data-act="save"]').forEach(function (b) {
    if (b.type === 'submit') return;
    b.addEventListener('click', function () {
      goTo($('#s-work'));
      $('#f-work').dispatchEvent(new Event('submit', { cancelable: true }));
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && $('.pop--open')) { closePops(); return; }
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) {
      e.preventDefault();
      $('.gsearch input').focus();
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { sizeExtender(); syncNav(); });

  seed();
  renderNav();
  render();
  onScroll();
})();
