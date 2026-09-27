/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MonsoonRoutePreset } from '../types';
import {
  X,
  Navigation,
  AlertTriangle,
  ShieldCheck,
  Compass,
  Gauge,
  Waves,
  CornerDownRight,
  CheckCircle,
  Radio,
} from 'lucide-react';

interface NavigationSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preset: MonsoonRoutePreset;
}

export const NavigationSimulationModal: React.FC<NavigationSimulationModalProps> = ({
  isOpen,
  onClose,
  preset,
}) => {
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isRerouted, setIsRerouted] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(78);

  useEffect(() => {
    if (!isOpen) {
      setSimulationStep(0);
      setIsRerouted(false);
      setSpeed(78);
      return;
    }

    const interval = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev < 4) {
          if (prev === 1) setSpeed(35); // Slowing down approaching hazard
          if (prev === 2) setSpeed(10); // Extreme caution
          if (prev === 3) setSpeed(65); // Rerouted onto high-elevation corridor
          return prev + 1;
        }
        return prev;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#06090f] border border-[#00f0ff]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Navigation HUD Top Bar */}
        <div className="p-3.5 bg-[#111722] border-b border-[#2b3846]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00ff88] animate-ping"></div>
            <span className="font-heading text-xs sm:text-sm font-bold text-[#f0f4fc]">
              Monsoon Tactical Navigator • Live Drive
            </span>
          </div>
          <button onClick={onClose} className="text-[#9cb4be] hover:text-[#f0f4fc]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Turn-by-Turn Instruction Banner */}
        <div
          className={`p-4 transition-colors flex items-center gap-3 ${
            simulationStep === 2
              ? 'bg-[#ff2a55]/20 border-b border-[#ff2a55]/50'
              : simulationStep >= 3
              ? 'bg-[#00ff88]/20 border-b border-[#00ff88]/40'
              : 'bg-[#161d28] border-b border-[#2b3846]/40'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              simulationStep === 2
                ? 'bg-[#ff2a55] text-white animate-bounce'
                : simulationStep >= 3
                ? 'bg-[#00ff88] text-[#002428]'
                : 'bg-[#00f0ff] text-[#002428]'
            }`}
          >
            {simulationStep === 2 ? (
              <AlertTriangle className="w-6 h-6" />
            ) : simulationStep >= 3 ? (
              <CornerDownRight className="w-6 h-6" />
            ) : (
              <Navigation className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {simulationStep === 0 && (
              <>
                <span className="text-[10px] font-mono text-[#00f0ff] uppercase">In 800 meters</span>
                <p className="font-heading text-sm font-bold text-[#f0f4fc] truncate">
                  Continue onto {preset.primaryHighway}
                </p>
                <span className="text-xs text-[#9cb4be]">Cruising on clear expressway</span>
              </>
            )}

            {simulationStep === 1 && (
              <>
                <span className="text-[10px] font-mono text-[#ffe600] uppercase font-bold">
                  GEE Sensor Alert • In 1.8 km
                </span>
                <p className="font-heading text-sm font-bold text-[#ffe600]">
                  Heavy Rainfall Torrent Ahead (36 mm/h)
                </p>
                <span className="text-xs text-[#9cb4be]">
                  HydroSHEDS HAND indicates low-lying drainage sink approaching.
                </span>
              </>
            )}

            {simulationStep === 2 && (
              <>
                <span className="text-[10px] font-mono text-[#ff2a55] uppercase font-bold animate-pulse">
                  CRITICAL HAZARD DETECTED
                </span>
                <p className="font-heading text-sm font-bold text-[#ff2a55]">
                  Road Impassable: Chiplun Vashishti River Overflow
                </p>
                <span className="text-xs text-[#ffe8eb]">
                  Sentinel-1 SAR confirms 90cm water over roadway. Sedans submerged.
                </span>
              </>
            )}

            {simulationStep >= 3 && (
              <>
                <span className="text-[10px] font-mono text-[#00ff88] uppercase font-bold">
                  AUTONOMOUS REROUTE ENGAGED
                </span>
                <p className="font-heading text-sm font-bold text-[#00ff88]">
                  Diverting via NH-48 Safe High Plateau Corridor
                </p>
                <span className="text-xs text-[#f0f4fc]">
                  Bypassing flooded basin via Kolhapur. +45 mins, 0% waterlogging hazard.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Tactical Telemetry HUD */}
        <div className="p-4 grid grid-cols-3 gap-2.5 bg-[#0b1019] text-center font-mono">
          <div className="bg-[#111722] border border-[#2b3846]/40 p-2.5 rounded-xl">
            <span className="text-[9px] text-[#9cb4be] uppercase block">Vehicle Speed</span>
            <span className="text-xl font-bold text-[#00f0ff]">{speed}</span>
            <span className="text-[10px] text-[#9cb4be]"> km/h</span>
          </div>

          <div className="bg-[#111722] border border-[#2b3846]/40 p-2.5 rounded-xl">
            <span className="text-[9px] text-[#9cb4be] uppercase block">Precipitation</span>
            <span className="text-xl font-bold text-[#f0f4fc]">
              {simulationStep >= 1 && simulationStep <= 2 ? '36.4' : '6.2'}
            </span>
            <span className="text-[10px] text-[#9cb4be]"> mm/h</span>
          </div>

          <div className="bg-[#111722] border border-[#2b3846]/40 p-2.5 rounded-xl">
            <span className="text-[9px] text-[#9cb4be] uppercase block">Inundation Risk</span>
            <span
              className={`text-xl font-bold ${
                simulationStep === 2
                  ? 'text-[#ff2a55]'
                  : simulationStep >= 3
                  ? 'text-[#00ff88]'
                  : 'text-[#ffe600]'
              }`}
            >
              {simulationStep === 2 ? 'CRITICAL' : simulationStep >= 3 ? 'MINIMAL' : 'ELEVATED'}
            </span>
          </div>
        </div>

        {/* Live Satellite Harmonization Status */}
        <div className="px-4 py-3 bg-[#111722]/80 border-t border-[#2b3846]/40 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#9cb4be]">
            <Radio className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
            <span>Harmonized GEE: GPM + Sentinel-1 SAR</span>
          </div>
          <span className="text-[#00ff88]">Simulation Stage {simulationStep + 1}/5</span>
        </div>

        {/* Close / Done Action */}
        <div className="p-3 bg-[#06090f] border-t border-[#2b3846]/40 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#161d28] hover:bg-[#1e2634] text-[#00f0ff] border border-[#00f0ff]/40 px-4 py-1.5 rounded-lg text-xs font-mono font-bold"
          >
            End Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
