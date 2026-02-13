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
    <div className="page-bg min-h-screen py-8 px-4">
      <div className="noise-overlay" />
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl font-bold mb-3 text-navy-700">
            여정 설계사
          </h1>
          <p className="text-gray-500 text-lg">
            시간과 선호도를 입력하면 최적의 섬 여행 코스를 추천합니다
          </p>
        </div>

        {/* Input Form - Section Cards */}
        <div className="space-y-6 mb-12">
          {/* Card 1 - 시간 설정 */}
          <div className="card-solid p-8 rounded-2xl border-l-4 border-blue-400">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">⏰</span>
              <h3 className="font-display text-2xl font-bold text-navy-700">시간 설정</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  출발 시간
                </label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-navy-700 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  귀환 시간
                </label>
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-navy-700 transition-all"
                />
              </div>
            </div>
            {isTimeInvalid && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-300 rounded-xl text-red-600 text-sm font-medium"
              >
                ⚠️ 귀환 시간은 출발 시간 이후여야 합니다
              </motion.div>
            )}
            <p className="mt-4 text-xs text-gray-500">
              💡 추천: 당일치기 08:00~18:00 / 여유롭게 07:00~20:00
            </p>
          </div>

          {/* Card 2 - 인원 설정 */}
          <div className="card-solid p-8 rounded-2xl border-l-4 border-teal-400">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">👥</span>
              <h3 className="font-display text-2xl font-bold text-navy-700">인원 설정</h3>
            </div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-4 bg-teal-50 px-8 py-4 rounded-full border border-teal-200">
                <span className="text-4xl">{groupLabel.icon}</span>
                <div className="text-left">
                  <p className="text-3xl font-bold text-navy-700">{groupSize}명</p>
                  <p className="text-sm text-gray-500">{groupLabel.label}</p>
                </div>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className="w-full accent-teal-400 h-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-3 px-1">
              <span>1명</span>
              <span>20명</span>
            </div>
          </div>

          {/* Card 3 - 여행 형태 */}
          <div className="card-solid p-8 rounded-2xl border-l-4 border-purple-400">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🏨</span>
              <h3 className="font-display text-2xl font-bold text-navy-700">여행 형태</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "daytrip", icon: "☀️", label: "당일치기" },
                { value: "onenight", icon: "🌙", label: "1박 2일" },
                { value: "extended", icon: "🏖️", label: "2박 이상" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStayType(opt.value as typeof stayType)}
                  className={`card-solid flex flex-col items-center justify-center py-8 rounded-xl text-sm font-medium transition-all ${
                    stayType === opt.value
                      ? "ring-2 ring-teal-500 bg-teal-50 border-teal-300 scale-105"
                      : "border border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-4xl mb-3">{opt.icon}</span>
                  <span className="text-navy-700 font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 4 - 선호도 */}
          <div className="card-solid p-8 rounded-2xl border-l-4 border-pink-400">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">💝</span>
              <h3 className="font-display text-2xl font-bold text-navy-700">
                선호도 <span className="text-sm text-gray-500 font-normal">(복수 선택 가능)</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {PREFERENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => togglePreference(opt.value)}
                  className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                    preferences.includes(opt.value)
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white glow-teal scale-105 shadow-lg"
                      : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300"
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
                className="mt-5 p-4 bg-teal-50 border border-teal-200 rounded-xl"
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
            className={`w-full py-5 font-bold rounded-xl text-lg transition-all ${
              isTimeInvalid || isGenerating
                ? "bg-gray-100 opacity-50 cursor-not-allowed text-gray-400"
                : "gradient-border glow-ocean text-white hover:scale-[1.02]"
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-3">
                <div className="glass w-10 h-10 rounded-full flex items-center justify-center">
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
                </div>
                여정 생성 중...
              </div>
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
                <div className="card-solid text-center py-12 rounded-2xl">
                  <span className="text-5xl block mb-4">😢</span>
                  <p className="text-gray-500 text-lg">
                    조건에 맞는 여정을 찾지 못했어요.
                    <br />
                    시간을 넓혀보거나 다른 옵션을 선택해보세요.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-elevated bg-gradient-to-r from-teal-50 via-ocean-50 to-purple-50 border border-teal-200 rounded-2xl p-8 shadow-2xl"
                  >
                    <div className="stagger-children flex items-center justify-between flex-wrap gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <p className="text-sm text-gray-500 mb-1">총 추천 여정</p>
                        <p className="text-4xl font-bold text-navy-700">{itineraries.length}개</p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-sm text-gray-500 mb-1">베스트 매치</p>
                        <p className="text-2xl font-bold text-navy-700">{itineraries[0].island.name}</p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-sm text-gray-500 mb-1">예상 소요 시간</p>
                        <p className="text-2xl font-bold text-navy-700">
                          {Math.floor(itineraries[0].totalTime / 60)}시간{" "}
                          {itineraries[0].totalTime % 60 > 0 && `${itineraries[0].totalTime % 60}분`}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>

                  <h2 className="font-display text-3xl font-bold text-navy-700">
                    🎯 추천 여정
                  </h2>

                  {itineraries.map((it, idx) => (
                    <motion.div
                      key={it.island.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`card-solid overflow-hidden rounded-2xl ${
                        idx === 0 ? "gradient-border" : ""
                      }`}
                    >
                      <button
                        onClick={() =>
                          setExpandedIdx(expandedIdx === idx ? null : idx)
                        }
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-5">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                              idx === 0
                                ? "bg-gradient-to-br from-teal-400 to-ocean-500 glow-ocean"
                                : "glass-strong"
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div>
                            <Link
                              href={`/island/${it.island.id}`}
                              className="font-display text-2xl font-bold text-navy-700 hover:text-teal-600 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {it.island.name}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">
                              {it.island.cluster} · {it.departureFerry} 출발 ·{" "}
                              {Math.floor(it.totalTime / 60)}시간{" "}
                              {it.totalTime % 60 > 0 && `${it.totalTime % 60}분`} 코스
                            </p>
                          </div>
                        </div>
                        <motion.span
                          animate={{ rotate: expandedIdx === idx ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-2xl text-gray-500"
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
                            <div className="px-6 pb-6 border-t border-white/10">
                              {/* Ferry Info with Animation */}
                              <div className="mt-6 mb-6 bg-teal-50 border border-teal-200 rounded-xl p-5">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="text-center">
                                    <p className="font-bold text-navy-700 text-base">
                                      {it.departureFerry}
                                    </p>
                                    <p className="text-gray-500 mt-1">
                                      {it.ferry.route.split("→")[0] || "출발"}
                                    </p>
                                  </div>
                                  <div className="flex-1 mx-6 flex items-center">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
                                    <motion.span
                                      animate={{ x: [0, 10, 0] }}
                                      transition={{ repeat: Infinity, duration: 2 }}
                                      className="px-3 text-2xl"
                                    >
                                      🚢
                                    </motion.span>
                                    <span className="text-xs text-teal-600 font-semibold bg-teal-50 px-2 py-1 rounded-full border border-teal-200">
                                      {it.ferry.duration}분
                                    </span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
                                  </div>
                                  <div className="text-center">
                                    <p className="font-bold text-navy-700 text-base">
                                      {it.island.name}
                                    </p>
                                    <p className="text-gray-500 mt-1">도착</p>
                                  </div>
                                </div>
                                {it.ferry.fare > 0 && (
                                  <p className="text-xs text-teal-600 text-center mt-3 font-medium">
                                    편도 요금: {it.ferry.fare.toLocaleString()}원
                                  </p>
                                )}
                              </div>

                              {/* Timeline - Vertical Stepper */}
                              <div className="relative pl-12">
                                {it.schedule.map((item, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="relative pb-8 last:pb-0"
                                  >
                                    {/* Connecting Line */}
                                    {i < it.schedule.length - 1 && (
                                      <div className="absolute left-[-28px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 via-ocean-400 to-teal-400" />
                                    )}
                                    {/* Dot */}
                                    <div className="absolute left-[-32px] top-3 w-4 h-4 rounded-full border-2 border-teal-400 bg-teal-100 shadow-lg" />

                                    <div className="flex items-start gap-4">
                                      <span className="text-xs font-mono font-bold text-teal-600 mt-1 w-14 flex-shrink-0 bg-gray-100 px-2 py-1 rounded">
                                        {item.time}
                                      </span>
                                      <span className="text-3xl">{item.icon}</span>
                                      <div className="flex-1">
                                        <p className="font-semibold text-navy-700 text-lg">
                                          {item.activity}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                          {item.location}
                                        </p>
                                        {item.duration > 0 && (
                                          <span className="inline-block mt-2 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-600 text-xs rounded-full font-medium">
                                            약 {item.duration}분
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>

                              {/* Return Ferry */}
                              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-sm text-gray-600">
                                🚢 {it.returnFerry} 귀환편 탑승 → 여수 도착
                              </div>

                              {/* Journey Summary Footer */}
                              <div className="mt-6 pt-6 border-t border-white/10 stagger-children grid grid-cols-3 gap-6 text-center">
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="card-solid p-4 rounded-xl"
                                >
                                  <p className="text-xs text-gray-500 mb-2">총 소요 시간</p>
                                  <p className="font-bold text-navy-700 text-lg">
                                    {Math.floor(it.totalTime / 60)}시간{" "}
                                    {it.totalTime % 60 > 0 && `${it.totalTime % 60}분`}
                                  </p>
                                </motion.div>
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="card-solid p-4 rounded-xl"
                                >
                                  <p className="text-xs text-gray-500 mb-2">예상 비용</p>
                                  <p className="font-bold text-navy-700 text-lg">
                                    {it.ferry.fare > 0
                                      ? `${(it.ferry.fare * 2).toLocaleString()}원`
                                      : "무료"}
                                  </p>
                                </motion.div>
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                  className="card-solid p-4 rounded-xl"
                                >
                                  <p className="text-xs text-gray-500 mb-2">주요 활동</p>
                                  <p className="font-bold text-navy-700 text-lg">
                                    {it.schedule.length - 2}개
                                  </p>
                                </motion.div>
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
