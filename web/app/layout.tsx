import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

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
        <NavBar />
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
