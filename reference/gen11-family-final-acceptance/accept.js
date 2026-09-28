/* Gen 11 visual acceptance probe — the defect classes, measured. Read-only. */
(function () {
  const q = (s, r) => (r || document).querySelector(s);
  const qa = (s, r) => [...(r || document).querySelectorAll(s)];
  const R = e => e.getBoundingClientRect();
  const n = v => Math.round(v * 100) / 100;

  window.__accept = function () {
    const d = document.documentElement, out = { page: location.pathname.split('/').pop(), viewport: [innerWidth, innerHeight] };
    out.overflow = d.scrollWidth - d.clientWidth;

    /* sticky stack: seams and insets */
    const T = q('.top'), C = q('.cmd'), H = q('.hd');
    if (T && C) {
      const t = R(T), c = R(C);
      out.seamTopToCmd = n(c.top - t.bottom);
      out.insetTop = [n(t.left), n(d.clientWidth - t.right)];
      out.insetCmd = [n(c.left), n(d.clientWidth - c.right)];
    }
    if (C && H) out.seamCmdToHd = n(R(H).top - R(C).bottom);

    /* attached surfaces must not keep a radius where they touch */
    const badRadius = [];
    [[T, C, 'top→cmd'], [C, H, 'cmd→hd']].forEach(([a, b, label]) => {
      if (!a || !b) return;
      if (Math.abs(R(b).top - R(a).bottom) > 1) return;      // not touching
      const ra = getComputedStyle(a), rb = getComputedStyle(b);
      if (parseFloat(ra.borderBottomLeftRadius) > 0 || parseFloat(ra.borderBottomRightRadius) > 0
       || parseFloat(rb.borderTopLeftRadius) > 0 || parseFloat(rb.borderTopRightRadius) > 0)
        badRadius.push(label);
    });
    out.attachedWithRadius = badRadius;

    /* double shadows on a single boundary inside the stack */
    const shadowed = [T, C, H].filter(Boolean).filter(e => {
      const sh = getComputedStyle(e).boxShadow;
      return sh && sh !== 'none' && sh.split(/,(?![^(]*\))/).some(p => !/\binset\b/.test(p));
    });
    out.outerShadowsInStack = shadowed.map(e => (e.className || '').split(' ')[0]);

    /* buttons touching on the same visual line */
    const touching = [];
    qa('.btn, button').forEach(() => {});
    const groups = qa('.veh__acts, .cmd, .foot, .tray, .head, .savebar, .qf, .walk');
    groups.forEach(g => {
      const bs = qa('button, .btn, a.btn', g).filter(b => R(b).width > 6);
      const byLine = {};
      bs.forEach(b => { const y = Math.round(R(b).top); (byLine[y] = byLine[y] || []).push(b); });
      Object.values(byLine).forEach(row => {
        row.sort((a, b) => R(a).left - R(b).left);
        for (let i = 1; i < row.length; i++) {
          const gap = n(R(row[i]).left - R(row[i - 1]).right);
          const seg = /seg__b|lane|secnav__b|pg/.test((row[i].className || '') + (row[i-1].className || ''));
          if (gap < 4 && !seg) touching.push({ a: row[i-1].textContent.trim().slice(0,12) || 'icon',
            b: row[i].textContent.trim().slice(0,12) || 'icon', gap });
        }
      });
    });
    out.buttonsTouching = touching.slice(0, 5);

    /* text painted under another surface: a text leaf whose centre hit-tests to
       an element that is neither it nor its ancestor */
    const buried = [];
    qa('h1,h2,h3,p,span,td,th,label,b,strong,li').forEach(e => {
      if (e.children.length || !e.textContent.trim()) return;
      const r = R(e);
      if (r.width < 8 || r.height < 6 || r.top < 0 || r.top > innerHeight - 4) return;
      const hit = document.elementFromPoint(Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2));
      if (hit && hit !== e && !e.contains(hit) && !hit.contains(e)) buried.push(e.textContent.trim().slice(0, 22));
    });
    out.textUnderSurface = buried.slice(0, 5);
    out.textUnderSurfaceCount = buried.length;

    /* focus ring clipped by an ancestor's overflow */
    const clipped = [];
    qa('button, a[href], input, select').slice(0, 60).forEach(e => {
      let p = e.parentElement;
      while (p && p !== document.body) {
        const c = getComputedStyle(p);
        if (c.overflow === 'hidden' || c.overflowY === 'hidden') {
          const er = R(e), pr = R(p);
          if (er.top - pr.top < 3 || pr.bottom - er.bottom < 3 || er.left - pr.left < 3) {
            clipped.push((e.getAttribute('aria-label') || e.textContent.trim() || e.className).slice(0, 20));
            break;
          }
        }
        p = p.parentElement;
      }
    });
    out.possibleFocusClipping = clipped.slice(0, 5);

    /* dark-mode controls that still paint */
    out.visibleDarkControls = qa('[data-act="theme"], [aria-label*="dark" i], [title*="dark" i]')
      .filter(e => { const r = R(e); return r.width > 2 && r.height > 2 && getComputedStyle(e).display !== 'none'; }).length;

    /* hidden elements that still paint */
    out.hiddenButPainting = qa('[hidden]').filter(e => {
      const r = R(e); return r.width > 2 && r.height > 2 && getComputedStyle(e).display !== 'none'; }).length;

    /* button geometry in use */
    const shapes = {};
    qa('.btn, button').forEach(b => { const r = R(b); if (r.width < 6) return;
      const k = Math.round(r.height) + '/' + getComputedStyle(b).borderRadius.split(' ')[0];
      shapes[k] = (shapes[k] || 0) + 1; });
    out.buttonShapes = Object.entries(shapes).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([k,v])=>k+'×'+v);

    return out;
  };
  return 'accept ready';
})();
