---
name: apple-iphone17pro-design
description: Use this skill to generate well-branded interfaces and assets for the Apple iPhone 17 Pro marketing surface, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key entry points:
- `README.md` — full brand voice, visual foundations, iconography
- `colors_and_type.css` — the complete `--sk-*` token system + semantic type classes
- `assets/` — Apple logo, chevrons, cart, search, play, close (inline SVG, currentColor)
- `preview/` — small per-token reference cards
- `ui_kits/iphone-17-pro/` — JSX components recreating the marketing page

Design rules to never break:
1. Two backgrounds (`#F5F5F7` light, `#1D1D1F` dark) and ONE action color (`#0071E3`). Never invent new hues.
2. SF Pro only. Inter is the cross-platform substitute. Weights: 300/400/600/700 — never 500 or 800+.
3. Bimodal radii. Pills `≥120px` for tap, cards `8–32px` for read. Nothing in between.
4. No drop shadows. Borders are 1px box-shadow rings.
5. No emoji, no first-person, no exclamation marks. Sentence-case headlines. lowercase i in iPhone.
6. Canonical motion is `0.32s cubic-bezier(.4,0,.6,1)`. No bounces or springs.
