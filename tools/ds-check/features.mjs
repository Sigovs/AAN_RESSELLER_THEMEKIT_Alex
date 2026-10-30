#!/usr/bin/env node
// AAN Gen 11 — feature inventory (DESIGN.md §41). Nothing may be lost between widths.
//
//   node tools/ds-check/features.mjs --save                 write the 1440 baseline (features-baseline.json)
//   node tools/ds-check/features.mjs                        compare 1024 and 768 (portrait) against the baseline
//   node tools/ds-check/features.mjs --widths 1180x820,834x1112,768x1024
//   node tools/ds-check/features.mjs --list "Single Ticket" print one page's inventory
//
// For every page it lists, by visible label: platform-nav items, buttons, links, inputs / selects /
// checkboxes, tabs and views, facets, table column heads, sections and zones, rail entries, board
// tiles and dock triggers. Each item is classed at the width it is measured:
//   vis   rendered and reachable (on screen, or inside a container that scrolls to it)
//   disc  hidden behind a disclosure whose trigger is itself visible (a menu, a popover, the dock)
//   hid   hidden with no visible trigger found (only allowed if the baseline had it hidden too)
//   lost  rendered but clipped or pushed off screen with no way to scroll to it
// The compare fails on any item whose (vis + disc) count dropped, whose total changed, or that is lost.

import fs from 'node:fs';
import path from 'node:path';
import { PAGES, ROOT, serve, browser, arg } from './lib.mjs';

const BASE = path.join(ROOT, 'tools/ds-check/features-baseline.json');

export const COLLECT = `(() => {
  const iw = innerWidth;
  const KINDS = [
    ['nav',     '.top .brand, .top .nav__b, .top .menu__l, .top .menu a, .top .pop a, .top .pop button, .top .tbtn, .top .gsearch input, .top .dealer, .top .av, .top .avt, .top .me, .top .atlas'],
    ['column',  '.hd > *, .ui-thead > *, thead th'],
    ['tab',     '.ui-view, .secnav__b, .lane'],
    ['facet',   '.facet__b'],
    ['rail',    '.rail__i, .rail__b, .ui-nav__i'],
    ['tile',    '.ar, .tile, .agerow, .tl'],
    ['dock',    '[data-act="filters"], [aria-controls="dock"], .dock__x'],
    ['section', '.zone, .sec, .tsec, .acc, .glacc, .panel, .bento > *, section[aria-label], aside'],
    ['input',   'input:not([type=hidden]), select, textarea'],
    ['button',  'button, [role=button], a.btn'],
    ['link',    'a[href]'],
  ];
  const clean = t => (t || '').replace(/\\s+/g, ' ').trim().slice(0, 64);
  const label = (k, e) => {
    if (k === 'input') {
      const l = e.getAttribute('aria-label') || (e.labels && e.labels[0] && e.labels[0].textContent) ||
        (e.getAttribute('aria-labelledby') && document.getElementById(e.getAttribute('aria-labelledby').split(' ')[0])?.textContent) ||
        e.placeholder || e.name || e.id || e.type;
      return e.tagName.toLowerCase() + (e.type ? ':' + e.type : '') + ' ' + clean(l);
    }
    if (k === 'section') { const h = e.querySelector('h1,h2,h3,.panel__hd,.glacc__t,.acc__t'); return clean(e.getAttribute('aria-label') || (h && h.textContent) || e.id || e.className); }
    return clean(e.getAttribute('aria-label') || e.textContent || e.title || e.value || e.className);
  };
  const hiddenBox = e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    return cs.display === 'none' || cs.visibility === 'hidden' || e.hasAttribute('inert') || e.hidden || (r.width < 1 && r.height < 1); };
  const visible = e => { const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || e.closest('[inert]')) return false;
    for (let p = e; p && p !== document.body; p = p.parentElement) { const c = getComputedStyle(p); if (c.opacity === '0' || c.display === 'none') return false; }
    return true; };
  const triggerFor = c => {
    const id = c.id; const cands = [];
    if (id) cands.push(...document.querySelectorAll('[aria-controls~="' + id + '"], [data-pop="' + id + '"], [href="#' + id + '"], [data-open="' + id + '"]'));
    const prev = c.previousElementSibling; if (prev && (prev.hasAttribute('aria-haspopup') || prev.hasAttribute('aria-expanded') || prev.hasAttribute('data-menu') || prev.hasAttribute('data-pop'))) cands.push(prev);
    const par = c.parentElement; if (par) { const b = par.querySelector(':scope > [aria-expanded], :scope > [data-menu], :scope > [data-pop], :scope > h3 > [aria-expanded]'); if (b && b !== c) cands.push(b); }
    if (c.matches('.dock, #dock')) cands.push(...document.querySelectorAll('[data-act="filters"], [data-act="dock"], [data-dock], [aria-controls="dock"]'));
    return cands.find(t => visible(t));
  };
  const status = e => {
    if (visible(e)) {
      const r = e.getBoundingClientRect();
      // a column head of a list that scrolls in its own container follows the rows sideways
      const head = e.closest('.rows.ui-table > .hd');
      if (head) { const tb = head.parentElement.querySelector(':scope > #tb'); const hr = head.getBoundingClientRect();
        if (tb && (r.right - hr.left) <= Math.max(tb.scrollWidth, tb.clientWidth) + 2) return 'vis'; }
      for (let p = e.parentElement; p && p !== document.documentElement; p = p.parentElement) {
        const c = getComputedStyle(p); const pr = p.getBoundingClientRect();
        const clipX = /(hidden|clip|auto|scroll)/.test(c.overflowX), scrollX = /(auto|scroll)/.test(c.overflowX) && p.scrollWidth > p.clientWidth + 1;
        if (clipX && !scrollX && (r.left >= pr.right - 1 || r.right <= pr.left + 1)) return 'lost';
        if (scrollX) return 'vis';
      }
      if (r.left >= iw - 1 || r.right <= 1) return 'lost';
      if (r.right > iw + 2 && document.documentElement.scrollWidth <= iw) return 'lost';
      return 'vis';
    }
    for (let c = e; c && c !== document.body; c = c.parentElement) { if (hiddenBox(c) || c.hasAttribute('inert')) { if (triggerFor(c)) return 'disc'; } }
    return 'hid';
  };
  const seen = new Set(); const out = {};
  for (const [k, sel] of KINDS) {
    document.querySelectorAll(sel).forEach(e => {
      if (seen.has(e) || e.closest('svg') || e.closest('.cke')) return; seen.add(e);
      const key = k + ' | ' + label(k, e); const s = status(e);
      out[key] = out[key] || { vis: 0, disc: 0, hid: 0, lost: 0 }; out[key][s]++;
    });
  }
  return JSON.stringify({ iw, sw: document.documentElement.scrollWidth, items: out });
})()`;

async function inventory(widths) {
  const srv = await serve(); const port = srv.address().port; const br = await browser();
  const res = {};
  try {
    for (const [name, p] of PAGES) {
      res[name] = {};
      for (const [w, h] of widths) {
        await br.open(`http://127.0.0.1:${port}/${p}.html`, w, h);
        res[name][w + 'x' + h] = JSON.parse(await br.evaluate(COLLECT));
      }
    }
  } finally { br.close(); srv.close(); }
  return res;
}

const parseWidths = s => String(s).split(',').map(x => { const [w, h] = x.split('x').map(Number); return [w, h || (w >= 1280 ? 900 : w < 900 ? 1024 : 768)]; });

if (arg('save')) {
  const r = await inventory([[1440, 900]]);
  const base = Object.fromEntries(Object.entries(r).map(([n, v]) => [n, v['1440x900'].items]));
  fs.writeFileSync(BASE, JSON.stringify(base, null, 1));
  const n = Object.values(base).reduce((a, v) => a + Object.values(v).reduce((b, c) => b + c.vis + c.disc + c.hid + c.lost, 0), 0);
  console.log(`baseline written: ${path.relative(ROOT, BASE)} — ${n} items on ${Object.keys(base).length} pages`);
  process.exit(0);
}
if (!fs.existsSync(BASE)) { console.log('no baseline — run with --save first'); process.exit(1); }
const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
const only = arg('list');
const widths = parseWidths(arg('widths', '1024x768,768x1024'));
const r = await inventory(widths);
let bad = 0;
for (const [name] of PAGES) {
  for (const [wk, m] of Object.entries(r[name])) {
    const b = base[name]; const t = m.items; const lines = [];
    for (const key of new Set([...Object.keys(b), ...Object.keys(t)])) {
      const B = b[key] || { vis: 0, disc: 0, hid: 0, lost: 0 }, T = t[key] || { vis: 0, disc: 0, hid: 0, lost: 0 };
      const tb = B.vis + B.disc + B.hid + B.lost, tt = T.vis + T.disc + T.hid + T.lost;
      if (tt < tb) lines.push(`    MISSING  ${key}  (${tb} → ${tt})`);
      else if (T.lost) lines.push(`    LOST     ${key}  (${T.lost} clipped or off screen)`);
      else if (T.vis + T.disc < B.vis + B.disc) lines.push(`    HIDDEN   ${key}  (reachable ${B.vis + B.disc} → ${T.vis + T.disc})`);
    }
    if (only === name) console.log(JSON.stringify(t, null, 1));
    const moved = Object.keys(b).filter(k => t[k] && (b[k].vis > t[k].vis) && (t[k].vis + t[k].disc >= b[k].vis + b[k].disc)).length;
    console.log(`${name.padEnd(15)} ${wk.padEnd(9)} page overflow ${m.sw > m.iw ? (m.sw - m.iw) + 'px' : 'none'} · ${lines.length ? lines.length + ' problem(s)' : 'all items reachable'}${moved ? ` · ${moved} item(s) behind a visible disclosure` : ''}`);
    if (lines.length) { console.log(lines.slice(0, 40).join('\n')); if (lines.length > 40) console.log(`    … ${lines.length - 40} more`); }
    bad += lines.length + (m.sw > m.iw ? 1 : 0);
  }
}
console.log(`\n${bad ? bad + ' problem(s)' : 'feature diff empty — every baseline item is reachable at every width'}`);
process.exit(0);
