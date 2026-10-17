import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileShellProps {
  children: ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false);

  return (
    <div className="w-full h-full max-h-[100dvh] sm:min-h-screen bg-harvest-cream sm:bg-[#EAEFE8] flex flex-col items-center justify-center text-[#132A13] overflow-hidden">
      {/* Desktop Quick Preview Bar (Hidden on mobile phones) */}
      <aside
        aria-label="Device Preview Bar"
        className="hidden lg:flex items-center justify-between w-full max-w-5xl px-6 py-2 text-xs text-stone-600 border-b border-stone-200 bg-[#F1F5EE] shrink-0"
      >
        <div className="flex items-center space-x-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>HarvestGuard • Android Architecture Mode</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>Viewport:</span>
          <button
            onClick={() => setDeviceFrameMode(false)}
            className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 transition-all ${
              !deviceFrameMode
                ? 'bg-harvest-primary text-white font-semibold shadow-xs'
                : 'hover:bg-black/5 text-stone-600'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Device (390px)</span>
          </button>
          <button
            onClick={() => setDeviceFrameMode(true)}
            className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 transition-all ${
              deviceFrameMode
                ? 'bg-harvest-primary text-white font-semibold shadow-xs'
                : 'hover:bg-black/5 text-stone-600'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Fluid Viewport</span>
          </button>
        </div>
      </aside>

      {/* Main Container: On mobile phones, this fills 100% width and 100dvh height with zero outer scroll */}
      <div
        className={`w-full flex flex-col bg-harvest-cream transition-all duration-200 overflow-hidden ${
          deviceFrameMode
            ? 'h-full sm:h-[94vh] sm:max-h-[900px] sm:max-w-2xl sm:my-3 sm:rounded-3xl sm:border sm:border-stone-200 sm:shadow-2xl'
            : 'h-full sm:h-[92vh] sm:max-h-[860px] sm:max-w-[412px] sm:my-4 sm:rounded-[36px] sm:border-[8px] sm:border-[#142318] sm:ring-1 sm:ring-black/15 sm:shadow-2xl'
        }`}
      >
        {/* Virtual Android Status Speaker (Desktop preview only) */}
        {!deviceFrameMode && (
          <div className="hidden sm:flex items-center justify-between px-6 py-1.5 bg-[#142318] text-white/80 text-[10px] tracking-wide select-none shrink-0">
            <span className="font-semibold">09:41</span>
            <div className="w-12 h-3.5 bg-black/60 rounded-full mx-auto" />
            <div className="flex items-center space-x-1">
              <span>5G</span>
              <div className="w-3 h-2 border border-white/80 rounded-xs p-[1px]">
                <div className="w-full h-full bg-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col w-full h-full overflow-hidden bg-harvest-cream relative">
          {children}
        </div>
      </div>
    </div>
  );
};
