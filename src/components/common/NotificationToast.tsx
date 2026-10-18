import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, X, ChevronRight, BellRing } from 'lucide-react';
import type { AppNotification } from '@/services/notificationService';

export const NotificationToast = () => {
  const navigate = useNavigate();
  const [currentNotif, setCurrentNotif] = useState<AppNotification | null>(null);

  useEffect(() => {
    const handleNotification = (event: Event) => {
      const customEvent = event as CustomEvent<AppNotification>;
      if (customEvent.detail) {
        setCurrentNotif(customEvent.detail);
      }
    };

    window.addEventListener('harvestguard:notification', handleNotification);
    return () => {
      window.removeEventListener('harvestguard:notification', handleNotification);
    };
  }, []);

  useEffect(() => {
    if (!currentNotif) return;
    const timer = setTimeout(() => {
      setCurrentNotif(null);
    }, 7000); // Auto-dismiss after 7s
    return () => clearTimeout(timer);
  }, [currentNotif]);

  if (!currentNotif) return null;

  return (
    <div className="fixed top-4 left-3 right-3 z-50 max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-[#142318] text-white p-3.5 rounded-2xl shadow-2xl border-2 border-rose-500/80 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-rose-500/30 text-rose-300 border border-rose-400/40">
              <BellRing className="w-4 h-4 animate-bounce" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300 block">
                {currentNotif.severity === 'critical' ? '🚨 Immediate Bio-Security Alert' : '⚠️ Regional Outbreak Alert'}
              </span>
              <h4 className="text-xs font-extrabold text-white leading-tight">
                {currentNotif.title}
              </h4>
            </div>
          </div>

          <button
            onClick={() => setCurrentNotif(null)}
            className="p-1 text-rose-300 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-rose-100/90 leading-snug">
          {currentNotif.body}
        </p>

        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-rose-200/80">Broadcasted across Mehsana network</span>
          <button
            onClick={() => {
              setCurrentNotif(null);
              if (currentNotif.actionUrl) navigate(currentNotif.actionUrl);
            }}
            className="text-xs font-bold text-amber-300 hover:underline flex items-center space-x-0.5 bg-black/30 px-2 py-0.5 rounded-lg border border-amber-400/30"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>Open Outbreak Radar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
