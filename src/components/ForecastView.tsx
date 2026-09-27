/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CURRENT_STATION_DATA,
  HOURLY_FORECASTS,
  METRO_WEATHER_ITEMS,
  GHAT_PASS_STATUSES,
  SCENIC_DESTINATIONS,
  DAILY_FORECASTS,
} from '../services/mockData';
import {
  Droplets,
  Wind,
  Gauge,
  Compass,
  Zap,
  Waves,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  ChevronRight,
  Radio,
  Car,
  Activity,
} from 'lucide-react';

interface ForecastViewProps {
  onNavigateToMap: () => void;
  onNavigateToRouting: (presetId?: string) => void;
  onNavigateToAlerts: () => void;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  onNavigateToMap,
  onNavigateToRouting,
  onNavigateToAlerts,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredMetros =
    selectedRegion === 'all'
      ? METRO_WEATHER_ITEMS
      : METRO_WEATHER_ITEMS.filter((item) => item.region === selectedRegion);

  return (
    <div className="flex flex-col w-full space-y-4 pb-20">
      {/* IMD Critical Warning Capsule */}
      <div className="w-full rounded-xl bg-[#ff2a55]/15 border border-[#ff2a55]/40 p-3.5 shadow-[0_0_24px_rgba(255,42,85,0.25)] relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-[#ff2a55]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-start gap-2.5 relative z-10">
          <div className="mt-0.5 flex-shrink-0 relative">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2a55] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff2a55]"></span>
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] text-[#ff2a55] tracking-wider uppercase font-bold bg-[#ff2a55]/20 px-1.5 py-0.5 rounded border border-[#ff2a55]/40">
                IMD RED ALERT
              </span>
              <span className="text-xs text-[#9cb4be]">• Valid Next 18h</span>
            </div>
            <p className="text-xs text-[#ffe8eb] font-medium mt-1 leading-snug">
              Extremely heavy rainfall (&gt;204.4 mm) forecasted across Mumbai, Thane, Raigad & Ratnagiri. Active coastal convergence with high tides reaching 4.38m.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Telemetry Panel: Santacruz AWS Station */}
      <div className="w-full rounded-xl bg-[#111722]/85 border border-[#2b3846]/40 backdrop-blur-2xl p-4 shadow-xl relative overflow-hidden">
        {/* Atmospheric Ambient Glows: Cyan & Neon Emerald */}
        <div className="absolute -top-16 -right-12 w-48 h-48 bg-[#00f0ff]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-[#00ff88]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col space-y-3.5">
          {/* Location Header & Station Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-[#00f0ff] animate-pulse" />
              <span className="font-mono text-[11px] text-[#00f0ff] font-bold uppercase tracking-wider">
                {CURRENT_STATION_DATA.name}
              </span>
            </div>
            <span className="font-mono text-[9px] text-[#9cb4be] bg-[#1e2634] px-1.5 py-0.5 rounded border border-[#2b3846]/50">
              Updated {CURRENT_STATION_DATA.updatedMinsAgo}m ago
            </span>
          </div>

          {/* Condition & Temperature Readout */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#f0f4fc]">
                  {CURRENT_STATION_DATA.tempC}°
                </span>
                <span className="text-base text-[#9cb4be] font-medium">C</span>
              </div>
              <p className="text-xs text-[#00dbe9] font-medium mt-0.5">
                Feels like {CURRENT_STATION_DATA.feelsLikeC}°C • {CURRENT_STATION_DATA.condition}
              </p>
              <p className="text-[11px] text-[#9cb4be] mt-0.5">
                {CURRENT_STATION_DATA.conditionDescription}
              </p>
            </div>

            {/* Visual Storm Cluster SVG */}
            <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-[#00f0ff]/10 animate-pulse"></div>
              <svg className="w-16 h-16 drop-shadow-[0_0_14px_rgba(0,240,255,0.45)]" fill="none" viewBox="0 0 64 64">
                <path
                  d="M46 36c3.3 0 6-2.7 6-6 0-3.1-2.4-5.7-5.5-6-.9-4.6-5-8-9.8-8-4 0-7.4 2.3-9 5.7-1.3-.8-2.9-1.2-4.7-1.2-4.4 0-8 3.6-8 8 0 .4 0 .9.1 1.3C12.4 30.6 10 33 10 36c0 3.3 2.7 6 6 6h30z"
                  fill="#00F0FF"
                  fillOpacity="0.85"
                />
                <path
                  className="animate-bounce"
                  d="M30 33l-5 9h7l-3 10 11-12h-7l4-7h-7z"
                  fill="#FFE600"
                  style={{ animationDuration: '2s' }}
                />
                <line stroke="#7DF4FF" strokeLinecap="round" strokeWidth="2.5" x1="20" x2="16" y1="46" y2="54" />
                <line stroke="#7DF4FF" strokeLinecap="round" strokeWidth="2.5" x1="38" x2="34" y1="46" y2="54" />
              </svg>
            </div>
          </div>

          {/* Rapid Telemetry 4-Pill Bento */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* 24h Rain Accumulation */}
            <div className="bg-[#161d28]/90 border border-[#2b3846]/40 rounded-lg p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#9cb4be] uppercase tracking-wider font-semibold">
                  Rain (24h)
                </span>
                <Droplets className="w-3.5 h-3.5 text-[#00f0ff]" />
              </div>
              <div className="mt-1">
                <span className="font-mono text-lg font-bold text-[#00f0ff]">
                  {CURRENT_STATION_DATA.rain24hMm}
                </span>
                <span className="text-[10px] text-[#9cb4be]"> mm</span>
              </div>
              <span className="font-mono text-[10px] text-[#ff2a55] mt-0.5 font-bold">
                Torrential (+{CURRENT_STATION_DATA.rainRateMmH} mm/h)
              </span>
            </div>

            {/* Barometric Pressure & Trend */}
            <div className="bg-[#161d28]/90 border border-[#2b3846]/40 rounded-lg p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#9cb4be] uppercase tracking-wider font-semibold">
                  Barometer
                </span>
                <TrendingDown className="w-3.5 h-3.5 text-[#ff2a55]" />
              </div>
              <div className="mt-1">
                <span className="font-mono text-lg font-bold text-[#f0f4fc]">
                  {CURRENT_STATION_DATA.barometerHpa}
                </span>
                <span className="text-[10px] text-[#9cb4be]"> hPa</span>
              </div>
              <span className="font-mono text-[10px] text-[#ff2a55] mt-0.5 font-bold">
                Rapid Fall (Stormy)
              </span>
            </div>

            {/* Wind Speed & Direction */}
            <div className="bg-[#161d28]/90 border border-[#2b3846]/40 rounded-lg p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#9cb4be] uppercase tracking-wider font-semibold">
                  Wind Vector
                </span>
                <Compass className="w-3.5 h-3.5 text-[#00ff88]" />
              </div>
              <div className="mt-1">
                <span className="font-mono text-lg font-bold text-[#f0f4fc]">
                  {CURRENT_STATION_DATA.windSpeedKmh}
                </span>
                <span className="text-[10px] text-[#9cb4be]"> km/h</span>
              </div>
              <span className="font-mono text-[10px] text-[#9cb4be] mt-0.5">
                {CURRENT_STATION_DATA.windDirection} • Gusts {CURRENT_STATION_DATA.windGustsKmh} km/h
              </span>
            </div>

            {/* Relative Humidity & Dew Point */}
            <div className="bg-[#161d28]/90 border border-[#2b3846]/40 rounded-lg p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#9cb4be] uppercase tracking-wider font-semibold">
                  Rel Humidity
                </span>
                <Gauge className="w-3.5 h-3.5 text-[#00ff88]" />
              </div>
              <div className="mt-1">
                <span className="font-mono text-lg font-bold text-[#00ff88]">
                  {CURRENT_STATION_DATA.relativeHumidity}%
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#9cb4be] mt-0.5">
                Dew Point {CURRENT_STATION_DATA.dewPointC}°C
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Live Doppler Mini Viewer */}
      <div className="w-full rounded-xl bg-[#111722]/85 border border-[#2b3846]/40 backdrop-blur-xl p-3.5 shadow-lg flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="font-heading text-sm font-semibold text-[#f0f4fc]">Doppler Radar</h2>
            <span className="font-mono text-[9px] bg-[#283244] px-1.5 py-0.5 rounded text-[#00f0ff] uppercase font-bold">
              DWR Veravali
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#00f0ff] uppercase font-bold tracking-wider animate-pulse">
            LIVE SWEEP
          </span>
        </div>

        {/* Map Radar Card with High-Contrast Synthetic Doppler Echo Contours */}
        <div
          onClick={onNavigateToMap}
          className="w-full h-44 rounded-lg bg-[#06090f] border border-[#2b3846]/40 relative overflow-hidden flex flex-col justify-between p-2.5 cursor-pointer group hover:border-[#00f0ff]/50 transition-colors"
        >
          {/* Radar Sweeping Ray Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-[300px] h-[300px] absolute -top-[70px] left-[calc(50%-150px)] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(0,240,255,0.25)_360deg)] animate-radar-sweep"></div>
          </div>

          {/* Synthetic Doppler Echo Contours: Cyan -> Yellow -> Red */}
          <svg className="absolute inset-0 w-full h-full opacity-80 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 300 160">
            <circle cx="150" cy="80" fill="none" r="35" stroke="rgba(0, 240, 255, 0.25)" strokeDasharray="3 3" strokeWidth="1" />
            <circle cx="150" cy="80" fill="none" r="70" stroke="rgba(0, 240, 255, 0.18)" strokeDasharray="3 3" strokeWidth="1" />
            <circle cx="150" cy="80" fill="none" r="105" stroke="rgba(0, 240, 255, 0.12)" strokeWidth="1" />

            {/* Konkan Rain Band Echoes */}
            <path d="M110,20 Q160,70 140,150" filter="blur(6px)" opacity="0.4" stroke="#00F0FF" strokeLinecap="round" strokeWidth="20" />
            <path d="M125,40 Q155,85 145,130" filter="blur(4px)" opacity="0.6" stroke="#FFE600" strokeLinecap="round" strokeWidth="14" />
            <path d="M132,60 Q150,90 142,110" filter="blur(2px)" opacity="0.8" stroke="#FF2A55" strokeLinecap="round" strokeWidth="8" />
          </svg>

          {/* Overlay Station Ping */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-[#06090f]/90 border border-[#2b3846]/50 backdrop-blur-md px-2 py-0.5 rounded text-[#00f0ff] font-mono text-[10px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a55] animate-ping"></span>
              <span className="font-bold">INTENSE SQUALL CELL (55 dBZ)</span>
            </div>
            <span className="bg-[#06090f]/90 border border-[#2b3846]/50 backdrop-blur-md px-2 py-0.5 rounded text-[#9cb4be] font-mono text-[9px]">
              Range: 150 km
            </span>
          </div>

          {/* Radar dBZ Legend */}
          <div className="relative z-10 bg-[#06090f]/90 border border-[#2b3846]/50 backdrop-blur-md px-2.5 py-1 rounded flex items-center justify-between gap-2">
            <span className="font-mono text-[9px] text-[#00f0ff] font-bold">20 dBZ Light</span>
            <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-[#00f0ff] via-[#00ff88] via-[#ffe600] to-[#ff2a55]"></div>
            <span className="font-mono text-[9px] text-[#ff2a55] font-bold">65 dBZ Severe</span>
          </div>
        </div>

        {/* Expand Live Radar Map Action Button */}
        <button
          onClick={onNavigateToMap}
          className="w-full h-10 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002428] rounded-lg font-heading text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(0,240,255,0.4)] active:scale-[0.99] transition-transform"
        >
          <Activity className="w-4 h-4" />
          <span>Expand Interactive Doppler & Cloud Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hourly Monsoon Downpour Timeline (Next 24h) */}
      <div className="w-full flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-[#00ff88]" />
            <h2 className="font-heading text-sm font-semibold text-[#f0f4fc]">
              Hourly Precipitation
            </h2>
          </div>
          <span className="text-xs text-[#00f0ff] font-medium">Next 24 Hours</span>
        </div>

        {/* Horizontal Hourly Cards Carousel */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
          {HOURLY_FORECASTS.map((hour, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 w-20 rounded-xl p-2.5 flex flex-col items-center justify-between ${
                idx === 0
                  ? 'bg-[#1e2634] border border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                  : 'bg-[#111722]/80 border border-[#2b3846]/30'
              }`}
            >
              <span className="font-mono text-[10px] text-[#00f0ff] font-bold uppercase">
                {hour.timeLabel}
              </span>
              <Droplets className="w-5 h-5 text-[#00f0ff] my-1" />
              <span className="text-xs text-[#f0f4fc] font-bold">{hour.tempC}°</span>
              <div className="w-full bg-[#283244] rounded-full h-1.5 my-1.5 overflow-hidden">
                <div
                  className="bg-[#00f0ff] h-full"
                  style={{ width: `${hour.precipitationProb}%` }}
                ></div>
              </div>
              <span className="font-mono text-[10px] text-[#00f0ff] font-bold">
                {hour.precipitationProb}%
              </span>
              <span className="font-mono text-[9px] text-[#9cb4be]">{hour.rainMmH}mm/h</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lightning & Municipal Flood Telemetry Dual Bento */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Lightning Strike Detection */}
        <div className="bg-[#111722]/80 border border-[#2b3846]/40 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-[#9cb4be] uppercase tracking-wider font-semibold">
              Lightning (30m)
            </span>
            <Zap className="w-4 h-4 text-[#ff2a55]" />
          </div>
          <div className="my-1">
            <span className="font-mono text-lg font-bold text-[#f0f4fc]">142</span>
            <span className="text-xs text-[#ff2a55] font-bold"> Strikes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff2a55] animate-ping"></span>
            <span className="font-mono text-[9px] text-[#ff2a55] font-bold">
              HIGH RISK (&lt;15 km)
            </span>
          </div>
        </div>

        {/* Municipal Road Inundation Index */}
        <div
          onClick={onNavigateToAlerts}
          className="bg-[#111722]/80 border border-[#2b3846]/40 rounded-xl p-3 flex flex-col justify-between cursor-pointer hover:border-[#00f0ff]/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-[#9cb4be] uppercase tracking-wider font-semibold">
              Waterlogging
            </span>
            <Waves className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div className="my-1">
            <span className="font-mono text-lg font-bold text-[#f0f4fc]">7</span>
            <span className="text-xs text-[#00f0ff]"> Nodes Flooded</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono text-[9px] text-[#00f0ff] font-medium truncate">
              Hindmata, Milan Subway
            </span>
          </div>
        </div>
      </div>

      {/* Regional Weather Watch: Key Indian Metros */}
      <div className="w-full flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="font-heading text-sm font-semibold text-[#f0f4fc]">
              Subcontinent Regional Grid
            </h2>
          </div>
          <span className="font-mono text-[9px] text-[#9cb4be] uppercase tracking-wider">
            IMD LIVE AWS
          </span>
        </div>

        {/* Quick Regional Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'All India' },
            { id: 'west', label: 'Konkan & West' },
            { id: 'north', label: 'North Plains' },
            { id: 'east', label: 'Bay & East' },
            { id: 'south', label: 'Peninsula' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRegion(tab.id)}
              className={`px-3 py-1 rounded-full font-mono text-[10px] whitespace-nowrap font-bold transition-all ${
                selectedRegion === tab.id
                  ? 'bg-[#00f0ff] text-[#002428] shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'bg-[#161d28] border border-[#2b3846]/30 text-[#9cb4be] hover:text-[#f0f4fc]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Metro Telemetry Stack */}
        <div className="flex flex-col space-y-2">
          {filteredMetros.map((item) => (
            <div
              key={item.id}
              className="w-full bg-[#111722]/80 border border-[#2b3846]/40 rounded-xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg bg-[#161d28] border border-[#2b3846]/40 flex items-center justify-center ${
                    item.alertLevel === 'red'
                      ? 'text-[#ff2a55]'
                      : item.alertLevel === 'yellow'
                      ? 'text-[#ffe600]'
                      : 'text-[#00ff88]'
                  }`}
                >
                  <Droplets className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-semibold text-[#f0f4fc]">
                      {item.metro}
                    </span>
                    <span className="font-mono text-[9px] text-[#9cb4be]">{item.station}</span>
                  </div>
                  <span className="text-[11px] text-[#9cb4be]">{item.subtext}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-sm font-bold text-[#f0f4fc]">
                  {item.tempC}°C
                </span>
                <span
                  className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase mt-0.5 border ${
                    item.alertLevel === 'red'
                      ? 'bg-[#ff2a55]/20 border-[#ff2a55]/50 text-[#ff2a55] shadow-[0_0_8px_rgba(255,42,85,0.25)]'
                      : item.alertLevel === 'yellow'
                      ? 'bg-[#ffe600]/15 border-[#ffe600]/40 text-[#ffe600]'
                      : 'bg-[#00ff88]/20 border-[#00ff88]/40 text-[#00ff88]'
                  }`}
                >
                  {item.alertLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monsoon Roadtrip & Safe Travel Advisory Section */}
      <div className="w-full flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Car className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="font-heading text-sm font-semibold text-[#f0f4fc]">
              Monsoon Roadtrip & Travel Advisory
            </h2>
          </div>
          <span className="font-mono text-[9px] bg-[#283244] px-1.5 py-0.5 rounded text-[#00f0ff] font-bold uppercase tracking-wider">
            IMD x NHAI Live
          </span>
        </div>

        {/* Active Critical Highway Warning & Alternate Route Card */}
        <div className="w-full rounded-xl bg-[#111722]/80 border border-[#2b3846]/40 backdrop-blur-xl p-3 flex flex-col space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#ff2a55] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-[#f0f4fc]">
                Mumbai — Goa (NH-66 / Kashedi)
              </span>
            </div>
            <span className="font-mono text-[9px] bg-[#ff2a55]/20 border border-[#ff2a55]/40 text-[#ff2a55] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              High Alert
            </span>
          </div>

          <p className="text-xs text-[#ffe8eb] bg-[#ff2a55]/15 border border-[#ff2a55]/30 p-2 rounded leading-snug">
            Flash Flood & Landslide Risk near Chiplun & Parshuram Ghat. Intermittent waterlogging and tree falls reported. Non-essential travel discouraged.
          </p>

          {/* Recommended Alternate Route */}
          <div
            onClick={() => onNavigateToRouting('mumbai-goa')}
            className="bg-[#161d28]/90 border border-[#2b3846]/40 p-2 rounded-lg flex items-center justify-between gap-2 cursor-pointer hover:border-[#00ff88]/50 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <ShieldCheck className="w-4 h-4 text-[#00ff88] flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[9px] text-[#00ff88] font-bold uppercase">
                  Recommended Safe Corridor
                </span>
                <span className="text-xs text-[#f0f4fc] truncate">
                  Via Pune • Kolhapur • Karwar (NH-48)
                </span>
              </div>
            </div>
            <span className="font-mono text-[9px] bg-[#00ff88]/20 border border-[#00ff88]/40 text-[#00ff88] px-1.5 py-0.5 rounded whitespace-nowrap font-bold">
              +45m • 100% Ghat Pass Open
            </span>
          </div>
        </div>

        {/* Ghat Corridor Status Matrix */}
        <div className="grid grid-cols-3 gap-2">
          {GHAT_PASS_STATUSES.slice(0, 3).map((ghat) => (
            <div
              key={ghat.id}
              className="bg-[#111722]/80 border border-[#2b3846]/40 rounded-lg p-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#f0f4fc] font-semibold truncate">
                  {ghat.name}
                </span>
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    ghat.status === 'normal'
                      ? 'bg-[#00ff88]'
                      : ghat.status === 'caution'
                      ? 'bg-[#ffe600]'
                      : 'bg-[#ff2a55]'
                  }`}
                ></span>
              </div>
              <span
                className={`text-xs font-bold mt-1 ${
                  ghat.status === 'normal'
                    ? 'text-[#00ff88]'
                    : ghat.status === 'caution'
                    ? 'text-[#ffe600]'
                    : 'text-[#ff2a55]'
                }`}
              >
                {ghat.statusText}
              </span>
              <span className="font-mono text-[9px] text-[#9cb4be] truncate">
                {ghat.notes}
              </span>
            </div>
          ))}
        </div>

        {/* Safe Monsoon Scenic Destinations */}
        <div className="flex flex-col space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-[#9cb4be] uppercase tracking-wider font-semibold">
              Scenic Monsoon Getaways
            </span>
            <span className="font-mono text-[10px] text-[#00f0ff] font-bold">
              Live Safety Index
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {SCENIC_DESTINATIONS.map((dest) => (
              <div
                key={dest.id}
                className="flex-shrink-0 w-44 bg-[#111722]/80 border border-[#2b3846]/40 rounded-xl p-2.5 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-[#f0f4fc] truncate">
                    {dest.name}
                  </span>
                  <span
                    className={`font-mono text-[9px] px-1 py-0.5 rounded font-bold border ${
                      dest.tagColor === 'emerald'
                        ? 'bg-[#00ff88]/20 border-[#00ff88]/40 text-[#00ff88]'
                        : 'bg-[#ffe600]/20 border-[#ffe600]/40 text-[#ffe600]'
                    }`}
                  >
                    Safe {dest.safetyScore}
                  </span>
                </div>
                <p className="text-[11px] text-[#9cb4be] mt-1 leading-tight line-clamp-2">
                  {dest.description}
                </p>
                <div className="mt-2 pt-1.5 border-t border-[#2b3846]/30 flex items-center justify-between text-[#9cb4be]">
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-[#00f0ff]" />
                    <span className="font-mono text-[9px] text-[#00f0ff] font-bold">
                      {dest.rainfallMm} mm
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[9px] font-bold ${
                      dest.tagColor === 'emerald' ? 'text-[#00ff88]' : 'text-[#ffe600]'
                    }`}
                  >
                    {dest.driveStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Alternate Safe Roadtrip Button */}
        <button
          onClick={() => onNavigateToRouting('mumbai-goa')}
          className="w-full h-10 bg-[#1e2634] hover:bg-[#283244] text-[#00f0ff] border border-[#00f0ff]/40 rounded-lg font-heading text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-[0_0_12px_rgba(0,240,255,0.15)]"
        >
          <Car className="w-4 h-4" />
          <span>Simulate Safe Monsoon Route & Waterlogging Avoidance</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 7-Day Monsoon Outlook */}
      <div className="w-full flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="font-heading text-sm font-semibold text-[#f0f4fc]">
              7-Day Monsoon Outlook
            </h2>
          </div>
          <span className="font-mono text-[9px] text-[#9cb4be] uppercase tracking-wider">
            West Coast Surge
          </span>
        </div>

        <div className="w-full bg-[#111722]/80 border border-[#2b3846]/40 rounded-xl p-3 flex flex-col space-y-2 divide-y-0">
          {DAILY_FORECASTS.map((day, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 border-b border-[#2b3846]/20 last:border-b-0">
              <div className="w-24">
                <p className="text-xs font-bold text-[#f0f4fc]">{day.dayLabel}</p>
                <span
                  className={`font-mono text-[9px] font-bold uppercase ${
                    day.intensityColor === 'red'
                      ? 'text-[#ff2a55]'
                      : day.intensityColor === 'yellow'
                      ? 'text-[#ffe600]'
                      : 'text-[#00ff88]'
                  }`}
                >
                  {day.intensityLabel}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-1 justify-center">
                <Droplets
                  className={`w-4 h-4 ${
                    day.intensityColor === 'red'
                      ? 'text-[#ff2a55]'
                      : day.intensityColor === 'yellow'
                      ? 'text-[#ffe600]'
                      : 'text-[#00ff88]'
                  }`}
                />
                <span className="font-mono text-xs text-[#00f0ff] font-semibold">
                  {day.rainRangeMm}
                </span>
              </div>
              <div className="flex items-center gap-2 text-right w-20 justify-end">
                <span className="font-mono text-xs font-semibold text-[#f0f4fc]">
                  {day.highTemp}°
                </span>
                <span className="font-mono text-[10px] text-[#9cb4be]">{day.lowTemp}°</span>
                <span
                  className={`w-2 h-2 rounded-full ml-1 ${
                    day.intensityColor === 'red'
                      ? 'bg-[#ff2a55]'
                      : day.intensityColor === 'yellow'
                      ? 'bg-[#ffe600]'
                      : 'bg-[#00ff88]'
                  }`}
                ></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IMD Scientific Metadata Footer Capsule */}
      <div className="w-full bg-[#111722]/80 border border-[#2b3846]/40 rounded-lg p-2.5 flex items-center justify-between text-[#9cb4be]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span className="font-mono text-[9px]">
            Data: IMD INSAT-3DR / DWR Western Region AWS
          </span>
        </div>
        <span className="font-mono text-[9px] text-[#00f0ff] font-bold">Refresh 10s</span>
      </div>
    </div>
  );
};
