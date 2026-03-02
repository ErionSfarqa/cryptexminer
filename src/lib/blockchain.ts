/**
 * Blockchain balance lookup via public explorer APIs.
 *
 * Supports Ethereum, BSC, and Polygon.  Uses free-tier explorer endpoints
 * (rate-limited but no key required for basic balance queries).
 *
 * For higher rate limits set NEXT_PUBLIC_ETHERSCAN_API_KEY,
 * NEXT_PUBLIC_BSCSCAN_API_KEY, or NEXT_PUBLIC_POLYGONSCAN_API_KEY.
 */

export type Network = "ethereum" | "bsc" | "polygon";

export interface NetworkConfig {
  id: Network;
  name: string;
  symbol: string;
  explorer: string;
  apiBase: string;
  decimals: number;
  envKey: string;
}

export const NETWORKS: Record<Network, NetworkConfig> = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    explorer: "https://etherscan.io",
    apiBase: "https://api.etherscan.io/api",
    decimals: 18,
    envKey: "NEXT_PUBLIC_ETHERSCAN_API_KEY",
  },
  bsc: {
    id: "bsc",
    name: "BNB Smart Chain",
    symbol: "BNB",
    explorer: "https://bscscan.com",
    apiBase: "https://api.bscscan.com/api",
    decimals: 18,
    envKey: "NEXT_PUBLIC_BSCSCAN_API_KEY",
  },
  polygon: {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
    apiBase: "https://api.polygonscan.com/api",
    decimals: 18,
    envKey: "NEXT_PUBLIC_POLYGONSCAN_API_KEY",
  },
};

function getApiKey(network: Network): string {
  const cfg = NETWORKS[network];
  const key =
    typeof window !== "undefined"
      ? (window as any).__ENV?.[cfg.envKey]
      : process.env[cfg.envKey];
  return key || "";
}

function weiToNative(weiStr: string, decimals: number): number {
  // Avoid floating point issues for very large numbers
  if (weiStr === "0") return 0;
  const len = weiStr.length;
  if (len <= decimals) {
    return parseFloat(`0.${weiStr.padStart(decimals, "0")}`);
  }
  const intPart = weiStr.slice(0, len - decimals);
  const fracPart = weiStr.slice(len - decimals);
  return parseFloat(`${intPart}.${fracPart}`);
}

export interface BalanceResult {
  address: string;
  network: Network;
  balance: number; // native token (ETH / BNB / MATIC)
  symbol: string;
  explorerUrl: string;
}

/**
 * Fetch native balance for an address on a given network.
 * Uses the explorer's free API (1 req/5s without key).
 */
export async function getNativeBalance(
  address: string,
  network: Network
): Promise<BalanceResult> {
  const cfg = NETWORKS[network];
  const apiKey = getApiKey(network);

  const url = new URL(cfg.apiBase);
  url.searchParams.set("module", "account");
  url.searchParams.set("action", "balance");
  url.searchParams.set("address", address);
  url.searchParams.set("tag", "latest");
  if (apiKey) url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`${cfg.name} API error: ${res.status}`);

  const json = await res.json();
  if (json.status !== "1" && json.message !== "OK" && json.result !== "0") {
    throw new Error(json.message || `${cfg.name} API returned an error`);
  }

  const balance = weiToNative(json.result, cfg.decimals);

  return {
    address,
    network,
    balance,
    symbol: cfg.symbol,
    explorerUrl: `${cfg.explorer}/address/${address}`,
  };
}

/**
 * Fetch balances across all supported networks for one address.
 */
export async function getMultiNetworkBalances(
  address: string
): Promise<BalanceResult[]> {
  const results = await Promise.allSettled(
    (Object.keys(NETWORKS) as Network[]).map((net) =>
      getNativeBalance(address, net)
    )
  );

  return results
    .filter((r): r is PromiseFulfilledResult<BalanceResult> => r.status === "fulfilled")
    .map((r) => r.value);
}

/**
 * Validate that a string looks like a valid EVM address (0x + 40 hex chars).
 */
export function isValidEvmAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}
