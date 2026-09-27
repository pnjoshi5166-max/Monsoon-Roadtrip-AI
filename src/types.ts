/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabType = 'forecast' | 'live-radar-map' | 'safe-navigator' | 'community-alerts' | 'gee-blueprint';

export interface WeatherStationData {
  stationId: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  tempC: number;
  feelsLikeC: number;
  condition: string;
  conditionDescription: string;
  rain24hMm: number;
  rainRateMmH: number;
  barometerHpa: number;
  barometerTrend: 'rapid_fall' | 'steady' | 'rising';
  windSpeedKmh: number;
  windDirection: string;
  windGustsKmh: number;
  relativeHumidity: number;
  dewPointC: number;
  updatedMinsAgo: number;
}

export interface HourlyForecast {
  timeLabel: string;
  tempC: number;
  precipitationProb: number;
  rainMmH: number;
  icon: string;
}

export interface MetroWeatherItem {
  id: string;
  metro: string;
  station: string;
  region: 'west' | 'north' | 'east' | 'south';
  tempC: number;
  condition: string;
  subtext: string;
  alertLevel: 'green' | 'yellow' | 'red';
  alertLabel: string;
  icon: string;
}

export interface GhatPassStatus {
  id: string;
  name: string;
  state: string;
  status: 'normal' | 'caution' | 'critical';
  statusText: string;
  notes: string;
  coordinates: { lat: number; lng: number };
  elevationMeters: number;
  rainfall24h: number;
  fogVisibilityMeters: number;
}

export interface ScenicDestination {
  id: string;
  name: string;
  safetyScore: number;
  description: string;
  rainfallMm: number;
  driveStatus: string;
  tagColor: 'emerald' | 'yellow' | 'red';
  coordinates: { lat: number; lng: number };
}

export interface DailyForecast {
  dayLabel: string;
  intensityLabel: string;
  intensityColor: 'red' | 'yellow' | 'emerald';
  rainRangeMm: string;
  highTemp: number;
  lowTemp: number;
  icon: string;
}

export interface WaterloggingAlert {
  id: string;
  title: string;
  subLocation: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
  waterDepthCm: number;
  severity: 'low' | 'moderate' | 'severe' | 'impassable';
  passableFor: 'all' | 'suv_only' | 'high_clearance_only' | 'closed';
  reportedAtMinsAgo: number;
  verifiedCount: number;
  userVoted?: 'up' | 'down';
  notes: string;
  hazardType: 'waterlogging' | 'flash_flood' | 'landslide' | 'submerged_culvert' | 'fallen_tree';
  elevationM: number;
  heightAboveDrainageM: number; // HAND index
}

export interface MonsoonRoutePreset {
  id: string;
  name: string;
  origin: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  riskLevel: 'high' | 'moderate' | 'safe';
  primaryHighway: string;
  alternateCorridor: string;
  distanceKm: number;
  estTimeHours: string;
  riskDescription: string;
  waterloggedPointsCount: number;
  landslideZonesCount: number;
  safeRouteDetails: {
    via: string;
    extraMinutes: number;
    passOpenPercentage: number;
    safetyFactor: string;
  };
}

export interface GeeLayerConfig {
  id: string;
  name: string;
  description: string;
  datasetId: string;
  satellite: string;
  active: boolean;
  opacity: number;
  colorScale: string;
  resolution: string;
  latency: string;
}
