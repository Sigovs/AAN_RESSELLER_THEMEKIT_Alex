/* AAN · Dealer Login — Gen 11
   One behaviour, and it is the one the production page already has: the
   password reveal. Nothing else on this page does anything without a server. */
(function () {
  'use strict';
  var eye = document.getElementById('eye');
  var pw = document.getElementById('password');
  if (!eye || !pw) return;

  eye.addEventListener('click', function () {
    var shown = pw.type === 'text';
    pw.type = shown ? 'password' : 'text';
    eye.setAttribute('aria-pressed', String(!shown));
    eye.setAttribute('aria-label', shown ? 'Show password' : 'Hide password');
    eye.querySelector('use').setAttribute('href', shown ? '#i-eye' : '#i-eye-off');
    // the caret belongs back where the reader left it
    pw.focus({ preventScroll: true });
    var n = pw.value.length;
    try { pw.setSelectionRange(n, n); } catch (e) {}
  });
})();
