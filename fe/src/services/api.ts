import axios from 'axios'
import type {
  TransferRequest,
  TransferPreviewResponse,
  Transaction,
  ExchangeRateResponse,
  FeeStructureResponse,
  FeeCalculationResponse
} from '../types'

const API_BASE_URL = 'http://localhost:8080/api/transfer'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 1. Preview transfer calculation (no save)
export const previewTransfer = async (request: TransferRequest): Promise<TransferPreviewResponse> => {
  const response = await api.post<TransferPreviewResponse>('/preview', request)
  return response.data
}

// 2. Create transfer simulation (save to history)
export const simulateTransfer = async (request: TransferRequest): Promise<Transaction> => {
  const response = await api.post<Transaction>('/simulate', request)
  return response.data
}

// 3. Get all transaction history
export const getTransactionHistory = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>('/history')
  return response.data
}

// 4. Get single transaction by ID
export const getTransactionById = async (id: number): Promise<Transaction> => {
  const response = await api.get<Transaction>(`/history/${id}`)
  return response.data
}

// 5. Get current exchange rate
export const getExchangeRate = async (): Promise<ExchangeRateResponse> => {
  const response = await api.get<ExchangeRateResponse>('/exchange-rate')
  return response.data
}

// 6. Get fee structure
export const getFeeStructure = async (): Promise<FeeStructureResponse> => {
  const response = await api.get<FeeStructureResponse>('/fee-structure')
  return response.data
}

// 7. Calculate fee for specific amount
export const calculateFee = async (amount: number): Promise<FeeCalculationResponse> => {
  const response = await api.get<FeeCalculationResponse>('/calculate-fee', {
    params: { amount }
  })
  return response.data
}

export default api
