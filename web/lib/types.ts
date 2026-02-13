export interface IslandVector {
  accessibility: number;
  nature: number;
  culture: number;
  food: number;
  activity: number;
  accommodation: number;
  tranquility: number;
  family: number;
}

export interface Weather {
  temp: number;
  condition: string;
  wind: number;
  wave: number;
}

export interface MarineEnvironment {
  seaTemp: number;
  waterQuality: number;
  transparency: number;
  dissolvedOxygen: number;
}

export interface Festival {
  name: string;
  period: string;
  description: string;
}

export interface Island {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  lat: number;
  lng: number;
  area: number;
  population: number;
  agingRate: number;
  travelTime: number;
  ferryFrequency: number;
  ferryPort: string;
  ferryName: string;
  attractions: string[];
  restaurants: number;
  accommodations: number;
  culturalSites: string[];
  activities: string[];
  bestSeason: string;
  vector: IslandVector;
  cluster: string;
  status: "green" | "yellow" | "red";
  nextFerry: string;
  weather: Weather;
  marine: MarineEnvironment;
  festivals: Festival[];
  hashtags: string[];
}

export interface Cluster {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  color: string;
  icon: string;
  islands: string[];
}

export interface FerrySchedule {
  route: string;
  departures: string[];
  duration: number;
  fare: number;
}

export interface QuizOption {
  label: string;
  value: string;
  vector: Partial<IslandVector>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface IslandData {
  metadata: {
    source: string;
    region: string;
    totalIslands: number;
    lastUpdated: string;
    dimensions: string[];
  };
  islands: Island[];
  clusters: Cluster[];
  ferrySchedules: FerrySchedule[];
  quizQuestions: QuizQuestion[];
}

export interface RecommendResult {
  island: Island;
  score: number;
  matchPercent: number;
  reasons: string[];
}

export interface PlannerInput {
  departureTime: string;
  returnTime: string;
  groupSize: number;
  preferences: string[];
  stayType: "daytrip" | "onenight" | "extended";
}

export interface Itinerary {
  island: Island;
  schedule: ItineraryItem[];
  totalTime: number;
  ferry: FerrySchedule;
  departureFerry: string;
  returnFerry: string;
}

export interface ItineraryItem {
  time: string;
  activity: string;
  location: string;
  duration: number;
  icon: string;
}
