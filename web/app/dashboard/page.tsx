"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { getIslandData } from "@/lib/data";
import { Island } from "@/lib/types";

const IslandMap = dynamic(() => import("@/components/IslandMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
      <span className="text-gray-400">지도 로딩 중...</span>
    </div>
  ),
});

export default function DashboardPage() {
  const data = getIslandData();
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);
  const [filterCluster, setFilterCluster] = useState<string | null>(null);

  const filteredIslands = filterCluster
    ? data.islands.filter((i) => {
        const cluster = data.clusters.find((c) => c.id === filterCluster);
        return cluster?.islands.includes(i.id);
      })
    : data.islands;

  const statusCounts = {
    green: data.islands.filter((i) => i.status === "green").length,
    yellow: data.islands.filter((i) => i.status === "yellow").length,
    red: data.islands.filter((i) => i.status === "red").length,
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy-500 mb-2">
            🗺️ 실시간 섬 대시보드
          </h1>
          <p className="text-gray-500">
            여수의 25개 섬 현황을 한눈에 확인하세요
          </p>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 text-center">
            <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-2" />
            <span className="text-2xl font-bold text-green-600">
              {statusCounts.green}
            </span>
            <p className="text-xs text-gray-500 mt-1">운항 정상</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-100 text-center">
            <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-2" />
            <span className="text-2xl font-bold text-yellow-600">
              {statusCounts.yellow}
            </span>
            <p className="text-xs text-gray-500 mt-1">기상 주의</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100 text-center">
            <div className="w-4 h-4 bg-red-400 rounded-full mx-auto mb-2" />
            <span className="text-2xl font-bold text-red-600">
              {statusCounts.red}
            </span>
            <p className="text-xs text-gray-500 mt-1">운항 중단</p>
          </div>
        </div>

        {/* Cluster Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterCluster(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !filterCluster
                ? "bg-navy-500 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"
            }`}
          >
            전체 ({data.islands.length})
          </button>
          {data.clusters.map((cluster) => (
            <button
              key={cluster.id}
              onClick={() =>
                setFilterCluster(
                  filterCluster === cluster.id ? null : cluster.id
                )
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterCluster === cluster.id
                  ? "text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"
              }`}
              style={
                filterCluster === cluster.id
                  ? { backgroundColor: cluster.color }
                  : {}
              }
            >
              {cluster.icon} {cluster.name} ({cluster.islands.length})
            </button>
          ))}
        </div>

        {/* Map + Detail */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IslandMap
              islands={filteredIslands}
              clusters={data.clusters}
              onSelectIsland={setSelectedIsland}
              selectedIsland={selectedIsland}
            />
          </div>

          <div className="space-y-4">
            {selectedIsland ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-navy-500">
                    {selectedIsland.name}
                  </h3>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedIsland.status === "green"
                        ? "bg-green-400"
                        : selectedIsland.status === "yellow"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                  />
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {selectedIsland.description}
                </p>

                {/* Weather */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-bold text-navy-500 mb-2">
                    🌤️ 현재 날씨
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-lg font-bold text-navy-500">
                        {selectedIsland.weather.temp}°C
                      </p>
                      <p className="text-gray-500">기온</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-navy-500">
                        {selectedIsland.weather.wind}m/s
                      </p>
                      <p className="text-gray-500">풍속</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-navy-500">
                        {selectedIsland.weather.wave}m
                      </p>
                      <p className="text-gray-500">파고</p>
                    </div>
                  </div>
                </div>

                {/* Ferry */}
                <div className="bg-teal-50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-bold text-navy-500 mb-2">
                    🚢 여객선 정보
                  </h4>
                  <p className="text-sm text-gray-600">
                    <strong>출발:</strong> {selectedIsland.ferryPort}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>소요시간:</strong> {selectedIsland.travelTime}분
                  </p>
                  {selectedIsland.nextFerry !== "-" && (
                    <p className="text-sm text-gray-600">
                      <strong>다음 출항:</strong> {selectedIsland.nextFerry}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <strong>일 운항:</strong>{" "}
                    {selectedIsland.ferryFrequency > 0
                      ? `${selectedIsland.ferryFrequency}회`
                      : "차량 접근 가능"}
                  </p>
                </div>

                {/* Attractions */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-navy-500 mb-2">
                    📍 주요 관광지
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIsland.attractions.map((a, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-navy-500 mb-2">
                    🎯 즐길거리
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIsland.activities.map((a, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="font-bold text-navy-500">
                      {selectedIsland.area}km²
                    </p>
                    <p className="text-gray-400 text-xs">면적</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="font-bold text-navy-500">
                      {selectedIsland.restaurants}
                    </p>
                    <p className="text-gray-400 text-xs">음식점</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="font-bold text-navy-500">
                      {selectedIsland.accommodations}
                    </p>
                    <p className="text-gray-400 text-xs">숙소</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {selectedIsland.hashtags.map((tag, i) => (
                    <span key={i} className="text-xs text-teal-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center">
                <span className="text-4xl block mb-4">👆</span>
                <p className="text-gray-500">
                  지도에서 섬을 클릭하면
                  <br />
                  상세 정보를 확인할 수 있어요
                </p>
              </div>
            )}

            {/* Island List */}
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 max-h-[400px] overflow-y-auto">
              <h4 className="text-sm font-bold text-navy-500 mb-3">
                📋 섬 목록 ({filteredIslands.length}개)
              </h4>
              <div className="space-y-2">
                {filteredIslands.map((island) => (
                  <button
                    key={island.id}
                    onClick={() => setSelectedIsland(island)}
                    className={`w-full text-left p-3 rounded-xl transition-colors flex items-center gap-3 ${
                      selectedIsland?.id === island.id
                        ? "bg-teal-50 border border-teal-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        island.status === "green"
                          ? "bg-green-400"
                          : island.status === "yellow"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-500 text-sm">
                        {island.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {island.travelTime}분 · {island.cluster}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {island.weather.temp}°C
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
