import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  date: string;
  createdAt: number;
}

const STORAGE_KEY = 'cafe-inventory-items';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Check online status
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
      
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Load items from localStorage on mount with retry for offline scenarios
  useEffect(() => {
    const loadItems = () => {
      try {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          if (Array.isArray(parsedItems)) {
            setItems(parsedItems);
            // If we successfully loaded data, consider it a success
            return true;
          }
        }
        // No data found but no error either
        return true;
      } catch (error) {
        console.error('Failed to load inventory items:', error);
        // Return false to indicate failure
        return false;
      }
    };

    const attemptLoad = () => {
      if (loadItems()) {
        setIsLoading(false);
      } else if (isOffline) {
        // If offline and failed to load, retry after a delay
        setTimeout(attemptLoad, 1000);
      } else {
        // If online and failed, just set loading to false
        setIsLoading(false);
      }
    };

    attemptLoad();
  }, [isOffline]);

  // Save items to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save inventory items:', error);
        toast.error('Failed to save data locally. You may be in private browsing mode or storage is full.');
      }
    }
  }, [items, isLoading]);

  const addItem = (newItem: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    const item: InventoryItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...newItem,
      createdAt: Date.now(),
    };
    setItems(prevItems => [item, ...prevItems]);
    return item;
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return {
    items,
    isLoading,
    isOffline,
    addItem,
    removeItem
  };
} 