/* ============================================================================
   AAN · Staff UI · Dealer Edit (Dealer File) — GENERATION 11

   JS sets state; CSS owns layout and position (DESIGN.md §17). The sticky
   geometry is published by CSS and read here, never retyped.

   Which record is open comes from ?dealer=<id>. The export captured three:
     ?dealer=186    a fully-populated active dealer
     ?dealer=1144   a sparse Client Intake dealer
     ?dealer=new    the blank new-dealer form
   Any other id opens an honest empty state. The roster links every row here,
   so the two pages navigate as one application.

   Behaviour is the export's and nothing more: the zone rail with scroll spy,
   `/` to reach it, Ctrl/Cmd+S to save, a dirty counter that reveals Discard,
   repeatable billing emails, six domains, the mailbox table, the sealed
   secrets and the lock. No autosave, no validation engine, no analytics.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.DE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function ic(id) { return '<svg class="i" aria-hidden="true"><use href="#' + id + '"/></svg>'; }

  var KEY = (new URLSearchParams(location.search).get('dealer') || '186').trim();
  var R = D.records[KEY] || null;
  var isNew = KEY === 'new';
  var V = R ? JSON.parse(JSON.stringify(R.v)) : {};   /* the working copy */
  var dirty = 0;

  var DOT_WORD = { green: 'filled', amber: 'partly filled', grey: 'empty' };

  /* ══ SHELL ════════════════════════════════════════════════════════════════ */

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

  /* ══ RECORD HEAD ══════════════════════════════════════════════════════════ */

  function renderHead() {
    var back = '<a class="head__back" href="manage-dealers-gen11.html" title="Back to Manage Dealers" ' +
      'aria-label="Back to Manage Dealers">' + ic('i-left') + '</a>';

    if (!R) {
      $('#head').innerHTML = back +
        '<div class="head__id"><div class="head__row"><h1>Dealer file</h1></div>' +
        '<p class="head__meta">Record ' + esc(KEY) + '</p></div>';
      document.title = 'Dealer file — AAN (Gen 11)';
      return;
    }

    var chips = (R.badges || []).map(function (b) {
      return '<span class="chip chip--' + esc(b.tone) + '">' + esc(b.l) + '</span>';
    }).join('');

    var db = R.db ? '<a class="dbchip" href="' + esc(R.db.href) + '" title="' + esc(R.db.title) + '">' +
      ic('i-db') + esc(R.db.l) + '</a>' : '';

    var audit = (R.audit || []).length
      ? '<p class="head__audit">' + R.audit.map(function (a) {
          return '<span><b>' + esc(a.l) + '</b> <i>' + esc(a.v) + '</i></span>';
        }).join('') + '</p>'
      : (R.meta ? '<p class="head__meta">' + esc(R.meta) + '</p>' : '');

    var quick = (R.quick || []).length
      ? '<nav class="head__quick" aria-label="Dealer quick links">' +
        R.quick.map(function (q, i) {
          return (i ? '<span class="sep" aria-hidden="true">·</span>' : '') +
            '<a href="' + esc(q.href) + '"' + (q.ext ? ' target="_blank" rel="noopener"' : '') + '>' +
            esc(q.l) + (q.ext ? ic('i-ext') : '') + '</a>';
        }).join('') + '</nav>'
      : '';

    $('#head').innerHTML = back +
      '<div class="head__id">' +
        '<div class="head__row"><h1>' + esc(R.title) + '</h1>' +
          (R.id ? '<span class="head__n">#' + R.id + '</span>' : '') + chips + db +
        '</div>' + audit +
      '</div>' + quick;

    document.title = (R.name || 'Add New Dealer') + ' — Dealer File · AAN (Gen 11)';
  }

  /* ══ RAIL ═════════════════════════════════════════════════════════════════ */

  function renderRail() {
    if (!R) { $('#rail').innerHTML = ''; return; }
    $('#rail').innerHTML = D.zones.map(function (z, i) {
      var dot = (R.dots || {})[z.id] || 'grey';
      return '<button class="rail__b ui-nav__i' + (i === 0 ? ' rail__b--on ui-nav__i--on' : '') + '" type="button" data-zone="' + z.id + '">' +
        '<span class="dot dot--' + dot + '" aria-hidden="true"></span>' +
        '<span>' + esc(z.t) + '</span>' +
        '<span class="vh">— ' + DOT_WORD[dot] + '</span></button>';
    }).join('') +
    '<div class="rail__sep"></div>' +
    '<span class="rail__hint">Jump: <kbd>/</kbd></span>';
  }

  /* ══ FIELDS ═══════════════════════════════════════════════════════════════ */

  function val(k) { return V[k]; }

  function optList(o, cur) {
    return o.map(function (x) {
      return '<option value="' + esc(x.v) + '"' + (String(x.v) === String(cur == null ? '' : cur) ? ' selected' : '') +
        '>' + esc(x.l) + '</option>';
    }).join('');
  }

  function label(f, id) {
    return '<label class="fl' + (f.req ? ' fl--req' : '') + '" for="' + id + '">' + esc(f.l) + '</label>';
  }
  function help(f) { return f.help ? '<p class="fh">' + f.help + '</p>' : ''; }

  function seal(f, id) {
    var v = val(f.k);
    var stored = v === '__SEALED__';
    /* On a NEW record production ships a plain input — there is no stored
       secret to protect yet, so there is nothing to seal. */
    if (isNew) {
      return '<input class="fld" id="' + id + '" type="password" autocomplete="new-password" data-k="' + esc(f.k) + '" value="">';
    }
    return '<div class="seal" data-seal="' + esc(f.k) + '">' +
      '<span class="seal__lock" aria-hidden="true">' + ic('i-lock') + '</span>' +
      (stored
        ? '<span class="seal__dots">••••••</span>'
        : '<span class="seal__dots"><span class="seal__none">— none —</span></span>') +
      (stored
        ? '<button class="seal__b" type="button" disabled title="Production fetches the stored value from the server for 15 seconds; this build has no server">' +
            ic('i-eye') + 'Reveal</button>' +
          '<button class="seal__b" type="button" disabled title="Copy without revealing — also a server call">' +
            ic('i-copy') + '</button>'
        : '') +
      '<button class="seal__b" type="button" data-seal-edit="' + esc(f.k) + '">' + (stored ? 'Change' : 'Set') + '</button>' +
      '</div>';
  }

  function control(f, id) {
    var v = val(f.k);
    switch (f.t) {
      case 'select':
        return '<select class="fld" id="' + id + '" data-k="' + esc(f.k) + '">' +
          optList((isNew && f.optsNew) ? f.optsNew : f.opts, v) + '</select>';
      case 'selother':
        return '<div class="fpair">' +
          '<select class="fld" id="' + id + '" data-k="' + esc(f.k) + '">' + optList(f.opts, v) + '</select>' +
          '<input class="fld" type="text" data-k="' + esc(f.k) + '" placeholder="' + esc(f.ph || '') +
            '" aria-label="' + esc(f.l) + ' — other" value="' + esc(
              f.opts.some(function (o) { return String(o.v) === String(v); }) ? '' : (v || '')) + '">' +
          '</div>';
      case 'radio': {
        var unset = !f.opts.some(function (o) { return String(o.v) === String(v); });
        return '<span class="seg' + (unset ? ' seg--unset' : '') + '" role="radiogroup" aria-label="' + esc(f.l) + '">' +
          f.opts.map(function (o, i) {
            return '<label class="seg__o"><input type="radio" name="' + esc(f.k) + '" value="' + esc(o.v) + '" data-k="' +
              esc(f.k) + '"' + (String(o.v) === String(v) ? ' checked' : '') + (i === 0 ? ' id="' + id + '"' : '') + '>' +
              '<span>' + esc(o.l) + '</span></label>';
          }).join('') + '</span>';
      }
      case 'check':
        /* production labels this one above the control and leaves the box
           bare, so the accessible name comes from that label rather than from
           a second copy of the same words beside the box */
        return '<span class="opt opt--bare"><input type="checkbox" class="ck" id="' + id +
          '" data-k="' + esc(f.k) + '" aria-labelledby="' + id + '-l"' + (v ? ' checked' : '') + '></span>';
      case 'checks':
        return '<span class="opts">' + f.opts.map(function (o) {
          return '<label class="opt"><input type="checkbox" class="ck" data-k="' + esc(f.k) + '" value="' + esc(o.v) + '"' +
            ((v || []).indexOf(o.v) >= 0 ? ' checked' : '') + '> ' + esc(o.l) + '</label>';
        }).join('') + '</span>';
      case 'area':
        return '<textarea class="fld fld--area" id="' + id + '" rows="' + (f.rows || 2) + '" data-k="' +
          esc(f.k) + '">' + esc(v || '') + '</textarea>';
      case 'date':
        return '<input class="fld fld--num" id="' + id + '" type="date" data-k="' + esc(f.k) + '" value="' + esc(v || '') + '">';
      case 'seal':
        return seal(f, id);
      case 'repeat':
        return '<div class="rep" data-rep="' + esc(f.k) + '">' + repRows(f) +
          '<button class="addb" type="button" data-rep-add="' + esc(f.k) + '">' + esc(f.add || '+ add') + '</button></div>';
      case 'domains':
        return '<div class="doms">' + (v || []).map(function (d, i) {
          return '<input class="fld" type="text" data-k="' + esc(f.k) + '" data-i="' + i +
            '" aria-label="Domain ' + (i + 1) + '" value="' + esc(d) + '">';
        }).join('') + '</div>';
      case 'projact':
        return '<div class="projact">' + f.btns.map(function (b) {
          return '<button class="btn btn--sheet btn--sm" type="button" data-confirm="' + esc(b.confirm) + '">' +
            esc(b.l) + '</button>';
        }).join('') + '<span class="projact__hint">' + esc(f.hint) + '</span></div>';
      case 'routing':
        return routing(f);
      default:
        return '<input class="fld" id="' + id + '" type="text" data-k="' + esc(f.k) + '" placeholder="' +
          esc(f.ph || '') + '" value="' + esc(v == null ? '' : v) + '">';
    }
  }

  function repRows(f) {
    var list = val(f.k) || [];
    return list.map(function (x, i) {
      return '<div class="rep__r"><input class="fld" type="text" data-k="' + esc(f.k) + '" data-i="' + i +
        '" aria-label="' + esc(f.l) + ' ' + (i + 1) + '" value="' + esc(x) + '">' +
        '<button class="xb" type="button" data-rep-rm="' + esc(f.k) + '" data-i="' + i +
        '" title="Remove" aria-label="Remove ' + esc(f.l) + ' ' + (i + 1) + '">' + ic('i-x') + '</button></div>';
    }).join('');
  }

  function routing(f) {
    var rows = val(f.k) || [];
    var saved = val('emailSetupSaved');
    return '<div class="routing" data-routing>' +
      (saved ? '' : '<p class="routing__hint">' + f.hint + '</p>') +
      '<table class="rtbl"><thead><tr>' +
        f.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') +
        '<th><span class="vh">Remove</span></th></tr></thead><tbody>' +
      rows.map(function (r, i) {
        var warn = !r.email_address;
        return '<tr' + (warn ? ' class="rt--warn"' : '') + '>' +
          '<td><input class="fld" type="text" placeholder="email address…" data-rk="email_address" data-i="' + i +
            '" aria-label="Email address, row ' + (i + 1) + '" value="' + esc(r.email_address) + '"></td>' +
          '<td><input class="fld" type="text" placeholder="e.g. Finance" data-rk="email_description" data-i="' + i +
            '" aria-label="Purpose, row ' + (i + 1) + '" value="' + esc(r.email_description) + '"></td>' +
          '<td><input class="fld" type="text" placeholder="forward to…" data-rk="email_forward" data-i="' + i +
            '" aria-label="Forward to, row ' + (i + 1) + '" value="' + esc(r.email_forward) + '"></td>' +
          '<td><span class="seg' + (r.email_format ? '' : ' seg--unset') + '" role="radiogroup" aria-label="Lead format, row ' + (i + 1) + '">' +
            ['HTML', 'XML'].map(function (o) {
              return '<label class="seg__o"><input type="radio" name="email_format_' + i + '" value="' + o +
                '" data-rk="email_format" data-i="' + i + '"' + (r.email_format === o ? ' checked' : '') + '>' +
                '<span>' + o + '</span></label>';
            }).join('') + '</span></td>' +
          '<td><button class="xb" type="button" data-row-rm="' + i + '" title="Remove row" aria-label="Remove mailbox row ' +
            (i + 1) + '">' + ic('i-x') + '</button></td></tr>';
      }).join('') +
      '</tbody></table>' +
      '<button class="addb" type="button" data-row-add>' + esc(f.add) + '</button>' +
      '<p class="routing__xref">' + f.xref + '</p>' +
      '</div>';
  }

  function fieldHTML(f, n) {
    if (f.sec) return '<div class="fsec">' + esc(f.sec) + '</div>';
    if (f.only && f.only.indexOf(KEY) < 0) return '';
    var id = 'f' + n;
    var span = f.span || f.t === 'routing' || f.t === 'projact' ? ' fw--span' : '';
    /* a lone checkbox carries its own label, so the group heading would repeat it */
    if (f.t === 'check') {
      return '<div class="fw' + span + '"><span class="fl" id="' + id + '-l">' + esc(f.l) + '</span>' +
        control(f, id) + help(f) + '</div>';
    }
    if (f.t === 'projact') return '<div class="fw' + span + '">' + control(f, id) + '</div>';
    if (f.t === 'routing') return '<div class="fw' + span + '">' + control(f, id) + '</div>';
    return '<div class="fw' + span + '">' + label(f, id) + control(f, id) + help(f) + '</div>';
  }

  function renderZones() {
    if (!R) {
      $('#zones').innerHTML =
        '<div class="miss"><b>No dealer file for record &ldquo;' + esc(KEY) + '&rdquo;</b>' +
        '<p>The 2026-09-09 production export captured three dealer files, so those three open here. ' +
        'Every other dealer has a roster row and no captured form, and nothing has been invented to ' +
        'stand in for one.</p><div class="miss__links">' +
        '<a class="btn btn--sheet" href="dealer-edit-gen11.html?dealer=186">Miller Motorcars #186 — populated</a>' +
        '<a class="btn btn--sheet" href="dealer-edit-gen11.html?dealer=1144">Beat The Trade #1144 — sparse</a>' +
        '<a class="btn btn--sheet" href="dealer-edit-gen11.html?dealer=new">Add New Dealer — blank</a>' +
        '</div><a class="btn btn--quiet" href="manage-dealers-gen11.html">Back to Manage Dealers</a></div>';
      $('#savebar').hidden = true;
      return;
    }
    var n = 0;
    $('#zones').innerHTML = D.zones.map(function (z) {
      return '<section class="zone" id="' + z.id + '" aria-labelledby="' + z.id + '-h">' +
        '<header class="zone__hd"><h2 class="zone__t" id="' + z.id + '-h">' + esc(z.t) + '</h2>' +
        '<span class="zone__s">' + esc(z.s) + '</span></header>' +
        '<div class="fg">' + z.fields.map(function (f) { return fieldHTML(f, ++n); }).join('') + '</div>' +
      '</section>';
    }).join('');
  }

  /* ══ SIDE ═════════════════════════════════════════════════════════════════ */

  function renderSide() {
    if (!R) { $('#side').innerHTML = ''; return; }
    var out = '';

    /* Notes — read-only history, then one place to add to it */
    var notes = R.notes;
    out += '<section class="panel"><div class="panel__hd">Notes' +
      (notes ? '<span class="panel__n">' + notes.length + '</span>' : '') + '</div><div class="panel__bd">';
    if (notes && notes.length) {
      out += '<div class="notes">' + notes.map(function (x) {
        return '<div class="note"><span class="note__who">' + esc(x.who) + '</span>' +
          '<span class="note__txt">' + esc(x.txt) + '</span></div>';
      }).join('') + '</div>';
    } else if (notes) {
      out += '<p class="panel__empty">No notes yet — the first note saved here starts this dealer&rsquo;s history.</p>';
    }
    out += '<textarea class="fld fld--area" rows="3" data-k="note" placeholder="New note (appended on save)…" aria-label="New note"></textarea>';
    if (notes) out += '<button class="addb" type="button" data-act="add-note" style="margin-top:8px">Add Comment</button>';
    out += '</div></section>';

    /* Options — five flags, each with the sentence that says what it does */
    if (R.flags) {
      out += '<section class="panel"><div class="panel__hd">Options</div><div class="panel__bd">' +
        D.flagList.map(function (fl) {
          return '<label class="flag"><span class="flag__r">' +
            '<input type="checkbox" class="ck" data-k="' + esc(fl.k) + '"' + (R.flags[fl.k] ? ' checked' : '') + '>' +
            '<span><span class="flag__l">' + esc(fl.l) + '</span>' +
            '<span class="flag__why' + (fl.cascade ? ' flag__why--cas' : '') + '">' + esc(fl.why) + '</span>' +
            '</span></span></label>';
        }).join('') + '</div></section>';
    }

    /* Danger & Locks — one action, alone, so nothing sits beside it */
    if (R.lock) {
      out += '<section class="panel panel--danger"><div class="panel__hd">Danger &amp; Locks</div>' +
        '<div class="panel__bd panel__bd--stack">' +
        '<button class="btn btn--sm btn--lock" type="button" data-act="lock">' + ic('i-lock') + ' Save + Lock account</button>' +
        '<p class="panel__hint">Locked accounts reject edits from non-admins (legacy <span class="mono">locked_by</span> parity)</p>' +
        '</div></section>';
    }

    $('#side').innerHTML = out;
  }

  function renderSaveBar() {
    if (!R) return;
    $('#save').textContent = R.save.primary;
    var t = $('#temp');
    t.hidden = !R.save.temp;
    if (R.save.temp) t.title = R.save.tempTitle || '';
  }

  /* ══ EDITS ════════════════════════════════════════════════════════════════ */

  function bump() {
    dirty++;
    $('#dirty').hidden = false;
    $('#discard').hidden = false;
  }
  function clean() {
    dirty = 0;
    $('#dirty').hidden = true;
    $('#discard').hidden = true;
  }

  document.addEventListener('input', onEdit);
  document.addEventListener('change', onEdit);

  function onEdit(e) {
    var el = e.target;
    if (!el.matches || !el.matches('[data-k], [data-rk]')) return;

    if (el.hasAttribute('data-rk')) {
      var i = +el.getAttribute('data-i');
      V.emailSetup[i][el.getAttribute('data-rk')] = el.type === 'radio' ? el.value : el.value;
      if (el.getAttribute('data-rk') === 'email_address' && e.type === 'change') renderZoneEmail();
      bump();
      return;
    }

    var k = el.getAttribute('data-k');
    if (el.type === 'checkbox' && el.hasAttribute('value')) {
      var arr = V[k] || [];
      var at = arr.indexOf(el.value);
      if (el.checked && at < 0) arr.push(el.value);
      if (!el.checked && at >= 0) arr.splice(at, 1);
      V[k] = arr;
    } else if (el.type === 'checkbox') {
      if (R.flags && Object.prototype.hasOwnProperty.call(R.flags, k)) R.flags[k] = el.checked;
      else V[k] = el.checked;
    } else if (el.hasAttribute('data-i')) {
      var j = +el.getAttribute('data-i');
      V[k] = (V[k] || []).slice();
      V[k][j] = el.value;
    } else {
      V[k] = el.value;
    }
    /* a radio group stops being "unset" the moment one is chosen */
    if (el.type === 'radio') {
      var seg = el.closest('.seg');
      if (seg) seg.classList.remove('seg--unset');
    }
    bump();
  }

  document.addEventListener('click', function (e) {
    var t;

    if ((t = e.target.closest('[data-rep-add]'))) {
      var k = t.getAttribute('data-rep-add');
      V[k] = (V[k] || []).concat(['']);
      redrawRepeat(k); bump(); return;
    }
    if ((t = e.target.closest('[data-rep-rm]'))) {
      var rk = t.getAttribute('data-rep-rm'), ri = +t.getAttribute('data-i');
      V[rk] = (V[rk] || []).filter(function (_, i) { return i !== ri; });
      redrawRepeat(rk); bump(); return;
    }
    if (e.target.closest('[data-row-add]')) {
      V.emailSetup = V.emailSetup.concat([{ email_address: '', email_description: '', email_forward: '', email_format: '' }]);
      renderZoneEmail(); bump(); return;
    }
    if ((t = e.target.closest('[data-row-rm]'))) {
      var i2 = +t.getAttribute('data-row-rm');
      V.emailSetup = V.emailSetup.filter(function (_, i) { return i !== i2; });
      renderZoneEmail(); bump(); return;
    }
    if ((t = e.target.closest('[data-seal-edit]'))) { openSeal(t.getAttribute('data-seal-edit')); return; }
    if ((t = e.target.closest('[data-seal-cancel]'))) { closeSeal(t.getAttribute('data-seal-cancel')); return; }
    if ((t = e.target.closest('[data-confirm]'))) { window.confirm(t.getAttribute('data-confirm')); return; }
  });

  function redrawRepeat(k) {
    var host = $('[data-rep="' + k + '"]');
    if (!host) return;
    var f = null;
    D.zones.forEach(function (z) { z.fields.forEach(function (x) { if (x.k === k) f = x; }); });
    host.innerHTML = repRows(f) +
      '<button class="addb" type="button" data-rep-add="' + esc(k) + '">' + esc(f.add || '+ add') + '</button>';
  }

  function renderZoneEmail() {
    var host = $('[data-routing]');
    if (!host) return;
    var f = D.zones.filter(function (z) { return z.id === 'zEmail'; })[0].fields[0];
    host.outerHTML = routing(f);
  }

  /* the seal opens into an ordinary editable field, with a way back */
  function openSeal(k) {
    var host = $('[data-seal="' + k + '"]');
    if (!host) return;
    var stored = R.v[k] === '__SEALED__';
    host.classList.add('seal--edit');
    host.innerHTML =
      '<input class="fld" type="text" autocomplete="new-password" spellcheck="false" data-k="' + esc(k) +
        '" placeholder="' + (stored ? 'leave blank to keep current' : 'new value…') + '" value="">' +
      '<button class="seal__b seal__cancel" type="button" data-seal-cancel="' + esc(k) + '">' +
        (stored ? 'Keep current' : 'Cancel') + '</button>';
    host.querySelector('input').focus();
    V[k] = stored ? '__SEALED__' : '';
  }
  function closeSeal(k) {
    var host = $('[data-seal="' + k + '"]');
    if (!host) return;
    V[k] = R.v[k];
    var f = null;
    D.zones.forEach(function (z) { z.fields.forEach(function (x) { if (x.k === k) f = x; }); });
    host.outerHTML = seal(f, 'seal-' + k);
  }

  /* ══ SAVE ═════════════════════════════════════════════════════════════════ */

  $('#save').addEventListener('click', commit);
  $('#temp').addEventListener('click', commit);
  $('#discard').addEventListener('click', function () {
    V = JSON.parse(JSON.stringify(R.v));
    if (R.flags) R.flags = JSON.parse(JSON.stringify(D.records[KEY].flags));
    renderZones(); renderSide(); clean(); spy();
  });
  function commit() {
    /* There is no server behind this build, so a save cannot be reported as
       having happened. It clears the dirty state it owns and says where the
       write would go, rather than showing a green tick for nothing. */
    clean();
    $('#dirty').hidden = false;
    $('#dirty').innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-alert"/></svg> ' +
      'Save posts to the server; this build has none';
    setTimeout(function () {
      $('#dirty').hidden = true;
      $('#dirty').innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-alert"/></svg> Unsaved changes';
    }, 2600);
  }

  /* ══ KEYS — both are the export's own ═════════════════════════════════════ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePops(null); return; }
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      if (dirty > 0) commit();
      return;
    }
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      var first = $('.rail__b');
      if (first) { e.preventDefault(); first.focus(); }
    }
  });
  /* arrow keys walk the rail, as the export's roving focus does */
  $('#rail').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    var items = $$('.rail__b');
    var at = items.indexOf(document.activeElement);
    if (at < 0) return;
    e.preventDefault();
    items[(at + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus();
  });

  $('#rail').addEventListener('click', function (e) {
    var b = e.target.closest('[data-zone]');
    if (!b) return;
    var el = document.getElementById(b.getAttribute('data-zone'));
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.scrollY - stackH() - 8;
    window.scrollTo({ top: Math.max(0, y), behavior: reduced() ? 'auto' : 'smooth' });
    mark(b.getAttribute('data-zone'));
  });

  /* ══ POPOVERS ═════════════════════════════════════════════════════════════ */
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
      return;
    }
    if (!e.target.closest('.pop')) closePops(null);
  });

  /* ══ STICKY + SCROLL SPY ══════════════════════════════════════════════════
     CSS publishes the geometry; this reads it. The two layers are the platform
     bar and the record head, so the stack is --stick-bar + --stick-head. */
  var CSSV = getComputedStyle(document.documentElement);
  function cssPx(n, f) { var v = parseFloat(CSSV.getPropertyValue(n)); return isNaN(v) ? f : v; }
  function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function stackH() { return cssPx('--stick-bar', 68) + cssPx('--stick-head', 96); }

  function mark(id) {
    $$('.rail__b').forEach(function (b) {
      var on = b.getAttribute('data-zone') === id;
      b.classList.toggle('rail__b--on', on); b.classList.toggle('ui-nav__i--on', on);
      b.setAttribute('aria-current', on ? 'true' : 'false');
    });
  }

  var stuck = null;
  function spy() {
    var head = $('#head'), app = $('#app');
    var s = window.scrollY > 4;
    if (s !== stuck) {
      stuck = s;
      head.classList.toggle('head--stuck', s);
      app.classList.toggle('is-stuck', s);
    }
    if (!R) return;
    var limit = stackH() + 12;
    var cur = D.zones[0].id;
    D.zones.forEach(function (z) {
      var el = document.getElementById(z.id);
      if (el && el.getBoundingClientRect().top <= limit) cur = z.id;
    });
    mark(cur);
  }
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', spy);

  /* ── boot ────────────────────────────────────────────────────────────── */
  renderNav();
  renderHead();
  renderRail();
  renderZones();
  renderSide();
  renderSaveBar();
  clean();
  spy();

  window.DE11 = { V: V, key: KEY, record: R };
})();

/* ── the page reserves exactly the height of its save footer ────────────────
   The footer is fixed, so it is out of flow; the working surface has to hold
   its height back or the last field of the form sits underneath it. The bar
   grows when the unsaved-changes note appears, so it is measured rather than
   assumed. */
(function () {
  function sizeSaveBar() {
    var bar = document.querySelector('.savebar');
    if (!bar) return;
    document.documentElement.style.setProperty('--savebar-h', Math.ceil(bar.getBoundingClientRect().height) + 'px');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sizeSaveBar);
  else sizeSaveBar();
  window.addEventListener('resize', sizeSaveBar);
  if (window.ResizeObserver) {
    var bar = document.querySelector('.savebar');
    if (bar) new ResizeObserver(sizeSaveBar).observe(bar);
  }
})();
