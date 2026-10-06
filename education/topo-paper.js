/**
 * Topo paper: real USGS 7.5' quadrangle relief printed faintly into every
 * cream/arctic surface of the guide.
 *
 * Each quad in topo/*.js is a real elevation grid (feet) for one Arkansas Geological
 * Survey 1:24,000 sheet. Contours are drawn at that sheet's interval with a heavier
 * index line every fifth, at a fixed ground scale so density reads the same on
 * a phone and a monitor. A tall section runs onto the next sheet below with a soft
 * overlap. A cream panel nested inside another continues its parent's map rather
 * than starting a new one, so there are no seams inside a room.
 *
 * Painted lazily as a background image under the content, so text and controls are
 * untouched. Add data-topo-skip to any element to keep it plain.
 */
(function () {
  if (window.__nsmTopoPaper) return;
  window.__nsmTopoPaper = true;

  var SELF = document.currentScript;
  var BASE = (SELF && SELF.src ? SELF.src.replace(/[^\/]*$/, '') : '') + 'topo/';
  var SHEETS = ['snowball', 'greers-ferry-dam', 'conway', 'pine-bluff', 'jonesboro', 'horseshoe-mountain', 'mountain-home-west'];
  var SURFACES = ['rgb(245, 244, 225)'];
  var PX_PER_KM = 125, OVERLAP = 260;
  var INK = '32,37,58', MINOR_A = 0.075, INDEX_A = 0.15;

  var loading = {};
  function sheet(id) {
    if (loading[id]) return loading[id];
    loading[id] = new Promise(function (res) {
      var T = window.NSM_TOPO || {};
      if (T[id]) return res(prep(T[id]));
      var s = document.createElement('script');
      s.src = BASE + id + '.js';
      s.onload = function () { var r = (window.NSM_TOPO || {})[id]; res(r ? prep(r) : null); };
      s.onerror = function () { res(null); };
      document.head.appendChild(s);
    });
    return loading[id];
  }

  // decode, one 3x3 pass to settle 8-bit stepping, then contour every level once
  function prep(Q) {
    if (Q._segs) return Q;
    var c = Q.cols, r = Q.rows, raw = atob(Q.data), v = new Float32Array(c * r), k;
    for (k = 0; k < c * r; k++) v[k] = Q.min + (raw.charCodeAt(k) / 255) * (Q.max - Q.min);
    var s = new Float32Array(c * r);
    for (var j = 0; j < r; j++) for (var i = 0; i < c; i++) {
      var sum = 0, n = 0;
      for (var dj = -1; dj <= 1; dj++) { var jj = j + dj; if (jj < 0 || jj >= r) continue;
        for (var di = -1; di <= 1; di++) { var ii = i + di; if (ii < 0 || ii >= c) continue; sum += v[jj * c + ii]; n++; } }
      s[j * c + i] = sum / n;
    }
    var midLat = (Q.lat0 + Q.lat1) / 2;
    Q.kmW = (Q.lon1 - Q.lon0) * 111.32 * Math.cos(midLat * Math.PI / 180);
    Q.kmH = (Q.lat1 - Q.lat0) * 110.9;
    Q._segs = [];
    var first = Math.ceil(Q.min / Q.ci) * Q.ci;
    for (var lv = first; lv <= Q.max; lv += Q.ci) {
      Q._segs.push({ index: Math.round(lv / Q.ci) % 5 === 0, s: iso(s, c, r, lv) });
    }
    return Q;
  }

  function iso(vals, cols, rows, level) {
    var out = [];
    for (var j = 0; j < rows - 1; j++) for (var i = 0; i < cols - 1; i++) {
      var a = vals[j * cols + i], b = vals[j * cols + i + 1], cc = vals[(j + 1) * cols + i + 1], d = vals[(j + 1) * cols + i];
      var p = [];
      if ((a < level) !== (b < level)) p.push(i + (level - a) / (b - a), j);
      if ((b < level) !== (cc < level)) p.push(i + 1, j + (level - b) / (cc - b));
      if ((d < level) !== (cc < level)) p.push(i + (level - d) / (cc - d), j + 1);
      if ((a < level) !== (d < level)) p.push(i, j + (level - a) / (d - a));
      if (p.length >= 4) out.push(p[0], p[1], p[2], p[3]);
      if (p.length === 8) out.push(p[4], p[5], p[6], p[7]);
    }
    return out;
  }

  var css = document.createElement('style');
  css.id = 'nsm-topo-css';
  document.head.appendChild(css);
  var rules = {};
  function setRule(id, urls, tiles, h) {
    var ok = (urls || []).map(function (u, i) { return u ? i : -1; }).filter(function (i) { return i >= 0; });
    rules[id] = ok.length ? '[data-topo-id="' + id + '"]{background-image:' + ok.map(function (i) { return 'url(' + urls[i] + ')'; }).join(',') +
      ' !important;background-size:' + ok.map(function (i) { return '100% ' + (tiles[i][1] - tiles[i][0]) + 'px'; }).join(',') +
      ' !important;background-position:' + ok.map(function (i) { return '0 ' + tiles[i][0] + 'px'; }).join(',') +
      ' !important;background-repeat:no-repeat !important;}' : '';
    css.textContent = Object.keys(rules).map(function (k) { return rules[k]; }).join('\n');
  }

  var nextId = 1;
  var state = new WeakMap(), checked = new WeakSet();

  function isSurface(el) {
    if (el.closest('[data-topo-skip]')) return false;
    var cs = getComputedStyle(el);
    if (SURFACES.indexOf(cs.backgroundColor) < 0) return false;
    if (cs.backgroundImage !== 'none' && !el.hasAttribute('data-topo-id')) return false;
    // tall sections are painted in stacked tiles; only whole-page wrappers are skipped
    var hh = el.offsetHeight;
    return el.offsetWidth >= Math.min(innerWidth * 0.7, 900) && hh >= 240 && hh <= 40000;
  }

  function rootOf(el) {
    var p = el.parentElement, top = el;
    while (p && p !== document.body) { if (state.has(p)) top = p; p = p.parentElement; }
    return top;
  }

  // nearness by measurement, not IntersectionObserver: some embeds never report
  var tracked = [];
  // phones paint only within one screen of the viewport, and let go of tiles once
  // they are well past it; desktop keeps the wide margin and never releases
  function phone() { return innerWidth < 760; }
  function isNear(el) { var r = el.getBoundingClientRect(), m = phone() ? innerHeight : 1400; return r.bottom > -m && r.top < innerHeight + m; }
  function isFar(el) { var r = el.getBoundingClientRect(), m = innerHeight * 3; return r.bottom < -m || r.top > innerHeight + m; }
  function release(el) {
    var st = state.get(el); if (!st || !st.done) return;
    st.token = {}; st.done = false; st.w = 0; st.h = 0;
    (st.urls || []).forEach(function (u) { if (u) URL.revokeObjectURL(u); });
    st.urls = null; setRule(st.id, null);
  }
  var sT = 0;
  function onScroll() {
    if (sT) return;
    sT = setTimeout(function () {
      sT = 0;
      tracked = tracked.filter(function (el) { return el.isConnected; });
      tracked.forEach(function (el) { var st = state.get(el); if (!st) return; st.near = isNear(el); if (st.near && !st.done) queue(el); else if (!st.near && phone() && isFar(el)) release(el); });
    }, 120);
  }
  addEventListener('scroll', onScroll, { passive: true });
  var ro = new ResizeObserver(function (ents) { ents.forEach(function (en) { if (state.has(en.target)) queue(en.target); }); });

  function scan() {
    var all = document.querySelectorAll('section, div, main, article, aside, header, footer');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (state.has(el) || checked.has(el)) continue;
      if (!isSurface(el)) { if (el.offsetHeight >= 240) checked.add(el); continue; }
      var id = nextId++;
      el.setAttribute('data-topo-id', String(id));
      state.set(el, { id: id, sheet: null, near: false, w: 0, h: 0 });
      tracked.push(el); ro.observe(el);
    }
    // sheet assignment by root order down the page
    var n = 0;
    document.querySelectorAll('[data-topo-id]').forEach(function (el) {
      var st = state.get(el); if (!st) return;
      if (rootOf(el) === el) { if (st.root == null) st.root = n; n++; }
    });
  }

  var pending = new Set(), raf = 0;
  function queue(el) { pending.add(el); clearTimeout(raf); raf = setTimeout(flush, 140); }
  function flush() { var list = Array.from(pending); pending.clear(); list.forEach(paint); }

  function paint(el) {
    var st = state.get(el);
    if (!st || !el.isConnected) return;
    st.near = isNear(el);
    if (!st.near) return;
    var w = el.offsetWidth, h = el.offsetHeight;
    if (w < 40 || h < 40) return;
    var root = rootOf(el), rs = state.get(root);
    var rb = root.getBoundingClientRect(), eb = el.getBoundingClientRect();
    var ox = eb.left - rb.left, oy = eb.top - rb.top;
    if (Math.abs(w - st.w) < 24 && Math.abs(h - st.h) < 24 && st.ox === ox && st.oy === oy && st.done) return;
    st.w = w; st.h = h; st.ox = ox; st.oy = oy;
    var rootW = root.offsetWidth, start = (rs && rs.root != null ? rs.root : 0) * 2;
    var token = st.token = {};

    // which sheets this box needs, stacked down the root
    var need = [], y = 0, k = 0;
    var guessH = Math.max(PX_PER_KM, rootW / 11.4) * 13.9;
    while (y < oy + h) { need.push(SHEETS[(start + k) % SHEETS.length]); y += guessH - OVERLAP; k++; if (k > 40) break; }
    Promise.all(need.map(sheet)).then(function (qs) {
      if (st.token !== token) return;
      qs = qs.filter(Boolean); if (!qs.length) return;
      var dpr = phone() ? 1 : Math.min(2, window.devicePixelRatio || 1);
      var CH = 3000, tiles = [];
      for (var cy = 0; cy < h; cy += CH) tiles.push([cy, Math.min(h, cy + CH)]);
      var urls = new Array(tiles.length), left = tiles.length;
      tiles.forEach(function (tl, ti) {
        var th = tl[1] - tl[0];
        var cv = document.createElement('canvas');
        cv.width = Math.round(w * dpr); cv.height = Math.round(th * dpr);
        var ctx = cv.getContext('2d');
        var top = 0;
        for (var b = 0; b < qs.length; b++) {
          var Q = qs[b];
          var scale = Math.max(PX_PER_KM, rootW / Q.kmW);
          var bw = Q.kmW * scale, bh = Q.kmH * scale;
          var bx = (rootW - bw) / 2;
          var y0 = top - oy - tl[0], y1 = y0 + bh;
          if (y1 > 0 && y0 < th) band(ctx, dpr, Q, bx - ox, y0, bw, bh, w, th, b > 0, b < qs.length - 1);
          top += bh - OVERLAP;
          if (top - oy > tl[1]) break;
        }
        cv.toBlob(function (blob) {
          if (st.token !== token) return;
          urls[ti] = blob ? URL.createObjectURL(blob) : null;
          if (--left) return;
          (st.urls || []).forEach(function (u) { if (u) URL.revokeObjectURL(u); });
          st.urls = urls; st.done = true;
          setRule(st.id, urls, tiles, h);
        }, 'image/png');
      });
    });
  }

  function band(ctx, dpr, Q, bx, by, bw, bh, w, h, fadeTop, fadeBot) {
    var yA = Math.max(0, Math.floor(by)), yB = Math.min(h, Math.ceil(by + bh));
    if (yB - yA < 2) return;
    var t = document.createElement('canvas');
    t.width = ctx.canvas.width; t.height = Math.ceil((yB - yA) * dpr);
    var x = t.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, -yA * dpr);
    var sx = bw / (Q.cols - 1), sy = bh / (Q.rows - 1);
    x.strokeStyle = 'rgb(' + INK + ')';
    for (var L = 0; L < Q._segs.length; L++) {
      var lev = Q._segs[L], s = lev.s;
      x.beginPath();
      for (var i = 0; i < s.length; i += 4) {
        var ax = bx + s[i] * sx, ay = by + s[i + 1] * sy;
        if (ay < yA - 8 || ay > yB + 8 || ax < -8 || ax > w + 8) continue;
        x.moveTo(ax, ay); x.lineTo(bx + s[i + 2] * sx, by + s[i + 3] * sy);
      }
      x.globalAlpha = lev.index ? INDEX_A : MINOR_A;
      x.lineWidth = lev.index ? 1.1 : 0.65;
      x.stroke();
    }
    if (fadeTop || fadeBot) {
      x.globalAlpha = 1;
      x.globalCompositeOperation = 'destination-in';
      var g = x.createLinearGradient(0, by, 0, by + bh), f = OVERLAP / bh;
      g.addColorStop(0, fadeTop ? 'rgba(0,0,0,0)' : '#000');
      g.addColorStop(f, '#000');
      g.addColorStop(1 - f, '#000');
      g.addColorStop(1, fadeBot ? 'rgba(0,0,0,0)' : '#000');
      x.fillStyle = g;
      x.fillRect(-4, yA, w + 8, yB - yA);
    }
    ctx.drawImage(t, 0, Math.round(yA * dpr));
  }

  // No mutation observer: the guide re-renders constantly and a full rescan per
  // change forces layout. Scan a few times while it streams in, then on resize
  // and at most every few seconds while scrolling.
  var scanT, lastScan = 0;
  function kick() { clearTimeout(scanT); scanT = setTimeout(function () { lastScan = Date.now(); scan(); onScroll(); }, 400); }
  function boot() {
    scan(); onScroll();
    [800, 2000, 4500, 9000].forEach(function (ms) { setTimeout(kick, ms); });
    addEventListener('resize', kick);
    addEventListener('scroll', function () { if (Date.now() - lastScan > 4000) { lastScan = Date.now(); kick(); } }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  // the guide streams in; look again once it has settled
  addEventListener('load', kick);
})();
