/* Stage 2 harness — drives the states Stage 2 is judged on and measures the
   contract directly. Read-only; loaded manually during the migration. */
(function () {
  const s = ms => new Promise(r => setTimeout(r, ms));
  const px = v => Math.round(v);

  const q = (x, root) => (root || document).querySelector(x);
  const qa = (x, root) => [...(root || document).querySelectorAll(x)];

  window.__reset = async function () {
    location.hash = '';
    const api = window.G8demo;
    if (api && api.S.cur) { api.closeVehicle(); await s(500); }
    if (api && api.S.dock) { api.closeDock(); await s(450); }
    const cs = q('[data-act="clear-sel"]');
    if (cs && Object.keys(api ? api.S.sel : {}).some(k => api.S.sel[k])) { cs.click(); await s(250); }
    await s(150);
    for (let i = 0; i < 4 && scrollY !== 0; i++) { scrollTo(0, 0); await s(90); }
    /* the sheet's regions are continuously visible now and hold no open state,
       so there is nothing to reset here — writing the old keys back would only
       put dead entries into S.acc and misreport the application's state. */
    const n = q('#scope-n');
    if (n) { if (n._raf) { cancelAnimationFrame(n._raf); n._raf = null; }
             const lane = q('.lane--on b'); if (lane) n.textContent = lane.textContent; }
    await s(120);
  };

  /* the numbers Stage 2 is accepted on */
  window.__contract = function () {
    const cs = getComputedStyle(document.documentElement);
    const num = name => parseFloat(cs.getPropertyValue(name)) || null;
    const stickTotal = (() => {
      const hd = q('.hd'); if (!hd) return null;
      return px(hd.getBoundingClientRect().bottom);
    })();
    const open = q('.row.open');
    const exp = q('#exp') || q('.exp');
    const sp = q('#exp-space');
    const field = q('.field');
    const foot = q('.foot');
    const d = document.documentElement;

    const out = {
      viewport: [innerWidth, innerHeight],
      scrollY: px(scrollY),
      overflow: d.scrollWidth - d.clientWidth,
      stickTotalToken: cs.getPropertyValue('--stick-total').trim(),
      anchorGapToken: cs.getPropertyValue('--anchor-gap').trim() || cs.getPropertyValue('--exp-offset').trim(),
      stickyBottomMeasured: stickTotal,
      docHeight: d.scrollHeight,
      maxScroll: d.scrollHeight - innerHeight,
      expSpace: sp ? { present: true, h: px(sp.getBoundingClientRect().height), css: getComputedStyle(sp).height, display: getComputedStyle(sp).display } : { present: false }
    };

    if (open) {
      const r = open.getBoundingClientRect();
      out.selectedRow = { top: px(r.top), left: px(r.left), right: px(r.right), h: px(r.height) };
      out.anchorDelta = stickTotal !== null ? px(r.top) - stickTotal : null;
    }
    if (exp) {
      const e = exp.getBoundingClientRect(); const c = getComputedStyle(exp);
      out.workspace = { top: px(e.top), left: px(e.left), right: px(e.right), h: px(e.height),
        position: c.position, zIndex: c.zIndex };
      if (open) {
        const r = open.getBoundingClientRect();
        out.seamGap = px(e.top - r.bottom);
        out.edgeDeltaLeft = px(e.left - r.left);
        out.edgeDeltaRight = px(e.right - r.right);
      }
      out.rowsCovered = qa('.row:not(.open)').filter(x => { const b = x.getBoundingClientRect(); return b.top < e.bottom - 1 && b.bottom > e.top + 1; }).length;
      const inner = exp.querySelector('.exp__in');
      out.workspaceShadow = inner ? getComputedStyle(inner).boxShadow.slice(0, 44) : null;
    }
    out.regionsOpen = qa('.exp__accs .acc').map(a => a.dataset.acc + (a.classList.contains('acc--open') ? ':open' : ':shut'));
    out.rowsDimmed = qa('.row').filter(x => parseFloat(getComputedStyle(x).opacity) < 0.99).length;
    if (field && foot) {
      out.footBelowWorkspace = exp ? foot.getBoundingClientRect().top >= exp.getBoundingClientRect().bottom - 1 : null;
    }
    return out;
  };

  /* open a row by index, from a chosen starting scroll */
  window.__openRow = async function (idx, startScroll) {
    await window.__reset();
    if (startScroll) { scrollTo(0, startScroll); await s(320); }
    const rows = qa('.row');
    const row = rows[Math.min(idx, rows.length - 1)];
    const before = { scrollY: px(scrollY), rowTop: px(row.getBoundingClientRect().top) };
    row.click();
    await s(1100);              // allow smooth travel to finish
    return { before, after: window.__contract() };
  };

  window.__select = async function (n) {
    for (let i = 0; i < n; i++) {
      const c = qa('.row .ck[data-sel]').filter(x => !x.checked)[0];
      if (!c) break;
      c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true }));
      await s(180);
    }
  };

  window.__rowsAtRest = async function () {
    for (let i = 0; i < 6 && scrollY !== 0; i++) { scrollTo(0, 0); await s(110); }
    await s(160);
    const top = q('.hd').getBoundingClientRect().bottom;
    return { scrollY: px(scrollY), hdBottom: px(top),
      rows: qa('.row').filter(x => { const b = x.getBoundingClientRect(); return b.top >= top - 1 && b.bottom <= innerHeight + 1; }).length };
  };

  window.__openRegion = async function (key) {
    const sec = q('.exp__accs .acc[data-acc="' + key + '"]');
    if (!sec || sec.classList.contains('acc--open')) return;
    const b = q('.acc__h', sec); if (b) { b.click(); await s(360); }
  };

  window.__states = {
    'default': async () => { await window.__reset(); },
    'scroll-engaged': async () => { await window.__reset(); scrollTo(0, 1200); await s(350); },
    'filters': async () => { await window.__reset(); q('[data-act="filters"]').click(); await s(550); },
    'vehicle-top': async () => { await window.__openRow(1, 0); },
    'vehicle-mid': async () => { await window.__openRow(8, 0); },
    'vehicle-last': async () => { await window.__openRow(99, 0); },
    'vehicle-market': async () => { await window.__openRow(1, 0); await window.__openRegion('market'); },
    'vehicle-all-regions': async () => { await window.__openRow(1, 0);
      for (const k of ['health','market','comps','spec','hist']) await window.__openRegion(k); },
    'filters-plus-vehicle': async () => { await window.__openRow(1, 0); q('[data-act="filters"]').click(); await s(600); },
    'three-selected': async () => { await window.__reset(); await window.__select(3); },
    'tray-plus-vehicle': async () => { await window.__reset(); await window.__select(3);
      const rows = qa('.row'); rows[6].click(); await s(1100); }
  };

  window.__runAll = async function (names) {
    const out = {};
    for (const n of (names || Object.keys(window.__states))) {
      try { await window.__states[n](); out[n] = window.__contract(); }
      catch (e) { out[n] = { ERROR: String(e).slice(0, 120) }; }
    }
    await window.__reset();
    return out;
  };

  /* hit tests that Stage 2 must not regress */
  window.__hitTests = async function () {
    const out = {};
    await window.__reset();
    // tray + vehicle
    await window.__select(3);
    const rows = qa('.row'); rows[6].click(); await s(1100);
    scrollTo(0, 900); await s(350);
    const tray = q('#tray'), exp = q('#exp') || q('.exp');
    if (tray && exp) {
      const t = tray.getBoundingClientRect(), e = exp.getBoundingClientRect();
      if (t.top < e.bottom && t.bottom > e.top) {
        const y = px((Math.max(t.top, e.top) + Math.min(t.bottom, e.bottom)) / 2);
        out.trayClickable = [t.left + 30, t.left + t.width / 2, t.right - 30]
          .map(x => { const el = document.elementFromPoint(px(x), y); return !!(el && el.closest('#tray')); })
          .every(Boolean);
      } else out.trayClickable = 'no overlap';
    }
    // header never disappears
    const hd = q('.hd');
    out.headerOpacityDuringScroll = [];
    for (const y of [600, 900, 1200, 1500]) { scrollTo(0, y); await s(200);
      out.headerOpacityDuringScroll.push({ y, opacity: getComputedStyle(hd).opacity, cls: hd.className }); }
    // workspace under chrome
    scrollTo(0, 1100); await s(300);
    if (exp) { const e = exp.getBoundingClientRect(), h = hd.getBoundingClientRect();
      if (e.top < h.bottom && e.bottom > h.top) {
        const y = px((Math.max(e.top, h.top) + Math.min(e.bottom, h.bottom)) / 2);
        const el = document.elementFromPoint(px(e.left + e.width / 2), y);
        out.headerWinsOverWorkspace = !!(el && el.closest('.hd'));
      } else out.headerWinsOverWorkspace = 'no overlap at this scroll'; }
    await window.__reset();
    // popover while scrolled
    scrollTo(0, 700); await s(300);
    const btn = q('[data-pop="p-make"]'); if (btn) { btn.click(); await s(350);
      const pop = q('#p-make'), pr = pop.getBoundingClientRect(), h2 = hd.getBoundingClientRect();
      if (pr.height > 0 && pr.top < h2.bottom && pr.bottom > h2.top) {
        const y = px((Math.max(pr.top, h2.top) + Math.min(pr.bottom, h2.bottom)) / 2);
        const el = document.elementFromPoint(px(pr.left + pr.width / 2), y);
        out.popoverAboveHeader = !!(el && el.closest('#p-make'));
      } else out.popoverAboveHeader = 'no overlap';
      btn.click(); }
    await window.__reset();
    return out;
  };

  return 'harness2 ready';
})();
