/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WaterloggingAlert } from '../types';
import { X, Waves, AlertTriangle, Send, MapPin, Gauge } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newAlert: Omit<WaterloggingAlert, 'id' | 'reportedAtMinsAgo' | 'verifiedCount'>) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [subLocation, setSubLocation] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [waterDepthCm, setWaterDepthCm] = useState(40);
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'severe' | 'impassable'>('severe');
  const [passableFor, setPassableFor] = useState<'all' | 'suv_only' | 'high_clearance_only' | 'closed'>('suv_only');
  const [hazardType, setHazardType] = useState<'waterlogging' | 'flash_flood' | 'landslide' | 'submerged_culvert'>('waterlogging');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      subLocation: subLocation || 'Highway Culvert Approach',
      city,
      state,
      coordinates: { lat: 19.076 + (Math.random() - 0.5) * 0.05, lng: 72.877 + (Math.random() - 0.5) * 0.05 },
      waterDepthCm,
      severity,
      passableFor,
      hazardType,
      notes: notes || 'Water accumulating rapidly from ongoing monsoon downpour.',
      elevationM: 6.2,
      heightAboveDrainageM: 0.5,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0b1019] border border-[#00f0ff]/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#111722] border-b border-[#2b3846]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff2a55]/20 border border-[#ff2a55]/40 flex items-center justify-center text-[#ff2a55]">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-[#f0f4fc]">
                Report Road Inundation / Hazard
              </h3>
              <p className="text-[10px] text-[#9cb4be]">
                Alerts are broadcasted to active monsoon drivers and verified
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#9cb4be] hover:text-[#f0f4fc]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-[#9cb4be] mb-1">
              Hazard Headline / Landmark *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., King's Circle Railway Bridge Waterlogging"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#161d28] border border-[#2b3846] rounded-lg px-3 py-2 text-[#f0f4fc] placeholder-[#6d868f] focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-mono text-[#9cb4be] mb-1">
                Specific Location / Street
              </label>
              <input
                type="text"
                placeholder="e.g., Near Sion flyover ramp"
                value={subLocation}
                onChange={(e) => setSubLocation(e.target.value)}
                className="w-full bg-[#161d28] border border-[#2b3846] rounded-lg px-3 py-2 text-[#f0f4fc] placeholder-[#6d868f] focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#9cb4be] mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#161d28] border border-[#2b3846] rounded-lg px-3 py-2 text-[#f0f4fc] focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
          </div>

          {/* Water Depth Slider */}
          <div className="bg-[#161d28] border border-[#2b3846]/40 p-3 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#9cb4be]">
                Estimated Water Depth
              </span>
              <span className="font-mono text-base font-bold text-[#ff2a55]">
                {waterDepthCm} cm ({Math.round(waterDepthCm / 2.54)} inches)
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={waterDepthCm}
              onChange={(e) => setWaterDepthCm(Number(e.target.value))}
              className="w-full accent-[#ff2a55] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#6d868f]">
              <span>Tire Rim (15cm)</span>
              <span>Knee Level (50cm)</span>
              <span>Submerged Bonnet (&gt;90cm)</span>
            </div>
          </div>

          {/* Vehicle Passability Selector */}
          <div>
            <label className="block text-[11px] font-mono text-[#9cb4be] mb-1.5">
              Vehicle Clearance & Passability
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'Passable for All' },
                { id: 'suv_only', label: 'SUVs & 4x4 Only' },
                { id: 'high_clearance_only', label: 'Commercial Trucks Only' },
                { id: 'closed', label: 'Completely Blocked / Closed' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setPassableFor(item.id as any)}
                  className={`p-2 rounded-lg text-left font-mono text-[11px] border transition-all ${
                    passableFor === item.id
                      ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] font-bold'
                      : 'bg-[#161d28] border-[#2b3846]/40 text-[#9cb4be]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#9cb4be] mb-1">
              Field Observations & Danger Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Current is strong, submerged potholes hidden, 3 hatchbacks stalled with hydro-locked engines."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#161d28] border border-[#2b3846] rounded-lg px-3 py-2 text-[#f0f4fc] placeholder-[#6d868f] focus:outline-none focus:border-[#00f0ff]"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono text-[#9cb4be] hover:text-[#f0f4fc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002428] px-5 py-2 rounded-lg font-heading text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
