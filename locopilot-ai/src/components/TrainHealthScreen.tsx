import React, { useState } from 'react';
import {
  PredictiveHealthComponent,
  HealthWarningLevel,
  DegradationStage,
  TabType,
} from '../types';
import { initialPredictiveComponents, operationalDecisions } from '../data/trainHealthData';
import { TrainHealthAlertBanner } from './TrainHealthAlertBanner';

interface TrainHealthScreenProps {
  onNavigateTab?: (tab: TabType) => void;
}

export const TrainHealthScreen: React.FC<TrainHealthScreenProps> = ({ onNavigateTab }) => {
  const [components, setComponents] = useState<PredictiveHealthComponent[]>(
    initialPredictiveComponents
  );
  const [selectedComponentId, setSelectedComponentId] = useState<string>('comp-bearing-temp');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeDecisionKey, setActiveDecisionKey] = useState<string>('halt_inspection');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSimulatingHotAxle, setIsSimulatingHotAxle] = useState<boolean>(true);

  const selectedComponent =
    components.find((c) => c.id === selectedComponentId) || components[0];

  const currentImpact = operationalDecisions[activeDecisionKey];

  const handleSimulateHotAxleToggle = () => {
    const nextState = !isSimulatingHotAxle;
    setIsSimulatingHotAxle(nextState);

    if (nextState) {
      setComponents((prev) =>
        prev.map((c) => {
          if (c.id === 'comp-bearing-temp') {
            return {
              ...c,
              currentReading: '96°C ↑',
              warningLevel: 'CRITICAL',
              stage: 'CRITICAL_INSPECTION_REQUIRED',
              healthPercent: 62,
              failureRisk: 'HIGH',
              trendText: '+4°C / 10 min (Rapid Thermal Spike)',
            };
          }
          if (c.id === 'comp-bearing-vib') {
            return {
              ...c,
              currentReading: '4.85 mm/s (ABNORMAL)',
              warningLevel: 'WARNING',
              stage: 'FAILURE_RISK_INCREASING',
              healthPercent: 68,
              failureRisk: 'HIGH',
            };
          }
          return c;
        })
      );
      setToastMessage('Hot-Axle Thermal Anomaly Activated: Coach 7 bearing at 96°C (Risk: HIGH).');
    } else {
      // Nominal reset
      setComponents((prev) =>
        prev.map((c) => {
          if (c.id === 'comp-bearing-temp') {
            return {
              ...c,
              currentReading: '64°C',
              warningLevel: 'NORMAL',
              stage: 'NORMAL',
              healthPercent: 97,
              failureRisk: 'LOW',
              trendText: 'Stable (+0.2°C / 10 min)',
            };
          }
          if (c.id === 'comp-bearing-vib') {
            return {
              ...c,
              currentReading: '1.20 mm/s',
              warningLevel: 'NORMAL',
              stage: 'NORMAL',
              healthPercent: 96,
              failureRisk: 'LOW',
            };
          }
          return c;
        })
      );
      setToastMessage('Nominal Telemetry Restored: All wheelsets within RDSO standard baseline.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredComponents = components.filter((c) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'anomalies') return c.warningLevel !== 'NORMAL';
    if (filterCategory === 'mechanical')
      return ['wheel', 'bearing', 'coupler', 'tilt', 'vibration'].includes(c.category);
    if (filterCategory === 'pneumatic') return ['brake'].includes(c.category);
    if (filterCategory === 'electrical')
      return ['electrical', 'signalling', 'motor', 'coach', 'oil'].includes(c.category);
    return true;
  });

  const getWarningBadge = (level: HealthWarningLevel) => {
    switch (level) {
      case 'NORMAL':
        return {
          label: '🟢 NORMAL',
          badgeClass: 'bg-tertiary/20 text-tertiary border-tertiary/40',
        };
      case 'CAUTION':
        return {
          label: '🟡 CAUTION',
          badgeClass: 'bg-secondary/20 text-secondary border-secondary/40',
        };
      case 'WARNING':
        return {
          label: '🟠 WARNING',
          badgeClass: 'bg-primary/20 text-primary border-primary/40',
        };
      case 'CRITICAL':
        return {
          label: '🔴 CRITICAL',
          badgeClass: 'bg-error/20 text-error border-error/50 font-black animate-pulse',
        };
      case 'EMERGENCY':
        return {
          label: '🛑 EMERGENCY',
          badgeClass: 'bg-error text-on-error border-error font-black animate-bounce',
        };
    }
  };

  const stages: { stage: DegradationStage; title: string; step: number }[] = [
    { stage: 'NORMAL', title: 'NORMAL', step: 1 },
    { stage: 'ABNORMAL_DETECTED', title: 'ABNORMAL DETECTED', step: 2 },
    { stage: 'DEGRADATION_DETECTED', title: 'DEGRADATION DETECTED', step: 3 },
    { stage: 'FAILURE_RISK_INCREASING', title: 'FAILURE RISK INCREASING', step: 4 },
    { stage: 'CRITICAL_INSPECTION_REQUIRED', title: 'CRITICAL — INSPECT', step: 5 },
  ];

  const getStageIndex = (stage: DegradationStage) => {
    const idx = stages.findIndex((s) => s.stage === stage);
    return idx !== -1 ? idx : 0;
  };

  const currentStageIdx = getStageIndex(selectedComponent.stage);

  return (
    <div className="flex flex-col w-full gap-hud-pad-md px-hud-pad-md pb-8">
      {/* Toast Feedback */}
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

      {/* 1. CRITICAL ALERT BANNER (If Active Anomaly) */}
      {isSimulatingHotAxle && (
        <TrainHealthAlertBanner
          onViewComponent={(id) => {
            setSelectedComponentId(id);
            const el = document.getElementById('ai-prediction-deep-dive');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onSimulateCascade={() => {
            const el = document.getElementById('network-delay-cascade-bridge');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* 2. TOP HERO HEADER & WARNING LEVEL TIERS */}
      <div className="w-full bg-surface-container-high rounded-xl p-hud-pad-md shadow-lg flex flex-col gap-hud-pad-sm border border-surface-variant/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-headline-md text-on-surface font-black">
                  PREDICTIVE TRAIN HEALTH &amp; FAILURE WARNING
                </span>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-label-code text-[11px] font-bold">
                  16 SENSORS ACTIVE
                </span>
              </div>
              <span className="font-label-code text-label-code text-on-surface-variant">
                RAILSENSE ADVANCED ANOMALY ENGINE • TRAIN 12626 DN • WAP-7 + 24 LHB COACHES
              </span>
            </div>
          </div>

          {/* Test Scenario Simulator Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateHotAxleToggle}
              className={`px-3 py-1.5 rounded-lg font-label-code text-label-code font-bold uppercase transition-all shadow-sm active:scale-95 flex items-center gap-1.5 ${
                isSimulatingHotAxle
                  ? 'bg-error text-on-error'
                  : 'bg-surface-container-highest hover:bg-surface-bright text-primary border border-primary/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isSimulatingHotAxle ? 'thermostat' : 'restore'}
              </span>
              <span>
                {isSimulatingHotAxle ? 'HOT-AXLE SPIKE ARMED (96°C)' : 'SIMULATE BEARING SPIKE'}
              </span>
            </button>
          </div>
        </div>

        {/* Standardized 5 LocoPilot Warning Levels Legend */}
        <div className="bg-surface-container-lowest p-2.5 rounded-lg flex flex-col gap-1.5">
          <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
            LOCOPILOT STANDARDIZED WARNING LEVELS (RDSO CLASSIFICATION)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 font-label-code text-[11px]">
            <div className="bg-surface-container p-1.5 rounded border border-tertiary/20 flex flex-col">
              <span className="text-tertiary font-bold">🟢 NORMAL</span>
              <span className="text-[9px] text-on-surface-variant">Operating nominally</span>
            </div>
            <div className="bg-surface-container p-1.5 rounded border border-secondary/20 flex flex-col">
              <span className="text-secondary font-bold">🟡 CAUTION</span>
              <span className="text-[9px] text-on-surface-variant">Abnormal trend detected</span>
            </div>
            <div className="bg-surface-container p-1.5 rounded border border-primary/20 flex flex-col">
              <span className="text-primary font-bold">🟠 WARNING</span>
              <span className="text-[9px] text-on-surface-variant">Degradation detected</span>
            </div>
            <div className="bg-surface-container p-1.5 rounded border border-error/30 flex flex-col">
              <span className="text-error font-bold">🔴 CRITICAL</span>
              <span className="text-[9px] text-on-surface-variant">High risk / inspection</span>
            </div>
            <div className="bg-surface-container p-1.5 rounded border border-error/50 flex flex-col">
              <span className="text-error font-black">🛑 EMERGENCY</span>
              <span className="text-[9px] text-on-surface-variant">Immediate emergency rule</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. WARNING BEFORE FAILURE: DEGRADATION PROGRESSION PIPELINE */}
      <div className="w-full bg-surface-container-low rounded-xl p-hud-pad-md shadow-md border border-surface-variant/30 flex flex-col gap-hud-pad-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">trending_up</span>
            <span className="font-headline-md text-headline-md text-on-surface">
              Failure Progression Timeline: {selectedComponent.name}
            </span>
          </div>
          <span className="font-label-code text-[10px] text-on-surface-variant">
            LOC: {selectedComponent.location}
          </span>
        </div>

        {/* Visual 5-Stage Stepper Progression */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {stages.map((st, idx) => {
            const isPassed = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            const isCritical = st.stage === 'CRITICAL_INSPECTION_REQUIRED';

            return (
              <div
                key={st.stage}
                className={`p-2 rounded-lg flex flex-col items-center text-center transition-all border ${
                  isCurrent
                    ? isCritical
                      ? 'bg-error text-on-error border-error shadow-lg scale-105'
                      : 'bg-primary text-on-primary border-primary shadow-md scale-105'
                    : isPassed
                    ? 'bg-surface-container-highest text-on-surface border-surface-variant/40'
                    : 'bg-surface-container text-on-surface-variant/60 border-surface-variant/20'
                }`}
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full font-label-code text-[10px] font-bold mb-1 bg-black/20">
                  {idx + 1}
                </div>
                <span className="font-label-code text-[9px] sm:text-[10px] font-bold leading-tight">
                  {st.title}
                </span>
                {isCurrent && (
                  <span className="font-label-code text-[8px] uppercase tracking-wider mt-1 px-1 py-0.5 rounded bg-black/30">
                    CURRENT STATE
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progression Callout Box */}
        <div className="bg-surface-container p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-surface-variant/40">
          <div className="flex items-start gap-2.5">
            <span
              className={`material-symbols-outlined text-[24px] ${
                selectedComponent.warningLevel === 'CRITICAL' ? 'text-error' : 'text-secondary'
              }`}
            >
              error_outline
            </span>
            <div className="flex flex-col">
              <span className="font-body-md text-body-md font-bold text-on-surface">
                {selectedComponent.actionRequired}
              </span>
              <span className="font-label-code text-[11px] text-on-surface-variant mt-0.5">
                Current Reading: <strong className="text-on-surface">{selectedComponent.currentReading}</strong> |
                Normal Threshold: <strong className="text-on-surface">{selectedComponent.normalThreshold}</strong> |
                Rate of Increase: <strong className="text-error">{selectedComponent.trendText}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end shrink-0">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
              RISK LEVEL
            </span>
            <span
              className={`font-label-code text-label-code font-black uppercase px-2 py-0.5 rounded ${
                selectedComponent.failureRisk === 'HIGH'
                  ? 'bg-error/20 text-error'
                  : selectedComponent.failureRisk === 'MODERATE'
                  ? 'bg-secondary/20 text-secondary'
                  : 'bg-tertiary/20 text-tertiary'
              }`}
            >
              {selectedComponent.failureRisk} RISK
            </span>
          </div>
        </div>
      </div>

      {/* 4. AI FAILURE PREDICTION ENGINE: MULTI-INPUT ANALYSIS DOSSIER */}
      <div
        id="ai-prediction-deep-dive"
        className="w-full bg-surface-container-low rounded-xl p-hud-pad-md shadow-md border border-surface-variant/30 flex flex-col gap-hud-pad-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">psychology</span>
            <div>
              <span className="font-headline-md text-headline-md text-on-surface font-black block leading-tight">
                AI Failure Prediction &amp; Trend Inference
              </span>
              <span className="font-label-code text-[10px] text-on-surface-variant">
                MULTIVARIATE PREDICTIVE MODEL (10 CONTINUOUS INPUT PARAMETERS)
              </span>
            </div>
          </div>

          {/* AI Output Badge Card */}
          <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-primary/30">
            <span className="font-label-code text-[10px] text-on-surface-variant">CONFIDENCE:</span>
            <span className="font-telemetry-md text-telemetry-md font-bold text-tertiary">
              {selectedComponent.confidence}%
            </span>
          </div>
        </div>

        {/* Structured AI Output Grid Matching User Specification */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-label-code">
          <div className="bg-surface-container p-2 rounded-lg">
            <span className="text-[10px] text-on-surface-variant block uppercase">Component</span>
            <span className="text-on-surface text-label-code font-bold truncate block">
              {selectedComponent.name}
            </span>
          </div>
          <div className="bg-surface-container p-2 rounded-lg">
            <span className="text-[10px] text-on-surface-variant block uppercase">Health Index</span>
            <span
              className={`text-label-code font-black block ${
                selectedComponent.healthPercent < 70
                  ? 'text-error'
                  : selectedComponent.healthPercent < 85
                  ? 'text-secondary'
                  : 'text-tertiary'
              }`}
            >
              {selectedComponent.healthPercent}%
            </span>
          </div>
          <div className="bg-surface-container p-2 rounded-lg">
            <span className="text-[10px] text-on-surface-variant block uppercase">Failure Risk</span>
            <span
              className={`text-label-code font-black block ${
                selectedComponent.failureRisk === 'HIGH'
                  ? 'text-error'
                  : selectedComponent.failureRisk === 'MODERATE'
                  ? 'text-secondary'
                  : 'text-tertiary'
              }`}
            >
              {selectedComponent.failureRisk}
            </span>
          </div>
          <div className="bg-surface-container p-2 rounded-lg">
            <span className="text-[10px] text-on-surface-variant block uppercase">Trend Vector</span>
            <span className="text-error text-label-code font-bold block">
              Deteriorating ↑
            </span>
          </div>
          <div className="bg-surface-container p-2 rounded-lg sm:col-span-2">
            <span className="text-[10px] text-on-surface-variant block uppercase">
              Estimated Risk Window
            </span>
            <span className="text-primary text-label-code font-bold block">
              {selectedComponent.estimatedRiskWindow}
            </span>
          </div>
        </div>

        {/* Multi-Factor Inputs Matrix */}
        <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-2">
          <span className="font-label-code text-[11px] text-primary font-bold uppercase tracking-wider">
            AI MULTI-VARIABLE INPUT TELEMETRY EVALUATION
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-label-code font-label-code text-[11px]">
            <div className="bg-surface-container p-2 rounded flex flex-col">
              <span className="text-on-surface-variant text-[10px]">VIBRATION PATTERN &amp; FFT HARMONICS</span>
              <span className="text-on-surface font-semibold">{selectedComponent.aiFactors.vibrationPattern}</span>
            </div>
            <div className="bg-surface-container p-2 rounded flex flex-col">
              <span className="text-on-surface-variant text-[10px]">RATE OF THERMAL / PRESSURE SPIKE</span>
              <span className="text-error font-semibold">{selectedComponent.aiFactors.rateOfChange}</span>
            </div>
            <div className="bg-surface-container p-2 rounded flex flex-col">
              <span className="text-on-surface-variant text-[10px]">PREVIOUS MAINTENANCE DOSSIER</span>
              <span className="text-on-surface font-semibold">{selectedComponent.aiFactors.previousMaintenance}</span>
            </div>
            <div className="bg-surface-container p-2 rounded flex flex-col">
              <span className="text-on-surface-variant text-[10px]">COMPONENT RUN ODOMETER</span>
              <span className="text-on-surface font-semibold">{selectedComponent.aiFactors.componentAgeKm}</span>
            </div>
            <div className="bg-surface-container p-2 rounded flex flex-col">
              <span className="text-on-surface-variant text-[10px]">HISTORICAL BATCH DEFECT LOG</span>
              <span className="text-on-surface font-semibold">{selectedComponent.aiFactors.previousFailures}</span>
            </div>
            <div className="bg-surface-container p-2 rounded flex flex-col">
              <span className="text-on-surface-variant text-[10px]">SPEED &amp; DYNAMIC LOAD STRESS</span>
              <span className="text-on-surface font-semibold">{selectedComponent.aiFactors.trainSpeedLoad}</span>
            </div>
            <div className="bg-surface-container p-2 rounded flex flex-col">
              <span className="text-on-surface-variant text-[10px]">ROUTE TOPOGRAPHY (GHAT / CURVES)</span>
              <span className="text-secondary font-semibold">{selectedComponent.aiFactors.routeConditionImpact}</span>
            </div>
            <div className="bg-surface-container p-2 rounded flex flex-col">
              <span className="text-on-surface-variant text-[10px]">AMBIENT WEATHER &amp; TRACK HEAT</span>
              <span className="text-on-surface font-semibold">{selectedComponent.aiFactors.weatherImpact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ALL 16 PREDICTIVE COMPONENTS MONITORING GRID */}
      <div className="w-full bg-surface-container-low rounded-xl p-hud-pad-md shadow-md border border-surface-variant/30 flex flex-col gap-hud-pad-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">grid_view</span>
            <span className="font-headline-md text-headline-md text-on-surface">
              16 Predictive Component Health Matrix
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg flex-wrap">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2 py-0.5 rounded font-label-code text-[11px] uppercase transition-all ${
                filterCategory === 'all'
                  ? 'bg-surface-container-highest text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All (16)
            </button>
            <button
              onClick={() => setFilterCategory('anomalies')}
              className={`px-2 py-0.5 rounded font-label-code text-[11px] uppercase transition-all ${
                filterCategory === 'anomalies'
                  ? 'bg-error/20 text-error font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Anomalies
            </button>
            <button
              onClick={() => setFilterCategory('mechanical')}
              className={`px-2 py-0.5 rounded font-label-code text-[11px] uppercase transition-all ${
                filterCategory === 'mechanical'
                  ? 'bg-surface-container-highest text-secondary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Bogie &amp; Wheel
            </button>
            <button
              onClick={() => setFilterCategory('pneumatic')}
              className={`px-2 py-0.5 rounded font-label-code text-[11px] uppercase transition-all ${
                filterCategory === 'pneumatic'
                  ? 'bg-surface-container-highest text-tertiary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Brakes
            </button>
            <button
              onClick={() => setFilterCategory('electrical')}
              className={`px-2 py-0.5 rounded font-label-code text-[11px] uppercase transition-all ${
                filterCategory === 'electrical'
                  ? 'bg-surface-container-highest text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Traction &amp; Elec
            </button>
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {filteredComponents.map((comp) => {
            const isSelected = selectedComponentId === comp.id;
            const badge = getWarningBadge(comp.warningLevel);

            return (
              <div
                key={comp.id}
                onClick={() => setSelectedComponentId(comp.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all border flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-surface-container-high border-primary ring-1 ring-primary shadow-md'
                    : 'bg-surface-container border-surface-variant/40 hover:bg-surface-container-high'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        {comp.icon}
                      </span>
                      <span className="font-body-md text-body-md font-bold text-on-surface leading-tight line-clamp-1">
                        {comp.name}
                      </span>
                    </div>
                  </div>
                  <span className="font-label-code text-[9px] text-on-surface-variant truncate">
                    {comp.location}
                  </span>

                  {/* Telemetry Reading & Warning Level Badge */}
                  <div className="bg-surface-container-lowest p-2 rounded mt-1">
                    <span className="font-label-code text-[9px] text-on-surface-variant block uppercase">
                      Sensor Reading
                    </span>
                    <span
                      className={`font-label-code text-label-code font-black block truncate ${
                        comp.warningLevel === 'CRITICAL'
                          ? 'text-error'
                          : comp.warningLevel === 'WARNING'
                          ? 'text-primary'
                          : comp.warningLevel === 'CAUTION'
                          ? 'text-secondary'
                          : 'text-on-surface'
                      }`}
                    >
                      {comp.currentReading}
                    </span>
                    <span className="font-label-code text-[9px] text-on-surface-variant block truncate mt-0.5">
                      Spec: {comp.normalThreshold}
                    </span>
                  </div>
                </div>

                {/* Health Bar & Status Footer */}
                <div className="flex flex-col gap-1 pt-1 border-t border-surface-variant/30">
                  <div className="flex items-center justify-between text-[10px] font-label-code">
                    <span className={`px-1.5 py-0.5 rounded font-bold border ${badge.badgeClass}`}>
                      {badge.label}
                    </span>
                    <span className="font-bold text-on-surface">{comp.healthPercent}%</span>
                  </div>

                  <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        comp.healthPercent > 90
                          ? 'bg-tertiary'
                          : comp.healthPercent > 80
                          ? 'bg-secondary'
                          : comp.healthPercent > 65
                          ? 'bg-primary'
                          : 'bg-error'
                      }`}
                      style={{ width: `${comp.healthPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. CONNECT WITH RAILSENSE: OPERATIONAL DECISION & CASCADING DELAY BRIDGE */}
      <div
        id="network-delay-cascade-bridge"
        className="w-full bg-surface-container-low rounded-xl p-hud-pad-md shadow-lg border border-primary/40 flex flex-col gap-hud-pad-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[22px]">alt_route</span>
            <div>
              <span className="font-headline-md text-headline-md text-on-surface font-black block leading-tight">
                RailSense Closed-Loop Bridge: Health Anomaly ➔ Operational Delay Prediction
              </span>
              <span className="font-label-code text-[11px] text-primary">
                “PREDICT THE TRAIN'S HEALTH BEFORE IT BECOMES A SAFETY INCIDENT, AND PREDICT THE OPERATIONAL IMPACT BEFORE IT BECOMES A NETWORK DELAY”
              </span>
            </div>
          </div>
        </div>

        {/* Operational Decision Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {Object.values(operationalDecisions).map((op) => {
            const isSelected = activeDecisionKey === op.decision;
            return (
              <button
                key={op.decision}
                onClick={() => setActiveDecisionKey(op.decision)}
                className={`p-2.5 rounded-lg text-left transition-all border flex flex-col justify-between gap-1 active:scale-95 ${
                  isSelected
                    ? 'bg-surface-container-high border-primary ring-1 ring-primary shadow-md'
                    : 'bg-surface-container border-surface-variant/40 hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-code text-[11px] font-black uppercase text-on-surface">
                    {op.decision === 'halt_inspection'
                      ? '1. INSPECTION HALT'
                      : op.decision === 'speed_restriction_30'
                      ? '2. SPEED RESTRICTION'
                      : '3. PROCEED CAUTION'}
                  </span>
                  <span
                    className={`font-label-code text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      op.locoDelayMinutes > 10
                        ? 'bg-error/20 text-error'
                        : op.locoDelayMinutes > 4
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-tertiary/20 text-tertiary'
                    }`}
                  >
                    +{op.locoDelayMinutes}m TRAIN DELAY
                  </span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant line-clamp-2">
                  {op.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Cascading Delay Impact Analysis on Selected Decision */}
        <div className="bg-surface-container p-3 rounded-lg flex flex-col gap-3 border border-surface-variant/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-label-code text-label-code text-primary font-bold uppercase">
              {currentImpact.decisionTitle}
            </span>
            <span className="font-label-code text-[11px] text-tertiary font-bold bg-tertiary/10 px-2 py-0.5 rounded">
              {currentImpact.accidentRiskMitigated}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Impact on Other Trains (Cascading Ripple) */}
            <div className="bg-surface-container-lowest p-2.5 rounded-lg flex flex-col gap-2">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">train</span>
                Cascading Impact on Other Network Trains
              </span>

              <div className="flex flex-col gap-1.5">
                {currentImpact.affectedTrains.map((tr) => (
                  <div
                    key={tr.trainNo}
                    className="p-1.5 rounded bg-surface-container flex items-center justify-between text-label-code font-label-code"
                  >
                    <div className="flex flex-col">
                      <span className="text-on-surface font-bold text-[11px]">
                        {tr.trainNo} {tr.name}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">{tr.delayType}</span>
                    </div>
                    <span
                      className={`font-telemetry-md text-telemetry-md font-bold ${
                        tr.impactMinutes > 10
                          ? 'text-error'
                          : tr.impactMinutes > 0
                          ? 'text-secondary'
                          : 'text-tertiary'
                      }`}
                    >
                      {tr.impactMinutes > 0 ? `+${tr.impactMinutes}m` : 'ON TIME'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revised Station ETAs */}
            <div className="bg-surface-container-lowest p-2.5 rounded-lg flex flex-col gap-2">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                Dynamic Station Delay Forecast (Train 12626 DN)
              </span>

              <div className="grid grid-cols-2 gap-1.5">
                {currentImpact.stationEtaImpacts.map((st) => (
                  <div key={st.stationCode} className="p-1.5 rounded bg-surface-container font-label-code">
                    <span className="text-[10px] text-on-surface-variant block">
                      {st.stationName} ({st.stationCode})
                    </span>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-on-surface text-label-code font-bold">{st.revisedEta}</span>
                      <span
                        className={`text-[10px] font-bold ${
                          st.revisedDelayMins > 15
                            ? 'text-error'
                            : st.revisedDelayMins > 5
                            ? 'text-secondary'
                            : 'text-tertiary'
                        }`}
                      >
                        +{st.revisedDelayMins}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick link to Station Delay Predictor or What-If tab */}
          {onNavigateTab && (
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-surface-variant/30">
              <button
                onClick={() => onNavigateTab('crossing-and-ai-delay')}
                className="px-3 py-1 rounded bg-surface-container-highest hover:bg-surface-bright text-primary font-label-code text-[11px] font-bold flex items-center gap-1 active:scale-95"
              >
                <span>OPEN AI DELAY &amp; CROSSING ENGINE</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>

        {/* Critical Decision Support Disclaimer as requested */}
        <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-surface-variant/30 flex items-start gap-2 text-on-surface-variant text-[11px] leading-relaxed">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
            gavel
          </span>
          <div>
            <strong className="text-on-surface">Certified Operational Safety Notice:</strong> RailSense
            AI failure predictions and train health warnings serve as intelligent decision support and
            must be integrated with certified onboard railway safety protocols (RDSO / IRCA Rulebook)
            and loco pilot operating manuals. The system does not independently authorize automatic
            braking or movement decisions without pilot and chief controller concurrence.
          </div>
        </div>
      </div>
    </div>
  );
};
