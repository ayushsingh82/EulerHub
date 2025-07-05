

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
            🔍 <span className="text-orange-300">EulerHub</span> Portfolio Rebalancing Protocol
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Advanced DeFi portfolio rebalancing protocol built on Euler Finance. 
            Automated strategies for optimal yield and risk management.
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
            &quot;Advanced DeFi Portfolio Rebalancing Protocol&quot;
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto">
            We provide automated portfolio rebalancing strategies for the Euler Finance ecosystem, 
            enabling users to optimize yields and manage risk across multiple networks.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "Multi-network portfolio rebalancing (Ethereum, BSC, Polygon, Optimism, Arbitrum, Base)",
            "Automated yield optimization strategies",
            "Risk management and position monitoring",
            "Real-time portfolio analytics and insights"
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
            <h3 className="text-xl font-semibold mb-4 text-orange-300">📊 Portfolio Analytics</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Real-time portfolio performance tracking</li>
              <li>• Risk assessment and monitoring</li>
              <li>• Yield optimization recommendations</li>
              <li>• Historical performance analysis</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-orange-300">🤖 Automated Strategies</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Smart rebalancing algorithms</li>
              <li>• Dynamic position management</li>
              <li>• Risk-adjusted yield strategies</li>
              <li>• Automated execution protocols</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-orange-300">💰 Multi-Network Support</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Cross-chain portfolio management</li>
              <li>• Network-specific optimizations</li>
              <li>• Gas-efficient rebalancing</li>
              <li>• Unified dashboard experience</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">🚀 How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-orange-300 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-black">1. Connect Portfolio</h3>
            <ul className="text-black space-y-2">
              <li>• Connect your wallet across networks</li>
              <li>• Import existing DeFi positions</li>
              <li>• Set risk tolerance parameters</li>
            </ul>
          </div>
          <div className="bg-orange-300 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-black">2. Configure Strategy</h3>
            <ul className="text-black space-y-2">
              <li>• Choose rebalancing frequency</li>
              <li>• Set target allocations</li>
              <li>• Define risk management rules</li>
            </ul>
          </div>
          <div className="bg-orange-300 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-black">3. Automated Execution</h3>
            <ul className="text-black space-y-2">
              <li>• Smart contract execution</li>
              <li>• Gas-optimized transactions</li>
              <li>• Real-time monitoring & alerts</li>
            </ul>
          </div>
        </div>
      </section>


    </div>
  );
}
