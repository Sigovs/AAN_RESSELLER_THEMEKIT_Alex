// Shared plumbing for tools/ds-check: the ten pages, a static server, a headless browser over CDP.
// No dependencies: Node 22+ (global fetch + WebSocket). Browser: $EDGE or $CHROME, else the default
// Edge path on Windows, else Chrome / Chromium.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const PAGES = [ // precedence order (DESIGN.md §0) — the earlier page wins
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

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export function findBrowser() {
  const c = [process.env.EDGE, process.env.CHROME,
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean);
  return c.find(p => fs.existsSync(p));
}

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json' };

/** Serve `root` on a free local port. */
export function serve(root = ROOT) {
  return new Promise(res => {
    const s = http.createServer((q, r) => {
      const p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
      if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { 'Content-Type': TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(p).pipe(r);
    }).listen(0, '127.0.0.1', () => res(s));
  });
}

/** Start a headless browser; returns { open(url, w, h, wait, touch), evaluate(expr), screenshot(file, full), errors, close() }. */
export async function browser() {
  const exe = findBrowser();
  if (!exe) throw new Error('no Edge/Chrome found — set $EDGE or $CHROME');
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-check-'));
  const dbg = 9300 + Math.floor(Math.random() * 500);
  const br = spawn(exe, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=' + dbg, '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });
  let list; for (let i = 0; i < 80; i++) { try { list = await (await fetch(`http://127.0.0.1:${dbg}/json/list`)).json(); if (list.length) break; } catch { } await sleep(200); }
  const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = {}; const ev = [];
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } else if (d.method) ev.forEach(f => f(d)); };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable'); await send('Runtime.enable');
  const errors = [];
  ev.push(d => { if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description?.split('\n')[0] || d.params.exceptionDetails.text); });
  return {
    errors,
    async open(url, w = 1440, h = 900, wait = 2200, touch = false) {
      errors.length = 0;
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
      await send('Emulation.setTouchEmulationEnabled', { enabled: !!touch, maxTouchPoints: touch ? 5 : 1 }); // touch: (hover: none), (pointer: coarse)
      const loaded = new Promise(r => { const f = d => { if (d.method === 'Page.loadEventFired') { ev.splice(ev.indexOf(f), 1); r(); } }; ev.push(f); });
      await send('Page.navigate', { url });
      await Promise.race([loaded, sleep(20000)]); await sleep(wait);
    },
    async evaluate(expression) {
      const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'evaluate failed');
      return r.result.result.value;
    },
    async screenshot(file, full = false) {
      const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full });
      fs.writeFileSync(file, Buffer.from(r.result.data, 'base64'));
    },
    close() { try { ws.close(); } catch { } br.kill(); try { fs.rmSync(prof, { recursive: true, force: true }); } catch { } },
  };
}

/** --flag=value / --flag value */
export function arg(name, dflt) {
  const a = process.argv; const i = a.findIndex(x => x === '--' + name || x.startsWith('--' + name + '='));
  if (i < 0) return dflt;
  if (a[i].includes('=')) return a[i].split('=').slice(1).join('=');
  return a[i + 1] && !a[i + 1].startsWith('--') ? a[i + 1] : true;
}
