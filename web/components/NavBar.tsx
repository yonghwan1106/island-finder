"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/quiz", label: "나의 섬 찾기" },
  { href: "/dashboard", label: "섬 대시보드" },
  { href: "/planner", label: "여정 플래너" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏝️</span>
          <span className="font-bold text-lg text-navy-500">섬파인더</span>
          <span className="text-xs text-ocean-600 hidden sm:inline">
            Island Finder
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-teal-600 bg-teal-50 border-b-2 border-teal-500"
                    : "text-navy-500 hover:text-teal-600 hover:bg-teal-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
