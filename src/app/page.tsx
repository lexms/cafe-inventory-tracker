'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccess } from '@/lib/hooks/useAccess';

export default function Home() {
  const router = useRouter();
  const { hasAccess, isLoading } = useAccess();

  useEffect(() => {
    if (isLoading) return;

    // If user has access, redirect to inventory
    if (hasAccess) {
      router.push('/inventory');
    } else {
      // If no access, redirect to enter password
      router.push('/enter-password');
    }
  }, [hasAccess, isLoading, router]);

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
