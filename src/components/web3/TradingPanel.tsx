"use client";

/**
 * Trading Panel Component
 *
 * Displays trading controls and simulation results
 * Read-only mode - actual writes require wallet connection
 */

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { CONTRACTS, SEPOLIA_CHAIN_ID } from "@/src/config/contracts";
import { usePositionData } from "@/hooks";
import SqueethArbExecutorAbi from "@/src/lib/contracts/SqueethArbExecutor.abi.json";
import type { TradeType } from "@/src/lib/web3";

const TRADE_TYPES: { id: TradeType; name: string; description: string }[] = [
  { id: 0, name: "Open Long", description: "Open a long position" },
  { id: 1, name: "Open Short", description: "Open a short position" },
  { id: 2, name: "Close Long", description: "Close long position" },
  { id: 3, name: "Close Short", description: "Close short position" },
];

export function TradingPanel() {
  const { position } = usePositionData();
  const { address, chainId } = useAccount();
  const { isConnected } = useAccount();

  const [selectedTrade, setSelectedTrade] = useState<TradeType>(0);
  const [quantity, setQuantity] = useState("1");
  const [slippage, setSlippage] = useState("0.5");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const isCorrectChain = chainId === SEPOLIA_CHAIN_ID;
  const canExecute = isConnected && isCorrectChain;

  // Write contract hooks
  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSimulate = async () => {
    if (!canExecute) return;

    setIsSimulating(true);
    try {
      // Simulation would happen through a read function
      // For now, mock result
      setSimulationResult({
        success: true,
        executedQuantity: parseEther(quantity),
        avgPrice: parseEther("3000"),
        totalCost: parseEther((parseFloat(quantity) * 3000).toString()),
        reason: "",
      });
    } catch (error) {
      console.error("Simulation failed:", error);
      setSimulationResult({ success: false, reason: "Simulation failed" });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleExecute = () => {
    if (!canExecute) return;

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now

    writeContract({
      address: CONTRACTS.SqueethArbExecutor,
      abi: SqueethArbExecutorAbi,
      functionName: "executeSignal",
      args: [{
        tradeType: selectedTrade,
        quantity: parseEther(quantity),
        maxSlippage: parseFloat(slippage) * 100, // Convert to basis points
        deadline: deadline,
        signalHash: `0x${"0".repeat(64)}`, // Mock signal hash
      }],
    });
  };

  return (
    <div className="bg-crypto-card border border-crypto-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Execution Controls</h3>

      {!canExecute && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
          <p className="text-yellow-400 text-sm">
            {isConnected
              ? "Please switch to Sepolia testnet"
              : "Please connect your wallet to execute trades"}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Trade Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Trade Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TRADE_TYPES.map((trade) => (
              <button
                key={trade.id}
                onClick={() => setSelectedTrade(trade.id)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedTrade === trade.id
                    ? "bg-primary-600 text-white"
                    : "bg-crypto-dark text-gray-400 hover:bg-crypto-dark/80 border border-crypto-border"
                }`}
              >
                <div className="font-medium">{trade.name}</div>
                <div className="text-xs opacity-80">{trade.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Quantity (contracts)
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0.1"
            step="0.1"
            className="w-full bg-crypto-dark border border-crypto-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            disabled={!canExecute}
          />
        </div>

        {/* Slippage Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Max Slippage (%)
          </label>
          <input
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            min="0.01"
            max="10"
            step="0.01"
            className="w-full bg-crypto-dark border border-crypto-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            disabled={!canExecute}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSimulate}
            disabled={!canExecute || isSimulating}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
          >
            {isSimulating ? "Simulating..." : "Simulate"}
          </button>
          <button
            onClick={handleExecute}
            disabled={!canExecute || isPending || isConfirming}
            className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-500 hover:to-accent-400 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg font-medium transition-all"
          >
            {isPending || isConfirming ? "Executing..." : "Execute"}
          </button>
        </div>

        {/* Simulation Result */}
        {simulationResult && (
          <div className={`p-4 rounded-lg ${
            simulationResult.success
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}>
            <h4 className="font-medium mb-2">
              {simulationResult.success ? "✓ Simulation Successful" : "✗ Simulation Failed"}
            </h4>
            {simulationResult.success && (
              <div className="text-sm space-y-1">
                <div>Quantity: {Number(simulationResult.executedQuantity) / 1e18} contracts</div>
                <div>Avg Price: {Number(simulationResult.avgPrice) / 1e18} ETH</div>
                <div>Est. Cost: {Number(simulationResult.totalCost) / 1e18} ETH</div>
              </div>
            )}
            {!simulationResult.success && (
              <div className="text-sm text-red-400">{simulationResult.reason}</div>
            )}
          </div>
        )}

        {/* Transaction Status */}
        {isSuccess && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm">✓ Transaction executed successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
}
