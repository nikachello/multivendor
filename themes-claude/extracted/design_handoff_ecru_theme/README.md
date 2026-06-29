# Handoff: ÉCRU — Flagship Fashion/Lifestyle/Apparel Theme

## Overview
ÉCRU is the flagship storefront theme for a multivendor e-commerce platform, aimed at fashion, lifestyle, and apparel brands. It is a **config-driven theme**: a `ThemeConfig` object supplies palette, type, layout, and per-section styling, and the section components consume CSS variables derived from it. This package documents the theme's visual identity and every homepage section so it can be rebuilt in the real platform codebase.

**Visual identity:** editorial atelier. Warm bone paper, espresso ink, a single vermilion accent. High-contrast Didone display type (Bodoni Moda) over tracked-out Helvetica labels. Hairline rules, **sharp zero-radius corners**, portrait product crops. Confident and brand-led — deliberately *not* a clean white SaaS template.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look, layout, and behavior. They are **not** production code to copy verbatim. `Ecru Theme.dc.html` is authored in a streaming component format ("Design Components") with inline styles; do not ship it as-is.

Your task is to **recreate these designs in the target codebase's existing environment** (React/Vue/Svelte/Liquid/etc.), using its established component patterns, and to **wire each section to the `ThemeConfig` object** so store owners can theme their storefront. `config.ts` is the real, paste-ready config and is the source of truth for all tokens. If no front-end environment exists yet, choose the framework that best fits the platform and implement there.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interaction states are specified below with exact values. Recreate the UI pixel-faithfully using the codebase's libraries, then drive it from `ThemeConfig`.

---

## Design Tokens

These map 1:1 to `config.ts`. Each section's `className`/`style` strings reference them as CSS variables; set these on a theme root element.

| CSS variable | Value | Role |
|---|---|---|
| `--accent` | `#D8432B` | Vermilion. CTAs, eyebrows, numbers, accent fields |
| `--ink` / `--primary` | `#1B1714` | Espresso ink. Body text, ink buttons |
| `--secondary` | `#D8432B` | Accent pairing (same as accent) |
| `--page-bg` | `#EFE8DA` | Warm bone paper — page background |
| `--surface` | `#F6F1E7` | Raised paper — alternating section backgrounds |
| `--muted` | `#6A5F51` | Muted brown-grey — secondary text |
| `--subtle` | `#D7CDB9` | Warm sand — hairline rules & borders |
| `--radius` | `0px` | Corner radius (sharp by default) |

**Typography stacks**
- `--serif` (display, section headings): `'Bodoni Moda', Didot, 'Bodoni MT', Georgia, 'Times New Roman', serif`
- `--sans` (body, card headings, prices): `'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif`
- `--mono` (labels, eyebrows, captions): `ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace`

**Fonts to load:** Only **Bodoni Moda** (Google Fonts) is non-system — load it via the platform's font pipeline (weights 400/500). It falls back gracefully to Didot → Georgia, so the design holds even before it loads. Everything else is a system stack; no web font needed.

**Spacing / layout scale**
- Section vertical padding (`sectionPy`): `clamp(64px, 8vw, 112px)`
- Section horizontal padding (`contentPx`): `clamp(22px, 6vw, 80px)`
- Grid gap: `clamp(16px, 1.6vw, 24px)`
- Product grid columns: `4` (implemented responsively as `repeat(auto-fill, minmax(220px, 1fr))`)
- Heading alignment: `left`

**Type scale (clamped, fluid)**
- Hero display: `clamp(44px, 7vw, 86px)`, serif 500, line-height .98, letter-spacing -.01em
- Section heading: `clamp(32px, 4.5vw, 58px)`, serif 500, line-height 1, letter-spacing -.01em
- Editorial heading: `clamp(30px, 3.6vw, 52px)`, serif 500
- Eyebrow / label: `11px`, mono, letter-spacing .24em, uppercase, accent color
- Card heading (product name): `14px`, sans, letter-spacing .01em, ink
- Price: `14px`, sans, `font-variant-numeric: tabular-nums`
- Body: `15–16px`, sans, line-height 1.55–1.7, muted

**Borders / shadows:** Hairline `1px solid var(--subtle)` throughout. **No shadows.** **No rounded corners** (radius 0).

---

## Screens / Views

A storefront homepage is **assembled** from these sections by the store owner. Each is an independent, reusable block. In the prototype every block is preceded by a small monospace label strip (`00`, `01`, `02`…) identifying it — that strip is a documentation aid and **should not** be reproduced in production.

### 0. Announcement bar + Navbar
- **Purpose:** Global promo line + primary navigation.
- **Announcement:** full-bleed `--accent` band, `--page-bg` text centered, `11px` mono-ish sans, letter-spacing .22em, uppercase, padding `11px 16px`. Copy: `Complimentary shipping over £150 · Spring/Summer 26 now in`. Maps to `sections.announcement.wrapper`.
- **Navbar:** 3-column grid (`1fr auto 1fr`), padding `22px var(--contentPx)`, bottom hairline. Left links: New / Women / Men / Objects (`12px`, uppercase, letter-spacing .13em). Center logo `ÉCRU` in serif 500, `30px`, letter-spacing .16em. Right: Search / Account / Cart. Cart shows a count in a pill (`1px solid currentColor`, border-radius 999px, mono `11px`). **All links hover → `--accent`.**

### 1. Banner — three variants
- **Cover:** full-bleed image, `min-height: clamp(460px, 74vh, 780px)`. Dark gradient overlay `linear-gradient(to top, rgba(20,17,14,.66), rgba(20,17,14,.04) 56%, rgba(20,17,14,.18))`. Bottom-left text block (max-width 680px): vermilion eyebrow → serif headline (`#EFE8DA`) → body (`#D9D0BE`, max 420px) → primary CTA. CTA: `--accent` bg, `--page-bg` text, padding `16px 34px`, `12px`, letter-spacing .2em, uppercase; **hover → bone bg + ink text.** Copy: eyebrow "Spring / Summer 26", headline "The Linen Edit", CTA "Shop the collection".
- **Compact:** text-only, centered, `--surface` bg, top+bottom hairline, padding `clamp(56px,7vw,92px)`. Vermilion eyebrow + serif statement (max-width 14ch). Copy: "Made in small batches. Worn for years."
- **Split:** 2-up grid `repeat(auto-fit, minmax(330px, 1fr))`. Left: image, `min-height: clamp(380px,46vw,560px)`. Right: centered copy on `--page-bg`, padding `clamp(44px,6vw,84px)` — eyebrow, serif heading, muted body (max 42ch), underline-link CTA (`1px solid var(--ink)`, hover → accent). Copy: "The Atelier" / "Quietly made, in Porto" / "Read the story".

### 2. Collection section (product grid)
- **Purpose:** Display a collection of products.
- **Layout:** Section padding `var(--sectionPy) var(--contentPx)`. Header row: left = eyebrow + serif heading ("New Arrivals"), right = underline "View all" link; `flex` space-between, wraps.
- **Grid:** `repeat(auto-fill, minmax(220px, 1fr))`, gap `clamp(18px,2vw,30px) clamp(16px,1.6vw,24px)`.
- **Product card:** flex column, gap 14px.
  - Image: `aspect-ratio: 4/5`, bg `var(--surface)` (prototype uses a hatched placeholder), `overflow:hidden`. Bottom-right **+ Add** button: `--ink` bg, `--page-bg` text, padding `11px 16px`, `10.5px`, letter-spacing .18em, uppercase; **hover → `--accent`.** Clicking increments cart.
  - Meta row: `flex` space-between baseline. Left = name (`14px`, ink) + tag (`12px`, muted, e.g. "Oat · 4 colours"). Right = price (`14px`, tabular-nums).
- **Sample data:** The Linen Shirt £120 · Wide-Leg Trouser £165 · Boxy Pocket Tee £55 · Cropped Overshirt £190.

### 3. Categories section (image grid w/ overlay)
- **Purpose:** Navigate to categories.
- **Layout:** `--surface` bg, section padding. Grid `repeat(auto-fit, minmax(260px, 1fr))`, gap `clamp(14px,1.6vw,22px)`.
- **Category card:** anchor, `aspect-ratio: 3/4`, image bg, `overflow:hidden`. Gradient overlay `linear-gradient(to top, rgba(20,17,14,.58), transparent 52%)`. Bottom-left (22px inset): serif name (`clamp(24px,2.4vw,32px)`, `#EFE8DA`) + count (`11px`, uppercase, letter-spacing .18em, 85% opacity). Items: Linen / Knitwear / Objects.

### 4. Highlights section (variant: "divided")
- **Purpose:** Three brand value props.
- **Layout:** `repeat(auto-fit, minmax(250px, 1fr))`. Each block separated by `border-left: 1px solid var(--subtle)` (first has none), padding `clamp(26px,2.5vw,40px)`.
- **Block:** big serif number in `--accent` (`clamp(42px,5vw,72px)`), then uppercase `13px` title (letter-spacing .16em), then muted `15px` description (line-height 1.65).
- **Content:** 01 Natural fibres only · 02 Made to be repaired · 03 Fairly paid workshops.
- **Note:** support an alternate `variant: "cards"` (same content as bordered cards on `--surface`) per the config type.

### 5. Image + Text section (editorial)
- **Purpose:** Long-form brand/editorial moment.
- **Layout:** 2-up grid `repeat(auto-fit, minmax(330px, 1fr))` on a **dark `--ink` field** (color `--page-bg`). Left: image, `min-height: clamp(380px,44vw,580px)`. Right: centered copy, padding `clamp(46px,6vw,88px)` — vermilion eyebrow, serif heading (`#EFE8DA`), two muted paragraphs (`#CFC6B5`, line-height 1.7, max 46ch), bone underline CTA (hover → accent).
- **Content:** "Material study" / "Why we keep coming back to linen" / "Explore our fabrics".

### 6. Testimonials section
- **Purpose:** Social proof — 3 customer quotes.
- **Layout:** `--surface` bg. Grid `repeat(auto-fit, minmax(270px, 1fr))`. Each `figure` divided by `border-left: 1px solid var(--subtle)`, padding `clamp(26px,2.6vw,42px)`.
- **Quote:** large serif open-quote glyph in `--accent` (34px), then serif quote (`clamp(21px,1.9vw,26px)`, line-height 1.34, ink), then mono caption "Name · Place" (`11px`, uppercase, letter-spacing .16em, muted). `quoteVisible: true`.

### 7. Newsletter section
- **Purpose:** Email capture.
- **Layout:** full-bleed `--accent` field, `--page-bg` text, centered, max-width 640px. Serif heading "Join the list" + body (`#F4E2DC`).
- **Form:** flex row, max-width 480px, single bottom border (`1px solid var(--page-bg)`). Input: transparent, no border, bone text, `15px`, padding `14px 4px`, flex:1. Submit: `--ink` bg, bone text, padding `14px 28px`, `11px`, letter-spacing .2em, uppercase; **hover → bone bg + ink text.**
- **Submitted state:** form is replaced by a bordered confirmation (`1px solid rgba(239,232,218,.5)`, mono `13px`): "You're on the list — welcome."

### Footer (supporting, included for completeness)
- Top hairline, padding `clamp(54px,6vw,80px) var(--contentPx) 40px`. Grid `repeat(auto-fit, minmax(180px,1fr))`: brand blurb + 3 link columns (Shop / Company / Care). Column headers mono `10.5px` uppercase muted; links `13px` ink, hover → accent. Bottom bar: hairline-topped mono row with copyright + "Porto · Worldwide shipping".

---

## Interactions & Behavior
- **Hover states (universal):** text links and nav links transition color → `--accent`. Solid buttons invert (accent↔ink / ink↔bone). Underline-style CTAs shift both text and border to accent.
- **Add to cart:** clicking a product's **+ Add** increments the navbar cart count. (Prototype uses local state; wire to the platform cart.)
- **Newsletter submit:** `onSubmit` prevents default, swaps the form for the confirmation message. Wire to the platform's subscribe endpoint; validate a non-empty, well-formed email before success.
- **Transitions:** simple color transitions on hover only. **No scroll animations, no entrance animations.**
- **Responsive:** all multi-column layouts use `auto-fit`/`auto-fill` `minmax()` and collapse to a single column on narrow viewports without media queries. Fluid type/spacing via `clamp()`. Verify the navbar's 3-col grid degrades acceptably on mobile (consider a hamburger in production).

## State Management
- `cart` (number) — navbar count; source from the real cart store.
- `email` (string) + `subscribed` (boolean) — newsletter form; replace local state with the platform's subscription flow.
- **Theme-level:** `ThemeConfig` (and any per-store overrides). The prototype exposes three live overrides as tweakable props — `accentColor`, `pageBg`, `radius` — applied by setting `--accent`, `--page-bg`, `--radius` on the theme root. Mirror this so store owners can override tokens without forking the theme.

## Assets
- **No raster assets are shipped.** All imagery is represented by hatched placeholders with monospace slot labels indicating the intended shot and crop, e.g. `[ cover image — 16:9 ]`, `[ atelier shot — 4:5 ]`, `[ fabric detail — 4:5 ]`, and product codes `ECRU-01…04` / `CAT-LN`, `CAT-KW`, `CAT-OB`. Replace each with merchant-supplied product/lifestyle photography at the stated aspect ratios (products 4:5, categories 3:4, cover 16:9).
- **Icons:** none required beyond text labels (Search / Account / Cart). If the codebase has an icon set, a search glyph and bag glyph may substitute the text labels — keep them minimal/line-weight to match.
- **Font:** Bodoni Moda (Google Fonts), weights 400/500.

## Files
- `Ecru Theme.dc.html` — the full design reference (all sections + 3 banner variants, with live cart/newsletter interactions). Open in a browser to view.
- `config.ts` — the complete, paste-ready `ThemeConfig` object with exact token values and per-section style strings. **Source of truth.**
