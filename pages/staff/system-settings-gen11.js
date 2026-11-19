/* AAN · Staff UI · System Settings — GENERATION 11
   Built from the system only: Dealer Edit's edit-form skeleton (rail, zones, save bar, scroll spy, `/`
   to the rail, Ctrl+S), Feeds Incoming's staff bar, the shared components. The backend's six sections,
   fields, actions and states; nothing writes — every commit says "Demo — nothing is saved". */
(function () {
  'use strict';
  var MD = window.MD, D = window.SS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ic(id) { return '<svg class="i" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  var ME = 'Ivaylo Guenkov';   /* the identity in the platform bar — the "you" chip follows it */

  /* ══ NAV — the staff menus, as on every staff page; this page lives under System Tools ══ */
  var NAV_HIDDEN = ['Add New OEM', 'View OEM Accounts', 'Add New Reseller Group', 'View Reseller Groups'];
  function renderNav() {
    $('#nav').innerHTML = MD.nav.map(function (g, i) {
      if (g.g === 'AAN Projects') return '';
      var id = 'p-nav-' + i, on = g.g === 'System Tools';
      return '<div class="nav__it' + (on ? ' nav__it--on' : '') + '">' +
        '<button class="nav__b" type="button" data-pop="' + id + '" aria-haspopup="true" aria-expanded="false">' + esc(g.g) + ic('i-chev') + '</button>' +
        '<div class="pop" id="' + id + '"><div class="caps pop__lab">' + esc(g.g) + '</div>' +
          g.i.filter(function (l) { return NAV_HIDDEN.indexOf(l) < 0; }).map(function (l) {
            var href = l === 'Feeds Incoming' ? 'feeds-incoming-gen11.html' : l === 'View Dealers' ? 'manage-dealers-gen11.html' : l === 'My Work' ? 'my-work-queue-gen11.html' : '#';
            return '<a class="mn__it' + (l.indexOf('--') === 0 ? ' mn__it--sub' : '') + '" href="' + href + '">' + esc(l) + '</a>';
          }).join('') + '</div></div>';
    }).join('');
  }

  /* ══ WORKING STATE — a copy of the read; edits change it, Discard restores it ══ */
  var S;
  function fresh() {
    return {
      viewers: D.devbar.viewers.map(function (v) { return v.slice(); }),
      listed: D.crew.listed.slice(),
      unlisted: D.crew.unlisted.slice()
    };
  }
  var dirty = {};   /* one entry per thing changed, so a change undone by hand stops counting */
  function setDirty(k, on) { if (on) dirty[k] = 1; else delete dirty[k]; paintSave(); }

  /* ══ 01 · DEVELOPER TOOLS ══ */
  function pchip(name, id, opts) {
    opts = opts || {};
    var note = name === ME ? 'you' : (opts.note || '');
    return '<span class="pchip' + (opts.cls ? ' ' + opts.cls : '') + '">' +
      '<span class="pchip__n">' + esc(name) + '</span>' +
      (id != null ? '<span class="pchip__id">#' + id + '</span>' : '') +
      (note ? '<span class="pchip__note">' + esc(note) + '</span>' : '') +
      (opts.btn || '') + '</span>';
  }
  function renderDev() {
    $('#dev-key').textContent = D.devbar.key;
    $('#dev-n').textContent = S.viewers.length + ' of ' + D.devbar.active + ' active staff';
    $('#rn-dev').textContent = S.viewers.length;
    $('#dev-chips').innerHTML = S.viewers.map(function (v, i) {
      return pchip(v[0], v[1], { note: v[2], btn: '<button class="pchip__x" type="button" data-unview="' + i + '" aria-label="Remove ' + esc(v[0]) + ' from DevBar viewers" title="Remove">' + ic('i-x') + '</button>' });
    }).join('');
    renderPick();
  }
  function renderPick() {
    var q = $('#dev-q').value.trim().toLowerCase();
    var have = S.viewers.map(function (v) { return v[1]; });
    function list(arr) {
      return arr.filter(function (p) { return have.indexOf(p[1]) < 0 && (!q || p[0].toLowerCase().indexOf(q) >= 0 || String(p[1]).indexOf(q.replace('#', '')) === 0); })
        .map(function (p) {
          return '<button class="mn__it ss-pick__it" type="button" role="option" data-view="' + p[1] + '" data-name="' + esc(p[0]) + '">' +
            '<span>' + esc(p[0]) + '</span><span class="pchip__id">#' + p[1] + '</span></button>';
        }).join('');
    }
    var a = list(D.devbar.pickActive), f = list(D.devbar.pickFormer);
    $('#p-dev').innerHTML =
      '<div class="caps mn__lab">Active staff</div>' + (a || '<p class="pop__empty">No active staff match</p>') +
      '<div class="mn__sep"></div><div class="caps mn__lab">Former staff — disabled login</div>' + (f || '<p class="pop__empty">No former staff match</p>') +
      (D.devbar.formerMore ? '<p class="ss-pick__more">… more former staff — not captured in this read</p>' : '');
  }

  /* ══ 02 · AI ASSISTANT ══ */
  var A = D.ai;
  function opt(v, l, cur) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>'; }
  function renderAi() {
    $('#ai-live').checked = A.live;
    $('#ai-model').value = A.model;
    $('#tune-model').textContent = A.model;
    $('#ai-ep').innerHTML = A.endpoints.map(function (e) { return opt(e[0], e[1] + (e[0] === A.endpoint ? ' — current' : ''), A.endpoint); }).join('');
    $('#ai-effort').innerHTML = A.efforts.map(function (e) { return opt(e, e, A.effort); }).join('');
    $('#ai-verb').innerHTML = A.verbosities.map(function (e) { return opt(e, e, A.verbosity); }).join('');
    $('#ai-words').innerHTML = 'fewer · <b>' + A.words.join('</b> / <b>') + '</b> words · more';
    $('#ai-prompt').value = A.prompt;
    $('#ai-vars-intro').textContent = A.varsIntro;
    $('#ai-vars-g').innerHTML = A.vars.map(function (g) {
      return '<div class="tokg"><div class="caps mn__lab tokg__k">' + esc(g[0]) + '</div><div class="tokg__g">' +
        g[1].map(function (t) {
          var desc = [t[1], t[2]].filter(Boolean).join(' ');
          return '<button class="tok" type="button" data-tok="' + esc(t[0]) + '" title="Insert ' + esc(t[0]) + ' at the cursor">' +
            '<span class="tok__k">' + esc(t[0]) + '</span>' +
            (t[1] ? '<span class="tok__l">' + esc(t[1]) + '</span>' : '') +
            (t[2] ? '<span class="tok__h">' + esc(t[2]) + '</span>' : '') +
            '<span class="vh">' + esc(desc) + '</span></button>';
        }).join('') +
        (g[2] ? '<span class="tok tok--more" title="More tokens in this group were not captured in this read">… more</span>' : '') +
        '</div></div>';
    }).join('');
    paintModel(); paintEp();
    $('#ai-changed').innerHTML = audit(A.changed.who, A.changed.when, A.changed.key);
  }
  function paintModel() {
    var v = $('#ai-model').value.trim(), m = A.models.filter(function (x) { return x[0] === v; })[0];
    $('#ai-model-h').textContent = m ? m[1].replace(/^current — /, '') : 'Not in the suggestions — sent as typed';
    $('#tune-model').textContent = v || '—';
    $('#p-model').innerHTML = '<div class="caps mn__lab">Suggestions</div>' + A.models.map(function (x) {
      var on = x[0] === v;
      return '<button class="mn__it ss-pick__it' + (on ? ' mn__it--on' : '') + '" type="button" role="option" aria-selected="' + on + '" data-model="' + esc(x[0]) + '">' +
        '<span class="ss-mono">' + esc(x[0]) + '</span><span class="ss-pick__d">' + esc(x[1]) + '</span></button>';
    }).join('');
  }
  function paintEp() {
    var cur = $('#ai-ep').value, e0 = A.endpoints.filter(function (e) { return e[0] === cur; })[0];
    $('#ai-ep-d').textContent = e0 ? e0[2].replace(/^current; /, '') : '';
    $('#ai-ep-path').innerHTML = A.endpoints.map(function (e) { return '<span' + (e[0] === cur ? ' class="ss-on"' : '') + '>' + esc(e[3]) + '</span>'; }).join(' · ');
  }
  function audit(who, when, key) {
    return '<span class="ss-audit__k">Last changed by</span> ' + (who ? esc(who) : '<span class="none">actor not recorded</span>') +
      ' · ' + esc(when) + (key ? ' · <span class="ss-key">' + esc(key) + '</span>' : '');
  }

  /* ══ 03 · PARITY ══ */
  function renderParity() {
    var P = D.parity;
    $('#par-tag').textContent = P.tag;
    $('#par-note').textContent = P.note;
    $('#par-on').checked = P.on;
    $('#par-l').textContent = P.label;
    $('#par-changed').innerHTML = audit(P.changed.who, P.changed.when);
  }

  /* ══ 04 · SWITCH PANORAMA — a seam's state is a status chip; a secret's presence is a flag ══ */
  var STATE = { live: ['ok', 'Live'], stub: ['quiet', 'Stub'], log: ['quiet', 'Log'], on: ['ok', 'On'] };
  function key(k) { return '<span class="ss-key">' + esc(k) + '</span>'; }
  function renderPano() {
    var P = D.panorama;
    $('#pano-note').textContent = P.note;
    $('#pano-seams').innerHTML = P.seams.map(function (s) {
      var st = STATE[s[1]];
      var cell = st ? '<span class="stat stat--' + st[0] + '">' + st[1] + '</span>' + (s[2] ? '<span class="ss-det">' + esc(s[2]) + '</span>' : '')
        : '<span class="ss-val">' + esc(s[2]) + '</span>';
      return '<tr><td class="ss-name">' + esc(s[0]) + '</td><td><span class="ss-state">' + cell + '</span></td><td>' + key(s[3]) + '</td></tr>';
    }).join('');
    $('#pano-secrets').innerHTML = P.secrets.map(function (s) {
      return '<tr><td class="ss-name">' + esc(s[0]) + '</td><td><span class="tag tag--flag">' + ic('i-lock') + 'Set</span></td><td>' + key(s[1]) + '</td></tr>';
    }).join('');
    $('#pano-owners').innerHTML = P.owners.map(function (o) {
      return '<tr><td class="ss-name">' + esc(o[0]) + '</td><td><b class="ss-fig">' + o[1] + '</b> of <b class="ss-fig">' + o[2] + '</b> on newbackend</td><td>' + key(o[3]) + '</td></tr>';
    }).join('');
    function owner(v) {
      if (v === 'newbackend') return '<span class="stat stat--new">newbackend</span>';
      if (v === 'legacy') return '<span class="stat stat--quiet">legacy</span>';
      return '<span class="none">' + esc(v) + '</span>';
    }
    $('#mod-n').textContent = P.modules.length + ' of ' + P.modulesTotal + ' modules shown — the rest were not captured in this read';
    $('#pano-mods').innerHTML = P.modules.map(function (m) {
      return '<tr><td>' + key(m[0]) + '</td><td>' + owner(m[1]) + '</td><td>' + owner(m[2]) + '</td></tr>';
    }).join('');
    $('#pano-lists').innerHTML = P.lists.map(function (l) {
      return '<tr><td class="ss-name">' + esc(l[0]) + '</td><td>' + esc(l[1]) + '</td><td>' + key(l[2]) + '</td></tr>';
    }).join('');
  }

  /* ══ 05 · CREW ROSTER ══ */
  function renderCrew() {
    var C = D.crew, more = C.total - C.listed.length - C.unlisted.length;   /* unlisted entries the read did not capture */
    $('#crew-key').textContent = C.key;
    $('#crew-t').textContent = C.title;
    $('#crew-n').textContent = S.listed.length + ' of ' + C.total + ' listed';
    $('#rn-crew').textContent = S.listed.length;
    $('#crew-listed').innerHTML = S.listed.map(function (n, i) {
      return pchip(n, null, { btn: '<button class="pchip__x" type="button" data-unlist="' + i + '" aria-label="Unlist ' + esc(n) + '" title="Unlist">' + ic('i-x') + '</button>' });
    }).join('');
    $('#crew-fixed').innerHTML = C.fixed.map(function (n) { return '<span class="pchip pchip--fixed"><span class="pchip__n">' + esc(n) + '</span></span>'; }).join('');
    $('#crew-unlisted').innerHTML = S.unlisted.map(function (n, i) {
      return pchip(n, null, { cls: 'pchip--off', btn: '<button class="pchip__x pchip__x--add" type="button" data-list="' + i + '" aria-label="List ' + esc(n) + '" title="List">' + ic('i-plus') + '</button>' });
    }).join('') + (more > 0 ? '<span class="ss-more">' + more + ' more — not captured in this read</span>' : '');
    $('#crew-changed').innerHTML = audit(C.changed.who, C.changed.when);
  }

  /* ══ 06 · STORE LEDGER ══ */
  function renderLedger() {
    $('#led-store').textContent = D.ledger.store;
    $('#led-rows').innerHTML = D.ledger.rows.map(function (r) {
      var v = r[3] === 'none' ? '<span class="none">' + esc(r[2]) + '</span>'
        : r[3] === 'secret' ? '<span class="ss-secret">' + ic('i-lock') + esc(r[2]) + '</span>'
        : '<span class="ss-clip" title="' + esc(r[2]) + '">' + esc(r[2]) + '</span>';
      return '<tr><td>' + key(r[0]) + '</td><td>' + esc(r[1]) + '</td><td class="ss-v">' + v + '</td><td class="ss-when">' + esc(r[4]) + '</td></tr>';
    }).join('');
  }

  /* ══ SAVE BAR + RESULTS ══ */
  function paintSave() {
    var n = Object.keys(dirty).length;
    $('#sb-note').innerHTML = n ? ic('i-alert') + ' <b>' + n + '</b> unsaved change' + (n === 1 ? '' : 's') : 'No unsaved changes';
    $('#sb-note').classList.toggle('savebar__dirty', n > 0);   /* Dealer Edit's unsaved-changes note, in the signal tone */
    $('#discard').disabled = !n; $('#save').disabled = !n;
    if (n) $('#res-save').textContent = '';
  }
  var timers = {};
  function say(id, text) {
    var el = document.getElementById(id);
    el.textContent = text;
    clearTimeout(timers[id]);
    timers[id] = setTimeout(function () { el.textContent = ''; }, 3200);
  }
  function commit() {
    if (!Object.keys(dirty).length) return;
    say('res-save', 'Demo — nothing is saved');
  }
  function discard() {
    S = fresh(); dirty = {};
    $('#dev-q').value = '';
    renderDev(); renderAi(); renderParity(); renderCrew(); paintSave();
  }

  /* ══ EVENTS ══ */
  var BASE = {};
  function snapshot() {
    $$('[data-k]').forEach(function (el) { BASE[el.getAttribute('data-k')] = el.type === 'checkbox' ? el.checked : el.value; });
  }
  document.addEventListener('input', onEdit); document.addEventListener('change', onEdit);
  function onEdit(e) {
    var el = e.target;
    if (el.id === 'dev-q') { renderPick(); openPick('p-dev', true); return; }
    if (el.id === 'ai-model') { paintModel(); }
    if (el.id === 'ai-ep') { paintEp(); }
    if (!el.hasAttribute || !el.hasAttribute('data-k')) return;
    var k = el.getAttribute('data-k'), v = el.type === 'checkbox' ? el.checked : el.value;
    setDirty(k, v !== BASE[k]);
  }

  function openPick(id, open) {
    var p = document.getElementById(id), inp = id === 'p-dev' ? $('#dev-q') : $('#ai-model');
    if (open) closePops(p);
    p.classList.toggle('pop--open', open);
    inp.setAttribute('aria-expanded', String(open));
  }
  $('#dev-q').addEventListener('focus', function () { renderPick(); openPick('p-dev', true); });
  $('#ai-model').addEventListener('focus', function () { paintModel(); openPick('p-model', true); });
  /* a click on a field that already has focus opens its picker again (after Escape or a choice) */
  $('#dev-q').addEventListener('click', function () { renderPick(); openPick('p-dev', true); });
  $('#ai-model').addEventListener('click', function () { paintModel(); openPick('p-model', true); });

  function insertToken(t) {
    var ta = $('#ai-prompt'), s = ta.selectionStart, e = ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + t + ta.value.slice(e);
    ta.focus(); ta.selectionStart = ta.selectionEnd = s + t.length;
    setDirty('ai-prompt', ta.value !== BASE['ai-prompt']);
  }

  function closePops(except) {
    $$('.pop--open').forEach(function (p) {
      if (p === except) return;
      p.classList.remove('pop--open');
      var t = $('[data-pop="' + p.id + '"]'); if (t) t.setAttribute('aria-expanded', 'false');
      var c = $('[aria-controls="' + p.id + '"]'); if (c) c.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-pop]'), el;
    if (t) {
      var p = document.getElementById(t.getAttribute('data-pop')), open = !p.classList.contains('pop--open');
      closePops(open ? p : null); p.classList.toggle('pop--open', open); t.setAttribute('aria-expanded', String(open)); return;
    }
    if ((el = e.target.closest('[data-unview]'))) {
      var gone = S.viewers.splice(+el.getAttribute('data-unview'), 1)[0];
      setDirty('v' + gone[1], !dirty['v' + gone[1]]); renderDev(); return;
    }
    if ((el = e.target.closest('[data-view]'))) {
      var id = +el.getAttribute('data-view');
      S.viewers.push([el.getAttribute('data-name'), id, D.devbar.pickFormer.some(function (p) { return p[1] === id; }) ? 'disabled login' : '']);
      setDirty('v' + id, !dirty['v' + id]);
      $('#dev-q').value = ''; renderDev(); closePops(null); $('#dev-q').focus(); return;
    }
    if ((el = e.target.closest('[data-model]'))) {
      $('#ai-model').value = el.getAttribute('data-model'); paintModel(); closePops(null);
      setDirty('ai-model', $('#ai-model').value !== BASE['ai-model']); return;
    }
    if ((el = e.target.closest('[data-unlist]'))) {
      var n = S.listed.splice(+el.getAttribute('data-unlist'), 1)[0];
      S.unlisted.unshift(n); setDirty('c' + n, !dirty['c' + n]); renderCrew(); return;
    }
    if ((el = e.target.closest('[data-list]'))) {
      var m = S.unlisted.splice(+el.getAttribute('data-list'), 1)[0];
      S.listed.push(m); S.listed.sort(); setDirty('c' + m, !dirty['c' + m]); renderCrew(); return;
    }
    if ((el = e.target.closest('[data-tok]'))) { insertToken(el.getAttribute('data-tok')); return; }
    if ((el = e.target.closest('[data-demo]'))) { say('res-' + el.getAttribute('data-demo'), el.getAttribute('data-say')); return; }
    if (e.target.closest('[data-act="restore"]')) { say('res-ai', 'Demo — the default prompt is not loaded'); return; }
    if (e.target.closest('a[href="#"]')) e.preventDefault();
    if (!e.target.closest('.pop') && !e.target.closest('.ss-add')) closePops(null);
  });

  $('#save').addEventListener('click', commit);
  $('#discard').addEventListener('click', discard);

  /* ══ KEYS — Dealer Edit's: Escape, Ctrl/Cmd+S, `/` to the rail, arrows walk the rail ══ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePops(null); return; }
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) { e.preventDefault(); commit(); return; }
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      var first = $('.rail__b'); if (first) { e.preventDefault(); first.focus(); }
    }
  });
  $('#rail').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    var items = $$('.rail__b'), at = items.indexOf(document.activeElement);
    if (at < 0) return;
    e.preventDefault();
    items[(at + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus();
  });

  /* ══ RAIL JUMP + SCROLL SPY — CSS publishes the stack, this reads it ══ */
  var CSSV = getComputedStyle(document.documentElement);
  function cssPx(n, f) { var v = parseFloat(CSSV.getPropertyValue(n)); return isNaN(v) ? f : v; }
  function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function stackH() { return cssPx('--stick-bar', 56) + cssPx('--stick-head', 0); }
  var ZONES = $$('.zone').map(function (z) { return z.id; });
  function mark(id) {
    $$('.rail__b').forEach(function (b) {
      var on = b.getAttribute('data-zone') === id;
      b.classList.toggle('rail__b--on', on); b.classList.toggle('ui-nav__i--on', on);
      if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
  }
  var pinned = null;
  $('#rail').addEventListener('click', function (e) {
    var b = e.target.closest('[data-zone]'); if (!b) return;
    var el = document.getElementById(b.getAttribute('data-zone')); if (!el) return;
    var y = el.getBoundingClientRect().top + window.scrollY - stackH() - 8;
    pinned = b.getAttribute('data-zone');
    window.scrollTo({ top: Math.max(0, y), behavior: reduced() ? 'auto' : 'smooth' });
    mark(pinned);
  });
  var stuck = null;
  function spy() {
    var s = window.scrollY > 4;
    if (s !== stuck) { stuck = s; $('#app').classList.toggle('is-stuck', s); }
    if (pinned) { mark(pinned); return; }   /* a rail jump holds its zone until the reader scrolls on their own */
    /* a zone is current once its heading is within 120px under the bar */
    var limit = stackH() + 120, cur = ZONES[0];
    ZONES.forEach(function (id) { var el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= limit) cur = id; });
    var end = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (end) cur = ZONES[ZONES.length - 1];
    mark(cur);
  }
  window.addEventListener('scroll', spy, { passive: true });
  function unpin() { if (pinned) { pinned = null; spy(); } }
  window.addEventListener('wheel', unpin, { passive: true });
  window.addEventListener('touchmove', unpin, { passive: true });
  document.addEventListener('keydown', function (e) { if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| )$/.test(e.key) && !e.target.closest('#rail')) unpin(); });
  window.addEventListener('resize', spy);

  /* ══ BOOT ══ */
  S = fresh();
  renderNav(); renderDev(); renderAi(); renderParity(); renderPano(); renderCrew(); renderLedger();
  snapshot(); paintSave(); spy();
})();

/* the page reserves exactly the height of its save footer (Dealer Edit's measure) */
(function () {
  function sizeSaveBar() {
    var bar = document.querySelector('.savebar'); if (!bar) return;
    document.documentElement.style.setProperty('--savebar-h', Math.ceil(bar.getBoundingClientRect().height) + 'px');
  }
  sizeSaveBar();
  window.addEventListener('resize', sizeSaveBar);
  if (window.ResizeObserver) { var bar = document.querySelector('.savebar'); if (bar) new ResizeObserver(sizeSaveBar).observe(bar); }
})();
