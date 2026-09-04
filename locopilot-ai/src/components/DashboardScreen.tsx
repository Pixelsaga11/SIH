import React, { useState } from 'react';
import { StationDelayWidget } from './StationDelayWidget';
import { TrainHealthAlertBanner } from './TrainHealthAlertBanner';
import { VisibilityAheadForecastWidget } from './VisibilityAheadForecastWidget';
import { TabType } from '../types';

interface DashboardScreenProps {
  onNavigateTab: (tab: TabType) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigateTab }) => {
  const [speed, setSpeed] = useState<number>(74);
  const [isBrakeApplied, setIsBrakeApplied] = useState<boolean>(false);
  const [isAlertAcked, setIsAlertAcked] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleBrakeTest = () => {
    setIsBrakeApplied(true);
    setToastMsg('Service Brake Applied: BP pressure reduced to 4.2 bar.');
    setSpeed(48);
    setTimeout(() => {
      setIsBrakeApplied(false);
      setToastMsg('Service Brake Released: Speed stabilizing at target ceiling.');
      setTimeout(() => setToastMsg(null), 3000);
    }, 3500);
  };

  const handleAckAlert = () => {
    setIsAlertAcked(true);
    setToastMsg('Cockpit Safety Alert acknowledged by Loco Pilot.');
    setTimeout(() => {
      setIsAlertAcked(false);
      setToastMsg(null), 3000;
    });
  };

  return (
    <div className="flex flex-col w-full gap-hud-pad-md px-hud-pad-md pb-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-22 inset-x-4 z-50 p-hud-pad-sm bg-surface-container-highest border border-primary/40 rounded-xl flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span>
            <span className="font-label-code text-label-code text-on-surface">{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="p-1 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* DASHBOARD MASTER CONTROL TOP STRIP */}
      <div className="w-full bg-surface-container-high rounded-xl p-hud-pad-md shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3 border border-surface-variant/30">
        <div className="flex items-center gap-hud-pad-sm">
          <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">dashboard</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-headline-md text-on-surface">
                MASTER COCKPIT DASHBOARD
              </span>
              <span className="px-2 py-0.5 rounded bg-tertiary/20 text-tertiary font-label-code text-[11px] font-bold uppercase">
                ALL SYSTEMS SYNCHRONIZED
              </span>
            </div>
            <span className="font-label-code text-label-code text-on-surface-variant block">
              TRAIN 12626 DN (KERALA EXP) • WAP-7 #30211 • SECTION: LONAVALA – KARJAT GHAT
            </span>
          </div>
        </div>

        {/* Tactical Quick Links */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onNavigateTab('live-hud')}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright font-label-code text-label-code text-primary border border-primary/30 flex items-center gap-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">speed</span>
            <span>CAB HUD</span>
          </button>
          <button
            onClick={() => onNavigateTab('fog-visibility')}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright font-label-code text-label-code text-error border border-error/40 flex items-center gap-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">cloud</span>
            <span>FOG SAFETY (450M)</span>
          </button>
          <button
            onClick={() => onNavigateTab('crossing-and-ai-delay')}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright font-label-code text-label-code text-secondary border border-secondary/30 flex items-center gap-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">alt_route</span>
            <span>AI DELAY</span>
          </button>
          <button
            onClick={() => onNavigateTab('maintenance')}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright font-label-code text-label-code text-error border border-error/40 flex items-center gap-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">troubleshoot</span>
            <span>TRAIN HEALTH (1 ALERT)</span>
          </button>
          <button
            onClick={() => onNavigateTab('maintenance')}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright font-label-code text-label-code text-tertiary border border-tertiary/30 flex items-center gap-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">build</span>
            <span>MAINTENANCE</span>
          </button>
        </div>
      </div>

      {/* 🔴 CRITICAL TRAIN HEALTH ALERT BANNER */}
      <TrainHealthAlertBanner
        onViewComponent={() => onNavigateTab('maintenance')}
        onSimulateCascade={() => onNavigateTab('maintenance')}
      />

      {/* 🌫️ EARLY FOG EXPECTED AHEAD BANNER */}
      <div className="w-full bg-surface-container-high rounded-xl p-3 border-l-4 border-error border-y border-r border-surface-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-pulse">🌫️</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-headline-md text-headline-md text-error font-bold uppercase tracking-tight">
                FOG EXPECTED AHEAD
              </span>
              <span className="px-2 py-0.5 rounded bg-error text-on-error font-label-code text-[10px] font-bold uppercase">
                RISK: HIGH
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container font-label-code text-[10px] text-secondary font-bold">
                VISIBILITY: 450 m ↓ (WORSENING)
              </span>
            </div>
            <span className="font-label-code text-[11px] text-on-surface-variant mt-0.5">
              Location: <strong>12 km ahead</strong> (Monkey Hill–Thakurwadi) • Expected duration: <strong>35 min</strong> • Speed Cap: <strong>60 km/h</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('fog-visibility')}
            className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-code text-label-code font-bold uppercase flex items-center gap-1 active:scale-95 transition-all shadow-sm"
          >
            <span>OPEN FOG SAFETY DECK</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* CRITICAL BRAKE MANDATE TICKER */}
      <div className="w-full bg-error-container text-on-error-container p-3 rounded-xl shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-error text-[24px] animate-pulse">warning</span>
          <div className="truncate">
            <span className="font-headline-md text-headline-md text-on-error-container font-bold uppercase block leading-tight">
              BRAKE MANDATE: 50 KM/H CEILING
            </span>
            <span className="font-label-code text-[11px] text-on-error-container/90 truncate block">
              Sharp Curve C-19 in 1.2 km • Current: {speed} km/h • Delta: -{Math.max(0, speed - 50)} km/h
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleBrakeTest}
            disabled={isBrakeApplied}
            className="px-3 py-1.5 rounded-lg bg-error text-on-error font-label-code text-label-code font-bold uppercase shadow-sm active:scale-95 transition-all"
          >
            {isBrakeApplied ? 'BRAKING...' : 'SERVICE BRAKE'}
          </button>
          <button
            onClick={handleAckAlert}
            className={`px-3 py-1.5 rounded-lg font-label-code text-label-code font-bold uppercase shadow-sm active:scale-95 transition-all ${
              isAlertAcked
                ? 'bg-tertiary text-on-tertiary'
                : 'bg-surface-container-highest text-on-surface hover:bg-surface-bright'
            }`}
          >
            {isAlertAcked ? 'ACKED' : 'ACK'}
          </button>
        </div>
      </div>

      {/* MULTI-PANEL BENTO DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-hud-pad-md">
        {/* COLUMN 1: LIVE LOCOMOTIVE VELOCITY & MAINTENANCE GAUGES (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-hud-pad-md">
          {/* Velocity Gauges & Target Ceilings */}
          <div className="bg-surface-container-low rounded-xl p-hud-pad-md shadow-md flex flex-col gap-3 border border-surface-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[18px]">speed</span>
                <span className="font-headline-md text-headline-md">CAB VELOCITY</span>
              </div>
              <span className="font-label-code text-label-code text-tertiary bg-tertiary/10 px-2 py-0.5 rounded">
                KAWACH ARMED
              </span>
            </div>

            {/* Circular Speed Reticle Display */}
            <div className="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center relative">
              <div className="flex items-baseline gap-2">
                <span className="font-telemetry-speed text-telemetry-speed text-on-surface leading-none">
                  {speed}
                </span>
                <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                  KM/H
                </span>
              </div>

              {/* Target Limit Badge */}
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-code text-label-code font-bold">
                  TARGET: 50 KM/H
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-code text-[10px]">
                  MPS: 110 KM/H
                </span>
              </div>

              {/* Dynamic Deceleration Bar */}
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-secondary h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (speed / 110) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Brake & Dynamic Envelope Metrics */}
            <div className="grid grid-cols-2 gap-2 font-label-code">
              <div className="bg-surface-container p-2 rounded-lg">
                <span className="text-on-surface-variant text-[10px] block uppercase">Braking Distance</span>
                <span className="text-primary font-bold text-telemetry-md">380 m</span>
                <span className="text-tertiary text-[10px] block">Adequate to C-19</span>
              </div>
              <div className="bg-surface-container p-2 rounded-lg">
                <span className="text-on-surface-variant text-[10px] block uppercase">Gradient Run</span>
                <span className="text-secondary font-bold text-telemetry-md">-1:100</span>
                <span className="text-on-surface-variant text-[10px] block">Descent Active</span>
              </div>
            </div>
          </div>

          {/* Locomotive Subsystem Health & Default-In Snapshot */}
          <div className="bg-surface-container-low rounded-xl p-hud-pad-md shadow-md flex flex-col gap-3 border border-surface-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-tertiary">
                <span className="material-symbols-outlined text-[18px]">build_circle</span>
                <span className="font-headline-md text-headline-md">LOCO HEALTH</span>
              </div>
              <span className="font-label-code text-[10px] text-tertiary bg-tertiary/10 px-2 py-0.5 rounded font-bold">
                DEFAULT IN: NOMINAL
              </span>
            </div>

            {/* Pneumatics & Voltage Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2 font-label-code text-[11px]">
              <div className="bg-surface-container p-2 rounded-lg">
                <span className="text-on-surface-variant text-[10px] block">BRAKE PIPE (BP)</span>
                <span className="text-tertiary font-bold text-base">5.00 bar</span>
                <span className="text-on-surface-variant text-[9px]">Spec: 5.00 bar</span>
              </div>
              <div className="bg-surface-container p-2 rounded-lg">
                <span className="text-on-surface-variant text-[10px] block">FEED PIPE (FP)</span>
                <span className="text-primary font-bold text-base">6.00 bar</span>
                <span className="text-on-surface-variant text-[9px]">Spec: 6.00 bar</span>
              </div>
              <div className="bg-surface-container p-2 rounded-lg">
                <span className="text-on-surface-variant text-[10px] block">CATENARY VOLT</span>
                <span className="text-on-surface font-bold text-base">24.6 kV</span>
                <span className="text-on-surface-variant text-[9px]">Spec: 25.0 kV</span>
              </div>
              <div className="bg-surface-container p-2 rounded-lg">
                <span className="text-on-surface-variant text-[10px] block">TM STATOR TEMP</span>
                <span className="text-secondary font-bold text-base">78°C</span>
                <span className="text-on-surface-variant text-[9px]">Max: 140°C</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('maintenance')}
              className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-bright font-label-code text-label-code text-on-surface flex items-center justify-center gap-1.5 border border-surface-variant/40 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-tertiary">open_in_new</span>
              <span>OPEN FULL MAINTENANCE SUITE</span>
            </button>
          </div>

          {/* 🌫️ VISIBILITY AHEAD FORECAST WIDGET (LOCOPILOT COCKPIT LOOKAHEAD) */}
          <VisibilityAheadForecastWidget
            onNavigateFogModule={() => onNavigateTab('fog-visibility')}
          />

          {/* PREDICTIVE TRAIN HEALTH & EARLY FAILURE ANOMALY CARD */}
          <div className="bg-surface-container-low rounded-xl p-hud-pad-md shadow-md flex flex-col gap-2.5 border border-error/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-error">
                <span className="material-symbols-outlined text-[18px]">troubleshoot</span>
                <span className="font-headline-md text-headline-md">TRAIN HEALTH AI</span>
              </div>
              <span className="font-label-code text-[10px] text-error bg-error/15 px-2 py-0.5 rounded font-bold animate-pulse">
                1 ACTIVE ANOMALY
              </span>
            </div>

            {/* Active Anomaly Snapshot */}
            <div className="bg-surface-container p-2.5 rounded-lg border border-error/30 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-code text-label-code font-bold text-on-surface flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  COACH 7 AXLE 4 BEARING
                </span>
                <span className="font-label-code text-[11px] font-black text-error">
                  96°C ↑ (+4°C/10m)
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-label-code text-on-surface-variant">
                <span>VIB: 4.85 mm/s (ABNORMAL)</span>
                <span className="text-error font-bold">RISK: HIGH</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-0.5">
                <div className="bg-error h-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            {/* 16 Sensors Online Count */}
            <div className="grid grid-cols-2 gap-1.5 font-label-code text-[10px]">
              <div className="bg-surface-container p-1.5 rounded flex flex-col">
                <span className="text-on-surface-variant">SENSORS MONITORED</span>
                <span className="text-primary font-bold text-label-code">16 / 16 ONLINE</span>
              </div>
              <div className="bg-surface-container p-1.5 rounded flex flex-col">
                <span className="text-on-surface-variant">PREDICTED IMPACT</span>
                <span className="text-secondary font-bold text-label-code">+18m ON 12626</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('maintenance')}
              className="w-full py-2 rounded-lg bg-error/20 hover:bg-error/30 font-label-code text-label-code text-error font-bold flex items-center justify-center gap-1.5 border border-error/40 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>ANALYZE HEALTH &amp; DELAY CASCADE</span>
            </button>
          </div>
        </div>

        {/* COLUMN 2 & 3: EXPECTED STATION AI DELAYS & CONFLICT DISPATCH (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-hud-pad-md">
          {/* AI Station Delay Widget */}
          <StationDelayWidget onStationSelect={() => {}} />

          {/* Train Crossing & Forward Topography Horizon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-hud-pad-md">
            {/* Crossing Matrix Quick Radar */}
            <div className="bg-surface-container-low rounded-xl p-hud-pad-md shadow-md flex flex-col gap-2.5 border border-surface-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">swap_calls</span>
                  <span className="font-headline-md text-headline-md">CROSSING RADAR</span>
                </div>
                <span className="font-label-code text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                  HOLD @ KARJAT
                </span>
              </div>

              <div className="bg-surface-container p-2.5 rounded-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-code text-label-code font-bold text-on-surface">
                    11010 SINHAGAD EXP
                  </span>
                  <span className="font-label-code text-[10px] text-secondary font-bold">18:32 IST (in 14m)</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Yield line assigned: Karjat Loop Line 3. Preceding train 22124 ahead by 8.4 km.
                </span>
              </div>

              {/* Tactical Track Schematic */}
              <div className="w-full bg-surface-container-lowest h-16 rounded-lg flex items-center justify-center p-2">
                <svg className="w-full h-10" fill="none" viewBox="0 0 300 40">
                  <line stroke="#313540" strokeWidth="2.5" x1="10" x2="290" y1="30" y2="30"></line>
                  <path
                    d="M 50 30 C 80 30, 90 10, 120 10 L 210 10 C 235 10, 245 30, 270 30"
                    stroke="#4cd7f6"
                    strokeDasharray="3 2"
                    strokeWidth="2"
                  ></path>
                  <circle cx="45" cy="30" fill="#4cd7f6" r="5"></circle>
                  <text fill="#4cd7f6" fontFamily="JetBrains Mono" fontSize="8" x="40" y="38">
                    YOU
                  </text>
                  <circle cx="190" cy="10" fill="#ffb95f" r="5"></circle>
                  <text fill="#ffb95f" fontFamily="JetBrains Mono" fontSize="8" x="180" y="8">
                    11010
                  </text>
                </svg>
              </div>
            </div>

            {/* Topography Vector Horizon */}
            <div className="bg-surface-container-low rounded-xl p-hud-pad-md shadow-md flex flex-col gap-2.5 border border-surface-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-[18px]">terrain</span>
                  <span className="font-headline-md text-headline-md">TRACK PROFILE</span>
                </div>
                <span className="font-label-code text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded">
                  0 – 8.5 KM
                </span>
              </div>

              <div className="bg-surface-container-lowest p-2 rounded-lg flex flex-col gap-1">
                <div className="flex justify-between text-on-surface-variant font-label-code text-[10px]">
                  <span>KM 112.4 (CURRENT)</span>
                  <span className="text-secondary font-bold">C-19 (400m R)</span>
                  <span>KM 120.9 (KJT)</span>
                </div>
                <div className="h-10 w-full flex items-center">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 40">
                    <polyline
                      fill="none"
                      points="0,10 40,12 90,26 180,30 260,34 300,35"
                      stroke="#4cd7f6"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                    <circle cx="40" cy="12" fill="#ffb95f" r="3" />
                    <circle cx="180" cy="30" fill="#ffb4ab" r="3" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 font-label-code text-[10px] text-on-surface-variant">
                <div className="bg-surface-container p-1.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>Sharp Curve: 50 km/h</span>
                </div>
                <div className="bg-surface-container p-1.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                  <span>TSR Track Gang: 65 km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
