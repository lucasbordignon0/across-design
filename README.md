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

Official vector masters are in `brand-masters/`. Guideline diagrams and photographic examples in `public/images/brand/` are optimized exports from Figma. Content, palettes, and mode tokens live in `src/content.js`.

Supreme is served through Fontshare's official variable-font stylesheet. It is used throughout the interface, including technical values and filenames. The supplied local font package confirmed the 100–800 weight range; font files are not redistributed in this repository or in download ZIPs.

The existing Adobe kit supplies IvyPresto Headline for live specimens. Display and Text are documented with Figma-exported specimens because those families are not present in that kit. The guide's interface remains Supreme.

Dark is the default. The Colors page documents both modes, including the specified Aqua 400 text in the light-mode example. That pairing is intentionally retained from the approved guidelines.

The live playground uses intact approved variants, preserving the transparent symbol cutouts. Its lower size limits are practical preview limits, not official minimum-size rules.
