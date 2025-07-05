

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590388143860-6594f1fbc1f4?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
            🔍 <span className="text-orange-300">EulerSwap</span> Ecosystem Query Hub
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The ultimate one-stop platform for querying all EulerSwap ecosystem data across multiple networks. 
            Get real-time insights into vaults, prices, strategies, and more.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-orange-300 text-black px-6 py-3 rounded-full font-medium hover:bg-orange-400 transition-colors">
              🚀 Explore Data
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors">
              📖 View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">🎯 What We Do</h2>
          <p className="text-xl text-gray-400 mb-8">
            &quot;Your Complete Gateway to EulerSwap Ecosystem Data&quot;
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto">
            We provide comprehensive data querying capabilities for the entire EulerSwap ecosystem, 
            enabling developers, analysts, and users to access real-time information across multiple networks.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "Multi-network data querying (Ethereum, BSC, Polygon, Optimism, Arbitrum, Base)",
            "Real-time vault information and performance metrics",
            "Price feeds from Pyth Network and off-chain sources",
            "GraphQL API for complex data queries and analytics"
          ].map((feature, index) => (
            <div key={index} className="bg-black p-6 rounded-lg shadow-lg border-2 border-orange-300 hover:bg-orange-300 hover:text-black transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <p className="text-orange-300 hover:text-black transition-colors duration-300">✅ {feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12">🔧 Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-orange-300">📊 GraphQL Explorer</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Query vault statuses across networks</li>
              <li>• Access Euler vault data and borrows</li>
              <li>• Real-time data with GraphQL interface</li>
              <li>• Custom queries for specific use cases</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-orange-300">🔍 Lens Contract Queries</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• UtilsLens for ERC-4626 vault data</li>
              <li>• VaultLens for detailed vault information</li>
              <li>• EulerEarnVaultLens for strategy data</li>
              <li>• APYs, balances, and price lookups</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-orange-300">💰 Price Feeds</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Pyth Network price feeds</li>
              <li>• Off-chain price data sources</li>
              <li>• Verified vault price information</li>
              <li>• Multi-source price aggregation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">🚀 How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-orange-300 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-black">1. Select Network & Data Type</h3>
            <ul className="text-black space-y-2">
              <li>• Choose from 6 supported networks</li>
              <li>• Pick your data source (GraphQL, Lens, Pyth)</li>
              <li>• Specify query parameters</li>
            </ul>
          </div>
          <div className="bg-orange-300 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-black">2. Execute Queries</h3>
            <ul className="text-black space-y-2">
              <li>• Real-time contract calls</li>
              <li>• GraphQL endpoint queries</li>
              <li>• Price feed aggregations</li>
            </ul>
          </div>
          <div className="bg-orange-300 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-black">3. Get Insights</h3>
            <ul className="text-black space-y-2">
              <li>• Formatted JSON responses</li>
              <li>• Real-time data visualization</li>
              <li>• Export capabilities for analysis</li>
            </ul>
          </div>
        </div>
      </section>


    </div>
  );
}
