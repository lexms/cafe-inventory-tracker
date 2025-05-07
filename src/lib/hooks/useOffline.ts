'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useOffline() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Handle cases where the page loads offline initially
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
    }

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast.success('You are back online! Your data has been synchronized.');
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast.warning('You are offline. Changes will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Try to sync any pending data when coming back online
    if (isOnline && wasOffline) {
      // Here you could implement logic to sync data with a server
      console.log('Syncing data after being offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, wasOffline]);

  return { isOnline, wasOffline };
} 