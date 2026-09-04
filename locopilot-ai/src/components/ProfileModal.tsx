import React from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-surface-container-high border border-primary/30 rounded-2xl p-hud-pad-md flex flex-col gap-hud-pad-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-hud-pad-sm">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-[20px] shadow-lg">
            LP
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-on-surface leading-tight">
              Loco Pilot Cab Dossier
            </span>
            <span className="font-label-code text-label-code text-primary">DUTY ID: LP-88412 • BHOPAL DIV</span>
          </div>
        </div>

        {/* Crew Info */}
        <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-2">
          <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider">
            Crew on Duty
          </span>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="font-label-code text-label-code text-on-surface-variant">LOCO PILOT (LP)</div>
              <div className="font-semibold text-on-surface">Rajesh Sharma</div>
              <div className="text-[11px] text-tertiary">Grade A1 • 14 Yrs Service</div>
            </div>
            <div>
              <div className="font-label-code text-label-code text-on-surface-variant">ASST. LOCO PILOT (ALP)</div>
              <div className="font-semibold text-on-surface">Amit Verma</div>
              <div className="text-[11px] text-tertiary">Grade B • WAP-7 Endorsed</div>
            </div>
          </div>
        </div>

        {/* Locomotive Pneumatic & Traction Telemetry */}
        <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-2">
          <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider">
            Loco Rake &amp; Pneumatics
          </span>
          <div className="grid grid-cols-2 gap-2 font-label-code text-label-code">
            <div className="p-2 rounded bg-surface-container-low">
              <span className="text-on-surface-variant block">BRAKE PIPE (BP)</span>
              <span className="text-tertiary font-bold text-base">5.00 bar</span>
            </div>
            <div className="p-2 rounded bg-surface-container-low">
              <span className="text-on-surface-variant block">FEED PIPE (FP)</span>
              <span className="text-primary font-bold text-base">6.00 bar</span>
            </div>
            <div className="p-2 rounded bg-surface-container-low">
              <span className="text-on-surface-variant block">MAIN RESERVOIR (MR)</span>
              <span className="text-secondary font-bold text-base">9.80 bar</span>
            </div>
            <div className="p-2 rounded bg-surface-container-low">
              <span className="text-on-surface-variant block">OHE CATENARY</span>
              <span className="text-on-surface font-bold text-base">24.6 kV</span>
            </div>
          </div>
        </div>

        {/* Kawach ATP & Communication Health */}
        <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-2">
          <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider">
            Kawach ATP Diagnostic
          </span>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs">RFID Track Reader</span>
              <span className="text-tertiary font-label-code text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> OPERATIONAL
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs">UHF Radio Link (450 MHz)</span>
              <span className="text-tertiary font-label-code text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> RSSI: -64 dBm
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs">Brake Interface Unit (BIU)</span>
              <span className="text-tertiary font-label-code text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> ARMED &amp; SEALED
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-headline-md font-bold uppercase tracking-wider active:scale-95 transition-all shadow-md text-center"
        >
          Close Dossier
        </button>
      </div>
    </div>
  );
};
