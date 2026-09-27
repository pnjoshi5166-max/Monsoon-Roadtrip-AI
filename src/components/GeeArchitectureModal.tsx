/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GeeHarmonizationService } from '../services/geeService';
import { X, Layers, Code, Database, Satellite, Server, Cpu, Check, Copy } from 'lucide-react';

interface GeeArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeeArchitectureModal: React.FC<GeeArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'python' | 'node' | 'hand'>('pipeline');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pythonCode = GeeHarmonizationService.getProductionGeePythonPipeline();

  const nodeProxyCode = `// server.ts - Google Earth Engine Backend Proxy for Google Maps JS API
import express from 'express';
import ee from '@google/earthengine';
import privateKey from './service-account-key.json';

const app = express();

// Authenticate Earth Engine with Google Cloud Service Account
ee.data.authenticateViaPrivateKey(privateKey, () => {
  ee.initialize(null, null, () => {
    console.log('✅ Google Earth Engine Initialized for Varsha Live');
  });
});

// Proxy endpoint providing dynamic GEE Tile URL for Google Maps JavaScript API
app.get('/api/gee/precipitation-tiles', async (req, res) => {
  try {
    const gpm = ee.ImageCollection('NASA/GPM_L3/IMERG_V06')
      .filterDate(ee.Date(Date.now() - 3 * 3600000), ee.Date(Date.now()))
      .select('precipitationCal')
      .max();

    const vis = {
      min: 0,
      max: 50,
      palette: ['00f0ff', '00ff88', 'ffe600', 'ff2a55']
    };

    gpm.getMapId(vis, (mapId, error) => {
      if (error) return res.status(500).json({ error });
      // Return XYZ Tile Template URL for google.maps.ImageMapType
      res.json({
        urlTemplate: mapId.urlFormat,
        mapId: mapId.mapid,
        token: mapId.token
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});`;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#0b1019] border border-[#00f0ff]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-[#111722] border-b border-[#2b3846]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-[#f0f4fc]">
                GEE + Google Maps Platform Harmonization Blueprint
              </h3>
              <p className="text-[10px] text-[#9cb4be]">
                Real-time satellite precipitation, SAR flood detection & HAND low-lying hazard architecture
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#9cb4be] hover:text-[#f0f4fc]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 p-3 bg-[#06090f] border-b border-[#2b3846]/40 text-xs font-mono">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-[#00f0ff] text-[#002428] font-bold'
                : 'text-[#9cb4be] hover:text-[#f0f4fc] bg-[#161d28]'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>End-to-End Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'python'
                ? 'bg-[#00f0ff] text-[#002428] font-bold'
                : 'text-[#9cb4be] hover:text-[#f0f4fc] bg-[#161d28]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Earth Engine Python</span>
          </button>

          <button
            onClick={() => setActiveTab('node')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'node'
                ? 'bg-[#00f0ff] text-[#002428] font-bold'
                : 'text-[#9cb4be] hover:text-[#f0f4fc] bg-[#161d28]'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Node/Express Proxy</span>
          </button>

          <button
            onClick={() => setActiveTab('hand')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'hand'
                ? 'bg-[#00f0ff] text-[#002428] font-bold'
                : 'text-[#9cb4be] hover:text-[#f0f4fc] bg-[#161d28]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>HAND Hazard Model</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs font-sans">
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#111722] border border-[#00f0ff]/30 p-3 rounded-xl flex flex-col space-y-1.5">
                  <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-[11px] font-bold">
                    <Satellite className="w-4 h-4" />
                    <span>1. Satellite Ingestion</span>
                  </div>
                  <p className="text-[11px] text-[#9cb4be] leading-relaxed">
                    NASA GPM IMERG 0.1° dual-frequency precipitation + Copernicus Sentinel-1 SAR (C-band cloud-penetrating radar) for surface water reflection.
                  </p>
                </div>

                <div className="bg-[#111722] border border-[#00ff88]/30 p-3 rounded-xl flex flex-col space-y-1.5">
                  <div className="flex items-center gap-2 text-[#00ff88] font-mono text-[11px] font-bold">
                    <Server className="w-4 h-4" />
                    <span>2. GEE Engine & Proxy</span>
                  </div>
                  <p className="text-[11px] text-[#9cb4be] leading-relaxed">
                    Google Earth Engine computes backscatter threshold (VV &lt; -16dB) and HAND index (&lt;2m elevation relative to drainage network), producing Map IDs.
                  </p>
                </div>

                <div className="bg-[#111722] border border-[#ffe600]/30 p-3 rounded-xl flex flex-col space-y-1.5">
                  <div className="flex items-center gap-2 text-[#ffe600] font-mono text-[11px] font-bold">
                    <Layers className="w-4 h-4" />
                    <span>3. Google Maps JS API</span>
                  </div>
                  <p className="text-[11px] text-[#9cb4be] leading-relaxed">
                    Google Maps JS API loads GEE raster tiles seamlessly via <code className="text-[#00f0ff]">ImageMapType</code> and coordinates safe corridor routing avoiding flooded polygons.
                  </p>
                </div>
              </div>

              <div className="bg-[#161d28] border border-[#2b3846]/50 p-3.5 rounded-xl space-y-2">
                <span className="font-mono text-xs font-bold text-[#00f0ff] block">
                  Harmonized Spatial Resolution Matrix (India):
                </span>
                <table className="w-full text-left font-mono text-[11px] text-[#9cb4be]">
                  <thead>
                    <tr className="border-b border-[#2b3846] text-[#f0f4fc]">
                      <th className="py-1">Dataset</th>
                      <th className="py-1">Sensor / Platform</th>
                      <th className="py-1">Resolution</th>
                      <th className="py-1">Role in Roadtrip Safety</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2b3846]/40">
                    <tr>
                      <td className="py-1.5 text-[#00f0ff]">NASA GPM IMERG</td>
                      <td>Dual Radar / Microwave</td>
                      <td>10 km / 30m NRT</td>
                      <td>Heavy cloudburst detection (&gt;20mm/h)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-[#00ff88]">Sentinel-1 SAR</td>
                      <td>C-Band Synthetic Aperture</td>
                      <td>10 meters</td>
                      <td>Inundated road & bridge water extent</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-[#ffe600]">Sentinel-2 MSI</td>
                      <td>Multispectral Optical</td>
                      <td>10-20 meters</td>
                      <td>NDWI lake spill & riverbank overflow</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-[#ff2a55]">HydroSHEDS HAND</td>
                      <td>SRTM Topographic DEM</td>
                      <td>30 meters</td>
                      <td>Low-lying depressions & flood sinks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'python' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(pythonCode)}
                className="absolute top-2 right-2 px-2.5 py-1 rounded bg-[#1e2634] text-[#00f0ff] font-mono text-[10px] flex items-center gap-1 border border-[#00f0ff]/30 hover:bg-[#283244]"
              >
                {copied ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Python'}</span>
              </button>
              <pre className="bg-[#06090f] border border-[#2b3846] p-3 rounded-xl overflow-x-auto text-[11px] font-mono text-[#00f0ff] leading-relaxed">
                {pythonCode}
              </pre>
            </div>
          )}

          {activeTab === 'node' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(nodeProxyCode)}
                className="absolute top-2 right-2 px-2.5 py-1 rounded bg-[#1e2634] text-[#00f0ff] font-mono text-[10px] flex items-center gap-1 border border-[#00f0ff]/30 hover:bg-[#283244]"
              >
                {copied ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Server TS'}</span>
              </button>
              <pre className="bg-[#06090f] border border-[#2b3846] p-3 rounded-xl overflow-x-auto text-[11px] font-mono text-[#00ff88] leading-relaxed">
                {nodeProxyCode}
              </pre>
            </div>
          )}

          {activeTab === 'hand' && (
            <div className="bg-[#111722] border border-[#2b3846] p-3.5 rounded-xl space-y-3 leading-relaxed text-[#9cb4be]">
              <h4 className="font-heading text-sm font-bold text-[#f0f4fc]">
                Height Above Nearest Drainage (HAND) Mathematical Formulation
              </h4>
              <p>
                Standard elevation (meters above sea level) is insufficient for road flooding, because a mountain ghat road at 600m elevation can still sit in a narrow river canyon and drown under a flash flood.
              </p>
              <div className="p-3 bg-[#06090f] border border-[#00f0ff]/30 rounded-lg font-mono text-xs text-[#00f0ff]">
                HAND(x, y) = Elevation(x, y) - Elevation(NearestStreamDrainageNode)
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
                <li>
                  <strong className="text-[#ff2a55]">HAND &lt; 1.5 meters:</strong> Severe road waterlogging trap (e.g. Milan Subway, Chiplun Vashishti river bridge approaches, Minto underpass).
                </li>
                <li>
                  <strong className="text-[#ffe600]">HAND 1.5m - 5.0m:</strong> Vulnerable during sustained precipitation exceeding 40 mm/h.
                </li>
                <li>
                  <strong className="text-[#00ff88]">HAND &gt; 5.0m:</strong> High-ground safe corridor (e.g. NH-48 plateau via Pune-Kolhapur).
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#111722] border-t border-[#2b3846]/40 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002428] px-4 py-1.5 rounded-lg text-xs font-mono font-bold"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
