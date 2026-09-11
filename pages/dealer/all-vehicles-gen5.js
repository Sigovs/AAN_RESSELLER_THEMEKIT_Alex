/* All Vehicles — Gen 5 behaviour. Rows as objects, filters drawer, quick inspector. Local demo data, no network. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (id, c) { return '<svg class="i ' + (c || '') + '"><use href="#' + id + '"/></svg>'; };

  var SW = [['silver', '#b7bbc1'], ['grey', '#8d9197'], ['gray', '#8d9197'], ['white', '#f0f0ec'], ['black', '#1c1d21'], ['red', '#c8272c'], ['blue', '#2a5db8'], ['green', '#2f6b47'], ['yellow', '#e8c027'], ['orange', '#e8721c'], ['verde', '#245c3e'], ['volcan', '#d8ad2c'], ['diamond', '#ece9e2']];
  function swatch(name) { var n = (name || '').toLowerCase(); for (var i = 0; i < SW.length; i++) if (n.indexOf(SW[i][0]) >= 0) return SW[i][1]; return '#c9ccd2'; }

  var V = (window.AAN_G5 || []).map(function (r, i) {
    var f = r.flags || [];
    return { id: 'v' + i, stock: r.stock, vin: r.vin, year: r.year, make: r.make, model: r.model, trim: r.trim || '', ext: r.ext || '', price: r.price, days: r.days, thumb: r.thumb, lock: r.lock, status: 'Available',
      no_price: f.some(function (t) { return /No price/.test(t); }), no_photos: f.some(function (t) { return /No photos/.test(t); }), hidden: f.some(function (t) { return /Hidden/.test(t); }), feed_excluded: f.some(function (t) { return /Excluded/.test(t); }), sale_pending: f.some(function (t) { return /Sale pend/.test(t); }) };
  });
  V.forEach(function (v) { v.issues = ['no_price', 'no_photos', 'hidden', 'feed_excluded', 'sale_pending'].filter(function (k) { return v[k]; }).length; });

  var MAKES = [['Porsche',54],['Ford',47],['Ferrari',42],['Lamborghini',27],['McLaren',20],['Mercedes-Benz',20],['Chevrolet',16],['Dodge',12],['Land Rover',12],['Audi',11],['BMW',9],['Ducati',9],['Cadillac',7],['Nissan',6],['Bentley',5],['Kenworth',4],['Peterbilt',4],['Acura',3],['Aston Martin',3],['GMC',3],['Rolls-Royce',3],['Tesla',3],['Jeep',2],['Jensen',2],['Karma',2],['Toyota',2],['Chaparral',1],['Honda',1],['Kia',1],['Koenigsegg',1],['Terex',1],['SUNDOWNER',1]];
  var ATTN = { no_price: 'No price', no_photos: 'No photos', hidden: 'Hidden on site', feed_excluded: 'Excluded from feeds', sale_pending: 'Sale pending', aging365: 'Aging over 1 year' };
  var AGE = { fresh: 'New ≤ 30d', mid: '31–90 days', late: '91–365 days', stale: 'Over 1 year' };
  var SLOTS = [
    { k: "no_price", h: "No price", t: "No price", icon: "i-tag-off", tone: "" },
    { k: "no_photos", h: "No photos", t: "No photos", icon: "i-cam-off", tone: "" },
    { k: "feed_excluded", h: "Excluded from feeds", t: "Feed off", icon: "i-ban", tone: "danger" },
    { k: "hidden", h: "Hidden on site", t: "Hidden", icon: "i-eye-off", tone: "slate" },
    { k: "sale_pending", h: "Sale pending", t: "Pending", icon: "i-clock", tone: "violet" }
  ];
  var S = { sort: 'stock', dir: 'asc', attn: {}, age: null, makes: {}, sel: {}, lane: 'Available' };

  function band(d) { return d <= 30 ? 'fresh' : d <= 90 ? 'mid' : d <= 365 ? 'late' : 'stale'; }
  function ageLabel(d) { return d > 365 ? (d / 365).toFixed(1) + 'y' : d + 'd'; }
  function thumb(v) { return v.thumb ? '<img class="th" alt="" loading="lazy" src="img/' + esc(v.thumb) + '">' : '<span class="th th--none" title="No photos uploaded">' + ic('i-cam-off') + '</span>'; }
  function price(v) { return v.price == null ? '<span class="price price--none" title="No price set">—</span>' : '<span class="price"><em>$</em>' + v.price.toLocaleString('en-US') + '</span>'; }
  function age(v) { var b = band(v.days), w = Math.min(100, Math.round(v.days / 730 * 100)); return '<span class="age age--' + b + '" title="' + v.days.toLocaleString('en-US') + ' days in stock"><i style="--w:' + w + '%"></i>' + ageLabel(v.days) + '</span>'; }
  function tags(v) {
    var on = SLOTS.filter(function (s) { return v[s.k]; });
    if (!on.length) return "<span class=\"tags tags--none\">—</span>";
    var max = on.length > 3 ? 2 : 3, show = on.slice(0, max), rest = on.slice(max);
    return "<span class=\"tags\">" + show.map(function (s) { return "<span class=\"tag" + (s.tone ? " tag--" + s.tone : "") + "\" title=\"" + esc(s.h) + "\">" + esc(s.t) + "</span>"; }).join("") +
      (rest.length ? "<span class=\"tag tag--more\" title=\"" + esc(rest.map(function (s) { return s.h; }).join(" · ")) + "\">+" + rest.length + "</span>" : "") + "</span>";
  }
  function acts(v) { return '<span class="acts"><a class="ract" href="#" title="Edit vehicle" data-stop>' + ic('i-edit') + '</a><a class="ract" href="#" title="Photos" data-stop>' + ic('i-cam') + '</a><a class="ract" href="#" title="Window sticker" data-stop>' + ic('i-print') + '</a><button class="ract" type="button" title="More" data-menu="' + v.id + '" data-stop>' + ic('i-more') + '</button></span>'; }

  var COLS = [
    { k: "ck", cls: "c-ck", th: "<th class=\"ckc\"><input class=\"ck\" type=\"checkbox\" id=\"ck-all\" aria-label=\"Select all\"></th>" },
    { k: "veh", cls: "c-veh", label: "Vehicle", sort: "make" },
    { k: "spec", cls: "c-spec", label: "Spec", sort: "trim" },
    { k: "price", cls: "c-price", label: "Price", sort: "price", r: true },
    { k: "age", cls: "c-age", label: "Age", sort: "days", r: true },
    { k: "st", cls: "c-st", label: "Status", sort: "status" },
    { k: "attn", cls: "c-attn" },
    { k: "act", cls: "c-act", th: "<th></th>" }
  ];

  function filtered() {
    return V.filter(function (v) {
      for (var a in S.attn) if (S.attn[a]) { if (a === 'aging365' ? v.days <= 365 : !v[a]) return false; }
      if (S.age && band(v.days) !== S.age) return false;
      var mk = Object.keys(S.makes).filter(function (m) { return S.makes[m]; });
      if (mk.length && mk.indexOf(v.make) < 0) return false;
      return true;
    }).sort(function (a, b) {
      var k = S.sort, d = S.dir === 'asc' ? 1 : -1, x = a[k], y = b[k];
      if (k === 'price') { x = x == null ? -1 : x; y = y == null ? -1 : y; }
      if (k === 'issues') { x = -a.issues; y = -b.issues; }
      if (typeof x === 'string') { x = x.toLowerCase(); y = y.toLowerCase(); }
      return (x > y ? 1 : x < y ? -1 : 0) * d;
    });
  }

  function render() {
    $('#cg').innerHTML = COLS.map(function (c) { return '<col class="' + c.cls + '">'; }).join('');
    $('#thr').innerHTML = COLS.map(function (c) {
      if (c.th) return c.th;
      if (c.k === "attn") return "<th class=\"th-attn\"><span class=\"lab\">Attention</span><span class=\"legend\">" + SLOTS.map(function (s) { return "<button type=\"button\" class=\"" + (S.attn[s.k] ? "on" : "") + "\" data-attn=\"" + s.k + "\" title=\"" + esc(s.h) + " — click to filter\">" + ic(s.icon) + "</button>"; }).join("") + "</span></th>";
      var on = S.sort === c.sort;
      return '<th' + (c.r ? ' class="r"' : '') + '><button class="sort' + (on ? ' sort--on' : '') + '" type="button" data-sort="' + c.sort + '"><span>' + esc(c.label) + '</span>' + ic(on && S.dir === 'desc' ? 'i-dn' : 'i-up') + '</button></th>';
    }).join('');
    var list = filtered();
    $('#tb').innerHTML = list.map(function (v) {
      return '<tr data-id="' + v.id + '" class="' + (S.sel[v.id] ? 'sel' : '') + '" tabindex="0">' + COLS.map(function (c) {
        switch (c.k) {
          case 'ck': return '<td class="ckc"><input class="ck" type="checkbox" data-sel="' + v.id + '"' + (S.sel[v.id] ? ' checked' : '') + ' aria-label="Select ' + esc(v.stock) + '"></td>';
                              case "veh": return "<td><span class=\"obj\">" + (v.thumb ? "<img class=\"obj__th\" alt=\"\" loading=\"lazy\" src=\"img/" + esc(v.thumb) + "\">" : "<span class=\"obj__th obj__th--none\" title=\"No photos uploaded\">" + ic("i-cam-off") + "</span>") + "<span class=\"obj__b\"><span class=\"obj__n\" title=\"" + v.year + " " + esc(v.make) + " " + esc(v.model) + "\"><em>" + v.year + "</em>" + esc(v.make) + " " + esc(v.model) + "</span><span class=\"obj__m\"><a class=\"idtag\" href=\"#\" title=\"Stock number\">" + esc(v.stock) + "</a>" + (v.lock ? "<span class=\"lockb\" title=\"" + esc(v.lock) + "\">" + ic("i-lock") + "</span>" : "") + "<span class=\"obj__vin\"><span>VIN</span>" + esc(v.vin) + "</span></span></span></span></td>";
          case "spec": return "<td><span class=\"spec\"><span class=\"spec__t" + (v.trim ? "" : " spec__t--none") + "\" title=\"" + esc(v.trim) + "\">" + (v.trim ? esc(v.trim) : "No trim recorded") + "</span><span class=\"spec__c\"><span class=\"sw\" style=\"--c:" + swatch(v.ext) + "\"></span><span title=\"" + esc(v.ext) + "\">" + esc(v.ext || "—") + "</span></span></span></td>";
                    case 'price': return '<td class="r">' + price(v) + '</td>';
          case 'age': return '<td class="r">' + age(v) + '</td>';
          case 'st': return '<td><span class="st st--ok">Available</span></td>';
          case 'attn': return '<td>' + tags(v) + '</td>';
          case 'act': return '<td class="r">' + acts(v) + '</td>';
        }
      }).join('') + '</tr>';
    }).join('');
    var lab = { stock: 'Stock', year: 'Year', make: 'Make', model: 'Model', trim: 'Trim', ext: 'Ext. color', price: 'Price', status: 'Status', days: 'Age', issues: 'Attention' };
    $('#sort-v').textContent = lab[S.sort] + (S.dir === 'asc' ? ' ↑' : ' ↓');
    $$('#p-sort [data-sort]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.sort === S.sort); });
    $$('#p-sort [data-dir]').forEach(function (b) { b.classList.toggle('mn__it--on', b.dataset.dir === S.dir); });
    $('#shown').textContent = $('#shown2').textContent = list.length ? '1–' + list.length : '0';
    renderChips(); renderBulk();
  }
  function renderChips() {
    var items = [];
    Object.keys(S.attn).forEach(function (k) { if (S.attn[k]) items.push({ cls: 'chip--attn', k: 'Attention', v: ATTN[k], off: function () { setAttn(k, false); } }); });
    if (S.age) items.push({ cls: 'chip--attn', k: 'Age', v: AGE[S.age], off: function () { setAge(null); } });
    Object.keys(S.makes).forEach(function (m) { if (S.makes[m]) items.push({ cls: '', k: 'Make', v: m, off: function () { S.makes[m] = false; renderMakes(); } }); });
    var box = $('#chips'); box.hidden = !items.length; box._items = items;
    box.innerHTML = items.length ? '<span class="chips__l">Filters</span>' + items.map(function (it, i) { return '<span class="chip ' + it.cls + '"><span class="chip__k">' + it.k + '</span>' + esc(it.v) + '<button class="chip__x" type="button" data-chip="' + i + '" aria-label="Remove">' + ic('i-x') + '</button></span>'; }).join('') + '<button class="chips__clear" type="button" data-act="clear-all">Clear all</button>' : '';
    var mk = Object.keys(S.makes).filter(function (m) { return S.makes[m]; });
    $('#make-v').textContent = !mk.length ? 'Any' : mk.length === 1 ? mk[0] : mk[0] + ' +' + (mk.length - 1);
    $('[data-pop="p-make"]').classList.toggle('facet__b--on', mk.length > 0);
  }
  function renderBulk() { var n = Object.keys(S.sel).filter(function (k) { return S.sel[k]; }).length; $('#bulk').hidden = n === 0; $('#listbar').hidden = n > 0; $('#bulk-n').textContent = n; }
  function renderMakes() { $('#make-list').innerHTML = MAKES.map(function (m) { return '<label class="pop__it" data-v="' + esc(m[0].toLowerCase()) + '"><input class="ck" type="checkbox" data-make="' + esc(m[0]) + '"' + (S.makes[m[0]] ? ' checked' : '') + '><span>' + esc(m[0]) + '</span><span class="c">' + m[1] + '</span></label>'; }).join(''); }
  function renderCols() { $('#cols-list').innerHTML = ['Vehicle (photo · year · make · model · stock · VIN)', 'Spec (trim · exterior color)', 'Price', 'Days in stock', 'Status', 'Attention', 'Actions'].map(function (n) { return '<div class="pop__it"><span class="ract" style="cursor:grab">' + ic('i-drag') + '</span><span>' + n + '</span><button class="ract" type="button" title="Remove">' + ic('i-x') + '</button></div>'; }).join(''); }
  function setAttn(k, on) { S.attn[k] = on; $$('.ar[data-attn="' + k + '"]').forEach(function (b) { b.classList.toggle('ar--on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }); render(); }
  function setAge(b) { S.age = b; $$('[data-age]').forEach(function (el) { var on = el.dataset.age === b; el.classList.toggle('mix__seg--on', on && el.classList.contains('mix__seg')); el.classList.toggle('ml--on', on && el.classList.contains('ml')); }); render(); }
  function setLane(l) { S.lane = l; $$('[data-lane]').forEach(function (b) { var on = b.dataset.lane === l; b.classList.toggle('lane--on', on && b.classList.contains('lane')); b.classList.toggle('tab--on', on && b.classList.contains('tab')); }); var n = $('.tab[data-lane="' + l + '"] b').textContent; $('#scope-n').textContent = n; $('#scope-l').textContent = l === 'All' ? 'on file' : l.toLowerCase(); $('#scope-sub').textContent = n + ' ' + (l === 'All' ? 'on file' : l.toLowerCase()); }

  function openPanel(id) { closePops(); $$(".panel").forEach(function (p) { var on = p.id === id; p.classList.toggle("panel--open", on); p.setAttribute("aria-hidden", on ? "false" : "true"); }); $("#scrim").classList.add("scrim--on"); $$("[data-act=filters]").forEach(function (b) { b.classList.toggle("facet__b--on", id === "panel-filters"); }); }
  function closePanels() { $$(".panel").forEach(function (p) { p.classList.remove("panel--open"); p.setAttribute("aria-hidden", "true"); }); $("#scrim").classList.remove("scrim--on"); $$("tr.open").forEach(function (r) { r.classList.remove("open"); }); $$("[data-act=filters]").forEach(function (b) { b.classList.remove("facet__b--on"); }); }
  function inspect(id) {
    var v = V.filter(function (x) { return x.id === id; })[0]; if (!v) return;
    var on = SLOTS.filter(function (s) { return v[s.k]; });
    $("#insp-stock").textContent = "Stock " + v.stock;
    $("#insp-body").innerHTML =
      (v.thumb ? "<img class=\"insp__img\" alt=\"\" src=\"img/" + esc(v.thumb) + "\">" : "<div class=\"insp__img insp__img--none\">No photos uploaded</div>") +
      "<div class=\"insp__n\"><em>" + v.year + "</em>" + esc(v.make) + " " + esc(v.model) + "</div>" +
      "<div class=\"insp__m\"><span class=\"idtag\">" + esc(v.stock) + "</span><span class=\"obj__vin\"><span>VIN</span>" + esc(v.vin) + "</span>" + (v.lock ? "<span class=\"lockb\" title=\"" + esc(v.lock) + "\">" + ic("i-lock") + "</span>" : "") + "</div>" +
      "<div class=\"insp__kv\"><div><div class=\"v\">" + (v.price == null ? "<span style=\"color:var(--signal)\">—</span>" : "$" + v.price.toLocaleString("en-US")) + "</div><div class=\"l\">asking price</div></div><div><div class=\"v\" style=\"color:var(--" + (band(v.days) === "stale" ? "danger" : band(v.days) === "fresh" ? "ok" : "ink") + ")\">" + ageLabel(v.days) + "</div><div class=\"l\">" + v.days.toLocaleString("en-US") + " days in stock</div></div><div><div class=\"v\" style=\"font-size:15px;padding-top:6px\"><span class=\"st st--ok\">Available</span></div><div class=\"l\">status</div></div></div>" +
      "<div class=\"insp__sec\"><span class=\"caps\">Attention</span>" + (on.length ? "<div class=\"tags\" style=\"flex-wrap:wrap\">" + on.map(function (s) { return "<span class=\"tag" + (s.tone ? " tag--" + s.tone : "") + "\">" + esc(s.t) + "</span>"; }).join("") + "</div>" : "<div class=\"tags--none\">No attention flags</div>") + "</div>" +
      "<div class=\"insp__sec\"><span class=\"caps\">Specification</span>" +
        "<div class=\"insp__row\"><span>Trim</span><span title=\"" + esc(v.trim) + "\">" + (esc(v.trim) || "—") + "</span></div>" +
        "<div class=\"insp__row\"><span>Exterior</span><span><span class=\"sw\" style=\"--c:" + swatch(v.ext) + ";margin-right:6px;vertical-align:-1px\"></span>" + esc(v.ext || "—") + "</span></div>" +
        "<div class=\"insp__row\"><span>Location</span><span>Chicago Motor Cars</span></div>" +
        "<div class=\"insp__row\"><span>Display on site</span><span>" + (v.hidden ? "Hidden" : "Displayed") + "</span></div>" +
        "<div class=\"insp__row\"><span>Outbound feed</span><span>" + (v.feed_excluded ? "Excluded" : "Feeding") + "</span></div>" +
      "</div>" +
      "<div class=\"insp__acts\"><button class=\"btn btn--primary\" type=\"button\">" + ic("i-edit") + " Edit vehicle</button><button class=\"btn btn--secondary\" type=\"button\">" + ic("i-cam") + " Photos</button><button class=\"btn btn--secondary\" type=\"button\">" + ic("i-print") + " Window sticker</button><button class=\"btn btn--secondary\" type=\"button\">" + ic("i-file") + " Carfax</button><button class=\"btn btn--quiet\" type=\"button\" data-act=\"insp-delete\" data-id=\"" + v.id + "\" style=\"color:var(--danger)\">" + ic("i-trash") + " Delete…</button></div>";
    $$("tr.open").forEach(function (r) { r.classList.remove("open"); });
    var tr = $("tr[data-id=\"" + id + "\"]"); if (tr) tr.classList.add("open");
    openPanel("panel-insp");
  }
  function closePops() { $$('.pop--open').forEach(function (p) { p.classList.remove('pop--open'); }); $$('[data-pop]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); b.classList.remove('facet__b--open'); }); }
  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-pop]'))) { var p = $('#' + el.dataset.pop), open = p.classList.contains('pop--open'); closePops(); if (!open) { p.classList.add('pop--open'); el.setAttribute('aria-expanded', 'true'); el.classList.add('facet__b--open'); } return; }
    if (t.closest('.pop') && !t.closest('#rowmenu')) return;
    closePops();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePops(); closePanels(); $('#modal').classList.remove('modal--open'); }
    if (e.key === '/' && !/input|select|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); }
  });
  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-act="insights"]'))) { var ins = $('#insights'); ins.hidden = !ins.hidden; return; }
    if ((el = t.closest("[data-act=filters]"))) { if ($("#panel-filters").classList.contains("panel--open")) closePanels(); else openPanel("panel-filters"); return; }
    if ((el = t.closest("[data-act=close-panels]"))) { closePanels(); return; }
    if ((el = t.closest("[data-act=insp-delete]"))) { var vv = V.filter(function (x) { return x.id === el.dataset.id; })[0]; closePanels(); $("#modal-name").textContent = vv.stock + " · " + vv.year + " " + vv.make + " " + vv.model; $("#modal").classList.add("modal--open"); return; }
    if ((el = t.closest('[data-lane]'))) { setLane(el.dataset.lane); return; }
    if ((el = t.closest('[data-attn]'))) { setAttn(el.dataset.attn, !S.attn[el.dataset.attn]); return; }
    if ((el = t.closest('[data-age]'))) { setAge(S.age === el.dataset.age ? null : el.dataset.age); return; }
    if ((el = t.closest('[data-chip]'))) { $('#chips')._items[+el.dataset.chip].off(); render(); return; }
    if ((el = t.closest('[data-act="clear-all"]'))) { S.attn = {}; S.makes = {}; $$('.ar--on').forEach(function (b) { b.classList.remove('ar--on'); }); setAge(null); renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="clear-makes"]'))) { S.makes = {}; renderMakes(); render(); return; }
    if ((el = t.closest('[data-act="clear-sel"]'))) { S.sel = {}; render(); return; }
    if ((el = t.closest('.sort'))) { var k = el.dataset.sort; if (S.sort === k) S.dir = S.dir === 'asc' ? 'desc' : 'asc'; else { S.sort = k; S.dir = 'asc'; } render(); return; }
    if ((el = t.closest('.mn__it[data-sort]'))) { S.sort = el.dataset.sort; render(); closePops(); return; }
    if ((el = t.closest('[data-dir]'))) { S.dir = el.dataset.dir; render(); closePops(); return; }
    if ((el = t.closest('[data-view]'))) { $$('[data-view]').forEach(function (b) { b.classList.toggle('seg__b--on', b === el); }); return; }
    if ((el = t.closest('[data-menu]'))) { e.preventDefault(); e.stopPropagation(); var r = el.getBoundingClientRect(), mnu = $('#rowmenu'); closePops(); mnu.classList.add('pop--open'); mnu.style.top = (r.bottom + 4) + 'px'; mnu.style.left = Math.min(r.left, innerWidth - 240) + 'px'; mnu.dataset.id = el.dataset.menu; return; }
    if ((el = t.closest('[data-row]'))) { var id = $('#rowmenu').dataset.id; closePops(); if (el.dataset.row === 'inspect') { inspect(id); return; } if (el.dataset.row === 'delete') { var v = V.filter(function (x) { return x.id === id; })[0]; $('#modal-name').textContent = v ? v.stock + ' · ' + v.year + ' ' + v.make + ' ' + v.model : 'this vehicle'; $('#modal').classList.add('modal--open'); } return; }
    if ((el = t.closest('[data-act="bulk-delete"]'))) { $('#modal-name').textContent = $('#bulk-n').textContent + ' selected vehicles'; $('#modal').classList.add('modal--open'); return; }
    if ((el = t.closest('[data-act="close"]'))) { $('#modal').classList.remove('modal--open'); return; }
    if ((el = t.closest("tr[data-id]")) && !t.closest("[data-stop]") && !t.closest(".ck")) { inspect(el.dataset.id); return; }
    if (t.closest('a[href="#"]')) e.preventDefault();
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-make]')) { S.makes[t.dataset.make] = t.checked; render(); }
    if (t.matches('[data-sel]')) { S.sel[t.dataset.sel] = t.checked; t.closest('tr').classList.toggle('sel', t.checked); renderBulk(); }
    if (t.id === 'ck-all') { filtered().forEach(function (v) { S.sel[v.id] = t.checked; }); render(); }
  });
  document.addEventListener('input', function (e) { if (e.target.matches('[data-filter]')) { var q = e.target.value.toLowerCase(); $$('#' + e.target.dataset.filter + ' .pop__it').forEach(function (it) { it.style.display = it.dataset.v.indexOf(q) >= 0 ? '' : 'none'; }); } });

  for (var y = 2027; y >= 1929; y--) { $('#y1').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); $('#y2').insertAdjacentHTML('beforeend', '<option>' + y + '</option>'); }
  renderMakes(); renderCols(); render();
})();
