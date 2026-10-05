/**
 * <ns-age-gate> — the door.
 *
 * An overlay, not a block. The page underneath renders and is readable by
 * crawlers; only the person is stopped. A yes is remembered for 30 days.
 *
 * On the landing page the intro holds on a finished Arkansas outline and the
 * box fades in over it; the gate calls release() on <arkansas-intro> once the
 * box has gone. Everywhere else the gate paints its own midnight panel, since
 * there is no outline to sit on.
 *
 * Attributes:
 *   variant="a" | "b"   box treatment (a: arctic card, b: midnight card)
 *   no-href             where a No goes. Default "rules.html".
 *   delay="1200"        ms to wait before the box appears, so a page with its
 *                       own opening (the education guide) can finish first.
 *
 * A yes always holds for the session, so moving between pages does not ask
 * again. Ticking "Remember me for 30 days" persists it past the session.
 *
 * Fires "ns-gate-passed" on document when the box is gone.
 */
(function () {
  if (customElements.get('ns-age-gate')) return;

  // Read config off this script tag, so the gate needs no markup in the page.
  var SELF = document.currentScript;
  var CFG = {
    variant: (SELF && SELF.getAttribute('data-variant')) || 'b',
    noHref: (SELF && SELF.getAttribute('data-no-href')) || 'rules.html',
    leaf: (SELF && SELF.getAttribute('data-leaf')) || null,
    delay: (SELF && SELF.getAttribute('data-delay')) || null
  };

  var KEY = 'nsm-age-ok';
  var DAYS = 30;

  function remembered() {
    try {
      if (sessionStorage.getItem(KEY)) return true;
      var v = localStorage.getItem(KEY);
      if (!v) return false;
      if ((Date.now() - parseInt(v, 10)) < DAYS * 864e5) return true;
      localStorage.removeItem(KEY);
      return false;
    } catch (e) { return false; }
  }
  // The session note is unconditional: the gate covers every page, so without
  // it a patient would be asked again on every click.
  function remember(persist) {
    try {
      sessionStorage.setItem(KEY, '1');
      if (persist) localStorage.setItem(KEY, String(Date.now()));
    } catch (e) {}
  }

  var QUESTION = 'Are you 18 or older, or an Arkansas medical cannabis patient or caregiver?';
  // gold reads on both the arctic card and the midnight one; the plain mark is
  // the light nav version and disappears on arctic
  var LEAF = 'assets/brand/nav-mark-fanleaf-gold.png';

  class NsAgeGate extends HTMLElement {
    connectedCallback() {
      // A re-parse of the host (React writing markup back out) produces an
      // element that kept its children but lost its JS state, so it builds a
      // second box on top of the first and the visible one is not the one wired
      // to anything. Clearing first makes the newest build the live one.
      if (this._up) return;
      this._up = true;
      if (window.__nsGatePassed) { this._pass(true); return; }
      while (this.firstChild) this.removeChild(this.firstChild);

      // The host element cannot style itself: React reconciliation on the page
      // rewrites its style attribute and the gate collapses to a static 0x0
      // inline box, dropping behind sticky headers and anchoring to the
      // document instead of the viewport. A stylesheet is out of its reach.
      if (!document.getElementById('ns-gate-css')) {
        var st = document.createElement('style');
        st.id = 'ns-gate-css';
        st.textContent =
          'ns-age-gate { display:none; pointer-events:none; }' +
          'html.ns-gated ns-age-gate { position:fixed; inset:0; z-index:2147483000; display:block; pointer-events:auto; }' +
          'html.ns-gated .ns-skipbtn, html.ns-gated [data-gate-hide] { visibility:hidden !important; }' +
          'html.ns-gated { overflow:hidden; }' +
          // The page's own entrance animations run on a fixed clock from load, so
          // the lockup would fly in behind the closed gate and be spent by the
          // time anyone answered. Freeze everything outside the box; paused
          // animations hold at frame zero and play in full once the door opens.
          'html.ns-gated *, html.ns-gated *::before, html.ns-gated *::after { animation-play-state:paused !important; }' +
          'html.ns-gated ns-age-gate, html.ns-gated ns-age-gate *, html.ns-gated ns-age-gate *::before, html.ns-gated ns-age-gate *::after { animation-play-state:running !important; }';
        document.head.appendChild(st);
      }

      var intro = document.querySelector('arkansas-intro');
      this._intro = intro;
      if (intro) {
        intro._gateSeen = true;
        if (intro._holdBail) { clearInterval(intro._holdBail); intro._holdBail = null; }
      }

      if (remembered()) { this._pass(true); return; }

      // Nothing on the page should be reachable while the door is shut. The
      // landing page's skip control in particular sits above everything. This
      // class is also what makes the host visible at all.
      document.documentElement.classList.add('ns-gated');

      var onLanding = !!intro;
      var v = (this.getAttribute('variant') || 'a').toLowerCase();
      var leaf = this.getAttribute('leaf') || LEAF;

      // Backdrop. On the landing page the intro already owns a midnight plate,
      // so the gate only needs to darken it a touch and keep clicks off the page.
      var back = document.createElement('div');
      back.style.cssText = 'position:absolute;inset:0;opacity:0;transition:opacity 700ms cubic-bezier(.2,.7,.25,1);' +
        (onLanding
          ? 'background:rgba(18,22,36,.26)'
          : 'background:radial-gradient(120% 100% at 50% 20%, #2b3150 0%, rgba(28,33,52,.985) 55%, #121624 100%)');
      this.appendChild(back);

      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:clamp(18px,5vw,48px)';
      this.appendChild(wrap);

      var paper = v === 'b';
      var box = document.createElement('div');
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', 'Age confirmation');
      box.style.cssText =
        'box-sizing:border-box;width:100%;max-width:' + (paper ? '540px' : '470px') + ';text-align:center;' +
        'padding:' + (paper ? 'clamp(30px,4.4vw,46px) clamp(26px,4vw,52px) clamp(26px,3.6vw,40px)' : 'clamp(34px,4.6vw,50px) clamp(26px,4vw,44px) clamp(28px,3.8vw,42px)') + ';' +
        (paper
          ? 'background:#20253A;border:1px solid rgba(183,149,80,.42);border-radius:3px;box-shadow:0 40px 110px rgba(10,13,22,.6)'
          : 'background:#F5F4E1;border:1px solid rgba(32,37,58,.14);border-radius:3px;box-shadow:0 2px 6px rgba(10,13,22,.3), 0 44px 120px rgba(10,13,22,.55)') + ';' +
        'opacity:0;transform:scale(.94);transition:opacity 620ms cubic-bezier(.2,.7,.25,1), transform 720ms cubic-bezier(.2,.7,.25,1)';
      wrap.appendChild(box);

      var ink = paper ? '#F5F4E1' : '#20253A';
      var soft = paper ? 'rgba(245,244,225,.74)' : 'rgba(32,37,58,.78)';

      var inner = document.createElement('div');
      inner.style.cssText = 'transition:opacity 260ms ease';
      box.appendChild(inner);

      var mark = document.createElement('img');
      mark.src = leaf;
      mark.alt = '';
      mark.setAttribute('aria-hidden', 'true');
      mark.style.cssText = 'display:block;width:44px;height:auto;margin:0 auto clamp(18px,2.4vw,26px);opacity:' + (paper ? '.95' : '.9');
      inner.appendChild(mark);

      var q = document.createElement('p');
      q.textContent = QUESTION;
      q.style.cssText = 'margin:0;font-family:var(--font-sans),"Work Sans",system-ui,sans-serif;' +
        'font-size:clamp(16px,1.5vw,18.5px);line-height:1.6;text-wrap:pretty;color:' + soft + ';max-width:34ch;margin-left:auto;margin-right:auto';
      inner.appendChild(q);

      var row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:12px;justify-content:center;margin-top:clamp(24px,3.2vw,34px)';
      inner.appendChild(row);

      var mkBtn = function (label, primary) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.style.cssText = 'min-width:132px;min-height:48px;padding:0 26px;cursor:pointer;border-radius:4px;' +
          'font-family:var(--font-label),var(--font-sans),"Work Sans",sans-serif;font-size:11.5px;font-weight:600;' +
          'letter-spacing:.2em;text-transform:uppercase;transition:background 220ms ease, color 220ms ease, border-color 220ms ease;' +
          (primary
            ? 'background:#B79550;color:#20253A;border:1px solid #B79550'
            : 'background:transparent;color:' + soft + ';border:1px solid ' + (paper ? 'rgba(245,244,225,.32)' : 'rgba(32,37,58,.26)'));
        b.addEventListener('mouseenter', function () {
          if (primary) { b.style.background = '#97793c'; b.style.borderColor = '#97793c'; }
          else { b.style.background = paper ? 'rgba(245,244,225,.1)' : 'rgba(32,37,58,.07)'; b.style.color = ink; }
        });
        b.addEventListener('mouseleave', function () {
          if (primary) { b.style.background = '#B79550'; b.style.borderColor = '#B79550'; }
          else { b.style.background = 'transparent'; b.style.color = soft; }
        });
        return b;
      };

      var yes = mkBtn('Yes', true);
      var no = mkBtn('No', false);
      row.appendChild(yes);
      row.appendChild(no);

      var keepWrap = document.createElement('label');
      keepWrap.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:9px;cursor:pointer;' +
        'margin:clamp(18px,2.4vw,24px) 0 0;font-family:var(--font-sans),"Work Sans",sans-serif;font-size:13px;color:' + soft;
      var keep = document.createElement('input');
      keep.type = 'checkbox';
      keep.checked = true;
      keep.setAttribute('checked', '');
      keep.style.cssText = 'width:16px;height:16px;margin:0;cursor:pointer;accent-color:#B79550;flex:none';
      var keepTxt = document.createElement('span');
      keepTxt.textContent = 'Remember me for 30 days';
      keepWrap.appendChild(keep);
      keepWrap.appendChild(keepTxt);
      inner.appendChild(keepWrap);
      this._keep = keep;

      var fine = document.createElement('p');
      fine.textContent = 'For qualifying Arkansas patients. We do not sell direct.';
      fine.style.cssText = 'margin:clamp(20px,2.6vw,28px) 0 0;font-size:12px;line-height:1.6;color:' +
        (paper ? 'rgba(245,244,225,.44)' : 'rgba(32,37,58,.5)');
      inner.appendChild(fine);

      var self = this;
      yes.addEventListener('click', function () { self._yes(box, inner, back, ink); });
      no.addEventListener('click', function () {
        window.location.href = self.getAttribute('no-href') || 'rules.html';
      });

      // keep focus in the box; the gate is the only thing on the page
      this._trap = function (e) {
        if (e.key === 'Tab') {
          var f = [yes, no, keep];
          var i = f.indexOf(document.activeElement);
          e.preventDefault();
          f[(i + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
        }
      };
      document.addEventListener('keydown', this._trap);

      // The CSS rule covers controls that mount later, but belt and braces:
      // hide anything already there, and again once the page has settled.
      var sweep = function () {
        var n = document.querySelectorAll('.ns-skipbtn, [data-gate-hide]');
        for (var k = 0; k < n.length; k++) n[k].style.visibility = 'hidden';
      };
      sweep();
      setTimeout(sweep, 400);
      setTimeout(sweep, 1200);

      var wait = parseInt(this.getAttribute('delay'), 10) || 0;
      setTimeout(function () {
        back.style.opacity = '1';
        setTimeout(function () {
          box.style.opacity = '1';
          box.style.transform = 'scale(1)';
          try { yes.focus({ preventScroll: true }); } catch (e) { yes.focus(); }
        }, onLanding ? 620 : 180);
      }, wait);
    }

    disconnectedCallback() { if (this._trap) document.removeEventListener('keydown', this._trap); }

    _yes(box, inner, back, ink) {
      remember(!this._keep || this._keep.checked);
      if (this._trap) { document.removeEventListener('keydown', this._trap); this._trap = null; }

      // the box empties, says the line, then settles down into the map
      inner.style.opacity = '0';
      var self = this;
      setTimeout(function () {
        inner.remove();
        var line = document.createElement('p');
        line.textContent = 'Find your natural state.';
        line.style.cssText = 'margin:0;padding:clamp(8px,1.4vw,16px) 0;font-family:var(--font-display),"Burford",Georgia,serif;' +
          'font-weight:400;font-size:clamp(24px,2.8vw,34px);line-height:1.1;letter-spacing:.005em;color:' + ink + ';' +
          'opacity:0;transition:opacity 300ms ease';
        box.appendChild(line);
        requestAnimationFrame(function () { line.style.opacity = '1'; });

        setTimeout(function () {
          box.style.transition = 'opacity 420ms cubic-bezier(.4,0,.2,1), transform 520ms cubic-bezier(.4,0,.2,1)';
          box.style.opacity = '0';
          box.style.transform = 'translateY(16px) scale(.985)';
          back.style.opacity = '0';
          setTimeout(function () { self._pass(false); }, 430);
        }, 600);
      }, 260);
    }

    // half a beat of the bare outline, then the intro carries on as normal
    _pass(instant) {
      // Flag first: the intro may not have mounted yet, and it reads this on boot.
      this._passed = true;
      window.__nsGatePassed = true;
      document.documentElement.classList.remove('ns-gated');
      if (this.parentNode) this.parentNode.removeChild(this);
      var back2 = document.querySelectorAll('.ns-skipbtn, [data-gate-hide]');
      for (var bi = 0; bi < back2.length; bi++) back2[bi].style.visibility = '';
      var intro = this._intro || document.querySelector('arkansas-intro');
      var go = function () {
        // re-query: an intro mounted after the gate would have been missed
        var el = intro || document.querySelector('arkansas-intro');
        if (el && el.release) el.release();
        document.dispatchEvent(new CustomEvent('ns-gate-passed'));
      };
      if (instant) go(); else setTimeout(go, 420);
    }
  }

  customElements.define('ns-age-gate', NsAgeGate);

  function mount() {
    if (document.querySelector('ns-age-gate')) return;
    var el = document.createElement('ns-age-gate');
    el.setAttribute('variant', CFG.variant);
    el.setAttribute('no-href', CFG.noHref);
    if (CFG.leaf) el.setAttribute('leaf', CFG.leaf);
    if (CFG.delay) el.setAttribute('delay', CFG.delay);
    document.body.appendChild(el);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
