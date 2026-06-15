import type { CapabilityResult } from '../capability-port'

export interface UploadCandidate {
  path: string
  name?: string
  size?: number
  mimeType?: string
}

export interface UploadTask<T> {
  result: Promise<CapabilityResult<T>>
  cancel: () => void
  onProgress: (listener: (percentage: number) => void) => () => void
}

export interface UploadPort<T> {
  upload: (file: UploadCandidate) => UploadTask<T>
}
