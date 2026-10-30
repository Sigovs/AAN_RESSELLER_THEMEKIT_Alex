/* AAN Gen 11 — tablet behaviour, 768–1279px (DESIGN.md §41). Loaded last on the nine shell pages.
   Below 1280px only: at 1280 and up this script measures nothing and changes nothing.

   1. Wide lists scroll inside their own container (#tb), never the page. The rows take the
      table's full width (--tw, measured from the grid itself, so every row and the head line up)
      and the column head - still sticky on the page - follows the rows' horizontal scroll (--sx);
      the record's name / id cell stays in view in the rows (sticky) and in the head (--idx).
   2. A dock that is open on load (Single Lead's Workflow, Single Ticket's Assigned To) starts
      closed where it would cover the page as an overlay; its own toggle opens it. */
(function () {
  'use strict';
  var TABLET = window.matchMedia('(max-width: 1279.98px)');
  var OVERLAY = window.matchMedia('(max-width: 1179.98px)');
  var queued = false;

  var ID = '[data-sort="stock"], .c-lead, .c-tkt, .c-name';

  function fit() {
    queued = false;
    var tables = document.querySelectorAll('.rows.ui-table');
    for (var i = 0; i < tables.length; i++) {
      var rows = tables[i];
      var tb = rows.querySelector(':scope > #tb');
      var hd = rows.querySelector(':scope > .hd');
      if (!tb) continue;
      rows.style.removeProperty('--tw'); rows.style.removeProperty('--sx'); rows.style.removeProperty('--idx');
      if (!TABLET.matches) continue;
      var first = tb.querySelector(':scope > .row');
      var w = Math.max(first ? first.scrollWidth : 0, hd ? hd.scrollWidth : 0);
      if (w > tb.clientWidth + 1) rows.style.setProperty('--tw', Math.ceil(w) + 'px');
      var idc = hd && hd.querySelector(':scope > :is(' + ID + ')');
      if (idc) rows.style.setProperty('--idx', idc.offsetLeft + 'px');
      if (!tb.__aanSync) {
        tb.__aanSync = true;
        tb.addEventListener('scroll', sync(rows, tb), { passive: true });
        new MutationObserver(queue).observe(tb, { childList: true });
      }
      rows.style.setProperty('--sx', String(tb.scrollLeft));
    }
  }
  function sync(rows, tb) { return function () { rows.style.setProperty('--sx', String(tb.scrollLeft)); }; }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(fit); } }

  function dockOnLoad() {
    var app = document.getElementById('app');
    if (!app || !OVERLAY.matches || !app.classList.contains('dock-open')) return;
    var t = document.querySelector('[data-act="dock"]');
    if (t) t.click(); else app.classList.remove('dock-open');
  }

  function start() { dockOnLoad(); fit(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.addEventListener('load', queue);
  window.addEventListener('resize', queue);
  if (TABLET.addEventListener) TABLET.addEventListener('change', queue);
})();
