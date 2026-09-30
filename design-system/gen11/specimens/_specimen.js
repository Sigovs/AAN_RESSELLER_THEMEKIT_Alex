/* ============================================================================
   SPECIMEN HOST — auto-height, and a stage for out-of-flow specimens

   A specimen host is embedded in the catalogue with an <iframe> so that the
   product's own stylesheet stack can be loaded without colliding with the
   nine other stacks. The iframe has to be as tall as its content, so the host
   reports its height to the parent and again whenever it changes.
   ========================================================================== */
(function () {
  'use strict';

  /* ── out-of-flow specimens ────────────────────────────────────────────
     Some components ship `position: fixed` — the commit bar on Single
     Vehicle and Dealer Edit is fixed to the bottom of the viewport. Dropped
     into a specimen host unchanged, such a component leaves the flow: its
     stage collapses to zero height and the component itself stretches across
     the whole catalogue page, 3000px below where it belongs.

     The fix does NOT touch the specimen. A transform on an ancestor makes
     that ancestor the containing block for `position: fixed` descendants, so
     the stage is given one and the specimen — still `position: fixed`, still
     byte for byte what the product ships — anchors to the stage instead of
     to the viewport. The stage is then given the specimen's own measured
     height, because an out-of-flow child lends its parent none.

     This runs in the host rather than in the generator because it is a
     measurement: whether a component is out of flow is a fact about the
     effective CSS, not something worth hand-declaring in spec.json and
     getting wrong later. */
  function anchorOutOfFlow() {
    var stages = document.querySelectorAll('.sp-stage');
    for (var i = 0; i < stages.length; i++) {
      var stage = stages[i];
      var el = specimenIn(stage);
      if (!el) continue;
      /* `fixed` only. A sticky element is still in flow: it is laid out and
         sized by its container exactly like any other child, and only its
         paint position changes on scroll. Treating sticky as out-of-flow
         stretched five specimens — the section bar, the workflow dock, the
         section rail, the crew dock and the zone rail — to the full stage
         width instead of the 224–980px the product gives them. */
      if (getComputedStyle(el).position !== 'fixed') continue;
      /* A viewport-anchored bar is as wide as the viewport, which is wider
         than the workspace the other specimens stand in. Bleed it back
         through the host's 16px gutter rather than reporting it 32px narrow
         than the product draws it. */
      stage.style.width = 'auto';
      stage.style.maxWidth = 'none';
      stage.style.marginInline = 'calc(var(--s4, 16px) * -1)';
      var h = Math.ceil(el.getBoundingClientRect().height) || 48;
      stage.style.setProperty('--sp-h', h + 'px');
      stage.classList.add('sp-stage--anchor');
    }
  }

  /* ── the stage reproduces the container the product gives the component ──
     Nearly every component in Gen 11 is sized by something above it: a grid
     track in a row, a flex track in the platform bar, a column in the
     workspace. The catalogue cannot bring those ancestors along intact —
     `.app` is a 100vh page grid, `.field` is a full-height workspace, and
     left alone they make every specimen 900px tall and nine-tenths empty, so
     the chain is flattened.

     Flattening the chain also destroys the geometry that sized the specimen.
     Measured across the ten hosts before this was added: 80 of 120 specimens
     rendered at the wrong size. A status chip the product draws at 80px wide
     was 1396px wide. A health-tag group the product wraps onto three lines at
     230px was one line at 1408px. Those are not the shipped components.

     So the stage — catalogue chrome, never the specimen — is given the width
     the component has in the product, recorded by the extractor at 1440 and
     written onto the stage as `data-sp-box`. The specimen is untouched; it
     simply stands in a container the size of its real one.

     `width` with `max-width: 100%`, not `max-width` alone, because the drift
     runs both ways: an elastic flex member such as the global search
     collapses to 112px out of the bar when the product gives it 232px.
     `max-width: 100%` keeps a full-width specimen honest at 1366 and 1280,
     where it should reflow exactly as the page does. */
  function specimenIn(stage) {
    var el = stage.firstElementChild;
    while (el && el.hasAttribute('data-sp-chain')) el = el.firstElementChild;
    return el;
  }

  /* THE STAGE REPRODUCES THE CONTAINER THE PRODUCT GIVES THE COMPONENT.

     Almost nothing in Gen 11 sizes itself. A status chip is the width of its
     grid cell, a metric tile the height of the tallest tile in its strip, the
     global search the width of its flex basis inside the platform bar, the
     login brand panel the full height of the page. The catalogue cannot bring
     those ancestors along intact — `.app` is a 100vh page grid and `.field` a
     full-height workspace, so the chain is flattened to `display: contents`
     and the boxes that did the sizing are gone with it.

     So the stage stands in for them. It is catalogue chrome: nothing here
     lands on the specimen, which is why the container is searched for rather
     than declared on the component.

     `data-sp-box` is the WxH the extractor measured on the shipped page at
     1440. The stage is set to that size, and then three container types are
     tried and the one that reproduces the product's box is kept:

       block   a plain box. A block-level child fills it exactly, and cannot
               be pushed past it by its own min-content.
       grid    one item, stretched in both axes. This is what a parent grid
               did — and the only thing that stretches a `button` or a `span`,
               which shrink to fit in a block. Its cost is that a grid item's
               automatic minimum size is its min-content, which for a few wide
               flex rows overshoots: the ticket record head went to 1628px
               against the product's 1396px.
       flex    a flex row, for items whose main size comes from `flex-basis`
               rather than `width`. The global search declares
               `flex: 0 1 232px; width: 232px`, and a media query under 1520px
               narrows only the width to 112px; inside the bar the basis wins
               and the product draws 232px.

     Measured, not reasoned about: whichever container lands closest to the
     product box is the one that stays. Before this, 80 of 120 specimens
     rendered at the wrong size. */

  function boxOf(el) {
    var b = el.getBoundingClientRect();
    return { w: b.width, h: b.height };
  }

  function errAgainst(el, w, h) {
    var b = boxOf(el);
    /* width is weighted above height: a component at the wrong width is a
       different component, while a few px of height is usually one line box */
    return Math.abs(b.w - w) * 2 + (h ? Math.abs(b.h - h) : 0);
  }

  function apply(stage, mode, minH) {
    var grid = mode === 'grid' || mode === 'grid1fr';
    stage.style.display = mode === 'block' ? '' : (grid ? 'grid' : mode);
    /* `grid1fr` differs from `grid` in one declaration, and it matters. A
       grid's default `auto` track sizes to the item's max-content, so a panel
       whose content measures 860px got an 860px track inside a 911px stage
       and never reached the 911px the product draws. `minmax(0, 1fr)` makes
       the track fill the stage instead, and the item stretches to it.
       Both are kept as candidates because `1fr` is not always right either —
       for a component narrower than its stage by design, the auto track is
       the honest one. */
    stage.style.gridTemplateColumns = mode === 'grid1fr' ? 'minmax(0, 1fr)' : '';
    stage.style.alignContent = grid ? 'stretch' : '';
    /* `justify-items: stretch` explicitly, not left to `normal`. For a grid
       item that is a form control — and a great many Gen 11 components are a
       `<button>` — `normal` behaves as `start`, so the provenance row stayed
       at its 151px content width inside a 364px stage and the accounting
       focal tile at 142px inside 337px. */
    stage.style.justifyItems = grid ? 'stretch' : '';
    stage.style.alignItems = mode === 'flex' ? 'stretch' : '';
    stage.style.minHeight = minH ? minH + 'px' : '';
  }

  function sizeStages() {
    var stages = document.querySelectorAll('.sp-stage[data-sp-box]');
    for (var i = 0; i < stages.length; i++) {
      var stage = stages[i];
      var box = stage.getAttribute('data-sp-box').split('x');
      /* parseFloat, not parseInt — see `boxPx` in extract.html: the stage is
         sized to the sub-pixel, because half a pixel decides a wrap. */
      var w = parseFloat(box[0]), h = parseFloat(box[1]);
      if (!w) continue;

      /* The recorded height is only honoured at the reference viewport it
         was measured in. Several components take their height from the
         viewport itself: the workflow dock and the crew dock are sticky,
         with a max-height of calc(100vh - something). On a 1366x610 laptop
         the product gives them 538px and everything fits, but a stage still
         holding them to the 820px measured at 1440x900 pushed their own
         controls outside them. Below the reference height the stage
         reproduces the width and lets the component be as tall as the
         viewport makes it, which is what the product does. */
      var hRef = window.innerHeight >= 880 ? h : 0;

      var el = specimenIn(stage);
      if (!el) continue;

      /* `data-sp-box` is the specimen's BORDER box. What the stage has to
         offer is that plus the specimen's own margins — the global search
         carries `margin-right: 6px`, the health tags `margin: 0 -6px`, and a
         stage sized to the border box alone is wrong by exactly those. */
      var ec = getComputedStyle(el);
      var mx = (parseFloat(ec.marginLeft) || 0) + (parseFloat(ec.marginRight) || 0);
      /* Half a pixel of slack. In the product the lane strip is a flex item
         stretched by its toolbar to 1233.46px and its twelve lanes end at
         1233.46 — exactly flush. A stage of precisely that width puts the
         last lane on the boundary, and the browser wraps it onto a second
         line the product never shows. The slack is below the 2px tolerance
         the drift check allows, so it cannot hide a real difference; it only
         stops a rounding tie from reading as a layout change. */
      stage.style.width = (w + mx + 0.5) + 'px';
      stage.style.maxWidth = '100%';

      var best = null, tried = [];
      var modes = ['block', 'grid', 'grid1fr', 'flex'];
      for (var m = 0; m < modes.length; m++) {
        apply(stage, modes[m], 0);
        var e0 = errAgainst(el, w, hRef);
        var cand = { mode: modes[m], minH: 0, err: e0 };
        /* with a min-height the container can also lend the specimen the
           height an ancestor lent it in the product — only ever more, never
           a crop */
        if (hRef && hRef - boxOf(el).h > 2 && modes[m] !== 'block') {
          apply(stage, modes[m], hRef);
          var e1 = errAgainst(el, w, hRef);
          if (e1 < e0) cand = { mode: modes[m], minH: hRef, err: e1 };
        }
        tried.push(modes[m] + ':' + cand.err.toFixed(1));
        if (!best || cand.err < best.err - 0.5) best = cand;
      }
      apply(stage, best.mode, best.minH);
      /* The chosen container, on the element, so a QA sweep or anyone with
         devtools can see which one reproduced the product and why. */
      stage.setAttribute('data-sp-fit', best.mode + (best.minH ? '+h' : '') + ' err=' + best.err.toFixed(1) + ' [' + tried.join(' ') + ']');

      /* scroll only where the specimen genuinely exceeds its container —
         see `.sp-stage--scroll` in _specimen.css for why this is not left on */
      if (boxOf(el).w > stage.clientWidth + 1) stage.classList.add('sp-stage--scroll');
    }
  }

  function report() {
    var h = Math.ceil(document.documentElement.getBoundingClientRect().height);
    parent.postMessage({ aanSpecimen: true, id: document.body.dataset.specimenId || location.pathname, height: h }, '*');
  }

  window.addEventListener('load', function () {
    sizeStages();
    anchorOutOfFlow();
    report();
    // fonts and images settle after load and change the height
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(report);
    setTimeout(report, 400);
    setTimeout(report, 1200);
    if (window.ResizeObserver) new ResizeObserver(report).observe(document.documentElement);
  });
  window.addEventListener('resize', report);
})();
