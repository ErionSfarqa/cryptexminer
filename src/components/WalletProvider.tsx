"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi";
import { useState, type ReactNode } from "react";

/**
 * Wraps children with WagmiProvider + React-Query QueryClientProvider.
 * Must be a client component. Place this inside the app layout.
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  // Create a stable QueryClient instance per component mount
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
      },
    },
  }));

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
