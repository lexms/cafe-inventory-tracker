'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordForm } from '@/components/auth/PasswordForm';
import { useAccess } from '@/lib/hooks/useAccess';
import { useOffline } from '@/lib/hooks/useOffline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EnterPasswordPage() {
  const router = useRouter();
  const { hasAccess, isLoading, checkPassword } = useAccess();
  const { isOnline } = useOffline();
  const [hasAttempted, setHasAttempted] = useState(false);

  // If already authenticated, redirect to inventory
  useEffect(() => {
    if (!isLoading && hasAccess) {
      router.push('/inventory');
    }
  }, [hasAccess, isLoading, router]);

  const handlePasswordSubmit = (password: string): boolean => {
    setHasAttempted(true);
    const isCorrect = checkPassword(password);
    
    if (isCorrect) {
      router.push('/inventory');
    }
    
    return isCorrect;
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // If already authenticated, don't render content (we're redirecting)
  if (hasAccess) {
    return null;
  }

  // Handle offline state differently if never logged in before
  if (!isOnline && !hasAttempted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
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
              Unable to Login While Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You must connect to the internet for your first login. After logging in once, you can use the app offline.
            </p>
            <Button 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Cafe Inventory Tracker</h1>
        <p className="text-gray-600 text-center mb-8">
          Enter the shared password to access the inventory system
        </p>
        {!isOnline && (
          <div className="mb-4 p-3 bg-orange-100 text-orange-800 rounded border border-orange-200 text-sm">
            You are currently offline. If you've previously logged in, you can continue using the same password.
          </div>
        )}
        <PasswordForm onSubmit={handlePasswordSubmit} />
      </div>
    </div>
  );
} 