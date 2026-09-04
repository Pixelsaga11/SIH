import React, { useState } from 'react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose }) => {
  const [broadcastState, setBroadcastState] = useState<'idle' | 'transmitting' | 'sent'>('idle');

  if (!isOpen) return null;

  const handleBroadcast = () => {
    setBroadcastState('transmitting');
    setTimeout(() => {
      setBroadcastState('sent');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-surface-container-high border border-error/50 rounded-2xl p-hud-pad-md flex flex-col gap-hud-pad-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-hud-pad-xs text-error">
          <span className="material-symbols-outlined text-[28px] animate-pulse">e911_emergency</span>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md tracking-tight uppercase leading-none">
              CRITICAL DISTRESS BEACON
            </span>
            <span className="font-label-code text-label-code text-on-error-container mt-0.5">
              PRIORITY-1 CAB OVERRIDE
            </span>
          </div>
        </div>

        {/* Telemetry packet preview */}
        <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-1 text-label-code font-label-code border border-error/20">
          <div className="flex items-center justify-between text-error font-bold">
            <span>AUTOMATED DISTRESS PACKET</span>
            <span className="flex items-center gap-1 text-tertiary">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
              GPS LOCKED
            </span>
          </div>
          <div className="text-on-surface text-[12px] leading-relaxed pt-1">
            <strong>TRAIN:</strong> 12626 KERALA SF EXP <br />
            <strong>LOCO:</strong> WAP-7 #30211 • W/ 22 LHB <br />
            <strong>COORDINATES:</strong> 18.9102° N, 73.3233° E (MP 112/4) <br />
            <strong>STATUS:</strong> BRAKE MANDATE ACTIVE • SPEED 74 KM/H
          </div>
        </div>

        {/* Trigger options */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleBroadcast}
            disabled={broadcastState !== 'idle'}
            className={`w-full min-h-touch-target-min rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-2 uppercase tracking-wide transition-all shadow-lg active:scale-95 ${
              broadcastState === 'sent'
                ? 'bg-tertiary text-on-tertiary'
                : 'bg-error text-on-error hover:bg-error/90 animate-pulse'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {broadcastState === 'sent' ? 'check_circle' : 'cell_tower'}
            </span>
            <span>
              {broadcastState === 'idle' && 'BROADCAST DISTRESS PACKET'}
              {broadcastState === 'transmitting' && 'TRANSMITTING ON VHF CH 16...'}
              {broadcastState === 'sent' && 'DISTRESS ACKNOWLEDGED BY CONTROLLER'}
            </span>
          </button>

          <button
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate([100, 100, 100]);
              alert('EMERGENCY PNEUMATIC VENT OPENED: Brake pipe pressure dropping to 0 bar.');
              onClose();
            }}
            className="w-full min-h-touch-target-min rounded-xl bg-error-container text-error hover:bg-error/30 font-headline-md text-headline-md flex items-center justify-center gap-2 uppercase tracking-wide transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">e911_emergency</span>
            <span>PNEUMATIC BP VENT DUMP (EMERGENCY BRAKE)</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="py-2 text-center font-label-code text-label-code text-on-surface-variant hover:text-on-surface uppercase tracking-wider"
        >
          Cancel &amp; Dismiss
        </button>
      </div>
    </div>
  );
};
