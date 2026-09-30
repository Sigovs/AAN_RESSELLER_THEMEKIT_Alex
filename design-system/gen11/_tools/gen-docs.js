/* Generate INVENTORY.md and PAGE-SPECIFIC.md from the measured census.
   Both are data, not opinion: every row comes out of map-all.json, which the
   probe produced by walking the ten running pages. */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
const MAP = process.env.MAP || 'C:/Users/Sigoff/AppData/Local/Temp/claude/c------WORK-AAN-CONTROL-PANEL/9fea96e9-7862-4244-9ba4-4dc3cf5b706e/scratchpad/map-all.json';
const OUT = path.join(ROOT, 'design-system/gen11');

const j = JSON.parse(fs.readFileSync(MAP, 'utf8'));
const PAGES = ['dealer-login','all-vehicles','single-vehicle','all-leads','single-lead',
               'my-work-queue','single-ticket','manage-dealers','dealer-edit','accounting'];
const short = f => f.replace('-gen11.css','').replace('_aan-family.css','~family').replace('_aan-components.css','~components');

const uni = {};
for (const p of PAGES) {
  const pd = j[p]; if (!pd) continue;
  for (const [t, v] of Object.entries(pd.map)) {
    const u = uni[t] = uni[t] || { pages: [], files: new Set(), uses: 0, box: v.box, tag: v.tag, css: v.css, chain: v.chain };
    u.pages.push(p); u.uses += v.n;
    (v.files || []).forEach(f => u.files.add(f));
  }
}

// ── role guesses are NOT invented: they come from the block name and the page
//    it lives on. Where the role is not obvious the field says "—" rather than
//    a story.
const ROLE = {
  btn:'action', nav:'platform navigation', brand:'the AAN mark and wordmark', top:'platform bar',
  gsearch:'global search', tbtn:'icon-only header action', atlas:'link to the system wiki',
  me:'staff identity', dealer:'dealer identity', av:'avatar', head:'page or record head',
  caps:'caps micro-label', cmd:'sticky command band', cmdtop:'the row above the command band',
  sub:'scope line and filter row', field:'the workspace sheet', rows:'the list body',
  hd:'sticky column header', row:'one record', ck:'selection checkbox', foot:'count and pagination',
  lane:'a slice of the list', lanes:'the lane strip', facet:'a filter with a current value',
  seg:'segmented control', secnav:'section navigation', rail:'section rail',
  pop:'popover', mn:'menu', tag:'exception tag', st:'status chip', bdg:'status badge',
  bento:'the summary strip', focal:'dark focal panel', attn:'attention queue',
  tile:'one figure in a summary', dock:'contextual side panel', exp:'in-flow expansion',
  savebar:'the commit bar', tray:'bulk selection tray', zone:'a section of a record',
  fld:'form control', fl:'field label', f:'field', fw:'field wrapper', sw:'switch',
  swrow:'a switch with its consequence', opt:'a checkbox with its consequence',
  ev:'one entry in a feed', grp:'field group', panel:'utility panel', az:'alphabet index',
  tally:'filter counts', statuses:'status filter strip', deck:'metric strip',
  golive:'the go-live ticker', stat:'a figure in a dark panel', ar:'aging bar',
  agerow:'age with its bar', acts:'row action cluster', stk:'stock identifier',
  price:'money cell', mk:'state mark', vcar:'vehicle card', photo:'photo tile',
  cockpit:'editor head', prov:'provenance row', money:'money field with history',
  featrow:'a dense checklist row', kind:'entry kind', flag:'a boolean flag',
  chip:'small marker', grid:'field grid', form:'a form', legal:'legal footer',
  mark:'the AAN mark at panel scale', control:'a form control wrapper', eye:'reveal toggle',
  support:'support block', auth:'the front-door layout', formrow:'a field row',
};

function blockRows() {
  const blocks = {};
  for (const [t, u] of Object.entries(uni)) {
    const b = t.split(/__|--/)[0];
    (blocks[b] = blocks[b] || []).push([t, u]);
  }
  return Object.entries(blocks).map(([b, ts]) => {
    const pages = new Set(), files = new Set();
    let uses = 0, sharedOnly = true, variants = 0, states = 0;
    ts.forEach(([t, u]) => {
      u.pages.forEach(p => pages.add(p));
      u.files.forEach(f => { files.add(f); if (!/^_aan-/.test(f)) sharedOnly = false; });
      uses += u.uses;
      if (/--/.test(t)) { variants++; if (/--(on|open|stuck|sel|dirty|done|danger|del|active|current|dis)/.test(t)) states++; }
    });
    const rep = ts.sort((a, z) => z[1].uses - a[1].uses)[0];
    return { block: b, tokens: ts, nTokens: ts.length, variants, states,
             pages: [...pages], files: [...files], uses, sharedOnly,
             box: rep[1].box, css: rep[1].css, chain: rep[1].chain, tag: rep[1].tag };
  }).sort((a, z) => z.pages.length - a.pages.length || z.uses - a.uses);
}

const rows = blockRows();
const shared = rows.filter(r => r.pages.length >= 2);
const single = rows.filter(r => r.pages.length === 1);

// ────────────────────────────────────────────────────────── INVENTORY.md
{
  const L = [];
  const w = s => L.push(s);
  w('# Gen 11 — INVENTORY');
  w('');
  w('Every reusable visible element in the shipped Gen 11 UI, discovered by walking the');
  w('ten pages rather than by deciding in advance what a design system ought to contain.');
  w('');
  w('Generated by `_tools/gen-docs.js` from the probe census. Geometry is measured at');
  w('1440×900 on the instance that occurs most often.');
  w('');
  w('| | |');
  w('|---|---|');
  w(`| class tokens on visible boxes | **${Object.keys(uni).length}** |`);
  w(`| component blocks | **${rows.length}** |`);
  w(`| shared families (2+ pages) | **${shared.length}** |`);
  w(`| page-specific families | **${single.length}** — see PAGE-SPECIFIC.md |`);
  w(`| variant tokens (\`block--variant\`) | **${rows.reduce((n, r) => n + r.variants, 0)}** |`);
  w(`| state tokens | **${rows.reduce((n, r) => n + r.states, 0)}** |`);
  w('');
  w('---');
  w('');
  w('## Shared families');
  w('');
  w('| family | role | pages | tokens | variants | uses | box | padding | gap | radius | styled by |');
  w('|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of shared) {
    const c = r.css || {};
    w(`| \`.${r.block}\` | ${ROLE[r.block] || '—'} | ${r.pages.length} | ${r.nTokens} | ${r.variants} | ${r.uses} | ${r.box} | ${c.p || '—'} | ${c.g && c.g !== 'normal' ? c.g : '—'} | ${c.r || '—'} | ${r.files.map(short).join(' ')} |`);
  }
  w('');
  w('---');
  w('');
  w('## Every token, by family');
  w('');
  for (const r of shared) {
    w(`### \`.${r.block}\` — ${ROLE[r.block] || 'role not inferred from source'}`);
    w('');
    w(`${r.pages.join(', ')} · ${r.uses} uses · ${r.sharedOnly ? 'shared layer only' : 'needs a page stylesheet'}`);
    w('');
    w(`Context: \`${r.chain || '—'}\``);
    w('');
    w('| token | tag | box | padding | radius | background |');
    w('|---|---|---|---|---|---|');
    for (const [t, u] of r.tokens.sort((a, z) => z[1].uses - a[1].uses)) {
      const c = u.css || {};
      w(`| \`.${t}\` | ${u.tag} | ${u.box} | ${c.p || '—'} | ${c.r || '—'} | ${c.bg || '—'} |`);
    }
    w('');
  }
  fs.writeFileSync(path.join(OUT, 'INVENTORY.md'), L.join('\n'));
  console.log('INVENTORY.md', L.length, 'lines');
}

// ─────────────────────────────────────────────────────── PAGE-SPECIFIC.md
{
  const L = [];
  const w = s => L.push(s);
  w('# Gen 11 — PAGE-SPECIFIC PATTERNS');
  w('');
  w('A pattern that occurs on exactly one page. It is recorded here rather than forced');
  w('into a shared abstraction it does not fit — a register of one is still a register,');
  w('and a family of one is a lie.');
  w('');
  w('Generated by `_tools/gen-docs.js`. A pattern leaves this file when a second page');
  w('starts using it, not when someone decides it ought to be shared.');
  w('');
  w(`**${single.length} page-specific families** across the ten pages.`);
  w('');
  const byPage = {};
  for (const r of single) (byPage[r.pages[0]] = byPage[r.pages[0]] || []).push(r);
  for (const p of PAGES) {
    const list = (byPage[p] || []).sort((a, z) => z.uses - a.uses);
    if (!list.length) continue;
    w(`## ${p} — ${list.length} families`);
    w('');
    w('| family | role | tokens | uses | box | padding | radius | why it stays here |');
    w('|---|---|---|---|---|---|---|---|');
    for (const r of list) {
      const c = r.css || {};
      const why = r.sharedOnly ? 'styled by the shared layer but used once' : 'styled only by this page\'s stylesheet';
      w(`| \`.${r.block}\` | ${ROLE[r.block] || '—'} | ${r.nTokens} | ${r.uses} | ${r.box} | ${c.p || '—'} | ${c.r || '—'} | ${why} |`);
    }
    w('');
  }
  fs.writeFileSync(path.join(OUT, 'PAGE-SPECIFIC.md'), L.join('\n'));
  console.log('PAGE-SPECIFIC.md', L.length, 'lines');
}
