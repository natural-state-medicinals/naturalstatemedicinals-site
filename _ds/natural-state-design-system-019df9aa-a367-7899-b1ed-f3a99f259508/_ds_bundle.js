/* @ds-bundle: {"format":3,"namespace":"NaturalStateDesignSystem_019df9","components":[],"sourceHashes":{"ui_kits/marketing/CTAStrip.jsx":"c6db48bd001d","ui_kits/marketing/Dividers.jsx":"da60d45aa40f","ui_kits/marketing/Footer.jsx":"c64ca8f3f8ac","ui_kits/marketing/Header.jsx":"940f3d6d1d0a","ui_kits/marketing/Hero.jsx":"79b9a3f48e74","ui_kits/marketing/ProductCard.jsx":"4306a86e673f","ui_kits/marketing/Quote.jsx":"ccb1c42118b9","ui_kits/marketing/ValueRow.jsx":"f4255ab26148"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NaturalStateDesignSystem_019df9 = window.NaturalStateDesignSystem_019df9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/marketing/CTAStrip.jsx
try { (() => {
/* global React */
function CTAStrip() {
  return /*#__PURE__*/React.createElement("section", {
    className: "ns-cta-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-cta-strip__inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ns-eyebrow ns-eyebrow--on-dark"
  }, "For new patients"), /*#__PURE__*/React.createElement("h3", {
    className: "ns-cta-strip__title"
  }, "Don\u2019t have your medical card yet?")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "ns-btn ns-btn--primary"
  }, "Apply with the AR DOH \u2192")));
}
window.CTAStrip = CTAStrip;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/CTAStrip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Dividers.jsx
try { (() => {
/* global React */
function BronzeRule({
  label,
  glyph = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ns-rule"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-rule__line"
  }), glyph && /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-secondary-gold.png",
    className: "ns-rule__glyph",
    alt: ""
  }), label && /*#__PURE__*/React.createElement("span", {
    className: "ns-rule__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "ns-rule__line"
  }));
}
function Eyebrow({
  children,
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ns-eyebrow" + (dark ? " ns-eyebrow--on-dark" : "")
  }, children);
}
window.BronzeRule = BronzeRule;
window.Eyebrow = Eyebrow;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Dividers.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Footer.jsx
try { (() => {
/* global React */
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "ns-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-footer__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-footer__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-primary-dark.png",
    alt: "Natural State"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ns-footer__cols"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ns-footer__h"
  }, "Products"), /*#__PURE__*/React.createElement("a", null, "Flower"), /*#__PURE__*/React.createElement("a", null, "Solventless"), /*#__PURE__*/React.createElement("a", null, "Vape"), /*#__PURE__*/React.createElement("a", null, "Edibles")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ns-footer__h"
  }, "Patients"), /*#__PURE__*/React.createElement("a", null, "Find a dispensary"), /*#__PURE__*/React.createElement("a", null, "Get your card"), /*#__PURE__*/React.createElement("a", null, "Strain guide")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ns-footer__h"
  }, "Company"), /*#__PURE__*/React.createElement("a", null, "About"), /*#__PURE__*/React.createElement("a", null, "Cultivation"), /*#__PURE__*/React.createElement("a", null, "Careers"), /*#__PURE__*/React.createElement("a", null, "Contact")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ns-footer__h"
  }, "Visit"), /*#__PURE__*/React.createElement("p", null, "Conway, Arkansas"), /*#__PURE__*/React.createElement("p", null, "info@naturalstatemeds.com")))), /*#__PURE__*/React.createElement("div", {
    className: "ns-footer__legal"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", new Date().getFullYear(), " Natural State Medicinals"), /*#__PURE__*/React.createElement("span", null, "For use only by patients with a valid Arkansas Medical Cannabis Card.")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Header.jsx
try { (() => {
/* global React */
const {
  useState
} = React;
function Header() {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("header", {
    className: "ns-header"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "ns-header__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/icon-ns-dark.png",
    alt: "Natural State"
  })), /*#__PURE__*/React.createElement("nav", {
    className: "ns-header__nav"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#products"
  }, "Products"), /*#__PURE__*/React.createElement("a", {
    href: "#cultivation"
  }, "Cultivation"), /*#__PURE__*/React.createElement("a", {
    href: "#patients"
  }, "Patients"), /*#__PURE__*/React.createElement("a", {
    href: "#dispensaries"
  }, "Dispensaries"), /*#__PURE__*/React.createElement("a", {
    href: "#about"
  }, "About")), /*#__PURE__*/React.createElement("div", {
    className: "ns-header__cta"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#find",
    className: "ns-btn ns-btn--secondary ns-btn--sm"
  }, "Find a dispensary")));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Hero.jsx
try { (() => {
/* global React */
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "ns-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-hero__inner"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-secondary-gold.png",
    className: "ns-hero__glyph",
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "ns-eyebrow ns-eyebrow--on-dark"
  }, "Cultivated in Arkansas"), /*#__PURE__*/React.createElement("h1", {
    className: "ns-hero__title"
  }, "Natural", /*#__PURE__*/React.createElement("br", null), "State"), /*#__PURE__*/React.createElement("p", {
    className: "ns-hero__lede"
  }, "Premium medical cannabis, grown for patients first \u2014 from a team of cultivators, veterans, and pharmacists outside Conway."), /*#__PURE__*/React.createElement("div", {
    className: "ns-hero__rule"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ns-hero__ctas"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#products",
    className: "ns-btn ns-btn--primary"
  }, "Shop products"), /*#__PURE__*/React.createElement("a", {
    href: "#dispensaries",
    className: "ns-btn ns-btn--ghost-light"
  }, "Find a dispensary \u2192"))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global React */
function ProductCard({
  name,
  eyebrow,
  tag,
  price,
  tone = "cream"
}) {
  const tones = {
    cream: "linear-gradient(160deg, #F6E7D7, #EFD7C5)",
    bronze: "linear-gradient(160deg, #efe6cc, #d8c79a)",
    deep: "linear-gradient(160deg, #d8c79a, #b79550)"
  };
  return /*#__PURE__*/React.createElement("article", {
    className: "ns-product"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-product__img",
    style: {
      background: tones[tone]
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-secondary-gold.png",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "ns-product__meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-product__eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h3", {
    className: "ns-product__name"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "ns-product__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ns-tag"
  }, tag), /*#__PURE__*/React.createElement("span", {
    className: "ns-product__price"
  }, price))));
}
function ProductGrid() {
  const items = [{
    name: "Sour Diesel",
    eyebrow: "Flower · 3.5g",
    tag: "Sativa",
    price: "$45",
    tone: "cream"
  }, {
    name: "Live Rosin",
    eyebrow: "Solventless · 1g",
    tag: "Hybrid",
    price: "$80",
    tone: "bronze"
  }, {
    name: "Wedding Cake",
    eyebrow: "Flower · 3.5g",
    tag: "Indica",
    price: "$48",
    tone: "cream"
  }, {
    name: "Berry Gummies",
    eyebrow: "Edibles · 10ct",
    tag: "10mg",
    price: "$22",
    tone: "cream"
  }, {
    name: "Blue Dream Cart",
    eyebrow: "Vape · 0.5g",
    tag: "Sativa",
    price: "$38",
    tone: "deep"
  }, {
    name: "Granddaddy Purp",
    eyebrow: "Flower · 3.5g",
    tag: "Indica",
    price: "$45",
    tone: "cream"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "ns-product-grid"
  }, items.map((p, i) => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: i
  }, p))));
}
window.ProductCard = ProductCard;
window.ProductGrid = ProductGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/ProductCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Quote.jsx
try { (() => {
/* global React */
function Quote() {
  return /*#__PURE__*/React.createElement("section", {
    className: "ns-quote-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-quote-section__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-quote-section__mark"
  }, "\u201C"), /*#__PURE__*/React.createElement("blockquote", {
    className: "ns-quote-section__body"
  }, "NSM\u2019s gummies have changed my entire world. Instead of waking up, taking pain meds, then managing my way through those side effects \u2014 I just eat a gummy in the morning and one at night."), /*#__PURE__*/React.createElement("div", {
    className: "ns-quote-section__attr"
  }, "\u2014 Patient, Little Rock")));
}
window.Quote = Quote;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Quote.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/ValueRow.jsx
try { (() => {
/* global React */
function ValueRow() {
  const values = [{
    kw: "Plants",
    body: "Hand-grown in our greenhouse outside Conway. Pharmaceutical-grade, every plant."
  }, {
    kw: "People",
    body: "A diverse team of cultivators, veterans, and women — building something we love."
  }, {
    kw: "Patients",
    body: "We serve patients first. Our products are formulated for therapeutic, daily relief."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "ns-values"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-values__grid"
  }, values.map(v => /*#__PURE__*/React.createElement("div", {
    className: "ns-values__item",
    key: v.kw
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-values__num"
  }, "\u2014 ", v.kw, " \u2014"), /*#__PURE__*/React.createElement("p", {
    className: "ns-values__body"
  }, v.body)))));
}
window.ValueRow = ValueRow;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/ValueRow.jsx", error: String((e && e.message) || e) }); }

})();
