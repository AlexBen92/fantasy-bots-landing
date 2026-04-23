"use client";

/**
 * React Hooks for Contract Data
 *
 * Custom hooks to fetch and cache contract data
 */

import { useEffect, useState } from "react";

// Services
import {
  getOracleService,
  getRiskManagerService,
  getExecutorService,
  getCommitRevealService,
  getRegimeName,
} from "@/src/lib/web3";

// Types
import type { VolatilityData } from "@/src/lib/web3/VolatilityOracleService";
import type { RiskLimits, RiskState } from "@/src/lib/web3/RiskManagerService";
import type { PositionDetails } from "@/src/lib/web3/SqueethExecutorService";

/**
 * Hook to fetch volatility oracle data
 */
export function useVolatilityData() {
  const [data, setData] = useState<VolatilityData | null>(null);
  const [regimeName, setRegimeName] = useState<string>("UNKNOWN");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const oracle = getOracleService();
        const volData = await oracle.getLatestVolatility();
        setData(volData);
        setRegimeName(getRegimeName(Number(volData.regime)));
        setError(null);
      } catch (err) {
        console.error("Error fetching volatility data:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, regimeName, isLoading, error };
}

/**
 * Hook to fetch risk manager state
 */
export function useRiskState() {
  const [limits, setLimits] = useState<RiskLimits | null>(null);
  const [state, setState] = useState<RiskState | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isCircuitBreakerActive, setIsCircuitBreakerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const riskMgr = getRiskManagerService();

        const [limitsData, stateData, paused, circuitBreaker] = await Promise.all([
          riskMgr.getRiskLimits(),
          riskMgr.getRiskState(),
          riskMgr.isPaused(),
          riskMgr.isCircuitBreakerActive(),
        ]);

        setLimits(limitsData);
        setState(stateData);
        setIsPaused(paused);
        setIsCircuitBreakerActive(circuitBreaker);
        setError(null);
      } catch (err) {
        console.error("Error fetching risk state:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Refresh every 15 seconds
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return { limits, state, isPaused, isCircuitBreakerActive, isLoading, error };
}

/**
 * Hook to fetch executor position data
 */
export function usePositionData() {
  const [position, setPosition] = useState<PositionDetails | null>(null);
  const [totalTrades, setTotalTrades] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const executor = getExecutorService();

        const [positionData, trades] = await Promise.all([
          executor.getPositionDetails(),
          executor.getTotalTrades(),
        ]);

        setPosition(positionData);
        setTotalTrades(trades);
        setError(null);
      } catch (err) {
        console.error("Error fetching position data:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return { position, totalTrades, isLoading, error };
}

/**
 * Hook to fetch commit-reveal state
 */
export function useCommitRevealState() {
  const [nonce, setNonce] = useState<number>(0);
  const [minDelay, setMinDelay] = useState<number>(0);
  const [maxDelay, setMaxDelay] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const cr = getCommitRevealService();

        const [nonceValue, delays] = await Promise.all([
          cr.getNonce(),
          cr.getRevealDelays(),
        ]);

        setNonce(nonceValue);
        setMinDelay(delays.minRevealDelay);
        setMaxDelay(delays.maxRevealDelay);
        setError(null);
      } catch (err) {
        console.error("Error fetching commit-reveal state:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { nonce, minDelay, maxDelay, isLoading, error };
}

/**
 * Combined hook for all contract data
 */
export function useContractData() {
  const volatility = useVolatilityData();
  const risk = useRiskState();
  const position = usePositionData();
  const commitReveal = useCommitRevealState();

  const isLoading = volatility.isLoading || risk.isLoading || position.isLoading || commitReveal.isLoading;
  const hasError = volatility.error || risk.error || position.error || commitReveal.error;

  return {
    volatility,
    risk,
    position,
    commitReveal,
    isLoading,
    hasError,
  };
}
