"use client";
import type { OrderBookEntry } from "@/lib/mockData";
import { fmtPrice } from "@/lib/mockData";

type Props = { bids: OrderBookEntry[]; asks: OrderBookEntry[]; mid: number };

function Row({ entry, side, maxTotal }: { entry: OrderBookEntry; side: "bid" | "ask"; maxTotal: number }) {
  const pct = (entry.total / maxTotal) * 100;
  const bg = side === "bid" ? "bg-[#05B169]/8" : "bg-[#CF202F]/8";
  const color = side === "bid" ? "text-[#05B169]" : "text-[#CF202F]";
  return (
    <div className="relative grid grid-cols-3 px-2 py-[3px] text-xs hover:bg-[#2A2D3A]/40">
      <div
        className={`absolute inset-y-0 right-0 ${bg}`}
        style={{ width: `${pct}%` }}
      />
      <span className={`relative ${color}`}>{fmtPrice(entry.price)}</span>
      <span className="relative text-right text-[#E8ECF0]">{entry.size.toFixed(3)}</span>
      <span className="relative text-right text-[#5B616E]">{entry.total.toFixed(3)}</span>
    </div>
  );
}

export default function OrderBook({ bids, asks, mid }: Props) {
  const maxBidTotal = bids[bids.length - 1]?.total ?? 1;
  const maxAskTotal = asks[asks.length - 1]?.total ?? 1;

  return (
    <div className="rounded-xl border border-[#2A2D3A] bg-[#131722] p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#E8ECF0]">Order Book</h3>
      <div className="grid grid-cols-3 px-2 pb-1 text-xs text-[#5B616E]">
        <span>Price (USD)</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      <div className="space-y-0">
        {[...asks].reverse().map((a, i) => (
          <Row key={i} entry={a} side="ask" maxTotal={maxAskTotal} />
        ))}
      </div>

      <div className="my-2 border-y border-[#2A2D3A] py-1.5 px-2">
        <span className="text-sm font-bold text-[#0052FF]">{fmtPrice(mid)}</span>
        <span className="ml-2 text-xs text-[#5B616E]">Mid</span>
      </div>

      <div className="space-y-0">
        {bids.map((b, i) => (
          <Row key={i} entry={b} side="bid" maxTotal={maxBidTotal} />
        ))}
      </div>
    </div>
  );
}
