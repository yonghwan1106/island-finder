import { Island, FerrySchedule, Itinerary, ItineraryItem, PlannerInput } from "./types";

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}

function findFerry(schedules: FerrySchedule[], islandName: string): FerrySchedule | null {
  return schedules.find((s) =>
    s.route.includes(islandName) || s.route.toLowerCase().includes(islandName.toLowerCase())
  ) || null;
}

function findDepartureFerry(ferry: FerrySchedule, afterTime: number): string | null {
  for (const dep of ferry.departures) {
    if (timeToMinutes(dep) >= afterTime) return dep;
  }
  return null;
}

function findReturnFerry(ferry: FerrySchedule, beforeTime: number, stayMinutes: number, arrivalTime: number): string | null {
  const validDepartures = ferry.departures.filter((dep) => {
    const depMin = timeToMinutes(dep);
    return depMin >= arrivalTime + stayMinutes && depMin + ferry.duration <= beforeTime;
  });
  return validDepartures.length > 0 ? validDepartures[validDepartures.length - 1] : null;
}

function generateActivities(island: Island, arrivalTime: number, departureTime: number): ItineraryItem[] {
  const items: ItineraryItem[] = [];
  let currentTime = arrivalTime;

  items.push({
    time: minutesToTime(currentTime),
    activity: `${island.name} 도착`,
    location: island.ferryPort === "-" ? island.name : `${island.name} 선착장`,
    duration: 10,
    icon: "🚢",
  });
  currentTime += 10;

  const availableMinutes = departureTime - currentTime;
  const activityPool = [
    ...island.attractions.map((a) => ({ name: a, duration: 40, icon: "📸" })),
    ...(island.restaurants > 0
      ? [{ name: `${island.name} 맛집 탐방`, duration: 60, icon: "🍽️" }]
      : []),
    ...island.activities.map((a) => ({ name: a, duration: 50, icon: getActivityIcon(a) })),
  ];

  let usedMinutes = 0;
  for (const act of activityPool) {
    if (usedMinutes + act.duration > availableMinutes - 20) break;
    items.push({
      time: minutesToTime(currentTime),
      activity: act.name,
      location: island.name,
      duration: act.duration,
      icon: act.icon,
    });
    currentTime += act.duration;
    usedMinutes += act.duration;
  }

  items.push({
    time: minutesToTime(departureTime),
    activity: `${island.name} 출발`,
    location: island.ferryPort === "-" ? island.name : `${island.name} 선착장`,
    duration: 0,
    icon: "⛴️",
  });

  return items;
}

function getActivityIcon(activity: string): string {
  if (activity.includes("트레킹") || activity.includes("등산") || activity.includes("둘레길")) return "🥾";
  if (activity.includes("낚시")) return "🎣";
  if (activity.includes("해수욕") || activity.includes("스노클링")) return "🏊";
  if (activity.includes("일몰") || activity.includes("일출")) return "🌅";
  if (activity.includes("캠핑")) return "⛺";
  if (activity.includes("사진")) return "📷";
  if (activity.includes("카페")) return "☕";
  if (activity.includes("미식") || activity.includes("해산물")) return "🦐";
  if (activity.includes("문화") || activity.includes("역사") || activity.includes("탐방")) return "🏛️";
  return "🏝️";
}

export function generateItineraries(
  islands: Island[],
  ferrySchedules: FerrySchedule[],
  input: PlannerInput
): Itinerary[] {
  const depMinutes = timeToMinutes(input.departureTime);
  const retMinutes = timeToMinutes(input.returnTime);
  const results: Itinerary[] = [];

  for (const island of islands) {
    if (island.ferryFrequency === 0) {
      const stayMinutes = retMinutes - depMinutes - 30;
      if (stayMinutes < 60) continue;

      const schedule = generateActivities(island, depMinutes + 15, retMinutes - 15);
      results.push({
        island,
        schedule,
        totalTime: retMinutes - depMinutes,
        ferry: { route: "차량 이동", departures: [], duration: island.travelTime, fare: 0 },
        departureFerry: input.departureTime,
        returnFerry: input.returnTime,
      });
      continue;
    }

    const ferry = findFerry(ferrySchedules, island.name);
    if (!ferry) continue;

    const depFerry = findDepartureFerry(ferry, depMinutes);
    if (!depFerry) continue;

    const arrivalTime = timeToMinutes(depFerry) + ferry.duration;
    const minStay = 60;
    const retFerry = findReturnFerry(ferry, retMinutes, minStay, arrivalTime);
    if (!retFerry) continue;

    const schedule = generateActivities(island, arrivalTime, timeToMinutes(retFerry));
    const totalTime = timeToMinutes(retFerry) + ferry.duration - timeToMinutes(depFerry);

    results.push({
      island,
      schedule,
      totalTime,
      ferry,
      departureFerry: depFerry,
      returnFerry: retFerry,
    });
  }

  return results
    .sort((a, b) => {
      const prefScore = (it: Itinerary) =>
        input.preferences.reduce((sum, pref) => {
          const key = pref as keyof typeof it.island.vector;
          return sum + (it.island.vector[key] || 0);
        }, 0);
      return prefScore(b) - prefScore(a);
    })
    .slice(0, 5);
}
