import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section - Full viewport dramatic ocean experience */}
      <section className="relative min-h-screen flex items-center justify-center bg-ocean-gradient overflow-hidden">
        {/* Animated floating particles/bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[15%] w-2 h-2 bg-white/30 rounded-full animate-float" style={{ animationDelay: "0s", animationDuration: "6s" }}></div>
          <div className="absolute top-[30%] right-[20%] w-3 h-3 bg-white/20 rounded-full animate-float" style={{ animationDelay: "1s", animationDuration: "8s" }}></div>
          <div className="absolute top-[60%] left-[25%] w-2.5 h-2.5 bg-white/25 rounded-full animate-float" style={{ animationDelay: "2s", animationDuration: "7s" }}></div>
          <div className="absolute top-[45%] right-[30%] w-2 h-2 bg-white/30 rounded-full animate-float" style={{ animationDelay: "1.5s", animationDuration: "9s" }}></div>
          <div className="absolute top-[20%] left-[40%] w-1.5 h-1.5 bg-white/35 rounded-full animate-float" style={{ animationDelay: "0.5s", animationDuration: "7.5s" }}></div>
          <div className="absolute top-[70%] right-[15%] w-2 h-2 bg-white/25 rounded-full animate-float" style={{ animationDelay: "2.5s", animationDuration: "8.5s" }}></div>
        </div>

        {/* Layered wave SVGs with parallax feel */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 overflow-hidden">
          <svg
            viewBox="0 0 1440 120"
            className="absolute bottom-0 w-full animate-wave"
            preserveAspectRatio="none"
            style={{ animationDelay: "0s", animationDuration: "12s" }}
          >
            <path
              d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
              fill="white"
              opacity="0.15"
            />
          </svg>
          <svg
            viewBox="0 0 1440 120"
            className="absolute bottom-0 w-full animate-wave"
            preserveAspectRatio="none"
            style={{ animationDelay: "-4s", animationDuration: "10s" }}
          >
            <path
              d="M0,80 C240,20 480,100 720,40 C960,100 1200,20 1440,80 L1440,120 L0,120 Z"
              fill="white"
              opacity="0.25"
            />
          </svg>
          <svg
            viewBox="0 0 1440 120"
            className="absolute bottom-0 w-full animate-wave"
            preserveAspectRatio="none"
            style={{ animationDelay: "-2s", animationDuration: "8s" }}
          >
            <path
              d="M0,100 C320,60 640,110 960,70 C1280,110 1440,80 1440,100 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Glass morphism badge */}
          <div className="inline-block mb-8 px-6 py-2.5 glass rounded-full text-white/95 text-sm font-medium shadow-lg backdrop-blur-md animate-fade-in-up">
            ✨ 2026 여수세계섬박람회 공식 연계 프로젝트
          </div>

          {/* Playfair Display title */}
          <h1 className="font-display text-6xl sm:text-8xl font-extrabold text-white mb-4 leading-[1.1] tracking-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            섬파인더
          </h1>
          <p className="font-display text-3xl sm:text-5xl font-light text-teal-100 mb-8 tracking-wide italic animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Island Finder
          </p>

          <p className="text-xl sm:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            공공데이터와 AI가 선별한
            <br />
            <strong className="font-semibold text-sand-200">당신만을 위한 여수 섬 여행지</strong>를 발견하세요
          </p>

          {/* CTA buttons with glow effects */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link
              href="/quiz"
              className="group px-10 py-5 bg-white text-navy-500 font-bold rounded-2xl shadow-2xl hover:shadow-2xl glow-teal transition-all duration-300 hover:-translate-y-1 hover:scale-105 text-lg"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">🏝️</span>
                <span>
                  <span className="block">나의 섬 찾기</span>
                  <span className="block text-sm font-normal text-gray-500 mt-0.5 group-hover:text-teal-600 transition-colors">
                    6가지 질문으로 맞춤 추천
                  </span>
                </span>
              </span>
            </Link>

            <Link
              href="/dashboard"
              className="group px-10 py-5 glass text-white font-bold rounded-2xl border-2 border-white/40 hover:bg-white/25 transition-all duration-300 hover:-translate-y-1 text-lg"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">🗺️</span>
                <span>
                  <span className="block">섬 대시보드</span>
                  <span className="block text-sm font-normal text-white/80 mt-0.5">
                    실시간 현황 한눈에
                  </span>
                </span>
              </span>
            </Link>

            <Link
              href="/planner"
              className="group px-10 py-5 glass text-white font-bold rounded-2xl border-2 border-white/40 hover:bg-white/25 transition-all duration-300 hover:-translate-y-1 text-lg"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <span>
                  <span className="block">여정 플래너</span>
                  <span className="block text-sm font-normal text-white/80 mt-0.5">
                    AI 맞춤 일정 생성
                  </span>
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Editorial layout with page-bg */}
      <section className="page-bg py-32 px-4 relative">
        {/* Decorative floating circles */}
        <div className="absolute top-[15%] right-[8%] w-24 h-24 bg-teal-200/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-[25%] left-[10%] w-32 h-32 bg-ocean-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-display text-5xl font-bold text-navy-500 mb-6 tracking-tight">
              섬파인더가 특별한 이유
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              10개 공공데이터를 분석하여 여수의 25개 섬을 8차원으로 프로파일링했습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 stagger-children">
            {/* Feature 1 - AI 맞춤 추천 */}
            <div className="glass-card gradient-border rounded-3xl p-10 relative overflow-hidden noise-overlay">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-md">
                  🧬
                </div>
                <h3 className="font-display text-2xl font-bold text-navy-500 mb-4">
                  AI 맞춤 추천
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  코사인 유사도 알고리즘으로 당신의 여행 성향과 가장 잘 맞는 섬을 Top-3로 추천합니다.
                </p>
              </div>
            </div>

            {/* Feature 2 - 실시간 데이터 */}
            <div className="glass-card gradient-border rounded-3xl p-10 relative overflow-hidden noise-overlay">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-ocean-100 to-ocean-50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-md">
                  📊
                </div>
                <h3 className="font-display text-2xl font-bold text-navy-500 mb-4">
                  실시간 데이터
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  기상청 날씨, 여객선 운항, 관광 정보를 한눈에. 지금 갈 수 있는 섬을 바로 확인하세요.
                </p>
              </div>
            </div>

            {/* Feature 3 - 스마트 여정 */}
            <div className="glass-card gradient-border rounded-3xl p-10 relative overflow-hidden noise-overlay">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-sand-100 to-sand-50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-md">
                  🗓️
                </div>
                <h3 className="font-display text-2xl font-bold text-navy-500 mb-4">
                  스마트 여정
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  출발 시간과 선호도만 입력하면, 여객선 시간표 기반으로 최적 여정을 자동 생성합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Source Section - Flowing grid with stagger */}
      <section className="py-28 px-4 bg-gradient-to-b from-white to-navy-50/30 relative overflow-hidden">
        {/* Decorative background dots */}
        <div className="absolute top-[20%] left-[5%] w-2 h-2 bg-teal-300/40 rounded-full"></div>
        <div className="absolute top-[40%] right-[8%] w-2 h-2 bg-ocean-300/40 rounded-full"></div>
        <div className="absolute bottom-[30%] left-[12%] w-1.5 h-1.5 bg-sand-300/40 rounded-full"></div>
        <div className="absolute bottom-[15%] right-[15%] w-2 h-2 bg-teal-300/40 rounded-full"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="font-display text-4xl font-bold text-center text-navy-500 mb-16">
            활용 공공데이터 <span className="text-teal-500">(10종)</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 stagger-children">
            {[
              { org: "국토교통부", data: "도서정보" },
              { org: "해양교통안전공단", data: "여객선 운항통계" },
              { org: "해양교통안전공단", data: "여객선 제원정보" },
              { org: "해양수산부", data: "선박운항정보" },
              { org: "한국관광공사", data: "TourAPI 관광정보" },
              { org: "기상청", data: "단기예보" },
              { org: "해양환경공단", data: "해양환경측정망" },
              { org: "국가유산청", data: "문화재 공간정보" },
              { org: "문화체육관광부", data: "지역축제 정보" },
              { org: "행정안전부", data: "주민등록 인구현황" },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 text-center hover:border-teal-300 transition-all duration-300"
              >
                <p className="text-xs text-teal-600 font-semibold mb-2 uppercase tracking-wide">
                  {item.org}
                </p>
                <p className="text-sm font-bold text-navy-500 leading-snug">
                  {item.data}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Dramatic gradient section */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-navy-500 via-teal-500 to-ocean-500 overflow-hidden">
        {/* Animated glow orbs */}
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[15%] right-[20%] w-48 h-48 bg-sand-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }}></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="glass-strong rounded-3xl p-12 md:p-16 shadow-2xl">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy-500 mb-6 leading-tight">
              지금 바로 나만의 섬을
              <br />
              찾아보세요
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
              6가지 질문에 답하면 AI가 여수의 25개 섬 중 당신에게 딱 맞는 섬을 추천합니다
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-3 px-12 py-6 bg-ocean-gradient text-white font-bold rounded-2xl shadow-2xl hover:shadow-2xl glow-ocean transition-all duration-300 hover:-translate-y-1 hover:scale-105 text-xl"
            >
              <span className="text-2xl">🏝️</span>
              <span>나의 섬 찾기 시작하기</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
