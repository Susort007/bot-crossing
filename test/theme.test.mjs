import test from 'node:test'
import assert from 'node:assert/strict'
import { THEMES, themeFor, themedPlanet, applyTheme } from '../src/themes/index.js'
import { statusFor } from '../src/game/session-status.js'

test('both themes render all semantic states and install matching HUD status colours', () => {
  const states = ['working', 'idle', 'waiting', 'celebrating', 'blocked', 'sleeping', 'spawning', 'leaving']
  for (const theme of Object.values(THEMES)) {
    const tokens = new Map()
    const document = { documentElement: { dataset: {}, style: { setProperty: (k, v) => tokens.set(k, v) } } }
    applyTheme(document, theme)
    assert.equal(document.title, theme.name)
    assert.equal(document.documentElement.dataset.theme, theme.id)
    for (const state of states) {
      const look = theme.agents[state]
      assert.equal(tokens.get(`--status-${state}`), `#${look.trim.toString(16).padStart(6, '0')}`)
      assert.equal(look.eye.length, 3)
      assert.ok(look.eye.every(Number.isFinite))
    }
    assert.equal(theme.badges.length, 8)
    assert.ok(new Set(theme.districts).size >= 8)
  }
  assert.equal(themeFor('unknown'), THEMES.cyberpunk)
  assert.equal(themeFor('toString'), THEMES.cyberpunk)
})

test('theming changes environment presentation while preserving planet geometry and identity', () => {
  const planet = { id: 'test', name: 'Test', shape: 'island', water: { level: 0 }, ground: { low: 1 }, sun: { intensity: 2 } }
  const original = structuredClone(planet)
  const themed = themedPlanet(planet, THEMES.cyberpunk)
  assert.deepEqual(planet, original)
  for (const key of ['id', 'name', 'shape', 'water']) assert.deepEqual(themed[key], planet[key])
  assert.notDeepEqual(themed.ground, planet.ground)
  assert.equal(themedPlanet(planet, THEMES.classic), planet)
})

test('session signals retain precedence independently of theme presentation', () => {
  const now = Date.now()
  const session = { lastActivityAt: now, running: true, unread: true, hasError: true, prState: 'MERGED' }
  assert.equal(statusFor(session, now), 'blocked')
  assert.equal(statusFor({ ...session, hasError: false }, now), 'working')
  assert.equal(statusFor({ ...session, hasError: false, running: false }, now), 'celebrating')
  assert.equal(statusFor({ lastActivityAt: now, unread: true }, now), 'waiting')
  assert.equal(statusFor({ lastActivityAt: now }, now), 'idle')
  assert.equal(statusFor({ lastActivityAt: now - 4 * 86400000, hasError: true }, now), 'sleeping')
})
