/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  INITIAL_WATERLOGGING_ALERTS,
  GHAT_PASS_STATUSES,
  GEE_LAYERS,
} from '../services/mockData';
import { GeeHarmonizationService } from '../services/geeService';
import { WaterloggingAlert, GhatPassStatus } from '../types';
import {
  Layers,
  Waves,
  AlertTriangle,
  Radio,
  Eye,
  EyeOff,
  Navigation,
  ThumbsUp,
  MapPin,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  Mountain,
  ShieldCheck,
} from 'lucide-react';

interface MonsoonMapProps {
  onSelectAlert?: (alert: WaterloggingAlert) => void;
  onOpenReportModal?: (latLng?: { lat: number; lng: number }) => void;
}

// Bounding box for Western India / Konkan Ghats Corridor
// Lat: 15.0 to 20.2 N, Lng: 72.2 to 74.8 E
const MIN_LAT = 15.0;
const MAX_LAT = 20.2;
const MIN_LNG = 72.2;
const MAX_LNG = 75.0;

export const MonsoonMap: React.FC<MonsoonMapProps> = ({
  onSelectAlert,
  onOpenReportModal,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    gpm_precipitation: true,
    sentinel1_sar_flood: true,
    sentinel2_ndwi: false,
    srtm_hand_lowlying: true,
    radar_sweep: true,
    highways: true,
  });

  const [layerDrawerOpen, setLayerDrawerOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<WaterloggingAlert | null>(null);
  const [selectedGhat, setSelectedGhat] = useState<GhatPassStatus | null>(null);

  // Converts geographic (lat, lng) to SVG percentage (0 to 100)
  const projectGeo = (lat: number, lng: number) => {
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 100;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetViewport = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  const hazardPolygons = GeeHarmonizationService.getLowLyingHazardPolygons();

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[520px] rounded-xl overflow-hidden border border-[#2b3846]/50 shadow-2xl bg-[#06090f] select-none">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#06090f]/90 border border-[#2b3846]/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
          </span>
          <span className="font-mono text-[10px] text-[#00f0ff] font-bold uppercase tracking-wider">
            GEE Radar GIS Engine • Standalone
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Zoom & Reset Controls */}
          <div className="flex items-center bg-[#111722]/90 border border-[#2b3846]/60 rounded-lg backdrop-blur-md p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2.5))}
              className="p-1.5 text-[#9cb4be] hover:text-[#00f0ff] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.8))}
              className="p-1.5 text-[#9cb4be] hover:text-[#00f0ff] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetViewport}
              className="p-1.5 text-[#9cb4be] hover:text-[#00f0ff] transition-colors border-l border-[#2b3846]"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Layer Selector Drawer Button */}
          <button
            onClick={() => setLayerDrawerOpen(!layerDrawerOpen)}
            className="flex items-center gap-1.5 bg-[#111722]/90 hover:bg-[#161d28] border border-[#00f0ff]/40 text-[#00f0ff] px-3 py-1.5 rounded-lg font-mono text-xs font-bold shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all active:scale-95"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GEE Overlays</span>
          </button>
        </div>
      </div>

      {/* Layer Toggle Drawer */}
      {layerDrawerOpen && (
        <div className="absolute top-14 right-3 w-80 max-w-[calc(100vw-24px)] z-40 bg-[#0b1019]/95 border border-[#00f0ff]/40 rounded-xl p-3.5 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[#2b3846]/50 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00f0ff]" />
              <span className="font-mono text-xs font-bold text-[#f0f4fc] uppercase">
                GEE Satellite Layers
              </span>
            </div>
            <button
              onClick={() => setLayerDrawerOpen(false)}
              className="text-[#9cb4be] hover:text-[#f0f4fc]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {GEE_LAYERS.map((layer) => (
              <div
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-start justify-between gap-2 ${
                  activeLayers[layer.id]
                    ? 'bg-[#00f0ff]/10 border-[#00f0ff]/50 text-[#f0f4fc]'
                    : 'bg-[#111722]/60 border-[#2b3846]/30 text-[#9cb4be]'
                }`}
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-xs text-[#00f0ff] truncate">
                    {layer.name}
                  </span>
                  <p className="text-[10px] text-[#9cb4be] mt-0.5 line-clamp-1">
                    {layer.description}
                  </p>
                  <span className="font-mono text-[9px] text-[#00ff88] mt-0.5">
                    {layer.resolution}
                  </span>
                </div>
                {activeLayers[layer.id] ? (
                  <Eye className="w-4 h-4 text-[#00f0ff] flex-shrink-0" />
                ) : (
                  <EyeOff className="w-4 h-4 text-[#6d868f] flex-shrink-0" />
                )}
              </div>
            ))}

            <div
              onClick={() => toggleLayer('radar_sweep')}
              className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-between ${
                activeLayers.radar_sweep
                  ? 'bg-[#00f0ff]/10 border-[#00f0ff]/50 text-[#f0f4fc]'
                  : 'bg-[#111722]/60 border-[#2b3846]/30 text-[#9cb4be]'
              }`}
            >
              <div>
                <span className="font-semibold text-xs text-[#00f0ff]">
                  DWR Doppler Radar Sweep
                </span>
                <p className="text-[10px] text-[#9cb4be]">
                  DWR Veravali 150km radial sweep beam
                </p>
              </div>
              {activeLayers.radar_sweep ? (
                <Eye className="w-4 h-4 text-[#00f0ff]" />
              ) : (
                <EyeOff className="w-4 h-4 text-[#6d868f]" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Standalone Interactive Geospatial Canvas */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full relative transition-transform duration-75"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Base Topographic & Coastal Map Canvas (SVG Vector GIS) */}
          <svg
            className="w-full h-full absolute inset-0 pointer-events-none"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Radial gradient for Doppler Radar sweep */}
              <radialGradient id="radarPulse" cx="240" cy="220" r="280" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#00ff88" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
              </radialGradient>
              <linearGradient id="rainSurge" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#ffe600" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ff2a55" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Geographic Grid Lines (Lat/Lng) */}
            <g stroke="#2b3846" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4">
              <line x1="0" y1="200" x2="1000" y2="200" />
              <line x1="0" y1="400" x2="1000" y2="400" />
              <line x1="0" y1="600" x2="1000" y2="600" />
              <line x1="0" y1="800" x2="1000" y2="800" />
              <line x1="200" y1="0" x2="200" y2="1000" />
              <line x1="400" y1="0" x2="400" y2="1000" />
              <line x1="600" y1="0" x2="600" y2="1000" />
              <line x1="800" y1="0" x2="800" y2="1000" />
            </g>

            {/* Arabian Sea Basin (West) */}
            <path
              d="M0,0 L200,0 C220,180 230,220 240,300 C250,420 235,550 260,700 C270,820 260,920 280,1000 L0,1000 Z"
              fill="#06090f"
              stroke="#00f0ff"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            {/* Arabian Sea Label */}
            <text x="70" y="500" fill="#6d868f" fontSize="16" fontFamily="JetBrains Mono" letterSpacing="4" opacity="0.5" transform="rotate(-90 70 500)">
              ARABIAN SEA (MONSOON CURRENT)
            </text>

            {/* Western Ghats Ridge Line Elevation Contours (Mountains) */}
            <path
              d="M380,80 Q450,250 440,450 T460,750 T500,980"
              fill="none"
              stroke="#00ff88"
              strokeWidth="28"
              strokeLinecap="round"
              strokeOpacity="0.08"
              filter="blur(8px)"
            />
            <path
              d="M380,80 Q450,250 440,450 T460,750 T500,980"
              fill="none"
              stroke="#00ff88"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              strokeOpacity="0.4"
            />
            <text x="470" y="320" fill="#00ff88" fontSize="11" fontFamily="JetBrains Mono" opacity="0.6" transform="rotate(78 470 320)">
              ▲ WESTERN GHATS ESCARPMENT (ELEV 600m - 1200m)
            </text>

            {/* Highway Corridors Layer */}
            {activeLayers.highways && (
              <g>
                {/* NH-66 Coastal Risky Corridor (Pen ➔ Mangaon ➔ Chiplun ➔ Goa) */}
                <path
                  d="M260,220 L275,320 L290,440 L310,560 L330,720 L350,880"
                  fill="none"
                  stroke="#ff2a55"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  strokeOpacity="0.8"
                />
                {/* NH-48 Safe High Plateau Corridor (Mumbai ➔ Pune ➔ Kolhapur ➔ Goa) */}
                <path
                  d="M260,220 L360,270 L480,330 L550,500 L610,680 L540,860 L350,880"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="3.5"
                  strokeOpacity="0.85"
                />
              </g>
            )}

            {/* GEE Satellite Precipitation Overlay (NASA GPM IMERG) */}
            {activeLayers.gpm_precipitation && (
              <g opacity="0.65">
                <path
                  d="M220,150 C290,140 380,180 360,280 C340,360 250,380 230,300 Z"
                  fill="url(#rainSurge)"
                  filter="blur(16px)"
                />
                <path
                  d="M260,420 C340,390 400,450 380,560 C360,650 280,620 260,510 Z"
                  fill="url(#rainSurge)"
                  filter="blur(20px)"
                />
              </g>
            )}

            {/* Sentinel-1 SAR & HAND Flood Hazard Polygons */}
            {(activeLayers.sentinel1_sar_flood || activeLayers.srtm_hand_lowlying) &&
              hazardPolygons.map((poly) => {
                const points = poly.paths
                  .map((p) => {
                    const pos = projectGeo(p.lat, p.lng);
                    return `${pos.x * 10},${pos.y * 10}`;
                  })
                  .join(' ');
                return (
                  <polygon
                    key={poly.id}
                    points={points}
                    fill={poly.fillColor}
                    fillOpacity="0.45"
                    stroke={poly.strokeColor}
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                );
              })}

            {/* Doppler Radar Sweep & Rings (DWR Veravali Center) */}
            {activeLayers.radar_sweep && (
              <g>
                <circle cx="250" cy="220" r="140" fill="url(#radarPulse)" />
                <circle cx="250" cy="220" r="70" fill="none" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
                <circle cx="250" cy="220" r="140" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                <circle cx="250" cy="220" r="210" fill="none" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="5 5" opacity="0.2" />

                {/* Rotating Sweeper Beam */}
                <g transform="translate(250, 220)">
                  <line
                    x1="0"
                    y1="0"
                    x2="150"
                    y2="150"
                    stroke="#00f0ff"
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                    className="animate-radar-sweep origin-center"
                  />
                </g>
              </g>
            )}
          </svg>

          {/* HTML Interactive Markers (Clickable Pins & Stations) */}
          <div className="absolute inset-0 pointer-events-auto">
            {/* Waterlogging Alerts */}
            {INITIAL_WATERLOGGING_ALERTS.map((alert) => {
              const pos = projectGeo(alert.coordinates.lat, alert.coordinates.lng);
              return (
                <div
                  key={alert.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAlert(alert);
                    setSelectedGhat(null);
                    if (onSelectAlert) onSelectAlert(alert);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <span
                    className={`absolute -inset-1 rounded-full animate-ping opacity-75 ${
                      alert.severity === 'impassable'
                        ? 'bg-[#ff2a55]'
                        : alert.severity === 'severe'
                        ? 'bg-[#ffe600]'
                        : 'bg-[#00f0ff]'
                    }`}
                  ></span>
                  <div
                    className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${
                      alert.severity === 'impassable'
                        ? 'bg-[#06090f] border-[#ff2a55] text-[#ff2a55]'
                        : alert.severity === 'severe'
                        ? 'bg-[#06090f] border-[#ffe600] text-[#ffe600]'
                        : 'bg-[#06090f] border-[#00f0ff] text-[#00f0ff]'
                    }`}
                  >
                    <Waves className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[#06090f]/95 border border-[#2b3846] px-1.5 py-0.5 rounded text-[9px] font-mono text-[#f0f4fc] whitespace-nowrap shadow-md pointer-events-none">
                    {alert.title.split(' ')[0]} ({alert.waterDepthCm}cm)
                  </div>
                </div>
              );
            })}

            {/* Ghat Pass Status Markers */}
            {GHAT_PASS_STATUSES.map((ghat) => {
              const pos = projectGeo(ghat.coordinates.lat, ghat.coordinates.lng);
              return (
                <div
                  key={ghat.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGhat(ghat);
                    setSelectedAlert(null);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shadow-lg transition-transform group-hover:scale-115 ${
                      ghat.status === 'normal'
                        ? 'bg-[#06090f] border-[#00ff88] text-[#00ff88]'
                        : ghat.status === 'caution'
                        ? 'bg-[#06090f] border-[#ffe600] text-[#ffe600]'
                        : 'bg-[#06090f] border-[#ff2a55] text-[#ff2a55]'
                    }`}
                  >
                    <Mountain className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 bg-[#06090f]/95 border border-[#2b3846] px-1.5 py-0.5 rounded text-[8px] font-mono text-[#00ff88] whitespace-nowrap shadow-md pointer-events-none">
                    {ghat.name}
                  </div>
                </div>
              );
            })}

            {/* City Hub Labels */}
            {[
              { name: 'Mumbai', lat: 19.076, lng: 72.877 },
              { name: 'Pune', lat: 18.52, lng: 73.856 },
              { name: 'Chiplun', lat: 17.532, lng: 73.518 },
              { name: 'Kolhapur', lat: 16.705, lng: 74.243 },
              { name: 'Goa', lat: 15.49, lng: 73.827 },
            ].map((city) => {
              const pos = projectGeo(city.lat, city.lng);
              return (
                <div
                  key={city.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 z-10"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f0f4fc]"></span>
                  <span className="font-heading text-[11px] font-bold text-[#f0f4fc] bg-[#06090f]/80 px-1 rounded shadow">
                    {city.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Detail Panel (When marker clicked) */}
      {(selectedAlert || selectedGhat) && (
        <div className="absolute bottom-16 left-3 right-3 sm:right-auto sm:w-96 z-30 bg-[#0b1019]/95 border border-[#00f0ff]/40 rounded-xl p-3.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2">
          {selectedAlert && (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedAlert.severity === 'impassable'
                        ? 'bg-[#ff2a55]/20 text-[#ff2a55]'
                        : 'bg-[#ffe600]/20 text-[#ffe600]'
                    }`}
                  >
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-[#f0f4fc]">
                      {selectedAlert.title}
                    </h4>
                    <span className="text-[10px] text-[#9cb4be]">
                      {selectedAlert.subLocation}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-[#9cb4be] hover:text-[#f0f4fc]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#111722] p-2 rounded-lg text-xs font-mono">
                <div>
                  <span className="text-[#9cb4be] text-[10px] block">Water Depth:</span>
                  <span className="font-bold text-[#ff2a55]">{selectedAlert.waterDepthCm} cm</span>
                </div>
                <div>
                  <span className="text-[#9cb4be] text-[10px] block">Clearance:</span>
                  <span className="font-bold text-[#f0f4fc] uppercase">
                    {selectedAlert.passableFor.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-[#9cb4be] text-[10px] block">HAND Sink Index:</span>
                  <span className="font-bold text-[#00ff88]">{selectedAlert.heightAboveDrainageM} m</span>
                </div>
                <div>
                  <span className="text-[#9cb4be] text-[10px] block">Verified By:</span>
                  <span className="font-bold text-[#00f0ff]">{selectedAlert.verifiedCount} drivers</span>
                </div>
              </div>

              <p className="text-[11px] text-[#9cb4be] leading-snug">{selectedAlert.notes}</p>
            </div>
          )}

          {selectedGhat && (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedGhat.status === 'normal'
                        ? 'bg-[#00ff88]/20 text-[#00ff88]'
                        : selectedGhat.status === 'caution'
                        ? 'bg-[#ffe600]/20 text-[#ffe600]'
                        : 'bg-[#ff2a55]/20 text-[#ff2a55]'
                    }`}
                  >
                    <Mountain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-[#f0f4fc]">
                      {selectedGhat.name}
                    </h4>
                    <span className="text-[10px] text-[#9cb4be]">{selectedGhat.state}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGhat(null)}
                  className="text-[#9cb4be] hover:text-[#f0f4fc]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#111722] p-2 rounded-lg text-xs font-mono">
                <div>
                  <span className="text-[#9cb4be] text-[10px] block">Pass Status:</span>
                  <span className="font-bold text-[#00ff88] uppercase">{selectedGhat.statusText}</span>
                </div>
                <div>
                  <span className="text-[#9cb4be] text-[10px] block">Elevation:</span>
                  <span className="font-bold text-[#f0f4fc]">{selectedGhat.elevationMeters} m</span>
                </div>
                <div>
                  <span className="text-[#9cb4be] text-[10px] block">24h Rain:</span>
                  <span className="font-bold text-[#00f0ff]">{selectedGhat.rainfall24h} mm</span>
                </div>
                <div>
                  <span className="text-[#9cb4be] text-[10px] block">Fog Visibility:</span>
                  <span className="font-bold text-[#ffe600]">{selectedGhat.fogVisibilityMeters} m</span>
                </div>
              </div>

              <p className="text-[11px] text-[#9cb4be] leading-snug">{selectedGhat.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Floating Legend & Quick Action */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto bg-[#06090f]/90 border border-[#2b3846]/60 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a55]"></span>
            <span className="font-mono text-[10px] text-[#f0f4fc]">Impassable / Flood</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffe600]"></span>
            <span className="font-mono text-[10px] text-[#f0f4fc]">Caution (SUV Only)</span>
          </div>
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88]"></span>
            <span className="font-mono text-[10px] text-[#f0f4fc]">Ghat Open</span>
          </div>
        </div>

        {onOpenReportModal && (
          <button
            onClick={() => onOpenReportModal()}
            className="pointer-events-auto bg-[#ff2a55] hover:bg-[#ff4d73] text-white px-3.5 py-1.5 rounded-lg font-heading text-xs font-bold shadow-[0_0_15px_rgba(255,42,85,0.4)] flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Report Waterlogging</span>
          </button>
        )}
      </div>
    </div>
  );
};
