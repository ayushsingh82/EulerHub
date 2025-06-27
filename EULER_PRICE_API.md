# Euler Price API Integration

This document explains how to use the Euler Finance Price API integration in the EulerSwap application.

## Overview

The Euler Price API integration provides access to real-time off-chain price data for DeFi assets. This is particularly useful when you need market-reflective prices that may differ from on-chain oracle prices due to update delays or hardcoded values.

## API Endpoint

The Euler Price API is available at:
```
https://app.euler.finance/api/v1/price?chainId=1&assets=ASSET_ADDRESS
```

### Parameters
- `chainId`: Network identifier (1 for Ethereum mainnet, 11155111 for Sepolia)
- `assets`: Comma-separated list of ERC-20 token addresses

### Example Responses

**Single Asset (WSTETH):**
```json
{
  "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0": {
    "source": "pyth",
    "address": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    "symbol": "WSTETH",
    "price": 2951.45147498,
    "timestamp": 1751006897
  },
  "countryCode": "US",
  "isProxyOrVpn": "false",
  "is_vpn": "false"
}
```

**Multiple Assets (WSTETH + WETH):**
```json
{
  "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0": {
    "source": "pyth",
    "address": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    "symbol": "WSTETH",
    "price": 2951.45147498,
    "timestamp": 1751006897
  },
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": {
    "symbol": "WETH",
    "price": 2448.66584189,
    "timestamp": 1751006897,
    "source": "pyth",
    "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  },
  "countryCode": "US",
  "isProxyOrVpn": "false",
  "is_vpn": "false"
}
```

## Usage

### 1. Fetch Single Asset Price

```typescript
import { fetchSingleAssetPrice } from '@/utils/eulerPriceUtils'

const priceData = await fetchSingleAssetPrice(
  '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0', // WSTETH
  1 // Ethereum mainnet
)
```

### 2. Fetch Multiple Asset Prices

```typescript
import { fetchMultipleAssetPrices } from '@/utils/eulerPriceUtils'

const addresses = [
  '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0', // WSTETH
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'  // WETH
]

const priceData = await fetchMultipleAssetPrices(addresses, 1)
```

### 3. Fetch Common Assets

```typescript
import { fetchCommonAssetPrices } from '@/utils/eulerPriceUtils'

const priceData = await fetchCommonAssetPrices(1) // Ethereum mainnet
```

### 4. Format Price Data for Display

```typescript
import { formatPriceData } from '@/utils/eulerPriceUtils'

const formattedData = formatPriceData(priceData)
// Returns array with formatted prices, timestamps, and symbols
```

## Common Asset Addresses

### Ethereum Mainnet
- **WSTETH**: `0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0`
- **WETH**: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- **USDC**: `0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8C8`
- **USDT**: `0xdAC17F958D2ee523a2206206994597C13D831ec7`
- **DAI**: `0x6B175474E89094C44Da98b954EedeAC495271d0F`
- **WBTC**: `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`

## Why Use Off-Chain Prices?

### 1. Real-Time Market Data
On-chain oracles often have update delays due to:
- Heartbeat intervals
- Update thresholds
- Network congestion
- Gas cost considerations

### 2. Accurate Portfolio Valuation
Off-chain prices provide:
- Current market values for collateral positions
- Better risk assessment capabilities
- More accurate liquidation calculations

### 3. Analytics & Risk Management
Use cases include:
- Real-time portfolio tracking
- Risk monitoring dashboards
- User interface displays
- Performance analytics

## API Reference

### `fetchSingleAssetPrice(assetAddress, chainId)`

Fetches price data for a single asset.

**Parameters:**
- `assetAddress`: ERC-20 token address
- `chainId`: Network chain ID (default: 1)

**Returns:**
- Promise<EulerPriceData>: Price data object

### `fetchMultipleAssetPrices(assetAddresses, chainId)`

Fetches price data for multiple assets.

**Parameters:**
- `assetAddresses`: Array of ERC-20 token addresses
- `chainId`: Network chain ID (default: 1)

**Returns:**
- Promise<EulerPriceData>: Price data object

### `fetchCommonAssetPrices(chainId)`

Fetches prices for commonly used assets on the specified network.

**Parameters:**
- `chainId`: Network chain ID (default: 1)

**Returns:**
- Promise<EulerPriceData>: Price data object

### `formatPriceData(priceData)`

Formats price data for display in the UI.

**Parameters:**
- `priceData`: Raw price data from API

**Returns:**
- Array of formatted price objects with:
  - `symbol`: Asset symbol
  - `priceFormatted`: Formatted USD price
  - `timestampFormatted`: Human-readable timestamp
  - `source`: Price source (e.g., "pyth")

## Error Handling

The integration includes comprehensive error handling for:
- Network connectivity issues
- Invalid asset addresses
- Unsupported networks
- API rate limiting
- Malformed responses

## Using the UI

1. Navigate to `/offchain-price` in the application
2. Select your target network (Mainnet or Sepolia)
3. Use quick actions to fetch common assets or specific pairs
4. Enter custom asset addresses for single or multiple queries
5. View results in the formatted table

## Configuration

### Networks Supported
- **Ethereum Mainnet** (Chain ID: 1)
- **Sepolia Testnet** (Chain ID: 11155111)

### Adding New Networks
1. Update `NETWORKS` in `src/utils/eulerPriceUtils.ts`
2. Add common asset addresses for the new network
3. Update the network selection UI

## Security Considerations

- Always validate asset addresses before making API calls
- Use HTTPS endpoints for production environments
- Implement rate limiting for high-frequency requests
- Handle API errors gracefully
- Consider caching responses for frequently requested assets

## Troubleshooting

### Common Issues

1. **"Unsupported network"**
   - Check if the chainId is supported
   - Add network configuration if needed

2. **"No valid asset addresses"**
   - Update common asset addresses for the network
   - Verify asset addresses are correct

3. **"HTTP error"**
   - Check network connectivity
   - Verify API endpoint is accessible
   - Check for rate limiting

4. **"Invalid asset address"**
   - Ensure addresses are valid ERC-20 contract addresses
   - Check for typos in address format

### Debug Mode

Enable debug logging by checking the browser console for detailed error messages and API responses. 