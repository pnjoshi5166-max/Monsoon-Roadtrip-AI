/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ForecastView } from './components/ForecastView';
import { MonsoonMap } from './components/MonsoonMap';
import { RouteNavigator } from './components/RouteNavigator';
import { CommunityAlertsView } from './components/CommunityAlertsView';
import { ReportModal } from './components/ReportModal';
import { NavigationSimulationModal } from './components/NavigationSimulationModal';
import { GeeArchitectureModal } from './components/GeeArchitectureModal';
import { INITIAL_WATERLOGGING_ALERTS, MONSOON_ROUTE_PRESETS } from './services/mockData';
import { TabType, WaterloggingAlert, MonsoonRoutePreset } from './types';
import {
  Thermometer,
  Radio,
  Navigation,
  Waves,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('forecast');
  const [currentCity, setCurrentCity] = useState<string>('Mumbai, Maharashtra');
  const [alerts, setAlerts] = useState<WaterloggingAlert[]>(INITIAL_WATERLOGGING_ALERTS);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [geeBlueprintOpen, setGeeBlueprintOpen] = useState(false);
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [simulationPreset, setSimulationPreset] = useState<MonsoonRoutePreset>(MONSOON_ROUTE_PRESETS[0]);
  const [activeRoutingPresetId, setActiveRoutingPresetId] = useState<string>('mumbai-goa');

  const handleUpvoteAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === alertId) {
          const isUpvoted = alert.userVoted === 'up';
          return {
            ...alert,
            verifiedCount: isUpvoted ? alert.verifiedCount - 1 : alert.verifiedCount + 1,
            userVoted: isUpvoted ? undefined : 'up',
          };
        }
        return alert;
      })
    );
  };

  const handleCreateAlert = (newAlertData: Omit<WaterloggingAlert, 'id' | 'reportedAtMinsAgo' | 'verifiedCount'>) => {
    const created: WaterloggingAlert = {
      ...newAlertData,
      id: `alert-${Date.now()}`,
      reportedAtMinsAgo: 1,
      verifiedCount: 1,
      userVoted: 'up',
    };
    setAlerts((prev) => [created, ...prev]);
  };

  const handleStartSimulation = (preset: MonsoonRoutePreset) => {
    setSimulationPreset(preset);
    setSimulationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090e16] text-[#f0f4fc] font-sans flex flex-col selection:bg-[#00f0ff]/30 selection:text-[#00f0ff]">
      {/* Tactical Header */}
      <Header
        currentCity={currentCity}
        onSelectCity={setCurrentCity}
        onOpenGeeBlueprint={() => setGeeBlueprintOpen(true)}
        unreadAlertsCount={alerts.filter((a) => a.severity === 'impassable').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-32 pb-20">
        {activeTab === 'forecast' && (
          <ForecastView
            onNavigateToMap={() => setActiveTab('live-radar-map')}
            onNavigateToRouting={(presetId) => {
              if (presetId) setActiveRoutingPresetId(presetId);
              setActiveTab('safe-navigator');
            }}
            onNavigateToAlerts={() => setActiveTab('community-alerts')}
          />
        )}

        {activeTab === 'live-radar-map' && (
          <MonsoonMap
            onOpenReportModal={() => setReportModalOpen(true)}
            onSelectAlert={() => {}}
          />
        )}

        {activeTab === 'safe-navigator' && (
          <RouteNavigator
            initialPresetId={activeRoutingPresetId}
            onStartSimulation={handleStartSimulation}
          />
        )}

        {activeTab === 'community-alerts' && (
          <CommunityAlertsView
            alerts={alerts}
            onUpvoteAlert={handleUpvoteAlert}
            onOpenReportModal={() => setReportModalOpen(true)}
            onViewOnMap={() => setActiveTab('live-radar-map')}
          />
        )}
      </main>

      {/* Fixed Mobile & Desktop Bottom Navigation Tab Bar */}
      <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#06090f]/95 backdrop-blur-2xl border-t border-[#2b3846]/40 shadow-[0_-4px_24px_rgba(0,0,0,0.8)]">
        <div className="h-16 max-w-5xl mx-auto px-3 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('forecast')}
            className={`flex flex-col items-center justify-center min-w-[64px] h-12 gap-1 transition-colors ${
              activeTab === 'forecast'
                ? 'text-[#00f0ff] font-bold'
                : 'text-[#9cb4be] hover:text-[#f0f4fc]'
            }`}
          >
            <Thermometer className="w-5 h-5" />
            <span className="font-mono text-[10px] tracking-tight">Forecast</span>
          </button>

          <button
            onClick={() => setActiveTab('live-radar-map')}
            className={`flex flex-col items-center justify-center min-w-[64px] h-12 gap-1 transition-colors ${
              activeTab === 'live-radar-map'
                ? 'text-[#00f0ff] font-bold'
                : 'text-[#9cb4be] hover:text-[#f0f4fc]'
            }`}
          >
            <Radio className="w-5 h-5" />
            <span className="font-mono text-[10px] tracking-tight">Live Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('safe-navigator')}
            className={`flex flex-col items-center justify-center min-w-[64px] h-12 gap-1 transition-colors ${
              activeTab === 'safe-navigator'
                ? 'text-[#00f0ff] font-bold'
                : 'text-[#9cb4be] hover:text-[#f0f4fc]'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span className="font-mono text-[10px] tracking-tight">Safe Navigator</span>
          </button>

          <button
            onClick={() => setActiveTab('community-alerts')}
            className={`flex flex-col items-center justify-center min-w-[64px] h-12 gap-1 transition-colors relative ${
              activeTab === 'community-alerts'
                ? 'text-[#00f0ff] font-bold'
                : 'text-[#9cb4be] hover:text-[#f0f4fc]'
            }`}
          >
            <Waves className="w-5 h-5" />
            <span className="font-mono text-[10px] tracking-tight">Waterlogging</span>
            {alerts.length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#ff2a55]"></span>
            )}
          </button>
        </div>
      </nav>

      {/* Modals */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleCreateAlert}
      />

      <NavigationSimulationModal
        isOpen={simulationModalOpen}
        onClose={() => setSimulationModalOpen(false)}
        preset={simulationPreset}
      />

      <GeeArchitectureModal
        isOpen={geeBlueprintOpen}
        onClose={() => setGeeBlueprintOpen(false)}
      />
    </div>
  );
}
