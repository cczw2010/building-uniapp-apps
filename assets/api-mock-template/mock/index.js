// ponytail: add only handlers required by the current flow.
const handlers = {}

function normalizePath(url) {
  const [path] = url.split('?')
  return path.replace(/^https?:\/\/[^/]+/, '')
}

function clone(value) {
  if (typeof structuredClone === 'function') return structuredClone(value)
  return JSON.parse(JSON.stringify(value))
}

export async function matchMock(options) {
  const method = (options.method || 'GET').toUpperCase()
  const key = `${method} ${normalizePath(options.url)}`
  const handler = handlers[key]

  if (!handler) return { matched: false }

  const data = typeof handler === 'function'
    ? await handler(options)
    : clone(handler)

  return { matched: true, data }
}
