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
      <div className="min-h-screen page-bg py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* User Type Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="font-display text-5xl text-navy-500 mb-4 glow-ocean" style={{ textShadow: "0 2px 20px rgba(13, 148, 136, 0.3)" }}>
              당신의 섬을 찾았어요!
            </h1>
            <div className="glass-card inline-block px-8 py-4 rounded-2xl">
              <p className="text-2xl font-bold text-teal-600 glow-teal">
                {userType}
              </p>
            </div>
            <p className="text-gray-400 mt-4 text-lg">
              AI가 분석한 나만의 맞춤 섬 Top 3
            </p>
          </motion.div>

          {/* HERO: Radar Chart - Prominently at the top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card gradient-border p-8 mb-10 rounded-3xl"
          >
            <h2 className="font-display text-3xl text-center mb-6 text-navy-500 glow-ocean">
              나의 취향 vs 1위 섬 특성
            </h2>
            <div className="flex justify-center">
              <RadarChart
                vector={topResult.island.vector}
                label={topResult.island.name}
                color="#0D9488"
                compareVector={userVector}
                compareLabel="나의 취향"
                compareColor="#F59E0B"
                size={320}
              />
            </div>
          </motion.div>

          {/* SNS Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6 rounded-2xl mb-8"
          >
            <p className="text-center text-gray-600 mb-4 font-medium">결과 공유하기</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={handleKakaoShare}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold rounded-xl transition-all hover:scale-105 flex items-center gap-2 glow-gold"
              >
                <span>💬</span>
                카카오톡
              </button>
              <button
                onClick={handleTwitterShare}
                className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-all hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <span>🐦</span>
                트위터
              </button>
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 glass-strong text-navy-500 font-bold rounded-xl transition-all hover:scale-105 flex items-center gap-2 border border-white/20"
              >
                <span>🔗</span>
                링크 복사
              </button>
            </div>
          </motion.div>

          {/* Copy Toast */}
          <AnimatePresence>
            {showCopyToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-8 left-1/2 transform -translate-x-1/2 glass-strong px-8 py-4 rounded-2xl z-50 text-navy-500 font-bold shadow-2xl"
              >
                ✓ 링크가 복사되었습니다!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Cards */}
          <div className="space-y-6 stagger-children">
            {results.map((result, i) => (
              <motion.div
                key={result.island.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                className="glass-card rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
                style={{
                  borderLeft: i === 0 ? "6px solid #F59E0B" : i === 1 ? "6px solid #D1D5DB" : "6px solid #D97706"
                }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Match Percentage Panel */}
                  <div
                    className={`md:w-52 p-8 flex flex-col items-center justify-center ${
                      i === 0
                        ? "bg-gradient-to-br from-yellow-400/20 to-orange-500/20"
                        : i === 1
                        ? "bg-gradient-to-br from-gray-300/20 to-gray-400/20"
                        : "bg-gradient-to-br from-amber-600/20 to-amber-700/20"
                    }`}
                  >
                    <span className="text-6xl mb-4">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                    </span>
                    <div className="text-center">
                      <div className="text-5xl font-bold bg-gradient-to-r from-teal-500 to-ocean-500 bg-clip-text text-transparent mb-2">
                        {result.matchPercent}%
                      </div>
                      <span className="text-sm text-gray-500 font-medium">매칭률</span>
                    </div>
                  </div>

                  {/* Content Panel */}
                  <div className="flex-1 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Link
                          href={`/island/${result.island.id}`}
                          className="font-display text-3xl text-navy-500 hover:text-teal-600 transition-colors glow-teal"
                        >
                          {result.island.name}
                        </Link>
                        <span className="text-sm text-gray-400 block mt-1">
                          {result.island.nameEn}
                        </span>
                      </div>
                      <span className="px-4 py-2 glass-strong text-teal-600 rounded-full text-sm font-bold border border-teal-200">
                        {result.island.cluster}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-5 leading-relaxed text-base">
                      {result.island.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {result.reasons.map((reason, j) => (
                        <span
                          key={j}
                          className="px-4 py-2 glass text-ocean-700 rounded-full text-sm font-medium border border-ocean-200"
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-5 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">🚢 {result.island.ferryPort}에서 {result.island.travelTime}분</span>
                      <span className="flex items-center gap-1">📍 관광지 {result.island.attractions.length}곳</span>
                      <span className="flex items-center gap-1">🍽️ 음식점 {result.island.restaurants}곳</span>
                      <span className="flex items-center gap-1">🏨 숙소 {result.island.accommodations}곳</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {result.island.hashtags.map((tag, j) => (
                        <span key={j} className="text-xs text-teal-500 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center mt-12 flex justify-center gap-4 flex-wrap"
          >
            <button
              onClick={handleReset}
              className="px-8 py-4 glass-strong text-navy-500 font-bold rounded-xl hover:scale-105 transition-all border border-white/30 glow-ocean"
            >
              🔄 다시 해보기
            </button>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-ocean-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg glow-teal"
            >
              🗺️ 다른 섬도 보러가기
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQ = questions[step];
  const bgClass = QUESTION_BG_MAP[currentQ.id] || "bg-gray-50";

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 relative ${bgClass}`}>
      {/* Decorative floating circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-ocean-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-sand-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 glass p-6 rounded-2xl"
        >
          <div className="flex justify-center gap-3 mb-4">
            {questions.map((q, i) => {
              const icon = q.options[0]?.label.split(" ")[0] || "❓";
              return (
                <motion.div
                  key={q.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                    i < step
                      ? "glass-strong text-teal-600 border-2 border-teal-400"
                      : i === step
                      ? "glass-strong text-ocean-600 ring-4 ring-teal-300 scale-110 glow-teal"
                      : "glass text-gray-400"
                  }`}
                >
                  {icon}
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-between text-sm text-navy-500/70 mb-3 font-medium">
            <span>
              질문 {step + 1} / {questions.length}
            </span>
            <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-3 glass rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-teal-400 via-ocean-500 to-teal-600 rounded-full shadow-lg"
            />
          </div>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-display text-4xl text-navy-500 mb-10 text-center leading-tight" style={{ textShadow: "0 2px 10px rgba(27, 58, 92, 0.1)" }}>
              {currentQ.question}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {currentQ.options.map((option, i) => {
                const emoji = option.label.split(" ")[0];
                const text = option.label.split(" ").slice(1).join(" ");

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleSelect(option, i)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`glass-card p-8 rounded-2xl text-center transition-all duration-300 ${
                      selectedOption === i
                        ? "gradient-border glow-teal scale-105"
                        : "hover:gradient-border"
                    }`}
                  >
                    <span className="text-5xl block mb-4">
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

        {/* Previous Button */}
        {step > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              setStep(step - 1);
              setAnswers(answers.slice(0, -1));
            }}
            className="mt-8 px-6 py-3 glass-strong text-navy-500 rounded-full text-sm mx-auto block font-bold hover:scale-105 transition-all border border-white/30"
          >
            ← 이전 질문으로
          </motion.button>
        )}
      </div>
    </div>
  );
}
