import React from 'react';

interface DispatchSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAction: (msg: string) => void;
}

const SQUADS = [
  {
    id: 'GANG-12',
    name: 'Gang #12 (Permanent Way Unit)',
    base: 'Monkey Hill Staging Point (Km 122)',
    status: 'STANDBY',
    specialty: 'High-Tensile CWR Rail Clamping & Weld Thermit',
    eta: '12 min',
    vehicle: 'Track Motor Vehicle TMV-4',
    lead: 'Supervisor R. K. Shinde',
  },
  {
    id: 'BSU-03',
    name: 'Bridge Specialized Unit #03',
    base: 'Karjat Bridge Yard',
    status: 'STANDBY',
    specialty: 'Hydro-Scour Monitoring & Underwater Sonar',
    eta: '25 min',
    vehicle: 'Hydraulic Mobile Crane Unit 02',
    lead: 'Inspector V. Nair',
  },
  {
    id: 'TRD-02',
    name: 'TRD Catenary Tower Wagon #02',
    base: 'Kalyan Traction Substation',
    status: 'EN ROUTE',
    specialty: '25kV Pantograph Dropper Re-tensioning',
    eta: '8 min',
    vehicle: 'Self-Propelled 8-Wheeler Tower Car',
    lead: 'Senior Engineer A. Patil',
  },
  {
    id: 'RRV-01',
    name: 'Rapid Response Road-Rail Vehicle (RRV)',
    base: 'Lonavala Crest Depot',
    status: 'STANDBY',
    specialty: 'Immediate Obstruction Removal & USFD Probe',
    eta: '14 min',
    vehicle: 'Mercedes Unimog RRV Dual-Gauge',
    lead: 'Emergency Lead D. Khan',
  },
];

export const DispatchSquadModal: React.FC<DispatchSquadModalProps> = ({
  isOpen,
  onClose,
  onTriggerAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded bg-[#102034] border border-[#26364a] shadow-2xl p-5 text-[#d3e4fe]">
        <div className="flex items-center justify-between border-b border-[#1b2b3f] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">airport_shuttle</span>
            <div>
              <h3 className="font-headline-sm text-base">Rapid Response Squad Dispatch</h3>
              <p className="font-body-sm text-[11px] text-[#bcc9cd]">Bhor Ghat Heavy Mountain Incline Corridor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#bcc9cd] hover:text-[#d3e4fe] p-1 rounded hover:bg-[#1b2b3f]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {SQUADS.map((squad) => (
            <div
              key={squad.id}
              className="flex flex-col gap-2 p-3 rounded bg-[#0b1c30] border border-[#1b2b3f] hover:border-[#4cd7f6]/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-xs text-[#4cd7f6] font-bold">{squad.name}</span>
                    <span
                      className={`font-label-sm text-[9px] px-1.5 py-0.5 rounded ${
                        squad.status === 'STANDBY'
                          ? 'bg-[#4edea3]/20 text-[#4edea3]'
                          : 'bg-[#adc6ff]/20 text-[#adc6ff]'
                      }`}
                    >
                      {squad.status}
                    </span>
                  </div>
                  <span className="font-body-sm text-[11px] text-[#bcc9cd] block mt-0.5">
                    Base: {squad.base} • Lead: {squad.lead}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-[#4cd7f6] font-bold block">{squad.eta}</span>
                  <span className="font-label-sm text-[9px] text-[#bcc9cd]">Est. Response</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#1b2b3f]/60 text-[11px]">
                <span className="text-[#bcc9cd] italic line-clamp-1">{squad.specialty}</span>
                <button
                  type="button"
                  onClick={() => {
                    onTriggerAction(`${squad.name} Dispatched via ${squad.vehicle} (ETA ${squad.eta})`);
                    onClose();
                  }}
                  className="shrink-0 px-3 py-1 rounded bg-[#4cd7f6] text-[#003640] hover:bg-[#acedff] font-label-sm font-bold uppercase transition-all shadow-sm active:scale-95"
                >
                  Deploy Squad
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-[#1b2b3f] flex items-center justify-between">
          <span className="font-label-sm text-[10px] text-[#bcc9cd]">
            GPS Satellite Interlock Connected • 4 Squads Available
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe] font-label-sm uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
