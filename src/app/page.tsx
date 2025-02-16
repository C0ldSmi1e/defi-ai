const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            ⚡NGMG
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-white">
            The Ultimate On-Chain Crypto Intel Hub
          </p>
          <p className="text-xl md:text-2xl font-semibold text-blue-400">
            Own the Market. Move First.
          </p>
        </div>
        
        <p className="max-w-2xl text-lg text-gray-300">
          NGMG is your <span className="text-blue-400 font-semibold">alpha weapon</span>—an elite network of <span className="text-purple-400 font-semibold">DeFi AI agents</span> tracking the entire crypto landscape. Get <span className="text-blue-400">real-time alpha</span>, <span className="text-purple-400">KOL insights</span>, <span className="text-blue-400">whale moves</span>, and <span className="text-purple-400">on-chain signals</span>—all in one place. Trade with the best <span className="text-blue-400 font-semibold">AI agents</span> that can read gmgn, devs, and more.
        </p>
      </div>

      {/* Demo Videos Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-12">
          {/* Demo 1 - Contract Analysis */}
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-4">
                  🔍 Smart Contract Analysis
                </h3>
                <p className="text-gray-300 mb-4">
                  Watch our AI agents perform deep analysis of any contract address in real-time. Get instant insights about:
                </p>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-400">•</span>
                    <span>Token fundamentals and market metrics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-purple-400">•</span>
                    <span>Current market sentiment and trends</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-400">•</span>
                    <span>Personalized investment recommendations</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
                <video 
                  className="w-full h-full object-cover"
                  controls
                  muted 
                  playsInline
                >
                  <source src="/videos/demo1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* Demo 2 - Behind the Scenes */}
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2 space-y-6 lg:order-2">
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-4">
                  ⚡ Behind the Scenes
                </h3>
                <p className="text-gray-300 mb-4">
                  See how our AI agents work behind the scenes to gather intelligence:
                </p>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li className="flex items-center space-x-2">
                    <span className="text-purple-400">•</span>
                    <span>Real-time GMGN monitoring and analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-400">•</span>
                    <span>Multi-source data aggregation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-purple-400">•</span>
                    <span>Intelligent signal processing</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full lg:w-1/2 lg:order-1">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
                <video 
                  className="w-full h-full object-cover"
                  controls
                  muted 
                  playsInline
                >
                  <source src="/videos/demo2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Real-Time Crypto Intel */}
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
            <h2 className="text-2xl font-bold text-white mb-6">🌪️ Real-Time Crypto Intel</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-blue-400">📡</span>
                <span><strong className="text-blue-400">24/7 Alpha Radar</strong> – Track major fund flows, scan on-chain activity, catch insider moves.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-400">⚡</span>
                <span><strong className="text-purple-400">KOL Signals</strong> – Direct feeds from top voices in crypto. No noise, just signal.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-400">🔮</span>
                <span><strong className="text-blue-400">Predictive AI</strong> – Let NGMG&apos;s AI agents analyze sentiment, trends, and market shifts—before they happen.</span>
              </li>
            </ul>
          </div>

          {/* CEX + DEX Unified */}
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-all">
            <h2 className="text-2xl font-bold text-white mb-6">🔥 CEX + DEX Unified</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-purple-400">📊</span>
                <span><strong className="text-purple-400">Exchange-Wide Insights</strong> – CEX & DEX data, all in one dashboard.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-400">🐋</span>
                <span><strong className="text-blue-400">Whale Watching</strong> – Track big players, monitor liquidity moves, and act fast.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-400">🚨</span>
                <span><strong className="text-purple-400">Smart Alerts</strong> – Detect market-changing events instantly.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Access Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-8 rounded-xl border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6">🎟️ Access NGMG</h2>
          <p className="text-xl text-gray-300 mb-6">NGMG is <span className="text-blue-400 font-semibold">invite-only</span>.</p>
          <div className="space-y-4 max-w-xl mx-auto text-gray-300">
            <p>Holding an <span className="text-purple-400 font-semibold">Access Pass</span> unlocks:</p>
            <ul className="space-y-2">
              <li>✅ Your personal AI swarm of DeFi agents</li>
              <li>✅ Exclusive NGMG Network intel</li>
              <li>✅ Early access to cutting-edge tools</li>
            </ul>
          </div>
          <button className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all" disabled>
            🚀 Want in? Secure your access now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;