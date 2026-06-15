function required(name, rawValue) {
  const value = rawValue?.trim()
  if (!value) throw new Error(`Missing required public environment value: ${name}`)
  return value.replace(/\/+$/, '')
}

function optionalUrl(rawValue) {
  return rawValue?.trim().replace(/\/+$/, '') || ''
}

export const env = Object.freeze({
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  apiBaseUrl: required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
  publicCdnBaseUrl: optionalUrl(import.meta.env.VITE_PUBLIC_CDN_BASE_URL),
  enableDebugPanel: import.meta.env.VITE_ENABLE_DEBUG_PANEL === 'true',
})
