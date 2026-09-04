import React, { useState } from 'react';
import { AssetCategory, AssetDiagnostic, MetricSummary } from '../../types';

interface TrackAndBridgesScreenProps {
  assets: AssetDiagnostic[];
  metrics: MetricSummary;
  onTriggerAction: (message: string) => void;
  onOpenCreateWorkorder: () => void;
  onOpenDispatchSquad: () => void;
  onOpenSafetyLog: () => void;
}

export const TrackAndBridgesScreen: React.FC<TrackAndBridgesScreenProps> = ({
  assets,
  metrics,
  onTriggerAction,
  onOpenCreateWorkorder,
  onOpenDispatchSquad,
  onOpenSafetyLog,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('all');
  const [activeActions, setActiveActions] = useState<Record<string, boolean>>({});

  const handleActionClick = (actionId: string, msg: string) => {
    setActiveActions((prev) => ({ ...prev, [actionId]: true }));
    onTriggerAction(msg);
  };

  const filteredAssets = assets.filter((asset) => {
    if (selectedCategory === 'all') return true;
    return asset.category === selectedCategory;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-3 sm:px-6 gap-6 pb-28 pt-2">
      {/* Interactive Header Banner & Telemetry Pulse */}
      <div className="flex flex-col gap-1 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#0566d9]/20 text-[#adc6ff] font-label-sm uppercase">
              Predictive Telemetry Engine v4.2
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
          </div>
          <span className="font-label-sm text-[#bcc9cd] uppercase tracking-wider">
            REFRESH: 2.4s
          </span>
        </div>
        <p className="font-body-sm text-[#bcc9cd] leading-relaxed">
          Continuous sensor matrix synthesis across vibration, optical fiber strain, acoustic signatures, and infrared scanners.
        </p>
      </div>

      {/* Asset Horizontal Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5" id="categoryTabs">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`category-btn shrink-0 px-3 py-1.5 rounded font-label-md uppercase tracking-wider transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#4cd7f6] text-[#003640] shadow-sm shadow-[#4cd7f6]/20 font-bold'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          All Assets
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('track')}
          className={`category-btn shrink-0 px-3 py-1.5 rounded font-label-md uppercase tracking-wider transition-all cursor-pointer ${
            selectedCategory === 'track'
              ? 'bg-[#4cd7f6] text-[#003640] shadow-sm shadow-[#4cd7f6]/20 font-bold'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          Track &amp; Rails
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('bridges')}
          className={`category-btn shrink-0 px-3 py-1.5 rounded font-label-md uppercase tracking-wider transition-all cursor-pointer ${
            selectedCategory === 'bridges'
              ? 'bg-[#4cd7f6] text-[#003640] shadow-sm shadow-[#4cd7f6]/20 font-bold'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          Bridges
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('loco')}
          className={`category-btn shrink-0 px-3 py-1.5 rounded font-label-md uppercase tracking-wider transition-all cursor-pointer ${
            selectedCategory === 'loco'
              ? 'bg-[#4cd7f6] text-[#003640] shadow-sm shadow-[#4cd7f6]/20 font-bold'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          Locos &amp; Coaches
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('ohe')}
          className={`category-btn shrink-0 px-3 py-1.5 rounded font-label-md uppercase tracking-wider transition-all cursor-pointer ${
            selectedCategory === 'ohe'
              ? 'bg-[#4cd7f6] text-[#003640] shadow-sm shadow-[#4cd7f6]/20 font-bold'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          OHE &amp; Power
        </button>
      </div>

      {/* Asset Health KPI Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Fleet Health */}
        <div className="flex flex-col p-3 rounded bg-[#0b1c30] shadow-sm justify-between border border-[#1b2b3f]/40">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[#bcc9cd] uppercase">Fleet Health</span>
            <span
              className="material-symbols-outlined text-[16px] text-[#4edea3]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-headline-lg-mobile text-[#d3e4fe]">{metrics.fleetHealth}%</span>
            <span className="font-label-sm text-[#4edea3]">NOMINAL</span>
          </div>
          <div className="w-full bg-[#102034] h-1 rounded overflow-hidden">
            <div className="bg-[#4edea3] h-full" style={{ width: `${metrics.fleetHealth}%` }}></div>
          </div>
        </div>

        {/* Track Anomaly Index */}
        <div className="flex flex-col p-3 rounded bg-[#0b1c30] shadow-sm justify-between border border-[#1b2b3f]/40">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[#bcc9cd] uppercase">Track Anomalies</span>
            <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">priority_high</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-headline-lg-mobile text-[#ffb4ab]">{metrics.trackAnomalies}</span>
            <span className="font-label-sm text-[#ffb4ab]">CRITICAL</span>
          </div>
          <div className="w-full bg-[#102034] h-1 rounded overflow-hidden">
            <div className="bg-[#ffb4ab] h-full w-[72%]"></div>
          </div>
        </div>

        {/* Bridges Under Watch */}
        <div className="flex flex-col p-3 rounded bg-[#0b1c30] shadow-sm justify-between border border-[#1b2b3f]/40">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[#bcc9cd] uppercase">Bridges Watch</span>
            <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">domain</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-headline-lg-mobile text-[#d3e4fe]">
              {String(metrics.bridgesWatch).padStart(2, '0')}
            </span>
            <span className="font-label-sm text-[#adc6ff]">ACTIVE</span>
          </div>
          <div className="w-full bg-[#102034] h-1 rounded overflow-hidden">
            <div className="bg-[#adc6ff] h-full w-[38%]"></div>
          </div>
        </div>

        {/* Urgent Workorders */}
        <div className="flex flex-col p-3 rounded bg-[#0b1c30] shadow-sm justify-between border border-[#1b2b3f]/40">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[#bcc9cd] uppercase">Urgent WOs</span>
            <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">engineering</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-headline-lg-mobile text-[#4cd7f6]">
              {String(metrics.urgentWOs).padStart(2, '0')}
            </span>
            <span className="font-label-sm text-[#bcc9cd]">DISPATCH</span>
          </div>
          <div className="w-full bg-[#102034] h-1 rounded overflow-hidden">
            <div className="bg-[#4cd7f6] h-full w-[50%]"></div>
          </div>
        </div>
      </div>

      {/* Section Divider / Quick Insight Label */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">radar</span>
          <span className="font-label-md uppercase tracking-wider text-[#d3e4fe]">
            Telemetry Diagnostics
          </span>
        </div>
        <span className="font-label-sm text-[#bcc9cd]">
          {filteredAssets.length} High Priority Items
        </span>
      </div>

      {/* ASSET CARDS LIST */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredAssets.map((asset) => {
          return (
            <div
              key={asset.id}
              className="asset-card flex flex-col rounded bg-[#102034] p-5 gap-3.5 shadow-md border border-[#1b2b3f]/60 hover:border-[#26364a] transition-all"
            >
              {/* Header info with Emergency Pulse & Risk Score */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-label-sm font-bold tracking-widest ${
                        asset.severityType === 'defect'
                          ? 'bg-[#93000a] text-[#ffdad6]'
                          : asset.severityType === 'caution'
                          ? 'bg-[#0566d9] text-[#e6ecff]'
                          : asset.severityType === 'warning'
                          ? 'bg-[#26364a] text-[#bcc9cd]'
                          : 'bg-[#1bbd85]/30 text-[#6ffbbe]'
                      }`}
                    >
                      {asset.severityLabel}
                    </span>
                    <span className="font-label-sm text-[#bcc9cd]">{asset.tag}</span>
                  </div>
                  <span className="font-title-md text-[#d3e4fe] mt-1 text-[15px] font-semibold">
                    {asset.title}
                  </span>
                  <span className="font-body-sm text-[#bcc9cd] text-[11px]">
                    {asset.subtitle}
                  </span>
                </div>

                {/* Radial Risk Meter (Inline SVG) */}
                {asset.riskScore !== undefined && (
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <div className="relative flex items-center justify-center w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#26364a]"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        <path
                          className={
                            asset.riskScore > 75
                              ? 'text-[#ffb4ab]'
                              : asset.riskScore > 50
                              ? 'text-[#adc6ff]'
                              : 'text-[#4cd7f6]'
                          }
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray={`${asset.riskScore}, 100`}
                          strokeLinecap="round"
                          strokeWidth="3.5"
                        />
                      </svg>
                      <span
                        className={`absolute font-label-sm font-bold ${
                          asset.riskScore > 75
                            ? 'text-[#ffb4ab]'
                            : asset.riskScore > 50
                            ? 'text-[#adc6ff]'
                            : 'text-[#4cd7f6]'
                        }`}
                      >
                        {asset.riskScore}%
                      </span>
                    </div>
                    <span className="font-label-sm text-[#bcc9cd] mt-0.5 uppercase text-[9px]">
                      {asset.riskLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Diagnostic Visual Image with Scrim (if present, like Bridge B-104) */}
              {asset.imageUrl && (
                <div className="relative w-full h-36 rounded overflow-hidden bg-[#000f21] border border-[#1b2b3f]">
                  <img
                    className="w-full h-full object-cover opacity-65 hover:opacity-85 transition-opacity"
                    src={asset.imageUrl}
                    alt={asset.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000f21] via-[#000f21]/40 to-transparent flex flex-col justify-end p-2.5">
                    <div className="flex items-center justify-between text-[#d3e4fe]">
                      {asset.imageCaptionMetrics?.map((cap, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span
                            className={`material-symbols-outlined text-[14px] ${
                              cap.variant === 'error' ? 'text-[#ffb4ab]' : 'text-[#adc6ff]'
                            }`}
                          >
                            {cap.icon}
                          </span>
                          <span
                            className={`font-label-sm ${
                              cap.variant === 'error' ? 'text-[#ffb4ab]' : 'text-[#d3e4fe]'
                            }`}
                          >
                            {cap.label}: {cap.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Diagnostic Micro-Feed / Sensor Details */}
              <div className="flex flex-col gap-1.5 bg-[#000f21] p-3 rounded border border-[#1b2b3f]/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`material-symbols-outlined text-[14px] ${
                        asset.severityType === 'defect' ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'
                      }`}
                    >
                      {asset.category === 'track'
                        ? 'graphic_eq'
                        : asset.category === 'bridges'
                        ? 'waves'
                        : asset.category === 'loco'
                        ? 'thermostat'
                        : 'bolt'}
                    </span>
                    <span className="font-label-sm text-[#bcc9cd] uppercase">
                      {asset.sensorTitle}
                    </span>
                  </div>

                  {asset.progressGauge && (
                    <span className="font-label-md text-[#ffb4ab] font-bold">
                      {asset.progressGauge.valueLabel}
                    </span>
                  )}
                </div>

                {asset.progressGauge && (
                  <div className="w-full bg-[#102034] h-1.5 rounded overflow-hidden my-1">
                    <div
                      className="bg-[#ffb4ab] h-full"
                      style={{ width: `${asset.progressGauge.percentage}%` }}
                    />
                  </div>
                )}

                <p className="font-body-sm text-[#d3e4fe] leading-relaxed">
                  {asset.sensorDescription}
                </p>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 gap-2 mt-1 pt-1.5 border-t border-[#1b2b3f]/60">
                  {asset.metrics.map((m, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="font-label-sm text-[#bcc9cd]">{m.label}</span>
                      <span
                        className={`font-label-md font-bold ${
                          m.variant === 'error'
                            ? 'text-[#ffb4ab]'
                            : m.variant === 'secondary'
                            ? 'text-[#adc6ff]'
                            : 'text-[#d3e4fe]'
                        }`}
                      >
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Additional contextual row for Bridge B-104 */}
                {asset.id === 'asset-bridge-104' && (
                  <div className="flex items-center justify-between text-[#bcc9cd] font-label-sm pt-1 border-t border-[#1b2b3f]/40">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">train</span>
                      <span>6 Coaching Trains in Corridor</span>
                    </div>
                    <span className="text-[#ffb4ab] font-medium">+14 min Project Delay</span>
                  </div>
                )}
              </div>

              {/* AI Prescribed Action Callout (e.g. Track T-408) */}
              {asset.aiMitigation && (
                <div className="flex flex-col gap-1 bg-[#1b2b3f]/60 p-3 rounded border border-[#26364a]/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#4cd7f6]">
                      <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                      <span className="font-label-sm font-bold uppercase">
                        {asset.aiMitigation.actionTitle}
                      </span>
                    </div>
                    <span className="font-label-sm text-[#4edea3]">
                      {asset.aiMitigation.estRepair}
                    </span>
                  </div>
                  <p className="font-body-sm text-[#d3e4fe] text-[11px] leading-relaxed">
                    {asset.aiMitigation.description}
                  </p>
                  <div className="flex items-center justify-between text-[#bcc9cd] font-label-sm pt-1 border-t border-[#26364a]/50">
                    <span>{asset.aiMitigation.cascadingDelayLabel}</span>
                    <span className="text-[#ffb4ab] font-bold">
                      {asset.aiMitigation.cascadingDelayValue}
                    </span>
                  </div>
                </div>
              )}

              {/* Derate Advisory Callout for Loco */}
              {asset.category === 'loco' && (
                <div className="flex items-center justify-between bg-[#1b2b3f]/40 p-2.5 rounded border border-[#26364a]">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[#bcc9cd]">DERATE ADVISORY</span>
                    <span className="font-label-md text-[#4cd7f6] font-bold">
                      Speed Derate to 65 km/h
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleActionClick(
                        'derate-loco-btn',
                        'Speed Derate 65 km/h transmitted to Loco #30411'
                      )
                    }
                    className={`px-3 py-1.5 rounded font-label-sm uppercase font-bold transition-all cursor-pointer ${
                      activeActions['derate-loco-btn']
                        ? 'bg-[#4edea3] text-[#003824]'
                        : 'bg-[#26364a] text-[#4cd7f6] hover:bg-[#4cd7f6] hover:text-[#003640]'
                    }`}
                  >
                    {activeActions['derate-loco-btn'] ? 'Derated' : 'Derate Loco'}
                  </button>
                </div>
              )}

              {/* Contextual Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {asset.actions.map((act) => {
                  const isDone = activeActions[act.id];
                  if (act.variant === 'secondary') {
                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => handleActionClick(act.id, act.doneMessage)}
                        className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded font-label-md uppercase tracking-wider transition-all cursor-pointer ${
                          isDone
                            ? 'bg-[#4edea3] text-[#003824] font-bold'
                            : 'bg-[#1b2b3f] hover:bg-[#adc6ff] hover:text-[#002e6a] text-[#adc6ff]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isDone ? 'check' : act.icon}
                        </span>
                        <span>{isDone ? 'Caution Order Transmitted' : act.label}</span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => handleActionClick(act.id, act.doneMessage)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded font-label-md uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 ${
                        isDone
                          ? 'bg-[#4edea3] text-[#003824] font-bold'
                          : act.primary
                          ? 'bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] font-bold'
                          : 'bg-[#1b2b3f] hover:bg-[#2a3a4f] text-[#d3e4fe]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isDone ? 'check' : act.icon}
                      </span>
                      <span>{isDone ? 'Executed' : act.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Event Feed & Empty States Container */}
      {filteredAssets.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded bg-[#0b1c30] gap-2 border border-[#1b2b3f]">
          <span className="material-symbols-outlined text-[36px] text-[#bcc9cd]">search_off</span>
          <span className="font-title-md text-[#d3e4fe]">No High-Risk Assets Found</span>
          <p className="font-body-sm text-[#bcc9cd] max-w-xs">
            No critical telemetry deviations exceed threshold parameters in this category.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="mt-2 px-3 py-1.5 rounded bg-[#4cd7f6] text-[#003640] font-label-md uppercase font-bold cursor-pointer"
          >
            Reset Category Filters
          </button>
        </div>
      )}

      {/* Persistent Sticky Tactical Operations Bar */}
      <div className="flex flex-col gap-2 p-3 rounded bg-[#0b1c30] shadow-lg border border-[#1b2b3f]">
        <div className="flex items-center justify-between pb-0.5">
          <span className="font-label-sm text-[#bcc9cd] uppercase tracking-wider">
            Mission Control Actions
          </span>
          <span className="font-label-sm text-[#4edea3] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4edea3]"></span>
            AUTHORITY: DISPATCHER-04
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onOpenCreateWorkorder}
            className="flex flex-col items-center justify-center p-2 rounded bg-[#1b2b3f] hover:bg-[#2a3a4f] text-[#d3e4fe] transition-colors gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">post_add</span>
            <span className="font-label-sm text-center leading-tight">Create Workorder</span>
          </button>

          <button
            type="button"
            onClick={onOpenDispatchSquad}
            className="flex flex-col items-center justify-center p-2 rounded bg-[#4cd7f6] text-[#003640] font-bold shadow-sm transition-transform active:scale-95 gap-1 hover:bg-[#acedff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">airport_shuttle</span>
            <span className="font-label-sm text-center leading-tight uppercase">Dispatch Squad</span>
          </button>

          <button
            type="button"
            onClick={onOpenSafetyLog}
            className="flex flex-col items-center justify-center p-2 rounded bg-[#1b2b3f] hover:bg-[#2a3a4f] text-[#d3e4fe] transition-colors gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#adc6ff]">
              assignment_turned_in
            </span>
            <span className="font-label-sm text-center leading-tight">Export Safety Log</span>
          </button>
        </div>
      </div>
    </div>
  );
};
