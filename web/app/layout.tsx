import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "섬파인더 Island Finder | 2026 여수세계섬박람회",
  description:
    "공공데이터 기반 AI 맞춤 섬 추천 & 실시간 스마트 섬박람회 가이드. 나만의 섬을 찾아보세요!",
  keywords: ["여수", "섬박람회", "섬여행", "섬추천", "공공데이터", "Island Finder"],
  openGraph: {
    title: "섬파인더 - 나만의 섬을 찾아보세요",
    description: "AI가 추천하는 여수의 25개 섬, 당신에게 딱 맞는 섬은?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-navy-50 via-white to-ocean-50">
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🏝️</span>
              <span className="font-bold text-lg text-navy-500">
                섬파인더
              </span>
              <span className="text-xs text-ocean-600 hidden sm:inline">
                Island Finder
              </span>
            </a>
            <div className="flex items-center gap-1 sm:gap-4">
              <a
                href="/quiz"
                className="px-3 py-2 text-sm font-medium text-navy-500 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50"
              >
                나의 섬 찾기
              </a>
              <a
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium text-navy-500 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50"
              >
                섬 대시보드
              </a>
              <a
                href="/planner"
                className="px-3 py-2 text-sm font-medium text-navy-500 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50"
              >
                여정 플래너
              </a>
            </div>
          </div>
        </nav>
        <main className="pt-16">{children}</main>
        <footer className="bg-navy-500 text-white py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-sm opacity-80">
              2026 여수세계섬박람회 연계 공공데이터 활용 아이디어 공모전 출품작
            </p>
            <p className="text-xs mt-2 opacity-60">
              본 서비스는 국토교통부, 해양수산부, 한국관광공사 등 10개 기관의 공공데이터를
              활용하여 제작되었습니다.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
