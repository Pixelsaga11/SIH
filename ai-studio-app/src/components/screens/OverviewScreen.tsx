import React from 'react';
import { MetricSummary, TrackBlock, TrainLocation } from '../../types';

interface OverviewScreenProps {
  metrics: MetricSummary;
  blocks: TrackBlock[];
  trains: TrainLocation[];
  onNavigateToTab: (tab: 'track-and-bridges' | 'live-map' | 'train-health' | 'ai-prediction') => void;
  onTriggerAction: (msg: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  metrics,
  blocks,
  trains,
  onNavigateToTab,
  onTriggerAction,
}) => {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-3 sm:px-6 gap-6 pb-28 pt-2">
      {/* Section Summary Header */}
      <div className="flex flex-col gap-1 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#0566d9]/20 text-[#adc6ff] font-label-sm uppercase">
              Section SEC-8802 • Bhor Ghat Mainline
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
          </div>
          <span className="font-label-sm text-[#4edea3] font-bold">ALL SIGNALS INTERLOCKED</span>
        </div>
        <p className="font-body-sm text-[#bcc9cd]">
          Central Operations Dashboard for mountain gradient double-track corridor (Km 110.0 to 128.0).
        </p>
      </div>

      {/* Primary KPI Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col p-3 rounded bg-[#0b1c30] border border-[#1b2b3f]/60 justify-between">
          <div className="flex items-center justify-between text-[#bcc9cd] font-label-sm">
            <span>NETWORK HEALTH</span>
            <span className="material-symbols-outlined text-[16px] text-[#4edea3]">check_circle</span>
          </div>
          <div className="my-2">
            <div className="font-headline-lg-mobile text-[#d3e4fe]">{metrics.fleetHealth}%</div>
            <span className="font-label-sm text-[#4edea3]">STABLE CORRIDOR</span>
          </div>
          <div className="w-full bg-[#102034] h-1 rounded overflow-hidden">
            <div className="bg-[#4edea3] h-full" style={{ width: `${metrics.fleetHealth}%` }} />
          </div>
        </div>

        <div className="flex flex-col p-3 rounded bg-[#0b1c30] border border-[#1b2b3f]/60 justify-between">
          <div className="flex items-center justify-between text-[#bcc9cd] font-label-sm">
            <span>ACTIVE ANOMALIES</span>
            <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">error</span>
          </div>
          <div className="my-2">
            <div className="font-headline-lg-mobile text-[#ffb4ab]">{metrics.trackAnomalies}</div>
            <span className="font-label-sm text-[#ffb4ab]">3 REQUIRES ACTION</span>
          </div>
          <div className="w-full bg-[#102034] h-1 rounded overflow-hidden">
            <div className="bg-[#ffb4ab] h-full w-[70%]" />
          </div>
        </div>

        <div className="flex flex-col p-3 rounded bg-[#0b1c30] border border-[#1b2b3f]/60 justify-between">
          <div className="flex items-center justify-between text-[#bcc9cd] font-label-sm">
            <span>LINE OCCUPANCY</span>
            <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">train</span>
          </div>
          <div className="my-2">
            <div className="font-headline-lg-mobile text-[#4cd7f6]">
              {trains.length} Trains
            </div>
            <span className="font-label-sm text-[#bcc9cd]">2 PASSENGER, 2 OTHER</span>
          </div>
          <div className="w-full bg-[#102034] h-1 rounded overflow-hidden">
            <div className="bg-[#4cd7f6] h-full w-[60%]" />
          </div>
        </div>

        <div className="flex flex-col p-3 rounded bg-[#0b1c30] border border-[#1b2b3f]/60 justify-between">
          <div className="flex items-center justify-between text-[#bcc9cd] font-label-sm">
            <span>MEAN VELOCITY</span>
            <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">speed</span>
          </div>
          <div className="my-2">
            <div className="font-headline-lg-mobile text-[#d3e4fe]">68 km/h</div>
            <span className="font-label-sm text-[#adc6ff]">TSR 30 ACTIVE AT KM 118</span>
          </div>
          <div className="w-full bg-[#102034] h-1 rounded overflow-hidden">
            <div className="bg-[#adc6ff] h-full w-[55%]" />
          </div>
        </div>
      </div>

      {/* Corridor Track Block Topology Map Snapshot */}
      <div className="flex flex-col p-4 rounded bg-[#102034] border border-[#1b2b3f] gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">route</span>
            <span className="font-label-md uppercase tracking-wider text-[#d3e4fe]">
              Corridor Block Occupancy (Km 110 - 128)
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('live-map')}
            className="text-[#4cd7f6] hover:underline font-label-sm flex items-center gap-0.5 cursor-pointer"
          >
            <span>Open Tactical Map</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Visual Block Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`p-2.5 rounded border flex flex-col justify-between ${
                block.status === 'CLEAR'
                  ? 'bg-[#000f21] border-[#1bbd85]/40 text-[#6ffbbe]'
                  : block.status === 'RESTRICTED'
                  ? 'bg-[#000f21] border-[#ffb4ab]/60 text-[#ffb4ab]'
                  : 'bg-[#000f21] border-[#0566d9]/60 text-[#adc6ff]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-label-sm font-bold">{block.code}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    block.status === 'CLEAR'
                      ? 'bg-[#4edea3]'
                      : block.status === 'RESTRICTED'
                      ? 'bg-[#ffb4ab] animate-pulse'
                      : 'bg-[#0566d9]'
                  }`}
                />
              </div>
              <div className="font-body-sm text-[10px] text-[#bcc9cd] mt-1">
                Km {block.fromKm} - {block.toKm}
              </div>
              <div className="font-label-sm text-[10px] font-bold mt-1">
                {block.status === 'RESTRICTED'
                  ? `TSR ${block.tsrKmph} km/h`
                  : block.status === 'OCCUPIED'
                  ? 'OCCUPIED'
                  : 'LINE CLEAR'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental & Ghat Weather Sensor Pod */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded bg-[#102034] border border-[#1b2b3f] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-[#bcc9cd]">RAIL TEMPERATURE</span>
            <span className="font-headline-sm text-[#d3e4fe] mt-0.5">38.4°C</span>
            <span className="font-body-sm text-[10px] text-[#4edea3]">Thermal stress safe (&lt;54°C)</span>
          </div>
          <span className="material-symbols-outlined text-[28px] text-[#4cd7f6]">thermostat</span>
        </div>

        <div className="p-3 rounded bg-[#102034] border border-[#1b2b3f] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-[#bcc9cd]">MONSOON RAINFALL</span>
            <span className="font-headline-sm text-[#adc6ff] mt-0.5">42 mm/hr</span>
            <span className="font-body-sm text-[10px] text-[#ffb4ab]">Hydro-watch active at B-104</span>
          </div>
          <span className="material-symbols-outlined text-[28px] text-[#adc6ff]">water_drop</span>
        </div>

        <div className="p-3 rounded bg-[#102034] border border-[#1b2b3f] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-[#bcc9cd]">CROSSWIND GALE</span>
            <span className="font-headline-sm text-[#d3e4fe] mt-0.5">38 km/h</span>
            <span className="font-body-sm text-[10px] text-[#4cd7f6]">OHE Dropper stability tracked</span>
          </div>
          <span className="material-symbols-outlined text-[28px] text-[#4edea3]">air</span>
        </div>
      </div>

      {/* Quick Access to Critical Alerts */}
      <div className="flex flex-col p-4 rounded bg-[#102034] border border-[#1b2b3f] gap-3">
        <div className="flex items-center justify-between">
          <span className="font-label-md uppercase tracking-wider text-[#d3e4fe]">
            Immediate Tactical Actions Required
          </span>
          <button
            type="button"
            onClick={() => onNavigateToTab('track-and-bridges')}
            className="text-[#4cd7f6] hover:underline font-label-sm cursor-pointer"
          >
            View All Asset Cards
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="p-3 rounded bg-[#000f21] border border-[#ffb4ab]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">graphic_eq</span>
              <div>
                <div className="text-xs font-bold text-[#d3e4fe]">
                  TRACK T-408: Micro-fissure at weld #44 (Km 118.4)
                </div>
                <div className="text-[10px] text-[#bcc9cd]">
                  RUL 18 Hours • AI recommends immediate clamp and TSR 30
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onTriggerAction('TSR 30 km/h applied directly to Track T-408');
              }}
              className="px-3 py-1 rounded bg-[#4cd7f6] text-[#003640] font-label-sm font-bold uppercase hover:bg-[#acedff] cursor-pointer"
            >
              Impose TSR 30
            </button>
          </div>

          <div className="p-3 rounded bg-[#000f21] border border-[#adc6ff]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">domain</span>
              <div>
                <div className="text-xs font-bold text-[#d3e4fe]">
                  BRIDGE B-104: Pier 3 Hydro-Scour Depth at 1.8m
                </div>
                <div className="text-[10px] text-[#bcc9cd]">
                  Ulhas River torrent • 6 coaching trains approaching
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onTriggerAction('Structural Caution Order transmitted for Bridge B-104');
              }}
              className="px-3 py-1 rounded bg-[#1b2b3f] hover:bg-[#adc6ff] hover:text-[#002e6a] text-[#adc6ff] font-label-sm font-bold uppercase cursor-pointer"
            >
              Issue Caution Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
