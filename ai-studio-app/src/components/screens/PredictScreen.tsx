import React, { useState } from 'react';

interface PredictScreenProps {
  onTriggerAction: (msg: string) => void;
}

export const PredictScreen: React.FC<PredictScreenProps> = ({ onTriggerAction }) => {
  const [selectedScenario, setSelectedScenario] = useState<'tsr30' | 'tsr50' | 'unrestricted'>('tsr30');

  const getScenarioData = () => {
    switch (selectedScenario) {
      case 'tsr30':
        return {
          delay: '+6.5 min',
          rulHours: '72+ Hours (Stable)',
          stressDrop: '-42% Micro-Strain',
          riskLevel: 'LOW (MITIGATED)',
          riskColor: 'text-[#4edea3]',
          description: 'Fishplate clamp applied, speed reduced to 30 km/h. Dynamic impact force reduced from 210 kN to 122 kN.',
        };
      case 'tsr50':
        return {
          delay: '+3.2 min',
          rulHours: '24 Hours (Marginal)',
          stressDrop: '-18% Micro-Strain',
          riskLevel: 'MODERATE',
          riskColor: 'text-[#adc6ff]',
          description: 'Partial speed reduction. Micro-shear continues creeping at 0.12 mm/hour. Secondary inspection required.',
        };
      case 'unrestricted':
        return {
          delay: '0.0 min',
          rulHours: '18 Hours (CRITICAL FRACTURE)',
          stressDrop: '0% (Full Impact)',
          riskLevel: '94% RAIL BREAK RISK',
          riskColor: 'text-[#ffb4ab]',
          description: 'Catastrophic rail web fracture probability exceeds 94% under repetitive 25-tonne heavy container rake passes.',
        };
    }
  };

  const current = getScenarioData();

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-3 sm:px-6 gap-6 pb-28 pt-2">
      {/* Header */}
      <div className="flex flex-col gap-1 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#0566d9]/20 text-[#adc6ff] font-label-sm uppercase">
              Predictive Telemetry Engine v4.2
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
          </div>
          <span className="font-label-sm text-[#4cd7f6]">AI INFERENCE CONFIDENCE: 98.4%</span>
        </div>
        <p className="font-body-sm text-[#bcc9cd]">
          Physics-informed neural networks (PINN) simulating structural degradation, fracture mechanics, and network delay cascades.
        </p>
      </div>

      {/* What-If Scenario Simulator */}
      <div className="p-4 rounded bg-[#102034] border border-[#1b2b3f] flex flex-col gap-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">psychology</span>
            <h4 className="font-headline-sm text-base text-[#d3e4fe]">
              Interactive Mitigation &amp; Cascading Delay Simulator
            </h4>
          </div>
          <span className="font-label-sm text-[#bcc9cd]">TARGET: TRACK T-408</span>
        </div>

        {/* Scenario Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedScenario('tsr30')}
            className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
              selectedScenario === 'tsr30'
                ? 'bg-[#000f21] border-[#4cd7f6] text-[#4cd7f6]'
                : 'bg-[#0b1c30] border-[#1b2b3f] text-[#bcc9cd] hover:border-[#26364a]'
            }`}
          >
            <div className="font-label-sm font-bold uppercase">Scenario A (AI Recommended)</div>
            <div className="text-xs font-semibold text-[#d3e4fe] mt-0.5">Impose TSR 30 km/h</div>
            <div className="text-[10px] text-[#4edea3] mt-0.5">Safe RUL +72h</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedScenario('tsr50')}
            className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
              selectedScenario === 'tsr50'
                ? 'bg-[#000f21] border-[#4cd7f6] text-[#4cd7f6]'
                : 'bg-[#0b1c30] border-[#1b2b3f] text-[#bcc9cd] hover:border-[#26364a]'
            }`}
          >
            <div className="font-label-sm font-bold uppercase">Scenario B (Moderate)</div>
            <div className="text-xs font-semibold text-[#d3e4fe] mt-0.5">Impose TSR 50 km/h</div>
            <div className="text-[10px] text-[#adc6ff] mt-0.5">RUL 24h Marginal</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedScenario('unrestricted')}
            className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
              selectedScenario === 'unrestricted'
                ? 'bg-[#000f21] border-[#ffb4ab] text-[#ffb4ab]'
                : 'bg-[#0b1c30] border-[#1b2b3f] text-[#bcc9cd] hover:border-[#26364a]'
            }`}
          >
            <div className="font-label-sm font-bold uppercase">Scenario C (No Restriction)</div>
            <div className="text-xs font-semibold text-[#ffdad6] mt-0.5">Full Speed 110 km/h</div>
            <div className="text-[10px] text-[#ffb4ab] mt-0.5">Fracture Risk 94%</div>
          </button>
        </div>

        {/* Projected Simulation Results */}
        <div className="mt-2 p-3.5 rounded bg-[#000f21] border border-[#1b2b3f] flex flex-col gap-2.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="flex flex-col">
              <span className="font-label-sm text-[#869397]">CASCADE DELAY</span>
              <span className="text-[#d3e4fe] font-bold text-sm mt-0.5">{current.delay}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-[#869397]">ESTIMATED RUL</span>
              <span className="text-[#d3e4fe] font-bold text-sm mt-0.5">{current.rulHours}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-[#869397]">AXLE STRESS DROP</span>
              <span className="text-[#4edea3] font-bold text-sm mt-0.5">{current.stressDrop}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-[#869397]">RISK ASSESSMENT</span>
              <span className={`font-bold text-sm mt-0.5 ${current.riskColor}`}>{current.riskLevel}</span>
            </div>
          </div>

          <p className="font-body-sm text-[#bcc9cd] text-[11px] pt-1 border-t border-[#1b2b3f]/60 leading-relaxed">
            {current.description}
          </p>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() =>
                onTriggerAction(
                  `Simulation Model Enacted into Signal Interlock: ${
                    selectedScenario === 'tsr30'
                      ? 'TSR 30 km/h active'
                      : selectedScenario === 'tsr50'
                      ? 'TSR 50 km/h active'
                      : 'Unrestricted Speed Policy active'
                  }`
                )
              }
              className="px-3 py-1.5 rounded bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] font-label-sm font-bold uppercase transition-all cursor-pointer"
            >
              Enact Policy in Signaling
            </button>
          </div>
        </div>
      </div>

      {/* RUL Degradation Curve over 72h */}
      <div className="p-4 rounded bg-[#102034] border border-[#1b2b3f] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-label-md uppercase tracking-wider text-[#d3e4fe]">
            Structural RUL Degradation Curve (Next 72 Hours)
          </span>
          <span className="font-label-sm text-[#869397]">MONTE CARLO PROBABILITY</span>
        </div>

        {/* Visual degradation graph simulation */}
        <div className="relative w-full h-36 bg-[#000f21] rounded border border-[#1b2b3f] p-3 flex flex-col justify-between">
          <div className="flex justify-between text-[9px] font-mono text-[#869397]">
            <span>NOW (18h RUL)</span>
            <span>+24h (TSR 30 Active)</span>
            <span>+48h (Gang #12 Repaired)</span>
            <span>+72h (Nominal)</span>
          </div>

          <svg className="w-full h-24" viewBox="0 0 500 100" preserveAspectRatio="none">
            {/* Safe threshold horizontal line */}
            <line x1="0" y1="70" x2="500" y2="70" stroke="#93000a" strokeDasharray="3 3" strokeWidth="1" />
            <text x="10" y="66" fill="#ffb4ab" fontSize="8" fontFamily="JetBrains Mono">
              CRITICAL SAFETY THRESHOLD (1.8mm)
            </text>

            {/* Unmitigated Curve (Red plunging down) */}
            <path
              d="M 10 30 Q 150 40 250 85 T 320 98"
              fill="none"
              stroke="#ffb4ab"
              strokeWidth="2"
              strokeDasharray="4 2"
            />

            {/* Mitigated Curve (Cyan stabilizing and rising back up after repair) */}
            <path
              d="M 10 30 Q 100 35 200 36 T 320 20 T 490 10"
              fill="none"
              stroke="#4cd7f6"
              strokeWidth="2.5"
            />
          </svg>

          <div className="flex items-center justify-between text-[9px] font-mono text-[#bcc9cd]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#4cd7f6]"></span>
              <span>With AI Mitigation (TSR 30 + Fishplate)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#ffb4ab] border-dashed"></span>
              <span>Without Mitigation (Fracture imminent)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
