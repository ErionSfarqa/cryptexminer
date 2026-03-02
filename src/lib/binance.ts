/**
 * Binance Public API Client
 * Uses public REST endpoints (no API key required for market data).
 * Implements in-memory caching with configurable TTL.
 */

const BASE_URL = "https://api.binance.com";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 30_000; // 30 seconds

async function fetchWithCache<T>(
  endpoint: string,
  params?: Record<string, string>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const cacheKey = url.toString();
  const cached = cache.get(cacheKey) as CacheEntry<T> | undefined;

  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const response = await fetch(cacheKey, {
    headers: { Accept: "application/json" },
  });

  if (response.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as T;
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

/* ─── Types ───────────────────────────────────────────────── */

export interface Ticker24h {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}

export interface ExchangeSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
}

export interface Kline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
}

/* ─── Endpoints ───────────────────────────────────────────── */

export async function get24hrTickers(): Promise<Ticker24h[]> {
  return fetchWithCache<Ticker24h[]>("/api/v3/ticker/24hr");
}

export async function get24hrTicker(symbol: string): Promise<Ticker24h> {
  return fetchWithCache<Ticker24h>("/api/v3/ticker/24hr", { symbol });
}

export async function getExchangeInfo(): Promise<{ symbols: ExchangeSymbol[] }> {
  return fetchWithCache<{ symbols: ExchangeSymbol[] }>(
    "/api/v3/exchangeInfo",
    undefined,
    300_000 // 5 min cache — this rarely changes
  );
}

export async function getKlines(
  symbol: string,
  interval: string = "1h",
  limit: number = 100
): Promise<Kline[]> {
  const raw = await fetchWithCache<number[][]>("/api/v3/klines", {
    symbol,
    interval,
    limit: String(limit),
  });

  return raw.map((k) => ({
    openTime: k[0],
    open: String(k[1]),
    high: String(k[2]),
    low: String(k[3]),
    close: String(k[4]),
    volume: String(k[5]),
    closeTime: k[6],
  }));
}

export async function getTopGainers(limit = 10): Promise<Ticker24h[]> {
  const tickers = await get24hrTickers();
  const usdtPairs = tickers.filter(
    (t) => t.symbol.endsWith("USDT") && parseFloat(t.quoteVolume) > 1_000_000
  );
  return usdtPairs
    .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
    .slice(0, limit);
}

export async function getTopLosers(limit = 10): Promise<Ticker24h[]> {
  const tickers = await get24hrTickers();
  const usdtPairs = tickers.filter(
    (t) => t.symbol.endsWith("USDT") && parseFloat(t.quoteVolume) > 1_000_000
  );
  return usdtPairs
    .sort((a, b) => parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent))
    .slice(0, limit);
}

export async function getPopularTickers(): Promise<Ticker24h[]> {
  const popular = [
    "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT",
    "ADAUSDT", "DOGEUSDT", "DOTUSDT", "AVAXUSDT", "MATICUSDT",
    "LINKUSDT", "LTCUSDT",
  ];
  const tickers = await get24hrTickers();
  return tickers.filter((t) => popular.includes(t.symbol));
}

/* ─── Helpers ─────────────────────────────────────────────── */

export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (num >= 1000) return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (num >= 1) return num.toFixed(2);
  if (num >= 0.01) return num.toFixed(4);
  return num.toFixed(8);
}

export function formatPercent(pct: string | number): string {
  const num = typeof pct === "string" ? parseFloat(pct) : pct;
  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}

export function formatVolume(vol: string | number): string {
  const num = typeof vol === "string" ? parseFloat(vol) : vol;
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

export function symbolToBase(symbol: string): string {
  return symbol.replace(/USDT$|BUSD$|BTC$|ETH$|BNB$/, "");
}
