export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function generateMockAddress(): string {
  const chars = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
}

export const COINS = [
  { symbol: "BTC", name: "Bitcoin", color: "#f7931a", rate: 0.000001 },
  { symbol: "ETH", name: "Ethereum", color: "#627eea", rate: 0.00005 },
  { symbol: "SOL", name: "Solana", color: "#9945ff", rate: 0.001 },
  { symbol: "BNB", name: "BNB", color: "#f3ba2f", rate: 0.0001 },
  { symbol: "XRP", name: "Ripple", color: "#00aae4", rate: 0.01 },
  { symbol: "ADA", name: "Cardano", color: "#0033ad", rate: 0.05 },
  { symbol: "DOGE", name: "Dogecoin", color: "#c3a634", rate: 0.1 },
  { symbol: "DOT", name: "Polkadot", color: "#e6007a", rate: 0.005 },
] as const;

export type CoinSymbol = (typeof COINS)[number]["symbol"];
