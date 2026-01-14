import { ExchangeRateResponse } from '../types'

const API_KEY = 'c77f91c95b9b0bb47d1e7e7a'
const BASE_URL = 'https://v6.exchangerate-api.com/v6'

export const getExchangeRate = async (): Promise<number> => {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/latest/JPY`)

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate')
    }

    const data: ExchangeRateResponse = await response.json()

    if (!data.success && !data.rates) {
      throw new Error('Invalid response from exchange rate API')
    }

    return data.rates.VND
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    // Fallback to approximate rate if API fails
    return 171.5 // Approximate JPY to VND rate
  }
}
