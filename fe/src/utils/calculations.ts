/**
 * Calculate transfer fee based on JPY amount
 *
 * Fee Table:
 * ¥100 – ¥10,000: ¥100
 * ¥10,001 – ¥50,000: ¥400
 * ¥50,001 – ¥100,000: ¥700
 * Greater than ¥100,000: ¥1,000
 */
export const calculateTransferFee = (amountJPY: number): number => {
  if (amountJPY < 100) {
    return 0
  } else if (amountJPY <= 10000) {
    return 100
  } else if (amountJPY <= 50000) {
    return 400
  } else if (amountJPY <= 100000) {
    return 700
  } else {
    return 1000
  }
}

/**
 * Convert JPY to VND
 */
export const convertJPYtoVND = (amountJPY: number, exchangeRate: number): number => {
  return Math.round(amountJPY * exchangeRate)
}

/**
 * Convert VND to JPY
 */
export const convertVNDtoJPY = (amountVND: number, exchangeRate: number): number => {
  return Math.round(amountVND / exchangeRate)
}

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: 'JPY' | 'VND'): string => {
  const formatted = formatNumber(amount)
  return currency === 'JPY' ? `¥${formatted}` : `${formatted} ₫`
}
