export type Asset = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  sparkline: number[];
};

export type OrderBookEntry = { price: number; size: number; total: number };
export type Trade = { price: number; size: number; side: "buy" | "sell"; time: string };
export type Candle = { time: string; open: number; high: number; low: number; close: number; volume: number };
export type Holding = { symbol: string; name: string; amount: number; avgCost: number; currentPrice: number };

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function sparkline(base: number, len = 20): number[] {
  const pts: number[] = [base];
  for (let i = 1; i < len; i++) pts.push(pts[i - 1] * (1 + rnd(-0.02, 0.02)));
  return pts;
}

export const ASSETS: Asset[] = [
  { symbol: "BTC",  name: "Bitcoin",       price: 67420.50, change24h: 2.34,  volume24h: 28_400_000_000, marketCap: 1_320_000_000_000, sparkline: sparkline(67000) },
  { symbol: "ETH",  name: "Ethereum",      price: 3520.80,  change24h: 1.87,  volume24h: 14_200_000_000, marketCap: 422_000_000_000,   sparkline: sparkline(3500) },
  { symbol: "SOL",  name: "Solana",        price: 182.40,   change24h: -0.92, volume24h: 3_800_000_000,  marketCap: 81_000_000_000,    sparkline: sparkline(182) },
  { symbol: "BNB",  name: "BNB",           price: 598.20,   change24h: 0.54,  volume24h: 1_900_000_000,  marketCap: 88_000_000_000,    sparkline: sparkline(598) },
  { symbol: "XRP",  name: "XRP",           price: 0.6230,   change24h: -1.43, volume24h: 2_100_000_000,  marketCap: 35_000_000_000,    sparkline: sparkline(0.62) },
  { symbol: "DOGE", name: "Dogecoin",      price: 0.1842,   change24h: 3.21,  volume24h: 1_200_000_000,  marketCap: 26_000_000_000,    sparkline: sparkline(0.18) },
  { symbol: "ADA",  name: "Cardano",       price: 0.4920,   change24h: -0.78, volume24h: 540_000_000,    marketCap: 17_000_000_000,    sparkline: sparkline(0.49) },
  { symbol: "AVAX", name: "Avalanche",     price: 39.84,    change24h: 1.12,  volume24h: 620_000_000,    marketCap: 16_000_000_000,    sparkline: sparkline(39) },
];

function genCandles(base: number, count = 60): Candle[] {
  const candles: Candle[] = [];
  let price = base;
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    const open = price;
    const close = open * (1 + rnd(-0.015, 0.015));
    const high = Math.max(open, close) * (1 + rnd(0, 0.008));
    const low = Math.min(open, close) * (1 - rnd(0, 0.008));
    const time = new Date(now - i * 3_600_000).toISOString().slice(0, 13) + ":00";
    candles.push({ time, open, high, low, close, volume: rnd(100, 1000) });
    price = close;
  }
  return candles;
}

export const CANDLES: Record<string, Candle[]> = {
  BTC:  genCandles(65000),
  ETH:  genCandles(3400),
  SOL:  genCandles(175),
  BNB:  genCandles(590),
  XRP:  genCandles(0.61),
  DOGE: genCandles(0.17),
  ADA:  genCandles(0.48),
  AVAX: genCandles(38),
};

function genOrderBook(mid: number): { bids: OrderBookEntry[]; asks: OrderBookEntry[] } {
  let bidTotal = 0, askTotal = 0;
  const bids: OrderBookEntry[] = Array.from({ length: 12 }, (_, i) => {
    const price = mid * (1 - 0.0002 * (i + 1));
    const size = rnd(0.1, 4);
    bidTotal += size;
    return { price, size, total: bidTotal };
  });
  const asks: OrderBookEntry[] = Array.from({ length: 12 }, (_, i) => {
    const price = mid * (1 + 0.0002 * (i + 1));
    const size = rnd(0.1, 4);
    askTotal += size;
    return { price, size, total: askTotal };
  });
  return { bids, asks };
}

export function getOrderBook(symbol: string) {
  const asset = ASSETS.find((a) => a.symbol === symbol);
  return genOrderBook(asset?.price ?? 100);
}

export function getRecentTrades(symbol: string): Trade[] {
  const asset = ASSETS.find((a) => a.symbol === symbol);
  const mid = asset?.price ?? 100;
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => {
    const side: "buy" | "sell" = Math.random() > 0.5 ? "buy" : "sell";
    const price = mid * (1 + rnd(-0.002, 0.002));
    const d = new Date(now - i * 8000);
    const time = d.toTimeString().slice(0, 8);
    return { price, size: rnd(0.01, 2), side, time };
  });
}

export const HOLDINGS: Holding[] = [
  { symbol: "BTC",  name: "Bitcoin",   amount: 0.42,  avgCost: 58000, currentPrice: 67420.50 },
  { symbol: "ETH",  name: "Ethereum",  amount: 3.8,   avgCost: 3100,  currentPrice: 3520.80 },
  { symbol: "SOL",  name: "Solana",    amount: 25,    avgCost: 165,   currentPrice: 182.40 },
  { symbol: "DOGE", name: "Dogecoin",  amount: 12000, avgCost: 0.15,  currentPrice: 0.1842 },
];

export function fmt(n: number, decimals = 2): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(decimals)}`;
}

export function fmtPrice(n: number): string {
  if (n < 0.01) return `$${n.toFixed(6)}`;
  if (n < 1)    return `$${n.toFixed(4)}`;
  if (n < 100)  return `$${n.toFixed(3)}`;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
