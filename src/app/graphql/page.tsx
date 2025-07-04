'use client';

import React, { useState } from 'react';
import {
  GRAPHQL_ENDPOINTS,
  Network,
  getVaultStatuses,
  getVaultStatusById,
  getEulerVaults,
  getEulerVaultById,
  getBorrows,
  getBorrowById,
  VaultStatus,
  EulerVault,
  Borrow
} from './helper';

const GraphQLPage = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('mainnet');
  const [queryType, setQueryType] = useState<'vaultStatus' | 'eulerVault' | 'borrow'>('vaultStatus');
  const [queryMode, setQueryMode] = useState<'list' | 'single'>('list');
  const [inputId, setInputId] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const networks = Object.keys(GRAPHQL_ENDPOINTS) as Network[];

  const executeQuery = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      let result;
      
      switch (queryType) {
        case 'vaultStatus':
          if (queryMode === 'list') {
            result = await getVaultStatuses(selectedNetwork);
          } else {
            if (!inputId.trim()) {
              throw new Error('Please enter a vault ID');
            }
            result = await getVaultStatusById(selectedNetwork, inputId);
          }
          break;
          
        case 'eulerVault':
          if (queryMode === 'list') {
            result = await getEulerVaults(selectedNetwork);
          } else {
            if (!inputId.trim()) {
              throw new Error('Please enter a vault ID');
            }
            result = await getEulerVaultById(selectedNetwork, inputId);
          }
          break;
          
        case 'borrow':
          if (queryMode === 'list') {
            result = await getBorrows(selectedNetwork);
          } else {
            if (!inputId.trim()) {
              throw new Error('Please enter a borrow ID');
            }
            result = await getBorrowById(selectedNetwork, inputId);
          }
          break;
          
        default:
          throw new Error('Invalid query type');
      }
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderData = () => {
    if (!data) return null;

    const renderVaultStatus = (vault: VaultStatus) => (
      <div key={vault.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="text-lg font-semibold text-blue-400 mb-2">Vault: {vault.id}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-400">Accumulated Fees:</span> {vault.accumulatedFees}</div>
          <div><span className="text-gray-400">Interest Rate:</span> {vault.interestRate}</div>
          <div><span className="text-gray-400">Total Borrows:</span> {vault.totalBorrows}</div>
          <div><span className="text-gray-400">Total Shares:</span> {vault.totalShares}</div>
        </div>
      </div>
    );

    const renderEulerVault = (vault: EulerVault) => (
      <div key={vault.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="text-lg font-semibold text-green-400 mb-2">Euler Vault: {vault.id}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-400">Creator:</span> {vault.creator}</div>
          <div><span className="text-gray-400">Governor Admin:</span> {vault.governonAdmin}</div>
          <div><span className="text-gray-400">Symbol:</span> {vault.symbol}</div>
        </div>
      </div>
    );

    const renderBorrow = (borrow: Borrow) => (
      <div key={borrow.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="text-lg font-semibold text-purple-400 mb-2">Borrow: {borrow.id}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-400">Account:</span> {borrow.account}</div>
          <div><span className="text-gray-400">Assets:</span> {borrow.assets}</div>
          <div><span className="text-gray-400">Vault:</span> {borrow.vault}</div>
        </div>
      </div>
    );

    if (queryType === 'vaultStatus') {
      const vaults = queryMode === 'list' ? data.vaultStatuses : [data.vaultStatus];
      return (
        <div className="space-y-4">
          {vaults.map(renderVaultStatus)}
        </div>
      );
    } else if (queryType === 'eulerVault') {
      const vaults = queryMode === 'list' ? data.eulerVaults : [data.eulerVault];
      return (
        <div className="space-y-4">
          {vaults.map(renderEulerVault)}
        </div>
      );
    } else if (queryType === 'borrow') {
      const borrows = queryMode === 'list' ? data.borrows : [data.borrow];
      return (
        <div className="space-y-4">
          {borrows.map(renderBorrow)}
        </div>
      );
    }

    return <pre className="bg-gray-800 p-4 rounded-lg overflow-auto">{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Euler GraphQL Explorer
          </h1>
          <p className="text-gray-400 text-lg">
            Query Euler protocol data across multiple networks using GraphQL
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">Query Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Network Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Network
              </label>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value as Network)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {networks.map((network) => (
                  <option key={network} value={network} className="capitalize">
                    {network}
                  </option>
                ))}
              </select>
            </div>

            {/* Query Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Query Type
              </label>
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="vaultStatus">Vault Status</option>
                <option value="eulerVault">Euler Vault</option>
                <option value="borrow">Borrow</option>
              </select>
            </div>

            {/* Query Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Query Mode
              </label>
              <select
                value={queryMode}
                onChange={(e) => setQueryMode(e.target.value as 'list' | 'single')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="list">List (First 5)</option>
                <option value="single">Single (By ID)</option>
              </select>
            </div>

            {/* ID Input */}
            {queryMode === 'single' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {queryType === 'vaultStatus' ? 'Vault ID' : 
                   queryType === 'eulerVault' ? 'Euler Vault ID' : 'Borrow ID'}
                </label>
                <input
                  type="text"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  placeholder="Enter ID..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Execute Button */}
          <div className="mt-6">
            <button
              onClick={executeQuery}
              disabled={loading || (queryMode === 'single' && !inputId.trim())}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {loading ? 'Executing Query...' : 'Execute Query'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Query Results</h2>
          
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-gray-400">Loading data...</span>
            </div>
          )}

          {data && !loading && (
            <div>
              <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-400">Endpoint: </span>
                <span className="text-sm text-blue-400 font-mono">{GRAPHQL_ENDPOINTS[selectedNetwork]}</span>
              </div>
              {renderData()}
            </div>
          )}

          {!data && !loading && !error && (
            <div className="text-center py-8 text-gray-400">
              <p>Configure your query above and click "Execute Query" to see results</p>
            </div>
          )}
        </div>

        {/* Documentation */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-yellow-400">Documentation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Vault Status</h3>
              <p className="text-gray-400 text-sm mb-2">Query vault status information including:</p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Accumulated fees</li>
                <li>• Interest rates</li>
                <li>• Total borrows</li>
                <li>• Total shares</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Euler Vault</h3>
              <p className="text-gray-400 text-sm mb-2">Query Euler vault details including:</p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Creator address</li>
                <li>• Governor admin</li>
                <li>• Vault symbol</li>
                <li>• Vault ID</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Borrow</h3>
              <p className="text-gray-400 text-sm mb-2">Query borrow information including:</p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Account address</li>
                <li>• Borrowed assets</li>
                <li>• Associated vault</li>
                <li>• Borrow ID</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphQLPage;