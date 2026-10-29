/** Presentation only. Never infer session state here: render the existing semantic keys. */
const classic = {
  id: 'classic', name: 'Bot Crossing', timeOfDay: 0.32,
  districts: [0xc96442, 0x4f9a63, 0x4f7ec9, 0xb8942a, 0x8b5cc9, 0xc94f8b, 0x3fa8a0, 0xc97f4f, 0x6f8f4f, 0x5c7fc9, 0xc95c5c, 0x7f6fc9],
  suits: [0xf3f1ec, 0xe8e4dc, 0xf7f4ee, 0xdfe4e8, 0xf1e9df],
  agents: {
    working: { trim: 0x4f9a63, eye: [0.35, 2.5, 1.15] },
    waiting: { trim: 0x4f7ec9, eye: [0.45, 1.5, 3] },
    blocked: { trim: 0xc94f4f, eye: [3, 0.5, 0.45] },
    celebrating: { trim: 0xc9a24f, eye: [2.9, 2.1, 0.6] },
    idle: { trim: 0x8b8b85, eye: [1.1, 1.5, 1.7] },
    sleeping: { trim: 0x5a5a70, eye: [0.7, 0.8, 1.4] },
    spawning: { trim: 0xc96442, eye: [2.4, 1.4, 0.7] },
    leaving: { trim: 0x6f7f75, eye: [1, 1, 1.1] },
  },
  badges: [[0.42, 1.35, 2.9], [2.9, 0.6, 0.5], [0.4, 1.9, 0.95], [1.5, 2.4, 0.8], [2.5, 1.9, 0.65], [0.9, 1, 1.7], [2.4, 1.4, 0.75], [1.2, 1.3, 1.35]],
  deck: { desaturate: -0.38, brightness: 0.9, metalness: 0.18 },
  idleBadge: -1,
  labels: {},
  borderGlow: 0.3, windowGlow: 0, shell: 0xf4f5f7, metalness: 0.04,
}
const cyberpunk = {
  ...classic, id: 'cyberpunk', name: 'AI Colony', timeOfDay: 0.82,
  districts: [0x24e5ff, 0xf15bda, 0x9d7bff, 0x448aff, 0x57ffd2, 0xc48aff, 0x64bcff, 0xff85db],
  suits: [0x40546c, 0x4b4467, 0x365968, 0x394660, 0x545e78],
  agents: {
    working: { trim: 0x24e5ff, eye: [0.25, 2.1, 2.7] },
    waiting: { trim: 0xffcc66, eye: [2.8, 1.8, 0.4] },
    blocked: { trim: 0xff607a, eye: [3, 0.35, 0.5] },
    celebrating: { trim: 0x64ffb0, eye: [0.5, 2.8, 1.1] },
    idle: { trim: 0xaabbd4, eye: [1.1, 1.3, 1.6] },
    sleeping: { trim: 0x9587bd, eye: [0.65, 0.55, 0.95] },
    spawning: { trim: 0xad80ff, eye: [1.6, 0.7, 2.8] },
    leaving: { trim: 0x7894b8, eye: [0.7, 1, 1.5] },
  },
  badges: [[2.8, 1.8, 0.4], [3, 0.35, 0.5], [0.25, 2.1, 2.7], [0.5, 2.8, 1.1], [1.1, 1.3, 1.6], [0.65, 0.55, 0.95], [1.6, 0.7, 2.8], [0.7, 1, 1.5]],
  deck: { desaturate: -0.2, brightness: 0.32, metalness: 0.55 },
  idleBadge: 4,
  labels: { waiting: 'Waiting for input', blocked: 'Error', celebrating: 'Completed' },
  borderGlow: 0.85, windowGlow: 0.45, shell: 0x8194ae, metalness: 0.5,
  environment: {
    ground: { low: 0x11182c, high: 0x2a3654, tint: 0x415578 },
    rock: 0x303d59, horizon: 0x11142f,
    sky: { top: 0x040817, bottom: 0x20143b },
    fog: { color: 0x12192f, near: 100, far: 235 },
    sun: { color: 0x91bfff, intensity: 1.7, night: 0.35 },
    ambient: { sky: 0x789eff, ground: 0x5b337e, intensity: 1.15 },
    buildingTint: 0x546580,
    grade: { saturation: 1.05, warmth: -0.03 },
  },
}
export const THEMES = { classic, cyberpunk }
export function themeFor(name) { return THEMES[name] || cyberpunk }
// A URL selection is local to the browser and never changes API or integration settings.
export const THEME = themeFor(typeof location === 'undefined' ? 'cyberpunk' : new URLSearchParams(location.search).get('theme'))
export function themedPlanet(planet, theme = THEME) {
  return theme.environment ? { ...planet, ...theme.environment } : planet
}

/** Install DOM tokens once, from the same status palette as robot lamps. */
export function applyTheme(document, theme = THEME) {
  document.documentElement.dataset.theme = theme.id
  document.title = theme.name
  for (const [status, look] of Object.entries(theme.agents)) {
    document.documentElement.style.setProperty(`--status-${status}`, `#${look.trim.toString(16).padStart(6, '0')}`)
  }
}
