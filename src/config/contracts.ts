// Contract addresses configuration
// Update these addresses based on your deployment network

export const CONTRACT_ADDRESSES = {
  // Pyth Oracle addresses
  PYTH_ORACLE: {
    // Sepolia testnet - replace with actual deployed address
    SEPOLIA: '0x...',
    // Mainnet - replace with actual deployed address
    MAINNET: '0x...',
  },
  
  // Lens addresses for account queries
  LENS: {
    // Sepolia testnet - replace with actual deployed address
    SEPOLIA: '0x...',
    // Mainnet - replace with actual deployed address
    MAINNET: '0x...',
  },
  
  // EVC (Ethereum Virtual Computer) addresses
  EVC: {
    // Sepolia testnet - replace with actual deployed address
    SEPOLIA: '0x...',
    // Mainnet - replace with actual deployed address
    MAINNET: '0x...',
  },
  
  // Example vault addresses
  VAULTS: {
    // Example vault on Sepolia - replace with actual vault address
    SEPOLIA_EXAMPLE: '0x...',
    // Example vault on Mainnet - replace with actual vault address
    MAINNET_EXAMPLE: '0x...',
  }
}

// Price feed IDs for different assets
export const PRICE_FEED_IDS = {
  // ETH/USD price feed
  ETH_USD: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  // BTC/USD price feed
  BTC_USD: '0xe62df6c8b4c85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  // USDC/USD price feed
  USDC_USD: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
}

// Network configuration
export const NETWORKS = {
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/your-project-id',
  },
  MAINNET: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/your-project-id',
  },
}

// Helper function to get contract addresses for current network
export function getContractAddresses(chainId: number) {
  switch (chainId) {
    case NETWORKS.SEPOLIA.chainId:
      return {
        pythOracle: CONTRACT_ADDRESSES.PYTH_ORACLE.SEPOLIA,
        lens: CONTRACT_ADDRESSES.LENS.SEPOLIA,
        evc: CONTRACT_ADDRESSES.EVC.SEPOLIA,
      }
    case NETWORKS.MAINNET.chainId:
      return {
        pythOracle: CONTRACT_ADDRESSES.PYTH_ORACLE.MAINNET,
        lens: CONTRACT_ADDRESSES.LENS.MAINNET,
        evc: CONTRACT_ADDRESSES.EVC.MAINNET,
      }
    default:
      throw new Error(`Unsupported network with chainId: ${chainId}`)
  }
} 