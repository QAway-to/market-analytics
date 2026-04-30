"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Wallet, Home, Star } from "lucide-react";
import { useMarketData, type LiveAsset } from "@/hooks/useMarketData";

const links = [
  { href: "/",          label: "Markets",   icon: Home },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/watchlist", label: "Watchlist", icon: Star },
];

const TICKER_SYMBOLS = ["BTC", "ETH", "SOL", "BNB", "XRP"];

interface TickerItemProps {
  asset: LiveAsset;
}

function TickerItem({ asset }: TickerItemProps) {
  const [flashColor, setFlashColor] = useState<string>("#E8ECF0");

  useEffect(() => {
    if (asset.prevPrice === undefined || asset.prevPrice === asset.price) {
      return;
    }

    const color = asset.price > asset.prevPrice ? "#05B169" : "#CF202F";
    setFlashColor(color);

    const timer = setTimeout(() => {
      setFlashColor("#E8ECF0");
    }, 600);

    return () => clearTimeout(timer);
  }, [asset.price, asset.prevPrice]);

  const changeColor = asset.change24h >= 0 ? "#05B169" : "#CF202F";
  const changeSign = asset.change24h >= 0 ? "+" : "";

  return (
    <span className="flex items-center gap-1 shrink-0">
      <span style={{ color: "#5B616E" }} className="font-medium">
        {asset.symbol}
      </span>
      <span style={{ color: flashColor }} className="transition-colors duration-300">
        ${asset.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <span style={{ color: changeColor }}>
        {changeSign}{asset.change24h.toFixed(2)}%
      </span>
    </span>
  );
}

export default function Navbar() {
  const path = usePathname();
  const allAssets = useMarketData();
  const assets = allAssets.filter((a) => TICKER_SYMBOLS.includes(a.symbol));

  return (
    <header className="sticky top-0 z-50 border-b border-[#2A2D3A] bg-[#0A0B0D]/90 backdrop-blur">
      {/* Live price ticker strip */}
      <div className="border-b border-[#2A2D3A]/50 bg-[#0A0B0D] py-1 overflow-x-auto">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 text-xs">
          {assets.map((asset) => (
            <TickerItem key={asset.symbol} asset={asset} />
          ))}
        </div>
      </div>

      {/* Main header row */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <BarChart2 className="h-5 w-5 text-[#0052FF]" />
          <span className="text-sm tracking-tight">MarketPulse</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-[#0052FF]/10 text-[#0052FF]"
                    : "text-[#5B616E] hover:bg-[#1C1E26] hover:text-[#E8ECF0]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
