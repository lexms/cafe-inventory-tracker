'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ServiceWorkerRegistration() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const router = useRouter();

  // Function to register the service worker
  const registerSW = async () => {
    if ('serviceWorker' in navigator) {
      try {
        console.log('Attempting to register service worker...');
        
        // Force unregister any existing service workers first
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('Unregistered existing service worker');
        }
        
        // Register the service worker with new options
        const reg = await navigator.serviceWorker.register('/sw.js', { 
          scope: '/',
          updateViaCache: 'none' // Ensure service worker is always fetched from network
        });
        console.log('Service Worker registered successfully with scope:', reg.scope);
        setRegistration(reg);

        // Force update check
        try {
          await reg.update();
        } catch (updateError) {
          console.warn('Service worker update check failed:', updateError);
        }

        // Check for updates when the SW is updated
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            console.log('Installing new service worker...');
            installingWorker.onstatechange = () => {
              console.log('Service worker state changed to:', installingWorker.state);
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content is available; please refresh.');
                  setIsUpdateAvailable(true);
                  toast.info(
                    'App update available! Refresh the page for the latest version.',
                    {
                      duration: 8000,
                      action: {
                        label: 'Refresh',
                        onClick: () => window.location.reload(),
                      },
                    }
                  );
                } else {
                  console.log('Content is cached for offline use.');
                  toast.success('App is ready for offline use!', {
                    duration: 3000,
                  });
                  
                  // Pre-cache critical pages for offline use
                  prefetchPages();
                }
              }
            };
          }
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Service Worker registration failed:', error);
        setRegistrationError(errorMessage);
        toast.error(`Failed to enable offline mode: ${errorMessage}`, {
          duration: 5000,
        });
      }
    } else {
      console.warn('Service workers are not supported in this browser');
      setRegistrationError('Service workers are not supported in this browser');
    }
  };

  // Function to prefetch important pages for offline use
  const prefetchPages = async () => {
    try {
      if (registration && navigator.onLine) {
        const pagesToCache = [
          '/',
          '/inventory',
          '/enter-password',
          '/fallback.html'
        ];
        
        console.log('Pre-caching pages for offline use...');
        
        // Force navigate to each page first to ensure it's properly cached by the router
        const currentPath = window.location.pathname;
        for (const page of pagesToCache) {
          if (page !== currentPath && page !== '/fallback.html') {
            try {
              // First try to navigate to each page to ensure the Next.js router caches it
              router.push(page);
              // Wait a bit for the page to load
              await new Promise(resolve => setTimeout(resolve, 300));
              console.log(`Visited ${page} for caching`);
            } catch (navError) {
              console.warn(`Navigation to ${page} failed:`, navError);
            }
          }
        }
        // Return to the original page
        if (currentPath && currentPath !== '/') {
          router.push(currentPath);
        }
        
        // Then also use fetch to cache the pages
        for (const page of pagesToCache) {
          try {
            // Fetch each page with cache busting to ensure fresh content
            const cacheBuster = `?cache=${Date.now()}`;
            const response = await fetch(`${page}${cacheBuster}`, { 
              cache: 'reload',
              credentials: 'same-origin',
              headers: {
                'Cache-Control': 'no-cache'
              }
            });
            console.log(`Pre-cached ${page} for offline use:`, response.status);
            
            // Also cache the page with URL params that might be used
            await fetch(`${page}?${Date.now()}`, { 
              cache: 'reload',
              credentials: 'same-origin',
            });
          } catch (error) {
            console.warn(`Failed to pre-cache ${page}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to pre-cache pages:', error);
    }
  };

  useEffect(() => {
    // Delay registration to ensure page loads first
    if (typeof window !== 'undefined') {
      let timeoutId: NodeJS.Timeout;
      
      // Register service worker when the page is loaded
      const register = () => {
        console.log('Page loaded, registering service worker...');
        registerSW();
      };
      
      if (document.readyState === 'complete') {
        // If page is already loaded, register immediately
        register();
      } else {
        // Wait for the page to load
        window.addEventListener('load', register);
        // Also set a fallback timeout to register anyway
        timeoutId = setTimeout(register, 5000);
        
        return () => {
          window.removeEventListener('load', register);
          clearTimeout(timeoutId);
        };
      }
    }
  }, [router]);

  // Show any registration errors in development
  if (registrationError && process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 left-4 z-50 max-w-md p-4 bg-red-50 border border-red-300 rounded text-sm text-red-700">
        <p><strong>Service Worker Error:</strong> {registrationError}</p>
      </div>
    );
  }

  return null;
} 