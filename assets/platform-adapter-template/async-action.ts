import { computed, ref, shallowRef } from 'vue'

export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled'

export function useAsyncAction<T, TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<T>,
) {
  let executionId = 0
  const status = ref<AsyncStatus>('idle')
  const data = shallowRef<T>()
  const error = shallowRef<unknown>()

  const isPending = computed(() => status.value === 'pending')

  async function execute(...args: TArgs) {
    if (isPending.value) return

    const currentExecution = ++executionId
    status.value = 'pending'
    error.value = undefined

    try {
      const value = await action(...args)
      if (currentExecution !== executionId) return
      data.value = value
      status.value = 'success'
      return data.value
    }
    catch (cause) {
      if (currentExecution !== executionId) return
      error.value = cause
      status.value = 'error'
      throw cause
    }
  }

  function markCancelled() {
    if (!isPending.value) return
    executionId += 1
    status.value = 'cancelled'
  }

  function reset() {
    executionId += 1
    status.value = 'idle'
    data.value = undefined
    error.value = undefined
  }

  return { status, data, error, isPending, execute, markCancelled, reset }
}
