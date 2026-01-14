import { useState, useEffect } from 'react'
import { TransferForm } from './components/TransferForm'
import { TransactionHistory } from './components/TransactionHistory'
import type { Transaction } from './types'


function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTransactions(parsed)
      } catch (error) {
        console.error('Error loading transactions:', error)
      }
    }
  }, [])

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(transactions))
    }
  }, [transactions])

  const handleTransactionComplete = (transaction: Transaction) => {
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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Transfer Form */}
          <div>
            <TransferForm onTransactionComplete={handleTransactionComplete} />
          </div>

          {/* Right Column - Transaction History */}
          <div>
            <TransactionHistory transactions={transactions} />
          </div>
        </div>

        {/* Footer Info */}
        <div className='mt-8 bg-white rounded-lg shadow-sm p-6'>
          <h3 className='font-semibold text-gray-800 mb-2'>Important Notes:</h3>
          <ul className='text-sm text-gray-600 space-y-1 list-disc list-inside'>
            <li>This is a simulation only - no real money transfers occur</li>
            <li>Exchange rates are fetched in real-time from exchangerate-api.com</li>
            <li>All transaction history is public and stored locally</li>
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
