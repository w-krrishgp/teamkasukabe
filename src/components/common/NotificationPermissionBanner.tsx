import { useState } from 'react';
import { BellRing, X, Volume2, ArrowRight } from 'lucide-react';
import { requestPushPermission, broadcastOutbreakAlert } from '@/services/notificationService';
import { useLanguage } from '@/context/LanguageContext';

export const NotificationPermissionBanner = () => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestAndTest = async () => {
    setIsRequesting(true);
    try {
      const res = await requestPushPermission();
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPermission(Notification.permission);
      }

      // Broadcast across all connected phones and laptops
      await broadcastOutbreakAlert({
        diseaseName: 'Yellow Rust (Puccinia striiformis)',
        crop: 'Wheat HD-2967',
        village: 'Vadu Village, Kadi',
        distanceKm: 3.8,
        severity: 'critical',
        alertRadiusKm: 10,
      });

      if (res.granted) {
        setTimeout(() => setIsDismissed(true), 4000);
      }
    } finally {
      setIsRequesting(false);
    }
  };

  // If dismissed or unsupported or already granted and dismissed, don't show the large banner
  if (isDismissed || permission === 'unsupported') {
    return null;
  }

  // If already granted, show a quick verification strip or hide
  if (permission === 'granted') {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Notification Permission Request"
      className="mx-3 mt-2 mb-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-emerald-500/15 border-2 border-amber-400/80 shadow-md backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <BellRing className="w-4 h-4 animate-bounce" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                {permission === 'denied' ? 'Browser Blocked' : 'Action Required'}
              </span>
              <h3 className="text-xs font-black text-harvest-deep">
                {isHi ? 'खेत सुरक्षा: पुश नोटिफिकेशन अनुमति' : 'Farm Defense: Enable Real-Time Outbreak Popups'}
              </h3>
            </div>

            <p className="text-[11px] text-stone-700 leading-snug">
              {permission === 'denied'
                ? isHi
                  ? 'ब्राउज़र ने सूचनाएं ब्लॉक की हैं। URL बार में 🔒 आइकन दबाकर "Allow" करें।'
                  : 'Notifications are blocked in your browser address bar. Click the 🔒 lock icon to set Notifications to "Allow".'
                : isHi
                ? '10 किमी के भीतर फसल रोग (रतुआ, झुलसा) व बेमौसम बारिश के तत्काल ऑडियो सायरन व पॉपअप अलर्ट पाएं।'
                : 'Get instant sound chimes and screen popups when crop disease or heavy rain is reported within 10 km.'}
            </p>

            <div className="flex items-center space-x-2 pt-1 flex-wrap gap-y-1.5">
              <button
                type="button"
                onClick={handleRequestAndTest}
                disabled={isRequesting}
                className="px-3 py-1.5 rounded-xl bg-harvest-primary text-white text-xs font-bold hover:bg-harvest-deep active:scale-95 transition-all shadow-xs flex items-center space-x-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  {isRequesting
                    ? isHi ? 'सक्षम कर रहे हैं...' : 'Requesting...'
                    : permission === 'denied'
                    ? isHi ? 'इन-ऐप अलर्ट टेस्ट करें' : 'Test In-App Popup Anyway'
                    : isHi ? 'सूचनाएं चालू करें व टेस्ट देखें' : 'Allow & Test Alert Popup'}
                </span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="px-2.5 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-black/5 text-[11px] font-medium transition-colors"
              >
                {isHi ? 'बाद में पूछें' : 'Ask Later'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-lg text-stone-500 hover:bg-black/5 hover:text-stone-800 shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
