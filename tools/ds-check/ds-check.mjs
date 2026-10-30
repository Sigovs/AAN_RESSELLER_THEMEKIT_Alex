#!/usr/bin/env node
// AAN Gen 11 — design-system check (DESIGN.md §0).
//
//   node tools/ds-check/ds-check.mjs            static scan + browser measurement
//   node tools/ds-check/ds-check.mjs --static   static scan only (no browser)
//   node tools/ds-check/ds-check.mjs --widths   + (c) overflow, touch targets (touch emulated below 1280) and the sticky stack at
//                                               1440,1024,768 (or --widths 1280,1180x820,834x1112)
//   node tools/ds-check/ds-check.mjs --widths --only   (c) alone
//
// (a) STATIC  lists every selector in a page stylesheet that restyles a shared component
//             (the components _aan-components.css owns). Each one is either page layout that
//             happens to name the class, or a page restyling the system — the second kind is
//             backlog: move the value into the shared definition and delete it from the page.
// (b) MEASURE serves the repo on a local port, opens the ten Gen 11 pages at 1440×900 in headless
//             Edge/Chrome, reads the computed values of each role and compares them with the
//             role's ORIGIN page — the first page, in precedence order, where the role appears.
//             Precedence (Alex, 2026-10-30): earlier page wins.
//
// No dependencies: Node 22+ (global fetch + WebSocket). Browser: $EDGE or $CHROME, else the
// default Edge path on Windows, else `google-chrome` / `chromium` on PATH.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PAGES = [ // precedence order — the earlier page wins
  ['All Vehicles',   'pages/dealer/all-vehicles-gen11'],
  ['Single Vehicle', 'pages/dealer/single-vehicle-gen11'],
  ['All Leads',      'pages/dealer/all-leads-gen11'],
  ['Single Lead',    'pages/dealer/single-lead-gen11'],
  ['Dealer Login',   'pages/dealer/dealer-login-gen11'],
  ['My Work Queue',  'pages/staff/my-work-queue-gen11'],
  ['Single Ticket',  'pages/staff/single-ticket-gen11'],
  ['Manage Dealers', 'pages/staff/manage-dealers-gen11'],
  ['Dealer Edit',    'pages/staff/dealer-edit-gen11'],
  ['Accounting',     'pages/staff/accounting-view-all-gen11'],
];

// ── (a) static scan ─────────────────────────────────────────────────────────
// classes whose look is owned by _aan-components.css / _aan-family.css
const SHARED = ['btn', 'btn--primary', 'btn--sheet', 'btn--quiet', 'btn--sm', 'chip', 'chip--id', 'stat', 'bdg',
  'tag', 'demo', 'nav__b', 'mn__it', 'facet__b', 'lane', 'ui-view', 'secnav__b', 'zone__t', 'gsearch', 'av', 'avt',
  'brand', 'brand__mk', 'ck', 'fld', 'sel', 'pg', 'dock__x', 'dock__t', 'pop'];
const SHARED_RE = new RegExp('\\.(' + SHARED.map(s => s.replace(/[-]/g, '\\-')).join('|') + ')(?![\\w-])');
const ROLE_RE = /(\.head\s+h1|\.head--card\s*>\s*h1|\.cock__t|\.sec__h\s+h2|(^|[\s,>])th\b|\.hd\s*>|\.row\s+\.c\b|#tb\s+\.row)/;

function rulesOf(css) {
  const out = []; let i = 0, line = 1, depth = 0, buf = '', bufLine = 1;
  css = css.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  for (; i < css.length; i++) {
    const ch = css[i];
    if (ch === '\n') line++;
    if (ch === '{') {
      const sel = buf.trim();
      if (sel && !sel.startsWith('@')) {
        // find the matching close to get the declaration block
        let j = i + 1, d = 1; while (j < css.length && d) { if (css[j] === '{') d++; else if (css[j] === '}') d--; j++; }
        const body = css.slice(i + 1, j - 1);
        if (!body.includes('{')) { out.push({ sel, line: bufLine, body: body.replace(/\s+/g, ' ').trim() }); line += (css.slice(i, j).match(/\n/g) || []).length; i = j - 1; }
      }
      depth++; buf = ''; bufLine = line; continue;
    }
    if (ch === '}') { depth--; buf = ''; bufLine = line; continue; }
    if (ch === ';' ) { buf = ''; bufLine = line; continue; }
    if (!buf.trim()) bufLine = line;
    buf += ch;
  }
  return out;
}
const LOOK = /(^|;)\s*(font|font-size|font-weight|letter-spacing|text-transform|color|background|background-color|border-radius|box-shadow|height|min-height|padding|padding-inline|padding-left|padding-right)\s*:/;

function staticScan() {
  const files = [];
  for (const [, p] of PAGES) { const f = path.join(ROOT, p + '.css'); if (fs.existsSync(f) && !files.includes(f)) files.push(f); }
  const login = path.join(ROOT, 'pages/dealer/dealer-login-video.css'); if (fs.existsSync(login)) files.push(login);
  let total = 0; const lines = [];
  for (const f of files) {
    const hits = [];
    for (const r of rulesOf(fs.readFileSync(f, 'utf8'))) {
      if (!LOOK.test(r.body)) continue;
      const parts = r.sel.split(',').map(s => s.trim()).filter(s => { const last = s.split(/\s+|>|\+|~/).filter(Boolean).pop() || ''; return SHARED_RE.test(last) || ROLE_RE.test(s); });
      if (parts.length) hits.push(`  ${String(r.line).padStart(5)}  ${parts.join(', ').slice(0, 150)}`);
    }
    total += hits.length;
    lines.push(`${path.relative(ROOT, f).replace(/\\/g, '/')}  — ${hits.length} rule(s)`, ...hits);
  }
  console.log('\n(a) PAGE CSS THAT RESTYLES A SHARED COMPONENT OR ROLE — ' + total + ' rule(s)\n');
  console.log(lines.join('\n'));
  return total;
}

// ── (b) measurement ─────────────────────────────────────────────────────────
// each role: a selector (first visible match outside the dark board unless board:true) and the properties compared
const ROLES = [
  ['platform bar',        'header.top', ['height', 'borderRadius', 'paddingLeft']],
  ['AAN mark (x)',        '.top .brand__mk', ['@left']],
  ['nav item',            '.top .nav__b', ['height', 'borderRadius', 'fontSize', 'fontWeight']],
  ['global search',       '.top .gsearch', ['height', 'borderRadius', 'fontSize']],
  ['avatar',              '.top .av, .top .avt, .top .me__mk', ['height', 'borderRadius']],
  ['page title',          '.head h1, .head--card > h1, h1.cock__t', ['fontSize', 'fontWeight', 'letterSpacing', 'fontStretch']],
  ['section title',       '.sec__h h2, .zone__t', ['fontSize', 'fontWeight', 'letterSpacing']],
  ['board card title',    '.bento h2, .board__t, .deck__t', ['fontSize', 'fontWeight', 'letterSpacing', 'textTransform'], true],
  ['button',              '.btn:not(.btn--sm):not(.btn--xs):not(.btn--quiet)', ['height', 'borderRadius', 'fontSize', 'fontWeight']],
  ['small button',        '.btn.btn--sm', ['height', 'borderRadius', 'fontSize', 'fontWeight']],
  ['primary button',      '.btn--primary', ['borderRadius', 'backgroundColor', 'fontWeight']],
  ['facet button',        '.facet__b', ['height', 'borderRadius', 'fontSize', 'fontWeight', 'color']],
  ['command search',      '.cmd .search, label.search:not(.search--sm), div.search', ['height', 'borderRadius', 'paddingLeft']],
  ['view tab',            '.ui-views > .ui-view', ['height', 'borderRadius', 'fontSize', 'fontWeight']],
  ['status chip',         '.stat, .bdg:not(.c-pkg .bdg), .c-st.c1, .chips > .chip:not(.chip--id):not(.wchip):not(.chip--type), .stchip', ['height', 'borderRadius', 'fontSize', 'fontWeight', 'textTransform']],
  ['record id pill',      '.chip--id, .idp', ['height', 'borderRadius']],
  ['table head key',      '.hd > span, .hd > .s, .ui-thead > span, thead th', ['fontSize', 'fontWeight', 'letterSpacing', 'textTransform']],
  ['field label',         '.f > span, .f__l, .fl', ['fontSize', 'fontWeight', 'textTransform']],
  ['text input',          'input.fld[type=text], input.in[type=text]', ['height', 'borderRadius', 'fontSize']],
  ['select',              'select.sel:not(.sel--sm), select.fld', ['height', 'borderRadius', 'fontSize']],
  ['checkbox',            'input.ck', ['width', 'borderRadius']],
  ['pager button',        '.pg button', ['height', 'borderRadius', 'fontSize']],
  ['dock close',          '.dock__x', ['height', 'borderRadius']],
  ['dock title',          '.dock__t', ['fontSize', 'fontWeight']],
];

const SHELL = new Set(['platform bar', 'AAN mark (x)', 'nav item', 'global search', 'avatar']);

function findBrowser() {
  const c = [process.env.EDGE, process.env.CHROME,
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean);
  return c.find(p => fs.existsSync(p));
}
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.json': 'application/json' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((q, r) => {
      const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { 'Content-Type': TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(p).pipe(r);
    }).listen(0, '127.0.0.1', () => res(s));
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function measure() {
  const exe = findBrowser();
  if (!exe) { console.log('\n(b) no Edge/Chrome found — set $EDGE or $CHROME'); return 0; }
  const srv = await serve(); const port = srv.address().port;
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-check-'));
  const dbg = 9300 + Math.floor(Math.random() * 500);
  const br = spawn(exe, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=' + dbg, '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });
  let list; for (let i = 0; i < 60; i++) { try { list = await (await fetch(`http://127.0.0.1:${dbg}/json/list`)).json(); if (list.length) break; } catch { } await sleep(200); }
  const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = {}; const ev = [];
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } else if (d.method) ev.forEach(f => f(d)); };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const errors = [];
  ev.push(d => { if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description?.split('\n')[0] || d.params.exceptionDetails.text); });
  const probe = `(() => { const R = ${JSON.stringify(ROLES)}; const o = {};
    for (const [name, sel, props, board] of R) {
      // every visible match; the role's value on the page is the most common one (a role is what it mostly is)
      const els = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); if (b.width < 1 || b.height < 1) return false;
        if (getComputedStyle(e).visibility === 'hidden') return false; const inBoard = e.closest('.bento, .focal, .attn, .pulse, .deck, .board');
        return board ? true : !inBoard; });
      if (!els.length) continue; const tally = new Map();
      for (const el of els) { const c = getComputedStyle(el); const b = el.getBoundingClientRect(); const v = {};
        for (const p of props) v[p] = p === '@left' ? Math.round(b.left) + 'px' : (p === 'height' || p === 'width') ? Math.round(b[p] * 10) / 10 + 'px' : c[p];
        const k = JSON.stringify(v); tally.set(k, (tally.get(k) || 0) + 1); }
      o[name] = JSON.parse([...tally.entries()].sort((a, b) => b[1] - a[1])[0][0]); }
    return JSON.stringify({ o, sw: document.documentElement.scrollWidth, iw: innerWidth }); })()`;
  const res = {};
  for (const [name, p] of PAGES) {
    errors.length = 0;
    const loaded = new Promise(r => { const f = d => { if (d.method === 'Page.loadEventFired') { ev.splice(ev.indexOf(f), 1); r(); } }; ev.push(f); });
    await send('Page.navigate', { url: `http://127.0.0.1:${port}/${p}.html` });
    await Promise.race([loaded, sleep(20000)]); await sleep(2200);
    const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true });
    res[name] = JSON.parse(r.result.result.value); res[name].errors = [...errors];
  }
  ws.close(); br.kill(); srv.close();
  try { fs.rmSync(prof, { recursive: true, force: true }); } catch { }

  console.log('\n(b) ROLES MEASURED AT 1440×900 AGAINST THEIR ORIGIN PAGE\n');
  let diffs = 0;
  for (const [role] of ROLES) {
    const origin = PAGES.map(p => p[0]).find(n => res[n].o[role]);
    if (!origin) continue;
    const ref = res[origin].o[role]; const follow = [], dev = [];
    for (const [n] of PAGES) {
      if (n === origin || !res[n].o[role]) continue;
      if (n === 'Dealer Login' && SHELL.has(role)) continue; // the login page has no platform bar: its own world
      const d = Object.keys(ref).filter(k => res[n].o[role][k] !== ref[k]).map(k => `${k} ${res[n].o[role][k]} (origin ${ref[k]})`);
      if (d.length) { dev.push(`      ${n.padEnd(15)} ${d.join(' · ')}`); diffs++; } else follow.push(n);
    }
    console.log(`  ${role.padEnd(18)} origin ${origin.padEnd(15)} ${Object.entries(ref).map(([k, v]) => k + ' ' + v).join(' · ')}`);
    console.log(`      follow: ${follow.join(', ') || '—'}`);
    if (dev.length) console.log(dev.join('\n'));
  }
  console.log('\n  horizontal overflow at 1440: ' + (PAGES.filter(([n]) => res[n].sw > res[n].iw).map(([n]) => n).join(', ') || 'none'));
  console.log('  console errors: ' + (PAGES.filter(([n]) => res[n].errors.length).map(([n]) => n + ': ' + res[n].errors[0]).join(' | ') || 'none'));
  console.log(`\n  ${diffs} role deviation(s)`);
  return diffs;
}

// ── (c) widths: page overflow, touch targets under 36px, sticky stack share (DESIGN.md §41) ──
const WIDTH_PROBE = `(async () => {
  const iw = innerWidth, ih = innerHeight, sw = document.documentElement.scrollWidth;
  let small = 0;
  if (iw < 1280) document.querySelectorAll('button, a[href], input:not([type=hidden]):not([type=file]), select, textarea, [role=button], label.sw').forEach(e => {
    const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1 || e.closest('svg, .cke, [inert]')) return;
    const c = getComputedStyle(e); if (c.visibility === 'hidden' || c.opacity === '0') return;
    let h = r.height; for (const ps of ['::before', '::after']) { const p = getComputedStyle(e, ps);
      if (p.content !== 'none' && p.position === 'absolute') { const t = parseFloat(p.top) || 0, b = parseFloat(p.bottom) || 0; if (t < 0 || b < 0) h = Math.max(h, r.height - t - b); } }
    const lab = e.closest('label'); if (lab) { const lr = lab.getBoundingClientRect(); let lh = lr.height; const lp = getComputedStyle(lab, '::before');
      if (lp.content !== 'none' && lp.position === 'absolute') lh = Math.max(lh, lr.height - (parseFloat(lp.top) || 0) - (parseFloat(lp.bottom) || 0)); h = Math.max(h, lh); }
    if (h < 35.5) small++; });
  window.scrollTo(0, Math.min(1800, Math.max(0, document.documentElement.scrollHeight - ih - 10))); await new Promise(r => setTimeout(r, 300));
  let top = 0, bot = 0;
  document.querySelectorAll('body *').forEach(e => { const c = getComputedStyle(e); if (c.position !== 'sticky' && c.position !== 'fixed') return;
    if (e.closest('#tb, .dock') || e.matches('.rail, .ui-nav, .side, .thpv')) return; // side columns and the dock overlay are not bands
    const r = e.getBoundingClientRect(); if (r.width < 40 || r.height < 1 || r.height > ih * .9 || c.visibility === 'hidden' || c.opacity === '0' || r.bottom <= 0 || r.top >= ih) return;
    if (r.top < ih / 2) top = Math.max(top, r.bottom); else bot = Math.max(bot, ih - r.top); });
  // zebra: on a list, every second row is tinted across the table's whole width (also when the rows scroll
  // in their own container), and a sticky name / id cell carries its row's tint
  let zebra = '';
  const tb = document.querySelector('.rows.ui-table > #tb'); const rs = tb ? [...tb.querySelectorAll(':scope > .row')] : [];
  if (rs.length > 3) { window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 100));
    const bg = e => getComputedStyle(e).backgroundColor; const r1 = rs[1], r0 = rs[0];
    const id = r1.querySelector(':scope > :is(.stk, .ld, .c-tkt, .c-name)');
    const full = r1.getBoundingClientRect().width + 1 >= tb.scrollWidth - (parseFloat(getComputedStyle(tb).paddingLeft) || 0) - (parseFloat(getComputedStyle(tb).paddingRight) || 0);
    zebra = bg(r1) !== bg(r0) && full && (!id || bg(id) === bg(r1) || getComputedStyle(id).position !== 'sticky') ? 'z' : 'Z!'; }
  return JSON.stringify({ iw, ih, over: Math.max(0, sw - iw), small, stack: Math.round((top + bot) / ih * 100), zebra });
})()`;

async function widths(list) {
  const { serve: srvF, browser: brF } = await import('./lib.mjs');
  const srv = await srvF(); const port = srv.address().port; const br = await brF();
  console.log('\n(c) WIDTHS — horizontal page overflow · controls under 36px (below 1280) · sticky share of the screen\n');
  const head = ['page'.padEnd(16), ...list.map(([w, h]) => (w + 'x' + h).padEnd(22))].join('');
  console.log('  ' + head); let bad = 0;
  for (const [name, p] of PAGES) {
    const cells = [];
    for (const [w, h] of list) {
      await br.open(`http://127.0.0.1:${port}/${p}.html`, w, h, 2200, w < 1280); // a tablet is a touch screen
      const m = JSON.parse(await br.evaluate(WIDTH_PROBE));
      const err = br.errors.length ? ' err' : '';
      if (m.over || br.errors.length || m.stack > 34 || m.zebra === 'Z!') bad++;
      cells.push(`${m.over ? 'OVER ' + m.over : 'ok'}${w < 1280 ? ' ·' + m.small + ' small' : ''} ·${m.stack}%${m.zebra ? ' ·' + m.zebra : ''}${err}`.padEnd(22));
    }
    console.log('  ' + name.padEnd(16) + cells.join(''));
  }
  br.close(); srv.close();
  console.log(`\n  ${bad ? bad + ' cell(s) with overflow, a console error, a sticky stack over a third or a broken zebra' : 'no overflow, no console error, every sticky stack under a third of the screen, zebra intact'}`);
}

const staticOnly = process.argv.includes('--static');
const wArg = process.argv.findIndex(a => a === '--widths' || a.startsWith('--widths='));
const only = process.argv.includes('--only');
if (!only) { staticScan(); if (!staticOnly) await measure(); }
if (wArg >= 0) {
  const raw = process.argv[wArg].includes('=') ? process.argv[wArg].split('=')[1] : (process.argv[wArg + 1] && !process.argv[wArg + 1].startsWith('--') ? process.argv[wArg + 1] : '1440,1024,768');
  const list = raw.split(',').map(x => { const [w, h] = x.split('x').map(Number); return [w, h || (w >= 1280 ? 900 : w < 900 ? 1024 : 768)]; });
  await widths(list);
}
process.exit(0);
