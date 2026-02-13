"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/quiz", label: "섬 찾기", labelFull: "나의 섬 찾기" },
  { href: "/dashboard", label: "대시보드", labelFull: "섬 대시보드" },
  { href: "/planner", label: "플래너", labelFull: "여정 플래너" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/30 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
          <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-110">🏝️</span>
          <span className="font-display text-lg sm:text-2xl text-navy-600 font-semibold tracking-tight whitespace-nowrap">
            섬파인더
          </span>
          <span className="text-xs text-ocean-600 hidden md:inline font-medium tracking-wide">
            Island Finder
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  min-h-[44px] px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap
                  transition-all duration-300 ease-out flex items-center
                  ${
                    isActive
                      ? "glass ring-2 ring-teal-400/50 text-teal-700 shadow-lg glow-teal"
                      : "text-navy-600 hover:glass hover:text-teal-600 hover:shadow-md"
                  }
                `}
              >
                <span className="sm:hidden">{item.label}</span>
                <span className="hidden sm:inline">{item.labelFull}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"></div>
    </nav>
  );
}
