# Apple iPhone 17 Pro — Design System

A faithful design-token + UI-kit recreation of the Apple iPhone 17 Pro product page, derived from a complete extraction of `apple.com/iphone-17-pro/` (30 April 2026).

> **This is an unofficial recreation for design-prototyping purposes.** It is not affiliated with Apple Inc. and should not be used for production marketing of Apple products.

---

## Sources

- **Primary source:** Pasted design-system extraction report from `apple.com/iphone-17-pro/`
- **Reference screenshots cited in the report:**
  - Hero (top of page): `ss_53290jbho`
  - Highlights section: `ss_036683efg`
  - Footer: `ss_4312hd6w5`
  - Buy button zoom (close-up detail)
- **No codebase or Figma file was attached.** All tokens, types, and components were rebuilt from the structured CSS report.

---

## What this brand is

Apple's iPhone 17 Pro page is the canonical example of Apple's "marketing surface" design language: a near-monochrome page that flips between two backgrounds (`#F5F5F7` light and `#1D1D1F` dark), uses **San Francisco** exclusively, and reserves **a single hue** — Apple Blue `#0071E3` — for action. Content is held in 8–32px-radius cards; anything tappable is a full pill (≥120px radius). Shadows are abandoned entirely in favor of 1px ring outlines. Section rhythm is governed by a single `--global-section-padding: 160px` variable.

The page is a single long-scroll product story divided into:
1. **Global nav** (44px) + **Local nav** (52px sticky pill bar with "Buy")
2. **Hero** — full-bleed dark, oversized SF Pro Display headline
3. **Highlights** — alternating dark/light tiles with full-bleed imagery
4. **Color/finish picker, camera, A19 chip, battery sections**
5. **All Access Pass / environment / packaging** semantic-color tiles
6. **Compare strip + buy CTA + footer**

---

## Index — files in this project

| Path | What's in it |
|---|---|
| `README.md` | This file. Read first. |
| `colors_and_type.css` | All `--sk-*` design tokens, base type styles, semantic helpers (`.sk-headline-1` … `.sk-caption`), and reset. Source of truth. |
| `SKILL.md` | Agent Skill manifest — makes this folder usable as a Claude Code skill. |
| `fonts/` | Font fallbacks. SF Pro is system-served on Apple devices; **Inter is included as a substitute** for non-Apple platforms (see "Font substitution" below). |
| `assets/` | Logo SVGs, finish swatches, and reusable inline icons (chevrons, cart, search, etc). |
| `preview/` | Per-token preview cards (colors, type, spacing, components) shown in the Design System tab. |
| `ui_kits/iphone-17-pro/` | The marketing-page UI kit — `index.html` + small JSX components recreating nav, hero, highlight tiles, finish picker, footer. |

---

## Font substitution — please confirm

**SF Pro is not bundled with this project.** Apple serves it system-natively; on Apple devices the CSS stack `"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont` resolves cleanly with zero font-load. On Windows/Linux/Android it falls back to system sans-serif, which is **not** a faithful match.

For cross-platform fidelity this project also loads **Inter** (Google Fonts) as the visible fallback before generic sans. Inter's metrics are the closest open match to SF Pro Text, but tracking and the optical-size break at 20px are not identical. **If you have SF Pro license, drop the `.woff2` files into `fonts/` and they will take precedence automatically.**

---

## Content Fundamentals

How Apple writes copy on this page — observed patterns:

### Tone
- **Confident, declarative, and short.** Headlines are statements, not pitches. ("All-new design. All titanium." / "Studio-quality video. In your pocket.")
- **No first person.** Apple never says "we" or "our team" in product copy. The product is the subject.
- **Second person sparingly.** "you" appears in benefit statements ("You'll feel it the moment you pick it up") but never in a needy or sales-y way.
- **No exclamation marks.** Anywhere. The voice is calm, not hyped.
- **Em-dashes and periods carry weight.** Sentences are often single-clause with a hard period. Em-dashes connect two ideas without raising the voice.

### Casing
- **Sentence case for headlines.** "All-new design." not "All-New Design."
- **Title Case for proper product names only** ("iPhone 17 Pro", "Desert Titanium", "Apple Intelligence", "A19 Pro").
- **lowercase i in iPhone, iPad, iMac** — always. Even at the start of a sentence.
- **Trademark/footnote markers** (¹ ² ³) used liberally; tied to a footer disclosure.

### Vibe / craft
- **Specificity over superlatives.** "48MP Fusion camera" not "incredible camera." Numbers do the work.
- **Material-forward.** Words like *titanium*, *aerospace-grade*, *forged*, *contoured* lend physicality.
- **No emoji. Ever.** Apple marketing copy never uses emoji.
- **No exclamatory CTAs.** The action-pill text is a single neutral verb: "Buy", "Learn more", "Watch the film", "Order now". Never "Get yours!" or "Shop now →".
- **Footnote-driven precision.** Any claim with a number gets a footnote.

### Examples (style, not direct quotes)
- ✅ *"Forged in titanium. Engineered for power."*
- ✅ *"The most advanced iPhone we've ever made."*
- ❌ *"Get the iPhone 17 Pro now — it's amazing!"* (too hyped, exclamation, "get")
- ❌ *"Our team designed every detail"* (first person)

---

## Visual Foundations

### Colors
- **Two backgrounds, one accent.** `#F5F5F7` (light, ~1,063 uses) and `#1D1D1F` (dark) carry the whole page. Apple Blue `#0071E3` is the only hue with action-meaning.
- **Semantic accents are environment-bound:** orange `#FF791B` for "New" badges, green `#00D959` for environmental callouts, purple `#8664FF` for recycling, etc. They never appear as primary brand colors — only inside their context tile.
- **Grayscale is finely scaled** (`#1D1D1F` → `#424245` → `#6E6E73` → `#86868B` → `#E8E8ED` → `#F5F5F7`) and is exposed via the `--sk-*` token system.

### Typography
- **SF Pro Display** for ≥20px (headings, display copy). Positive letter-spacing at large sizes is signature.
- **SF Pro Text** for <20px (body, UI). Negative letter-spacing tightens body copy.
- **Weights used:** 300, 400, 600, 700. Apple **never** uses 500 or 800+.
- **Line-heights are tight on display** (52/48 ≈ 1.08) and **looser on body** (25/17 ≈ 1.47).

### Spacing
- **4px base grid.** All values are multiples of 4. The scale lives at 4, 8, 12, 16, 20, 24, 28, 32, 40, 44, 76, 160.
- **160px section rhythm.** `--global-section-padding: 160px` separates major page sections — this is the single biggest contributor to Apple's "calm" feel.
- **Dual-axis gap usage:** section headers use `gap: 20px 80px` (column-then-row).

### Backgrounds & imagery
- **Full-bleed photo or solid color.** No textures. No gradients (other than barely-perceptible product-finish renders). No repeating patterns. No hand-drawn anything.
- **Imagery is cool, sharp, high-contrast** — black studio backgrounds with single-source rim lighting on titanium. No grain, no warm filters.
- **Product renders are isolated** (transparent BG) and animate via JS scroll, never CSS.

### Animation
- **Canonical duration: 0.32s.** Most UI transitions land here.
- **Easing: `cubic-bezier(0.4, 0, 0.6, 1)`** — Apple's signature ease-in-out-quad. Almost everything uses it.
- **Micro-interactions: 0.08–0.10s** for press feedback.
- **Panel opens: 0.40s.** Slow reveals: 0.50s.
- **No bounce.** No overshoot. No spring physics. Apple's motion language is firm and controlled.
- **Color crossfades are explicit** (`linear`) for opacity, eased for color.

### Hover / press states
- **Hover on links:** `text-decoration: underline` and color tightens to `#0066CC`.
- **Hover on pills:** background opacity bumps slightly (`0.80` → `0.88` on the dark pill); blue pill darkens to `#0066CC`.
- **Press:** no shrink, no transform. Just an opacity dip (`0.6` for icons, color shift for pills).
- **Focus ring:** `--sk-focus-color: #0071e3`, 1px offset (`--sk-focus-offset: 1px`) — a thin outer ring, never a thick highlight.

### Borders & shadows
- **No drop shadows.** Apple uses **1px box-shadow rings** as borders:
  - `rgba(0,0,0,0.11) 0 0 .5px 0 inset` for swatch insets
  - `rgb(110,110,115) 0 0 0 1px` for floating pills
  - `rgba(180,180,180,0.3) 0 0 0 1px` for form inputs
- **No elevation system.** All cards sit flat; depth is implied via grouping and color contrast.

### Borders / corner radii — strict bimodal
- **Pills (≥120px radius)** for anything you tap: 120px (small CTA), 170px, 980px (large), 999px catch-all.
- **Cards (8–56px radius)** for anything you read: 8 (default), 10, 20 (product), 22 (paddle), 28 (pass), 32 (action button), 56 (pass intro).
- **Circles (50%)** only for color swatches and dot-nav.
- **Nothing in 60–110px range.** This bimodal gap is intentional — it tells users "tap me" vs "read me" at a glance.

### Transparency & blur
- **Used only on overlays.** Sticky local nav has `backdrop-filter: saturate(180%) blur(20px)` over a `rgba(255,255,255,0.72)` base.
- **Body content never uses transparency.** Text is always at 100% opacity unless animating in.

### Cards
- **Flat, no shadow, no border.** A "card" is just a colored rectangle (`#FFFFFF`, `#1D1D1F`, or `#F5F5F7`) with 8–32px radius, sized by 12-column inset.
- **Padding inside cards:** typically `40px` or `76px` top/bottom, matching the section rhythm.

### Layout
- **Max content widths:** `1260px` (standard), `1440px` (page max), `1680px` (hero only).
- **Inset content:** 80% of container (10/12 columns).
- **Flex-driven, not grid.** Apple uses bespoke JS-positioned animations and class-based columns; CSS Grid is rarely employed.

### Iconography — see ICONOGRAPHY below

---

## Iconography

Apple uses **exclusively inline SVGs** on this page (195 total). These are Apple-proprietary "SF Symbols"-style glyphs — chevrons, cart, search, Apple logo, play/pause, paddle-nav arrows. Properties:

- **All inherit `currentColor`** — so they crossfade with text color seamlessly.
- **Stroke weight is 1.5–2px** for line glyphs; filled glyphs (Apple logo, cart) have no stroke.
- **No icon font.** No Font Awesome. No Material. No Lucide. No Heroicons.
- **No emoji anywhere.** Apple does not use emoji in marketing surfaces.
- **No unicode glyphs** standing in for icons (e.g. ▶ ✓ ←) — they use SVG equivalents.

### What's in `assets/`
- `apple-logo.svg` — the Apple wordmark glyph (filled, currentColor).
- `chevron-right.svg`, `chevron-down.svg`, `chevron-left.svg`
- `cart.svg`, `search.svg`, `close.svg`
- `play.svg`, `pause.svg`, `paddle-left.svg`, `paddle-right.svg`
- Finish swatches: `finish-desert.svg`, `finish-black.svg`, `finish-natural.svg` (radial-render PNGs would be more faithful but SVG keeps it portable).

### Icon substitution
**No CDN substitutes are loaded.** Apple's glyphs are distinctive enough that Lucide/Heroicons would visibly change the brand. All icons in this kit are hand-rolled SVGs matching Apple's stroke vocabulary. **If you have access to SF Symbols exports, drop them into `assets/`** — the components reference glyphs by file name and will pick them up.

---

## UI Kits

| Kit | Path | What it covers |
|---|---|---|
| iPhone 17 Pro marketing page | `ui_kits/iphone-17-pro/` | GlobalNav, LocalNav, Hero, Highlights, FinishPicker, EnvironmentTile, BuyStrip, Footer |

Open `ui_kits/iphone-17-pro/index.html` to see the assembled page.
