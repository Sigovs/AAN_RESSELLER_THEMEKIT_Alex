/* Cross-page design research probe. Read-only; it never mutates the page.
   Loaded manually during the review; no page references it. */
(function () {
  const px = v => Math.round(parseFloat(v) || 0);

  const isVisible = el => {
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none';
  };

  /* every element that participates in the scroll chrome */
  window.probeLayers = function () {
    const out = [];
    document.querySelectorAll('*').forEach(el => {
      const c = getComputedStyle(el);
      if (c.position === 'sticky' || c.position === 'fixed') {
        const r = el.getBoundingClientRect();
        out.push({
          sel: (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '')).slice(0, 70),
          position: c.position, top: c.top, zIndex: c.zIndex,
          h: px(r.height), w: px(r.width), visible: isVisible(el),
          bg: c.backgroundColor, blur: c.backdropFilter !== 'none' ? c.backdropFilter : null
        });
      }
    });
    return out;
  };

  /* every stacking-context creator, which is what traps overlays */
  window.probeStacking = function () {
    const out = [];
    document.querySelectorAll('*').forEach(el => {
      const c = getComputedStyle(el);
      const z = c.zIndex;
      const creates = (z !== 'auto' && c.position !== 'static')
        || c.transform !== 'none' || c.filter !== 'none' || c.isolation === 'isolate'
        || (c.willChange && /transform|opacity|filter/.test(c.willChange))
        || parseFloat(c.opacity) < 1 || c.mixBlendMode !== 'normal';
      if (creates && isVisible(el)) {
        out.push({ sel: (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '')).slice(0, 60),
          z, position: c.position, isolation: c.isolation, opacity: c.opacity,
          reason: z !== 'auto' && c.position !== 'static' ? 'z-index' : c.isolation === 'isolate' ? 'isolate' : c.transform !== 'none' ? 'transform' : parseFloat(c.opacity) < 1 ? 'opacity' : 'other' });
      }
    });
    return out;
  };

  /* token layer as the page actually declares it */
  window.probeTokens = function () {
    const out = { rootBlocks: 0, tokens: {}, sheets: [] };
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch (e) { out.sheets.push({ href: sheet.href, error: 'CORS' }); continue; }
      let n = 0, roots = 0;
      const walk = list => { for (const r of list) { if (r.type === 1) { n++; if (r.selectorText === ':root' || r.selectorText === 'html') { roots++; for (const p of r.style) if (p.startsWith('--')) out.tokens[p] = r.style.getPropertyValue(p).trim(); } } else if (r.cssRules) walk(r.cssRules); } };
      walk(rules);
      out.rootBlocks += roots;
      out.sheets.push({ href: (sheet.href || 'inline').split('/').pop(), rules: n, rootBlocks: roots });
    }
    return out;
  };

  /* what the page actually paints: surfaces, radii, shadows, type */
  window.probeVisualCensus = function () {
    const surfaces = {}, radii = {}, shadows = {}, type = {}, inks = {};
    document.querySelectorAll('*').forEach(el => {
      if (!isVisible(el)) return;
      const c = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return;
      const bg = c.backgroundColor;
      if (bg && !/rgba\(0, 0, 0, 0\)/.test(bg)) surfaces[bg] = (surfaces[bg] || 0) + 1;
      const rad = c.borderRadius;
      if (rad && rad !== '0px') radii[rad] = (radii[rad] || 0) + 1;
      const sh = c.boxShadow;
      if (sh && sh !== 'none') shadows[sh.slice(0, 60)] = (shadows[sh.slice(0, 60)] || 0) + 1;
      if (el.childElementCount === 0 && el.textContent.trim()) {
        const k = c.fontSize + '/' + c.fontWeight + (c.textTransform === 'uppercase' ? '/CAPS' : '') + (c.fontStretch !== '100%' ? '/w' + c.fontStretch : '');
        type[k] = (type[k] || 0) + 1;
        inks[c.color] = (inks[c.color] || 0) + 1;
      }
    });
    const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
    return { surfaces: top(surfaces, 14), radii: top(radii, 14), shadows: top(shadows, 10),
      type: top(type, 22), inks: top(inks, 14),
      counts: { surfaces: Object.keys(surfaces).length, radii: Object.keys(radii).length,
        shadows: Object.keys(shadows).length, typeStyles: Object.keys(type).length, inks: Object.keys(inks).length } };
  };

  /* contrast on the real composited render */
  window.probeContrast = function (limit) {
    const lum = c => { const m = (c.match(/[\d.]+/g) || []).map(Number); if (m.length < 3) return null;
      const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
    const bgOf = el => { let n = el; while (n && n !== document.documentElement) { const c = getComputedStyle(n); const bg = c.backgroundColor;
        if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) { const a = (bg.match(/[\d.]+/g) || [])[3]; if (a === undefined || parseFloat(a) > 0.85) return bg; } n = n.parentElement; }
      return 'rgb(255,255,255)'; };
    const fails = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.childElementCount || !el.textContent.trim() || !isVisible(el)) return;
      const c = getComputedStyle(el);
      const size = parseFloat(c.fontSize), weight = parseInt(c.fontWeight, 10) || 400;
      const big = size >= 24 || (size >= 18.66 && weight >= 700);
      const l1 = lum(c.color), l2 = lum(bgOf(el.parentElement || el));
      if (l1 === null || l2 === null) return;
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const need = big ? 3 : 4.5;
      if (ratio < need) fails.push({ text: el.textContent.trim().slice(0, 32), size: c.fontSize, weight: c.fontWeight,
        color: c.color, bg: bgOf(el.parentElement || el), ratio: +ratio.toFixed(2), need,
        sel: (el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : '')).slice(0, 40) });
    });
    const seen = new Set(), uniq = [];
    for (const f of fails) { const k = f.sel + f.color + f.bg + f.size; if (!seen.has(k)) { seen.add(k); uniq.push(f); } }
    return { totalFailingNodes: fails.length, distinct: uniq.slice(0, limit || 20) };
  };

  /* text that is cut, and text below a functional floor */
  window.probeTruncationAndFloor = function (floor) {
    floor = floor || 14;
    const trunc = {}, small = {};
    document.querySelectorAll('*').forEach(el => {
      if (!isVisible(el)) return;
      const c = getComputedStyle(el);
      if (el.scrollWidth > el.clientWidth + 1 && /hidden|clip/.test(c.overflowX) && el.textContent.trim()) {
        const k = (el.className && typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : el.tagName);
        trunc[k] = (trunc[k] || 0) + 1;
      }
      if (el.childElementCount === 0 && el.textContent.trim() && parseFloat(c.fontSize) < floor) {
        const k = (el.className && typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : el.tagName) + ' @' + c.fontSize;
        small[k] = (small[k] || 0) + 1;
      }
    });
    const top = o => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 16);
    return { truncated: top(trunc), belowFloor: top(small) };
  };

  window.probePage = function () {
    const d = document.documentElement;
    return { url: location.pathname.split('/').pop(), innerW: innerWidth, innerH: innerHeight,
      scrollW: d.scrollWidth, clientW: d.clientWidth, overflow: d.scrollWidth - d.clientWidth,
      docH: d.scrollHeight, bodyBg: getComputedStyle(document.body).backgroundColor,
      title: document.title.slice(0, 70) };
  };

  window.probeGeometry = function (sels) {
    const out = {};
    sels.forEach(s => { const el = document.querySelector(s); if (!el) { out[s] = null; return; }
      const c = getComputedStyle(el), r = el.getBoundingClientRect();
      out[s] = { t: px(r.top), l: px(r.left), w: px(r.width), h: px(r.height),
        pos: c.position, top: c.top, z: c.zIndex, bg: c.backgroundColor,
        radius: c.borderRadius, shadow: c.boxShadow === 'none' ? null : c.boxShadow.slice(0, 44),
        pad: c.padding, overflow: c.overflow }; });
    return out;
  };

  return 'probe ready';
})();
