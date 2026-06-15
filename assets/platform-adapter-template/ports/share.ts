import type { CapabilityResult } from '../capability-port'

export interface SharePayload {
  title: string
  path: string
  imageUrl?: string
}

export interface SharePort {
  share: (payload: SharePayload) => Promise<CapabilityResult<void>>
}
