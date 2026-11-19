(() => {
  const L = c => { const m = c.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return [.2126 * f(m[0]) + .7152 * f(m[1]) + .0722 * f(m[2]), m[3] ?? 1]; };
  const bgOf = el => { let comp = null; const stack = []; for (let e = el; e; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; const m = b.match(/[\d.]+/g).map(Number); if ((m[3] ?? 1) > 0) stack.push(m); if ((m[3] ?? 1) === 1) break; }
    let c = [255, 255, 255]; for (let i = stack.length - 1; i >= 0; i--) { const [r, g, b, a = 1] = stack[i]; c = [r * a + c[0] * (1 - a), g * a + c[1] * (1 - a), b * a + c[2] * (1 - a)]; } return 'rgb(' + c.join(',') + ')'; };
  const low = [];
  document.querySelectorAll('body *').forEach(e => {
    if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return;
    const r = e.getBoundingClientRect(); if (!r.width) return;
    const cs = getComputedStyle(e); const [fl] = L(cs.color); const [bl] = L(bgOf(e));
    const cr = (Math.max(fl, bl) + .05) / (Math.min(fl, bl) + .05);
    const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
    if (cr < (big ? 3 : 4.5)) low.push(e.className + ':' + e.textContent.trim().slice(0, 20) + ':' + cr.toFixed(2));
  });
  const clip = [...document.querySelectorAll('.tile__v,.row__n,.card__t,.ch__h h2')].filter(e => e.scrollWidth > e.clientWidth + 1).length;
  const small = [...document.querySelectorAll('body *')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 13 && !e.matches('.tile__k,.brand__mk')).map(e => e.className).slice(0, 5);
  const imgs = [...document.images].filter(i => !i.complete || !i.naturalWidth).length;
  return JSON.stringify({ overflow: document.documentElement.scrollWidth - innerWidth, low: low.slice(0, 8), clip, small, brokenImgs: imgs, h: document.documentElement.scrollHeight });
})()
