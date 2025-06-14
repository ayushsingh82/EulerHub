import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EulerSwap Rebalancing Protocol",
  description: "Automated Rebalancing for DeFi Portfolios on EulerSwap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-sm border-b border-gray-800 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold">EulerSwap</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
                  <a href="#how-it-works" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">How It Works</a>
                  <a href="#use-cases" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Use Cases</a>
                  <a href="#docs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Docs</a>
                  <button className="bg-orange-300 text-black px-4 py-2 rounded-full text-md font-medium hover:bg-gray-200">
                    Launch App
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
