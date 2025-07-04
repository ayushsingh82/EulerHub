import Image from "next/image";

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
            🔁 Automated <span className="text-orange-300">Rebalancing</span> for DeFi Portfolios on EulerSwap
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Maximize your capital efficiency with smart, non-custodial, and strategy-driven portfolio rebalancing — powered by EulerSwap.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors">
              🚀 Launch App
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors">
              📖 Learn How It Works
            </button>
          </div>
        </div>
      </section>

      {/* What Is It Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">🧩 What Is It?</h2>
          <p className="text-xl text-gray-400 mb-8">
            "A Protocol That Keeps Your Portfolio in Check — Automatically."
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto">
            We help DeFi users and protocols maintain their desired token allocations by rebalancing their positions based on strategy, time, or market conditions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "Built on top of EulerSwap's liquidity infrastructure",
            "Fully on-chain, non-custodial, and open-source",
            "Supports uncorrelated and volatile asset pairs",
            "Compatible with DAO treasuries, passive investors, and active traders"
          ].map((feature, index) => (
            <div key={index} className="bg-orange-300 p-6 rounded-lg shadow-lg border-2 border-black">
              <p className="text-black">✅ {feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">🧠 How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-orange-300 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-black">Choose a Rebalancing Strategy</h3>
            <ul className="text-black space-y-2">
              <li>• Time-based (e.g., every 24 hours)</li>
              <li>• Threshold-based (e.g., &gt;10% drift)</li>
              <li>• Volatility-aware or hybrid</li>
            </ul>
          </div>
          <div className="bg-orange-300 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-black">Deposit Token Pair</h3>
            <ul className="text-gray-800 space-y-2">
              <li>• Example: $ETH / $USDC or $WBTC / $stETH</li>
              <li>• Define desired allocation (e.g., 60/40)</li>
            </ul>
          </div>
          <div className="bg-orange-300 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-black">Smart Rebalancing</h3>
            <ul className="text-gray-800 space-y-2">
              <li>• On-chain keeper or user triggers rebalance</li>
              <li>• Uses EulerSwap's deep liquidity</li>
              <li>• Optional: Fees go to treasury, vault owners, or reinvested</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
