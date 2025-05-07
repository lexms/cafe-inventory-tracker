'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This component serves as an App Shell for offline-first functionality
// It ensures critical UI components are cached and available offline
export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Listen for online/offline events
  useEffect(() => {
    // When coming back online, refresh the page to get fresh content
    const handleOnline = () => {
      console.log('Connection restored, refreshing content...');
      router.refresh();
    };

    // Attempt to preload critical pages and assets when online
    const preloadPages = async () => {
      if (navigator.onLine) {
        console.log('Preloading critical pages for offline use...');
        
        try {
          // Preload critical paths
          const criticalPaths = ['/', '/inventory', '/enter-password'];
          
          for (const path of criticalPaths) {
            try {
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.href = path;
              document.head.appendChild(link);
              console.log(`Prefetched ${path}`);
            } catch (error) {
              console.warn(`Failed to prefetch ${path}`, error);
            }
          }
          
          // Force fetch of service worker
          fetch('/sw.js', { cache: 'reload' }).catch(err => 
            console.warn('Failed to fetch service worker', err)
          );
        } catch (error) {
          console.warn('Error preloading resources:', error);
        }
      }
    };

    window.addEventListener('online', handleOnline);
    
    // Run preloading on initial component mount
    preloadPages();
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [router]);

  return (
    <>
      {/* Hidden offline assets to ensure they're cached */}
      <div style={{ display: 'none' }} aria-hidden="true" data-testid="app-shell-assets">
        <img src="/icons/icon-192x192.png" alt="" width="1" height="1" />
        <img src="/icons/icon-512x512.png" alt="" width="1" height="1" />
      </div>
      
      {/* Main content */}
      {children}
    </>
  );
} 