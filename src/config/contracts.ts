/**
 * Contract Configuration for ArbitrageX Sepolia Deployment
 *
 * Sepolia Contract Addresses (deployed 2024-04-22)
 */

export const SEPOLIA_CHAIN_ID = 11155111 as const;

export const CONTRACTS = {
  VolatilityOracle: "0xD9e3c3dFe9872454F35Bd567c1A267C35FE0BbAd" as const,
  RiskManager: "0x82646884d0e549041c19666B091aAf9625cE976b" as const,
  CommitReveal: "0x66afC814867801A3D33057545b97Cd61F2ACc4E9" as const,
  SqueethArbExecutor: "0xa7da116b72a7db4875D52a424da2963082647987" as const,
} as const;

export const CONTRACT_NAMES = {
  [CONTRACTS.VolatilityOracle]: "VolatilityOracle",
  [CONTRACTS.RiskManager]: "RiskManager",
  [CONTRACTS.CommitReveal]: "CommitReveal",
  [CONTRACTS.SqueethArbExecutor]: "SqueethArbExecutor",
} as const;

/**
 * Contract explorers links
 */
export const EXPLORER_URLS = {
  sepolia: "https://sepolia.etherscan.io",
} as const;

export const getContractUrl = (address: string) =>
  `${EXPLORER_URLS.sepolia}/address/${address}`;

/**
 * Network configuration
 */
export const CHAINS = {
  sepolia: {
    id: SEPOLIA_CHAIN_ID,
    name: "Sepolia",
    nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["https://sepolia.gateway.tenderly.co"] },
      public: { http: ["https://rpc.sepolia.org"] },
    },
    blockExplorers: {
      default: { name: "Etherscan", url: EXPLORER_URLS.sepolia },
    },
    testnet: true,
  },
} as const;
