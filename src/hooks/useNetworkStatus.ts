import { useState, useEffect } from 'react';
import type { NetworkStatus } from '@/types';

export function useNetworkStatus(): {
  isOnline: boolean;
  status: NetworkStatus;
  lastChanged: Date | null;
} {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [lastChanged, setLastChanged] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastChanged(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastChanged(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    status: isOnline ? 'online' : 'offline',
    lastChanged,
  };
}
