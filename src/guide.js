import './guide.css'
import '@fontsource/geist-mono/200.css'
import '@fontsource/geist-mono/300.css'
import '@fontsource/geist-mono/400.css'
import '@fontsource/geist-mono/500.css'
import '@fontsource/geist-mono/600.css'
import '@fontsource/geist-mono/700.css'
import '@fontsource/barlow/300.css'
import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '@fontsource/barlow/700.css'

// ── Build date ──────────────────────────────────────────
function formatBuildDate() {
  const d = new Date(__BUILD_DATE__)
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

// ── Navigation data ──────────────────────────────────────
const NAV_DATA = [
  {
    id: 'foundations',
    label: 'Foundations',
    pages: [
      {
        id: 'logo',
        label: 'Logo',
        sections: [
          { id: 'primary-logo', label: 'Primary Logo' },
          { id: 'symbol', label: 'Symbol' },
          { id: 'logo-playground', label: 'Logo Playground' },
          { id: 'clear-space', label: 'Clear Space' },
          { id: 'partnerships', label: 'Partnerships' },
          { id: 'alt-logos', label: 'Alt Logos' },
          { id: 'experimentations', label: 'Experimentations' },
          { id: 'logo-resources', label: 'Resources' },
        ],
      },
      {
        id: 'colors',
        label: 'Colors',
        sections: [
          { id: 'primary-colors', label: 'Primary Colors' },
          { id: 'color-shades', label: 'Shades' },
          { id: 'color-transparency', label: 'Transparency' },
          { id: 'functional-colors', label: 'Functional Colors' },
        ],
      },
      {
        id: 'typography',
        label: 'Typography',
        sections: [
          { id: 'type-overview', label: 'Overview' },
          { id: 'type-ivypresto', label: 'IvyPresto Headline' },
          { id: 'type-barlow', label: 'Barlow' },
          { id: 'type-geist-mono', label: 'Geist Mono' },
          { id: 'type-scale', label: 'Type Scale' },
          { id: 'type-usage', label: 'Usage' },
          { id: 'type-exploration', label: 'Exploration' },
        ],
      },
      {
        id: 'iconography',
        label: 'Iconography',
        sections: [{ id: 'icon-overview', label: 'Overview' }],
      },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    pages: [
      {
        id: 'resources-downloads',
        label: 'Downloads',
        sections: [{ id: 'res-downloads', label: 'Downloads' }],
      },
    ],
  },
]

// ── Chevron SVG ──────────────────────────────────────────
const CHEVRON_SVG = `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="#151518" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

// ── Download icon SVG ────────────────────────────────────
const DOWNLOAD_SVG = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 2v8.5M4.5 7L8 10.5 11.5 7M3 13.5h10" stroke="#151518" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

// ── Logo Playground config ───────────────────────────────
const PLAYGROUND_PRESETS = [
  { hex: '#6CF9D8', label: 'Aqua' },
  { hex: '#2D2E33', label: 'Dark Gray' },
  { hex: '#E0F3FF', label: 'Bright Gray' },
]

const PLAYGROUND_CONFIG = {
  wordmark: {
    src: '/Across_Logo_logo_full_Dark.svg',
    ratio: 338 / 64,
    minW: 32,
    maxW: 800,
    defaultW: 280,
  },
  symbol: {
    src: '/Across_Logo_logomark_circle_transparent_Dark.svg',
    ratio: 1,
    minW: 32,
    maxW: 500,
    defaultW: 120,
  },
}

// ── Color helpers ────────────────────────────────────────
function getRelativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function getLogoColor(bgHex) {
  const L = getRelativeLuminance(bgHex)
  if (L < 0.05) {
    // Aqua only on pure greys, green-ish greys, or blue-ish greys
    const { h, s } = hexToHsv(bgHex)
    const isGrey = s < 0.08
    const isGreenishGrey = s < 0.25 && h >= 120 && h <= 190
    const isBluishGrey = s < 0.25 && h >= 190 && h <= 270
    if (isGrey || isGreenishGrey || isBluishGrey) return { hex: '#6CF9D8', name: 'aqua' }
    return { hex: '#FFFFFF', name: 'white' }
  }
  if (L < 0.35) return { hex: '#FFFFFF', name: 'white' }
  return { hex: '#151518', name: 'dark' }
}

// ── HSV ↔ Hex conversion ────────────────────────────────
function hsvToHex(h, s, v) {
  const f = (n) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  const r = Math.round(f(5) * 255)
  const g = Math.round(f(3) * 255)
  const b = Math.round(f(1) * 255)
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function hexToHsv(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  const s = max === 0 ? 0 : d / max
  return { h, s, v: max }
}

// ── Page content data ────────────────────────────────────
const PAGE_CONTENT = {
  logo: {
    sections: {
      'primary-logo': {
        desc: 'The Across wordmark is the primary representation of our brand. It should be used across most communications, marketing materials, and digital experiences.\n\nAlways use approved logo files. Do not attempt to recreate or modify the wordmark in any way.',
        layout: 'single',
        images: ['/images/logo/logoAssets01.png'],
      },
      'symbol': {
        desc: 'The Across symbol serves as a compact brand identifier. Use it when space is limited, as a favicon, or as a secondary mark alongside the full wordmark.\n\nThe symbol retains the core visual identity and should follow the same usage guidelines as the primary logo.',
        layout: 'single',
        images: ['/images/logo/logoAssets02.png'],
      },
      'logo-playground': {
        desc: 'Explore how the Across logo adapts to different environments. The logo automatically selects its color variant based on background contrast — aqua for deep darks, white for mid-tones, and dark for bright surfaces.\n\nAdjust the background, size, and variation below to test approved configurations.',
        layout: 'playground',
      },
      'clear-space': {
        desc: 'Maintaining adequate clear space around the logo ensures visual impact and legibility. The minimum clear space is derived from the proportional relationships within the wordmark itself.\n\nNever allow other visual elements, text, or edges to encroach on the defined clear space area.',
        layout: 'single',
        images: ['/images/logo/logoAssets04.png'],
      },
      'partnerships': {
        desc: 'When the Across brand appears alongside partner logos, these guidelines ensure balanced and respectful co-branding. Use the approved divider formats shown below.\n\nPartner logos should maintain equal visual weight. Refer to the partnership kit for specific lockup templates.',
        layout: 'stacked',
        images: ['/images/logo/logoAssets05.png', '/images/logo/logoAssets06.png'],
      },
      'alt-logos': {
        desc: 'Alternative logo versions are provided for specific contexts and backgrounds. Each variant is optimized for its intended use case and environment.\n\nSelect the version that provides the best contrast and legibility for your specific application.',
        layout: 'cards',
        cards: [
          { image: '/images/logo/logoAssets08.png', label: 'logo-dark.svg' },
          { image: '/images/logo/logoAssets08-1.png', label: 'logo-light.svg' },
          { image: '/images/logo/logoAssets09.png', label: 'logo-mono.svg' },
        ],
      },
      'experimentations': {
        desc: 'Exploratory expressions of the brand identity. These experimental treatments push the visual language while retaining core brand recognition.\n\nExperimentations are intended for limited editorial and creative use — not for general marketing communications.',
        layout: 'cards',
        cards: [
          { image: '/images/logo/logoAssets10.png' },
          { image: '/images/logo/logoAssets11.png' },
          { image: '/images/logo/logoAssets12.png' },
        ],
      },
      'logo-resources': {
        desc: 'Download approved logo files and brand assets. All assets are provided in multiple formats to support various use cases and production requirements.',
        layout: 'resources',
        resources: [
          { name: 'All Assets', format: 'ZIP', file: '/Across_Assets.zip' },
          { name: 'Logo Assets', format: 'ZIP', file: '/Across_Logo_Assets.zip' },
          { name: 'Alt Logos', format: 'ZIP', file: '/Across_Alt_Logos.zip' },
          { name: 'Gradients', format: 'ZIP', file: '/Across_Gradients.zip' },
          { name: 'Main Colors', format: 'ZIP', file: '/Across_Main_Colors.zip' },
        ],
      },
    },
  },
  colors: {
    sections: {
      'primary-colors': {
        desc: 'The Across color palette is built around three primary colors — Aqua, Dark Gray, and Bright Gray. These form the foundation of all brand communications and should be used consistently across every touchpoint.\n\nAqua serves as the signature brand color, Dark Gray provides depth and contrast, and Bright Gray offers a clean, modern complement.',
        layout: 'color-blocks',
        colors: [
          { name: 'Aqua', hex: '#6CF9D8' },
          { name: 'Dark Gray', hex: '#2D2E33' },
          { name: 'Bright Gray', hex: '#E0F3FF' },
        ],
      },
      'color-shades': {
        desc: 'Each primary color extends into a full shade scale for flexible application across interfaces, illustrations, and layouts. Use lighter values for backgrounds and subtle accents, deeper values for emphasis and text.\n\nMaintain visual hierarchy by pairing shades intentionally — avoid combining shades that are too similar in value.',
        layout: 'color-shades',
        columns: [
          {
            name: 'Aqua',
            shades: [
              { step: '100', hex: '#BDFCED' },
              { step: '200', hex: '#98FBE4' },
              { step: '300', hex: '#6CF9D8' },
              { step: '400', hex: '#66E5C7' },
              { step: '500', hex: '#59BCA6' },
              { step: '600', hex: '#4D9385' },
              { step: '700', hex: '#406B65' },
              { step: '800', hex: '#3A5754' },
              { step: '900', hex: '#334244' },
            ],
          },
          {
            name: 'Neutrals',
            shades: [
              { step: '000', hex: '#FFFFFF' },
              { step: '025', hex: '#E0F3FF' },
              { step: '050', hex: '#CEDFEB' },
              { step: '100', hex: '#AAB8C2' },
              { step: '200', hex: '#869099' },
              { step: '300', hex: '#636970' },
              { step: '400', hex: '#51555C' },
              { step: '500', hex: '#3F4247' },
              { step: '600', hex: '#34353B' },
              { step: '700', hex: '#2D2E33' },
              { step: '800', hex: '#202024' },
              { step: '850', hex: '#1B1B1E' },
              { step: '900', hex: '#151518' },
            ],
          },
        ],
      },
      'color-transparency': {
        desc: 'Transparency variants allow primary colors to be layered over backgrounds while preserving underlying content. Use these values for overlays, glass effects, and subtle color washes.\n\nAll values are derived from the primary color palette and should be used at the specified opacity levels only.',
        layout: 'color-transparency',
        columns: [
          {
            name: 'Aqua',
            base: '#6CF9D8',
            levels: ['5', '10', '20', '30', '40', '50', '60', '70', '80', '90'],
          },
          {
            name: 'Bright Gray',
            base: '#E0F3FF',
            levels: ['5', '10', '20', '30', '40', '50', '60', '70', '80', '90'],
          },
          {
            name: 'Dark Gray',
            base: '#2D2E33',
            levels: ['5', '10', '20', '30', '40', '50', '60', '70', '80', '90'],
            lightBg: true,
          },
        ],
      },
      'functional-colors': {
        desc: 'Functional colors serve specific UI communication purposes — Blue for information and links, Yellow for warnings and attention, Red for errors and destructive actions.\n\nThese colors should be reserved for their designated functions to maintain consistent meaning across the product experience.',
        layout: 'color-blocks',
        colors: [
          { name: 'Blue', hex: '#44D2FF' },
          { name: 'Yellow', hex: '#F9D26C' },
          { name: 'Red', hex: '#F96C6C' },
        ],
      },
    },
  },
  typography: {
    sections: {
      'type-overview': {
        desc: 'Typography plays a central role in the Across identity system. Our type palette balances expressive editorial character with functional clarity across web, product, and marketing.\n\nThree typefaces form the foundation: IvyPresto Headline for headlines, Barlow for body and UI copy, and Geist Mono for code and data.',
        layout: 'type-overview',
        families: [
          { font: 'ivypresto-headline', label: 'IvyPresto Headline', role: 'Headlines & Editorial', sample: 'The Fastest Way to Move Money Onchain', weight: 600, url: 'https://fonts.adobe.com/fonts/ivypresto-headline' },
          { font: 'Barlow', label: 'Barlow', role: 'Body & UI', sample: 'The Fastest Way to Move Money Onchain', weight: 600, url: 'https://fonts.google.com/specimen/Barlow' },
          { font: 'Geist Mono', label: 'Geist Mono', role: 'Monospace & Code', sample: 'The Fastest Way to Move Money Onchain', weight: 400, url: 'https://fonts.google.com/specimen/Geist+Mono' },
        ],
      },
      'type-ivypresto': {
        desc: 'IvyPresto Headline is a high-contrast serif typeface used for headline-level typography across the Across brand. It brings an editorial, premium feel to marketing pages and hero moments.\n\nLoaded via Adobe Fonts (Typekit). Use it sparingly — exclusively for large display text and headlines, never for body copy or UI elements.',
        layout: 'type-specimen',
        font: 'ivypresto-headline',
        label: 'IvyPresto Headline',
        weights: [
          { value: 100, name: 'Thin' },
          { value: 300, name: 'Light' },
          { value: 400, name: 'Regular' },
          { value: 600, name: 'SemiBold' },
          { value: 700, name: 'Bold' },
        ],
      },
      'type-barlow': {
        desc: 'Barlow is the primary typeface for body text, subtitles, and UI elements. It is a slightly rounded, low-contrast grotesk that offers excellent readability at small sizes while maintaining a modern, approachable feel.\n\nAvailable via Google Fonts. Use across body copy, navigation, buttons, form elements, and any functional text throughout the product and marketing.',
        layout: 'type-specimen',
        font: 'Barlow',
        label: 'Barlow',
        weights: [
          { value: 300, name: 'Light' },
          { value: 400, name: 'Regular' },
          { value: 500, name: 'Medium' },
          { value: 600, name: 'SemiBold' },
          { value: 700, name: 'Bold' },
        ],
      },
      'type-geist-mono': {
        desc: 'Geist Mono is the monospaced counterpart used for code snippets, transaction hashes, wallet addresses, technical data, and the brand guidelines system itself.\n\nIts consistent character widths make it ideal for tabular data, developer-facing content, and any context where alignment and precision matter.',
        layout: 'type-specimen',
        font: 'Geist Mono',
        label: 'Geist Mono',
        weights: [
          { value: 200, name: 'ExtraLight' },
          { value: 300, name: 'Light' },
          { value: 400, name: 'Regular' },
          { value: 500, name: 'Medium' },
          { value: 600, name: 'SemiBold' },
          { value: 700, name: 'Bold' },
        ],
      },
      'type-scale': {
        desc: 'The Across type scale defines consistent sizing across the product and marketing. Display sizes use IvyPresto Headline for high-impact moments. Heading, Body, and Label sizes use Barlow for functional hierarchy.\n\nMono sizes use Geist Mono for code and data contexts. Always maintain proper hierarchy — never skip more than two scale steps between adjacent elements.',
        layout: 'type-scale',
        groups: [
          {
            name: 'Display',
            font: 'ivypresto-headline',
            sizes: [
              { label: 'Display-XX Large', size: 72, weight: 400, lineHeight: 1.1 },
              { label: 'Display-X Large', size: 56, weight: 400, lineHeight: 1.15 },
              { label: 'Display-Large', size: 44, weight: 400, lineHeight: 1.2 },
              { label: 'Display-Medium', size: 36, weight: 400, lineHeight: 1.25 },
              { label: 'Display-Small', size: 28, weight: 400, lineHeight: 1.3 },
            ],
          },
          {
            name: 'Heading',
            font: 'Barlow',
            sizes: [
              { label: 'Heading-XX Large', size: 36, weight: 600, lineHeight: 1.2 },
              { label: 'Heading-X Large', size: 28, weight: 600, lineHeight: 1.25 },
              { label: 'Heading-Large', size: 22, weight: 600, lineHeight: 1.3 },
              { label: 'Heading-Medium', size: 18, weight: 600, lineHeight: 1.35 },
              { label: 'Heading-Small', size: 16, weight: 600, lineHeight: 1.4 },
              { label: 'Heading-X Small', size: 14, weight: 600, lineHeight: 1.4 },
            ],
          },
          {
            name: 'Label',
            font: 'Barlow',
            sizes: [
              { label: 'Label-Large', size: 16, weight: 500, lineHeight: 1.4 },
              { label: 'Label-Medium', size: 14, weight: 500, lineHeight: 1.4 },
              { label: 'Label-Small', size: 12, weight: 500, lineHeight: 1.4 },
              { label: 'Label-X Small', size: 11, weight: 500, lineHeight: 1.4 },
            ],
          },
          {
            name: 'Body',
            font: 'Barlow',
            sizes: [
              { label: 'Body-Large', size: 18, weight: 400, lineHeight: 1.6 },
              { label: 'Body-Medium', size: 16, weight: 400, lineHeight: 1.6 },
              { label: 'Body-Small', size: 14, weight: 400, lineHeight: 1.6 },
              { label: 'Body-X Small', size: 12, weight: 400, lineHeight: 1.5 },
            ],
          },
          {
            name: 'Mono',
            font: 'Geist Mono',
            sizes: [
              { label: 'Mono-Large', size: 16, weight: 400, lineHeight: 1.5 },
              { label: 'Mono-Medium', size: 14, weight: 400, lineHeight: 1.5 },
              { label: 'Mono-Small', size: 12, weight: 400, lineHeight: 1.5 },
              { label: 'Mono-X Small', size: 11, weight: 400, lineHeight: 1.5 },
            ],
          },
        ],
      },
      'type-usage': {
        desc: 'Good typesetting requires a discerning eye. Below are some universal principles to follow when setting type that helps ensure consistency and high legibility.\n\n* Leading can be adjusted up to 100% on headlines to avoid ascenders and descenders overlapping.',
        layout: 'type-usage',
        blocks: [
          {
            role: 'Headline',
            font: 'ivypresto-headline',
            fontLabel: 'IvyPresto Headline',
            weight: 400,
            leading: '110%*',
            tracking: '-1%',
            sample: 'Do more with your money',
            sampleSize: 80,
            sampleLineHeight: 1.1,
            sampleLetterSpacing: -0.8,
          },
          {
            role: 'Subtitle',
            font: 'Barlow',
            fontLabel: 'Barlow Medium',
            weight: 500,
            leading: '110%',
            tracking: '-4%',
            sample: 'The fastest bridge in crypto with the lowest fees',
            sampleSize: 32,
            sampleLineHeight: 1.1,
            sampleLetterSpacing: -1.28,
          },
          {
            role: 'Body',
            font: 'Barlow',
            fontLabel: 'Barlow Medium',
            weight: 500,
            leading: '150%',
            tracking: '-1%',
            sample: 'Body text is regular width and regular weight. Typography is a crucial aspect of any design project, as it can make or break the readability and overall aesthetic of the final product. The choice of font, size, spacing, and color all play a significant role in how the text is perceived by the viewer.',
            sampleSize: 16,
            sampleLineHeight: 1.5,
            sampleLetterSpacing: -0.16,
          },
          {
            role: 'Eyebrow',
            font: 'Barlow',
            fontLabel: 'Barlow Medium',
            weight: 500,
            leading: '130%',
            tracking: '0%',
            transform: 'uppercase',
            sample: 'Category label or section identifier',
            sampleSize: 14,
            sampleLineHeight: 1.3,
            sampleLetterSpacing: 0,
          },
          {
            role: 'Eyebrow (Mono)',
            font: 'Geist Mono',
            fontLabel: 'Geist Mono',
            weight: 500,
            leading: '130%',
            tracking: '5%',
            transform: 'uppercase',
            sample: 'Technical data or tertiary information',
            sampleSize: 12,
            sampleLineHeight: 1.3,
            sampleLetterSpacing: 0.6,
          },
        ],
      },
      'type-exploration': {
        desc: 'The Across brand is intentionally open when it comes to typographic expression. For exploration material, marketing campaigns, and editorial content, other typefaces can be used to push the visual language.\n\nThese explorations are intended for creative, limited-use contexts — not for core product UI or standard brand communications.',
        layout: 'cards',
        cards: [
          { image: '/images/typography/typoAssets01.png' },
          { image: '/images/typography/typoAssets02.png' },
          { image: '/images/typography/typoAssets03.png' },
        ],
      },
    },
  },
  iconography: {
    sections: {
      'icon-overview': {
        desc: 'Across uses the Central Icon System by Iconists — a comprehensive, handcrafted icon library built on a 24×24 grid with a 20×20 live area.\n\nThe system provides 440+ symbols across 30 variations each, with optimized stroke weights and corner radii that adapt to different contexts and sizes.',
        layout: 'icon-feature',
        url: 'https://iconists.co/central',
        linkLabel: 'Browse Central Icon System ↗',
      },
    },
  },
  'resources-downloads': {
    sections: {
      'res-downloads': {
        desc: 'Download approved brand assets. All files are provided in production-ready formats for various use cases.',
        layout: 'resources',
        resources: [
          { name: 'All Assets', format: 'ZIP', file: '/Across_Assets.zip' },
          { name: 'Logo Assets', format: 'ZIP', file: '/Across_Logo_Assets.zip' },
          { name: 'Alt Logos', format: 'ZIP', file: '/Across_Alt_Logos.zip' },
          { name: 'Gradients', format: 'ZIP', file: '/Across_Gradients.zip' },
          { name: 'Main Colors', format: 'ZIP', file: '/Across_Main_Colors.zip' },
        ],
      },
    },
  },
}

// ── Helpers ──────────────────────────────────────────────
function formatDesc(text) {
  return text
    .split('\n\n')
    .map((p) => `<p>${p}</p>`)
    .join('')
}

// ── Copy to clipboard helper ────────────────────────────
function copyColor(value, feedbackEl) {
  navigator.clipboard.writeText(value).then(() => {
    feedbackEl.classList.add('copied')
    const orig = feedbackEl.textContent
    feedbackEl.textContent = 'Copied!'
    setTimeout(() => {
      feedbackEl.textContent = orig
      feedbackEl.classList.remove('copied')
    }, 1000)
  })
}

// ── Poster-style hover copy label ────────────────────────
function initCopyLabel(el, value) {
  const label = document.createElement('div')
  label.className = 'cb-label'
  el.appendChild(label)

  let timeouts = []
  let isVisible = false
  let copied = false

  function showText(text) {
    label.innerHTML = ''
    const spans = []
    for (const char of text) {
      const span = document.createElement('span')
      span.textContent = char
      label.appendChild(span)
      spans.push(span)
    }

    // Start as thin line
    label.style.transition = 'none'
    label.style.width = '2px'
    label.style.opacity = '1'
    label.offsetHeight

    // Measure full width
    label.style.width = 'auto'
    const fullWidth = label.offsetWidth
    label.style.width = '2px'
    label.offsetHeight

    // Expand
    label.style.transition = 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    label.style.width = fullWidth + 'px'

    // Stagger letters
    let cumDelay = 100
    let gap = 55
    spans.forEach((span) => {
      const tid = setTimeout(() => {
        span.style.opacity = '1'
        span.style.transform = 'translateY(0)'
      }, cumDelay)
      timeouts.push(tid)
      cumDelay += gap
      gap = Math.max(18, gap - 6)
    })
  }

  function hideLabel() {
    isVisible = false
    timeouts.forEach(clearTimeout)
    timeouts = []
    label.style.transition = 'opacity 0.15s ease-out, width 0.25s ease-in'
    label.style.opacity = '0'
    label.style.width = '2px'
  }

  el.addEventListener('mouseenter', (e) => {
    if (copied) return
    isVisible = true
    label.style.left = (e.offsetX + 10) + 'px'
    label.style.top = (e.offsetY - 13) + 'px'
    showText('COPY')
  })

  el.addEventListener('mousemove', (e) => {
    if (!isVisible) return
    label.style.left = (e.offsetX + 10) + 'px'
    label.style.top = (e.offsetY - 13) + 'px'
  })

  el.addEventListener('mouseleave', () => {
    hideLabel()
    copied = false
  })

  el.addEventListener('click', () => {
    navigator.clipboard.writeText(value).then(() => {
      copied = true
      timeouts.forEach(clearTimeout)
      timeouts = []
      hideLabel()
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isVisible = true
          showText('COPIED')
          setTimeout(() => {
            hideLabel()
            copied = false
          }, 1200)
        })
      })
    })
  })
}

// ── Build Logo Playground ────────────────────────────────
function buildPlayground(sectionEl) {
  const playground = document.createElement('div')
  playground.className = 'playground'

  // ─ Canvas ─
  const canvas = document.createElement('div')
  canvas.className = 'playground-canvas'
  const logoContainer = document.createElement('div')
  logoContainer.className = 'playground-logo'
  canvas.appendChild(logoContainer)
  playground.appendChild(canvas)

  // ─ Controls ─
  const controls = document.createElement('div')
  controls.className = 'playground-controls'

  // State
  let currentBg = '#2D2E33'
  let currentVariation = 'wordmark'
  let currentWidth = PLAYGROUND_CONFIG.wordmark.defaultW
  const svgCache = {}

  // Picker HSV state
  let pickerH = 0
  let pickerS = 0
  let pickerV = 0

  // Load SVG, swap fills to currentColor
  async function loadSVG(key) {
    if (svgCache[key]) return svgCache[key]
    const resp = await fetch(PLAYGROUND_CONFIG[key].src)
    let text = await resp.text()
    text = text.replace(/fill="#151518"/g, 'fill="currentColor"')
    text = text.replace(/ width="\d+"/, '')
    text = text.replace(/ height="\d+"/, '')
    svgCache[key] = text
    return text
  }

  // ── Shared refs (populated below, used in update) ──
  let swatchEls = []
  let toggleEls = []
  let hexInput, sizeSlider, sizeValue, colorDot, colorName
  let pickerAreaEl, pickerCursorEl, hueCursorEl

  // Sync picker HSV from any hex
  function syncPickerFromHex(hex) {
    const hsv = hexToHsv(hex)
    pickerH = hsv.h
    pickerS = hsv.s
    pickerV = hsv.v
  }

  // Update all visual state
  function update() {
    const config = PLAYGROUND_CONFIG[currentVariation]
    const color = getLogoColor(currentBg)
    const w = Math.max(config.minW, Math.min(config.maxW, currentWidth))

    canvas.style.backgroundColor = currentBg
    logoContainer.style.color = color.hex
    logoContainer.style.width = w + 'px'
    logoContainer.style.height = w / config.ratio + 'px'

    colorDot.style.backgroundColor = color.hex
    colorDot.classList.toggle('playground-color-dot--light', color.name === 'white')
    colorName.textContent = color.name

    hexInput.value = currentBg

    sizeSlider.min = config.minW
    sizeSlider.max = config.maxW
    sizeSlider.value = w
    sizeValue.textContent = Math.round(w) + 'px'

    swatchEls.forEach((s) => s.classList.toggle('active', s.dataset.color === currentBg))
    toggleEls.forEach((t) => t.classList.toggle('active', t.dataset.variation === currentVariation))

    // Picker visuals
    const hueColor = hsvToHex(pickerH, 1, 1)
    pickerAreaEl.style.backgroundColor = hueColor
    pickerCursorEl.style.left = (pickerS * 100) + '%'
    pickerCursorEl.style.top = ((1 - pickerV) * 100) + '%'
    hueCursorEl.style.left = (pickerH / 360 * 100) + '%'
  }

  // Switch variation with crossfade
  async function switchVariation(key) {
    logoContainer.style.opacity = '0'
    await new Promise((r) => setTimeout(r, 180))

    currentVariation = key
    currentWidth = PLAYGROUND_CONFIG[key].defaultW
    const svg = await loadSVG(key)
    logoContainer.innerHTML = svg
    update()

    requestAnimationFrame(() => {
      logoContainer.style.opacity = '1'
    })
  }

  // ── Background row ──
  const bgRow = document.createElement('div')
  bgRow.className = 'playground-row'
  bgRow.innerHTML = '<span class="playground-label">Background</span>'

  const swatches = document.createElement('div')
  swatches.className = 'playground-swatches'
  for (const preset of PLAYGROUND_PRESETS) {
    const s = document.createElement('div')
    s.className = 'playground-swatch'
    s.dataset.color = preset.hex
    s.style.backgroundColor = preset.hex
    if (getRelativeLuminance(preset.hex) > 0.4) s.classList.add('playground-swatch--light')
    s.addEventListener('click', () => {
      currentBg = preset.hex
      syncPickerFromHex(preset.hex)
      update()
    })
    swatches.appendChild(s)
    swatchEls.push(s)
  }
  bgRow.appendChild(swatches)

  // Hex input
  hexInput = document.createElement('input')
  hexInput.className = 'playground-hex'
  hexInput.type = 'text'
  hexInput.value = currentBg
  hexInput.maxLength = 7
  hexInput.addEventListener('change', () => {
    let val = hexInput.value.trim()
    if (!val.startsWith('#')) val = '#' + val
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      currentBg = val.toUpperCase()
      syncPickerFromHex(currentBg)
      update()
    } else {
      hexInput.value = currentBg
    }
  })
  bgRow.appendChild(hexInput)
  controls.appendChild(bgRow)

  // ── Color Picker row ──
  const pickerRow = document.createElement('div')
  pickerRow.className = 'playground-row playground-row--picker'
  pickerRow.innerHTML = '<span class="playground-label">Custom</span>'

  const picker = document.createElement('div')
  picker.className = 'playground-picker'

  // Saturation / brightness area
  pickerAreaEl = document.createElement('div')
  pickerAreaEl.className = 'playground-picker-area'
  const areaBg = document.createElement('div')
  areaBg.className = 'playground-picker-area-bg'
  pickerAreaEl.appendChild(areaBg)
  pickerCursorEl = document.createElement('div')
  pickerCursorEl.className = 'playground-picker-cursor'
  pickerAreaEl.appendChild(pickerCursorEl)

  function handleAreaDrag(e) {
    const rect = pickerAreaEl.getBoundingClientRect()
    pickerS = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    pickerV = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    currentBg = hsvToHex(pickerH, pickerS, pickerV)
    update()
  }

  pickerAreaEl.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    pickerAreaEl.setPointerCapture(e.pointerId)
    handleAreaDrag(e)
  })
  pickerAreaEl.addEventListener('pointermove', (e) => {
    if (pickerAreaEl.hasPointerCapture(e.pointerId)) handleAreaDrag(e)
  })
  picker.appendChild(pickerAreaEl)

  // Hue strip
  const hueStrip = document.createElement('div')
  hueStrip.className = 'playground-picker-hue'
  hueCursorEl = document.createElement('div')
  hueCursorEl.className = 'playground-picker-hue-cursor'
  hueStrip.appendChild(hueCursorEl)

  function handleHueDrag(e) {
    const rect = hueStrip.getBoundingClientRect()
    pickerH = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 360
    currentBg = hsvToHex(pickerH, pickerS, pickerV)
    update()
  }

  hueStrip.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    hueStrip.setPointerCapture(e.pointerId)
    handleHueDrag(e)
  })
  hueStrip.addEventListener('pointermove', (e) => {
    if (hueStrip.hasPointerCapture(e.pointerId)) handleHueDrag(e)
  })
  picker.appendChild(hueStrip)

  pickerRow.appendChild(picker)
  controls.appendChild(pickerRow)

  // ── Size row ──
  const sizeRow = document.createElement('div')
  sizeRow.className = 'playground-row'
  sizeRow.innerHTML = '<span class="playground-label">Size</span>'

  const sliderWrap = document.createElement('div')
  sliderWrap.className = 'playground-slider'

  sizeSlider = document.createElement('input')
  sizeSlider.type = 'range'
  sizeSlider.min = PLAYGROUND_CONFIG.wordmark.minW
  sizeSlider.max = PLAYGROUND_CONFIG.wordmark.maxW
  sizeSlider.value = currentWidth
  sizeSlider.addEventListener('input', () => {
    currentWidth = parseInt(sizeSlider.value)
    update()
  })
  sliderWrap.appendChild(sizeSlider)

  sizeValue = document.createElement('span')
  sizeValue.className = 'playground-slider-value'
  sizeValue.textContent = currentWidth + 'px'
  sliderWrap.appendChild(sizeValue)
  sizeRow.appendChild(sliderWrap)
  controls.appendChild(sizeRow)

  // ── Variation row ──
  const varRow = document.createElement('div')
  varRow.className = 'playground-row'
  varRow.innerHTML = '<span class="playground-label">Variation</span>'

  const toggles = document.createElement('div')
  toggles.className = 'playground-toggles'
  for (const [key, label] of [['wordmark', 'Wordmark'], ['symbol', 'Symbol']]) {
    const btn = document.createElement('button')
    btn.className = 'playground-toggle'
    btn.dataset.variation = key
    btn.textContent = label
    btn.addEventListener('click', () => switchVariation(key))
    toggles.appendChild(btn)
    toggleEls.push(btn)
  }
  varRow.appendChild(toggles)

  // Logo color indicator
  const indicator = document.createElement('div')
  indicator.className = 'playground-color-indicator'
  colorDot = document.createElement('div')
  colorDot.className = 'playground-color-dot'
  indicator.appendChild(colorDot)
  colorName = document.createElement('span')
  colorName.className = 'playground-color-name'
  indicator.appendChild(colorName)
  varRow.appendChild(indicator)
  controls.appendChild(varRow)

  playground.appendChild(controls)
  sectionEl.appendChild(playground)

  // Init — sync picker to default bg, load wordmark
  syncPickerFromHex(currentBg)
  switchVariation('wordmark')
}

// ── State ────────────────────────────────────────────────
let openCategoryId = null
let activePageId = null
let activeSectionId = null
let scrollObserver = null

// ── DOM refs ─────────────────────────────────────────────
const sideNav = document.getElementById('side-nav')
const contentInner = document.getElementById('content-inner')
const guideContent = document.getElementById('guide-content')

// ── Build the side nav ───────────────────────────────────
function buildNav() {
  sideNav.innerHTML = ''

  // Logo
  const logoSection = document.createElement('div')
  logoSection.className = 'sn-section sn-logo'
  logoSection.innerHTML = `<a href="/"><img src="/acrossDesignFull.svg" alt="Across Design" /></a>`
  sideNav.appendChild(logoSection)

  // Info
  const infoSection = document.createElement('div')
  infoSection.className = 'sn-section sn-info'
  infoSection.innerHTML = `
    <span>across® protocol</span>
    <span>visual identity guidelines</span>
    <span class="muted">last updated: ${formatBuildDate()}</span>
  `
  sideNav.appendChild(infoSection)

  // Categories
  for (const cat of NAV_DATA) {
    const catEl = document.createElement('div')
    catEl.className = 'sn-category'
    catEl.dataset.category = cat.id
    if (cat.id === openCategoryId) catEl.classList.add('open')

    // Header
    const header = document.createElement('div')
    header.className = 'category-header'
    header.textContent = cat.label
    header.addEventListener('click', () => toggleCategory(cat.id))
    catEl.appendChild(header)

    // Body (accordion container)
    if (cat.pages.length > 0) {
      const body = document.createElement('div')
      body.className = 'category-body'

      const bodyInner = document.createElement('div')
      bodyInner.className = 'category-body-inner'

      const pages = document.createElement('div')
      pages.className = 'category-pages'

      for (const page of cat.pages) {
        const pageItem = document.createElement('div')
        pageItem.className = 'page-item'
        pageItem.dataset.page = page.id
        if (page.id === activePageId && cat.id === openCategoryId) {
          pageItem.classList.add('active')
        }

        // Page header row
        const pageHeader = document.createElement('div')
        pageHeader.className = 'page-header'

        const pageName = document.createElement('span')
        pageName.textContent = page.label
        pageHeader.appendChild(pageName)

        if (page.comingSoon) {
          const badge = document.createElement('span')
          badge.className = 'page-coming-soon'
          badge.textContent = 'Coming Soon'
          pageHeader.appendChild(badge)
          pageHeader.classList.add('page-header--disabled')
        } else {
          const chevron = document.createElement('span')
          chevron.className = 'page-chevron'
          chevron.innerHTML = CHEVRON_SVG
          pageHeader.appendChild(chevron)
          pageHeader.addEventListener('click', () => selectPage(cat.id, page.id))
        }
        pageItem.appendChild(pageHeader)

        // Page sections (sub-accordion)
        if (page.sections.length > 0) {
          const pageBody = document.createElement('div')
          pageBody.className = 'page-body'

          const pageBodyInner = document.createElement('div')
          pageBodyInner.className = 'page-body-inner'

          const sectionsEl = document.createElement('div')
          sectionsEl.className = 'page-sections'
          sectionsEl.dataset.pageId = page.id

          // Tracking dot
          const dot = document.createElement('div')
          dot.className = 'section-dot'
          sectionsEl.appendChild(dot)

          for (const section of page.sections) {
            const link = document.createElement('a')
            link.className = 'section-link'
            link.textContent = section.label
            link.href = `#${section.id}`
            link.dataset.sectionId = section.id
            link.addEventListener('click', (e) => {
              e.preventDefault()
              scrollToSection(section.id)
            })
            sectionsEl.appendChild(link)
          }

          pageBodyInner.appendChild(sectionsEl)
          pageBody.appendChild(pageBodyInner)
          pageItem.appendChild(pageBody)
        }

        pages.appendChild(pageItem)
      }

      bodyInner.appendChild(pages)
      body.appendChild(bodyInner)
      catEl.appendChild(body)
    }

    sideNav.appendChild(catEl)
  }

  // Download all assets button
  const dlSection = document.createElement('div')
  dlSection.className = 'sn-download'
  dlSection.innerHTML = `<a href="/Across_Assets.zip" download>
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1v10M8 11L4 7M8 11l4-4M2 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Download All Assets
  </a>`
  sideNav.appendChild(dlSection)
}

// ── Hash-based routing ───────────────────────────────────
// Format: #pageId
function updateHash(pageId) {
  const hash = `#${pageId}`
  if (location.hash !== hash) {
    history.pushState(null, '', hash)
  }
}

function findPageCategory(pageId) {
  for (const cat of NAV_DATA) {
    if (cat.pages.find((p) => p.id === pageId)) return cat.id
  }
  return null
}

function navigateFromHash() {
  const hashStr = location.hash.replace(/^#/, '')
  const params = new URLSearchParams(hashStr)
  // Support ?figmapage=<id> inside the hash for Figma captures
  const raw = params.get('figmapage') || hashStr.split('&')[0]
  if (!raw || raw.startsWith('figmacapture')) {
    // Default: first page
    const defaultCat = NAV_DATA[0]
    const defaultPage = defaultCat.pages[0]
    toggleCategory(defaultCat.id)
    return
  }

  const pageId = raw
  const categoryId = findPageCategory(pageId)
  if (!categoryId) {
    // Unknown page, fall back to default
    const defaultCat = NAV_DATA[0]
    toggleCategory(defaultCat.id)
    return
  }

  // Open correct category + page
  if (openCategoryId !== categoryId) {
    const prevCat = sideNav.querySelector(`.sn-category[data-category="${openCategoryId}"]`)
    if (prevCat) prevCat.classList.remove('open')
    openCategoryId = categoryId
    const newCat = sideNav.querySelector(`.sn-category[data-category="${categoryId}"]`)
    if (newCat) newCat.classList.add('open')
  }

  selectPage(categoryId, pageId)
}

window.addEventListener('popstate', () => {
  navigateFromHash()
})

// ── Toggle category accordion ────────────────────────────
function toggleCategory(categoryId) {
  if (openCategoryId === categoryId) return // already open

  // Close previous
  const prevCat = sideNav.querySelector(`.sn-category[data-category="${openCategoryId}"]`)
  if (prevCat) prevCat.classList.remove('open')

  // Open new
  openCategoryId = categoryId
  const newCat = sideNav.querySelector(`.sn-category[data-category="${categoryId}"]`)
  if (newCat) newCat.classList.add('open')

  // Select first page in category if any
  const cat = NAV_DATA.find((c) => c.id === categoryId)
  if (cat && cat.pages.length > 0) {
    selectPage(categoryId, cat.pages[0].id)
  }
}

// ── Select a page ────────────────────────────────────────
function closeMobileNav() {
  document.body.classList.remove('mobile-nav-open')
}

function selectPage(categoryId, pageId) {
  closeMobileNav()
  if (activePageId === pageId && openCategoryId === categoryId) return

  // Deactivate previous page item
  const prevPageItem = sideNav.querySelector(`.page-item.active`)
  if (prevPageItem) prevPageItem.classList.remove('active')

  // Activate new page item
  activePageId = pageId
  const newPageItem = sideNav.querySelector(`.page-item[data-page="${pageId}"]`)
  if (newPageItem) newPageItem.classList.add('active')

  // Update URL hash (push so back button works between pages)
  updateHash(pageId)

  // Render content
  renderContent(categoryId, pageId)
}

// ── Render page content ──────────────────────────────────
function renderContent(categoryId, pageId) {
  // Tear down previous observer
  if (scrollObserver) {
    scrollObserver.disconnect()
    scrollObserver = null
  }

  const cat = NAV_DATA.find((c) => c.id === categoryId)
  const page = cat?.pages.find((p) => p.id === pageId)
  if (!page) {
    contentInner.innerHTML = '<p style="opacity:0.3;padding:40px;">Coming soon.</p>'
    return
  }

  const content = PAGE_CONTENT[pageId]
  if (!content) {
    contentInner.innerHTML = '<p style="opacity:0.3;padding:40px;">Coming soon.</p>'
    return
  }

  contentInner.innerHTML = ''

  // ── Tall header (scrolls away normally) ──
  const header = document.createElement('div')
  header.className = 'content-header'
  header.innerHTML = `
    <div class="content-header-text">
      <span class="content-header-category">${cat.label}</span>
      <span class="content-header-title">${page.label}</span>
    </div>
  `
  contentInner.appendChild(header)


  // ── Sections ──
  for (const section of page.sections) {
    const data = content.sections[section.id]
    if (!data) continue

    const sectionEl = document.createElement('section')
    sectionEl.className = 'content-section'
    sectionEl.id = section.id

    // Text block (two-column)
    const textBlock = document.createElement('div')
    textBlock.className = 'section-text'
    textBlock.innerHTML = `
      <div class="section-title">${section.label}</div>
      <div class="section-desc">${formatDesc(data.desc)}</div>
    `
    sectionEl.appendChild(textBlock)

    // Layout-specific content
    if (data.layout === 'playground') {
      buildPlayground(sectionEl)

    } else if (data.layout === 'single' && data.images) {
      const imgBlock = document.createElement('div')
      imgBlock.className = 'section-image'
      imgBlock.innerHTML = `<img src="${data.images[0]}" alt="${section.label}" />`
      sectionEl.appendChild(imgBlock)

    } else if (data.layout === 'stacked' && data.images) {
      const stack = document.createElement('div')
      stack.className = 'section-images-stack'
      for (const src of data.images) {
        stack.innerHTML += `<img src="${src}" alt="${section.label}" />`
      }
      sectionEl.appendChild(stack)

    } else if (data.layout === 'cards' && data.cards) {
      const row = document.createElement('div')
      row.className = 'section-cards-row'
      for (const card of data.cards) {
        const cardEl = document.createElement('div')
        cardEl.className = 'section-card'
        cardEl.innerHTML = `
          <img src="${card.image}" alt="${card.label || ''}" />
          ${card.label ? `<span class="section-card-label">${card.label}</span>` : ''}
        `
        row.appendChild(cardEl)
      }
      sectionEl.appendChild(row)

    } else if (data.layout === 'icon-feature') {
      const card = document.createElement('a')
      card.className = 'icon-feature-card'
      card.href = data.url
      card.target = '_blank'
      card.rel = 'noopener noreferrer'
      card.innerHTML = `
        <div class="icon-feature-top">
          <img src="/images/iconography/central.webp" alt="Central Icon System – weight variations" class="icon-feature-img" />
        </div>
        <div class="icon-feature-bar">
          <span class="icon-feature-name">Central Icon System</span>
          <span class="icon-feature-provider">by Iconists</span>
          <span class="icon-feature-link">${data.linkLabel}</span>
        </div>
      `
      sectionEl.appendChild(card)

    } else if (data.layout === 'resources' && data.resources) {
      const resWrap = document.createElement('div')
      resWrap.className = 'section-resources'
      const grid = document.createElement('div')
      grid.className = 'resources-grid'
      for (const res of data.resources) {
        const card = document.createElement('a')
        card.className = 'resource-card'
        card.href = res.file
        card.download = ''
        card.innerHTML = `
          <div class="resource-card-info">
            <span class="resource-card-name">${res.name}</span>
            <span class="resource-card-format">${res.format}</span>
          </div>
          <div class="resource-card-icon">${DOWNLOAD_SVG}</div>
        `
        grid.appendChild(card)
      }
      resWrap.appendChild(grid)
      sectionEl.appendChild(resWrap)

    } else if (data.layout === 'color-blocks' && data.colors) {
      const row = document.createElement('div')
      row.className = 'color-blocks-row'
      for (const color of data.colors) {
        const block = document.createElement('div')
        block.className = 'color-block'
        const swatch = document.createElement('div')
        swatch.className = 'color-block-swatch'
        swatch.style.backgroundColor = color.hex
        if (getRelativeLuminance(color.hex) > 0.85) {
          swatch.classList.add('color-block-swatch--light')
        }
        initCopyLabel(swatch, color.hex)
        block.appendChild(swatch)
        const info = document.createElement('div')
        info.className = 'color-block-info'
        const nameEl = document.createElement('span')
        nameEl.className = 'color-block-name'
        nameEl.textContent = color.name
        info.appendChild(nameEl)
        const hexEl = document.createElement('span')
        hexEl.className = 'color-block-hex'
        hexEl.textContent = color.hex
        info.appendChild(hexEl)
        block.appendChild(info)
        row.appendChild(block)
      }
      sectionEl.appendChild(row)

    } else if (data.layout === 'color-shades' && data.columns) {
      const row = document.createElement('div')
      row.className = 'color-shades-row'
      for (const col of data.columns) {
        const colEl = document.createElement('div')
        colEl.className = 'color-shade-col'
        const header = document.createElement('div')
        header.className = 'color-shade-header'
        header.textContent = col.name
        colEl.appendChild(header)
        const list = document.createElement('div')
        list.className = 'color-shade-list'
        for (const shade of col.shades) {
          const item = document.createElement('div')
          item.className = 'color-shade-item'
          item.style.backgroundColor = shade.hex
          const lum = getRelativeLuminance(shade.hex)
          if (lum < 0.4) item.classList.add('color-shade-item--dark')
          if (lum > 0.9) item.classList.add('color-shade-item--light')
          const step = document.createElement('span')
          step.className = 'color-shade-step'
          step.textContent = shade.step
          item.appendChild(step)
          const hexEl = document.createElement('span')
          hexEl.className = 'color-shade-hex'
          hexEl.textContent = shade.hex
          item.appendChild(hexEl)
          initCopyLabel(item, shade.hex)
          list.appendChild(item)
        }
        colEl.appendChild(list)
        row.appendChild(colEl)
      }
      sectionEl.appendChild(row)

    } else if (data.layout === 'color-transparency' && data.columns) {
      const wrap = document.createElement('div')
      wrap.className = 'color-trans-wrap'
      const row = document.createElement('div')
      row.className = 'color-trans-row'
      for (const col of data.columns) {
        const colEl = document.createElement('div')
        colEl.className = 'color-trans-col'
        if (col.lightBg) colEl.classList.add('color-trans-col--light')
        const header = document.createElement('div')
        header.className = 'color-trans-header'
        header.textContent = col.name
        colEl.appendChild(header)
        const list = document.createElement('div')
        list.className = 'color-trans-list'
        const r = parseInt(col.base.slice(1, 3), 16)
        const g = parseInt(col.base.slice(3, 5), 16)
        const b = parseInt(col.base.slice(5, 7), 16)
        for (const level of col.levels) {
          const alpha = parseInt(level) / 100
          const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`
          const item = document.createElement('div')
          item.className = 'color-trans-item'
          const swatch = document.createElement('div')
          swatch.className = 'color-trans-swatch'
          swatch.style.backgroundColor = rgba
          item.appendChild(swatch)
          const pctEl = document.createElement('span')
          pctEl.className = 'color-trans-pct'
          pctEl.textContent = level + '%'
          item.appendChild(pctEl)
          const alphaEl = document.createElement('span')
          alphaEl.className = 'color-trans-alpha'
          alphaEl.textContent = alpha.toFixed(2)
          item.appendChild(alphaEl)
          item.addEventListener('click', () => copyColor(rgba, alphaEl))
          list.appendChild(item)
        }
        colEl.appendChild(list)
        row.appendChild(colEl)
      }
      wrap.appendChild(row)
      sectionEl.appendChild(wrap)

    } else if (data.layout === 'type-overview' && data.families) {
      const grid = document.createElement('div')
      grid.className = 'type-overview-grid'

      // Cursor-following hover tag
      let tag = document.getElementById('type-hover-tag')
      if (!tag) {
        tag = document.createElement('div')
        tag.id = 'type-hover-tag'
        document.body.appendChild(tag)
      }
      let tagX = 0, tagY = 0, tagTargetX = 0, tagTargetY = 0
      let tagVisible = false, tagRaf = null, tagTimeouts = []

      function updateTagPos() {
        tagX += (tagTargetX - tagX) * 0.15
        tagY += (tagTargetY - tagY) * 0.15
        tag.style.transform = `translate(${tagX}px, ${tagY}px)`
        if (tagVisible) tagRaf = requestAnimationFrame(updateTagPos)
      }

      function showTag(text, x, y) {
        tagTargetX = x + 14; tagTargetY = y - 13
        if (!tagVisible) { tagX = tagTargetX; tagY = tagTargetY }
        tagVisible = true
        tagTimeouts.forEach(clearTimeout); tagTimeouts = []
        tag.innerHTML = ''
        const spans = []
        for (const ch of text) {
          const s = document.createElement('span')
          s.textContent = ch
          tag.appendChild(s)
          spans.push(s)
        }
        tag.style.transition = 'none'
        tag.style.width = '2px'
        tag.style.opacity = '1'
        tag.style.transform = `translate(${tagX}px, ${tagY}px)`
        tag.offsetHeight
        tag.style.width = 'auto'
        const fullW = tag.offsetWidth
        tag.style.width = '2px'
        tag.offsetHeight
        tag.style.transition = 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        tag.style.width = fullW + 'px'
        let cum = 100, gap = 55
        spans.forEach((s) => {
          tagTimeouts.push(setTimeout(() => { s.style.opacity = '1'; s.style.transform = 'translateY(0)' }, cum))
          cum += gap; gap = Math.max(18, gap - 6)
        })
        if (tagRaf) cancelAnimationFrame(tagRaf)
        tagRaf = requestAnimationFrame(updateTagPos)
      }

      function hideTag() {
        tagVisible = false
        tagTimeouts.forEach(clearTimeout); tagTimeouts = []
        tag.style.transition = 'opacity 0.15s ease-out, width 0.25s ease-in'
        tag.style.opacity = '0'
        tag.style.width = '2px'
      }

      for (const fam of data.families) {
        const link = document.createElement('a')
        link.className = 'type-overview-card'
        link.href = fam.url
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.innerHTML = `
          <div class="type-overview-sample" style="font-family: '${fam.font}', serif; font-weight: ${fam.weight || 400};">${fam.sample}</div>
          <div class="type-overview-bar">
            <span class="type-overview-label">${fam.label}</span>
            <span class="type-overview-role">${fam.role}</span>
          </div>
        `
        const tagText = 'View on ' + (fam.url.includes('adobe') ? 'Adobe Fonts ↗' : 'Google Fonts ↗')
        link.addEventListener('mouseenter', (e) => showTag(tagText, e.clientX, e.clientY))
        link.addEventListener('mousemove', (e) => { tagTargetX = e.clientX + 14; tagTargetY = e.clientY - 13 })
        link.addEventListener('mouseleave', hideTag)
        grid.appendChild(link)
      }
      sectionEl.appendChild(grid)

    } else if (data.layout === 'type-specimen') {
      const block = document.createElement('div')
      block.className = 'type-specimen'
      for (const w of data.weights) {
        const row = document.createElement('div')
        row.className = 'type-specimen-row'
        row.innerHTML = `
          <span class="type-specimen-row-name" style="font-family: '${data.font}', serif; font-weight: ${w.value};">${data.label}</span>
          <span class="type-specimen-row-weight" style="font-family: '${data.font}', serif; font-weight: ${w.value};">${w.name}</span>
        `
        block.appendChild(row)
      }
      sectionEl.appendChild(block)

    } else if (data.layout === 'type-scale' && data.groups) {
      const wrap = document.createElement('div')
      wrap.className = 'type-scale-wrap'
      for (const group of data.groups) {
        const groupEl = document.createElement('div')
        groupEl.className = 'type-scale-group'
        const header = document.createElement('div')
        header.className = 'type-scale-group-header'
        header.textContent = group.name
        groupEl.appendChild(header)
        for (const item of group.sizes) {
          const row = document.createElement('div')
          row.className = 'type-scale-row'
          row.innerHTML = `
            <div class="type-scale-meta">
              <span class="type-scale-label">${item.label}</span>
              <span class="type-scale-info">${item.size}px / ${item.lineHeight}</span>
            </div>
            <div class="type-scale-sample" style="font-family: '${group.font}', serif; font-size: ${item.size}px; font-weight: ${item.weight}; line-height: ${item.lineHeight};">${item.label}</div>
          `
          groupEl.appendChild(row)
        }
        wrap.appendChild(groupEl)
      }
      sectionEl.appendChild(wrap)

    } else if (data.layout === 'type-usage' && data.blocks) {
      const wrap = document.createElement('div')
      wrap.className = 'type-usage-wrap'
      for (const block of data.blocks) {
        const el = document.createElement('div')
        el.className = 'type-usage-block'

        const tf = block.transform === 'uppercase' ? 'text-transform: uppercase;' : ''

        el.innerHTML = `
          <div class="type-usage-meta">
            <div class="type-usage-meta-left">
              <span class="type-usage-role">${block.role}</span>
              <span class="type-usage-font">${block.fontLabel}</span>
            </div>
            <div class="type-usage-meta-specs">
              <div class="type-usage-spec"><span class="type-usage-spec-label">Leading:</span><span class="type-usage-spec-value">${block.leading}</span></div>
              <div class="type-usage-spec"><span class="type-usage-spec-label">Tracking:</span><span class="type-usage-spec-value">${block.tracking}</span></div>
            </div>
          </div>
          <div class="type-usage-sample" style="font-family: '${block.font}', serif; font-size: ${block.sampleSize}px; font-weight: ${block.weight}; line-height: ${block.sampleLineHeight}; letter-spacing: ${block.sampleLetterSpacing}px; ${tf}">${block.sample}</div>
        `
        wrap.appendChild(el)
      }
      sectionEl.appendChild(wrap)
    }

    contentInner.appendChild(sectionEl)
  }

  // ── Footer ──
  const footer = document.createElement('div')
  footer.className = 'content-footer'
  footer.innerHTML = `
    <div class="content-footer-col">
      Across Protocol — Visual Identity Guidelines. All assets and usage rights are governed by the Across brand policy.
    </div>
    <div class="content-footer-col">
      For questions or asset requests, contact the design team at design@across.to
    </div>
    <div class="content-footer-col">
      &copy; ${new Date().getFullYear()} Across Protocol. All rights reserved.
    </div>
  `
  contentInner.appendChild(footer)

  // Scroll to top
  guideContent.scrollTop = 0

  // Setup scroll tracking after DOM settles
  requestAnimationFrame(() => {
    setupScrollTracking(pageId)
  })
}

// ── Scroll to section ────────────────────────────────────
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── Scroll tracking (IntersectionObserver) ───────────────
function setupScrollTracking(pageId) {
  const sections = contentInner.querySelectorAll('.content-section')
  if (sections.length === 0) return

  const sectionsContainer = sideNav.querySelector(`.page-sections[data-page-id="${pageId}"]`)
  if (!sectionsContainer) return

  const dot = sectionsContainer.querySelector('.section-dot')
  if (!dot) return

  const setActive = (sectionId) => {
    if (activeSectionId === sectionId) return
    activeSectionId = sectionId

    // Update nav links
    const links = sectionsContainer.querySelectorAll('.section-link')
    links.forEach((link) => {
      link.classList.toggle('active', link.dataset.sectionId === sectionId)
    })

    // Position dot
    const activeLink = sectionsContainer.querySelector(`.section-link[data-section-id="${sectionId}"]`)
    if (activeLink) {
      const top = activeLink.offsetTop + activeLink.offsetHeight / 2 - 2
      dot.style.top = top + 'px'
      dot.classList.add('visible')
    } else {
      dot.classList.remove('visible')
    }
  }

  // Activate first section by default
  if (sections[0]) {
    setActive(sections[0].id)
  }

  // Scroll-based tracking: switch when a section's top crosses the 50% line
  let ticking = false
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      const midpoint = guideContent.clientHeight * 0.5
      const containerTop = guideContent.getBoundingClientRect().top
      let active = sections[0]

      for (const section of sections) {
        const relativeTop = section.getBoundingClientRect().top - containerTop
        if (relativeTop <= midpoint) {
          active = section
        }
      }

      if (active) setActive(active.id)
    })
  }

  guideContent.addEventListener('scroll', onScroll)
  scrollObserver = { disconnect: () => guideContent.removeEventListener('scroll', onScroll) }
}

// ── Mobile menu toggle ───────────────────────────────────
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
  document.body.classList.toggle('mobile-nav-open')
})
document.getElementById('mobile-overlay').addEventListener('click', closeMobileNav)

// ── Init ─────────────────────────────────────────────────
buildNav()
navigateFromHash()

// Fade in after browser paints the hidden state
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.getElementById('page-transition').classList.add('done')
    document.getElementById('side-nav').classList.add('visible')
    document.getElementById('guide-content').classList.add('visible')
  })
})
