import React, { useState, useEffect } from 'react';
import {
  DISPATCH_SECTIONS,
  INITIAL_ASSETS,
  INITIAL_TELEMETRY_EVENTS,
  INITIAL_WORKORDERS,
  LIVE_TRAINS,
  TRACK_BLOCKS,
} from './data/telemetryData';
import { DispatchSection, MetricSummary, ScreenTab, TelemetryEvent, Workorder } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LiveIncidentRail } from './components/LiveIncidentRail';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { TrackAndBridgesScreen } from './components/screens/TrackAndBridgesScreen';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { LiveMapScreen } from './components/screens/LiveMapScreen';
import { HealthScreen } from './components/screens/HealthScreen';
import { PredictScreen } from './components/screens/PredictScreen';
import { CreateWorkorderModal } from './components/modals/CreateWorkorderModal';
import { DispatchSquadModal } from './components/modals/DispatchSquadModal';
import { SafetyLogModal } from './components/modals/SafetyLogModal';
import { EmergencyModal } from './components/modals/EmergencyModal';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenTab>('track-and-bridges');
  const [currentSection, setCurrentSection] = useState<DispatchSection>(DISPATCH_SECTIONS[0]);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [workorders, setWorkorders] = useState<Workorder[]>(INITIAL_WORKORDERS);
  const [trains, setTrains] = useState(LIVE_TRAINS);
  const [blocks, setBlocks] = useState(TRACK_BLOCKS);
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>(INITIAL_TELEMETRY_EVENTS);

  // Dashboard layout states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isIncidentRailOpen, setIsIncidentRailOpen] = useState(true);

  const [metrics, setMetrics] = useState<MetricSummary>({
    fleetHealth: 88,
    trackAnomalies: 14,
    bridgesWatch: 3,
    urgentWOs: 5,
  });

  // Modals & Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCreateWorkorderOpen, setIsCreateWorkorderOpen] = useState(false);
  const [isDispatchSquadOpen, setIsDispatchSquadOpen] = useState(false);
  const [isSafetyLogOpen, setIsSafetyLogOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Trigger feedback toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Subtle live train telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains((prev) =>
        prev.map((t) => {
          const newLoc = Number((t.locationKm + 0.05).toFixed(2));
          return {
            ...t,
            locationKm: newLoc > 128 ? 110 : newLoc,
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Periodic simulated live telemetry event pulse
  useEffect(() => {
    const sampleEvents = [
      {
        source: 'Track T-408 FBG',
        category: 'track' as const,
        type: 'WARNING' as const,
        message: 'Acoustic micro-vibration stabilized under TSR 30 (Dynamic load -42%)',
        location: 'Km 118.4',
      },
      {
        source: 'WILD Scanner #02',
        category: 'loco' as const,
        type: 'INFO' as const,
        message: 'Wheel impact load profile nominal across 32 axles on BOXN freight rake',
        location: 'Post #7 North',
      },
      {
        source: 'Bridge B-104 Sonar',
        category: 'bridges' as const,
        type: 'INFO' as const,
        message: 'Scour depth stable at 1.82m. Hydrological turbulence within limit.',
        location: 'Pier 3 Ulhas',
      },
      {
        source: 'Catenary SEC-09',
        category: 'ohe' as const,
        type: 'SUCCESS' as const,
        message: 'OHE dropper tension balance verified nominal (24.8 kV AC)',
        location: 'Km 116.8',
      },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(
        now.getUTCMinutes()
      ).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;

      const pick = sampleEvents[idx % sampleEvents.length];
      idx++;

      const newEvent: TelemetryEvent = {
        id: `evt-${Date.now()}`,
        timestamp: timeStr,
        source: pick.source,
        category: pick.category,
        type: pick.type,
        message: pick.message,
        location: pick.location,
      };

      setTelemetryEvents((prev) => [newEvent, ...prev.slice(0, 24)]);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const handleAddWorkorder = (newWo: Workorder) => {
    setWorkorders((prev) => [newWo, ...prev]);
    setMetrics((prev) => ({ ...prev, urgentWOs: prev.urgentWOs + 1 }));

    // Also add to event buffer
    const now = new Date();
    const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(
      now.getUTCMinutes()
    ).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;

    const woEvent: TelemetryEvent = {
      id: `evt-${Date.now()}`,
      timestamp: timeStr,
      source: `Workorder ${newWo.id}`,
      category: 'system',
      type: 'CRITICAL',
      message: `Safety WO Issued: ${newWo.assetTitle} (${newWo.priority})`,
      location: newWo.gang,
    };
    setTelemetryEvents((prev) => [woEvent, ...prev]);

    triggerToast(`Workorder ${newWo.id} Issued for ${newWo.assetTitle} (${newWo.priority})`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#000814] text-[#d3e4fe] font-mono selection:bg-[#4cd7f6] selection:text-[#003640]">
      {/* Persistent Left Operations Sidebar */}
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={(s) => setActiveScreen(s)}
        currentSection={currentSection}
        allSections={DISPATCH_SECTIONS}
        onSelectSection={(sec) => {
          setCurrentSection(sec);
          triggerToast(`Section Switched to ${sec.id}: ${sec.name}`);
        }}
        onOpenCreateWorkorder={() => setIsCreateWorkorderOpen(true)}
        onOpenDispatchSquad={() => setIsDispatchSquadOpen(true)}
        onOpenSafetyLog={() => setIsSafetyLogOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Dashboard Workspace */}
      <div className="flex flex-col flex-1 h-screen min-w-0 overflow-hidden bg-[#031427]">
        {/* Top Command Bar */}
        <Header
          currentSection={currentSection}
          allSections={DISPATCH_SECTIONS}
          onSelectSection={(sec) => {
            setCurrentSection(sec);
            triggerToast(`Section Switched to ${sec.id}: ${sec.name}`);
          }}
          onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
          activeScreen={activeScreen}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isIncidentRailOpen={isIncidentRailOpen}
          onToggleIncidentRail={() => setIsIncidentRailOpen(!isIncidentRailOpen)}
        />

        {/* Workspace Canvas with Telemetry Drawer */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {/* Scrollable Main Screen Canvas */}
          <main className="flex-1 overflow-y-auto min-w-0 pb-16 lg:pb-6">
            {activeScreen === 'track-and-bridges' && (
              <TrackAndBridgesScreen
                assets={assets}
                metrics={metrics}
                onTriggerAction={triggerToast}
                onOpenCreateWorkorder={() => setIsCreateWorkorderOpen(true)}
                onOpenDispatchSquad={() => setIsDispatchSquadOpen(true)}
                onOpenSafetyLog={() => setIsSafetyLogOpen(true)}
              />
            )}

            {activeScreen === 'overview' && (
              <OverviewScreen
                metrics={metrics}
                blocks={blocks}
                trains={trains}
                onNavigateToTab={(tab) => setActiveScreen(tab)}
                onTriggerAction={triggerToast}
              />
            )}

            {activeScreen === 'live-map' && (
              <LiveMapScreen
                trains={trains}
                blocks={blocks}
                onTriggerAction={triggerToast}
              />
            )}

            {activeScreen === 'train-health' && (
              <HealthScreen onTriggerAction={triggerToast} />
            )}

            {activeScreen === 'ai-prediction' && (
              <PredictScreen onTriggerAction={triggerToast} />
            )}
          </main>

          {/* Right Live Incident & Telemetry Stream Rail */}
          <div className="hidden lg:block h-full shrink-0">
            <LiveIncidentRail
              events={telemetryEvents}
              trains={trains}
              onTriggerAction={triggerToast}
              isOpen={isIncidentRailOpen}
              onToggle={() => setIsIncidentRailOpen(!isIncidentRailOpen)}
            />
          </div>
        </div>

        {/* Mobile Persistent Bottom Bar (Visible on mobile/tablet screens < lg) */}
        <div className="lg:hidden">
          <BottomNav
            activeScreen={activeScreen}
            onSelectScreen={(screen) => setActiveScreen(screen)}
          />
        </div>
      </div>

      {/* Floating Tactical Notification Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Interlock Modals */}
      <CreateWorkorderModal
        isOpen={isCreateWorkorderOpen}
        onClose={() => setIsCreateWorkorderOpen(false)}
        onAddWorkorder={handleAddWorkorder}
      />

      <DispatchSquadModal
        isOpen={isDispatchSquadOpen}
        onClose={() => setIsDispatchSquadOpen(false)}
        onTriggerAction={triggerToast}
      />

      <SafetyLogModal
        isOpen={isSafetyLogOpen}
        onClose={() => setIsSafetyLogOpen(false)}
        workorders={workorders}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onTriggerAction={triggerToast}
      />
    </div>
  );
}
