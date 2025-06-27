import BasePerspectiveAbi from './BasePerspective.json'

// Contract addresses for different perspectives
export const PERSPECTIVE_CONTRACTS = {
  // Ethereum Mainnet
  MAINNET: {
    GOVERNED_PERSPECTIVE: '0xC0121817FF224a018840e4D15a864747d36e6Eb2',
    BASE_PERSPECTIVE: '0x...',     // Replace with actual base perspective address if needed
  },
  // OP Mainnet
  OPTIMISM: {
    GOVERNED_PERSPECTIVE: '0x24E9B780e9CF56B326A08C81EEAe0242F2754304',
    BASE_PERSPECTIVE: '0x...',     // Replace with actual base perspective address if needed
  },
  // BNB Mainnet
  BSC: {
    GOVERNED_PERSPECTIVE: '0x775231E5da4F548555eeE633ebf7355a83A0FC03',
    BASE_PERSPECTIVE: '0x...',     // Replace with actual base perspective address if needed
  },
  // Unichain
  UNICHAIN: {
    GOVERNED_PERSPECTIVE: '0x44d781D9f61649fACeeEC919c71C8537531df027',
    BASE_PERSPECTIVE: '0x...',     // Replace with actual base perspective address if needed
  },
  // Base
  BASE: {
    GOVERNED_PERSPECTIVE: '0xafC8545c49DF2c8216305922D9753Bf60bf8c14A',
    BASE_PERSPECTIVE: '0x...',     // Replace with actual base perspective address if needed
  },
  // Sepolia Testnet (example addresses - replace with actual)
  SEPOLIA: {
    GOVERNED_PERSPECTIVE: '0x...',
    BASE_PERSPECTIVE: '0x...',
  }
}

// Network configuration
export const NETWORKS = {
  MAINNET: {
    chainId: 1,
    name: 'Ethereum Mainnet',
  },
  OPTIMISM: {
    chainId: 10,
    name: 'Optimism',
  },
  BSC: {
    chainId: 56,
    name: 'BNB Smart Chain',
  },
  UNICHAIN: {
    chainId: 71,
    name: 'Unichain',
  },
  BASE: {
    chainId: 8453,
    name: 'Base',
  },
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
  }
}

export interface VerifiedVault {
  address: string
  isVerified: boolean
  perspectiveName?: string
}

export interface PerspectiveInfo {
  name: string
  verifiedVaults: string[]
  verifiedCount: number
}

/**
 * Get the list of all verified vaults from a perspective contract
 */
export async function getVerifiedVaults(
  perspectiveAddress: string,
  chainId: number,
  publicClient: any
): Promise<string[]> {
  try {
    console.log(`Fetching verified vaults from ${perspectiveAddress} on chain ${chainId}`)
    
    const verifiedVaults = await publicClient.readContract({
      address: perspectiveAddress as `0x${string}`,
      abi: BasePerspectiveAbi,
      functionName: 'verifiedArray',
    })

    console.log('Verified vaults result:', verifiedVaults)
    
    // Handle case where the result might be empty or null
    if (!verifiedVaults || verifiedVaults.length === 0) {
      console.log('No verified vaults found - this might be normal for new networks')
      return []
    }

    return verifiedVaults as string[]
  } catch (error) {
    console.error('Error fetching verified vaults:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('0x')) {
        throw new Error(`No verified vaults found. This could mean: 1) No vaults have been verified yet on this network, 2) The perspective contract is empty, or 3) Network connectivity issue. Original error: ${error.message}`)
      }
      if (error.message.includes('function')) {
        throw new Error(`Contract function error. Please verify the perspective contract address is correct. Original error: ${error.message}`)
      }
    }
    
    throw error
  }
}

/**
 * Check if a specific vault is verified by a perspective contract
 */
export async function isVaultVerified(
  perspectiveAddress: string,
  vaultAddress: string,
  chainId: number,
  publicClient: any
): Promise<boolean> {
  try {
    console.log(`Checking if vault ${vaultAddress} is verified on ${perspectiveAddress} (chain ${chainId})`)
    
    const isVerified = await publicClient.readContract({
      address: perspectiveAddress as `0x${string}`,
      abi: BasePerspectiveAbi,
      functionName: 'isVerified',
      args: [vaultAddress as `0x${string}`],
    })

    console.log('Verification result:', isVerified)
    return Boolean(isVerified)
  } catch (error) {
    console.error('Error checking vault verification:', error)
    throw error
  }
}

/**
 * Get the total count of verified vaults
 */
export async function getVerifiedVaultCount(
  perspectiveAddress: string,
  chainId: number,
  publicClient: any
): Promise<number> {
  try {
    console.log(`Fetching verified vault count from ${perspectiveAddress} on chain ${chainId}`)
    
    const count = await publicClient.readContract({
      address: perspectiveAddress as `0x${string}`,
      abi: BasePerspectiveAbi,
      functionName: 'verifiedLength',
    })

    console.log('Verified vault count:', count)
    return Number(count)
  } catch (error) {
    console.error('Error fetching verified vault count:', error)
    throw error
  }
}

/**
 * Get the name of a perspective contract
 */
export async function getPerspectiveName(
  perspectiveAddress: string,
  chainId: number,
  publicClient: any
): Promise<string> {
  try {
    console.log(`Fetching perspective name from ${perspectiveAddress} on chain ${chainId}`)
    
    const name = await publicClient.readContract({
      address: perspectiveAddress as `0x${string}`,
      abi: BasePerspectiveAbi,
      functionName: 'name',
    })

    console.log('Perspective name:', name)
    return String(name)
  } catch (error) {
    console.error('Error fetching perspective name:', error)
    // Return a fallback name if the name function fails
    return 'Unknown Perspective'
  }
}

/**
 * Get comprehensive information about a perspective contract
 */
export async function getPerspectiveInfo(
  perspectiveAddress: string,
  chainId: number,
  publicClient: any
): Promise<PerspectiveInfo> {
  try {
    console.log(`Fetching comprehensive perspective info from ${perspectiveAddress} on chain ${chainId}`)
    
    const [name, verifiedVaults, verifiedCount] = await Promise.all([
      getPerspectiveName(perspectiveAddress, chainId, publicClient),
      getVerifiedVaults(perspectiveAddress, chainId, publicClient),
      getVerifiedVaultCount(perspectiveAddress, chainId, publicClient)
    ])

    return {
      name,
      verifiedVaults,
      verifiedCount
    }
  } catch (error) {
    console.error('Error fetching perspective info:', error)
    throw error
  }
}

/**
 * Check multiple vaults for verification status
 */
export async function checkMultipleVaults(
  perspectiveAddress: string,
  vaultAddresses: string[],
  chainId: number,
  publicClient: any
): Promise<VerifiedVault[]> {
  try {
    console.log(`Checking ${vaultAddresses.length} vaults for verification on ${perspectiveAddress} (chain ${chainId})`)
    
    const verificationPromises = vaultAddresses.map(async (address) => {
      const isVerified = await isVaultVerified(perspectiveAddress, address, chainId, publicClient)
      return {
        address,
        isVerified
      }
    })

    const results = await Promise.all(verificationPromises)
    console.log('Multiple vault verification results:', results)
    return results
  } catch (error) {
    console.error('Error checking multiple vaults:', error)
    throw error
  }
}

/**
 * Get contract addresses for a specific network
 */
export function getPerspectiveAddresses(chainId: number) {
  switch (chainId) {
    case NETWORKS.MAINNET.chainId:
      return PERSPECTIVE_CONTRACTS.MAINNET
    case NETWORKS.OPTIMISM.chainId:
      return PERSPECTIVE_CONTRACTS.OPTIMISM
    case NETWORKS.BSC.chainId:
      return PERSPECTIVE_CONTRACTS.BSC
    case NETWORKS.UNICHAIN.chainId:
      return PERSPECTIVE_CONTRACTS.UNICHAIN
    case NETWORKS.BASE.chainId:
      return PERSPECTIVE_CONTRACTS.BASE
    case NETWORKS.SEPOLIA.chainId:
      return PERSPECTIVE_CONTRACTS.SEPOLIA
    default:
      throw new Error(`Unsupported network with chainId: ${chainId}`)
  }
}

/**
 * Validate if a perspective address is configured
 */
export function validatePerspectiveAddress(address: string): boolean {
  return address && address !== '0x...' && address.length === 42
}

/**
 * Format vault address for display
 */
export function formatVaultAddress(address: string): string {
  if (!address) return 'N/A'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Get verification status badge color
 */
export function getVerificationBadgeColor(isVerified: boolean): string {
  return isVerified 
    ? 'bg-green-600 text-white' 
    : 'bg-red-600 text-white'
}

/**
 * Get verification status text
 */
export function getVerificationStatusText(isVerified: boolean): string {
  return isVerified ? 'Verified' : 'Not Verified'
} 