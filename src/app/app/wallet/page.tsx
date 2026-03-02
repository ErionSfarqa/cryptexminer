"use client";

import { useState, useCallback } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { mainnet, bsc, polygon } from "wagmi/chains";
import { formatUnits } from "viem";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/Toast";
import { truncateAddress } from "@/lib/utils";
import { CHAIN_NAMES, hasWalletConnect } from "@/lib/wagmi";
import {
  getMultiNetworkBalances,
  isValidEvmAddress,
  NETWORKS,
  type BalanceResult,
} from "@/lib/blockchain";

const TradingViewWidget = dynamic(
  () => import("@/components/TradingViewWidget").then((m) => m.TradingViewWidget),
  { ssr: false }
);

type TabMode = "connect" | "lookup";

/* ── Estimated prices (fallback when real prices aren't available) ── */
const PRICES: Record<string, number> = { ETH: 3200, BNB: 600, MATIC: 0.5 };

/** Format balance from wagmi v3 useBalance data */
function fmtBal(data: { value: bigint; decimals: number } | undefined): number {
  if (!data) return 0;
  return parseFloat(formatUnits(data.value, data.decimals));
}

export default function WalletPage() {
  const [tab, setTab] = useState<TabMode>("connect");
  const { addToast } = useToast();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
          Wallet
        </h1>
        <p className="text-gray-500">
          Connect your wallet or look up any EVM address to view on-chain balances.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("connect")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === "connect"
              ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25"
              : "bg-white text-gray-600 border border-surface-200 hover:border-surface-300"
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Connect Wallet
          </span>
        </button>
        <button
          onClick={() => setTab("lookup")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === "lookup"
              ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25"
              : "bg-white text-gray-600 border border-surface-200 hover:border-surface-300"
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Address Lookup
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {tab === "connect" ? (
        <ConnectWalletTab addToast={addToast} />
      ) : (
        <LookupTab addToast={addToast} />
      )}

      {/* TradingView Chart */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Market Overview
        </h2>
        <TradingViewWidget key="wallet-ethusdt" symbol="BINANCE:ETHUSDT" height={380} />
      </div>

      {/* Info box */}
      <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>ℹ️ Security:</strong> Cryptex never asks for your seed phrase or private key.
          Wallet connections use the secure EIP-1193 standard through your browser wallet.
          Address lookups read only public on-chain data — no connection required.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ *
 *  TAB 1 — Connect Wallet (wagmi / MetaMask / WalletConnect)
 * ═══════════════════════════════════════════════════════ */
function ConnectWalletTab({ addToast }: { addToast: (msg: string, type: "info" | "success" | "error") => void }) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  /* Multi-chain native balance queries */
  const ethBal = useBalance({ address, chainId: mainnet.id });
  const bnbBal = useBalance({ address, chainId: bsc.id });
  const maticBal = useBalance({ address, chainId: polygon.id });

  const balances = [
    { symbol: "ETH", chain: mainnet, query: ethBal },
    { symbol: "BNB", chain: bsc, query: bnbBal },
    { symbol: "MATIC", chain: polygon, query: maticBal },
  ];

  const totalUsd = balances.reduce((sum, b) => {
    const val = fmtBal(b.query.data);
    return sum + val * (PRICES[b.symbol] || 0);
  }, 0);

  if (!isConnected) {
    return (
      <div className="card p-6 sm:p-8">
        <h2 className="text-lg font-heading font-bold text-gray-900 mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Use MetaMask{hasWalletConnect ? ", WalletConnect," : ""} or any EIP-1193 compatible wallet.
        </p>

        {!hasWalletConnect && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-800">
              <strong>WalletConnect unavailable:</strong> No project ID configured. Set{" "}
              <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_WC_PROJECT_ID</code> in{" "}
              <code className="bg-amber-100 px-1 rounded">.env.local</code> to enable QR-code connections.
              MetaMask and other injected wallets still work.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => {
                connect(
                  { connector },
                  {
                    onSuccess: () => addToast("Wallet connected!", "success"),
                    onError: (err) => addToast(err.message || "Connection failed", "error"),
                  }
                );
              }}
              disabled={isPending}
              className="flex items-center gap-3 p-4 rounded-xl border border-surface-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center">
                {connector.name.toLowerCase().includes("metamask") ? (
                  <span className="text-xl">🦊</span>
                ) : connector.name.toLowerCase().includes("walletconnect") ? (
                  <span className="text-xl">🔗</span>
                ) : connector.name.toLowerCase().includes("coinbase") ? (
                  <span className="text-xl">🟦</span>
                ) : (
                  <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">{connector.name}</p>
                <p className="text-xs text-gray-500">
                  {connector.name.toLowerCase().includes("metamask")
                    ? "Browser extension"
                    : connector.name.toLowerCase().includes("walletconnect")
                    ? "QR code or mobile"
                    : "Connect"}
                </p>
              </div>
              {isPending && (
                <div className="ml-auto w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── Connected state ── */
  return (
    <div className="space-y-6">
      {/* Wallet header card */}
      <div className="card overflow-hidden">
        <div className="p-5 bg-gradient-to-br from-brand-500 to-accent-500 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium opacity-90">Connected</span>
            </div>
            <button
              onClick={() => {
                disconnect();
                addToast("Wallet disconnected", "info");
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors font-medium"
            >
              Disconnect
            </button>
          </div>
          <p className="text-xs font-mono opacity-70 mb-3">
            {address ? truncateAddress(address) : ""}
          </p>
          {chain && (
            <p className="text-xs opacity-80 mb-1">
              Network: {CHAIN_NAMES[chain.id] || chain.name}
            </p>
          )}
          <p className="text-sm opacity-80 mt-2">Estimated Total</p>
          <p className="text-3xl font-heading font-bold">
            ≈ ${totalUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Balance cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {balances.map((b) => {
          const val = fmtBal(b.query.data);
          const usd = val * (PRICES[b.symbol] || 0);
          const isLoading = b.query.isLoading;
          return (
            <div
              key={b.symbol}
              className="card p-5 hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-sm font-bold text-gray-700">
                  {b.symbol.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {CHAIN_NAMES[b.chain.id]}
                  </p>
                  <p className="text-xs text-gray-500">{b.symbol}</p>
                </div>
              </div>
              {isLoading ? (
                <div className="h-7 bg-surface-200 rounded w-2/3 animate-pulse" />
              ) : (
                <>
                  <p className="text-xl font-heading font-bold text-gray-900">
                    {val.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 8 })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ≈ ${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Copy address */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            if (address) {
              navigator.clipboard.writeText(address);
              addToast("Address copied to clipboard!", "success");
            }
          }}
          className="btn-secondary text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy Full Address
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ *
 *  TAB 2 — Address Lookup (no wallet connection needed)
 * ═══════════════════════════════════════════════════════ */
function LookupTab({ addToast }: { addToast: (msg: string, type: "info" | "success" | "error") => void }) {
  const [addressInput, setAddressInput] = useState("");
  const [balances, setBalances] = useState<BalanceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [looked, setLooked] = useState(false);

  const lookup = useCallback(async () => {
    const addr = addressInput.trim();
    if (!addr) {
      setError("Enter a wallet address to look up.");
      return;
    }
    if (!isValidEvmAddress(addr)) {
      setError("Invalid address format. Must be 0x followed by 40 hex characters.");
      return;
    }
    setError(null);
    setLoading(true);
    setLooked(true);
    try {
      const results = await getMultiNetworkBalances(addr);
      setBalances(results);
      if (results.length === 0) {
        setError("Could not fetch balances. The explorer APIs may be rate-limited — try again in a few seconds.");
      }
    } catch {
      setError("Failed to fetch balances. Please try again.");
      addToast("Balance lookup failed", "error");
    } finally {
      setLoading(false);
    }
  }, [addressInput, addToast]);

  const clear = () => {
    setAddressInput("");
    setBalances([]);
    setError(null);
    setLooked(false);
  };

  const totalUsd = balances.reduce((sum, b) => {
    return sum + b.balance * (PRICES[b.symbol] || 0);
  }, 0);

  return (
    <>
      {/* Lookup form */}
      <div className="card p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wallet Address
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="0x..."
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            className="flex-1 px-4 py-3 text-sm bg-white border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono"
          />
          <div className="flex gap-2">
            <button onClick={lookup} disabled={loading} className="btn-primary px-6 py-3 disabled:opacity-50">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              Look Up
            </button>
            {looked && (
              <button onClick={clear} className="btn-secondary px-4 py-3" title="Clear">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      {/* Results */}
      {looked && !loading && balances.length > 0 && (
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="p-5 bg-gradient-to-br from-brand-500 to-accent-500 text-white">
              <p className="text-sm opacity-80 mb-1">Wallet</p>
              <p className="text-xs font-mono opacity-70 mb-3">
                {truncateAddress(balances[0].address)}
              </p>
              <p className="text-sm opacity-80">Estimated Total</p>
              <p className="text-3xl font-heading font-bold">
                ≈ ${totalUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {balances.map((b) => {
              const cfg = NETWORKS[b.network];
              return (
                <a
                  key={b.network}
                  href={b.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-5 hover:-translate-y-0.5 transition-transform group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-sm font-bold text-gray-700 group-hover:bg-brand-100 transition-colors">
                      {cfg.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{cfg.name}</p>
                      <p className="text-xs text-gray-500">{cfg.symbol}</p>
                    </div>
                  </div>
                  <p className="text-xl font-heading font-bold text-gray-900">
                    {b.balance.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 8 })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{cfg.symbol}</p>
                  <p className="text-xs text-brand-600 mt-2 group-hover:underline">
                    View on {cfg.name.includes("Smart") ? "BscScan" : cfg.name === "Polygon" ? "PolygonScan" : "Etherscan"} →
                  </p>
                </a>
              );
            })}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                navigator.clipboard.writeText(balances[0].address);
                addToast("Address copied to clipboard!", "success");
              }}
              className="btn-secondary text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Full Address
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!looked && (
        <div className="card p-8 sm:p-12 text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">
            Check Any Wallet
          </h2>
          <p className="text-gray-500 mb-2 text-sm">
            Enter an EVM-compatible wallet address above to fetch real blockchain balances.
          </p>
          <p className="text-xs text-gray-400">
            No wallet connection required — reads public on-chain data.
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          <div className="card p-6 animate-pulse">
            <div className="h-6 bg-surface-200 rounded w-1/3 mb-4" />
            <div className="h-10 bg-surface-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-surface-200 rounded w-1/4" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-surface-200" />
                  <div className="h-4 bg-surface-200 rounded w-20" />
                </div>
                <div className="h-6 bg-surface-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-surface-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
