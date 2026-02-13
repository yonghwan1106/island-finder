"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getIslandData } from "@/lib/data";
import { buildUserVector, recommendIslands } from "@/lib/recommend";
import { QuizOption, RecommendResult, IslandVector } from "@/lib/types";
import Link from "next/link";
import RadarChart from "@/components/RadarChart";

// Map question IDs to CSS gradient classes
const QUESTION_BG_MAP: Record<string, string> = {
  style: "quiz-bg-ocean",
  time: "quiz-bg-forest",
  companion: "quiz-bg-sunset",
  stay: "quiz-bg-culture",
  activity: "quiz-bg-adventure",
  vibe: "quiz-bg-vibe",
};

// Cluster to user type mapping
const CLUSTER_TYPE_MAP: Record<string, string> = {
  "비경 탐험": "비경 탐험가형 🏔️",
  "트레킹 모험": "트레킹 모험가형 🥾",
  "미식 탐험": "미식 탐험가형 🦐",
  "역사 문화": "역사 문화인형 🏛️",
  "힐링 여행": "힐링 여행가형 📸",
  "가족 여행": "가족 여행가형 👨‍👩‍👧‍👦",
  "쉬운 접근": "쉬운접근 힐링형 🚗",
};

export default function QuizPage() {
  const data = getIslandData();
  const questions = data.quizQuestions;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[]>([]);
  const [results, setResults] = useState<RecommendResult[] | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userVector, setUserVector] = useState<IslandVector | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleSelect = (option: QuizOption, idx: number) => {
    setSelectedOption(idx);
    setTimeout(() => {
      const newAnswers = [...answers, option];
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (step + 1 >= questions.length) {
        const vector = buildUserVector(newAnswers);
        setUserVector(vector);
        const recs = recommendIslands(data.islands, vector, 3);
        setResults(recs);
      } else {
        setStep(step + 1);
      }
    }, 200);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setResults(null);
    setUserVector(null);
    setSelectedOption(null);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    }
  };

  const handleTwitterShare = () => {
    if (!results || results.length === 0) return;
    const topResult = results[0];
    const userType = CLUSTER_TYPE_MAP[topResult.island.cluster] || topResult.island.cluster;
    const text = `섬파인더에서 나의 섬 유형은 ${userType}! ${topResult.island.name}이 ${topResult.matchPercent}% 매칭!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleKakaoShare = () => {
    alert("카카오톡 공유 준비 중");
  };

  if (results && userVector) {
    const topResult = results[0];
    const userType = CLUSTER_TYPE_MAP[topResult.island.cluster] || topResult.island.cluster;

    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-navy-500 mb-2">
              당신의 섬을 찾았어요!
            </h1>
            <p className="text-xl font-semibold text-teal-600 mb-2">
              {userType}
            </p>
            <p className="text-gray-500">
              AI가 분석한 나만의 맞춤 섬 Top 3
            </p>
          </div>

          {/* SNS Share Section */}
          <div className="flex justify-center gap-3 mb-8 animate-fade-in-up">
            <button
              onClick={handleKakaoShare}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <span>💬</span>
              카카오톡 공유
            </button>
            <button
              onClick={handleTwitterShare}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🐦</span>
              트위터 공유
            </button>
            <button
              onClick={handleCopyLink}
              className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🔗</span>
              링크 복사
            </button>
          </div>

          {/* Copy Toast */}
          {showCopyToast && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
              링크가 복사되었습니다!
            </div>
          )}

          <div className="space-y-6">
            {results.map((result, i) => (
              <div
                key={result.island.id}
                className="animate-fade-in-up bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="flex flex-col md:flex-row">
                  <div
                    className={`md:w-48 p-6 flex flex-col items-center justify-center text-white ${
                      i === 0
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                        : i === 1
                        ? "bg-gradient-to-br from-gray-300 to-gray-400"
                        : "bg-gradient-to-br from-amber-600 to-amber-700"
                    }`}
                  >
                    <span className="text-4xl font-bold mb-2">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                    </span>

                    {/* Circular Progress Animation */}
                    <div className="relative w-24 h-24 mb-2">
                      <svg className="transform -rotate-90" width="96" height="96">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="white"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.matchPercent / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                          style={{
                            animationDelay: `${i * 200}ms`,
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{result.matchPercent}%</span>
                      </div>
                    </div>
                    <span className="text-sm opacity-90">매칭률</span>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link
                          href={`/island/${result.island.id}`}
                          className="text-2xl font-bold text-navy-500 hover:text-teal-600 transition-colors"
                        >
                          {result.island.name}
                        </Link>
                        <span className="text-sm text-gray-400 block">
                          {result.island.nameEn}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                        {result.island.cluster}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {result.island.description}
                    </p>

                    {/* RadarChart for #1 result */}
                    {i === 0 && (
                      <div className="mb-4 bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                          나의 취향 vs 섬 특성 비교
                        </h4>
                        <RadarChart
                          vector={result.island.vector}
                          label={result.island.name}
                          color="#0D9488"
                          compareVector={userVector}
                          compareLabel="나의 취향"
                          compareColor="#F59E0B"
                          size={280}
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.reasons.map((reason, j) => (
                        <span
                          key={j}
                          className="px-3 py-1 bg-ocean-50 text-ocean-700 rounded-full text-sm"
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>🚢 {result.island.ferryPort}에서 {result.island.travelTime}분</span>
                      <span>📍 관광지 {result.island.attractions.length}곳</span>
                      <span>🍽️ 음식점 {result.island.restaurants}곳</span>
                      <span>🏨 숙소 {result.island.accommodations}곳</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.island.hashtags.map((tag, j) => (
                        <span key={j} className="text-xs text-teal-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 space-x-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white border-2 border-navy-500 text-navy-500 font-bold rounded-xl hover:bg-navy-50 transition-colors"
            >
              🔄 다시 해보기
            </button>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-ocean-gradient text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              🗺️ 다른 섬도 보러가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[step];
  const bgClass = QUESTION_BG_MAP[currentQ.id] || "bg-gray-50";
  const questionIcon = currentQ.options[0]?.label.split(" ")[0] || "❓";

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 ${bgClass}`}>
      <div className="max-w-2xl w-full">
        {/* Progress with step icons */}
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-3">
            {questions.map((q, i) => {
              const icon = q.options[0]?.label.split(" ")[0] || "❓";
              return (
                <div
                  key={q.id}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    i < step
                      ? "bg-teal-500 text-white"
                      : i === step
                      ? "bg-white text-teal-600 ring-4 ring-teal-200 scale-110"
                      : "bg-white/50 text-gray-400"
                  }`}
                >
                  {icon}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              질문 {step + 1} / {questions.length}
            </span>
            <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-ocean-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((step + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-navy-500 mb-8 text-center">
              {currentQ.question}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((option, i) => {
                const emoji = option.label.split(" ")[0];
                const text = option.label.split(" ").slice(1).join(" ");

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleSelect(option, i)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-6 rounded-2xl text-center transition-all duration-300 border-2 ${
                      selectedOption === i
                        ? "border-teal-500 bg-teal-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-teal-300 hover:shadow-md"
                    }`}
                  >
                    <span className="text-4xl block mb-3">
                      {emoji}
                    </span>
                    <span className="text-lg font-medium text-navy-500">
                      {text}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {step > 0 && (
          <button
            onClick={() => {
              setStep(step - 1);
              setAnswers(answers.slice(0, -1));
            }}
            className="mt-6 text-gray-600 hover:text-gray-800 text-sm mx-auto block font-medium"
          >
            ← 이전 질문으로
          </button>
        )}
      </div>
    </div>
  );
}
