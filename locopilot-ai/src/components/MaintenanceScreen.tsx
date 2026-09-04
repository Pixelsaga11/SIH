import React, { useState } from 'react';
import { MaintenanceSubsystem, DiagnosticCheckItem, TabType } from '../types';
import { TrainHealthScreen } from './TrainHealthScreen';

interface MaintenanceScreenProps {
  onNavigateTab?: (tab: TabType) => void;
  initialMode?: 'predictive' | 'calibration';
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  onNavigateTab,
  initialMode = 'predictive',
}) => {
  const [activeMode, setActiveMode] = useState<'predictive' | 'calibration'>(initialMode);
  const [isDefaultMode, setIsDefaultMode] = useState<boolean>(true);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState<number>(100);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('sub-traction');

  // Initial nominal subsystems
  const initialSubsystems: MaintenanceSubsystem[] = [
    {
      id: 'sub-traction',
      name: 'Traction Motors (TM 1–6)',
      category: 'traction',
      status: 'nominal',
      currentValue: '910 A / 78°C',
      defaultValue: '900 A / 75°C',
      unit: 'Amps / °C',
      healthPercent: 98,
      isDefaultCalibrated: true,
      lastInspected: '2026-09-02 (Kalyan Shed)',
      description: '6x 3-Phase Asynchronous Induction Motors (Co-Co Bogie). Bearing vibration 0.78 mm/s within ISO 10816 spec.',
    },
    {
      id: 'sub-pneumatics',
      name: 'Pneumatics & Brake Rigging',
      category: 'pneumatics',
      status: 'nominal',
      currentValue: 'BP: 5.00 | FP: 6.00 bar',
      defaultValue: 'BP: 5.00 | FP: 6.00 bar',
      unit: 'bar',
      healthPercent: 99,
      isDefaultCalibrated: true,
      lastInspected: '2026-09-03 (Bhopal Prep)',
      description: 'Twin Pipe graduated release. MR Pressure 9.80 bar. Auto-drain valves cycling nominal.',
    },
    {
      id: 'sub-transformer',
      name: 'Main Transformer & Converter',
      category: 'electrical',
      status: 'nominal',
      currentValue: '58°C / 24.6 kV',
      defaultValue: '55°C / 25.0 kV',
      unit: 'kV / °C',
      healthPercent: 97,
      isDefaultCalibrated: true,
      lastInspected: '2026-09-01 (Kalyan Shed)',
      description: '6,530 kVA traction transformer. Coolant pump flow rate 145 L/min. Oil dielectric strength 68 kV/cm.',
    },
    {
      id: 'sub-pantograph',
      name: 'Pantograph & Roof Gear',
      category: 'electrical',
      status: 'nominal',
      currentValue: 'Carbon 28mm (88%)',
      defaultValue: 'Carbon 30mm (100%)',
      unit: 'mm / %',
      healthPercent: 94,
      isDefaultCalibrated: true,
      lastInspected: '2026-09-02 (Trip Insp)',
      description: 'Schunk high-speed pantograph. Static uplift force 95 N. ADD (Auto Dropping Device) circuit armed.',
    },
    {
      id: 'sub-bogie',
      name: 'Bogie, Wheelset & Flange',
      category: 'bogie',
      status: 'nominal',
      currentValue: 'Axle Box: 44°C',
      defaultValue: 'Axle Box: 42°C',
      unit: '°C (Max 75°C)',
      healthPercent: 96,
      isDefaultCalibrated: true,
      lastInspected: '2026-09-02',
      description: 'WAP-7 fabricated bogie frame. Ultrasonic axle testing clearance valid. Flange lubricator reservoir at 84%.',
    },
    {
      id: 'sub-kawach',
      name: 'Kawach ATP & VCD Safety Unit',
      category: 'safety',
      status: 'nominal',
      currentValue: 'RSSI: -64 dBm / VCD OK',
      defaultValue: 'RSSI > -75 dBm',
      unit: 'dBm / status',
      healthPercent: 100,
      isDefaultCalibrated: true,
      lastInspected: '2026-09-03 (Cab Initial)',
      description: 'Automated Train Protection BIU sealed. RFID underframe reader dual redundancy active.',
    },
  ];

  const [subsystems, setSubsystems] = useState<MaintenanceSubsystem[]>(initialSubsystems);

  // Diagnostic checklist items
  const diagnosticChecks: DiagnosticCheckItem[] = [
    {
      id: 'chk-1',
      title: 'Brake Pipe Leakage Test',
      system: 'Pneumatics',
      passed: true,
      defaultSpec: '< 0.2 bar / min',
      liveReading: '0.04 bar / min (Nominal)',
    },
    {
      id: 'chk-2',
      title: 'Traction Inverter Gate Pulses',
      system: 'Power Electronics',
      passed: true,
      defaultSpec: 'IGBT PWM 100% Balanced',
      liveReading: 'Phase A/B/C Symmetrical',
    },
    {
      id: 'chk-3',
      title: 'Catenary Voltage Interlock',
      system: 'High Voltage',
      passed: true,
      defaultSpec: '19.0 kV – 27.5 kV',
      liveReading: '24.6 kV (50.0 Hz Locked)',
    },
    {
      id: 'chk-4',
      title: 'Axle Box Temperature Differential',
      system: 'Mechanical Bogie',
      passed: true,
      defaultSpec: 'ΔT < 15°C between axles',
      liveReading: 'Max spread: 3.2°C across 6 axles',
    },
    {
      id: 'chk-5',
      title: 'VCD Vigilance Cycle & Audio Beeper',
      system: 'Loco Safety',
      passed: true,
      defaultSpec: '60s countdown cycle',
      liveReading: 'Pilot acknowledge pedal armed',
    },
    {
      id: 'chk-6',
      title: 'Kawach Track Transponder Sync',
      system: 'ATP Radio',
      passed: true,
      defaultSpec: 'Dual UHF 450 MHz',
      liveReading: 'Station Cabin direct link OK',
    },
  ];

  const handleResetToDefault = () => {
    setIsDefaultMode(true);
    setSubsystems(initialSubsystems);
    setToastMessage('DEFAULT IN: All parameters restored to Indian Railways RDSO Factory Nominal Specs.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSimulateCaution = () => {
    setIsDefaultMode(false);
    setSubsystems((prev) =>
      prev.map((sub) => {
        if (sub.id === 'sub-traction') {
          return {
            ...sub,
            status: 'caution',
            currentValue: '1,040 A / 98°C',
            healthPercent: 86,
            isDefaultCalibrated: false,
            description: 'TM-4 stator temperature approaching cautionary threshold (98°C). Blower speed boosted to 100%.',
          };
        }
        return sub;
      })
    );
    setToastMessage('Simulated Load Stress: TM-4 stator temperature elevated (+20°C above default).');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const runFullDiagnostic = () => {
    setIsDiagnosing(true);
    setDiagnosticProgress(0);
    setToastMessage('Executing Pre-Departure Self-Diagnostic Routine...');

    const interval = setInterval(() => {
      setDiagnosticProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDiagnosing(false);
          setToastMessage('Self-Diagnostic Complete: All 6 RDSO subsystems verified in DEFAULT NOMINAL status.');
          setTimeout(() => setToastMessage(null), 4000);
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  const activeSub = subsystems.find((s) => s.id === selectedSubsystem) || subsystems[0];

  return (
    <div className="flex flex-col w-full gap-hud-pad-md px-hud-pad-md pb-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-22 inset-x-4 z-50 p-hud-pad-sm bg-surface-container-highest border border-primary/40 rounded-xl flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-[18px] text-tertiary">build_circle</span>
            <span className="font-label-code text-label-code text-on-surface">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* TOP DUAL-MODE SELECTOR */}
      <div className="w-full bg-surface-container-high rounded-xl p-1.5 flex flex-col sm:flex-row items-center gap-1.5 border border-surface-variant/30 shadow-md">
        <button
          onClick={() => setActiveMode('predictive')}
          id="btn-switch-predictive-health"
          className={`w-full sm:flex-1 py-2 px-3 rounded-lg font-label-code text-label-code font-bold uppercase transition-all flex items-center justify-center gap-2 active:scale-95 ${
            activeMode === 'predictive'
              ? 'bg-primary text-on-primary shadow-md'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">troubleshoot</span>
          <span className="truncate">PREDICTIVE TRAIN HEALTH &amp; ANOMALY WARNINGS</span>
          <span className="px-1.5 py-0.5 rounded bg-error text-on-error text-[9px] font-black animate-pulse">
            1 CRITICAL
          </span>
        </button>

        <button
          onClick={() => setActiveMode('calibration')}
          id="btn-switch-rdso-calibration"
          className={`w-full sm:flex-1 py-2 px-3 rounded-lg font-label-code text-label-code font-bold uppercase transition-all flex items-center justify-center gap-2 active:scale-95 ${
            activeMode === 'calibration'
              ? 'bg-tertiary text-on-tertiary shadow-md'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">fact_check</span>
          <span className="truncate">RDSO CALIBRATION &amp; DEFAULT-IN</span>
        </button>
      </div>

      {activeMode === 'predictive' ? (
        <TrainHealthScreen onNavigateTab={onNavigateTab} />
      ) : (
        <>
          {/* TOP LOCOMOTIVE HEALTH & DEFAULT STATUS BANNER */}
          <div className="rounded-xl bg-surface-container-high p-hud-pad-md shadow-lg flex flex-col gap-hud-pad-sm relative overflow-hidden">
        {/* Background watermark */}
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-primary">
          <span className="material-symbols-outlined text-[140px]">home_repair_service</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">engineering</span>
            <div>
              <span className="font-headline-md text-headline-md text-on-surface block">
                LOCO HEALTH &amp; MAINTENANCE
              </span>
              <span className="font-label-code text-label-code text-primary">
                WAP-7 #30211 • 6,350 HP 3-PHASE • BHOPAL DIV
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded font-label-code text-label-code font-bold uppercase tracking-wider flex items-center gap-1 ${
                isDefaultMode
                  ? 'bg-tertiary/20 text-tertiary border border-tertiary/40'
                  : 'bg-secondary/20 text-secondary border border-secondary/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              {isDefaultMode ? 'DEFAULT IN: NOMINAL' : 'CUSTOM OVERRIDE'}
            </span>
          </div>
        </div>

        {/* Global Health Metric & Action Strip */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-surface-container p-2.5 rounded-lg flex flex-col justify-center">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              Overall Fleet Index
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-telemetry-lg text-telemetry-lg text-tertiary font-bold">98.4%</span>
              <span className="font-label-code text-[11px] text-tertiary">A1 GRADE</span>
            </div>
          </div>

          <div className="bg-surface-container p-2.5 rounded-lg flex flex-col justify-center">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              Trip Inspection (TI)
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold">1,420</span>
              <span className="font-label-code text-[11px] text-on-surface-variant">KM LEFT</span>
            </div>
          </div>

          <div className="bg-surface-container p-2.5 rounded-lg flex flex-col justify-center">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              RDSO Overhaul (IOH)
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-telemetry-lg text-telemetry-lg text-on-surface font-bold">42,000</span>
              <span className="font-label-code text-[11px] text-on-surface-variant">KM</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Default In vs Diagnostic Test */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleResetToDefault}
            className={`min-h-touch-target-min rounded-lg font-label-code text-label-code font-bold uppercase flex items-center justify-center gap-2 active:scale-95 transition-all ${
              isDefaultMode
                ? 'bg-surface-container-highest text-tertiary border border-tertiary/40'
                : 'bg-primary text-on-primary hover:bg-primary-container shadow-md'
            }`}
            id="btn-default-in"
          >
            <span className="material-symbols-outlined text-[18px]">restore</span>
            <span>DEFAULT IN (RDSO SPEC)</span>
          </button>

          <button
            onClick={runFullDiagnostic}
            disabled={isDiagnosing}
            className="min-h-touch-target-min rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-code text-label-code font-bold uppercase flex items-center justify-center gap-2 active:scale-95 transition-all border border-surface-variant/40"
            id="btn-run-diag"
          >
            <span className={`material-symbols-outlined text-[18px] text-primary ${isDiagnosing ? 'animate-spin' : ''}`}>
              {isDiagnosing ? 'sync' : 'checklist'}
            </span>
            <span>{isDiagnosing ? `CHECKING (${diagnosticProgress}%)` : 'SELF-DIAGNOSTIC TEST'}</span>
          </button>
        </div>

        {/* Diagnostic Progress Bar when running */}
        {isDiagnosing && (
          <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden mt-1">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${diagnosticProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* SUBSYSTEM TELEMETRY MATRIX & DEFAULT COMPARISON */}
      <div className="flex flex-col gap-hud-pad-sm w-full bg-surface-container-low rounded-xl p-hud-pad-md shadow-md border border-surface-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">monitor_heart</span>
            <span className="font-headline-md text-headline-md text-on-surface">Subsystem Health Grid</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleSimulateCaution}
              className="font-label-code text-[10px] text-secondary hover:underline px-2 py-0.5 rounded bg-secondary/10"
              title="Simulate heat stress on TM-4"
            >
              Test TM Stress
            </button>
          </div>
        </div>

        {/* Subsystem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {subsystems.map((sub) => {
            const isSelected = selectedSubsystem === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubsystem(sub.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all border flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-surface-container-high border-primary/70 ring-1 ring-primary/40'
                    : 'bg-surface-container border-surface-variant/30 hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md font-semibold text-on-surface">
                      {sub.name}
                    </span>
                    <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                      CAT: {sub.category} • Inspected: {sub.lastInspected}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-label-code text-[10px] font-bold uppercase ${
                      sub.status === 'nominal'
                        ? 'bg-tertiary/20 text-tertiary'
                        : sub.status === 'caution'
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-error/20 text-error'
                    }`}
                  >
                    {sub.status === 'nominal' ? 'NOMINAL' : 'CAUTION'}
                  </span>
                </div>

                {/* Values: Live vs Default Spec */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-label-code">
                  <div className="bg-surface-container-lowest p-2 rounded">
                    <span className="text-[10px] text-on-surface-variant block uppercase">Live Sensor</span>
                    <span className="text-on-surface text-label-code font-bold block truncate">
                      {sub.currentValue}
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-2 rounded">
                    <span className="text-[10px] text-tertiary block uppercase">Default RDSO</span>
                    <span className="text-tertiary text-label-code font-bold block truncate">
                      {sub.defaultValue}
                    </span>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="flex-1 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        sub.healthPercent > 90 ? 'bg-tertiary' : sub.healthPercent > 80 ? 'bg-secondary' : 'bg-error'
                      }`}
                      style={{ width: `${sub.healthPercent}%` }}
                    ></div>
                  </div>
                  <span className="font-label-code text-[10px] text-on-surface-variant font-bold">
                    {sub.healthPercent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Spec for Selected Subsystem */}
        {activeSub && (
          <div className="mt-1 p-3 rounded-lg bg-surface-container border border-surface-variant/40 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-label-code text-label-code text-primary font-bold uppercase">
                SUBSYSTEM DIAGNOSTIC DOSSIER: {activeSub.name}
              </span>
              <span className="font-label-code text-[11px] text-tertiary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                CALIBRATED TO RDSO SPEC
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
              {activeSub.description}
            </p>
          </div>
        )}
      </div>

      {/* PRE-TRIP CHECKLIST & RDSO ACCEPTANCE VERIFICATION */}
      <div className="w-full bg-surface-container-low rounded-xl p-hud-pad-md shadow-md border border-surface-variant/30 flex flex-col gap-hud-pad-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-tertiary text-[20px]">fact_check</span>
            <span className="font-headline-md text-headline-md text-on-surface">
              RDSO Factory &amp; Shed Verification
            </span>
          </div>
          <span className="font-label-code text-label-code bg-tertiary/10 text-tertiary px-2 py-0.5 rounded font-bold">
            6 / 6 PASSED
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {diagnosticChecks.map((chk) => (
            <div
              key={chk.id}
              className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-semibold text-on-surface leading-snug">
                    {chk.title}
                  </span>
                  <span className="font-label-code text-[10px] text-on-surface-variant">
                    SYS: {chk.system} • DEFAULT SPEC: {chk.defaultSpec}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-code text-label-code text-on-surface block font-bold">
                  {chk.liveReading}
                </span>
                <span className="font-label-code text-[10px] text-tertiary uppercase">MATCHES DEFAULT</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )}
</div>
  );
};
