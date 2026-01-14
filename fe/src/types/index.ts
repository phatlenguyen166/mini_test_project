// Request types matching backend API
export type InputMode = 'JPY_INPUT' | 'VND_INPUT'

export interface TransferRequest {
  input_mode: InputMode
  send_amount_jpy?: number
  receive_amount_vnd?: number
}

// Response types matching backend API
export interface TransferPreviewResponse {
  send_amount_jpy: number
  receive_amount_vnd: number
  fee_jpy: number
  rate_jpy_to_vnd: number
  net_amount_jpy: number
}

export interface Transaction {
  id: number
  created_at: string
  send_amount_jpy: number
  receive_amount_vnd: number
  fee_jpy: number
  rate_jpy_to_vnd: number
  input_mode: InputMode
}

export interface ExchangeRateResponse {
  result: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conversion_rates: any
  base: string
  target: string
  rate: number
  description: string
}

export interface FeeTier {
  min_amount: number
  max_amount: number | string
  fee: number
}

export interface FeeStructureResponse {
  currency: string
  tiers: FeeTier[]
}

export interface FeeCalculationResponse {
  amount: number
  fee: number
  currency: string
}
