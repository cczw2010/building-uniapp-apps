export type BootstrapStatus = 'idle' | 'pending' | 'ready' | 'error'

export interface BootstrapDependencies {
  // Restore session state and return whether a current-user request is needed.
  restoreSession: () => Promise<boolean>
  loadCurrentUser: () => Promise<void>
  clearSession: () => Promise<void>
}

/**
 * Coordinates application startup through one reusable in-flight promise.
 * Pages and route guards should await ensureReady instead of initializing auth.
 */
export function createAppBootstrap(deps: BootstrapDependencies) {
  let generation = 0
  let status: BootstrapStatus = 'idle'
  let inFlight: Promise<void> | null = null
  let lastError: unknown

  async function run() {
    if (status === 'ready') return
    if (inFlight) return inFlight

    status = 'pending'
    lastError = undefined
    const currentGeneration = generation

    const task = (async () => {
      const hasSession = await deps.restoreSession()
      if (hasSession) await deps.loadCurrentUser()
      if (currentGeneration !== generation) return
      status = 'ready'
    })()
    inFlight = task

    try {
      await task
    }
    catch (error) {
      if (currentGeneration === generation) {
        status = 'error'
        lastError = error
      }
      throw error
    }
    finally {
      if (inFlight === task) inFlight = null
    }
  }

  async function reset() {
    generation += 1
    inFlight = null
    status = 'idle'
    lastError = undefined
    await deps.clearSession()
  }

  return {
    ensureReady: run,
    reset,
    getStatus: () => status,
    getError: () => lastError,
  }
}
