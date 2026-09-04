import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: TabType; label: string; icon: string; path: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: 'dashboard' },
    { id: 'live-hud', label: 'HUD', icon: 'speed', path: 'live-hud' },
    { id: 'fog-visibility', label: 'Fog', icon: 'cloud', path: 'fog-visibility' },
    { id: 'maintenance', label: 'Health', icon: 'troubleshoot', path: 'maintenance' },
    { id: 'crossing-and-ai-delay', label: 'AI Delay', icon: 'alt_route', path: 'crossing-and-ai-delay' },
    { id: 'route-profile', label: 'Profile', icon: 'show_chart', path: 'route-profile' },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.6)] border-t border-surface-variant/30"
      data-active-classes="text-primary font-bold"
    >
      <div className="flex justify-around items-center h-18 px-1 max-w-7xl mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              data-path={item.path}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[50px] max-w-[80px] min-h-touch-target-min transition-all select-none relative ${
                isActive ? 'text-primary font-bold scale-105' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 rounded-full bg-primary shadow-[0_0_8px_#4cd7f6]" />
              )}
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-label-code text-[10px] uppercase text-center leading-none truncate w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
