"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { COINS, type CoinSymbol } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import dynamic from "next/dynamic";

const TradingViewWidget = dynamic(
  () => import("@/components/TradingViewWidget").then((m) => m.TradingViewWidget),
  { ssr: false }
);

/** Map coin symbols to TradingView symbols */
const TV_SYMBOLS: Record<string, string> = {
  BTC: "BINANCE:BTCUSDT",
  ETH: "BINANCE:ETHUSDT",
  SOL: "BINANCE:SOLUSDT",
  DOGE: "BINANCE:DOGEUSDT",
  XRP: "BINANCE:XRPUSDT",
  ADA: "BINANCE:ADAUSDT",
  DOT: "BINANCE:DOTUSDT",
  LTC: "BINANCE:LTCUSDT",
};

interface MiningState {
  coin: CoinSymbol;
  isMining: boolean;
  totalMined: Record<string, number>;
  sessionMined: number;
  sessionTime: number; // seconds
}

const STORAGE_KEY = "cryptex_mining_state";

function loadState(): MiningState {
  if (typeof window === "undefined") {
    return {
      coin: "BTC",
      isMining: false,
      totalMined: {},
      sessionMined: 0,
      sessionTime: 0,
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...parsed, isMining: false, sessionMined: 0, sessionTime: 0 };
    }
  } catch {}
  return {
    coin: "BTC",
    isMining: false,
    totalMined: {},
    sessionMined: 0,
    sessionTime: 0,
  };
}

function saveState(state: MiningState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function MinePage() {
  const [state, setState] = useState<MiningState>(loadState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addToast } = useToast();

  const selectedCoin = COINS.find((c) => c.symbol === state.coin) || COINS[0];

  const startMining = useCallback(() => {
    setState((s) => ({ ...s, isMining: true, sessionMined: 0, sessionTime: 0 }));
    addToast(`Mining ${selectedCoin.name} started!`, "success");
  }, [selectedCoin.name, addToast]);

  const stopMining = useCallback(() => {
    setState((s) => {
      const newTotal = { ...s.totalMined };
      newTotal[s.coin] = (newTotal[s.coin] || 0) + s.sessionMined;
      const newState = { ...s, isMining: false, totalMined: newTotal };
      saveState(newState);
      return newState;
    });
    addToast("Mining stopped. Session saved.", "info");
  }, [addToast]);

  // Mining tick
  useEffect(() => {
    if (!state.isMining) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setState((s) => ({
        ...s,
        sessionMined: s.sessionMined + selectedCoin.rate,
        sessionTime: s.sessionTime + 1,
      }));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isMining, selectedCoin.rate]);

  // Persist on unmount  
  useEffect(() => {
    return () => {
      // Save current totals when leaving page
      setState((s) => {
        if (s.sessionMined > 0) {
          const newTotal = { ...s.totalMined };
          newTotal[s.coin] = (newTotal[s.coin] || 0) + s.sessionMined;
          saveState({ ...s, totalMined: newTotal });
        }
        return s;
      });
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalForCoin = (state.totalMined[state.coin] || 0) + (state.isMining ? state.sessionMined : 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
          Mine
        </h1>
        <p className="text-gray-500">
          Select a coin and start mining. Track your session stats in real time.
        </p>
      </div>

      {/* Coin selector */}
      <div className="card p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Choose Coin
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {COINS.map((coin) => (
            <button
              key={coin.symbol}
              onClick={() => {
                if (!state.isMining) setState((s) => ({ ...s, coin: coin.symbol }));
              }}
              disabled={state.isMining}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                state.coin === coin.symbol
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-surface-200 hover:border-surface-300 text-gray-600"
              } ${state.isMining ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: coin.color }}
              >
                {coin.symbol[0]}
              </div>
              <span className="text-xs font-medium">{coin.symbol}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Chart for selected coin */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {selectedCoin.name} Live Chart
        </h2>
        <TradingViewWidget
          key={`mine-${state.coin}`}
          symbol={TV_SYMBOLS[state.coin] || "BINANCE:BTCUSDT"}
          height={320}
        />
      </div>

      {/* Mining dashboard */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <p className="text-xs text-gray-500 mb-1">Session Mined</p>
          <p className="text-2xl font-heading font-bold text-gray-900">
            {state.sessionMined.toFixed(8)}
          </p>
          <p className="text-xs text-gray-400">{state.coin}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-gray-500 mb-1">Total Mined</p>
          <p className="text-2xl font-heading font-bold text-gray-900">
            {totalForCoin.toFixed(8)}
          </p>
          <p className="text-xs text-gray-400">{state.coin}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-gray-500 mb-1">Session Time</p>
          <p className="text-2xl font-heading font-bold text-gray-900 font-mono">
            {formatTime(state.sessionTime)}
          </p>
          <p className="text-xs text-gray-400">
            Rate: {selectedCoin.rate} {state.coin}/s
          </p>
        </div>
      </div>

      {/* Mining visual + controls */}
      <div className="card p-6 sm:p-8 text-center">
        {/* Mining animation */}
        <div className="relative mx-auto w-40 h-40 mb-8">
          <div
            className={`absolute inset-0 rounded-full border-4 transition-colors duration-500 ${
              state.isMining
                ? "border-brand-500 shadow-lg shadow-brand-500/25"
                : "border-surface-300"
            }`}
          />
          {state.isMining && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-brand-400 animate-ping opacity-20" />
              <div className="absolute inset-4 rounded-full border-2 border-brand-300 animate-pulse" />
            </>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: selectedCoin.color }}
            >
              {selectedCoin.symbol}
            </div>
          </div>
        </div>

        <p className="text-lg font-heading font-bold text-gray-900 mb-2">
          {state.isMining ? `Mining ${selectedCoin.name}...` : `Ready to Mine ${selectedCoin.name}`}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {state.isMining
            ? `Earning ~${selectedCoin.rate} ${state.coin} per second`
            : "Click Start to begin mining"}
        </p>

        <div className="flex items-center justify-center gap-4">
          {!state.isMining ? (
            <button onClick={startMining} className="btn-primary text-base px-10 py-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Start Mining
            </button>
          ) : (
            <button onClick={stopMining} className="btn-primary bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/25 hover:shadow-red-500/30 text-base px-10 py-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop Mining
            </button>
          )}
        </div>
      </div>

      {/* All-time stats */}
      {Object.keys(state.totalMined).length > 0 && (
        <div className="card p-6 mt-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            All-Time Mining Stats
          </h2>
          <div className="space-y-3">
            {Object.entries(state.totalMined).map(([coin, amount]) => {
              const coinData = COINS.find((c) => c.symbol === coin);
              return (
                <div key={coin} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: coinData?.color || "#888" }}
                    >
                      {coin[0]}
                    </div>
                    <span className="font-medium text-gray-900">{coin}</span>
                  </div>
                  <span className="font-mono text-sm text-gray-600">{amount.toFixed(8)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>⚠️ Disclaimer:</strong> Mining displayed here is simulated for demonstration purposes.
          No actual cryptocurrency is being mined unless this application is connected to a real mining
          backend or pool. The mining rates shown are fictional and for UI demonstration only.
        </p>
      </div>
    </div>
  );
}
