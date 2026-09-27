/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WaterloggingAlert } from '../types';
import {
  Waves,
  AlertTriangle,
  ThumbsUp,
  MapPin,
  Clock,
  Car,
  Filter,
  Plus,
  ShieldCheck,
  Mountain,
} from 'lucide-react';

interface CommunityAlertsViewProps {
  alerts: WaterloggingAlert[];
  onUpvoteAlert: (alertId: string) => void;
  onOpenReportModal: () => void;
  onViewOnMap: (alert: WaterloggingAlert) => void;
}

export const CommunityAlertsView: React.FC<CommunityAlertsViewProps> = ({
  alerts,
  onUpvoteAlert,
  onOpenReportModal,
  onViewOnMap,
}) => {
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterCity !== 'all' && alert.city.toLowerCase() !== filterCity.toLowerCase()) {
      return false;
    }
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full space-y-4 pb-20">
      {/* Header and Report Action */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-[#f0f4fc]">
              Community Road Waterlogging Network
            </h2>
            <p className="text-[11px] text-[#9cb4be]">
              Driver-reported & satellite-validated inundation points
            </p>
          </div>
        </div>

        <button
          onClick={onOpenReportModal}
          className="bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002428] px-3 py-1.5 rounded-lg font-heading text-xs font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)] flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Report Water-logging</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-[#111722]/80 border border-[#2b3846]/40 p-2.5 rounded-xl">
        <div className="flex items-center gap-1.5 text-xs text-[#9cb4be] mr-2">
          <Filter className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>City:</span>
        </div>
        {['all', 'Mumbai', 'Chiplun', 'Raigad', 'Bengaluru', 'New Delhi'].map((city) => (
          <button
            key={city}
            onClick={() => setFilterCity(city)}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
              filterCity === city
                ? 'bg-[#00f0ff] text-[#002428] font-bold'
                : 'bg-[#161d28] text-[#9cb4be] hover:text-[#f0f4fc]'
            }`}
          >
            {city === 'all' ? 'All Cities' : city}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="flex flex-col space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#111722]/80 border border-[#2b3846]/40 rounded-xl p-8 text-center text-[#9cb4be]">
            <ShieldCheck className="w-8 h-8 text-[#00ff88] mx-auto mb-2" />
            <p className="font-semibold text-sm text-[#f0f4fc]">No Active Flooding Reported in this Zone</p>
            <p className="text-xs mt-1">Satellite radar and community network report clear passage.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-[#111722]/85 border border-[#2b3846]/40 rounded-xl p-3.5 flex flex-col space-y-2.5 shadow-lg relative overflow-hidden backdrop-blur-xl"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      alert.severity === 'impassable'
                        ? 'bg-[#ff2a55]/20 border border-[#ff2a55]/50 text-[#ff2a55]'
                        : alert.severity === 'severe'
                        ? 'bg-[#ffe600]/20 border border-[#ffe600]/50 text-[#ffe600]'
                        : 'bg-[#00f0ff]/20 border border-[#00f0ff]/50 text-[#00f0ff]'
                    }`}
                  >
                    <Waves className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading text-sm font-bold text-[#f0f4fc]">
                      {alert.title}
                    </span>
                    <span className="text-xs text-[#9cb4be]">
                      {alert.subLocation} • <span className="text-[#00f0ff]">{alert.city}, {alert.state}</span>
                    </span>
                  </div>
                </div>

                <span
                  className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase border whitespace-nowrap ${
                    alert.severity === 'impassable'
                      ? 'bg-[#ff2a55]/20 border-[#ff2a55]/40 text-[#ff2a55]'
                      : alert.severity === 'severe'
                      ? 'bg-[#ffe600]/20 border-[#ffe600]/40 text-[#ffe600]'
                      : 'bg-[#00f0ff]/20 border-[#00f0ff]/40 text-[#00f0ff]'
                  }`}
                >
                  {alert.severity}
                </span>
              </div>

              {/* Water Depth & Vehicle Passability Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#161d28]/90 border border-[#2b3846]/30 p-2 rounded-lg text-xs font-mono">
                <div>
                  <span className="text-[#9cb4be] block text-[10px]">Water Depth:</span>
                  <span className="font-bold text-[#ff2a55] text-sm">{alert.waterDepthCm} cm</span>
                </div>
                <div>
                  <span className="text-[#9cb4be] block text-[10px]">Passable For:</span>
                  <span className="font-bold text-[#f0f4fc] uppercase">
                    {alert.passableFor.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-[#9cb4be] block text-[10px]">Terrain Elev:</span>
                  <span className="text-[#00f0ff] font-bold">{alert.elevationM} m</span>
                </div>
                <div>
                  <span className="text-[#9cb4be] block text-[10px]">HAND Index:</span>
                  <span className="text-[#00ff88] font-bold">{alert.heightAboveDrainageM} m (Depression)</span>
                </div>
              </div>

              {/* Notes & Community Context */}
              <p className="text-xs text-[#f0f4fc] bg-[#06090f]/60 p-2 rounded border border-[#2b3846]/30 leading-snug">
                {alert.notes}
              </p>

              {/* Footer Actions (Upvote, Map Pin, Timestamp) */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-3 text-[#9cb4be] font-mono text-[10px]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#00f0ff]" />
                    <span>Reported {alert.reportedAtMinsAgo}m ago</span>
                  </div>
                  <span>•</span>
                  <span>{alert.verifiedCount} verified</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewOnMap(alert)}
                    className="px-2.5 py-1 rounded bg-[#161d28] border border-[#2b3846]/50 text-[#00f0ff] hover:bg-[#1e2634] text-[11px] font-mono flex items-center gap-1 transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>View Map</span>
                  </button>

                  <button
                    onClick={() => onUpvoteAlert(alert.id)}
                    className={`px-2.5 py-1 rounded border text-[11px] font-mono flex items-center gap-1 transition-all ${
                      alert.userVoted === 'up'
                        ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]'
                        : 'bg-[#161d28] border-[#2b3846]/50 text-[#9cb4be] hover:text-[#00ff88]'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Verify ({alert.verifiedCount})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
