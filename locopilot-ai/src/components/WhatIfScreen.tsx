import React, { useState } from 'react';
import { WhatIfPreset } from '../types';

export const WhatIfScreen: React.FC = () => {
  const [haltMinutes, setHaltMinutes] = useState<number>(0);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; icon: string } | null>(null);

  const presets: WhatIfPreset[] = [
    {
      id: 'sc-a',
      name: 'SCENARIO A',
      sub: '+5m Halt S-42',
      minutes: 5,
      eta: '18:52',
      delta: '+12m',
      desc: 'S-42 HALT: 2 local rakes throttled at KYN loop.',
      colorType: 'error',
    },
    {
      id: 'sc-b',
      name: 'SCENARIO B',
      sub: 'X-ing Palasdari',
      minutes: 8,
      eta: '18:55',
      delta: '+15m',
      desc: 'CROSSING: Palasdari loop priority shift.',
      colorType: 'secondary',
    },
    {
      id: 'sc-c',
      name: 'SCENARIO C',
      sub: 'Max Recovery',
      minutes: 0,
      eta: '18:43',
      delta: '+3m',
      desc: 'MAX RECOVERY: Section notch-up to 105 km/h.',
      colorType: 'tertiary',
    },
  ];

  const calculateSimEta = (mins: number) => {
    const baseHour = 18;
    const baseMin = 47;
    const totalMinutes = baseMin + mins;
    const simHour = baseHour + Math.floor(totalMinutes / 60);
    const remMin = totalMinutes % 60;
    const formattedMin = remMin < 10 ? '0' + remMin : remMin;
    const totalDelta = 7 + mins;
    return {
      eta: `${simHour}:${formattedMin}`,
      delta: `+${totalDelta}m`,
    };
  };

  const currentImpact = (mins: number) => {
    if (mins === 0) return 'Normal throttle envelope maintained.';
    if (mins < 7) return `Cascade variance: Minor hold at outer home (+${mins}m).`;
    return `CRITICAL: Line block locks 2 loop trains at Palasdari (+${mins}m).`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setHaltMinutes(val);
    setSelectedScenario(null);
  };

  const applyPreset = (preset: WhatIfPreset) => {
    setSelectedScenario(preset.id);
    setHaltMinutes(preset.minutes);
    showToast(`Preset armed: ${preset.name} (${preset.sub})`, 'tune');
  };

  const showToast = (text: string, icon: string = 'info') => {
    setToastMessage({ text, icon });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const simInfo = calculateSimEta(haltMinutes);
  const nodeColor = haltMinutes === 0 ? '#4cd7f6' : haltMinutes < 7 ? '#ffb95f' : '#ffb4ab';
  const nodeText =
    haltMinutes === 0
      ? 'S-42 [CLEAR]'
      : haltMinutes < 7
      ? `S-42 [HOLD ${haltMinutes}M]`
      : `S-42 [BLOCK ${haltMinutes}M]`;

  return (
    <div className="flex flex-col w-full gap-hud-pad-md p-hud-pad-md pb-6">
      {/* Dynamic Cockpit Toast */}
      {toastMessage && (
        <div className="fixed top-22 inset-x-4 z-50 p-hud-pad-sm bg-surface-container-highest border border-primary/40 rounded-xl flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">{toastMessage.icon}</span>
            <span className="font-label-code text-label-code text-on-surface">{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* TOP EMERGENCY DISTRESS BANNER */}
      <div className="w-full bg-surface-container-high rounded-xl p-hud-pad-md flex flex-col gap-hud-pad-sm shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-hud-pad-xs text-secondary">
            <span className="material-symbols-outlined text-[20px] animate-pulse">crisis_alert</span>
            <span className="font-label-code text-label-code uppercase tracking-wider font-semibold">
              Priority 13 Console
            </span>
          </div>
          <span className="font-label-code text-label-code bg-surface-container-highest px-hud-pad-xs py-0.5 rounded text-on-surface-variant">
            AUTO-READY
          </span>
        </div>

        {/* Telemetry Distress Packet Readout */}
        <div className="bg-surface-container-lowest p-hud-pad-sm rounded-lg flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-primary uppercase">
              Distress Packet (Telemetry Sync)
            </span>
            <span className="material-symbols-outlined text-tertiary text-[16px]">sensors</span>
          </div>
          <p className="font-label-code text-label-code text-on-surface leading-tight">
            TRN: 12626 EXP | LOCO: WAP-7 #30211 | POS: 18.9102° N, 73.3233° E (MP 112/4) | SPD: 74 KM/H | ASP:
            DBL-YELLOW | SEC: BCT-KYN-PUNE
          </p>
        </div>

        {/* Tactical One-Tap Action Grid */}
        <div className="grid grid-cols-2 gap-hud-pad-xs">
          <button
            onClick={() => showToast('CRITICAL: SOS packet dispatched to Chief Controller', 'e911_emergency')}
            className="min-h-touch-target-min bg-error text-on-error rounded-lg flex items-center justify-center gap-hud-pad-xs font-label-code text-label-code font-bold uppercase active:scale-95 transition-transform shadow-sm"
            id="btn-sos-chief"
          >
            <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
            <span>SOS Chief Ctrl</span>
          </button>

          <button
            onClick={() =>
              showToast('VHF Channel 16 locked. Transmit open to Sectional Controller.', 'cell_tower')
            }
            className="min-h-touch-target-min bg-surface-container-highest text-primary hover:bg-surface-bright rounded-lg flex items-center justify-center gap-hud-pad-xs font-label-code text-label-code font-bold uppercase active:scale-95 transition-transform"
            id="btn-vhf-direct"
          >
            <span className="material-symbols-outlined text-[18px]">cell_tower</span>
            <span>VHF Direct Ctrl</span>
          </button>

          <button
            onClick={() => showToast('Direct link opened: Karjat Station Master console', 'domain')}
            className="min-h-touch-target-min bg-surface-container-highest text-on-surface hover:bg-surface-bright rounded-lg flex items-center justify-center gap-hud-pad-xs font-label-code text-label-code font-semibold uppercase active:scale-95 transition-transform"
            id="btn-sm-karjat"
          >
            <span className="material-symbols-outlined text-[18px]">domain</span>
            <span>SM Karjat (Direct)</span>
          </button>

          <button
            onClick={() => showToast('Incident logged: Track obstruction report sent to KYN RPF/Ops', 'report_problem')}
            className="min-h-touch-target-min bg-surface-container-highest text-secondary-fixed-dim hover:bg-surface-bright rounded-lg flex items-center justify-center gap-hud-pad-xs font-label-code text-label-code font-semibold uppercase active:scale-95 transition-transform"
            id="btn-incident"
          >
            <span className="material-symbols-outlined text-[18px]">report_problem</span>
            <span>Report Obstruction</span>
          </button>
        </div>
      </div>

      {/* PRIORITY 12: WHAT-IF AI SIMULATION SANDBOX */}
      <div className="w-full bg-surface-container rounded-xl p-hud-pad-md flex flex-col gap-hud-pad-md shadow-md">
        {/* Header with Baseline & Dynamic ETA */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-hud-pad-xs text-primary">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
              <span className="font-headline-md text-headline-md tracking-tight">AI Flight Sandbox</span>
            </div>
            <span className="font-label-code text-label-code text-on-surface-variant">
              CASCADE VARIANCE PREDICTION ENGINE
            </span>
          </div>

          {/* ETA Metric Display */}
          <div className="flex items-center gap-hud-pad-sm bg-surface-container-low px-hud-pad-sm py-hud-pad-xs rounded-lg">
            <div className="flex flex-col items-end">
              <span className="font-label-code text-label-code text-on-surface-variant">SCHED ETA</span>
              <span className="font-telemetry-md text-telemetry-md text-on-surface">18:40</span>
            </div>
            <div className="h-6 w-px bg-surface-variant"></div>
            <div className="flex flex-col items-start">
              <span className="font-label-code text-label-code text-secondary-fixed-dim">CURRENT AI</span>
              <span className="font-telemetry-md text-telemetry-md text-secondary-fixed-dim" id="display-eta">
                18:47
              </span>
            </div>
          </div>
        </div>

        {/* Scenario Selector Chips */}
        <div className="flex flex-col gap-hud-pad-xs">
          <span className="font-label-code text-label-code text-on-surface-variant uppercase">
            Tactical Presets
          </span>
          <div className="grid grid-cols-3 gap-hud-pad-xs">
            {presets.map((preset) => {
              const isSelected = selectedScenario === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`min-h-touch-target-min p-hud-pad-xs flex flex-col items-center justify-center rounded-lg transition-all text-center border ${
                    isSelected
                      ? 'bg-surface-container-highest border-primary text-on-surface ring-1 ring-primary'
                      : 'bg-surface-container-high border-transparent text-on-surface hover:bg-surface-bright'
                  } active:scale-95`}
                >
                  <span className="font-label-code text-label-code font-bold">{preset.name}</span>
                  <span
                    className={`font-body-sm text-body-sm ${
                      preset.colorType === 'error'
                        ? 'text-error'
                        : preset.colorType === 'secondary'
                        ? 'text-secondary-fixed-dim'
                        : 'text-tertiary'
                    }`}
                  >
                    {preset.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Slider Module */}
        <div className="bg-surface-container-low rounded-xl p-hud-pad-md flex flex-col gap-hud-pad-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-hud-pad-xs">
              <span className="material-symbols-outlined text-[18px] text-primary">linear_scale</span>
              <span className="font-body-md text-body-md font-medium text-on-surface">
                Simulate Halt Duration:
              </span>
            </div>
            <span
              className="font-telemetry-md text-telemetry-md text-primary font-bold px-2 py-0.5 bg-surface-container-highest rounded"
              id="slider-val-badge"
            >
              +{haltMinutes} min
            </span>
          </div>

          {/* Native Range Slider */}
          <div className="flex items-center gap-hud-pad-sm">
            <span className="font-label-code text-label-code text-on-surface-variant">0m</span>
            <input
              className="w-full accent-primary h-2 bg-surface-variant rounded-lg cursor-pointer"
              id="hold-slider"
              max="25"
              min="0"
              step="1"
              type="range"
              value={haltMinutes}
              onChange={handleSliderChange}
            />
            <span className="font-label-code text-label-code text-on-surface-variant">25m</span>
          </div>

          {/* Projection Impact Box */}
          <div className="bg-surface-container-lowest p-hud-pad-sm rounded-lg flex items-center justify-between">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                Predicted Impact
              </span>
              <span className="font-body-sm text-body-sm text-on-surface truncate" id="impact-detail">
                {selectedScenario
                  ? presets.find((p) => p.id === selectedScenario)?.desc
                  : currentImpact(haltMinutes)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-label-code text-label-code text-on-surface-variant">SIM ETA</span>
              <span
                className={`font-telemetry-md text-telemetry-md font-bold ${
                  haltMinutes === 0
                    ? 'text-tertiary'
                    : haltMinutes < 7
                    ? 'text-secondary-fixed-dim'
                    : 'text-error'
                }`}
                id="sim-eta-tag"
              >
                {simInfo.eta} ({simInfo.delta})
              </span>
            </div>
          </div>
        </div>

        {/* Cascade Rail Chart: Train Path Displacement */}
        <div className="flex flex-col gap-hud-pad-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              Sectional Train Displacement Vector
            </span>
            <span className="font-label-code text-label-code text-tertiary font-semibold">SAFE INTERLOCK</span>
          </div>

          {/* Inline SVG Vector Displacement */}
          <div className="w-full bg-surface-container-lowest rounded-lg p-2 flex flex-col justify-center">
            <svg
              className="w-full h-24"
              fill="none"
              viewBox="0 0 340 90"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Horizontal track guidelines */}
              <line stroke="#313540" strokeDasharray="3 3" strokeWidth="1" x1="10" x2="330" y1="20" y2="20"></line>
              <line stroke="#313540" strokeDasharray="3 3" strokeWidth="1" x1="10" x2="330" y1="45" y2="45"></line>
              <line stroke="#313540" strokeDasharray="3 3" strokeWidth="1" x1="10" x2="330" y1="70" y2="70"></line>

              {/* Label tracks */}
              <text fill="#869397" fontFamily="JetBrains Mono" fontSize="8" x="12" y="16">
                UP MAIN (12626 EXP)
              </text>
              <text fill="#869397" fontFamily="JetBrains Mono" fontSize="8" x="12" y="41">
                DOWN MAIN (96301 SUB)
              </text>
              <text fill="#869397" fontFamily="JetBrains Mono" fontSize="8" x="12" y="66">
                PALASDARI SIDING
              </text>

              {/* Baseline curve (Primary Express) */}
              <path
                d="M 60 20 C 120 20, 160 20, 240 20 L 320 20"
                id="svg-express-path"
                stroke="#4cd7f6"
                strokeLinecap="round"
                strokeWidth="3"
              ></path>

              {/* Local crossing interference vector */}
              <path
                d="M 140 45 C 170 45, 190 70, 260 70 L 320 70"
                stroke="#ffb95f"
                strokeDasharray="4 2"
                strokeWidth="2"
              ></path>

              {/* Interactive Node point on Express */}
              <circle
                className="transition-all duration-300"
                cx={160 + haltMinutes * 2.5}
                cy="20"
                fill={nodeColor}
                id="svg-delay-node"
                r="5"
              ></circle>
              <text
                fill={nodeColor}
                fontFamily="JetBrains Mono"
                fontSize="9"
                fontWeight="bold"
                id="svg-delay-text"
                x={170 + haltMinutes * 2.5}
                y="16"
              >
                {nodeText}
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* PRIORITY 14: OFFLINE PROTOCOL STATUS */}
      <div className="w-full bg-surface-container rounded-xl p-hud-pad-md flex flex-col gap-hud-pad-sm shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
            <span className="font-headline-md text-headline-md text-tertiary tracking-tight">
              Autonomous Offline Engine
            </span>
          </div>
          <span className="font-label-code text-label-code text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
            100% READY
          </span>
        </div>

        <div className="bg-surface-container-low p-hud-pad-sm rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-hud-pad-sm">
            <span className="material-symbols-outlined text-[24px] text-tertiary">memory</span>
            <div className="flex flex-col">
              <span className="font-body-md text-body-md font-semibold text-on-surface">
                Neural Track Network Cached
              </span>
              <span className="font-label-code text-label-code text-on-surface-variant">
                Zero-connectivity edge inference active
              </span>
            </div>
          </div>
          <span className="font-label-code text-label-code text-tertiary font-bold bg-surface-container-highest px-2 py-1 rounded">
            EDGE v4.8
          </span>
        </div>

        {/* Cached Checkmark Telemetry Inventory */}
        <div className="grid grid-cols-2 gap-hud-pad-xs pt-1">
          <div className="flex items-center gap-hud-pad-xs bg-surface-container-lowest p-hud-pad-sm rounded-lg">
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
            <div className="flex flex-col">
              <span className="font-telemetry-md text-telemetry-md font-bold text-on-surface">142</span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                Signals Cached
              </span>
            </div>
          </div>

          <div className="flex items-center gap-hud-pad-xs bg-surface-container-lowest p-hud-pad-sm rounded-lg">
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
            <div className="flex flex-col">
              <span className="font-telemetry-md text-telemetry-md font-bold text-on-surface">38</span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                Curves Profiled
              </span>
            </div>
          </div>

          <div className="flex items-center gap-hud-pad-xs bg-surface-container-lowest p-hud-pad-sm rounded-lg">
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
            <div className="flex flex-col">
              <span className="font-telemetry-md text-telemetry-md font-bold text-on-surface">14</span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                TSR Slow Zones
              </span>
            </div>
          </div>

          <div className="flex items-center gap-hud-pad-xs bg-surface-container-lowest p-hud-pad-sm rounded-lg">
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
            <div className="flex flex-col">
              <span className="font-telemetry-md text-telemetry-md font-bold text-on-surface">12</span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase">
                Stations &amp; Loops
              </span>
            </div>
          </div>
        </div>

        {/* Gradient Vector Contour Assurance */}
        <div className="bg-surface-container-lowest p-hud-pad-sm rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-hud-pad-xs">
            <span className="material-symbols-outlined text-tertiary text-[16px]">landscape</span>
            <span className="font-label-code text-label-code text-on-surface">
              Complete Gradient Contour Mesh
            </span>
          </div>
          <span className="font-label-code text-label-code text-tertiary font-bold uppercase">
            SYNCD: 1:37 INCLINE
          </span>
        </div>
      </div>
    </div>
  );
};
