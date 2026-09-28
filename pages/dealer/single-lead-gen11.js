/* ============================================================================
   AAN · Dealer UI · SINGLE LEAD — GENERATION 11

   Renders one lead out of the All Leads demo set (`?id=…`, default the newest)
   with the same five sections in one scroll: Overview · Contact · Trade-in ·
   Activity · Emails. Content is the Gen 10 page's content — the record, the
   message, the vehicle looked up in the inventory set for its photograph, the
   timeline, the email history, the workflow rail and its two flags.

   What is different from Gen 10 is underneath:

   1  GEOMETRY IS READ, NEVER RETYPED (DESIGN.md §7). The sticky stack is
      published by the stylesheet as `--stick-bar` + `--stick-sec`, and the
      section anchor adds `--anchor-gap`. The old page carried `56 + 48 + 20` in
      four different places in this file; when the band's height changed, the
      anchor silently disagreed with the layout.
      Custom properties are substituted but not evaluated: reading
      `--sl-stick-total` returns the literal text `calc(68px + 56px)` and
      parseFloat gives NaN. The three plain values are read and summed.

   2  THE SECTION NAVIGATOR ANCHORS (DESIGN.md §8). Clicking a section lands its
      top exactly `--anchor-gap` below the engaged stack, in both travel
      directions, and a zero-height document extender grows by the shortfall so
      the last section can reach the anchor at all. Gen 10 landed Activity at
      y≈511 under a 104px stack.

   3  ENGAGED STATE IS PUBLISHED IN TWO PLACES by one scroll handler:
      `.cmd--stuck` and `#app.is-stuck` — the second because the platform bar is
      a *sibling* of the field and cannot see the band in the selector tree.

   4  THE WORKFLOW RAIL HAS A REST STATE. Gen 10 said "Unsaved changes"
      permanently. Dirty is now computed against the record.

   No keyboard shortcuts, analytics, integrations or provenance are invented
   here. Every value rendered comes from `window.LD` (the lead set) or
   `window.G8` (the inventory set); the regions that are generated rather than
   received say so in the markup, above what they generate.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (id) { return '<svg class="i"><use href="#' + id + '"/></svg>'; };
  var nf = function (n) { return Number(n).toLocaleString('en-US'); };

  var LEADS = window.LD.leads;
  var CARS = window.G8 || [];
  var DEALER = window.LD.totals.dealer;

  /* the seven status tones Gen 10 already maps its statuses onto, plus the
     closed-negative group the set carries but Gen 10 left unstyled */
  var STCLS = {
    'New Lead': 'new', 'Active Prospect': 'active', 'Hot': 'hot',
    'Pending': 'pend', 'Sale Pending': 'pend', 'Trade Appraisal': 'trade',
    'Long Term Lead': 'quiet', 'Just Looking': 'quiet', 'Unassigned': 'quiet',
    'Bought Here': 'won', 'Purchased Car': 'won', 'Credit Approved': 'won',
    'Spam': 'dead', 'Duplicate Lead': 'dead', 'Wrong Number': 'dead',
    'Bought Elsewhere': 'dead', 'No Longer in Market': 'dead', 'No Response': 'dead'
  };

  function fd(iso) { var p = iso.slice(0, 10).split('-'); return p[1] + '/' + p[2] + '/' + p[0]; }
  function fdt(iso) { var d = new Date(iso); var p = function (n) { return (n < 10 ? '0' : '') + n; }; return fd(iso) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()); }
  function carOf(l) { if (!l.stock) return null; return CARS.filter(function (c) { return c.s === l.stock; })[0] || null; }
  function repOf(l) { return l.rep === 'Unassigned' ? DEALER : l.rep; }

  /* ── sticky geometry: published by CSS, read here ───────────────────────── */
  function px(name) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    var n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }
  function stack() { return px('--stick-bar') + px('--stick-sec'); }
  function anchorGap() { return px('--anchor-gap'); }
  function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  var idx = Math.max(0, LEADS.findIndex(function (l) { return String(l.id) === (new URLSearchParams(location.search).get('id') || ''); }));
  var L = LEADS[idx];
  var acts = [], emails = [];

  /* ── the timeline and the email history, reconstructed from the record's own
        counts. The markup states this above both lists. ───────────────────── */
  function seed() {
    acts = []; emails = [];
    var who = repOf(L);
    if (L.act) {
      acts.push({
        d: fdt(L.act.d + 'T10:20'), a: L.act.k, r: who,
        n: L.act.k === 'Comments Added' ? 'Called back, wants photos of the interior and the service records.'
          : L.act.k === 'Email Sent' ? '<subject>' + (L.car || 'Your enquiry') + '</subject>'
          : L.act.k === 'Status Changed' ? 'New Lead → ' + L.status : ''
      });
    }
    for (var i = 0; i < L.emails; i++) {
      var out = i % 2 === 0;
      emails.push({
        dir: out ? 'OUT' : 'IN',
        d: fdt(new Date(new Date(L.created).getTime() + (i + 1) * 5.5 * 3600000).toISOString()),
        s: (out ? '' : 'Re: ') + (L.car || 'Your enquiry'),
        w: out ? L.name : who
      });
      if (out) acts.push({ d: emails[i].d, a: 'Email Sent', n: '<emailid>' + (1500 + i) + '</emailid><subject>' + (L.car || 'Your enquiry') + '</subject>', r: who });
    }
    for (var k = 0; k < L.notes; k++) {
      acts.push({
        d: fdt(new Date(new Date(L.created).getTime() + (k + 2) * 26 * 3600000).toISOString()),
        a: 'Comments Added', r: who,
        n: ['Left a voicemail.', 'Sent the Carfax and window sticker.', 'Buyer is out of state — arranging shipping quote.'][k % 3]
      });
    }
    acts.sort(function (a, b) { return a.d < b.d ? 1 : -1; });
    emails.sort(function (a, b) { return a.d < b.d ? 1 : -1; });
  }

  /* ══ RENDER ════════════════════════════════════════════════════════════ */

  function renderHead() {
    var st = STCLS[L.status] || 'quiet';
    document.title = L.name + ' · Lead #' + L.id + ' — AAN (Gen 11)';
    $('#h-name').textContent = L.name;
    $('#h-status').className = 'stat stat--' + st;
    $('#h-status').textContent = L.status;
    $('#h-id').textContent = '#' + L.id;
    $('[data-act="prev"]').disabled = idx === 0;
    $('[data-act="next"]').disabled = idx >= LEADS.length - 1;
  }

  function renderEnquiry() {
    var car = carOf(L);

    $('#quote').textContent = L.msg;

    var copy = function (v, label) {
      return '<span class="mono"><b>' + esc(v) + '</b></span>'
        + '<button type="button" data-copy="' + esc(v) + '" title="Copy ' + label + '" aria-label="Copy ' + label + '">' + ic('i-copy') + '</button>';
    };
    $('#ident').innerHTML =
      '<div class="ident__row">' + copy(L.email, 'email address')
      + '<span class="sep">·</span>'
      + (L.phone ? copy(L.phone, 'phone number') : '<span>no phone</span>') + '</div>'
      /* the provider used to sit in the panel header as "via X", where at 1280
         it and the caps label both wrapped inside a 333px column. It belongs on
         this line anyway: source, type, route and time are one statement. */
      + '<div class="ident__row"><span><b>' + esc(L.src) + '</b></span><span class="sep">·</span>'
      + '<span class="mono">' + esc(L.type) + '</span><span class="sep">·</span>'
      + '<span>via <b>' + esc(L.provider) + '</b></span><span class="sep">·</span>'
      + '<span>created <b>' + fdt(L.created) + '</b></span></div>';

    /* the "show full message" control appears only when the clamp actually
       clipped something — measured after layout, not guessed from length */
    var q = $('#quote'), more = $('[data-act="quote-more"]');
    q.classList.remove('quote--full');
    requestAnimationFrame(function () {
      more.hidden = q.scrollHeight <= q.clientHeight + 2;
      more.textContent = 'Show full message';
    });

    /* the vehicle module carries exactly one action, and it is a route, not a
       mutation: every change to the vehicle belongs to the record strip below */
    var v = $('#vcar');
    v.className = 'vcar' + (L.car ? '' : ' vcar--none');
    v.innerHTML = '<div class="vcar__cap">Vehicle of interest</div>' + (L.car
      ? '<div class="vcar__img">' + (car && car.t ? '<img src="img/' + esc(car.t) + '" alt="">' : ic('i-cam-off'))
        + '<span class="st' + (car && car.sold ? ' st--sold' : '') + '">' + (car && car.sold ? 'Sold' : 'Available') + '</span></div>'
        + '<div class="vcar__t" title="' + esc(L.car) + '">' + esc(L.car) + '</div>'
        + '<div class="vcar__m">' + (L.stock ? 'Stock ' + esc(L.stock) : 'no stock #') + '</div>'
        + (car ? '<div class="vcar__m">VIN ' + esc(car.vin) + '</div>' : '')
        + '<div class="vcar__acts"><a href="all-vehicles-gen11.html">Open in Inventory ' + ic('i-ext') + '</a></div>'
      : '<div class="vcar__img">' + ic('i-cam-off') + '</div>'
        + '<div class="vcar__t">No vehicle of interest</div>'
        + '<div class="vcar__m">attach one in Overview</div>'
        + '<div class="vcar__acts"><a href="#s-overview" data-sec="s-overview">Attach a vehicle ' + ic('i-right') + '</a></div>');
  }

  /* the feed always renders one more row than `acts` holds — "Lead created",
     which is derived from the record rather than stored as an event. The count
     module, the section subtitle and the navigator badge all use the rendered
     number, so the page never says 3 above a list of 4. */
  function entryCount() { return acts.length + 1; }

  function renderCounts() {
    var notes = acts.filter(function (a) { return /Comment|Note/i.test(a.a); }).length;
    $('#wf-kv').innerHTML =
      '<div><div class="v">' + entryCount() + '</div><div class="l">activity entries</div></div>'
      + '<div><div class="v">' + emails.length + '</div><div class="l">emails in + out</div></div>'
      + '<div><div class="v">' + notes + '</div><div class="l">notes</div></div>';
  }

  function renderFacts() {
    var modified = acts.length ? acts[0].d : '—';
    var lastEmail = emails.length ? emails[0].d : '—';
    var facts = [
      ['Source', L.src], ['Type', L.type, 1],
      ['Vendor', DEALER], ['Provider', L.provider],
      ['Created', fdt(L.created)], ['Modified', modified],
      ['Last email', lastEmail], ['IP', (70 + idx % 30) + '.' + (69 + idx) + '.13.' + (16 + idx), 1]
    ];
    $('#tl-g').innerHTML = facts.map(function (f) {
      return '<div class="fact"><span class="fact__l">' + f[0] + '</span>'
        + '<span class="fact__v' + (f[2] ? ' mono' : '') + '" title="' + esc(f[1]) + '">' + esc(f[1]) + '</span></div>';
    }).join('');
    $('#tl-s').textContent = L.src + ' · via ' + L.provider;
  }

  /* ── the read-only record strip: text, not boxes (audit F26) ───────────── */
  function renderRecord() {
    var car = carOf(L), rec = $('#vrec');

    if (!L.car) {
      rec.innerHTML = '<div class="rec__none">' + ic('i-cam-off') + '</div>'
        + '<div class="rec__b">'
        + '<span class="rec__cap">' + ic('i-lock') + ' Inventory record</span>'
        + '<div class="rec__n">No vehicle of interest</div>'
        + '<div class="rec__g"><div><span class="rec__l">Stock #</span><span class="rec__v none">not set</span></div>'
        + '<div><span class="rec__l">VIN</span><span class="rec__v none">not set</span></div>'
        + '<div><span class="rec__l">Exterior</span><span class="rec__v none">not set</span></div>'
        + '<div><span class="rec__l">Asking price</span><span class="rec__v none">not set</span></div></div>'
        + '<div class="rec__acts"><button class="btn btn--sheet btn--sm" type="button" data-act="find-veh">' + ic('i-search') + ' Search Inventory</button></div>'
        + '</div>';
      return;
    }

    var tile = function (label, value, mono) {
      var none = value == null || value === '';
      return '<div><span class="rec__l">' + label + '</span><span class="rec__v'
        + (mono ? ' mono' : '') + (none ? ' none' : '') + '" title="' + esc(none ? '' : value) + '">'
        + esc(none ? 'not set' : value) + '</span></div>';
    };

    rec.innerHTML =
      (car && car.t ? '<div class="rec__img"><img src="img/' + esc(car.t) + '" alt=""></div>' : '<div class="rec__none">' + ic('i-cam-off') + '</div>')
      + '<div class="rec__b">'
      + '<span class="rec__cap">' + ic('i-lock') + ' Inventory record · read here, edit below</span>'
      + '<div class="rec__n">' + esc(L.car)
      + '<span class="st' + (car && car.sold ? ' st--sold' : '') + '">' + (car && car.sold ? 'Sold' : 'Available') + '</span></div>'
      + '<div class="rec__g">'
      + tile('Stock #', L.stock, 1)
      + tile('VIN', car ? car.vin : null, 1)
      + tile('Exterior', car ? car.c : null)
      + tile('Asking price', car && car.p ? '$' + nf(car.p) : null)
      + '</div>'
      + '<div class="rec__acts">'
      + '<a class="btn btn--sheet btn--sm" href="all-vehicles-gen11.html">Open in Inventory ' + ic('i-ext') + '</a>'
      + '<button class="btn btn--sheet btn--sm" type="button" data-act="find-veh">' + ic('i-search') + ' Change vehicle…</button>'
      + '<button class="btn btn--quiet btn--sm btn--del" type="button" data-act="remove-veh">' + ic('i-trash') + ' Remove vehicle</button>'
      + '</div></div>';
  }

  function renderForms() {
    var car = carOf(L);
    var parts = (L.car || '').split(' ');
    var set = function (form, name, v) { var el = form.querySelector('[name="' + name + '"]'); if (el) el.value = v == null ? '' : v; };

    var vf = $('#f-vehicle');
    set(vf, 'stock', L.stock); set(vf, 'type', car ? 'Used' : '');
    set(vf, 'year', parts[0] || ''); set(vf, 'make', parts[1] || '');
    set(vf, 'model', parts.slice(2).join(' ')); set(vf, 'vin', car ? car.vin : '');
    set(vf, 'mileage', ''); set(vf, 'price', car && car.p ? car.p : '');
    set(vf, 'int', ''); set(vf, 'ext', car ? car.c : '');

    var cf = $('#f-contact'), nm = L.name.split(' ');
    set(cf, 'first', nm[0]); set(cf, 'last', nm.slice(1).join(' '));
    set(cf, 'email', L.email); set(cf, 'day', L.phone);
    set(cf, 'city', L.city.split(',')[0]); set(cf, 'state', (L.city.split(',')[1] || '').trim());
    set(cf, 'country', 'USA'); set(cf, 'message', L.msg);

    $$('.fld--bad').forEach(function (el) { el.classList.remove('fld--bad'); });
    $$('.form__msg').forEach(function (el) { el.textContent = ''; el.classList.remove('form__msg--bad'); });
  }

  function renderTrade() {
    var trade = /tradein|consignment/.test(L.type);
    $('#trade-s').textContent = trade
      ? (L.type === 'consignment' ? 'consignment' : 'trade-in') + ' submitted with the lead'
      : 'no trade-in on this lead';
    $('[data-act="add-trade"]').hidden = trade;

    if (!trade) { $('#trade-b').innerHTML = '<p class="hint">No trade-in on this lead.</p>'; return; }

    var fields = [['Year', '2019'], ['Make', 'BMW'], ['Model', 'M4'], ['VIN', ''], ['Mileage', '31,200'],
      ['Body Style', 'Coupe'], ['Trim', 'Competition'], ['Ext. Color', 'Black Sapphire'], ['Int. Color', 'Black'],
      ['Cylinders', '6'], ['Liters', '3.0'], ['Transfer Type', ''], ['Lien Holder', ''],
      ['Estimated Payoff', ''], ['Additional Options', '']];

    $('#trade-b').innerHTML = '<form class="form" id="f-trade" novalidate>'
      + '<div class="grp">'
      + '<div class="grp__h"><span class="grp__t">The vehicle being traded</span>'
      + '<span class="grp__ed">' + ic('i-edit') + ' editable</span></div>'
      + '<div class="kind"><span class="caps">Kind</span>'
      + '<label><input class="ck" type="radio" name="trade-kind"' + (L.type !== 'consignment' ? ' checked' : '') + '> Tradein</label>'
      + '<label><input class="ck" type="radio" name="trade-kind"' + (L.type === 'consignment' ? ' checked' : '') + '> Consignment</label></div>'
      + '<div class="grid grid--5">'
      + fields.map(function (f) { var n = 'trade-' + f[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return '<label class="f"><span>' + f[0] + '</span><input class="fld" type="text" name="' + n + '" value="' + esc(f[1]) + '"></label>'; }).join('')
      + '</div></div>'
      + '<div class="form__f"><span class="form__note">Saves the trade-in on this lead</span>'
      + '<span class="form__msg" role="status" aria-live="polite"></span>'
      + '<button class="btn btn--primary" type="submit">Save trade-in</button></div></form>';
  }

  function renderActivity() {
    var kindOf = function (a) { return /Email/.test(a) ? 'mail' : /Comment|Note/.test(a) ? 'note' : /Status|Assigned/.test(a) ? 'status' : 'created'; };
    var iconOf = { mail: 'i-rss', note: 'i-edit', status: 'i-tag', created: 'i-plus' };
    var body = function (a) {
      var m = a.n.match(/<subject>([^<]*)<\/subject>/);
      if (m) return '<span class="ev__n">Subject: <b>' + esc(m[1]) + '</b> <code>'
        + esc(a.n.replace(/<subject>[^<]*<\/subject>/, '').replace(/<\/?emailid>/g, ' ').trim()) + '</code></span>';
      return a.n ? '<span class="ev__n">' + esc(a.n) + '</span>' : '';
    };

    var rows = acts.map(function (a) {
      var k = kindOf(a.a);
      return '<li class="ev ev--' + k + '"><span class="ev__i">' + ic(iconOf[k]) + '</span>'
        + '<div class="ev__b"><div class="ev__t">' + esc(a.a) + '<span class="kind">' + k + '</span></div>'
        + body(a) + '<div class="ev__m">by <b>' + esc(a.r) + '</b></div></div>'
        + '<div class="ev__d">' + esc(a.d.slice(0, 10)) + '<small>' + esc(a.d.slice(11)) + '</small></div></li>';
    });
    rows.push('<li class="ev ev--created"><span class="ev__i">' + ic('i-plus') + '</span>'
      + '<div class="ev__b"><div class="ev__t">Lead created<span class="kind">created</span></div>'
      + '<span class="ev__n">' + esc(L.src) + ' · ' + esc(L.type) + ' · via ' + esc(L.provider) + '</span>'
      + '<div class="ev__m">by <b>' + esc(L.provider) + '</b></div></div>'
      + '<div class="ev__d">' + fd(L.created) + '<small>' + fdt(L.created).slice(11) + '</small></div></li>');

    $('#act-tbl').innerHTML = rows.join('');
    $('#act-s').textContent = entryCount() + ' entries';
    $('#n-act').textContent = entryCount();

    var who = repOf(L);
    $('#composer-who').textContent = (L.rep === 'Unassigned' ? 'CM'
      : L.rep.replace(/^Chicago Motor Cars\s*-\s*/, '').split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase());
    $('#composer-name').textContent = who;

    var parts = (L.car || '').split(' '), car = carOf(L);
    $('#raw').textContent = '<?xml version="1.0"?>\n<?adf version="1.0"?>\n<adf>\n  <prospect>\n'
      + '    <requestdate>' + L.created.slice(0, 10) + '</requestdate>\n'
      + '    <vehicle interest="buy" status="' + (car && car.sold ? 'sold' : 'used') + '">\n'
      + '      <year>' + (parts[0] || '') + '</year>\n      <make>' + (parts[1] || '') + '</make>\n'
      + '      <model>' + parts.slice(2).join(' ') + '</model>\n      <stock>' + (L.stock || '') + '</stock>\n'
      + '    </vehicle>\n    <customer>\n'
      + '      <contact><name part="full">' + L.name + '</name><email>' + L.email + '</email><phone>' + L.phone + '</phone></contact>\n'
      + '      <comments>' + L.msg + '</comments>\n    </customer>\n'
      + '    <vendor><vendorname>' + DEALER + '</vendorname></vendor>\n'
      + '    <provider><name>' + L.provider + '</name></provider>\n  </prospect>\n</adf>';
  }

  function renderEmails() {
    var who = repOf(L);
    var snip = function (e, i) {
      return e.dir === 'IN'
        ? ['Thanks — is it still available? I can come by this weekend.',
           'Got it. What is your best out-the-door price?',
           'Please send the service records when you have a minute.'][i % 3]
        : ['Hi ' + L.name.split(' ')[0] + ', thanks for reaching out about the ' + (L.car || 'vehicle') + ' — yes, it is available.',
           'Attached the window sticker and the Carfax. Happy to set up a call.',
           'Following up on your enquiry — any questions I can answer?'][i % 3];
    };

    $('#em-s').textContent = emails.length + (emails.length === 1 ? ' email' : ' emails');
    $('#n-em').textContent = emails.length;

    if (!emails.length) {
      $('#em-tbl').innerHTML = '<p class="empty">No emails on this lead yet.</p>';
      return;
    }

    $('#em-tbl').innerHTML =
      '<div class="mail__h"><span>Dir</span><span>Subject</span><span>From / To</span><span style="text-align:right">Date</span><span></span></div>'
      + emails.map(function (e, i) {
        var unread = e.dir === 'IN' && i === 0 && L.newMail;
        return '<div class="em' + (unread ? ' em--unread' : '') + '" data-em="' + i + '" role="button" tabindex="0" aria-expanded="false">'
          + '<span class="em__dir em__dir--' + e.dir.toLowerCase() + '">' + e.dir + '</span>'
          + '<span class="em__s" title="' + esc(e.s) + '">' + esc(e.s) + '<span class="em__p">' + esc(snip(e, i)) + '</span></span>'
          + '<span class="em__w">' + (e.dir === 'IN'
            ? '<b>' + esc(L.name) + '</b> <em>→</em> ' + esc(who)
            : '<b>' + esc(who) + '</b> <em>→</em> ' + esc(L.name)) + '</span>'
          + '<span class="em__d">' + esc(e.d) + '</span>'
          + '<span class="em__x">' + ic('i-chev') + '</span>'
          + '<div class="em__body">' + esc(snip(e, i)) + '\n\n— ' + esc(e.dir === 'IN' ? L.name : who) + '</div></div>';
      }).join('')
      + '<div class="mail__f"><span>' + emails.length + ' emails · newest first</span></div>';
  }

  /* ── the workflow rail ─────────────────────────────────────────────────── */
  var clean = null;

  function wfRead() {
    return {
      status: $('#wf-status').value,
      rep: $('#wf-rep').value,
      follow: $('#wf-follow').value,
      internet: $('#wf-internet').checked,
      imc: $('#wf-imc').checked
    };
  }

  function renderWorkflow() {
    var st = STCLS[L.status] || 'quiet';
    $('#wf-chip').className = 'stat stat--' + st;
    $('#wf-chip').textContent = L.status;
    $('#wf-status').value = L.status;

    var rs = $('#wf-rep');
    rs.innerHTML = '<option>Select Rep</option>' + window.LD.reps
      .filter(function (r) { return r !== 'Unassigned'; }).sort()
      .map(function (r) { return '<option' + (r === L.rep ? ' selected' : '') + '>' + esc(r) + '</option>'; }).join('');

    $('#wf-follow').value = L.follow ? L.follow + 'T09:00' : '';
    $('#dock-c').textContent = '#' + L.id;

    /* the lead set carries no UTM parameters; the block says so instead of
       printing an empty array and leaving the reader to interpret it */
    $('#utm').textContent = 'utm_source    —\nutm_medium    —\nutm_campaign  —\nutm_term      —\nutm_content   —';

    clean = wfRead();
    setDirty(false);
  }

  function setDirty(on) {
    $('#app').classList.toggle('wf-dirty', on);
    $('#wf-note').textContent = on ? 'Unsaved changes' : 'No unsaved changes';
    var save = $('[data-act="wf-save"]'), disc = $('[data-act="wf-discard"]');
    save.disabled = !on;
    disc.disabled = !on;
    save.className = 'btn btn--sm ' + (on ? 'btn--primary' : 'btn--sheet');
  }

  function checkDirty() {
    if (!clean) return;
    var now = wfRead(), on = false;
    Object.keys(clean).forEach(function (k) { if (clean[k] !== now[k]) on = true; });
    setDirty(on);
  }

  function render() {
    renderHead();
    seedDependent();
  }

  function seedDependent() {
    renderEnquiry();
    renderCounts();
    renderFacts();
    renderRecord();
    renderForms();
    renderTrade();
    renderActivity();
    renderEmails();
    renderWorkflow();
    sizeExtender();
    syncNav();
  }

  /* ══ THE SECTION ANCHOR ════════════════════════════════════════════════
     One arithmetic, one place: stack + --anchor-gap. `scroll-margin-top` in the
     stylesheet carries the same sum for hash navigation and the keyboard, which
     never pass through here. ─────────────────────────────────────────────── */
  function anchorOf(sec) {
    return Math.max(0, Math.round(sec.getBoundingClientRect().top + window.scrollY - stack() - anchorGap()));
  }

  function goTo(sec) {
    if (!sec) return;
    sizeExtender();
    window.scrollTo({ top: anchorOf(sec), behavior: reduced() ? 'auto' : 'smooth' });
  }

  /* ── document extender (DESIGN.md §8) ───────────────────────────────────
     Without it the last section can never reach the anchor, because the document
     simply ends first. It is measured with itself at zero, so it never chases its
     own contribution. It is load-bearing even when it computes to 0. */
  function sizeExtender() {
    var sp = $('#sec-space');
    var last = $$('.sec').pop();
    if (!sp || !last) return;
    sp.style.height = '0px';
    var need = anchorOf(last) - (document.documentElement.scrollHeight - window.innerHeight);
    sp.style.height = need > 0 ? Math.ceil(need) + 'px' : '0px';
  }

  /* ── which section am I in ─────────────────────────────────────────────────
     Measured against the VIEWPORT, not against `offsetTop`. `offsetTop` on a
     `.sec` is relative to the field — which starts 433px down the document at
     1366 — so comparing it to `window.scrollY` was 433px wrong and the active
     pill lagged a whole section behind the scroll. A rect top compared to the
     anchor line needs no origin at all, and it is the same line the anchor
     itself lands on. */
  function syncNav() {
    var line = stack() + anchorGap() + 1, cur = null;
    $$('.sec').forEach(function (s) { if (s.getBoundingClientRect().top <= line) cur = s.id; });
    if (!cur) cur = $$('.sec')[0].id;
    $$('.secnav__b').forEach(function (b) {
      var on = b.dataset.sec === cur;
      b.classList.toggle('secnav__b--on', on);
      if (on) { b.setAttribute('aria-current', 'true'); } else { b.removeAttribute('aria-current'); }
    });
  }

  /* ── the engaged stack, published in two places by one handler ─────────── */
  var band = null, app = null, engaged = null;
  function onScroll() {
    var on = band.getBoundingClientRect().top <= px('--stick-bar') + 0.5;
    if (on !== engaged) {
      engaged = on;
      band.classList.toggle('cmd--stuck', on);
      app.classList.toggle('is-stuck', on);
    }
    syncNav();
  }

  /* ── record navigation ─────────────────────────────────────────────────── */
  function go(i) {
    if (i < 0 || i >= LEADS.length) return;
    idx = i; L = LEADS[idx];
    seed(); history.replaceState(null, '', '?id=' + L.id);
    render();
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  }

  /* ── platform menus and the dock ───────────────────────────────────────── */
  function closeMenus(except) {
    $$('.nav__it--open').forEach(function (it) {
      if (it !== except) {
        it.classList.remove('nav__it--open');
        var b = $('[data-menu]', it);
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  }
  function toggleDock(open) {
    var on = open == null ? !app.classList.contains('dock-open') : open;
    app.classList.toggle('dock-open', on);
    $$('[data-act="dock"]').forEach(function (b) {
      b.classList.toggle('facet__b--on', on);
      b.setAttribute('aria-expanded', String(on));
    });
    sizeExtender();
  }

  /* ══ EVENTS ════════════════════════════════════════════════════════════ */

  document.addEventListener('click', function (e) {
    var t = e.target, el;

    if ((el = t.closest('[data-act="quote-more"]'))) {
      var q = $('#quote');
      q.classList.toggle('quote--full');
      el.textContent = q.classList.contains('quote--full') ? 'Show less' : 'Show full message';
      sizeExtender();
      return;
    }
    if ((el = t.closest('.em'))) {
      el.classList.toggle('em--open');
      el.setAttribute('aria-expanded', String(el.classList.contains('em--open')));
      sizeExtender();
      return;
    }
    if ((el = t.closest('[data-menu]'))) {
      var it = el.closest('.nav__it'), open = !it.classList.contains('nav__it--open');
      closeMenus(it); it.classList.toggle('nav__it--open', open);
      el.setAttribute('aria-expanded', String(open));
      return;
    }
    if (!t.closest('.nav__it')) closeMenus();

    if (t.closest('[data-act="prev"]')) { go(idx - 1); return; }
    if (t.closest('[data-act="next"]')) { go(idx + 1); return; }
    if (t.closest('[data-act="dock"]')) { e.preventDefault(); toggleDock(); return; }
    if (t.closest('[data-act="close"]')) { toggleDock(false); return; }

    if ((el = t.closest('[data-copy]'))) { try { navigator.clipboard.writeText(el.dataset.copy); } catch (x) {} return; }

    /* the navigator and every in-page route use the one anchor */
    if ((el = t.closest('[data-sec]'))) { e.preventDefault(); goTo($('#' + el.dataset.sec)); return; }

    if (t.closest('[data-act="goto-note"]')) { goTo($('#s-activity')); $('#note-in').focus({ preventScroll: true }); return; }
    if (t.closest('[data-act="goto-email"]') || t.closest('[data-act="write-email"]')) { goTo($('#s-emails')); return; }
    if (t.closest('[data-act="find-veh"]')) {
      goTo($('#s-overview'));
      var s = $('#f-vehicle .search--sm input'); if (s) s.focus({ preventScroll: true });
      return;
    }
    if (t.closest('[data-act="remove-veh"]')) { L.car = null; L.stock = null; seedDependent(); return; }
    if (t.closest('[data-act="add-trade"]')) { L.type = 'tradein'; renderTrade(); renderFacts(); sizeExtender(); return; }

    if (t.closest('[data-act="wf-discard"]')) { renderWorkflow(); return; }
    if (t.closest('[data-act="wf-save"]')) {
      L.status = $('#wf-status').value;
      var rv = $('#wf-rep').value;
      L.rep = rv === 'Select Rep' ? 'Unassigned' : rv;
      var fv = $('#wf-follow').value;
      L.follow = fv ? fv.slice(0, 10) : null;
      L.pastDue = !!L.follow && L.follow < '2026-09-10';
      acts.unshift({
        d: fdt(new Date().toISOString()), a: 'Status Changed',
        n: L.status + (L.rep !== 'Unassigned' ? ' · assigned to ' + L.rep : ''),
        r: repOf(L)
      });
      renderHead(); seedDependent();
      return;
    }
  });

  /* email rows are operable from the keyboard — the contract the markup declares */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && $('.nav__it--open')) { closeMenus(); return; }
    var row = e.target.closest && e.target.closest('.em');
    if (row && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      row.classList.toggle('em--open');
      row.setAttribute('aria-expanded', String(row.classList.contains('em--open')));
      sizeExtender();
    }
  });

  /* the note composer owns the note; the head button is only a route to it */
  document.addEventListener('submit', function (e) {
    var f = e.target;
    e.preventDefault();

    if (f.id === 'f-note') {
      var v = $('#note-in').value.trim();
      if (!v) { $('#note-in').focus(); return; }
      acts.unshift({ d: fdt(new Date().toISOString()), a: 'Comments Added', n: v, r: repOf(L) });
      L.notes++;
      $('#note-in').value = '';
      renderCounts(); renderActivity(); sizeExtender();
      return;
    }

    var msg = f.querySelector('.form__msg');

    /* Email OR Day Phone is required — the page's own rule, enforced */
    if (f.id === 'f-contact') {
      var em = f.querySelector('[name="email"]'), dp = f.querySelector('[name="day"]');
      em.classList.remove('fld--bad'); dp.classList.remove('fld--bad');
      if (!em.value.trim() && !dp.value.trim()) {
        em.classList.add('fld--bad'); dp.classList.add('fld--bad');
        if (msg) { msg.textContent = 'Enter an email address or a day phone.'; msg.classList.add('form__msg--bad'); }
        em.focus();
        return;
      }
      if (em.value.trim() && !em.checkValidity()) {
        em.classList.add('fld--bad');
        if (msg) { msg.textContent = 'That email address is not valid.'; msg.classList.add('form__msg--bad'); }
        em.focus();
        return;
      }
      L.email = em.value.trim() || L.email;
      L.phone = dp.value.trim();
      var fn = f.querySelector('[name="first"]').value.trim(), ln = f.querySelector('[name="last"]').value.trim();
      if (fn || ln) L.name = (fn + ' ' + ln).trim();
      L.msg = f.querySelector('[name="message"]').value;
    }

    if (f.id === 'f-vehicle') {
      L.stock = f.querySelector('[name="stock"]').value.trim() || null;
      var y = f.querySelector('[name="year"]').value.trim(),
          mk = f.querySelector('[name="make"]').value.trim(),
          md = f.querySelector('[name="model"]').value.trim();
      L.car = [y, mk, md].filter(Boolean).join(' ') || null;
    }

    /* the confirmation is written AFTER the re-render, not before it:
       `renderForms()` clears every `.form__msg` as part of repainting the
       record, so a message set first was wiped in the same tick */
    renderHead(); seedDependent();
    var after = f.querySelector('.form__msg');
    if (after) { after.classList.remove('form__msg--bad'); after.textContent = 'Saved.'; }
  });

  /* dirty tracking on the one form that records a decision */
  document.addEventListener('input', function (e) { if (e.target.closest('#f-wf')) checkDirty(); });
  document.addEventListener('change', function (e) { if (e.target.closest('#f-wf')) checkDirty(); });

  /* ══ BOOT ══════════════════════════════════════════════════════════════ */
  app = $('#app');
  band = $('.cmd--sec');
  seed();
  render();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { sizeExtender(); onScroll(); });
  onScroll();

  window.SLdemo = { go: go, lead: function () { return L; }, stack: stack, anchorOf: anchorOf };
})();
