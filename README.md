# Market Analytics

A crypto market analytics dashboard built with **Next.js 16** and **React 19**. Dark-themed UI inspired by Coinbase — clean, fast, and focused on data.

## Features

**Market Overview**
- Live table of 8 assets (BTC, ETH, SOL, BNB, XRP, DOGE, ADA, AVAX)
- Price, 24h change with trend indicator, volume, market cap, 7-day sparkline

**Asset Detail — `/trade/:symbol`**
- Area & candlestick chart (60 candles, hourly)
- RSI and MACD indicators computed client-side
- Real-time order book simulation (bids/asks)
- Recent trades feed

**Portfolio**
- Holdings table with average cost, current price, and P&L per asset
- Allocation pie chart (Recharts)
- Total value and all-time P&L summary

**Watchlist**
- Persistent watchlist via `localStorage`
- Add/remove assets from any page

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Language | TypeScript |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Market Overview
│   ├── trade/[symbol]/       # Asset detail page
│   ├── portfolio/            # Portfolio & P&L
│   └── watchlist/            # Saved assets
├── components/
│   ├── PriceChart.tsx        # Candlestick / area chart + RSI / MACD
│   ├── OrderBook.tsx         # Bids & asks table
│   ├── RecentTrades.tsx      # Trade feed
│   ├── AllocationChart.tsx   # Pie chart
│   └── SparklineChart.tsx    # Inline 7-day chart
└── lib/
    └── mockData.ts           # Generated price data & indicators
```

> All market data is mock — generated deterministically on the server. No external API calls or keys required.
