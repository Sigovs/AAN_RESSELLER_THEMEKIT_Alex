/* AAN · Staff UI · Feed Groups — GENERATION 11
   Built from the system only. Two views of one page, switched by the address hash:
     (none)      the list — Feeds Incoming's skeleton; Assignment opens an in-flow panel under its row
     #new        the editor, empty, as the backend's New Group
     #group-ID   the editor for one group of the sample (name, type and on/off only — the rest is not read)
   Nothing writes: Save and Submit say "Demo — nothing is saved"; Delete is inert. */
(function () {
  'use strict';
  var MD = window.MD, D = window.FG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ic(id) { return '<svg class="i" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  var TYPE = { all: 'All', new: 'New', used: 'Used' };
  var ON = {};   /* the switches' client-side state, by group id (not read: they start on) */
  D.rows.forEach(function (r) { ON[r[0]] = true; });

  /* ── nav: the staff menus, as Feeds Incoming; this page lives under Feed Management ── */
  var NAV_HIDDEN = ['Add New OEM', 'View OEM Accounts', 'Add New Reseller Group', 'View Reseller Groups'];
  function renderNav() {
    $('#nav').innerHTML = MD.nav.map(function (g, i) {
      if (g.g === 'AAN Projects') return '';
      var id = 'p-nav-' + i, on = g.g === 'Feed Management';
      return '<div class="nav__it' + (on ? ' nav__it--on' : '') + '">' +
        '<button class="nav__b" type="button" data-pop="' + id + '" aria-haspopup="true" aria-expanded="false">' + esc(g.g) + ic('i-chev') + '</button>' +
        '<div class="pop" id="' + id + '"><div class="caps pop__lab">' + esc(g.g) + '</div>' +
          g.i.filter(function (l) { return NAV_HIDDEN.indexOf(l) < 0; }).map(function (l) {
            var href = l === 'Feeds Incoming' ? 'feeds-incoming-gen11.html' : l === 'View Dealers' ? 'manage-dealers-gen11.html' : l === 'My Work' ? 'my-work-queue-gen11.html' : '#';
            return '<a class="mn__it' + (l.indexOf('--') === 0 ? ' mn__it--sub' : '') + '" href="' + href + '">' + esc(l) + '</a>';
          }).join('') + '</div></div>';
    }).join('');
  }

  /* ══ THE LIST ═══════════════════════════════════════════════════════════ */
  function rowHTML(r) {
    var id = r[0], on = ON[id];
    return '<div class="row' + (on ? '' : ' fgp-off') + '" data-id="' + id + '">' +
      '<span class="c-id">' + id + '</span>' +
      '<span class="c-name"><a href="#group-' + id + '" title="Edit group ' + esc(r[1]) + '">' + esc(r[1]) + '</a></span>' +
      '<span class="c-type">' + TYPE[r[2]] + '</span>' +
      '<span class="c-on"><label class="ui-switch" title="On / Off (demo: switches here only)"><input type="checkbox" role="switch" data-on="' + id + '"' + (on ? ' checked' : '') +
        ' aria-label="' + esc(r[1]) + ' on / off"><span class="ui-switch__t"></span></label></span>' +
      '<span class="c-asg"><button class="fgp-asg" type="button" data-asg="' + id + '" aria-expanded="false" aria-controls="asg-' + id + '">Assignment</button></span>' +
      '<span class="c-del"><button class="btn btn--quiet btn--sm btn--danger fgp-del" type="button" data-del="' + id + '" title="Delete group — demo, nothing is deleted">Delete</button></span>' +
    '</div>';
  }
  function renderList() {
    $('#tb').innerHTML = D.rows.map(rowHTML).join('');
    $('#foot-n').textContent = D.rows.length;
    $('#list-meta').textContent = D.total + ' groups · demo sample of ' + D.rows.length;
  }

  /* ── Assignment: the backend's "Assign dealers to … group" modal becomes the row's in-flow panel
       (DESIGN.md §8: in flow, the row's edges, one hairline, nothing covered). One open at a time. ── */
  var ASG_COLS = ['Dealer ID', 'Company Name', 'Select All', 'Constant Value #1', 'Feed ID', 'Feed Name'];
  function asgHTML(r) {
    var id = r[0];
    return '<div class="fgp-exp" id="asg-' + id + '" role="region" aria-labelledby="asg-t-' + id + '">' +
      '<div class="fgp-exp__h"><h3 class="fgp-exp__t" id="asg-t-' + id + '">Assign dealers to “' + esc(r[1]) + '” group</h3>' +
        '<span class="demo">Demo</span><span class="fgp-exp__sp"></span>' +
        '<button class="btn btn--quiet btn--sm btn--icon" type="button" data-asg-close="' + id + '" aria-label="Close" title="Close">' + ic('i-x') + '</button></div>' +
      '<table class="fgp-tbl fgp-tbl--asg"><thead><tr>' +
        '<th class="fgp-tbl__ck"><input class="ck" type="checkbox" aria-label="Select every dealer" disabled></th>' +
        ASG_COLS.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead>' +
        '<tbody><tr><td colspan="' + (ASG_COLS.length + 1) + '" class="fgp-tbl__none">The dealer list is not in this sample — the backend lists every dealer here, with the ones in this group checked.</td></tr></tbody></table>' +
      '<div class="fgp-exp__f"><span class="fgp-res" role="status" aria-live="polite"></span>' +
        '<button class="btn btn--quiet btn--sm" type="button" data-asg-close="' + id + '">Close</button>' +
        '<button class="btn btn--sheet btn--sm" type="button" data-asg-submit="' + id + '">Submit</button></div>' +
    '</div>';
  }
  function closeAsg() {
    $$('.fgp-exp', $('#tb')).forEach(function (x) { x.remove(); });
    $$('.fgp-asg[aria-expanded="true"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); b.classList.remove('fgp-asg--on'); });
    $$('#tb > .row.fgp-open').forEach(function (r) { r.classList.remove('fgp-open'); });
    $('#exp-space').style.height = '0px';
  }
  function px(v) { return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(v)) || 0; }
  function openAsg(id) {
    var was = $('#asg-' + id);
    closeAsg();
    if (was) return;
    var r = D.rows.filter(function (x) { return x[0] === id; })[0];
    var row = $('#tb > .row[data-id="' + id + '"]');
    row.insertAdjacentHTML('afterend', asgHTML(r));
    row.classList.add('fgp-open');
    var b = $('.fgp-asg', row); b.setAttribute('aria-expanded', 'true'); b.classList.add('fgp-asg--on');
    /* the selected-row anchor: the row lands under the sticky stack (bar + column head), --anchor-gap 10 below it */
    var stack = px('--stick-bar') + $('#hd').getBoundingClientRect().height + 10;
    var y = row.getBoundingClientRect().top + window.scrollY - stack;
    var short = y - (document.documentElement.scrollHeight - innerHeight);
    $('#exp-space').style.height = Math.max(0, Math.ceil(short)) + 'px';
    window.scrollTo(0, Math.max(0, y));
  }

  /* ══ THE EDITOR ════════════════════════════════════════════════════════ */
  var NOT_READ = '<option value="" disabled>Options not in this read</option>';
  function lab(f, forId) {
    return '<span class="f__l"' + (forId ? '' : '') + '>' + esc(f.l) + (f.req ? '<span class="f__req" aria-hidden="true">*</span><span class="vh"> (required)</span>' : '') + '</span>';
  }
  function select(f, id) {
    var o = f.o ? f.o.map(function (v, i) { return '<option value="' + (v === '—' ? '' : esc(v)) + '">' + esc(v) + '</option>'; }).join('')
                : '<option value="">—</option>' + NOT_READ;
    return '<select class="fld" id="' + id + '" name="' + f.n + '"' + (f.req ? ' aria-required="true"' : '') + (f.o ? '' : ' title="The options of this select were not part of the read"') + '>' + o + '</select>';
  }
  function seg(name, opts, label) {
    return '<div class="seg fgp-seg seg--unset" role="radiogroup" aria-label="' + esc(label) + '">' + opts.map(function (v) {
      return '<label class="seg__o"><input type="radio" name="' + name + '" value="' + esc(v) + '"><span>' + esc(v) + '</span></label>';
    }).join('') + '</div>';
  }
  function opt(n, l, on) {
    return '<label class="opt"><input class="ck" type="checkbox" name="' + n + '"' + (on ? ' checked' : '') + '><span>' + esc(l) + '</span></label>';
  }
  function field(f) {
    var id = 'f-' + (f.n || Math.random().toString(36).slice(2)), w = ' w' + (f.w || 3);
    switch (f.k) {
      case 'text': case 'password':
        return '<label class="f' + w + '" data-f="' + f.n + '">' + lab(f) +
          '<input class="fld' + (f.num ? ' fld--num' : '') + '" type="' + f.k + '" id="' + id + '" name="' + f.n + '"' + (f.num ? ' inputmode="numeric"' : '') + (f.req ? ' aria-required="true"' : '') + (f.k === 'password' ? ' autocomplete="new-password"' : '') + '></label>';
      case 'select':
        return '<label class="f' + w + '" data-f="' + f.n + '">' + lab(f) + select(f, id) + '</label>';
      case 'flag':   /* a checkbox whose only label is the field label above it (Dealer Edit's .opt--bare) */
        return '<label class="f' + w + '" data-f="' + f.n + '">' + lab(f) + '<span class="opt opt--bare"><input class="ck" type="checkbox" name="' + f.n + '"></span></label>';
      case 'check':  /* a checkbox with its own label, level with the controls of its row */
        return '<div class="f f--opt' + w + '">' + opt(f.n, f.l) + '</div>';
      case 'flags':  /* a backend section that is one or two checkboxes: its name is the field label */
        return '<div class="f' + w + '" role="group" aria-label="' + esc(f.l) + '">' + lab(f) + '<div class="opts">' + f.o.map(function (o) { return opt(o[0], o[1]); }).join('') + '</div></div>';
      case 'checks':
        return '<div class="opts' + (f.grid ? ' opts--grid' : '') + w + '">' + f.o.map(function (o) { return opt(o[0], o[1], o[2]); }).join('') + '</div>';
      case 'seg':
        return '<div class="f' + w + '" role="group" aria-label="' + esc(f.l) + '" data-f="' + f.n + '">' + lab(f) +
          '<div class="fgp-segrow">' + seg(f.n, f.o, f.l) +
          (f.ck ? '<label class="opt"><input class="ck" type="checkbox" name="' + f.ck + '"><span class="none" title="The label of this checkbox was not part of the read">label not in the read</span></label>' : '') +
          '</div></div>';
      case 'sql':
        return '<label class="f' + w + '" data-f="' + f.n + '"><span class="f__l">' + esc(f.l) + '<span class="fgp-warn">' + ic('i-alert') + 'error can crash the system</span></span>' +
          '<input class="fld fld--mono" type="text" id="' + id + '" name="' + f.n + '" spellcheck="false">' +
          '<span class="f__help">ex: <code>' + esc(f.ex) + '</code></span></label>';
      case 'map':
        return '<div class="w12 fgp-map">' +
          '<table class="fgp-tbl fgp-tbl--map"><thead><tr><th>DB Field</th><th>Feed Field Name</th><th class="fgp-tbl__pos">Position</th><th class="fgp-tbl__act"><span class="vh">Field actions</span></th></tr></thead>' +
          '<tbody id="map-tb"></tbody></table>' +
          '<div class="fgp-map__f"><button class="btn btn--sheet btn--sm" type="button" data-act="add-field">' + ic('i-plus') + ' Add Field</button></div></div>';
      case 'lab':
        return '<div class="f fgp-lab' + w + '"><div class="fgp-labrow">' +
          '<select class="fld" id="' + id + '" name="' + f.n + '" aria-labelledby="t-lab" title="The data labs were not part of the read"><option value="">—</option>' + NOT_READ + '</select>' +
          '<button class="btn btn--sheet btn--sm" type="button" data-act="add-lab">' + ic('i-plus') + ' Add data lab</button></div>' +
          '<span class="fgp-res fgp-res--inline" id="lab-res" role="status" aria-live="polite"></span></div>';
      case 'area':
        return '<div class="f' + w + '"><textarea class="fld fld--area" id="' + id + '" name="' + f.n + '" rows="4" aria-labelledby="t-notes"></textarea></div>';
    }
    return '';
  }
  function renderEditor() {
    $('#zones').innerHTML = D.zones.map(function (z) {
      return '<section class="zone" id="z-' + z.id + '" aria-labelledby="t-' + z.id + '">' +
        '<header class="zone__hd"><h2 class="zone__t" id="t-' + z.id + '">' + esc(z.t) + '</h2>' +
          (z.id === 'map' ? '<span class="badge" id="map-n">0</span>' : '') + '</header>' +
        '<div class="fgrid">' + z.f.map(field).join('') + '</div></section>';
    }).join('');
    $('#rail').innerHTML = D.zones.map(function (z, i) {
      return '<a class="rail__b' + (i ? '' : ' rail__b--on') + '" href="#z-' + z.id + '" data-zone="z-' + z.id + '"' + (i ? '' : ' aria-current="true"') + '>' +
        '<span class="fgp-rail__t">' + esc(z.t) + '</span>' + (z.id === 'map' ? '<span class="badge" id="rail-map-n">0</span>' : '') + '</a>';
    }).join('');
    renderMap();
  }

  /* ── Field mapping: Add Field adds a row (client-side); Advanced setup opens under its row ── */
  var MAP = [], mapSeq = 0;
  function mapRowHTML(m, i) {
    var k = m.k;
    return '<tr class="fgp-map__r" data-map="' + k + '">' +
      '<td><select class="fld" name="map_db_' + k + '" aria-label="DB field, row ' + (i + 1) + '" title="The DB fields were not part of the read"><option value="">—</option>' + NOT_READ + '</select></td>' +
      '<td><input class="fld" type="text" name="map_feed_' + k + '" aria-label="Feed field name, row ' + (i + 1) + '"></td>' +
      '<td class="fgp-tbl__pos"><input class="fld fld--num" type="text" inputmode="numeric" name="map_pos_' + k + '" aria-label="Position, row ' + (i + 1) + '"></td>' +
      '<td class="fgp-tbl__act"><button class="btn btn--quiet btn--sm fgp-advb' + (m.adv ? ' fgp-asg--on' : '') + '" type="button" data-adv="' + k + '" aria-expanded="' + !!m.adv + '">' + ic('i-sliders') + ' Advanced setup</button>' +
        '<button class="btn btn--quiet btn--sm btn--icon fgp-rm" type="button" data-rm="' + k + '" aria-label="Remove row ' + (i + 1) + '" title="Remove this row">' + ic('i-x') + '</button></td></tr>' +
      (m.adv ? '<tr class="fgp-map__exp"><td colspan="4">' + advHTML(k) + '</td></tr>' : '');
  }
  function advHTML(k) {
    /* the backend's "Advanced setup for feed's field" dialog, in flow under its row */
    return '<div class="fgp-adv" role="region" aria-label="Advanced setup for feed\'s field">' +
      '<div class="fgp-exp__h"><h3 class="fgp-exp__t">Advanced setup for feed’s field</h3><span class="fgp-exp__sp"></span>' +
        '<button class="btn btn--quiet btn--sm btn--icon" type="button" data-adv="' + k + '" aria-label="Close advanced setup" title="Close">' + ic('i-x') + '</button></div>' +
      '<div class="fgrid">' +
        '<label class="f w6"><span class="f__l">Merge delimiter</span><select class="fld" name="adv_merge_' + k + '" title="The options were not part of the read"><option value="">—</option>' + NOT_READ + '</select>' +
          '<span class="f__help">identical field names / positions on different DB fields</span></label>' +
        '<div class="f w6" role="group" aria-label="Merge position"><span class="f__l">Merge position</span>' + seg('adv_mpos_' + k, ['Prepend', 'Append'], 'Merge position') + '</div>' +
        '<label class="f w6"><span class="f__l">Write this field’s data to second db field also</span><select class="fld" name="adv_second_' + k + '" title="The options were not part of the read"><option value="">—</option>' + NOT_READ + '</select></label>' +
        '<label class="f w3"><span class="f__l">Add string</span><input class="fld" type="text" name="adv_str_' + k + '"></label>' +
        '<div class="f w3" role="group" aria-label="Add string position"><span class="f__l">Add string position</span>' + seg('adv_spos_' + k, ['Prepend', 'Append'], 'Add string position') + '</div>' +
        '<div class="w12"><table class="fgp-tbl"><thead><tr><th>Data in field</th><th>Evaluates</th><th>To value</th><th>Take Data From</th><th>AND / OR</th></tr></thead>' +
          '<tbody><tr><td colspan="5" class="fgp-tbl__none">No conditions. The read shows this table’s columns only.</td></tr></tbody></table></div>' +
      '</div></div>';
  }
  function renderMap() {
    var tb = $('#map-tb'); if (!tb) return;
    tb.innerHTML = MAP.length ? MAP.map(mapRowHTML).join('')
      : '<tr><td colspan="4" class="fgp-tbl__none">No fields mapped yet. Add Field adds a row.</td></tr>';
    $('#map-n').textContent = MAP.length; $('#rail-map-n').textContent = MAP.length;
    count();
  }
  /* keep typed values across a re-render of the mapping table */
  function mapKeep(fn) {
    var keep = {};
    $$('#map-tb [name]').forEach(function (el) { keep[el.name] = el.type === 'radio' ? (el.checked ? el.value : keep[el.name]) : el.value; });
    fn(); renderMap();
    $$('#map-tb [name]').forEach(function (el) {
      if (!(el.name in keep) || keep[el.name] == null) return;
      if (el.type === 'radio') { el.checked = el.value === keep[el.name]; if (el.checked) el.closest('.seg').classList.remove('seg--unset'); }
      else el.value = keep[el.name];
    });
    count();
  }

  /* ── unsaved changes: every control against its value when the editor opened ── */
  var BASE = {};
  function val(el) { return el.type === 'checkbox' ? (el.checked ? '1' : '') : el.type === 'radio' ? (el.checked ? el.value : null) : el.value; }
  function snapshot() {
    BASE = {};
    $$('#zones [name]').forEach(function (el) { if (el.type === 'radio') { if (el.checked) BASE[el.name] = el.value; } else BASE[el.name] = val(el); });
  }
  function count() {
    var cur = {}, n = 0;
    $$('#zones [name]').forEach(function (el) { if (el.type === 'radio') { if (el.checked) cur[el.name] = el.value; else if (!(el.name in cur)) cur[el.name] = cur[el.name]; } else cur[el.name] = val(el); });
    Object.keys(cur).forEach(function (k) { if (/^(map|adv)_/.test(k)) return; if ((cur[k] || '') !== (BASE[k] || '')) n++; });
    n += MAP.length;   /* a mapping row added is a change, whatever is typed into it */
    $('#sb-n').innerHTML = n ? '<b>' + n + '</b> unsaved change' + (n === 1 ? '' : 's') : 'No unsaved changes';
    $('#sb-n').classList.toggle('savebar__n--dirty', n > 0);
    $('#save').disabled = n === 0;
    return n;
  }

  var CUR = null;   /* the group open in the editor, or null for a new one */
  function openEditor(id) {
    CUR = id == null ? null : D.rows.filter(function (r) { return r[0] === id; })[0] || null;
    $('#zones').reset();
    MAP = []; renderMap();
    $$('#zones .seg').forEach(function (s) { s.classList.add('seg--unset'); });
    $$('#zones .f--miss').forEach(function (f) { f.classList.remove('f--miss'); });
    $$('#zones [aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    $('#sb-res').textContent = ''; $('#sb-res').className = 'fgp-res'; $('#lab-res').textContent = '';
    if (CUR) {
      $('#f-name').value = CUR[1];
      $('#f-type').value = TYPE[CUR[2]];
      $('[name="active"]').checked = !!ON[CUR[0]];
      $('#ed-title').textContent = CUR[1];
      $('#ed-title').title = CUR[1];
      $('#ed-meta').hidden = true;   /* the way back already says where this is; the id pill says which */
      $('#ed-ctx').innerHTML = '<span class="chip chip--id"><span class="head__k">Group ID:</span> <b>' + CUR[0] + '</b></span>' +
        '<span class="demo">Demo</span><span class="fgp-edctx__t">Only the name, type and on / off are in the sample</span>';
      $('#save').textContent = 'Save Group';
    } else {
      $('#ed-title').textContent = 'New Group'; $('#ed-title').removeAttribute('title');
      $('#ed-meta').hidden = false; $('#ed-meta').textContent = 'Feed Groups · not saved yet';
      $('#ed-ctx').innerHTML = '';
    }
    snapshot(); count(); setRail('z-general');
  }

  function save() {
    var miss = 0;
    $$('#zones [aria-required="true"]').forEach(function (el) {
      var empty = !el.value;
      el.closest('.f').classList.toggle('f--miss', empty);
      if (empty) { el.setAttribute('aria-invalid', 'true'); miss++; } else el.removeAttribute('aria-invalid');
    });
    var res = $('#sb-res');
    res.className = 'fgp-res' + (miss ? ' fgp-res--err' : '');
    res.textContent = miss ? miss + ' required field' + (miss === 1 ? ' is' : 's are') + ' empty' : 'Demo — nothing is saved';
  }

  /* ── the rail: jump, and mark the zone in view ── */
  function setRail(zid) {
    $$('#rail .rail__b').forEach(function (b) {
      var on = b.getAttribute('data-zone') === zid;
      b.classList.toggle('rail__b--on', on);
      if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
  }
  var spyQueued = false;
  function spy() {
    spyQueued = false;
    if ($('#editor').hidden) return;
    var line = px('--stick-bar') + 48, cur = null;
    $$('#zones > .zone').forEach(function (z) { if (z.getBoundingClientRect().top <= line) cur = z.id; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) cur = $('#zones > .zone:last-child').id;
    setRail(cur || 'z-general');
  }
  window.addEventListener('scroll', function () { if (!spyQueued) { spyQueued = true; requestAnimationFrame(spy); } }, { passive: true });

  /* ── views, by the hash (the theme's #dark / #light review tokens are left alone) ── */
  function route() {
    var t = location.hash.slice(1).split('&').filter(function (x) { return x && x !== 'dark' && x !== 'light'; })[0] || '';
    var m = /^group-(\d+)$/.exec(t), ed = t === 'new' || !!m;
    $('#head-list').hidden = ed; $('#list').hidden = ed;
    $('#head-ed').hidden = !ed; $('#editor').hidden = !ed; $('#savebar').hidden = !ed;
    $('#app').classList.toggle('fgp--ed', ed);
    if (ed) openEditor(m ? +m[1] : null); else closeAsg();
    window.scrollTo(0, 0);
  }
  function toList() {
    var keep = location.hash.slice(1).split('&').filter(function (x) { return x === 'dark' || x === 'light'; });
    history.pushState(null, '', location.pathname + location.search + (keep.length ? '#' + keep.join('&') : ''));
    route();
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('popstate', route);

  /* ── popovers: Manage Dealers' behaviour ── */
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
    if (!e.target.closest('.pop')) closePops(null);
    if ((el = e.target.closest('[data-back]'))) { e.preventDefault(); toList(); return; }
    if ((el = e.target.closest('[data-asg]'))) { openAsg(+el.getAttribute('data-asg')); return; }
    if ((el = e.target.closest('[data-asg-close]'))) { var id = el.getAttribute('data-asg-close'); closeAsg(); var b = $('[data-asg="' + id + '"]'); if (b) b.focus(); return; }
    if ((el = e.target.closest('[data-asg-submit]'))) { var r = el.parentNode.querySelector('.fgp-res'); r.textContent = 'Demo — nothing is saved'; return; }
    if ((el = e.target.closest('[data-del]'))) return;   /* inert: nothing is deleted */
    if ((el = e.target.closest('[data-zone]'))) {
      e.preventDefault();
      var z = document.getElementById(el.getAttribute('data-zone'));
      window.scrollTo(0, z.getBoundingClientRect().top + window.scrollY - px('--stick-bar') - 16);
      setRail(z.id); return;
    }
    if (e.target.closest('[data-act="add-field"]')) { mapKeep(function () { MAP.push({ k: ++mapSeq, adv: false }); }); return; }
    if ((el = e.target.closest('[data-rm]'))) { var k = +el.getAttribute('data-rm'); mapKeep(function () { MAP = MAP.filter(function (m) { return m.k !== k; }); }); return; }
    if ((el = e.target.closest('[data-adv]'))) {
      var ka = +el.getAttribute('data-adv');
      mapKeep(function () { MAP.forEach(function (m) { if (m.k === ka) m.adv = !m.adv; }); });
      var nb = $('.fgp-advb[data-adv="' + ka + '"]'); if (nb) nb.focus();
      return;
    }
    if (e.target.closest('[data-act="add-lab"]')) { $('#lab-res').textContent = 'Demo — the data labs are not in this read'; return; }
    if (e.target.closest('#save')) { save(); return; }
    if ((el = e.target.closest('a[href="#"], [data-inert]'))) e.preventDefault();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePops(null); });

  /* the list's switches: client-side only; an off group's row goes quiet */
  document.addEventListener('change', function (e) {
    var sw = e.target.closest('[data-on]');
    if (sw) { var id = +sw.getAttribute('data-on'); ON[id] = sw.checked; sw.closest('.row').classList.toggle('fgp-off', !sw.checked); return; }
    if (e.target.closest('#zones')) {
      if (e.target.type === 'radio') e.target.closest('.seg').classList.remove('seg--unset');
      var f = e.target.closest('.f--miss'); if (f && e.target.value) { f.classList.remove('f--miss'); e.target.removeAttribute('aria-invalid'); }
      $('#sb-res').textContent = '';
      count();
    }
  });
  document.addEventListener('input', function (e) {
    if (!e.target.closest('#zones')) return;
    var f = e.target.closest('.f--miss'); if (f && e.target.value) { f.classList.remove('f--miss'); e.target.removeAttribute('aria-invalid'); }
    $('#sb-res').textContent = '';
    count();
  });

  renderNav(); renderList(); renderEditor(); route();
})();
