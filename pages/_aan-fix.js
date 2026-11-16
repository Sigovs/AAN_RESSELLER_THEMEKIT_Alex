/* AAN review build only — "See the fix" deep links from the round dashboard (Alex, Nov 16: "a link to the place where
   the fix was made"). Not part of the mockup: tools/build-aan-zip.py adds it to the ten Gen 11 pages, next to the notes
   tool, and nothing else loads it.

   A link carries  #aan-fix=<JSON, URL-encoded>  with
     m : label        a top-bar menu to open, by its button's text (Marketing, Site, Leads, Inventory…)
     o : [selectors]  menus to open — the .nav__it that holds each one gets nav__it--open (hover menus stay put)
     c : [selectors]  buttons to press first (a panel, a mode, a disclosure), in order
     t : selector     the place of the fix
     x : text         when several match t, the one whose text contains this
   The page is left in that state, the place is scrolled to the middle of the screen and outlined in red for a few
   seconds — the same red as the "before" screenshots. Nothing is saved anywhere. */
(function () {
  'use strict';
  var m = /(?:^|[#&])aan-fix=([^&]+)/.exec(location.hash);
  if (!m) return;
  var spec;
  try { spec = JSON.parse(decodeURIComponent(m[1])); } catch (e) { return; }
  function q(s) { try { return document.querySelector(s); } catch (e) { return null; } }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function mark(el) {
    document.documentElement.style.scrollBehavior = 'auto';
    el.scrollIntoView({ block: 'center', inline: 'nearest' });
    var r = el.getBoundingClientRect(), o = document.createElement('div');
    o.setAttribute('aria-hidden', 'true');
    o.style.cssText = 'position:fixed;z-index:2147483646;pointer-events:none;border:3px solid #e0203a;border-radius:10px;' +
      'box-shadow:0 0 0 5px rgba(224,32,58,.18);transition:opacity .6s;left:' + (r.left - 6) + 'px;top:' + (r.top - 6) +
      'px;width:' + (r.width + 12) + 'px;height:' + (r.height + 12) + 'px';
    document.body.appendChild(o);
    var off = function () { o.style.opacity = '0'; setTimeout(function () { o.remove(); }, 700); };
    setTimeout(off, 4500);
    /* the scroll that brought the spot into view also fires a scroll event: only the reader's own scroll removes it */
    setTimeout(function () { window.addEventListener('scroll', off, { once: true, passive: true }); }, 800);
  }
  function target() {
    var list; try { list = [].slice.call(document.querySelectorAll(spec.t)); } catch (e) { list = []; }
    if (spec.x) list = list.filter(function (el) { return el.textContent.indexOf(spec.x) >= 0; });
    return list[0] || null;
  }
  function run() {
    var p = Promise.resolve(wait(900));
    if (spec.m) p = p.then(function () {
      [].some.call(document.querySelectorAll('.nav__b'), function (b) {
        if (b.textContent.trim().indexOf(spec.m) !== 0) return false;
        b.closest('.nav__it').classList.add('nav__it--open'); return true;
      });
      return wait(250);
    });
    (spec.o || []).forEach(function (s) {
      p = p.then(function () { var el = q(s), it = el && el.closest('.nav__it'); if (it) it.classList.add('nav__it--open'); return wait(250); });
    });
    (spec.c || []).forEach(function (s) {
      p = p.then(function () { var el = q(s); if (el) el.click(); return wait(450); });
    });
    p.then(function () { var el = target(); if (el) mark(el); });
  }
  if (document.readyState === 'complete') run(); else window.addEventListener('load', run);
})();
