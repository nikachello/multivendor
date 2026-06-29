# Handoff: DEW — Beauty / Skincare / Wellness Theme

## Overview
DEW is the beauty/skincare/wellness theme for the multivendor storefront platform — the trust-led, conversion-forward counterpoint to the ÉCRU fashion theme. Like ÉCRU it is **config-driven** (a `ThemeConfig` object supplies palette, type, layout, and per-section styling) and shares the same section building blocks, **plus** beauty-specific commerce sections: shade swatches, star ratings, an ingredient/how-to-use accordion, a before/after slider, reviews + UGC, and a routine/bundle builder. It also includes a **Product Detail** screen and a **Cart** screen.

**Visual identity:** soft, friendly, optimistic. Warm porcelain-blush paper, cocoa-plum ink, a soft periwinkle accent, calm sage + blush tint blocks. Rounded geometric sans (**Plus Jakarta Sans**), generous radius with **pill** buttons, **centered** section headings. Where ÉCRU is restrained/editorial/sharp, DEW is rounded/warm/reassuring.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype of look, layout, and behavior. They are **not** production code to copy verbatim. `Dew Theme.dc.html` is authored in a streaming component format with inline styles.

Your task is to **recreate these designs in the target codebase (React + Next.js, App Router)** using its existing component patterns, and to **wire each section + the two screens to the `ThemeConfig` object** so store owners can theme their storefront. `config.dew.ts` is the real, paste-ready config and is the source of truth for all tokens.

> The HTML prototype has a small dark **"preview" switcher bar** at the very top (Home / Product / Cart). That is **demo chrome to navigate the three views — do NOT build it into the theme.** Each labeled monospace strip (`00`, `01`, … `13`) above each block is likewise a documentation aid, not part of the shipped UI.

## Fidelity
**High-fidelity (hifi).** Final colors, type, spacing, and interaction states are specified below. Recreate pixel-faithfully using the codebase's libraries, driven by `ThemeConfig`.

---

## Design Tokens

Maps 1:1 to `config.dew.ts`. Set these as CSS variables on a theme-root element.

| CSS variable | Value | Role |
|---|---|---|
| `--accent` | `#6C63E8` | Soft periwinkle. CTAs, swatch ring, stars, eyebrows, progress |
| `--ink` / `--primary` | `#2C2530` | Cocoa-plum. Text, dark summary panel |
| `--secondary` | `#6C63E8` | Periwinkle accent pairing |
| `--page-bg` | `#F4ECE6` | Warm porcelain-blush page background |
| `--surface` | `#FCF8F3` | Clean cream — cards, product-image base |
| `--sage` | `#E7EDE0` | Calm green-grey tint — alternating sections, image wash |
| `--blush` | `#F1E0DA` | Soft blush tint — secondary section bg, soft buttons |
| `--muted` | `#8A8190` | Mauve-grey — secondary text |
| `--subtle` | `#E7DBD2` | Warm sand — hairlines & borders |
| `--radius` | `16px` | Card/image corner radius |
| `--pill` | `999px` | Buttons, inputs, badges, swatches |

**Typography** — one family, weight-driven:
- `--sans` (everything): `'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`
- `--mono` (showcase labels / image slot captions only): `ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace`
- **Font to load:** **Plus Jakarta Sans** (Google Fonts, weights 400/500/600/700/800) via `next/font/google`. Falls back to system-ui gracefully.

**Type scale (fluid):**
- Hero display: `clamp(40px, 6.4vw, 76px)`, 700, line-height 1.02, letter-spacing -.03em
- Section heading: `clamp(26px, 4vw, 50px)`, 700, letter-spacing -.02em, **centered**
- Card / product name: 15px, 600
- Eyebrow / label: 12px, 700, letter-spacing .14em, **lowercase**, accent color
- Body: 15–17px, 400/500, line-height 1.5–1.7, muted
- Price: 15–24px, 600/700

**Spacing / layout:**
- `sectionPy`: `clamp(60px, 7.5vw, 104px)` · `contentPx`: `clamp(22px, 6vw, 80px)` · `gridGap`: `clamp(16px, 2vw, 26px)`
- Product grid: 4 cols, responsive `repeat(auto-fill, minmax(230px, 1fr))`
- Heading align: **center**
- **No shadows** except soft elevation on the before/after handle and floating elements. **Rounded everything.**

---

## Screens / Views

The store **homepage** is assembled from sections 00–11. Sections 12 (Product Detail) and 13 (Cart) are separate page templates.

### 0. Announcement + Navbar
- **Announcement:** full-bleed `--accent` band, white text, 12.5px/600, centered. Copy: `Free shipping over $40 · 30-day happiness guarantee · New: the Barrier Serum`.
- **Navbar:** 3-col grid (`1fr auto 1fr`), `--page-bg`, bottom hairline. Left links Shop/Skincare/Bestsellers/About (14px/500). Center wordmark `dew.` (800, 26px, the `.` in accent). Right: Search, Account, and a **pill Bag button** (`--accent`, white) with a count badge — links to Cart. All links hover → accent.

### 1. Banner — three variants
- **Cover:** `min-height: clamp(440px, 68vh, 720px)`, soft periwinkle/blush **radial-gradient** background, left-aligned text block (max 560px): lowercase eyebrow → 700 hero headline → muted body → two pill CTAs (solid accent "Shop bestsellers" + outline-ink "Take the quiz"). CTAs hover-invert to ink.
- **Compact:** `--sage` band, centered flex row of 4 trust phrases separated by accent `✦` glyphs (e.g. "Vegan & cruelty-free", "Fragrance-free options"…).
- **Split:** 2-up grid `minmax(320px,1fr)`. Left: rounded radial-gradient image (`radius × 1.6`). Right: eyebrow, 700 heading "The Barrier Serum", muted body, solid pill CTA "Shop now — $48".

### 2. Collection section (product grid + swatches + stars)
- Centered eyebrow + heading "Loved on the daily". Grid `repeat(auto-fill, minmax(230px, 1fr))`.
- **Card** (`--surface`, `--radius`, 14px padding): square (1/1) radial-gradient image with a row of small **shade dots** bottom-left (13px circles, white ring); star row (`★★★★★` in accent + `rating (reviews)` muted); name + price row; full-width **"Add to bag"** pill button (`--blush` → hover `--accent`/white). Add increments the bag.
- Sample data: Gentle Gel Cleanser $24 (4.9, 312) · Barrier Serum $48 · Daily Glow SPF 50 $32 · Overnight Mask $38.

### 3. Featured product — shade picker (beauty)
- `--blush` background, 2-up grid. Left: 4/5 radial image. Right: eyebrow, title "Skin Tint SPF 30", stars 4.8·214, body, **shade label that reflects the selected swatch**, a row of five 38px **swatch buttons** (selected gets a 2px accent ring via box-shadow), and an "Add to bag — $36" pill CTA + trust microcopy. Selecting a swatch updates the displayed shade name.

### 4. Categories section
- Grid `minmax(190px,1fr)`. Rounded square (1/1) tiles, radial-gradient bg, dark gradient overlay bottom, white name (700) + count. Items: Skincare / Makeup / Body / Wellness.

### 5. Highlights section — variant: "cards"
- Grid `minmax(250px,1fr)`. Each = `--surface` rounded card (`radius × 1.3`) with a 44px **accent pill number badge** (01/02/03, white), 700 title, muted description. Content: Clinically tested · Clean honest INCI · Cruelty-free always.

### 6. Ingredients / How-to-use accordion (beauty)
- `--sage` background, max-width 760px centered. Centered eyebrow + heading. Each row = `--page-bg` rounded panel; header button (title + accent `+`/`–` sign) toggles a collapsible muted body. **Only one open at a time** (default: first open). Items: Hyaluronic Acid · Niacinamide 5% · Squalane · How to use.

### 7. Before & After slider (beauty)
- Centered heading. A `16/10`, `radius × 1.6` container with two layered radial-gradient "photos". The **top (after) layer is clipped** via `clip-path: inset(0 <100−v>% 0 0)`; a white divider line + a round 42px **drag handle** (`↔`) sit at `left: v%`. A transparent full-cover `<input type=range>` drives `v` (0–100, default 50). `before`/`after` mono captions in the corners.

### 8. Image + Text section (editorial)
- 2-up grid. Image (radial-gradient, `radius × 1.6`) on one side; copy on the other: eyebrow "our science", 700 heading, two muted paragraphs, solid **ink** pill CTA "Meet the lab" (hover → accent).

### 9. Reviews + UGC
- `--surface` background. Centered accent line "★ 4.8 average · 12,400 reviews" + heading "Loved by 40,000+ humans". Three review cards (`--page-bg`, rounded): `★★★★★`, 500 quote, name + a **"✓ Verified" sage pill badge**. Below: a "@dew on you" label with hairline, then a responsive grid of square UGC image tiles (handles captioned).

### 10. Routine / bundle builder (beauty)
- Centered eyebrow + heading "Bundle 3+ and save 15%". Two columns: **left** = list of 4 toggleable product rows (thumb, name, step note, price, a round check indicator; selected row gets a 1.5px accent border + filled accent check). **Right** = dark `--ink` sticky **summary card**: product count + subtotal, bundle discount (periwinkle), total, "Add routine to bag" CTA, and a dynamic savings line ("You're saving $X" / "Add N more to unlock 15% off"). All totals recompute live as items toggle; the 15% discount applies at 3+ selected.

### 11. Newsletter section
- Rounded (`radius × 2`) periwinkle-wash card, centered. Heading "Get 15% off your first order" + body. **Pill** email input (white) + accent **pill** submit "Get my code". On submit, swaps to an ink pill confirmation: "Check your inbox — your code is on the way ✨".

### Footer
- `--sage` background. Brand blurb + 3 link columns (Shop / Help / Brand). Bottom hairline row with copyright + "Cruelty-free · Vegan · Made in small batches".

### 12. Product Detail (screen)
- Breadcrumb (Shop / Skincare / Skin Tint SPF 30). 2-up grid:
  - **Gallery (left):** 4/5 hero radial image + a 4-up thumbnail row (first thumb has 2px accent ring).
  - **Info (right):** eyebrow, 700 title, stars, **price that reflects size**, body. Then: **shade label + 5 swatches** (shared selection state with the homepage featured block); a **Size toggle** (30ml $36 / 50ml $52 — selected gets accent border, drives price); a **purchase-option pair** (One-time vs "Subscribe & save 15%" — selected gets accent border, sub shows the 15%-off price); a **quantity stepper** (pill, − n +, min 1) beside a full **"Add to bag — $X"** CTA whose label reflects size × subscription × qty; a trust line; then the ingredient **accordion** (reused). Adding navigates to Cart.
- Below: **"Pairs well with"** — 3 cross-sell cards (square image, name/price, Add to bag).

### 13. Cart (screen)
- Heading "Your bag · N". 2-up grid (stacks on narrow):
  - **Left:** a **free-shipping progress bar** (`--surface` panel, accent fill at `subtotal/$40`, with a message "You're $X away…" / "You've unlocked free shipping ✨"); then **line-item rows** (`--surface`, rounded): thumb, name + optional "Shade: …", a **qty stepper** (− n +, min 1), line total, and a **× remove** button. Below: a "Complete your routine" **upsell** strip (2 mini cards with a round `+` add button).
  - **Right:** sticky `--surface` **Summary card** (`radius × 1.4`): Subtotal, Shipping ("FREE" ≥ $40 else "$5"), divider, large Total, accent pill **Checkout**, and a secure-checkout note. All values recompute live from the line items.

---

## Interactions & Behavior
- **Hover:** links/nav → accent. Solid pill buttons invert (accent↔ink, or accent↔white on dark). Soft `--blush` add buttons → accent/white.
- **Add to bag** (collection cards, featured, PDP, cross-sell, upsell, bundle): adds/increments a line item; the navbar bag badge = total quantity. PDP & bundle "add" also navigate to Cart.
- **Shade swatches:** selecting updates the displayed shade name + ring; shade is carried onto the cart line item.
- **Accordion:** single-open; clicking the open row closes it.
- **Before/after:** range input live-drives the clip-path reveal and divider position.
- **PDP variant logic:** size selects price (30ml $36 / 50ml $52); subscribe applies −15%; quantity multiplies; the Add label shows the resulting total.
- **Cart:** qty steppers (min 1) and remove mutate line items; subtotal, free-ship progress, shipping, and total all recompute; free shipping unlocks at $40.
- **Newsletter:** submit prevents default, swaps to confirmation.
- **No scroll/entrance animations** — color transitions and the slider only.
- **Responsive:** all multi-column layouts use `auto-fit`/`auto-fill minmax()` and collapse to one column without media queries; fluid type/space via `clamp()`. Give the navbar a mobile treatment (hamburger) in production.

## State Management
- **Cart:** line items `{ name, shade, price, qty, code }`; navbar badge = Σ qty. Source from the platform cart store in production.
- **PDP:** `selectedShade`, `size`, `purchase` (once|sub), `quantity` — derive displayed price/label from these.
- **UI:** accordion open index, before/after slider value, newsletter `email` + `subscribed`.
- **Theme:** `ThemeConfig` + per-store overrides. The prototype exposes three live override props — `accentColor`, `pageBg`, `radius` — applied by setting `--accent` / `--page-bg` / `--radius` on the root. Mirror so store owners can re-theme without forking.

## Assets
- **No raster assets shipped.** All imagery is soft "dewy" radial-gradient placeholders with monospace slot captions indicating the shot + crop, e.g. `[ hero — model/product, 16:9 ]`, `[ product hero, 4:5 ]`, product codes `DEW-01…04`, category codes `CAT-…`, UGC handles. Replace with merchant photography via `next/image` at the noted ratios: **products 1:1, featured/PDP/editorial 4:5, hero 16:9, categories 1:1**.
- **Glyphs used (no SVG):** `★` rating stars, `✦` divider, `↔` slider handle, `✓`/`×`/`+`/`−` controls — swap for the codebase's icon set if preferred (keep them light-weight to match).
- **Font:** Plus Jakarta Sans (Google Fonts), weights 400/500/600/700/800.

## Files
- `Dew Theme.dc.html` — full design reference: homepage (sections 00–11) + Product Detail + Cart, with all interactions live. Use the top **preview** switcher to move between the three views. Open in a browser to view.
- `config.dew.ts` — complete, paste-ready `ThemeConfig` with exact tokens and per-section style strings, plus the `--sage` / `--blush` / `--pill` tint tokens. **Source of truth.**
