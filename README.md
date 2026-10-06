# naturalstatemeds.com — rebuild

Static rebuild of the Natural State Medicinals site. Every page is a self-contained
HTML design component that opens directly in a browser. No build step, no framework,
no package manager.

## Pages

| File | Page |
|---|---|
| `Natural State Medicinals.dc.html` | Landing (Arkansas topo intro, survey-marker nav) |
| `About Us.dc.html` | About us |
| `How to Get a Card.dc.html` | How to get a card (seven chapters, fixed chapter rail) |
| `Check Your Allotment.dc.html` | Check your allotment (state Limit Meter walkthrough) |
| `Contact Us.dc.html` | Contact us (form posts to a Google Sheet) |
| `Your Paperwork.dc.html` | Your paperwork (form checklist and downloads) |
| `Find Our Flower.dc.html` | Find our flower (AskHoodie where-to-buy widget) |

## Supporting scripts

| File | Purpose |
|---|---|
| `support.js` | Design-component runtime. Required by every `.dc.html`. |
| `arkansas-intro.js` | Landing intro: state outline draw, relief, zoom to White Hall |
| `ar-elevation.js` | Arkansas elevation data used by the intro |
| `topo-texture.js` | Topographic watermark generator |
| `image-slot.js` | Drag-and-drop image placeholder component |

The landing page's pocket-transit compass is two PNG layers in
`assets/compass/` (`Compass_Body.png`, `Compass_Needle.png`). The needle layer
rotates north to south once the intro settles, driven by the `ns-intro-settled`
event dispatched from `arkansas-intro.js`, never a fixed timer, so SKIP INTRO and
reduced-motion both land correctly.

## Published site

GitHub Pages serves the repo root. The seven site pages are published as loose files,
the same way the education guide is: each page is its `.dc.html` source with cross-page
links rewritten to the clean filenames below and a loading screen added at the top of
`<body>`. Scripts, styles and images load from the shared root files, `assets/` and
`_ds/`, so they download once and are cached across pages.

| URL | Source |
|---|---|
| `index.html` | `Natural State Medicinals.dc.html` |
| `about.html` | `About Us.dc.html` |
| `get-a-card.html` | `How to Get a Card.dc.html` |
| `allotment.html` | `Check Your Allotment.dc.html` |
| `contact.html` | `Contact Us.dc.html` |
| `paperwork.html` | `Your Paperwork.dc.html` |
| `find-our-flower.html` | `Find Our Flower.dc.html` |
| `education/index.html` | Education guide (routes to desktop or mobile) |

These are generated output, not source. Edit the `.dc.html` page, then regenerate all
seven so the links between them stay consistent. `rules.html` is still the older
single-file bundle. The `*.src.html` files were the old bundler inputs and are no longer used.

Shared pieces every page loads:
- `vendor/react.production.min.js`, `vendor/react-dom.production.min.js`: React 18.3.1,
  hosted with the site so nothing depends on unpkg.
- `site-nav.js`: the site menu (`<ns-site-nav current="...">`) and the
  "Keep going" hand-off (`<ns-keep-going to="...">`). It writes `.dc.html` links while
  editing and clean filenames once published.
- `assets/img-manifest.js` + `img-sizes.js`: every photo has WebP copies at 800, 1600
  and 2400px (never wider than the master) next to the JPG, named `name-800.webp` and so
  on. The script gives each photo a `srcset` and a `sizes` equal to its rendered width,
  and keeps the JPG as the fallback. Add a photo, then regenerate its WebP copies and its
  manifest entry.
- `assets/share/*.jpg`: the 1200x630 link-preview image for each page.

`.nojekyll` keeps Pages from running the files through Jekyll.

## Page notes

How to get a card is one continuous read, not tabs. Seven chapters, a fixed chapter
rail beside the text on wide screens, a compact progress bar below 1080px, and a
"keep going" hand-off at the foot of every chapter. Body copy stays visible with no
JavaScript; the entrance animation only arms once the script is running.

Check your allotment does not track purchases. Arkansas holds the official count and
the dispensary register reads it, so the page explains how to find the state's own
Limit Meter. The fourteen-day figure is scroll-driven: days light as they pass and
the first day's weight steps off on day fifteen.

About us is people first, and ends in a scatter of crew polaroids that straighten as
you scroll into them. Four `image-slot` placeholders there are waiting on photos
from kitchen, extraction, packaging, and delivery, and every caption still needs a
real name and role.

## Assets

`assets/` holds all photography and brand marks, grouped by subject: `brand/`,
`team/`, `grow/`, `facility/`, `flower/`, `lab/`, `kitchen/`, `packaging/`,
`extract/`, `compass/`.

`_ds/` holds the bound Natural State design system: color and type tokens, the
marketing UI kit, and the component bundle. Pages load `colors_and_type.css` from
here, so keep the folder path intact.

## Conventions

Typography, punctuation, voice, palette, and compliance rules live in `CLAUDE.md`.
Read it before changing copy. Two rules matter most: body copy is Work Sans,
display is Burford, and there are no em dashes anywhere.

## Running locally

Serve the folder over HTTP, do not open with `file://`, since the pages fetch
sibling scripts and assets.

    python3 -m http.server 8000

Then open http://localhost:8000/Natural%20State%20Medicinals.dc.html

## Education guide

The guide now lives in this repo under `education/`, so it is part of the site
instead of a link out to another host. In-site Education links point at
`education/index.html`.

- `education/index.html` routes phones to `mobile.html`, everything else to
  `desktop.html`. `?v=desktop` or `?v=mobile` forces one.
- `education/support.js` and `education/guide-data.js` belong to the guide.
  `support.js` at the root is the site's own runtime. They are different files.
- Guide images, fonts, and design tokens resolve up one level, into the shared
  `assets/` and `_ds/` trees. The guide's own copies were merged in, so nothing
  is duplicated.
- `_ds/overbuilt-design-system-3b590326.../` is the guide's token set, kept
  alongside the site's design system. Both are needed.
- `.nojekyll` at the root is what lets `_ds/` serve on GitHub Pages. Do not
  remove it.

Deep links still work: `education/index.html#strain/dogtown` survives the
redirect. The Cloudflare Worker plan is no longer needed.

## Find our flower

`find-our-flower.html` hosts the AskHoodie where-to-buy widget. The host script
(`askhoodie.com/assets/askhoodie.host.js`) is the one asset that stays remote, so the
page needs a live connection. It injects an iframe into `#askhoodieDiv`; the logic
class waits for `hoodieEmbedWtbV2` to exist before calling it, and swaps the loading
line for a plain apology if the script never arrives. The embed id
`e1fd34ad-dbd0-4329-8684-f3e573d68fba` is the brand account.

Every "find our products" link in the site and the education guide points here. In the
guide that is the `productsUrl` prop, defaulted to `../find-our-flower.html`.

## Deploying

`_deploy/` is the folder that goes to GitHub Pages: the seven built pages, `robots.txt`,
`sitemap.xml`, `.nojekyll`, the loose `education/` guide, and the `assets/` and `_ds/`
trees the guide reads. Camera masters are gitignored, so only the optimized tiers ship.

## Not yet built

Nothing outstanding.

## The contact form

`Contact Us.dc.html` posts to a Google Form that no visitor ever sees. Forms
writes every submission to its response sheet and stamps its own timestamp, so
there is no Apps Script, no OAuth consent, and nothing a Workspace policy can
switch off.

Two constants at the top of the logic class hold the wiring: `FORM_ENDPOINT`, the
form's `/formResponse` URL, and `FIELDS`, which maps each field name to that
form's `entry.NNNN` question id.

All four contact types share the one form. The route the visitor picked rides
along in its own column as `patient`, `complaint`, `press`, or `vendor`. The
dispensary, purchase date, and lot fields only appear on the complaint route and
arrive empty on the other three.

Do not reorder or replace questions in the Google Form. The ids in `FIELDS` are
positional to those questions, and changing them silently drops answers. Adding a
new question at the end is safe.

Google will not let the page read its own reply, so the post goes out opaque and
the page reports success once the browser hands it off, not once Google confirms.
To verify a real submission, check the response sheet.

## Open items

- Crew names and roles for the About us polaroid captions.
- Staff photos for kitchen, extraction, packaging, and delivery.
- Confirm two facts with ADH: visiting patient card length, and the caregiver
  background check fee.
- Voice pass on the landing page and About us. Allotment and the card page are done.
- Performance: subset the fonts, serve photography as WebP or AVIF, lazy-load
  below the fold. Fold this into any Wix or Cloudflare migration.

## Domains

The living repository is **natural-state-medicinals** on GitHub. `mdedman-tech/Website_Rebuild`
was where the rebuild started and is no longer the source of truth.

Canonical and Open Graph URLs on all seven pages, plus `sitemap.xml` and `robots.txt`,
declare **https://naturalstatemedicinals.com** — the domain this site will be served
from. `naturalstatemeds.com` will redirect there. Until DNS is pointed, the github.io
address serves the pages while the canonicals name the destination, which is the correct
posture for a site about to move.

## Last sync

date: 2026-09-03T00:00:00Z

### Updated in this project
- Guide: Live vs. Cured section in Plant to Product (fork, comparison switch, four combinations), live framed as the premium path
- Guide: product family is a filterable grid with in-place expansion, no carousel
- Guide: Gas / Fuel quiz answer, 19 strains mapped
- Store finder: blocker message rewritten with a Refresh page button
- Intro clears its own canvases before building, so a re-parsed host cannot stack a frozen frame over the live sequence
- Gate host is removed from the page on pass and is hidden unless html.ns-gated is set, so no invisible overlay can be left behind
- Page entrance animations pause while the gate is open, so the lockup no longer plays out behind it
- Gate script now loads from the page head; it had been injected into the bundler splash block, so no built page ever loaded it
- Age gate on every page: 18-or-Arkansas-patient wording, remember me 30 days, rules.html for a no
- Landing intro holds on the drawn outline behind the gate, then runs its normal sequence
- Guide plays its own opening first, then the gate appears
- Canonicals, Open Graph URLs, sitemap and robots repointed to naturalstatemedicinals.com
- Find our flower page: search-by-store or by-product guidance added to the intro copy
- Crew pile at 35 photos, six even rows, bottom row clamped inside the pile box
- Letterpress headings across all six pages and both guide files
- Seam-free Arkansas relief; contour density now reads as slope
