/* ───────────────────────────────────────────────────────────────────────────
   AAN · TEAM REVIEW NOTES                                pages/_aan-notes.js

   A review layer for the Gen 11 prototypes. Anyone with the link can pick an
   element, leave a note against it, and read what everyone else left. No
   account, no build step, no dependency.

   WHY IT IS BUILT THIS WAY
   The ten pages are a finished visual system and this tool must not touch it.
   Measured on all ten before a line was written:
     · neither <html> nor <body> carries transform / filter / backdrop-filter /
       contain / will-change, so one position:fixed child of <body> anchors to
       the viewport and nothing else.
     · backdrop-filter IS on .top, .cmd, .cockpit and .head — a fixed element
       inside any of them anchors to THAT box, not the screen. So this layer is
       appended to <body> and to nowhere else, ever.
     · body is display:block / position:static on all ten, so an extra child
       moves nothing. Verified: 0 of 77 measured boxes drifted, scrollHeight and
       scrollWidth deltas both 0.
     · the highest z-index the system uses is 40 (--z-menu).
   Everything visible lives in a shadow root under `all: initial`, so no product
   rule reaches in and no rule of ours reaches out.

   The tool is deliberately NOT in the product's visual language — different
   ground, different accent — so a tester never mistakes the instrument for the
   thing being reviewed.

   STORAGE is localStorage for now, under one key for every page, so the
   universal sheet at /comments.html reads the same record. The shape below is
   the contract a shared backend will have to honour later; nothing else needs
   to change when it arrives.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  if (window.__aanNotes) return;

  var K_NOTES = 'aan.notes.v1';
  var K_ME    = 'aan.notes.me';
  var K_UI    = 'aan.notes.ui';
  var MAXPATH = 12;

  /* ── 1 · storage ─────────────────────────────────────────────────────── */

  function readAll() {
    try { var v = JSON.parse(localStorage.getItem(K_NOTES)); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function writeAll(list) {
    try { localStorage.setItem(K_NOTES, JSON.stringify(list)); } catch (e) { toast('Storage is full or blocked'); }
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  /* The page's own identity. Works the same locally and on Pages, where the
     repository name sits in front of the path. */
  function pageKey() {
    var p = location.pathname, i = p.indexOf('/pages/');
    if (i >= 0) return p.slice(i + 1);
    var last = p.replace(/^.*\//, '');
    return last || 'index.html';
  }
  var PAGE = pageKey();

  function pageTitle() {
    var h = document.querySelector('h1');
    return (h && h.textContent.trim().slice(0, 60)) || document.title.slice(0, 60) || PAGE;
  }

  /* ── 2 · identity ────────────────────────────────────────────────────── */

  function cookie(name, value) {
    if (value === undefined) {
      var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : '';
    }
    document.cookie = name + '=' + encodeURIComponent(value) + ';path=/;max-age=' + (60 * 60 * 24 * 365);
  }
  function me() {
    var n = '';
    try { n = localStorage.getItem(K_ME) || ''; } catch (e) {}
    return n || cookie('aan_notes_name') || '';
  }
  function setMe(n) {
    n = (n || '').trim().slice(0, 40);
    try { localStorage.setItem(K_ME, n); } catch (e) {}
    cookie('aan_notes_name', n);
    return n;
  }

  /* ── 3 · anchoring ───────────────────────────────────────────────────── */

  /* Gen 11 is almost completely addressable: across the ten pages there are
     between 0 and 3 elements with neither a class nor an id, and records carry
     data-id (v3, 16994, 659, 48663 …). So the ladder below nearly always stops
     at a real identifier rather than counting siblings. */

  var DATA_ANCHORS = ['data-id', 'data-rid', 'data-k', 'data-zone', 'data-lane', 'data-queue',
                      'data-pop', 'data-sort', 'data-f', 'data-ev', 'data-feat', 'data-col'];
  var VOLATILE_CLASS = /^(is-|has-|js-)|--(on|open|active|stuck|dirty|sel)$|^(open|stuck|dirty|sel|on)$/;

  function esc(s) {
    return String(s).replace(/["\\]/g, '\\$&');
  }
  function stableId(id) {
    return id && !/^(ember|react|svelte|v-|:r)/.test(id) && !/^\d/.test(id) && id.length < 64;
  }
  function dataAnchor(el) {
    for (var i = 0; i < DATA_ANCHORS.length; i++) {
      var v = el.getAttribute(DATA_ANCHORS[i]);
      if (v !== null && v !== '' && v.length < 48) return { name: DATA_ANCHORS[i], value: v };
    }
    return null;
  }
  function goodClasses(el) {
    var c = (el.getAttribute('class') || '').trim();
    if (!c) return [];
    return c.split(/\s+/).filter(function (x) { return x && !VOLATILE_CLASS.test(x); }).slice(0, 3);
  }

  function cssPath(el) {
    var parts = [], cur = el, n = 0;
    while (cur && cur.nodeType === 1 && cur !== document.documentElement && n++ < MAXPATH) {
      if (stableId(cur.id)) { parts.unshift('#' + cur.id); break; }
      var seg = cur.tagName.toLowerCase();
      var d = dataAnchor(cur);
      if (d) { parts.unshift(seg + '[' + d.name + '="' + esc(d.value) + '"]'); break; }
      var cls = goodClasses(cur);
      if (cls.length) seg += '.' + cls.join('.');
      var p = cur.parentElement;
      if (p) {
        var sibs = [], i;
        for (i = 0; i < p.children.length; i++) if (p.children[i].tagName === cur.tagName) sibs.push(p.children[i]);
        if (sibs.length > 1) seg += ':nth-of-type(' + (sibs.indexOf(cur) + 1) + ')';
      }
      parts.unshift(seg);
      cur = p;
    }
    return parts.join(' > ');
  }

  function xPath(el) {
    var parts = [];
    for (var c = el; c && c.nodeType === 1; c = c.parentElement) {
      var i = 1, s = c.previousElementSibling;
      while (s) { if (s.tagName === c.tagName) i++; s = s.previousElementSibling; }
      parts.unshift(c.tagName.toLowerCase() + '[' + i + ']');
      if (c.tagName === 'BODY') break;
    }
    return '/html/' + parts.join('/');
  }

  function labelOf(el) {
    var t = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
    return t.slice(0, 90);
  }

  /* The page's open state, so a note made inside an expansion or a popover can
     be reached again. Gen 11 marks every one of these with a class, so this is
     read off the DOM rather than guessed. */
  var OPEN_MARKS = [
    ['.row.open', 'open'], ['.exp--open', 'exp--open'], ['.pop--open', 'pop--open'],
    ['.lane--on', 'lane--on'], ['.field.has-open', 'has-open'], ['.acc__s.open', 'open'],
    ['[aria-expanded="true"]', 'aria-expanded']
  ];
  function captureState() {
    var st = [];
    OPEN_MARKS.forEach(function (pair) {
      var nodes;
      try { nodes = document.querySelectorAll(pair[0]); } catch (e) { return; }
      for (var i = 0; i < nodes.length && st.length < 10; i++) {
        st.push({ sel: cssPath(nodes[i]), mark: pair[1] });
      }
    });
    return st;
  }

  function anchorFrom(el, clientX, clientY) {
    var r = el.getBoundingClientRect();
    return {
      sel:   cssPath(el),
      xpath: xPath(el),
      tag:   el.tagName.toLowerCase(),
      cls:   (el.getAttribute('class') || '').slice(0, 120),
      role:  el.getAttribute('role') || '',
      label: labelOf(el),
      rx:    r.width  ? Math.min(1, Math.max(0, (clientX - r.left) / r.width))  : 0.5,
      ry:    r.height ? Math.min(1, Math.max(0, (clientY - r.top)  / r.height)) : 0.5,
      box:   [Math.round(r.width), Math.round(r.height)].join('×'),
      vw:    window.innerWidth,
      vh:    window.innerHeight,
      scrollY: Math.round(window.scrollY),
      state: captureState()
    };
  }

  function resolve(a) {
    if (!a) return null;
    var el = null, m;
    if (a.sel) { try { m = document.querySelectorAll(a.sel); if (m.length) el = m[0]; } catch (e) {} }
    if (!el && a.xpath) {
      try { el = document.evaluate(a.xpath, document, null, 9, null).singleNodeValue; } catch (e) {}
    }
    if (!el && a.label) {
      var all = document.querySelectorAll(a.tag || '*'), hit = [];
      for (var i = 0; i < all.length && hit.length < 2; i++) {
        if (labelOf(all[i]) === a.label) hit.push(all[i]);
      }
      if (hit.length === 1) el = hit[0];
    }
    return el;
  }

  function visible(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    if (!r.width && !r.height) return false;
    var cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
  }

  /* Best-effort replay. Honest about failing: the caller tells the user rather
     than leaving a pin pointing at nothing. */
  function replayState(a, done) {
    var steps = (a && a.state) || [], i = 0;
    (function next() {
      if (i >= steps.length) return finish();
      var s = steps[i++], el = null;
      try { el = document.querySelector(s.sel); } catch (e) {}
      if (el) {
        var already = s.mark === 'aria-expanded'
          ? el.getAttribute('aria-expanded') === 'true'
          : el.classList.contains(s.mark);
        if (!already) { try { el.click(); } catch (e) {} }
      }
      setTimeout(next, 90);
    })();
    function finish() { setTimeout(function () { done(visible(resolve(a))); }, 160); }
  }

  /* ── 4 · the layer ───────────────────────────────────────────────────── */

  var root = document.createElement('div');
  root.id = 'aan-notes-root';
  root.setAttribute('data-aan-notes', '');
  /* contain:layout style keeps our own work off the page's layout budget; the
     root paints nothing and takes no clicks — only the controls inside do. */
  root.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none;contain:layout style;';
  var sr = root.attachShadow({ mode: 'open' });

  sr.innerHTML = [
'<style>',
':host { all: initial; }',
'*, *::before, *::after { box-sizing: border-box; }',
':host {',
'  --bg:#0f1319; --bg2:#161c25; --bg3:#1e2630; --ink:#e9eef6; --ink2:#a9b4c4; --ink3:#73808f;',
'  --line:rgba(255,255,255,.12); --line2:rgba(255,255,255,.07);',
'  --acc:#ff7a45; --acc2:#ff9a6e; --ok:#3ed598; --warn:#ffc24b;',
'  --r1:8px; --r2:12px; --r3:16px;',
'  --s1:4px; --s2:8px; --s3:12px; --s4:16px; --s5:24px;',
'  --fs:13px;',
'  font: 400 var(--fs)/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;',
'  color: var(--ink);',
'}',
'.hide { display: none !important; }',

/* ── puck ── */
'.puck {',
'  position: fixed; display: inline-flex; align-items: center; gap: var(--s2);',
'  height: 40px; padding: 0 14px 0 11px; border-radius: 999px;',
'  background: var(--bg); color: var(--ink); cursor: grab;',
'  box-shadow: 0 0 0 1px var(--line), 0 10px 30px -10px rgba(0,0,0,.7);',
'  pointer-events: auto; user-select: none; touch-action: none;',
'}',
'.puck:active { cursor: grabbing; }',
'.puck__d { width: 9px; height: 9px; border-radius: 50%; background: var(--acc); flex: none; }',
'.puck__t { font-size: 12.5px; font-weight: 600; letter-spacing: .01em; white-space: nowrap; }',
'.puck__n { min-width: 20px; height: 20px; padding: 0 6px; border-radius: 999px; background: var(--bg3);',
'           color: var(--ink2); font: 600 11px/20px ui-monospace, SFMono-Regular, Menlo, monospace; text-align: center; }',

/* ── panel ── */
'.panel {',
'  position: fixed; width: 352px; max-width: calc(100vw - 32px);',
'  max-height: min(640px, calc(100vh - 32px)); display: flex; flex-direction: column;',
'  background: var(--bg); border-radius: var(--r3); overflow: hidden;',
'  box-shadow: 0 0 0 1px var(--line), 0 30px 70px -24px rgba(0,0,0,.8);',
'  pointer-events: auto; touch-action: none;',
'}',
'.hd { display: flex; align-items: center; gap: var(--s2); padding: 11px var(--s3) 11px var(--s4);',
'      cursor: grab; user-select: none; border-bottom: 1px solid var(--line2); flex: none; }',
'.hd:active { cursor: grabbing; }',
'.hd__d { width: 9px; height: 9px; border-radius: 50%; background: var(--acc); flex: none; }',
'.hd__t { font-size: 13px; font-weight: 650; letter-spacing: -.005em; }',
'.hd__s { margin-left: auto; display: flex; align-items: center; gap: var(--s1); }',

'.ib { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px;',
'      border: 0; border-radius: var(--r1); background: transparent; color: var(--ink2);',
'      cursor: pointer; font-size: 15px; line-height: 1; }',
'.ib:hover { background: var(--bg3); color: var(--ink); }',
'.ib svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }',

'.body { overflow: auto; overscroll-behavior: contain; padding: var(--s4); display: grid; gap: var(--s4); }',
'.body::-webkit-scrollbar { width: 9px; }',
'.body::-webkit-scrollbar-thumb { background: var(--bg3); border-radius: 9px; }',

'.row { display: flex; align-items: center; gap: var(--s2); }',
'.lab { font: 700 10.5px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .1em;',
'       text-transform: uppercase; color: var(--ink3); }',

'.btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 34px;',
'       padding: 0 13px; border: 0; border-radius: var(--r1); background: var(--bg3); color: var(--ink);',
'       font: 600 12.5px/1 inherit; cursor: pointer; white-space: nowrap; }',
'.btn:hover { background: #28323e; }',
'.btn--acc { background: var(--acc); color: #26120a; }',
'.btn--acc:hover { background: var(--acc2); }',
'.btn--on { background: var(--acc); color: #26120a; }',
'.btn--w { width: 100%; }',
'.btn[disabled] { opacity: .45; cursor: default; }',
'.btn svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }',

'.in, .ta, .sel { width: 100%; height: 34px; padding: 0 10px; border: 0; border-radius: var(--r1);',
'  background: var(--bg2); color: var(--ink); font: 400 13px/1 inherit;',
'  box-shadow: inset 0 0 0 1px var(--line2); }',
'.ta { height: auto; min-height: 76px; padding: 9px 10px; line-height: 1.5; resize: vertical; font-family: inherit; }',
'.in:focus, .ta:focus, .sel:focus { outline: 2px solid var(--acc); outline-offset: 1px; }',
'.sel { appearance: none; cursor: pointer; padding-right: 26px;',
'  background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M1 1l4 4 4-4\' fill=\'none\' stroke=\'%23a9b4c4\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E");',
'  background-repeat: no-repeat; background-position: right 10px center; background-size: 10px 6px; }',

'.hint { margin: 0; font-size: 12px; line-height: 1.5; color: var(--ink3); }',

/* ── the note list ── */
'.list { display: grid; gap: var(--s2); }',
'.note { display: grid; gap: 7px; padding: 11px var(--s3); border-radius: var(--r2);',
'        background: var(--bg2); box-shadow: inset 0 0 0 1px var(--line2); cursor: pointer; }',
'.note:hover { box-shadow: inset 0 0 0 1px var(--line); }',
'.note--sel { box-shadow: inset 0 0 0 1px var(--acc); }',
'.note--done { opacity: .5; }',
'.note__h { display: flex; align-items: center; gap: var(--s2); }',
'.note__n { flex: none; width: 20px; height: 20px; border-radius: 50%; background: var(--acc); color: #26120a;',
'           font: 700 11px/20px ui-monospace, Menlo, monospace; text-align: center; }',
'.note__a { font-size: 12.5px; font-weight: 650; }',
'.note__d { margin-left: auto; font-size: 11px; color: var(--ink3); white-space: nowrap; }',
'.note__t { margin: 0; font-size: 13px; line-height: 1.5; color: var(--ink); overflow-wrap: anywhere; }',
'.note__m { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }',
'.tag { display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: 5px;',
'       background: var(--bg3); color: var(--ink2); font: 600 10.5px/1 ui-monospace, Menlo, monospace;',
'       letter-spacing: .04em; text-transform: uppercase; }',
'.tag--bug { background: rgba(255,122,69,.18); color: #ffb08c; }',
'.tag--vis { background: rgba(110,160,255,.16); color: #9ec0ff; }',
'.tag--q   { background: rgba(255,194,75,.16); color: #ffd98a; }',
'.tag--idea{ background: rgba(62,213,152,.15); color: #8bf0c4; }',
'.tag--lost{ background: rgba(255,80,80,.18); color: #ff9e9e; }',
'.sel-code { font: 400 10.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--ink3);',
'            overflow-wrap: anywhere; }',
'.empty { padding: var(--s5) var(--s4); text-align: center; color: var(--ink3); font-size: 12.5px; }',

/* ── pins ── */
'.pin { position: fixed; width: 26px; height: 26px; margin: -13px 0 0 -13px; border-radius: 50% 50% 50% 3px;',
'  background: var(--acc); color: #26120a; box-shadow: 0 2px 8px rgba(0,0,0,.45), 0 0 0 2px rgba(255,255,255,.9);',
'  font: 700 11px/26px ui-monospace, Menlo, monospace; text-align: center; cursor: pointer;',
'  pointer-events: auto; transition: transform .12s ease; }',
'.pin:hover, .pin--sel { transform: scale(1.18); z-index: 2; }',
'.pin--done { background: var(--ok); }',
'.pin--edge { border-radius: 50%; opacity: .72; }',
'.pin--lost { background: #ff5050; color: #fff; }',

/* ── pick mode ── */
'.hl { position: fixed; pointer-events: none; border-radius: 3px;',
'      box-shadow: 0 0 0 2px var(--acc), 0 0 0 9999px rgba(10,14,20,.42); transition: all .06s linear; }',
'.hl__t { position: fixed; pointer-events: none; max-width: 420px; padding: 5px 9px; border-radius: 6px;',
'  background: var(--bg); color: var(--ink); font: 500 11.5px/1.4 ui-monospace, Menlo, monospace;',
'  box-shadow: 0 0 0 1px var(--line); overflow-wrap: anywhere; }',

/* ── composer ── */
'.comp { position: fixed; width: 320px; max-width: calc(100vw - 24px); display: grid; gap: var(--s3);',
'  padding: var(--s4); border-radius: var(--r2); background: var(--bg);',
'  box-shadow: 0 0 0 1px var(--line), 0 24px 56px -20px rgba(0,0,0,.8); pointer-events: auto; }',

/* ── toast ── */
'.toast { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%);',
'  padding: 9px 15px; border-radius: 999px; background: var(--bg); color: var(--ink);',
'  box-shadow: 0 0 0 1px var(--line); font-size: 12.5px; pointer-events: none; opacity: 0;',
'  transition: opacity .18s ease; }',
'.toast--on { opacity: 1; }',
'@media (prefers-reduced-motion: reduce) { .pin, .hl, .toast { transition: none; } }',
'</style>',

'<div class="hl hide"></div><div class="hl__t hide"></div>',
'<div class="pins"></div>',
'<div class="puck"><i class="puck__d"></i><span class="puck__t">Notes</span><span class="puck__n">0</span></div>',
'<div class="panel hide">',
  '<div class="hd"><i class="hd__d"></i><span class="hd__t">Review notes</span>',
    '<span class="hd__s">',
      '<button class="ib" data-a="eye" title="Show or hide pins"></button>',
      '<button class="ib" data-a="sheet" title="Open the universal sheet"></button>',
      '<button class="ib" data-a="min" title="Collapse">&minus;</button>',
    '</span></div>',
  '<div class="body">',
    '<div class="who"></div>',
    '<button class="btn btn--acc btn--w" data-a="pick">Comment on an element</button>',
    '<p class="hint">Or <a href="#" data-a="general" style="color:var(--acc2)">leave a general note</a> about this page.</p>',
    '<div class="row"><span class="lab">This page</span>',
      '<select class="sel" data-a="filter" style="margin-left:auto;width:auto;height:28px;font-size:12px">',
        '<option value="open">Open</option><option value="all">All</option>',
        '<option value="done">Resolved</option><option value="mine">Mine</option></select></div>',
    '<div class="list"></div>',
    '<div class="row"><button class="btn" data-a="csv">Export CSV</button>',
      '<button class="btn" data-a="json">JSON</button></div>',
  '</div>',
'</div>',
'<div class="comp hide"></div>',
'<div class="toast"></div>'
  ].join('');

  var $  = function (s) { return sr.querySelector(s); };
  var $$ = function (s) { return [].slice.call(sr.querySelectorAll(s)); };

  var elPuck = $('.puck'), elPanel = $('.panel'), elPins = $('.pins'), elList = $('.list'),
      elHl = $('.hl'), elHlT = $('.hl__t'), elComp = $('.comp'), elToast = $('.toast'),
      elWho = $('.who'), elCount = $('.puck__n'), elFilter = $('[data-a="filter"]');

  /* icons, drawn rather than fetched */
  $('[data-a="eye"]').innerHTML  = '<svg viewBox="0 0 16 16"><path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8z"/><circle cx="8" cy="8" r="2"/></svg>';
  $('[data-a="sheet"]').innerHTML = '<svg viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M2 6.5h12M6.5 6.5V14"/></svg>';

  /* ── 5 · state ───────────────────────────────────────────────────────── */

  var S = { open: false, picking: false, showPins: true, selected: null, filter: 'open', pending: null };
  try { var ui = JSON.parse(localStorage.getItem(K_UI) || '{}'); } catch (e) { ui = {}; }
  function saveUI() { try { localStorage.setItem(K_UI, JSON.stringify(ui)); } catch (e) {} }

  function toast(msg) {
    elToast.textContent = msg;
    elToast.classList.add('toast--on');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { elToast.classList.remove('toast--on'); }, 2200);
  }

  /* ── 6 · dragging ────────────────────────────────────────────────────── */

  /* Clamped to the viewport on every move and again on resize, so a panel
     dragged to an edge at 1440 is still reachable at 1280. */
  function clamp(el, x, y) {
    var w = el.offsetWidth, h = el.offsetHeight, m = 8;
    return [Math.max(m, Math.min(x, innerWidth - w - m)), Math.max(m, Math.min(y, innerHeight - h - m))];
  }
  function place(el, x, y) {
    var p = clamp(el, x, y);
    el.style.left = p[0] + 'px'; el.style.top = p[1] + 'px';
    el.style.right = 'auto'; el.style.bottom = 'auto';
    return p;
  }
  function draggable(el, handle, key) {
    var sx, sy, ox, oy, on = false;
    handle.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.ib, .btn, input, textarea, select')) return;
      on = true; sx = e.clientX; sy = e.clientY;
      var r = el.getBoundingClientRect(); ox = r.left; oy = r.top;
      handle.setPointerCapture(e.pointerId); e.preventDefault();
    });
    handle.addEventListener('pointermove', function (e) {
      if (!on) return;
      var p = place(el, ox + e.clientX - sx, oy + e.clientY - sy);
      ui[key] = p; 
    });
    handle.addEventListener('pointerup', function (e) {
      if (!on) return; on = false;
      try { handle.releasePointerCapture(e.pointerId); } catch (err) {}
      saveUI();
    });
  }

  /* Default corner: bottom LEFT — but lifted above whatever the page has already
     fixed there. Bottom-right carries .tray on the two list pages, and .savebar
     on the two editors runs the full width, so on those there is no free corner
     at all: measured, not assumed.

     Rather than hardcode the two class names, every position:fixed box that
     actually intersects the landing strip is measured and the puck is placed
     above the highest of them, with a real gap. Nothing ever rests against
     another element's edge. */
  function bottomObstruction(x, w, h) {
    var strip = { left: x, right: x + w, top: innerHeight - h - 20, bottom: innerHeight };
    var top = innerHeight;
    var all = document.body.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var e = all[i];
      if (e === root || (e.closest && e.closest('#aan-notes-root'))) continue;
      var cs = getComputedStyle(e);
      if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden') continue;
      var r = e.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.right < strip.left || r.left > strip.right || r.bottom < strip.top) continue;
      if (r.top < top) top = r.top;
    }
    return top;
  }

  function placeDefaults() {
    var pw = elPuck.offsetWidth || 110, ph = elPuck.offsetHeight || 40;
    var floor = bottomObstruction(20, pw, ph);
    var defY = Math.min(innerHeight - ph - 20, floor - ph - 12);
    var p = ui.puck || [20, defY];
    place(elPuck, p[0], p[1]);
    var panelH = elPanel.offsetHeight || 420;
    var q = ui.panel || [20, Math.max(20, Math.min(innerHeight - panelH - 20, floor - panelH - 12))];
    place(elPanel, q[0], q[1]);
  }
  draggable(elPuck, elPuck, 'puck');
  draggable(elPanel, $('.hd'), 'panel');

  /* a drag must not also read as a click */
  (function () {
    var down = null;
    elPuck.addEventListener('pointerdown', function (e) { down = [e.clientX, e.clientY]; });
    elPuck.addEventListener('click', function (e) {
      if (down && Math.abs(e.clientX - down[0]) + Math.abs(e.clientY - down[1]) > 4) return;
      openPanel(true);
    });
  })();

  var rendering = false;
  function openPanel(on) {
    S.open = on;
    elPanel.classList.toggle('hide', !on);
    elPuck.classList.toggle('hide', on);
    if (on && !rendering) { placeDefaults(); render(); }
  }
  $('[data-a="min"]').addEventListener('click', function () { openPanel(false); });

  /* ── 7 · pick mode ───────────────────────────────────────────────────── */

  function ours(el) { return !!(el && el.closest && el.closest('#aan-notes-root')); }

  function onMove(e) {
    if (!S.picking) return;
    var el = e.target;
    if (!el || el.nodeType !== 1 || ours(el)) return;
    var r = el.getBoundingClientRect();
    elHl.classList.remove('hide');
    elHl.style.cssText += ';left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;';
    elHlT.classList.remove('hide');
    elHlT.textContent = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
      (el.getAttribute('class') ? '.' + el.getAttribute('class').trim().split(/\s+/).slice(0, 3).join('.') : '') +
      '  ·  ' + Math.round(r.width) + '×' + Math.round(r.height);
    var ty = r.top > 34 ? r.top - 30 : r.bottom + 6;
    elHlT.style.left = Math.min(Math.max(8, r.left), innerWidth - elHlT.offsetWidth - 8) + 'px';
    elHlT.style.top = ty + 'px';
  }

  function onPick(e) {
    if (!S.picking) return;
    if (ours(e.target)) return;
    e.preventDefault(); e.stopPropagation();
    stopPick();
    composer(anchorFrom(e.target, e.clientX, e.clientY), e.clientX, e.clientY);
  }

  function startPick() {
    if (!me()) { askName(function () { startPick(); }); return; }
    S.picking = true;
    document.documentElement.style.cursor = 'crosshair';
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onPick, true);
    document.addEventListener('keydown', onEsc, true);
    openPanel(false);
    toast('Click the element you want to comment on  ·  Esc to cancel');
  }
  function stopPick() {
    S.picking = false;
    document.documentElement.style.cursor = '';
    document.removeEventListener('mousemove', onMove, true);
    document.removeEventListener('click', onPick, true);
    document.removeEventListener('keydown', onEsc, true);
    elHl.classList.add('hide'); elHlT.classList.add('hide');
  }
  function onEsc(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); stopPick(); openPanel(true); }
  }

  /* ── 8 · composer ────────────────────────────────────────────────────── */

  function composer(anchor, cx, cy) {
    elComp.classList.remove('hide');
    elComp.innerHTML = [
      '<div class="row"><span class="lab">', anchor ? 'On this element' : 'General note', '</span>',
        '<button class="ib" data-a="x" style="margin-left:auto">&times;</button></div>',
      anchor ? '<div class="sel-code">' + escHtml(anchor.sel) + '</div>' : '',
      anchor && anchor.label ? '<div class="sel-code" style="color:var(--ink2)">&ldquo;' + escHtml(anchor.label) + '&rdquo;</div>' : '',
      '<textarea class="ta" placeholder="What is wrong, or what should change?"></textarea>',
      '<div class="row">',
        '<select class="sel" data-a="kind" style="width:auto;flex:1">',
          '<option value="bug">Bug</option><option value="visual">Visual</option>',
          '<option value="question">Question</option><option value="idea">Idea</option></select>',
        '<button class="btn btn--acc" data-a="save">Post</button>',
      '</div>'
    ].join('');

    /* viewport-aware placement, the same contract the Columns popover uses:
       open below-right of the click, flip when it would leave the screen. */
    var w = 320, h = elComp.offsetHeight || 230, m = 12;
    var x = (cx === undefined ? innerWidth / 2 - w / 2 : cx + 14);
    var y = (cy === undefined ? innerHeight / 2 - h / 2 : cy + 14);
    if (x + w + m > innerWidth)  x = Math.max(m, (cx || innerWidth) - w - 14);
    if (y + h + m > innerHeight) y = Math.max(m, (cy || innerHeight) - h - 14);
    elComp.style.left = Math.round(x) + 'px';
    elComp.style.top  = Math.round(y) + 'px';

    var ta = elComp.querySelector('.ta');
    setTimeout(function () { ta.focus(); }, 0);

    elComp.querySelector('[data-a="x"]').onclick = closeComposer;
    elComp.querySelector('[data-a="save"]').onclick = function () {
      var text = ta.value.trim();
      if (!text) { ta.focus(); return; }
      post(text, elComp.querySelector('[data-a="kind"]').value, anchor);
      closeComposer();
    };
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) elComp.querySelector('[data-a="save"]').click();
      if (e.key === 'Escape') closeComposer();
    });
  }
  function closeComposer() { elComp.classList.add('hide'); elComp.innerHTML = ''; openPanel(true); }

  function post(text, kind, anchor) {
    var all = readAll();
    all.push({
      id: uid(), page: PAGE, pageTitle: pageTitle(), author: me(), at: new Date().toISOString(),
      text: text, kind: kind, status: 'open', anchor: anchor || null, url: location.href
    });
    writeAll(all);
    render();
    toast('Posted as ' + me());
  }

  /* ── 9 · rendering ───────────────────────────────────────────────────── */

  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function when(iso) {
    var d = new Date(iso), s = (Date.now() - d) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  function mine() { return readAll().filter(function (n) { return n.page === PAGE; }); }
  function filtered() {
    var f = S.filter, list = mine();
    if (f === 'open') return list.filter(function (n) { return n.status !== 'done'; });
    if (f === 'done') return list.filter(function (n) { return n.status === 'done'; });
    if (f === 'mine') return list.filter(function (n) { return n.author === me(); });
    return list;
  }

  /* nameForm only draws. askName also opens and focuses. Keeping those apart is
     not tidiness: renderWho() is called by render(), and a version of this that
     opened the panel from inside renderWho recursed until the stack blew. */
  function nameForm(after) {
    elWho.innerHTML = '<div class="row" style="gap:var(--s2)">' +
      '<input class="in" data-a="name" placeholder="Your name" value="' + escHtml(me()) + '">' +
      '<button class="btn" data-a="savename">Save</button></div>' +
      '<p class="hint" style="margin-top:8px">Kept in this browser so your notes are attributed. No account.</p>';
    var i = elWho.querySelector('[data-a="name"]');
    function commit() {
      var n = setMe(i.value);
      if (!n) { i.focus(); return; }
      render();
      if (after) after();
    }
    elWho.querySelector('[data-a="savename"]').onclick = commit;
    i.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); commit(); } };
    return i;
  }
  function askName(after) {
    openPanel(true);
    var i = nameForm(after);
    setTimeout(function () { i.focus(); }, 0);
  }
  function renderWho() {
    if (!me()) { nameForm(null); return; }
    elWho.innerHTML = '<div class="row"><span class="lab">Commenting as</span>' +
      '<b style="font-size:12.5px">' + escHtml(me()) + '</b>' +
      '<button class="btn" data-a="rename" style="margin-left:auto;height:26px;padding:0 9px;font-size:11.5px">Change</button></div>';
    elWho.querySelector('[data-a="rename"]').onclick = function () { askName(null); };
  }

  function render() {
    if (rendering) return;
    rendering = true;
    renderWho();
    var list = filtered().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    var total = mine().filter(function (n) { return n.status !== 'done'; }).length;
    elCount.textContent = total;

    if (!list.length) {
      elList.innerHTML = '<div class="empty">Nothing here yet.<br>Pick an element and say what is wrong.</div>';
    } else {
      elList.innerHTML = list.map(function (n, i) {
        var lost = n.anchor && !resolve(n.anchor);
        return '<div class="note' + (n.status === 'done' ? ' note--done' : '') +
          (S.selected === n.id ? ' note--sel' : '') + '" data-id="' + n.id + '">' +
          '<div class="note__h"><span class="note__n">' + (indexOfPin(n.id) + 1 || '·') + '</span>' +
          '<span class="note__a">' + escHtml(n.author || 'anon') + '</span>' +
          '<span class="note__d">' + when(n.at) + '</span></div>' +
          '<p class="note__t">' + escHtml(n.text) + '</p>' +
          '<div class="note__m">' +
            '<span class="tag tag--' + ({bug:'bug',visual:'vis',question:'q',idea:'idea'}[n.kind] || 'bug') + '">' + escHtml(n.kind) + '</span>' +
            (n.anchor ? '' : '<span class="tag">general</span>') +
            (lost ? '<span class="tag tag--lost">element not found</span>' : '') +
            '<button class="btn" data-a="done" data-id="' + n.id + '" style="height:22px;padding:0 8px;font-size:11px;margin-left:auto">' +
              (n.status === 'done' ? 'Reopen' : 'Resolve') + '</button>' +
            '<button class="btn" data-a="del" data-id="' + n.id + '" style="height:22px;padding:0 8px;font-size:11px">Delete</button>' +
          '</div>' +
          (n.anchor ? '<div class="sel-code">' + escHtml(n.anchor.sel) + '</div>' : '') +
        '</div>';
      }).join('');
    }
    renderPins();
    rendering = false;
  }

  /* --stick-total is a calc() string, so the three plain values are read and
     added instead. Pages without a sticky stack return 0. */
  var _stick = null;
  function stickTotal() {
    if (_stick !== null) return _stick;
    var cs = getComputedStyle(document.documentElement), t = 0;
    ['--stick-bar', '--stick-cmd', '--stick-hd'].forEach(function (n) {
      var v = parseFloat(cs.getPropertyValue(n)); if (!isNaN(v)) t += v;
    });
    _stick = t;
    return t;
  }
  addEventListener('resize', function () { _stick = null; });

  var pinList = [];
  function indexOfPin(id) { return pinList.findIndex(function (p) { return p.n.id === id; }); }

  function renderPins() {
    var notes = mine().filter(function (n) { return n.anchor && (S.filter === 'all' || n.status !== 'done' || S.filter === 'done'); });
    elPins.innerHTML = '';
    pinList = notes.map(function (n, i) {
      var d = document.createElement('div');
      d.className = 'pin' + (n.status === 'done' ? ' pin--done' : '');
      d.textContent = i + 1;
      d.title = (n.author || 'anon') + ': ' + n.text.slice(0, 120);
      d.dataset.id = n.id;
      elPins.appendChild(d);
      return { n: n, el: d };
    });
    elPins.classList.toggle('hide', !S.showPins);
    position();
  }

  /* Position is never stored — it is recomputed from the live box every frame.
     That is what makes a pin survive document scroll, the horizontal scroller
     inside .rows below 1340, the dock's internal scroller, the sticky stack and
     any resize, without one line of per-page code. */
  function position() {
    for (var i = 0; i < pinList.length; i++) {
      var p = pinList[i], el = resolve(p.n.anchor);
      /* A pin with nowhere to point is hidden outright, not parked off-screen:
         a negatively positioned child still counts as a box, and the page is
         the one thing this layer may never affect. The note stays in the panel,
         tagged "element not found", so it is reported rather than lost. */
      if (!el) { p.el.style.display = 'none'; continue; }
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) { p.el.style.display = 'none'; continue; }
      p.el.style.display = '';
      var x = r.left + r.width * (p.n.anchor.rx || .5);
      var y = r.top + r.height * (p.n.anchor.ry || .5);
      /* An off-screen pin parks at the edge — but below the sticky stack, not
         inside it. Parked at y=15 it sits on the column header and reads as a
         note about the header. The page publishes the three layer heights, so
         the floor is read, never hardcoded. */
      var edge = false, m = 15, top = stickTotal() + m;
      if (y < top) { y = top; edge = true; } else if (y > innerHeight - m) { y = innerHeight - m; edge = true; }
      if (x < m) { x = m; edge = true; } else if (x > innerWidth - m) { x = innerWidth - m; edge = true; }
      p.el.className = 'pin' + (p.n.status === 'done' ? ' pin--done' : '') +
                       (edge ? ' pin--edge' : '') + (S.selected === p.n.id ? ' pin--sel' : '');
      p.el.style.left = Math.round(x) + 'px';
      p.el.style.top  = Math.round(y) + 'px';
    }
  }
  var raf = 0;
  function loop() { raf = requestAnimationFrame(loop); if (S.showPins && pinList.length) position(); }

  /* ── 10 · focusing a note ────────────────────────────────────────────── */

  function focusNote(id) {
    var n = mine().filter(function (x) { return x.id === id; })[0];
    if (!n) return;
    S.selected = id; render();
    if (!n.anchor) { toast('A general note — no element attached'); return; }
    var el = resolve(n.anchor);
    if (el && visible(el)) return flash(el);
    replayState(n.anchor, function (ok) {
      var e2 = resolve(n.anchor);
      if (e2 && visible(e2)) { flash(e2); }
      else { toast('Could not reach that element — the page may have changed'); }
    });
  }
  function flash(el) {
    el.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setTimeout(function () {
      var r = el.getBoundingClientRect();
      elHl.classList.remove('hide');
      elHl.style.cssText += ';left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;';
      setTimeout(function () { elHl.classList.add('hide'); }, 1400);
    }, 320);
  }

  /* ── 11 · export ─────────────────────────────────────────────────────── */

  var COLS = ['page', 'pageTitle', 'author', 'at', 'kind', 'status', 'text',
              'element', 'selector', 'xpath', 'role', 'box', 'viewport', 'url'];
  function toRow(n) {
    var a = n.anchor || {};
    return [n.page, n.pageTitle || '', n.author || '', n.at, n.kind, n.status, n.text,
            a.label || '', a.sel || '', a.xpath || '', a.role || '', a.box || '',
            a.vw ? a.vw + '×' + a.vh : '', n.url || ''];
  }
  function csv(rows) {
    return [COLS].concat(rows).map(function (r) {
      return r.map(function (c) {
        c = c == null ? '' : String(c);
        return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c;
      }).join(',');
    }).join('\r\n');
  }
  function download(name, text, type) {
    var b = new Blob(['\ufeff' + text], { type: type + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }

  /* ── 12 · wiring ─────────────────────────────────────────────────────── */

  sr.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]');
    var pin = e.target.closest('.pin');
    var note = e.target.closest('.note');

    if (pin) { openPanel(true); focusNote(pin.dataset.id); return; }

    if (b) {
      var a = b.dataset.a;
      if (a === 'pick') { startPick(); return; }
      if (a === 'general') { e.preventDefault(); if (!me()) return askName(function(){ composer(null); }); composer(null); return; }
      if (a === 'eye') { S.showPins = !S.showPins; elPins.classList.toggle('hide', !S.showPins); b.style.color = S.showPins ? '' : 'var(--ink3)'; return; }
      if (a === 'sheet') { window.open(sheetHref(), '_blank'); return; }
      if (a === 'csv')  { download('aan-review-notes.csv', csv(readAll().map(toRow)), 'text/csv'); return; }
      if (a === 'json') { download('aan-review-notes.json', JSON.stringify(readAll(), null, 2), 'application/json'); return; }
      if (a === 'done') {
        var all = readAll();
        all.forEach(function (n) { if (n.id === b.dataset.id) n.status = n.status === 'done' ? 'open' : 'done'; });
        writeAll(all); render(); return;
      }
      if (a === 'del') {
        writeAll(readAll().filter(function (n) { return n.id !== b.dataset.id; }));
        render(); return;
      }
    }
    if (note) focusNote(note.dataset.id);
  });

  elFilter.addEventListener('change', function () { S.filter = elFilter.value; render(); });

  /* the universal sheet, found from any depth */
  function sheetHref() {
    var p = location.pathname, i = p.indexOf('/pages/');
    return (i >= 0 ? p.slice(0, i) : p.replace(/\/[^\/]*$/, '')) + '/comments.html';
  }

  addEventListener('resize', function () {
    place(elPuck, parseFloat(elPuck.style.left) || 20, parseFloat(elPuck.style.top) || 20);
    place(elPanel, parseFloat(elPanel.style.left) || 20, parseFloat(elPanel.style.top) || 20);
  });
  addEventListener('storage', function (e) { if (e.key === K_NOTES) render(); });

  /* ── 13 · boot ───────────────────────────────────────────────────────── */

  document.body.appendChild(root);
  placeDefaults();
  render();
  loop();

  /* Arriving from the universal sheet: #aan-note=<id> opens the panel and walks
     to that element, replaying whatever had to be open for it to exist. */
  (function () {
    var m = /(?:^|[#&])aan-note=([a-z0-9]+)/i.exec(location.hash);
    if (!m) return;
    setTimeout(function () { openPanel(true); focusNote(m[1]); }, 450);
  })();

  window.__aanNotes = {
    all: readAll, open: function () { openPanel(true); }, pick: startPick,
    csv: function () { return csv(readAll().map(toRow)); }, page: PAGE
  };
})();
