/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CloudRain, Bell, Navigation, Search, AlertTriangle, Layers } from 'lucide-react';

interface HeaderProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  onOpenGeeBlueprint: () => void;
  unreadAlertsCount: number;
}

const CITIES = [
  'Mumbai, Maharashtra',
  'Pune, Maharashtra',
  'Goa (Panaji)',
  'Bengaluru, Karnataka',
  'Delhi NCR',
  'Kolkata, West Bengal',
  'Kochi, Kerala',
  'Shimla, Himachal Pradesh',
];

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  onOpenGeeBlueprint,
  unreadAlertsCount,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#06090f]/95 backdrop-blur-xl border-b border-[#2b3846]/40 shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
      <div className="px-4 py-2.5 flex flex-col justify-between space-y-2">
        {/* Top Branding Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <CloudRain className="w-5 h-5 text-[#00f0ff] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-lg font-bold tracking-tight text-[#00f0ff]">
                  Varsha Live
                </span>
                <span className="text-[#6d868f] text-xs">•</span>
                <span className="font-mono text-[10px] text-[#9cb4be] uppercase tracking-wider font-semibold">
                  Monsoon OS
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
                </span>
                <span className="font-mono text-[10px] text-[#00f0ff] font-bold uppercase tracking-wider">
                  IMD INSAT-3D • GEE RADAR LIVE
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* GEE Blueprint Architecture Trigger */}
            <button
              onClick={onOpenGeeBlueprint}
              title="View Google Earth Engine Harmonization Architecture"
              className="px-2.5 py-1.5 rounded-lg bg-[#161d28] border border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#1e2634] text-xs font-mono flex items-center gap-1.5 transition-colors shadow-[0_0_8px_rgba(0,240,255,0.2)]"
            >
              <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span className="hidden sm:inline font-bold">GEE Pipeline</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#161d28] border border-[#2b3846]/60 text-[#f0f4fc] hover:text-[#00f0ff] transition-colors"
                title="Active Weather & Flood Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2a55] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff2a55]"></span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Location Selector Bar */}
        <div className="relative">
          <div className="flex items-center justify-between gap-2 bg-[#111722]/90 border border-[#2b3846]/50 px-3 py-1.5 rounded-lg">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 flex-1 text-left"
            >
              <Navigation className="w-4 h-4 text-[#00f0ff] flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#f0f4fc] font-semibold truncate font-sans">
                {currentCity}
              </span>
              <span className="text-[10px] text-[#6d868f]">▼</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] bg-[#283244] px-1.5 py-0.5 rounded text-[#00f0ff] font-bold tracking-wider">
                AUTO GPS
              </span>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-6 h-6 flex items-center justify-center text-[#9cb4be] hover:text-[#00f0ff]"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-[#111722] border border-[#00f0ff]/30 rounded-lg shadow-2xl py-1 z-50 backdrop-blur-xl">
              <div className="px-3 py-1 text-[10px] font-mono text-[#00f0ff] uppercase tracking-wider font-semibold border-b border-[#2b3846]/40">
                Select Active Meteorological Zone
              </div>
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onSelectCity(city);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                    city === currentCity
                      ? 'bg-[#00f0ff]/15 text-[#00f0ff] font-semibold'
                      : 'text-[#f0f4fc] hover:bg-[#161d28]'
                  }`}
                >
                  <span>{city}</span>
                  {city === currentCity && <span className="text-[10px] text-[#00f0ff] font-mono">ACTIVE</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live IMD Critical Warning Ticker */}
      <div className="h-7 bg-[#06090f] border-t border-[#2b3846]/30 px-4 flex items-center overflow-hidden">
        <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto no-scrollbar py-0.5">
          <AlertTriangle className="w-3.5 h-3.5 text-[#ff2a55] flex-shrink-0 animate-bounce" />
          <span className="font-mono text-[10px] text-[#ff2a55] tracking-wider uppercase font-bold">
            IMD BULLETIN:
          </span>
          <span className="text-[11px] text-[#9cb4be]">
            Heavy rainfall red alert in Konkan & Coastal Karnataka • Koyna Dam spillway discharge active • Chiplun Vashishti River above warning level
          </span>
        </div>
      </div>
    </header>
  );
};
