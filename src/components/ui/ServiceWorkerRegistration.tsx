'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      window.addEventListener('load', function() {
        // Register the service worker
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function(error) {
            console.log('Service Worker registration failed: ', error);
          }
        );
      });
    }
  }, []);

  // This component doesn't render anything
  return null;
} 