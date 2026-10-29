import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { codespacesHost } from '../server/browser-preview.mjs'
import { demoThreads } from '../server/demo.mjs'
import { withEnv } from './support/env.mjs'
import { withServer } from './support/with-server.mjs'

const env = { CODESPACES: 'true', CODESPACE_NAME: 'my-space', GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN: 'app.github.dev', PORT: '5274', BOT_CROSSING_DEMO: '1' }
const host = 'my-space-5274.app.github.dev'

test('preview hostname requires explicit Codespaces metadata', () => {
  assert.equal(codespacesHost({}), '')
  assert.equal(codespacesHost(env), host)
  assert.equal(codespacesHost({ ...env, CODESPACE_NAME: '*.evil' }), '')
})

test('simulation has stable identities, multiple projects and changing activity', () => {
  const a = demoThreads(1800000000000), b = demoThreads(1800000020000)
  assert.equal(new Set(a.map(t => t.project)).size, 3)
  assert.deepEqual(a.map(t => t.id), b.map(t => t.id))
  assert.notDeepEqual(a.map(t => t.running), b.map(t => t.running))
  for (const flag of ['running', 'unread', 'hasError']) assert.ok(a.some(t => t[flag]))
})

test('private preview retains Host/Origin gates and demo API never invokes desktop actions', async () => {
  await withEnv(env, () => withServer(async ({ call }) => {
    const port = new URL((await call('/api/nope')).url).port
    const request = (hostHeader, origin, method = 'GET', route = '/api/threads') => new Promise((resolve, reject) => {
      const req = http.request({ hostname: '127.0.0.1', port, path: route, method,
        headers: { Host: hostHeader, ...(origin === undefined ? {} : { Origin: origin }) } }, res => {
        let body = ''; res.on('data', c => body += c); res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }))
      }); req.on('error', reject); req.end()
    })
    const threads = await request(host)
    assert.equal(threads.status, 200)
    assert.equal(threads.body.threads.length, 12)
    assert.ok(threads.body.threads.every(t => t.harness === 'demo'))
    assert.equal((await request('other-5274.app.github.dev')).status, 403)
    for (const origin of [undefined, 'null', 'https://evil.example', 'http://' + host, 'http://localhost:5274']) {
      assert.equal((await request(host, origin, 'POST', '/api/open')).status, 403)
    }
    for (const route of ['/api/open', '/api/new-session', '/api/reveal']) {
      const reply = await request(host, 'https://' + host, 'POST', route)
      assert.equal(reply.status, 400)
      assert.match(reply.body.error, /simulated/)
    }
    const state = await request(host, 'https://' + host, 'PUT', '/api/state')
    assert.equal(state.status, 200)
  }))
})
