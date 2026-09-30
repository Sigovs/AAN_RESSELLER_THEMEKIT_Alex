/* Emit design-system/gen11/specimens/<stack>.html from the extracted fragments.
   Every specimen is the product's own DOM, wrapped in the product's own ancestor
   chain, rendered by the product's own stylesheets. Nothing here draws a
   component. */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/____WORK/AAN CONTROL PANEL/AAN_RESSELLER_THEMEKIT_ALEX';
const FRAGS = 'C:/Users/Sigoff/AppData/Local/Temp/claude/c------WORK-AAN-CONTROL-PANEL/9fea96e9-7862-4244-9ba4-4dc3cf5b706e/scratchpad/frags.json';
const OUTDIR = path.join(ROOT, 'design-system/gen11/specimens');

const frags = JSON.parse(fs.readFileSync(FRAGS, 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// a fragment's relative asset URLs are written from the product page's folder
function rebase(html, pagePath) {
  const dir = path.posix.dirname('../../../pages/' + pagePath); // e.g. ../../../pages/dealer
  return html
    .replace(/(\s(?:src|href))="(?!https?:|#|data:|\/)([^"]+)"/g, (m, attr, url) => `${attr}="${dir}/${url}"`);
}

// rebuild the ancestor chain the component's CSS is scoped to
/* Rebuild the ancestor chain the specimen's CSS is scoped to.

   Class, id AND attributes: Gen 11 scopes on all three. `--cols` on My Work
   Queue lives on `.field[data-cols="mine"]`, and a wrapper that carried only
   the class matched nothing, leaving the row specimen with a single 1352px
   column instead of sixteen tracks. `chainOf()` in extract.html decides what
   is safe to copy; this only writes it out. */
function attrs(a) {
  if (!a) return '';
  let s = '';
  for (const [k, v] of Object.entries(a)) {
    s += v === '' ? ` ${k}` : ` ${k}="${String(v).replace(/"/g, '&quot;')}"`;
  }
  return s;
}

function wrap(html, chain) {
  let open = '', close = '';
  for (const a of chain) {
    const cls = a.c ? ` class="${a.c}"` : '';
    const id = a.i ? ` id="${a.i}"` : '';
    open += `<${a.t}${id}${cls}${attrs(a.a)} data-sp-chain>`;
    close = `</${a.t}>` + close;
  }
  return open + html + close;
}

const STACKS = {
  av:            { deps: ['dealer/all-vehicles-gen11.css'] },
  leads:         { deps: ['dealer/all-vehicles-gen11.css', 'dealer/all-leads-gen11.css'] },
  lead:          { deps: ['dealer/all-vehicles-gen11.css', 'dealer/single-lead-gen11.css'] },
  vehicle:       { deps: ['dealer/single-vehicle-gen11.css'] },
  login:         { deps: ['dealer/dealer-login-gen11.css'] },
  queue:         { deps: ['staff/my-work-queue-gen11.css'] },
  ticket:        { deps: ['staff/single-ticket-gen11.css'] },
  dealers:       { deps: ['staff/manage-dealers-gen11.css'] },
  'dealer-edit': { deps: ['staff/dealer-edit-gen11.css'] },
  accounting:    { deps: ['staff/accounting-view-all-gen11.css'] },
};

/* A build stamp on the chrome URLs. The hosts are static files served with
   ordinary caching, and a stale _specimen.js is invisible: the catalogue
   renders, just with the previous build's stage logic, and a QA sweep then
   reports on a version that is no longer on disk. Cost this once already —
   nine specimens read as mis-sized against a fix that was already written. */
const BUILD = Date.now().toString(36);

let written = 0, specimens = 0;

for (const [stack, S] of Object.entries(frags)) {
  const deps = STACKS[stack].deps;
  /* The product stylesheets carry the build stamp too. The shipped pages link
     them with their own `?v=...` cache buster; a specimen host that linked the
     bare path got whatever the browser had cached, which is how the queue's
     lane strip came to wrap onto two lines in the catalogue and one in the
     product - the host was rendering a copy of the stylesheet from before the
     `flex-wrap: nowrap` rule was added. A catalogue that silently shows last
     week's product is worse than no catalogue. */
  const links = [
    ...deps.map(d => `<link rel="stylesheet" href="../../../pages/${d}?b=${BUILD}">`),
    `<link rel="stylesheet" href="../../../pages/_aan-family.css?b=${BUILD}">`,
    `<link rel="stylesheet" href="../../../pages/_aan-components.css?b=${BUILD}">`,
  ].join('\n');

  const body = [];
  for (const g of S.groups) {
    body.push(`<h2 class="sp-group">${esc(g.group)}</h2>`);
    for (const it of g.items) {
      if (it.missing) continue;
      specimens++;
      const chainStr = it.chain.map(a => a.c ? '.' + a.c.split(/\s+/).join('.') : a.t).join(' › ') || '—';
      const sources = [...deps, '_aan-family.css', '_aan-components.css']
        .map(d => 'pages/' + d.replace('_aan', '_aan')).join(' · ');
      body.push(
`<section class="sp">
  <div class="sp-head">
    <span class="sp-name">${esc(it.name)}</span>
    <span class="sp-role">${esc(it.role || '')}</span>
  </div>
  <div class="sp-stage sp-stage--bare" data-sp-box="${esc(it.boxPx || it.box)}">
${wrap(rebase(it.html, S.page), it.chain)}
  </div>
  <dl class="sp-prov">
    <dt>Selector</dt><dd>${esc(it.tag)}${it.cls ? '.' + esc(it.cls.split(/\s+/).join('.')) : ''}</dd>
    <dt>Context</dt><dd>${esc(chainStr)}</dd>
    <dt>Source</dt><dd>${esc(sources)}</dd>
    <dt>Used on</dt><dd class="sp-plain">${esc(S.title)}</dd>
    <dt>Measured</dt><dd>${esc(it.box)} · padding ${esc(it.css.pad)}${it.css.gap ? ' · gap ' + esc(it.css.gap) : ''} · radius ${esc(it.css.r)}</dd>
  </dl>${it.note ? `\n  <p class="sp-note">${esc(it.note)}</p>` : ''}
</section>`);
    }
  }

  const html =
`<!doctype html>
<html lang="en" data-theme="light" class="sp-doc">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Specimens — ${esc(S.title)}</title>

<!-- ══ GENERATED FILE ═════════════════════════════════════════════════════
     design-system/gen11/_tools/gen-specimens.js writes this from fragments
     pulled out of the running product. Do not hand-edit: the next run will
     overwrite it. Change the specimen list in _tools/spec.json instead.

     THE STYLESHEETS BELOW ARE THE PRODUCT'S OWN, IN THE PRODUCT'S OWN ORDER.
     Copied from pages/${esc(S.page)}. Not a bundle, not an extract —
     the same files the shipped page loads. A specimen therefore cannot drift
     from the product: if the product changes, so does the specimen.
     ─────────────────────────────────────────────────────────────────── -->
${links}
<!-- catalogue chrome last; every rule in it is namespaced sp-* -->
<link rel="stylesheet" href="_specimen.css?b=${BUILD}">
<script src="_specimen.js?b=${BUILD}" defer></script>
</head>

<body class="sp-host" data-specimen-id="${esc(stack)}">

<!-- THIS PAGE'S OWN ICON SPRITE, copied verbatim from pages/${esc(S.page)}.
     Not a shared one: every Gen 11 page inlines a different set — All
     Vehicles 34 symbols, Single Ticket 24, Dealer Edit 16 — and a
     catalogue built on one page's sprite leaves the other pages' icons
     pointing at symbols that do not exist. -->
${S.sprite || ''}

<!-- Each specimen carries the real ancestor chain it was found in. Gen 11
     scopes a great deal of its CSS (\`.exp .veh__acts\`, \`.row > .th\`,
     \`.top .nav__b\`), so a leaf lifted out of its context renders unstyled.
     The chain is listed under CONTEXT in every provenance block below.
     Ids repeat across specimens on this page; that is invalid HTML but CSS
     id selectors still match, which is what a specimen host needs. -->

${body.join('\n\n')}

</body>
</html>
`;
  fs.writeFileSync(path.join(OUTDIR, stack + '.html'), html);
  written++;
}

console.log('wrote', written, 'specimen hosts with', specimens, 'specimens');
