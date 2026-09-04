import React, { useState } from 'react';
import { Workorder } from '../../types';

interface CreateWorkorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWorkorder: (wo: Workorder) => void;
  defaultAssetTitle?: string;
}

export const CreateWorkorderModal: React.FC<CreateWorkorderModalProps> = ({
  isOpen,
  onClose,
  onAddWorkorder,
  defaultAssetTitle,
}) => {
  const [assetTitle, setAssetTitle] = useState(defaultAssetTitle || 'TRACK T-408 (Km 118.4 Bhor Ghat)');
  const [priority, setPriority] = useState<Workorder['priority']>('CRITICAL');
  const [gang, setGang] = useState('Gang #12 (Monkey Hill Base)');
  const [description, setDescription] = useState('Emergency fishplate clamping and ultrasonic weld verification under TSR 30');
  const [permitConfirmed, setPermitConfirmed] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWo: Workorder = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      assetId: 'asset-custom',
      assetTitle,
      priority,
      gang,
      description,
      status: 'DISPATCHED',
      createdAt: new Date().toISOString().substring(11, 16) + ' UTC',
      eta: '30 min',
    };
    onAddWorkorder(newWo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded bg-[#102034] border border-[#26364a] shadow-2xl p-5 text-[#d3e4fe]">
        <div className="flex items-center justify-between border-b border-[#1b2b3f] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">post_add</span>
            <h3 className="font-headline-sm text-base">Issue Tactical Workorder</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#bcc9cd] hover:text-[#d3e4fe] p-1 rounded hover:bg-[#1b2b3f]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 font-body-sm text-xs">
          <div>
            <label className="block text-[#bcc9cd] font-label-sm uppercase mb-1">Target Infrastructure Asset</label>
            <select
              value={assetTitle}
              onChange={(e) => setAssetTitle(e.target.value)}
              className="w-full bg-[#0b1c30] border border-[#3d494c] rounded px-3 py-2 text-[#d3e4fe] font-mono focus:border-[#4cd7f6] focus:outline-none"
            >
              <option value="TRACK T-408 (Km 118.4 Bhor Ghat)">TRACK T-408 (Km 118.4 Bhor Ghat)</option>
              <option value="BRIDGE B-104 (Ulhas River Viaduct)">BRIDGE B-104 (Ulhas River Viaduct)</option>
              <option value="LOCO WAP-7 #30411 (Train 12345 RAJ)">LOCO WAP-7 #30411 (Train 12345 RAJ)</option>
              <option value="OHE CATENARY SEC-09 (Feeder Sub-04)">OHE CATENARY SEC-09 (Feeder Sub-04)</option>
              <option value="SWITCH POINT SW-12B (Monkey Hill Catch Siding)">SWITCH POINT SW-12B (Monkey Hill Catch Siding)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#bcc9cd] font-label-sm uppercase mb-1">Severity / Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Workorder['priority'])}
                className="w-full bg-[#0b1c30] border border-[#3d494c] rounded px-3 py-2 text-[#d3e4fe] font-mono focus:border-[#4cd7f6] focus:outline-none"
              >
                <option value="EMERGENCY">EMERGENCY (Line Block)</option>
                <option value="CRITICAL">CRITICAL (TSR Imposed)</option>
                <option value="MEDIUM">MEDIUM (Shadow Shift)</option>
                <option value="ROUTINE">ROUTINE (Night Maintenance)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#bcc9cd] font-label-sm uppercase mb-1">Assigned Repair Squad</label>
              <select
                value={gang}
                onChange={(e) => setGang(e.target.value)}
                className="w-full bg-[#0b1c30] border border-[#3d494c] rounded px-3 py-2 text-[#d3e4fe] font-mono focus:border-[#4cd7f6] focus:outline-none"
              >
                <option value="Gang #12 (Monkey Hill Base)">Gang #12 (Monkey Hill Base)</option>
                <option value="Bridge Specialized Unit #03">Bridge Specialized Unit #03</option>
                <option value="Traction Loco Shed Kalyan">Traction Loco Shed Kalyan</option>
                <option value="TRD Tower Wagon Unit #2">TRD Tower Wagon Unit #2</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#bcc9cd] font-label-sm uppercase mb-1">Remedial Action Protocol</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0b1c30] border border-[#3d494c] rounded px-3 py-2 text-[#d3e4fe] font-mono focus:border-[#4cd7f6] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded bg-[#0b1c30] border border-[#26364a]">
            <input
              type="checkbox"
              id="permitCheck"
              checked={permitConfirmed}
              onChange={(e) => setPermitConfirmed(e.target.checked)}
              className="accent-[#4cd7f6] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="permitCheck" className="text-[11px] text-[#bcc9cd] cursor-pointer">
              Authorize Automated Power Block & Interlock Caution Permit (Authority: DISPATCHER-04)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1b2b3f] mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#1b2b3f] hover:bg-[#26364a] text-[#bcc9cd] font-label-sm uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!permitConfirmed}
              className="px-4 py-2 rounded bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] font-label-sm font-bold uppercase transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              Issue & Dispatch Workorder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
