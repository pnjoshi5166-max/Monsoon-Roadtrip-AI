/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MONSOON_ROUTE_PRESETS } from '../services/mockData';
import { GeeHarmonizationService, RouteRiskAssessment } from '../services/geeService';
import { MonsoonRoutePreset } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  Navigation,
  Clock,
  Milestone,
  CheckCircle,
  Play,
  Waves,
  Mountain,
  Droplets,
  Layers,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

interface RouteNavigatorProps {
  initialPresetId?: string;
  onStartSimulation: (preset: MonsoonRoutePreset) => void;
}

export const RouteNavigator: React.FC<RouteNavigatorProps> = ({
  initialPresetId = 'mumbai-goa',
  onStartSimulation,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<MonsoonRoutePreset>(() => {
    const found = MONSOON_ROUTE_PRESETS.find((p) => p.id === initialPresetId);
    return found || MONSOON_ROUTE_PRESETS[0];
  });

  const [activeCorridor, setActiveCorridor] = useState<'safe' | 'risky'>('safe');
  const riskAssessment = GeeHarmonizationService.assessCorridorRisk(selectedPreset.id);

  return (
    <div className="flex flex-col w-full space-y-4 pb-20">
      {/* Route Preset Selector Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {MONSOON_ROUTE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSelectedPreset(preset)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
              selectedPreset.id === preset.id
                ? 'bg-[#00f0ff] text-[#002428] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'bg-[#111722]/80 text-[#9cb4be] border-[#2b3846]/40 hover:text-[#f0f4fc]'
            }`}
          >
            <span>{preset.name}</span>
          </button>
        ))}
      </div>

      {/* Corridor Comparison Cards (Risky vs Safe) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Recommended Safe Corridor */}
        <div
          onClick={() => setActiveCorridor('safe')}
          className={`rounded-xl p-3.5 border transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl ${
            activeCorridor === 'safe'
              ? 'bg-[#00ff88]/10 border-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.2)]'
              : 'bg-[#111722]/80 border-[#2b3846]/40 hover:border-[#00ff88]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00ff88]" />
              <span className="font-heading text-sm font-bold text-[#f0f4fc]">
                Recommended Safe Corridor
              </span>
            </div>
            <span className="font-mono text-[9px] bg-[#00ff88]/20 border border-[#00ff88]/40 text-[#00ff88] px-2 py-0.5 rounded font-bold uppercase">
              100% Pass Open
            </span>
          </div>

          <p className="text-xs text-[#f0f4fc] font-semibold mt-2">
            {selectedPreset.safeRouteDetails.via}
          </p>
          <p className="text-[11px] text-[#9cb4be] mt-1">
            {selectedPreset.safeRouteDetails.safetyFactor}
          </p>

          <div className="mt-3 pt-2 border-t border-[#2b3846]/40 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#00ff88]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Low-lying basins bypassed</span>
            </div>
            <span className="text-[#9cb4be]">
              +{selectedPreset.safeRouteDetails.extraMinutes}m extra time
            </span>
          </div>
        </div>

        {/* Hazard Prone Primary Highway */}
        <div
          onClick={() => setActiveCorridor('risky')}
          className={`rounded-xl p-3.5 border transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl ${
            activeCorridor === 'risky'
              ? 'bg-[#ff2a55]/15 border-[#ff2a55] shadow-[0_0_20px_rgba(255,42,85,0.25)]'
              : 'bg-[#111722]/80 border-[#2b3846]/40 hover:border-[#ff2a55]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#ff2a55]" />
              <span className="font-heading text-sm font-bold text-[#f0f4fc]">
                Direct Highway ({selectedPreset.primaryHighway})
              </span>
            </div>
            <span className="font-mono text-[9px] bg-[#ff2a55]/20 border border-[#ff2a55]/40 text-[#ff2a55] px-2 py-0.5 rounded font-bold uppercase">
              High Hazard Risk
            </span>
          </div>

          <p className="text-xs text-[#ffe8eb] mt-2 leading-snug">
            {selectedPreset.riskDescription}
          </p>

          <div className="mt-3 pt-2 border-t border-[#2b3846]/40 flex items-center justify-between text-xs font-mono">
            <span className="text-[#ff2a55] font-bold">
              {selectedPreset.waterloggedPointsCount} Flooded Nodes • {selectedPreset.landslideZonesCount} Landslide Slips
            </span>
            <span className="text-[#9cb4be]">{selectedPreset.estTimeHours}</span>
          </div>
        </div>
      </div>

      {/* Interactive Tactical Route & Elevation Profile Canvas */}
      <div className="w-full bg-[#111722]/85 border border-[#2b3846]/40 rounded-xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#00f0ff]" />
            <h3 className="font-heading text-sm font-semibold text-[#f0f4fc]">
              Corridor Waypoints & Flood Avoidance Path
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#00f0ff] uppercase bg-[#161d28] px-2 py-0.5 rounded border border-[#2b3846]">
            {activeCorridor === 'safe' ? 'Safe Highway Route Active' : 'Hazard Route Active'}
          </span>
        </div>

        {/* Tactical Route Schematic Map */}
        <div className="w-full h-56 bg-[#06090f] border border-[#2b3846]/40 rounded-lg relative overflow-hidden flex flex-col justify-between p-3">
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 600 200" preserveAspectRatio="none">
            {/* Grid */}
            <line x1="0" y1="50" x2="600" y2="50" stroke="#2b3846" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#2b3846" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
            <line x1="0" y1="150" x2="600" y2="150" stroke="#2b3846" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />

            {/* Risky Route Path (Lower, coastal, passes through Chiplun flooded sink) */}
            <path
              d="M50,140 Q200,165 300,170 T450,155 T550,140"
              fill="none"
              stroke="#ff2a55"
              strokeWidth={activeCorridor === 'risky' ? 4 : 2}
              strokeOpacity={activeCorridor === 'risky' ? 1 : 0.35}
              strokeDasharray={activeCorridor === 'risky' ? 'none' : '4 3'}
            />

            {/* Safe Route Path (Higher plateau, passes through Pune/Kolhapur) */}
            <path
              d="M50,140 Q150,50 300,45 T450,60 T550,140"
              fill="none"
              stroke="#00ff88"
              strokeWidth={activeCorridor === 'safe' ? 4 : 2}
              strokeOpacity={activeCorridor === 'safe' ? 1 : 0.35}
            />

            {/* Flooded Sink Zone in Risky Route (Chiplun Vashishti River Basin) */}
            <circle cx="300" cy="170" r="16" fill="#ff2a55" fillOpacity="0.25" />
            <circle cx="300" cy="170" r="6" fill="#ff2a55" />

            {/* Safe High-Plateau Node (Kolhapur/Pune) */}
            <circle cx="300" cy="45" r="12" fill="#00ff88" fillOpacity="0.2" />
            <circle cx="300" cy="45" r="5" fill="#00ff88" />

            {/* Start Node */}
            <circle cx="50" cy="140" r="7" fill="#00f0ff" />
            {/* End Node */}
            <circle cx="550" cy="140" r="7" fill="#00f0ff" />
          </svg>

          {/* Node Labels on Overlay */}
          <div className="relative z-10 flex justify-between text-[11px] font-mono">
            <span className="bg-[#111722]/90 border border-[#00f0ff]/50 px-2 py-0.5 rounded text-[#00f0ff] font-bold">
              Origin: {selectedPreset.origin.name}
            </span>
            <span className="bg-[#111722]/90 border border-[#00ff88]/50 px-2 py-0.5 rounded text-[#00ff88] font-bold">
              Safe Plateau: Kolhapur (Elev 550m)
            </span>
            <span className="bg-[#111722]/90 border border-[#00f0ff]/50 px-2 py-0.5 rounded text-[#00f0ff] font-bold">
              Dest: {selectedPreset.destination.name}
            </span>
          </div>

          <div className="relative z-10 flex justify-between items-end text-[10px] font-mono">
            <span className="text-[#6d868f]">0 km (Departure)</span>
            <span className="bg-[#ff2a55]/20 border border-[#ff2a55]/60 text-[#ff2a55] px-2 py-0.5 rounded font-bold">
              ⚠️ Inundation Trap: Chiplun Basin (90cm floodwater)
            </span>
            <span className="text-[#6d868f]">{selectedPreset.distanceKm} km (Arrival)</span>
          </div>
        </div>

        {/* Elevation & HAND Topography Cross-Section */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#9cb4be] flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>Elevation Profile (Cross Section)</span>
            </span>
            <span className="text-[#00ff88]">Safe Corridor Peak: 620m • Flood Sink: 14m</span>
          </div>

          <div className="w-full h-10 bg-[#06090f] border border-[#2b3846]/30 rounded flex items-center px-2 relative overflow-hidden">
            <div
              className={`h-2 rounded transition-all ${
                activeCorridor === 'safe'
                  ? 'bg-gradient-to-r from-[#00f0ff] via-[#00ff88] to-[#00f0ff] w-full'
                  : 'bg-gradient-to-r from-[#00f0ff] via-[#ff2a55] to-[#00f0ff] w-full'
              }`}
            ></div>
          </div>
        </div>

        {/* Action Button: Start Live Simulated Drive */}
        <button
          onClick={() => onStartSimulation(selectedPreset)}
          className="w-full h-11 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002428] rounded-lg font-heading text-xs sm:text-sm font-bold shadow-[0_0_18px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Simulated Monsoon Drive & Auto-Reroute</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Low-Lying Hazard & GEE Satellite Synthesis Panel */}
      <div className="w-full bg-[#111722]/80 border border-[#2b3846]/40 rounded-xl p-4 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00f0ff]" />
            <h3 className="font-heading text-sm font-semibold text-[#f0f4fc]">
              GEE Satellite Risk Synthesis & Hydrologic Profile
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#00f0ff] font-bold bg-[#1e2634] px-2 py-0.5 rounded">
            Risk Score: {riskAssessment.overallRiskScore}/10
          </span>
        </div>

        {/* High Risk Critical Sections */}
        {riskAssessment.highRiskSections.length > 0 && (
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[#ff2a55] font-bold uppercase tracking-wider">
              Identified Inundation & Landslip Bottlenecks:
            </span>
            {riskAssessment.highRiskSections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-[#161d28] border border-[#ff2a55]/30 rounded-lg p-2.5 flex flex-col space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#f0f4fc]">{sec.locationName}</span>
                  <span className="font-mono text-[10px] text-[#ff2a55] bg-[#ff2a55]/15 px-1.5 py-0.5 rounded">
                    {sec.hazardType}
                  </span>
                </div>
                <p className="text-[11px] text-[#9cb4be]">{sec.details}</p>
                <div className="flex items-center gap-4 text-[10px] font-mono text-[#9cb4be] pt-1">
                  <div className="flex items-center gap-1">
                    <Mountain className="w-3 h-3 text-[#00f0ff]" />
                    <span>Elev: {sec.elevationM}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Waves className="w-3 h-3 text-[#00ff88]" />
                    <span>HAND: {sec.handIndexM}m (Sink)</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#ff2a55]">
                    <Clock className="w-3 h-3" />
                    <span>Limit: {sec.recommendedSpeedLimitKmh} km/h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Consulted Datasets */}
        <div className="pt-2 border-t border-[#2b3846]/30 flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-[#9cb4be]">
          <span>Harmonized GEE Datasets:</span>
          {riskAssessment.geeDatasetsConsulted.map((ds, idx) => (
            <span key={idx} className="bg-[#1e2634] text-[#00f0ff] px-2 py-0.5 rounded">
              {ds}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
