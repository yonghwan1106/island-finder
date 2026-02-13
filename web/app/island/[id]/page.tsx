"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getIslandData, getIslandById } from "@/lib/data";
import { Island, Cluster, FerrySchedule } from "@/lib/types";
import RadarChart from "@/components/RadarChart";

interface IslandPageProps {
  params: { id: string };
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
  const [island, setIsland] = useState<Island | null>(null);
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [ferrySchedule, setFerrySchedule] = useState<FerrySchedule | null>(null);
  const [similarIslands, setSimilarIslands] = useState<Array<{ island: Island; similarity: number }>>([]);

  useEffect(() => {
    const data = getIslandData();
    const foundIsland = getIslandById(params.id);

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
  }, [params.id]);

  if (!island) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-navy-700 mb-4">섬을 찾을 수 없습니다</h1>
          <Link href="/dashboard" className="text-teal-600 hover:text-teal-700 underline">
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
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center text-navy-600 hover:text-navy-700 mb-6 transition-colors"
          >
            ← 대시보드로 돌아가기
          </Link>

          <div className="mb-8">
            <h1 className="text-5xl font-bold text-navy-700 mb-2">{island.name}</h1>
            <p className="text-2xl text-gray-500 mb-4">{island.nameEn}</p>

            <div className="flex items-center gap-4">
              {cluster && (
                <span
                  className="px-4 py-2 rounded-full text-white font-medium"
                  style={{ backgroundColor: cluster.color }}
                >
                  {cluster.icon} {cluster.name}
                </span>
              )}

              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusConfig[island.status].color}`}></div>
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
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <p className="text-lg text-navy-600 mb-6 leading-relaxed">{island.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-ocean-50 rounded-lg">
              <div className="text-2xl font-bold text-navy-700">{island.area}</div>
              <div className="text-sm text-gray-600">면적 (km²)</div>
            </div>
            <div className="text-center p-4 bg-ocean-50 rounded-lg">
              <div className="text-2xl font-bold text-navy-700">{island.population}</div>
              <div className="text-sm text-gray-600">인구</div>
            </div>
            <div className="text-center p-4 bg-ocean-50 rounded-lg">
              <div className="text-2xl font-bold text-navy-700">{island.travelTime}분</div>
              <div className="text-sm text-gray-600">소요시간</div>
            </div>
            <div className="text-center p-4 bg-ocean-50 rounded-lg">
              <div className="text-2xl font-bold text-navy-700">{island.bestSeason}</div>
              <div className="text-sm text-gray-600">최적시기</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {island.hashtags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
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
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-navy-700 mb-6">섬 프로파일 분석</h2>

          <div className="flex justify-center mb-8">
            <RadarChart vector={island.vector} color="#0D9488" size={300} />
          </div>

          <div className="space-y-3">
            {dimensions.map((dim, idx) => (
              <div key={dim.key}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-navy-600">{dim.label}</span>
                  <span className="text-sm font-bold text-teal-600">{Math.round(dim.value * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.value * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.05 }}
                    className="bg-teal-500 h-2 rounded-full"
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
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-navy-700 mb-4">관광지 & 문화재</h2>

            <div className="space-y-3">
              {island.attractions.map((attraction, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-ocean-50 rounded-lg">
                  <span className="text-2xl">📍</span>
                  <span className="text-navy-600 font-medium">{attraction}</span>
                </div>
              ))}

              {island.culturalSites.map((site, idx) => (
                <div key={`cultural-${idx}`} className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                  <span className="text-2xl">🏛️</span>
                  <span className="text-navy-600 font-medium">{site}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-navy-700 mb-4">즐길거리</h2>

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
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-ocean-500 text-white rounded-full font-medium"
                  >
                    {icon} {activity}
                  </span>
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
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-navy-700 mb-6">여객선 정보</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="space-y-3">
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

            <div className="bg-teal-50 p-4 rounded-lg">
              <div className="text-sm text-navy-600 mb-1">다음 출항</div>
              <div className="text-3xl font-bold text-teal-600">{island.nextFerry}</div>
            </div>
          </div>

          {ferrySchedule && (
            <div>
              <h3 className="text-lg font-bold text-navy-700 mb-3">운항 시간표</h3>
              <div className="bg-ocean-50 p-4 rounded-lg">
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {ferrySchedule.departures.map((time, idx) => (
                    <div
                      key={idx}
                      className="text-center py-2 bg-white rounded-lg font-medium text-navy-700"
                    >
                      {time}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-navy-600">
                  요금: <span className="font-bold text-teal-600">{ferrySchedule.fare.toLocaleString()}원</span>
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
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-navy-700 mb-6">현재 날씨</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-ocean-100 to-teal-100 rounded-lg">
              <div className="text-4xl mb-2">{getWeatherIcon(island.weather.condition)}</div>
              <div className="text-sm text-navy-600">{island.weather.condition}</div>
            </div>
            <div className="text-center p-4 bg-ocean-50 rounded-lg">
              <div className="text-3xl font-bold text-navy-700">{island.weather.temp}°C</div>
              <div className="text-sm text-gray-600">기온</div>
            </div>
            <div className="text-center p-4 bg-ocean-50 rounded-lg">
              <div className="text-3xl font-bold text-navy-700">{island.weather.wind}m/s</div>
              <div className="text-sm text-gray-600">풍속</div>
            </div>
            <div className="text-center p-4 bg-ocean-50 rounded-lg">
              <div className="text-3xl font-bold text-navy-700">{island.weather.wave}m</div>
              <div className="text-sm text-gray-600">파고</div>
            </div>
          </div>
        </motion.div>

        {/* Similar Islands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-navy-700 mb-6">이 섬과 비슷한 섬</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {similarIslands.map(({ island: similarIsland, similarity }, idx) => (
              <Link
                key={similarIsland.id}
                href={`/island/${similarIsland.id}`}
                className="block p-6 bg-gradient-to-br from-ocean-50 to-teal-50 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-navy-700">{similarIsland.name}</h3>
                  <span className="text-2xl font-bold text-teal-600">
                    {Math.round(similarity * 100)}%
                  </span>
                </div>
                <p className="text-sm text-navy-600 mb-2">{similarIsland.cluster}</p>
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
            className="flex-1 py-4 px-8 bg-gradient-to-r from-teal-500 to-ocean-500 text-white rounded-xl font-bold text-center hover:shadow-lg transition-shadow"
          >
            이 섬으로 여정 만들기 ✈️
          </Link>
          <Link
            href="/quiz"
            className="flex-1 py-4 px-8 bg-gradient-to-r from-navy-500 to-navy-600 text-white rounded-xl font-bold text-center hover:shadow-lg transition-shadow"
          >
            퀴즈로 나의 섬 찾기 🧭
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
