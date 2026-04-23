"use client";

/**
 * Network Status Component
 *
 * Displays current network connection status and warnings
 */

import { useAccount, useChainId } from "wagmi";
import { SEPOLIA_CHAIN_ID } from "@/src/config/contracts";

export function NetworkStatus() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const isCorrectChain = chainId === SEPOLIA_CHAIN_ID;

  return (
    <div className="bg-crypto-card border border-crypto-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-400">Network Status</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${
              isConnected && isCorrectChain
                ? "bg-green-500"
                : isConnected
                ? "bg-yellow-500 animate-pulse"
                : "bg-gray-500"
            }`}></span>
            <span className="text-white font-medium">
              {isConnected
                ? isCorrectChain
                  ? "Sepolia Testnet"
                  : "Wrong Network"
                : "Not Connected"}
            </span>
          </div>
        </div>

        {isConnected && address && (
          <div className="text-right">
            <div className="text-xs text-gray-500">Connected as</div>
            <div className="text-sm text-gray-300 font-mono">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </div>
          </div>
        )}
      </div>

      {!isCorrectChain && isConnected && (
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ Please switch to Sepolia testnet to interact with contracts.
          </p>
        </div>
      )}
    </div>
  );
}
