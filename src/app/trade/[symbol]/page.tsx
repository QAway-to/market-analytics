import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { ASSETS, CANDLES, getOrderBook, getRecentTrades, fmtPrice, fmt } from "@/lib/mockData";
import PriceChart from "@/components/PriceChart";
import OrderBook from "@/components/OrderBook";
import RecentTrades from "@/components/RecentTrades";

type Props = { params: Promise<{ symbol: string }> };

export function generateStaticParams() {
  return [
    { symbol: "BTC" }, { symbol: "ETH" }, { symbol: "SOL" },
    { symbol: "BNB" }, { symbol: "XRP" }, { symbol: "DOGE" },
    { symbol: "ADA" }, { symbol: "AVAX" },
  ];
}

export default async function TradePage({ params }: Props) {
  const { symbol } = await params;
  const asset = ASSETS.find((a) => a.symbol === symbol.toUpperCase());
  if (!asset) notFound();

  const candlesByTf = CANDLES[asset.symbol] ?? {};
  const { bids, asks } = getOrderBook(asset.symbol);
  const trades = getRecentTrades(asset.symbol);
  const up = asset.change24h >= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-[#5B616E] hover:text-[#E8ECF0] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Markets
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0052FF]/10 text-sm font-bold text-[#0052FF]">
            {asset.symbol[0]}
          </div>
          <div>
            <div className="font-bold text-[#E8ECF0]">{asset.name}</div>
            <div className="text-xs text-[#5B616E]">{asset.symbol} / USD</div>
          </div>
        </div>

        <div className="text-2xl font-bold text-[#E8ECF0] font-mono">{fmtPrice(asset.price)}</div>

        <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-semibold ${
          up ? "bg-[#05B169]/10 text-[#05B169]" : "bg-[#CF202F]/10 text-[#CF202F]"
        }`}>
          {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {up ? "+" : ""}{asset.change24h.toFixed(2)}%
        </span>

        <div className="ml-auto flex gap-6 text-xs">
          <div>
            <div className="text-[#5B616E]">24h Volume</div>
            <div className="font-medium text-[#E8ECF0]">{fmt(asset.volume24h)}</div>
          </div>
          <div>
            <div className="text-[#5B616E]">Market Cap</div>
            <div className="font-medium text-[#E8ECF0]">{fmt(asset.marketCap)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <PriceChart candlesByTf={candlesByTf} symbol={asset.symbol} />
        </div>
        <div className="space-y-4">
          <OrderBook bids={bids} asks={asks} mid={asset.price} />
          <RecentTrades trades={trades} />
        </div>
      </div>
    </div>
  );
}