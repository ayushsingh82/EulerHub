'use client'

import React, { useState, useEffect } from 'react'
import { useChainId } from 'wagmi'
import {
  fetchSingleAssetPrice,
  fetchMultipleAssetPrices,
  fetchCommonAssetPrices,
  formatPriceData,
  calculatePriceDifference,
  COMMON_ASSETS,
  NETWORKS
} from '@/utils/eulerPriceUtils'

const OffchainPricePage = () => {
  const chainId = useChainId()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [priceData, setPriceData] = useState<any[]>([])
  const [customAssetAddress, setCustomAssetAddress] = useState('')
  const [multipleAssetAddresses, setMultipleAssetAddresses] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState(chainId || 1)

  // Auto-fetch common assets on component mount
  useEffect(() => {
    if (selectedNetwork) {
      handleFetchCommonAssets()
    }
  }, [selectedNetwork])

  const handleFetchCommonAssets = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCommonAssetPrices(selectedNetwork)
      const formattedData = formatPriceData(data)
      setPriceData(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch common asset prices')
    } finally {
      setLoading(false)
    }
  }

  const handleFetchSingleAsset = async () => {
    if (!customAssetAddress.trim()) {
      setError('Please enter an asset address')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchSingleAssetPrice(customAssetAddress.trim(), selectedNetwork)
      const formattedData = formatPriceData(data)
      setPriceData(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch single asset price')
    } finally {
      setLoading(false)
    }
  }

  const handleFetchMultipleAssets = async () => {
    if (!multipleAssetAddresses.trim()) {
      setError('Please enter asset addresses')
      return
    }

    const addresses = multipleAssetAddresses
      .split(',')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0)

    if (addresses.length === 0) {
      setError('Please enter valid asset addresses')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchMultipleAssetPrices(addresses, selectedNetwork)
      const formattedData = formatPriceData(data)
      setPriceData(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch multiple asset prices')
    } finally {
      setLoading(false)
    }
  }

  const handleFetchWSTETHWETH = async () => {
    setLoading(true)
    setError(null)
    try {
      const addresses = [
        '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0', // WSTETH
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'  // WETH
      ]
      const data = await fetchMultipleAssetPrices(addresses, selectedNetwork)
      const formattedData = formatPriceData(data)
      setPriceData(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch WSTETH/WETH prices')
    } finally {
      setLoading(false)
    }
  }

  const getNetworkName = (chainId: number) => {
    const network = Object.values(NETWORKS).find(n => n.chainId === chainId)
    return network?.name || `Chain ID ${chainId}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black py-20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Off-Chain Price Feeds
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time market prices from Euler Finance API for accurate portfolio valuations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Network Selection */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Network Configuration</h2>
          <div className="flex items-center space-x-4">
            <label className="text-gray-300">Network:</label>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Ethereum Mainnet</option>
              <option value={11155111}>Sepolia Testnet</option>
            </select>
            <span className="text-sm text-gray-400">
              Current: {getNetworkName(selectedNetwork)}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={handleFetchCommonAssets}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Fetching...' : 'Fetch Common Assets'}
            </button>
            
            <button
              onClick={handleFetchWSTETHWETH}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Fetching...' : 'Fetch WSTETH/WETH'}
            </button>
          </div>
        </div>

        {/* Single Asset Query */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Single Asset Query</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Asset Address
              </label>
              <input
                type="text"
                value={customAssetAddress}
                onChange={(e) => setCustomAssetAddress(e.target.value)}
                placeholder="0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleFetchSingleAsset}
              disabled={loading || !customAssetAddress.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Fetching...' : 'Fetch Single Asset'}
            </button>
          </div>
        </div>

        {/* Multiple Assets Query */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Multiple Assets Query</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Asset Addresses (comma-separated)
              </label>
              <textarea
                value={multipleAssetAddresses}
                onChange={(e) => setMultipleAssetAddresses(e.target.value)}
                placeholder="0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0,0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleFetchMultipleAssets}
              disabled={loading || !multipleAssetAddresses.trim()}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Fetching...' : 'Fetch Multiple Assets'}
            </button>
          </div>
        </div>

        {/* Price Results */}
        {priceData.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Price Results</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 px-4 text-gray-300 font-semibold">Symbol</th>
                    <th className="py-3 px-4 text-gray-300 font-semibold">Price (USD)</th>
                    <th className="py-3 px-4 text-gray-300 font-semibold">Address</th>
                    <th className="py-3 px-4 text-gray-300 font-semibold">Source</th>
                    <th className="py-3 px-4 text-gray-300 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {priceData.map((asset, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="py-3 px-4 text-white font-semibold">{asset.symbol}</td>
                      <td className="py-3 px-4 text-green-400 font-mono">{asset.priceFormatted}</td>
                      <td className="py-3 px-4 text-gray-300 font-mono text-sm">
                        {asset.address.slice(0, 6)}...{asset.address.slice(-4)}
                      </td>
                      <td className="py-3 px-4 text-blue-400">{asset.source}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{asset.timestampFormatted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Information Section */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Why Use Off-Chain Prices?</h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white">Real-Time Market Data</h3>
                <p>Get current market prices that may differ from on-chain oracle prices due to update delays</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white">Accurate Portfolio Valuation</h3>
                <p>Calculate real-time market value of collateral positions for better risk assessment</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white">Analytics & Risk Management</h3>
                <p>Use market-reflective prices for analytics, risk assessment, and user interface displays</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">API Endpoint</h3>
            <p className="text-gray-300 mb-2">
              <code className="bg-gray-700 px-2 py-1 rounded text-sm">
                https://app.euler.finance/api/v1/price?chainId={selectedNetwork}&assets=ASSET_ADDRESS
              </code>
            </p>
            <p className="text-sm text-gray-400">
              The API supports single and multiple asset queries with comma-separated addresses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OffchainPricePage