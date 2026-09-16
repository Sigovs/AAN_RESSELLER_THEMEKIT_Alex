/* Single Lead — Gen 10. Renders one lead from the All leads demo set (?id=…, default the newest) with the dossier's own
   parts: back / prev-next / name · status · #id / Email / Note; the buyer's message; vehicle of interest (looked up in the
   inventory set for its photo); contact & address; trade-in; activity with notes and the raw ADF; emails; and the right
   rail — workflow, lead facts, UTM trace, newsletter — in the Dock. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (id) { return '<svg class="i"><use href="#' + id + '"/></svg>'; };
  var nf = function (n) { return Number(n).toLocaleString('en-US'); };
  var LEADS = window.LD.leads, CARS = window.G8 || [];
  var STCLS = { 'New Lead': 'new', 'Active Prospect': 'active', 'Hot': 'hot', 'Pending': 'pend', 'Sale Pending': 'pend', 'Trade Appraisal': 'trade', 'Long Term Lead': 'quiet', 'Just Looking': 'quiet', 'Bought Here': 'won' };
  function fd(iso) { var p = iso.slice(0, 10).split('-'); return p[1] + '/' + p[2] + '/' + p[0]; }
  function fdt(iso) { var d = new Date(iso); var p = function (n) { return (n < 10 ? '0' : '') + n; }; return fd(iso) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()); }
  function carOf(l) { if (!l.stock) return null; return CARS.filter(function (c) { return c.s === l.stock; })[0] || null; }

  var idx = Math.max(0, LEADS.findIndex(function (l) { return String(l.id) === (new URLSearchParams(location.search).get('id') || ''); }));
  var L = LEADS[idx];
  var acts = [], emails = [];

  function seedActs() {
    acts = []; emails = [];
    var who = L.rep === 'Unassigned' ? window.LD.totals.dealer : L.rep;
    if (L.act) acts.push({ d: fdt(L.act.d + 'T10:20'), a: L.act.k, n: L.act.k === 'Comments Added' ? 'Called back, wants photos of the interior and the service records.' : L.act.k === 'Email Sent' ? '<subject>' + (L.car || 'Your enquiry') + '</subject>' : L.act.k === 'Status Changed' ? 'New Lead → ' + L.status : '', r: who });
    for (var i = 0; i < L.emails; i++) { var out = i % 2 === 0; emails.push({ dir: out ? 'OUT' : 'IN', d: fdt(new Date(new Date(L.created).getTime() + (i + 1) * 5.5 * 3600000).toISOString()), s: (out ? '' : 'Re: ') + (L.car || 'Your enquiry'), w: out ? L.name : who }); if (out) acts.push({ d: emails[i].d, a: 'Email Sent', n: '<emailid>' + (1500 + i) + '</emailid><subject>' + (L.car || 'Your enquiry') + '</subject>', r: who }); }
    for (var k = 0; k < L.notes; k++) acts.push({ d: fdt(new Date(new Date(L.created).getTime() + (k + 2) * 26 * 3600000).toISOString()), a: 'Comments Added', n: ['Left a voicemail.', 'Sent the Carfax and window sticker.', 'Buyer is out of state — arranging shipping quote.'][k % 3], r: who });
    acts.sort(function (a, b) { return a.d < b.d ? 1 : -1; }); emails.sort(function (a, b) { return a.d < b.d ? 1 : -1; });
  }

  function render() {
    var car = carOf(L), st = STCLS[L.status] || 'quiet';
    document.title = L.name + ' · Lead #' + L.id + ' — AAN (Gen 10)';
    $('#h-name').textContent = L.name; $('#h-status').className = 'stat stat--' + st; $('#h-status').textContent = L.status; $('#h-id').textContent = '#' + L.id;
    $('[data-act="prev"]').disabled = idx === 0; $('[data-act="next"]').disabled = idx >= LEADS.length - 1;
    // bento — the message
    $('#quote').textContent = L.msg;
    $('#f-via').textContent = 'via ' + L.provider;
    $('#ident').innerHTML = '<div class="ident__row"><span class="mono"><b>' + esc(L.email) + '</b></span><button type="button" data-copy="' + esc(L.email) + '" title="Copy email" aria-label="Copy email">' + ic('i-file') + '</button><span class="sep">·</span>' + (L.phone ? '<span class="mono"><b>' + esc(L.phone) + '</b></span><button type="button" data-copy="' + esc(L.phone) + '" title="Copy phone" aria-label="Copy phone">' + ic('i-file') + '</button>' : '<span>no phone</span>') + '</div>' +
      '<div class="ident__row"><span><b>' + esc(L.src) + '</b></span><span class="sep">·</span><span class="mono">' + esc(L.type) + '</span><span class="sep">·</span><span>created <b>' + fdt(L.created) + '</b></span></div>';
    var qm = $('[data-act="quote-more"]'); $('#quote').classList.remove('quote--full'); requestAnimationFrame(function () { var q = $('#quote'); qm.hidden = q.scrollHeight <= q.clientHeight + 2; qm.textContent = 'Show full message'; });
    // vehicle inset
    $('#vcar').className = 'agemix vcar' + (L.car ? '' : ' vcar--none');
    $('#vcar').innerHTML = L.car ? '<div class="vcar__img">' + (car && car.t ? '<img src="img/' + esc(car.t) + '" alt="">' : ic('i-cam-off')) + '<span class="st' + (car && car.sold ? ' st--sold' : '') + '">' + (car && car.sold ? 'Sold' : 'Available') + '</span></div><div class="vcar__t" title="' + esc(L.car) + '">' + esc(L.car) + '</div><div class="vcar__m">' + (L.stock ? 'Stock ' + esc(L.stock) : 'no stock #') + '</div><div class="vcar__m">' + (car ? 'VIN ' + esc(car.vin) : '') + '</div><div class="vcar__acts"><a class="p" href="all-vehicles-gen10.html">Open in Inventory →</a><button type="button" data-act="change-veh">Change…</button></div>'
      : '<div class="vcar__img">' + ic('i-cam-off') + '</div><div class="vcar__t">No vehicle of interest</div><div class="vcar__m">attach one from the inventory</div><div class="vcar__m"></div><div class="vcar__acts"><button type="button" class="p" data-act="change-veh">Search Inventory</button></div>';
    $('#vcar').insertAdjacentHTML('afterbegin', '<div class="vcar__cap">Vehicle of interest</div>');
    // counts module — the dossier's own tab counters: activity entries, emails, notes
    var noteCount = acts.filter(function (a) { return /Comment|Note/i.test(a.a); }).length;
    $('#wf-kv').innerHTML = '<div><div class="v">' + acts.length + '</div><div class="l">activity entries</div></div>'
      + '<div><div class="v">' + emails.length + '</div><div class="l">emails in + out</div></div>'
      + '<div><div class="v">' + noteCount + '</div><div class="l">notes</div></div>';
    // lead facts — the dossier's own block, exactly the fields the export carries
    var lastEmail = emails.length ? emails[0].d.slice(0, 5) : '—', modified = acts.length ? acts[0].d.slice(0, 5) : '—';
    var facts = [['Source', L.src], ['Type', L.type, 1], ['Vendor', window.LD.totals.dealer], ['Provider', L.provider],
      ['Created', fdt(L.created)], ['Modified', modified === '—' ? '—' : acts[0].d], ['Last email', lastEmail === '—' ? '—' : emails[0].d], ['IP', (70 + idx % 30) + '.' + (69 + idx) + '.13.' + (16 + idx), 1]];
    $('#tl-g').innerHTML = facts.map(function (f) { return '<div class="fact"><span class="fact__l">' + f[0] + '</span><span class="fact__v' + (f[2] ? ' mono' : '') + '" title="' + esc(f[1]) + '">' + esc(f[1]) + '</span></div>'; }).join('');
    $('#tl-s').textContent = L.src + ' · via ' + L.provider;
    // section counts
    $('#n-act').textContent = acts.length; $('#n-em').textContent = emails.length; $('#act-s').textContent = acts.length + ' entries'; $('#em-s').textContent = emails.length + ' emails';
    // overview card + vehicle form
    $('#vcard').innerHTML = L.car ? (car && car.t ? '<img src="img/' + esc(car.t) + '" alt="">' : '<div class="none">' + ic('i-cam-off') + '</div>') + '<div><b>' + esc(L.car) + '<span class="st' + (car && car.sold ? ' st--sold' : '') + '">' + (car && car.sold ? 'Sold' : 'Available') + '</span></b><span class="m">' + (L.stock ? 'Stock ' + esc(L.stock) : 'no stock #') + (car ? ' · VIN ' + esc(car.vin) + ' · ' + esc(car.c) + (car.p ? ' · price ' + nf(car.p) : ' · price —') : '') + '</span><div class="acts2"><a class="btn btn--primary btn--sm" href="all-vehicles-gen10.html">Open in Inventory →</a><button class="btn btn--sheet btn--sm" type="button" data-act="change-veh">Change vehicle…</button><button class="btn btn--sheet btn--sm" type="button" data-act="edit-veh">Edit fields</button><button class="btn btn--quiet btn--sm" type="button" data-act="remove-veh">Remove vehicle</button></div></div>'
      : '<div class="none">' + ic('i-cam-off') + '</div><div><b>No vehicle of interest</b><span class="m">use the search below to attach one</span></div>';
    var vf = $('#f-vehicle'); var parts = (L.car || '').split(' ');
    var set = function (form, name, v) { var el = form.querySelector('[name="' + name + '"]'); if (el) el.value = v == null ? '' : v; };
    set(vf, 'stock', L.stock); set(vf, 'type', car ? 'Used' : ''); set(vf, 'year', parts[0] || ''); set(vf, 'make', parts[1] || ''); set(vf, 'model', parts.slice(2).join(' ')); set(vf, 'vin', car ? car.vin : ''); set(vf, 'mileage', ''); set(vf, 'price', car && car.p ? car.p : ''); set(vf, 'int', ''); set(vf, 'ext', car ? car.c : '');
    // contact form
    var cf = $('#f-contact'), nm = L.name.split(' ');
    set(cf, 'first', nm[0]); set(cf, 'last', nm.slice(1).join(' ')); set(cf, 'email', L.email); set(cf, 'day', L.phone); set(cf, 'city', L.city.split(',')[0]); set(cf, 'state', (L.city.split(',')[1] || '').trim()); set(cf, 'country', 'USA'); set(cf, 'message', L.msg);
    // trade-in
    var trade = /tradein|consignment/.test(L.type);
    $('#trade-s').textContent = trade ? (L.type === 'consignment' ? 'consignment' : 'trade-in') + ' submitted with the lead' : 'no trade-in on this lead';
    $('[data-act="add-trade"]').hidden = trade;
    $('#trade-b').innerHTML = trade ? '<form class="form" onsubmit="return false"><div class="kind"><span class="caps">Kind</span><label><input type="radio" name="kind"' + (L.type !== 'consignment' ? ' checked' : '') + '> Tradein</label><label><input type="radio" name="kind"' + (L.type === 'consignment' ? ' checked' : '') + '> Consignment</label></div><div class="grid4">' + [['Year', '2019'], ['Make', 'BMW'], ['Model', 'M4'], ['VIN', ''], ['Mileage', '31,200'], ['Body Style', 'Coupe'], ['Trim', 'Competition'], ['Ext. Color', 'Black Sapphire'], ['Int. Color', 'Black'], ['Cylinders', '6'], ['Liters', '3.0'], ['Transfer Type', ''], ['Lien Holder', ''], ['Estimated Payoff', ''], ['Additional Options', '']].map(function (f) { return '<label class="f"><span>' + f[0] + '</span><input class="fld" type="text" value="' + esc(f[1]) + '"></label>'; }).join('') + '</div><div class="form__f"><button class="btn btn--primary" type="submit">Save</button></div></form>' : '<div class="hint">No trade-in on this lead.</div>';
    // activity table
    var evKind = function (a) { return /Email/.test(a) ? 'mail' : /Comment|Note/.test(a) ? 'note' : /Status|Assigned/.test(a) ? 'status' : 'created'; };
    var evIcon = { mail: 'i-rss', note: 'i-edit', status: 'i-tag', created: 'i-plus' };
    var evNote = function (a) { var m = a.n.match(/<subject>([^<]*)<\/subject>/); if (m) return '<span class="ev__n">Subject: <b>' + esc(m[1]) + '</b> <code>' + esc(a.n.replace(/<subject>[^<]*<\/subject>/, '').replace(/<\/?emailid>/g, ' ').trim()) + '</code></span>'; return a.n ? '<span class="ev__n">' + esc(a.n) + '</span>' : ''; };
    var evs = acts.map(function (a) { var k = evKind(a.a); return '<div class="ev ev--' + k + '"><span class="ev__i">' + ic(evIcon[k]) + '</span><div class="ev__b"><div class="ev__t">' + esc(a.a) + '<span class="kind">' + k + '</span></div>' + evNote(a) + '<div class="ev__m">by <b>' + esc(a.r) + '</b></div></div><div class="ev__d">' + esc(a.d.slice(0, 10)) + '<small>' + esc(a.d.slice(11)) + '</small></div></div>'; });
    evs.push('<div class="ev ev--created"><span class="ev__i">' + ic('i-plus') + '</span><div class="ev__b"><div class="ev__t">Lead created<span class="kind">created</span></div><span class="ev__n">' + esc(L.src) + ' · ' + esc(L.type) + ' · via ' + esc(L.provider) + '</span><div class="ev__m">by <b>' + esc(L.provider) + '</b></div></div><div class="ev__d">' + fd(L.created) + '<small>' + fdt(L.created).slice(11) + '</small></div></div>');
    $('#act-tbl').innerHTML = evs.join('');
    $('#composer-who').textContent = (L.rep === 'Unassigned' ? 'CM' : L.rep.replace(/^Chicago Motor Cars\s*-\s*/, '').split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase());
    $('#composer-name').textContent = L.rep === 'Unassigned' ? window.LD.totals.dealer : L.rep;
    $('#raw').textContent = '<?xml version="1.0"?>\n<?adf version="1.0"?>\n<adf>\n  <prospect>\n    <requestdate>' + L.created.slice(0, 10) + '</requestdate>\n    <vehicle interest="buy" status="' + (car && car.sold ? 'sold' : 'used') + '">\n      <year>' + esc(parts[0] || '') + '</year>\n      <make>' + esc(parts[1] || '') + '</make>\n      <model>' + esc(parts.slice(2).join(' ')) + '</model>\n      <stock>' + esc(L.stock || '') + '</stock>\n    </vehicle>\n    <customer>\n      <contact><name part="full">' + esc(L.name) + '</name><email>' + esc(L.email) + '</email><phone>' + esc(L.phone) + '</phone></contact>\n      <comments>' + esc(L.msg) + '</comments>\n    </customer>\n    <vendor><vendorname>' + esc(window.LD.totals.dealer) + '</vendorname></vendor>\n    <provider><name>' + esc(L.provider) + '</name></provider>\n  </prospect>\n</adf>';
    // emails table
    var snippet = function (e, i) { return e.dir === 'IN' ? ['Thanks — is it still available? I can come by this weekend.', 'Got it. What is your best out-the-door price?', 'Please send the service records when you have a minute.'][i % 3] : ['Hi ' + L.name.split(' ')[0] + ', thanks for reaching out about the ' + (L.car || 'vehicle') + ' — yes, it is available.', 'Attached the window sticker and the Carfax. Happy to set up a call.', 'Following up on your enquiry — any questions I can answer?'][i % 3]; };
    var who = L.rep === 'Unassigned' ? window.LD.totals.dealer : L.rep;
    $('#em-tbl').innerHTML = emails.length ? '<div class="mail__h"><span></span><span>Subject</span><span>From / To</span><span style="text-align:right">Date</span><span></span></div>' + emails.map(function (e, i) { var unread = e.dir === 'IN' && i === 0 && L.newMail; return '<div class="em' + (unread ? ' em--unread' : '') + '" data-em="' + i + '" role="button" tabindex="0" aria-expanded="false"><span class="em__dir em__dir--' + e.dir.toLowerCase() + '">' + e.dir + '</span><span class="em__s" title="' + esc(e.s) + '">' + esc(e.s) + '<span class="em__p">' + esc(snippet(e, i)) + '</span></span><span class="em__w">' + (e.dir === 'IN' ? '<b>' + esc(L.name) + '</b> <em>→</em> ' + esc(who) : '<b>' + esc(who) + '</b> <em>→</em> ' + esc(L.name)) + '</span><span class="em__d">' + esc(e.d) + '</span><span class="em__x">' + ic('i-chev') + '</span><div class="em__body">' + esc(snippet(e, i)) + '\n\n— ' + (e.dir === 'IN' ? esc(L.name) : esc(who)) + '</div></div>'; }).join('') + '<div class="mail__f"><span>' + emails.length + ' emails · newest first</span><button class="btn btn--sheet btn--sm" type="button" data-act="email">' + ic('i-rss') + ' Write email</button></div>' : '<div class="empty">No emails on this lead. <button class="btn btn--sheet btn--sm" type="button" data-act="email">' + ic('i-rss') + ' Write email</button></div>';
    // dock: workflow + facts
    $('#wf-status').value = L.status; var rs = $('#wf-rep'); rs.innerHTML = '<option>Select Rep</option>' + window.LD.reps.filter(function (r) { return r !== 'Unassigned'; }).sort().map(function (r) { return '<option' + (r === L.rep ? ' selected' : '') + '>' + esc(r) + '</option>'; }).join(''); $('#wf-follow').value = L.follow ? L.follow + 'T09:00' : '';
    $('#nl').checked = idx % 3 === 0;
  }

  function go(i) { if (i < 0 || i >= LEADS.length) return; idx = i; L = LEADS[idx]; seedActs(); history.replaceState(null, '', '?id=' + L.id); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  /* section nav follows the scroll */
  function syncNav() {
    var y = window.scrollY + 56 + 48 + 40, cur = 's-overview';
    $$('.sec').forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
    $$('.secnav__b').forEach(function (b) { b.classList.toggle('secnav__b--on', b.dataset.sec === cur); });
  }

  /* platform menus, theme, dock */
  function closeMenus(except) { $$('.nav__it--open').forEach(function (it) { if (it !== except) { it.classList.remove('nav__it--open'); var b = $('[data-menu]', it); if (b) b.setAttribute('aria-expanded', 'false'); } }); }
  function setTheme(t, keep) { document.documentElement.setAttribute('data-theme', t); if (keep) try { localStorage.setItem('aan-theme', t); } catch (e) {} $('[data-act="theme"]').setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); }
  function toggleDock(open) { var on = open == null ? !$('#app').classList.contains('dock-open') : open; $('#app').classList.toggle('dock-open', on); $$('[data-act="dock"].facet__b').forEach(function (b) { b.classList.toggle('facet__b--on', on); }); }

  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-act="quote-more"]'))) { var q = $('#quote'); q.classList.toggle('quote--full'); el.textContent = q.classList.contains('quote--full') ? 'Show less' : 'Show full message'; return; }
    if ((el = t.closest('.em'))) { el.classList.toggle('em--open'); el.setAttribute('aria-expanded', el.classList.contains('em--open')); return; }
    if ((el = t.closest('[data-menu]'))) { var it = el.closest('.nav__it'), open = !it.classList.contains('nav__it--open'); closeMenus(it); it.classList.toggle('nav__it--open', open); el.setAttribute('aria-expanded', open); return; }
    if (!t.closest('.nav__it')) closeMenus();
    if ((el = t.closest('[data-act="theme"]'))) { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); return; }
    if ((el = t.closest('[data-act="prev"]'))) { go(idx - 1); return; }
    if ((el = t.closest('[data-act="next"]'))) { go(idx + 1); return; }
    if ((el = t.closest('[data-act="dock"]'))) { e.preventDefault(); toggleDock(); return; }
    if ((el = t.closest('[data-act="close"]'))) { toggleDock(false); return; }
    if ((el = t.closest('[data-copy]'))) { try { navigator.clipboard.writeText(el.dataset.copy); } catch (x) {} return; }
    if ((el = t.closest('[data-sec]'))) { e.preventDefault(); var s = $('#' + el.dataset.sec); if (s) window.scrollTo({ top: s.offsetTop - 56 - 48 - 20, behavior: 'smooth' }); return; }
    if ((el = t.closest('[data-act="add-note"]'))) { var v = $('#note-in').value.trim(); if (!v) return; acts.unshift({ d: fdt(new Date().toISOString()), a: 'Comments Added', n: v, r: L.rep === 'Unassigned' ? window.LD.totals.dealer : L.rep }); L.notes++; $('#note-in').value = ''; render(); return; }
    if ((el = t.closest('[data-act="note"]'))) { $('#note-in').focus(); window.scrollTo({ top: $('#s-activity').offsetTop - 56 - 48 - 20, behavior: 'smooth' }); return; }
    if ((el = t.closest('[data-act="email"]'))) { window.scrollTo({ top: $('#s-emails').offsetTop - 56 - 48 - 20, behavior: 'smooth' }); return; }
    if ((el = t.closest('[data-act="wf-save"]'))) { L.status = $('#wf-status').value; var rv = $('#wf-rep').value; L.rep = rv === 'Select Rep' ? 'Unassigned' : rv; var fv = $('#wf-follow').value; L.follow = fv ? fv.slice(0, 10) : null; L.pastDue = !!L.follow && L.follow < '2026-09-10'; acts.unshift({ d: fdt(new Date().toISOString()), a: 'Status Changed', n: L.status + (L.rep !== 'Unassigned' ? ' · assigned to ' + L.rep : ''), r: L.rep === 'Unassigned' ? window.LD.totals.dealer : L.rep }); render(); return; }
    if ((el = t.closest('[data-act="remove-veh"]'))) { L.car = null; L.stock = null; render(); return; }
    if ((el = t.closest('[data-act="add-trade"]'))) { L.type = 'tradein'; render(); return; }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if ($('.nav__it--open')) closeMenus(); } });

  /* sticky band state */
  (function () {
    var cmd = $('.cmd'), stuck = null;
    function onScroll() { var s = window.scrollY > 0 && cmd.getBoundingClientRect().top <= 56.5; if (s !== stuck) { stuck = s; cmd.classList.toggle('cmd--stuck', s); } syncNav(); }
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); onScroll();
  })();

  seedActs(); render();
  window.SLdemo = { go: go, L: function () { return L; } };
})();
