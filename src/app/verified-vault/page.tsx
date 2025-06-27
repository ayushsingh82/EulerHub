'use client'

import React, { useState, useEffect } from 'react'
import { useChainId, usePublicClient } from 'wagmi'
import {
  getVerifiedVaults,
  isVaultVerified,
  getVerifiedVaultCount,
  getPerspectiveName,
  getPerspectiveInfo,
  checkMultipleVaults,
  getPerspectiveAddresses,
  validatePerspectiveAddress,
  formatVaultAddress,
  getVerificationBadgeColor,
  getVerificationStatusText,
  NETWORKS,
  type VerifiedVault,
  type PerspectiveInfo
} from '@/utils/verifiedVaultUtils'

const VerifiedVaultPage = () => {
  const chainId = useChainId()
  const publicClient = usePublicClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState(chainId || 1)
  const [perspectiveAddress, setPerspectiveAddress] = useState('')
  const [customVaultAddress, setCustomVaultAddress] = useState('')
  const [multipleVaultAddresses, setMultipleVaultAddresses] = useState('')
  
  // State for results
  const [perspectiveInfo, setPerspectiveInfo] = useState<PerspectiveInfo | null>(null)
  const [verifiedVaults, setVerifiedVaults] = useState<string[]>([])
  const [singleVaultResult, setSingleVaultResult] = useState<VerifiedVault | null>(null)
  const [multipleVaultResults, setMultipleVaultResults] = useState<VerifiedVault[]>([])
  const [showEmptyMessage, setShowEmptyMessage] = useState(false)

  // Auto-load perspective addresses when network changes
  useEffect(() => {
    try {
      const addresses = getPerspectiveAddresses(selectedNetwork)
      if (validatePerspectiveAddress(addresses.GOVERNED_PERSPECTIVE)) {
        setPerspectiveAddress(addresses.GOVERNED_PERSPECTIVE)
      } else if (validatePerspectiveAddress(addresses.BASE_PERSPECTIVE)) {
        setPerspectiveAddress(addresses.BASE_PERSPECTIVE)
      }
    } catch (err) {
      console.warn('No perspective addresses configured for this network')
    }
  }, [selectedNetwork])

  const handleGetVerifiedVaults = async () => {
    if (!validatePerspectiveAddress(perspectiveAddress)) {
      setError('Please enter a valid perspective contract address')
      return
    }

    setLoading(true)
    setError(null)
    setShowEmptyMessage(false)
    try {
      const vaults = await getVerifiedVaults(perspectiveAddress, selectedNetwork, publicClient)
      setVerifiedVaults(vaults)
      setPerspectiveInfo(null)
      setSingleVaultResult(null)
      setMultipleVaultResults([])
      
      // Show message if no vaults found
      if (vaults.length === 0) {
        setShowEmptyMessage(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch verified vaults')
    } finally {
      setLoading(false)
    }
  }

  const handleGetPerspectiveInfo = async () => {
    if (!validatePerspectiveAddress(perspectiveAddress)) {
      setError('Please enter a valid perspective contract address')
      return
    }

    setLoading(true)
    setError(null)
    setShowEmptyMessage(false)
    try {
      const info = await getPerspectiveInfo(perspectiveAddress, selectedNetwork, publicClient)
      setPerspectiveInfo(info)
      setVerifiedVaults([])
      setSingleVaultResult(null)
      setMultipleVaultResults([])
      
      // Show message if no vaults found
      if (info.verifiedVaults.length === 0) {
        setShowEmptyMessage(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch perspective info')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckSingleVault = async () => {
    if (!validatePerspectiveAddress(perspectiveAddress)) {
      setError('Please enter a valid perspective contract address')
      return
    }

    if (!customVaultAddress.trim()) {
      setError('Please enter a vault address')
      return
    }

    setLoading(true)
    setError(null)
    setShowEmptyMessage(false)
    try {
      const isVerified = await isVaultVerified(
        perspectiveAddress,
        customVaultAddress.trim(),
        selectedNetwork,
        publicClient
      )
      
      const perspectiveName = await getPerspectiveName(perspectiveAddress, selectedNetwork, publicClient)
      
      setSingleVaultResult({
        address: customVaultAddress.trim(),
        isVerified,
        perspectiveName
      })
      
      setVerifiedVaults([])
      setPerspectiveInfo(null)
      setMultipleVaultResults([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check vault verification')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckMultipleVaults = async () => {
    if (!validatePerspectiveAddress(perspectiveAddress)) {
      setError('Please enter a valid perspective contract address')
      return
    }

    if (!multipleVaultAddresses.trim()) {
      setError('Please enter vault addresses')
      return
    }

    const addresses = multipleVaultAddresses
      .split(',')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0)

    if (addresses.length === 0) {
      setError('Please enter valid vault addresses')
      return
    }

    setLoading(true)
    setError(null)
    setShowEmptyMessage(false)
    try {
      const results = await checkMultipleVaults(perspectiveAddress, addresses, selectedNetwork, publicClient)
      setMultipleVaultResults(results)
      setVerifiedVaults([])
      setPerspectiveInfo(null)
      setSingleVaultResult(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check multiple vaults')
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
            <h1 className="text-3xl md:text-4xl font-bold text-orange-300 mb-6">
              Verified Vaults
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Check vault verification status using Euler Perspectives for enhanced security
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
              <option value={10}>Optimism</option>
              <option value={56}>BNB Smart Chain</option>
              <option value={71}>Unichain</option>
              <option value={8453}>Base</option>
              <option value={11155111}>Sepolia Testnet</option>
            </select>
            <span className="text-sm text-gray-400">
              Current: {getNetworkName(selectedNetwork)}
            </span>
          </div>
        </div>

        {/* Perspective Contract Configuration */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Perspective Contract</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Perspective Contract Address
              </label>
              <input
                type="text"
                value={perspectiveAddress}
                onChange={(e) => setPerspectiveAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleGetVerifiedVaults}
                disabled={loading || !validatePerspectiveAddress(perspectiveAddress)}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Loading...' : 'Get Verified Vaults'}
              </button>
              <button
                onClick={handleGetPerspectiveInfo}
                disabled={loading || !validatePerspectiveAddress(perspectiveAddress)}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Loading...' : 'Get Perspective Info'}
              </button>
            </div>
          </div>
        </div>

        {/* Single Vault Check */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Check Single Vault</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vault Address
              </label>
              <input
                type="text"
                value={customVaultAddress}
                onChange={(e) => setCustomVaultAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCheckSingleVault}
              disabled={loading || !validatePerspectiveAddress(perspectiveAddress) || !customVaultAddress.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Checking...' : 'Check Verification'}
            </button>
          </div>
        </div>

        {/* Multiple Vaults Check */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Check Multiple Vaults</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vault Addresses (comma-separated)
              </label>
              <textarea
                value={multipleVaultAddresses}
                onChange={(e) => setMultipleVaultAddresses(e.target.value)}
                placeholder="0x...,0x...,0x..."
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCheckMultipleVaults}
              disabled={loading || !validatePerspectiveAddress(perspectiveAddress) || !multipleVaultAddresses.trim()}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Checking...' : 'Check Multiple Vaults'}
            </button>
          </div>
        </div>

        {/* Empty Results Message */}
        {showEmptyMessage && (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">No Verified Vaults Found</h3>
            <p className="text-yellow-300 mb-2">
              The perspective contract returned an empty list of verified vaults. This could mean:
            </p>
            <ul className="text-yellow-300 text-sm space-y-1 ml-4">
              <li>• No vaults have been verified yet on this network</li>
              <li>• The perspective contract is newly deployed and empty</li>
              <li>• The network is still in development/testing phase</li>
            </ul>
            <p className="text-yellow-300 text-sm mt-2">
              This is normal for newer networks or when the perspective system is still being populated.
            </p>
          </div>
        )}

        {/* Results Sections */}
        
        {/* Perspective Info Results */}
        {perspectiveInfo && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Perspective Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Name</div>
                <div className="text-lg font-semibold text-white">{perspectiveInfo.name}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Verified Count</div>
                <div className="text-lg font-semibold text-green-400">{perspectiveInfo.verifiedCount}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Contract Address</div>
                <div className="text-sm font-mono text-gray-300">{formatVaultAddress(perspectiveAddress)}</div>
              </div>
            </div>
            
            {perspectiveInfo.verifiedVaults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Verified Vaults</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {perspectiveInfo.verifiedVaults.map((vault, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-sm font-mono text-gray-300">{formatVaultAddress(vault)}</div>
                      <div className="text-xs text-green-400">Verified</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verified Vaults List */}
        {verifiedVaults.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Verified Vaults List</h2>
            <div className="text-sm text-gray-400 mb-4">Total: {verifiedVaults.length} vaults</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {verifiedVaults.map((vault, index) => (
                <div key={index} className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm font-mono text-gray-300">{formatVaultAddress(vault)}</div>
                  <div className="text-xs text-green-400">Verified</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Single Vault Result */}
        {singleVaultResult && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Single Vault Result</h2>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-mono text-gray-300">{formatVaultAddress(singleVaultResult.address)}</div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getVerificationBadgeColor(singleVaultResult.isVerified)}`}>
                  {getVerificationStatusText(singleVaultResult.isVerified)}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Perspective: {singleVaultResult.perspectiveName || 'Unknown'}
              </div>
            </div>
          </div>
        )}

        {/* Multiple Vaults Results */}
        {multipleVaultResults.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Multiple Vaults Results</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 px-4 text-gray-300 font-semibold">Vault Address</th>
                    <th className="py-3 px-4 text-gray-300 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {multipleVaultResults.map((vault, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="py-3 px-4 text-gray-300 font-mono text-sm">
                        {formatVaultAddress(vault.address)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getVerificationBadgeColor(vault.isVerified)}`}>
                          {getVerificationStatusText(vault.isVerified)}
                        </span>
                      </td>
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
          <h2 className="text-2xl font-bold text-white mb-4">How Perspectives Work</h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white">Vault Verification</h3>
                <p>Perspectives verify vaults through governance-approved criteria and security checks</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white">Security Assurance</h3>
                <p>Verified vaults have passed comprehensive security audits and risk assessments</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white">Trust Framework</h3>
                <p>Use verified vaults to ensure your DeFi operations meet security standards</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Key Functions</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div><code className="bg-gray-700 px-2 py-1 rounded">verifiedArray()</code> - Get all verified vaults</div>
              <div><code className="bg-gray-700 px-2 py-1 rounded">isVerified(address)</code> - Check if vault is verified</div>
              <div><code className="bg-gray-700 px-2 py-1 rounded">verifiedLength()</code> - Get total verified count</div>
              <div><code className="bg-gray-700 px-2 py-1 rounded">name()</code> - Get perspective name</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifiedVaultPage