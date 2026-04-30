"use client";

import { Star } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";

interface WatchlistButtonProps {
  symbol: string;
  className?: string;
}

export default function WatchlistButton({ symbol, className }: WatchlistButtonProps) {
  const { toggle, isWatched } = useWatchlist();
  const watched = isWatched(symbol);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(symbol);
      }}
      aria-label={watched ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      className={className}
    >
      <Star
        className="h-4 w-4 transition-colors"
        style={{
          fill: watched ? "#F5A623" : "none",
          color: watched ? "#F5A623" : "#5B616E",
        }}
      />
    </button>
  );
}
