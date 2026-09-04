import React, { useState } from 'react';
import { TrackBlock, TrainLocation } from '../../types';

interface LiveMapScreenProps {
  trains: TrainLocation[];
  blocks: TrackBlock[];
  onTriggerAction: (msg: string) => void;
}

export const LiveMapScreen: React.FC<LiveMapScreenProps> = ({
  trains,
  blocks,
  onTriggerAction,
}) => {
  const [selectedPin, setSelectedPin] = useState<{
    type: 'defect' | 'bridge' | 'train' | 'ohe';
    title: string;
    km: string;
    details: string;
    status: string;
  } | null>({
    type: 'defect',
    title: 'TRACK T-408 Weld Joint #44',
    km: 'Km 118.4',
    details: 'Fiber-optic strain anomaly +3.2mm. Speed limit restricted to 30 km/h.',
    status: 'TIER-2 DEFECT',
  });

  const [activeLayer, setActiveLayer] = useState<'all' | 'trains' | 'defects' | 'bridges'>('all');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-3 sm:px-6 gap-6 pb-28 pt-2">
      {/* Map Header */}
      <div className="flex flex-col gap-1 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#0566d9]/20 text-[#adc6ff] font-label-sm uppercase">
              Topological Corridor Schematic
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
          </div>
          <span className="font-label-sm text-[#bcc9cd]">SCALE: 1:50,000 (GRADIENT 1:37)</span>
        </div>
        <p className="font-body-sm text-[#bcc9cd]">
          Interactive track schematic showing physical track circuits, telemetry sensor clusters, and live train positions.
        </p>
      </div>

      {/* Layer Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setActiveLayer('all')}
          className={`px-3 py-1 rounded font-label-sm uppercase transition-all cursor-pointer ${
            activeLayer === 'all'
              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          All Layers
        </button>
        <button
          type="button"
          onClick={() => setActiveLayer('trains')}
          className={`px-3 py-1 rounded font-label-sm uppercase transition-all cursor-pointer ${
            activeLayer === 'trains'
              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          Active Trains (4)
        </button>
        <button
          type="button"
          onClick={() => setActiveLayer('defects')}
          className={`px-3 py-1 rounded font-label-sm uppercase transition-all cursor-pointer ${
            activeLayer === 'defects'
              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          Track Flaws (T-408)
        </button>
        <button
          type="button"
          onClick={() => setActiveLayer('bridges')}
          className={`px-3 py-1 rounded font-label-sm uppercase transition-all cursor-pointer ${
            activeLayer === 'bridges'
              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          Bridges (B-104)
        </button>
      </div>

      {/* Interactive SVG Railway Corridor Schematic Map */}
      <div className="relative w-full rounded bg-[#000f21] border border-[#1b2b3f] p-4 shadow-xl overflow-hidden min-h-[360px] flex flex-col justify-between">
        {/* Top corridor stations guide */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#bcc9cd] border-b border-[#1b2b3f] pb-2">
          <span>PALASDARI (Km 110.0)</span>
          <span className="hidden sm:inline">KELAVLI (Km 114.2)</span>
          <span className="text-[#ffb4ab] font-bold">BHOR GHAT INCLINE (Km 118.4)</span>
          <span className="hidden sm:inline">MONKEY HILL (Km 122.0)</span>
          <span>KHANDALA (Km 128.0)</span>
        </div>

        {/* Dynamic Vector Schematic Track Canvas */}
        <div className="relative my-6 h-48 w-full">
          <svg className="w-full h-full" viewBox="0 0 800 180" preserveAspectRatio="none">
            {/* Grid coordinate lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#102034" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="90" x2="800" y2="90" stroke="#102034" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="140" x2="800" y2="140" stroke="#102034" strokeDasharray="4 4" strokeWidth="1" />

            {/* UP LINE TRACK (Top Rail) */}
            <path
              d="M 10 60 Q 200 60 400 65 T 790 60"
              fill="none"
              stroke="#26364a"
              strokeWidth="4"
            />
            {/* DOWN LINE TRACK (Bottom Rail) */}
            <path
              d="M 10 120 Q 200 120 400 115 T 790 120"
              fill="none"
              stroke="#26364a"
              strokeWidth="4"
            />

            {/* Crossover Siding at Monkey Hill (Km 122) */}
            <path
              d="M 520 60 L 590 120"
              fill="none"
              stroke="#3d494c"
              strokeWidth="2"
              strokeDasharray="3 3"
            />

            {/* Block 408A RESTRICTED HIGHLIGHT (Km 117-120.5) */}
            <line
              x1="320"
              y1="60"
              x2="480"
              y2="63"
              stroke="#ffb4ab"
              strokeWidth="5"
              strokeDasharray="8 3"
              className="animate-pulse"
            />

            {/* Station Mileposts */}
            <circle cx="20" cy="60" r="4" fill="#4edea3" />
            <circle cx="20" cy="120" r="4" fill="#4edea3" />
            <circle cx="210" cy="60" r="4" fill="#4edea3" />
            <circle cx="210" cy="120" r="4" fill="#4edea3" />
            <circle cx="560" cy="62" r="4" fill="#4edea3" />
            <circle cx="560" cy="117" r="4" fill="#4edea3" />
            <circle cx="780" cy="60" r="4" fill="#4edea3" />
            <circle cx="780" cy="120" r="4" fill="#4edea3" />
          </svg>

          {/* SENSOR PIN 1: TRACK T-408 DEFECT */}
          {(activeLayer === 'all' || activeLayer === 'defects') && (
            <button
              type="button"
              onClick={() =>
                setSelectedPin({
                  type: 'defect',
                  title: 'TRACK T-408 (Weld #44)',
                  km: 'Km 118.4 (Bhor Ghat Incline)',
                  details: 'Micro-fissure escalating under cyclic freight loads. Alignment deviation +3.2mm. TSR 30 active.',
                  status: 'TIER-2 DEFECT',
                })
              }
              style={{ left: '46%', top: '22%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#93000a] text-[#ffdad6] ring-4 ring-[#93000a]/30 animate-pulse shadow-lg">
                <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#93000a] text-[#ffdad6] text-[8px] font-bold whitespace-nowrap">
                T-408 FLAW
              </span>
            </button>
          )}

          {/* SENSOR PIN 2: BRIDGE B-104 (Ulhas River) */}
          {(activeLayer === 'all' || activeLayer === 'bridges') && (
            <button
              type="button"
              onClick={() =>
                setSelectedPin({
                  type: 'bridge',
                  title: 'BRIDGE B-104 (Ulhas River Viaduct)',
                  km: 'Km 115.6',
                  details: 'Pier 3 Hydro-Scour Depth at 1.8m. Rainfall 42mm/hr. Structural Caution Order active.',
                  status: 'STRUCTURAL CAUTION',
                })
              }
              style={{ left: '26%', top: '56%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0566d9] text-[#e6ecff] ring-4 ring-[#0566d9]/30 shadow-lg">
                <span className="material-symbols-outlined text-[16px]">domain</span>
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#0566d9] text-[#e6ecff] text-[8px] font-bold whitespace-nowrap">
                B-104 HYDRO
              </span>
            </button>
          )}

          {/* SENSOR PIN 3: TRAIN 12345 RAJDHANI (Loco WAP-7 #30411) */}
          {(activeLayer === 'all' || activeLayer === 'trains') && (
            <button
              type="button"
              onClick={() =>
                setSelectedPin({
                  type: 'train',
                  title: 'TRAIN 12345 (Loco WAP-7 #30411)',
                  km: 'Km 117.8 (Approaching T-408)',
                  details: 'Bogie 2 bearing temperature 78°C (+14°C Δ). Speed restricted to 65 km/h.',
                  status: 'HOTBOX WARNING',
                })
              }
              style={{ left: '42%', top: '24%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#4cd7f6] text-[#003640] ring-4 ring-[#4cd7f6]/40 shadow-lg animate-bounce">
                <span className="material-symbols-outlined text-[16px]">train</span>
              </div>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#4cd7f6] text-[#003640] text-[8px] font-bold whitespace-nowrap">
                TR-12345 (65 km/h)
              </span>
            </button>
          )}

          {/* SENSOR PIN 4: OHE Catenary Feeder Sub-04 */}
          {(activeLayer === 'all' || activeLayer === 'defects') && (
            <button
              type="button"
              onClick={() =>
                setSelectedPin({
                  type: 'ohe',
                  title: 'OHE FEEDER SUB-04 (SEC-09)',
                  km: 'Km 120.2',
                  details: '25kV AC contact wire residual wear 28%. Crosswind 38 km/h.',
                  status: 'CATENARY MONITORED',
                })
              }
              style={{ left: '62%', top: '23%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#102034] text-[#4edea3] border border-[#4edea3]/60 shadow-lg">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#102034] text-[#4edea3] text-[8px] font-bold whitespace-nowrap">
                OHE SEC-09
              </span>
            </button>
          )}
        </div>

        {/* Selected Sensor Popover Pane */}
        {selectedPin && (
          <div className="mt-2 p-3 rounded bg-[#102034] border border-[#26364a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-start gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                  selectedPin.status.includes('DEFECT')
                    ? 'bg-[#93000a] text-[#ffdad6]'
                    : selectedPin.status.includes('CAUTION')
                    ? 'bg-[#0566d9] text-[#e6ecff]'
                    : 'bg-[#26364a] text-[#4cd7f6]'
                }`}
              >
                {selectedPin.status}
              </span>
              <div>
                <div className="text-[#d3e4fe] font-bold">{selectedPin.title} ({selectedPin.km})</div>
                <div className="text-[#bcc9cd] text-[11px] mt-0.5">{selectedPin.details}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onTriggerAction(`Sensor Diagnostics Interrogated: ${selectedPin.title}`)
                }
                className="px-3 py-1 rounded bg-[#4cd7f6] text-[#003640] font-label-sm font-bold uppercase hover:bg-[#acedff] cursor-pointer"
              >
                Interrogate Sensor
              </button>
              <button
                type="button"
                onClick={() => setSelectedPin(null)}
                className="p-1 text-[#bcc9cd] hover:text-[#d3e4fe]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Corridor Train Matrix Table */}
      <div className="flex flex-col p-4 rounded bg-[#102034] border border-[#1b2b3f] gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">train</span>
            <span className="font-label-md uppercase tracking-wider text-[#d3e4fe]">
              Active Trains in Corridor (Kavach ATP Connected)
            </span>
          </div>
          <span className="font-label-sm text-[#bcc9cd]">4 Trains Tracking</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-[#bcc9cd]">
            <thead>
              <tr className="border-b border-[#1b2b3f] text-[10px] text-[#869397] uppercase">
                <th className="pb-2">Rake / Loco</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Location</th>
                <th className="pb-2">Speed</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Interlock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2b3f]/60">
              {trains.map((train) => (
                <tr key={train.id} className="hover:bg-[#0b1c30] transition-colors">
                  <td className="py-2.5 font-bold text-[#d3e4fe]">
                    {train.number} - {train.name}
                  </td>
                  <td className="py-2.5 text-[11px]">{train.type}</td>
                  <td className="py-2.5 text-[#4cd7f6]">
                    Km {train.locationKm} ({train.block})
                  </td>
                  <td className="py-2.5">
                    <span className="text-[#d3e4fe] font-bold">{train.speed}</span> / {train.maxPermittedSpeed} km/h
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        train.status === 'SPEED_RESTRICTED'
                          ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                          : 'bg-[#4edea3]/20 text-[#4edea3]'
                      }`}
                    >
                      {train.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        onTriggerAction(`Cab Signaling Ping Sent to Train #${train.number}`)
                      }
                      className="px-2 py-0.5 rounded bg-[#1b2b3f] hover:bg-[#26364a] text-[#4cd7f6] text-[10px] font-bold uppercase cursor-pointer"
                    >
                      Ping Cab
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
