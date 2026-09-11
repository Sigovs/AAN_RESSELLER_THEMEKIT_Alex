// Re-runnable: extracts the table rows of the exported All Vehicles page into
// pages/dealer/all-vehicles.data.js and copies the referenced thumbnails.
// Usage (from AAN_RESELLER_REDESIGN_FINALE): node tools/extract-rows.js
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const exp = path.resolve(root, '..', 'aan-design-export-2026-09-09');
const html = fs.readFileSync(path.join(exp, 'pages', 'd03-inventory-1.html'), 'utf8');
const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
const body = main.slice(main.indexOf('<tbody'), main.indexOf('</tbody>'));
const rows = body.match(/<tr[\s\S]*?<\/tr>/g);
const clean = s => s.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim();
const dec = s => s.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const out = [];
for (const r of rows) {
  const id = r.match(/data-row-key="(\d+)"/)[1];
  const tds = [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m => clean(m[1]));
  const thumb = (tds[0].match(/src="\.\.\/assets\/img\/([^"]+)"/) || [])[1] || null;
  const stock = dec(clean(tds[1].replace(/<[^>]+>/g, ''))).replace(/\s*🔒\s*$/, '');
  const price = /no price/.test(tds[7]) ? null : +tds[7].replace(/[^\d]/g, '');
  const flags = [...tds[9].matchAll(/title="([^"]*)"/g)].map(m => m[1]);
  const days = +((tds[10].match(/title="([^"]*)"/) || [])[1] || '').replace(/[^\d]/g, '');
  out.push({ id, thumb, stock, year: +tds[2], make: dec(tds[3]), model: dec(tds[4]), trim: dec(tds[5]), ext: dec(tds[6]), price,
    status: clean(tds[8].replace(/<[^>]+>/g, '')), flags, days, ageLabel: clean(tds[10].replace(/<[^>]+>/g, '')),
    ageBand: (tds[10].match(/ui-agepill--(\w+)/) || [])[1], lock: (r.match(/title="(Being edited by[^"]*)"/) || [])[1] || null });
}
fs.writeFileSync(path.join(root, 'pages/dealer/all-vehicles.data.js'),
  '// Real rows extracted from aan-design-export-2026-09-09/pages/d03-inventory-1.html (Chicago Motor Cars #277, Available lane, page 1 of 4)\nwindow.AAN_VEHICLES = ' + JSON.stringify(out, null, 1) + ';\n');
fs.mkdirSync(path.join(root, 'pages/dealer/img'), { recursive: true });
let n = 0; for (const v of out) if (v.thumb) { fs.copyFileSync(path.join(exp, 'assets/img', v.thumb), path.join(root, 'pages/dealer/img', v.thumb)); n++; }
console.log('rows', out.length, 'thumbs', n);
