import React, { useState } from 'react';
import { StationDelayPrediction } from '../types';

interface StationDelayWidgetProps {
  compact?: boolean;
  onStationSelect?: (station: StationDelayPrediction) => void;
}

export const defaultStations: StationDelayPrediction[] = [
  {
    id: 'st-kjt',
    stationCode: 'KJT',
    stationName: 'Karjat Jn',
    distanceKm: 8.2,
    scheduledTime: '18:31',
    predictedTime: '18:37',
    delayMinutes: 6,
    platform: 'PF 2 (Nominated)',
    confidence: 94,
    cause: 'Single-line crossing hold for 11010 Sinhagad Exp',
    recoveryPossibleMinutes: 0.5,
    trackType: 'Loop Line 2 (Clear)',
    status: 'critical',
  },
  {
    id: 'st-pdi',
    stationCode: 'PDI',
    stationName: 'Palasdari',
    distanceKm: 12.4,
    scheduledTime: '18:42',
    predictedTime: '18:48',
    delayMinutes: 6,
    platform: 'PF 1',
    confidence: 93,
    cause: 'Preceding local rake clearance & 1:100 Ghat entry',
    recoveryPossibleMinutes: 0.8,
    trackType: 'Main Down Line',
    status: 'critical',
  },
  {
    id: 'st-mkh',
    stationCode: 'MKH',
    stationName: 'Monkey Hill (Cabin)',
    distanceKm: 18.7,
    scheduledTime: '18:54',
    predictedTime: '19:01',
    delayMinutes: 7,
    platform: 'Catch Siding 1',
    confidence: 91,
    cause: 'Banker engine brake continuity check & catch siding lock',
    recoveryPossibleMinutes: 1.2,
    trackType: 'Ghat Cabin Interlock',
    status: 'critical',
  },
  {
    id: 'st-knd',
    stationCode: 'KND',
    stationName: 'Khandala',
    distanceKm: 24.1,
    scheduledTime: '19:04',
    predictedTime: '19:10',
    delayMinutes: 6,
    platform: 'PF 2',
    confidence: 89,
    cause: 'Banker loco decoupling & brake test clearance',
    recoveryPossibleMinutes: 1.5,
    trackType: 'Loop 2 (Signal S-44)',
    status: 'moderate',
  },
  {
    id: 'st-lnl',
    stationCode: 'LNL',
    stationName: 'Lonavala',
    distanceKm: 28.5,
    scheduledTime: '19:15',
    predictedTime: '19:20',
    delayMinutes: 5,
    platform: 'PF 1',
    confidence: 95,
    cause: 'Terminal platform re-entry; throttle profile normalized',
    recoveryPossibleMinutes: 2.0,
    trackType: 'Main Down Line',
    status: 'moderate',
  },
  {
    id: 'st-tgn',
    stationCode: 'TGN',
    stationName: 'Talegaon',
    distanceKm: 56.8,
    scheduledTime: '19:42',
    predictedTime: '19:45',
    delayMinutes: 3,
    platform: 'PF 2',
    confidence: 92,
    cause: 'High-speed plain track acceleration recovery (+105 km/h)',
    recoveryPossibleMinutes: 2.5,
    trackType: 'Fast Corridor',
    status: 'recovering',
  },
  {
    id: 'st-svjr',
    stationCode: 'SVJR',
    stationName: 'Shivajinagar',
    distanceKm: 88.3,
    scheduledTime: '20:10',
    predictedTime: '20:12',
    delayMinutes: 2,
    platform: 'PF 1',
    confidence: 96,
    cause: 'Suburban automatic block spacing synchronized',
    recoveryPossibleMinutes: 1.5,
    trackType: 'Automatic Section 8',
    status: 'nominal',
  },
  {
    id: 'st-pune',
    stationCode: 'PUNE',
    stationName: 'Pune Jn (Terminus)',
    distanceKm: 92.4,
    scheduledTime: '20:25',
    predictedTime: '20:26',
    delayMinutes: 1,
    platform: 'PF 3',
    confidence: 97,
    cause: 'Full equilibrium restored via dynamic recovery advisory',
    recoveryPossibleMinutes: 1.0,
    trackType: 'Station Yard Berth',
    status: 'nominal',
  },
];

export const StationDelayWidget: React.FC<StationDelayWidgetProps> = ({
  compact = false,
  onStationSelect,
}) => {
  const [stations, setStations] = useState<StationDelayPrediction[]>(defaultStations);
  const [filterMode, setFilterMode] = useState<'all' | 'next3' | 'ghat'>('all');
  const [isRecoveryActive, setIsRecoveryActive] = useState<boolean>(false);
  const [selectedStationId, setSelectedStationId] = useState<string | null>('st-kjt');
  const [toastNote, setToastNote] = useState<string | null>(null);

  const toggleRecoverySimulation = () => {
    const nextState = !isRecoveryActive;
    setIsRecoveryActive(nextState);

    if (nextState) {
      setToastNote('AI Recovery Profile Armed: Throttling notch up at Monkey Hill reclaims 3.5 min.');
    } else {
      setToastNote('Default Train Path restored: Standard sectional timetable run.');
    }
    setTimeout(() => setToastNote(null), 3500);

    setStations((prev) =>
      prev.map((st) => {
        if (!nextState) {
          const original = defaultStations.find((o) => o.id === st.id);
          return original || st;
        }
        // When recovery is active, reduce predicted delay
        const recoveredDelay = Math.max(0, st.delayMinutes - (st.distanceKm > 20 ? 3 : 1));
        const [hour, min] = st.scheduledTime.split(':').map(Number);
        const totalMins = hour * 60 + min + recoveredDelay;
        const newHour = Math.floor(totalMins / 60);
        const newMin = totalMins % 60;
        const formatted = `${newHour}:${newMin < 10 ? '0' + newMin : newMin}`;

        return {
          ...st,
          predictedTime: formatted,
          delayMinutes: recoveredDelay,
          status: recoveredDelay <= 1 ? 'nominal' : recoveredDelay <= 3 ? 'recovering' : 'moderate',
        };
      })
    );
  };

  const filteredStations = stations.filter((st) => {
    if (filterMode === 'next3') {
      return stations.indexOf(st) < 3;
    }
    if (filterMode === 'ghat') {
      return ['KJT', 'PDI', 'MKH', 'KND', 'LNL'].includes(st.stationCode);
    }
    return true;
  });

  const selectedStation = stations.find((st) => st.id === selectedStationId) || stations[0];

  return (
    <div className="flex flex-col gap-hud-pad-sm w-full bg-surface-container-low rounded-xl p-hud-pad-md shadow-md border border-surface-variant/30">
      {/* Toast alert */}
      {toastNote && (
        <div className="p-hud-pad-xs px-2 rounded-lg bg-surface-container-highest border border-primary/40 flex items-center justify-between text-on-surface text-label-code font-label-code animate-fade-in">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">psychology</span>
            <span>{toastNote}</span>
          </div>
          <button onClick={() => setToastNote(null)} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-hud-pad-xs">
          <span className="material-symbols-outlined text-primary text-[20px]">near_me</span>
          <div>
            <h3 className="font-headline-md text-headline-md text-primary leading-tight">
              Expected Station AI Delay Predictor
            </h3>
            <span className="font-label-code text-label-code text-on-surface-variant block">
              SECTION 12626 DN // 8 HORIZON STOPS
            </span>
          </div>
        </div>

        {/* Dynamic Recovery Optimizer Toggle */}
        <button
          onClick={toggleRecoverySimulation}
          className={`h-9 px-3 rounded-lg font-label-code text-label-code font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
            isRecoveryActive
              ? 'bg-tertiary text-on-tertiary ring-1 ring-tertiary'
              : 'bg-surface-container-high hover:bg-surface-bright text-primary border border-primary/30'
          }`}
          title="Toggle AI Recovery Profile"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isRecoveryActive ? 'check_circle' : 'trending_up'}
          </span>
          <span>{isRecoveryActive ? 'RECOVERY ARMED (-3.5M)' : 'OPTIMIZE RECOVERY'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-1 bg-surface-container p-1 rounded-lg">
        <div className="flex gap-1">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded text-label-code font-label-code uppercase transition-all ${
              filterMode === 'all'
                ? 'bg-surface-container-highest text-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Stops ({stations.length})
          </button>
          <button
            onClick={() => setFilterMode('next3')}
            className={`px-2.5 py-1 rounded text-label-code font-label-code uppercase transition-all ${
              filterMode === 'next3'
                ? 'bg-surface-container-highest text-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Next 3 Immediate
          </button>
          <button
            onClick={() => setFilterMode('ghat')}
            className={`px-2.5 py-1 rounded text-label-code font-label-code uppercase transition-all ${
              filterMode === 'ghat'
                ? 'bg-surface-container-highest text-secondary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Ghat Sector Only
          </button>
        </div>

        <span className="font-label-code text-[10px] text-tertiary pr-1.5 hidden sm:inline">
          LIVE AI INFERENCE 1Hz
        </span>
      </div>

      {/* Station Cards Grid / Timeline */}
      <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
        {filteredStations.map((st, idx) => {
          const isSelected = selectedStationId === st.id;
          const isDelayed = st.delayMinutes > 0;

          return (
            <div
              key={st.id}
              onClick={() => {
                setSelectedStationId(st.id);
                if (onStationSelect) onStationSelect(st);
              }}
              className={`p-2.5 rounded-lg transition-all cursor-pointer border flex flex-col gap-1.5 ${
                isSelected
                  ? 'bg-surface-container-high border-primary/60 ring-1 ring-primary/40'
                  : 'bg-surface-container border-surface-variant/40 hover:bg-surface-container-high'
              }`}
            >
              {/* Row 1: Station Code, Name, Distance & Delay Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded flex items-center justify-center font-label-code text-[11px] font-bold ${
                      st.status === 'critical'
                        ? 'bg-error text-on-error'
                        : st.status === 'moderate'
                        ? 'bg-secondary text-on-secondary'
                        : st.status === 'recovering'
                        ? 'bg-primary text-on-primary'
                        : 'bg-tertiary text-on-tertiary'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-headline-md text-headline-md leading-none text-on-surface">
                        {st.stationCode}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        {st.stationName}
                      </span>
                    </div>
                    <span className="font-label-code text-[10px] text-on-surface-variant">
                      +{st.distanceKm} km Ahead • {st.platform}
                    </span>
                  </div>
                </div>

                {/* Delay Drift Pill */}
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-label-code text-label-code text-on-surface-variant line-through">
                      {st.scheduledTime}
                    </span>
                    <span
                      className={`font-telemetry-md text-telemetry-md font-bold ${
                        st.status === 'critical'
                          ? 'text-error'
                          : st.status === 'moderate'
                          ? 'text-secondary'
                          : st.status === 'recovering'
                          ? 'text-primary'
                          : 'text-tertiary'
                      }`}
                    >
                      {st.predictedTime}
                    </span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded font-label-code text-[10px] font-bold uppercase ${
                      st.delayMinutes >= 5
                        ? 'bg-error/20 text-error'
                        : st.delayMinutes > 2
                        ? 'bg-secondary/20 text-secondary'
                        : st.delayMinutes > 0
                        ? 'bg-primary/20 text-primary'
                        : 'bg-tertiary/20 text-tertiary'
                    }`}
                  >
                    {isDelayed ? `+${st.delayMinutes}m DELAY` : 'ON TIME'}
                  </span>
                </div>
              </div>

              {/* Row 2: AI Cause & Confidence */}
              <div className="flex items-center justify-between bg-surface-container-lowest/70 px-2 py-1 rounded text-label-code font-label-code">
                <div className="flex items-center gap-1 text-on-surface truncate mr-2">
                  <span className="material-symbols-outlined text-[14px] text-primary shrink-0">
                    psychology
                  </span>
                  <span className="truncate text-[11px]">{st.cause}</span>
                </div>
                <div className="flex items-center gap-1 text-tertiary shrink-0">
                  <span className="text-[10px] text-on-surface-variant">CONF:</span>
                  <span className="font-bold">{st.confidence}%</span>
                </div>
              </div>

              {/* Expanded info on selected station */}
              {isSelected && !compact && (
                <div className="pt-1.5 mt-1 border-t border-surface-variant/40 grid grid-cols-3 gap-2 font-label-code text-[11px]">
                  <div className="bg-surface-container-high p-1.5 rounded">
                    <span className="text-on-surface-variant block text-[10px]">TRACK BERTH</span>
                    <span className="text-primary font-semibold truncate block">{st.trackType}</span>
                  </div>
                  <div className="bg-surface-container-high p-1.5 rounded">
                    <span className="text-on-surface-variant block text-[10px]">POTENTIAL RECOVERY</span>
                    <span className="text-tertiary font-semibold block">-{st.recoveryPossibleMinutes} min</span>
                  </div>
                  <div className="bg-surface-container-high p-1.5 rounded">
                    <span className="text-on-surface-variant block text-[10px]">DISPATCH CLEARANCE</span>
                    <span className="text-on-surface font-semibold block">Section Line Green</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Station Deep Dive Preview Footer */}
      {selectedStation && !compact && (
        <div className="bg-surface-container p-2.5 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              alt_route
            </span>
            <div className="flex flex-col">
              <span className="font-label-code text-label-code text-on-surface font-bold">
                FOCUS: {selectedStation.stationName} ({selectedStation.stationCode})
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Scheduled {selectedStation.scheduledTime} IST • Predicted {selectedStation.predictedTime} IST (
                {selectedStation.delayMinutes > 0 ? `+${selectedStation.delayMinutes}m` : 'Nominal'})
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-label-code text-[10px] text-on-surface-variant block">PLATFORM</span>
            <span className="font-label-code text-label-code font-bold text-tertiary">
              {selectedStation.platform}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
