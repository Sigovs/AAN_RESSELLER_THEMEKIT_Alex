// Reference crops for the DS catalogue: each component as drawn on its ORIGIN Gen 11 page.
// node tools/ds-check/catalog-refs.mjs  →  handoff/catalog/ref/<slug>.png  (crop done with Python/PIL)
import { serve, browser } from './lib.mjs';
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const OUT = path.resolve('handoff/catalog/ref'); fs.mkdirSync(OUT, { recursive: true });
const AV = 'pages/dealer/all-vehicles-gen11.html', SV = 'pages/dealer/single-vehicle-gen11.html', AL = 'pages/dealer/all-leads-gen11.html',
      SL = 'pages/dealer/single-lead-gen11.html', ST = 'pages/staff/single-ticket-gen11.html', MD = 'pages/staff/manage-dealers-gen11.html',
      DE = 'pages/staff/dealer-edit-gen11.html', LG = 'pages/dealer/dealer-login-gen11.html';
const openRow = `const r=document.querySelector('#tb .row'); r&&r.click()`;
const openPkg = `const b=document.querySelector('[data-act="pkg-new"]'); b&&b.click()`;
// [slug, page, selector, prep, pad]
const R = [
  ['btn-primary', AV, '.head .btn--primary, .btn--primary', '', 12],
  ['btn-secondary', AV, '.head .btn--sheet, .btn--sheet', '', 6],
  ['btn-ghost', AV, '.btn--quiet', '', 12],
  ['btn-danger', MD, '.modal .btn--danger', openPkg, 12],
  ['input', SV, 'input.in', '', 12],
  ['select', MD, '#pkg-d', openPkg, 12],
  ['checkbox', AL, '#sel-all', '', 10],
  ['switch', AV, '.sitesw', openRow, 12],
  ['badge', AV, '.stat', '', 10],
  ['chip', AV, '.tag', '', 10],
  ['field', DE, '.fw', '', 12],
  ['search', AV, '.cmd .search', '', 12],
  ['facet', AV, '.cmd .facet__b', '', 12],
  ['tabs', MD, '.cmdtop .ui-views', '', 12],
  ['rowactions', MD, '#tb .row .c-act', '', 10],
  ['topbar', AV, '.top', '', 0],
  ['page-header', MD, '.head', '', 12],
  ['filterbar', MD, '.cmd', '', 0],
  ['table', MD, '.rows', '', 0],
  ['pulsecard', AV, '.focal', '', 12],
  ['record-head', SL, '.head--card', '', 12],
  ['modal', MD, 'dialog.modal', openPkg, 12],
  ['stream', ST, '.ev', '', 12],
  ['menu', AV, '.top .nav__it .pop', `const b=document.querySelector('.top .nav__b'); b&&b.click()`, 12],
];
const s = await serve(path.resolve('.')); const b = await browser(); const port = s.address().port;
const crops = [];
for (const [slug, page, sel, prep, pad] of R) {
  await b.open(`http://127.0.0.1:${port}/${page}`, 1440, 900, 1500);
  if (prep) { await b.evaluate(`(()=>{ ${prep}; return 1 })()`); await new Promise(r => setTimeout(r, 600)); }
  const r = await b.evaluate(`(()=>{ const e=[...document.querySelectorAll(${JSON.stringify(sel)})].find(x=>x.getClientRects().length&&x.getBoundingClientRect().width>0);
    if(!e) return null; document.documentElement.style.scrollBehavior='auto'; e.scrollIntoView({block:'center'}); const q=e.getBoundingClientRect();
    return {x:q.x,y:q.y,w:q.width,h:Math.min(q.height,860)}; })()`);
  if (!r) { console.log('missing', slug); continue; }
  await new Promise(res => setTimeout(res, 300));
  const shot = path.join(OUT, '_' + slug + '.png'); await b.screenshot(shot);
  crops.push([shot, path.join(OUT, slug + '.png'), r.x - pad, r.y - pad, r.w + 2 * pad, r.h + 2 * pad]);
  process.stdout.write('.');
}
b.close(); s.close();
fs.writeFileSync(path.join(OUT, '_crops.json'), JSON.stringify(crops));
execFileSync('python', [path.resolve('tools/ds-check/crop.py'), OUT], { stdio: 'inherit' });
