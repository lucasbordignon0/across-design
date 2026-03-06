import './style.css'
import '@fontsource/geist-mono/500.css'
import * as THREE from 'three'

// ── Config ──────────────────────────────────────────────
const POSTER_COUNT = 80
const POSTER_WIDTH = 1.8
const POSTER_HEIGHT = POSTER_WIDTH * (5 / 4) // 4:5 ratio
const HELIX_RADIUS = 5
const HELIX_PITCH = 4.5          // vertical distance per full revolution
const HOVER_PUSH = 0.6           // how far poster moves outward on hover

// Intro animation config
const INTRO_DURATION = 1.8       // seconds for ribbon to slide up
const MIN_LOADER_TIME = 1.2      // minimum seconds to show loader

// Arc-length step: place posters edge-to-edge along the helix (no gap)
const helixArcPerRad = Math.sqrt(
  HELIX_RADIUS * HELIX_RADIUS +
  (HELIX_PITCH / (2 * Math.PI)) * (HELIX_PITCH / (2 * Math.PI))
)
const ANGLE_STEP = POSTER_WIDTH / helixArcPerRad

// ── Poster images ─────────────────────────────────────────
const POSTER_SRCS = [
  'acx_fin', 'acx_seal', 'acx_stamp', 'all_sizes', 'bateman_hl',
  'big_trades', 'cow_acx', 'eth_denver', 'fill_up', 'future_stables',
  'get_there_1', 'get_there_2', 'get_there_3', 'get_there_4',
  'hl_no_fees_1', 'hl_no_fess_2', 'hypercore', 'lighter_acx',
  'megaeth_acx', 'metamask_1', 'metamask_2', 'no_stops',
  'one_equals_one', 'pancake_acx', 'push_the_tempo', 'size_matters',
  'uniswap_acx', 'usdt_usdc_free', 'year_horse', 'yo_acx',
].map(name => `/posters/${name}.png`)

// Seeded shuffle for deterministic random order
function shuffle(arr, seed = 42) {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const shuffledPosters = shuffle(POSTER_SRCS)

// ── Loading Manager ───────────────────────────────────────
const loaderEl = document.getElementById('loader')
const loaderPct = loaderEl.querySelector('.loader-pct')
const navEl = document.getElementById('nav')
const heroEl = document.getElementById('hero')
const footerEl = document.getElementById('footer')

let loadingComplete = false
let loaderStartTime = performance.now()
let realProgress = 0        // actual loading progress (0-100)
let displayedProgress = 0   // smoothly animated display value

const loadingManager = new THREE.LoadingManager()

loadingManager.onProgress = (_url, loaded, total) => {
  realProgress = Math.round((loaded / total) * 100)
}

loadingManager.onLoad = () => {
  realProgress = 100
  loadingComplete = true
}

const textureLoader = new THREE.TextureLoader(loadingManager)

// Pre-load & cache all 30 textures
const textureCache = new Map()
for (const src of POSTER_SRCS) {
  const tex = textureLoader.load(src)
  tex.colorSpace = THREE.SRGBColorSpace
  textureCache.set(src, tex)
}

// ── Renderer ────────────────────────────────────────────
const canvas = document.getElementById('spiral')
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.LinearToneMapping
renderer.toneMappingExposure = 1.8

// ── Scene ───────────────────────────────────────────────
const scene = new THREE.Scene()
scene.background = new THREE.Color('#6CF9D8')
scene.fog = new THREE.Fog('#6CF9D8', 22, 50)

// ── Camera (front-facing, looking straight at the spiral) ──
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.set(0, 0, 14)
camera.lookAt(0, 0, 0)

// ── Lights ──────────────────────────────────────────────
// High ambient so posters stay bright and true to their art
const ambient = new THREE.AmbientLight('#ffffff', 1.2)
scene.add(ambient)

// Front light from camera direction — adds depth to front-facing posters
const frontLight = new THREE.DirectionalLight('#ffffff', 1.5)
frontLight.position.set(0, 2, 14)
scene.add(frontLight)

const dirLight = new THREE.DirectionalLight('#ffffff', 0.6)
dirLight.position.set(5, 10, 7)
scene.add(dirLight)

// Back light so rear posters have some definition
const backLight = new THREE.DirectionalLight('#ffffff', 0.4)
backLight.position.set(-5, -5, -5)
scene.add(backLight)

const fillLight = new THREE.DirectionalLight('#ffffff', 0.5)
fillLight.position.set(-8, 3, 5)
scene.add(fillLight)

// ── Helix helper ────────────────────────────────────────
function helixPoint(t) {
  const x = HELIX_RADIUS * Math.cos(t)
  const y = -(HELIX_PITCH * t) / (2 * Math.PI)
  const z = HELIX_RADIUS * Math.sin(t)
  return new THREE.Vector3(x, y, z)
}

function helixTangent(t) {
  const dx = -HELIX_RADIUS * Math.sin(t)
  const dy = -HELIX_PITCH / (2 * Math.PI)
  const dz = HELIX_RADIUS * Math.cos(t)
  return new THREE.Vector3(dx, dy, dz).normalize()
}

// ── Curved poster geometry ─────────────────────────────
const CURVE_SEG_W = 12
const CURVE_SEG_H = 4

function createCurvedPoster(tStart, tEnd, height, center) {
  const geo = new THREE.BufferGeometry()
  const verts = []
  const norms = []
  const uvs = []
  const idx = []

  for (let j = 0; j <= CURVE_SEG_H; j++) {
    const v = j / CURVE_SEG_H
    const hOff = (v - 0.5) * height

    for (let i = 0; i <= CURVE_SEG_W; i++) {
      const u = i / CURVE_SEG_W
      const t = tStart + u * (tEnd - tStart)

      const p = helixPoint(t)
      const radial = new THREE.Vector3(p.x, 0, p.z).normalize()
      const tangent = helixTangent(t)
      const binormal = new THREE.Vector3().crossVectors(tangent, radial).normalize()

      verts.push(
        p.x + binormal.x * hOff - center.x,
        p.y + binormal.y * hOff - center.y,
        p.z + binormal.z * hOff - center.z
      )
      norms.push(radial.x, radial.y, radial.z)
      uvs.push(1 - u, v)
    }
  }

  for (let j = 0; j < CURVE_SEG_H; j++) {
    for (let i = 0; i < CURVE_SEG_W; i++) {
      const a = j * (CURVE_SEG_W + 1) + i
      const b = a + 1
      const c = (j + 1) * (CURVE_SEG_W + 1) + i
      const d = c + 1
      idx.push(a, b, c, b, d, c)
    }
  }

  geo.setIndex(idx)
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  return geo
}

// ── Build helix group ───────────────────────────────────
const helix = new THREE.Group()
scene.add(helix)

const posters = []

const totalHelixHeight =
  (POSTER_COUNT * ANGLE_STEP * HELIX_PITCH) / (2 * Math.PI)

// Start helix far below for intro animation
const INTRO_START_Y = totalHelixHeight + 20
helix.position.y = INTRO_START_Y

for (let i = 0; i < POSTER_COUNT; i++) {
  const tStart = i * ANGLE_STEP
  const tEnd = (i + 1) * ANGLE_STEP
  const tMid = (tStart + tEnd) / 2

  const centerPos = helixPoint(tMid)
  const centerRadial = new THREE.Vector3(centerPos.x, 0, centerPos.z).normalize()

  const geometry = createCurvedPoster(tStart, tEnd, POSTER_HEIGHT, centerPos)

  const posterSrc = shuffledPosters[i % shuffledPosters.length]
  const texture = textureCache.get(posterSrc)

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.3,
    metalness: 0.05,
    side: THREE.DoubleSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.copy(centerPos)

  mesh.userData.basePosition = centerPos.clone()
  mesh.userData.radial = centerRadial.clone()
  mesh.userData.hoverOffset = 0
  mesh.userData.posterLabel = posterSrc.replace('/posters/', '').replace('.png', '').toUpperCase()

  helix.add(mesh)
  posters.push(mesh)
}

// ── Raycaster for hover ─────────────────────────────────
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-999, -999)
let hoveredMesh = null

const scrollTrack = document.getElementById('scroll-track')

let rawCursorX = 0, rawCursorY = 0

scrollTrack.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  rawCursorX = e.clientX
  rawCursorY = e.clientY
})

scrollTrack.addEventListener('mouseleave', () => {
  mouse.set(-999, -999)
})

// ── Poster hover label ──────────────────────────────────
const posterLabelEl = document.getElementById('poster-label')
let labelX = 0, labelY = 0
let labelTargetX = 0, labelTargetY = 0
let hoverTime = 0
let labelVisible = false
let labelTimeouts = []
const LABEL_DELAY = 0.7

function showLabel(mesh) {
  labelVisible = true

  // Snap label to cursor immediately on first show
  labelX = labelTargetX
  labelY = labelTargetY

  const text = mesh.userData.posterLabel
  posterLabelEl.innerHTML = ''

  // Create letter spans
  const spans = []
  for (const char of text) {
    const span = document.createElement('span')
    span.textContent = char
    posterLabelEl.appendChild(span)
    spans.push(span)
  }

  // Start as thin line (no transition)
  posterLabelEl.style.transition = 'none'
  posterLabelEl.style.width = '2px'
  posterLabelEl.style.opacity = '1'
  posterLabelEl.style.transform = `translate(${labelX}px, ${labelY}px)`
  posterLabelEl.offsetHeight // force reflow

  // Measure full width
  posterLabelEl.style.width = 'auto'
  const fullWidth = posterLabelEl.offsetWidth
  posterLabelEl.style.width = '2px'
  posterLabelEl.offsetHeight

  // Expand rectangle from line to full width
  posterLabelEl.style.transition = 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
  posterLabelEl.style.width = fullWidth + 'px'

  // Stagger letters with decreasing delay
  let cumDelay = 100
  let gap = 55
  const MIN_GAP = 18
  const GAP_DECAY = 6

  spans.forEach((span, i) => {
    const tid = setTimeout(() => {
      span.style.opacity = '1'
      span.style.transform = 'translateY(0)'
    }, cumDelay)
    labelTimeouts.push(tid)
    cumDelay += gap
    gap = Math.max(MIN_GAP, gap - GAP_DECAY)
  })
}

function hideLabel() {
  labelVisible = false
  // Clear pending letter timeouts
  labelTimeouts.forEach(clearTimeout)
  labelTimeouts = []
  posterLabelEl.style.transition = 'opacity 0.15s ease-out, width 0.25s ease-in'
  posterLabelEl.style.opacity = '0'
  posterLabelEl.style.width = '2px'
}

// ── Scroll state (velocity-based smoothing) ──────────────
let scrollProgress = 0
let scrollVelocity = 0
const SCROLL_FRICTION = 0.92
const SCROLL_SENSITIVITY = 0.00003

// Scroll is disabled during loading + intro
let scrollEnabled = false

scrollTrack.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    if (!scrollEnabled) return
    scrollVelocity += e.deltaY * SCROLL_SENSITIVITY
  },
  { passive: false }
)

let touchStartY = 0
let touchLastY = 0

scrollTrack.addEventListener('touchstart', (e) => {
  if (!scrollEnabled) return
  touchStartY = e.touches[0].clientY
  touchLastY = touchStartY
  scrollVelocity = 0
}, { passive: true })

scrollTrack.addEventListener(
  'touchmove',
  (e) => {
    e.preventDefault()
    if (!scrollEnabled) return
    const y = e.touches[0].clientY
    scrollVelocity += (touchLastY - y) * 0.0003
    touchLastY = y
  },
  { passive: false }
)

// ── Intro animation state ────────────────────────────────
let introActive = false
let introElapsed = 0
let loaderDismissed = false

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

function startIntro() {
  // Fade out loader
  loaderEl.classList.add('fade-out')
  loaderPct.textContent = '100%'

  // Show nav + hero
  navEl.classList.add('visible')
  heroEl.classList.add('visible')
  heroEl.style.opacity = 1

  // Start ribbon intro animation
  introActive = true
  introElapsed = 0

  // Remove loader from DOM after fade
  setTimeout(() => {
    loaderEl.remove()
  }, 700)
}

// ── Check if ready to start intro ────────────────────────
function checkReady(dt) {
  if (loaderDismissed) return

  // Smoothly animate displayed percentage toward real progress
  // Speed: covers 0→100 in ~MIN_LOADER_TIME seconds
  const speed = 100 / MIN_LOADER_TIME
  displayedProgress = Math.min(realProgress, displayedProgress + speed * dt)
  const shown = Math.round(displayedProgress)
  loaderPct.textContent = shown + '%'

  const elapsed = (performance.now() - loaderStartTime) / 1000
  if (loadingComplete && elapsed >= MIN_LOADER_TIME && displayedProgress >= 99.5) {
    loaderDismissed = true
    startIntro()
  }
}

// ── Animation loop (frame-rate independent) ─────────────
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const dt = Math.min(clock.getDelta(), 0.05) // cap to avoid jumps

  // Check if loading is done
  checkReady(dt)

  // ── Intro animation ──────────────────────────────────
  if (introActive) {
    introElapsed += dt
    const t = Math.min(introElapsed / INTRO_DURATION, 1)
    const eased = easeOutCubic(t)
    helix.position.y = INTRO_START_Y * (1 - eased) // lerp from INTRO_START_Y to 0

    if (t >= 1) {
      introActive = false
      helix.position.y = 0
      scrollEnabled = true
    }
  }

  const hoverLerp = 1 - Math.exp(-12 * dt)

  // Velocity-based scroll with friction
  if (scrollEnabled) {
    scrollVelocity *= Math.pow(SCROLL_FRICTION, dt * 60)
    scrollProgress += scrollVelocity
    scrollProgress = Math.max(0, Math.min(1, scrollProgress))
    // Stop at edges
    if (scrollProgress <= 0 || scrollProgress >= 1) scrollVelocity = 0
  }

  // Camera descends with scroll
  const yOffset = scrollProgress * totalHelixHeight
  const camY = -yOffset

  // Slow continuous rotation on the helix
  helix.rotation.y += 0.07 * dt

  // Camera stays front-facing, moves down
  camera.position.set(0, camY, 14)
  camera.lookAt(0, camY, 0)

  // Front light follows camera so front-facing posters stay lit
  frontLight.position.set(0, camY + 2, 14)

  // ── Hover detection ───────────────────────────────────
  const prevHovered = hoveredMesh
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(posters)
  const newHovered = intersects.length > 0 ? intersects[0].object : null

  if (newHovered !== hoveredMesh) {
    if (hoveredMesh) {
      canvas.style.cursor = 'default'
    }
    hoveredMesh = newHovered
    if (hoveredMesh) {
      canvas.style.cursor = 'pointer'
    }
  }

  // ── Poster hover label ─────────────────────────────────
  if (hoveredMesh !== prevHovered) {
    hoverTime = 0
    if (labelVisible) hideLabel()
  }

  if (hoveredMesh) {
    hoverTime += dt
    labelTargetX = rawCursorX + 18
    labelTargetY = rawCursorY + 18

    if (hoverTime >= LABEL_DELAY && !labelVisible) {
      showLabel(hoveredMesh)
    }

    if (labelVisible) {
      const lf = 1 - Math.exp(-8 * dt)
      labelX += (labelTargetX - labelX) * lf
      labelY += (labelTargetY - labelY) * lf
      posterLabelEl.style.transform = `translate(${labelX}px, ${labelY}px)`
    }
  } else {
    if (labelVisible) hideLabel()
    hoverTime = 0
  }

  // ── Animate hover offset for each poster ──────────────
  for (const poster of posters) {
    const target = poster === hoveredMesh ? 1 : 0
    poster.userData.hoverOffset += (target - poster.userData.hoverOffset) * hoverLerp

    const offset = poster.userData.hoverOffset * HOVER_PUSH
    const base = poster.userData.basePosition
    const radial = poster.userData.radial

    poster.position.set(
      base.x + radial.x * offset,
      base.y + radial.y * offset,
      base.z + radial.z * offset
    )
  }

  // ── Update UI overlay opacity ────────────────────────
  if (scrollEnabled) {
    const heroOpacity = Math.max(0, Math.min(1, 1 - scrollProgress / 0.12))
    const footerOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.88) / 0.12))
    heroEl.style.opacity = heroOpacity
    footerEl.style.opacity = footerOpacity
  }

  renderer.render(scene, camera)
}

animate()

// ── Resize ──────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ── Nav link letter-roll hover animation ─────────────────
;(function initNavLetterRoll() {
  const LETTER_DELAY = 20 // ms per letter stagger

  document.querySelectorAll('.nav-links a').forEach((link) => {
    const text = link.textContent.trim()
    const letters = text.split('')
    const total = letters.length

    // Clear original text
    link.textContent = ''

    // Wrapper holds spacer + two absolute layers
    const wrap = document.createElement('span')
    wrap.className = 'nav-link-wrap'

    // Invisible spacer preserves link width
    const spacer = document.createElement('span')
    spacer.className = 'nav-link-spacer'
    spacer.textContent = text
    wrap.appendChild(spacer)

    // Default text layer (visible initially)
    const defaultLayer = document.createElement('span')
    defaultLayer.className = 'nav-link-default'

    // Hover text layer (hidden below initially)
    const hoverLayer = document.createElement('span')
    hoverLayer.className = 'nav-link-hover'

    letters.forEach((char, i) => {
      const dSpan = document.createElement('span')
      dSpan.textContent = char === ' ' ? '\u00A0' : char
      dSpan.style.transitionDelay = `${i * LETTER_DELAY}ms`
      defaultLayer.appendChild(dSpan)

      const hSpan = document.createElement('span')
      hSpan.textContent = char === ' ' ? '\u00A0' : char
      hSpan.style.transitionDelay = `${i * LETTER_DELAY}ms`
      hoverLayer.appendChild(hSpan)
    })

    wrap.appendChild(defaultLayer)
    wrap.appendChild(hoverLayer)
    link.appendChild(wrap)

    // Hover: forward stagger (left → right), add class
    link.addEventListener('mouseenter', () => {
      for (let i = 0; i < total; i++) {
        defaultLayer.children[i].style.transitionDelay = `${i * LETTER_DELAY}ms`
        hoverLayer.children[i].style.transitionDelay = `${i * LETTER_DELAY}ms`
      }
      link.classList.add('hovered')
    })

    // Leave: reverse stagger (right → left), remove class
    link.addEventListener('mouseleave', () => {
      for (let i = 0; i < total; i++) {
        const rev = (total - 1 - i) * LETTER_DELAY
        defaultLayer.children[i].style.transitionDelay = `${rev}ms`
        hoverLayer.children[i].style.transitionDelay = `${rev}ms`
      }
      link.classList.remove('hovered')
    })
  })
})()
