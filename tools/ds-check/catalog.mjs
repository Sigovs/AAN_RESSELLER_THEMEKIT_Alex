// Component catalogue: measure each Gen 11 component on its ORIGIN page (DESIGN.md precedence:
// All Vehicles > Single Vehicle > All Leads > Single Lead > Dealer Login > My Work > Single Ticket >
// Manage Dealers > Dealer Edit > Accounting) and collect every rule that styles it, states included.
import { serve, browser } from 'file:///C:/____WORK/AAN%20CONTROL%20PANEL/AAN_RESSELLER_THEMEKIT_ALEX/tools/ds-check/lib.mjs';
import fs from 'node:fs'; import path from 'node:path';
const D = path.resolve('handoff/catalog') + '/';
const AV = 'pages/dealer/all-vehicles-gen11.html', SV = 'pages/dealer/single-vehicle-gen11.html', AL = 'pages/dealer/all-leads-gen11.html',
      SL = 'pages/dealer/single-lead-gen11.html', LG = 'pages/dealer/dealer-login-gen11.html', MW = 'pages/staff/my-work-queue-gen11.html',
      ST = 'pages/staff/single-ticket-gen11.html', MD = 'pages/staff/manage-dealers-gen11.html', DE = 'pages/staff/dealer-edit-gen11.html';
// [component, their ui-* name, origin page, selector, prep js]
const C = [
  ['Button · primary', 'ui-btn--primary', AV, '.btn--primary'],
  ['Button · secondary (sheet)', 'ui-btn', AV, '.btn--sheet'],
  ['Button · quiet', 'ui-btn--ghost', AV, '.btn--quiet'],
  ['Button · danger', 'ui-btn--danger', MD, '.btn--danger', `document.querySelector('[data-act="pkg-new"]')&&document.querySelector('[data-act="pkg-new"]').click()`],
  ['Field · text input', 'ui-input', SV, 'input.in'],
  ['Field · select', 'ui-select', AV, '.sel'],
  ['Field · checkbox', 'ui-checkbox', AL, '#sel-all, .ck'],
  ['Search', 'ui-search', AV, '.search'],
  ['Facet (filter button)', 'ui-facet', AV, '.cmd .facet__b'],
  ['View track (lanes / tabs)', 'ui-seg / ui-tabs', AV, '.ui-views'],
  ['View · current', 'ui-tabs__tab--on', AV, '.ui-view--on'],
  ['Segmented control', 'ui-seg', SV, '.seg'],
  ['Switch', 'ui-switch', AV, '.sitesw', `const r=document.querySelector('#tb .row'); r&&r.click()`],
  ['Status chip', 'ui-badge', AV, '.stat'],
  ['Tag / chip', 'ui-chip', AV, '.tag'],
  ['Platform bar', 'ui-topbar', AV, '.top'],
  ['Nav item', 'ui-topnav__item', AV, '.nav__b'],
  ['Global search', 'ui-topbar__search', AV, '.gsearch'],
  ['Page head', 'ui-page-header', AV, '.head'],
  ['Page title', 'ui-page-header__title', AV, '.head h1'],
  ['Board card (dark)', 'ui-cockpit / ui-pulsecard', AV, '.focal, .bento > *, .board > *'],
  ['Field sheet (list container)', 'ui-panel', AV, '.field'],
  ['Command row', 'ui-filterbar', AV, '.cmd'],
  ['Table header', 'ui-table__head', AV, '.hd'],
  ['Table row', 'ui-table__row', AV, '.row'],
  ['Menu / popover', 'ui-menu', AV, '.pop'],
  ['Menu item', 'ui-menu__item', AV, '.mn__it'],
  ['Pagination', 'ui-pagination', AV, '.pgr, .foot.pgr'],
  ['Section card (record page)', 'ui-panel (record)', SV, '.zone'],
  ['Disclosure row', 'ui-disclosure', SV, '.zone__h'],
  ['Save bar', 'ui-savebar', SV, '.savebar, .sbar'],
  ['Record head card', 'ui-page-header (record)', SL, '.head--card'],
  ['Section navigator', 'ui-subtab', SL, '.secnav'],
  ['Dock (side panel)', 'ui-panel (side)', SL, '.dock'],
  ['Login card', 'ui-auth', LG, '.card, .login, form'],
  ['Feed entry (history)', 'ui-stream__item', ST, '.ev, .msg'],
  ['Dialog', 'ui-modal', MD, 'dialog.modal', `document.querySelector('[data-act="pkg-new"]')&&document.querySelector('[data-act="pkg-new"]').click()`],
  ['Counts strip', 'ui-statstrip', MD, '.tally'],
  ['Empty state', 'ui-empty', MD, '.empty'],
  ['Form field group', 'ui-field', DE, '.fw'],
  ['Form label', 'ui-field__label', DE, '.fl'],
];
const PROPS = ['display', 'width', 'height', 'minHeight', 'padding', 'margin', 'gap', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textTransform',
  'color', 'backgroundColor', 'backgroundImage', 'borderTop', 'borderRadius', 'boxShadow', 'outline', 'transition', 'opacity'];
const s = await serve(path.resolve('C:/____WORK/AAN CONTROL PANEL/AAN_RESSELLER_THEMEKIT_ALEX')); const b = await browser();
const port = s.address().port; const out = []; let cur = null;
for (const [name, ui, page, sel, prep] of C) {
  if (cur !== page || prep) { await b.open(`http://127.0.0.1:${port}/${page}`, 1440, 900, 1500); cur = prep ? null : page; }
  if (prep) { await b.evaluate(`(()=>{ ${prep}; return 1 })()`); await new Promise(r => setTimeout(r, 400)); }
  const r = await b.evaluate(`(()=>{
    const el=[...document.querySelectorAll(${JSON.stringify(sel)})].find(e=>e.getClientRects().length)||document.querySelector(${JSON.stringify(sel)});
    if(!el) return { missing: true };
    const cs=getComputedStyle(el); const comp={}; ${JSON.stringify(PROPS)}.forEach(p=>comp[p]=cs[p]);
    const rect=el.getBoundingClientRect();
    const rules=[]; const strip=s=>s.replace(/::?(hover|focus-visible|focus|active|checked|disabled|focus-within|placeholder|before|after|not\\([^)]*\\))/g,'').trim()||'*';
    for (const sh of document.styleSheets){ let rs; try{ rs=sh.cssRules; }catch(e){ continue; } const file=(sh.href||'inline').split('/').pop().split('?')[0];
      const walk=(list,media)=>{ for (const x of list){ if(x.cssRules && !x.selectorText){ walk(x.cssRules,(x.conditionText||x.media&&x.media.mediaText||'')); continue; } if(!x.selectorText) continue;
        const hit=x.selectorText.split(',').some(p=>{ try{ return el.matches(strip(p)); }catch(e){ return false; } });
        if(hit) rules.push({file, media, sel:x.selectorText.slice(0,160), css:x.style.cssText.slice(0,600)}); } };
      walk(rs,''); }
    return { tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0,80), size: Math.round(rect.width)+'x'+Math.round(rect.height), comp, rules, html: el.outerHTML.replace(/\\s+/g,' ').slice(0,500) };
  })()`);
  out.push({ name, ui, page, sel, ...r });
  process.stdout.write((r.missing ? 'x' : '.'));
}
fs.writeFileSync(D + 'gen11-components-measured.json', JSON.stringify(out, null, 1));
console.log('\n' + out.map(x => (x.missing ? 'MISSING ' : '') + x.name + ' ← ' + x.page.split('/').pop() + ' ' + (x.size || '') + ' rules ' + (x.rules ? x.rules.length : 0)).join('\n'));
b.close(); s.close();
