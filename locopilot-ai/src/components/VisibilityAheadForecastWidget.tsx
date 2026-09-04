import React from 'react';
import { RouteVisibilityPoint, FogWarningLevel } from '../types';

interface VisibilityAheadForecastWidgetProps {
  points?: RouteVisibilityPoint[];
  compact?: boolean;
  onNavigateFogModule?: () => void;
  onSimulateFogChange?: (meters: number) => void;
}

export const VisibilityAheadForecastWidget: React.FC<VisibilityAheadForecastWidgetProps> = ({
  points = [
    {
      distanceLabel: 'NOW',
      distanceKm: 0,
      visibilityMeters: 2100,
      warningLevel: 'NORMAL',
      trend: 'stable',
      landmark: 'Lonavala Outers',
      statusBadge: '2.1 km 🟢',
    },
    {
      distanceLabel: '5 KM',
      distanceKm: 5.0,
      visibilityMeters: 900,
      warningLevel: 'LOW',
      trend: 'worsening',
      landmark: 'Khandala Viaduct',
      statusBadge: '900 m 🟡',
    },
    {
      distanceLabel: '10 KM',
      distanceKm: 10.0,
      visibilityMeters: 420,
      warningLevel: 'VERY_LOW',
      trend: 'worsening',
      landmark: 'Monkey Hill Cutting',
      statusBadge: '420 m 🔴',
    },
    {
      distanceLabel: '15 KM',
      distanceKm: 15.0,
      visibilityMeters: 250,
      warningLevel: 'VERY_LOW',
      trend: 'worsening',
      landmark: 'Tunnel 24 Portal',
      statusBadge: '250 m 🔴',
    },
    {
      distanceLabel: '20 KM',
      distanceKm: 20.0,
      visibilityMeters: 1800,
      warningLevel: 'REDUCED',
      trend: 'improving',
      landmark: 'Karjat Jn Approaches',
      statusBadge: '1.8 km 🟢',
    },
  ],
  compact = false,
  onNavigateFogModule,
}) => {
  const getBadgeStyle = (level: FogWarningLevel | string) => {
    switch (level) {
      case 'NORMAL':
        return 'text-tertiary bg-tertiary/10 border-tertiary/30';
      case 'REDUCED':
        return 'text-secondary bg-secondary/10 border-secondary/30';
      case 'LOW':
        return 'text-secondary bg-secondary-container/40 border-secondary/40';
      case 'VERY_LOW':
        return 'text-error bg-error-container/40 border-error/40';
      case 'CRITICAL':
        return 'text-error bg-error/20 border-error font-bold animate-pulse';
      default:
        return 'text-on-surface-variant bg-surface-container';
    }
  };

  const getDotColor = (level: FogWarningLevel | string) => {
    switch (level) {
      case 'NORMAL':
        return 'bg-tertiary';
      case 'REDUCED':
        return 'bg-secondary';
      case 'LOW':
        return 'bg-secondary';
      case 'VERY_LOW':
        return 'bg-error';
      case 'CRITICAL':
        return 'bg-error animate-ping';
      default:
        return 'bg-on-surface-variant';
    }
  };

  const hasLowVisibility = points.some(
    (p) => p.warningLevel === 'LOW' || p.warningLevel === 'VERY_LOW' || p.warningLevel === 'CRITICAL'
  );

  return (
    <div
      className={`rounded-xl bg-surface-container-low border border-surface-container-highest/60 flex flex-col ${
        compact ? 'p-3 gap-2 shadow-sm' : 'p-hud-pad-md gap-hud-pad-sm shadow-md'
      }`}
    >
      {/* Header with Title and Action Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-secondary text-lg">🌫️</span>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-on-surface leading-tight">
              VISIBILITY AHEAD
            </span>
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
              ROUTE LOOKAHEAD // 20 KM HORIZON
            </span>
          </div>
        </div>

        {onNavigateFogModule && (
          <button
            onClick={onNavigateFogModule}
            className="flex items-center gap-1 font-label-code text-[11px] text-primary hover:text-primary-container transition-colors py-1 px-2 rounded bg-primary/10 hover:bg-primary/20"
            title="Open Dedicated Fog & Visibility Safety Module"
          >
            <span>FULL FOG DECK</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        )}
      </div>

      {/* Structured Ahead Forecast List */}
      <div className="flex flex-col gap-1.5 font-label-code">
        {points.map((pt, idx) => {
          const isCritical = pt.warningLevel === 'VERY_LOW' || pt.warningLevel === 'CRITICAL';
          return (
            <div
              key={idx}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
                isCritical
                  ? 'bg-error-container/20 border-error/30'
                  : 'bg-surface-container/60 border-surface-container-highest/40 hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${getDotColor(pt.warningLevel)}`}
                />
                <span className="font-bold text-on-surface w-14 text-xs">
                  {pt.distanceLabel}
                </span>
                <span className="text-on-surface-variant text-[11px] hidden sm:inline-block">
                  {pt.landmark}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-on-surface">
                  {pt.visibilityMeters >= 1000
                    ? `${(pt.visibilityMeters / 1000).toFixed(1)} km`
                    : `${pt.visibilityMeters} m`}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getBadgeStyle(
                    pt.warningLevel
                  )}`}
                >
                  {pt.warningLevel === 'NORMAL' && '🟢'}
                  {pt.warningLevel === 'REDUCED' && '🟡'}
                  {pt.warningLevel === 'LOW' && '🟠'}
                  {pt.warningLevel === 'VERY_LOW' && '🔴'}
                  {pt.warningLevel === 'CRITICAL' && '🛑'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning Footer Status */}
      {hasLowVisibility && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-error-container/30 border border-error/40 text-on-error-container mt-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-[18px] animate-pulse">
              warning
            </span>
            <span className="font-label-code text-[11px] font-bold uppercase tracking-wide text-error">
              LOW VISIBILITY ZONE AHEAD (KM 122–127)
            </span>
          </div>
          <span className="font-label-code text-[10px] bg-error text-on-error px-1.5 py-0.5 rounded font-bold">
            SPEED CAP 60 KM/H
          </span>
        </div>
      )}
    </div>
  );
};
