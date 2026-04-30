"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "watchlist";

function readStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeStorage(symbols: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
  } catch {
    // localStorage unavailable — silently skip
  }
}

interface UseWatchlistReturn {
  watchlist: string[];
  toggle: (symbol: string) => void;
  isWatched: (symbol: string) => boolean;
}

export function useWatchlist(): UseWatchlistReturn {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    setWatchlist(readStorage());
  }, []);

  const toggle = useCallback((symbol: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      writeStorage(next);
      return next;
    });
  }, []);

  const isWatched = useCallback(
    (symbol: string) => watchlist.includes(symbol),
    [watchlist]
  );

  return { watchlist, toggle, isWatched };
}
