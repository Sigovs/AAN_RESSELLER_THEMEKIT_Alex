/* AAN · Staff UI · Create A Ticket — GENERATION 11
   Test page #2 (Nov 17): the new backend's /work/tickets/new, a screen Gen 11 never drew, built only
   from the system. Single Ticket's page type and CSS in its "new and empty" state; the backend's own
   fields, lists (8 open work statuses, 46 work types, priorities, staff, dealers) and actions.
   A preview: nothing is saved. */
(function () {
  'use strict';
  var D = window.TK, MD = window.MD;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ic(id) { return '<svg class="i" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function opts(list, cur) { return list.map(function (v) { return '<option' + (v === cur ? ' selected' : '') + '>' + esc(v) + '</option>'; }).join(''); }

  /* the backend's lists on this screen (read from newbackendcert /work/tickets/new, Nov 17) */
  var STATUS = ['Pending', 'Support Open', 'Client Project Open', 'Client Project Holding', 'Marketing Project Open', 'Internal Project Open', 'Client Leads Open', 'Billing Open'];
  var TYPES = ['Please Set Work Type', 'Accounting', 'Billing Issues', 'Compliance', 'Dealer Shutdown', 'DNS Records/Settings', 'Email', 'Email Issues', 'Email Removal', 'Email Setup',
    'Feed - Fix/Update', 'Feed - Image Refresh', 'Feed - New', 'Feed - Shut Off', 'Fix', 'GD2 Project', 'Inventory Image Cutouts', 'Inventory Removal', 'Lead', 'Lead System Issue', 'Marketing',
    'Marketing - Analytics', 'Marketing - Copywriting', 'Marketing - Misc.', 'Marketing - PPC', 'Marketing - SEO', 'Marketing - Social Media', 'Marketing - Tag Manager', 'Marketing - Videos',
    'Misc.', 'Modification', 'New Billables', 'New Lead Contact', 'New Lead Quote', 'New Leads Contact', 'Past Due Accounts', 'Phone/Address Updates', 'Project', 'Quote',
    'Social Media Management', 'SSL Renewel/Setup', 'System Access', 'System Enhance', 'Training', 'Word Press Conversion'];   /* the backend lists "Misc." twice; once here */
  /* dealers: active + pending, as the backend's "Select dealer" list; junk rows from the export stay out */
  var DEALERS = MD.orderActive.map(function (id) { return MD.rows.filter(function (r) { return r.id === id; })[0]; })
    .filter(function (r) { return r && r.name && !/['";]|sleep\(/i.test(r.name); })
    .map(function (r) { return r.name; }).sort(function (a, b) { return a.localeCompare(b); });

  var S = { emails: [''], crew: [], followers: [], posts: { note: [], woc: [], todo: [] }, wocOpen: false };

  /* ── nav: the staff menus, as on every staff page; this page lives under Work ── */
  var NAV_HIDDEN = ['Add New OEM', 'View OEM Accounts', 'Add New Reseller Group', 'View Reseller Groups'];
  function renderNav() {
    $('#nav').innerHTML = D.nav.map(function (g, gi) {
      if (g.label === 'AAN Projects') return '';
      var items = g.items.filter(function (it) { return NAV_HIDDEN.indexOf(it.label) < 0; }).map(function (it) {
        var here = it.label === 'Create A Ticket';
        var href = here ? 'create-ticket-gen11.html' : it.label === 'My Work' ? 'my-work-queue-gen11.html' : it.label === 'View Dealers' ? 'manage-dealers-gen11.html' : '#';
        return '<a class="mn__it' + (it.kind === 'sub' ? ' mn__it--sub' : '') + '" href="' + href + '"' + (here ? ' aria-current="page"' : '') + '>' + esc(it.label) + (it.kind === 'ext' ? ic('i-ext') : '') + '</a>';
      }).join('');
      return '<div class="nav__it' + (g.label === 'Work' ? ' nav__it--on' : '') + '">'
        + '<button class="nav__b" type="button" data-pop="p-nav-' + gi + '" aria-haspopup="true" aria-expanded="false">' + esc(g.label) + ic('i-chev') + '</button>'
        + '<div class="pop" id="p-nav-' + gi + '"><div class="caps pop__lab">' + esc(g.label) + '</div>' + items + '</div></div>';
    }).join('');
  }

  /* ── board: the backend's five figures; they fill as the form does ── */
  function renderPulse() {
    var b = $('#w-begin').value, c = $('#w-completion').value, wait = $('#w-wait').checked;
    var bill = $('#w-billable').checked, amt = $('#w-amount').value.trim();
    var T = [
      ['Time spent', '—', 'no time logged'],
      ['Estimated', '—', 'no estimate set'],
      ['Assigned to', S.crew.length ? String(S.crew.length) : '—', S.crew.length ? (S.crew.length === 1 ? 'person' : 'people') : 'nobody yet'],
      ['Schedule', (b || '—') + ' → ' + (c || '—'), 'begin → completion'],
      ['Billable', bill ? (amt ? '$' + amt : 'Yes') : 'No', wait ? 'waiting on client' : 'not waiting on client']
    ];
    $('#pulse').innerHTML = T.map(function (t) {
      var none = t[1] === '—' || t[1] === '— → —';
      return '<div class="tile"><div class="tile__k">' + esc(t[0]) + '</div><div class="tile__v' + (none ? ' tile__v--none' : '') + '"><span class="tile__n">' + esc(t[1]) + '</span></div><div class="tile__s">' + esc(t[2]) + '</div></div>';
    }).join('');
  }

  /* ── work order ── */
  function renderForm() {
    $('#w-dealer').innerHTML = '<option value="" selected>Select dealer</option>' + opts(DEALERS);
    $('#w-status').innerHTML = opts(STATUS, 'Pending');
    $('#w-type').innerHTML = opts(TYPES, 'Please Set Work Type');
    $('#w-priority').innerHTML = opts(D.priority, '');
    renderEmails();
  }
  function renderEmails() {
    $('#w-emails').innerHTML = S.emails.map(function (e, n) {
      return '<div class="emails__r"><input class="fld" type="email" value="' + esc(e) + '" placeholder="email@example.com" name="email-' + n + '" data-email="' + n + '" aria-label="Email ' + (n + 1) + '">'
        + '<button class="rowx" type="button" data-rm-email="' + n + '" aria-label="Remove email ' + (n + 1) + '">' + ic('i-x') + '</button></div>';
    }).join('') + '<button class="rowadd" type="button" data-act="add-email">+ Add email</button>';
  }
  function create(e) {
    if (e) e.preventDefault();
    var miss = [];
    if (!$('#w-dealer').value) miss.push('a dealership');
    if (!$('#w-subject').value.trim()) miss.push('a subject');
    var m = $('#w-msg');
    m.classList.toggle('form__msg--err', !!miss.length);
    m.textContent = miss.length ? 'Choose ' + miss.join(' and ') : 'Preview — the ticket is not created';
    if (miss.length) (miss[0] === 'a dealership' ? $('#w-dealer') : $('#w-subject')).focus();
  }

  /* ── ticket history: posts made before the ticket exists are kept and saved with it ── */
  var KIND = { note: ['Internal note', 'i-note', 'Remove note'], woc: ['Waiting on client', 'i-clock', 'Remove note'], todo: ['ToDo', 'i-todo', 'Remove ToDo'] };
  function stamp() {
    var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }, h = d.getHours();
    return [p(d.getMonth() + 1) + '/' + p(d.getDate()) + '/' + d.getFullYear(), ((h % 12) || 12) + ':' + p(d.getMinutes()) + ' ' + (h < 12 ? 'AM' : 'PM')];
  }
  function renderPosts(kind) {
    var list = S.posts[kind];
    $('#tn-' + kind).textContent = list.length;
    $('#tf-' + kind).innerHTML = list.map(function (p, n) {
      return '<li class="ev ev--' + (kind === 'woc' ? 'note' : kind) + '"><span class="ev__i">' + ic(KIND[kind][1]) + '</span>'
        + '<div class="ev__b"><div class="ev__t"><span class="kind">' + KIND[kind][0] + '</span><span class="who">' + esc(D.me.name) + '</span>'
        + (p.who ? '<span class="who">for ' + esc(p.who) + '</span>' : '') + '</div><span class="ev__n">' + esc(p.text) + '</span>'
        + (p.files.length ? '<div class="evatt">Attachments: ' + p.files.map(function (f) { return '<span class="evatt__f">' + ic('i-clip') + esc(f) + '</span>'; }).join(' ') + '</div>' : '') + '</div>'
        + '<div class="ev__d">' + p.when[0] + '<small>' + p.when[1] + '</small></div>'
        + '<div class="ev__acts"><button class="ev__rm" type="button" data-rm-post="' + kind + ':' + n + '">' + KIND[kind][2] + '</button></div></li>';
    }).join('');
    renderSecnav();
  }
  function post(form) {
    var kind = form.getAttribute('data-kind'), ta = $('textarea', form), text = ta.value.trim();
    if (!text) { ta.focus(); return; }
    var who = kind === 'note' && $('#in-flag').checked ? $('#in-flag-who').value : kind === 'todo' ? $('#in-todo-who').value : '';
    S.posts[kind].push({ text: text, who: who, when: stamp(), files: picked(form) });
    ta.value = ''; clearDrop(form); renderPosts(kind);
  }
  /* files: Single Ticket's drop — it says what was picked, so a file is never posted unseen */
  function picked(form) { var i = form && form.querySelector('.drop input[type="file"]'); return i && i.files ? [].map.call(i.files, function (f) { return f.name; }) : []; }
  function clearDrop(form) {
    var d = form && form.querySelector('.drop'); if (!d) return;
    var i = d.querySelector('input[type="file"]'); if (i) i.value = '';
    d.classList.remove('drop--has'); var p = d.querySelector('.drop__picked'); if (p) p.remove();
  }
  document.addEventListener('change', function (e) {
    var inp = e.target; if (!inp.matches || !inp.matches('.drop input[type="file"]')) return;
    var d = inp.closest('.drop'), names = [].map.call(inp.files || [], function (f) { return f.name; });
    var p = d.querySelector('.drop__picked'); if (p) p.remove();
    d.classList.toggle('drop--has', names.length > 0);
    if (names.length) { p = document.createElement('span'); p.className = 'drop__picked'; p.innerHTML = '<span>' + esc(names.length + (names.length === 1 ? ' file: ' : ' files: ') + names.join(', ')) + '</span>'; d.appendChild(p); }
  });

  function setWoc(open) {
    S.wocOpen = open; $('#ts-woc').hidden = !open;
    var b = $('[data-act="woc"]'); b.setAttribute('aria-expanded', String(open));
    b.innerHTML = ic(open ? 'i-x' : 'i-plus') + (open ? ' Close waiting-on-client note' : ' Waiting-on-client note');
    renderSecnav();
    if (open) $('#in-woc').focus();
  }

  /* ── assigned to and following ── */
  function renderCrew() {
    $('#crew-cnt').textContent = S.crew.length;
    $('#dock-c').textContent = S.crew.length ? S.crew.length + (S.crew.length === 1 ? ' person' : ' people') : 'nobody yet';
    $('#crew').innerHTML = S.crew.length ? S.crew.map(function (name, n) {
      return '<div class="cc" data-cc="' + n + '"><div class="cc__r1"><span class="cc__num" title="no queue rank">#' + (n + 1) + '</span><span class="cc__n">' + esc(name) + '</span>'
        + '<button class="rowx" type="button" data-rm-crew="' + n + '" aria-label="Remove ' + esc(name) + '">' + ic('i-x') + '</button></div>'
        + '<div class="cc__ctl"><span class="tm tm--narrow"><span class="tm__k">Est.</span><input class="fld" type="text" placeholder="—" name="est-' + n + '" aria-label="Estimated time for ' + esc(name) + '"></span></div>'
        + '<div class="cc__dates"><label>Begin<input class="fld" type="date" name="begin-' + n + '"></label><label>Done by<input class="fld" type="date" name="doneby-' + n + '"></label></div></div>';
    }).join('') : '<p class="cc__none">Not assigned.</p>';
    $('#new-assignee').innerHTML = '<option value="">Assign to…</option>' + opts(D.staff.filter(function (s) { return S.crew.indexOf(s) < 0; }));
    $('#in-todo-who').innerHTML = S.crew.length ? opts(S.crew) : '<option value="">Assignment(s) needed before ToDo Notes can be created</option>';
    $('#in-todo-who').disabled = !S.crew.length;
    $('#c-todo button[type="submit"]').disabled = !S.crew.length;
    renderPulse();
  }
  function renderFollow() {
    $('#follow').textContent = S.followers.length ? S.followers.join(', ') : 'no followers yet';
    $('#new-follower').innerHTML = '<option value="">Add follower…</option>' + opts(D.staff.filter(function (s) { return S.followers.indexOf(s) < 0; }));
  }

  /* ── section navigator: the sections that exist, the one in view lit ── */
  function renderSecnav() {
    var secs = [['s-work', 'Work order', null], ['ts-message', 'Messages', 'message'], ['ts-note', 'Internal notes', 'note']]
      .concat(S.wocOpen ? [['ts-woc', 'Waiting on client', 'woc']] : []).concat([['ts-todo', 'ToDos', 'todo']]);
    var cur = ($('#secnav .secnav__b--on') || {}).getAttribute ? $('#secnav .secnav__b--on').getAttribute('data-sec') : 's-work';
    $('#secnav').innerHTML = secs.map(function (s) {
      var n = s[2] === 'message' ? ($('#in-message').value.trim() ? 1 : 0) : s[2] ? S.posts[s[2]].length : null;
      var on = s[0] === cur;
      return '<a class="secnav__b ui-view' + (on ? ' secnav__b--on ui-view--on' : '') + (s[2] ? ' secnav__b--tone' : '') + '" href="#' + s[0] + '" data-sec="' + s[0] + '"'
        + (s[2] ? ' data-tone="' + s[2] + '"' : '') + (on ? ' aria-current="true"' : '') + '>' + esc(s[1]) + (n === null ? '' : '<b>' + n + '</b>') + '</a>';
    }).join('');
  }
  function syncNav() {
    var line = 160, cur = 's-work';
    $$('.sec, .tsec').forEach(function (s) { if (!s.hidden && s.getBoundingClientRect().top <= line) cur = s.id; });
    if (cur === 's-thread') cur = 'ts-message';
    $$('#secnav .secnav__b').forEach(function (a) {
      var on = a.getAttribute('data-sec') === cur;
      a.classList.toggle('secnav__b--on', on); a.classList.toggle('ui-view--on', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  /* ── popovers and actions ── */
  function closePops(except) {
    $$('.pop--open').forEach(function (p) {
      if (p === except) return;
      p.classList.remove('pop--open');
      var t = $('[data-pop="' + p.id + '"]'); if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-pop]'), el;
    if (t) {
      var p = document.getElementById(t.getAttribute('data-pop')), open = !p.classList.contains('pop--open');
      closePops(open ? p : null); p.classList.toggle('pop--open', open); t.setAttribute('aria-expanded', String(open)); return;
    }
    if (e.target.closest('[data-act="add-email"]')) { S.emails.push(''); renderEmails(); $('[data-email="' + (S.emails.length - 1) + '"]').focus(); return; }
    if ((el = e.target.closest('[data-rm-email]'))) { S.emails.splice(+el.getAttribute('data-rm-email'), 1); if (!S.emails.length) S.emails.push(''); renderEmails(); return; }
    if (e.target.closest('[data-act="create"]')) { $('#s-work').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); create(); return; }
    if (e.target.closest('[data-act="woc"]')) { setWoc(!S.wocOpen); return; }
    if ((el = e.target.closest('[data-rm-post]'))) {
      var k = el.getAttribute('data-rm-post').split(':');
      if (window.confirm('Remove this ' + (k[0] === 'todo' ? 'ToDo' : 'note') + '?')) { S.posts[k[0]].splice(+k[1], 1); renderPosts(k[0]); }
      return;
    }
    if (e.target.closest('[data-act="add-crew"]')) { var a = $('#new-assignee').value; if (a) { S.crew.push(a); renderCrew(); } return; }
    if ((el = e.target.closest('[data-rm-crew]'))) { S.crew.splice(+el.getAttribute('data-rm-crew'), 1); renderCrew(); return; }
    if (e.target.closest('[data-act="add-follower"]')) { var f = $('#new-follower').value; if (f) { S.followers.push(f); renderFollow(); } return; }
    if (e.target.closest('[data-act="dock"]')) { var on = !$('#app').classList.contains('dock-open'); $('#app').classList.toggle('dock-open', on); $('[data-act="dock"]').setAttribute('aria-expanded', String(on)); return; }
    if (e.target.closest('[data-act="close"]')) { $('#app').classList.remove('dock-open'); $('[data-act="dock"]').setAttribute('aria-expanded', 'false'); return; }
    if (e.target.closest('a[href="#"]')) e.preventDefault();
    if (!e.target.closest('.pop')) closePops(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePops(null);
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) { e.preventDefault(); $('.gsearch input').focus(); }
  });
  $('#f-work').addEventListener('submit', create);
  $$('form.composer').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); post(f); }); });
  $('#f-work').addEventListener('input', function (e) {
    if (e.target.matches('[data-email]')) S.emails[+e.target.getAttribute('data-email')] = e.target.value;
    if ($('#w-msg').classList.contains('form__msg--err') && $('#w-dealer').value && $('#w-subject').value.trim()) { $('#w-msg').textContent = ''; $('#w-msg').classList.remove('form__msg--err'); }
    renderPulse();
  });
  $('#f-work').addEventListener('change', renderPulse);
  $('#in-message').addEventListener('input', renderSecnav);
  window.addEventListener('scroll', syncNav, { passive: true });

  /* the time examples, as Single Ticket shows them */
  $('#legend-ex').innerHTML = String(D.timeHelp || '').replace(/^[^:]*:/, '').split('|').map(function (p) {
    var kv = p.split('='); return kv.length < 2 ? '' : '<div><dt>' + esc(kv[0].trim()) + '</dt><dd>' + esc(kv[1].trim()) + '</dd></div>';
  }).join('');
  $('#in-flag-who').innerHTML = '<option value="">Select someone</option>' + opts(D.staff);

  renderNav(); renderForm(); renderCrew(); renderFollow(); renderPulse(); renderSecnav();
})();
