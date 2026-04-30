"use client";

import Link from "next/link";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { ASSETS, fmt, fmtPrice } from "@/lib/mockData";
import SparklineChart from "@/components/SparklineChart";
import WatchlistButton from "@/components/WatchlistButton";
import { useWatchlist } from "@/hooks/useWatchlist";

function WatchlistPageClient() {
  const { watchlist } = useWatchlist();
  const watched = ASSETS.filter((a) => watchlist.includes(a.symbol));

  if (watched.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Star className="h-10 w-10 text-[#2A2D3A]" />
        <p className="text-sm font-medium text-[#5B616E]">No assets in watchlist yet</p>
        <p className="text-xs text-[#5B616E]">
          Click the{" "}
          <Star className="inline h-3 w-3" style={{ color: "#5B616E" }} />{" "}
          icon next to any asset to add it here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#2A2D3A] bg-[#131722] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A2D3A]">
            {["", "Asset", "Price", "24h Change", "Volume", "7d"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#5B616E] first:w-8">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {watched.map((asset) => {
            const up = asset.change24h >= 0;
            return (
              <tr
                key={asset.symbol}
                className="border-b border-[#2A2D3A]/50 transition-colors hover:bg-[#1C1E26] last:border-0"
              >
                <td className="px-4 py-3">
                  <WatchlistButton symbol={asset.symbol} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/trade/${asset.symbol}`} className="flex items-center gap-2 group">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0052FF]/10 text-xs font-bold text-[#0052FF]">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-[#E8ECF0] group-hover:text-[#0052FF] transition-colors">
                        {asset.symbol}
                      </div>
                      <div className="text-xs text-[#5B616E]">{asset.name}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono font-medium text-[#E8ECF0]">
                  {fmtPrice(asset.price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                      up
                        ? "bg-[#05B169]/10 text-[#05B169]"
                        : "bg-[#CF202F]/10 text-[#CF202F]"
                    }`}
                  >
                    {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {up ? "+" : ""}{asset.change24h.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-[#5B616E]">{fmt(asset.volume24h)}</td>
                <td className="px-4 py-3">
                  <SparklineChart data={asset.sparkline} positive={up} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-[#E8ECF0]">Watchlist</h1>
        <p className="text-xs text-[#5B616E] mt-0.5">Your saved assets</p>
      </div>
      <WatchlistPageClient />
    </div>
  );
}
