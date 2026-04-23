"use client";

/**
 * useWeb3Modal Hook
 *
 * Wraps RainbowKit for wallet connection
 * Note: This is a simplified version that reads wallet state
 * Full write functionality requires RainbowKit provider setup
 */

import { useEffect, useState } from "react";

export type WalletState = {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectChain: boolean;
};

export function useWeb3Modal() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isCorrectChain: false,
  });

  const [isConnecting, setIsConnecting] = useState(false);

  // This will be populated by RainbowKit once configured
  // For now, it's a placeholder structure
  useEffect(() => {
    // TODO: Populate from RainbowKit context
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      // RainbowKit will handle this through its UI
      console.log("Connect wallet - will be handled by RainbowKit");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      // RainbowKit will handle this
      console.log("Disconnect wallet - will be handled by RainbowKit");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const switchChain = async (targetChainId: number) => {
    try {
      // RainbowKit/wagmi will handle this
      console.log("Switch chain to:", targetChainId);
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  return {
    ...walletState,
    isConnecting,
    connect,
    disconnect,
    switchChain,
  };
}
