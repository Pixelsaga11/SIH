import React, { useState, useEffect } from 'react';
import { VisibilityAheadForecastWidget } from './VisibilityAheadForecastWidget';

export const LiveHudScreen: React.FC = () => {
  const [currentSpeed, setCurrentSpeed] = useState<number>(74);
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [muteRemaining, setMuteRemaining] = useState<number>(30);
  const [isBrakingSimulated, setIsBrakingSimulated] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio Mute Countdown Timer
  useEffect(() => {
    let timer: any;
    if (isMuted && muteRemaining > 0) {
      timer = setInterval(() => {
        setMuteRemaining((prev) => {
          if (prev <= 1) {
            setIsMuted(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isMuted, muteRemaining]);

  // Handle Pilot Alert Acknowledgment
  const handleAcknowledge = () => {
    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
    setIsAcknowledged(true);
    setToastMessage('Safety alert acknowledged. Logged to blackbox and section dispatch.');
    setTimeout(() => {
      setIsAcknowledged(false);
      setToastMessage(null);
    }, 4000);
  };

  // Handle Mute Toggle
  const handleMuteToggle = () => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    if (!isMuted) {
      setIsMuted(true);
      setMuteRemaining(30);
      setToastMessage('Cockpit TTS audio muted for 30 seconds');
    } else {
      setIsMuted(false);
      setMuteRemaining(30);
      setToastMessage('Cockpit TTS audio unmuted');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Interactive Quick Brake Simulation
  const toggleBrakeSimulation = () => {
    if (!isBrakingSimulated) {
      setIsBrakingSimulated(true);
      // smoothly decelerate to 50 km/h
      let s = currentSpeed;
      const interval = setInterval(() => {
        s -= 4;
        if (s <= 50) {
          s = 50;
          clearInterval(interval);
        }
        setCurrentSpeed(s);
      }, 120);
      setToastMessage('Service Brake 1.2 bar applied. Speed decelerating to 50 km/h target.');
    } else {
      setIsBrakingSimulated(false);
      let s = currentSpeed;
      const interval = setInterval(() => {
        s += 4;
        if (s >= 74) {
          s = 74;
          clearInterval(interval);
        }
        setCurrentSpeed(s);
      }, 120);
      setToastMessage('Regenerative hold released. Returning to cruise velocity.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Arc calculation for gauge
  // Max speed = 120 km/h. Arc angle spans 180 degrees.
  const speedPercentage = Math.min(100, Math.max(0, (currentSpeed / 120) * 100));
  // Polar arc coordinate helper
  // Center (100, 110), Radius = 80
  const angleRad = Math.PI - (speedPercentage / 100) * Math.PI;
  const sweepX = 100 - 80 * Math.cos(angleRad);
  const sweepY = 110 - 80 * Math.sin(angleRad);
  const largeArcFlag = speedPercentage > 100 ? 1 : 0;

  const targetLimit = 50;
  const isOverspeed = currentSpeed > targetLimit;
  const overspeedDelta = currentSpeed - targetLimit;

  return (
    <div className="flex flex-col w-full gap-hud-pad-sm px-grid-margin pb-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-22 inset-x-4 z-50 p-hud-pad-sm bg-surface-container-highest border border-primary/40 rounded-xl flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">info</span>
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

      {/* TOP SAFETY BANNER (PRIORITY 1 - CRITICAL INTERVENTION) */}
      <section className="relative w-full rounded-xl overflow-hidden bg-error-container text-on-error-container shadow-xl">
        {/* Pulsing ambient danger glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-error/30 via-error-container to-error/20 animate-pulse pointer-events-none"></div>

        <div className="relative p-hud-pad-sm flex flex-col gap-hud-pad-xs">
          {/* Header row: Status badges & Alert tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-hud-pad-xs">
              <span className="inline-flex items-center gap-1 px-hud-pad-xs py-0.5 rounded bg-error text-on-error font-label-code text-label-code font-bold animate-bounce">
                <span
                  className="material-symbols-outlined text-[15px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  warning
                </span>
                PRIORITY 1 : HIGH
              </span>
              <span className="font-label-code text-label-code uppercase tracking-wider text-error bg-surface-container-lowest/80 px-2 py-0.5 rounded font-semibold">
                BRAKE MANDATE
              </span>
            </div>
            <div className="flex items-center gap-1 font-label-code text-label-code text-error">
              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              <span className="font-bold">{isMuted ? 'TTS MUTED' : 'TTS AUDIO ACTIVE'}</span>
            </div>
          </div>

          {/* Main Alert Title */}
          <div className="flex items-start gap-hud-pad-sm pt-1">
            <span
              className="material-symbols-outlined text-error text-[28px] shrink-0 mt-0.5 animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              roundabout_left
            </span>
            <div className="flex flex-col">
              <h2 className="font-headline-md text-headline-md font-bold tracking-tight text-error leading-tight">
                SHARP CURVE AHEAD — 1.2 km
              </h2>
              <span className="font-label-code text-label-code text-on-error-container/90 uppercase tracking-widest mt-0.5">
                MANDATORY SPEED CEILING:{' '}
                <strong className="text-error underline decoration-2 underline-offset-2">
                  50 KM/H
                </strong>
              </span>
            </div>
          </div>

          {/* Tactical Brake Envelope Action Box */}
          <div className="mt-1 p-hud-pad-sm rounded-lg bg-surface-container-lowest/90 text-on-surface flex flex-col gap-hud-pad-xs shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="font-label-code text-label-code text-on-surface-variant">CURRENT</span>
                <span className={`font-telemetry-md text-telemetry-md font-bold ${isOverspeed ? 'text-error' : 'text-tertiary'}`}>
                  {currentSpeed}
                </span>
                <span className="font-label-code text-label-code text-on-surface-variant">KM/H</span>
              </div>
              <span className="material-symbols-outlined text-primary text-[18px]">trending_down</span>
              <div className="flex items-baseline gap-1">
                <span className="font-label-code text-label-code text-on-surface-variant">TARGET</span>
                <span className="font-telemetry-md text-telemetry-md text-tertiary font-bold">50</span>
                <span className="font-label-code text-label-code text-on-surface-variant">KM/H</span>
              </div>
              <div className={`px-2 py-0.5 rounded font-label-code text-label-code font-bold ${
                isOverspeed ? 'bg-error/20 text-error' : 'bg-tertiary/20 text-tertiary'
              }`}>
                {isOverspeed ? `Δ -${overspeedDelta} KM/H` : 'Δ 0 ON TARGET'}
              </div>
            </div>

            {/* Progress Deceleration Window */}
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex">
              <div className="bg-error h-full w-[35%]"></div>
              <div className="bg-secondary-container h-full w-[45%]"></div>
              <div className="bg-tertiary h-full w-[20%]"></div>
            </div>

            <div className="flex items-center justify-between font-label-code text-label-code pt-0.5">
              <span className="text-secondary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">tune</span>
                RECOMMENDED: MODERATE SERVICE BRAKE (BAP 1.2 bar)
              </span>
              <span className="text-primary font-bold">850m RUN-OUT</span>
            </div>
          </div>
        </div>

        {/* Secondary Alert Ticker Tape */}
        <div className="bg-surface-container-lowest px-hud-pad-sm py-1.5 flex items-center gap-hud-pad-sm overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="flex items-center gap-1 text-secondary font-label-code text-label-code shrink-0">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-bold">SIGNAL S-44:</span>
            <span className="text-on-surface">DISTANT YELLOW (2.1 km)</span>
          </div>
          <span className="text-outline-variant font-label-code">|</span>
          <div className="flex items-center gap-1 text-tertiary font-label-code text-label-code shrink-0">
            <span className="material-symbols-outlined text-[13px]">verified_user</span>
            <span className="font-bold">SPAD RISK:</span>
            <span className="text-on-surface">LOW (Target 2.8 km)</span>
          </div>
          <span className="text-outline-variant font-label-code">|</span>
          <div className="flex items-center gap-1 text-primary font-label-code text-label-code shrink-0">
            <span className="material-symbols-outlined text-[13px]">alt_route</span>
            <span className="font-bold">LC-88:</span>
            <span className="text-on-surface">UNGATED 4.2 km (CLEAR)</span>
          </div>
        </div>
      </section>

      {/* 🔴 LOW VISIBILITY + RESTRICTIVE SIGNAL AHEAD COMPOUND HAZARD BANNER */}
      <div className="w-full rounded-xl bg-error-container/40 border-2 border-error p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-error text-[28px] animate-pulse">crisis_alert</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-headline-md text-headline-md text-error font-bold uppercase">
                LOW VISIBILITY + RESTRICTIVE SIGNAL AHEAD
              </span>
              <span className="px-2 py-0.5 rounded bg-error text-on-error font-label-code text-[10px] font-bold">
                BLIND GAP: +300m
              </span>
            </div>
            <span className="font-label-code text-[11px] text-on-surface-variant mt-0.5">
              Visibility: <strong className="text-secondary">380 m</strong> • Signal: <strong className="text-on-surface">1.2 km ahead</strong> • Current speed: <strong className="text-on-surface">{currentSpeed} km/h</strong> • Stopping distance: <strong className="text-error">680 m</strong>
            </span>
            <span className="font-body-sm text-[11px] text-on-surface font-semibold mt-0.5">
              ⚠️ Increase attention / follow prescribed operating procedure (FSP DETONATOR ARMED / SPEED CEILING 60 KM/H)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleBrakeSimulation}
            className="px-3 py-1.5 rounded-lg bg-error text-on-error font-label-code text-xs font-bold uppercase active:scale-95 shadow-sm"
          >
            {isBrakingSimulated ? 'BRAKING APPLIED' : 'APPLY CAUTION BRAKE'}
          </button>
        </div>
      </div>

      {/* DUAL-COCKPIT INSTRUMENT DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-hud-pad-md w-full">
        {/* COLUMN 1: VELOCITY INSTRUMENT CLUSTER & PILOT BRAKE CONTROL (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-hud-pad-md">
          {/* SPEED HUD INSTRUMENT CLUSTER (RADIAL RETICLE + VECTOR GUIDANCE) */}
          <section className="w-full rounded-xl bg-surface-container-low p-hud-pad-md flex flex-col gap-hud-pad-sm shadow-md">
        {/* Cluster Horizon Label */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">speed</span>
            <span className="font-headline-md text-headline-md text-on-surface">DYNAMIC VECTOR SPEED</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-code text-label-code">
            <span>KAWACH ATP: ARMED</span>
          </div>
        </div>

        {/* Speedometer Main Display Gauge */}
        <div className="relative flex flex-col items-center justify-center pt-2">
          {/* Arc SVG Gauge */}
          <div className="relative w-72 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-180" viewBox="0 0 200 120">
              {/* Background Track Arc (0 - 120 km/h) */}
              <path
                d="M 20 110 A 80 80 0 0 1 180 110"
                fill="none"
                stroke="#1c1f2a"
                strokeLinecap="round"
                strokeWidth="12"
              />
              {/* Target Limit Region 50km/h tick boundary */}
              <path
                d="M 20 110 A 80 80 0 0 1 85 36"
                fill="none"
                opacity="0.3"
                stroke="#1bbd85"
                strokeLinecap="round"
                strokeWidth="12"
              />
              {/* Caution Speed Limit Range (50 - 80 km/h) */}
              <path
                d="M 85 36 A 80 80 0 0 1 140 45"
                fill="none"
                opacity="0.4"
                stroke="#ffb95f"
                strokeWidth="12"
              />
              {/* Overspeed Zone (> 80 to 110) */}
              <path
                d="M 140 45 A 80 80 0 0 1 180 110"
                fill="none"
                opacity="0.3"
                stroke="#93000a"
                strokeLinecap="round"
                strokeWidth="12"
              />
              {/* Active Speed Sweep */}
              <path
                className="filter drop-shadow transition-all duration-300"
                d={`M 20 110 A 80 80 0 ${largeArcFlag} 1 ${sweepX.toFixed(1)} ${sweepY.toFixed(1)}`}
                fill="none"
                stroke={isOverspeed ? '#4cd7f6' : '#4edea3'}
                strokeLinecap="round"
                strokeWidth="12"
              />
              {/* Dynamic Deceleration Recommended Notch (50 km/h) */}
              <line stroke="#ffb95f" strokeLinecap="round" strokeWidth="3" x1="85" x2="92" y1="36" y2="28" />
              {/* Sectional Max Tick (80 km/h) */}
              <line stroke="#dfe2f1" strokeWidth="2" x1="140" x2="147" y1="45" y2="39" />
            </svg>

            {/* Centered Digital Readout inside gauge */}
            <div className="absolute bottom-2 flex flex-col items-center justify-center text-center">
              <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider -mb-1">
                ACTUAL VELOCITY
              </span>
              <div className="flex items-baseline">
                <span
                  className="font-telemetry-speed-mobile text-telemetry-speed-mobile font-bold text-on-surface tracking-tighter"
                  id="speedValue"
                >
                  {currentSpeed}
                </span>
                <span className="font-label-code text-label-code text-primary font-bold ml-1">KM/H</span>
              </div>
              <div
                className={`flex items-center gap-1 font-label-code text-label-code ${
                  isOverspeed ? 'text-error' : 'text-tertiary'
                }`}
              >
                <span className="material-symbols-outlined text-[13px] animate-pulse">
                  {isOverspeed ? 'arrow_downward' : 'check_circle'}
                </span>
                <span>{isOverspeed ? `OVERSPEED +${overspeedDelta} vs CURVE` : 'ON SAFE CURVE PROFILE'}</span>
              </div>
            </div>
          </div>

          {/* Quick Throttle/Brake simulation trigger button */}
          <button
            onClick={toggleBrakeSimulation}
            className="text-[11px] font-label-code px-3 py-1 rounded bg-surface-container-highest hover:bg-surface-bright text-primary flex items-center gap-1.5 active:scale-95 transition-all mt-1"
          >
            <span className="material-symbols-outlined text-[14px]">
              {isBrakingSimulated ? 'restore' : 'car_brake_alert'}
            </span>
            <span>{isBrakingSimulated ? 'RELEASE BRAKE (ACCELERATE)' : 'TEST SERVICE BRAKE (BAP 1.2)'}</span>
          </button>

          {/* Operational Speed Limit Reference Notches */}
          <div className="grid grid-cols-3 gap-2 w-full mt-2">
            {/* Curve Limit */}
            <div className="p-2 rounded-lg bg-surface-container flex flex-col items-center text-center">
              <span className="font-label-code text-label-code text-error font-bold uppercase">TARGET LIMIT</span>
              <span className="font-telemetry-md text-telemetry-md text-error font-bold">50</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Curve C-19</span>
            </div>
            {/* Sectional Speed Limit */}
            <div className="p-2 rounded-lg bg-surface-container flex flex-col items-center text-center">
              <span className="font-label-code text-label-code text-secondary font-bold uppercase">SECTIONAL</span>
              <span className="font-telemetry-md text-telemetry-md text-secondary font-bold">80</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Bhopal Div</span>
            </div>
            {/* Maximum Permissible Speed (MPS) */}
            <div className="p-2 rounded-lg bg-surface-container flex flex-col items-center text-center">
              <span className="font-label-code text-label-code text-on-surface-variant font-bold uppercase">
                MPS LIMIT
              </span>
              <span className="font-telemetry-md text-telemetry-md text-on-surface font-bold">110</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">WAP-7 Rake</span>
            </div>
          </div>

          {/* Deceleration Dynamic Corridor Card */}
          <div className="w-full mt-2 p-hud-pad-sm rounded-lg bg-surface-container-high flex flex-col gap-1">
            <div className="flex items-center justify-between text-label-code font-label-code">
              <span className="text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-tertiary">analytics</span>
                BRAKING ENVELOPE COMPUTATION
              </span>
              <span className="text-tertiary font-bold">SAFE MARGIN: +240m</span>
            </div>
            <div className="flex items-center justify-between font-label-code text-label-code text-on-surface-variant">
              <span>
                Decel Rate Req: <strong className="text-on-surface">0.42 m/s²</strong>
              </span>
              <span>
                Time to Target: <strong className="text-secondary">41 SEC</strong>
              </span>
              <span>
                Buffer: <strong className="text-tertiary">OPTIMAL</strong>
              </span>
            </div>
          </div>
        </div>
          </section>
        </div>

        {/* COLUMN 2: FORWARD HORIZON & TACTICAL INTERVENTION (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-hud-pad-md">
          {/* NEXT OPERATIONAL EVENT PREVIEW (HORIZONTAL TRACK TIMELINE) */}
          <section className="w-full rounded-xl bg-surface-container-low p-hud-pad-md flex flex-col gap-hud-pad-sm shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">timeline</span>
            <span className="font-headline-md text-headline-md text-on-surface">FORWARD HORIZON (8 KM)</span>
          </div>
          <span className="font-label-code text-label-code text-on-surface-variant">ROUTE 12626 DN</span>
        </div>

        {/* Timeline Nodes */}
        <div className="relative flex flex-col gap-2 pt-1">
          {/* Continuous track link background line */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-surface-container-highest"></div>

          {/* Node 1: Urgent Curve C-19 */}
          <div className="relative flex items-center gap-3 pl-1">
            <div className="w-7 h-7 rounded-full bg-error flex items-center justify-center text-on-error shrink-0 z-10 shadow-md">
              <span className="material-symbols-outlined text-[15px]">turn_sharp_left</span>
            </div>
            <div className="flex-1 p-2 rounded-lg bg-surface-container flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-error leading-none">
                  Curve C-19 (R-420m)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Speed Cap: 50 km/h
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-telemetry-md text-telemetry-md text-error font-bold">1.2 km</span>
                <span className="font-label-code text-label-code text-on-surface-variant">~58 sec</span>
              </div>
            </div>
          </div>

          {/* Node 2: Signal S-44 Yellow */}
          <div className="relative flex items-center gap-3 pl-1">
            <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0 z-10 shadow-md">
              <span className="material-symbols-outlined text-[15px]">traffic</span>
            </div>
            <div className="flex-1 p-2 rounded-lg bg-surface-container flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-secondary leading-none">
                  Signal S-44 [Distant]
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Aspect: Double Yellow Caution
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-telemetry-md text-telemetry-md text-secondary font-bold">2.1 km</span>
                <span className="font-label-code text-label-code text-on-surface-variant">~1m 42s</span>
              </div>
            </div>
          </div>

          {/* Node 3: Ungated Level Crossing LC-88 */}
          <div className="relative flex items-center gap-3 pl-1">
            <div className="w-7 h-7 rounded-full bg-surface-bright flex items-center justify-center text-primary shrink-0 z-10">
              <span className="material-symbols-outlined text-[15px]">minor_crash</span>
            </div>
            <div className="flex-1 p-2 rounded-lg bg-surface-container flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-on-surface leading-none">
                  LC-88 Ungated Crossing
                </span>
                <span className="font-body-sm text-body-sm text-tertiary mt-0.5">
                  Radar: Track Clear • Whistle 2x
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-telemetry-md text-telemetry-md text-on-surface font-bold">4.2 km</span>
                <span className="font-label-code text-label-code text-on-surface-variant">~3m 24s</span>
              </div>
            </div>
          </div>

          {/* Node 4: Preceding Train Conflict Monitor */}
          <div className="relative flex items-center gap-3 pl-1">
            <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant shrink-0 z-10">
              <span className="material-symbols-outlined text-[15px]">train</span>
            </div>
            <div className="flex-1 p-2 rounded-lg bg-surface-container flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-on-surface-variant leading-none">
                  Train 22124 Ahead
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Speed: 82 km/h • Diverging
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-telemetry-md text-telemetry-md text-on-surface-variant font-bold">
                  7.8 km
                </span>
                <span className="font-label-code text-label-code text-on-surface-variant">Spacing Safe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATUS CARDS: GRADIENT DESCENT & COCKPIT CONTROLS */}
      <section className="grid grid-cols-1 gap-hud-pad-sm w-full">
        {/* Gradient Descent Notice Card */}
        <div className="p-hud-pad-sm rounded-xl bg-surface-container flex items-center justify-between shadow-md">
          <div className="flex items-center gap-hud-pad-sm">
            <div className="w-11 h-11 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">landslide</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-headline-md text-secondary leading-tight">
                  GHAT GRADIENT -1:80
                </span>
                <span className="px-1.5 py-0.5 bg-secondary-container/30 text-secondary font-label-code text-label-code rounded font-bold">
                  STEEP
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Commences in <strong>3.4 km</strong>. Dynamic Rheostatic Brake prep advised.
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0 pl-2">
            <span className="font-label-code text-label-code text-secondary font-bold">RHEO READY</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">electric_meter</span>
          </div>
        </div>

        {/* 🌫️ VISIBILITY AHEAD FORECAST (LOCOPILOT HUD VIEW) */}
        <VisibilityAheadForecastWidget compact />

        {/* TACTICAL BUTTONS (Minimum 48px Touch-Target min compliant) */}
        <div className="grid grid-cols-2 gap-hud-pad-sm w-full">
          {/* Master Safety Alert Acknowledgment Button */}
          <button
            id="ackButton"
            onClick={handleAcknowledge}
            className={`h-12 min-h-touch-target-min rounded-xl transition-all flex items-center justify-center gap-2 px-3 shadow-lg select-none ${
              isAcknowledged
                ? 'bg-tertiary-container text-on-tertiary-container'
                : 'bg-primary text-on-primary hover:bg-primary-container active:scale-95'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isAcknowledged ? 'check_circle' : 'done_all'}
            </span>
            <div className="flex flex-col text-left">
              <span className="font-headline-md text-headline-md leading-tight font-bold">
                {isAcknowledged ? 'ACKNOWLEDGED' : 'ACKNOWLEDGE'}
              </span>
              <span className="font-label-code text-label-code opacity-90 leading-none">
                {isAcknowledged ? 'LOGGED AT DISPATCH' : 'SAFETY ALERT'}
              </span>
            </div>
          </button>

          {/* Cabin Audio Alert Mute Toggle Button */}
          <button
            id="muteButton"
            onClick={handleMuteToggle}
            className="h-12 min-h-touch-target-min rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-bright active:scale-95 transition-all flex items-center justify-center gap-2 px-3 shadow-md select-none"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${isMuted ? 'text-secondary' : ''}`}
              id="muteIcon"
            >
              {isMuted ? 'notifications_paused' : 'volume_off'}
            </span>
            <div className="flex flex-col text-left">
              <span className="font-headline-md text-headline-md text-on-surface leading-tight font-bold" id="muteText">
                {isMuted ? 'MUTED' : 'AUDIO MUTE'}
              </span>
              <span className="font-label-code text-label-code text-on-surface-variant leading-none" id="muteSubtext">
                {isMuted ? `${muteRemaining} SEC REMAINING` : 'TIMER: 30 SEC'}
              </span>
            </div>
          </button>
        </div>
      </section>
        </div>
      </div>
    </div>
  );
};
