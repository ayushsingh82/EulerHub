'use client';

import { useState } from 'react';
import { lensAddresses } from './lensAddresses';

interface LensData {
  [key: string]: any;
}

export default function LensPage() {
  const [selectedChain, setSelectedChain] = useState('mainnet');
  const [selectedLens, setSelectedLens] = useState('utilsLens');
  const [vaultAddress, setVaultAddress] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LensData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chains = [
    { id: 'mainnet', name: 'Ethereum Mainnet' },
    { id: 'bnbMainnet', name: 'BNB Chain' },
    { id: 'unichain', name: 'UniChain' },
    { id: 'baseMainnet', name: 'Base' },
  ];

  const lensTypes = [
    { 
      id: 'utilsLens', 
      name: 'Utils Lens', 
      description: 'Utility queries for vaults and tokens (ERC-4626 info, APYs, balances, price lookups, liquidation time)' 
    },
    { 
      id: 'eulerEarnVaultLens', 
      name: 'Euler Earn Vault Lens', 
      description: 'Specialized lens for Euler Earn vaults (strategy allocations, performance, fees, rewards)' 
    },
    { 
      id: 'vaultLens', 
      name: 'Vault Lens', 
      description: 'Detailed vault information (configuration, assets, borrows, collateral, LTVs, oracle data)' 
    },
  ];

  const getLensAddress = () => {
    return lensAddresses[selectedChain as keyof typeof lensAddresses]?.[selectedLens as keyof typeof lensAddresses.mainnet];
  };

  const handleQuery = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const lensAddress = getLensAddress();
      if (!lensAddress) {
        throw new Error('Invalid lens address for selected chain');
      }

      // Simulate API call - replace with actual contract calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on lens type
      const mockData = generateMockData(selectedLens, vaultAddress, tokenAddress);
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (lensType: string, vaultAddr: string, tokenAddr: string) => {
    const baseData = {
      lensAddress: getLensAddress(),
      chain: selectedChain,
      timestamp: new Date().toISOString(),
    };

    switch (lensType) {
      case 'utilsLens':
        return {
          ...baseData,
          vaultInfo: {
            name: 'Sample ERC-4626 Vault',
            symbol: 'vUSDC',
            decimals: 18,
            totalAssets: '1000000000000000000000',
            totalSupply: '950000000000000000000',
            apy: '0.0856',
            pricePerShare: '1.0526',
            timeToLiquidation: '0',
            isHealthy: true,
          },
          tokenBalances: {
            balance: '1000000000000000000',
            allowance: '1000000000000000000000',
            price: '1.00',
          },
          priceData: {
            onChainPrice: '1.00',
            lastUpdate: new Date().toISOString(),
            oracleAddress: '0x1234567890123456789012345678901234567890',
          },
        };

      case 'eulerEarnVaultLens':
        return {
          ...baseData,
          strategyAllocations: {
            totalAllocated: '800000000000000000000',
            strategies: [
              { name: 'Compound Strategy', allocation: '0.4', apy: '0.092' },
              { name: 'Aave Strategy', allocation: '0.3', apy: '0.087' },
              { name: 'Yearn Strategy', allocation: '0.3', apy: '0.078' },
            ],
          },
          feeConfiguration: {
            managementFee: '0.01',
            performanceFee: '0.20',
            withdrawalFee: '0.005',
          },
          rewards: {
            totalRewards: '50000000000000000000',
            rewardTokens: ['0x1234567890123456789012345678901234567890'],
            accessControl: {
              whitelistEnabled: false,
              maxDepositors: 1000,
            },
          },
        };

      case 'vaultLens':
        return {
          ...baseData,
          vaultConfiguration: {
            name: 'Euler Vault',
            symbol: 'eUSDC',
            decimals: 18,
            cap: '10000000000000000000000',
            fees: {
              borrowFee: '0.001',
              flashLoanFee: '0.0009',
            },
            irm: {
              baseRate: '0.02',
              kink: '0.8',
              multiplier: '0.1',
              jumpMultiplier: '1.0',
            },
          },
          totals: {
            totalAssets: '5000000000000000000000',
            totalBorrows: '3000000000000000000000',
            totalShares: '4500000000000000000000',
            utilizationRate: '0.6',
          },
          collateral: [
            {
              token: '0x1234567890123456789012345678901234567890',
              symbol: 'USDC',
              ltv: '0.85',
              liquidationThreshold: '0.88',
              liquidationPenalty: '0.05',
              balance: '1000000000',
            },
            {
              token: '0x0987654321098765432109876543210987654321',
              symbol: 'WETH',
              ltv: '0.75',
              liquidationThreshold: '0.80',
              liquidationPenalty: '0.08',
              balance: '1000000000000000000',
            },
          ],
          oracleData: {
            oracleAddress: '0x1234567890123456789012345678901234567890',
            price: '1.00',
            lastUpdate: new Date().toISOString(),
            heartbeat: '3600',
          },
        };

      default:
        return baseData;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-300 mb-4">Euler Lens Explorer</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Query comprehensive data from Euler's lens contracts across multiple networks. 
            Get real-time information about vaults, tokens, and DeFi strategies.
          </p>
        </div>

        {/* Chain and Lens Selection */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chain Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Network
              </label>
              <div className="grid grid-cols-2 gap-3">
                {chains.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => setSelectedChain(chain.id)}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedChain === chain.id
                        ? 'border-orange-300 bg-orange-300/10 text-orange-300'
                        : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white'
                    }`}
                  >
                    <div className="text-sm font-medium">{chain.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lens Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Lens Type
              </label>
              <div className="space-y-3">
                {lensTypes.map((lens) => (
                  <button
                    key={lens.id}
                    onClick={() => setSelectedLens(lens.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      selectedLens === lens.id
                        ? 'border-orange-300 bg-orange-300/10 text-orange-300'
                        : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white'
                    }`}
                  >
                    <div className="font-medium">{lens.name}</div>
                    <div className="text-xs mt-1 opacity-75">{lens.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lens Address Display */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Selected Lens Contract</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Contract Address:</div>
            <div className="font-mono text-orange-300 break-all">
              {getLensAddress() || 'No address available for selected chain'}
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Query Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vault Address (Optional)
              </label>
              <input
                type="text"
                value={vaultAddress}
                onChange={(e) => setVaultAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Token Address (Optional)
              </label>
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-300"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleQuery}
              disabled={loading}
              className="w-full bg-orange-300 text-black font-semibold py-3 px-6 rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Querying...' : 'Query Lens Data'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-8">
            <div className="text-red-300 font-medium">Error</div>
            <div className="text-red-400 mt-1">{error}</div>
          </div>
        )}

        {/* Data Display */}
        {data && (
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Query Results</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Documentation */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Lens Documentation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lensTypes.map((lens) => (
              <div key={lens.id} className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-orange-300 font-semibold mb-2">{lens.name}</h4>
                <p className="text-gray-400 text-sm mb-3">{lens.description}</p>
                <div className="text-xs text-gray-500">
                  Contract: {lensAddresses[selectedChain as keyof typeof lensAddresses]?.[lens.id as keyof typeof lensAddresses.mainnet] || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}