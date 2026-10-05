/* @ds-bundle: {"format":3,"namespace":"NaturalStateDesignSystem_3b5903","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"075472a03427","components/core/Button.jsx":"d9aaf5a3867a","components/core/Tag.jsx":"6b172e4ef1cc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NaturalStateDesignSystem_3b5903 = window.NaturalStateDesignSystem_3b5903 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Natural State — Badge
 * Small status / category marker. Quiet by default; gold for premium.
 */
function Badge({
  variant = 'neutral',
  children,
  style = {},
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: 'var(--font-sans)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: 'var(--radius-xs)',
    border: '1px solid transparent',
    lineHeight: 1.4
  };
  const variants = {
    neutral: {
      background: 'var(--ns-haze)',
      color: 'var(--text-body)'
    },
    bronze: {
      background: 'transparent',
      color: 'var(--ns-bronze-dark)',
      borderColor: 'var(--ns-bronze)'
    },
    midnight: {
      background: 'var(--ns-midnight)',
      color: 'var(--ns-arctic)'
    },
    cream: {
      background: 'var(--ns-cream)',
      color: 'var(--text-strong)',
      borderColor: 'var(--border-hairline)'
    },
    success: {
      background: 'rgba(91,122,79,0.14)',
      color: 'var(--success)'
    },
    danger: {
      background: 'rgba(156,74,58,0.12)',
      color: 'var(--danger)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Natural State — Button
 * Primary brand action. Restrained, near-square corners, warm shadow.
 */
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 16px',
      fontSize: 12
    },
    md: {
      padding: '12px 24px',
      fontSize: 13
    },
    lg: {
      padding: '16px 34px',
      fontSize: 15
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    border: '1px solid transparent',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'var(--ns-midnight)',
      color: 'var(--ns-arctic)',
      boxShadow: 'var(--shadow-sm)'
    },
    bronze: {
      background: 'var(--ns-bronze)',
      color: 'var(--ns-midnight)',
      boxShadow: 'var(--shadow-bronze)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--ns-midnight)',
      borderColor: 'var(--ns-midnight)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-strong)',
      borderColor: 'transparent'
    }
  };
  const hoverIn = e => {
    if (disabled) return;
    const el = e.currentTarget;
    if (variant === 'bronze') {
      el.style.background = 'var(--ns-bronze-dark)';
    } else if (variant === 'primary') {
      el.style.background = 'var(--midnight-700)';
    } else if (variant === 'secondary') {
      el.style.background = 'var(--ns-midnight)';
      el.style.color = 'var(--ns-arctic)';
    } else {
      el.style.background = 'var(--ns-bronze-soft)';
    }
  };
  const hoverOut = e => {
    const el = e.currentTarget;
    const v = variants[variant];
    el.style.background = v.background;
    el.style.color = v.color;
    el.style.transform = 'translateY(0)';
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: hoverIn,
    onMouseLeave: hoverOut,
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(1px)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Natural State — Tag
 * Botanical descriptor chip (terpene, effect, lineage). Optional dot.
 */
function Tag({
  children,
  color = 'var(--ns-bronze)',
  dot = true,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text-body)',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-hairline)',
      padding: '5px 12px',
      borderRadius: 'var(--radius-pill)',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: color,
      flex: '0 0 auto'
    }
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Tag = __ds_scope.Tag;

})();
