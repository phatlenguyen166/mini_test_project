import { useState, useEffect } from 'react'

import {
  calculateTransferFee,
  convertJPYtoVND,
  convertVNDtoJPY,
  formatCurrency,
  formatNumber
} from '../utils/calculations'
import { getExchangeRate } from '../utils/exchangeRateService'
import type { Transaction } from '../types'

interface TransferFormProps {
  onTransactionComplete: (transaction: Transaction) => void
}

export const TransferForm = ({ onTransactionComplete }: TransferFormProps) => {
  const [jpyAmount, setJpyAmount] = useState<string>('')
  const [vndAmount, setVndAmount] = useState<string>('')
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeInput, setActiveInput] = useState<'JPY' | 'VND'>('JPY')

  useEffect(() => {
    fetchExchangeRate()
  }, [])

  const fetchExchangeRate = async () => {
    try {
      setLoading(true)
      const rate = await getExchangeRate()
      setExchangeRate(rate)
      setError('')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to fetch exchange rate. Using fallback rate.')
      setExchangeRate(171.5)
    } finally {
      setLoading(false)
    }
  }

  const handleJPYChange = (value: string) => {
    setActiveInput('JPY')
    const sanitized = value.replace(/[^0-9]/g, '')
    setJpyAmount(sanitized)

    if (sanitized && exchangeRate > 0) {
      const jpyNum = parseFloat(sanitized)
      const vndNum = convertJPYtoVND(jpyNum, exchangeRate)
      setVndAmount(vndNum.toString())
    } else {
      setVndAmount('')
    }
  }

  const handleVNDChange = (value: string) => {
    setActiveInput('VND')
    const sanitized = value.replace(/[^0-9]/g, '')
    setVndAmount(sanitized)

    if (sanitized && exchangeRate > 0) {
      const vndNum = parseFloat(sanitized)
      const jpyNum = convertVNDtoJPY(vndNum, exchangeRate)
      setJpyAmount(jpyNum.toString())
    } else {
      setJpyAmount('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!jpyAmount || parseFloat(jpyAmount) < 100) {
      setError('Minimum transfer amount is ¥100')
      return
    }

    const jpyNum = parseFloat(jpyAmount)
    const vndNum = parseFloat(vndAmount)
    const fee = calculateTransferFee(jpyNum)

    const transaction: Transaction = {
      id: Date.now().toString(),
      amountSentJPY: jpyNum,
      amountReceivedVND: vndNum,
      exchangeRate,
      transferFee: fee,
      timestamp: new Date().toISOString()
    }

    onTransactionComplete(transaction)

    // Reset form
    setJpyAmount('')
    setVndAmount('')
    setError('')
  }

  const jpyNum = jpyAmount ? parseFloat(jpyAmount) : 0
  const transferFee = jpyNum >= 100 ? calculateTransferFee(jpyNum) : 0
  const totalCost = jpyNum + transferFee

  if (loading) {
    return (
      <div className='bg-white rounded-lg shadow-lg p-8'>
        <div className='flex items-center justify-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow-lg p-8'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>International Money Transfer</h2>
        <p className='text-gray-600'>Japan (JPY) → Vietnam (VND)</p>
        <div className='mt-2 flex items-center gap-2'>
          <span className='text-sm text-gray-500'>Exchange Rate:</span>
          <span className='text-sm font-semibold text-green-600'>1 JPY = {formatNumber(exchangeRate)} VND</span>
          <button onClick={fetchExchangeRate} className='ml-2 text-blue-600 hover:text-blue-700 text-sm underline'>
            Refresh
          </button>
        </div>
      </div>

      {error && <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg'>{error}</div>}

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* JPY Input */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>You Send (JPY)</label>
          <div className='relative'>
            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg'>¥</span>
            <input
              type='text'
              value={jpyAmount}
              onChange={(e) => handleJPYChange(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg'
              placeholder='0'
            />
          </div>
          <p className='mt-1 text-xs text-gray-500'>Minimum: ¥100</p>
        </div>

        {/* Exchange Rate Display */}
        <div className='flex items-center justify-center'>
          <div className='bg-gray-100 rounded-full p-3'>
            <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
            </svg>
          </div>
        </div>

        {/* VND Input */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Recipient Receives (VND)</label>
          <div className='relative'>
            <input
              type='text'
              value={vndAmount}
              onChange={(e) => handleVNDChange(e.target.value)}
              className='w-full pl-4 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg'
              placeholder='0'
            />
            <span className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg'>₫</span>
          </div>
        </div>

        {/* Fee Breakdown */}
        {jpyNum >= 100 && (
          <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
            <h3 className='font-semibold text-gray-800 mb-3'>Summary</h3>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Transfer Amount:</span>
              <span className='font-medium'>{formatCurrency(jpyNum, 'JPY')}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Transfer Fee:</span>
              <span className='font-medium'>{formatCurrency(transferFee, 'JPY')}</span>
            </div>
            <div className='border-t pt-2 flex justify-between font-semibold'>
              <span className='text-gray-800'>Total Cost:</span>
              <span className='text-blue-600'>{formatCurrency(totalCost, 'JPY')}</span>
            </div>
            <div className='border-t pt-2 flex justify-between font-semibold'>
              <span className='text-gray-800'>Recipient Gets:</span>
              <span className='text-green-600'>{formatCurrency(parseFloat(vndAmount || '0'), 'VND')}</span>
            </div>
          </div>
        )}

        {/* Fee Table */}
        <div className='bg-blue-50 rounded-lg p-4'>
          <h4 className='text-sm font-semibold text-blue-900 mb-2'>Transfer Fee Table</h4>
          <div className='text-xs text-blue-800 space-y-1'>
            <div className='flex justify-between'>
              <span>¥100 – ¥10,000:</span>
              <span className='font-medium'>¥100</span>
            </div>
            <div className='flex justify-between'>
              <span>¥10,001 – ¥50,000:</span>
              <span className='font-medium'>¥400</span>
            </div>
            <div className='flex justify-between'>
              <span>¥50,001 – ¥100,000:</span>
              <span className='font-medium'>¥700</span>
            </div>
            <div className='flex justify-between'>
              <span>Greater than ¥100,000:</span>
              <span className='font-medium'>¥1,000</span>
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={!jpyAmount || jpyNum < 100}
          className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
        >
          Simulate Transfer
        </button>
      </form>
    </div>
  )
}
