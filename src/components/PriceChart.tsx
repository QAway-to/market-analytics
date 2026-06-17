"use client";
import { useState } from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Line,
  LineChart,
  ReferenceLine,
  Cell,
} from "recharts";
import type { Candle } from "@/lib/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChartType = "area" | "candle";

type Props = { candlesByTf: Record<string, Candle[]>; symbol: string };

interface ChartRow {
  time: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

interface IndicatorRow {
  time: string;
  rsi: number | null;
  macd: number | null;
  signal: number | null;
  histogram: number | null;
}

// ─── Indicator calculations ───────────────────────────────────────────────────

function calcRSI(closes: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = Array(closes.length).fill(null);
  if (closes.length < period + 1) return result;

  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) avgGain += diff;
    else avgLoss += Math.abs(diff);
  }
  avgGain /= period;
  avgLoss /= period;

  const rs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
  result[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    const rs2 = avgLoss === 0 ? Infinity : avgGain / avgLoss;
    result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs2);
  }

  return result;
}

function calcEMA(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = Array(values.length).fill(null);
  if (values.length < period) return result;

  const k = 2 / (period + 1);
  let ema = 0;
  for (let i = 0; i < period; i++) ema += values[i];
  ema /= period;
  result[period - 1] = ema;

  for (let i = period; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k);
    result[i] = ema;
  }

  return result;
}

function calcMACD(
  closes: number[]
): { macd: (number | null)[]; signal: (number | null)[]; histogram: (number | null)[] } {
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);

  const macdLine: (number | null)[] = closes.map((_, i) => {
    const e12 = ema12[i];
    const e26 = ema26[i];
    return e12 != null && e26 != null ? e12 - e26 : null;
  });

  // EMA(9) of MACD — only over non-null values, but we need positional alignment
  const firstMacdIdx = macdLine.findIndex((v) => v != null);
  const signal: (number | null)[] = Array(closes.length).fill(null);

  if (firstMacdIdx >= 0) {
    const macdSlice = macdLine.slice(firstMacdIdx).map((v) => v as number);
    const signalSlice = calcEMA(macdSlice, 9);
    signalSlice.forEach((v, idx) => {
      signal[firstMacdIdx + idx] = v;
    });
  }

  const histogram: (number | null)[] = macdLine.map((m, i) => {
    const s = signal[i];
    return m != null && s != null ? m - s : null;
  });

  return { macd: macdLine, signal, histogram };
}

// ─── Custom candlestick shape ─────────────────────────────────────────────────

interface CandlePayload {
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandleShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: CandlePayload;
  yAxis?: { scale?: (v: number) => number };
}

function CandleShape(props: CandleShapeProps) {
  const { x = 0, width = 0, payload, yAxis } = props;
  if (!payload || !yAxis?.scale) return null;

  const { open, close, high, low } = payload;
  const scale = yAxis.scale;

  const isGreen = close >= open;
  const color = isGreen ? "#05B169" : "#CF202F";

  const yOpen = scale(open);
  const yClose = scale(close);
  const yHigh = scale(high);
  const yLow = scale(low);

  const bodyTop = Math.min(yOpen, yClose);
  const bodyBottom = Math.max(yOpen, yClose);
  const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

  const centerX = x + width / 2;
  const candleWidth = Math.max(width * 0.7, 2);
  const bodyX = centerX - candleWidth / 2;

  return (
    <g>
      {/* Wick */}
      <line
        x1={centerX}
        y1={yHigh}
        x2={centerX}
        y2={yLow}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={bodyX}
        y={bodyTop}
        width={candleWidth}
        height={bodyHeight}
        fill={color}
        stroke={color}
        strokeWidth={0.5}
      />
    </g>
  );
}

// ─── Tooltip formatter helpers ────────────────────────────────────────────────

const PRICE_CONTENT_STYLE = {
  background: "#1C1E26",
  border: "1px solid #2A2D3A",
  borderRadius: 8,
};
const LABEL_STYLE = { color: "#5B616E", fontSize: 11 };
const ITEM_STYLE = { color: "#E8ECF0", fontSize: 12 };

function formatPrice(v: unknown): [string, string] {
  return v != null
    ? [`$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, "Price"]
    : ["—", "Price"];
}

function formatIndicator(v: unknown, name?: string): [string, string] {
  const label = name ?? "";
  return v != null ? [Number(v).toFixed(2), label] : ["—", label];
}

// ─── Subcharts ────────────────────────────────────────────────────────────────

interface RSIChartProps {
  data: IndicatorRow[];
}

function RSIChart({ data }: RSIChartProps) {
  return (
    <div className="relative">
      <span className="absolute left-10 top-1 z-10 text-[9px] font-medium text-[#5B616E]">
        RSI 14
      </span>
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={data} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
          <XAxis dataKey="time" hide />
          <YAxis
            domain={[0, 100]}
            ticks={[30, 70]}
            tick={{ fill: "#5B616E", fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip
            contentStyle={PRICE_CONTENT_STYLE}
            labelStyle={LABEL_STYLE}
            itemStyle={ITEM_STYLE}
            formatter={(v: unknown) => formatIndicator(v, "RSI")}
          />
          <ReferenceLine y={70} stroke="#CF202F" strokeDasharray="3 3" strokeWidth={1} />
          <ReferenceLine y={30} stroke="#05B169" strokeDasharray="3 3" strokeWidth={1} />
          <Line
            type="monotone"
            dataKey="rsi"
            stroke="#0052FF"
            strokeWidth={1.5}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface MACDChartProps {
  data: IndicatorRow[];
}

function MACDChart({ data }: MACDChartProps) {
  return (
    <div className="relative">
      <span className="absolute left-10 top-1 z-10 text-[9px] font-medium text-[#5B616E]">
        MACD 12,26,9
      </span>
      <ResponsiveContainer width="100%" height={60}>
        <ComposedChart data={data} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
          <XAxis dataKey="time" hide />
          <YAxis
            tick={{ fill: "#5B616E", fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            width={52}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
          <Tooltip
            contentStyle={PRICE_CONTENT_STYLE}
            labelStyle={LABEL_STYLE}
            itemStyle={ITEM_STYLE}
            formatter={(v, name) => formatIndicator(v, name as string | undefined)}
          />
          <ReferenceLine y={0} stroke="#2A2D3A" strokeWidth={1} />
          <Bar dataKey="histogram" radius={[1, 1, 0, 0]}>
            {data.map((row, idx) => (
              <Cell
                key={`hist-${idx}`}
                fill={
                  row.histogram == null
                    ? "transparent"
                    : row.histogram >= 0
                    ? "#05B169"
                    : "#CF202F"
                }
                opacity={0.7}
              />
            ))}
          </Bar>
          <Line
            type="monotone"
            dataKey="macd"
            stroke="#0052FF"
            strokeWidth={1.5}
            dot={false}
            connectNulls
            name="MACD"
          />
          <Line
            type="monotone"
            dataKey="signal"
            stroke="#F5A623"
            strokeWidth={1.5}
            dot={false}
            connectNulls
            name="Signal"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PriceChart({ candlesByTf, symbol }: Props) {
  const [chartType, setChartType] = useState<ChartType>("area");
  const [activeTimeframe, setActiveTimeframe] = useState("1H");

  const candles = candlesByTf[activeTimeframe] ?? [];
  const isDateOnly = activeTimeframe === "1D" || activeTimeframe === "1W";

  const data: ChartRow[] = candles.map((c) => ({
    time: isDateOnly ? c.time.slice(5, 10) : c.time.slice(5, 13),
    close: c.close,
    volume: c.volume,
    open: c.open,
    high: c.high,
    low: c.low,
  }));

  const closes = candles.map((c) => c.close);
  const min = closes.length > 0 ? Math.min(...closes) * 0.999 : 0;
  const max = closes.length > 0 ? Math.max(...closes) * 1.001 : 100;
  const isUp = candles.length > 0 && candles[candles.length - 1].close >= candles[0].open;
  const areaColor = isUp ? "#05B169" : "#CF202F";

  // Indicators
  const rsiValues = calcRSI(closes);
  const { macd, signal, histogram } = calcMACD(closes);

  const indicatorData: IndicatorRow[] = data.map((row, i) => ({
    time: row.time,
    rsi: rsiValues[i],
    macd: macd[i],
    signal: signal[i],
    histogram: histogram[i],
  }));

  const yTickFormatter = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(2);

  return (
    <div className="rounded-xl border border-[#2A2D3A] bg-[#131722] p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#E8ECF0]">
          {symbol} / USD · {activeTimeframe}
        </h2>
        <div className="flex items-center gap-2">
          {/* Chart type toggle */}
          <div className="flex gap-1 border-r border-[#2A2D3A] pr-2">
            {(["area", "candle"] as ChartType[]).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`rounded px-2 py-0.5 text-xs capitalize transition-colors ${
                  chartType === type
                    ? "bg-[#0052FF]/15 text-[#0052FF]"
                    : "text-[#5B616E] hover:text-[#E8ECF0]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {/* Timeframe buttons */}
          <div className="flex gap-1">
            {["1H", "4H", "1D", "1W"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTimeframe(t)}
                className={`rounded px-2 py-0.5 text-xs transition-colors ${
                  activeTimeframe === t
                    ? "bg-[#0052FF]/15 text-[#0052FF]"
                    : "text-[#5B616E] hover:text-[#E8ECF0]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price chart */}
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={areaColor} stopOpacity={0.15} />
              <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: "#5B616E", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={9}
          />
          <YAxis
            domain={[min, max]}
            tick={{ fill: "#5B616E", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={yTickFormatter}
            width={52}
          />
          <Tooltip
            contentStyle={PRICE_CONTENT_STYLE}
            labelStyle={LABEL_STYLE}
            itemStyle={ITEM_STYLE}
            formatter={formatPrice}
          />
          {chartType === "area" && (
            <Area
              type="monotone"
              dataKey="close"
              stroke={areaColor}
              strokeWidth={2}
              fill="url(#areaGrad)"
              dot={false}
            />
          )}
          {chartType === "candle" && (
            <Bar
              dataKey="close"
              shape={(shapeProps: CandleShapeProps) => <CandleShape {...shapeProps} />}
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Volume bar */}
      <ResponsiveContainer width="100%" height={50}>
        <ComposedChart data={data} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Bar dataKey="volume" fill="#0052FF" opacity={0.4} radius={[1, 1, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* RSI */}
      <div className="mt-1 border-t border-[#2A2D3A] pt-1">
        <RSIChart data={indicatorData} />
      </div>

      {/* MACD */}
      <div className="mt-1 border-t border-[#2A2D3A] pt-1">
        <MACDChart data={indicatorData} />
      </div>
    </div>
  );
}