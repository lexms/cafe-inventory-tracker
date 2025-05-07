'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InventoryForm } from '@/components/inventory/InventoryForm';
import { InventoryList } from '@/components/inventory/InventoryList';
import { useAccess } from '@/lib/hooks/useAccess';
import { useInventory } from '@/lib/hooks/useInventory';

export default function InventoryPage() {
  const router = useRouter();
  const { hasAccess, isLoading, logout } = useAccess();
  const { items, addItem, removeItem, isLoading: isLoadingInventory } = useInventory();

  // If not authenticated, redirect to enter password
  useEffect(() => {
    if (!isLoading && !hasAccess) {
      router.push('/enter-password');
    }
  }, [hasAccess, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/enter-password');
  };

  // Show loading while checking authentication
  if (isLoading || isLoadingInventory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // If not authenticated, don't render content (we're redirecting)
  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Cafe Inventory Tracker</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <InventoryForm onSubmit={addItem} />
        <InventoryList items={items} onRemove={removeItem} />
      </main>

      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-2xl mx-auto p-4 text-center text-sm text-gray-500">
          <p>Offline-first inventory tracker for church coffee team</p>
        </div>
      </footer>
    </div>
  );
} 