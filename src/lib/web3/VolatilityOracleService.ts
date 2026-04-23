/**
 * VolatilityOracle Service
 *
 * Read functions for the VolatilityOracle contract
 */

import { getContract } from "viem";
import { publicClient } from "./clients";
import { CONTRACTS } from "@/src/config/contracts";
import VolatilityOracleAbi from "@/src/lib/contracts/VolatilityOracle.abi.json";

export interface VolatilityData {
  variance: bigint;
  volatility: bigint;
  confidence: number;
  regime: number;
  timestamp: bigint;
  ethPrice: bigint;
}

export interface OracleConfig {
  maxDataAge: bigint;
  minUpdateInterval: bigint;
  version: bigint;
}

export class VolatilityOracleService {
  private contract = getContract({
    address: CONTRACTS.VolatilityOracle,
    abi: VolatilityOracleAbi,
    client: publicClient,
  });

  /**
   * Get the latest volatility data from the oracle
   */
  async getLatestVolatility(): Promise<VolatilityData> {
    const data = await this.contract.read.latestData() as {
      variance: bigint;
      volatility: bigint;
      confidence: bigint;
      regime: bigint;
      timestamp: bigint;
      ethPrice: bigint;
    };

    return {
      variance: data.variance,
      volatility: data.volatility,
      confidence: Number(data.confidence),
      regime: Number(data.regime),
      timestamp: data.timestamp,
      ethPrice: data.ethPrice,
    };
  }

  /**
   * Get the current volatility regime
   * 0 = LOW, 1 = NORMAL, 2 = ELEVATED, 3 = EXTREME
   */
  async getRegime(): Promise<number> {
    const regime = await this.contract.read.getRegime() as bigint;
    return Number(regime);
  }

  /**
   * Check if the oracle data is fresh
   */
  async isFresh(): Promise<boolean> {
    const isFresh = await this.contract.read.isFresh() as readonly [boolean, ...unknown[]];
    return isFresh[0];
  }

  /**
   * Get variance with staleness check
   */
  async getVarianceWithCheck(): Promise<{ variance: bigint; isStale: boolean }> {
    const result = await this.contract.read.getVarianceWithCheck() as { variance: bigint; isStale: boolean };
    return {
      variance: result.variance,
      isStale: result.isStale,
    };
  }

  /**
   * Get oracle configuration
   */
  async getConfig(): Promise<OracleConfig> {
    const [maxDataAge, minUpdateInterval, version] = await Promise.all([
      this.contract.read.maxDataAge() as Promise<bigint>,
      this.contract.read.minUpdateInterval() as Promise<bigint>,
      this.contract.read.version() as Promise<bigint>,
    ]);

    return { maxDataAge, minUpdateInterval, version };
  }

  /**
   * Get fusion weights (how much each model contributes)
   */
  async getFusionWeights(): Promise<{
    hestonWeight: bigint;
    egarchWeight: bigint;
    ivWeight: bigint;
  }> {
    return await this.contract.read.getFusionWeights() as { hestonWeight: bigint; egarchWeight: bigint; ivWeight: bigint };
  }

  /**
   * Get historical data count
   */
  async getHistoryCount(): Promise<number> {
    const count = await this.contract.read.getHistoryCount() as bigint;
    return Number(count);
  }

  /**
   * Check if an address is an authorized updater
   */
  async isUpdater(address: string): Promise<boolean> {
    return await this.contract.read.isUpdater([address as `0x${string}`]) as boolean;
  }

  /**
   * Get admin address
   */
  async getAdmin(): Promise<string> {
    return await this.contract.read.admin() as `0x${string}`;
  }
}

// Singleton instance
let oracleService: VolatilityOracleService | null = null;

export const getOracleService = () => {
  if (!oracleService) {
    oracleService = new VolatilityOracleService();
  }
  return oracleService;
};
