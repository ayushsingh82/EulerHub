# EulerHub - EulerSwap Ecosystem Query Hub



Advanced DeFi ecosystem query platform built on Euler Finance. Comprehensive data querying capabilities across multiple networks for vaults, prices, strategies, and more.

## 🚀 Features

### 📊 Data Analytics
- Real-time vault performance tracking
- Risk assessment and monitoring
- Yield analysis and recommendations
- Historical data analysis

### 🔍 Query Capabilities
- Multi-network data querying
- Real-time contract interactions
- Comprehensive data aggregation
- Unified query interface

### 💰 Multi-Network Support
- Cross-chain data access
- Network-specific optimizations
- Comprehensive network coverage
- Unified dashboard experience

### 🔍 Data Querying Capabilities
- **GraphQL Explorer**: Query vault statuses, Euler vault data, borrows, and liquidate data across networks
- **Lens Contract Queries**: UtilsLens, VaultLens, and EulerEarnVaultLens for detailed vault information
- **Off-Chain Price Feeds**: Real-time market prices from Euler Finance API
- **Verified Vaults**: Comprehensive vault information and performance metrics
- **Vault Addresses**: Complete database of vault addresses with filtering and search

## 🌐 Supported Networks

- **Ethereum Mainnet** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **Optimism** (Chain ID: 10)
- **Arbitrum** (Chain ID: 42161)
- **Base** (Chain ID: 8453)
- **BSC** (Chain ID: 56)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem
- **Wallet Connection**: WalletConnect v2
- **State Management**: React Hooks
- **Data Fetching**: GraphQL, REST APIs
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### WalletConnect Setup
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID
4. Add it to your `.env.local` file

### Network Configuration
The app supports multiple networks out of the box. Network configurations are defined in:
- `src/utils/chains.ts` - Chain configurations
- `src/utils/eulerPriceUtils.ts` - Price feed networks
- `src/utils/graphqlHelpers.ts` - GraphQL endpoints

## 📱 Pages & Features

### 🏠 Home Page
- Hero section with ecosystem query hub overview
- Feature highlights
- How it works guide
- Call-to-action buttons

### 📊 GraphQL Explorer
- Network and query type selection
- Vault statuses, Euler vaults, borrows, and liquidate queries
- Real-time data display
- Query documentation

### 🔍 Lens Contract Queries
- Chain and lens type selection
- UtilsLens, VaultLens, EulerEarnVaultLens
- Real-time contract data fetching
- Formatted results display

### 💰 Off-Chain Price Feeds
- Real-time market prices from Euler Finance API
- Single and multiple asset queries
- Common asset quick actions
- Price difference calculations

### ✅ Verified Vaults
- Multi-network vault verification
- Vault performance metrics
- Risk assessment data
- Real-time status updates

### 📍 Vault Addresses
- Comprehensive vault database
- Search and filtering capabilities
- Copy-to-clipboard functionality
- Network-specific vault lists

## 🎨 UI/UX Features

- **Dark Theme**: Black and orange color scheme
- **Responsive Design**: Mobile-first approach
- **Interactive Elements**: Hover effects and transitions
- **Loading States**: User feedback during data fetching
- **Error Handling**: Graceful error display and recovery
- **Accessibility**: WCAG compliant components

## 🔒 Security Features

- **Wallet Integration**: Secure wallet connection via WalletConnect
- **Input Validation**: Comprehensive form validation
- **Error Boundaries**: React error boundaries for crash prevention
- **Type Safety**: Full TypeScript coverage
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 📈 Performance

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js built-in image optimization
- **Caching**: Strategic caching for API responses
- **Bundle Analysis**: Built-in bundle analyzer
- **Lighthouse Score**: Optimized for performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the inline code comments and component documentation
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions

## 🔗 Links

- **Website**: [EulerHub](https://eulerhub.xyz)
- **Documentation**: [Euler Finance Docs](https://docs.euler.finance/)
- **API Reference**: [Euler Finance API](https://app.euler.finance/api/v1/)
- **Community**: [Euler Finance Discord](https://discord.gg/eulerfinance)

## 🙏 Acknowledgments

- [Euler Finance](https://euler.finance/) for the underlying protocol
- [Next.js](https://nextjs.org/) for the amazing framework
- [Wagmi](https://wagmi.sh/) for Web3 integration
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [WalletConnect](https://walletconnect.com/) for wallet integration

---

**Built with ❤️ for the DeFi community** 