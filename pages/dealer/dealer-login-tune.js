/* AAN · Dealer Login — tuning panel (concept only)
   Live knobs for the scene: dim, colour grade, the orange radial, grain and
   the glass card. Every knob writes a custom property on :root (or, for the
   glass distortion, an attribute on the #glass SVG filter). Values persist in
   this browser; "Copy CSS" puts the current set on the clipboard so it can
   be pasted back into dealer-login-video.css. */
(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'aan-login-tune';
  var disp = document.querySelector('#glass feDisplacementMap');
  var turb = document.querySelector('#glass feTurbulence');

  var GROUPS = [
    ['Dim', [
      ['--veil', 'Overall', 0, .7, .01, ''],
      ['--dim-l', 'Left side', 0, 1, .01, ''],
      ['--dim-r', 'Right side', 0, 1, .01, ''],
      ['--dim-top', 'Top', 0, 1, .01, ''],
      ['--dim-bottom', 'Bottom', 0, 1, .01, ''],
      ['--vignette', 'Vignette', 0, 1, .01, '']
    ]],
    ['Colour', [
      ['--blue', 'Dirty blue', 'color'],
      ['--blue-2', 'Blue, far side', 'color'],
      ['--orange', 'Dirty orange', 'color'],
      ['--grade', 'Grade strength', 0, 1, .01, ''],
      ['--warm', 'Orange glow', 0, .8, .01, '']
    ]],
    ['Radial (orange)', [
      ['--rx', 'Position X', 0, 100, 1, '%'],
      ['--ry', 'Position Y', 0, 100, 1, '%'],
      ['--rw', 'Width', 10, 160, 1, '%'],
      ['--rh', 'Height', 10, 160, 1, '%']
    ]],
    ['Noise', [
      ['--grain', 'Amount', 0, .9, .01, ''],
      ['--grain-size', 'Size', 60, 700, 10, 'px'],
      ['--grain-speed', 'Speed (s per cycle)', .2, 3, .05, 's']
    ]],
    ['Glass card', [
      ['--glass-tint', 'Dark tint', 0, .9, .01, ''],
      ['--glass-blur', 'Blur', 0, 20, .5, 'px'],
      ['--glass-bright', 'Brightness', .3, 1.2, .01, ''],
      ['@scale', 'Distortion', 0, 140, 1, ''],
      ['@freq', 'Wave size (small = big waves)', .002, .05, .001, '']
    ]]
  ];

  // current values: from :root as authored, then whatever this browser saved
  var defaults = {}, cs = getComputedStyle(root);
  GROUPS.forEach(function (g) { g[1].forEach(function (k) {
    if (k[0] === '@scale') defaults[k[0]] = disp ? +disp.getAttribute('scale') : 46;
    else if (k[0] === '@freq') defaults[k[0]] = turb ? parseFloat(turb.getAttribute('baseFrequency')) : .008;
    else defaults[k[0]] = cs.getPropertyValue(k[0]).trim();
  }); });
  var vals = {};
  try { vals = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}

  function apply(name, v) {
    if (name === '@scale') { if (disp) disp.setAttribute('scale', v); }
    else if (name === '@freq') { if (turb) turb.setAttribute('baseFrequency', (+v).toFixed(4) + ' ' + (v * 2.75).toFixed(4)); }
    else root.style.setProperty(name, v);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(vals)); } catch (e) {} }
  Object.keys(vals).forEach(function (k) { apply(k, vals[k]); });

  // ── UI ──
  var css = document.createElement('style');
  css.textContent =
    '.tn-b{position:fixed;left:16px;bottom:16px;z-index:50;height:34px;padding:0 14px;border:0;background:#000;color:#fff;font:600 12px/1 Archivo,sans-serif;letter-spacing:.12em;text-transform:uppercase;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25);cursor:pointer}' +
    '.tn-b:hover{background:#111}' +
    '.tn{position:fixed;left:16px;bottom:58px;z-index:50;width:300px;max-height:calc(100vh - 90px);overflow:auto;padding:14px 16px 16px;background:rgba(0,0,0,.88);color:#f2f5fa;font:13px/1.3 Archivo,sans-serif;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18),0 20px 60px rgba(0,0,0,.6);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}' +
    '.tn[hidden]{display:none}' +
    '.tn h4{margin:14px 0 8px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#8aa8ff}.tn h4:first-of-type{margin-top:0}' +
    '.tn label{display:grid;grid-template-columns:1fr 52px;align-items:center;gap:2px 8px;margin-bottom:8px;color:rgba(242,245,250,.8)}' +
    '.tn label output{text-align:right;font-variant-numeric:tabular-nums;color:#fff}' +
    '.tn input[type=range]{grid-column:1/-1;width:100%;accent-color:#4d86ff;margin:0}' +
    '.tn input[type=color]{width:52px;height:24px;padding:0;border:0;background:none;cursor:pointer}' +
    '.tn .tn-a{display:flex;gap:8px;margin-top:14px}' +
    '.tn .tn-a button{flex:1;height:32px;border:0;background:#2f6bff;color:#fff;font:600 12px Archivo,sans-serif;cursor:pointer}' +
    '.tn .tn-a button+button{background:rgba(255,255,255,.1)}' +
    '.tn .tn-m{margin-top:8px;font-size:12px;color:#7fe0a0;min-height:1em}';
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.className = 'tn-b'; btn.type = 'button'; btn.textContent = 'Tune';
  var panel = document.createElement('div');
  panel.className = 'tn'; panel.hidden = true; panel.setAttribute('aria-label', 'Scene tuning');

  var inputs = {};
  GROUPS.forEach(function (g) {
    var h = document.createElement('h4'); h.textContent = g[0]; panel.appendChild(h);
    g[1].forEach(function (k) {
      var name = k[0], cur = vals[name] != null ? vals[name] : defaults[name];
      var lab = document.createElement('label'), txt = document.createElement('span'); txt.textContent = k[1];
      var inp = document.createElement('input'), out = document.createElement('output');
      lab.appendChild(txt);
      if (k[2] === 'color') {
        inp.type = 'color'; inp.value = cur; lab.appendChild(inp);
        inp.addEventListener('input', function () { vals[name] = inp.value; apply(name, inp.value); save(); });
      } else {
        var unit = k[5];
        inp.type = 'range'; inp.min = k[2]; inp.max = k[3]; inp.step = k[4];
        inp.value = parseFloat(cur);
        out.textContent = (+inp.value) + unit;
        lab.appendChild(out); lab.appendChild(inp);
        inp.addEventListener('input', function () {
          var v = inp.value + (name.charAt(0) === '@' ? '' : unit);
          out.textContent = inp.value + unit;
          vals[name] = name.charAt(0) === '@' ? +inp.value : v; apply(name, vals[name]); save();
        });
      }
      inputs[name] = { inp: inp, out: out, unit: k[5] || '' };
      panel.appendChild(lab);
    });
  });

  var acts = document.createElement('div'); acts.className = 'tn-a';
  var copy = document.createElement('button'); copy.type = 'button'; copy.textContent = 'Copy CSS';
  var reset = document.createElement('button'); reset.type = 'button'; reset.textContent = 'Reset';
  var msg = document.createElement('div'); msg.className = 'tn-m';
  acts.appendChild(copy); acts.appendChild(reset); panel.appendChild(acts); panel.appendChild(msg);

  function current(name) { return vals[name] != null ? vals[name] : defaults[name]; }
  copy.addEventListener('click', function () {
    var lines = [':root {'];
    GROUPS.forEach(function (g) { g[1].forEach(function (k) { if (k[0].charAt(0) !== '@') lines.push('  ' + k[0] + ': ' + current(k[0]) + ';'); }); });
    lines.push('}');
    lines.push('/* #glass filter: feDisplacementMap scale="' + current('@scale') + '", feTurbulence baseFrequency="' + (+current('@freq')).toFixed(4) + ' ' + (current('@freq') * 2.75).toFixed(4) + '" */');
    var text = lines.join('\n');
    var done = function () { msg.textContent = 'Copied — paste it to me or into the CSS.'; setTimeout(function () { msg.textContent = ''; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy:', text); });
    else window.prompt('Copy:', text);
  });
  reset.addEventListener('click', function () {
    vals = {}; save();
    Object.keys(inputs).forEach(function (n) {
      var d = defaults[n], o = inputs[n];
      if (n.charAt(0) !== '@') root.style.removeProperty(n); else apply(n, d);
      if (o.inp.type === 'color') o.inp.value = d; else { o.inp.value = parseFloat(d); o.out.textContent = parseFloat(d) + o.unit; }
    });
  });

  btn.addEventListener('click', function () { panel.hidden = !panel.hidden; btn.textContent = panel.hidden ? 'Tune' : 'Close'; });
  document.body.appendChild(panel); document.body.appendChild(btn);
})();
