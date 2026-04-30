"use client";

import { useEffect, useRef, useState } from "react";
import { ASSETS } from "@/lib/mockData";

export type LiveAsset = {
  symbol: string;
  name: string;
  price: number;
  prevPrice: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  sparkline: number[];
};

const TICK_MS = 2000;
const PRICE_FLUCTUATION = 0.0005; // ±0.05%
const CHANGE_FLUCTUATION = 0.01;  // ±0.01
const SPARKLINE_LENGTH = 20;

function initLiveAssets(): LiveAsset[] {
  return ASSETS.map((asset) => ({
    symbol: asset.symbol,
    name: asset.name,
    price: asset.price,
    prevPrice: asset.price,
    change24h: asset.change24h,
    volume24h: asset.volume24h,
    marketCap: asset.marketCap,
    sparkline: asset.sparkline.slice(-SPARKLINE_LENGTH),
  }));
}

function tickAsset(asset: LiveAsset): LiveAsset {
  const priceDelta = asset.price * (Math.random() * PRICE_FLUCTUATION * 2 - PRICE_FLUCTUATION);
  const newPrice = asset.price + priceDelta;

  const changeDelta = Math.random() * CHANGE_FLUCTUATION * 2 - CHANGE_FLUCTUATION;
  const newChange24h = asset.change24h + changeDelta;

  const newSparkline = [...asset.sparkline, newPrice].slice(-SPARKLINE_LENGTH);

  return {
    ...asset,
    prevPrice: asset.price,
    price: newPrice,
    change24h: newChange24h,
    sparkline: newSparkline,
  };
}

export function useMarketData(): LiveAsset[] {
  const [assets, setAssets] = useState<LiveAsset[]>(initLiveAssets);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAssets((prev) => prev.map(tickAsset));
    }, TICK_MS);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return assets;
}
