export type CapabilityErrorCode =
  | 'unsupported'
  | 'denied'
  | 'cancelled'
  | 'failed'

export interface CapabilityError {
  code: CapabilityErrorCode
  message: string
  cause?: unknown
}

export type CapabilityResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: CapabilityError }

export function capabilitySuccess<T>(value: T): CapabilityResult<T> {
  return { ok: true, value }
}

export function capabilityFailure(
  code: CapabilityErrorCode,
  message: string,
  cause?: unknown,
): CapabilityResult<never> {
  return { ok: false, error: { code, message, cause } }
}
