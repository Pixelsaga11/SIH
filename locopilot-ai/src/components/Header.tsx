import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { LocoEmblem } from './LocoEmblem';

interface HeaderProps {
  activeTab: TabType;
  cabinMode: 'dark' | 'red' | 'bright';
  onTabChange?: (tab: TabType) => void;
  onToggleCabinMode: () => void;
  onOpenSos: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  cabinMode,
  onTabChange,
  onToggleCabinMode,
  onOpenSos,
  onOpenProfile,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('18:34:12');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { id: TabType; label: string; icon: string; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Master Cockpit', icon: 'dashboard' },
    { id: 'live-hud', label: 'Cab HUD & Speed', icon: 'speed', badge: '50 MANDATE', badgeColor: 'bg-error/20 text-error' },
    { id: 'fog-visibility', label: 'Fog & Visibility', icon: 'cloud', badge: '450m FOG', badgeColor: 'bg-error-container text-error animate-pulse' },
    { id: 'maintenance', label: 'Train Health AI', icon: 'troubleshoot', badge: '1 CRITICAL', badgeColor: 'bg-error text-on-error animate-pulse' },
    { id: 'crossing-and-ai-delay', label: 'AI Delay & Crossing', icon: 'alt_route', badge: '+12m', badgeColor: 'bg-secondary/20 text-secondary' },
    { id: 'route-profile', label: 'Route & Ghat', icon: 'terrain', badge: '1:37 GHAT', badgeColor: 'bg-primary/20 text-primary' },
    { id: 'what-if-and-sos', label: 'What-If Sandbox', icon: 'sim_card_download' },
  ];

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-surface-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      {/* TOP SYSTEM & TELEMETRY STRIP */}
      <div className="w-full px-3 sm:px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-surface-variant/20">
        {/* Left: Branding & Locomotive Profile */}
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-2.5">
            <LocoEmblem className="h-9 w-auto object-contain" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
                  RAILSENSE AI
                </span>
                <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary font-label-code text-[10px] font-bold uppercase tracking-wider">
                  MISSION DASHBOARD
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-label-code text-on-surface-variant">
                <span className="text-on-surface font-semibold">12626 DN (KERALA EXP)</span>
                <span>•</span>
                <span>WAP-7 #30211 (SRC)</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-secondary font-medium">LONAVALA – KARJAT GHAT KM 112.4</span>
              </div>
            </div>
          </div>

          {/* Quick Controls for Mobile (Light, SOS, Pilot) */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onToggleCabinMode}
              title={`Cabin Light: ${cabinMode}`}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                cabinMode === 'red'
                  ? 'bg-error-container text-error ring-1 ring-error'
                  : cabinMode === 'bright'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {cabinMode === 'red' ? 'flare' : cabinMode === 'bright' ? 'wb_sunny' : 'light_mode'}
              </span>
            </button>
            <button
              onClick={onOpenSos}
              className="h-8 px-2 rounded-lg bg-error text-on-error font-label-code text-[11px] font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">e911_emergency</span>
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* Center: Live Avionics Telemetry Chips (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 font-label-code text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container border border-surface-variant/30 text-tertiary">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
            <span className="font-bold">GPS: RTK LOCKED (0.02m)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container border border-surface-variant/30 text-primary">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>OHE: 24.6 kV AC</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container border border-surface-variant/30 text-tertiary">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span className="font-bold">KAWACH: ARMED</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container border border-surface-variant/30 text-on-surface">
            <span className="material-symbols-outlined text-[14px] text-secondary">radio</span>
            <span>VHF CH-04 (CSMT)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container border border-surface-variant/30 text-on-surface">
            <span className="material-symbols-outlined text-[14px] text-tertiary">speed</span>
            <span>BP: 5.0 bar</span>
          </div>
        </div>

        {/* Right: Clock & Master Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Digital Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-high border border-surface-variant/40 font-label-code">
            <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
            <span className="text-on-surface font-bold text-sm tracking-wider">{currentTime}</span>
            <span className="text-[10px] text-on-surface-variant">IST</span>
          </div>

          {/* Cabin Lighting Mode Toggle */}
          <button
            id="cabin-light-toggle"
            onClick={onToggleCabinMode}
            title={`Cabin Light Mode: ${cabinMode}`}
            className={`h-9 px-2.5 rounded-lg font-label-code text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border ${
              cabinMode === 'red'
                ? 'bg-error-container text-error border-error shadow-sm shadow-error/20'
                : cabinMode === 'bright'
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-bright border-surface-variant/40'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {cabinMode === 'red' ? 'flare' : cabinMode === 'bright' ? 'wb_sunny' : 'light_mode'}
            </span>
            <span className="uppercase text-[10px]">{cabinMode}</span>
          </button>

          {/* Distress SOS Button */}
          <button
            id="sos-header-btn"
            onClick={onOpenSos}
            className="h-9 px-3 rounded-lg bg-error text-on-error hover:bg-error/90 active:scale-95 transition-all shadow-md shadow-error/30 flex items-center gap-1.5 font-label-code text-xs font-bold tracking-wider"
          >
            <span className="material-symbols-outlined text-[18px] animate-pulse">e911_emergency</span>
            <span>SOS</span>
          </button>

          {/* Loco Pilot Profile Dossier */}
          <button
            id="pilot-profile-btn"
            onClick={onOpenProfile}
            title="Loco Pilot Dossier & Trip Log"
            className="h-9 px-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface border border-surface-variant/40 flex items-center gap-1.5 font-label-code text-xs active:scale-95 transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-black">
              LP
            </div>
            <span className="font-bold text-[11px]">R. SHARMA</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD MODULE NAVIGATION TABS */}
      <div className="w-full px-2 sm:px-6 py-1.5 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1 sm:gap-2 min-w-max">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`dashboard-nav-tab-${item.id}`}
                onClick={() => onTabChange && onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-code text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap active:scale-95 relative ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[17px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black tracking-tight ${
                      isActive ? 'bg-black/30 text-white' : item.badgeColor || 'bg-surface-container-highest text-on-surface'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tactical Status Overview on right */}
        <div className="hidden lg:flex items-center gap-3 font-label-code text-[11px] text-on-surface-variant shrink-0 pl-2">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span>SECTION CLEAR: LONAVALA HOME</span>
          </span>
          <span className="text-surface-variant">|</span>
          <span className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[13px]">tune</span>
            <span>RECOVERY NOTCH: 18</span>
          </span>
        </div>
      </div>
    </header>
  );
};
