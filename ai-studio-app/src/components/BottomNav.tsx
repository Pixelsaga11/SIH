import React from 'react';
import { ScreenTab } from '../types';

interface BottomNavProps {
  activeScreen: ScreenTab;
  onSelectScreen: (screen: ScreenTab) => void;
}

interface NavItem {
  id: ScreenTab;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'live-map', label: 'Live Map', icon: 'map' },
  { id: 'train-health', label: 'Health', icon: 'vital_signs' },
  { id: 'track-and-bridges', label: 'Track/Brg', icon: 'timeline' },
  { id: 'ai-prediction', label: 'Predict', icon: 'psychology' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onSelectScreen }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-40 pb-safe bg-[#000f21]/95 backdrop-blur-xl border-t border-[#1b2b3f]/80 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-4xl mx-auto flex items-center justify-around h-16 sm:h-20 px-1 sm:px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded transition-all cursor-pointer ${
                isActive
                  ? 'text-[#4cd7f6] bg-[#26364a]/50 font-bold shadow-inner'
                  : 'text-[#bcc9cd] hover:text-[#d3e4fe] hover:bg-[#102034]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                }}
              >
                {item.icon}
              </span>
              <span className="font-label-sm uppercase tracking-wider text-[9px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-0.5 rounded-full bg-[#4cd7f6] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
