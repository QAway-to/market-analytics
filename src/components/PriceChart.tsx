"use client";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
} from "recharts";
import type { Candle } from "@/lib/mockData";

type Props = { candles: Candle[]; symbol: string };

export default function PriceChart({ candles, symbol }: Props) {
  const data = candles.map((c) => ({
    time: c.time.slice(5, 13),
    close: c.close,
    volume: c.volume,
    open: c.open,
    high: c.high,
    low: c.low,
  }));

  const prices = candles.map((c) => c.close);
  const min = Math.min(...prices) * 0.999;
  const max = Math.max(...prices) * 1.001;
  const isUp = candles[candles.length - 1].close >= candles[0].open;
  const color = isUp ? "#05B169" : "#CF202F";

  return (
    <div className="rounded-xl border border-[#2A2D3A] bg-[#131722] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#E8ECF0]">{symbol} / USD · 1H</h2>
        <div className="flex gap-1">
          {["1H", "4H", "1D", "1W"].map((t) => (
            <button
              key={t}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${
                t === "1H"
                  ? "bg-[#0052FF]/15 text-[#0052FF]"
                  : "text-[#5B616E] hover:text-[#E8ECF0]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: "#5B616E", fontSize: 10 }} tickLine={false} axisLine={false} interval={9} />
          <YAxis
            domain={[min, max]}
            tick={{ fill: "#5B616E", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(2)}
            width={52}
          />
          <Tooltip
            contentStyle={{ background: "#1C1E26", border: "1px solid #2A2D3A", borderRadius: 8 }}
            labelStyle={{ color: "#5B616E", fontSize: 11 }}
            itemStyle={{ color: "#E8ECF0", fontSize: 12 }}
            formatter={(v) => v != null ? [`$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, "Price"] : ["—", "Price"]}
          />
          <Area type="monotone" dataKey="close" stroke={color} strokeWidth={2} fill="url(#areaGrad)" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={50}>
        <ComposedChart data={data} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Bar dataKey="volume" fill="#0052FF" opacity={0.4} radius={[1, 1, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
