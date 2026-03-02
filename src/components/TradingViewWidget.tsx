"use client";

import { useEffect, useRef, useState, memo } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
  height?: number;
  theme?: "light" | "dark";
}

/**
 * SSR-safe TradingView advanced-chart widget using the official iframe embed.
 *
 * Why iframe instead of script injection?
 * - TradingView periodically rotates / deprecates the s3 embed-script URLs.
 * - The iframe embed (`tradingview.com/widgetembed`) is the stable public API.
 * - Iframes are naturally isolated — no double-init issues with React StrictMode.
 *
 * Usage: <TradingViewWidget key={symbol} symbol="BINANCE:BTCUSDT" height={480} />
 */
function TradingViewWidgetInner({
  symbol = "BINANCE:BTCUSDT",
  height = 400,
  theme = "light",
}: TradingViewWidgetProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build the TradingView widget embed URL (stable, public endpoint)
  const widgetUrl = buildTradingViewUrl(symbol, height, theme);

  // Timeout: if iframe hasn't loaded in 15s, show the chart anyway (TradingView
  // doesn't always fire onload consistently across all browsers)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="tradingview-widget-container rounded-xl overflow-hidden border border-surface-200 relative bg-white"
      style={{ height: `${height}px`, width: "100%" }}
    >
      {/* Loading skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white gap-3">
          <div className="w-8 h-8 border-[3px] border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading chart…</p>
        </div>
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-50 gap-2">
          <svg
            className="w-10 h-10 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-gray-500">Chart unavailable</p>
          <a
            href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-600 hover:underline"
          >
            Open on TradingView →
          </a>
        </div>
      )}

      {/* The actual TradingView iframe */}
      <iframe
        ref={iframeRef}
        src={widgetUrl}
        style={{ width: "100%", height: `${height}px`, border: 0 }}
        allow="autoplay; encrypted-media"
        allowFullScreen
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        title={`TradingView chart – ${symbol}`}
      />
    </div>
  );
}

/**
 * Builds the TradingView widgetembed URL.
 * This is the publicly documented, stable way to embed a TradingView chart.
 */
function buildTradingViewUrl(
  symbol: string,
  height: number,
  theme: string
): string {
  const params = new URLSearchParams({
    frameElementId: "tradingview_widget",
    symbol,
    interval: "60",
    timezone: "Etc/UTC",
    theme,
    style: "1",
    locale: "en",
    enable_publishing: "false",
    allow_symbol_change: "true",
    hide_top_toolbar: "false",
    hide_legend: "false",
    save_image: "false",
    withdateranges: "true",
    support_host: "https://www.tradingview.com",
  });
  return `https://www.tradingview.com/widgetembed/?${params.toString()}`;
}

/** Use <TradingViewWidget key={symbol} symbol={symbol} /> to swap charts cleanly */
export const TradingViewWidget = memo(TradingViewWidgetInner);

