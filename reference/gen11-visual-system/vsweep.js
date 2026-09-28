/* Gen 11 visual-system sweep — read-only measurement of the things Phase 1 owns. */
(function () {
  const s = ms => new Promise(r => setTimeout(r, ms));
  const q = (x, r) => (r || document).querySelector(x);
  const qa = (x, r) => [...(r || document).querySelectorAll(x)];
  const R = el => el ? el.getBoundingClientRect() : null;
  const n = v => Math.round(v * 100) / 100;
  const d = document.documentElement;

  const reset = async () => {
    const api = window.G8demo;
    if (api && api.S.cur) { api.closeVehicle(); await s(420); }
    if (api && api.S.dock) { api.closeDock(); await s(420); }
    const cs = q('[data-act="clear-sel"]');
    if (cs && api && Object.keys(api.S.sel).some(k => api.S.sel[k])) { cs.click(); await s(250); }
    const on = q('.attn .ar--on'); if (on) { on.click(); await s(400); }
    const qq = q('#q'); if (qq && qq.value) { qq.value = ''; qq.dispatchEvent(new Event('input', { bubbles: true })); await s(300); }
    if (api) { const dft = { health: true, market: false, spec: false, hist: false };
               Object.keys(dft).forEach(k => { api.S.acc[k] = dft[k]; }); }
    for (let i = 0; i < 5 && scrollY !== 0; i++) { scrollTo(0, 0); await s(90); }
    await s(200);
  };
  window.__vreset = reset;

  /* every defect class the brief lists, measured */
  window.__defects = function () {
    const out = { overflow: d.scrollWidth - d.clientWidth, seams: [], insets: [], clipped: [], collisions: [], voids: [] };

    // sticky stack seams + insets
    const T = R(q('.top')), C = R(q('.cmd')), H = R(q('.hd'));
    if (T && C && H) {
      out.seams.push({ at: 'top→cmd', gap: n(C.top - T.bottom) });
      out.seams.push({ at: 'cmd→hd', gap: n(H.top - C.bottom) });
      out.insets = [[n(T.left), n(T.right)], [n(C.left), n(C.right)], [n(H.left), n(H.right)]];
      out.insetsEqual = n(T.left) === n(C.left) && n(C.left) === n(H.left) && n(T.right) === n(C.right) && n(C.right) === n(H.right);
      out.stackHeight = n(H.bottom - T.top);
    }

    // text clipped by its own box
    qa('.top, .cmd, .hd, .sub, .foot, .exp__in, .tray').forEach(sc => {
      qa('*', sc).forEach(e => {
        if (!e.children.length && e.textContent.trim()) {
          const cs = getComputedStyle(e);
          if (cs.overflow === 'visible' && e.scrollWidth > e.clientWidth + 2 && cs.textOverflow !== 'ellipsis')
            out.clipped.push({ txt: e.textContent.trim().slice(0, 22), sel: e.className || e.tagName, over: e.scrollWidth - e.clientWidth });
        }
      });
    });

    // adjacent controls that touch or overlap
    const groups = ['.veh__acts', '.seg', '.qf', '.cmd', '.foot .pg', '.tray'];
    groups.forEach(g => {
      const host = q(g); if (!host) return;
      const btns = qa('button, .btn, a.btn', host).filter(b => R(b).width > 0);
      for (let i = 1; i < btns.length; i++) {
        const a = R(btns[i - 1]), b = R(btns[i]);
        if (Math.abs(a.top - b.top) > 4) continue;           // different line
        const gap = n(b.left - a.right);
        if (gap < 4) out.collisions.push({ group: g, pair: btns[i-1].textContent.trim().slice(0,12) + '|' + btns[i].textContent.trim().slice(0,12), gap });
      }
    });

    // workspace composition
    const l = q('.exp__l'), r = q('.exp__r'), exp = q('#exp'), row = q('.row.open');
    if (l && r) out.voids.push({ where: 'header band', px: Math.abs(Math.round(R(l).height - R(r).height)) });
    if (exp && row) {
      out.anchorDeviation = n(R(row).top - 202);
      out.seamRowToWorkspace = n(R(exp).top - R(row).bottom);
      out.edgeDelta = [n(R(exp).left - R(row).left), n(R(exp).right - R(row).right)];
      out.rowsCovered = qa('.row:not(.open)').filter(x => { const b = R(x); return b.top < R(exp).bottom - 1 && b.bottom > R(exp).top + 1; }).length;
      out.workspaceH = Math.round(R(exp).height);
      out.regions = qa('.exp__accs > .acc').map(a => ({ k: a.dataset.acc, open: a.classList.contains('acc--open'),
        w: Math.round(R(a).width), l: Math.round(R(a).left), hdH: Math.round(R(q('.acc__h', a)).height), radius: getComputedStyle(a).borderRadius }));
      out.regionsAligned = new Set(out.regions.map(x => x.l)).size === 1 && new Set(out.regions.map(x => x.w)).size === 1;
      out.regionHeadersEqual = new Set(out.regions.map(x => x.hdH)).size === 1;
    }
    out.dimmedRows = qa('.row').filter(x => parseFloat(getComputedStyle(x).opacity) < 0.999).length;
    return out;
  };

  window.__states = {
    'default-top':        async () => { await reset(); },
    'sticky-engaged':     async () => { await reset(); scrollTo(0, 1200); await s(420); },
    'vehicle-near-top':   async () => { await reset(); qa('.row')[1].click(); await s(1500); },
    'vehicle-middle':     async () => { await reset(); qa('.row')[8].click(); await s(1500); },
    'vehicle-near-bottom':async () => { await reset(); const r = qa('.row'); r[r.length - 1].click(); await s(1600); },
    'filters-open':       async () => { await reset(); q('[data-act="filters"]').click(); await s(700); },
    'filters-plus-vehicle': async () => { await reset(); qa('.row')[8].click(); await s(1500); q('[data-act="filters"]').click(); await s(750); },
    'bulk3-plus-vehicle': async () => { await reset();
        for (let i = 0; i < 3; i++) { const c = qa('.row .ck[data-sel]').filter(x => !x.checked)[0];
          if (c) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); await s(200); } }
        qa('.row')[8].click(); await s(1500); },
    'market-visible':     async () => { await reset(); qa('.row')[8].click(); await s(1500);
        q('.acc[data-acc="market"] .acc__h').click(); await s(450); },
    'all-regions-open':   async () => { await reset(); qa('.row')[8].click(); await s(1500);
        for (const k of ['market','spec','hist']) { q('.acc[data-acc="'+k+'"] .acc__h').click(); await s(380); } },
    'all-regions-closed': async () => { await reset(); qa('.row')[8].click(); await s(1500);
        q('.acc[data-acc="health"] .acc__h').click(); await s(400); },
    'empty-state':        async () => { await reset(); const b = qa('.attn .ar')[5]; if (b) { b.click(); await s(500); }
        const inp = q('#q'); if (inp) { inp.value = 'zzzzzz'; inp.dispatchEvent(new Event('input', { bubbles: true })); await s(400); } }
  };

  window.__sweep = async function (names) {
    const out = {};
    for (const k of (names || Object.keys(window.__states))) {
      try { await window.__states[k](); out[k] = window.__defects(); }
      catch (e) { out[k] = { ERROR: String(e).slice(0, 100) }; }
    }
    await reset();
    return out;
  };
  return 'vsweep ready';
})();
