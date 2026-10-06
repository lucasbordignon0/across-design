import './guide.css'
import { BRAND_REVISION, NAV_DATA, PAGE_CONTENT } from './content.js'

// ── Chevron SVG ──────────────────────────────────────────
const CHEVRON_SVG = `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

// ── Download icon SVG ────────────────────────────────────
const DOWNLOAD_SVG = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 2v8.5M4.5 7L8 10.5 11.5 7M3 13.5h10" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

// ── Logo Playground config ───────────────────────────────
const PLAYGROUND_PRESETS = [
  { hex: '#6CF9D8', label: 'Aqua' },
  { hex: '#151518', label: 'Near Black' },
  { hex: '#E0F3FF', label: 'Bright Gray' },
]

const PLAYGROUND_CONFIG = {
  wordmark: { name: 'primary-logo', ratio: 764.858276 / 199.998352, minW: 100, maxW: 800, defaultW: 320 },
  secondary: { name: 'secondary-logo', ratio: 764.86 / 200, minW: 180, maxW: 800, defaultW: 320 },
  symbol: { name: 'primary-symbol', ratio: 1, minW: 32, maxW: 400, defaultW: 120 },
  'secondary-symbol': { name: 'secondary-symbol', ratio: 1, minW: 80, maxW: 400, defaultW: 120 },
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
  }).catch(() => { feedbackEl.textContent = 'Copy unavailable' })
}

// ── Poster-style hover copy label ────────────────────────
function initCopyLabel(el, value) {
  el.tabIndex = 0
  el.setAttribute('role', 'button')
  el.setAttribute('aria-label', `Copy ${value}`)
  const label = document.createElement('div')
  label.className = 'cb-label'
  el.appendChild(label)

  let timeouts = []
  let isVisible = false
  let copied = false

  function showText(text) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      label.innerHTML = `<span style="opacity:1;transform:none">${text}</span>`
      label.style.width = 'auto'
      label.style.opacity = '1'
      return
    }
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

  el.addEventListener('focus', () => {
    label.style.left = '12px'; label.style.top = '12px'; showText('COPY')
  })
  el.addEventListener('blur', hideLabel)
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click() }
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
    }).catch(() => showText('COPY UNAVAILABLE'))
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
  let currentBg = '#151518'
  let currentVariation = 'wordmark'
  let currentWidth = PLAYGROUND_CONFIG.wordmark.defaultW
  const imageCache = new Map()
  let variationRequest = 0

  // Picker HSV state
  let pickerH = 0
  let pickerS = 0
  let pickerV = 0

  // Load approved variants intact, including the symbol's transparent cutouts.
  function loadLogo(key, color) {
    const url = `/logos/${PLAYGROUND_CONFIG[key].name}-${color}.svg`
    if (!imageCache.has(url)) {
      imageCache.set(url, new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => { imageCache.delete(url); reject(new Error('Logo could not load')) }
        img.src = url
        img.alt = key.includes('symbol') ? 'Across symbol' : 'Across logo'
      }))
    }
    return imageCache.get(url)
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
    const w = Math.max(config.minW, Math.min(config.maxW, Math.max(config.minW, canvas.clientWidth - 48), currentWidth))

    canvas.style.backgroundColor = currentBg
    const request = ++variationRequest
    loadLogo(currentVariation, color.name).then(img => {
      if (request === variationRequest) logoContainer.replaceChildren(img.cloneNode())
    }).catch(() => {
      if (request === variationRequest) logoContainer.textContent = 'Logo unavailable. Please reload.'
    })
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
    toggleEls.forEach(t => { const active = t.dataset.variation === currentVariation; t.classList.toggle('active', active); t.setAttribute('aria-pressed', active) })

    // Picker visuals
    const hueColor = hsvToHex(pickerH, 1, 1)
    pickerAreaEl.style.backgroundColor = hueColor
    pickerCursorEl.style.left = (pickerS * 100) + '%'
    pickerCursorEl.style.top = ((1 - pickerV) * 100) + '%'
    hueCursorEl.style.left = (pickerH / 360 * 100) + '%'
  }

  function switchVariation(key) {
    currentVariation = key
    currentWidth = PLAYGROUND_CONFIG[key].defaultW
    update()
  }

  // ── Background row ──
  const bgRow = document.createElement('div')
  bgRow.className = 'playground-row'
  bgRow.innerHTML = '<span class="playground-label">Background</span>'

  const swatches = document.createElement('div')
  swatches.className = 'playground-swatches'
  for (const preset of PLAYGROUND_PRESETS) {
    const s = document.createElement('button')
    s.type = 'button'
    s.setAttribute('aria-label', preset.label + ' background')
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
  hexInput.setAttribute('aria-label', 'Background hex color')
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
  sizeSlider.setAttribute('aria-label', 'Logo width in pixels')
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
  for (const [key, label] of [['wordmark', 'Primary'], ['secondary', 'Secondary'], ['symbol', 'Symbol'], ['secondary-symbol', 'Ring Symbol']]) {
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
  const resize = new ResizeObserver(() => update())
  resize.observe(canvas)
  sectionEl._cleanup = () => { resize.disconnect(); variationRequest++ }
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
  logoSection.innerHTML = `<a href="/#logo" aria-label="Across design system"><img src="/logos/primary-logo-white.svg" alt="Across Design" /></a>`
  sideNav.appendChild(logoSection)

  // Info
  const infoSection = document.createElement('div')
  infoSection.className = 'sn-section sn-info'
  infoSection.innerHTML = `
    <span>across® protocol</span>
    <span>visual identity guidelines</span>
    <span class="muted">brand revision: ${BRAND_REVISION}</span>
  `
  sideNav.appendChild(infoSection)

  // Categories
  for (const cat of NAV_DATA) {
    const catEl = document.createElement('div')
    catEl.className = 'sn-category'
    catEl.dataset.category = cat.id
    if (cat.id === openCategoryId) catEl.classList.add('open')

    // Header
    const header = document.createElement('button')
    header.type = 'button'
    header.setAttribute('aria-expanded', cat.id === openCategoryId)
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
        const pageHeader = document.createElement('button')
        pageHeader.type = 'button'
        pageHeader.setAttribute('aria-expanded', page.id === activePageId)
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
              updateHash(section.id)
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

// Resolve page and section hashes, including links copied from the previous guide.
function navigateFromHash() {
  const aliases = { 'type-barlow': 'type-supreme', 'type-geist-mono': 'type-supreme', 'type-exploration': 'type-overview', experimentations: 'application' }
  const hash = location.hash.slice(1)
  const id = aliases[hash] || hash || 'logo'
  for (const cat of NAV_DATA) {
    const page = cat.pages.find(p => p.id === id || p.sections.some(s => s.id === id))
    if (!page) continue
    openCategoryId = cat.id
    selectPage(cat.id, page.id, false)
    syncNav()
    if (page.id !== id) requestAnimationFrame(() => scrollToSection(id, false))
    else guideContent.scrollTop = 0
    return
  }
  openCategoryId = NAV_DATA[0].id
  selectPage(openCategoryId, 'logo', false)
  syncNav()
}

function syncNav() {
  sideNav.querySelectorAll('.sn-category').forEach(n => {
    const active = n.dataset.category === openCategoryId
    n.classList.toggle('open', active)
    n.querySelector('.category-header').setAttribute('aria-expanded', active)
    n.querySelector('.category-body').inert = !active
  })
  sideNav.querySelectorAll('.page-item').forEach(n => {
    const active = n.dataset.page === activePageId
    n.classList.toggle('active', active)
    n.querySelector('.page-header').setAttribute('aria-expanded', active)
    const body = n.querySelector('.page-body')
    if (body) body.inert = !active
  })
}

window.addEventListener('popstate', navigateFromHash)
window.addEventListener('hashchange', navigateFromHash)

// ── Toggle category accordion ────────────────────────────
function toggleCategory(categoryId) {
  if (openCategoryId === categoryId) return // already open
  const keepMobileMenuOpen = document.body.classList.contains('mobile-nav-open')

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
  if (keepMobileMenuOpen) {
    document.body.classList.add('mobile-nav-open')
    document.getElementById('mobile-menu-btn').setAttribute('aria-expanded', 'true')
    syncMobileNav()
  }
}

// ── Select a page ────────────────────────────────────────
function closeMobileNav() {
  document.body.classList.remove('mobile-nav-open')
  document.getElementById('mobile-menu-btn').setAttribute('aria-expanded', 'false')
  syncMobileNav()
}

function syncMobileNav() {
  const mobile = matchMedia('(max-width: 768px)').matches
  const open = document.body.classList.contains('mobile-nav-open')
  sideNav.inert = mobile && !open
  guideContent.inert = mobile && open
}

function selectPage(categoryId, pageId, push = true) {
  closeMobileNav()
  if (activePageId === pageId && openCategoryId === categoryId) {
    if (push) { updateHash(pageId); guideContent.scrollTop = 0 }
    return
  }

  // Deactivate previous page item
  const prevPageItem = sideNav.querySelector(`.page-item.active`)
  if (prevPageItem) prevPageItem.classList.remove('active')

  // Activate new page item
  activePageId = pageId
  const newPageItem = sideNav.querySelector(`.page-item[data-page="${pageId}"]`)
  if (newPageItem) newPageItem.classList.add('active')

  // Update URL hash (push so back button works between pages)
  if (push) updateHash(pageId)
  syncNav()

  // Render content
  renderContent(categoryId, pageId)
}

// ── Render page content ──────────────────────────────────
function renderContent(categoryId, pageId) {
  contentInner.querySelectorAll('.content-section').forEach(n => n._cleanup?.())
  document.getElementById('type-hover-tag')?.remove()

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
  const header = document.createElement('header')
  header.className = 'content-header'
  header.innerHTML = `
    <div class="content-header-text">
      <span class="content-header-category">${cat.label}</span>
      <h1 class="content-header-title">${page.label}</h1>
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
      <h2 class="section-title">${section.label}</h2>
      <div class="section-desc">${formatDesc(data.desc)}</div>
    `
    sectionEl.appendChild(textBlock)

    // Layout-specific content
    if (data.layout === 'playground') {
      buildPlayground(sectionEl)

    } else if (data.layout === 'logo-showcase') {
      const row = document.createElement('div')
      row.className = 'logo-showcase' + (data.compact ? ' logo-showcase--compact' : '') + (data.decorative ? ' logo-showcase--decorative' : '')
      data.logos.forEach(src => {
        const figure = document.createElement('figure')
        figure.innerHTML = `<img src="${src}" alt="${section.label}" loading="lazy" />`
        row.appendChild(figure)
      })
      sectionEl.appendChild(row)

    } else if (data.layout === 'gradients') {
      const grid = document.createElement('div')
      grid.className = 'gradient-grid'
      data.palettes.forEach(p => {
        const figure = document.createElement('figure')
        figure.className = 'gradient-card'
        const stops = p.stops.map(([hex,stop]) => `${hex} ${stop}%`).join(', ')
        figure.innerHTML = `<div class="gradient-strip" style="background:linear-gradient(90deg,${stops})"></div><figcaption><strong>${p.name}</strong><span>${p.role}</span></figcaption><p>${p.stops.map(([hex,stop])=>`${hex} ${stop}%`).join(' · ')}</p>`
        grid.appendChild(figure)
      })
      sectionEl.appendChild(grid)

    } else if (data.layout === 'modes') {
      const grid = document.createElement('div')
      grid.className = 'mode-grid'
      Object.entries(data.modes).forEach(([name,t]) => {
        const figure = document.createElement('figure')
        figure.className = 'mode-card'
        figure.style.cssText = `background:${t.page};color:${t.text}`
        figure.innerHTML = `<figcaption>${name === 'dark' ? 'Dark' : 'Light'}</figcaption><div class="mode-example" style="background:${t.surface}"><span style="color:${t.secondary}">From</span><strong>1,250.00 USDC</strong><span style="color:${t.secondary}">Base → Arbitrum</span><span style="color:${t.accentText}">Fast & Secure</span><div class="mode-action" style="background:${t.accent};color:${t.onAccent}">Confirm transaction</div></div><dl>${Object.entries(t).map(([key,value])=>`<div><dt>${key}</dt><dd>${value}</dd></div>`).join('')}</dl>`
        grid.appendChild(figure)
      })
      sectionEl.appendChild(grid)

    } else if (data.layout === 'font-links') {
      const grid = document.createElement('div')
      grid.className = 'font-links'
      data.links.forEach(link => {
        const a = document.createElement('a')
        a.href = link.url; a.target = '_blank'; a.rel = 'noopener noreferrer'
        a.innerHTML = `<strong>${link.name}</strong><span>${link.label}</span>`
        grid.appendChild(a)
      })
      sectionEl.appendChild(grid)

    } else if (data.layout === 'single' && data.images) {
      const imgBlock = document.createElement('div')
      imgBlock.className = 'section-image'
      imgBlock.innerHTML = `<img src="${data.images[0]}" alt="${section.label}" loading="lazy" />`
      sectionEl.appendChild(imgBlock)

    } else if (data.layout === 'stacked' && data.images) {
      const stack = document.createElement('div')
      stack.className = 'section-images-stack'
      for (const src of data.images) {
        stack.innerHTML += `<img src="${src}" alt="${section.label}" loading="lazy" />`
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
          item.tabIndex = 0
          item.setAttribute('role', 'button')
          item.setAttribute('aria-label', `Copy ${col.name} at ${level}% opacity`)
          item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click() }
          })
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
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
          <div class="type-overview-sample" style="font-family: '${fam.font}', ${fam.font === 'Supreme' ? 'sans-serif' : 'serif'}; font-weight: ${fam.weight || 400};">${fam.sample}</div>
          <div class="type-overview-bar">
            <span class="type-overview-label">${fam.label}</span>
            <span class="type-overview-role">${fam.role}</span>
          </div>
        `
        const tagText = 'View on ' + (fam.url.includes('adobe') ? 'Adobe Fonts ↗' : 'Fontshare ↗')
        link.addEventListener('mouseenter', (e) => showTag(tagText, e.clientX, e.clientY))
        link.addEventListener('mousemove', (e) => { tagTargetX = e.clientX + 14; tagTargetY = e.clientY - 13 })
        link.addEventListener('mouseleave', hideTag)
        grid.appendChild(link)
      }
      sectionEl._cleanup = () => { tagVisible = false; cancelAnimationFrame(tagRaf); tagTimeouts.forEach(clearTimeout); tag.remove() }
      sectionEl.appendChild(grid)

    } else if (data.layout === 'type-specimen') {
      const block = document.createElement('div')
      block.className = 'type-specimen'
      for (const w of data.weights) {
        const row = document.createElement('div')
        row.className = 'type-specimen-row'
        row.innerHTML = `
          <span class="type-specimen-row-name" style="font-family: '${data.font}', ${data.font === 'Supreme' ? 'sans-serif' : 'serif'}; font-weight: ${w.value};">${data.label}</span>
          <span class="type-specimen-row-weight" style="font-family: '${data.font}', ${data.font === 'Supreme' ? 'sans-serif' : 'serif'}; font-weight: ${w.value};">${w.name}</span>
        `
        block.appendChild(row)
      }
      sectionEl.appendChild(block)
      if (data.examples) {
        const examples = document.createElement('div')
        examples.className = 'ivy-examples'
        examples.innerHTML = data.examples.map(e => `<figure><img src="${e.image}" alt="${e.label} specimen" loading="lazy" /><figcaption>${e.label}</figcaption></figure>`).join('')
        sectionEl.appendChild(examples)
      }

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
            <div class="type-scale-sample" style="font-family: '${group.font}', ${group.font === 'Supreme' ? 'sans-serif' : 'serif'}; font-size: ${item.size}px; font-weight: ${item.weight}; line-height: ${item.lineHeight};">${item.label}</div>
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
          <div class="type-usage-sample" style="font-family: '${block.font}', ${block.font === 'Supreme' ? 'sans-serif' : 'serif'}; font-size: ${block.sampleSize}px; font-weight: ${block.weight}; line-height: ${block.sampleLineHeight}; letter-spacing: ${block.sampleLetterSpacing}px; ${tf}">${block.sample}</div>
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
function scrollToSection(sectionId, smooth = true) {
  const el = document.getElementById(sectionId)
  if (!el) return
  el.scrollIntoView({ behavior: smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant', block: 'start' })
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
  const open = document.body.classList.toggle('mobile-nav-open')
  document.getElementById('mobile-menu-btn').setAttribute('aria-expanded', open)
  syncMobileNav()
})
document.getElementById('mobile-overlay').addEventListener('click', closeMobileNav)

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav() })
window.addEventListener('resize', syncMobileNav)

// ── Init ─────────────────────────────────────────────────
buildNav()
navigateFromHash()
syncMobileNav()

// Fade in after browser paints the hidden state
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.getElementById('page-transition').classList.add('done')
    document.getElementById('side-nav').classList.add('visible')
    document.getElementById('guide-content').classList.add('visible')
  })
})
