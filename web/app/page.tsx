import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-ocean-gradient">
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
          <svg
            viewBox="0 0 1440 120"
            className="absolute bottom-0 w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
              fill="white"
              opacity="0.3"
            />
            <path
              d="M0,80 C240,20 480,100 720,40 C960,100 1200,20 1440,80 L1440,120 L0,120 Z"
              fill="white"
              opacity="0.5"
            />
            <path
              d="M0,100 C320,60 640,110 960,70 C1280,110 1440,80 1440,100 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm">
            2026 여수세계섬박람회 연계
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 leading-tight">
            섬파인더
            <span className="block text-3xl sm:text-4xl font-light mt-2 text-teal-200">
              Island Finder
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            공공데이터와 AI가 추천하는
            <br />
            <strong className="text-sand-300">나만의 여수 섬 여행</strong>을
            시작하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="group px-8 py-4 bg-white text-navy-500 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-lg"
            >
              🏝️ 나의 섬 찾기
              <span className="block text-sm font-normal text-gray-500 mt-1 group-hover:text-teal-600">
                6가지 질문으로 딱 맞는 섬 추천
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-white/15 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-300 hover:-translate-y-1 text-lg"
            >
              🗺️ 섬 대시보드
              <span className="block text-sm font-normal text-white/70 mt-1">
                실시간 섬 현황 한눈에
              </span>
            </Link>
            <Link
              href="/planner"
              className="group px-8 py-4 bg-white/15 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-300 hover:-translate-y-1 text-lg"
            >
              📋 여정 플래너
              <span className="block text-sm font-normal text-white/70 mt-1">
                AI 맞춤 일정 생성
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-navy-500 mb-4">
            섬파인더가 특별한 이유
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            10개 공공데이터를 분석하여 여수의 25개 섬을 8차원으로 프로파일링했습니다
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                🧬
              </div>
              <h3 className="text-xl font-bold text-navy-500 mb-3">
                AI 맞춤 추천
              </h3>
              <p className="text-gray-600 leading-relaxed">
                코사인 유사도 알고리즘으로 당신의 여행 성향과 가장 잘 맞는 섬을
                Top-3로 추천합니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-ocean-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                📊
              </div>
              <h3 className="text-xl font-bold text-navy-500 mb-3">
                실시간 데이터
              </h3>
              <p className="text-gray-600 leading-relaxed">
                기상청 날씨, 여객선 운항, 관광 정보를 한눈에.
                지금 갈 수 있는 섬을 바로 확인하세요.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-sand-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                🗓️
              </div>
              <h3 className="text-xl font-bold text-navy-500 mb-3">
                스마트 여정
              </h3>
              <p className="text-gray-600 leading-relaxed">
                출발 시간과 선호도만 입력하면, 여객선 시간표 기반으로
                최적 여정을 자동 생성합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Source Section */}
      <section className="py-16 px-4 bg-navy-50/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-navy-500 mb-12">
            활용 공공데이터 (10종)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:border-teal-200 transition-colors"
              >
                <p className="text-xs text-teal-600 font-medium mb-1">
                  {item.org}
                </p>
                <p className="text-sm font-bold text-navy-500">{item.data}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-navy-500 mb-4">
          지금 바로 나만의 섬을 찾아보세요
        </h2>
        <p className="text-gray-500 mb-8">
          6가지 질문에 답하면 AI가 여수의 25개 섬 중 당신에게 딱 맞는 섬을
          추천합니다
        </p>
        <Link
          href="/quiz"
          className="inline-block px-10 py-4 bg-ocean-gradient text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-lg"
        >
          🏝️ 나의 섬 찾기 시작하기
        </Link>
      </section>
    </div>
  );
}
