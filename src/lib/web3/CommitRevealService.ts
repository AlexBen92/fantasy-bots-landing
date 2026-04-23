/**
 * CommitReveal Service
 *
 * Read functions for the CommitReveal contract
 */

import { getContract } from "viem";
import { publicClient } from "./clients";
import { CONTRACTS } from "@/src/config/contracts";
import CommitRevealAbi from "@/src/lib/contracts/CommitReveal.abi.json";

export interface CommitmentInfo {
  committer: string;
  commitBlock: bigint;
  revealDeadline: bigint;
  revealed: boolean;
}

export class CommitRevealService {
  private contract = getContract({
    address: CONTRACTS.CommitReveal,
    abi: CommitRevealAbi,
    client: publicClient,
  });

  /**
   * Get current nonce
   */
  async getNonce(): Promise<number> {
    const nonce = await this.contract.read.nonce();
    return Number(nonce);
  }

  /**
   * Get reveal delay configuration
   */
  async getRevealDelays(): Promise<{ minRevealDelay: number; maxRevealDelay: number }> {
    const [min, max] = await Promise.all([
      this.contract.read.minRevealDelay() as Promise<bigint>,
      this.contract.read.maxRevealDelay() as Promise<bigint>,
    ]);

    return {
      minRevealDelay: Number(min),
      maxRevealDelay: Number(max),
    };
  }

  /**
   * Get commitment info for a specific committer
   */
  async getCommitment(committer: string): Promise<CommitmentInfo> {
    const info = await this.contract.read.commitments([committer as `0x${string}`]) as readonly [bigint, bigint, boolean];

    return {
      committer,
      commitBlock: info[0],
      revealDeadline: info[1],
      revealed: info[2],
    };
  }
}

// Singleton instance
let serviceInstance: CommitRevealService | null = null;

export const getCommitRevealService = (): CommitRevealService => {
  if (!serviceInstance) {
    serviceInstance = new CommitRevealService();
  }
  return serviceInstance;
};
