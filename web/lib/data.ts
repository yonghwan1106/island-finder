import islandData from "@/data/islands.json";
import { IslandData } from "./types";

export function getIslandData(): IslandData {
  return islandData as IslandData;
}

export function getIslandById(id: string) {
  const data = getIslandData();
  return data.islands.find((i) => i.id === id) || null;
}

export function getClusterById(id: string) {
  const data = getIslandData();
  return data.clusters.find((c) => c.id === id) || null;
}

export function getIslandsByCluster(clusterId: string) {
  const data = getIslandData();
  const cluster = data.clusters.find((c) => c.id === clusterId);
  if (!cluster) return [];
  return data.islands.filter((i) => cluster.islands.includes(i.id));
}
