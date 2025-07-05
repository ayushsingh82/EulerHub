'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { lensAddresses } from './lensAddresses';
import UtilsLensABI from './UtilsLens.json';
import VaultLensABI from './VaultLens.json';
import EulerEarnVaultLensABI from './EulerEarnVaultLens.json';
import { 
  mainnet, 
  polygon, 
  optimism, 
  arbitrum, 
  base, 
  bsc 
} from 'wagmi/chains';

interface LensData {
  [key: string]: unknown;
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
    { id: 'mainnet', name: 'Ethereum Mainnet', chain: mainnet },
    { id: 'bnbMainnet', name: 'BNB Chain', chain: bsc },
    { id: 'polygon', name: 'Polygon', chain: polygon },
    { id: 'optimism', name: 'Optimism', chain: optimism },
    { id: 'arbitrum', name: 'Arbitrum', chain: arbitrum },
    { id: 'baseMainnet', name: 'Base', chain: base },
  ];

  const lensTypes = [
    { 
      id: 'utilsLens', 
      name: 'Utils Lens', 
      description: 'Utility queries for vaults and tokens (ERC-4626 info, APYs, balances, price lookups, liquidation time)',
      abi: UtilsLensABI
    },
    { 
      id: 'eulerEarnVaultLens', 
      name: 'Euler Earn Vault Lens', 
      description: 'Specialized lens for Euler Earn vaults (strategy allocations, performance, fees, rewards)',
      abi: EulerEarnVaultLensABI
    },
    { 
      id: 'vaultLens', 
      name: 'Vault Lens', 
      description: 'Detailed vault information (configuration, assets, borrows, collateral, LTVs, oracle data)',
      abi: VaultLensABI
    },
  ];

  const getLensAddress = () => {
    return lensAddresses[selectedChain as keyof typeof lensAddresses]?.[selectedLens as keyof typeof lensAddresses.mainnet];
  };

  const getSelectedChainConfig = () => {
    return chains.find(chain => chain.id === selectedChain)?.chain;
  };



  // Contract read hooks
  const lensAddress = getLensAddress();
  const selectedChainConfig = getSelectedChainConfig();

  // Utils Lens queries
  const { data: apys, error: apysError } = useReadContract({
    address: lensAddress as `0x${string}`,
    abi: UtilsLensABI,
    functionName: 'getAPYs',
    args: vaultAddress ? [vaultAddress as `0x${string}`] : undefined,
    chainId: selectedChainConfig?.id,
    query: {
      enabled: selectedLens === 'utilsLens' && !!vaultAddress && !!lensAddress,
    },
  });

  const { data: assetPriceInfo, error: priceError } = useReadContract({
    address: lensAddress as `0x${string}`,
    abi: UtilsLensABI,
    functionName: 'getAssetPriceInfo',
    args: tokenAddress && vaultAddress ? [tokenAddress as `0x${string}`, vaultAddress as `0x${string}`] : undefined,
    chainId: selectedChainConfig?.id,
    query: {
      enabled: selectedLens === 'utilsLens' && !!tokenAddress && !!vaultAddress && !!lensAddress,
    },
  });

  // Vault Lens queries
  const { data: vaultInfo, error: vaultInfoError } = useReadContract({
    address: lensAddress as `0x${string}`,
    abi: VaultLensABI,
    functionName: 'getVaultInfo',
    args: vaultAddress ? [vaultAddress as `0x${string}`] : undefined,
    chainId: selectedChainConfig?.id,
    query: {
      enabled: selectedLens === 'vaultLens' && !!vaultAddress && !!lensAddress,
    },
  });

  const { data: collateralInfo, error: collateralError } = useReadContract({
    address: lensAddress as `0x${string}`,
    abi: VaultLensABI,
    functionName: 'getRecognizedCollateralsLTVInfo',
    args: vaultAddress ? [vaultAddress as `0x${string}`] : undefined,
    chainId: selectedChainConfig?.id,
    query: {
      enabled: selectedLens === 'vaultLens' && !!vaultAddress && !!lensAddress,
    },
  });

  // Euler Earn Vault Lens queries
  const { data: earnVaultInfo, error: earnVaultError } = useReadContract({
    address: lensAddress as `0x${string}`,
    abi: EulerEarnVaultLensABI,
    functionName: 'getVaultInfoFull',
    args: vaultAddress ? [vaultAddress as `0x${string}`] : undefined,
    chainId: selectedChainConfig?.id,
    query: {
      enabled: selectedLens === 'eulerEarnVaultLens' && !!vaultAddress && !!lensAddress,
    },
  });

  const { data: accessControlInfo, error: accessControlError } = useReadContract({
    address: lensAddress as `0x${string}`,
    abi: EulerEarnVaultLensABI,
    functionName: 'getVaultAccessControlInfo',
    args: vaultAddress ? [vaultAddress as `0x${string}`] : undefined,
    chainId: selectedChainConfig?.id,
    query: {
      enabled: selectedLens === 'eulerEarnVaultLens' && !!vaultAddress && !!lensAddress,
    },
  });

  const handleQuery = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const lensAddress = getLensAddress();
      if (!lensAddress) {
        throw new Error('Invalid lens address for selected chain');
      }

      if (!vaultAddress) {
        throw new Error('Vault address is required for querying lens data');
      }

      // Collect data based on lens type
      let queryData: LensData = {
        lensAddress,
        chain: selectedChain,
        chainId: selectedChainConfig?.id,
        timestamp: new Date().toISOString(),
        vaultAddress,
        tokenAddress: tokenAddress || 'Not provided',
      };

             // Add lens-specific data
       switch (selectedLens) {
         case 'utilsLens':
           if (apysError) throw new Error(`APYs query failed: ${apysError.message}`);
           if (priceError) throw new Error(`Price query failed: ${priceError.message}`);
           
           queryData = {
             ...queryData,
             apys: apys ? {
               borrowAPY: (apys as unknown[])[0]?.toString(),
               supplyAPY: (apys as unknown[])[1]?.toString(),
             } : null,
             assetPriceInfo: assetPriceInfo ? {
               price: (assetPriceInfo as { price?: unknown; timestamp?: unknown; oracleAddress?: unknown }).price?.toString(),
               timestamp: (assetPriceInfo as { price?: unknown; timestamp?: unknown; oracleAddress?: unknown }).timestamp?.toString(),
               oracleAddress: (assetPriceInfo as { price?: unknown; timestamp?: unknown; oracleAddress?: unknown }).oracleAddress,
             } : null,
           };
           break;

         case 'vaultLens':
           if (vaultInfoError) throw new Error(`Vault info query failed: ${vaultInfoError.message}`);
           if (collateralError) throw new Error(`Collateral info query failed: ${collateralError.message}`);
           
           queryData = {
             ...queryData,
             vaultInfo: vaultInfo ? {
               name: (vaultInfo as { name?: unknown; symbol?: unknown; decimals?: unknown; totalAssets?: unknown; totalBorrows?: unknown; totalShares?: unknown }).name,
               symbol: (vaultInfo as { name?: unknown; symbol?: unknown; decimals?: unknown; totalAssets?: unknown; totalBorrows?: unknown; totalShares?: unknown }).symbol,
               decimals: (vaultInfo as { name?: unknown; symbol?: unknown; decimals?: unknown; totalAssets?: unknown; totalBorrows?: unknown; totalShares?: unknown }).decimals?.toString(),
               totalAssets: (vaultInfo as { name?: unknown; symbol?: unknown; decimals?: unknown; totalAssets?: unknown; totalBorrows?: unknown; totalShares?: unknown }).totalAssets?.toString(),
               totalBorrows: (vaultInfo as { name?: unknown; symbol?: unknown; decimals?: unknown; totalAssets?: unknown; totalBorrows?: unknown; totalShares?: unknown }).totalBorrows?.toString(),
               totalShares: (vaultInfo as { name?: unknown; symbol?: unknown; decimals?: unknown; totalAssets?: unknown; totalBorrows?: unknown; totalShares?: unknown }).totalShares?.toString(),
             } : null,
             collateralInfo: collateralInfo ? (collateralInfo as unknown[]).map((collateral: unknown) => ({
               collateral: (collateral as { collateral?: unknown; borrowLTV?: unknown; liquidationLTV?: unknown; initialLiquidationLTV?: unknown; targetTimestamp?: unknown; rampDuration?: unknown }).collateral,
               borrowLTV: (collateral as { collateral?: unknown; borrowLTV?: unknown; liquidationLTV?: unknown; initialLiquidationLTV?: unknown; targetTimestamp?: unknown; rampDuration?: unknown }).borrowLTV?.toString(),
               liquidationLTV: (collateral as { collateral?: unknown; borrowLTV?: unknown; liquidationLTV?: unknown; initialLiquidationLTV?: unknown; targetTimestamp?: unknown; rampDuration?: unknown }).liquidationLTV?.toString(),
               initialLiquidationLTV: (collateral as { collateral?: unknown; borrowLTV?: unknown; liquidationLTV?: unknown; initialLiquidationLTV?: unknown; targetTimestamp?: unknown; rampDuration?: unknown }).initialLiquidationLTV?.toString(),
               targetTimestamp: (collateral as { collateral?: unknown; borrowLTV?: unknown; liquidationLTV?: unknown; initialLiquidationLTV?: unknown; targetTimestamp?: unknown; rampDuration?: unknown }).targetTimestamp?.toString(),
               rampDuration: (collateral as { collateral?: unknown; borrowLTV?: unknown; liquidationLTV?: unknown; initialLiquidationLTV?: unknown; targetTimestamp?: unknown; rampDuration?: unknown }).rampDuration?.toString(),
             })) : null,
           };
           break;

         case 'eulerEarnVaultLens':
           if (earnVaultError) throw new Error(`Earn vault info query failed: ${earnVaultError.message}`);
           if (accessControlError) throw new Error(`Access control query failed: ${accessControlError.message}`);
           
           queryData = {
             ...queryData,
             earnVaultInfo: earnVaultInfo ? {
               timestamp: (earnVaultInfo as { timestamp?: unknown; vaultName?: unknown; vaultSymbol?: unknown; vaultDecimals?: unknown; asset?: unknown; assetName?: unknown; assetSymbol?: unknown }).timestamp?.toString(),
               vaultName: (earnVaultInfo as { timestamp?: unknown; vaultName?: unknown; vaultSymbol?: unknown; vaultDecimals?: unknown; asset?: unknown; assetName?: unknown; assetSymbol?: unknown }).vaultName,
               vaultSymbol: (earnVaultInfo as { timestamp?: unknown; vaultName?: unknown; vaultSymbol?: unknown; vaultDecimals?: unknown; asset?: unknown; assetName?: unknown; assetSymbol?: unknown }).vaultSymbol,
               vaultDecimals: (earnVaultInfo as { timestamp?: unknown; vaultName?: unknown; vaultSymbol?: unknown; vaultDecimals?: unknown; asset?: unknown; assetName?: unknown; assetSymbol?: unknown }).vaultDecimals?.toString(),
               asset: (earnVaultInfo as { timestamp?: unknown; vaultName?: unknown; vaultSymbol?: unknown; vaultDecimals?: unknown; asset?: unknown; assetName?: unknown; assetSymbol?: unknown }).asset,
               assetName: (earnVaultInfo as { timestamp?: unknown; vaultName?: unknown; vaultSymbol?: unknown; vaultDecimals?: unknown; asset?: unknown; assetName?: unknown; assetSymbol?: unknown }).assetName,
               assetSymbol: (earnVaultInfo as { timestamp?: unknown; vaultName?: unknown; vaultSymbol?: unknown; vaultDecimals?: unknown; asset?: unknown; assetName?: unknown; assetSymbol?: unknown }).assetSymbol,
             } : null,
             accessControlInfo: accessControlInfo ? {
               defaultAdmins: (accessControlInfo as { defaultAdmins?: unknown; guardianAdmins?: unknown; strategyOperatorAdmins?: unknown; guardians?: unknown; strategyOperators?: unknown }).defaultAdmins,
               guardianAdmins: (accessControlInfo as { defaultAdmins?: unknown; guardianAdmins?: unknown; strategyOperatorAdmins?: unknown; guardians?: unknown; strategyOperators?: unknown }).guardianAdmins,
               strategyOperatorAdmins: (accessControlInfo as { defaultAdmins?: unknown; guardianAdmins?: unknown; strategyOperatorAdmins?: unknown; guardians?: unknown; strategyOperators?: unknown }).strategyOperatorAdmins,
               guardians: (accessControlInfo as { defaultAdmins?: unknown; guardianAdmins?: unknown; strategyOperatorAdmins?: unknown; guardians?: unknown; strategyOperators?: unknown }).guardians,
               strategyOperators: (accessControlInfo as { defaultAdmins?: unknown; guardianAdmins?: unknown; strategyOperatorAdmins?: unknown; guardians?: unknown; strategyOperators?: unknown }).strategyOperators,
             } : null,
           };
           break;
       }

      setData(queryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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
            {selectedChainConfig && (
              <div className="text-sm text-gray-400 mt-2">
                Chain ID: {selectedChainConfig.id} ({selectedChainConfig.name})
              </div>
            )}
          </div>
        </div>

        {/* Input Fields */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Query Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vault Address *
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
              disabled={loading || !vaultAddress || !lensAddress}
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