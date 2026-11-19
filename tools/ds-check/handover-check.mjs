// Handover page check: overflow, AA contrast on the render, clipped titles, small text,
// broken images, at 1920/1440/1024/768/390. `node tools/ds-check/handover-check.mjs shots`
// also writes full-page PNGs to the OS temp folder.
import { serve, browser } from './lib.mjs';
import path from 'node:path'; import fs from 'node:fs'; import os from 'node:os';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const code = fs.readFileSync(path.join(here, 'handover-check.page.js'), 'utf8');
const s = await serve(path.resolve(here, '../..')); const b = await browser(); let n = 0;
const out = path.join(os.tmpdir(), 'aan-handover-shots'); fs.mkdirSync(out, { recursive: true });
for (const w of [1920, 1440, 1024, 768, 390]) {
  await b.open(`http://127.0.0.1:${s.address().port}/handoff/index.html?r=h${n++}`, w, 900, 2500);
  await b.evaluate('window.scrollTo(0, 99999)'); await new Promise(r => setTimeout(r, 1200)); await b.evaluate('window.scrollTo(0, 0)');
  console.log(w, await b.evaluate(code));
  if (process.argv[2] === 'shots') await b.screenshot(path.join(out, `hub_${w}.png`), true);
}
console.log('errors', JSON.stringify(b.errors)); if (process.argv[2] === 'shots') console.log('shots in', out);
b.close(); s.close();
