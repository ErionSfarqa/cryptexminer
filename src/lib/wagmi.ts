import { http, createConfig } from "wagmi";
import { mainnet, bsc, polygon } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

/**
 * WalletConnect Cloud Project ID.
 * Get yours free at https://cloud.walletconnect.com/
 * Set via NEXT_PUBLIC_WC_PROJECT_ID env var.
 *
 * ROOT CAUSE OF 403:
 * The old fallback "demo_project_id_replace_me" is not a valid WC Cloud
 * project ID. WalletConnect relay rejects it with HTTP 403 when AppKit /
 * the WC connector tries to fetch the wallet registry or open a relay
 * session. Fix: only add the walletConnect connector when a real project
 * ID is configured. Otherwise, fall back to injected-only (MetaMask etc).
 */
const wcProjectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "";

/** Whether a real WalletConnect project ID is configured */
export const hasWalletConnect = wcProjectId.length > 10;

if (!hasWalletConnect && typeof window !== "undefined") {
  console.warn("WalletConnect unavailable: No project ID configured.");
}

const connectors = hasWalletConnect
  ? [
      injected({ shimDisconnect: true }),
      walletConnect({
        projectId: wcProjectId,
        showQrModal: true,
        metadata: {
          name: "Cryptex Miner",
          description: "Next-Gen Crypto Mining",
          url: "https://cryptexminer.com",
          icons: ["https://cryptexminer.com/favicon.svg"],
        },
      }),
    ]
  : [injected({ shimDisconnect: true })];

export const wagmiConfig = createConfig({
  chains: [mainnet, bsc, polygon],
  connectors,
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
  },
});

/** Map chain IDs to display names */
export const CHAIN_NAMES: Record<number, string> = {
  [mainnet.id]: "Ethereum",
  [bsc.id]: "BNB Chain",
  [polygon.id]: "Polygon",
};

/** Map chain IDs to currency symbols */
export const CHAIN_SYMBOLS: Record<number, string> = {
  [mainnet.id]: "ETH",
  [bsc.id]: "BNB",
  [polygon.id]: "MATIC",
};
