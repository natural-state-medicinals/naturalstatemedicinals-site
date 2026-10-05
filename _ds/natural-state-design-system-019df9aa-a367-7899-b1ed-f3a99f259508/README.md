# Natural State Medicinals — Design System

> Premium medical cannabis. Cultivated in Arkansas. Patient-first.

This project is the brand & UI design system for **Natural State Medicinals (NSM)** — a cultivator of medical cannabis flower, vape cartridges, gummies, and solventless concentrates serving Arkansas dispensaries.

It exists so design and product agents can produce on-brand artifacts (slides, mockups, marketing pages, packaging concepts, prototypes) without re-inventing the foundations every time.

---

## Sources

The system was assembled from these inputs:

| Source | Path / Link |
|---|---|
| Style Guide PDF | `assets/style-guide.pdf` (originally `uploads/Natural State Style Guide.pdf`) |
| Primary logo (light bg) | `assets/logo-primary-light.png` |
| Primary logo (dark bg) | `assets/logo-primary-dark.png` |
| Secondary monochrome gold logo | `assets/logo-secondary-gold.png` |
| NS monogram icon | `assets/icon-ns-dark.png` |
| Brand site (text only — no asset access) | `https://www.naturalstatemeds.com` |

> **Reader note** — the Figma file and the brand's web codebase were **not** provided. The site copy referenced below was scraped via search snippets, so any longer-form claims should be re-verified against the live site before publishing.

---

## Index

```
.
├── README.md                       ← you are here
├── SKILL.md                        ← agent skill manifest (Claude Code compatible)
├── colors_and_type.css             ← all design tokens (CSS vars + utility classes)
├── assets/
│   ├── logo-primary-light.png      ← navy logo for light backgrounds
│   ├── logo-primary-dark.png       ← cream logo for dark backgrounds
│   ├── logo-secondary-gold.png     ← all-gold horizontal wordmark
│   ├── icon-ns-dark.png            ← NS monogram with leaf
│   └── style-guide.pdf             ← original brand style guide
├── fonts/                          ← (empty — see "Type substitutions" below)
├── preview/                        ← cards rendered in the Design System tab
└── ui_kits/
    └── marketing/                  ← marketing-site UI kit (homepage scaffold + components)
```

---

## Brand context

**Natural State Medicinals** is one of the larger licensed medical cannabis cultivators in Arkansas. They cultivate flower, manufacture vape cartridges, gummies, and solventless concentrates, and distribute through partner dispensaries (Arkansas Natural Products, Harvest Cannabis, Good Day Farm, etc.). The brand is **patient-first** and emphasizes pharmaceutical-grade quality, sustainability, and a diverse team that includes veterans and women. They are not a retail dispensary — they are the producer behind the products.

The visual identity is intentionally **apothecary-elegant** rather than dispensary-loud: deep midnight navy + warm cream + signature bronze gold, classical slab serif lockups, no neon, no green-leaf clichés. The logo's central glyph is a stylized cannabis flower rendered as if it were a botanical illustration.

---

## CONTENT FUNDAMENTALS

How NSM writes.

### Tone
**Calm, confident, clinical-warm.** The brand sits at the intersection of *botanical apothecary* and *pharmaceutical company*. It speaks like a knowledgeable cultivator who happens to be a neighbor — proud of the craft, deferential to patients, never recreational-bro.

### Voice attributes
- **Patient-first, not customer-first.** People who use NSM are *patients*, not *consumers*. Copy reflects that.
- **Plant-led pride.** "We love our plants, people, and patients first." Cultivation is described with reverence.
- **Local and grounded.** Arkansas pride is foundational — "Natural State" *is* Arkansas's state nickname.
- **Therapeutic, not recreational.** Benefits are framed around healing, relief, and quality of life — not getting high.
- **Inclusive without performance.** Mentions of veterans and women on the team appear as facts, not slogans.

### Person & address
- Default to **first-person plural** ("we," "our team," "our growers") for the brand.
- Address the reader as **"you"** in marketing; "patients" or "our patients" in third-person reference.
- Avoid "consumers," "users," "customers" in product copy.

### Casing
- **Display headlines** are usually all-caps, slab serif, widely tracked. Reserve for hero, section dividers, and the wordmark itself.
- **Body and subheads** use sentence case. Title Case is fine for nav labels and short module headers.
- **Product names** are Title Case (e.g. "Solventless Live Rosin," "Sour Diesel").

### Emoji & symbols
- **Emoji: no.** They don't appear in brand materials and would clash with the apothecary tone.
- **Unicode dashes/marks: yes, sparingly.** En-dash for ranges (`5–10mg`), em-dash for asides, `•` for bullet rows.
- **Iconography:** thin, line-style, midnight-on-arctic (see ICONOGRAPHY).

### Sample voice (real, from the brand)
> **Brand line:** *Find your natural state.*

> **About:** *At Natural State Medicinals, our mission is to help patients find their natural state — of wellness, balance, and relief — through safe, effective, and thoughtfully crafted cannabis products.*

> **Patient testimonial:** *"NSM's gummies have changed my entire world. Instead of waking up, taking pain meds, then managing my way through those side effects, I just eat a gummy in the morning and one at night."*

### Don't
- Don't use stoner slang ("dank," "loud," "fire"), recreational framing, or 420 jokes.
- Don't use neon, gradient-backgrounds, or "tech startup" patterns.
- Don't write copy that sounds like a SaaS landing page ("Unlock your potential," "Level up your wellness").
- Don't put compliance disclaimers in the marketing voice — keep them legal-tone in fine print.

---

## VISUAL FOUNDATIONS

### Color
A 5-color brand palette, split across **primary** and **accent**:

| Token | Hex | Role |
|---|---|---|
| Arctic | `#F5F4E1` | Primary surface — warm off-white "paper" |
| Midnight | `#20253A` | Primary ink, inverse surface |
| Bronze | `#B79550` | Signature accent — used for the leaf glyph, CTAs, dividers |
| Cream | `#F6E7D7` | Secondary surface — warmer card / panel fill |
| Haze | `#EFD7C5` | Tertiary surface — dusty pink-tan, used sparingly for product moments |

Color usage is **strict and contrasty**. The brand reads as "midnight on cream, bronze for accent" — not as a kaleidoscope. Avoid introducing new hues; warm neutrals derived from cream/haze are okay for hover/focus states.

### Type
A 3-family system:

| Family | Role | Source font | Substitute used here |
|---|---|---|---|
| **Burford** | Display / wordmark | Multiple cuts: `Base`, `Outline`, `Line`, `Rustic Outline` | `fonts/Burford_*.otf` |
| **Caligor / Caligor Sans** | Subheaders, labels, UI | Cuts: `Clean`, `Edge`, `Stamp` (both serif and sans variants) | `fonts/Caligor_*.otf` |
| **Esther** | Body, long-form, quotes | Cuts: `Regular`, `Exhaust` | `fonts/Esther-*.otf` |

CSS variables expose each cut:

- `--font-display` (Burford Base) · `--font-display-outline` · `--font-display-line` · `--font-display-rustic`
- `--font-sans` (Caligor Sans Clean) · `--font-sans-edge` · `--font-serif-sans` (Caligor)
- `--font-heading` / `--font-body` (Esther Regular)

Use **Outline** for the wordmark / arched lockups, **Base** for solid display caps, **Line** for the inline-stroked variant, and **Rustic** when you want the textured letterpress feel. **Stamp / Edge** cuts of Caligor are textured variants for packaging-style accents — use sparingly. **Esther Exhaust** is a heavily-distressed display cut, only for posters and labels.

### Backgrounds
- **Default surface is Arctic** (`#F5F4E1`) — never pure white. The whole identity falls apart on `#FFF`.
- **Hero / dramatic moments use Midnight** with cream type — high-contrast and quiet.
- **Imagery is full-bleed and warm.** Reach for honey-toned, low-saturation, slightly grain-y photography of flower, glassware, and hands at work. No cool blue tints; no overprocessed HDR.
- **Patterns:** none. The brand doesn't use repeating textures, illustrated borders, or hand-drawn motifs. The single ornamental element is the **gold cannabis-flower glyph** from the logo, and it is used sparingly — as a divider, a watermark at low opacity, or anchored above a section header.
- **Gradients:** avoid. The bronze logo is sometimes filled with a vertical gold-on-gold gradient (deeper at the top, brighter mid). Outside the logo, flat color only.

### Borders, hairlines, dividers
- **1px hairlines in `--border-hairline`** (12% midnight on cream) — the workhorse divider.
- **Bronze 1px rules** between display sections, often centered with the gold leaf glyph breaking the line. (See secondary logo: `— STATE —` with rule extensions either side.)
- **Card borders:** prefer hairline + soft shadow over thick borders. Avoid colored left-border accents.

### Corner radii
**Restrained.** The wordmark is square-cornered slab serif; UI follows.
- **`0–4px`** for cards, panels, inputs, packaging mockups (the brand reads as "letterpress / apothecary label," not "rounded SaaS").
- **`pill / 999px`** is reserved for **chips and tags only** (strain types, badges).
- Never round buttons heavily — use **`4–6px`** max.

### Cards & elevation
- Cream fill on Arctic background, **`1px` hairline**, **`shadow-sm`**.
- Elevated/featured cards: white fill, hairline, **`shadow-md`**.
- No glassmorphism, no inner shadows, no translucent panels stacked on imagery.
- For product imagery, prefer **edge-to-edge image** with metadata in a small card *below* the image rather than overlaid.

### Shadows
A single warm soft-shadow ramp — `shadow-xs / sm / md / lg` in `colors_and_type.css`. Plus one signature `--shadow-bronze` glow used **only** on primary CTAs at rest.

### Hover & press
- **Primary buttons** — bronze fill darkens to `--ns-bronze-dark`; the bronze glow tightens. No scale-up.
- **Secondary buttons** — outline gains midnight fill, label flips to arctic.
- **Links** — bronze → bronze-dark color shift. Underline stays.
- **Cards** — translate Y by `-2px`, shadow lifts to `shadow-md`. Subtle.
- **Press state** — translate Y `0`, shadow drops to `shadow-xs`. No scale-down on UI elements; the brand prefers stillness.

### Motion
- **Easing default:** `cubic-bezier(0.2, 0.7, 0.25, 1)` (standard ease-out). Curves are calm, never bouncy.
- **Durations:** `140ms` (micro), `220ms` (default), `420ms` (page-level).
- **No bounces, no overshoots, no spring physics.** The brand is composed and still.
- Fades and small Y-translates are the dominant entrance animation. Page sections fade-up on scroll at most 12px.

### Transparency & blur
- Used **sparingly**. The only place blur belongs is on a sticky nav over imagery — `backdrop-filter: blur(12px) saturate(1.05)` with `rgba(245,244,225,0.85)` fill.
- Avoid frosted-glass cards. The brand reads as material, not glass.

### Imagery direction
- **Warm, honey-toned, slightly grainy.** Think: morning light through a greenhouse, hands on flower, amber glass jars on linen.
- **Avoid:** blacklight purple, neon green leaves, heavy HDR, lifestyle "stoner" tropes.
- Photography may have a faint film grain. Avoid heavy filters.

### Layout
- **Generous whitespace.** The brand earns its premium feel through *space*, not ornament.
- **Centered, symmetric layouts** are common — borrowed from the arched logo lockup.
- **Fixed elements:** sticky top nav (60–72px tall, hairline divider on scroll), no fixed sidebars. CTAs stay inline.
- **Grid:** 12-column at desktop, but most content lives at 8–10 columns max-width with healthy margins.

### Iconography
See **ICONOGRAPHY** below.

---

## ICONOGRAPHY

The brand does not ship a custom icon set. Inline iconography in product/marketing surfaces is limited and should follow these rules.

### Style
- **Thin-stroke, line-style, single weight** — `1.5px` strokes at 24px size.
- **Midnight on cream** by default; bronze when emphasized.
- **Square-corner caps and joins** to echo the slab-serif logo. (Avoid rounded-cap icon sets — they undercut the brand's classical feel.)

### Source
- **Recommended CDN:** [Lucide](https://lucide.dev) — clean line-style, square joins, 1.5px stroke. Loaded via:
  ```html
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
  ```
  > **🚩 SUBSTITUTION FLAG:** No custom icon set was provided. Lucide is the placeholder. If NSM has (or develops) a proprietary icon set, replace usage in components.
- **Brand glyph:** the **gold cannabis-flower** from the secondary logo (`assets/logo-secondary-gold.png` and crops thereof) is the *one* ornamental icon native to the brand. Use it as a divider ornament, a watermark on hero sections, or as the favicon.

### Emoji & unicode
- **Emoji are not used.** Anywhere. They clash with the apothecary tone.
- **Unicode dashes (`–`, `—`) and bullets (`•`)** are fine as typographic ornaments.

### Logo usage (quick rules)
- **Primary logo (arched + glyph)** — wherever the brand is being introduced (homepage hero, footer, packaging fronts).
- **Secondary horizontal wordmark (gold)** — section headers, dividers, certificate-style marks.
- **NS monogram with leaf** — favicons, app icons, tight horizontal nav, packaging side panels.
- Always give the logo at least **the height of the "N" character** as clear space on all sides.

---

## Component & UI kit

See `ui_kits/marketing/` for the Natural State marketing-site UI kit (homepage scaffold, header, hero, product card, divider, footer, button library).

The kit is a **visual reference**, not production code. Components are simple and cosmetic — drop them into mocks, slides, and prototypes.

---

## Quick reference for agents

- **Always pull color and type from `colors_and_type.css`** — never hard-code hex.
- **Default surface is Arctic, never `#FFF`.**
- **Default ink is Midnight, never `#000`.**
- **Bronze is for accent only** — CTAs, the leaf glyph, hairline dividers, link color. Never bronze body text or bronze backgrounds.
- **Slab-serif display caps + classical serif body + geometric sans labels.** Never replace the body serif with a sans.
- **No emoji. No neon. No rounded-bro.**

---

## Caveats

- **No live brand site / Figma access** — the marketing UI kit was built from the style guide + logo set + scraped site copy. Real component dimensions, animations, and breakpoints should be cross-checked against the live site.
- **No icon set** — Lucide is the placeholder.
- **No product photography** — image slots in the kit are placeholders. Drop real photography in to bring the brand to life.
