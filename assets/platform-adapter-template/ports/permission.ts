import type { CapabilityResult } from '../capability-port'

export type PermissionName = 'camera' | 'location' | 'album' | 'microphone'

export interface PermissionPort {
  request: (permission: PermissionName) => Promise<CapabilityResult<void>>
  openSettings: () => Promise<CapabilityResult<void>>
}
