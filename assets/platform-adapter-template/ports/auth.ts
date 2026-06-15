import type { CapabilityResult } from '../capability-port'

export interface AuthCredential {
  provider: 'h5' | 'weixin'
  code: string
  redirectUri?: string
}

export interface AuthEntryPort {
  acquireCredential: () => Promise<CapabilityResult<AuthCredential>>
}
