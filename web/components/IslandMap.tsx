"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { Island, Cluster } from "@/lib/types";

interface IslandMapProps {
  islands: Island[];
  clusters: Cluster[];
  onSelectIsland: (island: Island) => void;
  selectedIsland: Island | null;
}

const statusColors: Record<string, string> = {
  green: "#22C55E",
  yellow: "#EAB308",
  red: "#EF4444",
};

export default function IslandMap({
  islands,
  clusters,
  onSelectIsland,
  selectedIsland,
}: IslandMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("island-map", {
      center: [34.5, 127.65],
      zoom: 10,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    islands.forEach((island) => {
      const cluster = clusters.find((c) => c.islands.includes(island.id));
      const clusterColor = cluster?.color || "#6B7280";
      const statusColor = statusColors[island.status];

      const marker = L.circleMarker([island.lat, island.lng], {
        radius: Math.max(6, Math.min(14, Math.sqrt(island.area) * 3)),
        fillColor: clusterColor,
        color: statusColor,
        weight: 3,
        opacity: 1,
        fillOpacity: 0.7,
      });

      const tooltip = L.tooltip({
        permanent: false,
        direction: "top",
        offset: [0, -10],
        className: "island-tooltip",
      }).setContent(`
        <div style="text-align:center;font-family:Pretendard,sans-serif;">
          <strong style="font-size:14px;">${island.name}</strong>
          <br/>
          <span style="font-size:11px;color:#666;">
            ${island.travelTime}분 · ${island.weather.temp}°C · ${island.weather.condition}
          </span>
        </div>
      `);

      marker.bindTooltip(tooltip);

      marker.on("click", () => {
        onSelectIsland(island);
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [islands, clusters, onSelectIsland]);

  useEffect(() => {
    if (!mapRef.current || !selectedIsland) return;
    mapRef.current.flyTo([selectedIsland.lat, selectedIsland.lng], 12, {
      duration: 0.8,
    });
  }, [selectedIsland]);

  return (
    <div
      id="island-map"
      className="w-full h-[500px] lg:h-[600px] rounded-2xl shadow-lg border border-gray-200"
    />
  );
}
