/**
 * Web3 Clients (Viem)
 *
 * Public client for read operations
 * Wallet client template for write operations
 */

import { createPublicClient, http, PublicClient } from "viem";
import { sepolia } from "viem/chains";
import { CHAINS } from "@/src/config/contracts";

/**
 * Public client for read-only operations
 * Uses free RPC endpoints
 */
export const publicClient: PublicClient = createPublicClient({
  chain: {
    ...sepolia,
    rpcUrls: {
      default: {
        http: ["https://sepolia.gateway.tenderly.co"],
      },
      public: {
        http: ["https://rpc.sepolia.org"],
      },
    },
  },
  transport: http(),
});

/**
 * Get a block explorer URL for an address or transaction
 */
export const getExplorerUrl = (type: "address" | "tx", hash: string): string => {
  const baseUrl = "https://sepolia.etherscan.io";
  return `${baseUrl}/${type}/${hash}`;
};
