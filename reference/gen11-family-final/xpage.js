/* Gen 11 cross-page consistency probe — read-only.
   Run on each family page; compare the returned objects side by side. */
(function () {
  const q = x => document.querySelector(x);
  const qa = x => [...document.querySelectorAll(x)];
  const n = v => Math.round(v * 100) / 100;
  const cs = getComputedStyle(document.documentElement);
  const tok = k => cs.getPropertyValue(k).trim() || null;

  window.__xpage = function () {
    const d = document.documentElement;
    const out = { url: location.pathname.split('/').pop(), viewport: [innerWidth, innerHeight] };

    /* tokens the system says every page must share */
    out.tokens = {};
    ['--s1','--s2','--s3','--s4','--s5','--s6','--gutter','--anchor-gap',
     '--r-pill','--r-card','--r-panel','--r-control',
     '--stick-bar','--stick-cmd','--stick-hd',
     '--z-platform','--z-sticky-cmd','--z-sticky-hd','--z-tray','--z-menu',
     '--focus-w','--focus-offset','--focus-color',
     '--brand','--ink','--line','--line-2','--sheet','--well','--wash','--focal','--danger','--ok'
    ].forEach(k => out.tokens[k] = tok(k));

    /* page gutter — the left edge every layer should share */
    const edges = {};
    [['top','.top'], ['cmd','.cmd'], ['hd','.hd'], ['field','.field'], ['foot','.foot'], ['bento','.bento']].forEach(([k, sel]) => {
      const e = q(sel); if (!e) return; const b = e.getBoundingClientRect();
      edges[k] = [n(b.left), n(d.clientWidth - b.right)];
    });
    out.edges = edges;
    const lefts = Object.values(edges).map(x => x[0]);
    out.gutterConsistent = lefts.length ? new Set(lefts).size === 1 : null;

    /* global nav */
    const nav = q('.top');
    out.nav = nav ? { height: n(nav.getBoundingClientRect().height), bg: getComputedStyle(nav).backgroundColor,
      radius: getComputedStyle(nav).borderRadius, sticky: getComputedStyle(nav).position } : null;

    /* sticky stack */
    const hd = q('.hd'), cmd = q('.cmd');
    out.sticky = { cmdTop: cmd ? getComputedStyle(cmd).top : null, hdTop: hd ? getComputedStyle(hd).top : null,
      cmdPos: cmd ? getComputedStyle(cmd).position : null, hdPos: hd ? getComputedStyle(hd).position : null };

    /* buttons — heights, radii, gaps actually used */
    const btnStats = {};
    qa('.btn, button').forEach(b => {
      const r = b.getBoundingClientRect(); if (r.width < 8 || r.height < 8) return;
      const c = getComputedStyle(b);
      const key = Math.round(r.height) + 'px/' + c.borderRadius;
      btnStats[key] = (btnStats[key] || 0) + 1;
    });
    out.buttonShapes = Object.entries(btnStats).sort((a,b) => b[1]-a[1]).slice(0, 8);

    /* typography ladder actually rendered */
    const sizes = {};
    qa('h1,h2,h3,h4,p,span,td,th,label,button,a').forEach(e => {
      if (e.children.length || !e.textContent.trim()) return;
      const f = getComputedStyle(e); const k = f.fontSize + '/' + f.fontWeight;
      sizes[k] = (sizes[k] || 0) + 1;
    });
    out.typeLadder = Object.entries(sizes).sort((a,b) => b[1]-a[1]).slice(0, 10);

    /* off-scale spacing — the 8pt audit */
    const scale = new Set([0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 10]);
    const offScale = {};
    qa('*').forEach(e => {
      const c = getComputedStyle(e);
      ['paddingTop','paddingRight','paddingBottom','paddingLeft','gap','rowGap','columnGap','marginTop','marginBottom'].forEach(p => {
        const v = parseFloat(c[p]); if (isNaN(v) || v === 0) return;
        if (!scale.has(Math.round(v))) { const k = Math.round(v) + 'px'; offScale[k] = (offScale[k] || 0) + 1; }
      });
    });
    out.offScaleSpacing = Object.entries(offScale).sort((a,b) => b[1]-a[1]).slice(0, 10);

    /* defects */
    out.overflow = d.scrollWidth - d.clientWidth;
    out.dimmedRows = qa('.row, tr').filter(x => parseFloat(getComputedStyle(x).opacity) < 0.999).length;
    out.focusRule = (() => { for (const sh of document.styleSheets) { try {
      for (const r of sh.cssRules) if (r.selectorText && r.selectorText.includes(':focus-visible') && r.style.outline) return r.style.outline;
    } catch (e) {} } return null; })();
    return out;
  };
  return 'xpage ready';
})();
