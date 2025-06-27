# Pyth Price Feed Integration

This document explains how to use the Pyth price feed integration in the EulerSwap application.

## Overview

The Pyth integration allows you to:
1. Fetch real-time price data from Pyth Network
2. Simulate batch transactions with price updates
3. Query account liquidity using the updated price data

## Setup

### 1. Contract Addresses

Update the contract addresses in `src/config/contracts.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  PYTH_ORACLE: {
    SEPOLIA: '0x...', // Replace with actual Pyth oracle address
    MAINNET: '0x...', // Replace with actual Pyth oracle address
  },
  LENS: {
    SEPOLIA: '0x...', // Replace with actual lens address
    MAINNET: '0x...', // Replace with actual lens address
  },
  EVC: {
    SEPOLIA: '0x...', // Replace with actual EVC address
    MAINNET: '0x...', // Replace with actual EVC address
  },
}
```

### 2. Price Feed IDs

The integration includes common price feed IDs:

- `ETH_USD`: Ethereum to USD price feed
- `BTC_USD`: Bitcoin to USD price feed  
- `USDC_USD`: USDC to USD price feed

You can add more price feeds by updating the `PRICE_FEED_IDS` object.

## Usage

### 1. Fetch Price Data

```typescript
import { fetchPythPriceData } from '@/utils/pythUtils'

// Fetch ETH/USD price data
const priceData = await fetchPythPriceData([PRICE_FEED_IDS.ETH_USD])
```

### 2. Simulate Batch with Price Updates

```typescript
import { simulateBatchWithPyth } from '@/utils/pythUtils'

const accountLiquidity = await simulateBatchWithPyth(
  publicClient,
  accountAddress,
  vaultAddress,
  chainId
)
```

### 3. Using the UI

1. Navigate to `/pyth` in the application
2. Connect your wallet
3. Click "Fetch Latest Price Data" to get current price information
4. Enter a vault address
5. Click "Simulate Batch" to run the simulation

## How It Works

### Step 1: Price Data Fetching
- Calls Pyth Network's Hermes API
- Retrieves the latest price update data
- Returns binary data for on-chain updates

### Step 2: Batch Simulation Preparation
- Creates a simulation batch with two operations:
  1. Update price feeds with fresh data
  2. Query account liquidity using the updated prices

### Step 3: Execution and Decoding
- Simulates the batch transaction
- Decodes the account liquidity results
- Returns structured data (collateral, debt, available borrows)

## API Reference

### `fetchPythPriceData(priceIds?: string[])`

Fetches price update data from Pyth Network.

**Parameters:**
- `priceIds`: Array of price feed IDs (defaults to ETH/USD)

**Returns:**
- Promise<string>: Binary price update data

### `simulateBatchWithPyth(publicClient, account, vault, chainId)`

Simulates a batch transaction with price updates and liquidity queries.

**Parameters:**
- `publicClient`: Viem public client instance
- `account`: User's wallet address
- `vault`: Vault contract address
- `chainId`: Network chain ID

**Returns:**
- Promise<AccountLiquidity>: Account liquidity information

### `AccountLiquidity` Interface

```typescript
interface AccountLiquidity {
  totalCollateralValue: bigint
  totalDebtValue: bigint
  availableBorrows: bigint
}
```

## Error Handling

The integration includes comprehensive error handling:

- Network connectivity issues
- Invalid contract addresses
- Simulation failures
- Data decoding errors

Errors are displayed in the UI and logged to the console for debugging.

## Configuration

### Networks Supported

- **Sepolia Testnet** (Chain ID: 11155111)
- **Ethereum Mainnet** (Chain ID: 1)

### Adding New Networks

1. Update `NETWORKS` in `src/config/contracts.ts`
2. Add contract addresses for the new network
3. Update the `getContractAddresses` function

## Security Considerations

- Always validate contract addresses before use
- Use testnet addresses for development
- Verify price feed IDs from official Pyth documentation
- Handle simulation failures gracefully

## Troubleshooting

### Common Issues

1. **"Contract address not configured"**
   - Update contract addresses in `src/config/contracts.ts`

2. **"Network not supported"**
   - Add the network configuration to `NETWORKS`

3. **"Simulation failed"**
   - Check if the vault address is valid
   - Ensure the user has sufficient permissions

4. **"Price data fetch failed"**
   - Check network connectivity
   - Verify price feed IDs are correct

### Debug Mode

Enable debug logging by checking the browser console for detailed error messages and transaction simulation results. 