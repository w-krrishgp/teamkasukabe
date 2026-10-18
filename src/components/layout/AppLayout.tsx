import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { MobileShell } from './MobileShell';
import { OfflineNotice } from '@/components/common/ErrorState';
import { NotificationToast } from '@/components/common/NotificationToast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export const AppLayout: React.FC = () => {
  const { isOnline } = useNetworkStatus();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Automatically scroll main content back to top when switching pages/tabs
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <MobileShell>
      {/* Floating Outbreak Alert Notifications */}
      <NotificationToast />

      {/* 1. Fixed Top App Bar */}
      <div className="shrink-0 z-50 w-full relative">
        <TopHeader />
        {!isOnline && <OfflineNotice />}
      </div>

      {/* 2. The ONLY Scrollable Content Area */}
      <main
        ref={mainRef}
        id="app-main-content"
        className="flex-1 w-full overflow-y-auto overscroll-contain px-4 py-3 space-y-4 focus:outline-none"
      >
        <Outlet />
      </main>

      {/* 3. Fixed Bottom Navigation Bar */}
      <div className="shrink-0 z-30 w-full relative">
        <BottomNav />
      </div>
    </MobileShell>
  );
};
