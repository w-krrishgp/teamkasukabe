import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  Bell,
  MapPin,
  ChevronDown,
  Check,
  X,
  Compass,
  BellRing,
  Volume2,
} from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useLanguage } from '@/context/LanguageContext';
import { getFarmLocation } from '@/services/deviceService';
import {
  getNotificationHistory,
  AppNotification,
  requestPushPermission,
  broadcastOutbreakAlert,
} from '@/services/notificationService';

export const TopHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const { language, setLanguage, t } = useLanguage();

  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState({
    name: 'Kheda Farm #1, Mehsana',
    area: '5.5 Acres',
    crops: 'Wheat, Mustard, Cotton',
  });

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifList, setNotifList] = useState<AppNotification[]>(() => getNotificationHistory());

  useEffect(() => {
    const handleNewNotification = (e: Event) => {
      const customEvent = e as CustomEvent<AppNotification>;
      if (customEvent.detail) {
        setNotifList((prev) => [customEvent.detail, ...prev]);
      }
    };

    window.addEventListener('harvestguard:notification', handleNewNotification);
    return () => {
      window.removeEventListener('harvestguard:notification', handleNewNotification);
    };
  }, []);

  const unreadCount = notifList.filter((n) => !n.read).length;

  const handleTestAlertPopup = async () => {
    await broadcastOutbreakAlert({
      diseaseName: 'Yellow Rust (Puccinia striiformis)',
      crop: 'Wheat HD-2967',
      village: 'Vadu Village, Kadi',
      distanceKm: 3.8,
      severity: 'critical',
      alertRadiusKm: 10,
    });
  };

  const handleUseGps = async () => {
    setIsLocating(true);
    try {
      const coords = await getFarmLocation();
      setSelectedFarm({
        name: coords.locality,
        area: '5.5 Acres (GPS Locked)',
        crops: 'Wheat HD-2967, Mustard',
      });
      setIsFarmModalOpen(false);
    } finally {
      setIsLocating(false);
    }
  };

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
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#142318] animate-pulse">
                {unreadCount}
              </span>
            )}
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
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={() => setIsFarmModalOpen(false)}
        >
          <div
            className="w-full max-w-sm sm:max-w-md bg-white text-harvest-deep rounded-t-3xl sm:rounded-3xl p-5 pb-8 sm:pb-5 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Sheet Drag Handle */}
            <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto -mt-1 mb-2.5 sm:hidden" />

            <div className="flex items-center justify-between pb-2 border-b border-stone-200 shrink-0">
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

            <div className="flex-1 overflow-y-auto overscroll-contain py-2 space-y-2 touch-pan-y min-h-0">
              <button
                type="button"
                onClick={handleUseGps}
                disabled={isLocating}
                className="w-full p-3 rounded-2xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/60 active:scale-[0.99] transition-all flex items-center justify-between text-left text-xs font-bold text-emerald-950"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">
                      {language === 'hi' ? 'लाइव GPS स्थान उपयोग करें' : 'Locate Farm via GPS'}
                    </p>
                    <p className="text-[10px] text-emerald-800 font-normal">
                      {language === 'hi' ? 'कैपेसिटर जिओलोकेशन व उपग्रह' : 'Capacitor Geolocation with Fallback'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-extrabold">
                  {isLocating ? 'Locating...' : 'GPS Fix'}
                </span>
              </button>

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

            <div className="pt-2 text-center shrink-0">
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
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={() => setIsNotifOpen(false)}
        >
          <div
            className="w-full max-w-sm sm:max-w-md bg-white text-harvest-deep rounded-t-3xl sm:rounded-3xl p-5 pb-8 sm:pb-5 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Sheet Drag Handle */}
            <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto -mt-1 mb-2.5 sm:hidden" />

            <div className="flex items-center justify-between pb-3 border-b border-stone-200 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-harvest-pale text-harvest-primary">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-harvest-deep">{t('notifications')}</h3>
                  <span className="text-[10px] text-stone-500 font-medium">
                    {language === 'hi' ? 'खेत व मंडी के ताजा अलर्ट' : 'Farm & market live alerts'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsNotifOpen(false)}
                className="p-1.5 rounded-full text-stone-500 hover:bg-stone-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Push Status & Instant Popup Trigger Bar */}
            <div className="p-3 my-2 bg-stone-50 border border-stone-200 rounded-2xl space-y-2 shrink-0">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-stone-600 flex items-center space-x-1">
                  <BellRing className="w-3.5 h-3.5 text-harvest-primary" />
                  <span>{language === 'hi' ? 'पुश नोटिफिकेशन स्थिति:' : 'Browser Push Status:'}</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold ${
                    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'denied'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {typeof window !== 'undefined' && 'Notification' in window
                    ? Notification.permission === 'granted'
                      ? language === 'hi' ? 'सक्रिय (Active)' : 'Enabled (Active)'
                      : Notification.permission === 'denied'
                      ? language === 'hi' ? 'ब्लॉक (Blocked)' : 'Blocked by Browser'
                      : language === 'hi' ? 'अनुमति चाहिए' : 'Permission Needed'
                    : 'Unsupported'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await requestPushPermission();
                      handleTestAlertPopup();
                    }}
                    className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1"
                  >
                    <Bell className="w-3 h-3" />
                    <span>{language === 'hi' ? 'पुश अनुमति दें' : 'Allow Push'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleTestAlertPopup}
                  className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{language === 'hi' ? '⚡ पॉपअप व साउंड टेस्ट करें' : '⚡ Test Alert Popup & Sound'}</span>
                </button>
              </div>
            </div>

            {/* Scrollable Notifications Feed with Native Momentum Touch */}
            <div className="flex-1 overflow-y-auto overscroll-contain py-2.5 space-y-2.5 touch-pan-y min-h-0 pr-0.5">
              {notifList.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-4">No notifications</p>
              ) : (
                notifList.map((n, idx) => (
                  <div
                    key={`${n.id}-${idx}`}
                    onClick={() => {
                      setIsNotifOpen(false);
                      if (n.actionUrl) navigate(n.actionUrl);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer hover:border-harvest-primary transition-all space-y-1 ${
                      n.severity === 'critical'
                        ? 'bg-rose-50 border-rose-200'
                        : n.type === 'outbreak_alert'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                      <span className="truncate max-w-[200px]">{n.title}</span>
                      <span className="text-[10px] text-stone-500 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-snug line-clamp-2">{n.body}</p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 shrink-0">
              <button
                onClick={() => setIsNotifOpen(false)}
                className="w-full py-2.5 rounded-xl bg-harvest-primary text-white text-xs font-bold hover:bg-harvest-deep transition-colors shadow-xs active:scale-[0.99]"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
