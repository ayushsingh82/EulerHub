// GraphQL Network Endpoints
export const GRAPHQL_ENDPOINTS = {
  mainnet: 'https://api.goldsky.com/api/public/project_cm4iagnemt1wp01xn4gh1agft/subgraphs/euler-v2-mainnet/1.0.6/gn',
  base: 'https://api.goldsky.com/api/public/project_cm4iagnemt1wp01xn4gh1agft/subgraphs/euler-v2-base/1.0.8/gn',
  swell: 'https://api.goldsky.com/api/public/project_cm4iagnemt1wp01xn4gh1agft/subgraphs/euler-v2-swell/1.0.9/gn',
  sonic: 'https://api.goldsky.com/api/public/project_cm4iagnemt1wp01xn4gh1agft/subgraphs/euler-v2-sonic/1.0.3/gn',
  arbitrum: 'https://api.goldsky.com/api/public/project_cm4iagnemt1wp01xn4gh1agft/subgraphs/euler-v2-arbitrum/1.0.2/gn',
  unichain: 'https://api.goldsky.com/api/public/project_cm4iagnemt1wp01xn4gh1agft/subgraphs/euler-v2-unichain/1.0.2/gn'
} as const;

export type Network = keyof typeof GRAPHQL_ENDPOINTS;

// GraphQL Queries
export const QUERIES = {
  // Vault Status Queries
  GET_VAULT_STATUSES: `
    query GetVaultStatuses {
      vaultStatuses(first: 5) {
        id
        accumulatedFees
        interestRate
        totalBorrows
        totalShares
      }
    }
  `,
  
  GET_VAULT_STATUS_BY_ID: `
    query GetVaultStatus($id: String!) {
      vaultStatus(id: $id) {
        id
        accumulatedFees
        interestRate
        totalBorrows
        totalShares
      }
    }
  `,

  // Euler Vault Queries
  GET_EULER_VAULTS: `
    query GetEulerVaults {
      eulerVaults(first: 5) {
        id
        creator
        governonAdmin
        symbol
      }
    }
  `,

  GET_EULER_VAULT_BY_ID: `
    query GetEulerVault($id: String!) {
      eulerVault(id: $id) {
        id
        creator
        governonAdmin
        symbol
      }
    }
  `,

  // Borrow Queries
  GET_BORROWS: `
    query GetBorrows {
      borrows(first: 5) {
        id
        account
        assets
        vault
      }
    }
  `,

  GET_BORROW_BY_ID: `
    query GetBorrow($id: String!) {
      borrow(id: $id) {
        id
        account
        assets
        vault
      }
    }
  `,

  // Liquidate Queries
  GET_LIQUIDATES: `
    query GetLiquidates {
      liquidates(first: 10) {
        id
        liquidator
        repayAssets
        yieldBalance
        violator
      }
    }
  `,

  GET_LIQUIDATE_BY_ID: `
    query GetLiquidate($id: String!) {
      liquidate(id: $id) {
        id
        violator
        yieldBalance
        repayAssets
        liquidator
      }
    }
  `
} as const;

// Types for GraphQL responses
export interface VaultStatus {
  id: string;
  accumulatedFees: string;
  interestRate: string;
  totalBorrows: string;
  totalShares: string;
}

export interface EulerVault {
  id: string;
  creator: string;
  governonAdmin: string;
  symbol: string;
}

export interface Borrow {
  id: string;
  account: string;
  assets: string;
  vault: string;
}

export interface Liquidate {
  id: string;
  violator: string;
  yieldBalance: string;
  repayAssets: string;
  liquidator: string;
}

export interface GraphQLResponse<T> {
  data: T;
  errors?: unknown[];
}

// Utility function to execute GraphQL queries
export async function executeQuery<T>(
  network: Network,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const endpoint = GRAPHQL_ENDPOINTS[network];
  
  const requestBody = {
    query,
    variables: variables || {}
  };
  
  console.log('GraphQL Request:', JSON.stringify(requestBody, null, 2));
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GraphQLResponse<T> = await response.json();
    
    console.log('GraphQL Response:', JSON.stringify(result, null, 2));
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  } catch (error) {
    console.error('GraphQL query failed:', error);
    throw error;
  }
}

// Specific query functions
export async function getVaultStatuses(network: Network) {
  return executeQuery<{ vaultStatuses: VaultStatus[] }>(
    network,
    QUERIES.GET_VAULT_STATUSES
  );
}

export async function getVaultStatusById(network: Network, id: string) {
  console.log('Executing vault status query with ID:', id);
  return executeQuery<{ vaultStatus: VaultStatus }>(
    network,
    QUERIES.GET_VAULT_STATUS_BY_ID,
    { id: id.toString() }
  );
}

export async function getEulerVaults(network: Network) {
  return executeQuery<{ eulerVaults: EulerVault[] }>(
    network,
    QUERIES.GET_EULER_VAULTS
  );
}

export async function getEulerVaultById(network: Network, id: string) {
  console.log('Executing Euler vault query with ID:', id);
  return executeQuery<{ eulerVault: EulerVault }>(
    network,
    QUERIES.GET_EULER_VAULT_BY_ID,
    { id: id.toString() }
  );
}

export async function getBorrows(network: Network) {
  return executeQuery<{ borrows: Borrow[] }>(
    network,
    QUERIES.GET_BORROWS
  );
}

export async function getBorrowById(network: Network, id: string) {
  console.log('Executing borrow query with ID:', id);
  return executeQuery<{ borrow: Borrow }>(
    network,
    QUERIES.GET_BORROW_BY_ID,
    { id: id.toString() }
  );
}

export async function getLiquidates(network: Network) {
  return executeQuery<{ liquidates: Liquidate[] }>(
    network,
    QUERIES.GET_LIQUIDATES
  );
}

export async function getLiquidateById(network: Network, id: string) {
  console.log('Executing liquidate query with ID:', id);
  return executeQuery<{ liquidate: Liquidate }>(
    network,
    QUERIES.GET_LIQUIDATE_BY_ID,
    { id: id.toString() }
  );
}

