import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { HOLDINGS, fmtPrice, fmt } from "@/lib/mockData";
import StatCard from "@/components/StatCard";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const COLORS = ["#0052FF", "#05B169", "#F5A623", "#CF202F"];

const totalValue = HOLDINGS.reduce((s, h) => s + h.amount * h.currentPrice, 0);
const totalCost  = HOLDINGS.reduce((s, h) => s + h.amount * h.avgCost, 0);
const totalPnL   = totalValue - totalCost;
const pnlPct     = ((totalPnL / totalCost) * 100);

const pieData = HOLDINGS.map((h) => ({
  name: h.symbol,
  value: Math.round((h.amount * h.currentPrice / totalValue) * 100),
}));

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-[#E8ECF0]">Portfolio</h1>
        <p className="text-xs text-[#5B616E] mt-0.5">Your holdings & performance</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Value" value={`$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <StatCard
          label="Total P&L"
          value={`${totalPnL >= 0 ? "+" : ""}$${Math.abs(totalPnL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub={`${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}% all time`}
          positive={totalPnL >= 0}
        />
        <StatCard label="Assets" value={`${HOLDINGS.length}`} />
        <StatCard label="Total Cost" value={`$${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[#2A2D3A] bg-[#131722] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#E8ECF0]">Allocation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1C1E26", border: "1px solid #2A2D3A", borderRadius: 8 }}
                itemStyle={{ color: "#E8ECF0", fontSize: 12 }}
                formatter={(v) => v != null ? [`${v}%`, "Allocation"] : ["—", "Allocation"]}
              />
              <Legend
                formatter={(value) => <span className="text-xs text-[#5B616E]">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-[#2A2D3A] bg-[#131722] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2D3A]">
                {["Asset", "Amount", "Avg Cost", "Current", "Value", "P&L"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#5B616E]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOLDINGS.map((h) => {
                const value = h.amount * h.currentPrice;
                const cost  = h.amount * h.avgCost;
                const pnl   = value - cost;
                const pct   = ((pnl / cost) * 100);
                const up    = pnl >= 0;
                return (
                  <tr key={h.symbol} className="border-b border-[#2A2D3A]/50 last:border-0 hover:bg-[#1C1E26] transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/trade/${h.symbol}`} className="flex items-center gap-2 group">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0052FF]/10 text-xs font-bold text-[#0052FF]">
                          {h.symbol[0]}
                        </div>
                        <span className="font-semibold text-[#E8ECF0] group-hover:text-[#0052FF] transition-colors">{h.symbol}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#E8ECF0]">{h.amount}</td>
                    <td className="px-4 py-3 text-[#5B616E]">{fmtPrice(h.avgCost)}</td>
                    <td className="px-4 py-3 font-mono text-[#E8ECF0]">{fmtPrice(h.currentPrice)}</td>
                    <td className="px-4 py-3 font-medium text-[#E8ECF0]">
                      ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1 text-xs font-semibold ${up ? "text-[#05B169]" : "text-[#CF202F]"}`}>
                        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {up ? "+" : ""}${Math.abs(pnl).toFixed(2)}
                        <span className="text-[10px] opacity-70">({up ? "+" : ""}{pct.toFixed(1)}%)</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
