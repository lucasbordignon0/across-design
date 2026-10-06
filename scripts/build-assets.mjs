import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { zipSync, strToU8 } from 'fflate'
import { AQUA, NEUTRALS, GRADIENTS, MODES, BRAND_REVISION } from '../src/content.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const publicDir = path.join(root, 'public')
const mastersDir = path.join(root, 'brand-masters')
const logosDir = path.join(publicDir, 'logos')
const gradientsDir = path.join(publicDir, 'gradients')
await fs.mkdir(logosDir, { recursive: true })
await fs.mkdir(gradientsDir, { recursive: true })

const colors = { white: '#FFFFFF', dark: '#151518', aqua: '#6CF9D8' }
const logoPack = {}, decorativePack = {}, gradientPack = {}, colorPack = {}
const sources = {}
for (const name of ['primary-logo', 'primary-symbol', 'secondary-logo', 'secondary-symbol', 'powered-by', 'crest', 'monogram']) {
  const original = await fs.readFile(path.join(mastersDir, `${name}.svg`), 'utf8')
  if (!original.includes('<svg') || original.includes('<text')) throw new Error(`Invalid or unoutlined master: ${name}`)
  sources[name] = original
  const isDecorative = name === 'crest' || name === 'monogram'
  const pack = isDecorative ? decorativePack : logoPack
  for (const [colorName, color] of Object.entries(colors)) {
    // Integration lockups are monochrome only. Transparent cutouts remain intact.
    if (name === 'powered-by' && colorName === 'aqua') continue
    const svg = original.replace(/fill="(?:white|black|#[0-9a-fA-F]{3,8})"/g, `fill="${color}"`)
    const filename = `${name}-${colorName}`
    await fs.writeFile(path.join(logosDir, `${filename}.svg`), svg)
    pack[`${filename}.svg`] = strToU8(svg)
    const png = await sharp(Buffer.from(svg), { density: 144 }).png().toBuffer()
    pack[`${filename}@2x.png`] = new Uint8Array(png)
  }
}
await fs.copyFile(path.join(logosDir, 'primary-symbol-aqua.svg'), path.join(publicDir, 'favicon.svg'))

for (const palette of GRADIENTS) {
  const stops = palette.stops.map(([color, offset]) => `<stop offset="${offset}%" stop-color="${color}"/>`).join('')
  const name = palette.name.toLowerCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs><radialGradient id="gradient" cx="0.78" cy="0.42" r="0.86">${stops}</radialGradient></defs><rect width="1920" height="1080" fill="url(#gradient)"/></svg>`
  await fs.writeFile(path.join(gradientsDir, `${name}-radial.svg`), svg)
  gradientPack[`${name}-radial.svg`] = strToU8(svg)
  gradientPack[`${name}-radial.png`] = new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer())
  const strip = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="320"><defs><linearGradient id="gradient">${stops}</linearGradient></defs><rect width="1920" height="320" fill="url(#gradient)"/></svg>`
  gradientPack[`${name}-palette.svg`] = strToU8(strip)
}
gradientPack['palettes.json'] = strToU8(JSON.stringify(GRADIENTS, null, 2) + '\n')

// Exact painted radial surface from Figma, exported without annotation layers.
const radialMaster = await fs.readFile(path.join(mastersDir, 'brand-radial.svg'), 'utf8')
await fs.writeFile(path.join(gradientsDir, 'across-radial.svg'), radialMaster)
gradientPack['across-radial.svg'] = strToU8(radialMaster)
gradientPack['across-radial.png'] = new Uint8Array(await sharp(Buffer.from(radialMaster), { density: 144 }).png().toBuffer())

const named = { 'across-aqua': '#6CF9D8', 'near-black': '#151518', 'bright-gray': '#E0F3FF', surface: '#202024', black: '#0B0B0B', 'light-page': '#F3F7F7', white: '#FFFFFF', mist: '#D6E2E0' }
for (const [name, color] of Object.entries(named)) {
  colorPack[`${name}.svg`] = strToU8(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="${color}"/></svg>`)
}
const tokens = { revision: BRAND_REVISION, colors: named, aqua: Object.fromEntries(AQUA), neutrals: Object.fromEntries(NEUTRALS), modes: MODES }
colorPack['tokens.json'] = strToU8(JSON.stringify(tokens, null, 2) + '\n')
colorPack['tokens.css'] = strToU8(Object.entries(MODES).map(([mode, values]) => `${mode === 'dark' ? ':root, ' : ''}[data-theme="${mode}"] {\n${Object.entries(values).map(([key,value]) => `  --${key.replace(/[A-Z]/g, c=>'-'+c.toLowerCase())}: ${value};`).join('\n')}\n}`).join('\n\n') + '\n')

const general = `Across brand assets — ${BRAND_REVISION}\n\nSource: https://www.figma.com/design/hRaAhovZJOTFySyJhrlYiU/\nUse approved artwork without distortion, rotation or effects. Keep clear space equal to the gap between symbol and wordmark.\nWhite/aqua variants are for dark backgrounds; dark variants are for light backgrounds. SVG lettering is outlined. Logo PNGs are transparent 2x exports. Gradient PNGs are opaque artwork.\nFonts are not included. Supreme: https://www.fontshare.com/fonts/supreme\nIvyPresto: https://fonts.adobe.com/fonts/ivypresto-headline\n`
const packs = [
  ['Across_Logo_Assets.zip', 'Across Logo Assets', logoPack, 'Use the solid-circle primary lockup by default. Ring variants suit large formats. Powered by lockups are monochrome and must not gain color, gradients or taglines.'],
  ['Across_Alt_Logos.zip', 'Across Decorative Logos', decorativePack, 'Crest and Monogram are for merch, events and internal material. Put the primary logo somewhere on merch. Outside these contexts, use primary or secondary.'],
  ['Across_Gradients.zip', 'Across Gradients', gradientPack, 'Across is the default palette. across-radial is the exact Figma-painted surface; the other radial artworks are applications of the documented palette stops. Palette strips and palettes.json document stop positions.'],
  ['Across_Main_Colors.zip', 'Across Colors', colorPack, 'Dark is the default. Status colors are functional only. Aqua 500–950 are for gradients, illustration and tints, not UI text.'],
]
const all = {}, manifest = []
for (const [zipName, folder, files, guidance] of packs) {
  files['README.txt'] = strToU8(general + '\n' + guidance + '\n')
  const names = Object.keys(files).sort()
  files['manifest.json'] = strToU8(JSON.stringify({ revision: BRAND_REVISION, files: names }, null, 2) + '\n')
  const entries = Object.fromEntries(Object.entries(files).map(([name, bytes]) => [`${folder}/${name}`, bytes]))
  await fs.writeFile(path.join(publicDir, zipName), zipSync(entries, { level: 6, mtime: new Date('2026-09-01T00:00:00Z') }))
  for (const [name, bytes] of Object.entries(entries)) all[`Across Assets/${name}`] = bytes
  manifest.push({ pack: zipName, files: Object.keys(files).length })
}
all['Across Assets/README.txt'] = strToU8(general)
all['Across Assets/manifest.json'] = strToU8(JSON.stringify({ revision: BRAND_REVISION, packs: manifest }, null, 2) + '\n')
await fs.writeFile(path.join(publicDir, 'Across_Assets.zip'), zipSync(all, { level: 6, mtime: new Date('2026-09-01T00:00:00Z') }))
console.log('Generated approved logo variants and five brand download packs:', manifest)
