import type { Transaction } from '../types'

interface TransactionHistoryProps {
  transactions: Transaction[]
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

const formatCurrency = (amount: number, currency: 'JPY' | 'VND'): string => {
  const formatted = formatNumber(amount)
  return currency === 'JPY' ? `¥${formatted}` : `${formatted} ₫`
}

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const formatDate = (isoString: string) => {
    if (!isoString) return 'N/A'

    try {
      const date = new Date(isoString)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }

      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date)
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid Date'
    }
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
                  <p className='text-xs text-gray-500'>{formatDate(transaction.created_at)}</p>
                  <p className='text-xs text-gray-400'>ID: {transaction.id}</p>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  transaction.input_mode === 'JPY_INPUT' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}
              >
                {transaction.input_mode === 'JPY_INPUT' ? 'JPY → VND' : 'VND → JPY'}
              </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Amount Sent:</span>
                  <span className='text-sm font-semibold text-gray-800'>
                    {formatCurrency(transaction.send_amount_jpy, 'JPY')}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Transfer Fee:</span>
                  <span className='text-sm font-semibold text-orange-600'>
                    {formatCurrency(transaction.fee_jpy, 'JPY')}
                  </span>
                </div>
                <div className='flex justify-between pt-2 border-t'>
                  <span className='text-sm font-semibold text-gray-800'>Total Cost:</span>
                  <span className='text-sm font-bold text-blue-600'>
                    {formatCurrency(transaction.send_amount_jpy + transaction.fee_jpy, 'JPY')}
                  </span>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Amount Received:</span>
                  <span className='text-sm font-semibold text-green-600'>
                    {formatCurrency(transaction.receive_amount_vnd, 'VND')}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Exchange Rate:</span>
                  <span className='text-sm font-semibold text-gray-800'>
                    1 JPY = {formatNumber(transaction.rate_jpy_to_vnd)} VND
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
