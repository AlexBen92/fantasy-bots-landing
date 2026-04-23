/**
 * RiskManager Service
 *
 * Read functions for the RiskManager contract
 */

import { getContract } from "viem";
import { publicClient } from "./clients";
import { CONTRACTS } from "@/src/config/contracts";
import RiskManagerAbi from "@/src/lib/contracts/RiskManager.abi.json";

export interface RiskLimits {
  maxPositionSize: bigint;
  maxOpenExposure: bigint;
  maxLeverage: number;
  maxDrawdown: number;
  dailyLossLimit: bigint;
  maxGamma: bigint;
  maxVega: bigint;
  maxDelta: bigint;
}

export interface RiskState {
  currentExposure: bigint;
  delta: bigint;
  gamma: bigint;
  vega: bigint;
  dailyLoss: number;
}

export interface RegimeLimits {
  0: bigint; // LOW
  1: bigint; // NORMAL
  2: bigint; // ELEVATED
  3: bigint; // EXTREME
}

export class RiskManagerService {
  private contract = getContract({
    address: CONTRACTS.RiskManager,
    abi: RiskManagerAbi,
    client: publicClient,
  });

  /**
   * Get all risk limits
   */
  async getRiskLimits(): Promise<RiskLimits> {
    const limits = await this.contract.read.getRiskLimits() as {
      maxPositionSize: bigint;
      maxOpenExposure: bigint;
      maxLeverage: bigint;
      maxDrawdown: bigint;
      dailyLossLimit: bigint;
      maxGamma: bigint;
      maxVega: bigint;
      maxDelta: bigint;
    };

    return {
      maxPositionSize: limits.maxPositionSize,
      maxOpenExposure: limits.maxOpenExposure,
      maxLeverage: Number(limits.maxLeverage),
      maxDrawdown: Number(limits.maxDrawdown),
      dailyLossLimit: limits.dailyLossLimit,
      maxGamma: limits.maxGamma,
      maxVega: limits.maxVega,
      maxDelta: limits.maxDelta,
    };
  }

  /**
   * Get current risk state (exposure, greeks, daily loss)
   */
  async getRiskState(): Promise<RiskState> {
    const state = await this.contract.read.getRiskState() as {
      currentExposure: bigint;
      delta: bigint;
      gamma: bigint;
      vega: bigint;
      dailyLoss: bigint;
    };

    return {
      currentExposure: state.currentExposure,
      delta: state.delta,
      gamma: state.gamma,
      vega: state.vega,
      dailyLoss: Number(state.dailyLoss),
    };
  }

  /**
   * Check if contract is paused
   */
  async isPaused(): Promise<boolean> {
    return await this.contract.read.paused() as boolean;
  }

  /**
   * Check if circuit breaker is active
   */
  async isCircuitBreakerActive(): Promise<boolean> {
    return await this.contract.read.isCircuitBreakerActive() as boolean;
  }

  /**
   * Get regime-based position limit
   */
  async getRegimeMaxPosition(regime: 0 | 1 | 2 | 3): Promise<bigint> {
    return await this.contract.read.regimeMaxPosition([regime]) as bigint;
  }

  /**
   * Get all regime limits at once
   */
  async getAllRegimeLimits(): Promise<RegimeLimits> {
    const [limit0, limit1, limit2, limit3] = await Promise.all([
      this.contract.read.regimeMaxPosition([0]) as Promise<bigint>,
      this.contract.read.regimeMaxPosition([1]) as Promise<bigint>,
      this.contract.read.regimeMaxPosition([2]) as Promise<bigint>,
      this.contract.read.regimeMaxPosition([3]) as Promise<bigint>,
    ]);

    return {
      0: limit0,
      1: limit1,
      2: limit2,
      3: limit3,
    };
  }

  /**
   * Get peak equity (for drawdown calculation)
   */
  async getPeakEquity(): Promise<bigint> {
    return await this.contract.read.peakEquity() as bigint;
  }

  /**
   * Check if an address is an authorized caller
   */
  async isCaller(address: string): Promise<boolean> {
    return await this.contract.read.isCaller([address as `0x${string}`]) as boolean;
  }

  /**
   * Get admin address
   */
  async getAdmin(): Promise<string> {
    return await this.contract.read.admin() as `0x${string}`;
  }

  /**
   * Get current position
   */
  async getCurrentPosition(): Promise<bigint> {
    const state = await this.contract.read.getRiskState() as { currentExposure: bigint };
    return state.currentExposure;
  }
}

// Singleton instance
let riskManagerService: RiskManagerService | null = null;

export const getRiskManagerService = () => {
  if (!riskManagerService) {
    riskManagerService = new RiskManagerService();
  }
  return riskManagerService;
};
