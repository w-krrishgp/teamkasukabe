import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Volume2,
  VolumeX,
  X,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Key,
} from 'lucide-react';
import { useVoiceMandi } from '@/hooks/useVoiceMandi';
import { useLanguage } from '@/context/LanguageContext';
import { VoiceWaveform } from './VoiceWaveform';
import { getGeminiApiKey, saveGeminiApiKey, isGeminiActive } from '@/services/geminiService';

interface VoiceMandiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceMandiModal: React.FC<VoiceMandiModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [manualQuery, setManualQuery] = useState('');
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => getGeminiApiKey());
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const {
    isListening,
    isSpeaking,
    isGenerating,
    transcript,
    result,
    aiResponse,
    errorMessage,
    secondsRemaining,
    startListening,
    finalizeQuery,
    handleQueryText,
    speakResponse,
    stopSpeaking,
    selectQuickCrop,
    reset,
  } = useVoiceMandi(language);

  if (!isOpen) return null;

  const quickCrops = [
    { id: 'wheat', label: language === 'hi' ? '🌾 गेहूं (Unjha)' : '🌾 Wheat' },
    { id: 'mustard', label: language === 'hi' ? '🌼 सरसों (Rayda)' : '🌼 Mustard' },
    { id: 'cumin', label: language === 'hi' ? '🌿 जीरा (Jeera)' : '🌿 Cumin' },
    { id: 'tomato', label: language === 'hi' ? '🍅 टमाटर (Kadi)' : '🍅 Tomato' },
    { id: 'potato', label: language === 'hi' ? '🥔 आलू (Patan)' : '🥔 Potato' },
    { id: 'onion', label: language === 'hi' ? '🧅 प्याज (Nashik)' : '🧅 Onion' },
  ];

  const handleMainMicClick = () => {
    if (isListening) {
      if (transcript.trim()) {
        finalizeQuery();
      } else {
        startListening();
      }
    } else {
      startListening();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualQuery.trim()) {
      handleQueryText(manualQuery.trim());
      setManualQuery('');
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveGeminiApiKey(apiKeyInput);
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowKeyInput(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet / Modal Container */}
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in slide-in-from-bottom duration-300">
        
        {/* Glowing Top Ambient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

        {/* Header with Interactive Language Switcher & Gemini Key Button */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-stone-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>{language === 'hi' ? 'वॉइस मंडी व कृषि AI सहायक' : 'Voice Mandi & Farm AI'}</span>
                {isGeminiActive() && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Gemini Live
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-stone-400">
                {language === 'hi' ? 'मंडी भाव, खाद या मौसम का कोई भी सवाल बोलकर पूछें' : 'Speak to check live rates, crops or weather'}
              </p>
            </div>
          </div>

          {/* Interactive Language Switcher & Key */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Configure Gemini API Key"
            >
              <Key className="w-4 h-4" />
            </button>

            <div className="flex items-center bg-stone-950 p-0.5 rounded-full border border-stone-700/80 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setLanguage('hi');
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                🇮🇳 हिंदी
              </button>
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setLanguage('en');
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  language === 'en'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Gemini API Key Drawer */}
        {showKeyInput && (
          <form onSubmit={handleSaveKey} className="px-5 py-3 bg-stone-950 border-b border-stone-800 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between text-xs text-stone-300 font-bold">
              <span>{language === 'hi' ? 'Google Gemini API Key दर्ज करें:' : 'Configure Gemini API Key:'}</span>
              <span className="text-[10px] text-stone-500">Free from Google AI Studio</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                {language === 'hi' ? 'सेव' : 'Save'}
              </button>
            </div>
            {keySavedMessage && (
              <p className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'Gemini API Key सुरक्षित सेव हो गई!' : 'Gemini Key saved successfully!'}</span>
              </p>
            )}
          </form>
        )}

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {/* Animated Waveform & Central Mic Control */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
            
            {/* Animated Ambient Glow */}
            <div
              className={`absolute inset-0 bg-emerald-500/10 blur-2xl transition-opacity duration-500 ${
                isListening || isSpeaking ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div className="relative z-10 w-full space-y-2">
              <VoiceWaveform
                isActive={isListening || isSpeaking}
                color={isSpeaking ? 'bg-amber-400' : 'bg-emerald-400'}
              />

              <div className="text-xs font-semibold min-h-[22px] flex items-center justify-center">
                {isListening ? (
                  <span className="text-emerald-400 flex items-center justify-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold">
                      {language === 'hi'
                        ? `सुन रहा हूँ... बोलिए (${secondsRemaining}s)`
                        : `Listening... Speak now (${secondsRemaining}s)`}
                    </span>
                  </span>
                ) : isGenerating ? (
                  <span className="text-emerald-400 flex items-center justify-center space-x-1.5 font-bold animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'Gemini AI उत्तर तैयार कर रहा है...' : 'Gemini AI is analyzing...'}</span>
                  </span>
                ) : isSpeaking ? (
                  <span className="text-amber-300 flex items-center justify-center space-x-1.5 font-bold">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>{language === 'hi' ? 'उत्तर बोल रहा हूँ...' : 'Speaking answer...'}</span>
                  </span>
                ) : (
                  <span className="text-stone-300 font-medium">
                    {language === 'hi' ? 'माइक पर टैप करके भाव या कृषि सवाल पूछें' : 'Tap mic and ask any rate or farm question'}
                  </span>
                )}
              </div>

              {/* Large Central Microphone Button & Action Controls */}
              <div className="pt-2 flex items-center justify-center space-x-3">
                {isListening && transcript.trim() && (
                  <button
                    onClick={finalizeQuery}
                    className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'hi' ? 'खोजें ✓' : 'Done ✓'}</span>
                  </button>
                )}

                <button
                  onClick={handleMainMicClick}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isListening
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white scale-110 shadow-emerald-500/40 ring-4 ring-emerald-500/30 animate-pulse'
                      : 'bg-stone-800 text-stone-200 hover:bg-stone-700 hover:scale-105 active:scale-95'
                  }`}
                  aria-label="Toggle Voice Recording"
                >
                  <Mic className={`w-7 h-7 ${isListening ? 'text-white' : 'text-emerald-400'}`} />
                </button>

                {isListening && (
                  <button
                    onClick={() => reset()}
                    className="p-2.5 rounded-full bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 text-xs transition-colors"
                    title={language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Real-Time Live Transcript Display */}
          {transcript && (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl px-4 py-3 text-xs shadow-inner">
              <span className="text-emerald-400 font-bold block text-[11px] uppercase tracking-wider mb-1">
                {isListening
                  ? language === 'hi'
                    ? '🎙️ आपकी आवाज़ दर्ज हो रही है...'
                    : '🎙️ Live transcript:'
                  : language === 'hi'
                  ? 'आपने पूछा:'
                  : 'You asked:'}
              </span>
              <span className="text-white font-semibold text-sm italic">"{transcript}"</span>
            </div>
          )}

          {/* Gemini AI Spoken Advisory Card */}
          {aiResponse && (
            <div className="bg-gradient-to-br from-emerald-950/60 to-stone-900 border border-emerald-500/50 rounded-2xl p-4 shadow-xl space-y-2.5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {language === 'hi' ? 'हार्वेस्ट गार्ड AI कृषि उत्तर' : 'HarvestGuard AI Advisor Response'}
                  </span>
                </div>
                {aiResponse.isAiGenerated && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Powered by Gemini
                  </span>
                )}
              </div>

              <p className="text-white text-xs leading-relaxed font-medium">
                {aiResponse.displayText}
              </p>

              {/* Audio Controls */}
              <div className="pt-1 flex items-center space-x-2">
                <button
                  onClick={() =>
                    isSpeaking ? stopSpeaking() : speakResponse(aiResponse.spokenText)
                  }
                  className="flex items-center space-x-1.5 py-1.5 px-3 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                      <span>{language === 'hi' ? 'रोकें' : 'Stop Audio'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'दोबारा सुनें' : 'Listen Again'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Informative Guidance / Error Alert */}
          {errorMessage && (
            <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 text-xs text-amber-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{language === 'hi' ? 'माइक्रोफ़ोन संदेश:' : 'Microphone Notice:'}</span>
              </div>
              <p className="leading-relaxed text-[11px] text-amber-200/90">{errorMessage}</p>

              <div className="pt-1 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQueryText(language === 'hi' ? 'गेहूं का भाव' : 'Wheat price')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white font-bold text-[10px] hover:bg-emerald-500 transition-colors"
                >
                  🌾 {language === 'hi' ? 'गेहूं भाव पूछें' : 'Ask Wheat Rate'}
                </button>
                <button
                  type="button"
                  onClick={() => handleQueryText(language === 'hi' ? 'सरसों में सिंचाई और खाद सलाह' : 'Mustard fertilizer advice')}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-200 font-bold text-[10px] hover:bg-stone-700 transition-colors"
                >
                  🌼 {language === 'hi' ? 'सरसों खाद सलाह' : 'Mustard Advice'}
                </button>
              </div>
            </div>
          )}

          {/* Live Price Result Card (if crop matched) */}
          {result && (
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-3 relative overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl">{result.emoji}</span>
                  <div>
                    <h4 className="text-base font-extrabold text-white">
                      {language === 'hi' ? result.cropNameHi : result.cropNameEn}
                    </h4>
                    <p className="text-xs text-stone-400 font-medium">
                      📍 {result.mandi} • {result.district}
                    </p>
                  </div>
                </div>

                {/* Trend Badge */}
                <div
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    result.isPositive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {result.isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{result.change}</span>
                </div>
              </div>

              {/* Modal Price Highlight */}
              <div className="bg-stone-950/90 rounded-xl p-3 flex items-baseline justify-between border border-stone-800">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    {language === 'hi' ? 'औसत मॉडल भाव (Modal Rate)' : 'Modal Wholesale Price'}
                  </span>
                  <div className="text-2xl font-black text-emerald-400">
                    ₹ {result.modalRate.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-bold text-stone-400">/ क्विंटल</span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-stone-300">
                  <div>
                    <span className="text-stone-500">न्यूनतम:</span> ₹{result.minRate}
                  </div>
                  <div>
                    <span className="text-stone-500">अधिकतम:</span> ₹{result.maxRate}
                  </div>
                </div>
              </div>

              {/* Action Buttons inside Card */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/mandi-rates');
                  }}
                  className="w-full flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  <span>{language === 'hi' ? 'विस्तार से मंडी देखें' : 'Full Market View'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Instant Text Search Bar (Fallback if mic is muted / quiet) */}
          <form onSubmit={handleManualSubmit} className="relative">
            <input
              type="text"
              value={manualQuery}
              onChange={(e) => setManualQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'या सवाल टाइप करें (जैसे: गेहूं का भाव, सरसों में सिंचाई कब करें?)...'
                  : 'Or type query (e.g. Wheat rate, When to irrigate mustard?)...'
              }
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-emerald-400 transition-colors"
              aria-label="Search Crop"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Tap Suggestions */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              {language === 'hi' ? 'लोकप्रिय फसलों के तुरंत भाव देखें:' : 'Or Tap Popular Crops:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickCrops.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectQuickCrop(c.id)}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold border border-stone-700/60 transition-all active:scale-95"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Troubleshooting Helper */}
          <div className="pt-2 border-t border-stone-800/80">
            <button
              type="button"
              onClick={() => setShowTroubleshoot(!showTroubleshoot)}
              className="flex items-center justify-between w-full text-left text-[11px] font-semibold text-stone-400 hover:text-stone-200 transition-colors"
            >
              <div className="flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {language === 'hi'
                    ? 'माइक काम नहीं कर रहा? समाधान स्टेप्स देखें'
                    : 'Mic not hearing you? View quick fix steps'}
                </span>
              </div>
              {showTroubleshoot ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTroubleshoot && (
              <div className="mt-2.5 p-3 rounded-xl bg-stone-950/80 border border-stone-800 text-[11px] text-stone-300 space-y-2 leading-relaxed">
                <div className="font-bold text-emerald-400">
                  {language === 'hi' ? 'आवाज़ सुनने के 3 आसान समाधान:' : '3 Quick Fixes to enable Voice Mandi:'}
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-300">
                  <li>
                    <strong className="text-white">1. Browser Site Permission:</strong>{' '}
                    {language === 'hi'
                      ? 'ब्राउज़र के एड्रेस बार में लॉक/ट्यून (🔒) आइकॉन पर क्लिक करें और Microphone को "Allow" करें।'
                      : 'Click the site settings/lock icon in your address bar and toggle Microphone to "Allow".'}
                  </li>
                  <li>
                    <strong className="text-white">2. Windows Settings:</strong>{' '}
                    {language === 'hi'
                      ? 'Settings > Privacy & Security > Microphone में जाकर "Let apps access your microphone" ऑन रखें।'
                      : 'Ensure Windows Settings > Privacy & Security > Microphone access is turned ON.'}
                  </li>
                  <li>
                    <strong className="text-white">3. Phone Testing (Local Network):</strong>{' '}
                    {language === 'hi'
                      ? 'मोबाइल पर क्रोम केवल सुरक्षित HTTPS या Localhost पर माइक चालू करता है। फोन पर तुरंत टेस्ट करने के लिए ऊपर टेक्स्ट बॉक्स या किसी भी फसल पर टैप करें।'
                      : 'Mobile Chrome requires HTTPS for live mic. On phone, you can also tap any crop button or type in the box above!'}
                  </li>
                </ul>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
