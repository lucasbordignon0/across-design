# Across Design

The September 2026 Across brand guidelines and downloadable assets. The design system opens directly at `/`; previous `/guide.html` links redirect while preserving their query and hash.

## Run locally

```sh
npm ci
npm run dev
```

## Build and preview

```sh
npm run assets
npm run build
npm run preview
```

`npm run assets` regenerates approved SVG/PNG logo variants, the favicon, gradient artwork, color tokens, and all five ZIP packs. Generated release files are committed so a regular deployment only needs `npm ci && npm run build`. Asset archives have fixed revision timestamps for reproducible output.

## Brand sources

- [Brand guidelines in Figma](https://www.figma.com/design/hRaAhovZJOTFySyJhrlYiU/)
- [Supreme on Fontshare](https://www.fontshare.com/fonts/supreme)
- [IvyPresto on Adobe Fonts](https://fonts.adobe.com/fonts/ivypresto-headline)

Official vector masters are in `brand-masters/`. Guideline diagrams are built with vector masters and browser layouts; the radial surface uses an inline SVG gradient. Raster previews are limited to Photo Style and Iconography. All other guideline artwork uses SVG or browser layouts. Content, palettes, and mode tokens live in `src/content.js`.

Supreme is served through Fontshare's official variable-font stylesheet. It is used throughout the interface, including technical values and filenames. The supplied local font package confirmed the 100–800 weight range; font files are not redistributed in this repository or in download ZIPs.

The Adobe kit supplies IvyPresto Headline and IvyPresto Text for live specimens. Text is used for longer decorative paragraph examples; Display is documented for oversized editorial work. The guide's interface remains Supreme.

Light is the default, matching the dapp light tokens at revision `2a6561762426b9df0601558050bfc05d7cc6d359`: pale #F3F7F7 page, white cards, #151518 text, tinted hairlines, and aqua accents. The Colors page documents both modes, including the specified Aqua 400 text in the light-mode example. That pairing is intentionally retained from the approved guidelines.

The live playground uses intact approved variants, preserving the transparent symbol cutouts. Its lower size limits are practical preview limits, not official minimum-size rules.
