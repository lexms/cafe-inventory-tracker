'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordForm } from '@/components/auth/PasswordForm';
import { useAccess } from '@/lib/hooks/useAccess';

export default function EnterPasswordPage() {
  const router = useRouter();
  const { hasAccess, isLoading, checkPassword } = useAccess();

  // If already authenticated, redirect to inventory
  useEffect(() => {
    if (!isLoading && hasAccess) {
      router.push('/inventory');
    }
  }, [hasAccess, isLoading, router]);

  const handlePasswordSubmit = (password: string): boolean => {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Cafe Inventory Tracker</h1>
        <p className="text-gray-600 text-center mb-8">
          Enter the shared password to access the inventory system
        </p>
        <PasswordForm onSubmit={handlePasswordSubmit} />
      </div>
    </div>
  );
} 