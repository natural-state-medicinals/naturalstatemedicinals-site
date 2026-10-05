/**
 * <arkansas-intro> — the NSM landing sequence.
 *
 * Act 1 (midnight): the real Arkansas boundary draws itself, real relief
 * contours fill in, a bronze marker finds White Hall.
 * Act 2: the whole map drives into that marker and the dark plate dissolves.
 * Act 3 (cream): the same contours remain as a soft embossed watermark under
 * the logo.
 *
 * Self contained: no CDN, no d3, no runtime fetch. Boundary is simplified US
 * Census state geometry (FIPS 05); relief comes from ar-elevation.js, sampled
 * from a real elevation map and contoured here with marching squares.
 *
 * Timeline (ms), mirrored by the page's CSS animation delays:
 *   300  outline draws · 800 contours · 2600 zoom begins
 *   3900 cream watermark fades up · 4900 map is gone
 */
(function () {
  const AR_RING = [[-94.473842,36.501861],[-90.152536,36.496384],[-90.064905,36.304691],[-90.218259,36.184199],[-90.377091,35.997983],[-89.730812,35.997983],[-89.763673,35.811767],[-89.911551,35.756997],[-89.944412,35.603643],[-90.130628,35.439335],[-90.114197,35.198349],[-90.212782,35.023087],[-90.311367,34.995703],[-90.251121,34.908072],[-90.409952,34.831394],[-90.481152,34.661609],[-90.585214,34.617794],[-90.568783,34.420624],[-90.749522,34.365854],[-90.744046,34.300131],[-90.952169,34.135823],[-90.891923,34.026284],[-91.072662,33.867453],[-91.231493,33.560744],[-91.056231,33.429298],[-91.143862,33.347144],[-91.089093,33.13902],[-91.16577,33.002096],[-93.608485,33.018527],[-94.041164,33.018527],[-94.041164,33.54979],[-94.183564,33.593606],[-94.380734,33.544313],[-94.484796,33.637421],[-94.430026,35.395519],[-94.616242,36.501861],[-94.473842,36.501861]];
  const WHITE_HALL = [-92.0893, 34.2734];

  const T_OUTLINE = 300, T_OUTLINE_DUR = 1700, T_CONTOUR = 800, T_ZOOM = 2600, T_ZOOM_DUR = 2300;
  const BRONZE = '183,149,80', ARCTIC = '245,244,225';
  const LEVELS = 15;

  const merc = (lon, lat) => [lon * Math.PI / 180, Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))];
  const clamp01 = (t) => t < 0 ? 0 : t > 1 ? 1 : t;

  // marching squares -> [x0,y0,x1,y1] segments in grid space
  function isolines(vals, cols, rows, level) {
    const segs = [];
    const at = (i, j) => vals[j * cols + i];
    const ip = (a, b) => (level - a) / (b - a || 1e-9);
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const v00 = at(i, j), v10 = at(i + 1, j), v11 = at(i + 1, j + 1), v01 = at(i, j + 1);
        const pts = [];
        if ((v00 < level) !== (v10 < level)) pts.push([i + ip(v00, v10), j]);
        if ((v10 < level) !== (v11 < level)) pts.push([i + 1, j + ip(v10, v11)]);
        if ((v01 < level) !== (v11 < level)) pts.push([i + ip(v01, v11), j + 1]);
        if ((v00 < level) !== (v01 < level)) pts.push([i, j + ip(v00, v01)]);
        if (pts.length === 2) segs.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
        else if (pts.length === 4) {
          segs.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
          segs.push([pts[2][0], pts[2][1], pts[3][0], pts[3][1]]);
        }
      }
    }
    return segs;
  }

  function geometry(w, h, fit, cover, widthOnly) {
    const pts = AR_RING.map(p => merc(p[0], p[1]));
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    pts.forEach(p => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
    const k = widthOnly
      ? (w * fit) / (x1 - x0)
      : cover
        ? Math.max((w * fit) / (x1 - x0), (h * fit) / (y1 - y0))
        : Math.min((w * fit) / (x1 - x0), (h * fit) / (y1 - y0));
    const ox = (w - (x1 - x0) * k) / 2, oy = widthOnly ? Math.min(0, (h - (y1 - y0) * k) / 2) : (h - (y1 - y0) * k) / 2;
    const proj = (lon, lat) => { const m = merc(lon, lat); return [ox + (m[0] - x0) * k, oy + (y1 - m[1]) * k]; };
    const ring = AR_RING.map(p => proj(p[0], p[1]));
    const path = new Path2D();
    ring.forEach((p, i) => i ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1]));
    path.closePath();
    return { proj, ring, path, gridH: (y1 - y0) * k, gridTop: oy };
  }


  // Two box passes. Raw DEM sampling leaves 1-cell speckle, and on flat ground
  // (the Delta sits at 43-200 ft against a 2,694 ft high point) that speckle
  // contours into a rash of tiny closed loops instead of open ground.
  function smoothField(vals, cols, rows, passes) {
    let src = vals;
    for (let p = 0; p < (passes || 2); p++) {
      const dst = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          let sum = 0, n = 0;
          for (let dj = -1; dj <= 1; dj++) {
            const jj = j + dj; if (jj < 0 || jj >= rows) continue;
            for (let di = -1; di <= 1; di++) {
              const ii = i + di; if (ii < 0 || ii >= cols) continue;
              sum += src[jj * cols + ii]; n++;
            }
          }
          dst[j * cols + i] = sum / n;
        }
      }
      src = dst;
    }
    return src;
  }

  function contourPaths(proj, G) {
    const cols = G.cols, rows = G.rows;
    const raw = new Float32Array(cols * rows);
    for (let k = 0; k < cols * rows; k++) raw[k] = G.data.charCodeAt(k);
    const vals = smoothField(raw, cols, rows, 2);
    let lo = Infinity, hi = -Infinity;
    for (let k = 0; k < cols * rows; k++) { const v = vals[k]; if (v < lo) lo = v; if (v > hi) hi = v; }
    const tl = proj(G.lon0, G.lat1), br = proj(G.lon1, G.lat0);
    const sx = (br[0] - tl[0]) / (cols - 1), sy = (br[1] - tl[1]) / (rows - 1);
    const out = [];
    for (let l = 0; l < LEVELS; l++) {
      const level = lo + (hi - lo) * (0.15 + 0.85 * Math.pow((l + 1) / (LEVELS + 1), 1.3));
      const segs = isolines(vals, cols, rows, level);
      const p = new Path2D();
      for (let s = 0; s < segs.length; s++) {
        const g = segs[s];
        p.moveTo(tl[0] + g[0] * sx, tl[1] + g[1] * sy);
        p.lineTo(tl[0] + g[2] * sx, tl[1] + g[3] * sy);
      }
      out.push(p);
    }
    return out;
  }

  const HOLD_OFF = T_OUTLINE + T_OUTLINE_DUR - T_CONTOUR;

  class ArkansasIntro extends HTMLElement {
    // Called by the age gate. Until it fires, the intro sits on a finished
    // outline and nothing else moves.
    release() {
      clearInterval(this._holdBail); this._holdBail = null;
      if (!this._held) return;
      this._held = false;
      // Only shift the downstream timeline if the sequence actually parked on
      // the outline. Released before it ever built, it should just play normally.
      if (this._resume) { this._off = HOLD_OFF; this._resume(); }
    }
    connectedCallback() {
      // A remount (React reparenting the host) used to leave the element booted but
      // dead, so nothing ever drew. If we come back without having built, build.
      if (this._booted) {
        if (!this._plate && !this._cream) {
          this._dead = false;
          requestAnimationFrame(() => this._build());
        }
        return;
      }
      // A re-parse of the host keeps the markup but loses every JS property, so
      // the guard above reads as "never booted" while the previous run's canvases
      // are still sitting in the element. Building again then stacks a live
      // sequence under a frozen one, and the frozen frame is what you see.
      while (this.firstChild) this.removeChild(this.firstChild);
      this._booted = true;
      // The gate and the intro mount in either order (<x-import> resolves async),
      // so neither may assume the other exists yet. A passed gate leaves a flag,
      // and a live one will announce itself on the event.
      this._held = this.hasAttribute("hold") && !window.__nsGatePassed;
      this._off = 0;
      this._onGate = () => this.release();
      document.addEventListener('ns-gate-passed', this._onGate);
      // If the gate never arrives (script blocked, load error), do not strand the
      // page on a frozen outline. Presence of the element is the signal, not
      // elapsed time: a visitor may sit on the question for a minute.
      if (this._held) {
        let tries = 0;
        this._holdBail = setInterval(() => {
          // A gate tag alone proves nothing: it may be an inert one that already
          // passed. Only an upgraded, unpassed gate is actually holding the door.
          var el = document.querySelector('ns-age-gate');
          if (el && el._up && !el._passed) {
            clearInterval(this._holdBail); this._holdBail = null; return;
          }
          if (++tries > 6) { clearInterval(this._holdBail); this._holdBail = null; this.release(); }
        }, 500);
      }
      this.style.cssText = 'display:block;position:absolute;inset:0;overflow:hidden;pointer-events:none';
      requestAnimationFrame(() => this._build());
      // A remount can kill the first attempt between the frame and the build, so
      // check once that something actually drew.
      this._buildGuard = setTimeout(() => {
        if (!this._plate && !this._cream && this.isConnected) { this._dead = false; this._build(); }
      }, 400);
    }
    disconnectedCallback() { this._dead = true; clearTimeout(this._buildGuard); clearInterval(this._holdBail);
      if (this._onGate) document.removeEventListener('ns-gate-passed', this._onGate); if (this._raf) cancelAnimationFrame(this._raf); }

    // fires once, whenever the hero has come to rest (normal end, skip, or reduced motion)
    _settled() {
      if (this._settledFired) return;
      this._settledFired = true;
      document.dispatchEvent(new CustomEvent('ns-intro-settled'));
    }

    finish() {
      this._held = false;
      // asked to skip before the element has built: build straight to the end state
      if (!this._plate) { this._skip = true; this._settled(); return; }
      this._settled();
      this._dead = true;
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._plate) { this._plate.style.transition = 'opacity 260ms ease'; this._plate.style.opacity = '0'; }
      if (this._cream) { this._cream.style.transition = 'opacity 400ms ease'; this._cream.style.opacity = '1'; }
    }

    _build() {
      if (!this.isConnected) return;
      if (this._dead && !this._plate && !this._cream) this._dead = false;
      if (this._dead) return;
      const G = window.AR_ELEV;
      if (!G) { this.style.display = 'none'; return; }
      const w = this.clientWidth || 1200, hEl = this.clientHeight || 800;
      const h = Math.min(hEl, window.innerHeight || hEl);
      if (w < 40 || h < 40) { requestAnimationFrame(() => this._build()); return; }
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const seen = location.hash === '#doors';
      const reduce = this._skip || seen || matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) document.documentElement.classList.add('ns-skip');

      const mkCanvas = (height) => {
        const c = document.createElement('canvas');
        c.width = Math.round(w * dpr); c.height = Math.round(height * dpr);
        c.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:' + height + 'px;display:block';
        const x = c.getContext('2d');
        x.scale(dpr, dpr);
        return [c, x];
      };

      // ---------- Act 3 layer: cream watermark, painted first, revealed last.
      // It lives in #ns-topo when the page provides one, so the contours run
      // past the hero and down to the footer.
      const host = document.getElementById('ns-topo') || this;
      const hostH = Math.max(host.clientHeight || hEl, hEl);
      const cream = document.createElement('div');
      cream.style.cssText = 'position:absolute;top:0;left:0;right:0;height:' + hostH + 'px;opacity:0;pointer-events:none;transition:opacity 1400ms cubic-bezier(.2,.7,.25,1)';
      const [wc, wx] = mkCanvas(hostH);
      cream.appendChild(wc);
      host.appendChild(cream);
      this._cream = cream;
      {
        // One pass, no tiling. Mirrored tiles met at a seam and the contours
        // turned back on themselves there, which read as chevrons rather than
        // ground. Instead the relief is enlarged until a single sheet covers the
        // whole column and the sides are cropped: what you see is a real slice
        // of Arkansas, Ozarks at the top, Ouachita ridges through the middle,
        // Delta running out flat to the east.
        const g0 = geometry(w, hostH, 1.22, false, true);
        const grow = Math.min(3.4, Math.max(1, hostH / g0.gridH));
        const g = geometry(w * grow, hostH, 1.22, false, true);
        const bands = contourPaths(g.proj, G);
        wx.save();
        wx.translate(-(w * grow - w) / 2, 0);
        // if the column is taller than even the grown sheet, take up the last of
        // it with a gentle vertical stretch instead of a second tile
        const fill = hostH / (g.gridH || hostH);
        if (fill > 1.02) { wx.translate(0, g.gridTop); wx.scale(1, fill); wx.translate(0, -g.gridTop); }
        for (let l = 0; l < bands.length; l++) {
          const major = l % 5 === 0;
          // A printed line, not an embossed haze: the ink carries the shape and
          // the pale edge is only there to seat it in the paper.
          wx.save();
          wx.translate(0, 0.75);
          wx.globalAlpha = major ? 0.3 : 0.18;
          wx.lineWidth = major ? 1 : 0.6;
          wx.strokeStyle = 'rgba(255,253,244,0.9)';
          wx.stroke(bands[l]);
          wx.restore();
          wx.globalAlpha = major ? 0.3 : 0.17;
          wx.lineWidth = major ? 1 : 0.6;
          wx.strokeStyle = 'rgb(32,37,58)';
          wx.stroke(bands[l]);
        }
        wx.restore();
      }

      // ---------- Act 1 + 2 layer: midnight plate
      const plate = document.createElement('div');
      plate.style.cssText = 'position:absolute;top:0;left:0;right:0;height:' + hEl + 'px;background:radial-gradient(125% 100% at 50% 18%, #2b3150 0%, rgba(28,33,52,.98) 55%, #121624 100%);overflow:hidden';
      const [cv, ctx] = mkCanvas(h);
      cv.style.willChange = 'transform,opacity';
      plate.appendChild(cv);
      this.appendChild(plate);
      this._plate = plate;

      const g = geometry(w, h, 0.78);
      const ring = g.ring, statePath = g.path;
      const wh = g.proj(WHITE_HALL[0], WHITE_HALL[1]);
      const bands = contourPaths(g.proj, G);

      const cum = [0];
      for (let i = 1; i < ring.length; i++) cum.push(cum[i - 1] + Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]));
      const perim = cum[cum.length - 1];

      // contours accumulate on a layer canvas, drawn once each
      const [layer, lx] = mkCanvas(h);
      lx.save(); lx.globalAlpha = 0.05; lx.fillStyle = 'rgb(' + BRONZE + ')'; lx.fill(statePath); lx.restore();
      lx.save(); lx.clip(statePath);
      let drawn = 0;

      let start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const draw = (now) => {
        if (this._dead) return;
        // While held, time stops at the moment the outline completes. The
        // contour and marker gates below never open, so the frame is still.
        const t = this._held ? (T_OUTLINE + T_OUTLINE_DUR) : (now - start);
        ctx.clearRect(0, 0, w, h);

        while (!this._held && drawn < bands.length && t > T_CONTOUR + this._off + drawn * 105) {
          const major = drawn % 5 === 0;
          lx.globalAlpha = major ? 0.72 : 0.28;
          lx.lineWidth = major ? 1.3 : 0.65;
          lx.strokeStyle = 'rgb(' + BRONZE + ')';
          lx.stroke(bands[drawn]);
          drawn++;
        }
        ctx.save();
        ctx.globalAlpha = clamp01((t - T_CONTOUR - this._off) / 700);
        ctx.drawImage(layer, 0, 0, w, h);
        ctx.restore();

        const op = clamp01((t - T_OUTLINE) / T_OUTLINE_DUR);
        if (op > 0) {
          const target = easeOut(op) * perim;
          ctx.save();
          ctx.globalAlpha = this._held ? 1 : 0.92;
          ctx.strokeStyle = 'rgb(' + ARCTIC + ')';
          ctx.lineWidth = this._held ? 2.4 : 1.5;
          if (this._held) { ctx.shadowColor = 'rgba(' + ARCTIC + ',.5)'; ctx.shadowBlur = 14; }
          ctx.beginPath();
          ctx.moveTo(ring[0][0], ring[0][1]);
          for (let i = 1; i < ring.length; i++) {
            if (cum[i] <= target) { ctx.lineTo(ring[i][0], ring[i][1]); continue; }
            const f = (target - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
            ctx.lineTo(ring[i - 1][0] + (ring[i][0] - ring[i - 1][0]) * f, ring[i - 1][1] + (ring[i][1] - ring[i - 1][1]) * f);
            break;
          }
          ctx.stroke();
          ctx.restore();
        }

        const ma = clamp01((t - 1800 - this._off) / 700);
        if (ma > 0) {
          const pulse = 0.5 + 0.5 * Math.sin(t / 420);
          ctx.save();
          ctx.globalAlpha = ma * (0.18 + 0.32 * (1 - pulse));
          ctx.strokeStyle = 'rgb(' + BRONZE + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(wh[0], wh[1], 13 + pulse * 19, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = ma;
          ctx.fillStyle = 'rgb(' + BRONZE + ')';
          ctx.beginPath(); ctx.arc(wh[0], wh[1], 3.4, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }

        if (this._held) {
          // park: redraw only when release() asks for it
          this._resume = () => { start = performance.now() - (T_OUTLINE + T_OUTLINE_DUR); this._raf = requestAnimationFrame(draw); };
          return;
        }
        if (t < T_ZOOM + this._off) { this._raf = requestAnimationFrame(draw); return; }
        this._drive({ ctx: ctx, w: w, h: h, wh: wh, ring: ring, bands: bands, statePath: statePath, dpr: dpr });
      };

      if (reduce) {
        this._held = false;
        draw(start + T_ZOOM - 1);
        plate.style.display = 'none';
        cream.style.transition = 'none';
        cream.style.opacity = '1';
        this._dead = true;
        this._settled();
        return;
      }
      this._raf = requestAnimationFrame(draw);
    }

    // Act 2: fly into the marker. Everything is re-drawn as vector each frame
    // (no raster upscale), so nothing softens on the way in.
    _drive(S) {
      const ctx = S.ctx, w = S.w, h = S.h, wh = S.wh, ring = S.ring, bands = S.bands, dpr = S.dpr;
      const plate = this._plate, cream = this._cream;
      const statePath = S.statePath;
      const K = 34;
      const t0 = performance.now();
      const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const lerp = (a, b, t) => a + (b - a) * t;

      plate.style.transition = 'opacity 900ms cubic-bezier(.4,0,.2,1) ' + (T_ZOOM_DUR - 780) + 'ms';
      cream.style.opacity = '1';
      requestAnimationFrame(() => { plate.style.opacity = '0'; });

      const frame = (now) => {
        if (this._dead) return;
        const p = clamp01((now - t0) / T_ZOOM_DUR);
        const s = 1 + (K - 1) * ease(p);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.translate(wh[0] * (1 - s), wh[1] * (1 - s));
        ctx.scale(s, s);

        const fieldA = 1 - clamp01((p - 0.16) / 0.26);
        const majorA = 1 - clamp01((p - 0.3) / 0.3);
        if (majorA > 0) {
          ctx.save();
          ctx.clip(statePath);
          ctx.strokeStyle = 'rgb(' + BRONZE + ')';
          for (let l = 0; l < bands.length; l++) {
            const major = l % 5 === 0;
            const a = major ? majorA * 0.72 : fieldA * 0.28;
            if (a <= 0.01) continue;
            ctx.globalAlpha = a;
            ctx.lineWidth = (major ? 1.3 : 0.65) / s;
            ctx.stroke(bands[l]);
          }
          ctx.restore();
        }

        const outA = 1 - clamp01((p - 0.22) / 0.3);
        if (outA > 0) {
          ctx.globalAlpha = outA * 0.9;
          ctx.strokeStyle = 'rgb(' + ARCTIC + ')';
          ctx.lineWidth = 1.5 / s;
          ctx.beginPath();
          ctx.moveTo(ring[0][0], ring[0][1]);
          for (let i = 1; i < ring.length; i++) ctx.lineTo(ring[i][0], ring[i][1]);
          ctx.closePath();
          ctx.stroke();
        }

        // survey rings around the marker, crisp all the way in
        ctx.strokeStyle = 'rgb(' + BRONZE + ')';
        for (let r = 0; r < 4; r++) {
          const rad = 13 + r * 15;
          const a = (1 - clamp01((rad * s) / (Math.max(w, h) * 1.7))) * 0.5;
          if (a <= 0.01) continue;
          ctx.globalAlpha = a;
          ctx.lineWidth = 1 / s;
          ctx.beginPath(); ctx.arc(wh[0], wh[1], rad, 0, Math.PI * 2); ctx.stroke();
        }

        // the marker itself, warming to cream as it fills the frame
        const warm = clamp01((p - 0.55) / 0.4);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgb(' + Math.round(lerp(183, 245, warm)) + ',' + Math.round(lerp(149, 244, warm)) + ',' + Math.round(lerp(80, 225, warm)) + ')';
        ctx.beginPath(); ctx.arc(wh[0], wh[1], 3.4, 0, Math.PI * 2); ctx.fill();

        if (p < 1) { this._raf = requestAnimationFrame(frame); return; }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        plate.style.display = 'none';
        this._settled();
      };
      this._raf = requestAnimationFrame(frame);
    }
  }

  if (!customElements.get('arkansas-intro')) customElements.define('arkansas-intro', ArkansasIntro);
})();
