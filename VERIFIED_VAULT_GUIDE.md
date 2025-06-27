# Verified Vault Guide

This document explains how to use the verified vault functionality with Euler Perspectives for enhanced security in DeFi operations.

## Overview

Euler Perspectives provide a trust framework for vault verification, ensuring that only security-audited and governance-approved vaults are used in DeFi operations. This helps protect users from potential risks associated with unaudited or malicious vaults.

## How Perspectives Work

### 1. Vault Verification Process
- Vaults undergo comprehensive security audits
- Governance approval is required for verification
- Verified vaults are added to the perspective contract
- Continuous monitoring and updates maintain security standards

### 2. Security Benefits
- **Risk Mitigation**: Only verified vaults are approved for use
- **Audit Assurance**: All verified vaults have passed security audits
- **Governance Oversight**: Community-driven verification process
- **Transparency**: Public verification status for all vaults

## API Functions

### Core Functions

#### `verifiedArray()`
Returns an array of all verified vault addresses.

```typescript
const verifiedVaults = await governedPerspectiveContract.verifiedArray();
// Returns: string[] - Array of verified vault addresses
```

#### `isVerified(vaultAddress)`
Checks if a specific vault is verified by the perspective.

```typescript
const isSafe = await governedPerspectiveContract.isVerified(vaultAddress);
// Returns: boolean - True if vault is verified, false otherwise
```

#### `verifiedLength()`
Returns the total count of verified vaults.

```typescript
const count = await governedPerspectiveContract.verifiedLength();
// Returns: number - Total number of verified vaults
```

#### `name()`
Returns the name of the perspective contract.

```typescript
const name = await governedPerspectiveContract.name();
// Returns: string - Perspective contract name
```

## Usage Examples

### 1. Get All Verified Vaults

```typescript
import { getVerifiedVaults } from '@/utils/verifiedVaultUtils'

const verifiedVaults = await getVerifiedVaults(
  '0x...', // Perspective contract address
  1 // Ethereum mainnet
)
console.log('Verified vaults:', verifiedVaults)
```

### 2. Check Single Vault Verification

```typescript
import { isVaultVerified } from '@/utils/verifiedVaultUtils'

const isVerified = await isVaultVerified(
  '0x...', // Perspective contract address
  '0x...', // Vault address to check
  1 // Ethereum mainnet
)
console.log('Vault verified:', isVerified)
```

### 3. Get Comprehensive Perspective Info

```typescript
import { getPerspectiveInfo } from '@/utils/verifiedVaultUtils'

const info = await getPerspectiveInfo(
  '0x...', // Perspective contract address
  1 // Ethereum mainnet
)
console.log('Perspective name:', info.name)
console.log('Verified count:', info.verifiedCount)
console.log('Verified vaults:', info.verifiedVaults)
```

### 4. Check Multiple Vaults

```typescript
import { checkMultipleVaults } from '@/utils/verifiedVaultUtils'

const vaultAddresses = ['0x...', '0x...', '0x...']
const results = await checkMultipleVaults(
  '0x...', // Perspective contract address
  vaultAddresses,
  1 // Ethereum mainnet
)
results.forEach(result => {
  console.log(`${result.address}: ${result.isVerified ? 'Verified' : 'Not Verified'}`)
})
```

## Contract Addresses

### Perspective Contracts

Update the contract addresses in `src/utils/verifiedVaultUtils.ts`:

```typescript
export const PERSPECTIVE_CONTRACTS = {
  MAINNET: {
    GOVERNED_PERSPECTIVE: '0x...', // Replace with actual address
    BASE_PERSPECTIVE: '0x...',     // Replace with actual address
  },
  SEPOLIA: {
    GOVERNED_PERSPECTIVE: '0x...', // Replace with actual address
    BASE_PERSPECTIVE: '0x...',     // Replace with actual address
  }
}
```

## Using the UI

### 1. Network Configuration
- Select your target network (Mainnet or Sepolia)
- The UI will auto-load configured perspective addresses

### 2. Perspective Contract Setup
- Enter the perspective contract address
- Use "Get Verified Vaults" to see all verified vaults
- Use "Get Perspective Info" for comprehensive information

### 3. Vault Verification Checks
- **Single Vault**: Enter one vault address to check verification status
- **Multiple Vaults**: Enter comma-separated addresses for batch checking

### 4. Results Display
- **Verified Vaults List**: Shows all verified vaults with addresses
- **Perspective Info**: Displays name, count, and contract details
- **Verification Status**: Color-coded badges (green for verified, red for not verified)

## Security Best Practices

### 1. Always Verify Vaults
```typescript
// Before interacting with any vault, check verification
const isVerified = await isVaultVerified(perspectiveAddress, vaultAddress, chainId)
if (!isVerified) {
  throw new Error('Vault is not verified - proceed with caution')
}
```

### 2. Use Multiple Perspectives
```typescript
// Check against multiple perspectives for enhanced security
const governedVerified = await isVaultVerified(governedPerspective, vaultAddress, chainId)
const baseVerified = await isVaultVerified(basePerspective, vaultAddress, chainId)
const isSafe = governedVerified && baseVerified
```

### 3. Regular Verification Updates
```typescript
// Periodically refresh verification status
const verifiedVaults = await getVerifiedVaults(perspectiveAddress, chainId)
// Update your application's vault whitelist
```

## Error Handling

### Common Issues

1. **"Invalid perspective address"**
   - Ensure the perspective contract address is correct
   - Check if the address is deployed on the selected network

2. **"Contract not found"**
   - Verify the perspective contract exists on the network
   - Check if you're connected to the correct network

3. **"Vault not found"**
   - Ensure the vault address is valid
   - Check if the vault exists on the network

4. **"Network not supported"**
   - Add network configuration if needed
   - Update perspective addresses for the network

## Integration Examples

### 1. Vault Selection Component
```typescript
const VaultSelector = () => {
  const [verifiedVaults, setVerifiedVaults] = useState([])
  
  useEffect(() => {
    const loadVerifiedVaults = async () => {
      const vaults = await getVerifiedVaults(perspectiveAddress, chainId)
      setVerifiedVaults(vaults)
    }
    loadVerifiedVaults()
  }, [])
  
  return (
    <select>
      {verifiedVaults.map(vault => (
        <option key={vault} value={vault}>
          {formatVaultAddress(vault)} (Verified)
        </option>
      ))}
    </select>
  )
}
```

### 2. Vault Verification Hook
```typescript
const useVaultVerification = (vaultAddress: string) => {
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const checkVerification = async () => {
      try {
        const verified = await isVaultVerified(perspectiveAddress, vaultAddress, chainId)
        setIsVerified(verified)
      } catch (error) {
        console.error('Verification check failed:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (vaultAddress) {
      checkVerification()
    }
  }, [vaultAddress])
  
  return { isVerified, loading }
}
```

## Troubleshooting

### Debug Mode
Enable debug logging by checking the browser console for detailed error messages and contract interaction logs.

### Network Issues
- Ensure you're connected to the correct network
- Check if the perspective contract is deployed on the network
- Verify RPC endpoint connectivity

### Contract Issues
- Validate perspective contract addresses
- Check if contracts are properly deployed
- Verify ABI compatibility

## Security Considerations

- Always verify vaults before user interactions
- Implement fallback verification mechanisms
- Monitor perspective contract updates
- Use multiple perspectives for critical operations
- Implement proper error handling for verification failures 