"use client";

import { useState } from "react";
import { getIslandData } from "@/lib/data";
import { generateItineraries } from "@/lib/planner";
import { Itinerary } from "@/lib/types";

const PREFERENCE_OPTIONS = [
  { value: "nature", label: "🌿 자연경관", key: "nature" },
  { value: "culture", label: "🏛️ 역사문화", key: "culture" },
  { value: "food", label: "🍽️ 미식", key: "food" },
  { value: "activity", label: "🥾 액티비티", key: "activity" },
  { value: "tranquility", label: "🧘 힐링", key: "tranquility" },
  { value: "family", label: "👨‍👩‍👧‍👦 가족", key: "family" },
];

export default function PlannerPage() {
  const data = getIslandData();
  const [departureTime, setDepartureTime] = useState("08:00");
  const [returnTime, setReturnTime] = useState("18:00");
  const [groupSize, setGroupSize] = useState(2);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [stayType, setStayType] = useState<"daytrip" | "onenight" | "extended">("daytrip");
  const [itineraries, setItineraries] = useState<Itinerary[] | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const togglePreference = (value: string) => {
    setPreferences((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  const handleGenerate = () => {
    const results = generateItineraries(data.islands, data.ferrySchedules, {
      departureTime,
      returnTime,
      groupSize,
      preferences,
      stayType,
    });
    setItineraries(results);
    setExpandedIdx(results.length > 0 ? 0 : null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy-500 mb-2">
            📋 AI 여정 플래너
          </h1>
          <p className="text-gray-500">
            시간과 선호도를 입력하면 최적의 섬 여행 코스를 추천합니다
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-navy-500 mb-2">
                🕐 출발 시간
              </label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy-500 mb-2">
                🕕 귀환 시간
              </label>
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-navy-500 mb-2">
              👥 인원 ({groupSize}명)
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1명</span>
              <span>20명</span>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-navy-500 mb-2">
              🏨 여행 형태
            </label>
            <div className="flex gap-3">
              {[
                { value: "daytrip", label: "☀️ 당일치기" },
                { value: "onenight", label: "🌙 1박 2일" },
                { value: "extended", label: "🏖️ 2박 이상" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStayType(opt.value as typeof stayType)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    stayType === opt.value
                      ? "bg-teal-500 text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-navy-500 mb-2">
              💝 선호도 (복수 선택 가능)
            </label>
            <div className="flex flex-wrap gap-2">
              {PREFERENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => togglePreference(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    preferences.includes(opt.value)
                      ? "bg-teal-500 text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="mt-8 w-full py-4 bg-ocean-gradient text-white font-bold rounded-xl text-lg hover:opacity-90 transition-opacity"
          >
            🗓️ 여정 생성하기
          </button>
        </div>

        {/* Results */}
        {itineraries !== null && (
          <div>
            {itineraries.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
                <span className="text-4xl block mb-4">😢</span>
                <p className="text-gray-500">
                  조건에 맞는 여정을 찾지 못했어요.
                  <br />
                  시간을 넓혀보거나 다른 옵션을 선택해보세요.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-navy-500">
                  🎯 추천 여정 {itineraries.length}개
                </h2>
                {itineraries.map((it, idx) => (
                  <div
                    key={it.island.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <button
                      onClick={() =>
                        setExpandedIdx(expandedIdx === idx ? null : idx)
                      }
                      className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                            idx === 0
                              ? "bg-gradient-to-br from-teal-400 to-ocean-500"
                              : "bg-gray-300"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-navy-500 text-lg">
                            {it.island.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {it.island.cluster} · {it.departureFerry} 출발 ·{" "}
                            {Math.floor(it.totalTime / 60)}시간{" "}
                            {it.totalTime % 60}분 코스
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xl transition-transform ${
                          expandedIdx === idx ? "rotate-180" : ""
                        }`}
                      >
                        ⌄
                      </span>
                    </button>

                    {expandedIdx === idx && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        {/* Ferry Info */}
                        <div className="mt-4 mb-4 bg-teal-50 rounded-xl p-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-center">
                              <p className="font-bold text-navy-500">
                                {it.departureFerry}
                              </p>
                              <p className="text-gray-500">
                                {it.ferry.route.split("→")[0] || "출발"}
                              </p>
                            </div>
                            <div className="flex-1 mx-4 flex items-center">
                              <div className="flex-1 h-px bg-teal-300" />
                              <span className="px-2 text-xs text-teal-600">
                                🚢 {it.ferry.duration}분
                              </span>
                              <div className="flex-1 h-px bg-teal-300" />
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-navy-500">
                                {it.island.name}
                              </p>
                              <p className="text-gray-500">도착</p>
                            </div>
                          </div>
                          {it.ferry.fare > 0 && (
                            <p className="text-xs text-teal-600 text-center mt-2">
                              편도 요금: {it.ferry.fare.toLocaleString()}원
                            </p>
                          )}
                        </div>

                        {/* Timeline */}
                        <div className="relative pl-8">
                          {it.schedule.map((item, i) => (
                            <div key={i} className="relative pb-4 last:pb-0">
                              {i < it.schedule.length - 1 && (
                                <div className="absolute left-[-20px] top-6 bottom-0 w-px bg-gray-200" />
                              )}
                              <div className="absolute left-[-26px] top-1 w-[13px] h-[13px] rounded-full border-2 border-teal-400 bg-white" />
                              <div className="flex items-start gap-3">
                                <span className="text-xs font-mono text-gray-400 mt-0.5 w-12 flex-shrink-0">
                                  {item.time}
                                </span>
                                <span className="text-lg">{item.icon}</span>
                                <div>
                                  <p className="font-medium text-navy-500 text-sm">
                                    {item.activity}
                                  </p>
                                  {item.duration > 0 && (
                                    <p className="text-xs text-gray-400">
                                      약 {item.duration}분
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Return */}
                        <div className="mt-4 bg-gray-50 rounded-xl p-3 text-center text-sm text-gray-500">
                          🚢 {it.returnFerry} 귀환편 탑승 →{" "}
                          여수 도착
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
