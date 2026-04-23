"use client";

/**
 * Contract Status Panel
 *
 * Displays the status of all deployed contracts on Sepolia
 */

import { useContractData } from "@/hooks";
import { CONTRACTS, getContractUrl } from "@/src/config/contracts";

export function ContractStatus() {
  const { volatility, risk, position, commitReveal, isLoading } = useContractData();

  if (isLoading) {
    return (
      <div className="bg-crypto-card border border-crypto-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Contract Status</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-crypto-card border border-crypto-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Sepolia Contracts
      </h3>

      <div className="space-y-4">
        {/* VolatilityOracle */}
        <ContractCard
          name="Volatility Oracle"
          address={CONTRACTS.VolatilityOracle}
          status="active"
          details={
            volatility.data ? {
              "Regime": volatility.regimeName,
              "Volatility": `${Number(volatility.data.volatility) / 1e18 * 100}%`,
              "Confidence": `${volatility.data.confidence}%`,
            }
          : {}
          }
        />

        {/* RiskManager */}
        <ContractCard
          name="Risk Manager"
          address={CONTRACTS.RiskManager}
          status={risk.isPaused ? "paused" : risk.isCircuitBreakerActive ? "circuit-breaker" : "active"}
          details={
            risk.limits ? {
              "Max Position": `${Number(risk.limits.maxPositionSize) / 1e18} ETH`,
              "Max Leverage": `${risk.limits.maxLeverage}x`,
              "Paused": risk.isPaused ? "Yes" : "No",
              "Circuit Breaker": risk.isCircuitBreakerActive ? "Active" : "Inactive",
            }
          : {}
          }
        />

        {/* SqueethArbExecutor */}
        <ContractCard
          name="Squeeth Arb Executor"
          address={CONTRACTS.SqueethArbExecutor}
          status="active"
          details={
            position.position ? {
              "Current Position": `${Number(position.position.position) / 1e18} ETH`,
              "Max Position": `${Number(position.position.maxPosition) / 1e18} ETH`,
              "Total Trades": position.totalTrades.toString(),
            }
          : {}
          }
        />

        {/* CommitReveal */}
        <ContractCard
          name="Commit Reveal"
          address={CONTRACTS.CommitReveal}
          status="active"
          details={{
            "Nonce": commitReveal.nonce.toString(),
            "Min Reveal": `${commitReveal.minDelay} blocks`,
            "Max Reveal": `${commitReveal.maxDelay} blocks`,
          }}
        />
      </div>
    </div>
  );
}

interface ContractCardProps {
  name: string;
  address: string;
  status: "active" | "paused" | "circuit-breaker" | "error";
  details: Record<string, string>;
}

function ContractCard({ name, address, status, details }: ContractCardProps) {
  const statusConfig = {
    active: { color: "bg-green-500", text: "Active" },
    paused: { color: "bg-yellow-500", text: "Paused" },
    "circuit-breaker": { color: "bg-red-500", text: "Circuit Breaker" },
    error: { color: "bg-red-500", text: "Error" },
  };

  const config = statusConfig[status];

  return (
    <div className="bg-crypto-dark border border-crypto-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-white">{name}</h4>
          <a
            href={getContractUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-primary-400 transition-colors"
          >
            {`${address.slice(0, 8)}...${address.slice(-6)}`}
          </a>
        </div>
        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.color} text-white`}>
          <span className="w-1 h-1 bg-white rounded-full"></span>
          {config.text}
        </span>
      </div>

      {Object.keys(details).length > 0 && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-500">{key}:</span>
              <span className="text-gray-300 font-mono">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
