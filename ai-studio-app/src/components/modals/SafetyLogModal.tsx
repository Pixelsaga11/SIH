import React from 'react';
import { Workorder } from '../../types';

interface SafetyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  workorders: Workorder[];
}

export const SafetyLogModal: React.FC<SafetyLogModalProps> = ({
  isOpen,
  onClose,
  workorders,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const content = `CENTRAL RAILWAY - SAFETY & TELEMETRY AUDIT LOGBOOK
Section: SEC-8802 (Bhor Ghat Continuous Telemetry Grid)
Authority: DISPATCHER-04 | Generated: ${new Date().toUTCString()}
Verification SHA-256: 7f8a9e12c45d38f82a77b819e65839ff12
----------------------------------------------------------------------
ACTIVE WORKORDERS & SPEED RESTRICTIONS:
${workorders
  .map(
    (wo) =>
      `[${wo.createdAt}] ${wo.id} | ${wo.priority} | ${wo.assetTitle}\n  Action: ${wo.description}\n  Assigned: ${wo.gang} | Status: ${wo.status}`
  )
  .join('\n\n')}
----------------------------------------------------------------------
SENSOR AUDIT SNAPSHOT:
- Fiber-optic Strain Array T-408: Micro-fissure at joint #44 (+3.2mm deviation)
- Hydro-acoustic Scour B-104: Pier 3 scour depth 1.8m (Rainfall 42mm/hr)
- Trackside Infrared Loco #30411: Hotbox bearing temp 78°C (+14°C delta)
- OHE Catenary Sec-09: Pantograph wire 28% residual cross-section
----------------------------------------------------------------------
STATUS: COMPLIANT WITH RAILWAY BOARD SAFETY CIRCULAR 2026/OT/08`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RAILSENSE_SAFETY_LOG_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded bg-[#102034] border border-[#26364a] shadow-2xl p-5 text-[#d3e4fe]">
        <div className="flex items-center justify-between border-b border-[#1b2b3f] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[22px]">assignment_turned_in</span>
            <div>
              <h3 className="font-headline-sm text-base">Export Railway Safety Logbook</h3>
              <p className="font-body-sm text-[11px] text-[#bcc9cd]">Official Section Controller Shift Telemetry Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#bcc9cd] hover:text-[#d3e4fe] p-1 rounded hover:bg-[#1b2b3f]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 p-4 rounded bg-[#000f21] border border-[#1b2b3f] font-mono text-[11px] leading-relaxed max-h-[50vh] overflow-y-auto select-text text-[#bcc9cd]">
          <div className="text-[#4cd7f6] font-bold pb-2 border-b border-[#1b2b3f]">
            OFFICIAL CENTRAL RAILWAY TELEMETRY RECORD • SECTION SEC-8802
          </div>
          <div className="pt-2 text-[10px] text-[#869397]">
            TIMESTAMP: {new Date().toUTCString()} | GRID: GRID-04 | CERTIFICATE HASH: #98F4-42E1-7BC9
          </div>

          <div className="mt-3 text-[#d3e4fe] font-semibold">Active Incidents &amp; Workorders:</div>
          <div className="mt-1 space-y-2">
            {workorders.map((wo) => (
              <div key={wo.id} className="p-2 rounded bg-[#0b1c30] border border-[#1b2b3f]">
                <div className="flex justify-between text-[#4cd7f6]">
                  <span>{wo.id} [{wo.priority}]</span>
                  <span className="text-[#4edea3]">{wo.status}</span>
                </div>
                <div className="text-[#d3e4fe] font-bold">{wo.assetTitle}</div>
                <div className="text-[#bcc9cd] text-[10px] mt-0.5">{wo.description}</div>
                <div className="text-[#869397] text-[9px] mt-0.5">Assigned: {wo.gang} | Logged: {wo.createdAt}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-2 border-t border-[#1b2b3f] text-[#4edea3]">
            ✔ DIGITAL SIGNATURE VERIFIED: DISPATCHER-04 (CHIEF CONTROLLER)
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1b2b3f] flex items-center justify-between">
          <span className="font-label-sm text-[10px] text-[#bcc9cd]">Format: OT-Grid Railway Board Standard ISO-27001</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-[#1b2b3f] text-[#bcc9cd] font-label-sm uppercase"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#0566d9] hover:bg-[#0566d9]/80 text-[#e6ecff] font-label-sm font-bold uppercase transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download Signed Log</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
