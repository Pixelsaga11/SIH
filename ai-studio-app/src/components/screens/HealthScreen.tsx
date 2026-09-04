import React, { useState } from 'react';

interface HealthScreenProps {
  onTriggerAction: (msg: string) => void;
}

export const HealthScreen: React.FC<HealthScreenProps> = ({ onTriggerAction }) => {
  const [activeTab, setActiveTab] = useState<'bearings' | 'strain' | 'bridges' | 'pantograph'>('bearings');
  const [runningCalibration, setRunningCalibration] = useState(false);

  const handleRunCalibration = () => {
    setRunningCalibration(true);
    setTimeout(() => {
      setRunningCalibration(false);
      onTriggerAction('All 128 Trackside Fiber Array Sensors Re-calibrated (Nominal Baseline Locked)');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-3 sm:px-6 gap-6 pb-28 pt-2">
      {/* Header */}
      <div className="flex flex-col gap-1 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#0566d9]/20 text-[#adc6ff] font-label-sm uppercase">
              Infrastructure &amp; Rolling Stock Health Matrix
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
          </div>
          <span className="font-label-sm text-[#4cd7f6]">SAMPLING: 250 Hz FFT</span>
        </div>
        <p className="font-body-sm text-[#bcc9cd]">
          Multi-channel telemetry telemetry: Hotbox bearing thermography, Wheel Impact Load Detector (WILD), and sub-surface acoustic transducers.
        </p>
      </div>

      {/* Sensor Channel Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setActiveTab('bearings')}
          className={`px-3 py-1.5 rounded font-label-md uppercase transition-all cursor-pointer ${
            activeTab === 'bearings'
              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          Hotbox Bearings (Loco #30411)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('strain')}
          className={`px-3 py-1.5 rounded font-label-md uppercase transition-all cursor-pointer ${
            activeTab === 'strain'
              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          Acoustic Strain (Track T-408)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bridges')}
          className={`px-3 py-1.5 rounded font-label-md uppercase transition-all cursor-pointer ${
            activeTab === 'bridges'
              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          Bridge Scour (B-104)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pantograph')}
          className={`px-3 py-1.5 rounded font-label-md uppercase transition-all cursor-pointer ${
            activeTab === 'pantograph'
              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
              : 'bg-[#1b2b3f] text-[#bcc9cd] hover:text-[#d3e4fe]'
          }`}
        >
          OHE Pantograph Wire
        </button>
      </div>

      {/* Diagnostic Cluster View based on tab */}
      {activeTab === 'bearings' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded bg-[#102034] border border-[#1b2b3f] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-[#ffb4ab] font-bold uppercase tracking-wider">
                  HOTBOX INFRARED SIGNATURE • BOGIE 2 AXLE #4
                </span>
                <h4 className="font-headline-sm text-base text-[#d3e4fe] mt-0.5">
                  Loco WAP-7 #30411 (Train 12345 CSMT-NZM Rajdhani)
                </h4>
              </div>
              <div className="text-right">
                <span className="font-headline-lg-mobile text-[#ffb4ab]">78°C</span>
                <span className="font-label-sm text-[#ffb4ab] block">+14°C Ambient Delta</span>
              </div>
            </div>

            {/* Thermal Sensor Bar Chart representation */}
            <div className="flex flex-col gap-1.5 bg-[#000f21] p-3 rounded border border-[#1b2b3f]">
              <span className="font-label-sm text-[#bcc9cd] uppercase">Axle Journal Temperature Spectrum</span>
              <div className="grid grid-cols-6 gap-2 pt-2 items-end h-28">
                {[
                  { axle: 'Axle 1 (L)', temp: 48, status: 'NOMINAL' },
                  { axle: 'Axle 1 (R)', temp: 49, status: 'NOMINAL' },
                  { axle: 'Axle 2 (L)', temp: 52, status: 'NOMINAL' },
                  { axle: 'Axle 2 (R)', temp: 51, status: 'NOMINAL' },
                  { axle: 'Axle 3 (L)', temp: 54, status: 'NOMINAL' },
                  { axle: 'Axle 4 (R)', temp: 78, status: 'ELEVATED' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center h-full justify-end gap-1">
                    <span className="text-[10px] font-mono text-[#bcc9cd]">{item.temp}°C</span>
                    <div
                      className={`w-full rounded-t transition-all ${
                        item.status === 'ELEVATED' ? 'bg-[#ffb4ab] animate-pulse' : 'bg-[#4edea3]'
                      }`}
                      style={{ height: `${(item.temp / 85) * 100}%` }}
                    />
                    <span className="text-[9px] font-mono text-[#bcc9cd] line-clamp-1">{item.axle}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-[#bcc9cd] pt-1">
              <div className="p-2 rounded bg-[#0b1c30] border border-[#1b2b3f]">
                <span className="font-label-sm text-[#869397]">TRACKSIDE SCANNER</span>
                <div className="text-[#d3e4fe] font-bold mt-0.5">Kalyan North Post #4</div>
              </div>
              <div className="p-2 rounded bg-[#0b1c30] border border-[#1b2b3f]">
                <span className="font-label-sm text-[#869397]">BEARING SEIZURE PROB</span>
                <div className="text-[#ffb4ab] font-bold mt-0.5">42% (Critical Warning)</div>
              </div>
              <div className="p-2 rounded bg-[#0b1c30] border border-[#1b2b3f] col-span-2 sm:col-span-1">
                <span className="font-label-sm text-[#869397]">CURRENT SPEED RESTRICTION</span>
                <div className="text-[#4cd7f6] font-bold mt-0.5">Derated to 65 km/h</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'strain' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded bg-[#102034] border border-[#1b2b3f] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-[#ffb4ab] font-bold uppercase tracking-wider">
                  FIBER-OPTIC BRAGG GRATING (FBG) SENSOR ARRAY
                </span>
                <h4 className="font-headline-sm text-base text-[#d3e4fe] mt-0.5">
                  Track T-408: Weld Joint #44 (Km 118.4 Bhor Ghat)
                </h4>
              </div>
              <div className="text-right">
                <span className="font-headline-lg-mobile text-[#ffb4ab]">+3.2 mm</span>
                <span className="font-label-sm text-[#ffb4ab] block">Max Permitted: 1.8mm</span>
              </div>
            </div>

            {/* Acoustic FFT Frequency Waveform simulation */}
            <div className="bg-[#000f21] p-3 rounded border border-[#1b2b3f]">
              <div className="flex items-center justify-between text-xs font-mono text-[#bcc9cd] pb-2">
                <span>ACOUSTIC EMISSION FREQUENCY (kHz)</span>
                <span className="text-[#ffb4ab] font-bold">14.2 kHz RESONANT SPIKE</span>
              </div>
              <div className="flex items-end gap-1 h-24 pt-2">
                {[12, 18, 22, 19, 24, 30, 42, 68, 92, 85, 48, 32, 28, 20, 16, 22, 35, 29, 21].map(
                  (val, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t ${
                        val > 70 ? 'bg-[#ffb4ab] animate-pulse' : val > 40 ? 'bg-[#adc6ff]' : 'bg-[#26364a]'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  )
                )}
              </div>
            </div>

            <p className="font-body-sm text-[#bcc9cd] leading-relaxed">
              Rayleigh wave acoustic backscatter indicates progressive micro-shear stress under 25-tonne heavy freight axle repetition. Ultrasonic test confirm hairline fissure depth 4.8mm.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'bridges' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded bg-[#102034] border border-[#1b2b3f] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-[#adc6ff] font-bold uppercase tracking-wider">
                  HYDROLOGICAL TURBULENCE &amp; SCOUR MONITOR
                </span>
                <h4 className="font-headline-sm text-base text-[#d3e4fe] mt-0.5">
                  Bridge B-104: Pier #3 (Ulhas River Viaduct)
                </h4>
              </div>
              <div className="text-right">
                <span className="font-headline-lg-mobile text-[#adc6ff]">1.8m</span>
                <span className="font-label-sm text-[#adc6ff] block">Scour Depth</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-[#bcc9cd]">
              <div className="p-2.5 rounded bg-[#0b1c30] border border-[#1b2b3f]">
                <span className="font-label-sm text-[#869397]">WATER DISCHARGE</span>
                <div className="text-[#d3e4fe] font-bold mt-1">1,480 m³/s</div>
              </div>
              <div className="p-2.5 rounded bg-[#0b1c30] border border-[#1b2b3f]">
                <span className="font-label-sm text-[#869397]">RIVER BED VELOCITY</span>
                <div className="text-[#d3e4fe] font-bold mt-1">3.4 m/s</div>
              </div>
              <div className="p-2.5 rounded bg-[#0b1c30] border border-[#1b2b3f]">
                <span className="font-label-sm text-[#869397]">RESONANT FREQUENCY</span>
                <div className="text-[#ffb4ab] font-bold mt-1">4.2 Hz (Limit 4.5)</div>
              </div>
              <div className="p-2.5 rounded bg-[#0b1c30] border border-[#1b2b3f]">
                <span className="font-label-sm text-[#869397]">UNDERWATER SONAR</span>
                <div className="text-[#4edea3] font-bold mt-1">ACTIVE SCANNING</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pantograph' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded bg-[#102034] border border-[#1b2b3f] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-[#4edea3] font-bold uppercase tracking-wider">
                  OHE 25 kV AC CATENARY &amp; PANTOGRAPH WEAR
                </span>
                <h4 className="font-headline-sm text-base text-[#d3e4fe] mt-0.5">
                  Overhead Contact Wire Feeder Section SEC-09
                </h4>
              </div>
              <div className="text-right">
                <span className="font-headline-lg-mobile text-[#ffb4ab]">28%</span>
                <span className="font-label-sm text-[#ffb4ab] block">Residual Life</span>
              </div>
            </div>

            <div className="w-full bg-[#000f21] p-3 rounded border border-[#1b2b3f] flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono text-[#bcc9cd]">
                <span>Contact Wire Thickness (Nominal 12.2mm)</span>
                <span className="text-[#ffb4ab] font-bold">Current: 8.4mm</span>
              </div>
              <div className="w-full bg-[#1b2b3f] h-2 rounded overflow-hidden">
                <div className="bg-[#ffb4ab] h-full w-[28%]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sensor Calibration & Diagnostic Controls */}
      <div className="p-4 rounded bg-[#102034] border border-[#1b2b3f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">tune</span>
          <div>
            <div className="font-headline-sm text-sm text-[#d3e4fe]">
              Sensor Array Synchronization &amp; Calibration
            </div>
            <div className="text-[11px] text-[#bcc9cd]">
              Verify optical time-domain reflectometer (OTDR) baseline across 128 fiber gratings
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={runningCalibration}
          onClick={handleRunCalibration}
          className="px-4 py-2 rounded bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] font-label-sm font-bold uppercase transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {runningCalibration ? 'Calibrating Sensors...' : 'Run Diagnostics Calibration'}
        </button>
      </div>
    </div>
  );
};
