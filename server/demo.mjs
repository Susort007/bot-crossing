/** Stable identities with rotating activity: no harness files, processes or credentials. */
export function demoThreads(now = Date.now()) {
  const phase = Math.floor(now / 20000)
  return Array.from({ length: 12 }, (_, i) => {
    const project = ['moon-base', 'forest-lab', 'orbital-tools'][Math.floor(i / 4)]
    const state = (i + phase) % 6
    return {
      id: `demo:${i}`, harness: 'demo', ref: { id: String(i) },
      title: ['Build habitat', 'Review navigation', 'Test greenhouse', 'Map terrain'][i % 4],
      preview: 'Simulated coding agent — demo data only.', project,
      projectPath: `/demo/${project}`, cwd: `/demo/${project}`, gitBranch: 'demo',
      model: 'Simulated agent', effort: 'demo', createdAt: 1700000000000 + i * 1000,
      lastActivityAt: state === 5 ? now - 4 * 86400000 : now - i * 1000,
      running: state === 0, unread: state === 1, hasError: state === 2,
      prState: state === 3 ? 'MERGED' : '', archived: false,
      sizeBytes: 5000 + i * 40000,
    }
  })
}
export const demoHarnesses = [{ id: 'demo', name: 'Demo (simulated agents)', detected: true }]
