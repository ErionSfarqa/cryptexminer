"use client";

import { useState, useEffect, useMemo } from "react";
import {
  get24hrTickers,
  formatPrice,
  formatPercent,
  formatVolume,
  symbolToBase,
  type Ticker24h,
} from "@/lib/binance";
import dynamic from "next/dynamic";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

const TradingViewWidget = dynamic(
  () => import("@/components/TradingViewWidget").then((m) => m.TradingViewWidget),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-surface-50 rounded-xl" style={{ height: 400 }}>
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

type SortField = "symbol" | "lastPrice" | "priceChangePercent" | "quoteVolume";
type SortDir = "asc" | "desc";

export default function MarketsPage() {
  const [tickers, setTickers] = useState<Ticker24h[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [sortField, setSortField] = useState<SortField>("quoteVolume");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [tab, setTab] = useState<"all" | "gainers" | "losers">("all");
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await get24hrTickers();
        if (mounted) {
          setTickers(data.filter((t) => t.symbol.endsWith("USDT") && parseFloat(t.quoteVolume) > 100_000));
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message === "RATE_LIMITED" ? "Rate limited by Binance. Please wait." : "Failed to load market data.");
          setLoading(false);
          addToast("Failed to load market data", "error");
        }
      }
    }

    load();
    const interval = setInterval(load, 30_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [addToast]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filteredTickers = useMemo(() => {
    let data = [...tickers];

    // Tab filter
    if (tab === "gainers") {
      data = data.filter((t) => parseFloat(t.priceChangePercent) > 0);
    } else if (tab === "losers") {
      data = data.filter((t) => parseFloat(t.priceChangePercent) < 0);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toUpperCase();
      data = data.filter(
        (t) => t.symbol.includes(q) || symbolToBase(t.symbol).includes(q)
      );
    }

    // Sort
    data.sort((a, b) => {
      let aVal: number, bVal: number;
      if (sortField === "symbol") {
        return sortDir === "asc" ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
      }
      aVal = parseFloat(a[sortField]);
      bVal = parseFloat(b[sortField]);
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    return data.slice(0, 100); // Top 100
  }, [tickers, search, sortField, sortDir, tab]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
          Markets
        </h1>
        <p className="text-gray-500">
          Real-time market data from Binance. Click a pair for detailed charts.
        </p>
      </div>

      {/* Chart */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {selectedSymbol.replace("USDT", "/USDT")}
          </h2>
          <span className="text-xs text-gray-400">TradingView</span>
        </div>
        <TradingViewWidget
          key={selectedSymbol}
          symbol={`BINANCE:${selectedSymbol}`}
          height={400}
          theme="light"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-100 rounded-xl">
          {(["all", "gainers", "losers"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                tab === t
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "all" ? "All" : t === "gainers" ? "🟢 Gainers" : "🔴 Losers"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search pairs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
          />
        </div>

        <span className="text-xs text-gray-400">
          {filteredTickers.length} pairs • Auto-refresh 30s
        </span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-brand-600 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    <button onClick={() => handleSort("symbol")} className="hover:text-gray-900 transition-colors">
                      Pair {sortField === "symbol" && (sortDir === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    <button onClick={() => handleSort("lastPrice")} className="hover:text-gray-900 transition-colors">
                      Price {sortField === "lastPrice" && (sortDir === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    <button onClick={() => handleSort("priceChangePercent")} className="hover:text-gray-900 transition-colors">
                      24h % {sortField === "priceChangePercent" && (sortDir === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                    <button onClick={() => handleSort("quoteVolume")} className="hover:text-gray-900 transition-colors">
                      Volume {sortField === "quoteVolume" && (sortDir === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                    High / Low
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5}>
                          <SkeletonRow />
                        </td>
                      </tr>
                    ))
                  : filteredTickers.map((t) => {
                      const base = symbolToBase(t.symbol);
                      const pct = parseFloat(t.priceChangePercent);
                      const isSelected = t.symbol === selectedSymbol;
                      return (
                        <tr
                          key={t.symbol}
                          onClick={() => setSelectedSymbol(t.symbol)}
                          className={`border-b border-surface-100 cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-brand-50"
                              : "hover:bg-surface-50"
                          }`}
                          role="row"
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{base}</span>
                              <span className="text-xs text-gray-400">/USDT</span>
                            </div>
                          </td>
                          <td className="text-right px-4 py-3.5 font-mono font-medium text-gray-900">
                            ${formatPrice(t.lastPrice)}
                          </td>
                          <td className="text-right px-4 py-3.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                                pct >= 0
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {formatPercent(t.priceChangePercent)}
                            </span>
                          </td>
                          <td className="text-right px-4 py-3.5 text-gray-500 hidden sm:table-cell">
                            {formatVolume(t.quoteVolume)}
                          </td>
                          <td className="text-right px-4 py-3.5 text-xs text-gray-400 hidden md:table-cell">
                            <span className="text-emerald-600">{formatPrice(t.highPrice)}</span>
                            {" / "}
                            <span className="text-red-500">{formatPrice(t.lowPrice)}</span>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
