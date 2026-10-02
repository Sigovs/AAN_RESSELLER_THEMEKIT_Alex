/* AAN · Dealer Login — Gen 11 video scene
   The garage loops play in order, 1 → 2 → 3 → 4 and round again. A short clip
   repeats until it has had about nine seconds on screen, then the next one
   crossfades in. While a field has focus the current loop just keeps
   looping — the scene never changes under someone typing a password.
   Reduced motion: no playback, the poster frame stands as a still. */
(function () {
  'use strict';
  var vids = [].slice.call(document.querySelectorAll('.scene__v'));
  if (!vids.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0;
  var HOLD = 9, laps = 0, typing = false;   // seconds each scene stays before the next

  vids.forEach(function (v, i) { v.classList.toggle('is-on', i === cur); });
  if (reduce) return;

  function play(v) { v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function () {}); }

  vids.forEach(function (v, i) {
    v.addEventListener('ended', function () {
      if (i !== cur) return;
      laps++;
      if (laps * (v.duration || HOLD) < HOLD - .5 || typing || vids.length < 2) { play(v); return; }
      var next = (cur + 1) % vids.length;
      vids[next].preload = 'auto';
      play(vids[next]);
      vids[next].classList.add('is-on');
      v.classList.remove('is-on');
      cur = next; laps = 0;
    });
  });

  var form = document.querySelector('.card');
  if (form) {
    form.addEventListener('focusin', function () { typing = true; });
    form.addEventListener('focusout', function () { setTimeout(function () { typing = !!form.contains(document.activeElement); }, 0); });
  }

  // the tab is hidden: stop decoding video nobody sees
  document.addEventListener('visibilitychange', function () {
    var v = vids[cur];
    if (document.hidden) v.pause(); else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  });

  play(vids[cur]);
  // the first scene loads first; the rest buffer once the page has settled
  window.addEventListener('load', function () { vids.forEach(function (v) { v.preload = 'auto'; }); });
})();

/* Headline glitch — the title re-types itself, one word at a time, in no
   fixed order. Each letter of the chosen word flips through a few random
   glyphs, every glyph dropping in from above, then the letters land left to
   right. Letter boxes are pinned to their real width so the line never
   shifts while a word is mid-flip. The heading keeps its real text for
   assistive tech; reduced motion leaves it still. */
(function () {
  'use strict';
  var h = document.querySelector('.say__h');
  if (!h) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
  if (reduce) return;

  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/%&';
  var words = [];

  // split every word into letter boxes, keeping its <b> or plain wrapper
  [].slice.call(h.querySelectorAll('span')).forEach(function (line) {
    [].slice.call(line.childNodes).forEach(function (n) {
      var host = n.nodeType === 3 ? null : n;
      var text = n.textContent;
      var frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement('span'); w.className = 'gw'; w.setAttribute('aria-hidden', 'true');
        part.split('').forEach(function (c) {
          var i = document.createElement('i'); i.className = 'ch'; i.textContent = c; i.dataset.c = c;
          w.appendChild(i);
        });
        frag.appendChild(w); words.push(w);
      });
      if (host) { host.textContent = ''; host.appendChild(frag); } else { line.replaceChild(frag, n); }
    });
  });

  function pin() {
    words.forEach(function (w) { [].forEach.call(w.children, function (c) { c.style.width = ''; }); });
    words.forEach(function (w) { [].forEach.call(w.children, function (c) { c.style.width = c.getBoundingClientRect().width + 'px'; }); });
  }

  var busy = false;
  function glitch(w, done) {
    busy = true;
    var chars = [].slice.call(w.children);
    chars.forEach(function (c, k) {
      if (!/[A-Za-z]/.test(c.dataset.c)) return;            // the full stop stays put
      var land = 260 + k * 85 + Math.random() * 60, t0 = performance.now();
      c.classList.add('ch--g');
      (function flip() {
        var t = performance.now() - t0;
        if (t >= land) {
          c.textContent = c.dataset.c; c.classList.remove('ch--g');
          c.animate([{ transform: 'translateY(-.18em)', opacity: .5 }, { transform: 'none', opacity: 1 }], { duration: 140, easing: 'cubic-bezier(.2,.7,.2,1)' });
          return;
        }
        c.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        c.animate([{ transform: 'translateY(-.32em)', opacity: .25 }, { transform: 'none', opacity: 1 }], { duration: 70, easing: 'linear' });
        setTimeout(flip, 55 + Math.random() * 35);
      })();
    });
    setTimeout(function () { busy = false; if (done) done(); }, 260 + chars.length * 85 + 220);
  }

  var last = -1;
  function next() {
    if (document.hidden || busy) return schedule();
    var i; do { i = Math.floor(Math.random() * words.length); } while (i === last && words.length > 1);
    last = i;
    glitch(words[i], schedule);
  }
  function schedule() { setTimeout(next, 2200 + Math.random() * 2600); }

  // first arrival: every word types in once, in a random order
  function intro() {
    var order = words.map(function (_, i) { return i; }).sort(function () { return Math.random() - .5; });
    (function step(k) {
      if (k >= order.length) { last = order[order.length - 1]; return schedule(); }
      glitch(words[order[k]]);
      setTimeout(function () { step(k + 1); }, 260);
    })(0);
  }

  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(pin, 150); });
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { pin(); intro(); });
})();
