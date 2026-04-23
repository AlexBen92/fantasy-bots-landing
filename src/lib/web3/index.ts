/**
 * Web3 Services Index
 *
 * Central export point for all Web3 services
 */

export * from "./VolatilityOracleService";
export * from "./RiskManagerService";
export * from "./SqueethExecutorService";
export * from "./CommitRevealService";
export * from "./clients";

/**
 * Regime names for display
 */
export const REGIME_NAMES = ["LOW", "NORMAL", "ELEVATED", "EXTREME"] as const;
export type RegimeName = typeof REGIME_NAMES[number];

export const getRegimeName = (regime: number): RegimeName => {
  return REGIME_NAMES[regime] || "UNKNOWN";
};

/**
 * Trade type names
 */
export const TRADE_TYPE_NAMES = [
  "OPEN_LONG",
  "OPEN_SHORT",
  "CLOSE_LONG",
  "CLOSE_SHORT",
] as const;
export type TradeTypeName = typeof TRADE_TYPE_NAMES[number];

export const getTradeTypeName = (tradeType: number): TradeTypeName => {
  return TRADE_TYPE_NAMES[tradeType] || "UNKNOWN";
};
