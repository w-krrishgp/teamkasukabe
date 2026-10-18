import React, { useState } from 'react';
import { Mic, Sparkles } from 'lucide-react';
import { VoiceMandiModal } from './VoiceMandiModal';
import { useLanguage } from '@/context/LanguageContext';

export const VoiceMandiButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <>
      {/* Floating Action Button strictly positioned on the RIGHT side above BottomNav (like Meta AI in WhatsApp) */}
      <div className="absolute bottom-20 right-4 z-40 sm:bottom-22 sm:right-5 group">
        
        {/* Subtle Ambient Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 opacity-70 blur-sm group-hover:opacity-100 animate-pulse transition duration-300" />

        {/* Circular Trigger Button */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Voice Mandi AI Assistant"
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-stone-900 via-stone-900 to-stone-800 border-2 border-emerald-400/80 text-white shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
        >
          {/* Inner Iridescent Ring Effect */}
          <div className="absolute inset-0.5 rounded-full border border-teal-300/40" />

          {/* Icon with AI Sparkle */}
          <div className="relative flex items-center justify-center">
            <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
            <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1 animate-ping" />
          </div>

          {/* Micro Dialect Pill Indicator */}
          <span className="absolute -bottom-1 -right-1 text-[9px] font-black tracking-wider uppercase px-1.5 py-0.2 rounded-full bg-emerald-600 text-white border border-stone-900 shadow">
            {language === 'hi' ? 'बोलें' : 'AI'}
          </span>
        </button>

        {/* Floating Tooltip Label (Points inward towards screen from the right) */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-2.5 py-1 rounded-lg bg-stone-900/95 border border-stone-700 text-white text-xs font-bold whitespace-nowrap shadow-xl pointer-events-none transition-all">
          <span>{language === 'hi' ? '🎙️ बोलकर भाव पूछें' : '🎙️ Voice Mandi'}</span>
        </div>
      </div>

      {/* Voice Assistant Bottom Sheet Modal */}
      <VoiceMandiModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
