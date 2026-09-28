/* Genuine card-inside-card test.
   A "card" = opaque background + radius >= 8 + a NON-inset shadow with real blur.
   In computed styles the `inset` keyword is a SUFFIX, not a prefix — checking
   the start of the string is how a sunken track gets misread as a raised card. */
(function () {
  window.__nc = function () {
    const isCard = el => {
      const c = getComputedStyle(el);
      const sh = c.boxShadow;
      if (!sh || sh === 'none') return false;
      const parts = sh.split(/,(?![^(]*\))/).map(p => p.trim());
      const outer = parts.filter(p => !/\binset\b/.test(p));
      if (!outer.length) return false;                       // inset-only = a ring or a well
      const blurred = outer.some(p => {
        const nums = (p.match(/-?[\d.]+px/g) || []).map(parseFloat);
        return nums.length >= 3 && nums[2] >= 2;              // third length is blur
      });
      return blurred && parseFloat(c.borderRadius) >= 8 && c.backgroundColor !== 'rgba(0, 0, 0, 0)';
    };
    const floating = el => /\bpop\b|\bmenu\b|\btray\b|\bdock\b|\bmodal\b|\btooltip\b/.test(el.className || '');
    const cards = [...document.querySelectorAll('div,section,aside,article,main,header,footer')].filter(isCard);
    const nested = [];
    for (const c of cards) {
      let p = c.parentElement;
      while (p && p !== document.body) {
        if (cards.includes(p)) {
          nested.push({ inner: (c.className || c.tagName).slice(0, 30), outer: (p.className || p.tagName).slice(0, 30),
            innerFloating: floating(c), innerShadow: getComputedStyle(c).boxShadow.slice(0, 44) });
          break;
        }
        p = p.parentElement;
      }
    }
    const genuine = nested.filter(n => !n.innerFloating);
    return { page: location.pathname.split('/').pop(), elevatedSurfaces: cards.length,
      nestedTotal: nested.length, floatingNested: nested.length - genuine.length,
      genuineNested: genuine.length, genuineExamples: genuine.slice(0, 5) };
  };
  return 'nestcheck ready';
})();
