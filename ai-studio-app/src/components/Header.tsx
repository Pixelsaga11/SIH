import React, { useState, useEffect } from 'react';
import { DispatchSection, ScreenTab } from '../types';

interface HeaderProps {
  currentSection: DispatchSection;
  allSections: DispatchSection[];
  onSelectSection: (section: DispatchSection) => void;
  onOpenEmergencyModal: () => void;
  activeScreen: ScreenTab;
  onToggleMobileSidebar?: () => void;
  isIncidentRailOpen?: boolean;
  onToggleIncidentRail?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  allSections,
  onSelectSection,
  onOpenEmergencyModal,
  activeScreen,
  onToggleMobileSidebar,
  isIncidentRailOpen = true,
  onToggleIncidentRail,
}) => {
  const [utcTime, setUtcTime] = useState<string>('14:38:09 UTC');
  const [istTime, setIstTime] = useState<string>('20:08:09 IST');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcHours = String(now.getUTCHours()).padStart(2, '0');
      const utcMin = String(now.getUTCMinutes()).padStart(2, '0');
      const utcSec = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${utcHours}:${utcMin}:${utcSec} UTC`);

      // IST is UTC + 5:30
      const istDate = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const istHours = String(istDate.getUTCHours()).padStart(2, '0');
      const istMin = String(istDate.getUTCMinutes()).padStart(2, '0');
      const istSec = String(istDate.getUTCSeconds()).padStart(2, '0');
      setIstTime(`${istHours}:${istMin}:${istSec} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getScreenTitle = (screen: ScreenTab) => {
    switch (screen) {
      case 'track-and-bridges':
        return 'Track & Bridges Telemetry';
      case 'overview':
        return 'Corridor Overview & Block Interlocks';
      case 'live-map':
        return 'Tactical Live Map & GIS Track Schematic';
      case 'train-health':
        return 'Rolling Stock Telemetry & FFT Diagnostics';
      case 'ai-prediction':
        return 'PINN Predictive Engine & RUL Simulation';
      default:
        return 'Operations Command Dashboard';
    }
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-[#000f21]/95 backdrop-blur-xl border-b border-[#1b2b3f] select-none">
      {/* Top Status Bar with Network Connectivity & Clocks */}
      <div className="px-4 py-1 flex items-center justify-between bg-[#000814] border-b border-[#102034] text-[10px] font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#4edea3]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]" />
            </span>
            <span className="font-bold tracking-widest uppercase hidden sm:inline">
              SYSTEM LIVE • WEBSOCKET CONNECTED
            </span>
            <span className="font-bold tracking-widest uppercase sm:hidden">
              LIVE
            </span>
          </div>

          <span className="hidden md:inline text-[#26364a]">|</span>
          <span className="hidden md:inline text-[#869397]">LATENCY: 14.2 ms</span>
          <span className="hidden md:inline text-[#26364a]">|</span>
          <span className="hidden lg:inline text-[#869397]">GNSS RTK LOCK: ±2mm</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#bcc9cd]">
            <span className="text-[#4cd7f6] font-bold">{istTime}</span>
            <span className="text-[#869397] hidden sm:inline">({utcTime})</span>
          </div>
          <span className="h-1.5 w-1.5 rounded-full bg-[#3d494c] hidden sm:inline" />
          <span className="px-1.5 py-0.2 rounded bg-[#0566d9]/30 text-[#4cd7f6] font-bold hidden sm:inline">
            ZONE: CR
          </span>
        </div>
      </div>

      {/* Main Command Bar */}
      <div className="h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded bg-[#102034] text-[#4cd7f6] hover:bg-[#1b2b3f] cursor-pointer"
              title="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-sm sm:text-base text-[#d3e4fe] font-bold truncate">
                {getScreenTitle(activeScreen)}
              </h1>
              <span className="hidden xl:inline px-2 py-0.5 rounded bg-[#102034] border border-[#26364a] text-[10px] text-[#4cd7f6] font-mono">
                DESK-04
              </span>
            </div>

            {/* Section Switcher Dropdown */}
            <div className="relative mt-0.5">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 group text-left cursor-pointer"
                title="Select Railway Dispatch Section"
              >
                <span className="text-[10px] text-[#869397] uppercase tracking-wider font-mono">
                  SECTOR:
                </span>
                <div className="flex items-center gap-1 bg-[#102034] group-hover:bg-[#1b2b3f] px-2 py-0.5 rounded border border-[#1b2b3f] transition-colors">
                  <span className="text-[11px] text-[#4cd7f6] font-bold font-mono">
                    {currentSection.id}
                  </span>
                  <span className="text-[10px] text-[#bcc9cd] hidden md:inline truncate max-w-[200px]">
                    • {currentSection.name}
                  </span>
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">
                    arrow_drop_down
                  </span>
                </div>
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-80 rounded bg-[#0b1c30] border border-[#26364a] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 border-b border-[#1b2b3f] flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#bcc9cd] uppercase tracking-wider">
                        Operational Dispatch Sectors
                      </span>
                      <span className="text-[10px] font-mono text-[#4cd7f6]">
                        {allSections.length} Sections
                      </span>
                    </div>
                    <div className="py-1 space-y-1">
                      {allSections.map((sec) => (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => {
                            onSelectSection(sec);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded flex items-center justify-between transition-colors cursor-pointer ${
                            sec.id === currentSection.id
                              ? 'bg-[#0566d9]/30 text-[#4cd7f6] font-bold'
                              : 'text-[#d3e4fe] hover:bg-[#102034]'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-mono font-bold">
                              {sec.id}
                            </span>
                            <span className="text-[10px] text-[#bcc9cd] line-clamp-1 font-sans">
                              {sec.name}
                            </span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#93000a]/40 text-[#ffb4ab] font-mono">
                            {sec.activeAnomalies} alerts
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Toggle Live Incident Rail on/off */}
          {onToggleIncidentRail && (
            <button
              type="button"
              onClick={onToggleIncidentRail}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-mono transition-all cursor-pointer ${
                isIncidentRailOpen
                  ? 'bg-[#102034] border-[#4cd7f6] text-[#4cd7f6]'
                  : 'bg-[#0b1c30] border-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
              }`}
              title={isIncidentRailOpen ? 'Hide Incident Rail' : 'Show Incident Rail'}
            >
              <span className="material-symbols-outlined text-[16px]">sensors</span>
              <span className="text-[11px] hidden lg:inline">Telemetry Rail</span>
            </button>
          )}

          {/* Emergency Line Halt Alert Trigger */}
          <button
            type="button"
            onClick={onOpenEmergencyModal}
            aria-label="Emergency Line Halt Broadcast"
            className="px-2.5 sm:px-3 py-1.5 rounded bg-[#93000a]/30 hover:bg-[#93000a]/60 text-[#ffb4ab] border border-[#ffb4ab]/40 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Trigger Immediate Line Halt & Safety Broadcast"
          >
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
              LINE HALT
            </span>
            <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping" />
          </button>

          {/* User Profile Avatar */}
          <div
            className="w-8 h-8 rounded bg-[#102034] border border-[#26364a] text-[#4cd7f6] flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:border-[#4cd7f6]"
            title="Senior Controller Desk #04"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
