
import type { Transaction } from '../types'
import { formatCurrency, formatNumber } from '../utils/calculations'

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  if (transactions.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow-lg p-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Transaction History</h2>
        <p className='text-gray-500 text-center py-8'>No transactions yet. Start by simulating a transfer above.</p>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow-lg p-8'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Transaction History</h2>
      <p className='text-sm text-gray-600 mb-4'>
        Total Transactions: <span className='font-semibold'>{transactions.length}</span>
      </p>

      <div className='space-y-4'>
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200'
          >
            <div className='flex justify-between items-start mb-3'>
              <div className='flex items-center gap-2'>
                <div className='bg-green-100 rounded-full p-2'>
                  <svg className='w-5 h-5 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <div>
                  <p className='text-xs text-gray-500'>{formatDate(transaction.timestamp)}</p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Amount Sent:</span>
                  <span className='text-sm font-semibold text-gray-800'>
                    {formatCurrency(transaction.amountSentJPY, 'JPY')}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Transfer Fee:</span>
                  <span className='text-sm font-semibold text-orange-600'>
                    {formatCurrency(transaction.transferFee, 'JPY')}
                  </span>
                </div>
                <div className='flex justify-between pt-2 border-t'>
                  <span className='text-sm font-semibold text-gray-800'>Total Cost:</span>
                  <span className='text-sm font-bold text-blue-600'>
                    {formatCurrency(transaction.amountSentJPY + transaction.transferFee, 'JPY')}
                  </span>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Amount Received:</span>
                  <span className='text-sm font-semibold text-green-600'>
                    {formatCurrency(transaction.amountReceivedVND, 'VND')}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Exchange Rate:</span>
                  <span className='text-sm font-semibold text-gray-800'>
                    1 JPY = {formatNumber(transaction.exchangeRate)} VND
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
