/* Site menu and "Keep going" hand-off, shared by every page.
   <ns-site-nav current="about" tone="light|dark" wait-intro></ns-site-nav>
   <ns-keep-going to="education"></ns-keep-going>
   Links resolve to the .dc.html sources while editing and to the clean published
   filenames once built, so one file serves both. */
(function () {
  if (customElements.get('ns-site-nav')) return;
  var ITEMS = [
    ['education', 'Education', 'education/index.html', 'education/index.html'],
    ['flower', 'Find Our Flower', 'Find Our Flower.dc.html', 'find-our-flower.html'],
    ['about', 'About Us', 'About Us.dc.html', 'about.html'],
    ['card', 'How to Get a Card', 'How to Get a Card.dc.html', 'get-a-card.html'],
    ['allotment', 'Check Your Allotment', 'Check Your Allotment.dc.html', 'allotment.html'],
    ['contact', 'Contact Us', 'Contact Us.dc.html', 'contact.html'],
    ['paperwork', 'Your Paperwork', 'Your Paperwork.dc.html', 'paperwork.html']
  ];
  var MENU = ['education', 'flower', 'about', 'card', 'allotment', 'contact'];
  function isSrc() { return /\.dc\.html$/i.test(decodeURIComponent(location.pathname)); }
  function item(k) { for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i][0] === k) return ITEMS[i]; return null; }
  function href(k) { var it = item(k); return it ? (isSrc() ? it[2] : it[3]) : '#'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  var CSS = '' +
    ':host{display:flex;flex:1 1 auto;min-width:0;justify-content:flex-end;align-items:center;font-family:var(--font-label,"Caligor Sans","Work Sans",sans-serif)}' +
    '.bar{display:flex;align-items:center;gap:clamp(14px,1.6vw,24px);margin:0;padding:0;list-style:none;white-space:nowrap}' +
    '.bar a{display:inline-flex;align-items:center;min-height:44px;font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;color:var(--nav-ink);border-bottom:1px solid transparent;transition:color .22s ease,border-color .22s ease}' +
    '.bar a:hover{color:var(--nav-hover)}' +
    '.bar a[aria-current="page"]{color:var(--nav-cur);box-shadow:inset 0 -1px 0 var(--nav-cur)}' +
    '.bar a{min-height:auto;padding:14px 0}' +
    'a:focus-visible,button:focus-visible{outline:2px solid var(--nav-focus);outline-offset:3px;border-radius:2px}' +
    '.btn{display:none;align-items:center;gap:10px;min-height:44px;padding:0 14px;background:none;border:1px solid var(--nav-line);border-radius:4px;cursor:pointer;color:var(--nav-ink);font:inherit;font-size:10.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase}' +
    '.btn:hover{border-color:var(--nav-hover);color:var(--nav-hover)}' +
    '.burger{display:inline-flex;flex-direction:column;gap:4px;width:16px}.burger i{display:block;height:1.5px;background:currentColor}' +
    ':host(.compact) .bar{display:none}:host(.compact) .btn{display:inline-flex}' +
    '.panel{position:fixed;inset:0;z-index:900;background:#20253A;display:flex;flex-direction:column;opacity:0;visibility:hidden;transition:opacity .28s cubic-bezier(.2,.7,.25,1),visibility 0s linear .28s;overflow-y:auto;-webkit-overflow-scrolling:touch}' +
    '.panel.open{opacity:1;visibility:visible;transition:opacity .28s cubic-bezier(.2,.7,.25,1)}' +
    '.top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px clamp(20px,5vw,48px);min-height:62px;box-sizing:border-box;border-bottom:1px solid rgba(245,244,225,.14)}' +
    '.brand{font-size:10.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(245,244,225,.8);text-decoration:none}' +
    '.x{width:44px;height:44px;display:grid;place-items:center;background:none;border:1px solid rgba(245,244,225,.34);border-radius:4px;color:#F5F4E1;font-size:20px;line-height:1;cursor:pointer}' +
    '.x:hover{border-color:#B79550;color:#B79550}' +
    '.list{flex:1;display:flex;flex-direction:column;justify-content:center;gap:4px;margin:0;padding:28px clamp(24px,7vw,56px) 48px;list-style:none}' +
    '.list a{display:flex;align-items:baseline;gap:14px;min-height:52px;padding:8px 0;font-family:var(--font-display,"Burford",Georgia,serif);font-weight:400;font-size:clamp(30px,8.4vw,44px);line-height:1.04;letter-spacing:-.01em;color:#F5F4E1;text-decoration:none;border-bottom:1px solid rgba(245,244,225,.1)}' +
    '.list a:hover{color:#B79550}' +
    '.list a[aria-current="page"]{color:#B79550}' +
    '.list a small{font-family:var(--font-label,"Caligor Sans","Work Sans",sans-serif);font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(245,244,225,.6)}' +
    '.panel a:focus-visible,.panel button:focus-visible{outline-color:#B79550}' +
    '@media (prefers-reduced-motion: reduce){.panel,.panel.open}';

  class NsSiteNav extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var cur = this.getAttribute('current') || '';
      var dark = this.getAttribute('tone') === 'dark';
      var root = this.attachShadow({ mode: 'open' });
      var vars = dark
        ? '--nav-ink:rgba(245,244,225,.84);--nav-hover:#B79550;--nav-cur:#B79550;--nav-line:rgba(245,244,225,.4);--nav-focus:#B79550;'
        : '--nav-ink:#20253A;--nav-hover:#7A5F28;--nav-cur:#7A5F28;--nav-line:rgba(32,37,58,.28);--nav-focus:#7A5F28;';
      var links = MENU.map(function (k) {
        var it = item(k), on = k === cur;
        return '<li><a href="' + esc(href(k)) + '"' + (on ? ' aria-current="page"' : '') + '>' + esc(it[1]) + '</a></li>';
      }).join('');
      var big = MENU.map(function (k) {
        var it = item(k), on = k === cur;
        return '<li><a href="' + esc(href(k)) + '"' + (on ? ' aria-current="page"' : '') + '>' + esc(it[1]) + (on ? '<small>You are here</small>' : '') + '</a></li>';
      }).join('');
      root.innerHTML = '<style>:host{' + vars + '}' + CSS + '</style>' +
        '<nav aria-label="Site"><ul class="bar">' + links + '</ul>' +
        '<button class="btn" type="button" aria-haspopup="dialog" aria-expanded="false"><span class="burger" aria-hidden="true"><i></i><i></i><i></i></span>Menu</button></nav>';
      // the panel lives at the end of <body>: a sticky header with backdrop blur
      // would otherwise become its containing block and clip it to the bar
      var pHost = document.createElement('div');
      pHost.setAttribute('data-ns-menu', '');
      document.body.appendChild(pHost);
      this._pHost = pHost;
      var pr = pHost.attachShadow({ mode: 'open' });
      this._pr = pr;
      pr.innerHTML = '<style>:host{' + vars + '}' + CSS + '</style>' +
        '<div class="panel" role="dialog" aria-modal="true" aria-label="Site menu">' +
        '<div class="top"><a class="brand" href="' + (isSrc() ? 'Natural State Medicinals.dc.html#doors' : 'index.html#doors') + '">Natural State Medicinals</a>' +
        '<button class="x" type="button" aria-label="Close menu">&times;</button></div>' +
        '<ul class="list">' + big + '</ul></div>';
      this._bar = root.querySelector('.bar');
      this._btn = root.querySelector('.btn');
      this._panel = pr.querySelector('.panel');
      this._x = pr.querySelector('.x');
      var self = this;
      this._btn.addEventListener('click', function () { self.open(); });
      this._x.addEventListener('click', function () { self.close(); });
      this._panel.addEventListener('click', function (e) {
        var t = e.composedPath ? e.composedPath()[0] : e.target;
        if (t === self._panel || (t.classList && (t.classList.contains('list') || t.classList.contains('top')))) self.close();
      });
      this._onKey = function (e) {
        if (!self._panel.classList.contains('open')) return;
        if (e.key === 'Escape') { e.preventDefault(); self.close(); return; }
        if (e.key === 'Tab') {
          var f = Array.prototype.slice.call(self._panel.querySelectorAll('a,button'));
          var a = self._pr.activeElement, i = f.indexOf(a);
          if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        }
      };
      document.addEventListener('keydown', this._onKey);
      // compact below 760px, or whenever the full menu does not fit beside the brand.
      // Measured without toggling classes, so layout can never feed back into itself.
      this._fit = function () {
        var want = window.innerWidth < 760;
        if (!want) {
          var need = 0, lis = self._bar.children, gap = parseFloat(getComputedStyle(self._bar).columnGap) || 0;
          if (self._needW == null && !self.classList.contains('compact')) self._needW = self._bar.scrollWidth;
          need = self._needW || 0;
          var p = self.parentElement, avail = self.clientWidth;
          if (p) { var used = 0; for (var i = 0; i < p.children.length; i++) { var c = p.children[i]; if (c !== self) used += c.getBoundingClientRect().width; } var cs = getComputedStyle(p); avail = p.clientWidth - used - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0) - (parseFloat(cs.columnGap) || 0) * (p.children.length - 1); }
          want = need > avail + 1;
        }
        if (want !== self.classList.contains('compact')) self.classList.toggle('compact', want);
      };
      var rT = 0;
      this._onResize = function () { clearTimeout(rT); rT = setTimeout(self._fit, 80); };
      window.addEventListener('resize', this._onResize);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { self._needW = null; self.classList.remove('compact'); self._fit(); });
      setTimeout(this._fit, 0);
      if (this.hasAttribute('wait-intro')) {
        // the shell around the menu (the landing pill) waits with it. Driven from a
        // class on <html> so the page's own re-renders cannot reset it.
        if (!document.getElementById('ns-nav-wait-css')) {
          var cs = document.createElement('style'); cs.id = 'ns-nav-wait-css';
          cs.textContent = 'html.ns-nav-wait [data-nav-shell],html.ns-nav-wait ns-site-nav[wait-intro]{opacity:0!important;visibility:hidden!important;pointer-events:none!important}' +
            '[data-nav-shell]{transition:opacity .42s cubic-bezier(.2,.7,.25,1)}@media (prefers-reduced-motion: reduce){[data-nav-shell]{transition:none}}';
          document.head.appendChild(cs);
        }
        document.documentElement.classList.add('ns-nav-wait');
        var mo = null, shown = false;
        var show = function () { if (shown) return; shown = true; if (mo) mo.disconnect(); document.documentElement.classList.remove('ns-nav-wait'); self._fit(); };
        if (location.hash === '#doors' || document.documentElement.classList.contains('ns-skip')) show();
        document.addEventListener('ns-intro-settled', show);
        // the skip button adds html.ns-skip; catch it even if no event follows
        if (!shown) { mo = new MutationObserver(function () { if (document.documentElement.classList.contains('ns-skip')) show(); });
          mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] }); }
      }
    }
    disconnectedCallback() {
      document.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      if (this._pHost) this._pHost.remove();
      this._unlock();
    }
    open() {
      this._last = document.activeElement;
      this._panel.classList.add('open');
      this._btn.setAttribute('aria-expanded', 'true');
      this._lockY = window.scrollY;
      this._prevOv = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      var first = this._panel.querySelector('.list a');
      setTimeout(function () { if (first) first.focus(); }, 30);
    }
    close() {
      if (!this._panel.classList.contains('open')) return;
      this._panel.classList.remove('open');
      this._btn.setAttribute('aria-expanded', 'false');
      this._unlock();
      this._btn.focus();
    }
    _unlock() { if (this._prevOv != null) { document.documentElement.style.overflow = this._prevOv; this._prevOv = null; } }
  }
  customElements.define('ns-site-nav', NsSiteNav);

  class NsKeepGoing extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var k = this.getAttribute('to') || 'education', it = item(k);
      if (!it) return;
      var dark = this.getAttribute('tone') === 'dark';
      var ink = dark ? '#F5F4E1' : '#20253A', lab = dark ? '#B79550' : '#7A5F28', line = dark ? 'rgba(245,244,225,.16)' : 'rgba(32,37,58,.12)';
      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>' +
        ':host{display:block}' +
        '.wrap{max-width:var(--kg-max,1180px);margin:0 auto;padding:clamp(28px,4vw,44px) clamp(20px,5vw,48px);box-sizing:border-box;display:flex;justify-content:flex-end;border-top:1px solid ' + line + '}' +
        'a{display:inline-flex;align-items:baseline;gap:14px;flex-wrap:wrap;min-height:44px;text-decoration:none;color:' + ink + '}' +
        '.k{font-family:var(--font-label,"Caligor Sans","Work Sans",sans-serif);font-size:10.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:' + lab + '}' +
        '.t{font-family:var(--font-display,"Burford",Georgia,serif);font-weight:400;font-size:clamp(22px,2.2vw,28px);line-height:1.1;letter-spacing:-.01em;transition:color .22s ease}' +
        'a:hover .t{color:' + lab + '}' +
        'a:focus-visible{outline:2px solid ' + lab + ';outline-offset:4px;border-radius:2px}' +
        '</style><div class="wrap"><a href="' + esc(href(k)) + '"><span class="k">Keep going &rarr;</span><span class="t">' + esc(it[1]) + '</span></a></div>';
    }
  }
  customElements.define('ns-keep-going', NsKeepGoing);
})();
