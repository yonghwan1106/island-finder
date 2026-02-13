"use client";

import { useState } from "react";
import { getIslandData } from "@/lib/data";
import { buildUserVector, recommendIslands } from "@/lib/recommend";
import { QuizOption, RecommendResult } from "@/lib/types";
import Link from "next/link";

export default function QuizPage() {
  const data = getIslandData();
  const questions = data.quizQuestions;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[]>([]);
  const [results, setResults] = useState<RecommendResult[] | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSelect = (option: QuizOption, idx: number) => {
    setSelectedOption(idx);
    setTimeout(() => {
      const newAnswers = [...answers, option];
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (step + 1 >= questions.length) {
        const userVector = buildUserVector(newAnswers);
        const recs = recommendIslands(data.islands, userVector, 3);
        setResults(recs);
      } else {
        setStep(step + 1);
      }
    }, 400);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setResults(null);
    setSelectedOption(null);
  };

  if (results) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-navy-500 mb-2">
              당신의 섬을 찾았어요!
            </h1>
            <p className="text-gray-500">
              AI가 분석한 나만의 맞춤 섬 Top 3
            </p>
          </div>

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
                    <span className="text-4xl font-bold">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                    </span>
                    <span className="text-3xl font-bold mt-2">
                      {result.matchPercent}%
                    </span>
                    <span className="text-sm opacity-90">매칭률</span>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-navy-500">
                          {result.island.name}
                        </h3>
                        <span className="text-sm text-gray-400">
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
              🗺️ 섬 대시보드 보기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[step];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>
              질문 {step + 1} / {questions.length}
            </span>
            <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-ocean-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((step + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="animate-fade-in-up" key={step}>
          <h2 className="text-3xl font-bold text-navy-500 mb-8 text-center">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(option, i)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                  selectedOption === i
                    ? "border-teal-500 bg-teal-50 scale-95"
                    : "border-gray-200 bg-white hover:border-teal-300 hover:shadow-md hover:-translate-y-1"
                }`}
              >
                <span className="text-2xl block mb-2">
                  {option.label.split(" ")[0]}
                </span>
                <span className="text-lg font-medium text-navy-500">
                  {option.label.split(" ").slice(1).join(" ")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {step > 0 && (
          <button
            onClick={() => {
              setStep(step - 1);
              setAnswers(answers.slice(0, -1));
            }}
            className="mt-6 text-gray-400 hover:text-gray-600 text-sm mx-auto block"
          >
            ← 이전 질문으로
          </button>
        )}
      </div>
    </div>
  );
}
