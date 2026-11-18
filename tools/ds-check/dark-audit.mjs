// Dark-theme audit (DESIGN.md §42): light surfaces left in dark, and text under AA measured on the composited
// render (each colour alpha-blended up the tree), at one width.
//   node tools/ds-check/dark-audit.mjs pages/dealer/all-vehicles-gen11.html [width] [prep-js] [shot.png]
// A page path may carry a review hash (…html#lead=16994); #dark is added. Expect only: tiny status dots,
// the white paper areas (window sticker, editor text area), decorative "·" separators, disabled A–Z letters.
import { serve, browser } from './lib.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const s = await serve(ROOT); const b = await browser();
const pg = process.argv[2] || 'pages/dealer/all-vehicles-gen11.html', w = Number(process.argv[3] || 1440);
await b.open(`http://127.0.0.1:${s.address().port}/${pg}${pg.includes("#") ? "&dark" : "#dark"}`, w, 900, 1800);
for (let i = 0; i < 40 && !(await b.evaluate(`document.documentElement.dataset.theme === "dark" && document.readyState === "complete"`)); i++) await new Promise(r => setTimeout(r, 250)); await new Promise(r => setTimeout(r, 600));
if (process.argv[4]) { await b.evaluate(`(()=>{ ${process.argv[4]}; return 1 })()`); await new Promise(r => setTimeout(r, 700)); }
const out = await b.evaluate(`(()=>{
  const theme = document.documentElement.getAttribute('data-theme');
  const parse = c => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const L = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const over = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
  const bgOf = el => { const st = []; let e = el; while (e) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c[3] > 0) { st.push(c); if (c[3] >= 1) break; } e = e.parentElement; }
    let col = [8, 11, 17, 1]; for (let i = st.length - 1; i >= 0; i--) col = over(st[i], col); return col; };
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > .05; };
  const bright = new Map(), low = new Map();
  document.querySelectorAll('body *').forEach(e => {
    if (!vis(e) || e.closest('svg') || e.tagName === 'IMG' || e.closest('.thn, .photo, picture')) return;
    const c = parse(getComputedStyle(e).backgroundColor);
    if (c && c[3] > .3) { const comp = bgOf(e); if (L(comp) > .35) { const k = e.tagName + '.' + String(e.className).split(' ').slice(0, 2).join('.'); if (!bright.has(k)) bright.set(k, Math.round(L(comp) * 100) / 100); } }
    const t = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (t) { const cs = getComputedStyle(e); const fg = parse(cs.color); if (!fg) return; const bg = bgOf(e); const f = fg[3] < 1 ? over(fg, bg) : fg;
      const a = L(f), z = L(bg), cr = (Math.max(a, z) + .05) / (Math.min(a, z) + .05); const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
      if (cr < (big ? 3 : 4.5)) { const k = e.tagName + '.' + String(e.className).split(' ').slice(0, 2).join('.'); if (!low.has(k)) low.set(k, (Math.round(cr * 100) / 100) + ' "' + e.textContent.trim().slice(0, 22) + '"'); } }
  });
  return 'theme ' + theme + ' | overflow ' + (document.documentElement.scrollWidth - innerWidth) + '\\nBRIGHT (' + bright.size + '): ' + [...bright].map(x => x.join(' ')).join(' | ') + '\\nLOW CONTRAST (' + low.size + '): ' + [...low].map(x => x.join(' ')).join(' | ');
})()`);
console.log(out);
if (process.argv[5]) { await b.screenshot(path.resolve(process.argv[5])); }
console.log('console errors', b.errors ? b.errors.length : 'n/a');
b.close(); s.close();
