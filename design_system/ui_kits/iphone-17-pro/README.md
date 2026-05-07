# iPhone 17 Pro — Marketing Page UI Kit

A pixel-faithful recreation of the apple.com/iphone-17-pro/ marketing surface, decomposed into small composable JSX components.

## Files

| File | What it is |
|---|---|
| `index.html` | Loads React + Babel + the components and renders the full page demo. |
| `GlobalNav.jsx` | The 44px Apple top bar (apple logo + category links + search/cart). |
| `LocalNav.jsx` | The 52px sticky product nav with the blue Buy pill. |
| `Hero.jsx` | Dark full-bleed hero with display headline + dual CTAs + product render placeholder. |
| `Highlights.jsx` | Alternating dark/light highlight tiles (camera, A19 chip, battery, design). |
| `FinishPicker.jsx` | The titanium-finish color picker with circular swatches. |
| `EnvironmentTile.jsx` | The recycling/electricity/packaging colored-accent block. |
| `BuyStrip.jsx` | The end-of-page large blue marquee CTA. |
| `Footer.jsx` | The full Apple footer with link grid + copyright. |

## Coverage

This kit recreates the **structure and visual language** of the page, not its full content depth. The core Apple marketing-surface components are all present; the live page has many more highlight tiles, a 3D product viewer, scroll-driven animations, and an All-Access Pass module that are simplified or stubbed here.

## Caveats

- **No 3D product viewer.** The Hero shows a flat product render placeholder slot.
- **No scroll-driven animations.** Apple's live page uses bespoke JS scroll-position animations across many sections; this is a static composition.
- **Imagery is placeholder.** The original page uses high-resolution product photography; this kit shows neutral image slots that you can drop your own renders into.
- **Footer link content is shortened.** The real footer has ~10 columns of grouped links; we show 5 representative columns.
