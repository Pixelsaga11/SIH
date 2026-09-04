import React, { useState } from 'react';
import { StationDelayWidget } from './StationDelayWidget';

export const AiDelayScreen: React.FC = () => {
  const [telemetryMode, setTelemetryMode] = useState<'live' | 'sim'>('live');
  const [isAdvApplied, setIsAdvApplied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModelOverridden, setIsModelOverridden] = useState<boolean>(false);
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);

  const handleApplyAdvice = () => {
    setIsAdvApplied(true);
    setToastMessage('Recovery notch 24 schedule armed. Reclaiming 2.5 min on Monkey Hill section.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOverride = () => {
    setIsModelOverridden(!isModelOverridden);
    setToastMessage(
      !isModelOverridden
        ? 'Manual Pilot Override: Fallback to fixed sectional block margins.'
        : 'Neural cascade model re-engaged for section.'
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAck = () => {
    setIsAcknowledged(true);
    setToastMessage('Dispatch graph and conflict matrix acknowledged.');
    setTimeout(() => {
      setIsAcknowledged(false);
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full px-hud-pad-md gap-gutter pb-6">
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed top-22 inset-x-4 z-50 p-hud-pad-sm bg-surface-container-highest border border-primary/40 rounded-xl flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">psychology</span>
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

      {/* TOP LEVEL AI CRITICAL STATUS ALERT BANNER */}
      <div className="relative overflow-hidden rounded-xl bg-error-container text-on-error-container p-hud-pad-md shadow-xl flex flex-col gap-hud-pad-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-[22px] text-error animate-pulse">warning</span>
            <span className="font-headline-md text-headline-md tracking-tight text-on-error-container uppercase">
              CASCADING DELAY DETECTED
            </span>
          </div>
          <span className="font-label-code text-label-code px-2 py-0.5 rounded-full bg-error text-on-error font-bold uppercase tracking-wider animate-ping">
            CRITICAL
          </span>
        </div>
        <div className="font-body-sm text-body-sm text-on-error-container/90 leading-snug">
          Primary cause <strong className="font-label-code text-error underline">Train 12123 (+5m)</strong> → Your
          Impact: <strong className="font-label-code text-error">+6m</strong> → Final Terminal Drift:{' '}
          <strong className="font-label-code text-error">{isAdvApplied ? '+4.5m (recovering)' : '+9m'}</strong>
        </div>
      </div>

      {/* INTERACTIVE SIMULATION TOGGLE / MODE SELECTOR */}
      <div className="flex items-center justify-between p-hud-pad-xs rounded-lg bg-surface-container-high">
        <button
          className={`flex-1 py-2 rounded-lg font-label-code text-label-code uppercase tracking-wider text-center font-bold shadow-md transition-all ${
            telemetryMode === 'live'
              ? 'bg-primary text-on-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          id="btn-live-stream"
          onClick={() => setTelemetryMode('live')}
        >
          LIVE TELEMETRY
        </button>
        <button
          className={`flex-1 py-2 rounded-lg font-label-code text-label-code uppercase tracking-wider text-center font-bold shadow-md transition-all ${
            telemetryMode === 'sim'
              ? 'bg-secondary text-on-secondary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          id="btn-sim-stream"
          onClick={() => setTelemetryMode('sim')}
        >
          AI WHAT-IF DIVERGENCE
        </button>
      </div>

      {/* 2-COLUMN WIDESCREEN DASHBOARD GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-hud-pad-md w-full">
        {/* COLUMN 1: STATION DELAYS & DYNAMIC ETA AI FORECAST (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-hud-pad-md">
          {/* EXPECTED STATION AI DELAY PREDICTOR */}
          <StationDelayWidget />

          {/* SECTION: PRIORITY 4 - AI DYNAMIC ETA BREAKDOWN */}
          <div className="flex flex-col gap-hud-pad-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-hud-pad-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
                <h2 className="font-headline-md text-headline-md text-primary">Dynamic ETA & AI Factors</h2>
              </div>
              <div className="flex items-center gap-1 font-label-code text-label-code text-tertiary">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                <span>CONFIDENCE: 91% (±2m)</span>
              </div>
            </div>

            {/* ETA Comparison Banner */}
            <div className="rounded-xl bg-surface-container-low p-hud-pad-md flex flex-col gap-hud-pad-md shadow-lg">
              <div className="grid grid-cols-2 gap-hud-pad-md">
                <div className="flex flex-col p-hud-pad-sm rounded-lg bg-surface-container">
                  <span className="font-label-code text-label-code text-on-surface-variant uppercase">SCHEDULED ETA</span>
                  <span className="font-telemetry-lg text-telemetry-lg text-on-surface">18:40</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Standard Time Table</span>
                </div>
                <div className="flex flex-col p-hud-pad-sm rounded-lg bg-surface-container">
                  <span className="font-label-code text-label-code text-secondary uppercase font-bold">AI DYNAMIC ETA</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-telemetry-lg text-telemetry-lg text-secondary font-bold">
                      {isAdvApplied ? '18:44' : '18:47'}
                    </span>
                    <span className="font-label-code text-label-code text-error font-bold">
                      {isAdvApplied ? '+4.5m DRIFT' : '+7m DRIFT'}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-secondary-fixed-dim">Simulated at 1-sec intervals</span>
                </div>
              </div>

              {/* AI Explainability Tags Matrix */}
              <div className="flex flex-col gap-hud-pad-xs">
                <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider">
                  EXPLAINABLE VARIANCE CONTRIBUTIONS:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-hud-pad-xs">
                  {/* Fog Impact */}
                  <div className="flex items-center justify-between p-hud-pad-sm rounded-lg bg-error-container/30 border border-error/40 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-hud-pad-xs">
                      <span className="text-[16px]">🌫️</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-bold">Fog Visibility</span>
                    </div>
                    <span className="font-label-code text-label-code font-bold text-error">+5 min</span>
                  </div>
                  {/* Tag 1 */}
                  <div className="flex items-center justify-between p-hud-pad-sm rounded-lg bg-surface-container">
                    <div className="flex items-center gap-hud-pad-xs">
                      <span className="material-symbols-outlined text-secondary text-[16px]">traffic</span>
                      <span className="font-body-sm text-body-sm text-on-surface">Signal Waiting</span>
                    </div>
                    <span className="font-label-code text-label-code font-bold text-secondary">+2 min</span>
                  </div>
                  {/* Tag 2 */}
                  <div className="flex items-center justify-between p-hud-pad-sm rounded-lg bg-surface-container">
                    <div className="flex items-center gap-hud-pad-xs">
                      <span className="material-symbols-outlined text-error text-[16px]">alt_route</span>
                      <span className="font-body-sm text-body-sm text-on-surface">Train Congestion</span>
                    </div>
                    <span className="font-label-code text-label-code font-bold text-error">+2 min</span>
                  </div>
                  {/* Tag 3 */}
                  <div className="flex items-center justify-between p-hud-pad-sm rounded-lg bg-surface-container">
                    <div className="flex items-center gap-hud-pad-xs">
                      <span className="material-symbols-outlined text-primary text-[16px]">landscape</span>
                      <span className="font-body-sm text-body-sm text-on-surface">Ghat Restriction</span>
                    </div>
                    <span className="font-label-code text-label-code font-bold text-primary">+1 min</span>
                  </div>
                  {/* Tag 4 */}
                  <div className="flex items-center justify-between p-hud-pad-sm rounded-lg bg-surface-container">
                    <div className="flex items-center gap-hud-pad-xs">
                      <span className="material-symbols-outlined text-tertiary text-[16px]">timer</span>
                      <span className="font-body-sm text-body-sm text-on-surface">Station Dwell</span>
                    </div>
                    <span className="font-label-code text-label-code font-bold text-tertiary">+1 min</span>
                  </div>
                </div>

                {/* AI Fog Cascade Equation Banner */}
                <div className="p-2 rounded-lg bg-surface-container border border-surface-container-highest/60 flex flex-col gap-1 font-label-code text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-secondary uppercase">
                      AI FOG CASCADING PROPAGATION CHAIN:
                    </span>
                    <span className="text-tertiary font-bold">CONFIDENCE: 88%</span>
                  </div>
                  <span className="font-mono text-[11px] text-on-surface">
                    Fog (450m) → Speed Cap (60 km/h) → Running Time (+5m) → Station Delay (+7m) → Conflict Hold @ Karjat (+2m) = <strong className="text-error font-bold">+9m Cascading Delay</strong>
                  </span>
                </div>
              </div>

              {/* Quick AI Recommendation Card */}
              <div className="p-hud-pad-sm rounded-lg bg-surface-container-high flex items-center justify-between">
                <div className="flex items-center gap-hud-pad-xs">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">speed</span>
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">
                      RECOVERY ADVICE: GRADIENT ACCELERATION
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {isAdvApplied
                        ? 'Armed: Notch 24 active post-Monkey Hill (saving 2.5 min)'
                        : 'Notch up to Notch 24 post-Monkey Hill to reclaim 2.5 min'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleApplyAdvice}
                  disabled={isAdvApplied}
                  className={`h-10 px-hud-pad-sm min-h-touch-target-min rounded-lg font-label-code text-label-code font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all ${
                    isAdvApplied
                      ? 'bg-tertiary-container text-on-tertiary-container opacity-80 cursor-default'
                      : 'bg-tertiary text-on-tertiary hover:bg-tertiary-fixed-dim'
                  }`}
                >
                  <span>{isAdvApplied ? 'ARMED' : 'APPLY'}</span>
                  <span className="material-symbols-outlined text-[16px]">
                    {isAdvApplied ? 'check' : 'arrow_forward'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: CROSSING RADAR & CAUSAL RIPPLE GRAPH (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-hud-pad-md">
          {/* SECTION: PRIORITY 2 - TRAIN INTERACTION PREDICTION */}
          <div className="flex flex-col gap-hud-pad-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-hud-pad-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">swap_calls</span>
                <h2 className="font-headline-md text-headline-md text-primary">Crossing & Conflict Matrix</h2>
              </div>
              <span className="font-label-code text-label-code text-tertiary">RADAR RANGE: 15.0 KM</span>
            </div>

            {/* Active Crossing Card */}
            <div className="rounded-xl bg-surface-container-low p-hud-pad-md flex flex-col gap-hud-pad-sm shadow-md">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md text-secondary leading-tight">
                    11010 SINHAGAD EXP
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Approach Velocity: 64 km/h • Single Line Intersect
                  </span>
                </div>
                <span className="font-label-code text-label-code px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">
                  CROSSING 18:32 IST
                </span>
              </div>

              {/* Locomotive Profiles Mini Grid */}
              <div className="grid grid-cols-3 gap-hud-pad-xs p-hud-pad-sm rounded-lg bg-surface-container">
                <div className="flex flex-col">
                  <span className="font-label-code text-label-code text-on-surface-variant">TRACTION</span>
                  <span className="font-body-md text-body-md text-on-surface font-semibold">WAP-7 (Co-Co)</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-code text-label-code text-on-surface-variant">CONSIST</span>
                  <span className="font-body-md text-body-md text-on-surface font-semibold">22 LHB Coaches</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-code text-label-code text-on-surface-variant">TARGET LINE</span>
                  <span className="font-body-md text-body-md text-primary font-semibold">Karjat Loop 3</span>
                </div>
              </div>

              {/* Crossing Geography Schematic */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center font-label-code text-label-code">
                  <span className="text-on-surface">INTERACTION GEO-VECTOR</span>
                  <span className="text-tertiary">PREDICTED HOLD: 4 MIN</span>
                </div>

                {/* Track visual schematic SVG */}
                <div className="w-full h-16 bg-surface-container-lowest rounded-lg p-2 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-12" fill="none" viewBox="0 0 320 48">
                    {/* Main Line */}
                    <line stroke="#313540" strokeWidth="3" x1="0" x2="320" y1="36" y2="36"></line>
                    {/* Loop line */}
                    <path
                      d="M 60 36 C 90 36, 100 12, 130 12 L 230 12 C 255 12, 265 36, 290 36"
                      stroke="#4cd7f6"
                      strokeDasharray="4 3"
                      strokeWidth="2.5"
                    ></path>
                    {/* Your Train 12626 */}
                    <circle cx="50" cy="36" fill="#4cd7f6" r="6"></circle>
                    <text fill="#4cd7f6" fontFamily="JetBrains Mono" fontSize="8" x="45" y="46">
                      YOU
                    </text>
                    {/* Crossing Train 11010 */}
                    <circle cx="210" cy="12" fill="#ffb95f" r="6"></circle>
                    <text fill="#ffb95f" fontFamily="JetBrains Mono" fontSize="8" x="195" y="8">
                      11010 SINHAGAD
                    </text>
                    {/* Intercept Node */}
                    <circle className="animate-ping" cx="230" cy="12" fill="#ffb4ab" r="3"></circle>
                  </svg>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant italic">
                  Station Controller has reserved Loop Line 3 for 11010 traversal. Yield signal auto-armed.
                </span>
              </div>

              {/* Forward Traffic Section Alert */}
              <div className="p-hud-pad-sm rounded-lg bg-surface-container-high flex items-center justify-between">
                <div className="flex items-center gap-hud-pad-sm">
                  <span className="material-symbols-outlined text-secondary text-[24px]">alt_route</span>
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code font-bold text-on-surface">LEAD TRAIN: 22124 AHEAD</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Distance: <strong className="text-on-surface font-label-code">8.4 km</strong> | Speed:{' '}
                      <strong className="text-on-surface font-label-code">62 km/h</strong>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-label-code text-label-code text-secondary font-semibold uppercase">
                    GAP CLOSING
                  </span>
                  <span className="font-telemetry-md text-telemetry-md text-secondary font-bold">-400m/min</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: PRIORITY 3 - CASCADING DELAY PREDICTION TREE */}
          <div className="flex flex-col gap-hud-pad-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-hud-pad-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
                <h2 className="font-headline-md text-headline-md text-primary">Causal Ripple Analysis</h2>
              </div>
              <span className="font-label-code text-label-code text-on-surface-variant">DISPATCH GRAPH V4.8</span>
            </div>

            {/* The Causal Step-by-Step Chain Container */}
            <div className="rounded-xl bg-surface-container-low p-hud-pad-md shadow-lg flex flex-col gap-hud-pad-md">
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                Root conflict upstream detected via neural block telemetry:
              </div>

              {/* Tree Diagram Nodes */}
              <div className="relative flex flex-col gap-3 pl-4">
                {/* Connecting Vertical Rail Line */}
                <div className="absolute left-7 top-4 bottom-6 w-0.5 bg-surface-container-highest"></div>

                {/* Node 1: Root Cause */}
                <div className="relative flex items-start gap-hud-pad-md z-10">
                  <div className="w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center font-label-code text-label-code font-bold shadow-md">
                    1
                  </div>
                  <div className="flex-1 p-hud-pad-sm rounded-lg bg-surface-container flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-label-code text-error font-bold">
                        ROOT CAUSE: TRAIN 12123 PUSHPAK EXP
                      </span>
                      <span className="font-label-code text-label-code px-1.5 py-0.5 rounded bg-error/20 text-error">
                        +5m DELAY
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface">
                      Signal halt triggered at Monkey Hill Cabin (Brake pipe drop)
                    </span>
                    <span className="font-label-code text-label-code text-on-surface-variant">
                      KM 118.4 • Interlocked Section 14
                    </span>
                  </div>
                </div>

                {/* Node 2: Secondary Conflict */}
                <div className="relative flex items-start gap-hud-pad-md z-10">
                  <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-code text-label-code font-bold shadow-md">
                    2
                  </div>
                  <div className="flex-1 p-hud-pad-sm rounded-lg bg-surface-container flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-label-code text-secondary font-bold">
                        MISSED CROSSING AT KHANDALA LOOP
                      </span>
                      <span className="font-label-code text-label-code text-on-surface-variant">CONFLICT</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface">
                      Platform 2 occupied; scheduled routing foul-point lockout active.
                    </span>
                    <span className="font-label-code text-label-code text-on-surface-variant">
                      Point 44A jammed in reverse route
                    </span>
                  </div>
                </div>

                {/* Node 3: Your Train Impact */}
                <div className="relative flex items-start gap-hud-pad-md z-10">
                  <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-code text-label-code font-bold shadow-md">
                    3
                  </div>
                  <div className="flex-1 p-hud-pad-sm rounded-lg bg-surface-container-high flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-label-code text-primary font-bold">
                        YOUR TRAIN (12626) IMPACTED
                      </span>
                      <span className="font-label-code text-label-code px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold">
                        +6m ACCUMULATED
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface">
                      Held at Signal 12 (Aspect: Double Yellow countdown to Red).
                    </span>
                    <span className="font-label-code text-label-code text-tertiary">
                      Speed restriction 15 km/h enforced in approach
                    </span>
                  </div>
                </div>

                {/* Node 4: Downstream Ripple */}
                <div className="relative flex items-start gap-hud-pad-md z-10">
                  <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-label-code text-label-code font-bold">
                    4
                  </div>
                  <div className="flex-1 p-hud-pad-sm rounded-lg bg-surface-container flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-label-code text-on-surface-variant font-bold">
                        DOWNSTREAM RIPPLE: TRAIN 11020
                      </span>
                      <span className="font-label-code text-label-code px-1.5 py-0.5 rounded bg-surface-variant text-on-surface-variant">
                        +9m FORECAST
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Must hold Karjat outer loop. System equilibrium restored post-Lonavala.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RUGGED INDUSTRIAL TACTILE QUICK ACTION BAR */}
          <div className="pt-2 flex flex-col gap-hud-pad-xs">
            <div className="flex gap-hud-pad-xs">
              <button
                onClick={handleOverride}
                className={`flex-1 h-12 min-h-touch-target-min rounded-lg font-label-code text-label-code font-bold flex items-center justify-center gap-hud-pad-xs uppercase transition-all active:scale-98 ${
                  isModelOverridden
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-primary">history_toggle_off</span>
                <span>{isModelOverridden ? 'Model Overridden' : 'Override Model'}</span>
              </button>
              <button
                onClick={handleAck}
                className={`flex-1 h-12 min-h-touch-target-min rounded-lg font-label-code text-label-code font-bold flex items-center justify-center gap-hud-pad-xs uppercase transition-all active:scale-98 ${
                  isAcknowledged
                    ? 'bg-tertiary-container text-on-tertiary-container'
                    : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary">sync</span>
                <span>{isAcknowledged ? 'Acknowledged' : 'Acknowledge'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
