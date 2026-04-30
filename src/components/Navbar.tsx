"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Wallet, Home } from "lucide-react";

const links = [
  { href: "/",          label: "Markets",   icon: Home },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-[#2A2D3A] bg-[#0A0B0D]/90 backdrop-blur">
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
