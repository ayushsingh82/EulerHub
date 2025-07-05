'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, usePublicClient, useChainId } from 'wagmi'
import { simulateBatchWithPyth, fetchPythPriceData, AccountLiquidity } from '@/utils/pythUtils'
import { formatEther } from 'viem'
import { getContractAddresses } from '@/config/contracts'

const PythPage = () => {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const chainId = useChainId()
  
  const [loading, setLoading] = useState(false)
  const [accountLiquidity, setAccountLiquidity] = useState<AccountLiquidity | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [vaultAddress, setVaultAddress] = useState('')
  const [priceData, setPriceData] = useState<Record<string, unknown> | null>(null)
  const [contractStatus, setContractStatus] = useState<{
    pythOracle: boolean
    lens: boolean
    evc: boolean
  }>({ pythOracle: false, lens: false, evc: false })

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check contract addresses when chainId changes
  useEffect(() => {
    if (mounted && chainId) {
      try {
        const addresses = getContractAddresses(chainId)
        setContractStatus({
          pythOracle: addresses.pythOracle !== '0x...',
          lens: addresses.lens !== '0x...',
          evc: addresses.evc !== '0x...'
        })
      } catch (err) {
        setContractStatus({ pythOracle: false, lens: false, evc: false })
      }
    }
  }, [mounted, chainId])

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

    if (!contractStatus.pythOracle || !contractStatus.lens || !contractStatus.evc) {
      setError('Contract addresses not configured for this network. Please check the configuration.')
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

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-300"></div>
            <span className="ml-3 text-gray-400">Loading...</span>
          </div>
        </div>
      </div>
    )
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
          <div className="flex items-center space-x-4 mb-4">
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
            <div className="text-sm text-gray-400 mb-4">
              Network: Chain ID {chainId}
            </div>
          )}
          
          {/* Contract Status */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-3">Contract Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${contractStatus.pythOracle ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-300">Pyth Oracle</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${contractStatus.lens ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-300">Lens</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${contractStatus.evc ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-300">EVC</span>
              </div>
            </div>
            {(!contractStatus.pythOracle || !contractStatus.lens || !contractStatus.evc) && (
              <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  ⚠️ Some contracts are not configured for this network. Please update the contract addresses in the configuration.
                </p>
              </div>
            )}
          </div>
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
              disabled={loading || !isConnected || !vaultAddress || !contractStatus.pythOracle || !contractStatus.lens || !contractStatus.evc}
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
          
          {/* Setup Instructions */}
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-300 mb-3">Setup Required</h3>
            <p className="text-gray-300 text-sm mb-3">
              To use this feature, you need to configure the contract addresses in <code className="bg-gray-700 px-1 rounded">src/config/contracts.ts</code>:
            </p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Deploy Pyth Oracle contract and update <code className="bg-gray-700 px-1 rounded">PYTH_ORACLE</code> addresses</li>
              <li>• Deploy Lens contract and update <code className="bg-gray-700 px-1 rounded">LENS</code> addresses</li>
              <li>• Deploy EVC contract and update <code className="bg-gray-700 px-1 rounded">EVC</code> addresses</li>
              <li>• Replace <code className="bg-gray-700 px-1 rounded">0x...</code> with actual deployed contract addresses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PythPage