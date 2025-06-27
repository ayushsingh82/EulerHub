// Euler Price API integration utilities

export interface EulerPriceData {
  [assetAddress: string]: {
    source: string
    address: string
    symbol: string
    price: number
    timestamp: number
  }
}

export interface EulerPriceResponse {
  [assetAddress: string]: {
    source: string
    address: string
    symbol: string
    price: number
    timestamp: number
  }
  countryCode: string
  isProxyOrVpn: string
  is_vpn: string
}

// Common asset addresses
export const COMMON_ASSETS = {
  // Ethereum Mainnet
  MAINNET: {
    WSTETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC: '0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8C8',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  },
  // Sepolia Testnet (example addresses - replace with actual)
  SEPOLIA: {
    WETH: '0x...',
    USDC: '0x...',
    DAI: '0x...',
  }
}

// Network configuration
export const NETWORKS = {
  MAINNET: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    apiUrl: 'https://app.euler.finance/api/v1/price'
  },
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    apiUrl: 'https://app.euler.finance/api/v1/price'
  }
}

/**
 * Fetch price data for a single asset
 */
export async function fetchSingleAssetPrice(
  assetAddress: string,
  chainId: number = 1
): Promise<EulerPriceData> {
  try {
    const network = Object.values(NETWORKS).find(n => n.chainId === chainId)
    if (!network) {
      throw new Error(`Unsupported network with chainId: ${chainId}`)
    }

    const url = `${network.apiUrl}?chainId=${chainId}&assets=${assetAddress}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data: EulerPriceResponse = await response.json()
    
    // Filter out non-asset properties
    const { countryCode, isProxyOrVpn, is_vpn, ...assetData } = data
    return assetData
  } catch (error) {
    console.error('Error fetching single asset price:', error)
    throw error
  }
}

/**
 * Fetch price data for multiple assets
 */
export async function fetchMultipleAssetPrices(
  assetAddresses: string[],
  chainId: number = 1
): Promise<EulerPriceData> {
  try {
    const network = Object.values(NETWORKS).find(n => n.chainId === chainId)
    if (!network) {
      throw new Error(`Unsupported network with chainId: ${chainId}`)
    }

    const assetsParam = assetAddresses.join(',')
    const url = `${network.apiUrl}?chainId=${chainId}&assets=${assetsParam}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data: EulerPriceResponse = await response.json()
    
    // Filter out non-asset properties
    const { countryCode, isProxyOrVpn, is_vpn, ...assetData } = data
    return assetData
  } catch (error) {
    console.error('Error fetching multiple asset prices:', error)
    throw error
  }
}

/**
 * Get common asset prices for a network
 */
export async function fetchCommonAssetPrices(chainId: number = 1): Promise<EulerPriceData> {
  const networkKey = chainId === 1 ? 'MAINNET' : 'SEPOLIA'
  const assets = COMMON_ASSETS[networkKey as keyof typeof COMMON_ASSETS]
  
  if (!assets) {
    throw new Error(`No common assets configured for chainId: ${chainId}`)
  }
  
  const assetAddresses = Object.values(assets).filter(addr => addr !== '0x...')
  
  if (assetAddresses.length === 0) {
    throw new Error(`No valid asset addresses configured for chainId: ${chainId}`)
  }
  
  return fetchMultipleAssetPrices(assetAddresses, chainId)
}

/**
 * Format price data for display
 */
export function formatPriceData(priceData: EulerPriceData) {
  return Object.entries(priceData).map(([address, data]) => ({
    address,
    symbol: data.symbol,
    price: data.price,
    priceFormatted: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(data.price),
    timestamp: data.timestamp,
    timestampFormatted: new Date(data.timestamp * 1000).toLocaleString(),
    source: data.source
  }))
}

/**
 * Calculate price difference between on-chain and off-chain prices
 */
export function calculatePriceDifference(
  offchainPrice: number,
  onchainPrice: number
): {
  difference: number
  percentage: number
  isHigher: boolean
} {
  const difference = offchainPrice - onchainPrice
  const percentage = (difference / onchainPrice) * 100
  const isHigher = difference > 0
  
  return {
    difference,
    percentage: Math.abs(percentage),
    isHigher
  }
} 