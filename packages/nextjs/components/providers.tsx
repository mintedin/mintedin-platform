"use client";

import { ThemeProvider } from "next-themes";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { metaMask } from "wagmi/connectors";

// Configure chains and providers
const { chains, publicClient, webSocketClient } = configureChains(
  [mainnet, sepolia], // Add your chains here
  [publicProvider()] // Add your providers here
);

// Create the wagmi config
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketClient,
  connectors: [
    metaMask({ chains }),
  ],
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
      >
        {children}
      </ThemeProvider>
    </WagmiConfig>
  );
}