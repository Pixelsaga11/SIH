import React, { useState } from 'react';
import { TelemetryEvent, TrainLocation } from '../types';

interface LiveIncidentRailProps {
  events: TelemetryEvent[];
  trains: TrainLocation[];
  onTriggerAction: (msg: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const LiveIncidentRail: React.FC<LiveIncidentRailProps> = ({
  events,
  trains,
  onTriggerAction,
  isOpen,
  onToggle,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'track' | 'loco'>('all');
  const [soundMuted, setSoundMuted] = useState(false);

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return e.type === 'CRITICAL' || e.type === 'WARNING';
    if (filter === 'track') return e.category === 'track' || e.category === 'bridges';
    if (filter === 'loco') return e.category === 'loco' || e.category === 'ohe';
    return true;
  });

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="fixed right-0 top-24 z-30 bg-[#102034] hover:bg-[#1b2b3f] text-[#4cd7f6] border-l border-y border-[#26364a] rounded-l-md px-2 py-3 shadow-2xl flex flex-col items-center gap-2 cursor-pointer transition-all"
        title="Open Live Telemetry Incident Rail"
      >
        <span className="material-symbols-outlined text-[20px] animate-pulse">sensors</span>
        <span className="text-[10px] font-mono [writing-mode:vertical-rl] tracking-widest text-[#bcc9cd] uppercase font-bold">
          LIVE TELEMETRY
        </span>
        <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping" />
      </button>
    );
  }

  return (
    <aside className="w-80 xl:w-96 bg-[#000f21] border-l border-[#1b2b3f] flex flex-col h-full shrink-0 select-none overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-[#1b2b3f] bg-[#0b1c30] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb4ab] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb4ab]" />
          </span>
          <span className="font-label-sm font-bold tracking-wider text-[#d3e4fe] uppercase">
            LIVE TELEMETRY FEED
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSoundMuted(!soundMuted);
              onTriggerAction(soundMuted ? 'Telemetry Audio Alarms Unmuted' : 'Telemetry Audio Alarms Muted');
            }}
            className="p-1 rounded text-[#bcc9cd] hover:text-[#d3e4fe] hover:bg-[#1b2b3f]"
            title={soundMuted ? 'Unmute Audio Alarms' : 'Mute Audio Alarms'}
          >
            <span className="material-symbols-outlined text-[17px]">
              {soundMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggle}
            className="p-1 rounded text-[#bcc9cd] hover:text-[#d3e4fe] hover:bg-[#1b2b3f]"
            title="Collapse Telemetry Rail"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Corridor Microclimate & Weather Ticker */}
      <div className="p-3 border-b border-[#1b2b3f] bg-[#000f21] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#869397]">
          <span>ENVIRONMENTAL &amp; CORRIDOR CLIMATE</span>
          <span className="text-[#4edea3]">BHOR SUMMIT AWS</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-[#0b1c30] border border-[#1b2b3f]">
            <div className="text-[10px] text-[#869397]">RAIL AMBIENT</div>
            <div className="text-[#d3e4fe] font-bold text-sm mt-0.5">44.2°C</div>
            <div className="text-[9px] text-[#4edea3] mt-0.5">Expansion: +1.2mm</div>
          </div>

          <div className="p-2 rounded bg-[#0b1c30] border border-[#1b2b3f]">
            <div className="text-[10px] text-[#869397]">CROSSWIND GUST</div>
            <div className="text-[#ffb4ab] font-bold text-sm mt-0.5">38 km/h</div>
            <div className="text-[9px] text-[#bcc9cd] mt-0.5">Vector: NNW (Shear)</div>
          </div>

          <div className="p-2 rounded bg-[#0b1c30] border border-[#1b2b3f]">
            <div className="text-[10px] text-[#869397]">MONSOON RAIN</div>
            <div className="text-[#ffb4ab] font-bold text-sm mt-0.5">42 mm/hr</div>
            <div className="text-[9px] text-[#ffb4ab] mt-0.5">Scour Alert Active</div>
          </div>

          <div className="p-2 rounded bg-[#0b1c30] border border-[#1b2b3f]">
            <div className="text-[10px] text-[#869397]">OHE 25kV VOLTAGE</div>
            <div className="text-[#4edea3] font-bold text-sm mt-0.5">24.8 kV</div>
            <div className="text-[9px] text-[#4edea3] mt-0.5">Grid Locked</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5 border-b border-[#1b2b3f] bg-[#0b1c30]">
        {(['all', 'critical', 'track', 'loco'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
              filter === tab
                ? 'bg-[#4cd7f6] text-[#003640]'
                : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Incident Stream List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#869397]">
          <span>ROLLING INCIDENT BUFFER</span>
          <span>{filteredEvents.length} EVENTS</span>
        </div>

        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => onTriggerAction(`Focused Incident: ${evt.source} - ${evt.message}`)}
            className={`p-2.5 rounded border transition-all cursor-pointer text-left group hover:border-[#4cd7f6]/60 ${
              evt.type === 'CRITICAL'
                ? 'bg-[#180a0e] border-[#ffb4ab]/40 hover:bg-[#200e13]'
                : evt.type === 'WARNING'
                ? 'bg-[#1c1808] border-[#ffe082]/30 hover:bg-[#241f0b]'
                : evt.type === 'SUCCESS'
                ? 'bg-[#081812] border-[#4edea3]/30 hover:bg-[#0c2219]'
                : 'bg-[#0b1c30] border-[#1b2b3f] hover:bg-[#102034]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                    evt.type === 'CRITICAL'
                      ? 'bg-[#93000a] text-[#ffdad6]'
                      : evt.type === 'WARNING'
                      ? 'bg-[#665000] text-[#ffe082]'
                      : evt.type === 'SUCCESS'
                      ? 'bg-[#005234] text-[#7bfec1]'
                      : 'bg-[#26364a] text-[#adc6ff]'
                  }`}
                >
                  {evt.type}
                </span>
                <span className="text-xs font-bold text-[#d3e4fe] font-mono">
                  {evt.source}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#869397]">
                {evt.timestamp}
              </span>
            </div>

            <p className="text-[11px] text-[#bcc9cd] mt-1.5 leading-snug font-sans group-hover:text-[#d3e4fe]">
              {evt.message}
            </p>

            <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#1b2b3f]/60 text-[9px] font-mono text-[#869397]">
              <span>LOC: {evt.location}</span>
              <span className="text-[#4cd7f6] group-hover:underline">VIEW SENSOR &rarr;</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fleet Trains in Corridor Section */}
      <div className="p-3 border-t border-[#1b2b3f] bg-[#0b1c30] flex flex-col gap-2 max-h-48 overflow-y-auto">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#869397]">
          <span>ACTIVE FLEET IN SECTOR</span>
          <span className="text-[#4cd7f6] font-bold">{trains.length} RAKES</span>
        </div>

        <div className="space-y-1.5">
          {trains.map((trn) => (
            <div
              key={trn.id}
              onClick={() => onTriggerAction(`Tracking Telemetry for ${trn.number} ${trn.name}`)}
              className="p-2 rounded bg-[#000f21] border border-[#1b2b3f] flex items-center justify-between text-xs cursor-pointer hover:border-[#4cd7f6]"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#d3e4fe]">{trn.number}</span>
                  <span className="text-[10px] text-[#bcc9cd] line-clamp-1 max-w-[120px]">
                    {trn.name}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#869397]">
                  Km {trn.locationKm.toFixed(1)} • {trn.block}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span
                  className={`font-mono font-bold text-xs ${
                    trn.status === 'SPEED_RESTRICTED' ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
                  }`}
                >
                  {trn.speed} km/h
                </span>
                <span className="text-[9px] text-[#869397]">
                  {trn.delayMin === 0 ? 'ON TIME' : `+${trn.delayMin}m`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
