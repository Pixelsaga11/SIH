import React, { useState } from 'react';

export const RouteProfileScreen: React.FC = () => {
  const [isVectorAcked, setIsVectorAcked] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAcknowledgeProfile = () => {
    if (navigator.vibrate) {
      navigator.vibrate([30, 50]);
    }
    setIsVectorAcked(true);
    setToastMessage('Route vector and speed ceiling verified. Armed in cab blackbox.');
    setTimeout(() => {
      setIsVectorAcked(false);
      setToastMessage(null);
    }, 3200);
  };

  return (
    <div className="flex flex-col w-full gap-hud-pad-md px-hud-pad-md pb-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-22 inset-x-4 z-50 p-hud-pad-sm bg-surface-container-highest border border-primary/40 rounded-xl flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span>
            <span className="font-label-code text-label-code text-on-surface">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* 2-COLUMN WIDESCREEN ROUTE PROFILE DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-hud-pad-md w-full">
        {/* COLUMN 1: RADAR, ELEVATION CONTOUR & JUNCTION (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-hud-pad-md">
          {/* CONGESTION & TRAIN-AHEAD RADAR (PRIORITIES 7 & 8) */}
          <div className="w-full rounded-xl bg-surface-container-low p-hud-pad-md shadow-md flex flex-col gap-hud-pad-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-hud-pad-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">radar</span>
                <span className="font-headline-md text-headline-md text-on-surface">TRAIN-AHEAD RADAR</span>
              </div>
              <span className="font-label-code text-label-code text-primary bg-primary/10 px-2 py-0.5 rounded font-bold">
                AUTO-SCAN 15KM
              </span>
            </div>

            {/* Section Congestion Bar */}
            <div className="bg-surface-container p-3 rounded-lg flex flex-col gap-2">
              <div className="flex justify-between items-center text-on-surface">
                <span className="font-body-md text-body-md font-medium text-on-surface">
                  Lonavala – Karjat Ghat Section
                </span>
                <span className="font-label-code text-label-code font-bold text-secondary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                  MODERATE DENSITY
                </span>
              </div>
              <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden flex">
                <div className="bg-tertiary h-full" style={{ width: '35%' }}></div>
                <div className="bg-secondary h-full relative" style={{ width: '45%' }}>
                  <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
                </div>
                <div className="bg-error h-full" style={{ width: '20%' }}></div>
              </div>
              <div className="flex justify-between font-label-code text-label-code text-on-surface-variant">
                <span>Cur: 0 km (Clear)</span>
                <span className="text-secondary font-bold">Predicted Heavy @ +12 km (+5.2 min)</span>
                <span>Karjat Yard</span>
              </div>
            </div>

            {/* Factor badges array */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-high text-center">
                <span className="font-label-code text-label-code text-on-surface-variant uppercase">Ahead Lead</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">train</span>
                  <span className="font-headline-md text-headline-md text-on-surface">4 Units</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Spacing 2.8 km</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-high text-center">
                <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                  Block Occupancy
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">grid_view</span>
                  <span className="font-headline-md text-headline-md text-secondary">85%</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">High Ghat Load</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-high text-center">
                <span className="font-label-code text-label-code text-on-surface-variant uppercase">Track Temp</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">device_thermostat</span>
                  <span className="font-headline-md text-headline-md text-on-surface">34°C</span>
                </div>
                <span className="font-body-sm text-body-sm text-tertiary">Safe Range</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC ROUTE GRADIENT & RESTRICTIONS TIMELINE */}
          <div className="w-full rounded-xl bg-surface-container-low p-hud-pad-md shadow-md flex flex-col gap-hud-pad-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-hud-pad-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
                <span className="font-headline-md text-headline-md text-on-surface">
                  TOPOGRAPHY &amp; GRADIENT CONTOUR
                </span>
              </div>
              <span className="font-label-code text-label-code text-on-surface-variant font-bold">
                10 KM HORIZON
              </span>
            </div>

            {/* Dynamic Elevation Chart SVG */}
            <div className="bg-surface-container p-3 rounded-lg flex flex-col gap-1 relative overflow-hidden">
              <div className="flex justify-between items-center text-label-code font-label-code text-on-surface-variant">
                <span>Elevation: 610m ASL</span>
                <span className="text-secondary font-bold">DESCENT: -1:37 (STEEPEST)</span>
                <span>Terminus: 120m</span>
              </div>

              {/* Vector Profile Canvas */}
              <div className="h-28 w-full relative">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 360 80">
                  {/* Subtle Grid Lines */}
                  <line stroke="#232732" strokeWidth="0.5" x1="0" x2="360" y1="20" y2="20" />
                  <line stroke="#232732" strokeWidth="0.5" x1="0" x2="360" y1="45" y2="45" />
                  <line stroke="#232732" strokeWidth="0.5" x1="0" x2="360" y1="70" y2="70" />

                  {/* Gradient fill for elevation contour */}
                  <defs>
                    <linearGradient id="routeGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Filled profile polygon */}
                  <polygon
                    fill="url(#routeGradient)"
                    points="0,18 50,22 120,54 220,58 310,68 360,70 360,80 0,80"
                  />

                  {/* Elevation line */}
                  <polyline
                    fill="none"
                    points="0,18 50,22 120,54 220,58 310,68 360,70"
                    stroke="#4cd7f6"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />
                  {/* Points of Interest Markers */}
                  <circle cx="50" cy="22" fill="#ffb95f" r="3.5" />
                  <line stroke="#ffb95f" strokeDasharray="2,2" strokeWidth="1" x1="50" x2="50" y1="22" y2="76" />
                  <circle cx="120" cy="54" fill="#4cd7f6" r="3.5" />
                  <line stroke="#4cd7f6" strokeDasharray="2,2" strokeWidth="1" x1="120" x2="120" y1="54" y2="76" />
                  <circle cx="210" cy="57" fill="#ffb4ab" r="3.5" />
                  <line stroke="#ffb4ab" strokeDasharray="2,2" strokeWidth="1" x1="210" x2="210" y1="57" y2="76" />
                  <circle cx="310" cy="68" fill="#4edea3" r="3.5" />
                  <line stroke="#4edea3" strokeDasharray="2,2" strokeWidth="1" x1="310" x2="310" y1="68" y2="76" />
                  {/* Locomotive Current Marker */}
                  <polygon fill="#4edea3" points="0,12 8,18 0,24" />
                </svg>

                {/* Dynamic Overlay Pin Labels */}
                <div className="absolute left-[12%] top-1 bg-secondary text-on-secondary px-1.5 py-0.5 rounded font-label-code text-[9px] font-bold">
                  C-19 (400m R)
                </div>
                <div className="absolute left-[33%] bottom-2 bg-surface-container-high text-primary px-1.5 py-0.5 rounded font-label-code text-[9px]">
                  -1:100 STEADY
                </div>
                <div className="absolute left-[56%] top-1 bg-error-container text-error px-1.5 py-0.5 rounded font-label-code text-[9px] font-bold">
                  TSR 65 GANG
                </div>
                <div className="absolute right-[10%] bottom-3 bg-tertiary-container text-on-tertiary-container px-1.5 py-0.5 rounded font-label-code text-[9px] font-bold">
                  LC-88 (SHUT)
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1 text-center font-label-code text-label-code pt-1 text-on-surface-variant">
                <div>1.2 km Ahead</div>
                <div>3.4 km Ahead</div>
                <div>5.1 km Ahead</div>
                <div>7.8 km Ahead</div>
              </div>
            </div>
          </div>

          {/* NEXT JUNCTION INTELLIGENCE (PRIORITY 9: AI COCKPIT COPILOT) */}
          <div className="w-full rounded-xl bg-surface-container-high p-hud-pad-md shadow-lg flex flex-col gap-hud-pad-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-hud-pad-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">merge_type</span>
                <span className="font-headline-md text-headline-md text-on-surface">
                  NEXT JUNCTION INTELLIGENCE
                </span>
              </div>
              <span className="font-label-code text-label-code text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                8.2 KM HORIZON
              </span>
            </div>

            {/* Junction Header Badge Card */}
            <div className="p-3 bg-surface-container rounded-lg flex items-center justify-between">
              <div>
                <span className="font-label-code text-label-code text-on-surface-variant uppercase">Designation</span>
                <div className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">
                  KARJAT JN (KJT)
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                  Predicted Arrival
                </span>
                <div className="font-telemetry-lg text-telemetry-lg text-tertiary font-bold">
                  18:31 <span className="text-body-sm font-normal text-on-surface-variant">IST</span>
                </div>
              </div>
            </div>

            {/* AI Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Nominated Berth</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">directions_subway</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">PLATFORM 2</span>
                </div>
                <span className="font-body-sm text-body-sm text-tertiary mt-1">Loop Line Interlock: Clear</span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                  Halt Schedule &amp; Tasks
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-primary text-[18px]">water_drop</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">2.0 MIN</span>
                </div>
                <span className="font-body-sm text-body-sm text-primary-fixed-dim mt-1">Water Filling • Aux Check</span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                  Overtake Clearance
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">block</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">DISALLOWED</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Main line occupied #12128
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                  Next Route Gradient
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-secondary text-[18px]">show_chart</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">LEVEL (0.0%)</span>
                </div>
                <span className="font-body-sm text-body-sm text-secondary mt-1">Ghat Descent Terminates</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: WEATHER ADVISORY & DYNAMIC RESTRICTION MANIFEST (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-hud-pad-md">
          {/* WEATHER OPERATIONAL IMPACT (PRIORITY 10: ALERT & GLANCE BANNER) */}
          <div className="w-full rounded-xl bg-surface-container-high p-hud-pad-md shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-secondary">
              <span className="material-symbols-outlined text-[130px]">rainy</span>
            </div>
            <div className="flex items-center justify-between gap-hud-pad-xs mb-hud-pad-xs">
              <div className="flex items-center gap-hud-pad-xs">
                <span
                  className="material-symbols-outlined text-[20px] text-secondary animate-pulse"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  weather_snowy
                </span>
                <span className="font-headline-md text-headline-md text-on-surface">
                  GHAT ADVISORY // PRIORITY-10
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary font-label-code text-label-code font-bold uppercase tracking-wider">
                MIST &amp; DOWNPOUR
              </span>
            </div>
            <div className="flex flex-col gap-hud-pad-xs relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <p className="font-body-md text-body-md text-on-surface font-medium leading-snug">
                  Expected adhesion reduction{' '}
                  <span className="font-label-code font-bold text-secondary text-[15px]">22%</span> • Braking distance
                  extended +180m
                </p>
              </div>
              <div className="grid grid-cols-2 gap-hud-pad-xs mt-1">
                <div className="flex items-center gap-hud-pad-xs bg-surface-container p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-[18px]">grain</span>
                  <span className="font-label-code text-label-code text-on-surface-variant leading-tight">
                    Apply dry sanders prior MP 114
                  </span>
                </div>
                <div className="flex items-center gap-hud-pad-xs bg-surface-container p-2 rounded-lg">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">highlight</span>
                  <span className="font-label-code text-label-code text-on-surface-variant leading-tight">
                    High-beam marker lamp active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STRUCTURED HUD RESTRICTION TABLE */}
          <div className="w-full rounded-xl bg-surface-container-low p-hud-pad-md shadow-md flex flex-col gap-hud-pad-sm">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider font-bold">
              Dynamic Restriction Manifest
            </span>

            {/* Row 1: Sharp Curve */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container hover:bg-surface-bright transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-10 rounded bg-secondary/15 flex flex-col items-center justify-center">
                  <span className="font-label-code text-[10px] text-secondary font-semibold uppercase">DIST</span>
                  <span className="font-headline-md text-headline-md leading-none text-secondary">1.2</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[16px]">turn_sharp_right</span>
                    <span className="font-body-md text-body-md font-semibold text-on-surface">Sharp Curve C-19</span>
                    <span className="font-label-code text-label-code text-on-surface-variant">(Radius 400m)</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Flange Lubricator Active • Roll Stability Req
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-code text-label-code font-bold">
                  50 km/h
                </span>
                <span className="font-label-code text-[11px] text-secondary mt-0.5">+0.8m ETA</span>
              </div>
            </div>

            {/* Row 2: Steep Gradient */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container hover:bg-surface-bright transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-10 rounded bg-primary/15 flex flex-col items-center justify-center">
                  <span className="font-label-code text-[10px] text-primary font-semibold uppercase">DIST</span>
                  <span className="font-headline-md text-headline-md leading-none text-primary">3.4</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[16px]">trending_down</span>
                    <span className="font-body-md text-body-md font-semibold text-on-surface">
                      Steep Gradient -1:100 (Down)
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-primary-fixed-dim">
                    Regenerative Dynamic Brake Notch 4 Req
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-code text-label-code font-bold">
                  MPS 90
                </span>
                <span className="font-label-code text-[11px] text-tertiary mt-0.5">±0.0m Norm</span>
              </div>
            </div>

            {/* Row 3: Track Work TSR */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container hover:bg-surface-bright transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-10 rounded bg-error-container flex flex-col items-center justify-center">
                  <span className="font-label-code text-[10px] text-error font-semibold uppercase">DIST</span>
                  <span className="font-headline-md text-headline-md leading-none text-error">5.1</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-error text-[16px]">construction</span>
                    <span className="font-body-md text-body-md font-semibold text-on-surface">
                      TSR Track Work Gang
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Caution Banner Up • Continuous Whistling
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-0.5 rounded bg-error text-on-error font-label-code text-label-code font-bold">
                  65 km/h
                </span>
                <span className="font-label-code text-[11px] text-error mt-0.5">+1.2m ETA</span>
              </div>
            </div>

            {/* Row 4: Level Crossing LC-88 */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container hover:bg-surface-bright transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-10 rounded bg-tertiary/15 flex flex-col items-center justify-center">
                  <span className="font-label-code text-[10px] text-tertiary font-semibold uppercase">DIST</span>
                  <span className="font-headline-md text-headline-md leading-none text-tertiary">7.8</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">traffic</span>
                    <span className="font-body-md text-body-md font-semibold text-on-surface">
                      Level Crossing LC-88 (Manned)
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-tertiary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Gate Closed &amp; Interlocked (Key 14B)
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-0.5 rounded bg-tertiary text-on-tertiary font-label-code text-label-code font-bold">
                  MPS 110
                </span>
                <span className="font-label-code text-[11px] text-tertiary mt-0.5">Clear Line</span>
              </div>
            </div>
          </div>

          {/* Quick Pilot Acknowledge Button */}
          <button
            onClick={handleAcknowledgeProfile}
            className={`w-full min-h-touch-target-min rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-2 transition-all shadow-md mt-1 active:scale-[0.98] ${
              isVectorAcked
                ? 'bg-tertiary text-on-tertiary'
                : 'bg-primary text-on-primary hover:bg-primary-container'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isVectorAcked ? 'check_circle' : 'verified'}
            </span>
            <span>{isVectorAcked ? 'VECTOR LOGGED TO BLACKBOX' : 'ACKNOWLEDGE PROFILE VECTOR'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
