import type { CapabilityResult } from '../capability-port'

export interface PaymentRequest {
  provider: 'h5' | 'weixin'
  payload: Record<string, unknown>
}

export interface PaymentReceipt {
  providerReference?: string
}

export interface PaymentPort {
  pay: (request: PaymentRequest) => Promise<CapabilityResult<PaymentReceipt>>
}
