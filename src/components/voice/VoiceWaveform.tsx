import React from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  color?: string;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isActive,
  color = 'bg-emerald-500',
}) => {
  return (
    <div className="flex items-center justify-center space-x-1.5 h-12 py-2">
      {[40, 75, 100, 60, 90, 45, 80, 55, 95, 50].map((height, i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full transition-all duration-300 ${color} ${
            isActive ? 'animate-pulse' : 'opacity-30'
          }`}
          style={{
            height: isActive ? `${Math.max(16, height * 0.45)}px` : '6px',
            animationDelay: `${i * 90}ms`,
            animationDuration: '700ms',
          }}
        />
      ))}
    </div>
  );
};
