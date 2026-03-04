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

// Arc-length step: place posters edge-to-edge along the helix (no gap)
const helixArcPerRad = Math.sqrt(
  HELIX_RADIUS * HELIX_RADIUS +
  (HELIX_PITCH / (2 * Math.PI)) * (HELIX_PITCH / (2 * Math.PI))
)
const ANGLE_STEP = POSTER_WIDTH / helixArcPerRad

// ── Poster images ─────────────────────────────────────────
const POSTER_SRCS = Array.from({ length: 30 }, (_, i) =>
  `/posters/poster${String(i + 1).padStart(2, '0')}.png`
)

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
const textureLoader = new THREE.TextureLoader()

// Pre-load & cache all 30 textures once
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
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2

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
const ambient = new THREE.AmbientLight('#ffffff', 1.0)
scene.add(ambient)

const dirLight = new THREE.DirectionalLight('#ffffff', 1.5)
dirLight.position.set(5, 10, 7)
scene.add(dirLight)

const backLight = new THREE.DirectionalLight('#ffffff', 0.5)
backLight.position.set(-5, -5, -5)
scene.add(backLight)

const fillLight = new THREE.DirectionalLight('#ffffff', 0.4)
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

  helix.add(mesh)
  posters.push(mesh)
}

// ── UI overlay elements ──────────────────────────────────
const heroEl = document.getElementById('hero')
const footerEl = document.getElementById('footer')

// ── Raycaster for hover ─────────────────────────────────
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-999, -999)
let hoveredMesh = null

const scrollTrack = document.getElementById('scroll-track')

scrollTrack.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
})

scrollTrack.addEventListener('mouseleave', () => {
  mouse.set(-999, -999)
})

// ── Scroll state (velocity-based smoothing) ──────────────
let scrollProgress = 0
let scrollVelocity = 0
const SCROLL_FRICTION = 0.92
const SCROLL_SENSITIVITY = 0.00003

const totalHelixHeight =
  (POSTER_COUNT * ANGLE_STEP * HELIX_PITCH) / (2 * Math.PI)

scrollTrack.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    scrollVelocity += e.deltaY * SCROLL_SENSITIVITY
  },
  { passive: false }
)

let touchStartY = 0
let touchLastY = 0

scrollTrack.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY
  touchLastY = touchStartY
  scrollVelocity = 0
}, { passive: true })

scrollTrack.addEventListener(
  'touchmove',
  (e) => {
    e.preventDefault()
    const y = e.touches[0].clientY
    scrollVelocity += (touchLastY - y) * 0.0003
    touchLastY = y
  },
  { passive: false }
)

// ── Animation loop (frame-rate independent) ─────────────
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const dt = Math.min(clock.getDelta(), 0.05) // cap to avoid jumps
  const hoverLerp = 1 - Math.exp(-12 * dt)

  // Velocity-based scroll with friction
  scrollVelocity *= Math.pow(SCROLL_FRICTION, dt * 60)
  scrollProgress += scrollVelocity
  scrollProgress = Math.max(0, Math.min(1, scrollProgress))
  // Stop at edges
  if (scrollProgress <= 0 || scrollProgress >= 1) scrollVelocity = 0

  // Camera descends with scroll
  const yOffset = scrollProgress * totalHelixHeight
  const camY = -yOffset

  // Slow continuous rotation on the helix
  helix.rotation.y += 0.07 * dt

  // Camera stays front-facing, moves down
  camera.position.set(0, camY, 14)
  camera.lookAt(0, camY, 0)

  // ── Hover detection ───────────────────────────────────
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
  const heroOpacity = Math.max(0, Math.min(1, 1 - scrollProgress / 0.12))
  const footerOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.88) / 0.12))
  heroEl.style.opacity = heroOpacity
  footerEl.style.opacity = footerOpacity

  renderer.render(scene, camera)
}

animate()

// ── Resize ──────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
