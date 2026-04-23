"use client";

/**
 * Wallet Button Component
 *
 * Uses RainbowKit's ConnectButton with responsive styling
 */

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletButton() {
  return (
    <ConnectButton
      accountStatus={{
        smallScreen: "avatar",
        largeScreen: "full",
      }}
      showBalance={{
        smallScreen: false,
        largeScreen: true,
      }}
      chainStatus="icon"
    />
  );
}
