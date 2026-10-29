/** Exact Codespaces host only; never trust request-supplied forwarding headers. */
export function codespacesHost(env = process.env) {
  if (env.CODESPACES !== 'true') return ''
  const name = env.CODESPACE_NAME || ''
  const domain = env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || ''
  const port = env.PORT || '5274'
  if (!/^[a-z0-9-]+$/.test(name) || !/^[a-z0-9.-]+$/.test(domain) || !/^\d+$/.test(port)) return ''
  return `${name}-${port}.${domain}`
}
