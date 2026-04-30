import type { Trade } from "@/lib/mockData";
import { fmtPrice } from "@/lib/mockData";

export default function RecentTrades({ trades }: { trades: Trade[] }) {
  return (
    <div className="rounded-xl border border-[#2A2D3A] bg-[#131722] p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#E8ECF0]">Recent Trades</h3>
      <div className="grid grid-cols-3 px-1 pb-1 text-xs text-[#5B616E]">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Time</span>
      </div>
      <div className="space-y-0 overflow-y-auto max-h-[260px]">
        {trades.map((t, i) => (
          <div key={i} className="grid grid-cols-3 px-1 py-[3px] text-xs hover:bg-[#2A2D3A]/30">
            <span className={t.side === "buy" ? "text-[#05B169]" : "text-[#CF202F]"}>
              {fmtPrice(t.price)}
            </span>
            <span className="text-right text-[#E8ECF0]">{t.size.toFixed(4)}</span>
            <span className="text-right text-[#5B616E]">{t.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
