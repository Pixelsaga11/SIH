import React, { useState } from 'react';

interface LocoEmblemProps {
  className?: string;
}

export const LocoEmblem: React.FC<LocoEmblemProps> = ({ className = "h-8 w-auto object-contain" }) => {
  const [loadFailed, setLoadFailed] = useState(false);

  const hotlinkUrl = "https://lh3.googleusercontent.com/aida/AEtjO1VIqo9QekMydgicIhw2ymfiTvcU_FfJmnlrPq1s8t_xBWB5xpOiOE_453URtlu9tH5keoFKcllk_0cWdxcvUkV9A8qyF5mIZW9-k_UO1psTtu5X93XAT09S1bObZY-e1mQA_4uzi2G3YKY69_14TlPCADN8vIaV4zX-vmZ1ipIKtD9HLgJzU34hGAJ613oSeRZEpHV_d50ZRYS0E66iBk5fbrSx7ZKzDeoOmD9a3IVrSdfdSKYe0rzckZs";

  if (!loadFailed) {
    return (
      <img
        src={hotlinkUrl}
        alt="LocoPilot AI Emblem"
        className={className}
        onError={() => setLoadFailed(true)}
      />
    );
  }

  // High fidelity vector fallback matching the icon in Image 1/2
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#0A111C" stroke="#004e5c" strokeWidth="3" />
      {/* Cowcatcher track guidance */}
      <path d="M 28 72 L 50 84 L 72 72" stroke="#ee9800" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 28 75 L 72 75" stroke="#4cd7f6" strokeWidth="2" strokeDasharray="3 3" />
      {/* Train Cab Outline */}
      <path
        d="M 33 66 C 30 66 28 64 28 60 L 33 26 C 35 20 40 18 50 18 C 60 18 65 20 67 26 L 72 60 C 72 64 70 66 67 66 Z"
        stroke="#4cd7f6"
        strokeWidth="4"
        fill="#0f131d"
      />
      {/* Side wings */}
      <line x1="22" y1="60" x2="30" y2="60" stroke="#4cd7f6" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="70" y1="60" x2="78" y2="60" stroke="#4cd7f6" strokeWidth="3.5" strokeLinecap="round" />
      {/* Windshield */}
      <path
        d="M 38 31 C 38 30 39 29 41 29 L 59 29 C 61 29 62 30 62 31 L 64 47 C 64 48 63 49 61 49 L 39 49 C 37 49 36 48 36 47 Z"
        stroke="#4cd7f6"
        strokeWidth="2.5"
        fill="#171b26"
      />
      {/* Top Beacon Red */}
      <circle cx="50" cy="27" r="3" fill="#ff5252" />
      {/* Headlights Amber */}
      <circle cx="40" cy="57" r="4.5" fill="#ee9800" />
      <circle cx="60" cy="57" r="4.5" fill="#ee9800" />
    </svg>
  );
};
