'use client'

import React, { useState, useEffect } from 'react'
import vaultData from './data.json'

interface VaultInfo {
  name: string
  description?: string
  entity: string | string[]
  url?: string
  vaults: string[]
  isGovernanceLimited?: boolean
}

interface VaultData {
  [key: string]: VaultInfo
}

const VaultAddressesPage = () => {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEntity, setSelectedEntity] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedVaults, setExpandedVaults] = useState<Set<string>>(new Set())

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Extract unique entities and categories
  const entities = Array.from(new Set(
    Object.values(vaultData).map(vault => 
      Array.isArray(vault.entity) ? vault.entity[0] : vault.entity
    )
  )).sort()

  const categories = [
    'all',
    'euler-prime',
    'euler-yield', 
    'euler-rwa',
    'eulswap',
    'frontier',
    'stablecoin-maxi',
    're7-labs-basic',
    'apostro',
    'alterscope',
    'idle-credit-vaults',
    'mev-capital-weth',
    'swaap-labs',
    'resolv',
    'tulipa',
    'usual',
    'openeden',
    'zerolend',
    'k3-liquity-hub',
    'keyring'
  ]

  // Filter vaults based on search and filters
  const filteredVaults = Object.entries(vaultData).filter(([key, vault]) => {
    const vaultInfo = vault as VaultInfo
    const matchesSearch = 
      vaultInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vaultInfo.description && vaultInfo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      vaultInfo.vaults.some(addr => addr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(vaultInfo.entity) ? vaultInfo.entity.join(' ').toLowerCase() : vaultInfo.entity.toLowerCase()).includes(searchTerm.toLowerCase())

    const matchesEntity = selectedEntity === 'all' || 
      (Array.isArray(vaultInfo.entity) ? vaultInfo.entity.includes(selectedEntity) : vaultInfo.entity === selectedEntity)

    const matchesCategory = selectedCategory === 'all' || key.includes(selectedCategory)

    return matchesSearch && matchesEntity && matchesCategory
  })

  const toggleVaultExpansion = (vaultKey: string) => {
    const newExpanded = new Set(expandedVaults)
    if (newExpanded.has(vaultKey)) {
      newExpanded.delete(vaultKey)
    } else {
      newExpanded.add(vaultKey)
    }
    setExpandedVaults(newExpanded)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getEntityDisplayName = (entity: string | string[]) => {
    if (Array.isArray(entity)) {
      return entity.join(', ')
    }
    return entity
  }

  const getCategoryDisplayName = (key: string) => {
    const categoryMap: { [key: string]: string } = {
      'euler-prime': 'Euler Prime',
      'euler-yield': 'Euler Yield',
      'euler-rwa': 'Euler RWA',
      'eulswap': 'EUL Swap',
      'frontier': 'Frontier Markets',
      'stablecoin-maxi': 'Stablecoin Maxi',
      're7-labs-basic': 'Re7 Labs',
      'apostro': 'Apostro',
      'alterscope': 'Alterscope',
      'idle-credit-vaults': 'Idle DAO',
      'mev-capital-weth': 'MEV Capital',
      'swaap-labs': 'Swaap Labs',
      'resolv': 'Resolv',
      'tulipa': 'Tulipa Capital',
      'usual': 'Usual',
      'openeden': 'OpenEden',
      'zerolend': 'ZeroLend',
      'k3-liquity-hub': 'K3 Liquity',
      'keyring': 'Keyring'
    }
    
    for (const [category, displayName] of Object.entries(categoryMap)) {
      if (key.includes(category)) {
        return displayName
      }
    }
    return 'Other'
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black py-20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-orange-300 mb-6">
              Euler Vault Addresses
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive directory of all verified vault addresses across Euler Finance markets
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-300">{Object.keys(vaultData).length}</div>
              <div className="text-gray-400">Total Markets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {Object.values(vaultData).reduce((sum, vault) => sum + vault.vaults.length, 0)}
              </div>
              <div className="text-gray-400">Total Vaults</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{entities.length}</div>
              <div className="text-gray-400">Unique Entities</div>
            </div>
                         <div>
               <div className="text-2xl font-bold text-purple-400">
                 {Object.values(vaultData).filter(vault => (vault as VaultInfo).isGovernanceLimited).length}
               </div>
               <div className="text-gray-400">Frontier Markets</div>
             </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vaults, descriptions, addresses..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Entity
              </label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Entities</option>
                {entities.map(entity => (
                  <option key={entity} value={entity}>{entity}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : getCategoryDisplayName(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredVaults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No vaults found matching your criteria</p>
            </div>
          ) : (
                         filteredVaults.map(([key, vault]) => {
               const vaultInfo = vault as VaultInfo
               return (
               <div key={key} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                 <div className="p-6">
                   <div className="flex items-start justify-between">
                     <div className="flex-1">
                       <div className="flex items-center space-x-3 mb-2">
                         <h3 className="text-xl font-bold text-white">{vaultInfo.name}</h3>
                         {vaultInfo.isGovernanceLimited && (
                           <span className="px-2 py-1 bg-yellow-900/20 border border-yellow-500 text-yellow-300 text-xs rounded">
                             Frontier Market
                           </span>
                         )}
                       </div>
                       
                       {vaultInfo.description && (
                         <p className="text-gray-300 mb-3">{vaultInfo.description}</p>
                       )}
                       
                       <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                         <span>
                           <span className="text-gray-500">Entity:</span> {getEntityDisplayName(vaultInfo.entity)}
                         </span>
                         <span>
                           <span className="text-gray-500">Vaults:</span> {vaultInfo.vaults.length}
                         </span>
                         <span>
                           <span className="text-gray-500">Category:</span> {getCategoryDisplayName(key)}
                         </span>
                       </div>

                       {vaultInfo.url && (
                         <a
                           href={vaultInfo.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm mb-3"
                         >
                           <span>View Details</span>
                           <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                           </svg>
                         </a>
                       )}
                     </div>
                    
                    <button
                      onClick={() => toggleVaultExpansion(key)}
                      className="ml-4 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg 
                        className={`w-5 h-5 transform transition-transform ${expandedVaults.has(key) ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                                 {expandedVaults.has(key) && (
                   <div className="border-t border-gray-700 p-6 bg-gray-800">
                     <h4 className="text-lg font-semibold text-white mb-4">Vault Addresses</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                       {vaultInfo.vaults.map((address, index) => (
                         <div
                           key={index}
                           className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                         >
                           <span className="font-mono text-sm text-gray-300 truncate">
                             {address}
                           </span>
                           <button
                             onClick={() => copyToClipboard(address)}
                             className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                             title="Copy address"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                             </svg>
                           </button>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             )
           })
          )}
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">About Euler Vaults</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-orange-300 mb-2">Market Types</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="text-blue-400">Euler Prime:</span> Blue chip crypto assets</li>
                <li><span className="text-blue-400">Euler Yield:</span> Tokenized yield strategies</li>
                <li><span className="text-blue-400">Euler RWA:</span> Real-world assets</li>
                <li><span className="text-yellow-400">Frontier Markets:</span> Risk-isolated, community-driven</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-300 mb-2">Key Features</h3>
              <ul className="space-y-2 text-sm">
                <li>• Verified vault addresses</li>
                <li>• Risk management by entities</li>
                <li>• Governance oversight</li>
                <li>• Community-driven markets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VaultAddressesPage
