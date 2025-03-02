"use client";

import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

// Create a client
const queryClient = new QueryClient();

// Configure wagmi
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}