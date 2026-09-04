import React from 'react';
import { DispatchSection, ScreenTab } from '../types';

interface SidebarProps {
  activeScreen: ScreenTab;
  onSelectScreen: (screen: ScreenTab) => void;
  currentSection: DispatchSection;
  allSections: DispatchSection[];
  onSelectSection: (section: DispatchSection) => void;
  onOpenCreateWorkorder: () => void;
  onOpenDispatchSquad: () => void;
  onOpenSafetyLog: () => void;
  onOpenEmergencyModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItemConfig {
  id: ScreenTab;
  label: string;
  sublabel: string;
  icon: string;
  badge?: string;
  badgeVariant?: 'error' | 'primary' | 'secondary';
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'overview',
    label: 'Corridor Dashboard',
    sublabel: 'Network Overview & Blocks',
    icon: 'dashboard',
  },
  {
    id: 'track-and-bridges',
    label: 'Track & Bridges',
    sublabel: 'Active Defect Diagnostics',
    icon: 'timeline',
    badge: '14 Alerts',
    badgeVariant: 'error',
  },
  {
    id: 'live-map',
    label: 'Tactical Live Map',
    sublabel: 'Corridor GIS & Trains',
    icon: 'map',
    badge: '4 Trains',
    badgeVariant: 'primary',
  },
  {
    id: 'train-health',
    label: 'Rolling Stock Health',
    sublabel: 'Hotbox & Catenary FFT',
    icon: 'vital_signs',
    badge: '3 Critical',
    badgeVariant: 'error',
  },
  {
    id: 'ai-prediction',
    label: 'AI Predictive Engine',
    sublabel: 'RUL & PINN Simulator',
    icon: 'psychology',
    badge: '98.4%',
    badgeVariant: 'secondary',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onSelectScreen,
  currentSection,
  allSections,
  onSelectSection,
  onOpenCreateWorkorder,
  onOpenDispatchSquad,
  onOpenSafetyLog,
  onOpenEmergencyModal,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#000f21] border-r border-[#1b2b3f] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen lg:shrink-0 select-none`}
      >
        {/* Top Branding & Division */}
        <div className="flex flex-col border-b border-[#1b2b3f]">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#102034] border border-[#26364a] flex items-center justify-center text-[#4cd7f6] shadow-sm">
                <span className="material-symbols-outlined text-[22px]">train</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-base text-[#d3e4fe] font-black tracking-wider uppercase">
                    RAILSENSE
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#0566d9]/30 text-[#4cd7f6] font-mono font-bold">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-[#869397] uppercase tracking-widest font-mono">
                  CR CENTRAL OPERATIONS
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded text-[#bcc9cd] hover:text-[#d3e4fe] hover:bg-[#1b2b3f]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Section Selector Quick Dock */}
          <div className="px-4 pb-3">
            <div className="p-2.5 rounded bg-[#0b1c30] border border-[#1b2b3f] flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] text-[#869397] font-mono">
                <span className="uppercase tracking-wider">ACTIVE DISPATCH SECTOR</span>
                <span className="flex items-center gap-1 text-[#4edea3]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                  INTERLOCKED
                </span>
              </div>

              <select
                value={currentSection.id}
                onChange={(e) => {
                  const target = allSections.find((s) => s.id === e.target.value);
                  if (target) onSelectSection(target);
                }}
                aria-label="Active Dispatch Sector"
                className="w-full bg-[#000f21] border border-[#26364a] rounded px-2.5 py-1.5 text-xs text-[#4cd7f6] font-bold focus:outline-none focus:border-[#4cd7f6] cursor-pointer"
              >
                {allSections.map((sec) => (
                  <option key={sec.id} value={sec.id} className="bg-[#102034] text-[#d3e4fe]">
                    {sec.id} • {sec.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between text-[10px] text-[#bcc9cd] pt-0.5">
                <span>{currentSection.division}</span>
                <span className="text-[#ffb4ab] font-mono font-bold">
                  {currentSection.activeAnomalies} Anomalies
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Item Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase text-[#869397] tracking-wider">
            OPERATIONS DESK
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectScreen(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#102034] border border-[#26364a] text-[#4cd7f6] shadow-sm'
                    : 'text-[#bcc9cd] hover:bg-[#0b1c30] hover:text-[#d3e4fe]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${
                      isActive ? 'text-[#4cd7f6]' : 'text-[#869397]'
                    }`}
                    style={{
                      fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                    }}
                  >
                    {item.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-tight tracking-wide">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-[#869397] line-clamp-1">
                      {item.sublabel}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      item.badgeVariant === 'error'
                        ? 'bg-[#93000a]/50 text-[#ffb4ab] border border-[#ffb4ab]/30'
                        : item.badgeVariant === 'primary'
                        ? 'bg-[#0566d9]/40 text-[#4cd7f6] border border-[#4cd7f6]/30'
                        : 'bg-[#26364a] text-[#adc6ff]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Tactical Quick Interlocks Section */}
          <div className="pt-4 px-2 pb-1 text-[10px] font-mono uppercase text-[#869397] tracking-wider">
            DISPATCH INTERLOCKS
          </div>

          <div className="space-y-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => {
                onOpenCreateWorkorder();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded bg-[#0b1c30] hover:bg-[#102034] text-[#d3e4fe] border border-[#1b2b3f] hover:border-[#4cd7f6]/40 text-xs font-medium transition-all text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                add_circle
              </span>
              <span>Issue Workorder</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenDispatchSquad();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded bg-[#0b1c30] hover:bg-[#102034] text-[#d3e4fe] border border-[#1b2b3f] hover:border-[#4edea3]/40 text-xs font-medium transition-all text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#4edea3] text-[18px]">
                engineering
              </span>
              <span>Rapid Response Squad</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenSafetyLog();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded bg-[#0b1c30] hover:bg-[#102034] text-[#d3e4fe] border border-[#1b2b3f] hover:border-[#adc6ff]/40 text-xs font-medium transition-all text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
                description
              </span>
              <span>Safety Audit Log</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenEmergencyModal();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/40 text-xs font-bold transition-all text-left cursor-pointer shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">emergency</span>
                <span>Emergency Line Halt</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">lock</span>
            </button>
          </div>
        </div>

        {/* Footer Station Master & Hardware Health */}
        <div className="p-3 border-t border-[#1b2b3f] bg-[#000f21] flex flex-col gap-2">
          <div className="p-2 rounded bg-[#0b1c30] border border-[#1b2b3f] flex items-center justify-between text-[10px] font-mono text-[#bcc9cd]">
            <div className="flex flex-col">
              <span className="text-[#869397]">FIBER SENSOR ARRAY</span>
              <span className="text-[#4edea3] font-bold">128/128 ACTIVE</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[#869397]">SAMPLING RATE</span>
              <span className="text-[#4cd7f6] font-bold">250 Hz FFT</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#4cd7f6] flex items-center justify-center text-[#003640] font-bold text-xs">
                D4
              </div>
              <div className="flex flex-col">
                <span className="text-[#d3e4fe] font-bold text-[11px] leading-tight">
                  Dispatcher-04
                </span>
                <span className="text-[10px] text-[#869397]">Duty: 14:00-22:00</span>
              </div>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-[#4edea3] animate-ping" />
          </div>
        </div>
      </aside>
    </>
  );
};
