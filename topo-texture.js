/**
 * Interior-page continuity: the landing page's contour motif, carried inward.
 *
 *   <topo-texture>   faint relief field painted behind a section
 *   <contour-rule>   a section divider that draws itself in on first view,
 *                    the same gesture as the hero's Arkansas outline
 *
 * Both read window.AR_ELEV when it is present (real sampled Arkansas relief)
 * and fall back to a smooth synthetic field when it is not. Both honor
 * prefers-reduced-motion by rendering their finished state immediately.
 */
(function () {
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  function field() {
    const G = window.AR_ELEV;
    if (G && G.data) {
      const cols = G.cols, rows = G.rows;
      const raw = new Float32Array(cols * rows);
      for (let k = 0; k < cols * rows; k++) raw[k] = G.data.charCodeAt(k);
      return { vals: smoothField(raw, cols, rows, 2), cols, rows };
    }
    const cols = 64, rows = 44, vals = new Float32Array(cols * rows);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        vals[j * cols + i] =
          Math.sin(i / 7.5) * 26 + Math.cos(j / 5.5) * 22 +
          Math.sin((i + j) / 11) * 16 + Math.cos((i - j) / 9) * 12 + 100;
      }
    }
    return { vals, cols, rows };
  }

  class TopoTexture extends HTMLElement {
    connectedCallback() {
      if (this._done) return;
      this._done = true;
      this.setAttribute('aria-hidden', 'true');
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>:host{display:block;position:absolute;inset:0;overflow:hidden;pointer-events:none}</style>';
      requestAnimationFrame(() => this._paint());
      this._ro = new ResizeObserver(() => { clearTimeout(this._t); this._t = setTimeout(() => this._paint(), 160); });
      this._ro.observe(this.parentElement || this);
    }
    disconnectedCallback() { if (this._ro) this._ro.disconnect(); }

    _paint() {
      const box = this.getBoundingClientRect();
      const host = this.parentElement ? this.parentElement.getBoundingClientRect() : box;
      const w = Math.round(box.width || host.width), h = Math.round(box.height || host.height);
      if (w < 40 || h < 30) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const root = this.shadowRoot;
      let cv = root.querySelector('canvas');
      if (!cv) {
        cv = document.createElement('canvas');
        cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
        root.appendChild(cv);
      }
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const F = field();
      let lo = Infinity, hi = -Infinity;
      for (let k = 0; k < F.vals.length; k++) { const v = F.vals[k]; if (v < lo) lo = v; if (v > hi) hi = v; }

      const ink = this.getAttribute('ink') || '32,37,58';
      const base = parseFloat(this.getAttribute('opacity') || '0.055');
      const scale = parseFloat(this.getAttribute('scale') || '1');
      // cover the box, biased wide so the lines read as long sweeps
      const gw = w * 1.35 * scale, gh = gw * (F.rows / F.cols);
      const sx = gw / (F.cols - 1), sy = gh / (F.rows - 1);
      const ox = (w - gw) / 2, oy = (h - gh) / 2;
      const levels = 13;

      for (let l = 0; l < levels; l++) {
        const level = lo + (hi - lo) * (0.15 + 0.85 * Math.pow((l + 1) / (levels + 1), 1.3));
        const major = l % 5 === 0;
        const segs = isolines(F.vals, F.cols, F.rows, level);
        ctx.beginPath();
        for (let s = 0; s < segs.length; s++) {
          const g = segs[s];
          ctx.moveTo(ox + g[0] * sx, oy + g[1] * sy);
          ctx.lineTo(ox + g[2] * sx, oy + g[3] * sy);
        }
        ctx.globalAlpha = major ? base * 2.1 : base;
        ctx.lineWidth = major ? 1.1 : 0.7;
        ctx.strokeStyle = 'rgb(' + ink + ')';
        ctx.stroke();
      }
    }
  }

  class ContourRule extends HTMLElement {
    connectedCallback() {
      if (this._done) return;
      this._done = true;
      this.setAttribute('aria-hidden', 'true');
      const color = this.getAttribute('color') || '#B79550';
      const h = 14;
      const d = 'M0,9 C90,9 120,3 210,3 C300,3 340,11 430,11 C520,11 560,4 650,4 C740,4 780,10 870,10 C960,10 1000,5 1100,5';
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML =
        '<style>:host{display:block;width:100%;height:' + h + 'px;line-height:0}</style>' +
        '<svg viewBox="0 0 1100 14" preserveAspectRatio="none" style="width:100%;height:' + h + 'px;display:block;overflow:visible">' +
        '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.25" vector-effect="non-scaling-stroke"/></svg>';
      const path = root.querySelector('path');
      if (reduce()) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      const io = new IntersectionObserver((ents) => {
        ents.forEach(en => {
          if (!en.isIntersecting) return;
          path.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.2,.7,.25,1)';
          path.style.strokeDashoffset = '0';
          io.disconnect();
        });
      }, { rootMargin: '0px 0px -12% 0px' });
      io.observe(this);
    }
  }

  if (!customElements.get('topo-texture')) customElements.define('topo-texture', TopoTexture);
  if (!customElements.get('contour-rule')) customElements.define('contour-rule', ContourRule);
})();
