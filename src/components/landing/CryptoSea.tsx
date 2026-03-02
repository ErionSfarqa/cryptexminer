"use client";

import { useEffect, useState } from "react";
import { getPopularTickers, formatPrice, formatPercent, symbolToBase, type Ticker24h } from "@/lib/binance";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const COIN_ICONS: Record<string, string> = {
  BTC: "₿", ETH: "Ξ", BNB: "◆", SOL: "◎", XRP: "✕",
  ADA: "₳", DOGE: "Ð", DOT: "●", AVAX: "▲", MATIC: "⬡",
  LINK: "⬡", LTC: "Ł",
};

const COIN_COLORS: Record<string, string> = {
  BTC: "from-orange-400 to-amber-500",
  ETH: "from-indigo-400 to-violet-500",
  BNB: "from-yellow-400 to-amber-500",
  SOL: "from-purple-500 to-fuchsia-500",
  XRP: "from-blue-400 to-cyan-400",
  ADA: "from-blue-600 to-blue-800",
  DOGE: "from-amber-400 to-yellow-500",
  DOT: "from-pink-500 to-rose-600",
  AVAX: "from-red-500 to-rose-600",
  MATIC: "from-violet-500 to-purple-600",
  LINK: "from-blue-500 to-indigo-600",
  LTC: "from-gray-400 to-gray-600",
};

export function CryptoSea() {
  const [tickers, setTickers] = useState<Ticker24h[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularTickers()
      .then(setTickers)
      .catch(() => {})
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      getPopularTickers().then(setTickers).catch(() => {});
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  /** Build the rows — split tickers evenly across 3 rows so every row has cards */
  const rows = (() => {
    if (tickers.length === 0) return [];
    const perRow = Math.max(Math.ceil(tickers.length / 3), 2);
    const r: Ticker24h[][] = [];
    for (let i = 0; i < tickers.length; i += perRow) {
      r.push(tickers.slice(i, i + perRow));
    }
    return r;
  })();

  // Per-row durations (seconds) — slight variation for visual depth
  const durations = [30, 25, 35];

  return (
    <section className="section-padding bg-gray-950 text-white relative overflow-hidden" id="crypto-sea">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container-main relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
              The <span className="text-gradient-dark">Crypto Sea</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Dive into the world of cryptocurrency. Real-time prices, updated every 30 seconds from Binance.
            </p>
          </div>
        </ScrollReveal>

        {/* Marquee ticker rows — every row moves left→right and pauses on hover */}
        {rows.length > 0 && (
          <div className="space-y-3 mb-12 -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-hidden">
            {rows.map((row, rowIdx) => {
              // Duplicate content 4x so the loop is seamless when translate resets
              const track = [...row, ...row, ...row, ...row];
              return (
                <div
                  key={rowIdx}
                  className="crypto-sea-row overflow-hidden"
                >
                  <div
                    className="crypto-sea-track"
                    style={{
                      animationDuration: `${durations[rowIdx % durations.length]}s`,
                    }}
                  >
                    {track.map((t, i) => {
                      const base = symbolToBase(t.symbol);
                      const pctNum = parseFloat(t.priceChangePercent);
                      return (
                        <div
                          key={`${t.symbol}-r${rowIdx}-${i}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm flex-shrink-0"
                        >
                          <span className="font-semibold text-white">{base}</span>
                          <span className="text-gray-300">${formatPrice(t.lastPrice)}</span>
                          <span className={pctNum >= 0 ? "text-emerald-400" : "text-red-400"}>
                            {formatPercent(t.priceChangePercent)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Coin cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-white/10 mb-3" />
                  <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/10 rounded w-1/3" />
                </div>
              ))
            : tickers.map((t) => {
                const base = symbolToBase(t.symbol);
                const pctNum = parseFloat(t.priceChangePercent);
                const gradient = COIN_COLORS[base] || "from-gray-400 to-gray-600";
                return (
                  <ScrollReveal key={t.symbol}>
                    <div className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm mb-3 group-hover:scale-110 transition-transform`}
                      >
                        {COIN_ICONS[base] || base[0]}
                      </div>
                      <p className="text-sm text-gray-400 font-medium">{base}/USDT</p>
                      <p className="text-xl font-heading font-bold text-white mt-1">
                        ${formatPrice(t.lastPrice)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-sm font-medium ${
                            pctNum >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {formatPercent(t.priceChangePercent)}
                        </span>
                        <span className="text-xs text-gray-500">24h</span>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
        </div>
      </div>
    </section>
  );
}
