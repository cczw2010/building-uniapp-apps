import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'

export type SessionStatus = 'unknown' | 'guest' | 'authenticated' | 'blocked'

export interface CurrentUserSummary {
  id: string
  displayName: string
  roles: string[]
  permissions: string[]
}

export const useSessionStore = defineStore('session', () => {
  const status = shallowRef<SessionStatus>('unknown')
  const token = shallowRef<string | null>(null)
  const user = shallowRef<CurrentUserSummary | null>(null)

  const isAuthenticated = computed(() => status.value === 'authenticated')

  function setGuest() {
    token.value = null
    user.value = null
    status.value = 'guest'
  }

  function setAuthenticated(nextToken: string, nextUser: CurrentUserSummary) {
    token.value = nextToken
    user.value = nextUser
    status.value = 'authenticated'
  }

  function setBlocked(nextUser: CurrentUserSummary | null = null) {
    user.value = nextUser
    status.value = 'blocked'
  }

  return {
    status,
    token,
    user,
    isAuthenticated,
    setGuest,
    setAuthenticated,
    setBlocked,
  }
})
