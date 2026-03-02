"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  get24hrTicker,
  formatPrice,
  formatPercent,
  formatVolume,
  type Ticker24h,
} from "@/lib/binance";

const TradingViewWidget = dynamic(
  () => import("@/components/TradingViewWidget").then((m) => m.TradingViewWidget),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-surface-50 rounded-xl" style={{ height: 480 }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading chart…</p>
        </div>
      </div>
    ),
  }
);

export function MarketSection() {
  const [ticker, setTicker] = useState<Ticker24h | null>(null);
  const [kpiError, setKpiError] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await get24hrTicker("BTCUSDT");
        if (mounted) setTicker(data);
      } catch {
        if (mounted) setKpiError(true);
      }
    }
    load();
    const iv = setInterval(load, 30_000);
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  const pct = ticker ? parseFloat(ticker.priceChangePercent) : 0;

  return (
    <section className="section-padding bg-white" id="markets">
      <div className="container-main">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Live Market <span className="text-gradient">Analytics</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional-grade charts and real-time data powered by TradingView and Binance.
            </p>
          </div>
        </ScrollReveal>

        {/* KPI cards */}
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {ticker ? (
              <>
                <KpiCard label="BTC Price" value={`$${formatPrice(ticker.lastPrice)}`} />
                <KpiCard
                  label="24h Change"
                  value={formatPercent(ticker.priceChangePercent)}
                  className={pct >= 0 ? "text-emerald-600" : "text-red-600"}
                />
                <KpiCard label="24h Volume" value={formatVolume(ticker.quoteVolume)} />
                <KpiCard label="24h High" value={`$${formatPrice(ticker.highPrice)}`} />
              </>
            ) : kpiError ? (
              <div className="col-span-4 text-center text-sm text-gray-400 py-3">
                Market data unavailable — chart still works below.
              </div>
            ) : (
              <>
                {[1,2,3,4].map((i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="h-3 bg-surface-200 rounded w-2/3 mb-2" />
                    <div className="h-5 bg-surface-200 rounded w-1/2" />
                  </div>
                ))}
              </>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="card p-4 sm:p-6">
            <TradingViewWidget key="landing-BTCUSDT" symbol="BINANCE:BTCUSDT" height={480} theme="light" />
          </div>
        </ScrollReveal>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {[
            "Real-time Prices",
            "24h Volume",
            "Advanced Charts",
            "500+ Pairs",
            "Technical Indicators",
            "Price Alerts",
          ].map((feature) => (
            <span
              key={feature}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-surface-100 rounded-full border border-surface-200"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function KpiCard({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-heading font-bold text-gray-900 ${className ?? ""}`}>{value}</p>
    </div>
  );
}
