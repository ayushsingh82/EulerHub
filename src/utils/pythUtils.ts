import { encodeFunctionData, decodeFunctionResult } from 'viem'
import { getContractAddresses, PRICE_FEED_IDS } from '@/config/contracts'

// Pyth Oracle ABI - Basic interface for price updates
export const pythAbi = [
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'updateData',
        type: 'bytes[]'
      }
    ],
    name: 'updatePriceFeeds',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
] as const

// Lens ABI - For querying account liquidity
export const lensAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'vault',
        type: 'address'
      }
    ],
    name: 'getAccountLiquidity',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'totalCollateralValue',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'totalDebtValue',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'availableBorrows',
            type: 'uint256'
          }
        ],
        internalType: 'struct AccountLiquidity',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const

// EVC ABI - For batch simulation
export const evcAbi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'targetContract',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'onBehalfOfAccount',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256'
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes'
          }
        ],
        internalType: 'struct SimulationItem[]',
        name: 'items',
        type: 'tuple[]'
      }
    ],
    name: 'batchSimulation',
    outputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'success',
            type: 'bool'
          },
          {
            internalType: 'bytes',
            name: 'result',
            type: 'bytes'
          }
        ],
        internalType: 'struct SimulationResult[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const

export interface AccountLiquidity {
  totalCollateralValue: bigint
  totalDebtValue: bigint
  availableBorrows: bigint
}

export async function fetchPythPriceData(priceIds: string[] = [PRICE_FEED_IDS.ETH_USD]) {
  try {
    const pythApiUrl = 'https://hermes.pyth.network/v2/updates/price/latest'
    const response = await fetch(`${pythApiUrl}?ids[]=${priceIds.join('&ids[]=')}&encoding=hex`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.binary.data
  } catch (error) {
    console.error('Error fetching Pyth price data:', error)
    throw error
  }
}

export async function simulateBatchWithPyth(
  publicClient: any,
  account: string,
  vault: string,
  chainId: number
) {
  try {
    // Get contract addresses for the current network
    const addresses = getContractAddresses(chainId)
    
    // Validate addresses
    if (!addresses.pythOracle || addresses.pythOracle === '0x...') {
      throw new Error('Pyth Oracle address not configured for this network')
    }
    if (!addresses.lens || addresses.lens === '0x...') {
      throw new Error('Lens address not configured for this network')
    }
    if (!addresses.evc || addresses.evc === '0x...') {
      throw new Error('EVC address not configured for this network')
    }

    // 1. Fetch fresh price data
    const priceIds = [PRICE_FEED_IDS.ETH_USD]
    const priceUpdateData = await fetchPythPriceData(priceIds)

    // 2. Prepare simulation batch
    const simulationItems = [
      // First: Simulate price update
      {
        targetContract: addresses.pythOracle as `0x${string}`,
        onBehalfOfAccount: account as `0x${string}`,
        value: 0n,
        data: encodeFunctionData({
          abi: pythAbi,
          functionName: 'updatePriceFeeds',
          args: [priceUpdateData]
        })
      },
      // Then: Query the data you need
      {
        targetContract: addresses.lens as `0x${string}`,
        onBehalfOfAccount: account as `0x${string}`,
        value: 0n,
        data: encodeFunctionData({
          abi: lensAbi,
          functionName: 'getAccountLiquidity',
          args: [account as `0x${string}`, vault as `0x${string}`]
        })
      }
    ]

    // 3. Simulate the batch
    const { result } = await publicClient.simulate({
      address: addresses.evc as `0x${string}`,
      abi: evcAbi,
      functionName: 'batchSimulation',
      args: [simulationItems]
    })

    // 4. Extract the query result from the simulation
    const [, queryResult] = result
    const accountLiquidity = decodeFunctionResult({
      abi: lensAbi,
      functionName: 'getAccountLiquidity',
      data: queryResult.result
    }) as AccountLiquidity

    return accountLiquidity
  } catch (error) {
    console.error('Error in batch simulation:', error)
    throw error
  }
} 