/* Stage 2 acceptance sweep — read-only, run at each width. */
(function () {
  const s = ms => new Promise(r => setTimeout(r, ms));
  const px = v => Math.round(v);
  const q = (x, r) => (r || document).querySelector(x);
  const qa = (x, r) => [...(r || document).querySelectorAll(x)];

  window.__verify = async function () {
    const o = { viewport: [innerWidth, innerHeight] };
    const d = document.documentElement;

    await window.__reset();
    o.atRest = await window.__rowsAtRest();
    o.overflowDefault = d.scrollWidth - d.clientWidth;

    /* anchor, both directions and near the end */
    const anchors = {};
    for (const [name, idx] of [['first', 1], ['mid', 8], ['last', 99]]) {
      const r = await window.__openRow(idx, 0);
      anchors[name] = { delta: r.after.anchorDelta, spacer: r.after.expSpace.css, covered: r.after.rowsCovered,
        dimmed: r.after.rowsDimmed, edges: [r.after.edgeDeltaLeft, r.after.edgeDeltaRight], seam: r.after.seamGap,
        pos: r.after.workspace.position, foot: r.after.footBelowWorkspace, ovf: r.after.overflow,
        docGrowth: r.after.docHeight - 1882, wsH: r.after.workspace.h };
    }
    // upward travel
    await window.__openRow(12, 0);
    const from = px(scrollY);
    qa('.row')[1].click(); await s(1200);
    anchors.upward = { from, to: px(scrollY), delta: window.__contract().anchorDelta };
    o.anchor = anchors;

    /* close leaves the scroll alone */
    const yOpen = px(scrollY);
    q('.exp__x').click(); await s(500);
    o.close = { before: yOpen, after: px(scrollY), drift: px(scrollY) - yOpen, expGone: !q('#exp') };

    /* layers: the workspace must paint under the chrome */
    await window.__openRow(1, 0);
    const hd = q('.hd'), cmd = q('.cmd');
    o.layers = [];
    for (const y of [400, 800, 1200]) {
      scrollTo(0, y); await s(260);
      const e = q('#exp'), er = e.getBoundingClientRect(), hr = hd.getBoundingClientRect();
      let win = 'no overlap';
      if (er.top < hr.bottom && er.bottom > hr.top) {
        const my = px((Math.max(er.top, hr.top) + Math.min(er.bottom, hr.bottom)) / 2);
        const el = document.elementFromPoint(px(er.left + er.width / 2), my);
        win = el && el.closest('.hd') ? 'header' : (el && el.closest('#exp') ? 'WORKSPACE' : (el ? el.className : 'none'));
      }
      o.layers.push({ y, hdOpacity: getComputedStyle(hd).opacity, hdClass: hd.className, cmdClass: cmd.className, overlapWinner: win });
    }

    /* Stage 1 gains must hold */
    await window.__reset();
    q('[data-act="filters"]').click(); await s(600);
    const lanes = q('.cmdtop .lanes'), attn = q('.bento .attn');
    o.stage1 = {
      laneRailVisibleWithFiltersOpen: lanes ? getComputedStyle(lanes).display : null,
      attnPadding: attn ? getComputedStyle(attn).padding : null,
      dockOpen: q('#app').classList.contains('dock-open')
    };
    q('[data-act="filters"]').click(); await s(500);
    scrollTo(0, 1200); await s(300);
    o.stage1.stickyEngaged = { cmd: q('.cmd').className, hd: q('.hd').className, hdBottom: px(q('.hd').getBoundingClientRect().bottom) };
    o.stage1.focusOutline = (() => { const b = q('.lane'); b.focus();
      const c = getComputedStyle(b); return c.outlineWidth + ' ' + c.outlineStyle; })();
    await window.__reset();

    /* filters + vehicle together */
    await window.__openRow(1, 0);
    q('[data-act="filters"]').click(); await s(650);
    const c2 = window.__contract();
    o.filtersPlusVehicle = { anchorDelta: c2.anchorDelta, edges: [c2.edgeDeltaLeft, c2.edgeDeltaRight], ovf: c2.overflow,
      covered: c2.rowsCovered, rowRight: c2.selectedRow.right, wsRight: c2.workspace.right };
    await window.__reset();

    /* tray + vehicle: the tray must stay hit-testable */
    o.hits = await window.__hitTests();
    return o;
  };
  return 'verify2 ready';
})();
