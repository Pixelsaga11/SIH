import React, { useState } from 'react';
import {
  DEFAULT_FOG_THRESHOLDS,
  INITIAL_VISIBILITY_METRICS,
  INITIAL_EARLY_FOG_WARNING,
  INITIAL_ROUTE_VISIBILITY_FORECAST,
  INITIAL_COMPOUND_HAZARDS,
  INITIAL_AI_FOG_IMPACT,
} from '../data/fogVisibilityData';
import {
  FogThresholdRule,
  RealtimeVisibilityMetrics,
  EarlyFogWarning,
  FogSafetyCompoundHazard,
  FogWarningLevel,
} from '../types';
import { VisibilityAheadForecastWidget } from './VisibilityAheadForecastWidget';

interface FogVisibilityScreenProps {
  onNavigateTab?: (tab: any) => void;
}

export const FogVisibilityScreen: React.FC<FogVisibilityScreenProps> = ({ onNavigateTab }) => {
  // State for metrics and simulated scenarios
  const [metrics, setMetrics] = useState<RealtimeVisibilityMetrics>(INITIAL_VISIBILITY_METRICS);
  const [earlyWarning, setEarlyWarning] = useState<EarlyFogWarning>(INITIAL_EARLY_FOG_WARNING);
  const [thresholdRules, setThresholdRules] = useState<FogThresholdRule[]>(DEFAULT_FOG_THRESHOLDS);
  const [hazards] = useState<FogSafetyCompoundHazard[]>(INITIAL_COMPOUND_HAZARDS);
  const [selectedHazardId, setSelectedHazardId] = useState<string>('hazard-signal-12');

  // Interactive cockpit controls
  const [isFsdArmed, setIsFsdArmed] = useState<boolean>(true);
  const [isSandersTested, setIsSandersTested] = useState<boolean>(false);
  const [isFogSpeedAcknowledged, setIsFogSpeedAcknowledged] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<'current' | 'clearing' | 'critical'>('current');

  // Active hazard selection
  const selectedHazard = hazards.find((h) => h.id === selectedHazardId) || hazards[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleScenarioChange = (scenario: 'current' | 'clearing' | 'critical') => {
    setActiveScenario(scenario);
    if (scenario === 'current') {
      setMetrics({
        ...INITIAL_VISIBILITY_METRICS,
        visibilityMeters: 450,
        visibilityKmText: '450 m',
        warningLevel: 'VERY_LOW',
        fogDensity: 'Dense',
        trend: 'worsening',
      });
      triggerToast('Scenario: Khandala Valley Dense Inversion Fog active.');
    } else if (scenario === 'clearing') {
      setMetrics({
        ...INITIAL_VISIBILITY_METRICS,
        visibilityMeters: 2200,
        visibilityKmText: '2.2 km',
        warningLevel: 'NORMAL',
        fogDensity: 'Light',
        relativeHumidity: 78,
        trend: 'improving',
      });
      triggerToast('Scenario: Sun breakdown clearing fog; Visibility improved to 2.2 km.');
    } else {
      setMetrics({
        ...INITIAL_VISIBILITY_METRICS,
        visibilityMeters: 140,
        visibilityKmText: '140 m',
        warningLevel: 'CRITICAL',
        fogDensity: 'Thick Radiation Fog',
        relativeHumidity: 99,
        trend: 'worsening',
      });
      triggerToast('CRITICAL: Emergency zero-visibility fog. Immediate speed reduction to 30 km/h!');
    }
  };

  const handleArmFsd = () => {
    setIsFsdArmed(!isFsdArmed);
    triggerToast(
      !isFsdArmed
        ? 'Fog Safety Device (FSD) GPS sounder armed. Beeps 500m before all signals & landmarks.'
        : 'FSD beacon sounder muted.'
    );
  };

  const handleTestSanders = () => {
    setIsSandersTested(true);
    triggerToast('Pneumatic Sand Ejectors discharged. Rail adhesion restored (+18%).');
  };

  const handleAcknowledgeSpeed = () => {
    setIsFogSpeedAcknowledged(true);
    triggerToast('Fog Speed Mandate (60 km/h) logged to Cab Blackbox recorder.');
  };

  const getWarningBadge = (level: FogWarningLevel) => {
    switch (level) {
      case 'NORMAL':
        return { label: '🟢 Normal', badgeClass: 'bg-tertiary/20 text-tertiary border-tertiary/40' };
      case 'REDUCED':
        return { label: '🟡 Reduced visibility', badgeClass: 'bg-secondary/20 text-secondary border-secondary/40' };
      case 'LOW':
        return { label: '🟠 Low visibility', badgeClass: 'bg-secondary-container text-secondary border-secondary/50' };
      case 'VERY_LOW':
        return { label: '🔴 Very low visibility', badgeClass: 'bg-error-container text-error border-error/50' };
      case 'CRITICAL':
        return { label: '🛑 Critical visibility', badgeClass: 'bg-error text-on-error border-error animate-pulse' };
      default:
        return { label: 'Unknown', badgeClass: 'bg-surface-container text-on-surface' };
    }
  };

  const curBadge = getWarningBadge(metrics.warningLevel);

  return (
    <div className="flex flex-col w-full px-hud-pad-md gap-hud-pad-md pb-10">
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed top-22 inset-x-4 z-50 p-hud-pad-sm bg-surface-container-highest border border-primary/40 rounded-xl flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-[20px] text-primary">cloud</span>
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

      {/* 1. EARLY FOG WARNING CALLOUT BANNER (PRIORITY ITEM 3) */}
      {earlyWarning.active && (
        <div className="relative overflow-hidden rounded-xl bg-error-container/30 border-2 border-error p-hud-pad-md shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🌫️</span>
              <div>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:text-headline-md font-bold text-error tracking-tight flex items-center gap-2 uppercase">
                  {earlyWarning.title}
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Location: <strong className="text-on-surface font-label-code">{earlyWarning.locationAheadKm} km ahead</strong> ({earlyWarning.landmark}) • Expected duration:{' '}
                  <strong className="text-on-surface font-label-code">{earlyWarning.expectedDurationMin} min</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full font-label-code text-xs font-bold uppercase tracking-wider bg-error text-on-error animate-pulse">
                RISK: {earlyWarning.riskLevel}
              </span>
              <span className="px-2 py-1 rounded font-label-code text-xs font-bold uppercase bg-surface-container border border-error/40 text-error">
                VISIBILITY: {earlyWarning.visibilityMeters} m ↓ ({earlyWarning.trend.toUpperCase()})
              </span>
            </div>
          </div>

          {/* Quick Action Bar inside Early Warning */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-error/20">
            <button
              onClick={handleArmFsd}
              className={`h-10 min-h-touch-target-min px-3 rounded-lg font-label-code text-xs font-bold flex items-center justify-center gap-1.5 uppercase transition-all shadow-sm active:scale-95 ${
                isFsdArmed
                  ? 'bg-tertiary text-on-tertiary'
                  : 'bg-surface-container-high text-on-surface border border-surface-container-highest hover:bg-surface-bright'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFsdArmed ? 'notifications_active' : 'notifications_off'}
              </span>
              <span>{isFsdArmed ? 'FSD BEACON ARMED' : 'ARM FSD BEACON'}</span>
            </button>

            <button
              onClick={handleAcknowledgeSpeed}
              className={`h-10 min-h-touch-target-min px-3 rounded-lg font-label-code text-xs font-bold flex items-center justify-center gap-1.5 uppercase transition-all shadow-sm active:scale-95 ${
                isFogSpeedAcknowledged
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-high text-on-surface border border-surface-container-highest hover:bg-surface-bright'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">speed</span>
              <span>{isFogSpeedAcknowledged ? '60 KM/H MANDATE LOGGED' : 'ACKNOWLEDGE 60 KM/H SPEED'}</span>
            </button>

            <button
              onClick={handleTestSanders}
              className={`h-10 min-h-touch-target-min px-3 rounded-lg font-label-code text-xs font-bold flex items-center justify-center gap-1.5 uppercase transition-all shadow-sm active:scale-95 ${
                isSandersTested
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface border border-surface-container-highest hover:bg-surface-bright'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grain</span>
              <span>{isSandersTested ? 'SANDERS TESTED (OK)' : 'TEST SAND DISCHARGE'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SIMULATOR SCENARIO CONTROLS */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-high border border-surface-container-highest/60 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
          <span className="font-label-code text-xs uppercase font-bold text-on-surface">
            ATMOSPHERIC SCENARIO SIMULATOR:
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScenarioChange('clearing')}
            className={`px-3 py-1.5 rounded-lg font-label-code text-xs uppercase font-bold transition-all ${
              activeScenario === 'clearing'
                ? 'bg-tertiary text-on-tertiary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Clear (&gt; 2 km)
          </button>
          <button
            onClick={() => handleScenarioChange('current')}
            className={`px-3 py-1.5 rounded-lg font-label-code text-xs uppercase font-bold transition-all ${
              activeScenario === 'current'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Valley Fog (450 m)
          </button>
          <button
            onClick={() => handleScenarioChange('critical')}
            className={`px-3 py-1.5 rounded-lg font-label-code text-xs uppercase font-bold transition-all ${
              activeScenario === 'critical'
                ? 'bg-error text-on-error animate-pulse shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Zero Fog (&lt; 150 m)
          </button>
          <button
            onClick={() => setIsThresholdModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg font-label-code text-xs uppercase font-semibold bg-surface-container-highest text-primary hover:bg-surface-bright flex items-center gap-1"
            title="Configure Railway Operating Rules"
          >
            <span className="material-symbols-outlined text-[14px]">settings</span>
            <span>Rules</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-hud-pad-md w-full">
        {/* COLUMN 1: REAL-TIME VISIBILITY MONITORING & LOCATION-BASED FORECAST (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-hud-pad-md">
          {/* SECTION 1: REAL-TIME VISIBILITY MONITORING TELEMETRY DECK */}
          <div className="rounded-xl bg-surface-container-low p-hud-pad-md shadow-md border border-surface-container-highest/60 flex flex-col gap-hud-pad-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">visibility</span>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Real-Time Visibility Telemetry
                  </h2>
                  <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                    OPTICAL TRANSMISSOMETER + FORWARD RADAR SENSOR CLUSTERS
                  </span>
                </div>
              </div>

              <div className={`px-2.5 py-1 rounded-full font-label-code text-xs font-bold border ${curBadge.badgeClass}`}>
                {curBadge.label}
              </div>
            </div>

            {/* Primary Sightline Readout Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-surface-container p-3 rounded-xl border border-surface-container-highest/40">
              <div className="flex flex-col justify-center">
                <span className="font-label-code text-[11px] text-on-surface-variant uppercase">
                  CURRENT VISIBILITY DISTANCE
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-telemetry-lg text-telemetry-lg font-bold text-on-surface">
                    {metrics.visibilityMeters}
                  </span>
                  <span className="font-label-code text-sm text-on-surface-variant">METERS</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="font-label-code text-xs text-secondary font-semibold">
                    Trend:{' '}
                    <strong className="uppercase">
                      {metrics.trend} {metrics.trend === 'worsening' ? '↓' : metrics.trend === 'improving' ? '↑' : '➔'}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center border-y sm:border-y-0 sm:border-x border-surface-container-highest/60 sm:px-3 py-2 sm:py-0">
                <span className="font-label-code text-[11px] text-on-surface-variant uppercase">FOG DENSITY &amp; TYPE</span>
                <span className="font-headline-md text-headline-md text-secondary mt-0.5">
                  {metrics.fogDensity}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant leading-tight mt-1">
                  {metrics.weatherCondition}
                </span>
              </div>

              <div className="flex flex-col justify-center">
                <span className="font-label-code text-[11px] text-on-surface-variant uppercase">SAFE SPEED MANDATE</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-telemetry-lg text-telemetry-lg font-bold text-error">
                    {metrics.visibilityMeters < 200 ? '30' : metrics.visibilityMeters < 500 ? '60' : '90'}
                  </span>
                  <span className="font-label-code text-sm text-on-surface-variant">KM/H MPS</span>
                </div>
                <span className="font-body-sm text-body-sm text-primary mt-1">
                  IR General Rules GR 3.61
                </span>
              </div>
            </div>

            {/* Environmental Sensors 5-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-label-code">
              {/* Humidity */}
              <div className="p-2 rounded-lg bg-surface-container flex flex-col items-center text-center">
                <span className="text-[10px] text-on-surface-variant uppercase">Rel Humidity</span>
                <div className="flex items-center gap-1 mt-1 text-primary">
                  <span className="material-symbols-outlined text-[16px]">water_drop</span>
                  <span className="text-sm font-bold">{metrics.relativeHumidity}%</span>
                </div>
                <span className="text-[9px] text-error">Near Condensation</span>
              </div>

              {/* Temperature */}
              <div className="p-2 rounded-lg bg-surface-container flex flex-col items-center text-center">
                <span className="text-[10px] text-on-surface-variant uppercase">Air Temp</span>
                <div className="flex items-center gap-1 mt-1 text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-secondary">device_thermostat</span>
                  <span className="text-sm font-bold">{metrics.temperatureC}°C</span>
                </div>
                <span className="text-[9px] text-on-surface-variant">Ghat Ambient</span>
              </div>

              {/* Dew Point */}
              <div className="p-2 rounded-lg bg-surface-container flex flex-col items-center text-center">
                <span className="text-[10px] text-on-surface-variant uppercase">Dew Point</span>
                <div className="flex items-center gap-1 mt-1 text-secondary">
                  <span className="material-symbols-outlined text-[16px]">thermostat_auto</span>
                  <span className="text-sm font-bold">{metrics.dewPointC}°C</span>
                </div>
                <span className="text-[9px] text-secondary">Spread: 0.4°C</span>
              </div>

              {/* Wind Speed */}
              <div className="p-2 rounded-lg bg-surface-container flex flex-col items-center text-center">
                <span className="text-[10px] text-on-surface-variant uppercase">Wind Speed</span>
                <div className="flex items-center gap-1 mt-1 text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-primary">air</span>
                  <span className="text-sm font-bold">{metrics.windSpeedKmh} km/h</span>
                </div>
                <span className="text-[9px] text-on-surface-variant">Stagnant Inversion</span>
              </div>

              {/* FSD Audio Beacon */}
              <div className="p-2 rounded-lg bg-surface-container flex flex-col items-center text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] text-on-surface-variant uppercase">FSD GPS Sounder</span>
                <div className="flex items-center gap-1 mt-1 text-tertiary">
                  <span className="material-symbols-outlined text-[16px]">volume_up</span>
                  <span className="text-sm font-bold">{isFsdArmed ? 'ARMED' : 'MUTED'}</span>
                </div>
                <span className="text-[9px] text-tertiary">500m Audio Alert</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: LOCATION-BASED VISIBILITY & FORECAST ALONG UPCOMING ROUTE */}
          <div className="rounded-xl bg-surface-container-low p-hud-pad-md shadow-md border border-surface-container-highest/60 flex flex-col gap-hud-pad-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">map</span>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Location-Based Route Visibility
                  </h2>
                  <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                    SPATIAL FOG CONTOUR ACROSS GHAT KM 112 – KM 132
                  </span>
                </div>
              </div>
              <span className="font-label-code text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                20 KM LOOKAHEAD
              </span>
            </div>

            {/* Visual Route Strip Schematic with Fog Cloud Gradient */}
            <div className="p-3 rounded-xl bg-surface-container flex flex-col gap-2 relative overflow-hidden">
              <div className="flex justify-between items-center font-label-code text-xs text-on-surface-variant">
                <span>Elevation: 610m (Lonavala)</span>
                <span className="text-secondary font-bold">VALLEY INVERSION LAYER (KM 120–127)</span>
                <span>Terminus: 120m (Karjat)</span>
              </div>

              {/* Visual SVG Map Track with Fog Strata */}
              <div className="w-full h-24 relative bg-surface-container-lowest rounded-lg p-2 overflow-hidden">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 80">
                  {/* Fog cloud gradient areas */}
                  <defs>
                    <linearGradient id="fogCloud" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.05" />
                      <stop offset="25%" stopColor="#ffb95f" stopOpacity="0.25" />
                      <stop offset="50%" stopColor="#ffb4ab" stopOpacity="0.6" />
                      <stop offset="75%" stopColor="#ffb4ab" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#4edea3" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Fog layer polygon */}
                  <rect fill="url(#fogCloud)" height="80" width="500" x="0" y="0" />

                  {/* Mountain slope line */}
                  <path
                    d="M 0 20 Q 150 25, 250 50 T 500 70"
                    fill="none"
                    stroke="#4cd7f6"
                    strokeWidth="2.5"
                  />

                  {/* Route points */}
                  {/* Point 1: NOW */}
                  <circle cx="20" cy="21" fill="#4edea3" r="5" />
                  <text fill="#4edea3" fontFamily="JetBrains Mono" fontSize="9" x="12" y="14">
                    NOW (2.1 km 🟢)
                  </text>

                  {/* Point 2: 5KM */}
                  <circle cx="130" cy="28" fill="#ffb95f" r="5" />
                  <text fill="#ffb95f" fontFamily="JetBrains Mono" fontSize="9" x="110" y="42">
                    5 KM (900 m 🟡)
                  </text>

                  {/* Point 3: 10KM */}
                  <circle cx="260" cy="52" fill="#ffb4ab" r="6" />
                  <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold" x="235" y="38">
                    10 KM (420 m 🔴)
                  </text>

                  {/* Point 4: 15KM */}
                  <circle cx="370" cy="62" fill="#ffb4ab" r="6" />
                  <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold" x="350" y="52">
                    15 KM (250 m 🔴)
                  </text>

                  {/* Point 5: 20KM */}
                  <circle cx="475" cy="70" fill="#4edea3" r="5" />
                  <text fill="#4edea3" fontFamily="JetBrains Mono" fontSize="9" x="430" y="60">
                    20 KM (1.8 km 🟢)
                  </text>

                  {/* Fog Inversion Ceiling Line */}
                  <line
                    stroke="#ffb4ab"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                    x1="180"
                    x2="420"
                    y1="32"
                    y2="32"
                  />
                  <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="8" x="230" y="26">
                    FOG CEILING: 550m ASL
                  </text>
                </svg>
              </div>

              {/* Exact user requested route text readout */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-label-code">
                <div className="p-2 rounded bg-surface-container-high border border-surface-container-highest/60 flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase">CURRENT</span>
                  <span className="text-xs font-bold text-on-surface mt-0.5">Visibility: 2.1 km 🟢</span>
                  <span className="text-[10px] text-tertiary">Clear Outers</span>
                </div>

                <div className="p-2 rounded bg-surface-container-high border border-surface-container-highest/60 flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase">5 KM AHEAD</span>
                  <span className="text-xs font-bold text-secondary mt-0.5">Visibility: 900 m 🟡</span>
                  <span className="text-[10px] text-on-surface-variant">Viaduct Mist</span>
                </div>

                <div className="p-2 rounded bg-error-container/20 border border-error/30 flex flex-col">
                  <span className="text-[10px] text-error uppercase font-bold">12 KM AHEAD</span>
                  <span className="text-xs font-bold text-error mt-0.5">Visibility: 350 m 🔴</span>
                  <span className="text-[10px] text-error">Dense Gorge Inversion</span>
                </div>

                <div className="p-2 rounded bg-surface-container-high border border-surface-container-highest/60 flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase">20 KM AHEAD</span>
                  <span className="text-xs font-bold text-tertiary mt-0.5">Visibility: 2.4 km 🟢</span>
                  <span className="text-[10px] text-tertiary">Plain Clearing</span>
                </div>
              </div>
            </div>

            {/* Embed the VisibilityAheadForecastWidget */}
            <VisibilityAheadForecastWidget points={INITIAL_ROUTE_VISIBILITY_FORECAST} />
          </div>
        </div>

        {/* COLUMN 2: FOG + TRAIN SAFETY PREDICTION & AI FOG CASCADE (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-hud-pad-md">
          {/* SECTION 5: FOG + TRAIN SAFETY PREDICTION (COMPOUND HAZARDS) */}
          <div className="rounded-xl bg-surface-container-low p-hud-pad-md shadow-md border border-surface-container-highest/60 flex flex-col gap-hud-pad-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[22px]">crisis_alert</span>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Fog + Safety Prediction
                  </h2>
                  <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                    COMPOUND HAZARD BRAKING &amp; SIGHTLINE MATRIX
                  </span>
                </div>
              </div>
              <span className="font-label-code text-[10px] px-2 py-0.5 rounded bg-error text-on-error font-bold uppercase animate-pulse">
                CRITICAL BLIND GAP
              </span>
            </div>

            {/* Selectable Hazard Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 font-label-code">
              {hazards.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHazardId(h.id)}
                  className={`p-1.5 rounded-lg text-left flex flex-col transition-all border ${
                    selectedHazardId === h.id
                      ? 'bg-surface-container-highest border-primary text-primary font-bold shadow-sm'
                      : 'bg-surface-container border-transparent text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="text-[10px] truncate uppercase">{h.hazardType.replace('_', ' ')}</span>
                  <span className="text-[11px] font-semibold text-on-surface truncate">{h.distanceKmText}</span>
                </button>
              ))}
            </div>

            {/* Active Hazard Detailed Deep-Dive Card */}
            <div className="rounded-xl bg-surface-container p-3 border border-error/40 flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-label-code text-xs font-bold text-error uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    {selectedHazard.title}
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-0.5">
                    {selectedHazard.targetEntity}
                  </h3>
                </div>
                <span className="font-label-code text-xs px-2 py-0.5 rounded bg-error text-on-error font-bold">
                  {selectedHazard.severity}
                </span>
              </div>

              {/* Crucial Sightline vs Stopping Distance Comparison */}
              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container-highest/60 flex flex-col gap-1.5 font-label-code">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant">Sightline (Visible Window):</span>
                  <span className="font-bold text-secondary">{selectedHazard.visibilityMeters} m</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant">Required Stopping Distance @ 72 km/h:</span>
                  <span className="font-bold text-error">{selectedHazard.stoppingDistanceRequiredMeters} m</span>
                </div>

                {/* Progress bar visual comparison */}
                <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden flex relative mt-1">
                  {/* Visibility portion */}
                  <div
                    className="bg-secondary h-full"
                    style={{
                      width: `${Math.round(
                        (selectedHazard.visibilityMeters / selectedHazard.stoppingDistanceRequiredMeters) * 100
                      )}%`,
                    }}
                    title="Visible distance"
                  />
                  {/* Sightline Deficit Danger Zone */}
                  <div
                    className="bg-error h-full relative"
                    style={{
                      width: `${
                        100 -
                        Math.round(
                          (selectedHazard.visibilityMeters / selectedHazard.stoppingDistanceRequiredMeters) * 100
                        )
                      }%`,
                    }}
                    title="Blind stopping deficit"
                  >
                    <span className="absolute inset-0 bg-white/25 animate-pulse" />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-error font-bold pt-0.5">
                  <span>SIGHTLINE DEFICIT:</span>
                  <span>+{selectedHazard.sightlineDeficitMeters} m BLIND BRAKING MARGIN</span>
                </div>
              </div>

              {/* Prescribed Operating Procedure Callout */}
              <div className="p-2.5 rounded-lg bg-surface-container-high border-l-4 border-error flex flex-col gap-1">
                <span className="font-label-code text-[10px] font-bold text-error uppercase tracking-wider">
                  PRESCRIBED OPERATING PROCEDURE:
                </span>
                <p className="font-body-sm text-body-sm text-on-surface font-medium leading-relaxed">
                  {selectedHazard.prescribedOperatingProcedure}
                </p>
                <div className="flex items-center justify-between text-[10px] font-label-code text-on-surface-variant pt-1 border-t border-surface-container-highest/40">
                  <span>STATUS: {selectedHazard.fogSignalPostStatus}</span>
                  <span className="text-tertiary font-bold">FSD BEEP: ARMED</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: AI FOG IMPACT & ETA CASCADE ENGINE */}
          <div className="rounded-xl bg-surface-container-low p-hud-pad-md shadow-md border border-surface-container-highest/60 flex flex-col gap-hud-pad-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">psychology</span>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    AI Fog Impact Prediction
                  </h2>
                  <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                    CASCADING DELAY PROPAGATION MODEL
                  </span>
                </div>
              </div>
              <span className="font-label-code text-xs text-tertiary font-bold">
                CONFIDENCE: 88%
              </span>
            </div>

            {/* Dynamic ETA Comparison Grid */}
            <div className="grid grid-cols-2 gap-2 bg-surface-container p-3 rounded-xl border border-surface-container-highest/40 font-label-code">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase">SCHEDULED ETA</span>
                <span className="font-telemetry-lg text-telemetry-lg text-on-surface">
                  {INITIAL_AI_FOG_IMPACT.scheduledEta}
                </span>
                <span className="text-[10px] text-on-surface-variant">Karjat Jn Terminus</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-secondary uppercase font-bold">AI DYNAMIC ETA</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-telemetry-lg text-telemetry-lg text-secondary font-bold">
                    {INITIAL_AI_FOG_IMPACT.aiDynamicEta}
                  </span>
                  <span className="text-xs font-bold text-error">+9.0m</span>
                </div>
                <span className="text-[10px] text-secondary-fixed-dim">Fog + Cascading Loop Delay</span>
              </div>
            </div>

            {/* Detailed Variance Factors Breakdown */}
            <div className="grid grid-cols-3 gap-2 font-label-code">
              <div className="p-2 rounded bg-surface-container flex flex-col items-center text-center">
                <span className="text-[10px] text-on-surface-variant uppercase">Fog Impact</span>
                <span className="text-sm font-bold text-error mt-0.5">+5.0 min</span>
                <span className="text-[9px] text-on-surface-variant">Speed capped 60 km/h</span>
              </div>
              <div className="p-2 rounded bg-surface-container flex flex-col items-center text-center">
                <span className="text-[10px] text-on-surface-variant uppercase">Congestion</span>
                <span className="text-sm font-bold text-secondary mt-0.5">+2.0 min</span>
                <span className="text-[9px] text-on-surface-variant">Loop 3 Hold</span>
              </div>
              <div className="p-2 rounded bg-surface-container flex flex-col items-center text-center">
                <span className="text-[10px] text-on-surface-variant uppercase">Ghat Descent</span>
                <span className="text-sm font-bold text-primary mt-0.5">+2.0 min</span>
                <span className="text-[9px] text-on-surface-variant">Adhesion Brake Margins</span>
              </div>
            </div>

            {/* Step-by-Step Causal Propagation Flow */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                CAUSAL CHAIN DEVIATION:
              </span>
              <div className="flex flex-col gap-1.5">
                {INITIAL_AI_FOG_IMPACT.causalChain.map((step) => (
                  <div
                    key={step.step}
                    className="p-2 rounded-lg bg-surface-container flex items-center justify-between text-xs font-label-code gap-2 border border-surface-container-highest/40"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-surface-container-highest text-primary font-bold flex items-center justify-center text-[10px]">
                        {step.step}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface text-[11px]">{step.title}</span>
                        <span className="font-body-sm text-[10px] text-on-surface-variant leading-tight">
                          {step.description}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-error whitespace-nowrap text-[11px]">
                      {step.delayContribution}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Link to AI Cascading Delay Screen */}
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('crossing-and-ai-delay')}
                className="w-full h-11 min-h-touch-target-min rounded-xl bg-surface-container-high hover:bg-surface-bright text-primary font-label-code text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all mt-1 active:scale-98"
              >
                <span>OPEN FULL DISPATCH GRAPH &amp; CONFLICT MATRIX</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: CONFIGURABLE RAILWAY APPROVED OPERATING RULES */}
      {isThresholdModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-low border border-surface-container-highest rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-hud-pad-md flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-container-highest/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">gavel</span>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    Railway Approved Visibility Warning Rules
                  </h3>
                  <span className="font-label-code text-xs text-on-surface-variant">
                    Configurable operating limits per Indian Railways GR / Zonal Circulars
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsThresholdModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                These thresholds are configurable to the railway's approved operating rules rather than treated as universal limits.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-label-code text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-surface-container-highest text-on-surface-variant uppercase text-[10px]">
                      <th className="py-2 px-2">Visibility</th>
                      <th className="py-2 px-2">RailSense Warning</th>
                      <th className="py-2 px-2">Speed MPS</th>
                      <th className="py-2 px-2">Detonator</th>
                      <th className="py-2 px-2">Whistle Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-highest/40">
                    {thresholdRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-surface-container/60">
                        <td className="py-2.5 px-2 font-bold text-on-surface">
                          {rule.minDistanceM === 0
                            ? '< 200 m'
                            : rule.maxDistanceM > 10000
                            ? '> 2 km'
                            : `${rule.minDistanceM >= 1000 ? `${rule.minDistanceM / 1000}` : `${rule.minDistanceM}m`}–${
                                rule.maxDistanceM >= 1000 ? `${rule.maxDistanceM / 1000}km` : `${rule.maxDistanceM}m`
                              }`}
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${rule.badgeColor}`}>
                            {rule.level === 'NORMAL' && '🟢 '}
                            {rule.level === 'REDUCED' && '🟡 '}
                            {rule.level === 'LOW' && '🟠 '}
                            {rule.level === 'VERY_LOW' && '🔴 '}
                            {rule.level === 'CRITICAL' && '🛑 '}
                            {rule.label}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 font-bold text-on-surface">{rule.speedCeilingKmh} km/h</td>
                        <td className="py-2.5 px-2">
                          {rule.detonatorRequired ? (
                            <span className="text-error font-bold">YES (FSP Active)</span>
                          ) : (
                            <span className="text-on-surface-variant">No</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-on-surface-variant text-[11px]">{rule.whistleProtocol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container-highest/60">
              <button
                onClick={() => {
                  triggerToast('Threshold rules reset to Indian Railways Standard GR 3.61.');
                  setIsThresholdModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg font-label-code text-xs font-bold text-on-surface-variant hover:text-on-surface bg-surface-container"
              >
                RESTORE DEFAULT GR 3.61
              </button>
              <button
                onClick={() => {
                  triggerToast('Zonal operating rules applied to RailSense active engine.');
                  setIsThresholdModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg font-label-code text-xs font-bold bg-primary text-on-primary hover:bg-primary-container"
              >
                APPLY APPROVED RULES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
