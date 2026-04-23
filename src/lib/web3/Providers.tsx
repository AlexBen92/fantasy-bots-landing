"use client";

/**
 * Web3 Providers
 *
 * Sets up wagmi, RainbowKit, and query providers for the app
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { RainbowKitProvider, darkTheme, getDefaultWallets } from "@rainbow-me/rainbowkit";

// Get project ID from env or use default
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "e10a8dca90396d988c101f1da7929e44";

// Configure wallets using RainbowKit 2.1.x API
// Note: chains is configured via createConfig, not here
const { connectors } = getDefaultWallets({
  appName: 'Fantasy Bots',
  projectId,
});

// Configure wagmi
const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors,
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true,
});

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Custom dark theme with better colors
const customDarkTheme = darkTheme({
  accentColor: "#7b3ff2",
  accentColorForeground: "white",
  borderRadius: "medium",
  fontStack: "system",
});

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customDarkTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
