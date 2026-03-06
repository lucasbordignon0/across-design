import './guide.css'
import '@fontsource/geist-mono/300.css'
import '@fontsource/geist-mono/400.css'
import '@fontsource/geist-mono/500.css'

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
      { id: 'colors', label: 'Colors', sections: [] },
      { id: 'typography', label: 'Typography', sections: [] },
      { id: 'motion', label: 'Motion', sections: [] },
      { id: 'iconography', label: 'Iconography', sections: [] },
      { id: 'photography', label: 'Photography', sections: [] },
      { id: 'illustration', label: 'Illustration', sections: [] },
    ],
  },
  {
    id: 'language',
    label: 'Language',
    pages: [],
  },
  {
    id: 'resources',
    label: 'Resources',
    pages: [],
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
}

// ── Helpers ──────────────────────────────────────────────
function formatDesc(text) {
  return text
    .split('\n\n')
    .map((p) => `<p>${p}</p>`)
    .join('')
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
let openCategoryId = 'foundations'
let activePageId = 'logo'
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

        const chevron = document.createElement('span')
        chevron.className = 'page-chevron'
        chevron.innerHTML = CHEVRON_SVG

        pageHeader.appendChild(pageName)
        pageHeader.appendChild(chevron)
        pageHeader.addEventListener('click', () => selectPage(cat.id, page.id))
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
}

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
function selectPage(categoryId, pageId) {
  if (activePageId === pageId && openCategoryId === categoryId) return

  // Deactivate previous page item
  const prevPageItem = sideNav.querySelector(`.page-item.active`)
  if (prevPageItem) prevPageItem.classList.remove('active')

  // Activate new page item
  activePageId = pageId
  const newPageItem = sideNav.querySelector(`.page-item[data-page="${pageId}"]`)
  if (newPageItem) newPageItem.classList.add('active')

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

  scrollObserver = new IntersectionObserver(
    (entries) => {
      // Find the topmost intersecting section
      let topEntry = null
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!topEntry || entry.boundingClientRect.top < topEntry.boundingClientRect.top) {
            topEntry = entry
          }
        }
      }
      if (topEntry) {
        setActive(topEntry.target.id)
      }
    },
    {
      root: guideContent,
      rootMargin: '0px 0px -65% 0px',
      threshold: 0,
    }
  )

  sections.forEach((section) => scrollObserver.observe(section))
}

// ── Init ─────────────────────────────────────────────────
buildNav()
renderContent('foundations', 'logo')

// Fade in after browser paints the hidden state
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.getElementById('page-transition').classList.add('done')
    document.getElementById('side-nav').classList.add('visible')
    document.getElementById('guide-content').classList.add('visible')
  })
})
