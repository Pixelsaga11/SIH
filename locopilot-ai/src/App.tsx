/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TabType } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardScreen } from './components/DashboardScreen';
import { LiveHudScreen } from './components/LiveHudScreen';
import { AiDelayScreen } from './components/AiDelayScreen';
import { RouteProfileScreen } from './components/RouteProfileScreen';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { FogVisibilityScreen } from './components/FogVisibilityScreen';
import { WhatIfScreen } from './components/WhatIfScreen';
import { SosModal } from './components/SosModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [cabinMode, setCabinMode] = useState<'dark' | 'red' | 'bright'>('dark');
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const toggleCabinMode = () => {
    setCabinMode((prev) => {
      if (prev === 'dark') return 'red';
      if (prev === 'red') return 'bright';
      return 'dark';
    });
  };

  const getCabinFilterStyle = () => {
    if (cabinMode === 'red') {
      return 'hue-rotate-[320deg] saturate-150 contrast-125';
    }
    if (cabinMode === 'bright') {
      return 'brightness-110';
    }
    return '';
  };

  return (
    <div
      className={`min-h-screen bg-surface text-on-surface flex flex-col items-center selection:bg-primary selection:text-on-primary relative transition-all duration-300 ${getCabinFilterStyle()}`}
    >
      {/* Night vision ambient indicator banner if in Red Mode */}
      {cabinMode === 'red' && (
        <div className="w-full bg-error/90 text-on-error font-label-code text-label-code text-center py-1 tracking-widest uppercase z-50 sticky top-0 shadow-md">
          COCKPIT NIGHT-VISION RED FILTER ENGAGED • ALL SENSOR DISPLAYS ATTENUATED
        </div>
      )}

      {/* Main Cockpit Display Frame - Full Widescreen Operations Dashboard */}
      <div className="w-full max-w-[1720px] min-h-screen bg-surface flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border-x border-surface-variant/20 transition-all duration-300">
        {/* Sticky Top Status & Dashboard Module Nav Header */}
        <Header
          activeTab={activeTab}
          cabinMode={cabinMode}
          onTabChange={setActiveTab}
          onToggleCabinMode={toggleCabinMode}
          onOpenSos={() => setIsSosOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Primary Dashboard Workspace with Motion Page Transitions */}
        <main className="flex-1 w-full pt-4 pb-20 md:pb-8 relative overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="w-full"
            >
              {activeTab === 'dashboard' && <DashboardScreen onNavigateTab={setActiveTab} />}
              {activeTab === 'live-hud' && <LiveHudScreen />}
              {activeTab === 'fog-visibility' && <FogVisibilityScreen onNavigateTab={setActiveTab} />}
              {activeTab === 'crossing-and-ai-delay' && <AiDelayScreen />}
              {activeTab === 'route-profile' && <RouteProfileScreen />}
              {activeTab === 'maintenance' && <MaintenanceScreen onNavigateTab={setActiveTab} />}
              {activeTab === 'what-if-and-sos' && <WhatIfScreen />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation Bar for Mobile Handheld Viewports Only */}
        <div className="md:hidden">
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Distress SOS Modal */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      {/* Pilot & Locomotive Dossier Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
