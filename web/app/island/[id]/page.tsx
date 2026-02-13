"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getIslandData, getIslandById } from "@/lib/data";
import { Island, Cluster, FerrySchedule } from "@/lib/types";
import RadarChart from "@/components/RadarChart";

interface IslandPageProps {
  params: Promise<{ id: string }>;
}

// Simple cosine similarity calculation
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

function getSimilarIslands(currentIsland: Island, allIslands: Island[]): Array<{ island: Island; similarity: number }> {
  const currentVector = Object.values(currentIsland.vector);

  const similarities = allIslands
    .filter(island => island.id !== currentIsland.id)
    .map(island => ({
      island,
      similarity: cosineSimilarity(currentVector, Object.values(island.vector))
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  return similarities;
}

function getWeatherIcon(condition: string): string {
  const iconMap: Record<string, string> = {
    "맑음": "☀️",
    "구름조금": "⛅",
    "구름많음": "☁️",
    "흐림": "🌥️",
    "비": "🌧️"
  };
  return iconMap[condition] || "🌤️";
}

export default function IslandPage({ params }: IslandPageProps) {
  const { id } = use(params);
  const [island, setIsland] = useState<Island | null>(null);
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [ferrySchedule, setFerrySchedule] = useState<FerrySchedule | null>(null);
  const [similarIslands, setSimilarIslands] = useState<Array<{ island: Island; similarity: number }>>([]);

  useEffect(() => {
    const data = getIslandData();
    const foundIsland = getIslandById(id);

    if (foundIsland) {
      setIsland(foundIsland);

      // Find cluster
      const foundCluster = data.clusters.find(c => c.name === foundIsland.cluster);
      setCluster(foundCluster || null);

      // Find ferry schedule
      const schedule = data.ferrySchedules.find(s =>
        s.route.includes(foundIsland.name)
      );
      setFerrySchedule(schedule || null);

      // Calculate similar islands
      const similar = getSimilarIslands(foundIsland, data.islands);
      setSimilarIslands(similar);
    }
  }, [id]);

  if (!island) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-center card-solid p-12 max-w-md">
          <h1 className="text-3xl font-display font-bold text-navy-700 mb-6">섬을 찾을 수 없습니다</h1>
          <Link href="/dashboard" className="bg-teal-50 px-6 py-3 rounded-xl text-teal-600 hover:shadow-md transition-all inline-block font-medium border border-teal-200">
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    green: { label: "운항정상", color: "bg-green-500" },
    yellow: { label: "기상주의", color: "bg-yellow-500" },
    red: { label: "운항중단", color: "bg-red-500" }
  };

  const dimensions = [
    { key: "accessibility", label: "접근성", value: island.vector.accessibility },
    { key: "nature", label: "자연경관", value: island.vector.nature },
    { key: "culture", label: "문화", value: island.vector.culture },
    { key: "food", label: "음식", value: island.vector.food },
    { key: "activity", label: "액티비티", value: island.vector.activity },
    { key: "accommodation", label: "숙박", value: island.vector.accommodation },
    { key: "tranquility", label: "고요함", value: island.vector.tranquility },
    { key: "family", label: "가족친화", value: island.vector.family }
  ];

  return (
    <div className="min-h-screen page-bg">
      <div className="noise-overlay"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center bg-white px-5 py-2.5 rounded-xl text-navy-600 hover:shadow-md transition-all mb-6 font-medium border border-gray-200"
          >
            ← 대시보드로 돌아가기
          </Link>

          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-navy-700 mb-3 tracking-tight">
              {island.name}
            </h1>
            <p className="text-2xl md:text-3xl text-teal-600 font-medium mb-6">
              {island.nameEn}
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              {cluster && (
                <span
                  className="px-5 py-2.5 rounded-full text-white font-medium shadow-lg"
                  style={{ backgroundColor: cluster.color }}
                >
                  {cluster.icon} {cluster.name}
                </span>
              )}

              <div className="flex items-center gap-3 bg-gray-100 px-5 py-2.5 rounded-full border border-gray-200">
                <div className={`w-3 h-3 rounded-full ${statusConfig[island.status].color} shadow-lg`}></div>
                <span className="text-navy-600 font-medium">{statusConfig[island.status].label}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-elevated p-8 md:p-10 mb-6 rounded-2xl"
        >
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">{island.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-3xl font-bold text-navy-700">{island.area}</div>
              <div className="text-sm text-gray-500 mt-1">면적 (km²)</div>
            </div>
            <div className="text-center p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-3xl font-bold text-navy-700">{island.population}</div>
              <div className="text-sm text-gray-500 mt-1">인구</div>
            </div>
            <div className="text-center p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-3xl font-bold text-navy-700">{island.travelTime}분</div>
              <div className="text-sm text-gray-500 mt-1">소요시간</div>
            </div>
            <div className="text-center p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-3xl font-bold text-navy-700">{island.bestSeason}</div>
              <div className="text-sm text-gray-500 mt-1">최적시기</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {island.hashtags.map((tag, idx) => (
              <span key={idx} className="bg-teal-50 px-4 py-2 rounded-full text-teal-700 text-sm font-medium border border-teal-200">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-solid p-8 md:p-10 mb-6 rounded-2xl"
        >
          <h2 className="text-3xl font-display font-bold text-navy-700 mb-8">섬 프로파일 분석</h2>

          <div className="flex justify-center mb-8">
            <RadarChart vector={island.vector} color="#0D9488" size={300} />
          </div>

          <div className="space-y-4">
            {dimensions.map((dim, idx) => (
              <div key={dim.key} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-navy-600">{dim.label}</span>
                  <span className="text-sm font-bold text-teal-600">
                    {Math.round(dim.value * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.value * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.05 }}
                    className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-ocean-500"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Attractions & Cultural Sites */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card-solid p-8 rounded-2xl stagger-children"
          >
            <h2 className="text-2xl font-display font-bold text-navy-700 mb-6">관광지 & 문화재</h2>

            <div className="space-y-3">
              {island.attractions.map((attraction, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 bg-ocean-50 p-4 rounded-xl border border-ocean-100"
                >
                  <span className="text-2xl">📍</span>
                  <span className="text-navy-600 font-medium">{attraction}</span>
                </motion.div>
              ))}

              {island.culturalSites.map((site, idx) => (
                <motion.div
                  key={`cultural-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (island.attractions.length + idx) * 0.05 }}
                  className="flex items-center gap-3 bg-teal-50 p-4 rounded-xl border border-teal-100"
                >
                  <span className="text-2xl">🏛️</span>
                  <span className="text-navy-600 font-medium">{site}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="card-solid p-8 rounded-2xl stagger-children"
          >
            <h2 className="text-2xl font-display font-bold text-navy-700 mb-6">즐길거리</h2>

            <div className="flex flex-wrap gap-3">
              {island.activities.map((activity, idx) => {
                const activityIcons: Record<string, string> = {
                  "해수욕": "🏖️",
                  "낚시": "🎣",
                  "등산": "⛰️",
                  "해양레저": "🚤",
                  "갯벌체험": "🦀",
                  "캠핑": "⛺",
                  "트레킹": "🥾",
                  "자전거": "🚴",
                  "카약": "🛶",
                  "스노클링": "🤿"
                };
                const icon = activityIcons[activity] || "🎯";

                return (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-teal-50 px-5 py-3 rounded-full font-medium text-navy-700 border border-teal-200"
                  >
                    {icon} {activity}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Ferry Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card-solid p-8 md:p-10 mb-6 rounded-2xl"
        >
          <h2 className="text-3xl font-display font-bold text-navy-700 mb-8">여객선 정보</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-navy-600 font-medium w-24">출발지:</span>
                  <span className="text-navy-700 font-bold">{island.ferryPort}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-navy-600 font-medium w-24">여객선:</span>
                  <span className="text-navy-700 font-bold">{island.ferryName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-navy-600 font-medium w-24">소요시간:</span>
                  <span className="text-navy-700 font-bold">{island.travelTime}분</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-navy-600 font-medium w-24">운항빈도:</span>
                  <span className="text-navy-700 font-bold">하루 {island.ferryFrequency}회</span>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 p-6 rounded-xl border border-teal-200">
              <div className="text-sm text-navy-600 mb-2 font-medium">다음 출항</div>
              <div className="text-4xl font-bold text-teal-600">
                {island.nextFerry}
              </div>
            </div>
          </div>

          {ferrySchedule && (
            <div>
              <h3 className="text-xl font-display font-bold text-navy-700 mb-4">운항 시간표</h3>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {ferrySchedule.departures.map((time, idx) => (
                    <div
                      key={idx}
                      className="text-center py-3 bg-white rounded-lg font-semibold text-navy-700 border border-gray-200"
                    >
                      {time}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-sm text-navy-600">
                  요금: <span className="font-bold text-lg text-teal-600">
                    {ferrySchedule.fare.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Weather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="card-solid p-8 md:p-10 mb-6 rounded-2xl"
        >
          <h2 className="text-3xl font-display font-bold text-navy-700 mb-8">현재 날씨</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-ocean-100 to-teal-100 rounded-xl border border-ocean-200">
              <div className="text-5xl mb-3">{getWeatherIcon(island.weather.condition)}</div>
              <div className="text-sm font-semibold text-navy-600">{island.weather.condition}</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-4xl font-bold text-navy-700">{island.weather.temp}°C</div>
              <div className="text-sm text-gray-600 mt-2">기온</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-4xl font-bold text-navy-700">{island.weather.wind}m/s</div>
              <div className="text-sm text-gray-600 mt-2">풍속</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-4xl font-bold text-navy-700">{island.weather.wave}m</div>
              <div className="text-sm text-gray-600 mt-2">파고</div>
            </div>
          </div>
        </motion.div>

        {/* Marine Environment - 해양환경공단 해양환경측정망 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.48 }}
          className="card-solid p-8 md:p-10 mb-6 rounded-2xl"
        >
          <h2 className="text-3xl font-display font-bold text-navy-700 mb-3">해양 환경</h2>
          <p className="text-sm text-gray-500 mb-8">출처: 해양환경공단 해양환경측정망</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-cyan-50 rounded-xl border border-cyan-200">
              <div className="text-4xl font-bold text-cyan-700">{island.marine.seaTemp}°C</div>
              <div className="text-sm text-gray-600 mt-2">해수면 온도</div>
            </div>
            <div className="text-center p-6 bg-teal-50 rounded-xl border border-teal-200">
              <div className="text-4xl font-bold text-teal-700">{island.marine.waterQuality}등급</div>
              <div className="text-sm text-gray-600 mt-2">수질 등급</div>
            </div>
            <div className="text-center p-6 bg-ocean-50 rounded-xl border border-ocean-200">
              <div className="text-4xl font-bold text-ocean-700">{island.marine.transparency}m</div>
              <div className="text-sm text-gray-600 mt-2">투명도</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-4xl font-bold text-blue-700">{island.marine.dissolvedOxygen}</div>
              <div className="text-sm text-gray-600 mt-2">용존산소 (mg/L)</div>
            </div>
          </div>
        </motion.div>

        {/* Festivals - 문화체육관광부 지역축제 정보 */}
        {island.festivals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.49 }}
            className="card-solid p-8 md:p-10 mb-6 rounded-2xl"
          >
            <h2 className="text-3xl font-display font-bold text-navy-700 mb-3">지역 축제</h2>
            <p className="text-sm text-gray-500 mb-8">출처: 문화체육관광부 지역축제 정보</p>

            <div className="grid md:grid-cols-2 gap-4">
              {island.festivals.map((festival, idx) => (
                <div key={idx} className="card-solid p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🎪</span>
                    <div>
                      <h3 className="font-bold text-navy-700 text-lg mb-1">{festival.name}</h3>
                      <p className="text-sm font-semibold text-teal-600 mb-2">{festival.period}</p>
                      <p className="text-sm text-gray-600">{festival.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Similar Islands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card-solid p-8 md:p-10 mb-6 rounded-2xl"
        >
          <h2 className="text-3xl font-display font-bold text-navy-700 mb-8">이 섬과 비슷한 섬</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {similarIslands.map(({ island: similarIsland, similarity }, idx) => (
              <Link
                key={similarIsland.id}
                href={`/island/${similarIsland.id}`}
                className="block card-solid p-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-display font-bold text-navy-700 group-hover:text-teal-600 transition-colors">
                    {similarIsland.name}
                  </h3>
                  <span className="text-2xl font-bold text-teal-600">
                    {Math.round(similarity * 100)}%
                  </span>
                </div>
                <p className="text-sm text-navy-600 mb-2 font-medium">{similarIsland.cluster}</p>
                <div className="text-xs text-gray-500">유사도 매칭</div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <Link
            href="/planner"
            className="flex-1 py-5 px-8 bg-teal-500 rounded-xl font-bold text-center text-white hover:bg-teal-600 transition-all text-lg shadow-lg"
          >
            이 섬으로 여정 만들기 ✈️
          </Link>
          <Link
            href="/quiz"
            className="flex-1 py-5 px-8 bg-white rounded-xl font-bold text-center text-navy-700 hover:shadow-lg transition-all text-lg border border-gray-200"
          >
            퀴즈로 나의 섬 찾기 🧭
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
