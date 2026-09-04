import React, { useState } from 'react';
import { HealthWarningLevel } from '../types';

interface TrainHealthAlertBannerProps {
  onViewComponent?: (componentId: string) => void;
  onContactControl?: () => void;
  onSimulateCascade?: () => void;
  compact?: boolean;
}

export const TrainHealthAlertBanner: React.FC<TrainHealthAlertBannerProps> = ({
  onViewComponent,
  onContactControl,
  onSimulateCascade,
  compact = false,
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [controlContacted, setControlContacted] = useState<boolean>(false);
  const [toastNote, setToastNote] = useState<string | null>(null);

  if (isDismissed) {
    return (
      <div className="w-full bg-surface-container p-2 rounded-xl border border-error/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
          <span className="font-label-code text-label-code text-error font-bold uppercase">
            1 ACTIVE CRITICAL HEALTH ANOMALY (COACH 7 BEARING: 96°C)
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="px-2 py-0.5 rounded bg-error/20 hover:bg-error/30 text-error font-label-code text-[11px] font-bold"
        >
          RE-OPEN ALERT
        </button>
      </div>
    );
  }

  const handleControlContact = () => {
    setControlContacted(true);
    setToastNote('Control Room (Central Railway C&W / Chief Controller) notified via VHF Secure Link.');
    setTimeout(() => setToastNote(null), 4000);
    if (onContactControl) onContactControl();
  };

  return (
    <div
      className="w-full bg-error-container/90 border-2 border-error rounded-xl p-hud-pad-md shadow-2xl flex flex-col gap-2.5 relative overflow-hidden text-on-error-container animate-fade-in"
      id="critical-train-health-alert-banner"
    >
      {/* Toast Alert */}
      {toastNote && (
        <div className="bg-surface-container-highest border border-tertiary text-on-surface p-2 rounded-lg font-label-code text-label-code flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-tertiary text-[18px]">radio</span>
            <span>{toastNote}</span>
          </div>
          <button onClick={() => setToastNote(null)} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}

      {/* Header bar matching exact user spec */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-error animate-pulse shadow-[0_0_12px_#ff5449]"></span>
          <span className="font-headline-md text-headline-md text-error font-black uppercase tracking-wider">
            🔴 CRITICAL TRAIN HEALTH ALERT
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-error text-on-error font-label-code text-[10px] font-black uppercase tracking-wider">
            PRE-FAILURE WARNING
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-on-error-container/70 hover:text-on-error-container transition-colors"
            title="Minimize alert banner"
          >
            <span className="material-symbols-outlined text-[18px]">expand_less</span>
          </button>
        </div>
      </div>

      {/* Primary Component Information */}
      <div className="bg-surface-container-lowest/80 backdrop-blur p-3 rounded-lg border border-error/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-[20px]">settings</span>
            <span className="font-headline-md text-headline-md text-on-surface font-black">
              WHEEL BEARING — COACH 7 (B-3)
            </span>
          </div>
          <span className="font-label-code text-[11px] text-on-surface-variant mt-0.5">
            LOCATION: Coach 7, Bogie 2, Axle 4 (Right-Hand Journal) • Sensor #HAB-704
          </span>
        </div>

        {/* Telemetry Metrics */}
        <div className="flex items-center gap-3">
          <div className="bg-surface-container px-2.5 py-1.5 rounded flex flex-col items-center">
            <span className="font-label-code text-[9px] text-on-surface-variant uppercase">Temperature</span>
            <span className="font-telemetry-md text-telemetry-md font-black text-error flex items-center">
              96°C <span className="text-[14px] ml-0.5">↑</span>
            </span>
            <span className="font-label-code text-[8px] text-error font-bold">+4°C / 10 min</span>
          </div>

          <div className="bg-surface-container px-2.5 py-1.5 rounded flex flex-col items-center">
            <span className="font-label-code text-[9px] text-on-surface-variant uppercase">Vibration</span>
            <span className="font-label-code text-label-code font-black text-error">
              ABNORMAL
            </span>
            <span className="font-label-code text-[8px] text-on-surface-variant">4.85 mm/s</span>
          </div>

          <div className="bg-surface-container px-2.5 py-1.5 rounded flex flex-col items-center">
            <span className="font-label-code text-[9px] text-on-surface-variant uppercase">Failure Risk</span>
            <span className="font-label-code text-label-code font-black text-error">
              HIGH
            </span>
            <span className="font-label-code text-[8px] text-tertiary font-bold">Conf: 89%</span>
          </div>
        </div>
      </div>

      {/* Action Banner Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-1.5 text-on-error-container font-bold text-label-code">
          <span className="material-symbols-outlined text-[18px] text-error">warning</span>
          <span className="tracking-wide uppercase">⚠️ INSPECTION REQUIRED</span>
          <span className="font-normal text-body-sm text-on-error-container/80 hidden md:inline">
            — Inspect at next suitable operational point (Karjat Loop 3 in 8.2 km)
          </span>
        </div>

        {/* User Requested Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onViewComponent) onViewComponent('comp-bearing-temp');
            }}
            className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-code text-label-code font-bold uppercase shadow-sm active:scale-95 transition-all flex items-center gap-1 border border-surface-variant/40"
            id="btn-view-component"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
            <span>VIEW COMPONENT</span>
          </button>

          <button
            onClick={handleControlContact}
            className={`px-3 py-1.5 rounded-lg font-label-code text-label-code font-bold uppercase shadow-sm active:scale-95 transition-all flex items-center gap-1 ${
              controlContacted
                ? 'bg-tertiary text-on-tertiary'
                : 'bg-error text-on-error hover:bg-error/90'
            }`}
            id="btn-contact-control"
          >
            <span className="material-symbols-outlined text-[16px]">
              {controlContacted ? 'done_all' : 'phone_in_talk'}
            </span>
            <span>{controlContacted ? 'CONTROL ALERTED' : 'CONTACT CONTROL'}</span>
          </button>

          {onSimulateCascade && (
            <button
              onClick={onSimulateCascade}
              className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-code text-label-code font-bold uppercase shadow-sm active:scale-95 transition-all hidden lg:flex items-center gap-1"
              title="Simulate Delay Impact on Network"
            >
              <span className="material-symbols-outlined text-[16px]">alt_route</span>
              <span>NETWORK IMPACT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
