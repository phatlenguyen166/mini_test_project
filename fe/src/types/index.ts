export interface Transaction {
  id: string
  amountSentJPY: number
  amountReceivedVND: number
  exchangeRate: number
  transferFee: number
  timestamp: string
}

export interface ExchangeRateResponse {
  success: boolean
  timestamp: number
  base: string
  date: string
  rates: {
    VND: number
    [key: string]: number
  }
}
