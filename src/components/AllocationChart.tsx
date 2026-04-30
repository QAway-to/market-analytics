"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0052FF", "#05B169", "#F5A623", "#CF202F"];

type Props = { data: { name: string; value: number }[] };

export default function AllocationChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#1C1E26", border: "1px solid #2A2D3A", borderRadius: 8 }}
          itemStyle={{ color: "#E8ECF0", fontSize: 12 }}
          formatter={(v) => v != null ? [`${v}%`, "Allocation"] : ["—", "Allocation"]}
        />
        <Legend formatter={(value) => <span className="text-xs text-[#5B616E]">{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}
