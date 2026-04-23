"use client";

/**
 * Dashboard Page
 *
 * Web3 dashboard with contract status and trading controls
 */

import { WalletButton } from "@/src/components/web3/WalletButton";
import { ContractStatus } from "@/src/components/web3/ContractStatus";
import { TradingPanel } from "@/src/components/web3/TradingPanel";
import { NetworkStatus } from "@/src/components/web3/NetworkStatus";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-crypto-darker">
      {/* Header */}
      <header className="border-b border-crypto-border bg-crypto-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">Arbitrage X</h1>
            <span className="text-xs text-gray-500">Dashboard</span>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Network Status */}
        <NetworkStatus />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Contract Status */}
          <ContractStatus />

          {/* Trading Panel */}
          <TradingPanel />
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-crypto-card border border-crypto-border rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">ℹ️ How to Use</h2>
          <ol className="space-y-2 text-gray-400 text-sm">
            <li>1. Connect your wallet using MetaMask or WalletConnect</li>
            <li>2. Make sure you're on Sepolia testnet</li>
            <li>3. View real-time contract status and volatility data</li>
            <li>4. Simulate trades before executing (testnet only)</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
