/* Gen 11 theme (Nov 18, dark-theme review) — one file for the staff pages, loaded in <head> so the theme is set
   before the page paints. The same behaviour as the dealer pages:
   · the stored choice (`aan-theme`, shared by every Gen page), overridden by a review hash #dark / #light;
   · every [data-act="theme"] control switches and remembers it: the moon / sun button in the bar (1280 and
     up) and the "Dark theme" / "Light theme" item in the user menu (every width). */
(function () {
  var root = document.documentElement;
  var t = null;
  try { t = localStorage.getItem('aan-theme'); } catch (e) {}
  var h = location.hash.slice(1).split('&');
  if (h.indexOf('dark') >= 0) t = 'dark'; else if (h.indexOf('light') >= 0) t = 'light';
  if (t === 'dark' || t === 'light') root.setAttribute('data-theme', t);

  function label() {
    var dark = root.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('[data-act="theme"]').forEach(function (btn) {
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      if (btn.hasAttribute('title')) btn.setAttribute('title', dark ? 'Light theme' : 'Dark theme');
      if (!btn.querySelector('svg')) (btn.querySelector('b') || btn).textContent = dark ? 'Light theme' : 'Dark theme';   /* the bar button keeps its icons */
    });
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('[data-act="theme"]')) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('aan-theme', next); } catch (err) {}
    label();
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', label); else label();
})();
