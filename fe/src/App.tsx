import { useState, useEffect } from 'react'
import { TransferForm } from './components/TransferForm'
import { TransactionHistory } from './components/TransactionHistory'
import type { Transaction } from './types'
import * as api from './services/api'

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  // Load transactions from backend on mount
  useEffect(() => {
    fetchTransactionHistory()
  }, [])

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true)
      const history = await api.getTransactionHistory()
      setTransactions(history)
      setError('')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error loading transaction history:', err)
      setError('Failed to load transaction history from server.')
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionComplete = (transaction: Transaction) => {
    // Add new transaction to the beginning of the list
    setTransactions((prev) => [transaction, ...prev])

    // Show success message
    const successMsg = document.createElement('div')
    successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
    successMsg.textContent = 'Transaction simulated successfully!'
    document.body.appendChild(successMsg)

    setTimeout(() => {
      successMsg.remove()
    }, 3000)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header */}
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-blue-600 rounded-lg p-2'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Money Transfer Simulator</h1>
              <p className='text-sm text-gray-600'>Japan to Vietnam</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {error && (
          <div className='mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg'>
            <p className='font-semibold'>⚠️ Backend Connection Issue</p>
            <p className='text-sm'>{error}</p>
            <p className='text-sm mt-2'>Make sure the backend server is running at http://localhost:8080</p>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Transfer Form */}
          <div>
            <TransferForm onTransactionComplete={handleTransactionComplete} />
          </div>

          {/* Right Column - Transaction History */}
          <div>
            {loading ? (
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                </div>
              </div>
            ) : (
              <TransactionHistory transactions={transactions} />
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className='mt-8 bg-white rounded-lg shadow-sm p-6'>
          <h3 className='font-semibold text-gray-800 mb-2'>Important Notes:</h3>
          <ul className='text-sm text-gray-600 space-y-1 list-disc list-inside'>
            <li>This is a simulation only - no real money transfers occur</li>
            <li>Exchange rates are fetched in real-time from backend API</li>
            <li>All calculations are performed on the backend server</li>
            <li>Transaction history is public and stored in the database</li>
            <li>Minimum transfer amount is ¥100</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className='mt-12 pb-8 text-center text-sm text-gray-600'>
        <p>© 2026 Money Transfer Simulator - For demonstration purposes only</p>
      </footer>
    </div>
  )
}

export default App
