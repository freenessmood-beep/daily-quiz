/* ------------------------------------------------------------------
   Shared site-wide visit counter.
   Counts every page load across all visitors (a "page views" total)
   using a free, no-signup hit-counter API. Falls back to a second
   provider, and silently hides itself if both are unreachable.
   Include on a page with:  <script src="counter.js"></script>
------------------------------------------------------------------ */
(function () {
  var NS = 'freenessmood-daily-quiz';   // counter namespace
  var KEY = 'visits';                   // shared key for the whole site

  // --- styling (injected so each page only needs the <script> tag) ---
  var style = document.createElement('style');
  style.textContent =
    '.visit-counter{position:fixed;right:14px;bottom:14px;z-index:60;' +
    'font-family:"Comic Sans MS","Microsoft JhengHei","Trebuchet MS",sans-serif;' +
    'font-size:15px;font-weight:bold;color:#2e7d32;background:rgba(255,255,255,0.92);' +
    'border:2px solid #4caf50;border-radius:30px;padding:6px 14px;' +
    'box-shadow:0 3px 0 rgba(67,160,71,0.4);user-select:none;pointer-events:none;' +
    'opacity:0;transition:opacity .4s;}' +
    '.visit-counter.show{opacity:1;}';
  document.head.appendChild(style);

  // --- the badge element ---
  var el = document.createElement('div');
  el.className = 'visit-counter';
  el.textContent = '👀 …';
  function attach() { (document.body || document.documentElement).appendChild(el); }
  if (document.body) attach(); else document.addEventListener('DOMContentLoaded', attach);

  function show(n) {
    el.textContent = '👀 ' + Number(n).toLocaleString() + ' visits';
    el.classList.add('show');
  }
  function hide() { if (el && el.parentNode) el.parentNode.removeChild(el); }

  // --- primary provider: abacus -> { value: N } ---
  fetch('https://abacus.jasoncameron.dev/hit/' + NS + '/' + KEY)
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (d) { show(d.value); })
    .catch(function () {
      // --- fallback provider: counterapi.dev v1 -> { count: N } ---
      fetch('https://api.counterapi.dev/v1/' + NS + '/' + KEY + '/up')
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (d) { show(d.count); })
        .catch(hide);
    });
})();
