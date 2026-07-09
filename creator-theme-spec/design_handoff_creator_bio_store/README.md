# Handoff: Creator Bio Store Theme

## Overview
A mobile-first storefront theme for a multi-vendor platform. Renders as a single-column
page (max ~600px, centered) that acts as a premium "bio link" storefront for Instagram
creators — musicians, coaches, makers, lifestyle curators, local service providers, and
social-first shops selling through DMs/WhatsApp.

## About the Design Files
The bundled `Creator Bio Store Spec.dc.html` is a **design reference built in HTML** — it
is the full design specification rendered as an interactive document (color tokens, type
scale, layout tokens, a live composed mockup with a light/dark toggle, all 12 section
specs, state variations, and ready-to-paste code blocks). It is not production code to
import as-is. The task is to **recreate this specification inside the actual Next.js
storefront theme codebase** — as real React/Tailwind components consuming the platform's
`ThemeConfig` and injected CSS variables (`--primary`, `--secondary`, `--page-bg`, `--font`,
`--radius`), following the codebase's existing component and data-fetching patterns.

## Fidelity
**High-fidelity.** Every color, size, spacing value, and Tailwind class string in the spec
is final and should be implemented pixel-for-pixel — including light/dark palettes, the
type scale, and exact component states (hover/active/disabled, loading/added, live/ended,
availability tiers).

## Design Tokens

### Colors — Light mode
- `accent`: `#C2582E` — warm terracotta, primary-agnostic. Badges, focus rings, small emphasis only — never the main CTA (that's `--primary`).
- `muted`: `#86796A` — secondary text: bios, captions, labels, stat labels.
- `subtle`: `#E6E0D6` — borders, dividers, input backgrounds, disabled fills.
- `surface`: `#FFFFFF` — card/container background, one step off `--page-bg`.
- `on-surface`: `#211D17` — primary text on surface/page-bg.
- `link-button-bg`: `#F3EEE5` — default fill for creator-links buttons.
- Assumed `--page-bg` for contrast: `#FAF7F2` (warm off-white; actual value is merchant-injected).

### Colors — Dark mode
- `accent`: `#E2895F`
- `muted`: `#9C9284`
- `subtle`: `#34302A`
- `surface`: `#221E19`
- `on-surface`: `#F5F1E9`
- `link-button-bg`: `#2C2820`
- Assumed `--page-bg`: `#171410`

Dark mode is tuned independently (deep warm charcoal), not an inverted light palette.

### Typography
- Display face: **Instrument Serif** (regular 400 only) — creator name, hero headlines (booking, availability, countdown drop name).
- Body face: **Public Sans** (400/500/600/700) — bio text, descriptions, buttons, prices, captions, all section headers.
- Scale (px): `xs 12 / sm 14 / base 16 / lg 18 / xl 20 / 2xl 24 / 3xl 30`.
- Prices use `tabular-nums`.

### Layout
- Max content width: `600px`, centered, full-bleed sections on mobile.
- Section vertical padding: standard `py-8` (32px), hero `py-12` (48px), compact `py-6` (24px).
- Button radius: `max(var(--radius), 12px)` — never below 12px regardless of merchant `--radius`.
- Avatar: `96px` (`w-24 h-24`), circle (or rounded-2xl logo tile for brand variant).
- Social icon button: `36px` (`w-9 h-9`).
- Product grid gap: `12px` (`gap-3`).
- Link button height: `56px` (`h-14`).
- Add-to-cart button height: `48px` (`h-12`).

## Sections (12 + 2 persona additions)
Full Tailwind class strings for every element of every section are in the spec file under
"All 12 sections — Tailwind classes." Sections:
1. `creator-profile` — avatar/name/bio/socials; brand variant swaps avatar for a logo tile + city badge.
2. `creator-links` — stacked pill buttons; filled/outline/ghost variants; emoji prefix support.
3. `creator-featured-product` — hero product card with optional badge overlay.
4. `creator-product-grid` — 2-column compact grid, no filters.
5. `creator-countdown` — drop timer on `--primary` field; notify-me input pre-drop, live CTA post-drop.
6. `creator-offer-cards` — manually entered course/session cards, 1 or 2 column.
7. `creator-social-proof-bar` — stat strip + optional logo row.
8. `creator-shoppable-image` — lifestyle photo + product button grid beneath.
9. `creator-availability` — scarcity block with progress bar + waitlist capture.
10. `creator-portfolio` — visual grid, lightbox expand, no product links.
11. `creator-booking` — single dominant CTA card (image + headline + button).
12. `creator-video` — responsive YouTube/TikTok embed, 16:9, max 600px on desktop.
13. `creator-whatsapp-cta` — full-width green (`#25D366`) WhatsApp button with pre-filled message, social-first shop persona.
14. `creator-info-strip` — icon+text trust signal row (shipping, returns, pickup, payment), social-first shop persona.

## Interactions & States
- **Link button**: default (shadow-sm) → hover (`-translate-y-0.5`, `shadow-md`) → active (`translate-y-0`, `scale-[0.99]`) → disabled (`opacity-40`, `pointer-events-none`, `grayscale`).
- **Add to cart**: default (`bg-[var(--primary)]`) → loading (spinner, `opacity-80`, `cursor-wait`) → added (checkmark, `bg-[var(--creator-on-surface)]`, reverts after ~2s).
- **Countdown**: live (ticking blocks) → ended ("It's live!" headline + white CTA on `--primary`).
- **Availability**: >50% left (neutral `--primary` fill) → <30% left (warning tone, e.g. `#F0C4B4`/`#7A2E12`) → sold out (gray fill, CTA becomes "Join waitlist", disabled "Book now").

## Assets
No custom icons/imagery were created — product/portfolio/profile imagery in the live demo
uses `placehold.co` placeholders and should be replaced with real merchant assets, uploaded
photos, or platform-provided icon components (social icons, WhatsApp glyph, trust-signal icons).

## ThemeConfig & CSS Variables
Ready-to-paste `ThemeConfig` object and `--creator-*` CSS variable block (light + dark) are
included verbatim at the bottom of the spec file — copy directly into the platform's theme
registration.

## Files
- `Creator Bio Store Spec.dc.html` — full interactive design specification (open in a browser; includes a light/dark mode toggle).
