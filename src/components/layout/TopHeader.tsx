import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  Bell,
  MapPin,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useLanguage } from '@/context/LanguageContext';

export const TopHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const { language, setLanguage, t } = useLanguage();

  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState({
    name: 'Kheda Farm #1, Mehsana',
    area: '5.5 Acres',
    crops: 'Wheat, Mustard, Cotton',
  });

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const farms = [
    {
      id: 'f1',
      name: 'Kheda Farm #1, Mehsana',
      area: '5.5 Acres',
      crops: 'Wheat HD-2967, Mustard, Cotton',
      status: 'Active Field',
    },
    {
      id: 'f2',
      name: 'Patan North Plot #2',
      area: '2.8 Acres',
      crops: 'Cumin (Jeera), Castor',
      status: 'Fallow / Prepared',
    },
  ];

  return (
    <header className="w-full bg-[#142318] text-white pt-safe border-b border-harvest-border/20 shadow-md">
      {/* Top Branding & Main Controls */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-harvest-primary to-harvest-sage flex items-center justify-center shadow-md shadow-black/30 group-active:scale-95 transition-transform">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-white leading-none">
                Harvest<span className="text-harvest-mint">Guard</span>
              </span>
              <span className="text-[10px] bg-harvest-primary/90 text-harvest-pale px-1.5 py-0.5 rounded font-semibold tracking-wider uppercase border border-harvest-sage/30">
                Kisan
              </span>
            </div>
            <p className="text-[10px] text-harvest-pale/80 font-normal mt-0.5">
              {t('appSubname')}
            </p>
          </div>
        </button>

        {/* Right Controls: Language Selector & Notifications */}
        <div className="flex items-center space-x-2">
          {/* Prominent Bilingual Language Toggle */}
          <div className="inline-flex p-0.5 rounded-lg bg-black/30 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                language === 'en'
                  ? 'bg-harvest-primary text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                language === 'hi'
                  ? 'bg-harvest-primary text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => setIsNotifOpen(true)}
            title={t('notifications')}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white relative transition-all border border-white/10"
          >
            <Bell className="w-4 h-4 text-harvest-pale" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#142318]">
              2
            </span>
          </button>
        </div>
      </div>

      {/* Row 2: Selected Farm Selector & Live Sync Tag */}
      <div className="px-4 py-2 bg-[#0d1710] border-t border-white/5 flex items-center justify-between text-xs">
        {/* Farm Switcher Pill */}
        <button
          onClick={() => setIsFarmModalOpen(true)}
          className="flex items-center space-x-1.5 text-harvest-pale hover:text-white transition-colors max-w-[70%] group text-left"
        >
          <MapPin className="w-3.5 h-3.5 text-harvest-mint shrink-0" />
          <span className="font-semibold text-xs truncate">{selectedFarm.name}</span>
          <ChevronDown className="w-3.5 h-3.5 text-harvest-pale/70 shrink-0 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Connectivity / Demo Indicator */}
        <div className="flex items-center space-x-1 text-[11px] text-harvest-pale/80 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-medium">{isOnline ? t('online') : t('offline')}</span>
        </div>
      </div>

      {/* Farm Switcher Modal / Sheet */}
      {isFarmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white text-harvest-deep rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div>
                <h3 className="text-sm font-bold text-harvest-deep">
                  {language === 'hi' ? 'अपना खेत चुनें' : 'Select Registered Farm'}
                </h3>
                <p className="text-xs text-harvest-muted">
                  {language === 'hi' ? 'सक्रिय भूमि रिकॉर्ड और सेंसर डेटा' : 'Active land records and sensor telemetry'}
                </p>
              </div>
              <button
                onClick={() => setIsFarmModalOpen(false)}
                className="p-1 rounded-lg text-harvest-muted hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {farms.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    setSelectedFarm({
                      name: f.name,
                      area: f.area,
                      crops: f.crops,
                    });
                    setIsFarmModalOpen(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedFarm.name === f.name
                      ? 'border-harvest-primary bg-harvest-pale/30 ring-1 ring-harvest-primary'
                      : 'border-harvest-border hover:bg-harvest-warm/50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-harvest-deep">{f.name}</p>
                      <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded font-medium">
                        {f.area}
                      </span>
                    </div>
                    <p className="text-[11px] text-harvest-muted">{f.crops}</p>
                  </div>
                  {selectedFarm.name === f.name && (
                    <Check className="w-4 h-4 text-harvest-primary shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsFarmModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-harvest-warm text-harvest-deep text-xs font-semibold hover:bg-stone-200 transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white text-harvest-deep rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-harvest-primary" />
                <h3 className="text-sm font-bold text-harvest-deep">{t('notifications')}</h3>
              </div>
              <button
                onClick={() => setIsNotifOpen(false)}
                className="p-1 rounded-lg text-harvest-muted hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Yellow Rust Alert (4 km away)</span>
                  <span className="text-[10px] text-amber-700">1h ago</span>
                </div>
                <p className="text-xs text-amber-800">
                  {language === 'hi'
                    ? 'पड़ोस के 3 खेतों में गेहूं के पीले रतुए के लक्षण दिखे हैं। तुरंत जांच करें।'
                    : 'Preventive foliar spray recommended for HD-2967 wheat tillering.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>Mandi Price Hike (+₹80/Qtl)</span>
                  <span className="text-[10px] text-emerald-700">3h ago</span>
                </div>
                <p className="text-xs text-emerald-800">
                  {language === 'hi'
                    ? 'ऊंझा मंडी में गेहूं का भाव बढ़कर ₹2,680 प्रति क्विंटल पहुंचा।'
                    : 'Unjha APMC wheat modal rate touched ₹2,680 / Quintal with high miller demand.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsNotifOpen(false)}
              className="w-full py-2.5 rounded-xl bg-harvest-primary text-white text-xs font-semibold hover:bg-harvest-primary/90 transition-colors"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
