import { env } from '../config/env.js'
import { matchMock } from '../mock/index.js'

function normalizeResult(result) {
  if (!Array.isArray(result)) return result.data
  const [error, response] = result
  if (error) throw error
  return response.data
}

export async function request(options) {
  if (env.isDevelopment) {
    const mocked = await matchMock(options)
    if (mocked.matched) return mocked.data
  }

  return normalizeResult(await uni.request(options))
}
