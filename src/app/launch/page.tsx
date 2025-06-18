'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { ethers } from 'ethers';
import { ModularUniswapV2Swapper, SEPOLIA_TOKENS } from './swapUtils';
import { useAccount } from 'wagmi';

// Token interface
interface Token {
  address: string;
  decimals: number;
  symbol: string;
}

export default function LaunchPage() {
  // State management
  const [fromToken, setFromToken] = useState<Token>(SEPOLIA_TOKENS.WETH);
  const [toToken, setToToken] = useState<Token>(SEPOLIA_TOKENS.USDC);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [price, setPrice] = useState<string>('0');
  const [showTokenList, setShowTokenList] = useState<'from' | 'to' | null>(null);
  
  const { address } = useAccount();

  // Calculate price
  const calculatePrice = async () => {
    if (!fromAmount || !fromToken || !toToken) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const swapper = new ModularUniswapV2Swapper(provider.getSigner());
      
      const amountIn = ethers.utils.parseUnits(fromAmount, fromToken.decimals);
      const path = [fromToken.address, toToken.address];
      
      const amounts = await swapper.router.getAmountsOut(amountIn, path);
      const expectedOut = amounts[1];
      
      setPrice(ethers.utils.formatUnits(expectedOut, toToken.decimals));
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

  // Handle swap
  const handleSwap = async () => {
    if (!fromAmount || !address) return;
    
    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const swapper = new ModularUniswapV2Swapper(provider.getSigner());
      
      const amountIn = ethers.utils.parseUnits(fromAmount, fromToken.decimals);
      
      let result;
      if (fromToken.symbol === 'WETH') {
        result = await swapper.swapETHForToken(toToken, amountIn, slippage);
      } else if (toToken.symbol === 'WETH') {
        result = await swapper.swapTokenForETH(fromToken, amountIn, slippage);
      } else {
        result = await swapper.swapTokenForToken(fromToken, toToken, amountIn, slippage);
      }
      
      if (result.success) {
        alert('Swap successful!');
        setFromAmount('');
        setToAmount('');
      } else {
        alert('Swap failed: ' + result.error);
      }
    } catch (error: unknown) {
      console.error('Error during swap:', error);
      alert('Swap failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // Update price when inputs change
  useEffect(() => {
    calculatePrice();
  }, [fromAmount, fromToken, toToken]);

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1643330683233-ff2ac89b002c?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen text-white py-12">
        <div className="max-w-md mx-auto">
          {/* Swap Box */}
          <div className="bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Swap</h2>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setSlippage(prev => prev === 0.5 ? 1 : 0.5)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* From Token */}
            <div className="bg-gray-800 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">From</span>
                <button 
                  className="text-orange-300 hover:text-orange-400"
                  onClick={() => setFromAmount('0.1')}
                >
                  Max
                </button>
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                  className="bg-transparent text-2xl w-full outline-none text-white"
                />
                <button 
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
                  onClick={() => setShowTokenList('from')}
                >
                  <span>{fromToken.symbol}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2 z-10 relative">
              <button 
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full border-2 border-gray-900"
                onClick={() => {
                  const temp = fromToken;
                  setFromToken(toToken);
                  setToToken(temp);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To Token */}
            <div className="bg-gray-800 rounded-xl p-4 mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">To</span>
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                  className="bg-transparent text-2xl w-full outline-none text-white"
                />
                <button 
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
                  onClick={() => setShowTokenList('to')}
                >
                  <span>{toToken.symbol}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Price Info */}
            <div className="mt-4 p-4 bg-gray-800 rounded-xl">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Price</span>
                <span>1 {fromToken.symbol} = {price} {toToken.symbol}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>Slippage Tolerance</span>
                <span>{slippage}%</span>
              </div>
            </div>

            {/* Swap Button */}
            {address ? (
              <button 
                className={`w-full mt-4 bg-orange-300 hover:bg-orange-400 text-black font-semibold py-4 px-6 rounded-xl transition-colors`}
                onClick={handleSwap}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Swap'
                )}
              </button>
            ) : (
              <div className="mt-4 text-center text-gray-400">
                Please connect your wallet to swap
              </div>
            )}
          </div>

          {/* Token List Modal */}
          {showTokenList && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-900 rounded-2xl p-6 w-96 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Select Token</h3>
                  <button 
                    className="text-gray-400 hover:text-white"
                    onClick={() => setShowTokenList(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.values(SEPOLIA_TOKENS).map((token) => (
                    <button
                      key={token.symbol}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl transition-colors"
                      onClick={() => {
                        if (showTokenList === 'from') {
                          setFromToken(token);
                        } else {
                          setToToken(token);
                        }
                        setShowTokenList(null);
                      }}
                    >
                      <div className="text-left">
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-gray-400">{token.address.slice(0, 6)}...{token.address.slice(-4)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}