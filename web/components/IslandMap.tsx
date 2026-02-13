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
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const highlightLayerRef = useRef<L.CircleMarker | null>(null);
  const pulseIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      if (pulseIntervalRef.current) {
        clearInterval(pulseIntervalRef.current);
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

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
      markersRef.current.set(island.id, marker);
    });
  }, [islands, clusters, onSelectIsland]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Cleanup previous highlight
    if (highlightLayerRef.current) {
      mapRef.current.removeLayer(highlightLayerRef.current);
      highlightLayerRef.current = null;
    }
    if (pulseIntervalRef.current) {
      clearInterval(pulseIntervalRef.current);
      pulseIntervalRef.current = null;
    }

    // Reset all markers to default size
    markersRef.current.forEach((marker, islandId) => {
      const island = islands.find((i) => i.id === islandId);
      if (island) {
        marker.setRadius(Math.max(6, Math.min(14, Math.sqrt(island.area) * 3)));
      }
    });

    if (selectedIsland) {
      // Fly to selected island
      mapRef.current.flyTo([selectedIsland.lat, selectedIsland.lng], 12, {
        duration: 0.8,
      });

      // Increase selected marker size
      const selectedMarker = markersRef.current.get(selectedIsland.id);
      if (selectedMarker) {
        const baseRadius = Math.max(6, Math.min(14, Math.sqrt(selectedIsland.area) * 3));
        selectedMarker.setRadius(baseRadius + 4);
      }

      // Create pulsing ring effect
      const highlightRing = L.circleMarker([selectedIsland.lat, selectedIsland.lng], {
        radius: 20,
        fillColor: "#14b8a6",
        color: "#0d9488",
        weight: 3,
        opacity: 0.8,
        fillOpacity: 0.2,
      });

      highlightRing.addTo(mapRef.current);
      highlightLayerRef.current = highlightRing;

      // Pulse animation
      let opacityValue = 0.8;
      let direction = -1;
      pulseIntervalRef.current = setInterval(() => {
        opacityValue += direction * 0.1;
        if (opacityValue <= 0.2) {
          opacityValue = 0.2;
          direction = 1;
        } else if (opacityValue >= 0.8) {
          opacityValue = 0.8;
          direction = -1;
        }
        if (highlightLayerRef.current) {
          highlightLayerRef.current.setStyle({
            opacity: opacityValue,
            fillOpacity: opacityValue * 0.5,
          });
        }
      }, 100);
    }
  }, [selectedIsland, islands]);

  return (
    <div
      id="island-map"
      className="w-full h-[500px] lg:h-[600px] rounded-2xl shadow-lg border border-gray-200"
    />
  );
}
