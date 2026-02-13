"use client";

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { IslandVector } from "@/lib/types";

const DIMENSION_LABELS: Record<keyof IslandVector, string> = {
  accessibility: "접근성",
  nature: "자연경관",
  culture: "역사문화",
  food: "미식",
  activity: "액티비티",
  accommodation: "숙박",
  tranquility: "힐링",
  family: "가족친화",
};

interface RadarChartProps {
  vector: IslandVector;
  label?: string;
  size?: number;
  color?: string;
  compareVector?: IslandVector;
  compareLabel?: string;
  compareColor?: string;
}

export default function RadarChart({
  vector,
  label = "점수",
  size = 280,
  color = "#0D9488",
  compareVector,
  compareLabel = "비교",
  compareColor = "#F59E0B",
}: RadarChartProps) {
  const data = (Object.keys(DIMENSION_LABELS) as (keyof IslandVector)[]).map(
    (key) => ({
      dimension: DIMENSION_LABELS[key],
      value: Math.round(vector[key] * 100),
      ...(compareVector ? { compare: Math.round(compareVector[key] * 100) } : {}),
    })
  );

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fontSize: 11, fill: "#6B7280" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <Radar
          name={label}
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.25}
          strokeWidth={2}
        />
        {compareVector && (
          <Radar
            name={compareLabel}
            dataKey="compare"
            stroke={compareColor}
            fill={compareColor}
            fillOpacity={0.15}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        )}
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            fontSize: "12px",
          }}
          formatter={(value: number) => [`${value}점`, ""]}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
