import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-24 left-4 right-4 max-w-lg mx-auto z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between p-3.5 rounded bg-[#26364a] text-[#d3e4fe] border border-[#4cd7f6]/40 shadow-2xl backdrop-blur-lg">
        <div className="flex items-center gap-3 pr-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#4cd7f6] animate-ping shrink-0" />
          <div className="flex flex-col">
            <span className="font-label-sm text-[#4cd7f6] font-bold uppercase tracking-wider">
              Interlock Command Executed
            </span>
            <span className="font-label-md text-[12px] font-semibold text-[#d3e4fe] leading-snug">
              {message}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[#bcc9cd] hover:text-[#d3e4fe] p-1 rounded hover:bg-[#1b2b3f] transition-colors"
          title="Dismiss"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
};
