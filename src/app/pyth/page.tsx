'use client'

import React, { useState } from 'react'
import { useAccount, usePublicClient, useChainId } from 'wagmi'
import { simulateBatchWithPyth, fetchPythPriceData } from '@/utils/pythUtils'
import { formatEther } from 'viem'

const PythPage = () => {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const chainId = useChainId()
  
  const [loading, setLoading] = useState(false)
  const [accountLiquidity, setAccountLiquidity] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [vaultAddress, setVaultAddress] = useState('')
  const [priceData, setPriceData] = useState<any>(null)

  const handleFetchPriceData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPythPriceData()
      setPriceData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price data')
    } finally {
      setLoading(false)
    }
  }

  const handleSimulateBatch = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      return
    }

    if (!vaultAddress) {
      setError('Please enter a vault address')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const liquidity = await simulateBatchWithPyth(
        publicClient,
        address,
        vaultAddress,
        chainId
      )
      setAccountLiquidity(liquidity)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to simulate batch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black py-20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-5xl font-bold text-orange-300 mb-6">
              Pyth Price Feeds
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time price data integration with batch simulation for DeFi protocols
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Connection Status */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Connection Status</h2>
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-300">
              {isConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
            </span>
            {isConnected && (
              <span className="text-sm text-gray-400">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            )}
          </div>
          {isConnected && (
            <div className="mt-2 text-sm text-gray-400">
              Network: Chain ID {chainId}
            </div>
          )}
        </div>

        {/* Price Data Section */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Price Data</h2>
          <button
            onClick={handleFetchPriceData}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Fetching...' : 'Fetch Latest Price Data'}
          </button>
          
          {priceData && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Price Update Data:</h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(priceData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Batch Simulation Section */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Batch Simulation</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vault Address
              </label>
              <input
                type="text"
                value={vaultAddress}
                onChange={(e) => setVaultAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={handleSimulateBatch}
              disabled={loading || !isConnected || !vaultAddress}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Simulating...' : 'Simulate Batch'}
            </button>
          </div>

          {accountLiquidity && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Account Liquidity Results:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Total Collateral Value</div>
                  <div className="text-lg font-semibold text-white">
                    {formatEther(accountLiquidity.totalCollateralValue)} ETH
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Total Debt Value</div>
                  <div className="text-lg font-semibold text-white">
                    {formatEther(accountLiquidity.totalDebtValue)} ETH
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Available Borrows</div>
                  <div className="text-lg font-semibold text-white">
                    {formatEther(accountLiquidity.availableBorrows)} ETH
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Information Section */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white">Fetch Price Data</h3>
                <p>Retrieve the latest price update data from Pyth Network's Hermes API</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white">Prepare Simulation</h3>
                <p>Create a batch simulation with price update and account liquidity query</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white">Execute & Decode</h3>
                <p>Simulate the batch transaction and decode the account liquidity results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PythPage