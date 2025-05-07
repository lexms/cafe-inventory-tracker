'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function OfflineFallback() {
  const [isOnline, setIsOnline] = useState(true);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [hasVisitedBefore, setHasVisitedBefore] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize online status
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
      
      // Check if app is in standalone mode (installed)
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        setIsAppInstalled(true);
      }

      // Check if any inventory data exists in localStorage
      const hasCachedData = localStorage.getItem('cafe-inventory-items') !== null;
      const hasAccessData = localStorage.getItem('coffeeAccess') !== null;
      setHasVisitedBefore(hasCachedData || hasAccessData);
    }

    // Add event listeners for online/offline status changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if the app is installed (PWA)
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // If online, no need to show the offline banner
  if (isOnline) {
    return null;
  }

  // For first-time visitors who are offline (more prominent message)
  if (!hasVisitedBefore) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="60" 
            height="60" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mx-auto mb-6 text-orange-500"
          >
            <line x1="1" x2="23" y1="1" y2="23"></line>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" x2="12.01" y1="20" y2="20"></line>
          </svg>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">You're Offline</h1>
          <p className="text-lg mb-6 text-gray-600">
            This app requires an initial connection to load content. Please connect to the internet and try again.
          </p>
          <Button 
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // Regular offline notification for returning users
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-orange-500 shadow-lg bg-orange-50">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-md font-medium flex items-center text-orange-700">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <line x1="1" x2="23" y1="1" y2="23"></line>
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
              <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" x2="12.01" y1="20" y2="20"></line>
            </svg>
            Offline Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4 text-sm text-orange-600">
          <p>You are currently offline. Your changes will be saved locally and synchronized when online.</p>
          {!isAppInstalled && (
            <p className="mt-2">
              <strong>Tip:</strong> Install this app to your home screen for better offline access.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 