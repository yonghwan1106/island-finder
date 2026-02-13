import { Island, IslandVector, QuizOption, RecommendResult } from "./types";

const VECTOR_KEYS: (keyof IslandVector)[] = [
  "accessibility", "nature", "culture", "food",
  "activity", "accommodation", "tranquility", "family",
];

export function buildUserVector(answers: QuizOption[]): IslandVector {
  const sum: IslandVector = {
    accessibility: 0, nature: 0, culture: 0, food: 0,
    activity: 0, accommodation: 0, tranquility: 0, family: 0,
  };
  let count = 0;

  for (const answer of answers) {
    for (const key of VECTOR_KEYS) {
      if (answer.vector[key] !== undefined) {
        sum[key] += answer.vector[key]!;
      }
    }
    count++;
  }

  if (count === 0) return sum;

  for (const key of VECTOR_KEYS) {
    sum[key] = Math.min(1, sum[key] / count);
  }

  return sum;
}

function cosineSimilarity(a: IslandVector, b: IslandVector): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const key of VECTOR_KEYS) {
    dotProduct += a[key] * b[key];
    normA += a[key] * a[key];
    normB += b[key] * b[key];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

function generateReasons(island: Island, userVector: IslandVector): string[] {
  const reasons: string[] = [];
  const sorted = VECTOR_KEYS
    .map((key) => ({ key, value: island.vector[key], userValue: userVector[key] }))
    .filter((d) => d.userValue > 0.3)
    .sort((a, b) => b.value * b.userValue - a.value * a.userValue);

  const labelMap: Record<string, string> = {
    accessibility: "접근성이 좋아요",
    nature: "자연경관이 아름다워요",
    culture: "문화/역사 체험이 풍부해요",
    food: "맛집이 많아요",
    activity: "다양한 활동을 즐길 수 있어요",
    accommodation: "숙박 시설이 잘 갖춰져 있어요",
    tranquility: "조용하고 평화로워요",
    family: "가족 여행에 딱이에요",
  };

  for (const item of sorted.slice(0, 3)) {
    if (item.value >= 0.6) {
      reasons.push(labelMap[item.key]);
    }
  }

  if (island.travelTime <= 30) {
    reasons.push(`배로 ${island.travelTime}분이면 도착!`);
  }

  if (island.attractions.length > 0) {
    reasons.push(`${island.attractions[0]} 추천!`);
  }

  return reasons.slice(0, 3);
}

export function recommendIslands(
  islands: Island[],
  userVector: IslandVector,
  topN: number = 3
): RecommendResult[] {
  const scored = islands
    .filter((island) => island.population >= 0)
    .map((island) => {
      const score = cosineSimilarity(userVector, island.vector);
      return {
        island,
        score,
        matchPercent: Math.round(score * 100),
        reasons: generateReasons(island, userVector),
      };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, topN);
}
