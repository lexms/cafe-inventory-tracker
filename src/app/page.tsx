'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccess } from '@/lib/hooks/useAccess';
import { useOffline } from '@/lib/hooks/useOffline';

export default function Home() {
  const router = useRouter();
  const { hasAccess, isLoading } = useAccess();
  const { isOnline } = useOffline();

  useEffect(() => {
    if (isLoading) return;

    // First check if offline
    if (!isOnline) {
      // If offline, check if we have access stored
      if (hasAccess) {
        router.push('/inventory');
      } else {
        // When offline without access, show a message instead of redirecting
        // The OfflineFallback component will show offline status
        router.push('/enter-password');
      }
    } else {
      // Online behavior remains the same
      if (hasAccess) {
        router.push('/inventory');
      } else {
        router.push('/enter-password');
      }
    }
  }, [hasAccess, isLoading, router, isOnline]);

  // Return a loading state while we check/redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Cafe Inventory Tracker</h1>
        <div className="animate-pulse">Loading...</div>
      </div>
    </div>
  );
}
