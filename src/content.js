// September 2026 brand guidelines. Supreme is used for every interface role.
export const BRAND_REVISION = 'September 2026'
export const FONT_URL = 'https://www.fontshare.com/fonts/supreme'
export const DOWNLOADS = [
  { name: 'All Assets', format: 'ZIP', file: '/Across_Assets.zip' },
  { name: 'Logo Assets', format: 'SVG + PNG · ZIP', file: '/Across_Logo_Assets.zip' },
  { name: 'Decorative Logos', format: 'SVG + PNG · ZIP', file: '/Across_Alt_Logos.zip' },
  { name: 'Gradients', format: 'SVG + PNG · ZIP', file: '/Across_Gradients.zip' },
  { name: 'Colors & Tokens', format: 'SVG + JSON + CSS · ZIP', file: '/Across_Main_Colors.zip' },
]

export const AQUA = [
  ['100', '#BDFCED'], ['200', '#98FBE4'], ['300', '#6CF9D8'], ['400', '#66E5C7'],
  ['500', '#60D5B9'], ['600', '#30997F'], ['700', '#1F5F4F'], ['800', '#0F2F27'],
  ['900', '#08201A'], ['950', '#041410'],
]
export const NEUTRALS = [
  ['000', '#FFFFFF'], ['025', '#E0F3FF'], ['050', '#CEDFEB'], ['100', '#AAB8C2'],
  ['200', '#869099'], ['300', '#636970'], ['400', '#51555C'], ['500', '#3F4247'],
  ['600', '#34353B'], ['700', '#2D2E33'], ['800', '#202024'], ['850', '#1B1B1E'],
  ['900', '#151518'], ['Black', '#0B0B0B'],
]
export const GRADIENTS = [
  { name: 'Across', role: 'Primary', stops: [['#08201A',29.81],['#30997F',45.19],['#60D5B9',60.58],['#6CF9D8',79.81],['#D6E2E0',100]] },
  { name: 'Aqua', role: 'Lighter', stops: [['#0F2F27',18],['#30997F',40],['#6CF9D8',62],['#98FBE4',80],['#D6E2E0',100]] },
  { name: 'Deep', role: 'Deeper', stops: [['#041410',22],['#08201A',42],['#1F5F4F',60],['#30997F',78],['#60D5B9',100]] },
  { name: 'Mint', role: 'Light mode', stops: [['#60D5B9',18],['#66E5C7',42],['#6CF9D8',62],['#BDFCED',84],['#F3F7F7',100]] },
  { name: 'Mono', role: 'Quiet', stops: [['#151518',24],['#3F4247',44],['#869099',64],['#CEDFEB',84],['#D6E2E0',100]] },
]
export const MODES = {
  dark: { page: '#151518', surface: '#202024', text: '#FFFFFF', secondary: '#AAB8C2', hairline: '#E0F3FF1A', accent: '#6CF9D8', accentText: '#6CF9D8', onAccent: '#202024', danger: '#FF6166', warning: '#FF9500', info: '#47A8FF' },
  light: { page: '#F3F7F7', surface: '#FFFFFF', text: '#151518', secondary: '#38383B', hairline: '#0A37371A', accent: '#6CF9D8', accentText: '#66E5C7', onAccent: '#202024', danger: '#E03131', warning: '#E8590C', info: '#0A63B2' },
}

const section = (id, label) => ({ id, label })
export const NAV_DATA = [
  { id: 'foundations', label: 'Foundations', pages: [
    { id: 'logo', label: 'Logo', sections: [
      section('primary-logo','Primary Logo'), section('secondary-logo','Secondary Logo'), section('symbol','Symbol'),
      section('logo-playground','Logo Playground'), section('clear-space','Clear Space'),
      section('powered-by','Powered by Across'), section('partnerships','Co-marketing'),
      section('alt-logos','Decorative Logos'), section('logo-resources','Resources'),
    ] },
    { id: 'colors', label: 'Colors', sections: [
      section('primary-colors','Primary Colors'), section('secondary-colors','Secondary Colors'),
      section('color-shades','Shades'), section('color-transparency','Transparency'),
      section('brand-gradient','Brand Gradient'), section('gradient-palettes','Gradient Palettes'),
      section('color-modes','Light & Dark'), section('functional-colors','Functional Colors'),
    ] },
    { id: 'typography', label: 'Typography', sections: [
      section('type-overview','Overview'), section('type-supreme','Supreme'),
      section('type-ivypresto','IvyPresto Headline'), section('type-ivy-text','IvyPresto Text'), section('type-scale','Type Scale'), section('type-usage','Usage'),
    ] },
    { id: 'iconography', label: 'Iconography', sections: [section('icon-overview','Overview')] },
    { id: 'photography', label: 'Photo Style', sections: [
      section('photo-overview','Overview'), section('nature-motion','Nature in Motion'),
      section('life-motion','Life in Motion'), section('color-motion','Color in Motion'),
    ] },
  ] },
  { id: 'resources', label: 'Resources', pages: [
    { id: 'resources-downloads', label: 'Downloads', sections: [section('res-downloads','Brand Assets'),section('res-fonts','Fonts')] },
  ] },
]

const asset = (name, color = 'dark') => `/logos/${name}-${color}.svg`
const weights = [
  {value:100,name:'Thin'}, {value:200,name:'Extralight'}, {value:300,name:'Light'},
  {value:400,name:'Regular'}, {value:500,name:'Medium'}, {value:700,name:'Bold'}, {value:800,name:'Extrabold'},
]
export const PAGE_CONTENT = {
  logo: { sections: {
    'primary-logo': {
      desc: 'The primary logo pairs the symbol with the ACROSS wordmark. Four strokes meet at one point inside a solid circle. Use the full lockup by default.\n\nAlways use the master artwork. The wordmark is part of the logo, not text to reset in another typeface.',
      layout: 'logo-showcase', logos: [asset('primary-logo')],
    },
    'secondary-logo': {
      desc: 'The secondary logo uses a ring instead of a solid circle. Its lighter construction suits merch, signage and large editorial layouts.\n\nAvoid it at small sizes and in partner integrations. Its construction and clear space match the primary logo.',
      layout: 'logo-showcase', logos: [asset('secondary-logo')],
    },
    symbol: {
      desc: 'Use the symbol alone when space is tight or the Across name is already on screen. The solid-circle symbol is the default, including at favicon sizes.\n\nThe ring symbol is a secondary option for larger formats.',
      layout: 'logo-showcase', logos: [asset('primary-symbol'),asset('secondary-symbol')], compact: true,
    },
    'logo-playground': {
      desc: 'Explore the approved primary, secondary and symbol artwork on different backgrounds. The playground selects an approved aqua, white or near-black variant for contrast.\n\nChanging the background does not change the master geometry. Use the primary logo for integrations and small formats.',
      layout: 'playground',
    },
    'clear-space': {
      desc: 'Clear space on every side equals x: the gap between the symbol and the wordmark. Keep text, artwork and edges outside this area.\n\nThe same unit governs primary and secondary lockups.',
      layout: 'clear-space',
    },
    'powered-by': {
      desc: 'Use this lockup when Across runs inside another product: POWERED BY in a light weight, followed by the symbol and ACROSS in bold, separated by x.\n\nUse the approved monochrome masters. Never add color, gradients or a tagline. Send partners the files rather than asking them to rebuild the lockup.',
      layout: 'logo-showcase', logos: [asset('powered-by')],
    },
    partnerships: {
      desc: 'For co-marketing on Across assets, Across comes first, then the multiplication sign ×, then the partner logo. Leave x of space on either side of ×.\n\nMatch optical height rather than width. If the two brands’ rules conflict, agree the lockup before publishing.',
      layout: 'partnerships',
    },
    'alt-logos': {
      desc: 'Crest and Monogram are decorative marks for merch, events and internal material. These are special expressions, not substitutes for the primary identity.\n\nOutside merch and internal work, use the primary or secondary logo.',
      layout: 'logo-showcase', logos: [asset('crest'),asset('monogram')], decorative: true,
    },
    'logo-resources': { desc: 'Approved September 2026 artwork. SVG masters and matching transparent PNGs are organized by logo and color. Each pack includes usage guidance.', layout: 'resources', resources: DOWNLOADS },
  } },
  colors: { sections: {
    'primary-colors': {
      desc: 'Three colors carry the brand: Near Black is the dark page, Bright Gray is the brand type color, and Aqua is the accent.\n\nAqua marks what matters—an action, a confirmation or the brand itself—so it stays rare.',
      layout: 'color-blocks', colors: [{name:'Across Aqua · 300',hex:'#6CF9D8'},{name:'Near Black',hex:'#151518'},{name:'Bright Gray',hex:'#E0F3FF'}],
    },
    'secondary-colors': {
      desc: 'Supporting neutrals build surfaces and contrast. Surface lifts cards from the dark page. Black supports high-contrast artwork. Light Page and White carry light mode.',
      layout: 'color-blocks', colors: [{name:'Surface',hex:'#202024'},{name:'Black',hex:'#0B0B0B'},{name:'Light Page',hex:'#F3F7F7'},{name:'White',hex:'#FFFFFF'}],
    },
    'color-shades': {
      desc: 'Aqua 300 is the brand accent. Aqua 400 is accent text in light mode. Aqua 500–950 support gradients, illustration and tints; do not use them for UI text.\n\nThe cool neutral scale builds depth in dark mode. Light mode maps semantic roles to one ink at stepped opacities.',
      layout: 'color-shades', columns: [{name:'Aqua',shades:AQUA.map(([step,hex])=>({step,hex}))},{name:'Neutrals',shades:NEUTRALS.map(([step,hex])=>({step,hex}))}],
    },
    'color-transparency': {
      desc: 'Use restrained transparency for selected states, hairlines and color washes. These interface examples show how palette colors layer onto their intended surfaces.\n\nDark hairlines use Bright Gray at 10%; light hairlines use #0A3737 at 10%.',
      layout: 'color-transparency', columns: [{name:'Aqua on dark',base:'#6CF9D8',levels:['5','10','15','20','30']},{name:'Bright Gray on dark',base:'#E0F3FF',levels:['5','10','15','20','30']},{name:'Ink on light',base:'#0A3737',levels:['5','10','15','20','30'],lightBg:true}],
    },
    'brand-gradient': {
      desc: 'The radial gradient is the brand’s signature surface. It is built from the aqua scale and blends into its page: Aqua 900 on dark, Mist on light.\n\nMist is #D6E2E0. The vector surface below recreates the approved radial geometry and color stops at any size.',
      layout:'brand-radial',
    },
    'gradient-palettes': {
      desc: 'Five palettes for generated artwork. Across is the default; Aqua, Deep, Mint and Mono provide lighter, deeper or quieter moods.\n\nThe strips show palette stops. Download the clean radial artwork and palette reference from Resources.',
      layout:'gradients', palettes:GRADIENTS,
    },
    'color-modes': {
      desc: 'One set of semantic roles, two values. This guide uses light mode. Light uses a #F3F7F7 page with white cards. Aqua stays a full-strength fill; text becomes ink and accent text becomes Aqua 400.',
      layout:'modes', modes:MODES,
    },
    'functional-colors': {
      desc: 'Danger, Warning and Info communicate status. Never use them as decoration. Each role has a dark and light value.',
      layout:'color-blocks', colors:[
        {name:'Danger · dark',hex:MODES.dark.danger},{name:'Danger · light',hex:MODES.light.danger},
        {name:'Warning · dark',hex:MODES.dark.warning},{name:'Warning · light',hex:MODES.light.warning},
        {name:'Info · dark',hex:MODES.dark.info},{name:'Info · light',hex:MODES.light.info},
      ],
    },
  } },
  typography: { sections: {
    'type-overview': {
      desc: 'Supreme is Across’s primary typeface and the font for this entire design system interface: navigation, headings, body, controls and technical values.\n\nIvyPresto is the secondary editorial family. Its Display, Headline and Text variants serve different sizes and reading contexts.',
      layout:'type-overview', families:[
        {font:'Supreme',label:'Supreme',role:'Primary · Brand & UI',sample:'Move value across every network.',weight:500,url:FONT_URL},
        {font:'ivypresto-headline',label:'IvyPresto',role:'Secondary · Editorial',sample:'Money, already in motion.',weight:300,url:'https://fonts.adobe.com/fonts/ivypresto-headline'},
      ],
    },
    'type-supreme': {
      desc: 'Supreme is a versatile grotesque by Jérémie Hornus and Ilya Naumoff. The supplied variable family spans Thin to Extrabold, with upright and italic styles.\n\nGet your free copy directly from <a href="https://www.fontshare.com/fonts/supreme" target="_blank" rel="noopener noreferrer">Fontshare ↗</a>. Fonts are not included in the brand asset ZIPs.',
      layout:'type-specimen', font:'Supreme',label:'Supreme',weights,
    },
    'type-ivypresto': {
      desc: 'IvyPresto Display is for huge text and decorative pieces. Headline is for titles and headings. Text is for longer decorative paragraphs and smaller editorial sizes.\n\nThe live specimen below uses IvyPresto Headline. Use Display for oversized decorative work and Text for longer passages. Obtain the family through Adobe Fonts.',
      layout:'type-specimen',font:'ivypresto-headline',label:'IvyPresto Headline',weights:[{value:100,name:'Thin'},{value:300,name:'Light'},{value:400,name:'Regular'}],
    },
    'type-ivy-text': {
      desc: 'IvyPresto Text gives longer decorative paragraphs an editorial voice. Use it for introductions, brand stories and expressive reading passages, with generous line-height and a comfortable measure.\n\nSupreme remains the default for functional body copy, instructions and product interfaces.',
      layout:'editorial-paragraph',
      paragraphs:[
        'Money is always moving. Across connects the places it needs to go, bringing people, products and networks closer together. From a first transfer to a new way of paying, every journey starts with a simple intention: to reach the other side.',
        'We believe moving value should feel natural. The technology works quietly in the background, leaving room for the moments, ideas and possibilities that come next.',
      ],
    },
    'type-scale': {
      desc: 'Use Supreme for functional headings, body and labels, including technical content that previously used mono. Reserve IvyPresto for expressive editorial display.\n\nThis practical web scale adapts the brand families to the guide’s interface. Maintain readable sizes and check wrapping at mobile widths.',
      layout:'type-scale',groups:[
        {name:'Editorial display',font:'ivypresto-headline',sizes:[{label:'Display Large',size:72,weight:300,lineHeight:1.1},{label:'Display Medium',size:56,weight:300,lineHeight:1.1},{label:'Display Small',size:40,weight:400,lineHeight:1.15}]},
        {name:'Decorative paragraphs',font:'ivypresto-text',sizes:[{label:'Editorial Body Large',size:24,weight:400,lineHeight:1.5},{label:'Editorial Body',size:20,weight:400,lineHeight:1.6}]},
        {name:'Interface headings',font:'Supreme',sizes:[{label:'Heading Large',size:36,weight:500,lineHeight:1.2},{label:'Heading Medium',size:24,weight:500,lineHeight:1.25},{label:'Heading Small',size:18,weight:500,lineHeight:1.35}]},
        {name:'Body & labels',font:'Supreme',sizes:[{label:'Body Large',size:18,weight:400,lineHeight:1.6},{label:'Body',size:16,weight:400,lineHeight:1.6},{label:'Label',size:14,weight:500,lineHeight:1.4},{label:'Micro label',size:12,weight:500,lineHeight:1.4}]},
      ],
    },
    'type-usage': {
      desc: 'Match the typeface to the text’s job. Supreme provides clarity for product and technical content. IvyPresto adds an editorial voice to expressive work.\n\nUse clear hierarchy, comfortable line-height and restrained tracking. These web settings are starting points, not replacements for optical judgment.',
      layout:'type-usage',blocks:[
        {role:'Editorial headline',font:'ivypresto-headline',fontLabel:'IvyPresto Headline Light',weight:300,leading:'110%',tracking:'−1%',sample:'Money in motion',sampleSize:72,sampleLineHeight:1.1,sampleLetterSpacing:-0.72},
        {role:'Long decorative paragraph',font:'ivypresto-text',fontLabel:'IvyPresto Text Regular',weight:400,leading:'160%',tracking:'0%',sample:'Across connects the places value needs to go. Every journey begins with an intention, opening new possibilities for the people, products and networks on the other side.',sampleSize:24,sampleLineHeight:1.6,sampleLetterSpacing:0},
        {role:'Functional heading',font:'Supreme',fontLabel:'Supreme Medium',weight:500,leading:'125%',tracking:'−1%',sample:'Move value between chains',sampleSize:32,sampleLineHeight:1.25,sampleLetterSpacing:-0.32},
        {role:'Body',font:'Supreme',fontLabel:'Supreme Regular',weight:400,leading:'160%',tracking:'0%',sample:'Wallets, exchanges, apps and payments companies use Across to move value between chains. A user says where their money should end up, relayers fill it, and the protocol settles it.',sampleSize:16,sampleLineHeight:1.6,sampleLetterSpacing:0},
        {role:'Label',font:'Supreme',fontLabel:'Supreme Medium',weight:500,leading:'140%',tracking:'2%',transform:'uppercase',sample:'Across Protocol',sampleSize:14,sampleLineHeight:1.4,sampleLetterSpacing:0.28},
      ],
    },
  } },
  iconography:{sections:{'icon-overview':{
    desc:'Across uses the Central Icon System by Iconists. Keep a consistent family, stroke and corner treatment across product interfaces.\n\nUse icons to clarify actions and status. Decorative icons should be hidden from assistive technology; icon-only controls need an accessible name.',
    layout:'icon-feature',url:'https://iconists.co/central',linkLabel:'Browse Central Icon System ↗',
  }}},
  photography:{sections:{
    'photo-overview':{desc:'Real places and people, captured mid-action and slightly blurred. Nothing is posed; the subject remains recognizable.\n\nGradients and color are the base layer of the brand. Photography adds the human side, roughly 30% of the mix. Avoid chains, glowing networks, coins and posed stock.',layout:'none'},
    'nature-motion':{desc:'Landscapes, trees, water and sky with real camera movement. The subject stays readable through the blur.\n\nUse this calm register for partner-facing and editorial work. Favor natural light, warm earth against cool sky, and restrained saturation.',layout:'none'},
    'life-motion':{desc:'People and cities mid-action: someone walking, a passing train or a street at dusk. One person or a few, never a crowd and never posed.\n\nUse the human side of the brand for launches, community and events.',layout:'none'},
    'color-motion':{desc:'Aqua in motion: soft gradients and color fields built from the brand palette. No photography here.\n\nThis is the system’s base layer and most of what we publish. Stay in the aqua family and keep aqua the brightest thing in the frame.',layout:'none'},
  }},
  'resources-downloads':{sections:{
    'res-downloads':{desc:'Current September 2026 masters, with approved variants and usage notes. The complete bundle is generated from the same files as the individual packs.',layout:'resources',resources:DOWNLOADS},
    'res-fonts':{desc:'Obtain fonts from their official sources. Supreme is free from Fontshare. IvyPresto is available through Adobe Fonts. Font software is not bundled with these brand downloads.',layout:'font-links',links:[{name:'Supreme',url:FONT_URL,label:'Get Supreme on Fontshare ↗'},{name:'IvyPresto Headline',url:'https://fonts.adobe.com/fonts/ivypresto-headline',label:'View Headline on Adobe Fonts ↗'},{name:'IvyPresto Text',url:'https://fonts.adobe.com/fonts/ivypresto-text',label:'View Text on Adobe Fonts ↗'}]},
  }},
}
