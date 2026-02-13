"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { getIslandData } from "@/lib/data";
import { Island } from "@/lib/types";
import RadarChart from "@/components/RadarChart";
import {
  Cloud,
  Wind,
  Waves,
  MapPin,
  Ship,
  Utensils,
  Home,
  Palmtree,
  Calendar,
  Users,
  Clock,
} from "lucide-react";

const IslandMap = dynamic(() => import("@/components/IslandMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-navy-50 to-ocean-50 rounded-xl animate-pulse flex items-center justify-center">
      <p className="text-navy-400">지도 로딩 중...</p>
    </div>
  ),
});

const clusters = [
  {
    id: "healing",
    name: "힐링 휴식형",
    nameEn: "Healing & Rest",
    description: "조용하고 평화로운 휴식을 원하는 여행자",
    color: "#10b981",
    icon: "🌿",
    islands: ["geumodo", "ando", "soando"],
  },
  {
    id: "experience",
    name: "체험 활동형",
    nameEn: "Activity & Experience",
    description: "다양한 체험과 활동을 즐기는 여행자",
    color: "#f59e0b",
    icon: "🏃",
    islands: ["sangbaekdo", "sado"],
  },
  {
    id: "culture",
    name: "문화 탐방형",
    nameEn: "Culture & Heritage",
    description: "역사와 문화 유적을 중시하는 여행자",
    color: "#8b5cf6",
    icon: "🏛️",
    islands: ["baekdo", "yeondo"],
  },
  {
    id: "family",
    name: "가족 여행형",
    nameEn: "Family Travel",
    description: "온 가족이 함께 즐길 수 있는 여행지",
    color: "#ec4899",
    icon: "👨‍👩‍👧‍👦",
    islands: ["odongdo"],
  },
];

export default function DashboardPage() {
  const data = getIslandData();
  const islands = data.islands;
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);
  const [activeTab, setActiveTab] = useState<"attractions" | "ferry" | "weather" | "activities">(
    "attractions"
  );

  const statusCounts = useMemo(() => {
    const counts = { green: 0, yellow: 0, red: 0 };
    islands.forEach((island) => {
      counts[island.status]++;
    });
    return counts;
  }, [islands]);

  const filteredIslands = useMemo(() => {
    if (!selectedCluster) return islands;
    const cluster = clusters.find((c) => c.id === selectedCluster);
    if (!cluster) return islands;
    return islands.filter((island) => cluster.islands.includes(island.id));
  }, [selectedCluster, islands]);

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("맑음")) return "☀️";
    if (condition.includes("흐림")) return "☁️";
    if (condition.includes("비")) return "🌧️";
    return "🌤️";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-ocean-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-navy-900 mb-2">
            섬 현황 대시보드
          </h1>
          <p className="text-navy-600">
            실시간 여객선 운항 및 섬 상태 모니터링
          </p>
        </motion.div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-navy-600 text-sm mb-1">정상 운항</p>
                <p className="text-3xl font-bold text-navy-900 animate-count-up">
                  {statusCounts.green}
                </p>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-navy-600 text-sm mb-1">주의 필요</p>
                <p className="text-3xl font-bold text-navy-900 animate-count-up">
                  {statusCounts.yellow}
                </p>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="text-2xl animate-bounce">⚠️</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-navy-600 text-sm mb-1">운항 불가</p>
                <p className="text-3xl font-bold text-navy-900 animate-count-up">
                  {statusCounts.red}
                </p>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🛑</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cluster Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedCluster(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCluster === null
                  ? "bg-navy-600 text-white shadow-lg scale-105"
                  : "bg-white text-navy-700 hover:bg-navy-50 shadow"
              }`}
            >
              {selectedCluster === null && <span className="mr-2">✓</span>}
              전체 섬
            </button>
            {clusters.map((cluster) => (
              <button
                key={cluster.id}
                onClick={() => setSelectedCluster(cluster.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCluster === cluster.id
                    ? `text-white shadow-lg scale-105`
                    : "bg-white text-navy-700 hover:bg-navy-50 shadow"
                }`}
                style={
                  selectedCluster === cluster.id
                    ? { backgroundColor: cluster.color }
                    : { borderLeft: `3px solid ${cluster.color}` }
                }
              >
                {selectedCluster === cluster.id && <span className="mr-2">✓</span>}
                <span className="mr-2">{cluster.icon}</span>
                {cluster.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Island Cards Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1 space-y-4"
          >
            <h2 className="text-xl font-bold text-navy-900 mb-4">
              섬 목록 ({filteredIslands.length})
            </h2>
            <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredIslands.map((island, index) => {
                const cluster = clusters.find((c) => c.islands.includes(island.id));
                const isSelected = selectedIsland?.id === island.id;
                return (
                  <motion.button
                    key={island.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    onClick={() => {
                      setSelectedIsland(island);
                      setActiveTab("attractions");
                    }}
                    className={`relative p-4 rounded-xl text-left transition-all hover:scale-105 ${
                      isSelected ? "ring-2 ring-teal-400 shadow-xl" : "shadow-md hover:shadow-lg"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${cluster?.color}15, ${cluster?.color}05)`,
                    }}
                  >
                    {/* Status Dot */}
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          island.status === "green"
                            ? "bg-green-500"
                            : island.status === "yellow"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>

                    <div className="mb-2">
                      <h3 className="font-bold text-navy-900 text-lg">{island.name}</h3>
                      <p className="text-xs text-navy-600 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {island.travelTime}분 • {cluster?.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-white px-2 py-1 rounded text-xs font-medium text-navy-700">
                        {island.weather.temp}°C
                      </div>
                      <span className="text-sm">{getWeatherIcon(island.weather.condition)}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
          >
            <div className="h-[600px] rounded-xl overflow-hidden">
              <IslandMap
                islands={filteredIslands}
                clusters={data.clusters}
                selectedIsland={selectedIsland}
                onSelectIsland={setSelectedIsland}
              />
            </div>
          </motion.div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedIsland && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="mt-6 bg-white rounded-xl shadow-2xl p-8"
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-navy-900 mb-2">
                  {selectedIsland.name}
                </h2>
                <p className="text-navy-600">{selectedIsland.description}</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-navy-200">
                {[
                  { id: "attractions", label: "관광지", icon: Palmtree },
                  { id: "ferry", label: "여객선", icon: Ship },
                  { id: "weather", label: "날씨", icon: Cloud },
                  { id: "activities", label: "활동", icon: Users },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
                      activeTab === tab.id
                        ? "text-teal-600"
                        : "text-navy-600 hover:text-navy-900"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[200px]"
                >
                  {activeTab === "attractions" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-navy-900 mb-3 flex items-center gap-2">
                          <Palmtree className="w-5 h-5 text-teal-600" />
                          주요 관광지
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedIsland.attractions.map((attr, idx) => (
                            <div
                              key={idx}
                              className="bg-teal-50 px-3 py-2 rounded-lg text-sm text-navy-700"
                            >
                              {attr}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-navy-900 mb-3 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-purple-600" />
                          문화유적
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedIsland.culturalSites.map((site, idx) => (
                            <div
                              key={idx}
                              className="bg-purple-50 px-3 py-2 rounded-lg text-sm text-navy-700"
                            >
                              {site}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-100">
                        <div className="text-center">
                          <p className="text-navy-600 text-sm mb-1">면적</p>
                          <p className="text-xl font-bold text-navy-900">
                            {selectedIsland.area}km²
                          </p>
                        </div>
                        <div className="text-center flex flex-col items-center">
                          <p className="text-navy-600 text-sm mb-1">음식점</p>
                          <div className="flex items-center gap-1">
                            <Utensils className="w-4 h-4 text-orange-600" />
                            <p className="text-xl font-bold text-navy-900">
                              {selectedIsland.restaurants}
                            </p>
                          </div>
                        </div>
                        <div className="text-center flex flex-col items-center">
                          <p className="text-navy-600 text-sm mb-1">숙박시설</p>
                          <div className="flex items-center gap-1">
                            <Home className="w-4 h-4 text-blue-600" />
                            <p className="text-xl font-bold text-navy-900">
                              {selectedIsland.accommodations}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "ferry" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-navy-50 p-4 rounded-lg">
                          <p className="text-navy-600 text-sm mb-1">출발 항구</p>
                          <p className="text-lg font-bold text-navy-900">
                            {selectedIsland.ferryPort}
                          </p>
                        </div>
                        <div className="bg-navy-50 p-4 rounded-lg">
                          <p className="text-navy-600 text-sm mb-1">운항 시간</p>
                          <p className="text-lg font-bold text-navy-900">
                            {selectedIsland.travelTime}분
                          </p>
                        </div>
                        <div className="bg-navy-50 p-4 rounded-lg">
                          <p className="text-navy-600 text-sm mb-1">차편</p>
                          <p className="text-lg font-bold text-navy-900">
                            {selectedIsland.ferryName}
                          </p>
                        </div>
                        <div className="bg-navy-50 p-4 rounded-lg">
                          <p className="text-navy-600 text-sm mb-1">운항 빈도</p>
                          <p className="text-lg font-bold text-navy-900">
                            1일 {selectedIsland.ferryFrequency}회
                          </p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-teal-50 to-ocean-50 p-4 rounded-lg border border-teal-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-navy-600 text-sm mb-1">다음 운항 시간</p>
                            <p className="text-2xl font-bold text-teal-700">
                              {selectedIsland.nextFerry}
                            </p>
                          </div>
                          <Ship className="w-12 h-12 text-teal-600" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "weather" && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-navy-600 mb-2">현재 날씨</p>
                            <p className="text-4xl font-bold text-navy-900">
                              {selectedIsland.weather.temp}°C
                            </p>
                          </div>
                          <div className="text-6xl">
                            {getWeatherIcon(selectedIsland.weather.condition)}
                          </div>
                        </div>
                        <p className="text-navy-700 font-medium">
                          {selectedIsland.weather.condition}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-navy-200 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Wind className="w-5 h-5 text-blue-600" />
                            <p className="text-navy-600 text-sm">풍속</p>
                          </div>
                          <p className="text-2xl font-bold text-navy-900">
                            {selectedIsland.weather.wind}m/s
                          </p>
                        </div>
                        <div className="bg-white border border-navy-200 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Waves className="w-5 h-5 text-cyan-600" />
                            <p className="text-navy-600 text-sm">파고</p>
                          </div>
                          <p className="text-2xl font-bold text-navy-900">
                            {selectedIsland.weather.wave}m
                          </p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-yellow-700" />
                          <p className="text-navy-900 font-medium">최적 방문 시기</p>
                        </div>
                        <p className="text-navy-700">{selectedIsland.bestSeason}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "activities" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-navy-900 mb-3">즐길 수 있는 활동</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedIsland.activities.map((activity, idx) => (
                            <div
                              key={idx}
                              className="bg-gradient-to-r from-teal-50 to-ocean-50 px-4 py-2 rounded-full text-sm font-medium text-navy-700 border border-teal-200"
                            >
                              {activity}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-navy-900 mb-3">해시태그</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedIsland.hashtags.map((tag, idx) => (
                            <div
                              key={idx}
                              className="bg-purple-50 px-4 py-2 rounded-full text-sm font-medium text-purple-700 border border-purple-200"
                            >
                              {tag}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* RadarChart */}
              <div className="mt-8 pt-8 border-t border-navy-200">
                <h3 className="font-bold text-navy-900 mb-4 text-center">섬 특성 분석</h3>
                <div className="flex justify-center">
                  <RadarChart
                    vector={selectedIsland.vector}
                    color={
                      clusters.find((c) => c.islands.includes(selectedIsland.id))?.color ||
                      "#10b981"
                    }
                    size={300}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4 justify-center">
                <a
                  href="/planner"
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-ocean-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  이 섬으로 여정 만들기
                </a>
                <a
                  href={`/island/${selectedIsland.id}`}
                  className="px-6 py-3 bg-white text-navy-700 font-bold rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 border border-navy-200"
                >
                  섬 상세보기
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
