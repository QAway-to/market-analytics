import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ASSETS, fmt, fmtPrice } from "@/lib/mockData";
import SparklineChart from "@/components/SparklineChart";
import StatCard from "@/components/StatCard";

const totalMarketCap = ASSETS.reduce((s, a) => s + a.marketCap, 0);
const totalVolume = ASSETS.reduce((s, a) => s + a.volume24h, 0);
const gainers = ASSETS.filter((a) => a.change24h > 0).length;

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-[#E8ECF0]">Market Overview</h1>
        <p className="text-xs text-[#5B616E] mt-0.5">Live crypto market data · 8 assets</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Market Cap" value={fmt(totalMarketCap)} />
        <StatCard label="24h Volume" value={fmt(totalVolume)} />
        <StatCard label="Gainers" value={`${gainers} / ${ASSETS.length}`} positive />
        <StatCard label="BTC Dominance" value="48.2%" />
      </div>

      <div className="rounded-xl border border-[#2A2D3A] bg-[#131722] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2D3A]">
              {["#", "Asset", "Price", "24h Change", "Volume", "Market Cap", "7d"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#5B616E] first:w-8">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ASSETS.map((asset, i) => {
              const up = asset.change24h >= 0;
              return (
                <tr
                  key={asset.symbol}
                  className="border-b border-[#2A2D3A]/50 transition-colors hover:bg-[#1C1E26] last:border-0"
                >
                  <td className="px-4 py-3 text-xs text-[#5B616E]">{i + 1}</td>
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
                  <td className="px-4 py-3 text-[#5B616E]">{fmt(asset.marketCap)}</td>
                  <td className="px-4 py-3">
                    <SparklineChart data={asset.sparkline} positive={up} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
