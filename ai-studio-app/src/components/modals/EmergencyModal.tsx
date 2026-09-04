import React, { useState } from 'react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAction: (msg: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onTriggerAction,
}) => {
  const [confirmStep, setConfirmStep] = useState(false);

  if (!isOpen) return null;

  const handleBroadcast = () => {
    onTriggerAction('CRITICAL EMERGENCY BROADCAST TRANSMITTED: All Trains in SEC-8802 Ordered to Halt via Kavach ATP');
    setConfirmStep(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded bg-[#102034] border-2 border-[#ffb4ab] shadow-[0_0_50px_rgba(255,180,171,0.25)] p-5 text-[#d3e4fe]">
        <div className="flex items-center gap-3 border-b border-[#93000a] pb-3">
          <div className="w-10 h-10 rounded bg-[#93000a] text-[#ffdad6] flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-base text-[#ffb4ab]">Emergency Broadcast Alert</h3>
            <span className="font-label-sm text-[10px] text-[#ffb4ab]/80 uppercase tracking-wider">
              Corridor Emergency Halt Protocol
            </span>
          </div>
        </div>

        <div className="mt-4 text-xs font-mono space-y-2 text-[#bcc9cd]">
          <p className="text-[#ffdad6] bg-[#93000a]/30 p-2.5 rounded border border-[#93000a]/50 leading-relaxed">
            WARNING: Triggering this command will issue immediate Cab Audio Warnings and activate Kavach Automatic Train Protection (ATP) brake intervention to all 6 rakes currently in Section SEC-8802.
          </p>
          <div className="pt-2 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span>Target Section:</span>
              <span className="text-[#d3e4fe] font-bold">SEC-8802 (Km 110 - 128)</span>
            </div>
            <div className="flex justify-between">
              <span>Active Trains in Section:</span>
              <span className="text-[#ffb4ab] font-bold">6 Trains (2 Passenger, 4 Freight)</span>
            </div>
            <div className="flex justify-between">
              <span>OHE Power Cutoff:</span>
              <span className="text-[#4edea3]">STANDBY READY</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#1b2b3f] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setConfirmStep(false);
              onClose();
            }}
            className="px-3 py-2 rounded bg-[#1b2b3f] hover:bg-[#26364a] text-[#bcc9cd] font-label-sm uppercase"
          >
            Cancel
          </button>

          {!confirmStep ? (
            <button
              type="button"
              onClick={() => setConfirmStep(true)}
              className="px-4 py-2 rounded bg-[#93000a] hover:bg-[#690005] text-[#ffdad6] font-label-sm font-bold uppercase transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">priority_high</span>
              <span>Arm Emergency Halt</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBroadcast}
              className="px-4 py-2 rounded bg-[#ffb4ab] hover:bg-white text-[#690005] font-label-sm font-bold uppercase transition-all shadow-lg active:scale-95 animate-bounce flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">broadcast_on_personal</span>
              <span>Confirm &amp; Broadcast Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
