import { useEffect, useState } from 'react';

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

  // Load items from localStorage on mount
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Failed to load inventory items:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save items to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save inventory items:', error);
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
    addItem,
    removeItem
  };
} 