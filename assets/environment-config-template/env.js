function required(name, rawValue) {
  const value = rawValue?.trim()
  if (!value) throw new Error(`Missing required public environment value: ${name}`)
  return value.replace(/\/+$/, '')
}

export const env = Object.freeze({
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  apiBaseUrl: required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
})
