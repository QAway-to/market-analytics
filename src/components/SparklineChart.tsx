"use client";
import { LineChart, Line, ResponsiveContainer } from "recharts";

type Props = { data: number[]; positive: boolean };

export default function SparklineChart({ data, positive }: Props) {
  const color = positive ? "#05B169" : "#CF202F";
  const chartData = data.map((v) => ({ v }));
  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="v" stroke={color} dot={false} strokeWidth={1.5} />
      </LineChart>
    </ResponsiveContainer>
  );
}
