/* Dealer Home — Gen 11: platform menus and the theme switch, as on All Vehicles (all-vehicles-gen11.js). */
(function () {
  'use strict';
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function closeMenus(except) {
    $$('.nav__it--open').forEach(function (it) {
      if (it !== except) { it.classList.remove('nav__it--open'); var b = it.querySelector('[data-menu]'); if (b) b.setAttribute('aria-expanded', 'false'); }
    });
  }
  function setTheme(t, keep) {
    document.documentElement.setAttribute('data-theme', t);
    if (keep) try { localStorage.setItem('aan-theme', t); } catch (e) {}
    $$('[data-act="theme"]').forEach(function (btn) {
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      if (btn.hasAttribute('title')) btn.setAttribute('title', t === 'dark' ? 'Light theme' : 'Dark theme');
      var lab = btn.querySelector('b'); if (lab) lab.textContent = t === 'dark' ? 'Light theme' : 'Dark theme';
    });
  }
  setTheme(document.documentElement.getAttribute('data-theme') || 'light', false);
  document.addEventListener('click', function (e) {
    var t = e.target, el;
    /* hover opens the top menus with a mouse; a click does not pin them (as on All Vehicles) */
    if ((el = t.closest('[data-menu]')) && window.matchMedia('(hover: hover) and (pointer: fine)').matches) { closeMenus(); return; }
    if ((el = t.closest('[data-menu]'))) {
      var it = el.closest('.nav__it'), open = !it.classList.contains('nav__it--open');
      closeMenus(it); it.classList.toggle('nav__it--open', open); el.setAttribute('aria-expanded', open); return;
    }
    if (!t.closest('.nav__it')) closeMenus();
    if ((el = t.closest('[data-act="theme"]'))) { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenus(); });
})();
