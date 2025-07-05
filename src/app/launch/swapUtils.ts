import { ethers } from 'ethers';

// Sepolia testnet configuration
// const SEPOLIA_RPC_URL = 'https://sepolia.infura.io/v3/<>INFURA';

// Uniswap V2 Router on Sepolia
const UNISWAP_V2_ROUTER = '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008';

// Common token addresses on Sepolia
export const SEPOLIA_TOKENS = {
    WETH: {
        address: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
        decimals: 18,
        symbol: 'WETH'
    },
    USDC: {
        address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
        decimals: 6,
        symbol: 'USDC'
    },
    UNI: {
        address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        decimals: 18,
        symbol: 'UNI'
    },
    DAI: {
        address: '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6',
        decimals: 18,
        symbol: 'DAI'
    }
};

// ERC20 ABI
const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
    'function deposit() payable',
    'function withdraw(uint256 amount)'
];

// Uniswap V2 Router ABI
const UNISWAP_V2_ROUTER_ABI = [
    'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function WETH() external pure returns (address)',
    'function factory() external pure returns (address)'
];

export class ModularUniswapV2Swapper {
    router: ethers.Contract;
    signer: ethers.Signer;

    constructor(signer: ethers.Signer) {
        this.signer = signer;
        this.router = new ethers.Contract(UNISWAP_V2_ROUTER, UNISWAP_V2_ROUTER_ABI, signer);
    }

    // Get token info
    async getTokenInfo(tokenInput: string | { address: string; decimals: number; symbol: string }) {
        if (typeof tokenInput === 'string' && SEPOLIA_TOKENS[tokenInput.toUpperCase()]) {
            return SEPOLIA_TOKENS[tokenInput.toUpperCase()];
        }
        
        if (typeof tokenInput === 'string' && tokenInput.startsWith('0x')) {
            try {
                const contract = new ethers.Contract(tokenInput, ERC20_ABI, this.signer.provider);
                const [decimals, symbol] = await Promise.all([
                    contract.decimals(),
                    contract.symbol()
                ]);
                
                return {
                    address: tokenInput,
                    decimals: decimals,
                    symbol: symbol
                };
            } catch (error) {
                throw new Error(`Failed to get token info for ${tokenInput}: ${error.message}`);
            }
        }
        
        if (typeof tokenInput === 'object' && tokenInput.address) {
            return tokenInput;
        }
        
        throw new Error(`Invalid token input: ${tokenInput}. Use symbol (WETH, USDC) or address (0x...)`);
    }

    // Swap ETH for any token
    async swapETHForToken(tokenOut: string | { address: string; decimals: number; symbol: string }, ethAmount: ethers.BigNumber, slippage = 5) {
        const tokenOutInfo = await this.getTokenInfo(tokenOut);
        const wethInfo = await this.getTokenInfo('WETH');
        
        const path = [wethInfo.address, tokenOutInfo.address];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
        
        try {
            const amounts = await this.router.getAmountsOut(ethAmount, path);
            const expectedOut = amounts[1];
            const minOut = expectedOut.mul(100 - slippage).div(100);
            
            const tx = await this.router.swapExactETHForTokens(
                minOut,
                path,
                await this.signer.getAddress(),
                deadline,
                { value: ethAmount, gasLimit: 300000 }
            );
            
            await tx.wait();
            return { success: true, transactionHash: tx.hash, expectedOut };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Swap any token for ETH
    async swapTokenForETH(tokenIn: string | { address: string; decimals: number; symbol: string }, tokenAmount: ethers.BigNumber, slippage = 5) {
        const tokenInInfo = await this.getTokenInfo(tokenIn);
        const wethInfo = await this.getTokenInfo('WETH');
        
        await this.approveToken(tokenInInfo, tokenAmount);
        
        const path = [tokenInInfo.address, wethInfo.address];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
        
        try {
            const amounts = await this.router.getAmountsOut(tokenAmount, path);
            const expectedOut = amounts[1];
            const minOut = expectedOut.mul(100 - slippage).div(100);
            
            const tx = await this.router.swapExactTokensForETH(
                tokenAmount,
                minOut,
                path,
                await this.signer.getAddress(),
                deadline,
                { gasLimit: 300000 }
            );
            
            await tx.wait();
            return { success: true, transactionHash: tx.hash };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Swap any token for any other token
    async swapTokenForToken(tokenIn: string | { address: string; decimals: number; symbol: string }, tokenOut: string | { address: string; decimals: number; symbol: string }, tokenAmount: ethers.BigNumber, slippage = 5) {
        const tokenInInfo = await this.getTokenInfo(tokenIn);
        const tokenOutInfo = await this.getTokenInfo(tokenOut);
        const wethInfo = await this.getTokenInfo('WETH');
        
        await this.approveToken(tokenInInfo, tokenAmount);
        
        const path = [tokenInInfo.address, wethInfo.address, tokenOutInfo.address];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
        
        try {
            const amounts = await this.router.getAmountsOut(tokenAmount, path);
            const expectedOut = amounts[amounts.length - 1];
            const minOut = expectedOut.mul(100 - slippage).div(100);
            
            const tx = await this.router.swapExactTokensForTokens(
                tokenAmount,
                minOut,
                path,
                await this.signer.getAddress(),
                deadline,
                { gasLimit: 400000 }
            );
            
            await tx.wait();
            return { success: true, transactionHash: tx.hash };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Approve token for spending
    private async approveToken(tokenInfo: { address: string; decimals: number; symbol: string }, amount: ethers.BigNumber) {
        if (tokenInfo.symbol === 'ETH') return;
        
        try {
            const contract = new ethers.Contract(tokenInfo.address, ERC20_ABI, this.signer);
            const allowance = await contract.allowance(await this.signer.getAddress(), UNISWAP_V2_ROUTER);
            
            if (allowance.lt(amount)) {
                const tx = await contract.approve(UNISWAP_V2_ROUTER, ethers.constants.MaxUint256);
                await tx.wait();
            }
        } catch (error) {
            throw new Error(`Failed to approve ${tokenInfo.symbol}: ${error.message}`);
        }
    }
} 