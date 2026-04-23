/**
 * SqueethArbExecutor Service
 *
 * Read and write functions for the SqueethArbExecutor contract
 */

import { getContract } from "viem";
import { publicClient } from "./clients";
import { CONTRACTS } from "@/src/config/contracts";
import SqueethArbExecutorAbi from "@/src/lib/contracts/SqueethArbExecutor.abi.json";

export type TradeType = 0 | 1 | 2 | 3; // OPEN_LONG | OPEN_SHORT | CLOSE_LONG | CLOSE_SHORT

export interface TradeSignal {
  tradeType: TradeType;
  quantity: bigint;
  maxSlippage: number;
  deadline: bigint;
  signalHash: `0x${string}`;
}

export interface TradeResult {
  success: boolean;
  executedQuantity: bigint;
  avgPrice: bigint;
  totalCost: bigint;
  reason: string;
}

export interface PositionDetails {
  position: bigint;
  maxPosition: bigint;
  timeUntilCooldown: bigint;
}

export class SqueethExecutorService {
  private contract = getContract({
    address: CONTRACTS.SqueethArbExecutor,
    abi: SqueethArbExecutorAbi,
    client: publicClient,
  });

  /**
   * Get current position details
   */
  async getPositionDetails(): Promise<PositionDetails> {
    const details = await this.contract.read.getPositionDetails() as readonly [bigint, bigint, bigint];

    return {
      position: details[0],
      maxPosition: details[1],
      timeUntilCooldown: details[2],
    };
  }

  /**
   * Get current position (absolute value)
   */
  async getCurrentPosition(): Promise<bigint> {
    return await this.contract.read.currentPositions() as bigint;
  }

  /**
   * Get total trades executed
   */
  async getTotalTrades(): Promise<number> {
    const trades = await this.contract.read.totalTrades() as bigint;
    return Number(trades);
  }

  /**
   * Check if contract is paused
   */
  async isPaused(): Promise<boolean> {
    return await this.contract.read.paused() as boolean;
  }

  /**
   * Get maximum position size
   */
  async getMaxPositionSize(): Promise<bigint> {
    return await this.contract.read.maxPositionSize() as bigint;
  }

  /**
   * Get cooldown period in seconds
   */
  async getCooldownPeriod(): Promise<number> {
    const cooldown = await this.contract.read.cooldownPeriod() as bigint;
    return Number(cooldown);
  }

  /**
   * Get signal caller address
   */
  async getSignalCaller(): Promise<string> {
    return await this.contract.read.signalCaller() as `0x${string}`;
  }

  /**
   * Check if an address is the signal caller
   */
  async isSignalCaller(address: string): Promise<boolean> {
    const caller = await this.contract.read.signalCaller() as `0x${string}`;
    return caller.toLowerCase() === address.toLowerCase();
  }

  /**
   * Get risk manager address
   */
  async getRiskManager(): Promise<string> {
    return await this.contract.read.riskManager() as `0x${string}`;
  }

  /**
   * Get volatility oracle address
   */
  async getVolatilityOracle(): Promise<string> {
    return await this.contract.read.volatilityOracle() as `0x${string}`;
  }

  /**
   * Get squeeth pool address
   */
  async getSqueethPool(): Promise<string> {
    return await this.contract.read.squeethPool() as `0x${string}`;
  }

  /**
   * Get owner address
   */
  async getOwner(): Promise<string> {
    return await this.contract.read.owner() as `0x${string}`;
  }

  /**
   * Simulate a trade (gas-free preview)
   */
  async simulateTrade(signal: TradeSignal): Promise<TradeResult> {
    const result = await this.contract.read.simulateTrade([signal]) as {
      success: boolean;
      executedQuantity: bigint;
      avgPrice: bigint;
      totalCost: bigint;
      reason: string;
    };

    return {
      success: result.success,
      executedQuantity: result.executedQuantity,
      avgPrice: result.avgPrice,
      totalCost: result.totalCost,
      reason: result.reason,
    };
  }

  /**
   * Get last signal time
   */
  async getLastSignalTime(): Promise<number> {
    const time = await this.contract.read.lastSignalTime() as bigint;
    return Number(time);
  }
}

// Singleton instance
let executorService: SqueethExecutorService | null = null;

export const getExecutorService = () => {
  if (!executorService) {
    executorService = new SqueethExecutorService();
  }
  return executorService;
};
