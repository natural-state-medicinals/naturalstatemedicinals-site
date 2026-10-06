/* Responsive photos without touching the templates.
   Every <img> whose src is a photo listed in assets/img-manifest.js gets a WebP
   srcset (800 / 1600 / 2400, never wider than the master) and a sizes value equal
   to the width it actually renders at, so a thumbnail pulls the 800 and a
   full-bleed hero on a 27-inch screen pulls the 2400. The original JPG stays in
   src as the fallback for any browser without WebP. Images with no height of
   their own get the master's aspect ratio up front, so nothing jumps on arrival. */
(function () {
  if (window.__nsmImgSizes) return;
  window.__nsmImgSizes = true;
  var M = window.NSM_IMG || {};
  var webp = false;
  try { webp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0; } catch (e) {}

  function keyOf(src) {
    if (!src) return null;
    var i = src.indexOf('/assets/');
    var p = i >= 0 ? src.slice(i + 1) : (src.indexOf('assets/') === 0 ? src : null);
    if (!p) return null;
    p = p.split('#')[0].split('?')[0];
    try { p = decodeURIComponent(p); } catch (e) {}
    return M[p] ? p : null;
  }
  function baseOf(src) { return src.split('#')[0].split('?')[0].replace(/\.(jpe?g)$/i, ''); }

  var ro = null;

  function setSizes(img) {
    var w = img.getBoundingClientRect().width;
    var v = w > 1 ? Math.ceil(w) + 'px' : '100vw';
    // only ever grow: a smaller sizes value would not download less anyway
    var cur = parseInt(img.getAttribute('sizes'), 10);
    if (img.getAttribute('sizes') === '100vw' || !cur || (w > 1 && Math.ceil(w) > cur)) img.setAttribute('sizes', v);
  }

  function up(img) {
    var src = img.getAttribute('src') || '';
    if (img.__nsmSrc === src) return;
    var k = keyOf(src) || keyOf(img.src);
    if (!k) { if (img.__nsmSet) { img.removeAttribute('srcset'); img.removeAttribute('sizes'); img.__nsmSet = false; } return; }
    img.__nsmSrc = src;
    var m = M[k], st = img.style;
    if (!st.height && !st.aspectRatio && !img.getAttribute('height')) st.aspectRatio = m[0] + ' / ' + m[1];
    if (!webp) return;
    var base = baseOf(src);
    img.setAttribute('srcset', m[2].map(function (w) { return base + '-' + w + '.webp ' + w + 'w'; }).join(', '));
    img.__nsmSet = true;
    setSizes(img);
    if (ro) ro.observe(img);
  }

  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    if (root.tagName === 'IMG') up(root);
    var list = root.querySelectorAll('img[src]');
    for (var i = 0; i < list.length; i++) up(list[i]);
  }

  var mo = new MutationObserver(function (recs) {
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (r.type === 'attributes') { if (r.target.tagName === 'IMG') up(r.target); continue; }
      for (var j = 0; j < r.addedNodes.length; j++) { var n = r.addedNodes[j]; if (n.nodeType === 1) scan(n); }
    }
  });
  function boot() {
    mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });
    scan(document.body || document.documentElement);
  }
  if (document.documentElement) boot(); else document.addEventListener('DOMContentLoaded', boot);
  // the page runtime swaps its first parse for the live tree; sweep once more after that
  addEventListener('DOMContentLoaded', function () { scan(document.body); });
  addEventListener('load', function () { scan(document.body); });
  var rz = 0;
  addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { var l = document.querySelectorAll('img[srcset]'); for (var i = 0; i < l.length; i++) if (l[i].__nsmSet) setSizes(l[i]); }, 200); });
  setTimeout(function () { scan(document.body); }, 1500);
})();
