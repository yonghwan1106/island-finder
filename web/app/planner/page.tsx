"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

const GROUP_SIZE_LABELS = [
  { range: [1, 1], icon: "🧑", label: "개인" },
  { range: [2, 3], icon: "💑", label: "커플/소그룹" },
  { range: [4, 6], icon: "👨‍👩‍👧‍👦", label: "가족" },
  { range: [7, 10], icon: "👯", label: "단체" },
  { range: [11, 20], icon: "🚌", label: "대규모" },
];

function getGroupSizeLabel(size: number) {
  const match = GROUP_SIZE_LABELS.find(
    (g) => size >= g.range[0] && size <= g.range[1]
  );
  return match || { icon: "👥", label: "단체" };
}

export default function PlannerPage() {
  const data = getIslandData();
  const [departureTime, setDepartureTime] = useState("08:00");
  const [returnTime, setReturnTime] = useState("18:00");
  const [groupSize, setGroupSize] = useState(2);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [stayType, setStayType] = useState<"daytrip" | "onenight" | "extended">("daytrip");
  const [itineraries, setItineraries] = useState<Itinerary[] | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const isTimeInvalid = timeToMinutes(returnTime) <= timeToMinutes(departureTime);

  const togglePreference = (value: string) => {
    setPreferences((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  const getMatchingIslands = () => {
    if (preferences.length === 0) return [];

    const scored = data.islands.map((island) => {
      const score = preferences.reduce((sum, pref) => {
        const key = pref as keyof typeof island.vector;
        return sum + (island.vector[key] || 0);
      }, 0);
      return { island, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.island.name);
  };

  const matchingIslands = getMatchingIslands();

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Fake delay for loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    const results = generateItineraries(data.islands, data.ferrySchedules, {
      departureTime,
      returnTime,
      groupSize,
      preferences,
      stayType,
    });
    setItineraries(results);
    setExpandedIdx(results.length > 0 ? 0 : null);
    setIsGenerating(false);
  };

  const groupLabel = getGroupSizeLabel(groupSize);

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

        {/* Input Form - Section Cards */}
        <div className="space-y-4 mb-8">
          {/* Card 1 - 시간 설정 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⏰</span>
              <h3 className="text-lg font-bold text-navy-500">시간 설정</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  출발 시간
                </label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  귀환 시간
                </label>
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                />
              </div>
            </div>
            {isTimeInvalid && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium"
              >
                ⚠️ 귀환 시간은 출발 시간 이후여야 합니다
              </motion.div>
            )}
            <p className="mt-3 text-xs text-gray-500">
              💡 추천: 당일치기 08:00~18:00 / 여유롭게 07:00~20:00
            </p>
          </div>

          {/* Card 2 - 인원 설정 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">👥</span>
              <h3 className="text-lg font-bold text-navy-500">인원 설정</h3>
            </div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-3 bg-teal-50 px-6 py-3 rounded-full">
                <span className="text-3xl">{groupLabel.icon}</span>
                <div className="text-left">
                  <p className="text-2xl font-bold text-navy-500">{groupSize}명</p>
                  <p className="text-sm text-gray-600">{groupLabel.label}</p>
                </div>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className="w-full accent-teal-500 h-2"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
              <span>1명</span>
              <span>20명</span>
            </div>
          </div>

          {/* Card 3 - 여행 형태 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏨</span>
              <h3 className="text-lg font-bold text-navy-500">여행 형태</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "daytrip", icon: "☀️", label: "당일치기" },
                { value: "onenight", icon: "🌙", label: "1박 2일" },
                { value: "extended", icon: "🏖️", label: "2박 이상" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStayType(opt.value as typeof stayType)}
                  className={`flex flex-col items-center justify-center py-6 rounded-xl text-sm font-medium transition-all ${
                    stayType === opt.value
                      ? "bg-teal-500 text-white shadow-lg scale-105"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-3xl mb-2">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 4 - 선호도 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💝</span>
              <h3 className="text-lg font-bold text-navy-500">
                선호도 <span className="text-sm text-gray-400 font-normal">(복수 선택 가능)</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {PREFERENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => togglePreference(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    preferences.includes(opt.value)
                      ? "bg-teal-500 text-white shadow-md scale-105"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {matchingIslands.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-3 bg-teal-50 rounded-lg"
              >
                <p className="text-sm text-teal-700">
                  <span className="font-semibold">선택한 선호도에 맞는 섬:</span>{" "}
                  {matchingIslands.join(", ")}
                </p>
              </motion.div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isTimeInvalid || isGenerating}
            className={`w-full py-4 font-bold rounded-xl text-lg transition-all ${
              isTimeInvalid || isGenerating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-ocean-gradient text-white hover:opacity-90 hover:shadow-lg"
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                여정 생성 중...
              </span>
            ) : (
              "🗓️ 여정 생성하기"
            )}
          </button>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {itineraries !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
                  {/* Summary Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-teal-500 to-ocean-500 text-white rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <p className="text-sm opacity-90 mb-1">총 추천 여정</p>
                        <p className="text-3xl font-bold">{itineraries.length}개</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90 mb-1">베스트 매치</p>
                        <p className="text-xl font-bold">{itineraries[0].island.name}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90 mb-1">예상 소요 시간</p>
                        <p className="text-xl font-bold">
                          {Math.floor(itineraries[0].totalTime / 60)}시간{" "}
                          {itineraries[0].totalTime % 60 > 0 && `${itineraries[0].totalTime % 60}분`}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <h2 className="text-xl font-bold text-navy-500">
                    🎯 추천 여정
                  </h2>

                  {itineraries.map((it, idx) => (
                    <motion.div
                      key={it.island.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
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
                            <Link
                              href={`/island/${it.island.id}`}
                              className="font-bold text-navy-500 text-lg hover:text-teal-500 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {it.island.name}
                            </Link>
                            <p className="text-sm text-gray-400">
                              {it.island.cluster} · {it.departureFerry} 출발 ·{" "}
                              {Math.floor(it.totalTime / 60)}시간{" "}
                              {it.totalTime % 60 > 0 && `${it.totalTime % 60}분`} 코스
                            </p>
                          </div>
                        </div>
                        <motion.span
                          animate={{ rotate: expandedIdx === idx ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-xl text-gray-400"
                        >
                          ⌄
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {expandedIdx === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 border-t border-gray-100">
                              {/* Ferry Info with Animation */}
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
                                    <motion.span
                                      animate={{ x: [0, 10, 0] }}
                                      transition={{ repeat: Infinity, duration: 2 }}
                                      className="px-2 text-xl"
                                    >
                                      🚢
                                    </motion.span>
                                    <span className="text-xs text-teal-600">
                                      {it.ferry.duration}분
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

                              {/* Timeline - Vertical Stepper */}
                              <div className="relative pl-10">
                                {it.schedule.map((item, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="relative pb-6 last:pb-0"
                                  >
                                    {/* Connecting Line */}
                                    {i < it.schedule.length - 1 && (
                                      <div className="absolute left-[-24px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 to-teal-200" />
                                    )}
                                    {/* Dot */}
                                    <div className="absolute left-[-30px] top-2 w-3 h-3 rounded-full border-2 border-teal-400 bg-white shadow-sm" />

                                    <div className="flex items-start gap-3">
                                      <span className="text-xs font-mono font-bold text-teal-600 mt-1 w-12 flex-shrink-0">
                                        {item.time}
                                      </span>
                                      <span className="text-2xl">{item.icon}</span>
                                      <div className="flex-1">
                                        <p className="font-semibold text-navy-500">
                                          {item.activity}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                          {item.location}
                                        </p>
                                        {item.duration > 0 && (
                                          <span className="inline-block mt-1 px-2 py-0.5 bg-teal-50 text-teal-600 text-xs rounded-full font-medium">
                                            약 {item.duration}분
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>

                              {/* Return Ferry */}
                              <div className="mt-4 bg-gray-50 rounded-xl p-3 text-center text-sm text-gray-600">
                                🚢 {it.returnFerry} 귀환편 탑승 → 여수 도착
                              </div>

                              {/* Journey Summary Footer */}
                              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">총 소요 시간</p>
                                  <p className="font-bold text-navy-500">
                                    {Math.floor(it.totalTime / 60)}시간{" "}
                                    {it.totalTime % 60 > 0 && `${it.totalTime % 60}분`}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">예상 비용</p>
                                  <p className="font-bold text-navy-500">
                                    {it.ferry.fare > 0
                                      ? `${(it.ferry.fare * 2).toLocaleString()}원`
                                      : "무료"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">주요 활동</p>
                                  <p className="font-bold text-navy-500">
                                    {it.schedule.length - 2}개
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
